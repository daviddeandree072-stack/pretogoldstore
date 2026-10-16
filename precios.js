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

/* En Node (las funciones de Netlify) no existe 'window': le damos uno de
   mentira para poder leer esta misma lista desde el servidor y cobrar
   siempre estos precios, no los que diga el navegador. */
if (typeof window === 'undefined') { global.window = {}; }

window.PRETO_PRICES = {

  /* ── Cadenas Preto · ónix y oro de Chocó ──────────────────── */
  'PRT-CH-COR': 3858000,   // Cadena Corno D'Oro Preto · oro · colgante coral rojo · 45 cm · 3 mm (precio fijo)
  'PRT-CH-LEG': 8878000,   // Preto Legado · oro chocoano · dije Estrella de David · 60 cm (precio fijo)
  'PRT-CH-SMG': 28878000,  // Cadena San Miguel Arcángel Preto · oro rosa/blanco · circones negros · 55 cm
  'PRT-CH-HOJ': 16858000,  // Cadena Hojuelas 2 Oros Preto · oro amarillo + blanco · 60 cm
  'PRT-CH-MIL': 11858000,  // Cadena Militar Preto · dije Virgen de Guadalupe · circones negros · 60 cm · 4 mm
  'PRT-CH-LAZ': 2450000,   // Cadena Lazo Preto
  'PRT-CH-RUS': 2650000,   // Cadena Rústica Preto
  'PRT-CH-FRA': 2850000,   // Cadena Franco Preto
  'PRT-CH-SIN': 2550000,   // Cadena Singapur Preto

  /* ── Cadenas Dala&Co · oro 18k ────────────────────────────── */
  'DAL-CH-BIC': 23788000,  // Cadena Bicolor Dala&Co · oro rosa + blanco 18k · 55 cm
  'DAL-CH-CUI': 13788000,  // Cadena Cubana Italiana Dala&Co · oro ley 750 · 60 cm
  'DAL-CH-4CA': 13898000,  // Cadena 4 Carriles Dala&Co · oro 18k · 60 cm · 6.4 mm
  'DAL-CH-GLU': 7897000,   // Cadena Guadalupe Lumière Dala&Co · balines 3 oros · dije Virgen de Guadalupe
  'DAL-CH-LAZ': 2950000,   // Cadena Lazo Dala&Co
  'DAL-CH-RUS': 3150000,   // Cadena Rústica Dala&Co
  'DAL-CH-FRA': 3350000,   // Cadena Franco Dala&Co
  'DAL-CH-SIN': 3050000,   // Cadena Singapur Dala&Co
  'DAL-CH-CUB': 2788000,   // Cadena Cubana Dala&Co · 3,7 mm · 60 cm

  /* ── Anillos Preto ────────────────────────────────────────── */
  'PRT-RG-LIS': 980000,    // Anillo Liso Preto
  'PRT-RG-VOY': 895000,    // Anillo Voyage Preto · oro amarillo · talla 6 (precio fijo)
  'PRT-RG-CUB': 1250000,   // Anillo Cubano Preto
  'PRT-RG-RUS': 1150000,   // Anillo Rústico Preto
  'PRT-RG-REL': 1190000,   // Anillo Religioso Preto

  /* ── Anillos Dala&Co ──────────────────────────────────────── */
  'DAL-RG-LIS': 895000,    // Anillo Voyage Dala&Co · oro amarillo · talla 6 (precio fijo)
  'DAL-RG-CUB': 1450000,   // Anillo Cubano Dala&Co
  'DAL-RG-RUS': 1350000,   // Anillo Rústico Dala&Co
  'DAL-RG-REL': 1390000,   // Anillo Religioso Dala&Co
  'DAL-RG-CIR': 4788000,   // Anillo Circones Dala&Co · oro 18k · circones blancos · talla 10 (precio fijo)
  'DAL-RG-ESL': 470000,    // Anillo Eslabones 3 Oros Dala&Co · oro 18k · eslabones 4mm · talla 4 (precio fijo)
  'DAL-RG-SOL': 580000,    // Anillo Circón Blanco Dala&Co · oro 18k · solitario circón · talla 6 (precio fijo)
  'DAL-RG-COE': 580000,    // Anillo Cœur Dala&Co · oro amarillo · talla 7 (precio fijo)
  'DAL-RG-TOR': 680000,    // Anillo Tortué Dala&Co · oro amarillo · talla 7 (precio fijo)

  /* ── Pendientes Preto ─────────────────────────────────────── */
  'PRT-EA-TOP': 340000,    // Topo Preto (medida única 4 mm)
  'PRT-EA-ARG': 780000,    // Argolla Preto
  'PRT-EA-CAN': 950000,    // Candonga Preto
  'PRT-EA-COL': 890000,    // Colgante Preto

  /* ── Pendientes Dala&Co ───────────────────────────────────── */
  'DAL-EA-TOP': 720000,    // Topo Dala&Co
  'DAL-EA-ARG': 880000,    // Argolla Dala&Co
  'DAL-EA-CAN': 360000,    // Candonga Dala&Co
  'DAL-EA-TRE': 489000,    // Trébol Dala&Co

  /* ── Pulseras de hilo ─────────────────────────────────────── */
  'PRT-BR-007': 380000,    // Pulseras Hilo Preto
  'DAL-BR-018': 450000,    // Pulseras Hilo Dala&Co
  'DAL-BR-BAL': 2858000,   // Pulsera Esferas Diamantadas Dala&Co (precio fijo)
  'DAL-BR-EPU': 4288000,   // Pulso Epure Dala&Co · oro rosa 18k · 19 cm · 4 mm (precio fijo)

  /* ── Rosarios · solo el decenario lleva precio de línea.
        Clásico, Cuello y Cruz Mayor son piezas de atelier:
        quedan "Bajo cotización" (líneas comentadas).  ─────────── */
  'PRT-RO-DEC': 16688000,  // Rosario Decenario Preto · desde 25 g de oro 18k
  'DAL-RO-DEC': 16688000,  // Rosario Decenario Dala&Co · desde 25 g de oro 18k
  'PRT-RO-CLA': 16688000,  // Rosario Clásico Preto · desde 25 g de oro 18k
  // 'PRT-RO-CUE': 0,      // Rosario Cuello Preto — bajo cotización
  // 'PRT-RO-CRU': 0,      // Rosario Cruz Mayor Preto — pieza insignia
  // 'DAL-RO-CLA': 0,      // Rosario Clásico Dala&Co — bajo cotización
  'DAL-RO-CUE': 16688000,  // Rosario Cuello Dala&Co · 3 oros · balín 3 mm · 50 cm · desde 25 g de oro 18k
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

/* ═══════════════════════════════════════════════════════════════
   PRECIOS POR MEDIDA (mm) — Pendientes Topo / balines
   ═══════════════════════════════════════════════════════════════
   Cada Topo cambia de precio (y de imagen) según el diámetro del
   balín. Si una medida queda sin precio aquí, sale "Bajo cotización".
   Solo números, sin puntos ni $. Las claves de medida deben ser
   EXACTAS: '3 mm', '4 mm', '5 mm', '6 mm', '7 mm'.                  */
window.PRETO_SIZE_PRICES = {
  'PRT-EA-TOP': {            // Topo Preto (ónix y oro de Chocó) · medida única 4 mm
    '4 mm': 340000,
  },
  'DAL-EA-TOP': {            // Topo Dala&Co (oro 18k)
    '3 mm': 280800,
    '4 mm': 325850,
    '5 mm': 380850,
    '6 mm': 480850,
    '7 mm': 585800,
  },
};

/* Nota que acompaña al precio en las fichas de producto.
   El oro fluctúa: esta línea protege el precio publicado. */
window.PRETO_PRICE_NOTE = 'Precio de referencia según peso estándar. El concierge confirma el valor final con la cotización del oro del día, junto con fotografías reales de la pieza.';

/* Un solo origen de precios en toda la tienda: netlify/functions/bold-hash.js
   importa este archivo para calcular el total que se cobra en Bold. */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PRICES:      window.PRETO_PRICES,
    SIZE_PRICES: window.PRETO_SIZE_PRICES,
    NOTE:        window.PRETO_PRICE_NOTE
  };
}
