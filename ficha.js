/* ═══════════════════════════════════════════════════════════════
   PRETO BY DALA&CO · Ficha de producto — runtime compartido
   · Lee la pieza desde catalogo.js (fuente única) por su id.
   · El precio se calcula EN VIVO desde precios.js (un solo archivo).
   · La imagen visible + Open Graph + Schema.org salen del MISMO
     campo (img) — al cambiar la foto en el catálogo se actualiza todo.
   · "Añadir al carrito" abre el flujo real de la tienda (modal) vía
     index.html#card-<id>; "WhatsApp" abre el concierge de la casa.
   ═══════════════════════════════════════════════════════════════ */
(function(){
  'use strict';
  var WA='573226955451';
  var SITE='https://pretogold.store/';
  var id=window.PRETO_PID;
  var CAT=(window.PRETO_CATALOG||[]);
  var p=null; for(var i=0;i<CAT.length;i++){ if(CAT[i].id===id){ p=CAT[i]; break; } }
  if(!p) return;
  var PRICES=window.PRETO_PRICES||{};
  var SIZEP=window.PRETO_SIZE_PRICES||{};

  function fmtCOP(n){ try{ return '$'+Math.round(n).toLocaleString('es-CO'); }catch(e){ return '$'+Math.round(n); } }
  function liveMin(){
    var sp=SIZEP[id];
    if(sp){ var vals=Object.keys(sp).map(function(k){return sp[k];}).filter(function(v){return v!=null;}); if(vals.length) return Math.min.apply(null,vals); }
    if(PRICES[id]!=null) return PRICES[id];
    return (p.price!=null?p.price:null);
  }

  /* Imagen visible desde la fuente única (por si cambió en el catálogo) */
  var imgEl=document.getElementById('jyImg');
  if(imgEl && p.img){ imgEl.src='../'+p.img; imgEl.alt=p.name+' — '+p.brand; }

  /* Precio en vivo */
  var priceEl=document.getElementById('jyPrice');
  var price=liveMin();
  /* Traducción segura: usa i18n si está cargado; si no, cae al español. */
  function TL(k,fb){ try{ var v=(window.t?window.t(k):null); return (v&&v!==k)?v:fb; }catch(e){ return fb; } }
  function renderPrice(){
    if(!priceEl) return;
    if(p.elite){ priceEl.className='jy-price consulta'; priceEl.textContent=TL('jy.price.autor','Pieza de autor · bajo encargo'); }
    else if(price==null){ priceEl.className='jy-price consulta'; priceEl.textContent=TL('jy.price.consulta','Consultar precio'); }
    else{
      priceEl.className='jy-price';
      priceEl.innerHTML=(p.exact?'':'<span class="from">'+TL('jy.price.desde','Desde')+'</span>')+fmtCOP(price)+'<span class="cur">COP</span>';
    }
  }
  renderPrice();
  /* i18n aplica el idioma de la URL en DOMContentLoaded → re-renderiza. */
  document.addEventListener('preto:langchange', renderPrice);

  /* Sincroniza Schema.org + Open Graph con la misma imagen/precio.
     Solo reescribe la imagen si la pieza TIENE foto; si no, deja el
     fallback estático (preto-og.jpg) que ya trae el HTML. */
  try{
    var abs=p.img?SITE+p.img:null;
    if(abs){
      var og=document.querySelector('meta[property="og:image"]'); if(og) og.setAttribute('content',abs);
      var tw=document.querySelector('meta[name="twitter:image"]'); if(tw) tw.setAttribute('content',abs);
    }
    var ld=document.getElementById('ld-product');
    if(ld){ var j=JSON.parse(ld.textContent); if(abs){ j.image=[abs]; } if(j.offers && price!=null){ j.offers.price=String(price); } ld.textContent=JSON.stringify(j).replace(/</g,'\\u003c'); }
  }catch(e){}

  /* Galería deslizable — si la pieza trae varias fotos (p.imgs), el
     cliente pasa de una a otra con clic, flechas, puntos o swipe.
     La primera foto es la principal. Reutilizable por cualquier ficha;
     no afecta a piezas de una sola imagen. */
  try{
    var gimgs=Array.isArray(p.imgs)?p.imgs.filter(Boolean):[];
    var fig=imgEl?imgEl.closest('.jy-media'):null;
    if(imgEl && fig && gimgs.length>1){
      imgEl.src='../'+gimgs[0];
      var track=document.createElement('div'); track.className='jy-track';
      var s0=document.createElement('div'); s0.className='jy-slide';
      imgEl.parentNode.insertBefore(track, imgEl); s0.appendChild(imgEl); track.appendChild(s0);
      for(var gi=1; gi<gimgs.length; gi++){
        var sl=document.createElement('div'); sl.className='jy-slide';
        var im=document.createElement('img'); im.src='../'+gimgs[gi]; im.alt=p.name+' — '+p.brand; im.loading='lazy'; im.decoding='async';
        sl.appendChild(im); track.appendChild(sl);
      }
      var n=gimgs.length, idx=0, dotEls=[];
      function go(i){ idx=(i%n+n)%n; track.style.transform='translateX('+(-idx*100)+'%)'; for(var k=0;k<dotEls.length;k++) dotEls[k].classList.toggle('is-active',k===idx); }
      var dots=document.createElement('div'); dots.className='jy-dots';
      for(var d=0; d<n; d++){ (function(di){ var dd=document.createElement('button'); dd.type='button'; dd.className='jy-dot'; dd.setAttribute('aria-label','Ver imagen '+(di+1)); dd.addEventListener('click',function(e){ e.stopPropagation(); go(di); }); dots.appendChild(dd); dotEls.push(dd); })(d); }
      var prev=document.createElement('button'); prev.type='button'; prev.className='jy-nav prev'; prev.setAttribute('aria-label','Anterior'); prev.innerHTML='\u2039';
      var next=document.createElement('button'); next.type='button'; next.className='jy-nav next'; next.setAttribute('aria-label','Siguiente'); next.innerHTML='\u203a';
      prev.addEventListener('click',function(e){ e.stopPropagation(); go(idx-1); });
      next.addEventListener('click',function(e){ e.stopPropagation(); go(idx+1); });
      fig.appendChild(prev); fig.appendChild(next); fig.appendChild(dots);
      fig.classList.add('has-slider');
      var x0=0, dx=0, dragging=false;
      fig.addEventListener('pointerdown',function(e){ if(e.target.closest('.jy-nav')||e.target.closest('.jy-dots')) return; dragging=true; x0=e.clientX; dx=0; track.style.transition='none'; try{ fig.setPointerCapture(e.pointerId); }catch(_){} });
      fig.addEventListener('pointermove',function(e){ if(!dragging) return; dx=e.clientX-x0; track.style.transform='translateX(calc('+(-idx*100)+'% + '+dx+'px))'; });
      function endDrag(){ if(!dragging) return; dragging=false; track.style.transition=''; var w=fig.clientWidth||1; if(Math.abs(dx)<8){ go(idx+1); } else if(Math.abs(dx)>w*0.15){ go(idx + (dx<0?1:-1)); } else { go(idx); } dx=0; }
      fig.addEventListener('pointerup', endDrag);
      fig.addEventListener('pointercancel', endDrag);
      go(0);
    }
  }catch(e){}

  /* Disponibilidad, certificado y servicio (auditoría ago-2026).
     El plazo responde «¿cuándo llega?» sin escribir por WhatsApp;
     el certificado se MUESTRA antes de comprar en vez de prometerse
     en el paso de entrega. Marque la pieza con mto:true en
     catalogo.js si se elabora por encargo. */
  try{
    var info=document.querySelector('.jy-info');
    if(info && !document.getElementById('jyExtras')){
      var mto=!!p.mto;
      var ex=document.createElement('div'); ex.id='jyExtras'; ex.className='jy-extras';
      /* Ficha técnica: solo datos que la casa ya tiene. Peso, largo y
         grosor se añaden cuando estén medidos (no se muestran vacíos).
         El metal se lee del rótulo de la página (único sitio donde está:
         catalogo.js no lo guarda) y la ley solo se afirma cuando ese
         rótulo la nombra — en piezas de hilo, cuero, perla u ónix el oro
         va en los remates, no en todo el cuerpo. */
      var brow=((document.querySelector('.jy-eyebrow')||{}).textContent||'').trim();
      var segs=brow.split('·').map(function(s){ return s.trim(); }).filter(Boolean);
      var last=segs.length?segs[segs.length-1]:'';
      var metal=/^oro\b/i.test(last)?last:'';
      var mixta=/hilo|cuero|perla|ónix|onix/i.test(brow);
      var onix=/ónix|onix/i.test(brow);
      var ital=/italian/i.test(String(p.desc||''))||/italian/i.test(String(p.name||''));
      var specs=[];
      if(metal) specs.push(['Metal', mixta ? (onix ? metal+' · con ónix' : metal+' en los remates') : (ital ? metal+' · fabricación italiana' : metal)]);
      if(!mixta && /ley\s*750|18k/i.test(brow)) specs.push(['Ley','750 (oro 18k)']);
      if(Array.isArray(p.sizes)&&p.sizes.length) specs.push([p.fam==='Anillos'?'Tallas':'Medidas', p.sizes.join(' · ')]);
      var specHtml=specs.length?('<dl class="jy-specs">'+specs.map(function(r){ return '<div><dt>'+r[0]+'</dt><dd>'+r[1]+'</dd></div>'; }).join('')+'</dl>'):'';
      ex.innerHTML=specHtml+
        '<p class="jy-avail'+(mto?' is-mto':'')+'"><span class="d"></span>'+
          (mto?'Hecha a pedido <em>· tres semanas en el taller</em>':'Disponible <em>· despacho asegurado en 48 h</em>')+'</p>'+
        '<a class="jy-xcard" href="../promesa.html"><span class="k">Tarjeta de propiedad</span>'+
          '<span class="t">Certificado de oro 18k, numerado</span>'+
          '<span class="d2">Acredita el material, registra su pedido y activa la garantía de por vida.</span></a>'+
        '<a class="jy-xcard" href="../servicio.html"><span class="k">Servicio de la casa</span>'+
          '<span class="t">Ajuste, limpieza y reparación</span>'+
          '<span class="d2">El mismo taller que la hizo la mantiene: talla, pulido, engaste y garantía.</span></a>';
      info.appendChild(ex);
    }
  }catch(e){}

  /* Guía de tallas en pantalla — solo para anillos */
  if(p.fam==='Anillos'){
    var sz=document.querySelector('.jy-sizes');
    if(sz){ var g=document.createElement('a'); g.className='jy-size-help'; g.href='../talla-anillos.html'; g.textContent='¿No conoce su talla? Mídala en su pantalla →'; sz.appendChild(g); }
  }

  /* ── Medida seleccionable ────────────────────────────────────────
     Con varias medidas, la elegida manda el precio y viaja al carrito. */
  var chips=[].slice.call(document.querySelectorAll('.jy-chips .jy-chip'));
  var sizeSel=(Array.isArray(p.sizes)&&p.sizes.length)?p.sizes[0]:null;
  function priceFor(size){
    var sp=SIZEP[id];
    if(sp&&size&&sp[size]!=null) return sp[size];
    return liveMin();
  }
  if(chips.length){
    chips.forEach(function(ch,i){
      ch.setAttribute('role','button'); ch.setAttribute('tabindex','0');
      if(i===0) ch.classList.add('is-sel');
      function pick(){
        chips.forEach(function(c){ c.classList.remove('is-sel'); });
        ch.classList.add('is-sel');
        sizeSel=(ch.textContent||'').trim();
        price=priceFor(sizeSel); renderPrice();
      }
      ch.addEventListener('click',pick);
      ch.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); pick(); } });
    });
  }

  /* ── Añadir al carrito, en la misma página ───────────────────────
     Escribe en el MISMO carrito de la tienda (localStorage
     preto.quote.v1) y confirma sin sacar al cliente de la ficha. */
  var addBtn=document.querySelector('.jy-cta .jy-btn-gold');
  if(addBtn){
    addBtn.setAttribute('role','button');
    addBtn.addEventListener('click',function(ev){
      ev.preventDefault();
      var QKEY='preto.quote.v1';
      var q=[]; try{ q=JSON.parse(localStorage.getItem(QKEY)||'[]'); if(!Array.isArray(q)) q=[]; }catch(e){ q=[]; }
      var key=id+'::'+(sizeSel||'');
      var found=null; for(var k=0;k<q.length;k++){ if(q[k].key===key){ found=q[k]; break; } }
      if(found) found.qty=(found.qty||1)+1;
      else q.push({ key:key, id:id, name:p.name, col:p.brand?('Colección '+p.brand):null, size:sizeSel||null,
                    note:p.note||null, desc:p.desc||null, price:priceFor(sizeSel), qty:1, image:p.img||null });
      try{ localStorage.setItem(QKEY,JSON.stringify(q)); }catch(e){}
      if(typeof fbq==='function'){ try{ fbq('track','AddToCart',{ content_ids:[id], content_name:p.name, currency:'COP', value:priceFor(sizeSel)||0 }); }catch(e){} }
      var n=0; q.forEach(function(it){ n+=(it.qty||1); });
      var box=document.getElementById('jyAdded');
      if(!box){
        box=document.createElement('div'); box.id='jyAdded'; box.className='jy-added';
        addBtn.parentNode.insertBefore(box,addBtn.nextSibling);
      }
      box.innerHTML='<p><b>Añadida a su carrito.</b> '+n+' pieza'+(n===1?'':'s')+' en total'+(sizeSel?(' · medida '+sizeSel):'')+'.</p>'+
        '<span class="jy-added-acts"><a class="jy-added-go" href="../facturacion.html">Ver mi carrito →</a>'+
        '<button type="button" class="jy-added-more">Seguir viendo</button></span>';
      box.classList.add('is-in');
      var more=box.querySelector('.jy-added-more');
      if(more) more.addEventListener('click',function(){ box.classList.remove('is-in'); });
    });
  }

  /* WhatsApp — concierge de la casa (mismo número de la tienda) */
  var waBtn=document.getElementById('jyWa');
  if(waBtn) waBtn.addEventListener('click',function(){
    if(typeof fbq==='function'){ try{ fbq('track','Contact'); }catch(e){} }
    var pl=(p.elite?TL('jy.price.autor','Pieza de autor · bajo encargo'):(price==null?TL('jy.price.consulta','Consultar precio'):(p.exact?'':TL('jy.price.desde','Desde')+' ')+fmtCOP(price)+' COP'));
    var lines=[TL('jy.wa.intro','Hola, me interesa esta pieza de Preto by Dala&Co:'),'',p.name+' (Ref. '+p.id+')',pl,SITE+p.url,'',TL('jy.wa.outro','Quedo atento a la asesoría. Gracias.')];
    window.open('https://wa.me/'+WA+'?text='+encodeURIComponent(lines.join('\n')),'_blank','noopener');
  });
})();
