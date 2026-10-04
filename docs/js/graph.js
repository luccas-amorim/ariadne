// Vista Grafo: as relações internormativas como estrutura principal.
// Nós = diplomas (ou, "por divisão", as divisões que têm relação); arestas agregadas por par,
// com espessura pela contagem e seta no destino. Layout determinístico: o ângulo vem do layout
// radial do modelo (a ordem dos ramos) e o raio é fixo, para que a imagem seja sempre a mesma.
// Ao lado, o resumo do nó, o filtro por tipo e a matriz origem × destino.
//   #/grafo?por=divisao&tipos=processa&sel=cp&par=cpc,cc
import { esc, keyLabel } from './data.js';
import { mix } from './features.js';
import { TreeModel } from './model.js';

const R_DIPLOMA = 250, R_DIVISION = 430;
const DURATION = 400;
let graphSeq = 0;

export class GraphView {
    /**
     * @param {object} o
     * @param {object} o.data
     * @param {object} o.els       stage, aside, count, byDiploma, byDivision
     * @param {(hash: string) => void} o.navigate
     * @param {object} o.palette
     */
    constructor({ data, els, navigate, palette }) {
        Object.assign(this, { data, els, navigate, palette });
        this.model = new TreeModel(data);
        this.state = null;
        this.uid = ++graphSeq;
        this.svg = null;
        this.bind();
    }

    // ---------- URL ----------
    parse(view, query) {
        const types = query.has('tipos') ? new Set(query.get('tipos').split(',').filter(t => this.data.relationTypes[t])) : null;
        const par = (query.get('par') || '').split(',');
        return {
            diplomas: view.diplomas, year: view.year, types,
            byDivision: query.get('por') === 'divisao',
            sel: query.get('sel') || null,
            pair: par.length === 2 && par[0] && par[1] ? { from: par[0], to: par[1] } : null
        };
    }
    hashFor(over = {}) {
        const s = { ...this.state, ...over };
        const p = [];
        if (s.diplomas.size !== this.data.catalog.diplomas.length) p.push(`d=${[...s.diplomas].join(',')}`);
        if (s.year != null) p.push(`ano=${s.year}`);
        if (s.byDivision) p.push('por=divisao');
        if (s.types) p.push(`tipos=${[...s.types].join(',')}`);
        if (s.sel) p.push(`sel=${s.sel}`);
        if (s.pair) p.push(`par=${s.pair.from},${s.pair.to}`);
        return '#/grafo' + (p.length ? '?' + p.join('&') : '');
    }

    // ---------- ciclo ----------
    apply(view, query) {
        const prev = this.state;
        this.state = this.parse(view, query);
        this.model.setView({ focus: null, diplomas: this.state.diplomas, showPlanned: false, year: this.state.year });
        if (!this.svg) this.mount();
        const refit = !prev || prev.byDivision !== this.state.byDivision || prev.diplomas.size !== this.state.diplomas.size || prev.year !== this.state.year;
        this.draw(refit);
        this.renderAside();
    }
    destroy() {
        if (this.ro) this.ro.disconnect();
        if (this.svg) { this.svg.interrupt(); this.svg.remove(); }
        this.svg = null;
        this.state = null;
    }
    setPalette(p) { this.palette = p; if (this.state) { this.draw(false); } }

    bind() {
        const e = this.els;
        e.byDiploma.addEventListener('click', () => this.navigate(this.hashFor({ byDivision: false, sel: null })));
        e.byDivision.addEventListener('click', () => this.navigate(this.hashFor({ byDivision: true, sel: null })));
        e.aside.addEventListener('change', ev => {
            const box = ev.target.closest('input[data-type]');
            if (!box) return;
            const all = Object.keys(this.data.relationTypes);
            const cur = new Set(this.state.types || all);
            if (box.checked) cur.add(box.dataset.type); else cur.delete(box.dataset.type);
            this.navigate(this.hashFor({ types: all.every(t => cur.has(t)) ? null : cur }));
        });
        e.aside.addEventListener('click', ev => {
            const cell = ev.target.closest('button[data-pair]');
            if (cell) {
                const [from, to] = cell.dataset.pair.split(',');
                const same = this.state.pair && this.state.pair.from === from && this.state.pair.to === to;
                this.navigate(this.hashFor({ pair: same ? null : { from, to } }));
            }
        });
    }
    clearSelection() {
        if (this.state.sel || this.state.pair) this.navigate(this.hashFor({ sel: null, pair: null }));
    }

    // ---------- desenho ----------
    mount() {
        this.svg = d3.select(this.els.stage).append('svg').attr('width', '100%').attr('height', '100%')
            .attr('role', 'img').attr('aria-label', 'Grafo das relações internormativas');
        const defs = this.svg.append('defs');
        [['hl', 'relation-arrow'], ['dim', 'graph-arrow-dim']].forEach(([k, cls]) => {
            defs.append('marker').attr('id', `g${this.uid}-${k}`).attr('viewBox', '0 0 10 10').attr('refX', 8).attr('refY', 5)
                .attr('markerWidth', 9).attr('markerHeight', 9).attr('markerUnits', 'userSpaceOnUse').attr('orient', 'auto')
                .append('path').attr('class', cls).attr('d', 'M0 0L10 5L0 10z');
        });
        this.g = this.svg.append('g');
        this.gEdges = this.g.append('g').attr('class', 'g-edges');
        this.gNodes = this.g.append('g').attr('class', 'g-nodes');
        this.gLabels = this.g.append('g').attr('class', 'g-edge-labels');
        this.zoom = d3.zoom().scaleExtent([0.2, 4]).on('zoom', ev => this.g.attr('transform', ev.transform));
        this.svg.call(this.zoom).on('dblclick.zoom', null);
        this.svg.on('click', ev => { if (ev.target === this.svg.node()) this.clearSelection(); });
        let last = '';
        this.ro = new ResizeObserver(() => {
            const size = `${this.els.stage.clientWidth}x${this.els.stage.clientHeight}`;
            if (size !== last) { last = size; this.fit(false); }
        });
        this.ro.observe(this.els.stage);
    }

    /** Posições pelo layout radial do modelo: só o ângulo, com raio fixo. */
    positions() {
        const m = this.model, s = this.state;
        m.resetExpansion();
        if (s.byDivision) m.expandAll(m.root);
        m.layout();
        const R = s.byDivision ? R_DIVISION : R_DIPLOMA;
        const pos = new Map();
        m.root.each(d => pos.set(d.key, d.depth === 0 ? [0, 0] : d3.pointRadial(d.x, R)));
        return { pos, R, angle: key => { const d = m.byKey.get(key); return d ? d.x : 0; } };
    }

    radiusOf(n) {
        const deg = n.inN + n.outN;
        return this.state.byDivision ? 6 + 2 * deg : 14 + 2.6 * deg;
    }
    labelOf(n) {
        const d = n.d;
        if (!this.state.byDivision || d.data.kind !== 'division') return this.model.labelOf(d);
        return keyLabel(this.data, n.key).replace(/Título /g, 'Tít. ');
    }
    /** O azul-marinho do ramo constitucional some no tema escuro; ali o traço clareia. */
    strokeOf(color) { return this.palette.name === 'dark' && color.toLowerCase() === '#0f172a' ? this.palette.centerStroke : color; }

    draw(refit) {
        const m = this.model, s = this.state, p = this.palette;
        const graph = m.relationGraph({ types: s.types, byDivision: s.byDivision });
        this.graph = graph;
        const { pos, R, angle } = this.positions();
        this.R = R;
        const nodes = [...graph.nodes.values()].filter(n => n.d && pos.has(n.key));
        nodes.forEach(n => { [n.x, n.y] = pos.get(n.key); n.r = this.radiusOf(n); });
        if (s.byDivision) {
            // mesma ordem do radial, com espaçamento uniforme: as divisões com relação
            // ficam concentradas em poucos trechos da árvore e se encavalariam
            const ring = nodes.filter(n => n.d.depth > 0).sort((a, b) => angle(a.key) - angle(b.key));
            const a0 = ring.length ? angle(ring[0].key) : 0;
            ring.forEach((n, i) => { [n.x, n.y] = d3.pointRadial(a0 + 2 * Math.PI * i / ring.length, R); });
        }
        const byKey = new Map(nodes.map(n => [n.key, n]));
        const sel = s.sel && byKey.has(s.sel) ? s.sel : null;
        const pair = s.pair;
        const linked = new Set(sel ? [sel] : []);
        graph.edges.forEach(e => { if (e.fromKey === sel) linked.add(e.toKey); if (e.toKey === sel) linked.add(e.fromKey); });
        const pairKeys = new Set(graph.edges.map(e => `${e.fromKey}|${e.toKey}`));
        const edges = graph.edges.filter(e => byKey.has(e.fromKey) && byKey.has(e.toKey)).map(e => {
            const a = byKey.get(e.fromKey), b = byKey.get(e.toKey);
            const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len;
            // par nos dois sentidos: cada aresta faz uma curva para um lado
            const bend = pairKeys.has(`${e.toKey}|${e.fromKey}`) ? 0.18 * len : 0;
            const cx = (a.x + b.x) / 2 - uy * bend, cy = (a.y + b.y) / 2 + ux * bend;
            const su = [cx - a.x, cy - a.y], sl = Math.hypot(...su) || 1;
            const eu = [b.x - cx, b.y - cy], el = Math.hypot(...eu) || 1;
            const sx = a.x + su[0] / sl * a.r, sy = a.y + su[1] / sl * a.r;
            const ex = b.x - eu[0] / el * (b.r + 3), ey = b.y - eu[1] / el * (b.r + 3);
            const inPair = pair && pair.from === (s.byDivision ? e.fromKey.split('/')[0] : e.fromKey) && pair.to === (s.byDivision ? e.toKey.split('/')[0] : e.toKey);
            const hl = (sel && (e.fromKey === sel || e.toKey === sel)) || inPair;
            return { ...e, key: `${e.fromKey}|${e.toKey}`, d: `M${sx} ${sy} Q${cx} ${cy} ${ex} ${ey}`, mx: 0.25 * sx + 0.5 * cx + 0.25 * ex, my: 0.25 * sy + 0.5 * cy + 0.25 * ey, hl };
        });
        const anyHl = !!sel || edges.some(e => e.hl);
        const types = this.data.relationTypes;

        const edgeSel = this.gEdges.selectAll('path.g-edge').data(edges, e => e.key);
        edgeSel.exit().remove();
        edgeSel.enter().append('path').attr('class', 'g-edge').attr('opacity', 0)
            .merge(edgeSel)
            .attr('data-from', e => e.fromKey).attr('data-to', e => e.toKey).attr('data-n', e => e.n)
            .classed('hl', e => e.hl).classed('dim', e => anyHl && !e.hl)
            .attr('marker-end', e => `url(#g${this.uid}-${anyHl && !e.hl ? 'dim' : 'hl'})`)
            .style('stroke-width', e => `${1.2 + e.n * 1.1}px`)
            .transition().duration(DURATION)
            .attr('d', e => e.d)
            .attr('opacity', e => anyHl ? (e.hl ? 0.95 : 0.35) : 0.7);

        const labels = edges.filter(e => e.hl);
        const labSel = this.gLabels.selectAll('text.g-edge-label').data(labels, e => e.key);
        labSel.exit().remove();
        labSel.enter().append('text').attr('class', 'g-edge-label').attr('text-anchor', 'middle')
            .merge(labSel)
            .text(e => e.types.map(t => (types[t] || {}).label || t).join(' · '))
            .attr('x', e => e.mx).attr('y', e => e.my - 3);

        const nodeSel = this.gNodes.selectAll('g.g-node').data(nodes, n => n.key);
        nodeSel.exit().remove();
        const enter = nodeSel.enter().append('g').attr('class', 'g-node').attr('tabindex', 0).attr('role', 'button')
            .on('click', (ev, n) => { ev.stopPropagation(); this.navigate(this.hashFor({ sel: this.state.sel === n.key ? null : n.key })); })
            .on('keydown', (ev, n) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); this.navigate(this.hashFor({ sel: this.state.sel === n.key ? null : n.key })); } });
        enter.append('circle');
        enter.append('text').attr('class', 'g-label');
        enter.append('title');
        const merged = enter.merge(nodeSel);
        merged.attr('data-key', n => n.key)
            .attr('aria-label', n => `${this.labelOf(n)}: recebe ${n.inN}, emite ${n.outN}`)
            .attr('aria-pressed', n => String(n.key === sel))
            .transition().duration(DURATION)
            .attr('transform', n => `translate(${n.x},${n.y})`)
            .attr('opacity', n => !sel || linked.has(n.key) ? 1 : 0.45);
        merged.select('circle')
            .attr('r', n => n.r)
            .style('fill', n => {
                const c = m.ramoOf(n.d).color;
                return n.key === sel || m.isCfCenter(n.d) ? (m.isCfCenter(n.d) && n.key !== sel ? p.centerFill : c) : mix(c, 0.14, p.mixBase);
            })
            .style('stroke', n => m.isCfCenter(n.d) ? (n.key === sel ? p.relation : p.centerStroke) : this.strokeOf(m.ramoOf(n.d).color))
            .style('stroke-width', n => n.key === sel ? 3 : 1.5)
            .style('stroke-dasharray', n => (m.docOf(n.d) || {}).natureza === 'processual' ? '5 3' : null);
        merged.select('title').text(n => `${keyLabel(this.data, n.key === m.root.key ? m.root.data.meta.id : n.key)} · recebe ${n.inN} · emite ${n.outN}`);
        const self = this;
        merged.select('text.g-label').each(function (n) {
            const t = d3.select(this), label = self.labelOf(n);
            const filled = n.key === sel || m.isCfCenter(n.d);
            const fits = label.length * 6.6 <= n.r * 2 - 4;
            if (s.byDivision && !m.isCfCenter(n.d)) {
                // rótulo radial, do lado de fora, para não encavalar
                const a = Math.atan2(n.y, n.x) * 180 / Math.PI, flip = a > 90 || a < -90;
                t.text(label).attr('text-anchor', flip ? 'end' : 'start').attr('dy', '0.35em')
                    .attr('transform', `rotate(${flip ? a + 180 : a}) translate(${flip ? -(n.r + 4) : n.r + 4},0)`)
                    .attr('class', 'g-label outside');
            } else {
                t.text(label).attr('transform', null).attr('text-anchor', 'middle')
                    .attr('dy', fits ? '0.35em' : null).attr('y', fits ? 0 : n.r + 13)
                    .attr('class', `g-label${fits ? '' : ' outside'}${fits && filled ? ' on-color' : ''}${m.isCfCenter(n.d) ? ' center' : ''}`);
            }
        });
        if (refit) this.fit(false);
    }

    fit(animate = true) {
        if (!this.svg || !this.state) return;
        const w = this.els.stage.clientWidth, h = this.els.stage.clientHeight;
        if (w < 10 || h < 10) return;
        const pad = this.state.byDivision ? 150 : 70;
        const size = 2 * (this.R + pad);
        const k = Math.min(w / size, h / size, 1.6);
        const t = d3.zoomIdentity.translate(w / 2, h / 2).scale(k);
        (animate ? this.svg.transition().duration(DURATION) : this.svg).call(this.zoom.transform, t);
    }

    // ---------- painel lateral ----------
    /** Diplomas da matriz, na ordem dos ramos (a mesma do radial). */
    matrixOrder() {
        const m = this.model, c = this.data.catalog;
        const present = new Set(m.nodes.filter(d => (d.data.kind === 'diploma' && !d.data.planned) || m.isCfCenter(d)).map(d => d.key));
        const out = [c.root].filter(id => present.has(id));
        c.ramos.forEach(r => c.diplomas.forEach(id => { if (id !== c.root && this.data.diplomas[id].ramo === r.id && present.has(id)) out.push(id); }));
        return out;
    }

    renderAside() {
        const s = this.state, m = this.model, data = this.data, types = data.relationTypes;
        const diplomaGraph = s.byDivision ? m.relationGraph({ types: s.types }) : this.graph;
        const total = diplomaGraph.edges.reduce((a, e) => a + e.n, 0);
        const order = this.matrixOrder();
        this.els.count.textContent = `${total} relações entre ${order.length} diplomas${s.year != null ? ` · em ${s.year}` : ''}`;
        this.els.byDiploma.setAttribute('aria-pressed', String(!s.byDivision));
        this.els.byDivision.setAttribute('aria-pressed', String(s.byDivision));

        // resumo
        let summary;
        const n = s.sel ? this.graph.nodes.get(s.sel) : null;
        if (n && n.d) {
            const ramo = m.ramoOf(n.d), key = n.key === m.root.key ? m.root.data.meta.id : n.key;
            const title = n.d.data.kind === 'division' ? `${n.d.data.doc.shortTitle} › ${n.d.data.node.name}` : (m.docOf(n.d) || {}).title;
            summary = `<span class="chip" style="background:${ramo.color}">${esc(ramo.name)}</span>
                <h2 class="g-title">${esc(title)}</h2>
                <p class="g-sub">Recebe <b>${n.inN}</b> · emite <b>${n.outN}</b></p>
                <a class="btn btn-sm" href="#/${esc(key)}">Abrir na árvore</a>`;
        } else {
            summary = `<h2 class="g-title">Grafo das relações</h2>
                <p class="g-sub">${total} relações entre ${order.length} diplomas. Clique num nó para destacar suas arestas, ou numa célula da matriz para listar as relações daquele par.</p>`;
        }

        // filtro por tipo, com barras
        const counts = {};
        m.relationGraph({ types: null }).edges.forEach(e => e.items.forEach(r => { counts[r.type] = (counts[r.type] || 0) + 1; }));
        const max = Math.max(1, ...Object.values(counts));
        const typeRows = Object.entries(types).filter(([id]) => counts[id]).map(([id, t]) => `
            <label class="g-type">
                <input type="checkbox" data-type="${id}" ${!s.types || s.types.has(id) ? 'checked' : ''}>
                <span class="g-type-label">${esc(t.label)}</span>
                <span class="g-bar" style="width:${Math.round(counts[id] / max * 90)}px"></span>
                <span class="g-type-n">${counts[id]}</span>
            </label>`).join('');

        // matriz origem × destino (sempre por diploma)
        const cell = {};
        diplomaGraph.edges.forEach(e => { cell[`${e.fromKey}>${e.toKey}`] = e.n; });
        const short = id => data.diplomas[id].shortTitle.replace(/^Lei /, '');
        const colSum = id => order.reduce((a, r) => a + (cell[`${r}>${id}`] || 0), 0);
        const rowSum = id => order.reduce((a, c) => a + (cell[`${id}>${c}`] || 0), 0);
        const level = v => v >= 4 ? 'm4' : v >= 2 ? 'm2' : v === 1 ? 'm1' : 'm0';
        const rows = order.map(r => `<span class="mx-row">${esc(short(r))}</span>` + order.map(c => {
            const v = cell[`${r}>${c}`] || 0;
            const on = s.pair && s.pair.from === r && s.pair.to === c;
            if (r === c) return '<span class="mx diag" aria-hidden="true"></span>';
            return v
                ? `<button type="button" class="mx ${level(v)}${on ? ' on' : ''}" data-pair="${r},${c}" aria-label="${esc(short(r))} → ${esc(short(c))}: ${v} relação(ões)">${v}</button>`
                : `<span class="mx m0"></span>`;
        }).join('') + `<span class="mx-sum">${rowSum(r) || ''}</span>`).join('');
        const matrix = `<div class="g-matrix" style="grid-template-columns:40px repeat(${order.length}, 24px) 24px">
                <span></span>${order.map(c => `<span class="mx-col">${esc(short(c))}</span>`).join('')}<span class="mx-col">Σ</span>
                ${rows}
                <span class="mx-row">Σ</span>${order.map(c => `<span class="mx-sum" data-col="${c}">${colSum(c) || ''}</span>`).join('')}<span class="mx-sum" data-total>${total}</span>
            </div>`;

        // relações do par escolhido na matriz
        let pairHtml = '';
        if (s.pair) {
            const e = diplomaGraph.edges.find(x => x.fromKey === s.pair.from && x.toKey === s.pair.to);
            pairHtml = `<div class="g-section"><div class="g-head">${esc(short(s.pair.from))} → ${esc(short(s.pair.to))}</div>
                ${e ? e.items.map(r => `<a class="rel-card" href="#/${esc(r.from)}">
                    <div class="rel-card-head"><b>${esc(keyLabel(data, r.from))}</b><span class="rel-type">→ ${esc((types[r.type] || {}).label || r.type)}</span></div>
                    <div class="rel-via">${esc(keyLabel(data, r.to))}</div>
                    ${r.note ? `<div class="rel-note">${esc(r.note)}</div>` : ''}
                    ${r.basis ? `<div class="rel-basis">fundamento: ${esc(r.basis)}</div>` : ''}
                </a>`).join('') : '<p class="muted text-sm">Nenhuma relação com o filtro atual.</p>'}</div>`;
        }

        this.els.aside.innerHTML = `
            <div class="g-section g-summary">${summary}</div>
            <div class="g-section"><div class="g-head">Tipos de relação</div>${typeRows}</div>
            <div class="g-section"><div class="g-head">Matriz origem × destino</div>${matrix}
                <p class="g-caption">Linha = quem emite. Coluna = quem recebe. Clique numa célula para ver as relações do par.</p></div>
            ${pairHtml}`;
    }
}
