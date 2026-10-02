# Como contribuir

A contribuição mais valiosa é **mapear um diploma novo**. Isso não exige programar: é escrever um arquivo JSON e listá-lo no catálogo.

## 1. Escolha um diploma

Prefira os que já estão no roadmap (`planned` em `docs/data/index.json`): CLT, CDC, ECA, CTN, Lei 14.133, Lei 9.784 e LEP. Para propor outro, abra uma issue antes, dizendo em qual ramo ele entraria e por quê.

## 2. Crie `docs/data/<id>.json`

Use o `id` já definido no catálogo (por exemplo `clt`). Estrutura mínima:

```json
{
  "id": "clt",
  "title": "Consolidação das Leis do Trabalho",
  "shortTitle": "CLT",
  "norm": "Decreto-Lei nº 5.452, de 1º de maio de 1943",
  "ramo": "social",
  "natureza": "material",
  "source": "https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm",
  "year": 1943,
  "root": {
    "id": "clt",
    "name": "Consolidação das Leis do Trabalho",
    "label": "CLT",
    "subtitle": "Raiz",
    "content": "Síntese do diploma em uma a três frases.",
    "children": [
      {
        "id": "titulo-i",
        "name": "Título I - Introdução",
        "label": "Título I",
        "subtitle": "Arts. 1º a 12",
        "content": "O que este Título regula, em linguagem didática."
      }
    ]
  }
}
```

Campos de cada nó:

| Campo | O que é | Exemplo |
|---|---|---|
| `id` | kebab-case, único entre irmãos; vira parte da URL | `titulo-ii`, `livro-i`, `parte-especial` |
| `name` | nome completo da divisão | `Título II - Dos Direitos e Garantias Fundamentais` |
| `label` | rótulo curto do nó (até 28 caracteres) | `Título II` |
| `subtitle` | faixa de artigos | `Arts. 5º a 17` |
| `content` | síntese didática (mínimo 20 caracteres) | ver estilo abaixo |
| `children` | filhos; omita o campo se não houver | |

`ramo` aceita `constitucional`, `privado`, `publico`, `social`, `penal`. `natureza` aceita `material` ou `processual`. Se a classificação for discutível, acrescente um campo `note` com uma frase justificando a escolha; ele aparece na interface.

O JSON Schema completo está em `docs/data/schema.json`. Editores como o VS Code validam o arquivo automaticamente se você incluir `"$schema": "./schema.json#/definitions/diploma"` no topo.

## 3. Profundidade e granularidade

* Vá até **Títulos e Capítulos**. Seções, Subseções e artigos não entram: eles mudam com frequência e explodem a árvore.
* Quando um Título tiver Capítulos demais, agrupe os de menor relevância em um único nó (`Capítulos IV a VIII - Diversos`), como foi feito na CF/88.
* Um nó sem `children` é uma folha. Um nó com `children` deve ter pelo menos um filho.

## 4. Estilo das sínteses

* Uma a três frases, em português claro, sem copiar a ementa.
* Diga **o que a divisão regula** e cite os institutos principais: "Requisitos de validade, representação, condição, termo, defeitos e invalidade."
* Evite opinião e evite jurisprudência: a árvore é um mapa, não um comentário.
* Use a versão **compilada** do Planalto como fonte e informe o link em `source`.

## 5. Liste no catálogo

Em `docs/data/index.json`, mova o diploma de `planned` para `diplomas` (apenas o id entra em `diplomas`; os metadados ficam no arquivo próprio).

## 6. Valide

```bash
node scripts/validate.js
```

O script verifica campos, ids, ramos e coerência com o catálogo, e o mesmo teste roda no CI a cada pull request. Depois, abra a página localmente e confira a árvore:

```bash
python3 -m http.server --directory docs 8080
```

## 7. Abra o pull request

1. Fork e branch: `git checkout -b data/clt`
2. Commit: `git commit -m "data: adiciona estrutura da CLT"`
3. PR descrevendo a fonte utilizada e qualquer decisão de agrupamento.

## Contribuições de código

Mudanças em `docs/index.html` são bem-vindas, com duas condições: a página deve continuar funcionando sem build e sem backend, e qualquer nova funcionalidade deve ler os dados dos arquivos JSON, nunca embutir conteúdo no HTML.

## Licença das contribuições

Ao contribuir, você concorda que o código enviado fique sob MIT e que o conteúdo em `docs/data/` fique sob CC BY 4.0, nos termos de [LICENSE.md](LICENSE.md) e [LICENSE-CONTENT.md](LICENSE-CONTENT.md).
