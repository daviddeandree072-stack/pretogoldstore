/* ═══════════════════════════════════════════════════════════════
   PRETO BY DALA&CO · Campaña «El lazo» — Amor y Amistad 2026
   ───────────────────────────────────────────────────────────────
   Cuenta atrás al sábado 19 de septiembre + lista de espera.

   PARA RETIRARLA: borra la <section id="lazo"> de index.html y las
   dos líneas que cargan lazo.css y lazo.js.

   Notas de convivencia con el resto del sitio (nada de esto choca):
     · Todo cuelga de #lazo y de nombres lz*. No toca ninguna clase
       que ya usen app.js (.line-block), zoom-macro.js (.jy-media,
       .pdp-art) ni el filtro de líneas.
     · Las tarjetas enlazan a #card-<id>: app.js ya escucha hashchange
       y abre la ficha real con su precio en vivo. No duplicamos
       catálogo ni precios.
     · La tarjeta de regalo lleva data-giftcard, que punto12.js ya
       engancha solo. No registramos un segundo listener.
     · La lista de espera escribe en la colección "newsletter" con
       source 'lazo-2026', usando exactamente los cuatro campos que
       exigen las reglas de Firestore. Cola de reintento propia
       (preto.lazo.pending) para no ensuciar la del newsletter, que
       reenvía con source 'web'.
     · El correo de la promoción sale AUTOMÁTICO al instante, por
       /.netlify/functions/lazo-email (misma cuenta de Resend que el
       correo de bienvenida). Nadie tiene que enviar nada a mano.
       La cola guarda por separado si faltó guardar o faltó enviar,
       para no mandarle dos veces el mismo correo a un cliente.
     · La FECHA y la etiqueta de la campaña vienen de temporadas.js
       (window.PRETO_TEMPORADA), que corre justo antes. Este archivo
       aporta la mecánica — cuenta atrás, lista de espera, correo —
       y sirve igual a las nueve fechas del calendario.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var sec = document.getElementById('lazo');
  if (!sec) return;
  /* Fuera de temporada temporadas.js oculta la sección pero la deja en
     el DOM. Sin esta guarda, la cuenta atrás seguiría corriendo cada
     segundo contra algo que nadie ve. */
  if (sec.hidden) return;

  /* Fecha de apertura y etiqueta de la campaña. Las pone
     temporadas.js según el calendario (se ejecuta antes que este
     archivo). El valor de septiembre queda como reserva por si
     alguien retira el motor y deja solo «El lazo». */
  var T = window.PRETO_TEMPORADA || {};
  var TARGET = T.target || new Date('2026-09-19T00:00:00-05:00').getTime();
  var SOURCE = T.source || 'lazo-2026';
  var TEMPORADA = T.id || 'amor';
  var PENDING = 'preto.lazo.pending';

  var reduce = false;
  try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  /* ── Precios desde la fuente única ──────────────────────────────
     No se escribe ningún precio en el HTML: se leen de precios.js, el
     mismo archivo que firma el servidor. Así la campaña no puede
     quedarse con un precio viejo cuando cambies la lista.

     Espera a DOMContentLoaded a propósito: este script vive junto a la
     sección (línea ~614) y precios.js se carga al final de la página,
     así que al ejecutarse todavía no existe window.PRETO_PRICES. */
  function precios() {
    var P = window.PRETO_PRICES || {};
    var SP = window.PRETO_SIZE_PRICES || {};
    function fmt(n) { try { return '$' + Math.round(n).toLocaleString('es-CO'); } catch (e) { return '$' + Math.round(n); } }
    sec.querySelectorAll('[data-lz-price]').forEach(function (el) {
      var id = el.getAttribute('data-lz-price');
      var val = null, exact = true;
      if (SP[id]) {
        var vals = Object.keys(SP[id]).map(function (k) { return SP[id][k]; }).filter(function (v) { return v != null; });
        if (vals.length) { val = Math.min.apply(null, vals); exact = false; }
      }
      if (val == null && P[id] != null) val = P[id];
      el.textContent = val == null ? 'Consultar precio' : (exact ? '' : 'Desde ') + fmt(val) + ' COP';
    });
  }
  /* OJO con la guardia: durante la ejecución de un script defer el
     readyState ya es 'interactive', no 'loading'. Comprobar 'loading'
     hacía que esto corriera ANTES que precios.js (que se carga al
     final) y todos los precios salían como "Consultar precio".
     DOMContentLoaded solo ha ocurrido ya si el estado es 'complete'. */
  if (document.readyState === 'complete') precios();
  else document.addEventListener('DOMContentLoaded', precios);

  /* ── Gesto firma: los dos trazos se dibujan al entrar en pantalla ──
     will-change solo durante el dibujado y se retira al terminar. */
  (function drawKnot() {
    var knot = sec.querySelector('.lz-knot');
    function run() {
      if (knot && !reduce) knot.style.willChange = 'contents';
      sec.classList.add('is-drawn');
      setTimeout(function () { if (knot) knot.style.willChange = ''; }, 1800);
    }
    if (reduce || !('IntersectionObserver' in window)) { run(); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.disconnect();
        run();
      });
    }, { threshold: 0.22 });
    io.observe(sec);
  })();

  /* ── Cuenta atrás ────────────────────────────────────────────── */
  var countEl = sec.querySelector('.lz-count');
  var openEl = sec.querySelector('.lz-open');
  var waitEl = sec.querySelector('.lz-wait');
  var cells = {
    d: sec.querySelector('[data-lz="d"]'),
    h: sec.querySelector('[data-lz="h"]'),
    m: sec.querySelector('[data-lz="m"]'),
    s: sec.querySelector('[data-lz="s"]')
  };
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var last = {};
  var tickTimer = null;

  /* Cambio por máscara: la celda se recorta hacia arriba, se cambia el
     número dentro y se descubre. Solo clip-path, nada de layout.
     Los SEGUNDOS quedan fuera a propósito: enmascararlos cada segundo
     dejaba el número ilegible una cuarta parte del tiempo y mantenía
     una animación permanente en pantalla. El movimiento de esta
     campaña es el nudo, no el contador. */
  function setCell(k, txt) {
    var cell = cells[k];
    if (!cell || last[k] === txt) return;
    last[k] = txt;
    var inner = cell.querySelector('i');
    if (!inner) { cell.textContent = txt; return; }
    if (reduce || k === 's') { inner.textContent = txt; return; }
    var unit = cell.closest('.lz-unit');
    if (unit) unit.classList.add('is-turn');
    setTimeout(function () {
      inner.textContent = txt;
      if (unit) unit.classList.remove('is-turn');
    }, 260);
  }

  /* El nudo aprieta una vez cada minuto: es el único movimiento que
     marca el paso del tiempo, y solo tiene sentido en esta campaña. */
  function tighten() {
    if (reduce) return;
    sec.classList.add('is-tight');
    setTimeout(function () { sec.classList.remove('is-tight'); }, 640);
  }

  var dateEl = sec.querySelector('.lz-date');
  function opened() {
    sec.classList.add('is-open');
    if (dateEl) dateEl.hidden = true;
    if (countEl) countEl.hidden = true;
    if (openEl) openEl.hidden = false;
    if (waitEl) waitEl.hidden = true;
    if (tickTimer) { clearInterval(tickTimer); tickTimer = null; }
  }

  function tick() {
    var left = TARGET - Date.now();
    if (left <= 0) { opened(); return; }
    /* Primer tick: el HTML llega con la fecha escrita (legible sin JS) y
       aquí la relevamos por la cuenta atrás. */
    if (countEl && countEl.hidden) { countEl.hidden = false; if (dateEl) dateEl.hidden = true; }
    var s = Math.floor(left / 1000);
    var d = Math.floor(s / 86400);
    var h = Math.floor((s % 86400) / 3600);
    var m = Math.floor((s % 3600) / 60);
    var ss = s % 60;
    var prevM = last.m;
    setCell('d', pad(d)); setCell('h', pad(h)); setCell('m', pad(m)); setCell('s', pad(ss));
    if (prevM !== undefined && prevM !== pad(m)) tighten();
  }

  if (TARGET - Date.now() <= 0) opened();
  else { tick(); tickTimer = setInterval(tick, 1000); }

  /* Con la pestaña oculta no hace falta contar: se para y se recupera
     al volver, así el contador no gasta batería de fondo. */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { if (tickTimer) { clearInterval(tickTimer); tickTimer = null; } }
    else if (!tickTimer && !sec.classList.contains('is-open') && !sec.hidden) { tick(); tickTimer = setInterval(tick, 1000); }
  });
  /* temporadas.js puede ocultar la sección en vivo si el panel apagó
     la campaña: entonces el contador se detiene del todo. */
  sec.addEventListener('lazo:ocultar', function () {
    if (tickTimer) { clearInterval(tickTimer); tickTimer = null; }
  });

  /* ── Atracción magnética entre tarjetas vecinas ──────────────────
     Solo con ratón: en pantalla táctil no hay hover y el gesto sobra. */
  (function magnet() {
    if (reduce) return;
    var fine = false;
    try { fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches; } catch (e) {}
    if (!fine) return;
    var cards = [].slice.call(sec.querySelectorAll('.lz-card'));
    if (cards.length < 2) return;
    cards.forEach(function (card, i) {
      card.addEventListener('pointerenter', function () {
        cards.forEach(function (other, j) {
          if (j === i) { other.style.transform = 'translateY(-6px)'; return; }
          var dir = j < i ? 1 : -1;                    // el vecino se acerca
          var pull = Math.abs(j - i) === 1 ? 9 : 3;
          other.style.transform = 'translateX(' + (dir * pull) + 'px)';
        });
      });
      card.addEventListener('pointerleave', function () {
        cards.forEach(function (other) { other.style.transform = ''; });
      });
    });
  })();

  /* ── Lista de espera ────────────────────────────────────────────── */
  var form = sec.querySelector('.lz-form');
  var errEl = sec.querySelector('.lz-err');
  var okEl = sec.querySelector('.lz-ok');

  function valido(mail) {
    return /^[^\s@<>"';,]{1,64}@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i.test(mail);
  }
  /* Cola de reintento. Cada apunte recuerda qué falta: guardar en la
     nube (s) y/o enviar el correo (m). Así un fallo de red no acaba
     en dos correos para el mismo cliente. Los apuntes viejos, que
     eran cadenas sueltas, se leen como "falta todo". */
  function leerCola() {
    var q;
    try { q = JSON.parse(localStorage.getItem(PENDING) || '[]'); } catch (e) { q = []; }
    if (!Array.isArray(q)) return [];
    return q.map(function (it) {
      return typeof it === 'string' ? { e: it, s: false, m: false } : it;
    }).filter(function (it) { return it && it.e; });
  }
  function escribirCola(q) {
    try { localStorage.setItem(PENDING, JSON.stringify(q)); } catch (e) {}
  }
  function encolar(mail, saved, mailed) {
    if (saved && mailed) return;
    var q = leerCola();
    var found = false;
    q.forEach(function (it) {
      if (it.e !== mail) return;
      found = true;
      it.s = it.s || !!saved;
      it.m = it.m || !!mailed;
    });
    if (!found) q.push({ e: mail, s: !!saved, m: !!mailed });
    escribirCola(q);
  }
  /* Los cuatro campos son exactamente los que piden las reglas de
     Firestore para la colección newsletter: email, status, source y
     createdAt, todos cadenas. */
  function guardar(mail) {
    if (!window.PretoFirebase || !window.PRETO_FIREBASE_CONFIG) return Promise.resolve(false);
    return window.PretoFirebase.load().then(function () {
      try {
        var db = firebase.firestore();
        var id = mail.replace(/[\/#?%\[\]]/g, '_');
        return db.collection('newsletter').doc(id).set({
          email: mail,
          status: 'suscrito',
          source: SOURCE,
          createdAt: new Date().toISOString()
        }, { merge: true }).then(function () { return true; }).catch(function () { return false; });
      } catch (e) { return false; }
    }).catch(function () { return false; });
  }

  /* ── Envío automático de la promoción ───────────────────────────
     La función de Netlify solo acepta peticiones desde el dominio de
     la casa y limita los envíos por correo, así que aquí no hace
     falta más que pedirla. Devuelve true solo si el correo salió. */
  function enviar(mail) {
    try {
      return fetch('/.netlify/functions/lazo-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: mail, temporada: TEMPORADA, abre: TARGET })
      }).then(function (r) { return !!(r && r.ok); }).catch(function () { return false; });
    } catch (e) { return Promise.resolve(false); }
  }

  if (form) form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var input = form.querySelector('input[type="email"]');
    var btn = form.querySelector('button');
    var mail = ((input && input.value) || '').trim().toLowerCase();
    if (errEl) errEl.hidden = true;
    if (!valido(mail)) {
      if (errEl) { errEl.textContent = 'Revise su correo, por favor.'; errEl.hidden = false; }
      if (input) input.focus();
      return;
    }
    if (btn) btn.disabled = true;

    /* Dos cosas a la vez: anotar el correo y mandarle la promoción.
       Lo que falle queda en cola y se reintenta en la próxima visita.
       Al cliente se le confirma igual: su correo ya está anotado. */
    Promise.all([guardar(mail), enviar(mail)]).then(function (r) {
      encolar(mail, r[0], r[1]);
    });

    form.hidden = true;
    if (okEl) okEl.hidden = false;
    if (waitEl) waitEl.classList.add('is-done');

    /* Puente a la cortesía: quien ya tiene cuenta tiene su código;
       quien no, entra al formulario con el correo puesto. Lo abre
       cuenta.js — aquí no se promete nada que no ocurra. */
    var link = sec.querySelector('[data-lz-cuenta]');
    if (link) link.addEventListener('click', function (e) {
      if (!window.PretoAccount || !window.PretoAccount.openSignup) return;
      e.preventDefault();
      window.PretoAccount.openSignup(mail);
    });
  });

  /* Reintento silencioso de lo que quedó en cola: de cada apunte se
     repite solo la parte que faltó. */
  window.addEventListener('load', function () {
    setTimeout(function () {
      var q = leerCola();
      if (!q.length) return;
      Promise.all(q.map(function (it) {
        return Promise.all([
          it.s ? true : guardar(it.e),
          it.m ? true : enviar(it.e)
        ]).then(function (r) { return { e: it.e, s: !!r[0], m: !!r[1] }; });
      })).then(function (res) {
        escribirCola(res.filter(function (it) { return !it.s || !it.m; }));
      });
    }, 5200);
  });
})();
