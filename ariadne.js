/* Projeto Ariadne — barra comum (o fio) para as páginas dos cadernos.
   Uso: <script src="../ariadne.js" data-home="../" data-trail="Filosofia=index.html|Hegel=hegel.html|Ciência da Lógica"></script>
   Opcional: data-extra="Glossário=kant-criticas.html#glossario" acrescenta um link no canto direito. */
(function(){
  var s=document.currentScript; if(!s) return;
  if(/[?&]embed=1/.test(location.search)) return;
  var home=s.dataset.home||'./';
  var par=function(x){var p=x.split('=');return {l:p[0],h:p.slice(1).join('=')};};
  var trail=(s.dataset.trail||'').split('|').filter(Boolean).map(par);
  var extra=s.dataset.extra?par(s.dataset.extra):null;
  var l=document.createElement('link');l.rel='stylesheet';
  l.href='https://fonts.googleapis.com/css2?family=Alegreya+Sans:wght@400;500;700&display=swap';document.head.appendChild(l);
  var st=document.createElement('style');
  st.textContent=
  '.ariadne-fio{position:relative;z-index:40;flex:none;display:flex;align-items:center;flex-wrap:wrap;gap:6px 12px;'+
  'padding:12px clamp(16px,3vw,32px) 10px;font:500 14px/1.2 "Alegreya Sans","Segoe UI",system-ui,sans-serif;'+
  'border-bottom:1px solid rgba(110,120,130,.22);color:inherit}'+
  '.ariadne-fio::before{content:"";position:absolute;left:0;right:0;top:0;height:2px;background:#9A3A2C}'+
  '.ariadne-fio a{color:inherit;text-decoration:none}'+
  '.ariadne-fio a:hover{color:#9A3A2C}'+
  '.ariadne-fio a:focus-visible{outline:2px solid currentColor;outline-offset:3px;border-radius:2px}'+
  '.ariadne-fio .af-marca{display:inline-flex;align-items:center;gap:8px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;font-size:12.5px}'+
  '.ariadne-fio .af-novelo{width:11px;height:11px;border-radius:50%;background:#9A3A2C;box-shadow:0 0 0 3px rgba(154,58,44,.16)}'+
  '.ariadne-fio .af-sep{width:16px;height:1.5px;background:#9A3A2C;opacity:.75}'+
  '.ariadne-fio .af-atual{opacity:.62}'+
  '.ariadne-fio .af-vao{flex:1}'+
  '.ariadne-fio .af-extra{font-size:13.5px;color:#525C68}'+
  '.texto p,.texto li,.capitulo p,.capitulo li,.node-body li,.p-sec p,.p-sec li{text-align:justify;-webkit-hyphens:auto;hyphens:auto}'+
  '.texto p.tese{text-align:left}'+
  '@media print{.ariadne-fio{display:none}}';
  document.head.appendChild(st);
  var nav=document.createElement('nav');nav.className='ariadne-fio';nav.setAttribute('aria-label','Projeto Ariadne');
  var h='<a class="af-marca" href="'+home+'"><span class="af-novelo"></span>Ariadne</a>';
  trail.forEach(function(t,i){
    h+='<span class="af-sep" aria-hidden="true"></span>';
    var last=i===trail.length-1;
    h+= (t.h&&!last)?'<a href="'+t.h+'">'+t.l+'</a>':'<span'+(last?' class="af-atual" aria-current="page"':'')+'>'+t.l+'</span>';
  });
  if(extra) h+='<span class="af-vao"></span><a class="af-extra" href="'+extra.h+'">'+extra.l+'</a>';
  nav.innerHTML=h;
  document.body.insertBefore(nav,document.body.firstChild);
})();
