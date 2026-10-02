# Sobre o projeto

## Texto para o campo "About" do GitHub

> Árvores Jurídicas BR: a macroestrutura da Constituição e dos grandes diplomas brasileiros em uma única árvore interativa, 2D e 3D, com relações internormativas, modo estudo e dados abertos (CC BY 4.0).

Tópicos sugeridos: `brasil`, `direito`, `legislacao`, `d3js`, `threejs`, `visualizacao-de-dados`, `open-data`, `constituicao`, `codigo-civil`, `codigo-penal`, `educacao-juridica`

Website: `https://luccas-amorim.github.io/lex-tree-br/`

## Por que estrutura, e não artigos

Um código tem centenas ou milhares de artigos, e eles mudam o tempo todo. Sua **estrutura**, porém, quase não muda: o Código Civil de 2002 continua dividido em Parte Geral e Parte Especial, com os mesmos Livros e Títulos de quando foi promulgado. Mapear apenas Partes, Livros, Títulos e Capítulos produz um material que:

* envelhece devagar e não exige acompanhamento legislativo diário;
* cabe inteiro na tela e na memória de quem estuda;
* só precisa crescer quando um diploma novo é promulgado.

Cada nó traz uma síntese didática do que aquela divisão regula e a faixa de artigos que ela ocupa. Para o texto em si, o painel leva à versão compilada no Planalto.

## A Constituição ao centro

A Constituição não é "mais um diploma" na lista. Ela é o parâmetro de validade de todos os outros: organiza o Estado, distribui competências e enuncia os direitos que cada código concretiza. Por isso o mapa inicial é radial, com a CF/88 no centro e os ramos do Direito saindo dela.

## A divisão em ramos

A classificação adotada é didática e assumidamente autoral. Ela organiza os diplomas pelo **tipo de relação jurídica** que regulam, e não pela tradição das disciplinas de faculdade:

| Ramo | Relação regulada | Papel do Estado |
|---|---|---|
| **Constitucional** | Fundação do ordenamento | Constituído e limitado |
| **Privado** | Particular ↔ particular, em igualdade formal | Garantidor, não parte |
| **Público** | Estado ↔ particular, com supremacia do interesse público | Parte, sujeita a limites |
| **Social** | Instituição ↔ pessoa, em desigualdade material | Intervém pelo equilíbrio |
| **Penal** | Estado ↔ pessoa, no exercício do *jus puniendi* | Titular da pretensão punitiva, sob garantias máximas |

### Direito processual: ramo autônomo, nascimento colateral

Os códigos de processo têm objeto e princípios próprios e por isso são ramos autônomos. Mas eles são **direito formal**: existem para conformar um direito material. Por essa razão, no mapa, o CPC nasce colateral ao Direito Privado e o CPP colateral ao Direito Penal, com borda tracejada para marcar a natureza processual. O mesmo vale para a Lei do Processo Administrativo (Direito Público) e para a Lei de Execução Penal (Direito Penal).

### Escolhas discutíveis

Algumas alocações admitem leituras diferentes, e o projeto não pretende encerrar o debate:

* **CDC** está em Direito Social porque regula a relação fornecedor ↔ consumidor com intervenção estatal em favor da parte vulnerável. Parte da doutrina o situa no Direito Privado, como microssistema de ordem pública.
* **ECA** está em Direito Social pela proteção integral, embora contenha normas de natureza penal, processual e administrativa.
* **CLT** está em Direito Social, mas reúne também o processo do trabalho; o mapa a trata pela natureza predominante.

Quando um diploma tiver classificação discutível, o arquivo de dados leva um campo `note` explicando a escolha, e esse texto aparece na interface.

## Relações internormativas: de árvore a grafo

Nenhum diploma vive isolado. O CPC processa o Código Civil; a LEP executa as penas do Código Penal; o CTN regulamenta o capítulo tributário da Constituição; a Lei 14.133 insere crimes no Código Penal. Essas ligações são registradas em `relations.json` com um tipo (concretiza, regulamenta, processa, executa, aplicação subsidiária, excepciona, insere, organiza) e o dispositivo que as fundamenta. Na interface aparecem como linhas roxas a partir do nó selecionado, e é por elas que a árvore passa a ser um grafo. Foi essa camada que tornou a versão 3D útil, e não só bonita: no espaço, as relações atravessam as camadas sem se confundir com os galhos.

## Por que 2D e 3D sobre o mesmo modelo

O layout radial é calculado uma única vez: ângulos pelo algoritmo de árvore do D3, raio de cada camada crescendo o necessário para que nós vizinhos não se sobreponham. O 2D desenha esse layout em SVG. O 3D eleva cada camada no eixo vertical e usa as mesmas coordenadas no plano. Alternar entre os dois nunca muda o que está expandido, selecionado ou filtrado, e a URL é a mesma, a menos de um parâmetro (`m=3d`).

## Rascunho e revisado

Diplomas entram como **rascunho**: a estrutura foi mapeada a partir do texto, mas ainda não conferida por um segundo revisor. Passam a **revisado** quando alguém confirma, item a item, Títulos, Capítulos e faixas de artigos no pull request. O painel avisa quando o diploma é rascunho, para que o leitor saiba o grau de confiança do que vê.

## Licenças

O código é MIT. O conteúdo autoral (a estrutura mapeada e as sínteses) é CC BY 4.0. Os textos legais são de domínio público (Lei 9.610/1998, art. 8º, IV). Detalhes em [LICENSE.md](LICENSE.md) e [LICENSE-CONTENT.md](LICENSE-CONTENT.md).

## Inspiração

A [Tractatus' Tree](https://pbellon.github.io/tractatus-tree/#/), de pbellon, mostrou que uma árvore interativa é uma forma honesta de explorar um texto cuja própria numeração é hierárquica. A legislação brasileira tem a mesma propriedade.
