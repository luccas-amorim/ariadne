# Roadmap

O arco de funções está fechado. O que resta é, sobretudo, **conteúdo** e **revisão**. Esta lista é a fila de trabalho; cada item pode virar uma issue. Itens marcados com ★ são bons para quem está começando a contribuir.

## 1. Revisão dos rascunhos (prioridade máxima)

Diplomas cuja estrutura foi mapeada mas ainda não conferida contra o texto oficial por um segundo revisor. Enquanto estão como `"status": "rascunho"`, o painel avisa o leitor.

| Diploma | Arquivo | O que conferir em especial |
|---|---|---|
| CLT | `docs/data/clt.json` | Títulos com letra (IV-A, VI-A, VII-A), Capítulos do Título VIII agrupados (VI a VIII), faixas do Título X |
| CDC | `docs/data/cdc.json` | Capítulo V do Título III (superendividamento, arts. 104-A a 104-C) |
| ECA | `docs/data/eca.json` | Agrupamentos de Capítulos nos Títulos III e VI do Livro II; faixa do Título VI (até 224) |
| CTN | `docs/data/ctn.json` | Faixas do Livro Primeiro, hoje em parte superadas pela CF; disposições finais |
| Lei 14.133 | `docs/data/l14133.json` | **Numeração dos Capítulos do Título II foi omitida de propósito**; conferir e numerar |
| Lei 9.784 | `docs/data/l9784.json` | Capítulos agrupados em pares; conferir faixas |
| LEP | `docs/data/lep.json` | Capítulos agrupados nos Títulos III e IV; art. 9-A e 81-A/81-B |

Processo: checklist do template de PR, item a item, e troca do `status` para `revisado` no mesmo PR.

## 2. Percursos guiados

Os seis percursos em `docs/data/tours.json` são rascunhos escritos sem revisão jurídica. Precisam de leitura por quem conhece cada matéria, em especial:

- [ ] "Do crime à execução da pena": conferir a sequência inquérito → ação penal → processo comum → pena → execução.
- [ ] "Uma demissão": conferir a menção à transcendência do recurso de revista.
- [ ] "Um tributo": conferir a ordem lançamento → suspensão → extinção → certidão.
- [ ] "Uma obra pública": conferir a afirmação de que a habilitação vem depois do julgamento como regra.
- [ ] Novos percursos sugeridos ★: "Um contrato entre empresas" (CC Livro II e Obrigações → CPC execução), "Uma emenda constitucional" (CF Título IV → processo legislativo), "O servidor público" (CF art. 37 → Lei 8.112 quando mapeada → Lei 9.784 → Lei 8.429).

## 3. Diplomas em mapeamento

Já constam em `planned` no catálogo e aparecem esmaecidos no mapa. Ordem sugerida:

1. **LINDB** (Decreto-Lei 4.657/1942) ★: curto, estrutura simples, alto valor didático.
2. **Lei 9.099/1995** (Juizados Especiais): dois capítulos grandes, cível e criminal; decidir se o ramo é privado ou penal, ou se vale dividir.
3. **Lei 8.429/1992** (Improbidade), já com a reforma de 2021.
4. **Lei 8.112/1990** (Servidores da União).
5. **LGPD** (Lei 13.709/2018).
6. **Lei 11.340/2006** (Maria da Penha) e **Lei 11.343/2006** (Drogas).

Candidatos ainda fora do catálogo, para discussão em issue: Código Eleitoral, Código Penal Militar, Código de Trânsito, Lei de Falências (14.112/2020 sobre 11.101/2005), Estatuto da Cidade, Lei da Ação Civil Pública, Lei do Mandado de Segurança, Marco Civil da Internet, Lei de Arbitragem.

## 4. Relações internormativas

Há 27 relações. O formato comporta centenas. Frentes:

- [ ] Relações **entre divisões**, não só entre diploma e divisão: por exemplo, CC Título IX (Responsabilidade Civil) → CDC Capítulo IV; CP Título I (crimes contra a pessoa) → Lei 11.340 quando mapeada.
- [ ] Relações de **aplicação subsidiária** sistemáticas: CPC → CLT, CPC → CDC, CPC → ECA, CPC → Lei 9.099, Lei 9.784 → processos administrativos específicos.
- [ ] Tipos novos, se necessários (ex.: "revoga parcialmente", "remete a"), definidos em `index.json → relationTypes` com descrição.
- [x] Mostrar na interface a **direção** da relação com uma seta discreta no fim do arco.
- [ ] Preencher `basis` nas 11 relações cuja nota não cita o dispositivo, e `status` depois de revisar cada uma.

## 5. Linha do tempo

- [ ] Mais marcos estruturais (`history`) entre 1988 e 2000 e entre 2015 e hoje.
- [ ] `since`/`until` em divisões revogadas ou renumeradas (ex.: arts. 202 a 223 da CLT).
- [ ] Antecessores dos diplomas sem antecessor registrado (CTN: Lei 5.172 sucedeu normas esparsas; discutir se vale registrar).
- [ ] Opção de **velocidade** da reprodução e de pausar em cada ano com evento.
- [ ] Permitir que o foco em um diploma também obedeça ao ano (hoje o foco ignora antecessores).

## 6. Glossário e sínteses

- [ ] Ampliar o glossário para os termos mais frequentes nos diplomas novos (tributário e licitações têm cobertura baixa).
- [ ] Padronizar as sínteses dos rascunhos no estilo das dos cinco diplomas revisados.
- [ ] Revisar sínteses da CF/88 que agrupam Capítulos ("Capítulos IV a VIII - Diversos") e avaliar desagrupar.

## 7. Interface

- [ ] **Navegação em árvores grandes**: minimapa ou "modo foco" que esmaece tudo fora do subtree selecionado quando há mais de ~150 nós visíveis.
- [ ] 3D: trackpad com dois dedos movendo a câmera (hoje aproxima); rótulos com tamanho adaptado à distância.
- [ ] Mobile: barra de ferramentas em menu compacto; painel de leitura como folha deslizante.
- [ ] Acessibilidade: anunciar mudanças de seleção em `aria-live`; foco visível nos nós SVG; contraste do tema escuro validado.
- [ ] Modo estudo com **repetição espaçada** sobre a trilha (revisar primeiro o que foi errado há mais tempo).
- [ ] Compartilhar a trilha por link (hoje só por arquivo JSON).

## 8. Infraestrutura

- [ ] Cache-busting dos módulos em `docs/js/` (hash no nome ou `?v=` gerado), para que atualizações cheguem sem recarregamento forçado.
- [ ] Testes de interface no modo 3D além do smoke test atual (clique em nó, relações).
- [ ] Verificação automática de links do Planalto (`source`) no CI, semanal.
- [ ] Publicar um `data/all.json` consolidado para consumo externo em uma requisição.
- [ ] Fragmentos LexML por divisão (campo `lexml`, ex.: `art5`), conferidos no texto marcado do LexML. Hoje toda divisão usa a URN do diploma.

## Concluído

Para referência do que já existe: árvore unificada com a Constituição ao centro, expansão no lugar, foco por diploma, filtro, 2D e 3D sobre o mesmo modelo, relações internormativas com liga/desliga, linha do tempo com antecessores, percursos guiados, modo estudo, trilha pessoal, comparação lado a lado, glossário, marcos estruturais, exportação SVG/PNG, impressão, lista acessível, teclado, tema escuro, validador de dados, testes Playwright, licença dupla MIT + CC BY 4.0, URN LexML por diploma e IRI estável por nó.
