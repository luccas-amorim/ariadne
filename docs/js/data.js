// Carga dos dados, índice de busca e utilitários de texto.
// Tudo roda no navegador, sem build: os JSON são lidos de docs/data/.

export const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const norm = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
export const sleep = ms => new Promise(r => setTimeout(r, ms));

async function fetchJson(path) {
    const r = await fetch(path, { cache: 'no-cache' });
    if (!r.ok) throw new Error(`${path}: HTTP ${r.status}`);
    return r.json();
}

/** Carrega catálogo, diplomas, relações e glossário. */
export async function loadAll(base = 'data/') {
    const catalog = await fetchJson(`${base}index.json`);
    const [docs, relations, glossary] = await Promise.all([
        Promise.all(catalog.diplomas.map(id => fetchJson(`${base}${id}.json`))),
        fetchJson(`${base}relations.json`).catch(() => ({ relations: [] })),
        fetchJson(`${base}glossary.json`).catch(() => ({ terms: [] }))
    ]);
    const diplomas = {}, ramos = {};
    docs.forEach(d => { diplomas[d.id] = d; });
    catalog.ramos.forEach(r => { ramos[r.id] = r; });
    return {
        catalog, diplomas, ramos,
        relations: relations.relations || [],
        relationTypes: catalog.relationTypes || {},
        glossary: glossary.terms || []
    };
}

/** Índice plano de todos os nós de todos os diplomas, para busca e modo estudo. */
export function buildSearchIndex(data) {
    const idx = [];
    Object.values(data.diplomas).forEach(doc => {
        (function walk(n, path) {
            idx.push({ diploma: doc, path, node: n, key: [doc.id, ...path].join('/'), hay: norm(`${n.name} ${n.label} ${n.subtitle} ${n.content}`) });
            (n.children || []).forEach(c => walk(c, [...path, c.id]));
        })(doc.root, []);
    });
    return idx;
}

export function search(index, q, limit = 12) {
    const terms = norm(q).split(/\s+/).filter(t => t.length > 1);
    if (!terms.length) return [];
    return index
        .map(e => {
            let score = 0;
            for (const t of terms) {
                if (!e.hay.includes(t)) return null;
                score += norm(e.node.name).includes(t) ? 3 : norm(e.node.subtitle).includes(t) ? 2 : 1;
            }
            return { e, score: score - e.path.length * 0.1 };
        })
        .filter(Boolean).sort((a, b) => b.score - a.score).slice(0, limit).map(r => r.e);
}

/**
 * Destaca a primeira ocorrência de cada termo do glossário em um texto já escapado,
 * envolvendo-a em <abbr class="gloss" title="definição">. Ignora acentos e caixa.
 */
export function glossaryHighlight(escapedText, glossary) {
    if (!glossary.length) return escapedText;
    // Mapa de texto normalizado → posições no texto original (normalização preserva o comprimento
    // porque só remove marcas combinantes depois do NFD; usamos um índice posicional).
    const original = escapedText;
    const nfd = original.normalize('NFD');
    const map = []; // índice no texto normalizado-sem-acentos → índice no original
    let out = '';
    let origIdx = 0;
    // Reconstrói o texto sem diacríticos acompanhando a posição original.
    for (const ch of original) {
        const parts = ch.normalize('NFD');
        const base = parts.replace(/[̀-ͯ]/g, '').toLowerCase();
        for (let i = 0; i < base.length; i++) map.push(origIdx);
        out += base;
        origIdx += ch.length;
    }
    map.push(original.length);
    void nfd;

    const spans = [];
    const used = new Set();
    for (const t of glossary) {
        const variants = [t.term, ...(t.aliases || [])].map(norm).filter(Boolean).sort((a, b) => b.length - a.length);
        for (const v of variants) {
            const re = new RegExp(`(?<![\\p{L}\\p{N}])${v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\p{L}\\p{N}])`, 'iu');
            const m = re.exec(out);
            if (!m) continue;
            const s = map[m.index], e = map[m.index + m[0].length];
            if ([...used].some(([a, b]) => s < b && e > a)) continue;
            used.add([s, e]);
            spans.push({ s, e, def: t.definition, term: t.term });
            break;
        }
    }
    if (!spans.length) return original;
    spans.sort((a, b) => a.s - b.s);
    let res = '', pos = 0;
    for (const sp of spans) {
        res += original.slice(pos, sp.s) + `<abbr class="gloss" title="${esc(sp.def)}" data-term="${esc(sp.term)}">${original.slice(sp.s, sp.e)}</abbr>`;
        pos = sp.e;
    }
    return res + original.slice(pos);
}
