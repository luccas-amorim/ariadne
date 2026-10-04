// Vista Dados: o grafo como recurso para pesquisa e legal tech. Os formatos para baixar,
// a identidade de um nó (chave, URN, IRI) com uma relação em Turtle, e possibilidades de uso.
//   #/dados?no=lep/titulo-v
import { esc, iriOf, urnOf, keyLabel, dataNodeOf, CONTENT_LICENSE } from './data.js';
import { relationTurtle, allKeys } from './graphdata.js';

const FORMATS = [
    ['data/<id>.json', null, 'Um diploma por arquivo, com metadados, URN e a árvore de divisões. É a fonte da verdade, editada e revisada à mão.', 'fonte'],
    ['data/relations.json', 'data/relations.json', 'Relações internormativas, com tipo, nota, fundamento e vigência.', 'fonte'],
    ['data/all.json', 'data/all.json', 'Catálogo, diplomas, relações, glossário e percursos numa só requisição.', 'gerado'],
    ['data/graph.jsonld', 'data/graph.jsonld', 'O grafo em JSON-LD, com schema.org/Legislation, isPartOf para a hierarquia, sameAs para a URN e o vocabulário av: para as relações. Contexto também em data/context.jsonld.', 'gerado'],
    ['data/graph.ttl', 'data/graph.ttl', 'RDF/Turtle para SPARQL e para cruzar com o LexML. Cada relação aparece como tripla direta e como nó av:Relacao, com nota, fundamento e vigência.', 'gerado'],
    ['data/vocab.ttl', 'data/vocab.ttl', 'O vocabulário av:, com rótulo e descrição de cada tipo de relação.', 'gerado'],
    ['data/edges.csv', 'data/edges.csv', 'from, to, type, since, until, status, basis. Abre no R, no pandas ou no Gephi.', 'gerado'],
    ['data/nodes.csv', 'data/nodes.csv', 'key, diploma, kind, label, name, subtitle, since, until, status, urn.', 'gerado'],
    ['data/schema.json', 'data/schema.json', 'JSON Schema de todos os formatos, inclusive dos gerados.', 'fonte'],
    ['data/graph-AAAA.json', null, 'Retrato do grafo em cada ano, para análise longitudinal.', 'proposta']
];

const POSSIBILITIES = [
    ['GraphRAG jurídico', 'pesquisa', 'Um assistente recupera o nó e sobe ou desce pelas arestas tipadas antes de responder. Assim sabe que a LEP executa o Título V do CP.', 'vizinhos(cp/parte-geral/titulo-v, tipo=executa)'],
    ['Servidor MCP', 'legal tech', 'Ferramentas para agentes que leem os mesmos arquivos estáticos, sem backend próprio.', 'estrutura(diploma, ano) · relacoes(no) · buscar(termo)'],
    ['Embeddings de nós', 'pesquisa', 'Síntese mais posição no grafo para cada nó, para achar divisões análogas entre diplomas.', 'síntese ⊕ caminho'],
    ['Validação de citações', 'legal tech', 'Conferir se "art. X do CDC" está no Capítulo que o texto afirma e se estava vigente na data citada.', 'urn → isPartOf → vigência']
];

export class DataView {
    constructor({ data, els }) {
        Object.assign(this, { data, els });
    }
    apply(view, query) {
        const no = query.get('no');
        this.key = no && dataNodeOf(this.data, no) ? no : 'lep/titulo-v';
        this.render();
    }
    destroy() { this.els.root.innerHTML = ''; }
    setPalette() { /* só CSS */ }
    fit() { /* nada a enquadrar */ }
    clearSelection() { /* sem seleção */ }

    render() {
        const data = this.data, key = this.key;
        const nKeys = allKeys(data).length;
        const nPred = Object.values(data.diplomas).reduce((a, d) => a + (d.predecessors || []).length, 0);
        const urn = urnOf(data, key);
        const rel = data.relations.find(r => r.from === key) || data.relations.find(r => r.to === key) || data.relations[0];
        const badge = st => `<span class="data-badge ${st}">${st}</span>`;
        const formats = FORMATS.map(([file, href, desc, st]) => `
            <div class="data-card">
                <div class="data-card-head">${href ? `<a href="${href}" target="_blank" rel="noopener"><code>${esc(file)}</code></a>` : `<code>${esc(file)}</code>`}${badge(st)}</div>
                <p>${esc(desc)}</p>
            </div>`).join('');
        const possib = POSSIBILITIES.map(([t, who, d, c]) => `
            <div class="data-card">
                <div class="data-card-head"><b class="strong">${esc(t)}</b><span class="data-who">${esc(who)}</span></div>
                <p>${esc(d)}</p>
                <code class="data-sig">${esc(c)}</code>
            </div>`).join('');
        this.els.root.innerHTML = `
            <div class="data-intro">
                <h2 class="g-title">O grafo como dado aberto</h2>
                <p class="g-sub">${nKeys} nós, ${data.relations.length} relações e ${nPred} antecessores, em arquivos estáticos gerados a partir dos JSON curados (<code>scripts/build-graph.js</code>, conferido no CI). Conteúdo sob <a href="${CONTENT_LICENSE}" target="_blank" rel="noopener">CC BY 4.0</a>; cite o Ariadne.</p>
            </div>
            <div class="data-cols">
                <section class="data-col" aria-labelledby="dados-formatos">
                    <div class="g-head" id="dados-formatos">Baixar o grafo</div>
                    ${formats}
                </section>
                <section class="data-col" aria-labelledby="dados-identidade">
                    <div class="g-head" id="dados-identidade">Identidade de um nó</div>
                    <dl class="kv data-card">
                        <dt>chave</dt><dd><code>${esc(key)}</code></dd>
                        <dt>nó</dt><dd>${esc(keyLabel(data, key))}</dd>
                        <dt>URN LexML</dt><dd><code>${urn ? esc(urn.urn) : '—'}</code>${urn && key.includes('/') && !urn.fragment ? '<div class="muted text-xs">URN do diploma; o fragmento da divisão ainda não foi conferido.</div>' : ''}</dd>
                        <dt>IRI</dt><dd><code>${esc(iriOf(key))}</code></dd>
                    </dl>
                    <div class="g-head">Uma relação em Turtle</div>
                    <pre class="code-block" id="dados-ttl">${esc(relationTurtle(data, rel))}</pre>
                    <p class="g-caption">Os ${Object.keys(data.relationTypes).length} tipos de <code>relationTypes</code> são propriedades de um vocabulário publicado (<a href="data/vocab.ttl" target="_blank" rel="noopener"><code>av:</code></a>), cada uma com a descrição do <code>index.json</code>. A aba Dados do painel mostra isto para qualquer nó e baixa o subgrafo dele.</p>
                </section>
                <section class="data-col" aria-labelledby="dados-possib">
                    <div class="g-head" id="dados-possib">Possibilidades <span class="data-badge proposta">proposta</span></div>
                    ${possib}
                    <p class="g-caption">Proposta, não funcionalidade: quem fornece a inteligência é a curadoria. Arestas tipadas, com fundamento e vigência, são o que falta aos sistemas de busca jurídica.</p>
                </section>
            </div>`;
    }
}
