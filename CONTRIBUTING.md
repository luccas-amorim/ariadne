# Como contribuir

A contribuição mais valiosa é **mapear ou revisar um diploma**. Isso não exige programar: é escrever ou conferir um arquivo JSON.

## 1. Escolha o que fazer

* **Revisar um rascunho.** Diplomas com `"status": "rascunho"` precisam de conferência contra o texto oficial. Hoje: CLT, CDC, ECA, CTN, Lei 14.133, Lei 9.784 e LEP.
* **Mapear um diploma do roadmap** (`planned` em `docs/data/index.json`).
* **Acrescentar relações internormativas, termos do glossário ou marcos estruturais.**
* Para propor um diploma fora do roadmap, abra uma issue antes, dizendo em qual ramo ele entraria e por quê.

## 2. Formato de um diploma: `docs/data/<id>.json`

```json
{
  "$schema": "./schema.json#/definitions/diploma",
  "id": "clt",
  "title": "Consolidação das Leis do Trabalho",
  "shortTitle": "CLT",
  "norm": "Decreto-Lei nº 5.452, de 1º de maio de 1943",
  "urn": "urn:lex:br:federal:decreto.lei:1943-05-01;5452",
  "ramo": "social",
  "natureza": "material",
  "status": "rascunho",
  "source": "https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm",
  "year": 1943,
  "note": "Observação sobre a classificação, se for discutível.",
  "root": {
    "id": "clt",
    "name": "Consolidação das Leis do Trabalho",
    "label": "CLT",
    "subtitle": "Raiz",
    "content": "Síntese do diploma em uma a três frases.",
    "children": [
      {
        "id": "titulo-ii",
        "name": "Título II - Das Normas Gerais de Tutela do Trabalho",
        "label": "Título II",
        "subtitle": "Arts. 13 a 223",
        "content": "O que este Título regula, em linguagem didática.",
        "history": [{ "year": 2017, "norm": "Lei 13.467/2017", "note": "Inclusão do Capítulo II-A, sobre teletrabalho." }],
        "children": [ { "id": "cap-i", "name": "Capítulo I - ...", "label": "Cap. I", "subtitle": "Arts. 13 a 56", "content": "..." } ]
      }
    ]
  }
}
```

Campos de cada nó:

| Campo | O que é | Exemplo |
|---|---|---|
| `id` | kebab-case, único entre irmãos; vira parte da URL | `titulo-ii`, `livro-i`, `cap-ii-a` |
| `name` | nome completo da divisão | `Título II - Dos Direitos e Garantias Fundamentais` |
| `label` | rótulo curto do nó (até 28 caracteres) | `Título II` |
| `subtitle` | faixa de artigos | `Arts. 5º a 17` |
| `content` | síntese didática (mínimo 20 caracteres) | ver estilo abaixo |
| `history` | opcional: marcos estruturais `{year, norm, note}` | inclusão, renomeação, revogação |
| `since` / `until` | opcional: ano em que a divisão passou ou deixou de existir; a linha do tempo obedece | `2017` |
| `revoked` | opcional: `true` se a divisão inteira foi revogada | |
| `lexml` | opcional: fragmento LexML da divisão, só se conferido no texto marcado do LexML | `art5` |
| `children` | filhos; omita o campo se não houver | |

No cabeçalho do diploma, `predecessors` lista os diplomas que ocuparam o mesmo lugar antes dele, com `title`, `shortTitle`, `norm`, `from` e `to`. A linha do tempo os mostra como fantasmas nos anos em que vigeram.

No cabeçalho, `urn` é a URN LexML do diploma. Confira antes de enviar: `https://www.lexml.gov.br/urn/<urn>` precisa abrir o diploma certo (uma URN inexistente mostra "urn não encontrada"). O validador avisa quando falta e confere se a data da URN bate com `year`.

`ramo` aceita `constitucional`, `privado`, `publico`, `social`, `penal`. `natureza` aceita `material` ou `processual`. `status` começa em `rascunho`.

O JSON Schema completo está em `docs/data/schema.json`; com a linha `$schema` no topo, editores como o VS Code validam enquanto você digita.

## 3. Profundidade e granularidade

* Vá até **Títulos e Capítulos**. Seções, Subseções e artigos não entram.
* Divisões acrescidas por letra (Título IV-A, Capítulo II-A) são nós próprios.
* Quando um Título tiver Capítulos demais, agrupe os de menor relevância em um nó (`Capítulos IV a VIII - Diversos`), dizendo isso no PR.
* Um nó sem `children` é uma folha. Um nó com `children` tem pelo menos um filho.
* Se não tiver certeza da numeração de um Capítulo, não invente: use um `label` descritivo sem numeral e deixe o `status` em rascunho.

## 4. Estilo das sínteses

* Uma a três frases, em português claro, sem copiar a ementa.
* Diga **o que a divisão regula** e cite os institutos principais.
* Sem opinião e sem jurisprudência: a árvore é um mapa, não um comentário.
* Use a versão **compilada** do Planalto como fonte.
* Termos do glossário são destacados automaticamente; se usar um termo técnico recorrente que ainda não está em `glossary.json`, considere acrescentá-lo.

## 5. Relações internormativas: `docs/data/relations.json`

Cada relação liga duas divisões de **diplomas distintos**:

```json
{ "from": "lep/titulo-v", "to": "cp/parte-geral/titulo-v", "type": "executa", "note": "A LEP executa as penas cominadas segundo o Título V do Código Penal." }
```

* `from` e `to` são chaves `diploma/divisao/subdivisao`, exatamente como aparecem na URL.
* `type` é uma chave de `relationTypes` em `index.json` (concretiza, regulamenta, processa, executa, subsidiario, excepciona, insere, organiza). Para propor um tipo novo, defina-o lá com descrição.
* `note` cita o dispositivo que fundamenta a relação. Sem fundamento, sem relação.

## 5-A. Percursos guiados: `docs/data/tours.json`

Um percurso é uma sequência de 5 a 10 passos, cada um com uma `key` (como nas relações) e um `text` de uma a três frases que explica por que se vai daquele nó ao próximo. Escreva como quem conduz uma aula: o texto do passo fala do nó em que se está e prepara o seguinte. Percursos novos entram com `"status": "rascunho"` e seguem a mesma revisão por pares dos diplomas.

## 6. Revisão por pares

Mudanças em `docs/data/` seguem o checklist do template de pull request: fonte, estrutura conferida, faixas sem lacunas, sínteses no estilo, classificação justificada, validação passando. Um diploma só sai de `rascunho` para `revisado` quando um segundo revisor confirmar a estrutura no PR, item a item, e disser isso no comentário.

## 7. Valide e teste

```bash
node scripts/validate.js
```

O script verifica campos, ids, ramos, status, relações apontando para nós existentes e glossário, e roda no CI a cada pull request. Depois, abra a página localmente e confira a árvore:

```bash
python3 -m http.server --directory docs 8080
```

Mudanças em código devem passar também nos testes de interface:

```bash
npm install && npm run test:install && npm test
```

## 8. Abra o pull request

1. Fork e branch: `git checkout -b data/clt-revisao`
2. Commit: `git commit -m "data: revisa estrutura da CLT"`
3. PR com o template preenchido.

## Contribuições de código

Bem-vindas, com três condições: a página continua sem build e sem backend; toda funcionalidade lê os dados dos arquivos JSON, nunca embute conteúdo no HTML; e renderizadores novos consomem o modelo de `js/model.js` em vez de recalcular a árvore. Acrescente ou ajuste um teste em `tests/e2e.spec.js`.

## Licença das contribuições

Ao contribuir, você concorda que o código enviado fique sob MIT e que o conteúdo em `docs/data/` fique sob CC BY 4.0, nos termos de [LICENSE.md](LICENSE.md) e [LICENSE-CONTENT.md](LICENSE-CONTENT.md).
