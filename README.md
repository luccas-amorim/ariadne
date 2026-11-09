# Projeto Ariadne

Cadernos de estudo ligados por um fio: filosofia, ritos processuais, história política do Brasil e tribunais internacionais.

**Site:** https://luccas-amorim.github.io/ariadne/

O Ariadne é um caderno de estudos pessoal, organizado como um labirinto. Cada sala é um caderno com personalidade visual própria, e todas compartilham a mesma identidade e o mesmo fio de navegação.

## Cadernos

| | Caderno | O que há |
|---|---|---|
| I | **Cadernos de filosofia** | Filósofos em ordem cronológica, cada um com o esquema da estrutura da obra (Hobbes, Espinosa, Hume, Rousseau, Kant, Hegel); a linha do tempo da filosofia; e o subcapítulo Filosofia do Direito |
| II | **Ritos processuais** | Mapas dos Processos: processo constitucional, penal, execução penal, civil e trabalhista, desenhados como linha do tempo, com artigos, doutrina e jurisprudência em cada etapa |
| III | **Espectros políticos do Brasil** | *Uma história das ideologias políticas no Brasil*: prólogo e doze capítulos sobre direita, esquerda e centro, de 1808 a 2026 |
| IV | **Tribunais internacionais** | *Atlas dos Tribunais Internacionais*: 49 cortes, tribunais e câmaras de 1899 a 2026, em mapa, quadro por família e cronologia, com instrumento de criação, mantenedor, Estados vinculados e situação atual |

## Organização do projeto

A árvore acompanha os endereços de leitura. Cada caderno reúne sua página, os dados que ela apresenta e o código que os torna interativos. O site publicado é HTML, CSS e JavaScript estático. Os arquivos HTML com nomes antigos redirecionam para as páginas atuais e preservam os links que circulam fora do site.

```text
index.html, inicio/               página inicial e seu desenho interativo
ariadne.js, ariadne.css           fio de navegação e citação, usados em todo o site
leitor.js                         navegação por capítulos de Hegel e de história
filosofia/
  dados/                          base comum de filósofos e catálogo para os mapas
  filosofo.css, filosofo.js       apresentação compartilhada de filósofos
  linha-do-tempo/, problemas/     dados, estilos e controles de cada mapa
  filosofia-do-direito/           autores, eras e temas do mapa de filosofia do direito
  hegel/                          estilos dos leitores e os livros direito/ e logica/
  kant/criticas/                  leitor e fontes das Críticas
direito/mapas-dos-processos/      mapa interativo e dados dos cinco ritos
direito/tribunais-internacionais/ atlas: fichas dos tribunais, geometria dos mapas e desenho
historia/ideologias-politicas/    leitor e fontes dos capítulos de história
ferramentas/                      geração dos livros e conferência do acervo
```

O código usado por uma página fica ao lado de seu `index.html`. As páginas que compartilham um componente usam o arquivo do diretório comum. Por exemplo, as duas linhas do tempo leem as mesmas datas e escolas de `filosofia/dados/`. Para acoplar um cabeçalho local ao fio de navegação, use no CSS a altura da barra disponível em `--af-h`.

### Onde editar

| Conteúdo | Fonte |
|---|---|
| Biografias, escolas, obras e influências das linhas do tempo | `filosofia/dados/filosofos.js` |
| Problemas, teses e relações entre posições | `filosofia/problemas/dados.js` |
| Autores, temas e bibliografia de filosofia do direito | `filosofia/filosofia-do-direito/dados.js` |
| Estações e referências de cada rito | Um arquivo por rito em `direito/mapas-dos-processos/dados/`. O arquivo `rotas.js` reúne a disposição das estações e a apresentação de cada mapa. |
| Fichas dos tribunais internacionais, sedes e novidades do ano | `direito/tribunais-internacionais/dados.js`. A geometria dos mapas e os nomes das cidades ficam em `geo.js`. |
| Livros de Hegel e de história | `fontes/capitulos/` dentro do livro. Cada `.html.in` contém um artigo com seu texto integral e seu identificador público. |
| Críticas de Kant | `filosofia/kant/criticas/fontes/caps/`, com um Markdown por capítulo. O gerador usa esses mesmos textos para montar o glossário. |

### Editar e ampliar os livros

Nos três livros com capítulos em HTML, o modelo `fontes/pagina.html.in` contém o índice, a régua de navegação e a ordem dos artigos. Para incluir uma sessão, crie o arquivo do capítulo, dê ao artigo o mesmo identificador do nome do arquivo e acrescente ao modelo a marca correspondente, por exemplo `{{capitulo:s-21}}`. Atualize os links do índice, da régua e dos capítulos vizinhos. Os identificadores já publicados também servem como endereços para citações e favoritos.

Em Kant, a ordem, os títulos e os blocos estão em `fontes/gerar.py`. Depois de editar um livro, execute estes comandos na raiz, com Python 3.11 ou superior:

```bash
python -m pip install Markdown==3.11.3
python ferramentas/livros.py
```

Inclua o `index.html` gerado e suas fontes na mesma alteração. Cada obra continua disponível inteira em sua URL, com os capítulos acessíveis por âncora. O GitHub Pages serve esses arquivos diretamente.

### Conferir a preservação do acervo

```bash
python ferramentas/livros.py --conferir
python ferramentas/acervo.py
```

O primeiro comando reconstrói os quatro livros em memória e compara o resultado com o HTML publicável. O segundo precisa de Node.js, lê as bases de dados do site, confere os caminhos locais e compara páginas, capítulos e registros com o inventário versionado em `ferramentas/acervo.tsv`. O inventário acompanha as identidades de registros e relações. A revisão de mudanças no texto, em citações e em referências bibliográficas é feita no diff das fontes editoriais.

Ao ampliar o acervo, execute `python ferramentas/acervo.py --registrar` e inclua o inventário atualizado na alteração. O comando aceita acréscimos e aponta pelo identificador qualquer registro anterior ausente. No Atlas, ele também verifica as famílias, as situações e as sedes usadas para localizar as fichas no mapa.

As duas conferências rodam em pushes e pull requests. Quando a revisão anterior já tem inventário, a comparação com ela detecta também a remoção simultânea de um registro e de sua linha no inventário. Para repetir a comparação localmente, use `python ferramentas/acervo.py --base origin/main`.

### Rodar localmente

```bash
python3 -m http.server 8000
# abra http://localhost:8000/
```

### Publicação

O GitHub Pages publica o branch `main` (raiz) a cada push.

## Aviso

Este é material de estudo. Nos mapas processuais, confira sempre a redação vigente das leis e o estado atual da jurisprudência antes de usar em peça.

## Como citar

Use o botão **"Cite this repository"** do GitHub ou o arquivo [`CITATION.cff`](CITATION.cff).

## Autor

Luccas de Amorim Rêgo Cavicchioli
- ORCID: https://orcid.org/0000-0003-1910-1541
- Lattes: http://lattes.cnpq.br/5257336387155202

## Apoie

O Ariadne é aberto, gratuito e sem anúncios. Se ele ajuda nos seus estudos, você pode apoiar pelo
[GitHub Sponsors](https://github.com/sponsors/luccas-amorim) ou por [PIX](https://luccas-amorim.github.io/apoie/).

## Licença

- Código (HTML, CSS, JS): [MIT](LICENSE)
- Textos e conteúdo de estudo: [CC BY-NC-SA 4.0](LICENSE-CONTEUDO.md)

© Luccas de Amorim Rêgo Cavicchioli
