// Orquestração: roteamento por hash, painel de leitura, trilha de navegação, filtros,
// alternância 2D/3D, comparação lado a lado, modo estudo, trilha pessoal, exportação,
// lista acessível, teclado e tema.
import { loadAll, buildSearchIndex, search, parseIdentifier, glossaryHighlight, timelineEvents, esc, sleep, keyLabel, urnOf, keySpan, iriOf, nodeLd, nodeTypeOf, citeAbnt, dispositivosFor, CONTEXT_URL } from './data.js';
import { TreeModel } from './model.js';
import { Radial2D } from './radial2d.js';
import { Tree3D } from './tree3d.js';
import { Trail, Theme, Fullscreen, svgSnapshot, downloadSvg, downloadPngFromSvg, downloadDataUrl, downloadText, renderOutline } from './features.js';
import { Study } from './study.js';
import { Aula } from './aula.js';
import { GraphView } from './graph.js';
import { TimelineView } from './timeline.js';
import { DataView } from './dataview.js';
import { subgraphTurtle } from './graphdata.js';

const $ = id => document.getElementById(id);
const el = {
    loading: $('loading'), viewMain: $('view-main'), viewCompare: $('view-compare'), legend: $('legend'),
    panel: $('content-panel'), tags: $('node-tags'), title: $('node-title'), subtitle: $('node-subtitle'), text: $('node-text'), actions: $('node-actions'), extra: $('node-extra'),
    breadcrumb: $('breadcrumb'), search: $('search'), results: $('search-results'),
    filterBtn: $('filter-btn'), filterPop: $('filter-pop'), filterCount: $('filter-count'),
    grow: $('ctl-grow'), collapse: $('ctl-collapse'),
    seg2d: $('seg-2d'), seg3d: $('seg-3d'), outlineBtn: $('btn-outline'), outline: $('outline'), relationsBtn: $('btn-relations'),
    compareBtn: $('btn-compare'), studyBtn: $('btn-study'), exportBtn: $('btn-export'), exportPop: $('export-pop'), themeBtn: $('btn-theme'),
    compareBar: $('compare-bar'), compareA: $('compare-a'), compareB: $('compare-b'),
    timelineBtn: $('btn-timeline'), timelineBar: $('timeline-bar'), tlPlay: $('tl-play'), tlYear: $('tl-year'), tlRange: $('tl-range'), tlTicks: $('tl-ticks'), tlToday: $('tl-today'), tlEvents: $('tl-events'), tlMin: $('tl-min'),
    toursBtn: $('btn-tours'), toursPop: $('tours-pop'), tourCard: $('tour-card'),
    about: $('about'), printFooter: $('print-footer'),
    treeContainer: $('tree-container'), fsBtn: $('ctl-fullscreen'), aulaBtn: $('btn-aula'),
    aula: $('aula'), aulaFs: $('aula-fs'), grafo: $('grafo'), tempo: $('tempo'), dados: $('dados'), tlSpeed: $('tl-speed'),
    modeNav: { arvore: $('mode-arvore'), grafo: $('mode-grafo'), tempo: $('mode-tempo'), dados: $('mode-dados') }
};

const state = {
    data: null, index: [], model: null, renderer: null, mode: '2d',
    selected: null, growing: false, suppressRoute: null, booted: false,
    compare: null,   // { a, b, panes: [{model, renderer, el}], active }
    outlineOpen: false,
    showRelations: (() => { try { return localStorage.getItem('lex-tree:relations') !== '0'; } catch { return true; } })(),
    events: [], timelineOpen: false, playing: null,
    tour: null,      // { tour, step }
    view: null,      // vista fora da árvore ativa: 'aula' | 'grafo' | 'tempo' (ver VISTAS)
    pendingPlay: false,
    tab: 'sintese'   // aba do painel (aba= na URL)
};
const trail = new Trail();
const views = {};   // vistas fora da árvore: nome → { el, ctl }
let study = null;

// ==========================================
// INICIALIZAÇÃO
// ==========================================
Theme.apply();

async function boot() {
    try {
        state.data = await loadAll('data/');
        state.index = buildSearchIndex(state.data);
        state.model = new TreeModel(state.data);
        state.events = timelineEvents(state.data);
        initTimeline();
        renderToursPop();
        const navigate = h => { location.hash = h; };
        views.aula = { el: el.aula, ctl: new Aula({
            data: state.data, makeRenderer, navigate,
            els: {
                view: $('aula-view'), count: $('aula-count'), seg2d: $('aula-2d'), seg3d: $('aula-3d'), show: $('aula-show'),
                clear: $('aula-clear'), refit: $('aula-refit'), hint: $('aula-hint'), types: $('aula-types'), foot: $('aula-foot')
            }
        }) };
        views.grafo = { el: el.grafo, ctl: new GraphView({
            data: state.data, palette: Theme.palette(), navigate,
            els: { stage: $('grafo-stage'), aside: $('grafo-aside'), count: $('grafo-count'), byDiploma: $('grafo-diploma'), byDivision: $('grafo-divisao') }
        }) };
        views.tempo = { el: el.tempo, ctl: new TimelineView({
            data: state.data, palette: Theme.palette(), navigate,
            onPlay: year => { state.pendingPlay = true; location.hash = `#/?ano=${year}`; },
            els: { lanes: $('tempo-lanes'), aside: $('tempo-aside'), a: $('tempo-a'), b: $('tempo-b'), play: $('tempo-play') }
        }) };
        views.dados = { el: el.dados, ctl: new DataView({ data: state.data, els: { root: el.dados } }) };
        el.loading.remove();
        study = new Study({
            model: state.model, trail, container: el.panel,
            onReveal: d => { location.hash = activeModel().hashForNode(d); },
            onEnd: () => { el.studyBtn.setAttribute('aria-pressed', 'false'); showPanel(state.selected || state.model.root); },
            onHideLabels: hide => { if (state.renderer) state.renderer.setHideLabels(hide); }
        });
        window.addEventListener('hashchange', route);
        route();
        state.booted = true;
        // texto digitado na busca antes de os dados chegarem
        if (el.search.value) renderResults(search(state.index, el.search.value), el.search.value);
    } catch (e) {
        console.error(e);
        el.loading.innerHTML = `<div class="max-w-md text-center px-6">
            <p class="font-semibold strong mb-2">Não foi possível carregar os dados.</p>
            <p class="muted">Se você abriu o arquivo diretamente (<code>file://</code>), sirva a pasta <code>docs/</code> por HTTP:
            <code class="block mt-2 rounded px-2 py-1" style="background:var(--surface-2)">python3 -m http.server --directory docs 8080</code></p></div>`;
    }
}

const activeModel = () => state.compare ? state.compare.panes[state.compare.active].model : state.model;
const activeRenderer = () => state.compare ? state.compare.panes[state.compare.active].renderer : state.renderer;
const trailProvider = key => trail.get(key);

// ==========================================
// RENDERIZADOR PRINCIPAL (2D ↔ 3D)
// ==========================================
function makeRenderer(mode, container, model, extra = {}) {
    const opts = { onSelect: d => clickNode(d, model), palette: Theme.palette(), trailProvider, ...extra };
    const r = mode === '3d' ? new Tree3D(container, model, opts) : new Radial2D(container, model, opts);
    r.setShowRelations(state.showRelations);
    return r;
}

function setShowRelations(on) {
    state.showRelations = on;
    try { localStorage.setItem('lex-tree:relations', on ? '1' : '0'); } catch { /* ignore */ }
    el.relationsBtn.setAttribute('aria-pressed', String(on));
    if (state.renderer) state.renderer.setShowRelations(on);
    if (state.compare) state.compare.panes.forEach(p => p.renderer.setShowRelations(on));
}

function ensureRenderer(mode) {
    if (state.renderer && state.mode === mode) return false;
    if (state.renderer) state.renderer.destroy();
    state.mode = mode;
    state.renderer = makeRenderer(mode, el.viewMain, state.model);
    el.seg2d.setAttribute('aria-pressed', String(mode === '2d'));
    el.seg3d.setAttribute('aria-pressed', String(mode === '3d'));
    el.legend.classList.toggle('hidden', mode === '3d');
    return true;
}

// ==========================================
// ROTEAMENTO
//   #/                      mapa           #/cc/parte-geral?foco=cc     radial especializado
//   #/?d=cc,cp&p=0&m=3d     filtro + 3D    #/compare?a=cc&b=cpc         comparação
// ==========================================
function route() {
    if (state.suppressRoute && location.hash === state.suppressRoute) { state.suppressRoute = null; return; }
    state.suppressRoute = null;
    closePopovers();
    const { parts, view, query } = state.model.parseHash(location.hash);
    if (query.has('aba') && TABS.some(([id]) => id === query.get('aba'))) state.tab = query.get('aba');

    const all = state.model.catalog.diplomas;
    const dq = view.diplomas.size !== all.length ? `?d=${[...view.diplomas].join(',')}` : '';
    el.aulaBtn.setAttribute('href', '#/aula' + dq);
    el.modeNav.arvore.setAttribute('href', '#/' + dq);
    el.modeNav.grafo.setAttribute('href', '#/grafo' + dq);
    el.modeNav.tempo.setAttribute('href', '#/tempo' + dq);
    el.modeNav.dados.setAttribute('href', '#/dados' + dq);
    setModeNav(parts[0]);
    if (views[parts[0]]) { enterView(parts[0], view, query); return; }
    if (state.view) exitView();
    if (parts[0] === 'compare') { enterCompare(query.get('a'), query.get('b')); return; }
    if (state.compare) exitCompare();
    if (parts[0] === 'mapa') { location.hash = '#/' + state.model.viewParams(view); return; }

    const model = state.model;
    const rendererChanged = ensureRenderer(view.mode);
    const rebuilt = model.setView(view);
    let fresh = rendererChanged || rebuilt || !state.booted;
    if (rebuilt) renderFilter();
    syncTimelineUi();
    if (state.pendingPlay) { state.pendingPlay = false; setTimeout(play, 400); }

    const target = model.resolvePath(parts);
    if (!target) { location.hash = model.rootHash(); return; }
    const atRoot = target === model.root && (parts.length === 0 || (model.isFocus() && parts.length === 1));
    if (atRoot && !fresh) {
        model.resetExpansion();
        select(target, model.root, { fit: true });
        return;
    }
    target.ancestors().slice(1).forEach(a => model.expandOne(a));
    if ((target.data.kind === 'diploma' && !target.data.planned) || target.data.kind === 'ramo') model.expandOne(target);
    // Na linha do tempo, a árvore muda de forma mas o enquadramento deve ficar estável.
    const yearChange = rebuilt && !rendererChanged && state.booted && model.view.year != null;
    if (fresh && !yearChange) state.renderer.reset();
    select(target, fresh && !yearChange ? model.root : target.parent || target, { fit: fresh, reveal: !fresh });
}

function select(d, source, { fit = false, reveal = false } = {}) {
    const model = activeModel(), renderer = activeRenderer();
    state.selected = d;
    renderer.setSelected(d);
    renderer.update(source);
    showPanel(d, model);
    setBreadcrumb(d, model);
    if (state.outlineOpen) renderOutline(el.outline, model, { selected: d, trail });
    if (fit) renderer.fit();
    else if (reveal) renderer.reveal(d);
    el.grow.disabled = state.growing || !model.hasCollapsed(d);
}

function clickNode(d, model = state.model) {
    if (state.growing) return;
    if (state.compare) {
        const idx = state.compare.panes.findIndex(p => p.model === model);
        setActivePane(idx);
    }
    if (d.data.kind === 'center') model.expandOne(d); else model.toggle(d);
    const h = model.hashForNode(d);
    if (!state.compare && location.hash !== h) { state.suppressRoute = h; location.hash = h; }
    select(d, d, { reveal: true });
}

// ==========================================
// CRESCIMENTO ANIMADO
// ==========================================
async function grow(from) {
    if (state.growing) return;
    const model = activeModel(), renderer = activeRenderer();
    state.growing = true;
    el.grow.disabled = true; el.collapse.disabled = true;
    let frontier = [from];
    while (frontier.length) {
        const next = [];
        frontier.forEach(n => { model.expandOne(n); (n.children || []).forEach(c => next.push(c)); });
        renderer.update(from);
        renderer.fit();
        await sleep(700);
        // Desce também pelos nós já abertos: só assim os diplomas dentro de ramos expandidos entram na fila.
        frontier = next.filter(n => n._children || (n.children && n.children.length));
    }
    state.growing = false;
    el.collapse.disabled = false;
    renderer.update(from);
    renderer.fit();
    el.grow.disabled = !model.hasCollapsed(state.selected || model.root);
}

// ==========================================
// PAINEL DE LEITURA
// ==========================================
const tag = (text, color) => `<span class="chip" style="background:${color}">${esc(text)}</span>`;
const outlineTag = text => `<span class="chip outline">${esc(text)}</span>`;
const action = (text, href, primary = false, onClick = null, extra = {}) => ({ text, href, primary, onClick, ...extra });
const link = (text, href, primary = false) => ({ text, href, primary, external: true });
const statusTag = doc => doc.status === 'rascunho' ? outlineTag('Rascunho') : doc.status === 'revisado' ? outlineTag('Revisado') : '';
const natTag = doc => doc.natureza === 'processual' ? outlineTag('Processual') : '';
const yearTag = model => model.view.year != null ? `<span class="chip year-chip">Em ${model.view.year}</span>` : '';

const TABS = [['sintese', 'Síntese'], ['relacoes', 'Relações'], ['historico', 'Histórico'], ['dados', 'Dados']];

function docKeys(model, doc) { return model.nodes.filter(n => n.data.kind === 'division' && model.docOf(n) === doc).map(n => n.key); }

function progressHtml(model, doc) {
    const keys = docKeys(model, doc);
    if (!keys.length) return '';
    const c = trail.counts(keys);
    const pct = v => `${(v / c.total) * 100}%`;
    return `<div class="panel-progress">
        <div class="progress"><span class="studied" style="width:${pct(c.studied)}"></span><span class="review" style="width:${pct(c.review)}"></span></div>
        <span class="muted text-xs">${c.studied} de ${c.total} divisões estudadas${c.review ? `, ${c.review} para revisar` : ''}</span></div>`;
}

/** Aba Relações: o que o nó recebe e o que ele emite, em cartões que levam ao outro nó. */
function relationsTab(model, d) {
    const items = model.relationsFor(d, { includeDescendants: d.data.kind !== 'division' });
    const types = model.data.relationTypes, data = model.data;
    const hrefFor = r => {
        if (r.other) return model.hashForNode(r.other);
        const docId = r.otherKey.split('/')[0];
        return `#/${r.otherKey}${model.viewParams({ focus: null, diplomas: new Set([...model.view.diplomas, docId]) })}`;
    };
    const card = r => {
        const otherDoc = data.diplomas[r.otherKey.split('/')[0]];
        const ramo = otherDoc ? data.ramos[otherDoc.ramo] : null;
        const t = types[r.rel.type] || { label: r.rel.type };
        const via = r.selfKey !== d.key ? `<div class="rel-via">${r.direction === 'in' ? 'em' : 'de'} ${esc(keyLabel(data, r.selfKey))}</div>` : '';
        return `<a class="rel-card" href="${hrefFor(r)}">
            <div class="rel-card-head">
                <span class="rel-mark${otherDoc && otherDoc.natureza === 'processual' ? ' dashed' : ''}" style="border-color:${ramo ? ramo.color : 'var(--text-faint)'}"></span>
                <b>${esc(keyLabel(data, r.otherKey))}</b>
                <span class="rel-type">→ ${esc(t.label)}</span>
            </div>
            ${via}
            ${r.rel.note ? `<div class="rel-note">${esc(r.rel.note)}</div>` : ''}
            ${r.rel.basis ? `<div class="rel-basis">fundamento: ${esc(r.rel.basis)}</div>` : ''}
            ${!r.other ? '<div class="rel-via">Diploma oculto pelo filtro; o link o reexibe.</div>' : ''}
        </a>`;
    };
    const group = (dir, title, hint) => {
        const list = items.filter(r => r.direction === dir);
        return `<div class="rel-group-head"><span>${title} · ${list.length}</span><span class="muted">${hint}</span></div>
            ${list.length ? list.map(card).join('') : '<p class="muted text-sm">Nenhuma relação registrada.</p>'}`;
    };
    return {
        n: items.length,
        html: `<div class="relations">${group('in', 'Recebe', 'Outros diplomas que apontam para este nó')}${group('out', 'Emite', 'Para onde este nó aponta')}</div>`
    };
}

/** Aba Histórico: promulgação (ou inclusão), marcos estruturais e revogação, em linha vertical. */
function historyTab(model, d) {
    const doc = model.docOf(d);
    const n = d.data.kind === 'division' ? d.data.node : doc.root;
    const hist = n.history || [], rows = [];
    if (d.data.kind === 'division' && n.since) {
        // o marco do mesmo ano, quando existe, já conta a inclusão com a norma
        if (!hist.some(h => h.year === n.since)) rows.push({ year: n.since, title: 'Inclusão', note: `${n.name} passa a existir.`, kind: 'marco' });
    } else if (doc.year) rows.push({ year: doc.year, title: 'Promulgação', note: d.data.kind === 'division' ? `Texto original de ${doc.shortTitle}.` : doc.norm, kind: 'origem' });
    hist.forEach(h => rows.push({ year: h.year, title: h.norm, note: h.note, kind: 'marco' }));
    if (n.until) rows.push({ year: n.until, title: 'Revogação', note: `${n.name} deixa de existir.`, kind: 'fim' });
    rows.sort((a, b) => a.year - b.year);
    return {
        n: hist.length,
        html: `<ol class="timeline-v">${rows.map(r => `<li class="${r.kind}">
                <button type="button" class="tl-year" data-year="${r.year}" title="Ver a árvore em ${r.year}">${r.year}</button> · <b>${esc(r.title)}</b>
                <div>${esc(r.note)}</div></li>`).join('')}</ol>
            <p class="muted text-sm">Clique em um ano para ver a árvore como era naquela data.</p>`
    };
}

/** Aba Dados: a mesma identidade que uma máquina usa (chave, URN, IRI, JSON-LD). */
function dataTab(model, d) {
    const data = model.data, key = d.data.kind === 'center' ? d.data.meta.id : d.key;
    const urn = urnOf(data, key), span = keySpan(data, key), ld = nodeLd(data, key);
    if (!ld) return null;
    const json = JSON.stringify({ '@context': CONTEXT_URL, ...ld }, null, 2);
    return {
        json, key,
        html: `<dl class="kv">
                <dt>chave</dt><dd><code>${esc(key)}</code></dd>
                <dt>URN</dt><dd><code>${urn ? esc(urn.urn) : '—'}</code>${urn && d.data.kind === 'division' && !urn.fragment ? '<div class="muted text-xs">URN do diploma; o fragmento desta divisão ainda não foi conferido.</div>' : ''}</dd>
                <dt>IRI</dt><dd><code>${esc(iriOf(key))}</code></dd>
                <dt>tipo</dt><dd><code>${esc(nodeTypeOf(key))}</code></dd>
                <dt>vigência</dt><dd><code>${span.since || '?'} → ${span.until || 'hoje'}</code></dd>
            </dl>
            <pre class="code-block" id="node-jsonld">${esc(json)}</pre>
            ${dispositivosHtml(data, key)}
            <div class="panel-actions">
                <button type="button" class="btn btn-sm" data-copy="jsonld">Copiar JSON-LD</button>
                <button type="button" class="btn btn-sm" data-copy="abnt">Citar (ABNT)</button>
                <button type="button" class="btn btn-sm" data-ttl="1" title="Este nó, as divisões abaixo dele e as relações que tocam nelas, em Turtle">Subgrafo .ttl</button>
            </div>`
    };
}

/** Camada experimental: os dispositivos gerados da divisão, sem o texto da lei. */
function dispositivosHtml(data, key) {
    const layer = dispositivosFor(data, key);
    if (!layer) return '';
    const label = x => ({ artigo: `art. ${x.num}`, paragrafo: x.num === 'único' ? 'parágrafo único' : `§ ${x.num}`, inciso: `inciso ${x.num}`, alinea: `alínea ${x.num})` })[x.kind];
    const refLabel = k => k.split('/').slice(1).map(s => s.replace(/^art-/, 'art. ').replace(/^par-unico$/, 'par. único').replace(/^par-/, '§ ').replace(/^inc-/, 'inc. ').replace(/^ali-/, 'al. ').toUpperCase().replace(/^ART\. /, 'art. ').replace(/^PAR\. ÚNICO/, 'par. único').replace(/^INC\. /, 'inc. ').replace(/^AL\. /, 'al. ').replace(/^§ /, '§ ')).join(', ');
    const own = new Set(layer.dispositivos.map(x => x.key));
    const items = layer.dispositivos.map(x => `
        <li class="disp-item disp-${x.kind}" id="disp-${esc(x.key.replace(/\//g, '_'))}">
            <span class="disp-num">${esc(label(x))}</span>
            <code class="disp-urn" title="URN gerada, não conferida">${esc(x.urn.split('!')[1])}</code>
            ${x.remete.length ? `<span class="disp-refs">remete a ${x.remete.map(r => own.has(r)
                ? `<button type="button" class="disp-ref" data-target="disp-${esc(r.replace(/\//g, '_'))}">${esc(refLabel(r))}</button>`
                : `<span class="disp-ref out">${esc(refLabel(r))}</span>`).join(' ')}</span>` : ''}
        </li>`).join('');
    return `<section class="disp" id="dispositivos" aria-labelledby="disp-title">
            <div class="g-head" id="disp-title">Dispositivos · ${layer.dispositivos.length} <span class="data-badge gerado-warn">gerado</span></div>
            <p class="disp-warn">Gerado por script a partir do texto compilado do Planalto (${esc(layer.range || '')}), sem revisão humana. Guarda a estrutura, a URN, as remissões explícitas e um hash de cada trecho, não o texto. Confira sempre no <a href="${esc(layer.source)}" target="_blank" rel="noopener">texto oficial</a>.</p>
            <ol class="disp-list">${items}</ol>
        </section>`;
}

function trailActions(key) {
    const cur = trail.get(key);
    return [
        action('Estudado', null, false, () => { trail.toggle(key, 'studied'); }, { dot: 'studied', pressed: cur === 'studied', title: 'Marcar como estudado (E)' }),
        action('Revisar', null, false, () => { trail.toggle(key, 'review'); }, { dot: 'review', pressed: cur === 'review', title: 'Marcar para revisar depois (R)' })
    ];
}

function showPanel(d, model = activeModel()) {
    if (study && study.active) return;
    const r = model.ramoOf(d);
    const common = [];
    if (model.hasCollapsed(d)) common.push(action('Expandir tudo daqui', null, false, () => grow(d)));
    common.push(action('Centralizar', null, false, () => activeRenderer().centerOn(d)));
    const copy = state.compare ? [] : [action('Copiar link', null, false, copyLink)];
    const gloss = text => glossaryHighlight(esc(text), model.data.glossary);
    const noteHtml = m => m.note ? `<p class="panel-note">${esc(m.note)}</p>` : '';
    const full = (extra = {}) => ({ relations: relationsTab(model, d), history: historyTab(model, d), dados: dataTab(model, d), ...extra });

    if (d.data.kind === 'center' && model.isFocus() && !d.data.meta.ghostOf) {
        const m = d.data.meta;
        setPanel({
            tags: [outlineTag('Foco'), tag(r.name, r.color), statusTag(m), natTag(m)],
            title: m.title, subtitle: m.norm,
            html: gloss(m.root.content) + noteHtml(m), extra: progressHtml(model, m),
            actions: state.compare ? common : [action('Ver no mapa completo', `#/${m.id}${model.viewParams({ focus: null })}`), ...common],
            footer: [link('Texto no Planalto', m.source, true), ...copy],
            ...full()
        });
    } else if (d.data.kind === 'diploma' && d.data.ghost) {
        const m = d.data.meta, cur = m.ghostOf;
        setPanel({
            tags: [tag(r.name, r.color), yearTag(model), outlineTag('Antecessor histórico')],
            title: m.title, subtitle: m.norm,
            html: `Em ${model.view.year}, este era o diploma vigente no lugar que hoje ocupa ${esc(cur.title)}. Vigeu de ${m.year} até ${esc(String((cur.predecessors.find(p => p.from === m.year) || {}).to || cur.year))}, quando foi substituído. A estrutura mapeada neste projeto é a do diploma atual.`,
            actions: common,
            footer: [action(`Ver ${cur.shortTitle} hoje`, model.hashForNode(d, { year: null }), true), link('Texto do diploma atual', cur.source), ...copy]
        });
    } else if (d.data.kind === 'center' && d.data.meta.ghostOf) {
        const m = d.data.meta;
        setPanel({
            tags: [outlineTag('Nó central'), tag(r.name, r.color), yearTag(model)],
            title: m.title, subtitle: m.norm,
            html: esc(m.root.content), actions: common,
            footer: [action('Voltar ao presente', model.rootHash({ year: null }), true), ...copy]
        });
    } else if (d.data.kind === 'center') {
        const m = d.data.meta;
        const hidden = model.catalog.diplomas.length - model.view.diplomas.size;
        setPanel({
            tags: [outlineTag('Nó central'), tag(r.name, r.color), statusTag(m), yearTag(model)],
            title: 'Mapa do ordenamento', subtitle: m.norm,
            html: gloss(m.root.content) + ' Clique em um ramo para ler sua definição, em um diploma para abri-lo no próprio mapa, ou use "Expandir tudo" para ver a árvore inteira conectada.'
                + (hidden ? `<p class="panel-note">${hidden} diploma(s) oculto(s) pelo filtro "Diplomas".</p>` : ''),
            extra: progressHtml(model, m),
            actions: [
                ...(model.view.diplomas.has(m.id) ? [action('Abrir os Títulos da Constituição', `#/${r.id}${model.viewParams()}`)] : []),
                action('Focar na Constituição', model.rootHash({ focus: m.id })), ...common
            ],
            footer: [link('Texto no Planalto', m.source, true), ...copy],
            ...full()
        });
    } else if (d.data.kind === 'ramo') {
        const kids = model.kidsOf(d);
        const list = kids.filter(k => k.data.kind === 'diploma').map(k => k.data.planned
            ? `<span class="muted italic">${esc(k.data.meta.shortTitle)}</span>`
            : `<a class="underline decoration-dotted" href="${model.hashForNode(k)}">${esc(k.data.meta.shortTitle)}</a>`).join(' · ');
        setPanel({
            tags: [tag(r.name, r.color)], title: r.name, subtitle: 'Ramo do Direito',
            html: `${esc(r.description)}${list ? `<p class="panel-note">Diplomas: ${list}</p>` : ''}`,
            actions: common, footer: copy
        });
    } else if (d.data.kind === 'diploma' && d.data.planned) {
        const m = d.data.meta;
        setPanel({
            tags: [tag(r.name, r.color), natTag(m), outlineTag('Em mapeamento')],
            title: m.title, subtitle: m.norm,
            html: `Este diploma ainda não foi mapeado. ${m.note ? esc(m.note) + ' ' : ''}Contribuições são bem-vindas: o guia explica como estruturar Títulos e Capítulos em um arquivo JSON.`,
            actions: [],
            footer: [link('Como contribuir', 'https://github.com/luccas-amorim/ariadne/blob/main/CONTRIBUTING.md', true), link('Texto no Planalto', m.source)]
        });
    } else if (d.data.kind === 'diploma') {
        const m = d.data.meta;
        setPanel({
            tags: [tag(r.name, r.color), statusTag(m), natTag(m), yearTag(model)],
            title: m.title, subtitle: m.norm,
            html: gloss(m.root.content) + noteHtml(m), extra: progressHtml(model, m),
            actions: [action('Focar neste diploma', model.hashForNode(d, { focus: m.id })), action(`Comparar ${m.shortTitle} com…`, null, false, () => openCompareWith(m.id)), ...common],
            footer: [link('Texto no Planalto', m.source, true), ...copy],
            ...full()
        });
    } else {
        const n = d.data.node, doc = d.data.doc;
        const parentKey = d.key.split('/').slice(0, -1).join('/');
        const focusAction = state.compare ? null : model.isFocus()
            ? action('Ver no mapa completo', model.hashForNode(d, { focus: null }))
            : action(`Focar em ${doc.shortTitle}`, model.hashForNode(d, { focus: doc.id }));
        const layer = dispositivosFor(model.data, d.key);
        const dispAction = layer ? action(`Ver dispositivos (${layer.dispositivos.length}, gerados)`, null, false, () => {
            const tab = el.panel.querySelector('#tab-dados');
            if (tab) tab.click();
            const box = el.panel.querySelector('#dispositivos');
            if (box) box.scrollIntoView({ block: 'start' });
        }) : null;
        setPanel({
            tags: [tag(r.name, r.color), statusTag(doc), n.revoked ? tag('Revogado', '#991b1b') : '', yearTag(model)],
            title: n.name, subtitle: `${n.subtitle} · ${keyLabel(model.data, parentKey)}`,
            html: gloss(n.content).replace(/\n/g, '<br>'),
            actions: [...(focusAction ? [focusAction] : []), ...(dispAction ? [dispAction] : []), ...common],
            footer: [link('Texto no Planalto', doc.source, true), ...trailActions(d.key), ...copy],
            ...full()
        });
    }
}

/** Aba visível: a escolhida, se o nó tiver essa aba, ou a Síntese. */
function visibleTab(available) { return available.includes(state.tab) ? state.tab : 'sintese'; }

/** Mantém `aba=` na URL sem disparar nova rota. */
function syncTabInUrl(tab) {
    if (state.compare || state.view) return;
    const raw = location.hash || '#/';
    const qi = raw.indexOf('?');
    const q = new URLSearchParams(qi >= 0 ? raw.slice(qi + 1) : '');
    if (tab === 'sintese') q.delete('aba'); else q.set('aba', tab);
    const s = q.toString();
    const next = (qi >= 0 ? raw.slice(0, qi) : raw) + (s ? '?' + decodeURIComponent(s) : '');
    if (next !== raw) history.replaceState(null, '', next);
}

let panelTimer = null;
function setPanel({ tags, title, subtitle, html, extra = '', actions = [], footer = [], relations = null, history = null, dados = null }) {
    el.panel.style.opacity = 0;
    clearTimeout(panelTimer);
    panelTimer = setTimeout(() => {
        if (study && study.active) { el.panel.style.opacity = 1; return; } // o cartão de estudo tem prioridade
        const available = ['sintese', ...(relations ? ['relacoes'] : []), ...(history ? ['historico'] : []), ...(dados ? ['dados'] : [])];
        const active = visibleTab(available);
        const count = { relacoes: relations && relations.n, historico: history && history.n };
        const tabs = available.length > 1 ? `<div class="panel-tabs" role="tablist" aria-label="Seções do nó">${TABS.filter(([id]) => available.includes(id)).map(([id, label]) => `
            <button type="button" role="tab" id="tab-${id}" aria-controls="tabpanel-${id}" aria-selected="${id === active}" tabindex="${id === active ? 0 : -1}">${label}${count[id] != null ? ` <span class="tab-count">${count[id]}</span>` : ''}</button>`).join('')}</div>` : '';
        const panel = (id, body) => available.includes(id) ? `<section role="tabpanel" id="tabpanel-${id}" class="tabpanel" aria-labelledby="tab-${id}"${id === active ? '' : ' hidden'}>${body}</section>` : '';
        $('sr-announce').textContent = `${title}. ${subtitle}`;
        el.panel.innerHTML = `
            <div class="panel-head">
                <div id="node-tags" class="panel-tags">${tags.filter(Boolean).join('')}</div>
                <h2 id="node-title" class="panel-title">${esc(title)}</h2>
                <p id="node-subtitle" class="panel-subtitle">${esc(subtitle)}</p>
                ${tabs}
            </div>
            <div class="panel-body">
                ${panel('sintese', `<p id="node-text" class="panel-text">${html}</p>${extra}<div id="node-actions" class="panel-actions"></div>`)}
                ${relations ? panel('relacoes', relations.html) : ''}
                ${history ? panel('historico', history.html) : ''}
                ${dados ? panel('dados', dados.html) : ''}
                <p class="print-footer">Ariadne — Árvores Jurídicas BR · ${esc(location.href)} · código MIT · conteúdo CC BY 4.0</p>
            </div>
            <div id="node-footer" class="panel-foot"></div>`;
        if (available.length === 1) el.panel.querySelector('.tabpanel').removeAttribute('aria-labelledby');
        fillActions(el.panel.querySelector('#node-actions'), actions);
        fillActions(el.panel.querySelector('#node-footer'), footer);
        if (dados) {
            el.panel.querySelectorAll('[data-copy]').forEach(b => b.addEventListener('click', () => {
                const text = b.dataset.copy === 'jsonld' ? dados.json : citeAbnt(activeModel().data, dados.key);
                copyText(text, b.dataset.copy === 'jsonld' ? 'JSON-LD copiado' : 'Referência copiada');
            }));
        }
        el.panel.querySelectorAll('.disp-ref[data-target]').forEach(b => b.addEventListener('click', () => {
            const t = el.panel.querySelector(`#${CSS.escape(b.dataset.target)}`);
            if (t) { t.scrollIntoView({ block: 'center' }); t.classList.add('flash'); setTimeout(() => t.classList.remove('flash'), 1200); }
        }));
        el.panel.querySelectorAll('[data-ttl]').forEach(b => b.addEventListener('click', () => {
            downloadText(subgraphTurtle(activeModel().data, dados.key), `ariadne-${dados.key.replace(/\//g, '_')}.ttl`, 'text/turtle');
        }));
        el.panel.querySelectorAll('.tl-year').forEach(b => b.addEventListener('click', () => setYear(+b.dataset.year)));
        bindTabs(available);
        syncTabInUrl(active);
        el.panel.style.opacity = 1;
    }, 150);
}

function fillActions(box, actions) {
    actions.forEach(a => {
        const b = document.createElement(a.onClick ? 'button' : 'a');
        if (a.onClick) { b.type = 'button'; b.addEventListener('click', ev => { ev.preventDefault(); a.onClick(); }); }
        else if (a.href) b.href = a.href;
        if (a.external) { b.target = '_blank'; b.rel = 'noopener'; }
        b.className = a.primary ? 'btn btn-sm btn-primary' : 'btn btn-sm';
        if (a.dot) { const dot = document.createElement('span'); dot.className = `trail-dot ${a.dot}`; b.appendChild(dot); }
        b.appendChild(document.createTextNode(a.text));
        if (a.pressed != null) b.setAttribute('aria-pressed', String(a.pressed));
        if (a.title) b.title = a.title;
        box.appendChild(b);
    });
}

/** Abas acessíveis: clique e setas ←/→, Home e End. */
function bindTabs(available) {
    const list = el.panel.querySelector('[role="tablist"]');
    if (!list) return;
    const show = (id, focus = false) => {
        state.tab = id;
        list.querySelectorAll('[role="tab"]').forEach(t => {
            const on = t.id === `tab-${id}`;
            t.setAttribute('aria-selected', String(on));
            t.tabIndex = on ? 0 : -1;
            if (on && focus) t.focus();
        });
        el.panel.querySelectorAll('.tabpanel').forEach(p => { p.hidden = p.id !== `tabpanel-${id}`; });
        syncTabInUrl(id);
    };
    list.addEventListener('click', ev => { const t = ev.target.closest('[role="tab"]'); if (t) show(t.id.slice(4)); });
    list.addEventListener('keydown', ev => {
        const cur = list.querySelector('[aria-selected="true"]');
        const i = available.indexOf(cur ? cur.id.slice(4) : 'sintese');
        let j = null;
        if (ev.key === 'ArrowRight') j = (i + 1) % available.length;
        else if (ev.key === 'ArrowLeft') j = (i - 1 + available.length) % available.length;
        else if (ev.key === 'Home') j = 0;
        else if (ev.key === 'End') j = available.length - 1;
        if (j == null) return;
        ev.preventDefault(); ev.stopPropagation();
        show(available[j], true);
    });
}

function setBreadcrumb(d, model = activeModel()) {
    const items = d.ancestors().reverse().map((a, i, arr) => {
        const last = i === arr.length - 1;
        const label = a.data.kind === 'center' ? (model.isFocus() ? `Foco: ${model.labelOf(a)}` : 'Mapa') : a.data.kind === 'ramo' ? a.data.ramo.short : model.labelOf(a);
        return last ? `<span class="crumb current">${esc(label)}</span>` : `<a class="crumb" href="${state.compare ? '#' : model.hashForNode(a)}" data-nid="${a.id}">${esc(label)}</a>`;
    });
    if (state.compare) items.unshift(`<a class="crumb" href="#/">Mapa</a>`, `<span class="crumb">Comparar</span>`);
    else if (model.isFocus()) items.unshift(`<a class="crumb" href="${model.rootHash({ focus: null })}">Mapa</a>`);
    el.breadcrumb.innerHTML = items.join('');
    if (state.compare) {
        el.breadcrumb.querySelectorAll('a[data-nid]').forEach(a => a.addEventListener('click', ev => {
            ev.preventDefault();
            const node = model.nodes.find(n => n.id === +a.dataset.nid);
            if (node) select(node, node, { reveal: true });
        }));
    }
}

function copyText(text, done) {
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(() => toast(done), () => toast('Não foi possível copiar'));
    else toast(text);
}
function copyLink() { copyText(location.href, 'Link copiado'); }

function toast(msg) {
    const t = document.createElement('div');
    t.textContent = msg;
    t.className = 'toast fade';
    document.body.appendChild(t);
    setTimeout(() => { t.style.opacity = 0; setTimeout(() => t.remove(), 300); }, 1600);
}

// ==========================================
// FILTRO DE DIPLOMAS
// ==========================================
function renderFilter() {
    const model = state.model, v = model.view, c = model.catalog;
    el.filterCount.textContent = v.focus ? '1' : v.diplomas.size;
    const groups = c.ramos.map(r => {
        const docs = c.diplomas.map(id => model.data.diplomas[id]).filter(d => d.ramo === r.id);
        if (!docs.length) return '';
        return `<div class="mt-2"><div class="text-[11px] font-semibold uppercase tracking-wider px-1 mb-0.5" style="color:${r.color}">${esc(r.name)}</div>` +
            docs.map(d => `<label>
                <input type="checkbox" data-id="${d.id}" ${v.diplomas.has(d.id) ? 'checked' : ''}>
                <span class="${v.focus === d.id ? 'font-semibold strong' : ''}">${esc(d.shortTitle)}</span>
                <span class="text-xs muted truncate">${esc(d.title)}</span>
                <a class="focus-link" href="${model.rootHash({ focus: d.id })}" title="Radial especializado neste diploma">${v.focus === d.id ? 'em foco' : 'focar'}</a>
            </label>`).join('') + '</div>';
    }).join('');
    el.filterPop.innerHTML = `
        <div class="flex items-center justify-between gap-2 px-1">
            <span class="font-semibold strong">Diplomas na árvore</span>
            <span class="text-xs"><button type="button" data-all="1" class="underline decoration-dotted">todos</button> · <button type="button" data-all="0" class="underline decoration-dotted">nenhum</button></span>
        </div>
        ${v.focus ? `<a href="${model.rootHash({ focus: null })}" class="btn btn-primary btn-sm mt-2 w-full justify-center">Sair do foco: voltar ao mapa completo</a>` : ''}
        ${groups}
        <div class="mt-2 pt-2" style="border-top:1px solid var(--border)">
            <label><input type="checkbox" data-planned="1" ${v.showPlanned ? 'checked' : ''}><span>Mostrar diplomas em mapeamento</span></label>
        </div>`;
}

function applyFilterChange() {
    const model = state.model;
    const ids = [...el.filterPop.querySelectorAll('input[data-id]')].filter(i => i.checked).map(i => i.dataset.id);
    const showPlanned = el.filterPop.querySelector('input[data-planned]').checked;
    const diplomas = new Set(ids.length ? ids : model.catalog.diplomas);
    if (!ids.length) toast('Pelo menos um diploma precisa ficar visível');
    const { parts } = model.parseHash(location.hash);
    const next = { ...model.view, diplomas, showPlanned };
    location.hash = (model.isFocus() ? `#/${model.view.focus}` : '#/' + parts.join('/')) + model.viewParams(next);
}

el.filterBtn.addEventListener('click', ev => { ev.stopPropagation(); togglePop(el.filterPop, el.filterBtn); });
el.filterPop.addEventListener('click', ev => {
    ev.stopPropagation();
    const all = ev.target.closest('button[data-all]');
    if (all) { el.filterPop.querySelectorAll('input[data-id]').forEach(i => { i.checked = all.dataset.all === '1'; }); applyFilterChange(); }
    if (ev.target.closest('a')) closePopovers();
});
el.filterPop.addEventListener('change', ev => { if (ev.target.matches('input')) applyFilterChange(); });

function togglePop(pop, btn) {
    const open = pop.classList.contains('hidden');
    closePopovers();
    if (open) { pop.classList.remove('hidden'); btn.setAttribute('aria-expanded', 'true'); }
}
function closePopovers() {
    [el.filterPop, el.exportPop, el.toursPop].forEach(p => p.classList.add('hidden'));
    [el.filterBtn, el.exportBtn, el.toursBtn].forEach(b => b.setAttribute('aria-expanded', 'false'));
    el.results.innerHTML = '';
}
document.addEventListener('click', ev => { if (!ev.target.closest('.pop, [aria-haspopup], #search')) closePopovers(); });

// ==========================================
// BUSCA
// ==========================================
function renderResults(list, q) {
    const model = state.model;
    if (!list.length) {
        const msg = parseIdentifier(q) ? 'Identificador não encontrado entre os diplomas mapeados.' : 'Nada encontrado.';
        el.results.innerHTML = q.trim().length > 1 ? `<li class="px-4 py-3 muted">${msg}</li>` : '';
        return;
    }
    el.results.innerHTML = list.map(e => {
        const r = model.data.ramos[e.diploma.ramo];
        const href = '#/' + [e.diploma.id, ...e.path].join('/') + model.viewParams({
            focus: model.view.focus === e.diploma.id ? model.view.focus : null,
            diplomas: model.view.diplomas.has(e.diploma.id) ? model.view.diplomas : new Set([...model.view.diplomas, e.diploma.id])
        });
        return `<li role="option"><a href="${href}">
            <div class="flex items-center gap-2">
                <span class="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded text-white" style="background:${r.color}">${esc(e.diploma.shortTitle)}</span>
                <span class="font-medium strong truncate">${esc(e.node.name)}</span>
            </div>
            <div class="text-xs muted mt-0.5">${esc(e.node.subtitle)}</div></a></li>`;
    }).join('');
}
el.search.addEventListener('input', () => renderResults(search(state.index, el.search.value), el.search.value));
el.search.addEventListener('focus', () => { if (el.search.value) renderResults(search(state.index, el.search.value), el.search.value); });
el.search.addEventListener('keydown', ev => {
    if (ev.key === 'Enter') { const first = el.results.querySelector('a'); if (first) { first.click(); el.search.blur(); } }
    if (ev.key === 'Escape') { el.search.value = ''; el.results.innerHTML = ''; el.search.blur(); }
});
el.results.addEventListener('click', () => { el.search.value = ''; el.results.innerHTML = ''; });

// ==========================================
// 2D / 3D, LISTA, TEMA
// ==========================================
function withMode(mode) {
    const model = state.model;
    const { parts } = model.parseHash(location.hash);
    if (parts[0] === 'compare') return '#/' + model.viewParams({ mode });
    return '#/' + parts.join('/') + model.viewParams({ mode });
}
el.seg2d.addEventListener('click', () => { location.hash = withMode('2d'); });
el.seg3d.addEventListener('click', () => { location.hash = withMode('3d'); });

el.relationsBtn.addEventListener('click', () => setShowRelations(!state.showRelations));
el.relationsBtn.setAttribute('aria-pressed', String(state.showRelations));

el.outlineBtn.addEventListener('click', () => {
    state.outlineOpen = !state.outlineOpen;
    el.outline.classList.toggle('hidden', !state.outlineOpen);
    el.outlineBtn.setAttribute('aria-pressed', String(state.outlineOpen));
    if (state.outlineOpen) renderOutline(el.outline, activeModel(), { selected: state.selected, trail });
});

el.themeBtn.addEventListener('click', () => Theme.toggle());
Theme.onChange(p => {
    if (state.renderer) state.renderer.setPalette(p);
    if (state.compare) state.compare.panes.forEach(pn => pn.renderer.setPalette(p));
    Object.values(views).forEach(v => v.ctl.setPalette(p));
    el.themeBtn.setAttribute('aria-label', p.name === 'dark' ? 'Tema claro' : 'Tema escuro');
    el.themeBtn.textContent = p.name === 'dark' ? '☀' : '☾';
});
el.themeBtn.textContent = Theme.get() === 'dark' ? '☀' : '☾';

trail.onChange(() => {
    const r = activeRenderer(); if (r && state.selected) { r.update(state.selected); }
    if (state.selected && !(study && study.active)) showPanel(state.selected);
    if (state.outlineOpen) renderOutline(el.outline, activeModel(), { selected: state.selected, trail });
});

// ==========================================
// CONTROLES E TECLADO
// ==========================================
el.grow.addEventListener('click', () => grow(state.selected || activeModel().root));
el.collapse.addEventListener('click', () => {
    if (state.compare) { state.compare.panes.forEach(p => { p.model.resetExpansion(); p.renderer.update(p.model.root); p.renderer.fit(); }); select(activeModel().root, activeModel().root, { fit: true }); return; }
    const h = state.model.rootHash();
    if (location.hash === h || (h === '#/' && location.hash === '')) route(); else location.hash = h;
});
el.fsBtn.addEventListener('click', () => toggleFullscreen());
// Folha inferior (celular): recolhida ou expandida até 85vh
$('panel-toggle').addEventListener('click', () => {
    const p = $('reading-panel'), open = !p.classList.contains('expanded');
    p.classList.toggle('expanded', open);
    $('panel-toggle').setAttribute('aria-expanded', String(open));
    $('panel-toggle').querySelector('.sr-only').textContent = open ? 'Recolher o painel' : 'Expandir o painel';
});
el.aulaFs.addEventListener('click', () => toggleFullscreen());
$('ctl-fit').addEventListener('click', () => { if (state.compare) state.compare.panes.forEach(p => p.renderer.fit()); else activeRenderer().fit(); });
$('ctl-in').addEventListener('click', () => activeRenderer().zoomBy(1.4));
$('ctl-out').addEventListener('click', () => activeRenderer().zoomBy(1 / 1.4));

document.addEventListener('keydown', ev => {
    if (ev.target === el.search || ev.target.closest('dialog, input, select, textarea')) return;
    if (ev.key === 'F' && ev.shiftKey) { ev.preventDefault(); toggleFullscreen(); return; }
    if (ev.key === 'Escape' && Fullscreen.isPseudo()) { Fullscreen.exit(); return; }
    if (state.view) {
        const ctl = views[state.view].ctl;
        if (ev.key === 'Escape') ctl.clearSelection();
        else if (state.view === 'aula' && (ev.key === 'x' || ev.key === 'X')) ctl.toggleShow();
        return;
    }
    const model = activeModel(), d = state.selected;
    if (ev.key === '/') { ev.preventDefault(); el.search.focus(); return; }
    if (ev.key === 'Escape') { closePopovers(); el.collapse.click(); return; }
    if (ev.key === 'f' || ev.key === 'F') { activeRenderer().fit(); return; }
    if (ev.key === 'l' || ev.key === 'L') { el.outlineBtn.click(); return; }
    if (ev.key === 'x' || ev.key === 'X') { setShowRelations(!state.showRelations); return; }
    if (ev.key === 't' || ev.key === 'T') { el.timelineBtn.click(); return; }
    if (state.tour && (ev.key === 'PageDown' || ev.key === 'n' || ev.key === 'N')) { ev.preventDefault(); tourGo(state.tour.step + 1); return; }
    if (state.tour && (ev.key === 'PageUp' || ev.key === 'p' || ev.key === 'P')) { ev.preventDefault(); tourGo(state.tour.step - 1); return; }
    if (!d) return;
    const go = n => { if (!n) return; if (state.compare) select(n, n, { reveal: true }); else location.hash = model.hashForNode(n); };
    if (ev.key === 'ArrowLeft') { ev.preventDefault(); go(d.parent); }
    else if (ev.key === 'ArrowRight') { ev.preventDefault(); model.expandOne(d); go(model.kidsOf(d)[0]); }
    else if (ev.key === 'ArrowUp' || ev.key === 'ArrowDown') {
        ev.preventDefault();
        const sib = d.parent ? model.kidsOf(d.parent) : [d];
        const i = sib.indexOf(d);
        go(sib[(i + (ev.key === 'ArrowDown' ? 1 : -1) + sib.length) % sib.length]);
    } else if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); clickNode(d, model); }
    else if (ev.key === 'e' || ev.key === 'E') { if (d.data.kind === 'division') trail.toggle(d.key, 'studied'); }
    else if (ev.key === 'r' || ev.key === 'R') { if (d.data.kind === 'division') trail.toggle(d.key, 'review'); }
});

// ==========================================
// MODO ESTUDO
// ==========================================
el.studyBtn.addEventListener('click', () => {
    if (study.active) { study.stop(); return; }
    clearTimeout(panelTimer);
    el.panel.style.opacity = 1;
    study.model = activeModel();
    if (study.start(state.selected || activeModel().root)) el.studyBtn.setAttribute('aria-pressed', 'true');
});

// ==========================================
// EXPORTAÇÃO
// ==========================================
el.exportBtn.addEventListener('click', ev => { ev.stopPropagation(); renderExportPop(); togglePop(el.exportPop, el.exportBtn); });
function renderExportPop() {
    const is3d = state.mode === '3d' && !state.compare;
    el.exportPop.innerHTML = `
        <div class="p-2 flex flex-col gap-1 text-sm">
            ${is3d ? '' : '<button type="button" class="btn btn-sm justify-start" data-x="svg">Baixar SVG (vetor)</button>'}
            <button type="button" class="btn btn-sm justify-start" data-x="png">Baixar PNG (imagem)</button>
            <button type="button" class="btn btn-sm justify-start" data-x="print">Imprimir</button>
            <div style="border-top:1px solid var(--border);margin:.25rem 0"></div>
            <button type="button" class="btn btn-sm justify-start" data-x="trail-export">Exportar trilha (JSON)</button>
            <label class="btn btn-sm justify-start" style="cursor:pointer">Importar trilha<input type="file" accept="application/json" class="hidden" data-x="trail-import"></label>
            <button type="button" class="btn btn-sm justify-start" data-x="trail-clear">Limpar trilha</button>
        </div>`;
    el.exportPop.querySelectorAll('[data-x]').forEach(b => b.addEventListener(b.tagName === 'INPUT' ? 'change' : 'click', ev => doExport(b.dataset.x, ev)));
}
async function doExport(kind, ev) {
    const model = activeModel(), renderer = activeRenderer();
    const name = `arvores-juridicas-${(state.selected ? model.labelOf(state.selected) : 'mapa').replace(/[^\w-]+/g, '-').toLowerCase()}`;
    const title = state.selected ? model.nameOf(state.selected) : 'Mapa do ordenamento';
    const subtitle = state.selected && state.selected.data.kind === 'division' ? `${model.docOf(state.selected).shortTitle} · ${state.selected.data.node.subtitle}` : (model.docOf(state.selected || model.root) || {}).norm || '';
    try {
        if (kind === 'svg' || (kind === 'png' && !(renderer instanceof Tree3D))) {
            const snap = renderer.snapshot();
            const svg = svgSnapshot(snap.svg, snap.g, { title, subtitle, palette: Theme.palette(), bounds: snap.bounds, transform: snap.transform });
            if (kind === 'svg') downloadSvg(svg, `${name}.svg`); else await downloadPngFromSvg(svg, `${name}.png`, 2);
        } else if (kind === 'png') {
            downloadDataUrl(renderer.snapshotPng(), `${name}.png`);
        } else if (kind === 'print') {
            window.print();
        } else if (kind === 'trail-export') {
            downloadText(trail.exportJson(), 'trilha-arvores-juridicas.json');
        } else if (kind === 'trail-import') {
            const file = ev.target.files[0]; if (!file) return;
            trail.importJson(await file.text()); toast('Trilha importada');
        } else if (kind === 'trail-clear') {
            if (confirm('Apagar todas as marcas da sua trilha neste navegador?')) { trail.clear(); toast('Trilha limpa'); }
        }
    } catch (e) { console.error(e); toast('Não foi possível exportar'); }
    closePopovers();
}

// ==========================================
// COMPARAÇÃO LADO A LADO
// ==========================================
function openCompareWith(a) {
    const ids = state.model.catalog.diplomas;
    const b = ids.find(id => id !== a && state.model.data.diplomas[id].ramo === state.model.data.diplomas[a].ramo) || ids.find(id => id !== a);
    location.hash = `#/compare?a=${a}&b=${b}`;
}
el.compareBtn.addEventListener('click', () => {
    if (state.compare) { location.hash = '#/'; return; }
    const sel = state.selected, doc = sel ? state.model.docOf(sel) : null;
    openCompareWith(doc && doc.root ? doc.id : state.model.catalog.root);
});

function enterCompare(a, b) {
    const data = state.data, ids = data.catalog.diplomas;
    if (!data.diplomas[a]) a = ids[0];
    if (!data.diplomas[b] || b === a) b = ids.find(id => id !== a);
    if (state.compare && state.compare.a === a && state.compare.b === b) return;
    if (state.compare) exitCompare(false);
    if (study && study.active) study.stop();
    el.viewMain.classList.add('hidden');
    el.viewCompare.classList.remove('hidden');
    el.viewCompare.parentElement.classList.add('comparing');
    el.legend.classList.add('hidden');
    el.filterBtn.parentElement.classList.add('hidden');
    el.compareBar.classList.remove('hidden');
    el.compareBtn.setAttribute('aria-pressed', 'true');
    const opts = ids.map(id => `<option value="${id}">${esc(data.diplomas[id].shortTitle)} · ${esc(data.diplomas[id].title)}</option>`).join('');
    el.compareA.innerHTML = opts; el.compareB.innerHTML = opts;
    el.compareA.value = a; el.compareB.value = b;
    el.viewCompare.innerHTML = '';
    const panes = [a, b].map((id, i) => {
        const pane = document.createElement('div');
        pane.className = 'pane' + (i === 0 ? ' active' : '');
        pane.innerHTML = `<div class="pane-title">${esc(data.diplomas[id].shortTitle)} · ${esc(data.diplomas[id].title)}</div>`;
        el.viewCompare.appendChild(pane);
        const model = new TreeModel(data);
        model.setView({ focus: id, diplomas: new Set(ids), showPlanned: false, mode: '2d' });
        const renderer = new Radial2D(pane, model, { onSelect: d => clickNode(d, model), palette: Theme.palette(), trailProvider });
        renderer.setShowRelations(state.showRelations);
        pane.addEventListener('pointerdown', () => setActivePane(i));
        return { model, renderer, el: pane, id };
    });
    state.compare = { a, b, panes, active: 0 };
    panes.forEach(p => { p.renderer.setSelected(p.model.root); p.renderer.update(p.model.root); p.renderer.fit(false); });
    select(panes[0].model.root, panes[0].model.root, { fit: true });
}
function setActivePane(i) {
    if (!state.compare || state.compare.active === i) return;
    state.compare.active = i;
    state.compare.panes.forEach((p, j) => p.el.classList.toggle('active', i === j));
}
function exitCompare(reroute = true) {
    if (!state.compare) return;
    state.compare.panes.forEach(p => p.renderer.destroy());
    el.viewCompare.innerHTML = '';
    el.viewCompare.classList.add('hidden');
    el.viewCompare.parentElement.classList.remove('comparing');
    el.viewMain.classList.remove('hidden');
    el.filterBtn.parentElement.classList.remove('hidden');
    el.compareBar.classList.add('hidden');
    el.compareBtn.setAttribute('aria-pressed', 'false');
    el.legend.classList.toggle('hidden', state.mode === '3d');
    state.compare = null;
    if (reroute && state.renderer) { state.renderer.setSelected(state.selected); }
}
el.compareA.addEventListener('change', () => { location.hash = `#/compare?a=${el.compareA.value}&b=${el.compareB.value}`; });
el.compareB.addEventListener('change', () => { location.hash = `#/compare?a=${el.compareA.value}&b=${el.compareB.value}`; });

// ==========================================
// LINHA DO TEMPO
//   ?ano=1975 na URL. Diplomas aparecem no ano de promulgação; antes disso, o antecessor
//   surge como fantasma. Divisões com `since` só aparecem a partir do seu ano.
// ==========================================
const currentYear = new Date().getFullYear();
function eventYears() { return [...new Set(state.events.map(e => e.year))].sort((a, b) => a - b); }

function initTimeline() {
    const years = eventYears();
    const min = years[0] || 1824;
    el.tlRange.min = String(min); el.tlRange.max = String(currentYear); el.tlRange.value = String(currentYear);
    el.tlMin.textContent = String(min);
    el.tlTicks.innerHTML = years.map(y => `<option value="${y}" label="${y}"></option>`).join('');
}

function yearFromHash() { return state.model.view.year; }

function setYear(year, { fromPlay = false } = {}) {
    const model = state.model;
    const { parts } = model.parseHash(location.hash);
    if (parts[0] === 'compare') { exitCompare(); }
    const path = parts[0] === 'compare' ? [] : parts;
    const target = (model.isFocus() ? `#/${model.view.focus}` : '#/' + path.join('/')) + model.viewParams({ year, focus: model.view.focus });
    if (!fromPlay) stopPlay();
    if (location.hash === target) return;
    location.hash = target;
}

function syncTimelineUi() {
    const y = yearFromHash();
    el.tlYear.textContent = y == null ? 'hoje' : String(y);
    el.tlRange.value = String(y == null ? currentYear : y);
    el.timelineBtn.setAttribute('aria-pressed', String(state.timelineOpen));
    if (y != null && !state.timelineOpen) toggleTimeline(true);
    renderEvents(y);
}

function renderEvents(y) {
    if (!state.timelineOpen) return;
    if (y == null) {
        const n = state.model.catalog.diplomas.length;
        el.tlEvents.innerHTML = `<span class="ev diploma">${n} diplomas mapeados vigentes.</span><span>Arraste o controle ou pressione ▶ para ver o ordenamento crescer desde ${el.tlMin.textContent}.</span>`;
        return;
    }
    const here = state.events.filter(e => e.year === y);
    const model = state.model;
    const inForce = Object.values(model.data.diplomas).filter(d => d.year <= y).length;
    const ghosts = Object.values(model.data.diplomas).filter(d => d.year > y && (d.predecessors || []).some(p => p.from <= y && y < p.to)).length;
    const head = `<span class="ev">${inForce} diploma(s) atuais já vigentes${ghosts ? `, ${ghosts} antecessor(es)` : ''}.</span>`;
    if (!here.length) {
        const prev = [...state.events].reverse().find(e => e.year < y);
        el.tlEvents.innerHTML = head + (prev ? `<span class="ev ${prev.kind}">Último marco: ${prev.year}, ${esc(prev.text)}</span>` : '');
        return;
    }
    el.tlEvents.innerHTML = head + here.map(e => `<span class="ev ${e.kind}"><a href="${linkToKey(e.key, { year: y })}">${esc(e.text)}</a></span>`).join('');
}

function toggleTimeline(open) {
    state.timelineOpen = open == null ? !state.timelineOpen : open;
    el.timelineBar.classList.toggle('hidden', !state.timelineOpen);
    el.timelineBtn.setAttribute('aria-pressed', String(state.timelineOpen));
    if (!state.timelineOpen) { stopPlay(); if (yearFromHash() != null) setYear(null); }
    else renderEvents(yearFromHash());
}

function stopPlay() {
    if (state.playing) { clearTimeout(state.playing); state.playing = null; }
    el.tlPlay.textContent = '▶'; el.tlPlay.setAttribute('aria-label', 'Reproduzir');
}
function play() {
    if (state.playing) { stopPlay(); return; }
    const years = eventYears();
    let i = yearFromHash() == null ? 0 : Math.max(0, years.findIndex(y => y > yearFromHash()));
    if (i < 0 || i >= years.length) i = 0;
    el.tlPlay.textContent = '❚❚'; el.tlPlay.setAttribute('aria-label', 'Pausar');
    // pausa em cada ano com evento; a velocidade divide a pausa
    const step = () => {
        if (i >= years.length) { setYear(null, { fromPlay: true }); stopPlay(); state.renderer.fit(); return; }
        setYear(years[i++], { fromPlay: true });
        state.playing = setTimeout(step, 1400 / (+el.tlSpeed.value || 1));
    };
    step();
}

el.timelineBtn.addEventListener('click', () => toggleTimeline());
el.tlRange.addEventListener('input', () => { el.tlYear.textContent = el.tlRange.value === String(currentYear) ? 'hoje' : el.tlRange.value; });
el.tlRange.addEventListener('change', () => { const v = +el.tlRange.value; setYear(v >= currentYear ? null : v); });
el.tlToday.addEventListener('click', () => setYear(null));
el.tlPlay.addEventListener('click', play);
try { const sp = localStorage.getItem('lex-tree:speed'); if (sp && el.tlSpeed.querySelector(`option[value="${sp}"]`)) el.tlSpeed.value = sp; } catch { /* ignore */ }
el.tlSpeed.addEventListener('change', () => { try { localStorage.setItem('lex-tree:speed', el.tlSpeed.value); } catch { /* ignore */ } });

/** Hash para uma chave diploma/divisao, garantindo que o diploma esteja no filtro e fora do foco. */
function linkToKey(key, override = {}) {
    const model = state.model;
    const docId = key.split('/')[0];
    const diplomas = model.view.diplomas.has(docId) ? model.view.diplomas : new Set([...model.view.diplomas, docId]);
    return `#/${key}${model.viewParams({ focus: null, diplomas, year: null, ...override })}`;
}

// ==========================================
// PERCURSOS GUIADOS
// ==========================================
function renderToursPop() {
    const tours = state.data.tours;
    el.toursPop.innerHTML = tours.length
        ? `<div class="px-2 pt-1 pb-2 font-semibold strong">Percursos guiados</div>` + tours.map(t => `
            <a href="#" class="tour-item" data-tour="${t.id}">
                <b>${esc(t.title)}</b>${t.status === 'rascunho' ? ' <span class="chip outline" style="font-size:9px">rascunho</span>' : ''}
                <div class="text-xs muted mt-0.5">${esc(t.summary)} · ${t.steps.length} passos</div>
            </a>`).join('')
        : '<div class="p-3 muted">Nenhum percurso cadastrado.</div>';
    el.toursPop.querySelectorAll('[data-tour]').forEach(a => a.addEventListener('click', ev => { ev.preventDefault(); startTour(a.dataset.tour); }));
}
el.toursBtn.addEventListener('click', ev => { ev.stopPropagation(); togglePop(el.toursPop, el.toursBtn); });

function startTour(id) {
    const tour = state.data.tours.find(t => t.id === id);
    if (!tour) return;
    closePopovers();
    if (study && study.active) study.stop();
    if (state.compare) location.hash = '#/';
    state.tour = { tour, step: -1 };
    el.toursBtn.setAttribute('aria-pressed', 'true');
    tourGo(0);
}
function endTour() {
    state.tour = null;
    el.tourCard.classList.add('hidden');
    el.tourCard.innerHTML = '';
    el.toursBtn.setAttribute('aria-pressed', 'false');
}
function tourGo(i) {
    if (!state.tour) return;
    const { tour } = state.tour;
    if (i < 0) return;
    if (i >= tour.steps.length) { endTour(); toast('Percurso concluído'); return; }
    state.tour.step = i;
    const step = tour.steps[i];
    location.hash = linkToKey(step.key);
    renderTourCard();
}
function renderTourCard() {
    const { tour, step } = state.tour;
    const s = tour.steps[step];
    const model = state.model;
    const [docId, ...path] = s.key.split('/');
    const doc = model.data.diplomas[docId];
    let n = doc.root; const labels = [];
    for (const seg of path) { n = (n.children || []).find(c => c.id === seg); if (!n) break; labels.push(n.label); }
    const where = `${doc.shortTitle}${labels.length ? ' › ' + labels.join(' › ') : ''}${n && n !== doc.root ? ` · ${n.subtitle}` : ''}`;
    el.tourCard.classList.remove('hidden');
    el.tourCard.innerHTML = `
        <div class="tour-head"><span>Percurso · passo ${step + 1} de ${tour.steps.length}</span><button type="button" class="muted" id="tour-close" aria-label="Encerrar percurso">×</button></div>
        <div class="tour-title">${esc(tour.title)}</div>
        <div class="tour-node">${esc(where)}</div>
        <p class="tour-text">${glossaryHighlight(esc(s.text), model.data.glossary)}</p>
        <div class="tour-foot">
            <button type="button" class="btn btn-sm" id="tour-prev" ${step === 0 ? 'disabled' : ''}>Anterior</button>
            <button type="button" class="btn btn-sm btn-primary" id="tour-next">${step === tour.steps.length - 1 ? 'Concluir' : 'Próximo'}</button>
            <span class="tour-dots" aria-hidden="true">${tour.steps.map((_, j) => `<i class="${j < step ? 'done' : j === step ? 'cur' : ''}"></i>`).join('')}</span>
        </div>`;
    $('tour-prev').addEventListener('click', () => tourGo(step - 1));
    $('tour-next').addEventListener('click', () => tourGo(step + 1));
    $('tour-close').addEventListener('click', endTour);
}

// ==========================================
// VISTAS FORA DA ÁRVORE
//   #/aula?m=3d&tipos=processa&sel=cp                 Modo aula (aula.js)
//   #/grafo?por=divisao&tipos=processa&sel=cp&par=cpc,cc  Grafo (graph.js)
//   #/tempo?a=2016&b=2026&g=cpc                       Linha do tempo (timeline.js)
//   #/dados?no=lep/titulo-v                           Dados abertos (dataview.js)
// Cada controlador tem apply(view, query), destroy(), setPalette(p), fit() e clearSelection().
// ==========================================
function setModeNav(name) {
    const active = el.modeNav[name] ? name : 'arvore';
    Object.entries(el.modeNav).forEach(([k, a]) => { if (k === active) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
}
/** O filtro "Diplomas" do cabeçalho segue a visão também nas vistas sem árvore. */
function syncFilterView(view) { if (state.model.setView(view)) renderFilter(); }
function enterView(name, view, query) {
    syncFilterView(view);
    if (state.view !== name) {
        if (state.view) exitView();
        if (state.compare) exitCompare(false);
        if (study && study.active) study.stop();
        if (state.tour) endTour();
        stopPlay();
        document.body.classList.add(`mode-${name}`);
        views[name].el.classList.remove('hidden');
        state.view = name;
    }
    views[name].ctl.apply(view, query);
}
function exitView() {
    const v = views[state.view];
    if (Fullscreen.current() === v.el) Fullscreen.exit();
    v.ctl.destroy();
    document.body.classList.remove(`mode-${state.view}`);
    v.el.classList.add('hidden');
    state.view = null;
}

// ==========================================
// TELA CHEIA (Shift+F): a árvore, ou o palco inteiro com rodapé no Modo aula
// ==========================================
function toggleFullscreen() { Fullscreen.toggle(state.view ? views[state.view].el : el.treeContainer); }
Fullscreen.onChange(cur => {
    document.querySelectorAll('.fs-btn .fs-label').forEach(s => { s.textContent = cur ? 'Sair da tela cheia' : 'Tela cheia'; });
    document.querySelectorAll('.fs-btn').forEach(b => b.setAttribute('aria-pressed', String(!!cur)));
    // o ResizeObserver redimensiona; o enquadramento vem depois do novo tamanho
    setTimeout(() => {
        if (state.view) views[state.view].ctl.fit();
        else if (state.compare) state.compare.panes.forEach(p => p.renderer.fit());
        else if (state.renderer) state.renderer.fit();
    }, 120);
});

// ==========================================
// SOBRE
// ==========================================
const openAbout = () => el.about.showModal();
$('about-btn').addEventListener('click', openAbout);
$('about-btn-desktop').addEventListener('click', openAbout);
$('about-close').addEventListener('click', () => el.about.close());
el.about.addEventListener('click', ev => { if (ev.target === el.about) el.about.close(); });

boot();
