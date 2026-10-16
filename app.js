/* ─────────────────────────────────────────────────────────────
   Preto by Dala&Co — Editorial interactions
   ───────────────────────────────────────────────────────────── */

const WA_NUMBER = '573226955451'; // Preto by Dala&Co · concierge

/* ── Imágenes recortadas (fondo transparente) que deben "flotar"
   sobre el vino tinto, en vez de llenar el marco.
   AUTOMÁTICO: cualquier imagen .png (transparente) flota sola; las
   fotos normales .webp/.jpg llenan el marco como siempre. Así solo
   subes la imagen y queda igual, sin editar tarjeta por tarjeta.
   (La lista de abajo es para forzar casos sueltos si hiciera falta.) ── */
const CUTOUT_IMAGES = new Set([
  'assets/pulsera-cuero-preto.webp', 'assets/pulsera-elite-solaris.webp', 'assets/pulsera-elite-rouge.webp', 'assets/pulsera-elite-monarch.webp', 'assets/pendientes-balines-dala.webp', 'assets/topos-preto.webp', 'assets/topos-preto-2.webp', 'assets/aretes-cruz-dala.webp', 'assets/aretes-cruz-dala-2.webp', 'assets/topos-dala-6mm.webp', 'assets/topos-dala-7mm.webp', 'assets/topos-dala-4mm.webp', 'assets/topos-dala-3mm.webp', 'assets/candonga-dala.webp', 'assets/candonga-dala-2.webp', 'assets/trebol-dala.webp', 'assets/trebol-dala-2.webp', 'assets/pulsera-balines-dala.webp', 'assets/pulsera-perla-imperial.webp'
]);
/* Excepción inversa: fotos de estudio CON FONDO (no recortadas) que
   llegan en .png y deben LLENAR el marco como una foto normal, en vez
   de flotar sobre el vino tinto. */
const FILL_IMAGES = new Set(['assets/cadena-lazo-dala.jpg', 'assets/cadena-4-carriles-dala.jpg', 'assets/cadena-hojuelas-preto-v2.jpg', 'assets/cadena-militar-preto-v2.jpg', 'assets/cadena-cubana-dala-3.jpg', 'assets/cadena-san-miguel-preto-3.jpg', 'assets/anillo-circones-dala-co.jpg', 'assets/anillo-eslabones-3oros-dala.jpg', 'assets/anillo-circon-blanco-dama.jpg', 'assets/anillo-circon-blanco-modelo.jpg', 'assets/anillo-eslabones-3oros-modelo.jpg', 'assets/anillo-circones-dala-modelo.jpg', 'assets/dala-rustico-55-guadalupe-blanco.jpg', 'assets/dala-hojuelas-50-guadalupe-multicolor-v2.jpg', 'assets/anillo-natural-choco-estuche.jpg', 'assets/anillo-natural-choco-modelo.jpg', 'assets/anillo-tortue-dala-modelo.webp', 'assets/anillo-voyage-dala-modelo.webp']);
function isCutout(src){ return !!src && !FILL_IMAGES.has(src) && (CUTOUT_IMAGES.has(src) || /\.png(\?|$)/i.test(src)); }
function imgArtClass(src){ return 'has-image' + (isCutout(src) ? ' cutout' : ''); }
/* ── Miniaturas livianas · assets/c/ ──────────────────────────────
   Las tarjetas se ven a ~200-460 px, pero las fotos originales llegan
   a 1122x1402. iOS Safari las descodifica a resolución COMPLETA (unos
   6 MB de RAM por foto): con el catálogo entero se pasaban los 200 MB
   y Safari mataba la pestaña — de ahí las caídas en iPhone. Estas
   copias de 480 px de borde largo cuestan ~0.7 MB y se usan SOLO en
   miniaturas (tarjetas, variantes, buscador). El detalle (pdp-art) y
   las fichas siguen mostrando la foto en alta resolución.
   imgArtClass() SIEMPRE recibe la ruta original, para que las reglas
   de recorte (CUTOUT_IMAGES / FILL_IMAGES) sigan coincidiendo. */
const THUMB_AVAILABLE = new Set(['assets/cadena-guadalupe-lumiere-model.jpg','assets/cadena-guadalupe-lumiere.jpg','assets/anillo-circon-blanco-dama.jpg','assets/anillo-circon-blanco-modelo.jpg','assets/anillo-circones-dala-co.jpg','assets/anillo-circones-dala-modelo.jpg','assets/anillo-coeur-dala-modelo.webp','assets/anillo-eslabones-3oros-dala.jpg','assets/anillo-eslabones-3oros-modelo.jpg','assets/anillo-natural-choco-estuche.jpg','assets/anillo-natural-choco-modelo.jpg','assets/anillo-tortue-dala-modelo.webp','assets/anillo-voyage-dala-modelo.webp','assets/aretes-cruz-dala-2.webp','assets/aretes-cruz-dala.webp','assets/cadena-4-carriles-dala.jpg','assets/cadena-bicolor-dala.jpg','assets/cadena-corno-doro-model.jpg','assets/cadena-corno-doro.webp','assets/cadena-cubana-dala-3.jpg','assets/cadena-cubana-italiana-dala.jpg','assets/cadena-hojuelas-preto-v2.jpg','assets/cadena-lazo-dala.jpg','assets/cadena-militar-preto-v2.jpg','assets/cadena-preto-legado-model.jpg','assets/cadena-preto-legado.webp','assets/cadena-san-miguel-preto-3.jpg','assets/cadena-san-miguel-preto.png','assets/candonga-dala-2.webp','assets/candonga-dala.webp','assets/dala-hojuelas-50-guadalupe-multicolor-v2.jpg','assets/dala-rustico-55-guadalupe-blanco.jpg','assets/pendientes-balines-dala.webp','assets/preto-hero.jpg','assets/pulsera-balines-dala.webp','assets/pulsera-cuero-preto.webp','assets/pulsera-elite-monarch.webp','assets/pulsera-elite-rouge.webp','assets/pulsera-elite-solaris.webp','assets/pulsera-perla-imperial.webp','assets/rosario-clasico-preto-model.jpg','assets/rosario-clasico-preto-v2.webp','assets/rosario-cruz-mayor-model.jpg','assets/rosario-cruz-mayor-preto.webp','assets/rosario-cuello-dala.webp','assets/topos-dala-3mm.webp','assets/topos-dala-4mm.webp','assets/topos-dala-6mm.webp','assets/topos-dala-7mm.webp','assets/topos-preto-2.webp','assets/topos-preto.webp','assets/trebol-dala-2.webp','assets/trebol-dala.webp']);
function thumbSrc(src){ return THUMB_AVAILABLE.has(src) ? src.replace('assets/', 'assets/c/') : src; }
/* Set de 900 px (assets/m/) para las fotos que se ven GRANDES: la tarjeta
   del carrusel ocupa 72-78vw en teléfono (≈280 px CSS × dpr 3 ≈ 840 px de
   dispositivo) y la rejilla de /joyeria/ llega a una columna. Con 480 px
   se veían blandas. El techo de memoria no obliga a bajar tanto: entre
   content-visibility y la precarga corta de 200 px solo hay un puñado de
   fotos descodificadas a la vez (~2,4 MB cada una), no las 56.
   thumbSrc() de 480 px queda para los resultados del buscador, que son
   miniaturas pequeñas y aparecen muchas juntas. */
const CARD_AVAILABLE = new Set(['assets/cadena-guadalupe-lumiere-model.jpg','assets/cadena-guadalupe-lumiere.jpg','assets/anillo-circon-blanco-dama.jpg','assets/anillo-circon-blanco-modelo.jpg','assets/anillo-circones-dala-co.jpg','assets/anillo-circones-dala-modelo.jpg','assets/anillo-coeur-dala-modelo.webp','assets/anillo-eslabones-3oros-dala.jpg','assets/anillo-eslabones-3oros-modelo.jpg','assets/anillo-natural-choco-estuche.jpg','assets/anillo-natural-choco-modelo.jpg','assets/anillo-tortue-dala-modelo.webp','assets/anillo-voyage-dala-modelo.webp','assets/aretes-cruz-dala-2.webp','assets/aretes-cruz-dala.webp','assets/cadena-4-carriles-dala.jpg','assets/cadena-bicolor-dala.jpg','assets/cadena-corno-doro-model.jpg','assets/cadena-corno-doro.webp','assets/cadena-cubana-dala-3.jpg','assets/cadena-cubana-italiana-dala.jpg','assets/cadena-hojuelas-preto-v2.jpg','assets/cadena-lazo-dala.jpg','assets/cadena-militar-preto-v2.jpg','assets/cadena-preto-legado-model.jpg','assets/cadena-preto-legado.webp','assets/cadena-san-miguel-preto-3.jpg','assets/candonga-dala-2.webp','assets/candonga-dala.webp','assets/dala-hojuelas-50-guadalupe-multicolor-v2.jpg','assets/dala-rustico-55-guadalupe-blanco.jpg','assets/pendientes-balines-dala.webp','assets/preto-hero.jpg','assets/pulsera-balines-dala.webp','assets/pulsera-cuero-preto.webp','assets/pulsera-elite-monarch.webp','assets/pulsera-elite-solaris.webp','assets/pulsera-perla-imperial.webp','assets/rosario-clasico-preto-model.jpg','assets/rosario-cruz-mayor-model.jpg','assets/rosario-cruz-mayor-preto.webp','assets/rosario-cuello-dala.webp','assets/topos-dala-3mm.webp','assets/topos-dala-4mm.webp','assets/topos-dala-6mm.webp','assets/topos-dala-7mm.webp','assets/topos-preto-2.webp','assets/topos-preto.webp','assets/trebol-dala-2.webp','assets/trebol-dala.webp']);
function cardSrc(src){ return CARD_AVAILABLE.has(src) ? src.replace('assets/', 'assets/m/') : src; }

/* IDs con precio FIJO y exacto (sin "Desde"): piezas de medida
   estándar sin variación de peso, a diferencia del resto del
   catálogo que se cotiza "Desde $X" por el peso variable del oro. */
const EXACT_PRICE_IDS = new Set(['DAL-CH-GLU', 'DAL-EA-CAN', 'DAL-EA-TRE', 'DAL-BR-BAL', 'PRT-CH-SMG', 'DAL-CH-BIC', 'DAL-CH-CUI', 'DAL-CH-4CA', 'PRT-CH-HOJ', 'PRT-CH-MIL', 'DAL-RG-CIR', 'DAL-RG-ESL', 'DAL-RG-SOL', 'DAL-RO-CUE', 'PRT-CH-COR', 'PRT-CH-LEG', 'DAL-BR-EPU', 'DAL-RG-COE', 'DAL-RG-TOR', 'DAL-RG-LIS', 'PRT-RG-VOY']);
function isExactPriceId(id){ return EXACT_PRICE_IDS.has(id); }
function artAria(name){ return String(name || '').replace(/"/g, '&quot;'); }

/* ── Miniatura de tarjeta con galería (varias fotos por pieza) ──
   Si la pieza trae `images: [...]`, la miniatura muestra flechas +
   puntos para pasar de una foto a otra SIN abrir la ficha. Con una
   sola foto no aparece ningún control (comportamiento intacto). */
function cardGalleryControls(images){
  if (!images || images.length < 2) return '';
  const dots = images.map((_, i) =>
    `<button type="button" class="vg-dot${i === 0 ? ' active' : ''}" data-i="${i}" aria-label="Ver foto ${i + 1}"></button>`).join('');
  const chev = (dir, lbl, d) =>
    `<button type="button" class="vg-arrow ${dir}" aria-label="${lbl}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"></path></svg></button>`;
  return chev('prev', 'Foto anterior', 'M15 6l-6 6 6 6') + chev('next', 'Foto siguiente', 'M9 6l6 6-6 6') + `<div class="vg-dots">${dots}</div>`;
}
function varArtHTML(image, images, label, ariaName){
  const multi = images && images.length > 1;
  const cls = 'var-art' + (image ? ' ' + imgArtClass(image) : '') + (multi ? ' has-gallery' : '');
  const bg = image ? ` role="img" aria-label="${artAria(ariaName)}" style="background-image:url('${cardSrc(image)}')"` : '';
  const data = multi ? ` data-images="${artAria(JSON.stringify(images))}"` : '';
  return `<div class="${cls}" data-label="${label}"${bg}${data}>${cardGalleryControls(images)}</div>`;
}
/* Cambia la foto de una miniatura .var-art (flechas o puntos). */
function cycleCardArt(art, dir, toIndex){
  if (!art) return;
  let imgs = [];
  try { imgs = JSON.parse(art.dataset.images || '[]'); } catch (e) {}
  if (imgs.length < 2) return;
  let idx = parseInt(art.dataset.i || '0', 10);
  idx = (toIndex != null) ? toIndex : idx + dir;
  idx = (idx + imgs.length) % imgs.length;
  art.dataset.i = String(idx);
  const src = imgs[idx];
  art.className = 'var-art has-gallery ' + imgArtClass(src);
  art.style.backgroundImage = `url('${cardSrc(src)}')`;
  art.querySelectorAll('.vg-dot').forEach((d, i2) => d.classList.toggle('active', i2 === idx));
}
/* Delegación en fase de captura: el clic en un control de galería
   cambia la foto y NO abre la ficha del producto. */
document.addEventListener('click', e => {
  const arrow = e.target.closest && e.target.closest('.vg-arrow');
  if (arrow) {
    e.stopPropagation(); e.preventDefault();
    cycleCardArt(arrow.closest('.var-art'), arrow.classList.contains('next') ? 1 : -1);
    return;
  }
  const dot = e.target.closest && e.target.closest('.vg-dot');
  if (dot) {
    e.stopPropagation(); e.preventDefault();
    cycleCardArt(dot.closest('.var-art'), 0, parseInt(dot.dataset.i, 10));
  }
}, true);

/* ── Preto Elite: piezas exclusivas sin precio público ─────────
   En lugar de precio, se muestra un mensaje que es un botón hacia
   WhatsApp para consultar disponibilidad. */
/* ── Preto Elite · ficha técnica de la casa ───────────────────
   El detalle bespoke (origen del oro, tono, peso, fabricación y
   cotización) es idéntico en las cuatro piezas. Para que no se vea
   repetido ni desordenado, se muestra UNA sola vez como panel de
   la categoría (eliteSpecPanel, sobre la cuadrícula) y también en
   la ficha de producto abierta por enlace directo (full=true).
   Las tarjetas sólo llevan el sello "bajo pedido" + la consulta. */
const ELITE_LEAD = 'Concebida para quienes valoran la verdadera exclusividad, cada pieza es una creación hecha a medida, elaborada únicamente bajo pedido.';
const ELITE_SPECS = [
  { k: 'Oro chocoano',   v: 'Selección insignia de Preto by Dala&amp;Co' },
  { k: 'Otras opciones', v: 'Oro nacional · Oro italiano' },
  { k: 'Tono del oro',   v: 'Amarillo · Blanco · Rosa' },
  { k: 'Peso',           v: 'Desde 20 g' },
  { k: 'Fabricación',    v: 'Exclusivamente bajo pedido' },
  { k: 'Cotización',     v: 'Personalizada' },
];
function eliteSpecRows(){
  return ELITE_SPECS.map(s =>
    `<div class="ess-row"><dt class="ess-k">${s.k}</dt><dd class="ess-v">${s.v}</dd></div>`
  ).join('');
}
function eliteSpecPanel(){
  return `<section class="elite-panel" aria-label="Ficha técnica Preto Elite">
      <div class="elite-panel-head">
        <span class="elite-panel-eyebrow">La creación por encargo</span>
        <p class="elite-panel-lead">${ELITE_LEAD}</p>
      </div>
      <dl class="elite-spec">${eliteSpecRows()}</dl>
    </section>`;
}
function isEliteId(id){ return String(id || '').startsWith('PRT-LC-'); }
function eliteCtaMarkup(id, name, full){
  const nm = String(name || '').replace(/"/g, '&quot;');
  const cta = `<button class="elite-cta" data-elite-wa data-id="${id}" data-name="${nm}" aria-label="Consultar disponibilidad por WhatsApp">
        <span class="elite-cta-go">Consultar disponibilidad por WhatsApp <span class="arrow"></span></span>
      </button>`;
  if (full){
    return `<div class="elite-block elite-block--full">
        <p class="elite-lead">${ELITE_LEAD}</p>
        <dl class="elite-spec">${eliteSpecRows()}</dl>
        ${cta}
      </div>`;
  }
  return `<div class="elite-block">
        <span class="elite-tag">Exclusivamente bajo pedido</span>
        ${cta}
      </div>`;
}

/* ════════ PRECIOS Y SEGURO ════════════════════════════════════
   Pon aquí el precio de cada pieza (solo números, sin puntos ni $).
   Las piezas que NO estén en esta lista salen como "Consultar precio".
   El seguro se calcula como un % del subtotal (cámbialo abajo).      */
const INSURANCE_RATE = 0.08; // ← 8 %. Cambia por tu % real (ej. 0.03 = 3 %).
/* Los precios ahora viven en precios.js — un solo archivo editable
   que comparten la portada y las 47 fichas de /joyeria/ (punto 03). */
const PRICES = (typeof window !== 'undefined' && window.PRETO_PRICES) ? window.PRETO_PRICES : {};
function priceFor(id){ return (PRICES && PRICES[id] != null) ? PRICES[id] : null; }
function fmtCOP(n){ try { return '$' + Math.round(n).toLocaleString('es-CO'); } catch(e){ return '$' + Math.round(n); } }

/* ── Precios por medida (mm) ───────────────────────────────────
   Los Topo/balines cambian de precio según el diámetro del balín.
   El mapa vive en precios.js (window.PRETO_SIZE_PRICES) para que
   los precios se editen en un solo archivo.                       */
const SIZE_PRICES = (typeof window !== 'undefined' && window.PRETO_SIZE_PRICES) ? window.PRETO_SIZE_PRICES : {};
function sizePricesFor(id){ return (id && SIZE_PRICES[id]) ? SIZE_PRICES[id] : null; }

/* ── Imágenes por medida (mm) ──────────────────────────────────
   Rellena este mapa cuando lleguen las fotos de cada diámetro.
   Si una medida no tiene foto aquí, se usa la imagen base de la
   pieza. Claves de medida EXACTAS: '3 mm', '4 mm', … '7 mm'.       */
const SIZE_IMAGES = {
  // Topo Dala&Co (balín diamantado 18k). El 6 mm tiene su propia foto;
  // el resto de medidas usan la foto base de la pieza.
  'DAL-EA-TOP': {
    '3 mm': 'assets/topos-dala-3mm.webp',
    '4 mm': 'assets/topos-dala-4mm.webp',
    '5 mm': 'assets/pendientes-balines-dala.webp',
    '6 mm': 'assets/topos-dala-6mm.webp',
    '7 mm': 'assets/topos-dala-7mm.webp',
  },
};
function sizeImagesFor(id){ return (id && SIZE_IMAGES[id]) ? SIZE_IMAGES[id] : null; }
/* Precio para una (referencia + medida): usa el precio por medida
   si existe, si no el precio plano de la pieza. */
function priceForSize(id, size){
  const sp = sizePricesFor(id);
  if (sp && size && sp[size] != null) return sp[size];
  return priceFor(id);
}
/* Imagen para una (referencia + medida): foto de la medida si
   existe, si no la imagen base que reciba como fallback. */
function imageForSize(id, size, fallback){
  const si = sizeImagesFor(id);
  if (si && size && si[size]) return si[size];
  return fallback || null;
}
/* Precio mínimo de una sola referencia (considera medidas). */
function unitMinPrice(id){
  const sp = sizePricesFor(id);
  if (sp) { const ns = Object.values(sp).filter(n => n != null); if (ns.length) return Math.min(...ns); }
  return priceFor(id);
}
/* Precio mínimo de una pieza o de una familia de variantes. */
function minPriceFor(p){
  if (p && p.variants) {
    const vals = p.variants.map(v => unitMinPrice(v.id)).filter(n => n != null);
    return vals.length ? Math.min(...vals) : null;
  }
  return p ? unitMinPrice(p.id) : null;
}
/* Botón "Consultar precio" → abre WhatsApp con una consulta de la pieza.
   Se usa MIENTRAS una pieza aún no tiene precio publicado. Devuelve HTML
   (no texto) para insertar en fichas; el click lo captura un manejador
   global en fase de captura, así no dispara la apertura de la ficha. */
function waPriceBtn(id, name){
  const nm = String(name == null ? '' : name).replace(/"/g, '&quot;');
  return `<button type="button" class="price-wa" data-price-wa data-id="${id || ''}" data-name="${nm}" aria-label="Consultar precio por WhatsApp"><span>Consultar precio</span><span class="arrow"></span></button>`;
}
function openPriceInquiry(id, name){
  if (typeof fbq === 'function') fbq('track', 'Contact');
  const ref = id ? ` (Ref. ${id})` : '';
  const pieza = name ? `«${name}»` : 'esta pieza';
  const msg = encodeURIComponent(`Hola, quisiera consultar el precio de ${pieza}${ref} de Preto by Dala&Co. ¿Me pueden ayudar?`);
  window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank', 'noopener');
}
function openSizeInquiry(id, name){
  if (typeof fbq === 'function') fbq('track', 'Contact');
  const ref = id ? ` (Ref. ${id})` : '';
  const pieza = name ? `«${name}»` : 'esta pieza';
  const msg = encodeURIComponent(`Hola, me interesa ${pieza}${ref} de Preto by Dala&Co en una talla diferente a la disponible. ¿Me pueden ayudar con la elaboración por encargo?`);
  window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank', 'noopener');
}
/* Etiqueta visible: "Desde $X", precio exacto, o BOTÓN "Consultar precio". */
function priceLabelFor(p){
  const n = minPriceFor(p);
  if (n == null) return waPriceBtn(p && p.id, p && (p.name || (p.sub ? ((p.prefix || '') + ' ' + p.sub).trim() : '')));
  return isExactPriceId(p && p.id) ? `${fmtCOP(n)} COP` : `Desde ${fmtCOP(n)} COP`;
}

/* Actualiza precio + imagen de una tarjeta de variante (var-card)
   según la medida elegida. No hace nada si la pieza no tiene
   precio por medida. */
function syncVarCardSize(card, size){
  if (!card || !size) return;
  const id = card.dataset.id;
  const sp = sizePricesFor(id);
  if (sp) {
    const priceEl = card.querySelector('.var-price');
    if (priceEl) {
      const amt = sp[size];
      if (amt != null) {
        priceEl.textContent = fmtCOP(amt) + ' COP';
      } else {
        const h3 = card.querySelector('.var-name h3');
        priceEl.innerHTML = waPriceBtn(id, h3 ? h3.textContent.trim() : '');
      }
    }
  }
  const img = imageForSize(id, size, null);
  const artEl = card.querySelector('.var-art');
  if (artEl && img) {
    artEl.classList.add('has-image');
    if (isCutout(img)) artEl.classList.add('cutout');
    artEl.style.backgroundImage = `url('${cardSrc(img)}')`;
    artEl.removeAttribute('data-label');
  }
}

const CHAIN_SIZES = ['45 cm', '50 cm', '55 cm', '60 cm'];
const BRACELET_SIZES = ['15 cm', '16 cm', '17 cm', '18 cm'];

/* Cadenas Preto — las piezas reales viven ahora en "Cadenas Dala&Co".
   Aquí quedan solo tarjetas vacías (placeholders sin foto). */
const PRETO_CHAIN_VARIANTS = [
  { sub: 'Corno D\'Oro', id: 'PRT-CH-COR', label: 'CHAIN · CORNO D\'ORO', sizes: ['45 cm'], image: 'assets/cadena-corno-doro-model.jpg',
    images: ['assets/cadena-corno-doro-model.jpg', 'assets/cadena-corno-doro.webp'],
    blurb: 'Más que una joya, una declaración de identidad. Esta cadena en oro con colgante de coral rojo representa la esencia de Preto: piezas exclusivas donde el diseño, el simbolismo y el carácter se unen para crear una presencia auténtica e inolvidable. Medida 45 cm · ancho 3 mm.' },
  { sub: 'Legado', id: 'PRT-CH-LEG', prefix: 'Preto', label: 'CHAIN · LEGADO', sizes: ['60 cm'], image: 'assets/cadena-preto-legado-model.jpg',
    images: ['assets/cadena-preto-legado-model.jpg', 'assets/cadena-preto-legado.webp'],
    blurb: 'Cada símbolo cuenta una historia. Esta cadena en oro combina un dije de acabado artesanal con la Estrella de David, dando vida a una pieza que refleja identidad, carácter y exclusividad. Diseñada para quienes entienden que la verdadera elegancia nace de aquello que tiene significado. Medida 60 cm.' },
  { sub: 'Próximamente', id: 'PRT-CH-PH1', label: 'CHAIN · ONYX', placeholder: true, blurb: 'Nuevas cadenas en oro de Chocó, muy pronto.' },
  { sub: 'Próximamente', id: 'PRT-CH-PH2', label: 'CHAIN · ONYX', placeholder: true, blurb: 'Nuevas cadenas en oro de Chocó, muy pronto.' },
  { sub: 'Próximamente', id: 'PRT-CH-PH3', label: 'CHAIN · ONYX', placeholder: true, blurb: 'Nuevas cadenas en oro de Chocó, muy pronto.' },
];

/* ── Cadenas Dala&Co ───────────────────────────────────────────
   Familia unificada: todas las cadenas de la casa viven aquí.
   Las referencias PRT-CH-* conservan su SKU (carrito, sets, regalos
   y enlaces siguen resolviendo). Las piezas insignia (fotografiadas)
   encabezan; los clásicos van por estilo, en acabado 18k y oro de Chocó. */
const DALA_CHAIN_VARIANTS = [
  /* — Piezas insignia — */
  { sub: 'Bicolor',   id: 'DAL-CH-BIC', label: 'CHAIN · TWO-TONE', sizes: ['55 cm'], image: 'assets/cadena-bicolor-dala.jpg',
    blurb: 'Dos oros en diálogo: husos alternos en oro rosa y oro blanco de 18k que atrapan la luz a cada gesto. De peso noble y presencia serena, es el lujo que no necesita anunciarse. Medida 55 cm.' },
  { sub: 'San Miguel Arcángel', id: 'PRT-CH-SMG', label: 'CHAIN · SAN MIGUEL', sizes: ['55 cm'], image: 'assets/cadena-san-miguel-preto-3.jpg',
    images: ['assets/cadena-san-miguel-preto-3.jpg', 'assets/cadena-san-miguel-preto.png'],
    blurb: 'Oro rosa y blanco de textura rústica, engastado en circones negros y coronado por el Arcángel San Miguel. Una pieza de alto valor, pensada no para cualquier día sino para el momento en que tu presencia debe imponerse. Medida 55 cm.' },
  { sub: 'Cubana Italiana', id: 'DAL-CH-CUI', label: 'CHAIN · CUBAN 750', sizes: ['60 cm'], image: 'assets/cadena-cubana-italiana-dala.jpg',
    blurb: 'Eslabón cubano macizo de fabricación italiana en oro de ley 750. Curva tras curva pulida a espejo, de peso rotundo y brillo honesto: una pieza que se lleva como una firma. Medida 60 cm.' },
  { sub: 'Hojuelas 2 Oros', id: 'PRT-CH-HOJ', label: 'CHAIN · HOJUELAS', sizes: ['60 cm'], image: 'assets/cadena-hojuelas-preto-v2.jpg',
    blurb: 'Cada pieza Dala&Co está diseñada para proyectar presencia. Esta cadena bicolor combina el oro amarillo y el oro blanco en un diseño moderno y sofisticado, pensado para quienes buscan una joya exclusiva que refleje carácter, estilo y una elegancia que no pasa desapercibida. Medida 60 cm.' },
  { sub: '4 Carriles', id: 'DAL-CH-4CA', label: 'CHAIN · 4-RAIL', sizes: ['60 cm'], image: 'assets/cadena-4-carriles-dala.jpg',
    blurb: 'La elegancia reside en los detalles. Esta cadena de múltiples carriles, elaborada en oro, combina líneas refinadas y un acabado brillante que aporta una presencia distinguida. Una creación pensada para acompañar con naturalidad los momentos más especiales. Medida 60 cm · ancho 6.4 mm.' },
  { sub: 'Militar Guadalupe', id: 'PRT-CH-MIL', label: 'CHAIN · MILITARY', sizes: ['60 cm'], image: 'assets/cadena-militar-preto-v2.jpg',
    blurb: 'La fuerza de la fe, interpretada con el sello de Dala&Co. Esta cadena con dije de la Virgen de Guadalupe combina el brillo del oro con detalles negros que aportan profundidad y distinción. Una pieza exclusiva diseñada para quienes buscan expresar su identidad con elegancia, carácter y presencia. Medida 60 cm · ancho 4 mm.' },
  { sub: 'Rústica Guadalupe Blanco', id: 'DAL-CH-RGB', label: 'CHAIN · GUADALUPE', sizes: ['55 cm'], image: 'assets/dala-rustico-55-guadalupe-blanco.jpg',
    blurb: 'Tejido rústico en oro amarillo, rematado con el dije de la Virgen de Guadalupe enchapado y engastado en circones blancos que rodean la figura de luz. Devoción y presencia en una sola pieza, para llevar la fe con carácter. Medida 55 cm.' },
  { sub: 'Hojuelas Multicolor', id: 'DAL-CH-HOM', label: 'CHAIN · HOJUELAS', sizes: ['50 cm'], image: 'assets/dala-hojuelas-50-guadalupe-multicolor-v2.jpg',
    blurb: 'Tejido de hojuelas de caída fluida coronado por un dije de la Virgen de Guadalupe en circones multicolor, que encienden la pieza con destellos vivos a cada gesto. Un homenaje luminoso, pensado para destacar. Medida 50 cm.' },
  { sub: 'Guadalupe Lumière', id: 'DAL-CH-GLU', label: 'CHAIN · LUMIÈRE', sizes: ['55 cm', '60 cm'], image: 'assets/cadena-guadalupe-lumiere-model.jpg',
    images: ['assets/cadena-guadalupe-lumiere-model.jpg', 'assets/cadena-guadalupe-lumiere.jpg'],
    blurb: 'Guadalupe Lumière celebra la unión entre tradición, fe y alta joyería. La combinación de oro amarillo, blanco y rosa realza la delicadeza de la Virgen de Guadalupe en una pieza elegante y atemporal, diseñada para acompañar con distinción cada etapa de la vida.' },
  /* — Clásicos de la casa (18k y oro de Chocó) — */
  { sub: 'Lazo · Oro 18k',     id: 'DAL-CH-LAZ', label: 'CHAIN · LAZO',     sizes: CHAIN_SIZES, image: 'assets/cadena-lazo-dala.jpg',
    blurb: 'Cadena lazo en oro 18k con dije floral de circones en sol. Delicada y luminosa, pensada para ella.' },
  { sub: 'Lazo · Oro Chocó',   id: 'PRT-CH-LAZ', label: 'CHAIN · LAZO',     sizes: CHAIN_SIZES,
    blurb: 'Entrelazado fino de caída fluida en oro de Chocó. Brillo discreto, gesto urbano.' },
  { sub: 'Cubana · Oro 18k',   id: 'DAL-CH-CUB', label: 'CHAIN · CUBAN',    sizes: CHAIN_SIZES, image: 'assets/cadena-cubana-dala-3.jpg',
    blurb: 'Cubana 3.7 mm en oro 18k 750. Eslabón a eslabón, peso y carácter en el cuello.' },
  { sub: 'Cubana · Oro Chocó', id: 'PRT-CH-CUB', label: 'CHAIN · CUBAN',    sizes: CHAIN_SIZES,
    blurb: 'Eslabón cubano sólido de 3.7 mm en oro de Chocó. Peso real, presencia directa.' },
  { sub: 'Rústica · Oro 18k',  id: 'DAL-CH-RUS', label: 'CHAIN · RUSTIC',   sizes: CHAIN_SIZES,
    blurb: 'Eslabones forjados a mano en oro 18k. Carácter ancestral.' },
  { sub: 'Rústica · Oro Chocó', id: 'PRT-CH-RUS', label: 'CHAIN · RUSTIC',  sizes: CHAIN_SIZES,
    blurb: 'Eslabones forjados a mano en oro de Chocó. Textura cruda, presencia nocturna.' },
  { sub: 'Franco · Oro 18k',   id: 'DAL-CH-FRA', label: 'CHAIN · FRANCO',   sizes: CHAIN_SIZES,
    blurb: 'Eslabón franco pulido a espejo. Brillo limpio y permanente.' },
  { sub: 'Franco · Oro Chocó', id: 'PRT-CH-FRA', label: 'CHAIN · FRANCO',   sizes: CHAIN_SIZES,
    blurb: 'Eslabón franco compacto y uniforme en oro de Chocó. Línea continua, sólida.' },
  { sub: 'Singapur · Oro 18k', id: 'DAL-CH-SIN', label: 'CHAIN · SINGAPUR', sizes: CHAIN_SIZES,
    blurb: 'Eslabón singapur en oro 18k. Reflejos cálidos al moverse.' },
  { sub: 'Singapur · Oro Chocó', id: 'PRT-CH-SIN', label: 'CHAIN · SINGAPUR', sizes: CHAIN_SIZES,
    blurb: 'Eslabón singapur torsionado en oro de Chocó. Destellos vivos en cada movimiento.' },
  { sub: 'Aurelia',  id: 'PRT-CH-AUR', label: 'CHAIN · AURELIA',  sizes: CHAIN_SIZES,
    blurb: 'La fluidez del oro elevada a una declaración de elegancia atemporal.' },
];

const PRETO_RING_NOTE  = 'Enviar talla al finalizar la compra.';
const DALA_RING_NOTE   = 'Enviar talla al finalizar la compra.';

const PRETO_RING_VARIANTS = [
  { sub: 'Natural',   id: 'PRT-RG-NAT', label: 'RING · NATURAL', sizes: ['6', '7', '8', '9', '10', '11', '12'], defaultSizeIndex: 2,
    image: 'assets/anillo-natural-choco-estuche.jpg',
    images: ['assets/anillo-natural-choco-estuche.jpg', 'assets/anillo-natural-choco-modelo.jpg'],
    blurb: 'Inspirado en la riqueza del Chocó, este anillo en oro chocoano destaca por su acabado satinado y sus delicados grabados que evocan la belleza de la naturaleza. Una pieza exclusiva de la colección Preto, creada para quienes buscan llevar una joya con historia, carácter y una elegancia que trasciende el tiempo.' },
  { sub: 'Voyage', id: 'PRT-RG-VOY', label: 'RING · VOYAGE', image: 'assets/anillo-voyage-dala-modelo.webp', sizes: ['Talla 6'], defaultSizeIndex: 0, madeToOrder: true,
    blurb: 'Inspirado en la libertad de explorar el mundo, Voyage transforma la silueta de un avión en una joya delicada y sofisticada. Un diseño que simboliza nuevos comienzos, aventuras y sueños por cumplir, pensado para acompañarte con elegancia en cada etapa de tu camino. Oro amarillo · talla 6.' },
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
  { sub: 'Voyage', id: 'DAL-RG-LIS', label: 'RING · VOYAGE', image: 'assets/anillo-voyage-dala-modelo.webp', sizes: ['Talla 6'], defaultSizeIndex: 0, madeToOrder: true,
    blurb: 'Inspirado en la libertad de explorar el mundo, Voyage transforma la silueta de un avión en una joya delicada y sofisticada. Un diseño que simboliza nuevos comienzos, aventuras y sueños por cumplir, pensado para acompañarte con elegancia en cada etapa de tu camino. Oro amarillo · talla 6.' },
  { sub: 'Cubano',    id: 'DAL-RG-CUB', label: 'RING · CUBAN LINK',   note: DALA_RING_NOTE,
    blurb: 'Eslabón cubano clásico en oro 18k pulido a espejo.' },
  { sub: 'Rústico',   id: 'DAL-RG-RUS', label: 'RING · RUSTIC',       note: DALA_RING_NOTE,
    blurb: 'Forjado a mano. Cada anillo es una pieza irrepetible.' },
  { sub: 'Religioso', id: 'DAL-RG-REL', label: 'RING · SACRA',        note: DALA_RING_NOTE,
    blurb: 'Iconografía íntima. Una oración pequeña en oro 18k.' },
  { sub: 'Circones',        id: 'DAL-RG-CIR', label: 'RING · PAVÉ 18k',
    image: 'assets/anillo-circones-dala-modelo.jpg',
    images: ['assets/anillo-circones-dala-modelo.jpg', 'assets/anillo-circones-dala-co.jpg'],
    blurb: 'Oro 18k con una delicada línea de circones blancos que recorre la banda. Brillo elegante y atemporal · talla 10.' },
  { sub: 'Eslabones 3 Oros', id: 'DAL-RG-ESL', label: 'RING · 3 OROS 18k',
    image: 'assets/anillo-eslabones-3oros-modelo.jpg',
    images: ['assets/anillo-eslabones-3oros-modelo.jpg', 'assets/anillo-eslabones-3oros-dala.jpg'],
    blurb: 'Eslabones en oro amarillo, blanco y rosa (3 oros). Diseño refinado y versátil · eslabones 4 mm · talla 4.' },
  { sub: 'Circón Blanco',    id: 'DAL-RG-SOL', label: 'RING · SOLITARIO 18k',
    image: 'assets/anillo-circon-blanco-modelo.jpg',
    images: ['assets/anillo-circon-blanco-modelo.jpg', 'assets/anillo-circon-blanco-dama.jpg'],
    blurb: 'Solitario en oro con circón central. Delicadeza y brillo atemporal · talla 6.' },
  { sub: 'Cœur', id: 'DAL-RG-COE', label: 'RING · HEART', image: 'assets/anillo-coeur-dala-modelo.webp', sizes: ['Talla 7'], defaultSizeIndex: 0, madeToOrder: true,
    blurb: 'La elegancia también puede ser un gesto sutil. Cœur es un anillo de líneas delicadas y diseño atemporal que simboliza el amor, la feminidad y la sofisticación. Una joya creada para acompañar cada día con naturalidad, convirtiéndose en ese detalle que nunca pasa de moda. Oro amarillo · talla 7.' },
  { sub: 'Tortué', id: 'DAL-RG-TOR', label: 'RING · TURTLE', image: 'assets/anillo-tortue-dala-modelo.webp', sizes: ['Talla 7'], defaultSizeIndex: 0, madeToOrder: true,
    blurb: 'Inspirado en la elegancia del océano, Tortué es un anillo que simboliza protección, serenidad y fortaleza. Su delicado diseño de tortuga, elaborado con líneas refinadas, lo convierte en una joya atemporal, perfecta para acompañar cada día con un toque de distinción y significado. Oro amarillo · talla 7.' },
];

const EARRING_MM = ['3 mm', '4 mm', '5 mm', '6 mm', '7 mm'];

const PRETO_EARRING_VARIANTS = [
  { sub: 'Topo Preto',      id: 'PRT-EA-TOP', label: 'EARRINGS · STUD',    image: 'assets/topos-preto.webp',
    images: ['assets/topos-preto.webp', 'assets/topos-preto-2.webp'], sizes: ['4 mm'], defaultSizeIndex: 0,
    blurb: 'Topo en oro de Chocó. Presencia mínima, identidad máxima. Medida única de 4 mm · diseño unisex.' },
  { sub: 'Argolla Preto',   id: 'PRT-EA-ARG', label: 'EARRINGS · HOOP',
    blurb: 'Argolla en oro. Un gesto circular, continuo, sin principio ni fin.' },
  { sub: 'Colgante Preto',  id: 'PRT-EA-COL', label: 'EARRINGS · DROP',
    blurb: 'Colgante en oro y ónix. Caída elegante que enmarca el rostro.' },
  { sub: 'Sacros Preto',    id: 'PRT-EA-SAC', label: 'EARRINGS · SACRA',
    blurb: 'Iconografía tallada en oro de Chocó. Devoción discreta en el lóbulo.' },
];

const DALA_EARRING_VARIANTS = [
  { sub: 'Topo Dala&Co',      id: 'DAL-EA-TOP', label: 'EARRINGS · STUD',  image: 'assets/pendientes-balines-dala.webp', sizes: EARRING_MM, defaultSizeIndex: 0,
    blurb: 'Topo balín diamantado en oro 18k. Luz puntual, elegancia sin esfuerzo. Elija el diámetro del balín, de 3 a 7 mm.' },
  { sub: 'Argolla Dala&Co',   id: 'DAL-EA-ARG', label: 'EARRINGS · HOOP',
    blurb: 'Argolla en oro de 18k pulido. Un clásico que nunca abandona.' },
  { sub: 'Candonga Dala&Co',  id: 'DAL-EA-CAN', label: 'EARRINGS · HOOP',  image: 'assets/candonga-dala.webp',
    images: ['assets/candonga-dala.webp', 'assets/candonga-dala-2.webp'],
    blurb: 'Candonga fina en oro de 18k pulido a espejo. Un aro continuo y ligero, luz cálida que acompaña del día a la noche.' },
  { sub: 'Trébol Dala&Co',    id: 'DAL-EA-TRE', label: 'EARRINGS · CLOVER', image: 'assets/trebol-dala.webp',
    images: ['assets/trebol-dala.webp', 'assets/trebol-dala-2.webp'], sizes: ['5 mm'], defaultSizeIndex: 0,
    blurb: 'Trébol en oro de 18k, con textura de rayos grabada a mano. Un pequeño talismán de buena fortuna, en medida única de 5 mm.' },
  { sub: 'Sacros Dala&Co',    id: 'DAL-EA-SAC', label: 'EARRINGS · SACRA',  image: 'assets/aretes-cruz-dala-2.webp',
    images: ['assets/aretes-cruz-dala-2.webp', 'assets/aretes-cruz-dala.webp'],
    blurb: 'Cruz pavé en oro 18k. Una oración de luz para llevar cerca del alma.' },
];

const ROSARY_SIZES = ['50 cm', '55 cm', '60 cm', '65 cm'];
const ROSARY_HOUSE_NOTE = 'Diseño de la casa · elaborado desde 20 g de oro.';

const PRETO_ROSARY_VARIANTS = [
  { sub: 'Clásico Preto',    id: 'PRT-RO-CLA', label: 'ROSARY · CLASSIC', note: ROSARY_HOUSE_NOTE, sizes: ROSARY_SIZES, image: 'assets/rosario-clasico-preto-model.jpg',
    images: ['assets/rosario-clasico-preto-model.jpg', 'assets/rosario-clasico-preto-v2.webp'],
    blurb: 'Cinco decenas en ónix negro y oro de Chocó, rematadas en crucifijo tallado a mano. La pieza devocional por excelencia de la casa.' },
  { sub: 'Decenario Preto',  id: 'PRT-RO-DEC', label: 'ROSARY · DECADE',  note: ROSARY_HOUSE_NOTE, sizes: ROSARY_SIZES,
    blurb: 'Una sola decena en ónix y oro. Oración discreta para llevar en el bolsillo o enrollada en la muñeca.' },
  { sub: 'Cuello Preto',     id: 'PRT-RO-CUE', label: 'ROSARY · COLLAR',  note: ROSARY_HOUSE_NOTE, sizes: ROSARY_SIZES,
    blurb: 'Rosario de caída corta, pensado para lucirse al cuello. Presencia nocturna y silencio espiritual.' },
  { sub: 'Cruz Mayor Preto', id: 'PRT-RO-CRU', label: 'ROSARY · CROSS',   note: ROSARY_HOUSE_NOTE, sizes: ['60 cm'], image: 'assets/rosario-cruz-mayor-model.jpg',
    images: ['assets/rosario-cruz-mayor-model.jpg', 'assets/rosario-cruz-mayor-preto.webp'],
    blurb: 'Elaborado en oro chocoano según el estilo artesanal del Chocó, donde cada cuenta honra el oficio de quienes lo trabajan. Más que una joya, es la presencia y el valor del oro chocoano hecho devoción cotidiana sobre quien lo viste.' },
];

const DALA_ROSARY_VARIANTS = [
  { sub: 'Clásico Dala&Co',    id: 'DAL-RO-CLA', label: 'ROSARY · CLASSIC', note: ROSARY_HOUSE_NOTE, sizes: ROSARY_SIZES,
    blurb: 'Cinco decenas en oro de 18k pulido, con crucifijo de la casa. Una oración hecha herencia.' },
  { sub: 'Decenario Dala&Co',  id: 'DAL-RO-DEC', label: 'ROSARY · DECADE',  note: ROSARY_HOUSE_NOTE, sizes: ROSARY_SIZES,
    blurb: 'Decena única en oro de 18k. Íntimo, ligero, para llevar siempre cerca.' },
  { sub: 'Cuello Dala&Co',     id: 'DAL-RO-CUE', label: 'ROSARY · COLLAR',  note: ROSARY_HOUSE_NOTE, sizes: ['50 cm'], image: 'assets/rosario-cuello-dala.webp',
    blurb: 'La delicadeza de sus formas y la armonía de sus tres tonalidades de oro convierten este rosario en una pieza de elegancia atemporal. Inspirado en la belleza de la fe y elaborado con un acabado refinado, es una creación de Dala&Co diseñada para acompañar con distinción cada momento de la vida. Medida 50 cm · tres oros · balín 3 mm.' },
  { sub: 'Cruz Mayor Dala&Co', id: 'DAL-RO-CRU', label: 'ROSARY · CROSS',   note: ROSARY_HOUSE_NOTE, sizes: ROSARY_SIZES,
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

const PRETO_BRACELET_VARIANTS = [
  { sub: 'Hilo Preto',    id: 'PRT-BR-HIL', label: 'BRACELET · CORD',   sizes: BRACELET_SIZES,
    blurb: 'Hilo encerado con remates en oro de Chocó. Discreta, resistente, para llevar siempre.' },
  { sub: 'Balines Preto', id: 'PRT-BR-BAL', label: 'BRACELET · BEADS',  sizes: BRACELET_SIZES,
    blurb: 'Balines tallados en oro de Chocó. Cada esfera captura la luz con un gesto propio.' },
  { sub: 'Eslabón Preto', id: 'PRT-BR-ESL', label: 'BRACELET · LINK',   sizes: BRACELET_SIZES,
    blurb: 'Eslabón cubano en oro. Presencia sólida, identidad urbana en la muñeca.' },
  { sub: 'Rígida Preto',  id: 'PRT-BR-RIG', label: 'BRACELET · BANGLE', sizes: BRACELET_SIZES,
    blurb: 'Brazalete rígido en oro de Chocó. Una pieza de carácter, sin cierre ni concesiones.' },
];

const DALA_BRACELET_VARIANTS = [
  { sub: 'Hilo Dala&Co',    id: 'DAL-BR-HIL', label: 'BRACELET · CORD',   sizes: BRACELET_SIZES,
    blurb: 'Hilo con cierre en oro de 18k. Ligereza íntima que se adapta a la muñeca como una segunda piel.' },
  { sub: 'Esferas Diamantadas Dala&Co', id: 'DAL-BR-BAL', label: 'BRACELET · BEADS',  sizes: BRACELET_SIZES, image: 'assets/pulsera-balines-dala.webp',
    blurb: 'Esferas diamantadas en oro de 18k. Destellos vivos en cada movimiento de la muñeca.' },
  { sub: 'Eslabón Dala&Co', id: 'DAL-BR-ESL', label: 'BRACELET · LINK',   sizes: BRACELET_SIZES,
    blurb: 'Eslabón en oro de 18k pulido a espejo. Brillo limpio, gesto seguro.' },
  { sub: 'Regina Dala&Co',  id: 'DAL-BR-RIG', label: 'BRACELET · PEARL',   sizes: BRACELET_SIZES, image: 'assets/pulsera-perla-imperial.webp',
    blurb: 'Perlas naturales con medallón de la Virgen en oro 18k. Pureza, devoción y elegancia en una sola pieza.' },
  { sub: 'Epure', id: 'DAL-BR-EPU', prefix: 'Pulso', label: 'BRACELET · BANGLE', sizes: ['19 cm'],
    blurb: 'La sofisticación no necesita excesos. Esta pulsera rígida en oro rosa refleja la esencia de Dala&Co a través de un diseño limpio, equilibrado y atemporal. Una joya creada para acompañar cada día con elegancia, convirtiéndose en un símbolo de distinción y estilo refinado. Medida 19 cm · ancho 4 mm, oro rosa de 18k.' },
];

const PRETO_LEATHER_VARIANTS = [
  { sub: 'San Miguel Arcángel', id: 'PRT-LC-SMG', prefix: 'Cadena', label: 'CHAIN · SAN MIGUEL', sizes: ['55 cm'], image: 'assets/cadena-san-miguel-preto-3.jpg',
    images: ['assets/cadena-san-miguel-preto-3.jpg', 'assets/cadena-san-miguel-preto.png'],
    blurb: 'Oro rosa y blanco de textura rústica, engastado en circones negros y coronado por el Arcángel San Miguel. Alta joyería de la casa, concebida bajo pedido para resaltar tu presencia en los momentos de verdadero lujo. Medida 55 cm.' },
  { sub: 'Línea Preto',      id: 'PRT-LC-LIN', label: 'BRACELET · LEATHER', sizes: BRACELET_SIZES, image: 'assets/pulsera-cuero-preto.webp',
    blurb: 'Cuero trenzado premium con eslabones en oro y piedras negras. Masculino, sólido, con carácter.' },
  { sub: 'Rouge Preto',     id: 'PRT-LC-CAU', label: 'BRACELET · ROUGE',   sizes: BRACELET_SIZES, image: 'assets/pulsera-elite-rouge.webp',
    blurb: 'Caucho rojo con herradura pavé en oro. Suerte, carácter y presencia en una sola pieza.' },
  { sub: 'Solaris Preto',    id: 'PRT-LC-LIS', label: 'BRACELET · SOLARIS', sizes: BRACELET_SIZES, image: 'assets/pulsera-elite-solaris.webp',
    blurb: 'Caucho naranja con Virgen de Guadalupe pavé en oro. Devoción luminosa, energía solar.' },
  { sub: 'Monarch Preto',    id: 'PRT-LC-DOB', label: 'BRACELET · MONARCH', sizes: BRACELET_SIZES, image: 'assets/pulsera-elite-monarch.webp',
    blurb: 'Caucho negro con corona pavé en oro. Autoridad silenciosa, realeza sin ostentación.' },
];

/* Dijes · placeholders genéricos (sin imagen → "Consultar precio").
   Rellena sub/blurb y añade image/precio cuando tengas las piezas. */
const PRETO_DIJE_VARIANTS = [
  { sub: 'Modelo I',   id: 'PRT-DJ-001', label: 'CHARM · ONYX',
    blurb: 'Dije en oro de Chocó.' },
  { sub: 'Modelo II',  id: 'PRT-DJ-002', label: 'CHARM · ONYX',
    blurb: 'Dije en oro de Chocó.' },
  { sub: 'Modelo III', id: 'PRT-DJ-003', label: 'CHARM · ONYX',
    blurb: 'Dije en oro de Chocó.' },
];

const DALA_DIJE_VARIANTS = [
  { sub: 'Modelo I',   id: 'DAL-DJ-001', label: 'CHARM · 18k',
    blurb: 'Dije en oro de 18k.' },
  { sub: 'Modelo II',  id: 'DAL-DJ-002', label: 'CHARM · 18k',
    blurb: 'Dije en oro de 18k.' },
  { sub: 'Modelo III', id: 'DAL-DJ-003', label: 'CHARM · 18k',
    blurb: 'Dije en oro de 18k.' },
];

const LINES = [
  {
    key: 'preto',
    name: 'Preto',
    num: '— Línea I',
    tagline: 'Lo urbano hecho oro. Presencia, fuerza, identidad nocturna.',
    products: [
      { id: 'PRT-CH-001', name: 'Cadenas Preto', label: 'CHAIN · ONYX', size: 'c-1', variants: PRETO_CHAIN_VARIANTS, variantPrefix: 'Cadena', image: 'assets/cadena-san-miguel-preto-3.jpg',
        desc: 'Cadena de cuentas en ónix negro y oro de Chocó, montada eslabón a eslabón. Una pieza de presencia nocturna, pensada para llevarse cerca de la piel.' },
      { id: 'PRT-RO-005', name: 'Rosarios Preto',       label: 'ROSARY · ONYX',        size: 'c-5', variants: PRETO_ROSARY_VARIANTS, variantPrefix: 'Rosario', image: 'assets/preto-hero.jpg',
        desc: 'Rosario en ónix negro y oro de Chocó, rematado con un crucifijo tallado a mano. Devoción y presencia en una sola pieza, pensada para llevarse cerca del pecho.' },
      { id: 'PRT-RG-003', name: 'Anillos Preto',        label: 'RING · BLACK ZIRCON',  size: 'c-2', variants: PRETO_RING_VARIANTS, variantPrefix: 'Anillo Preto',
        desc: 'Anillos en oro con circón negro. Cuatro carácteres —liso, cubano, rústico y sacro— para una misma identidad urbana.' },
      { id: 'PRT-BR-007', name: 'Pulseras Preto', label: 'BRACELET · GOLD', size: 'c-3', variants: PRETO_BRACELET_VARIANTS, variantPrefix: 'Pulsera',
        desc: 'Pulseras en oro de Chocó. Cuatro estilos —hilo, balines, eslabón y rígida— para cada carácter.' },
      { id: 'PRT-LC-001', name: 'Preto Elite', label: 'BRACELET · LEATHER', size: 'c-3', variants: PRETO_LEATHER_VARIANTS, variantPrefix: 'Pulsera',
        desc: 'Pulseras en cuero y caucho premium con herrajes en oro de Chocó. Para quien lleva el carácter en la muñeca.' },
      { id: 'PRT-EA-011', name: 'Pendientes Preto',     label: 'EARRINGS · ONYX',      size: 'c-4', variants: PRETO_EARRING_VARIANTS, variantPrefix: 'Pendiente',
        desc: 'Pendientes en ónix negro y oro de Chocó. Un punto de luz oscura que enmarca el rostro con sobriedad absoluta, en cuatro estilos de autor.' },
      /* Dijes Preto — ocultos hasta tener piezas reales (placeholder). Reactivar cuando existan.
      { id: 'PRT-DJ-000', name: 'Dijes Preto', label: 'CHARM · ONYX', size: 'c-6', variants: PRETO_DIJE_VARIANTS, variantPrefix: 'Dije',
        desc: 'Dijes en oro de Chocó, para personalizar cadenas y pulseras.' },
      */
    ],
  },
  {
    key: 'dala',
    name: 'Dala&Co',
    num: '— Línea II',
    tagline: 'Sofisticación íntima. Piezas únicas que reflejan tu esencia.',
    products: [
      { id: 'DAL-CH-002', name: 'Cadenas Dala&Co',       label: 'CHAIN · 18k GOLD',    size: 'd-1', variants: DALA_CHAIN_VARIANTS, variantPrefix: 'Cadena',
        desc: 'Toda la cadenería de la casa, reunida: de las piezas insignia —San Miguel, Hojuelas, Militar— a los clásicos de eslabón, en su acabado en oro de 18k y en oro de Chocó. Equilibrio de peso, brillo y permanencia.' },
      { id: 'DAL-RO-025', name: 'Rosarios Dala&Co',      label: 'ROSARY · 18k GOLD',   size: 'd-6', variants: DALA_ROSARY_VARIANTS, variantPrefix: 'Rosario',
        desc: 'Rosario en oro de 18k pulido, con cuentas torneadas y crucifijo de la casa. Una oración hecha joya, para conservar como herencia.' },
      { id: 'DAL-RG-014', name: 'Anillos Dala&Co',       label: 'RING · 18k',          size: 'd-2', variants: DALA_RING_VARIANTS, variantPrefix: 'Anillo Dala&Co',
        desc: 'Anillos en oro de 18k. La sencillez y el brillo como lujo absoluto, en una familia de acabados irrepetibles — del clásico liso a los circones, los tres oros y el solitario.' },
      { id: 'DAL-BR-018', name: 'Pulseras Dala&Co', label: 'BRACELET · 18k', size: 'd-3', variants: DALA_BRACELET_VARIANTS, variantPrefix: 'Pulsera',
        desc: 'Pulseras en oro de 18k. Cuatro acabados que van desde lo íntimo hasta lo luminoso.' },
      { id: 'DAL-EA-021', name: 'Pendientes Dala&Co',    label: 'EARRINGS · GOLD',     size: 'd-4', variants: DALA_EARRING_VARIANTS, variantPrefix: 'Pendiente',
        desc: 'Pendientes en oro de 18k. Una caricia de luz cálida, hecha para acompañar el día y la noche, en cinco estilos de autor.' },
      /* Dijes Dala&Co — ocultos hasta tener piezas reales (placeholder). Reactivar cuando existan.
      { id: 'DAL-DJ-000', name: 'Dijes Dala&Co', label: 'CHARM · 18k', size: 'd-7', variants: DALA_DIJE_VARIANTS, variantPrefix: 'Dije',
        desc: 'Dijes en oro de 18k, para personalizar sus piezas.' },
      */
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
          name: `${v.prefix || prefix} ${v.sub}`,
          col: colLabel,
          label: v.label,
          line: line.key,
          parent: p.id,
          sizes: v.sizes,
          defaultSizeIndex: v.defaultSizeIndex,
          note: v.note,
          desc: v.blurb,
          image: v.image || (vi === 0 ? p.image : null) || null,
          images: v.images || null,
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
      name: `${v.prefix || prefix} ${v.sub}`,
      label: v.label,
      image: v.image || (i === 0 ? p.image : null) || null,
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
/* ── Cartas vacías (sin foto) ─────────────────────────────────
   Las piezas sin imagen NO se exhiben al público; permanecen en
   el catálogo (código) para saber dónde irán cuando lleguen sus
   fotos. Preto Elite (bajo encargo) sí se muestra: su carta usa
   la ficha técnica de la casa, no una foto de producto. */
const HIDE_EMPTY = true;
function hasPhoto(p){ return !!(p && (p.image || (p.images && p.images.length))); }
function isShown(p){ return !HIDE_EMPTY || hasPhoto(p) || isEliteId(p && p.id); }

/* Portada de una familia: si la familia no tiene foto propia, se usa la
   primera de sus variantes que sí tenga. Así una categoría entera (p. ej.
   "Anillos Preto") no desaparece del catálogo por no tener foto de grupo,
   y aun así ninguna tarjeta sale vacía. Si NINGUNA variante tiene foto,
   la familia no se exhibe. */
function familyCover(p){
  if (!p) return null;
  if (p.image) return p.image;
  const v = (p.variants || []).find(hasPhoto);
  return v ? v.image : null;
}
function familyShown(p){
  if (!HIDE_EMPTY) return true;
  if (isEliteId(p && p.id)) return true;
  return !!familyCover(p) || (p.variants || []).some(v => isEliteId(v.id));
}

const FEATURED_POOL = CATALOG.filter(isShown);
const ELITE_IDS = FEATURED_POOL.filter(p => String(p.id).startsWith('PRT-LC-')).map(p => p.id);
const REST_IDS  = FEATURED_POOL.filter(p => !String(p.id).startsWith('PRT-LC-')).map(p => p.id);

function pickFeatured() {
  const stored = localStorage.getItem('preto-featured-ids-v2');
  if (stored) {
    try {
      const ids = JSON.parse(stored);
      const resolved = ids.map(id => CATALOG.find(p => p.id === id)).filter(Boolean);
      if (resolved.length === 5) return resolved;
    } catch(e) {}
  }
  // Primera visita — elige y fija 2 Preto Elite + 3 al azar
  const elite = shuffleArr(ELITE_IDS).slice(0, 2);
  const rest  = shuffleArr(REST_IDS).slice(0, 3);
  const ids   = shuffleArr([...elite, ...rest]);
  localStorage.setItem('preto-featured-ids-v2', JSON.stringify(ids));
  return ids.map(id => CATALOG.find(p => p.id === id)).filter(Boolean);
}
const FEATURED = pickFeatured();

function makePcard(p, clone) {
  const el = document.createElement('article');
  el.className = 'pcard';
  el.dataset.pid = p.id;
  if (clone) { el.setAttribute('aria-hidden', 'true'); el.tabIndex = -1; }
  else { el.id = 'card-' + p.id; el.setAttribute('data-screen-label', `${p.lineName} · ${p.name}`); }

  const tag = NEW_IDS.has(p.id) ? `<span class="pcard-tag">Nuevo</span>` : '';
  const art = p.image
    ? `<div class="pcard-art ${imgArtClass(p.image)}" role="img" aria-label="${artAria(p.name)}" style="background-image:url('${cardSrc(p.image)}')"></div>`
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
      <p class="pcard-cta">${priceLabelFor(p)}</p>
    </div>
  `;
  host.appendChild(el);
}
// 5 piezas variadas (2 de Preto Elite + 3 al azar), deslizables a gusto.
FEATURED.forEach((p) => makePcard(p, false));

/* ── Carousel: navigation, drag, progress ──────────────────── */
(function initCarousel(){
  const track = host;
  const panel = track.closest('.carousel-panel');
  const prev  = document.getElementById('carPrev');
  const next  = document.getElementById('carNext');
  const bar   = document.getElementById('carBar');
  if (!track || !panel) return;

  let offset = 0;          // current translateX (<= 0)
  function maxOffset(){ return Math.min(0, panel.clientWidth - track.scrollWidth); }
  function clamp(v){ return Math.max(maxOffset(), Math.min(0, v)); }
  function apply(){
    track.style.transform = 'translate3d(' + offset + 'px,0,0)';
    if (bar) {
      const span = -maxOffset();
      const pct = span > 0 ? (-offset / span) : 0;
      bar.style.transform = 'translateX(' + (pct * 400) + '%)';
    }
  }

  // Drag-to-scroll (pointer cubre ratón + táctil). Se bloquea el eje en
  // el primer movimiento: si el gesto es vertical, se suelta de inmediato
  // para que la página baje sin que el carrusel se mueva de lado.
  let down = false, startX = 0, startY = 0, startOff = 0, moved = false, axis = null;
  panel.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    down = true; moved = false; axis = null;
    startX = e.clientX; startY = e.clientY; startOff = offset;
    track.style.transition = '';
  });
  window.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - startX, dy = e.clientY - startY;
    if (axis === null) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;      // espera intención clara
      axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      if (axis === 'x') panel.classList.add('dragging');
      else { down = false; return; }                         // gesto vertical → scroll normal de la página
    }
    if (Math.abs(dx) > 4) moved = true;
    offset = clamp(startOff + dx);
    apply();
  });
  window.addEventListener('pointerup', () => {
    down = false; panel.classList.remove('dragging');
  });
  // Si el navegador cancela el gesto (al decidir scroll), no dejar el drag colgado.
  window.addEventListener('pointercancel', () => {
    down = false; panel.classList.remove('dragging');
  });
  // Swallow the click that ends a drag so it doesn't open a product.
  track.addEventListener('click', e => {
    if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; }
  }, true);

  // Rueda / trackpad: solo desplaza el carrusel en gestos claramente
  // horizontales. El scroll vertical pasa intacto a la página (no se
  // secuestra), para que bajar por la sección no mueva las tarjetas.
  panel.addEventListener('wheel', e => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;    // vertical → deja pasar el scroll
    const nv = clamp(offset - e.deltaX);
    if (nv !== offset) { offset = nv; track.style.transition = ''; apply(); e.preventDefault(); }
  }, { passive: false });

  // Prev / next step by one card.
  function step(dir){
    const card = track.querySelector('.pcard');
    const w = card ? card.offsetWidth + 22 : 300;
    offset = clamp(offset - dir * w);
    track.style.transition = 'transform 0.5s cubic-bezier(.2,.7,.2,1)';
    apply();
    setTimeout(() => { track.style.transition = ''; }, 520);
  }
  if (prev) { prev.style.display = 'flex'; prev.addEventListener('click', () => step(-1)); }
  if (next) { next.style.display = 'flex'; next.addEventListener('click', () => step(1)); }
  const prog = document.querySelector('.carousel-progress');
  if (prog) prog.style.display = '';

  window.addEventListener('resize', () => { offset = clamp(offset); apply(); });
  window.addEventListener('load', () => { offset = clamp(offset); apply(); });

  /* ── Slide automático, fluido (móvil / tablet / desktop) ─────
     Avanza una pieza cada pocos segundos y, al llegar al final,
     regresa con suavidad al inicio. Se pausa mientras el usuario
     arrastra o pasa el cursor por encima, y se reanuda solo. */
  track.style.willChange = 'transform';
  let autoTimer = null, autoPaused = false;
  function autoStep(){
    if (autoPaused || down) return;
    if (document.hidden) return;
    if (offset <= maxOffset() + 2) {            // llegó al final → vuelve al inicio
      offset = 0;
      track.style.transition = 'transform 0.9s cubic-bezier(.2,.7,.2,1)';
      apply();
      setTimeout(() => { track.style.transition = ''; }, 920);
    } else {
      step(1);
    }
  }
  function startAuto(){ stopAuto(); if (maxOffset() < 0) autoTimer = setInterval(autoStep, 3600); }
  function stopAuto(){ if (autoTimer) { clearInterval(autoTimer); autoTimer = null; } }
  panel.addEventListener('pointerdown', () => { autoPaused = true; });
  window.addEventListener('pointerup',   () => { autoPaused = false; });
  panel.addEventListener('mouseenter',   () => { autoPaused = true; });
  panel.addEventListener('mouseleave',   () => { autoPaused = false; });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) startAuto(); else stopAuto(); });
  window.addEventListener('resize', () => { startAuto(); });
  // Optimización: el auto-avance solo corre cuando el carrusel está a la vista.
  // Ahorra batería y evita repintados en móvil mientras se lee otra sección.
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) startAuto(); else stopAuto(); });
    }, { threshold: 0 }).observe(panel);
  }
  startAuto();

  apply();
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

/* ── PDP · galería de fotos ───────────────────────────────────
   Piezas con más de una foto (`images: [...]`) dejan que el
   cliente vea la joya desde otro ángulo tocando la imagen,
   deslizando (swipe) o usando los puntos/flechas — un "panorama"
   de la pieza que ayuda a decidir. Con una sola foto no aparece
   ningún control (comportamiento intacto para el resto). */
const pdpArtEl = document.getElementById('pdpArt');
const pdpMediaEl = document.querySelector('.pdp-media');
const pdpDotsEl = document.getElementById('pdpDots');
const pdpPrevImgBtn = document.getElementById('pdpPrevImg');
const pdpNextImgBtn = document.getElementById('pdpNextImg');
let pdpGalleryImages = [];
let pdpGalleryIndex = 0;
let pdpGalleryName = '';

function applyPdpImage(src) {
  if (src) {
    pdpArtEl.className = 'pdp-art' + (pdpGalleryImages.length > 1 ? ' has-gallery' : '') + ' ' + imgArtClass(src);
    pdpArtEl.style.backgroundImage = `url('${src}')`;
    pdpArtEl.setAttribute('role', 'img');
    pdpArtEl.setAttribute('aria-label', pdpGalleryImages.length > 1
      ? `${pdpGalleryName} — foto ${pdpGalleryIndex + 1} de ${pdpGalleryImages.length}`
      : pdpGalleryName);
    pdpArtEl.removeAttribute('data-label');
  } else {
    pdpArtEl.className = 'pdp-art';
    pdpArtEl.style.backgroundImage = '';
    pdpArtEl.setAttribute('data-label', pdpGalleryName);
  }
}
function renderPdpGallery(images, name, placeholderLabel) {
  pdpGalleryImages = (images || []).filter(Boolean);
  pdpGalleryIndex = 0;
  pdpGalleryName = name || '';
  const multi = pdpGalleryImages.length > 1;
  if (pdpMediaEl) pdpMediaEl.classList.toggle('has-gallery', multi);
  if (pdpDotsEl) {
    pdpDotsEl.innerHTML = multi
      ? pdpGalleryImages.map((_, i) => `<button type="button" class="pdp-dot${i === 0 ? ' active' : ''}" data-i="${i}" aria-label="Ver foto ${i + 1}"></button>`).join('')
      : '';
  }
  if (pdpGalleryImages.length) applyPdpImage(pdpGalleryImages[0]);
  else { pdpGalleryName = placeholderLabel || ''; applyPdpImage(null); }
}
function goPdpGallery(i) {
  if (pdpGalleryImages.length < 2) return;
  pdpGalleryIndex = (i + pdpGalleryImages.length) % pdpGalleryImages.length;
  applyPdpImage(pdpGalleryImages[pdpGalleryIndex]);
  if (pdpDotsEl) pdpDotsEl.querySelectorAll('.pdp-dot').forEach((d, i2) => d.classList.toggle('active', i2 === pdpGalleryIndex));
}
let pgStartX = 0, pgDX = 0, pgDragging = false, pgLastSwipe = 0;
pdpArtEl.addEventListener('pointerdown', e => {
  if (pdpGalleryImages.length < 2) return;
  pgDragging = true; pgStartX = e.clientX; pgDX = 0;
});
pdpArtEl.addEventListener('pointermove', e => {
  if (!pgDragging) return;
  pgDX = e.clientX - pgStartX;
});
window.addEventListener('pointerup', () => {
  if (!pgDragging) return;
  pgDragging = false;
  if (Math.abs(pgDX) > 40) { goPdpGallery(pdpGalleryIndex + (pgDX < 0 ? 1 : -1)); pgLastSwipe = Date.now(); }
  pgDX = 0;
});
pdpArtEl.addEventListener('click', () => {
  if (pdpGalleryImages.length < 2) return;
  if (Date.now() - pgLastSwipe < 300) return;
  goPdpGallery(pdpGalleryIndex + 1);
});
pdpDotsEl && pdpDotsEl.addEventListener('click', e => {
  const b = e.target.closest('.pdp-dot');
  if (!b) return;
  e.stopPropagation();
  goPdpGallery(Number(b.dataset.i));
});
pdpPrevImgBtn && pdpPrevImgBtn.addEventListener('click', e => { e.stopPropagation(); goPdpGallery(pdpGalleryIndex - 1); });
pdpNextImgBtn && pdpNextImgBtn.addEventListener('click', e => { e.stopPropagation(); goPdpGallery(pdpGalleryIndex + 1); });

function openProduct(id) {
  const p = COLLECTIONS.find(x => x.id === id);
  if (!p) return;

  // Meta Pixel · vista de producto (ViewContent)
  if (typeof fbq === 'function') {
    const vcVal = (typeof minPriceFor === 'function' ? minPriceFor(p) : null) || 0;
    fbq('track', 'ViewContent', {
      content_ids: [p.id],
      content_name: p.name,
      content_type: 'product',
      content_category: p.col || undefined,
      currency: 'COP',
      value: vcVal
    });
  }

  const art = pdpArtEl;
  art.dataset.pid = p.id;
  renderPdpGallery(p.images && p.images.length ? p.images : (p.image ? [p.image] : []), p.name, p.label);

  document.getElementById('pdpRef').textContent = `Ref. ${p.id} · ${p.col}`;
  document.getElementById('pdpName').textContent = p.name;
  document.getElementById('pdpSpec').textContent = p.label;
  document.getElementById('pdpDesc').textContent = p.desc || '';

  // Precio "desde" (punto 03 CRO) — moneda COP de Colombia
  const pdpPriceEl = document.getElementById('pdpPrice');
  if (pdpPriceEl) {
    if (isEliteId(p.id)) {
      pdpPriceEl.innerHTML = eliteCtaMarkup(p.id, p.name, true);
    } else {
      const pn = minPriceFor(p);
      pdpPriceEl.innerHTML = (pn == null)
        ? waPriceBtn(p.id, p.name)
        : (isExactPriceId(p.id)
            ? `<span class="pdp-price-amt">${fmtCOP(pn)}</span><span class="pdp-price-cur">COP</span>`
            : `<span class="pdp-price-from">Desde</span><span class="pdp-price-amt">${fmtCOP(pn)}</span><span class="pdp-price-cur">COP</span>`);
    }
  }

  // Variants / size / note
  const vWrap = document.getElementById('pdpVariants');
  let selectedSize = null;
  if (p.variants) {
    vWrap.innerHTML = `
      <span class="pdp-vlabel">${String(p.variants.length).padStart(2,'0')} variantes</span>
      <div class="pdp-vchips">${p.variants.map(v => `<span class="pdp-vchip">${v.sub}</span>`).join('')}</div>`;
    vWrap.style.display = '';
  } else if (p.sizes && p.sizes.length) {
    const sp = sizePricesFor(p.id);
    const def = (typeof p.defaultSizeIndex === 'number') ? p.defaultSizeIndex : Math.min(1, p.sizes.length - 1);
    selectedSize = p.sizes[def];
    vWrap.innerHTML = `
      <span class="pdp-vlabel">Medida</span>
      <div class="pdp-size-row">${p.sizes.map((s, i) =>
        `<button class="pdp-size-chip${i === def ? ' active' : ''}" data-size="${s}">${s}</button>`).join('')}</div>${p.note ? `<p class="pdp-note"><span class="note-glyph">✦</span> ${p.note}</p>` : ''}${/-RG-/.test(p.id) ? '<a class="pdp-size-guide" href="/talla-anillos">¿No conoce su talla? Mídala en su pantalla →</a>' : ''}`;
    vWrap.style.display = '';
    // Al elegir una medida: actualiza precio e imagen (si hay foto por medida).
    const applySize = (s) => {
      selectedSize = s;
      if (pdpPriceEl && !isEliteId(p.id)) {
        const amt = priceForSize(p.id, s);
        pdpPriceEl.innerHTML = (amt != null)
          ? ((sp || isExactPriceId(p.id))
              ? `<span class="pdp-price-amt">${fmtCOP(amt)}</span><span class="pdp-price-cur">COP</span>`
              : `<span class="pdp-price-from">Desde</span><span class="pdp-price-amt">${fmtCOP(amt)}</span><span class="pdp-price-cur">COP</span>`)
          : waPriceBtn(p.id, p.name);
      }
      const img = imageForSize(p.id, s, null);
      if (img) {
        art.className = 'pdp-art ' + imgArtClass(img);
        art.style.backgroundImage = `url('${img}')`;
        art.setAttribute('role', 'img');
        art.setAttribute('aria-label', p.name);
        art.removeAttribute('data-label');
      }
    };
    vWrap.querySelectorAll('.pdp-size-chip').forEach(b => {
      b.addEventListener('click', () => {
        vWrap.querySelectorAll('.pdp-size-chip').forEach(c => c.classList.remove('active'));
        b.classList.add('active');
        applySize(b.dataset.size);
      });
    });
    applySize(selectedSize);
  } else if (p.note) {
    vWrap.innerHTML = `
      <span class="pdp-vlabel">Medida</span>
      <p class="pdp-note"><span class="note-glyph">✦</span> ${p.note}</p>${/-RG-/.test(p.id) ? '<a class="pdp-size-guide" href="/talla-anillos">¿No conoce su talla? Mídala en su pantalla →</a>' : ''}`;
    vWrap.style.display = '';
  } else if (/-RG-/.test(p.id) && !p.variants) {
    vWrap.innerHTML = `<a class="pdp-size-guide" href="/talla-anillos">¿No conoce su talla? Mídala en su pantalla →</a>`;
    vWrap.style.display = '';
  } else {
    vWrap.innerHTML = '';
    vWrap.style.display = 'none';
  }

  // Primary action
  const primary = document.getElementById('pdpPrimary');
  primary.textContent = p.variants ? 'Ver la familia completa' : 'Añadir al carrito';
  primary.onclick = () => {
    closeProduct();
    const btn = primary;
    if (p.variants) openCategory(p.id);
    else setTimeout(() => addToQuote(p.id, selectedSize, btn), 40);
  };

  // WhatsApp action
  document.getElementById('pdpWa').onclick = () => {
    openWhatsApp([{ id: p.id, name: p.name, col: p.col, size: selectedSize, note: p.note || null, price: priceForSize(p.id, selectedSize), qty: 1 }]);
  };

  /* Extras de la ficha (auditoría ago-2026): plazo y disponibilidad,
     certificado mostrado y el oro de la pieza al precio de hoy.
     La implementación vive en pdp-extras.js — si no está cargado, la
     ficha funciona igual que antes. */
  if (typeof window.PRETO_PDP_EXTRAS === 'function') {
    try { window.PRETO_PDP_EXTRAS(p); } catch (e) { console.warn('pdp-extras:', e); }
  }

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

/* ── Pilares "Explora" → primero dejan ELEGIR la colección ────
   Joyería → elegir entre Preto y Dala&Co · Accesorios → Dala&Co o
   Noir. Al escoger, se abre esa colección; "Volver" regresa al
   selector. Todo con la transición fluida de la casa. Se aplica
   tanto a la imagen como al botón (ambos llevan data-explora). */
const CHOOSERS = {
  joyeria: {
    eyebrow: 'Joyer\u00eda',
    title: 'Elige tu <span class="script">l\u00ednea</span>',
    sub: 'Dos mundos, un mismo oro. Descubre la colecci\u00f3n que va contigo.',
    options: [
      { key: 'preto', name: 'Preto', meta: '\u2014 L\u00ednea I', mark: 'Preto<span class="script">.</span>',
        tagline: 'Lo urbano hecho oro. \u00d3nix, presencia, identidad nocturna.' },
      { key: 'dala', name: 'Dala&Co', meta: '\u2014 L\u00ednea II', mark: 'Dala<span class="script">&amp;Co</span>',
        tagline: 'Sofisticaci\u00f3n \u00edntima en oro de 18k. Piezas que reflejan tu esencia.' },
    ],
  },
  accesorios: {
    eyebrow: 'Accesorios',
    title: 'Elige tu <span class="script">colecci\u00f3n</span>',
    sub: 'El detalle que completa el look. Escoge por d\u00f3nde empezar.',
    options: [
      { key: 'accesorios', name: 'Dala&Co', meta: '\u2014 Accesorios', mark: 'Dala<span class="script">&amp;Co</span>',
        tagline: 'Accesorios de alta gama para completar el look.' },
      { key: 'noir', name: 'Noir', meta: '\u2014 Accesorios', mark: 'Noir',
        tagline: 'La diferencia est\u00e1 en los detalles. Sastrer\u00eda en acabado noir.' },
    ],
  },
};
document.querySelectorAll('[data-explora]').forEach(a => {
  a.addEventListener('click', (e) => {
    const cfg = CHOOSERS[a.dataset.explora];
    if (!cfg) return;
    e.preventDefault();
    playTransition(() => openChooser(cfg));
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
  el.classList.toggle('is-empty', n === 0);
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
  else quote.push({ key, id, name: p.name, col, size: size || null, note: p.note || null, desc: p.desc || null, price: priceForSize(id, size), qty: 1, image: imageForSize(id, size, p.image || null) });
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
        <p>Aún no ha reunido ninguna pieza. Deje que una le llame la atención — la casa la tendrá lista.</p>
      </div>`;
    return;
  }
  c.innerHTML = quote.map(item => `
    <div class="q-item">
      <div class="thumb${item.image ? ' has-image' : ''}"${item.image ? ` style="background-image:url('${item.image}')"` : ''}></div>
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
  // Cerrar paneles de cuenta/favoritos y su velo para no dejar un velo
  // huérfano sobre el menú (causaba que el icono "no respondiera").
  const pv = document.getElementById('panelVeil');
  if (pv) pv.classList.remove('open');
  ['wishDrawer', 'acctDrawer'].forEach(id => {
    const d = document.getElementById(id);
    if (d) { d.classList.remove('open'); d.setAttribute('aria-hidden', 'true'); }
  });
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

/* Mantener el menú visible mientras se navega por las colecciones:
   al abrir/cerrar la capa de colecciones, marcamos el body para
   elevar el nav por encima de ella (ver styles.css → body.cat-open). */
if (catOverlay) {
  const syncCatNav = () => document.body.classList.toggle('cat-open', catOverlay.classList.contains('open'));
  new MutationObserver(syncCatNav).observe(catOverlay, { attributes: true, attributeFilter: ['class'] });
  syncCatNav();
}

/* ── Line overview: "Descubrir Preto / Dala&Co" → what the line offers ── */
function openLine(lineKey, backTo) {
  const line = [...LINES, ...ACCESORIOS].find(l => l.key === lineKey);
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
      ${[...line.products].filter(familyShown).sort((a, b) => (b.image ? 1 : 0) - (a.image ? 1 : 0)).map(p => {
        const hasVar = !!p.variants;
        return `
          <article class="var-card line-card" data-id="${p.id}">
            ${varArtHTML(familyCover(p), p.images, p.label, p.name)}
            <div class="var-body">
              <div class="var-name">
                <h3>${p.name}</h3>
                <span class="var-ref">Ref. ${p.id}</span>
              </div>
              <p class="var-blurb">${p.desc}</p>
              <p class="var-price">${priceLabelFor(p)}</p>
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
  document.getElementById('catBack').addEventListener('click', typeof backTo === 'function' ? backTo : closeCategory);

  catShell.scrollTop = 0;
  catOverlay.scrollTop = 0;
  catOverlay.classList.add('open');
  catOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

/* ── Selector de colección (paso previo a la lista de familias) ──
   Reutiliza el shell del catálogo. Cada opción abre openLine con un
   "Volver" que regresa a este mismo selector. */
function openChooser(cfg) {
  const groups = [...LINES, ...ACCESORIOS];
  catShell.innerHTML = `
    <header class="cat-head">
      <button class="cat-back" id="catBack" aria-label="Volver">
        <span class="arr">\u2190</span> Volver
      </button>
      <div class="cat-meta">
        <span class="eyebrow">${cfg.eyebrow}</span>
        <span class="dot-divider"></span>
        <span class="eyebrow eyebrow-bone">${cfg.options.length} colecciones</span>
      </div>
      <h2 class="cat-title">${cfg.title}</h2>
      <p class="cat-sub">${cfg.sub}</p>
    </header>
    <div class="cat-grid chooser-grid">
      ${cfg.options.map(o => {
        const grp = groups.find(g => g.key === o.key);
        const n = grp ? grp.products.length : 0;
        return `
          <article class="var-card chooser-card" data-key="${o.key}">
            <div class="var-art chooser-art"><span class="chooser-mark">${o.mark}</span></div>
            <div class="var-body">
              <div class="var-name">
                <h3>${o.name}</h3>
                <span class="var-ref">${o.meta}</span>
              </div>
              <p class="var-blurb">${o.tagline}</p>
              <button class="var-add chooser-go" data-key="${o.key}">
                <span>Ver ${n} ${n === 1 ? 'familia' : 'familias'}</span>
                <span class="arrow"></span>
              </button>
            </div>
          </article>`;
      }).join('')}
    </div>
  `;

  const pick = (key) => openLine(key, () => openChooser(cfg));
  catShell.querySelectorAll('.chooser-card').forEach(card => {
    card.addEventListener('click', e => { if (e.target.closest('.chooser-go')) return; pick(card.dataset.key); });
  });
  catShell.querySelectorAll('.chooser-go').forEach(b => {
    b.addEventListener('click', e => { e.stopPropagation(); pick(b.dataset.key); });
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

  // Sin foto no se exhibe: una carta vacía no deja decidir nada. Se van
  // los placeholders ("Próximamente") y las variantes que aún no tienen
  // fotografía. Preto Elite es la excepción (bajo encargo, ficha técnica
  // en vez de foto de producto), que ya contempla isShown().
  const catVariants = parent.variants
    .filter(v => !v.placeholder)
    .filter(isShown)
    .slice()
    .sort((a, b) => (b.image ? 1 : 0) - (a.image ? 1 : 0));

  /* Una categoría sin variantes exhibibles sería un callejón sin salida:
     título, "0 variantes" y el vacío. Se manda al catálogo, que siempre
     tiene algo que mostrar. */
  if (!catVariants.length) { location.href = '/joyeria/'; return; }

  // ¿Cuántas variantes visibles tienen precio? Solo mostramos "Ordenar"
  // cuando hay al menos dos piezas con precio publicado para comparar.
  const pricedCount = catVariants.filter(v => unitMinPrice(v.id) != null).length;
  const showSort = pricedCount >= 2;
  let sortMode = 'sug'; // 'sug' (sugerido) | 'asc' (menor→mayor) | 'desc'

  function orderedVariants() {
    if (sortMode === 'sug') return catVariants;
    const dir = sortMode === 'asc' ? 1 : -1;
    return catVariants.slice().sort((a, b) => {
      const pa = unitMinPrice(a.id), pb = unitMinPrice(b.id);
      if (pa == null && pb == null) return 0;
      if (pa == null) return 1;   // piezas sin precio → siempre al final
      if (pb == null) return -1;
      return (pa - pb) * dir;
    });
  }

  function varCardHTML(v) {
    const optionsMarkup = v.sizes ? `
          <div class="size-row" data-product="${v.id}">
            <span class="size-label">Medida</span>
            ${v.sizes.map((s, idx) => `
              <button class="size-chip ${idx === (typeof v.defaultSizeIndex === 'number' ? v.defaultSizeIndex : 1) ? 'active' : ''}" data-size="${s}">${s}</button>
            `).join('')}
          </div>${v.madeToOrder ? `
          <div class="size-made">
            <p class="size-made-note"><span class="note-glyph">✦</span> Talla única en existencia. Otras medidas se elaboran por encargo en el taller de la casa.</p>
            <button type="button" class="size-made-cta" data-size-wa data-id="${v.id}" data-name="${((v.prefix || prefix) + ' ' + v.sub).replace(/"/g, '&quot;')}">
              <span>Hablar con la Maison</span><span class="arrow"></span>
            </button>
          </div>` : ''}${(!v.madeToOrder && v.note) ? `
          <div class="var-note">
            <span class="note-glyph">✦</span>
            <span>${v.note}</span>
          </div>` : ''}` : (v.note ? `
          <div class="var-note">
            <span class="note-glyph">✦</span>
            <span>${v.note}</span>
          </div>` : '');
    return `
          <article class="var-card" data-id="${v.id}">
            ${varArtHTML(v.image, v.images, v.label, (v.prefix || prefix) + ' ' + v.sub)}
            <div class="var-body">
              <div class="var-name">
                <h3>${v.prefix || prefix} <span class="script">${v.sub}</span></h3>
                <span class="var-ref">Ref. ${v.id}</span>
              </div>
              <p class="var-blurb">${v.blurb}</p>
              ${isEliteId(v.id) ? eliteCtaMarkup(v.id, (v.prefix || prefix) + ' ' + v.sub) : `
              <p class="var-price">${priceLabelFor(v)}</p>
              ${optionsMarkup}
              <button class="var-add" data-id="${v.id}">
                <span>Añadir al carrito</span>
                <span class="arrow"></span>
              </button>`}
            </div>
          </article>`;
  }

  const SORT_LABELS = [['sug', 'Sugerido'], ['asc', 'Menor precio'], ['desc', 'Mayor precio']];
  const sortRow = showSort ? `
      <div class="cat-sort" role="group" aria-label="Ordenar por precio">
        <span class="f-label">Ordenar</span>
        <div class="f-chips">
          ${SORT_LABELS.map(o => `<button class="f-chip${o[0] === 'sug' ? ' active' : ''}" data-sort="${o[0]}">${o[1]}</button>`).join('')}
        </div>
      </div>` : '';

  catShell.innerHTML = `
    <header class="cat-head">
      <button class="cat-back" id="catBack" aria-label="Volver">
        <span class="arr">←</span> ${backToLine ? 'Volver a ' + ([...LINES, ...ACCESORIOS].find(l => l.key === backToLine) || {}).name : 'Volver a colecciones'}
      </button>
      <div class="cat-meta">
        <span class="eyebrow">${parent.col}</span>
        <span class="dot-divider"></span>
        <span class="eyebrow eyebrow-bone">${catVariants.length} variantes</span>
      </div>
      <h2 class="cat-title">${head} <span class="script">${tail}</span></h2>
      <p class="cat-sub">Cada pieza nace del mismo oro; cambia su carácter, su gesto, su silencio. Elija la familia que prefiera${catVariants.some(v => v.sizes) ? ' y su medida exacta' : ''}.</p>
      ${sortRow}
    </header>
    ${isEliteId(parent.id) ? eliteSpecPanel() : ''}
    <div class="cat-grid"></div>
  `;

  // Wire interactions inside the overlay (se re-aplica al reordenar).
  function wireGrid() {
    catShell.querySelectorAll('.size-row').forEach(row => {
      row.addEventListener('click', e => {
        const chip = e.target.closest('.size-chip');
        if (!chip) return;
        row.querySelectorAll('.size-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        syncVarCardSize(chip.closest('.var-card'), chip.dataset.size);
      });
    });
    // Estado inicial: precio + imagen de la medida por defecto.
    catShell.querySelectorAll('.var-card').forEach(card => {
      const active = card.querySelector('.size-chip.active');
      if (active) syncVarCardSize(card, active.dataset.size);
    });
    catShell.querySelectorAll('.var-add').forEach(b => {
      b.addEventListener('click', () => {
        const card = b.closest('.var-card');
        const activeSize = card.querySelector('.size-chip.active');
        addToQuote(b.dataset.id, activeSize ? activeSize.dataset.size : null, b);
      });
    });
    catShell.querySelectorAll('.var-card').forEach(card => {
      card.addEventListener('click', e => {
        if (e.target.closest('.var-add') || e.target.closest('.size-row')) return;
        openProduct(card.dataset.id);
      });
    });
  }
  function renderGrid() {
    const grid = catShell.querySelector('.cat-grid');
    if (!grid) return;
    grid.innerHTML = orderedVariants().map(varCardHTML).join('');
    wireGrid();
  }
  renderGrid();

  if (showSort) {
    catShell.querySelectorAll('.cat-sort .f-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        sortMode = chip.dataset.sort;
        catShell.querySelectorAll('.cat-sort .f-chip').forEach(c => c.classList.toggle('active', c === chip));
        renderGrid();
      });
    });
  }

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

/* Cierra las capas de compra (categoría, ficha de producto, búsqueda)
   para que una capa editorial no quede enterrada bajo ellas.
   (Corrige el bug: abrir "El arte de regalar" no mostraba la revista
   porque una ficha/categoría abierta encima —z-index mayor— tapaba el
   overlay de regalos y robaba el clic del botón "Abrir revista".) */
function closeStackedOverlays() {
  try { const o=document.getElementById('pdpOverlay');    if (o && o.classList.contains('open') && typeof closeProduct==='function')  closeProduct();  } catch(_){}
  try { const o=document.getElementById('catOverlay');    if (o && o.classList.contains('open') && typeof closeCategory==='function') closeCategory(); } catch(_){}
  try { const o=document.getElementById('searchOverlay'); if (o && o.classList.contains('open') && typeof closeSearch==='function')   closeSearch();   } catch(_){}
}

/* ── Regalos · El arte de regalar (full-screen overlay) ────── */
const regalosOverlay = document.getElementById('regalosOverlay');
function openRegalos() {
  if (!regalosOverlay) return;
  closeStackedOverlays();
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
  closeStackedOverlays();
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
  closeStackedOverlays();
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
    /* Solo piezas fotografiadas: la selección anterior apuntaba a seis
       piezas sin foto, así que la sección salía llena de cartas vacías. */
    ids: ['PRT-CH-COR', 'PRT-CH-SMG', 'PRT-CH-MIL', 'PRT-RG-NAT', 'PRT-LC-DOB', 'PRT-RO-CRU'],
  },
  ella: {
    eyebrow: 'Regalos · Para ella',
    title: ['Regalos para', 'ella'],
    sub: 'Piezas pensadas para acompañar un nombre, una fecha, una historia. Luz cálida del oro chocoano sobre la piel.',
    ids: ['DAL-CH-LAZ', 'DAL-CH-GLU', 'DAL-RG-SOL', 'DAL-EA-TRE', 'DAL-BR-RIG', 'DAL-EA-CAN'],
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
  /* Sin foto no se exhibe. Si de una selección no queda ninguna pieza
     fotografiada (hoy, los regalos de bebé), se dice con palabras en vez
     de llenar la rejilla de recuadros vacíos. */
  const shownItems = items.filter(isShown);

  catShell.innerHTML = `
    <header class="cat-head">
      <button class="cat-back" id="catBack" aria-label="Volver">
        <span class="arr">←</span> Volver
      </button>
      <div class="cat-meta">
        <span class="eyebrow">${edit.eyebrow}</span>
        <span class="dot-divider"></span>
        <span class="eyebrow eyebrow-bone">${String(shownItems.length).padStart(2,'0')} piezas</span>
      </div>
      <h2 class="cat-title">${edit.title[0]} <span class="script">${edit.title[1]}</span></h2>
      <p class="cat-sub">${edit.sub}</p>
    </header>
    <div class="cat-grid">
      ${!shownItems.length ? `
        <div class="cat-soon">
          <span class="cat-soon-glyph">Preto</span>
          <p>Estamos fotografiando esta selección en el taller.</p>
          <p class="sub">Escríbanos por WhatsApp y le enviamos las piezas disponibles hoy mismo.</p>
        </div>` : ''}
      ${shownItems.sort((a, b) => (b.image ? 1 : 0) - (a.image ? 1 : 0)).map(p => {
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
            ${varArtHTML(familyCover(p), p.images, p.label, p.name)}
            <div class="var-body">
              <div class="var-name">
                <h3>${p.name}</h3>
                <span class="var-ref">Ref. ${p.id}</span>
              </div>
              <p class="var-blurb">${p.desc || ''}</p>
              ${optionsMarkup}
              <button class="var-add" data-id="${p.id}">
                <span>Añadir al carrito</span>
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
    'Hola, quiero finalizar mi compra de las siguientes piezas de Preto by Dala&Co:',
    ''
  ];
  if (!items.length) {
    lines.push('— Quisiera recibir una conversación con un asesor para descubrir la colección.');
  } else {
    let subtotal = 0; let insurable = 0; let allPriced = true;
    items.forEach((it, i) => {
      const sizePart = it.size ? ` · ${it.size}` : '';
      const lineTotal = (it.price != null) ? it.price * it.qty : null;
      if (it.price != null) { subtotal += lineTotal; if (it.kind !== 'giftcard') insurable += lineTotal; } else allPriced = false;
      const pricePart = (it.price != null) ? ` — ${fmtCOP(lineTotal)}` : ' — Consultar precio';
      lines.push(`${String(i+1).padStart(2,'0')}. ${it.name}${sizePart} (Ref. ${it.id}) · ×${it.qty}${pricePart}`);
      if (it.note) lines.push(`    ↳ ${it.note}`);
    });
    lines.push('');
    if (subtotal > 0) {
      const seguro = Math.round(insurable * INSURANCE_RATE);
      lines.push(`Subtotal: ${fmtCOP(subtotal)}`);
      if (seguro > 0) lines.push(`Seguro (${Math.round(INSURANCE_RATE*100)}%): ${fmtCOP(seguro)}`);
      lines.push(`TOTAL: ${fmtCOP(subtotal + seguro)}${allPriced ? '' : ' (algunas piezas con precio a consultar)'}`);
      lines.push('Envío nacional sin costo.');
      lines.push('');
    }
    lines.push('Quedo a la espera de una atención personalizada. Gracias.');
  }
  return lines.join('\n');
}
function openWhatsApp(items) {
  // Meta Pixel · contacto por WhatsApp (botón flotante, ficha, Elite)
  if (typeof fbq === 'function') fbq('track', 'Contact');
  const msg = encodeURIComponent(buildWaMessage(items));
  window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank', 'noopener');
}
/* "Consultar precio" (fichas sin precio aún) → WhatsApp. Captura en fase
   de captura para ganarle al click de la tarjeta (abrir producto/familia). */
document.addEventListener('click', e => {
  const b = e.target.closest('[data-price-wa]');
  if (!b) return;
  e.preventDefault();
  e.stopPropagation();
  openPriceInquiry(b.dataset.id, b.dataset.name);
}, true);

/* "Hablar con la Maison" en piezas de talla única → WhatsApp (encargo) */
document.addEventListener('click', e => {
  const b = e.target.closest('[data-size-wa]');
  if (!b) return;
  e.preventDefault();
  e.stopPropagation();
  openSizeInquiry(b.dataset.id, b.dataset.name);
}, true);

/* Botones de mensaje exclusivo (Preto Elite) → WhatsApp */
document.addEventListener('click', e => {
  const b = e.target.closest('[data-elite-wa]');
  if (!b) return;
  e.preventDefault();
  e.stopPropagation();
  openWhatsApp([{ id: b.dataset.id, name: b.dataset.name || 'Pieza Preto Elite', qty: 1 }]);
});
// The cotización is sent through the facturación form (datos + privacidad), which
// then opens WhatsApp with the summary. The quote already lives in localStorage.
document.getElementById('sendWa').addEventListener('click', () => {
  try { localStorage.setItem('preto.quoteSentAt', String(Date.now())); } catch(e){}
  if (window.PretoAccount && window.PretoAccount.markQuoteSent) window.PretoAccount.markQuoteSent();
  window.location.href = '/facturacion';
});
document.getElementById('waBtn').addEventListener('click', () => {
  // "Hablar con la Maison": SIEMPRE abre el chat de WhatsApp de la casa
  // (nunca el carrito). openWhatsApp() dispara fbq('track','Contact')
  // ANTES de abrir el enlace, y abre en pestaña nueva, así el pixel
  // alcanza a enviarse. Si hay piezas en el carrito, las incluye en el
  // mensaje para el concierge; si no, envía el saludo general.
  openWhatsApp(quote.length ? quote : []);
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
    // El panel de navegación NUNCA se oculta (a petición): solo cambia a sólido.
    if (navHidden) { navHidden = false; nav.classList.remove('hidden'); }
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

  mega.querySelectorAll('.mega-item, .mega-elite').forEach(item => {
    item.addEventListener('click', e => {
      const href = item.getAttribute('href') || '';
      /* Enlaces a otra página (p. ej. joyeria/#rosarios): se cierra el
         panel y se deja navegar al navegador. Sin esta salida el
         preventDefault de abajo mataba el clic y no pasaba nada. */
      if (href && !href.startsWith('#')) { close(); return; }
      e.preventDefault();
      close();
      let action;
      // Gift selections → curated edit overlay
      if (href === '#gift-el' || href === '#gift-ella' || href === '#gift-bebe') {
        const w = href === '#gift-el' ? 'el' : (href === '#gift-ella' ? 'ella' : 'bebe');
        action = () => openGiftEdit(w);
      } else if (href === '#sets') {
        action = () => { if (window.openSets) window.openSets(); };
      } else if (href === '#giftcard') {
        action = () => { if (window.openGiftCard) window.openGiftCard(); };
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
          let target = null;
          try { target = document.querySelector(href); } catch (err) { target = null; }
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

/* ── Mega menús en dos pasos (grupo → categorías) ────────────── */
function setupMegaSteps(megaId, triggerId) {
  const mega = document.getElementById(megaId);
  if (!mega) return;
  const steps = [...mega.querySelectorAll('.mega-step')];
  if (!steps.length) return;
  const showStep = (name) => { steps.forEach(s => { s.hidden = (s.dataset.step !== name); }); };
  const reset = () => showStep('root');

  mega.querySelectorAll('.mega-choice[data-collection]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      showStep(btn.dataset.collection);
    });
  });
  mega.querySelectorAll('[data-back]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      reset();
    });
  });

  // Cada vez que se abre el panel, volver al paso inicial.
  const trigger = document.getElementById(triggerId);
  if (trigger) trigger.addEventListener('click', () => setTimeout(reset, 0));
  mega.querySelectorAll('.mega-item, .mega-elite').forEach(a => {
    a.addEventListener('click', () => setTimeout(reset, 350));
  });
  reset();
}
setupMegaSteps('joyeriaMega', 'joyeriaTrigger');
setupMegaSteps('accesoriosMega', 'accesoriosTrigger');
setupMegaSteps('maisonMega', 'maisonTrigger');
setupMegaSteps('regalosMega', 'regalosTrigger');

/* ── Footer collection links → open in-page catalog ──────────── */
document.querySelectorAll('.foot-coll').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const line = a.dataset.line;
    if (line) { playTransition(() => openLine(line)); return; }
    const href = a.getAttribute('href') || '';
    if (!href.startsWith('#card-')) return;
    const productId = href.slice(1).replace('card-', '');
    const prod = COLLECTIONS.find(x => x.id === productId);
    playTransition(() => {
      if (prod && prod.variants) openCategory(productId);
      else if (prod) openProduct(productId);
    });
  });
});

/* ── Footer "Preto Maison" links → open Maison overlay ───────── */
document.querySelectorAll('.foot-maison').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    playTransition(() => openMaison(null));
  });
});

// Logo → volver SIEMPRE al inicio de todo (y cerrar el menú móvil si está abierto)
document.querySelectorAll('.nav-mark').forEach(logo => {
  logo.addEventListener('click', e => {
    e.preventDefault();
    // Volver al HOME real: cerrar el menú móvil y CUALQUIER capa abierta
    // (categoría, ficha, búsqueda, regalos, maison, historia) y subir arriba.
    try { if (typeof closeMobileMenu === 'function') closeMobileMenu(); } catch (_) {}
    try { if (typeof closeStackedOverlays === 'function') closeStackedOverlays(); } catch (_) {}
    try { if (typeof closeRegalos === 'function') closeRegalos(); } catch (_) {}
    try { if (typeof closeMaison === 'function') closeMaison(); } catch (_) {}
    try { if (typeof closeHistoria === 'function') closeHistoria(); } catch (_) {}
    document.body.style.overflow = '';
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
  /* Sin foto no se exhibe: el buscador no debe devolver piezas que
     aparecerían como una tarjeta vacía. Misma regla que el carrusel. */
  .filter(isShown)
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

/* Lo que escribe el visitante nunca entra crudo en el HTML: un
   «buscar» con <img onerror=…> se ejecutaba en la página. */
function escBusca(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

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
        <p>No encontramos piezas para «${escBusca(q)}».</p>
        <p class="sub">Pruebe con «cadena», «rosario», «anillo religioso» o el nombre de una línea.</p>
      </div>`;
    return;
  }
  searchMeta.innerHTML = `<span class="gold">${String(list.length).padStart(2,'0')}</span> &nbsp;pieza${list.length === 1 ? '' : 's'} encontrada${list.length === 1 ? '' : 's'}`;
  searchResults.innerHTML = list.map(p => {
    const art = p.image
      ? `<div class="sr-art ${imgArtClass(p.image)}" role="img" aria-label="${artAria(p.name)}" style="background-image:url('${thumbSrc(p.image)}')"></div>`
      : `<div class="sr-art" data-label="${p.label}"></div>`;
    return `
      <article class="sr-card" data-id="${p.id}">
        ${art}
        <div class="sr-info">
          <h3 class="sr-name">${p.name}</h3>
          <p class="sr-spec">${p.label}</p>
          <p class="sr-cta">${priceLabelFor(p)}</p>
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
