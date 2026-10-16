/* ───────────────────────────────────────────────────────────────
   Preto by Dala&Co · Correo automático de las campañas de temporada
   («El lazo» y las demás fechas del calendario de temporadas.js)
   ───────────────────────────────────────────────────────────────
   La llama la web en cuanto un cliente deja su correo en la sección
   #lazo de index.html:

     fetch('/.netlify/functions/lazo-email', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ correo, temporada, abre })
     })

   Envía UN correo con la promoción de la fecha ACTIVA: lazo.js manda
   el id de la temporada y su día de apertura (window.PRETO_TEMPORADA).
   Antes el texto estaba fijo en Amor y Amistad · 19 de septiembre y
   salía igual en octubre, noviembre o diciembre.

   POR QUÉ NO LLEVA UN CÓDIGO DE LA CAMPAÑA: el descuento se valida
   contra el welcomeCode de la cuenta del cliente (facturacion.html y
   bold-hash.js lo comprueban uno a uno). Un código fijo tipo
   "LAZO150" se rechazaría al pagar. Así que el correo lleva al
   cliente a crear su cuenta, que es donde nace su código propio.

   Variables de entorno (las mismas que welcome-email.js, ya puestas):
     RESEND_API_KEY  → clave de Resend ("re_...")
     FROM_EMAIL      → remitente verificado
   ─────────────────────────────────────────────────────────────── */

function tokenOk(recibido, esperado) {
  if (!esperado) return false;
  const crypto = require('crypto');
  const a = Buffer.from(String(recibido || ''));
  const b = Buffer.from(String(esperado));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const BACKFILL_TOKEN = process.env.BACKFILL_TOKEN || '';
const FROM_EMAIL     = process.env.FROM_EMAIL  || 'Preto by Dala&Co <onboarding@resend.dev>';
const STORE_EMAIL    = process.env.STORE_EMAIL || 'pretobydalaco@gmail.com';
const WA_NUMBER      = '573226955451';

/* ── Anti-abuso: idéntico a welcome-email.js ─────────────────────
   Función pública (la llama el navegador), así que sin esto sería un
   relay de spam con el remitente de la casa. */
function originAllowed(origin) {
  if (!origin) return false;
  if (origin === 'https://pretogold.store' || origin === 'https://www.pretogold.store') return true;
  if (/^https:\/\/[a-z0-9-]+(--[a-z0-9-]+)?\.netlify\.app$/i.test(origin)) return true;
  if (/^http:\/\/localhost(:\d+)?$/.test(origin)) return true;
  return false;
}
const RATE = { windowStart: 0, count: 0, perEmail: new Map() };
function rateLimited(email) {
  const now = Date.now();
  if (now - RATE.windowStart > 10 * 60 * 1000) { RATE.windowStart = now; RATE.count = 0; RATE.perEmail.clear(); }
  const per = (RATE.perEmail.get(email) || 0) + 1;
  RATE.perEmail.set(email, per);
  RATE.count++;
  return RATE.count > 30 || per > 2;
}

const GOLD  = '#967434';
const INK   = '#141414';
/* Paleta de la campaña, verbatim de lazo.css:18 (#lazo{--lz-*}), para
   que la portada del correo y la sección del sitio sean la misma casa. */
const WINE  = '#6E1F2E';   // --lz-ground
const DEEP  = '#48121F';   // --lz-deep
const CREAM = '#F4EEE7';   // --lz-cream
const ROSE  = '#B76E79';   // --lz-rose
const PAPER = '#ffffff';
const SOFT  = '#f5f5f0';

const SITE           = 'https://pretogold.store';

/* Textos de cada fecha, verbatim de temporadas.js (label, título y la
   primera frase del lede). Si cambias uno allá, cámbialo aquí. */
const CAMPANAS = {
  mujer:    { label: 'Día de la Mujer · La voz',            titulo: 'La',    script: 'voz',        frase: 'Una joya no adorna: declara.' },
  silencio: { label: 'Semana Santa · El silencio',          titulo: 'El',    script: 'silencio',   frase: 'La casa guarda la semana y el taller descansa.' },
  madre:    { label: 'Día de la Madre · Sostener',          titulo: 'Quien', script: 'sostiene',   frase: 'Hay manos que se recuerdan por lo que cargaron.' },
  padre:    { label: 'Día del Padre · La estructura',       titulo: 'La',    script: 'estructura', frase: 'Lo que sostiene una casa rara vez se ve.' },
  bandera:  { label: 'Independencia · La bandera',          titulo: 'La',    script: 'bandera',    frase: 'Oro, noche y tierra: los tres colores ya eran materia antes de ser símbolo.' },
  amor:     { label: 'Amor y Amistad · El lazo',            titulo: 'El',    script: 'lazo',       frase: 'Un regalo es un nudo entre dos personas.' },
  penumbra: { label: 'Halloween · Penumbra elegante',       titulo: 'La',    script: 'penumbra',   frase: 'El oro solo se entiende cuando hay poca luz.' },
  urgencia: { label: 'Black Friday · Urgencia sin gritar',  titulo: 'El',    script: 'viernes',    frase: 'Un solo día, sin estridencia.' },
  fuego:    { label: 'Velitas y Navidad · Fuego pequeño',   titulo: 'Fuego', script: 'pequeño',    frase: 'Una luz se pasa a la siguiente y ninguna pierde nada.' }
};
const DIA = 86400000;
function fechaLarga(ms) {   // "sábado 31 de octubre"
  try { return new Date(ms).toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'America/Bogota' }).replace(',', ''); }
  catch (e) { return ''; }
}
function fechaCorta(ms) {   // "24 de octubre"
  try { return new Date(ms).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', timeZone: 'America/Bogota' }); }
  catch (e) { return ''; }
}
/* La fecha de apertura llega del navegador: solo se usa si es creíble
   (entre 45 días atrás y 120 adelante). Si no, el correo no la nombra. */
function contexto(id, abre) {
  const c = CAMPANAS[id];
  if (!c) return null;
  const ms = Number(abre), now = Date.now();
  const ok = isFinite(ms) && ms > now - 45 * DIA && ms < now + 120 * DIA;
  return Object.assign({ id: id, corto: c.label.split(' · ')[0] }, c, {
    fecha:   ok ? fechaLarga(ms) : '',
    encargo: ok ? fechaCorta(ms - 7 * DIA) : '',
    abierta: ok && ms <= now
  });
}
const INSTAGRAM_URL  = 'https://www.instagram.com/pretostoregold';
const INSTAGRAM_USER = '@pretostoregold';

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]
  ));
}

function eyebrow(t) {
  return `<p style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:2.5px;text-transform:uppercase;color:${GOLD};margin:0 0 14px;">${t}</p>`;
}
function rule() {
  return `<tr><td style="padding:34px 40px;"><div style="border-top:1px solid #e7e4dc;"></div></td></tr>`;
}

/* Una pieza de la selección: número, nombre, nota y enlace a su ficha. */
function pieza(num, nombre, nota, url, cta) {
  return `
  <table role="presentation" width="100%" style="border-collapse:collapse;margin:0 0 4px;">
    <tr>
      <td width="46" valign="top" style="padding:18px 0 18px 0;font-family:Georgia,serif;font-size:13px;color:${GOLD};letter-spacing:1px;">${num}</td>
      <td valign="top" style="padding:18px 0;border-bottom:1px solid #eceae4;">
        <p style="font-family:Georgia,serif;font-size:19px;line-height:1.3;color:${INK};margin:0 0 6px;">${nombre}</p>
        <p style="font-family:Arial,sans-serif;font-size:13px;line-height:1.65;color:#666;margin:0 0 10px;">${nota}</p>
        <a href="${url}" style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${GOLD};text-decoration:none;">${cta} &rarr;</a>
      </td>
    </tr>
  </table>`;
}

/* ── Plantilla del correo de la campaña ─────────────────────── */
function lazoEmail(ctx) {
  const amor = ctx.id === 'amor';
  const BG  = amor ? WINE : INK;     // septiembre conserva su vino; las demás, la casa
  const ACC = amor ? ROSE : GOLD;
  const para = 'font-family:Arial,sans-serif;font-size:15px;line-height:1.75;color:#444;margin:0 0 16px;';
  const li   = 'font-family:Arial,sans-serif;font-size:14px;line-height:1.7;color:#555;margin:0 0 9px;';

  return `
  <div style="margin:0;padding:0;background:${SOFT};">
    <table role="presentation" width="100%" style="border-collapse:collapse;background:${SOFT};"><tr><td style="padding:28px 14px;">
    <table role="presentation" width="600" align="center" style="border-collapse:collapse;max-width:600px;width:100%;margin:0 auto;background:${PAPER};">

      <!-- Encabezado -->
      <tr><td style="padding:36px 40px 26px;border-bottom:1px solid #eee;text-align:center;">
        <span style="font-family:Georgia,serif;font-size:30px;color:${INK};letter-spacing:4px;">PRETO</span>
        <div style="font-family:Georgia,serif;font-style:italic;font-size:13px;color:${GOLD};margin-top:6px;letter-spacing:1px;">by Dala&amp;Co.</div>
      </td></tr>

      <!-- Portada de la campaña -->
      <tr><td style="background:${BG};padding:46px 40px 44px;text-align:center;">
        <p style="font-family:Arial,sans-serif;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:${ACC};margin:0 0 20px;">${esc(ctx.corto)}${ctx.fecha ? ' &middot; ' + esc(ctx.fecha) : ''}</p>
        <p style="font-family:Georgia,serif;font-size:52px;line-height:1;color:${CREAM};margin:0 0 18px;">${esc(ctx.titulo)} <span style="font-style:italic;color:${ACC};">${esc(ctx.script)}</span></p>
        <p style="font-family:Georgia,serif;font-style:italic;font-size:16px;line-height:1.6;color:rgba(244,238,231,0.76);margin:0;">${esc(ctx.frase)}</p>
      </td></tr>

      <!-- Apertura -->
      <tr><td style="padding:40px 40px 0;">
        ${eyebrow(ctx.abierta ? 'La selecci&oacute;n est&aacute; abierta' : 'Su lugar est&aacute; guardado')}
        <p style="${para}">Gracias por dejarnos su correo. ${ctx.abierta
          ? `La selecci&oacute;n de ${esc(ctx.corto)} ya est&aacute; publicada.`
          : `Queda anotado para la selecci&oacute;n de ${esc(ctx.corto)}, que la casa publica ${ctx.fecha ? `el <strong style="color:${INK};">${esc(ctx.fecha)}</strong>` : 'muy pronto'}.`}</p>
        <p style="${para}">${ctx.abierta ? 'Estas' : 'Mientras llega la fecha, estas'} son las tres piezas que la casa reserva para este gesto. Cada una puede verse y encargarse desde hoy.</p>
      </td></tr>

      <!-- La selección -->
      <tr><td style="padding:26px 40px 0;">
        ${eyebrow('La selecci&oacute;n de la fecha')}
        ${pieza('01', 'Cadena Lazo &middot; Oro 18k', 'Dije floral de circones. Entrelazado fino, de ca&iacute;da fluida.', SITE + '/joyeria/cadena-lazo-oro-18k', 'Ver la pieza')}
        ${pieza('02', 'Pendiente Tr&eacute;bol Dala&amp;Co', 'Textura de rayos grabada a mano. Medida &uacute;nica de 5 mm.', SITE + '/joyeria/pendiente-trebol-dala-y-co', 'Ver la pieza')}
        ${pieza('03', 'Tarjeta de regalo', 'El monto lo elige quien la env&iacute;a. La pieza, quien la recibe.', SITE + '/#giftcard', 'Elegir el monto')}
      </td></tr>

      ${rule()}

      <!-- La cortesía de la casa -->
      <tr><td style="padding:0 40px;">
        <table role="presentation" width="100%" style="border-collapse:collapse;">
          <tr><td style="background:${INK};padding:38px 36px;text-align:center;">
            <p style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:2.5px;text-transform:uppercase;color:${GOLD};margin:0 0 16px;">La cortes&iacute;a de la casa</p>
            <p style="font-family:Georgia,serif;font-size:46px;line-height:1;color:#fff;margin:0 0 14px;">$150.000<span style="font-size:18px;color:${GOLD};letter-spacing:1px;"> COP</span></p>
            <p style="font-family:Arial,sans-serif;font-size:13px;line-height:1.7;color:rgba(255,255,255,0.65);margin:0 0 24px;">Su c&oacute;digo nace al crear su cuenta del C&iacute;rculo Preto y le llega al instante.<br/>Aplica en adquisiciones desde <strong style="color:#fff;">$2.300.000 COP</strong>.</p>
            <a href="${SITE}/#cuenta" style="display:inline-block;background:${GOLD};color:#0a0807;font-family:Arial,sans-serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;padding:15px 32px;">Crear mi cuenta &rarr;</a>
          </td></tr>
        </table>
      </td></tr>

      <!-- Condiciones -->
      <tr><td style="padding:34px 40px 0;">
        ${eyebrow('Lo que conviene saber')}
        <p style="${li}">&bull; ${ctx.abierta
          ? 'La selecci&oacute;n ya est&aacute; en la portada de la casa.'
          : (ctx.fecha ? `La selecci&oacute;n se publica el <strong>${esc(ctx.fecha)}</strong>. Le avisamos ese mismo d&iacute;a.` : 'Le avisamos el d&iacute;a que se publique la selecci&oacute;n.')}</p>
        <p style="${li}">&bull; La cortes&iacute;a de $150.000 es para la <strong>primera adquisici&oacute;n</strong> y vive en su cuenta.</p>
        <p style="${li}">&bull; Env&iacute;o nacional asegurado y empaque de la casa, sin costo adicional.</p>
        <p style="${li}">&bull; Para encargos a la medida, escriba al concierge ${(!ctx.abierta && ctx.encargo) ? 'antes del ' + esc(ctx.encargo) : 'con una semana de anticipaci&oacute;n'}.</p>
      </td></tr>

      ${rule()}

      <!-- Cierre -->
      <tr><td style="padding:0 40px 8px;">
        <p style="font-family:Georgia,serif;font-size:18px;line-height:1.5;color:${INK};margin:0 0 16px;">Si prefiere elegir acompa&ntilde;ado, el concierge est&aacute; para eso.</p>
        <p style="${para}">Un asesor de la casa puede ayudarle a escoger la pieza, la talla y el momento de la entrega.</p>
        <table role="presentation" style="border-collapse:collapse;margin:10px 0 4px;"><tr>
          <td style="padding:0 12px 12px 0;">
            <a href="${SITE}/#collections" style="display:inline-block;background:transparent;color:${INK};border:1px solid ${INK};font-family:Arial,sans-serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;padding:14px 28px;">Ver las colecciones</a>
          </td>
          <td style="padding:0 0 12px;">
            <a href="https://wa.me/${WA_NUMBER}" style="display:inline-block;background:transparent;color:${INK};border:1px solid ${INK};font-family:Arial,sans-serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;padding:14px 28px;">Hablar con un asesor</a>
          </td>
        </tr></table>
        <p style="font-family:Arial,sans-serif;font-size:14px;color:#777;margin:22px 0 4px;">Con aprecio,</p>
        <p style="font-family:Georgia,serif;font-size:17px;color:${INK};margin:0 0 2px;">PRETO by Dala&amp;Co.</p>
        <p style="font-family:Georgia,serif;font-style:italic;font-size:13px;color:${GOLD};margin:0;">Editorial Jewelry</p>
      </td></tr>

      <!-- Pie -->
      <tr><td style="padding:34px 40px 36px;border-top:1px solid #eee;text-align:center;background:${INK};">
        <p style="font-family:Georgia,serif;font-style:italic;font-size:13px;color:${GOLD};margin:0 0 18px;">Creado para quienes comprenden el valor de la exclusividad.</p>
        <a href="${INSTAGRAM_URL}" style="display:inline-block;text-decoration:none;font-family:Arial,sans-serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#fff;margin:0 0 16px;">
          <span style="color:${GOLD};">Instagram</span> &nbsp;${esc(INSTAGRAM_USER)} &nbsp;&rarr;
        </a>
        <p style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:1px;color:rgba(255,255,255,0.5);margin:14px 0 0;">Preto by Dala&amp;Co &middot; Hecho en Colombia &middot; pretogold.store</p>
        <p style="font-family:Arial,sans-serif;font-size:10px;line-height:1.6;color:rgba(255,255,255,0.35);margin:12px 0 0;">Recibe este correo porque dej&oacute; su direcci&oacute;n en la campa&ntilde;a de ${esc(ctx.corto)}. Para no recibir m&aacute;s, responda a este mensaje con la palabra BAJA.</p>
      </td></tr>

    </table>
    </td></tr></table>
  </div>`;
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
  const headers = {
    'Access-Control-Allow-Origin': (function () {
      const o = (event.headers && (event.headers.origin || event.headers.Origin)) || '';
      return originAllowed(o) ? o : 'https://pretogold.store';
    })(),
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: 'Método no permitido' };

  if (!RESEND_API_KEY) {
    console.error('lazo-email: falta la variable RESEND_API_KEY en Netlify.');
    return { statusCode: 500, headers, body: 'RESEND_API_KEY no configurada' };
  }

  const reqOrigin  = (event.headers && (event.headers.origin || event.headers.Origin)) || '';
  const internal   = (event.headers && event.headers['x-preto-internal']) || '';
  const isInternal = tokenOk(internal, BACKFILL_TOKEN);
  if (!isInternal && !originAllowed(reqOrigin)) {
    console.warn('lazo-email: origen rechazado:', reqOrigin || '(sin Origin)');
    return { statusCode: 403, headers, body: 'Origen no permitido' };
  }

  let data = {};
  try { data = JSON.parse(event.body || '{}'); }
  catch (e) { return { statusCode: 400, headers, body: 'Cuerpo inválido' }; }

  const correo = (data.correo || data.email || '').trim();
  if (!correo || correo.length > 200 || !/\S+@\S+\.\S+/.test(correo)) {
    return { statusCode: 400, headers, body: 'Correo inválido' };
  }
  const ctx = contexto(String(data.temporada || 'amor').trim().toLowerCase(), data.abre);
  if (!ctx) return { statusCode: 400, headers, body: 'Temporada inválida' };
  if (!isInternal && rateLimited(correo.toLowerCase())) {
    console.warn('lazo-email: límite de envíos alcanzado para', correo);
    return { statusCode: 429, headers, body: 'Demasiadas solicitudes. Intente más tarde.' };
  }

  try {
    const sent = await sendEmail({
      to: correo,
      replyTo: STORE_EMAIL,
      subject: ctx.id === 'amor'
        ? 'El lazo · Amor y Amistad en Preto by Dala&Co'
        : `${ctx.titulo} ${ctx.script} · ${ctx.corto} en Preto by Dala&Co`,
      html: lazoEmail(ctx)
    });
    console.log('lazo-email: promoción', ctx.id, 'enviada a', correo);
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true, id: sent }) };
  } catch (e) {
    console.error('lazo-email: error de envío:', e.message);
    return { statusCode: 502, headers, body: JSON.stringify({ ok: false, error: 'No se pudo enviar el correo. Intente de nuevo.' }) };
  }
};
