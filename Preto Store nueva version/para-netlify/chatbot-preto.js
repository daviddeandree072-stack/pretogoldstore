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
  var MARK_URI = "data:image/png;base64,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";
  var CSS = [
    /* ── Botón flotante (esquina inferior derecha, sobre el botón WhatsApp) ── */
    '#preto-chat-btn{',
      'position:fixed;bottom:104px;right:28px;z-index:60;',
      'width:58px;height:58px;border-radius:50%;',
      'display:flex;align-items:center;justify-content:center;',
      'background:#111111;color:#f3efe7;',
      'border:1px solid rgba(182,141,64,.4);',
      'cursor:pointer;overflow:hidden;',
      'box-shadow:0 4px 28px rgba(0,0,0,.32);',
      'transition:background .3s,transform .3s,border-color .3s,box-shadow .3s;',
      'font-family:"Inter",sans-serif;padding:0;',
    '}',
    '#preto-chat-btn:hover{',
      'background:#1a1918;border-color:#B68D40;transform:translateY(-2px);',
      'box-shadow:0 6px 36px rgba(182,141,64,.3);',
    '}',
    '#preto-chat-btn.pc-active{',
      'background:#B68D40;border-color:#B68D40;color:#111111;',
    '}',
    '#preto-chat-btn svg{width:24px;height:24px;display:block;}',
    '#preto-chat-btn img{width:100%;height:100%;object-fit:cover;display:block;}',

    /* ── Monógrama P (mask para que cambie de color según el estado) ── */
    '.preto-mark{',
      'display:block;width:30px;height:30px;',
      'background:#B68D40;',
      '-webkit-mask:url("'+MARK_URI+'") center/contain no-repeat;',
      'mask:url("'+MARK_URI+'") center/contain no-repeat;',
      'transition:background .3s ease,transform .35s cubic-bezier(.4,1.4,.5,1);',
    '}',
    '#preto-chat-btn:hover .preto-mark{transform:rotate(-8deg) scale(1.08);}',
    '#preto-chat-btn.pc-active .preto-mark{background:#111111;transform:rotate(0deg) scale(0.92);}',

    /* Anillo dorado que pulsa alrededor del botón cuando se hover/abre */
    '#preto-chat-btn::after{',
      'content:"";position:absolute;inset:-2px;border-radius:50%;',
      'border:1px solid rgba(212,170,108,.5);',
      'opacity:0;transform:scale(0.85);pointer-events:none;',
    '}',
    '#preto-chat-btn:hover::after{animation:pcMarkRing 1.4s ease-out infinite;}',
    '@keyframes pcMarkRing{',
      '0%{opacity:.7;transform:scale(0.9);}',
      '100%{opacity:0;transform:scale(1.55);}',
    '}',

    /* Monógrama dentro del header del panel + animación de entrada */
    '.pc-head-mark{',
      'width:36px;height:36px;flex-shrink:0;',
      'background:#B68D40;position:relative;',
      'border-radius:50%;',
      'padding:7px;box-sizing:border-box;',
    '}',
    '.pc-head-mark .preto-mark{',
      'width:100%;height:100%;background:#111111;',
    '}',
    /* Anillo dorado animado alrededor */
    '.pc-head-mark::before{',
      'content:"";position:absolute;inset:-4px;border-radius:50%;',
      'border:1px solid rgba(212,170,108,.55);',
      'opacity:0;transform:scale(0.85);pointer-events:none;',
    '}',
    /* Reflejo dorado que cruza la P al abrir */
    '.pc-head-mark::after{',
      'content:"";position:absolute;inset:0;border-radius:50%;',
      'background:linear-gradient(115deg,transparent 35%,rgba(255,245,225,.65) 50%,transparent 65%);',
      'opacity:0;mix-blend-mode:screen;pointer-events:none;',
    '}',
    /* Animaciones que disparan SOLO cuando el panel acaba de abrirse */
    '#preto-chat-panel.pc-open .pc-head-mark{animation:pcMarkIn 1.05s cubic-bezier(.2,.8,.25,1) both;}',
    '#preto-chat-panel.pc-open .pc-head-mark::before{animation:pcMarkRingHead 1.1s ease-out .15s 1 both;}',
    '#preto-chat-panel.pc-open .pc-head-mark::after{animation:pcMarkShine 1.4s ease-out .35s 1 both;}',
    '@keyframes pcMarkIn{',
      '0%{transform:scale(0.25) rotate(-32deg);opacity:0;}',
      '55%{transform:scale(1.12) rotate(6deg);opacity:1;}',
      '78%{transform:scale(0.96) rotate(-2deg);}',
      '100%{transform:scale(1) rotate(0);opacity:1;}',
    '}',
    '@keyframes pcMarkRingHead{',
      '0%{opacity:.85;transform:scale(0.6);}',
      '100%{opacity:0;transform:scale(2.1);}',
    '}',
    '@keyframes pcMarkShine{',
      '0%{opacity:0;transform:translateX(-60%);}',
      '40%{opacity:1;}',
      '100%{opacity:0;transform:translateX(60%);}',
    '}',
    '@media(prefers-reduced-motion:reduce){',
      '#preto-chat-panel.pc-open .pc-head-mark,',
      '#preto-chat-panel.pc-open .pc-head-mark::before,',
      '#preto-chat-panel.pc-open .pc-head-mark::after{animation:none;}',
      '#preto-chat-btn:hover::after{animation:none;}',
    '}',

    /* ── Panel (se abre desde el botón, lado derecho) ── */
    '#preto-chat-panel{',
      'position:fixed;bottom:172px;right:28px;z-index:59;',
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
      'display:flex;align-items:center;gap:14px;',
      'padding:16px 18px 14px;',
      'border-bottom:1px solid rgba(182,141,64,.13);',
      'background:#111111;flex-shrink:0;',
    '}',
    '.pc-head-info{display:flex;flex-direction:column;gap:4px;flex:1;min-width:0;}',
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
      '#preto-chat-panel{left:10px;right:10px;width:auto;bottom:140px;}',
      '#preto-chat-btn{right:14px;bottom:74px;width:50px;height:50px;}',
      '#preto-chat-btn svg{width:22px;height:22px;}',
      '.preto-mark{width:26px;height:26px;}',
      '.pc-head-mark{width:32px;height:32px;padding:6px;}',
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
    '<button id="preto-chat-btn" aria-label="Abrir asistente Dom Dala" aria-expanded="false" title="Dom Dala">',
      '<span class="preto-mark" aria-hidden="true"></span>',
    '</button>',
    '<div id="preto-chat-panel" role="dialog" aria-modal="true" aria-label="Asistente Preto">',
      '<div class="pc-head">',
        '<div class="pc-head-mark" aria-hidden="true"><span class="preto-mark"></span></div>',
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
