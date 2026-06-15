/* ═══════════════════════════════════════════════════════════════
   PRETO BY DALA&CO — ANALÍTICA
   Punto 22 del informe CRO · Medición desde el día 1
   ───────────────────────────────────────────────────────────────
   ► QUÉ HACE
     · NO carga nada hasta que el visitante ACEPTA cookies (usa la API
       de cookies.js → PretoConsent). Cumple Habeas Data + cookies.
     · Una vez con permiso, carga GA4 (y, si los configuras, Meta Pixel
       y Microsoft Clarity) y empieza a medir el embudo.
     · Engancha solo los eventos clave por delegación, sin tocar app.js:
         page_view ......... automático (GA4)
         whatsapp_click .... clic en cualquier enlace de WhatsApp (conversión)
         newsletter_signup . envío del formulario de newsletter
         add_to_quote ...... botón "Añadir a cotización"
         select_item ....... clic en una ficha de producto

   ► QUÉ DEBES HACER (1 sola vez, antes de lanzar)
     Reemplaza los valores de CONFIG por tus IDs reales.
     · GA4_ID:   crea una propiedad en analytics.google.com → "G-XXXXXXXXXX"
     · PIXEL_ID: (opcional) Meta Business → Eventos → tu ID numérico
     · CLARITY_ID: (opcional) clarity.microsoft.com → tu ID de proyecto
     Deja en '' los que no uses; esa herramienta simplemente no se carga.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var CONFIG = {
    GA4_ID:     'G-PR29XCGHPY',   // ← Preto Gold Store · pretogold.store
    PIXEL_ID:   '',               // ← (opcional) ID de Meta Pixel
    CLARITY_ID: ''                // ← (opcional) ID de Microsoft Clarity
  };

  var PLACEHOLDER = /^G-X+$/;     // detecta el GA4_ID de ejemplo sin configurar
  var loaded = false;

  function gaReady()    { return CONFIG.GA4_ID && !PLACEHOLDER.test(CONFIG.GA4_ID); }
  function pixelReady() { return !!CONFIG.PIXEL_ID; }
  function clarityReady(){ return !!CONFIG.CLARITY_ID; }

  /* ── Carga de scripts externos ────────────────────────────── */
  function loadGA4() {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + CONFIG.GA4_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', CONFIG.GA4_ID, { anonymize_ip: true });
  }
  function loadPixel() {
    /* eslint-disable */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
      (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    window.fbq('init', CONFIG.PIXEL_ID);
    window.fbq('track', 'PageView');
  }
  function loadClarity() {
    /* eslint-disable */
    (function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,'clarity','script',CONFIG.CLARITY_ID);
    /* eslint-enable */
  }

  function boot() {
    if (loaded) return;
    loaded = true;
    if (gaReady())      loadGA4();
    if (pixelReady())   loadPixel();
    if (clarityReady()) loadClarity();
    bindEvents();
  }

  /* ── Emisor de eventos unificado ──────────────────────────── */
  function track(name, params) {
    params = params || {};
    try { if (window.gtag && gaReady()) window.gtag('event', name, params); } catch (e) {}
    try {
      if (window.fbq && pixelReady()) {
        var map = { whatsapp_click: 'Contact', begin_quote: 'InitiateCheckout',
                    add_to_quote: 'AddToCart', newsletter_signup: 'Lead', select_item: 'ViewContent' };
        window.fbq('trackCustom', name, params);
        if (map[name]) window.fbq('track', map[name], params);
      }
    } catch (e) {}
  }
  window.pretoTrack = track;  // disponible para llamadas manuales desde otros scripts

  /* ── Enganche de eventos por delegación (no toca app.js) ──── */
  function bindEvents() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href]');
      if (a) {
        var href = a.getAttribute('href') || '';
        if (/wa\.me|api\.whatsapp\.com|whatsapp:/.test(href)) {
          track('whatsapp_click', { link_url: href });
          track('begin_quote', {});
          return;
        }
        if (/\/joyeria\/[a-z0-9-]+\.html/i.test(href)) {
          track('select_item', { item_id: href.split('/').pop().replace('.html', '') });
          return;
        }
      }
      var addBtn = e.target.closest && e.target.closest('.var-add, [data-add-to-quote], [data-id]');
      if (addBtn && /a\u00f1adir a cotizaci\u00f3n|añadir a cotización/i.test(addBtn.textContent || '')) {
        track('add_to_quote', { item_id: addBtn.getAttribute('data-id') || '' });
      }
    }, true);

    var nf = document.getElementById('newsForm');
    if (nf) nf.addEventListener('submit', function () { track('newsletter_signup', {}); });
  }

  /* ── Arranque: solo con consentimiento ────────────────────── */
  function init() {
    if (window.PretoConsent) {
      window.PretoConsent.onGranted(boot);   // corre ya si aceptó, o al aceptar
    } else {
      /* Si por alguna razón no está cookies.js, no medimos sin permiso:
         esperamos el evento de consentimiento. */
      document.addEventListener('preto:consent', function (ev) {
        if (ev.detail && ev.detail.value === 'all') boot();
      });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
