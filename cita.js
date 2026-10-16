/* ───────────────────────────────────────────────────────────────
   Preto by Dala&Co · CITA PRIVADA — agenda real
   ───────────────────────────────────────────────────────────────
   Auditoría ago-2026 · punto 2 de la fase 2. Antes, «Reservar cita
   privada» era un ancla a #contact (el boletín): el cliente que
   quería ver una pieza acabab en un campo de correo. Ahora abre un
   panel con cinco datos —pieza, día, franja, canal y contacto— y
   dispara el correo por la función que ya existía para Resend.

   Se abre desde:
     · cualquier elemento con  data-cita="Nombre de la pieza"
     · cualquier enlace a      href="#cita"
     · por código:             PretoCita.open('Rosario Clásico')

   Si la función de correo no responde (o falta la clave de Resend),
   NO se pierde la solicitud: cae al concierge de WhatsApp con el
   resumen ya escrito.
   ─────────────────────────────────────────────────────────────── */
(function () {
  'use strict';
  if (window.PretoCita) return;

  var WA = '573226955451';
  var FRANJAS = ['Mañana · 9–12', 'Tarde · 12–17', 'Noche · 17–20'];
  var CANALES = ['WhatsApp', 'Llamada', 'Videollamada', 'En el atelier'];

  var CSS = [
    '.cita-veil{position:fixed;inset:0;z-index:1400;background:rgba(9,7,5,.72);backdrop-filter:blur(3px);opacity:0;pointer-events:none;transition:opacity .4s ease}',
    '.cita-panel{position:fixed;z-index:1401;top:0;right:0;bottom:0;width:min(460px,100%);display:flex;flex-direction:column;background:var(--paper,#111);border-left:1px solid rgba(182,141,64,.3);transform:translateX(101%);transition:transform .5s cubic-bezier(.22,1,.36,1);overflow-y:auto;overscroll-behavior:contain}',
    '.cita-open .cita-veil{opacity:1;pointer-events:auto}',
    '.cita-open .cita-panel{transform:none}',
    '.cita-head{padding:clamp(28px,5vw,40px) clamp(24px,5vw,38px) 22px;border-bottom:1px solid rgba(182,141,64,.2)}',
    '.cita-k{display:block;font-family:var(--sans);font-size:9.5px;font-weight:500;letter-spacing:.32em;text-transform:uppercase;color:var(--gold,#B68D40)}',
    '.cita-h{margin:14px 0 10px;font-family:var(--serif);font-weight:300;font-size:clamp(30px,4.6vw,40px);line-height:1.04;color:var(--bone,#f3efe7)}',
    '.cita-h .script{font-family:var(--script);color:var(--gold);font-size:1.18em}',
    '.cita-lede{margin:0;font-family:var(--serif);font-style:italic;font-weight:300;font-size:15px;line-height:1.55;color:rgba(var(--ink-rgb,243,239,231),.6)}',
    '.cita-x{position:absolute;top:18px;right:20px;padding:8px 12px;background:none;border:0;cursor:pointer;font-family:var(--sans);font-size:9.5px;font-weight:500;letter-spacing:.24em;text-transform:uppercase;color:rgba(var(--ink-rgb,243,239,231),.55)}',
    '.cita-x:hover{color:var(--gold)}',
    '.cita-body{padding:26px clamp(24px,5vw,38px) 40px;display:flex;flex-direction:column;gap:22px}',
    '.cita-f{display:flex;flex-direction:column;gap:9px}',
    '.cita-f>label{font-family:var(--sans);font-size:9.5px;font-weight:500;letter-spacing:.26em;text-transform:uppercase;color:rgba(var(--ink-rgb,243,239,231),.55)}',
    '.cita-f input[type=text],.cita-f input[type=email],.cita-f input[type=date],.cita-f textarea{width:100%;box-sizing:border-box;padding:13px 14px;font-family:var(--sans);font-weight:300;font-size:14.5px;color:var(--bone,#f3efe7);background:rgba(var(--ink-rgb,243,239,231),.045);border:1px solid rgba(var(--ink-rgb,243,239,231),.16);border-radius:0;outline:none;transition:border-color .3s ease}',
    '.cita-f input:focus,.cita-f textarea:focus{border-color:var(--gold,#B68D40)}',
    '.cita-f textarea{min-height:78px;resize:vertical}',
    '.cita-f input::placeholder,.cita-f textarea::placeholder{color:rgba(var(--ink-rgb,243,239,231),.3)}',
    '.cita-chips{display:flex;flex-wrap:wrap;gap:8px}',
    '.cita-chip{padding:10px 15px;font-family:var(--sans);font-size:10px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:rgba(var(--ink-rgb,243,239,231),.62);background:none;border:1px solid rgba(var(--ink-rgb,243,239,231),.18);cursor:pointer;transition:color .3s ease,border-color .3s ease,background .3s ease}',
    '.cita-chip:hover{border-color:rgba(182,141,64,.55);color:var(--bone,#f3efe7)}',
    '.cita-chip.is-on{color:#141210;background:var(--gold,#B68D40);border-color:var(--gold,#B68D40)}',
    '.cita-send{margin-top:4px;padding:17px 22px;font-family:var(--sans);font-size:11px;font-weight:500;letter-spacing:.3em;text-transform:uppercase;color:#141210;background:linear-gradient(180deg,var(--gold,#B68D40),var(--gold-deep,#8A6B2E));border:0;cursor:pointer;transition:opacity .3s ease}',
    '.cita-send:hover{opacity:.88}',
    '.cita-send[disabled]{opacity:.5;cursor:default}',
    '.cita-fine{margin:0;font-family:var(--sans);font-weight:300;font-size:11.5px;line-height:1.65;color:rgba(var(--ink-rgb,243,239,231),.55)}',
    '.cita-fine a{color:var(--gold,#B68D40);text-decoration:none;border-bottom:1px solid rgba(182,141,64,.4)}',
    '.cita-msg{margin:0;font-family:var(--serif);font-style:italic;font-size:14px;line-height:1.6;color:var(--gold,#B68D40)}',
    '.cita-done{padding:clamp(30px,6vw,52px) clamp(24px,5vw,38px);text-align:center}',
    '.cita-done .script{display:block;font-family:var(--script);font-size:clamp(34px,5.5vw,46px);color:var(--gold,#B68D40);margin-bottom:14px}',
    '.cita-done p{font-family:var(--sans);font-weight:300;font-size:14.5px;line-height:1.75;color:rgba(var(--ink-rgb,243,239,231),.68);margin:0 0 12px}',
    '.cita-done b{font-weight:500;color:var(--bone,#f3efe7)}',
    '@media (max-width:520px){.cita-panel{width:100%;border-left:0}}'
  ].join('');

  var root = null, panel = null, sel = { franja: FRANJAS[1], canal: CANALES[0] };

  function build() {
    if (root) return;
    var s = document.createElement('style');
    s.id = 'cita-css';
    s.textContent = CSS;
    document.head.appendChild(s);

    root = document.createElement('div');
    root.id = 'citaRoot';
    root.innerHTML =
      '<div class="cita-veil" data-cita-close></div>' +
      '<aside class="cita-panel" role="dialog" aria-modal="true" aria-labelledby="citaH" aria-hidden="true">' +
        '<button type="button" class="cita-x" data-cita-close>Cerrar &times;</button>' +
        '<div class="cita-head">' +
          '<span class="cita-k">Atelier privado</span>' +
          '<h2 class="cita-h" id="citaH">Reservar <span class="script">cita.</span></h2>' +
          '<p class="cita-lede">Una hora con un asesor de la casa, sin compromiso: para ver la pieza, medir la talla o imaginar un encargo.</p>' +
        '</div>' +
        '<form class="cita-body" id="citaForm" novalidate>' +
          '<div class="cita-f"><label for="citaPieza">Pieza de interés</label>' +
            '<input type="text" id="citaPieza" name="pieza" placeholder="Rosario Clásico, un encargo, aún no lo sé…" autocomplete="off" /></div>' +
          '<div class="cita-f"><label>Franja horaria</label><div class="cita-chips" data-group="franja">' +
            FRANJAS.map(function (f, i) { return '<button type="button" class="cita-chip' + (i === 1 ? ' is-on' : '') + '" data-v="' + f + '">' + f + '</button>'; }).join('') +
          '</div></div>' +
          '<div class="cita-f"><label for="citaDia">Día que prefiere</label>' +
            '<input type="date" id="citaDia" name="dia" /></div>' +
          '<div class="cita-f"><label>Cómo prefiere vernos</label><div class="cita-chips" data-group="canal">' +
            CANALES.map(function (c, i) { return '<button type="button" class="cita-chip' + (i === 0 ? ' is-on' : '') + '" data-v="' + c + '">' + c + '</button>'; }).join('') +
          '</div></div>' +
          '<div class="cita-f"><label for="citaNombre">Su nombre</label>' +
            '<input type="text" id="citaNombre" name="nombre" placeholder="Nombre y apellido" autocomplete="name" required /></div>' +
          '<div class="cita-f"><label for="citaContacto">Correo o WhatsApp</label>' +
            '<input type="text" id="citaContacto" name="contacto" placeholder="correo@ejemplo.com · +57 300 000 0000" autocomplete="email" required /></div>' +
          '<div class="cita-f"><label for="citaNota">Algo que debamos saber</label>' +
            '<textarea id="citaNota" name="nota" placeholder="Opcional — una talla, una fecha, una idea."></textarea></div>' +
          '<p class="cita-msg" id="citaMsg" hidden></p>' +
          '<button type="submit" class="cita-send" id="citaSend">Solicitar la cita</button>' +
          '<p class="cita-fine">Un asesor confirma día y hora por su canal en menos de 24 horas. Sus datos se usan solo para agendar — ' +
            '<a href="/privacidad">política de privacidad</a>.</p>' +
        '</form>' +
      '</aside>';
    document.body.appendChild(root);
    panel = root.querySelector('.cita-panel');

    root.querySelectorAll('[data-cita-close]').forEach(function (b) {
      b.addEventListener('click', close);
    });
    root.querySelectorAll('.cita-chips').forEach(function (g) {
      g.addEventListener('click', function (e) {
        var b = e.target.closest('.cita-chip');
        if (!b) return;
        g.querySelectorAll('.cita-chip').forEach(function (c) { c.classList.remove('is-on'); });
        b.classList.add('is-on');
        sel[g.dataset.group] = b.dataset.v;
      });
    });
    root.querySelector('#citaForm').addEventListener('submit', submit);

    var d = new Date(Date.now() + 86400000 * 2);
    root.querySelector('#citaDia').value = d.toISOString().slice(0, 10);
    root.querySelector('#citaDia').min = new Date().toISOString().slice(0, 10);
  }

  function open(pieza) {
    build();
    if (pieza) root.querySelector('#citaPieza').value = pieza;
    document.documentElement.classList.add('cita-open');
    panel.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(function () {
      var f = root.querySelector(pieza ? '#citaNombre' : '#citaPieza');
      f && f.focus({ preventScroll: true });
    }, 420);
    if (typeof fbq === 'function') fbq('trackCustom', 'ScheduleAppointmentStart', { pieza: pieza || '(sin pieza)' });
  }
  function close() {
    if (!root) return;
    document.documentElement.classList.remove('cita-open');
    panel.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function resumen(d) {
    return [
      'Solicitud de cita privada · Preto by Dala&Co',
      '',
      'Nombre: ' + d.nombre,
      'Contacto: ' + d.contacto,
      'Pieza: ' + (d.pieza || '(por definir)'),
      'Día: ' + (d.dia || '(flexible)'),
      'Franja: ' + d.franja,
      'Canal: ' + d.canal,
      d.nota ? ('Nota: ' + d.nota) : ''
    ].filter(Boolean).join('\n');
  }

  function submit(e) {
    e.preventDefault();
    var q = function (id) { return root.querySelector(id).value.trim(); };
    var d = {
      nombre: q('#citaNombre'),
      contacto: q('#citaContacto'),
      pieza: q('#citaPieza'),
      dia: q('#citaDia'),
      nota: q('#citaNota'),
      franja: sel.franja,
      canal: sel.canal
    };
    var msg = root.querySelector('#citaMsg');
    var btn = root.querySelector('#citaSend');
    if (!d.nombre || !d.contacto) {
      msg.hidden = false;
      msg.textContent = 'Falta su nombre y un canal donde confirmarle.';
      return;
    }
    msg.hidden = true;
    btn.disabled = true;
    btn.textContent = 'Enviando…';

    var fin = function (ok) {
      if (ok) {
        if (typeof fbq === 'function') fbq('trackCustom', 'ScheduleAppointment', { pieza: d.pieza || '(sin pieza)', canal: d.canal });
        root.querySelector('#citaForm').outerHTML =
          '<div class="cita-done">' +
            '<span class="script">Recibido.</span>' +
            '<p>Gracias, <b>' + d.nombre.split(' ')[0] + '</b>. Un asesor de la casa le confirma <b>' +
              (d.dia || 'el día') + '</b>, franja de <b>' + d.franja.toLowerCase() + '</b>, por <b>' + d.canal + '</b>.</p>' +
            '<p>Si prefiere adelantarlo, el concierge responde ahora mismo por WhatsApp.</p>' +
            '<a class="cita-send" style="display:inline-block;text-decoration:none;margin-top:10px" href="https://wa.me/' + WA +
              '?text=' + encodeURIComponent(resumen(d)) + '" target="_blank" rel="noopener">Escribir al concierge</a>' +
          '</div>';
      } else {
        /* La solicitud no se pierde: se entrega por el canal que
           siempre funciona, con el resumen ya escrito. */
        window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(resumen(d)), '_blank', 'noopener');
        btn.disabled = false;
        btn.textContent = 'Solicitar la cita';
        msg.hidden = false;
        msg.textContent = 'Abrimos WhatsApp con su solicitud lista para enviar.';
      }
    };

    var ctrl = ('AbortController' in window) ? new AbortController() : null;
    var to = ctrl ? setTimeout(function () { ctrl.abort(); }, 9000) : null;
    fetch('/.netlify/functions/cita-privada', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(d),
      signal: ctrl ? ctrl.signal : undefined
    })
      .then(function (r) { if (to) clearTimeout(to); fin(r.ok); })
      .catch(function () { if (to) clearTimeout(to); fin(false); });
  }

  /* ── Enganche global ───────────────────────────────────────── */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-cita],a[href="#cita"],a[href$="#cita"]');
    if (!t) return;
    e.preventDefault();
    open(t.getAttribute('data-cita') || '');
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.documentElement.classList.contains('cita-open')) close();
  });

  window.PretoCita = { open: open, close: close };
})();
