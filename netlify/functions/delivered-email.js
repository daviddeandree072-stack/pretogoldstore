/* ───────────────────────────────────────────────────────────────
   Preto by Dala&Co · Correo de PEDIDO ENTREGADO
   ───────────────────────────────────────────────────────────────
   La LLAMA el panel de administración (admin.html) cuando un pedido
   se marca como "Entregado":

     fetch('/.netlify/functions/delivered-email', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ correo, nombre, items, fecha })
     })

   Envía UN correo al cliente avisando que su pieza ya fue entregada,
   con el detalle del pedido y una nota de cuidado + garantía.

   Variables de entorno (Site settings → Environment variables):
     RESEND_API_KEY  → clave de Resend ("re_...")
     FROM_EMAIL      → remitente verificado, ej:
                       Preto by Dala&Co <pedidos@pretogold.store>
   ─────────────────────────────────────────────────────────────── */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL     = process.env.FROM_EMAIL  || 'Preto by Dala&Co <onboarding@resend.dev>';
const STORE_EMAIL    = process.env.STORE_EMAIL || 'pretobydalaco@gmail.com';
const WA_NUMBER      = '573226955451';

const GOLD  = '#967434';
const INK   = '#141414';
const PAPER = '#ffffff';
const SOFT  = '#f5f5f0';

const INSTAGRAM_URL  = 'https://www.instagram.com/pretostoregold';
const INSTAGRAM_USER = '@pretostoregold';

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]
  ));
}

/* Formatea la fecha deseada (YYYY-MM-DD) a algo legible en español. */
function fechaLegible(f) {
  if (!f) return '';
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(f).trim());
  if (!m) return esc(String(f));
  const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const d = parseInt(m[3], 10), mes = meses[parseInt(m[2], 10) - 1] || '', y = m[1];
  return `${d} de ${mes} de ${y}`;
}

/* Lista de piezas del pedido (opcional). */
function itemsHtml(items) {
  if (!Array.isArray(items) || !items.length) return '';
  const rows = items.map(it => {
    const size = it && it.size ? ' · ' + esc(it.size) : '';
    const qty  = it && it.qty && it.qty > 1 ? ' <span style="color:' + GOLD + ';">×' + it.qty + '</span>' : '';
    const name = esc((it && it.name) || 'Pieza Preto');
    return `<tr><td style="font-family:Georgia,serif;font-size:15px;color:${INK};padding:11px 0;border-bottom:1px solid #eee;">${name}${size}${qty}</td></tr>`;
  }).join('');
  return `<table role="presentation" width="100%" style="border-collapse:collapse;margin:6px 0 4px;">${rows}</table>`;
}

/* ── Plantilla del correo de entrega ─────────────────────────── */
function deliveredEmail(d) {
  const nombre = (d.nombre || '').trim();
  const saludo = nombre ? esc(nombre) + ',' : 'te contamos:';
  const para   = 'font-family:Arial,sans-serif;font-size:15px;line-height:1.75;color:#444;margin:0 0 16px;';
  const li     = 'font-family:Arial,sans-serif;font-size:14px;line-height:1.7;color:#555;margin:0 0 9px;';
  const check  = `<span style="color:${GOLD};font-weight:bold;margin-right:10px;">✓</span>`;
  const fecha  = fechaLegible(d.fecha);
  const items  = itemsHtml(d.items);

  return `
  <div style="margin:0;padding:0;background:${SOFT};">
    <table role="presentation" width="100%" style="border-collapse:collapse;background:${SOFT};"><tr><td style="padding:28px 14px;">
    <table role="presentation" width="600" align="center" style="border-collapse:collapse;max-width:600px;width:100%;margin:0 auto;background:${PAPER};">

      <!-- Encabezado -->
      <tr><td style="padding:36px 40px 26px;border-bottom:1px solid #eee;text-align:center;">
        <span style="font-family:Georgia,serif;font-size:30px;color:${INK};letter-spacing:4px;">PRETO</span>
        <div style="font-family:Georgia,serif;font-style:italic;font-size:13px;color:${GOLD};margin-top:6px;letter-spacing:1px;">by Dala&amp;Co.</div>
      </td></tr>

      <!-- Aviso de entrega -->
      <tr><td style="padding:40px 40px 4px;">
        <p style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:2.5px;text-transform:uppercase;color:${GOLD};margin:0 0 14px;">Tu pedido ha sido entregado</p>
        <h1 style="font-family:Georgia,serif;font-weight:normal;font-size:30px;line-height:1.25;color:${INK};margin:0 0 10px;">Tu pieza ya está contigo, ${saludo}</h1>
        <p style="font-family:Georgia,serif;font-style:italic;font-size:16px;line-height:1.6;color:${GOLD};margin:0 0 24px;">Ahora comienza su verdadera historia: la tuya.</p>
        <p style="${para}">Nos complace confirmarte que tu pedido ha sido <strong style="color:${INK};">entregado con éxito</strong>. Esperamos que cada detalle esté a la altura de lo que representa.</p>
        <p style="${para}">Gracias por confiar en <strong style="color:${INK};">Preto by Dala&amp;Co.</strong> Fue un honor acompañarte en esta elección.</p>
      </td></tr>

      ${items ? `
      <!-- Detalle del pedido -->
      <tr><td style="padding:12px 40px 0;">
        <p style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:2.5px;text-transform:uppercase;color:${GOLD};margin:0 0 6px;">Tu pedido</p>
        ${items}
      </td></tr>` : ''}

      ${fecha ? `
      <tr><td style="padding:16px 40px 0;">
        <p style="font-family:Arial,sans-serif;font-size:13px;line-height:1.6;color:#777;margin:0;">Fecha que habías solicitado para la entrega: <strong style="color:${INK};">${fecha}</strong>.</p>
      </td></tr>` : ''}

      <!-- Cuidado + garantía -->
      <tr><td style="padding:30px 40px 0;">
        <table role="presentation" width="100%" style="border-collapse:collapse;">
          <tr><td style="background:${INK};padding:34px 36px;">
            <p style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:2.5px;text-transform:uppercase;color:${GOLD};margin:0 0 18px;text-align:center;">Para que dure generaciones</p>
            <p style="font-family:Arial,sans-serif;font-size:14px;line-height:1.7;color:rgba(255,255,255,0.82);margin:0 0 9px;">${check}Límpiala con un paño suave y seco.</p>
            <p style="font-family:Arial,sans-serif;font-size:14px;line-height:1.7;color:rgba(255,255,255,0.82);margin:0 0 9px;">${check}Evita el cloro, perfumes y cremas sobre la pieza.</p>
            <p style="font-family:Arial,sans-serif;font-size:14px;line-height:1.7;color:rgba(255,255,255,0.82);margin:0 0 9px;">${check}Guárdala en su estuche cuando no la uses.</p>
            <p style="font-family:Arial,sans-serif;font-size:14px;line-height:1.7;color:rgba(255,255,255,0.82);margin:0;">${check}Tu pieza está respaldada por <strong style="color:#fff;">garantía de por vida</strong> y su certificado de autenticidad.</p>
          </td></tr>
        </table>
      </td></tr>

      <!-- CTA -->
      <tr><td style="padding:34px 40px 6px;text-align:center;">
        <p style="${para}">¿Alguna duda sobre tu pieza o su cuidado? Nuestro concierge está a un mensaje de distancia.</p>
        <table role="presentation" align="center" style="border-collapse:collapse;margin:6px auto 4px;"><tr>
          <td style="padding:0;">
            <a href="https://wa.me/${WA_NUMBER}" style="display:inline-block;background:${GOLD};color:#0a0807;font-family:Arial,sans-serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;padding:15px 34px;">Escribir al concierge →</a>
          </td>
        </tr></table>
      </td></tr>

      <!-- Cierre -->
      <tr><td style="padding:24px 40px 8px;">
        <p style="font-family:Arial,sans-serif;font-size:14px;color:#777;margin:0 0 4px;">Con aprecio,</p>
        <p style="font-family:Georgia,serif;font-size:17px;color:${INK};margin:0 0 2px;">PRETO by Dala&amp;Co.</p>
        <p style="font-family:Georgia,serif;font-style:italic;font-size:13px;color:${GOLD};margin:0;">Editorial Jewelry</p>
      </td></tr>

      <!-- Pie con Instagram -->
      <tr><td style="padding:34px 40px 36px;border-top:1px solid #eee;text-align:center;background:${INK};">
        <p style="font-family:Georgia,serif;font-style:italic;font-size:13px;color:${GOLD};margin:0 0 18px;">Creado para quienes comprenden el valor de la exclusividad.</p>
        <a href="${INSTAGRAM_URL}" style="display:inline-block;text-decoration:none;font-family:Arial,sans-serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#fff;margin:0 0 16px;">
          <span style="color:${GOLD};">Instagram</span> &nbsp;${esc(INSTAGRAM_USER)} &nbsp;→
        </a>
        <p style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:1px;color:rgba(255,255,255,0.5);margin:14px 0 0;">Preto by Dala&amp;Co · Hecho en Colombia · pretogold.store</p>
      </td></tr>

    </table>
    </td></tr></table>
  </div>`;
}

/* ── Puerta de seguridad ──────────────────────────────────────────
   Esta función envía correo DESDE el dominio verificado de la casa.
   Sin puerta, cualquiera que adivine la URL podía mandar correos con
   la identidad de Preto (phishing + quema de la reputación del
   remitente, con lo que los correos reales dejan de llegar).
   Tres capas, ninguna cambia el flujo del panel:
     1. Solo desde el dominio propio (cabecera Origin).
     2. Solo el ADMIN: se verifica su token de sesión de Firebase
        contra el UID del panel. Si el Admin SDK no está configurado,
        quedan las otras dos capas en vez de romper el aviso.
     3. Límite de envíos por instancia contra ráfagas.               */
const ADMIN_UID = process.env.ADMIN_UID || 'imIXf4YektUOvT9AdAu5bxXcAnJ2';

function originAllowed(origin) {
  if (!origin) return false;
  if (origin === 'https://pretogold.store' || origin === 'https://www.pretogold.store') return true;
  if (/^https:\/\/[a-z0-9-]+(--[a-z0-9-]+)?\.netlify\.app$/i.test(origin)) return true;
  if (/^http:\/\/localhost(:\d+)?$/.test(origin)) return true;
  return false;
}

const RATE = { windowStart: 0, count: 0 };
function rateLimited() {
  const now = Date.now();
  if (now - RATE.windowStart > 10 * 60 * 1000) { RATE.windowStart = now; RATE.count = 0; }
  RATE.count++;
  return RATE.count > 30;
}

const cut = (v, n) => String(v == null ? '' : v).trim().slice(0, n);

/* ¿Quien llama es el admin de verdad? Verifica el ID token de Firebase.
   'ok' | 'no-admin' | 'sin-verificar' (sin Admin SDK configurado). */
async function esAdmin(authHeader) {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) return 'sin-verificar';
  const idToken = String(authHeader || '').replace(/^Bearer\s+/i, '').trim();
  if (!idToken) return 'no-admin';
  try {
    const admin = require('firebase-admin');
    if (!admin.apps.length) {
      const cred = JSON.parse(raw);
      if (cred.private_key) cred.private_key = cred.private_key.replace(/\\n/g, '\n');
      admin.initializeApp({ credential: admin.credential.cert(cred) });
    }
    const dec = await admin.auth().verifyIdToken(idToken);
    return dec && dec.uid === ADMIN_UID ? 'ok' : 'no-admin';
  } catch (e) {
    console.warn('delivered-email: token de admin inválido:', e.message);
    return 'no-admin';
  }
}

async function sendEmail({ to, subject, html, replyTo }) {
  const body = { from: FROM_EMAIL, to: Array.isArray(to) ? to : [to], subject, html };
  if (replyTo) body.reply_to = replyTo;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Resend ${res.status}: ${text}`);
  return text;
}

exports.handler = async (event) => {
  const origin = (event.headers && (event.headers.origin || event.headers.Origin)) || '';
  const headers = {
    'Access-Control-Allow-Origin': originAllowed(origin) ? origin : 'https://pretogold.store',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Cache-Control': 'no-store'
  };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: 'Método no permitido' };

  if (!originAllowed(origin)) {
    console.warn('delivered-email: origen rechazado:', origin || '(sin Origin)');
    return { statusCode: 403, headers, body: 'Origen no permitido' };
  }
  if (rateLimited()) return { statusCode: 429, headers, body: 'Demasiadas solicitudes' };

  const quien = await esAdmin(event.headers && (event.headers.authorization || event.headers.Authorization));
  if (quien === 'no-admin') {
    console.warn('delivered-email: llamada sin sesión de admin.');
    return { statusCode: 401, headers, body: 'Solo el panel de administración puede enviar este correo.' };
  }

  if (!RESEND_API_KEY) {
    console.error('Falta la variable RESEND_API_KEY en Netlify.');
    return { statusCode: 500, headers, body: 'RESEND_API_KEY no configurada' };
  }

  let data = {};
  try { data = JSON.parse(event.body || '{}'); }
  catch (e) { return { statusCode: 400, headers, body: 'Cuerpo inválido' }; }

  const correo = (data.correo || data.email || '').trim();
  if (!correo || !/\S+@\S+\.\S+/.test(correo)) {
    return { statusCode: 400, headers, body: 'Correo inválido' };
  }

  try {
    const sent = await sendEmail({
      to: correo,
      replyTo: STORE_EMAIL,
      subject: 'Tu pieza ya está contigo · Preto by Dala&Co',
      html: deliveredEmail({
        nombre: cut(data.nombre, 80),
        fecha:  cut(data.fecha, 20),
        items:  (Array.isArray(data.items) ? data.items.slice(0, 40) : []).map(it => ({
          name: cut(it && (it.name || it.nombre), 120),
          size: cut(it && it.size, 30),
          qty:  Math.min(99, Math.max(1, Math.round(Number(it && it.qty) || 1)))
        }))
      })
    });
    console.log('Correo de entrega enviado a', correo);
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true, id: sent }) };
  } catch (e) {
    console.error('Error correo entrega:', (e && (e.stack || e.message)) || e);
    return { statusCode: 502, headers, body: JSON.stringify({ ok: false, error: 'No se pudo enviar el correo de entrega.' }) };
  }
};
