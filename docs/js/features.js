// Recursos transversais: trilha pessoal (localStorage), tema, exportação e lista acessível.
import { esc } from './data.js';

// ---------- Trilha pessoal ----------
const TRAIL_KEY = 'lex-tree:trail:v1';

export class Trail {
    constructor() {
        this.marks = {};
        try { this.marks = JSON.parse(localStorage.getItem(TRAIL_KEY) || '{}') || {}; } catch { this.marks = {}; }
        this.listeners = new Set();
    }
    onChange(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn); }
    get(key) { return this.marks[key] || null; }
    set(key, value) {
        if (value) this.marks[key] = value; else delete this.marks[key];
        this.persist();
    }
    toggle(key, value) { this.set(key, this.get(key) === value ? null : value); }
    clear() { this.marks = {}; this.persist(); }
    persist() {
        try { localStorage.setItem(TRAIL_KEY, JSON.stringify(this.marks)); } catch { /* armazenamento indisponível */ }
        this.listeners.forEach(fn => fn(this));
    }
    /** Contagem por tipo entre um conjunto de chaves. */
    counts(keys) {
        let studied = 0, review = 0;
        for (const k of keys) { const v = this.marks[k]; if (v === 'studied') studied++; else if (v === 'review') review++; }
        return { studied, review, total: keys.length };
    }
    exportJson() { return JSON.stringify({ exported: new Date().toISOString(), marks: this.marks }, null, 2); }
    importJson(text) {
        const parsed = JSON.parse(text);
        const marks = parsed && parsed.marks ? parsed.marks : parsed;
        if (!marks || typeof marks !== 'object') throw new Error('formato inválido');
        this.marks = { ...this.marks, ...marks };
        this.persist();
    }
}

// ---------- Tema ----------
const THEME_KEY = 'lex-tree:theme';

export const PALETTES = {
    light: {
        name: 'light', bg: '#f8fafc', surface: '#ffffff', text: '#334155', textStrong: '#0f172a', textMuted: '#64748b',
        nodeFill: '#ffffff', nodeStroke: '#94a3b8', link: '#cbd5e1', badge: '#334155', badgeText: '#ffffff',
        centerFill: '#0f172a', centerStroke: '#334155', onColor: '#ffffff', relation: '#7c3aed', studied: '#16a34a', review: '#f59e0b',
        mixBase: '#ffffff', scene: 0xf8fafc
    },
    dark: {
        name: 'dark', bg: '#0b1220', surface: '#111827', text: '#e2e8f0', textStrong: '#f8fafc', textMuted: '#94a3b8',
        nodeFill: '#1e293b', nodeStroke: '#475569', link: '#334155', badge: '#e2e8f0', badgeText: '#0f172a',
        centerFill: '#1e293b', centerStroke: '#94a3b8', onColor: '#ffffff', relation: '#a78bfa', studied: '#4ade80', review: '#fbbf24',
        mixBase: '#1e293b', scene: 0x0b1220
    }
};

export const Theme = {
    listeners: new Set(),
    get() {
        try { const t = localStorage.getItem(THEME_KEY); if (t === 'light' || t === 'dark') return t; } catch { /* ignore */ }
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    },
    palette() { return PALETTES[this.get()]; },
    set(t) {
        try { localStorage.setItem(THEME_KEY, t); } catch { /* ignore */ }
        this.apply();
    },
    toggle() { this.set(this.get() === 'dark' ? 'light' : 'dark'); },
    apply() {
        const t = this.get();
        document.documentElement.setAttribute('data-theme', t);
        this.listeners.forEach(fn => fn(PALETTES[t]));
    },
    onChange(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn); }
};

/** Mistura uma cor hex com uma base (t = proporção da cor). */
export function mix(hex, t, base = '#ffffff') {
    const p = h => { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
    const [r1, g1, b1] = p(hex), [r2, g2, b2] = p(base);
    const f = (a, b) => Math.round(b + (a - b) * t);
    return `rgb(${f(r1, r2)},${f(g1, g2)},${f(b1, b2)})`;
}

// ---------- Tela cheia ----------
// Fullscreen API quando existe e é aceita; senão (iframes, iOS, recusa) a classe
// .pseudo-fullscreen fixa o elemento sobre a página. Esc sai das duas.
const fsListeners = new Set();
const fsEmit = () => fsListeners.forEach(fn => fn(Fullscreen.current()));

export const Fullscreen = {
    current() { return document.fullscreenElement || document.querySelector('.pseudo-fullscreen'); },
    isPseudo() { return !document.fullscreenElement && !!document.querySelector('.pseudo-fullscreen'); },
    async enter(el) {
        try {
            if (!el.requestFullscreen) throw new Error('Fullscreen API indisponível');
            await el.requestFullscreen();
        } catch {
            el.classList.add('pseudo-fullscreen');
            fsEmit();
        }
    },
    exit() {
        if (document.fullscreenElement) { document.exitFullscreen().catch(() => {}); return; }
        const p = document.querySelector('.pseudo-fullscreen');
        if (p) { p.classList.remove('pseudo-fullscreen'); fsEmit(); }
    },
    toggle(el) { if (this.current()) this.exit(); else this.enter(el); },
    onChange(fn) { fsListeners.add(fn); return () => fsListeners.delete(fn); }
};
document.addEventListener('fullscreenchange', fsEmit);

// ---------- Exportação ----------
function download(href, filename) {
    const a = document.createElement('a');
    a.href = href; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
}

/**
 * Serializa o SVG do renderizador 2D com estilos inline, fundo, título e rodapé de licença.
 * Retorna a string SVG.
 */
export function svgSnapshot(svgEl, gEl, { title, subtitle, palette, bounds, transform }) {
    const pad = 48, footer = 44, header = title ? 64 : 0;
    const bw = bounds.x1 - bounds.x0, bh = bounds.y1 - bounds.y0;
    const W = Math.ceil(bw + pad * 2), H = Math.ceil(bh + pad * 2 + header + footer);
    const clone = gEl.cloneNode(true);
    // Estilos dependentes de CSS → atributos explícitos, para que o arquivo seja autossuficiente.
    const srcPaths = gEl.querySelectorAll('path.link, path.relation');
    clone.querySelectorAll('path.link, path.relation').forEach((p, i) => {
        const cs = getComputedStyle(srcPaths[i]);
        p.setAttribute('fill', 'none');
        p.setAttribute('stroke', cs.stroke);
        p.setAttribute('stroke-opacity', cs.strokeOpacity);
        p.setAttribute('stroke-width', cs.strokeWidth);
        if (cs.strokeDasharray && cs.strokeDasharray !== 'none') p.setAttribute('stroke-dasharray', cs.strokeDasharray);
    });
    const srcNodes = gEl.querySelectorAll('g.node');
    clone.querySelectorAll('g.node').forEach((n, i) => {
        const src = srcNodes[i];
        n.querySelectorAll('rect.box, circle.box').forEach((box, j) => {
            const cs = getComputedStyle(src.querySelectorAll('rect.box, circle.box')[j]);
            if (cs.strokeDasharray && cs.strokeDasharray !== 'none') box.setAttribute('stroke-dasharray', cs.strokeDasharray);
        });
        n.querySelectorAll('text').forEach(t => { t.setAttribute('font-family', 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif'); });
        n.removeAttribute('class');
    });
    clone.setAttribute('transform', `translate(${pad - bounds.x0},${pad + header - bounds.y0})`);
    void transform;
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('xmlns', ns);
    svg.setAttribute('width', W); svg.setAttribute('height', H);
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.innerHTML = `<rect width="100%" height="100%" fill="${palette.bg}"/>` +
        (title ? `<text x="${pad}" y="${pad - 10}" font-family="ui-sans-serif, system-ui, sans-serif" font-size="20" font-weight="700" fill="${palette.textStrong}">${esc(title)}</text>` +
            `<text x="${pad}" y="${pad + 14}" font-family="ui-sans-serif, system-ui, sans-serif" font-size="12" fill="${palette.textMuted}">${esc(subtitle || '')}</text>` : '') +
        `<text x="${pad}" y="${H - 16}" font-family="ui-sans-serif, system-ui, sans-serif" font-size="11" fill="${palette.textMuted}">Ariadne · luccas-amorim.github.io/ariadne · código MIT · conteúdo CC BY 4.0</text>`;
    svg.appendChild(clone);
    return new XMLSerializer().serializeToString(svg);
}

export function downloadSvg(svgString, filename) {
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    download(url, filename);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function downloadPngFromSvg(svgString, filename, scale = 2) {
    return new Promise((resolve, reject) => {
        const m = svgString.match(/width="(\d+)" height="(\d+)"/);
        const w = m ? +m[1] : 1600, h = m ? +m[2] : 1200;
        const img = new Image();
        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = w * scale; canvas.height = h * scale;
            const ctx = canvas.getContext('2d');
            ctx.scale(scale, scale);
            ctx.drawImage(img, 0, 0);
            URL.revokeObjectURL(url);
            download(canvas.toDataURL('image/png'), filename);
            resolve();
        };
        img.onerror = e => { URL.revokeObjectURL(url); reject(e); };
        img.src = url;
    });
}

export function downloadDataUrl(dataUrl, filename) { download(dataUrl, filename); }

export function downloadText(text, filename, type = 'application/json') {
    const blob = new Blob([text], { type });
    const url = URL.createObjectURL(blob);
    download(url, filename);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
}

// ---------- Lista acessível (estrutura textual da árvore atual) ----------
export function renderOutline(container, model, { selected, trail } = {}) {
    const mark = d => {
        const m = trail ? trail.get(d.key) : null;
        return m === 'studied' ? '<span class="trail-dot studied" title="Estudado"></span>' : m === 'review' ? '<span class="trail-dot review" title="Revisar"></span>' : '';
    };
    const item = d => {
        const kids = model.kidsOf(d);
        const cur = d === selected ? ' aria-current="true" class="current"' : '';
        const label = model.labelOf(d), name = model.nameOf(d);
        const extra = d.data.kind === 'division' ? ` <span class="muted">${esc(d.data.node.subtitle)}</span>` : d.data.kind === 'diploma' && d.data.planned ? ' <span class="muted">(em mapeamento)</span>' : '';
        return `<li role="treeitem"${kids.length ? ' aria-expanded="true"' : ''}>
            <a href="${model.hashForNode(d)}"${cur}>${mark(d)}<strong>${esc(label)}</strong>${label !== name ? ` <span>${esc(name)}</span>` : ''}${extra}</a>
            ${kids.length ? `<ul role="group">${kids.map(item).join('')}</ul>` : ''}
        </li>`;
    };
    container.innerHTML = `<ul role="tree" aria-label="Estrutura da árvore">${item(model.root)}</ul>`;
}
