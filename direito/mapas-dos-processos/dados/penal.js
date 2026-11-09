const PST = [
/* ───── REDE DE ENTRADA: TRIAGEM ───── */
{id:'pn0', n:'Escolha da via', a:'CPP, art. 394; Lei 9.099/1995, art. 61; CF, art. 5º, XXXVIII',
 s:'Feita a triagem, o caso segue pela via adequada: rito comum ordinário (pena máxima igual ou superior a 4 anos), sumário (inferior a 4 anos), sumaríssimo no JECrim (infrações de menor potencial ofensivo), Tribunal do Júri (crimes dolosos contra a vida) ou um procedimento especial. No crime, a ordem de urgência é fixa: liberdade, depois prazo, depois punibilidade, depois o resto.',
 t:['Sistema acusatório (art. 3º-A): separação entre as funções de acusar, defender e julgar.','O rito é garantia: define o momento da defesa, o número de testemunhas e a possibilidade de solução negociada.'],
 d:['Aury Lopes Jr., <i>Direito processual penal</i>.','Gustavo Badaró, <i>Processo penal</i>.'],
 r:['pc0','pk1','pn12']},

{id:'pn1', n:'Ação penal pública incondicionada', a:'CP, art. 100; CPP, arts. 24 e 42',
 s:'Regra geral: o Ministério Público promove a ação por denúncia, sem depender da vontade de ninguém. Vigoram a obrigatoriedade, mitigada pela justiça negocial (ANPP, transação), e a indisponibilidade: o MP não pode desistir da ação proposta (42).',
 t:['Obrigatoriedade e indisponibilidade como corolários do monopólio estatal da persecução.'],
 r:['pc2','pn13']},

{id:'pn2', n:'Ação penal pública condicionada', a:'CPP, arts. 24, 25, 38 e 39; CP, art. 102',
 s:'Depende de representação do ofendido ou de requisição do Ministro da Justiça. A representação é irretratável depois de oferecida a denúncia (25) e deve ser feita no prazo decadencial. Lesões leves e culposas dependem de representação (Lei 9.099/1995, art. 88), salvo em violência doméstica contra a mulher.',
 t:['Condição de procedibilidade que preserva a esfera da vítima, a quem cabe ponderar o <i>strepitus iudicii</i>.'],
 x:'Segundo a sua skill de triagem, a Lei 15.397/2026 revogou o §5º do art. 171 do CP: o estelionato voltou a ser de ação pública incondicionada. Para fatos anteriores, é sustentável exigir representação, por ser norma mista mais benéfica.',
 r:['pn6','pc1']},

{id:'pn3', n:'Ação penal privada', a:'CPP, arts. 30, 44, 48 a 51 e 60',
 s:'O ofendido promove a ação por queixa, com procuração com poderes especiais, nome do querelado e menção do fato (44). Regem-na a oportunidade e a disponibilidade: renúncia, perdão aceito e perempção extinguem a punibilidade. A queixa contra um dos autores obriga ao processo de todos (indivisibilidade, 48).',
 t:['Oportunidade e disponibilidade em oposição à obrigatoriedade da ação pública.'],
 r:['pn6','pf6']},

{id:'pn4', n:'Ação penal privada subsidiária', a:'CF, art. 5º, LIX; CPP, art. 29',
 s:'Se o MP não oferece denúncia no prazo legal, o ofendido pode propor queixa subsidiária. O MP pode aditá-la, repudiá-la e oferecer denúncia substitutiva, e retoma a ação como parte principal se o querelante for negligente. Não cabe se o MP pediu arquivamento ou requisitou diligências.',
 t:['Garantia constitucional de controle da inércia do Ministério Público.'],
 r:['pc2']},

{id:'pn5', n:'Prescrição da pretensão punitiva', a:'CP, arts. 109, 110, 115 e 117',
 s:'Calculada pela pena máxima cominada (abstrata) ou, com trânsito para a acusação, pela pena aplicada (retroativa e intercorrente), sem termo inicial anterior à denúncia ou queixa (110, §1º). Os prazos vão de 3 a 20 anos (109) e caem pela metade para o menor de 21 anos na data do fato ou maior de 70 na sentença (115), salvo, desde a Lei 15.160/2025, nos crimes que envolvam violência sexual contra a mulher. Não existe prescrição pela pena hipotética (Súmula 438 STJ).',
 t:['Extinção da punibilidade é sempre a primeira tese da defesa: a de maior eficácia.'],
 j:['Súmula 438 STJ.','Súmula 191 STJ: a pronúncia interrompe a prescrição, ainda que o júri desclassifique o crime.'],
 r:['pg5','pn16']},

{id:'pn6', n:'Decadência, renúncia, perdão e perempção', a:'CP, arts. 103 a 107; CPP, arts. 38 e 60',
 s:'Decadência: 6 meses contados do dia em que o ofendido soube quem é o autor do fato, para representar ou oferecer queixa (103 do CP; 38 do CPP), prazo de direito material que conta o dia do começo e não se prorroga. Na ação privada, extinguem ainda a punibilidade a renúncia, o perdão aceito e a perempção (60).',
 x:'Segundo a sua skill de triagem, a Lei 15.438/2026 elevou a decadência para 12 meses nos crimes de violência doméstica e familiar contra a mulher (CP, art. 103, parágrafo único; CPP, art. 38, §2º; Lei 11.340, art. 16-A).',
 r:['pn16']},

{id:'pn7', n:'Outras causas de extinção da punibilidade', a:'CP, art. 107; CPP, art. 62',
 s:'Morte do agente, provada por certidão de óbito (62 do CPP); anistia, graça ou indulto; <i>abolitio criminis</i>; retratação, quando a lei admite; perdão judicial. Nos crimes tributários, o pagamento integral extingue a punibilidade, e o crime material só se tipifica após o lançamento definitivo (Súmula Vinculante 24).',
 j:['Súmula 18 STJ: a sentença concessiva do perdão judicial é declaratória da extinção da punibilidade.','Súmula Vinculante 24.'],
 r:['pn16']},

{id:'pn8', n:'Foro por prerrogativa de função', a:'CF, arts. 102, I, b e c, 105, I, a, e 108, I, a',
 s:'O foro alcança apenas crimes cometidos no exercício do cargo e relacionados às funções (STF, AP 937 QO, 2018). Em 2025 o STF ampliou o alcance temporal: a prerrogativa subsiste mesmo após o afastamento do cargo, ainda que a investigação ou a ação comecem depois (HC 232.627 e Inq 4.787). O corréu sem foro pode ser atraído por conexão (Súmula 704 STF), mas o desmembramento é a regra prática.',
 j:['STF, AP 937 QO (2018).','STF, HC 232.627 e Inq 4.787 (2025), com critérios de aplicação fixados em 2026, segundo a sua skill de competência.','Súmula Vinculante 45: a competência do júri prevalece sobre foro estabelecido exclusivamente pela Constituição estadual.'],
 r:['pf4']},

{id:'pn9', n:'Justiça competente', a:'CF, arts. 109, 121 e 124',
 s:'Justiça Federal nos casos do art. 109 da CF: crimes em detrimento de bens, serviços ou interesse da União, autarquias e empresas públicas federais (IV, excluídas as contravenções), crimes previstos em tratado com resultado no exterior (V), contra a organização do trabalho e, nos casos da lei, contra o sistema financeiro (VI). Eleitoral e Militar têm regras próprias. Fora disso, a Justiça Estadual.',
 j:['Súmula 42 STJ: sociedade de economia mista, competência estadual.','Súmula 122 STJ: conexão entre crime federal e estadual atrai a Justiça Federal.','STF, Inq 4.435 AgR (2019): crimes comuns conexos a eleitorais são julgados pela Justiça Eleitoral.'],
 r:['pn15']},

{id:'pn10', n:'Tribunal do Júri', a:'CF, art. 5º, XXXVIII, d; CPP, arts. 74, §1º, e 78, I',
 s:'Competência constitucional mínima para os crimes dolosos contra a vida, consumados ou tentados. Na conexão, o júri prevalece sobre a jurisdição comum (78, I).',
 x:'Segundo a sua skill de competência, a Lei 15.358/2026 retirou do júri os homicídios cometidos por membros de organização criminosa ultraviolenta, grupo paramilitar ou milícia privada, regra impugnada nas ADIs 7.952, 7.956, 7.957 e 7.958, pendentes. Confira o estado antes de invocar.',
 r:['pj1']},

{id:'pn11', n:'Foro territorial, conexão e continência', a:'CPP, arts. 70 a 78',
 s:'Regra: lugar da consumação; na tentativa, o do último ato de execução (70). No estelionato por depósito, cheque ou transferência, o domicílio da vítima (70, §4º). Conexão (76) e continência (77) reúnem processos; entre jurisdições da mesma categoria, prevalece a da pena mais grave, depois o número de infrações, depois a prevenção (78).',
 j:['Súmula 706 STF: é relativa a nulidade decorrente da inobservância da competência por prevenção.'],
 r:['pn15']},

{id:'pn12', n:'Escolha do rito', a:'CPP, art. 394',
 s:'Comum ordinário, para pena máxima igual ou superior a 4 anos; sumário, para pena máxima inferior a 4 anos; sumaríssimo, para infrações de menor potencial ofensivo (até 2 anos, Lei 9.099/1995, art. 61). Há ainda os procedimentos especiais (júri, drogas, funcionário público, competência originária). Os arts. 395 a 398 aplicam-se a todos os procedimentos de primeiro grau (394, §4º), e o ordinário é subsidiário (§5º).',
 t:['Defesa escrita antes do recebimento nos ritos de drogas, funcionário público e competência originária; depois, nos ritos comuns e no júri; em audiência, no JECrim.'],
 r:['pc2','pk1','pj1','ps1']},

{id:'pn13', n:'Solução negociada', a:'Lei 9.099/1995, arts. 74, 76 e 89; CPP, art. 28-A',
 s:'Quatro institutos, com requisitos próprios: composição civil e transação penal, nas infrações de menor potencial ofensivo; suspensão condicional do processo, para pena mínima igual ou inferior a 1 ano; acordo de não persecução penal, para crimes sem violência ou grave ameaça com pena mínima inferior a 4 anos e confissão formal. Aceitar é decisão do cliente, sempre por escrito.',
 t:['Justiça penal negocial: mitigação da obrigatoriedade e ampliação do consenso no processo penal.'],
 d:['Vinicius Gomes de Vasconcellos, <i>Barganha e justiça criminal negocial</i>.'],
 r:['pc13','pc15','pk9']},

{id:'pn14', n:'Violência doméstica: vedações', a:'Lei 11.340/2006, arts. 16 e 41; CPP, art. 28-A, §2º, IV',
 s:'Nos crimes de violência doméstica e familiar contra a mulher, não se aplica a Lei 9.099/1995, qualquer que seja a pena (41): não há JECrim, transação nem suspensão condicional do processo. Também é vedado o ANPP. A lesão corporal é de ação pública incondicionada. A retratação da representação só vale em audiência designada para esse fim.',
 j:['Súmula 536 STJ: suspensão condicional do processo e transação não se aplicam.','Súmula 542 STJ: a lesão corporal é de ação pública incondicionada.'],
 r:['pf5']},

{id:'pn15', n:'Declínio e correção da via', a:'CPP, arts. 108, 109 e 567',
 s:'Reconhecida a incompetência, os autos são remetidos ao juízo competente, e só os atos decisórios são anulados (567). A defesa argui a incompetência na resposta à acusação, por exceção (108). Erros de rito ou de capitulação corrigem-se por aditamento ou conversão do procedimento.',
 r:['pn0']},

{id:'pn16', end:true, n:'Extinção da punibilidade', a:'CPP, art. 61; CP, art. 107',
 s:'Reconhecida a causa extintiva, o juiz deve declará-la de ofício, em qualquer fase do processo (61). É a tese de maior eficácia: dispensa o exame do mérito e encerra a persecução.',
 r:[]},

/* ───── TRILHO PRINCIPAL: RITO COMUM ORDINÁRIO ───── */
{id:'pc0', n:'Notícia do crime', a:'CPP, arts. 5º e 27',
 s:'A autoridade toma conhecimento do fato de ofício, por requisição do MP, por requerimento do ofendido ou por notícia de qualquer pessoa (5º). Na ação condicionada, a investigação só se inicia com a representação; na privada, a requerimento de quem pode oferecer queixa.',
 t:['<i>Notitia criminis</i> de cognição imediata, mediata ou coercitiva (esta, pela prisão em flagrante).'],
 r:['pc1','pp1']},

{id:'pc1', n:'Investigação preliminar', a:'CPP, arts. 4º a 23',
 s:'Inquérito policial, presidido pelo delegado: diligências do art. 6º, prazos de 10 dias com o investigado preso e 30 solto (10), com regras próprias na Justiça Federal e na Lei de Drogas. A defesa tem acesso aos elementos já documentados (Súmula Vinculante 14) e pode requerer diligências (14). O indiciamento é ato privativo do delegado, fundamentado (Lei 12.830/2013, art. 2º, §6º).',
 t:['Natureza inquisitorial e caráter informativo: os elementos não podem fundamentar sozinhos a condenação (155).'],
 d:['Aury Lopes Jr. e Ricardo Jacobsen Gloeckner, <i>Investigação preliminar no processo penal</i>.'],
 j:['Súmula Vinculante 14.'],
 r:['pc11','pc12','pc2']},

{id:'pc2', n:'Denúncia ou queixa', a:'CPP, arts. 41 a 46',
 s:'Exposição do fato com todas as circunstâncias, qualificação do acusado, classificação do crime e rol de testemunhas (41). Prazo para a denúncia: 5 dias com o investigado preso e 15 solto (46). Antes de denunciar, o MP deve propor o ANPP ou recusá-lo motivadamente, quando cabível.',
 t:['Justa causa: lastro probatório mínimo de autoria e materialidade.','Correlação entre acusação e sentença: o réu se defende dos fatos narrados.'],
 r:['pc13','pc3']},

{id:'pc3', n:'Recebimento ou rejeição', a:'CPP, arts. 395 e 396',
 s:'O juiz rejeita a denúncia inepta, sem pressuposto processual ou condição da ação, ou sem justa causa (395). Não rejeitada, recebe-a e manda citar o acusado para responder em 10 dias (396). O recebimento interrompe a prescrição (CP, art. 117, I).',
 j:['O STJ exige fundamentação mínima no recebimento e admite que o juiz o reveja após a resposta à acusação.'],
 r:['pc14','pc15','pc4']},

{id:'pc4', n:'Citação', a:'CPP, arts. 351 a 369',
 s:'Em regra pessoal, por mandado. Havendo ocultação, por hora certa (362). Não encontrado o acusado, por edital (361). O acusado citado pessoalmente que deixa de comparecer sem motivo segue no processo sem novas intimações (367).',
 t:['Ciência efetiva da acusação como condição da ampla defesa.'],
 r:['pc16','pc5']},

{id:'pc5', n:'Resposta à acusação', a:'CPP, arts. 396 e 396-A',
 s:'Em 10 dias, o acusado pode arguir preliminares e alegar tudo o que interesse à defesa, oferecer documentos e justificações, especificar provas e arrolar até 8 testemunhas (396-A). É a primeira oportunidade para pedir a remessa do ANPP recusado ao órgão superior do MP. Não apresentada, o juiz nomeia defensor (§2º).',
 t:['Peça obrigatória; sua falta ou deficiência grave gera nulidade.'],
 j:['Súmula 523 STF: a falta de defesa constitui nulidade absoluta; a deficiência só anula se houver prejuízo.'],
 r:['pc6']},

{id:'pc6', n:'Análise da resposta', a:'CPP, arts. 397 a 399',
 s:'O juiz absolve sumariamente se houver excludente de ilicitude manifesta, excludente de culpabilidade (salvo inimputabilidade), atipicidade ou extinção da punibilidade (397). Não sendo o caso, designa audiência e manda intimar as partes (399).',
 r:['pc18','pc7']},

{id:'pc7', n:'Audiência de instrução e julgamento', a:'CPP, arts. 400 a 405',
 s:'Em até 60 dias: declarações do ofendido, testemunhas da acusação e da defesa (até 8 por parte), esclarecimentos dos peritos, acareações, reconhecimento e, por último, o interrogatório (400). A gravação audiovisual dispensa a transcrição (405).',
 t:['Oralidade, imediação e contraditório na produção da prova.','A prova colhida no inquérito precisa ser confirmada em juízo (155).'],
 j:['STF, HC 127.900 (2016): interrogatório ao final em todos os ritos.','STJ, Tema 1.114: inversão admitida só quanto às testemunhas; a nulidade exige prejuízo e arguição oportuna.'],
 r:['pc19','pc8']},

{id:'pc8', n:'Diligências e alegações finais', a:'CPP, arts. 402 a 404',
 s:'Encerrada a instrução, as partes podem requerer diligências cuja necessidade surgiu na audiência (402). Seguem-se debates orais de 20 minutos, prorrogáveis por 10 (403), ou memoriais em 5 dias sucessivos, em casos complexos (403, §3º), e a sentença em 10 dias.',
 t:['A defesa fala por último, inclusive o delatado depois do delator.'],
 j:['STF, HC 166.373 (tese de 2022): o réu delatado tem direito de apresentar alegações finais depois do colaborador.'],
 r:['pc9']},

{id:'pc9', n:'Sentença', a:'CPP, arts. 381 a 392',
 s:'Absolutória, nas hipóteses do art. 386, entre elas a falta de prova suficiente (VII); condenatória, com dosimetria, valor mínimo para reparação dos danos (387, IV) e decisão fundamentada sobre a prisão (387, §1º). O juiz pode condenar mesmo quando o MP pede a absolvição (385), regra hoje questionada.',
 t:['<i>In dubio pro reo</i> e o <i>standard</i> da prova além da dúvida razoável.'],
 j:['A compatibilidade do art. 385 com o sistema acusatório está em debate (STJ, REsp 2.022.413, 2023; STF, ADPF 1.122, pendente).'],
 r:['pc20','pc21','pc22','pr1']},

{id:'pr1', n:'Apelação', a:'CPP, arts. 593 a 603 e 615 a 617',
 s:'Contra sentenças definitivas de condenação ou absolvição (593, I). Interposição em 5 dias e razões em 8, contados em dias corridos (593 e 600); pode-se arrazoar na instância superior (600, §4º). Efeito suspensivo na condenação: não há execução antes do trânsito em julgado (ADCs 43, 44 e 54). Vedada a <i>reformatio in pejus</i> (617). O empate favorece o réu (615, §1º, com a Lei 14.836/2024).',
 j:['Súmula 160 STF: o tribunal não reconhece contra o réu nulidade não arguida pela acusação.','STF, ADCs 43, 44 e 54 (2019).'],
 r:['pr3','pr2']},

{id:'pr2', n:'Recurso especial e extraordinário', a:'CF, arts. 102, III, e 105, III; CPC, art. 1.029 e seguintes',
 s:'Contra acórdãos de tribunal, em 15 dias corridos. Exigem prequestionamento e não reexaminam provas. Inadmitidos, cabe agravo (CPC, art. 1.042), também em 15 dias.',
 x:'No REsp contra acórdão publicado desde 03/09/2026, a relevância da questão de direito federal deve ser demonstrada em tópico próprio, e é presumida nas ações penais (Lei 15.484/2026).',
 j:['A Súmula 699 STF (agravo em 5 dias) está superada.'],
 r:['pc10']},

{id:'pc10', n:'Trânsito em julgado', a:'CF, art. 5º, LVII; CPP, art. 283',
 s:'Só depois dele a pena pode ser executada (ADCs 43, 44 e 54); antes, a prisão é sempre cautelar e exige os requisitos do art. 312. A exceção é a condenação pelo júri, executável de imediato (Tema 1.068). A partir daqui corre a prescrição da pretensão executória.',
 t:['Presunção de inocência como regra de tratamento.'],
 j:['STF, ADCs 43, 44 e 54 (2019).','STF, Tema 788: a prescrição da pretensão executória começa com o trânsito em julgado para ambas as partes, com modulação temporal.'],
 r:['pr5','pe1']},

{id:'pe1', n:'Início da execução penal', a:'LEP, arts. 1º, 66 e 105 a 111',
 s:'Com a guia de recolhimento (105), a execução se instaura perante o juiz da execução, competente para progressões, livramento, remição, unificação de penas e incidentes (66). As penas somam-se ou unificam-se para fixar o regime (111), e computa-se a detração (CP, art. 42).',
 t:['Natureza jurisdicional da execução penal: o condenado é sujeito de direitos, e não objeto.'],
 d:['Rodrigo Duque Estrada Roig, <i>Execução penal: teoria crítica</i>.','Salo de Carvalho (org.), <i>Crítica à execução penal</i>.'],
 j:['Súmula 716 STF: admite-se progressão antes do trânsito em julgado.','Súmula Vinculante 56: a falta de estabelecimento adequado não autoriza a manutenção em regime mais gravoso.'],
 r:['pe4','pe5','pe6','pe2']},

{id:'pe2', n:'Incidentes e agravo em execução', a:'LEP, arts. 180 a 197',
 s:'Conversões de pena, excesso ou desvio de execução, anistia, indulto e comutação tramitam como incidentes. Das decisões do juiz da execução cabe agravo em execução, sem efeito suspensivo (197), em 5 dias.',
 j:['Súmula 700 STF: 5 dias para o agravo em execução.'],
 r:['pe7','pe8','pe9','pe3']},

{id:'pe3', end:true, tg:'Fim do percurso', n:'Extinção da pena', a:'CP, arts. 82, 90 e 107; LEP, art. 109',
 s:'Cumprida ou extinta a pena (pelo término do período de prova, por indulto ou por prescrição executória), o juiz declara a extinção (LEP, art. 109). Daí em diante corre o prazo para a reabilitação (CP, art. 94).',
 r:['pi6']},

/* ───── RAMAIS DO TRILHO PRINCIPAL ───── */
{id:'pc11', n:'Investigação pelo Ministério Público', a:'CF, art. 129; Res. CNMP 181/2017',
 s:'O MP pode investigar por autoridade própria, por prazo razoável, respeitados os direitos do investigado e o controle judicial (Tema 184). Em 2024, o STF fixou parâmetros: comunicação imediata da instauração e do encerramento ao juízo, mesmos prazos do inquérito policial e prorrogação dependente de autorização judicial.',
 j:['STF, RE 593.727 (Tema 184, 2015).','STF, ADIs 2.943, 3.309 e 3.318 (2024).'],
 r:['pc2']},

{id:'pc12', tg:'Encerra a investigação; reabertura só com prova nova', n:'Arquivamento', a:'CPP, arts. 18 e 28',
 s:'O MP ordena o arquivamento, comunica a vítima, o investigado e a polícia, dá ciência ao juízo e remete os autos à instância de revisão do próprio MP (28, na redação da Lei 13.964/2019, em vigor após as ADIs do juiz das garantias). A vítima pode provocar a revisão em 30 dias. A ação só se inicia depois com prova nova.',
 j:['Súmula 524 STF.','STF, ADIs 6.298, 6.299, 6.300 e 6.305 (2023).'],
 r:[]},

{id:'pc13', end:true, tg:'Cumprido, extingue a punibilidade', n:'Acordo de não persecução penal', a:'CPP, art. 28-A',
 s:'Para crime sem violência ou grave ameaça, com pena mínima inferior a 4 anos, mediante confissão formal e circunstanciada e condições como reparação do dano e prestação de serviços. Homologação em audiência, com verificação da voluntariedade (§4º). Descumprido, é rescindido e segue-se a denúncia (§10); cumprido, extingue a punibilidade (§13). Recusada a proposta, a defesa pede remessa ao órgão superior do MP (§14).',
 j:['STF, HC 185.913 (2024) e STJ, Tema 1.098: cabe nos processos em curso em 2019, antes do trânsito; nos posteriores, a proposta ou a recusa vem antes do recebimento da denúncia.'],
 r:['pg5']},

{id:'pc14', end:true, tg:'Cabe recurso em sentido estrito', n:'Rejeição da denúncia', a:'CPP, arts. 395 e 581, I',
 s:'Inépcia, falta de pressuposto processual ou de condição da ação, ou ausência de justa causa. Da rejeição cabe recurso em sentido estrito; o denunciado deve ser intimado para contrarrazões, sob pena de nulidade.',
 j:['Súmula 707 STF.'],
 r:['pr6']},

{id:'pc15', end:true, tg:'Cumprida, extingue a punibilidade', n:'Suspensão condicional do processo', a:'Lei 9.099/1995, art. 89',
 s:'Para crimes com pena mínima igual ou inferior a 1 ano, se o acusado não estiver sendo processado nem tiver sido condenado por outro crime. Período de prova de 2 a 4 anos, com condições. Expirado o prazo sem revogação, extingue-se a punibilidade (§5º).',
 j:['Súmula 696 STF: recusada pelo promotor, o juiz aplica por analogia o art. 28 do CPP.','Súmula 723 STF e Súmula 243 STJ: no concurso de crimes, considera-se a soma ou o aumento.','Súmula 337 STJ: cabe na desclassificação e na procedência parcial.'],
 r:['pc4']},

{id:'pc16', tg:'Suspende o processo e a prescrição', n:'Citação por edital e art. 366', a:'CPP, arts. 361 e 366',
 s:'Citado por edital, se o acusado não comparecer nem constituir advogado, ficam suspensos o processo e o prazo prescricional, podendo o juiz determinar a produção antecipada de provas urgentes e decretar a preventiva, se presentes os requisitos (366). A suspensão da prescrição dura pelo prazo regulado pela pena máxima cominada.',
 j:['Súmula 415 STJ.','Súmula 455 STJ: a produção antecipada de provas exige fundamentação concreta, não bastando o decurso do tempo.'],
 r:['pc5']},

{id:'pc18', end:true, tg:'Cabe apelação', n:'Absolvição sumária', a:'CPP, arts. 397 e 593, I',
 s:'Quando o juiz verificar, de plano, excludente de ilicitude manifesta, excludente de culpabilidade (salvo inimputabilidade), que o fato narrado não constitui crime ou que está extinta a punibilidade.',
 r:['pr1']},

{id:'pc19', n:'Interrogatório', a:'CPP, arts. 185 a 196 e 400',
 s:'Meio de defesa, último ato da instrução. O acusado é informado do direito de permanecer calado, e o silêncio não pode ser interpretado em seu prejuízo (186). Tem direito a entrevista reservada com o defensor antes do ato (185, §5º).',
 t:['Autodefesa e direito à não autoincriminação (<i>nemo tenetur se detegere</i>).'],
 r:['pc8']},

{id:'pc20', n:'<i>Emendatio libelli</i>', a:'CPP, art. 383',
 s:'Sem modificar a descrição do fato, o juiz pode atribuir-lhe definição jurídica diversa, ainda que com pena mais grave. Se a nova definição permitir a suspensão condicional do processo, abre-se a proposta (§1º).',
 t:['O réu se defende dos fatos, e não da capitulação (<i>narra mihi factum, dabo tibi ius</i>).'],
 r:['pc9']},

{id:'pc21', n:'<i>Mutatio libelli</i>', a:'CPP, art. 384',
 s:'Se a prova revelar elemento ou circunstância não contidos na acusação, o MP deve aditar a denúncia em 5 dias, com nova oportunidade de defesa e de prova. Não se aplica em segunda instância.',
 j:['Súmula 453 STF.'],
 r:['pc9']},

{id:'pc22', n:'Dosimetria da pena', a:'CP, arts. 59, 68 e 33',
 s:'Critério trifásico: pena-base pelas circunstâncias judiciais (59); agravantes e atenuantes; causas de aumento e de diminuição (68). Depois, regime inicial, substituição por restritivas e suspensão condicional da pena.',
 j:['STJ, Tema 1.194 (2025): a confissão atenua ainda que não usada na formação do convencimento.','Súmula 231 STJ, mantida em 2024: a atenuante não reduz a pena abaixo do mínimo legal.','Súmulas 718 e 719 STF: regime mais gravoso exige motivação idônea, e não basta a gravidade abstrata.'],
 d:['Salo de Carvalho, <i>Penas e medidas de segurança no direito penal brasileiro</i>.'],
 r:['pc9']},

{id:'pr3', n:'Embargos infringentes', a:'CPP, art. 609, parágrafo único',
 s:'Recurso exclusivo da defesa, contra acórdão não unânime desfavorável ao réu em apelação, recurso em sentido estrito ou agravo em execução. Prazo de 10 dias, restrito à matéria objeto da divergência.',
 r:['pr2']},

{id:'pr5', n:'Revisão criminal', a:'CPP, arts. 621 a 631',
 s:'Ação autônoma de impugnação, só em favor do condenado, a qualquer tempo, mesmo depois de extinta a pena (622): sentença contrária ao texto da lei ou à evidência dos autos; fundada em prova falsa; ou novas provas de inocência ou de circunstância que diminua a pena (621). Admite indenização pelo erro judiciário (630).',
 t:['Não há revisão <i>pro societate</i>: a coisa julgada absolutória é intangível.'],
 r:['pe1']},

{id:'pe4', n:'Progressão de regime', a:'LEP, art. 112',
 s:'Depois do cumprimento de percentual da pena, de 16% (primário, sem violência) a 70% (reincidente em crime hediondo com resultado morte), e boa conduta carcerária. Desde a Lei 14.843/2024, exige exame criminológico (§1º).',
 j:['Súmula 534 STJ: a falta grave interrompe o prazo para a progressão.','Súmula Vinculante 26 trata o exame criminológico como facultativo; sua convivência com a exigência da Lei 14.843/2024 é debatida.'],
 r:['pe2']},

{id:'pe5', n:'Livramento condicional', a:'CP, art. 83; LEP, arts. 131 a 146',
 s:'Cumprido mais de um terço da pena (primário de bons antecedentes), mais da metade (reincidente doloso) ou mais de dois terços (hediondos, se não reincidente específico), com bom comportamento, sem falta grave nos últimos 12 meses e aptidão para o trabalho. Vedado nos crimes hediondos com resultado morte.',
 j:['Súmula 441 STJ: a falta grave não interrompe o prazo do livramento.'],
 r:['pe2']},

{id:'pe6', n:'Remição', a:'LEP, arts. 126 a 130',
 s:'Desconto de 1 dia de pena a cada 3 dias de trabalho, ou a cada 12 horas de estudo, divididas em pelo menos 3 dias. A leitura também remite, conforme regulamentação do CNJ. A falta grave pode revogar até um terço do tempo remido (127).',
 r:['pe2']},

{id:'pe7', n:'Faltas graves e regressão', a:'LEP, arts. 50 a 52 e 118',
 s:'A prática de falta grave ou de crime doloso pode levar à regressão a regime mais rigoroso (118). A falta grave exige procedimento disciplinar com defesa técnica.',
 j:['Súmula 533 STJ: o reconhecimento de falta grave exige procedimento administrativo com direito de defesa.'],
 r:['pe2']},

{id:'pe8', n:'Saídas e trabalho externo', a:'LEP, arts. 36, 37 e 120 a 125',
 s:'Permissão de saída, com escolta, para falecimento ou doença de familiar e tratamento médico (120). Desde a Lei 14.843/2024, a saída temporária ficou restrita à frequência a curso e vedada aos condenados por crime hediondo ou com violência ou grave ameaça (122). Trabalho externo no semiaberto e, com cautelas, no fechado.',
 r:['pe2']},

{id:'pe9', n:'Indulto e comutação', a:'CF, art. 84, XII; LEP, arts. 187 a 193',
 s:'Decretos presidenciais de indulto (extinção da pena) e comutação (redução), aplicados pelo juiz da execução conforme os requisitos de cada decreto. Os crimes hediondos e equiparados são insuscetíveis de graça e indulto (Lei 8.072/1990, art. 2º, I).',
 t:['Clemência soberana como ato político, sujeito a controle de constitucionalidade.'],
 r:['pe3']},

/* ───── TRILHO DO RITO SUMÁRIO ───── */
{id:'ps1', n:'Audiência do rito sumário', a:'CPP, arts. 531 a 538',
 s:'Recebimento, citação, resposta e absolvição sumária seguem o ordinário (394, §4º). A audiência deve ocorrer em até 30 dias, com até 5 testemunhas por parte (531 e 532), na mesma ordem de atos e com debates orais (534). Depois, a sentença segue o percurso comum.',
 r:['pc9']},

/* ───── TRILHO DO TRIBUNAL DO JÚRI ───── */
{id:'pj1', n:'Recebimento, citação e resposta', a:'CPP, arts. 406 a 408',
 s:'Primeira fase (<i>iudicium accusationis</i>). Recebida a denúncia, o acusado é citado para responder em 10 dias, com até 8 testemunhas (406). Não apresentada a resposta, nomeia-se defensor (408).',
 t:['Procedimento bifásico: juízo de admissibilidade da acusação pelo juiz togado e julgamento do mérito pelos jurados.'],
 d:['Rui Barbosa, <i>O júri sob todos os aspectos</i>.','Aury Lopes Jr. — crítica à ausência de motivação das decisões dos jurados.'],
 r:['pj2']},

{id:'pj2', n:'Instrução preliminar', a:'CPP, arts. 409 a 412',
 s:'O MP é ouvido sobre preliminares e documentos (409). Na audiência, ouvem-se o ofendido, as testemunhas e os peritos, com acareações e reconhecimento, e por último o interrogatório, seguido de debates orais (411). O procedimento deve terminar em 90 dias (412).',
 r:['pj3']},

{id:'pj3', n:'Decisão da primeira fase', a:'CPP, arts. 413 a 421',
 s:'Quatro desfechos: pronúncia, impronúncia, absolvição sumária ou desclassificação. A pronúncia exige prova da materialidade e indícios suficientes de autoria, com fundamentação contida, sem excesso de linguagem (413, §1º).',
 j:['STF, RHC 127.522: o excesso de linguagem na pronúncia gera nulidade.','STF, Tema 1.392, pendente: testemunho indireto como base da pronúncia.'],
 r:['pj8','pj9','pj10','pj4']},

{id:'pj4', n:'Pronúncia', a:'CPP, arts. 413, 421 e 581, IV',
 s:'Submete o acusado a julgamento pelo júri, fixando a imputação: o que não constar dela não pode ser quesitado (483, §3º, II). Cabe recurso em sentido estrito. A pronúncia interrompe a prescrição, ainda que o júri depois desclassifique o crime (Súmula 191 STJ).',
 r:['pj5']},

{id:'pj5', n:'Preparação do plenário', a:'CPP, arts. 422 a 428',
 s:'Preclusa a pronúncia, as partes têm 5 dias para arrolar até 5 testemunhas de plenário, juntar documentos e requerer diligências (422). O juiz prepara o relatório e inclui o processo em pauta (423). Havendo dúvida sobre a imparcialidade dos jurados ou risco à segurança, cabe desaforamento (427).',
 r:['pj6']},

{id:'pj6', n:'Sessão plenária', a:'CPP, arts. 447 a 482',
 s:'Instalada com ao menos 15 jurados, sorteiam-se 7 para o Conselho de Sentença; cada parte tem até 3 recusas imotivadas (468). Instrução em plenário, interrogatório e debates de 1h30 para cada parte, com réplica e tréplica de 1 hora (477). São vedadas referências à pronúncia, às algemas e ao silêncio do acusado (478), e documentos novos exigem juntada com 3 dias úteis de antecedência (479).',
 j:['STF, ADPF 779 (2023): a legítima defesa da honra é inconstitucional e não pode ser invocada, direta ou indiretamente, sob pena de nulidade.'],
 r:['pj7']},

{id:'pj7', n:'Quesitos e sentença do presidente', a:'CPP, arts. 483 a 493',
 s:'Ordem dos quesitos: materialidade, autoria, "o jurado absolve o acusado?", causas de diminuição e qualificadoras ou causas de aumento (483). O quesito genérico abrange todas as teses absolutórias. O presidente lavra a sentença conforme o veredicto (492). A condenação pelo júri é executável de imediato, qualquer que seja a pena (Tema 1.068).',
 j:['STF, Tema 1.068 (2024).','STF, Tema 1.087 (2024): cabe apelação contra a absolvição genérica manifestamente contrária à prova, mas não se determina novo júri se houve tese de clemência registrada em ata e acolhida.'],
 r:['pr1']},

{id:'pj8', tg:'Admite nova denúncia com prova nova', n:'Impronúncia', a:'CPP, arts. 414 e 416',
 s:'Não convencido da materialidade ou de indícios suficientes de autoria, o juiz impronuncia. Enquanto não extinta a punibilidade, pode haver nova denúncia se surgir prova nova. Cabe apelação (416).',
 t:['Crítica doutrinária: a impronúncia deixa o acusado em estado de incerteza permanente.'],
 r:[]},

{id:'pj9', end:true, tg:'Cabe apelação', n:'Absolvição sumária no júri', a:'CPP, arts. 415 e 416',
 s:'Provada a inexistência do fato, provado não ser o acusado autor ou partícipe, fato atípico, ou demonstrada causa de isenção de pena ou de exclusão do crime. A inimputabilidade só leva à absolvição sumária se for a única tese defensiva.',
 r:['pr1']},

{id:'pj10', tg:'Sai do júri', n:'Desclassificação', a:'CPP, art. 419',
 s:'Se o juiz se convencer de que o crime não é doloso contra a vida, remete os autos ao juízo competente.',
 r:['pc7']},

/* ───── TRILHO DO JECRIM ───── */
{id:'pk1', n:'Termo circunstanciado', a:'Lei 9.099/1995, arts. 61 e 69',
 s:'Nas infrações de menor potencial ofensivo (contravenções e crimes com pena máxima até 2 anos), a autoridade lavra termo circunstanciado em vez de inquérito. Se o autor se comprometer a comparecer ao juizado, não se impõe prisão em flagrante nem fiança (69, parágrafo único).',
 t:['Princípios da oralidade, informalidade, economia processual e celeridade (62), com foco na reparação e na pena não privativa de liberdade.'],
 d:['Ada Pellegrini Grinover, Antonio Magalhães Gomes Filho, Antonio Scarance Fernandes e Luiz Flávio Gomes, <i>Juizados Especiais Criminais</i>.'],
 r:['pk2']},

{id:'pk2', n:'Audiência preliminar', a:'Lei 9.099/1995, arts. 70 a 76',
 s:'Presentes o autor do fato, a vítima e o MP, o juiz esclarece a possibilidade de composição dos danos civis e de transação penal (72). Não obtida a composição, a vítima pode representar oralmente (75).',
 r:['pk8','pk9','pk3']},

{id:'pk3', n:'Denúncia oral', a:'Lei 9.099/1995, arts. 77 e 78',
 s:'Não havendo transação, o MP oferece denúncia oral, dispensado o inquérito (77). O autor do fato recebe cópia e é citado para a audiência de instrução (78).',
 r:['pk10','pk4']},

{id:'pk4', n:'Audiência de instrução e julgamento', a:'Lei 9.099/1995, arts. 79 a 81',
 s:'Nova tentativa de conciliação (79). A defesa responde oralmente à acusação, e só então o juiz recebe ou rejeita a denúncia. Recebida, ouvem-se vítima e testemunhas, interroga-se o acusado e seguem-se os debates e a sentença, tudo no mesmo ato (81).',
 t:['A defesa antes do recebimento é a marca do rito sumaríssimo.'],
 r:['pk5']},

{id:'pk5', n:'Sentença no JECrim', a:'Lei 9.099/1995, art. 81, §3º',
 s:'Dispensa relatório e menciona os elementos de convicção. A suspensão condicional do processo também se aplica no juizado.',
 r:['pk6']},

{id:'pk6', n:'Apelação à Turma Recursal', a:'Lei 9.099/1995, arts. 82 e 83',
 s:'Contra a sentença e a rejeição da denúncia, em 10 dias, já com as razões (82, §1º), julgada por turma de 3 juízes de primeiro grau. Embargos de declaração em 5 dias (83).',
 r:['pk7']},

{id:'pk7', n:'Depois da Turma Recursal', a:'Súmulas 203 STJ e 640 STF',
 s:'Contra acórdão da Turma Recursal cabe recurso extraordinário (Súmula 640 STF), mas não recurso especial (Súmula 203 STJ). O <i>habeas corpus</i> contra ato da Turma Recursal é julgado pelo tribunal de justiça.',
 j:['STF, HC 86.834 (2006): superou a Súmula 690 e fixou a competência do TJ para o HC contra Turma Recursal.'],
 r:['pe1']},

{id:'pk8', end:true, tg:'Pode extinguir a punibilidade', n:'Composição civil dos danos', a:'Lei 9.099/1995, art. 74',
 s:'Homologada, a composição é título executivo. Na ação penal privada ou pública condicionada, o acordo homologado acarreta renúncia ao direito de queixa ou de representação, extinguindo a punibilidade.',
 r:[]},

{id:'pk9', end:true, tg:'Descumprida, retoma-se', n:'Transação penal', a:'Lei 9.099/1995, art. 76',
 s:'O MP propõe a aplicação imediata de pena restritiva de direitos ou multa. Aceita e homologada, não gera reincidência nem antecedentes, mas impede novo benefício por 5 anos (§§4º e 6º). Descumpridas as condições, retoma-se a situação anterior, e o MP pode denunciar.',
 j:['Súmula Vinculante 35: a homologação não faz coisa julgada material.'],
 r:[]},

{id:'pk10', tg:'Sai do JECrim', n:'Remessa ao juízo comum', a:'Lei 9.099/1995, arts. 66, parágrafo único, e 77, §2º',
 s:'Se a complexidade do caso não permitir a denúncia oral, ou se o acusado não for encontrado para citação pessoal, os autos são remetidos ao juízo comum, que segue o rito adequado.',
 r:['pc2']},

/* ───── FAIXAS TRANSVERSAIS ───── */
{id:'pg1', n:'Garantias do processo penal', a:'CF, art. 5º, LIII a LXVIII; CPP, art. 3º-A',
 s:'Juiz natural, devido processo, contraditório e ampla defesa, presunção de inocência, inadmissibilidade das provas ilícitas e direito ao silêncio. O processo penal tem estrutura acusatória, vedadas a iniciativa do juiz na fase de investigação e a substituição da atuação probatória da acusação (3º-A).',
 t:['O processo penal como limite ao poder punitivo e instrumento de garantia do acusado.'],
 d:['Luigi Ferrajoli, <i>Direito e razão: teoria do garantismo penal</i>.','Geraldo Prado, <i>Sistema acusatório</i>.'],
 j:['STF, ADIs 6.298 e conexas (2023): o art. 3º-A recebeu interpretação conforme, admitindo diligências suplementares pontuais do juiz para dirimir dúvida relevante, nos limites legais.'],
 r:['pg2']},

{id:'pg2', n:'Juiz das garantias', a:'CPP, arts. 3º-B a 3º-F',
 s:'Controla a legalidade da investigação: prisões e cautelares, medidas invasivas, prorrogação e trancamento do inquérito. Sua competência cessa com o oferecimento da denúncia, e os autos seguem ao juiz da instrução. Não se aplica ao júri, à violência doméstica, às infrações de menor potencial ofensivo nem à competência originária.',
 j:['STF, ADIs 6.298, 6.299, 6.300 e 6.305 (2023): instituto constitucional e de implantação obrigatória, com ajustes.'],
 r:['pc1']},

{id:'pp0', n:'Prisões e medidas cautelares', a:'CPP, arts. 282 a 350',
 s:'Toda cautelar exige necessidade e adequação (282), e a prisão preventiva é a última opção, quando as medidas diversas forem insuficientes (282, §6º). Nenhuma cautelar pode ser decretada de ofício. Antes do trânsito em julgado, toda prisão é cautelar.',
 t:['Cautelaridade e proporcionalidade: a prisão processual não pode antecipar a pena.'],
 d:['Aury Lopes Jr., <i>Prisões cautelares</i>.'],
 r:['pp4','pg4']},

{id:'pp1', n:'Prisão em flagrante', a:'CPP, arts. 301 a 310',
 s:'Flagrante próprio, impróprio e presumido (302). Lavrado o auto, a prisão é comunicada em 24 horas ao juiz, ao MP e à família, e o auto é encaminhado ao juiz, com cópia à Defensoria se não houver advogado (306).',
 r:['pp2']},

{id:'pp2', n:'Audiência de custódia', a:'CPP, art. 310; Res. CNJ 213/2015',
 s:'Em até 24 horas, o preso é apresentado ao juiz, que deve relaxar a prisão ilegal, convertê-la em preventiva, se presentes os requisitos e inadequadas as cautelares diversas, ou conceder liberdade provisória. O juiz pergunta sobre tortura e maus-tratos e não interroga sobre o mérito.',
 x:'Segundo a sua skill de prisões, as Leis 15.272/2025 e 15.358/2026 alteraram o art. 310, com circunstâncias que recomendam a conversão e dever de fundamentação reforçada; parte das mudanças está em ADIs pendentes.',
 r:['pp4','pp5']},

{id:'pp3', n:'Prisão temporária', a:'Lei 7.960/1989',
 s:'Só na fase de investigação, quando imprescindível e houver fundadas razões de autoria em crimes do rol legal. Prazo de 5 dias, prorrogáveis por mais 5; nos hediondos, 30 mais 30 (Lei 8.072/1990, art. 2º, §4º).',
 j:['STF, ADIs 3.360 e 4.109 (2022): requisitos cumulativos e interpretação restritiva.'],
 r:['pc1']},

{id:'pp4', n:'Prisão preventiva', a:'CPP, arts. 311 a 316',
 s:'Exige prova da existência do crime, indício suficiente de autoria e perigo gerado pelo estado de liberdade, para garantir a ordem pública ou econômica, a instrução ou a aplicação da lei penal (312), com fato concreto e contemporâneo. Cabe nas hipóteses do art. 313, nunca como antecipação de pena (313, §2º), e exige fundamentação analítica (315).',
 j:['Súmula 52 STJ: encerrada a instrução, fica superada a alegação de excesso de prazo.'],
 r:['pp6']},

{id:'pp5', n:'Cautelares diversas, fiança e domiciliar', a:'CPP, arts. 317 a 320 e 322 a 350',
 s:'Comparecimento periódico, proibição de acesso, de contato ou de ausentar-se, recolhimento noturno, suspensão da função, monitoração eletrônica e fiança (319). Prisão domiciliar substitutiva para gestantes, mães de criança de até 12 anos e outros casos legais (318 e 318-A).',
 j:['STF, HC 143.641 (2018): <i>habeas corpus</i> coletivo para gestantes e mães presas preventivamente.'],
 r:['pp4']},

{id:'pp6', n:'Revisão a cada 90 dias', a:'CPP, art. 316, parágrafo único',
 s:'O órgão que decretou a preventiva deve revisar sua necessidade a cada 90 dias, de ofício e fundamentadamente. O STF decidiu que o vencimento do prazo não gera revogação automática: o juízo deve ser instado a reavaliar.',
 j:['STF, SL 1.395 (2020) e ADIs 6.581 e 6.582 (2022).'],
 r:['pg4']},

{id:'pv0', n:'Provas', a:'CPP, arts. 155 a 250',
 s:'O juiz forma sua convicção pela livre apreciação da prova produzida em contraditório judicial, sem fundamentar a decisão exclusivamente nos elementos do inquérito, ressalvadas as provas cautelares, irrepetíveis e antecipadas (155).',
 t:['<i>Standards</i> de prova e valoração racional; a prova como reconstrução aproximativa dos fatos.'],
 d:['Gustavo Badaró, <i>Epistemologia judiciária e prova penal</i>.','Janaina Matida — estudos sobre reconhecimento de pessoas e prova dependente da memória.'],
 r:['pv1']},

{id:'pv1', n:'Prova ilícita', a:'CF, art. 5º, LVI; CPP, art. 157',
 s:'São inadmissíveis as provas obtidas com violação a normas constitucionais ou legais, e também as delas derivadas, salvo fonte independente ou descoberta inevitável (157, §§1º e 2º). A prova ilícita é desentranhada e inutilizada (§3º).',
 t:['Teoria dos frutos da árvore envenenada (<i>fruits of the poisonous tree</i>) e suas exceções.'],
 r:['pg3']},

{id:'pv2', n:'Cadeia de custódia', a:'CPP, arts. 158-A a 158-F',
 s:'Registro documentado de todas as etapas do vestígio, do reconhecimento ao descarte, com lacres numerados e central de custódia. Prova digital sem documentação de integridade é inadmissível.',
 j:['STJ, HC 653.515 (2021): a quebra da cadeia de custódia é, em regra, questão de valoração da prova.','STJ, AgRg no HC 828.054 (2024): dados de celular sem metodologia que garanta a integridade são inadmissíveis.'],
 r:['pv0']},

{id:'pv3', n:'Busca domiciliar e pessoal', a:'CF, art. 5º, XI; CPP, arts. 240 a 250',
 s:'A entrada forçada em domicílio sem mandado só é lícita com fundadas razões, justificadas depois, de que há flagrante no interior. A busca pessoal sem mandado exige fundada suspeita, referida a elementos concretos.',
 j:['STF, Tema 280 (RE 603.616).','STJ, HC 598.051 (2021): o consentimento do morador deve ser provado, preferencialmente por registro.','STJ, RHC 158.580 (2022): impressões subjetivas, como nervosismo, não configuram fundada suspeita.'],
 r:['pv1']},

{id:'pv4', n:'Interceptação e dados', a:'CF, art. 5º, XII; Lei 9.296/1996',
 s:'A interceptação telefônica exige ordem judicial, indícios razoáveis de autoria em crime punido com reclusão e impossibilidade de obter a prova por outros meios, por 15 dias renováveis com fundamentação. O acesso aos dados do celular apreendido depende, em regra, de autorização judicial.',
 r:['pv1']},

{id:'pv5', n:'Reconhecimento de pessoas', a:'CPP, art. 226',
 s:'O procedimento do art. 226 é de observância obrigatória, no inquérito e em juízo, e sua violação invalida a prova. O suspeito deve ser perfilado com pessoas semelhantes, e o reconhecimento viciado não se convalida com a repetição em juízo.',
 j:['STJ, Tema 1.258 (2025).'],
 r:['pv0']},

{id:'pg3', n:'Nulidades', a:'CPP, arts. 563 a 573',
 s:'Nenhum ato é declarado nulo sem prejuízo para a acusação ou para a defesa (563). As nulidades relativas devem ser arguidas nos momentos do art. 571, sob pena de preclusão. A incompetência anula apenas os atos decisórios (567).',
 t:['<i>Pas de nullité sans grief</i>; a crítica doutrinária à exigência de prejuízo nas nulidades absolutas.'],
 d:['Ricardo Jacobsen Gloeckner, <i>Nulidades no processo penal</i>.'],
 j:['Súmula 523 STF.','Súmula 708 STF: é nulo o julgamento da apelação se, após a renúncia do defensor, o réu não foi intimado para constituir outro.'],
 r:['pv1']},

{id:'pg4', n:'<i>Habeas corpus</i>', a:'CF, art. 5º, LXVIII; CPP, arts. 647 a 667',
 s:'Cabe sempre que alguém sofrer ou se achar ameaçado de sofrer coação ilegal na liberdade de locomoção, em qualquer fase, inclusive para trancar inquérito ou ação penal sem justa causa (648). Pode ser concedido de ofício (647-A, com a Lei 14.836/2024).',
 j:['Súmula 691 STF: não cabe HC contra indeferimento de liminar em HC impetrado em tribunal superior, salvo flagrante ilegalidade.','STJ, HC 535.063 (2020): o HC substitutivo de recurso não é conhecido, salvo flagrante ilegalidade.'],
 r:['pp0']},

{id:'pg5', n:'Prescrição ao longo do processo', a:'CP, arts. 109 a 119',
 s:'Corre durante todo o percurso, interrompida pelos marcos do art. 117 (recebimento da denúncia, pronúncia, acórdão confirmatório da pronúncia, sentença ou acórdão condenatórios recorríveis, início do cumprimento, reincidência) e suspensa nas hipóteses do art. 116, inclusive o ANPP não cumprido nem rescindido, e na do art. 366 do CPP. No concurso de crimes, conta-se para cada crime isoladamente (119).',
 r:['pn16','pg6']},

{id:'pg6', n:'Prescrição executória', a:'CP, arts. 110, 112 e 117, V e VI',
 s:'Regula-se pela pena aplicada, aumentada de um terço se o condenado for reincidente. É interrompida pelo início ou continuação do cumprimento e pela reincidência.',
 j:['STF, Tema 788 (2023): o termo inicial é o trânsito em julgado para ambas as partes, com modulação temporal.'],
 r:['pe3']},

{id:'pr6', n:'Recurso em sentido estrito', a:'CPP, arts. 581 a 592',
 s:'Contra as decisões do rol do art. 581, como a rejeição da denúncia, a pronúncia, as decisões sobre prisão e fiança e a recusa de homologação do ANPP (XXV). Interposição em 5 dias e razões em 2 (586 e 588), com juízo de retratação (589).',
 r:['pr1']},

{id:'pr7', n:'Embargos de declaração', a:'CPP, arts. 382 e 619',
 s:'Contra sentença ou acórdão com ambiguidade, obscuridade, contradição ou omissão, em 2 dias. No JECrim, em 5 dias (Lei 9.099/1995, art. 83).',
 r:['pr2']},

{id:'pg7', n:'Assistente de acusação', a:'CPP, arts. 268 a 273 e 598',
 s:'O ofendido, ou seu representante e sucessores, pode intervir como assistente do MP depois do recebimento da denúncia e enquanto não transitar em julgado a sentença (268 e 269), propondo provas, participando dos debates e recorrendo supletivamente, se o MP não recorrer (598).',
 j:['Súmula 448 STF: o prazo do assistente para recorrer começa a correr do fim do prazo do MP.'],
 r:['pr1']},

/* ───── OUTRAS VIAS ───── */
{id:'pf1', n:'Lei de Drogas', a:'Lei 11.343/2006, arts. 48 a 59',
 s:'Defesa prévia em 10 dias, antes do recebimento da denúncia, com até 5 testemunhas (55). Prazos de inquérito ampliados: 30 dias com o investigado preso e 90 solto, duplicáveis (51). O usuário (art. 28) segue o rito do JECrim.',
 j:['STF, Tema 506 (RE 635.659, 2024): descriminalizou o porte de maconha para uso pessoal, com presunção relativa de até 40 gramas ou 6 plantas.'],
 r:['pc2']},

{id:'pf2', n:'Crimes de funcionário público', a:'CPP, arts. 513 a 518',
 s:'Nos crimes afiançáveis praticados por funcionário público contra a administração, o acusado é notificado para resposta preliminar em 15 dias, antes do recebimento da denúncia (514).',
 j:['Súmula 330 STJ: a resposta preliminar é desnecessária quando a denúncia é instruída por inquérito policial.'],
 r:['pc2']},

{id:'pf3', n:'Crimes contra a honra', a:'CPP, arts. 519 a 523',
 s:'Na ação privada por calúnia ou injúria, há audiência de reconciliação antes do recebimento da queixa (520). Cabe exceção da verdade nos casos legais (523).',
 r:['pf6']},

{id:'pf4', n:'Competência originária dos tribunais', a:'Lei 8.038/1990, arts. 1º a 12',
 s:'Para acusados com foro por prerrogativa: o acusado é notificado para resposta em 15 dias antes da deliberação sobre o recebimento (4º); o tribunal decide sobre o recebimento (6º); instrução delegável a juiz instrutor.',
 r:['pn8']},

{id:'pf5', n:'Violência doméstica: procedimento', a:'Lei 11.340/2006, arts. 14, 18 a 24-A e 41',
 s:'Juizados de violência doméstica com competência cível e criminal (14). Medidas protetivas de urgência, que independem de tipificação penal, de inquérito ou de ação (19, §5º); seu descumprimento é crime (24-A).',
 r:['pn14']},

{id:'pf6', n:'Queixa-crime', a:'CPP, arts. 30, 41 e 44',
 s:'Peça inicial da ação privada, com os requisitos da denúncia e procuração com poderes especiais, nome do querelado e menção do fato (44). O prazo é decadencial e não se interrompe pelo pedido de instauração de inquérito.',
 r:['pn3']},

{id:'pi1', n:'Restituição de coisas apreendidas', a:'CPP, arts. 118 a 124',
 s:'As coisas apreendidas não podem ser restituídas enquanto interessarem ao processo (118). Não havendo dúvida sobre o direito do reclamante, a restituição pode ser ordenada pela autoridade policial ou pelo juiz.',
 r:[]},

{id:'pi2', n:'Medidas assecuratórias', a:'CPP, arts. 125 a 144-A',
 s:'Sequestro dos bens adquiridos com os proventos do crime, hipoteca legal e arresto de bens lícitos para garantir a reparação e as despesas, e alienação antecipada de bens sujeitos a deterioração (144-A).',
 r:[]},

{id:'pi3', n:'Incidente de insanidade mental', a:'CPP, arts. 149 a 154',
 s:'Havendo dúvida sobre a integridade mental do acusado, o juiz ordena o exame, suspendendo o processo. Constatada a inimputabilidade, o processo prossegue com curador, podendo resultar em absolvição imprópria com medida de segurança.',
 r:[]},

{id:'pi4', n:'Questões prejudiciais e exceções', a:'CPP, arts. 92 a 111',
 s:'Questões prejudiciais sobre o estado civil das pessoas suspendem o processo penal (92); outras, facultativamente (93). As exceções de suspeição, incompetência, litispendência, ilegitimidade de parte e coisa julgada processam-se em apartado (95 a 111).',
 r:['pn15']},

{id:'pi5', n:'Colaboração premiada', a:'Lei 12.850/2013, arts. 3º-A a 7º',
 s:'Negócio jurídico processual e meio de obtenção de prova. A homologação verifica regularidade, legalidade e voluntariedade (4º, §7º). Nenhuma sentença condenatória pode fundar-se apenas nas declarações do colaborador (4º, §16).',
 j:['STF, HC 127.483 (2015): natureza de negócio jurídico processual.'],
 r:['pc8']},

{id:'pi6', n:'Reabilitação', a:'CP, arts. 93 a 95; CPP, arts. 743 a 750',
 s:'Decorridos 2 anos da extinção da pena, o condenado pode requerer a reabilitação, que assegura o sigilo dos registros e pode afastar efeitos da condenação. Não apaga a reincidência.',
 r:[]}
];
