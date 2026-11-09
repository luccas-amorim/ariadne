(function(){
  var A = '#4E6B3A', SERIF = 'Alegreya, Georgia, serif', SANS = 'Alegreya Sans, sans-serif';
  var PARTES = [
    { n: 'Discurso', k: 'D', t: 'Sobre a origem da desigualdade', d: 'O homem natural, a piedade e a perfectibilidade; a propriedade e o falso contrato dos ricos.' },
    { n: 'Contrato, I', k: 'I', t: 'O pacto social', d: 'Os ferros; a crítica do direito do mais forte e da escravidão; o pacto e a liberdade civil.' },
    { n: 'Contrato, II', k: 'II', t: 'Soberania e lei', d: 'Vontade geral e vontade de todos; a lei como ato geral; o legislador.' },
    { n: 'Contrato, III', k: 'III', t: 'O governo', d: 'O governo como corpo intermediário; formas de governo; a tendência a degenerar.' },
    { n: 'Contrato, IV', k: 'IV', t: 'Instituições', d: 'O sufrágio, as instituições romanas, a ditadura, a censura e a religião civil.' }
  ];
  var EST = [
    ['natureza', 'Estado de natureza', 60, 90, 'D'], ['perf', 'Perfectibilidade', 150, 170, 'D'], ['prop', 'Propriedade', 230, 270, 'D'], ['des', 'Desigualdade', 300, 350, 'D'],
    ['ferros', 'Os ferros', 320, 410, 'I'], ['pacto', 'O pacto', 400, 330, 'I'], ['vg', 'Vontade geral', 470, 250, 'II'], ['gov', 'Governo', 530, 180, 'III'], ['lib', 'Liberdade civil', 590, 100, 'IV']
  ];

  function figura(h, el){
    var svg = el('svg', { viewBox: '0 0 640 490', role: 'img', 'aria-label': 'Esquema: da natureza aos ferros, dos ferros à liberdade civil' });
    var add = function(e){ svg.appendChild(e); };
    var T = function(x, y, t, o){ o = o || {}; return el('text', { x: x, y: y, 'font-family': o.f || SERIF, 'font-size': o.s || 16, 'font-weight': o.w || 400, 'font-style': o.i || 'normal', fill: o.c || '#1D2330', 'text-anchor': o.a || 'middle' }, t); };
    var d = 'M' + EST[0][2] + ',' + EST[0][3];
    for (var i = 1; i < EST.length; i++) { var p = EST[i - 1], q = EST[i], mx = (p[2] + q[2]) / 2; d += ' C' + mx + ',' + p[3] + ' ' + mx + ',' + q[3] + ' ' + q[2] + ',' + q[3]; }
    add(el('path', { d: d, fill: 'none', stroke: '#9A3A2C', 'stroke-width': 1.75, 'stroke-dasharray': '2 5' }));
    add(el('path', { d: 'M20,410 H620', stroke: '#C9CDD4', 'stroke-width': 1 }));
    add(el('path', { d: 'M20,90 H620', stroke: '#C9CDD4', 'stroke-width': 1 }));
    add(T(330, 82, 'liberdade', { a: 'middle', f: SANS, s: 12, c: '#5B6270' }));
    add(T(28, 430, 'servidão', { a: 'start', f: SANS, s: 12, c: '#5B6270' }));
    EST.forEach(function(e, i){
      var k = e[0], t = e[1], x = e[2], y = e[3], g = e[4];
      var on = h === g, r = k === 'ferros' ? 10 : 8;
      add(el('circle', { cx: x, cy: y, r: r, fill: on ? A : '#F7F8F4', stroke: A, 'stroke-width': 2 }));
      var pos = i === 0 ? [x, y - 16, 'middle'] : i === 4 ? [x, y + 30, 'middle'] : (i < 4 || i === 8) ? [x - 14, y + 5, 'end'] : [x + 14, y + 5, 'start'];
      add(T(pos[0], pos[1], t, { a: pos[2], s: 15.5, w: 700, c: on ? A : '#1D2330' }));
    });
    add(T(165, 470, 'Discurso sobre a desigualdade', { i: 'italic', s: 15, c: '#5B6270' }));
    add(T(495, 470, 'Do contrato social', { i: 'italic', s: 15, c: '#5B6270' }));
    add(el('path', { d: 'M330,452 V478', stroke: '#C9CDD4', 'stroke-width': 1 }));
    return svg;
  }

  Filosofo.montar({
    partes: PARTES, chave: 'k', figura: figura,
    obras: [{ t: 'Discurso sobre as ciências e as artes', a: '1750' }, { t: 'Discurso sobre a economia política', a: '1755' }, { t: 'Emílio, ou Da educação', a: '1762' }, { t: 'Considerações sobre o governo da Polônia', a: '1772' }]
  });
})();
