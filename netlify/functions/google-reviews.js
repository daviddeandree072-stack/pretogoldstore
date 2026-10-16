/* ───────────────────────────────────────────────────────────────
   Preto by Dala&Co · Reseñas de Google en automático
   ───────────────────────────────────────────────────────────────
   Trae las reseñas reales del Perfil de Empresa de Google para que
   aparezcan solas en la sección de testimonios — sin copiarlas a mano.

   ► SOLO necesitas 1 variable en Netlify (Site settings → Environment):
       GOOGLE_PLACES_API_KEY → clave de Google Cloud con "Places API" habilitada

   La ficha del negocio se encuentra sola por su TELÉFONO (+573226955451),
   así que NO hace falta buscar el Place ID a mano. Si algún día cambia el
   teléfono o quieres fijarlo, puedes poner además (opcional):
       GOOGLE_PLACE_ID    → Place ID exacto (empieza con "ChIJ…")
       GOOGLE_PLACE_PHONE → teléfono en formato internacional (+57…)

   Ver ACTIVAR-RESEÑAS-GOOGLE.md para el paso a paso.
   Sin la clave, responde vacío y el sitio muestra solo lo de resenas.js.

   Google solo permite mostrar hasta 5 reseñas por esta vía (límite de su
   API) y pide no guardarlas permanentemente: por eso se cachean en memoria
   unas horas y nunca se escriben a un archivo. */

const KEY = process.env.GOOGLE_PLACES_API_KEY;
const PLACE_ID = process.env.GOOGLE_PLACE_ID || '';
const PHONE = process.env.GOOGLE_PLACE_PHONE || '+573226955451';
const QUERY = process.env.GOOGLE_PLACE_QUERY || 'Preto by Dala&Co joyería';
const TTL = 6 * 60 * 60 * 1000;

let cache = null;      // { at, body }
let placeIdCache = ''; // Place ID resuelto (se guarda entre llamadas calientes)

async function findPlaceId() {
  if (PLACE_ID) return PLACE_ID;
  if (placeIdCache) return placeIdCache;
  const base = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?fields=place_id&key=' + KEY;
  // 1º por teléfono (único → el más fiable), 2º por nombre.
  const tries = [
    base + '&inputtype=phonenumber&input=' + encodeURIComponent(PHONE),
    base + '&inputtype=textquery&input=' + encodeURIComponent(QUERY)
  ];
  for (const url of tries) {
    try {
      const res = await fetch(url);
      const data = await res.json();
      const cand = data && data.candidates && data.candidates[0];
      if (cand && cand.place_id) { placeIdCache = cand.place_id; return placeIdCache; }
    } catch (e) { /* intenta el siguiente */ }
  }
  return '';
}

/* Igual que en metales.js: la clave de Places se factura por consulta,
   así que solo la web de la casa puede consumir esta función. */
function originAllowed(origin) {
  if (!origin) return true;
  return origin === 'https://pretogold.store' ||
         origin === 'https://www.pretogold.store' ||
         /^https:\/\/[a-z0-9-]+(--[a-z0-9-]+)?\.netlify\.app$/i.test(origin) ||
         /^http:\/\/localhost(:\d+)?$/.test(origin);
}
const RATE = { windowStart: 0, count: 0 };
function rateLimited() {
  const now = Date.now();
  if (now - RATE.windowStart > 10 * 60 * 1000) { RATE.windowStart = now; RATE.count = 0; }
  RATE.count++;
  return RATE.count > 200;
}

exports.handler = async (event) => {
  const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=21600' };
  const origin = (event && event.headers && (event.headers.origin || event.headers.Origin)) || '';

  if (!originAllowed(origin)) {
    return { statusCode: 403, headers, body: JSON.stringify({ error: 'origen no permitido' }) };
  }
  if (rateLimited()) {
    return { statusCode: 200, headers, body: cache ? cache.body : JSON.stringify({ configured: true, reviews: [] }) };
  }

  if (!KEY) {
    return { statusCode: 200, headers, body: JSON.stringify({ configured: false, reviews: [] }) };
  }
  if (cache && (Date.now() - cache.at) < TTL) {
    return { statusCode: 200, headers, body: cache.body };
  }

  try {
    const placeId = await findPlaceId();
    if (!placeId) {
      return { statusCode: 200, headers, body: JSON.stringify({ configured: true, error: 'place_not_found', reviews: [] }) };
    }
    const url = 'https://maps.googleapis.com/maps/api/place/details/json?place_id=' +
      encodeURIComponent(placeId) + '&fields=rating,user_ratings_total,reviews,url&language=es&key=' + KEY;
    const res = await fetch(url);
    const data = await res.json();
    if (data.status !== 'OK') {
      console.error('Google Places:', data.status, data.error_message || '');
      return { statusCode: 200, headers, body: JSON.stringify({ configured: true, error: data.status, reviews: [] }) };
    }
    const r = data.result || {};
    const body = JSON.stringify({
      configured: true,
      rating: r.rating || null,
      total: r.user_ratings_total || null,
      mapsUrl: r.url || null,
      reviews: (r.reviews || []).map(rv => ({
        name: rv.author_name, rating: rv.rating, text: rv.text, time: rv.time
      }))
    });
    cache = { at: Date.now(), body };
    return { statusCode: 200, headers, body };
  } catch (e) {
    console.error('google-reviews:', e.message);
    return { statusCode: 200, headers, body: JSON.stringify({ configured: true, error: 'fetch_failed', reviews: [] }) };
  }
};
