/* ═════════ configuração dos mapas ═════════ */
const ALLC = [[-0.6,17.6]], ALLK = [[-0.6,10.8]];
const MAPS = {
 civil: {
  key:'civil', title:'Rota do Processo Civil', short:'Processo Civil', st:ST,
  lede:'Da rede de pressupostos à satisfação do crédito. Acima, as faixas do que vale durante todo o trecho; ao centro, o procedimento comum; abaixo, o Juizado Especial Cível, a execução de título extrajudicial e as demais vias. Arraste para navegar e clique em qualquer estação.',
  card:'CPC/2015 da petição inicial à satisfação do crédito, com o Juizado Especial Cível em paralelo, a execução de título extrajudicial e os procedimentos especiais.',
  gate:'n0', fix:'n15', end:'n16', netNote:'Faltou algum pressuposto?', lastCol:17.8,
  lanes:[
   {key:'cpc', label:'Procedimento comum', cat:'c', cols:Object.fromEntries(['c1','c22','c5','c6','c9','c10','c11','c12','c13','c14','r2','r7','c15','s1','s3','e5','e6','e10'].map((id,i)=>[id,i]))},
   {key:'jec', label:'Juizado Especial Cível', cat:'j', cols:{x1:0,j3:1,j4:2,j9:3,j10:8,j11:9,j13:10,j14:11,j15:12,j16:13}, notes:[[4.3,'Audiência una: resposta, provas e sentença no mesmo ato (arts. 27 a 29)']]},
   {key:'exe', label:'Execução de título extrajudicial', cat:'e', cols:{e1:0,e4:1,e7:2}, notes:[[6,'Sem embargos com efeito suspensivo, segue para penhora e expropriação, comuns ao cumprimento (art. 771)']], merge:'e5'}
  ],
  br:{
   c1:{up:['c3','c4'],down:['c2','g10']}, c5:{up:['c20']}, c6:{up:['c7'],down:['c8']},
   c10:{up:['c17','c18'],down:['c19']}, c14:{up:['c16']}, r2:{up:['r1','p2'],down:['s2']},
   r7:{up:['r9','r8','r10'],down:['r6']}, c15:{up:['p4','p10']}, s1:{up:['s6','s7','p9'],down:['s4','s5']},
   s3:{up:['s8']}, e5:{up:['e2']},
   x1:{down:['j2']}, j4:{down:['j5','j6','j7']}, j9:{down:['j8']}, j11:{down:['j12']},
   e1:{down:['e3','e8','e9']}
  },
  bars:[
   {id:'g1',  lb:'Normas fundamentais', span:ALLC, st:[['g12',-0.42]]},
   {id:'n17', lb:'Controle dos pressupostos', span:[[-0.6,12]], st:[['p8',0.7]]},
   {id:'g8',  lb:'Atos, prazos e comunicações', span:ALLC},
   {id:'g9',  lb:'Nulidades', span:ALLC},
   {id:'g11', lb:'Suspensão do processo', span:ALLC},
   {id:'g4',  lb:'Partes, deveres e despesas', span:ALLC},
   {id:'g7',  lb:'Juiz, MP, Defensoria e auxiliares', span:ALLC},
   {id:'g5',  lb:'Litisconsórcio', span:[[-0.6,12]]},
   {id:'g6',  lb:'Intervenção de terceiros', span:ALLC},
   {id:'t1',  lb:'Tutela provisória', span:ALLC, st:[['t3',-0.42],['t4',0.45],['t2',1.4],['t5',4]]},
   {id:'c21', lb:'Desistência e abandono', span:[[-0.6,9]]},
   {id:'r5',  lb:'Embargos de declaração', span:[[0,17.6]]},
   {id:'r3',  lb:'Agravo de instrumento', span:[[0,9],[13,17.6]]},
   {id:'r4',  lb:'Agravo interno', span:[[9.6,11.6]]},
   {id:'p1',  lb:'Precedentes e tribunais', span:ALLC, st:[['p5',9.75],['p3',10.35],['p7',10.9],['p6',12.2]]}
  ],
  net:[
   {t:'Pressupostos de existência', p:'Sem eles, o processo não chega a se formar.', ids:['n1','n2','n3']},
   {t:'Pressupostos de validade', p:'Sem eles, o processo existe, mas é defeituoso.', ids:['g3','n5','n6','n7','n8']},
   {t:'Pressupostos negativos', p:'Precisam estar ausentes para que o mérito seja julgado.', ids:['n9','n10','n11','n12']},
   {t:'Legitimidade e interesse', p:'Aferidos à luz do que o autor afirma (teoria da asserção).', ids:['g2','n13','n14']}
  ],
  groups:[
   {t:'Procedimentos especiais do CPC', p:'Em regra, após a resposta do réu seguem o procedimento comum (art. 318, parágrafo único).', ids:['f1','f2','f3','f4','f5','f6','f7','f8','f9','f10','f11','f12','f13'], a:0, w:3.55},
   {t:'Jurisdição voluntária', p:'Sem litígio: o juiz administra interesses privados (art. 719 e seguintes).', ids:['v1','v2','v3','v4','v5','v6','v7'], a:3.8, w:2.9},
   {t:'Leis processuais extravagantes', p:'Microssistemas com rito próprio; o CPC se aplica subsidiariamente.', ids:['x2','x3','x4','x5','x6','x7','x8','x9','x10','x11'], a:6.95, w:3.9}
  ],
  phases:[
   {id:'ent', name:'Rede de entrada'}, {id:'pos', name:'Fase postulatória', a:-0.6, b:3.5}, {id:'san', name:'Fase de saneamento', a:3.5, b:6.5},
   {id:'ins', name:'Fase instrutória', a:6.5, b:8.5}, {id:'dec', name:'Fase decisória', a:8.5, b:9.5}, {id:'rec', name:'Fase recursal', a:9.5, b:11.5},
   {id:'cj', name:'Coisa julgada', a:11.5, b:12.5}, {id:'exe', name:'Cumprimento e execução', a:12.5, b:17.8}
  ],
  preview:['#4F5D6B','#00845A','#3A97D4','#8B4C9E']
 },
 constitucional: {
  key:'constitucional', title:'Rota do Processo Constitucional', short:'Processo Constitucional', st:KST,
  lede:'Do filtro de admissibilidade à reclamação. Acima, os princípios do processo objetivo; ao centro, a ADI; abaixo, ADC, ADO e ADPF em paralelo, e o controle difuso até a súmula vinculante. No pé, os remédios constitucionais e o controle estadual. Arraste para navegar e clique em qualquer estação.',
  card:'Controle concentrado (ADI, ADC, ADO e ADPF) em trilhos paralelos, controle difuso até a súmula vinculante, efeitos da decisão, reclamação e os remédios constitucionais.',
  gate:'kn0', fix:'kn14', end:'kn15', netNote:'Falhou o filtro de admissibilidade?', lastCol:10.8,
  lanes:[
   {key:'adi', label:'Ação direta de inconstitucionalidade', cat:'ka', cols:{ka1:0,ka2:1,ka3:2,ka5:3,ka6:4,ka7:5,ka8:6,ka9:7,kf1:8,kf4:9,kf5:10}},
   {key:'adc', label:'Ação declaratória de constitucionalidade', cat:'kc', cols:{kc1:0,kc2:1,kc3:2,kc4:5,kc5:7}, notes:[[2.95,'Sem informações nem defesa pelo AGU: não há ato a defender (art. 19)']], merge:'kf1'},
   {key:'ado', label:'ADI por omissão', cat:'ko', cols:{ko1:0,ko2:1,ko3:2,ko4:3,ko5:7,ko6:8}},
   {key:'adpf', label:'Arguição de descumprimento de preceito fundamental', cat:'kp', cols:{kp1:0,kp2:1,kp4:2,kp5:3,kp6:5,kp7:7,kp8:8}, merge:'kf4'},
   {key:'dif', label:'Controle difuso', cat:'kd', cols:{kd1:0,kd2:1,kd4:3,kd5:4,kd7:6,kd8:7,kd9:8,kd10:9}, notes:[[1.95,'Do caso concreto ao STF']], merge:'kf5'}
  ],
  br:{ ka3:{up:['ka4']}, ka9:{up:['ka10','ka11','ka12']}, kf1:{up:['kf2','kf3']}, kp2:{down:['kp3']}, kd2:{down:['kd3']}, kd5:{down:['kd6']} },
  bars:[
   {id:'kt1', lb:'Processo objetivo', span:ALLK},
   {id:'kt4', lb:'Fungibilidade entre as ações', span:[[-0.6,7.5]]},
   {id:'kt5', lb:'Prejudicialidade', span:[[0,7.5]]},
   {id:'kt2', lb:'<em>Amicus curiae</em>', span:[[0.6,6.9]]},
   {id:'kt3', lb:'Audiências públicas e perícia', span:[[2.6,6.6]]}
  ],
  net:[
   {t:'Legitimidade ativa', p:'Rol fechado do art. 103 da Constituição.', ids:['kn1','kn2','kn3']},
   {t:'Objeto', p:'O que pode ser levado a cada ação.', ids:['kn4','kn5','kn6','kn7']},
   {t:'Parâmetro', p:'A norma constitucional que serve de padrão de controle.', ids:['kn8','kn9','kn10']},
   {t:'Requisitos específicos', p:'Exigências próprias de cada ação.', ids:['kn11','kn12','kn13']}
  ],
  groups:[
   {t:'Jurisdição constitucional das liberdades', p:'Remédios para a tutela de direitos subjetivos fundamentais.', ids:['kl1','kl2','kl3','kl4','kl5','kl6'], a:0, w:3.6},
   {t:'Controle estadual', p:'Tribunais de Justiça, com a Constituição Estadual por parâmetro.', ids:['ke1','ke2'], a:3.85, w:2.5},
   {t:'Outros mecanismos de controle', p:'Controle concreto, preventivo e de convencionalidade.', ids:['kx1','kx2','kx3'], a:6.6, w:3.4}
  ],
  phases:[
   {id:'ent', name:'Admissibilidade'}, {id:'pos', name:'Postulação', a:-0.6, b:1.5}, {id:'cau', name:'Cautelar', a:1.5, b:2.5},
   {id:'ins', name:'Instrução', a:2.5, b:6.5}, {id:'jul', name:'Julgamento', a:6.5, b:7.5}, {id:'efe', name:'Efeitos', a:7.5, b:9.5}, {id:'gar', name:'Garantia', a:9.5, b:10.8}
  ],
  preview:['#4F5D6B','#1B5DAB','#00845A','#E86C00','#8B4C9E','#A3174C']
 }
};
MAPS.penal = {
  key:'penal', title:'Rota do Processo Penal', short:'Processo Penal', st:PST,
  lede:'Da triagem do caso à extinção da pena. Acima, as faixas de garantias, prisões, provas, nulidades e prescrição; ao centro, o rito comum ordinário, da notícia do crime à execução; abaixo, o rito sumário e o Tribunal do Júri, que partem da denúncia, e o Juizado Especial Criminal. Arraste para navegar e clique em qualquer estação.',
  card:'CPP da notícia do crime à execução penal, com rito ordinário, sumário, Tribunal do Júri e JECrim em paralelo, faixas de prisões, provas e prescrição, e a triagem do caso na entrada.',
  gate:'pn0', fix:'pn15', end:'pn16', netNote:'Faltou condição ou a punibilidade se extinguiu?', lastCol:15.8,
  lanes:[
   {key:'ord', label:'Rito comum ordinário', cat:'pc', cols:{pc0:0,pc1:1,pc2:2,pc3:3,pc4:4,pc5:5,pc6:6,pc7:7,pc8:8,pc9:9,pr1:10,pr2:11,pc10:12,pe1:13,pe2:14,pe3:15}},
   {key:'sum', label:'Rito comum sumário', cat:'ps', from:'pc2', cols:{ps1:7}, notes:[[3.05,'Recebimento, citação, resposta e absolvição sumária como no ordinário (art. 394, §4º)']], merge:'pc9'},
   {key:'jur', label:'Tribunal do Júri', cat:'pj', from:'pc2', cols:{pj1:3,pj2:4,pj3:5,pj4:6,pj5:7,pj6:8,pj7:9}, merge:'pr1'},
   {key:'jec', label:'Juizado Especial Criminal', cat:'pk', cols:{pk1:0,pk2:1,pk3:2,pk4:7,pk5:9,pk6:10,pk7:11}, notes:[[3.05,'Sem fase escrita: defesa, recebimento, provas e sentença em audiência (art. 81)']], merge:'pe1'}
  ],
  br:{ pc1:{up:['pc11'],down:['pc12']}, pc2:{up:['pc13']}, pc3:{up:['pc14','pc15']}, pc4:{up:['pc16']}, pc6:{up:['pc18']}, pc7:{up:['pc19']},
       pc9:{up:['pc20','pc21','pc22']}, pr1:{up:['pr3']}, pc10:{up:['pr5']}, pe1:{up:['pe4','pe5','pe6']}, pe2:{up:['pe7','pe8','pe9']},
       pj3:{down:['pj8','pj9','pj10']}, pk2:{down:['pk8','pk9']}, pk3:{down:['pk10']} },
  bars:[
   {id:'pg1', lb:'Garantias do processo penal', span:[[-0.6,15.6]]},
   {id:'pg2', lb:'Juiz das garantias', span:[[-0.6,2]]},
   {id:'pp0', lb:'Prisões e medidas cautelares', span:[[-0.6,12]], st:[['pp1',-0.42],['pp2',0.4],['pp3',1.25],['pp4',3.3],['pp5',4.55],['pp6',6.6]]},
   {id:'pv0', lb:'Provas', span:[[-0.6,9.5]], st:[['pv1',-0.42],['pv2',0.6],['pv3',1.75],['pv4',2.95],['pv5',4.15]]},
   {id:'pg3', lb:'Nulidades', span:[[-0.6,12]]},
   {id:'pg4', lb:'<em>Habeas corpus</em>', span:[[-0.6,15.6]]},
   {id:'pg5', lb:'Prescrição', span:[[-0.6,15.6]], st:[['pg6',12.6]]},
   {id:'pr6', lb:'Recurso em sentido estrito', span:[[3,9.5]]},
   {id:'pg7', lb:'Assistente de acusação', span:[[3,12]]},
   {id:'pr7', lb:'Embargos de declaração', span:[[9,12]]}
  ],
  net:[
   {t:'Ação penal', p:'Quem acusa e sob que condição.', ids:['pn1','pn2','pn3','pn4']},
   {t:'Punibilidade', p:'Prescrição e decadência vêm antes do mérito.', ids:['pn5','pn6','pn7']},
   {t:'Competência', p:'Foro, justiça, júri, território e conexão, nessa ordem.', ids:['pn8','pn9','pn10','pn11']},
   {t:'Rito e solução negociada', p:'Definem o momento da defesa e as saídas consensuais.', ids:['pn12','pn13','pn14']}
  ],
  groups:[
   {t:'Procedimentos especiais', p:'Ritos com defesa preliminar ou regras próprias.', ids:['pf1','pf2','pf3','pf4','pf5','pf6'], a:0, w:3.6},
   {t:'Incidentes e medidas', p:'Questões que correm ao lado da ação penal.', ids:['pi1','pi2','pi3','pi4','pi5','pi6'], a:3.85, w:3.6}
  ],
  phases:[
   {id:'ent', name:'Triagem'}, {id:'inv', name:'Investigação', a:-0.6, b:1.5}, {id:'acu', name:'Acusação', a:1.5, b:3.5},
   {id:'def', name:'Defesa', a:3.5, b:6.5}, {id:'ins', name:'Instrução', a:6.5, b:8.5}, {id:'sen', name:'Sentença', a:8.5, b:9.5},
   {id:'rec', name:'Fase recursal', a:9.5, b:11.5}, {id:'tj', name:'Trânsito', a:11.5, b:12.5}, {id:'exe', name:'Execução penal', a:12.5, b:15.8}
  ],
  preview:['#4F5D6B','#1B5DAB','#3A97D4','#A3174C','#E86C00']
};
MAPS.execucao = {
  key:'execucao', title:'Rota da Execução Penal', short:'Execução Penal', st:EST,
  lede:'Do título executivo à extinção da pena. Acima, as faixas de direitos, disciplina, trabalho, remição e benefícios; ao centro, a pena privativa de liberdade, regime a regime; abaixo, restritivas, sursis, multa e medida de segurança, todos convergindo para a extinção. No pé, incidentes, situações especiais e o controle das condições de custódia.',
  card:'LEP do título à extinção: regimes e progressão, livramento, penas restritivas, sursis, multa e medida de segurança em trilhos paralelos, incidentes e controle das condições de custódia.',
  gate:'en0', fix:'en13', end:'en14', netNote:'Há erro no título ou no cálculo?', lastCol:9.8,
  lanes:[
   {key:'ppl', label:'Pena privativa de liberdade', cat:'ea', src:true, cols:{ea1:0,ea2:1,ef1:2,ew1:3,ew2:4,eh1:5,eh2:6,el1:7,el2:8,ex1:9}},
   {key:'prd', label:'Penas restritivas de direitos', cat:'er', cols:{er1:0,er2:2,er3:4}, merge:'ex1', mdx:-21},
   {key:'sur', label:'Suspensão condicional da pena', cat:'es', cols:{es1:0,es2:2,es3:5}, merge:'ex1', mdx:-7},
   {key:'mul', label:'Pena de multa', cat:'em', cols:{em1:0,em2:2,em3:4}, merge:'ex1', mdx:7},
   {key:'med', label:'Medida de segurança', cat:'ed', cols:{ed1:0,ed2:2,ed3:5,ed4:7}, merge:'ex1', mdx:21}
  ],
  br:{ ef1:{up:['ef2']}, ew1:{up:['ew3','ew4']}, ew2:{up:['ew5'],down:['ew6']}, eh2:{up:['eh3']}, el1:{up:['el3'],down:['el4']},
       er3:{down:['er4']}, es3:{down:['es4']}, em3:{down:['em4']}, ed2:{down:['ed5']} },
  bars:[
   {id:'eb1', lb:'Direitos e dignidade da pessoa presa', span:[[-0.6,9.6]]},
   {id:'eb2', lb:'Órgãos da execução', span:[[-0.6,9.6]]},
   {id:'eb3', lb:'Disciplina e faltas', span:[[1.5,8.6]], st:[['eb4',2.6]]},
   {id:'eb5', lb:'Trabalho', span:[[1.5,6.6]]},
   {id:'eb6', lb:'Remição', span:[[1.5,8.6]], st:[['eb7',6.15]]},
   {id:'eb8', lb:'Permissão de saída', span:[[1.5,5.5]]},
   {id:'eb9', lb:'Monitoração eletrônica', span:[[3.5,8.6]]},
   {id:'eb10', lb:'Indulto, comutação e anistia', span:[[-0.6,9.6]]},
   {id:'eb11', lb:'Agravo em execução', span:[[-0.6,9.6]]},
   {id:'eb12', lb:'<em>Habeas corpus</em>', span:[[-0.6,9.6]]},
   {id:'eb13', lb:'Prescrição executória', span:[[-0.6,9]]}
  ],
  net:[
   {t:'Título executivo', p:'Sem título e guia, não há execução.', ids:['en1','en2','en3']},
   {t:'Juízo competente', p:'Quem executa e com que poderes.', ids:['en4','en5','en6']},
   {t:'Cálculo da pena', p:'Unificação, detração e datas-base definem todos os prazos.', ids:['en7','en8','en9']},
   {t:'Individualização', p:'Classificação, exames e identificação no ingresso.', ids:['en10','en11','en12']}
  ],
  groups:[
   {t:'Incidentes de execução', p:'Questões que alteram o curso da execução.', ids:['ei1','ei2','ei3','ei4','ei5'], a:0, w:3.2},
   {t:'Situações especiais', p:'Regras próprias para grupos e circunstâncias específicas.', ids:['eo1','eo2','eo3','eo4','eo5'], a:3.45, w:3.0},
   {t:'Controle das condições de custódia', p:'Responsabilidade do Estado e litígio estrutural.', ids:['ec1','ec2','ec3','ec4','ec5','ec6'], a:6.7, w:3.3}
  ],
  phases:[
   {id:'ent', name:'Título e cálculo'}, {id:'ing', name:'Ingresso', a:-0.6, b:1.5}, {id:'fec', name:'Regime fechado', a:1.5, b:3.5},
   {id:'sem', name:'Semiaberto', a:3.5, b:5.5}, {id:'abe', name:'Aberto', a:5.5, b:6.5}, {id:'liv', name:'Livramento', a:6.5, b:8.5}, {id:'ext', name:'Extinção', a:8.5, b:9.8}
  ],
  preview:['#4F5D6B','#A3174C','#0B9A8D','#3A97D4','#9A5B2A','#8B4C9E']
};
Object.assign(SHORT, {eb4:'Procedimento disciplinar', eb7:'Remição em domiciliar'});
MAPS.trabalho = {
  key:'trabalho', title:'Rota do Processo Trabalhista', short:'Processo Trabalhista', st:WST,
  lede:'Da petição inicial à extinção da execução. Acima, as faixas de princípios, conciliação, interlocutórias, mandado de segurança e prescrição; ao centro, a reclamação trabalhista em rito ordinário; abaixo, inquérito para apuração de falta grave, homologação de acordo extrajudicial, rito sumaríssimo e dissídio coletivo. No pé, ações especiais, meios extrajudiciais e grandes teses.',
  card:'CLT da petição inicial à extinção da execução, com rito sumaríssimo, inquérito, acordo extrajudicial e dissídio coletivo em paralelo, e as grandes teses que redesenharam a matéria.',
  gate:'wa0', fix:'wa13', end:'wa14', netNote:'Falta algum requisito da inicial?', lastCol:15.8,
  lanes:[
   {key:'rec', label:'Reclamação trabalhista (rito ordinário)', cat:'wc', cols:{wc1:0,wc2:1,wc3:2,wc4:3,wc5:4,wc6:5,wc7:6,wr1:7,wr2:8,wc8:9,wx1:10,wx2:11,wx3:12,wx4:13,wx5:14,wx6:15}},
   {key:'inq', label:'Inquérito para apuração de falta grave', cat:'wi', cols:{wi1:0,wi2:2,wi3:6}, merge:'wr1', mdx:-12},
   {key:'hom', label:'Homologação de acordo extrajudicial', cat:'wh', cols:{wh1:0,wh2:3,wh3:6}, merge:'wr1', mdx:12},
   {key:'sum', label:'Rito sumaríssimo', cat:'ws', cols:{ws1:0,ws2:2,ws3:6,ws4:7,ws5:8}, merge:'wc8'},
   {key:'dis', label:'Dissídio coletivo', cat:'wd', cols:{wd1:0,wd2:2,wd3:6,wd4:7,wd5:10}}
  ],
  br:{ wc3:{up:['wc11','wc12']}, wc4:{up:['wc13'],down:['wc14']}, wc5:{up:['wc15']}, wr1:{up:['wr7']}, wr2:{up:['wr3','wr4','wr5']},
       wc8:{up:['wr6']}, wx2:{up:['wx7']}, wx3:{up:['wx8']}, wh3:{down:['wh4']} },
  bars:[
   {id:'wb1', lb:'Princípios do processo do trabalho', span:[[-0.6,15.6]]},
   {id:'wb2', lb:'Conciliação a qualquer tempo', span:[[-0.6,15.6]]},
   {id:'wb3', lb:'Aplicação subsidiária do CPC', span:[[-0.6,15.6]]},
   {id:'wb4', lb:'Irrecorribilidade das interlocutórias', span:[[0,6.5]]},
   {id:'wb7', lb:'Mandado de segurança contra ato judicial', span:[[0,15.6]]},
   {id:'wb9', lb:'Desconsideração da personalidade jurídica', span:[[0,15.6]]},
   {id:'wb5', lb:'Embargos de declaração', span:[[6,15.6]]},
   {id:'wb10', lb:'Precedentes do TST', span:[[6.6,9.5]]},
   {id:'wb6', lb:'Prescrição', span:[[-0.6,15.6]], st:[['wb8',12.6]]}
  ],
  net:[
   {t:'Competência', p:'Matéria, território e fronteiras com a Justiça Comum.', ids:['wa1','wa2','wa3']},
   {t:'Partes e postulação', p:'Quem pode estar em juízo e como.', ids:['wa4','wa5','wa6']},
   {t:'Custas, gratuidade e honorários', p:'Os custos do processo desde a Reforma de 2017.', ids:['wa7','wa8','wa9']},
   {t:'Petição, prescrição e rito', p:'O que a inicial precisa trazer e por onde ela segue.', ids:['wa10','wa11','wa12']}
  ],
  groups:[
   {t:'Ações especiais', p:'Vias próprias na Justiça do Trabalho.', ids:['wg1','wg2','wg3','wg4','wg5','wg6'], a:0, w:3.8},
   {t:'Meios extrajudiciais', p:'Soluções fora do processo, com efeitos nele.', ids:['we1','we2','we3','we4'], a:4.05, w:3.2},
   {t:'Grandes teses', p:'Precedentes que redesenharam o processo e o direito do trabalho.', ids:['wt1','wt2','wt3','wt4'], a:7.5, w:3.6}
  ],
  phases:[
   {id:'ent', name:'Admissibilidade'}, {id:'pos', name:'Postulação', a:-0.6, b:1.5}, {id:'aud', name:'Audiência e defesa', a:1.5, b:3.5},
   {id:'ins', name:'Instrução', a:3.5, b:5.5}, {id:'dec', name:'Decisão', a:5.5, b:6.5}, {id:'rec', name:'Recursos', a:6.5, b:8.5},
   {id:'tj', name:'Trânsito', a:8.5, b:9.5}, {id:'exe', name:'Liquidação e execução', a:9.5, b:15.8}
  ],
  preview:['#4F5D6B','#00845A','#A3174C','#0B9A8D','#3A97D4','#B45309']
};
Object.assign(SHORT, {wb8:'Prescrição intercorrente'});
const VERSAO = '12 de outubro de 2026';
Object.values(MAPS).forEach(m=>m.conf = 'outubro de 2026');
Object.assign(SHORT, {pp1:'Flagrante', pp2:'Custódia', pp3:'Temporária', pp4:'Preventiva', pp5:'Cautelares diversas e fiança', pp6:'Revisão de 90 dias',
  pv1:'Prova ilícita', pv2:'Cadeia de custódia', pv3:'Busca domiciliar e pessoal', pv4:'Interceptação e dados', pv5:'Reconhecimento de pessoas', pg6:'Prescrição executória'});
