/* ═══════════════════════════════════════════════════════════════
   PRETO BY DALA&CO — PUNTO 12 DEL INFORME CRO
   Cross-sell · Conjuntos (sets) · Tarjeta de regalo
   ───────────────────────────────────────────────────────────────
   Este archivo se carga DESPUÉS de app.js y reutiliza sus datos
   y funciones (COLLECTIONS, addToQuote, openProduct, priceFor…).
   No toca la lógica existente: la envuelve y la extiende.

   ► Qué puede editar sin tocar nada más:
     · SETS  — los conjuntos curados (nombre, piezas, texto).
     · GIFT_AMOUNTS — los montos sugeridos de la tarjeta de regalo.
     · XSELL_MAP — pares de cross-sell hechos a mano (opcional).
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';
  if (typeof COLLECTIONS === 'undefined') return; // app.js no cargó aún

  /* ── Piezas individuales (hojas del catálogo, sin familias) ── */
  const LEAVES = COLLECTIONS.filter(p => !p.variants);
  const catOf  = id => (id || '').split('-')[1];           // PRT-CH-LAZ → CH
  const leafById = id => LEAVES.find(p => p.id === id);

  /* ── Tallas por defecto (igual criterio que el resto del sitio) */
  function defaultSizeFor(id) {
    const p = leafById(id);
    if (p && p.sizes && p.sizes.length) return p.sizes[Math.min(1, p.sizes.length - 1)];
    return null;
  }

  /* ════════ 1 · CROSS-SELL — "Completa el conjunto" ═══════════ */

  // Qué categoría complementa a cada categoría (cadena→anillo, etc.).
  const XSELL_BY_CAT = {
    CH: ['EA', 'RG', 'BR'],   // cadena   → pendiente, anillo, pulsera
    RG: ['CH', 'EA', 'BR'],   // anillo   → cadena, pendiente, pulsera
    EA: ['CH', 'RG', 'BR'],   // pendiente→ cadena, anillo, pulsera
    BR: ['CH', 'RG', 'EA'],   // pulsera  → cadena, anillo, pendiente
    RO: ['RG', 'CH', 'BR'],   // rosario  → anillo, cadena, pulsera
    PN: ['GE', 'BA', 'IN'],   // bolígrafo→ gemelos, barra, insignia
    BA: ['GE', 'IN', 'PN'],   // barra    → gemelos, insignia, bolígrafo
    GE: ['BA', 'IN', 'PN'],   // gemelos  → barra, insignia, bolígrafo
    IN: ['GE', 'BA', 'PN'],   // insignia → gemelos, barra, bolígrafo
    BB: ['BB'],               // bebé     → otra pieza de bebé
  };

  // Pares hechos a mano (tienen prioridad). Opcional — déjelo vacío
  // y el sitio deriva complementos solo por categoría.
  const XSELL_MAP = {
    'PRT-RO-CRU': ['PRT-RG-REL', 'PRT-CH-RUS', 'PRT-BR-007'],
    'PRT-RO-CLA': ['PRT-RG-REL', 'PRT-CH-RUS', 'PRT-BR-007'],
    'DAL-RO-CLA': ['DAL-RG-REL', 'DAL-CH-LAZ', 'DAL-BR-018'],
  };

  function pickComplement(cat, line, used) {
    let c = LEAVES.find(p => !used.has(p.id) && catOf(p.id) === cat && p.line === line);
    if (!c) c = LEAVES.find(p => !used.has(p.id) && catOf(p.id) === cat);
    return c || null;
  }

  // Devuelve hasta 3 piezas que complementan a `p`.
  function complementsFor(p) {
    const used = new Set([p.id]);
    const out = [];
    // 1) curados a mano
    (XSELL_MAP[p.id] || []).forEach(id => {
      const c = leafById(id);
      if (c && !used.has(c.id)) { out.push(c); used.add(c.id); }
    });
    // 2) derivados por categoría
    if (out.length < 3) {
      const targets = XSELL_BY_CAT[catOf(p.id)] || ['CH', 'RG'];
      for (const cat of targets) {
        if (out.length >= 3) break;
        const c = pickComplement(cat, p.line, used);
        if (c) { out.push(c); used.add(c.id); }
      }
    }
    return out.slice(0, 3);
  }

  function xsellCardMarkup(c) {
    const art = c.image
      ? `<span class="xsell-art has-image" style="background-image:url('${c.image}')"></span>`
      : `<span class="xsell-art" data-label="${c.label}"></span>`;
    return `
      <article class="xsell-card" data-id="${c.id}">
        ${art}
        <span class="xsell-meta">
          <span class="xsell-name">${c.name}</span>
          <span class="xsell-price">${priceLabelFor(c)}</span>
        </span>
        <button class="xsell-add" data-id="${c.id}" aria-label="Añadir ${c.name} a la cotización">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M8 3v10M3 8h10"/></svg>
        </button>
      </article>`;
  }

  // Inyecta "Completa el conjunto" en la ficha de producto (PDP).
  function renderCrossSell(id) {
    const host = document.getElementById('pdpCross');
    if (!host) return;
    const p = COLLECTIONS.find(x => x.id === id);
    if (!p || p.variants) { host.innerHTML = ''; host.style.display = 'none'; return; }

    const comps = complementsFor(p);
    if (!comps.length) { host.innerHTML = ''; host.style.display = 'none'; return; }

    host.innerHTML = `
      <span class="xsell-label">Completa el <span class="script">conjunto</span></span>
      <div class="xsell-row">${comps.map(xsellCardMarkup).join('')}</div>`;
    host.style.display = '';

    host.querySelectorAll('.xsell-card').forEach(card => {
      card.addEventListener('click', e => {
        if (e.target.closest('.xsell-add')) return;
        openProduct(card.dataset.id);          // re-abre la ficha de la pieza
        const shell = document.querySelector('.pdp-shell');
        if (shell) shell.scrollTop = 0;
      });
    });
    host.querySelectorAll('.xsell-add').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        addToQuote(btn.dataset.id, defaultSizeFor(btn.dataset.id), btn);
      });
    });
  }

  // Envuelve openProduct para añadir el bloque al abrir cualquier ficha.
  if (typeof openProduct === 'function') {
    const _openProduct = openProduct;
    openProduct = function (id) {
      _openProduct(id);
      try { renderCrossSell(id); } catch (e) { console.warn('[Preto] cross-sell PDP', e); }
    };
  }

  /* ── Cross-sell dentro del cajón de cotización ─────────────── */
  function renderDrawerCross() {
    const host = document.getElementById('drawerCross');
    if (!host) return;
    const physical = (quote || []).filter(it => it.kind !== 'giftcard');
    if (!physical.length) { host.innerHTML = ''; host.style.display = 'none'; return; }

    const inBag = new Set(physical.map(it => it.id));
    const used = new Set(inBag);
    const sugg = [];
    for (const it of physical) {
      if (sugg.length >= 2) break;
      const targets = XSELL_BY_CAT[catOf(it.id)] || ['CH', 'RG'];
      const line = (leafById(it.id) || {}).line;
      for (const cat of targets) {
        if (sugg.length >= 2) break;
        const c = pickComplement(cat, line, used);
        if (c) { sugg.push(c); used.add(c.id); }
      }
    }
    if (!sugg.length) { host.innerHTML = ''; host.style.display = 'none'; return; }

    host.innerHTML = `
      <span class="drawer-cross-label">Quizá complemente su elección</span>
      <div class="drawer-cross-row">${sugg.map(c => {
        const art = c.image
          ? `<span class="dc-art has-image" style="background-image:url('${c.image}')"></span>`
          : `<span class="dc-art" data-label="${c.label}"></span>`;
        return `
          <article class="dc-card" data-id="${c.id}">
            ${art}
            <span class="dc-meta">
              <span class="dc-name">${c.name}</span>
              <span class="dc-price">${priceLabelFor(c)}</span>
            </span>
            <button class="dc-add" data-id="${c.id}" aria-label="Añadir ${c.name}">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M8 3v10M3 8h10"/></svg>
            </button>
          </article>`;
      }).join('')}</div>`;
    host.style.display = '';

    host.querySelectorAll('.dc-card').forEach(card => {
      card.addEventListener('click', e => {
        if (e.target.closest('.dc-add')) return;
        const prod = COLLECTIONS.find(x => x.id === card.dataset.id);
        if (prod && prod.variants) openCategory(card.dataset.id);
        else openProduct(card.dataset.id);
      });
    });
    host.querySelectorAll('.dc-add').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        addToQuote(btn.dataset.id, defaultSizeFor(btn.dataset.id), btn);
      });
    });
  }

  if (typeof renderDrawer === 'function') {
    const _renderDrawer = renderDrawer;
    renderDrawer = function () {
      _renderDrawer();
      try { renderDrawerCross(); } catch (e) { console.warn('[Preto] cross-sell drawer', e); }
    };
  }

  /* ════════ 2 · CONJUNTOS (sets curados con nombre propio) ════ */

  const SETS = [
    {
      id: 'SET-NOCTURNE', name: 'Dúo', script: 'Nocturne', line: 'preto',
      eyebrow: 'Conjunto · Preto', label: 'SET · ONYX',
      image: 'assets/preto-hero.jpg',
      blurb: 'La cadena rústica y el anillo cubano de la línea Preto, reunidos en ónix negro y oro de Chocó. Carácter urbano y presencia nocturna en un mismo gesto.',
      items: [{ id: 'PRT-CH-RUS', size: '55 cm' }, { id: 'PRT-RG-CUB' }],
    },
    {
      id: 'SET-SACRA', name: 'Vía', script: 'Sacra', line: 'preto',
      eyebrow: 'Conjunto · Devocional', label: 'SET · SACRA',
      blurb: 'Rosario decenario, anillo religioso y pulsera de hilo en oro de Chocó. Un conjunto pensado para llevar la fe cerca, de la muñeca al pecho.',
      items: [{ id: 'PRT-RO-DEC', size: '55 cm' }, { id: 'PRT-RG-REL' }, { id: 'PRT-BR-007' }],
    },
    {
      id: 'SET-AURORA', name: 'Aurora', script: 'Dala&Co', line: 'dala',
      eyebrow: 'Conjunto · Dala&Co', label: 'SET · 18k GOLD',
      blurb: 'Cadena lazo y pendientes topo en oro de 18k pulido. La luz cálida de la línea Dala&Co, reunida en un dúo de uso diario y noche.',
      items: [{ id: 'DAL-CH-LAZ', size: '50 cm' }, { id: 'DAL-EA-TOP' }],
    },
  ];

  function setTotal(set) {
    let sum = 0, allPriced = true;
    set.items.forEach(it => {
      const n = priceFor(it.id);
      if (n != null) sum += n; else allPriced = false;
    });
    return { sum, allPriced };
  }

  function setCardMarkup(set) {
    const { sum, allPriced } = setTotal(set);
    const priceLine = sum > 0
      ? `Conjunto desde ${fmtCOP(sum)}${allPriced ? '' : ' +'}`
      : 'Conjunto bajo cotización';
    const art = set.image
      ? `<div class="var-art has-image" data-label="${set.label}" style="background-image:url('${set.image}')"></div>`
      : `<div class="var-art" data-label="${set.label}"></div>`;
    const pieces = set.items.map(it => {
      const p = leafById(it.id) || { name: it.id };
      return `<li data-id="${it.id}"><span class="sp-name">${p.name}${it.size ? ` · ${it.size}` : ''}</span><span class="sp-price">${priceLabelFor(p)}</span></li>`;
    }).join('');
    return `
      <article class="var-card set-card" data-set="${set.id}">
        ${art}
        <div class="var-body">
          <div class="var-name">
            <h3>${set.name} <span class="script">${set.script}</span></h3>
            <span class="var-ref">${String(set.items.length).padStart(2, '0')} piezas</span>
          </div>
          <p class="var-blurb">${set.blurb}</p>
          <ul class="set-pieces">${pieces}</ul>
          <p class="var-price">${priceLine}</p>
          <button class="var-add set-add" data-set="${set.id}">
            <span>Añadir el conjunto</span><span class="arrow"></span>
          </button>
        </div>
      </article>`;
  }

  function addSetToQuote(setId, sourceEl) {
    const set = SETS.find(s => s.id === setId);
    if (!set) return;
    set.items.forEach(it => {
      const p = leafById(it.id);
      if (!p) return;
      const size = it.size || defaultSizeFor(it.id);
      const key = size ? `${it.id}|${size}` : it.id;
      const existing = quote.find(x => x.key === key);
      if (existing) existing.qty += 1;
      else quote.push({
        key, id: it.id, name: p.name, col: p.col || '', size: size || null,
        note: p.note || null, desc: p.desc || null, price: priceFor(it.id), qty: 1,
      });
    });
    saveQuote();
    triggerAddFeedback({ name: `${set.name} ${set.script} · ${set.items.length} piezas`, note: null }, null, 1, false, sourceEl);
    setTimeout(openDrawer, sourceEl ? 620 : 0);
  }

  function openSets() {
    if (typeof catShell === 'undefined' || !catShell) return;
    catShell.innerHTML = `
      <header class="cat-head">
        <button class="cat-back" id="catBack" aria-label="Volver"><span class="arr">←</span> Volver</button>
        <div class="cat-meta">
          <span class="eyebrow">Conjuntos de la casa</span>
          <span class="dot-divider"></span>
          <span class="eyebrow eyebrow-bone">${String(SETS.length).padStart(2, '0')} conjuntos</span>
        </div>
        <h2 class="cat-title">Conjuntos con <span class="script">nombre.</span></h2>
        <p class="cat-sub">Piezas que la casa eligió para acompañarse entre sí. Añada el conjunto completo a su cotización o descubra cada pieza por separado.</p>
      </header>
      <div class="cat-grid">${SETS.map(setCardMarkup).join('')}</div>`;

    catShell.querySelectorAll('.set-add').forEach(b => {
      b.addEventListener('click', e => { e.stopPropagation(); addSetToQuote(b.dataset.set, b); });
    });
    catShell.querySelectorAll('.set-pieces li').forEach(li => {
      li.addEventListener('click', () => {
        const prod = COLLECTIONS.find(x => x.id === li.dataset.id);
        if (prod && prod.variants) openCategory(li.dataset.id);
        else if (prod) openProduct(li.dataset.id);
      });
    });
    const back = document.getElementById('catBack');
    back && back.addEventListener('click', closeCategory);

    catShell.scrollTop = 0;
    catOverlay.scrollTop = 0;
    catOverlay.classList.add('open');
    catOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  /* ════════ 3 · TARJETA DE REGALO (gift card digital) ═════════ */

  const GIFT_AMOUNTS = [300000, 500000, 800000, 1500000];
  let gcState = { amount: 500000, to: '' };

  function addGiftCard(amount, recipient, sourceEl) {
    if (!amount || amount <= 0) return;
    const key = 'GIFT-CARD|' + amount + (recipient ? '|' + recipient : '');
    const existing = quote.find(x => x.key === key);
    const wasExisting = !!existing;
    if (existing) existing.qty += 1;
    else quote.push({
      key, id: 'GIFT-CARD', name: 'Tarjeta de regalo Preto', col: 'Tarjeta de regalo',
      size: fmtCOP(amount), note: recipient ? ('Para: ' + recipient) : null,
      desc: null, price: amount, qty: 1, kind: 'giftcard',
    });
    const qtyNow = existing ? existing.qty : 1;
    saveQuote();
    triggerAddFeedback({ name: 'Tarjeta de regalo Preto', note: null }, fmtCOP(amount), qtyNow, wasExisting, sourceEl);
    setTimeout(openDrawer, sourceEl ? 620 : 0);
  }

  function gcSyncCard() {
    const amtEl = document.getElementById('gcCardAmt');
    const toEl = document.getElementById('gcCardTo');
    if (amtEl) amtEl.textContent = gcState.amount > 0 ? fmtCOP(gcState.amount) : '—';
    if (toEl) toEl.textContent = gcState.to ? ('Para ' + gcState.to) : '';
  }

  function openGiftCard() {
    if (typeof catShell === 'undefined' || !catShell) return;
    gcState = { amount: 500000, to: '' };
    catShell.innerHTML = `
      <header class="cat-head">
        <button class="cat-back" id="catBack" aria-label="Volver"><span class="arr">←</span> Volver</button>
        <div class="cat-meta">
          <span class="eyebrow">Regalos · Tarjeta de regalo</span>
          <span class="dot-divider"></span>
          <span class="eyebrow eyebrow-bone">Monto libre</span>
        </div>
        <h2 class="cat-title">Tarjeta de <span class="script">regalo.</span></h2>
        <p class="cat-sub">El regalo perfecto cuando prefiere dejar elegir. Un monto a su gusto, entregado de forma digital y sin fecha de caducidad.</p>
      </header>
      <div class="gc-wrap">
        <div class="gc-card" aria-hidden="true">
          <div class="gc-card-sheen"></div>
          <div class="gc-card-top">
            <span class="gc-card-mark">Preto</span>
            <span class="gc-card-by">by Dala&amp;Co</span>
          </div>
          <div class="gc-card-amt" id="gcCardAmt">$500.000</div>
          <div class="gc-card-foot">
            <span>Tarjeta de regalo digital</span>
            <span class="gc-card-to" id="gcCardTo"></span>
          </div>
        </div>
        <div class="gc-form">
          <span class="gc-label">Elija un monto</span>
          <div class="gc-amounts" id="gcAmounts">
            ${GIFT_AMOUNTS.map(a => `<button class="gc-chip${a === gcState.amount ? ' active' : ''}" data-amt="${a}">${fmtCOP(a)}</button>`).join('')}
          </div>
          <label class="gc-field">
            <span>Otro monto (COP)</span>
            <input id="gcCustom" type="text" inputmode="numeric" autocomplete="off" placeholder="Ej. 750000" />
          </label>
          <label class="gc-field">
            <span>Para — opcional</span>
            <input id="gcTo" type="text" autocomplete="off" placeholder="Nombre de quien la recibe" />
          </label>
          <button class="btn-gold gc-add" id="gcAdd">Añadir a cotización <span aria-hidden="true" style="margin-left:2px;">→</span></button>
          <p class="gc-fine">La tarjeta se confirma y se entrega por WhatsApp junto con su cotización. El concierge coordina el envío digital al destinatario.</p>
        </div>
      </div>`;

    const chips = catShell.querySelectorAll('.gc-chip');
    const custom = document.getElementById('gcCustom');
    const toIn = document.getElementById('gcTo');

    chips.forEach(ch => ch.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      ch.classList.add('active');
      if (custom) custom.value = '';
      gcState.amount = parseInt(ch.dataset.amt, 10);
      gcSyncCard();
    }));
    if (custom) custom.addEventListener('input', () => {
      const digits = custom.value.replace(/[^\d]/g, '');
      custom.value = digits ? Number(digits).toLocaleString('es-CO') : '';
      const n = parseInt(digits, 10);
      if (digits) { chips.forEach(c => c.classList.remove('active')); gcState.amount = isNaN(n) ? 0 : n; }
      else { gcState.amount = 0; }
      gcSyncCard();
    });
    if (toIn) toIn.addEventListener('input', () => { gcState.to = toIn.value.trim(); gcSyncCard(); });

    const addBtn = document.getElementById('gcAdd');
    addBtn && addBtn.addEventListener('click', () => {
      if (!gcState.amount || gcState.amount < 50000) {
        addBtn.classList.remove('gc-shake'); void addBtn.offsetWidth; addBtn.classList.add('gc-shake');
        return;
      }
      addGiftCard(gcState.amount, gcState.to, addBtn);
    });
    const back = document.getElementById('catBack');
    back && back.addEventListener('click', closeCategory);

    gcSyncCard();
    catShell.scrollTop = 0;
    catOverlay.scrollTop = 0;
    catOverlay.classList.add('open');
    catOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  /* ════════ Wiring · entradas desde la web ════════════════════ */

  // CTAs dentro del overlay "El arte de regalar"
  document.querySelectorAll('[data-sets]').forEach(a => {
    a.addEventListener('click', e => { e.preventDefault(); openSets(); });
  });
  document.querySelectorAll('[data-giftcard]').forEach(a => {
    a.addEventListener('click', e => { e.preventDefault(); openGiftCard(); });
  });

  // Exponer para el menú Regalos (lo enruta app.js → setupMega)
  window.openSets = openSets;
  window.openGiftCard = openGiftCard;

  // Refrescar el cajón para que el cross-sell aparezca de inmediato.
  try { if (typeof renderDrawer === 'function') renderDrawer(); } catch (e) {}
})();
