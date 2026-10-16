/* ───────────────────────────────────────────────────────────────
   Preto by Dala&Co · ZOOM MACRO — la lupa sobre la joya
   ───────────────────────────────────────────────────────────────
   Auditoría ago-2026 · punto 1 de la fase 2.
   Una joya de oro se vende en el detalle: la textura, el engaste,
   la marca del cincel. Hasta ahora la foto se veía al tamaño del
   marco y no había manera de acercarse.

     · Escritorio → al pasar el cursor, una lente al 240% que sigue
                    el puntero. La rueda del ratón acerca más.
     · Táctil     → botón de lupa → pantalla completa con pellizco
                    y arrastre.

   Funciona en dos sitios sin tocar su código:
     · la ficha de la tienda  (.pdp-art — imagen de fondo CSS)
     · las fichas SEO         (.jy-media img — con o sin slider)
   La lente es una capa aparte: no interfiere con el slider ni con
   el swipe que ya existían.
   ─────────────────────────────────────────────────────────────── */
(function () {
  'use strict';
  if (window.__pretoZoom) return;
  window.__pretoZoom = 1;

  var CSS = [
    /* OJO: .pdp-art es position:absolute;inset:0 en styles.css — no se
       le toca el position (colapsaría a altura 0). Un absolute ya es
       bloque contenedor, así que .zm-lens funciona dentro igual. */
    '.jy-media{position:relative}',
    '.zm-lens{position:absolute;inset:0;overflow:hidden;opacity:0;pointer-events:none;transition:opacity .28s ease;z-index:3;background:inherit}',
    '.zm-lens.is-on{opacity:1}',
    '.zm-lens img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transform-origin:50% 50%;will-change:transform}',
    '.zm-lens.is-contain img{object-fit:contain}',
    '.zm-hint{position:absolute;z-index:5;bottom:14px;left:14px;display:inline-flex;align-items:center;gap:7px;padding:7px 12px;font-family:var(--sans,sans-serif);font-size:9px;font-weight:500;letter-spacing:.24em;text-transform:uppercase;color:var(--gold,#B68D40);background:rgba(12,10,7,.62);border:1px solid rgba(182,141,64,.42);backdrop-filter:blur(3px);opacity:0;transition:opacity .3s ease;pointer-events:none}',
    '.zm-hint::before{content:"";width:9px;height:9px;border:1.4px solid currentColor;border-radius:50%;box-shadow:2px 2px 0 -1px currentColor}',
    '.pdp-art:hover>.zm-hint,.jy-media:hover>.zm-hint{opacity:1}',
    '.zm-lens.is-on ~ .zm-hint{opacity:0}',
    '.zm-btn{position:absolute;z-index:6;bottom:12px;left:12px;width:42px;height:42px;display:grid;place-items:center;padding:0;border:1px solid rgba(182,141,64,.5);background:rgba(12,10,7,.6);color:var(--gold,#B68D40);cursor:pointer;-webkit-tap-highlight-color:transparent}',
    '.zm-btn svg{width:19px;height:19px}',
    '.zm-full{position:fixed;inset:0;z-index:2000;display:none;background:#0b0906;touch-action:none;overscroll-behavior:contain}',
    '.zm-full.is-open{display:block}',
    '.zm-full img{position:absolute;top:50%;left:50%;max-width:100%;max-height:100%;transform-origin:center;user-select:none;-webkit-user-drag:none}',
    '.zm-full-close{position:absolute;z-index:2;top:calc(14px + env(safe-area-inset-top));right:16px;padding:11px 16px;font-family:var(--sans,sans-serif);font-size:10px;font-weight:500;letter-spacing:.24em;text-transform:uppercase;color:#f3efe7;background:none;border:1px solid rgba(243,239,231,.32);cursor:pointer}',
    '.zm-full-tip{position:absolute;z-index:2;bottom:calc(20px + env(safe-area-inset-bottom));left:0;right:0;text-align:center;font-family:var(--sans,sans-serif);font-size:9.5px;letter-spacing:.22em;text-transform:uppercase;color:rgba(243,239,231,.5)}',
    '@media (prefers-reduced-motion:reduce){.zm-lens{transition:none}}'
  ].join('');
  var st = document.createElement('style');
  st.id = 'zoom-macro-css';
  st.textContent = CSS;
  document.head.appendChild(st);

  var FINE = window.matchMedia && window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  var MIN = 1.8, MAX = 4.2, START = 2.4;

  /* ── Cuál es la foto que se está viendo ─────────────────────
     En el PDP la foto es un background-image; en las fichas es un
     <img> (y con slider hay varios, apilados en una pista). Se
     elige el que esté centrado en el marco. */
  function bgUrl(el) {
    var m = /url\(["']?(.*?)["']?\)/.exec(getComputedStyle(el).backgroundImage || '');
    return (m && m[1] && m[1] !== 'none') ? m[1] : null;
  }
  function visibleImg(host) {
    var imgs = host.querySelectorAll('img'), r = host.getBoundingClientRect();
    var best = null, bd = 1e9, cx = r.left + r.width / 2;
    for (var i = 0; i < imgs.length; i++) {
      var ir = imgs[i].getBoundingClientRect();
      if (!ir.width) continue;
      var d = Math.abs((ir.left + ir.width / 2) - cx);
      if (d < bd) { bd = d; best = imgs[i]; }
    }
    return best;
  }
  function srcOf(host) {
    if (host.classList.contains('pdp-art')) return bgUrl(host);
    var im = visibleImg(host);
    return im ? (im.currentSrc || im.src) : null;
  }
  function isContain(host) {
    if (host.classList.contains('contain')) return true;
    if (/contain/.test(getComputedStyle(host).backgroundSize || '')) return true;
    var im = host.classList.contains('pdp-art') ? null : visibleImg(host);
    return !!(im && /contain/.test(getComputedStyle(im).objectFit || ''));
  }

  /* ── Lente de escritorio ───────────────────────────────────── */
  function attachLens(host) {
    var lens = document.createElement('div');
    lens.className = 'zm-lens';
    var img = document.createElement('img');
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    lens.appendChild(img);
    host.appendChild(lens);

    var hint = document.createElement('span');
    hint.className = 'zm-hint';
    hint.textContent = 'Acercar';
    host.appendChild(hint);

    var z = START, on = false;

    function place(e) {
      var r = host.getBoundingClientRect();
      if (!r.width || !r.height) return;
      var x = Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100));
      var y = Math.max(0, Math.min(100, ((e.clientY - r.top) / r.height) * 100));
      img.style.transformOrigin = x + '% ' + y + '%';
      img.style.transform = 'scale(' + z + ')';
    }
    function enter(e) {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      var src = srcOf(host);
      if (!src) return;
      if (img.getAttribute('src') !== src) img.src = src;
      lens.classList.toggle('is-contain', isContain(host));
      z = START; on = true;
      lens.classList.add('is-on');
      place(e);
    }
    function leave() {
      on = false; z = START;
      lens.classList.remove('is-on');
    }
    host.addEventListener('pointerenter', enter);
    host.addEventListener('pointermove', function (e) { if (on) place(e); });
    host.addEventListener('pointerleave', leave);
    host.addEventListener('wheel', function (e) {
      if (!on) return;
      e.preventDefault();
      z = Math.max(MIN, Math.min(MAX, z + (e.deltaY < 0 ? 0.28 : -0.28)));
      place(e);
    }, { passive: false });
  }

  /* ── Pantalla completa táctil (pellizco + arrastre) ─────────── */
  var full, fullImg, fx = 0, fy = 0, fz = START;
  function buildFull() {
    if (full) return;
    full = document.createElement('div');
    full.className = 'zm-full';
    full.innerHTML =
      '<img alt="" />' +
      '<button type="button" class="zm-full-close">Cerrar &times;</button>' +
      '<p class="zm-full-tip">Pellizque para acercar · arrastre para recorrer</p>';
    document.body.appendChild(full);
    fullImg = full.querySelector('img');
    full.querySelector('.zm-full-close').addEventListener('click', closeFull);

    var pts = {}, base = 0, baseZ = 1, lx = 0, ly = 0;
    function dist() {
      var k = Object.keys(pts);
      if (k.length < 2) return 0;
      var a = pts[k[0]], b = pts[k[1]];
      return Math.hypot(a.x - b.x, a.y - b.y);
    }
    full.addEventListener('pointerdown', function (e) {
      if (e.target.closest('.zm-full-close')) return;
      pts[e.pointerId] = { x: e.clientX, y: e.clientY };
      lx = e.clientX; ly = e.clientY;
      base = dist(); baseZ = fz;
      try { full.setPointerCapture(e.pointerId); } catch (_) {}
    });
    full.addEventListener('pointermove', function (e) {
      if (!pts[e.pointerId]) return;
      pts[e.pointerId] = { x: e.clientX, y: e.clientY };
      var n = Object.keys(pts).length;
      if (n >= 2 && base) {
        fz = Math.max(1, Math.min(5, baseZ * (dist() / base)));
      } else {
        fx += e.clientX - lx; fy += e.clientY - ly;
        lx = e.clientX; ly = e.clientY;
      }
      paint();
    });
    function up(e) { delete pts[e.pointerId]; base = dist(); baseZ = fz; }
    full.addEventListener('pointerup', up);
    full.addEventListener('pointercancel', up);
    full.addEventListener('dblclick', function () { fz = fz > 1.2 ? 1 : START; fx = fy = 0; paint(); });
  }
  function paint() {
    fullImg.style.transform = 'translate(-50%,-50%) translate(' + fx + 'px,' + fy + 'px) scale(' + fz + ')';
  }
  function openFull(src) {
    buildFull();
    fullImg.src = src;
    fx = fy = 0; fz = START;
    paint();
    full.classList.add('is-open');
    document.documentElement.style.overflow = 'hidden';
  }
  function closeFull() {
    if (!full) return;
    full.classList.remove('is-open');
    document.documentElement.style.overflow = '';
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeFull(); });

  function attachBtn(host) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'zm-btn';
    b.setAttribute('aria-label', 'Ver la pieza de cerca');
    b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"></circle><path d="M15.5 15.5L21 21M10.5 7.6v5.8M7.6 10.5h5.8"></path></svg>';
    b.addEventListener('click', function (e) {
      e.stopPropagation(); e.preventDefault();
      var src = srcOf(host);
      if (src) openFull(src);
    });
    host.appendChild(b);
  }

  /* ── Enganche ───────────────────────────────────────────────── */
  var SEL = '.pdp-art, .jy-media';
  function init(el) {
    if (el.dataset.zmInit) return;
    el.dataset.zmInit = '1';
    if (FINE) attachLens(el); else attachBtn(el);
  }
  function scan(root) {
    if (!root || root.nodeType !== 1) return;
    if (root.matches && root.matches(SEL)) init(root);
    if (root.querySelectorAll) root.querySelectorAll(SEL).forEach(init);
  }
  function boot() {
    scan(document.body);
    new MutationObserver(function (ms) {
      ms.forEach(function (m) { m.addedNodes && m.addedNodes.forEach(scan); });
    }).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState !== 'loading') boot();
  else document.addEventListener('DOMContentLoaded', boot);
})();
