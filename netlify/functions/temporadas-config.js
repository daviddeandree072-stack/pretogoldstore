/* ───────────────────────────────────────────────────────────────
   Preto by Dala&Co · Ajustes de las campañas de temporada
   ───────────────────────────────────────────────────────────────
   Devuelve el documento Firestore config/temporadas, que escribe el
   panel de administración (admin.html → Temporadas). La portada lo
   pide desde temporadas.js para saber qué campaña está apagada, qué
   días ocupa y si lleva flotantes.

   Se lee con el Admin SDK: así la web no necesita cargar Firebase
   solo para leer un JSON pequeño, y la colección config puede quedar
   cerrada al público en las reglas. Va con caché de dos minutos en el
   navegador y cinco en la CDN de Netlify.

   Variables de entorno (ya puestas para bold-webhook.js):
     FIREBASE_SERVICE_ACCOUNT → JSON de la cuenta de servicio
   ─────────────────────────────────────────────────────────────── */

let adminDb = null;
function getDb() {
  if (adminDb) return adminDb;
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) return null;
  try {
    const admin = require('firebase-admin');
    if (!admin.apps.length) {
      const cred = JSON.parse(raw);
      if (cred.private_key) cred.private_key = cred.private_key.replace(/\\n/g, '\n');
      admin.initializeApp({ credential: admin.credential.cert(cred) });
    }
    adminDb = admin.firestore();
    return adminDb;
  } catch (e) {
    console.error('temporadas-config: no se pudo iniciar Firebase Admin:', e.message);
    return null;
  }
}

/* Solo se devuelven los campos que la portada entiende, con sus tipos
   comprobados: el documento lo escribe el panel, pero el JSON llega al
   navegador de cualquier visitante y conviene que sea pequeño y limpio. */
const IDS = ['mujer', 'silencio', 'madre', 'padre', 'bandera', 'amor', 'penumbra', 'urgencia', 'fuego'];
const INTENSIDADES = ['suave', 'media', 'alta'];
const FECHA = /^\d{4}-\d{2}-\d{2}$/;
function limpiar(doc) {
  const out = { temporadas: {} };
  const t = (doc && doc.temporadas) || {};
  IDS.forEach((id) => {
    const a = t[id];
    if (!a || typeof a !== 'object') return;
    const c = {};
    if (a.activa === false) c.activa = false;
    if (a.flotantes === false) c.flotantes = false;
    if (INTENSIDADES.includes(a.intensidad) && a.intensidad !== 'media') c.intensidad = a.intensidad;
    if (typeof a.desde === 'string' && FECHA.test(a.desde)) c.desde = a.desde;
    if (typeof a.hasta === 'string' && FECHA.test(a.hasta)) c.hasta = a.hasta;
    if (Object.keys(c).length) out.temporadas[id] = c;
  });
  if (doc && typeof doc.updatedAt === 'string') out.updatedAt = doc.updatedAt.slice(0, 40);
  return out;
}

exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'public, max-age=120, s-maxage=300, stale-while-revalidate=600',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };
  if (event.httpMethod !== 'GET') return { statusCode: 405, headers, body: '{"error":"Método no permitido"}' };

  const db = getDb();
  if (!db) {
    /* Sin cuenta de servicio la portada sigue con los valores por
       defecto: se responde vacío, no error, para no ensuciar consolas. */
    return { statusCode: 200, headers, body: JSON.stringify({ temporadas: {} }) };
  }
  try {
    const snap = await db.collection('config').doc('temporadas').get();
    return { statusCode: 200, headers, body: JSON.stringify(limpiar(snap.exists ? snap.data() : null)) };
  } catch (e) {
    console.error('temporadas-config: error leyendo Firestore:', e.message);
    return { statusCode: 200, headers: Object.assign({}, headers, { 'Cache-Control': 'no-store' }), body: JSON.stringify({ temporadas: {} }) };
  }
};
