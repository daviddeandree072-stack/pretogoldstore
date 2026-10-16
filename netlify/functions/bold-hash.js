/* ───────────────────────────────────────────────────────────────
   Preto by Dala&Co · Bold — Firma de integridad del botón de pagos
   ───────────────────────────────────────────────────────────────
   ⚠️  REGLA DE ORO: el navegador NUNCA decide cuánto se cobra.

   Antes esta función firmaba el monto que le mandaba la web. Cualquiera
   podía abrir la consola del navegador, pedir una firma por $1.000 y
   pagar mil pesos por una cadena de veintiocho millones — con una firma
   perfectamente válida, porque la hacíamos nosotros mismos.

   Ahora la web manda las PIEZAS (referencias), no el precio. El servidor
   busca cada precio en precios.js (la misma lista de la tienda), suma el
   seguro, aplica la cortesía si corresponde y firma SU PROPIO total.
   Si el total que muestra la pantalla no coincide con el del servidor,
   no se cobra nada: se responde 409 y la web se recarga.

     POST /.netlify/functions/bold-hash
     body: {
       orderId,                                  // PRETO-…
       items: [{ id, size, qty, price }],         // price solo para GIFT-CARD
       cortesia: 'MAISON…' | '',
       amount: '10800000'                        // lo que ve el cliente (se compara)
     }
     → { hash, apiKey, amount }   ó   409 { error, amount }

   Variables de entorno (Netlify → Environment variables):
     BOLD_SECRET_KEY   → Llave secreta de Bold (Integraciones → Llaves)
     BOLD_IDENTITY_KEY → Llave de identidad (es pública: va en el botón)
   ─────────────────────────────────────────────────────────────── */
const crypto = require('crypto');

/* Un solo origen de precios: el mismo archivo que lee la tienda.
   esbuild lo empaqueta dentro de la función al desplegar. */
const { PRICES, SIZE_PRICES } = require('../../precios.js');

const SECRET   = process.env.BOLD_SECRET_KEY;
const IDENTITY = process.env.BOLD_IDENTITY_KEY;

/* ── Firebase Admin (solo para comprobar la cortesía) ─────────────
   Misma variable FIREBASE_SERVICE_ACCOUNT que usa el webhook. Si no
   está configurada, el cobro sigue funcionando: la cortesía queda
   acotada como antes (valor fijo y mínimo de compra), sin comprobar
   de quién es. Nunca bloqueamos una venta por esto. */
let adminDb = null;
function getDb() {
  if (adminDb) return adminDb;
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) return null;
  try {
    const admin = require('firebase-admin');
    if (!admin.apps.length) {
      const cred = JSON.parse(raw);
      if (cred.private_key) cred.private_key = cred.private_key.replace(/\\n/g, '\n');
      admin.initializeApp({ credential: admin.credential.cert(cred) });
    }
    adminDb = admin.firestore();
    return adminDb;
  } catch (e) {
    console.error('bold-hash: Firebase Admin no disponible:', e.message);
    return null;
  }
}

const normCode = s => String(s || '').trim().toUpperCase().replace(/\s+/g, '');

/* ¿La cortesía es de esta persona, sigue vigente y no se ha usado?
   Se comprueba contra Firestore (customers), no contra el navegador.
   Devuelve 'ok' | 'usada' | 'invalida' | 'sin-verificar'. */
async function estadoCortesia(email, code) {
  const db = getDb();
  if (!db) return 'sin-verificar';        // sin acceso: no bloqueamos la venta
  const mail = String(email || '').trim().toLowerCase();
  const codigo = normCode(code);
  if (!mail || !codigo) return 'invalida';
  try {
    const snap = await db.collection('customers').where('email', '==', mail).limit(5).get();
    if (snap.empty) return 'invalida';
    for (const doc of snap.docs) {
      const c = doc.data() || {};
      if (normCode(c.welcomeCode) !== codigo) continue;
      if (c.welcomeRedeemed) return 'usada';
      const creado = new Date(c.createdAt || c.welcomeCreatedAt || 0).getTime();
      if (creado && creado > Date.now() + 86400000) return 'invalida';   // alta "en el futuro": manipulada
      if (creado && (Date.now() - creado) / 86400000 > CORTESIA.days) return 'usada';
      return 'ok';
    }
    return 'invalida';
  } catch (e) {
    console.error('bold-hash: error comprobando cortesía:', e.message);
    return 'sin-verificar';
  }
}

/* Mismas reglas que facturacion.html. Si cambias una, cambia las dos. */
const INSURANCE_RATE = 0.08;
const CORTESIA       = { amount: 150000, min: 2300000, days: 30 };
const GIFT_ID        = 'GIFT-CARD';
const GIFT_MIN       = 100000;
const GIFT_MAX       = 20000000;
const MAX_QTY        = 10;
const MAX_ITEMS      = 40;

/* Solo la tienda puede pedir firmas. No es la defensa principal
   (el cálculo del monto lo es), pero corta las páginas clonadas. */
const ORIGEN_OK = /^https?:\/\/(([a-z0-9-]+\.)*pretogold\.store|([a-z0-9-]+--)?[a-z0-9-]+\.netlify\.app|localhost(:\d+)?|127\.0\.0\.1(:\d+)?)$/i;

/* Límite de firmas por instancia: una tienda real firma una vez por
   compra. Cien en diez minutos ya es un robot probando montos. */
const { limiter } = require('../seguridad.js');
const limite = limiter({ max: 100, minutes: 10 });

function cors(origin) {
  return {
    'Access-Control-Allow-Origin': origin && ORIGEN_OK.test(origin) ? origin : 'https://pretogold.store',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json'
  };
}

/* Precio de una pieza según NUESTRA lista. null = bajo cotización:
   esa pieza no se cobra en línea, se coordina con el concierge. */
function precioDe(item) {
  const id = String(item && item.id || '').trim();
  if (!id) return null;

  // La tarjeta de regalo vale lo que el cliente elige (paga exactamente
  // lo que recibe), pero acotada para que no entren montos absurdos.
  if (id === GIFT_ID) {
    const p = Math.round(Number(item.price) || 0);
    return (p >= GIFT_MIN && p <= GIFT_MAX) ? p : null;
  }

  const size = String(item.size || '').trim();
  const porMedida = SIZE_PRICES && SIZE_PRICES[id];
  if (porMedida && size && porMedida[size] != null) return Math.round(porMedida[size]);
  if (PRICES && PRICES[id] != null) return Math.round(PRICES[id]);
  return null;
}

function calcular(items) {
  let subtotal = 0, asegurable = 0;

  for (const it of items) {
    const precio = precioDe(it);
    if (precio == null) {
      return { error: 'Hay una pieza sin precio publicado (' + String(it && it.id || '?') + '). Se coordina con el Atelier.' };
    }
    let qty = Math.round(Number(it.qty) || 1);
    if (qty < 1) qty = 1;
    if (qty > MAX_QTY) qty = MAX_QTY;

    const linea = precio * qty;
    subtotal += linea;
    if (String(it.id).trim() !== GIFT_ID) asegurable += linea;  // la digital no se asegura
  }

  return { subtotal, seguro: Math.round(asegurable * INSURANCE_RATE) };
}

exports.handler = async (event) => {
  const origin  = event.headers && (event.headers.origin || event.headers.Origin) || '';
  const headers = cors(origin);

  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Método no permitido' }) };

  if (origin && !ORIGEN_OK.test(origin)) {
    console.warn('bold-hash: origen no autorizado →', origin);
    return { statusCode: 403, headers, body: JSON.stringify({ error: 'Origen no autorizado' }) };
  }
  if (limite()) {
    console.warn('bold-hash: límite de firmas alcanzado.');
    return { statusCode: 429, headers, body: JSON.stringify({ error: 'Demasiadas solicitudes. Intente en un momento.' }) };
  }
  if (!SECRET) {
    console.error('Falta BOLD_SECRET_KEY en Netlify.');
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'BOLD_SECRET_KEY no configurada' }) };
  }
  if (!PRICES || !Object.keys(PRICES).length) {
    console.error('bold-hash: no se pudo leer la lista de precios.');
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Lista de precios no disponible' }) };
  }

  let data = {};
  try { data = JSON.parse(event.body || '{}'); }
  catch (e) { return { statusCode: 400, headers, body: JSON.stringify({ error: 'Cuerpo inválido' }) }; }

  const orderId  = String(data.orderId || '').trim();
  const currency = String(data.currency || 'COP').trim().toUpperCase();
  const items    = Array.isArray(data.items) ? data.items.slice(0, MAX_ITEMS) : [];

  if (!/^PRETO-\d{10,16}-[A-Z0-9]{2,8}$/.test(orderId)) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Referencia inválida' }) };
  }
  if (currency !== 'COP') {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Moneda no soportada' }) };
  }
  if (!items.length) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'El pedido no trae piezas' }) };
  }

  const T = calcular(items);
  if (T.error) return { statusCode: 422, headers, body: JSON.stringify({ error: T.error }) };

  /* ── Cortesía de bienvenida ────────────────────────────────
     Se comprueba contra la cuenta del cliente en Firestore, no contra
     su navegador: así el mismo código no sirve dos veces aunque borre
     los datos del navegador o entre desde otro teléfono. */
  const codigo = String(data.cortesia || '').trim();
  let descuento = 0, cortesiaRechazada = null;

  if (codigo && T.subtotal >= CORTESIA.min) {
    const estado = await estadoCortesia(data.email, codigo);
    if (estado === 'ok' || estado === 'sin-verificar') descuento = CORTESIA.amount;
    else cortesiaRechazada = estado;   // 'usada' | 'invalida'
  } else if (codigo) {
    cortesiaRechazada = 'minimo';      // no llega al mínimo de compra
  }

  const total = Math.max(0, T.subtotal + T.seguro - descuento);

  if (total < 1000) {
    return { statusCode: 422, headers, body: JSON.stringify({ error: 'Total insuficiente para cobro en línea' }) };
  }

  /* La cortesía no era válida: no firmamos con descuento. Le decimos a
     la web para que la quite y muestre el total real — sin recargar,
     así el cliente solo tiene que volver a pulsar. */
  if (cortesiaRechazada) {
    return {
      statusCode: 409, headers,
      body: JSON.stringify({
        error: cortesiaRechazada === 'minimo'
          ? 'La cortesía aplica en adquisiciones desde $2.300.000.'
          : (cortesiaRechazada === 'usada'
            ? 'Esta cortesía ya fue utilizada.'
            : 'El código de cortesía no corresponde a esta cuenta.'),
        amount: String(total),
        cortesia_invalida: true
      })
    };
  }

  /* El monto que ve el cliente debe coincidir con el nuestro. Si no,
     alguien lo manipuló o la web tiene precios viejos en caché: no se
     firma nada y la web se recarga con el valor correcto. */
  const declarado = String(data.amount || '').trim();
  if (declarado && declarado !== String(total)) {
    console.warn('bold-hash: monto declarado', declarado, '≠ calculado', total, '· ref', orderId);
    return { statusCode: 409, headers, body: JSON.stringify({ error: 'El total no coincide con la lista de precios', amount: String(total) }) };
  }

  const amount = String(total);

  // Orden EXACTO exigido por Bold: orderId + amount + currency + secret
  const hash = crypto.createHash('sha256')
    .update(`${orderId}${amount}${currency}${SECRET}`)
    .digest('hex');

  return { statusCode: 200, headers, body: JSON.stringify({ hash, apiKey: IDENTITY || '', amount }) };
};
