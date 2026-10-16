/* ═══════════════════════════════════════════════════════════════
   PRETO BY DALA&CO · Flotantes
   ───────────────────────────────────────────────────────────────
   Motivos que flotan detrás del texto de la campaña: corazones en
   septiembre, pavesas en octubre, chispas en diciembre… Uno por
   fecha. Lo pide temporadas.js con el motivo y el color de la
   temporada; desde el panel de administración se encienden, se
   apagan y se regula cuántos hay.

   Presupuesto duro, no negociable:
     · máximo 150 partículas, y en la práctica 18/36/64 según la
       intensidad, escaladas al área de la sección;
     · un solo canvas, DPR tope 2;
     · se detiene fuera del viewport y con la pestaña oculta;
     · con prefers-reduced-motion no se monta.

   Uso:  var f = PretoFlotantes.montar(host, 'corazon', {color:'201,169,160', intensidad:'media'});
         f.ajustar({intensidad:'alta'});   f.destruir();

   color: un rgb. colores: una lista de rgb y cada partícula toma uno
   al azar (los motivos que traen paleta propia, como 'hilo', manda
   la suya). escala: multiplica el tamaño del motivo. extra: suma
   partículas a la cuenta ya escalada por área.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var MAX = 150;
  var CUENTA = { suave: 18, media: 36, alta: 64 };

  /* Cada motivo: hacia dónde va (dir: -1 sube, 1 baja), velocidad en
     px/s, tamaño en px, cuánto gira, y cómo se dibuja centrado en 0,0
     con el tamaño s. El color llega de la temporada; la bandera trae
     los suyos. */
  var MOTIVOS = {
    corazon: { dir: -1, vel: [9, 20], tam: [6, 14], giro: .35, vaiven: 14, alfa: [.22, .55],
      dibujar: function (ctx, s, i) {
        var h = s * .5;
        ctx.beginPath();
        ctx.moveTo(0, h * .55);
        ctx.bezierCurveTo(0, -h * .1, -h, -h * .1, -h, h * .35);
        ctx.bezierCurveTo(-h, h * .85, -h * .15, h * 1.25, 0, h * 1.5);
        ctx.bezierCurveTo(h * .15, h * 1.25, h, h * .85, h, h * .35);
        ctx.bezierCurveTo(h, -h * .1, 0, -h * .1, 0, h * .55);
        ctx.closePath();
        ctx.lineWidth = 1;
        if (i % 3 === 0) ctx.fill(); else ctx.stroke();
      } },
    plica: { dir: -1, vel: [14, 30], tam: [10, 26], giro: 0, vaiven: 6, alfa: [.2, .5],
      dibujar: function (ctx, s) { ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, -s / 2); ctx.lineTo(0, s / 2); ctx.stroke(); } },
    mota: { dir: -1, vel: [3, 8], tam: [1.2, 2.8], giro: 0, vaiven: 22, alfa: [.18, .5],
      dibujar: function (ctx, s) { ctx.beginPath(); ctx.arc(0, 0, s, 0, Math.PI * 2); ctx.fill(); } },
    petalo: { dir: 1, vel: [10, 22], tam: [6, 13], giro: .6, vaiven: 26, alfa: [.25, .6],
      dibujar: function (ctx, s) { ctx.beginPath(); ctx.ellipse(0, 0, s * .32, s * .6, 0, 0, Math.PI * 2); ctx.fill(); } },
    modulo: { dir: -1, vel: [6, 14], tam: [6, 16], giro: .1, vaiven: 4, alfa: [.16, .42],
      dibujar: function (ctx, s, i) { ctx.lineWidth = 1; if (i % 4 === 0) ctx.fillRect(-s / 2, -s / 2, s, s); else ctx.strokeRect(-s / 2, -s / 2, s, s); } },
    hilo: { dir: 1, vel: [14, 30], tam: [12, 26], giro: .9, vaiven: 30, alfa: [.35, .7],
      colores: ['217,165,32', '27,42,74', '142,43,43'],
      dibujar: function (ctx, s) { ctx.fillRect(-s / 2, -s * .12, s, s * .24); } },
    pavesa: { dir: -1, vel: [12, 28], tam: [1.2, 2.6], giro: 0, vaiven: 18, alfa: [.3, .85],
      dibujar: function (ctx, s) { ctx.beginPath(); ctx.arc(0, 0, s, 0, Math.PI * 2); ctx.fill(); } },
    cifra: { dir: 1, vel: [8, 18], tam: [10, 18], giro: 0, vaiven: 5, alfa: [.2, .48],
      dibujar: function (ctx, s, i) { ctx.font = '300 ' + s + 'px "Cormorant Garamond",Georgia,serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(i % 10), 0, 0); } },
    chispa: { dir: -1, vel: [16, 36], tam: [1.2, 2.8], giro: 0, vaiven: 12, alfa: [.35, .9], halo: true,
      dibujar: function (ctx, s) { ctx.beginPath(); ctx.arc(0, 0, s, 0, Math.PI * 2); ctx.fill(); } }
  };

  function azar(a, b) { return a + Math.random() * (b - a); }

  function montar(host, motivo, opts) {
    var M = MOTIVOS[motivo];
    if (!M || !host) return null;
    var reduce = false;
    try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
    if (reduce) return null;

    opts = opts || {};
    var color = opts.color || '255,255,255';
    var paleta = (opts.colores && opts.colores.length) ? opts.colores : null;
    var canvas = document.createElement('canvas');
    canvas.className = 'lz-flotantes';
    canvas.setAttribute('aria-hidden', 'true');
    host.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    var W = 0, H = 0, dpr = 1;
    var parts = [];
    var objetivo = 0;
    var vivo = true, visible = true, raf = null, ultimo = 0;

    function cuenta(intensidad) {
      var base = CUENTA[intensidad] || CUENTA.media;
      var area = Math.max(1, W * H) / (1200 * 720);
      var n = Math.round(base * Math.min(1.4, Math.max(.45, area))) + (+opts.extra || 0);
      return Math.min(MAX, Math.max(6, n));
    }
    function nueva(inicial) {
      var s = azar(M.tam[0], M.tam[1]) * (+opts.escala || 1);
      return {
        x: azar(0, W),
        y: inicial ? azar(0, H) : (M.dir < 0 ? H + s * 2 : -s * 2),
        v: azar(M.vel[0], M.vel[1]),
        s: s,
        r: azar(0, Math.PI * 2),
        vr: azar(-M.giro, M.giro),
        a: azar(M.alfa[0], M.alfa[1]),
        f: azar(0, Math.PI * 2),
        fv: azar(.3, .8),
        c: M.colores ? M.colores[Math.floor(Math.random() * M.colores.length)]
           : paleta ? paleta[Math.floor(Math.random() * paleta.length)] : color,
        i: Math.floor(Math.random() * 1000)
      };
    }
    function medir() {
      var r = host.getBoundingClientRect();
      /* Un 0 aquí es «todavía no hay layout», no un tamaño: se espera
         a la siguiente medida (ResizeObserver) en vez de fijar 1×1. */
      if (r.width < 2 || r.height < 2) return;
      W = Math.round(r.width);
      H = Math.round(r.height);
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      objetivo = cuenta(opts.intensidad);
      while (parts.length > objetivo) parts.pop();
      while (parts.length < objetivo) parts.push(nueva(true));
    }
    function paso(t) {
      raf = null;
      if (!vivo || !visible || !W) return;
      var dt = ultimo ? Math.min(.05, (t - ultimo) / 1000) : .016;
      ultimo = t;
      cuadro(dt);
      raf = requestAnimationFrame(paso);
    }
    /* Un cuadro: avanza dt segundos y pinta. Separado del bucle para
       poder pintar uno solo a mano (capturas, pruebas). */
    function cuadro(dt) {
      ctx.clearRect(0, 0, W, H);
      for (var k = 0; k < parts.length; k++) {
        var p = parts[k];
        p.f += p.fv * dt;
        p.y += M.dir * p.v * dt;
        p.x += Math.sin(p.f) * M.vaiven * dt;
        p.r += p.vr * dt;
        if (M.dir < 0 && p.y < -p.s * 2) parts[k] = p = nueva(false);
        else if (M.dir > 0 && p.y > H + p.s * 2) parts[k] = p = nueva(false);
        if (p.x < -p.s * 2) p.x = W + p.s; else if (p.x > W + p.s * 2) p.x = -p.s;
        /* Aparece y se apaga suavemente en los bordes verticales. */
        var borde = Math.min(1, Math.min(p.y + p.s * 2, H - p.y + p.s * 2) / (H * .18));
        var alfa = p.a * Math.max(0, borde);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.globalAlpha = alfa;
        ctx.fillStyle = 'rgb(' + p.c + ')';
        ctx.strokeStyle = 'rgb(' + p.c + ')';
        if (M.halo) { ctx.shadowColor = 'rgb(' + p.c + ')'; ctx.shadowBlur = p.s * 4; }
        M.dibujar(ctx, p.s, p.i);
        ctx.restore();
      }
    }
    function arrancar() { if (vivo && visible && !raf) { ultimo = 0; raf = requestAnimationFrame(paso); } }
    function parar() { if (raf) { cancelAnimationFrame(raf); raf = null; } }

    medir();
    /* Corre solo cuando la sección está en pantalla Y la pestaña a la
       vista. Las dos condiciones se llevan por separado: al volver a
       la pestaña no se arranca si la sección sigue fuera de vista. */
    var enVista = !('IntersectionObserver' in window);
    function evaluar() { visible = enVista && !document.hidden; visible ? arrancar() : parar(); }
    var io = null;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(function (ent) {
        ent.forEach(function (e) { enVista = e.isIntersecting; });
        evaluar();
      }, { threshold: 0.02 });
      io.observe(host);
    } else evaluar();
    document.addEventListener('visibilitychange', evaluar);
    /* El canvas sigue el tamaño real de la sección: cambio de fuente,
       giro del móvil, texto que se reacomoda. ResizeObserver dispara
       también la primera medida válida cuando el layout llega tarde. */
    var rt = null, ro = null;
    function alMedida() { clearTimeout(rt); rt = setTimeout(medir, 120); }
    if ('ResizeObserver' in window) { ro = new ResizeObserver(alMedida); ro.observe(host); }
    else window.addEventListener('resize', alMedida, { passive: true });

    var inst = {
      ajustar: function (o) { opts = Object.assign({}, opts, o || {}); medir(); },
      pausar: function () { vivo = false; parar(); },
      reanudar: function () { vivo = true; arrancar(); },
      cuadro: function (n) { for (var k = 0; k < (n || 1); k++) cuadro(.016); },
      destruir: function () {
        vivo = false; parar();
        if (io) io.disconnect();
        if (ro) ro.disconnect();
        clearTimeout(rt);
        document.removeEventListener('visibilitychange', evaluar);
        window.removeEventListener('resize', alMedida);
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
        var k = instancias.indexOf(inst); if (k !== -1) instancias.splice(k, 1);
      }
    };
    instancias.push(inst);
    return inst;
  }

  /* Registro de instancias: permite pausar y reanudar todo desde fuera
     (capturas, pruebas, o un futuro botón de «quietud»). */
  var instancias = [];
  window.PretoFlotantes = {
    montar: montar,
    motivos: Object.keys(MOTIVOS),
    pausar: function () { instancias.forEach(function (i) { i.pausar(); }); },
    reanudar: function () { instancias.forEach(function (i) { i.reanudar(); }); },
    cuadro: function (n) { instancias.forEach(function (i) { i.cuadro(n); }); }
  };
})();
