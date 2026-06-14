/* ═══════════════════════════════════════════════════════════════
   PRETO BY DALA&CO — CONSENTIMIENTO DE COOKIES
   Punto 23 del informe CRO · Habeas Data (Ley 1581) + cookies
   ───────────────────────────────────────────────────────────────
   · Muestra un aviso sobrio la primera visita y guarda la decisión
     en localStorage ('preto.consent' = 'all' | 'essential').
   · NO carga analítica por sí solo: expone una API de consentimiento
     para que la analítica (GA4 / Pixel / Clarity) se dispare SOLO si
     el visitante aceptó. Mientras no acepte, no se mide nada salvo
     lo estrictamente esencial (tema, contenido de la cotización).

   ► Cómo engancha la analítica (cuando se añada, punto 22):
       PretoConsent.onGranted(function () {
         // ...inyectar GA4 / Pixel / Clarity aquí...
       });
     Si el usuario ya había aceptado, el callback corre de inmediato.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var KEY = 'preto.consent';
  var granted = [];          // callbacks a ejecutar cuando hay consentimiento
  var state = null;
  try { state = localStorage.getItem(KEY); } catch (e) {}

  /* ── API pública ──────────────────────────────────────────── */
  var PretoConsent = window.PretoConsent = {
    get: function () { return state; },                 // 'all' | 'essential' | null
    hasAccepted: function () { return state === 'all'; },
    onGranted: function (cb) {                           // corre ya si aceptó, o al aceptar
      if (typeof cb !== 'function') return;
      if (state === 'all') { try { cb(); } catch (e) {} }
      else granted.push(cb);
    },
    set: function (choice) { decide(choice); }
  };

  function fire() {
    var list = granted.slice(); granted.length = 0;
    list.forEach(function (cb) { try { cb(); } catch (e) {} });
    try { document.dispatchEvent(new CustomEvent('preto:consent', { detail: { value: state } })); } catch (e) {}
  }

  function decide(choice) {
    state = (choice === 'all') ? 'all' : 'essential';
    try { localStorage.setItem(KEY, state); } catch (e) {}
    hide();
    if (state === 'all') fire();
  }

  var bar = null;
  function hide() { if (bar) { bar.classList.remove('show'); setTimeout(function () { if (bar) bar.remove(); bar = null; }, 360); } }

  /* ── Estilos (autocontenidos, on-brand, claros sobre ambos temas) ── */
  function injectCss() {
    if (document.getElementById('preto-consent-css')) return;
    var base = location.pathname.indexOf('/joyeria/') !== -1 ? '../' : '';
    var css = '' +
      '.preto-consent{position:fixed;left:50%;bottom:22px;transform:translate(-50%,140%);z-index:9999;' +
      'width:min(680px,calc(100vw - 32px));background:#100f0e;color:#EDE7DA;' +
      'border:1px solid rgba(182,141,64,0.42);box-shadow:0 24px 60px -24px rgba(0,0,0,0.75);' +
      'border-radius:4px;padding:22px 24px;display:flex;flex-wrap:wrap;align-items:center;gap:16px 22px;' +
      "font-family:'Inter','Helvetica Neue',sans-serif;opacity:0;transition:transform .45s cubic-bezier(.2,.7,.3,1),opacity .45s ease;}" +
      '.preto-consent.show{transform:translate(-50%,0);opacity:1;}' +
      '.preto-consent .pc-txt{flex:1 1 320px;font-weight:300;font-size:13px;line-height:1.65;color:rgba(237,231,218,0.82);}' +
      '.preto-consent .pc-txt b{font-weight:500;color:#EDE7DA;}' +
      '.preto-consent .pc-txt a{color:#C9A961;text-decoration:none;border-bottom:1px solid rgba(201,169,97,0.4);}' +
      '.preto-consent .pc-txt a:hover{color:#d9b86a;}' +
      '.preto-consent .pc-actions{display:flex;gap:10px;flex:0 0 auto;}' +
      '.preto-consent button{font-family:inherit;font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;' +
      'cursor:pointer;padding:12px 20px;border-radius:2px;transition:opacity .25s ease,background .25s ease,color .25s ease;}' +
      '.preto-consent .pc-no{background:transparent;border:1px solid rgba(237,231,218,0.32);color:rgba(237,231,218,0.85);}' +
      '.preto-consent .pc-no:hover{border-color:rgba(237,231,218,0.6);}' +
      '.preto-consent .pc-yes{background:#C9A961;border:1px solid #C9A961;color:#100f0e;font-weight:600;}' +
      '.preto-consent .pc-yes:hover{opacity:.88;}' +
      '@media(max-width:560px){.preto-consent{padding:18px;gap:14px;}.preto-consent .pc-actions{width:100%;}.preto-consent button{flex:1;}}';
    var s = document.createElement('style');
    s.id = 'preto-consent-css';
    s.textContent = css.replace('{{base}}', base);
    document.head.appendChild(s);
  }

  function show() {
    injectCss();
    var base = location.pathname.indexOf('/joyeria/') !== -1 ? '../' : '';
    bar = document.createElement('div');
    bar.className = 'preto-consent';
    bar.setAttribute('role', 'dialog');
    bar.setAttribute('aria-label', 'Aviso de cookies y tratamiento de datos');
    bar.innerHTML =
      '<div class="pc-txt"><b>Su privacidad.</b> Usamos cookies esenciales para que la tienda funcione y, ' +
      'con su permiso, cookies de medición para mejorar la experiencia. Consulte la ' +
      '<a href="' + base + 'privacidad.html">Política de Tratamiento de Datos</a>.</div>' +
      '<div class="pc-actions">' +
      '<button type="button" class="pc-no">Solo esenciales</button>' +
      '<button type="button" class="pc-yes">Aceptar</button>' +
      '</div>';
    document.body.appendChild(bar);
    bar.querySelector('.pc-yes').addEventListener('click', function () { decide('all'); });
    bar.querySelector('.pc-no').addEventListener('click', function () { decide('essential'); });
    requestAnimationFrame(function () { setTimeout(function () { if (bar) bar.classList.add('show'); }, 60); });
  }

  /* ── Arranque ─────────────────────────────────────────────── */
  function start() {
    if (state === 'all' || state === 'essential') {
      if (state === 'all') fire();   // re-activa la medición en visitas posteriores
      return;
    }
    show();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
