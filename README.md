# Projeto Ariadne

Cadernos de estudo ligados por um fio: filosofia, ritos processuais e história política do Brasil.

**Site:** https://luccas-amorim.github.io/ariadne/

O Ariadne é um caderno de estudos pessoal, organizado como um labirinto. Cada sala é um caderno com personalidade visual própria, e todas compartilham a mesma identidade e o mesmo fio de navegação.

## Cadernos

| | Caderno | O que há |
|---|---|---|
| I | **Cadernos de filosofia** | Filósofos em ordem cronológica, cada um com o esquema da estrutura da obra (Hobbes, Espinosa, Hume, Rousseau, Kant, Hegel); a linha do tempo da filosofia; e o subcapítulo Filosofia do Direito |
| II | **Ritos processuais** | Mapas dos Processos: processo constitucional, penal, execução penal, civil e trabalhista, desenhados como linha do tempo, com artigos, doutrina e jurisprudência em cada etapa |
| III | **Espectros políticos do Brasil** | *Uma história das ideologias políticas no Brasil*: prólogo e doze capítulos sobre direita, esquerda e centro, de 1808 a 2026 |
| IV | *Sala livre* | Em aberto |

## Como funciona

O site é estático: HTML, CSS e JavaScript puros, sem build e sem dependências. O `ariadne.js` desenha a barra de navegação comum (o fio) em todas as páginas.

```
index.html               página inicial (a planta e o fio)
ariadne.js               barra de navegação comum
filosofia/               Caderno I
direito/                 Caderno II
historia/                Caderno III
```

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
