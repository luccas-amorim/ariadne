/* ==========================================================
   LINHA DO TEMPO DOS PROBLEMAS — dados
   Depende de ../dados/filosofos.js (FILOS), que deve ser
   carregado antes. Para acrescentar um lote, basta incluir
   linhas em POSICOES: a validação no fim do arquivo acusa
   no console qualquer erro de autor, subproblema ou relação.

   Posição: tese de um autor numa obra datada.
     autor        id em FILOS
     ano          negativo = a.C.; aprox: true = "c."
     tese         até 25 palavras; *itálico* entre asteriscos
     subproblemas ids de SUBPROBLEMAS (pode haver de vários problemas)
     relacoes     [tipo, id-alvo], sempre da mais nova para a mais antiga
                  tipos: responde, objeta, radicaliza, reformula, sintetiza
     status       'rascunho' (redigida por Claude, não conferida)
                  ou 'verificada' (conferida por Luccas contra o texto)
   ========================================================== */

/* Problemas. Aliases: como o problema foi chamado em cada período;
   "de" é o ano a partir do qual o nome aparece no eixo. */
const PROBLEMAS = [
  { id: 'mal', nome: 'Mal',
    aliases: [
      { termos: ['mal', 'pecado'], periodo: 'Antiga e Medieval', de: -700 },
      { termos: ['teodiceia'], periodo: 'desde 1710', de: 1710 }
    ],
    subproblemas: ['mal_natureza', 'mal_teodiceia', 'mal_moral'] },
  { id: 'mente', nome: 'Mente',
    aliases: [
      { termos: ['alma'], periodo: 'Antiga e Medieval', de: -700 },
      { termos: ['mente', 'espírito'], periodo: 'desde Descartes', de: 1641 },
      { termos: ['*qualia*'], periodo: 'desde c. 1930', de: 1930 }
    ],
    subproblemas: ['mente_corpo', 'mente_consciencia', 'mente_intencionalidade', 'mente_outras'] },
  { id: 'liberdade', nome: 'Liberdade',
    aliases: [
      { termos: ['destino'], periodo: 'Antiga', de: -700 },
      { termos: ['livre-arbítrio', 'graça'], periodo: 'Medieval e Reforma', de: 150 },
      { termos: ['autonomia'], periodo: 'desde Kant', de: 1785 },
      { termos: ['determinismo'], periodo: 'desde o séc. XIX', de: 1800 }
    ],
    subproblemas: ['lib_arbitrio', 'lib_autonomia', 'lib_politica'] },
  { id: 'ser_pensar', nome: 'Ser e pensar',
    aliases: [
      { termos: ['ser e pensar', 'ser e não-ser'], periodo: 'Antiga', de: -700 },
      { termos: ['ontologia'], periodo: 'desde o séc. XVII', de: 1600 },
      { termos: ['ser, pensar e linguagem'], periodo: 'desde Frege', de: 1884 }
    ],
    subproblemas: ['ser_identidade', 'ser_nao_ser', 'ser_predicado', 'ser_linguagem'] }
];

/* Subproblemas: cada um é uma faixa do mapa, com linhagem própria de respostas. */
const SUBPROBLEMAS = [
  { id: 'mal_natureza', nome: 'Natureza do mal', problema: 'mal', pergunta: 'Substância ou privação?' },
  { id: 'mal_teodiceia', nome: 'Teodiceia', problema: 'mal', pergunta: 'Como conciliar o mal com um Deus bom e onipotente?' },
  { id: 'mal_moral', nome: 'Mal moral', problema: 'mal', pergunta: 'De onde vem o mal que fazemos?' },

  { id: 'mente_corpo', nome: 'Mente e corpo', problema: 'mente', pergunta: 'Como o mental se relaciona com o físico?' },
  { id: 'mente_consciencia', nome: 'Consciência', problema: 'mente', pergunta: 'Por que há experiência subjetiva?' },
  { id: 'mente_intencionalidade', nome: 'Intencionalidade', problema: 'mente', pergunta: 'Como o pensamento se dirige a objetos?' },
  { id: 'mente_outras', nome: 'Outras mentes', problema: 'mente', pergunta: 'Como conheço outras mentes e falo do que sinto?' },

  { id: 'lib_arbitrio', nome: 'Livre-arbítrio', problema: 'liberdade', pergunta: 'A vontade é livre num mundo de causas?' },
  { id: 'lib_autonomia', nome: 'Autonomia', problema: 'liberdade', pergunta: 'O que é dar a si a própria lei?' },
  { id: 'lib_politica', nome: 'Liberdade política', problema: 'liberdade', pergunta: 'Que liberdade cabe ao cidadão diante do poder?' },

  { id: 'ser_identidade', nome: 'Pensar e ser', problema: 'ser_pensar', pergunta: 'Pensar e ser são o mesmo, ou correspondem?' },
  { id: 'ser_nao_ser', nome: 'Não-ser', problema: 'ser_pensar', pergunta: 'Pode-se pensar e dizer o que não é?' },
  { id: 'ser_predicado', nome: 'Existência', problema: 'ser_pensar', pergunta: 'Existir é uma propriedade das coisas?' },
  { id: 'ser_linguagem', nome: 'Linguagem', problema: 'ser_pensar', pergunta: 'Como a linguagem se liga ao pensamento e ao ser?' }
];

/* Posições: copiadas das tabelas do documento do piloto (PILOTO-PROBLEMAS). */
const POSICOES = [
/* ---------- MAL ---------- */
{ id: 'platao_ninguem_erra', autor: 'platao',
  obra: '*Protágoras*', ano: -385, aprox: true,
  tese: 'Ninguém faz o mal voluntariamente; o mal moral é ignorância do bem, não fraqueza da vontade.',
  subproblemas: ['mal_moral'],
  relacoes: [],
  status: 'rascunho' },

{ id: 'epicuro_dilema', autor: 'epicuro',  // tese encurtada para 25 palavras (o doc tinha 27), com aprovação de Luccas; "donde" no lugar de "de onde" para caber em 25
  obra: 'Dilema atribuído a Epicuro, transmitido por Lactâncio, *Sobre a ira de Deus*, 13', ano: -300, aprox: true,
  tese: 'Se Deus quer evitar o mal e não pode, é impotente; se pode e não quer, malévolo; se pode e quer, donde vem o mal?',
  subproblemas: ['mal_teodiceia'],
  relacoes: [],
  status: 'rascunho' },

{ id: 'plotino_materia', autor: 'plotino',
  obra: '*Enéadas*, I.8', ano: 270, aprox: true,
  tese: 'O mal é a matéria, privação absoluta de forma e de ser, no limite último da processão a partir do Uno.',
  subproblemas: ['mal_natureza'],
  relacoes: [],
  status: 'rascunho' },

{ id: 'agostinho_livre_arbitrio', autor: 'agostinho',
  obra: '*Sobre o livre-arbítrio*', ano: 395, aprox: true,
  tese: 'O mal moral nasce da vontade livre que se afasta do bem imutável; Deus deu o livre-arbítrio, mas não é autor do pecado.',
  subproblemas: ['mal_moral', 'lib_arbitrio'],
  relacoes: [['responde', 'epicuro_dilema']],
  status: 'rascunho' },

{ id: 'agostinho_privatio', autor: 'agostinho',
  obra: '*Confissões*, VII', ano: 398, aprox: true,
  tese: 'O mal não é substância, mas privação do bem; tudo o que é, enquanto é, é bom.',
  subproblemas: ['mal_natureza'],
  relacoes: [['reformula', 'plotino_materia']],
  status: 'rascunho' },

{ id: 'tomas_privacao', autor: 'tomas',
  obra: '*Suma teológica*, I, q. 48–49', ano: 1268, aprox: true,
  tese: 'O mal é privação de um bem devido; não tem causa própria, só acidental, e sempre num sujeito bom.',
  subproblemas: ['mal_natureza'],
  relacoes: [['reformula', 'agostinho_privatio']],
  status: 'rascunho' },

{ id: 'leibniz_teodiceia', autor: 'leibniz',
  obra: '*Ensaios de Teodiceia*', ano: 1710, aprox: false,
  tese: 'Deus escolheu o melhor dos mundos possíveis; o mal nele é condição de um todo melhor.',
  subproblemas: ['mal_teodiceia'],
  relacoes: [['responde', 'epicuro_dilema']],
  status: 'rascunho' },

{ id: 'voltaire_lisboa', autor: 'voltaire',
  obra: '*Poema sobre o desastre de Lisboa*', ano: 1756, aprox: false,
  tese: 'O terremoto de Lisboa desmente o otimismo: o sofrimento de inocentes não se justifica pelo todo.',
  subproblemas: ['mal_teodiceia'],
  relacoes: [['objeta', 'leibniz_teodiceia']],
  status: 'rascunho' },

{ id: 'hume_dialogos', autor: 'hume',
  obra: '*Diálogos sobre a religião natural*, partes X–XI', ano: 1779, aprox: false,
  tese: 'Da mistura de bem e mal no mundo não se infere um autor infinitamente bom e poderoso.',
  subproblemas: ['mal_teodiceia'],
  relacoes: [['reformula', 'epicuro_dilema'], ['objeta', 'leibniz_teodiceia']],
  status: 'rascunho' },

{ id: 'kant_fracasso', autor: 'kant',
  obra: '*Sobre o fracasso de toda tentativa filosófica em teodiceia*', ano: 1791, aprox: false,
  tese: 'Toda teodiceia teórica fracassa, pois a razão não alcança os desígnios divinos; resta apenas uma teodiceia prática, como a de Jó.',
  subproblemas: ['mal_teodiceia'],
  relacoes: [['objeta', 'leibniz_teodiceia']],
  status: 'rascunho' },

{ id: 'kant_mal_radical', autor: 'kant',
  obra: '*A religião nos limites da simples razão*', ano: 1793, aprox: false,
  tese: 'O mal radical é a propensão livre a inverter a ordem dos motivos, pondo o amor de si acima da lei moral.',
  subproblemas: ['mal_moral', 'lib_autonomia'],
  relacoes: [['objeta', 'platao_ninguem_erra'], ['reformula', 'agostinho_livre_arbitrio']],
  status: 'rascunho' },

{ id: 'schelling_liberdade', autor: 'schelling',
  obra: '*Investigações sobre a essência da liberdade humana*', ano: 1809, aprox: false,
  tese: 'A liberdade humana é faculdade do bem e do mal; o mal tem fundamento real no fundo obscuro em Deus, não é mera privação.',
  subproblemas: ['mal_natureza', 'mal_moral', 'lib_arbitrio'],
  relacoes: [['objeta', 'agostinho_privatio'], ['radicaliza', 'kant_mal_radical']],
  status: 'rascunho' },

{ id: 'mackie_inconsistencia', autor: 'mackie',
  obra: '*Evil and Omnipotence*', ano: 1955, aprox: false,
  tese: 'A existência do mal é logicamente incompatível com um Deus onipotente e inteiramente bom.',
  subproblemas: ['mal_teodiceia'],
  relacoes: [['reformula', 'epicuro_dilema']],
  status: 'rascunho' },

{ id: 'arendt_banalidade', autor: 'arendt',
  obra: '*Eichmann em Jerusalém*', ano: 1963, aprox: false,
  tese: 'Males extremos podem vir de agentes sem motivos demoníacos, pela incapacidade de pensar: o mal é banal, não profundo.',
  subproblemas: ['mal_moral'],
  relacoes: [],
  status: 'rascunho' },

{ id: 'plantinga_defesa', autor: 'plantinga',
  obra: '*God, Freedom, and Evil*', ano: 1974, aprox: false,
  tese: 'É possível que Deus não pudesse criar seres livres que nunca errassem; logo não há contradição entre Deus e o mal.',
  subproblemas: ['mal_teodiceia', 'lib_arbitrio'],
  relacoes: [['objeta', 'mackie_inconsistencia'], ['reformula', 'agostinho_livre_arbitrio']],
  status: 'rascunho' },

/* ---------- MENTE ---------- */
{ id: 'platao_fedon', autor: 'platao',
  obra: '*Fédon*', ano: -375, aprox: true,
  tese: 'A alma é imortal e distinta do corpo, que a aprisiona; conhecer é desprender-se dos sentidos.',
  subproblemas: ['mente_corpo'],
  relacoes: [],
  status: 'rascunho' },

{ id: 'aristoteles_forma', autor: 'aristoteles',
  obra: '*Sobre a alma*', ano: -350, aprox: true,
  tese: 'A alma é a forma do corpo natural que tem vida em potência; não se separa dele, salvo talvez o intelecto.',
  subproblemas: ['mente_corpo'],
  relacoes: [['objeta', 'platao_fedon']],
  status: 'rascunho' },

{ id: 'descartes_dualismo', autor: 'descartes',
  obra: '*Meditações sobre a filosofia primeira*', ano: 1641, aprox: false,
  tese: 'A mente, coisa pensante, e o corpo, coisa extensa, são substâncias realmente distintas.',
  subproblemas: ['mente_corpo'],
  relacoes: [['reformula', 'platao_fedon']],
  status: 'rascunho' },

{ id: 'elisabeth_interacao', autor: 'elisabeth',
  obra: 'Cartas a Descartes', ano: 1643, aprox: false,
  tese: 'Se a alma é inextensa, não se entende como move o corpo, pois mover exige contato e extensão.',
  subproblemas: ['mente_corpo'],
  relacoes: [['objeta', 'descartes_dualismo']],
  status: 'rascunho' },

{ id: 'espinosa_paralelismo', autor: 'espinosa',
  obra: '*Ética*, parte II', ano: 1677, aprox: false,
  tese: 'Mente e corpo são uma só coisa, concebida sob o pensamento e sob a extensão; a ordem das ideias é a das coisas.',
  subproblemas: ['mente_corpo', 'ser_identidade'],
  relacoes: [['objeta', 'descartes_dualismo']],
  status: 'rascunho' },

{ id: 'leibniz_harmonia', autor: 'leibniz',
  obra: '*Novo sistema da natureza*', ano: 1695, aprox: false,
  tese: 'Alma e corpo não interagem: cada um segue suas leis, numa harmonia preestabelecida por Deus.',
  subproblemas: ['mente_corpo'],
  relacoes: [['responde', 'elisabeth_interacao']],
  status: 'rascunho' },

{ id: 'lamettrie_maquina', autor: 'lamettrie',
  obra: '*O homem-máquina*', ano: 1747, aprox: false,
  tese: 'O pensamento é propriedade da matéria organizada; o homem é máquina, sem alma separada.',
  subproblemas: ['mente_corpo'],
  relacoes: [['radicaliza', 'descartes_dualismo']],
  status: 'rascunho' },

{ id: 'brentano_intencional', autor: 'brentano',
  obra: '*Psicologia do ponto de vista empírico*', ano: 1874, aprox: false,
  tese: 'Todo fenômeno psíquico se dirige a um objeto; essa inexistência intencional distingue o mental do físico.',
  subproblemas: ['mente_intencionalidade'],
  relacoes: [],
  status: 'rascunho' },

{ id: 'husserl_atos', autor: 'husserl',
  obra: '*Investigações lógicas*, V', ano: 1901, aprox: false,
  tese: 'A consciência visa objetos por atos que conferem sentido; o objeto visado não precisa existir nem estar na mente.',
  subproblemas: ['mente_intencionalidade'],
  relacoes: [['reformula', 'brentano_intencional']],
  status: 'rascunho' },

{ id: 'ryle_fantasma', autor: 'ryle',
  obra: '*O conceito de mente*', ano: 1949, aprox: false,
  tese: 'O dualismo é um erro categorial, o "fantasma na máquina"; o mental são disposições de comportamento.',
  subproblemas: ['mente_corpo'],
  relacoes: [['objeta', 'descartes_dualismo']],
  status: 'rascunho' },

{ id: 'wittgenstein_privada', autor: 'wittgenstein',
  obra: '*Investigações filosóficas*', ano: 1953, aprox: false,
  tese: 'Não há linguagem privada: termos psicológicos têm sentido por critérios públicos, não por inspeção interior.',
  subproblemas: ['mente_outras'],
  relacoes: [['objeta', 'descartes_dualismo']],
  status: 'rascunho' },

{ id: 'place_identidade', autor: 'place',
  obra: '*Is Consciousness a Brain Process?*', ano: 1956, aprox: false,
  tese: 'Estados conscientes são processos cerebrais, por identidade contingente descoberta empiricamente, como relâmpago e descarga elétrica.',
  subproblemas: ['mente_corpo', 'mente_consciencia'],
  relacoes: [['objeta', 'ryle_fantasma']],
  status: 'rascunho' },

{ id: 'putnam_funcional', autor: 'putnam',
  obra: '*The Nature of Mental States*', ano: 1967, aprox: false,
  tese: 'Estados mentais são estados funcionais, realizáveis em suportes físicos diversos; a identidade de tipos falha.',
  subproblemas: ['mente_corpo'],
  relacoes: [['objeta', 'place_identidade']],
  status: 'rascunho' },

{ id: 'nagel_morcego', autor: 'nagel',
  obra: '*What Is It Like to Be a Bat?*', ano: 1974, aprox: false,
  tese: 'Há algo que é ser um organismo consciente; esse caráter subjetivo escapa a toda descrição física objetiva.',
  subproblemas: ['mente_consciencia'],
  relacoes: [['objeta', 'putnam_funcional']],
  status: 'rascunho' },

{ id: 'searle_quarto', autor: 'searle',
  obra: '*Minds, Brains, and Programs*', ano: 1980, aprox: false,
  tese: 'Manipular símbolos por regras não basta para compreender: sintaxe não gera semântica.',
  subproblemas: ['mente_intencionalidade'],
  relacoes: [['objeta', 'putnam_funcional']],
  status: 'rascunho' },

{ id: 'chalmers_dificil', autor: 'chalmers',
  obra: '*Facing Up to the Problem of Consciousness*', ano: 1995, aprox: false,
  tese: 'Explicar funções cognitivas é o problema fácil; o difícil é explicar por que há experiência.',
  subproblemas: ['mente_consciencia'],
  relacoes: [['reformula', 'nagel_morcego']],
  status: 'rascunho' },

/* ---------- LIBERDADE ---------- */
{ id: 'crisipo_cilindro', autor: 'crisipo',
  obra: 'Testemunho em Cícero, *Sobre o destino*', ano: -230, aprox: true,
  tese: 'Tudo ocorre pelo destino, mas o assentimento depende do nosso caráter, como o cilindro rola por sua própria forma.',
  subproblemas: ['lib_arbitrio'],
  relacoes: [],
  status: 'rascunho' },

{ id: 'lucrecio_desvio', autor: 'lucrecio',
  obra: '*Sobre a natureza das coisas*, II', ano: -55, aprox: true,
  tese: 'Um desvio mínimo e imprevisível dos átomos, o *clinamen*, rompe a cadeia do destino e funda a vontade livre.',
  subproblemas: ['lib_arbitrio'],
  relacoes: [['objeta', 'crisipo_cilindro']],
  status: 'rascunho' },

{ id: 'erasmo_cooperacao', autor: 'erasmo',
  obra: '*Sobre o livre-arbítrio*', ano: 1524, aprox: false,
  tese: 'A vontade humana coopera com a graça; sem algum livre-arbítrio, mandamentos e responsabilidade perdem sentido.',
  subproblemas: ['lib_arbitrio'],
  relacoes: [['reformula', 'agostinho_livre_arbitrio']],
  status: 'rascunho' },

{ id: 'lutero_servo', autor: 'lutero',
  obra: '*Do arbítrio servo*', ano: 1525, aprox: false,
  tese: 'Depois da queda a vontade é escrava: sem a graça só pode pecar, e a salvação depende inteiramente de Deus.',
  subproblemas: ['lib_arbitrio'],
  relacoes: [['objeta', 'erasmo_cooperacao']],
  status: 'rascunho' },

{ id: 'hobbes_impedimentos', autor: 'hobbes',
  obra: '*Leviatã*, cap. XXI', ano: 1651, aprox: false,
  tese: 'Liberdade é ausência de impedimentos externos ao movimento; é compatível com a necessidade das causas e com o medo.',
  subproblemas: ['lib_arbitrio', 'lib_politica'],
  relacoes: [],
  status: 'rascunho' },

{ id: 'espinosa_necessidade', autor: 'espinosa',
  obra: '*Ética*, partes I e V', ano: 1677, aprox: false,
  tese: 'Os homens se creem livres por ignorar as causas que os determinam; livre é quem age pela necessidade da própria natureza.',
  subproblemas: ['lib_arbitrio', 'lib_autonomia'],
  relacoes: [],
  status: 'rascunho' },

{ id: 'hume_compatibilismo', autor: 'hume',
  obra: '*Investigação sobre o entendimento humano*, seção VIII', ano: 1748, aprox: false,
  tese: 'Liberdade e necessidade são compatíveis: liberdade é o poder de agir ou não conforme as determinações da vontade.',
  subproblemas: ['lib_arbitrio'],
  relacoes: [['reformula', 'hobbes_impedimentos']],
  status: 'rascunho' },

{ id: 'rousseau_vontade_geral', autor: 'rousseau',
  obra: '*Do contrato social*', ano: 1762, aprox: false,
  tese: 'Obedecer à lei que se prescreveu a si mesmo é liberdade; na vontade geral cada um obedece apenas a si.',
  subproblemas: ['lib_politica', 'lib_autonomia'],
  relacoes: [],
  status: 'rascunho' },

{ id: 'kant_antinomia', autor: 'kant',
  obra: '*Crítica da razão pura*, terceira antinomia', ano: 1781, aprox: false,
  tese: 'A causalidade natural vale para os fenômenos; a liberdade, como causalidade espontânea, permanece pensável para as coisas em si.',
  subproblemas: ['lib_arbitrio'],
  relacoes: [['responde', 'hume_compatibilismo']],
  status: 'rascunho' },

{ id: 'kant_autonomia', autor: 'kant',
  obra: '*Fundamentação da metafísica dos costumes*', ano: 1785, aprox: false,
  tese: 'A vontade livre é autônoma: dá a si a lei moral, e liberdade e lei moral se implicam reciprocamente.',
  subproblemas: ['lib_autonomia'],
  relacoes: [['reformula', 'rousseau_vontade_geral']],
  status: 'rascunho' },

{ id: 'constant_modernos', autor: 'constant',
  obra: '*Da liberdade dos antigos comparada à dos modernos*', ano: 1819, aprox: false,
  tese: 'Os antigos entendiam a liberdade como participação no poder; os modernos, como fruição independente da vida privada.',
  subproblemas: ['lib_politica'],
  relacoes: [['objeta', 'rousseau_vontade_geral']],
  status: 'rascunho' },

{ id: 'hegel_efetiva', autor: 'hegel',
  obra: '*Filosofia do Direito*', ano: 1820, aprox: false,
  tese: 'A liberdade se efetiva em instituições, no direito, na moralidade e na eticidade: é a vontade livre que quer a vontade livre.',
  subproblemas: ['lib_autonomia', 'lib_politica'],
  relacoes: [['sintetiza', 'kant_autonomia'], ['sintetiza', 'rousseau_vontade_geral']],
  status: 'rascunho' },

{ id: 'mill_dano', autor: 'mill',
  obra: '*Sobre a liberdade*', ano: 1859, aprox: false,
  tese: 'O único fim que justifica interferir na liberdade de alguém, contra sua vontade, é impedir dano a outros.',
  subproblemas: ['lib_politica'],
  relacoes: [],
  status: 'rascunho' },

{ id: 'sartre_condenado', autor: 'sartre',
  obra: '*O ser e o nada*', ano: 1943, aprox: false,
  tese: 'O homem está condenado a ser livre; não há natureza prévia que o determine, e a má-fé é fuga dessa liberdade.',
  subproblemas: ['lib_autonomia', 'lib_arbitrio'],
  relacoes: [],
  status: 'rascunho' },

{ id: 'berlin_dois_conceitos', autor: 'berlin',
  obra: '*Dois conceitos de liberdade*', ano: 1958, aprox: false,
  tese: 'Liberdade negativa é ausência de interferência; a positiva, autogoverno, pode legitimar coerção em nome do "verdadeiro eu".',
  subproblemas: ['lib_politica'],
  relacoes: [['reformula', 'constant_modernos'], ['objeta', 'hegel_efetiva']],
  status: 'rascunho' },

{ id: 'frankfurt_possibilidades', autor: 'frankfurt',
  obra: '*Alternate Possibilities and Moral Responsibility*', ano: 1969, aprox: false,
  tese: 'Alguém pode ser moralmente responsável mesmo sem poder ter agido de outro modo; o princípio das possibilidades alternativas é falso.',
  subproblemas: ['lib_arbitrio'],
  relacoes: [['reformula', 'hume_compatibilismo']],
  status: 'rascunho' },

/* ---------- SER E PENSAR ---------- */
{ id: 'parmenides_identidade', autor: 'parmenides',
  obra: '*Sobre a natureza*, fr. 3 e fr. 8', ano: -475, aprox: true,
  tese: 'O mesmo é pensar e ser; o não-ser não pode ser pensado nem dito, logo não é.',
  subproblemas: ['ser_identidade', 'ser_nao_ser'],
  relacoes: [],
  status: 'rascunho' },

{ id: 'gorgias_nao_ser', autor: 'gorgias',
  obra: '*Sobre o não-ser*, conservado por Sexto Empírico', ano: -440, aprox: true,
  tese: 'Nada é; se algo fosse, não seria cognoscível; se fosse cognoscível, não seria comunicável a outrem pela palavra.',
  subproblemas: ['ser_nao_ser', 'ser_linguagem'],
  relacoes: [['objeta', 'parmenides_identidade']],
  status: 'rascunho' },

{ id: 'platao_cratilo', autor: 'platao',
  obra: '*Crátilo*', ano: -385, aprox: true,
  tese: 'Os nomes não dão acesso seguro às coisas; é pelas próprias coisas, e não pelos nomes, que se deve conhecê-las.',
  subproblemas: ['ser_linguagem'],
  relacoes: [],
  status: 'rascunho' },

{ id: 'platao_sofista', autor: 'platao',
  obra: '*Sofista*', ano: -360, aprox: true,
  tese: 'O não-ser é, enquanto outro; o discurso falso diz o outro do que é, entrelaçando nome e verbo.',
  subproblemas: ['ser_nao_ser', 'ser_linguagem'],
  relacoes: [['objeta', 'parmenides_identidade'], ['responde', 'gorgias_nao_ser']],
  status: 'rascunho' },

{ id: 'aristoteles_interpretacao', autor: 'aristoteles',
  obra: '*Da interpretação*, 1', ano: -350, aprox: true,
  tese: 'As palavras são símbolos das afecções da alma, e estas, semelhanças das coisas; verdade e falsidade estão na composição.',
  subproblemas: ['ser_linguagem'],
  relacoes: [['reformula', 'platao_sofista']],
  status: 'rascunho' },

{ id: 'aristoteles_muitos_modos', autor: 'aristoteles',
  obra: '*Metafísica*, IV e VII', ano: -330, aprox: true,
  tese: 'O ser se diz de muitos modos, mas em relação a um primeiro, a substância; a não contradição rege ser e pensamento.',
  subproblemas: ['ser_identidade', 'ser_predicado'],
  relacoes: [['objeta', 'parmenides_identidade']],
  status: 'rascunho' },

{ id: 'plotino_intelecto', autor: 'plotino',  // "inteligiíveis" do doc corrigido para "inteligíveis", com aprovação de Luccas
  obra: '*Enéadas*, V.1 e V.9', ano: 260, aprox: true,
  tese: 'No Intelecto, pensar e ser coincidem: ele pensa os inteligíveis como a si mesmo; mas o Uno está além do ser e do pensar.',
  subproblemas: ['ser_identidade'],
  relacoes: [['reformula', 'parmenides_identidade']],
  status: 'rascunho' },

{ id: 'anselmo_proslogio', autor: 'anselmo',
  obra: '*Proslógio*, 2', ano: 1078, aprox: false,
  tese: 'Aquilo maior do que o qual nada pode ser pensado não pode existir só no intelecto; logo existe também na realidade.',
  subproblemas: ['ser_predicado', 'ser_identidade'],
  relacoes: [],
  status: 'rascunho' },

{ id: 'descartes_cogito', autor: 'descartes',
  obra: '*Meditações sobre a filosofia primeira*, II', ano: 1641, aprox: false,
  tese: 'Do pensar se segue com certeza o ser de quem pensa: eu sou, eu existo, enquanto penso.',
  subproblemas: ['ser_identidade'],
  relacoes: [],
  status: 'rascunho' },

{ id: 'berkeley_percipi', autor: 'berkeley',
  obra: '*Tratado sobre os princípios do conhecimento humano*', ano: 1710, aprox: false,
  tese: 'Ser é ser percebido, ou perceber; não há existência de coisas sensíveis fora de alguma mente.',
  subproblemas: ['ser_identidade'],
  relacoes: [],
  status: 'rascunho' },

{ id: 'kant_predicado', autor: 'kant',
  obra: '*Crítica da razão pura*, A 598 / B 626', ano: 1781, aprox: false,
  tese: 'Ser não é predicado real, mas a posição da coisa; por isso a prova ontológica fracassa.',
  subproblemas: ['ser_predicado'],
  relacoes: [['objeta', 'anselmo_proslogio']],
  status: 'rascunho' },

{ id: 'kant_fenomeno', autor: 'kant',
  obra: '*Crítica da razão pura*', ano: 1781, aprox: false,
  tese: 'Só conhecemos as coisas como fenômenos, sob as formas da sensibilidade e do entendimento; a coisa em si é pensável, não cognoscível.',
  subproblemas: ['ser_identidade'],
  relacoes: [['objeta', 'berkeley_percipi']],
  status: 'rascunho' },

{ id: 'hegel_conceito', autor: 'hegel',
  obra: '*Ciência da Lógica*, Introdução', ano: 1812, aprox: false,
  tese: 'A lógica é o pensamento puro que é também a coisa mesma: no conceito, pensar e ser coincidem.',
  subproblemas: ['ser_identidade'],
  relacoes: [['objeta', 'kant_fenomeno'], ['reformula', 'parmenides_identidade']],
  status: 'rascunho' },

{ id: 'hegel_ser_nada', autor: 'hegel',
  obra: '*Ciência da Lógica*, livro I', ano: 1812, aprox: false,
  tese: 'O ser puro, sem determinação, é o mesmo que o nada; a verdade de ambos é o devir.',
  subproblemas: ['ser_nao_ser'],
  relacoes: [['objeta', 'parmenides_identidade']],
  status: 'rascunho' },

{ id: 'frege_existencia', autor: 'frege',
  obra: '*Os fundamentos da aritmética*, § 53', ano: 1884, aprox: false,
  tese: 'Existência é propriedade de conceitos, não de objetos: afirmá-la é negar o número zero ao conceito.',
  subproblemas: ['ser_predicado'],
  relacoes: [['reformula', 'kant_predicado']],
  status: 'rascunho' },

{ id: 'frege_sentido', autor: 'frege',
  obra: '*Sobre o sentido e a referência*', ano: 1892, aprox: false,
  tese: 'Um nome tem sentido, o modo de apresentação, e referência, o objeto; "estrela da manhã" e "da tarde" diferem só no sentido.',
  subproblemas: ['ser_linguagem'],
  relacoes: [],
  status: 'rascunho' },

{ id: 'russell_denotacao', autor: 'russell',
  obra: '*Sobre a denotação*', ano: 1905, aprox: false,
  tese: 'Descrições definidas não são nomes; "o atual rei da França" se analisa por quantificadores, sem objeto inexistente.',
  subproblemas: ['ser_linguagem', 'ser_predicado'],
  relacoes: [['objeta', 'frege_sentido']],
  status: 'rascunho' },

{ id: 'wittgenstein_tractatus', autor: 'wittgenstein',
  obra: '*Tractatus logico-philosophicus*', ano: 1921, aprox: false,
  tese: 'A proposição é figura do fato; os limites da minha linguagem significam os limites do meu mundo.',
  subproblemas: ['ser_linguagem', 'ser_identidade'],
  relacoes: [['radicaliza', 'russell_denotacao']],
  status: 'rascunho' },

{ id: 'heidegger_sentido', autor: 'heidegger',
  obra: '*Ser e tempo*', ano: 1927, aprox: false,
  tese: 'A pergunta pelo sentido do ser foi esquecida; só se recoloca pela analítica do ente que compreende o ser, o *Dasein*.',
  subproblemas: ['ser_identidade'],
  relacoes: [['objeta', 'hegel_ser_nada']],
  status: 'rascunho' },

{ id: 'heidegger_nada', autor: 'heidegger',
  obra: '*O que é metafísica?*', ano: 1929, aprox: false,
  tese: 'O nada não deriva da negação lógica; é anterior ao "não" e se revela na angústia.',
  subproblemas: ['ser_nao_ser'],
  relacoes: [],
  status: 'rascunho' },

{ id: 'carnap_superacao', autor: 'carnap',
  obra: '*A superação da metafísica pela análise lógica da linguagem*', ano: 1932, aprox: false,
  tese: 'Frases como "o nada nadifica" são pseudoproposições: violam a sintaxe lógica e não dizem nada.',
  subproblemas: ['ser_nao_ser', 'ser_linguagem'],
  relacoes: [['objeta', 'heidegger_nada']],
  status: 'rascunho' },

{ id: 'heidegger_casa', autor: 'heidegger',
  obra: '*Carta sobre o humanismo*', ano: 1947, aprox: false,
  tese: 'A linguagem é a casa do ser; pensar é levar o ser à palavra, e não representar objetos.',
  subproblemas: ['ser_linguagem', 'ser_identidade'],
  relacoes: [['radicaliza', 'heidegger_sentido']],
  status: 'rascunho' },

{ id: 'quine_o_que_ha', autor: 'quine',
  obra: '*Sobre o que há*', ano: 1948, aprox: false,
  tese: 'Ser é ser o valor de uma variável: os compromissos ontológicos de uma teoria se leem em sua quantificação.',
  subproblemas: ['ser_predicado', 'ser_linguagem'],
  relacoes: [['reformula', 'russell_denotacao']],
  status: 'rascunho' }

];

/* ==========================================================
   VALIDAÇÃO — roda ao carregar; cada problema vira um aviso
   no console. Devolve o número de avisos.
   ========================================================== */
const TIPOS_RELACAO = ['responde', 'objeta', 'radicaliza', 'reformula', 'sintetiza'];
function validarProblemas(){
  let n = 0;
  const aviso = (...a) => { n++; console.warn('[problemas]', ...a); };
  const autores = new Set(FILOS.map(f => f[0]));
  const probs = new Set(PROBLEMAS.map(p => p.id));
  const subs = new Set(SUBPROBLEMAS.map(s => s.id));
  SUBPROBLEMAS.forEach(s => { if (!probs.has(s.problema)) aviso('Subproblema de problema inexistente:', s.id, '→', s.problema); });
  PROBLEMAS.forEach(p => p.subproblemas.forEach(s => { if (!subs.has(s)) aviso('Subproblema inexistente:', s, 'no problema', p.id); }));
  const porId = new Map();
  POSICOES.forEach(p => { if (porId.has(p.id)) aviso('Id repetido:', p.id); else porId.set(p.id, p); });
  POSICOES.forEach(p => {
    if (!autores.has(p.autor)) aviso('Autor inexistente em FILOS:', p.autor, 'em', p.id);
    if (!p.subproblemas.length) aviso('Posição sem subproblema:', p.id);
    p.subproblemas.forEach(s => { if (!subs.has(s)) aviso('Subproblema inexistente:', s, 'em', p.id); });
    p.relacoes.forEach(([tipo, alvo]) => {
      if (!TIPOS_RELACAO.includes(tipo)) aviso('Tipo de relação fora dos cinco:', tipo, 'em', p.id);
      const a = porId.get(alvo);
      if (!a) aviso('Alvo de relação inexistente:', alvo, 'em', p.id);
      else if (a.ano > p.ano) aviso('Relação aponta para posição mais nova:', p.id, `(${p.ano}) →`, alvo, `(${a.ano})`);
    });
    const palavras = p.tese.trim().split(/\s+/).length;
    if (palavras > 25) aviso(`Tese com ${palavras} palavras (máximo 25):`, p.id);
    if (p.status !== 'rascunho' && p.status !== 'verificada') aviso('Status desconhecido:', p.status, 'em', p.id);
  });
  return n;
}
validarProblemas();
