/* Índices */
const AUTH = {}; ERAS.forEach(e=>e.autores.forEach(a=>{AUTH[a.id]=a}));
const THEME = {}; TEMAS.forEach(t=>{THEME[t.id]=t});
const A2T = {}; Object.keys(AUTH).forEach(id=>A2T[id]=[]);
TEMAS.forEach(t=>t.autores.forEach(a=>{ if(A2T[a]) A2T[a].push(t.id); }));
const RESEARCH = new Set();
TEMAS.forEach(t=>{ if(t.linha){ RESEARCH.add(t.id); t.autores.forEach(a=>RESEARCH.add(a)); }});
const links = id => THEME[id] ? THEME[id].autores : (A2T[id]||[]);
const label = id => THEME[id] ? THEME[id].titulo : AUTH[id].nome;
const strip = s => s.replace(/<[^>]+>/g,"");

/* Armazenamento local */
const KEY="fd-mapas-v1";
const store=(()=>{let s={};try{s=JSON.parse(localStorage.getItem(KEY)||"{}")||{}}catch(e){s={}}
  return{get:id=>!!s[id],set:(id,v)=>{if(v)s[id]=1;else delete s[id];try{localStorage.setItem(KEY,JSON.stringify(s))}catch(e){}}}})();

/* Renderização */
const ul = arr => "<ul>"+arr.map(x=>"<li>"+x+"</li>").join("")+"</ul>";
function bodyHTML(id, estudar, ler, side){
  const other = links(id);
  const chips = other.map(o=>`<button class="chip" data-jump="${o}">${strip(label(o))}</button>`).join("");
  return `<div class="node-body" hidden>
    <h4>O que estudar</h4>${ul(estudar)}
    <h4>Ler</h4>${ul(ler)}
    <h4>${side==="a"?"Temas em que aparece":"Autores para este tema"}</h4><div class="chips">${chips}</div>
    <label class="check"><input type="checkbox" data-done="${id}" ${store.get(id)?"checked":""}> Marcar como estudado</label>
  </div>`;
}
const mapA=document.getElementById("mapA"), mapB=document.getElementById("mapB");
ERAS.forEach(e=>{
  const sec=document.createElement("section"); sec.className="era";
  sec.innerHTML=`<header class="era-head"><span class="period">${e.periodo}</span><h3>${e.titulo}</h3><p class="q">${e.pergunta}</p></header>`+
   e.autores.map(a=>`<article class="node${store.get(a.id)?" is-done":""}${RESEARCH.has(a.id)?" is-research":""}" id="n-${a.id}" data-id="${a.id}" data-side="a">
     <span class="dot" aria-hidden="true"></span>
     <button class="node-head" aria-expanded="false"><span class="name">${a.nome}</span><span class="dates">${a.datas}</span><span class="done-mark">estudado</span><span class="idea">${a.ideia}</span></button>
     ${bodyHTML(a.id,a.estudar,a.ler,"a")}</article>`).join("");
  mapA.appendChild(sec);
});
TEMAS.forEach((t,i)=>{
  const el=document.createElement("article");
  el.className="node theme"+(store.get(t.id)?" is-done":"")+(RESEARCH.has(t.id)?" is-research":"");
  el.id="n-"+t.id; el.dataset.id=t.id; el.dataset.side="b";
  el.innerHTML=`<span class="dot" aria-hidden="true"></span>
   <button class="node-head" aria-expanded="false"><span class="num">${i+1}</span><span><span class="name">${t.titulo}</span><span class="done-mark">estudado</span><span class="idea">${t.pergunta}</span>${t.linha?`<span class="badge">Sua linha: ${t.linha}</span>`:""}</span></button>
   ${bodyHTML(t.id,t.estudar,t.ler,"b")}`;
  mapB.appendChild(el);
});

/* Progresso */
function progress(){
  const na=Object.keys(AUTH), nt=TEMAS.map(t=>t.id);
  const da=na.filter(store.get).length, dt=nt.filter(store.get).length;
  document.getElementById("progress").innerHTML=`Estudados: <b>${da}</b> de ${na.length} expoentes e <b>${dt}</b> de ${nt.length} temas.`;
}
progress();

/* Seleção e linhas */
let selected=null;
const mq=window.matchMedia("(max-width: 860px)");
const svg=document.getElementById("lines"), maps=document.getElementById("maps");
function draw(){
  svg.innerHTML="";
  if(!selected||mq.matches) return;
  const box=maps.getBoundingClientRect();
  const c=el=>{const r=el.querySelector(".dot").getBoundingClientRect();return{x:r.left+r.width/2-box.left,y:r.top+r.height/2-box.top}};
  const src=document.getElementById("n-"+selected); if(!src) return;
  const p=c(src); const isA=src.dataset.side==="a";
  links(selected).forEach(o=>{
    const t=document.getElementById("n-"+o); if(!t) return; const q=c(t);
    const a=isA?p:q, b=isA?q:p, g=(b.x-a.x)*.65;
    const path=document.createElementNS("http://www.w3.org/2000/svg","path");
    path.setAttribute("d",`M${a.x},${a.y} C${a.x+g},${a.y} ${b.x-g},${b.y} ${b.x},${b.y}`);
    svg.appendChild(path);
  });
}
function select(id){
  document.querySelectorAll(".is-selected,.is-linked").forEach(n=>n.classList.remove("is-selected","is-linked"));
  selected=id;
  document.body.classList.toggle("has-sel",!!id);
  if(id){
    document.getElementById("n-"+id).classList.add("is-selected");
    links(id).forEach(o=>{const n=document.getElementById("n-"+o); if(n) n.classList.add("is-linked")});
    const k=links(id).length, isTheme=!!THEME[id];
    document.getElementById("selText").textContent=`${strip(label(id))} está ligado a ${k} ${isTheme?(k===1?"autor":"autores"):(k===1?"tema":"temas")}.`;
  }
  draw();
}
function setOpen(node,open){
  node.classList.toggle("is-open",open);
  node.querySelector(".node-head").setAttribute("aria-expanded",open);
  node.querySelector(".node-body").hidden=!open;
}
function setView(v){
  document.body.dataset.view=v;
  document.getElementById("tabA").setAttribute("aria-selected",v==="a");
  document.getElementById("tabB").setAttribute("aria-selected",v==="b");
  requestAnimationFrame(draw);
}
function jump(id){
  const n=document.getElementById("n-"+id); if(!n) return;
  if(mq.matches) setView(n.dataset.side);
  setOpen(n,true); select(id);
  n.classList.remove("flash"); void n.offsetWidth; n.classList.add("flash");
  const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  n.scrollIntoView({behavior:reduce?"auto":"smooth",block:"start"});
}

document.addEventListener("click",ev=>{
  const head=ev.target.closest(".node-head");
  if(head){
    const node=head.closest(".node"); const open=!node.classList.contains("is-open");
    setOpen(node,open);
    if(open) select(node.dataset.id); else if(selected===node.dataset.id) select(null); else draw();
    return;
  }
  const chip=ev.target.closest("[data-jump]"); if(chip){ jump(chip.dataset.jump); return; }
  const tab=ev.target.closest(".tabs button"); if(tab){ setView(tab.dataset.view); return; }
});
document.addEventListener("change",ev=>{
  const cb=ev.target.closest("[data-done]");
  if(cb){ const id=cb.dataset.done; store.set(id,cb.checked); document.getElementById("n-"+id).classList.toggle("is-done",cb.checked); progress(); }
});
document.getElementById("toggleLines").addEventListener("change",e=>document.body.classList.toggle("lines-on",e.target.checked));
document.getElementById("selClear").addEventListener("click",()=>select(null));
document.getElementById("selGo").addEventListener("click",()=>{
  if(!selected) return;
  const side=document.getElementById("n-"+selected).dataset.side;
  setView(side==="a"?"b":"a");
  const first=links(selected).map(o=>document.getElementById("n-"+o)).find(Boolean);
  if(first) first.scrollIntoView({block:"start"});
});
if("ResizeObserver" in window){ new ResizeObserver(()=>draw()).observe(maps); } else { window.addEventListener("resize",draw); }
mq.addEventListener ? mq.addEventListener("change",draw) : mq.addListener(draw);
