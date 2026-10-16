/* ───────────────────────────────────────────────────────────────
   Preto by Dala&Co · Meta Pixel — eventos de interacción
   ───────────────────────────────────────────────────────────────
   Se carga en todas las páginas de cara al cliente, DESPUÉS del
   código base del píxel. Centraliza el evento de contacto para no
   repetir el mismo listener en cada página.

   · Contact → cualquier apertura de WhatsApp por enlace directo
     (a href wa.me / whatsapp) o el botón del chat (.pc-wa-cta).

   Los botones programáticos de la tienda (flotante, ficha, Elite)
   disparan Contact desde app.js, dentro de openWhatsApp(), por lo
   que aquí solo cubrimos los enlaces <a> y el CTA del chat — nunca
   se solapan, así el evento no se cuenta dos veces.
   ─────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  // Dispara un evento del píxel solo si el píxel está cargado.
  function track(event, params) {
    if (typeof window.fbq !== 'function') return;
    if (params) window.fbq('track', event, params);
    else window.fbq('track', event);
  }
  // Expuesto para que otros scripts reutilicen el mismo guard si lo necesitan.
  window.pretoPixel = { track: track };

  // Evita contar dos veces el mismo clic (algunos navegadores emiten
  // clicks duplicados muy seguidos, p. ej. touch + mouse).
  var lastContact = 0;
  function contact() {
    var now = Date.now();
    if (now - lastContact < 600) return;
    lastContact = now;
    track('Contact');
  }

  var WA_SELECTOR =
    'a[href*="wa.me"], a[href*="api.whatsapp.com"], a[href*="whatsapp.com"], .pc-wa-cta';

  // Captura en fase de captura para registrar el contacto aunque un
  // handler interno detenga la propagación del clic.
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (t && t.closest && t.closest(WA_SELECTOR)) contact();
  }, true);
})();
