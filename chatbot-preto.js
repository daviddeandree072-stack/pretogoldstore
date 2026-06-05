/* ─────────────────────────────────────────────────────────────
   Preto by Dala&Co — Asistente "Dom Dala" (Offline)
   100% client-side · 0 dependencias · carga diferida
   ───────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  /* ── Carga diferida: el chatbot se inicializa cuando el navegador
     está inactivo, sin bloquear el render ni la interactividad. */
  var idle = window.requestIdleCallback || function (cb) { return setTimeout(cb, 1); };
  function boot() { idle(init, { timeout: 2500 }); }
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    boot();
  } else {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  }

  function init() {

  /* ════════════════════════════════════════════════════════════
     BASE DE CONOCIMIENTO
     Cada entrada tiene: kw (palabras clave), ans (respuesta HTML),
     cta (true = mostrar botón de WhatsApp al final).
  ════════════════════════════════════════════════════════════ */
  var KB = [
    {
      kw: ['hola','buenos dias','buenas tardes','buenas noches','hey','saludos','buenas'],
      ans: '¡Hola! 👋 Soy <strong>Dom Dala</strong>, tu asistente de <strong>Preto by Dala&amp;Co</strong>.\n\nEstoy aquí para ayudarte con cualquier pregunta sobre nuestras joyas, tipos de oro, precios, envíos o cuidado. ¿En qué te puedo ayudar?',
      cta: false
    },
    {
      kw: ['agente','asesor','humano','persona real','hablar con alguien','vendedor','whatsapp','wa','contactar','contacto directo'],
      ans: '¡Claro! Te conecto de inmediato con nuestro concierge por WhatsApp 💬\n\nUn asesor real te atenderá en segundos.',
      cta: true,
      redirect: true
    },
    {
      kw: ['tipo de oro','tipos de oro','clase de oro','que oro','qué oro','oro ofrecen','oro manejan','que oros','italiano','nacional','chocoano','chocó','choco','procedencia','origen del oro'],
      ans: 'En Preto trabajamos <strong>tres tipos de oro de 18k</strong>, todos certificados ✨:\n\n• <strong>Oro Italiano 18k</strong> — acabado pulido a espejo, ideal para piezas clásicas y luminosas.\n\n• <strong>Oro Nacional 18k</strong> — calidad colombiana, versátil y de tono cálido.\n\n• <strong>Oro Chocoano 18k</strong> — exclusivo de la línea <em>Preto</em>, de tono más fuerte y carácter inconfundible. Viene directo del río Atrato.\n\nY para piezas <strong>personalizadas en la línea Dala&amp;Co</strong>, también elaboramos en <strong>oro rosado</strong> 🌹 y <strong>oro blanco</strong> 🤍 18k.\n\n¿Te orientamos sobre cuál se ajusta más a tu estilo?',
      cta: true
    },
    {
      kw: ['oro rosado','oro blanco','rose gold','white gold','rosa','blanco','colores de oro'],
      ans: 'Sí ✨. Además del oro amarillo, en la línea <strong>Dala&amp;Co</strong> podemos elaborar piezas personalizadas en:\n\n• <strong>Oro Rosado 18k</strong> 🌹 — tono cálido y romántico, perfecto para piezas íntimas y femeninas.\n\n• <strong>Oro Blanco 18k</strong> 🤍 — elegancia atemporal y brillo limpio, ideal para piezas clásicas o engaste de piedras.\n\nAmbos solo bajo encargo en nuestro <strong>Atelier Privado</strong>. ¿Quieres que te ayudemos a cotizar tu pieza?',
      cta: true
    },
    {
      kw: ['precio','cuesta','vale','cuanto','cotiz','cuánto','costo'],
      ans: 'El precio de cada pieza se calcula con base en el <strong>peso del oro y el valor del mercado ese día</strong> 📈.\n\nEso garantiza que siempre pagues el precio justo del oro real — sin márgenes ocultos. Cada cotización es única y personalizada.\n\n¿Quieres que preparemos la tuya?',
      cta: true
    },
    {
      kw: ['garantia','garantía','garantiz','respaldo'],
      ans: 'Todas nuestras piezas tienen <strong>garantía de 5 años</strong> ✨.\n\nAl ser oro 100% de 18k, su calidad es permanente. La garantía cubre cualquier defecto de fabricación — la única excepción es el daño por mal uso (golpes fuertes, cloro o químicos).',
      cta: false
    },
    {
      kw: ['cambio','devoluci','cambiar','devolver','regresar','regresa'],
      ans: 'Sí, aceptamos cambios 🤝.\n\nSe realiza <strong>abonando un 30% adicional</strong> sobre el valor de la pieza, ya que cada joya es elaborada especialmente para ti.\n\nEscríbenos al concierge y te orientamos paso a paso.',
      cta: true
    },
    {
      kw: ['pago','pagar','tarjeta','transferencia','bancolombia','nequi','daviplata','cuota','financ','credito','débito','debito'],
      ans: 'Aceptamos <strong>todas las formas de pago</strong> 💳:\n\n• Transferencia bancaria · Bancolombia\n• Tarjetas de crédito y débito\n• Nequi · Daviplata\n• Y más opciones al coordinar con el concierge.\n\nLos detalles se gestionan por WhatsApp — atención 100% personalizada.',
      cta: false
    },
    {
      kw: ['envio','envío','entrega','despacho','llega','demor','ciudad','enviar','shipping','transporte'],
      ans: 'El <strong>envío es gratuito</strong> a las ciudades principales de Colombia 🇨🇴.\n\nTodas las piezas viajan <strong>aseguradas</strong> para llegar en perfectas condiciones — el seguro es gestionado por el cliente al momento del envío, así tu joya queda 100% protegida.',
      cta: false
    },
    {
      kw: ['certificad','autenticidad','documento','comprobante','original','prueba'],
      ans: 'Sí 📜. Cada pieza incluye su <strong>certificado de origen y autenticidad</strong>.\n\nEso significa: oro chocoano de 18k, trazado desde el río Atrato hasta tus manos. Es nuestra promesa de casa.',
      cta: false
    },
    {
      kw: ['personaliz','a medida','unico','única','boceto','diseño propio','crear','diseñar','especial','exclusiv','atelier'],
      ans: '¡Por supuesto! 🎨 Nuestro <strong>Atelier Privado</strong> está hecho exactamente para eso.\n\nDesde una conversación inicial, nuestra directora artística crea un boceto exclusivo para ti. Luego nuestras orfebres del Chocó lo trabajan a mano, pieza por pieza.\n\nEn la línea <strong>Dala&amp;Co</strong> también elaboramos en <strong>oro rosado</strong> 🌹 y <strong>oro blanco</strong> 🤍 18k bajo encargo.\n\nAgenda tu cita privada cuando quieras.',
      cta: true
    },
    {
      kw: ['talla','medida','tamaño','numero de anillo','número de anillo','medir','talla de anillo','que talla'],
      ans: 'Para <strong>cadenas y rosarios</strong>, manejamos medidas de 45 a 65 cm — te ayudamos a elegir la ideal según tu gusto.\n\nPara <strong>anillos</strong>, envíanos tu talla al momento de cotizar. Si no la conoces, en cualquier joyería te la miden gratis en segundos — ¡o nosotros te orientamos!',
      cta: true
    },
    {
      kw: ['cuida','limpiar','limpia','mantener','brillo','conservar','desgast','cuidado'],
      ans: 'El oro de 18k es muy fácil de cuidar ✨:\n\n• Limpia con un paño suave y seco.\n• Evita el cloro, perfumes y cremas sobre la joya.\n• Guárdala en su estuche cuando no la uses.\n• Para limpieza profunda, escríbenos y te orientamos.\n\nCon esos cuidados básicos, tu pieza durará generaciones.',
      cta: false
    },
    {
      kw: ['verde','mancha','piel','alergia','reaccion','reacción','picazon','picazón','irritacion','irritación','alergi'],
      ans: 'El <strong>oro de 18k no mancha la piel ni causa reacciones</strong> 🌿.\n\nEse problema ocurre con metales bañados o de baja calidad — algo que no existe en Preto. Nuestras piezas son 100% oro chocoano de 18k, sin relleno, sin enchapado, sin mezclas.',
      cta: false
    },
    {
      kw: ['de verdad','es de oro','genuino','autentico','auténtico','puro','enchapado','bañado','falso','imitacion','imitación','real'],
      ans: '¡Absolutamente! 💛 Cada pieza de Preto es <strong>100% oro de 18k</strong> de origen chocoano.\n\nNada de chapados, nada de imitaciones, nada de relleno. Eso lo respalda el certificado de autenticidad incluido con cada pieza.',
      cta: false
    },
    {
      kw: ['inversion','inversión','valor','revalua','revalúa','pierde valor','sube de precio','se valoriza'],
      ans: 'El oro es uno de los activos que <strong>mantiene y aumenta su valor</strong> con el tiempo 📊.\n\nAl ser piezas de 18k con certificado de origen, conservan su valor intrínseco como metal precioso — más allá de su belleza. Es lujo que dura y vale.',
      cta: false
    },
    {
      kw: ['tienda','local','fisica','donde','dónde','dirección','direccion','ubicacion','ubicación','bogota','bogotá','presencial'],
      ans: 'Por el momento somos <strong>100% virtuales</strong> 💻.\n\nEso nos permite atenderte desde cualquier ciudad de Colombia con el mismo nivel de servicio personalizado. Nuestro concierge en WhatsApp te acompaña de principio a fin.',
      cta: false
    },
    {
      kw: ['raya','desgast','dura','resistente','fragil','frágil','rompe','oxida','se daña','se daña','se opaca'],
      ans: 'El oro de 18k es <strong>altamente resistente</strong> al desgaste cotidiano ✨.\n\nNo se oxida ni se corroe. Con cuidados básicos — evitar golpes fuertes y químicos — tu joya durará generaciones.\n\nPor eso también ofrecemos garantía de 5 años.',
      cta: false
    },
    {
      kw: ['tiempo','cuanto tarda','dias','cuánto tarda','demora','listo'],
      ans: 'El tiempo de elaboración depende de la pieza:\n\n• <strong>Piezas de catálogo:</strong> coordinamos contigo por WhatsApp.\n• <strong>Piezas del Atelier Privado</strong> (personalizadas): varias semanas de orfebrería artesanal — la espera es parte del lujo.\n\n¿Te ayudamos con una cotización?',
      cta: true
    },
    {
      kw: ['gracias','muchas gracias','thank','perfecto','genial','excelente','listo','entendido','claro'],
      ans: '¡Con mucho gusto! 💛\n\nSi tienes más preguntas o quieres dar el siguiente paso, nuestro concierge está listo para atenderte ahora mismo.',
      cta: true
    }
  ];

  var CHIPS = [
    { label: 'Tipos de oro',        q: '¿Qué tipos de oro ofrecen?' },
    { label: '¿Cuánto cuesta?',     q: '¿Cuánto cuesta?' },
    { label: 'Garantía',            q: '¿Cuál es la garantía?' },
    { label: 'Envíos',              q: '¿Cómo son los envíos?' },
    { label: 'Piezas únicas',       q: '¿Hacen piezas personalizadas?' },
    { label: 'Hablar con agente',   q: 'Necesito un agente' }
  ];

  var WA_LINK  = 'https://wa.me/573226955451';
  var GREETING = '¡Hola! 👋 Soy <strong>Dom Dala</strong>, tu asistente de <strong>Preto by Dala&amp;Co</strong>.\n\nEstoy aquí para ayudarte con cualquier pregunta sobre nuestras joyas, tipos de oro, precios o envíos. ¿En qué te puedo ayudar?';

  /* ── Normalizar (sin tildes, minúsculas) ────────────────── */
  function norm(s) {
    return s.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
  }

  function findAnswer(text) {
    var t = norm(text);
    for (var i = 0; i < KB.length; i++) {
      var item = KB[i];
      for (var j = 0; j < item.kw.length; j++) {
        if (t.indexOf(norm(item.kw[j])) !== -1) return item;
      }
    }
    return null;
  }

  /* ════════════════════════════════════════════════════════════
     CSS DEL WIDGET
  ════════════════════════════════════════════════════════════ */
  var CSS = [
    /* ── Botón flotante ── */
    '#preto-chat-btn{',
      'position:fixed;bottom:28px;left:28px;z-index:60;',
      'display:flex;align-items:center;gap:14px;',
      'background:#111111;color:#f3efe7;',
      'border:1px solid rgba(182,141,64,.35);border-radius:999px;',
      'padding:11px 20px 11px 13px;cursor:pointer;',
      'box-shadow:0 4px 32px rgba(0,0,0,.3);',
      'transition:background .3s,transform .3s,border-color .3s;',
      'font-family:"Inter","Helvetica Neue",sans-serif;',
    '}',
    '#preto-chat-btn:hover{',
      'background:#1a1918;border-color:rgba(182,141,64,.65);transform:translateY(-2px);',
    '}',
    '#preto-chat-btn.pc-active{',
      'background:#B68D40;border-color:#B68D40;color:#111111;',
    '}',
    '.pc-btn-icon{',
      'width:34px;height:34px;border-radius:50%;',
      'background:rgba(182,141,64,.14);',
      'display:flex;align-items:center;justify-content:center;flex-shrink:0;',
      'transition:background .3s;',
    '}',
    '#preto-chat-btn.pc-active .pc-btn-icon{background:rgba(255,255,255,.18);}',
    '.pc-btn-icon svg{width:17px;height:17px;display:block;}',
    '.pc-btn-labels{display:flex;flex-direction:column;}',
    '.pc-btn-lbl1{font-size:9px;letter-spacing:.28em;text-transform:uppercase;color:#B68D40;line-height:1;}',
    '#preto-chat-btn.pc-active .pc-btn-lbl1{color:rgba(17,17,17,.65);}',
    '.pc-btn-lbl2{font-size:11px;letter-spacing:.03em;line-height:1.35;margin-top:3px;font-weight:300;}',

    /* ── Panel ── */
    '#preto-chat-panel{',
      'position:fixed;bottom:96px;left:28px;z-index:59;',
      'width:374px;max-height:570px;',
      'display:flex;flex-direction:column;',
      'background:#0f0f0f;',
      'border:1px solid rgba(182,141,64,.2);border-radius:3px;',
      'box-shadow:0 28px 90px rgba(0,0,0,.55),0 0 0 1px rgba(182,141,64,.06);',
      'opacity:0;pointer-events:none;',
      'transform:translateY(14px) scale(.97);transform-origin:bottom left;',
      'transition:opacity .4s cubic-bezier(.2,.7,.2,1),transform .4s cubic-bezier(.2,.7,.2,1);',
      'overflow:hidden;',
    '}',
    '#preto-chat-panel.pc-open{opacity:1;pointer-events:auto;transform:translateY(0) scale(1);}',

    /* ── Encabezado ── */
    '.pc-head{',
      'display:flex;align-items:center;justify-content:space-between;',
      'padding:16px 18px 14px;',
      'border-bottom:1px solid rgba(182,141,64,.13);',
      'background:#111111;flex-shrink:0;',
    '}',
    '.pc-head-info{display:flex;flex-direction:column;gap:4px;}',
    '.pc-head-name{',
      'font-family:"Cormorant Garamond","Times New Roman",serif;',
      'font-size:19px;font-weight:300;font-style:italic;',
      'color:#f3efe7;letter-spacing:.01em;line-height:1;',
    '}',
    '.pc-head-name span{',
      'font-family:"Pinyon Script",cursive;font-style:normal;',
      'color:#B68D40;font-size:23px;margin-left:4px;',
    '}',
    '.pc-head-sub{',
      'font-family:"Inter",sans-serif;',
      'font-size:9px;letter-spacing:.28em;text-transform:uppercase;',
      'color:rgba(243,239,231,.38);',
    '}',
    '.pc-head-right{display:flex;align-items:center;gap:12px;}',
    '.pc-dot{',
      'width:8px;height:8px;border-radius:50%;',
      'background:#4ade80;box-shadow:0 0 6px rgba(74,222,128,.5);flex-shrink:0;',
    '}',
    '.pc-close-btn{',
      'display:flex;align-items:center;justify-content:center;',
      'width:26px;height:26px;border-radius:50%;',
      'color:rgba(243,239,231,.38);font-size:17px;line-height:1;',
      'transition:color .2s,background .2s;',
      'background:none;border:none;cursor:pointer;',
    '}',
    '.pc-close-btn:hover{color:#f3efe7;background:rgba(255,255,255,.08);}',

    /* ── Mensajes ── */
    '.pc-msgs{',
      'flex:1;overflow-y:auto;',
      'padding:18px 16px;',
      'display:flex;flex-direction:column;gap:10px;',
    '}',
    '.pc-msgs::-webkit-scrollbar{width:3px;}',
    '.pc-msgs::-webkit-scrollbar-track{background:transparent;}',
    '.pc-msgs::-webkit-scrollbar-thumb{background:rgba(182,141,64,.3);border-radius:99px;}',

    /* ── Burbujas ── */
    '.pc-msg{display:flex;flex-direction:column;max-width:90%;animation:pcIn .35s cubic-bezier(.2,.7,.2,1) both;}',
    '@keyframes pcIn{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:none}}',
    '.pc-msg-bot{align-self:flex-start;align-items:flex-start;}',
    '.pc-msg-user{align-self:flex-end;align-items:flex-end;}',
    '.pc-bubble{padding:11px 15px;font-size:14px;line-height:1.65;}',
    '.pc-msg-bot .pc-bubble{',
      'font-family:"Cormorant Garamond",serif;font-size:16px;',
      'background:#1a1918;color:rgba(243,239,231,.9);',
      'border-left:2px solid rgba(182,141,64,.42);',
      'border-radius:0 2px 2px 0;',
    '}',
    '.pc-msg-bot .pc-bubble strong{color:#B68D40;font-weight:500;}',
    '.pc-msg-user .pc-bubble{',
      'font-family:"Inter",sans-serif;font-weight:300;font-size:13px;',
      'background:#B68D40;color:#111111;',
      'border-radius:2px 0 0 2px;',
    '}',

    /* ── Botón WhatsApp inline ── */
    '.pc-wa-cta{',
      'margin-top:8px;',
      'display:inline-flex;align-items:center;gap:9px;',
      'padding:9px 16px;',
      'background:#B68D40;color:#111111;',
      'font-family:"Inter",sans-serif;font-size:10px;',
      'letter-spacing:.24em;text-transform:uppercase;font-weight:400;',
      'text-decoration:none;border-radius:2px;',
      'transition:background .3s,transform .2s;',
      'align-self:flex-start;',
    '}',
    '.pc-wa-cta:hover{background:#d4af37;transform:translateY(-1px);}',
    '.pc-wa-cta svg{width:15px;height:15px;flex-shrink:0;}',

    /* ── Typing ── */
    '.pc-typing-wrap{',
      'display:flex;gap:5px;align-items:center;',
      'padding:11px 15px;',
      'background:#1a1918;border-left:2px solid rgba(182,141,64,.22);',
      'align-self:flex-start;border-radius:0 2px 2px 0;',
    '}',
    '.pc-typing-wrap span{',
      'width:6px;height:6px;border-radius:50%;',
      'background:#B68D40;opacity:.35;',
      'animation:pcDot 1.4s ease-in-out infinite;',
    '}',
    '.pc-typing-wrap span:nth-child(2){animation-delay:.2s;}',
    '.pc-typing-wrap span:nth-child(3){animation-delay:.4s;}',
    '@keyframes pcDot{0%,80%,100%{opacity:.25;transform:scale(.8)}40%{opacity:1;transform:scale(1.1)}}',

    /* ── Chips ── */
    '.pc-chips{',
      'display:flex;gap:6px;padding:8px 16px 4px;',
      'overflow-x:auto;flex-shrink:0;scrollbar-width:none;',
    '}',
    '.pc-chips::-webkit-scrollbar{display:none;}',
    '.pc-chip{',
      'flex-shrink:0;',
      'font-family:"Inter",sans-serif;font-size:9px;letter-spacing:.2em;text-transform:uppercase;',
      'color:rgba(243,239,231,.6);',
      'padding:7px 13px;border:1px solid rgba(182,141,64,.25);',
      'border-radius:999px;background:transparent;cursor:pointer;',
      'transition:all .3s;white-space:nowrap;',
    '}',
    '.pc-chip:hover{color:#f3efe7;border-color:rgba(182,141,64,.65);background:rgba(182,141,64,.08);}',

    /* ── Input ── */
    '.pc-foot{',
      'padding:10px 16px 16px;',
      'border-top:1px solid rgba(182,141,64,.1);',
      'display:flex;align-items:center;gap:10px;flex-shrink:0;',
    '}',
    '.pc-input{',
      'flex:1;background:transparent;border:0;',
      'border-bottom:1px solid rgba(182,141,64,.28);',
      'color:rgba(243,239,231,.9);',
      'font-family:"Cormorant Garamond",serif;font-size:16px;font-style:italic;',
      'padding:5px 0;outline:none;transition:border-color .3s;',
    '}',
    '.pc-input::placeholder{color:rgba(243,239,231,.28);}',
    '.pc-input:focus{border-bottom-color:#B68D40;}',
    '.pc-send-btn{',
      'width:33px;height:33px;background:#B68D40;',
      'border:none;border-radius:50%;',
      'display:flex;align-items:center;justify-content:center;',
      'cursor:pointer;flex-shrink:0;',
      'transition:background .3s,transform .2s;',
    '}',
    '.pc-send-btn:hover{background:#d4af37;transform:scale(1.06);}',
    '.pc-send-btn svg{width:13px;height:13px;fill:none;stroke:#111111;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;display:block;}',

    /* ── Pulso de atención ── */
    '@keyframes pcPulse{',
      '0%,100%{box-shadow:0 4px 32px rgba(0,0,0,.3)}',
      '50%{box-shadow:0 4px 48px rgba(182,141,64,.45),0 0 0 5px rgba(182,141,64,.12)}',
    '}',

    /* ── Responsive móvil ── */
    '@media(max-width:480px){',
      '#preto-chat-panel{left:10px;right:10px;width:auto;bottom:88px;}',
      '#preto-chat-btn{left:10px;bottom:10px;padding:10px 15px 10px 11px;}',
      '#preto-chat-btn .pc-btn-labels{display:none;}',
    '}'
  ].join('');

  var styleEl = document.createElement('style');
  styleEl.id  = 'preto-chat-css';
  styleEl.textContent = CSS;
  document.head.appendChild(styleEl);

  /* ════════════════════════════════════════════════════════════
     HTML DEL WIDGET
  ════════════════════════════════════════════════════════════ */
  var WA_SVG = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm4.52 14.14c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.42-.14 0-.31-.02-.48-.02-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.41 1.01 2.57.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.05-.1-.21-.16-.46-.28z"/></svg>';

  var htmlStr = [
    '<button id="preto-chat-btn" aria-label="Abrir asistente Preto" aria-expanded="false">',
      '<span class="pc-btn-icon">',
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">',
          '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
        '</svg>',
      '</span>',
      '<span class="pc-btn-labels">',
        '<span class="pc-btn-lbl1">Asistente</span>',
        '<span class="pc-btn-lbl2">Dom Dala</span>',
      '</span>',
    '</button>',
    '<div id="preto-chat-panel" role="dialog" aria-modal="true" aria-label="Asistente Preto">',
      '<div class="pc-head">',
        '<div class="pc-head-info">',
          '<span class="pc-head-name">Dom <span>Dala</span></span>',
          '<span class="pc-head-sub">Asistente Preto · Responde al instante</span>',
        '</div>',
        '<div class="pc-head-right">',
          '<div class="pc-dot" title="En línea"></div>',
          '<button class="pc-close-btn" id="preto-chat-close" aria-label="Cerrar asistente">&times;</button>',
        '</div>',
      '</div>',
      '<div class="pc-msgs" id="preto-chat-msgs"></div>',
      '<div class="pc-chips" id="preto-chat-chips"></div>',
      '<div class="pc-foot">',
        '<input class="pc-input" id="preto-chat-input" type="text" placeholder="Escribe tu pregunta…" autocomplete="off" />',
        '<button class="pc-send-btn" id="preto-chat-send" aria-label="Enviar">',
          '<svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>',
        '</button>',
      '</div>',
    '</div>'
  ].join('');

  document.body.insertAdjacentHTML('beforeend', htmlStr);

  /* ════════════════════════════════════════════════════════════
     LÓGICA DEL CHAT
  ════════════════════════════════════════════════════════════ */
  var isOpen   = false;
  var greeted  = false;
  var isBusy   = false;

  var btnEl   = document.getElementById('preto-chat-btn');
  var panelEl = document.getElementById('preto-chat-panel');
  var msgsEl  = document.getElementById('preto-chat-msgs');
  var inputEl = document.getElementById('preto-chat-input');
  var sendEl  = document.getElementById('preto-chat-send');
  var closeEl = document.getElementById('preto-chat-close');
  var chipsEl = document.getElementById('preto-chat-chips');

  /* ── Scroll al fondo ── */
  function scrollBottom() {
    setTimeout(function () { msgsEl.scrollTop = msgsEl.scrollHeight; }, 40);
  }

  /* ── Añadir mensaje del bot ── */
  function addBotMsg(html, showCta) {
    var wrap   = document.createElement('div');
    wrap.className = 'pc-msg pc-msg-bot';

    var bubble = document.createElement('div');
    bubble.className = 'pc-bubble';
    bubble.innerHTML = html.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');
    wrap.appendChild(bubble);

    if (showCta) {
      var a = document.createElement('a');
      a.className  = 'pc-wa-cta';
      a.href       = WA_LINK;
      a.target     = '_blank';
      a.rel        = 'noopener noreferrer';
      a.innerHTML  = WA_SVG + ' Hablar con concierge';
      wrap.appendChild(a);
    }

    msgsEl.appendChild(wrap);
    scrollBottom();
  }

  /* ── Añadir mensaje del usuario ── */
  function addUserMsg(text) {
    var wrap   = document.createElement('div');
    wrap.className = 'pc-msg pc-msg-user';

    var bubble = document.createElement('div');
    bubble.className = 'pc-bubble';
    bubble.textContent = text;
    wrap.appendChild(bubble);

    msgsEl.appendChild(wrap);
    scrollBottom();
  }

  /* ── Indicador de escritura ── */
  function showTyping() {
    var wrap = document.createElement('div');
    wrap.className = 'pc-msg pc-msg-bot';
    wrap.id = 'pc-typing';

    var dots = document.createElement('div');
    dots.className = 'pc-typing-wrap';
    dots.innerHTML = '<span></span><span></span><span></span>';
    wrap.appendChild(dots);

    msgsEl.appendChild(wrap);
    scrollBottom();
    return wrap;
  }

  /* ── Chips de sugerencias ── */
  function renderChips() {
    chipsEl.innerHTML = '';
    CHIPS.forEach(function (c) {
      var btn = document.createElement('button');
      btn.className   = 'pc-chip';
      btn.textContent = c.label;
      btn.addEventListener('click', function () { handleSend(c.q); });
      chipsEl.appendChild(btn);
    });
  }

  /* ── Enviar mensaje ── */
  function handleSend(text) {
    text = text.trim();
    if (!text || isBusy) return;
    isBusy = true;
    chipsEl.innerHTML = '';
    addUserMsg(text);
    inputEl.value = '';

    var typEl = showTyping();
    var delay = Math.min(800 + text.length * 10, 1600);

    setTimeout(function () {
      typEl.parentNode && typEl.parentNode.removeChild(typEl);
      isBusy = false;

      var result = findAnswer(text);
      if (result) {
        addBotMsg(result.ans, result.cta);
        /* Si la respuesta marca redirect, abre WhatsApp automáticamente */
        if (result.redirect) {
          setTimeout(function () { window.open(WA_LINK, '_blank', 'noopener'); }, 900);
        }
      } else {
        addBotMsg(
          'Para esa consulta, lo mejor es hablar directamente con nuestro concierge — te responden al instante y con toda la atención que mereces. 💬',
          true
        );
      }
      renderChips();
    }, delay);
  }

  /* ── Abrir / cerrar ── */
  function openChat() {
    isOpen = true;
    panelEl.classList.add('pc-open');
    btnEl.classList.add('pc-active');
    btnEl.setAttribute('aria-expanded', 'true');

    if (!greeted) {
      greeted = true;
      setTimeout(function () {
        addBotMsg(GREETING, false);
        renderChips();
      }, 350);
    }
    setTimeout(function () { inputEl.focus(); }, 420);
  }

  function closeChat() {
    isOpen = false;
    panelEl.classList.remove('pc-open');
    btnEl.classList.remove('pc-active');
    btnEl.setAttribute('aria-expanded', 'false');
  }

  function toggleChat() {
    isOpen ? closeChat() : openChat();
  }

  /* ── Eventos ── */
  btnEl.addEventListener('click', toggleChat);
  closeEl.addEventListener('click', closeChat);

  sendEl.addEventListener('click', function () {
    handleSend(inputEl.value);
  });

  inputEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') handleSend(inputEl.value);
  });

  /* Cerrar al pulsar Escape */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen) closeChat();
  });

  /* ── Pulso de atención (primera visita, después de 14 s) ── */
  if (!sessionStorage.getItem('preto-chat-seen')) {
    sessionStorage.setItem('preto-chat-seen', '1');
    setTimeout(function () {
      if (!isOpen) {
        btnEl.style.animation = 'pcPulse 1.6s ease 3';
        btnEl.addEventListener('animationend', function () {
          btnEl.style.animation = '';
        }, { once: true });
      }
    }, 14000);
  }

  } /* end init() */
})();
