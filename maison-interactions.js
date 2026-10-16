/* ═══════════════════════════════════════════════════════════════
   Preto · Interacciones de maison (P2)
   Autónomo: no depende de las funciones internas de app.js — se
   engancha observando las clases .open de los overlays (mismo patrón
   que syncCatNav). Todo respeta prefers-reduced-motion y se limita a
   3 tipos de interacción por vista.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var mq = window.matchMedia;
  var reduce = !!(mq && mq('(prefers-reduced-motion: reduce)').matches);
  var fine   = !!(mq && mq('(hover: hover) and (pointer: fine)').matches);
  var $ = function (id) { return document.getElementById(id); };

  /* ── 1 · Hover-tilt sutil (≈4°) en tarjetas hero y grid de producto ─
     Las tarjetas del carrusel y del catálogo se inyectan por JS, así que
     observamos sus contenedores para enlazar las nuevas. */
  function initTilt() {
    if (reduce || !fine) return;
    var MAX = 4; // grados
    function bind(el) {
      if (el.__tilt) return; el.__tilt = true;
      var raf = null, rx = 0, ry = 0;
      function apply() {
        raf = null;
        el.style.transform = 'perspective(950px) translateY(-3px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
      }
      el.addEventListener('pointermove', function (e) {
        if (e.pointerType === 'touch') return;
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        ry = px * MAX * 2; rx = -py * MAX * 2;
        el.style.transition = 'transform .13s ease-out, border-color .4s ease-out';
        if (!raf) raf = requestAnimationFrame(apply);
      });
      el.addEventListener('pointerleave', function () {
        if (raf) { cancelAnimationFrame(raf); raf = null; }
        el.style.transition = 'transform .5s ease-out, border-color .4s ease-out';
        el.style.transform = '';
      });
    }
    function scan(root) {
      (root || document).querySelectorAll('.explora-card, .pcard, .var-card, .sr-card').forEach(bind);
    }
    scan(document);
    ['collGrid', 'catShell', 'searchResults'].forEach(function (id) {
      var c = $(id);
      if (c) new MutationObserver(function () { scan(c); }).observe(c, { childList: true, subtree: true });
    });
  }

  /* ── 2 · Botón magnético en las vías de WhatsApp ────────────────── */
  function initMagnetic() {
    if (reduce || !fine) return;
    document.querySelectorAll('.wa, .pdp-cta-wa').forEach(function (btn) {
      var raf = null, dx = 0, dy = 0;
      function apply() { raf = null; btn.style.transform = 'translate(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px)'; }
      btn.addEventListener('pointerenter', function () { btn.style.transition = 'transform .16s ease-out'; });
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        dx = (e.clientX - (r.left + r.width / 2)) * 0.28;
        dy = (e.clientY - (r.top + r.height / 2)) * 0.28;
        if (!raf) raf = requestAnimationFrame(apply);
      });
      btn.addEventListener('pointerleave', function () {
        if (raf) { cancelAnimationFrame(raf); raf = null; }
        btn.style.transition = 'transform .5s ease-out';
        btn.style.transform = '';
      });
    });
  }

  /* ── 3 · Transición de cortina/barrido al abrir una sección ─────── */
  function initCurtain() {
    if (reduce) return;
    var curtain = $('curtainSweep');
    if (!curtain) return;
    var t = null;
    function sweep() {
      curtain.classList.remove('sweep');
      void curtain.offsetWidth;
      curtain.classList.add('sweep');
      clearTimeout(t);
      t = setTimeout(function () { curtain.classList.remove('sweep'); }, 900);
    }
    ['catOverlay', 'maisonOverlay', 'historiaOverlay', 'regalosOverlay'].forEach(function (id) {
      var ov = $(id);
      if (!ov) return;
      var wasOpen = ov.classList.contains('open');
      new MutationObserver(function () {
        var open = ov.classList.contains('open');
        if (open && !wasOpen) sweep();
        wasOpen = open;
      }).observe(ov, { attributes: true, attributeFilter: ['class'] });
    });
  }

  /* ── 4 · Maison · scroll-scrub de Herencia + reveal de textura ──── */
  function initMaisonScroll() {
    var overlay = $('maisonOverlay');
    if (!overlay) return;
    var img  = overlay.querySelector('.heritage-right img');
    var proc = overlay.querySelector('.maison-sustain');
    if (proc) proc.classList.add('proc-tex');
    var raf = null;
    function update() {
      raf = null;
      var vh = overlay.clientHeight || window.innerHeight;
      if (img && !reduce) {
        var r = img.getBoundingClientRect();
        var prog = (r.top + r.height / 2) / vh;              // ~1 abajo → ~0 arriba
        var shift = Math.max(-1, Math.min(1, 0.5 - prog)) * 34; // ±17px
        img.style.transform = 'scale(1.12) translateY(' + shift.toFixed(1) + 'px)';
      }
      if (proc) {
        var pr = proc.getBoundingClientRect();
        if (pr.top < vh * 0.82) proc.classList.add('tex-in');
      }
    }
    function onScroll() { if (!raf) raf = requestAnimationFrame(update); }
    overlay.addEventListener('scroll', onScroll, { passive: true });
    // Recalcular cada vez que la sección pasa a visible.
    new MutationObserver(function () {
      if (overlay.classList.contains('open')) requestAnimationFrame(update);
    }).observe(overlay, { attributes: true, attributeFilter: ['class'] });
  }

  /* ── P1 · Estado dorado del ícono de carrito mientras está abierto ─ */
  function initCartIconState() {
    var drawer = $('drawer'), btn = $('openCart');
    if (!drawer || !btn) return;
    new MutationObserver(function () {
      btn.classList.toggle('is-open', drawer.classList.contains('open'));
    }).observe(drawer, { attributes: true, attributeFilter: ['class'] });
  }

  /* ── P1 · Scroll-spy: subrayado dorado en el link de sección activa ─ */
  function initScrollSpy() {
    if (!('IntersectionObserver' in window)) return;
    var links = [].slice.call(document.querySelectorAll('.nav-bottom a.nav-link[href^="#"]'));
    var map = {};
    links.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      if (document.getElementById(id)) map[id] = a;
    });
    var ids = Object.keys(map);
    if (!ids.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (l) { l.classList.remove('active'); });
        map[e.target.id].classList.add('active');
      });
    }, { threshold: 0.45 });
    ids.forEach(function (id) { io.observe(document.getElementById(id)); });
  }

  function init() {
    initTilt();
    initMagnetic();
    initCurtain();
    initMaisonScroll();
    initCartIconState();
    initScrollSpy();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
