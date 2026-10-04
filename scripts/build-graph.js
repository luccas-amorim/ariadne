#!/usr/bin/env node
/**
 * Gera a camada de dados a partir de docs/data/*.json, sem dependências externas.
 *
 *   node scripts/build-graph.js           grava os arquivos
 *   node scripts/build-graph.js --check   sai com 1 se algum estiver desatualizado (CI)
 *
 * Saídas, todas em docs/data/ e sob CC BY 4.0, como o conteúdo de que derivam:
 *   all.json        catálogo, diplomas, relações, glossário e percursos numa requisição
 *   context.jsonld  contexto JSON-LD (schema.org/Legislation + vocabulário av:)
 *   graph.jsonld    o grafo em JSON-LD, com o contexto embutido
 *   vocab.ttl       o vocabulário av: (tipos de relação e espécies de divisão)
 *   graph.ttl       o grafo em Turtle; relações qualificadas por reificação simples
 *   edges.csv       relações: from,to,type,since,until,status,basis
 *   nodes.csv       nós: key,diploma,kind,label,name,subtitle,since,until,status,urn
 *
 * A serialização mora em docs/js/graphdata.js, a mesma que a interface usa.
 */
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'docs', 'data');
const readJson = f => JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), 'utf8'));

/** Os mesmos dados que docs/js/data.js → loadAll monta no navegador. */
function loadData() {
  const catalog = readJson('index.json');
  const diplomas = {}, ramos = {};
  catalog.diplomas.forEach(id => { diplomas[id] = readJson(`${id}.json`); });
  catalog.ramos.forEach(r => { ramos[r.id] = r; });
  const relations = readJson('relations.json');
  const glossary = readJson('glossary.json');
  const tours = readJson('tours.json');
  return {
    raw: { catalog, relations, glossary, tours },
    data: { catalog, diplomas, ramos, relations: relations.relations, relationTypes: catalog.relationTypes || {}, glossary: glossary.terms, tours: tours.tours }
  };
}

const json = o => JSON.stringify(o, null, 2) + '\n';
const strip = ({ $schema, ...rest }) => rest; // eslint-disable-line no-unused-vars

async function main() {
  const check = process.argv.includes('--check');
  const g = await import(pathToFileURL(path.join(ROOT, 'docs', 'js', 'graphdata.js')).href);
  const { CONTENT_LICENSE } = await import(pathToFileURL(path.join(ROOT, 'docs', 'js', 'data.js')).href);
  const { raw, data } = loadData();

  const all = {
    $schema: './schema.json#/definitions/all',
    description: 'Gerado por scripts/build-graph.js a partir dos demais arquivos desta pasta. Não edite à mão.',
    license: CONTENT_LICENSE,
    catalog: strip(raw.catalog),
    diplomas: Object.fromEntries(raw.catalog.diplomas.map(id => [id, strip(data.diplomas[id])])),
    relations: raw.relations.relations,
    glossary: raw.glossary.terms,
    tours: raw.tours.tours
  };
  const outputs = {
    'all.json': json(all),
    'context.jsonld': json(g.jsonLdContext(data)),
    'graph.jsonld': json(g.buildJsonLd(data)),
    'vocab.ttl': g.vocabTurtle(data),
    'graph.ttl': g.buildTurtle(data),
    'edges.csv': g.edgesCsv(data),
    'nodes.csv': g.nodesCsv(data)
  };

  const stale = [];
  for (const [file, content] of Object.entries(outputs)) {
    const full = path.join(DATA_DIR, file);
    const current = fs.existsSync(full) ? fs.readFileSync(full, 'utf8').replace(/\r\n/g, '\n') : null;
    if (current === content) continue;
    stale.push(file);
    if (!check) fs.writeFileSync(full, content);
  }
  if (check) {
    if (stale.length) {
      console.error(`Desatualizado(s): ${stale.join(', ')}. Rode: npm run build:data`);
      process.exit(1);
    }
    console.log(`OK — ${Object.keys(outputs).length} arquivos gerados estão em dia.`);
    return;
  }
  console.log(stale.length ? `Gravado(s): ${stale.join(', ')}` : 'Nada a gravar: tudo em dia.');
  console.log(`Nós: ${g.allKeys(data).length}   Relações: ${data.relations.length}   Antecessores: ${data.catalog.diplomas.reduce((a, id) => a + (data.diplomas[id].predecessors || []).length, 0)}`);
}

main().catch(e => { console.error(e); process.exit(1); });
