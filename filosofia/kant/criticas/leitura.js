(function(){
  var vistas=[].slice.call(document.querySelectorAll('.vista'));
  var links=[].slice.call(document.querySelectorAll('.barra a[data-vista]'));
  var base=document.title;
  function rota(){
    var h=decodeURIComponent(location.hash.slice(1))||'planta';
    var alvo=document.getElementById(h);
    if(!alvo||!alvo.classList.contains('vista')) alvo=document.getElementById('planta');
    vistas.forEach(function(v){v.classList.toggle('ativa',v===alvo)});
    links.forEach(function(a){
      if(a.dataset.vista===alvo.id) a.setAttribute('aria-current','page');
      else a.removeAttribute('aria-current');
    });
    document.title=alvo.dataset.titulo?alvo.dataset.titulo+' | '+base:(alvo.id==='glossario'?'Glossário | '+base:base);
    window.scrollTo(0,0);
    requestAnimationFrame(function(){window.scrollTo(0,0)});
  }
  window.addEventListener('hashchange',rota);
  window.addEventListener('load',function(){window.scrollTo(0,0)});
  rota();

  var KEY='kant-criticas-ocultar';
  function aplicar(oculto){
    document.body.classList.toggle('sem-critica',oculto);
    [].forEach.call(document.querySelectorAll('.botao-critica'),function(b){
      b.textContent=oculto?'Mostrar atritos e dúvidas':'Ocultar atritos e dúvidas';
      b.setAttribute('aria-pressed',oculto?'true':'false');
    });
  }
  var inicial=false;
  try{inicial=localStorage.getItem(KEY)==='1'}catch(e){}
  aplicar(inicial);
  document.addEventListener('click',function(ev){
    var b=ev.target.closest('.botao-critica'); if(!b) return;
    var oculto=!document.body.classList.contains('sem-critica');
    aplicar(oculto);
    try{localStorage.setItem(KEY,oculto?'1':'0')}catch(e){}
  });

  var filtro=document.getElementById('filtro');
  var vazio=document.getElementById('vazio');
  function norm(s){return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()}
  filtro.addEventListener('input',function(){
    var q=norm(filtro.value.trim()); var total=0;
    [].forEach.call(document.querySelectorAll('#grupos .grupo'),function(g){
      var n=0;
      [].forEach.call(g.querySelectorAll('li'),function(li){
        var ok=!q||norm(li.textContent).indexOf(q)>-1; li.hidden=!ok; if(ok) n++;
      });
      g.hidden=n===0; total+=n;
    });
    vazio.hidden=total>0;
  });
})();
