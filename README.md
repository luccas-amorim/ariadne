# Árvores Jurídicas BR 🌳⚖️

A macroestrutura da legislação brasileira em árvores interativas. A Constituição ocupa o centro do mapa; dela derivam os ramos do Direito e, de cada ramo, os diplomas que o conformam.

**Acesse:** [luccas-amorim.github.io/lex-tree-br](https://luccas-amorim.github.io/lex-tree-br/)

## O que é

Textos legais são longos e lineares. Este projeto mostra apenas a **estrutura** deles (Partes, Livros, Títulos e Capítulos), com uma síntese didática de cada divisão, para que se entenda onde um instituto se encontra dentro do todo da lei.

Não reproduzimos artigos. Por isso o mapa envelhece devagar: a estrutura de um código raramente muda, e o projeto só precisa crescer quando surge um diploma novo.

## O mapa do ordenamento

A tela inicial é um mapa radial com a **Constituição Federal** ao centro e quatro ramos ao redor. A divisão é assumidamente didática:

| Ramo | Critério | Diplomas mapeados | No roadmap |
|---|---|---|---|
| **Direito Privado** | Relações entre particulares em igualdade formal | Código Civil, Código de Processo Civil | |
| **Direito Público** | Relação Estado ↔ particular (administrativo, tributário) | | CTN, Lei 14.133, Lei 9.784 |
| **Direito Social** | Instituições vs. pessoas; o Estado intervém pelo equilíbrio | | CLT, CDC, ECA |
| **Direito Penal** | O *jus puniendi* | Código Penal, Código de Processo Penal | LEP |

Os códigos de processo são ramos autônomos, mas nascem **colaterais** ao ramo material que conformam, por serem direito formal. No mapa aparecem com borda tracejada; os diplomas ainda não mapeados aparecem esmaecidos.

A classificação de alguns diplomas é discutível (o CDC, por exemplo, é posto por parte da doutrina no Direito Privado). Quando for o caso, o próprio arquivo de dados traz uma nota explicando a escolha. Leia mais em [ABOUT.md](ABOUT.md).

## Como usar

* **Mapa:** clique na Constituição ou em um diploma para abrir sua árvore; clique em um ramo para ler sua definição.
* **Árvore:** clique nos nós para expandir ou recolher. O painel inferior mostra a síntese e o link para o texto oficial no Planalto.
* **Busca:** digite `/` ou clique no campo de busca para localizar qualquer Título ou Capítulo em todos os diplomas.
* **Links diretos:** cada nó tem URL própria, por exemplo `#/cc/parte-especial/livro-i`. Use "Copiar link deste nó".
* **Teclado:** `Esc` volta ao mapa.

Para rodar localmente, sirva a pasta `docs/` por HTTP (abrir o arquivo direto bloqueia o carregamento dos dados):

```bash
python3 -m http.server --directory docs 8080
```

## Arquitetura

Tudo roda no navegador, sem build e sem backend. Dados e código são separados:

```
docs/
  index.html          aplicação (D3.js + Tailwind via CDN)
  data/
    index.json        catálogo: ramos, diplomas mapeados e roadmap
    schema.json       JSON Schema do formato
    cf.json  cc.json  cpc.json  cp.json  cpp.json
scripts/
  validate.js         validação dos dados (node, sem dependências)
.github/workflows/
  validate.yml        roda a validação a cada push/PR que toque em docs/data
```

Cada diploma é um arquivo JSON com metadados (norma, ramo, natureza material ou processual, fonte oficial) e uma árvore de nós `{ id, name, label, subtitle, content, children }`. Mapear um código novo é escrever um arquivo desses e listá-lo no catálogo. O guia completo está em [CONTRIBUTING.md](CONTRIBUTING.md).

## Roadmap

* **Novos diplomas**, na ordem do catálogo: CLT, CDC, ECA, CTN, Lei de Licitações, Lei do Processo Administrativo, LEP.
* **Relações internormativas:** ligações visuais entre divisões de diplomas distintos (por exemplo, como um instituto do Código Civil é processado no CPC). Quando houver esse grafo, uma visualização 3D ou em força passa a fazer sentido; antes disso, não.
* **Layout radial opcional** também para as árvores dos diplomas.
* **Navegação por teclado** entre nós.

## Tecnologias

* HTML, CSS e JavaScript sem framework
* [D3.js v7](https://d3js.org/) para o layout e a animação das árvores
* [Tailwind CSS](https://tailwindcss.com/) via CDN para a interface

## Contribuindo

Contribuições são bem-vindas, em especial o mapeamento de diplomas do roadmap. Leia o [CONTRIBUTING.md](CONTRIBUTING.md): ele descreve o formato dos dados, o estilo das sínteses e como validar antes de abrir o PR.

## Créditos e inspiração

A ideia de explorar textos densos em árvores interativas vem da [Tractatus' Tree](https://pbellon.github.io/tractatus-tree/#/), de pbellon. Os textos legais são obtidos nas versões compiladas do [Planalto](https://www.planalto.gov.br/ccivil_03/).

## Licença

* **Código** (HTML, JavaScript, scripts): [MIT](LICENSE.md).
* **Conteúdo** (estrutura e sínteses em `docs/data/`): [Creative Commons Atribuição 4.0 Internacional (CC BY 4.0)](LICENSE-CONTENT.md).

Os textos das leis em si são de domínio público (Lei 9.610/1998, art. 8º, IV). As licenças acima incidem sobre o código e sobre as sínteses autorais, não sobre a legislação.
