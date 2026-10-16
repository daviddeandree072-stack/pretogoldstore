/* ═══════════════════════════════════════════════════════════════
   PRETO · Consentimiento de cookies
   Las cookies de medición y publicidad (Meta Pixel, Google
   Analytics) SOLO se cargan si el cliente elige "Aceptar todas".
   Mientras no haya elección, fbq/gtag existen como funciones
   vacías para que el resto del sitio no falle.
   Elección guardada en localStorage: 'all' | 'necessary'.
   Reabrir el banner: PretoCookies.open()
   ═══════════════════════════════════════════════════════════════ */
(function () {
  var KEY = 'preto.cookies.v1';
  var PIXEL = '994351176907192';
  var GA = 'G-PR29XCGHPY';
  var choice = null;
  try { choice = localStorage.getItem(KEY); } catch (e) {}

  /* Stubs: el código del sitio llama fbq()/gtag() sin consentimiento. */
  if (typeof window.fbq !== 'function') { window.fbq = function () {}; window.fbq.__stub = true; }
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') { window.gtag = function () { window.dataLayer.push(arguments); }; }

  function loadPixel() {
    if (window.fbq && !window.fbq.__stub) return;
    try { delete window.fbq; delete window._fbq; } catch (e) { window.fbq = undefined; window._fbq = undefined; }
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
    }(window, document, 'script');
    /* Meta no recolecta por su cuenta los datos de los formularios:
       solo enviamos eventos explícitos. */
    fbq('set', 'autoConfig', false, PIXEL);
    fbq('init', PIXEL);
    fbq('track', 'PageView');
    /* El script real se pide fuera de la ruta crítica: init y PageView
       quedan en cola y se disparan al cargar fbevents.js. */
    var loaded = false;
    function load() {
      if (loaded) return; loaded = true;
      var t = document.createElement('script'); t.async = !0;
      t.src = 'https://connect.facebook.net/en_US/fbevents.js';
      var s = document.getElementsByTagName('script')[0];
      if (s && s.parentNode) s.parentNode.insertBefore(t, s); else document.head.appendChild(t);
    }
    ['pointerdown', 'keydown', 'touchstart', 'scroll'].forEach(function (ev) {
      window.addEventListener(ev, load, { passive: true, once: true });
    });
    if ('requestIdleCallback' in window) requestIdleCallback(load, { timeout: 3500 }); else setTimeout(load, 3000);
  }

  function loadGA() {
    if (window.__pretoGA) return; window.__pretoGA = true;
    var s = document.createElement('script'); s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA;
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', GA);
  }

  function enableMeasurement() { loadPixel(); loadGA(); }
  if (choice === 'all') enableMeasurement();

  /* ── Banner ─────────────────────────────────────────────── */
  var CSS = '.ck-bar{position:fixed;left:0;right:0;bottom:0;z-index:9800;background:#0D0D0D;border-top:1px solid rgba(196,146,42,.38);'
    + 'padding:18px clamp(18px,4vw,42px);display:flex;flex-wrap:wrap;align-items:center;gap:14px 26px;justify-content:center;'
    + 'transform:translateY(102%);transition:transform .5s cubic-bezier(.2,.7,.2,1);box-shadow:0 -18px 44px -24px rgba(0,0,0,.8)}'
    + '.ck-bar.is-in{transform:none}'
    + '.ck-txt{font-family:Inter,system-ui,sans-serif;font-weight:300;font-size:13px;line-height:1.65;color:rgba(245,237,214,.82);max-width:620px;margin:0}'
    + '.ck-txt a{color:#C4922A;text-decoration:none;border-bottom:1px solid rgba(196,146,42,.4)}'
    + '.ck-txt a:hover{color:#F5EDD6}'
    + '.ck-acts{display:flex;flex-wrap:wrap;gap:10px;align-items:center}'
    + '.ck-btn{font-family:Inter,system-ui,sans-serif;font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;cursor:pointer;'
    + 'padding:13px 22px;min-height:44px;border:1px solid #C4922A;background:#C4922A;color:#0D0D0D;transition:background .25s ease,color .25s ease}'
    + '.ck-btn:hover{background:#F5EDD6;border-color:#F5EDD6}'
    + '.ck-btn.ghost{background:transparent;color:rgba(245,237,214,.86);border-color:rgba(245,237,214,.3)}'
    + '.ck-btn.ghost:hover{border-color:#C4922A;color:#C4922A;background:transparent}'
    + '.ck-prefs{display:block;text-align:center;font-family:Inter,system-ui,sans-serif;font-size:11px;letter-spacing:.18em;text-transform:uppercase;'
    + 'color:inherit;opacity:.72;text-decoration:none;background:none;border:0;cursor:pointer;padding:10px 0 0;margin:0 auto}'
    + '.ck-prefs:hover{opacity:1;color:#C4922A}'
    + '@media(max-width:700px){.ck-bar{flex-direction:column;align-items:stretch;text-align:left;gap:14px}.ck-acts{flex-direction:column}.ck-btn{width:100%}}'
    /* Mientras el banner está abajo, el botón flotante de WhatsApp sube
       para no quedar tapado (margin, no transform: la .wa ya usa uno). */
    + 'body.ck-open .wa{margin-bottom:clamp(86px,17vh,150px);transition:margin-bottom .5s cubic-bezier(.2,.7,.2,1)}';

  var bar = null;
  function build() {
    if (bar) return bar;
    var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    bar = document.createElement('div');
    bar.className = 'ck-bar'; bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Preferencias de cookies');
    bar.innerHTML = '<p class="ck-txt">Usamos cookies propias para recordar su carrito y preferencias, y cookies de medición y publicidad (Meta) para mejorar la experiencia. '
      + '<a href="/privacidad">Política de privacidad</a></p>'
      + '<div class="ck-acts"><button type="button" class="ck-btn" data-ck="all">Aceptar todas</button>'
      + '<button type="button" class="ck-btn ghost" data-ck="necessary">Solo necesarias</button></div>';
    bar.addEventListener('click', function (ev) {
      var b = ev.target.closest('[data-ck]'); if (!b) return;
      var v = b.getAttribute('data-ck');
      try { localStorage.setItem(KEY, v); } catch (e) {}
      if (v === 'all') enableMeasurement();
      hide();
    });
    document.body.appendChild(bar);
    return bar;
  }
  function show() { build(); requestAnimationFrame(function () { bar.classList.add('is-in'); document.body.classList.add('ck-open'); }); }
  function hide() { if (bar) bar.classList.remove('is-in'); document.body.classList.remove('ck-open'); }

  function prefsLinks() {
    var found = document.querySelectorAll('[data-cookie-prefs], a[href="#cookies"]');
    if (found.length) {
      found.forEach(function (el) {
        el.addEventListener('click', function (e) { e.preventDefault(); show(); });
      });
      return;
    }
    var foot = document.querySelector('footer');
    if (!foot) return;
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'ck-prefs'; b.textContent = 'Preferencias de cookies';
    b.addEventListener('click', show);
    foot.appendChild(b);
  }

  function init() {
    prefsLinks();
    if (!choice) setTimeout(show, 900);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.PretoCookies = {
    open: show,
    get choice() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  };
})();
