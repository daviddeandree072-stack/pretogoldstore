/* ─────────────────────────────────────────────────────────────
   Preto by Dala&Co — Editorial interactions
   ───────────────────────────────────────────────────────────── */

const WA_NUMBER = '573226955451'; // Preto by Dala&Co · concierge

/* ════════ PRECIOS Y SEGURO ════════════════════════════════════
   Pon aquí el precio de cada pieza (solo números, sin puntos ni $).
   Las piezas que NO estén en esta lista salen como "Bajo cotización".
   El seguro se calcula como un % del subtotal (cámbialo abajo).      */
const INSURANCE_RATE = 0.02; // ← 2 %. Cambia por tu % real (ej. 0.03 = 3 %).
const PRICES = {
  // Regalos para bebé  (descomenta y pon el valor)
  // 'PRT-BB-AMU': 480000,   // Amuleto de Protección Preto
  // 'PRT-BB-RUS': 0,        // Pulsera Rústica Preto
  // 'PRT-BB-CUB': 620000,   // Cubana Preto
  // 'DAL-BB-AMU': 0,        // Amuleto de Protección Dala&Co
  // 'DAL-BB-RUS': 0,        // Pulsera Rústica Dala&Co
  // 'DAL-BB-CUB': 0,        // Cubana Dala&Co
};
function priceFor(id){ return (PRICES && PRICES[id] != null) ? PRICES[id] : null; }
function fmtCOP(n){ try { return '$' + Math.round(n).toLocaleString('es-CO'); } catch(e){ return '$' + Math.round(n); } }

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

const PRETO_EARRING_VARIANTS = [
  { sub: 'Topo Preto',     id: 'PRT-EA-TOP', label: 'EARRINGS · STUD',   note: 'Par de pendientes.',
    blurb: 'Topo en ónix negro y oro de Chocó. Un punto de luz oscura, discreto y permanente sobre el lóbulo.' },
  { sub: 'Argolla Preto',  id: 'PRT-EA-ARG', label: 'EARRINGS · HOOP',   note: 'Par de pendientes.',
    blurb: 'Argolla en oro chocoano con cuenta de ónix. Movimiento limpio que enmarca el rostro con sobriedad.' },
  { sub: 'Candonga Preto', id: 'PRT-EA-CAN', label: 'EARRINGS · HOOP XL', note: 'Par de pendientes.',
    blurb: 'Candonga de mayor diámetro en oro de Chocó. Presencia nocturna que se impone sin perder elegancia.' },
  { sub: 'Colgante Preto', id: 'PRT-EA-COL', label: 'EARRINGS · DROP',   note: 'Par de pendientes.',
    blurb: 'Pendiente colgante de ónix y oro chocoano. Caída fluida que acompaña cada gesto con luz oscura.' },
];

const DALA_EARRING_VARIANTS = [
  { sub: 'Topo Dala&Co',     id: 'DAL-EA-TOP', label: 'EARRINGS · STUD',   note: 'Par de pendientes.',
    blurb: 'Topo en oro de 18k pulido. Una caricia de luz cálida, íntima y para siempre sobre el lóbulo.' },
  { sub: 'Argolla Dala&Co',  id: 'DAL-EA-ARG', label: 'EARRINGS · HOOP',   note: 'Par de pendientes.',
    blurb: 'Argolla en oro de 18k de caída ligera. Brillo limpio que ilumina el rostro de día y de noche.' },
  { sub: 'Candonga Dala&Co', id: 'DAL-EA-CAN', label: 'EARRINGS · HOOP XL', note: 'Par de pendientes.',
    blurb: 'Candonga de mayor diámetro en oro de 18k. Volumen cálido y presencia luminosa sin recargar.' },
  { sub: 'Colgante Dala&Co', id: 'DAL-EA-COL', label: 'EARRINGS · DROP',   note: 'Par de pendientes.',
    blurb: 'Pendiente colgante en oro de 18k. Movimiento delicado de luz cálida que acompaña cada gesto.' },
];

const ROSARY_SIZES = ['50 cm', '55 cm', '60 cm', '65 cm'];

const PRETO_ROSARY_VARIANTS = [
  { sub: 'Clásico Preto',    id: 'PRT-RO-CLA', label: 'ROSARY · CLASSIC', sizes: ROSARY_SIZES, image: 'assets/rosario-clasico-preto.jpg',
    blurb: 'Cinco decenas en ónix negro y oro de Chocó, rematadas en crucifijo tallado a mano. La pieza devocional por excelencia de la casa.' },
  { sub: 'Decenario Preto',  id: 'PRT-RO-DEC', label: 'ROSARY · DECADE',  sizes: ROSARY_SIZES,
    blurb: 'Una sola decena en ónix y oro. Oración discreta para llevar en el bolsillo o enrollada en la muñeca.' },
  { sub: 'Cuello Preto',     id: 'PRT-RO-CUE', label: 'ROSARY · COLLAR',  sizes: ROSARY_SIZES,
    blurb: 'Rosario de caída corta, pensado para lucirse al cuello. Presencia nocturna y silencio espiritual.' },
  { sub: 'Cruz Mayor Preto', id: 'PRT-RO-CRU', label: 'ROSARY · CROSS',   sizes: ['60 cm'], image: 'assets/rosario-cruz-mayor-preto.jpg',
    blurb: 'Elaborado en oro chocoano según el estilo artesanal del Chocó, donde cada cuenta honra el oficio de quienes lo trabajan. Más que una joya, es la presencia y el valor del oro chocoano hecho devoción cotidiana sobre quien lo viste.' },
];

const DALA_ROSARY_VARIANTS = [
  { sub: 'Clásico Dala&Co',    id: 'DAL-RO-CLA', label: 'ROSARY · CLASSIC', sizes: ROSARY_SIZES,
    blurb: 'Cinco decenas en oro de 18k pulido, con crucifijo de la casa. Una oración hecha herencia.' },
  { sub: 'Decenario Dala&Co',  id: 'DAL-RO-DEC', label: 'ROSARY · DECADE',  sizes: ROSARY_SIZES,
    blurb: 'Decena única en oro de 18k. Íntimo, ligero, para llevar siempre cerca.' },
  { sub: 'Cuello Dala&Co',     id: 'DAL-RO-CUE', label: 'ROSARY · COLLAR',  sizes: ROSARY_SIZES,
    blurb: 'Rosario corto en oro de 18k, de caída delicada sobre la piel.' },
  { sub: 'Cruz Mayor Dala&Co', id: 'DAL-RO-CRU', label: 'ROSARY · CROSS',   sizes: ROSARY_SIZES,
    blurb: 'Crucifijo destacado en oro de 18k sobre cuentas torneadas. Sobriedad y luz cálida.' },
];

const PEN_ENGRAVE_NOTE = 'Grabado de iniciales o fecha a solicitud.';

const DALA_PEN_VARIANTS = [
  { sub: 'Clásico Dala&Co', id: 'DAL-PN-CLA', label: 'PEN · SIGNATURE',
    blurb: 'Cuerpo en oro de 18k pulido a espejo, con clip firmado por la casa. El gesto de escribir hecho joya.' },
  { sub: 'Lacado Dala&Co',  id: 'DAL-PN-LAC', label: 'PEN · LACQUER',
    blurb: 'Laca negra profunda con remates en oro de 18k. Contraste sobrio para el escritorio o el bolsillo.' },
  { sub: 'Grabado Dala&Co', id: 'DAL-PN-GRA', label: 'PEN · ENGRAVED', note: PEN_ENGRAVE_NOTE,
    blurb: 'Personalice el cuerpo con sus iniciales o una fecha, grabadas a mano sobre el oro de 18k.' },
  { sub: 'Madera Dala&Co',  id: 'DAL-PN-MAD', label: 'PEN · WOOD',
    blurb: 'Cuerpo en madera noble del Atrato con remates en oro de 18k. Pieza artesanal, cálida al tacto.' },
];

const NOIR_ENGRAVE_NOTE = 'Grabado de iniciales o monograma a solicitud.';

const NOIR_BARRA_VARIANTS = [
  { sub: 'Lisa Noir',    id: 'ACC-BA-LIS', label: 'TIE BAR · SMOOTH',
    blurb: 'Barra de corbata de línea limpia en acabado negro mate. Sujeción discreta, presencia precisa.' },
  { sub: 'Ónix Noir',    id: 'ACC-BA-ONX', label: 'TIE BAR · ONYX',
    blurb: 'Barra con incrustación de ónix negro y filo en oro. Un detalle nocturno sobre la corbata.' },
  { sub: 'Grabada Noir', id: 'ACC-BA-GRA', label: 'TIE BAR · ENGRAVED', note: NOIR_ENGRAVE_NOTE,
    blurb: 'Barra grabada a mano sobre acabado noir. Personalícela con sus iniciales o una fecha.' },
];

const NOIR_GEMELOS_VARIANTS = [
  { sub: 'Clásicos Noir',  id: 'ACC-GE-CLA', label: 'CUFFLINKS · CLASSIC',
    blurb: 'Gemelos de superficie pulida en acabado negro. El cierre perfecto para el puño.' },
  { sub: 'Ónix Noir',      id: 'ACC-GE-ONX', label: 'CUFFLINKS · ONYX',
    blurb: 'Gemelos con cabujón de ónix engastado en oro. Profundidad y elegancia sobria.' },
  { sub: 'Grabados Noir',  id: 'ACC-GE-GRA', label: 'CUFFLINKS · ENGRAVED', note: NOIR_ENGRAVE_NOTE,
    blurb: 'Gemelos personalizables con monograma grabado a mano sobre el acabado noir.' },
];

const NOIR_INSIGNIA_VARIANTS = [
  { sub: 'Clásica Noir', id: 'ACC-IN-CLA', label: 'LAPEL PIN · CLASSIC',
    blurb: 'Insignia de solapa de líneas mínimas en acabado noir. Un acento silencioso en la chaqueta.' },
  { sub: 'Sello Noir',   id: 'ACC-IN-SEL', label: 'LAPEL PIN · SEAL',
    blurb: 'Insignia tipo sello con relieve de la casa. Identidad llevada con discreción.' },
  { sub: 'Cruz Noir',    id: 'ACC-IN-CRU', label: 'LAPEL PIN · CROSS',
    blurb: 'Insignia con cruz tallada en oro sobre fondo noir. Devoción y sastrería en un mismo gesto.' },
];

const LINES = [
  {
    key: 'preto',
    name: 'Preto',
    num: '— Línea I',
    tagline: 'Lo urbano hecho oro. Presencia, fuerza, identidad nocturna.',
    products: [
      { id: 'PRT-CH-001', name: 'Cadenas Preto', label: 'CHAIN · ONYX', size: 'c-1', variants: PRETO_CHAIN_VARIANTS, variantPrefix: 'Cadena',
        desc: 'Cadena de cuentas en ónix negro y oro de Chocó, montada eslabón a eslabón. Una pieza de presencia nocturna, pensada para llevarse cerca de la piel.' },
      { id: 'PRT-RO-005', name: 'Rosarios Preto',       label: 'ROSARY · ONYX',        size: 'c-5', variants: PRETO_ROSARY_VARIANTS, variantPrefix: 'Rosario', image: 'assets/preto-hero.jpg',
        desc: 'Rosario en ónix negro y oro de Chocó, rematado con un crucifijo tallado a mano. Devoción y presencia en una sola pieza, pensada para llevarse cerca del pecho.' },
      { id: 'PRT-RG-003', name: 'Anillos Preto',        label: 'RING · BLACK ZIRCON',  size: 'c-2', variants: PRETO_RING_VARIANTS, variantPrefix: 'Anillo Preto',
        desc: 'Anillos en oro con circón negro. Cuatro carácteres —liso, cubano, rústico y sacro— para una misma identidad urbana.' },
      { id: 'PRT-BR-007', name: 'Pulseras Hilo Preto',  label: 'BRACELET · CORD',      size: 'c-3',
        desc: 'Pulsera de hilo encerado con remates en oro. Discreta, resistente y pensada para acompañar el día a día sin perder elegancia.' },
      { id: 'PRT-EA-011', name: 'Pendientes Preto',     label: 'EARRINGS · ONYX',      size: 'c-4', variants: PRETO_EARRING_VARIANTS, variantPrefix: 'Pendiente',
        desc: 'Pendientes en ónix negro y oro de Chocó. Un punto de luz oscura que enmarca el rostro con sobriedad absoluta, en cuatro estilos de autor.' },
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
      { id: 'DAL-RO-025', name: 'Rosarios Dala&Co',      label: 'ROSARY · 18k GOLD',   size: 'd-6', variants: DALA_ROSARY_VARIANTS, variantPrefix: 'Rosario',
        desc: 'Rosario en oro de 18k pulido, con cuentas torneadas y crucifijo de la casa. Una oración hecha joya, para conservar como herencia.' },
      { id: 'DAL-RG-014', name: 'Anillos Dala&Co',       label: 'RING · 18k',          size: 'd-2', variants: DALA_RING_VARIANTS, variantPrefix: 'Anillo Dala&Co',
        desc: 'Anillos en oro de 18k. La sencillez como lujo absoluto, disponible en cuatro acabados irrepetibles.' },
      { id: 'DAL-BR-018', name: 'Pulseras Hilo Dala&Co', label: 'BRACELET · CORD',     size: 'd-3',
        desc: 'Pulsera de hilo con cierre en oro de 18k. Ligereza íntima que se adapta a la muñeca como una segunda piel.' },
      { id: 'DAL-EA-021', name: 'Pendientes Dala&Co',    label: 'EARRINGS · GOLD',     size: 'd-4', variants: DALA_EARRING_VARIANTS, variantPrefix: 'Pendiente',
        desc: 'Pendientes en oro de 18k. Una caricia de luz cálida, hecha para acompañar el día y la noche, en cuatro estilos de autor.' },
    ],
  },
];

// Accesorios — objetos de la casa (fuera de joyería, su propio menú).
const ACCESORIOS = [
  {
    key: 'accesorios',
    name: 'Dala&Co',
    num: '— Accesorios',
    tagline: 'Accesorios de alta gama para completar el look.',
    products: [
      { id: 'DAL-PN-030', name: 'Bolígrafo Dala&Co', label: 'PEN · SIGNATURE', variants: DALA_PEN_VARIANTS, variantPrefix: 'Bolígrafo',
        desc: 'Bolígrafo de firma con detalles en oro de 18k. El gesto de escribir convertido en objeto de joyería, en cuatro acabados de autor.' },
    ],
  },
  {
    key: 'noir',
    name: 'Noir',
    num: '— Accesorios',
    tagline: 'La diferencia está en los detalles. Sastrería en acabado noir.',
    products: [
      { id: 'ACC-BA-001', name: 'Barra Noir',    label: 'TIE BAR · NOIR',    variants: NOIR_BARRA_VARIANTS,    variantPrefix: 'Barra',
        desc: 'Barra de corbata en acabado noir, con filo en oro. El detalle que ordena la silueta formal, en tres caracteres.' },
      { id: 'ACC-GE-001', name: 'Gemelos Noir',  label: 'CUFFLINKS · NOIR',  variants: NOIR_GEMELOS_VARIANTS,  variantPrefix: 'Gemelos',
        desc: 'Gemelos en acabado noir y oro. El cierre del puño convertido en firma personal, en tres acabados.' },
      { id: 'ACC-IN-001', name: 'Insignia Noir', label: 'LAPEL PIN · NOIR',  variants: NOIR_INSIGNIA_VARIANTS, variantPrefix: 'Insignia',
        desc: 'Insignia de solapa en acabado noir y oro. Un acento discreto que distingue la chaqueta, en tres motivos.' },
    ],
  },
];

// Flat lookup so the quote drawer still works by id.
// Includes top-level products and any variants drilled into.
const COLLECTIONS = [...LINES, ...ACCESORIOS].flatMap(line => {
  const out = [];
  line.products.forEach(p => {
    const colLabel = `${line.name} · ${line.num.replace('— ', '')}`;
    out.push({ ...p, col: colLabel, line: line.key });
    if (p.variants) {
      const prefix = p.variantPrefix || p.name;
      p.variants.forEach((v, vi) => {
        out.push({
          id: v.id,
          name: `${prefix} ${v.sub}`,
          col: colLabel,
          label: v.label,
          line: line.key,
          parent: p.id,
          sizes: v.sizes,
          note: v.note,
          desc: v.blurb,
          image: (vi === 0 ? p.image : null) || null,
        });
      });
    }
  });
  return out;
});

/* ── Build product catalog (flat variety of individual pieces) ──
   Like a general mini-catalog: each card is one named product
   (a single ring, a single chain…), not a category family.        */
const host = document.getElementById('collGrid');

// Expand one line into individual products. Variant families are
// broken out into one card per variant; round-robin across families
// so categories interleave (chain, ring, bracelet…) instead of
// clustering four near-identical rings together.
function expandLine(line) {
  const cols = line.products.map(p => {
    if (!p.variants) {
      return [{
        id: p.id, name: p.name, label: p.label, image: p.image || null,
        desc: p.desc, sizes: null, note: null,
        lineName: line.name, lineKey: line.key,
      }];
    }
    const prefix = p.variantPrefix || p.name;
    return p.variants.map((v, i) => ({
      id: v.id,
      name: `${prefix} ${v.sub}`,
      label: v.label,
      image: (i === 0 ? p.image : null) || null,
      desc: v.blurb,
      sizes: v.sizes || null,
      note: v.note || null,
      lineName: line.name,
      lineKey: line.key,
    }));
  });
  const out = [];
  const max = Math.max(...cols.map(c => c.length));
  for (let r = 0; r < max; r++) cols.forEach(c => { if (c[r]) out.push(c[r]); });
  return out;
}

// Alternate Preto / Dala&Co pieces so the row reads as a varied catalog.
function zipLines(a, b) {
  const out = []; const n = Math.max(a.length, b.length);
  for (let i = 0; i < n; i++) { if (a[i]) out.push(a[i]); if (b[i]) out.push(b[i]); }
  return out;
}

const CATALOG = zipLines(expandLine(LINES[0]), expandLine(LINES[1]));
const NEW_IDS = new Set(['PRT-CH-LAZ', 'DAL-CH-LAZ']);

/* Destacados: 7 piezas al azar, reordenadas en cada visita. */
function shuffleArr(arr){
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; }
  return a;
}
const FEATURED = shuffleArr(CATALOG).slice(0, 7);

function makePcard(p, clone) {
  const el = document.createElement('article');
  el.className = 'pcard';
  el.dataset.pid = p.id;
  if (clone) { el.setAttribute('aria-hidden', 'true'); el.tabIndex = -1; }
  else { el.id = 'card-' + p.id; el.setAttribute('data-screen-label', `${p.lineName} · ${p.name}`); }

  const tag = NEW_IDS.has(p.id) ? `<span class="pcard-tag">Nuevo</span>` : '';
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
      <p class="pcard-cta">Bajo cotización</p>
    </div>
  `;
  host.appendChild(el);
}
// Dos juegos idénticos de las 7 piezas → cinta infinita sin costuras.
FEATURED.forEach((p) => makePcard(p, false));
FEATURED.forEach((p) => makePcard(p, true));

/* ── Carousel: navigation, drag, progress ──────────────────── */
(function initCarousel(){
  const track = host;
  const prev  = document.getElementById('carPrev');
  const next  = document.getElementById('carNext');
  if (!track) return;

  // Controls that don't apply to an always-gliding marquee.
  if (prev) prev.style.display = 'none';
  if (next) next.style.display = 'none';
  const prog = document.querySelector('.carousel-progress');
  if (prog) prog.style.display = 'none';

  // ── Continuous marquee: constant, perfectly smooth glide ───────
  // Two identical card sets sit in the DOM, so wrapping by exactly one
  // set width loops seamlessly. We drive a float transform (subpixel,
  // GPU-composited) instead of scrollLeft — scrollLeft snaps to whole
  // pixels and that integer rounding is what made it look paused.
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cards = Array.prototype.slice.call(track.querySelectorAll('.pcard'));
  const half  = Math.floor(cards.length / 2);
  let loopW = 0;
  function measureLoop(){
    loopW = (cards[half] && cards[0]) ? (cards[half].offsetLeft - cards[0].offsetLeft) : 0;
  }
  measureLoop();
  window.addEventListener('resize', measureLoop);
  window.addEventListener('load', measureLoop);
  setTimeout(measureLoop, 500);

  const SPEED = 0.42;            // px/frame — constant, premium glide, never pauses
  let offset = 0;
  function marquee(){
    if (!reduceMotion && loopW > 0 && !document.hidden) {
      offset -= SPEED;
      if (offset <= -loopW) offset += loopW;     // seamless wrap
      track.style.transform = 'translate3d(' + offset + 'px,0,0)';
    }
    requestAnimationFrame(marquee);
  }
  requestAnimationFrame(marquee);
})();

/* ── Carousel card interactions ────────────────────────────── */
document.querySelectorAll('.pcard').forEach(card => {
  card.addEventListener('click', e => {
    if (e.target.closest('.pcard-fav')) return;
    openProduct(card.dataset.pid || card.id.replace('card-', ''));
  });
});
document.querySelectorAll('.pcard-fav').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    if (window.PretoFav) window.PretoFav.toggle(btn.dataset.id, btn);
    else btn.classList.toggle('on');
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

  // Variants / size / note
  const vWrap = document.getElementById('pdpVariants');
  let selectedSize = null;
  if (p.variants) {
    vWrap.innerHTML = `
      <span class="pdp-vlabel">${String(p.variants.length).padStart(2,'0')} variantes</span>
      <div class="pdp-vchips">${p.variants.map(v => `<span class="pdp-vchip">${v.sub}</span>`).join('')}</div>`;
    vWrap.style.display = '';
  } else if (p.sizes && p.sizes.length) {
    const def = Math.min(1, p.sizes.length - 1);
    selectedSize = p.sizes[def];
    vWrap.innerHTML = `
      <span class="pdp-vlabel">Medida</span>
      <div class="pdp-size-row">${p.sizes.map((s, i) =>
        `<button class="pdp-size-chip${i === def ? ' active' : ''}" data-size="${s}">${s}</button>`).join('')}</div>`;
    vWrap.style.display = '';
    vWrap.querySelectorAll('.pdp-size-chip').forEach(b => {
      b.addEventListener('click', () => {
        vWrap.querySelectorAll('.pdp-size-chip').forEach(c => c.classList.remove('active'));
        b.classList.add('active');
        selectedSize = b.dataset.size;
      });
    });
  } else if (p.note) {
    vWrap.innerHTML = `
      <span class="pdp-vlabel">Medida</span>
      <p class="pdp-note"><span class="note-glyph">✦</span> ${p.note}</p>`;
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
    const btn = primary;
    if (p.variants) openCategory(p.id);
    else setTimeout(() => addToQuote(p.id, selectedSize, btn), 40);
  };

  // WhatsApp action
  document.getElementById('pdpWa').onclick = () => {
    openWhatsApp([{ id: p.id, name: p.name, col: p.col, size: selectedSize, note: p.note || null, qty: 1 }]);
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
    openLine(a.dataset.line);
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
function addToQuote(id, size, sourceEl) {
  let p = COLLECTIONS.find(x => x.id === id);
  if (!p && typeof GIFT_EDITS !== 'undefined') {
    for (const k in GIFT_EDITS) {
      const its = GIFT_EDITS[k].items;
      if (its) { const f = its.find(x => x.id === id); if (f) { p = f; break; } }
    }
  }
  if (!p) return;
  const col = p.col || (id.indexOf('PRT') === 0 ? 'Preto' : id.indexOf('DAL') === 0 ? 'Dala&Co' : '');
  const key = size ? `${id}|${size}` : id;
  const existing = quote.find(x => x.key === key);
  const wasExisting = !!existing;
  if (existing) existing.qty += 1;
  else quote.push({ key, id, name: p.name, col, size: size || null, note: p.note || null, desc: p.desc || null, price: priceFor(id), qty: 1 });
  const qtyNow = (existing ? existing.qty : 1);
  saveQuote();
  triggerAddFeedback(p, size, qtyNow, wasExisting, sourceEl);
  // Drawer opens after the fly-to-cart animation reads (≈600ms)
  setTimeout(openDrawer, sourceEl ? 620 : 0);
}

/* ── Add-to-bag visual feedback ────────────────────────────── */
let _bagToastTimer = null;
function triggerAddFeedback(p, size, qtyNow, wasExisting, sourceEl) {
  const cartBtn = document.getElementById('openCart');
  if (!cartBtn) return;

  // 1) Briefly disable the source button to block double-clicks
  if (sourceEl) {
    const prevOpacity = sourceEl.style.opacity;
    const prevPe = sourceEl.style.pointerEvents;
    sourceEl.style.pointerEvents = 'none';
    sourceEl.style.opacity = '0.55';
    sourceEl.style.transition = 'opacity .25s ease';
    setTimeout(() => {
      sourceEl.style.pointerEvents = prevPe;
      sourceEl.style.opacity = prevOpacity;
    }, 950);

    // 2) Fly-to-cart gold dot
    const src = sourceEl.getBoundingClientRect();
    const dst = cartBtn.getBoundingClientRect();
    const sx = src.left + src.width / 2;
    const sy = src.top + src.height / 2;
    const dx = dst.left + dst.width / 2;
    const dy = dst.top + dst.height / 2;
    const dot = document.createElement('div');
    dot.className = 'fly-dot';
    dot.style.left = sx + 'px';
    dot.style.top = sy + 'px';
    document.body.appendChild(dot);
    // force layout, then animate
    void dot.offsetWidth;
    dot.style.transition = 'left .58s cubic-bezier(.42,.08,.55,1), top .58s cubic-bezier(.55,-.18,.5,1), opacity .25s ease .42s, transform .3s ease .4s';
    dot.style.left = dx + 'px';
    dot.style.top = dy + 'px';
    setTimeout(() => {
      dot.style.opacity = '0';
      dot.style.transform = 'translate(-50%, -50%) scale(0.35)';
    }, 470);
    setTimeout(() => dot.remove(), 820);
  }

  // 3) Cart bounce + gold ring pulse — slight delay so the dot "lands"
  const cartHit = () => {
    cartBtn.classList.remove('bag-bounce');
    void cartBtn.offsetWidth;
    cartBtn.classList.add('bag-bounce');
    const ring = document.createElement('span');
    ring.className = 'bag-ring go';
    cartBtn.appendChild(ring);
    setTimeout(() => ring.remove(), 720);
  };
  if (sourceEl) setTimeout(cartHit, 500); else cartHit();

  // 4) Toast — explicit messaging, extra clarity for repeats
  showBagToast(p, size, qtyNow, wasExisting, !!sourceEl);
}

function showBagToast(p, size, qtyNow, wasExisting, hasSource) {
  let t = document.getElementById('bagToast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'bagToast';
    t.className = 'bag-toast';
    t.setAttribute('role', 'status');
    t.setAttribute('aria-live', 'polite');
    document.body.appendChild(t);
    t.addEventListener('click', e => {
      if (e.target.closest('.bag-toast-close')) {
        t.classList.remove('show');
        return;
      }
      if (e.target.closest('.bag-toast-cta')) {
        openDrawer();
        t.classList.remove('show');
      }
    });
  }
  const totalInBag = quote.reduce((s, q) => s + q.qty, 0);
  const eyebrow = wasExisting ? 'Ya estaba en su bolsa' : 'Añadido a su bolsa';
  const name = (p.name || 'Pieza') + (size ? ` · ${size}` : '');
  const meta = wasExisting
    ? `Ahora tiene <b>${qtyNow}</b> unidades de esta pieza · ${totalInBag} en total`
    : `Tiene <b>${totalInBag}</b> ${totalInBag === 1 ? 'pieza' : 'piezas'} en su bolsa`;
  t.dataset.kind = wasExisting ? 'repeat' : 'new';
  t.innerHTML = `
    <div class="bag-toast-check">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8.2l3.4 3.4L13 5"></path></svg>
    </div>
    <div class="bag-toast-text">
      <strong>${eyebrow}</strong>
      <span class="name">${name}</span>
      <span class="meta">${meta}</span>
    </div>
    <button class="bag-toast-close" aria-label="Cerrar">×</button>`;
  setTimeout(() => t.classList.add('show'), hasSource ? 450 : 40);
  if (_bagToastTimer) clearTimeout(_bagToastTimer);
  _bagToastTimer = setTimeout(() => t.classList.remove('show'), wasExisting ? 4200 : 3000);
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
    addToQuote(b.dataset.id, activeSize ? activeSize.dataset.size : null, b);
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

/* ── Line overview: "Descubrir Preto / Dala&Co" → what the line offers ── */
function openLine(lineKey) {
  const line = LINES.find(l => l.key === lineKey);
  if (!line) return;

  catShell.innerHTML = `
    <header class="cat-head">
      <button class="cat-back" id="catBack" aria-label="Volver">
        <span class="arr">←</span> Volver
      </button>
      <div class="cat-meta">
        <span class="eyebrow">${line.num.replace('— ', '')}</span>
        <span class="dot-divider"></span>
        <span class="eyebrow eyebrow-bone">${line.products.length} familias</span>
      </div>
      <h2 class="cat-title">Descubrir <span class="script">${line.name}</span></h2>
      <p class="cat-sub">${line.tagline}</p>
    </header>
    <div class="cat-grid">
      ${line.products.map(p => {
        const hasVar = !!p.variants;
        return `
          <article class="var-card line-card" data-id="${p.id}">
            <div class="var-art${p.image ? ' has-image' : ''}" data-label="${p.label}"${p.image ? ` style="background-image:url('${p.image}')"` : ''}></div>
            <div class="var-body">
              <div class="var-name">
                <h3>${p.name}</h3>
                <span class="var-ref">Ref. ${p.id}</span>
              </div>
              <p class="var-blurb">${p.desc}</p>
              <button class="var-add line-go" data-id="${p.id}">
                <span>${hasVar ? 'Ver variantes' : 'Ver pieza'}</span>
                <span class="arrow"></span>
              </button>
            </div>
          </article>`;
      }).join('')}
    </div>
  `;

  const goTo = (id) => {
    const prod = COLLECTIONS.find(x => x.id === id);
    if (prod && prod.variants) openCategory(id, lineKey);
    else openProduct(id);
  };
  catShell.querySelectorAll('.line-card').forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('.line-go')) return;
      goTo(card.dataset.id);
    });
  });
  catShell.querySelectorAll('.line-go').forEach(b => {
    b.addEventListener('click', e => { e.stopPropagation(); goTo(b.dataset.id); });
  });
  document.getElementById('catBack').addEventListener('click', closeCategory);

  catShell.scrollTop = 0;
  catOverlay.scrollTop = 0;
  catOverlay.classList.add('open');
  catOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function openCategory(productId, backToLine) {
  const parent = COLLECTIONS.find(x => x.id === productId);
  if (!parent || !parent.variants) return;

  const words = parent.name.split(' ');
  const head = words.slice(0, -1).join(' ');
  const tail = words.slice(-1)[0];
  const prefix = parent.variantPrefix || parent.name;

  catShell.innerHTML = `
    <header class="cat-head">
      <button class="cat-back" id="catBack" aria-label="Volver">
        <span class="arr">←</span> ${backToLine ? 'Volver a ' + (LINES.find(l => l.key === backToLine) || {}).name : 'Volver a colecciones'}
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
      addToQuote(b.dataset.id, activeSize ? activeSize.dataset.size : null, b);
    });
  });
  document.getElementById('catBack').addEventListener('click', backToLine ? () => openLine(backToLine) : closeCategory);

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

/* ── Regalos · El arte de regalar (full-screen overlay) ────── */
const regalosOverlay = document.getElementById('regalosOverlay');
function openRegalos() {
  if (!regalosOverlay) return;
  regalosOverlay.classList.add('open');
  regalosOverlay.setAttribute('aria-hidden', 'false');
  regalosOverlay.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
  document.body.style.overflow = 'hidden';
  regalosOverlay.scrollTop = 0;
}
function closeRegalos() {
  if (!regalosOverlay) return;
  regalosOverlay.classList.remove('open');
  regalosOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
const regalosCloseBtn = document.getElementById('regalosClose');
regalosCloseBtn && regalosCloseBtn.addEventListener('click', closeRegalos);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && regalosOverlay && regalosOverlay.classList.contains('open')) closeRegalos();
});

/* ── Preto Maison (full-screen overlay) ────────────────────── */
const maisonOverlay = document.getElementById('maisonOverlay');
function openMaison(targetId) {
  if (!maisonOverlay) return;
  maisonOverlay.classList.add('open');
  maisonOverlay.setAttribute('aria-hidden', 'false');
  maisonOverlay.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
  document.body.style.overflow = 'hidden';
  const sub = targetId && maisonOverlay.querySelector(targetId);
  if (sub) {
    requestAnimationFrame(() => {
      maisonOverlay.scrollTop = sub.offsetTop - 40;
    });
  } else {
    maisonOverlay.scrollTop = 0;
  }
}
function closeMaison() {
  if (!maisonOverlay) return;
  maisonOverlay.classList.remove('open');
  maisonOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
const maisonCloseBtn = document.getElementById('maisonClose');
maisonCloseBtn && maisonCloseBtn.addEventListener('click', closeMaison);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && maisonOverlay && maisonOverlay.classList.contains('open')) closeMaison();
});

/* ── Nuestra historia (full-screen overlay) ────────────────── */
const historiaOverlay = document.getElementById('historiaOverlay');
function openHistoria() {
  if (!historiaOverlay) return;
  historiaOverlay.classList.add('open');
  historiaOverlay.setAttribute('aria-hidden', 'false');
  historiaOverlay.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
  document.body.style.overflow = 'hidden';
  historiaOverlay.scrollTop = 0;
}
function closeHistoria() {
  if (!historiaOverlay) return;
  historiaOverlay.classList.remove('open');
  historiaOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
const historiaCloseBtn = document.getElementById('historiaClose');
historiaCloseBtn && historiaCloseBtn.addEventListener('click', closeHistoria);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && historiaOverlay && historiaOverlay.classList.contains('open')) closeHistoria();
});

/* ── Page transition loader (handwritten Preto) ────────────── */
const pageTransition = document.getElementById('pageTransition');
let ptTimers = [];
function playTransition(action) {
  if (!pageTransition) { if (action) action(); return; }
  ptTimers.forEach(clearTimeout); ptTimers = [];
  // restart animations
  pageTransition.classList.remove('out');
  void pageTransition.offsetWidth;
  pageTransition.classList.add('active');
  pageTransition.setAttribute('aria-hidden', 'false');
  // run the actual navigation while the screen is fully opaque
  ptTimers.push(setTimeout(() => { if (action) action(); }, 1150));
  // lift the screen to reveal the destination
  ptTimers.push(setTimeout(() => { pageTransition.classList.add('out'); }, 1620));
  ptTimers.push(setTimeout(() => {
    pageTransition.classList.remove('active', 'out');
    pageTransition.setAttribute('aria-hidden', 'true');
  }, 2200));
}

/* ── Gift selections (Regalos para él / ella) ──────────────────
   Curated edits drawn from the existing catalog. Reuses the
   category overlay shell + var-card markup so it matches.        */
const GIFT_EDITS = {
  el: {
    eyebrow: 'Regalos · Para él',
    title: ['Regalos para', 'él'],
    sub: 'Una selección de la casa para los hombres que llevan su identidad como herencia: oro, sastrería y devoción.',
    ids: ['PRT-CH-RUS', 'DAL-RG-CUB', 'ACC-GE-ONX', 'DAL-PN-CLA', 'PRT-RO-CUE', 'ACC-BA-ONX'],
  },
  ella: {
    eyebrow: 'Regalos · Para ella',
    title: ['Regalos para', 'ella'],
    sub: 'Piezas pensadas para acompañar un nombre, una fecha, una historia. Luz cálida del oro chocoano sobre la piel.',
    ids: ['DAL-CH-LAZ', 'PRT-RG-REL', 'PRT-EA-011', 'DAL-RO-CLA', 'PRT-CH-SIN', 'DAL-BR-018'],
  },
  bebe: {
    eyebrow: 'Regalos · Para bebé',
    title: ['Regalos para', 'bebé'],
    sub: 'El primer oro de una vida. Amuletos y esclavas en talla mínima, pensados para proteger y acompañar al recién llegado a la casa.',
    items: [
      // — Preto (ónix y oro de Chocó, carácter nocturno) —
      { id: 'PRT-BB-AMU', name: 'Amuleto de Protección Preto', label: 'BABY · AMULET', sizes: ['10 cm', '11 cm', '12 cm'],
        desc: 'Azabache y oro de Chocó montados sobre cordón tejido a mano. El amuleto tradicional que cuida al recién nacido, en la versión nocturna de la casa.' },
      { id: 'PRT-BB-RUS', name: 'Pulsera Rústica Preto', label: 'BABY · RUSTIC', sizes: ['10 cm', '11 cm', '12 cm'],
        desc: 'Esclava de eslabones forjados a mano en talla de bebé. Oro de textura cruda, sólida y ligera para la primera muñeca.' },
      { id: 'PRT-BB-CUB', name: 'Cubana Preto', label: 'BABY · CUBAN', sizes: ['10 cm', '11 cm', '12 cm'],
        desc: 'Esclava de eslabón cubano reducida a escala infantil. La pieza urbana de la casa, pensada para las muñecas más pequeñas.' },
      // — Dala&Co (oro 18k, luz cálida y delicada) —
      { id: 'DAL-BB-AMU', name: 'Amuleto de Protección Dala&Co', label: 'BABY · AMULET', sizes: ['10 cm', '11 cm', '12 cm'],
        desc: 'Azabache y oro de 18k sobre cordón trenzado. Protección y luz cálida para acompañar los primeros días de vida.' },
      { id: 'DAL-BB-RUS', name: 'Pulsera Rústica Dala&Co', label: 'BABY · RUSTIC', sizes: ['10 cm', '11 cm', '12 cm'],
        desc: 'Esclava forjada a mano en oro de 18k, en talla de bebé. Textura artesanal, calidez heredada.' },
      { id: 'DAL-BB-CUB', name: 'Cubana Dala&Co', label: 'BABY · CUBAN', sizes: ['10 cm', '11 cm', '12 cm'],
        desc: 'Esclava de eslabón cubano en oro de 18k, escala infantil. Clásico pulido a espejo para una piel recién llegada.' },
    ],
  },
};

function openGiftEdit(which) {
  const edit = GIFT_EDITS[which];
  if (!edit) return;
  const items = edit.items
    ? edit.items
    : edit.ids.map(id => COLLECTIONS.find(x => x.id === id)).filter(Boolean);

  catShell.innerHTML = `
    <header class="cat-head">
      <button class="cat-back" id="catBack" aria-label="Volver">
        <span class="arr">←</span> Volver
      </button>
      <div class="cat-meta">
        <span class="eyebrow">${edit.eyebrow}</span>
        <span class="dot-divider"></span>
        <span class="eyebrow eyebrow-bone">${String(items.length).padStart(2,'0')} piezas</span>
      </div>
      <h2 class="cat-title">${edit.title[0]} <span class="script">${edit.title[1]}</span></h2>
      <p class="cat-sub">${edit.sub}</p>
    </header>
    <div class="cat-grid">
      ${items.map(p => {
        const optionsMarkup = (p.sizes && p.sizes.length) ? `
          <div class="size-row" data-product="${p.id}">
            <span class="size-label">Medida</span>
            ${p.sizes.map((s, idx) => `
              <button class="size-chip ${idx === 1 ? 'active' : ''}" data-size="${s}">${s}</button>
            `).join('')}
          </div>` : (p.note ? `
          <div class="var-note">
            <span class="note-glyph">✦</span>
            <span>${p.note}</span>
          </div>` : '');
        return `
          <article class="var-card" data-id="${p.id}">
            <div class="var-art${p.image ? ' has-image' : ''}" data-label="${p.label}"${p.image ? ` style="background-image:url('${p.image}')"` : ''}></div>
            <div class="var-body">
              <div class="var-name">
                <h3>${p.name}</h3>
                <span class="var-ref">Ref. ${p.id}</span>
              </div>
              <p class="var-blurb">${p.desc || ''}</p>
              ${optionsMarkup}
              <button class="var-add" data-id="${p.id}">
                <span>Añadir a cotización</span>
                <span class="arrow"></span>
              </button>
            </div>
          </article>`;
      }).join('')}
    </div>
  `;

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
      addToQuote(b.dataset.id, activeSize ? activeSize.dataset.size : null, b);
    });
  });
  document.getElementById('catBack').addEventListener('click', closeCategory);

  catOverlay.classList.add('open');
  catOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

// CTA buttons inside the "El arte de regalar" section
document.querySelectorAll('[data-gift]').forEach(a => {
  a.addEventListener('click', e => { e.preventDefault(); openGiftEdit(a.dataset.gift); });
});

// "Conocer la Maison" CTA inside the historia section → smooth scroll
document.querySelectorAll('[data-maison-scroll]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    playTransition(() => openMaison());
  });
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
    let subtotal = 0; let allPriced = true;
    items.forEach((it, i) => {
      const sizePart = it.size ? ` · ${it.size}` : '';
      const lineTotal = (it.price != null) ? it.price * it.qty : null;
      if (it.price != null) subtotal += lineTotal; else allPriced = false;
      const pricePart = (it.price != null) ? ` — ${fmtCOP(lineTotal)}` : ' — Bajo cotización';
      lines.push(`${String(i+1).padStart(2,'0')}. ${it.name}${sizePart} (Ref. ${it.id}) · ×${it.qty}${pricePart}`);
      if (it.note) lines.push(`    ↳ ${it.note}`);
    });
    lines.push('');
    if (subtotal > 0) {
      const seguro = Math.round(subtotal * INSURANCE_RATE);
      lines.push(`Subtotal: ${fmtCOP(subtotal)}`);
      lines.push(`Seguro (${Math.round(INSURANCE_RATE*100)}%): ${fmtCOP(seguro)}`);
      lines.push(`TOTAL: ${fmtCOP(subtotal + seguro)}${allPriced ? '' : ' (algunas piezas bajo cotización)'}`);
      lines.push('Envío nacional sin costo.');
      lines.push('');
    }
    lines.push('Quedo a la espera de una atención personalizada. Gracias.');
  }
  return lines.join('\n');
}
function openWhatsApp(items) {
  const msg = encodeURIComponent(buildWaMessage(items));
  window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank', 'noopener');
}
// The cotización is sent through the facturación form (datos + privacidad), which
// then opens WhatsApp with the summary. The quote already lives in localStorage.
document.getElementById('sendWa').addEventListener('click', () => {
  try { localStorage.setItem('preto.quoteSentAt', String(Date.now())); } catch(e){}
  if (window.PretoAccount && window.PretoAccount.markQuoteSent) window.PretoAccount.markQuoteSent();
  window.location.href = 'facturacion.html';
});
document.getElementById('waBtn').addEventListener('click', () => {
  if (quote.length) openDrawer();
  else openWhatsApp([]);
});

/* ── Nav: solid on scroll + hide on scroll down ────────────── */
const nav = document.getElementById('nav');
let navTick = false, navSolid = false, lastY = window.scrollY, navHidden = false;
const onScroll = () => {
  if (navTick) return;
  navTick = true;
  requestAnimationFrame(() => {
    const y = window.scrollY;
    const solid = y > 80;
    if (solid !== navSolid) { navSolid = solid; nav.classList.toggle('solid', solid); }
    // Hide when scrolling down past the header, reveal when scrolling up
    const goingDown = y > lastY;
    const shouldHide = goingDown && y > 160;
    if (shouldHide !== navHidden) { navHidden = shouldHide; nav.classList.toggle('hidden', shouldHide); }
    lastY = y;
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

/* ── Mega menus (Joyería · Accesorios) ─────────────────────── */
const MEGAS = [];
function setupMega(triggerId, megaId) {
  const trigger = document.getElementById(triggerId);
  const mega    = document.getElementById(megaId);
  if (!trigger || !mega) return null;

  // Posición original del submenú (para devolverlo en desktop / al cerrar)
  const megaHomeParent = mega.parentNode;
  const megaHomeNext = mega.nextSibling;
  const restoreMega = () => { if (mega.parentNode !== megaHomeParent) megaHomeParent.insertBefore(mega, megaHomeNext); };

  const close = () => {
    mega.classList.remove('open');
    mega.setAttribute('aria-hidden', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    restoreMega();
  };
  const open = () => {
    MEGAS.forEach(m => { if (m && m.mega !== mega) m.close(); });  // only one open
    // En celular, abrir el submenú JUSTO debajo de su categoría (acordeón)
    if (window.innerWidth <= 600) trigger.insertAdjacentElement('afterend', mega);
    else restoreMega();
    mega.classList.add('open');
    mega.setAttribute('aria-hidden', 'false');
    trigger.setAttribute('aria-expanded', 'true');
    // On mobile the menu is a bottom sheet — scroll the opened panel into view.
    if (window.innerWidth <= 600) {
      const sheet = document.querySelector('.nav-drawer');
      if (sheet) {
        setTimeout(() => {
          const sr = sheet.getBoundingClientRect();
          const mr = mega.getBoundingClientRect();
          const headH = (sheet.querySelector('.nav-mobile-head') || {}).offsetHeight || 64;
          const delta = (mr.top - sr.top) - headH - 8;
          sheet.scrollTo({ top: sheet.scrollTop + delta, behavior: 'smooth' });
        }, 80);
      }
    }
  };

  trigger.addEventListener('click', e => {
    e.stopImmediatePropagation();
    e.preventDefault();
    const wasOpen = mega.classList.contains('open');
    // cerrar todos
    MEGAS.forEach(m => {
      m.mega.classList.remove('open');
      m.mega.setAttribute('aria-hidden', 'true');
      m.trigger.setAttribute('aria-expanded', 'false');
      if (m.restoreMega) m.restoreMega();
    });
    if (!wasOpen) {
      if (window.innerWidth <= 600) trigger.insertAdjacentElement('afterend', mega);
      mega.classList.add('open');
      mega.setAttribute('aria-hidden', 'false');
      trigger.setAttribute('aria-expanded', 'true');
      if (window.innerWidth <= 600) {
        const sheet = document.querySelector('.nav-drawer');
        if (sheet) setTimeout(() => {
          const sr = sheet.getBoundingClientRect();
          const mr = trigger.getBoundingClientRect();
          sheet.scrollTo({ top: sheet.scrollTop + (mr.top - sr.top) - 70, behavior: 'smooth' });
        }, 90);
      }
    }
  });

  mega.querySelectorAll('.mega-item').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      const href = item.getAttribute('href') || '';
      close();
      let action;
      // Gift selections → curated edit overlay
      if (href === '#gift-el' || href === '#gift-ella' || href === '#gift-bebe') {
        const w = href === '#gift-el' ? 'el' : (href === '#gift-ella' ? 'ella' : 'bebe');
        action = () => openGiftEdit(w);
      } else if (href === '#regalos') {
        // El arte de regalar → full-screen overlay
        action = openRegalos;
      } else if (href === '#maison' || href === '#sostenibilidad') {
        // Preto Maison (La Maison / Sostenibilidad) → full-screen overlay
        action = () => openMaison(href === '#sostenibilidad' ? '#sostenibilidad' : null);
      } else if (href === '#historia') {
        // Nuestra historia → full-screen overlay
        action = openHistoria;
      } else if (!href.startsWith('#card-')) {
        // Section anchors → jump (behind the loader, then reveal)
        action = () => {
          const target = document.querySelector(href);
          if (target) {
            const top = target.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top, behavior: 'auto' });
          }
        };
      } else {
        const productId = href.slice(1).replace('card-', '');
        const prod = COLLECTIONS.find(x => x.id === productId);
        action = () => {
          if (prod && prod.variants) openCategory(productId);   // familias → catálogo
          else if (prod) openProduct(productId);                // pieza única → ficha
        };
      }
      playTransition(action);
    });
  });

  const api = { open, close, trigger, mega, restoreMega };
  MEGAS.push(api);
  return api;
}

setupMega('joyeriaTrigger', 'joyeriaMega');
setupMega('accesoriosTrigger', 'accesoriosMega');
setupMega('maisonTrigger', 'maisonMega');
setupMega('regalosTrigger', 'regalosMega');

// Logo → volver SIEMPRE al inicio de todo (y cerrar el menú móvil si está abierto)
document.querySelectorAll('.nav-mark').forEach(logo => {
  logo.addEventListener('click', e => {
    e.preventDefault();
    try { if (typeof closeMobileMenu === 'function') closeMobileMenu(); } catch (_) {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
document.addEventListener('click', e => {
  MEGAS.forEach(m => {
    if (m.mega.classList.contains('open') && !m.mega.contains(e.target) && e.target !== m.trigger) m.close();
  });
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') MEGAS.forEach(m => m.close());
});

/* ── Mobile hamburger menu ─────────────────────────────────── */
const navEl = document.querySelector('.nav');
const navBurger = document.getElementById('navBurger');
function closeMobileMenu() {
  if (!navEl) return;
  navEl.classList.remove('menu-open');
  document.body.classList.remove('nav-locked');
  navBurger && navBurger.setAttribute('aria-expanded', 'false');
  MEGAS.forEach(m => m.close());
}
if (navBurger && navEl) {
  navBurger.addEventListener('click', e => {
    e.stopPropagation();
    const open = navEl.classList.toggle('menu-open');
    document.body.classList.toggle('nav-locked', open);
    navBurger.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (!open) MEGAS.forEach(m => m.close());
  });
  // Botón flotante de menú (abajo-izquierda en móvil) — reusa la lógica del burger
  const navFab = document.getElementById('navFab');
  navFab && navFab.addEventListener('click', e => { e.stopPropagation(); navBurger.click(); });
  // Sheet handle close button + dimmed scrim both dismiss the menu
  const navMobileCloseBtn = document.getElementById('navMobileClose');
  navMobileCloseBtn && navMobileCloseBtn.addEventListener('click', closeMobileMenu);
  const navScrim = document.getElementById('navScrim');
  navScrim && navScrim.addEventListener('click', closeMobileMenu);
  // Close the drawer when a final navigation happens
  document.querySelectorAll('.nav-mega .mega-item').forEach(it => {
    it.addEventListener('click', closeMobileMenu);
  });
  const destacados = document.querySelector('.nav-bottom a[href="#collections"]');
  destacados && destacados.addEventListener('click', closeMobileMenu);
  const searchBtn = document.getElementById('openSearch');
  searchBtn && searchBtn.addEventListener('click', closeMobileMenu);
  // Tap outside the nav closes the drawer
  document.addEventListener('click', e => {
    if (navEl.classList.contains('menu-open') && !navEl.contains(e.target)) closeMobileMenu();
  });
}

/* ── Search (lupa) ─────────────────────────────────────────────
   Index every individual piece (leaf products + variants), so a
   query like "lazo religioso preto" surfaces exactly the matching
   chains/rings rather than a whole category.                      */
const SYNONYMS = {
  CHAIN:    'cadena collar necklace',
  ROSARY:   'rosario rosary devocional crucifijo cruz religioso',
  RING:     'anillo ring sortija',
  SACRA:    'religioso religioso devocional cruz dije',
  BRACELET: 'pulsera brazalete bracelet hilo',
  EARRINGS: 'pendientes aretes zarcillos earrings',
  PEN:      'boligrafo bolígrafo pluma lapicero pen',
  TIE:      'barra corbata tie',
  CUFFLINKS:'gemelos mancuernas cufflinks',
  LAPEL:    'insignia pin solapa broche',
};
const norm = s => (s || '')
  .toLowerCase()
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // strip accents
  .replace(/&/g, ' ');

// Build the index from the flat catalog, dropping the category
// "parent" entries (those that fan out into variants) so results
// are concrete pieces, not duplicated families.
const SEARCH_INDEX = COLLECTIONS
  .filter(p => !p.variants)
  .map(p => {
    let extra = '';
    (p.label || '').split(/[^A-Za-z]+/).forEach(tok => {
      const key = tok.toUpperCase();
      if (SYNONYMS[key]) extra += ' ' + SYNONYMS[key];
    });
    const hay = norm([p.name, p.label, p.col, p.line, p.desc, extra].join(' '));
    return { p, hay, name: norm(p.name) };
  });

function runSearch(raw) {
  const q = norm(raw).trim();
  const tokens = q.split(/\s+/).filter(Boolean);
  if (!tokens.length) return [];
  // Prefer pieces matching ALL tokens; fall back to ANY-token ranking.
  const scored = SEARCH_INDEX.map(item => {
    let hits = 0;
    tokens.forEach(t => { if (item.hay.includes(t)) hits++; });
    let score = hits;
    if (item.name.includes(q)) score += 5;        // strong: full phrase in name
    if (item.name.startsWith(tokens[0])) score += 1;
    return { item, hits, score };
  });
  const all = scored.filter(s => s.hits === tokens.length);
  const pool = all.length ? all : scored.filter(s => s.hits > 0);
  return pool
    .sort((a, b) => b.score - a.score || a.item.p.name.localeCompare(b.item.p.name))
    .map(s => s.item.p);
}

const searchOverlay = document.getElementById('searchOverlay');
const searchInput   = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const searchMeta    = document.getElementById('searchMeta');
const searchSuggest = document.getElementById('searchSuggest');

function renderSearch(list, q) {
  if (!q.trim()) {
    searchResults.innerHTML = '';
    searchMeta.textContent = '';
    searchSuggest.style.display = '';
    return;
  }
  searchSuggest.style.display = 'none';
  if (!list.length) {
    searchMeta.textContent = '';
    searchResults.innerHTML = `
      <div class="search-empty">
        <div class="glyph">Preto</div>
        <p>No encontramos piezas para «${q}».</p>
        <p class="sub">Pruebe con «cadena», «rosario», «anillo religioso» o el nombre de una línea.</p>
      </div>`;
    return;
  }
  searchMeta.innerHTML = `<span class="gold">${String(list.length).padStart(2,'0')}</span> &nbsp;pieza${list.length === 1 ? '' : 's'} encontrada${list.length === 1 ? '' : 's'}`;
  searchResults.innerHTML = list.map(p => {
    const art = p.image
      ? `<div class="sr-art has-image" style="background-image:url('${p.image}')"></div>`
      : `<div class="sr-art" data-label="${p.label}"></div>`;
    return `
      <article class="sr-card" data-id="${p.id}">
        ${art}
        <div class="sr-info">
          <h3 class="sr-name">${p.name}</h3>
          <p class="sr-spec">${p.label}</p>
          <p class="sr-cta">Bajo cotización</p>
        </div>
      </article>`;
  }).join('');
  searchResults.querySelectorAll('.sr-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.id;
      closeSearch();
      const prod = COLLECTIONS.find(x => x.id === id);
      if (prod && prod.variants) openCategory(id);
      else openProduct(id);
    });
  });
}

let searchDebounce;
function doSearch() {
  const q = searchInput.value;
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => renderSearch(runSearch(q), q), 90);
}

function openSearch() {
  searchOverlay.classList.add('open');
  searchOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  setTimeout(() => searchInput.focus(), 80);
}
function closeSearch() {
  searchOverlay.classList.remove('open');
  searchOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.getElementById('openSearch').addEventListener('click', openSearch);
document.getElementById('searchClose').addEventListener('click', closeSearch);
searchOverlay.querySelectorAll('[data-search-close]').forEach(el => el.addEventListener('click', closeSearch));
searchInput.addEventListener('input', doSearch);
searchInput.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeSearch();
  if (e.key === 'Enter') {
    const first = searchResults.querySelector('.sr-card');
    if (first) first.click();
  }
});
searchSuggest.querySelectorAll('.sg-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    searchInput.value = chip.dataset.q;
    searchInput.focus();
    doSearch();
  });
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && searchOverlay.classList.contains('open')) closeSearch();
});


/* ── Deep links: index.html#card-<ID> abre la pieza directamente ──
   Permite que las páginas de producto (/joyeria/*.html) y los links
   compartidos por WhatsApp lleven directo a la ficha en la tienda. */
(function () {
  function openFromHash() {
    const m = (location.hash || '').match(/^#card-(.+)$/);
    if (!m) return;
    const id = decodeURIComponent(m[1]);
    const prod = COLLECTIONS.find(x => x.id === id);
    if (!prod) return;
    setTimeout(() => {
      try {
        if (prod.variants) openCategory(id);
        else openProduct(id);
      } catch (e) { console.warn('[Preto] deep link:', e); }
    }, 350);
  }
  window.addEventListener('hashchange', openFromHash);
  openFromHash();
})();
