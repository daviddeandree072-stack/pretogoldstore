/* ───────────────────────────────────────────────────────────────
   Preto by Dala&Co · DIAGNÓSTICO de correos (Resend)
   ───────────────────────────────────────────────────────────────
   Herramienta interna para saber POR QUÉ no llegan los correos.
   La usa la página  diagnostico-correos.html.

   Dos acciones (POST con JSON):

     { "action": "check" }
        → Revisa la configuración SIN enviar nada:
          · ¿Está puesta la variable RESEND_API_KEY?
          · ¿Qué remitente (FROM_EMAIL) se está usando?
          · ¿El dominio de ese remitente está VERIFICADO en Resend?
          (consulta en vivo la API de Resend: GET /domains)

     { "action": "test", "correo": "alguien@ejemplo.com" }
        → Envía un correo de PRUEBA real a ese buzón y devuelve el
          resultado EXACTO de Resend, ya traducido a un diagnóstico
          (clave mala, dominio sin verificar, remitente inválido…).

   Variables de entorno (Netlify → Site settings → Environment):
     RESEND_API_KEY, FROM_EMAIL, STORE_EMAIL
   ─────────────────────────────────────────────────────────────── */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL     = process.env.FROM_EMAIL  || 'Preto by Dala&Co <onboarding@resend.dev>';
const STORE_EMAIL    = process.env.STORE_EMAIL || 'pretobydalaco@gmail.com';
/* Clave interna: sin ella esta función no hace NADA. Antes cualquiera
   podía abrir la URL y enviar correos desde el dominio de la tienda
   (relé abierto → phishing y quema de reputación del remitente).
   Reutiliza la misma variable que ya usa reenviar-bienvenida. */
const TOOL_TOKEN     = process.env.BACKFILL_TOKEN || '';


/* Comparación en tiempo constante: no deja medir la clave carácter a
   carácter por el tiempo de respuesta. */
function tokenOk(recibido, esperado) {
  if (!esperado) return false;
  const crypto = require('crypto');
  const a = Buffer.from(String(recibido || ''));
  const b = Buffer.from(String(esperado));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

const GOLD  = '#967434';
const INK   = '#141414';

/* Saca el dominio de un remitente tipo  "Nombre <correo@dominio.com>"  */
function fromDomain(from) {
  const m = String(from || '').match(/<?\s*([^<>\s@]+)@([^<>\s]+?)\s*>?$/);
  return m ? m[2].toLowerCase() : '';
}

/* Muestra la clave enmascarada: re_1234…wxyz (nunca la clave entera) */
function maskKey(k) {
  if (!k) return '';
  const s = String(k);
  if (s.length <= 10) return s.slice(0, 3) + '…';
  return s.slice(0, 5) + '…' + s.slice(-4);
}

/* ── Consulta a Resend qué dominios hay y su estado ──────────── */
async function checkDomain(domain) {
  if (!RESEND_API_KEY) return { status: 'no_key' };
  let res;
  try {
    res = await fetch('https://api.resend.com/domains', {
      headers: { 'Authorization': `Bearer ${RESEND_API_KEY}` }
    });
  } catch (e) {
    return { status: 'network_error', detail: e.message };
  }

  const text = await res.text();

  // Clave inválida
  if (res.status === 401) return { status: 'bad_key', http: 401 };
  // Clave "solo envío": no puede leer dominios, pero sí sirve para mandar
  if (res.status === 403) return { status: 'restricted_key', http: 403 };
  if (!res.ok) return { status: 'api_error', http: res.status, detail: text.slice(0, 300) };

  let list = [];
  try { list = (JSON.parse(text).data) || []; } catch (e) { /* ignore */ }

  const match = list.find(d => String(d.name || '').toLowerCase() === domain);
  if (!match) {
    return {
      status: 'not_added',
      domainsFound: list.map(d => ({ name: d.name, status: d.status }))
    };
  }
  // status de Resend: not_started | pending | verified | failed | temporary_failure
  return { status: match.status || 'unknown', id: match.id };
}

/* ── Plantilla mínima del correo de prueba ───────────────────── */
function testEmailHtml() {
  const when = new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' });
  return `
  <div style="margin:0;padding:0;background:#f5f5f0;">
    <table role="presentation" width="100%" style="border-collapse:collapse;background:#f5f5f0;"><tr><td style="padding:28px 14px;">
      <table role="presentation" width="560" align="center" style="border-collapse:collapse;max-width:560px;width:100%;margin:0 auto;background:#fff;">
        <tr><td style="padding:34px 40px 22px;border-bottom:1px solid #eee;text-align:center;">
          <span style="font-family:Georgia,serif;font-size:28px;color:${INK};letter-spacing:4px;">PRETO</span>
          <div style="font-family:Georgia,serif;font-style:italic;font-size:13px;color:${GOLD};margin-top:6px;">by Dala&amp;Co.</div>
        </td></tr>
        <tr><td style="padding:36px 40px;">
          <p style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:2.5px;text-transform:uppercase;color:${GOLD};margin:0 0 14px;">Correo de prueba</p>
          <h1 style="font-family:Georgia,serif;font-weight:normal;font-size:26px;color:${INK};margin:0 0 16px;">Los correos funcionan ✓</h1>
          <p style="font-family:Arial,sans-serif;font-size:15px;line-height:1.7;color:#444;margin:0 0 10px;">
            Si estás leyendo esto, la conexión con Resend está bien: la clave es válida,
            el remitente está aceptado y el dominio está verificado.
          </p>
          <p style="font-family:Arial,sans-serif;font-size:13px;line-height:1.7;color:#888;margin:18px 0 0;">
            Enviado el ${when} (hora Colombia) desde el diagnóstico interno de Preto.
          </p>
        </td></tr>
      </table>
    </td></tr></table>
  </div>`;
}

async function sendTest(correo) {
  const body = {
    from: FROM_EMAIL,
    to: [correo],
    subject: 'Prueba de correos · Preto by Dala&Co',
    html: testEmailHtml()
  };
  let res;
  try {
    res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
  } catch (e) {
    return { ok: false, diagnosis: 'network_error', detail: e.message };
  }

  const text = await res.text();
  if (res.ok) {
    let id = '';
    try { id = JSON.parse(text).id || ''; } catch (e) { /* ignore */ }
    return { ok: true, id };
  }

  // Traducir el error de Resend a un diagnóstico entendible
  const low = text.toLowerCase();
  let diagnosis = 'other';
  if (res.status === 401 || res.status === 403 && low.includes('api key')) diagnosis = 'bad_key';
  else if (low.includes('domain is not verified') || low.includes('not verified')) diagnosis = 'domain_unverified';
  else if (low.includes('you can only send testing emails') || low.includes('own email')) diagnosis = 'domain_unverified';
  else if (res.status === 422 || low.includes('from') && low.includes('invalid')) diagnosis = 'bad_from';
  else if (res.status === 429) diagnosis = 'rate_limited';

  // El detalle crudo de Resend puede traer datos internos: se recorta.
  return { ok: false, http: res.status, diagnosis, detail: text.slice(0, 160) };
}

/* 10 intentos cada 10 minutos: la clave interna no se adivina a fuerza
   de peticiones. */
const { limiter } = require('../seguridad.js');
const limite = limiter({ max: 10, minutes: 10 });

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': 'https://pretogold.store',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Método no permitido' }) };

  let data = {};
  try { data = JSON.parse(event.body || '{}'); }
  catch (e) { return { statusCode: 400, headers, body: JSON.stringify({ error: 'Cuerpo inválido' }) }; }

  // ── Seguridad: solo con la clave interna ─────────────────────
  if (!TOOL_TOKEN) {
    return { statusCode: 403, headers, body: JSON.stringify({ error: 'Falta configurar BACKFILL_TOKEN en Netlify (Site settings → Environment variables). Mientras no esté, esta herramienta queda cerrada.' }) };
  }
  if (limite()) {
    return { statusCode: 429, headers, body: JSON.stringify({ error: 'Demasiadas solicitudes. Espera unos minutos.' }) };
  }
  if (!tokenOk(data.token, TOOL_TOKEN)) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: 'Clave interna incorrecta.' }) };
  }

  const domain = fromDomain(FROM_EMAIL);

  /* ── Acción: revisar configuración ─────────────────────────── */
  if (data.action === 'test') {
    const correo = String(data.correo || '').trim();
    if (!correo || !/\S+@\S+\.\S+/.test(correo)) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Escribe un correo válido para la prueba.' }) };
    }
    if (!RESEND_API_KEY) {
      return { statusCode: 200, headers, body: JSON.stringify({ ok: false, diagnosis: 'no_key' }) };
    }
    const result = await sendTest(correo);
    return { statusCode: 200, headers, body: JSON.stringify({ ...result, to: correo, from: FROM_EMAIL }) };
  }

  /* ── Acción por defecto: check ─────────────────────────────── */
  const domainInfo = await checkDomain(domain);

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      apiKey: {
        set: !!RESEND_API_KEY,
        masked: maskKey(RESEND_API_KEY),
        looksValid: !!RESEND_API_KEY && /^re_/.test(RESEND_API_KEY)
      },
      fromEmail: {
        value: FROM_EMAIL,
        domain,
        usesResendDev: domain === 'resend.dev'
      },
      storeEmail: { value: STORE_EMAIL },
      domain: domainInfo
    })
  };
};
