(function(){
  var A = '#76601F', SERIF = 'Alegreya, Georgia, serif', SANS = 'Alegreya Sans, sans-serif';
  var PARTES = [
    { n: 'Livro I', k: 'I', t: 'Do entendimento', meta: 'Tratado, 1739', d: 'Impressões e ideias; associação; a causalidade como hábito; o ceticismo sobre os sentidos e a identidade pessoal.' },
    { n: 'Livro II', k: 'II', t: 'Das paixões', meta: 'Tratado, 1739', d: 'Orgulho e humildade, amor e ódio; a vontade; a razão como escrava das paixões.' },
    { n: 'Livro III', k: 'III', t: 'Da moral', meta: 'Tratado, 1740', d: 'A distinção moral vem do sentimento; virtudes naturais e artificiais; justiça, propriedade e governo.' },
    { n: 'Investigações', k: 'Inv', t: 'A reescrita', meta: '1748 e 1751', d: 'O entendimento e os princípios da moral retomados em forma breve.' }
  ];

  function figura(h, el){
    var svg = el('svg', { viewBox: '0 0 640 540', role: 'img', 'aria-label': 'Esquema do Tratado' });
    var add = function(e){ if (e) svg.appendChild(e); };
    var T = function(x, y, t, o){ o = o || {}; return el('text', { x: x, y: y, 'font-family': o.f || SERIF, 'font-size': o.s || 16, 'font-weight': o.w || 400, 'font-style': o.i || 'normal', fill: o.c || '#1D2330', 'text-anchor': o.a || 'middle' }, t); };
    var L = function(d, o){ o = o || {}; return el('path', { d: d, fill: 'none', stroke: o.c || A, 'stroke-width': o.w || 2, 'stroke-dasharray': o.dash || 'none' }); };
    var N = function(x, y, w, t, sub, on){
      add(el('rect', { x: x - w / 2, y: y - 24, width: w, height: 48, fill: on ? A : '#F7F6F2', stroke: A, 'stroke-width': 2, rx: 24 }));
      add(T(x, y + (sub ? -1 : 6), t, { s: 17, w: 700, c: on ? '#fff' : '#1D2330' }));
      if (sub) add(T(x, y + 16, sub, { f: SANS, s: 12, c: on ? '#fff' : '#5B6270' }));
    };
    var i1 = h === 'I', i2 = h === 'II', i3 = h === 'III';
    add(L('M320,74 V100 M320,100 H180 V126 M320,100 H460 V126'));
    add(L('M180,174 C180,200 320,200 320,226 M460,174 C460,200 320,200 320,226', { w: 1.5, dash: '4 3' }));
    add(T(320, 196, 'cópia', { i: 'italic', s: 14, c: '#5B6270' }));
    add(L('M320,274 V300 M320,300 H170 V326 M320,300 H470 V326'));
    add(L('M320,24 V50 M320,74 V100 H460 V226 M460,226 H320 V300 H470 V440', { c: '#9A3A2C', w: 1.75, dash: '2 5' }));
    N(320, 50, 180, 'Percepções', null, false);
    N(180, 150, 180, 'Impressões', 'fortes e vivas', i2 || i3);
    N(460, 150, 180, 'Ideias', 'cópias enfraquecidas', i1);
    N(320, 250, 220, 'Princípio da cópia', null, i1);
    N(170, 350, 220, 'Relações de ideias', 'demonstração · a priori', i1);
    N(470, 350, 220, 'Questões de fato', 'causalidade · hábito', i1);
    add(L('M470,374 V420 M180,420 H470', { w: 1.5 }));
    [['I', 'Entendimento', 120], ['II', 'Paixões', 320], ['III', 'Moral', 520]].forEach(function(b){
      var k = b[0], t = b[1], x = b[2], on = h === k;
      add(L('M' + x + ',420 V446', { w: 1.5 }));
      add(el('rect', { x: x - 80, y: 446, width: 160, height: 60, fill: on ? A : 'none', stroke: A, 'stroke-width': 2, rx: 1.5 }));
      add(T(x, 472, 'Livro ' + k, { f: SANS, s: 12, w: 700, c: on ? '#fff' : A }));
      add(T(x, 494, t, { s: 18, w: 700, c: on ? '#fff' : '#1D2330' }));
    });
    add(L('M120,420 H180', { w: 1.5 }));
    add(T(320, 532, 'a ciência do homem, capital das ciências', { i: 'italic', s: 15, c: '#5B6270' }));
    return svg;
  }

  Filosofo.montar({
    partes: PARTES, chave: 'k', figura: figura,
    obras: [{ t: 'Ensaios morais, políticos e literários', a: '1741–1777' }, { t: 'História natural da religião', a: '1757' }, { t: 'História da Inglaterra', a: '1754–1762' }, { t: 'Diálogos sobre a religião natural', a: '1779, póstumo' }]
  });
})();
