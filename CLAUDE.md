# Ariadne: instruções para agentes

A macroestrutura da legislação brasileira em árvores interativas, publicada pelo GitHub Pages a partir de `docs/`. Leia `README.md`, `ABOUT.md` e `CONTRIBUTING.md` antes de mudar dados ou código.

## Restrições (não negociáveis)

- **Sem build e sem backend.** HTML, CSS e JS em módulos ES servidos de `docs/`. Nenhuma dependência nova no navegador além de D3 v7, Three r160 (já no `importmap`) e Tailwind CDN.
- **Scripts Node sem dependências** (Node 24, como `scripts/validate.js`). Só `@playwright/test` em devDependencies.
- **Dados são a fonte da verdade.** Tudo o que for gerado (`all.json`, `graph.jsonld`…) sai de `docs/data/*.json` por script, e o CI confere se está atualizado.
- **O modelo é único.** `TreeModel` (`docs/js/model.js`) calcula o layout uma vez; os renderizadores só desenham. Não duplique lógica de layout em renderizador.
- **A URL guarda o estado.** Cada vista e cada opção nova precisa de hash (`#/aula`, `#/grafo`, `#/tempo?a=2016&b=2026`, `#/dados`).
- **Acessibilidade e impressão** continuam funcionando: lista acessível, teclado, `aria-live`, `@media print`.
- **Temas claro e escuro.** Cores sempre pelas variáveis de `docs/css/app.css` (`--accent`, `--relation`…); toda tela nova funciona nos dois temas.
- **Licenças:** código MIT, conteúdo CC BY 4.0. Arquivos gerados herdam a licença do conteúdo e dizem isso.
- **Português** na interface, nos comentários e nas mensagens de commit, em frases curtas e sem jargão de marketing.
- **Conteúdo jurídico não se inventa.** URN, marcos (`history`), `since`/`until` e fundamentos de relação só entram com a norma citada e conferida na fonte oficial. Na dúvida, deixe de fora e registre a pendência.

## Comandos

```bash
node scripts/validate.js                      # valida docs/data/*.json
node scripts/build-graph.js                   # regenera all.json, JSON-LD, Turtle e CSV (--check só confere)
python3 -m http.server --directory docs 8080  # serve a página (no Windows: python)
npm install && npm run test:install           # uma vez
npm test                                      # testes de interface (Playwright)
```

O `playwright.config.js` sobe o servidor com `python3` na porta 8766 e reaproveita um servidor que já esteja nela fora do CI. Onde `python3` não existir, suba antes `python -m http.server --directory docs 8766 --bind 127.0.0.1`.

## Fluxo

- **Um PR por fase** do plano de evolução (v2), na ordem combinada. Cada PR roda `validate` e `npm test`, atualiza README e ROADMAP no que mudou e acrescenta testes em `tests/e2e.spec.js`.
- Atalhos de teclado já ocupados: `/` busca, setas navegam, `Enter` expande, `E`/`R` trilha, `X` relações, `F` ajusta à tela, `L` lista, `T` linha do tempo, `N`/`P` percurso, `Esc` recolhe. A tela cheia usa `Shift+F`.
