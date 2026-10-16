/* ═══════════════════════════════════════════════════════════════
   PRETO BY DALA&CO — RESEÑAS DE CLIENTES   (punto 07 del informe CRO)
   ═══════════════════════════════════════════════════════════════

   ┌────────────────────────────────────────────────────────────┐
   │  Las reseñas de GOOGLE ya aparecen SOLAS (automático, ver    │
   │  ACTIVAR-RESEÑAS-GOOGLE.md). Este archivo es solo para       │
   │  testimonios reales de OTROS canales (ej. WhatsApp, con      │
   │  permiso del cliente) que quieras sumar a los de Google.     │
   └────────────────────────────────────────────────────────────┘

   ► Cómo funciona
     · La sección "La voz de quienes ya la llevan" aparece SOLA cuando
       hay al menos 1 reseña real — de Google o de esta lista.
     · Mientras Google no esté conectado y esta lista esté vacía, la
       sección queda OCULTA — el sitio NUNCA muestra reseñas inventadas.
     · La calificación promedio y el número de clientes se recalculan
       solos combinando Google + esta lista (sin duplicar si copiaste
       la misma reseña en ambos lados).
     · Se genera el dato estructurado (Review + AggregateRating) para
       Google automáticamente, con reseñas reales únicamente.

   ► Cómo AÑADIR una reseña de otro canal (no Google)
     1. Copia el bloque de PLANTILLA de abajo.
     2. Quita las // del inicio de cada línea.
     3. Reemplaza el texto con la reseña real (pídele permiso al cliente).
     4. Guarda y sube este archivo a GitHub. Listo.
*/

window.PRETO_REVIEWS = [

  /* ── PLANTILLA · copia este bloque por cada reseña nueva ──────────
  {
    name:   'María Fernanda R.',          // nombre del cliente (o nombre + inicial)
    piece:  'Cadena Franco Preto',        // pieza que compró
    city:   'Bogotá',                     // ciudad
    rating: 5,                            // estrellas, de 1 a 5
    date:   '2026-06',                    // año-mes (opcional)
    text:   'Aquí va lo que escribió el cliente, con su permiso.',
  },
  ──────────────────────────────────────────────────────────────── */

];


/* ───────────────────────────────────────────────────────────────
   FOTOS DE CLIENTES (franja de Instagram, opcional)
   ───────────────────────────────────────────────────────────────
   Sube las fotos a la carpeta  assets/  y pon aquí sus rutas.
   Si lo dejas vacío, la franja de Instagram simplemente no aparece.   */

/* Fotos reales de clientas. Vacío = la sección no se dibuja.
   Para activarla: añade rutas de assets/ que existan de verdad. */
window.PRETO_UGC = [];
