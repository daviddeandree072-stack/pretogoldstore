/* ═══════════════════════════════════════════════════════════════
   PRETO BY DALA&CO — LISTA DE PRECIOS
   Punto 03 del informe CRO · "Desde $X" + cotización
   ═══════════════════════════════════════════════════════════════

   ⚠️  ATENCIÓN: TODOS LOS PRECIOS DE ABAJO SON DE EJEMPLO.
       Reemplázalos por tus precios reales ANTES de subir a GitHub.

   ► Cómo funciona
     · Este es el ÚNICO archivo de precios de toda la tienda:
       lo leen la portada (index.html) y las 47 fichas de /joyeria/.
     · El precio se muestra siempre como "Desde $X" — cubre las
       variaciones de peso, talla y medida sin comprometerte a un
       valor exacto. El concierge confirma el valor final.
     · Solo números, sin puntos ni signo $.  Ej:  2450000
     · Para dejar una pieza "Bajo cotización", pon // al inicio de
       su línea (así están los rosarios mayores ahora mismo).
     · La cotización por WhatsApp suma estos precios y aplica el
       seguro automáticamente.
*/

window.PRETO_PRICES = {

  /* ── Cadenas Preto · ónix y oro de Chocó ──────────────────── */
  'PRT-CH-LAZ': 2450000,   // Cadena Lazo Preto
  'PRT-CH-RUS': 2650000,   // Cadena Rústica Preto
  'PRT-CH-FRA': 2850000,   // Cadena Franco Preto
  'PRT-CH-SIN': 2550000,   // Cadena Singapur Preto

  /* ── Cadenas Dala&Co · oro 18k ────────────────────────────── */
  'DAL-CH-LAZ': 2950000,   // Cadena Lazo Dala&Co
  'DAL-CH-RUS': 3150000,   // Cadena Rústica Dala&Co
  'DAL-CH-FRA': 3350000,   // Cadena Franco Dala&Co
  'DAL-CH-SIN': 3050000,   // Cadena Singapur Dala&Co

  /* ── Anillos Preto ────────────────────────────────────────── */
  'PRT-RG-LIS': 980000,    // Anillo Liso Preto
  'PRT-RG-CUB': 1250000,   // Anillo Cubano Preto
  'PRT-RG-RUS': 1150000,   // Anillo Rústico Preto
  'PRT-RG-REL': 1190000,   // Anillo Religioso Preto

  /* ── Anillos Dala&Co ──────────────────────────────────────── */
  'DAL-RG-LIS': 1150000,   // Anillo Liso Dala&Co
  'DAL-RG-CUB': 1450000,   // Anillo Cubano Dala&Co
  'DAL-RG-RUS': 1350000,   // Anillo Rústico Dala&Co
  'DAL-RG-REL': 1390000,   // Anillo Religioso Dala&Co

  /* ── Pendientes Preto ─────────────────────────────────────── */
  'PRT-EA-TOP': 620000,    // Topo Preto
  'PRT-EA-ARG': 780000,    // Argolla Preto
  'PRT-EA-CAN': 950000,    // Candonga Preto
  'PRT-EA-COL': 890000,    // Colgante Preto

  /* ── Pendientes Dala&Co ───────────────────────────────────── */
  'DAL-EA-TOP': 720000,    // Topo Dala&Co
  'DAL-EA-ARG': 880000,    // Argolla Dala&Co
  'DAL-EA-CAN': 1050000,   // Candonga Dala&Co
  'DAL-EA-COL': 990000,    // Colgante Dala&Co

  /* ── Pulseras de hilo ─────────────────────────────────────── */
  'PRT-BR-007': 380000,    // Pulseras Hilo Preto
  'DAL-BR-018': 450000,    // Pulseras Hilo Dala&Co

  /* ── Rosarios · solo el decenario lleva precio de línea.
        Clásico, Cuello y Cruz Mayor son piezas de atelier:
        quedan "Bajo cotización" (líneas comentadas).  ─────────── */
  'PRT-RO-DEC': 1350000,   // Rosario Decenario Preto
  'DAL-RO-DEC': 1550000,   // Rosario Decenario Dala&Co
  // 'PRT-RO-CLA': 0,      // Rosario Clásico Preto — bajo cotización
  // 'PRT-RO-CUE': 0,      // Rosario Cuello Preto — bajo cotización
  // 'PRT-RO-CRU': 0,      // Rosario Cruz Mayor Preto — pieza insignia
  // 'DAL-RO-CLA': 0,      // Rosario Clásico Dala&Co — bajo cotización
  // 'DAL-RO-CUE': 0,      // Rosario Cuello Dala&Co — bajo cotización
  // 'DAL-RO-CRU': 0,      // Rosario Cruz Mayor Dala&Co — bajo cotización

  /* ── Bolígrafos Dala&Co ───────────────────────────────────── */
  'DAL-PN-CLA': 1850000,   // Bolígrafo Clásico
  'DAL-PN-LAC': 1650000,   // Bolígrafo Lacado
  'DAL-PN-GRA': 1950000,   // Bolígrafo Grabado
  'DAL-PN-MAD': 1750000,   // Bolígrafo Madera

  /* ── Colección Noir ───────────────────────────────────────── */
  'ACC-BA-LIS': 420000,    // Barra Lisa Noir
  'ACC-BA-ONX': 520000,    // Barra Ónix Noir
  'ACC-BA-GRA': 560000,    // Barra Grabada Noir
  'ACC-GE-CLA': 580000,    // Gemelos Clásicos Noir
  'ACC-GE-ONX': 690000,    // Gemelos Ónix Noir
  'ACC-GE-GRA': 740000,    // Gemelos Grabados Noir
  'ACC-IN-CLA': 390000,    // Insignia Clásica Noir
  'ACC-IN-SEL': 450000,    // Insignia Sello Noir
  'ACC-IN-CRU': 470000,    // Insignia Cruz Noir

  /* ── Regalos para bebé ────────────────────────────────────── */
  'PRT-BB-AMU': 480000,    // Amuleto de Protección Preto
  'PRT-BB-RUS': 560000,    // Pulsera Rústica Preto (bebé)
  'PRT-BB-CUB': 620000,    // Cubana Preto (bebé)
  'DAL-BB-AMU': 520000,    // Amuleto de Protección Dala&Co
  'DAL-BB-RUS': 620000,    // Pulsera Rústica Dala&Co (bebé)
  'DAL-BB-CUB': 680000,    // Cubana Dala&Co (bebé)
};

/* Nota que acompaña al precio en las fichas de producto.
   El oro fluctúa: esta línea protege el precio publicado. */
window.PRETO_PRICE_NOTE = 'Precio de referencia según peso estándar. El concierge confirma el valor final con la cotización del oro del día, junto con fotografías reales de la pieza.';
