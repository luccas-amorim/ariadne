/* ==========================================================
   PREPARO DOS DADOS
   ========================================================== */
const { escolas: ESC, autores, anoTxt } = CatalogoFilosofico;
const AREA = {}; AREAS.forEach(a => AREA[a.k] = a);

const P = [], PI = {};
autores.forEach(autor => {
  const { id, esc, b, d } = autor;
  if (!ESC[esc]) { console.warn('Corrente desconhecida:', esc, id); return; }
  if (PI[id]) { console.warn('Id repetido:', id); return; }
  const ponto = { ...autor, ak: d == null ? b + 40 : b + Math.min(40, (d - b) * 0.75) };
  P.push(ponto);
  PI[id] = ponto;
});

const ARESTAS = []; const _vistas = new Set();
REL.trim().split(/\s+/).forEach(t => {
  const m = t.match(/^([a-z0-9_]+)([>}~])([a-z0-9_]+)$/);
  if (!m) { console.warn('Relação malformada:', t); return; }
  const [, a, s, b] = m;
  if (!PI[a] || !PI[b]) { console.warn('Relação com id desconhecido:', t); return; }
  const k = a + '|' + b; if (_vistas.has(k)) return; _vistas.add(k);
  ARESTAS.push({a, b, t: s === '}' ? 'm' : s === '~' ? 'c' : 'i'});
});


/* ==========================================================
   ESTADO E UTILITÁRIOS
   ========================================================== */
const $ = s => document.querySelector(s);
const rol = $('#rolagem'), eixo = $('#eixo'), mapa = $('#mapa'), ficha = $('#ficha'), dica = $('#dica'), vazio = $('#vazio');
const estado = {periodo:null, area:null, nivel:'escolas', zoom:1, sel:null, selEsc:null, hover:null, linhagem:false, todas:false};
const MAC = {}, MAPA = {};
MACROS.forEach(([id,nome,fam,y,desc,escs]) => { MAC[id] = {id,nome,fam,y,desc,escs:escs.split(' ')}; escs.split(' ').forEach(s => { if (!ESC[s]) console.warn('Escola desconhecida no agrupamento:', s); MAPA[s] = id; }); });
Object.keys(ESC).forEach(s => { if (!MAPA[s]) console.warn('Escola sem grande corrente:', s); });
const CORR = id => ESC[id] || MAC[id];
const grupoDe = p => estado.nivel === 'amplo' ? MAPA[p.esc] : p.esc;
const membro = (p, id) => p.esc === id || MAPA[p.esc] === id;
const G = {Z:1, O:0, s:1, vis:[], vset:new Set(), arVis:[], nosEl:new Map(), arEl:[], W:0, Wc:0, H:0};
const MARG = 70, ROW = 31, HEAD = 20, GX = 18, GY = 10, LANE = 44, PADB = 6, EIXO_H = 70;
const F_NOME = '500 13px Spectral, Georgia, serif', F_DATAS = '400 10.5px Spectral, Georgia, serif', F_ESC = 'italic 400 12px Spectral, Georgia, serif';
const _cv = document.createElement('canvas').getContext('2d'); const _cw = new Map();
function medir(t, f){ const k = f + '|' + t; if (!_cw.has(k)) { _cv.font = f; _cw.set(k, _cv.measureText(t).width); } return _cw.get(k); }
const escH = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const md = s => escH(s).replace(/\*(.+?)\*/g, '<em>$1</em>');
const semAcento = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();

function escuro(){ const t = document.documentElement.getAttribute('data-theme'); return t === 'dark' || (t !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches); }
function paleta(h, s){
  return escuro()
    ? {fundo:`hsl(${h} ${s*.34}% 18%)`, borda:`hsl(${h} ${s*.4}% 30%)`, texto:`hsl(${h} ${Math.min(80,s*.9)}% 76%)`, ponto:`hsl(${h} ${Math.min(80,s*1.1)}% 64%)`, linha:`hsl(${h} ${s*.8}% 64%)`}
    : {fundo:`hsl(${h} ${s*.55}% 92.5%)`, borda:`hsl(${h} ${s*.45}% 79%)`, texto:`hsl(${h} ${Math.min(85,s*1.1)}% 29%)`, ponto:`hsl(${h} ${Math.min(85,s*1.15)}% 41%)`, linha:`hsl(${h} ${s*.9}% 40%)`};
}
function corEscola(e){
  if (estado.area) return paleta(AREA[estado.area].h, 62);
  const f = FAMILIAS[e.fam]; return paleta(f.h, f.s);
}

/* ==========================================================
   DISPOSIÇÃO E DESENHO
   ========================================================== */
function visiveis(){ return P.filter(p => (!estado.periodo || p.per === estado.periodo) && (!estado.area || p.areas.includes(estado.area))); }

function centroAtual(cx, cy){
  if (cx == null) cx = rol.clientWidth / 2;
  if (cy == null) cy = rol.clientHeight / 2;
  const c = ((rol.scrollLeft + cx) / G.s - MARG) / G.Z + G.O;
  return {ano: anoDe(c), frac: G.H ? (rol.scrollTop + cy - EIXO_H) / (G.H * G.s) : 0, cx, cy};
}

function render(opc = {}){
  const vis = visiveis();
  G.vis = vis; G.vset = new Set(vis.map(p => p.id));
  if (estado.sel && !G.vset.has(estado.sel)) fecharFicha(true);
  atualizarControles();
  if (!vis.length){
    eixo.innerHTML = ''; mapa.innerHTML = ''; eixo.setAttribute('width',0); mapa.setAttribute('width',0); mapa.setAttribute('height',0);
    vazio.hidden = false;
    const pn = estado.periodo ? `no período ${PERIODOS[estado.periodo].n.toLowerCase()}` : '';
    vazio.innerHTML = `<p>Nenhum filósofo de ${escH(AREA[estado.area].n.toLowerCase())} ${pn} nesta linha do tempo.</p><button type="button" id="verTudo">Ver toda a história desta área</button>`;
    $('#verTudo').onclick = () => { estado.periodo = null; render(); };
    $('#contagem').textContent = 'Nenhum filósofo';
    return;
  }
  vazio.hidden = true;

  // escala
  let mn = Infinity, mx = -Infinity;
  vis.forEach(p => { mn = Math.min(mn, p.ak); mx = Math.max(mx, p.ak); });
  const O = cum(mn);
  const s = Math.min(1, estado.zoom); G.s = s;
  const XA = y => X(y) * s;
  let Z = Math.max(1, estado.zoom);
  if (estado.periodo){
    const disp = Math.max(600, rol.clientWidth - 2 * MARG - 200);
    Z *= Math.max(1.7, disp / Math.max(1, cum(mx) - O));
  }
  G.Z = Z; G.O = O;
  const X = y => (cum(y) - O) * Z + MARG;
  G.X = X;

  vis.forEach(p => {
    p.x = X(p.ak);
    p.w = Math.max(medir(p.nome, F_NOME), medir(p.dt, F_DATAS));
    p.x0 = p.x - 6; p.x1 = p.x + 9 + p.w + 12;
  });

  // correntes: empacota os nomes em linhas
  const grupos = {};
  vis.forEach(p => { const g = grupoDe(p); (grupos[g] = grupos[g] || []).push(p); });
  const bandas = Object.entries(grupos).map(([eid, ns]) => {
    ns.sort((a, b) => a.x - b.x);
    const linhas = [];
    ns.forEach(n => { let r = linhas.findIndex(f => f <= n.x0); if (r < 0) { r = linhas.length; linhas.push(0); } linhas[r] = n.x1; n.row = r; });
    const e = CORR(eid);
    const x0 = Math.min(...ns.map(n => n.x0)) - 8;
    const x1 = Math.max(Math.max(...ns.map(n => n.x1)), x0 + 16 + medir(e.nome, F_ESC)) + 6;
    return {e, ns, x0, x1, h: HEAD + linhas.length * ROW + PADB};
  });

  // empacota as correntes no plano, perto da faixa preferida
  bandas.sort((a, b) => a.x0 - b.x0 || a.e.y - b.e.y);
  const postas = [];
  bandas.forEach(b => {
    const pref = b.e.y * (estado.area ? LANE * 0.45 : LANE);
    const sob = postas.filter(r => r.x0 < b.x1 + GX && b.x0 < r.x1 + GX);
    const cands = [pref];
    sob.forEach(r => { cands.push(r.y1 + GY, r.y0 - b.h - GY); });
    cands.sort((p, q) => Math.abs(p - pref) - Math.abs(q - pref));
    for (let i = cands.length - 1; i >= 0; i--) if (cands[i] < 0) cands.splice(i, 1);
    if (!cands.length) cands.push(Math.max(0, ...sob.map(r => r.y1 + GY)));
    for (const c of cands){
      if (sob.every(r => c + b.h + GY <= r.y0 || c >= r.y1 + GY)) { b.y0 = c; break; }
    }
    b.y1 = b.y0 + b.h; postas.push(b);
  });
  const minY = Math.min(...bandas.map(b => b.y0));
  bandas.forEach(b => { b.y0 += 16 - minY; b.y1 += 16 - minY; b.ns.forEach(n => n.y = b.y0 + HEAD + n.row * ROW); });

  G.Wc = Math.max(...bandas.map(b => b.x1)) + MARG;
  const W = Math.max(rol.clientWidth / s, G.Wc);
  const H = Math.max(...bandas.map(b => b.y1)) + 40;
  G.W = W; G.H = H;

  // anos visíveis
  const anoIni = anoDe(O + (0 - MARG) / Z), anoFim = anoDe(O + (W - MARG) / Z);

  // --- eixo ---
  let ax = `<line x1="0" y1="47.5" x2="${W * s}" y2="47.5" stroke="var(--linha)"/>`;
  Object.entries(PERIODOS).forEach(([k, pr]) => {
    const a = Math.max(pr.faixa[0], anoIni), b = Math.min(pr.faixa[1], anoFim);
    if (b <= a) return;
    const xa = Math.max(0, XA(a)), xb = Math.min(W * s, XA(b));
    if (xb - xa < 4) return;
    const y = 5 + pr.linha * 20, ativo = estado.periodo === k;
    ax += `<g class="eixo-per" data-per="${k}" role="button" tabindex="0" aria-label="Ver só o período ${pr.n}">
      <rect x="${xa}" y="${y}" width="${xb - xa}" height="17" rx="2" fill="${ativo ? 'var(--papel)' : 'var(--fundo)'}" stroke="${ativo ? 'var(--tinta)' : 'var(--linha)'}"/>
      <text data-xa="${xa}" data-xb="${xb}" x="${xa + 8}" y="${y + 12.5}">${pr.n}<tspan fill="var(--tinta-suave)" font-style="normal" font-size="10.5">  ${pr.rotulo}</tspan></text></g>`;
  });
  // marcas de ano
  const marcas = []; let ultimo = -1e9;
  for (let y = Math.ceil(anoIni / 10) * 10; y <= anoFim; y += 10){
    if (y === 0) continue;
    const pxa = taxa(y) * Z * s;
    const passo = [10,25,50,100,200,500].find(s => s * pxa >= 74) || 500;
    if (y % passo !== 0) continue;
    const x = XA(y); if (x - ultimo < 58) continue;
    marcas.push([y, x]); ultimo = x;
  }
  marcas.forEach(([y, x]) => {
    ax += `<line x1="${x}" y1="47.5" x2="${x}" y2="53" stroke="var(--tinta-suave)"/><text class="eixo-tick" x="${x}" y="65" text-anchor="middle">${anoTxt(y)}${y > 0 && y <= 600 ? ' d.C.' : ''}</text>`;
  });
  eixo.setAttribute('width', W * s); eixo.setAttribute('height', EIXO_H); eixo.setAttribute('viewBox', `0 0 ${W * s} ${EIXO_H}`);
  eixo.innerHTML = ax;
  fixarRotulos();

  // --- mapa ---
  let sv = '';
  FRONTEIRAS.forEach(([y, nome]) => {
    if (y <= anoIni || y >= anoFim) return;
    const x = X(y);
    sv += `<line class="fronteira" x1="${x}" y1="0" x2="${x}" y2="${H}"><title>${y}: ${nome}</title></line>`;
  });
  bandas.forEach(b => {
    const c = corEscola(b.e); b.cor = c;
    sv += `<g class="banda" data-esc="${b.e.id}"><rect x="${b.x0}" y="${b.y0}" width="${b.x1 - b.x0}" height="${b.h}" rx="3" fill="${c.fundo}" stroke="${c.borda}"/>
      <text class="cab" x="${b.x0 + 8}" y="${b.y0 + 14}" fill="${c.texto}">${escH(b.e.nome)}<title>${escH(b.e.desc.replace(/\*/g,''))}</title></text></g>`;
  });
  // arestas
  const arVis = ARESTAS.filter(a => G.vset.has(a.a) && G.vset.has(a.b));
  G.arVis = arVis;
  let sa = '';
  arVis.forEach((a, i) => {
    const s = PI[a.a], t = PI[a.b];
    const xs = s.x, ys = s.y + 9, xt = t.x, yt = t.y + 9;
    let d;
    if (xt - xs > 30){ const dx = (xt - xs) * 0.5; d = `M${xs},${ys} C${xs + dx},${ys} ${xt - dx},${yt} ${xt},${yt}`; }
    else { d = `M${xs},${ys} C${xs + 70},${ys} ${xt - 70},${yt} ${xt},${yt}`; }
    const cor = estado.area ? paleta(AREA[estado.area].h, 62).linha : corEscola(ESC[s.esc]).linha;
    sa += `<path class="aresta ${a.t}" data-i="${i}" d="${d}" stroke="${cor}"/>`;
  });
  sv += `<g class="arestas">${sa}</g>`;
  // nós
  let sn = '';
  bandas.forEach(b => b.ns.forEach(n => {
    const ln = !!n.pag;
    const nome = `<text class="nome" x="${n.x + 8}" y="${n.y + 13}">${escH(n.nome)}</text>`;
    sn += `<g class="no${ln ? ' linkado' : ''}" data-id="${n.id}" tabindex="0" role="button" aria-label="${escH(n.nome)}, ${escH(n.dt)}">
      <rect x="${n.x - 6}" y="${n.y}" width="${n.w + 20}" height="${ROW - 3}" fill="transparent"/>
      <circle class="ponto" cx="${n.x}" cy="${n.y + 9}" r="${ln ? 4.4 : 3.7}" fill="${b.cor.ponto}"/>
      ${ln ? `<a href="${escH(n.pag[0].u)}" target="_top" aria-label="Abrir ${escH(n.pag[0].t)}">${nome}</a>` : nome}
      <text class="datas" x="${n.x + 8}" y="${n.y + 25}">${escH(n.dt)}</text></g>`;
  }));
  sv += `<g class="nos">${sn}</g>`;
  sv += `<g id="vida" pointer-events="none"></g>`;
  mapa.setAttribute('width', W * s); mapa.setAttribute('height', H * s); mapa.setAttribute('viewBox', `0 0 ${W} ${H}`);
  mapa.innerHTML = sv;

  G.nosEl = new Map(); mapa.querySelectorAll('.no').forEach(el => G.nosEl.set(el.dataset.id, el));
  G.arEl = [...mapa.querySelectorAll('.aresta')].map((el, i) => ({el, a: arVis[i].a, b: arVis[i].b}));
  G.bandas = bandas;

  $('#contagem').textContent = `${vis.length} filósofos, ${bandas.length} correntes, ${arVis.length} relações`;

  // posição da rolagem
  if (opc.irPara){ centralizar(PI[opc.irPara], false); }
  else if (opc.centro){ const a = opc.centro; rol.scrollLeft = X(a.ano) * s - a.cx; rol.scrollTop = a.frac * H * s + EIXO_H - a.cy; }
  else if (opc.inicio){ rol.scrollLeft = 0; rol.scrollTop = 0; }
  aplicarFoco();
}

/* ==========================================================
   FOCO: vizinhança, linhagem e corrente
   ========================================================== */
function conjuntoFoco(){
  const nos = new Set(), ar = new Set();
  const ligar = (a) => { ar.add(a.a + '|' + a.b); nos.add(a.a); nos.add(a.b); };
  if (estado.selEsc){
    G.vis.forEach(p => { if (membro(p, estado.selEsc)) nos.add(p.id); });
    G.arVis.forEach(a => { if (membro(PI[a.a], estado.selEsc) || membro(PI[a.b], estado.selEsc)) ligar(a); });
    return {nos, ar};
  }
  const id = estado.sel || estado.hover;
  if (!id || !G.vset.has(id)) return null;
  nos.add(id);
  if (estado.sel && estado.linhagem){
    const sobe = [id], desce = [id], vs = new Set([id]), vd = new Set([id]);
    while (sobe.length){ const c = sobe.pop(); G.arVis.forEach(a => { if (a.b === c){ ligar(a); if (!vs.has(a.a)){ vs.add(a.a); sobe.push(a.a); } } }); }
    while (desce.length){ const c = desce.pop(); G.arVis.forEach(a => { if (a.a === c){ ligar(a); if (!vd.has(a.b)){ vd.add(a.b); desce.push(a.b); } } }); }
  } else {
    G.arVis.forEach(a => { if (a.a === id || a.b === id) ligar(a); });
  }
  return {nos, ar};
}
function aplicarFoco(){
  mapa.classList.toggle('sem-arestas', !estado.todas);
  const f = conjuntoFoco();
  mapa.classList.toggle('foco', !!f);
  G.nosEl.forEach((el, id) => {
    el.classList.toggle('ativo', !!f && f.nos.has(id));
    el.classList.toggle('atual', id === estado.sel);
  });
  G.arEl.forEach(o => o.el.classList.toggle('ativa', !!f && f.ar.has(o.a + '|' + o.b)));
  const vg = mapa.querySelector('#vida');
  if (vg){
    const id = estado.sel || estado.hover;
    const p = id && G.vset.has(id) ? PI[id] : null;
    if (!p || !G.X) vg.innerHTML = '';
    else {
      const xa = G.X(p.b), xb = G.X(p.d == null ? new Date().getFullYear() : p.d), y = p.y + 29.5;
      vg.innerHTML = `<line class="vida-linha" x1="${xa}" y1="${y}" x2="${xb}" y2="${y}"/><line class="vida-linha" x1="${xa}" y1="${y - 4}" x2="${xa}" y2="${y + 4}"/><line class="vida-linha" x1="${xb}" y1="${y - 4}" x2="${xb}" y2="${y + 4}"/><line class="vida-linha" x1="${p.x}" y1="${p.y + 13}" x2="${p.x}" y2="${y}" stroke-dasharray="2 2" stroke-width="1.2"/>`;
    }
  }
}

/* ==========================================================
   FICHAS
   ========================================================== */
const ROT_REC = {m:'Mestres', i:'Influências', c:'Reagiu criticamente a'};
const ROT_EXE = {m:'Discípulos', i:'Influenciou', c:'Provocou a crítica de'};
function obraHtml(s){
  if (s.startsWith('!')) return escH(s.slice(1));
  const i = s.indexOf(' (');
  return i > 0 ? `<em>${escH(s.slice(0, i))}</em>${escH(s.slice(i))}` : `<em>${escH(s)}</em>`;
}
function listaRel(ids){
  return ids.map(id => `<button type="button" class="ir" data-ir="${id}">${escH(PI[id].nome)}</button>`).join(', ');
}
function blocoRel(arestas, lado, rot){
  let h = '';
  ['m','i','c'].forEach(t => {
    const ids = arestas.filter(a => a.t === t).map(a => a[lado]).sort((x, y) => PI[x].ak - PI[y].ak);
    if (ids.length) h += `<p class="rel"><em>${rot[t]}:</em> ${listaRel(ids)}</p>`;
  });
  return h || '<p class="rel"><em>Nenhuma relação registrada.</em></p>';
}
function abrirFicha(id){
  const p = PI[id], e = ESC[p.esc], f = FAMILIAS[e.fam], c = paleta(f.h, f.s);
  const rec = ARESTAS.filter(a => a.b === id), exe = ARESTAS.filter(a => a.a === id);
  ficha.innerHTML = `
    <button type="button" class="fechar" aria-label="Fechar ficha">×</button>
    <h2>${escH(p.nome)}</h2>
    <p class="vida">${escH(p.dt)}, filosofia ${escH(PERIODOS[p.per].n.toLowerCase())}</p>
    ${p.pag ? `<div class="paginas">${p.pag.map(g => `<a href="${escH(g.u)}" target="_top">Abrir página de estudo<span>${escH(g.t)}</span></a>`).join('')}</div>` : ''}
    <p class="corrente"><span class="sw" style="background:${c.ponto}"></span><button type="button" data-escola="${e.id}">${escH(e.nome)}</button></p>
    <p class="desc">${md(e.desc)}</p>
    <p class="rel"><em>Grande corrente:</em> <button type="button" class="ir" data-escola="${MAPA[e.id]}">${escH(MAC[MAPA[e.id]].nome)}</button></p>
    ${p.nota ? `<p class="nota">${md(p.nota)}</p>` : ''}
    <h3>Obras principais</h3>
    <ul class="obras">${p.obras.map(o => `<li>${obraHtml(o)}</li>`).join('')}</ul>
    <h3>Áreas</h3>
    <div class="chips">${AREAS.filter(a => p.areas.includes(a.k)).map(a => `<button type="button" class="chip" data-area="${a.k}" style="--c:${paleta(a.h,62).ponto}"><span class="pinta"></span>${a.n}</button>`).join('')}</div>
    <h3>Recebeu</h3>${blocoRel(rec, 'a', ROT_REC)}
    <h3>Transmitiu</h3>${blocoRel(exe, 'b', ROT_EXE)}
    <label class="linhagem"><input type="checkbox" id="linhagem" ${estado.linhagem ? 'checked' : ''}> Destacar a linhagem completa, antes e depois</label>`;
  ficha.hidden = false;
}
function abrirFichaEscola(eid){
  const e = CORR(eid), f = FAMILIAS[e.fam], c = paleta(f.h, f.s);
  const membros = P.filter(p => membro(p, eid)).sort((a, b) => a.ak - b.ak);
  const extra = MAC[eid]
    ? `<h3>Reúne as escolas</h3><p class="rel">${e.escs.map(s => `<button type="button" class="ir" data-escola="${s}">${escH(ESC[s].nome)}</button>`).join(', ')}</p>`
    : `<p class="rel"><em>Grande corrente:</em> <button type="button" class="ir" data-escola="${MAPA[eid]}">${escH(MAC[MAPA[eid]].nome)}</button></p>`;
  ficha.innerHTML = `
    <button type="button" class="fechar" aria-label="Fechar ficha">×</button>
    <h2>${escH(e.nome)}</h2>
    <p class="vida"><span class="sw" style="background:${c.ponto}"></span>${escH(f.n)}</p>
    <p class="desc">${md(e.desc)}</p>
    ${extra}
    <h3>Filósofos desta corrente</h3>
    <p class="membros">${membros.map(p => `<button type="button" class="ir" data-ir="${p.id}">${escH(p.nome)}</button> <span style="color:var(--tinta-suave);font-size:.85em">${escH(p.dt)}</span>`).join('<br>')}</p>`;
  ficha.hidden = false;
}
function fecharFicha(silencioso){
  estado.sel = null; estado.selEsc = null; ficha.hidden = true; ficha.innerHTML = '';
  if (!silencioso) aplicarFoco();
}
function selecionar(id){
  estado.sel = id; estado.selEsc = null; estado.hover = null;
  abrirFicha(id); aplicarFoco();
}
function selecionarEscola(eid){
  estado.sel = null; estado.selEsc = eid; estado.hover = null;
  abrirFichaEscola(eid); aplicarFoco();
}
function centralizar(p, suave){
  const livre = rol.clientWidth - (rol.clientWidth > 700 ? Math.min(400, rol.clientWidth * 0.94) : 0);
  rol.scrollTo({left: p.x * G.s - livre / 2, top: p.y * G.s - rol.clientHeight / 2 + EIXO_H, behavior: suave ? 'smooth' : 'auto'});
}
function fixarRotulos(){
  const sl = rol.scrollLeft;
  eixo.querySelectorAll('text[data-xa]').forEach(t => {
    const xa = +t.dataset.xa, xb = +t.dataset.xb;
    t.setAttribute('x', Math.max(xa + 8, Math.min(sl + 8, xb - 170)));
  });
}
rol.addEventListener('scroll', () => requestAnimationFrame(fixarRotulos), {passive: true});
function irPara(id){
  const p = PI[id]; if (!p) return;
  let mudou = false;
  if (estado.periodo && p.per !== estado.periodo){ estado.periodo = p.per; mudou = true; }
  if (estado.area && !p.areas.includes(estado.area)){ estado.area = null; mudou = true; }
  estado.sel = id; estado.selEsc = null;
  if (mudou) render({irPara: id});
  else centralizar(p, true);
  selecionar(id);
}

/* ==========================================================
   CONTROLES
   ========================================================== */
function montarControles(){
  $('#niveis').insertAdjacentHTML('beforeend', Object.entries(NIVEIS).map(([k, v]) =>
    `<button type="button" class="opcao" data-nivel="${k}">${v.n}<small>${k === 'escolas' ? ESCOLAS.length : MACROS.length}</small></button><span class="info" tabindex="0" role="note" aria-label="${escH(v.dica)}" data-dica="${escH(v.dica)}">i</span>`).join(''));
  const per = $('#periodos');
  per.insertAdjacentHTML('beforeend', `<button type="button" class="opcao" data-per="">Toda a história</button>` +
    Object.entries(PERIODOS).map(([k, p]) => `<button type="button" class="opcao" data-per="${k}">${p.n}<small>${p.rotulo}</small></button>`).join(''));
  const ar = $('#areas');
  ar.insertAdjacentHTML('beforeend', `<button type="button" class="opcao" data-area="">Todas</button>` +
    AREAS.map(a => `<button type="button" class="opcao" data-area="${a.k}"><span class="pinta"></span>${a.n}</button>`).join(''));
  $('#nomes').innerHTML = [...P].sort((a, b) => a.nome.localeCompare(b.nome, 'pt')).map(p => `<option value="${escH(p.nome)}">`).join('');
  $('#comoLer').innerHTML = `
    <p>O ponto de cada nome não marca o nascimento: marca a <em>akmé</em>, o “florescimento” que os cronógrafos antigos situavam aos 40 anos (ou a três quartos da vida, para quem morreu antes dos 53). Descartes nasce em 1596 e aparece em 1636, às vésperas do <em>Discurso do método</em>. As datas completas ficam sob o nome, e ao passar o cursor uma barra mostra a vida inteira sobre a régua.</p>
    <p>Para mover o mapa, segure a barra de espaço e arraste com o mouse.</p>
    <p>A escala do tempo não é uniforme: a Antiguidade e a Alta Idade Média estão comprimidas, e cada século ganha mais espaço a partir de 1600.</p>
    <p>As faixas são correntes ou escolas; a cor indica a grande tradição. Passe o cursor sobre um nome para ver suas relações; clique no ponto ou nas datas para abrir a ficha; clique no título de uma faixa para destacar a corrente inteira.</p>
    <p>Nomes sublinhados têm página de estudo: o clique no nome abre a página.</p>
    <p>Ctrl + roda do mouse (ou o gesto de pinça no trackpad) aproxima e afasta a partir do ponto sob o cursor. Abaixo de 100%, o mapa inteiro encolhe; acima, os nomes se espaçam. “Ver o mapa inteiro” enquadra toda a malha na tela.</p>
    <p>As influências aparecem ao passar o cursor sobre um nome ou ao selecioná-lo. A caixa “Mostrar todas as influências” desenha a rede inteira de uma vez.</p>
    <p>Os períodos seguem convenções de manual e se sobrepõem de propósito: a filosofia medieval começa com a patrística, antes do fim da Antiguidade (529, fechamento da escola de Atenas). O Renascimento abre a Moderna, que termina com a morte de Hegel (1831).</p>
    <p>As áreas indicam onde o autor produziu obra relevante, não apenas onde tocou no tema. Ao escolher uma área, o mapa adota a cor dela e mostra só quem trabalhou nela.</p>
    <ul class="familias">${Object.values(FAMILIAS).map(f => { const c = paleta(f.h, f.s); return `<li><span class="sw" style="background:${c.ponto}"></span>${f.n}</li>`; }).join('')}</ul>`;
}
function atualizarControles(){
  document.querySelectorAll('#periodos .opcao').forEach(b => b.setAttribute('aria-pressed', String((b.dataset.per || null) === estado.periodo)));
  document.querySelectorAll('#niveis .opcao').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.nivel === estado.nivel)));
  document.querySelectorAll('#areas .opcao').forEach(b => {
    const k = b.dataset.area || null;
    b.setAttribute('aria-pressed', String(k === estado.area));
    if (k) b.style.setProperty('--c', paleta(AREA[k].h, 62).ponto);
  });
  document.documentElement.style.setProperty('--tom', estado.area ? paleta(AREA[estado.area].h, 62).ponto : '');
  $('#nivel').textContent = Math.round(estado.zoom * 100) + '%';
}

$('#niveis').addEventListener('click', e => {
  const b = e.target.closest('.opcao'); if (!b || b.dataset.nivel === estado.nivel) return;
  estado.nivel = b.dataset.nivel; render({centro: centroAtual()});
});
$('#periodos').addEventListener('click', e => {
  const b = e.target.closest('.opcao'); if (!b) return;
  estado.periodo = b.dataset.per || null; estado.zoom = 1; render({inicio: true});
});
$('#areas').addEventListener('click', e => {
  const b = e.target.closest('.opcao'); if (!b) return;
  const k = b.dataset.area || null;
  estado.area = (k && k === estado.area) ? null : k;
  render({centro: centroAtual()});
});
eixo.addEventListener('click', e => {
  const g = e.target.closest('.eixo-per'); if (!g) return;
  estado.periodo = estado.periodo === g.dataset.per ? null : g.dataset.per; estado.zoom = 1; render({inicio: true});
});
eixo.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.closest('.eixo-per')){ e.preventDefault(); e.target.closest('.eixo-per').dispatchEvent(new MouseEvent('click', {bubbles:true})); } });
function zoomEm(z, cx, cy){
  z = Math.min(3.2, Math.max(0.06, z));
  if (Math.abs(z - estado.zoom) < 0.001) return;
  const c = centroAtual(cx, cy);
  estado.zoom = z; render({centro: c});
}
$('#mais').addEventListener('click', () => zoomEm(estado.zoom * 1.25));
$('#menos').addEventListener('click', () => zoomEm(estado.zoom / 1.25));
$('#enquadrar').addEventListener('click', () => {
  if (estado.zoom > 1){ estado.zoom = 1; render({inicio: true}); }
  const z = Math.min(1, (rol.clientWidth - 16) / G.Wc, (rol.clientHeight - EIXO_H - 16) / G.H);
  estado.zoom = Math.max(0.06, z); render({inicio: true});
});
let _zp = null, _zr = 0;
rol.addEventListener('wheel', e => {
  if (!(e.ctrlKey || e.metaKey)) return;
  e.preventDefault();
  const r = rol.getBoundingClientRect();
  const f = Math.exp(-e.deltaY * (e.deltaMode === 1 ? 0.05 : 0.0018));
  _zp = {f: (_zp ? _zp.f : 1) * f, cx: e.clientX - r.left, cy: e.clientY - r.top};
  if (!_zr) _zr = requestAnimationFrame(() => { _zr = 0; const q = _zp; _zp = null; zoomEm(estado.zoom * q.f, q.cx, q.cy); });
}, {passive: false});
$('#todas').addEventListener('change', e => { estado.todas = e.target.checked; aplicarFoco(); });

// interação com o mapa
mapa.addEventListener('mouseover', e => {
  if (_esp) return;
  const g = e.target.closest('.no');
  if (g){
    const p = PI[g.dataset.id];
    dica.innerHTML = `<strong>${escH(p.nome)}</strong><br><em>${escH(ESC[p.esc].nome)}</em>${p.pag ? '<br>Clique no nome para abrir a página de estudo' : ''}`;
    dica.classList.add('on');
    if (!estado.sel && !estado.selEsc && estado.hover !== p.id){ estado.hover = p.id; aplicarFoco(); }
  }
});
mapa.addEventListener('mousemove', e => {
  if (!dica.classList.contains('on')) return;
  const x = Math.min(innerWidth - dica.offsetWidth - 12, e.clientX + 14), y = Math.min(innerHeight - dica.offsetHeight - 12, e.clientY + 16);
  dica.style.left = x + 'px'; dica.style.top = y + 'px';
});
mapa.addEventListener('mouseout', e => {
  const g = e.target.closest('.no'); if (!g) return;
  if (e.relatedTarget && g.contains(e.relatedTarget)) return;
  dica.classList.remove('on');
  if (estado.hover){ estado.hover = null; aplicarFoco(); }
});
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

mapa.addEventListener('click', e => {
  if (e.target.closest('a')) return;
  const g = e.target.closest('.no'); if (g){ selecionar(g.dataset.id); return; }
  const b = e.target.closest('.banda .cab'); if (b){ selecionarEscola(b.parentNode.dataset.esc); return; }
  if (estado.sel || estado.selEsc) fecharFicha();
});
mapa.addEventListener('keydown', e => {
  const g = e.target.closest('.no');
  if (g && e.key === 'Enter'){ e.preventDefault(); selecionar(g.dataset.id); }
});
ficha.addEventListener('click', e => {
  const t = e.target;
  if (t.closest('.fechar')) { fecharFicha(); return; }
  const ir = t.closest('[data-ir]'); if (ir){ irPara(ir.dataset.ir); return; }
  const ar = t.closest('[data-area]'); if (ar){ estado.area = ar.dataset.area; const s = estado.sel; render({centro: centroAtual()}); if (s && G.vset.has(s)) selecionar(s); return; }
  const es = t.closest('[data-escola]'); if (es){ selecionarEscola(es.dataset.escola); return; }
});
ficha.addEventListener('change', e => { if (e.target.id === 'linhagem'){ estado.linhagem = e.target.checked; aplicarFoco(); } });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && (estado.sel || estado.selEsc)) fecharFicha(); });

// busca
function buscar(v){
  const q = semAcento(v.trim()); if (!q) return;
  const p = P.find(p => semAcento(p.nome) === q) || P.find(p => semAcento(p.nome).startsWith(q)) || P.find(p => semAcento(p.nome).includes(q));
  if (p){ irPara(p.id); $('#busca').blur(); }
}
$('#busca').addEventListener('change', e => buscar(e.target.value));
$('#busca').addEventListener('keydown', e => { if (e.key === 'Enter') buscar(e.target.value); });

// "Como ler" fecha ao clicar fora
document.addEventListener('click', e => { const d = $('#detalhes'); if (d.open && !d.contains(e.target)) d.open = false; });

// redimensionamento e tema
let _t; addEventListener('resize', () => { clearTimeout(_t); _t = setTimeout(() => render({centro: centroAtual()}), 180); });
const _redesenhar = () => { const c = centroAtual(); montarLegenda(); render({centro: c}); if (estado.sel) abrirFicha(estado.sel); else if (estado.selEsc) abrirFichaEscola(estado.selEsc); };
function montarLegenda(){ const ul = document.querySelector('.familias'); if (ul) ul.innerHTML = Object.values(FAMILIAS).map(f => { const c = paleta(f.h, f.s); return `<li><span class="sw" style="background:${c.ponto}"></span>${f.n}</li>`; }).join(''); }
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', _redesenhar);
new MutationObserver(_redesenhar).observe(document.documentElement, {attributes: true, attributeFilter: ['data-theme']});

// início
montarControles();
render({inicio: true});
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { _cw.clear(); render({centro: centroAtual()}); });
