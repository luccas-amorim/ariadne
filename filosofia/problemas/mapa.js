/* ==========================================================
   PREPARO DOS DADOS
   ========================================================== */
const escH = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const md = s => escH(s).replace(/\*(.+?)\*/g, '<em>$1</em>');
const mdSvg = s => escH(s).replace(/\*(.+?)\*/g, '<tspan font-style="italic">$1</tspan>');
const semMd = s => String(s).replace(/\*/g, '');
const semAcento = s => s.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
const { autores, anoTxt } = CatalogoFilosofico;
const AUT = Object.fromEntries(autores.map(autor => [autor.id, autor]));
const SUB = {}; SUBPROBLEMAS.forEach(s => { SUB[s.id] = s; });
const PROB = {}; PROBLEMAS.forEach(p => { PROB[p.id] = p; });
const POS = {}, RECEB = {};
POSICOES.forEach(p => {
  POS[p.id] = p;
  p.aut = AUT[p.autor] || {id: p.autor, nome: p.autor, dt: '', per: null};
  p.anoTxt = (p.aprox ? 'c. ' : '') + anoTxt(p.ano);
  p.probs = [...new Set(p.subproblemas.filter(s => SUB[s]).map(s => SUB[s].problema))];
  p.casas = p.probs.map(pr => casa(p, pr));
  p.busca = semAcento([p.aut.nome, p.autor, semMd(p.obra), semMd(p.tese)].join(' '));
});
POSICOES.forEach(p => p.relacoes.forEach(([t, a]) => { if (POS[a]) (RECEB[a] = RECEB[a] || []).push([t, p.id]); }));

/* cor de cada problema (matiz e saturação, como as famílias da linha do tempo) */
const COR_PROB = {mal:{h:14,s:52}, mente:{h:280,s:40}, liberdade:{h:205,s:50}, ser_pensar:{h:40,s:52}};
PROBLEMAS.forEach((p, i) => { if (!COR_PROB[p.id]) COR_PROB[p.id] = {h:(i * 67) % 360, s:45}; });

const ROT_IDA = {responde:'Responde a', objeta:'Objeta a', radicaliza:'Radicaliza', reformula:'Reformula', sintetiza:'Sintetiza'};
const ROT_VOLTA = {responde:'Recebe resposta de', objeta:'Recebe objeção de', radicaliza:'É radicalizada por', reformula:'É reformulada por', sintetiza:'É sintetizada por'};
const VERBO = {responde:'responde a', objeta:'objeta a', radicaliza:'radicaliza', reformula:'reformula', sintetiza:'sintetiza'};

/* ==========================================================
   ESTADO E UTILITÁRIOS
   ========================================================== */
const $ = s => document.querySelector(s);
const palco = $('.palco'), rol = $('#rolagem'), eixo = $('#eixo'), mapa = $('#mapa'), ficha = $('#ficha'), dica = $('#dica');
const estado = {prob: PROBLEMAS[0].id, comp: null, zoom: 1, sel: null, hover: null, achados: new Set()};
const G = {Z:1, O:0, s:1, LW:232, W:0, Wc:0, H:0, vset:new Set(), aset:new Set(), pontes:new Set(), inst:[], noAut:new Map(), arestas:[], nosEl:[], arEl:[]};
const MARG = 36, ROW = 37, NH = 33, NH1 = 22, HEAD = 12, PADB = 11, GH = 42, GAPG = 22, EIXO_H = 70;
const F_NOME = '500 13px Spectral, Georgia, serif', F_ANO = '400 10.5px Spectral, Georgia, serif', F_PERG = '400 11.5px Spectral, Georgia, serif', F_ALIAS = '400 12px Spectral, Georgia, serif';
const _cv = document.createElement('canvas').getContext('2d'); const _cw = new Map();
function medir(t, f){ const k = f + '|' + t; if (!_cw.has(k)) { _cv.font = f; _cw.set(k, _cv.measureText(t).width); } return _cw.get(k); }
function quebrar(t, f, larg){
  const linhas = []; let l = '';
  t.split(' ').forEach(p => { const c = l ? l + ' ' + p : p; if (l && medir(c, f) > larg) { linhas.push(l); l = p; } else l = c; });
  if (l) linhas.push(l);
  return linhas;
}
/* título curto da obra: o primeiro título em itálico, se a obra começa por ele;
   senão, o texto até a primeira vírgula, sem itálico. Títulos longos são
   cortados na última palavra que cabe, com reticências. */
const F_OBRA = 'italic 400 13px Spectral, Georgia, serif', F_OBRA_R = '400 13px Spectral, Georgia, serif', F_SEP = '400 11px Spectral, Georgia, serif', F_ETQ = '500 9.5px Spectral, Georgia, serif';
const OBRA_MAX = 245;
function obraCurta(o){
  const m = /^\*(.+?)\*/.exec(o);
  const it = !!m, f = it ? F_OBRA : F_OBRA_R;
  let t = it ? m[1] : semMd(o.split(',')[0]).trim();
  if (medir(t, f) > OBRA_MAX){
    const ps = t.split(' '); let c = '';
    for (const p of ps){ const n = c ? c + ' ' + p : p; if (medir(n + '…', f) > OBRA_MAX) break; c = n; }
    // não termina em artigo, preposição ou conjunção
    const vazias = /\s(a|o|as|os|à|às|ao|aos|de|da|do|das|dos|em|na|no|e|pela|pelo|para|com|of|the|and|to|a|an)$/i;
    while (vazias.test(c)) c = c.replace(vazias, '');
    t = c.replace(/[,;:]$/, '') + '…';
  }
  return {t, it, f};
}
/* faixa em que a posição fica num problema: o primeiro subproblema dela que pertence a ele */
function casa(p, pr){ return p.subproblemas.find(s => SUB[s] && SUB[s].problema === pr); }
/* medidas do nó de um autor numa faixa. Uma linha por posição, em ordem de ano:
   a primeira é "Autor · obra · ano", as seguintes "obra · ano". Embaixo, etiquetas
   dos outros subproblemas dessas posições, quebradas em mais de uma fila se preciso. */
const LH = 17, ETQ_H = 14;
const ORD_SUB = {}; SUBPROBLEMAS.forEach((s, i) => { ORD_SUB[s.id] = i; });
function medidasAutor(ps, sid){
  const sep = medir(' · ', F_SEP);
  // se o mesmo título se repete no nó, cada linha mostra também a parte da obra ("Introdução", "livro I")
  const cont = {};
  ps.forEach(p => { const oc = p.curta || (p.curta = obraCurta(p.obra)); cont[oc.t] = (cont[oc.t] || 0) + 1; });
  const linhas = ps.map(p => ({oc: p.curta, loc: cont[p.curta.t] > 1 && p.curta.it ? semMd(p.obra.replace(/^\*.+?\*/, '')).replace(/^,\s*/, '').trim() : ''}));
  let wl = 0;
  linhas.forEach((l, i) => {
    wl = Math.max(wl, (i ? 0 : medir(ps[0].aut.nome, F_NOME) + sep) + medir(l.oc.t, l.oc.f) + (l.loc ? medir(', ' + l.loc, F_OBRA_R) : 0) + sep + medir(ps[i].anoTxt, F_SEP));
  });
  const subs = [...new Set(ps.flatMap(p => p.subproblemas))].filter(s => SUB[s] && s !== sid).sort((a, b) => ORD_SUB[a] - ORD_SUB[b]);
  const larg = Math.max(wl, 180), etqs = [];
  let dx = 0, ln = 0;
  subs.forEach(s => {
    const w = medir(SUB[s].nome, F_ETQ) + 10;
    if (dx && dx + w > larg){ ln++; dx = 0; }
    etqs.push({s, w, dx, ln}); dx += w + 4;
  });
  const we = etqs.reduce((m, e) => Math.max(m, e.dx + e.w), 0);
  const filas = etqs.length ? ln + 1 : 0;
  return {w: Math.max(wl, we), h: 21 + (ps.length - 1) * LH + filas * ETQ_H, etqs, linhas};
}
function escuro(){ const t = document.documentElement.getAttribute('data-theme'); return t === 'dark' || (t !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches); }
function paleta(h, s){
  return escuro()
    ? {fundo:`hsl(${h} ${s*.34}% 18%)`, borda:`hsl(${h} ${s*.4}% 30%)`, texto:`hsl(${h} ${Math.min(80,s*.9)}% 76%)`, ponto:`hsl(${h} ${Math.min(80,s*1.1)}% 64%)`}
    : {fundo:`hsl(${h} ${s*.55}% 92.5%)`, borda:`hsl(${h} ${s*.45}% 79%)`, texto:`hsl(${h} ${Math.min(85,s*1.1)}% 29%)`, ponto:`hsl(${h} ${Math.min(85,s*1.15)}% 41%)`};
}
const corProb = id => paleta(COR_PROB[id].h, COR_PROB[id].s);
const ativos = () => [estado.prob, estado.comp].filter(Boolean);
const visiveis = () => POSICOES.filter(p => p.probs.some(pr => ativos().includes(pr)));

function centroAtual(cx, cy){
  if (cx == null) cx = rol.clientWidth / 2;
  if (cy == null) cy = rol.clientHeight / 2;
  const c = ((rol.scrollLeft + cx) / G.s - G.LW - MARG) / G.Z + G.O;
  return {ano: anoDe(c), frac: G.H ? (rol.scrollTop + cy - EIXO_H) / (G.H * G.s) : 0, cx, cy};
}

/* ==========================================================
   DISPOSIÇÃO E DESENHO
   ========================================================== */
/* a aresta sai da linha da posição de origem e chega à linha da posição de destino */
function caminho(na, nb, ya, yb){
  const xs = na.x0, xt = nb.x1;
  if (xs - xt > 24){ const dx = Math.min(150, (xs - xt) * .5); return `M${xs},${ya} C${xs - dx},${ya} ${xt + dx},${yb} ${xt},${yb}`; }
  // nós quase no mesmo ano: na mesma linha, laço por baixo; em linhas diferentes, colchete pela esquerda
  if (Math.abs(na.y - nb.y) < 1){ const sx = na.x + 2, tx = nb.x + 2, ys = na.y + na.h, yt = nb.y + nb.h, yy = Math.max(ys, yt); return `M${sx},${ys} C${sx},${yy + 24} ${tx},${yy + 24} ${tx},${yt}`; }
  const b = Math.min(na.x0, nb.x0) - 16 - Math.min(40, Math.abs(ya - yb) * .12);
  return `M${na.x0},${ya} C${b},${ya} ${b},${yb} ${nb.x0},${yb}`;
}

function render(opc = {}){
  const atv = ativos(), vis = visiveis();
  G.vset = new Set(vis.map(p => p.id));
  // posições visíveis de cada autor, em ordem de ano
  const psAut = new Map();
  vis.forEach(p => { if (!psAut.has(p.autor)) psAut.set(p.autor, []); psAut.get(p.autor).push(p); });
  psAut.forEach(ps => ps.sort((a, b) => a.ano - b.ano));
  G.aset = new Set(psAut.keys());
  // ponte: autor com posições nos dois problemas comparados
  G.pontes = new Set(estado.comp ? [...psAut].filter(([, ps]) => ps.some(p => p.probs.includes(estado.prob)) && ps.some(p => p.probs.includes(estado.comp))).map(([a]) => a) : []);
  if (estado.sel && !G.aset.has(estado.sel)) fecharFicha(true);
  atualizarControles();

  const LW = rol.clientWidth < 640 ? 136 : 236; G.LW = LW;
  let mn = Infinity, mx = -Infinity; vis.forEach(p => { mn = Math.min(mn, p.ano); mx = Math.max(mx, p.ano); });
  // o zoom comprime ou estica só o eixo do tempo: o texto fica sempre no mesmo tamanho
  const O = cum(mn), s = 1, Z = estado.zoom;
  G.O = O; G.s = s; G.Z = Z;
  const X = y => (cum(y) - O) * Z + LW + MARG; G.X = X;
  const XA = y => X(y) * s;

  // faixas e nós: um único nó por autor. Fica no problema principal, se tiver posição nele
  // (senão, no comparado), na faixa do primeiro subproblema da sua posição mais antiga ali.
  // O ponto marca o ano da primeira posição visível do autor.
  const faixas = [], FX = {};
  atv.forEach(pr => PROB[pr].subproblemas.forEach(sid => { if (!SUB[sid]) return; const f = {s: SUB[sid], pr, ns: []}; faixas.push(f); FX[sid] = f; }));
  const inst = [], noAut = new Map();
  psAut.forEach((ps, aid) => {
    const pr = atv.find(k => ps.some(p => p.probs.includes(k)));
    const sid = casa(ps.find(p => p.probs.includes(pr)), pr), f = FX[sid]; if (!f) return;
    const n = {aid, a: ps[0].aut, ps, f, x: X(ps[0].ano), ...medidasAutor(ps, sid), lin: {}};
    ps.forEach((p, i) => { n.lin[p.id] = i; });
    n.x0 = n.x - 8; n.x1 = n.x + 10 + n.w + 8;
    f.ns.push(n); inst.push(n); noAut.set(aid, n);
  });
  faixas.forEach(f => {
    // empilha os nós da faixa: cada um desce até não encostar em nenhum já posto
    f.ns.sort((a, b) => a.x - b.x || a.ps[0].ano - b.ps[0].ano);
    const postos = [];
    f.ns.forEach(n => {
      let yo = 0, mexeu = true;
      while (mexeu){
        mexeu = false;
        for (const m of postos) if (m.x1 + 8 > n.x0 && n.x1 + 8 > m.x0 && m.yo < yo + n.h + 6 && yo < m.yo + m.h + 6){ yo = m.yo + m.h + 6; mexeu = true; }
      }
      n.yo = yo; postos.push(n);
    });
    f.perg = quebrar(f.s.pergunta, F_PERG, LW - 24);
    f.nomeL = quebrar(f.s.nome, 'italic 500 13.5px Spectral, Georgia, serif', LW - 24);
    const hRot = 10 + f.nomeL.length * 17 + f.perg.length * 14.5 + 10;
    const fundo = f.ns.reduce((m, n) => Math.max(m, n.yo + n.h), NH1);
    f.h = Math.max(HEAD + fundo + PADB, hRot);
  });

  // empilhamento vertical
  let y = 12; const grupos = [];
  atv.forEach(pr => {
    const g = {pr, y0: y}; y += GH;
    faixas.filter(f => f.pr === pr).forEach(f => { f.y0 = y; f.y1 = y + f.h; f.ns.forEach(n => { n.y = f.y0 + HEAD + n.yo; }); y = f.y1; });
    g.y1 = y; grupos.push(g); y += GAPG;
  });
  const H = y + 10;

  // apelidos do problema ao longo do tempo
  const aliasSvg = [];
  let Wc = Math.max(LW + MARG + 200, ...inst.map(n => n.x1)) + MARG;
  grupos.forEach(g => {
    let fim = -Infinity;
    [...PROB[g.pr].aliases].sort((a, b) => a.de - b.de).forEach(a => {
      const termos = a.termos.map(t => `“${t}”`).join(', ');
      const larg = medir(semMd(termos) + '  ' + a.periodo, F_ALIAS);
      const xr = a.de <= mn ? LW + MARG : X(a.de);
      const x = Math.max(xr, fim + 22);
      aliasSvg.push(`<text class="alias" x="${x}" y="${g.y0 + 27}">${mdSvg(termos)}<tspan class="per">  ${escH(a.periodo)}</tspan></text>`);
      if (a.de > mn && Math.abs(x - xr) < 1) aliasSvg.push(`<line x1="${x}" y1="${g.y0 + 31}" x2="${x}" y2="${g.y0 + GH}" stroke="var(--linha)"/>`);
      fim = x + larg; Wc = Math.max(Wc, fim + MARG);
    });
  });
  G.Wc = Wc;
  const W = Math.max(rol.clientWidth / s, Wc), Hs = H;
  G.W = W; G.H = Hs;
  const anoIni = anoDe(O + (LW - LW - MARG) / Z), anoFim = anoDe(O + (W - LW - MARG) / Z);

  // --- eixo ---
  let ax = `<line x1="0" y1="47.5" x2="${W * s}" y2="47.5" stroke="var(--linha)"/>`;
  Object.entries(PERIODOS).forEach(([k, pr]) => {
    const a = Math.max(pr.faixa[0], anoIni), b = Math.min(pr.faixa[1], anoFim);
    if (b <= a) return;
    const xa = Math.max(LW * s, XA(a)), xb = Math.min(W * s, XA(b));
    if (xb - xa < 4) return;
    const yy = 5 + pr.linha * 20;
    ax += `<g class="eixo-per"><rect x="${xa}" y="${yy}" width="${xb - xa}" height="17" rx="2" fill="var(--fundo)" stroke="var(--linha)"/>
      <text data-xa="${xa}" data-xb="${xb}" x="${xa + 8}" y="${yy + 12.5}">${pr.n}<tspan fill="var(--tinta-suave)" font-style="normal" font-size="10.5">  ${pr.rotulo}</tspan></text></g>`;
  });
  const marcas = []; let ultimo = -1e9;
  for (let a = Math.ceil(anoIni / 10) * 10; a <= anoFim; a += 10){
    if (a === 0) continue;
    const pxa = taxa(a) * Z * s;
    const passo = [10,25,50,100,200,500].find(q => q * pxa >= 74) || 500;
    if (a % passo !== 0) continue;
    const x = XA(a); if (x < (LW + 12) * s || x - ultimo < 58) continue;
    marcas.push([a, x]); ultimo = x;
  }
  marcas.forEach(([a, x]) => {
    ax += `<line x1="${x}" y1="47.5" x2="${x}" y2="53" stroke="var(--tinta-suave)"/><text class="eixo-tick" x="${x}" y="65" text-anchor="middle">${anoTxt(a)}${a > 0 && a <= 600 ? ' d.C.' : ''}</text>`;
  });
  ax += `<g id="canto"><rect x="0" y="0" width="${LW * s}" height="${EIXO_H}" fill="var(--fundo)"/><line x1="${LW * s - .5}" y1="0" x2="${LW * s - .5}" y2="${EIXO_H}" stroke="var(--linha)"/>
    <text x="${16 * s}" y="65" font-size="11" font-style="italic" fill="var(--tinta-suave)">Subproblemas</text></g>`;
  eixo.setAttribute('width', W * s); eixo.setAttribute('height', EIXO_H); eixo.setAttribute('viewBox', `0 0 ${W * s} ${EIXO_H}`);
  eixo.innerHTML = ax;

  // --- mapa ---
  let sv = '';
  faixas.forEach((f, i) => {
    const c = corProb(f.pr); f.cor = c;
    sv += `<rect x="0" y="${f.y0}" width="${W}" height="${f.h}" fill="${c.fundo}" opacity="${i % 2 ? .45 : .75}"/><line x1="0" y1="${f.y1 - .5}" x2="${W}" y2="${f.y1 - .5}" stroke="var(--linha-fraca)"/>`;
  });
  FRONTEIRAS.forEach(([a, nome]) => {
    if (a <= anoIni || a >= anoFim) return;
    const x = X(a); if (x < LW + MARG) return;
    sv += `<line class="fronteira" x1="${x}" y1="0" x2="${x}" y2="${H}"><title>${a}: ${escH(nome)}</title></line>`;
  });
  sv += aliasSvg.join('');

  // arestas: da posição mais nova à mais antiga, entre as linhas das duas posições nos nós dos autores.
  // Relações entre posições do mesmo autor ficam só na ficha.
  const arestas = [], yLin = (n, pid) => n.y + 11 + n.lin[pid] * LH;
  vis.forEach(p => p.relacoes.forEach(([t, alvo]) => {
    if (!G.vset.has(alvo) || !ROT_IDA[t] || POS[alvo].autor === p.autor) return;
    const na = noAut.get(p.autor), nb = noAut.get(POS[alvo].autor); if (!na || !nb) return;
    arestas.push({t, a: p.autor, b: POS[alvo].autor, pa: p.id, pb: alvo, na, nb, ya: yLin(na, p.id), yb: yLin(nb, alvo)});
  }));
  let sa = '', masc = '';
  arestas.forEach((r, i) => {
    const d = caminho(r.na, r.nb, r.ya, r.yb);
    if (r.t === 'sintetiza') masc += `<mask id="m${i}" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect x="0" y="0" width="${W}" height="${H}" fill="#fff"/><path d="${d}" fill="none" stroke="#000" stroke-width="1.8"/></mask>`;
    sa += `<g class="aresta ${r.t}" data-i="${i}"><path class="traco" d="${d}"${r.t === 'sintetiza' ? ` mask="url(#m${i})"` : ''}/><path class="toque" d="${d}"/></g>`;
  });
  sv += `<defs>${masc}</defs><g class="arestas">${sa}</g>`;

  // nós
  let sn = '';
  inst.forEach((n, i) => {
    const cls = ['no', n.ps.every(p => p.status === 'rascunho') ? 'rascunho' : 'verificada'];
    if (G.pontes.has(n.aid)) cls.push('ponte');
    n.i = i;
    let tx = '';
    n.ps.forEach((p, j) => {
      const {oc, loc} = n.linhas[j];
      tx += `<text class="nome" data-pos="${p.id}" x="${n.x + 9}" y="${n.y + 15 + j * LH}">${j ? '' : escH(n.a.nome) + '<tspan class="sep"> · </tspan>'}<tspan class="${oc.it ? 'obra' : 'obra-r'}">${escH(oc.t)}</tspan>${loc ? `<tspan class="obra-r">, ${escH(loc)}</tspan>` : ''}<tspan class="sep"> · </tspan><tspan class="ano-l">${escH(p.anoTxt)}</tspan></text>`;
    });
    let et = '';
    const ye = n.y + 15 + (n.ps.length - 1) * LH + 4;
    n.etqs.forEach(e => {
      const c = corProb(SUB[e.s].problema), ex = n.x + 9 + e.dx, ey = ye + e.ln * ETQ_H;
      et += `<g class="etq"><title>${escH(PROB[SUB[e.s].problema].nome)}: ${escH(SUB[e.s].pergunta)}</title><rect x="${ex}" y="${ey}" width="${e.w}" height="11.5" rx="2" fill="${c.fundo}" stroke="${c.borda}"/><text x="${ex + 5}" y="${ey + 8.6}" fill="${c.texto}">${escH(SUB[e.s].nome)}</text></g>`;
    });
    const rot = n.ps.map(p => `${semMd(p.obra)}, ${p.anoTxt}`).join('; ');
    const outros = n.etqs.length ? `; também em ${n.etqs.map(e => SUB[e.s].nome).join(', ')}` : '';
    sn += `<g class="${cls.join(' ')}" data-id="${escH(n.aid)}" data-n="${i}" tabindex="0" role="button" aria-label="${escH(n.a.nome)}: ${escH(rot)}${escH(outros)}">
      <rect class="caixa" x="${n.x0}" y="${n.y}" width="${n.x1 - n.x0}" height="${n.h}" rx="3"/>
      <circle class="ponto" cx="${n.x}" cy="${n.y + 10.5}" r="3.6" fill="${n.f.cor.ponto}"/>
      ${tx}${et}</g>`;
  });
  sv += `<g class="nos">${sn}</g>`;

  // coluna de rótulos (acompanha a rolagem horizontal)
  let sr = `<rect x="0" y="0" width="${LW}" height="${H}" fill="var(--fundo)"/>`;
  grupos.forEach(g => {
    const c = corProb(g.pr);
    sr += `<rect x="0" y="${g.y0}" width="${LW}" height="${GH}" fill="var(--fundo)"/><circle cx="20" cy="${g.y0 + 22.5}" r="4.5" fill="${c.ponto}"/><text class="rot-prob" x="32" y="${g.y0 + 28}">${escH(PROB[g.pr].nome)}</text>`;
  });
  faixas.forEach(f => {
    sr += `<rect x="0" y="${f.y0}" width="${LW}" height="${f.h}" fill="${f.cor.fundo}"/><line x1="0" y1="${f.y1 - .5}" x2="${LW}" y2="${f.y1 - .5}" stroke="var(--linha-fraca)"/>`;
    let yy = f.y0 + 10;
    f.nomeL.forEach(l => { yy += 15.5; sr += `<text class="rot-faixa" x="14" y="${yy}" fill="${f.cor.texto}">${escH(l)}</text>`; });
    yy += 1.5;
    f.perg.forEach(l => { yy += 14.5; sr += `<text class="rot-perg" x="14" y="${yy}">${escH(l)}</text>`; });
  });
  sr += `<line x1="${LW - .5}" y1="0" x2="${LW - .5}" y2="${H}" stroke="var(--linha)"/>`;
  sv += `<g id="rotulos">${sr}</g>`;

  mapa.setAttribute('width', W * s); mapa.setAttribute('height', H * s); mapa.setAttribute('viewBox', `0 0 ${W} ${H}`);
  mapa.innerHTML = sv;

  G.inst = inst; G.noAut = noAut; G.arestas = arestas; G.faixas = faixas;
  G.nosEl = [...mapa.querySelectorAll('.no')];
  G.arEl = [...mapa.querySelectorAll('.aresta')];

  const np = G.pontes.size;
  $('#contagem').textContent = `${noAut.size} autores, ${vis.length} posições em ${faixas.length} faixas, ${arestas.length} ${arestas.length === 1 ? 'relação' : 'relações'}` +
    (estado.comp ? ` · ${np} ${np === 1 ? 'ponte' : 'pontes'} entre ${PROB[estado.prob].nome.toLowerCase()} e ${PROB[estado.comp].nome.toLowerCase()}` : '');

  if (opc.irPara) centralizar(opc.irPara, false);
  else if (opc.centro){ const a = opc.centro; rol.scrollLeft = X(a.ano) * s - a.cx; rol.scrollTop = a.frac * H * s + EIXO_H - a.cy; }
  else if (opc.inicio){ rol.scrollLeft = 0; rol.scrollTop = 0; }
  fixarRotulos();
  aplicarFoco();
  try { history.replaceState(null, '', '#' + atv.join('+')); } catch (e) {}
}

function fixarRotulos(){
  const sl = rol.scrollLeft;
  const r = mapa.querySelector('#rotulos'); if (r) r.setAttribute('transform', `translate(${sl / G.s},0)`);
  const c = eixo.querySelector('#canto'); if (c) c.setAttribute('transform', `translate(${sl},0)`);
  eixo.querySelectorAll('text[data-xa]').forEach(t => {
    const xa = +t.dataset.xa, xb = +t.dataset.xb;
    t.setAttribute('x', Math.max(xa + 8, Math.min(sl + G.LW * G.s + 8, xb - 170)));
  });
}
rol.addEventListener('scroll', () => requestAnimationFrame(fixarRotulos), {passive: true});

/* ==========================================================
   FOCO
   ========================================================== */
function aplicarFoco(){
  const id = estado.sel || estado.hover;
  const foco = !!id && G.aset.has(id);
  const nos = new Set(), ar = new Set();
  if (foco){
    nos.add(id);
    G.arestas.forEach((r, i) => { if (r.a === id || r.b === id){ ar.add(i); nos.add(r.a); nos.add(r.b); } });
  }
  mapa.classList.toggle('foco', foco);
  G.nosEl.forEach(el => {
    const pid = el.dataset.id;
    el.classList.toggle('ativo', foco && nos.has(pid));
    el.classList.toggle('atual', pid === estado.sel);
    el.classList.toggle('achado', estado.achados.has(pid));
  });
  G.arEl.forEach((el, i) => el.classList.toggle('ativa', ar.has(i)));
}

/* ==========================================================
   FICHA
   ========================================================== */
function refPos(id){
  const q = POS[id];
  return `<button type="button" class="ir" data-ir="${q.id}">${escH(q.aut.nome)}</button>, ${md(q.obra)} (${escH(q.anoTxt)})`;
}
function blocoRel(pares, rot){
  let h = '';
  Object.keys(ROT_IDA).forEach(t => {
    const ids = pares.filter(([tt]) => tt === t).map(([, id]) => id).filter(id => POS[id]).sort((a, b) => POS[a].ano - POS[b].ano);
    if (ids.length) h += `<p class="rel">${rot[t]}:</p><ul class="lista">${ids.map(id => `<li>${refPos(id)}</li>`).join('')}</ul>`;
  });
  return h;
}
/* ficha do autor: todas as suas posições, em ordem de ano, cada uma com tese,
   etiquetas de subproblema e relações. "foco" é a posição a mostrar primeiro. */
function abrirFicha(aid, foco){
  const ps = POSICOES.filter(q => q.autor === aid).sort((x, y) => x.ano - y.ano);
  if (!ps.length) return;
  const a = ps[0].aut;
  const per = a.per && PERIODOS[a.per] ? `, filosofia ${PERIODOS[a.per].n.toLowerCase()}` : '';
  const blocos = ps.map(p => {
    const etqs = p.subproblemas.filter(s => SUB[s]).map(s => {
      const sb = SUB[s], c = corProb(sb.problema);
      return `<button type="button" class="etq" data-sub="${s}" data-pos="${p.id}" style="background:${c.fundo};border-color:${c.borda};color:${c.texto}" title="${escH(PROB[sb.problema].nome)}: ${escH(sb.pergunta)}">${escH(sb.nome)}</button>`;
    }).join('');
    const ida = blocoRel(p.relacoes, ROT_IDA), volta = blocoRel(RECEB[p.id] || [], ROT_VOLTA);
    return `<section class="posicao${p.id === foco && ps.length > 1 ? ' em-foco' : ''}" id="pos-${p.id}">
      <p class="obra-t">${md(p.obra)}, ${escH(p.anoTxt)}</p>
      ${p.status === 'rascunho' ? '<p class="aviso">Tese em rascunho, ainda não conferida</p>' : ''}
      <p class="tese">${md(p.tese)}</p>
      <p class="etiquetas">${etqs}</p>
      ${ida || volta ? ida + volta : '<p class="nada">Nenhuma relação registrada.</p>'}
    </section>`;
  }).join('');
  const pag = a.pag;
  ficha.innerHTML = `
    <button type="button" class="fechar" aria-label="Fechar ficha">×</button>
    <h2>${escH(a.nome)}</h2>
    <p class="vida">${escH(a.dt)}${per}</p>
    ${pag ? `<div class="paginas">${pag.map(g => `<a href="${escH(g.u)}" target="_top">Abrir página de estudo<span>${escH(g.t)}</span></a>`).join('')}</div>` : ''}
    ${ps.length > 1 ? `<h3>${ps.length} posições</h3>` : ''}
    ${blocos}`;
  ficha.hidden = false;
  // em tela larga, o mapa recua para a esquerda da ficha, e nada fica escondido atrás dela
  palco.classList.toggle('com-ficha', innerWidth > 700);
  const el = foco && ps.length > 1 && document.getElementById('pos-' + foco);
  if (el) ficha.scrollTop = el.offsetTop - 12; else ficha.scrollTop = 0;
}
function fecharFicha(silencioso){
  estado.sel = null; ficha.hidden = true; ficha.innerHTML = '';
  palco.classList.remove('com-ficha');
  if (!silencioso) aplicarFoco();
}
/* seleciona um autor (id de FILOS); pid, se houver, é a posição clicada */
function selecionar(aid, pid){
  estado.sel = aid; estado.hover = null;
  abrirFicha(aid, pid); aplicarFoco();
  const n = G.noAut.get(aid);
  if (n){
    const l = rol.scrollLeft + G.LW * G.s, r = rol.scrollLeft + rol.clientWidth, t = rol.scrollTop, b = rol.scrollTop + rol.clientHeight - EIXO_H;
    if (n.x0 * G.s < l || n.x1 * G.s > r || n.y * G.s < t || (n.y + n.h) * G.s > b) centralizar(aid, true);
  }
}
function centralizar(aid, suave){
  const n = G.noAut.get(aid); if (!n) return;
  const esq = G.LW * G.s, meio = esq + (rol.clientWidth - esq) / 2;
  rol.scrollTo({left: (n.x0 + n.x1) / 2 * G.s - meio, top: n.y * G.s - (rol.clientHeight - EIXO_H) / 2, behavior: suave ? 'smooth' : 'auto'});
}
/* leva a uma posição; se ela não está nos problemas ativos, troca o problema */
function irPara(id, sub){
  const p = POS[id]; if (!p || !p.probs.length) return;
  let mudou = false;
  const alvo = sub ? SUB[sub].problema : null;
  if (alvo ? !ativos().includes(alvo) : !p.probs.some(k => ativos().includes(k))){
    estado.prob = alvo || p.probs[0];
    if (estado.comp === estado.prob) estado.comp = null;
    mudou = true;
  }
  estado.sel = p.autor;
  if (mudou){ estado.zoom = zoomInicial(); render({inicio: true}); }
  estado.hover = null;
  abrirFicha(p.autor, id); aplicarFoco();
  centralizar(p.autor, !mudou);
}

/* ==========================================================
   CONTROLES
   ========================================================== */
function contaProb(pr){ return POSICOES.filter(p => p.probs.includes(pr)).length; }
function montarControles(){
  const botao = (pr, attr) => { const c = COR_PROB[pr]; return `<button type="button" class="opcao" ${attr}="${pr}" data-h="${c.h}" data-s="${c.s}"><span class="pinta"></span>${escH(PROB[pr].nome)}<small>${contaProb(pr)}</small></button>`; };
  $('#problemas').insertAdjacentHTML('beforeend', PROBLEMAS.map(p => botao(p.id, 'data-prob')).join(''));
  $('#comparar').insertAdjacentHTML('beforeend', `<button type="button" class="opcao" data-comp="">Nenhum</button>` + PROBLEMAS.map(p => botao(p.id, 'data-comp')).join(''));
  const nomes = [...new Set(POSICOES.map(p => p.aut.nome))].sort((a, b) => a.localeCompare(b, 'pt'));
  $('#nomes').innerHTML = nomes.map(n => `<option value="${escH(n)}">`).join('');
}
function atualizarControles(){
  document.querySelectorAll('.seletores .opcao').forEach(b => {
    if (b.dataset.h) b.style.setProperty('--c', paleta(+b.dataset.h, +b.dataset.s).ponto);
    if ('prob' in b.dataset) b.setAttribute('aria-pressed', String(b.dataset.prob === estado.prob));
    if ('comp' in b.dataset){
      const k = b.dataset.comp || null;
      b.setAttribute('aria-pressed', String(k === estado.comp));
      b.disabled = !!k && k === estado.prob;
    }
  });
  $('#nivel').textContent = Math.round(estado.zoom * 100) + '%';
}
$('#problemas').addEventListener('click', e => {
  const b = e.target.closest('.opcao'); if (!b || b.dataset.prob === estado.prob) return;
  estado.prob = b.dataset.prob;
  if (estado.comp === estado.prob) estado.comp = null;
  estado.zoom = zoomInicial(); render({inicio: true});
});
$('#comparar').addEventListener('click', e => {
  const b = e.target.closest('.opcao'); if (!b || b.disabled) return;
  const k = b.dataset.comp || null;
  estado.comp = k === estado.comp ? null : k;
  estado.zoom = zoomInicial(); render({inicio: true});
});
const ZOOM_MIN = 0.04, ZOOM_MAX = 3.2;
function zoomEm(z, cx, cy){
  z = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z));
  if (Math.abs(z - estado.zoom) < 0.001) return;
  const c = centroAtual(cx, cy);
  estado.zoom = z; render({centro: c});
}
$('#mais').addEventListener('click', () => zoomEm(estado.zoom * 1.25));
$('#menos').addEventListener('click', () => zoomEm(estado.zoom / 1.25));
/* "Ver o mapa inteiro": comprime o tempo até todas as posições caberem na largura da tela */
function zoomInteiro(){
  const vis = visiveis(), O = cum(Math.min(...vis.map(p => p.ano)));
  const LW = rol.clientWidth < 640 ? 136 : 236;
  const livre = rol.clientWidth - LW - 2 * MARG - 26;
  let z = ZOOM_MAX;
  const psAut = new Map();
  vis.forEach(p => { if (!psAut.has(p.autor)) psAut.set(p.autor, []); psAut.get(p.autor).push(p); });
  psAut.forEach(ps => {
    ps.sort((a, b) => a.ano - b.ano);
    const pr = ativos().find(k => ps.some(p => p.probs.includes(k)));
    const c = cum(ps[0].ano) - O, w = medidasAutor(ps, casa(ps.find(p => p.probs.includes(pr)), pr)).w + 18;
    if (c > 0) z = Math.min(z, (livre - w) / c);
  });
  return Math.max(ZOOM_MIN, Math.min(1, z));
}
/* zoom ao abrir um problema: no computador, o mapa inteiro; no celular, 100% com rolagem horizontal */
const zoomInicial = () => rol.clientWidth >= 900 ? zoomInteiro() : 1;
$('#enquadrar').addEventListener('click', () => { estado.zoom = zoomInteiro(); render({inicio: true}); });
let _zp = null, _zr = 0;
rol.addEventListener('wheel', e => {
  if (!(e.ctrlKey || e.metaKey)) return;
  e.preventDefault();
  const r = rol.getBoundingClientRect();
  const f = Math.exp(-e.deltaY * (e.deltaMode === 1 ? 0.05 : 0.0018));
  _zp = {f: (_zp ? _zp.f : 1) * f, cx: e.clientX - r.left, cy: e.clientY - r.top};
  if (!_zr) _zr = requestAnimationFrame(() => { _zr = 0; const q = _zp; _zp = null; zoomEm(estado.zoom * q.f, q.cx, q.cy); });
}, {passive: false});

// interação com o mapa
function moverDica(e){
  const x = Math.min(innerWidth - dica.offsetWidth - 12, e.clientX + 14), y = Math.min(innerHeight - dica.offsetHeight - 12, e.clientY + 16);
  dica.style.left = Math.max(4, x) + 'px'; dica.style.top = Math.max(4, y) + 'px';
}
mapa.addEventListener('mouseover', e => {
  if (_esp) return;
  const g = e.target.closest('.no');
  if (g){
    // a dica mostra a posição da linha sob o ponteiro (ou a primeira do autor)
    const n = G.noAut.get(g.dataset.id), lp = e.target.closest('[data-pos]');
    const p = lp ? POS[lp.dataset.pos] : n.ps[0];
    const mais = !lp && n.ps.length > 1 ? `<br><span class="s">e mais ${n.ps.length - 1} ${n.ps.length === 2 ? 'posição' : 'posições'}</span>` : '';
    dica.innerHTML = `<strong>${escH(p.aut.nome)}</strong> <span class="s">· ${md(p.obra)}, ${escH(p.anoTxt)}</span><br>${md(p.tese)}${mais}`;
    dica.classList.add('on'); moverDica(e);
    if (!estado.sel && estado.hover !== n.aid){ estado.hover = n.aid; aplicarFoco(); }
    return;
  }
  const a = e.target.closest('.aresta');
  if (a){
    const r = G.arestas[+a.dataset.i], pa = POS[r.pa], pb = POS[r.pb];
    const ob = q => q.curta.it ? `<em>${escH(q.curta.t)}</em>` : escH(q.curta.t);
    dica.innerHTML = `<strong>${escH(pa.aut.nome)}</strong>, ${ob(pa)} (${escH(pa.anoTxt)}) <span class="s">${VERBO[r.t]}</span> <strong>${escH(pb.aut.nome)}</strong>, ${ob(pb)} (${escH(pb.anoTxt)})`;
    dica.classList.add('on'); moverDica(e);
  }
});
mapa.addEventListener('mousemove', e => { if (dica.classList.contains('on')) moverDica(e); });
mapa.addEventListener('mouseout', e => {
  const g = e.target.closest('.no, .aresta'); if (!g) return;
  if (e.relatedTarget && g.contains(e.relatedTarget)) return;
  dica.classList.remove('on');
  if (g.classList.contains('no') && estado.hover){ estado.hover = null; aplicarFoco(); }
});
mapa.addEventListener('click', e => {
  const g = e.target.closest('.no'); if (g){ const lp = e.target.closest('[data-pos]'); selecionar(g.dataset.id, lp && lp.dataset.pos); return; }
  if (estado.sel) fecharFicha();
});
mapa.addEventListener('keydown', e => {
  const g = e.target.closest('.no');
  if (g && e.key === 'Enter'){ e.preventDefault(); selecionar(g.dataset.id); }
});
ficha.addEventListener('click', e => {
  const t = e.target;
  if (t.closest('.fechar')) { fecharFicha(); return; }
  const ir = t.closest('[data-ir]'); if (ir){ irPara(ir.dataset.ir); return; }
  const sb = t.closest('[data-sub]'); if (sb){ irPara(sb.dataset.pos, sb.dataset.sub); return; }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape' && estado.sel) fecharFicha(); });

// arrastar o mapa: segurar espaço e arrastar com o botão esquerdo
let _esp = false, _arr = null, _moveu = false;
const _campo = t => t && t.closest && t.closest('input, textarea, select, [contenteditable]');
document.addEventListener('keydown', e => {
  if (e.code !== 'Space' || _campo(e.target)) return;
  e.preventDefault();
  const a = document.activeElement;
  if (a && a !== document.body && !_campo(a)) a.blur();
  if (!_esp){ _esp = true; rol.classList.add('mao'); dica.classList.remove('on'); }
});
document.addEventListener('keyup', e => { if (e.code === 'Space'){ _esp = false; rol.classList.remove('mao'); } });
addEventListener('blur', () => { _esp = false; _arr = null; rol.classList.remove('mao', 'arrastando'); });
rol.addEventListener('mousedown', e => {
  if (!_esp || e.button !== 0) return;
  e.preventDefault(); _moveu = false;
  _arr = {x: e.clientX, y: e.clientY, l: rol.scrollLeft, t: rol.scrollTop};
  rol.classList.add('arrastando');
});
addEventListener('mousemove', e => {
  if (!_arr) return;
  const dx = e.clientX - _arr.x, dy = e.clientY - _arr.y;
  if (Math.abs(dx) + Math.abs(dy) > 3) _moveu = true;
  rol.scrollLeft = _arr.l - dx; rol.scrollTop = _arr.t - dy;
});
addEventListener('mouseup', () => { if (_arr){ _arr = null; rol.classList.remove('arrastando'); } });
rol.addEventListener('click', e => { if (_esp || _moveu){ e.preventDefault(); e.stopPropagation(); _moveu = false; } }, true);

// busca por autor, obra ou tese, sem acento; Enter de novo passa ao próximo resultado
let _bq = '', _bi = -1;
function buscar(v){
  const q = semAcento(v.trim());
  if (!q){ _bq = ''; estado.achados = new Set(); $('#achados').textContent = ''; aplicarFoco(); return; }
  const res = POSICOES.filter(p => p.probs.length && p.busca.includes(q)).sort((a, b) => a.ano - b.ano);
  if (q !== _bq){ _bq = q; _bi = -1; }
  estado.achados = new Set(res.map(p => p.autor));
  if (!res.length){ $('#achados').textContent = 'Nada encontrado'; aplicarFoco(); return; }
  _bi = (_bi + 1) % res.length;
  $('#achados').textContent = res.length === 1 ? '1 posição' : `${_bi + 1} de ${res.length} · Enter para a próxima`;
  irPara(res[_bi].id);
}
$('#busca').addEventListener('keydown', e => { if (e.key === 'Enter'){ e.preventDefault(); buscar(e.target.value); } });
$('#busca').addEventListener('change', e => { if (semAcento(e.target.value.trim()) !== _bq) buscar(e.target.value); });
$('#busca').addEventListener('input', e => { if (!e.target.value.trim()) buscar(''); });

// "Como ler" fecha ao clicar fora
document.addEventListener('click', e => { const d = $('#detalhes'); if (d.open && !d.contains(e.target)) d.open = false; });

// redimensionamento e tema
let _t; addEventListener('resize', () => { clearTimeout(_t); _t = setTimeout(() => render({centro: centroAtual()}), 180); });
const _redesenhar = () => { const c = centroAtual(); render({centro: c}); if (estado.sel) abrirFicha(estado.sel); };
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', _redesenhar);
new MutationObserver(_redesenhar).observe(document.documentElement, {attributes: true, attributeFilter: ['data-theme']});

// início: o endereço pode trazer os problemas (#mal ou #mal+liberdade)
(function(){
  const h = decodeURIComponent(location.hash.slice(1)).split('+').filter(k => PROB[k]);
  if (h[0]) estado.prob = h[0];
  if (h[1] && h[1] !== h[0]) estado.comp = h[1];
})();
montarControles();
estado.zoom = zoomInicial();
render({inicio: true});
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { _cw.clear(); POSICOES.forEach(p => { delete p.curta; });if (!estado.sel){ estado.zoom = zoomInicial(); render({inicio: true}); } else render({centro: centroAtual()}); });
