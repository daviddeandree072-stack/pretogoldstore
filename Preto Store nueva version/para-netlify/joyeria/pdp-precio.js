/* ─────────────────────────────────────────────────────────────
   Preto by Dala&Co — Precio "Desde $X" en las fichas de producto
   (Punto 03 del informe CRO)

   Lee los precios desde ../precios.js — ese es el único archivo
   que debes editar. Este script:
   1. Encuentra la referencia (SKU) de la pieza en sus datos
      estructurados.
   2. Si la pieza tiene precio, reemplaza "Bajo cotización" por
      "Desde $X" y muestra la nota del oro del día.
   3. Añade el precio a los datos estructurados de Google
      (rich results con precio).
   Si la pieza no está en precios.js, no cambia nada: queda
   "Bajo cotización".
   ───────────────────────────────────────────────────────────── */
(function () {
  var PRICES = window.PRETO_PRICES || {};

  function fmtCOP(n) {
    try { return '$' + Math.round(n).toLocaleString('es-CO'); }
    catch (e) { return '$' + Math.round(n); }
  }

  // 1. Referencia de la pieza desde el JSON-LD
  var ldEl = document.querySelector('script[type="application/ld+json"]');
  if (!ldEl) return;
  var data;
  try { data = JSON.parse(ldEl.textContent); } catch (e) { return; }
  var graph = data['@graph'] || [data];
  var product = null;
  for (var i = 0; i < graph.length; i++) {
    if (graph[i] && graph[i]['@type'] === 'Product') { product = graph[i]; break; }
  }
  if (!product || !product.sku) return;

  var price = PRICES[product.sku];
  if (price == null) return; // sin precio → "Bajo cotización" se queda

  // 2. Precio visible en la ficha
  var priceEl = document.querySelector('.pp-price');
  if (priceEl) priceEl.textContent = 'Desde ' + fmtCOP(price) + ' COP';
  var subEl = document.querySelector('.pp-price-sub');
  if (subEl && window.PRETO_PRICE_NOTE) subEl.textContent = window.PRETO_PRICE_NOTE;

  // 3. Datos estructurados para Google
  var canonical = document.querySelector('link[rel="canonical"]');
  product.offers = {
    '@type': 'Offer',
    'price': price,
    'priceCurrency': 'COP',
    'availability': 'https://schema.org/InStock',
    'url': canonical ? canonical.href : location.href
  };
  ldEl.textContent = JSON.stringify(data);
})();
