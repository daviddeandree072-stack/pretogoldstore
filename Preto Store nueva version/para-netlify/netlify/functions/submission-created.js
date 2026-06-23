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
const STORE_EMAIL    = process.env.STORE_EMAIL || 'daviddeandree072@gmail.com';
const WA_NUMBER      = '573226955451';

const GOLD = '#967434';
const INK  = '#141414';
const PAPER = '#ffffff';
const SOFT = '#f5f5f0';

/* Cuentas para el pago (las mismas de facturacion.html) */
const BANK = [
  { name: 'Bancolombia · Ahorros', num: '912-395939-71', sub: 'David Andrés Lozano Mena' },
  { name: 'Nequi',                 num: '322 695 5451',  sub: 'David Andrés Lozano Mena' },
  { name: 'Nu · Llave',            num: '@DLM777',        sub: 'Transferencia con llave' }
];

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]
  ));
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

function bankHtml() {
  return BANK.map(b => `
    <tr>
      <td style="padding:9px 0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:${GOLD};">${esc(b.name)}</td>
      <td style="padding:9px 0;font-family:Georgia,serif;font-size:16px;color:${INK};text-align:right;">${esc(b.num)}</td>
    </tr>
    <tr><td colspan="2" style="padding:0 0 9px;font-family:Arial,sans-serif;font-size:11px;color:#999;border-bottom:1px solid #eee;">${esc(b.sub)}</td></tr>
  `).join('');
}

/* ── Plantilla del correo al CLIENTE ─────────────────────────── */
function clienteEmail(d) {
  const nombre = d.nombre || 'cliente';
  return `
  <div style="margin:0;padding:0;background:${SOFT};">
    <div style="max-width:600px;margin:0 auto;background:${PAPER};">
      <div style="padding:34px 40px 22px;border-bottom:1px solid #eee;">
        <span style="font-family:Georgia,serif;font-size:26px;color:${INK};letter-spacing:1px;">PRETO</span>
        <span style="font-family:Georgia,serif;font-style:italic;font-size:13px;color:${GOLD};margin-left:8px;">by Dala&amp;Co</span>
      </div>
      <div style="padding:38px 40px;">
        <p style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${GOLD};margin:0 0 14px;">Cotización recibida</p>
        <h1 style="font-family:Georgia,serif;font-weight:normal;font-size:30px;line-height:1.2;color:${INK};margin:0 0 18px;">Gracias, ${esc(nombre)}.</h1>
        <p style="font-family:Arial,sans-serif;font-size:15px;line-height:1.7;color:#444;margin:0 0 28px;">
          Hemos recibido su cotización. Un asesor de la casa le atenderá por WhatsApp muy pronto.
          A continuación, el detalle de su solicitud y los datos para su pago.
        </p>

        <p style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${GOLD};margin:0 0 6px;">Su cotización</p>
        <div style="border-top:2px solid ${INK};margin-bottom:30px;">
          ${pedidoToHtml(d.cotizacion_detalle || d.pedido)}
        </div>

        <p style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${GOLD};margin:0 0 10px;">Datos para su pago</p>
        <table style="width:100%;border-collapse:collapse;border-top:2px solid ${INK};margin-bottom:8px;">${bankHtml()}</table>
        <p style="font-family:Arial,sans-serif;font-size:12px;color:#999;margin:10px 0 30px;">Envío nacional sin costo · Solo se cobra el seguro del producto. Envíenos el comprobante por WhatsApp.</p>

        <a href="https://wa.me/${WA_NUMBER}" style="display:inline-block;background:${GOLD};color:#0a0807;font-family:Arial,sans-serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;padding:15px 34px;">Continuar por WhatsApp →</a>
      </div>
      <div style="padding:24px 40px;border-top:1px solid #eee;text-align:center;">
        <p style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:1px;color:#999;margin:0;">Preto by Dala&amp;Co · Hecho en Colombia · pretogold.store</p>
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
      <span style="font-family:Arial,sans-serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:${GOLD};">Nueva cotización</span>
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
      </table>
      <p style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${GOLD};margin:24px 0 6px;">Pedido</p>
      <div style="border-top:1px solid #eee;">${pedidoToHtml(d.cotizacion_detalle || d.pedido)}</div>
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
  if (!RESEND_API_KEY) {
    console.error('Falta la variable RESEND_API_KEY en Netlify.');
    return { statusCode: 500, body: 'RESEND_API_KEY no configurada' };
  }

  let data = {};
  try {
    const parsed = JSON.parse(event.body || '{}');
    data = (parsed.payload && parsed.payload.data) || parsed.data || parsed || {};
  } catch (e) {
    console.error('No se pudo leer el envío:', e.message);
    return { statusCode: 400, body: 'Cuerpo inválido' };
  }

  const results = { cliente: null, tienda: null, errores: [] };

  // 1) Correo al CLIENTE (si dejó correo válido)
  if (data.correo && /\S+@\S+\.\S+/.test(data.correo)) {
    try {
      results.cliente = await sendEmail({
        to: data.correo,
        replyTo: STORE_EMAIL,
        subject: 'Hemos recibido tu cotización · Preto by Dala&Co',
        html: clienteEmail(data)
      });
    } catch (e) {
      console.error('Error correo cliente:', e.message);
      results.errores.push('cliente: ' + e.message);
    }
  }

  // 2) Copia interna a la TIENDA
  try {
    results.tienda = await sendEmail({
      to: STORE_EMAIL,
      replyTo: data.correo || undefined,
      subject: `🔔 Nueva cotización — ${data.nombre || 'Cliente'}`,
      html: tiendaEmail(data)
    });
  } catch (e) {
    console.error('Error correo tienda:', e.message);
    results.errores.push('tienda: ' + e.message);
  }

  console.log('Cotización procesada:', JSON.stringify(results));
  return {
    statusCode: results.errores.length ? 207 : 200,
    body: JSON.stringify(results)
  };
};
