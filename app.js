/* ─────────────────────────────────────────────────────────────
   Preto by Dala&Co — Editorial interactions
   ───────────────────────────────────────────────────────────── */

const WA_NUMBER = '573226955451'; // Preto by Dala&Co · concierge

const CHAIN_SIZES = ['45 cm', '50 cm', '55 cm', '60 cm'];

const PRETO_CHAIN_VARIANTS = [
  { sub: 'Lazo Preto',     id: 'PRT-CH-LAZ', label: 'CHAIN · LAZO',     sizes: CHAIN_SIZES,
    blurb: 'Entrelazado fino de caída fluida. Brillo discreto, gesto urbano.' },
  { sub: 'Rústica Preto',  id: 'PRT-CH-RUS', label: 'CHAIN · RUSTIC',   sizes: CHAIN_SIZES,
    blurb: 'Eslabones forjados a mano. Textura cruda, presencia nocturna.' },
  { sub: 'Franco Preto',   id: 'PRT-CH-FRA', label: 'CHAIN · FRANCO',   sizes: CHAIN_SIZES,
    blurb: 'Eslabón franco compacto y uniforme. Línea continua, sólida.' },
  { sub: 'Singapur Preto', id: 'PRT-CH-SIN', label: 'CHAIN · SINGAPUR', sizes: CHAIN_SIZES,
    blurb: 'Eslabón singapur torsionado. Destellos vivos en cada movimiento.' },
];

const DALA_CHAIN_VARIANTS = [
  { sub: 'Lazo Dala&Co',     id: 'DAL-CH-LAZ', label: 'CHAIN · LAZO',     sizes: CHAIN_SIZES,
    blurb: 'Entrelazado delicado en oro 18k. Ligero, para uso cotidiano.' },
  { sub: 'Rústica Dala&Co',  id: 'DAL-CH-RUS', label: 'CHAIN · RUSTIC',   sizes: CHAIN_SIZES,
    blurb: 'Eslabones forjados a mano en oro 18k. Carácter ancestral.' },
  { sub: 'Franco Dala&Co',   id: 'DAL-CH-FRA', label: 'CHAIN · FRANCO',   sizes: CHAIN_SIZES,
    blurb: 'Eslabón franco pulido a espejo. Brillo limpio y permanente.' },
  { sub: 'Singapur Dala&Co', id: 'DAL-CH-SIN', label: 'CHAIN · SINGAPUR', sizes: CHAIN_SIZES,
    blurb: 'Eslabón singapur en oro 18k. Reflejos cálidos al moverse.' },
];

const PRETO_RING_NOTE  = 'Enviar talla al momento de la cotización.';
const DALA_RING_NOTE   = 'Enviar talla al momento de la cotización.';

const PRETO_RING_VARIANTS = [
  { sub: 'Liso',      id: 'PRT-RG-LIS', label: 'RING · SMOOTH BAND',  note: PRETO_RING_NOTE,
    blurb: 'Anillo de banda lisa. Silueta limpia, presencia silenciosa.' },
  { sub: 'Cubano',    id: 'PRT-RG-CUB', label: 'RING · CUBAN LINK',   note: PRETO_RING_NOTE,
    blurb: 'Eslabón cubano transformado en anillo. Firme, urbano.' },
  { sub: 'Rústico',   id: 'PRT-RG-RUS', label: 'RING · RUSTIC',       note: PRETO_RING_NOTE,
    blurb: 'Textura cruda, forjado a mano. Carácter ancestral.' },
  { sub: 'Religioso', id: 'PRT-RG-REL', label: 'RING · SACRA',        note: PRETO_RING_NOTE,
    blurb: 'Iconografía discreta. Devoción tallada en oro chocoano.' },
];

const DALA_RING_VARIANTS = [
  { sub: 'Liso',      id: 'DAL-RG-LIS', label: 'RING · SMOOTH BAND',  note: DALA_RING_NOTE,
    blurb: 'Banda lisa en oro 18k. La sencillez como lujo absoluto.' },
  { sub: 'Cubano',    id: 'DAL-RG-CUB', label: 'RING · CUBAN LINK',   note: DALA_RING_NOTE,
    blurb: 'Eslabón cubano clásico en oro 18k pulido a espejo.' },
  { sub: 'Rústico',   id: 'DAL-RG-RUS', label: 'RING · RUSTIC',       note: DALA_RING_NOTE,
    blurb: 'Forjado a mano. Cada anillo es una pieza irrepetible.' },
  { sub: 'Religioso', id: 'DAL-RG-REL', label: 'RING · SACRA',        note: DALA_RING_NOTE,
    blurb: 'Iconografía íntima. Una oración pequeña en oro 18k.' },
];

const LINES = [
  {
    key: 'preto',
    name: 'Preto',
    num: '— Línea I',
    tagline: 'Lo urbano hecho oro. Presencia, fuerza, identidad nocturna.',
    products: [
      { id: 'PRT-CH-001', name: 'Cadenas Preto', label: 'CHAIN · ONYX', size: 'c-1', variants: PRETO_CHAIN_VARIANTS, variantPrefix: 'Cadena', image: 'assets/preto-hero.jpg',
        desc: 'Cadena de cuentas en ónix negro y oro de Chocó, montada eslabón a eslabón. Una pieza de presencia nocturna, pensada para llevarse cerca de la piel.' },
      { id: 'PRT-RG-003', name: 'Anillos Preto',        label: 'RING · BLACK ZIRCON',  size: 'c-2', variants: PRETO_RING_VARIANTS, variantPrefix: 'Anillo Preto',
        desc: 'Anillos en oro con circón negro. Cuatro carácteres —liso, cubano, rústico y sacro— para una misma identidad urbana.' },
      { id: 'PRT-BR-007', name: 'Pulseras Hilo Preto',  label: 'BRACELET · CORD',      size: 'c-3',
        desc: 'Pulsera de hilo encerado con remates en oro. Discreta, resistente y pensada para acompañar el día a día sin perder elegancia.' },
      { id: 'PRT-EA-011', name: 'Pendientes Preto',     label: 'EARRINGS · ONYX',      size: 'c-4',
        desc: 'Pendientes en ónix y oro. Un punto de luz oscura que enmarca el rostro con sobriedad absoluta.' },
    ],
  },
  {
    key: 'dala',
    name: 'Dala&Co',
    num: '— Línea II',
    tagline: 'Sofisticación íntima. Piezas únicas que reflejan tu esencia.',
    products: [
      { id: 'DAL-CH-002', name: 'Cadenas Dala&Co',       label: 'CHAIN · 18k GOLD',    size: 'd-1', variants: DALA_CHAIN_VARIANTS, variantPrefix: 'Cadena',
        desc: 'Cadena en oro de 18k pulido a espejo. Eslabón clásico de la casa, equilibrio perfecto entre peso, brillo y permanencia.' },
      { id: 'DAL-RG-014', name: 'Anillos Dala&Co',       label: 'RING · 18k',          size: 'd-2', variants: DALA_RING_VARIANTS, variantPrefix: 'Anillo Dala&Co',
        desc: 'Anillos en oro de 18k. La sencillez como lujo absoluto, disponible en cuatro acabados irrepetibles.' },
      { id: 'DAL-BR-018', name: 'Pulseras Hilo Dala&Co', label: 'BRACELET · CORD',     size: 'd-3',
        desc: 'Pulsera de hilo con cierre en oro de 18k. Ligereza íntima que se adapta a la muñeca como una segunda piel.' },
      { id: 'DAL-EA-021', name: 'Pendientes Dala&Co',    label: 'EARRINGS · GOLD',     size: 'd-4',
        desc: 'Pendientes en oro de 18k. Una caricia de luz cálida, hecha para acompañar tanto el día como la noche.' },
      { id: 'DAL-PN-030', name: 'Bolígrafo Dala&Co',     label: 'PEN · SIGNATURE',     size: 'd-5',
        desc: 'Bolígrafo de firma con detalles en oro de 18k. El gesto de escribir convertido en objeto de joyería.' },
    ],
  },
];

// Flat lookup so the quote drawer still works by id.
// Includes top-level products and any variants drilled into.
const COLLECTIONS = LINES.flatMap(line => {
  const out = [];
  line.products.forEach(p => {
    const colLabel = `${line.name} · ${line.num.replace('— ', '')}`;
    out.push({ ...p, col: colLabel, line: line.key });
    if (p.variants) {
      const prefix = p.variantPrefix || p.name;
      p.variants.forEach(v => {
        out.push({
          id: v.id,
          name: `${prefix} ${v.sub}`,
          col: colLabel,
          label: v.label,
          line: line.key,
          parent: p.id,
          sizes: v.sizes,
          note: v.note,
        });
      });
    }
  });
  return out;
});

/* ── Build product carousel (one track, all pieces) ────────── */
const host = document.getElementById('collGrid');
const ALL_PRODUCTS = LINES.flatMap(line =>
  line.products.map(p => ({ ...p, lineName: line.name, lineKey: line.key }))
);

ALL_PRODUCTS.forEach((p) => {
  const el = document.createElement('article');
  el.className = 'pcard' + (p.variants ? ' has-variants' : '');
  el.id = 'card-' + p.id;
  el.setAttribute('data-screen-label', `${p.lineName} · ${p.name}`);
  if (p.variants) el.dataset.openCategory = p.id;

  const tag = p.variants
    ? `<span class="pcard-tag">${String(p.variants.length).padStart(2,'0')} variantes</span>`
    : '';
  const art = p.image
    ? `<div class="pcard-art has-image" style="background-image:url('${p.image}')"></div>`
    : `<div class="pcard-art" data-label="${p.label}"></div>`;

  el.innerHTML = `
    <div class="pcard-media">
      ${tag}
      <button class="pcard-fav" aria-label="Añadir a favoritos" data-id="${p.id}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 20.2 4.6 12.8a4.3 4.3 0 0 1 6.1-6.1l1.3 1.3 1.3-1.3a4.3 4.3 0 0 1 6.1 6.1Z"></path>
        </svg>
      </button>
      ${art}
    </div>
    <div class="pcard-info">
      <h3 class="pcard-name">${p.name}</h3>
      <p class="pcard-spec">${p.label}</p>
      <p class="pcard-cta">${p.variants ? 'Ver familia →' : 'Bajo cotización'}</p>
    </div>
  `;
  host.appendChild(el);
});

/* ── Carousel: navigation, drag, progress ──────────────────── */
(function initCarousel(){
  const track = host;
  const prev  = document.getElementById('carPrev');
  const next  = document.getElementById('carNext');
  const bar   = document.getElementById('carBar');
  if (!track) return;

  function page() {
    const card = track.querySelector('.pcard');
    if (!card) return track.clientWidth * 0.8;
    const gap = parseFloat(getComputedStyle(track).columnGap || '0') || 24;
    return card.offsetWidth + gap;
  }
  function updateBar() {
    const max = track.scrollWidth - track.clientWidth;
    const ratio = max > 0 ? track.scrollLeft / max : 0;
    const visible = track.clientWidth / track.scrollWidth;
    if (bar) {
      bar.style.width = Math.max(12, visible * 100) + '%';
      bar.style.left = ratio * (100 - Math.max(12, visible * 100)) + '%';
    }
    if (prev) prev.disabled = track.scrollLeft <= 2;
    if (next) next.disabled = track.scrollLeft >= max - 2;
  }
  prev && prev.addEventListener('click', () => track.scrollBy({ left: -page()*1.5, behavior: 'smooth' }));
  next && next.addEventListener('click', () => track.scrollBy({ left:  page()*1.5, behavior: 'smooth' }));
  let barTick = false;
  const onTrackScroll = () => {
    if (barTick) return;
    barTick = true;
    requestAnimationFrame(() => { updateBar(); barTick = false; });
  };
  track.addEventListener('scroll', onTrackScroll, { passive: true });
  window.addEventListener('resize', updateBar);

  // Drag to scroll (mouse only — touch uses native scroll)
  let down = false, startX = 0, startLeft = 0, moved = 0, dragging = false;
  track.addEventListener('pointerdown', e => {
    moved = 0; dragging = false;                 // always reset state
    if (e.pointerType !== 'mouse') { down = false; return; }
    down = true;
    startX = e.clientX; startLeft = track.scrollLeft;
  });
  window.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - startX;
    moved = Math.abs(dx);
    if (moved > 6 && !dragging) { dragging = true; track.classList.add('dragging'); }
    if (dragging) track.scrollLeft = startLeft - dx;
  });
  window.addEventListener('pointerup', () => {
    if (down) { down = false; if (dragging) track.classList.remove('dragging'); }
  });
  // Suppress click only when an actual drag happened
  track.addEventListener('click', e => { if (dragging || moved > 6) { e.stopPropagation(); e.preventDefault(); } }, true);

  updateBar();
})();

/* ── Carousel card interactions ────────────────────────────── */
document.querySelectorAll('.pcard').forEach(card => {
  card.addEventListener('click', e => {
    if (e.target.closest('.pcard-fav')) return;
    const id = card.id.replace('card-', '');
    if (card.classList.contains('has-variants')) openCategory(id);
    else openProduct(id);
  });
});
document.querySelectorAll('.pcard-fav').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    btn.classList.toggle('on');
  });
});

/* ── Product detail (enlarge + describe) ───────────────────── */
const pdp = document.getElementById('pdpOverlay');
function openProduct(id) {
  const p = COLLECTIONS.find(x => x.id === id);
  if (!p) return;

  const art = document.getElementById('pdpArt');
  if (p.image) {
    art.className = 'pdp-art has-image';
    art.style.backgroundImage = `url('${p.image}')`;
    art.removeAttribute('data-label');
  } else {
    art.className = 'pdp-art';
    art.style.backgroundImage = '';
    art.setAttribute('data-label', p.label);
  }

  document.getElementById('pdpRef').textContent = `Ref. ${p.id} · ${p.col}`;
  document.getElementById('pdpName').textContent = p.name;
  document.getElementById('pdpSpec').textContent = p.label;
  document.getElementById('pdpDesc').textContent = p.desc || '';

  // Variants
  const vWrap = document.getElementById('pdpVariants');
  if (p.variants) {
    vWrap.innerHTML = `
      <span class="pdp-vlabel">${String(p.variants.length).padStart(2,'0')} variantes</span>
      <div class="pdp-vchips">${p.variants.map(v => `<span class="pdp-vchip">${v.sub}</span>`).join('')}</div>`;
    vWrap.style.display = '';
  } else {
    vWrap.innerHTML = '';
    vWrap.style.display = 'none';
  }

  // Primary action
  const primary = document.getElementById('pdpPrimary');
  primary.textContent = p.variants ? 'Ver la familia completa' : 'Añadir a cotización';
  primary.onclick = () => {
    closeProduct();
    if (p.variants) openCategory(p.id);
    else addToQuote(p.id, null);
  };

  // WhatsApp action
  document.getElementById('pdpWa').onclick = () => {
    openWhatsApp([{ id: p.id, name: p.name, col: p.col, size: null, note: p.note || null, qty: 1 }]);
  };

  pdp.classList.add('open');
  pdp.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeProduct() {
  pdp.classList.remove('open');
  pdp.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
document.getElementById('pdpClose').addEventListener('click', closeProduct);
pdp.querySelectorAll('[data-pdp-close]').forEach(el => el.addEventListener('click', closeProduct));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && pdp.classList.contains('open')) closeProduct();
});

/* ── Line filter: Descubrir Preto / Dala&Co ────────────────── */
const blocks = () => document.querySelectorAll('.line-block');
const chips  = () => document.querySelectorAll('.line-filter .chip');
function applyFilter(line) {
  blocks().forEach(b => {
    const key = b.classList.contains('line-preto') ? 'preto' : 'dala';
    b.classList.toggle('is-hidden', line !== 'all' && key !== line);
  });
  chips().forEach(c => c.classList.toggle('active', c.dataset.filter === line));
}
function scrollToCollections() {
  const target = document.getElementById('collections');
  if (!target) return;
  const top = target.getBoundingClientRect().top + window.scrollY - 60;
  window.scrollTo({ top, behavior: 'smooth' });
}
chips().forEach(c => {
  c.addEventListener('click', () => applyFilter(c.dataset.filter));
});
document.querySelectorAll('.pane-cta[data-line]').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    applyFilter(a.dataset.line);
    scrollToCollections();
  });
});
// Default state
applyFilter('all');

/* ── Quote cart state (persisted) ──────────────────────────── */
const QKEY = 'preto.quote.v1';
let quote = JSON.parse(localStorage.getItem(QKEY) || '[]');
// Migrate older items that lack a composite key
quote.forEach(it => { if (!it.key) it.key = it.id; });

function saveQuote() {
  localStorage.setItem(QKEY, JSON.stringify(quote));
  renderCount();
  renderDrawer();
}
function renderCount() {
  const n = quote.reduce((s, q) => s + q.qty, 0);
  const el = document.getElementById('cartCount');
  el.textContent = n;
  el.style.background = n ? 'var(--gold)' : 'rgba(243,239,231,0.18)';
  el.style.color = n ? 'var(--onyx)' : 'rgba(243,239,231,0.7)';
}
function addToQuote(id, size) {
  const p = COLLECTIONS.find(x => x.id === id);
  if (!p) return;
  const key = size ? `${id}|${size}` : id;
  const existing = quote.find(x => x.key === key);
  if (existing) existing.qty += 1;
  else quote.push({ key, id, name: p.name, col: p.col, size: size || null, note: p.note || null, qty: 1 });
  saveQuote();
  openDrawer();
}
function setQty(key, delta) {
  const item = quote.find(x => x.key === key);
  if (!item) return;
  item.qty = Math.max(0, item.qty + delta);
  if (item.qty === 0) quote = quote.filter(x => x.key !== key);
  saveQuote();
}
function removeItem(key) {
  quote = quote.filter(x => x.key !== key);
  saveQuote();
}
function renderDrawer() {
  const c = document.getElementById('drawerItems');
  if (!quote.length) {
    c.innerHTML = `
      <div class="drawer-empty">
        <div class="glyph">Preto</div>
        <p>Su cotización está en silencio. Comience por elegir una pieza.</p>
      </div>`;
    return;
  }
  c.innerHTML = quote.map(item => `
    <div class="q-item">
      <div class="thumb"></div>
      <div class="info">
        <h6>${item.name}${item.size ? ` <span class="size-tag">· ${item.size}</span>` : ''}</h6>
        <div class="ref">Ref. ${item.id}${item.size ? ` · ${item.size}` : ''} · ${item.col}</div>
        ${item.note ? `<div class="q-note">${item.note}</div>` : ''}
        <div class="qty">
          <button data-act="dec" data-key="${item.key}">–</button>
          <span>${String(item.qty).padStart(2,'0')}</span>
          <button data-act="inc" data-key="${item.key}">+</button>
        </div>
      </div>
      <button class="remove" data-act="rm" data-key="${item.key}">Retirar</button>
    </div>
  `).join('');

  c.querySelectorAll('button[data-act]').forEach(b => {
    b.addEventListener('click', e => {
      const key = b.dataset.key, act = b.dataset.act;
      if (act === 'inc') setQty(key, +1);
      else if (act === 'dec') setQty(key, -1);
      else if (act === 'rm') removeItem(key);
    });
  });
}

/* ── Drawer open/close ─────────────────────────────────────── */
const drawer = document.getElementById('drawer');
const veil   = document.getElementById('veil');
function openDrawer() {
  drawer.classList.add('open');
  veil.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
}
function closeDrawer() {
  drawer.classList.remove('open');
  veil.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
}
document.getElementById('openCart').addEventListener('click', openDrawer);
document.getElementById('closeDrawer').addEventListener('click', closeDrawer);
veil.addEventListener('click', closeDrawer);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
document.getElementById('clearQuote').addEventListener('click', () => { quote = []; saveQuote(); });

/* ── Add / open-category buttons ───────────────────────────── */
document.querySelectorAll('.coll .add').forEach(b => {
  b.addEventListener('click', e => {
    e.stopPropagation();
    const card = b.closest('.coll');
    if (card.classList.contains('has-variants')) {
      openCategory(b.dataset.id);
      return;
    }
    const activeSize = card.querySelector('.size-chip.active');
    addToQuote(b.dataset.id, activeSize ? activeSize.dataset.size : null);
  });
});

/* ── Click anywhere on a category card to drill in ─────────── */
document.querySelectorAll('.coll.has-variants').forEach(card => {
  card.addEventListener('click', e => {
    if (e.target.closest('.size-chip') || e.target.closest('.add')) return;
    openCategory(card.dataset.openCategory);
  });
});

/* ── Category overlay (chain variants etc.) ────────────────── */
const catOverlay = document.getElementById('catOverlay');
const catShell   = document.getElementById('catShell');

function openCategory(productId) {
  const parent = COLLECTIONS.find(x => x.id === productId);
  if (!parent || !parent.variants) return;

  const words = parent.name.split(' ');
  const head = words.slice(0, -1).join(' ');
  const tail = words.slice(-1)[0];
  const prefix = parent.variantPrefix || parent.name;

  catShell.innerHTML = `
    <header class="cat-head">
      <button class="cat-back" id="catBack" aria-label="Volver">
        <span class="arr">←</span> Volver a colecciones
      </button>
      <div class="cat-meta">
        <span class="eyebrow">${parent.col}</span>
        <span class="dot-divider"></span>
        <span class="eyebrow eyebrow-bone">${parent.variants.length} variantes</span>
      </div>
      <h2 class="cat-title">${head} <span class="script">${tail}</span></h2>
      <p class="cat-sub">Cada pieza nace del mismo oro; cambia su carácter, su gesto, su silencio. Elija la familia que prefiera${parent.variants.some(v => v.sizes) ? ' y su medida exacta' : ''}.</p>
    </header>
    <div class="cat-grid">
      ${parent.variants.map(v => {
        const vWords = v.sub.split(' ');
        const vTail = vWords.slice(-1)[0];
        const vHead = vWords.slice(0, -1).join(' ');
        const optionsMarkup = v.sizes ? `
          <div class="size-row" data-product="${v.id}">
            <span class="size-label">Medida</span>
            ${v.sizes.map((s, idx) => `
              <button class="size-chip ${idx === 1 ? 'active' : ''}" data-size="${s}">${s}</button>
            `).join('')}
          </div>` : (v.note ? `
          <div class="var-note">
            <span class="note-glyph">✦</span>
            <span>${v.note}</span>
          </div>` : '');
        return `
          <article class="var-card" data-id="${v.id}">
            <div class="var-art${v.image ? ' has-image' : ''}" data-label="${v.label}"${v.image ? ` style="background-image:url('${v.image}')"` : ''}></div>
            <div class="var-body">
              <div class="var-name">
                <h3>${prefix} <span class="script">${v.sub}</span></h3>
                <span class="var-ref">Ref. ${v.id}</span>
              </div>
              <p class="var-blurb">${v.blurb}</p>
              ${optionsMarkup}
              <button class="var-add" data-id="${v.id}">
                <span>Añadir a cotización</span>
                <span class="arrow"></span>
              </button>
            </div>
          </article>`;
      }).join('')}
    </div>
  `;

  // Wire interactions inside the overlay
  catShell.querySelectorAll('.size-row').forEach(row => {
    row.addEventListener('click', e => {
      const chip = e.target.closest('.size-chip');
      if (!chip) return;
      row.querySelectorAll('.size-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });
  catShell.querySelectorAll('.var-add').forEach(b => {
    b.addEventListener('click', () => {
      const card = b.closest('.var-card');
      const activeSize = card.querySelector('.size-chip.active');
      addToQuote(b.dataset.id, activeSize ? activeSize.dataset.size : null);
    });
  });
  document.getElementById('catBack').addEventListener('click', closeCategory);

  catOverlay.classList.add('open');
  catOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeCategory() {
  catOverlay.classList.remove('open');
  catOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
catOverlay && catOverlay.addEventListener('click', e => {
  if (e.target === catOverlay) closeCategory();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && catOverlay && catOverlay.classList.contains('open')) closeCategory();
});

/* ── Size chip selection (per card) ────────────────────────── */
document.querySelectorAll('.size-row').forEach(row => {
  row.addEventListener('click', e => {
    const chip = e.target.closest('.size-chip');
    if (!chip) return;
    e.stopPropagation();
    row.querySelectorAll('.size-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
  });
});

/* ── WhatsApp message generation ───────────────────────────── */
function buildWaMessage(items) {
  const lines = [
    'Hola, estoy interesado en las siguientes piezas de Preto by Dala&Co:',
    ''
  ];
  if (!items.length) {
    lines.push('— Quisiera recibir una conversación con un asesor para descubrir la colección.');
  } else {
    items.forEach((it, i) => {
      const sizePart = it.size ? ` · ${it.size}` : '';
      lines.push(`${String(i+1).padStart(2,'0')}. ${it.name}${sizePart} (Ref. ${it.id}) — ${it.col} · ×${it.qty}`);
      if (it.note) lines.push(`    ↳ ${it.note}`);
    });
    lines.push('');
    lines.push('Quedo a la espera de una atención personalizada. Gracias.');
  }
  return lines.join('\n');
}
function openWhatsApp(items) {
  const msg = encodeURIComponent(buildWaMessage(items));
  window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank', 'noopener');
}
document.getElementById('sendWa').addEventListener('click', () => openWhatsApp(quote));
document.getElementById('waBtn').addEventListener('click', () => {
  if (quote.length) openDrawer();
  else openWhatsApp([]);
});

/* ── Nav: solid on scroll ──────────────────────────────────── */
const nav = document.getElementById('nav');
let navTick = false, navSolid = false;
const onScroll = () => {
  if (navTick) return;
  navTick = true;
  requestAnimationFrame(() => {
    const solid = window.scrollY > 80;
    if (solid !== navSolid) { navSolid = solid; nav.classList.toggle('solid', solid); }
    navTick = false;
  });
};
window.addEventListener('scroll', onScroll, { passive: true });
nav.classList.toggle('solid', window.scrollY > 80);
navSolid = window.scrollY > 80;

/* ── Reveal on scroll ──────────────────────────────────────── */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

document.querySelectorAll('.section-head, .split-pane > *, .coll, .heritage-grid, .atelier-head, .step, .campaign-copy, .pull blockquote, .newsletter h3, .newsletter p')
  .forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 6) * 60}ms`;
    io.observe(el);
  });

/* ── Announcement bar dismiss ──────────────────────────────── */
const announceX = document.getElementById('announceX');
if (announceX) {
  if (localStorage.getItem('preto.announce.dismissed') === '1') {
    document.body.classList.add('no-announce');
  }
  announceX.addEventListener('click', () => {
    document.body.classList.add('no-announce');
    localStorage.setItem('preto.announce.dismissed', '1');
  });
}

/* ── Initial render ────────────────────────────────────────── */
renderCount();
renderDrawer();

/* ── Joyería mega menu ─────────────────────────────────────── */
const megaTrigger = document.getElementById('joyeriaTrigger');
const mega        = document.getElementById('joyeriaMega');
function openMega() {
  mega.classList.add('open');
  mega.setAttribute('aria-hidden', 'false');
  megaTrigger.setAttribute('aria-expanded', 'true');
}
function closeMega() {
  mega.classList.remove('open');
  mega.setAttribute('aria-hidden', 'true');
  megaTrigger.setAttribute('aria-expanded', 'false');
}
if (megaTrigger && mega) {
  megaTrigger.addEventListener('click', e => {
    e.stopPropagation();
    mega.classList.contains('open') ? closeMega() : openMega();
  });
  // Smooth-scroll to the chosen collection, then close
  mega.querySelectorAll('.mega-item').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      const id = item.getAttribute('href').slice(1);   // e.g. card-PRT-CH-001
      const card = document.getElementById(id);
      const productId = id.replace('card-', '');
      closeMega();
      if (card && card.classList.contains('has-variants')) {
        openCategory(productId);     // chains, rings → full catalog
      } else if (card) {
        openProduct(productId);      // single pieces → detail view
      }
    });
  });
  // Close on outside click / Escape
  document.addEventListener('click', e => {
    if (mega.classList.contains('open') &&
        !mega.contains(e.target) && e.target !== megaTrigger) closeMega();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mega.classList.contains('open')) closeMega();
  });
}
