(function(){
  'use strict';
  const $ = (selector, root=document) => root.querySelector(selector);
  const $$ = (selector, root=document) => Array.from(root.querySelectorAll(selector));
  const catalog = window.REPISA_CATALOG || {collections:[],publications:[]};
  const collectionNames = Object.fromEntries(catalog.collections.map(item=>[item.id,item.name]));
  const safe = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const published = catalog.publications.filter(item=>item.status === 'published');
  const card = item => {
    const cover = item.cover ? '<img src="'+safe(item.cover)+'" alt="" loading="lazy">' : '<span class="cover-symbol" aria-hidden="true">✳</span>';
    const target = 'publicacion.html?id='+encodeURIComponent(item.id);
    return '<article class="publication-card"><a class="publication-cover" href="'+target+'" aria-label="Ver '+safe(item.title)+'">'+cover+'</a><div class="publication-body"><span class="publication-meta">'+safe(collectionNames[item.collection]||'Colección')+' · '+safe(item.type||'Material')+'</span><h3><a href="'+target+'">'+safe(item.title)+'</a></h3><p>'+safe(item.description||item.subtitle||'Material de la biblioteca.')+'</p><span class="status-chip">Disponible</span><a class="publication-link" href="'+target+'">Ver publicación ↗</a></div></article>';
  };
  function renderHome(){
    const target = $('#featured-publications');
    if(!target)return;
    target.innerHTML = published.length ? published.slice().sort((a,b)=>(b.date||'').localeCompare(a.date||'')).slice(0,3).map(card).join('') : '<div class="empty-state"><span>✳</span><h3>Estamos preparando las primeras publicaciones.</h3><p>Pronto vas a encontrar acá materiales para leer, mirar y compartir.</p></div>';
  }
  function renderCatalog(){
    const target=$('#catalog-results'); if(!target)return;
    const search=$('#catalog-search'), type=$('#type-filter'), sort=$('#sort-filter');
    const buttons=$$('.filter-link'); let selected=new URLSearchParams(location.search).get('coleccion')||'';
    const valid=collection=>!collection||catalog.collections.some(item=>item.id===collection);
    if(!valid(selected))selected='';
    function update(){
      const term=(search?.value||'').trim().toLocaleLowerCase('es-AR');
      let items=published.filter(item=>(!selected||item.collection===selected)&&(!type?.value||item.type===type.value));
      items=items.filter(item=>[item.title,item.subtitle,item.description,item.author,collectionNames[item.collection],...(item.tags||[])].join(' ').toLocaleLowerCase('es-AR').includes(term));
      if(sort?.value==='az')items.sort((a,b)=>a.title.localeCompare(b.title,'es'));
      else items.sort((a,b)=>(b.date||'').localeCompare(a.date||''));
      target.innerHTML=items.length?items.map(card).join(''):'<div class="empty-state"><span>⌕</span><h3>No encontramos publicaciones con esa búsqueda.</h3><p>Probá con otra palabra o elegí una colección diferente. El catálogo se irá completando a medida que incorporemos materiales.</p></div>';
      const count=$('#results-count'); if(count)count.textContent=items.length+' '+(items.length===1?'publicación disponible':'publicaciones disponibles');
      buttons.forEach(button=>{const active=button.dataset.collection===selected;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
    }
    buttons.forEach(button=>button.addEventListener('click',()=>{selected=button.dataset.collection||'';const url=new URL(location.href);selected?url.searchParams.set('coleccion',selected):url.searchParams.delete('coleccion');history.replaceState({},'',url);update();}));
    [search,type,sort].filter(Boolean).forEach(element=>element.addEventListener('input',update));
    update();
  }
  function renderPublication(){
    const target=$('#publication-detail'); if(!target)return;
    const id=new URLSearchParams(location.search).get('id');
    const item=published.find(entry=>entry.id===id);
    if(!item){target.innerHTML='<div class="empty-state"><span>⌕</span><h3>Esta publicación no está disponible.</h3><p>Puede que todavía no se haya publicado o que el enlace no sea correcto.</p><a class="text-link" href="colecciones.html">Volver al catálogo</a></div>';return;}
    document.title=item.title+' — La Repisa Chañarense';
    const cover=item.cover?'<img src="'+safe(item.cover)+'" alt="Portada de '+safe(item.title)+'">':'<span class="cover-symbol" aria-hidden="true">✳</span>';
    const download=item.file?'<a class="button button-primary" href="'+safe(item.file)+'" download>Descargar material ↓</a>':'';
    const read=item.readingUrl?'<a class="button button-light" href="'+safe(item.readingUrl)+'" target="_blank" rel="noopener">Leer en línea ↗</a>':'';
    const content=(item.content||[]).map(paragraph=>'<p>'+safe(paragraph)+'</p>').join('');
    const sources=(item.sources||[]).filter(source=>source&&source.label).map(source=>'<li>'+(source.url?'<a href="'+safe(source.url)+'" target="_blank" rel="noopener">'+safe(source.label)+'</a>':safe(source.label))+'</li>').join('');
    target.innerHTML='<article class="detail-layout"><div class="detail-cover">'+cover+'</div><div class="detail-copy"><span class="eyebrow">'+safe(collectionNames[item.collection]||'Colección')+' · '+safe(item.type||'Material')+'</span><h1>'+safe(item.title)+'</h1>'+(item.subtitle?'<p class="detail-subtitle">'+safe(item.subtitle)+'</p>':'')+'<p class="detail-description">'+safe(item.description||'')+'</p>'+(content?'<div class="detail-reading"><h2>Para leer</h2>'+content+'</div>':'')+'<div class="detail-actions">'+download+read+'</div><dl class="detail-metadata">'+(item.author?'<div><dt>Autoría</dt><dd>'+safe(item.author)+'</dd></div>':'')+(item.date?'<div><dt>Fecha</dt><dd>'+safe(item.date)+'</dd></div>':'')+(item.credits?'<div><dt>Créditos</dt><dd>'+safe(item.credits)+'</dd></div>':'')+'</dl>'+(sources?'<div class="detail-sources"><h2>Fuentes y referencias</h2><ul>'+sources+'</ul></div>':'')+'</div></article>';
  }
  function initSearch(){
    const form=$('#search-form'), input=$('#catalog-search');
    if(form&&input)form.addEventListener('submit',event=>{event.preventDefault();location.href='colecciones.html?q='+encodeURIComponent(input.value.trim());});
    if(input&&location.pathname.endsWith('colecciones.html')){const q=new URLSearchParams(location.search).get('q');if(q){input.value=q;input.dispatchEvent(new Event('input'));}}
  }
  function initMenu(){
    const button=$('.menu-toggle'),nav=$('#site-nav');if(!button||!nav)return;
    button.addEventListener('click',()=>{const open=button.getAttribute('aria-expanded')!=='true';button.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});
    nav.addEventListener('click',event=>{if(event.target.closest('a')){button.setAttribute('aria-expanded','false');nav.classList.remove('open');}});
  }
  function initAlias(){
    const button=$('#copy-alias'),alias=$('#support-alias'),feedback=$('#copy-feedback');if(!button||!alias)return;
    button.addEventListener('click',async()=>{
      const value=alias.textContent.trim();
      try{if(navigator.clipboard&&window.isSecureContext)await navigator.clipboard.writeText(value);else{const area=document.createElement('textarea');area.value=value;area.style.position='fixed';area.style.opacity='0';document.body.appendChild(area);area.select();const ok=document.execCommand('copy');area.remove();if(!ok)throw new Error('copy failed');}
        if(feedback){feedback.textContent='Alias copiado';feedback.classList.add('show');window.setTimeout(()=>feedback.classList.remove('show'),1800);}
      }catch(error){if(feedback){feedback.textContent='Alias: '+value;feedback.classList.add('show');}}
    });
  }
  renderHome();renderCatalog();renderPublication();initSearch();initMenu();initAlias();
})();