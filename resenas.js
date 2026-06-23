/* ═══════════════════════════════════════════════════════════════
   PRETO BY DALA&CO — RESEÑAS DE CLIENTES   (punto 07 del informe CRO)
   ═══════════════════════════════════════════════════════════════

   ┌────────────────────────────────────────────────────────────┐
   │  ✏️  ESTE ES EL ÚNICO ARCHIVO QUE EDITAS PARA LAS RESEÑAS.   │
   └────────────────────────────────────────────────────────────┘

   ► Cómo funciona
     · La sección "La voz de quienes ya la llevan" en la portada
       aparece SOLA cuando hay al menos 1 reseña en la lista de abajo.
     · Mientras la lista esté vacía, la sección queda OCULTA — el sitio
       NUNCA muestra reseñas inventadas (es lo correcto y lo legal).
     · La calificación promedio (las estrellas) y el número de clientes
       se calculan solos a partir de las reseñas que pongas.
     · Las estrellas también pueden aparecer en Google: se genera el
       dato estructurado (Review + AggregateRating) automáticamente,
       pero SOLO con reseñas reales.

   ► Cómo AÑADIR una reseña (a medida que vendas)
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

window.PRETO_UGC = [
  // 'assets/ugc-cliente-1.jpg',
  // 'assets/ugc-cliente-2.jpg',
  // 'assets/ugc-cliente-3.jpg',
];
