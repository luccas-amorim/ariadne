// Orquestração: roteamento por hash, painel de leitura, trilha de navegação, filtros,
// alternância 2D/3D, comparação lado a lado, modo estudo, trilha pessoal, exportação,
// lista acessível, teclado e tema.
import { loadAll, buildSearchIndex, search, parseIdentifier, glossaryHighlight, timelineEvents, esc, sleep } from './data.js';
import { TreeModel } from './model.js';
import { Radial2D } from './radial2d.js';
import { Tree3D } from './tree3d.js';
import { Trail, Theme, svgSnapshot, downloadSvg, downloadPngFromSvg, downloadDataUrl, downloadText, renderOutline } from './features.js';
import { Study } from './study.js';

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
    about: $('about'), printFooter: $('print-footer')
};

const state = {
    data: null, index: [], model: null, renderer: null, mode: '2d',
    selected: null, growing: false, suppressRoute: null, booted: false,
    compare: null,   // { a, b, panes: [{model, renderer, el}], active }
    outlineOpen: false,
    showRelations: (() => { try { return localStorage.getItem('lex-tree:relations') !== '0'; } catch { return true; } })(),
    events: [], timelineOpen: false, playing: null,
    tour: null       // { tour, step }
};
const trail = new Trail();
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
function makeRenderer(mode, container, model) {
    const opts = { onSelect: d => clickNode(d, model), palette: Theme.palette(), trailProvider };
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

    if (parts[0] === 'compare') { enterCompare(query.get('a'), query.get('b')); return; }
    if (state.compare) exitCompare();
    if (parts[0] === 'mapa') { location.hash = '#/' + state.model.viewParams(view); return; }

    const model = state.model;
    const rendererChanged = ensureRenderer(view.mode);
    const rebuilt = model.setView(view);
    let fresh = rendererChanged || rebuilt || !state.booted;
    if (rebuilt) renderFilter();
    syncTimelineUi();

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
const action = (text, href, primary = false, onClick = null) => ({ text, href, primary, onClick });
const link = (text, href) => ({ text, href, external: true });
const natTag = doc => tag(doc.natureza === 'processual' ? 'Direito processual (formal)' : 'Direito material', '#64748b');
const statusTag = doc => doc.status === 'rascunho' ? tag('Rascunho: estrutura a revisar', '#b45309') : '';
const yearTag = model => model.view.year != null ? `<span class="chip year-chip">Em ${model.view.year}</span>` : '';

function docKeys(model, doc) { return model.nodes.filter(n => n.data.kind === 'division' && model.docOf(n) === doc).map(n => n.key); }

function progressHtml(model, doc) {
    const keys = docKeys(model, doc);
    if (!keys.length) return '';
    const c = trail.counts(keys);
    const pct = v => `${(v / c.total) * 100}%`;
    return `<div class="mt-3 w-full flex flex-col items-center gap-1">
        <div class="progress"><span class="studied" style="width:${pct(c.studied)}"></span><span class="review" style="width:${pct(c.review)}"></span></div>
        <span class="muted text-xs">${c.studied} de ${c.total} divisões estudadas${c.review ? `, ${c.review} para revisar` : ''}</span></div>`;
}

function historyHtml(node) {
    if (!node.history || !node.history.length) return '';
    return `<ul class="history"><li class="muted" style="font-weight:600">Marcos estruturais</li>${node.history.map(h => `<li><b>${h.year}</b> · ${esc(h.norm)}: ${esc(h.note)}</li>`).join('')}</ul>`;
}

function relationsHtml(model, d) {
    const items = model.relationsFor(d, { includeDescendants: d.data.kind !== 'division' });
    if (!items.length) return '';
    const types = model.data.relationTypes;
    const nodeLabel = key => {
        const [docId, ...path] = key.split('/');
        const doc = model.data.diplomas[docId];
        if (!doc) return key;
        let n = doc.root; const labels = [];
        for (const seg of path) { n = (n.children || []).find(c => c.id === seg); if (!n) break; labels.push(n.label); }
        return `${doc.shortTitle}${labels.length ? ' › ' + labels.join(' › ') : ''}`;
    };
    const hrefFor = r => {
        if (r.other) return model.hashForNode(r.other);
        const docId = r.otherKey.split('/')[0];
        return `#/${r.otherKey}${model.viewParams({ focus: null, diplomas: new Set([...model.view.diplomas, docId]) })}`;
    };
    return `<ul class="relations">
        <li class="muted" style="font-weight:600;border-top:0">Relações internormativas</li>
        ${items.map(r => {
            const t = types[r.rel.type] || { label: r.rel.type };
            const selfLabel = r.selfKey !== d.key ? `<span class="muted">${esc(nodeLabel(r.selfKey))}</span> ` : '';
            const phrase = r.direction === 'out'
                ? `${selfLabel}<span class="rel-type">${esc(t.label)}</span> <a href="${hrefFor(r)}">${esc(nodeLabel(r.otherKey))}</a>`
                : `<a href="${hrefFor(r)}">${esc(nodeLabel(r.otherKey))}</a> <span class="rel-type">${esc(t.label)}</span> ${selfLabel || 'este nó'}`;
            return `<li>${phrase}${r.rel.note ? `<div class="muted text-xs mt-0.5">${esc(r.rel.note)}</div>` : ''}${r.rel.basis ? `<div class="rel-basis">fundamento: ${esc(r.rel.basis)}</div>` : ''}${!r.other ? '<div class="muted text-xs">Diploma oculto pelo filtro; o link o reexibe.</div>' : ''}</li>`;
        }).join('')}
    </ul>`;
}

function trailActions(key) {
    const cur = trail.get(key);
    return [
        action(cur === 'studied' ? '✓ Estudado' : 'Marcar estudado', null, false, () => { trail.toggle(key, 'studied'); }),
        action(cur === 'review' ? '↺ Revisar (marcado)' : 'Revisar depois', null, false, () => { trail.toggle(key, 'review'); })
    ];
}

function showPanel(d, model = activeModel()) {
    if (study && study.active) return;
    const r = model.ramoOf(d);
    const common = [];
    if (model.hasCollapsed(d)) common.push(action('Expandir tudo daqui', null, false, () => grow(d)));
    common.push(action('Centralizar', null, false, () => activeRenderer().centerOn(d)));
    if (!state.compare) common.push(action('Copiar link', null, false, copyLink));
    const gloss = text => glossaryHighlight(esc(text), model.data.glossary);

    if (d.data.kind === 'center' && model.isFocus()) {
        const m = d.data.meta;
        setPanel({
            tags: [tag('Foco', '#0f172a'), tag(r.name, r.color), natTag(m), statusTag(m)],
            title: m.title, subtitle: m.norm,
            html: gloss(m.root.content) + (m.note ? `<br><span class="text-sm muted mt-2 inline-block">${esc(m.note)}</span>` : ''),
            extra: progressHtml(model, m) + historyHtml(m.root) + relationsHtml(model, d),
            actions: state.compare ? common : [action('Ver no mapa completo', `#/${m.id}${model.viewParams({ focus: null })}`, true), link('Texto oficial no Planalto', m.source), ...common]
        });
    } else if (d.data.kind === 'diploma' && d.data.ghost) {
        const m = d.data.meta, cur = m.ghostOf;
        setPanel({
            tags: [tag(r.name, r.color), natTag(cur), yearTag(model), tag('Antecessor histórico', '#64748b')],
            title: m.title, subtitle: m.norm,
            html: `Em ${model.view.year}, este era o diploma vigente no lugar que hoje ocupa ${esc(cur.title)}. Vigeu de ${m.year} até ${esc(String((cur.predecessors.find(p => p.from === m.year) || {}).to || cur.year))}, quando foi substituído. A estrutura mapeada neste projeto é a do diploma atual.`,
            extra: '', actions: [action(`Ver ${cur.shortTitle} hoje`, model.hashForNode(d, { year: null }), true), link('Texto oficial do diploma atual', cur.source), ...common]
        });
    } else if (d.data.kind === 'center' && d.data.meta.ghostOf) {
        const m = d.data.meta;
        setPanel({
            tags: [tag('Nó central', '#0f172a'), tag(r.name, r.color), yearTag(model)],
            title: m.title, subtitle: m.norm,
            html: esc(m.root.content),
            extra: '', actions: [action('Voltar ao presente', model.rootHash({ year: null }), true), ...common]
        });
    } else if (d.data.kind === 'center') {
        const m = d.data.meta;
        const hidden = model.catalog.diplomas.length - model.view.diplomas.size;
        setPanel({
            tags: [tag('Nó central', '#0f172a'), tag(r.name, r.color), yearTag(model)],
            title: 'Mapa do ordenamento', subtitle: m.norm,
            html: gloss(m.root.content) + ' Clique em um ramo para ler sua definição, em um diploma para abri-lo no próprio mapa, ou use "Expandir tudo" para ver a árvore inteira conectada.'
                + (hidden ? `<br><span class="text-sm muted mt-2 inline-block">${hidden} diploma(s) oculto(s) pelo filtro "Diplomas".</span>` : ''),
            extra: progressHtml(model, m) + historyHtml(m.root),
            actions: [
                ...(model.view.diplomas.has(m.id) ? [action('Abrir os Títulos da Constituição', `#/${r.id}${model.viewParams()}`, true)] : []),
                action('Focar na Constituição', model.rootHash({ focus: m.id })),
                link('Texto oficial', m.source), ...common
            ]
        });
    } else if (d.data.kind === 'ramo') {
        const kids = model.kidsOf(d);
        const list = kids.filter(k => k.data.kind === 'diploma').map(k => k.data.planned
            ? `<span class="muted italic">${esc(k.data.meta.shortTitle)}</span>`
            : `<a class="underline decoration-dotted" href="${model.hashForNode(k)}">${esc(k.data.meta.shortTitle)}</a>`).join(' · ');
        setPanel({
            tags: [tag(r.name, r.color)], title: r.name, subtitle: 'Ramo do Direito',
            html: `${esc(r.description)}${list ? `<br><span class="text-sm muted mt-3 inline-block">Diplomas: ${list}</span>` : ''}`,
            extra: '', actions: common
        });
    } else if (d.data.kind === 'diploma' && d.data.planned) {
        const m = d.data.meta;
        setPanel({
            tags: [tag(r.name, r.color), natTag(m), tag('Em mapeamento', '#94a3b8')],
            title: m.title, subtitle: m.norm,
            html: `Este diploma ainda não foi mapeado. ${m.note ? esc(m.note) + ' ' : ''}Contribuições são bem-vindas: o guia explica como estruturar Títulos e Capítulos em um arquivo JSON.`,
            extra: '', actions: [link('Como contribuir', 'https://github.com/luccas-amorim/ariadne/blob/main/CONTRIBUTING.md'), link('Texto oficial', m.source)]
        });
    } else if (d.data.kind === 'diploma') {
        const m = d.data.meta;
        setPanel({
            tags: [tag(r.name, r.color), natTag(m), statusTag(m), yearTag(model)],
            title: m.title, subtitle: m.norm,
            html: gloss(m.root.content) + (m.note ? `<br><span class="text-sm muted mt-2 inline-block">${esc(m.note)}</span>` : ''),
            extra: progressHtml(model, m) + historyHtml(m.root) + relationsHtml(model, d),
            actions: [action('Focar neste diploma', model.hashForNode(d, { focus: m.id }), true), action(`Comparar ${m.shortTitle} com…`, null, false, () => openCompareWith(m.id)), link('Texto oficial no Planalto', m.source), ...common]
        });
    } else {
        const n = d.data.node, doc = d.data.doc;
        const focusAction = state.compare ? null : model.isFocus()
            ? action('Ver no mapa completo', model.hashForNode(d, { focus: null }))
            : action(`Focar em ${doc.shortTitle}`, model.hashForNode(d, { focus: doc.id }));
        setPanel({
            tags: [tag(r.name, r.color), natTag(doc), tag(doc.shortTitle, '#334155'), n.revoked ? tag('Revogado', '#991b1b') : '', yearTag(model)],
            title: n.name, subtitle: n.subtitle,
            html: gloss(n.content).replace(/\n/g, '<br>'),
            extra: historyHtml(n) + relationsHtml(model, d),
            actions: [...(focusAction ? [focusAction] : []), ...trailActions(d.key), link('Texto oficial no Planalto', doc.source), ...common]
        });
    }
}

let panelTimer = null;
function setPanel({ tags, title, subtitle, html, extra, actions }) {
    el.panel.style.opacity = 0;
    clearTimeout(panelTimer);
    panelTimer = setTimeout(() => {
        if (study && study.active) { el.panel.style.opacity = 1; return; } // o cartão de estudo tem prioridade
        el.panel.innerHTML = `
            <div id="node-tags" class="flex flex-wrap justify-center gap-2 mb-2">${tags.filter(Boolean).join('')}</div>
            <h2 id="node-title" class="text-xl sm:text-2xl font-bold strong">${esc(title)}</h2>
            <p id="node-subtitle" class="text-xs sm:text-sm font-semibold mt-1 mb-3 tracking-widest uppercase" style="color:var(--text-faint)">${esc(subtitle)}</p>
            <p id="node-text" class="text-base sm:text-lg leading-relaxed max-w-2xl">${html}</p>
            <div id="node-extra" class="w-full max-w-2xl flex flex-col items-center">${extra || ''}</div>
            <div id="node-actions" class="flex flex-wrap justify-center gap-2 mt-4"></div>
            <p class="print-footer">Ariadne — Árvores Jurídicas BR · ${esc(location.href)} · código MIT · conteúdo CC BY 4.0</p>`;
        const box = el.panel.querySelector('#node-actions');
        actions.forEach(a => {
            const b = document.createElement('a');
            b.textContent = a.text;
            b.className = a.primary ? 'btn btn-primary' : 'btn';
            if (a.href) b.href = a.href;
            if (a.external) { b.target = '_blank'; b.rel = 'noopener'; }
            if (a.onClick) { b.href = '#'; b.addEventListener('click', ev => { ev.preventDefault(); a.onClick(); }); }
            box.appendChild(b);
        });
        el.panel.style.opacity = 1;
    }, 150);
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

function copyLink() {
    const url = location.href;
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(() => toast('Link copiado'));
    else toast(url);
}

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
$('ctl-fit').addEventListener('click', () => { if (state.compare) state.compare.panes.forEach(p => p.renderer.fit()); else activeRenderer().fit(); });
$('ctl-in').addEventListener('click', () => activeRenderer().zoomBy(1.4));
$('ctl-out').addEventListener('click', () => activeRenderer().zoomBy(1 / 1.4));

document.addEventListener('keydown', ev => {
    if (ev.target === el.search || ev.target.closest('dialog, input, select, textarea')) return;
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
    const step = () => {
        if (i >= years.length) { setYear(null, { fromPlay: true }); stopPlay(); state.renderer.fit(); return; }
        setYear(years[i++], { fromPlay: true });
        state.playing = setTimeout(step, 1400);
    };
    step();
}

el.timelineBtn.addEventListener('click', () => toggleTimeline());
el.tlRange.addEventListener('input', () => { el.tlYear.textContent = el.tlRange.value === String(currentYear) ? 'hoje' : el.tlRange.value; });
el.tlRange.addEventListener('change', () => { const v = +el.tlRange.value; setYear(v >= currentYear ? null : v); });
el.tlToday.addEventListener('click', () => setYear(null));
el.tlPlay.addEventListener('click', play);

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
// SOBRE
// ==========================================
const openAbout = () => el.about.showModal();
$('about-btn').addEventListener('click', openAbout);
$('about-btn-desktop').addEventListener('click', openAbout);
$('about-close').addEventListener('click', () => el.about.close());
el.about.addEventListener('click', ev => { if (ev.target === el.about) el.about.close(); });

boot();
