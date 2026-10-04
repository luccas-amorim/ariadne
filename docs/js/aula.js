// Modo aula: vista limpa para projetar em sala. Todos os diplomas (CF ao centro, ramos e
// diplomas, sem divisões abertas), todas as relações cruzadas ao mesmo tempo, com chave geral,
// filtro por tipo e isolamento de um diploma pelo clique. 2D ou 3D sobre o mesmo modelo.
//   #/aula?m=3d&tipos=processa,executa&sel=cp&rel=0
import { esc, keyLabel } from './data.js';
import { TreeModel } from './model.js';

export class Aula {
    /**
     * @param {object} o
     * @param {object} o.data          dados carregados (loadAll)
     * @param {object} o.els           elementos da casca (#aula e filhos)
     * @param {(mode, container, model, opts) => object} o.makeRenderer
     * @param {(hash: string) => void} o.navigate
     */
    constructor({ data, els, makeRenderer, navigate }) {
        Object.assign(this, { data, els, makeRenderer, navigate });
        this.model = new TreeModel(data);
        this.renderer = null;
        this.mode = null;
        this.state = null;
        this.bind();
    }

    // ---------- URL ----------
    /** Lê o estado da URL. `view` vem de model.parseHash (diplomas, ano, m). */
    parse(view, query) {
        const types = query.has('tipos')
            ? new Set(query.get('tipos').split(',').filter(t => this.data.relationTypes[t]))
            : null;
        return {
            mode: view.mode,
            diplomas: view.diplomas,
            year: view.year,
            types,
            show: query.get('rel') !== '0',
            sel: query.get('sel') || null
        };
    }

    hashFor(over = {}) {
        const s = { ...this.state, ...over };
        const p = [];
        if (s.diplomas.size !== this.data.catalog.diplomas.length) p.push(`d=${[...s.diplomas].join(',')}`);
        if (s.year != null) p.push(`ano=${s.year}`);
        if (s.mode === '3d') p.push('m=3d');
        if (s.types) p.push(`tipos=${[...s.types].join(',')}`);
        if (!s.show) p.push('rel=0');
        if (s.sel) p.push(`sel=${s.sel}`);
        return '#/aula' + (p.length ? '?' + p.join('&') : '');
    }

    // ---------- ciclo ----------
    apply(view, query) {
        const next = this.parse(view, query);
        this.state = next;
        const rebuilt = this.model.setView({ focus: null, diplomas: next.diplomas, showPlanned: false, year: next.year, mode: next.mode });
        const sel = next.sel ? this.model.byKey.get(next.sel) : null;
        if (next.sel && (!sel || !this.selectable(sel))) { this.state.sel = null; this.navigate(this.hashFor()); return; }

        let fresh = false;
        if (!this.renderer || this.mode !== next.mode) {
            if (this.renderer) this.renderer.destroy();
            this.mode = next.mode;
            this.renderer = this.makeRenderer(next.mode, this.els.view, this.model, { onSelect: d => this.click(d) });
            this.renderer.setFitInsets({ bottom: 52 });
            if (next.mode === '3d') this.renderer.setAutoRotate(true);
            fresh = true;
        }
        if (rebuilt) fresh = true;
        this.renderer.setRelationMode('all', { types: next.types });
        this.renderer.showRelations = next.show;
        this.renderer.setSelected(sel);
        if (fresh || this.mode === '2d') {
            if (fresh) this.renderer.reset();
            this.renderer.update(this.model.root);
            if (fresh) this.renderer.fit(false);
        } else {
            this.renderer.restyle();
        }
        this.render();
    }

    destroy() {
        if (this.renderer) this.renderer.destroy();
        this.renderer = null;
        this.mode = null;
        this.state = null;
    }

    selectable(d) { return (d.data.kind === 'diploma' && !d.data.planned) || d.data.kind === 'center'; }

    click(d) {
        if (!this.selectable(d)) return;
        this.navigate(this.hashFor({ sel: this.state.sel === d.key ? null : d.key }));
    }

    // ---------- interface ----------
    bind() {
        const e = this.els;
        e.seg2d.addEventListener('click', () => this.navigate(this.hashFor({ mode: '2d' })));
        e.seg3d.addEventListener('click', () => this.navigate(this.hashFor({ mode: '3d' })));
        e.show.addEventListener('click', () => this.toggleShow());
        e.clear.addEventListener('click', () => this.clearSelection());
        e.refit.addEventListener('click', () => this.refit());
        e.types.addEventListener('click', ev => {
            const b = ev.target.closest('button[data-type]');
            if (!b) return;
            const all = this.typeCounts().map(t => t.id);
            const cur = new Set(this.state.types || all);
            if (cur.has(b.dataset.type)) cur.delete(b.dataset.type); else cur.add(b.dataset.type);
            const types = all.every(t => cur.has(t)) ? null : cur;
            this.navigate(this.hashFor({ types, show: true }));
        });
    }
    toggleShow() { this.navigate(this.hashFor({ show: !this.state.show })); }
    clearSelection() { if (this.state.sel) this.navigate(this.hashFor({ sel: null })); }
    refit() { if (!this.renderer) return; this.renderer.fit(); if (this.mode === '3d') this.renderer.setAutoRotate(true); }
    fit() { if (this.renderer) this.renderer.fit(); }
    setPalette(p) { if (this.renderer) this.renderer.setPalette(p); }

    /** Tipos com pelo menos uma relação entre os diplomas visíveis, com a contagem. */
    typeCounts() {
        const counts = {};
        this.model.allRelations().forEach(g => { counts[g.type] = (counts[g.type] || 0) + g.n; });
        return Object.entries(this.data.relationTypes).filter(([id]) => counts[id]).map(([id, t]) => ({ id, label: t.label, n: counts[id] }));
    }

    render() {
        const e = this.els, s = this.state, m = this.model, data = this.data;
        const total = m.allRelations().reduce((a, g) => a + g.n, 0);
        const groups = s.show ? m.allRelations({ types: s.types }) : [];
        const vis = groups.reduce((a, g) => a + g.n, 0);
        const nDiplomas = m.nodes.filter(d => (d.data.kind === 'diploma' && !d.data.planned) || m.isCfCenter(d)).length;
        e.count.textContent = `${nDiplomas} diplomas · ${vis} de ${total} relações visíveis`;
        e.seg2d.setAttribute('aria-pressed', String(s.mode === '2d'));
        e.seg3d.setAttribute('aria-pressed', String(s.mode === '3d'));
        e.show.setAttribute('aria-checked', String(s.show));
        e.clear.disabled = !s.sel;
        e.refit.hidden = s.mode !== '3d';
        e.hint.textContent = s.sel
            ? 'Clique de novo no diploma, ou em "Limpar seleção", para ver tudo.'
            : `Clique num diploma para isolar suas relações.${s.mode === '3d' ? ' Arraste para orbitar.' : ''}`;
        e.types.innerHTML = this.typeCounts().map(t => {
            const on = s.show && (!s.types || s.types.has(t.id));
            return `<button type="button" class="type-chip" data-type="${t.id}" aria-pressed="${on}">${esc(t.label)}<span>${t.n}</span></button>`;
        }).join('');

        if (!s.sel) {
            e.foot.innerHTML = `
                <div class="aula-foot-title">Mapa do ordenamento</div>
                <p class="aula-foot-text">A Constituição ao centro, os cinco ramos e os diplomas mapeados. As linhas roxas saem de quem concretiza, regulamenta, processa ou executa e chegam a quem é concretizado. Clique em um diploma para isolar suas relações.</p>
                <div class="aula-legend">
                    <span><i class="lg-box"></i>material</span>
                    <span><i class="lg-box dashed"></i>processual</span>
                    <span><i class="lg-rel"></i>relação (a seta aponta para o destino)</span>
                </div>`;
            return;
        }
        const node = m.byKey.get(s.sel), doc = m.docOf(node);
        const mine = groups.filter(g => g.fromKey === s.sel || g.toKey === s.sel);
        const nIn = mine.filter(g => g.toKey === s.sel).reduce((a, g) => a + g.n, 0);
        const nOut = mine.filter(g => g.fromKey === s.sel).reduce((a, g) => a + g.n, 0);
        const types = data.relationTypes;
        const cards = mine.flatMap(g => g.items).map(r => `
            <div class="aula-card">
                <div class="aula-card-head">${esc(keyLabel(data, r.from))} <span class="rel-type">→ ${esc((types[r.type] || {}).label || r.type)} →</span> ${esc(keyLabel(data, r.to))}</div>
                ${r.note ? `<div class="aula-card-note">${esc(r.note)}</div>` : ''}
                ${r.basis ? `<div class="rel-basis">fundamento: ${esc(r.basis)}</div>` : ''}
            </div>`).join('');
        e.foot.innerHTML = `
            <div class="aula-foot-head"><span class="aula-foot-title">${esc(doc.shortTitle)} · ${esc(doc.title)}</span><span class="muted">recebe ${nIn} · emite ${nOut}</span></div>
            <div class="aula-cards">${cards || '<span class="muted">Nenhuma relação visível com o filtro atual.</span>'}</div>`;
    }
}
