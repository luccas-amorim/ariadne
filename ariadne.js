/* Projeto Ariadne — barra comum (o fio) para as páginas dos cadernos.
   No head: <link rel="stylesheet" href="../../../ariadne.css">
   No body: <script src="../../../ariadne.js" data-home="../../../" data-trail="Filosofia=../../|Hegel=../|Ciência da Lógica"></script>
   Opcional: data-extra="Glossário=criticas/#glossario" acrescenta um link no canto direito.
   Opcional: data-sem-barra não desenha a barra (a home tem cabeçalho próprio), mas mantém o "copiar citação".
   Qualquer elemento com [data-copiar-citacao] copia a referência da página (ABNT) com o endereço e a data de acesso.
   A barra acompanha a leitura (fica presa ao topo). As barras próprias das páginas que também se prendem ao
   topo descem para logo abaixo dela, e os saltos para âncoras descontam a sua altura (variável --af-h). */
(function(){
  var s=document.currentScript; if(!s) return;

  /* ── Citação ─────────────────────────────────────────────────────────── */
  var AUTOR='AMORIM, Luccas de';
  var OBRA='Projeto Ariadne: cadernos de estudo';
  var ANO='2026';
  var MESES=['jan.','fev.','mar.','abr.','maio','jun.','jul.','ago.','set.','out.','nov.','dez.'];
  function citacao(){
    var d=new Date(), acesso=d.getDate()+' '+MESES[d.getMonth()]+' '+d.getFullYear();
    var url=location.href.replace(/[?&]embed=1/,'');
    var titulo=document.title.replace(/\s*·\s*Projeto Ariadne$/,'').replace(/\s+\|\s+/g,' — ').trim();
    var parte=(titulo&&titulo!=='Projeto Ariadne')?titulo+'. In: '+AUTOR+'. ':'';
    return AUTOR+'. '+parte+OBRA+'. '+ANO+'. Disponível em: '+url+'. Acesso em: '+acesso+'.';
  }
  function copiar(texto){
    if(navigator.clipboard&&window.isSecureContext) return navigator.clipboard.writeText(texto);
    return new Promise(function(ok,falha){
      var t=document.createElement('textarea');t.value=texto;t.setAttribute('readonly','');
      t.style.cssText='position:fixed;left:-9999px;top:0';document.body.appendChild(t);t.select();
      try{document.execCommand('copy')?ok():falha();}catch(e){falha(e);}
      document.body.removeChild(t);
    });
  }
  document.addEventListener('click',function(ev){
    var b=ev.target.closest&&ev.target.closest('[data-copiar-citacao]'); if(!b) return;
    var rotulo=b.getAttribute('data-rotulo')||b.textContent;b.setAttribute('data-rotulo',rotulo);
    copiar(citacao()).then(function(){b.textContent='citação copiada ✓';},function(){b.textContent='não foi possível copiar';})
      .then(function(){clearTimeout(b._t);b._t=setTimeout(function(){b.textContent=rotulo;},2000);});
  });

  if(/[?&]embed=1/.test(location.search)) return;

  document.documentElement.classList.add('ariadne-pagina');
  if(!document.querySelector('link[rel="stylesheet"][href*="family=Alegreya+Sans:"]')){
    var fonte=document.createElement('link');
    fonte.rel='stylesheet';
    fonte.href='https://fonts.googleapis.com/css2?family=Alegreya+Sans:wght@400;500;700&display=swap';
    document.head.appendChild(fonte);
  }
  if(s.hasAttribute('data-sem-barra')) return;

  var home=s.dataset.home||'./';
  var par=function(x){var p=x.split('=');return {l:p[0],h:p.slice(1).join('=')};};
  var trail=(s.dataset.trail||'').split('|').filter(Boolean).map(par);
  var extra=s.dataset.extra?par(s.dataset.extra):null;
  var nav=document.createElement('nav');nav.className='ariadne-fio';nav.setAttribute('aria-label','Projeto Ariadne');
  var h='<a class="af-marca" href="'+home+'"><span class="af-novelo"></span>Ariadne</a>';
  trail.forEach(function(t,i){
    h+='<span class="af-sep" aria-hidden="true"></span>';
    var last=i===trail.length-1;
    h+= (t.h&&!last)?'<a href="'+t.h+'">'+t.l+'</a>':'<span'+(last?' class="af-atual" aria-current="page"':'')+'>'+t.l+'</span>';
  });
  h+='<span class="af-vao"></span>';
  if(extra) h+='<a class="af-extra" href="'+extra.h+'">'+extra.l+'</a>';
  h+='<button type="button" class="af-citar" data-copiar-citacao aria-live="polite">copiar citação</button>';
  nav.innerHTML=h;
  document.body.insertBefore(nav,document.body.firstChild);

  /* ── A barra acompanha a leitura ─────────────────────────────────────── */
  var raiz=document.documentElement;
  /* Altura da barra, para as barras das páginas e os saltos para âncoras. */
  function medir(){ raiz.style.setProperty('--af-h',nav.offsetHeight+'px'); }
  /* Fundo opaco, o mesmo da página (inclusive no modo escuro), para o texto não aparecer por baixo. */
  function pintar(){
    var c='';
    [document.body,raiz].some(function(el){
      var b=getComputedStyle(el).backgroundColor;
      if(b&&b!=='transparent'&&!/rgba\([^)]*,\s*0\)$/.test(b)){c=b;return true;}
      return false;
    });
    nav.style.backgroundColor=c||'#fff';
  }
  medir();
  if(window.ResizeObserver) new ResizeObserver(medir).observe(nav);
  else addEventListener('resize',medir);
  function pronto(){ pintar(); medir(); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',pronto); else pronto();
  if(window.matchMedia){ var mq=matchMedia('(prefers-color-scheme: dark)'); (mq.addEventListener?mq.addEventListener('change',pintar):mq.addListener(pintar)); }
  if(window.MutationObserver) new MutationObserver(pintar).observe(raiz,{attributes:true,attributeFilter:['data-theme','class','style']});
})();
