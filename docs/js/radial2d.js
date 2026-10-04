// Renderizador 2D: árvore radial em SVG com D3, colapsável, com relações internormativas
// e marcas da trilha pessoal. Lê posições e cores do modelo compartilhado.
import { mix } from './features.js';

const DURATION = 450;
const NODE_H = 30;
let markerSeq = 0;

export class Radial2D {
    constructor(container, model, { onSelect, palette, trailProvider = () => null } = {}) {
        this.container = container;
        this.model = model;
        this.onSelect = onSelect || (() => {});
        this.palette = palette;
        this.trailProvider = trailProvider;
        this.selected = null;
        this.userZoomed = false;
        this.hideLabels = false;
        this.showRelations = true;

        this.svg = d3.select(container).append('svg').attr('width', '100%').attr('height', '100%').attr('role', 'img').attr('aria-label', 'Árvore radial da legislação');
        this.g = this.svg.append('g');
        // Seta das relações: tamanho fixo em unidades do desenho, para não crescer com a espessura.
        // Fica dentro de `g` para acompanhar a exportação SVG.
        this.markerId = `rel-arrow-${++markerSeq}`;
        this.g.append('defs').append('marker').attr('id', this.markerId)
            .attr('viewBox', '0 0 10 10').attr('refX', 8).attr('refY', 5)
            .attr('markerWidth', 11).attr('markerHeight', 11).attr('markerUnits', 'userSpaceOnUse').attr('orient', 'auto')
            .append('path').attr('class', 'relation-arrow').attr('d', 'M0 0L10 5L0 10z');
        this.gLinks = this.g.append('g').attr('class', 'links');
        this.gRel = this.g.append('g').attr('class', 'relations');
        this.gNodes = this.g.append('g').attr('class', 'nodes');
        this.zoom = d3.zoom().scaleExtent([0.06, 3])
            .filter(ev => ev.type !== 'wheel' && !ev.button)   // a roda é tratada abaixo
            .on('zoom', ev => {
                this.g.attr('transform', ev.transform);
                if (ev.sourceEvent) this.userZoomed = true;
            });
        this.svg.call(this.zoom).on('dblclick.zoom', null);
        // Trackpad: dois dedos movem; pinça (chega como wheel+ctrlKey) aproxima.
        // Mouse: a roda tradicional (passos grandes, inteiros e só verticais) continua aproximando.
        this.svg.on('wheel.pan', ev => {
            ev.preventDefault();
            const node = this.svg.node();
            const t = d3.zoomTransform(node);
            const mouseNotch = Math.abs(ev.deltaY) >= 40 && ev.deltaX === 0 && Number.isInteger(ev.deltaY);
            if (ev.ctrlKey || ev.metaKey || mouseNotch) {
                const k = Math.pow(2, -ev.deltaY * (ev.ctrlKey || ev.metaKey ? 0.01 : 0.0025));
                this.svg.call(this.zoom.scaleBy, k, d3.pointer(ev, node));
            } else {
                this.svg.call(this.zoom.translateBy, -ev.deltaX / t.k, -ev.deltaY / t.k);
            }
            this.userZoomed = true;
        }, { passive: false });

        let timer, last = '';
        this.ro = new ResizeObserver(() => {
            const size = `${this.width()}x${this.height()}`;
            if (size === last) return;
            last = size;
            clearTimeout(timer);
            timer = setTimeout(() => { if (this.model.root && !this.userZoomed) this.fit(false); }, 150);
        });
        this.ro.observe(container);
    }

    width() { return this.container.clientWidth; }
    height() { return this.container.clientHeight; }
    setSelected(d) { this.selected = d; }
    setPalette(p) { this.palette = p; if (this.model.root) this.update(this.selected || this.model.root); }
    setTrailProvider(fn) { this.trailProvider = fn; }
    setHideLabels(b) { this.hideLabels = b; this.container.classList.toggle('hide-labels', b); }
    setShowRelations(b) { this.showRelations = b; if (this.model.root) this.drawRelations(); }
    reset() { this.gLinks.selectAll('*').remove(); this.gRel.selectAll('*').remove(); this.gNodes.selectAll('*').remove(); }
    destroy() {
        this.ro.disconnect();
        // Interrompe transições pendentes antes de remover: uma transição de zoom sobre um SVG
        // já desconectado tenta ler width="100%" e falha.
        this.svg.interrupt();
        this.g.selectAll('*').interrupt();
        this.svg.remove();
    }

    // ---------- cores ----------
    fillOf(d) {
        const m = this.model, p = this.palette, c = m.ramoOf(d).color;
        if (d.data.kind === 'center') return m.isCfCenter(d) ? p.centerFill : c;
        if (d.data.kind === 'ramo') return d === this.selected ? p.centerFill : c;
        if (d.data.planned) return p.bg;
        if (d === this.selected) return c;
        return d._children ? mix(c, 0.14, p.mixBase) : p.nodeFill;
    }
    strokeOf(d) {
        const m = this.model, p = this.palette, c = m.ramoOf(d).color;
        if (d.data.kind === 'center') return d === this.selected ? p.textStrong : m.isCfCenter(d) ? p.centerStroke : mix(c, 0.6, p.mixBase);
        if (d.data.kind === 'ramo') return d === this.selected ? p.textStrong : c;
        if (d.data.planned) return p.textFaint || '#94a3b8';
        return d === this.selected || d.data.kind === 'diploma' ? c : mix(c, 0.55, p.mixBase);
    }
    textOf(d) {
        const p = this.palette;
        if (d.data.kind === 'center' || d.data.kind === 'ramo' || d === this.selected) return p.onColor;
        if (d.data.planned) return p.textMuted;
        return p.text;
    }

    /** Legenda sob o rótulo do centro; quebra em duas linhas quando não cabe no círculo. */
    setCenterSub(textSel, d) {
        const m = this.model;
        const text = m.isCfCenter(d) ? (m.isGhost(d) ? 'Constituição anterior' : 'Constituição') : m.ramoOf(d).short;
        textSel.selectAll('tspan').remove();
        textSel.text(null);
        const words = text.length > 13 ? text.split(' ') : [text];
        // O deslocamento vai no primeiro tspan: um dy no tspan substitui o dy do <text> pai.
        // Com duas linhas o bloco sobe um pouco, para ficar centrado no círculo.
        const first = words.length > 1 ? '1.05em' : '1.2em';
        textSel.attr('dy', null);
        words.forEach((w, i) => textSel.append('tspan').attr('x', 0).attr('dy', i === 0 ? first : '1.15em').text(w));
    }

    // ---------- renderização ----------
    update(source) {
        const m = this.model, p = this.palette;
        const root = m.root;
        m.layout();
        const nodes = root.descendants();
        const links = root.links();
        const s0 = { x: source.x0, y: source.y0 };
        const [s0px, s0py] = source.y0 === 0 ? [0, 0] : d3.pointRadial(source.x0, source.y0);
        const radialLink = d3.linkRadial().angle(d => d.x).radius(d => d.y);

        // ligações
        // Junção por chave estável (não por id de instância): assim a linha do tempo e os filtros
        // movem os nós existentes em vez de recriá-los.
        const link = this.gLinks.selectAll('path.link').data(links, d => d.target.key);
        const linkEnter = link.enter().append('path')
            .attr('class', d => `link l${Math.min(d.target.depth, 3)}`)
            .style('--ramo', d => m.ramoOf(d.target).color)
            .attr('d', () => radialLink({ source: s0, target: s0 }));
        linkEnter.merge(link).transition().duration(DURATION)
            .attr('d', d => radialLink({ source: d.source, target: d.target }));
        link.exit().transition().duration(DURATION).attr('d', () => radialLink({ source, target: source })).remove();

        // nós
        const nodeClass = d => `node ${d.data.kind}${d.data.planned ? ' planned' : ''}${m.isProcessual(d) ? ' processual' : ''}${m.isGhost(d) ? ' ghost' : ''}`;
        const node = this.gNodes.selectAll('g.node').data(nodes, d => d.key);
        const enter = node.enter().append('g')
            .attr('class', nodeClass)
            .attr('transform', `translate(${s0px},${s0py})`)
            .attr('opacity', 0)
            .attr('tabindex', -1)
            .attr('data-key', d => d.key)
            .on('click', (ev, d) => this.onSelect(d));

        const self = this;
        enter.each(function (d) {
            const sel = d3.select(this);
            const w = m.boxWidth(d);
            const h = d.data.kind === 'ramo' ? 36 : d.data.kind === 'diploma' ? NODE_H : NODE_H - 2;
            if (d.data.kind === 'center') {
                sel.append('circle').attr('class', 'rel-ring').attr('r', 54).style('fill', 'none').style('stroke', p.relation).style('stroke-width', 3).style('display', 'none');
                sel.append('circle').attr('class', 'box').attr('r', 46).style('stroke-width', 4);
                sel.append('text').attr('class', 'label').attr('text-anchor', 'middle').attr('dy', '-0.1em').text(m.labelOf(d)).style('font-size', '15px').style('font-weight', 700);
                const sub = sel.append('text').attr('class', 'sub').attr('text-anchor', 'middle').attr('dy', '1.2em')
                    .style('fill', 'rgba(255,255,255,.75)').style('font-size', '9px').style('letter-spacing', '.08em');
                self.setCenterSub(sub, d);
                sel.append('title').text(m.titleOf(d));
            } else {
                sel.append('rect').attr('class', 'rel-ring').attr('x', -w / 2 - 5).attr('y', -h / 2 - 5).attr('width', w + 10).attr('height', h + 10).attr('rx', d.data.kind === 'ramo' ? 23 : 10)
                    .style('fill', 'none').style('stroke', p.relation).style('stroke-width', 2.5).style('display', 'none');
                sel.append('rect').attr('class', 'box').attr('x', -w / 2).attr('y', -h / 2).attr('width', w).attr('height', h).attr('rx', d.data.kind === 'ramo' ? 18 : 6);
                sel.append('text').attr('class', 'label').attr('text-anchor', 'middle').attr('dy', '0.35em').text(m.labelOf(d))
                    .style('font-size', d.data.kind === 'ramo' ? '12px' : d.data.kind === 'diploma' ? '11px' : '10.5px').style('font-weight', 600);
                sel.append('title').text(m.titleOf(d));
            }
            // marca da trilha (canto superior esquerdo)
            sel.append('circle').attr('class', 'trail-mark').attr('r', 4.5)
                .attr('cx', d.data.kind === 'center' ? -34 : -w / 2 + 1).attr('cy', d.data.kind === 'center' ? -34 : -h / 2 + 1)
                .style('stroke', p.surface).style('stroke-width', 1.5).style('display', 'none');
            // badge com a quantidade de divisões recolhidas (canto superior direito)
            const badge = sel.append('g').attr('class', 'badge').attr('transform', `translate(${d.data.kind === 'center' ? 34 : w / 2 - 2},${d.data.kind === 'center' ? -34 : -h / 2 + 1})`);
            badge.append('circle').attr('r', 8).style('stroke-width', 1.5);
            badge.append('text').attr('text-anchor', 'middle').attr('dy', '0.35em').style('font-size', '9px').style('font-weight', 700);
            void self;
        });

        const merged = enter.merge(node);
        // Rótulo, largura e classe podem mudar para a mesma chave (ex.: CC/1916 → CC na linha do tempo).
        merged.attr('class', nodeClass).each(function (d) {
            const sel = d3.select(this);
            sel.select('text.label').text(m.labelOf(d));
            sel.select('title').text(m.titleOf(d));
            if (d.data.kind !== 'center') {
                const w = m.boxWidth(d), h = d.data.kind === 'ramo' ? 36 : d.data.kind === 'diploma' ? NODE_H : NODE_H - 2;
                sel.select('rect.box').attr('x', -w / 2).attr('width', w);
                sel.select('rect.rel-ring').attr('x', -w / 2 - 5).attr('width', w + 10);
                sel.select('.badge').attr('transform', `translate(${w / 2 - 2},${-h / 2 + 1})`);
                sel.select('.trail-mark').attr('cx', -w / 2 + 1);
            } else {
                self.setCenterSub(sel.select('text.sub'), d);
            }
        });
        merged.transition().duration(DURATION).attr('opacity', 1).attr('transform', d => `translate(${d.px},${d.py})`);
        merged.select('.box').transition().duration(DURATION)
            .style('fill', d => this.fillOf(d))
            .style('stroke', d => this.strokeOf(d))
            .style('stroke-width', d => d.data.kind === 'center' ? 4 : d === this.selected ? 2.5 : d.data.kind === 'ramo' ? 1 : 1.5);
        merged.select('text.label').transition().duration(DURATION).style('fill', d => this.textOf(d));
        merged.select('.badge').style('display', d => d._children ? null : 'none');
        merged.select('.badge circle').style('fill', p.badge).style('stroke', p.surface);
        merged.select('.badge text').style('fill', p.badgeText).text(d => d._children ? d._children.length : '');
        merged.select('.trail-mark').each(function (d) {
            const mark = self.trailProvider(d.key);
            d3.select(this).style('display', mark ? null : 'none').style('fill', mark === 'studied' ? p.studied : p.review).style('stroke', p.surface);
        });
        merged.select('.rel-ring').style('stroke', p.relation);

        const exit = node.exit().transition().duration(DURATION).attr('opacity', 0)
            .attr('transform', `translate(${source.px},${source.py})`).remove();
        void exit;

        nodes.forEach(d => { d.x0 = d.x; d.y0 = d.y; });
        this.drawRelations();
    }

    /** Distância do centro do nó até a borda, na direção (ux, uy), com folga para o anel de relação. */
    borderOffset(d, ux, uy, pad = 0) {
        if (d.data.kind === 'center') return 46 + pad;
        const w = this.model.boxWidth(d) / 2 + pad;
        const h = (d.data.kind === 'ramo' ? 36 : d.data.kind === 'diploma' ? NODE_H : NODE_H - 2) / 2 + pad;
        return Math.min(w / Math.max(Math.abs(ux), 1e-6), h / Math.max(Math.abs(uy), 1e-6));
    }

    /** Arco dirigido de `a` para `b`, puxado para o centro, aparado nas bordas dos dois nós. */
    relationGeometry(a, b) {
        const cx = (a.px + b.px) / 2 * 0.35, cy = (a.py + b.py) / 2 * 0.35;
        let ux = cx - a.px, uy = cy - a.py, l = Math.hypot(ux, uy) || 1; ux /= l; uy /= l;
        const so = this.borderOffset(a, ux, uy, 2);
        const sx = a.px + ux * so, sy = a.py + uy * so;
        let vx = b.px - cx, vy = b.py - cy, k = Math.hypot(vx, vy) || 1; vx /= k; vy /= k;
        const eo = this.borderOffset(b, vx, vy, 7);
        const ex = b.px - vx * eo, ey = b.py - vy * eo;
        return { d: `M ${sx} ${sy} Q ${cx} ${cy} ${ex} ${ey}`, mx: 0.25 * sx + 0.5 * cx + 0.25 * ex, my: 0.25 * sy + 0.5 * cy + 0.25 * ey };
    }

    /**
     * Arcos das relações internormativas do nó selecionado até o representante visível do outro nó.
     * O arco vai da origem ao destino da relação, com seta no destino.
     */
    drawRelations() {
        const m = this.model, p = this.palette, sel = this.selected;
        this.gNodes.selectAll('.rel-ring').style('display', 'none');
        this.g.select('.relation-arrow').attr('fill', p.relation);
        const items = sel && this.showRelations ? m.relationsFor(sel, { includeDescendants: sel.data.kind !== 'division' }).filter(r => r.other) : [];
        const data = items.map(r => {
            const rep = m.visibleRep(r.other);
            const [a, b] = r.direction === 'out' ? [sel, rep] : [rep, sel];
            return { ...r, rep, geo: this.relationGeometry(a, b) };
        }).filter(r => r.rep !== sel);
        const keyOf = r => `${r.rel.from}|${r.rel.to}|${r.rel.type}`;
        const cls = r => `relation ${r.direction}${r.rep === r.other ? ' resolved' : ''}`;
        const rel = this.gRel.selectAll('path.relation').data(data, keyOf);
        rel.enter().append('path').attr('opacity', 0)
            .merge(rel).attr('class', cls).attr('marker-end', `url(#${this.markerId})`)
            .transition().duration(DURATION).attr('opacity', 1).attr('d', r => r.geo.d);
        rel.exit().transition().duration(200).attr('opacity', 0).remove();

        const lab = this.gRel.selectAll('text.relation-label').data(data, keyOf);
        lab.enter().append('text').attr('class', 'relation-label').attr('text-anchor', 'middle').attr('opacity', 0)
            .merge(lab)
            .text(r => (m.data.relationTypes[r.rel.type] || {}).label || r.rel.type)
            .transition().duration(DURATION).attr('opacity', 1)
            .attr('x', r => r.geo.mx)
            .attr('y', r => r.geo.my - 4);
        lab.exit().remove();

        const reps = new Set(data.map(r => r.rep.key));
        this.gNodes.selectAll('g.node').filter(d => reps.has(d.key)).select('.rel-ring').style('display', null).style('stroke', p.relation);
    }

    // ---------- câmera ----------
    fit(animate = true) {
        if (!this.svg.node().isConnected || this.width() < 10 || this.height() < 10) return;
        const b = this.model.visibleBounds();
        const bw = b.x1 - b.x0, bh = b.y1 - b.y0;
        const k = Math.max(0.06, Math.min(1.15, (this.width() - 24) / bw, (this.height() - 24) / bh));
        const t = d3.zoomIdentity.translate(this.width() / 2 - k * (b.x0 + b.x1) / 2, this.height() / 2 - k * (b.y0 + b.y1) / 2).scale(k);
        (animate ? this.svg.transition().duration(DURATION + 150) : this.svg).call(this.zoom.transform, t);
        this.userZoomed = false;
    }
    reveal(d) {
        const t = d3.zoomTransform(this.svg.node());
        const [sx, sy] = t.apply([d.px, d.py]);
        const mg = 60;
        if (sx > mg && sx < this.width() - mg && sy > mg && sy < this.height() - mg) return;
        const k = Math.max(t.k, 0.6);
        this.svg.transition().duration(DURATION + 150).call(this.zoom.transform, d3.zoomIdentity.translate(this.width() / 2 - d.px * k, this.height() / 2 - d.py * k).scale(k));
    }
    centerOn(d) {
        const k = Math.max(d3.zoomTransform(this.svg.node()).k, 0.8);
        this.svg.transition().duration(DURATION).call(this.zoom.transform, d3.zoomIdentity.translate(this.width() / 2 - d.px * k, this.height() / 2 - d.py * k).scale(k));
    }
    zoomBy(f) { this.svg.transition().duration(250).call(this.zoom.scaleBy, f); }
    focusNode(d) { const el = this.gNodes.selectAll('g.node').filter(x => x === d).node(); if (el) el.focus({ preventScroll: true }); }

    /** Elementos para exportação vetorial. */
    snapshot() { return { svg: this.svg.node(), g: this.g.node(), bounds: this.model.visibleBounds(), transform: d3.zoomTransform(this.svg.node()) }; }
}
