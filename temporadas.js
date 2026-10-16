/* ═══════════════════════════════════════════════════════════════
   PRETO BY DALA&CO · Motor de temporadas
   ───────────────────────────────────────────────────────────────
   Una sección, nueve fechas. Este archivo decide cuál toca hoy,
   reviste la sección con su paleta, escribe su copy, monta su gesto
   firma y sus flotantes. Fuera de temporada la sección se oculta
   entera: la tienda nunca queda con una campaña vencida en portada.

   VENTANAS. Cada campaña ocupa por defecto TODO su mes (septiembre
   entero para Amor y Amistad, diciembre entero para Velitas…). La
   cuenta atrás corre hasta el día de la fecha y, pasado ese día, la
   sección queda en modo «la selección está abierta» hasta fin de mes.

   PANEL. Desde admin.html → pestaña Temporadas se puede, por fecha:
   apagarla, cambiar sus días, encender o apagar los flotantes y
   regular cuántos hay. Eso se guarda en Firestore (config/temporadas)
   y la portada lo lee por /.netlify/functions/temporadas-config, con
   copia en localStorage para que la segunda visita lo aplique al
   instante. Sin panel ni red, valen los valores por defecto.

   ORDEN DE CARGA — importa: flotantes.js → este → lazo.js (todos
   defer). Este deja window.PRETO_TEMPORADA {id, target, source} y
   lazo.js lo lee para la cuenta atrás y para etiquetar los correos.

   PARA PROBAR CUALQUIER FECHA HOY:  index.html?temporada=fuego
   Ids: mujer · silencio · madre · padre · bandera · amor ·
        penumbra · urgencia · fuego   (?temporada=off la apaga)

   PARA RETIRAR TODO: borra la <section id="lazo">, sus tres scripts
   y las dos hojas de estilo. Nada más del sitio depende de esto.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var reduce = false;
  try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  /* ── Calendario ─────────────────────────────────────────────────
     Todo en hora de Colombia (UTC−5). Las fechas móviles se calculan,
     no se copian a mano: el motor sigue siendo correcto en 2027 y más
     allá sin que nadie tenga que volver a tocarlo. */
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function co(y, m, d) { return new Date(y + '-' + pad(m) + '-' + pad(d) + 'T00:00:00-05:00'); }
  function coStr(s) { return /^\d{4}-\d{2}-\d{2}$/.test(s || '') ? new Date(s + 'T00:00:00-05:00') : null; }
  function mas(fecha, dias) { return new Date(fecha.getTime() + dias * 86400000); }
  function mesDe(fecha) {
    /* Primer día del mes de la fecha y primer día del mes siguiente,
       ambos a medianoche de Colombia. */
    var p = fecha.toLocaleDateString('en-CA', { timeZone: 'America/Bogota' }).split('-');
    var y = +p[0], m = +p[1];
    return { desde: co(y, m, 1), cierra: m === 12 ? co(y + 1, 1, 1) : co(y, m + 1, 1) };
  }

  /* Domingo de Resurrección · algoritmo gregoriano anónimo. */
  function pascua(y) {
    var a = y % 19, b = Math.floor(y / 100), c = y % 100,
        d = Math.floor(b / 4), e = b % 4,
        f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3),
        h = (19 * a + b - d - g + 15) % 30,
        i = Math.floor(c / 4), k = c % 4,
        l = (32 + 2 * e + 2 * i - h - k) % 7,
        m = Math.floor((a + 11 * h + 22 * l) / 451);
    return { mes: Math.floor((h + l - 7 * m + 114) / 31), dia: ((h + l - 7 * m + 114) % 31) + 1 };
  }
  /* n-ésimo día de la semana del mes (dow: 0 domingo … 6 sábado). */
  function nth(y, mes, dow, n) {
    var primero = new Date(Date.UTC(y, mes - 1, 1)).getUTCDay();
    return 1 + ((dow - primero + 7) % 7) + (n - 1) * 7;
  }

  /* ── Las nueve fichas ───────────────────────────────────────────
     Cada una: cuándo abre, su ventana por defecto (el mes entero), su
     gesto, su flotante y su copy. El bloque de las tres placas NO
     cambia entre fechas: son piezas reales del catálogo con precio en
     vivo desde precios.js. */
  function fichas(y) {
    var p = pascua(y);
    var domingoPascua = co(y, p.mes, p.dia);
    var juevesSanto = mas(domingoPascua, -3);
    var diaMadre = nth(y, 5, 0, 2);
    var diaPadre = nth(y, 6, 0, 3);
    var diaAmor = nth(y, 9, 6, 3);
    var viernesNegro = nth(y, 11, 5, 4);

    var lista = [
      { id: 'mujer', gesto: 'voz', flotante: 'plica', abre: co(y, 3, 8),
        nombre: 'La voz', label: 'Día de la Mujer · La voz',
        eyebrow: '— Día de la Mujer · 8 de marzo',
        titulo: 'La ', script: 'voz',
        lede: 'Una joya no adorna: declara. La selección de la casa para esta fecha abre el 8 de marzo. Deje su correo y la promoción le llega al instante.' },

      { id: 'silencio', gesto: 'luz', flotante: 'mota', abre: juevesSanto,
        nombre: 'El silencio', label: 'Semana Santa · El silencio',
        eyebrow: '— Semana Santa · Jueves Santo',
        titulo: 'El ', script: 'silencio',
        lede: 'La casa guarda la semana y el taller descansa. La selección abre el Jueves Santo. Deje su correo y la promoción le llega al instante.' },

      { id: 'madre', gesto: 'sostener', flotante: 'petalo', abre: co(y, 5, diaMadre),
        nombre: 'Quien sostiene', label: 'Día de la Madre · Sostener',
        eyebrow: '— Día de la Madre · segundo domingo de mayo',
        titulo: 'Quien ', script: 'sostiene',
        lede: 'Hay manos que se recuerdan por lo que cargaron. La selección de la casa abre el segundo domingo de mayo. Deje su correo y la promoción le llega al instante.' },

      { id: 'padre', gesto: 'estructura', flotante: 'modulo', abre: co(y, 6, diaPadre),
        nombre: 'La estructura', label: 'Día del Padre · La estructura',
        eyebrow: '— Día del Padre · tercer domingo de junio',
        titulo: 'La ', script: 'estructura',
        lede: 'Lo que sostiene una casa rara vez se ve. La selección abre el tercer domingo de junio. Deje su correo y la promoción le llega al instante.' },

      { id: 'bandera', gesto: 'bandera', flotante: 'hilo', abre: co(y, 7, 20),
        nombre: 'La bandera', label: 'Independencia · La bandera',
        eyebrow: '— Independencia · 20 de julio',
        titulo: 'La ', script: 'bandera',
        lede: 'Oro, noche y tierra: los tres colores ya eran materia antes de ser símbolo. La selección abre el 20 de julio. Deje su correo y la promoción le llega al instante.' },

      /* fuente: etiqueta con la que se guardan los correos. Septiembre
         la fija a mano porque la campaña ya está viva y tiene apuntes
         en Firestore bajo 'lazo-2026'; derivarla del id los partiría
         en dos listas. Las demás fechas la derivan solas. */
      { id: 'amor', gesto: 'lazo', flotante: 'corazon', fuente: 'lazo-2026', abre: co(y, 9, diaAmor),
        nombre: 'El lazo', label: 'Amor y Amistad · El lazo',
        eyebrow: '— Amor y Amistad · tercer sábado de septiembre',
        titulo: 'El ', script: 'lazo',
        lede: 'Un regalo es un nudo entre dos personas. La selección de la casa para esta fecha abre el tercer sábado de septiembre. Deje su correo y la promoción de Amor y Amistad le llega al instante.' },

      { id: 'penumbra', gesto: 'penumbra', flotante: 'pavesa', abre: co(y, 10, 31),
        nombre: 'La penumbra', label: 'Halloween · Penumbra elegante',
        eyebrow: '— Día de las Brujitas · 31 de octubre',
        titulo: 'La ', script: 'penumbra',
        lede: 'El oro solo se entiende cuando hay poca luz. La selección de la casa abre el 31 de octubre. Deje su correo y la promoción le llega al instante.' },

      { id: 'urgencia', gesto: 'cinta', flotante: 'cifra', abre: co(y, 11, viernesNegro),
        nombre: 'El viernes', label: 'Black Friday · Urgencia sin gritar',
        eyebrow: '— Viernes Negro · noviembre',
        titulo: 'El ', script: 'viernes',
        lede: 'Un solo día, sin estridencia. La selección de la casa abre el cuarto viernes de noviembre. Deje su correo y la promoción le llega al instante.' },

      { id: 'fuego', gesto: 'fuego', flotante: 'chispa', abre: co(y, 12, 7),
        nombre: 'Fuego pequeño', label: 'Velitas y Navidad · Fuego pequeño',
        eyebrow: '— Noche de las Velitas · 7 de diciembre',
        titulo: 'Fuego ', script: 'pequeño',
        lede: 'Una luz se pasa a la siguiente y ninguna pierde nada. La selección de la casa abre el 7 de diciembre. Deje su correo y la promoción le llega al instante.' }
    ];
    lista.forEach(function (f) {
      var m = mesDe(f.abre);
      f.desde = m.desde; f.cierra = m.cierra;
      f.abierto = 'La selección está abierta.';
    });
    return lista;
  }

  /* ── Ajustes del panel ──────────────────────────────────────────
     cfg.temporadas[id] = { activa, flotantes, intensidad, desde, hasta }
     desde/hasta son 'AAAA-MM-DD' inclusivos y pertenecen al CICLO al
     que están pegados: solo se aplican a la ficha cuya apertura cae a
     menos de 92 días. Un ajuste de septiembre de 2026 no toca el ciclo
     de 2027, que vuelve a los valores por defecto. */
  var CFG_KEY = 'preto.temporadas.cfg';
  var CERCA = 92 * 86400000;
  function delCiclo(d, f) { return !!d && Math.abs(d.getTime() - f.abre.getTime()) <= CERCA; }
  function leerCfg() { try { return JSON.parse(localStorage.getItem(CFG_KEY) || 'null') || {}; } catch (e) { return {}; } }
  function ajusteDe(cfg, f) {
    var t = (cfg && cfg.temporadas) || {};
    return t[f.id] || {};
  }
  function ventana(f, cfg) {
    var a = ajusteDe(cfg, f);
    var desde = f.desde, cierra = f.cierra;
    var d1 = coStr(a.desde), d2 = coStr(a.hasta);
    if (delCiclo(d1, f)) desde = d1;
    if (delCiclo(d2, f)) cierra = mas(d2, 1);
    if (cierra.getTime() <= desde.getTime()) cierra = mas(desde, 1);
    return { desde: desde, cierra: cierra, activa: a.activa !== false };
  }

  /* ── Qué temporada toca ─────────────────────────────────────────
     Se miran el año en curso y el siguiente: la ventana de diciembre
     y la de marzo se tocan al cruzar el año. Si dos ventanas se
     solapan (Semana Santa cae en marzo algunos años), gana la fecha
     que aún no ha pasado —o pasó hace menos de dos días— y abre
     antes; si todas pasaron, la más reciente. */
  function candidatas(ahora, cfg) {
    var t = ahora.getTime();
    var lista = fichas(ahora.getFullYear()).concat(fichas(ahora.getFullYear() + 1));
    return lista.filter(function (f) {
      var v = ventana(f, cfg);
      return v.activa && t >= v.desde.getTime() && t < v.cierra.getTime();
    });
  }
  function resolver(ahora, cfg) {
    var c = candidatas(ahora, cfg);
    if (!c.length) return null;
    var t = ahora.getTime(), vivas = c.filter(function (f) { return f.abre.getTime() >= t - 2 * 86400000; });
    if (vivas.length) return vivas.sort(function (a, b) { return a.abre - b.abre; })[0];
    return c.sort(function (a, b) { return b.abre - a.abre; })[0];
  }

  /* El calendario se expone antes de tocar el DOM: admin.html y el
     panel temporadas.html lo cargan tal cual y leen las MISMAS
     ventanas que se publican, en vez de repetirlas. */
  window.PretoTemporadas = { fichas: fichas, resolver: resolver, ventana: ventana, CFG_KEY: CFG_KEY };

  var sec = document.getElementById('lazo');
  if (!sec) return;

  var cfg = leerCfg();
  var forzada = null;
  try { forzada = new URLSearchParams(location.search).get('temporada'); } catch (e) {}

  var hoy = new Date();
  var ficha = resolver(hoy, cfg);
  if (forzada) {
    if (forzada === 'off') ficha = null;
    else {
      /* Vista previa: se ignora si está apagada; se toma el ciclo que
         aún no abrió, para ver la cuenta atrás. */
      var todas = fichas(hoy.getFullYear()).concat(fichas(hoy.getFullYear() + 1));
      ficha = null;
      for (var j = 0; j < todas.length; j++) {
        if (todas[j].id !== forzada) continue;
        if (!ficha || (ficha.abre.getTime() < hoy.getTime() && todas[j].abre.getTime() > hoy.getTime())) ficha = todas[j];
      }
    }
  }

  /* Fuera de temporada la sección desaparece del documento. */
  function ocultar() { sec.hidden = true; sec.setAttribute('aria-hidden', 'true'); }
  if (!ficha) { ocultar(); refrescarCfg(); return; }

  /* ── Contrato con lazo.js ───────────────────────────────────── */
  window.PRETO_TEMPORADA = {
    id: ficha.id,
    target: ficha.abre.getTime(),
    source: ficha.fuente || (ficha.id + '-' + ficha.abre.getFullYear())
  };

  /* ── Revestir la sección ────────────────────────────────────── */
  sec.setAttribute('data-temporada', ficha.id);
  sec.setAttribute('data-screen-label', ficha.label);

  function texto(sel, txt) { var el = sec.querySelector(sel); if (el && txt) el.textContent = txt; }
  texto('.lz-eyebrow', ficha.eyebrow);
  texto('.lz-lede', ficha.lede);

  var titleEl = sec.querySelector('.lz-title');
  if (titleEl) {
    titleEl.textContent = ficha.titulo;
    var sp = document.createElement('span');
    sp.className = 'lz-script';
    sp.textContent = ficha.script;
    titleEl.appendChild(sp);
  }
  var openEl = sec.querySelector('.lz-open');
  if (openEl) {
    openEl.textContent = ficha.abierto + ' ';
    var a = document.createElement('a');
    a.href = '#collections';
    a.textContent = 'Ver las piezas';
    openEl.appendChild(a);
  }
  var okSub = sec.querySelector('.lz-ok-sub');
  if (okSub && ficha.id !== 'amor') okSub.textContent = 'La promoción va camino a su correo. Revíselo en un minuto.';

  /* ── Titular carácter a carácter ────────────────────────────────
     Stagger de 26 ms, dentro del rango de la gramática. Se respetan
     los elementos hijos: solo se parten los nodos de texto. */
  if (titleEl && !reduce) {
    var n = 0;
    [].slice.call(titleEl.childNodes).forEach(function (nodo) {
      var destino = nodo.nodeType === 3 ? titleEl : nodo;
      var fuente = nodo.nodeType === 3 ? nodo.nodeValue : nodo.textContent;
      var frag = document.createDocumentFragment();
      fuente.split('').forEach(function (ch) {
        if (ch === ' ') { frag.appendChild(document.createTextNode(' ')); return; }
        var s = document.createElement('span');
        s.className = 'lz-ch';
        s.textContent = ch;
        s.style.transitionDelay = (n++ * 26) + 'ms';
        frag.appendChild(s);
      });
      if (nodo.nodeType === 3) destino.replaceChild(frag, nodo);
      else { nodo.textContent = ''; nodo.appendChild(frag); }
    });
  }

  /* ── El gesto firma ─────────────────────────────────────────────
     Uno por fecha, nunca dos. El nudo de septiembre ya vive en el
     HTML (es la fecha por defecto); las demás fechas lo retiran y
     montan el suyo en .lz-gesto. */
  var capa = sec.querySelector('.lz-gesto');
  var knot = sec.querySelector('.lz-knot');
  if (ficha.gesto !== 'lazo' && knot) knot.remove();

  var svgTurbulencia = function (id, freq, escala) {
    return '<filter id="' + id + '" x="-25%" y="-25%" width="150%" height="150%">' +
      '<feTurbulence type="fractalNoise" baseFrequency="' + freq[0] + '" numOctaves="2" seed="7" result="n">' +
      '<animate attributeName="baseFrequency" dur="13s" values="' + freq[0] + ';' + freq[1] + ';' + freq[0] + '" repeatCount="indefinite"></animate>' +
      '</feTurbulence>' +
      '<feDisplacementMap in="SourceGraphic" in2="n" scale="' + escala + '" xChannelSelector="R" yChannelSelector="G"></feDisplacementMap>' +
      '</filter>';
  };

  var GESTOS = {
    lazo: function () { return ''; },

    voz: function () {
      var barras = '';
      for (var i = 0; i < 34; i++) {
        var alto = 18 + Math.round(Math.abs(Math.sin(i * 0.55)) * 78);
        barras += '<i style="height:' + alto + '%;transition-delay:' + (i * 30) + 'ms"></i>';
      }
      return '<div class="g-voz">' + barras + '</div>';
    },

    luz: function () { return '<div class="g-luz"></div>'; },

    sostener: function () {
      return '<div class="g-plano g-plano--1"></div><div class="g-plano g-plano--2"></div><div class="g-plano g-plano--3"></div>' +
        '<svg class="g-firma" viewBox="0 0 420 120" fill="none" aria-hidden="true" focusable="false">' +
        '<path pathLength="1" d="M18 86 C 44 34 62 22 74 34 C 86 46 66 84 58 92 C 50 100 58 104 74 96 C 96 85 108 46 124 40 C 138 35 132 70 142 78 C 152 86 168 62 180 44 C 190 29 200 34 200 52 C 200 74 188 92 200 96 C 214 101 240 72 258 50 C 272 33 284 38 282 58 C 280 78 268 92 280 96 C 296 101 330 70 352 46 C 368 29 384 36 396 52"></path>' +
        '</svg>';
    },

    estructura: function () {
      var cols = window.innerWidth <= 640 ? 6 : 12;
      var filas = window.innerWidth <= 640 ? 5 : 6;
      var cel = '';
      for (var r = 0; r < filas; r++) {
        for (var c = 0; c < cols; c++) cel += '<i style="transition-delay:' + ((r + c) * 55) + 'ms"></i>';
      }
      return '<div class="g-malla">' + cel + '</div>';
    },

    bandera: function () {
      return '<svg class="g-bandera" viewBox="0 0 1200 400" preserveAspectRatio="none" aria-hidden="true" focusable="false">' +
        '<defs>' + svgTurbulencia('lzTela', ['0.004 0.014', '0.008 0.021'], 30) + '</defs>' +
        '<g filter="url(#lzTela)">' +
        '<rect class="g-band g-band--y" x="-60" y="30" width="1320" height="185" fill="#D9A520"></rect>' +
        '<rect class="g-band g-band--b" x="-60" y="215" width="1320" height="93" fill="#1B2A4A"></rect>' +
        '<rect class="g-band g-band--r" x="-60" y="308" width="1320" height="93" fill="#8E2B2B"></rect>' +
        '</g></svg>';
    },

    penumbra: function () {
      var fine = false;
      try { fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches; } catch (e) {}
      return '<div class="g-luna' + (fine ? '' : ' g-luna--auto') + '"></div>';
    },

    cinta: function () { return '<div class="g-cinta"></div>'; },

    fuego: function () {
      return '<div class="g-halo"></div>' +
        '<svg class="g-vela" viewBox="0 0 120 180" fill="none" aria-hidden="true" focusable="false"><defs>' +
        svgTurbulencia('lzLlama', ['0.022 0.05', '0.04 0.085'], 7) +
        '</defs>' +
        '<rect x="46" y="74" width="28" height="98" fill="rgba(240,235,225,.14)"></rect>' +
        '<rect x="46" y="74" width="28" height="4" fill="rgba(240,235,225,.26)"></rect>' +
        '<line x1="60" y1="66" x2="60" y2="76" stroke="rgba(10,32,25,.8)" stroke-width="2"></line>' +
        '<g filter="url(#lzLlama)">' +
        '<ellipse cx="60" cy="42" rx="13" ry="27" fill="#C9A227" opacity=".92"></ellipse>' +
        '<ellipse cx="60" cy="48" rx="6" ry="15" fill="#F0EBE1" opacity=".85"></ellipse>' +
        '</g></svg>';
    }
  };

  if (capa && GESTOS[ficha.gesto]) capa.innerHTML = GESTOS[ficha.gesto]();

  /* ── Flotantes ──────────────────────────────────────────────────
     El motivo de la fecha, del color de acento de la temporada, detrás
     del texto. Encendidos por defecto; el panel los apaga o regula. */
  var flot = null;
  function colorAcento() {
    var v = getComputedStyle(sec).getPropertyValue('--lz-rose-rgb').trim();
    return v || '255,255,255';
  }
  function aplicarFlotantes(cfgActual) {
    var a = ajusteDe(cfgActual, ficha);
    var encendidos = a.flotantes !== false;
    var intensidad = a.intensidad || 'media';
    if (!encendidos) { if (flot) { flot.destruir(); flot = null; } return; }
    if (!window.PretoFlotantes || !capa) return;
    if (flot) flot.ajustar({ intensidad: intensidad });
    else flot = window.PretoFlotantes.montar(capa, ficha.flotante, { color: colorAcento(), intensidad: intensidad });
  }
  aplicarFlotantes(cfg);

  /* Las clases de animación solo existen si este script corrió: sin
     JS nada queda oculto ni a medio camino. */
  sec.classList.add('is-armed');

  /* ── Disparo al entrar en pantalla ──────────────────────────────
     Las placas escalonan a 55 ms. is-drawn lo comparte con lazo.js,
     que lo usa para el trazado del nudo. */
  function mostrar() {
    sec.classList.add('is-shown');
    /* El delay va posición a posición, en el mismo orden que la
       lista de transition de temporadas.css (transform, border-color,
       background-color, opacity, clip-path): si se pusiera un valor
       único, el hover magnético heredaría el retraso del reveal. */
    sec.querySelectorAll('.lz-card').forEach(function (c, i) {
      var d = (i * 55) + 'ms';
      c.style.transitionDelay = '0ms,0ms,0ms,' + d + ',' + d;
    });
  }
  if (reduce || !('IntersectionObserver' in window)) mostrar();
  else {
    var io = new IntersectionObserver(function (ent) {
      ent.forEach(function (e) { if (e.isIntersecting) { io.disconnect(); mostrar(); } });
    }, { threshold: 0.18 });
    io.observe(sec);
  }

  /* ── Profundidad: el gesto va más lento que el texto ──────────── */
  if (!reduce) {
    var pendiente = false;
    var actualizar = function () {
      pendiente = false;
      var r = sec.getBoundingClientRect();
      var centro = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
      sec.style.setProperty('--lz-scroll', Math.max(-1.4, Math.min(1.4, centro)).toFixed(3));
    };
    var alScroll = function () {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(actualizar);
    };
    window.addEventListener('scroll', alScroll, { passive: true });
    window.addEventListener('resize', alScroll, { passive: true });
    actualizar();
  }

  /* ── Octubre: el cursor es la luz ───────────────────────────── */
  if (ficha.gesto === 'penumbra' && !reduce) {
    var luna = sec.querySelector('.g-luna');
    if (luna && !luna.classList.contains('g-luna--auto')) {
      var esperando = false, px = 0, py = 0;
      sec.addEventListener('pointermove', function (e) {
        var r = sec.getBoundingClientRect();
        px = ((e.clientX - r.left) / r.width) * 100;
        py = ((e.clientY - r.top) / r.height) * 100;
        if (esperando) return;
        esperando = true;
        requestAnimationFrame(function () {
          esperando = false;
          sec.style.setProperty('--lz-mx', px.toFixed(1) + '%');
          sec.style.setProperty('--lz-my', py.toFixed(1) + '%');
        });
      }, { passive: true });
    }
  }

  /* ── Presupuesto: las turbulencias SVG se pausan fuera de vista ── */
  var svgs = [].slice.call(sec.querySelectorAll('.g-bandera, .g-vela'));
  if (svgs.length && 'IntersectionObserver' in window) {
    if (reduce) svgs.forEach(function (s) { try { s.pauseAnimations(); } catch (e) {} });
    else {
      var ioAnim = new IntersectionObserver(function (ent) {
        ent.forEach(function (e) {
          svgs.forEach(function (s) {
            try { e.isIntersecting ? s.unpauseAnimations() : s.pauseAnimations(); } catch (err) {}
          });
        });
      }, { threshold: 0.02 });
      ioAnim.observe(sec);
    }
  }

  refrescarCfg();

  /* ── Ajustes frescos del panel ──────────────────────────────────
     Se piden en segundo plano y se guardan para la próxima visita.
     En vivo se aplica lo que no obliga a rearmar la sección: apagarla
     y los flotantes. Un cambio de fecha se ve en la siguiente carga.
     En vista previa (?temporada=) no se apaga nada. */
  function refrescarCfg() {
    if (!window.fetch) return;
    setTimeout(function () {
      fetch('/.netlify/functions/temporadas-config', { cache: 'no-store' })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (nuevo) {
          if (!nuevo || typeof nuevo !== 'object') return;
          var s = JSON.stringify(nuevo);
          if (s === JSON.stringify(cfg)) return;
          try { localStorage.setItem(CFG_KEY, s); } catch (e) {}
          cfg = nuevo;
          if (!ficha || forzada) return;
          var ahora = resolver(new Date(), cfg);
          if (!ahora) {
            if (flot) { flot.destruir(); flot = null; }
            ocultar();
            /* lazo.js sigue contando cada segundo: se le avisa. */
            try { sec.dispatchEvent(new CustomEvent('lazo:ocultar')); } catch (e) {}
            return;
          }
          if (ahora.id === ficha.id) aplicarFlotantes(cfg);
        })
        .catch(function () {});
    }, 800);
  }
})();
