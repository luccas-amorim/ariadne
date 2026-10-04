// Serialização do grafo para máquinas: JSON-LD, Turtle e CSV.
// Usado por scripts/build-graph.js (que grava os arquivos de docs/data/) e pela interface
// (subgrafo de um nó, exemplos da vista Dados), para que os dois produzam exatamente o mesmo.
import {
    iriOf, IRI_BASE, CONTENT_LICENSE, keyLabel, nodeLd, divisionKind, keySpan, urnOf,
    relationSpan, predecessorNodes, successionEdges
} from './data.js';

export const VOCAB = 'https://luccas-amorim.github.io/ariadne/vocab#';
export const DATA_BASE = 'https://luccas-amorim.github.io/ariadne/data/';
const SCHEMA = 'https://schema.org/';
const ATTRIBUTION = 'Ariadne — Árvores Jurídicas BR (luccas-amorim.github.io/ariadne)';

/** Propriedades dos nós: termo do JSON-LD → [IRI do predicado, espécie do valor]. */
const NODE_PROPS = {
    name: [SCHEMA + 'name', 'pt'],
    alternateName: [SCHEMA + 'alternateName', 'str'],
    legislationIdentifier: [SCHEMA + 'legislationIdentifier', 'pt'],
    legislationDate: [SCHEMA + 'legislationDate', 'str'],
    url: [SCHEMA + 'url', 'iri'],
    sameAs: [SCHEMA + 'sameAs', 'iri'],
    isPartOf: [SCHEMA + 'isPartOf', 'iri'],
    'av:rotulo': [VOCAB + 'rotulo', 'pt'],
    'av:faixa': [VOCAB + 'faixa', 'pt'],
    'av:status': [VOCAB + 'status', 'str'],
    'av:desde': [VOCAB + 'desde', 'int'],
    'av:ate': [VOCAB + 'ate', 'int']
};
/** Propriedades da relação qualificada (reificação simples: um nó av:Relacao por relação). */
const REL_PROPS = {
    'av:origem': [VOCAB + 'origem', 'iri'],
    'av:tipo': [VOCAB + 'tipo', 'iri'],
    'av:destino': [VOCAB + 'destino', 'iri'],
    'av:nota': [VOCAB + 'nota', 'pt'],
    'av:fundamento': [VOCAB + 'fundamento', 'pt'],
    'av:desde': [VOCAB + 'desde', 'int'],
    'av:ate': [VOCAB + 'ate', 'int'],
    'av:status': [VOCAB + 'status', 'str']
};
const DIVISION_CLASSES = { Parte: 'Parte do diploma', Livro: 'Livro', Titulo: 'Título', Capitulo: 'Capítulo', Secao: 'Seção', Divisao: 'Divisão sem espécie própria (agrupamentos, disposições finais etc.)' };

/** IRI estável de uma relação: ar:rel/<origem>~<tipo>~<destino>, com '/' das chaves trocada por '.'. */
export function relationIri(rel) { return `${IRI_BASE}rel/${rel.from.replace(/\//g, '.')}~${rel.type}~${rel.to.replace(/\//g, '.')}`; }

/** Todas as chaves de nós mapeados, na ordem do catálogo e da árvore. */
export function allKeys(data) {
    const keys = [];
    for (const id of data.catalog.diplomas) {
        (function walk(n, path) {
            keys.push([id, ...path].join('/'));
            (n.children || []).forEach(c => walk(c, [...path, c.id]));
        })(data.diplomas[id].root, []);
    }
    return keys;
}

// ---------- JSON-LD ----------
export function jsonLdContext(data) {
    const ctx = { '@version': 1.1, schema: SCHEMA, av: VOCAB, ar: IRI_BASE, xsd: 'http://www.w3.org/2001/XMLSchema#', Legislation: 'schema:Legislation', license: { '@id': 'schema:license', '@type': '@id' } };
    for (const [term, [iri, kind]] of Object.entries({ ...NODE_PROPS, ...REL_PROPS })) {
        const id = iri.startsWith(SCHEMA) ? 'schema:' + iri.slice(SCHEMA.length) : 'av:' + iri.slice(VOCAB.length);
        ctx[term] = kind === 'iri' ? { '@id': id, '@type': '@id' } : kind === 'int' ? { '@id': id, '@type': 'xsd:integer' } : kind === 'pt' ? { '@id': id, '@language': 'pt' } : { '@id': id };
    }
    for (const t of Object.keys(data.relationTypes)) ctx[t] = { '@id': `av:${t}`, '@type': '@id' };
    return { '@context': ctx };
}

function relationLd(data, rel) {
    const span = relationSpan(data, rel);
    const o = { '@id': relationIri(rel), '@type': 'av:Relacao', 'av:origem': iriOf(rel.from), 'av:tipo': VOCAB + rel.type, 'av:destino': iriOf(rel.to) };
    if (rel.note) o['av:nota'] = rel.note;
    if (rel.basis) o['av:fundamento'] = rel.basis;
    if (span.since != null) o['av:desde'] = span.since;
    if (span.until != null) o['av:ate'] = span.until;
    if (rel.status) o['av:status'] = rel.status;
    return o;
}

function predecessorLd(p) {
    return { '@id': iriOf(p.key), '@type': 'Legislation', name: p.title, alternateName: p.shortTitle, legislationIdentifier: p.norm, 'av:desde': p.since, 'av:ate': p.until };
}

/** O grafo inteiro em JSON-LD, com o contexto embutido (vale sem rede). */
export function buildJsonLd(data) {
    const graph = allKeys(data).map(k => nodeLd(data, k));
    predecessorNodes(data).forEach(p => graph.push(predecessorLd(p)));
    data.relations.forEach(rel => graph.push({ '@id': iriOf(rel.from), [rel.type]: iriOf(rel.to) }));
    successionEdges(data).forEach(e => graph.push({ '@id': iriOf(e.from), sucede: iriOf(e.to) }));
    data.relations.forEach(rel => graph.push(relationLd(data, rel)));
    // a descrição do conjunto fica dentro de @graph: um @id ao lado de @graph faria dele um grafo nomeado
    graph.unshift({ '@id': DATA_BASE + 'graph.jsonld', '@type': 'schema:Dataset', name: 'Ariadne: estrutura da legislação brasileira e relações internormativas', license: CONTENT_LICENSE });
    return { ...jsonLdContext(data), '@graph': graph };
}

// ---------- Turtle ----------
const lit = s => `"${String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r')}"`;
const iri = s => `<${s}>`;
const expand = v => v.startsWith('av:') ? VOCAB + v.slice(3) : v;
const PREFIXES = `@prefix av: <${VOCAB}> .\n@prefix schema: <${SCHEMA}> .\n@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\n@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .\n`;
const header = title => `# ${title}\n# Gerado por scripts/build-graph.js a partir de docs/data/*.json. Não edite à mão.\n# Conteúdo sob CC BY 4.0 (${CONTENT_LICENSE}). Atribuição: ${ATTRIBUTION}.\n`;

function predicateTerm(full) {
    if (full.startsWith(SCHEMA)) return 'schema:' + full.slice(SCHEMA.length);
    if (full.startsWith(VOCAB)) return 'av:' + full.slice(VOCAB.length);
    return iri(full);
}
function objectTerm(value, kind) {
    if (kind === 'iri') { const full = expand(value); return full.startsWith(VOCAB) ? 'av:' + full.slice(VOCAB.length) : iri(full); }
    if (kind === 'int') return String(value);
    if (kind === 'pt') return `${lit(value)}@pt`;
    return lit(value);
}
/** Um objeto no formato de nodeLd/relationLd vira um bloco de triplas. */
function subjectTurtle(o, props) {
    const types = [].concat(o['@type'] || []).map(t => t === 'Legislation' ? 'schema:Legislation' : t);
    const lines = [];
    if (types.length) lines.push(`a ${types.join(', ')}`);
    for (const [term, [pred, kind]] of Object.entries(props)) {
        if (o[term] == null) continue;
        lines.push(`${predicateTerm(pred)} ${objectTerm(o[term], kind)}`);
    }
    return `${iri(o['@id'])}\n    ${lines.join(' ;\n    ')} .\n`;
}

export function vocabTurtle(data) {
    const out = [header('Ariadne: vocabulário (av:)'), PREFIXES, `<${VOCAB}> a <http://www.w3.org/2002/07/owl#Ontology> ;\n    rdfs:label "Vocabulário do Ariadne"@pt ;\n    schema:license <${CONTENT_LICENSE}> .\n`];
    for (const [id, t] of Object.entries(data.relationTypes)) {
        out.push(`av:${id} a rdf:Property ;\n    rdfs:label ${lit(t.label)}@pt ;\n    rdfs:comment ${lit(t.description)}@pt .\n`);
    }
    out.push(`av:Relacao a rdfs:Class ;\n    rdfs:label "Relação internormativa"@pt ;\n    rdfs:comment "Relação qualificada entre dois nós: origem, tipo, destino, nota, fundamento, vigência e status. A tripla direta (origem tipo destino) também é publicada."@pt .\n`);
    for (const [c, label] of Object.entries(DIVISION_CLASSES)) out.push(`av:${c} a rdfs:Class ;\n    rdfs:label ${lit(label)}@pt .\n`);
    const props = { origem: 'Nó de onde a relação parte.', destino: 'Nó a que a relação chega.', tipo: 'Tipo da relação (uma das propriedades deste vocabulário).', nota: 'Explicação da relação.', fundamento: 'Dispositivo que fundamenta a relação.', desde: 'Ano em que passou a valer.', ate: 'Ano em que deixou de valer (exclusivo).', status: 'rascunho ou revisado.', rotulo: 'Rótulo curto da divisão.', faixa: 'Faixa de artigos da divisão.' };
    for (const [p, c] of Object.entries(props)) out.push(`av:${p} a rdf:Property ;\n    rdfs:comment ${lit(c)}@pt .\n`);
    return out.join('\n');
}

/**
 * Turtle do grafo. Com `keys`, só os nós dessas chaves e as relações que tocam neles
 * (o "subgrafo"), mais nome e URN das pontas.
 */
export function buildTurtle(data, { keys = null, title = 'Ariadne: estrutura da legislação brasileira e relações internormativas' } = {}) {
    const only = keys ? new Set(keys) : null;
    const out = [header(title), PREFIXES];
    out.push(`<${DATA_BASE}graph.ttl> a schema:Dataset ;\n    schema:name ${lit(title)}@pt ;\n    schema:license <${CONTENT_LICENSE}> .\n`);
    const nodeKeys = allKeys(data).filter(k => !only || only.has(k));
    const rels = data.relations.filter(r => !only || only.has(r.from) || only.has(r.to));
    // pontas de relações fora do subgrafo: só nome, para o arquivo se explicar sozinho
    const ends = only ? [...new Set(rels.flatMap(r => [r.from, r.to]))].filter(k => !only.has(k)) : [];
    nodeKeys.forEach(k => out.push(subjectTurtle(nodeLd(data, k), NODE_PROPS)));
    ends.forEach(k => { const o = nodeLd(data, k); out.push(subjectTurtle({ '@id': o['@id'], '@type': o['@type'], name: o.name }, NODE_PROPS)); });
    if (!only) {
        predecessorNodes(data).forEach(p => out.push(subjectTurtle(predecessorLd(p), NODE_PROPS)));
        out.push('# sucessão: cada diploma sucede o antecessor\n' + successionEdges(data).map(e => `${iri(iriOf(e.from))} av:sucede ${iri(iriOf(e.to))} .`).join('\n') + '\n');
    }
    if (rels.length) {
        out.push('# relações internormativas: tripla direta\n' + rels.map(r => `${iri(iriOf(r.from))} av:${r.type} ${iri(iriOf(r.to))} .`).join('\n') + '\n');
        out.push('# relações qualificadas (reificação simples): nota, fundamento, vigência e status');
        rels.forEach(r => out.push(subjectTurtle(relationLd(data, r), REL_PROPS)));
    }
    return out.join('\n');
}

/** Subgrafo de um nó: ele, as divisões abaixo dele e as relações que tocam nesse conjunto. */
export function subgraphTurtle(data, key) {
    const keys = allKeys(data).filter(k => k === key || k.startsWith(key + '/'));
    return buildTurtle(data, { keys, title: `Ariadne: subgrafo de ${keyLabel(data, key)}` });
}

/** Uma relação, em Turtle, para exemplos. */
export function relationTurtle(data, rel) {
    return `${iri(iriOf(rel.from))} av:${rel.type} ${iri(iriOf(rel.to))} .\n\n` + subjectTurtle(relationLd(data, rel), REL_PROPS);
}

// ---------- CSV ----------
const csvCell = v => { const s = v == null ? '' : String(v); return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
const csv = rows => rows.map(r => r.map(csvCell).join(',')).join('\n') + '\n';

/** edges.csv: as relações curadas (relations.json), com a vigência efetiva. */
export function edgesCsv(data) {
    return csv([['from', 'to', 'type', 'since', 'until', 'status', 'basis'],
        ...data.relations.map(r => { const s = relationSpan(data, r); return [r.from, r.to, r.type, s.since, s.until, r.status, r.basis]; })]);
}

/** nodes.csv: todos os nós mapeados. A URN só aparece quando é exata (diploma ou fragmento conferido). */
export function nodesCsv(data) {
    return csv([['key', 'diploma', 'kind', 'label', 'name', 'subtitle', 'since', 'until', 'status', 'urn'],
        ...allKeys(data).map(k => {
            const [id, ...path] = k.split('/'), doc = data.diplomas[id], span = keySpan(data, k), u = urnOf(data, k);
            let n = doc.root; for (const seg of path) n = n.children.find(c => c.id === seg);
            const isDoc = !path.length;
            return [k, id, isDoc ? 'diploma' : divisionKind(path[path.length - 1]).toLowerCase(), isDoc ? doc.shortTitle : n.label, isDoc ? doc.title : n.name,
                isDoc ? doc.norm : n.subtitle, span.since, span.until, doc.status, u && (isDoc || u.fragment) ? u.urn : ''];
        })]);
}
