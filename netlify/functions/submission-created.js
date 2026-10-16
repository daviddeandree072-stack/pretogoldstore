/* ───────────────────────────────────────────────────────────────
   Preto by Dala&Co · Correo automático de cotización con Resend
   ───────────────────────────────────────────────────────────────
   Esta función la dispara Netlify SOLA cada vez que un cliente
   envía el formulario "facturacion" (data-netlify="true").
   No hay que llamarla desde la página: Netlify la ejecuta al
   recibir el envío. Aquí enviamos DOS correos con Resend:
     1) Al CLIENTE  → confirmación con su cotización + datos de pago.
     2) A LA TIENDA → aviso con todos los datos del pedido.

   Variables de entorno que debes configurar en Netlify
   (Site settings → Environment variables):
     RESEND_API_KEY  → tu clave de Resend (empieza por "re_...")
     FROM_EMAIL      → remitente verificado, ej:
                       Preto by Dala&Co <pedidos@pretogold.store>
     STORE_EMAIL     → tu correo, donde quieres la copia interna
   ─────────────────────────────────────────────────────────────── */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL     = process.env.FROM_EMAIL  || 'Preto by Dala&Co <onboarding@resend.dev>';
const STORE_EMAIL    = process.env.STORE_EMAIL || 'pretobydalaco@gmail.com';

/* ── Quién puede disparar esta función ────────────────────────────
   La web NO la llama directamente: publica el formulario en "/" y es
   Netlify Forms quien invoca la función con su propio sobre
   ({ payload: { data, form_name } }). Por eso exigimos ese sobre y,
   si la llamada viene de un navegador, que el Origin sea de la casa.
   Antes cualquiera podía hacer un POST con { correo } y usar nuestro
   dominio verificado para mandar correos a quien quisiera. */
const { originAllowed, reqOrigin, limiter, emailValido, cut } = require('../seguridad.js');
const limite = limiter({ max: 25, minutes: 10 });
const WA_NUMBER      = '573226955451';

const GOLD = '#967434';
const INK  = '#141414';
const PAPER = '#ffffff';
const SOFT = '#f5f5f0';

/* Los datos de transferencia NO viven en el código ni en los correos:
   los comparte un asesor desde el WhatsApp oficial de la casa. */
const WA = '+57 322 695 5451';

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]
  ));
}

/* ── Dinero ───────────────────────────────────────────────────
   Los totales llegan del formulario como enteros en pesos
   (subtotal, seguro, descuento, total). Si no vienen — pedidos
   antiguos o piezas bajo cotización — el bloque no se dibuja. */
function num(v) {
  const n = Number(String(v == null ? '' : v).replace(/[^\d-]/g, ''));
  return isFinite(n) ? n : 0;
}
function fmtCOP(n) {
  try { return '$' + Math.round(n).toLocaleString('es-CO'); } catch (e) { return '$' + Math.round(n); }
}

/* ¿Pagó en línea con Bold o va a transferir? De eso depende todo
   el correo: con Bold no hay que mostrar cuentas bancarias. */
function esBold(d) {
  return /bold/i.test(String(d.metodo_pago || '')) || !!String(d.bold_order_id || '').trim();
}

function totalesHtml(d) {
  const total = num(d.total);
  if (!total) return '';
  const sub  = num(d.subtotal);
  const seg  = num(d.seguro);
  const desc = num(d.descuento);
  const fila = (k, v, color) => `<tr><td style="padding:7px 0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#999;">${esc(k)}</td><td style="padding:7px 0;font-family:Georgia,serif;font-size:15px;color:${color || INK};text-align:right;">${esc(v)}</td></tr>`;
  return `
    <table style="width:100%;border-collapse:collapse;border-top:2px solid ${INK};margin-bottom:8px;">
      ${sub ? fila('Subtotal', fmtCOP(sub)) : ''}
      ${seg ? fila('Seguro del envío', fmtCOP(seg)) : ''}
      ${desc ? fila('Cortesía' + (d.codigo_cortesia ? ' ' + d.codigo_cortesia : ''), '−' + fmtCOP(desc), '#1f7a44') : ''}
      <tr><td style="padding:12px 0 0;border-top:1px solid #eee;font-family:Arial,sans-serif;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${INK};font-weight:bold;">Total</td><td style="padding:12px 0 0;border-top:1px solid #eee;font-family:Georgia,serif;font-size:21px;color:${INK};text-align:right;">${esc(fmtCOP(total))}</td></tr>
    </table>
    <p style="font-family:Arial,sans-serif;font-size:12px;color:#999;margin:8px 0 30px;">Envío nacional sin costo · Solo se cobra el seguro del producto.</p>`;
}

/* Convierte el texto del pedido (líneas) en filas HTML legibles */
function pedidoToHtml(texto) {
  if (!texto) return '<p style="margin:0;color:#777;font-style:italic;">Solicitud de asesoría — sin piezas seleccionadas.</p>';
  const lines = String(texto).split('\n').filter(l => l.trim());
  return lines.map(l => {
    const sub = /^\s+/.test(l) || l.trim().startsWith('↳');
    return `<div style="padding:7px 0;border-top:1px solid #eee;font-family:Georgia,serif;font-size:15px;color:${INK};${sub ? 'padding-left:18px;color:#777;font-style:italic;font-size:13px;border-top:none;' : ''}">${esc(l.trim())}</div>`;
  }).join('');
}

/* ── Plantilla del correo al CLIENTE ─────────────────────────── */
function clienteEmail(d) {
  const nombre = d.nombre || 'cliente';
  const bold = esBold(d);
  const ref = String(d.bold_order_id || '').trim();

  /* Datos fiscales: son los que se usan para la factura de venta,
     así que van en el comprobante aunque el cliente sea invitado. */
  const doc = ((d.tipo_documento || '') + ' ' + (d.numero_documento || '')).trim();
  const dato = (k, v) => v ? `<tr><td style="padding:5px 16px 5px 0;font-family:Arial,sans-serif;font-size:10px;letter-spacing:1px;text-transform:uppercase;color:#6b665e;white-space:nowrap;">${esc(k)}</td><td style="padding:5px 0;font-family:Georgia,serif;font-size:14px;color:${INK};">${esc(v)}</td></tr>` : '';

  /* Con Bold no hay transferencia que hacer: el cobro ya va por la
     pasarela. Mostrar cuentas bancarias aquí confundía al cliente
     (y hacía que algunos pagaran dos veces). */
  const pago = bold ? `
        <p style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${GOLD};margin:0 0 10px;">Su pago</p>
        <div style="border-top:2px solid ${INK};padding:16px 0 0;">
          <p style="font-family:Georgia,serif;font-size:16px;color:${INK};margin:0 0 8px;">Pago en línea con Bold · tarjeta, PSE o Nequi.</p>
          <p style="font-family:Arial,sans-serif;font-size:14px;line-height:1.7;color:#444;margin:0;">No hace falta transferencia. En cuanto Bold confirme la transacción le enviamos a este mismo correo el <b>comprobante de pago</b> de su pedido.</p>
        </div>
        <p style="font-family:Arial,sans-serif;font-size:12px;color:#999;margin:14px 0 30px;">Si el pago no llegó a completarse, escríbanos por WhatsApp y lo retomamos sin perder su pedido.</p>`
    : `
        <p style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${GOLD};margin:0 0 10px;">¿Cómo pago?</p>
        <div style="border-top:2px solid ${INK};padding:16px 0 0;">
          <p style="font-family:Georgia,serif;font-size:16px;color:${INK};margin:0 0 8px;">Un asesor le escribe para confirmar su pedido.</p>
          <p style="font-family:Arial,sans-serif;font-size:14px;line-height:1.7;color:#444;margin:0;">Los datos de pago se comparten <b>únicamente</b> desde el WhatsApp oficial de la casa, ${esc(WA)}. Desconfíe de cualquier otro número o cuenta.</p>
        </div>
        <p style="font-family:Arial,sans-serif;font-size:12px;color:#999;margin:14px 0 30px;">Envío nacional sin costo · Solo se cobra el seguro del producto.</p>`;

  return `
  <div style="margin:0;padding:0;background:${SOFT};">
    <div style="max-width:600px;margin:0 auto;background:${PAPER};">
      <div style="padding:34px 40px 22px;border-bottom:1px solid #eee;">
        <span style="font-family:Georgia,serif;font-size:26px;color:${INK};letter-spacing:1px;">PRETO</span>
        <span style="font-family:Georgia,serif;font-style:italic;font-size:13px;color:${GOLD};margin-left:8px;">by Dala&amp;Co</span>
      </div>
      <div style="padding:38px 40px;">
        <p style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${GOLD};margin:0 0 14px;">Comprobante de compra</p>
        <h1 style="font-family:Georgia,serif;font-weight:normal;font-size:30px;line-height:1.2;color:${INK};margin:0 0 18px;">Gracias, ${esc(nombre)}.</h1>
        <p style="font-family:Arial,sans-serif;font-size:15px;line-height:1.7;color:#444;margin:0 0 28px;">
          ${bold
            ? 'Hemos registrado su compra y su pago en línea está en proceso. Un asesor de la casa le escribirá por WhatsApp para reconfirmar medida y detalles. Este correo es su comprobante.'
            : 'Hemos recibido su compra. Un asesor de la casa le atenderá por WhatsApp muy pronto. A continuación, el detalle y los datos para su pago.'}
        </p>

        ${ref ? `<table style="width:100%;border-collapse:collapse;margin:0 0 24px;">${dato('Referencia', ref)}${dato('Método de pago', d.metodo_pago)}</table>` : ''}

        <p style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${GOLD};margin:0 0 6px;">Su compra</p>
        <div style="border-top:2px solid ${INK};margin-bottom:${num(d.total) ? '18px' : '30px'};">
          ${pedidoToHtml(d.cotizacion_detalle || d.pedido)}
        </div>

        ${totalesHtml(d)}

        ${pago}

        ${doc ? `<p style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${GOLD};margin:0 0 6px;">A nombre de</p>
        <table style="width:100%;border-collapse:collapse;border-top:1px solid #eee;margin:0 0 28px;">
          ${dato('Titular', d.nombre)}${dato('Documento', doc)}${dato('Correo', d.correo)}${dato('Ciudad', d.ciudad)}${dato('Dirección', d.direccion)}
        </table>` : ''}

        <a href="https://wa.me/${WA_NUMBER}" style="display:inline-block;background:${GOLD};color:#0a0807;font-family:Arial,sans-serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;padding:15px 34px;">Continuar por WhatsApp →</a>
      </div>
      <div style="padding:24px 40px;border-top:1px solid #eee;text-align:center;">
        <p style="font-family:Arial,sans-serif;font-size:11px;line-height:1.7;color:#999;margin:0;">Conserve este correo: es el comprobante de su compra. Al confirmarse el pago recibirá su <b>Tarjeta de Propiedad</b> — certificado de autenticidad en oro 18k y garantía de por vida.<br>Preto by Dala&amp;Co · Hecho en Colombia · pretogold.store</p>
      </div>
    </div>
  </div>`;
}

/* ── Plantilla del correo a la TIENDA ────────────────────────── */
function tiendaEmail(d) {
  const row = (k, v) => v ? `<tr><td style="padding:7px 14px 7px 0;font-family:Arial,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#999;white-space:nowrap;">${esc(k)}</td><td style="padding:7px 0;font-family:Georgia,serif;font-size:15px;color:${INK};">${esc(v)}</td></tr>` : '';
  return `
  <div style="max-width:600px;margin:0 auto;background:${PAPER};border:1px solid #eee;">
    <div style="padding:24px 32px;background:${INK};">
      <span style="font-family:Arial,sans-serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:${GOLD};">Nuevo pedido · ${esBold(d) ? 'Bold (en línea)' : 'Transferencia'}</span>
      <div style="font-family:Georgia,serif;font-size:22px;color:#fff;margin-top:4px;">${esc(d.nombre || 'Cliente')}</div>
    </div>
    <div style="padding:28px 32px;">
      <table style="width:100%;border-collapse:collapse;">
        ${row('Nombre', d.nombre)}
        ${row('Documento', ((d.tipo_documento || '') + ' ' + (d.numero_documento || '')).trim())}
        ${row('Teléfono', d.telefono)}
        ${row('Correo', d.correo)}
        ${row('Ciudad', d.ciudad)}
        ${row('Dirección', d.direccion)}
        ${row('Método de pago', d.metodo_pago)}
        ${row('Referencia Bold', d.bold_order_id)}
        ${row('Cortesía', d.codigo_cortesia ? d.codigo_cortesia + ' (' + (d.cortesia_aplicada || '') + ')' : '')}
      </table>
      <p style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${GOLD};margin:24px 0 6px;">Pedido</p>
      <div style="border-top:1px solid #eee;">${pedidoToHtml(d.cotizacion_detalle || d.pedido)}</div>
      ${totalesHtml(d)}
      ${d.notas ? `<p style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${GOLD};margin:22px 0 6px;">Notas</p><p style="font-family:Georgia,serif;font-size:15px;color:${INK};margin:0;">${esc(d.notas)}</p>` : ''}
      ${d.correo ? `<a href="mailto:${esc(d.correo)}" style="display:inline-block;margin-top:24px;font-family:Arial,sans-serif;font-size:12px;letter-spacing:1px;color:${GOLD};">Responder a ${esc(d.correo)} →</a>` : ''}
    </div>
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
  if (event.httpMethod && event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Método no permitido' };
  }
  if (!RESEND_API_KEY) {
    console.error('Falta la variable RESEND_API_KEY en Netlify.');
    return { statusCode: 500, body: 'No disponible' };
  }
  if (limite()) {
    console.warn('submission-created: límite de envíos alcanzado.');
    return { statusCode: 429, body: 'Demasiadas solicitudes' };
  }

  const origin = reqOrigin(event);
  if (origin && !originAllowed(origin)) {
    console.warn('submission-created: origen rechazado:', origin);
    return { statusCode: 403, body: 'Origen no permitido' };
  }

  let data = {};
  try {
    const parsed = JSON.parse(event.body || '{}');
    // Solo se acepta el sobre de Netlify Forms.
    const envelope = parsed.payload && typeof parsed.payload === 'object' ? parsed.payload : null;
    if (!envelope || typeof envelope.data !== 'object' || !envelope.data) {
      console.warn('submission-created: llamada directa sin sobre de Netlify Forms.');
      return { statusCode: 403, body: 'Solicitud no válida' };
    }
    data = envelope.data;
  } catch (e) {
    console.error('No se pudo leer el envío:', e.message);
    return { statusCode: 400, body: 'Cuerpo inválido' };
  }

  /* Todo lo que entra en los correos queda acotado en tamaño y sin
     caracteres de control. El escapado de HTML ya lo hace esc(). */
  data = Object.assign({}, data, {
    nombre:            cut(data.nombre, 80),
    correo:            cut(data.correo, 190),
    telefono:          cut(data.telefono, 40),
    ciudad:            cut(data.ciudad, 80),
    direccion:         cut(data.direccion, 160),
    tipo_documento:    cut(data.tipo_documento, 20),
    numero_documento:  cut(data.numero_documento, 30),
    notas:             cut(data.notas, 600),
    cotizacion_detalle: cut(data.cotizacion_detalle, 4000),
    pedido:            cut(data.pedido, 4000),
    metodo_pago:       cut(data.metodo_pago, 40),
    bold_order_id:     cut(data.bold_order_id, 40),
    codigo_cortesia:   cut(data.codigo_cortesia, 40),
    cortesia_aplicada: cut(data.cortesia_aplicada, 40),
    subtotal:          cut(data.subtotal, 16),
    seguro:            cut(data.seguro, 16),
    descuento:         cut(data.descuento, 16),
    total:             cut(data.total, 16)
  });

  const results = { cliente: null, tienda: null, errores: [] };

  // 1) Correo al CLIENTE — su comprobante de compra. Se envía con
  //    cuenta o sin ella: basta con el correo del formulario.
  if (emailValido(data.correo)) {
    try {
      results.cliente = await sendEmail({
        to: data.correo,
        replyTo: STORE_EMAIL,
        subject: (esBold(data) ? 'Su compra · comprobante' : 'Hemos recibido su compra')
          + (num(data.total) ? ' por ' + fmtCOP(num(data.total)) : '')
          + ' · Preto by Dala&Co',
        html: clienteEmail(data)
      });
    } catch (e) {
      console.error('Error correo cliente:', (e && (e.stack || e.message)) || e);
      results.errores.push('cliente');
    }
  }

  // 2) Copia interna a la TIENDA
  try {
    results.tienda = await sendEmail({
      to: STORE_EMAIL,
      replyTo: data.correo || undefined,
      subject: `🔔 Nuevo pedido — ${data.nombre || 'Cliente'}`
        + (num(data.total) ? ` · ${fmtCOP(num(data.total))}` : '')
        + (esBold(data) ? ' · Bold' : ' · Transferencia'),
      html: tiendaEmail(data)
    });
  } catch (e) {
    console.error('Error correo tienda:', (e && (e.stack || e.message)) || e);
    results.errores.push('tienda');
  }

  console.log('Cotización procesada:', JSON.stringify(results));
  // Al exterior solo el resultado, nunca el detalle del proveedor.
  return {
    statusCode: results.errores.length ? 207 : 200,
    body: JSON.stringify({ ok: !results.errores.length, fallos: results.errores })
  };
};
