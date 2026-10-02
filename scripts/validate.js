#!/usr/bin/env node
/**
 * Valida docs/data/*.json sem dependências externas.
 *
 *   node scripts/validate.js
 *
 * Verifica: campos obrigatórios, tipos, ids em kebab-case e únicos entre
 * irmãos, ramo/natureza/status válidos, coerência entre catálogo e arquivos,
 * fonte oficial em https, ausência de colisão entre mapeados e planejados,
 * relações internormativas apontando para nós existentes e glossário.
 * Sai com código 1 se houver qualquer erro.
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'docs', 'data');
const ID_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const KEY_RE = /^[a-z0-9]+(-[a-z0-9]+)*(\/[a-z0-9]+(-[a-z0-9]+)*)*$/;
const NATUREZAS = new Set(['material', 'processual']);
const STATUS = new Set(['rascunho', 'revisado']);
const NODE_KEYS = new Set(['id', 'name', 'label', 'subtitle', 'content', 'children', 'history', 'revoked']);
const META_KEYS = new Set(['$schema', 'id', 'title', 'shortTitle', 'norm', 'ramo', 'natureza', 'status', 'source', 'year', 'note', 'root']);

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
  for (const id of catalog.diplomas || []) {
    const file = `${id}.json`;
    const doc = readJson(file);
    if (!doc) continue;
    checkMeta(file, doc, ramos, { requireYear: true });
    if (doc.id !== id) err(file, `id "${doc.id}" diferente do nome do arquivo`);
    if (!doc.root || typeof doc.root !== 'object') {
      err(file, 'campo root ausente');
      continue;
    }
    if (doc.root.id !== id) err(file, `root.id "${doc.root.id}" deve ser igual ao id do diploma`);
    const stats = { nodes: 0, depth: 0, history: 0 };
    checkNode(file, doc.root, [], stats, keys, id);
    if (!doc.status) warn(file, 'sem campo status (rascunho | revisado)');
    summary.push({ id, nodes: stats.nodes, depth: stats.depth, history: stats.history, ramo: doc.ramo, natureza: doc.natureza, status: doc.status || '—' });
  }

  // Arquivos órfãos: existem na pasta mas não estão no catálogo.
  const reserved = new Set(['index.json', 'schema.json', 'relations.json', 'glossary.json']);
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
        for (const k of Object.keys(r)) if (!['from', 'to', 'type', 'note'].includes(k)) err('relations.json', `${where}: campo não previsto: ${k}`);
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

  finish(summary, { relCount, termCount });
}

function finish(summary = [], extra = {}) {
  if (summary.length) {
    console.log('Diplomas mapeados:');
    for (const s of summary) {
      console.log(`  ${s.id.padEnd(7)} ${String(s.nodes).padStart(3)} nós, profundidade ${s.depth}, ${String(s.history).padStart(2)} marcos  [${s.ramo}/${s.natureza}]  ${s.status}`);
    }
    console.log(`Relações internormativas: ${extra.relCount || 0}   Termos do glossário: ${extra.termCount || 0}`);
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
