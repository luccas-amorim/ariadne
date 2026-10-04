# Ariadne — Árvores Jurídicas BR 🧵⚖️

<sub>O nome vem de Ariadne. [Por quê?](MITO.md)</sub>

A macroestrutura da legislação brasileira em uma única árvore interativa, em duas ou três dimensões. A Constituição ocupa o centro; dela derivam os ramos do Direito, de cada ramo os diplomas, e de cada diploma seus Livros, Títulos e Capítulos.

**Acesse:** [luccas-amorim.github.io/ariadne](https://luccas-amorim.github.io/ariadne/)

## O que é

Textos legais são longos e lineares. Este projeto mostra apenas a **estrutura** deles (Partes, Livros, Títulos e Capítulos), com uma síntese didática de cada divisão, para que se entenda onde um instituto se encontra dentro do todo da lei.

Não reproduzimos artigos. Por isso o mapa envelhece devagar: a estrutura de um código raramente muda, e o projeto só precisa crescer quando surge um diploma novo. Quando a estrutura muda, registramos o marco (a emenda ou lei que incluiu, renomeou ou revogou a divisão).

## Diplomas mapeados

| Ramo | Critério | Diplomas | Em mapeamento |
|---|---|---|---|
| **Constitucional** | Fundação do ordenamento | CF/88 | |
| **Direito Privado** | Relações entre particulares em igualdade formal | Código Civil, Código de Processo Civil | LINDB, Lei 9.099 |
| **Direito Público** | Relação Estado ↔ particular | CTN, Lei 14.133, Lei 9.784 | Lei 8.112, Lei 8.429 |
| **Direito Social** | Instituições vs. pessoas; o Estado intervém pelo equilíbrio | CLT, CDC, ECA | LGPD |
| **Direito Penal** | O *jus puniendi* | Código Penal, Código de Processo Penal, LEP | Lei 11.340, Lei 11.343 |

Os códigos de processo são ramos autônomos, mas nascem **colaterais** ao ramo material que conformam, por serem direito formal (borda tracejada). A classificação é assumidamente didática; escolhas discutíveis trazem uma nota no próprio arquivo de dados. Leia mais em [ABOUT.md](ABOUT.md).

Diplomas marcados como **rascunho** tiveram a estrutura mapeada, mas ainda não conferida contra o texto oficial por um segundo revisor. O painel avisa quando é o caso.

## Como usar

* **Mapa.** Clique em um ramo para ler sua definição e em um diploma para abrir suas Partes e Livros ali mesmo, conectadas ao resto. O número no canto do nó indica quantas divisões estão recolhidas.
* **Painel do nó.** Fica à direita em telas largas e, no celular, numa folha que se expande até quase a tela toda. Tem quatro abas: **Síntese**; **Relações**, separando o que o nó recebe do que ele emite, cada cartão com o fundamento e um link para o outro nó; **Histórico**, com promulgação e marcos estruturais (clicar num ano abre a linha do tempo naquela data); e **Dados**, com chave, URN, IRI, vigência e o JSON-LD do nó, mais os botões "Copiar JSON-LD" e "Citar (ABNT)". A aba aberta fica na URL (`aba=relacoes`).
* **2D ou 3D.** O mesmo grafo, com o mesmo layout radial. No 3D cada camada sobe um nível; arraste para orbitar, role para aproximar.
* **Expandir tudo.** Abre, nível a nível e de forma animada, todas as divisões a partir do nó selecionado. "Recolher" ou `Esc` volta ao início.
* **Foco em um diploma.** Radial especializado, com o diploma no centro. **Comparar** põe dois diplomas lado a lado, cada um em seu radial.
* **Diplomas.** Filtra quais códigos entram na árvore (todos, por padrão) e mostra ou oculta os em mapeamento.
* **Vigência.** Um controle por ano (botão "Vigência" ou `T`) mostra a árvore como era em cada data: os diplomas surgem no ano de promulgação, antes disso aparece o antecessor como fantasma (CC/1916, CPC/1973, Constituições de 1824 a 1967), e as divisões incluídas depois só aparecem no seu ano. O foco num diploma também obedece ao ano. O botão ▶ reproduz a história, parando em cada ano com evento, em 0,5×, 1× ou 2×.
* **Linha do tempo.** No cabeçalho, uma faixa por diploma, com os antecessores pontilhados e os marcos estruturais como pontos. A janela A → B (arraste as bordas ou digite os anos) gera o diff estrutural: o que foi incluído, alterado e revogado ou substituído entre os dois anos, cada item levando ao nó. Clicar no nome de uma faixa mostra a genealogia do diploma (CPC/1939 → CPC/1973 → CPC/2015); clicar na faixa abre a árvore daquele diploma no ano A.
* **Percursos guiados.** Sequências curadas de nós com uma frase de transição: uma compra defeituosa, do crime à execução da pena, uma demissão, um tributo, uma obra pública, a criança entre a família e o Estado. A câmera viaja e o painel acompanha. `N` e `P` avançam e voltam.
* **Relações internormativas.** Linhas roxas ligam o nó selecionado ao que ele concretiza, regulamenta, processa ou executa em outro diploma. A seta aponta para o destino: quem é concretizado, regulamentado, processado. Na linha do tempo, uma relação só aparece nos anos em que os dois nós (e a própria relação, se tiver `since`/`until`) vigoram. Quando o destino está recolhido, a linha termina tracejada no nó visível mais próximo; o painel lista cada relação com o dispositivo que a fundamenta e leva à divisão exata. O botão "Relações" (ou `X`) liga e desliga as linhas.
* **Grafo.** No cabeçalho, "Grafo" troca a árvore pelas relações: cada diploma é um círculo (tamanho pelo número de relações), cada par ligado é uma aresta com seta (espessura pela contagem). A posição segue a ordem dos ramos, sempre a mesma. Ao lado, o filtro por tipo e a matriz origem × destino; clicar numa célula lista as relações daquele par. "Por divisão" mostra as divisões que têm relação.
* **Modo aula.** Uma vista limpa para projetar: a Constituição, os ramos e todos os diplomas, com todas as relações cruzadas ao mesmo tempo. Uma chave liga e desliga as relações, e os botões no rodapé do palco filtram por tipo (só "processa", por exemplo). Clicar num diploma isola as relações dele e lista cada uma, com o fundamento, no rodapé. Funciona em 2D e em 3D; no 3D as relações viram arcos acima das camadas e a cena gira devagar até o primeiro toque.
* **Tela cheia.** O botão "Tela cheia" (ou `Shift+F`) projeta a árvore, ou o palco inteiro no Modo aula. Onde o navegador não permite, a página ocupa a janela toda; `Esc` sai.
* **Trackpad e mouse.** No 2D, dois dedos movem a tela e a pinça aproxima; a roda do mouse continua aproximando. No 3D, arraste orbita e a roda aproxima.
* **Estudo.** Perguntas de múltipla escolha geradas da estrutura selecionada: síntese → divisão, divisão → diploma, divisão → faixa de artigos. Errou? O nó entra na sua trilha como "revisar". Dá para ocultar os rótulos da árvore durante o estudo.
* **Trilha pessoal.** Marque divisões como estudadas ou para revisar; o progresso aparece por diploma. Fica só no seu navegador e pode ser exportada e importada em JSON.
* **Glossário.** Termos recorrentes das sínteses ganham definição ao passar o mouse.
* **Exportar.** SVG ou PNG do que está na tela, com título e licença; impressão limpa.
* **Lista.** A árvore inteira em lista navegável por teclado e leitor de tela.
* **Teclado.** `/` busca, `←↑↓→` navegam, `Enter` expande, `E` e `R` marcam a trilha, `X` alterna as relações, `F` ajusta à tela, `Shift+F` tela cheia, `L` abre a lista, `Esc` recolhe.
* **Identificadores.** Cada diploma tem sua URN LexML e cada nó um endereço estável, `https://luccas-amorim.github.io/ariadne/id/<chave>`. Colar uma URN ou um desses endereços na busca leva direto ao nó.
* **Links diretos.** A URL guarda nó, foco, filtro, ano e dimensão: `#/cc/parte-especial/livro-i`, `#/cc?foco=cc`, `#/?d=cc,cp&m=3d`, `#/?ano=1975`, `#/compare?a=cc&b=cpc`, `#/aula?m=3d&tipos=processa,executa&sel=cp`, `#/cf/titulo-ii/cap-i?aba=relacoes`, `#/grafo?sel=cp&par=cpc,cc`, `#/grafo?por=divisao`, `#/tempo?a=2016&b=2026&g=cpc`.

Para rodar localmente, sirva a pasta `docs/` por HTTP (abrir o arquivo direto bloqueia os módulos e os dados):

```bash
python3 -m http.server --directory docs 8080
```

## Dados abertos

Os dados são JSON estáticos servidos junto com a página e podem ser consumidos por outros sites e scripts:

| Arquivo | Conteúdo |
|---|---|
| `data/index.json` | Catálogo: ramos, diplomas mapeados, roadmap e tipos de relação |
| `data/<id>.json` | Um diploma: metadados, status e a árvore de divisões com sínteses e marcos |
| `data/relations.json` | Relações internormativas entre divisões de diplomas distintos |
| `data/glossary.json` | Termos e definições |
| `data/tours.json` | Percursos guiados: sequências de nós com texto de transição |
| `data/schema.json` | JSON Schema de todos os formatos |
| `data/all.json` | Gerado: catálogo, diplomas, relações, glossário e percursos numa requisição |
| `data/graph.jsonld` | Gerado: o grafo em JSON-LD (schema.org/Legislation, `isPartOf`, `sameAs` para a URN, vocabulário `av:`); contexto em `data/context.jsonld` |
| `data/graph.ttl` | Gerado: o grafo em Turtle; cada relação como tripla direta e como nó `av:Relacao` com nota, fundamento e vigência |
| `data/vocab.ttl` | Gerado: o vocabulário `av:`, com os tipos de relação e as espécies de divisão |
| `data/edges.csv` | Gerado: `from,to,type,since,until,status,basis` |
| `data/nodes.csv` | Gerado: `key,diploma,kind,label,name,subtitle,since,until,status,urn` |

Cada diploma traz a URN LexML (`urn`), conferida no resolvedor do LexML. Cada nó tem o IRI `https://luccas-amorim.github.io/ariadne/id/<chave>` (ex.: `…/id/cc/parte-geral/livro-i`), que abre o nó na árvore. Fragmentos de URN por divisão (`lexml`) só entram quando conferidos; sem eles, a divisão usa a URN do diploma.

Os arquivos gerados saem de `scripts/build-graph.js`, a partir dos JSON curados, e o CI confere se estão em dia; herdam a licença CC BY 4.0, que vem declarada no JSON-LD e no cabeçalho do Turtle. Os antecessores (CC/1916, CPC/1973…) entram no JSON-LD e no Turtle como nós ligados pela relação `sucede`; os CSV trazem só os nós e as relações curados. A vista **Dados** (no cabeçalho) resume tudo isso, e a aba Dados do painel baixa o subgrafo de qualquer nó em Turtle.

URL base: `https://luccas-amorim.github.io/ariadne/data/`. Licença do conteúdo: CC BY 4.0 (veja abaixo). O GitHub Pages responde com CORS liberado para leitura.

## Arquitetura

Tudo roda no navegador, sem build e sem backend. Dados, modelo e renderizadores são separados:

```
docs/
  index.html            casca da aplicação
  css/app.css           tema claro/escuro, impressão
  js/
    data.js             carga, busca, glossário
    model.js            árvore, visão (foco/filtro), layout radial, URL, relações
    radial2d.js         renderizador SVG (D3)
    tree3d.js           renderizador WebGL (Three.js, carregado sob demanda)
    features.js         trilha, tema, exportação, lista acessível
    study.js            modo estudo
    aula.js             Modo aula (todas as relações, filtro por tipo, isolamento)
    graph.js            vista Grafo (D3): nós por diploma ou divisão, matriz origem × destino
    timeline.js         vista Linha do tempo: faixas, janela A → B, diff e genealogia
    dataview.js         vista Dados: formatos, identidade de um nó, possibilidades
    graphdata.js        JSON-LD, Turtle e CSV (os mesmos no navegador e no script)
    app.js              roteamento, painel, controles, comparação, tela cheia, teclado
  data/                 ver "Dados abertos"
scripts/validate.js     validação dos dados (node, sem dependências)
scripts/build-graph.js  gera all.json, JSON-LD, Turtle e CSV (node, sem dependências)
tests/e2e.spec.js       testes de interface (Playwright)
.github/workflows/      validação dos dados e testes a cada PR
```

O modelo calcula ângulos e raios uma vez; o 2D desenha em SVG e o 3D eleva cada camada no eixo vertical. Qualquer renderizador novo recebe a mesma hierarquia.

## Validação e testes

Requer Node 24 ou superior.

```bash
node scripts/validate.js        # dados: campos, ids, relações, glossário, percursos
npm run build:data              # regenera os arquivos gerados de docs/data/ (--check só confere)
npm install && npm run test:install
npm test                        # interface: abrir, expandir, focar, buscar, comparar, estudar, linha do tempo, percursos, 3D
```

Os dois workflows em `.github/workflows/` rodam o mesmo a cada push e pull request. Atenção ao publicar pela interface web do GitHub: o upload de pasta ignora arquivos e pastas iniciados por ponto (`.github/`, `.gitignore`); crie-os pelo botão "Add file → Create new file" informando o caminho completo, ou use `git push`.

## Roadmap

O conjunto de funções está completo; o trabalho pendente é sobretudo conteúdo e revisão. A fila detalhada, por prioridade, está em [ROADMAP.md](ROADMAP.md):

1. Revisar os sete diplomas em rascunho e os seis percursos.
2. Mapear os diplomas em roadmap (LINDB, Lei 9.099, Lei 8.429, Lei 8.112, LGPD, Lei 11.340, Lei 11.343).
3. Ampliar relações internormativas, marcos da linha do tempo e glossário.
4. Melhorias de interface e infraestrutura listadas lá.

## Tecnologias

* HTML, CSS e JavaScript (módulos ES) sem framework e sem etapa de build
* [D3.js v7](https://d3js.org/) para o layout e o SVG
* [Three.js](https://threejs.org/) r160 para o 3D, via CDN com `importmap`
* [Tailwind CSS](https://tailwindcss.com/) via CDN para utilitários de layout
* [Playwright](https://playwright.dev/) para os testes de interface

## Contribuindo

Leia o [CONTRIBUTING.md](CONTRIBUTING.md): formato dos dados, estilo das sínteses, revisão por pares e validação. O template de pull request traz o checklist de conteúdo.

## Créditos e inspiração

A ideia de explorar textos densos em árvores interativas vem da [Tractatus' Tree](https://pbellon.github.io/tractatus-tree/#/), de pbellon. Os textos legais são obtidos nas versões compiladas do [Planalto](https://www.planalto.gov.br/ccivil_03/).

## Licença

* **Código** (HTML, CSS, JavaScript, scripts, testes): [MIT](LICENSE.md).
* **Conteúdo** (estrutura, sínteses, relações, glossário e marcos em `docs/data/`): [Creative Commons Atribuição 4.0 Internacional (CC BY 4.0)](LICENSE-CONTENT.md).

Os textos das leis em si são de domínio público (Lei 9.610/1998, art. 8º, IV). As licenças acima incidem sobre o código e sobre o conteúdo autoral, não sobre a legislação.
