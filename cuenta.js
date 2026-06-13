/* ─────────────────────────────────────────────────────────────
   Preto by Dala&Co — Cuentas de cliente, favoritos, beneficios
   y seguimiento de pedidos. Se apoya en el mismo proyecto Firebase
   del panel admin (preto-pedidos): Auth + Firestore.
   ───────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  /* ════════ CONFIGURACIÓN DE BENEFICIOS ════════════════════════
     Edite estos valores con sus reglas reales.                    */
  const WELCOME = {
    bonusPoints: 500,                 // puntos de regalo al crear la cuenta
    giftLabel: 'Regalo de bienvenida',
    giftDesc: '10% en su primera pieza',   // ← cambie su % o regalo real
  };
  // Puntos: 1 punto por cada $1.000 COP en pedidos entregados.
  const POINTS_PER_COP = 1 / 1000;
  const TIERS = [
    { key: 'iniciado',    label: 'Iniciado',    min: 0 },
    { key: 'distinguido', label: 'Distinguido', min: 1500 },
    { key: 'maison',      label: 'Maison',      min: 5000 },
  ];
  // Beneficios que se desbloquean en cada nivel del Círculo Preto.
  // Son acumulativos: cada nivel suma a los del anterior.
  const TIER_BENEFITS = {
    iniciado: [
      'Favoritos guardados en todos sus dispositivos',
      'Seguimiento de sus pedidos en línea',
      'Regalo de bienvenida en su primera pieza',
      'Atención prioritaria por WhatsApp',
    ],
    distinguido: [
      'Acceso anticipado a piezas únicas y ediciones',
      'Limpieza anual gratuita de sus joyas',
    ],
    maison: [
      'Invitación a eventos privados del atelier',
      'Asesoría personal de la casa',
      'Grabado de cortesía en su pieza',
    ],
  };
  function benefitsUpTo(tierKey) {
    const out = [];
    for (const t of TIERS) {
      (TIER_BENEFITS[t.key] || []).forEach((b) => out.push({ b, tier: t }));
      if (t.key === tierKey) break;
    }
    return out;
  }
  const BENEFITS = [
    'Sus favoritos guardados en todos sus dispositivos',
    'Seguimiento de sus pedidos en línea',
    'Regalo de bienvenida en su primera pieza',
    'Programa de puntos y niveles de la casa',
    'Atención prioritaria por WhatsApp',
  ];
  const INSURANCE_RATE = 0.02;

  const STATUSES = [
    { key: 'creado',     label: 'Creado' },
    { key: 'confirmado', label: 'Confirmado' },
    { key: 'enviado',    label: 'Enviado' },
    { key: 'entregado',  label: 'Entregado' },
  ];
  const statusIndex = (k) => Math.max(0, STATUSES.findIndex((s) => s.key === k));

  /* ════════ Utilidades ═════════════════════════════════════════ */
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const fmtCOP = (n) => {
    try { return '$' + Math.round(n).toLocaleString('es-CO'); } catch (e) { return '$' + Math.round(n); }
  };
  const fmtDate = (iso) => {
    if (!iso) return '—';
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' });
    } catch (e) { return '—'; }
  };
  const catalog = () => (typeof COLLECTIONS !== 'undefined' ? COLLECTIONS : []);
  const findProduct = (id) => catalog().find((x) => x.id === id) || null;

  function orderTotals(o) {
    let sub = 0, any = false;
    (o.items || []).forEach((i) => {
      if (i.price != null && i.price !== '') { sub += (+i.price) * (i.qty || 1); any = true; }
    });
    const seg = Math.round(sub * INSURANCE_RATE);
    return { sub, seg, total: sub + seg, any };
  }

  /* ════════ FAVORITOS (corazón) ════════════════════════════════ */
  const WISHKEY = 'preto.wishlist.v1';
  let wish = [];
  try { wish = JSON.parse(localStorage.getItem(WISHKEY) || '[]'); } catch (e) { wish = []; }
  if (!Array.isArray(wish)) wish = [];

  function persistWishLocal() {
    try { localStorage.setItem(WISHKEY, JSON.stringify(wish)); } catch (e) {}
  }
  function hasFav(id) { return wish.indexOf(id) >= 0; }

  function toggleFav(id, btnEl) {
    if (!id) return;
    const i = wish.indexOf(id);
    const adding = i < 0;
    if (adding) wish.push(id); else wish.splice(i, 1);
    persistWishLocal();
    reflectFavButtons();
    renderWishCount();
    renderWishDrawer();
    syncWishToCloud();
    touchActivity();
    if (adding && btnEl) flashHeart(btnEl);
  }

  function flashHeart(el) {
    el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
    setTimeout(() => el.classList.remove('pop'), 480);
  }

  // Refleja el estado guardado en TODOS los corazones (incluye clones del carrusel).
  function reflectFavButtons() {
    document.querySelectorAll('.pcard-fav').forEach((b) => {
      const on = hasFav(b.dataset.id);
      b.classList.toggle('on', on);
      b.setAttribute('aria-label', on ? 'Quitar de favoritos' : 'Añadir a favoritos');
    });
  }

  function renderWishCount() {
    const el = $('wishCount');
    if (!el) return;
    const n = wish.length;
    el.textContent = n;
    el.style.display = n ? '' : 'none';
  }

  function renderWishDrawer() {
    const c = $('wishItems');
    const foot = $('wishFoot');
    if (!c) return;
    if (!wish.length) {
      c.innerHTML = `
        <div class="drawer-empty">
          <div class="glyph">Preto</div>
          <p>Aún no ha guardado piezas. Toque el corazón sobre cualquier joya para conservarla aquí.</p>
        </div>`;
      if (foot) foot.style.display = 'none';
      return;
    }
    if (foot) foot.style.display = '';
    c.innerHTML = wish.map((id) => {
      const p = findProduct(id);
      const name = p ? p.name : id;
      const label = p ? (p.label || '') : '';
      const col = p ? (p.col || '') : '';
      const art = (p && p.image)
        ? `<div class="wish-thumb has-image" style="background-image:url('${p.image}')"></div>`
        : `<div class="wish-thumb" data-label="${esc(label)}"></div>`;
      return `
        <div class="wish-item" data-id="${esc(id)}">
          ${art}
          <div class="info">
            <h6>${esc(name)}</h6>
            <div class="ref">Ref. ${esc(id)}${col ? ' · ' + esc(col) : ''}</div>
            <div class="wish-acts">
              <button class="wish-add" data-add="${esc(id)}">Añadir a cotización</button>
              <button class="wish-rm" data-rm="${esc(id)}">Retirar</button>
            </div>
          </div>
        </div>`;
    }).join('');

    c.querySelectorAll('[data-add]').forEach((b) => {
      b.addEventListener('click', () => {
        const id = b.dataset.add;
        const p = findProduct(id);
        if (p && p.variants) { closeWish(); if (typeof openCategory === 'function') openCategory(id); return; }
        if (typeof addToQuote === 'function') addToQuote(id, null, b);
      });
    });
    c.querySelectorAll('[data-rm]').forEach((b) => {
      b.addEventListener('click', () => toggleFav(b.dataset.rm, null));
    });
  }

  /* ════════ Drawers (favoritos + cuenta) ───────────────────────
     Veil propio para no interferir con el de cotización.          */
  const panelVeil = $('panelVeil');
  function openPanel(drawer) {
    document.querySelectorAll('.drawer').forEach((d) => { if (d !== drawer) d.classList.remove('open'); });
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    if (panelVeil) panelVeil.classList.add('open');
  }
  function closePanels() {
    if ($('wishDrawer')) { $('wishDrawer').classList.remove('open'); $('wishDrawer').setAttribute('aria-hidden', 'true'); }
    if ($('acctDrawer')) { $('acctDrawer').classList.remove('open'); $('acctDrawer').setAttribute('aria-hidden', 'true'); }
    if (panelVeil) panelVeil.classList.remove('open');
  }
  function openWish() { renderWishDrawer(); openPanel($('wishDrawer')); }
  function closeWish() { closePanels(); }
  function openAcct() { openPanel($('acctDrawer')); }

  if (panelVeil) panelVeil.addEventListener('click', closePanels);
  if ($('closeWish')) $('closeWish').addEventListener('click', closePanels);
  if ($('closeAcct')) $('closeAcct').addEventListener('click', closePanels);
  if ($('openWishlist')) $('openWishlist').addEventListener('click', openWish);
  if ($('openAccount')) $('openAccount').addEventListener('click', openAcct);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePanels(); });

  if ($('wishToQuote')) $('wishToQuote').addEventListener('click', () => {
    const ids = wish.slice();
    let added = 0;
    ids.forEach((id) => {
      const p = findProduct(id);
      if (p && !p.variants && typeof addToQuote === 'function') { addToQuote(id, null, null); added++; }
    });
    closePanels();
    if (!added && typeof openCategory === 'function' && ids.length) {
      const first = findProduct(ids[0]);
      if (first && first.variants) openCategory(ids[0]);
    }
  });
  if ($('wishClear')) $('wishClear').addEventListener('click', () => {
    wish = []; persistWishLocal(); reflectFavButtons(); renderWishCount(); renderWishDrawer(); syncWishToCloud();
  });

  // Hook usado por app.js (botón corazón de cada tarjeta)
  window.PretoFav = { toggle: toggleFav, has: hasFav, list: () => wish.slice() };

  /* ════════ FIREBASE (Auth + Firestore) ────────────────────────
     Reutiliza el proyecto del panel admin.                        */
  let auth = null, db = null, fbReady = false, currentUser = null, custDoc = null, ordersCache = null;

  function initFirebase() {
    const cfg = window.PRETO_FIREBASE_CONFIG;
    if (!cfg || !window.firebase) { renderAcct(); return; }
    try {
      const app = firebase.apps && firebase.apps.length ? firebase.app() : firebase.initializeApp(cfg);
      auth = firebase.auth();
      db = firebase.firestore();
      try { auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL); } catch (e) {}
      fbReady = true;
      auth.onAuthStateChanged(onAuthChange);
    } catch (e) {
      console.warn('[Preto] Firebase no disponible:', e);
      renderAcct();
    }
  }

  function onAuthChange(user) {
    currentUser = user || null;
    updateAcctDot();
    if (user) {
      ensureCustomerDoc(user).then(() => {
        mergeCloudWishlist();
        loadOrders();
        renderAcct();
      });
    } else {
      custDoc = null; ordersCache = null;
      renderAcct();
    }
  }

  function updateAcctDot() {
    const dot = $('acctDot');
    if (dot) dot.classList.toggle('on', !!currentUser);
  }

  function makeWelcomeCode() {
    const c = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let s = '';
    for (let i = 0; i < 5; i++) s += c[Math.floor(Math.random() * c.length)];
    return 'PRETO-' + s;
  }

  async function ensureCustomerDoc(user) {
    if (!db) return;
    const ref = db.collection('customers').doc(user.uid);
    try {
      const snap = await ref.get();
      if (!snap.exists) {
        const data = {
          name: user.displayName || '',
          email: user.email || '',
          phone: user.phoneNumber || '',
          createdAt: new Date().toISOString(),
          welcomeBonus: WELCOME.bonusPoints,
          welcomeCode: makeWelcomeCode(),
          welcomeRedeemed: false,
          wishlist: wish.slice(),
          lastActivity: new Date().toISOString(),
        };
        await ref.set(data, { merge: true });
        custDoc = data;
      } else {
        custDoc = snap.data() || {};
        // completa campos faltantes en cuentas antiguas
        const patch = {};
        if (custDoc.welcomeBonus == null) patch.welcomeBonus = WELCOME.bonusPoints;
        if (!custDoc.welcomeCode) patch.welcomeCode = makeWelcomeCode();
        if (!custDoc.email && user.email) patch.email = user.email;
        if (Object.keys(patch).length) { await ref.set(patch, { merge: true }); Object.assign(custDoc, patch); }
      }
    } catch (e) { console.warn('[Preto] customer doc:', e); }
  }

  // Une favoritos del dispositivo con los de la nube (sin duplicar).
  async function mergeCloudWishlist() {
    if (!custDoc) return;
    const cloud = Array.isArray(custDoc.wishlist) ? custDoc.wishlist : [];
    const union = wish.slice();
    cloud.forEach((id) => { if (union.indexOf(id) < 0) union.push(id); });
    wish = union;
    persistWishLocal();
    reflectFavButtons();
    renderWishCount();
    renderWishDrawer();
    syncWishToCloud();
  }

  function syncWishToCloud() {
    if (!db || !currentUser) return;
    db.collection('customers').doc(currentUser.uid)
      .set({ wishlist: wish.slice(), lastActivity: new Date().toISOString() }, { merge: true })
      .catch((e) => console.warn('[Preto] sync wishlist:', e));
  }

  function touchActivity() {
    if (!db || !currentUser) return;
    db.collection('customers').doc(currentUser.uid)
      .set({ lastActivity: new Date().toISOString() }, { merge: true })
      .catch(() => {});
  }

  function markQuoteSent() {
    if (!db || !currentUser) return;
    db.collection('customers').doc(currentUser.uid)
      .set({ quoteSentAt: new Date().toISOString(), reminderSentAt: null }, { merge: true })
      .catch(() => {});
  }
  window.PretoAccount = { markQuoteSent };

  /* ── Pedidos del cliente ──────────────────────────────────── */
  async function loadOrders() {
    if (!db || !currentUser || !currentUser.email) { ordersCache = []; return; }
    try {
      const snap = await db.collection('orders').where('email', '==', currentUser.email).get();
      ordersCache = snap.docs.map((d) => { const o = d.data(); o.id = d.id; return o; });
      ordersCache.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    } catch (e) {
      console.warn('[Preto] orders:', e);
      ordersCache = null; // null = error de permisos/carga
    }
    renderAcct();
  }

  function earnedPoints() {
    if (!ordersCache) return 0;
    return ordersCache.reduce((s, o) => {
      if (o.status !== 'entregado') return s;
      return s + Math.floor(orderTotals(o).total * POINTS_PER_COP);
    }, 0);
  }
  function totalPoints() {
    const bonus = custDoc && custDoc.welcomeBonus != null ? custDoc.welcomeBonus : 0;
    return bonus + earnedPoints();
  }
  function tierFor(pts) {
    let t = TIERS[0];
    TIERS.forEach((x) => { if (pts >= x.min) t = x; });
    return t;
  }
  function nextTier(pts) {
    return TIERS.find((x) => x.min > pts) || null;
  }

  /* ════════ Render: panel de cuenta ────────────────────────────
     Dos estados: invitado (login/registro) y miembro.             */
  function renderAcct() {
    const body = $('acctBody');
    if (!body) return;
    if (currentUser) renderMember(body);
    else renderAuth(body);
  }

  function renderAuth(body) {
    const offline = !fbReady;
    body.innerHTML = `
      <div class="auth">
        <p class="auth-lede">
          Cree su cuenta para guardar sus piezas favoritas, recibir su
          <span class="gold">regalo de bienvenida</span> y seguir el estado de sus pedidos.
        </p>

        <div class="auth-tabs" role="tablist">
          <button class="auth-tab is-active" data-tab="in" type="button">Iniciar sesión</button>
          <button class="auth-tab" data-tab="up" type="button">Crear cuenta</button>
        </div>

        <button class="auth-google" id="googleBtn" type="button">
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.4 5.4 2.5 13.2l7.8 6.1C12.2 13.3 17.6 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.5 3-2.2 5.5-4.7 7.2l7.3 5.7c4.3-4 6.8-9.9 6.8-17.4z"/><path fill="#FBBC05" d="M10.3 28.3c-.5-1.5-.8-3.1-.8-4.8s.3-3.3.8-4.8l-7.8-6.1C.9 16 0 19.9 0 24s.9 8 2.5 11.4l7.8-6.1z"/><path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.3-5.7c-2 1.4-4.7 2.3-7.9 2.3-6.4 0-11.8-3.8-13.7-9.3l-7.8 6.1C6.4 42.6 14.6 48 24 48z"/></svg>
          Continuar con Google
        </button>
        <div class="auth-or"><span>o con su correo</span></div>

        <form class="auth-form" id="authForm" autocomplete="on">
          <div class="auth-field signup-only" style="display:none">
            <label for="auName">Nombre</label>
            <input type="text" id="auName" autocomplete="name" placeholder="Su nombre" />
          </div>
          <div class="auth-field">
            <label for="auEmail">Correo electrónico</label>
            <input type="email" id="auEmail" autocomplete="username" placeholder="tucorreo@gmail.com" required />
          </div>
          <div class="auth-field">
            <label for="auPwd">Contraseña</label>
            <input type="password" id="auPwd" autocomplete="current-password" placeholder="••••••••" required />
          </div>
          <div class="auth-err" id="authErr"></div>
          <button class="btn-gold" id="authSubmit" type="submit">Iniciar sesión <span aria-hidden="true" style="margin-left:2px;">→</span></button>
          <button class="auth-forgot" id="forgotBtn" type="button">¿Olvidó su contraseña?</button>
        </form>

        ${offline ? `<p class="auth-note">La conexión con el servidor de cuentas no está disponible en esta vista previa. En su sitio publicado funcionará con normalidad.</p>` : ''}

        <ul class="auth-benefits">
          ${BENEFITS.map((b) => `<li>${esc(b)}</li>`).join('')}
        </ul>
      </div>`;

    let mode = 'in';
    const tabs = body.querySelectorAll('.auth-tab');
    const signupFields = body.querySelectorAll('.signup-only');
    const submit = $('authSubmit');
    const forgot = $('forgotBtn');
    const setMode = (m) => {
      mode = m;
      tabs.forEach((t) => t.classList.toggle('is-active', t.dataset.tab === m));
      signupFields.forEach((f) => { f.style.display = m === 'up' ? '' : 'none'; });
      submit.innerHTML = (m === 'up' ? 'Crear mi cuenta' : 'Iniciar sesión') + ' <span aria-hidden="true" style="margin-left:2px;">→</span>';
      $('auPwd').setAttribute('autocomplete', m === 'up' ? 'new-password' : 'current-password');
      if (forgot) forgot.style.display = m === 'up' ? 'none' : '';
      setErr('');
    };
    tabs.forEach((t) => t.addEventListener('click', () => setMode(t.dataset.tab)));

    const setErr = (msg) => { const e = $('authErr'); if (e) e.textContent = msg || ''; };

    $('authForm').addEventListener('submit', (ev) => {
      ev.preventDefault();
      if (!fbReady) { setErr('Servicio de cuentas no disponible en la vista previa.'); return; }
      const email = $('auEmail').value.trim();
      const pwd = $('auPwd').value;
      const name = ($('auName') && $('auName').value.trim()) || '';
      if (!email || !pwd) { setErr('Complete su correo y contraseña.'); return; }
      submit.disabled = true;
      const done = () => { submit.disabled = false; };
      if (mode === 'up') {
        auth.createUserWithEmailAndPassword(email, pwd)
          .then((cred) => { if (name && cred.user) return cred.user.updateProfile({ displayName: name }); })
          .then(done)
          .catch((e) => { done(); setErr(authError(e.code)); });
      } else {
        auth.signInWithEmailAndPassword(email, pwd)
          .then(done)
          .catch((e) => { done(); setErr(authError(e.code)); });
      }
    });

    const gbtn = $('googleBtn');
    if (gbtn) gbtn.addEventListener('click', () => {
      if (!fbReady) { setErr('Servicio de cuentas no disponible en la vista previa.'); return; }
      const provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider).catch((e) => setErr(authError(e.code)));
    });

    if (forgot) forgot.addEventListener('click', () => {
      if (!fbReady) { setErr('Servicio de cuentas no disponible en la vista previa.'); return; }
      const email = $('auEmail').value.trim();
      if (!email) { setErr('Escriba su correo para enviarle el enlace de recuperación.'); return; }
      auth.sendPasswordResetEmail(email)
        .then(() => setErr('Le enviamos un correo para restablecer su contraseña.'))
        .catch((e) => setErr(authError(e.code)));
    });

    setMode('in');
  }

  function renderMember(body) {
    const name = (custDoc && custDoc.name) || (currentUser.displayName) || (currentUser.email || '').split('@')[0];
    const pts = totalPoints();
    const tier = tierFor(pts);
    const nt = nextTier(pts);
    const code = (custDoc && custDoc.welcomeCode) || '';
    const greeting = name ? name.split(' ')[0] : 'Bienvenido';

    body.innerHTML = `
      <div class="member">
        <div class="member-hd">
          <span class="member-eyebrow">Círculo Preto · Miembro</span>
          <h3 class="member-name">Hola, <span class="script">${esc(greeting)}</span></h3>
          <p class="member-mail">${esc(currentUser.email || '')}</p>
        </div>

        <div class="tier-card tier-${tier.key}">
          <div class="tier-row">
            <div>
              <span class="tier-lbl">Nivel</span>
              <span class="tier-name">${esc(tier.label)}</span>
            </div>
            <div class="tier-pts">
              <span class="num">${pts.toLocaleString('es-CO')}</span>
              <span class="lbl">puntos</span>
            </div>
          </div>
          ${nt ? `
          <div class="tier-bar"><span style="width:${Math.min(100, Math.round((pts / nt.min) * 100))}%"></span></div>
          <p class="tier-next">${(nt.min - pts).toLocaleString('es-CO')} puntos para alcanzar <b>${esc(nt.label)}</b></p>
          ` : `<p class="tier-next">Ha alcanzado el nivel más alto de la casa.</p>`}
        </div>

        ${code ? `
        <div class="gift-card">
          <span class="gift-eyebrow">${esc(WELCOME.giftLabel)}</span>
          <p class="gift-desc">${esc(WELCOME.giftDesc)}</p>
          <div class="gift-code">
            <code id="giftCode">${esc(code)}</code>
            <button class="gift-copy" id="giftCopy" type="button">Copiar</button>
          </div>
          <p class="gift-note">Presente este código a su asesor por WhatsApp al realizar su pedido.</p>
        </div>` : ''}

        <div class="member-orders">
          <div class="mo-head"><span>Mis pedidos</span></div>
          <div id="memberOrders"></div>
        </div>

        <button class="member-fav" id="memberFav" type="button">Ver mis favoritos (${wish.length})</button>
        <button class="btn-ghost" id="signOut" type="button">Cerrar sesión</button>

        <div class="member-benefits">
          <span class="mb-eyebrow">Beneficios de su nivel</span>
          <ul>${benefitsUpTo(tier.key).map((x) => `<li>${esc(x.b)}</li>`).join('')}</ul>
          <a class="mb-link" href="circulo.html">Conozca el Círculo Preto →</a>
        </div>
      </div>`;

    renderMemberOrders();

    const copyBtn = $('giftCopy');
    if (copyBtn) copyBtn.addEventListener('click', () => {
      const txt = code;
      const ok = () => { copyBtn.textContent = 'Copiado ✓'; setTimeout(() => { copyBtn.textContent = 'Copiar'; }, 1800); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(ok).catch(ok);
      else ok();
    });
    if ($('memberFav')) $('memberFav').addEventListener('click', openWish);
    if ($('signOut')) $('signOut').addEventListener('click', () => { if (auth) auth.signOut(); });
  }

  function renderMemberOrders() {
    const box = $('memberOrders');
    if (!box) return;
    if (ordersCache === null) {
      box.innerHTML = `<p class="mo-empty">No pudimos cargar sus pedidos en este momento. Intente de nuevo más tarde.</p>`;
      return;
    }
    if (!ordersCache.length) {
      box.innerHTML = `<p class="mo-empty">Aún no tiene pedidos registrados. Cuando realice su primera cotización, podrá seguir su estado aquí.</p>`;
      return;
    }
    box.innerHTML = ordersCache.map((o) => {
      const T = orderTotals(o);
      const idx = statusIndex(o.status);
      const items = (o.items || []).map((i) => esc(i.name + (i.size ? ' · ' + i.size : '') + (i.qty > 1 ? ' ×' + i.qty : ''))).join(' · ') || 'Sin piezas';
      const steps = STATUSES.map((s, i) => `
        <div class="track-step ${i <= idx ? 'done' : ''} ${i === idx ? 'current' : ''}">
          <span class="dot"></span><span class="lbl">${esc(s.label)}</span>
        </div>`).join('');
      return `
        <div class="order-card">
          <div class="oc-top">
            <div>
              <span class="oc-folio">${esc(o.folio || 'Pedido')}</span>
              <span class="oc-date">${esc(fmtDate(o.createdAt))}</span>
            </div>
            <span class="oc-status st-${esc(o.status)}">${esc((STATUSES[idx] || {}).label || o.status)}</span>
          </div>
          <p class="oc-items">${items}</p>
          <div class="track">${steps}</div>
          <div class="oc-foot">
            <span>${T.any ? fmtCOP(T.total) : 'Bajo cotización'}</span>
            <span>${esc(o.ciudad || '')}</span>
          </div>
        </div>`;
    }).join('');
  }

  function authError(code) {
    switch (code) {
      case 'auth/invalid-email': return 'El correo no es válido.';
      case 'auth/user-not-found': return 'No existe una cuenta con ese correo. Cree una nueva.';
      case 'auth/wrong-password':
      case 'auth/invalid-credential': return 'Correo o contraseña incorrectos.';
      case 'auth/email-already-in-use': return 'Ya existe una cuenta con ese correo. Inicie sesión.';
      case 'auth/weak-password': return 'La contraseña debe tener al menos 6 caracteres.';
      case 'auth/too-many-requests': return 'Demasiados intentos. Espere un momento.';
      case 'auth/popup-closed-by-user': return 'Se cerró la ventana de Google antes de terminar.';
      case 'auth/popup-blocked': return 'El navegador bloqueó la ventana de Google. Permítala e intente de nuevo.';
      case 'auth/unauthorized-domain': return 'Este dominio no está autorizado en Firebase todavía.';
      default: return 'No se pudo completar. Intente de nuevo.';
    }
  }

  /* ════════ Arranque ───────────────────────────────────────── */
  reflectFavButtons();
  renderWishCount();
  renderWishDrawer();
  renderAcct();
  initFirebase();

  // Marca actividad al navegar por el sitio (alimenta el recordatorio).
  let actTimer = null;
  window.addEventListener('scroll', () => {
    if (actTimer) return;
    actTimer = setTimeout(() => { actTimer = null; if (wish.length) touchActivity(); }, 60000);
  }, { passive: true });
})();
