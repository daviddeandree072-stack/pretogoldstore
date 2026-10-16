/* ═══════════════════════════════════════════════════════════════
   PRETO BY DALA&CO · Corazones de Amor y Amistad (toda la página)
   ───────────────────────────────────────────────────────────────
   La sección de campaña ya tiene sus flotantes dentro. Esto los
   saca a TODA la portada, pero por tandas: aparecen unos segundos,
   se van, y vuelven un rato después. Nunca quedan fijos en pantalla.

   Reglas:
     · solo durante Amor y Amistad (temporadas.js → PRETO_TEMPORADA)
       o en vista previa  index.html?temporada=amor;
     · se apagan desde admin.html → Temporadas (el mismo interruptor
       de flotantes de la campaña) y con  ?corazones=0;
     · no se montan con prefers-reduced-motion;
     · capa fija, sin interacción, por debajo del menú (z-index 48),
       así que cualquier overlay (carrito, buscador, ficha) los tapa;
     · con la pestaña oculta se detiene el reloj y el dibujo.

   Ritmo (constantes de abajo): 20 s en pantalla, ~75 s de descanso
   con azar, primera tanda 6 s después de cargar.

   Con la tanda entra también la nota de la cortesía de $150.000 — con
   su condición a la vista ($2.300.000) y enlace a la campaña. Es lo
   único de esta capa que recibe clics.

   Depende de flotantes.js (motivo 'corazon') y de temporadas.js.
   Para retirarlo: borra este archivo y su <script> en index.html.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var VISIBLE   = 20000;  // cuánto dura una tanda
  var DESCANSO  = 75000;  // descanso base entre tandas
  var AZAR      = 15000;  // ± azar sobre el descanso: que no suene a reloj
  var PRIMERA   = 6000;   // espera inicial tras cargar
  var ENTRADA   = 2400;   // fundido de entrada (ms)
  var SALIDA    = 2200;   // fundido de salida (ms)
  /* Paleta de la casa: rosa antiguo y, uno de cada cinco, oro. */
  var COLORES   = ['183,110,121', '183,110,121', '183,110,121', '183,110,121', '150,116,52'];
  var ESCALA    = 1.35;   // tamaño del corazón sobre el del motivo
  var EXTRA     = 5;      // corazones sumados a la cuenta base

  var reduce = false;
  try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  if (reduce || !window.PretoFlotantes) return;

  var q = null;
  try { q = new URLSearchParams(location.search); } catch (e) {}
  var forzar = q && q.get('corazones');
  if (forzar === '0' || forzar === 'off') return;

  /* Temporada: la que resolvió temporadas.js. El parámetro ?corazones=1
     sirve para verlos fuera de septiembre sin tocar la campaña. */
  var t = window.PRETO_TEMPORADA;
  var esAmor = !!t && t.id === 'amor';
  if (!esAmor && forzar !== '1') return;

  /* Mismo interruptor del panel que usa la campaña: si allí se apagaron
     los flotantes, aquí tampoco hay corazones. */
  if (esAmor) {
    try {
      var cfg = JSON.parse(localStorage.getItem('preto.temporadas.cfg') || 'null');
      var a = cfg && cfg.temporadas && cfg.temporadas.amor;
      if (a && a.flotantes === false) return;
    } catch (e) {}
  }

  var st = document.createElement('style');
  st.textContent = '#preto-corazones{position:fixed;inset:0;pointer-events:none;z-index:48;opacity:0;transition:opacity ' + SALIDA + 'ms ease}' +
    '#preto-corazones.is-on{opacity:1}#preto-corazones canvas{position:absolute;inset:0;display:block}' +
    /* La nota: pastilla centrada abajo, lejos del botón de WhatsApp
       (derecha) y del aviso de cookies (izquierda). */
    '.pc-nota{position:fixed;z-index:48;left:50%;bottom:clamp(18px,3vh,34px);transform:translate(-50%,10px);width:max-content;max-width:min(520px,calc(100vw - 172px));' +
    'display:grid;gap:5px;justify-items:center;text-align:center;padding:14px 26px 13px;text-decoration:none;pointer-events:auto;' +
    'background:rgba(244,238,231,.94);border:1px solid rgba(110,31,46,.2);box-shadow:0 14px 40px rgba(72,18,31,.14);' +
    'opacity:0;transition:opacity 900ms ease,transform 900ms cubic-bezier(.22,1,.36,1)}' +
    '.pc-nota.is-on{opacity:1;transform:translate(-50%,0);transition-delay:700ms}' +
    '.pc-nota b{font:400 clamp(17px,1.5vw,21px)/1.25 "Cormorant Garamond",Georgia,serif;color:#6E1F2E;letter-spacing:.01em}' +
    '.pc-nota i{font:400 9px/1.4 Inter,system-ui,sans-serif;font-style:normal;letter-spacing:.2em;text-transform:uppercase;color:#6E1F2E}' +
    '.pc-nota:hover{background:#F4EEE7;border-color:rgba(110,31,46,.42)}' +
    '@media (max-width:600px){.pc-nota{max-width:calc(100vw - 104px);bottom:max(84px,env(safe-area-inset-bottom));padding:12px 18px}.pc-nota i{font-size:8px;letter-spacing:.16em}}';
  document.head.appendChild(st);

  var capa = document.createElement('div');
  capa.id = 'preto-corazones';
  capa.setAttribute('aria-hidden', 'true');
  document.body.appendChild(capa);

  /* El canvas es decorado (aria-hidden en la capa); la nota sí se
     anuncia y se enfoca, así que vive fuera de ese árbol oculto. */
  var nota = document.createElement('a');
  nota.className = 'pc-nota';
  nota.href = '#lazo';
  nota.innerHTML = '<b>Por Amor y Amistad, la casa obsequia $150.000</b>' +
    '<i>En adquisiciones desde $2.300.000 · ver la selección</i>';
  document.body.appendChild(nota);

  /* Pocos y pequeños: la portada se lee por encima de ellos. En móvil,
     menos todavía. */
  var intensidad = 'suave';
  var flot = null, reloj = null, encendido = false;

  function esperar(ms, fn) { clearTimeout(reloj); reloj = setTimeout(fn, ms); }
  function descanso() { return Math.max(20000, DESCANSO + (Math.random() * 2 - 1) * AZAR); }

  function encender() {
    if (!flot) flot = window.PretoFlotantes.montar(capa, 'corazon', { colores: COLORES, intensidad: intensidad, escala: ESCALA, extra: EXTRA });
    if (!flot) return;                       // sin canvas: no se reintenta
    flot.reanudar();
    capa.style.transitionDuration = ENTRADA + 'ms';
    capa.classList.add('is-on');
    nota.classList.add('is-on');
    encendido = true;
    esperar(VISIBLE, apagar);
  }

  function apagar() {
    capa.style.transitionDuration = SALIDA + 'ms';
    capa.classList.remove('is-on');
    nota.classList.remove('is-on');
    encendido = false;
    /* Se deja terminar el fundido antes de retirar el canvas. Cada
       tanda se monta de nuevo: reparto distinto, y entre tandas no
       queda nada dibujando. */
    esperar(SALIDA, function () {
      if (flot) { flot.destruir(); flot = null; }
      esperar(descanso(), encender);
    });
  }

  /* Pestaña oculta: se corta el reloj y el dibujo; al volver, la tanda
     empieza de nuevo desde el descanso corto. */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      clearTimeout(reloj);
      capa.classList.remove('is-on');
      nota.classList.remove('is-on');
      if (flot) { flot.destruir(); flot = null; }
      encendido = false;
    } else if (!encendido) {
      esperar(4000, encender);
    }
  });

  esperar(PRIMERA, encender);
})();
