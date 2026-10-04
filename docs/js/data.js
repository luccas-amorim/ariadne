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
    const [docs, relations, glossary, tours] = await Promise.all([
        Promise.all(catalog.diplomas.map(id => fetchJson(`${base}${id}.json`))),
        fetchJson(`${base}relations.json`).catch(() => ({ relations: [] })),
        fetchJson(`${base}glossary.json`).catch(() => ({ terms: [] })),
        fetchJson(`${base}tours.json`).catch(() => ({ tours: [] }))
    ]);
    const diplomas = {}, ramos = {};
    docs.forEach(d => { diplomas[d.id] = d; });
    catalog.ramos.forEach(r => { ramos[r.id] = r; });
    return {
        catalog, diplomas, ramos,
        relations: relations.relations || [],
        relationTypes: catalog.relationTypes || {},
        glossary: glossary.terms || [],
        tours: tours.tours || []
    };
}

/**
 * Eventos da linha do tempo, em ordem cronológica: promulgação de diplomas e antecessores,
 * marcos estruturais (history) e divisões incluídas depois (since).
 * Cada item: { year, kind: 'diploma'|'antecessor'|'marco'|'inclusao', text, key }.
 */
export function timelineEvents(data) {
    const ev = [];
    for (const doc of Object.values(data.diplomas)) {
        if (doc.year) ev.push({ year: doc.year, kind: 'diploma', text: `${doc.title} (${doc.norm})`, key: doc.id });
        (doc.predecessors || []).forEach(p => ev.push({ year: p.from, kind: 'antecessor', text: `${p.title} (${p.norm})`, key: doc.id }));
        (function walk(n, path) {
            const key = [doc.id, ...path].join('/');
            (n.history || []).forEach(h => ev.push({ year: h.year, kind: 'marco', text: `${doc.shortTitle} › ${n.label}: ${h.note} (${h.norm})`, key }));
            if (n.since) ev.push({ year: n.since, kind: 'inclusao', text: `${doc.shortTitle}: ${n.name} passa a existir.`, key });
            (n.children || []).forEach(c => walk(c, [...path, c.id]));
        })(doc.root, []);
    }
    // marcos duplicados (history + since no mesmo ano) ficam juntos; ordena por ano e tipo
    const order = { diploma: 0, antecessor: 1, inclusao: 2, marco: 3 };
    return ev.sort((a, b) => a.year - b.year || order[a.kind] - order[b.kind] || a.text.localeCompare(b.text));
}

// ---------- identificadores públicos ----------
export const IRI_BASE = 'https://luccas-amorim.github.io/ariadne/id/';

/** IRI estável do Ariadne para uma chave (diploma/divisao/...). */
export function iriOf(key) { return IRI_BASE + key; }

/** Nó de dados (o objeto do JSON) de uma chave, ou null. */
export function dataNodeOf(data, key) {
    const [docId, ...path] = key.split('/');
    const doc = data.diplomas[docId];
    if (!doc) return null;
    let n = doc.root;
    for (const seg of path) { n = (n.children || []).find(c => c.id === seg); if (!n) return null; }
    return n;
}

/** Rótulo legível de uma chave: 'CPP › Livro I › Título IX'. */
export function keyLabel(data, key) {
    const [docId, ...path] = key.split('/');
    const doc = data.diplomas[docId];
    if (!doc) return key;
    let n = doc.root; const labels = [];
    for (const seg of path) { n = (n.children || []).find(c => c.id === seg); if (!n) break; labels.push(n.label); }
    return `${doc.shortTitle}${labels.length ? ' › ' + labels.join(' › ') : ''}`;
}

/**
 * URN LexML de uma chave. Sem fragmento verificado (campo `lexml` do nó),
 * devolve a URN do diploma e fragment = null. Nunca inventa fragmentos.
 * Retorna { urn, base, fragment } ou null se o diploma não tiver URN.
 */
export function urnOf(data, key) {
    const doc = data.diplomas[key.split('/')[0]];
    if (!doc || !doc.urn) return null;
    const n = dataNodeOf(data, key);
    const fragment = n && n !== doc.root && n.lexml ? n.lexml : null;
    return { urn: fragment ? `${doc.urn}!${fragment}` : doc.urn, base: doc.urn, fragment };
}

// ---------- representação para máquinas (painel Dados e scripts/build-graph.js) ----------
export const CONTEXT_URL = 'https://luccas-amorim.github.io/ariadne/data/context.jsonld';
export const CONTENT_LICENSE = 'https://creativecommons.org/licenses/by/4.0/';

/** Espécie da divisão pelo prefixo do id: Parte, Livro, Titulo, Capitulo, Secao ou Divisao. */
export function divisionKind(id) {
    const m = /^(parte|livro|titulo|cap|secao)\b/.exec(id);
    return m ? { parte: 'Parte', livro: 'Livro', titulo: 'Titulo', cap: 'Capitulo', secao: 'Secao' }[m[1]] : 'Divisao';
}

/** Tipo do nó no vocabulário: schema:Legislation para diplomas, av:<espécie> para divisões. */
export function nodeTypeOf(key) {
    const path = key.split('/');
    return path.length === 1 ? 'Legislation' : `av:${divisionKind(path[path.length - 1])}`;
}

/** Objeto JSON-LD de um nó (sem @context, que o chamador acrescenta). */
export function nodeLd(data, key) {
    const [docId, ...path] = key.split('/');
    const doc = data.diplomas[docId];
    const n = dataNodeOf(data, key);
    if (!doc || !n) return null;
    const span = keySpan(data, key), urn = urnOf(data, key);
    const o = { '@id': iriOf(key), '@type': nodeTypeOf(key) };
    if (!path.length) {
        Object.assign(o, { name: doc.title, alternateName: doc.shortTitle, legislationIdentifier: doc.norm, url: doc.source });
        if (doc.year) o.legislationDate = String(doc.year);
        if (doc.status) o['av:status'] = doc.status;
    } else {
        Object.assign(o, { name: n.name, 'av:rotulo': n.label, 'av:faixa': n.subtitle, isPartOf: iriOf([docId, ...path.slice(0, -1)].join('/')) });
    }
    if (urn && (!path.length || urn.fragment)) o.sameAs = urn.urn;
    if (span.since != null) o['av:desde'] = span.since;
    if (span.until != null) o['av:ate'] = span.until;
    return o;
}

const MESES_ABNT = ['jan.', 'fev.', 'mar.', 'abr.', 'maio', 'jun.', 'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.'];

/** Referência no estilo ABNT (NBR 6023) do diploma ou da divisão, com data de acesso. */
export function citeAbnt(data, key, date = new Date()) {
    const [docId, ...path] = key.split('/');
    const doc = data.diplomas[docId];
    if (!doc) return '';
    const n = path.length ? dataNodeOf(data, key) : null;
    const title = /constitui/i.test(doc.norm) ? '' : ` ${doc.title}.`;
    const part = n ? ` ${n.name} (${n.subtitle}).` : '';
    const acesso = `${date.getDate()} ${MESES_ABNT[date.getMonth()]} ${date.getFullYear()}`;
    return `BRASIL. ${doc.norm}.${title}${part} Disponível em: ${doc.source}. Acesso em: ${acesso}.`;
}

/** Vigência de uma chave: { since, until } pelo ano do diploma e pelos since/until da divisão e dos ancestrais. */
export function keySpan(data, key) {
    const [docId, ...path] = key.split('/');
    const doc = data.diplomas[docId];
    if (!doc) return { since: null, until: null };
    let since = doc.year || null, until = null, n = doc.root;
    for (const seg of path) {
        n = (n.children || []).find(c => c.id === seg);
        if (!n) break;
        if (n.since != null) since = Math.max(since || 0, n.since);
        if (n.until != null) until = until == null ? n.until : Math.min(until, n.until);
    }
    return { since, until };
}

/**
 * Vigência efetiva de uma relação: since/until explícitos, ou a interseção da vigência dos dois nós.
 * until é exclusivo (a relação some no ano de until), como nas divisões.
 */
export function relationSpan(data, rel) {
    const a = keySpan(data, rel.from), b = keySpan(data, rel.to);
    const sinces = [a.since, b.since, rel.since].filter(v => v != null);
    const untils = [a.until, b.until, rel.until].filter(v => v != null);
    return { since: sinces.length ? Math.max(...sinces) : null, until: untils.length ? Math.min(...untils) : null };
}

/** A relação vale no ano Y? (Y null = hoje.) */
export function relationActiveAt(data, rel, Y) {
    if (Y == null) return rel.until == null || rel.until > new Date().getFullYear();
    const s = relationSpan(data, rel);
    return (s.since == null || s.since <= Y) && (s.until == null || Y < s.until);
}

/** Reconhece uma URN LexML, um IRI do Ariadne ou uma chave colados na busca. */
export function parseIdentifier(q) {
    const s = String(q).trim();
    let m = /^urn:lex:br:[^\s!]+(?:![^\s]*)?$/i.exec(s);
    if (m) { const [base, fragment] = s.split('!'); return { kind: 'urn', base: base.toLowerCase(), fragment: fragment || null }; }
    m = /^(?:https?:\/\/)?luccas-amorim\.github\.io\/ariadne\/(?:id\/|#\/)([a-z0-9/-]+?)\/?(?:[?#].*)?$/i.exec(s);
    if (m) return { kind: 'key', key: m[1].toLowerCase() };
    return null;
}

// ---------- tempo: antecessores, estrutura num ano e diferença entre dois anos ----------
/** Antecessores como nós fantasma do grafo: chave `<diploma>-<ano inicial>`, sem arquivo próprio. */
export function predecessorNodes(data) {
    const out = [];
    for (const doc of Object.values(data.diplomas)) {
        (doc.predecessors || []).forEach(p => out.push({ key: `${doc.id}-${p.from}`, of: doc.id, title: p.title, shortTitle: p.shortTitle, norm: p.norm, since: p.from, until: p.to }));
    }
    return out;
}

/** Arestas `sucede`: cada diploma sucede o antecessor imediato, e cada antecessor o anterior a ele. */
export function successionEdges(data) {
    const out = [];
    for (const doc of Object.values(data.diplomas)) {
        const ps = doc.predecessors || [];
        ps.forEach((p, i) => {
            const next = ps[i + 1];
            out.push({ from: next ? `${doc.id}-${next.from}` : doc.id, to: `${doc.id}-${p.from}`, type: 'sucede', since: p.to });
        });
    }
    return out;
}

/** Chaves vigentes no ano Y: diplomas já promulgados e suas divisões, ou o antecessor vigente. */
export function structureAt(data, Y) {
    const keys = new Set();
    for (const doc of Object.values(data.diplomas)) {
        if (doc.year != null && doc.year <= Y) {
            (function walk(n, path) {
                if (path.length && ((n.since != null && n.since > Y) || (n.until != null && n.until <= Y))) return;
                keys.add([doc.id, ...path].join('/'));
                (n.children || []).forEach(c => walk(c, [...path, c.id]));
            })(doc.root, []);
        } else {
            (doc.predecessors || []).forEach(p => { if (p.from <= Y && Y < p.to) keys.add(`${doc.id}-${p.from}`); });
        }
    }
    return keys;
}

/**
 * O que mudou na estrutura entre os anos a e b (a < b).
 * added: divisões e diplomas que passaram a existir; removed: os que deixaram de existir
 * (inclusive antecessores substituídos); changed: nós presentes nos dois anos com marco (history)
 * entre a e b. Uma divisão nova dentro de outra também nova não é listada à parte.
 * Cada item: { key, kind, label, name, year, norm, note, linkKey, linkYear }.
 */
export function diffStructure(data, a, b) {
    if (a > b) [a, b] = [b, a];
    const A = structureAt(data, a), B = structureAt(data, b);
    const preds = new Map(predecessorNodes(data).map(p => [p.key, p]));
    const parentOf = key => { const i = key.lastIndexOf('/'); return i > 0 ? key.slice(0, i) : null; };
    const item = (key, year, extra = {}) => {
        const p = preds.get(key);
        if (p) {
            const doc = data.diplomas[p.of];
            return { key, kind: 'antecessor', label: p.shortTitle, name: p.title, year, norm: p.norm, note: '', linkKey: p.of, linkYear: Math.max(p.since, Math.min(year, p.until - 1)), doc, ...extra };
        }
        const doc = data.diplomas[key.split('/')[0]], n = dataNodeOf(data, key);
        const isDoc = !key.includes('/');
        return { key, kind: isDoc ? 'diploma' : 'division', label: keyLabel(data, key), name: isDoc ? doc.title : n.name, subtitle: isDoc ? doc.norm : n.subtitle, year, norm: '', note: '', linkKey: key, linkYear: year, doc, ...extra };
    };
    const added = [], removed = [], changed = [];
    for (const key of B) {
        if (A.has(key)) continue;
        const parent = parentOf(key);
        if (parent && B.has(parent) && !A.has(parent)) continue;
        const p = preds.get(key);
        if (p) { added.push(item(key, p.since, { norm: p.norm, note: 'Passa a vigorar.' })); continue; }
        const n = dataNodeOf(data, key), doc = data.diplomas[key.split('/')[0]];
        if (!parent) {
            const replaced = [...A].map(k => preds.get(k)).find(x => x && x.of === doc.id);
            added.push(item(key, doc.year, { norm: doc.norm, note: replaced ? `Substitui ${replaced.shortTitle}.` : 'Entra em vigor.' }));
        } else {
            // o marco pode estar na própria divisão ou no nó pai (ex.: "Inclusão do Capítulo II-A")
            const h = (n.history || []).find(x => x.year === n.since) || (dataNodeOf(data, parent).history || []).find(x => x.year === n.since);
            added.push(item(key, n.since, { norm: h ? h.norm : '', note: h && (n.history || []).includes(h) ? h.note : `${n.name} passa a existir.` }));
        }
    }
    for (const key of A) {
        if (B.has(key)) continue;
        const parent = parentOf(key);
        if (parent && A.has(parent) && !B.has(parent)) continue;
        const p = preds.get(key);
        if (p) {
            const doc = data.diplomas[p.of];
            const next = (doc.predecessors || []).find(x => x.from === p.until);
            removed.push(item(key, p.until, { norm: next ? next.norm : doc.norm, note: `Substituído por ${next ? next.shortTitle : doc.shortTitle}.` }));
            continue;
        }
        const n = dataNodeOf(data, key);
        const h = (n.history || []).find(x => x.year === n.until);
        removed.push(item(key, n.until, { norm: h ? h.norm : '', note: h ? h.note : `${n.name} deixa de existir.`, linkYear: n.until - 1 }));
    }
    for (const key of A) {
        if (!B.has(key) || preds.has(key)) continue;
        const n = dataNodeOf(data, key);
        (n.history || []).filter(h => h.year > a && h.year <= b).forEach(h => changed.push(item(key, h.year, { norm: h.norm, note: h.note })));
    }
    const order = (x, y) => x.year - y.year || x.label.localeCompare(y.label);
    return { a, b, added: added.sort(order), removed: removed.sort(order), changed: changed.sort(order) };
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

/** Entrada do índice para uma URN ou IRI, ou null. Fragmento desconhecido cai no diploma. */
export function resolveIdentifier(index, q) {
    const id = parseIdentifier(q);
    if (!id) return null;
    if (id.kind === 'key') return index.find(e => e.key === id.key) || null;
    const inDoc = index.filter(e => (e.diploma.urn || '').toLowerCase() === id.base);
    if (!inDoc.length) return null;
    return (id.fragment && inDoc.find(e => e.path.length && e.node.lexml === id.fragment)) || inDoc.find(e => !e.path.length);
}

export function search(index, q, limit = 12) {
    const byId = resolveIdentifier(index, q);
    if (byId) return [byId];
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
