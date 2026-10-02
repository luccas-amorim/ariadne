<!-- Obrigado por contribuir. Marque o que se aplica e apague o resto. -->

## Tipo de mudança

- [ ] Dados: novo diploma (`docs/data/<id>.json`)
- [ ] Dados: correção ou revisão de diploma existente
- [ ] Dados: relações internormativas, glossário ou marcos estruturais
- [ ] Código: interface, renderizadores, acessibilidade
- [ ] Documentação

## Checklist de revisão de conteúdo (obrigatório para mudanças em `docs/data/`)

- [ ] **Fonte**: usei a versão compilada do Planalto e informei o link em `source`.
- [ ] **Estrutura**: conferi cada Título e Capítulo contra o sumário do texto oficial, inclusive os acrescidos por letras (ex.: Título IV-A, Capítulo II-A).
- [ ] **Faixas de artigos**: os `subtitle` cobrem o diploma sem lacunas nem sobreposições.
- [ ] **Sínteses**: uma a três frases, dizem o que a divisão regula, sem opinião e sem jurisprudência.
- [ ] **Classificação**: `ramo` e `natureza` seguem [ABOUT.md](../ABOUT.md); se a escolha for discutível, há um campo `note`.
- [ ] **Status**: novo diploma entra como `"status": "rascunho"`; só vira `"revisado"` quando um segundo revisor confirmar a estrutura neste PR.
- [ ] **Relações**: cada relação em `relations.json` cita, em `note`, o dispositivo que a fundamenta.
- [ ] **Validação**: `node scripts/validate.js` passa sem erros.

## Resumo

<!-- O que mudou e por quê. Para diplomas, cite decisões de agrupamento (ex.: "Capítulos IV a VIII agrupados em um nó"). -->

## Revisor de conteúdo

<!-- Para dados: quem conferiu a estrutura além do autor? (@usuário) -->
