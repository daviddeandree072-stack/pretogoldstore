/* ───────────────────────────────────────────────────────────────
   Preto by Dala&Co · CITA PRIVADA — correo de la solicitud
   ───────────────────────────────────────────────────────────────
   La llama el panel de cita.js:

     fetch('/.netlify/functions/cita-privada', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ nombre, contacto, pieza, dia, franja, canal, nota })
     })

   Envía DOS correos:
     1. a la casa (STORE_EMAIL) con la solicitud y responder-a el
        cliente, para que el asesor confirme en un clic;
     2. al cliente, si dejó un correo, como acuse de recibo.

   Mismas variables de entorno que welcome-email.js:
     RESEND_API_KEY · FROM_EMAIL · STORE_EMAIL
   Si falta la clave, la web NO pierde la solicitud: cita.js cae al
   concierge de WhatsApp con el resumen escrito.
   ─────────────────────────────────────────────────────────────── */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL     = process.env.FROM_EMAIL  || 'Preto by Dala&Co <onboarding@resend.dev>';
const STORE_EMAIL    = process.env.STORE_EMAIL || 'pretobydalaco@gmail.com';
const WA_NUMBER      = '573226955451';
const { emailValido } = require('../seguridad.js');

const GOLD  = '#967434';
const INK   = '#141414';

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
  return RATE.count > 40;
}
function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
const cut = (v, n) => String(v || '').trim().slice(0, n);

/* ── Correo interno: la ficha de la cita ─────────────────────── */
function storeEmail(d) {
  const row = (k, v) => `
    <tr>
      <td style="padding:11px 0;border-bottom:1px solid #eee;font-family:Arial,sans-serif;font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:#999;width:34%;vertical-align:top;">${esc(k)}</td>
      <td style="padding:11px 0;border-bottom:1px solid #eee;font-family:Georgia,serif;font-size:16px;color:${INK};">${esc(v || '—')}</td>
    </tr>`;
  return `
  <div style="background:#f5f5f0;padding:28px 14px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #e7e3da;">
      <tr><td style="padding:30px 34px 22px;border-bottom:1px solid #eee;">
        <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${GOLD};">Atelier privado · nueva cita</p>
        <p style="margin:0;font-family:Georgia,serif;font-size:26px;color:${INK};">${esc(d.nombre)}</p>
      </td></tr>
      <tr><td style="padding:8px 34px 26px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${row('Contacto', d.contacto)}
          ${row('Pieza', d.pieza || '(por definir)')}
          ${row('Día', d.dia || '(flexible)')}
          ${row('Franja', d.franja)}
          ${row('Canal', d.canal)}
          ${d.nota ? row('Nota', d.nota) : ''}
        </table>
      </td></tr>
      <tr><td style="padding:0 34px 32px;">
        <a href="https://wa.me/${WA_NUMBER}" style="display:inline-block;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2.4px;text-transform:uppercase;color:#fff;background:${INK};padding:14px 26px;text-decoration:none;">Confirmar con el cliente</a>
        <p style="margin:16px 0 0;font-family:Arial,sans-serif;font-size:12px;line-height:1.6;color:#888;">Responda a este correo y le llega directo al cliente.</p>
      </td></tr>
    </table>
  </div>`;
}

/* ── Acuse de recibo para el cliente ─────────────────────────── */
function clientEmail(d) {
  const p = 'font-family:Arial,sans-serif;font-weight:300;font-size:15px;line-height:1.8;color:#444;margin:0 0 14px;';
  return `
  <div style="background:#f5f5f0;padding:28px 14px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #e7e3da;">
      <tr><td style="padding:38px 40px 10px;text-align:center;">
        <p style="margin:0 0 10px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${GOLD};">Atelier privado</p>
        <p style="margin:0;font-family:Georgia,serif;font-size:30px;line-height:1.2;color:${INK};">Su cita está solicitada</p>
      </td></tr>
      <tr><td style="padding:22px 40px 30px;">
        <p style="${p}">${esc(d.nombre.split(' ')[0])}, gracias por escribirnos. Un asesor de la casa le confirma día y hora por <strong style="color:${INK};">${esc(d.canal)}</strong> en menos de 24 horas.</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:22px 0;background:#faf8f4;border:1px solid #ece6da;">
          <tr><td style="padding:20px 22px;">
            <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:10px;letter-spacing:2.4px;text-transform:uppercase;color:#999;">Lo que nos indicó</p>
            <p style="margin:0;font-family:Georgia,serif;font-size:17px;line-height:1.6;color:${INK};">
              ${esc(d.pieza || 'Una pieza por definir')}<br />
              <span style="color:#777;font-size:15px;">${esc(d.dia || 'Día flexible')} · ${esc(d.franja)}</span>
            </p>
          </td></tr>
        </table>
        <p style="${p}">Si prefiere adelantarlo, el concierge responde ahora mismo por WhatsApp.</p>
        <p style="margin:22px 0 0;">
          <a href="https://wa.me/${WA_NUMBER}" style="display:inline-block;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2.4px;text-transform:uppercase;color:#fff;background:${INK};padding:14px 26px;text-decoration:none;">Escribir al concierge</a>
        </p>
      </td></tr>
      <tr><td style="padding:26px 40px 30px;border-top:1px solid #eee;text-align:center;background:${INK};">
        <p style="margin:0;font-family:Georgia,serif;font-style:italic;font-size:13px;color:${GOLD};">Preto by Dala&amp;Co · Editorial Jewelry</p>
        <p style="margin:10px 0 0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:1px;color:rgba(255,255,255,0.5);">Hecho en Colombia · pretogold.store</p>
      </td></tr>
    </table>
  </div>`;
}

async function sendEmail({ to, subject, html, replyTo }) {
  const body = { from: FROM_EMAIL, to: Array.isArray(to) ? to : [to], subject, html };
  if (replyTo) body.reply_to = replyTo;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Resend ${res.status}: ${text}`);
  return text;
}

exports.handler = async (event) => {
  const reqOrigin = (event.headers && (event.headers.origin || event.headers.Origin)) || '';
  const headers = {
    'Access-Control-Allow-Origin': originAllowed(reqOrigin) ? reqOrigin : 'https://pretogold.store',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Cache-Control': 'no-store'
  };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: 'Método no permitido' };
  if (!RESEND_API_KEY) {
    console.error('cita-privada: falta RESEND_API_KEY en Netlify.');
    return { statusCode: 500, headers, body: 'RESEND_API_KEY no configurada' };
  }

  if (!originAllowed(reqOrigin)) {
    console.warn('cita-privada: origen rechazado:', reqOrigin || '(sin Origin)');
    return { statusCode: 403, headers, body: 'Origen no permitido' };
  }
  if (rateLimited()) return { statusCode: 429, headers, body: 'Demasiadas solicitudes' };

  let raw = {};
  try { raw = JSON.parse(event.body || '{}'); }
  catch (e) { return { statusCode: 400, headers, body: 'Cuerpo inválido' }; }

  const d = {
    nombre:   cut(raw.nombre, 80),
    contacto: cut(raw.contacto, 120),
    pieza:    cut(raw.pieza, 120),
    dia:      cut(raw.dia, 20),
    franja:   cut(raw.franja, 40) || 'Sin preferencia',
    canal:    cut(raw.canal, 30) || 'WhatsApp',
    nota:     cut(raw.nota, 600)
  };
  if (!d.nombre || !d.contacto) return { statusCode: 400, headers, body: 'Faltan nombre o contacto' };

  const email = emailValido(d.contacto) ? d.contacto : null;

  try {
    await sendEmail({
      to: STORE_EMAIL,
      replyTo: email || undefined,
      subject: `Cita privada · ${d.nombre}${d.pieza ? ' · ' + d.pieza : ''}`,
      html: storeEmail(d)
    });
    if (email) {
      try {
        await sendEmail({
          to: email,
          replyTo: STORE_EMAIL,
          subject: 'Su cita en el atelier · Preto by Dala&Co',
          html: clientEmail(d)
        });
      } catch (e) { console.warn('cita-privada: acuse al cliente falló:', e.message); }
    }
    console.log('Cita privada recibida de', d.nombre, '·', d.canal);
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  } catch (e) {
    console.error('cita-privada:', (e && (e.stack || e.message)) || e);
    return { statusCode: 502, headers, body: JSON.stringify({ ok: false, error: 'No se pudo registrar la cita. Escríbanos por WhatsApp.' }) };
  }
};
