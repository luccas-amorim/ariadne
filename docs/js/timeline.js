// Vista Linha do tempo: uma faixa por diploma (antecessores pontilhados, diploma vigente na cor do
// ramo, marcos estruturais como pontos), uma janela A → B arrastável pelas bordas, o diff
// estrutural entre os dois anos e a genealogia do diploma escolhido.
//   #/tempo?a=2016&b=2026&g=cpc
import { esc, diffStructure } from './data.js';
import { mix } from './features.js';

export class TimelineView {
    /**
     * @param {object} o
     * @param {object} o.data
     * @param {object} o.els      lanes, aside, a, b, play
     * @param {(hash: string) => void} o.navigate
     * @param {(year: number) => void} o.onPlay   reproduzir na árvore a partir de A
     * @param {object} o.palette
     */
    constructor({ data, els, navigate, onPlay, palette }) {
        Object.assign(this, { data, els, navigate, onPlay, palette });
        this.now = new Date().getFullYear();
        const starts = Object.values(data.diplomas).flatMap(d => [d.year, ...(d.predecessors || []).map(p => p.from)]).filter(Boolean);
        this.y0 = Math.min(...starts);
        this.y1 = this.now;
        this.state = null;
        this.bind();
    }

    // ---------- URL ----------
    parse(view, query) {
        const year = k => (/^\d{4}$/.test(query.get(k) || '') ? Math.min(this.y1, Math.max(this.y0, +query.get(k))) : null);
        let b = year('b') ?? this.now, a = year('a') ?? b - 10;
        if (a > b) [a, b] = [b, a];
        const g = query.get('g');
        const withPreds = this.order().filter(id => (this.data.diplomas[id].predecessors || []).length);
        return {
            a, b, diplomas: view.diplomas,
            g: g && this.data.diplomas[g] ? g : (withPreds.includes('cpc') ? 'cpc' : withPreds[0] || null)
        };
    }
    hashFor(over = {}) {
        const s = { ...this.state, ...over };
        const p = [`a=${s.a}`, `b=${s.b}`];
        if (s.g) p.push(`g=${s.g}`);
        if (s.diplomas.size !== this.data.catalog.diplomas.length) p.unshift(`d=${[...s.diplomas].join(',')}`);
        return '#/tempo?' + p.join('&');
    }

    // ---------- ciclo ----------
    apply(view, query) {
        this.state = this.parse(view, query);
        this.els.a.value = String(this.state.a);
        this.els.b.value = String(this.state.b);
        this.els.a.min = this.els.b.min = String(this.y0);
        this.els.a.max = this.els.b.max = String(this.y1);
        this.render();
    }
    destroy() { this.state = null; this.els.lanes.innerHTML = ''; this.els.aside.innerHTML = ''; }
    setPalette(p) { this.palette = p; if (this.state) this.render(); }
    fit() { /* layout fluido: nada a enquadrar */ }
    clearSelection() { /* sem seleção nesta vista */ }

    bind() {
        const e = this.els;
        const commit = () => {
            let a = +e.a.value, b = +e.b.value;
            if (!a || !b) return;
            a = Math.min(this.y1, Math.max(this.y0, a)); b = Math.min(this.y1, Math.max(this.y0, b));
            if (a > b) [a, b] = [b, a];
            this.navigate(this.hashFor({ a, b }));
        };
        e.a.addEventListener('change', commit);
        e.b.addEventListener('change', commit);
        e.play.addEventListener('click', () => this.onPlay(this.state.a));
        e.lanes.addEventListener('click', ev => {
            const label = ev.target.closest('[data-g]');
            if (label) { this.navigate(this.hashFor({ g: label.dataset.g })); return; }
            const track = ev.target.closest('.tl-track[data-doc]');
            if (track && !ev.target.closest('.tl-handle')) {
                const id = track.dataset.doc;
                // a árvore daquele diploma, em foco, no ano A (o foco obedece ao ano)
                this.navigate(`#/${id}?foco=${id}&ano=${this.state.a}`);
            }
        });
        // janela A → B arrastável pelas bordas, e ajustável pelo teclado
        e.lanes.addEventListener('pointerdown', ev => {
            const h = ev.target.closest('.tl-handle');
            if (!h) return;
            ev.preventDefault();
            const which = h.dataset.edge, overlay = e.lanes.querySelector('.tl-overlay');
            const rect = overlay.getBoundingClientRect();
            const yearAt = x => Math.round(this.y0 + Math.min(1, Math.max(0, (x - rect.left) / rect.width)) * (this.y1 - this.y0));
            h.setPointerCapture(ev.pointerId);
            const move = mv => {
                const y = yearAt(mv.clientX);
                const s = this.state;
                if (which === 'a') s.a = Math.min(y, s.b); else s.b = Math.max(y, s.a);
                this.placeWindow();
            };
            const up = () => {
                h.removeEventListener('pointermove', move);
                h.removeEventListener('pointerup', up);
                this.navigate(this.hashFor());
            };
            h.addEventListener('pointermove', move);
            h.addEventListener('pointerup', up);
        });
        e.lanes.addEventListener('keydown', ev => {
            const h = ev.target.closest('.tl-handle');
            if (!h || !['ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown'].includes(ev.key)) return;
            ev.preventDefault(); ev.stopPropagation();
            const step = (ev.key === 'ArrowLeft' || ev.key === 'PageDown' ? -1 : 1) * (ev.key.startsWith('Page') ? 10 : 1);
            const s = this.state;
            if (h.dataset.edge === 'a') s.a = Math.min(s.b, Math.max(this.y0, s.a + step));
            else s.b = Math.max(s.a, Math.min(this.y1, s.b + step));
            this.navigate(this.hashFor());
        });
    }

    // ---------- desenho ----------
    x(year) { return (year - this.y0) / (this.y1 - this.y0) * 100; }

    /** Diplomas na ordem dos ramos, como no radial e na matriz. */
    order() {
        const c = this.data.catalog, vis = this.state ? this.state.diplomas : new Set(c.diplomas);
        const out = vis.has(c.root) ? [c.root] : [];
        c.ramos.forEach(r => c.diplomas.forEach(id => { if (id !== c.root && vis.has(id) && this.data.diplomas[id].ramo === r.id) out.push(id); }));
        return out;
    }

    /** Marcos estruturais de um diploma, agrupados por ano. */
    marks(doc) {
        const byYear = new Map();
        (function walk(n, path) {
            (n.history || []).forEach(h => {
                const where = path.length ? `${n.label}: ` : '';
                if (!byYear.has(h.year)) byYear.set(h.year, []);
                byYear.get(h.year).push(`${where}${h.note} (${h.norm})`);
            });
            (n.children || []).forEach(c => walk(c, [...path, c.id]));
        })(doc.root, []);
        return [...byYear.entries()].sort((a, b) => a[0] - b[0]);
    }

    placeWindow() {
        const s = this.state, w = this.els.lanes.querySelector('.tl-window');
        if (!w) return;
        w.style.left = `${this.x(s.a)}%`;
        w.style.width = `${Math.max(0, this.x(s.b) - this.x(s.a))}%`;
        w.querySelector('[data-edge="a"]').setAttribute('aria-valuenow', s.a);
        w.querySelector('[data-edge="a"] .tl-handle-label').textContent = `A · ${s.a}`;
        w.querySelector('[data-edge="b"]').setAttribute('aria-valuenow', s.b);
        w.querySelector('[data-edge="b"] .tl-handle-label').textContent = `B · ${s.b}`;
    }

    render() {
        const s = this.state, data = this.data, p = this.palette;
        const ticks = [this.y0, 1850, 1900, 1950, 1988, this.y1].filter((y, i, arr) => y >= this.y0 && y <= this.y1 && (i === 0 || y - arr[i - 1] > 12 || i === arr.length - 1));
        const lanes = this.order().map(id => {
            const doc = data.diplomas[id], ramo = data.ramos[doc.ramo];
            // o azul-marinho do ramo constitucional some no tema escuro
            const dark = p.name === 'dark' && ramo.color.toLowerCase() === '#0f172a';
            const color = dark ? p.centerStroke : ramo.color;
            const segs = (doc.predecessors || []).map(pr => ({ from: pr.from, to: pr.to, text: pr.shortTitle, title: `${pr.title} (${pr.norm}), ${pr.from}–${pr.to}`, ghost: true }));
            if (doc.year) segs.push({ from: doc.year, to: this.y1, text: doc.shortTitle, title: `${doc.title} (${doc.norm}), desde ${doc.year}`, ghost: false });
            const segHtml = segs.map(sg => `<div class="tl-seg${sg.ghost ? ' ghost' : ''}" title="${esc(sg.title)}" style="left:${this.x(sg.from)}%;width:max(4px, calc(${this.x(sg.to) - this.x(sg.from)}% - 2px));${sg.ghost ? '' : `background:${color};border-color:${color}${dark ? ';color:#0f172a' : ''}`}">${esc(sg.text)}</div>`).join('');
            const markHtml = this.marks(doc).map(([y, notes]) => `<div class="tl-mark" style="left:${this.x(y)}%" title="${esc(`${y} · ${notes.join(' · ')}`)}"></div>`).join('');
            return `<div class="tl-lane">
                <button type="button" class="tl-lane-label${s.g === id ? ' on' : ''}" data-g="${id}" title="Ver a genealogia de ${esc(doc.shortTitle)}"><span class="tl-dot" style="background:${color}"></span>${esc(doc.shortTitle)}</button>
                <div class="tl-track" data-doc="${id}" title="Abrir a árvore de ${esc(doc.shortTitle)} em ${s.a}">${segHtml}${markHtml}</div>
            </div>`;
        }).join('');
        this.els.lanes.innerHTML = `
            <div class="tl-ticks">${ticks.map(y => `<span style="left:${this.x(y)}%">${y === this.y1 ? 'hoje' : y}</span>`).join('')}</div>
            <div class="tl-body">
                <div class="tl-overlay">
                    <div class="tl-window">
                        <div class="tl-handle" data-edge="a" role="slider" tabindex="0" aria-label="Ano A" aria-valuemin="${this.y0}" aria-valuemax="${this.y1}"><span class="tl-handle-label"></span></div>
                        <div class="tl-handle" data-edge="b" role="slider" tabindex="0" aria-label="Ano B" aria-valuemin="${this.y0}" aria-valuemax="${this.y1}"><span class="tl-handle-label"></span></div>
                    </div>
                </div>
                ${lanes}
            </div>`;
        this.placeWindow();
        this.renderAside(p);
    }

    renderAside(p) {
        const s = this.state, data = this.data;
        const d = diffStructure(data, s.a, s.b);
        const vis = new Set(this.order());
        const keep = it => vis.has(it.key.split('/')[0].replace(/-\d{4}$/, ''));
        const link = it => `#/${it.linkKey}?ano=${it.linkYear}`;
        const row = (sym, cls, it) => `<a class="diff-item" href="${link(it)}">
                <b class="diff-sym ${cls}">${sym}</b>
                <span><b class="strong">${esc(it.label)}</b>${it.name && it.kind !== 'antecessor' ? ` <span class="muted">· ${esc(it.name.replace(/^.*? - /, ''))}</span>` : ''}
                <span class="diff-meta">${it.year}${it.norm ? ` · ${esc(it.norm)}` : ''}${it.note ? ` · ${esc(it.note)}` : ''}</span></span>
            </a>`;
        const group = (title, sym, cls, list) => `<div class="diff-group" data-group="${cls}">
                <div class="g-head">${title} · ${list.length}</div>
                ${list.length ? list.map(it => row(sym, cls, it)).join('') : '<p class="muted text-sm">Nada no período.</p>'}
            </div>`;
        const added = d.added.filter(keep), changed = d.changed.filter(keep), removed = d.removed.filter(keep);

        let gen = '';
        if (s.g) {
            const doc = data.diplomas[s.g], ramo = data.ramos[doc.ramo];
            const chain = [...(doc.predecessors || []).map(pr => `<span class="gen-chip ghost" title="${esc(pr.title)} (${pr.from}–${pr.to})">${esc(pr.shortTitle)}</span>`),
                `<span class="gen-chip${doc.natureza === 'processual' ? ' dashed' : ''}" style="border-color:${ramo.color};background:${mix(ramo.color, 0.14, p.mixBase)}" title="${esc(doc.title)} (${doc.year})">${esc(doc.shortTitle)}${doc.year ? `/${doc.year}` : ''}</span>`];
            gen = `<div class="g-section gen">
                <div class="g-head">Genealogia · ${esc(doc.shortTitle)}</div>
                <div class="gen-chain">${chain.join('<span class="gen-arrow" aria-hidden="true">→</span>')}</div>
                <p class="g-caption">${(doc.predecessors || []).length ? 'Cada diploma <code>sucede</code> o anterior. Clique no nome de outra faixa para ver a genealogia dela.' : 'Sem antecessor registrado. Clique no nome de outra faixa para ver a genealogia dela.'}</p>
            </div>`;
        }
        this.els.aside.innerHTML = `
            <div class="g-section">
                <div class="g-head" style="color:var(--relation)">Diff estrutural</div>
                <h2 class="g-title">${s.a} → ${s.b}</h2>
                <div class="diff-legend"><span class="add">+ divisões</span><span class="chg">~ marcos</span><span class="rem">− revogadas ou substituídas</span></div>
            </div>
            ${group('Incluídas', '+', 'add', added)}
            ${group('Alteradas', '~', 'chg', changed)}
            ${group('Revogadas ou substituídas', '−', 'rem', removed)}
            ${gen}`;
    }
}
