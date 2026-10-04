#!/usr/bin/env node
/**
 * Valida docs/data/*.json sem dependências externas.
 *
 *   node scripts/validate.js
 *
 * Verifica: campos obrigatórios, tipos, ids em kebab-case e únicos entre
 * irmãos, ramo/natureza/status válidos, coerência entre catálogo e arquivos,
 * fonte oficial em https, ausência de colisão entre mapeados e planejados,
 * relações internormativas apontando para nós existentes, URN LexML e glossário.
 * Sai com código 1 se houver qualquer erro.
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'docs', 'data');
const ID_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const KEY_RE = /^[a-z0-9]+(-[a-z0-9]+)*(\/[a-z0-9]+(-[a-z0-9]+)*)*$/;
const NATUREZAS = new Set(['material', 'processual']);
const STATUS = new Set(['rascunho', 'revisado']);
const URN_RE = /^urn:lex:br:[a-z0-9.;:_-]+$/;
const URN_DATE_RE = /:(\d{4})-\d{2}-\d{2};/;
const LEXML_FRAG_RE = /^[a-z0-9_.-]+$/;
const NODE_KEYS = new Set(['id', 'name', 'label', 'subtitle', 'content', 'children', 'history', 'revoked', 'since', 'until', 'lexml']);
const META_KEYS = new Set(['$schema', 'id', 'title', 'shortTitle', 'norm', 'urn', 'ramo', 'natureza', 'status', 'source', 'year', 'note', 'root', 'predecessors']);

const errors = [];
const warnings = [];
const err = (file, msg) => errors.push(`${file}: ${msg}`);
const warn = (file, msg) => warnings.push(`${file}: ${msg}`);

function readJson(file) {
  const full = path.join(DATA_DIR, file);
  if (!fs.existsSync(full)) {
    err(file, 'arquivo não encontrado');
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(full, 'utf8'));
  } catch (e) {
    err(file, `JSON inválido: ${e.message}`);
    return null;
  }
}

function checkMeta(file, meta, ramos, { requireYear }) {
  for (const k of ['id', 'title', 'shortTitle', 'norm', 'ramo', 'natureza', 'source']) {
    if (typeof meta[k] !== 'string' || !meta[k].trim()) err(file, `campo obrigatório ausente ou vazio: ${k}`);
  }
  for (const k of Object.keys(meta)) {
    if (!META_KEYS.has(k)) err(file, `campo não previsto no schema: ${k}`);
  }
  if (meta.id && !ID_RE.test(meta.id)) err(file, `id fora do padrão kebab-case: ${meta.id}`);
  if (meta.shortTitle && meta.shortTitle.length > 14) err(file, `shortTitle com mais de 14 caracteres: ${meta.shortTitle}`);
  if (meta.ramo && !ramos.has(meta.ramo)) err(file, `ramo desconhecido: ${meta.ramo}`);
  if (meta.natureza && !NATUREZAS.has(meta.natureza)) err(file, `natureza desconhecida: ${meta.natureza}`);
  if (meta.status !== undefined && !STATUS.has(meta.status)) err(file, `status desconhecido: ${meta.status}`);
  if (meta.source && !/^https:\/\//.test(meta.source)) err(file, `source deve ser URL https: ${meta.source}`);
  if (meta.source && !/planalto\.gov\.br/.test(meta.source)) warn(file, `source fora do Planalto: ${meta.source}`);
  if (requireYear && typeof meta.year !== 'number') warn(file, 'campo year ausente');
  if (meta.urn !== undefined) {
    if (typeof meta.urn !== 'string' || !URN_RE.test(meta.urn)) err(file, `urn fora do padrão urn:lex:br:…: ${meta.urn}`);
    else {
      const m = URN_DATE_RE.exec(meta.urn);
      if (m && typeof meta.year === 'number' && +m[1] !== meta.year) err(file, `a data da urn (${m[1]}) não bate com year (${meta.year})`);
    }
  } else if (requireYear) warn(file, 'campo urn ausente (URN LexML do diploma)');
  if (meta.predecessors !== undefined) {
    if (!Array.isArray(meta.predecessors) || !meta.predecessors.length) err(file, 'predecessors deve ser um array não vazio');
    else {
      let last = 0;
      meta.predecessors.forEach((p, i) => {
        const where = `predecessors[${i}]`;
        for (const k of ['title', 'shortTitle', 'norm']) if (typeof p[k] !== 'string' || !p[k]) err(file, `${where}: campo ausente: ${k}`);
        for (const k of ['from', 'to']) if (typeof p[k] !== 'number') err(file, `${where}: ${k} deve ser número`);
        for (const k of Object.keys(p)) if (!['title', 'shortTitle', 'norm', 'from', 'to'].includes(k)) err(file, `${where}: campo não previsto: ${k}`);
        if (p.shortTitle && p.shortTitle.length > 14) err(file, `${where}: shortTitle com mais de 14 caracteres`);
        if (typeof p.from === 'number' && typeof p.to === 'number' && p.to <= p.from) err(file, `${where}: to deve ser maior que from`);
        if (typeof p.from === 'number' && p.from < last) err(file, `${where}: antecessores devem estar em ordem cronológica`);
        last = p.from;
      });
      const lastP = meta.predecessors[meta.predecessors.length - 1];
      if (typeof meta.year === 'number' && lastP && lastP.to !== meta.year) warn(file, `último antecessor termina em ${lastP.to}, mas o diploma é de ${meta.year}`);
    }
  }
}

function checkHistory(file, where, history) {
  if (!Array.isArray(history) || !history.length) { err(file, `${where}: history deve ser um array não vazio`); return; }
  history.forEach((h, i) => {
    if (typeof h.year !== 'number') err(file, `${where}: history[${i}].year deve ser número`);
    if (typeof h.norm !== 'string' || h.norm.length < 3) err(file, `${where}: history[${i}].norm ausente`);
    if (typeof h.note !== 'string' || h.note.length < 10) err(file, `${where}: history[${i}].note curto demais`);
    for (const k of Object.keys(h)) if (!['year', 'norm', 'note'].includes(k)) err(file, `${where}: history[${i}] campo não previsto: ${k}`);
  });
}

function checkNode(file, node, trail, stats, keys, docId) {
  const where = trail.join('/') || '(raiz)';
  stats.nodes++;
  stats.depth = Math.max(stats.depth, trail.length);
  keys.add([docId, ...trail].join('/'));
  for (const k of ['id', 'name', 'label', 'subtitle', 'content']) {
    if (typeof node[k] !== 'string' || !node[k].trim()) err(file, `${where}: campo obrigatório ausente ou vazio: ${k}`);
  }
  for (const k of Object.keys(node)) {
    if (!NODE_KEYS.has(k)) err(file, `${where}: campo não previsto no schema: ${k}`);
  }
  if (node.id && !ID_RE.test(node.id)) err(file, `${where}: id fora do padrão kebab-case: ${node.id}`);
  if (node.label && node.label.length > 28) err(file, `${where}: label com mais de 28 caracteres: "${node.label}"`);
  if (node.content && node.content.length < 20) err(file, `${where}: content curto demais (mínimo 20 caracteres)`);
  if (node.revoked !== undefined && typeof node.revoked !== 'boolean') err(file, `${where}: revoked deve ser booleano`);
  if (node.lexml !== undefined && (typeof node.lexml !== 'string' || !LEXML_FRAG_RE.test(node.lexml))) err(file, `${where}: lexml deve ser um fragmento como "art5": ${node.lexml}`);
  for (const k of ['since', 'until']) if (node[k] !== undefined && (typeof node[k] !== 'number' || node[k] < 1800)) err(file, `${where}: ${k} deve ser um ano`);
  if (typeof node.since === 'number' && typeof node.until === 'number' && node.until <= node.since) err(file, `${where}: until deve ser maior que since`);
  if (typeof node.since === 'number' && typeof stats.docYear === 'number' && node.since <= stats.docYear) err(file, `${where}: since (${node.since}) não é posterior ao ano do diploma (${stats.docYear}); omita o campo`);
  if (node.history !== undefined) { checkHistory(file, where, node.history); stats.history += node.history.length || 0; }
  if (node.children !== undefined) {
    if (!Array.isArray(node.children) || node.children.length === 0) {
      err(file, `${where}: children deve ser um array não vazio (omita o campo se não houver filhos)`);
    } else {
      const seen = new Map();
      for (const child of node.children) {
        if (child && child.id) {
          if (seen.has(child.id)) err(file, `${where}: id duplicado entre irmãos: ${child.id}`);
          seen.set(child.id, true);
        }
        checkNode(file, child, [...trail, child.id || '?'], stats, keys, docId);
      }
    }
  }
}

function main() {
  const catalog = readJson('index.json');
  if (!catalog) return finish();

  const ramos = new Set();
  if (!Array.isArray(catalog.ramos) || catalog.ramos.length === 0) {
    err('index.json', 'ramos deve ser um array não vazio');
  } else {
    for (const r of catalog.ramos) {
      for (const k of ['id', 'name', 'short', 'color', 'description']) {
        if (typeof r[k] !== 'string' || !r[k].trim()) err('index.json', `ramo ${r.id || '?'}: campo ausente: ${k}`);
      }
      if (r.color && !/^#[0-9a-fA-F]{6}$/.test(r.color)) err('index.json', `ramo ${r.id}: cor inválida ${r.color}`);
      if (ramos.has(r.id)) err('index.json', `ramo duplicado: ${r.id}`);
      ramos.add(r.id);
    }
  }

  if (!Array.isArray(catalog.diplomas)) err('index.json', 'diplomas deve ser um array');
  if (!Array.isArray(catalog.planned)) err('index.json', 'planned deve ser um array');
  const mapped = new Set(catalog.diplomas || []);
  if (!mapped.has(catalog.root)) err('index.json', `root "${catalog.root}" não está entre os diplomas mapeados`);

  const relationTypes = new Set(Object.keys(catalog.relationTypes || {}));
  for (const [k, v] of Object.entries(catalog.relationTypes || {})) {
    if (!v || typeof v.label !== 'string' || typeof v.description !== 'string') err('index.json', `relationTypes.${k}: label e description são obrigatórios`);
  }

  const summary = [];
  const keys = new Set();
  const docYears = {};
  for (const id of catalog.diplomas || []) {
    const file = `${id}.json`;
    const doc = readJson(file);
    if (!doc) continue;
    checkMeta(file, doc, ramos, { requireYear: true });
    docYears[id] = doc.year;
    if (doc.id !== id) err(file, `id "${doc.id}" diferente do nome do arquivo`);
    if (!doc.root || typeof doc.root !== 'object') {
      err(file, 'campo root ausente');
      continue;
    }
    if (doc.root.id !== id) err(file, `root.id "${doc.root.id}" deve ser igual ao id do diploma`);
    const stats = { nodes: 0, depth: 0, history: 0, docYear: doc.year };
    checkNode(file, doc.root, [], stats, keys, id);
    if (!doc.status) warn(file, 'sem campo status (rascunho | revisado)');
    summary.push({ id, nodes: stats.nodes, depth: stats.depth, history: stats.history, ramo: doc.ramo, natureza: doc.natureza, status: doc.status || '—' });
  }

  // Arquivos órfãos: existem na pasta mas não estão no catálogo.
  const reserved = new Set(['index.json', 'schema.json', 'relations.json', 'glossary.json', 'tours.json', 'all.json']); // all.json é gerado (build-graph.js)
  for (const f of fs.readdirSync(DATA_DIR)) {
    if (!f.endsWith('.json') || reserved.has(f)) continue;
    const id = f.replace(/\.json$/, '');
    if (!mapped.has(id)) warn(f, 'arquivo não listado em index.json → diplomas');
  }

  const plannedIds = new Set();
  for (const p of catalog.planned || []) {
    const label = `index.json → planned[${p.id || '?'}]`;
    checkMeta(label, p, ramos, { requireYear: false });
    if (mapped.has(p.id)) err(label, 'está ao mesmo tempo em diplomas e em planned');
    if (plannedIds.has(p.id)) err(label, 'id duplicado em planned');
    plannedIds.add(p.id);
  }

  // Relações internormativas
  let relCount = 0;
  const rel = readJson('relations.json');
  if (rel) {
    if (!Array.isArray(rel.relations)) err('relations.json', 'relations deve ser um array');
    else {
      const seen = new Set();
      rel.relations.forEach((r, i) => {
        const where = `relations[${i}]`;
        for (const k of ['from', 'to', 'type']) if (typeof r[k] !== 'string') err('relations.json', `${where}: campo ausente: ${k}`);
        for (const k of Object.keys(r)) if (!['from', 'to', 'type', 'note', 'basis', 'since', 'until', 'status'].includes(k)) err('relations.json', `${where}: campo não previsto: ${k}`);
        if (r.basis !== undefined && (typeof r.basis !== 'string' || r.basis.length < 3)) err('relations.json', `${where}: basis curto demais`);
        if (r.status !== undefined && !STATUS.has(r.status)) err('relations.json', `${where}: status desconhecido: ${r.status}`);
        for (const k of ['since', 'until']) if (r[k] !== undefined && (!Number.isInteger(r[k]) || r[k] < 1800)) err('relations.json', `${where}: ${k} deve ser um ano`);
        if (Number.isInteger(r.since) && Number.isInteger(r.until) && r.since > r.until) err('relations.json', `${where}: since (${r.since}) posterior a until (${r.until})`);
        if (Number.isInteger(r.since)) {
          for (const k of ['from', 'to']) {
            const y = typeof r[k] === 'string' ? docYears[r[k].split('/')[0]] : undefined;
            if (typeof y === 'number' && r.since < y) err('relations.json', `${where}: since (${r.since}) anterior ao diploma de ${k} (${y})`);
          }
        }
        for (const k of ['from', 'to']) {
          if (typeof r[k] !== 'string') continue;
          if (!KEY_RE.test(r[k])) err('relations.json', `${where}: ${k} fora do padrão diploma/divisao: ${r[k]}`);
          else if (!keys.has(r[k])) err('relations.json', `${where}: ${k} aponta para nó inexistente: ${r[k]}`);
        }
        if (r.from && r.to && r.from.split('/')[0] === r.to.split('/')[0]) err('relations.json', `${where}: relação dentro do mesmo diploma (${r.from} → ${r.to}); use apenas entre diplomas distintos`);
        if (r.type && !relationTypes.has(r.type)) err('relations.json', `${where}: tipo desconhecido "${r.type}" (defina em index.json → relationTypes)`);
        if (r.note !== undefined && (typeof r.note !== 'string' || r.note.length < 10)) err('relations.json', `${where}: note curto demais`);
        const sig = `${r.from}|${r.to}|${r.type}`;
        if (seen.has(sig)) err('relations.json', `${where}: relação duplicada`);
        seen.add(sig);
      });
      relCount = rel.relations.length;
    }
  }

  // Glossário
  let termCount = 0;
  const glossary = readJson('glossary.json');
  if (glossary) {
    if (!Array.isArray(glossary.terms)) err('glossary.json', 'terms deve ser um array');
    else {
      const seen = new Set();
      glossary.terms.forEach((t, i) => {
        const where = `terms[${i}]`;
        if (typeof t.term !== 'string' || t.term.length < 2) err('glossary.json', `${where}: term ausente`);
        if (typeof t.definition !== 'string' || t.definition.length < 20) err('glossary.json', `${where}: definition curta demais`);
        if (t.aliases !== undefined && (!Array.isArray(t.aliases) || t.aliases.some(a => typeof a !== 'string'))) err('glossary.json', `${where}: aliases deve ser array de strings`);
        for (const k of Object.keys(t)) if (!['term', 'aliases', 'definition'].includes(k)) err('glossary.json', `${where}: campo não previsto: ${k}`);
        const low = (t.term || '').toLowerCase();
        if (seen.has(low)) err('glossary.json', `${where}: termo duplicado: ${t.term}`);
        seen.add(low);
      });
      termCount = glossary.terms.length;
    }
  }

  // Percursos guiados
  let tourCount = 0;
  const tours = readJson('tours.json');
  if (tours) {
    if (!Array.isArray(tours.tours)) err('tours.json', 'tours deve ser um array');
    else {
      const ids = new Set();
      tours.tours.forEach((t, i) => {
        const where = `tours[${t.id || i}]`;
        for (const k of ['id', 'title', 'summary']) if (typeof t[k] !== 'string' || !t[k]) err('tours.json', `${where}: campo ausente: ${k}`);
        for (const k of Object.keys(t)) if (!['id', 'title', 'summary', 'status', 'steps'].includes(k)) err('tours.json', `${where}: campo não previsto: ${k}`);
        if (t.id && !ID_RE.test(t.id)) err('tours.json', `${where}: id fora do padrão kebab-case`);
        if (ids.has(t.id)) err('tours.json', `${where}: id duplicado`);
        ids.add(t.id);
        if (t.status !== undefined && !STATUS.has(t.status)) err('tours.json', `${where}: status desconhecido`);
        if (!Array.isArray(t.steps) || t.steps.length < 2) { err('tours.json', `${where}: steps precisa de ao menos 2 passos`); return; }
        t.steps.forEach((s, j) => {
          const sw = `${where}.steps[${j}]`;
          if (typeof s.key !== 'string' || !KEY_RE.test(s.key)) err('tours.json', `${sw}: key inválida`);
          else if (!keys.has(s.key)) err('tours.json', `${sw}: key aponta para nó inexistente: ${s.key}`);
          if (typeof s.text !== 'string' || s.text.length < 20) err('tours.json', `${sw}: text curto demais`);
          for (const k of Object.keys(s)) if (!['key', 'text'].includes(k)) err('tours.json', `${sw}: campo não previsto: ${k}`);
        });
      });
      tourCount = tours.tours.length;
    }
  }

  finish(summary, { relCount, termCount, tourCount });
}

function finish(summary = [], extra = {}) {
  if (summary.length) {
    console.log('Diplomas mapeados:');
    for (const s of summary) {
      console.log(`  ${s.id.padEnd(7)} ${String(s.nodes).padStart(3)} nós, profundidade ${s.depth}, ${String(s.history).padStart(2)} marcos  [${s.ramo}/${s.natureza}]  ${s.status}`);
    }
    console.log(`Relações internormativas: ${extra.relCount || 0}   Termos do glossário: ${extra.termCount || 0}   Percursos: ${extra.tourCount || 0}`);
  }
  for (const w of warnings) console.warn(`aviso  ${w}`);
  for (const e of errors) console.error(`ERRO   ${e}`);
  if (errors.length) {
    console.error(`\n${errors.length} erro(s).`);
    process.exit(1);
  }
  console.log(`\nOK — ${warnings.length} aviso(s), 0 erros.`);
}

main();
