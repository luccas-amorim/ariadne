/* Projeto Ariadne — montagem das páginas de apresentação dos filósofos.
   Uso: Filosofo.montar({ partes, chave, metaItalico, figura: function(h, el){ return svg }, obras }).
   A figura é redesenhada a cada mudança da parte em foco (h). */
var Filosofo = (function(){
  var NS = 'http://www.w3.org/2000/svg';

  function el(tag, attrs, txt){
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    if (txt != null) e.textContent = txt;
    return e;
  }

  function montar(cfg){
    var chave = cfg.chave || 'n';
    var fig = document.getElementById('figura');
    var box = document.getElementById('partes');
    var cards = {};

    function render(h){
      fig.textContent = '';
      fig.appendChild(cfg.figura(h, el));
      Object.keys(cards).forEach(function(k){ cards[k].classList.toggle('on', k === h); });
    }

    cfg.partes.forEach(function(p){
      var div = document.createElement('div');
      div.className = 'parte';
      div.innerHTML = '<div class="cab"><span class="n"></span><h3></h3></div><p></p><span class="selo">Texto a vir</span>';
      div.querySelector('.n').textContent = p.n;
      div.querySelector('h3').textContent = p.t;
      if (p.meta) {
        var m = document.createElement('span');
        m.className = 'meta' + (cfg.metaItalico ? ' it' : '');
        m.textContent = p.meta;
        div.querySelector('.cab').appendChild(m);
      }
      div.querySelector('p').textContent = p.d;
      div.addEventListener('mouseenter', function(){ render(p[chave]); });
      div.addEventListener('mouseleave', function(){ render(null); });
      cards[p[chave]] = div;
      box.appendChild(div);
    });

    var lista = document.getElementById('outras');
    cfg.obras.forEach(function(o){
      var div = document.createElement('div');
      div.className = 'item';
      div.innerHTML = '<span class="t"></span><span class="a"></span>';
      div.querySelector('.t').textContent = o.t;
      div.querySelector('.a').textContent = o.a;
      lista.appendChild(div);
    });

    render(null);
  }

  return { montar: montar, el: el };
})();
