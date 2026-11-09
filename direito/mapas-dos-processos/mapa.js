(function(){
/* ═════════ categorias ═════════ */
const CATS = {
  n:{name:'Rede de entrada', c:'#4F5D6B'}, g:{name:'Parte Geral', c:'#1B5DAB'}, c:{name:'Procedimento comum', c:'#00845A'},
  t:{name:'Tutela provisória', c:'#D22630'}, s:{name:'Cumprimento de sentença', c:'#E2A400'}, e:{name:'Execução', c:'#8B4C9E'},
  r:{name:'Recursos', c:'#E86C00'}, p:{name:'Tribunais e precedentes', c:'#A3174C'}, f:{name:'Procedimentos especiais', c:'#66737D'},
  v:{name:'Jurisdição voluntária', c:'#0B9A8D'}, x:{name:'Leis extravagantes', c:'#9A5B2A'}, j:{name:'Juizado Especial Cível', c:'#3A97D4'},
  kn:{name:'Admissibilidade', c:'#4F5D6B'}, ka:{name:'Ação direta de inconstitucionalidade', c:'#1B5DAB'}, kc:{name:'Ação declaratória de constitucionalidade', c:'#00845A'},
  ko:{name:'ADI por omissão', c:'#E86C00'}, kp:{name:'Arguição de descumprimento de preceito fundamental', c:'#8B4C9E'}, kd:{name:'Controle difuso', c:'#A3174C'},
  kf:{name:'Efeitos e garantia da decisão', c:'#E2A400'}, kt:{name:'Processo objetivo', c:'#0B9A8D'}, kl:{name:'Jurisdição constitucional das liberdades', c:'#9A5B2A'},
  ke:{name:'Controle estadual', c:'#3A97D4'}, kx:{name:'Outros mecanismos de controle', c:'#66737D'},
  pn:{name:'Triagem', c:'#4F5D6B'}, pc:{name:'Rito comum ordinário', c:'#1B5DAB'}, pr:{name:'Recursos e impugnações', c:'#8B4C9E'},
  pe:{name:'Execução penal', c:'#E2A400'}, ps:{name:'Rito comum sumário', c:'#3A97D4'}, pj:{name:'Tribunal do Júri', c:'#A3174C'},
  pk:{name:'Juizado Especial Criminal', c:'#E86C00'}, pg:{name:'Garantias e controle', c:'#0B9A8D'}, pp:{name:'Prisões e cautelares', c:'#D22630'},
  pv:{name:'Provas', c:'#5B6FA8'}, pf:{name:'Procedimentos especiais', c:'#66737D'}, pi:{name:'Incidentes e medidas', c:'#9A5B2A'},
  en:{name:'Título e cálculo', c:'#4F5D6B'}, ea:{name:'Ingresso e regime inicial', c:'#66737D'}, ef:{name:'Regime fechado', c:'#A3174C'},
  ew:{name:'Regime semiaberto', c:'#E86C00'}, eh:{name:'Regime aberto', c:'#00845A'}, el:{name:'Livramento condicional', c:'#1B5DAB'},
  ex:{name:'Extinção da pena', c:'#2B3A47'}, er:{name:'Penas restritivas de direitos', c:'#0B9A8D'}, es:{name:'Suspensão condicional da pena', c:'#3A97D4'},
  em:{name:'Pena de multa', c:'#9A5B2A'}, ed:{name:'Medida de segurança', c:'#8B4C9E'}, eb:{name:'Direitos, disciplina e benefícios', c:'#5B6FA8'},
  ei:{name:'Incidentes de execução', c:'#66737D'}, eo:{name:'Situações especiais', c:'#D22630'}, ec:{name:'Controle das condições de custódia', c:'#B45309'},
  wa:{name:'Admissibilidade', c:'#4F5D6B'}, wc:{name:'Fase de conhecimento', c:'#00845A'}, wr:{name:'Recursos', c:'#E86C00'},
  wx:{name:'Liquidação e execução', c:'#8B4C9E'}, ws:{name:'Rito sumaríssimo', c:'#3A97D4'}, wi:{name:'Inquérito para apuração de falta grave', c:'#A3174C'},
  wh:{name:'Homologação de acordo extrajudicial', c:'#0B9A8D'}, wd:{name:'Dissídio coletivo', c:'#B45309'}, wb:{name:'Institutos transversais', c:'#5B6FA8'},
  wg:{name:'Ações especiais', c:'#66737D'}, we:{name:'Meios extrajudiciais', c:'#9A5B2A'}, wt:{name:'Grandes teses', c:'#D22630'}
};
const catOf = id => id==='x1' ? 'j' : id.replace(/\d+$/,'');
const col = id => (CATS[catOf(id)]||CATS.n).c;
const ALLST = ST.concat(KST, PST, EST, WST);
const S = Object.fromEntries(ALLST.map(s=>[s.id,s]));
const strip = h => h.replace(/<[^>]+>/g,'');
const norm = t => strip(t).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\.(?=\d)/g,'');
const tagOf = s => s.tg || (s.end ? 'Encerra o processo' : '') || (s.jump ? 'Salta para '+strip(S[s.jump].n) : '');
const incoming = {}; ALLST.forEach(s=>(s.r||[]).forEach(t=>(incoming[t]=incoming[t]||[]).push(s.id)));

/* ═════════ geometria ═════════ */
const COLW = 200, NETX = [60,420,780,1140], NETW = 310, GATEX = 1570, X0 = 1790;
const BAND_TOP = 64, BAR_H = 30, UP = [132,228,324], DOWN = [100,180,260];
const cx = c => X0 + c*COLW;
let M = null, W = 4000, H = 2000, bandOn = false, geo = {}, Y = {}, CTX = {}, zoom = .8, laneY = {};
const stage = document.getElementById('stage'), sizer = document.getElementById('sizer'), vp = document.getElementById('vp');

function rows(l, side){ return Math.max(0, ...Object.keys(l.cols).map(id=>((M.br[id]||{})[side]||[]).length)); }
function computeY(){
  const bb = bandOn ? BAND_TOP + M.bars.length*BAR_H : 40;
  laneY = {};
  let y = bb + (UP[rows(M.lanes[0],'up')-1]||240) + 68;
  M.lanes.forEach((l,i)=>{
    if(i>0){ const p=M.lanes[i-1]; y += (DOWN[rows(p,'down')-1]||40) + 160 + (UP[rows(l,'up')-1]||0); }
    laneY[l.key] = y;
  });
  const last = M.lanes[M.lanes.length-1];
  const t = laneY[M.lanes[0].key];
  Y = {bb, t, v:t+290, g: Math.max(laneY[last.key] + (DOWN[rows(last,'down')-1]||40) + 170, t+560)};
}

/* ═════════ desenho ═════════ */
function el(tag, cls, css, html){ const n=document.createElement(tag); if(cls) n.className=cls; if(css) Object.assign(n.style,css); if(html!=null) n.innerHTML=html; stage.appendChild(n); return n; }
function nodeEl(id, kind, x, y){
  const s=S[id]; const tg = kind==='bst' ? '' : tagOf(s);
  const b=el('button',`nd ${kind}${s.end||s.fin?' end':''}`,{left:x+'px',top:y+'px'});
  b.type='button'; b.dataset.id=id; b.style.setProperty('--c',col(id));
  b.innerHTML=`<span class="dot"></span><span class="lb"><span class="nm">${kind==='bst'?(SHORT[id]||s.n):s.n}</span>${kind==='bst'?'':`<span class="ar">${s.a}</span>`}${tg?`<span class="tg">${tg}</span>`:''}</span>`;
  geo[id]={x,y,kind}; return b;
}
function chipHTML(id){ const s=S[id]; return `<button type="button" class="chip${s.end?' end':''}" data-id="${id}" style="--c:${col(id)}"><span class="cd"></span><span><span class="cn">${s.n}</span><span class="ca">${s.a}</span></span></button>`; }
function phaseX(p){ return [p.a==null ? 0 : cx(p.a), p.b==null ? cx(-0.6) : cx(p.b)]; }

function render(){
  computeY(); geo = {}; CTX = {}; stage.innerHTML = '';
  W = Math.round(cx(M.lastCol) + 40);
  const parts = [];
  const line = (x1,y1,x2,y2,c,w,dash) => parts.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${dash?` stroke-dasharray="${dash}"`:''}/>`);
  const path = (d,c,w,dash,arrow) => parts.push(`<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${dash?` stroke-dasharray="${dash}"`:''}${arrow?' marker-end="url(#arr)"':''}/>`);
  const netC = CATS.n.c;

  M.phases.forEach((p,i)=>{ const [x0,x1]=phaseX(p); p.left=x0;
    el('div','phase'+(i%2?'':' alt'),{left:x0+'px',width:(x1-x0)+'px'},`<span class="ph-l">${p.name}</span>`); });

  if(bandOn) M.bars.forEach((b,i)=>{
    const y = BAND_TOP + i*BAR_H + 15, c = col(b.id);
    b.span.forEach(([a,z])=>{ const n=el('div','barline',{left:cx(a)+'px',width:(cx(z)-cx(a))+'px',top:(y-3)+'px'}); n.style.setProperty('--c',c); });
    const lb = el('button','barlb',{left:(cx(b.span[0][0])-10)+'px',top:y+'px'}, `${b.lb}<i></i>`);
    lb.type='button'; lb.dataset.id=b.id; lb.style.setProperty('--c',c);
    geo[b.id]={x:cx(b.span[0][0]),y,kind:'bar'}; CTX[b.id]={bar:true};
    (b.st||[]).forEach(([id,cc])=>{ nodeEl(id,'bst',cx(cc),y); CTX[id]={onBar:b.id}; });
  });

  // rede de entrada
  path(`M 20 ${Y.t} L ${GATEX} ${Y.t}`, netC, 8);
  const boxes = M.net.map((g,i)=>{
    const b = el('div','box netbox',{left:NETX[i]+'px',width:NETW+'px'});
    b.innerHTML = `<h3>${g.t}</h3><p>${g.p}</p><div class="chips">${g.ids.map(chipHTML).join('')}</div>`;
    g.ids.forEach(id=>{ CTX[id]={net:g.t}; geo[id]={kind:'chip'}; });
    return b;
  });
  boxes.forEach((b,i)=>{ const h=b.offsetHeight; b.style.top=(Y.t-h/2)+'px'; const xb=NETX[i]+NETW/2; line(xb, Y.t+h/2, xb, Y.v, netC, 2.5, '6 5'); });
  line(NETX[0]+NETW/2, Y.v, NETX[3]+NETW/2, Y.v, netC, 2.5, '6 5');
  const fork = (NETX[1]+NETX[2]+NETW)/2;
  path(`M ${fork} ${Y.v} L ${fork} ${Y.v+50} L 600 ${Y.v+50} L 600 ${Y.v+100}`, netC, 2.5, '6 5');
  path(`M ${fork} ${Y.v+50} L 940 ${Y.v+50} L 940 ${Y.v+100}`, netC, 2.5, '6 5');
  nodeEl(M.fix,'free',600,Y.v+110); CTX[M.fix]={net:'Saída da rede'};
  nodeEl(M.end,'free',940,Y.v+110); CTX[M.end]={net:'Saída da rede'};
  path(`M 600 ${Y.v+120} L 600 ${Y.v+190} L ${GATEX} ${Y.v+190} L ${GATEX} ${Y.t+24}`, netC, 2.5, '6 5', true);
  el('div','note',{left:(NETX[0]+NETW/2+10)+'px',top:(Y.v-24)+'px'},M.netNote);
  el('div','note',{left:'1180px',top:(Y.v+164)+'px'},'Corrigido o vício, retoma a rota');
  nodeEl(M.gate,'gate',GATEX,Y.t); CTX[M.gate]={gate:true};

  // trilhos
  M.lanes.forEach((l,li)=>{
    const ly = laneY[l.key], ids = Object.keys(l.cols), xs = id => cx(l.cols[id]);
    if(li===0){
      line(GATEX, ly, xs(ids[0]), ly, col(ids[0]), 8);
      for(let i=1;i<ids.length;i++) line(xs(ids[i-1]),ly,xs(ids[i]),ly,col(l.src ? ids[i-1] : ids[i]),8);
      el('div','lane-l',{left:(cx(0)+16)+'px',top:(ly+12)+'px',width:'170px'}, l.label);
    } else {
      const c = CATS[l.cat].c, k = 120 - li*12;
      if(l.from){ const fx = cx(M.lanes[0].cols[l.from]);
        path(`M ${fx} ${Y.t} C ${fx+100} ${Y.t}, ${fx+40} ${ly}, ${fx+160} ${ly} L ${xs(ids[0])} ${ly}`, c, 8); }
      else path(`M ${GATEX} ${Y.t} C ${GATEX+k} ${Y.t}, ${GATEX+40} ${ly}, ${cx(-0.5)} ${ly} L ${xs(ids[0])} ${ly}`, c, 8);
      for(let i=1;i<ids.length;i++) line(xs(ids[i-1]),ly,xs(ids[i]),ly,c,8);
      el('div','lane-l',{left:((l.from ? cx(M.lanes[0].cols[l.from])+176 : cx(0)+16))+'px',top:(ly+12)+'px',width:'170px'}, l.label);
      if(l.merge){ const last=ids[ids.length-1], tx=cx(M.lanes[0].cols[l.merge])+(l.mdx||0), ty=laneY[M.lanes[0].key];
        path(`M ${xs(last)} ${ly} L ${tx-40} ${ly} Q ${tx} ${ly} ${tx} ${ly-40} L ${tx} ${ty+14}`, c, 8); }
    }
    ids.forEach(id=>{ nodeEl(id,'trunk',xs(id),ly); CTX[id]={lane:l.key}; });
    (l.notes||[]).forEach(([cc,txt])=>el('div','note',{left:cx(cc)+'px',top:(ly-26)+'px'},txt));
  });

  // ramais
  Object.entries(M.br).forEach(([p,{up=[],down=[]}])=>{
    const g = geo[p]; if(!g) return;
    up.forEach((id,i)=>{ const x=g.x-i*44, y=g.y-UP[i]; line(g.x,g.y,x,y,col(id),4); nodeEl(id,'branch',x,y); CTX[id]={parent:p}; });
    down.forEach((id,i)=>{ const x=g.x-i*44, y=g.y+DOWN[i]; line(g.x,g.y,x,y,col(id),4); nodeEl(id,'branch',x,y); CTX[id]={parent:p}; });
  });

  // saltos
  M.st.forEach(s=>{ if(!s.jump||!geo[s.id]||!geo[s.jump]) return;
    const a=geo[s.id], b=geo[s.jump], up=a.y<b.y, ty=b.y+(up?-16:16);
    if(b.x < a.x){ path(`M ${a.x-10} ${a.y} L ${b.x+COLW*0.4} ${a.y} Q ${b.x+8} ${a.y} ${b.x+8} ${ty}`, col(s.id), 2.5, '6 5', true); return; }
    const xe=b.x-COLW*0.45;
    path(`M ${a.x+168} ${a.y} L ${xe} ${a.y} Q ${b.x-26} ${a.y} ${b.x-26} ${ty+4}`, col(s.id), 2.5, '6 5', true);
  });

  // outras vias
  path(`M ${GATEX} ${Y.t} C ${GATEX+70} ${Y.t}, ${GATEX+10} ${Y.g+28}, ${cx(-0.5)} ${Y.g+28} L ${cx(-0.3)} ${Y.g+28}`, CATS.f.c, 5, '2 9');
  el('div','lane-l r',{left:(cx(-0.3)-14)+'px',top:(Y.g+40)+'px',transform:'translateX(-100%)'},'Outras vias de ingresso');
  let gmax = 0;
  M.groups.forEach(g=>{
    const b = el('div','box grp',{left:cx(g.a-0.3)+'px',top:Y.g+'px',width:(g.w*COLW)+'px'});
    b.style.borderTop = `5px solid ${col(g.ids[0])}`;
    b.innerHTML = `<h3>${g.t}</h3><p>${g.p}</p><div class="chips">${g.ids.map(chipHTML).join('')}</div>`;
    g.ids.forEach(id=>{ CTX[id]={grp:g.t}; geo[id]={kind:'chip'}; });
    gmax = Math.max(gmax, b.offsetHeight);
  });

  H = Math.round(Y.g + gmax + 90);
  const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('class','wires'); svg.setAttribute('width',W); svg.setAttribute('height',H);
  svg.innerHTML = `<defs><marker id="arr" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1 L8 5 L1 9" fill="none" stroke="context-stroke" stroke-width="1.8"/></marker></defs>${parts.join('')}`;
  stage.insertBefore(svg, stage.querySelector('.barline, .box, .nd'));
  stage.style.width = W+'px'; stage.style.height = H+'px';
  applyZoom(); buildMini(); applySearch(); markOn();
}

/* ═════════ zoom e navegação ═════════ */
const zval = document.getElementById('zval');
function applyZoom(){ stage.style.transform = `scale(${zoom})`; sizer.style.width = W*zoom+'px'; sizer.style.height = H*zoom+'px'; zval.textContent = Math.round(zoom*100)+'%'; updateMini(); }
function setZoom(z, ax, ay){
  z = Math.min(1.6, Math.max(.22, z));
  const r = vp.getBoundingClientRect(); ax = ax ?? r.width/2; ay = ay ?? r.height/2;
  const sx = (vp.scrollLeft+ax)/zoom, sy = (vp.scrollTop+ay)/zoom;
  zoom = z; applyZoom(); vp.scrollLeft = sx*zoom - ax; vp.scrollTop = sy*zoom - ay;
}
document.getElementById('zin').onclick = ()=>setZoom(zoom*1.2);
document.getElementById('zout').onclick = ()=>setZoom(zoom/1.2);
document.getElementById('zfit').onclick = ()=>{ setZoom(Math.min(vp.clientWidth/W, vp.clientHeight/H)); vp.scrollTo(0,0); };
vp.addEventListener('wheel', e=>{ if(!(e.ctrlKey||e.metaKey)) return; e.preventDefault(); const r=vp.getBoundingClientRect(); setZoom(zoom*(e.deltaY<0?1.1:1/1.1), e.clientX-r.left, e.clientY-r.top); }, {passive:false});
let drag = null;
vp.addEventListener('pointerdown', e=>{ if(e.button!==0 || e.target.closest('button, input, .box')) return;
  drag = {x:e.clientX, y:e.clientY, l:vp.scrollLeft, t:vp.scrollTop}; vp.setPointerCapture(e.pointerId); });
vp.addEventListener('pointermove', e=>{ if(!drag) return; const dx=e.clientX-drag.x, dy=e.clientY-drag.y; if(Math.abs(dx)+Math.abs(dy)>4) vp.classList.add('drag'); vp.scrollLeft=drag.l-dx; vp.scrollTop=drag.t-dy; });
const endDrag = ()=>{ drag=null; vp.classList.remove('drag'); };
vp.addEventListener('pointerup', endDrag); vp.addEventListener('pointercancel', endDrag);

const phnav = document.getElementById('phnav');
function buildPhnav(){ phnav.innerHTML = M.phases.map(p=>`<button type="button" data-ph="${p.id}">${p.name.replace('Fase ','').replace(/^./,c=>c.toUpperCase())}</button>`).join(''); }
phnav.addEventListener('click', e=>{ const b=e.target.closest('[data-ph]'); if(!b) return; const p=M.phases.find(x=>x.id===b.dataset.ph);
  vp.scrollTo({left:Math.max(0,p.left*zoom-20), top:Math.max(0,Y.t*zoom - vp.clientHeight*0.55), behavior:'smooth'}); });
function bandsOpen(){ if(bandOn) return; bandOn=true; document.getElementById('bands').checked=true; const l=vp.scrollLeft; render(); vp.scrollLeft=l; vp.scrollTop=Math.max(0,Y.t*zoom - vp.clientHeight*0.55); }
document.getElementById('bands').addEventListener('change', e=>{ bandOn = e.target.checked; const l=vp.scrollLeft; render(); vp.scrollLeft=l; vp.scrollTop = bandOn ? 0 : Math.max(0, Y.t*zoom - vp.clientHeight*0.55); });

function focusNode(id){
  if(!bandOn && M.bars.some(b=>b.id===id)) bandsOpen();
  const n = stage.querySelector(`[data-id="${id}"]`); if(!n) return;
  const r = n.getBoundingClientRect(), v = vp.getBoundingClientRect();
  const pw = panel.classList.contains('open') && innerWidth>760 ? 480 : 0;
  vp.scrollBy({left: r.left - v.left - (v.width-pw)/2 + 60, top: r.top - v.top - v.height/2, behavior:'smooth'});
}

/* ═════════ minimapa ═════════ */
const mini = document.getElementById('mini'); const mw = 170;
if(localStorage.getItem('ariadne-ritos-mini')==='0') mini.classList.add('fechado'); let mh = 100, vw;
function buildMini(){
  mh = Math.round(mw*H/W);
  const k = mw/W, s = v => (v*k).toFixed(1);
  const bands = M.phases.map((p,i)=>{ const [x0,x1]=phaseX(p); return `<rect x="${s(x0)}" y="0" width="${s(x1-x0)}" height="${mh}" fill="${i%2?'transparent':'var(--paper2)'}"/>`; }).join('');
  const bars = bandOn ? M.bars.map((b,i)=>b.span.map(([a,z])=>`<rect x="${s(cx(a))}" y="${s(BAND_TOP+i*BAR_H+12)}" width="${s(cx(z)-cx(a))}" height="1.2" fill="${col(b.id)}" opacity=".7"/>`).join('')).join('') : '';
  const lanes = M.lanes.map((l,i)=>{ const ids=Object.keys(l.cols), ly=laneY[l.key], x1=cx(l.cols[ids[ids.length-1]]);
    const c = i===0 ? col(ids[0]) : CATS[l.cat].c;
    const sx0 = l.from ? cx(M.lanes[0].cols[l.from]) : GATEX, sx1 = l.from ? sx0+160 : cx(0);
    let d = i===0 ? `M ${s(GATEX)} ${s(ly)} L ${s(x1)} ${s(ly)}` : `M ${s(sx0)} ${s(Y.t)} L ${s(sx1)} ${s(ly)} L ${s(x1)} ${s(ly)}`;
    if(l.merge){ const tx=cx(M.lanes[0].cols[l.merge]); d += ` L ${s(tx)} ${s(ly)} L ${s(tx)} ${s(Y.t)}`; }
    return `<path d="${d}" stroke="${c}" stroke-width="2.2" fill="none"/>`; }).join('');
  mini.innerHTML = `<div class="mt" data-tog="1"><span>Visão geral</span><span>${mini.classList.contains('fechado')?'abrir':'recolher'}</span></div><svg width="${mw}" height="${mh}">${bands}${bars}<path d="M 0 ${s(Y.t)} L ${s(GATEX)} ${s(Y.t)}" stroke="${CATS.n.c}" stroke-width="2.2"/>${lanes}<rect x="${s(cx(-0.3))}" y="${s(Y.g)}" width="${s(W-cx(-0.3)-60)}" height="${s(H-Y.g-90)}" fill="none" stroke="var(--rule)"/></svg><div class="vw"></div>`;
  vw = mini.querySelector('.vw'); updateMini();
}
function updateMini(){ if(!vw) return; const k = mw/(W*zoom);
  Object.assign(vw.style,{left:(6+vp.scrollLeft*k)+'px', top:(24+vp.scrollTop*k)+'px', width:Math.min(mw,vp.clientWidth*k)+'px', height:Math.min(mh,vp.clientHeight*k)+'px'}); }
vp.addEventListener('scroll', updateMini, {passive:true}); addEventListener('resize', updateMini);
let mdrag=false;
const miniGo = e=>{ const r=mini.querySelector('svg').getBoundingClientRect(); vp.scrollLeft=(e.clientX-r.left)/mw*W*zoom-vp.clientWidth/2; vp.scrollTop=(e.clientY-r.top)/mh*H*zoom-vp.clientHeight/2; };
mini.addEventListener('pointerdown', e=>{ if(e.target.closest('[data-tog]')){ const f=mini.classList.toggle('fechado'); localStorage.setItem('ariadne-ritos-mini', f?'0':'1'); mini.querySelector('[data-tog] span:last-child').textContent=f?'abrir':'recolher'; updateMini(); return; } if(mini.classList.contains('fechado')) return; mdrag=true; mini.setPointerCapture(e.pointerId); miniGo(e); });
mini.addEventListener('pointermove', e=>{ if(mdrag) miniGo(e); });
mini.addEventListener('pointerup', ()=>mdrag=false);

/* ═════════ busca ═════════ */
const q = document.getElementById('q'), count = document.getElementById('count');
let index = [], hits = [], hitI = -1;
function buildIndex(){ index = M.st.map(s=>({id:s.id,t:norm([s.n,SHORT[s.id]||'',s.a,s.s,(s.t||[]).join(' '),(s.d||[]).join(' '),(s.j||[]).join(' '),s.x||'',CATS[catOf(s.id)].name].join(' '))})); }
function applySearch(){
  const v = norm(q.value.trim());
  hits = v ? index.filter(({t})=>v.split(/\s+/).every(w=>t.includes(w))).map(o=>o.id) : [];
  const set = new Set(hits);
  stage.querySelectorAll('[data-id]').forEach(n=>{ const ok=!v||set.has(n.dataset.id); n.classList.toggle('dim',!ok); n.classList.toggle('hit',!!v&&ok); });
  count.textContent = v ? (hits.length ? `${hits.length} ${hits.length===1?'resultado':'resultados'}; Enter percorre` : 'nenhum resultado') : '';
}
q.addEventListener('input', ()=>{ hitI=-1; applySearch(); });
q.addEventListener('keydown', e=>{ if(e.key==='Enter' && hits.length){ e.preventDefault(); hitI=(hitI+1)%hits.length; focusNode(hits[hitI]); } });

/* ═════════ painel ═════════ */
const panel = document.getElementById('panel'), body = document.getElementById('pbody'), scrim = document.getElementById('scrim'), back = document.getElementById('back');
let stack = [], lastTrigger = null, current = null;
const list = (title, arr) => arr && arr.length ? `<section class="p-sec"><h4>${title}</h4><ul>${arr.map(x=>`<li>${x}</li>`).join('')}</ul></section>` : '';
const routeBtn = id => `<button type="button" class="route" data-go="${id}" style="--c:${col(id)}"><i></i><span><b>${S[id].n}</b><span class="m">${CATS[catOf(id)].name}, ${S[id].a}</span></span></button>`;
function where(id){
  const c = CTX[id]||{}, s = S[id], tg = tagOf(s); let w = '';
  if(c.lane){ const l=M.lanes.find(x=>x.key===c.lane); w = (M.lanes[0]===l ? 'Trilho principal: ' : 'Trilho: ')+l.label+'.'; }
  else if(c.parent) w = `Ramal de <b>${S[c.parent].n}</b>.`;
  else if(c.onBar) w = `Na faixa transversal <b>${S[c.onBar].n}</b>.`;
  else if(c.bar) w = 'Faixa transversal: vale ao longo de todo o trecho marcado na rota.';
  else if(c.net) w = `Rede de entrada: <b>${c.net}</b>.`;
  else if(c.grp) w = `Outras vias de ingresso: <b>${c.grp}</b>.`;
  else if(c.gate) w = 'Ponto de partida dos trilhos.';
  if(tg) w += ' '+tg+'.';
  return w;
}
function markOn(){ stage.querySelectorAll('.on').forEach(e=>e.classList.remove('on')); if(current) stage.querySelectorAll(`[data-id="${current}"]`).forEach(e=>e.classList.add('on')); }
function renderPanel(id){
  const s = S[id]; current = id; panel.style.setProperty('--c', col(id));
  const inMap = x => !!CTX[x] || M.st.some(z=>z.id===x);
  const out = (s.r||[]).filter(inMap), inc = (incoming[id]||[]).filter(x=>!out.includes(x) && inMap(x));
  body.innerHTML = `
    <div class="p-cat"><i></i><span>${CATS[catOf(id)].name}</span></div>
    <h3 id="p-title">${s.n}</h3>
    <div class="p-art">${s.a}</div>
    <p class="p-where">${where(id)}</p>
    <section class="p-sec"><h4>Em síntese</h4><p>${s.s}</p></section>
    ${list('Fundamentos teóricos', s.t)}
    ${list('Doutrina de referência', s.d)}
    ${list('Jurisprudência e súmulas', s.j)}
    ${s.x ? `<section class="p-sec p-warn"><h4>Alteração legislativa</h4><p>${s.x}</p></section>` : ''}
    ${out.length ? `<section class="p-sec"><h4>Para onde seguir</h4><div class="routes">${out.map(routeBtn).join('')}</div></section>` : ''}
    ${inc.length ? `<section class="p-sec"><h4>Chega-se aqui a partir de</h4><div class="routes">${inc.map(routeBtn).join('')}</div></section>` : ''}`;
  body.scrollTop = 0; markOn(); back.hidden = stack.length < 2;
  setHash(id);
}
function open(id, fresh){
  if(!S[id]) return;
  if(fresh) stack=[id]; else stack.push(id);
  renderPanel(id);
  panel.classList.add('open'); panel.setAttribute('aria-hidden','false'); scrim.classList.add('on');
  setTimeout(()=>body.focus({preventScroll:true}),60);
}
function close(){
  panel.classList.remove('open'); panel.setAttribute('aria-hidden','true'); scrim.classList.remove('on');
  stack=[]; current=null; markOn(); setHash();
  if(lastTrigger && document.contains(lastTrigger)) lastTrigger.focus({preventScroll:true});
}
stage.addEventListener('click', e=>{ const b=e.target.closest('[data-id]'); if(!b) return; lastTrigger=b; open(b.dataset.id,true); });
body.addEventListener('click', e=>{ const b=e.target.closest('[data-go]'); if(!b) return; open(b.dataset.go,false); focusNode(b.dataset.go); lastTrigger=stage.querySelector(`[data-id="${b.dataset.go}"]`); });
back.addEventListener('click', ()=>{ stack.pop(); const id=stack[stack.length-1]; if(id){ renderPanel(id); focusNode(id); } });
document.getElementById('close').addEventListener('click', close);
scrim.addEventListener('click', close);
document.addEventListener('keydown', e=>{ if(e.key==='Escape' && panel.classList.contains('open')) close(); });

/* ═════════ tela inicial e roteamento ═════════ */
function setHash(id){ try{ history.replaceState(null,'', M ? '#'+M.key+(id?'/'+id:'') : location.pathname+location.search); }catch(_){} }
function preview(m){
  const F=v=>Number.isFinite(v), lo=Math.min(-1.6,...m.phases.map(p=>p.a).filter(F)), hi=Math.max(...[m.lastCol,...m.phases.map(p=>p.b),...m.lanes.flatMap(l=>Object.values(l.cols))].filter(F)), n=m.lanes.length, gap=n>4?22:28, H=24+n*gap;
  const X=c=>(44+(c-lo)/(hi-lo)*540).toFixed(1), Yl=i=>24+i*gap, t=m.lanes[0];
  const bands=m.phases.map((p,i)=>{ if(i%2) return ''; const pa=F(p.a)?p.a:lo, pb=F(p.b)?p.b:-0.6; return `<rect x="${X(pa)}" y="0" width="${(X(pb)-X(pa)).toFixed(1)}" height="${H}" fill="var(--paper2)"/>`; }).join('');
  const lanes=m.lanes.map((l,i)=>{ const cs=Object.values(l.cols), a=Math.min(...cs), z=Math.max(...cs), y=Yl(i), c=i===0?col(Object.keys(l.cols)[0]):CATS[l.cat].c;
    let d=`M ${i===0?20:X(a)} ${y} L ${X(z)} ${y}`;
    if(i>0&&l.from&&t.cols[l.from]!=null){ const fx=X(t.cols[l.from]); d=`M ${fx} ${Yl(0)} C ${fx} ${y}, ${fx} ${y}, ${X(a)} ${y} L ${X(z)} ${y}`; }
    if(i>0&&l.merge&&t.cols[l.merge]!=null){ const mx=X(t.cols[l.merge]); d+=` C ${mx} ${y}, ${mx} ${y}, ${mx} ${Yl(0)}`; }
    const dots=cs.map(v=>`<circle cx="${X(v)}" cy="${y}" r="${i===0?4:3.2}" fill="var(--paper)" stroke="${c}" stroke-width="2.4"/>`).join('');
    return `<path class="ln" d="${d}" stroke="${c}" stroke-width="${i===0?4.5:3}" fill="none" stroke-linecap="round"/>${dots}`; });
  return `<svg class="pv" viewBox="0 0 600 ${H}" aria-hidden="true">${bands}${lanes.slice(1).join('')}${lanes[0]}<circle cx="20" cy="${Yl(0)}" r="8" fill="var(--paper)" stroke="var(--ink)" stroke-width="3.5"/></svg>`;
}
document.getElementById('versao').textContent = 'Versão de '+VERSAO+'; conteúdo conferido em outubro de 2026.';
document.getElementById('cards').innerHTML = ['constitucional','penal','execucao','civil','trabalho'].map(k=>MAPS[k]).map((m,i)=>`<button type="button" class="card" data-map="${m.key}"><span class="num">${String(i+1).padStart(2,'0')}</span><span class="cb"><span class="h2">${m.short}<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span><span class="pp">${m.card}</span><span class="stats"><span><b>${m.st.length}</b>estações</span><span><b>${m.lanes.length}</b>trilhos</span><span><b>${m.bars.length}</b>faixas</span></span></span>${preview(m)}</button>`).join('');
document.getElementById('cards').addEventListener('click', e=>{ const c=e.target.closest('[data-map]'); if(c) openMap(c.dataset.map); });
document.getElementById('home').addEventListener('click', goHub);

function openMap(key, nodeId){
  M = MAPS[key]; if(!M) return goHub();
  document.body.classList.remove('on-hub');
  document.getElementById('mtitle').textContent = M.title;
  document.getElementById('mlede').textContent = M.lede;
  document.getElementById('bandsLb').textContent = 'Faixas transversais ('+M.bars.length+')'; document.getElementById('info').open=false;
  document.title = M.title;
  q.value=''; close(); buildIndex(); buildPhnav(); zoom = .8; render();
  vp.scrollLeft = 0; vp.scrollTop = Math.max(0, Y.t*zoom - vp.clientHeight*0.55);
  setHash();
  if(nodeId && S[nodeId]){ open(nodeId,true); setTimeout(()=>focusNode(nodeId),120); }
}
function goHub(){ close(); M = null; document.body.classList.add('on-hub'); document.title = 'Mapas dos Processos'; setHash(); }

function route(){
  const [hk, hn] = decodeURIComponent(location.hash.slice(1)).split('/');
  if(MAPS[hk]){ if(!M || M.key!==hk) openMap(hk, hn); else if(hn && S[hn] && hn!==current){ open(hn,true); focusNode(hn); } }
}
route(); addEventListener('hashchange', route);
if(document.fonts && document.fonts.ready) document.fonts.ready.then(()=>{ if(!M) return; const l=vp.scrollLeft, t=vp.scrollTop; render(); vp.scrollLeft=l; vp.scrollTop=t; });
})();
