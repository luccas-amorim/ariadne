// Modelo compartilhado pelos renderizadores 2D e 3D:
// constrói a hierarquia (centro → ramos → diplomas → divisões), controla a visão
// (foco, filtro), a expansão, o layout radial, a URL e as relações internormativas.

const RING = [0, 150, 290];   // raios das três primeiras camadas (centro, ramos, diplomas)
const RING_STEP = 125;        // acréscimo mínimo de raio por nível a partir daí
const RING_MIN_GAP = 95;

let nodeSeq = 0;

export function sameView(a, b) {
    return a.focus === b.focus && a.showPlanned === b.showPlanned
        && a.diplomas.size === b.diplomas.size && [...a.diplomas].every(x => b.diplomas.has(x));
}

export class TreeModel {
    constructor(data) {
        this.data = data;
        this.catalog = data.catalog;
        this.view = { focus: null, diplomas: new Set(data.catalog.diplomas), showPlanned: true };
        this.root = null;
        this.nodes = [];          // todos os nós, inclusive recolhidos
        this.byKey = new Map();   // chave → nó (diploma/divisao/...; ramos pela id; centro pela id do diploma)
        this.treeLayout = d3.tree().size([2 * Math.PI, 1]).separation((a, b) => (a.parent === b.parent ? 1 : 1.4) / a.depth);
    }

    // ---------- visão ----------
    isFocus() { return !!this.view.focus; }
    isCfCenter(d) { return d.data.kind === 'center' && d.data.meta.id === this.catalog.root; }

    /** Aplica uma visão; reconstrói a árvore se mudou. Retorna true quando reconstruiu. */
    setView(view) {
        if (this.root && sameView(view, this.view)) { this.view.mode = view.mode; return false; }
        this.view = { ...view, diplomas: new Set(view.diplomas) };
        this.build();
        return true;
    }

    // ---------- construção ----------
    divisionNode(n, doc) {
        return { kind: 'division', id: n.id, node: n, doc, children: n.children ? n.children.map(c => this.divisionNode(c, doc)) : undefined };
    }

    build() {
        const c = this.catalog, v = this.view, diplomas = this.data.diplomas;
        let data;
        if (v.focus) {
            const doc = diplomas[v.focus];
            data = { kind: 'center', id: doc.id, meta: doc, children: (doc.root.children || []).map(n => this.divisionNode(n, doc)) };
        } else {
            const cf = diplomas[c.root];
            const order = { material: 0, processual: 1 };
            const ramos = c.ramos.map(r => {
                let children;
                if (r.id === cf.ramo) {
                    children = v.diplomas.has(cf.id) ? (cf.root.children || []).map(n => this.divisionNode(n, cf)) : [];
                } else {
                    const mapped = Object.values(diplomas).filter(d => d.id !== c.root && d.ramo === r.id && v.diplomas.has(d.id))
                        .map(d => ({ kind: 'diploma', id: d.id, meta: d, planned: false, children: (d.root.children || []).map(n => this.divisionNode(n, d)) }));
                    const planned = v.showPlanned ? c.planned.filter(p => p.ramo === r.id).map(p => ({ kind: 'diploma', id: p.id, meta: p, planned: true })) : [];
                    children = [...mapped, ...planned].sort((a, b) => (order[a.meta.natureza] - order[b.meta.natureza]) || (a.planned - b.planned));
                }
                return { kind: 'ramo', id: r.id, ramo: r, children: children.length ? children : undefined };
            }).filter(r => r.children);
            data = { kind: 'center', id: cf.id, meta: cf, children: ramos.length ? ramos : undefined };
        }
        const root = d3.hierarchy(data);
        root.each(d => { d.id = ++nodeSeq; d.x0 = 0; d.y0 = 0; });
        this.root = root;
        this.nodes = root.descendants();
        this.byKey = new Map();
        this.nodes.forEach(d => { d.key = this.keyOf(d); this.byKey.set(d.key, d); });
        this.resetExpansion();
    }

    /** Estado padrão. Mapa: ramos abertos, diplomas recolhidos, Títulos da CF recolhidos. Foco: primeiro nível aberto. */
    resetExpansion() {
        this.root.each(d => { if (d._children) { d.children = d._children; d._children = null; } });
        if (this.view.focus) { (this.root.children || []).forEach(c => this.collapse(c)); return; }
        const cfRamo = this.data.diplomas[this.catalog.root].ramo;
        (this.root.children || []).forEach(ramo => {
            if (ramo.data.id === cfRamo) this.collapse(ramo);
            else (ramo.children || []).forEach(c => this.collapse(c));
        });
    }

    collapse(d) { if (d.children) { d._children = d.children; d._children.forEach(c => this.collapse(c)); d.children = null; } }
    expandOne(d) { if (d._children) { d.children = d._children; d._children = null; } }
    toggle(d) { if (d.children) this.collapse(d); else this.expandOne(d); }
    expandAll(d) { this.expandOne(d); (d.children || []).forEach(c => this.expandAll(c)); }
    hasCollapsed(d) { return !!d && (!!d._children || (d.children || []).some(c => this.hasCollapsed(c))); }
    kidsOf(d) { return d.children || d._children || []; }
    isVisible(d) { return d.ancestors().slice(1).every(a => a.children); }
    /** Nó visível mais próximo (o próprio, ou o ancestral aberto mais fundo). */
    visibleRep(d) { let cur = d; while (cur.parent && !this.isVisible(cur)) cur = cur.parent; return cur; }
    countDivisions(d) { let n = 0; (function walk(x) { if (x.data.kind === 'division') n++; (x.children || x._children || []).forEach(walk); })(d); return n; }

    // ---------- acessores ----------
    ramoOf(d) {
        if (d.data.kind === 'center') return this.data.ramos[d.data.meta.ramo];
        if (d.data.kind === 'ramo') return d.data.ramo;
        return this.ramoOf(d.parent);
    }
    docOf(d) {
        if (d.data.kind === 'diploma' || d.data.kind === 'center') return d.data.meta;
        if (d.data.kind === 'division') return d.data.doc;
        return null;
    }
    labelOf(d) {
        switch (d.data.kind) {
            case 'center': return d.data.meta.shortTitle;
            case 'ramo': return d.data.ramo.name;
            case 'diploma': return d.data.meta.shortTitle;
            default: return d.data.node.label;
        }
    }
    nameOf(d) {
        switch (d.data.kind) {
            case 'center': return this.isFocus() ? d.data.meta.title : 'Mapa do ordenamento';
            case 'ramo': return d.data.ramo.name;
            case 'diploma': return d.data.meta.title;
            default: return d.data.node.name;
        }
    }
    titleOf(d) {
        if (d.data.kind === 'diploma') return `${d.data.meta.title}${d.data.planned ? ' (em mapeamento)' : ''}`;
        if (d.data.kind === 'division') return `${d.data.node.name} — ${d.data.node.subtitle}`;
        if (d.data.kind === 'center') return d.data.meta.title;
        return this.labelOf(d);
    }
    isProcessual(d) { const doc = this.docOf(d); return !!doc && doc.natureza === 'processual' && (d.data.kind === 'diploma' || d.data.kind === 'center'); }
    boxWidth(d) {
        const l = this.labelOf(d);
        if (d.data.kind === 'center') return 92;
        if (d.data.kind === 'ramo') return Math.max(110, l.length * 7 + 28);
        return Math.max(72, Math.min(170, l.length * 6.5 + 22));
    }
    /** Chave estável de um nó: 'cc/parte-geral/livro-i', 'privado' (ramo) ou 'cf' (centro). */
    keyOf(d) {
        if (d.data.kind === 'center') return d.data.meta.id;
        if (d.data.kind === 'ramo') return d.data.id;
        const doc = this.docOf(d);
        const path = d.ancestors().reverse().filter(a => a.data.kind === 'division').map(a => a.data.id);
        return [doc.id, ...path].join('/');
    }

    // ---------- layout radial ----------
    /** Ângulos pelo d3.tree; o raio de cada camada cresce para que vizinhos não se sobreponham. */
    layout() {
        const root = this.root;
        this.treeLayout(root);
        const byDepth = d3.group(root.descendants(), d => d.depth);
        const maxDepth = d3.max(byDepth.keys());
        const radii = [0];
        for (let depth = 1; depth <= maxDepth; depth++) {
            const base = depth < RING.length ? RING[depth] : radii[depth - 1] + RING_STEP;
            const nodes = (byDepth.get(depth) || []).slice().sort((a, b) => a.x - b.x);
            let needed = 0;
            if (nodes.length > 1) {
                for (let i = 0; i < nodes.length; i++) {
                    const a = nodes[i], b = nodes[(i + 1) % nodes.length];
                    let gap = b.x - a.x; if (gap <= 0) gap += 2 * Math.PI;
                    const chord = (this.boxWidth(a) + this.boxWidth(b)) / 2 + 16;
                    needed = Math.max(needed, chord / (2 * Math.sin(Math.min(gap, Math.PI) / 2)));
                }
            }
            radii[depth] = Math.max(base, Math.ceil(needed), radii[depth - 1] + RING_MIN_GAP);
        }
        root.each(d => {
            d.y = radii[d.depth];
            [d.px, d.py] = d.depth === 0 ? [0, 0] : d3.pointRadial(d.x, d.y);
        });
        this.radii = radii;
        return radii;
    }

    visibleBounds() {
        let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
        this.root.each(d => {
            const w = this.boxWidth(d) / 2 + 12, h = d.data.kind === 'center' ? 50 : 22;
            x0 = Math.min(x0, d.px - w); x1 = Math.max(x1, d.px + w);
            y0 = Math.min(y0, d.py - h); y1 = Math.max(y1, d.py + h);
        });
        return { x0, y0, x1, y1 };
    }

    // ---------- URL ----------
    viewParams(override = {}) {
        const v = { ...this.view, ...override };
        const all = this.catalog.diplomas;
        const p = [];
        if (v.focus) p.push(`foco=${v.focus}`);
        if (v.diplomas.size !== all.length) p.push(`d=${[...v.diplomas].join(',')}`);
        if (!v.showPlanned) p.push('p=0');
        if (v.mode === '3d') p.push('m=3d');
        return p.length ? '?' + p.join('&') : '';
    }

    parseHash(hash) {
        const raw = hash.replace(/^#\/?/, '');
        const qi = raw.indexOf('?');
        const pathStr = qi >= 0 ? raw.slice(0, qi) : raw;
        const q = new URLSearchParams(qi >= 0 ? raw.slice(qi + 1) : '');
        const all = this.catalog.diplomas, diplomas = this.data.diplomas;
        const focus = q.get('foco');
        const view = {
            focus: focus && diplomas[focus] ? focus : null,
            diplomas: new Set(q.has('d') ? q.get('d').split(',').filter(id => diplomas[id]) : all),
            showPlanned: q.get('p') !== '0',
            mode: q.get('m') === '3d' ? '3d' : '2d'
        };
        if (!view.diplomas.size) view.diplomas = new Set(all);
        return { parts: pathStr.split('/').filter(Boolean).map(decodeURIComponent), view, query: q };
    }

    rootHash(override = {}) {
        const v = { ...this.view, ...override };
        return (v.focus ? `#/${v.focus}` : '#/') + this.viewParams(v);
    }

    hashForNode(d, override = {}) {
        if (d.data.kind === 'center') return this.rootHash(override);
        return `#/${d.key}${this.viewParams(override)}`;
    }

    /** Resolve as partes do caminho da URL para um nó da árvore atual (ou null). */
    resolvePath(parts) {
        const root = this.root;
        const walk = (start, segs) => {
            let cur = start;
            for (const seg of segs) {
                const next = this.kidsOf(cur).find(k => k.data.kind === 'division' && k.data.id === seg);
                if (!next) break;
                cur = next;
            }
            return cur;
        };
        if (!parts.length) return root;
        const [head, ...rest] = parts;
        if (this.isFocus()) return head === this.view.focus ? walk(root, rest) : null;
        if (this.data.ramos[head] && !this.data.diplomas[head]) return (root.children || []).find(r => r.data.id === head) || null;
        const doc = this.data.diplomas[head];
        if (!doc) return null;
        const ramo = (root.children || []).find(r => r.data.id === doc.ramo);
        if (!ramo) return null;
        if (doc.id === this.catalog.root) return rest.length ? walk(ramo, rest) : root;
        const dip = this.kidsOf(ramo).find(k => k.data.kind === 'diploma' && k.data.id === doc.id);
        return dip ? walk(dip, rest) : null;
    }

    // ---------- relações internormativas ----------
    /**
     * Relações do nó (como origem ou destino), incluindo as de seus descendentes recolhidos
     * quando `includeDescendants` é true. Cada item: { rel, dir, other, otherKey }.
     * `other` é o nó correspondente na árvore atual, ou null se o diploma não está visível.
     */
    relationsFor(d, { includeDescendants = false } = {}) {
        const keys = new Set([d.key]);
        if (includeDescendants) (function walk(x) { (x.children || x._children || []).forEach(c => { keys.add(c.key); walk(c); }); })(d);
        const out = [];
        for (const rel of this.data.relations) {
            let dir = null, otherKey = null;
            if (keys.has(rel.from)) { dir = 'out'; otherKey = rel.to; }
            else if (keys.has(rel.to)) { dir = 'in'; otherKey = rel.from; }
            if (!dir) continue;
            if (keys.has(otherKey)) continue; // relação interna ao subconjunto
            out.push({ rel, dir, otherKey, other: this.byKey.get(otherKey) || null, selfKey: dir === 'out' ? rel.from : rel.to });
        }
        return out;
    }

    nodeByKey(key) { return this.byKey.get(key) || null; }
}
