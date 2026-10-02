#!/usr/bin/env node
/**
 * Valida docs/data/*.json sem dependências externas.
 *
 *   node scripts/validate.js
 *
 * Verifica: campos obrigatórios, tipos, ids em kebab-case e únicos entre
 * irmãos, ramo/natureza válidos, coerência entre catálogo e arquivos,
 * fonte oficial em https e ausência de colisão entre mapeados e planejados.
 * Sai com código 1 se houver qualquer erro.
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'docs', 'data');
const ID_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const NATUREZAS = new Set(['material', 'processual']);

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
  if (meta.id && !ID_RE.test(meta.id)) err(file, `id fora do padrão kebab-case: ${meta.id}`);
  if (meta.shortTitle && meta.shortTitle.length > 14) err(file, `shortTitle com mais de 14 caracteres: ${meta.shortTitle}`);
  if (meta.ramo && !ramos.has(meta.ramo)) err(file, `ramo desconhecido: ${meta.ramo}`);
  if (meta.natureza && !NATUREZAS.has(meta.natureza)) err(file, `natureza desconhecida: ${meta.natureza}`);
  if (meta.source && !/^https:\/\//.test(meta.source)) err(file, `source deve ser URL https: ${meta.source}`);
  if (meta.source && !/planalto\.gov\.br/.test(meta.source)) warn(file, `source fora do Planalto: ${meta.source}`);
  if (requireYear && typeof meta.year !== 'number') warn(file, 'campo year ausente');
}

function checkNode(file, node, trail, stats) {
  const where = trail.join('/') || '(raiz)';
  stats.nodes++;
  stats.depth = Math.max(stats.depth, trail.length);
  for (const k of ['id', 'name', 'label', 'subtitle', 'content']) {
    if (typeof node[k] !== 'string' || !node[k].trim()) err(file, `${where}: campo obrigatório ausente ou vazio: ${k}`);
  }
  const allowed = new Set(['id', 'name', 'label', 'subtitle', 'content', 'children']);
  for (const k of Object.keys(node)) {
    if (!allowed.has(k)) err(file, `${where}: campo não previsto no schema: ${k}`);
  }
  if (node.id && !ID_RE.test(node.id)) err(file, `${where}: id fora do padrão kebab-case: ${node.id}`);
  if (node.label && node.label.length > 28) err(file, `${where}: label com mais de 28 caracteres: "${node.label}"`);
  if (node.content && node.content.length < 20) err(file, `${where}: content curto demais (mínimo 20 caracteres)`);
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
        checkNode(file, child, [...trail, child.id || '?'], stats);
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

  const summary = [];
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
    const stats = { nodes: 0, depth: 0 };
    checkNode(file, doc.root, [], stats);
    summary.push({ id, nodes: stats.nodes, depth: stats.depth, ramo: doc.ramo, natureza: doc.natureza });
  }

  // Arquivos órfãos: existem na pasta mas não estão no catálogo.
  for (const f of fs.readdirSync(DATA_DIR)) {
    if (!f.endsWith('.json') || f === 'index.json' || f === 'schema.json') continue;
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

  finish(summary);
}

function finish(summary = []) {
  if (summary.length) {
    console.log('Diplomas mapeados:');
    for (const s of summary) {
      console.log(`  ${s.id.padEnd(5)} ${String(s.nodes).padStart(3)} nós, profundidade ${s.depth}  [${s.ramo}/${s.natureza}]`);
    }
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
