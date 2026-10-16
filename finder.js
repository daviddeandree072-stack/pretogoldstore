/* ─────────────────────────────────────────────────────────────
   Preto by Dala&Co — Punto 09 · Filtros de descubrimiento
   "Encuentre su pieza": filtra el catálogo por destinatario,
   material, ocasión y presupuesto. Reutiliza el overlay de
   categorías (cat-shell + var-card) para mantener el lenguaje
   visual de la casa. Cargar DESPUÉS de app.js (defer).

   · Las etiquetas se derivan de la referencia (SKU):
       PRT = ónix & oro de Chocó · DAL = oro 18k · ACC = noir
       CH cadenas · RO rosarios · RG anillos · EA pendientes
       BR pulseras · PN bolígrafos · BA barras · GE gemelos · IN insignias
   · El filtro de presupuesto solo aparece cuando hay precios
     publicados (precios.js). Sin precios, se oculta solo.
   ───────────────────────────────────────────────────────────── */
(function initFinder() {
  if (typeof catShell === 'undefined' || !catShell || !catOverlay) return;

  // Piezas concretas del catálogo (sin las familias-padre).
  const FINDER_ITEMS = COLLECTIONS.filter(function (p) { return !p.variants && !/-PH\d/.test(p.id); });

  function finderTags(p) {
    const parts = p.id.split('-');
    const brand = parts[0], code = parts[1], sub = parts[2] || '';
    const mat = brand === 'PRT' ? 'choco' : (brand === 'DAL' ? 'oro' : 'noir');
    let para = 'ambos';
    if (code === 'PN' || code === 'BA' || code === 'GE' || code === 'IN') para = 'el';
    if (code === 'EA') para = 'ella';
    const oca = [];
    if (code === 'CH' || code === 'BR') oca.push('diario');
    if (code === 'CH' && brand === 'PRT') oca.push('noche');
    if (code === 'RG') {
      oca.push('diario');
      if (sub === 'CUB' || sub === 'RUS') oca.push('noche');
      if (sub === 'REL') oca.push('devocion');
    }
    if (code === 'EA') {
      if (sub === 'TOP' || sub === 'ARG' || sub === 'TRE') oca.push('diario');
      if (sub === 'CAN') oca.push('noche');
    }
    if (code === 'RO') oca.push('devocion');
    if (code === 'PN' || code === 'BA' || code === 'GE' || code === 'IN') oca.push('formal');
    if (code === 'IN' && sub === 'CRU') oca.push('devocion');
    return { mat: mat, para: para, oca: oca };
  }

  const TAGGED = FINDER_ITEMS.map(function (p) {
    return { p: p, t: finderTags(p), price: priceFor(p.id) };
  });
  const HAS_PRICES = TAGGED.some(function (x) { return x.price != null; });

  const PRE_RANGES = [
    { key: 'p1',  label: 'Hasta $1M',       test: function (n) { return n != null && n <= 1000000; } },
    { key: 'p2',  label: '$1M – $2M',       test: function (n) { return n != null && n > 1000000 && n <= 2000000; } },
    { key: 'p3',  label: '$2M – $3M',       test: function (n) { return n != null && n > 2000000 && n <= 3000000; } },
    { key: 'p4',  label: 'Desde $3M',       test: function (n) { return n != null && n > 3000000; } },
    { key: 'cot', label: 'Consultar precio', test: function (n) { return n == null; } },
  ];

  const ROWS = [
    { key: 'para', label: 'Para',     opts: [['all', 'Todos'], ['el', 'Él'], ['ella', 'Ella']] },
    { key: 'mat',  label: 'Material', opts: [['all', 'Todos'], ['oro', 'Oro 18k'], ['choco', 'Ónix & oro de Chocó'], ['noir', 'Noir']] },
    { key: 'oca',  label: 'Ocasión',  opts: [['all', 'Cualquiera'], ['diario', 'Uso diario'], ['noche', 'Noche'], ['devocion', 'Devoción'], ['formal', 'Formal']] },
  ];
  if (HAS_PRICES) {
    ROWS.push({
      key: 'pre', label: 'Presupuesto',
      opts: [['all', 'Cualquiera']].concat(PRE_RANGES.map(function (r) { return [r.key, r.label]; })),
    });
  }

  const state = { para: 'all', mat: 'all', oca: 'all', pre: 'all', sort: 'all' };

  // Orden por precio (solo cuando hay precios publicados).
  const SORT_OPTS = [['all', 'Sugerido'], ['asc', 'Menor precio'], ['desc', 'Mayor precio']];

  function matches(x) {
    if (state.para !== 'all' && !(x.t.para === state.para || x.t.para === 'ambos')) return false;
    if (state.mat !== 'all' && x.t.mat !== state.mat) return false;
    if (state.oca !== 'all' && x.t.oca.indexOf(state.oca) === -1) return false;
    if (state.pre !== 'all') {
      const r = PRE_RANGES.find(function (r) { return r.key === state.pre; });
      if (r && !r.test(x.price)) return false;
    }
    return true;
  }

  function priceLine(x) {
    if (x.price == null) return (typeof waPriceBtn === 'function') ? waPriceBtn(x.p.id, x.p.name) : 'Consultar precio';
    return (typeof isExactPriceId === 'function' && isExactPriceId(x.p.id)) ? fmtCOP(x.price) : 'Desde ' + fmtCOP(x.price);
  }

  function cardMarkup(x) {
    const p = x.p;
    let optionsMarkup = '';
    if (p.sizes && p.sizes.length) {
      optionsMarkup =
        '<div class="size-row" data-product="' + p.id + '">' +
          '<span class="size-label">Medida</span>' +
          p.sizes.map(function (s, idx) {
            return '<button class="size-chip ' + (idx === 1 ? 'active' : '') + '" data-size="' + s + '">' + s + '</button>';
          }).join('') +
        '</div>';
    } else if (p.note) {
      optionsMarkup =
        '<div class="var-note"><span class="note-glyph">✦</span><span>' + p.note + '</span></div>';
    }
    return (
      '<article class="var-card" data-id="' + p.id + '">' +
        '<div class="var-art' + (p.image ? ' has-image' : '') + '" data-label="' + p.label + '"' +
          (p.image ? ' style="background-image:url(\'' + p.image + '\')"' : '') + '></div>' +
        '<div class="var-body">' +
          '<div class="var-name">' +
            '<h3>' + p.name + '</h3>' +
            '<span class="var-ref">Ref. ' + p.id + '</span>' +
          '</div>' +
          '<p class="var-blurb">' + (p.desc || '') + '</p>' +
          '<p class="var-price">' + priceLine(x) + '</p>' +
          optionsMarkup +
          '<button class="var-add" data-id="' + p.id + '">' +
            '<span>Añadir al carrito</span>' +
            '<span class="arrow"></span>' +
          '</button>' +
        '</div>' +
      '</article>'
    );
  }

  function syncChips() {
    catShell.querySelectorAll('.f-chip').forEach(function (c) {
      c.classList.toggle('active', state[c.dataset.key] === c.dataset.val);
    });
  }

  function renderGrid() {
    const grid = document.getElementById('finderGrid');
    const count = document.getElementById('finderCount');
    if (!grid) return;
    /* Sin foto no se exhibe: una tarjeta vacía no ayuda a decidir. */
    let res = TAGGED.filter(matches).filter(function (x) {
      return !!(x.p && (x.p.image || (x.p.images && x.p.images.length)));
    });
    if (state.sort === 'asc' || state.sort === 'desc') {
      const dir = state.sort === 'asc' ? 1 : -1;
      res = res.slice().sort(function (a, b) {
        if (a.price == null && b.price == null) return 0;
        if (a.price == null) return 1;   // "Consultar precio" siempre al final
        if (b.price == null) return -1;
        return (a.price - b.price) * dir;
      });
    }
    if (count) {
      count.textContent = res.length
        ? String(res.length).padStart(2, '0') + (res.length === 1 ? ' pieza encontrada' : ' piezas encontradas')
        : '';
    }
    grid.innerHTML = res.length
      ? res.map(cardMarkup).join('')
      : '<div class="finder-empty">Ninguna pieza coincide con estos filtros.<br />' +
        '<button class="finder-reset" id="finderReset">Limpiar filtros</button></div>';

    grid.querySelectorAll('.size-row').forEach(function (row) {
      row.addEventListener('click', function (e) {
        const chip = e.target.closest('.size-chip');
        if (!chip) return;
        e.stopPropagation();
        row.querySelectorAll('.size-chip').forEach(function (c) { c.classList.remove('active'); });
        chip.classList.add('active');
      });
    });
    grid.querySelectorAll('.var-add').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        const card = b.closest('.var-card');
        const activeSize = card.querySelector('.size-chip.active');
        addToQuote(b.dataset.id, activeSize ? activeSize.dataset.size : null, b);
      });
    });
    grid.querySelectorAll('.var-card').forEach(function (card) {
      card.addEventListener('click', function (e) {
        if (e.target.closest('.var-add') || e.target.closest('.size-chip')) return;
        openProduct(card.dataset.id);
      });
    });
    const reset = document.getElementById('finderReset');
    if (reset) {
      reset.addEventListener('click', function () {
        Object.keys(state).forEach(function (k) { state[k] = 'all'; });
        syncChips();
        renderGrid();
      });
    }
  }

  window.openFinder = function (preset) {
    if (preset) {
      Object.keys(preset).forEach(function (k) { if (k in state) state[k] = preset[k]; });
    }
    catShell.innerHTML =
      '<header class="cat-head finder-head">' +
        '<button class="cat-back" id="catBack" aria-label="Volver"><span class="arr">←</span> Volver</button>' +
        '<div class="cat-meta">' +
          '<span class="eyebrow">Descubrir</span>' +
          '<span class="dot-divider"></span>' +
          '<span class="eyebrow eyebrow-bone">' + TAGGED.length + ' piezas en catálogo</span>' +
        '</div>' +
        '<h2 class="cat-title">Encuentre su <span class="script">pieza.</span></h2>' +
        '<p class="cat-sub">Filtre por destinatario, material' + (HAS_PRICES ? ', ocasión y presupuesto' : ' y ocasión') + '. El concierge confirma cada compra por WhatsApp.</p>' +
      '</header>' +
      '<div class="finder-bar">' +
        ROWS.map(function (r) {
          return (
            '<div class="f-row">' +
              '<span class="f-label">' + r.label + '</span>' +
              '<div class="f-chips">' +
                r.opts.map(function (o) {
                  return '<button class="f-chip' + (state[r.key] === o[0] ? ' active' : '') + '" data-key="' + r.key + '" data-val="' + o[0] + '">' + o[1] + '</button>';
                }).join('') +
              '</div>' +
            '</div>'
          );
        }).join('') +
        (HAS_PRICES ? (
          '<div class="f-row f-row-sort">' +
            '<span class="f-label">Ordenar</span>' +
            '<div class="f-chips">' +
              SORT_OPTS.map(function (o) {
                return '<button class="f-chip' + (state.sort === o[0] ? ' active' : '') + '" data-key="sort" data-val="' + o[0] + '">' + o[1] + '</button>';
              }).join('') +
            '</div>' +
          '</div>'
        ) : '') +
      '</div>' +
      '<p class="finder-count" id="finderCount"></p>' +
      '<div class="cat-grid" id="finderGrid"></div>';

    catShell.querySelectorAll('.f-chip').forEach(function (c) {
      c.addEventListener('click', function () {
        state[c.dataset.key] = c.dataset.val;
        syncChips();
        renderGrid();
      });
    });
    document.getElementById('catBack').addEventListener('click', closeCategory);
    renderGrid();
    catShell.scrollTop = 0;
    catOverlay.scrollTop = 0;
    catOverlay.classList.add('open');
    catOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  // Cualquier elemento con data-finder abre el buscador.
  document.querySelectorAll('[data-finder]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      window.openFinder();
    });
  });
})();
