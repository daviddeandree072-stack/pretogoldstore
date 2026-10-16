/* ───────────────────────────────────────────────────────────────
   Preto by Dala&Co · Correo de BIENVENIDA con la cortesía de $150.000
   ───────────────────────────────────────────────────────────────
   A diferencia de submission-created.js (que dispara Netlify solo),
   esta función la LLAMA la web cuando un cliente CREA su cuenta:

     fetch('/.netlify/functions/welcome-email', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ correo, nombre, codigo })
     })

   Envía UN correo al cliente con su regalo de bienvenida (cortesía de
   $150.000 en su primera adquisición desde $2.300.000, más 500 puntos
   del Círculo Preto) y el código para presentarlo a su asesor.

   Variables de entorno (Site settings → Environment variables):
     RESEND_API_KEY  → clave de Resend ("re_...")
     FROM_EMAIL      → remitente verificado, ej:
                       Preto by Dala&Co <pedidos@pretogold.store>
   ─────────────────────────────────────────────────────────────── */


/* Comparación en tiempo constante: no deja medir la clave carácter a
   carácter por el tiempo de respuesta. */
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

/* ── Anti-abuso ─────────────────────────────────────────────
   Esta función es pública (la llama el navegador al crear cuenta);
   sin esto cualquiera podría usarla como relay de spam con tu
   remitente de Resend. Tres capas, ninguna toca el flujo real:
   1. Solo acepta peticiones desde TU web (cabecera Origin) o con el
      token interno (welcome-backfill, servidor a servidor).
   2. Límite de envíos por instancia contra ráfagas de bots.
   3. Tamaños acotados de nombre / código / correo.                  */
function originAllowed(origin) {
  if (!origin) return false;
  if (origin === 'https://pretogold.store' || origin === 'https://www.pretogold.store') return true;
  if (/^https:\/\/[a-z0-9-]+(--[a-z0-9-]+)?\.netlify\.app$/i.test(origin)) return true; // vistas previas Netlify
  if (/^http:\/\/localhost(:\d+)?$/.test(origin)) return true;                          // pruebas locales
  return false;
}
const RATE = { windowStart: 0, count: 0, perEmail: new Map() };
function rateLimited(email) {
  const now = Date.now();
  if (now - RATE.windowStart > 10 * 60 * 1000) { RATE.windowStart = now; RATE.count = 0; RATE.perEmail.clear(); }
  const per = (RATE.perEmail.get(email) || 0) + 1;
  RATE.perEmail.set(email, per);
  RATE.count++;
  return RATE.count > 30 || per > 3;
}

const GOLD  = '#967434';
const INK   = '#141414';
const PAPER = '#ffffff';
const SOFT  = '#f5f5f0';

const COLLECTION_URL = 'https://pretogold.store/#collections';
const INSTAGRAM_URL  = 'https://www.instagram.com/pretostoregold';
const INSTAGRAM_USER = '@pretostoregold';

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]
  ));
}

/* Detecta el género por el primer nombre (uso interno, solo para el
   saludo). Devuelve 'f', 'm' o null (desconocido → saludo neutro).
   Combina listas de nombres comunes en Colombia + la regla de
   terminación -a (femenino) / -o (masculino), con sus excepciones. */
function detectarGenero(nombre) {
  const first = String(nombre || '').trim().split(/\s+/)[0] || '';
  const n = first.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (!n) return null;
  // Femeninos que NO terminan en -a
  const FEM = new Set(['carmen','isabel','beatriz','raquel','ruth','esther','ester','noemi','abril','pilar','soledad','dolores','flor','azucena','mercedes','ines','lucero','guadalupe','belen','nazaret','consuelo','rocio','candelaria','caridad','estrella','maribel','yarisbel','maritza','yureimi','dayan']);
  // Masculinos que terminan en -a (la regla los confundiría)
  const MASC = new Set(['joshua','elias','matias','tobias','lucas','jonas','isaias','bautista','aleksa','nikola','akira']);
  if (FEM.has(n)) return 'f';
  if (MASC.has(n)) return 'm';
  if (/a$/.test(n)) return 'f';
  if (/[oóeéuú]$/.test(n)) return 'm';   // -o y la mayoría de -e/-u masculinos en CO
  return null;                            // desconocido → saludo neutro
}

/* Helpers de maquetación (estilo editorial, seguro para correo) */
function rule() {
  return `<tr><td style="padding:34px 40px;"><div style="border-top:1px solid #e7e4dc;"></div></td></tr>`;
}
function sectionTitle(t) {
  return `<p style="font-family:Georgia,serif;font-weight:normal;font-size:22px;line-height:1.25;color:${INK};margin:0 0 16px;">${t}</p>`;
}
function eyebrow(t) {
  return `<p style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:2.5px;text-transform:uppercase;color:${GOLD};margin:0 0 14px;">${t}</p>`;
}

/* ── Plantilla del correo de bienvenida ──────────────────────── */
function welcomeEmail(d) {
  const nombre = d.nombre || 'cliente';
  const codigo = d.codigo || 'MAISON150';
  const g = detectarGenero(d.nombre);
  const h1 = g === 'f' ? ('Bienvenida, ' + esc(nombre) + '.')
           : g === 'm' ? ('Bienvenido, ' + esc(nombre) + '.')
           :             ('Te damos la bienvenida, ' + esc(nombre) + '.');
  const para   = 'font-family:Arial,sans-serif;font-size:15px;line-height:1.75;color:#444;margin:0 0 16px;';
  const li     = 'font-family:Arial,sans-serif;font-size:14px;line-height:1.7;color:#555;margin:0 0 9px;padding-left:20px;position:relative;';
  const check  = `<span style="color:${GOLD};font-weight:bold;margin-right:10px;">✓</span>`;

  return `
  <div style="margin:0;padding:0;background:${SOFT};">
    <table role="presentation" width="100%" style="border-collapse:collapse;background:${SOFT};"><tr><td style="padding:28px 14px;">
    <table role="presentation" width="600" align="center" style="border-collapse:collapse;max-width:600px;width:100%;margin:0 auto;background:${PAPER};">

      <!-- Encabezado -->
      <tr><td style="padding:36px 40px 26px;border-bottom:1px solid #eee;text-align:center;">
        <span style="font-family:Georgia,serif;font-size:30px;color:${INK};letter-spacing:4px;">PRETO</span>
        <div style="font-family:Georgia,serif;font-style:italic;font-size:13px;color:${GOLD};margin-top:6px;letter-spacing:1px;">by Dala&amp;Co.</div>
      </td></tr>

      <!-- Bienvenida -->
      <tr><td style="padding:40px 40px 4px;">
        ${eyebrow('Bienvenida a la Maison')}
        <h1 style="font-family:Georgia,serif;font-weight:normal;font-size:30px;line-height:1.25;color:${INK};margin:0 0 10px;">${h1}</h1>
        <p style="font-family:Georgia,serif;font-style:italic;font-size:16px;line-height:1.6;color:${GOLD};margin:0 0 24px;">Tu acceso a una experiencia creada para quienes comprenden el valor de la exclusividad.</p>
        <p style="${para}">Nos honra darte la bienvenida a <strong style="color:${INK};">Preto by Dala&amp;Co.</strong></p>
        <p style="${para}">Cada una de nuestras creaciones nace de la unión entre la alta joyería contemporánea, la artesanía y una identidad que trasciende tendencias. Desde hoy formas parte de una comunidad que aprecia el lujo auténtico, el diseño excepcional y las piezas concebidas para perdurar.</p>
        <p style="${para}">Como muestra de nuestra bienvenida, la Maison ha reservado para ti un gesto exclusivo que te acompañará en tu primera adquisición.</p>
      </td></tr>

      <!-- Gesto de la Maison (bloque oscuro) -->
      <tr><td style="padding:30px 40px 0;">
        <table role="presentation" width="100%" style="border-collapse:collapse;">
          <tr><td style="background:${INK};padding:38px 36px;text-align:center;">
            <p style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:2.5px;text-transform:uppercase;color:${GOLD};margin:0 0 16px;">Un gesto de la Maison</p>
            <p style="font-family:Arial,sans-serif;font-size:12px;line-height:1.6;color:rgba(255,255,255,0.65);margin:0 0 10px;">Como muestra de nuestra bienvenida, hemos reservado para ti una cortesía de</p>
            <p style="font-family:Georgia,serif;font-size:46px;line-height:1;color:#fff;margin:0 0 14px;">$150.000<span style="font-size:18px;color:${GOLD};letter-spacing:1px;"> COP</span></p>
            <p style="font-family:Arial,sans-serif;font-size:13px;line-height:1.6;color:rgba(255,255,255,0.65);margin:0 0 22px;">para tu <strong style="color:#fff;">primera adquisición</strong> en cualquiera de nuestras colecciones<br/><span style="font-family:Georgia,serif;font-style:italic;font-size:16px;color:${GOLD};">Preto</span> <span style="color:rgba(255,255,255,0.4);">·</span> <span style="font-family:Georgia,serif;font-style:italic;font-size:16px;color:${GOLD};">Dala&amp;Co.</span></p>
            <p style="font-family:Arial,sans-serif;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.5);margin:0 0 8px;">Código exclusivo</p>
            <div style="display:inline-block;background:rgba(255,255,255,0.06);border:1px dashed ${GOLD};padding:14px 30px;font-family:'Courier New',monospace;font-size:24px;letter-spacing:5px;color:#fff;">${esc(codigo)}</div>
          </td></tr>
        </table>
      </td></tr>

      <!-- Condiciones -->
      <tr><td style="padding:34px 40px 0;">
        ${eyebrow('Condiciones del beneficio')}
        <p style="${li}">• Exclusivo para tu <strong>primera adquisición</strong>.</p>
        <p style="${li}">• Válido para piezas de las colecciones <strong>Preto</strong> y <strong>Dala&amp;Co.</strong></p>
        <p style="${li}">• Aplica para adquisiciones iguales o superiores a <strong>$2.300.000 COP</strong>.</p>
        <p style="${li}">• Vigencia de <strong>30 días</strong> a partir de la recepción de este correo.</p>
        <p style="${li}">• No acumulable con otros beneficios, promociones o descuentos.</p>
      </td></tr>

      ${rule()}

      <!-- Colecciones -->
      <tr><td style="padding:0 40px;">
        ${sectionTitle('Descubre nuestras colecciones')}
        <p style="font-family:Georgia,serif;font-style:italic;font-size:15px;color:${GOLD};margin:0 0 22px;">Dos expresiones del lujo. Una misma Maison.</p>
        <p style="${para}"><strong style="color:${INK};">Dala&amp;Co.</strong> representa la elegancia atemporal y el refinamiento clásico.</p>
        <p style="${para}"><strong style="color:${INK};">Preto</strong> expresa una visión contemporánea, audaz y con una identidad única.</p>
        <p style="${para}">Sea cual sea la colección que elijas, cada pieza ha sido concebida para trascender el tiempo y acompañarte durante toda una vida.</p>
        <!-- Botones -->
        <table role="presentation" style="border-collapse:collapse;margin:10px 0 4px;"><tr>
          <td style="padding:0 12px 12px 0;">
            <a href="${COLLECTION_URL}" style="display:inline-block;background:${GOLD};color:#0a0807;font-family:Arial,sans-serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;padding:15px 30px;">Explorar la Maison →</a>
          </td>
          <td style="padding:0 0 12px;">
            <a href="https://wa.me/${WA_NUMBER}" style="display:inline-block;background:transparent;color:${INK};border:1px solid ${INK};font-family:Arial,sans-serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;padding:14px 30px;">Hablar con un asesor</a>
          </td>
        </tr></table>
      </td></tr>

      ${rule()}

      <!-- Experiencia PRETO -->
      <tr><td style="padding:0 40px;">
        ${sectionTitle('La experiencia PRETO')}
        <p style="${li}">${check}Oro de 18 quilates certificado.</p>
        <p style="${li}">${check}Garantía de por vida en cada pieza.</p>
        <p style="${li}">${check}Elaboración artesanal con altos estándares de calidad.</p>
        <p style="${li}">${check}Envíos nacionales asegurados.</p>
        <p style="${li}">${check}Presentación editorial y empaque de lujo.</p>
        <p style="${li}">${check}Atención personalizada antes, durante y después de tu adquisición.</p>
      </td></tr>

      ${rule()}

      <!-- Cómo usar la cortesía -->
      <tr><td style="padding:0 40px;">
        ${sectionTitle('¿Cómo utilizar tu cortesía?')}
        <p style="${para}"><strong style="color:${GOLD};">1.</strong> Explora las colecciones <strong style="color:${INK};">Preto</strong> y <strong style="color:${INK};">Dala&amp;Co.</strong></p>
        <p style="${para}"><strong style="color:${GOLD};">2.</strong> Elige la pieza que mejor represente tu estilo.</p>
        <p style="${para}"><strong style="color:${GOLD};">3.</strong> Ingresa el código <strong style="color:${INK};">${esc(codigo)}</strong> al finalizar tu pedido.</p>
        <p style="${para}"><strong style="color:${GOLD};">4.</strong> Si tu adquisición es igual o superior a <strong>$2.300.000 COP</strong>, la cortesía de <strong>$150.000 COP</strong> será aplicada automáticamente.</p>
      </td></tr>

      ${rule()}

      <!-- Cierre -->
      <tr><td style="padding:0 40px 8px;">
        ${sectionTitle('Una experiencia que continúa')}
        <p style="${para}">Al crear tu cuenta podrás guardar tus piezas favoritas, consultar el estado de tus pedidos y acceder de forma prioritaria a futuras colecciones, lanzamientos y experiencias exclusivas de la Maison.</p>
        <p style="font-family:Georgia,serif;font-size:18px;line-height:1.5;color:${INK};margin:24px 0 16px;">Toda gran historia comienza con una primera pieza.</p>
        <p style="${para}">Esperamos que esta sea la primera de muchas creaciones que formen parte de tu historia con <strong style="color:${INK};">Preto by Dala&amp;Co.</strong></p>
        <p style="font-family:Arial,sans-serif;font-size:14px;color:#777;margin:22px 0 4px;">Con aprecio,</p>
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
  // CORS acotado: se devuelve el origen concreto de la casa, nunca '*'.
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
    console.error('Falta la variable RESEND_API_KEY en Netlify.');
    return { statusCode: 500, headers, body: 'RESEND_API_KEY no configurada' };
  }

  // ── Puerta anti-abuso: mismo dominio o token interno ──
  const reqOrigin  = (event.headers && (event.headers.origin || event.headers.Origin)) || '';
  const internal   = (event.headers && event.headers['x-preto-internal']) || '';
  const isInternal = tokenOk(internal, BACKFILL_TOKEN);
  if (!isInternal && !originAllowed(reqOrigin)) {
    console.warn('welcome-email: origen rechazado:', reqOrigin || '(sin Origin)');
    return { statusCode: 403, headers, body: 'Origen no permitido' };
  }

  let data = {};
  try { data = JSON.parse(event.body || '{}'); }
  catch (e) { return { statusCode: 400, headers, body: 'Cuerpo inválido' }; }

  const correo = (data.correo || data.email || '').trim();
  if (!correo || correo.length > 200 || !/\S+@\S+\.\S+/.test(correo)) {
    return { statusCode: 400, headers, body: 'Correo inválido' };
  }
  if (!isInternal && rateLimited(correo.toLowerCase())) {
    console.warn('welcome-email: límite de envíos alcanzado para', correo);
    return { statusCode: 429, headers, body: 'Demasiadas solicitudes. Intenta más tarde.' };
  }
  const nombre = String(data.nombre || '').slice(0, 80);
  const codigo = String(data.codigo || '').slice(0, 40);

  try {
    const sent = await sendEmail({
      to: correo,
      replyTo: STORE_EMAIL,
      subject: 'Un gesto de la Maison · Preto by Dala&Co',
      html: welcomeEmail({ nombre: nombre, codigo: codigo })
    });
    console.log('Correo de bienvenida enviado a', correo);
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true, id: sent }) };
  } catch (e) {
    console.error('Error correo bienvenida:', e.message);
    return { statusCode: 502, headers, body: JSON.stringify({ ok: false, error: 'No se pudo enviar el correo. Intente de nuevo.' }) };
  }
};
