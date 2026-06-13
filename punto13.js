/* ═══════════════════════════════════════════════════════════════
   PRETO BY DALA&CO — PUNTO 13 DEL INFORME CRO
   Recuperación de cotización + enganche con el Círculo Preto
   ───────────────────────────────────────────────────────────────
   Se carga DESPUÉS de app.js. No reescribe nada: envuelve saveQuote
   para registrar cuándo cambió la cotización y muestra un aviso
   sobrio cuando el visitante vuelve con una selección sin enviar.

   ► Editable sin tocar nada más:
     · RECOVER.minIdleMs   — cuánto debe "reposar" la cotización
                             antes de ofrecer retomarla (def. 20 min).
     · RECOVER.snoozeMs    — cuánto se silencia tras descartar (24 h).
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var RECOVER = {
    minIdleMs: 20 * 60 * 1000,   // 20 minutos de inactividad → es un "retorno"
    snoozeMs: 24 * 60 * 60 * 1000, // 24 h de silencio tras descartar
    firstDelayMs: 3200,          // espera tras cargar antes de evaluar
  };

  var K_UPDATED = 'preto.quote.updatedAt';
  var K_SENT = 'preto.quoteSentAt';
  var K_DISMISS = 'preto.recovery.dismissedAt';
  var K_DISMISS_SIG = 'preto.recovery.dismissedSig';
  var K_LASTVISIT = 'preto.lastVisit';

  function num(v) { var n = parseInt(v, 10); return isNaN(n) ? 0 : n; }
  function getQuote() { try { return JSON.parse(localStorage.getItem('preto.quote.v1') || '[]'); } catch (e) { return []; } }
  function fmtCOP(n) { try { return '$' + Math.round(n).toLocaleString('es-CO'); } catch (e) { return '$' + Math.round(n); } }

  /* ── Marca cada cambio de la cotización ───────────────────── */
  if (typeof window.saveQuote === 'function') {
    var _saveQuote = window.saveQuote;
    window.saveQuote = function () {
      _saveQuote.apply(this, arguments);
      try { localStorage.setItem(K_UPDATED, String(Date.now())); } catch (e) {}
    };
  }
  // saveQuote es declarada con `function` en app.js → existe en el scope global
  // pero la referencia anterior puede no capturarla; envolvemos también la global.
  try {
    if (typeof saveQuote === 'function' && saveQuote !== window.saveQuote) {
      var _sq2 = saveQuote;
      saveQuote = function () {
        _sq2.apply(this, arguments);
        try { localStorage.setItem(K_UPDATED, String(Date.now())); } catch (e) {}
      };
    }
  } catch (e) {}

  /* ── Firma de la cotización (para re-armar si cambia) ─────── */
  function quoteSig(q) {
    return q.map(function (it) { return it.key + 'x' + it.qty; }).sort().join('|');
  }
  function quoteCounts(q) {
    var units = 0, subtotal = 0, allPriced = true, physical = 0;
    q.forEach(function (it) {
      units += (it.qty || 1);
      if (it.kind !== 'giftcard') physical += (it.qty || 1);
      if (it.price != null && it.price !== '') subtotal += (+it.price) * (it.qty || 1);
      else allPriced = false;
    });
    return { units: units, subtotal: subtotal, allPriced: allPriced, physical: physical };
  }

  /* ── ¿Procede mostrar el aviso? ───────────────────────────── */
  function shouldOffer() {
    var q = getQuote();
    if (!q.length) return null;

    var updated = num(localStorage.getItem(K_UPDATED));
    if (!updated) {
      // cotización antigua sin marca de tiempo → sembramos una en el pasado
      updated = Date.now() - RECOVER.minIdleMs - 1;
      try { localStorage.setItem(K_UPDATED, String(updated)); } catch (e) {}
    }

    // ¿ya se envió después del último cambio?
    var sent = num(localStorage.getItem(K_SENT));
    if (sent && sent >= updated) return null;

    var now = Date.now();
    var lastVisit = num(localStorage.getItem(K_LASTVISIT));
    var idle = now - updated;                 // tiempo desde el último cambio
    var awayGap = lastVisit ? (now - lastVisit) : Infinity; // tiempo fuera del sitio

    // Es "retorno" si la selección reposó o si el visitante volvió tras un rato.
    var isReturn = idle >= RECOVER.minIdleMs || awayGap >= RECOVER.minIdleMs;
    if (!isReturn) return null;

    // ¿silenciado para esta misma selección?
    var sig = quoteSig(q);
    var dAt = num(localStorage.getItem(K_DISMISS));
    var dSig = localStorage.getItem(K_DISMISS_SIG) || '';
    if (dAt && dSig === sig && (now - dAt) < RECOVER.snoozeMs) return null;

    return { quote: q, sig: sig };
  }

  /* ── UI del aviso ─────────────────────────────────────────── */
  var el = null;
  function build(data) {
    var c = quoteCounts(data.quote);
    var nail = c.physical || c.units;
    var pieceWord = nail === 1 ? 'pieza' : 'piezas';
    var first = data.quote[0];
    var firstName = first ? (first.name || '') : '';
    var extra = data.quote.length > 1 ? (' y ' + (data.quote.length - 1) + ' ' + (data.quote.length - 1 === 1 ? 'pieza más' : 'piezas más')) : '';
    var priceLine = c.subtotal > 0
      ? ('Subtotal ' + fmtCOP(c.subtotal) + (c.allPriced ? '' : ' +'))
      : 'Selección guardada';

    var wrap = document.createElement('div');
    wrap.className = 'recover-toast';
    wrap.setAttribute('role', 'region');
    wrap.setAttribute('aria-label', 'Su cotización guardada');
    wrap.innerHTML =
      '<button class="recover-x" aria-label="Descartar">&times;</button>' +
      '<span class="recover-eyebrow">Su selección le espera</span>' +
      '<p class="recover-text">Dejó <b>' + nail + ' ' + pieceWord + '</b> en su cotización' +
        (firstName ? ' — <i>' + escapeHtml(firstName) + escapeHtml(extra) + '</i>' : '') + '.</p>' +
      '<div class="recover-foot">' +
        '<span class="recover-sub">' + priceLine + '</span>' +
        '<button class="recover-cta">Retomar mi selección</button>' +
      '</div>';
    return wrap;
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function dismiss(sig) {
    try {
      localStorage.setItem(K_DISMISS, String(Date.now()));
      localStorage.setItem(K_DISMISS_SIG, sig);
    } catch (e) {}
    hide();
  }
  function hide() {
    if (!el) return;
    el.classList.remove('show');
    var node = el;
    setTimeout(function () { if (node && node.parentNode) node.parentNode.removeChild(node); }, 480);
    el = null;
  }

  function show(data) {
    if (el) return;
    // no estorbar si el cajón ya está abierto
    var drawer = document.getElementById('drawer');
    if (drawer && drawer.classList.contains('open')) return;

    el = build(data);
    document.body.appendChild(el);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { if (el) el.classList.add('show'); });
    });

    el.querySelector('.recover-x').addEventListener('click', function () { dismiss(data.sig); });
    el.querySelector('.recover-cta').addEventListener('click', function () {
      if (typeof window.openDrawer === 'function') window.openDrawer();
      else { var b = document.getElementById('openCart'); if (b) b.click(); }
      hide();
    });

    // se esconde solo si el usuario abre el cajón por su cuenta
    var cartBtn = document.getElementById('openCart');
    if (cartBtn) cartBtn.addEventListener('click', hide, { once: true });
  }

  function evaluate() {
    var data = shouldOffer();
    if (data) show(data);
  }

  /* ── Deep link: index.html#cuenta abre el panel de cuenta ─── */
  function handleAccountHash() {
    if (location.hash === '#cuenta' || location.hash === '#circulo') {
      var b = document.getElementById('openAccount');
      if (b) setTimeout(function () { b.click(); }, 400);
    }
  }

  /* ── Arranque ─────────────────────────────────────────────── */
  function start() {
    handleAccountHash();
    setTimeout(evaluate, RECOVER.firstDelayMs);
    // registra la visita al salir, para detectar el próximo retorno
    window.addEventListener('pagehide', function () {
      try { localStorage.setItem(K_LASTVISIT, String(Date.now())); } catch (e) {}
    });
    window.addEventListener('beforeunload', function () {
      try { localStorage.setItem(K_LASTVISIT, String(Date.now())); } catch (e) {}
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();

  // Para pruebas: window.PretoRecovery.show() fuerza el aviso ahora.
  window.PretoRecovery = {
    show: function () {
      var q = getQuote();
      if (q.length) show({ quote: q, sig: quoteSig(q) });
    },
    hide: hide,
    reset: function () {
      try { localStorage.removeItem(K_DISMISS); localStorage.removeItem(K_DISMISS_SIG); } catch (e) {}
    },
  };
})();
