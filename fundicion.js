/* ═══════════════════════════════════════════════════════════════
   PRETO BY DALA&CO · DALA FUNDIÇÃO — "La Fundición"
   Verter grano · pesar · MEZCLAR (quilataje real) · fundir ·
   certificar · cotizar o pagar
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var WA_NUMBER = '573226955451';
  var QKEY      = 'preto.quote.v1';   // mismo carrito que la tienda
  var MAX_G     = 150;
  var PINCH_G   = 2;
  var HOLD_MS   = 170;
  var TICK_MS   = 90;
  var LS_KEY    = 'preto.fundicion';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Materiales ─────────────────────────────────────────────────
     kind: gold | platino | plata | cobre
     fraction = fracción de metal fino · el ORO define el quilataje  */
  var MATERIALS = [
    { key:'oro24k',   name:'Oro fino 24k',     fine:'Au 999 · puro', kind:'gold', fraction:1.000, hall:'Au 999', molten:'#F2C33E', grain:'#E7B93A', group:'oros', base:true },
    { key:'choco',    name:'Oro de Chocó',     fine:'Au 750 · 18k',  kind:'gold', fraction:0.750, hall:'Au 750', molten:'#D9A53A', grain:'#C99A3B', group:'oros' },
    { key:'amarillo', name:'Oro 18k amarillo', fine:'Au 750 · 18k',  kind:'gold', fraction:0.750, hall:'Au 750', molten:'#F0CE63', grain:'#D9A72E', group:'oros' },
    { key:'rosa',     name:'Oro rosa 18k',     fine:'Au 750 · 18k',  kind:'gold', fraction:0.750, hall:'Au 750', molten:'#F1C6B0', grain:'#E0A487', group:'oros' },
    { key:'blanco',   name:'Oro blanco 18k',   fine:'Au 750 · 18k',  kind:'gold', fraction:0.750, hall:'Au 750', molten:'#E4E7EC', grain:'#CACFD6', group:'oros' },
    { key:'platino',  name:'Platino',          fine:'Pt 950',        kind:'platino', fraction:0.950, hall:'Pt 950', molten:'#E7EFF3', grain:'#C9D6DC', group:'temple' },
    { key:'plata',    name:'Plata ley 925',    fine:'Ag 925',        kind:'plata', fraction:0.925, hall:'Ag 925', molten:'#DEE1E5', grain:'#BFC4CA', group:'temple' },
    { key:'cobre',    name:'Cobre',            fine:'Cu · temple',   kind:'cobre', fraction:0,     hall:'',       molten:'#C56A38', grain:'#B0562C', group:'temple', alloy:true },
  ];
  var BY_KEY = {}; MATERIALS.forEach(function (m) { BY_KEY[m.key] = m; });
  var GROUP_LABEL = { oros: 'Oros finos', temple: 'Metales y temple' };

  /* ── Precio del metal (COP/g, pureza aplicada) · lo sobreescribe
        el precio EN VIVO de /.netlify/functions/metales. ─────────── */
  var PRICE = { oro24k:445391, choco:334044, amarillo:334044, blanco:334044, rosa:334044, platino:168995, plata:6145, cobre:42 };
  var PRICE_LIVE = false;

  /* ── Costo y ganancia de la casa (por gramo) ──────────────────
     El precio de cada gramo se arma en tres capas:

         precio/g = (metal + hechura) × (1 + margen)

     · metal   → precio internacional en vivo (goldapi), ya con la ley
     · hechura → lo que cobra el joyero: 75.000 COP por gramo, IGUAL
                para cualquier metal y cualquier elaboración
     · margen  → la ganancia de la casa, en % sobre el costo

     Por qué la hechura va aparte y no dentro del %: son 75.000 fijos,
     que sobre el oro son el 22% del metal pero sobre la plata son el
     1.220%. Meterlos en un solo porcentaje hacía que la plata se
     vendiera POR DEBAJO del costo.

     Margen por metal (clave = key del material, si no, su kind):
       · oro 18k   POR TRAMOS → ver GOLD_TIERS
       · oro 24k   35%  →  (445.391 + 75.000) × 1.35 =  702.528/g
                          menos %: es producto de ahorro y compite
                          contra comprar lingote
       · platino   70%  →  (168.995 + 75.000) × 1.70 =  414.792/g
       · plata     80%  →  (  6.145 + 75.000) × 1.80 =  146.061/g
       · cobre     60%  →  solo aparece como aleación dentro de una
                          pieza de oro                              */
  var HECHURA_G = 75000;
  var MARGIN_PCT = {
    oro24k:  0.35,   // por KEY · gana al kind
    platino: 0.70,
    plata:   0.80,
    cobre:   0.60,
  };

  /* ── Oro 18k · TRAMOS PROGRESIVOS ───────────────────────────
     Cuanto más oro funde el cliente, menor el margen sobre los gramos
     siguientes — el promedio por gramo baja y premia el volumen.

     CLAVE: los tramos son PROGRESIVOS, no escalones. Cada gramo paga
     SU tramo, como los impuestos. Con escalones duros (todo el peso
     a una sola tarifa según el total) pasaba esto:
         14,9 g al 65% = 10.056.351
         15,0 g al 60% =  9.817.056   ← MÁS oro por MENOS plata
     Un cliente que lo note compra de más para pagar menos. Con tramos
     progresivos el total siempre sube al subir los gramos.           */
  var GOLD_TIERS = [
    { hasta: 15,       pct: 0.65 },   // primeros 15 g   → 674.923/g
    { hasta: 30,       pct: 0.60 },   // de 15 a 30 g    → 654.470/g
    { hasta: Infinity, pct: 0.55 },   // de 30 g en adelante → 634.018/g
  ];
  function is18k(m) { return m.kind === 'gold' && m.key !== 'oro24k'; }
  function costG(key) { return (PRICE[key] || 0) + HECHURA_G; }
  function flatPct(m) {
    return MARGIN_PCT[m.key] != null ? MARGIN_PCT[m.key] : (MARGIN_PCT[m.kind] || 0);
  }

  /* ── EL MARGEN SE COBRA POR LO QUE SALE, NO POR EL TARRO ──────
     Antes cada material traía su propio margen y se sumaban los
     parciales. Eso hacía que la MISMA pieza costara dos precios
     según cómo se hubiera vertido:

        21 g de oro fino + 7 g de cobre  → 28 g en 18k = 15.592.555
        28 g de oro de Chocó             → 28 g en 18k = 18.631.954

     Idéntico resultado — 28 g con 21 g de oro fino dentro — y tres
     millones de diferencia, porque el oro 24k pagaba 35% y el de
     Chocó 65%. Un cliente que lo notara vertía siempre por la ruta
     barata.

     Ahora el margen lo fija la ALEACIÓN QUE SALE del crisol y su
     peso: el costo del metal ya es correcto por gramo (el precio de
     cada tarro trae su ley aplicada, así que 21 g de fino y 28 g de
     Chocó cuestan lo mismo en metal), y sobre ese costo total se
     aplica UN solo margen. Las dos rutas ahora dan el mismo número.

         precio  = (metal + hechura × gramos) × (1 + margen)
         por g   = precio / gramos                              */

  /* Margen medio ponderado de `g` gramos por los tramos progresivos.
     Cada gramo aporta el % de SU tramo, como los impuestos. */
  function tierMargin(g) {
    if (!(g > 0)) return GOLD_TIERS[0].pct;
    var rest = g, prev = 0, acc = 0;
    for (var i = 0; i < GOLD_TIERS.length && rest > 0; i++) {
      var take = Math.min(rest, GOLD_TIERS[i].hasta - prev);
      if (take > 0) { acc += take * GOLD_TIERS[i].pct; rest -= take; }
      prev = GOLD_TIERS[i].hasta;
    }
    return acc / g;
  }

  /* Margen que le corresponde al resultado del ensayo. */
  function marginFor(a, esOro, es24k) {
    if (!a.t) return 0;
    if (esOro) return es24k ? MARGIN_PCT.oro24k : tierMargin(a.t);
    var dom = dominant();
    return dom ? flatPct(dom) : 0;
  }

  /* Las tres capas del precio, ya divididas por gramo. */
  function priceOf(a, esOro, es24k) {
    var hechura = HECHURA_G * a.t;
    var cost = a.metal + hechura;
    var mpct = marginFor(a, esOro, es24k);
    var margin = cost * mpct;
    var value = cost + margin;
    return {
      value: value, cost: cost, hechura: hechura, margin: margin, mpct: mpct,
      perG:        a.t ? value / a.t   : 0,
      metalPerG:   a.t ? a.metal / a.t : 0,
      hechuraPerG: HECHURA_G,
      marginPerG:  a.t ? margin / a.t  : 0
    };
  }

  /* ── Recetas: 4 lecciones de mezcla + 2 piezas reales ──────────── */
  var RECETAS = [
    { ref:'AU-24K',     name:'Oro fino · 24k puro',    comp:{ oro24k:28 } },
    { ref:'AU-18K-R',   name:'Oro rosa · 18k',         comp:{ oro24k:21, cobre:7 } },
    { ref:'AU-14K',     name:'Oro · 14k',              comp:{ oro24k:15, cobre:6, plata:3 } },
    { ref:'AU-10K',     name:'Oro · 10k',              comp:{ oro24k:10, cobre:13 } },
    { ref:'PRT-CH-CUB', name:'Cadena Cubana Preto',    comp:{ choco:34 } },
    { ref:'ACC-IN-CLA', name:'Insignia Noir · platino',comp:{ platino:12, choco:3 } },
  ];

  /* ── Productos: en qué convertir el oro fundido ─────────────────
     El cliente no compra "precio": elige en qué pieza (o combo) quiere
     convertir su oro. Cada pieza tiene NIVELES por gramos: según cuánto
     oro fundió, se sugiere el estilo que alcanza (p. ej. 8 g → pulso
     tipo lazo). Las piezas que necesitan más gramos quedan bloqueadas. */
  var PRODUCTS = [
    { key:'aretes',    name:'Aretes',          tiers:[ {g:3,l:'topos'}, {g:6,l:'argollas'}, {g:12,l:'candongas'} ] },
    { key:'dije',      name:'Dije · Insignia', tiers:[ {g:3,l:'amuleto pequeño'}, {g:6,l:'cruz o sello'}, {g:12,l:'insignia grande'} ] },
    { key:'bebe',      name:'Regalo de bebé',  tiers:[ {g:3,l:'amuleto de protección'}, {g:6,l:'pulsera de bebé'}, {g:10,l:'set completo'} ] },
    { key:'anillo',    name:'Anillo',          tiers:[ {g:4,l:'liso delgado'}, {g:8,l:'cubano'}, {g:15,l:'de sello'} ] },
    { key:'manilla',   name:'Manilla',         tiers:[ {g:8,l:'pulso tipo lazo'}, {g:14,l:'de eslabón'}, {g:25,l:'cubana rústica'} ] },
    { key:'gemelos',   name:'Gemelos',         tiers:[ {g:8,l:'lisos'}, {g:14,l:'Colección Noir'} ] },
    { key:'cadena',    name:'Cadena',          tiers:[ {g:14,l:'lazo o franco fina'}, {g:24,l:'cubana ligera'}, {g:40,l:'cubana clásica'}, {g:70,l:'cubana gruesa'} ] },
    { key:'rosario',   name:'Rosario',         tiers:[ {g:20,l:'decenario'}, {g:38,l:'de cuello'} ] },
    { key:'boligrafo', name:'Bolígrafo',       tiers:[ {g:20,l:'clásico'}, {g:34,l:'lacado o grabado'} ] },
  ];
  PRODUCTS.forEach(function (p) { p.from = p.tiers[0].g; });
  // estilo que alcanza con g gramos (nivel más alto <= g); null si no alcanza
  function tierFor(p, g) { var best = null; p.tiers.forEach(function (t) { if (g >= t.g) best = t; }); return best; }
  var chosen = {};   // key de producto -> seleccionado

  /* ── Estado ─────────────────────────────────────────────────────── */
  var state = {}; MATERIALS.forEach(function (m) { state[m.key] = 0; });
  (function restore() {
    try {
      var s = JSON.parse(localStorage.getItem(LS_KEY) || 'null');
      if (s) MATERIALS.forEach(function (m) { if (typeof s[m.key] === 'number') state[m.key] = clampG(s[m.key]); });
    } catch (e) {}
  })();
  function save() { try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch (e) {} }

  /* ── Helpers ────────────────────────────────────────────────────── */
  function total() { var t = 0; for (var k in state) t += state[k]; return t; }
  function clampG(n) { n = Math.round(Number(n) || 0); return n < 0 ? 0 : (n > MAX_G ? MAX_G : n); }
  function fmtCOP(n) { try { return '$' + Math.round(n).toLocaleString('es-CO'); } catch (e) { return '$' + Math.round(n); } }
  function fmtG(n) { return (Math.round(n * 10) / 10).toString().replace('.', ','); }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function hex2rgb(h) { h = h.replace('#', ''); return [parseInt(h.substr(0,2),16), parseInt(h.substr(2,2),16), parseInt(h.substr(4,2),16)]; }
  function rgb2hex(r) { return '#' + r.map(function (v) { v = Math.max(0, Math.min(255, Math.round(v))); return (v < 16 ? '0' : '') + v.toString(16); }).join(''); }
  function meltColor() {
    var t = total(); if (!t) return '#C4901F';
    var acc = [0,0,0];
    MATERIALS.forEach(function (m) {
      if (!state[m.key]) return;
      var c = hex2rgb(m.molten), w = state[m.key] / t;
      acc[0] += c[0]*w; acc[1] += c[1]*w; acc[2] += c[2]*w;
    });
    return rgb2hex(acc);
  }
  function dominant() { var best=null, mx=-1; MATERIALS.forEach(function(m){ if(state[m.key]>mx){mx=state[m.key];best=m;} }); return best; }
  function lighten(hex, amt) { var c=hex2rgb(hex); return rgb2hex(c.map(function(v){return v+(255-v)*amt;})); }
  function darken(hex, amt) { var c=hex2rgb(hex); return rgb2hex(c.map(function(v){return v*(1-amt);})); }

  /* ── Ensayo base ────────────────────────────────────────────────── */
  /* Pesa y valora el metal. El costo del metal por gramo YA trae la
     ley de cada tarro aplicada (PRICE.choco = spot 24k × 0,750), así
     que sumar gramo por tarro da el costo correcto del oro fino que
     hay dentro, sin importar por qué ruta se compuso la aleación. */
  function assay() {
    var t = 0, goldG = 0, fineGold = 0, fineMetal = 0, metal = 0;
    MATERIALS.forEach(function (m) {
      var g = state[m.key]; if (!g) return;
      t += g;
      metal += g * (PRICE[m.key] || 0);
      fineMetal += g * m.fraction;
      if (m.kind === 'gold') { fineGold += g * m.fraction; goldG += g; }
    });
    return { t:t, goldG:goldG, fineGold:fineGold, fineMetal:fineMetal, metal:metal };
  }

  /* Quilataje estándar (se sella la ley garantizada, redondeo hacia
     abajo, como en el taller). */
  function goldStamp(ley) {
    if (ley >= 999) return { k:24, f:999, label:'24k' };
    if (ley >= 916) return { k:22, f:916, label:'22k' };
    if (ley >= 750) return { k:18, f:750, label:'18k' };
    if (ley >= 585) return { k:14, f:585, label:'14k' };
    if (ley >= 417) return { k:10, f:417, label:'10k' };
    if (ley >= 375) return { k:9,  f:375, label:'9k' };
    return { k:0, f:Math.round(ley), label:'< 9k' };
  }
  function classifyTone(hex) {
    var c = hex2rgb(hex), mx = Math.max(c[0],c[1],c[2]), mn = Math.min(c[0],c[1],c[2]);
    var sat = mx ? (mx - mn) / mx : 0;
    if (sat < 0.13) return 'blanco';
    var gr = c[1] / (c[0] || 1);
    if (gr < 0.74) return 'rojo';
    if (gr < 0.83) return 'rosa';
    return 'amarillo';
  }

  /* Clasificación completa de la aleación. */
  function classify() {
    var a = assay(), t = a.t;
    if (t === 0) return { t:0, value:0, halls:[], price:{ value:0, perG:0, metalPerG:0, hechuraPerG:HECHURA_G, marginPerG:0, mpct:0 } };
    var leyGold = Math.min(999, Math.round((a.fineGold / t) * 1000));
    // Es "oro" si su ley alcanza el mínimo legal (9k · 375 ‰), o si no
    // hay otro metal blanco que lo domine (oro de baja ley "puro").
    var goldLegit = a.fineGold > 0 && (leyGold >= 375 || (!state.platino && !state.plata));
    if (goldLegit) {
      var st = goldStamp(leyGold);
      var tone = classifyTone(meltColor());
      var title = (st.k >= 24) ? 'Oro fino · 24k' : ('Oro ' + tone + ' · ' + st.label);
      var halls = ['Au ' + st.f];
      if (state.platino) halls.push('Pt 950');
      if (state.plata)   halls.push('Ag 925');
      var pr = priceOf(a, true, st.k >= 24);
      return { t:t, kind:'oro', title:title, stamp:st, tone:tone, ley:leyGold,
               karatExact: leyGold/1000*24, fineGold:a.fineGold, fineMetal:a.fineMetal,
               value:pr.value, price:pr, halls:halls };
    }
    // Metal blanco / aleación: se nombra por el metal precioso dominante.
    var dom = dominant(), title2;
    if (dom && dom.kind === 'platino') title2 = 'Platino · 950';
    else if (dom && dom.kind === 'plata') title2 = 'Plata · 925';
    else if (dom && dom.kind === 'cobre') title2 = 'Cobre · temple';
    else title2 = 'Aleación de metales';
    var halls2 = [];
    if (state.platino) halls2.push('Pt 950');
    if (state.plata)   halls2.push('Ag 925');
    if (a.fineGold > 0 && leyGold >= 375) halls2.push('Au ' + goldStamp(leyGold).f);
    var pr2 = priceOf(a, false, false);
    return { t:t, kind:'otro', title:title2, stamp:null, tone:null,
             ley: Math.round((a.fineMetal / t) * 1000), fineGold:a.fineGold, fineMetal:a.fineMetal,
             value:pr2.value, price:pr2, halls:halls2 };
  }

  function compSummary() {
    var t = total(), parts = [];
    MATERIALS.forEach(function (m) { if (state[m.key]) parts.push(m.name + ' ' + Math.round((state[m.key]/t)*100) + '%'); });
    return parts.join(' · ');
  }

  /* ── DOM ────────────────────────────────────────────────────────── */
  var $ = function (id) { return document.getElementById(id); };
  var crucible = $('fndCrucible'), fillEl = $('fndFill'), grainsEl = $('fndGrains');
  var weightEl = $('fndWeight'), weightMaxTxt = $('fndWeightMaxTxt');
  var needleEl = $('fndNeedle'), cruWrap = document.querySelector('.fnd-crucible-wrap');
  var meltValueEl = $('fndMeltValue'), smeltBtn = $('fndSmelt'), clearBtn = $('fndClear');
  var compEl = $('fndComp');
  var verdictEl = $('fndVerdict'), verdictTitle = $('fndVerdictTitle'), verdictKarat = $('fndVerdictKarat');
  var karatEl = $('fndKarat'), fineEl = $('fndFine'), leyEl = $('fndLey'), hallmarksEl = $('fndHallmarks');
  var valueEl = $('fndValue'), valueNote = $('fndValueNote'), spotSrc = $('fndSpotSrc');

  /* ── Tarros ─────────────────────────────────────────────────────── */
  (function buildVessels() {
    var wrap = $('fndVessels'); if (!wrap) return;
    function surface(x) { return 44 + 0.0055 * (x - 64) * (x - 64); }
    function wallHalf(y) { return 34 - (y - 44) * 0.085; }
    function grainTone(base) {
      var amt = Math.random() * 0.52 - 0.24;
      return amt >= 0 ? lighten(base, amt) : darken(base, -amt);
    }
    function jarGrain(m) {
      var c = '', base = m.grain, dk = darken(base, 0.42);
      function put(x, y, r) {
        if (Math.random() < 0.5) c += '<circle cx="' + x.toFixed(1) + '" cy="' + (y + r * 0.5).toFixed(1) + '" r="' + (r * 0.72).toFixed(1) + '" fill="' + dk + '" opacity="0.3"/>';
        c += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + r.toFixed(1) + '" fill="' + grainTone(base) + '"/>';
        if (Math.random() < 0.22) c += '<circle cx="' + (x - r * 0.32).toFixed(1) + '" cy="' + (y - r * 0.34).toFixed(1) + '" r="' + (r * 0.26 + 0.5).toFixed(1) + '" fill="#fff" opacity="0.9"/>';
      }
      for (var gy = 43; gy <= 96; gy += 5.6) {
        for (var gx = 30; gx <= 98; gx += 5.6) {
          var jx = gx + (Math.random() - 0.5) * 5.4, jy = gy + (Math.random() - 0.5) * 5.4;
          if (jy < surface(jx) - 1.5) continue;
          if (Math.abs(jx - 64) > wallHalf(jy)) continue;
          put(jx, jy, 2.3 + Math.random() * 2.3);
        }
      }
      for (var i = 0; i < 9; i++) {
        var cx2 = 40 + Math.random() * 48, cy2 = surface(cx2) + 2 + Math.random() * 46;
        if (Math.abs(cx2 - 64) > wallHalf(cy2)) continue;
        put(cx2, cy2, 4.4 + Math.random() * 1.8);
      }
      return c;
    }
    var lastGroup = null;
    MATERIALS.forEach(function (m) {
      if (m.group !== lastGroup) {
        lastGroup = m.group;
        var role = document.createElement('span');
        role.className = 'fnd-vessel-role';
        role.textContent = GROUP_LABEL[m.group] || '';
        wrap.appendChild(role);
      }
      var b = document.createElement('button');
      b.className = 'fnd-vessel' + (m.base ? ' is-base' : '') + (m.alloy ? ' is-alloy' : '');
      b.type = 'button'; b.setAttribute('data-key', m.key);
      b.setAttribute('aria-label', 'Verter ' + m.name + ' — mantener pulsado para verter, tocar para una pizca');
      b.style.setProperty('--m', m.grain);
      b.innerHTML =
        '<div class="fnd-vessel-jar">' +
          '<svg class="fnd-jar-svg" viewBox="0 0 128 120" aria-hidden="true">' +
            '<ellipse class="jar-shadow" cx="64" cy="111" rx="40" ry="7"/>' +
            '<g class="jar-rot">' +
              '<ellipse class="jar-mouth-back" cx="64" cy="33" rx="34" ry="9.4"/>' +
              '<g clip-path="url(#jarInterior)">' +
                '<path class="jar-inside" d="M 30 40 C 24 56 24 78 31 92 Q 35 101 46 101 L 82 101 Q 93 101 97 92 C 104 78 104 56 98 40 Z"/>' +
                '<g class="jar-grain">' + jarGrain(m) + '</g>' +
                '<ellipse class="jar-heapsheen" cx="57" cy="46" rx="25" ry="6.5"/>' +
              '</g>' +
              '<path class="jar-glass" d="M 26 36 C 19 54 19 78 27 94 Q 31 106 45 106 L 83 106 Q 97 106 101 94 C 109 78 109 54 102 36 Z"/>' +
              '<path class="jar-sheen" d="M 37 45 C 31 60 31 80 38 95"/>' +
              '<ellipse class="jar-lip" cx="64" cy="32" rx="40" ry="12"/>' +
              '<ellipse class="jar-lip-in" cx="64" cy="33.5" rx="33" ry="9"/>' +
            '</g>' +
          '</svg>' +
          (m.base ? '<span class="fnd-vessel-base">Base</span>' : '') +
          '<span class="fnd-vessel-seal" data-g>0 g</span>' +
        '</div>' +
        '<div class="fnd-vessel-body">' +
          '<span class="fnd-vessel-name">' + m.name + '</span>' +
          '<span class="fnd-vessel-plate">' + m.fine + '</span>' +
        '</div>';
      wrap.appendChild(b);
      wireVessel(b, m);
    });
  })();

  /* ── Recetas ────────────────────────────────────────────────────── */
  (function buildRecetas() {
    var rail = $('fndRecetas'); if (!rail) return;
    RECETAS.forEach(function (r) {
      var t = 0, keys = Object.keys(r.comp); keys.forEach(function (k) { t += r.comp[k]; });
      var swatch = keys.map(function (k) { return '<i style="width:' + Math.round((r.comp[k]/t)*100) + '%;background:' + BY_KEY[k].grain + '"></i>'; }).join('');
      var mats = keys.map(function (k) { return BY_KEY[k].name; }).join(' · ');
      var card = document.createElement('button');
      card.className = 'fnd-receta'; card.type = 'button'; card.setAttribute('data-ref', r.ref);
      card.innerHTML =
        '<span class="fnd-receta-ref">Ref. ' + r.ref + '</span>' +
        '<span class="fnd-receta-name">' + r.name + '</span>' +
        '<span class="fnd-receta-swatch">' + swatch + '</span>' +
        '<span class="fnd-receta-meta">' + t + ' g · ' + mats + '</span>' +
        '<span class="fnd-receta-load">Cargar receta <span class="a">→</span></span>';
      card.addEventListener('click', function () { loadReceta(r); });
      rail.appendChild(card);
    });
  })();

  /* ── Conversión: grid de productos en el resultado ──────────────── */
  (function buildConversion() {
    var grid = $('fndConvGrid'); if (!grid) return;
    grid.innerHTML = PRODUCTS.map(function (p) {
      return '<button class="fnd-conv" type="button" data-p="' + p.key + '" aria-pressed="false">' +
               '<span class="fnd-conv-name">' + p.name + '</span>' +
               '<span class="fnd-conv-note"></span>' +
               '<span class="fnd-conv-from"></span>' +
               '<span class="fnd-conv-check" aria-hidden="true"></span>' +
             '</button>';
    }).join('');
    grid.querySelectorAll('.fnd-conv').forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.classList.contains('is-locked')) return;   // no alcanza con los gramos
        var k = b.getAttribute('data-p'); chosen[k] = !chosen[k];
        b.classList.toggle('is-on', chosen[k]);
        b.setAttribute('aria-pressed', chosen[k] ? 'true' : 'false');
        updateConvSummary();
      });
    });
  })();

  /* Adapta cada tarjeta al peso fundido: sugiere el estilo que alcanza
     y bloquea las piezas que necesitan más gramos. */
  function updateConvAvail(g) {
    var grid = $('fndConvGrid'); if (!grid) return;
    grid.querySelectorAll('.fnd-conv').forEach(function (b) {
      var p = PRODUCTS.filter(function (x) { return x.key === b.getAttribute('data-p'); })[0]; if (!p) return;
      var tier = tierFor(p, g);
      var noteEl = b.querySelector('.fnd-conv-note'), fromEl = b.querySelector('.fnd-conv-from');
      if (tier) {
        b.classList.remove('is-locked'); b.removeAttribute('aria-disabled');
        noteEl.textContent = tier.l;                     // estilo sugerido para esos gramos
        fromEl.textContent = 'te alcanza · ' + g + ' g';
      } else {
        b.classList.add('is-locked'); b.setAttribute('aria-disabled', 'true');
        if (chosen[p.key]) { chosen[p.key] = false; b.classList.remove('is-on'); b.setAttribute('aria-pressed', 'false'); }
        noteEl.textContent = p.tiers[0].l;
        fromEl.textContent = 'faltan ' + (p.from - g) + ' g';
      }
    });
    updateConvSummary(g);
  }

  function chosenNames() { return PRODUCTS.filter(function (p) { return chosen[p.key]; }).map(function (p) { return p.name; }); }
  function chosenLabels(g) {
    return PRODUCTS.filter(function (p) { return chosen[p.key]; }).map(function (p) {
      var tier = tierFor(p, typeof g === 'number' ? g : total());
      return p.name + (tier ? ' (' + tier.l + ')' : '');
    });
  }
  function updateConvSummary(g) {
    var el = $('fndConvSummary'); if (!el) return;
    if (typeof g !== 'number') g = total();
    var names = chosenNames();
    if (!names.length) {
      el.className = 'fnd-conv-summary';
      el.innerHTML = 'Con tus <b>' + g + ' g</b> puedes crear estas piezas — elige una o combina varias.';
    } else {
      el.className = 'fnd-conv-summary is-on';
      el.innerHTML = 'Con tus ' + g + ' g convertirás tu oro en <b>' + chosenLabels(g).join(' + ') + '</b>.';
    }
  }

  function loadReceta(r) {
    MATERIALS.forEach(function (m) { state[m.key] = 0; });
    Object.keys(r.comp).forEach(function (k) { state[k] = clampG(r.comp[k]); });
    render(true); save();
    var dom = dominant(); if (dom && !reduceMotion) spawnGrains(dom, 16);
    var scale = document.querySelector('.fnd-col-scale');
    if (scale) window.scrollTo({ top: scale.getBoundingClientRect().top + window.pageYOffset - 90, behavior: 'smooth' });
  }

  /* ── Verter (mantener) / pizca (tocar) ─────────────────────────── */
  function wireVessel(el, m) {
    var holdTimer = null, pourTimer = null, ticks = 0, started = false;
    function startPour() {
      started = true; el.classList.add('pouring'); ticks = 0;
      spawnJarBits(el, m, 3, 'slide');
      pourTimer = setInterval(function () {
        var step = ticks < 3 ? 1 : ticks < 6 ? 2 : ticks < 10 ? 3 : 4;
        if (ticks % 4 === 0) spawnJarBits(el, m, 1, 'slide');
        ticks++;
        if (!addGrams(m, step)) stopPour();
      }, TICK_MS);
    }
    function stopPour() { el.classList.remove('pouring'); if (pourTimer) { clearInterval(pourTimer); pourTimer = null; } }
    function down(e) {
      if (e.button != null && e.button !== 0) return;
      e.preventDefault();
      if (el.getAttribute('aria-disabled') === 'true') return;
      started = false;
      try { el.setPointerCapture(e.pointerId); } catch (err) {}
      holdTimer = setTimeout(function () { holdTimer = null; startPour(); }, HOLD_MS);
    }
    function up() { if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; if (!started) { addGrams(m, PINCH_G); spawnJarBits(el, m, 2, 'drop'); } } stopPour(); }
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('pointerleave', function () { if (started) up(); });
    el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); addGrams(m, PINCH_G); } });
  }

  function addGrams(m, amount) {
    var remaining = MAX_G - total();
    if (remaining <= 0) { flashFull(); return false; }
    var amt = Math.min(amount, remaining);
    state[m.key] += amt; render(); spawnGrains(m, amt >= 3 ? 10 : 6); save();
    if (total() >= MAX_G) { flashFull(); return false; }
    return true;
  }
  function flashFull() {
    weightMaxTxt.textContent = 'Crisol al tope · ' + MAX_G + ' g';
    if (crucible) { crucible.classList.add('is-full'); setTimeout(function () { crucible.classList.remove('is-full'); }, 500); }
  }

  /* ── Granos transitorios del frasco (verter / pizca) ────────────── */
  function spawnJarBits(el, m, n, mode) {
    if (reduceMotion) return;
    var jar = el.querySelector('.fnd-vessel-jar'); if (!jar) return;
    for (var i = 0; i < n; i++) {
      var s = document.createElement('span');
      s.className = 'fnd-jar-bit ' + (mode === 'slide' ? 'is-slide' : 'is-drop');
      var sz = 4 + Math.random() * 3;
      s.style.width = sz.toFixed(1) + 'px'; s.style.height = sz.toFixed(1) + 'px';
      s.style.setProperty('--g', m.grain);
      s.style.left = (mode === 'slide' ? (26 + Math.random() * 26) : (42 + Math.random() * 16)) + '%';
      s.style.top = (26 + Math.random() * 10) + '%';
      s.style.setProperty('--dx', ((mode === 'slide' ? -1 : (Math.random() * 2 - 1)) * (6 + Math.random() * 10)).toFixed(0) + 'px');
      s.style.setProperty('--dy', (mode === 'slide' ? (8 + Math.random() * 8) : (32 + Math.random() * 18)).toFixed(0) + 'px');
      s.style.setProperty('--rot', (Math.random() * 240 - 120).toFixed(0) + 'deg');
      s.style.animationDelay = (Math.random() * 90).toFixed(0) + 'ms';
      jar.appendChild(s);
      s.addEventListener('animationend', function () { this.remove(); });
    }
  }

  function spawnGrains(m, count) {
    if (reduceMotion || !grainsEl) return;
    var inner = crucible.querySelector('.fnd-crucible-inner');
    var h = inner ? inner.clientHeight : 210;
    var drop = Math.max(24, h * (1 - Math.min(total()/MAX_G, 0.96)) - 6);
    for (var i = 0; i < count; i++) {
      var bit = document.createElement('span');
      bit.className = 'fnd-grain-bit';
      var sz = 3 + Math.random() * 4;                 // 3–7px, granalla menuda
      bit.style.left = (16 + Math.random() * 68) + '%';
      bit.style.setProperty('--g', m.grain);
      bit.style.setProperty('--sz', sz.toFixed(1) + 'px');
      // 40% pepitas irregulares (no círculo perfecto) para que no parezca gota
      bit.style.setProperty('--rad', Math.random() < 0.4 ? (32 + Math.random() * 22).toFixed(0) + '%' : '50%');
      bit.style.setProperty('--drop', (drop + (Math.random() * 12 - 6)).toFixed(0) + 'px');
      bit.style.setProperty('--dx', ((Math.random() * 2 - 1) * 12).toFixed(0) + 'px');   // dispersión lateral
      bit.style.setProperty('--rot', (Math.random() * 360 - 180).toFixed(0) + 'deg');    // giro al caer
      bit.style.animation = 'fnd-grain-fall ' + (520 + Math.random() * 380) + 'ms cubic-bezier(.34,.62,.4,1) forwards';
      bit.style.animationDelay = (Math.random() * 220) + 'ms';                            // lluvia escalonada
      grainsEl.appendChild(bit);
      bit.addEventListener('animationend', function () { this.remove(); });
    }
  }

  /* ── Render ─────────────────────────────────────────────────────── */
  /* ── Balanza de aguja: ticks y rótulos del dial ────────────── */
  (function buildGauge() {
    var g = $('fndGaugeTicks'); if (!g) return;
    var cx = 120, cy = 128;
    function pt(r, gv) { var th = Math.PI - (gv / MAX_G) * Math.PI; return [cx + r * Math.cos(th), cy - r * Math.sin(th)]; }
    var out = '';
    for (var gv = 0; gv <= MAX_G; gv += 5) {
      var major = gv % 25 === 0, a = pt(major ? 88 : 93, gv), b = pt(100, gv);
      out += '<line class="' + (major ? 'gz-tick-M' : 'gz-tick') + '" x1="' + a[0].toFixed(1) + '" y1="' + a[1].toFixed(1) + '" x2="' + b[0].toFixed(1) + '" y2="' + b[1].toFixed(1) + '"/>';
    }
    [0, 50, 100, 150].forEach(function (gv) { var p = pt(74, gv); out += '<text class="gz-lab" text-anchor="middle" x="' + p[0].toFixed(1) + '" y="' + (p[1] + 4).toFixed(1) + '">' + gv + '</text>'; });
    var w1 = pt(84, 140), w2 = pt(84, 150);
    out += '<path class="gz-warn" d="M ' + w1[0].toFixed(1) + ' ' + w1[1].toFixed(1) + ' A 84 84 0 0 1 ' + w2[0].toFixed(1) + ' ' + w2[1].toFixed(1) + '"/>';
    g.innerHTML = out;
  })();

  function render() {
    var v = classify(), t = v.t;

    crucible.setAttribute('data-empty', t > 0 ? 'false' : 'true');
    fillEl.style.height = Math.min((t / MAX_G) * 96, 96) + '%';
    var mcNow = meltColor();
    crucible.style.setProperty('--melt', mcNow);
    if (cruWrap) { cruWrap.style.setProperty('--melt', mcNow); cruWrap.style.setProperty('--heat', Math.min(t / MAX_G, 1).toFixed(3)); }
    weightEl.textContent = Math.round(t);
    if (needleEl) needleEl.style.transform = 'rotate(' + (Math.min(t / MAX_G, 1) * 180).toFixed(2) + 'deg)';
    if (t < MAX_G) weightMaxTxt.textContent = Math.round(t) + ' g · tope ' + MAX_G + ' g';
    meltValueEl.textContent = fmtCOP(v.value);
    /* El número que el cliente compara con su joyero: COP por gramo. */
    var mg = $('fndMeltG');
    if (mg) mg.textContent = v.t ? fmtCOP(v.price.perG) : '$0';

    // composición
    var rows = '';
    MATERIALS.forEach(function (m) {
      var g = state[m.key]; if (!g) return;
      var pct = t ? Math.round((g / t) * 100) : 0;
      rows +=
        '<div class="fnd-comp-row" style="--m:' + m.grain + '">' +
          '<div class="fnd-comp-top">' +
            '<span class="fnd-comp-name"><span class="fnd-comp-dot"></span>' + m.name + '</span>' +
            '<span class="fnd-comp-g"><b>' + Math.round(g) + ' g</b> · ' + pct + '%</span>' +
          '</div>' +
          '<div class="fnd-comp-bar"><span style="width:' + pct + '%"></span></div>' +
        '</div>';
    });
    compEl.innerHTML = rows || '<div class="fnd-comp-empty">Aún no ha vertido ningún metal.</div>';

    // veredicto
    if (!t) {
      verdictEl.hidden = true; karatEl.textContent = '—'; leyEl.textContent = '—'; fineEl.textContent = '—'; hallmarksEl.hidden = true;
    } else {
      verdictEl.hidden = false;
      verdictTitle.textContent = v.title;
      if (v.kind === 'oro') {
        verdictKarat.textContent = v.stamp.k + ' quilates · ' + v.ley + ' ‰';
        karatEl.textContent = v.stamp.label + (v.stamp.k >= 24 ? '' : ' · sello');
      } else {
        verdictKarat.textContent = v.halls.length ? v.halls.join(' · ') : 'sin metal precioso';
        karatEl.textContent = '—';
      }
      leyEl.textContent = v.ley ? v.ley + ' ‰' : '—';
      fineEl.textContent = fmtG(v.fineMetal) + ' g';
      if (v.halls.length) { hallmarksEl.hidden = false; hallmarksEl.innerHTML = v.halls.map(function (h) { return '<span class="fnd-hallmark">' + h + '</span>'; }).join(''); }
      else hallmarksEl.hidden = true;
    }
    valueEl.textContent = fmtCOP(v.value) + ' COP';
    var pg = $('fndPerG'), pgm = $('fndPerGMetal'), pgh = $('fndPerGHechura'), pgg = $('fndPerGMargen'), pgp = $('fndPerGPct');
    if (pg)  pg.textContent  = v.t ? fmtCOP(v.price.perG) : '—';
    if (pgm) pgm.textContent = v.t ? fmtCOP(v.price.metalPerG) : '—';
    if (pgh) pgh.textContent = v.t ? fmtCOP(v.price.hechuraPerG) : '—';
    if (pgg) pgg.textContent = v.t ? fmtCOP(v.price.marginPerG) : '—';
    if (pgp) pgp.textContent = v.t ? (Math.round(v.price.mpct * 100) + '%') : '—';

    // tarros
    MATERIALS.forEach(function (m) {
      var el = document.querySelector('.fnd-vessel[data-key="' + m.key + '"]'); if (!el) return;
      var g = state[m.key];
      el.classList.toggle('has-g', g > 0);
      var tag = el.querySelector('[data-g]'); if (tag) tag.textContent = Math.round(g) + ' g';
      el.setAttribute('aria-disabled', (t >= MAX_G && g === 0) ? 'true' : 'false');
    });

    smeltBtn.disabled = t <= 0;
  }

  /* ── Fundir → forja → resultado ─────────────────────────────────── */
  var resultEl = $('fndResult');
  var forgeEl = $('fndForge'), forgeCap = $('fndForgeCap'), forgeEmbers = $('fndForgeEmbers');
  var forgeTimers = [];
  function clearForgeTimers() { forgeTimers.forEach(clearTimeout); forgeTimers = []; }
  function playForge(done) {
    if (!forgeEl) { setTimeout(done, 60); return; }
    clearForgeTimers();
    forgeEl.style.setProperty('--melt', meltColor());
    if (forgeEmbers && !forgeEmbers.childElementCount) {
      for (var i = 0; i < 16; i++) {
        var e = document.createElement('span');
        e.className = 'fnd-ember';
        e.style.left = (8 + Math.random() * 84) + '%';
        e.style.setProperty('--d', (1.5 + Math.random() * 1.5).toFixed(2) + 's');
        e.style.setProperty('--x', ((Math.random() * 2 - 1) * 34).toFixed(0) + 'px');
        e.style.animationDelay = (Math.random() * 1.8).toFixed(2) + 's';
        forgeEmbers.appendChild(e);
      }
    }
    forgeEl.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    void forgeEl.offsetWidth;                 // reinicia las animaciones
    forgeEl.setAttribute('data-play', 'true');
    var caps = [[0, 'Encendiendo el horno…'], [640, 'Vertiendo el oro fundido…'], [1560, 'Colando el lingote…'], [2160, 'Enfriando la pieza…']];
    caps.forEach(function (c) { forgeTimers.push(setTimeout(function () { if (forgeCap) forgeCap.textContent = c[1]; }, c[0])); });
    forgeTimers.push(setTimeout(function () {
      forgeEl.setAttribute('data-play', 'false');
      forgeEl.setAttribute('aria-hidden', 'true');
      done();
    }, 2820));
  }
  function smelt() {
    if (!total()) return;
    crucible.setAttribute('data-molten', 'true'); smeltBtn.classList.add('firing');
    if (reduceMotion) { setTimeout(openResult, 60); return; }
    playForge(openResult);
  }
  function openResult() {
    var v = classify(), mc = meltColor();
    var ingot = $('fndIngot');
    ingot.style.setProperty('--ingot', 'linear-gradient(135deg, ' + lighten(mc,0.32) + ' 0%, ' + mc + ' 46%, ' + darken(mc,0.30) + ' 72%, ' + lighten(mc,0.22) + ' 100%)');
    $('fndIngotHall').textContent = v.kind === 'oro' ? v.stamp.label.toUpperCase() : (v.halls[0] || '—');
    $('fndIngotW').textContent = Math.round(v.t) + ' g';

    $('fndResWeight').textContent = Math.round(v.t) + ' g';
    $('fndResComp').textContent = compSummary();
    $('fndResLey').textContent = v.kind === 'oro'
      ? (v.title + ' · ' + v.ley + ' ‰')
      : (v.halls.join(' · ') || '—');
    $('fndResValue').textContent = fmtCOP(v.value) + ' COP';
    var rpg = $('fndResPerG'); if (rpg) rpg.textContent = fmtCOP(v.price.perG) + ' / g';
    $('fndResSrc').textContent = PRICE_LIVE ? '· precio internacional' : '· estimación de referencia';
    var chipF = $('fndChipFolio'); if (chipF) chipF.textContent = folio();

    updateConvAvail(Math.round(v.t));
    resultEl.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeResult() {
    resultEl.setAttribute('aria-hidden', 'true');
    crucible.setAttribute('data-molten', 'false'); smeltBtn.classList.remove('firing');
    if ($('fndCert').getAttribute('aria-hidden') !== 'false') document.body.style.overflow = '';
  }

  /* ── Folio determinista (misma aleación + día = mismo folio) ────── */
  function folio() {
    var basis = MATERIALS.map(function (m) { return m.key + state[m.key]; }).join('');
    var d = new Date(), ymd = ('' + d.getFullYear()).slice(2) + pad2(d.getMonth()+1) + pad2(d.getDate());
    var h = 0; for (var i = 0; i < basis.length; i++) h = (h*31 + basis.charCodeAt(i)) >>> 0;
    return 'DF-' + ymd + '-' + ('000' + (h % 9000 + 1000)).slice(-4);
  }

  /* ── Certificado ────────────────────────────────────────────────── */
  var certEl = $('fndCert');
  function openCert() {
    var v = classify(); if (!v.t) return;
    $('fndCertTitle').textContent = v.title;
    $('fndCertKarat').textContent = v.kind === 'oro' ? (v.stamp.label + ' · ' + v.stamp.k + ' qt') : (v.halls[0] || 'metal');
    var t = v.t, rows = '';
    MATERIALS.forEach(function (m) {
      var g = state[m.key]; if (!g) return;
      rows += '<tr><td class="cm-name"><span class="cm-dot" style="background:' + m.grain + '"></span>' + m.name + '</td>' +
              '<td class="cm-g"><b>' + Math.round(g) + ' g</b> · ' + Math.round((g/t)*100) + '%</td></tr>';
    });
    $('fndCertComp').innerHTML = rows;
    $('fndCertWeight').textContent = Math.round(v.t) + ' g';
    $('fndCertFine').textContent = fmtG(v.fineMetal) + ' g';
    $('fndCertLey').textContent = v.ley ? v.ley + ' ‰' : '—';
    $('fndCertHalls').textContent = v.halls.join(' · ') || '—';
    $('fndCertValue').textContent = fmtCOP(v.value) + ' COP';
    var cpg = $('fndCertPerG'); if (cpg) cpg.textContent = fmtCOP(v.price.perG) + ' / g';
    $('fndCertFolio').textContent = folio();
    try { $('fndCertDate').textContent = new Date().toLocaleDateString('es-CO', { day:'2-digit', month:'long', year:'numeric' }); }
    catch (e) { $('fndCertDate').textContent = new Date().toLocaleDateString(); }
    certEl.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden';
  }
  function closeCert() {
    certEl.setAttribute('aria-hidden', 'true');
    if (resultEl.getAttribute('aria-hidden') !== 'false') document.body.style.overflow = '';
  }

  /* ── WhatsApp ───────────────────────────────────────────────────── */
  function waMessage() {
    var v = classify(), t = v.t, lines = [];
    lines.push('Hola, en La Fundición de Dala Fundição compuse una aleación y quisiera cotizar una pieza a la medida:');
    lines.push('');
    lines.push('Resultado: ' + v.title);
    lines.push('Peso total: ' + Math.round(t) + ' g');
    var prods = chosenLabels(Math.round(t));
    if (prods.length) lines.push('Convertir en: ' + prods.join(' + '));
    lines.push('Composición:');
    MATERIALS.forEach(function (m) { if (state[m.key]) lines.push('  · ' + m.name + ' — ' + Math.round(state[m.key]) + ' g (' + Math.round((state[m.key]/t)*100) + '%)'); });
    lines.push('Metal fino: ' + fmtG(v.fineMetal) + ' g' + (v.ley ? ' · Ley ' + v.ley + ' ‰' : ''));
    if (v.halls.length) lines.push('Sellos: ' + v.halls.join(' · '));
    lines.push('Precio por gramo: ' + fmtCOP(v.price.perG) + ' COP/g');
    lines.push('  · metal ' + fmtCOP(v.price.metalPerG) + '/g (' + (PRICE_LIVE ? 'precio internacional' : 'referencia') + ')');
    lines.push('  · hechura del taller ' + fmtCOP(v.price.hechuraPerG) + '/g');
    lines.push('  · casa ' + fmtCOP(v.price.marginPerG) + '/g (' + Math.round(v.price.mpct * 100) + '%)');
    lines.push('Valor estimado de la pieza: ' + fmtCOP(v.value) + ' COP');
    lines.push('');
    lines.push('Quedo atento a la cotización del diseño y el engaste. Gracias.');
    return lines.join('\n');
  }
  function openWhatsApp() {
    if (typeof fbq === 'function') { try { fbq('track', 'Contact'); } catch (e) {} }
    window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(waMessage()), '_blank', 'noopener');
  }

  /* ── Cotizar con un asesor → WhatsApp con el resumen de la aleación ── */
  function pay() { openWhatsApp(); }

  /* ── Precio en vivo ─────────────────────────────────────────────── */
  (function fetchSpot() {
    var ctrl = ('AbortController' in window) ? new AbortController() : null;
    var to = ctrl ? setTimeout(function () { ctrl.abort(); }, 4500) : null;
    fetch('/.netlify/functions/metales', ctrl ? { signal: ctrl.signal } : undefined)
      .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function (data) {
        if (to) clearTimeout(to);
        if (data && data.gramo) {
          MATERIALS.forEach(function (m) { if (typeof data.gramo[m.key] === 'number') PRICE[m.key] = data.gramo[m.key]; });
          PRICE_LIVE = !!data.live; applySpotLabel(); render();
        }
      })
      .catch(function () { if (to) clearTimeout(to); PRICE_LIVE = false; applySpotLabel(); });
  })();
  function applySpotLabel() {
    if (spotSrc) spotSrc.textContent = PRICE_LIVE ? 'precio internacional en vivo' : 'estimación de referencia';
    if (valueNote) valueNote.innerHTML = PRICE_LIVE
      ? 'Metal calculado contra el precio internacional en vivo, con la hechura del taller y la ganancia de la casa ya incluidas. El diseño y el engaste de las piezas elaboradas se cotizan aparte con su asesor.'
      : 'Metal de referencia con la hechura del taller y la ganancia de la casa ya incluidas. Su asesor confirma el valor final con la cotización del oro del día. El diseño y el engaste se cotizan aparte.';
  }

  /* ── Eventos ────────────────────────────────────────────────────── */
  smeltBtn.addEventListener('click', smelt);
  clearBtn.addEventListener('click', function () {
    MATERIALS.forEach(function (m) { state[m.key] = 0; });
    weightMaxTxt.textContent = '0 g · tope ' + MAX_G + ' g'; render(); save();
  });
  $('fndPay').addEventListener('click', pay);
  $('fndAgain').addEventListener('click', closeResult);
  $('fndResultClose').addEventListener('click', closeResult);
  resultEl.querySelector('[data-result-close]').addEventListener('click', closeResult);
  $('fndCertOpen').addEventListener('click', openCert);
  $('fndCertClose').addEventListener('click', closeCert);
  certEl.querySelector('[data-cert-close]').addEventListener('click', closeCert);
  $('fndCertPrint').addEventListener('click', function () { window.print(); });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (certEl.getAttribute('aria-hidden') === 'false') closeCert();
    else if (resultEl.getAttribute('aria-hidden') === 'false') closeResult();
  });

  applySpotLabel();
  render();
})();
