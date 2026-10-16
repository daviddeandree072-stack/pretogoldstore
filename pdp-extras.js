/* ───────────────────────────────────────────────────────────────
   Preto by Dala&Co · EXTRAS DE LA FICHA (PDP)
   ───────────────────────────────────────────────────────────────
   Auditoría ago-2026 · puntos 3, 4 y 8 de la fase 2. Tres bloques
   que la ficha no tenía y que las casas grandes resuelven antes
   del pago:

     1. DISPONIBILIDAD  — «Hecha a pedido · 3 semanas» frente a
        «Disponible · despacho asegurado en 48 h». El dato ya
        existía en app.js (madeToOrder) y no se mostraba.
     2. CERTIFICADO     — la Tarjeta de Propiedad, mostrada antes
        de comprar y no prometida en el paso «Entrega».
     3. LA FUNDICIÓN    — el oro de la pieza al precio internacional
        de hoy. Es la herramienta que ninguna casa ofrece; estaba
        enterrada en el menú.

   app.js solo llama a window.PRETO_PDP_EXTRAS(p) al abrir la ficha.
   Si una pieza trae `gramos` en su ficha de datos, el bloque de oro
   muestra el valor del metal de ESA pieza al precio del día.
   ─────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  /* El panel de la ficha es vino oscuro (#5A1424) con tipografía
     clara: las tintas van sobre blanco con alfa, no sobre --ink-rgb. */
  var CSS = [
    '.px{display:flex;flex-direction:column;gap:13px;margin:26px 0 4px}',
    '.px-avail{display:flex;align-items:center;gap:10px;margin:0;font-family:var(--sans);font-size:11px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.78)}',
    '.px-avail .px-dot{width:6px;height:6px;flex:0 0 auto;border-radius:50%;background:#6FBE93;box-shadow:0 0 0 3px rgba(111,190,147,.2)}',
    '.px-avail.is-mto .px-dot{border-radius:0;transform:rotate(45deg);background:var(--gold);box-shadow:0 0 0 3px rgba(201,156,44,.22)}',
    '.px-avail em{font-family:var(--serif);font-size:13.5px;font-style:italic;font-weight:300;letter-spacing:.02em;text-transform:none;color:rgba(255,255,255,.5)}',
    '.px-card{display:block;padding:16px 18px;border:1px solid rgba(201,156,44,.3);background:rgba(255,255,255,.045);text-decoration:none}',
    'a.px-card{transition:border-color .3s ease,background .3s ease}',
    'a.px-card:hover{border-color:rgba(201,156,44,.62);background:rgba(201,156,44,.1)}',
    '.px-k{display:block;font-family:var(--sans);font-size:9px;font-weight:500;letter-spacing:.3em;text-transform:uppercase;color:var(--gold)}',
    '.px-t{display:block;margin-top:7px;font-family:var(--serif);font-weight:300;font-size:18px;line-height:1.25;color:rgba(255,255,255,.94)}',
    '.px-t b{font-weight:400;color:var(--gold)}',
    '.px-d{display:block;margin-top:6px;font-family:var(--sans);font-weight:300;font-size:12.5px;line-height:1.62;color:rgba(255,255,255,.6)}',
    '.px-more{display:inline-block;margin-top:10px;font-family:var(--sans);font-size:9.5px;font-weight:500;letter-spacing:.24em;text-transform:uppercase;color:var(--gold)}',
    '.px-seal{display:flex;align-items:center;gap:15px}',
    '.px-seal-mark{flex:0 0 auto;width:52px;height:52px;display:grid;place-items:center;border:1px solid rgba(201,156,44,.5);border-radius:50%;font-family:var(--serif);font-size:20px;line-height:1;color:var(--gold)}',
    '.px-cta{margin:4px 0 0;padding:0;background:none;border:0;cursor:pointer;align-self:flex-start;display:inline-flex;align-items:center;gap:11px;font-family:var(--sans);font-size:10px;font-weight:500;letter-spacing:.26em;text-transform:uppercase;color:rgba(255,255,255,.72);transition:color .3s ease}',
    '.px-cta:hover{color:var(--gold)}',
    '.px-cta .arrow{display:inline-block;width:26px;height:1px;background:currentColor;transition:width .3s ease}',
    '.px-cta:hover .arrow{width:38px}'
  ].join('');

  function styles() {
    if (document.getElementById('pdp-extras-css')) return;
    var s = document.createElement('style');
    s.id = 'pdp-extras-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function fmt(n) {
    try { return '$' + Math.round(n).toLocaleString('es-CO'); }
    catch (e) { return '$' + Math.round(n); }
  }

  /* ── Precio del oro en vivo · misma función que usa La Fundición ── */
  var goldG = null, goldLive = false, goldAsked = false;
  var goldWaiters = [];
  function gold(cb) {
    if (goldG != null) return cb(goldG, goldLive);
    goldWaiters.push(cb);
    if (goldAsked) return;
    goldAsked = true;
    var ctrl = ('AbortController' in window) ? new AbortController() : null;
    var to = ctrl ? setTimeout(function () { ctrl.abort(); }, 4500) : null;
    fetch('/.netlify/functions/metales', ctrl ? { signal: ctrl.signal } : undefined)
      .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function (d) {
        if (to) clearTimeout(to);
        if (d && d.gramo && typeof d.gramo.choco === 'number') {
          goldG = d.gramo.choco;
          goldLive = !!d.live;
          goldWaiters.forEach(function (f) { f(goldG, goldLive); });
        }
        goldWaiters = [];
      })
      .catch(function () { goldWaiters = []; });
  }

  /* ── ¿Se hace por encargo? ──────────────────────────────────
     El dato vive en la pieza o, si es una familia, en sus variantes:
     una familia entera por encargo solo si TODAS lo son. */
  function madeToOrder(p) {
    if (p.madeToOrder) return true;
    if (p.variants && p.variants.length) {
      for (var i = 0; i < p.variants.length; i++) if (!p.variants[i].madeToOrder) return false;
      return true;
    }
    return false;
  }

  window.PRETO_PDP_EXTRAS = function (p) {
    if (!p) return;
    styles();

    var host = document.getElementById('pdpExtras');
    if (!host) {
      var anchor = document.getElementById('pdpVariants');
      if (!anchor || !anchor.parentNode) return;
      host = document.createElement('div');
      host.className = 'px';
      host.id = 'pdpExtras';
      anchor.parentNode.insertBefore(host, anchor.nextSibling);
    }

    var mto = madeToOrder(p);
    var html = '';

    /* 1 · Disponibilidad y plazo */
    html += '<p class="px-avail' + (mto ? ' is-mto' : '') + '"><span class="px-dot"></span>' +
      (mto
        ? 'Hecha a pedido <em>· tres semanas en el taller</em>'
        : 'Disponible <em>· despacho asegurado en 48 h</em>') +
      '</p>';

    /* 2 · El certificado, mostrado */
    html +=
      '<a class="px-card px-seal" href="/promesa">' +
        '<span class="px-seal-mark">Au</span>' +
        '<span>' +
          '<span class="px-k">Tarjeta de propiedad · garantía de por vida</span>' +
          '<span class="px-t">Certificado de <b>oro 18k</b>, numerado</span>' +
          '<span class="px-d">Acredita el material, registra su pedido y activa la garantía de por vida. Viaja en el estuche y también a su correo.</span>' +
        '</span>' +
      '</a>';

    /* 3 · La Fundición · el oro de la pieza al precio de hoy */
    var g = Number(p.gramos || p.peso || 0) || 0;
    html +=
      '<a class="px-card px-gold" href="/fundicion">' +
        '<span class="px-k">La Fundición · valor del metal</span>' +
        '<span class="px-t" id="pxGoldLine">' + (g ? 'Esta pieza lleva <b>' + g + ' g</b> de oro' : 'El oro de Chocó, al precio de hoy') + '</span>' +
        '<span class="px-d" id="pxGoldNote">Consultando el precio internacional…</span>' +
        '<span class="px-more">Abrir la balanza →</span>' +
      '</a>';

    /* 4 · Cita privada — la ficha también es puerta de entrada al atelier */
    html += '<button type="button" class="px-cta" data-cita="' + String(p.name || '').replace(/"/g, '&quot;') + '">' +
      '<span>Agendar llamada privada</span><span class="arrow"></span></button>';

    host.innerHTML = html;

    gold(function (perG, live) {
      var line = document.getElementById('pxGoldLine');
      var note = document.getElementById('pxGoldNote');
      if (!note) return;
      var when = live ? 'precio internacional en vivo' : 'precio de referencia';
      if (g && line) {
        line.innerHTML = 'Esta pieza lleva <b>' + g + ' g</b> · su oro vale ' + fmt(g * perG) + ' hoy';
        note.textContent = 'Oro de Chocó a ' + fmt(perG) + ' por gramo — ' + when + '. Ninguna casa de lujo abre este cálculo.';
      } else {
        note.textContent = 'Oro de Chocó a ' + fmt(perG) + ' por gramo — ' + when + '. Pese el suyo y vea al instante lo que vale.';
      }
    });
    setTimeout(function () {
      var note = document.getElementById('pxGoldNote');
      if (note && /Consultando/.test(note.textContent)) {
        note.textContent = 'Pese su oro en la balanza de la casa y vea al instante lo que vale, al precio internacional del día.';
      }
    }, 5000);
  };
})();
