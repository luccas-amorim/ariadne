const EST = [
/* ───── REDE DE ENTRADA: TÍTULO E CÁLCULO ───── */
{id:'en0', n:'Início do cumprimento', a:'LEP, arts. 1º, 105 e 107',
 s:'Com título executivo, guia expedida, juízo definido e pena calculada, a execução segue pelo trilho da sanção imposta: pena privativa de liberdade, restritiva de direitos, suspensão condicional da pena, multa ou medida de segurança. A execução tem por objetivo efetivar a sentença e proporcionar condições para a harmônica integração social do condenado (1º).',
 t:['Natureza jurisdicional da execução: o condenado é sujeito de direitos, e os atos administrativos ficam sob controle judicial.','Individualização da pena em três momentos: cominação, aplicação e execução (CF, art. 5º, XLVI).'],
 d:['Rodrigo Duque Estrada Roig, <i>Execução penal: teoria crítica</i>.','Salo de Carvalho (org.), <i>Crítica à execução penal</i>.','Michel Foucault, <i>Vigiar e punir</i>.'],
 r:['ea1','er1','es1','em1','ed1']},

{id:'en1', n:'Título executivo', a:'LEP, art. 105; CPP, art. 674',
 s:'A execução definitiva pressupõe sentença penal condenatória transitada em julgado (ou absolutória imprópria, que impõe medida de segurança). Antes do trânsito, só há execução provisória em favor do preso cautelar.',
 j:['STF, ADCs 43, 44 e 54 (2019): não há execução da pena antes do trânsito em julgado.'],
 r:['en3']},

{id:'en2', n:'Execução provisória', a:'Súmulas 716 e 717 STF',
 s:'O preso cautelar já condenado pode obter progressão e demais benefícios antes do trânsito em julgado (Súmula 716), inclusive em prisão especial (Súmula 717), mediante guia de execução provisória. A condenação pelo júri é executável de imediato, qualquer que seja a pena (Tema 1.068).',
 j:['Súmula 716 STF.','STF, Tema 1.068 (2024).'],
 r:['en3']},

{id:'en3', n:'Guia de recolhimento ou de execução', a:'LEP, arts. 105 a 107, 147, 164 e 171',
 s:'Ninguém é recolhido para cumprir pena privativa de liberdade sem guia expedida pela autoridade judiciária (107). Cada sanção tem sua guia: de recolhimento (privativa), de execução (restritiva), certidão para a multa e guia de internação ou tratamento (medida de segurança). A execução tramita, em regra, no sistema eletrônico unificado (SEEU).',
 r:['en4','ea1']},

{id:'en4', n:'Juízo da execução', a:'LEP, art. 65',
 s:'A execução compete ao juiz indicado na lei local de organização judiciária ou, na sua ausência, ao da sentença (65). O preso condenado pela Justiça Federal recolhido em estabelecimento estadual tem a execução no juízo estadual.',
 j:['Súmula 192 STJ.'],
 r:['en5']},

{id:'en5', n:'Competências do juiz da execução', a:'LEP, art. 66',
 s:'Aplicar a lei posterior mais benéfica; declarar extinta a punibilidade; decidir sobre soma e unificação de penas, progressão e regressão, detração e remição, suspensão condicional da pena, livramento condicional e incidentes; autorizar saídas temporárias; inspecionar estabelecimentos penais e interditá-los quando funcionarem em condições inadequadas (66, VII e VIII).',
 j:['Súmula 611 STF: transitada em julgado a sentença, compete ao juízo das execuções aplicar a lei mais benigna.'],
 r:['ec6']},

{id:'en6', n:'Presídios federais', a:'Lei 11.671/2008',
 s:'Inclusão em estabelecimento federal de segurança máxima no interesse da segurança pública ou do próprio preso, por decisão do juízo federal corregedor, em regra por prazo determinado e renovável.',
 x:'A Lei 15.407/2026 passou a prever a inclusão de presos, provisórios ou condenados, por homicídio qualificado contra agentes de segurança pública e militares (CP, art. 121, §2º, VII), e determinou que as audiências com presos em presídios federais ocorram, sempre que possível, por videoconferência.',
 r:['ef2']},

{id:'en7', n:'Unificação e limite de cumprimento', a:'LEP, art. 111; CP, art. 75',
 s:'Havendo várias condenações, as penas são somadas ou unificadas para fixar o regime (111). O tempo de cumprimento não pode ultrapassar 40 anos (CP, art. 75, na redação da Lei 13.964/2019; antes, 30 anos para fatos anteriores). O limite não se aplica ao cálculo de benefícios, que tomam por base a pena total.',
 j:['Súmula 715 STF.'],
 r:['ei4']},

{id:'en8', n:'Detração', a:'CP, art. 42; CPP, art. 387, §2º',
 s:'Computa-se na pena o tempo de prisão provisória, no Brasil ou no estrangeiro, e o de internação. O tempo de prisão cautelar é considerado já na sentença, para fixar o regime inicial (387, §2º).',
 r:['ea2']},

{id:'en9', n:'Datas-base e atestado de pena', a:'LEP, arts. 41, XVI, e 112',
 s:'O cálculo de pena fixa as datas-base para cada benefício. O condenado tem direito a atestado anual de pena a cumprir (41, XVI). A falta grave reinicia a contagem para a progressão, mas não para o livramento, o indulto e a comutação.',
 j:['STJ: a superveniência de nova condenação não altera, por si, a data-base para benefícios.','Súmula 534 STJ: a falta grave interrompe o prazo da progressão.'],
 r:['en13']},

{id:'en10', n:'Classificação e Comissão Técnica', a:'LEP, arts. 5º a 7º',
 s:'Os condenados são classificados segundo antecedentes e personalidade, para orientar a individualização da execução (5º). A Comissão Técnica de Classificação elabora o programa individualizador (6º e 7º).',
 t:['Individualização executória e a crítica aos juízos de prognose sobre a personalidade.'],
 r:['en11']},

{id:'en11', n:'Exame criminológico', a:'LEP, arts. 8º e 112, §1º',
 s:'Desde a Lei 14.843/2024, a progressão exige os resultados do exame criminológico (112, §1º). A exigência é contestada: para fatos anteriores, sustenta-se a irretroatividade, e a falta de estrutura para realizar os exames tem atrasado progressões.',
 j:['Súmula Vinculante 26 tratava o exame como facultativo, a critério fundamentado do juiz.','STF, Tema 1.408 (RE 1.536.743): repercussão geral sobre a aplicação da Lei 14.843/2024, pendente; a lei é questionada nas ADIs 7.663, 7.665, 7.672 e 7.678.'],
 r:['ew1']},

{id:'en12', n:'Identificação do perfil genético', a:'LEP, art. 9º-A',
 s:'Condenados por crimes dolosos com violência grave contra a pessoa, hediondos e outros do rol legal são submetidos à identificação do perfil genético, por técnica adequada e indolor, ao ingressarem no estabelecimento.',
 x:'Segundo a sua skill de investigação, a Lei 15.295/2025 alterou o art. 9º-A. Confira a redação vigente antes de orientar sobre recusa.',
 r:['ea1']},

{id:'en13', n:'Retificação do cálculo e da guia', a:'LEP, arts. 66 e 197',
 s:'Erros na guia, no cálculo de pena, na detração ou nas datas-base corrigem-se por requerimento ao juiz da execução; da decisão cabe agravo em execução. Conferir o cálculo é a primeira tarefa da defesa na execução.',
 r:['en0']},

{id:'en14', end:true, n:'Extinção antes do cumprimento', a:'CP, arts. 107 e 110; LEP, art. 66, II',
 s:'Prescrição da pretensão executória, indulto, anistia, <i>abolitio criminis</i> ou morte podem extinguir a punibilidade antes mesmo de iniciado o cumprimento.',
 r:[]},

/* ───── TRILHO PRINCIPAL: PENA PRIVATIVA DE LIBERDADE ───── */
{id:'ea1', n:'Ingresso no estabelecimento', a:'LEP, arts. 41, 84 e 107',
 s:'Com a guia, o condenado ingressa no estabelecimento adequado ao regime, separado dos presos provisórios (84). A partir daí exerce os direitos do art. 41 e se submete aos deveres do art. 39.',
 r:['ea2']},

{id:'ea2', n:'Regime inicial', a:'CP, art. 33; CPP, art. 387, §2º',
 s:'Fixado na sentença conforme a pena, a reincidência e as circunstâncias judiciais: fechado (acima de 8 anos), semiaberto (acima de 4 e até 8, se não reincidente) ou aberto (até 4, se não reincidente). O cumprimento pode começar em qualquer dos três; o trilho mostra o percurso completo.',
 j:['Súmulas 718 e 719 STF: o regime mais severo exige motivação idônea, e não basta a opinião sobre a gravidade abstrata do crime.','Súmula 440 STJ: fixada a pena-base no mínimo, é vedado regime mais gravoso com base só na gravidade abstrata.','Súmula 269 STJ: admite semiaberto ao reincidente com pena até 4 anos e circunstâncias favoráveis.'],
 r:['ef1','ew2','eh2']},

{id:'ef1', n:'Regime fechado', a:'CP, art. 34; LEP, arts. 87 a 90',
 s:'Cumprido em penitenciária de segurança máxima ou média. Trabalho interno no período diurno e isolamento no repouso noturno; trabalho externo só em serviços ou obras públicas (CP, art. 34, §3º).',
 r:['ef2','ew1']},

{id:'ef2', n:'Regime disciplinar diferenciado', a:'LEP, art. 52',
 s:'Sanção disciplinar ou medida cautelar para presos que pratiquem crime doloso que ocasione subversão da ordem interna, ou sobre quem recaiam fundadas suspeitas de envolvimento com organização criminosa: cela individual, visitas restritas, banho de sol de 2 horas, até 2 anos, prorrogáveis. Depende de decisão judicial fundamentada, após manifestação do MP e da defesa.',
 x:'A Lei 15.407/2026 permitiu pedir a inclusão no RDD desde o recolhimento do preso e fixou prazo de 15 dias para a decisão final, com decisão liminar. Foram vetadas a submissão automática e a vedação de progressão e livramento aos presos em RDD.',
 t:['Crítica: a forma mais severa de isolamento do sistema, em tensão com a vedação de penas cruéis (CF, art. 5º, XLVII, e).'],
 r:['ef1']},

{id:'ew1', n:'Progressão ao semiaberto', a:'LEP, art. 112',
 s:'Requisito objetivo: cumprimento da fração da pena prevista em lei, conforme a data do fato. Requisito subjetivo: boa conduta carcerária, comprovada pelo diretor do estabelecimento, e, desde 2024, o exame criminológico (§1º). A decisão é motivada e precedida de manifestação do MP e da defesa (§2º).',
 t:['Sistema progressivo: a pena se executa em regimes sucessivamente menos rigorosos, conforme o mérito.'],
 j:['Súmula 491 STJ: é inadmissível a progressão por salto.','Súmula 534 STJ: a falta grave interrompe o prazo da progressão.'],
 r:['ew3','ew4','ew2']},

{id:'ew2', n:'Regime semiaberto', a:'CP, art. 35; LEP, arts. 91 e 92',
 s:'Cumprido em colônia agrícola, industrial ou similar, com trabalho em comum durante o dia. Admite trabalho externo e frequência a cursos.',
 j:['STF, RE 641.320 (Tema 423) e Súmula Vinculante 56: a falta de vaga no regime adequado não autoriza a manutenção em regime mais gravoso.'],
 r:['ew5','ew6','eh1']},

{id:'eh1', n:'Progressão ao aberto', a:'LEP, arts. 112 a 115',
 s:'Além da fração e do mérito, exige que o condenado esteja trabalhando ou comprove a possibilidade de fazê-lo imediatamente, e que aceite o programa e as condições impostas pelo juiz (113 e 114).',
 r:['eh2']},

{id:'eh2', n:'Regime aberto', a:'CP, art. 36; LEP, arts. 93 a 95 e 115 a 117',
 s:'Baseado na autodisciplina e no senso de responsabilidade: trabalho fora do estabelecimento durante o dia e recolhimento noturno e nos dias de folga na casa do albergado (CP, art. 36).',
 t:['A ausência generalizada de casas do albergado empurrou o regime aberto para a prisão domiciliar.'],
 j:['Súmula 493 STJ: é inadmissível fixar pena substitutiva como condição especial do regime aberto.'],
 r:['eh3','el1']},

{id:'el1', tg:'Cabe em qualquer regime', n:'Livramento condicional', a:'CP, art. 83; LEP, art. 131',
 s:'Antecipação condicional da liberdade, cabível a partir de qualquer regime, para penas iguais ou superiores a 2 anos: cumprimento de mais de um terço (primário com bons antecedentes), mais da metade (reincidente em crime doloso) ou mais de dois terços (hediondos, se não reincidente específico); bom comportamento, ausência de falta grave nos últimos 12 meses e aptidão para o trabalho; reparação do dano, salvo impossibilidade.',
 x:'É vedado nos crimes hediondos com resultado morte (LEP, art. 112, VI, a, e VIII). Segundo a doutrina que acompanhou a Lei 15.358/2026, a vedação passou a alcançar o feminicídio. Confira a redação vigente e a data do fato.',
 j:['Súmula 441 STJ: a falta grave não interrompe o prazo do livramento.'],
 r:['el3','el4','el2']},

{id:'el2', n:'Período de prova', a:'CP, arts. 89 e 90; LEP, art. 146',
 s:'O liberado cumpre o restante da pena em liberdade, sob condições. Se, até o seu término, o livramento não for revogado, considera-se extinta a pena (CP, art. 90). O juiz não declara a extinção enquanto não transitar em julgado a sentença em processo por crime cometido na vigência do livramento (89).',
 j:['Súmula 617 STJ: a ausência de suspensão ou revogação do livramento antes do término do período de prova enseja a extinção da punibilidade pelo integral cumprimento da pena.'],
 r:['ex1']},

{id:'ex1', end:true, tg:'Fim de todos os trilhos', n:'Extinção da pena', a:'LEP, arts. 109 e 66, II; CP, arts. 82 e 90',
 s:'Cumprida ou extinta a pena, o juiz declara a extinção, de ofício ou a requerimento (109). Todos os trilhos convergem aqui. A partir da extinção, corre o prazo de 2 anos para a reabilitação (CP, art. 94).',
 r:['eo5']},

/* ───── RAMAIS DO TRILHO PRINCIPAL ───── */
{id:'ew3', n:'Frações de progressão', a:'LEP, art. 112, I a VIII',
 s:'A fração aplicável é a vigente na data do fato, pois a lei mais gravosa não retroage. Para fatos de 23/01/2020 a 24/03/2026 (Lei 13.964/2019): 16% (primário, sem violência), 20% (reincidente, sem violência), 25% e 30% (com violência ou grave ameaça), de 40% a 70% nos hediondos, e 55% no feminicídio desde 10/10/2024 (Lei 14.994/2024).',
 x:'Segundo fontes de 2026 consultadas, a Lei 15.358/2026 (em vigor desde 25/03/2026) elevou as frações dos hediondos (70% e 80%; com morte, 75% e 85%; feminicídio, 75%), e a Lei 15.402/2026 (fatos desde 08/05/2026) reescreveu o caput (1/6 como regra) e os incisos I a III (25%, 30% e 20%). A convivência entre os incisos é debatida, e há tese de inconstitucionalidade formal da Lei 15.402. Confira o texto vigente e a data do fato antes de calcular.',
 t:['Irretroatividade da lei penal mais gravosa na execução (CF, art. 5º, XL): a fração é questão de direito material.'],
 r:['ew1']},

{id:'ew4', n:'Progressão especial da mulher', a:'LEP, art. 112, §§3º e 4º',
 s:'A mulher gestante, mãe ou responsável por criança ou pessoa com deficiência progride com 1/8 da pena, se o crime não tiver violência ou grave ameaça nem sido cometido contra filho ou dependente, se não integrar organização criminosa, for primária, tiver bom comportamento e cumprido ao menos 1/8 no regime anterior (§3º). A prática de novo crime doloso ou falta grave revoga o benefício (§4º).',
 r:['ew1']},

{id:'ew5', n:'Saída temporária', a:'LEP, arts. 122 a 125',
 s:'Para o condenado em regime semiaberto, sem vigilância direta. Desde a Lei 14.843/2024, restrita à frequência a curso supletivo profissionalizante, de ensino médio ou superior, pelo tempo necessário às atividades, e vedada aos condenados por crime hediondo ou cometido com violência ou grave ameaça (122, §2º). Pode ser fiscalizada por monitoração eletrônica.',
 t:['A lei mais gravosa sobre saída temporária é tratada como norma de execução de natureza material, sujeita à irretroatividade, segundo parte da doutrina.'],
 r:['ew2']},

{id:'ew6', jump:'ef1', tg:'Volta a regime mais rigoroso', n:'Regressão de regime', a:'LEP, art. 118',
 s:'Transferência para qualquer dos regimes mais rigorosos quando o condenado pratica fato definido como crime doloso ou falta grave, ou sofre condenação por crime anterior cuja pena, somada à restante, torne incabível o regime (118, I e II). No aberto, também pela frustração dos fins da execução ou pelo não pagamento da multa cumulativa, podendo pagá-la (§1º). Exige oitiva prévia do condenado (§2º).',
 j:['Súmula 526 STJ: a falta grave por fato definido como crime doloso dispensa o trânsito em julgado da condenação.','Súmula 533 STJ: o reconhecimento de falta grave exige procedimento disciplinar com defesa técnica.'],
 r:['ef1']},

{id:'eh3', n:'Prisão domiciliar', a:'LEP, art. 117',
 s:'Prevista para o regime aberto, para condenados maiores de 70 anos, acometidos de doença grave, com filho menor ou deficiente, ou gestantes (117). A jurisprudência a estende à falta de vaga em casa do albergado e, excepcionalmente, a outros regimes, por razões humanitárias.',
 x:'A Lei 15.402/2026 incluiu o §9º no art. 126: o cumprimento da pena em regime domiciliar não impede a remição.',
 j:['STF, RE 641.320 (Tema 423): prisão domiciliar como solução para a falta de vagas, com monitoração e outros parâmetros.'],
 r:['eh2']},

{id:'el3', n:'Condições do livramento', a:'LEP, arts. 132 e 137',
 s:'Condições obrigatórias: ocupação lícita, comunicação periódica ao juiz e não mudança de comarca sem autorização (132, §1º). Facultativas: não mudar de residência, recolher-se em horário fixado, não frequentar determinados lugares (§2º). O livramento começa em cerimônia solene (137).',
 r:['el1']},

{id:'el4', tg:'Perde, conforme o caso, o tempo em liberdade', n:'Revogação do livramento', a:'CP, arts. 86 a 88; LEP, arts. 140 a 145',
 s:'Obrigatória se o liberado for condenado à pena privativa de liberdade por crime cometido durante o livramento ou antes dele; facultativa no descumprimento de condições ou na condenação a pena não privativa (86 e 87). Revogado por crime praticado no período de prova, não se desconta o tempo em liberdade e não se concede novo livramento pela mesma pena (88).',
 r:['ef1']},

/* ───── TRILHO DAS PENAS RESTRITIVAS DE DIREITOS ───── */
{id:'er1', n:'Guia e intimação', a:'LEP, arts. 147 e 148',
 s:'Transitada em julgado a sentença que aplicou pena restritiva, o juiz da execução promove a execução, podendo requisitar a colaboração de entidades públicas ou solicitá-la a particulares (147). Pode ajustar a forma de cumprimento às condições pessoais do condenado (148).',
 t:['Penas alternativas como resposta à falência da prisão para a criminalidade de menor gravidade.'],
 r:['er2']},

{id:'er2', n:'Prestação de serviços à comunidade', a:'CP, art. 46; LEP, arts. 149 e 150',
 s:'Tarefas gratuitas em entidades assistenciais, hospitais, escolas e programas comunitários, à razão de 1 hora por dia de condenação, fixadas de modo a não prejudicar a jornada de trabalho. A entidade remete relatório mensal ao juiz (150).',
 r:['er3']},

{id:'er3', n:'Demais restritivas', a:'CP, arts. 43, 45, 47 e 48; LEP, arts. 151 a 155',
 s:'Prestação pecuniária e perda de bens e valores; limitação de fim de semana, com permanência em casa de albergado (151 a 153); interdição temporária de direitos, como a proibição de exercer cargo ou profissão e a suspensão da habilitação (154 e 155).',
 r:['er4']},

{id:'er4', tg:'Volta ao trilho da pena privativa', n:'Conversão em pena privativa', a:'CP, art. 44, §§4º e 5º; LEP, art. 181',
 s:'A restritiva converte-se em privativa de liberdade quando houver descumprimento injustificado; deduz-se o tempo cumprido, respeitado o saldo mínimo de 30 dias de detenção ou reclusão (CP, art. 44, §4º). A condenação superveniente a pena privativa só leva à conversão se for impossível cumprir as duas (§5º).',
 r:['ea1']},

/* ───── TRILHO DO SURSIS ───── */
{id:'es1', n:'Audiência admonitória', a:'LEP, arts. 156 a 161',
 s:'O juiz lê a sentença ao condenado e o adverte das consequências de nova infração e do descumprimento das condições (160). Se o condenado não comparecer, a suspensão fica sem efeito e executa-se a pena (161). O sursis só cabe quando não indicada ou incabível a substituição por restritivas (CP, art. 77, III).',
 t:['Instituto de uso residual depois da ampliação das penas restritivas pela Lei 9.714/1998.'],
 r:['es2']},

{id:'es2', n:'Condições do sursis', a:'CP, arts. 78 e 79; LEP, art. 158',
 s:'No primeiro ano, prestação de serviços à comunidade ou limitação de fim de semana; no sursis especial, proibição de frequentar lugares, de ausentar-se da comarca e comparecimento mensal (78). O juiz pode fixar outras condições adequadas (79).',
 r:['es3']},

{id:'es3', n:'Período de prova do sursis', a:'CP, arts. 77, 81, §2º, e 82',
 s:'De 2 a 4 anos; no sursis etário (maior de 70) ou humanitário, de 4 a 6 anos, para penas até 4 anos (77, §2º). Processado o beneficiário por outro crime, prorroga-se o período até o julgamento definitivo (81, §2º). Expirado o prazo sem revogação, extingue-se a pena (82).',
 r:['es4']},

{id:'es4', tg:'Volta ao trilho da pena privativa', n:'Revogação do sursis', a:'CP, art. 81; LEP, art. 162',
 s:'Obrigatória se o beneficiário for condenado definitivamente por crime doloso, frustrar a execução da multa ou descumprir as condições do primeiro ano; facultativa no descumprimento de outras condições ou na condenação por crime culposo ou contravenção (81).',
 r:['ea1']},

/* ───── TRILHO DA MULTA ───── */
{id:'em1', n:'Pagamento voluntário', a:'CP, art. 50; LEP, art. 164',
 s:'Transitada em julgado a sentença, a multa deve ser paga em 10 dias (CP, art. 50).',
 r:['em2']},

{id:'em2', n:'Parcelamento e desconto', a:'CP, art. 50, §§1º e 2º; LEP, arts. 168 e 169',
 s:'A requerimento, o juiz pode permitir o pagamento em parcelas mensais. Pode haver desconto no vencimento ou salário do condenado, sem incidir sobre os recursos indispensáveis ao seu sustento e de sua família.',
 r:['em3']},

{id:'em3', n:'Execução da multa', a:'CP, art. 51; LEP, art. 164',
 s:'A multa é dívida de valor, executada perante o juiz da execução penal (CP, art. 51, na redação da Lei 13.964/2019), aplicando-se as normas da dívida ativa da Fazenda Pública, inclusive quanto às causas interruptivas e suspensivas da prescrição. Não se converte em prisão.',
 j:['STF, ADI 3.150 (2018): legitimidade prioritária do Ministério Público para a execução, com atuação subsidiária da Fazenda Pública.'],
 r:['em4']},

{id:'em4', n:'Multa e extinção da punibilidade', a:'STJ, Tema 931',
 s:'Cumprida a pena privativa ou restritiva, o inadimplemento da multa não impede a extinção da punibilidade quando alegada a hipossuficiência do condenado, salvo se o juiz, em decisão concretamente motivada, indicar a possibilidade de pagamento.',
 j:['STJ, Tema 931 (tese revisada em 2024).'],
 r:['ex1']},

/* ───── TRILHO DA MEDIDA DE SEGURANÇA ───── */
{id:'ed1', n:'Guia de internação ou de tratamento', a:'LEP, arts. 171 a 174',
 s:'Transitada em julgado a sentença que aplicar medida de segurança (absolutória imprópria ou de conversão), expede-se guia para a execução (171 e 173). Ninguém é internado ou submetido a tratamento ambulatorial sem ela (172).',
 t:['Medida de segurança fundada na periculosidade, em contraste com a pena, fundada na culpabilidade.'],
 d:['Virgílio de Mattos, <i>Crime e psiquiatria</i>.','Débora Diniz, <i>A custódia e o tratamento psiquiátrico no Brasil: censo 2011</i>.'],
 r:['ed2']},

{id:'ed2', n:'Internação ou tratamento ambulatorial', a:'CP, arts. 96 e 97; Lei 10.216/2001',
 s:'Internação em hospital de custódia e tratamento psiquiátrico ou tratamento ambulatorial, este para fatos punidos com detenção (97), regra que a jurisprudência flexibiliza conforme a necessidade terapêutica. A Lei 10.216/2001 (reforma psiquiátrica) privilegia o tratamento em meio aberto, e a internação só se indica quando os recursos extra-hospitalares forem insuficientes.',
 x:'A Res. CNJ 487/2023 instituiu a Política Antimanicomial do Poder Judiciário, com diretrizes para o fechamento dos hospitais de custódia e o atendimento na rede de atenção psicossocial. Confira o estágio de implantação no seu tribunal.',
 r:['ed5','ed3']},

{id:'ed3', n:'Perícia de cessação da periculosidade', a:'CP, art. 97, §§1º e 2º; LEP, arts. 175 e 176',
 s:'Realizada ao fim do prazo mínimo fixado na sentença (de 1 a 3 anos) e repetida anualmente, ou a qualquer tempo, por determinação do juiz (176). Com base no laudo e ouvidos MP e defesa, o juiz decide.',
 r:['ed4']},

{id:'ed4', n:'Desinternação ou liberação condicional', a:'CP, art. 97, §3º; LEP, art. 178',
 s:'Cessada a periculosidade, a desinternação ou a liberação é condicional: restabelece-se a medida se, antes de 1 ano, o agente praticar fato indicativo de persistência da periculosidade (97, §3º). Decorrido o prazo, extingue-se a medida.',
 r:['ex1']},

{id:'ed5', n:'Limite da medida de segurança', a:'CP, art. 97, §1º',
 s:'O Código fala em prazo indeterminado, mas os tribunais superiores fixaram limites para impedir a prisão perpétua de fato: o máximo da pena abstratamente cominada ao delito (STJ) ou o limite máximo de cumprimento de pena (STF).',
 j:['Súmula 527 STJ.','STF, HC 84.219 (2005): a medida de segurança se submete ao limite máximo de cumprimento.'],
 r:['ed2']},

/* ───── FAIXAS TRANSVERSAIS ───── */
{id:'eb1', n:'Direitos e dignidade da pessoa presa', a:'CF, art. 5º, XLVII a L; LEP, arts. 3º, 10 a 27, 40 e 41',
 s:'Ao condenado são assegurados todos os direitos não atingidos pela sentença ou pela lei (3º). Assistência material, à saúde, jurídica, educacional, social e religiosa (10 a 27); respeito à integridade física e moral (40); e os direitos do art. 41, como alimentação, trabalho remunerado, visitas e contato com o mundo exterior.',
 t:['Princípio da humanidade das penas e vedação de penas cruéis.'],
 d:['Regras de Mandela (Regras Mínimas das Nações Unidas para o Tratamento de Presos, 2015).'],
 r:['ec1']},

{id:'eb2', n:'Órgãos da execução', a:'LEP, arts. 61 a 81-B',
 s:'Conselho Nacional de Política Criminal e Penitenciária, juízo da execução, Ministério Público, Conselho Penitenciário, departamentos penitenciários, patronato, Conselho da Comunidade e Defensoria Pública (61). O MP fiscaliza a execução (67), e a Defensoria atua em todos os graus e instâncias (81-A).',
 r:['en5']},

{id:'eb3', n:'Disciplina e faltas', a:'LEP, arts. 44 a 60',
 s:'As faltas são leves, médias ou graves; as graves estão no art. 50 (fuga, posse de celular, incitação a movimento de subversão, descumprimento das condições do regime aberto, entre outras) e as leves e médias na legislação local. Sanções: advertência, repreensão, suspensão ou restrição de direitos, isolamento e RDD (53).',
 r:['eb4','ew6']},

{id:'eb4', n:'Procedimento disciplinar', a:'LEP, arts. 59 e 60',
 s:'Praticada a falta, instaura-se procedimento para apurá-la, assegurado o direito de defesa (59). O isolamento preventivo pode durar até 10 dias (60).',
 j:['Súmula 533 STJ: exige procedimento administrativo com defesa por advogado constituído ou defensor público.'],
 r:['eb3']},

{id:'eb5', n:'Trabalho do preso', a:'LEP, arts. 28 a 37',
 s:'Dever social e condição de dignidade, com finalidade educativa e produtiva (28). Remunerado em pelo menos três quartos do salário mínimo (29), não sujeito à CLT. Jornada de 6 a 8 horas (33). O trabalho externo exige aptidão, disciplina e cumprimento de um sexto da pena (37).',
 r:['eb6']},

{id:'eb6', n:'Remição', a:'LEP, arts. 126 a 130',
 s:'Desconto de 1 dia de pena a cada 3 dias de trabalho ou a cada 12 horas de frequência escolar, divididas em ao menos 3 dias (126, §1º), com acréscimo de um terço pela conclusão de etapa de ensino (§5º). A leitura também remite, conforme regulamentação do CNJ. A falta grave pode revogar até um terço do tempo remido (127).',
 r:['eb7']},

{id:'eb7', n:'Remição em regime domiciliar', a:'LEP, art. 126, §9º',
 s:'O cumprimento da pena em regime domiciliar não impede a remição, regra que alcança quem está em prisão domiciliar por falta de vaga ou por razões humanitárias.',
 x:'Parágrafo incluído pela Lei 15.402/2026.',
 r:['eh3']},

{id:'eb8', n:'Permissão de saída', a:'LEP, arts. 120 e 121',
 s:'Para presos dos regimes fechado e semiaberto e presos provisórios, mediante escolta, em caso de falecimento ou doença grave de familiar ou necessidade de tratamento médico, concedida pelo diretor do estabelecimento.',
 r:['ew5']},

{id:'eb9', n:'Monitoração eletrônica', a:'LEP, arts. 146-B a 146-D',
 s:'Admitida na saída temporária, na prisão domiciliar e, desde a Lei 14.843/2024, em outras hipóteses legais. O condenado deve receber visitas do servidor e respeitar a área de inclusão; violações podem levar à regressão e à revogação do benefício.',
 r:['eh3']},

{id:'eb10', n:'Indulto, comutação e anistia', a:'CF, art. 84, XII; LEP, arts. 187 a 193',
 s:'O indulto (individual ou coletivo, por decreto presidencial) extingue a pena; a comutação a reduz; a anistia, por lei, apaga o crime. O juiz da execução verifica os requisitos de cada decreto. Hediondos e equiparados são insuscetíveis de graça e indulto (Lei 8.072/1990, art. 2º, I).',
 j:['Súmula 535 STJ: a falta grave não interrompe o prazo para comutação e indulto.'],
 r:['ex1']},

{id:'eb11', n:'Agravo em execução', a:'LEP, art. 197',
 s:'Recurso contra as decisões do juiz da execução, sem efeito suspensivo, segue o procedimento do recurso em sentido estrito, com prazo de 5 dias e juízo de retratação.',
 j:['Súmula 700 STF.'],
 r:['eb12']},

{id:'eb12', n:'<i>Habeas corpus</i> na execução', a:'CF, art. 5º, LXVIII; CPP, art. 647',
 s:'Via para ilegalidades flagrantes que afetem a liberdade de locomoção, como a manutenção em regime mais gravoso por falta de vaga, o excesso de execução ou a demora injustificada na apreciação de benefício. O STJ não conhece de HC substitutivo do agravo em execução, salvo flagrante ilegalidade.',
 r:['eb11']},

{id:'eb13', n:'Prescrição executória', a:'CP, arts. 110, 112, 113 e 117, V e VI',
 s:'Regula-se pela pena aplicada, aumentada de um terço para o reincidente. É interrompida pelo início ou continuação do cumprimento e pela reincidência; no caso de fuga ou revogação de livramento, regula-se pelo tempo que resta da pena (113).',
 j:['STF, Tema 788 (2023): o termo inicial é o trânsito em julgado para ambas as partes, com modulação temporal.'],
 r:['en14']},

/* ───── INCIDENTES DE EXECUÇÃO ───── */
{id:'ei1', n:'Conversões', a:'LEP, arts. 180 a 182 e 184',
 s:'A pena privativa de até 2 anos pode ser convertida em restritiva, se o condenado estiver em regime aberto e tiver cumprido ao menos um quarto da pena (180). A restritiva converte-se em privativa nas hipóteses do art. 181. O tratamento ambulatorial pode ser convertido em internação (184).',
 r:['er4']},

{id:'ei2', n:'Excesso ou desvio de execução', a:'LEP, arts. 185 e 186',
 s:'Há excesso ou desvio sempre que algum ato for praticado além dos limites fixados na sentença, em normas legais ou regulamentares (185). Podem suscitar o incidente o MP, o Conselho Penitenciário, o sentenciado e qualquer dos demais órgãos da execução (186).',
 r:['ec2']},

{id:'ei3', n:'Superveniência de doença mental', a:'LEP, arts. 108 e 183; CP, art. 41',
 s:'O condenado acometido de doença mental é internado em hospital de custódia (108). No curso da execução, o juiz pode substituir a pena por medida de segurança (183), cuja duração não pode exceder o restante da pena.',
 r:['ed1']},

{id:'ei4', n:'Unificação e nova condenação', a:'LEP, arts. 111, parágrafo único, e 118, II',
 s:'Sobrevindo condenação no curso da execução, soma-se a pena ao restante da que está sendo cumprida para determinar o regime (111, parágrafo único), o que pode levar à regressão (118, II).',
 r:['ew6']},

{id:'ei5', n:'Transferência e recambiamento', a:'LEP, art. 86; Lei 11.671/2008',
 s:'As penas podem ser cumpridas em estabelecimento de outra unidade federativa, e a transferência para perto da família é diretriz da individualização. A inclusão em presídio federal segue procedimento próprio.',
 r:['en6']},

/* ───── SITUAÇÕES ESPECIAIS ───── */
{id:'eo1', n:'Mulheres presas, gestantes e mães', a:'LEP, arts. 14, §3º, 83, §2º, 89 e 112, §3º',
 s:'Acompanhamento médico no pré-natal e no pós-parto (14, §3º), berçário para amamentação até ao menos 6 meses (83, §2º), seção para gestante e parturiente e creche (89), e progressão especial (112, §3º). Vedado o uso de algemas no parto (CPP, art. 292, parágrafo único).',
 d:['Regras de Bangkok (Regras das Nações Unidas para o Tratamento de Mulheres Presas, 2010).'],
 j:['STF, HC 143.641 (2018): <i>habeas corpus</i> coletivo para gestantes e mães presas preventivamente.'],
 r:['ew4']},

{id:'eo2', n:'Prisão domiciliar humanitária', a:'LEP, art. 117; CF, art. 1º, III',
 s:'Para condenados com doença grave cujo tratamento o sistema não consegue oferecer, a jurisprudência admite a domiciliar mesmo fora do regime aberto, à luz da dignidade da pessoa humana e da vedação de penas cruéis.',
 r:['eh3']},

{id:'eo3', n:'Pessoas estrangeiras', a:'Lei 13.445/2017, arts. 54 a 60',
 s:'A condição de estrangeiro, mesmo com expulsão decretada, não impede, por si, a progressão de regime e os demais benefícios, segundo a jurisprudência dos tribunais superiores. A expulsão pode ser efetivada antes do cumprimento integral, nas hipóteses legais.',
 r:[]},

{id:'eo4', n:'População LGBTI', a:'Res. CNJ 348/2020',
 s:'Diretrizes para o tratamento da população LGBTI custodiada: autodeclaração, direito de manifestar preferência pelo local de custódia (unidade feminina, masculina ou ala específica) e respeito ao nome social.',
 r:[]},

{id:'eo5', n:'Reabilitação', a:'CP, arts. 93 a 95; CPP, arts. 743 a 750',
 s:'Decorridos 2 anos da extinção da pena, o condenado pode requerer a reabilitação, que assegura o sigilo dos registros da condenação e pode afastar efeitos secundários. Não apaga a reincidência nem restabelece o cargo perdido.',
 r:[]},

/* ───── CONTROLE DAS CONDIÇÕES DE CUSTÓDIA ───── */
{id:'ec1', n:'Estado de coisas inconstitucional', a:'CF, art. 5º, III, XLVII e XLIX; ADPF 347',
 s:'O STF reconheceu o estado de coisas inconstitucional do sistema prisional brasileiro: violação massiva e persistente de direitos fundamentais, decorrente de falhas estruturais e da omissão dos três Poderes. Em 2015, em cautelar, determinou as audiências de custódia e o descontingenciamento do Fundo Penitenciário; no mérito (2023), a elaboração de plano nacional, que resultou no Plano Pena Justa.',
 t:['Litígio estrutural e decisões de reforma institucional, de inspiração colombiana (<i>estado de cosas inconstitucional</i>).'],
 d:['Carlos Alexandre de Azevedo Campos, <i>Estado de coisas inconstitucional</i>.'],
 r:['ec2']},

{id:'ec2', n:'Falta de vagas e superlotação', a:'Súmula Vinculante 56; STF, RE 641.320',
 s:'A falta de estabelecimento adequado não autoriza a manutenção em regime mais gravoso. O STF fixou parâmetros: saída antecipada, liberdade eletronicamente monitorada e penas alternativas para quem progride ao aberto, e prisão domiciliar enquanto não houver estrutura.',
 j:['STF, Tema 423 (RE 641.320, 2016).'],
 r:['ew2']},

{id:'ec3', n:'Indenização por condições degradantes', a:'CF, art. 37, §6º; STF, Tema 365',
 s:'O Estado deve indenizar, inclusive por danos morais, o preso submetido a condições degradantes de encarceramento, como a superlotação, por violação do dever de manter padrões mínimos de humanidade.',
 j:['STF, Tema 365 (RE 580.252, 2017).'],
 r:['ec1']},

{id:'ec4', n:'Mortes sob custódia', a:'CF, arts. 5º, XLIX, e 37, §6º; STF, Tema 592',
 s:'O Estado responde pela morte de pessoa presa quando descumpre o dever específico de proteção do art. 5º, XLIX. A responsabilidade é afastada apenas se demonstrar que não podia evitar o resultado.',
 t:['Dever estatal de custódia como dever de garantia da vida e da integridade da pessoa presa.'],
 j:['STF, Tema 592 (RE 841.526, 2016).'],
 r:['ec5']},

{id:'ec5', n:'Prevenção e combate à tortura', a:'CF, art. 5º, III; Leis 9.455/1997 e 12.847/2013',
 s:'A tortura é crime inafiançável e insuscetível de graça ou anistia. O Sistema Nacional de Prevenção e Combate à Tortura, com o Mecanismo Nacional, realiza visitas periódicas a locais de privação de liberdade (Lei 12.847/2013), em cumprimento ao Protocolo Facultativo à Convenção da ONU.',
 d:['Protocolo de Istambul, sobre a documentação da tortura.'],
 r:['ec6']},

{id:'ec6', n:'Inspeções e controle social', a:'LEP, arts. 66, VII e VIII, 68, 80 e 81',
 s:'O juiz da execução inspeciona mensalmente os estabelecimentos e pode interditá-los quando funcionarem em condições inadequadas (66, VII e VIII). O MP e o Conselho da Comunidade também visitam e fiscalizam (68 e 81).',
 r:['ec1']}
];
