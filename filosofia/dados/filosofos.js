/* ==========================================================
   BASE COMUM DE FILÓSOFOS — dados partilhados pela linha do
   tempo (../linha-do-tempo/) e pela linha de problemas
   (../problemas/). Carregar antes do script de cada página.
   ========================================================== */

/* ==========================================================
   PÁGINAS DE ESTUDO — para ligar um novo filósofo, acrescente
   uma entrada aqui (id do filósofo: lista de páginas).
   ========================================================== */
const PAGINAS = {
  hobbes:   [{t:'Hobbes · o Leviatã', u:'../hobbes/'}],
  espinosa: [{t:'Espinosa · a Ética', u:'../espinosa/'}],
  hume:     [{t:'Hume · o Tratado', u:'../hume/'}],
  rousseau: [{t:'Rousseau · o Contrato social', u:'../rousseau/'}],
  kant:     [{t:'Kant · a planta do sistema', u:'../kant/'}, {t:'As Críticas, reconstruídas', u:'../kant/criticas/'}],
  hegel:    [{t:'Hegel · três obras', u:'../hegel/'}, {t:'A Ciência da Lógica, reconstruída', u:'../hegel/logica/'}, {t:'A Filosofia do Direito, reconstruída', u:'../hegel/direito/'}]
};

/* Grandes tradições (dão a cor das correntes) */
const FAMILIAS = {
  cos:{n:'Fisiólogos e cosmologia',h:24,s:62},
  pla:{n:'Platonismo e idealismos',h:268,s:48},
  ari:{n:'Aristotelismo e escolástica',h:38,s:52},
  hel:{n:'Escolas helenísticas e ceticismo',h:192,s:50},
  teo:{n:'Teologia filosófica e mística',h:330,s:42},
  ara:{n:'Tradições árabe e judaica',h:152,s:42},
  hum:{n:'Humanismo e historicismo',h:14,s:55},
  rac:{n:'Racionalismo e criticismo',h:228,s:50},
  emp:{n:'Empirismo e filosofia analítica',h:205,s:55},
  ilu:{n:'Iluminismo',h:50,s:62},
  dir:{n:'Direito, Estado e política',h:0,s:52},
  mat:{n:'Materialismo, marxismo e teoria crítica',h:316,s:45},
  vid:{n:'Vida, existência, fenomenologia e hermenêutica',h:172,s:45},
  cie:{n:'Ciência e positivismo',h:95,s:42},
  pra:{n:'Pragmatismo',h:72,s:50},
  est:{n:'Estruturalismo e pós-estruturalismo',h:125,s:38},
  fem:{n:'Filosofia feminista',h:345,s:50},
  dec:{n:'Pós-colonial e decolonial',h:30,s:45}
};

const AREAS = [
  {k:'M',n:'Metafísica',h:250},
  {k:'E',n:'Epistemologia',h:195},
  {k:'L',n:'Lógica',h:165},
  {k:'G',n:'Filosofia da linguagem',h:135},
  {k:'N',n:'Filosofia da mente',h:280},
  {k:'C',n:'Filosofia da ciência',h:105},
  {k:'T',n:'Ética',h:50},
  {k:'P',n:'Filosofia política',h:0},
  {k:'D',n:'Filosofia do direito',h:25},
  {k:'S',n:'Estética',h:305},
  {k:'A',n:'Filosofia da arte',h:330},
  {k:'R',n:'Filosofia da religião',h:75},
  {k:'H',n:'Filosofia da história',h:220}
];

/* faixa: limites convencionais do período (para a régua e as fronteiras) */
const PERIODOS = {
  ant:{n:'Antiga', faixa:[-650,529], linha:0, rotulo:'c. 585 a.C.–529'},
  med:{n:'Medieval', faixa:[150,1453], linha:1, rotulo:'séc. II–1453'},
  mod:{n:'Moderna', faixa:[1400,1831], linha:0, rotulo:'séc. XV–1831'},
  con:{n:'Contemporânea', faixa:[1831,2040], linha:1, rotulo:'1831–hoje'}
};
const FRONTEIRAS = [[529,'Fechamento da Academia'],[1453,'Queda de Constantinopla'],[1831,'Morte de Hegel']];

/* Correntes: [id, nome, período, família, faixa vertical preferida, descrição] */
const ESCOLAS = [
 ['mil','Escola de Mileto','ant','cos',7,'Primeiros fisiólogos: buscam a *arché*, o princípio de que todas as coisas provêm.'],
 ['pit','Pitagorismo','ant','pla',3,'Comunidade filosófico-religiosa: o número como princípio e a imortalidade e transmigração da alma.'],
 ['her','Heraclitismo','ant','cos',5,'O devir e a unidade dos contrários sob o *lógos*; Crátilo radicaliza a doutrina do fluxo.'],
 ['ele','Eleatismo','ant','pla',4,'O ser é uno, imóvel e eterno; o devir e a multiplicidade são aparência.'],
 ['plu','Pluralistas','ant','cos',7,'Conciliam o ser eleata com a multiplicidade: as quatro raízes de Empédocles, as sementes e o *Noûs* de Anaxágoras.'],
 ['ato','Atomismo','ant','cos',9,'Átomos e vazio: o primeiro materialismo mecanicista.'],
 ['sof','Sofística','ant','dir',11,'Mestres pagos de retórica e de virtude política; relativismo e a oposição entre *nómos* e *phýsis*.'],
 ['soc','Sócrates','ant','pla',6,'A virada para a ética e o exame dialógico das definições; matriz comum de quase todas as escolas posteriores.'],
 ['smen','Socráticos menores','ant','hel',9,'Megáricos (dialética), cínicos (vida segundo a natureza) e cirenaicos (hedonismo); prefiguram estoicos e epicuristas.'],
 ['aca','Academia antiga','ant','pla',4,'A escola de Platão até Pólemon: teoria das ideias, matemática e dialética.'],
 ['lic','Liceu (peripatéticos)','ant','ari',6,'A escola de Aristóteles e seus comentadores: lógica, física, biologia, ética e política.'],
 ['cet','Pirronismo','ant','hel',12,'Ceticismo radical: suspensão do juízo (*epoché*) para alcançar a tranquilidade (*ataraxía*).'],
 ['acc','Academia cética','ant','hel',8,'A Academia de Arcesilau a Filo de Larissa: contra o dogmatismo estoico, o assentimento apenas ao provável.'],
 ['est','Estoicismo','ant','hel',10,'O Pórtico: lógica proposicional, física do *lógos* e ética da virtude conforme a natureza. Fases antiga, média e romana.'],
 ['epi','Epicurismo','ant','hel',11,'O Jardim: atomismo, prazer como ausência de dor e a justiça como pacto de utilidade recíproca.'],
 ['mpl','Médio-platonismo','ant','pla',4,'Retorno ao Platão dogmático, com elementos aristotélicos e estoicos; ponte para o neoplatonismo e para a teologia.'],
 ['neo','Neoplatonismo','ant','pla',4,'O Uno, a Inteligência e a Alma: a processão a partir do princípio e o retorno a ele.'],

 ['pgr','Patrística grega','med','teo',2,'Os Padres gregos articulam a fé cristã com o platonismo; da apologética à teologia mística.'],
 ['plat','Patrística latina','med','teo',3,'Os Padres latinos; em Agostinho, a síntese entre fé cristã e platonismo que dominará o Ocidente por oito séculos.'],
 ['tra','Mestres da transição latina','med','ari',5,'Preservam e transmitem a herança antiga à Idade Média: lógica, artes liberais e enciclopédias.'],
 ['car','Renascimento carolíngio','med','teo',4,'A escola palatina de Carlos Magno e a grande síntese neoplatônica de Erígena.'],
 ['fal','Falsafa: filosofia árabe-islâmica','med','ara',8,'Recepção e desenvolvimento de Aristóteles e do neoplatonismo em língua árabe; transmite ambos ao Ocidente latino.'],
 ['jud','Filosofia judaica medieval','med','ara',10,'Conciliação da Torá com a filosofia grega, em diálogo com a *falsafa*.'],
 ['esi','Escolástica inicial','med','ari',5,'A razão aplicada à fé (*fides quaerens intellectum*) e a querela dos universais.'],
 ['chv','Escolas de Chartres e de São Vítor','med','pla',3,'O platonismo cosmológico de Chartres e a mística especulativa dos vitorinos.'],
 ['mon','Mística monástica','med','teo',1,'Espiritualidade dos claustros, desconfiada da dialética das escolas urbanas.'],
 ['glo','Glosadores e comentadores','med','dir',12,'A redescoberta do *Corpus iuris civilis* em Bolonha e o nascimento da ciência jurídica europeia; o direito canônico de Graciano.'],
 ['alt','Alta escolástica','med','ari',5,'A síntese das universidades do séc. XIII entre teologia cristã e o Aristóteles recém-traduzido.'],
 ['oxf','Escola franciscana de Oxford','med','ari',7,'Metafísica da luz, ciência experimental e a sutileza de Duns Escoto.'],
 ['ave','Averroísmo latino','med','ara',8,'Leitura de Aristóteles segundo Averróis, com tese da unidade do intelecto; condenada em Paris (1270, 1277).'],
 ['ren','Mística renana','med','teo',2,'A mística especulativa dominicana: o fundo da alma e o desprendimento.'],
 ['via','Via moderna e nominalismo','med','ari',6,'Só existem indivíduos; navalha de Ockham, lógica terminista e nova física do ímpeto.'],
 ['ptm','Pensamento político tardo-medieval','med','dir',11,'A autonomia do poder secular diante do papado e a soberania do povo como legislador.'],

 ['hpl','Platonismo renascentista','mod','pla',3,'A recuperação de Platão e de Plotino em Florença e a coincidência dos opostos de Cusa.'],
 ['hum','Humanismo','mod','hum',6,'Filologia, retórica e a dignidade do homem; crítica dos textos e das instituições.'],
 ['pad','Aristotelismo paduano','mod','ari',7,'O Aristóteles naturalista de Pádua, sem tutela teológica: alma, método e lógica da ciência.'],
 ['nat','Filosofia da natureza renascentista','mod','hum',8,'Naturalismo especulativo: a natureza segundo seus próprios princípios, o universo infinito.'],
 ['rce','Ceticismo renascentista','mod','hel',10,'Retorno de Sexto Empírico: a crise das certezas que Descartes tentará superar.'],
 ['ref','Reforma protestante','mod','teo',1,'Sola fide, servo-arbítrio e a doutrina dos dois reinos; nova relação entre fé, consciência e poder.'],
 ['rpo','Pensamento político renascentista','mod','dir',12,'O Estado moderno pensado a partir de si: a virtù, a razão de Estado e a soberania.'],
 ['sal','Segunda escolástica (Salamanca)','mod','ari',9,'O tomismo renovado da Escola de Salamanca: direito natural, direito das gentes e economia moral.'],
 ['rci','Revolução científica','mod','cie',14,'Matematização da natureza e método experimental; o fim do cosmos aristotélico.'],
 ['rac','Racionalismo','mod','rac',5,'Conhecimento a partir de ideias claras e distintas e de princípios inatos da razão; sistema dedutivo.'],
 ['cam','Platonistas de Cambridge','mod','pla',3,'Platonismo cristão contra o materialismo de Hobbes e o voluntarismo.'],
 ['jus','Jusnaturalismo moderno e contratualismo','mod','dir',11,'Direito natural racional e independente da teologia; o Estado fundado num pacto entre indivíduos.'],
 ['emp','Empirismo britânico','mod','emp',13,'Todo conhecimento deriva da experiência; crítica das ideias inatas, da substância e da causalidade.'],
 ['ifr','Iluminismo francês','mod','ilu',9,'Os *philosophes* e a *Enciclopédia*: razão crítica, tolerância, ciência e reforma das instituições.'],
 ['ibr','Iluminismo britânico e escocês','mod','ilu',14,'Senso moral, simpatia, sociedade civil e economia política.'],
 ['ale','Aufklärung (Iluminismo alemão)','mod','ilu',6,'A escola leibniz-wolffiana e seus críticos: o ambiente de formação de Kant.'],
 ['cil','Críticos do Iluminismo e historicismo','mod','hum',2,'Vico, Hamann e Herder (os “três críticos” de Berlin), Jacobi e os contrarrevolucionários: linguagem, história, fé e tradição.'],
 ['cpe','Escola clássica do direito penal','mod','dir',12,'Legalidade, proporcionalidade e utilidade da pena: o direito penal liberal.'],
 ['lib','Liberalismo político','mod','dir',11,'Governo representativo, garantias individuais e limites ao poder, inclusive ao poder do povo.'],
 ['cri','Criticismo kantiano e primeira recepção','mod','rac',5,'A filosofia transcendental de Kant e os debates imediatos sobre seu fundamento (Reinhold, Schulze, Maimon).'],
 ['ida','Idealismo alemão','mod','pla',4,'Do eu de Fichte ao absoluto de Schelling e Hegel: o sistema da razão depois de Kant.'],
 ['rom','Primeiro romantismo','mod','pla',2,'O círculo de Jena: poesia, fragmento, ironia e a religião como sentimento do infinito.'],
 ['uti','Utilitarismo','con','emp',13,'O certo é o que maximiza a felicidade agregada; reforma da legislação pelo cálculo das consequências.'],

 ['cid','Críticos do idealismo','con','vid',6,'Reações ao sistema hegeliano: a vontade (Schopenhauer), o indivíduo existente (Kierkegaard), o realismo (Herbart) e a lógica aristotélica (Trendelenburg).'],
 ['heg','Escola hegeliana','con','pla',4,'Discípulos e editores de Hegel (direita e centro): a guarda e a edição do sistema.'],
 ['jhe','Jovens hegelianos','con','mat',7,'A esquerda hegeliana: crítica da religião e do Estado prussiano com as armas da dialética.'],
 ['mar','Marxismo','con','mat',8,'Materialismo histórico: a crítica da economia política e a teoria do Estado e do direito como superestrutura.'],
 ['pos','Positivismo e evolucionismo','con','cie',14,'Só os fatos e suas leis; a sociologia como ciência e a evolução como lei universal.'],
 ['ehd','Escola histórica e pandectística','con','dir',11,'O direito como produto do espírito do povo; a jurisprudência dos conceitos e sua crise teleológica.'],
 ['vid','Filosofia da vida','con','vid',5,'A vida, a história e a vontade de potência contra o primado da razão abstrata.'],
 ['esp','Espiritualismo francês','con','vid',3,'Consciência, hábito, liberdade e duração contra o mecanicismo.'],
 ['nk','Neokantismo','con','rac',6,'“Voltar a Kant”: Marburgo (lógica da ciência) e Baden (valores e ciências da cultura); forte presença na teoria do direito.'],
 ['bre','Escola de Brentano','con','vid',7,'Psicologia descritiva e intencionalidade: a fonte comum da fenomenologia e da escola polonesa.'],
 ['fen','Fenomenologia','con','vid',5,'“Às coisas mesmas”: descrição das estruturas da consciência intencional e de suas objetividades.'],
 ['exi','Filosofia da existência e existencialismo','con','vid',4,'A existência precede a essência: liberdade, angústia, finitude e responsabilidade.'],
 ['hrm','Hermenêutica filosófica','con','vid',3,'Compreender é o modo de ser do homem: tradição, linguagem e interpretação, também no direito.'],
 ['ffr','Fenomenologia francesa tardia','con','vid',2,'O Outro, a vida e o dado: a fenomenologia nos limites da teologia.'],
 ['hfr','Recepção francesa de Hegel','con','pla',3,'Os cursos e livros dos anos 1930–40 que fizeram de Hegel o centro da filosofia francesa do pós-guerra.'],
 ['ide','Neoidealismos','con','pla',1,'Idealismo absoluto na Grã-Bretanha, nos Estados Unidos e na Itália, de inspiração hegeliana.'],
 ['pro','Filosofia do processo','con','pla',2,'A realidade como processo e acontecimento, não como substância.'],
 ['pra','Pragmatismo clássico','con','pra',12,'O sentido de uma ideia está em suas consequências práticas; a investigação como processo social.'],
 ['npr','Neopragmatismo e escola de Pittsburgh','con','pra',12,'Crítica do “mito do dado”, inferencialismo e retorno a Kant e Hegel dentro da tradição analítica.'],
 ['ana','Fundadores da filosofia analítica','con','emp',13,'Análise lógica da linguagem: a nova lógica de Frege e Russell, o senso comum de Moore e o *Tractatus*.'],
 ['lvo','Escola de Lvov-Varsóvia','con','emp',15,'Lógica, semântica e clareza: a escola polonesa nascida de Brentano.'],
 ['emc','Empiriocriticismo e convencionalismo','con','cie',15,'A ciência como economia do pensamento e como sistema de convenções; precursores do Círculo de Viena.'],
 ['cv','Positivismo lógico','con','emp',14,'Círculos de Viena e de Berlim: verificacionismo e unidade da ciência; a metafísica como contrassenso.'],
 ['lor','Filosofia da linguagem ordinária','con','emp',14,'Oxford no pós-guerra: o significado está no uso; atos de fala e implicaturas.'],
 ['ppa','Analítica pós-positivista','con','emp',13,'Depois dos “dois dogmas”: holismo, naturalismo, semântica dos mundos possíveis e o retorno da metafísica.'],
 ['men','Filosofia da mente','con','emp',15,'Identidade mente-cérebro, funcionalismo, eliminativismo e o problema difícil da consciência.'],
 ['fci','Filosofia da ciência pós-positivista','con','cie',16,'Falseabilidade, paradigmas, programas de pesquisa e o anarquismo metodológico.'],
 ['efr','Epistemologia histórica francesa','con','cie',10,'A ciência pensada em sua história: rupturas, obstáculos e normas.'],
 ['psi','Psicanálise','con','vid',9,'O inconsciente: nascida na clínica, transformou a filosofia contemporânea.'],
 ['fra','Escola de Frankfurt (teoria crítica)','con','mat',8,'Do Instituto de Pesquisa Social (1923) às gerações de Habermas e Honneth: razão, dominação, comunicação e reconhecimento.'],
 ['mao','Marxismo ocidental','con','mat',9,'O marxismo filosófico europeu: consciência de classe, hegemonia, utopia e estrutura.'],
 ['str','Estruturalismo','con','est',10,'O sentido como efeito de relações diferenciais num sistema: da linguística à antropologia.'],
 ['pst','Pós-estruturalismo','con','est',9,'Diferença, poder, desconstrução: a crítica das totalidades e do sujeito fundador.'],
 ['rad','Pensamento político radical','con','mat',10,'Depois de 1968: o político, a hegemonia, o evento, a biopolítica e o poder constituinte.'],
 ['tpo','Teoria política do século XX','con','dir',11,'Totalitarismo, liberdade, ordem espontânea e retorno aos clássicos.'],
 ['tes','Teoria do Estado e da Constituição','con','dir',10,'Da teoria geral do Estado de Jellinek à grande disputa de Weimar sobre a constituição e sua guarda.'],
 ['pju','Positivismo jurídico','con','dir',11,'O direito como ele é, distinto da moral: comando, norma fundamental, regra de reconhecimento.'],
 ['rju','Realismo jurídico','con','dir',12,'O direito como o que os tribunais efetivamente fazem (americano) ou como fato psicossocial (escandinavo).'],
 ['nto','Neotomismo','con','ari',6,'O renascimento de Tomás de Aquino no séc. XX: metafísica do ser, direitos humanos e direito natural clássico.'],
 ['njn','Jusnaturalismo e pós-positivismo','con','dir',12,'Moralidade interna do direito, princípios e ponderação, bens humanos básicos.'],
 ['sis','Teoria dos sistemas','con','cie',12,'A sociedade como sistema de comunicações e o direito como subsistema autopoiético.'],
 ['dpa','Dogmática penal alemã','con','dir',13,'A teoria do delito: das normas de Binding ao finalismo de Welzel e aos funcionalismos de Roxin e Jakobs.'],
 ['epo','Escola positiva italiana','con','dir',13,'O delinquente, não o delito: determinismo, criminologia e defesa social.'],
 ['ean','Ética analítica e metaética','con','emp',16,'Do intuicionismo e do emotivismo à ética das virtudes, ao consequencialismo e ao construtivismo.'],
 ['pan','Filosofia política analítica','con','dir',14,'Justiça distributiva depois de Rawls: liberalismo igualitário, libertarismo, capacidades.'],
 ['com','Comunitarismo','con','dir',13,'Crítica do sujeito desenraizado do liberalismo: comunidade, tradição e virtude.'],
 ['fem','Filosofia feminista','con','fem',10,'Gênero, diferença sexual e dominação, também no Estado e no direito.'],
 ['pco','Pensamento pós-colonial e decolonial','con','dec',11,'A crítica do eurocentrismo e da colonialidade do saber e do poder.'],
 ['eaa','Estética analítica','con','emp',17,'O que é arte? Da forma expressiva à definição institucional.']
];

/* Filósofos: [id, nome, nascimento, morte (null = vivo), corrente, áreas, aproximado, obras (separadas por "; "; "!" = não é título), nota, período (opcional)] */
const FILOS = [
/* ---------- ANTIGA ---------- */
['tales','Tales de Mileto',-624,-546,'mil','MC',1,'!Nenhum escrito conservado','Aristóteles o tem por iniciador da filosofia: a água como *arché*.'],
['anaximandro','Anaximandro',-610,-546,'mil','MC',1,'Sobre a natureza (um fragmento)','O *ápeiron*, o ilimitado, como princípio.'],
['anaximenes','Anaxímenes',-586,-526,'mil','MC',1,'!Fragmentos','O ar como princípio; rarefação e condensação.'],
['pitagoras','Pitágoras de Samos',-570,-495,'pit','MCTR',1,'!Nada escreveu',''],
['filolau','Filolau de Crotona',-470,-385,'pit','MC',1,'!Fragmentos','Primeiro pitagórico a pôr a doutrina por escrito.'],
['arquitas','Arquitas de Tarento',-428,-347,'pit','MCP',1,'!Fragmentos','Matemático e governante de Tarento; amigo de Platão.'],
['heraclito','Heráclito de Éfeso',-535,-475,'her','MET',1,'!Fragmentos','Não pertenceu à escola de Mileto, embora manuais antigos o agrupem entre os “jônicos”.'],
['cratilo','Crátilo',-450,-390,'her','MG',1,'!Nada escreveu','Segundo Aristóteles, o primeiro mestre de Platão.'],
['xenofanes','Xenófanes de Colofão',-570,-475,'ele','MER',1,'!Fragmentos','Tido como precursor dos eleatas; sua filiação à escola é discutida.'],
['parmenides','Parmênides de Eleia',-515,-450,'ele','MEL',1,'Sobre a natureza (poema)',''],
['zenao_e','Zenão de Eleia',-490,-430,'ele','ML',1,'!Paradoxos, conhecidos por testemunhos',''],
['melisso','Melisso de Samos',-470,-430,'ele','M',1,'Sobre a natureza ou sobre o ser (fragmentos)',''],
['empedocles','Empédocles de Agrigento',-494,-434,'plu','MCR',1,'Sobre a natureza; Purificações',''],
['anaxagoras','Anaxágoras de Clazômenas',-500,-428,'plu','MC',1,'Sobre a natureza (fragmentos)','Leva a filosofia para Atenas; o *Noûs* ordenador.'],
['leucipo','Leucipo',-480,-420,'ato','MC',1,'A grande ordem do mundo (atribuída)','Sua existência histórica já foi posta em dúvida.'],
['democrito','Demócrito de Abdera',-460,-370,'ato','MECT',1,'!Fragmentos, sobretudo éticos',''],
['protagoras','Protágoras de Abdera',-490,-420,'sof','ETP',1,'Verdade (fragmentos)','“O homem é a medida de todas as coisas.”'],
['gorgias','Górgias de Leontinos',-483,-375,'sof','MEG',1,'Sobre o não-ser; Elogio de Helena',''],
['prodico','Pródico de Ceos',-465,-395,'sof','GT',1,'As Horas (fragmentos)',''],
['antifonte','Antifonte',-480,-411,'sof','PD',1,'Sobre a verdade (fragmentos)','A oposição entre *nómos* e *phýsis*, pré-história do direito natural.'],
['trasimaco','Trasímaco',-459,-400,'sof','PD',1,'!Fragmentos','Interlocutor do livro I da *República*: o justo como interesse do mais forte.'],
['socrates','Sócrates',-470,-399,'soc','TEP',0,'!Nada escreveu; conhecido por Platão, Xenofonte e Aristófanes',''],
['antistenes','Antístenes',-445,-365,'smen','T',1,'!Fragmentos','Fundador do cinismo.'],
['aristipo','Aristipo de Cirene',-435,-356,'smen','T',1,'!Testemunhos','Fundador da escola cirenaica (hedonismo).'],
['euclides_m','Euclides de Mégara',-435,-365,'smen','ML',1,'!Testemunhos','Fundador da escola megárica.'],
['diogenes_s','Diógenes de Sinope',-412,-323,'smen','TP',1,'!Testemunhos',''],
['eubulides','Eubulides de Mileto',-390,-330,'smen','L',1,'!Testemunhos','Paradoxos do mentiroso e do monte.'],
['crates','Crates de Tebas',-365,-285,'smen','T',1,'!Fragmentos','Mestre de Zenão de Cítio.'],
['estilpo','Estilpo de Mégara',-360,-280,'smen','LT',1,'!Testemunhos',''],
['diodoro','Diodoro Cronos',-350,-284,'smen','LM',1,'!Argumento dominador, por testemunhos',''],
['platao','Platão',-428,-348,'aca','MELGTPDSAR',1,'República; Fédon; Banquete; Teeteto; Timeu; Leis','Datas usuais: 428/427–348/347 a.C.'],
['espeusipo','Espeusipo',-408,-339,'aca','M',1,'!Fragmentos','Sobrinho de Platão e seu sucessor na Academia.'],
['xenocrates','Xenócrates',-396,-314,'aca','MT',1,'!Fragmentos',''],
['polemon','Pólemon',-350,-270,'aca','T',1,'!Fragmentos','Mestre de Zenão de Cítio e de Arcesilau.'],
['aristoteles','Aristóteles',-384,-322,'lic','MELCTPDSAN',0,'Órganon; Física; Metafísica; Sobre a alma; Ética a Nicômaco; Política; Retórica; Poética',''],
['teofrasto','Teofrasto',-371,-287,'lic','CLT',1,'Caracteres; História das plantas',''],
['estratao','Estratão de Lâmpsaco',-335,-269,'lic','C',1,'!Fragmentos',''],
['alexandre_af','Alexandre de Afrodísias',150,215,'lic','MN',1,'Sobre a alma; Sobre o destino; !comentários a Aristóteles','O maior comentador antigo de Aristóteles.'],
['pirro','Pirro de Élis',-360,-270,'cet','ET',1,'!Nada escreveu',''],
['timon','Tímon de Fliunte',-320,-230,'cet','E',1,'Sátiras (Sílloi, fragmentos)',''],
['enesidemo','Enesidemo',-80,-10,'cet','E',1,'Discursos pirrônicos (perdidos)','Datas muito incertas (séc. I a.C.).'],
['sexto','Sexto Empírico',160,210,'cet','EL',1,'Hipotiposes pirrônicas; Contra os professores',''],
['arcesilau','Arcesilau',-316,-241,'acc','E',1,'!Nada escreveu','Faz da Academia uma escola cética.'],
['carneades','Carnéades',-214,-129,'acc','EPD',1,'!Nada escreveu','Em Roma (155 a.C.), discursa num dia a favor e no outro contra a justiça.'],
['clitomaco','Clitômaco',-187,-110,'acc','E',1,'!Obras perdidas',''],
['filo_l','Filo de Larissa',-159,-84,'acc','E',1,'Livros romanos (perdidos)','Último escolarca da Academia; mestre de Cícero.'],
['cicero','Marco Túlio Cícero',-106,-43,'acc','TPDE',0,'Da república; Das leis; Acadêmicos; Dos deveres','Acadêmico, com forte componente estoico; principal transmissor da filosofia grega ao latim.'],
['zenao_c','Zenão de Cítio',-334,-262,'est','ETLPC',1,'República (perdida)','Fundador do Pórtico.'],
['cleantes','Cleantes de Assos',-330,-230,'est','TR',1,'Hino a Zeus',''],
['crisipo','Crisipo de Solos',-279,-206,'est','LETC',1,'!Fragmentos de centenas de obras perdidas','Sistematizador do estoicismo antigo.'],
['panecio','Panécio de Rodes',-185,-109,'est','TP',1,'Sobre os deveres (perdido)','Estoicismo médio; fonte do *De officiis* de Cícero.'],
['posidonio','Posidônio de Apameia',-135,-51,'est','CTH',1,'!Fragmentos',''],
['seneca','Sêneca',-4,65,'est','TP',1,'Cartas a Lucílio; Sobre a clemência; Sobre a ira',''],
['musonio','Musônio Rufo',30,100,'est','T',1,'!Diatribes registradas por alunos','Mestre de Epicteto.'],
['epicteto','Epicteto',50,135,'est','T',1,'Diatribes; Manual (registrados por Arriano)',''],
['marco_aurelio','Marco Aurélio',121,180,'est','T',0,'Meditações',''],
['epicuro','Epicuro de Samos',-341,-270,'epi','TMC',0,'Carta a Meneceu; Carta a Heródoto; Máximas principais',''],
['metrodoro','Metrodoro de Lâmpsaco',-331,-278,'epi','T',1,'!Fragmentos',''],
['hermarco','Hermarco',-325,-250,'epi','TD',1,'!Fragmentos','Sucessor de Epicuro; sua genealogia da lei contra o homicídio sobrevive em Porfírio.'],
['filodemo','Filodemo de Gádara',-110,-30,'epi','TSA',1,'Sobre a poesia; Sobre a música (papiros de Herculano)',''],
['lucrecio','Lucrécio',-99,-55,'epi','MCT',1,'Da natureza das coisas',''],
['antioco','Antíoco de Ascálon',-125,-68,'mpl','ET',1,'!Fragmentos','Rompe com o ceticismo da Academia: marco inicial do médio-platonismo; mestre de Cícero.'],
['filon','Fílon de Alexandria',-20,50,'mpl','RM',1,'Sobre a criação do mundo; Alegorias das leis','Lê a Escritura por alegoria, com categorias platônicas e estoicas.'],
['plutarco','Plutarco de Queroneia',46,119,'mpl','TRH',1,'Moralia; Vidas paralelas',''],
['numenio','Numênio de Apameia',150,200,'mpl','MR',1,'Sobre o bem (fragmentos)','Datas incertas (séc. II).'],
['amonio','Amônio Sacas',175,242,'neo','M',1,'!Nada escreveu','Mestre de Plotino.'],
['plotino','Plotino',204,270,'neo','MRS',0,'Enéadas (ed. Porfírio)',''],
['porfirio','Porfírio',234,305,'neo','LMR',1,'Isagoge; Vida de Plotino; Contra os cristãos','A *Isagoge* fixa o problema dos universais para a Idade Média.'],
['jamblico','Jâmblico',245,325,'neo','MR',1,'Sobre os mistérios',''],
['hipatia','Hipátia de Alexandria',355,415,'neo','MC',1,'!Comentários matemáticos perdidos',''],
['proclo','Proclo',412,485,'neo','MR',0,'Elementos de teologia; Comentário ao Parmênides',''],
['damascio','Damáscio',458,538,'neo','M',1,'Problemas e soluções sobre os primeiros princípios','Último escolarca da escola neoplatônica de Atenas, fechada por Justiniano em 529.'],
['simplicio','Simplício',480,560,'neo','MC',1,'!Comentários a Aristóteles','Preserva grande parte dos fragmentos pré-socráticos.'],

/* ---------- MEDIEVAL ---------- */
['justino','Justino Mártir',100,165,'pgr','R',1,'Apologias; Diálogo com Trifão',''],
['clemente','Clemente de Alexandria',150,215,'pgr','RT',1,'Protréptico; Pedagogo; Stromata',''],
['origenes','Orígenes',185,254,'pgr','RM',1,'Sobre os princípios; Contra Celso',''],
['gregorio_n','Gregório de Nissa',335,395,'pgr','RM',1,'Sobre a criação do homem; Vida de Moisés',''],
['dionisio','Pseudo-Dionísio Areopagita',475,525,'pgr','RMS',1,'Nomes divinos; Teologia mística; Hierarquia celeste','Autor anônimo de c. 500 que se apresentou como discípulo de Paulo.'],
['maximo','Máximo, o Confessor',580,662,'pgr','RM',0,'Ambigua; Questões a Talássio',''],
['damasceno','João Damasceno',675,749,'pgr','R',1,'A fonte do conhecimento',''],
['tertuliano','Tertuliano',155,220,'plat','RD',1,'Apologético; Prescrição contra os hereges',''],
['ambrosio','Ambrósio de Milão',340,397,'plat','RT',1,'Sobre os deveres dos ministros',''],
['agostinho','Agostinho de Hipona',354,430,'plat','MERTPHGS',0,'Confissões; O livre-arbítrio; A Trindade; A cidade de Deus','Vive no fim da Antiguidade, mas é estudado como fundador da filosofia medieval latina.'],
['boecio','Boécio',480,524,'tra','LMTR',1,'A consolação da filosofia; Opuscula sacra; !comentários a Porfírio e Aristóteles','“O último dos romanos, o primeiro dos escolásticos.”'],
['cassiodoro','Cassiodoro',485,585,'tra','R',1,'Instituições',''],
['isidoro','Isidoro de Sevilha',560,636,'tra','RD',1,'Etimologias','As *Etimologias* transmitem as definições de direito natural, das gentes e civil.'],
['beda','Beda, o Venerável',673,735,'tra','RH',0,'História eclesiástica do povo inglês',''],
['alcuino','Alcuíno de York',735,804,'car','LR',1,'Dialética; Retórica',''],
['erigena','João Escoto Erígena',815,877,'car','MR',1,'Periphyseon (Da divisão da natureza)',''],
['kindi','Al-Kindi',801,873,'fal','MR',1,'Sobre a filosofia primeira',''],
['farabi','Al-Farabi',870,950,'fal','MLP',1,'A cidade virtuosa; Enumeração das ciências','Chamado “segundo mestre”, depois de Aristóteles.'],
['avicena','Avicena (Ibn Sina)',980,1037,'fal','MNLC',0,'O livro da cura; O cânone da medicina',''],
['ghazali','Al-Ghazali',1058,1111,'fal','RE',0,'A incoerência dos filósofos','Teólogo e crítico da *falsafa*, incluído aqui pelo seu papel no debate.'],
['avempace','Avempace (Ibn Bajja)',1085,1138,'fal','PN',1,'O regime do solitário',''],
['tufayl','Ibn Tufayl',1105,1185,'fal','ER',1,'O filósofo autodidata (Hayy ibn Yaqzan)','Apresentou Averróis ao califa almôada.'],
['averroes','Averróis (Ibn Rushd)',1126,1198,'fal','MNRD',0,'A incoerência da incoerência; Tratado decisivo; !comentários a Aristóteles','Também jurista e cádi; para os latinos, “o Comentador”.'],
['ibn_khaldun','Ibn Khaldun',1332,1406,'fal','HP',0,'Muqaddimah (1377)','Uma ciência da sociedade e da história antes da sociologia.'],
['saadia','Saadia Gaon',882,942,'jud','R',0,'Livro das crenças e opiniões',''],
['gabirol','Ibn Gabirol (Avicebron)',1021,1058,'jud','M',1,'A fonte da vida (Fons vitae)','Os latinos o liam como autor muçulmano ou cristão.'],
['halevi','Judá Halevi',1075,1141,'jud','R',1,'O Cuzari',''],
['maimonides','Maimônides',1138,1204,'jud','RMD',0,'Mishné Torá; Guia dos perplexos',''],
['gersonides','Gersônides',1288,1344,'jud','MC',0,'As guerras do Senhor',''],
['crescas','Hasdai Crescas',1340,1411,'jud','MR',1,'A luz do Senhor','Sua crítica da física aristotélica foi lida por Espinosa.'],
['anselmo','Anselmo de Cantuária',1033,1109,'esi','RM',0,'Monológio; Proslógio; Por que Deus se fez homem',''],
['roscelino','Roscelino de Compiègne',1050,1125,'esi','LM',1,'Carta a Abelardo','Tido como fundador do nominalismo: o universal como *flatus vocis*.'],
['champeaux','Guilherme de Champeaux',1070,1121,'esi','LM',1,'Sentenças','Realista; fundou a abadia de São Vítor.'],
['abelardo','Pedro Abelardo',1079,1142,'esi','LTR',0,'Sic et non; Lógica “Ingredientibus”; Ética (Conhece-te a ti mesmo)',''],
['lombardo','Pedro Lombardo',1096,1160,'esi','R',1,'Livro das sentenças','Manual de teologia comentado por todos os mestres até o séc. XVI.'],
['heloisa','Heloísa',1100,1164,'esi','TR',1,'Cartas a Abelardo',''],
['bernardo_ch','Bernardo de Chartres',1070,1124,'chv','M',1,'!Testemunhos','“Anões nos ombros de gigantes”, segundo João de Salisbury.'],
['porretano','Gilberto Porretano',1075,1154,'chv','ML',1,'!Comentários aos Opuscula de Boécio',''],
['hugo_sv','Hugo de São Vítor',1096,1141,'chv','RE',1,'Didascálicon',''],
['ricardo_sv','Ricardo de São Vítor',1110,1173,'chv','R',1,'A Trindade; Benjamin maior',''],
['salisbury','João de Salisbury',1115,1180,'chv','PD',1,'Policraticus (1159); Metalogicon','Primeira teoria medieval desenvolvida do tiranicídio.'],
['bernardo_cl','Bernardo de Claraval',1090,1153,'mon','R',0,'Sobre os graus da humildade; Sermões sobre o Cântico','Adversário de Abelardo no Concílio de Sens.'],
['hildegarda','Hildegarda de Bingen',1098,1179,'mon','RC',0,'Scivias; Physica',''],
['joaquim','Joaquim de Fiore',1135,1202,'mon','HR',1,'Concórdia do Antigo e do Novo Testamento','As três idades da história: do Pai, do Filho e do Espírito.'],
['irnerio','Irnério',1050,1130,'glo','D',1,'!Glosas ao Corpus iuris civilis','Fundador da escola jurídica de Bolonha.'],
['graciano','Graciano',1100,1160,'glo','DR',1,'Decreto (Concórdia dos cânones discordantes, c. 1140)','Datas de vida desconhecidas.'],
['acursio','Acúrsio',1182,1263,'glo','D',1,'Glosa ordinária (Magna glosa)',''],
['bartolo','Bártolo de Sassoferrato',1313,1357,'glo','DP',0,'Tratado sobre o tirano; !comentários ao Corpus iuris','Expoente dos comentadores (pós-glosadores).'],
['baldo','Baldo de Ubaldis',1327,1400,'glo','D',0,'!Comentários ao Código e ao Digesto',''],
['hales','Alexandre de Hales',1185,1245,'alt','R',1,'Glosa às Sentenças','Primeiro mestre a tomar as *Sentenças* como manual.'],
['alberto','Alberto Magno',1200,1280,'alt','MCN',1,'Sobre os animais; !paráfrases de todo Aristóteles',''],
['boaventura','Boaventura de Bagnoregio',1221,1274,'alt','RM',1,'Itinerário da mente para Deus; Redução das artes à teologia','Agostinismo franciscano.'],
['tomas','Tomás de Aquino',1225,1274,'alt','MERTPDN',1,'O ente e a essência; Suma contra os gentios; Suma teológica','O tratado da lei (I-II, q. 90–108) é a matriz do jusnaturalismo clássico.'],
['gand','Henrique de Gand',1217,1293,'alt','ME',1,'Quodlibeta; Suma',''],
['lulio','Raimundo Lúlio',1232,1316,'alt','LR',1,'Ars magna','Figura isolada; sua arte combinatória será lida por Leibniz.'],
['egidio','Egídio Romano',1243,1316,'alt','PM',1,'Do governo dos príncipes; Do poder eclesiástico',''],
['grosseteste','Roberto Grosseteste',1175,1253,'oxf','CM',1,'Sobre a luz; !comentário aos Analíticos posteriores',''],
['rbacon','Roger Bacon',1219,1292,'oxf','CG',1,'Opus maius',''],
['escoto','João Duns Escoto',1266,1308,'oxf','MEL',1,'Ordinatio; Tratado do primeiro princípio','Univocidade do ente; *haecceitas*.'],
['siger','Siger de Brabante',1240,1284,'ave','MN',1,'Questões sobre o terceiro livro Da alma','Alvo das condenações de Paris de 1270 e 1277.'],
['boecio_d','Boécio de Dácia',1240,1284,'ave','T',1,'Sobre o sumo bem',''],
['eckhart','Mestre Eckhart',1260,1328,'ren','RM',1,'Sermões alemães; Opus tripartitum',''],
['suso','Henrique Suso',1295,1366,'ren','R',1,'Livrinho da sabedoria eterna',''],
['tauler','João Tauler',1300,1361,'ren','R',1,'!Sermões',''],
['ockham','Guilherme de Ockham',1287,1347,'via','LMEPG',1,'Suma de lógica; Ordinatio; Diálogo','Também decisivo para a teoria do direito subjetivo e para a crítica do poder papal.'],
['buridan','João Buridano',1300,1361,'via','LCT',1,'Súmulas de dialética; Questões sobre a Física',''],
['rimini','Gregório de Rímini',1300,1358,'via','ER',1,'!Lectura sobre as Sentenças',''],
['autrecourt','Nicolau de Autrécourt',1299,1369,'via','E',1,'Cartas a Bernardo de Arezzo','Crítica da inferência causal; já chamado de “Hume medieval”.'],
['oresme','Nicolau Oresme',1320,1382,'via','CP',1,'Livro do céu e do mundo; Tratado sobre a moeda',''],
['dante','Dante Alighieri',1265,1321,'ptm','PSA',0,'Convívio; Monarquia; Divina comédia',''],
['marsilio','Marsílio de Pádua',1275,1342,'ptm','PD',1,'O defensor da paz (1324)',''],
['pizan','Christine de Pizan',1364,1430,'ptm','PT',1,'A cidade das damas (1405); Livro do corpo político',''],

/* ---------- MODERNA ---------- */
['cusano','Nicolau de Cusa',1401,1464,'hpl','MER',0,'A douta ignorância (1440); A visão de Deus','Medieval pela formação, moderno pela posteridade.'],
['ficino','Marsílio Ficino',1433,1499,'hpl','MRS',0,'Teologia platônica; !traduções latinas de Platão e Plotino',''],
['pico','Pico della Mirandola',1463,1494,'hpl','TR',0,'Discurso sobre a dignidade do homem; Novecentas teses',''],
['valla','Lorenzo Valla',1407,1457,'hum','GLD',0,'Sobre a falsa doação de Constantino (1440); Elegâncias da língua latina',''],
['erasmo','Erasmo de Roterdã',1466,1536,'hum','TR',1,'Elogio da loucura (1511); Do livre-arbítrio (1524)',''],
['tmore','Thomas More',1478,1535,'hum','P',0,'Utopia (1516)',''],
['pomponazzi','Pietro Pomponazzi',1462,1525,'pad','NR',0,'Tratado sobre a imortalidade da alma (1516)',''],
['zabarella','Jacopo Zabarella',1533,1589,'pad','LC',0,'Opera logica (1578)','Segundo a tese de J. H. Randall (discutida), fonte do método resolutivo-compositivo de Galileu.'],
['telesio','Bernardino Telésio',1509,1588,'nat','C',0,'Da natureza das coisas segundo seus próprios princípios',''],
['bruno','Giordano Bruno',1548,1600,'nat','MCR',0,'Da causa, princípio e uno; Do infinito, universo e mundos (1584)','Queimado pela Inquisição em Roma, em 1600.'],
['campanella','Tommaso Campanella',1568,1639,'nat','PCR',0,'A cidade do sol',''],
['montaigne','Michel de Montaigne',1533,1592,'rce','ET',0,'Ensaios (1580–88)',''],
['sanches','Francisco Sanches',1551,1623,'rce','E',0,'Que nada se sabe (Quod nihil scitur, 1581)','Médico e filósofo ibérico (Tui ou Braga), professor em Toulouse.'],
['charron','Pierre Charron',1541,1603,'rce','ET',0,'Da sabedoria (1601)',''],
['lutero','Martinho Lutero',1483,1546,'ref','RP',0,'Da liberdade cristã (1520); Da autoridade secular (1523); Do servo arbítrio (1525)',''],
['melanchthon','Filipe Melanchthon',1497,1560,'ref','RT',0,'Loci communes',''],
['calvino','João Calvino',1509,1564,'ref','RP',0,'Institutas da religião cristã',''],
['maquiavel','Nicolau Maquiavel',1469,1527,'rpo','PH',0,'O príncipe (1513); Discursos sobre a primeira década de Tito Lívio',''],
['bodin','Jean Bodin',1530,1596,'rpo','PDH',0,'Os seis livros da República (1576)','Primeira teoria sistemática da soberania.'],
['althusius','Johannes Althusius',1563,1638,'rpo','PD',0,'Politica methodice digesta (1603)',''],
['vitoria','Francisco de Vitória',1483,1546,'sal','DPT',1,'!Relectiones: Sobre os índios; Sobre o direito de guerra','Fundador da Escola de Salamanca; precursor do direito internacional.'],
['soto','Domingo de Soto',1494,1560,'sal','DT',0,'Da justiça e do direito (1553–54)',''],
['molina','Luis de Molina',1535,1600,'sal','RDT',0,'Concórdia (1588); Da justiça e do direito',''],
['suarez','Francisco Suárez',1548,1617,'sal','MDP',0,'Disputas metafísicas (1597); Das leis (1612)','As *Disputas* foram manual de metafísica até nas universidades protestantes alemãs.'],
['copernico','Nicolau Copérnico',1473,1543,'rci','C',0,'Das revoluções das órbitas celestes (1543)',''],
['fbacon','Francis Bacon',1561,1626,'rci','CE',0,'Novo órganon (1620); Nova Atlântida',''],
['galileu','Galileu Galilei',1564,1642,'rci','CE',0,'O ensaiador (1623); Diálogo sobre os dois máximos sistemas (1632); Duas novas ciências (1638)',''],
['kepler','Johannes Kepler',1571,1630,'rci','C',0,'Astronomia nova (1609); Harmonia do mundo (1619)',''],
['gassendi','Pierre Gassendi',1592,1655,'rci','CME',0,'Objeções às Meditações (1641); Syntagma philosophicum','Restaura o atomismo epicurista.'],
['boyle','Robert Boyle',1627,1691,'rci','CM',0,'O químico cético (1661)',''],
['newton','Isaac Newton',1643,1727,'rci','CM',0,'Princípios matemáticos da filosofia natural (1687); Óptica (1704)',''],
['descartes','René Descartes',1596,1650,'rac','MENC',0,'Discurso do método (1637); Meditações (1641); Princípios da filosofia (1644); As paixões da alma',''],
['arnauld','Antoine Arnauld',1612,1694,'rac','LGR',0,'A lógica de Port-Royal (com Nicole, 1662); Gramática geral',''],
['elisabeth','Elisabeth da Boêmia',1618,1680,'rac','NT',0,'!Correspondência com Descartes (1643–49)','Formula a objeção clássica à interação entre alma e corpo.'],
['pascal','Blaise Pascal',1623,1662,'rac','RE',0,'Cartas provinciais (1656–57); Pensamentos (póst.)','Crítico interno do racionalismo cartesiano.'],
['geulincx','Arnold Geulincx',1624,1669,'rac','MT',0,'Ética','Ocasionalismo.'],
['espinosa','Baruch de Espinosa',1632,1677,'rac','MENTPR',0,'Tratado teológico-político (1670); Ética (póst. 1677); Tratado político',''],
['malebranche','Nicolas Malebranche',1638,1715,'rac','MR',0,'Da busca da verdade (1674–75)',''],
['leibniz','Gottfried Wilhelm Leibniz',1646,1716,'rac','MLNRD',0,'Discurso de metafísica (1686); Novos ensaios; Teodiceia (1710); Monadologia (1714)','Formado em direito; escreveu sobre lógica jurídica e casos perplexos.'],
['hmore','Henry More',1614,1687,'cam','MR',0,'Enchiridion metaphysicum (1671)',''],
['cudworth','Ralph Cudworth',1617,1688,'cam','MT',0,'O verdadeiro sistema intelectual do universo (1678)',''],
['conway','Anne Conway',1631,1679,'cam','M',0,'Princípios da mais antiga e moderna filosofia (póst. 1690)','Lida por Leibniz.'],
['grocio','Hugo Grócio',1583,1645,'jus','DP',0,'O mar livre (1609); Do direito da guerra e da paz (1625)',''],
['hobbes','Thomas Hobbes',1588,1679,'jus','PDMN',0,'Do cidadão (1642); Leviatã (1651); Do corpo (1655)',''],
['pufendorf','Samuel Pufendorf',1632,1694,'jus','DP',0,'Do direito da natureza e das gentes (1672); Dos deveres do homem e do cidadão',''],
['thomasius','Christian Thomasius',1655,1728,'jus','DP',0,'Fundamentos do direito da natureza e das gentes (1705)','Separa direito (coercível) e moral; combateu os processos de bruxaria.'],
['rousseau','Jean-Jacques Rousseau',1712,1778,'jus','PTDH',0,'Discurso sobre a desigualdade (1755); Do contrato social (1762); Emílio (1762)','Também figura do Iluminismo francês, e seu crítico.'],
['locke','John Locke',1632,1704,'emp','EPDNR',0,'Carta sobre a tolerância (1689); Dois tratados sobre o governo (1689); Ensaio sobre o entendimento humano (1689)',''],
['berkeley','George Berkeley',1685,1753,'emp','MEN',0,'Tratado sobre os princípios do conhecimento humano (1710); Três diálogos (1713)',''],
['hume','David Hume',1711,1776,'emp','ENTPRSHC',0,'Tratado da natureza humana (1739–40); Investigação sobre o entendimento humano (1748); Diálogos sobre a religião natural (póst.)',''],
['bayle','Pierre Bayle',1647,1706,'ifr','RE',0,'Dicionário histórico e crítico (1697)','Precursor: ceticismo e tolerância.'],
['montesquieu','Montesquieu',1689,1755,'ifr','PDH',0,'Cartas persas (1721); O espírito das leis (1748)',''],
['voltaire','Voltaire',1694,1778,'ifr','RHP',0,'Cartas filosóficas (1734); Tratado sobre a tolerância (1763); Dicionário filosófico',''],
['chatelet','Émilie du Châtelet',1706,1749,'ifr','CM',0,'Instituições de física (1740); !tradução comentada dos Principia de Newton',''],
['lamettrie','Julien Offray de La Mettrie',1709,1751,'ifr','NM',0,'O homem-máquina (1747)',''],
['diderot','Denis Diderot',1713,1784,'ifr','MSAT',0,'Enciclopédia (dir., com d’Alembert); O sobrinho de Rameau; Salões',''],
['condillac','Étienne de Condillac',1714,1780,'ifr','EGN',0,'Tratado das sensações (1754)',''],
['helvetius','Claude-Adrien Helvétius',1715,1771,'ifr','TP',0,'Do espírito (1758)',''],
['dalembert','Jean le Rond d’Alembert',1717,1783,'ifr','C',0,'Discurso preliminar da Enciclopédia (1751)',''],
['holbach','Barão d’Holbach',1723,1789,'ifr','MR',0,'Sistema da natureza (1770)',''],
['condorcet','Condorcet',1743,1794,'ifr','HP',0,'Esboço de um quadro histórico dos progressos do espírito humano (póst. 1795)',''],
['mandeville','Bernard Mandeville',1670,1733,'ibr','TP',0,'A fábula das abelhas (1714)',''],
['shaftesbury','Shaftesbury',1671,1713,'ibr','TS',0,'Características de homens, maneiras, opiniões e tempos (1711)',''],
['hutcheson','Francis Hutcheson',1694,1746,'ibr','TS',0,'Investigação sobre a origem de nossas ideias de beleza e virtude (1725)',''],
['reid','Thomas Reid',1710,1796,'ibr','EN',0,'Investigação sobre a mente humana segundo os princípios do senso comum (1764)',''],
['smith','Adam Smith',1723,1790,'ibr','TP',0,'Teoria dos sentimentos morais (1759); A riqueza das nações (1776)',''],
['ferguson','Adam Ferguson',1723,1816,'ibr','PH',0,'Ensaio sobre a história da sociedade civil (1767)','Uma das fontes do conceito hegeliano de sociedade civil.'],
['wollstonecraft','Mary Wollstonecraft',1759,1797,'ibr','PT',0,'Reivindicação dos direitos dos homens (1790); Reivindicação dos direitos da mulher (1792)',''],
['wolff','Christian Wolff',1679,1754,'ale','MLTD',0,'Metafísica alemã (1720); Ontologia (1730); Direito natural (1740–48)','A escolástica leibniz-wolffiana que Kant aprende e critica.'],
['baumgarten','Alexander Baumgarten',1714,1762,'ale','SM',0,'Metaphysica (1739); Aesthetica (1750–58)','Funda a estética como disciplina; sua *Metaphysica* foi o manual das aulas de Kant.'],
['crusius','Christian August Crusius',1715,1775,'ale','MT',0,'Esboço das verdades necessárias da razão (1745)',''],
['lambert','Johann Heinrich Lambert',1728,1777,'ale','ELC',0,'Novo órganon (1764)','Correspondente de Kant; emprega o termo “fenomenologia”.'],
['mendelssohn','Moses Mendelssohn',1729,1786,'ale','MRS',0,'Fédon (1767); Jerusalém (1783); Horas matinais (1785)',''],
['lessing','Gotthold Ephraim Lessing',1729,1781,'ale','SAR',0,'Laocoonte (1766); A educação do gênero humano (1780); Natã, o sábio',''],
['tetens','Johann Nicolaus Tetens',1736,1807,'ale','N',0,'Ensaios filosóficos sobre a natureza humana (1777)',''],
['vico','Giambattista Vico',1668,1744,'cil','HDE',0,'Do único princípio e fim do direito universal (1720); Ciência nova (1725; 1744)',''],
['burke','Edmund Burke',1729,1797,'cil','PS',0,'Investigação sobre o sublime e o belo (1757); Reflexões sobre a revolução na França (1790)',''],
['hamann','Johann Georg Hamann',1730,1788,'cil','GR',0,'Memoráveis socráticos (1759); Metacrítica do purismo da razão (1784)',''],
['jacobi','Friedrich Heinrich Jacobi',1743,1819,'cil','ER',0,'Sobre a doutrina de Espinosa (1785); David Hume sobre a crença (1787)','Deflagra a querela do panteísmo.'],
['herder','Johann Gottfried Herder',1744,1803,'cil','HGSA',0,'Ensaio sobre a origem da linguagem (1772); Ideias para a filosofia da história da humanidade (1784–91)',''],
['maistre','Joseph de Maistre',1753,1821,'cil','PR',0,'Considerações sobre a França (1796); Os serões de São Petersburgo',''],
['beccaria','Cesare Beccaria',1738,1794,'cpe','DP',0,'Dos delitos e das penas (1764)',''],
['pjafeuerbach','P. J. Anselm von Feuerbach',1775,1833,'cpe','D',0,'Revisão dos princípios do direito penal (1799–1800); Manual de direito penal (1801); !Código Penal bávaro (1813)','Teoria da coação psicológica; formula *nullum crimen, nulla poena sine lege*. Pai de Ludwig Feuerbach.'],
['carrara','Francesco Carrara',1805,1888,'cpe','D',0,'Programa do curso de direito criminal (1859)','Sistematizador da Escola Clássica.','con'],
['constant','Benjamin Constant',1767,1830,'lib','P',0,'Princípios de política (1815); Da liberdade dos antigos comparada à dos modernos (1819)','Liberdade moderna como independência privada; limites ao poder, inclusive ao do povo.'],
['kant','Immanuel Kant',1724,1804,'cri','MELTPDSAHRN',0,'Crítica da razão pura (1781/87); Fundamentação da metafísica dos costumes (1785); Crítica da razão prática (1788); Crítica do juízo (1790); À paz perpétua (1795); Metafísica dos costumes (1797)',''],
['reinhold','Karl Leonhard Reinhold',1757,1823,'cri','E',0,'Cartas sobre a filosofia kantiana (1786–87); Ensaio de uma nova teoria da faculdade de representação (1789)',''],
['maimon','Salomon Maimon',1753,1800,'cri','E',0,'Ensaio sobre a filosofia transcendental (1790)',''],
['schulze','Gottlob Ernst Schulze',1761,1833,'cri','E',0,'Enesidemo (1792)','Professor de Schopenhauer em Göttingen.'],
['beck','Jacob Sigismund Beck',1761,1840,'cri','E',0,'Único ponto de vista possível (1796)',''],
['schiller','Friedrich Schiller',1759,1805,'cri','SAT',0,'Sobre a graça e a dignidade (1793); Cartas sobre a educação estética do homem (1795)',''],
['fichte','Johann Gottlieb Fichte',1762,1814,'ida','MEPDT',0,'Fundamento de toda a doutrina da ciência (1794); Fundamento do direito natural (1796); O Estado comercial fechado (1800)',''],
['hegel','G. W. F. Hegel',1770,1831,'ida','MLEPDHSARN',0,'Fenomenologia do espírito (1807); Ciência da lógica (1812–16); Enciclopédia (1817); Filosofia do direito (1820)',''],
['schelling','F. W. J. Schelling',1775,1854,'ida','MSAR',0,'Sistema do idealismo transcendental (1800); Investigações sobre a essência da liberdade humana (1809); Filosofia da mitologia e da revelação',''],
['schleiermacher','Friedrich Schleiermacher',1768,1834,'rom','RG',0,'Sobre a religião (1799); Hermenêutica e crítica (póst.)','Fundador da hermenêutica geral moderna.'],
['holderlin','Friedrich Hölderlin',1770,1843,'rom','MS',0,'Juízo e ser (1795); Hipérion (1797–99)','Dividiu quarto com Hegel e Schelling no seminário de Tübingen.'],
['fschlegel','Friedrich Schlegel',1772,1829,'rom','SA',0,'Fragmentos do Athenaeum (1798); Sobre a incompreensibilidade (1800)',''],
['novalis','Novalis',1772,1801,'rom','SM',0,'Estudos sobre Fichte (1795–96); Pólen (1798)',''],
['bentham','Jeremy Bentham',1748,1832,'uti','TDP',0,'Introdução aos princípios da moral e da legislação (1789); Panóptico (1791)','','mod'],
['mill','John Stuart Mill',1806,1873,'uti','TPLEC',0,'Sistema de lógica (1843); Sobre a liberdade (1859); Utilitarismo (1861); A sujeição das mulheres (1869)',''],
['sidgwick','Henry Sidgwick',1838,1900,'uti','T',0,'Os métodos da ética (1874)',''],

/* ---------- CONTEMPORÂNEA ---------- */
['herbart','Johann Friedrich Herbart',1776,1841,'cid','MNT',0,'Psicologia como ciência (1824–25)','Sucessor de Kant em Königsberg; realismo pluralista.'],
['schopenhauer','Arthur Schopenhauer',1788,1860,'cid','MTSA',0,'O mundo como vontade e representação (1818/1844); Os dois problemas fundamentais da ética (1841)',''],
['trendelenburg','Friedrich Adolf Trendelenburg',1802,1872,'cid','LM',0,'Investigações lógicas (1840); Direito natural fundado na ética (1860)','Crítico aristotélico de Hegel; lido por Kierkegaard; professor de Brentano e de Dilthey.'],
['kierkegaard','Søren Kierkegaard',1813,1855,'cid','RT',0,'Ou-ou (1843); Temor e tremor (1843); O conceito de angústia (1844); Pós-escrito (1846)','Precursor da filosofia da existência.'],
['lotze','Hermann Lotze',1817,1881,'cid','MEL',0,'Microcosmo (1856–64); Lógica (1874); Metafísica (1879)','Origem da noção de “validade” (*Geltung*), central no neokantismo.'],
['gans','Eduard Gans',1797,1839,'heg','DH',0,'O direito sucessório em seu desenvolvimento histórico (1824–35); !edição da Filosofia do direito com os adendos (1833)','Os *Zusätze* da *Filosofia do direito* são de sua lavra, a partir de cadernos de alunos. Professor de Marx.'],
['michelet','Karl Ludwig Michelet',1801,1893,'heg','MH',0,'!Coedição das obras de Hegel','Popularizou a divisão entre direita, centro e esquerda hegelianas, proposta por Strauss.'],
['rosenkranz','Karl Rosenkranz',1805,1879,'heg','SH',0,'Vida de Hegel (1844); Estética do feio (1853)',''],
['erdmann','Johann Eduard Erdmann',1805,1892,'heg','H',0,'Esboço da história da filosofia (1866)',''],
['ruge','Arnold Ruge',1802,1880,'jhe','P',0,'!Anais de Halle (dir.); Anais franco-alemães (com Marx, 1844)',''],
['lfeuerbach','Ludwig Feuerbach',1804,1872,'jhe','RM',0,'A essência do cristianismo (1841); Princípios da filosofia do futuro (1843)','Filho de P. J. A. Feuerbach.'],
['stirner','Max Stirner',1806,1856,'jhe','TP',0,'O único e sua propriedade (1844)',''],
['strauss','David Friedrich Strauss',1808,1874,'jhe','R',0,'A vida de Jesus (1835–36)',''],
['bbauer','Bruno Bauer',1809,1882,'jhe','R',0,'A trombeta do juízo final (1841); A questão judaica (1843)',''],
['hess','Moses Hess',1812,1875,'jhe','P',0,'A triarquia europeia (1841)',''],
['marx','Karl Marx',1818,1883,'mar','PHDM',0,'Crítica da filosofia do direito de Hegel (1843); Manuscritos econômico-filosóficos (1844); A ideologia alemã (com Engels); O capital (1867)',''],
['engels','Friedrich Engels',1820,1895,'mar','PHC',0,'Anti-Dühring (1878); A origem da família, da propriedade privada e do Estado (1884)',''],
['plekhanov','Gueorgui Plekhanov',1856,1918,'mar','H',0,'O desenvolvimento da concepção monista da história (1895)',''],
['stutchka','Piotr Stutchka',1865,1932,'mar','D',0,'A função revolucionária do direito e do Estado (1921)',''],
['lenin','Vladímir Lênin',1870,1924,'mar','PE',0,'Materialismo e empiriocriticismo (1909); O Estado e a revolução (1917)',''],
['luxemburgo','Rosa Luxemburgo',1871,1919,'mar','P',0,'Reforma ou revolução? (1899); A acumulação do capital (1913)',''],
['pachukanis','Evguiéni Pachukanis',1891,1937,'mar','D',0,'Teoria geral do direito e marxismo (1924)','A forma jurídica derivada da forma mercantil; executado no expurgo stalinista.'],
['saintsimon','Henri de Saint-Simon',1760,1825,'pos','PH',0,'Catecismo dos industriais (1823–24)','Comte foi seu secretário (1817–24).'],
['comte','Auguste Comte',1798,1857,'pos','CHP',0,'Curso de filosofia positiva (1830–42); Sistema de política positiva (1851–54)',''],
['spencer','Herbert Spencer',1820,1903,'pos','CTP',0,'Primeiros princípios (1862); O homem contra o Estado (1884)',''],
['hugo','Gustav Hugo',1764,1844,'ehd','D',0,'Manual de direito natural como filosofia do direito positivo (1798)','Precursor da Escola Histórica, criticado por Hegel na *Filosofia do direito* (§ 3).'],
['savigny','Friedrich Carl von Savigny',1779,1861,'ehd','DH',0,'Da vocação de nosso tempo para a legislação e a ciência do direito (1814); Sistema do direito romano atual (1840–49)','Professor de Marx em Berlim.'],
['puchta','Georg Friedrich Puchta',1798,1846,'ehd','D',0,'Curso das instituições (1841–47)','Matriz da “jurisprudência dos conceitos”.'],
['windscheid','Bernhard Windscheid',1817,1892,'ehd','D',0,'Manual das pandectas (1862–70)',''],
['jhering','Rudolf von Jhering',1818,1892,'ehd','DP',0,'O espírito do direito romano (1852–65); A luta pelo direito (1872); A finalidade no direito (1877–83)','Da jurisprudência dos conceitos à jurisprudência teleológica.'],
['heck','Philipp Heck',1858,1943,'ehd','D',0,'Interpretação da lei e jurisprudência dos interesses (1914)',''],
['nietzsche','Friedrich Nietzsche',1844,1900,'vid','TMSAREH',0,'O nascimento da tragédia (1872); Assim falou Zaratustra (1883–85); Além do bem e do mal (1886); Genealogia da moral (1887)',''],
['dilthey','Wilhelm Dilthey',1833,1911,'vid','HEG',0,'Introdução às ciências do espírito (1883); A construção do mundo histórico nas ciências do espírito (1910)',''],
['simmel','Georg Simmel',1858,1918,'vid','HP',0,'Filosofia do dinheiro (1900); Sociologia (1908)',''],
['ortega','José Ortega y Gasset',1883,1955,'vid','MHP',0,'Meditações do Quixote (1914); A rebelião das massas (1930)',''],
['biran','Maine de Biran',1766,1824,'esp','NM',0,'Ensaio sobre os fundamentos da psicologia (1812)',''],
['ravaisson','Félix Ravaisson',1813,1900,'esp','M',0,'Do hábito (1838)',''],
['boutroux','Émile Boutroux',1845,1921,'esp','MC',0,'Da contingência das leis da natureza (1874)',''],
['bergson','Henri Bergson',1859,1941,'esp','MNRT',0,'Ensaio sobre os dados imediatos da consciência (1889); Matéria e memória (1896); A evolução criadora (1907); As duas fontes da moral e da religião (1932)',''],
['blondel','Maurice Blondel',1861,1949,'esp','R',0,'A ação (1893)',''],
['lange','Friedrich Albert Lange',1828,1875,'nk','EM',0,'História do materialismo (1866)',''],
['liebmann','Otto Liebmann',1840,1912,'nk','E',0,'Kant e os epígonos (1865)','Cada capítulo termina com o refrão “é preciso, pois, voltar a Kant”.'],
['cohen','Hermann Cohen',1842,1918,'nk','ETDR',0,'A teoria kantiana da experiência (1871); Ética da vontade pura (1904)','Escola de Marburgo.'],
['windelband','Wilhelm Windelband',1848,1915,'nk','HTE',0,'Prelúdios (1884); História e ciência natural (1894)','Escola de Baden.'],
['natorp','Paul Natorp',1854,1924,'nk','E',0,'A teoria das ideias de Platão (1903)','Escola de Marburgo.'],
['stammler','Rudolf Stammler',1856,1938,'nk','D',0,'Economia e direito (1896); Teoria do direito justo (1902)',''],
['rickert','Heinrich Rickert',1863,1936,'nk','EH',0,'Os limites da formação dos conceitos nas ciências naturais (1896–1902)','Escola de Baden.'],
['weber','Max Weber',1864,1920,'nk','PDH',0,'A ética protestante e o espírito do capitalismo (1904–05); A política como vocação (1919); Economia e sociedade (póst. 1922)','Sociólogo; metodologia herdada de Rickert.'],
['cassirer','Ernst Cassirer',1874,1945,'nk','EGSH',0,'Substância e função (1910); Filosofia das formas simbólicas (1923–29)','Escola de Marburgo; debate de Davos com Heidegger (1929).'],
['lask','Emil Lask',1875,1915,'nk','DL',0,'Filosofia do direito (1905); A lógica da filosofia (1911)',''],
['radbruch','Gustav Radbruch',1878,1949,'nk','D',0,'Filosofia do direito (1932); Injustiça legal e direito supralegal (1946)','Relativista neokantiano antes de 1933; a “fórmula de Radbruch” marca o pós-guerra.'],
['brentano','Franz Brentano',1838,1917,'bre','NE',0,'Psicologia do ponto de vista empírico (1874)','Reintroduz a noção de intencionalidade.'],
['stumpf','Carl Stumpf',1848,1936,'bre','N',0,'Psicologia do som (1883–90)','Recebeu a habilitação de Husserl em Halle.'],
['meinong','Alexius Meinong',1853,1920,'bre','ML',0,'Sobre a teoria do objeto (1904)',''],
['freud','Sigmund Freud',1856,1939,'psi','NRT',0,'A interpretação dos sonhos (1900); Além do princípio do prazer (1920); O mal-estar na civilização (1930)','Assistiu às aulas de Brentano em Viena.'],
['lacan','Jacques Lacan',1901,1981,'psi','NG',0,'Escritos (1966); Seminários',''],
['husserl','Edmund Husserl',1859,1938,'fen','ELMN',0,'Investigações lógicas (1900–01); Ideias I (1913); Meditações cartesianas (1931); A crise das ciências europeias (1936)',''],
['scheler','Max Scheler',1874,1928,'fen','TR',0,'O formalismo na ética e a ética material dos valores (1913–16)',''],
['nhartmann','Nicolai Hartmann',1882,1950,'fen','MT',0,'Ética (1926); Para a fundamentação da ontologia (1935)','Ontologia crítica; vem de Marburgo e passa pela fenomenologia.'],
['reinach','Adolf Reinach',1883,1917,'fen','DG',0,'Os fundamentos a priori do direito civil (1913)','Teoria dos atos sociais, como a promessa, que antecipa os atos de fala.'],
['stein','Edith Stein',1891,1942,'fen','NMR',0,'Sobre o problema da empatia (1917); Ser finito e ser eterno','Assistente de Husserl; morta em Auschwitz.'],
['ingarden','Roman Ingarden',1893,1970,'fen','SAM',0,'A obra de arte literária (1931); A controvérsia sobre a existência do mundo',''],
['schutz','Alfred Schutz',1899,1959,'fen','H',0,'A construção significativa do mundo social (1932)',''],
['jonas','Hans Jonas',1903,1993,'fen','TC',0,'O princípio responsabilidade (1979)','Aluno de Husserl e de Heidegger.'],
['fink','Eugen Fink',1905,1975,'fen','M',0,'Sexta meditação cartesiana','Assistente de Husserl.'],
['patocka','Jan Patočka',1907,1977,'fen','HP',0,'Ensaios heréticos sobre a filosofia da história (1975)','Porta-voz da Carta 77.'],
['unamuno','Miguel de Unamuno',1864,1936,'exi','R',0,'Do sentimento trágico da vida (1913)',''],
['jaspers','Karl Jaspers',1883,1969,'exi','MP',0,'Psicopatologia geral (1913); Filosofia (1932); A questão da culpa (1946)',''],
['heidegger','Martin Heidegger',1889,1976,'exi','MHSA',0,'Ser e tempo (1927); Kant e o problema da metafísica (1929); A origem da obra de arte (1935–36)','Recusou o rótulo de existencialista; sua “ontologia fundamental” atravessa várias correntes.'],
['marcel','Gabriel Marcel',1889,1973,'exi','R',0,'Diário metafísico (1927); Ser e ter (1935)',''],
['sartre','Jean-Paul Sartre',1905,1980,'exi','MTPN',0,'O ser e o nada (1943); O existencialismo é um humanismo (1946); Crítica da razão dialética (1960)',''],
['beauvoir','Simone de Beauvoir',1908,1986,'exi','TP',0,'Por uma moral da ambiguidade (1947); O segundo sexo (1949)',''],
['merleau','Maurice Merleau-Ponty',1908,1961,'exi','NMSA',0,'Fenomenologia da percepção (1945); O visível e o invisível (póst. 1964)',''],
['camus','Albert Camus',1913,1960,'exi','TP',0,'O mito de Sísifo (1942); O homem revoltado (1951)',''],
['betti','Emilio Betti',1890,1968,'hrm','DG',0,'Teoria geral da interpretação (1955)','Hermenêutica jurídica; polemizou com Gadamer.'],
['gadamer','Hans-Georg Gadamer',1900,2002,'hrm','GSAH',0,'Verdade e método (1960)',''],
['ricoeur','Paul Ricoeur',1913,2005,'hrm','GHT',0,'Da interpretação: ensaio sobre Freud (1965); Tempo e narrativa (1983–85); O justo (1995)',''],
['pareyson','Luigi Pareyson',1918,1991,'hrm','SA',0,'Estética: teoria da formatividade (1954); Verdade e interpretação (1971)',''],
['vattimo','Gianni Vattimo',1936,2023,'hrm','M',0,'O fim da modernidade (1985)','O “pensamento fraco” (*pensiero debole*).'],
['levinas','Emmanuel Levinas',1906,1995,'ffr','TR',0,'Totalidade e infinito (1961); De outro modo que ser (1974)',''],
['henry','Michel Henry',1922,2002,'ffr','MR',0,'A essência da manifestação (1963); Marx (1976)',''],
['marion','Jean-Luc Marion',1946,null,'ffr','MR',0,'Deus sem o ser (1982); Dado que (1997)',''],
['wahl','Jean Wahl',1888,1974,'hfr','M',0,'A infelicidade da consciência na filosofia de Hegel (1929)',''],
['kojeve','Alexandre Kojève',1902,1968,'hfr','HPD',0,'Introdução à leitura de Hegel (cursos de 1933–39, publ. 1947); Esboço de uma fenomenologia do direito (1943, publ. 1981)','Seus cursos formaram Lacan, Bataille, Aron e Merleau-Ponty, entre outros.'],
['hyppolite','Jean Hyppolite',1907,1968,'hfr','H',0,'Gênese e estrutura da Fenomenologia do espírito (1946)','Professor ou orientador de Foucault, Deleuze e Derrida.'],
['green','Thomas Hill Green',1836,1882,'ide','TP',0,'Prolegômenos à ética (1883); Lições sobre os princípios da obrigação política',''],
['bradley','F. H. Bradley',1846,1924,'ide','MLT',0,'Estudos éticos (1876); Aparência e realidade (1893)',''],
['bosanquet','Bernard Bosanquet',1848,1923,'ide','PS',0,'História da estética (1892); A teoria filosófica do Estado (1899)',''],
['royce','Josiah Royce',1855,1916,'ide','MR',0,'O mundo e o indivíduo (1899–1901); A filosofia da lealdade (1908)',''],
['mctaggart','J. M. E. McTaggart',1866,1925,'ide','M',0,'A irrealidade do tempo (1908); A natureza da existência',''],
['croce','Benedetto Croce',1866,1952,'ide','SAH',0,'Estética como ciência da expressão (1902); Teoria e história da historiografia',''],
['gentile','Giovanni Gentile',1875,1944,'ide','MP',0,'Teoria geral do espírito como ato puro (1916)','Ideólogo do fascismo; assassinado em 1944.'],
['collingwood','R. G. Collingwood',1889,1943,'ide','HA',0,'Os princípios da arte (1938); A ideia de história (póst. 1946)',''],
['whitehead','Alfred North Whitehead',1861,1947,'pro','MLC',0,'Principia mathematica (com Russell, 1910–13); Processo e realidade (1929)',''],
['hartshorne','Charles Hartshorne',1897,2000,'pro','R',0,'A relatividade divina (1948)','Assistente de Whitehead; coeditor dos escritos de Peirce.'],
['peirce','Charles Sanders Peirce',1839,1914,'pra','LEGC',0,'A fixação da crença (1877); Como tornar claras nossas ideias (1878); !escritos sobre semiótica',''],
['james','William James',1842,1910,'pra','NER',0,'Princípios de psicologia (1890); As variedades da experiência religiosa (1902); Pragmatismo (1907)',''],
['dewey','John Dewey',1859,1952,'pra','EPTS',0,'Democracia e educação (1916); Experiência e natureza (1925); A arte como experiência (1934)',''],
['mead','George Herbert Mead',1863,1931,'pra','N',0,'Mente, self e sociedade (póst. 1934)',''],
['cilewis','C. I. Lewis',1883,1964,'pra','LE',0,'A mente e a ordem do mundo (1929)','Professor em Harvard, lido por Quine, Goodman e Sellars.'],
['sellars','Wilfrid Sellars',1912,1989,'npr','ENG',0,'Empirismo e filosofia da mente (1956)','Crítica do “mito do dado”.'],
['rorty','Richard Rorty',1931,2007,'npr','EG',0,'A filosofia e o espelho da natureza (1979); Contingência, ironia e solidariedade (1989)',''],
['mcdowell','John McDowell',1942,null,'npr','EN',0,'Mente e mundo (1994)',''],
['haack','Susan Haack',1945,null,'npr','EL',0,'Filosofia das lógicas (1978); Evidência e investigação (1993); Evidence matters (2014)','Também escreve sobre prova e epistemologia no direito.'],
['brandom','Robert Brandom',1950,null,'npr','GE',0,'Tornando explícito (1994); Um espírito de confiança (2019)','O livro de 2019 é uma leitura da *Fenomenologia do espírito*.'],
['frege','Gottlob Frege',1848,1925,'ana','LG',0,'Conceitografia (1879); Os fundamentos da aritmética (1884); Sobre o sentido e a referência (1892)',''],
['russell','Bertrand Russell',1872,1970,'ana','LGEMP',0,'Sobre a denotação (1905); Principia mathematica (com Whitehead, 1910–13); Os problemas da filosofia (1912)',''],
['moore','G. E. Moore',1873,1958,'ana','TE',0,'Principia ethica (1903); Uma defesa do senso comum (1925)',''],
['wittgenstein','Ludwig Wittgenstein',1889,1951,'ana','LGNEM',0,'Tractatus logico-philosophicus (1921); Investigações filosóficas (póst. 1953); Da certeza (póst. 1969)','O “segundo Wittgenstein” está na origem da filosofia da linguagem ordinária.'],
['ramsey','Frank Ramsey',1903,1930,'ana','LC',0,'Verdade e probabilidade (1926); Universais (1925)',''],
['twardowski','Kazimierz Twardowski',1866,1938,'lvo','N',0,'Sobre o conteúdo e o objeto das representações (1894)','Aluno de Brentano.'],
['lukasiewicz','Jan Łukasiewicz',1878,1956,'lvo','L',0,'Sobre a lógica trivalente (1920)',''],
['lesniewski','Stanisław Leśniewski',1886,1939,'lvo','L',0,'!Sistemas de prototética, ontologia e mereologia',''],
['kotarbinski','Tadeusz Kotarbiński',1886,1981,'lvo','ET',0,'Elementos de teoria do conhecimento (1929)',''],
['tarski','Alfred Tarski',1901,1983,'lvo','LG',0,'O conceito de verdade nas linguagens formalizadas (1933)',''],
['mach','Ernst Mach',1838,1916,'emc','CE',0,'A mecânica em seu desenvolvimento (1883); Análise das sensações (1886)',''],
['avenarius','Richard Avenarius',1843,1896,'emc','E',0,'Crítica da experiência pura (1888–90)',''],
['poincare','Henri Poincaré',1854,1912,'emc','C',0,'A ciência e a hipótese (1902)',''],
['duhem','Pierre Duhem',1861,1916,'emc','C',0,'A teoria física: seu objeto e sua estrutura (1906)',''],
['hahn','Hans Hahn',1879,1934,'cv','L',0,'A concepção científica do mundo (manifesto, com Carnap e Neurath, 1929)','Orientador de Gödel.'],
['schlick','Moritz Schlick',1882,1936,'cv','ECT',0,'Teoria geral do conhecimento (1918); Problemas de ética (1930)','Assassinado por um ex-aluno na Universidade de Viena.'],
['neurath','Otto Neurath',1882,1945,'cv','CP',0,'A concepção científica do mundo (1929, coautor); Proposições protocolares (1932)',''],
['carnap','Rudolf Carnap',1891,1970,'cv','LCG',0,'A construção lógica do mundo (1928); Sintaxe lógica da linguagem (1934); Significado e necessidade (1947)',''],
['reichenbach','Hans Reichenbach',1891,1953,'cv','C',0,'Experiência e predição (1938)','Círculo de Berlim.'],
['feigl','Herbert Feigl',1902,1988,'cv','NC',0,'O “mental” e o “físico” (1958)',''],
['hempel','Carl Gustav Hempel',1905,1997,'cv','C',0,'Estudos na lógica da explicação (com Oppenheim, 1948)',''],
['godel','Kurt Gödel',1906,1978,'cv','LM',0,'Sobre proposições formalmente indecidíveis (1931)','Frequentou o Círculo sem aderir a ele; platonista em matemática.'],
['ayer','A. J. Ayer',1910,1989,'cv','ETG',0,'Linguagem, verdade e lógica (1936)',''],
['ryle','Gilbert Ryle',1900,1976,'lor','NG',0,'O conceito de mente (1949)',''],
['jlaustin','J. L. Austin',1911,1960,'lor','G',0,'Como fazer coisas com palavras (póst. 1962); Sentido e percepção (póst. 1962)',''],
['grice','Paul Grice',1913,1988,'lor','G',0,'Significado (1957); Lógica e conversação (1975)',''],
['strawson','P. F. Strawson',1919,2006,'lor','GME',0,'Sobre o referir (1950); Indivíduos (1959); Os limites do sentido (1966)','*Os limites do sentido* é uma leitura da *Crítica da razão pura*.'],
['searle','John Searle',1932,2025,'lor','GN',0,'Atos de fala (1969); Mentes, cérebros e programas (1980); A construção da realidade social (1995)',''],
['quine','W. V. O. Quine',1908,2000,'ppa','LEGC',0,'Dois dogmas do empirismo (1951); Palavra e objeto (1960)','“Dois dogmas” é uma crítica a Carnap, a quem chamava seu maior mestre.'],
['goodman','Nelson Goodman',1906,1998,'ppa','ECA',0,'Fato, ficção e previsão (1954); Linguagens da arte (1968); Modos de fazer mundos (1978)',''],
['davidson','Donald Davidson',1917,2003,'ppa','GNT',0,'Ações, razões e causas (1963); Investigações sobre a verdade e a interpretação (1984)',''],
['dummett','Michael Dummett',1925,2011,'ppa','GLM',0,'Frege: filosofia da linguagem (1973); Verdade e outros enigmas (1978)',''],
['putnam','Hilary Putnam',1926,2016,'ppa','NGC',0,'O significado de “significado” (1975); Razão, verdade e história (1981)','Do funcionalismo ao “realismo interno” e à aproximação com o pragmatismo.'],
['plantinga','Alvin Plantinga',1932,null,'ppa','RE',0,'A natureza da necessidade (1974); Crença cristã avalizada (2000)',''],
['kripke','Saul Kripke',1940,2022,'ppa','LGM',0,'Nomeação e necessidade (1972/80); Wittgenstein sobre regras e linguagem privada (1982)',''],
['dlewis','David Lewis',1941,2001,'ppa','MLG',0,'Convenção (1969); Contrafactuais (1973); Sobre a pluralidade dos mundos (1986)',''],
['place','U. T. Place',1924,2000,'men','N',0,'A consciência é um processo cerebral? (1956)',''],
['smart','J. J. C. Smart',1920,2012,'men','NT',0,'Sensações e processos cerebrais (1959); Utilitarismo: prós e contras (com Williams, 1973)',''],
['armstrong','David Armstrong',1926,2014,'men','MN',0,'Uma teoria materialista da mente (1968); Universais e realismo científico (1978)',''],
['fodor','Jerry Fodor',1935,2017,'men','N',0,'A linguagem do pensamento (1975); A modularidade da mente (1983)',''],
['kim','Jaegwon Kim',1934,2019,'men','NM',0,'Superveniência e mente (1993)',''],
['nagel','Thomas Nagel',1937,null,'men','NTP',0,'Como é ser um morcego? (1974); Visão a partir de lugar nenhum (1986)',''],
['dennett','Daniel Dennett',1942,2024,'men','N',0,'A atitude intencional (1987); A consciência explicada (1991)',''],
['pchurchland','Paul Churchland',1942,null,'men','N',0,'Materialismo eliminativo e as atitudes proposicionais (1981)',''],
['jackson','Frank Jackson',1943,null,'men','N',0,'Qualia epifenomênicos (1982)','O argumento do conhecimento (“o quarto de Mary”).'],
['patchurchland','Patricia Churchland',1943,null,'men','N',0,'Neurofilosofia (1986)',''],
['chalmers','David Chalmers',1966,null,'men','N',0,'A mente consciente (1996)','O “problema difícil” da consciência.'],
['popper','Karl Popper',1902,1994,'fci','CEP',0,'Lógica da pesquisa científica (1934); A sociedade aberta e seus inimigos (1945); Conjecturas e refutações (1963)',''],
['kuhn','Thomas Kuhn',1922,1996,'fci','CH',0,'A estrutura das revoluções científicas (1962)',''],
['lakatos','Imre Lakatos',1922,1974,'fci','C',0,'A metodologia dos programas de pesquisa científica (1970); Provas e refutações (póst. 1976)',''],
['hanson','Norwood Russell Hanson',1924,1967,'fci','C',0,'Padrões de descoberta (1958)',''],
['feyerabend','Paul Feyerabend',1924,1994,'fci','C',0,'Contra o método (1975)',''],
['hacking','Ian Hacking',1936,2023,'fci','CH',0,'Representar e intervir (1983); A domesticação do acaso (1990)',''],
['laudan','Larry Laudan',1941,2022,'fci','CD',0,'O progresso e seus problemas (1977); Verdade, erro e direito penal (2006)','Aplicou a epistemologia à prova no processo penal.'],
['vanfraassen','Bas van Fraassen',1941,null,'fci','C',0,'A imagem científica (1980)','Empirismo construtivo.'],
['bachelard','Gaston Bachelard',1884,1962,'efr','CS',0,'O novo espírito científico (1934); A formação do espírito científico (1938); A poética do espaço (1957)',''],
['koyre','Alexandre Koyré',1892,1964,'efr','CH',0,'Estudos galileanos (1939); Do mundo fechado ao universo infinito (1957)','Aluno de Husserl em Göttingen; também leitor de Hegel nos anos 1930.'],
['cavailles','Jean Cavaillès',1903,1944,'efr','LC',0,'Sobre a lógica e a teoria da ciência (póst. 1947)','Fuzilado pela Gestapo.'],
['canguilhem','Georges Canguilhem',1904,1995,'efr','C',0,'O normal e o patológico (1943/1966)','Orientou a tese de Foucault sobre a loucura.'],
['benjamin','Walter Benjamin',1892,1940,'fra','SAHP',0,'Para a crítica da violência (1921); A obra de arte na era de sua reprodutibilidade técnica (1935); Sobre o conceito de história (1940)','Próximo do Instituto, sem pertencer ao seu núcleo.'],
['pollock','Friedrich Pollock',1894,1970,'fra','P',0,'Capitalismo de Estado (1941)',''],
['horkheimer','Max Horkheimer',1895,1973,'fra','PE',0,'Teoria tradicional e teoria crítica (1937); Dialética do esclarecimento (com Adorno, 1947); Eclipse da razão (1947)',''],
['marcuse','Herbert Marcuse',1898,1979,'fra','PS',0,'Razão e revolução (1941); Eros e civilização (1955); O homem unidimensional (1964)',''],
['fromm','Erich Fromm',1900,1980,'fra','TP',0,'O medo à liberdade (1941)',''],
['neumann','Franz Neumann',1900,1954,'fra','DP',0,'A mudança de função da lei (1937); Behemoth (1942); O império do direito (1936, publ. 1986)','Jurista; crítico de Schmitt.'],
['adorno','Theodor W. Adorno',1903,1969,'fra','SAEMT',0,'Dialética do esclarecimento (1947); Minima moralia (1951); Dialética negativa (1966); Teoria estética (póst. 1970)',''],
['kirchheimer','Otto Kirchheimer',1905,1965,'fra','DP',0,'Punição e estrutura social (com Rusche, 1939); Justiça política (1961)','Doutorou-se com Schmitt.'],
['apel','Karl-Otto Apel',1922,2017,'fra','TG',0,'Transformação da filosofia (1973)','Ética do discurso; próximo de Habermas, sem ser membro da Escola.'],
['habermas','Jürgen Habermas',1929,2026,'fra','PDTGH',0,'Mudança estrutural da esfera pública (1962); Teoria da ação comunicativa (1981); Facticidade e validade (1992)','Assistente de Adorno; morreu em Starnberg em março de 2026.'],
['wellmer','Albrecht Wellmer',1933,2018,'fra','T',0,'Ética e diálogo (1986)',''],
['fraser','Nancy Fraser',1947,null,'fra','P',0,'Redistribuição ou reconhecimento? (com Honneth, 2003)','Associada à teoria crítica.'],
['honneth','Axel Honneth',1949,null,'fra','PTD',0,'Luta por reconhecimento (1992); O direito da liberdade (2011)','Reatualiza a *Filosofia do direito* de Hegel.'],
['lukacs','György Lukács',1885,1971,'mao','HSAP',0,'História e consciência de classe (1923); O jovem Hegel (1948); Estética (1963)',''],
['bloch','Ernst Bloch',1885,1977,'mao','HRD',0,'O espírito da utopia (1918); O princípio esperança (1954–59); Direito natural e dignidade humana (1961)',''],
['korsch','Karl Korsch',1886,1961,'mao','P',0,'Marxismo e filosofia (1923)',''],
['gramsci','Antonio Gramsci',1891,1937,'mao','PH',0,'Cadernos do cárcere (1929–35)',''],
['lefebvre','Henri Lefebvre',1901,1991,'mao','P',0,'Crítica da vida cotidiana (1947); O direito à cidade (1968)',''],
['althusser','Louis Althusser',1918,1990,'mao','PCE',0,'Por Marx (1965); Ler O capital (1965); Ideologia e aparelhos ideológicos de Estado (1970)',''],
['poulantzas','Nicos Poulantzas',1936,1979,'mao','PD',0,'Poder político e classes sociais (1968); O Estado, o poder, o socialismo (1978)','Formação jurídica; começou pela filosofia do direito.'],
['saussure','Ferdinand de Saussure',1857,1913,'str','G',0,'Curso de linguística geral (póst. 1916)',''],
['jakobson','Roman Jakobson',1896,1982,'str','GA',0,'Linguística e poética (1960)',''],
['levistrauss','Claude Lévi-Strauss',1908,2009,'str','H',0,'As estruturas elementares do parentesco (1949); Antropologia estrutural (1958); O pensamento selvagem (1962)',''],
['barthes','Roland Barthes',1915,1980,'str','GA',0,'Mitologias (1957); A morte do autor (1967); S/Z (1970)',''],
['lyotard','Jean-François Lyotard',1924,1998,'pst','SP',0,'A condição pós-moderna (1979); O diferendo (1983)',''],
['deleuze','Gilles Deleuze',1925,1995,'pst','MSA',0,'Nietzsche e a filosofia (1962); Diferença e repetição (1968); O anti-Édipo (1972) e Mil platôs (1980), com Guattari',''],
['foucault','Michel Foucault',1926,1984,'pst','HPDE',0,'História da loucura (1961); As palavras e as coisas (1966); Vigiar e punir (1975); História da sexualidade (1976–84)',''],
['baudrillard','Jean Baudrillard',1929,2007,'pst','P',0,'Simulacros e simulação (1981)','Foi assistente de Lefebvre.'],
['guattari','Félix Guattari',1930,1992,'pst','P',0,'As três ecologias (1989); !com Deleuze, O anti-Édipo e Mil platôs',''],
['derrida','Jacques Derrida',1930,2004,'pst','GMDS',0,'Gramatologia (1967); A escritura e a diferença (1967); Força de lei (1990)',''],
['nancy','Jean-Luc Nancy',1940,2021,'pst','MP',0,'A comunidade inoperada (1983)',''],
['kristeva','Julia Kristeva',1941,null,'pst','GS',0,'A revolução da linguagem poética (1974)',''],
['negri','Antonio Negri',1933,2023,'rad','PD',0,'O poder constituinte (1992); Império (com Hardt, 2000)',''],
['laclau','Ernesto Laclau',1935,2014,'rad','P',0,'Hegemonia e estratégia socialista (com Mouffe, 1985); A razão populista (2005)',''],
['badiou','Alain Badiou',1937,null,'rad','MP',0,'O ser e o evento (1988)',''],
['ranciere','Jacques Rancière',1940,null,'rad','PS',0,'O desentendimento (1995); A partilha do sensível (2000)',''],
['agamben','Giorgio Agamben',1942,null,'rad','PD',0,'Homo sacer (1995); Estado de exceção (2003)',''],
['balibar','Étienne Balibar',1942,null,'rad','P',0,'Ler O capital (coautor, 1965); Cidadania (2011)',''],
['mouffe','Chantal Mouffe',1943,null,'rad','P',0,'O regresso do político (1993); O paradoxo democrático (2000)',''],
['zizek','Slavoj Žižek',1949,null,'rad','PM',0,'O sublime objeto da ideologia (1989); Menos que nada (2012)',''],
['esposito','Roberto Esposito',1950,null,'rad','P',0,'Communitas (1998); Immunitas (2002); Bíos (2004)',''],
['hayek','Friedrich Hayek',1899,1992,'tpo','PD',0,'O caminho da servidão (1944); Direito, legislação e liberdade (1973–79)',''],
['strauss_l','Leo Strauss',1899,1973,'tpo','P',0,'Direito natural e história (1953)',''],
['voegelin','Eric Voegelin',1901,1985,'tpo','PH',0,'A nova ciência da política (1952); Ordem e história (1956–87)','Doutorou-se com Kelsen.'],
['oakeshott','Michael Oakeshott',1901,1990,'tpo','P',0,'Racionalismo na política (1962); Sobre a conduta humana (1975)',''],
['aron','Raymond Aron',1905,1983,'tpo','PH',0,'Introdução à filosofia da história (1938); Paz e guerra entre as nações (1962)',''],
['arendt','Hannah Arendt',1906,1975,'tpo','PH',0,'Origens do totalitarismo (1951); A condição humana (1958); Eichmann em Jerusalém (1963)','Doutorou-se com Jaspers, sobre o conceito de amor em Agostinho.'],
['berlin','Isaiah Berlin',1909,1997,'tpo','PH',0,'Dois conceitos de liberdade (1958); Três críticos do Iluminismo (2000)',''],
['jellinek','Georg Jellinek',1851,1911,'tes','DP',0,'Sistema dos direitos públicos subjetivos (1892); Teoria geral do Estado (1900)',''],
['smend','Rudolf Smend',1882,1975,'tes','DP',0,'Constituição e direito constitucional (1928)','Teoria da integração.'],
['schmitt','Carl Schmitt',1888,1985,'tes','DP',0,'Teologia política (1922); Teoria da constituição (1928); O guardião da constituição (1931); O conceito do político (1932)',''],
['heller','Hermann Heller',1891,1933,'tes','DP',0,'A soberania (1927); Teoria do Estado (póst. 1934)',''],
['jaustin','John Austin',1790,1859,'pju','D',0,'A delimitação do campo da jurisprudência (1832)','Discípulo de Bentham.'],
['kelsen','Hans Kelsen',1881,1973,'pju','DP',0,'Problemas fundamentais da teoria do direito público (1911); Quem deve ser o guardião da constituição? (1931); Teoria pura do direito (1934/1960)',''],
['hart','H. L. A. Hart',1907,1992,'pju','DT',0,'O conceito de direito (1961); Punição e responsabilidade (1968)',''],
['bobbio','Norberto Bobbio',1909,2004,'pju','DP',0,'Teoria da norma jurídica (1958); O positivismo jurídico (1961); A era dos direitos (1990)',''],
['raz','Joseph Raz',1939,2022,'pju','DP',0,'A autoridade do direito (1979); A moralidade da liberdade (1986)','Orientando de Hart.'],
['holmes','Oliver Wendell Holmes Jr.',1841,1935,'rju','D',0,'O common law (1881); O caminho do direito (1897)','Membro do Metaphysical Club, com Peirce e James.'],
['hagerstrom','Axel Hägerström',1868,1939,'rju','DM',0,'Investigações sobre a concepção romana do direito (1927–41)','Escola de Uppsala.'],
['pound','Roscoe Pound',1870,1964,'rju','D',0,'Jurisprudência mecânica (1908); Introdução à filosofia do direito (1922)','Jurisprudência sociológica, precursora do realismo.'],
['jfrank','Jerome Frank',1889,1957,'rju','D',0,'O direito e a mente moderna (1930); Tribunais em julgamento (1949)',''],
['llewellyn','Karl Llewellyn',1893,1962,'rju','D',0,'O moinho de espinhos (1930); A tradição do common law (1960)',''],
['olivecrona','Karl Olivecrona',1897,1980,'rju','D',0,'O direito como fato (1939)',''],
['aross','Alf Ross',1899,1979,'rju','D',0,'Direito e justiça (1953)','Estudou com Kelsen em Viena e com Hägerström em Uppsala.'],
['maritain','Jacques Maritain',1882,1973,'nto','MPD',0,'Os direitos do homem e a lei natural (1942); O homem e o Estado (1951)','Influente nos debates que cercaram a Declaração Universal de 1948.'],
['gilson','Étienne Gilson',1884,1978,'nto','MH',0,'O espírito da filosofia medieval (1932); O ser e a essência (1948)',''],
['villey','Michel Villey',1914,1988,'nto','D',0,'A formação do pensamento jurídico moderno (1968); Filosofia do direito (1975–79)','Aristotélico-tomista; crítico do direito subjetivo moderno, cuja origem situa em Ockham.'],
['fuller','Lon Fuller',1902,1978,'njn','D',0,'O caso dos exploradores de cavernas (1949); A moralidade do direito (1964)','Debate com Hart (1958).'],
['dworkin','Ronald Dworkin',1931,2013,'njn','DP',0,'Levando os direitos a sério (1977); O império do direito (1986)','Sucessor de Hart em Oxford e seu principal crítico.'],
['finnis','John Finnis',1940,null,'njn','DT',0,'Lei natural e direitos naturais (1980)','Orientando de Hart.'],
['alexy','Robert Alexy',1945,null,'njn','D',0,'Teoria da argumentação jurídica (1978); Teoria dos direitos fundamentais (1985); Conceito e validade do direito (1992)',''],
['luhmann','Niklas Luhmann',1927,1998,'sis','DP',0,'Legitimação pelo procedimento (1969); Sistemas sociais (1984); O direito da sociedade (1993)',''],
['binding','Karl Binding',1841,1920,'dpa','D',0,'As normas e sua transgressão (1872–1920)',''],
['liszt','Franz von Liszt',1851,1919,'dpa','D',0,'A ideia de fim no direito penal (Programa de Marburgo, 1882); Tratado de direito penal alemão',''],
['welzel','Hans Welzel',1904,1977,'dpa','D',0,'Direito natural e justiça material (1951); O novo sistema do direito penal (1961)','Teoria finalista da ação; vínculos ontológicos do legislador.'],
['roxin','Claus Roxin',1931,2025,'dpa','D',0,'Autoria e domínio do fato (1963); Política criminal e sistema jurídico-penal (1970); Direito penal: parte geral','Funcionalismo teleológico-racional.'],
['jakobs','Günther Jakobs',1937,null,'dpa','D',0,'Direito penal: parte geral (1983); !textos sobre o direito penal do inimigo (1985; 2003)','Funcionalismo sistêmico; doutorou-se com Welzel.'],
['lombroso','Cesare Lombroso',1835,1909,'epo','D',0,'O homem delinquente (1876)',''],
['garofalo','Raffaele Garofalo',1851,1934,'epo','D',0,'Criminologia (1885)',''],
['ferri','Enrico Ferri',1856,1929,'epo','DP',0,'Sociologia criminal (1884); Princípios de direito criminal (1928)',''],
['wdross','W. D. Ross',1877,1971,'ean','T',0,'O certo e o bom (1930)','Deveres *prima facie*.'],
['stevenson','Charles Stevenson',1908,1979,'ean','TG',0,'Ética e linguagem (1944)','Emotivismo.'],
['mackie','J. L. Mackie',1917,1981,'ean','TR',0,'Evil and Omnipotence (1955); Ethics: Inventing Right and Wrong (1977); The Miracle of Theism (1982)','Teoria do erro em metaética; o problema lógico do mal.'],
['hare','R. M. Hare',1919,2002,'ean','TG',0,'A linguagem da moral (1952)','Prescritivismo.'],
['anscombe','Elizabeth Anscombe',1919,2001,'ean','TN',0,'Intenção (1957); A filosofia moral moderna (1958)','Aluna e tradutora de Wittgenstein.'],
['murdoch','Iris Murdoch',1919,1999,'ean','T',0,'A soberania do bem (1970)',''],
['foot','Philippa Foot',1920,2010,'ean','T',0,'O problema do aborto e a doutrina do duplo efeito (1967); Bondade natural (2001)','Formula o “dilema do bonde”.'],
['williams','Bernard Williams',1929,2003,'ean','TP',0,'Utilitarismo: prós e contras (com Smart, 1973); A ética e os limites da filosofia (1985); Verdade e veracidade (2002)',''],
['frankfurt','Harry G. Frankfurt',1929,2023,'ean','TM',0,'Alternate Possibilities and Moral Responsibility (1969); Freedom of the Will and the Concept of a Person (1971); On Bullshit (2005)','Responsabilidade sem possibilidades alternativas; volições de segunda ordem.'],
['scanlon','T. M. Scanlon',1940,null,'ean','T',0,'O que devemos uns aos outros (1998)',''],
['parfit','Derek Parfit',1942,2017,'ean','TM',0,'Razões e pessoas (1984); Sobre o que importa (2011)',''],
['singer','Peter Singer',1946,null,'ean','T',0,'Libertação animal (1975); Ética prática (1979)',''],
['korsgaard','Christine Korsgaard',1952,null,'ean','T',0,'As fontes da normatividade (1996)','Construtivismo kantiano; orientanda de Rawls.'],
['rawls','John Rawls',1921,2002,'pan','PTD',0,'Uma teoria da justiça (1971); O liberalismo político (1993)',''],
['sen','Amartya Sen',1933,null,'pan','PT',0,'Desigualdade reexaminada (1992); A ideia de justiça (2009)',''],
['nozick','Robert Nozick',1938,2002,'pan','P',0,'Anarquia, Estado e utopia (1974)',''],
['gacohen','G. A. Cohen',1941,2009,'pan','PH',0,'A teoria da história de Karl Marx: uma defesa (1978); Resgatando a justiça e a igualdade (2008)','Marxismo analítico.'],
['nussbaum','Martha Nussbaum',1947,null,'pan','TP',0,'A fragilidade da bondade (1986); Fronteiras da justiça (2006)',''],
['macintyre','Alasdair MacIntyre',1929,2025,'com','TP',0,'Depois da virtude (1981); Justiça de quem? Qual racionalidade? (1988)',''],
['taylor','Charles Taylor',1931,null,'com','PH',0,'Hegel (1975); As fontes do self (1989); A política do reconhecimento (1992)',''],
['walzer','Michael Walzer',1935,null,'com','P',0,'Guerras justas e injustas (1977); Esferas da justiça (1983)',''],
['sandel','Michael Sandel',1953,null,'com','P',0,'O liberalismo e os limites da justiça (1982)',''],
['irigaray','Luce Irigaray',1930,null,'fem','G',0,'Espéculo da outra mulher (1974)',''],
['mackinnon','Catharine MacKinnon',1946,null,'fem','DP',0,'Rumo a uma teoria feminista do Estado (1989)',''],
['iyoung','Iris Marion Young',1949,2006,'fem','P',0,'Justiça e a política da diferença (1990)',''],
['butler','Judith Butler',1956,null,'fem','PT',0,'Problemas de gênero (1990); Corpos que importam (1993)',''],
['fanon','Frantz Fanon',1925,1961,'pco','P',0,'Pele negra, máscaras brancas (1952); Os condenados da terra (1961)',''],
['dussel','Enrique Dussel',1934,2023,'pco','TPH',0,'Filosofia da libertação (1977); Ética da libertação (1998)',''],
['said','Edward Said',1935,2003,'pco','H',0,'Orientalismo (1978)',''],
['spivak','Gayatri Spivak',1942,null,'pco','P',0,'Pode o subalterno falar? (1988)',''],
['langer','Susanne Langer',1895,1985,'eaa','SA',0,'Filosofia em nova chave (1942); Sentimento e forma (1953)','Leitora e tradutora de Cassirer.'],
['beardsley','Monroe Beardsley',1915,1985,'eaa','SA',0,'A falácia intencional (com Wimsatt, 1946); Estética (1958)',''],
['wollheim','Richard Wollheim',1923,2003,'eaa','A',0,'A arte e seus objetos (1968)',''],
['danto','Arthur Danto',1924,2013,'eaa','AH',0,'O mundo da arte (1964); A transfiguração do lugar-comum (1981)',''],
['dickie','George Dickie',1926,2020,'eaa','A',0,'Arte e estética: uma análise institucional (1974)','']
];
/* Relações:  a}b  a foi mestre de b   |   a>b  a influenciou b   |   a~b  b reagiu criticamente a a */
const REL = `
tales}anaximandro anaximandro}anaximenes anaximandro>heraclito anaximenes>anaxagoras
pitagoras>filolau filolau>arquitas pitagoras>parmenides xenofanes>parmenides pitagoras>empedocles
parmenides}zenao_e parmenides>melisso heraclito~parmenides parmenides~empedocles parmenides~anaxagoras parmenides~leucipo
leucipo}democrito heraclito>cratilo cratilo}platao socrates}platao parmenides>platao arquitas>platao heraclito>platao
protagoras~platao gorgias~platao trasimaco~platao gorgias}antistenes socrates}antistenes socrates}aristipo socrates}euclides_m
parmenides>euclides_m antistenes>diogenes_s diogenes_s}crates euclides_m}eubulides eubulides>diodoro
crates}zenao_c estilpo}zenao_c diodoro}zenao_c polemon}zenao_c aristipo>epicuro democrito>epicuro
platao}espeusipo platao}xenocrates xenocrates}polemon platao}aristoteles aristoteles}teofrasto teofrasto}estratao aristoteles>alexandre_af
democrito>pirro pirro}timon pirro>arcesilau polemon}arcesilau arcesilau>carneades carneades}clitomaco clitomaco}filo_l
filo_l}antioco filo_l}cicero antioco}cicero zenao_c}cleantes cleantes}crisipo crisipo>panecio panecio}posidonio posidonio}cicero
crisipo~carneades panecio>cicero platao>cicero epicuro}metrodoro epicuro}hermarco epicuro>filodemo epicuro>lucrecio
timon>enesidemo enesidemo>sexto posidonio>seneca crisipo>seneca musonio}epicteto epicteto>marco_aurelio
antioco>filon platao>filon platao>plutarco numenio>plotino amonio}plotino aristoteles>plotino plotino}porfirio porfirio}jamblico
jamblico>proclo proclo>damascio damascio}simplicio aristoteles>simplicio plotino>hipatia

platao>justino filon>clemente clemente>origenes amonio>origenes filon>origenes origenes>gregorio_n plotino>gregorio_n
proclo>dionisio dionisio>maximo maximo>damasceno ambrosio}agostinho plotino>agostinho porfirio>agostinho cicero>agostinho
agostinho>boecio porfirio>boecio aristoteles>boecio agostinho>isidoro isidoro>beda beda>alcuino
dionisio>erigena maximo>erigena gregorio_n>erigena agostinho>erigena
aristoteles>kindi kindi>farabi platao>farabi farabi>avicena avicena~ghazali ghazali~averroes aristoteles>averroes avempace>averroes
avempace>tufayl tufayl>averroes farabi>maimonides avicena>maimonides maimonides>gersonides averroes>gersonides maimonides~crescas
agostinho>anselmo roscelino~anselmo roscelino}abelardo champeaux}abelardo boecio>abelardo abelardo}heloisa abelardo>lombardo
abelardo~bernardo_cl bernardo_ch}porretano boecio>porretano hugo_sv}ricardo_sv abelardo}salisbury porretano}salisbury cicero>salisbury
isidoro>graciano irnerio>acursio acursio>bartolo bartolo}baldo
lombardo>hales hales}boaventura agostinho>boaventura dionisio>boaventura gabirol>boaventura joaquim~boaventura
aristoteles>alberto avicena>alberto alberto}tomas aristoteles>tomas averroes>tomas avicena>tomas maimonides>tomas dionisio>tomas agostinho>tomas boecio>tomas graciano>tomas
averroes>siger siger~tomas averroes>boecio_d avicena>gand tomas~gand tomas}egidio grosseteste>rbacon avicena>escoto gand~escoto boaventura>escoto
alberto>eckhart dionisio>eckhart eckhart}tauler eckhart}suso escoto~ockham ockham>buridan buridan>oresme ockham>rimini ockham>autrecourt
aristoteles>marsilio egidio~marsilio tomas>dante aristoteles>dante dante>pizan agostinho>pizan

eckhart>cusano lulio>cusano dionisio>cusano platao>ficino plotino>ficino ficino>pico valla>erasmo erasmo>tmore
alexandre_af>pomponazzi pomponazzi>zabarella zabarella>galileu telesio>campanella cusano>bruno lucrecio>bruno copernico>bruno
sexto>montaigne seneca>montaigne montaigne>charron sexto>sanches erasmo~lutero agostinho>lutero ockham>lutero lutero}melanchthon lutero>calvino agostinho>calvino
maquiavel~bodin bodin~althusius calvino>althusius tomas>vitoria vitoria}soto soto>molina vitoria>suarez tomas>suarez
copernico>kepler copernico>galileu kepler>newton galileu>newton boyle>newton fbacon>boyle epicuro>gassendi lucrecio>gassendi
suarez>descartes agostinho>descartes montaigne~descartes galileu>descartes descartes>arnauld descartes~elisabeth descartes>pascal montaigne>pascal
descartes>geulincx descartes>malebranche geulincx>malebranche agostinho>malebranche arnauld~malebranche descartes>espinosa hobbes>espinosa crescas>espinosa maimonides>espinosa
descartes>leibniz espinosa>leibniz suarez>leibniz lulio>leibniz conway>leibniz arnauld>leibniz
descartes~hmore hmore}conway hobbes~cudworth
vitoria>grocio suarez>grocio cicero>grocio bodin>hobbes galileu>hobbes fbacon}hobbes descartes~hobbes grocio>pufendorf hobbes>pufendorf pufendorf>thomasius
hobbes~rousseau locke>rousseau grocio~rousseau pufendorf>locke hobbes~locke fbacon>locke gassendi>locke boyle>locke descartes>locke
locke~berkeley malebranche>berkeley berkeley>hume locke>hume hutcheson>hume newton>hume bayle>hume
shaftesbury>hutcheson mandeville~hutcheson hutcheson}smith hume>smith mandeville>smith hume~reid hume>ferguson
locke>condillac locke>voltaire newton>voltaire bayle>voltaire newton>chatelet leibniz>chatelet descartes>lamettrie lamettrie>diderot lamettrie>holbach
locke>montesquieu dalembert}condorcet fbacon>dalembert montesquieu>beccaria rousseau>beccaria helvetius>beccaria beccaria>bentham helvetius>bentham
rousseau~wollstonecraft burke~wollstonecraft rousseau~burke burke>maistre
leibniz>wolff wolff>baumgarten wolff~crusius leibniz>mendelssohn espinosa>lessing espinosa~jacobi mendelssohn~jacobi hamann>jacobi
baumgarten>kant wolff>kant crusius>kant lambert>kant tetens>kant hume>kant rousseau>kant newton>kant leibniz>kant
kant}herder hamann}herder lessing>herder kant~hamann hume>hamann
kant>reinhold reinhold~schulze kant>maimon kant>beck kant>schiller reinhold>fichte maimon>fichte schulze~fichte kant>fichte fichte~jacobi
fichte>schelling fichte>hegel fichte>novalis fichte>fschlegel fichte>holderlin holderlin>hegel holderlin>schelling schelling>hegel hegel~schelling
espinosa>schelling espinosa>hegel kant>hegel aristoteles>hegel platao>hegel schiller>hegel herder>hegel ferguson>hegel smith>hegel montesquieu>hegel rousseau>hegel hugo~hegel
kant>schleiermacher espinosa>schleiermacher fschlegel>schleiermacher
beccaria>pjafeuerbach kant>pjafeuerbach beccaria>carrara pjafeuerbach>carrara
bentham}jaustin bentham>mill sidgwick>moore mill>sidgwick comte>mill hume>mill

hegel}gans hegel}rosenkranz hegel}michelet hegel}erdmann hegel>strauss hegel>ruge hegel}lfeuerbach hegel>bbauer hegel}stirner hegel>hess
hegel>marx lfeuerbach>marx bbauer>marx ruge>marx gans}marx savigny}marx stirner~marx lfeuerbach~stirner hess>engels marx>engels smith>marx saintsimon>marx
hugo>savigny savigny}puchta savigny~gans puchta>windscheid savigny>jhering puchta~jhering jhering>heck
engels>plekhanov plekhanov>lenin marx>lenin marx>luxemburgo marx>stutchka stutchka>pachukanis marx>pachukanis hegel>pachukanis lenin>pachukanis
saintsimon}comte comte>spencer
kant>schopenhauer platao>schopenhauer schulze}schopenhauer fichte~schopenhauer hegel~schopenhauer fichte}herbart kant>herbart herbart>lotze
hegel~kierkegaard schelling>kierkegaard trendelenburg>kierkegaard hegel~trendelenburg aristoteles>trendelenburg
lotze}windelband lotze}frege
schopenhauer>nietzsche nietzsche>simmel nietzsche>weber nietzsche>ortega cohen}ortega trendelenburg}dilthey schleiermacher>dilthey
biran>ravaisson ravaisson>boutroux boutroux}bergson boutroux}blondel spencer~bergson james>bergson
kant>liebmann kant>lange kant>cohen lange>cohen cohen>natorp cohen}cassirer windelband}rickert rickert>weber rickert}lask rickert>radbruch lask>radbruch
kant>stammler jellinek>weber
trendelenburg}brentano aristoteles>brentano brentano}stumpf brentano}meinong brentano}husserl brentano}twardowski brentano}freud
stumpf>husserl frege>husserl descartes>husserl james>husserl
husserl}reinach husserl}stein husserl}ingarden husserl}fink husserl}patocka husserl>scheler husserl>schutz weber>schutz
natorp}nhartmann scheler>nhartmann husserl}koyre
schopenhauer>freud nietzsche>freud freud>lacan

dilthey>heidegger nietzsche>heidegger kierkegaard>heidegger husserl}heidegger rickert}heidegger lask>heidegger aristoteles>heidegger
kierkegaard>jaspers nietzsche>jaspers kierkegaard>unamuno heidegger}jonas husserl>jonas
heidegger>sartre husserl>sartre kierkegaard>sartre hegel>beauvoir husserl>beauvoir heidegger>beauvoir husserl>merleau heidegger>merleau bergson>merleau camus~sartre
cassirer~heidegger husserl}levinas heidegger>levinas
heidegger}gadamer dilthey>gadamer betti~gadamer heidegger>ricoeur husserl>ricoeur gadamer>ricoeur freud>ricoeur heidegger>pareyson pareyson}vattimo heidegger>vattimo gadamer>vattimo
husserl>henry heidegger>henry levinas>marion husserl>marion
hegel>wahl kierkegaard>wahl hegel>kojeve heidegger>kojeve koyre>kojeve kojeve>lacan hegel>hyppolite
hegel>green kant>green hegel>bradley hegel>bosanquet hegel>royce hegel>mctaggart hegel>croce hegel>gentile vico>croce croce>collingwood vico>collingwood

kant>peirce peirce>royce peirce>james james>dewey hegel>dewey dewey>mead james>mead
whitehead}hartshorne peirce>hartshorne platao>whitehead whitehead}russell
frege>russell frege>wittgenstein frege}carnap russell}wittgenstein moore>wittgenstein leibniz>russell
bradley~russell bradley~moore mctaggart>russell mctaggart>moore wittgenstein>ramsey
mach>schlick wittgenstein>schlick mach>neurath duhem>neurath wittgenstein>carnap russell>carnap mach~lenin hahn}godel
reichenbach}hempel carnap>hempel russell>ayer schlick>ayer hume>ayer schlick}feigl
twardowski}lukasiewicz twardowski}lesniewski twardowski}kotarbinski lesniewski}tarski lukasiewicz>tarski tarski>carnap
whitehead}quine carnap>quine cilewis>quine duhem>quine cilewis>goodman quine>davidson tarski>davidson quine}dlewis hume>dlewis
reichenbach}putnam frege>dummett wittgenstein>dummett wittgenstein>kripke russell~kripke
wittgenstein}anscombe wittgenstein>ryle descartes~ryle jlaustin}searle grice}strawson jlaustin>strawson russell~strawson kant>strawson
ryle>place place>smart smart>armstrong putnam}fodor ryle}dennett quine>dennett davidson~kim sellars>pchurchland nagel>chalmers searle~dennett
kant>sellars sellars>rorty dewey>rorty wittgenstein>rorty heidegger>rorty rorty}brandom sellars>brandom hegel>brandom sellars>mcdowell kant>mcdowell hegel>mcdowell peirce>haack

schlick~popper popper}lakatos popper}feyerabend hanson>kuhn koyre>kuhn popper~kuhn kuhn>lakatos kuhn>feyerabend kuhn>laudan kuhn>hacking foucault>hacking
bachelard>canguilhem husserl~cavailles

marx>lukacs hegel>lukacs simmel}lukacs weber>lukacs marx>korsch marx>gramsci croce~gramsci marx>bloch simmel>bloch hegel>bloch
lukacs>horkheimer marx>horkheimer lukacs>adorno horkheimer>adorno benjamin>adorno hegel>adorno freud>adorno
heidegger}marcuse hegel>marcuse freud>marcuse freud>fromm schmitt~neumann heller>neumann schmitt}kirchheimer
adorno}habermas horkheimer>habermas peirce>habermas mead>habermas weber>habermas kant>habermas arendt>habermas apel>habermas peirce>apel
gadamer~habermas habermas~luhmann habermas}honneth habermas}wellmer hegel>honneth honneth~fraser habermas~fraser
marx>lefebvre hegel>lefebvre lefebvre}baudrillard
marx>althusser espinosa>althusser bachelard>althusser gramsci>althusser lacan>althusser althusser}balibar althusser~ranciere althusser}badiou althusser>poulantzas gramsci>poulantzas
saussure>jakobson jakobson>levistrauss saussure>levistrauss levistrauss>lacan saussure>lacan saussure>barthes
hyppolite}foucault canguilhem}foucault althusser}foucault nietzsche>foucault heidegger>foucault levistrauss>foucault
nietzsche>deleuze espinosa>deleuze bergson>deleuze hyppolite>deleuze freud~deleuze lacan>guattari deleuze>guattari
heidegger>derrida husserl~derrida saussure~derrida levinas>derrida hyppolite>derrida foucault~derrida
kant>lyotard wittgenstein>lyotard heidegger>nancy derrida>nancy barthes}kristeva lacan>kristeva
marx>negri espinosa>negri deleuze>negri gramsci>laclau gramsci>mouffe laclau>mouffe schmitt>mouffe
schmitt>agamben benjamin>agamben foucault>agamben heidegger>agamben foucault>esposito hegel>zizek lacan>zizek

kelsen}voegelin jaspers}arendt heidegger>arendt agostinho>arendt kant>arendt hume>hayek hobbes>oakeshott hegel>oakeshott
weber>aron kojeve>aron vico>berlin herder>berlin hobbes>strauss_l platao>strauss_l heidegger>strauss_l schmitt~strauss_l
pachukanis~kelsen jellinek>kelsen cohen>kelsen stammler>kelsen jellinek>heller schmitt~kelsen schmitt~heller kelsen~heller smend~kelsen
hobbes>schmitt weber>schmitt maistre>schmitt
jaustin~hart bentham>hart kelsen>hart jlaustin>hart wittgenstein>hart hart~fuller hart}raz hart}finnis hart~dworkin kelsen>bobbio hobbes>bobbio
jhering>holmes peirce>holmes jhering>pound holmes>pound holmes>llewellyn holmes>jfrank pound~llewellyn
hagerstrom}olivecrona hagerstrom}aross kelsen}aross
tomas>maritain tomas>gilson aristoteles>villey tomas>villey ockham~villey tomas>finnis
radbruch>alexy habermas>alexy dworkin>alexy weber>luhmann
hegel>binding jhering>liszt binding~liszt nhartmann>welzel welzel}jakobs welzel~roxin liszt>roxin luhmann>jakobs hegel>jakobs
comte>lombroso lombroso>ferri lombroso>garofalo carrara~ferri spencer>ferri

moore>wdross moore>stevenson kant>hare hare~foot anscombe>foot platao>murdoch smart~williams sidgwick>parfit hare}singer sidgwick>singer
kant>rawls rousseau>rawls sidgwick>rawls rawls>scanlon rawls}korsgaard kant>korsgaard
rawls~nozick locke>nozick rawls~sen aristoteles>nussbaum sen>nussbaum marx>gacohen nozick~gacohen
aristoteles>macintyre rawls~macintyre hegel>taylor rawls~sandel rawls~walzer rawls~iyoung
beauvoir>butler foucault>butler derrida>butler jlaustin>butler beauvoir>irigaray lacan~irigaray marx>mackinnon
hegel>fanon sartre>fanon merleau>fanon marx>dussel levinas>dussel foucault>said gramsci>said derrida>spivak gramsci>spivak
prodico>socrates antifonte~socrates seneca>tertuliano boecio>cassiodoro ghazali>ibn_khaldun farabi~halevi marcel>ricoeur avenarius~lenin poincare>schlick jackson~dennett pollock>horkheimer beardsley~dickie
cassirer>langer hegel>danto wittgenstein>danto danto>dickie wittgenstein>wollheim
`;

/* ==========================================================
   ESCALA DO TEMPO (não linear)
   ========================================================== */
const SEG = [[-700,-320,3.1],[-320,250,1.15],[250,1000,0.72],[1000,1420,2.0],[1420,1600,3.0],[1600,1800,6.0],[1800,1900,10],[1900,2040,13.5]];
function cum(y){ let s = 0; for (const [a,b,r] of SEG){ if (y <= a) break; s += (Math.min(y,b) - a) * r; } return s; }
function anoDe(c){ let s = 0; for (const [a,b,r] of SEG){ const w = (b - a) * r; if (c <= s + w) return a + (c - s) / r; s += w; } return SEG[SEG.length-1][1]; }
function taxa(y){ for (const [a,b,r] of SEG) if (y < b) return r; return SEG[SEG.length-1][2]; }
