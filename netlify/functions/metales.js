/* ───────────────────────────────────────────────────────────────
   Preto by Dala&Co · DALA FUNDIÇÃO — precio del metal EN VIVO
   ───────────────────────────────────────────────────────────────
   La página "La Fundición" (fundicion.html) llama a esta función para
   mostrar el valor del metal en tiempo real, contra el precio
   INTERNACIONAL del oro, el platino y la plata, convertido a COP/gramo.

       fetch('/.netlify/functions/metales')  →  JSON con COP por gramo

   ── Cómo ponerlo EN VIVO ────────────────────────────────────────
   1. Crea una cuenta en  https://www.goldapi.io  (plan gratuito).
   2. En Netlify → Site settings → Environment variables, añade:
        GOLDAPI_KEY = goldapi-xxxxxxxxxxxxx
   3. Publica. Listo: la función pedirá XAU/COP, XPT/COP y XAG/COP,
      los cacheará 15 min y la web mostrará "precio internacional · en vivo".

   Sin la clave (o si la API falla) la función NO se cae: responde con
   el PRECIO DE REFERENCIA de abajo y marca  source:"referencia"  para
   que la web avise que es un valor aproximado. Edita esos números
   cuando quieras un referente más cercano al oro del día.
   ─────────────────────────────────────────────────────────────── */

const GOLDAPI_KEY = process.env.GOLDAPI_KEY || '';

/* ── PRECIO DE REFERENCIA (COP por gramo) · EDITAR AQUÍ ──────────
   Se usa solo cuando no hay clave o la API no responde.            */
const REFERENCIA = {
  oro24k:  445391,   // oro puro .999   (24k) — COP por gramo
  oro18k:  334044,   // oro .750        (18k) = oro24k × 0.75
  platino: 177889,   // platino .999    — COP por gramo puro
  plata:    6643,    // plata .999      — COP por gramo puro
  cobre:      42,    // cobre           — COP por gramo (temple, valor simbólico)
  cop_usd:  4150,    // referencia informativa
};

/* Purezas (fracción de metal fino) de cada material de la casa. */
const PUREZA = {
  choco:    0.750,   // Oro de Chocó · ley 750 (18k)
  amarillo: 0.750,   // Oro 18k amarillo (Dala&Co)
  blanco:   0.750,   // Oro blanco 18k
  rosa:     0.750,   // Oro rosa 18k
  platino:  0.950,   // Platino .950
  plata:    0.925,   // Plata ley 925
};

/* Caché en memoria del contenedor (persiste entre invocaciones
   "calientes"). Evita golpear la API en cada visita. */
let CACHE = { at: 0, body: null };
const TTL_MS = 15 * 60 * 1000; // 15 minutos

async function goldapi(symbol) {
  // symbol: 'XAU' | 'XPT' | 'XAG' — precio en COP
  const res = await fetch('https://www.goldapi.io/api/' + symbol + '/COP', {
    headers: { 'x-access-token': GOLDAPI_KEY, 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error(symbol + ' ' + res.status);
  return res.json();
}

/* Solo la web de la casa consume esta función. Sin esto, otro sitio
   podía incrustarla y gastar la cuota de GoldAPI (y con ella el precio
   en vivo se cae a "referencia"). El GET propio no manda Origin, así
   que solo se rechaza un Origin ajeno. */
function originAllowed(origin) {
  if (!origin) return true;
  return origin === 'https://pretogold.store' ||
         origin === 'https://www.pretogold.store' ||
         /^https:\/\/[a-z0-9-]+(--[a-z0-9-]+)?\.netlify\.app$/i.test(origin) ||
         /^http:\/\/localhost(:\d+)?$/.test(origin);
}
const RATE = { windowStart: 0, count: 0 };
function rateLimited() {
  const now = Date.now();
  if (now - RATE.windowStart > 10 * 60 * 1000) { RATE.windowStart = now; RATE.count = 0; }
  RATE.count++;
  return RATE.count > 400;
}

exports.handler = async function (event) {
  const origin = (event && event.headers && (event.headers.origin || event.headers.Origin)) || '';
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'public, max-age=900',
    'Access-Control-Allow-Origin': origin && originAllowed(origin) ? origin : 'https://pretogold.store',
  };

  if (!originAllowed(origin)) {
    return { statusCode: 403, headers, body: JSON.stringify({ error: 'origen no permitido' }) };
  }
  // Ráfaga anormal: se responde el precio de referencia sin tocar la API.
  if (rateLimited()) {
    return { statusCode: 200, headers, body: JSON.stringify(buildRef('rate-limited')) };
  }

  // 1) Caché fresca
  if (CACHE.body && (Date.now() - CACHE.at) < TTL_MS) {
    return { statusCode: 200, headers, body: JSON.stringify(CACHE.body) };
  }

  // 2) Sin clave → referencia (no es un error, es el modo por defecto)
  if (!GOLDAPI_KEY) {
    return { statusCode: 200, headers, body: JSON.stringify(buildRef('sin-clave')) };
  }

  // 3) Precio en vivo
  try {
    const [xau, xpt, xag] = await Promise.all([
      goldapi('XAU'), goldapi('XPT'), goldapi('XAG'),
    ]);

    // goldapi devuelve price_gram_24k / price_gram_18k ya en COP.
    const oro24k  = num(xau.price_gram_24k);
    const oro18k  = num(xau.price_gram_18k) || (oro24k * 0.75);
    const ptPuro  = num(xpt.price_gram_24k);
    const agPuro  = num(xag.price_gram_24k);

    const gramo = {
      oro24k:   round(oro24k),
      choco:    round(oro18k),
      amarillo: round(oro18k),
      blanco:   round(oro18k),
      rosa:     round(oro18k),
      platino:  round(ptPuro * PUREZA.platino),
      plata:    round(agPuro * PUREZA.plata),
      cobre:    REFERENCIA.cobre,
    };

    const body = {
      source: 'goldapi',
      live: true,
      updatedAt: new Date().toISOString(),
      moneda: 'COP',
      pureza: PUREZA,
      // COP por gramo YA aplicada la pureza de cada material:
      gramo,
      referencia: { oro24k: round(oro24k), oro18k: round(oro18k) },
    };
    CACHE = { at: Date.now(), body };
    return { statusCode: 200, headers, body: JSON.stringify(body) };
  } catch (err) {
    // 4) Falló la API → referencia, sin romper la web
    return { statusCode: 200, headers, body: JSON.stringify(buildRef('error:' + err.message)) };
  }
};

function buildRef(motivo) {
  return {
    source: 'referencia',
    live: false,
    motivo: motivo,
    updatedAt: new Date().toISOString(),
    moneda: 'COP',
    pureza: PUREZA,
    gramo: {
      oro24k:   REFERENCIA.oro24k,
      choco:    REFERENCIA.oro18k,
      amarillo: REFERENCIA.oro18k,
      blanco:   REFERENCIA.oro18k,
      rosa:     REFERENCIA.oro18k,
      platino:  round(REFERENCIA.platino * PUREZA.platino),
      plata:    round(REFERENCIA.plata * PUREZA.plata),
      cobre:    REFERENCIA.cobre,
    },
    referencia: { oro24k: REFERENCIA.oro24k, oro18k: REFERENCIA.oro18k },
  };
}

function num(v) { const n = Number(v); return isFinite(n) ? n : 0; }
function round(n) { return Math.round(num(n)); }
