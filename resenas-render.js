/* ═══════════════════════════════════════════════════════════════
   PRETO BY DALA&CO — RENDER DE RESEÑAS  (punto 07)
   ⛔ NO EDITES ESTE ARCHIVO.
   Reseñas manuales → resenas.js · Reseñas de Google → automáticas
   (netlify/functions/google-reviews.js), se combinan aquí solas.
   Si no hay ninguna de las dos, la sección queda oculta.            */
(function () {
  'use strict';

  var section = document.getElementById('testimonios');
  if (!section) return;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function clampRating(n) { n = Math.round(+n); return n < 1 ? 1 : (n > 5 ? 5 : n); }
  function norm(s) { return String(s || '').toLowerCase().replace(/\s+/g, ' ').trim().slice(0, 40); }

  var manualAll = (Array.isArray(window.PRETO_REVIEWS) ? window.PRETO_REVIEWS : [])
    .filter(function (r) { return r && typeof r.text === 'string' && r.text.trim() && r.name && (+r.rating >= 1 && +r.rating <= 5); })
    .map(function (r) {
      return { name: r.name, meta: [r.piece, r.city].filter(Boolean).join(' · '), rating: clampRating(r.rating), text: r.text.trim(), date: r.date || null };
    });

  function render(google) {
    var fromGoogle = (google && Array.isArray(google.reviews) ? google.reviews : [])
      .filter(function (r) { return r && r.text && r.name && (+r.rating >= 1 && +r.rating <= 5); })
      .map(function (r) { return { name: r.name, meta: 'Reseña de Google', rating: clampRating(r.rating), text: String(r.text).trim(), date: null }; });

    var googleTexts = fromGoogle.map(function (r) { return norm(r.text); });
    var manual = manualAll.filter(function (r) { return googleTexts.indexOf(norm(r.text)) === -1; });
    var reviews = fromGoogle.concat(manual);
    if (!reviews.length) { section.hidden = true; return; }

    var avg, count;
    if (google && google.rating && google.total) {
      avg = google.rating;
      count = google.total + manual.length;
    } else {
      avg = reviews.reduce(function (a, r) { return a + r.rating; }, 0) / reviews.length;
      count = reviews.length;
    }
    var avgRounded = Math.round(avg * 10) / 10;
    var avgStr = avgRounded.toString().replace('.', ',');

    var numEl = document.getElementById('testiRateNum');
    var metaEl = document.getElementById('testiRateMeta');
    var rateEl = document.getElementById('testiRating');
    if (numEl) numEl.textContent = avgStr;
    if (metaEl) {
      var mapsLink = (google && google.mapsUrl) ? ' &middot; <a href="' + esc(google.mapsUrl) + '" target="_blank" rel="noopener">ver en Google</a>' : '';
      metaEl.innerHTML = 'sobre 5 &middot; <b>' + count + '</b> ' + (count === 1 ? 'cliente' : 'clientes') + ' en Colombia' + mapsLink;
    }
    if (rateEl) rateEl.setAttribute('aria-label', 'Valoración media de ' + avgStr + ' sobre 5');

    var grid = document.getElementById('testiGrid');
    if (grid) {
      grid.innerHTML = reviews.slice(0, 12).map(function (r) {
        var initial = esc((r.name || '').trim().charAt(0).toUpperCase());
        return '<figure class="testi-card">' +
            '<div class="testi-quote-mark" aria-hidden="true">&ldquo;</div>' +
            '<blockquote>' + esc(r.text) + '</blockquote>' +
            '<figcaption>' +
              '<span class="testi-mono" aria-hidden="true">' + initial + '</span>' +
              '<span class="testi-who"><b>' + esc(r.name) + '</b>' +
                (r.meta ? '<span>' + esc(r.meta) + '</span>' : '') +
              '</span>' +
            '</figcaption>' +
          '</figure>';
      }).join('');
    }
    section.hidden = false;

    var ugc = (Array.isArray(window.PRETO_UGC) ? window.PRETO_UGC : []).filter(Boolean);
    var ugcWrap = document.getElementById('testiUgc');
    var rail = document.getElementById('ugcRail');
    if (ugc.length && rail && ugcWrap) {
      rail.innerHTML = ugc.map(function (src) {
        return '<a class="ugc-tile has-image" href="https://www.instagram.com/pretostoregold" target="_blank" rel="noopener" ' +
          'style="background-image:url(\'' + esc(src) + '\');background-size:cover;background-position:center;"></a>';
      }).join('');
      ugcWrap.hidden = false;
    } else if (ugcWrap) { ugcWrap.hidden = true; }

    try {
      var ld = {
        "@context": "https://schema.org", "@type": "Organization", "@id": "https://pretogold.store/#org",
        "name": "Preto by Dala&Co",
        "aggregateRating": { "@type": "AggregateRating", "ratingValue": avgRounded, "bestRating": 5, "worstRating": 1, "reviewCount": count },
        "review": reviews.slice(0, 20).map(function (r) {
          var rev = { "@type": "Review", "reviewRating": { "@type": "Rating", "ratingValue": r.rating, "bestRating": 5 }, "author": { "@type": "Person", "name": r.name }, "reviewBody": r.text };
          if (r.date) rev.datePublished = r.date;
          return rev;
        })
      };
      var s = document.createElement('script');
      s.type = 'application/ld+json';
      s.textContent = JSON.stringify(ld);
      document.head.appendChild(s);
    } catch (e) { /* extra, no rompe la página */ }
  }

  if (manualAll.length) render(null);
  fetch('/.netlify/functions/google-reviews', { headers: { accept: 'application/json' } })
    .then(function (res) { return res.ok ? res.json() : null; })
    .catch(function () { return null; })
    .then(function (google) { render(google); });
})();
