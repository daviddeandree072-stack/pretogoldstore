/* ───────────────────────────────────────────────────────────────
   Preto by Dala&Co · Bold — Webhook de confirmación de pago
   ───────────────────────────────────────────────────────────────
   Bold llama esta función SOLA cada vez que cambia el estado de una
   transacción (pago aprobado, rechazado, etc.). Aquí:
     1) Verificamos que el aviso sea REAL de Bold (firma HMAC-SHA256).
     2) Respondemos 200 de inmediato (Bold exige < 2 s).
     3) Si el pago fue APROBADO → te enviamos un correo
        "PAGO CONFIRMADO" con Resend (a STORE_EMAIL) con los datos del
        cliente y un botón para escribirle por WhatsApp y reconfirmar.

   Registrar esta URL en Bold → Panel de Comercios → Integraciones →
   Webhook:
     https://pretogold.store/.netlify/functions/bold-webhook

   Variables de entorno (Netlify → Environment variables):
     BOLD_SECRET_KEY → Llave secreta de Bold (para verificar la firma)
     RESEND_API_KEY  → ya configurada (para el correo de aviso)
     FROM_EMAIL      → ya configurada
     STORE_EMAIL     → ya configurada (a donde llega el aviso)
   ─────────────────────────────────────────────────────────────── */
const crypto = require('crypto');

const SECRET         = process.env.BOLD_SECRET_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL     = process.env.FROM_EMAIL  || 'Preto by Dala&Co <onboarding@resend.dev>';
const STORE_EMAIL    = process.env.STORE_EMAIL || 'pretobydalaco@gmail.com';

/* ── Firebase Admin (para marcar el pedido pagado automáticamente) ──
   Necesita la variable FIREBASE_SERVICE_ACCOUNT en Netlify con el JSON
   completo de la cuenta de servicio (Firebase Console → Configuración
   del proyecto → Cuentas de servicio → Generar nueva clave privada).
   Si no está, el webhook igual te avisa por correo (solo no marca
   pagado automáticamente). */
let adminDb = null;
function getDb() {
  if (adminDb) return adminDb;
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) { console.warn('Sin FIREBASE_SERVICE_ACCOUNT: no se marca pagado en Firebase.'); return null; }
  try {
    const admin = require('firebase-admin');
    if (!admin.apps.length) {
      const cred = JSON.parse(raw);
      // Las claves privadas en variables de entorno suelen traer \n escapados
      if (cred.private_key) cred.private_key = cred.private_key.replace(/\\n/g, '\n');
      admin.initializeApp({ credential: admin.credential.cert(cred) });
    }
    adminDb = admin.firestore();
    return adminDb;
  } catch (e) {
    console.error('Error iniciando Firebase Admin:', e.message);
    return null;
  }
}

/* Marca el pedido como pagado en la colección orders (doc id = referencia).
   Devuelve los datos del pedido para poder armar un aviso útil (quién
   pidió, qué pidió y su WhatsApp), o null si no se pudo leer.

   ⚠️  VERIFICACIÓN DE MONTO (interna, nunca visible al cliente)
   Bold nos dice cuánto pagaron. Antes de dar el pedido por pagado,
   comparamos ese valor contra el total guardado del pedido. Si no
   coinciden — alguien manipuló la lista de piezas que se mandó a
   firmar, o el carrito cambió a mitad del proceso — el pedido NO se
   marca pagado: queda con la bandera pago_revisar y te avisamos solo
   a ti por correo. El cliente no ve nada distinto.

   OJO con el estado: el pago NO significa que el cliente ya reconfirmó.
   En el flujo por encargo falta que valide medida y detalles por
   WhatsApp, así que el pedido queda pagado pero en 'creado'. Si ya
   venía más avanzado (lo movimos a mano en el panel) no lo retrocedemos. */
async function marcarPagado(reference, info) {
  if (!reference) { console.warn('Webhook sin referencia: no se puede marcar pagado.'); return { ok: false, order: null }; }
  const db = getDb();
  if (!db) return { ok: false, order: null };
  try {
    const ref = db.collection('orders').doc(String(reference));
    const snap = await ref.get();
    const order = snap.exists ? snap.data() : null;
    const previo = order && order.status ? String(order.status) : '';
    const yaAvanzado = ['confirmado', 'taller', 'enviado', 'entregado'].indexOf(previo) !== -1;

    /* ── Comparación de montos ────────────────────────────────
       Solo comparamos cuando tenemos dos números de verdad. Si Bold no
       manda el monto o el pedido no trae total, no podemos verificar:
       se marca pagado igual (comportamiento de siempre) pero queda
       registrado que no se pudo comprobar. */
    const pagado   = Number(String(info.amount == null ? '' : info.amount).replace(/[^\d.-]/g, ''));
    const esperado = Number(order && order.total);
    const comparable = isFinite(pagado) && pagado > 0 && isFinite(esperado) && esperado > 0;
    const coincide = comparable ? Math.abs(pagado - esperado) <= 1 : null;

    if (comparable && !coincide) {
      // Pagó un valor distinto al del pedido: no se da por pagado.
      console.warn('Webhook Bold: monto pagado', pagado, '≠ total del pedido', esperado, '· ref', reference);
      await ref.set({
        pago_revisar: true,
        pago_revisar_motivo: 'El monto pagado en Bold no coincide con el total del pedido.',
        monto_verificado: false,
        bold_amount: pagado,
        bold_transaction_id: info.txId || '',
        bold_status: info.status || '',
        metodo_pago: 'Bold (en línea) · revisar monto',
        boldAt: new Date().toISOString()
      }, { merge: true });
      return { ok: true, order: order, montoOk: false, pagado: pagado, esperado: esperado };
    }

    const patch = {
      paid: true,
      paidAt: new Date().toISOString(),
      metodo_pago: 'Bold (en línea)',
      bold_transaction_id: info.txId || '',
      bold_status: info.status || '',
      bold_amount: isFinite(pagado) && pagado > 0 ? pagado : null,
      monto_verificado: !!coincide,
      pago_revisar: false
    };
    if (!yaAvanzado) patch.status = 'creado';
    await ref.set(patch, { merge: true });
    return { ok: true, order: order, montoOk: coincide, pagado: pagado, esperado: esperado };
  } catch (e) {
    console.error('Error marcando pagado en Firebase:', e.message);
    return { ok: false, order: null };
  }
}

/* Cancela la cortesía de bienvenida DESDE EL SERVIDOR una vez el pago
   está confirmado. Antes solo se marcaba en el navegador del cliente,
   así que el mismo código volvía a funcionar borrando los datos del
   navegador o entrando desde otro teléfono. Ahora queda usada en la
   cuenta, sin importar el dispositivo. */
async function marcarCortesiaUsada(order) {
  const codigo = order && String(order.codigo_cortesia || '').trim();
  const mail   = order && String(order.email || '').trim().toLowerCase();
  if (!codigo || !mail) return;
  const db = getDb();
  if (!db) return;
  const norm = s => String(s || '').trim().toUpperCase().replace(/\s+/g, '');
  try {
    const snap = await db.collection('customers').where('email', '==', mail).limit(5).get();
    for (const doc of snap.docs) {
      const c = doc.data() || {};
      if (norm(c.welcomeCode) !== norm(codigo) || c.welcomeRedeemed) continue;
      await doc.ref.set({
        welcomeRedeemed: true,
        welcomeRedeemedAt: new Date().toISOString()
      }, { merge: true });
      console.log('Cortesía marcada como usada:', codigo, '·', mail);
      return;
    }
  } catch (e) {
    console.error('Error marcando la cortesía como usada:', e.message);
  }
}

const GOLD = '#967434', INK = '#141414';
function fmtCOP(n) {
  const v = Number(n);
  if (!isFinite(v)) return String(n);
  try { return '$' + Math.round(v).toLocaleString('es-CO'); } catch (e) { return '$' + Math.round(v); }
}

/* Verifica la autenticidad del aviso:
   Base64(body) → HMAC-SHA256 con la llave secreta → hex,
   comparado contra el header x-bold-signature. */
function firmaValida(rawBody, signature) {
  if (!SECRET || !signature) return false;
  try {
    const base64 = Buffer.from(rawBody || '', 'utf8').toString('base64');
    const hmac = crypto.createHmac('sha256', SECRET).update(base64).digest('hex');
    // Comparación en tiempo constante
    const a = Buffer.from(hmac);
    const b = Buffer.from(String(signature));
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  } catch (e) { return false; }
}

/* ── Comprobante de PAGO al CLIENTE ──────────────────────────────
   Hasta ahora, al confirmarse el pago solo se enteraba la tienda: el
   cliente se quedaba sin nada en el correo. Ahora, en cuanto Bold
   confirma, le llega su comprobante — tenga cuenta o haya comprado
   como invitado, porque el correo sale del pedido, no de la sesión. */
async function avisarCliente(info) {
  if (!RESEND_API_KEY) return;
  const o = info.order || {};
  const mail = String(o.email || '').trim();
  if (!/^[^\s@<>"';,]{1,64}@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i.test(mail)) {
    console.warn('Pago confirmado sin correo válido en el pedido:', info.reference);
    return;
  }
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const n = v => { const x = Number(v); return isFinite(x) && x > 0 ? x : 0; };

  const piezas = (Array.isArray(o.items) ? o.items : []).map(it => {
    if (typeof it === 'string') return `<div style="padding:8px 0;border-top:1px solid #eee;font-family:Georgia,serif;font-size:15px;color:${INK};">${esc(it)}</div>`;
    const linea = n(it.price) * (Number(it.qty) || 1);
    return `<div style="padding:8px 0;border-top:1px solid #eee;font-family:Georgia,serif;font-size:15px;color:${INK};">${esc(it.name || it.nombre || it.id || 'Pieza')}${it.size ? ' · ' + esc(it.size) : ''} <span style="color:#999;font-size:13px;">×${Number(it.qty) || 1}</span>${linea ? `<span style="float:right;">${fmtCOP(linea)}</span>` : ''}</div>`;
  }).join('');

  const fila = (k, v, color) => `<tr><td style="padding:6px 0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#999;">${esc(k)}</td><td style="padding:6px 0;font-family:Georgia,serif;font-size:15px;color:${color || INK};text-align:right;">${esc(v)}</td></tr>`;
  const pagado = n(info.amount) || n(o.total);
  const totales = `
    <table style="width:100%;border-collapse:collapse;border-top:2px solid ${INK};margin:18px 0 8px;">
      ${n(o.subtotal) ? fila('Subtotal', fmtCOP(o.subtotal)) : ''}
      ${n(o.seguro) ? fila('Seguro del envío', fmtCOP(o.seguro)) : ''}
      ${n(o.descuento) ? fila('Cortesía' + (o.codigo_cortesia ? ' ' + o.codigo_cortesia : ''), '−' + fmtCOP(o.descuento), '#1f7a44') : ''}
      <tr><td style="padding:12px 0 0;border-top:1px solid #eee;font-family:Arial,sans-serif;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${INK};font-weight:bold;">Total pagado</td><td style="padding:12px 0 0;border-top:1px solid #eee;font-family:Georgia,serif;font-size:21px;color:${INK};text-align:right;">${esc(fmtCOP(pagado))}</td></tr>
    </table>`;

  const doc = String((o.tipo_documento || '') + ' ' + (o.numero_documento || '')).trim();
  const dato = (k, v) => v ? `<tr><td style="padding:5px 16px 5px 0;font-family:Arial,sans-serif;font-size:10px;letter-spacing:1px;text-transform:uppercase;color:#6b665e;white-space:nowrap;">${esc(k)}</td><td style="padding:5px 0;font-family:Georgia,serif;font-size:14px;color:${INK};">${esc(v)}</td></tr>` : '';

  const html = `
  <div style="margin:0;padding:0;background:#f5f5f0;">
    <div style="max-width:600px;margin:0 auto;background:#fff;">
      <div style="padding:34px 40px 22px;border-bottom:1px solid #eee;">
        <span style="font-family:Georgia,serif;font-size:26px;color:${INK};letter-spacing:1px;">PRETO</span>
        <span style="font-family:Georgia,serif;font-style:italic;font-size:13px;color:${GOLD};margin-left:8px;">by Dala&amp;Co</span>
      </div>
      <div style="padding:38px 40px;">
        <p style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#1f7a44;margin:0 0 14px;">Pago confirmado · Garantía de por vida</p>
        <h1 style="font-family:Georgia,serif;font-weight:normal;font-size:30px;line-height:1.2;color:${INK};margin:0 0 18px;">Su pieza quedó pagada.</h1>
        <p style="font-family:Arial,sans-serif;font-size:15px;line-height:1.7;color:#444;margin:0 0 26px;">${o.nombre ? esc(String(o.nombre).split(' ')[0]) + ', s' : 'S'}u pago de ${esc(fmtCOP(pagado))} fue confirmado por Bold. <b>Este correo es la constancia de que su pedido está pago</b> y el respaldo de la garantía de la casa. Un asesor le escribirá por WhatsApp para reconfirmar medida y detalles antes de que la pieza entre al taller.</p>
        <table style="width:100%;border-collapse:collapse;margin:0 0 24px;">
          ${dato('Referencia', info.reference)}${dato('Método de pago', info.method || 'Bold (en línea)')}${dato('Fecha', info.when)}
        </table>
        ${piezas ? `<p style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${GOLD};margin:0 0 6px;">Su compra</p><div style="border-top:2px solid ${INK};">${piezas}</div>` : ''}
        ${totales}
        <p style="font-family:Arial,sans-serif;font-size:12px;color:#999;margin:8px 0 28px;">Envío nacional sin costo · Solo se cobra el seguro del producto.</p>
        ${doc ? `<p style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${GOLD};margin:0 0 6px;">A nombre de</p>
        <table style="width:100%;border-collapse:collapse;border-top:1px solid #eee;margin:0 0 28px;">
          ${dato('Titular', o.nombre)}${dato('Documento', doc)}${dato('Correo', o.email)}${dato('Ciudad', [o.ciudad, o.departamento].filter(Boolean).join(', '))}${dato('Dirección', o.direccion)}
        </table>` : ''}

        <div style="border:1px solid ${GOLD};padding:22px 24px;margin:0 0 28px;">
          <p style="font-family:Arial,sans-serif;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:${GOLD};margin:0 0 10px;">Lo que ampara esta compra</p>
          <p style="font-family:Georgia,serif;font-size:17px;line-height:1.5;color:${INK};margin:0 0 12px;">Tarjeta de Propiedad · oro 18k certificado · garantía de por vida.</p>
          <p style="font-family:Arial,sans-serif;font-size:13px;line-height:1.7;color:#555;margin:0;">Su pieza se entrega con la <b>Tarjeta de Propiedad</b>: el certificado que acredita el material y registra los datos de este pedido. La <b>garantía de por vida</b> cubre defectos de fabricación y calidad, sin límite de tiempo, y se hace válida directamente con la casa — una intervención en otra joyería la anula. Las piezas de línea admiten <b>cambio dentro de los 30 días</b>.</p>
          <p style="font-family:Arial,sans-serif;font-size:12px;line-height:1.7;color:#999;margin:12px 0 0;">Guarde este correo con la referencia ${esc(info.reference || '')}: es la constancia de pago que le pediremos para cualquier garantía o cambio. Condiciones completas en pretogold.store/promesa.html</p>
        </div>
        <a href="https://wa.me/573226955451" style="display:inline-block;background:${GOLD};color:#0a0807;font-family:Arial,sans-serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;padding:15px 34px;">Escribirnos por WhatsApp →</a>
      </div>
      <div style="padding:24px 40px;border-top:1px solid #eee;text-align:center;">
        <p style="font-family:Arial,sans-serif;font-size:11px;line-height:1.7;color:#999;margin:0;">Constancia de pago y respaldo de garantía · Referencia ${esc(info.reference || '')}<br>Preto by Dala&amp;Co · Hecho en Colombia · pretogold.store</p>
      </div>
    </div>
  </div>`;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [mail],
        reply_to: STORE_EMAIL,
        subject: `Pago confirmado · ${fmtCOP(pagado)} · su garantía Preto by Dala&Co`,
        html
      })
    });
    if (!res.ok) console.error('Resend (comprobante cliente):', res.status, await res.text());
  } catch (e) { console.error('Error enviando el comprobante al cliente:', e.message); }
}

async function avisarTienda(info) {
  if (!RESEND_API_KEY) { console.warn('Sin RESEND_API_KEY: no se envía aviso.'); return; }
  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const row = (k, v) => v ? `<tr><td style="padding:6px 14px 6px 0;font-family:Arial,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#999;white-space:nowrap;vertical-align:top;">${k}</td><td style="padding:6px 0;font-family:Georgia,serif;font-size:15px;color:${INK};">${v}</td></tr>` : '';

  const o = info.order || {};
  const tel = String(o.telefono || '').replace(/\D/g, '');
  const waLink = tel ? `https://wa.me/${tel.length > 10 ? tel : '57' + tel}` : '';
  const items = Array.isArray(o.items) && o.items.length
    ? o.items.map(it => `<div style="padding:2px 0;">${esc(typeof it === 'string' ? it : (it.nombre || it.name || JSON.stringify(it)))}</div>`).join('')
    : '';

  /* Bloque de acción: lo que hay que hacer al recibir el pago es
     escribirle al cliente para reconfirmar medida y detalles. */
  const cta = waLink ? `
      <a href="${waLink}" style="display:inline-block;background:#1F7A5A;color:#fff;text-decoration:none;padding:14px 26px;font-family:Arial,sans-serif;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;margin-top:20px;">Escribirle por WhatsApp →</a>
      <p style="font-family:Arial,sans-serif;font-size:12px;color:#888;margin:12px 0 0;line-height:1.6;">Pendiente: reconfirmar medida y detalles antes de mandar la pieza al taller.</p>` : '';

  const html = `
  <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #eee;">
    <div style="padding:22px 30px;background:${info.montoOk === false ? '#7A1F1F' : INK};">
      <span style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${info.montoOk === false ? '#F0C9C9' : GOLD};">${info.montoOk === false ? 'Bold · Revisar antes de fabricar' : 'Bold · Pago confirmado'}</span>
      <div style="font-family:Georgia,serif;font-size:24px;color:#fff;margin-top:6px;">${fmtCOP(info.amount)}</div>
      ${info.montoOk === false ? `<div style="font-family:Arial,sans-serif;font-size:13px;color:#F0C9C9;margin-top:4px;">El pedido vale ${fmtCOP(info.esperado)} — faltan ${fmtCOP(Number(info.esperado) - Number(info.pagado))}</div>` : ''}
      ${o.nombre ? `<div style="font-family:Arial,sans-serif;font-size:13px;color:#bbb;margin-top:4px;">${esc(o.nombre)}</div>` : ''}
    </div>
    <div style="padding:24px 30px;">
      <table style="width:100%;border-collapse:collapse;">
        ${row('Referencia', esc(info.reference))}
        ${row('Cliente', esc(o.nombre))}
        ${row('WhatsApp', tel ? `<a href="${waLink}" style="color:${INK};">${esc(o.telefono)}</a>` : '')}
        ${row('Correo', esc(o.email))}
        ${row('Ciudad', esc([o.ciudad, o.departamento].filter(Boolean).join(', ')))}
        ${row('Dirección', esc(o.direccion))}
        ${row('Piezas', items)}
        ${row('Método', esc(info.method))}
        ${row('ID transacción', esc(info.txId))}
        ${row('Fecha', esc(info.when))}
      </table>
      ${info.montoOk === false ? '' : cta}
      <p style="font-family:Arial,sans-serif;font-size:12px;color:#888;margin:22px 0 0;line-height:1.6;">
        ${info.montoOk === false
          ? 'Lo pagado <b style="color:#8a1f1f">no coincide con el total del pedido</b>. Por seguridad NO se marcó como pagado: aparece con la bandera “Revisar monto” en tu panel. Verifica la transacción en Bold antes de fabricar nada.'
          : (info.marcado
            ? 'El pago entró por Bold y el pedido quedó <b style="color:#1f7a44">marcado como pagado automáticamente</b> en tu panel.'
            : 'El pago entró por Bold. <b style="color:#9a6a1a">Revisa el pedido en tu panel y márcalo como pagado</b> (no se pudo marcar solo).')}
      </p>
    </div>
  </div>`;
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [STORE_EMAIL],
        subject: (info.montoOk === false
          ? `⚠️ REVISAR MONTO (Bold) — pagó ${fmtCOP(info.amount)} de ${fmtCOP(info.esperado)}`
          : `✅ PAGO CONFIRMADO (Bold) — ${fmtCOP(info.amount)}`)
          + `${o.nombre ? ' · ' + o.nombre : ''} · ${info.reference || ''}`,
        html
      })
    });
    if (!res.ok) console.error('Resend error:', res.status, await res.text());
  } catch (e) { console.error('Error enviando aviso:', e.message); }
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Método no permitido' };

  const rawBody = event.body || '';
  const signature = (event.headers['x-bold-signature'] || event.headers['X-Bold-Signature'] || '').trim();

  // Seguridad: solo procesamos avisos firmados correctamente por Bold
  if (!firmaValida(rawBody, signature)) {
    console.warn('Webhook Bold: firma inválida o ausente.');
    return { statusCode: 401, body: 'Firma inválida' };
  }

  let payload = {};
  try { payload = JSON.parse(rawBody || '{}'); } catch (e) { payload = {}; }

  // Bold puede variar la forma del cuerpo; tomamos los campos con tolerancia.
  const data = payload.data || payload || {};
  const type = String(payload.type || payload.event || data.status || '').toUpperCase();
  const status = String(data.status || payload.status || type || '').toUpperCase();

  // Estados que cuentan como pago exitoso
  const aprobado = /APPROVED|SALE_APPROVED|PAID|ACCEPTED|APROBAD/.test(type + ' ' + status);

  if (aprobado) {
    const info = {
      amount:    data.amount && (data.amount.total || data.amount) || data.total || payload.amount || '',
      reference: data.metadata && data.metadata.reference || data.reference || data.order_id || data.payment_id || '',
      status:    status || 'APPROVED',
      method:    data.payment_method || data.paymentMethod || 'Bold',
      txId:      data.payment_id || data.transaction_id || data.id || '',
      when:      new Date().toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })
    };
    // 1) Marcar el pedido como pagado en Firebase (automático) y traer
    //    sus datos para que el aviso diga quién pidió y qué pidió.
    const res = await marcarPagado(info.reference, info);
    info.marcado = res.ok;
    info.order = res.order;
    info.montoOk = res.montoOk;      // false = pagó distinto al total (solo interno)
    info.esperado = res.esperado;
    info.pagado = res.pagado;

    // 1b) Cortesía usada: solo si el pago quedó bueno de verdad.
    if (res.ok && res.montoOk !== false) await marcarCortesiaUsada(res.order);
    // 2) Avisarte por correo (siempre, aunque falle el marcado).
    await avisarTienda(info);
    // 3) Comprobante de pago al cliente (con cuenta o como invitado).
    //    No se manda si el monto no cuadra: primero se revisa.
    if (info.montoOk !== false) await avisarCliente(info);
  } else {
    console.log('Webhook Bold recibido (no aprobado):', type, status);
  }

  // Siempre 200 para que Bold no reintente indefinidamente.
  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};
