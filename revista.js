/* ════════════════════════════════════════════════════════════════
   REVISTA · "El arte de regalar" — page-flip 3D (maison)
   ────────────────────────────────────────────────────────────────
   ► EDITA EL CONTENIDO AQUÍ ABAJO en el arreglo PAGES.
     Cada objeto = UNA cara de la revista, en orden de lectura.
     Se emparejan solas en hojas (1ª = portada; luego van de a dos
     formando cada doble página). Para cambiar textos o imágenes,
     edita los campos. Para imágenes usa rutas de la carpeta assets/.
   ════════════════════════════════════════════════════════════════ */

const PAGES = [
  /* 0 · PORTADA ------------------------------------------------- */
  {
    kind: 'cover',
    image: 'assets/regalo-bag.webp',
    eyebrow: 'Edición de regalos · N°01',
    title: 'El arte de',
    script: 'regalar',
    sub: 'Hay regalos que se olvidan. Otros se convierten en parte de una historia.',
  },

  /* ══════ EL ARTE DE REGALAR · apertura (spread 1) ══════ */
  /* 1 · izquierda */
  {
    kind: 'standard',
    eyebrow: 'El arte de regalar',
    lead: 'Hay regalos que se olvidan. Otros se convierten en parte de una historia.',
    body: [
      'Vivimos en un mundo donde todo parece avanzar con rapidez. Los días cambian, las estaciones pasan y los años se transforman en recuerdos. Sin embargo, existen momentos que merecen permanecer intactos.',
      'Un nacimiento. Una promesa. Un aniversario. El abrazo después de una larga ausencia. Una conversación en familia. El orgullo de ver a alguien alcanzar aquello por lo que tanto trabajó.',
    ],
    folio: 'Editorial',
  },
  /* 2 · derecha */
  {
    kind: 'standard',
    eyebrow: 'El arte de regalar',
    body: [
      'Regalar no consiste en entregar un objeto. Regalar es reconocer el valor de una persona, agradecer su presencia y decir, sin palabras, «este momento merece ser recordado».',
      'Cada historia es diferente. Cada persona también.',
      'Por eso, creemos que el verdadero lujo comienza cuando un regalo encuentra el corazón correcto.',
    ],
    sign: 'La Maison',
    folio: 'Editorial',
  },

  /* ══════ PARA ÉL (spread 2) ══════ */
  /* 3 · izquierda */
  {
    kind: 'standard',
    eyebrow: 'Capítulo I',
    title: 'Para',
    script: 'él',
    lead: 'El hombre que inspira sin buscar reconocimiento.',
    body: [
      'Existen hombres cuya mayor virtud no es la fuerza con la que enfrentan la vida, sino la serenidad con la que la construyen.',
      'Son quienes cumplen su palabra incluso cuando nadie los observa. Quienes prefieren el esfuerzo al reconocimiento y entienden que el respeto nunca se exige; se gana.',
    ],
    folio: 'Para él',
  },
  /* 4 · derecha */
  {
    kind: 'standard',
    eyebrow: 'Para él',
    body: [
      'Trabajan con disciplina, enfrentan los desafíos con determinación y avanzan con la tranquilidad de saber que cada paso tiene un propósito. Pero detrás de esa firmeza existe un lugar donde toda armadura desaparece: su hogar.',
      'Porque el hombre que parece inquebrantable encuentra su verdadera fortaleza en una sonrisa de sus hijos, en la tranquilidad de su familia y en quienes le recuerdan la razón por la que vale la pena seguir adelante.',
      'La grandeza de un hombre nunca se mide por aquello que posee, sino por la paz que es capaz de brindar a quienes ama.',
    ],
    folio: 'Para él',
  },

  /* ══════ PARA ELLA (spread 3) ══════ */
  /* 5 · izquierda */
  {
    kind: 'standard',
    eyebrow: 'Capítulo II',
    title: 'Para',
    script: 'ella',
    lead: 'La elegancia nace de la esencia.',
    body: [
      'Hay mujeres cuya presencia transforma cualquier lugar sin necesidad de llamar la atención.',
      'Son aquellas que encuentran belleza en los pequeños detalles, que inspiran con su forma de mirar el mundo y que entienden que la verdadera elegancia jamás necesita demostrarse.',
    ],
    folio: 'Para ella',
  },
  /* 6 · derecha */
  {
    kind: 'standard',
    eyebrow: 'Para ella',
    body: [
      'Su fortaleza convive con su sensibilidad. Es quien celebra los logros de quienes ama como si fueran propios, sostiene a su familia en los momentos difíciles y convierte cada instante cotidiano en un recuerdo lleno de significado.',
      'No busca ser admirada. Busca dejar huellas.',
      'Porque la mujer más extraordinaria no siempre es la que más brilla, sino aquella cuya luz permanece incluso cuando todos los demás se han ido.',
    ],
    folio: 'Para ella',
  },

  /* ══════ PARA EL BEBÉ (spread 4) ══════ */
  /* 7 · izquierda */
  {
    kind: 'standard',
    eyebrow: 'Capítulo III',
    title: 'Para el',
    script: 'bebé',
    lead: 'Donde comienza el futuro.',
    body: [
      'Toda historia extraordinaria tuvo un comienzo.',
      'Un primer abrazo. Una primera sonrisa. Unas manos tan pequeñas que caben entre las de quienes prometieron cuidarlas para siempre.',
      'La llegada de un bebé transforma una familia para toda la vida.',
    ],
    folio: 'Para el bebé',
  },
  /* 8 · derecha */
  {
    kind: 'standard',
    eyebrow: 'Para el bebé',
    body: [
      'Cada recuerdo vivido durante esos primeros años se convierte, con el paso del tiempo, en un tesoro imposible de reemplazar.',
      'Quizá algún día no recuerde este momento. Pero siempre existirá alguien dispuesto a contarle cuánto amor lo esperaba incluso antes de llegar.',
      'Porque los recuerdos más valiosos son aquellos que una familia decide conservar para las generaciones que vienen.',
    ],
    folio: 'Para el bebé',
  },

  /* ══════ EL HOGAR (spread 5) ══════ */
  /* 9 · izquierda */
  {
    kind: 'standard',
    eyebrow: 'Capítulo IV',
    title: 'El',
    script: 'hogar',
    lead: 'El lugar donde todo cobra sentido.',
    body: [
      'El éxito tiene muchas formas. Puede encontrarse en una meta alcanzada, en un sueño cumplido o en el reconocimiento por años de esfuerzo.',
      'Pero existe un lugar donde todos los logros dejan de tener importancia: el hogar.',
    ],
    folio: 'El hogar',
  },
  /* 10 · derecha */
  {
    kind: 'standard',
    eyebrow: 'El hogar',
    body: [
      'Es allí donde las conversaciones se vuelven eternas, donde las celebraciones más sencillas terminan siendo las más memorables y donde una mesa compartida vale más que cualquier riqueza.',
      'Un hogar no se construye únicamente con paredes. Se construye con respeto. Con tiempo. Con abrazos. Con historias que algún día serán contadas a hijos y nietos.',
      'Porque el verdadero lujo no consiste en vivir rodeado de cosas extraordinarias, sino en compartir la vida con personas extraordinarias.',
    ],
    folio: 'El hogar',
  },

  /* ══════ LA BELLEZA DE REGALAR (spread 6) ══════ */
  /* 11 · izquierda */
  {
    kind: 'standard',
    eyebrow: 'Capítulo V',
    title: 'La belleza',
    script: 'de regalar',
    lead: 'Todo regalo lleva consigo una intención.',
    body: [
      'Hay quienes regalan por compromiso. Otros lo hacen por costumbre.',
      'Pero también existen quienes entienden que un regalo puede convertirse en un recuerdo capaz de acompañar toda una vida.',
      'No importa la ocasión. Importa la emoción que permanece cuando el instante termina.',
    ],
    folio: 'La belleza de regalar',
  },
  /* 12 · derecha */
  {
    kind: 'standard',
    eyebrow: 'La belleza de regalar',
    body: [
      'Las palabras pueden olvidarse. Los días también. Pero los gestos sinceros encuentran la forma de permanecer en la memoria.',
      'Quizá esa sea la verdadera esencia de regalar: no entregar algo valioso, sino hacer que una persona se sienta verdaderamente importante.',
      'Y cuando eso sucede, el tiempo deja de contar los años para comenzar a contar las historias.',
    ],
    folio: 'La belleza de regalar',
  },

  /* 13 · CITA / RESPIRO ---------------------------------------- */
  {
    kind: 'quote',
    quote: 'Regalar oro es regalar',
    quoteScript: 'memoria.',
    sign: 'Preto by Dala&Co',
  },

  /* 14 · CONCIERGE --------------------------------------------- */
  {
    kind: 'concierge',
    eyebrow: 'A su disposición',
    title: 'Concierge',
    body: [
      'Nuestro equipo le acompaña en la elección, el grabado y la entrega de cada regalo.',
    ],
    phone: '+57 322 695 5451',
    email: 'pretobydalaco@gmail.com',
    folio: 'Contacto',
  },

  /* 15 · CONTRAPORTADA ----------------------------------------- */
  {
    kind: 'back',
    mark: 'Preto',
    by: 'by Dala&Co',
    line: 'El arte de regalar · Edición N°01',
  },
];

/* ════════════════ Render de cada cara ════════════════ */
function revRenderFace(p) {
  const titleHTML = p.title
    ? `<h2 class="rf-title">${p.title}${p.script ? ' <span class="script">' + p.script + '</span>' : ''}</h2>`
    : '';
  const bodyHTML = (p.body || []).map(t => `<p class="rf-body">${t}</p>`).join('');

  switch (p.kind) {
    case 'cover':
      return {
        cls: 'is-cover',
        bg: p.image,
        html: `<div class="rf-cover-inner">
            <div class="rf-eyebrow">${p.eyebrow || ''}</div>
            <h2 class="rf-cover-title">${p.title} <span class="script">${p.script}</span></h2>
            ${p.sub ? `<p class="rf-cover-sub">${p.sub}</p>` : ''}
          </div>`,
      };

    case 'back':
      return {
        cls: 'is-back',
        html: `<div class="rf-back-mark">${p.mark}</div>
          <div class="rf-back-by">${p.by}</div>
          <div class="rf-back-line">${p.line}</div>`,
      };

    case 'quote':
      return {
        html: `<blockquote class="rf-quote">${p.quote} <span class="script">${p.quoteScript}</span></blockquote>
          ${p.sign ? `<div class="rf-sign">${p.sign}</div>` : ''}`,
      };

    case 'index':
      return {
        html: `<div class="rf-eyebrow">${p.eyebrow || ''}</div>
          ${titleHTML}
          <span class="rf-rule"></span>
          <ul class="rf-list">${(p.list || []).map((t, i) =>
            `<li data-n="${String(i + 1).padStart(2, '0')}">${t}</li>`).join('')}</ul>
          <div class="rf-folio"><span>${p.folio || ''}</span></div>`,
      };

    case 'concierge':
      return {
        html: `<div class="rf-eyebrow">${p.eyebrow || ''}</div>
          ${titleHTML}
          <span class="rf-rule"></span>
          ${bodyHTML}
          <div style="margin-top:14px;display:flex;flex-direction:column;gap:6px">
            <a href="tel:${(p.phone || '').replace(/\s/g, '')}" class="rf-lead" style="margin:0;text-decoration:none">${p.phone || ''}</a>
            <a href="mailto:${p.email || ''}" class="rf-body" style="margin:0;text-decoration:none;color:var(--gold)">${p.email || ''}</a>
          </div>
          <div class="rf-folio"><span>${p.folio || ''}</span></div>`,
      };

    default: /* standard */
      return {
        html: `<div class="rf-eyebrow">${p.eyebrow || ''}</div>
          ${titleHTML}
          ${p.lead ? `<p class="rf-lead">${p.lead}</p>` : ''}
          ${bodyHTML}
          ${p.image ? `<div class="rf-img" style="background-image:url('${p.image}')"></div>` : ''}
          ${p.sign ? `<div class="rf-sign">${p.sign}</div>` : ''}
          <div class="rf-folio"><span>${p.folio || ''}</span></div>`,
      };
  }
}

/* ════════════════ Construcción del libro ════════════════ */
(function () {
  const overlay = document.getElementById('revistaOverlay');
  const book = document.getElementById('revistaBook');
  const stage = document.getElementById('revistaStage');
  const scaleEl = document.getElementById('revistaScale');
  const openBtn = document.getElementById('revistaOpen');
  const closeBtn = document.getElementById('revistaClose');
  const prevBtn = document.getElementById('revPrev');
  const nextBtn = document.getElementById('revNext');
  const counter = document.getElementById('revCounter');
  if (!overlay || !book) return;

  const L = Math.ceil(PAGES.length / 2); // nº de hojas
  const totalViews = L + 1;              // portada + cada doble página
  let flipped = 0;                       // hojas ya volteadas
  let animating = false;

  // Construir hojas (front = par, back = impar siguiente)
  const leaves = [];
  for (let j = 0; j < L; j++) {
    const leaf = document.createElement('div');
    leaf.className = 'rev-leaf';

    const front = document.createElement('div');
    front.className = 'rev-face front';
    const fData = revRenderFace(PAGES[2 * j]);
    if (fData.cls) front.classList.add(fData.cls);
    if (fData.bg) front.style.backgroundImage = `url('${fData.bg}')`;
    front.innerHTML = fData.html;

    const back = document.createElement('div');
    back.className = 'rev-face back';
    const bp = PAGES[2 * j + 1];
    if (bp) {
      const bData = revRenderFace(bp);
      if (bData.cls) back.classList.add(bData.cls);
      if (bData.bg) back.style.backgroundImage = `url('${bData.bg}')`;
      back.innerHTML = bData.html;
    }

    leaf.appendChild(front);
    leaf.appendChild(back);
    book.appendChild(leaf);
    leaves.push(leaf);
  }

  function applyZ() {
    leaves.forEach((leaf, i) => {
      leaf.style.zIndex = (i < flipped) ? String(i + 1) : String(L - i + 1);
    });
  }

  function update() {
    leaves.forEach((leaf, i) => leaf.classList.toggle('flipped', i < flipped));
    applyZ();
    counter.textContent = `${String(flipped + 1).padStart(2, '0')} — ${String(totalViews).padStart(2, '0')}`;
    prevBtn.disabled = flipped === 0;
    nextBtn.disabled = flipped >= L;
  }

  function go(dir) {
    if (animating) return;
    const target = flipped + dir;
    if (target < 0 || target > L) return;
    animating = true;
    // hoja que se mueve va al frente durante la animación
    const moving = dir > 0 ? leaves[flipped] : leaves[flipped - 1];
    if (moving) moving.style.zIndex = String(L + 5);
    flipped = target;
    update();
    setTimeout(() => { animating = false; applyZ(); }, 1080);
  }

  function fit() {
    if (!stage) return;
    const availW = stage.clientWidth * 0.94;
    const availH = stage.clientHeight * 0.92;
    const s = Math.min(availW / 1140, availH / 760, 1.15);
    scaleEl.style.transform = `scale(${s})`;
  }

  function open() {
    try { if (typeof closeStackedOverlays === 'function') closeStackedOverlays(); } catch (_) {}
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    flipped = 0;
    update();
    requestAnimationFrame(fit);
    setTimeout(fit, 80);
    setTimeout(fit, 320);
  }
  function close() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openBtn && openBtn.addEventListener('click', open);
  closeBtn && closeBtn.addEventListener('click', close);
  nextBtn && nextBtn.addEventListener('click', () => go(1));
  prevBtn && prevBtn.addEventListener('click', () => go(-1));

  // Clic en la mitad derecha/izquierda del libro para pasar página
  book.addEventListener('click', e => {
    const r = book.getBoundingClientRect();
    if ((e.clientX - r.left) > r.width / 2) go(1); else go(-1);
  });

  document.addEventListener('keydown', e => {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') go(1);
    else if (e.key === 'ArrowLeft') go(-1);
  });

  window.addEventListener('resize', fit);
  update();
})();
