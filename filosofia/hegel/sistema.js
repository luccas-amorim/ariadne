(function(){
  var C = { por: '#5B6270', ser: '#93641C', ess: '#2C5A84', con: '#8A2E3B', fen: '#4F6B4A' };
  var SERIF = 'Alegreya, Georgia, serif', SANS = 'Alegreya Sans, sans-serif';
  var LOG = ['Prefácios e Introdução','Ser, nada, devir','O Dasein','O ser-para-si','Quantidade e quantum','O infinito quantitativo e a relação quantitativa','A medida','A aparência e a reflexão','As determinações de reflexão','O fundamento','O fenômeno','A efetividade','O conceito','O juízo','O silogismo','A objetividade','A ideia: vida e conhecimento','A ideia absoluta','Leituras contemporâneas e a ponte com a Filosofia do Direito'];
  var DIR = ['Prefácio e contexto','O conceito de direito e a ciência filosófica do direito','A vontade','O direito como existência da liberdade','Pessoa e propriedade I','Propriedade II','Contrato','O ilícito e o crime','A pena','Propósito, responsabilidade, intenção e bem-estar','O bem e a consciência moral','O conceito de eticidade','A família','Sociedade civil I: princípios e sistema das necessidades','Sociedade civil II: administração da justiça','Sociedade civil III: polícia e corporação','O conceito de Estado','Constituição interna I: poderes, soberania e burocracia','Constituição interna II: legislativo, opinião pública, soberania externa e guerra','Direito internacional e história mundial','A recepção'];
  var FEN = ['Prefácio e Introdução','Certeza sensível','Percepção','Força e entendimento','Autoconsciência: senhorio e servidão','Razão','Espírito','Religião','Saber absoluto'];
  var OBRAS = [
    { id: 'fen', titulo: 'Fenomenologia do Espírito', ano: '1807', estado: 'textos a vir', figura: 'A escada da consciência', c: C.fen },
    { id: 'log', titulo: 'Ciência da Lógica', ano: '1812–1816', estado: '19 sessões', figura: 'Círculo de círculos', c: C.con },
    { id: 'dir', titulo: 'Filosofia do Direito', ano: '1820', estado: '21 sessões', figura: 'Os degraus da liberdade', c: C.ser }
  ];
  var NS = 'http://www.w3.org/2000/svg';
  var estado = { obra: 'log', h: null, titles: LOG };
  var nosEl = {}, linhasEl = {};

  function node(n, x, y, c, href, titles, pend){
    return { n: n, x: x, y: y, ny: y + 4, r: 15, c: c, href: href, label: 'Sessão ' + n + ': ' + titles[n], dash: pend ? '3 3' : 'none' };
  }

  function logica(){
    var cx = 332, cy = 300, R = 210, href = function(n){ return 'logica/#s-' + n; };
    var L = [['ser', 'Ser', 'Livro I', [1, 2, 3, 4, 5, 6]], ['ess', 'Essência', 'Livro II', [7, 8, 9, 10, 11]], ['con', 'Conceito', 'Livro III', [12, 13, 14, 15, 16, 17]]];
    var ang = [-30, 90, 210].map(function(a){ return a * Math.PI / 180; });
    var guias = [{ d: 'M' + (cx - R) + ',' + cy + ' a' + R + ',' + R + ' 0 1,0 ' + (2 * R) + ',0 a' + R + ',' + R + ' 0 1,0 ' + (-2 * R) + ',0', c: '#9A3A2C', w: 1.75, dash: '2 5' }];
    var rotulos = [], nos = [];
    L.forEach(function(l, i){
      var g = l[0], nome = l[1], livro = l[2], ns = l[3];
      var x = cx + R * Math.cos(ang[i]), y = cy + R * Math.sin(ang[i]);
      guias.push({ d: 'M' + (x - 96) + ',' + y + ' a96,96 0 1,0 192,0 a96,96 0 1,0 -192,0', c: C[g], w: 2.5, dash: 'none' });
      rotulos.push({ x: x, y: y + 4, a: 'middle', f: SERIF, s: 22, w: 700, i: 'normal', c: C[g], t: nome }, { x: x, y: y + 22, a: 'middle', f: SANS, s: 12.5, w: 400, i: 'normal', c: '#5B6270', t: livro });
      var start = ang[i] + Math.PI + 0.55, span = 2 * Math.PI - 1.1;
      ns.forEach(function(n, j){ var a = start + span * (j + .5) / ns.length; nos.push(node(n, x + 96 * Math.cos(a), y + 96 * Math.sin(a), C[g], href(n), LOG)); });
    });
    [[0, -82], [18, -98]].forEach(function(p){ var a = p[1] * Math.PI / 180; nos.push(node(p[0], cx + R * Math.cos(a), cy + R * Math.sin(a), C.por, href(p[0]), LOG)); });
    rotulos.push({ x: cx, y: cy - 6, a: 'middle', f: SERIF, s: 17, w: 400, i: 'italic', c: '#1D2330', t: 'o fim retorna' }, { x: cx, y: cy + 16, a: 'middle', f: SERIF, s: 17, w: 400, i: 'italic', c: '#1D2330', t: 'ao começo' });
    var grupos = [['Pórtico', '', 'por', [0]], ['Ser', 'Livro I · Qualidade, quantidade, medida', 'ser', [1, 2, 3, 4, 5, 6]], ['Essência', 'Livro II · Reflexão, fenômeno, efetividade', 'ess', [7, 8, 9, 10, 11]], ['Conceito', 'Livro III · Subjetividade, objetividade, ideia', 'con', [12, 13, 14, 15, 16, 17]], ['Fecho', '', 'por', [18]]];
    return { guias: guias, rotulos: rotulos, nos: nos, grupos: grupos, href: href, titles: LOG, nota: 'Hegel, Enciclopédia § 15' };
  }

  function direito(){
    var href = function(n){ return 'direito/#s-' + n; };
    var steps = [
      { g: 'por', x: 20, w: 120, top: 500, ns: [0, 1, 2, 3], nome: 'Introdução', sub: '§§ 1–33' },
      { g: 'ser', x: 150, w: 140, top: 420, ns: [4, 5, 6, 7, 8], nome: 'Direito abstrato', sub: 'Parte I' },
      { g: 'ess', x: 300, w: 100, top: 340, ns: [9, 10], nome: 'Moralidade', sub: 'Parte II' },
      { g: 'con', x: 410, w: 234, top: 260, ns: [11], nome: 'Eticidade', sub: 'Parte III' }
    ];
    var guias = [], rotulos = [], nos = [];
    steps.forEach(function(s){
      guias.push({ d: 'M' + s.x + ',580 V' + s.top + ' H' + (s.x + s.w) + ' V580', c: C[s.g], w: 2.5, dash: 'none' });
      rotulos.push({ x: s.x + 8, y: s.top + 24, a: 'start', f: SERIF, s: 18, w: 700, i: 'normal', c: C[s.g], t: s.nome }, { x: s.x + 8, y: s.top + 42, a: 'start', f: SANS, s: 12, w: 400, i: 'normal', c: '#5B6270', t: s.sub });
      var cols = s.ns.length > 2 ? 2 : s.ns.length;
      s.ns.forEach(function(n, j){
        var cx = s.g === 'con' ? s.x + 140 : s.x + (s.w / (cols + 1)) * ((j % cols) + 1);
        var cy = s.g === 'con' ? s.top + 30 : s.top + 80 + Math.floor(j / cols) * 40;
        nos.push(node(n, cx, cy, C[s.g], href(n), DIR));
      });
    });
    var sub = [{ x: 420, w: 60, top: 470, nome: 'Família', ns: [12] }, { x: 486, w: 70, top: 390, nome: 'Soc. civil', ns: [13, 14, 15] }, { x: 562, w: 76, top: 320, nome: 'Estado', ns: [16, 17, 18, 19] }];
    sub.forEach(function(s){
      guias.push({ d: 'M' + s.x + ',580 V' + s.top + ' H' + (s.x + s.w) + ' V580', c: C.con, w: 1.25, dash: 'none' });
      rotulos.push({ x: s.x + s.w / 2, y: s.top - 8, a: 'middle', f: SANS, s: 12, w: 700, i: 'normal', c: C.con, t: s.nome });
      s.ns.forEach(function(n, j){ nos.push(node(n, s.x + s.w / 2, s.top + 26 + j * 36, C.con, href(n), DIR)); });
    });
    guias.push({ d: 'M20,592 H644', c: '#1D2330', w: 1, dash: 'none' });
    guias.push({ d: 'M80,470 C 200,380 300,300 420,230 S 600,140 630,120', c: '#9A3A2C', w: 1.75, dash: '2 5' });
    nos.push(node(20, 630, 120, C.por, href(20), DIR));
    rotulos.push({ x: 300, y: 150, a: 'middle', f: SERIF, s: 17, w: 400, i: 'italic', c: '#1D2330', t: 'a vontade livre que quer a vontade livre' }, { x: 600, y: 98, a: 'end', f: SANS, s: 12, w: 400, i: 'normal', c: '#5B6270', t: 'recepção' });
    var grupos = [['Introdução', 'Prefácio e §§ 1–33', 'por', [0, 1, 2, 3]], ['Direito abstrato', 'Parte I · §§ 34–104', 'ser', [4, 5, 6, 7, 8]], ['Moralidade', 'Parte II · §§ 105–141', 'ess', [9, 10]], ['Eticidade', 'Parte III · §§ 142–360', 'con', [11, 12, 13, 14, 15, 16, 17, 18, 19]], ['Fecho', '', 'por', [20]]];
    return { guias: guias, rotulos: rotulos, nos: nos, grupos: grupos, href: href, titles: DIR, nota: 'Cada degrau suprassume o anterior' };
  }

  function fenomenologia(){
    var href = function(){ return '#fen'; };
    var pts = [[60, 540], [130, 500], [200, 460], [270, 420], [350, 360], [430, 300], [510, 230], [580, 160], [620, 80]];
    var grp = [0, 1, 1, 1, 2, 3, 4, 5, 6];
    var nomes = ['Pórtico', 'Consciência', 'Consciência', 'Consciência', 'Autoconsciência', 'Razão', 'Espírito', 'Religião', 'Saber absoluto'];
    var guias = [{ d: 'M' + pts.map(function(p){ return p.join(','); }).join(' L'), c: '#9A3A2C', w: 1.75, dash: '2 5' }];
    var rotulos = [], nos = [];
    pts.forEach(function(p, n){
      var x = p[0], y = p[1];
      nos.push(node(n, x, y, C.fen, href(n), FEN, true));
      if (n === 0 || grp[n] !== grp[n - 1]) rotulos.push({ x: x - 22, y: y + 5, a: 'end', f: SERIF, s: 17, w: 700, i: 'normal', c: C.fen, t: nomes[n] });
    });
    rotulos.push({ x: 330, y: 560, a: 'middle', f: SERIF, s: 17, w: 400, i: 'italic', c: '#1D2330', t: 'o caminho do desespero' });
    var grupos = [['Pórtico', '', 'fen', [0]], ['Consciência', 'A · caps. I–III', 'fen', [1, 2, 3]], ['Autoconsciência', 'B · cap. IV', 'fen', [4]], ['Razão, Espírito, Religião', 'C · caps. V–VII', 'fen', [5, 6, 7]], ['Saber absoluto', 'cap. VIII', 'fen', [8]]];
    return { guias: guias, rotulos: rotulos, nos: nos, grupos: grupos, href: href, titles: FEN, pend: true, nota: 'Textos a vir' };
  }

  function el(tag, attrs, txt){
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (txt != null) e.textContent = txt;
    return e;
  }

  function hov(n){
    estado.h = n;
    Object.keys(nosEl).forEach(function(k){
      var on = String(n) === k, d = nosEl[k];
      d.circle.setAttribute('fill', on ? d.c : '#F5F6F7');
      d.text.setAttribute('fill', on ? '#fff' : d.c);
    });
    Object.keys(linhasEl).forEach(function(k){ linhasEl[k].classList.toggle('on', String(n) === k); });
    document.getElementById('l-k').textContent = n == null ? 'Passe o cursor numa sessão' : 'Sessão ' + n;
    document.getElementById('l-t').textContent = n == null ? '' : estado.titles[n];
  }
  function off(){ hov(null); }

  function render(){
    var obra = estado.obra;
    var v = obra === 'dir' ? direito() : obra === 'fen' ? fenomenologia() : logica();
    var o = OBRAS.filter(function(x){ return x.id === obra; })[0] || OBRAS[1];
    estado.titles = v.titles;
    nosEl = {}; linhasEl = {};

    Array.prototype.forEach.call(document.querySelectorAll('#obras button'), function(b){
      var sel = b.dataset.id === obra;
      b.setAttribute('aria-selected', sel ? 'true' : 'false');
      b.tabIndex = sel ? 0 : -1;
    });
    document.getElementById('e-fig').textContent = 'Esquema · ' + o.figura;
    document.getElementById('e-nota').textContent = v.nota;

    var svg = el('svg', { viewBox: '0 0 664 600', role: 'img', 'aria-label': 'Esquema da obra' });
    v.guias.forEach(function(g){ svg.appendChild(el('path', { d: g.d, fill: 'none', stroke: g.c, 'stroke-width': g.w, 'stroke-dasharray': g.dash })); });
    v.rotulos.forEach(function(r){ svg.appendChild(el('text', { x: r.x, y: r.y, 'text-anchor': r.a, 'font-family': r.f, 'font-size': r.s, 'font-weight': r.w, 'font-style': r.i, fill: r.c }, r.t)); });
    v.nos.forEach(function(d){
      var a = el('a', { href: d.href, 'aria-label': d.label });
      var circle = el('circle', { cx: d.x, cy: d.y, r: d.r, fill: '#F5F6F7', stroke: d.c, 'stroke-width': 2, 'stroke-dasharray': d.dash });
      var text = el('text', { x: d.x, y: d.ny, 'text-anchor': 'middle', 'font-family': SANS, 'font-size': 12, 'font-weight': 700, fill: d.c, 'pointer-events': 'none' }, String(d.n));
      a.appendChild(circle); a.appendChild(text);
      a.addEventListener('mouseenter', function(){ hov(d.n); });
      a.addEventListener('mouseleave', off);
      a.addEventListener('focus', function(){ hov(d.n); });
      a.addEventListener('blur', off);
      nosEl[d.n] = { circle: circle, text: text, c: d.c };
      svg.appendChild(a);
    });
    var fig = document.getElementById('figura');
    fig.textContent = '';
    fig.appendChild(svg);

    var box = document.getElementById('grupos');
    box.textContent = '';
    v.grupos.forEach(function(gr){
      var div = document.createElement('div');
      div.style.setProperty('--c', C[gr[2]]);
      div.innerHTML = '<div class="topo"><h3></h3><span class="sub"></span></div>';
      div.querySelector('h3').textContent = gr[0];
      div.querySelector('.sub').textContent = gr[1];
      gr[3].forEach(function(n){
        var a = document.createElement('a');
        a.href = v.href(n);
        a.style.setProperty('--cor', v.pend ? '#5B6270' : '#1D2330');
        a.innerHTML = '<span class="n"></span><span class="t"></span>';
        a.querySelector('.n').textContent = n;
        a.querySelector('.t').textContent = v.titles[n];
        a.addEventListener('mouseenter', function(){ hov(n); });
        a.addEventListener('mouseleave', off);
        a.addEventListener('focus', function(){ hov(n); });
        a.addEventListener('blur', off);
        linhasEl[n] = a;
        div.appendChild(a);
      });
      box.appendChild(div);
    });
    hov(null);
  }

  function pick(id){
    if (history.replaceState) history.replaceState(null, '', '#' + id);
    estado.obra = id; estado.h = null;
    render();
  }

  var obras = document.getElementById('obras');
  OBRAS.forEach(function(o, i){
    var b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-controls', 'painel');
    b.dataset.id = o.id;
    b.style.setProperty('--c', o.c);
    b.innerHTML = '<span class="k"></span><span class="t"></span><span class="f"></span>';
    b.querySelector('.k').textContent = o.ano + ' · ' + o.estado;
    b.querySelector('.t').textContent = o.titulo;
    b.querySelector('.f').textContent = o.figura;
    b.addEventListener('click', function(){ pick(o.id); });
    b.addEventListener('keydown', function(e){
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      var nx = OBRAS[(i + d + OBRAS.length) % OBRAS.length].id;
      pick(nx);
      obras.querySelector('[data-id="' + nx + '"]').focus();
    });
    obras.appendChild(b);
  });

  function doHash(){
    var id = location.hash.slice(1);
    estado.obra = OBRAS.some(function(o){ return o.id === id; }) ? id : 'log';
    render();
  }
  window.addEventListener('hashchange', doHash);
  doHash();
})();
