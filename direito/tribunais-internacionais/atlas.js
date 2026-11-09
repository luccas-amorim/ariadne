/* Atlas dos Tribunais Internacionais — mapas, quadro, cronologia e gaveta de fichas. Lê geo.js e dados.js. */
T.forEach(t=>{t.c=CITY[t.id]; t.c2=CITY2[t.id]; if(N26[t.id]) t.n26=N26[t.id];});
const famOrder = Object.keys(FAM);
const sorted = famOrder.flatMap(f => T.filter(t=>t.f===f).sort((a,b)=>a.ini-b.ini || (a.op??9999)-(b.op??9999)));
const byId = Object.fromEntries(T.map(t=>[t.id,t]));
const isBR = t => /^sim/.test(t.br);
const tip = document.getElementById("tip");
function showTip(e,txt){tip.textContent=txt;tip.style.left=Math.min(e.clientX+14,innerWidth-310)+"px";tip.style.top=(e.clientY+14)+"px";tip.style.opacity=1;}
function hideTip(){tip.style.opacity=0;}
const yrs = t => `${t.op ?? "—"}${t.fim ? "–"+t.fim : (t.op?"–":"")}`;

// ===== Gaveta
const drawer=document.getElementById("drawer"), scrim=document.getElementById("scrim");
let lastFocus=null;
function card(t){
  const per = `${t.op ?? "não instalado"}${t.fim ? "–"+t.fim : (t.op?"–hoje":"")}`;
  return `<article class="card" style="--fc:var(${FAM[t.f].c})">
    <div class="top"><h4>${t.n}<span class="sig">${t.s} · ${FAM[t.f].n}</span></h4><span class="pill" style="color:var(${ST[t.st].c})">${ST[t.st].n}</span></div>
    ${t.n26?`<div class="n26"><b>2026 · ${t.n26[0]}</b><br>${t.n26[1]}</div>`:""}
    <dl>
      <dt>Criação</dt><dd><span class="yr">${t.ini}</span> · ${t.ins}</dd>
      <dt>Funciona</dt><dd><span class="yr">${per}</span></dd>
      <dt>Sede</dt><dd>${t.sede}</dd>
      <dt>Mantenedor</dt><dd>${t.mant}</dd>
      <dt>Estados vinculados</dt><dd>${t.est}</dd>
    </dl>
    ${t.br && t.br!=="—" && t.br!=="não se aplica" ? `<div class="brl">Brasil: <b>${t.br}</b></div>`:""}
    ${t.nota?`<div class="note">${t.nota}</div>`:""}
  </article>`;
}
function openDrawer(title, sub, items){
  lastFocus=document.activeElement;
  document.getElementById("dTitle").innerHTML = `${title}<small>${sub}</small>`;
  document.getElementById("dBody").innerHTML = items.map(card).join("");
  document.getElementById("dBody").scrollTop=0;
  drawer.hidden=false; scrim.hidden=false; document.getElementById("dClose").focus(); hideTip();
}
function closeDrawer(){drawer.hidden=true;scrim.hidden=true;if(lastFocus)lastFocus.focus();}
document.getElementById("dClose").addEventListener("click",closeDrawer);
scrim.addEventListener("click",closeDrawer);
addEventListener("keydown",e=>{if(e.key==="Escape"&&!drawer.hidden)closeDrawer();});
const openOne = id => { const t=byId[id]; openDrawer(t.s, t.n, [t]); };
const openCity = k => { const it=sorted.filter(t=>t.c===k||t.c2===k); openDrawer(GEO.names[k], `${it.length} ${it.length>1?"tribunais":"tribunal"} com sede ou ramo aqui`, it); };
function activate(el,fn){el.addEventListener("click",fn);el.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();fn();}});}

// ===== 2026
document.getElementById("news").innerHTML = Object.entries(N26).map(([id,[h,txt]])=>`<button class="newsitem" data-id="${id}"><b>${byId[id].s} · ${h}</b><span>${txt}</span></button>`).join("");
document.querySelectorAll(".newsitem").forEach(b=>b.addEventListener("click",()=>openOne(b.dataset.id)));

// ===== Mapas
const cityCourts = {};
T.forEach(t=>{[t.c,t.c2].filter(Boolean).forEach(k=>{(cityCourts[k] ||= []).push(t);});});
const LBL = { // posição do rótulo no mapa-múndi [dx, dy, anchor]
  bjl:[-9,-7,"end"], dak:[-9,3,"end"], fre:[-8,9,"end"], abi:[0,15,"middle"], oua:[0,-9,"middle"], abj:[10,4,"start"], ndj:[10,-2,"start"], ban:[10,10,"start"],
  aru:[13,4,"start"], lun:[10,4,"start"], wdh:[10,4,"start"], tok:[10,4,"start"], dil:[10,4,"start"], php:[-10,4,"end"], nyc:[9,-6,"start"], wash:[-12,10,"end"],
  sjo:[-10,10,"end"], mga:[-10,-4,"end"], pos:[0,-12,"middle"], uio:[-10,4,"end"], asu:[10,4,"start"],
  haia:[-15,-8,"end"], hamb:[9,-6,"start"], gen:[-11,12,"end"], nur:[11,-2,"start"], sar:[10,10,"start"], str:[-11,6,"end"], lux:[-12,-2,"end"], min:[11,4,"start"]
};
const EUR_LBL = {haia:[-18,-10,"end"],hamb:[14,-6,"start"],gen:[-15,14,"end"],nur:[14,4,"start"],sar:[13,4,"start"],str:[14,16,"start"],lux:[-15,6,"end"],min:[13,4,"start"]};
let famFilter = null;
function donut(cx,cy,r,courts){
  const counts = famOrder.map(f=>[f,courts.filter(t=>t.f===f).length]).filter(x=>x[1]);
  const n = courts.length; let a0=-Math.PI/2, s="";
  if(counts.length===1){ s+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="var(${FAM[counts[0][0]].c})"/>`; }
  else counts.forEach(([f,c])=>{
    const a1=a0+2*Math.PI*c/n, large=(a1-a0)>Math.PI?1:0;
    s+=`<path d="M${cx},${cy} L${(cx+r*Math.cos(a0)).toFixed(2)},${(cy+r*Math.sin(a0)).toFixed(2)} A${r},${r} 0 ${large} 1 ${(cx+r*Math.cos(a1)).toFixed(2)},${(cy+r*Math.sin(a1)).toFixed(2)} Z" fill="var(${FAM[f].c})"/>`;
    a0=a1;
  });
  s+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--surface)" stroke-width="1.5"/>`;
  if(n>1) s+=`<circle cx="${cx}" cy="${cy}" r="${(r*0.52).toFixed(1)}" fill="var(--ink)"/><text class="mcount" x="${cx}" y="${cy+3.4}" text-anchor="middle">${n}</text>`;
  return s;
}
const CALL = {dak:[420,192,"end"],bjl:[420,210,"end"],fre:[425,240,"end"],abi:[470,274,"end"],oua:[476,174,"end"],abj:[512,182,"start"],ndj:[562,202,"start"],ban:[566,238,"start"]};
function markers(pts, lbl, scale, call={}){
  let s="", lines="";
  const keys = Object.keys(pts).filter(k=>cityCourts[k]).sort((a,b)=>cityCourts[b].length-cityCourts[a].length);
  keys.reverse().forEach(k=>{
    const [x,y]=pts[k], cs=cityCourts[k], r=(4.2+2.9*Math.sqrt(cs.length))*scale;
    const [dx,dy,an]=lbl[k]||[10,4,"start"];
    let tx=x+dx*scale, ty=y+dy*scale, ta=an;
    if(call[k]){ [tx,ty,ta]=call[k]; lines+=`<line x1="${x}" y1="${y}" x2="${tx+(ta==="end"?3:-3)}" y2="${ty-5}" stroke="var(--muted)" stroke-width=".9"/>`; }
    s+=`<g class="mk" data-k="${k}" tabindex="0" role="button" aria-label="${GEO.names[k]}: ${cs.length} tribunais">
      <circle class="halo" cx="${x}" cy="${y}" r="${r+6}"/>${donut(x,y,r,cs)}
      <text class="mlabel" x="${tx}" y="${ty}" text-anchor="${ta}" style="font-size:${11*scale}px">${GEO.names[k]}</text></g>`;
  });
  return lines + s;
}
function drawMaps(){
  const g=GEO.world, inEur=new Set(Object.keys(GEO.eur.pts));
  const worldPts = Object.fromEntries(Object.entries(g.pts).filter(([k])=>!inEur.has(k)));
  const fr = GEO.eur.frame.map(p=>p.join(",")).join(" ");
  const frX = Math.min(...GEO.eur.frame.map(p=>p[0])), frY=Math.min(...GEO.eur.frame.map(p=>p[1]));
  const eurN = new Set(T.filter(t=>inEur.has(t.c)||inEur.has(t.c2)).map(t=>t.id)).size;
  document.getElementById("eurN").textContent = eurN;
  document.getElementById("world").innerHTML = `<svg viewBox="0 0 ${g.w} ${g.h}" role="img" aria-label="Mapa-múndi com as sedes dos tribunais internacionais">
    <path d="${g.sphere}" fill="var(--sea)"/><path d="${g.grat}" fill="none" stroke="var(--grat)" stroke-width=".6"/>
    <path d="${g.land}" fill="var(--land)" stroke="var(--border)" stroke-width=".6"/><path d="${g.borders}" fill="none" stroke="var(--border)" stroke-width=".4"/>
    <polygon points="${fr}" fill="var(--accent)" fill-opacity=".07" stroke="var(--accent)" stroke-width="1.2" stroke-dasharray="4 3"/>
    <text x="${frX}" y="${frY-6}" font-size="15" font-weight="600" fill="var(--accent)" style="font-family:var(--body)">Europa · ${eurN} tribunais →</text>
    ${markers(worldPts, LBL, 1.55, CALL)}</svg>`;
  const e=GEO.eur;
  document.getElementById("europe").innerHTML = `<svg viewBox="0 0 ${e.w} ${e.h}" role="img" aria-label="Ampliação da Europa com as sedes dos tribunais">
    <rect width="${e.w}" height="${e.h}" fill="var(--sea)"/>
    <path d="${e.land}" fill="var(--land)" stroke="var(--border)" stroke-width=".7"/><path d="${e.borders}" fill="none" stroke="var(--border)" stroke-width=".6"/>
    ${markers(e.pts, EUR_LBL, 1.25)}</svg>`;
  document.getElementById("worldInfo").textContent = `${Object.keys(cityCourts).length} cidades-sede`;
  document.querySelectorAll(".mk").forEach(m=>{
    const k=m.dataset.k, cs=cityCourts[k];
    m.addEventListener("mousemove",e=>showTip(e,`${GEO.names[k]} · ${cs.length} ${cs.length>1?"tribunais":"tribunal"}\n${cs.map(t=>t.s.split(" / ")[0]).join(" · ")}`));
    m.addEventListener("mouseleave",hideTip);
    activate(m,()=>openCity(k));
  });
}
function applyMapFilter(){
  document.querySelectorAll(".mk").forEach(m=>{ m.classList.toggle("dim", !!famFilter && !cityCourts[m.dataset.k].some(t=>t.f===famFilter)); });
}
(function(){
  const box=document.getElementById("mapFilters");
  box.innerHTML = `<button class="chip" aria-pressed="true" data-f="">Todas</button>` + famOrder.map(f=>`<button class="chip" aria-pressed="false" data-f="${f}"><span class="dot" style="background:var(${FAM[f].c})"></span>${FAM[f].n}</button>`).join("");
  box.querySelectorAll(".chip").forEach(b=>b.addEventListener("click",()=>{famFilter=b.dataset.f||null;box.querySelectorAll(".chip").forEach(c=>c.setAttribute("aria-pressed",c===b));applyMapFilter();}));
})();

// ===== Quadro
function drawBoard(){
  document.getElementById("key").innerHTML = Object.entries(ST).filter(([k])=>k!=="parcial").map(([k,v])=>`<span><i class="sdot" style="background:var(${v.c})"></i>${v.n}${k==="susp"?" / paralisado":""}</span>`).join("") +
    `<span><i class="flag br">BR</i>vincula o Brasil</span><span><i class="flag nw">26</i>mudou em 2026</span>`;
  document.getElementById("board").innerHTML = famOrder.map(f=>{
    const it = sorted.filter(t=>t.f===f), act = it.filter(t=>!["enc"].includes(t.st)).length;
    return `<div class="fam" style="--fc:var(${FAM[f].c})"><div class="famhead"><h3>${FAM[f].n}</h3><small>${it.length} órgãos · ${act} em atividade</small></div>
      <div class="tokens">${it.map(t=>`<button class="tok ${t.st==="enc"?"enc":""}" data-id="${t.id}">
        <span class="flags">${isBR(t)?'<i class="flag br">BR</i>':""}${t.n26?'<i class="flag nw">26</i>':""}</span>
        <span class="sg">${t.s.split(" / ")[0].split(" · ")[0]}</span><span class="nm">${t.n}</span>
        <span class="meta"><i class="sdot" style="background:var(${ST[t.st].c})"></i>${t.ini}${t.fim?"–"+t.fim:""} · ${GEO.names[t.c]}</span></button>`).join("")}</div></div>`;
  }).join("");
  document.querySelectorAll(".tok").forEach(b=>{
    b.addEventListener("click",()=>openOne(b.dataset.id));
    b.addEventListener("mousemove",e=>{const t=byId[b.dataset.id];showTip(e,`${t.n}\n${ST[t.st].n} · ${t.est.replace(/<[^>]+>/g,"").slice(0,120)}${t.est.length>120?"…":""}`);});
    b.addEventListener("mouseleave",hideTip);
  });
}

// ===== Cronologia
function drawChart(){
  const NOW=2026, Y0=1895, Y1=2030, W=1180, LW=330, RP=24, RH=21, GH=30, TOP=34;
  const x = y => LW + (y - Y0) / (Y1 - Y0) * (W - LW - RP);
  let rows=[], yy=TOP;
  famOrder.forEach(f=>{ rows.push({g:f,y:yy}); yy+=GH; sorted.filter(t=>t.f===f).forEach(t=>{rows.push({t,y:yy}); yy+=RH;}); yy+=6; });
  const H=yy+14;
  let s=`<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Cronologia dos tribunais internacionais, 1899–2026">
    <defs><pattern id="hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="5" height="5" fill="var(--surface)"/><line x1="0" y1="0" x2="0" y2="5" stroke="var(--muted)" stroke-width="1.6"/></pattern></defs>
    <rect x="${x(1939)}" y="${TOP-8}" width="${x(1945)-x(1939)}" height="${H-TOP}" fill="var(--muted)" opacity=".07"/>`;
  for(let y=1900;y<=2020;y+=10){const X=x(y); s+=`<line x1="${X}" y1="${TOP-8}" x2="${X}" y2="${H-8}" stroke="var(--line)" stroke-width="${y%50===0?1.2:.7}"/><text x="${X}" y="${TOP-14}" text-anchor="middle" font-size="11" fill="var(--muted)" style="font-family:var(--mono)">${y}</text>`;}
  const xn=x(NOW);
  s+=`<line x1="${xn}" y1="${TOP-8}" x2="${xn}" y2="${H-8}" stroke="var(--accent)" stroke-width="1.2" stroke-dasharray="3 3"/><text x="${xn}" y="${TOP-14}" text-anchor="middle" font-size="11" font-weight="600" fill="var(--accent)" style="font-family:var(--mono)">2026</text>`;
  rows.forEach(r=>{
    if(r.g){ s+=`<rect x="8" y="${r.y+9}" width="10" height="10" rx="2" fill="var(${FAM[r.g].c})"/><text x="26" y="${r.y+18}" font-size="13" font-weight="700" fill="var(--ink)" style="font-family:var(--body)">${FAM[r.g].n}</text>`; return; }
    const t=r.t, col=`var(${FAM[t.f].c})`, cy=r.y+RH/2, end=t.fim??NOW, op=t.op??null;
    const label=t.n.length>44?t.n.slice(0,43)+"…":t.n;
    const xi=x(t.ini), xo=op!==null?x(op):x(NOW), xe=x(end);
    s+=`<g class="row-hit" tabindex="0" data-id="${t.id}" role="button" aria-label="${t.n}"><rect class="bg" x="2" y="${r.y}" width="${W-4}" height="${RH}" fill="transparent" rx="3"/>
      <text x="26" y="${cy+4}" font-size="12.5" fill="var(--ink)" style="font-family:var(--body)">${label}</text>`;
    if(xo>xi) s+=`<rect x="${xi}" y="${cy-5}" width="${Math.max(xo-xi,1.5)}" height="10" fill="url(#hatch)" stroke="${col}" stroke-width="1"/>`;
    if(op!==null) s+=`<rect x="${xo}" y="${cy-5}" width="${Math.max(xe-xo,3)}" height="10" fill="${col}" ${t.st==="susp"||t.st==="parcial"?'opacity=".55"':''}/>`;
    s+= t.fim ? `<line x1="${xe}" y1="${cy-7}" x2="${xe}" y2="${cy+7}" stroke="var(--ink)" stroke-width="1.6"/>` : `<circle cx="${Math.max(xe,xo)+6}" cy="${cy}" r="3.5" fill="var(--surface)" stroke="${col}" stroke-width="1.6"/>`;
    s+=`</g>`;
  });
  s+=`<text x="${(x(1939)+x(1945))/2}" y="${H-14}" text-anchor="middle" font-size="10" fill="var(--muted)" style="font-family:var(--body)">2ª Guerra</text></svg>`;
  const box=document.getElementById("chartbox"); box.innerHTML=s;
  box.querySelectorAll(".row-hit").forEach(g=>activate(g,()=>openOne(g.dataset.id)));
}
drawMaps(); drawBoard(); drawChart();
