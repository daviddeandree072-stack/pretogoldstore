/* ═══════════════════════════════════════════════════════════════
   PRETO BY DALA&CO — RENDER DE RESEÑAS  (punto 07)
   ⛔ NO EDITES ESTE ARCHIVO. Tus reseñas se escriben en  resenas.js
   ═══════════════════════════════════════════════════════════════
   Lee window.PRETO_REVIEWS / window.PRETO_UGC, pinta la sección,
   calcula el promedio y genera el dato estructurado para Google.
   Si no hay reseñas, deja la sección oculta.                       */
(function () {
  'use strict';

  var section = document.getElementById('testimonios');
  if (!section) return;

  var reviews = (Array.isArray(window.PRETO_REVIEWS) ? window.PRETO_REVIEWS : [])
    .filter(function (r) {
      return r && typeof r.text === 'string' && r.text.trim() &&
             r.name && (+r.rating >= 1 && +r.rating <= 5);
    });

  /* Sin reseñas reales → la sección permanece oculta. */
  if (!reviews.length) { section.hidden = true; return; }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function clampRating(n) { n = Math.round(+n); return n < 1 ? 1 : (n > 5 ? 5 : n); }

  /* ── Promedio + cabecera de calificación ── */
  var sum = reviews.reduce(function (a, r) { return a + clampRating(r.rating); }, 0);
  var avg = sum / reviews.length;
  var avgRounded = Math.round(avg * 10) / 10;
  var avgStr = avgRounded.toString().replace('.', ',');

  var numEl  = document.getElementById('testiRateNum');
  var metaEl = document.getElementById('testiRateMeta');
  var rateEl = document.getElementById('testiRating');
  if (numEl)  numEl.textContent = avgStr;
  if (metaEl) {
    metaEl.innerHTML = 'sobre 5 &middot; <b>' + reviews.length + '</b> ' +
      (reviews.length === 1 ? 'cliente' : 'clientes') + ' en Colombia';
  }
  if (rateEl) rateEl.setAttribute('aria-label', 'Valoración media de ' + avgStr + ' sobre 5');

  /* ── Tarjetas (estilo editorial, igual que el diseño original) ── */
  var grid = document.getElementById('testiGrid');
  if (grid) {
    grid.innerHTML = reviews.map(function (r) {
      var meta = [r.piece, r.city].filter(Boolean).map(esc).join(' &middot; ');
      var initial = esc((r.name || '').trim().charAt(0).toUpperCase());
      return '<figure class="testi-card">' +
          '<div class="testi-quote-mark" aria-hidden="true">&ldquo;</div>' +
          '<blockquote>' + esc(r.text) + '</blockquote>' +
          '<figcaption>' +
            '<span class="testi-mono" aria-hidden="true">' + initial + '</span>' +
            '<span class="testi-who"><b>' + esc(r.name) + '</b>' +
              (meta ? '<span>' + meta + '</span>' : '') +
            '</span>' +
          '</figcaption>' +
        '</figure>';
    }).join('');
  }

  section.hidden = false;

  /* ── Franja UGC de Instagram (solo si hay fotos) ── */
  var ugc = (Array.isArray(window.PRETO_UGC) ? window.PRETO_UGC : []).filter(Boolean);
  var ugcWrap = document.getElementById('testiUgc');
  var rail = document.getElementById('ugcRail');
  if (ugc.length && rail && ugcWrap) {
    rail.innerHTML = ugc.map(function (src) {
      return '<a class="ugc-tile has-image" href="https://www.instagram.com/pretostoregold" ' +
        'target="_blank" rel="noopener" ' +
        'style="background-image:url(\'' + esc(src) + '\');background-size:cover;background-position:center;"></a>';
    }).join('');
    ugcWrap.hidden = false;
  } else if (ugcWrap) {
    ugcWrap.hidden = true;
  }

  /* ── Dato estructurado para Google (Review + AggregateRating) ──
     Se inyecta SOLO con reseñas reales, anclado a la organización. */
  try {
    var ld = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": "https://pretogold.store/#org",
      "name": "Preto by Dala&Co",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": avgRounded,
        "bestRating": 5,
        "worstRating": 1,
        "reviewCount": reviews.length
      },
      "review": reviews.map(function (r) {
        var rev = {
          "@type": "Review",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": clampRating(r.rating),
            "bestRating": 5
          },
          "author": { "@type": "Person", "name": r.name },
          "reviewBody": r.text
        };
        if (r.date) rev.datePublished = r.date;
        if (r.piece) rev.itemReviewed = { "@type": "Product", "name": r.piece };
        return rev;
      })
    };
    var s = document.createElement('script');
    s.type = 'application/ld+json';
    s.textContent = JSON.stringify(ld);
    document.head.appendChild(s);
  } catch (e) { /* el dato estructurado es un extra, no rompe la página */ }
})();
