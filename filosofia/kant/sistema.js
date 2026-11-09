(function(){
  var COR = { fundacao: '#727982', teorica: '#365775', pratica: '#7B2D3A', juizo: '#36705F', fecho: '#9A7419', direito: '#62507D' };
  var CAP = [
    ['0', 'Método e aparato', 'fundacao'], ['1', 'O problema crítico', 'fundacao'],
    ['2.1', 'Estética Transcendental', 'teorica'], ['2.2', 'Deduções metafísica e transcendental', 'teorica'], ['2.3', 'Esquematismo e princípios', 'teorica'], ['2.4', 'Fenômeno e númeno', 'teorica'],
    ['3.1', 'Ilusão transcendental e Paralogismos', 'teorica'], ['3.2', 'Antinomias', 'teorica'], ['3.3', 'O Ideal e o uso regulativo das ideias', 'teorica'], ['3.4', 'Doutrina do Método', 'teorica'],
    ['4.1', 'Fundamentação, Prefácio e Seções I e II', 'pratica'], ['4.2', 'Fundamentação, Seção III', 'pratica'], ['5.1', 'Crítica da Razão Prática, Analítica', 'pratica'], ['5.2', 'Crítica da Razão Prática, Dialética e Metodologia', 'pratica'],
    ['6.1', 'Crítica do Juízo: Introduções e Analítica do Belo', 'juizo'], ['6.2', 'Crítica do Juízo: Sublime, Dedução e Dialética estética', 'juizo'], ['6.3', 'Crítica do Juízo Teleológico', 'juizo'],
    ['7.1', 'Arquitetônica: a unidade do sistema', 'fecho'],
    ['7.2', 'Introdução à Metafísica dos Costumes', 'direito'], ['7.3', 'Introdução à Doutrina do Direito', 'direito'], ['7.4', 'Direito Privado I: o meu e o teu externo', 'direito'], ['7.5', 'Direito Privado II: aquisição originária e direito real', 'direito'], ['7.6', 'Direito Privado III: contrato, família e testamento', 'direito'], ['7.7', 'Direito Público I: a passagem ao Estado e os três poderes', 'direito'], ['7.8', 'Direito Público II: resistência, revolução e direito de punir', 'direito'], ['7.9', 'Direito Público III: direito das gentes e cosmopolita', 'direito']
  ];
  var BLOCOS = [
    ['fundacao', 'Fundação', 'Método e o problema crítico'], ['teorica', 'Razão teórica', 'Crítica da Razão Pura'], ['pratica', 'Razão prática', 'Fundamentação e Crítica da Razão Prática'],
    ['juizo', 'Juízo', 'Crítica da Faculdade de Julgar'], ['fecho', 'Fecho de abóbada', 'A liberdade e a unidade do sistema'], ['direito', 'Doutrina do Direito', 'Metafísica dos Costumes, parte I']
  ];
  var href = function(n){ return 'criticas/#cap-' + n; };
  var NS = 'http://www.w3.org/2000/svg';
  var SERIF = 'Spectral, Georgia, serif';
  var estado = { h: '7.1', q: [] };
  var pedras = {}, linhas = {};

  function el(tag, attrs, txt){
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (txt != null) e.textContent = txt;
    return e;
  }

  /* A planta: o portal. Geometria portada 1:1 do protótipo. */
  function arco(){
    var cx = 400, cy = 350, R = 260, r = 140;
    var svg = el('svg', { viewBox: '0 0 800 680', role: 'img', 'aria-label': 'Planta do sistema crítico: o portal' });
    var get = function(n){ return CAP.filter(function(c){ return c[0] === n; })[0]; };
    var stone = function(n, tag, p, tx, ty, fs){
      var c = get(n), a = el('a', { href: href(n), 'aria-label': n + ' ' + c[1], 'class': 'pedra' });
      p.fill = COR[c[2]];
      var s = el(tag, p);
      a.appendChild(s);
      a.appendChild(el('text', { x: tx, y: ty, 'text-anchor': 'middle', 'dominant-baseline': 'central', fill: '#F6F7F5', 'font-family': SERIF, 'font-size': fs || 17, 'font-weight': 600, 'pointer-events': 'none' }, n));
      a.addEventListener('mouseenter', function(){ foca(n); });
      a.addEventListener('focus', function(){ foca(n); });
      pedras[n] = s;
      return a;
    };
    var rect = function(n, x, y, w, h){ return stone(n, 'rect', { x: x + 1, y: y + 1, width: w - 2, height: h - 2, rx: 1 }, x + w / 2, y + h / 2); };
    var lab = function(x, y, t, a){ return el('text', { x: x, y: y, 'text-anchor': a || 'middle', fill: '#525C68', 'font-family': SERIF, 'font-style': 'italic', 'font-size': 16 }, t); };
    svg.appendChild(el('rect', { x: 140, y: 86, width: 520, height: 264, fill: '#E1E4DF' }));
    svg.appendChild(el('path', { d: 'M' + (cx - r) + ',' + cy + ' A' + r + ',' + r + ' 0 0,1 ' + (cx + r) + ',' + cy + ' V590 H' + (cx - r) + ' Z', fill: '#ECEEEB' }));
    var P = function(rad, a){ return (cx + rad * Math.cos(a)).toFixed(1) + ',' + (cy - rad * Math.sin(a)).toFixed(1); };
    var vs = ['3.1', '3.2', '3.3', '3.4', '7.1', '6.1', '6.2', '6.3'], w = [1, 1, 1, 1, 1.35, 4 / 3, 4 / 3, 4 / 3];
    var tot = w.reduce(function(a, b){ return a + b; });
    var a0 = Math.PI;
    vs.forEach(function(n, i){
      var a1 = a0 - Math.PI * w[i] / tot, m = (a0 + a1) / 2, rm = (R + r) / 2;
      svg.appendChild(stone(n, 'path', { d: 'M' + P(r, a0) + ' L' + P(R, a0) + ' A' + R + ',' + R + ' 0 0,1 ' + P(R, a1) + ' L' + P(r, a1) + ' A' + r + ',' + r + ' 0 0,0 ' + P(r, a0) + ' Z' }, cx + rm * Math.cos(m), cy - rm * Math.sin(m), n === '7.1' ? 20 : 17));
      a0 = a1;
    });
    ['2.1', '2.2', '2.3', '2.4'].forEach(function(n, i){ svg.appendChild(rect(n, 140, 530 - i * 60, 120, 60)); });
    ['4.1', '4.2', '5.1', '5.2'].forEach(function(n, i){ svg.appendChild(rect(n, 540, 530 - i * 60, 120, 60)); });
    CAP.filter(function(c){ return c[2] === 'direito'; }).forEach(function(c, i){ svg.appendChild(rect(c[0], 140 + i * 65, 34, 65, 52)); });
    svg.appendChild(rect('1', 110, 590, 580, 38));
    svg.appendChild(rect('0', 70, 628, 660, 40));
    [lab(400, 22, 'Doutrina do Direito'), lab(400, 402, 'a liberdade, fecho de abóbada'), lab(400, 426, 'do sistema da razão pura'),
     lab(125, 460, 'razão teórica', 'end'), lab(675, 460, 'razão prática', 'start'), lab(125, 250, 'Dialética', 'end'), lab(675, 250, 'Juízo', 'start')
    ].forEach(function(t){ svg.appendChild(t); });
    return svg;
  }

  function blocos(){
    var box = document.getElementById('blocos');
    BLOCOS.forEach(function(b){
      var div = document.createElement('div');
      div.style.setProperty('--c', COR[b[0]]);
      div.innerHTML = '<div class="topo"><h3></h3><div class="obra"></div></div>';
      div.querySelector('h3').textContent = b[1];
      div.querySelector('.obra').textContent = b[2];
      CAP.filter(function(x){ return x[2] === b[0]; }).forEach(function(x){
        var a = document.createElement('a');
        a.href = href(x[0]);
        a.innerHTML = '<span class="n"></span><span class="t"></span>';
        a.querySelector('.n').textContent = x[0];
        a.querySelector('.t').textContent = x[1];
        a.addEventListener('mouseenter', function(){ foca(x[0]); });
        a.addEventListener('focus', function(){ foca(x[0]); });
        linhas[x[0]] = a;
        div.appendChild(a);
      });
      box.appendChild(div);
    });
  }

  function foca(n){
    estado.h = n;
    var i = Math.max(0, CAP.findIndex(function(c){ return c[0] === n; })), c = CAP[i];
    var bloco = BLOCOS.filter(function(b){ return b[0] === c[2]; })[0];
    var aside = document.getElementById('foco');
    aside.style.setProperty('--c', COR[c[2]]);
    document.getElementById('f-bloco').textContent = bloco[1];
    document.getElementById('f-n').textContent = c[0];
    document.getElementById('f-t').textContent = c[1];
    document.getElementById('f-q').textContent = estado.q[i] || '';
    document.getElementById('f-a').href = href(c[0]);
    Object.keys(pedras).forEach(function(k){
      var on = k === n, s = pedras[k];
      s.setAttribute('fill-opacity', on ? 1 : 0.88);
      s.setAttribute('stroke', on ? '#1D2632' : '#ECEEEB');
      s.setAttribute('stroke-width', on ? 2.5 : 2);
    });
    Object.keys(linhas).forEach(function(k){ linhas[k].classList.toggle('on', k === n); });
  }

  document.getElementById('arco').appendChild(arco());
  blocos();
  foca(estado.h);
  fetch('kant-perguntas.json').then(function(r){ return r.json(); }).then(function(q){ estado.q = q; foca(estado.h); }).catch(function(){});
})();
