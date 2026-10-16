/* ───────────────────────────────────────────────────────────────
   Preto by Dala&Co · REENVÍO del correo de BIENVENIDA (backfill)
   ───────────────────────────────────────────────────────────────
   Envía el correo de bienvenida a los clientes que YA se habían
   registrado y nunca lo recibieron (por el fallo de App Check).

   · Lee la lista REAL de usuarios desde Firebase Auth (Admin SDK),
     así no se escapa nadie aunque su ficha en Firestore no exista.
   · Salta a quien ya tiene `welcomeEmailSent` (nunca reenvía doble).
   · Reutiliza la función welcome-email (mismo diseño y remitente).
   · Marca `welcomeEmailSent` en Firestore al terminar cada uno.
   · Trabaja por LOTES pequeños para no exceder el límite de Resend
     ni el tiempo de la función. La página la llama en bucle.

   Protegido con un token secreto:  BACKFILL_TOKEN  (variable en
   Netlify). Sin ese token, la función no hace nada.

   Llamada (POST JSON):
     { "token":"...", "dry":true }          → solo cuenta / previsualiza
     { "token":"...", "limit":6 }           → envía un lote de 6
   ─────────────────────────────────────────────────────────────── */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const BACKFILL_TOKEN = process.env.BACKFILL_TOKEN || '';
const { originAllowed, limiter, fallo } = require('../seguridad.js');
/* Herramienta interna: 8 llamadas cada 10 min por instancia. Sirve para
   que nadie pueda adivinar BACKFILL_TOKEN a fuerza de intentos. */
const limite = limiter({ max: 8, minutes: 10 });


/* Comparación en tiempo constante: no deja medir la clave carácter a
   carácter por el tiempo de respuesta. */
function tokenOk(recibido, esperado) {
  if (!esperado) return false;
  const crypto = require('crypto');
  const a = Buffer.from(String(recibido || ''));
  const b = Buffer.from(String(esperado));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

let adminDb = null;
function getAdmin() {
  if (adminDb) return adminDb;
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) return null;
  const admin = require('firebase-admin');
  if (!admin.apps.length) {
    const cred = JSON.parse(raw);
    if (cred.private_key) cred.private_key = cred.private_key.replace(/\\n/g, '\n');
    admin.initializeApp({ credential: admin.credential.cert(cred) });
  }
  adminDb = admin;
  return admin;
}

/* Mismo formato de código de cortesía que usa la web (cuenta.js). */
function makeWelcomeCode(name) {
  const base = String(name || '').trim().split(/\s+/)[0] || '';
  const clean = base.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toUpperCase().replace(/[^A-Z]/g, '');
  const c = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let sfx = '';
  for (let i = 0; i < 3; i++) sfx += c[Math.floor(Math.random() * c.length)];
  return clean ? ('MAISON' + clean + sfx) : ('MAISON' + sfx + sfx);
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

exports.handler = async (event) => {
  const reqOrigin = (event.headers && (event.headers.origin || event.headers.Origin)) || '';
  const headers = {
    'Access-Control-Allow-Origin': originAllowed(reqOrigin) ? reqOrigin : 'https://pretogold.store',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Método no permitido' }) };

  let data = {};
  try { data = JSON.parse(event.body || '{}'); }
  catch (e) { return { statusCode: 400, headers, body: JSON.stringify({ error: 'Cuerpo inválido' }) }; }

  // ── Seguridad ────────────────────────────────────────────────
  if (!BACKFILL_TOKEN) {
    return { statusCode: 403, headers, body: JSON.stringify({ error: 'Falta configurar BACKFILL_TOKEN en Netlify. Ponla en Site settings → Environment variables y vuelve a desplegar.' }) };
  }
  if (limite()) {
    return { statusCode: 429, headers, body: JSON.stringify({ error: 'Demasiadas solicitudes. Espera unos minutos.' }) };
  }
  if (!tokenOk(data.token, BACKFILL_TOKEN)) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: 'Token incorrecto.' }) };
  }
  if (!RESEND_API_KEY) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Falta RESEND_API_KEY.' }) };
  }

  const admin = getAdmin();
  if (!admin) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Falta FIREBASE_SERVICE_ACCOUNT (no puedo leer la lista de clientes).' }) };
  }

  const dry   = !!data.dry;
  const limit = Math.min(Math.max(parseInt(data.limit, 10) || 6, 1), 12);
  const db    = admin.firestore();
  const auth  = admin.auth();

  try {
    // 1) Fichas de clientes existentes: uid → datos (incl. welcomeEmailSent)
    const docs = {};
    const snap = await db.collection('customers').get();
    snap.forEach(d => { docs[d.id] = d.data() || {}; });

    // 2) TODOS los usuarios registrados (Auth es la fuente de verdad)
    const users = [];
    let pageToken;
    let guard = 0;
    do {
      const page = await auth.listUsers(1000, pageToken);
      page.users.forEach(u => users.push(u));
      pageToken = page.pageToken;
      guard++;
    } while (pageToken && guard < 25);

    // 3) Pendientes: con correo y SIN welcomeEmailSent
    const pending = [];
    for (const u of users) {
      const doc = docs[u.uid] || {};
      const email = (doc.email || u.email || '').trim();
      if (!email || !/\S+@\S+\.\S+/.test(email)) continue;
      if (doc.welcomeEmailSent) continue;         // ya recibió → saltar
      pending.push({
        uid: u.uid,
        email,
        name: doc.name || u.displayName || '',
        code: doc.welcomeCode || ''
      });
    }

    // ── Modo previsualización: solo cuenta ──────────────────────
    if (dry) {
      return {
        statusCode: 200, headers,
        body: JSON.stringify({
          ok: true, dry: true,
          totalUsers: users.length,
          pending: pending.length,
          preview: pending.slice(0, 25).map(p => ({ email: p.email, name: p.name }))
        })
      };
    }

    // ── Envío de un lote ────────────────────────────────────────
    const host = event.headers && (event.headers['x-forwarded-host'] || event.headers.host);
    const base = process.env.URL || (host ? `https://${host}` : 'https://pretogold.store');
    const endpoint = base + '/.netlify/functions/welcome-email';

    const batch = pending.slice(0, limit);
    let sent = 0, failed = 0;
    const details = [];

    for (const p of batch) {
      const code = p.code || makeWelcomeCode(p.name);
      try {
        const r = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-preto-internal': BACKFILL_TOKEN },
          body: JSON.stringify({ correo: p.email, nombre: p.name, codigo: code })
        });
        if (!r.ok) throw new Error('welcome-email ' + r.status);
        // Marca en Firestore (crea la ficha si no existía)
        await db.collection('customers').doc(p.uid).set({
          email: p.email,
          name: p.name,
          welcomeCode: code,
          welcomeEmailSent: new Date().toISOString(),
          welcomeEmailBackfill: true
        }, { merge: true });
        sent++;
        details.push({ email: p.email, ok: true });
        console.log('[backfill] enviado a', p.email);
      } catch (e) {
        failed++;
        details.push({ email: p.email, ok: false, error: 'envío fallido' });
        console.error('[backfill] falló', p.email, e.message);
      }
      await sleep(600); // respeta el límite de Resend
    }

    return {
      statusCode: 200, headers,
      body: JSON.stringify({
        ok: true,
        totalUsers: users.length,
        pendingBefore: pending.length,
        sent, failed,
        remaining: pending.length - sent,
        done: (pending.length - sent) <= 0,
        details
      })
    };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: fallo('[backfill]', e, 'No se pudo completar el reenvío. Mira los logs de Netlify.') }) };
  }
};
