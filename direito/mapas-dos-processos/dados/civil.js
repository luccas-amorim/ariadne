const LINES = [
  {id:'g', num:1,  name:'Parte Geral', sub:'Normas fundamentais, sujeitos e atos do processo', art:'arts. 1º a 317', c:'#1B5DAB'},
  {id:'c', num:2,  name:'Procedimento comum', sub:'Processo de conhecimento, em tronco e ramais', art:'arts. 318 a 512', c:'#00845A'},
  {id:'t', num:3,  name:'Tutela provisória', sub:'Urgência e evidência', art:'arts. 294 a 311', c:'#D22630'},
  {id:'s', num:4,  name:'Cumprimento de sentença', sub:'Efetivação do título judicial', art:'arts. 513 a 538', c:'#E2A400', dark:true},
  {id:'e', num:5,  name:'Execução', sub:'Título executivo extrajudicial', art:'arts. 771 a 925', c:'#8B4C9E'},
  {id:'r', num:6,  name:'Recursos', sub:'Impugnação das decisões judiciais', art:'arts. 994 a 1.044', c:'#E86C00'},
  {id:'p', num:7,  name:'Tribunais e precedentes', sub:'Incidentes e ações autônomas de impugnação', art:'arts. 926 a 993', c:'#A3174C'},
  {id:'f', num:8,  name:'Procedimentos especiais', sub:'Jurisdição contenciosa', art:'arts. 539 a 718', c:'#66737D'},
  {id:'v', num:9,  name:'Jurisdição voluntária', sub:'Procedimentos não contenciosos', art:'arts. 719 a 770', c:'#0B9A8D'},
  {id:'x', num:10, name:'Leis extravagantes', sub:'Microssistemas processuais fora do CPC', art:'legislação esparsa', c:'#9A5B2A'}
];

const ST = [
/* ───────── LINHA 1 — PARTE GERAL ───────── */
{id:'g1', n:'Normas fundamentais', a:'arts. 1º a 12',
 s:'O CPC abre declarando que o processo é ordenado, disciplinado e interpretado conforme a Constituição (art. 1º). Reúne inércia e impulso oficial (2º), inafastabilidade e estímulo à solução consensual (3º), duração razoável com solução integral do mérito, incluída a atividade satisfativa (4º), boa-fé (5º), cooperação (6º), paridade de armas (7º), contraditório efetivo e vedação à decisão-surpresa (9º e 10), publicidade e fundamentação (11) e ordem cronológica preferencial de julgamento (12).',
 t:['Constitucionalização do processo: o devido processo legal (CF, art. 5º, LIV e LV) é fonte direta de normas processuais, não mero princípio programático.','Formalismo-valorativo: a forma processual existe para realizar valores (efetividade, segurança, justiça), e não como fim em si.','Modelo cooperativo de processo, em contraposição aos modelos adversarial (protagonismo das partes) e inquisitorial (protagonismo do juiz).'],
 d:['Carlos Alberto Alvaro de Oliveira, <i>Do formalismo no processo civil</i> — formalismo-valorativo.','Daniel Mitidiero, <i>Colaboração no processo civil</i> — deveres de esclarecimento, prevenção, consulta e auxílio.','Nelson Nery Jr., <i>Princípios do processo na Constituição Federal</i>.','Cândido Rangel Dinamarco, <i>A instrumentalidade do processo</i>.'],
 j:['O STJ tem anulado decisões fundadas em argumento não submetido às partes (art. 10), ressalvando a requalificação jurídica de fatos já debatidos (<i>iura novit curia</i>). O alcance dessa ressalva é disputado.'],
 r:['g2','g8','g7','g12']},

{id:'g2', n:'Jurisdição e ação', a:'arts. 16 a 20',
 s:'A jurisdição civil é exercida pelos juízes e tribunais em todo o território nacional (16). Para postular é necessário interesse e legitimidade (17); a legitimação extraordinária depende de autorização do ordenamento jurídico (18). O interesse pode limitar-se à declaração da existência, inexistência ou modo de ser de relação jurídica, ou da autenticidade de documento (19), mesmo que já ocorrida a violação do direito (20).',
 t:['Teorias da ação: imanentista ou civilista; concreta (Wach); direito potestativo (Chiovenda); abstrata (Degenkolb e Plósz); eclética (Liebman).','O CPC/2015 abandonou a expressão "condições da ação" e não menciona mais a possibilidade jurídica do pedido, que passa a ser tratada como questão de mérito.','Teoria da asserção: legitimidade e interesse são aferidos à luz do que o autor afirma na inicial; se o exame exigir prova, a questão é de mérito.'],
 d:['Enrico Tullio Liebman — teoria eclética e as condições da ação.','Fredie Didier Jr., <i>Curso de direito processual civil</i>, vol. 1 — defende o fim da categoria "condições da ação".','Kazuo Watanabe, <i>Da cognição no processo civil</i> — base da teoria da asserção.'],
 j:['O STJ adota amplamente a teoria da asserção.'],
 r:['g3','g4','c1']},

{id:'g3', n:'Competência', a:'arts. 21 a 66',
 s:'Limites da jurisdição nacional (21 a 25), competência interna (42 a 53), modificação (54 a 63) e incompetência (64 a 66). A absoluta (matéria, pessoa, função) é improrrogável e cognoscível de ofício; a relativa (valor e território) prorroga-se se não alegada em preliminar de contestação (65). Conexão (55), continência (56) e prevenção pelo registro ou distribuição da inicial (59). Foro de eleição (63). Cooperação nacional entre juízos (67 a 69).',
 t:['Competência como medida da jurisdição; garantia do juiz natural (CF, art. 5º, XXXVII e LIII).','<i>Kompetenz-Kompetenz</i>: todo juiz é competente para examinar a própria competência.','<i>Translatio iudicii</i>: reconhecida a incompetência, os autos são remetidos e os efeitos das decisões se conservam até nova decisão do juízo competente (64, §4º).'],
 d:['Cândido Rangel Dinamarco, <i>Instituições de direito processual civil</i> — critérios objetivo, territorial e funcional, de matriz chiovendiana.','Leonardo Greco — estudos sobre o juiz natural.'],
 j:['Súmula 33 STJ: a incompetência relativa não pode ser declarada de ofício.','Súmula 235 STJ: a conexão não determina a reunião se um dos processos já foi julgado.'],
 x:'A Lei 14.879/2024 alterou o art. 63: a eleição de foro deve guardar pertinência com o domicílio ou a residência de uma das partes ou com o local da obrigação, e o ajuizamento em foro aleatório é prática abusiva que autoriza a declinação de ofício (§§1º e 5º).',
 r:['c6','p8','x1']},

{id:'g4', n:'Partes, deveres e despesas', a:'arts. 70 a 102',
 s:'Capacidade de ser parte, processual e postulatória, com vício sanável (70 a 76). Deveres das partes e procuradores e litigância de má-fé (77 a 81). Despesas e honorários (82 a 97): o art. 85 fixa honorários entre 10% e 20%, estabelece a ordem das bases de cálculo e veda a compensação em caso de sucumbência parcial (§14). Gratuidade da justiça (98 a 102).',
 t:['Princípio da causalidade: responde pelos custos quem deu causa ao processo, critério que complementa a sucumbência.','Honorários como verba de natureza alimentar e direito autônomo do advogado.','Boa-fé objetiva processual (art. 5º) como fundamento dos deveres do art. 77.'],
 d:['Giuseppe Chiovenda — fundamento objetivo da condenação nas despesas.','Yussef Said Cahali, <i>Honorários advocatícios</i>.'],
 j:['Tema 1.076 STJ: a fixação por equidade (85, §8º) só cabe quando o proveito for inestimável ou irrisório, ou o valor da causa muito baixo, e não quando os valores forem elevados.','Súmula 481 STJ: a pessoa jurídica obtém gratuidade se demonstrar impossibilidade de arcar com os encargos.','Súmula 453 STJ superada pelo art. 85, §18 (honorários omitidos podem ser cobrados em ação autônoma).'],
 r:['g5','g6']},

{id:'g5', n:'Litisconsórcio', a:'arts. 113 a 118',
 s:'Pluralidade de sujeitos num mesmo polo da relação processual. Facultativo (113) ou necessário (114); simples ou unitário (116). O juiz pode limitar o litisconsórcio facultativo multitudinário (113, §1º). A sentença sem a integração do litisconsorte necessário é nula, se unitário, ou ineficaz para os não citados, nos demais casos (115).',
 t:['Classificações cruzadas: necessidade (por lei ou pela natureza da relação) e unitariedade (exigência de decisão uniforme) são critérios distintos.','Regime da autonomia dos litisconsortes (117), mitigado no unitário.'],
 d:['Cândido Rangel Dinamarco, <i>Litisconsórcio</i>.','José Carlos Barbosa Moreira, <i>Litisconsórcio unitário</i>.'],
 r:['g6','g4']},

{id:'g6', n:'Intervenção de terceiros', a:'arts. 119 a 138',
 s:'Assistência simples e litisconsorcial (119 a 124); denunciação da lide, não mais obrigatória e com uma única denunciação sucessiva (125 a 129); chamamento ao processo de fiadores e devedores solidários (130 a 132); incidente de desconsideração da personalidade jurídica, inclusive inversa (133 a 137); <i>amicus curiae</i> (138).',
 t:['Interesse jurídico, e não meramente econômico, como chave da assistência.','Desconsideração: teoria maior (CC, art. 50 — abuso caracterizado por desvio de finalidade ou confusão patrimonial) e teoria menor (CDC, art. 28, §5º).','O IDPJ concretiza o contraditório prévio antes de atingir o patrimônio de quem não é parte.'],
 d:['Cassio Scarpinella Bueno, <i>Amicus curiae no processo civil brasileiro</i>.','Athos Gusmão Carneiro, <i>Intervenção de terceiros</i>.','Fábio Konder Comparato, <i>O poder de controle na sociedade anônima</i> — base da desconsideração no Brasil.'],
 j:['O incidente é dispensado quando a desconsideração é requerida na própria petição inicial; o sócio é citado como réu (134, §2º).'],
 r:['g5','e2','f9']},

{id:'g7', n:'Juiz, MP, Defensoria e auxiliares', a:'arts. 139 a 187',
 s:'Poderes-deveres do juiz (139), entre eles as medidas executivas atípicas (IV) e a dilação de prazos e alteração da ordem das provas (VI). Impedimento (144) e suspeição (145). Conciliadores e mediadores (165 a 175). Ministério Público como fiscal da ordem jurídica (176 a 181), Advocacia Pública (182 a 184) e Defensoria Pública (185 a 187), com prazos em dobro.',
 t:['Gerenciamento do processo (<i>case management</i>) e o limite da imparcialidade.','Debate entre ativismo judicial e garantismo processual sobre a extensão dos poderes do juiz.'],
 d:['José Carlos Barbosa Moreira — ensaios sobre poderes instrutórios e a crítica ao "neoprivatismo".','Eduardo José da Fonseca Costa e Glauco Gumerato Ramos — vertente garantista crítica.'],
 j:['STF, ADI 5.941 (2023): é constitucional o art. 139, IV, desde que as medidas atípicas sejam proporcionais e fundamentadas (ex.: suspensão de CNH e passaporte).','O STJ exige subsidiariedade, contraditório e indícios de patrimônio expropriável oculto.'],
 r:['g8','s6','e5']},

{id:'g8', n:'Atos, prazos e comunicações', a:'arts. 188 a 275',
 s:'Liberdade das formas e instrumentalidade (188). Negócio jurídico processual atípico (190) e calendário processual (191). Prazos contados em dias úteis (219), preclusão e regras de contagem (218 a 235). Citação (238 a 259), preferencialmente eletrônica (246), com citação por oficial, hora certa e edital; intimações (269 a 275).',
 t:['Autorregramento da vontade no processo: as partes podem ajustar o procedimento e as próprias situações jurídicas processuais.','Preclusão temporal, lógica e consumativa como técnica de avanço do processo.','Citação como pressuposto de existência ou de validade (debate) e o vício transrescisório de sua falta.'],
 d:['Antonio do Passo Cabral, <i>Convenções processuais</i>.','Fredie Didier Jr. — princípio do respeito ao autorregramento da vontade.','Heitor Vitor Mendonça Sica, <i>Preclusão processual civil</i>.'],
 j:['Súmula 106 STJ: a demora na citação imputável ao Judiciário não prejudica a interrupção da prescrição.'],
 x:'A Lei 14.195/2021 reescreveu o art. 246: citação eletrônica em até 2 dias úteis da decisão que a determinar, confirmação em até 3 dias úteis e multa por ausência injustificada de confirmação.',
 r:['g9','g11','c5']},

{id:'g9', n:'Nulidades', a:'arts. 276 a 283',
 s:'Sistema orientado pela finalidade: não se pronuncia nulidade sem prejuízo (282, §1º), nem quando o mérito puder ser decidido a favor de quem aproveitaria a decretação (282, §2º). A nulidade deve ser alegada na primeira oportunidade (278). O erro de forma só anula os atos que não possam ser aproveitados (283).',
 t:['<i>Pas de nullité sans grief</i>: princípios da instrumentalidade das formas, do prejuízo, do aproveitamento e da causalidade (contaminação dos atos dependentes, 281).','Primazia do julgamento de mérito (arts. 4º, 139, IX, 317 e 488).'],
 d:['Galeno Lacerda, <i>Despacho saneador</i> — sistematização das nulidades.','Teresa Arruda Alvim, <i>Nulidades do processo e da sentença</i>.','J. J. Calmon de Passos, <i>Esboço de uma teoria das nulidades aplicada às nulidades processuais</i>.'],
 r:['g8','p10']},

{id:'g10', n:'Distribuição e valor da causa', a:'arts. 284 a 293',
 s:'Distribuição alternada e aleatória, com distribuição por dependência em caso de conexão, continência ou reiteração de pedido (286). Toda causa recebe valor certo (291), conforme os critérios do art. 292 (soma dos pedidos cumulados, prestações vencidas e vincendas, valor pretendido a título de dano moral). O réu impugna o valor em preliminar de contestação (293).',
 t:['O valor da causa irradia efeitos: custas, competência dos juizados, honorários e cabimento de procedimentos.','A exigência de indicar o valor do dano moral (292, V) decorre do pedido determinado.'],
 d:['Humberto Theodoro Júnior, <i>Curso de direito processual civil</i>, vol. I.'],
 r:['c1','x1']},

{id:'g11', n:'Formação, suspensão e extinção', a:'arts. 312 a 317',
 s:'O processo existe com o protocolo da inicial, mas só produz efeitos para o réu após a citação válida (312). Hipóteses de suspensão (313): morte ou perda de capacidade da parte, convenção das partes, prejudicialidade externa (até 1 ano), admissão de IRDR, entre outras. Antes de extinguir sem resolução de mérito, o juiz deve dar oportunidade para corrigir o vício (317).',
 t:['Primazia do mérito e dever de prevenção, decorrências do modelo cooperativo.','Prejudicialidade externa como técnica de coerência entre decisões.'],
 d:['Daniel Mitidiero — dever de prevenção.'],
 r:['p5','f10','r8']},

{id:'g12', n:'Direito intertemporal', a:'arts. 14, 1.046 e 1.054',
 s:'A norma processual não retroage e aplica-se imediatamente aos processos em curso, respeitados os atos praticados e as situações consolidadas sob a lei revogada (14). O CPC/2015 entrou em vigor em 18/03/2016 (1.046). O regime da questão prejudicial com força de coisa julgada (503, §1º) só vale para processos iniciados após a vigência (1.054).',
 t:['<i>Tempus regit actum</i> e teoria do isolamento dos atos processuais, prevalente sobre as teorias da unidade do processo e das fases processuais.'],
 d:['Galeno Lacerda, <i>O novo direito processual civil e os feitos pendentes</i>.'],
 j:['Enunciado administrativo 3 do STJ: requisitos de admissibilidade do CPC/2015 para recursos contra decisões publicadas a partir de 18/03/2016.'],
 r:['c15','g1']},

/* ───────── LINHA 2 — PROCEDIMENTO COMUM ───────── */
{id:'c1', n:'Petição inicial', a:'arts. 319 a 321',
 s:'Requisitos do art. 319: juízo, qualificação das partes, fatos e fundamentos jurídicos, pedido com especificações, valor da causa, provas e opção pela audiência de conciliação. Documentos indispensáveis à propositura (320). Vício sanável gera emenda em 15 dias, com indicação precisa do que deve ser corrigido (321).',
 t:['Teoria da substanciação: a causa de pedir compõe-se dos fatos (remota) e dos fundamentos jurídicos (próxima), e não da mera indicação da relação jurídica, como queria a teoria da individuação.','Princípio da demanda e da congruência (arts. 2º, 141 e 492).'],
 d:['José Rogério Cruz e Tucci, <i>A causa petendi no processo civil</i>.','José Carlos Barbosa Moreira, <i>O novo processo civil brasileiro</i> — elementos da demanda.'],
 r:['c2','c3','c4','c5','t1','g10']},

{id:'c2', n:'Pedido e estabilização da demanda', a:'arts. 322 a 329',
 s:'Pedido certo e determinado (322 e 324), interpretado pelo conjunto da postulação e pela boa-fé (322, §2º). Pedidos implícitos (juros, correção, honorários), genérico (324, §1º), alternativo (325), subsidiário (326) e cumulação (327). Até a citação o autor adita ou altera livremente; até o saneamento, apenas com consentimento do réu (329).',
 t:['Estabilização objetiva da demanda como garantia do contraditório.','Cumulação própria (simples e sucessiva) e imprópria (alternativa e eventual).'],
 d:['Araken de Assis, <i>Cumulação de ações</i>.'],
 j:['Súmula 326 STJ: na indenização por dano moral, a condenação em valor inferior ao pedido não gera sucumbência recíproca. Sua compatibilidade com o art. 292, V, é discutida, mas o STJ segue aplicando.'],
 r:['c6','c7']},

{id:'c3', on:'c1', end:true, n:'Indeferimento da inicial', a:'arts. 330 e 331',
 s:'Inépcia, ilegitimidade manifesta, falta de interesse processual ou descumprimento das diligências de emenda (330). Hipóteses de inépcia no §1º; nas revisionais de contrato bancário, exige-se discriminar as obrigações controvertidas e o valor incontroverso (§2º). Da sentença cabe apelação, com juízo de retratação em 5 dias (331).',
 t:['Controle de admissibilidade como filtro, condicionado ao dever de oportunizar a emenda (321).'],
 r:['r2']},

{id:'c4', on:'c1', end:true, n:'Improcedência liminar do pedido', a:'art. 332',
 s:'Nas causas que dispensem instrução, o juiz julga improcedente o pedido, antes de citar o réu, quando contrariar súmula do STF ou do STJ, tese de recursos repetitivos, de IRDR ou de IAC, ou súmula de tribunal de justiça sobre direito local; e também quando verificar decadência ou prescrição. Cabe apelação, com retratação em 5 dias (332, §3º).',
 t:['Sentença de mérito sem contraditório prévio, legitimada por não prejudicar o réu.','Técnica de aceleração atrelada ao sistema de precedentes (927).'],
 d:['Luiz Guilherme Marinoni, <i>Precedentes obrigatórios</i>.'],
 r:['r2','p1']},

{id:'c5', n:'Citação e audiência de conciliação', a:'art. 334',
 s:'Não sendo caso de indeferimento ou improcedência liminar, o réu é citado para audiência de conciliação ou mediação, com antecedência mínima de 20 dias. A audiência só deixa de ocorrer se ambas as partes manifestarem desinteresse ou se o direito não admitir autocomposição (334, §4º). O não comparecimento injustificado é ato atentatório à dignidade da justiça, com multa de até 2% (§8º).',
 t:['Sistema multiportas (<i>multi-door courthouse</i>, na formulação de Frank Sander).','Política judiciária de tratamento adequado dos conflitos (Res. CNJ 125/2010) e Lei de Mediação (13.140/2015).'],
 d:['Kazuo Watanabe — "cultura da sentença" e "cultura da pacificação".','Ada Pellegrini Grinover — meios consensuais no processo.'],
 r:['c6','c20','x9']},

{id:'c6', n:'Contestação', a:'arts. 335 a 342',
 s:'Prazo de 15 dias, contado da audiência, do protocolo do pedido de cancelamento ou da citação, conforme o caso (335). Concentração de toda a matéria de defesa (336). Preliminares do art. 337: inexistência ou nulidade de citação, incompetência, incorreção do valor da causa, inépcia, perempção, litispendência, coisa julgada, conexão, incapacidade, convenção de arbitragem, ausência de legitimidade ou interesse, falta de caução, indevida gratuidade. Ilegitimidade com indicação do sujeito passivo (338 e 339). Ônus da impugnação especificada (341).',
 t:['Princípio da eventualidade.','Defesa processual e de mérito; direta (nega os fatos) e indireta (opõe fatos impeditivos, modificativos ou extintivos).'],
 d:['Heitor Vitor Mendonça Sica, <i>O direito de defesa no processo civil brasileiro</i>.','Moacyr Amaral Santos, <i>Primeiras linhas de direito processual civil</i>.'],
 r:['c7','c8','c9']},

{id:'c7', on:'c6', tg:'Corre junto com a contestação', n:'Reconvenção', a:'art. 343',
 s:'Ação proposta pelo réu contra o autor na própria contestação, desde que conexa com a ação principal ou com o fundamento da defesa. É autônoma: a desistência ou extinção da ação principal não impede seu prosseguimento (§2º). Admite terceiros no polo ativo ou passivo (§§3º e 4º).',
 t:['Economia processual e prevenção de decisões contraditórias; reconvenção como cumulação ulterior de demandas.'],
 r:['c9']},

{id:'c8', on:'c6', tg:'Alternativa à contestação', n:'Revelia', a:'arts. 344 a 346',
 s:'Sem contestação, presumem-se verdadeiras as alegações de fato do autor (344), salvo nas hipóteses do art. 345: pluralidade de réus com contestação de algum, direitos indisponíveis, falta de documento indispensável e alegações inverossímeis ou contrárias à prova. Prazos contra o revel sem patrono correm da publicação (346). O revel pode intervir a qualquer tempo e produzir provas, se em tempo (349). Com efeito material e sem requerimento de provas, abre-se o julgamento antecipado (355, II).',
 t:['Distinção entre revelia (fato processual) e seus efeitos (material e processual).','Presunção relativa de veracidade.'],
 j:['O STJ reafirma que a presunção é relativa e não dispensa o juiz de examinar a verossimilhança das alegações.'],
 r:['c18','c10']},

{id:'c9', n:'Réplica e providências preliminares', a:'arts. 347 a 353',
 s:'Se o réu alegar fato impeditivo, modificativo ou extintivo, ou matéria do art. 337, o autor é ouvido em 15 dias (350 e 351). Vícios sanáveis são corrigidos em até 30 dias (352).',
 t:['Contraditório como direito de influência sobre a decisão.'],
 r:['c10']},

{id:'c10', n:'Julgamento conforme o estado do processo', a:'arts. 354 a 357',
 s:'Encerradas a fase postulatória e as providências preliminares, o juiz decide o rumo do processo: extinguir (354), julgar antecipadamente o mérito no todo (355) ou em parte (356), ou, não sendo o caso, sanear e organizar a instrução (357). É a principal bifurcação do procedimento comum.',
 t:['Fracionamento do mérito e decisões parciais definitivas: superação do dogma da unicidade da sentença.','A fase instrutória só se abre quando há fato controvertido e relevante que dependa de prova.'],
 d:['Fredie Didier Jr. — decisão parcial de mérito.'],
 r:['c17','c18','c19','c11']},

{id:'c11', n:'Saneamento e organização', a:'art. 357',
 s:'O juiz resolve questões pendentes, delimita as questões de fato e de direito relevantes, define a distribuição do ônus da prova e designa audiência, se necessária. As partes podem pedir esclarecimentos em 5 dias, após o que a decisão se torna estável (§1º). Admite saneamento consensual (§2º) e, em causas complexas, em cooperação com as partes (§3º).',
 t:['Estabilização das questões controvertidas; saneamento compartilhado como expressão da cooperação.'],
 d:['Galeno Lacerda, <i>Despacho saneador</i>.'],
 r:['c12','c13']},

{id:'c12', n:'Provas', a:'arts. 369 a 484',
 s:'Direito de empregar todos os meios legais e moralmente legítimos (369). Ônus estático (373, I e II) e distribuição dinâmica, por decisão fundamentada (373, §1º). Produção antecipada, inclusive sem urgência (381 a 383). Ata notarial (384), depoimento pessoal (385), confissão (389), exibição de documento ou coisa (396), prova documental (405) e eletrônica (439), testemunhal (442), pericial (464) e inspeção judicial (481). Apreciação motivada da prova, sem o adjetivo "livre" (371).',
 t:['Prova como argumento racional sobre fatos; <i>standards</i> de prova.','Teoria das cargas probatórias dinâmicas (Jorge Peyrano).','Direito autônomo à prova, que justifica a produção antecipada sem urgência.'],
 d:['Michele Taruffo, <i>A prova</i> e <i>Uma simples verdade</i>.','Moacyr Amaral Santos, <i>Prova judiciária no cível e comercial</i>.','Flávio Luiz Yarshell, <i>Antecipação da prova sem o requisito da urgência e direito autônomo à prova</i>.','Jordi Ferrer Beltrán, <i>Valoração racional da prova</i>.'],
 j:['Súmula 301 STJ: a recusa ao exame de DNA induz presunção relativa de paternidade.'],
 r:['c13']},

{id:'c13', n:'Audiência de instrução e julgamento', a:'arts. 358 a 368',
 s:'Nova tentativa de conciliação (359); esclarecimentos do perito e assistentes, depoimentos pessoais e oitiva de testemunhas, nessa ordem preferencial (361); debates orais de 20 minutos, prorrogáveis por 10 (364), substituíveis por memoriais escritos em causas complexas (364, §2º).',
 t:['Oralidade mitigada: imediação, concentração e identidade física (esta não mais expressa no CPC/2015).'],
 d:['Giuseppe Chiovenda — princípio da oralidade.'],
 r:['c14']},

{id:'c14', n:'Sentença', a:'arts. 485 a 501',
 s:'Extinção sem resolução de mérito (485) e com resolução de mérito (487). Primazia do mérito quando favorável a quem aproveitaria a extinção (488). Elementos e dever de fundamentação analítica (489, §1º). Congruência (492). Remessa necessária (496). Tutela específica das obrigações de fazer, não fazer e entregar coisa (497 a 501).',
 t:['Classificação ternária (declaratória, constitutiva, condenatória) e quinária de Pontes de Miranda, que acrescenta a mandamental e a executiva <i>lato sensu</i>.','Fundamentação como garantia contra o arbítrio (CF, art. 93, IX).','Tutela inibitória e de remoção do ilícito, independentemente de dano ou culpa (497, parágrafo único).'],
 d:['Pontes de Miranda, <i>Tratado das ações</i>.','Ovídio A. Baptista da Silva, <i>Processo e ideologia</i> — crítica à ordinariedade.','Luiz Guilherme Marinoni, <i>Tutela inibitória</i>.','Eduardo Talamini, <i>Tutela relativa aos deveres de fazer e de não fazer</i>.'],
 j:['Súmula 45 STJ: na remessa necessária, é vedado agravar a condenação imposta à Fazenda.'],
 r:['c15','c16','r1','r2','r5','s1']},

{id:'c15', fin:true, tg:'Fim da fase de conhecimento', n:'Coisa julgada', a:'arts. 502 a 508',
 s:'Autoridade que torna imutável e indiscutível a decisão de mérito não mais sujeita a recurso (502). Alcança a questão prejudicial decidida expressa e incidentemente, se houver contraditório efetivo, competência e cognição sem restrição probatória (503, §1º). Não fazem coisa julgada os motivos nem a verdade dos fatos (504). Limites subjetivos: não prejudica terceiros (506). Eficácia preclusiva do deduzido e do dedutível (508).',
 t:['Coisa julgada como qualidade dos efeitos da sentença (Liebman) ou como imutabilidade do conteúdo do comando (Barbosa Moreira).','Fundamento na segurança jurídica (CF, art. 5º, XXXVI); debate sobre a relativização da coisa julgada inconstitucional.'],
 d:['Enrico Tullio Liebman, <i>Eficácia e autoridade da sentença</i>.','José Carlos Barbosa Moreira, <i>Temas de direito processual</i> — ensaios sobre a coisa julgada.','Eduardo Talamini, <i>Coisa julgada e sua revisão</i>.'],
 j:['STF, Temas 881 e 885 (2023): decisão do STF em controle concentrado ou repercussão geral interrompe, para o futuro, os efeitos da coisa julgada em relações tributárias de trato continuado.'],
 r:['p4','p10','s1']},

{id:'c16', on:'c14', tg:'Só se a condenação for ilíquida', n:'Liquidação de sentença', a:'arts. 509 a 512',
 s:'Quando a condenação é ilíquida: liquidação por arbitramento (510) ou pelo procedimento comum, se houver necessidade de alegar e provar fato novo (511). Vedado rediscutir a lide ou modificar a sentença (509, §4º). Se depender só de cálculo aritmético, o credor promove desde logo o cumprimento (509, §2º).',
 t:['Integração do título judicial: a liquidez é atributo do título executivo (783).'],
 d:['Cândido Rangel Dinamarco, <i>Execução civil</i>.'],
 r:['s1']},

{id:'c17', on:'c10', end:true, n:'Extinção do processo', a:'arts. 354, 485 e 487, II e III',
 s:'Presente alguma hipótese do art. 485 (falta de pressuposto processual, ilegitimidade, falta de interesse, litispendência, coisa julgada, convenção de arbitragem, entre outras) ou do art. 487, II e III (prescrição, decadência, autocomposição, reconhecimento ou renúncia), o juiz profere sentença já nesse momento (354). Se a extinção atingir apenas parte do processo, a decisão é interlocutória e atacável por agravo de instrumento (354, parágrafo único).',
 t:['A sentença terminativa não impede nova propositura, salvo litispendência, coisa julgada e perempção, e desde que corrigido o vício que levou à extinção (486, §1º).'],
 r:['r2','r3']},

{id:'c18', on:'c10', jump:'c14', n:'Julgamento antecipado do mérito', a:'art. 355',
 s:'Quando não houver necessidade de outras provas (I) ou o réu for revel com efeito material e não requerer provas (II), o juiz julga desde logo o mérito, sem saneamento e sem instrução.',
 t:['Limite do cerceamento de defesa: não se pode julgar antecipadamente e, ao mesmo tempo, rejeitar o pedido por falta de uma prova cuja produção a parte requereu.'],
 j:['O STJ reconhece cerceamento de defesa quando o juiz indefere a prova requerida e julga improcedente o pedido por ausência dessa mesma prova.'],
 r:['c14']},

{id:'c19', on:'c10', tg:'O restante segue pelo tronco', n:'Julgamento antecipado parcial', a:'art. 356',
 s:'Um ou mais pedidos, ou parcela deles, que se mostrarem incontroversos ou em condições de imediato julgamento são decididos desde logo. É decisão de mérito: pode ser liquidada e executada de imediato, independentemente de caução (§§2º e 3º), e faz coisa julgada. Recorre-se por agravo de instrumento (§5º).',
 t:['Coisa julgada progressiva: partes do mérito transitam em julgado em momentos distintos.'],
 r:['r3','s1']},

{id:'c20', on:'c5', end:true, n:'Autocomposição homologada', a:'arts. 334, §11, e 487, III',
 s:'Obtido acordo na audiência, ele é reduzido a termo e homologado por sentença (334, §11), com resolução de mérito (487, III, b). Também resolvem o mérito o reconhecimento da procedência do pedido (487, III, a) e a renúncia à pretensão (487, III, c). Os três podem ocorrer em qualquer fase, inclusive em grau de recurso. A sentença homologatória é título executivo judicial (515, II).',
 t:['Dever de estimular a autocomposição em qualquer fase (arts. 3º, §3º, e 139, V).'],
 r:['s1']},

{id:'c21', any:true, end:true, n:'Desistência, abandono e intransmissibilidade', a:'art. 485, II, III, VIII e IX, §§1º e 4º a 6º',
 s:'Extingue-se o processo sem resolução de mérito se ficar parado por mais de 1 ano por negligência das partes (II) ou se o autor abandonar a causa por mais de 30 dias (III), sempre após intimação pessoal para suprir a falta em 5 dias (§1º). A desistência (VIII) depende do consentimento do réu depois de oferecida a contestação (§4º) e só pode ser apresentada até a sentença (§5º). Após a contestação, a extinção por abandono depende de requerimento do réu (§6º). Também extingue o processo a morte da parte quando a ação for intransmissível (IX).',
 t:['O princípio dispositivo garante ao autor o domínio sobre a continuidade da demanda, temperado pelo interesse do réu, depois de citado, em obter um julgamento de mérito.'],
 j:['Súmula 240 STJ: a extinção por abandono da causa depende de requerimento do réu (positivada no art. 485, §6º).'],
 r:[]},

/* ───────── LINHA 3 — TUTELA PROVISÓRIA ───────── */
{id:'t1', n:'Tutela provisória: regras gerais', a:'arts. 294 a 299',
 s:'Fundada em urgência ou evidência (294). A de urgência pode ser antecipada (satisfativa) ou cautelar, requerida em caráter antecedente ou incidental. Conserva eficácia na pendência do processo e pode ser revogada ou modificada a qualquer tempo (296). É efetivada pelas normas do cumprimento provisório, no que couber (297, parágrafo único).',
 t:['Técnica de distribuição do ônus do tempo do processo entre as partes.','Cognição sumária e cognição exauriente.'],
 d:['Luiz Guilherme Marinoni, <i>Tutela antecipatória e julgamento antecipado</i>.','Piero Calamandrei, <i>Introdução ao estudo sistemático dos procedimentos cautelares</i>.','Kazuo Watanabe, <i>Da cognição no processo civil</i>.'],
 r:['t2','t5']},

{id:'t2', n:'Tutela de urgência', a:'arts. 300 a 302',
 s:'Requisitos: probabilidade do direito e perigo de dano ou risco ao resultado útil do processo (300). O juiz pode exigir caução (§1º) e conceder liminarmente ou após justificação prévia (§2º). Vedada a tutela antecipada quando houver perigo de irreversibilidade dos efeitos (§3º). O requerente responde objetivamente pelos danos que a efetivação causar (302).',
 t:['Unificação dos requisitos da tutela antecipada e cautelar, com fungibilidade entre elas (305, parágrafo único).','Irreversibilidade recíproca: quando ambos os lados sofrerão dano irreversível, pondera-se qual direito é mais provável.'],
 d:['Ovídio A. Baptista da Silva — distinção entre tutela cautelar (assegura) e satisfativa (realiza).'],
 j:['Súmula 735 STF: não cabe recurso extraordinário contra acórdão que defere medida liminar.'],
 r:['t3','t4','r3']},

{id:'t3', n:'Antecipada antecedente e estabilização', a:'arts. 303 e 304',
 s:'Se a urgência for contemporânea à propositura, a inicial pode limitar-se ao pedido de tutela antecipada, com indicação do pedido final (303). Concedida, o autor adita a inicial em 15 dias. Se não houver impugnação, a tutela estabiliza e o processo é extinto (304); qualquer parte pode propor ação para revê-la em 2 anos (§5º). A estabilização não faz coisa julgada (§6º).',
 t:['Inspiração no <i>référé</i> francês: inverte-se o ônus de instaurar o contraditório pleno, à semelhança da técnica monitória.'],
 d:['Eduardo Talamini — estabilização e técnica monitória.','Heitor Vitor Mendonça Sica — estudos sobre a estabilização.'],
 j:['Divergência no STJ sobre o que impede a estabilização: a 3ª Turma (REsp 1.760.966, 2018) admite qualquer forma de impugnação, inclusive contestação; a 1ª Turma (REsp 1.797.365, 2019) exige a interposição de recurso.'],
 r:['r3','c5']},

{id:'t4', n:'Cautelar antecedente', a:'arts. 305 a 310',
 s:'A inicial indica a lide, seu fundamento, o direito a assegurar e o perigo (305). O réu contesta em 5 dias (306). Efetivada a medida, o pedido principal é formulado em 30 dias, nos mesmos autos (308). A eficácia cessa se o pedido principal não for deduzido no prazo, se a medida não for efetivada em 30 dias ou se o pedido principal for julgado improcedente ou o processo extinto (309).',
 t:['Cautelaridade como tutela de segurança, com referibilidade a um direito acautelado.','Poder geral de cautela: arresto, sequestro, arrolamento de bens, protesto contra alienação e qualquer outra medida idônea (301).'],
 d:['Piero Calamandrei, obra citada.','Galeno Lacerda, <i>Comentários ao CPC</i>, vol. VIII (processo cautelar).'],
 r:['c1','c6']},

{id:'t5', n:'Tutela da evidência', a:'art. 311',
 s:'Independe de perigo: abuso do direito de defesa ou manifesto propósito protelatório (I); fatos comprovados documentalmente e tese firmada em casos repetitivos ou súmula vinculante (II); pedido reipersecutório fundado em prova documental de contrato de depósito (III); inicial instruída com prova documental suficiente a que o réu não oponha prova capaz de gerar dúvida razoável (IV). Liminar apenas nas hipóteses II e III.',
 t:['Distribuição isonômica do tempo do processo conforme o grau de evidência do direito.'],
 d:['Luiz Fux, <i>Tutela de segurança e tutela da evidência</i>.','Luiz Guilherme Marinoni — abuso do direito de defesa.'],
 r:['c6','p1']},

/* ───────── LINHA 4 — CUMPRIMENTO DE SENTENÇA ───────── */
{id:'s1', n:'Cumprimento: regras gerais', a:'arts. 513 a 519',
 s:'Fase do mesmo processo, dispensada nova citação (sincretismo). Títulos executivos judiciais (515), entre eles a sentença arbitral, a decisão homologatória de autocomposição e a sentença estrangeira homologada. Competência (516), com opção pelo foro do domicílio do executado ou da localização dos bens. Protesto da decisão (517) e inclusão do nome em cadastros de inadimplentes (782, §§3º a 5º).',
 t:['Processo sincrético, consolidado pela Lei 11.232/2005 e pelo CPC/2015: fim da autonomia da execução de título judicial.','Efetividade da tutela executiva e tipicidade ou atipicidade dos meios executivos.'],
 d:['Araken de Assis, <i>Manual da execução</i>.','Cassio Scarpinella Bueno, <i>Curso sistematizado de direito processual civil</i>.'],
 r:['s2','s3','s4','s5','s6','s7']},

{id:'s2', n:'Cumprimento provisório', a:'arts. 520 a 522',
 s:'Execução de decisão impugnada por recurso sem efeito suspensivo, por iniciativa e responsabilidade do exequente (520, I). O levantamento de dinheiro e os atos de alienação dependem de caução, dispensada nas hipóteses do art. 521 (crédito alimentar, estado de necessidade, decisão conforme súmula ou repetitivo, entre outras).',
 t:['Risco-proveito: o exequente responde objetivamente pelos danos se a decisão for reformada.'],
 r:['s3','r2']},

{id:'s3', n:'Pagar quantia certa', a:'arts. 523 a 527',
 s:'Intimado, o executado tem 15 dias para pagar; não havendo pagamento, incidem multa de 10% e honorários de 10% (523, §1º), seguindo-se penhora e avaliação. Impugnação em 15 dias após o prazo de pagamento, independentemente de penhora (525), com matérias restritas (§1º) e dever de declarar o valor correto se alegar excesso (§4º). O réu pode pagar espontaneamente antes de intimado (526).',
 t:['Defesa típica sem natureza de ação (incidente), ao contrário dos embargos à execução.','Coerção patrimonial por meio da multa legal.'],
 d:['Humberto Theodoro Júnior, <i>Processo de execução e cumprimento da sentença</i>.'],
 j:['Súmula 517 STJ: são devidos honorários no cumprimento de sentença após escoado o prazo para pagamento voluntário.','Súmula 519 STJ: rejeitada a impugnação, não cabem novos honorários.','Inexigibilidade do título fundado em norma declarada inconstitucional pelo STF (525, §§12 a 15).'],
 r:['s8','e5']},

{id:'s4', n:'Prestação de alimentos', a:'arts. 528 a 533',
 s:'Três técnicas: prisão civil, em regime fechado e separado dos presos comuns, pelo débito das até 3 prestações anteriores ao requerimento e das que vencerem no curso (528, §§3º a 7º); desconto em folha (529); expropriação (530). Protesto do pronunciamento (528, §1º). Constituição de capital para alimentos indenizatórios (533).',
 t:['A prisão por dívida alimentar é a única exceção vigente ao art. 5º, LXVII, da CF; a do depositário infiel foi afastada após o Pacto de San José da Costa Rica.'],
 d:['Rolf Madaleno, <i>Direito de família</i>.'],
 j:['Súmula 309 STJ, positivada no art. 528, §7º.','Súmula Vinculante 25: é ilícita a prisão do depositário infiel.','Súmula 621 STJ: a sentença que reduz, majora ou exonera alimentos retroage à data da citação.'],
 r:['x7','e9']},

{id:'s5', n:'Contra a Fazenda Pública', a:'arts. 534 e 535',
 s:'A Fazenda é intimada na pessoa de seu representante para impugnar em 30 dias, sem incidência da multa do art. 523 (534, §2º, e 535). O pagamento se faz por precatório ou requisição de pequeno valor (CF, art. 100).',
 t:['Impenhorabilidade dos bens públicos e regime constitucional de precatórios, fundado na isonomia entre credores e na legalidade orçamentária.'],
 d:['Leonardo Carneiro da Cunha, <i>A Fazenda Pública em juízo</i>.'],
 r:['e8','x5']},

{id:'s6', n:'Fazer e não fazer', a:'arts. 536 e 537',
 s:'Para efetivar a tutela específica ou o resultado prático equivalente, o juiz pode determinar multa, busca e apreensão, remoção de pessoas e coisas, desfazimento de obras e impedimento de atividade nociva (536, §1º). A multa periódica pode ser modificada ou excluída, e seu valor vincendo não faz coisa julgada (537).',
 t:['Tutela específica e atipicidade dos meios executivos.','As <i>astreintes</i>, de origem francesa, têm natureza coercitiva, e não indenizatória.'],
 d:['Eduardo Talamini, obra citada.','Marcelo Lima Guerra, <i>Direitos fundamentais e a proteção do credor na execução civil</i>.'],
 j:['Súmula 410 STJ: exige prévia intimação pessoal do devedor para cobrança da multa; sua subsistência sob o CPC/2015 é debatida.'],
 r:['c14','g7']},

{id:'s7', n:'Entregar coisa', a:'art. 538',
 s:'Não cumprida a obrigação no prazo fixado, expede-se mandado de busca e apreensão (móvel) ou de imissão na posse (imóvel). Benfeitorias e direito de retenção devem ser alegados na fase de conhecimento (538, §§1º e 2º).',
 t:['Eficácia executiva <i>lato sensu</i> da sentença.'],
 r:['c14']},

{id:'s8', n:'Exceção de pré-executividade', a:'sem previsão expressa; arts. 518 e 803, parágrafo único',
 s:'Defesa sem prazo e sem garantia do juízo, nos próprios autos, para matérias de ordem pública cognoscíveis de ofício que não demandem dilação probatória. Cabe no cumprimento de sentença, na execução civil e na execução fiscal.',
 t:['Criação doutrinária a partir do controle de admissibilidade da execução, acolhida indiretamente pelo CPC/2015 ao permitir arguir vícios nos próprios autos (518; 803, parágrafo único).'],
 d:['Pontes de Miranda — parecer de 1966 no caso da Companhia Siderúrgica Mannesmann, origem da figura no Brasil.'],
 j:['Súmula 393 STJ.'],
 r:['e7','x10']},

/* ───────── LINHA 5 — EXECUÇÃO ───────── */
{id:'e1', n:'Execução: regras gerais e títulos', a:'arts. 771 a 788',
 s:'Disciplina aplicável subsidiariamente ao cumprimento de sentença (771). Atos atentatórios à dignidade da justiça (774). Rol de títulos extrajudiciais (784): títulos de crédito, escritura pública, documento particular assinado pelo devedor e por 2 testemunhas, instrumento de transação referendado, contratos garantidos por hipoteca, penhor, anticrese ou caução, aluguel, certidão de dívida ativa, entre outros. A execução exige título de obrigação certa, líquida e exigível (783).',
 t:['<i>Nulla executio sine titulo</i>: o título é condição necessária e suficiente da execução.'],
 d:['Araken de Assis, <i>Manual da execução</i>.','Marcelo Abelha Rodrigues, <i>Manual de execução civil</i>.'],
 x:'A Lei 14.620/2023 acrescentou o §4º ao art. 784: nos títulos constituídos ou atestados por meio eletrônico, admite-se qualquer modalidade de assinatura eletrônica prevista em lei, dispensadas as testemunhas.',
 r:['e2','e3','e4','f8']},

{id:'e2', n:'Responsabilidade patrimonial e fraude', a:'arts. 789 a 796',
 s:'O devedor responde com todos os seus bens presentes e futuros, salvo restrições legais (789). Bens sujeitos à execução em poder de terceiros (790). Fraude à execução (792): a alienação é ineficaz perante o exequente, e o terceiro adquirente deve ser intimado antes da declaração (§4º).',
 t:['Distinção entre débito (<i>Schuld</i>) e responsabilidade (<i>Haftung</i>).','Fraude contra credores (CC, art. 158, exige ação pauliana) e fraude à execução (ato atentatório, declarável nos próprios autos).'],
 d:['Alfredo Buzaid, <i>Do concurso de credores no processo de execução</i>.','Cândido Rangel Dinamarco, <i>Execução civil</i>.'],
 j:['Súmula 375 STJ: o reconhecimento da fraude à execução depende do registro da penhora ou da prova de má-fé do terceiro adquirente.'],
 r:['e5','g6']},

{id:'e3', n:'Entregar coisa, fazer e não fazer', a:'arts. 806 a 823',
 s:'Citação para entregar em 15 dias (806), com conversão em perdas e danos se a coisa se perder ou não for encontrada (809). Nas obrigações de fazer, o prazo é o do título ou o fixado pelo juiz (815); havendo recusa, o fato pode ser prestado por terceiro à custa do executado (817).',
 t:['Prioridade da tutela específica sobre o equivalente pecuniário.'],
 r:['e7']},

{id:'e4', n:'Quantia certa: citação e arresto', a:'arts. 824 a 830',
 s:'Citação para pagar em 3 dias (829). Honorários de 10%, reduzidos pela metade se houver pagamento integral nesse prazo (827, §1º). Não encontrado o executado, o oficial arresta bens suficientes (830). O exequente pode averbar a admissão da execução nos registros de bens (828).',
 t:['Execução por expropriação (824).'],
 r:['e5','e7']},

{id:'e5', n:'Penhora e avaliação', a:'arts. 831 a 875',
 s:'Ordem preferencial da penhora, com dinheiro em primeiro lugar (835). Impenhorabilidades (833) e bem de família (Lei 8.009/1990). Penhora de dinheiro por meio eletrônico, sem ciência prévia do executado (854). Substituição (847 e 848). Avaliação pelo oficial ou por perito (870 a 875).',
 t:['Tensão entre menor onerosidade (805) e efetividade da execução.','Patrimônio mínimo como expressão da dignidade humana.'],
 d:['Luiz Edson Fachin, <i>Estatuto jurídico do patrimônio mínimo</i>.'],
 j:['STJ, Corte Especial, EREsp 1.874.222 (2023): admite-se mitigar a impenhorabilidade salarial para dívidas não alimentares, preservado o mínimo existencial.','Súmula 364 STJ: o bem de família abrange imóvel de pessoas solteiras, separadas e viúvas.','Súmula 486 STJ: é impenhorável o único imóvel locado a terceiros se a renda for revertida para a subsistência da família.'],
 r:['e6']},

{id:'e6', n:'Expropriação e pagamento', a:'arts. 876 a 909',
 s:'Adjudicação pelo exequente ou legitimados (876), alienação por iniciativa particular (880) ou em leilão judicial, preferencialmente eletrônico (879 a 903). Preço vil: inferior ao mínimo fixado pelo juiz ou, na falta, a 50% da avaliação (891). Satisfação do crédito por entrega do dinheiro ou adjudicação (904).',
 t:['Expropriação como sub-rogação: o Estado substitui a vontade do devedor na transferência do bem.'],
 r:['e10']},

{id:'e7', n:'Embargos à execução', a:'arts. 914 a 920',
 s:'Ação incidental, independente de penhora, depósito ou caução (914), opostos em 15 dias da juntada do mandado de citação (915). Matérias amplas (917). Efeito suspensivo depende de garantia e dos requisitos da tutela provisória (919, §1º). Em vez de embargar, o executado pode reconhecer o crédito e parcelar, depositando 30% e o restante em até 6 parcelas mensais (916).',
 t:['Natureza de ação de conhecimento incidental, com cognição plena, justificada porque o título extrajudicial não passou pelo crivo judicial.'],
 d:['Paulo Henrique dos Santos Lucon, <i>Embargos à execução</i>.','Araken de Assis, obra citada.'],
 r:['r2','c6']},

{id:'e8', n:'Execução contra a Fazenda', a:'art. 910',
 s:'A Fazenda é citada para opor embargos em 30 dias; não opostos ou rejeitados, expede-se precatório ou requisição de pequeno valor.',
 j:['Súmula 279 STJ: é cabível execução por título extrajudicial contra a Fazenda Pública.'],
 r:['s5','x5']},

{id:'e9', n:'Execução de alimentos', a:'arts. 911 a 913',
 s:'Alimentos fixados em título extrajudicial, como escritura pública: citação para pagar em 3 dias, provar que pagou ou justificar a impossibilidade, sob pena de prisão, aplicando-se os §§2º a 7º do art. 528 (911).',
 r:['s4','x7']},

{id:'e10', n:'Suspensão, prescrição intercorrente e extinção', a:'arts. 921 a 925',
 s:'Suspensão por embargos com efeito suspensivo, ausência de bens penhoráveis, parcelamento, entre outras hipóteses (921). Sem bens, suspende-se por 1 ano; o prazo de prescrição intercorrente tem como termo inicial a ciência da primeira tentativa infrutífera de localização do devedor ou de bens (921, §4º, na redação da Lei 14.195/2021). Extinção pela satisfação, remissão, renúncia ou prescrição intercorrente (924), declarada por sentença (925).',
 t:['Segurança jurídica e vedação de execuções eternas.'],
 j:['Súmula 150 STF: prescreve a execução no mesmo prazo de prescrição da ação.','STJ, IAC 1 (REsp 1.604.412): prescrição intercorrente na execução civil.'],
 r:['r2']},

/* ───────── LINHA 6 — RECURSOS ───────── */
{id:'r1', n:'Teoria geral dos recursos', a:'arts. 994 a 1.008',
 s:'Rol taxativo (994). Efeito suspensivo como exceção (995), além dos efeitos devolutivo, translativo, expansivo e substitutivo (1.008). Prazo de 15 dias para todos os recursos, salvo embargos de declaração (1.003, §5º). Recurso adesivo (997). Preparo, com oportunidade de sanar a deserção e de recolher em dobro quando não comprovado na interposição (1.007, §4º). Juízo de admissibilidade e juízo de mérito.',
 t:['Princípios: taxatividade, singularidade, fungibilidade, dialeticidade, voluntariedade e proibição da <i>reformatio in pejus</i>.','Duplo grau de jurisdição: garantia constitucional implícita ou mera diretriz (debate).'],
 d:['José Carlos Barbosa Moreira, <i>Comentários ao CPC</i>, vol. V — obra clássica sobre recursos.','Nelson Nery Jr., <i>Teoria geral dos recursos</i>.'],
 j:['Súmula 579 STJ: é desnecessário ratificar o recurso interposto antes do julgamento dos embargos de declaração, se não houver alteração.'],
 x:'A Lei 14.939/2024 alterou o art. 1.003, §6º: a falta de comprovação de feriado local no ato de interposição passou a ser vício sanável.',
 r:['r2','r3','r4','r5']},

{id:'r2', n:'Apelação', a:'arts. 1.009 a 1.014',
 s:'Cabível contra sentença (1.009). As interlocutórias da fase de conhecimento não agraváveis não precluem e são suscitadas em preliminar de apelação ou nas contrarrazões (§1º). Efeito suspensivo como regra, com as exceções do art. 1.012, §1º. Admissibilidade exclusivamente no tribunal (1.010, §3º). Efeito devolutivo em extensão e profundidade, com julgamento imediato da causa madura (1.013, §3º).',
 t:['<i>Tantum devolutum quantum appellatum</i>.','Causa madura como economia processual, sem ofensa ao duplo grau.'],
 d:['José Carlos Barbosa Moreira, obra citada.'],
 r:['p2','r5','r7']},

{id:'r3', n:'Agravo de instrumento', a:'arts. 1.015 a 1.020',
 s:'Contra as interlocutórias do rol do art. 1.015 (tutelas provisórias, mérito do processo, rejeição da alegação de convenção de arbitragem, IDPJ, gratuidade, exibição, exclusão de litisconsorte, intervenção de terceiros, efeito suspensivo de embargos à execução, redistribuição do ônus da prova) e contra qualquer interlocutória na liquidação, no cumprimento, na execução e no inventário (parágrafo único). Interposto diretamente no tribunal; o relator pode atribuir efeito suspensivo ou antecipar a tutela recursal (1.019, I).',
 t:['Recorribilidade diferida das interlocutórias como técnica de concentração.'],
 d:['Teresa Arruda Alvim, <i>Os agravos no CPC brasileiro</i>.'],
 j:['Tema 988 STJ: taxatividade mitigada; cabe agravo fora do rol quando houver urgência decorrente da inutilidade do julgamento da questão na apelação.'],
 r:['r4','p2']},

{id:'r4', n:'Agravo interno', a:'art. 1.021',
 s:'Contra decisão monocrática do relator, para o órgão colegiado. O agravante impugna especificamente os fundamentos da decisão (§1º), e o relator não pode limitar-se a reproduzi-los para julgar improcedente o agravo (§3º). Multa de 1% a 5% quando manifestamente inadmissível ou improcedente em votação unânime (§4º).',
 t:['Colegialidade como juiz natural nos tribunais.'],
 r:['r7','r10']},

{id:'r5', n:'Embargos de declaração', a:'arts. 1.022 a 1.026',
 s:'Contra qualquer decisão judicial, para esclarecer obscuridade, eliminar contradição, suprir omissão ou corrigir erro material (1.022), no prazo de 5 dias. Interrompem o prazo para os demais recursos (1.026). Prequestionamento ficto (1.025). Multa por embargos protelatórios (1.026, §§2º e 3º).',
 t:['Recurso de integração; omissão qualificada pelas hipóteses do art. 489, §1º.'],
 j:['Súmula 98 STJ: embargos com notório propósito de prequestionamento não têm caráter protelatório.','Súmula 211 STJ, com aplicação mitigada pelo art. 1.025.'],
 r:['r7']},

{id:'r6', n:'Recurso ordinário constitucional', a:'arts. 1.027 e 1.028',
 s:'Ao STF, contra decisões denegatórias de mandado de segurança, <i>habeas data</i> e mandado de injunção proferidas em única instância pelos tribunais superiores. Ao STJ, contra decisões denegatórias de mandado de segurança proferidas em única instância por TRFs ou TJs, e nas causas entre Estado estrangeiro ou organismo internacional e Município ou pessoa residente no País (CF, arts. 102, II, e 105, II).',
 t:['Recurso de fundamentação livre, com regime semelhante ao da apelação (1.028).'],
 r:['x3']},

{id:'r7', n:'Recurso especial e extraordinário', a:'arts. 1.029 a 1.035',
 s:'REsp ao STJ por contrariedade a lei federal ou divergência jurisprudencial (CF, art. 105, III); RE ao STF por ofensa à Constituição (art. 102, III), com repercussão geral (1.035). Recursos de fundamentação vinculada, que exigem prequestionamento e não reexaminam fatos e provas. Admissibilidade na origem (1.030).',
 t:['Função nomofilática e uniformizadora das cortes de vértice: cortes de precedentes, e não de correção.'],
 d:['Daniel Mitidiero, <i>Cortes superiores e cortes supremas</i>.','Teresa Arruda Alvim e Bruno Dantas, <i>Recurso especial, recurso extraordinário e a nova função dos tribunais superiores</i>.'],
 j:['Súmulas 7 STJ e 279 STF: vedado o reexame de prova.','Súmulas 282 e 356 STF: prequestionamento.','Súmula 284 STF: deficiência de fundamentação.'],
 x:'Relevância da questão de direito federal no REsp (CF, art. 105, §§2º e 3º, EC 125/2022), regulamentada pela Lei 15.484/2026, em vigor desde 03/09/2026: no recurso contra acórdão publicado a partir dessa data, a relevância é demonstrada em tópico específico e fundamentado. Os acórdãos do STJ em REsp com relevância reconhecida passaram a vincular (art. 927, III-A).',
 r:['r8','r9']},

{id:'r8', n:'Recursos repetitivos', a:'arts. 1.036 a 1.041',
 s:'Havendo multiplicidade de recursos com fundamento em idêntica questão de direito: seleção de recursos representativos, afetação, suspensão dos processos pendentes, julgamento e aplicação da tese (1.036 a 1.040). A parte pode demonstrar distinção para afastar a suspensão (1.037, §§9º a 13).',
 t:['Técnica de julgamento de casos repetitivos (928), integrada ao sistema de precedentes vinculantes (927, III).'],
 d:['Sofia Temer, <i>Incidente de resolução de demandas repetitivas</i> — debate entre causa-piloto e procedimento-modelo.'],
 r:['p1','p6']},

{id:'r9', n:'Agravo em REsp e em RE', a:'art. 1.042',
 s:'Contra decisão do presidente ou vice-presidente do tribunal de origem que inadmitir REsp ou RE, salvo quando fundada na aplicação de repercussão geral ou de repetitivo, hipótese em que cabe agravo interno (1.030, §2º).',
 t:['Separação entre controle de admissibilidade (agravo à corte superior) e aplicação de precedente (agravo interno na origem).'],
 r:['r4','r7']},

{id:'r10', n:'Embargos de divergência', a:'arts. 1.043 e 1.044',
 s:'No STJ e no STF, contra acórdão de órgão fracionário que divergir do julgamento de outro órgão do mesmo tribunal, sobre o mérito ou sobre a admissibilidade.',
 t:['Uniformização interna da jurisprudência (926).'],
 r:['p1']},

/* ───────── LINHA 7 — TRIBUNAIS E PRECEDENTES ───────── */
{id:'p1', n:'Precedentes e ordem nos tribunais', a:'arts. 926 a 941',
 s:'Os tribunais devem uniformizar sua jurisprudência e mantê-la estável, íntegra e coerente (926). Juízes e tribunais observam as decisões do art. 927: controle concentrado, súmulas vinculantes, IAC, IRDR, repetitivos, REsp com relevância reconhecida, súmulas do STF e do STJ e orientação do plenário ou órgão especial. Poderes do relator (932) e sustentação oral (937).',
 t:['<i>Stare decisis</i>, <i>ratio decidendi</i> e <i>obiter dictum</i>.','Técnicas de <i>distinguishing</i> e <i>overruling</i>, com modulação de efeitos (927, §§2º a 4º).','Integridade do direito (Dworkin), invocada na leitura do art. 926.'],
 d:['Luiz Guilherme Marinoni, <i>Precedentes obrigatórios</i>.','Hermes Zaneti Jr., <i>O valor vinculante dos precedentes</i>.','Lenio Streck — crítica às leituras "precedentalistas" e defesa da integridade.'],
 r:['p2','p3','p5','p6','p7']},

{id:'p2', n:'Ampliação do colegiado', a:'art. 942',
 s:'Quando o resultado da apelação não for unânime, o julgamento prossegue com outros julgadores, em número suficiente para garantir a possibilidade de inversão do resultado. Aplica-se também à rescisória que rescinde a sentença e ao agravo de instrumento que reforma decisão de julgamento parcial de mérito.',
 t:['Técnica de julgamento que substituiu os embargos infringentes do CPC/1973; não é recurso e aplica-se de ofício.'],
 j:['O STJ entende que se aplica a qualquer resultado não unânime da apelação, e não só quando há reforma da sentença de mérito.'],
 r:['r7']},

{id:'p3', n:'Incidente de assunção de competência', a:'art. 947',
 s:'Cabível quando o julgamento envolver relevante questão de direito, com grande repercussão social, sem repetição em múltiplos processos. O órgão colegiado indicado no regimento julga o caso, e a tese vincula juízes e órgãos fracionários (§3º).',
 t:['Prevenção ou composição de divergência fora do contexto de litigiosidade de massa.'],
 r:['p1']},

{id:'p4', n:'Ação rescisória', a:'arts. 966 a 975',
 s:'Desconstitui decisão de mérito transitada em julgado nas hipóteses do art. 966: prevaricação, concussão ou corrupção do juiz; impedimento ou incompetência absoluta; dolo, coação, simulação ou colusão; ofensa à coisa julgada; violação manifesta de norma jurídica; prova falsa; prova nova; erro de fato. Também cabe contra decisão terminativa que impeça nova propositura (§2º). Prazo decadencial de 2 anos do trânsito em julgado da última decisão (975). Depósito de 5% do valor da causa (968, II).',
 t:['Equilíbrio entre segurança jurídica e justiça da decisão.','Juízo rescindente (desconstituição) e juízo rescisório (novo julgamento).'],
 d:['José Carlos Barbosa Moreira, <i>Comentários ao CPC</i>, vol. V.','Flávio Luiz Yarshell, <i>Ação rescisória: juízos rescindente e rescisório</i>.'],
 j:['Súmula 343 STF: não cabe rescisória por ofensa a texto de lei de interpretação controvertida nos tribunais; o STF afasta essa restrição em matéria constitucional.','Súmula 514 STF: cabe rescisória ainda que não esgotados os recursos.','Súmula 401 STJ, positivada no art. 975.'],
 r:['p10','p2']},

{id:'p5', n:'IRDR', a:'arts. 976 a 987',
 s:'Instaurado no tribunal quando houver efetiva repetição de processos sobre a mesma questão unicamente de direito, com risco à isonomia e à segurança jurídica (976). Suspende os processos pendentes na área de jurisdição do tribunal (982); a tese vincula os casos presentes e futuros (985). Prazo de 1 ano para julgamento (980). Do julgamento do mérito cabem REsp e RE, este com repercussão geral presumida (987).',
 t:['Inspiração no <i>Musterverfahren</i> alemão.','Debate entre os modelos de causa-piloto e de procedimento-modelo.'],
 d:['Sofia Temer, <i>Incidente de resolução de demandas repetitivas</i>.','Antonio do Passo Cabral — estudos sobre o <i>Musterverfahren</i>.'],
 j:['STJ, AREsp 1.470.017 (2019): o IRDR pressupõe causa pendente no tribunal.'],
 r:['p1','p6','r7']},

{id:'p6', n:'Reclamação', a:'arts. 988 a 993',
 s:'Para preservar a competência do tribunal, garantir a autoridade de suas decisões e a observância de súmula vinculante, de decisão em controle concentrado e de acórdão em IRDR ou IAC (988). Contra a inobservância de repercussão geral ou de repetitivo, exige o esgotamento das instâncias ordinárias (§5º, II).',
 t:['Natureza jurídica: ação (posição do STF) ou direito de petição (debate histórico).'],
 d:['Marcelo Navarro Ribeiro Dantas, <i>Reclamação constitucional no direito brasileiro</i>.'],
 j:['STJ, Corte Especial, Rcl 36.476 (2020): não cabe reclamação para controlar a aplicação de tese de recurso especial repetitivo.'],
 r:['p1']},

{id:'p7', n:'Arguição de inconstitucionalidade', a:'arts. 948 a 950',
 s:'O órgão fracionário que acolher arguição de inconstitucionalidade submete a questão ao plenário ou ao órgão especial, salvo se já houver pronunciamento destes ou do plenário do STF (949).',
 t:['Cláusula de reserva de plenário (CF, art. 97).'],
 j:['Súmula Vinculante 10.'],
 r:['p1']},

{id:'p8', n:'Conflito de competência', a:'arts. 951 a 959',
 s:'Há conflito quando dois ou mais juízes se declaram competentes ou incompetentes, ou divergem sobre reunião ou separação de processos (66). Suscitado pela parte, pelo MP ou pelo juiz, é julgado pelo tribunal competente.',
 j:['Súmula 59 STJ: não há conflito se já existe sentença com trânsito em julgado proferida por um dos juízos.'],
 r:['g3']},

{id:'p9', n:'Homologação de decisão estrangeira', a:'arts. 960 a 965',
 s:'A decisão estrangeira produz efeitos no Brasil após homologação pelo STJ (CF, art. 105, I, <i>i</i>), salvo tratado ou dispensa legal, como a sentença estrangeira de divórcio consensual (961, §5º). Requisitos no art. 963; vedada a ofensa manifesta à ordem pública (963, VI).',
 t:['Juízo de delibação: não se reexamina o mérito da decisão estrangeira.'],
 r:['s1']},

{id:'p10', n:'<i>Querela nullitatis</i>', a:'construção doutrinária; arts. 525, §1º, I, e 535, I',
 s:'Ação declaratória de inexistência ou ineficácia de sentença proferida em processo com vício gravíssimo, sobretudo falta ou nulidade de citação seguida de revelia. Não se submete ao prazo da rescisória. No cumprimento de sentença, a mesma matéria pode ser arguida em impugnação.',
 t:['Vícios transrescisórios: o defeito impede a própria formação válida da relação processual.'],
 d:['Teresa Arruda Alvim, <i>Nulidades do processo e da sentença</i>.'],
 r:['g9','p4']},

/* ───────── LINHA 8 — PROCEDIMENTOS ESPECIAIS ───────── */
{id:'f1', n:'Consignação em pagamento', a:'arts. 539 a 549',
 s:'O devedor ou terceiro libera-se depositando a quantia ou coisa devida, extrajudicialmente em estabelecimento bancário, se em dinheiro (539, §1º), ou em juízo. Defesa restrita às matérias do art. 544. A consignação de aluguéis segue a Lei 8.245/1991.',
 t:['Direito de pagar como faceta do direito obrigacional (CC, arts. 334 a 345).'],
 r:['x8']},

{id:'f2', n:'Exigir contas', a:'arts. 550 a 553',
 s:'Procedimento bifásico: primeiro se decide se há dever de prestar contas; depois, as contas são prestadas e apurado o saldo (550 a 552). A sentença que apurar saldo constitui título executivo judicial (552).',
 t:['Dever de prestar contas de quem administra bens ou interesses alheios.'],
 j:['Súmula 259 STJ: o correntista pode exigir contas do banco.'],
 r:['s3']},

{id:'f3', n:'Ações possessórias', a:'arts. 554 a 568',
 s:'Manutenção (turbação), reintegração (esbulho) e interdito proibitório (ameaça). Fungibilidade (554) e caráter dúplice (556). Liminar na posse nova, de menos de ano e dia (558 e 562). Litígios coletivos pela posse com audiência de mediação obrigatória (565). Vedada a discussão de domínio na pendência da possessória (557).',
 t:['Teorias da posse: subjetiva (Savigny) e objetiva (Ihering), esta adotada pelo CC (art. 1.196).'],
 d:['Rudolf von Ihering, <i>Teoria simplificada da posse</i>.','Joel Dias Figueira Júnior, <i>Liminares nas ações possessórias</i>.'],
 j:['STF, ADPF 828: diretrizes para desocupações coletivas e regime de transição após a pandemia.'],
 r:['f12','c12']},

{id:'f4', n:'Divisão e demarcação', a:'arts. 569 a 598',
 s:'Demarcação de limites entre prédios confinantes e divisão de coisa comum, com fase técnica conduzida por agrimensor. Admite-se a via extrajudicial, por escritura pública, se todos forem maiores, capazes e concordes (571).',
 r:['c12']},

{id:'f5', n:'Dissolução parcial de sociedade', a:'arts. 599 a 609',
 s:'Resolução da sociedade em relação a sócio falecido, excluído ou que exerceu direito de retirada, com apuração de haveres (599). Fixação da data da resolução (605) e critério de apuração conforme o contrato social ou, no silêncio, valor patrimonial apurado em balanço de determinação (606).',
 t:['Preservação da empresa e princípio da continuidade.'],
 d:['Priscila M. P. Corrêa da Fonseca, <i>Dissolução parcial, retirada e exclusão de sócio</i>.'],
 r:['c12','s3']},

{id:'f6', n:'Inventário e partilha', a:'arts. 610 a 673',
 s:'Judicial, ou extrajudicial por escritura pública se todos forem capazes e concordes (610, §1º). Abertura em 2 meses do óbito (611). Inventariante (617), primeiras declarações (620), citações, avaliação, colação, sonegados, pagamento das dívidas e partilha. Arrolamento sumário (659) e comum (664).',
 t:['<i>Droit de saisine</i> (CC, art. 1.784): a herança transmite-se desde logo aos herdeiros; o inventário declara e liquida.'],
 d:['Sebastião Amorim e Euclides de Oliveira, <i>Inventário e partilha</i>.'],
 x:'A Res. CNJ 571/2024 passou a admitir inventário extrajudicial mesmo com herdeiro incapaz, observados requisitos próprios. Confira a redação vigente antes de usar.',
 r:['f7','v4']},

{id:'f7', n:'Embargos de terceiro', a:'arts. 674 a 681',
 s:'Quem, não sendo parte, sofre constrição ou ameaça de constrição sobre bens que possua ou sobre os quais tenha direito incompatível (674). Prazo: até o trânsito em julgado no processo de conhecimento; na execução, até 5 dias após a adjudicação, alienação ou arrematação, antes da assinatura da carta (675).',
 t:['Defesa da posse e da propriedade contra constrição judicial indevida.'],
 j:['Súmula 84 STJ: admite embargos fundados em compromisso de compra e venda não registrado.','Súmula 195 STJ: em embargos de terceiro não se anula ato jurídico por fraude contra credores.','Súmula 303 STJ: honorários segundo a causalidade.'],
 r:['e5','g6']},

{id:'f8', n:'Ação monitória', a:'arts. 700 a 702',
 s:'Quem tem prova escrita sem eficácia de título executivo pode exigir pagamento, entrega de coisa ou obrigação de fazer ou não fazer (700). Mandado com prazo de 15 dias e honorários de 5% (701), com isenção de custas se cumprido. Sem embargos, constitui-se de pleno direito o título executivo judicial (701, §2º). Embargos monitórios (702).',
 t:['Técnica monitória: inversão da iniciativa do contraditório, de matriz documental (inspirada no <i>procedimento d\'ingiunzione</i> italiano).'],
 d:['Eduardo Talamini, <i>Tutela monitória</i>.'],
 j:['Súmula 299 STJ: cheque prescrito.','Súmula 339 STJ: cabe contra a Fazenda Pública.','Súmulas 503 e 504 STJ: prazo quinquenal para cheque e nota promissória sem força executiva.','Súmula 247 STJ: contrato de abertura de crédito com demonstrativo de débito.'],
 r:['s1','c6']},

{id:'f9', n:'Oposição', a:'arts. 682 a 686',
 s:'Quem pretende, no todo ou em parte, a coisa ou o direito disputado entre autor e réu pode opor-se a ambos até a sentença (682). Era intervenção de terceiro no CPC/1973; no CPC/2015 é procedimento especial, julgado antes da ação originária quando decididos na mesma sentença (686).',
 r:['g6']},

{id:'f10', n:'Habilitação e restauração de autos', a:'arts. 687 a 692 e 712 a 718',
 s:'Habilitação: sucessão processual dos herdeiros ou do espólio por morte da parte (687). Restauração: reconstituição de autos físicos ou eletrônicos desaparecidos (712).',
 r:['g11']},

{id:'f11', n:'Ações de família', a:'arts. 693 a 699',
 s:'Divórcio, separação, reconhecimento e extinção de união estável, guarda, visitação e filiação contenciosos (693). Prioridade à solução consensual, com mediação e conciliação, inclusive em várias sessões (694 a 696). Mandado de citação sem cópia da inicial (695, §1º). Depoimento de incapaz acompanhado por especialista em caso de abuso ou alienação parental (699).',
 t:['Mediação como meio adequado a relações continuadas; melhor interesse da criança.'],
 d:['Maria Berenice Dias, <i>Manual de direito das famílias</i>.'],
 r:['x7','v3']},

{id:'f12', n:'Usucapião', a:'arts. 246, §3º, e 259, I; CC, arts. 1.238 a 1.244; LRP, art. 216-A',
 s:'Deixou de ser procedimento especial: segue o procedimento comum, com citação pessoal dos confinantes (246, §3º) e editais para interessados incertos (259, I). Alternativa extrajudicial no registro de imóveis (Lei 6.015/1973, art. 216-A).',
 t:['Usucapião como modo originário de aquisição e expressão da função social da posse.'],
 j:['Súmula 237 STF: a usucapião pode ser arguida em defesa.'],
 r:['f3','c1']},

{id:'f13', n:'Penhor legal e avaria grossa', a:'arts. 703 a 711',
 s:'Homologação do penhor legal de hospedeiros e locadores (CC, art. 1.467), admitida também pela via extrajudicial (703, §2º). Regulação de avaria grossa: rateio entre os interessados das despesas e danos extraordinários causados para salvar o navio e a carga (707).',
 r:['c6']},

/* ───────── LINHA 9 — JURISDIÇÃO VOLUNTÁRIA ───────── */
{id:'v1', n:'Regras gerais', a:'arts. 719 a 725',
 s:'Procedimento comum de jurisdição voluntária para os pedidos sem rito próprio: emancipação, sub-rogação de bens, alienação de bens de incapazes, alvarás, homologação de autocomposição extrajudicial, entre outros (725). O juiz não está obrigado à legalidade estrita e pode adotar a solução mais conveniente ou oportuna (723, parágrafo único).',
 t:['Natureza: administração pública de interesses privados (corrente clássica) ou verdadeira jurisdição (corrente revisionista).'],
 d:['Leonardo Greco, <i>Jurisdição voluntária moderna</i>.','José Frederico Marques — expoente da corrente administrativista.'],
 r:['v2','v3','v4','v5','v6','v7']},

{id:'v2', n:'Notificação, interpelação e alienação judicial', a:'arts. 726 a 730',
 s:'Notificação, para manifestar formalmente vontade a outrem (726), e interpelação, para que o requerido faça ou deixe de fazer o que o requerente entende de direito (727). Alienação judicial de bens nos casos previstos em lei (730).',
 r:['v1']},

{id:'v3', n:'Divórcio, separação e regime de bens consensuais', a:'arts. 731 a 734',
 s:'Homologação de divórcio, separação e extinção de união estável consensuais (731 e 732), também por escritura pública quando não houver nascituro ou filhos incapazes (733). Alteração do regime de bens, com proteção de terceiros (734).',
 j:['STF, Tema 1.053 (2023): após a EC 66/2010, a separação judicial não é requisito para o divórcio nem subsiste como figura autônoma.'],
 r:['f11']},

{id:'v4', n:'Testamentos e codicilos', a:'arts. 735 a 737',
 s:'Abertura, registro e cumprimento do testamento cerrado (735) e do público (736); o particular depende de publicação e confirmação, após oitiva das testemunhas (737).',
 t:['Formalismo testamentário como garantia da autenticidade da última vontade.'],
 r:['f6']},

{id:'v5', n:'Herança jacente, ausentes e coisas vagas', a:'arts. 738 a 746',
 s:'Arrecadação dos bens de herança sem herdeiro conhecido (738) até a declaração de vacância (743). Arrecadação dos bens do ausente, sucessão provisória e definitiva (744 e 745). Coisas vagas (746).',
 r:['f6']},

{id:'v6', n:'Curatela', a:'arts. 747 a 763',
 s:'Legitimados (747), entrevista obrigatória do interditando (751), perícia, preferencialmente por equipe multidisciplinar (753), e sentença que fixa os limites da curatela (755). Levantamento (756). A tomada de decisão apoiada está no CC (art. 1.783-A).',
 t:['Modelo social da deficiência (Convenção de Nova York; Lei 13.146/2015): curatela como medida extraordinária, restrita aos atos patrimoniais e negociais.'],
 d:['Joyceane Bezerra de Menezes — estudos sobre capacidade e apoio.'],
 r:['v1']},

{id:'v7', n:'Fundações e protestos marítimos', a:'arts. 764 a 770',
 s:'Controle judicial da organização e fiscalização das fundações (764 e 765) e ratificação dos protestos e processos testemunháveis formados a bordo (766 a 770).',
 r:['v1']},

/* ───────── LINHA 10 — LEIS EXTRAVAGANTES ───────── */
{id:'x1', n:'Juizados Especiais Cíveis', a:'Lei 9.099/1995',
 s:'Causas de até 40 salários mínimos (até 20, sem advogado), por opção do autor. Oralidade, simplicidade, informalidade, economia processual e celeridade (art. 2º). Sem reconvenção (31), intervenção de terceiros (10) ou perícia complexa. Recurso inominado à Turma Recursal (41) e embargos de declaração.',
 t:['Acesso à justiça: segunda e terceira "ondas" renovatórias.'],
 d:['Mauro Cappelletti e Bryant Garth, <i>Acesso à justiça</i>.','Joel Dias Figueira Júnior, <i>Juizados Especiais Estaduais Cíveis e Criminais</i>.'],
 j:['Súmula 203 STJ: não cabe REsp contra decisão de Turma Recursal.','Súmula 640 STF: cabe RE contra decisão de Turma Recursal.'],
 r:['x2','x9']},

{id:'x2', n:'Juizados Federais e da Fazenda Pública', a:'Leis 10.259/2001 e 12.153/2009',
 s:'Competência absoluta onde instalados, para causas de até 60 salários mínimos. Pedido de uniformização de interpretação de lei às turmas de uniformização e, conforme o caso, ao STJ.',
 r:['x1','x5']},

{id:'x3', n:'Mandado de segurança', a:'Lei 12.016/2009',
 s:'Protege direito líquido e certo, não amparado por <i>habeas corpus</i> ou <i>habeas data</i>, contra ato ilegal ou abusivo de autoridade (CF, art. 5º, LXIX). Prazo decadencial de 120 dias (23). Liminar (7º, III). Sem honorários (25). Mandado de segurança coletivo (21 e 22).',
 t:['Direito líquido e certo como conceito processual: fatos comprovados documentalmente de plano.'],
 d:['Hely Lopes Meirelles, <i>Mandado de segurança</i>.','Cassio Scarpinella Bueno, <i>A nova lei do mandado de segurança</i>.'],
 j:['Súmulas 266, 267, 269, 271, 512, 625 e 632 STF; Súmula 105 STJ.','STF, ADI 4.296 (2021): inconstitucionais a vedação genérica de liminares do art. 7º, §2º, e a oitiva prévia do representante judicial no MS coletivo (22, §2º).'],
 r:['r6','x4','x5']},

{id:'x4', n:'Processo coletivo: ACP e CDC', a:'Lei 7.347/1985; CDC, arts. 81 a 104',
 s:'Tutela de direitos difusos, coletivos em sentido estrito e individuais homogêneos (CDC, art. 81). Legitimados do art. 5º da LACP (MP, Defensoria, entes públicos, associações). Coisa julgada <i>secundum eventum litis</i> e <i>in utilibus</i> (CDC, art. 103). Liquidação e execução individuais.',
 t:['Microssistema de tutela coletiva (LACP, CDC, Lei da Ação Popular, MS coletivo).','Influência das <i>class actions</i> norte-americanas.'],
 d:['Ada Pellegrini Grinover e Kazuo Watanabe, <i>Código Brasileiro de Defesa do Consumidor comentado</i>.','Antonio Gidi, <i>Coisa julgada e litispendência em ações coletivas</i>.'],
 j:['STF, Tema 1.075 (2021): inconstitucional o art. 16 da LACP, que limitava territorialmente a coisa julgada.'],
 r:['x6','s1']},

{id:'x5', n:'Fazenda Pública em juízo', a:'CPC, arts. 183, 496, 534, 535 e 910; Leis 8.437/1992 e 9.494/1997',
 s:'Prazo em dobro (183), remessa necessária (496), cumprimento e execução por precatório ou RPV, restrições legais a liminares e suspensão de liminar ou segurança pelo presidente do tribunal.',
 t:['Prerrogativas justificadas pelo interesse público e pela estrutura da advocacia pública; criticadas sob o ângulo da isonomia.'],
 d:['Leonardo Carneiro da Cunha, <i>A Fazenda Pública em juízo</i>.'],
 r:['s5','e8']},

{id:'x6', n:'Ação popular', a:'Lei 4.717/1965',
 s:'Qualquer cidadão pode pleitear a anulação de ato lesivo ao patrimônio público, à moralidade administrativa, ao meio ambiente e ao patrimônio histórico e cultural (CF, art. 5º, LXXIII), isento de custas e sucumbência, salvo má-fé. A sentença de carência ou improcedência sujeita-se a reexame necessário (19).',
 r:['x4']},

{id:'x7', n:'Ação de alimentos', a:'Lei 5.478/1968',
 s:'Rito especial, com alimentos provisórios fixados de plano (4º) e audiência concentrada de conciliação, instrução e julgamento. Revisional e exoneratória. Alimentos gravídicos (Lei 11.804/2008).',
 t:['Binômio necessidade-possibilidade (CC, art. 1.694, §1º), por vezes lido como trinômio com a proporcionalidade.'],
 j:['Súmula 1 STJ: foro do domicílio do alimentando.','Súmula 358 STJ: o cancelamento da pensão do filho que atinge a maioridade depende de decisão judicial, com contraditório.'],
 r:['s4','f11']},

{id:'x8', n:'Locação e despejo', a:'Lei 8.245/1991',
 s:'Ação de despejo (59 a 66), com liminar nas hipóteses do art. 59, §1º; purga da mora (62); consignação de aluguéis (67); revisional (68 a 70); renovatória (71 a 75). Recursos sem efeito suspensivo (58, V).',
 t:['Proteção do fundo de comércio e equilíbrio contratual.'],
 d:['Sylvio Capanema de Souza, <i>A Lei do Inquilinato comentada</i>.'],
 r:['f1','e1']},

{id:'x9', n:'Arbitragem e mediação', a:'Leis 9.307/1996 e 13.140/2015',
 s:'A convenção de arbitragem (cláusula compromissória ou compromisso) afasta a jurisdição estatal e deve ser alegada em contestação (CPC, 337, X, e §6º). A sentença arbitral é título judicial (515, VII); ação anulatória em 90 dias (Lei 9.307, art. 33). Carta arbitral (CPC, 237, IV). Mediação judicial e extrajudicial.',
 t:['<i>Kompetenz-Kompetenz</i> do árbitro (Lei 9.307, art. 8º, parágrafo único).','Arbitragem como jurisdição (corrente jurisdicionalista).'],
 d:['Carlos Alberto Carmona, <i>Arbitragem e processo</i>.'],
 j:['STF, SE 5.206 (2001): constitucionalidade da Lei de Arbitragem.'],
 r:['c5','s1']},

{id:'x10', n:'Execução fiscal', a:'Lei 6.830/1980',
 s:'Cobrança da dívida ativa com base em CDA, título extrajudicial (CPC, 784, IX). Citação para pagar ou garantir em 5 dias (8º); embargos em 30 dias contados da garantia (16). Prescrição intercorrente (40).',
 t:['Presunção relativa de certeza e liquidez da dívida inscrita (art. 3º).'],
 d:['Leandro Paulsen, René Bergmann Ávila e Ingrid Schroder Sliwka, <i>Direito processual tributário</i>.'],
 j:['Súmula 314 STJ.','Tema 566 STJ (REsp 1.340.553): prescrição intercorrente.','STF, Tema 1.184 (2023): legítima a extinção de execução fiscal de baixo valor por falta de interesse de agir, observados requisitos.'],
 r:['e1','e7','s8']},

{id:'x11', n:'<i>Habeas data</i> e mandado de injunção', a:'Leis 9.507/1997 e 13.300/2016',
 s:'<i>Habeas data</i> para conhecer ou retificar informações pessoais em bancos de dados públicos ou de caráter público (CF, art. 5º, LXXII), exigida recusa administrativa prévia. Mandado de injunção quando a falta de norma regulamentadora inviabilizar direitos e liberdades constitucionais (LXXI).',
 t:['Do não concretismo à posição concretista no STF (MIs 670, 708 e 712, sobre greve de servidores).'],
 r:['x3','r6']}
];



/* ───────── NÓS NOVOS DA ROTA HORIZONTAL ───────── */
ST.push(
{id:'n0', n:'Rota aberta: escolha da via', a:'arts. 318, 539 e seguintes, 771 e 785; Lei 9.099/1995, art. 3º',
 s:'Presentes os pressupostos, a demanda segue pelo procedimento adequado. O procedimento comum é a regra e se aplica subsidiariamente aos especiais e à execução (318, parágrafo único). Há procedimento especial quando a lei o prevê, no CPC ou fora dele. Quem tem título executivo extrajudicial vai direto à execução, embora possa optar pelo processo de conhecimento (785). Nas causas de até 40 salários mínimos, o autor pode optar pelo Juizado Especial Cível estadual; nos Juizados Federais e da Fazenda Pública, onde instalados, a competência é absoluta.',
 t:['Adequação procedimental: o procedimento deve ser compatível com o direito material tutelado e com as partes.','Flexibilização: negócios processuais (190) e a adaptação pelo juiz (139, VI) temperam a rigidez dos ritos.'],
 d:['Fredie Didier Jr. — princípio da adequação procedimental.','Carlos Alberto Alvaro de Oliveira, <i>Do formalismo no processo civil</i> — adaptação do procedimento.'],
 r:['c1','x1','e1','f8']},

{id:'n1', n:'Órgão investido de jurisdição', a:'art. 16; CF, art. 92',
 s:'A relação processual só existe diante de um órgão do Poder Judiciário, ou de um árbitro, na jurisdição arbitral convencionada. O ato praticado por quem não é juiz não é sentença nula: é ato inexistente.',
 t:['Pressupostos de existência e de validade: a ausência dos primeiros impede que o processo se forme; a dos segundos o torna defeituoso.','Jurisdição como atividade substitutiva e de atuação da vontade concreta da lei (Chiovenda).'],
 d:['Oskar von Bülow, <i>Teoria das exceções processuais e dos pressupostos processuais</i> (1868) — origem da categoria dos pressupostos e do processo como relação jurídica.','Giuseppe Chiovenda, <i>Instituições de direito processual civil</i>.'],
 r:['g3','n0']},

{id:'n2', n:'Demanda', a:'arts. 2º, 312 e 319',
 s:'O processo começa por iniciativa da parte (2º) e considera-se proposto com o protocolo da petição inicial (312). A demanda fixa os limites subjetivos e objetivos da atividade jurisdicional.',
 t:['Princípio da inércia (<i>nemo iudex sine actore</i>; <i>ne procedat iudex ex officio</i>).','Elementos da demanda: partes, causa de pedir e pedido (337, §2º).'],
 d:['Cândido Rangel Dinamarco, <i>Instituições de direito processual civil</i>, vol. II.'],
 r:['c1','n7']},

{id:'n3', n:'Citação (existência)', a:'arts. 238, 239 e 312',
 s:'A citação integra o réu à relação processual e é indispensável à validade do processo, ressalvados o indeferimento da inicial e a improcedência liminar (239). Para o réu, o processo só produz efeitos a partir dela (312). A falta de citação é vício que sobrevive ao prazo da rescisória e pode ser alegada na impugnação ao cumprimento (525, §1º, I).',
 t:['Debate: citação como pressuposto de existência (relação triangular) ou de validade (o processo existe desde a demanda, mas não vale contra quem não foi citado).'],
 d:['Teresa Arruda Alvim, <i>Nulidades do processo e da sentença</i>.'],
 r:['c22','p10']},

{id:'n5', n:'Imparcialidade', a:'arts. 144 a 148',
 s:'O impedimento (144) é objetivo, pode ser alegado a qualquer tempo e autoriza ação rescisória (966, II). A suspeição (145) deve ser alegada em 15 dias do conhecimento do fato (146) e preclui. As mesmas causas se aplicam ao MP, aos auxiliares da justiça e aos demais sujeitos imparciais (148).',
 t:['Imparcialidade como elemento do devido processo e do juiz natural; distinção entre imparcialidade e neutralidade.'],
 d:['Leonardo Greco — garantias fundamentais do processo.'],
 r:['g7','p4']},

{id:'n6', n:'Capacidade', a:'arts. 70 a 76, 103 e 104',
 s:'Três camadas: capacidade de ser parte (personalidade ou personalidade judiciária, como a do espólio e a do condomínio, 75), capacidade processual (estar em juízo por si, com representação ou assistência dos incapazes, 71) e capacidade postulatória (advogado, MP, Defensoria, 103). Verificada a incapacidade ou a irregularidade de representação, o juiz suspende o processo e fixa prazo para sanar o vício (76).',
 t:['Capacidade de direito material e capacidade processual não coincidem: entes despersonalizados podem ser partes.'],
 d:['Fredie Didier Jr., <i>Curso de direito processual civil</i>, vol. 1.'],
 r:['g4','n15']},

{id:'n7', n:'Petição inicial apta', a:'arts. 319 a 321 e 330, §1º',
 s:'A inicial deve conter os requisitos do art. 319 e vir com os documentos indispensáveis (320). É inepta quando lhe faltar pedido ou causa de pedir, o pedido for indeterminado fora das hipóteses legais, da narração dos fatos não decorrer logicamente a conclusão ou contiver pedidos incompatíveis entre si (330, §1º).',
 t:['Pressuposto de validade objetivo e intrínseco; vício em regra sanável por emenda (321).'],
 r:['c1','c3']},

{id:'n8', n:'Citação válida', a:'arts. 239, 242 a 259 e 280',
 s:'A citação deve observar a forma legal, sob pena de nulidade (280). O comparecimento espontâneo do réu supre a falta ou a nulidade, fluindo a partir dele o prazo para contestar (239, §1º).',
 t:['Instrumentalidade: o vício se sana quando o ato atinge sua finalidade.'],
 r:['c22','g9']},

{id:'n9', n:'Litispendência e coisa julgada', a:'arts. 337, §§1º a 4º, e 485, V',
 s:'Há litispendência quando se repete ação em curso; há coisa julgada quando se repete ação já decidida por decisão transitada em julgado. Uma ação é idêntica a outra quando tem as mesmas partes, a mesma causa de pedir e o mesmo pedido (337, §2º). São pressupostos negativos: sua presença impede o julgamento do mérito e é conhecível de ofício.',
 t:['Teoria da tríplice identidade (<i>tria eadem</i>), complementada pela teoria da identidade da relação jurídica em casos-limite.'],
 d:['José Rogério Cruz e Tucci, <i>A causa petendi no processo civil</i>.'],
 r:['c15','n16']},

{id:'n10', n:'Perempção', a:'art. 486, §3º',
 s:'O autor que der causa, por 3 vezes, à extinção do processo por abandono não pode propor nova ação contra o réu com o mesmo objeto, ressalvada a possibilidade de alegar seu direito em defesa.',
 t:['Sanção processual ao abuso do direito de demandar.'],
 r:['c21','n16']},

{id:'n11', n:'Convenção de arbitragem', a:'arts. 337, X, §§5º e 6º, e 485, VII',
 s:'Cláusula compromissória ou compromisso arbitral impedem o julgamento estatal do mérito. Não é matéria conhecível de ofício: se o réu não a alegar em contestação, entende-se que aceitou a jurisdição estatal (337, §§5º e 6º). Também extingue o processo o reconhecimento da competência pelo juízo arbitral (485, VII).',
 t:['<i>Kompetenz-Kompetenz</i>: cabe primeiro ao árbitro decidir sobre a própria competência (Lei 9.307/1996, art. 8º, parágrafo único).'],
 d:['Carlos Alberto Carmona, <i>Arbitragem e processo</i>.'],
 r:['x9','n16']},

{id:'n12', n:'Caução e custas da ação anterior', a:'arts. 83 e 486, §2º',
 s:'O autor que residir fora do Brasil ou deixar de residir no país durante o processo presta caução suficiente às custas e aos honorários, se não tiver imóveis no Brasil, salvo as exceções legais (83). Extinto o processo sem resolução de mérito, a nova propositura depende do pagamento ou depósito das custas e dos honorários da ação anterior (486, §2º).',
 r:['g4']},

{id:'n13', n:'Legitimidade', a:'arts. 17, 18, 338 e 339',
 s:'Pertinência subjetiva da demanda: em regra, só o titular do direito afirmado pode pleiteá-lo em nome próprio (legitimação ordinária). A legitimação extraordinária depende de autorização do ordenamento jurídico (18). Alegada a ilegitimidade passiva, o autor pode substituir o réu em 15 dias, e o réu deve indicar o sujeito passivo, se o conhecer (338 e 339).',
 t:['Legitimação ordinária e extraordinária (substituição processual); legitimação exclusiva e concorrente.','Teoria da asserção: aferida a partir do que o autor afirma na inicial.'],
 d:['Fredie Didier Jr. — legitimação extraordinária negociada.','José Carlos Barbosa Moreira — estudos sobre legitimação.'],
 r:['g2','n15']},

{id:'n14', n:'Interesse processual', a:'arts. 17, 19 e 20',
 s:'Necessidade e utilidade da tutela jurisdicional, a que parte da doutrina acrescenta a adequação da via eleita. Basta o interesse na mera declaração (19), mesmo após a violação do direito (20).',
 t:['Binômio necessidade-utilidade, ou trinômio com a adequação.','Exigência de prévio requerimento administrativo em certas matérias como expressão do interesse.'],
 j:['STF, Tema 350 (RE 631.240, 2014): nas ações previdenciárias, exige-se prévio requerimento administrativo, ressalvadas as exceções fixadas.'],
 r:['g2','n15']},

{id:'n15', n:'Correção do vício', a:'arts. 76, 139, IX, 317, 321, 338 e 352',
 s:'Antes de extinguir o processo por vício processual, o juiz deve dar à parte oportunidade de corrigi-lo (317). O CPC prevê caminhos específicos: regularização da capacidade e da representação (76), emenda da inicial (321), substituição do réu (338) e correção na fase de providências preliminares (352). Corrigido o vício, o processo retoma a rota.',
 t:['Primazia do julgamento de mérito e dever de prevenção, decorrentes do modelo cooperativo (6º).'],
 d:['Daniel Mitidiero, <i>Colaboração no processo civil</i>.'],
 r:['n0']},

{id:'n16', end:true, n:'Extinção sem resolução do mérito', a:'art. 485, I, IV a VII e IX, e §3º',
 s:'Não corrigido o vício, ou sendo ele insanável, o processo se extingue sem resolução do mérito: indeferimento da inicial (I), ausência de pressupostos de constituição e de desenvolvimento válido (IV), perempção, litispendência ou coisa julgada (V), ausência de legitimidade ou de interesse (VI), convenção de arbitragem (VII), intransmissibilidade (IX). As matérias dos incisos IV, V, VI e IX são conhecíveis de ofício em qualquer tempo e grau, enquanto não houver trânsito em julgado (§3º).',
 t:['A sentença terminativa, em regra, não impede a repropositura, desde que corrigido o vício (486, §1º).'],
 r:['r2']},

{id:'n17', n:'Controle dos pressupostos a qualquer tempo', a:'arts. 337, §5º, e 485, §3º',
 s:'A rede de entrada não é uma porta que se atravessa uma vez. Ausência de pressupostos, perempção, litispendência, coisa julgada, ilegitimidade, falta de interesse e intransmissibilidade podem ser conhecidas de ofício em qualquer tempo e grau de jurisdição, até o trânsito em julgado (485, §3º). Ficam de fora a incompetência relativa e a convenção de arbitragem, que dependem de alegação (337, §5º).',
 t:['Matérias de ordem pública e o limite do contraditório: mesmo conhecíveis de ofício, exigem prévia oitiva das partes (arts. 9º e 10).'],
 r:['n16','n15']},

{id:'c22', n:'Citação', a:'arts. 238 a 259',
 s:'Ato pelo qual se convoca o réu para integrar a relação processual (238). Preferencialmente por meio eletrônico (246); não confirmada, por correio, oficial de justiça, escrivão ou chefe de secretaria, ou edital (246, §1º-A). Por hora certa quando houver suspeita de ocultação (252) e por edital quando o réu for desconhecido ou incerto, ou estiver em local ignorado, incerto ou inacessível (256). A citação válida induz litispendência, torna litigiosa a coisa e constitui o devedor em mora (240); a interrupção da prescrição retroage à data da propositura (240, §1º).',
 t:['Contraditório como garantia de ciência e de reação.','Citação ficta (hora certa e edital) e o curador especial do réu revel assim citado (72, II).'],
 j:['Súmula 106 STJ: a demora imputável ao serviço judiciário não prejudica a interrupção da prescrição.','Súmula 429 STJ: a citação postal exige aviso de recebimento.'],
 x:'A Lei 14.195/2021 reescreveu o art. 246: citação eletrônica em até 2 dias úteis da decisão que a determinar, confirmação em até 3 dias úteis e multa por ausência injustificada de confirmação.',
 r:['c5','n3','n8']},

/* ───────── TRILHO DO JUIZADO ESPECIAL CÍVEL ───────── */
{id:'j2', end:true, n:'Incompetência e partes vedadas', a:'Lei 9.099/1995, arts. 3º, §2º, 8º e 51, II a IV',
 s:'Ficam fora do JEC as causas de natureza alimentar, falimentar, fiscal, de interesse da Fazenda Pública, de acidentes de trabalho, de resíduos e de estado e capacidade das pessoas (3º, §2º). Não podem ser partes o incapaz, o preso, as pessoas jurídicas de direito público, as empresas públicas da União, a massa falida e o insolvente civil (8º). Nesses casos, na incompetência territorial ou se sobrevier impedimento, o processo é extinto (51, II a IV).',
 t:['Contraste com o CPC: no JEC, a incompetência leva à extinção, e não à remessa dos autos ao juízo competente (CPC, art. 64, §3º).'],
 r:[]},

{id:'j3', n:'Citação e intimações', a:'Lei 9.099/1995, arts. 18 e 19',
 s:'Citação por correspondência com aviso de recebimento em mão própria; para pessoa jurídica, pela entrega ao encarregado da recepção; por oficial de justiça, se necessário (18). Não se admite citação por edital (18, §2º). As intimações podem ser feitas por qualquer meio idôneo de comunicação (19).',
 t:['A vedação do edital empurra para a justiça comum as causas com réu em local incerto.'],
 r:['j4']},

{id:'j4', n:'Sessão de conciliação', a:'Lei 9.099/1995, arts. 21 a 26',
 s:'Aberta a sessão, o juiz togado, o juiz leigo ou o conciliador esclarece as partes sobre as vantagens da conciliação e os riscos da demanda (21). Não obtida a conciliação, as partes podem optar pelo juízo arbitral (24 a 26). Se o autor não comparecer a qualquer audiência, o processo é extinto (51, I); se o réu não comparecer, há revelia (20).',
 t:['Prioridade da solução consensual como vocação do microssistema.'],
 r:['j5','j6','j7','j9']},

{id:'j5', end:true, n:'Acordo homologado', a:'Lei 9.099/1995, arts. 22, parágrafo único, e 41',
 s:'Obtida a conciliação, ela é reduzida a escrito e homologada pelo juiz togado, por sentença com eficácia de título executivo. Da sentença homologatória não cabe recurso (41).',
 r:['j16']},

{id:'j6', n:'Juízo arbitral', a:'Lei 9.099/1995, arts. 24 a 26',
 s:'Não havendo acordo, as partes podem optar, de comum acordo, pelo juízo arbitral, conduzido por árbitro escolhido entre os juízes leigos. O laudo é submetido ao juiz togado para homologação por sentença irrecorrível (26).',
 r:['j16']},

{id:'j7', end:true, n:'Ausência do autor', a:'Lei 9.099/1995, art. 51, I e §2º',
 s:'O não comparecimento do autor a qualquer das audiências extingue o processo sem resolução de mérito, com condenação em custas, salvo se comprovar que a ausência decorreu de força maior (51, §2º).',
 r:[]},

{id:'j8', n:'Revelia no JEC', a:'Lei 9.099/1995, arts. 9º, §4º, e 20',
 s:'Não comparecendo o réu à sessão de conciliação ou à audiência de instrução e julgamento, reputam-se verdadeiros os fatos alegados no pedido inicial, salvo se o contrário resultar da convicção do juiz (20). A pessoa jurídica pode fazer-se representar por preposto credenciado, sem vínculo empregatício (9º, §4º).',
 t:['A revelia no JEC decorre da ausência à audiência, e não apenas da falta de contestação.'],
 r:['j11']},

{id:'j9', n:'Resposta e pedido contraposto', a:'Lei 9.099/1995, arts. 10, 30 e 31',
 s:'A contestação, oral ou escrita, contém toda a matéria de defesa, salvo a arguição de suspeição ou impedimento (30). Não se admite reconvenção, mas o réu pode formular pedido em seu favor, nos limites do art. 3º, desde que fundado nos mesmos fatos da causa (31). Também não se admite intervenção de terceiros (10), com a exceção do incidente de desconsideração da personalidade jurídica (CPC, art. 1.062).',
 t:['Simplificação da defesa e caráter dúplice limitado.'],
 r:['j8','j10']},

{id:'j10', n:'Audiência de instrução e julgamento', a:'Lei 9.099/1995, arts. 27 a 29 e 32 a 37',
 s:'Não instituído o juízo arbitral, segue-se a audiência de instrução e julgamento, se possível imediatamente (27). Nela se ouvem as partes, colhem-se as provas e profere-se a sentença (28). Até 3 testemunhas por parte (34). Em vez de perícia formal, o juiz pode inquirir técnicos de sua confiança e admitir pareceres (35). A prova oral não é reduzida a escrito; registra-se apenas o essencial (36).',
 t:['Concentração e imediação levadas ao extremo: resposta, provas e decisão no mesmo ato.','Causas que exijam prova técnica complexa escapam ao JEC por incompatibilidade com o rito.'],
 r:['j11']},

{id:'j11', n:'Sentença no JEC', a:'Lei 9.099/1995, arts. 38 a 40 e 55',
 s:'Dispensa relatório; menciona os elementos de convicção, com breve resumo dos fatos relevantes (38). Não se admite condenação por quantia ilíquida, ainda que o pedido seja genérico (38, parágrafo único). É ineficaz a parte da condenação que exceder a alçada (39). O juiz leigo pode instruir e proferir decisão, submetida ao juiz togado (40). Em primeiro grau não há custas nem honorários, salvo litigância de má-fé (55).',
 r:['j12','j13']},

{id:'j12', n:'Embargos de declaração', a:'Lei 9.099/1995, arts. 48 a 50',
 s:'Cabem contra sentença ou acórdão nas hipóteses do CPC, opostos em 5 dias, por escrito ou oralmente (49), e interrompem o prazo para outros recursos (50, na redação dada pelo CPC/2015).',
 r:['j13']},

{id:'j13', n:'Recurso inominado', a:'Lei 9.099/1995, arts. 41 a 46 e 55',
 s:'Contra a sentença, salvo a homologatória, cabe recurso para a Turma Recursal, composta por 3 juízes togados de primeiro grau (41). Prazo de 10 dias, com preparo nas 48 horas seguintes à interposição, independentemente de intimação, sob pena de deserção (42, §1º). Em regra só tem efeito devolutivo (43). Exige advogado (41, §2º). Confirmada a sentença pelos próprios fundamentos, a súmula do julgamento serve de acórdão (46). O recorrente vencido paga custas e honorários (55).',
 t:['Irrecorribilidade das interlocutórias: não há agravo de instrumento no microssistema.'],
 j:['STF, Tema 77 (RE 576.847, 2009): não cabe mandado de segurança contra decisão interlocutória proferida no JEC.'],
 r:['j14']},

{id:'j14', n:'Depois da Turma Recursal', a:'Súmulas 203 STJ e 640 STF; Res. STJ 3/2016',
 s:'Contra acórdão de Turma Recursal cabe recurso extraordinário, se houver questão constitucional com repercussão geral (Súmula 640 STF), mas não recurso especial (Súmula 203 STJ). A divergência com a jurisprudência do STJ é levada por reclamação ao tribunal de justiça (Res. STJ 3/2016). Nos Juizados Federais e da Fazenda Pública há pedido de uniformização de interpretação de lei.',
 r:['r7','x2','j15']},

{id:'j15', fin:true, tg:'Sem ação rescisória', n:'Trânsito em julgado', a:'Lei 9.099/1995, art. 59',
 s:'Não se admite ação rescisória nas causas sujeitas ao procedimento do JEC (59). A desconstituição da coisa julgada fica restrita a hipóteses excepcionais, como a <i>querela nullitatis</i> por falta de citação.',
 r:['j16','p10']},

{id:'j16', n:'Execução no JEC', a:'Lei 9.099/1995, arts. 52 e 53',
 s:'A sentença é executada no próprio Juizado, com aplicação do CPC e as alterações do art. 52: dispensa de nova citação (IV), alienação forçada simplificada e embargos do devedor nos próprios autos, com matérias restritas (IX). Também se executam no JEC títulos extrajudiciais de até 40 salários mínimos (53), com tentativa de conciliação após a penhora.',
 t:['O CPC aplica-se subsidiariamente; prevalece o entendimento de que incide a multa do art. 523, §1º.'],
 r:['s1','e5']}
);

Object.assign(ST.find(s=>s.id==='x1'), {
 n:'Pedido no Juizado Especial Cível', a:'Lei 9.099/1995, arts. 2º, 3º, 8º, 9º e 14 a 17',
 s:'Causas de até 40 salários mínimos, além das enumeradas no art. 3º, por opção do autor. Podem demandar pessoas físicas capazes, microempresas, empresas de pequeno porte, OSCIPs e sociedades de crédito ao microempreendedor (8º, §1º). Sem advogado até 20 salários mínimos (9º). O pedido pode ser escrito ou oral, reduzido a termo pela secretaria (14). Princípios: oralidade, simplicidade, informalidade, economia processual e celeridade (2º).',
 t:['Acesso à justiça: segunda e terceira "ondas" renovatórias.','Microssistema com aplicação apenas subsidiária do CPC, quando compatível com seus princípios.'],
 d:['Mauro Cappelletti e Bryant Garth, <i>Acesso à justiça</i>.','Joel Dias Figueira Júnior, <i>Juizados Especiais Estaduais Cíveis e Criminais</i>.'],
 j:['Enunciados do FONAJE como referência interpretativa, sem força vinculante.'],
 r:['j2','j3']
});

/* rótulos curtos para estações em faixas */
const SHORT = {t3:'Antecipada antecedente', t4:'Cautelar antecedente', t2:'Tutela de urgência', t5:'Tutela da evidência',
  g12:'Direito intertemporal', p8:'Conflito de competência', p5:'IRDR', p3:'IAC', p7:'Arguição de inconstitucionalidade', p6:'Reclamação'};
ST.find(s=>s.id==='s2').tg = 'Na pendência de recurso sem efeito suspensivo';
