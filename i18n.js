/* ═══════════════════════════════════════════════════════════════
   PRETO BY DALA&CO · Soporte multi-idioma (i18n) — arquitectura
   ───────────────────────────────────────────────────────────────
   ► CÓMO FUNCIONA
     · Idioma por defecto: español (es). Segundo idioma activo: inglés (en).
     · Solo se ACTIVAN los idiomas listados en I18N.langs. Para añadir
       francés/portugués mañana: (1) agrega su objeto a I18N.dict.<code>
       con las MISMAS claves, y (2) regístralo en I18N.langs. Nada más.
     · El idioma vive en la URL como parámetro ?lang=en (indexable + SEO),
       y en memoria durante la página (state.lang). NO se usa localStorage.
     · La preferencia PERSISTE al navegar porque reescribimos los enlaces
       entre páginas (*.html, joyeria/…) para que lleven ?lang. Los enlaces
       de ancla (#…) NO se tocan (misma página → el estado en memoria basta,
       y así no interferimos con la lógica de #card-… de app.js).

   ► CÓMO TRADUCIR EN EL HTML (claves reutilizables)
       <a data-i18n="nav.joyeria">Joyería</a>          → cambia textContent
       <h4 data-i18n-html="mega.j.title">…</h4>         → cambia innerHTML (permite <span class="script">)
       <input data-i18n-attr="placeholder:x;aria-label:y">→ cambia atributos
       <title data-i18n="meta.index.title">…</title>    → título por idioma
       <meta name="description" data-i18n-attr="content:meta.index.desc">

   ► COPY EDITORIAL DE MARCA (Herencia, Procedencia, historia Maison)
     NO se traduce automáticamente. Esos bloques NO llevan data-i18n y
     además van marcados con data-i18n-pending="curated": se quedan en
     español hasta que llegue la traducción curada escrita a mano.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var I18N = {
    /* Idiomas ACTIVOS (solo estos se muestran/activan). Añadir uno nuevo
       aquí + su dict lo publica; no publiques idiomas sin traducción real. */
    langs: [
      { code: 'es', label: 'ES', htmlLang: 'es', name: 'Español' },
      { code: 'en', label: 'EN', htmlLang: 'en', name: 'English' }
    ],
    fallback: 'es',

    /* Traducción de PÁGINA COMPLETA por coincidencia exacta de texto
       (ES→EN). Se rellena por lotes desde build; cubre lo que no lleva
       data-i18n (nombres de pieza, descripciones, copy editorial…). */
    phrases: {},   /* ES→EN: se carga aparte desde i18n-en.js (ver loadPhrases) */
    /* Reglas por patrón para textos con partes dinámicas (precios,
       contadores…) que la coincidencia exacta no puede cubrir. Se prueban
       solo si fallan exact/loose. [regex origen, reemplazo con $1…]. */
    patterns: { en: [["^Desde (.+)$","From $1"],["^Ver mis favoritos \\((\\d+)\\)$","View my favorites ($1)"],["^(.+) puntos para alcanzar (.+)$","$1 points to reach $2"],["^Hola, (.+)$","Hello, $1"],["^(\\d+) pieza encontrada$","$1 piece found"],["^(\\d+) piezas encontradas$","$1 pieces found"],["^(\\d+) piezas en catálogo$","$1 pieces in catalog"],["^(\\d+) piezas$","$1 pieces"],["^Ver (\\d+) familia$","View $1 family"],["^Ver (\\d+) familias$","View $1 families"],["^No encontramos piezas para «(.+)»\\.$","We found no pieces for «$1»."],["^Ref\\. (.+) · (.+) · Línea (.+)$","Ref. $1 · $2 · Line $3"],["^(\\d+) g · tope (\\d+) g$","$1 g · max $2 g"],["^Crisol al tope · (\\d+) g$","Crucible full · $1 g"],["^(\\d+) quilates · (.+) ‰$","$1 karats · $2 ‰"],["^Oro amarillo · (.+)$","Yellow gold · $1"],["^Oro blanco · (.+)$","White gold · $1"],["^Oro rosa · (.+)$","Rose gold · $1"],["^Oro rojo · (.+)$","Red gold · $1"],["^(.+) · sello$","$1 · hallmark"],["^te alcanza · (\\d+) g$","reaches it · $1 g"],["^faltan (\\d+) g$","$1 g short"],["^Con tus (\\d+) g convertirás tu oro en$","With your $1 g you'll turn your gold into"]] },
    dict: {
      es: {
        /* ── Navegación principal ── */
        'nav.boutique': 'Concierge',
        'nav.joyeria': 'Joyería',
        'nav.accesorios': 'Accesorios',
        'nav.maison': 'Preto Maison',
        'nav.destacados': 'Destacados',
        'nav.fundicion': 'La Fundición',
        'nav.regalos': 'Regalos',
        'nav.menuTitle': 'Menú',
        /* ── Etiquetas accesibles ── */
        'aria.menu': 'Menú',
        'aria.closeMenu': 'Cerrar menú',
        'aria.cart': 'Carrito',
        'aria.account': 'Cuenta',
        'aria.wishlist': 'Favoritos',
        'aria.search': 'Buscar una pieza',
        'aria.wa': 'Hablar por WhatsApp',
        'aria.lang': 'Idioma',
        /* ── Mega · Joyería ── */
        'mega.j.eyebrow': 'Joyería',
        'mega.j.title': 'Escoge tu versión <span class="script">de joyas</span>',
        'mega.line.coleccion': 'Colección',
        'mega.sub.preto': 'Oro de Chocó · carácter nocturno',
        'mega.sub.dala': 'Oro de 18k · luz cálida',
        'mega.elite.tag': 'Joyería de Autor',
        'mega.elite.desc': 'Cuero y caucho premium con herrajes en oro de Chocó. Nuestra pieza más codiciada.',
        'mega.back.colecciones': 'Colecciones',
        'mega.preto.eyebrow': 'Colección Preto',
        'mega.preto.title': 'Oro de <span class="script">Chocó</span>',
        'mega.dala.eyebrow': 'Colección Dala&Co',
        'mega.dala.title': 'Oro de <span class="script">18k</span>',
        'item.cadenas': 'Cadenas',
        'item.rosarios': 'Rosarios',
        'item.anillos': 'Anillos',
        'item.pulseras': 'Pulseras',
        'item.pendientes': 'Pendientes',
        'item.boligrafo': 'Bolígrafo',
        /* ── Mega · Accesorios ── */
        'mega.a.eyebrow': 'Accesorios',
        'mega.a.title': 'La diferencia está <span class="script">en los detalles</span>',
        'mega.line.complementos': 'Complementos',
        'mega.sub.dalaPen': 'Bolígrafo en oro de 18k',
        'mega.sub.noir': 'Barra, gemelos e insignia',
        'mega.back.accesorios': 'Accesorios',
        'mega.dalaWrite.title': 'El gesto de <span class="script">escribir</span>',
        'mega.noir.eyebrow': 'Noir',
        'mega.noir.title': 'Complementos <span class="script">de autor</span>',
        'item.barraNoir': 'Barra Noir',
        'item.gemelosNoir': 'Gemelos Noir',
        'item.insigniaNoir': 'Insignia Noir',
        /* ── Mega · Preto Maison ── */
        'mega.m.title': 'Conoce <span class="script">la casa</span>',
        'mega.line.relato': 'Relato',
        'mega.line.valores': 'Valores',
        'mega.name.universo': 'Universo',
        'mega.name.compromiso': 'Compromiso',
        'mega.sub.universo': 'Nuestra historia y La Maison',
        'mega.sub.compromiso': 'Procedencia y atelier privado',
        'mega.back.maison': 'Preto Maison',
        'mega.universo.eyebrow': 'Universo',
        'mega.universo.title': 'Nuestro <span class="script">relato</span>',
        'item.historia': 'Nuestra historia',
        'item.maison': 'La Maison',
        'mega.compromiso.eyebrow': 'Compromiso',
        'mega.compromiso.title': 'Nuestros <span class="script">valores</span>',
        'item.procedencia': 'Procedencia',
        'item.atelier': 'Atelier privado',
        /* ── Mega · Regalos ── */
        'mega.r.eyebrow': 'Regalos',
        'mega.r.title': 'El gesto <span class="script">de regalar</span>',
        'mega.line.paraquien': 'Para quién',
        'mega.line.delacasa': 'De la casa',
        'mega.line.editorial': 'Editorial',
        'mega.name.selecciones': 'Selecciones',
        'mega.name.lacasa': 'La casa',
        'mega.name.elarte': 'El arte',
        'mega.sub.selecciones': 'Para él, ella y bebé',
        'mega.sub.casa': 'Conjuntos y tarjeta de regalo',
        'mega.sub.editorial': 'El arte de regalar',
        'mega.back.regalos': 'Regalos',
        'mega.selecciones.title': 'Para <span class="script">quién</span>',
        'item.giftEl': 'Regalos para él',
        'item.giftElla': 'Regalos para ella',
        'item.giftBebe': 'Regalos para bebé',
        'mega.casa.eyebrow': 'La casa',
        'mega.casa.title': 'Detalles <span class="script">de la casa</span>',
        'item.sets': 'Conjuntos de la casa',
        'item.giftcard': 'Tarjeta de regalo',
        'mega.editorial.title': 'El arte <span class="script">de regalar</span>',
        'item.arteRegalar': 'El arte de regalar',
        /* ── Carrito (drawer) ── */
        'drawer.title': 'Su <span class="script">carrito.</span>',
        'drawer.close': 'Cerrar',
        'drawer.sub': 'Las piezas que ha reunido, guardadas para usted. Tómese su tiempo — cuando lo desee, la casa se encarga del resto.',
        'wa.label': 'Hablar con la Maison',
        /* ── Footer ── */
        'foot.h.colecciones': 'Colecciones',
        'foot.h.concierge': 'Concierge',
        'foot.coll.preto': 'Preto · Nocturne',
        'foot.coll.dala': 'Dala&Co · Íntima',
        'foot.coll.catalogo': 'Catálogo completo · 63 piezas',
        'foot.link.cadenasPreto': 'Cadenas Preto',
        'foot.link.anillosPreto': 'Anillos Preto',
        'foot.link.rosariosPreto': 'Rosarios Preto',
        'foot.link.pulserasPreto': 'Pulseras Preto',
        'foot.link.pretoElite': 'Preto Elite',
        'foot.link.pendientesPreto': 'Pendientes Preto',
        'foot.link.cadenasDala': 'Cadenas Dala&Co',
        'foot.link.anillosDala': 'Anillos Dala&Co',
        'foot.link.rosariosDala': 'Rosarios Dala&Co',
        'foot.link.pulserasDala': 'Pulseras Dala&Co',
        'foot.link.pendientesDala': 'Pendientes Dala&Co',
        'foot.link.boligrafoDala': 'Bolígrafo Dala&Co',
        'foot.link.barraNoir': 'Barra Noir',
        'foot.link.gemelosNoir': 'Gemelos Noir',
        'foot.link.insigniaNoir': 'Insignia Noir',
        'foot.trust.pay': 'Métodos de pago',
        'foot.trust.payNote': 'Tarjetas débito y crédito y PSE (en línea con Bold), Nequi, Llave · Nu y transferencia Bancolombia. Los datos para transferencia se comparten únicamente desde el WhatsApp oficial de la casa.',
        'foot.trust.ship': '<span class="gold">Envío nacional asegurado.</span> Sin costo de envío a ciudades principales — el seguro de transporte se cotiza aparte. Resto del país: envío y seguro al destino.',
        'foot.trust.link': 'Conozca la promesa Preto',
        'foot.base.made': 'Preto by Dala&Co · <span class="gold">Hecho en Colombia</span>',
        'foot.legal.promesa': 'La promesa Preto',
        'foot.legal.terminos': 'Términos y condiciones',
        'foot.legal.privacidad': 'Política de privacidad',
        'foot.legal.facturacion': 'Facturación',
        /* ── Fichas /joyeria/ (chrome reutilizable; nombres y copy de
           producto NO se traducen: quedan pendientes de curación) ── */
        'jy.back': 'La tienda',
        'jy.viewStore': 'Ver en tienda',
        'jy.shopStore': 'Comprar en tienda',
        'jy.crumb.home': 'Inicio',
        'jy.sizes': 'Medidas disponibles',
        'jy.addCart': 'Añadir al carrito',
        'jy.wa': 'Asesoría por WhatsApp',
        'jy.foot.casa': 'La casa',
        'jy.foot.tienda': 'Tienda online',
        'jy.foot.fundicion': 'La fundición',
        'jy.foot.promesa': 'Nuestra promesa',
        'jy.foot.catalogo': 'Catálogo',
        'jy.foot.toda': 'Toda la joyería',
        'jy.foot.pieza': 'Esta pieza en la tienda',
        'jy.foot.legales': 'Legales',
        'jy.foot.terminos': 'Términos',
        'jy.foot.privacidad': 'Privacidad',
        'jy.foot.facturacion': 'Facturación',
        'jy.cat.eyebrow': 'Catálogo de la casa',
        'jy.cat.title': 'Toda la <span class="script">joyería</span>',
        'jy.mas.eyebrow': 'Sin fotografía todavía',
        'jy.mas.title': 'Piezas <span class="script">por encargo</span>',
        'jy.mas.sub': 'Joyería que se fabrica a la medida y aún no está fotografiada. Cada ficha lleva medidas, ley del oro, precio de referencia y el concierge por WhatsApp.',
        'jy.cat.sub': 'Toda la joyería de la casa en un solo lugar: 63 piezas en oro de 18k y oro de Chocó — 32 disponibles con fotografía y 31 por encargo. Cadenas, anillos, rosarios, pulseras y pendientes.',
        'jy.price.consulta': 'Consultar precio',
        'jy.price.consulta2': 'Bajo cotización',
        'jy.price.autor': 'Pieza de autor · bajo encargo',
        'jy.price.desde': 'Desde',
        'jy.wa.intro': 'Hola, me interesa esta pieza de Preto by Dala&Co:',
        'jy.wa.outro': 'Quedo atento a la asesoría. Gracias.',
        /* ── Páginas legales / editoriales (solo chrome; el cuerpo de
           estas páginas queda pendiente de traducción curada) ── */
        'sec.back': '← Volver a la tienda',
        'sec.store': 'Volver a la tienda',
        'home.explora.fundicion': 'La <span class="script">Fundición</span>',
        /* ── SEO · portada ── */
        'meta.index.title': 'Joyería de Oro 18k en Colombia — Cadenas, Anillos y Rosarios | Preto by Dala&Co',
        'meta.index.desc': 'Cadenas, anillos, rosarios y pulseras en oro 18k y oro de procedencia chocoana. Joyería de autor entre Chocó y Bogotá, con concierge personal por WhatsApp y envío nacional asegurado.',
      },

      en: {
        /* ── Main navigation ── */
        'nav.boutique': 'Concierge',
        'nav.joyeria': 'Jewelry',
        'nav.accesorios': 'Accessories',
        'nav.maison': 'Preto Maison',
        'nav.destacados': 'Featured',
        'nav.fundicion': 'The Foundry',
        'nav.regalos': 'Gifts',
        'nav.menuTitle': 'Menu',
        /* ── Accessible labels ── */
        'aria.menu': 'Menu',
        'aria.closeMenu': 'Close menu',
        'aria.cart': 'Cart',
        'aria.account': 'Account',
        'aria.wishlist': 'Wishlist',
        'aria.search': 'Search for a piece',
        'aria.wa': 'Chat on WhatsApp',
        'aria.lang': 'Language',
        /* ── Mega · Jewelry ── */
        'mega.j.eyebrow': 'Jewelry',
        'mega.j.title': 'Choose your <span class="script">jewelry</span>',
        'mega.line.coleccion': 'Collection',
        'mega.sub.preto': 'Chocó gold · nocturnal character',
        'mega.sub.dala': '18k gold · warm light',
        'mega.elite.tag': 'Signature Jewelry',
        'mega.elite.desc': 'Premium leather and rubber with Chocó-gold hardware. Our most coveted piece.',
        'mega.back.colecciones': 'Collections',
        'mega.preto.eyebrow': 'Preto Collection',
        'mega.preto.title': '<span class="script">Chocó</span> gold',
        'mega.dala.eyebrow': 'Dala&Co Collection',
        'mega.dala.title': '<span class="script">18k</span> gold',
        'item.cadenas': 'Chains',
        'item.rosarios': 'Rosaries',
        'item.anillos': 'Rings',
        'item.pulseras': 'Bracelets',
        'item.pendientes': 'Earrings',
        'item.boligrafo': 'Pen',
        /* ── Mega · Accessories ── */
        'mega.a.eyebrow': 'Accessories',
        'mega.a.title': 'The difference is <span class="script">in the details</span>',
        'mega.line.complementos': 'Add-ons',
        'mega.sub.dalaPen': '18k gold pen',
        'mega.sub.noir': 'Tie bar, cufflinks & lapel pin',
        'mega.back.accesorios': 'Accessories',
        'mega.dalaWrite.title': 'The art of <span class="script">writing</span>',
        'mega.noir.eyebrow': 'Noir',
        'mega.noir.title': 'Signature <span class="script">add-ons</span>',
        'item.barraNoir': 'Noir Tie Bar',
        'item.gemelosNoir': 'Noir Cufflinks',
        'item.insigniaNoir': 'Noir Lapel Pin',
        /* ── Mega · Preto Maison ── */
        'mega.m.title': 'Meet <span class="script">the house</span>',
        'mega.line.relato': 'Story',
        'mega.line.valores': 'Values',
        'mega.name.universo': 'Universe',
        'mega.name.compromiso': 'Commitment',
        'mega.sub.universo': 'Our story and La Maison',
        'mega.sub.compromiso': 'Provenance and private atelier',
        'mega.back.maison': 'Preto Maison',
        'mega.universo.eyebrow': 'Universe',
        'mega.universo.title': 'Our <span class="script">story</span>',
        'item.historia': 'Our story',
        'item.maison': 'La Maison',
        'mega.compromiso.eyebrow': 'Commitment',
        'mega.compromiso.title': 'Our <span class="script">values</span>',
        'item.procedencia': 'Provenance',
        'item.atelier': 'Private atelier',
        /* ── Mega · Gifts ── */
        'mega.r.eyebrow': 'Gifts',
        'mega.r.title': 'The art <span class="script">of gifting</span>',
        'mega.line.paraquien': 'For whom',
        'mega.line.delacasa': 'From the house',
        'mega.line.editorial': 'Editorial',
        'mega.name.selecciones': 'Selections',
        'mega.name.lacasa': 'The house',
        'mega.name.elarte': 'The art',
        'mega.sub.selecciones': 'For him, her & baby',
        'mega.sub.casa': 'Sets and gift card',
        'mega.sub.editorial': 'The art of gifting',
        'mega.back.regalos': 'Gifts',
        'mega.selecciones.title': 'For <span class="script">whom</span>',
        'item.giftEl': 'Gifts for him',
        'item.giftElla': 'Gifts for her',
        'item.giftBebe': 'Gifts for baby',
        'mega.casa.eyebrow': 'The house',
        'mega.casa.title': 'Details <span class="script">from the house</span>',
        'item.sets': 'House sets',
        'item.giftcard': 'Gift card',
        'mega.editorial.title': 'The art <span class="script">of gifting</span>',
        'item.arteRegalar': 'The art of gifting',
        /* ── Cart drawer ── */
        'drawer.title': 'Your <span class="script">cart.</span>',
        'drawer.close': 'Close',
        'drawer.sub': "The pieces you've gathered, saved for you. Take your time — whenever you wish, the house takes care of the rest.",
        'wa.label': 'Talk to the Maison',
        /* ── Footer ── */
        'foot.h.colecciones': 'Collections',
        'foot.h.concierge': 'Concierge',
        'foot.coll.preto': 'Preto · Nocturne',
        'foot.coll.dala': 'Dala&Co · Intimate',
        'foot.coll.catalogo': 'Full catalog · 63 pieces',
        'foot.link.cadenasPreto': 'Preto Chains',
        'foot.link.anillosPreto': 'Preto Rings',
        'foot.link.rosariosPreto': 'Preto Rosaries',
        'foot.link.pulserasPreto': 'Preto Bracelets',
        'foot.link.pretoElite': 'Preto Elite',
        'foot.link.pendientesPreto': 'Preto Earrings',
        'foot.link.cadenasDala': 'Dala&Co Chains',
        'foot.link.anillosDala': 'Dala&Co Rings',
        'foot.link.rosariosDala': 'Dala&Co Rosaries',
        'foot.link.pulserasDala': 'Dala&Co Bracelets',
        'foot.link.pendientesDala': 'Dala&Co Earrings',
        'foot.link.boligrafoDala': 'Dala&Co Pen',
        'foot.link.barraNoir': 'Noir Tie Bar',
        'foot.link.gemelosNoir': 'Noir Cufflinks',
        'foot.link.insigniaNoir': 'Noir Lapel Pin',
        'foot.trust.pay': 'Payment methods',
        'foot.trust.payNote': 'Cards, PSE and bank transfer. Payment details are confirmed via WhatsApp when you complete your order.',
        'foot.trust.ship': '<span class="gold">Insured nationwide shipping.</span> No shipping cost to major cities — transit insurance is quoted separately. Rest of the country: shipping and insurance to destination.',
        'foot.trust.link': 'Discover the Preto promise',
        'foot.base.made': 'Preto by Dala&Co · <span class="gold">Made in Colombia</span>',
        'foot.legal.promesa': 'The Preto promise',
        'foot.legal.terminos': 'Terms & conditions',
        'foot.legal.privacidad': 'Privacy policy',
        'foot.legal.facturacion': 'Checkout & billing',
        /* ── Product pages /joyeria/ (reusable chrome; product names and
           copy stay in Spanish, pending curated translation) ── */
        'jy.back': 'The store',
        'jy.viewStore': 'View in store',
        'jy.shopStore': 'Shop in store',
        'jy.crumb.home': 'Home',
        'jy.sizes': 'Available sizes',
        'jy.addCart': 'Add to cart',
        'jy.wa': 'WhatsApp advice',
        'jy.foot.casa': 'The house',
        'jy.foot.tienda': 'Online store',
        'jy.foot.fundicion': 'The foundry',
        'jy.foot.promesa': 'Our promise',
        'jy.foot.catalogo': 'Catalog',
        'jy.foot.toda': 'All jewelry',
        'jy.foot.pieza': 'This piece in the store',
        'jy.foot.legales': 'Legal',
        'jy.foot.terminos': 'Terms',
        'jy.foot.privacidad': 'Privacy',
        'jy.foot.facturacion': 'Billing',
        'jy.cat.eyebrow': 'The house catalog',
        'jy.cat.title': 'All <span class="script">jewelry</span>',
        'jy.mas.eyebrow': 'Not yet photographed',
        'jy.mas.title': 'Made <span class="script">to order</span>',
        'jy.mas.sub': 'Jewelry made to measure, not yet photographed. Each page carries sizes, gold purity, reference price and the concierge on WhatsApp.',
        'jy.cat.sub': 'All the house jewelry in one place: 63 pieces in 18k gold and Chocó gold — 32 available with photography and 31 made to order. Chains, rings, rosaries, bracelets and earrings.',
        'jy.price.consulta': 'Request price',
        'jy.price.consulta2': 'On request',
        'jy.price.autor': 'Signature piece · made to order',
        'jy.price.desde': 'From',
        'jy.wa.intro': "Hello, I'm interested in this piece from Preto by Dala&Co:",
        'jy.wa.outro': 'I look forward to your guidance. Thank you.',
        /* ── Legal / editorial pages (chrome only; page body pending
           curated translation) ── */
        'sec.back': '← Back to the store',
        'sec.store': 'Back to the store',
        'home.explora.fundicion': 'The <span class="script">Foundry</span>',
        /* ── SEO · home ── */
        'meta.index.title': '18k & Chocó Gold Jewelry in Colombia — Chains, Rings & Rosaries | Preto by Dala&Co',
        'meta.index.desc': 'Chains, rings, rosaries and bracelets in 18k gold and gold of Chocó provenance. Signature jewelry between Chocó and Bogotá, with a personal WhatsApp concierge and insured nationwide delivery.',
      }
    }
  };

  /* ══════════════════ Runtime ══════════════════ */
  var state = { lang: I18N.fallback };
  var originals = null; // captura del contenido original por si una clave falta
  var TEXT_ORIG = (typeof WeakMap !== 'undefined') ? new WeakMap() : null; // texto ES original por nodo

  function isActive(code) {
    for (var i = 0; i < I18N.langs.length; i++) if (I18N.langs[i].code === code) return true;
    return false;
  }
  function meta(code) {
    for (var i = 0; i < I18N.langs.length; i++) if (I18N.langs[i].code === code) return I18N.langs[i];
    return I18N.langs[0];
  }
  function t(key, lang) {
    var l = lang || state.lang;
    var d = I18N.dict[l] || {};
    if (d[key] != null) return d[key];
    var f = I18N.dict[I18N.fallback] || {};
    return (f[key] != null) ? f[key] : key;
  }

  /* Idioma pedido por la URL (?lang=xx). Sin localStorage. */
  function langFromUrl() {
    try {
      var p = new URLSearchParams(location.search).get('lang');
      if (p && isActive(p)) return p;
    } catch (e) {}
    return I18N.fallback;
  }

  /* Añade/quita ?lang en una URL relativa o del mismo sitio. */
  function withLang(href, lang) {
    if (!href) return href;
    if (href.charAt(0) === '#') return href; // ancla misma página → no tocar
    if (/^(mailto:|tel:|javascript:)/i.test(href)) return href;
    // externos (otro host) → no tocar
    if (/^(https?:)?\/\//i.test(href) && href.indexOf('pretogold.store') < 0) return href;
    // solo enlaces entre PÁGINAS (…/…html, o directorio con "/")
    var isPage = /\.html(\?|#|$)/i.test(href) || /\/(\?|#|$)/.test(href);
    if (!isPage) return href;
    var hash = '', q = href, hi = href.indexOf('#');
    if (hi >= 0) { hash = href.slice(hi); q = href.slice(0, hi); }
    var base = q, search = '', qi = q.indexOf('?');
    if (qi >= 0) { base = q.slice(0, qi); search = q.slice(qi + 1); }
    var params = new URLSearchParams(search);
    if (lang && lang !== I18N.fallback) params.set('lang', lang);
    else params.delete('lang');
    var ps = params.toString();
    return base + (ps ? '?' + ps : '') + hash;
  }

  function rewriteLinks(lang) {
    var as = document.querySelectorAll('a[href]');
    for (var i = 0; i < as.length; i++) {
      var a = as[i];
      if (a.getAttribute('data-i18n-nolink') != null) continue;
      var h = a.getAttribute('href');
      var nh = withLang(h, lang);
      if (nh !== h) a.setAttribute('href', nh);
    }
  }

  function applyEl(el, lang) {
    var kText = el.getAttribute('data-i18n');
    if (kText) el.textContent = t(kText, lang);
    var kHtml = el.getAttribute('data-i18n-html');
    if (kHtml) el.innerHTML = t(kHtml, lang);
    var kAttr = el.getAttribute('data-i18n-attr');
    if (kAttr) {
      kAttr.split(';').forEach(function (pair) {
        var bits = pair.split(':');
        if (bits.length === 2) {
          var attr = bits[0].trim(), key = bits[1].trim();
          if (attr && key) el.setAttribute(attr, t(key, lang));
        }
      });
    }
  }

  /* ── Traducción de texto suelto (sin data-i18n) por coincidencia exacta ──
     El mapa se normaliza una vez (claves y valores sin espacios de borde) y
     se cachea: así una entrada con espacio sobrante en el build NO rompe la
     coincidencia, porque la búsqueda usa orig.trim(). translateNode reañade
     el espacio de borde original del nodo. */
  var PHRASE_CACHE = {};
  function collapseWs(s) { return s.replace(/\s+/g, ' '); }
  function nodeMap(lang) {
    if (lang === I18N.fallback || !I18N.phrases || !I18N.phrases[lang]) return null;
    if (PHRASE_CACHE[lang]) return PHRASE_CACHE[lang];
    var raw = I18N.phrases[lang], exact = {}, loose = {};
    for (var k in raw) {
      if (!raw.hasOwnProperty(k)) continue;
      var tk = (k == null) ? '' : String(k).trim();
      var tv = raw[k];
      if (typeof tv === 'string') tv = tv.trim();
      if (exact[tk] == null) exact[tk] = tv;
      var lk = collapseWs(tk);
      if (loose[lk] == null) loose[lk] = tv;
    }
    var pats = [];
    var praw = (I18N.patterns && I18N.patterns[lang]) ? I18N.patterns[lang] : null;
    if (praw) for (var pi = 0; pi < praw.length; pi++) {
      try { pats.push([new RegExp(praw[pi][0]), praw[pi][1]]); } catch (e) {}
    }
    PHRASE_CACHE[lang] = { exact: exact, loose: loose, patterns: pats };
    return PHRASE_CACHE[lang];
  }
  function skipText(node) {
    var p = node.parentNode;
    while (p && p.nodeType === 1) {
      var tag = p.nodeName;
      if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT' || tag === 'TEXTAREA') return true;
      if (p.hasAttribute('data-i18n') || p.hasAttribute('data-i18n-html') || p.hasAttribute('data-i18n-skip')) return true;
      if (p.classList && p.classList.contains('lang-switch')) return true;
      p = p.parentNode;
    }
    return false;
  }
  function translateNode(node, map) {
    if (!TEXT_ORIG) return;
    var v = node.nodeValue;
    if (!v || !v.trim()) return;
    if (skipText(node)) return;
    var orig = TEXT_ORIG.get(node);
    if (orig == null) { orig = v; TEXT_ORIG.set(node, orig); }
    if (!map) { if (node.nodeValue !== orig) node.nodeValue = orig; return; } // ES → restaura
    var lead = (orig.match(/^\s*/) || [''])[0], trail = (orig.match(/\s*$/) || [''])[0];
    var key = orig.trim();
    var tr = map.exact[key];
    if (tr == null) tr = map.loose[collapseWs(key)]; // tolera saltos de línea / sangría interna
    if (tr == null && map.patterns) { // partes dinámicas (precios, contadores…)
      for (var pi = 0; pi < map.patterns.length; pi++) {
        if (map.patterns[pi][0].test(key)) { tr = key.replace(map.patterns[pi][0], map.patterns[pi][1]); break; }
      }
    }
    var next = (tr != null) ? (lead + tr + trail) : orig;
    if (node.nodeValue !== next) node.nodeValue = next;
  }
  function walkText(root, lang) {
    if (!TEXT_ORIG || !root) return;
    var map = nodeMap(lang);
    if (root.nodeType === 3) { translateNode(root, map); return; }
    if (root.nodeType !== 1 && root.nodeType !== 9 && root.nodeType !== 11) return;
    var tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var arr = [], n;
    while ((n = tw.nextNode())) arr.push(n);
    for (var i = 0; i < arr.length; i++) translateNode(arr[i], map);
  }

  /* ── Traducción de atributos visibles (placeholder) por el mismo mapa ──
     Cubre inputs estáticos e inyectados por JS sin tener que etiquetar cada
     uno; guarda el valor ES original por elemento para restaurar. */
  var ATTR_ORIG = (typeof WeakMap !== 'undefined') ? new WeakMap() : null;
  var I18N_ATTRS = ['placeholder'];
  function translateAttrs(el, map) {
    if (!ATTR_ORIG || !el || el.nodeType !== 1) return;
    if (el.hasAttribute('data-i18n-attr')) return; // etiquetado explícito manda
    var rec = ATTR_ORIG.get(el); if (!rec) { rec = {}; ATTR_ORIG.set(el, rec); }
    for (var i = 0; i < I18N_ATTRS.length; i++) {
      var a = I18N_ATTRS[i];
      if (!el.hasAttribute(a)) continue;
      if (rec[a] == null) rec[a] = el.getAttribute(a);
      var orig = rec[a]; if (orig == null) continue;
      var key = orig.trim(), next = orig;
      if (map && key) {
        var tr = map.exact[key]; if (tr == null) tr = map.loose[collapseWs(key)];
        if (tr != null) next = tr;
      }
      if (el.getAttribute(a) !== next) el.setAttribute(a, next);
    }
  }
  function walkAttrs(root, lang) {
    if (!ATTR_ORIG || !root || (root.nodeType !== 1 && root.nodeType !== 9 && root.nodeType !== 11)) return;
    var map = nodeMap(lang);
    if (root.nodeType === 1) translateAttrs(root, map);
    if (!root.querySelectorAll) return;
    var els = root.querySelectorAll('[' + I18N_ATTRS.join('],[') + ']');
    for (var i = 0; i < els.length; i++) translateAttrs(els[i], map);
  }

  function translateTree(root, lang) {
    var nodes = root.querySelectorAll('[data-i18n],[data-i18n-html],[data-i18n-attr]');
    for (var i = 0; i < nodes.length; i++) applyEl(nodes[i], lang);
    // El propio root podría llevar clave (p.ej. <title>)
    if (root.nodeType === 1 && (root.hasAttribute('data-i18n') || root.hasAttribute('data-i18n-html') || root.hasAttribute('data-i18n-attr'))) applyEl(root, lang);
  }

  /* hreflang + canonical según la URL actual (una sola vez, y se
     actualiza el canonical al cambiar de idioma). */
  function baseUrl() {
    var origin = location.origin + location.pathname;
    return origin;
  }
  function injectHreflang() {
    var head = document.head;
    // limpia los que hayamos puesto antes
    head.querySelectorAll('link[data-i18n-alt]').forEach(function (n) { n.remove(); });
    var base = baseUrl();
    I18N.langs.forEach(function (L) {
      var link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', L.htmlLang);
      link.setAttribute('href', L.code === I18N.fallback ? base : base + '?lang=' + L.code);
      link.setAttribute('data-i18n-alt', '1');
      head.appendChild(link);
    });
    var xd = document.createElement('link');
    xd.setAttribute('rel', 'alternate');
    xd.setAttribute('hreflang', 'x-default');
    xd.setAttribute('href', base);
    xd.setAttribute('data-i18n-alt', '1');
    head.appendChild(xd);
  }
  function updateCanonical(lang) {
    var c = document.querySelector('link[rel="canonical"]');
    if (!c) return;
    var base = baseUrl();
    c.setAttribute('href', lang === I18N.fallback ? base : base + '?lang=' + lang);
  }

  function markSelector(lang) {
    var opts = document.querySelectorAll('[data-lang]');
    for (var i = 0; i < opts.length; i++) {
      var on = opts[i].getAttribute('data-lang') === lang;
      opts[i].classList.toggle('is-active', on);
      opts[i].setAttribute('aria-pressed', on ? 'true' : 'false');
    }
  }

  function apply(lang) {
    state.lang = lang;
    document.documentElement.setAttribute('lang', meta(lang).htmlLang);
    translateTree(document.documentElement, lang);
    walkText(document.body, lang); // resto del texto visible sin data-i18n
    walkAttrs(document.body, lang); // placeholders (estáticos e inyectados)
    // <title> y <meta> viven fuera del árbol visible → tradúcelos aparte
    var titleEl = document.querySelector('title[data-i18n],title[data-i18n-html]');
    if (titleEl) applyEl(titleEl, lang);
    document.querySelectorAll('head [data-i18n-attr]').forEach(function (m) { applyEl(m, lang); });
    updateCanonical(lang);
    rewriteLinks(lang);
    markSelector(lang);
    document.dispatchEvent(new CustomEvent('preto:langchange', { detail: { lang: lang } }));
  }

  /* ════════ DICCIONARIO BAJO DEMANDA ════════════════════════════
     Las 103 KB de frases ES→EN viven en i18n-en.js. Se descargan
     solo si el visitante navega en inglés (?lang=en o pulsa EN);
     quien navega en español no paga ese peso. Si la descarga falla,
     la página se queda en español: nunca se rompe. */
  var phrasesReq = null;
  function i18nBase() {
    var el = document.currentScript || document.querySelector('script[src*="i18n.js"]');
    var src = (el && el.src) || '';
    return src ? src.replace(/i18n\.js.*$/, '') : '';
  }
  var I18N_BASE = i18nBase();
  function loadPhrases(lang) {
    if (lang === I18N.fallback || I18N.phrases[lang]) return Promise.resolve();
    if (phrasesReq) return phrasesReq;
    phrasesReq = new Promise(function (done) {
      var sc = document.createElement('script');
      sc.src = I18N_BASE + 'i18n-en.js?v=20260805a';
      sc.onload = function () {
        if (window.PRETO_PHRASES_EN) I18N.phrases.en = window.PRETO_PHRASES_EN;
        done();
      };
      sc.onerror = function () { done(); };
      document.head.appendChild(sc);
    });
    return phrasesReq;
  }

  /* Traduce ya con las claves data-i18n (instantáneo) y, cuando llega
     el diccionario de frases, vuelve a pasar para el resto del texto. */
  function applyLang(lang) {
    apply(lang);
    if (lang !== I18N.fallback && !I18N.phrases[lang]) {
      loadPhrases(lang).then(function () {
        if (state.lang === lang) { PHRASE_CACHE = {}; apply(lang); }
      });
    }
  }

  function setLang(lang) {
    if (!isActive(lang)) return;
    // Actualiza la URL SIN recargar (?lang) — persiste al navegar por enlaces.
    try {
      var url = new URL(location.href);
      if (lang === I18N.fallback) url.searchParams.delete('lang');
      else url.searchParams.set('lang', lang);
      history.replaceState(null, '', url.toString());
    } catch (e) {}
    applyLang(lang);
  }

  function wireSelector() {
    document.addEventListener('click', function (e) {
      var opt = e.target.closest ? e.target.closest('[data-lang]') : null;
      if (!opt) return;
      e.preventDefault();
      setLang(opt.getAttribute('data-lang'));
    });
  }

  /* Re-traduce chrome inyectado tarde (solo nodos con data-i18n; no toca
     el contenido de app.js, que no usa estas claves). */
  function observe() {
    if (!('MutationObserver' in window)) return;
    var mo = new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        var added = muts[i].addedNodes;
        for (var j = 0; j < added.length; j++) {
          var n = added[j];
          if (n.nodeType === 3) { translateNode(n, nodeMap(state.lang)); continue; }
          if (n.nodeType !== 1) continue;
          // Salta partículas de animación (granos, brasas, chispas…): no llevan
          // texto ni atributos traducibles y se crean por centenas → fluidez.
          var cn = (typeof n.className === 'string') ? n.className : '';
          if (cn && /(grain-bit|jar-bit|ember|bag-dot|bag-ring|spark|-flame|forge-)/.test(cn)) continue;
          if (n.matches && n.matches('[data-i18n],[data-i18n-html],[data-i18n-attr]')) applyEl(n, state.lang);
          if (n.querySelectorAll) translateTree(n, state.lang);
          walkText(n, state.lang);
          walkAttrs(n, state.lang);
        }
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }

  /* ════════ EL DICCIONARIO LLEGA ANTES DEL CLIC ══════════════════
     En cuanto el visitante roza, toca o enfoca el selector de idioma,
     el diccionario empieza a descargarse en segundo plano. Cuando
     pulsa, ya está: el cambio se siente instantáneo. Y quien nunca se
     acerca al selector — la inmensa mayoría — no descarga nada. */
  function prefetchOnIntent() {
    var armado = false;
    function arm(e) {
      if (armado) return;
      var opt = (e.target && e.target.closest) ? e.target.closest('[data-lang]') : null;
      if (!opt) return;
      var lang = opt.getAttribute('data-lang');
      if (lang === I18N.fallback || !isActive(lang)) return;
      armado = true;
      loadPhrases(lang);
    }
    ['pointerover', 'touchstart', 'focusin'].forEach(function (ev) {
      document.addEventListener(ev, arm, { capture: true, passive: true });
    });
  }

  function init() {
    injectHreflang();
    wireSelector();
    prefetchOnIntent();
    applyLang(langFromUrl());
    observe();
  }

  // API pública (para app.js u otras capas, opcional).
  window.PretoI18n = {
    t: t,
    get lang() { return state.lang; },
    setLang: setLang,
    apply: function () { apply(state.lang); },
    langs: I18N.langs,
    dict: I18N.dict
  };
  window.t = t;

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();


/* Año del copyright — se actualiza solo cada 1 de enero. */
(function(){function y(){var a=String(new Date().getFullYear());document.querySelectorAll('[data-yr]').forEach(function(e){e.textContent=a});}
if(document.readyState!=='loading')y();else document.addEventListener('DOMContentLoaded',y);})();
