/* ───────────────────────────────────────────────────────────────
   Preto by Dala&Co · Seguridad compartida de las funciones
   ───────────────────────────────────────────────────────────────
   Un solo lugar para las defensas que antes estaban copiadas (o
   faltaban) en cada función: orígenes permitidos, límite de peticiones,
   validación de correo, recorte de campos y errores que no cuentan de
   más. esbuild lo empaqueta dentro de cada función al desplegar.
   ─────────────────────────────────────────────────────────────── */

/* Solo la tienda (o una vista previa de Netlify, o el desarrollo local)
   puede llamar a las funciones desde un navegador. Un Origin ajeno se
   rechaza: así una página clonada no puede usar nuestras funciones. */
function originAllowed(origin) {
  if (!origin) return false;
  if (origin === 'https://pretogold.store' || origin === 'https://www.pretogold.store') return true;
  if (/^https:\/\/[a-z0-9-]+(--[a-z0-9-]+)?\.netlify\.app$/i.test(origin)) return true;
  if (/^http:\/\/localhost(:\d+)?$/.test(origin)) return true;
  if (/^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)) return true;
  return false;
}

function reqOrigin(event) {
  return (event && event.headers && (event.headers.origin || event.headers.Origin)) || '';
}

/* Cabeceras CORS: NUNCA '*'. Se devuelve el origen concreto que pidió
   (si está en la lista) o el dominio de la casa. */
function cors(event, extra) {
  const o = reqOrigin(event);
  const h = {
    'Access-Control-Allow-Origin': originAllowed(o) ? o : 'https://pretogold.store',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json'
  };
  if (extra) for (const k in extra) h[k] = extra[k];
  return h;
}

/* Límite de peticiones por instancia de la función. No es un WAF, pero
   corta las ráfagas: bots que intentan adivinar una clave interna o
   usar los correos como altavoz de spam.
     const limite = limiter({ max: 30, minutes: 10 });
     if (limite()) → 429                                        */
function limiter(opts) {
  const max = (opts && opts.max) || 30;
  const win = ((opts && opts.minutes) || 10) * 60 * 1000;
  const state = { start: 0, count: 0, keys: new Map() };
  return function (key) {
    const now = Date.now();
    if (now - state.start > win) { state.start = now; state.count = 0; state.keys.clear(); }
    state.count++;
    if (state.count > max) return true;
    if (key) {
      const n = (state.keys.get(key) || 0) + 1;
      state.keys.set(key, n);
      if (n > 3) return true;         // el mismo destinatario, 3 veces por ventana
    }
    return false;
  };
}

/* Correo válido de verdad: una sola arroba, dominio con punto, sin
   espacios ni saltos de línea (un salto de línea en un campo "para:"
   es la vía clásica de inyección de cabeceras). */
const EMAIL_RE = /^[^\s@<>"';,]{1,64}@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i;
function emailValido(s) {
  const v = String(s == null ? '' : s).trim();
  return v.length >= 6 && v.length <= 190 && EMAIL_RE.test(v);
}

/* Recorta y limpia un campo de texto que venga del navegador. */
function cut(v, n) {
  return String(v == null ? '' : v).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').trim().slice(0, n || 120);
}

/* Escapa para insertar en HTML (correos, paneles). */
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

/* El detalle del error se queda en los logs de Netlify (donde solo
   entras tú). Al navegador va una frase sin datos internos: ni rutas,
   ni versiones, ni respuestas de Resend, ni trazas de pila. */
function fallo(ctx, e, publico) {
  console.error(ctx + ':', (e && (e.stack || e.message)) || e);
  return publico || 'No se pudo completar la operación. Intente de nuevo.';
}

module.exports = { originAllowed, reqOrigin, cors, limiter, emailValido, cut, esc, fallo, EMAIL_RE };
