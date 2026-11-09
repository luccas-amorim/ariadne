const WST = [
/* ───── REDE DE ENTRADA ───── */
{id:'wa0', n:'Escolha da via', a:'CLT, arts. 763, 840, 852-A, 853, 855-B e 856',
 s:'Superados os filtros, a demanda segue pela via adequada: reclamação trabalhista em rito ordinário; rito sumaríssimo, para causas de até 40 salários mínimos; inquérito para apuração de falta grave, contra empregado estável; homologação de acordo extrajudicial, por petição conjunta; ou dissídio coletivo, entre categorias. O processo do trabalho tem regras próprias na CLT, e o CPC só se aplica supletiva e subsidiariamente, quando compatível (769; CPC, art. 15).',
 t:['Autonomia do processo do trabalho e o princípio da proteção projetado no processo.','Conciliação como fim permanente: os dissídios estão sempre sujeitos a ela (764).'],
 d:['Mauro Schiavi, <i>Manual de direito processual do trabalho</i>.','Carlos Henrique Bezerra Leite, <i>Curso de direito processual do trabalho</i>.','Homero Batista Mateus da Silva, <i>CLT comentada</i>.'],
 r:['wc1','ws1','wi1','wh1','wd1']},

{id:'wa1', n:'Competência material', a:'CF, art. 114',
 s:'Ações oriundas da relação de trabalho; de indenização por dano moral ou patrimonial decorrente dela; que envolvam o exercício do direito de greve; sobre representação sindical; mandados de segurança, <i>habeas corpus</i> e <i>habeas data</i> em matéria trabalhista; penalidades administrativas impostas pela fiscalização; e execução de ofício das contribuições previdenciárias das sentenças que proferir.',
 t:['A EC 45/2004 ampliou a competência da relação de emprego para a relação de trabalho.'],
 j:['Súmula Vinculante 22: ações de indenização por acidente de trabalho contra o empregador.','Súmula Vinculante 23: ações possessórias decorrentes do exercício do direito de greve.','Súmula Vinculante 53: a execução de contribuições alcança só as sentenças condenatórias e os acordos homologados.'],
 r:['wa3']},

{id:'wa2', n:'Competência territorial', a:'CLT, art. 651',
 s:'Regra: o local da prestação de serviços, ainda que o empregado tenha sido contratado em outro lugar (651). Para viajantes, a localidade da agência ou filial a que se subordina; para empresa que atua fora do lugar da contratação, o empregado pode escolher entre o foro da celebração do contrato e o da prestação (§3º). A incompetência territorial é relativa e se alega por exceção, com suspensão do processo (800).',
 t:['Regra protetiva: facilitar o acesso do trabalhador ao juízo e à prova.'],
 r:['wa13']},

{id:'wa3', n:'Fronteiras com a Justiça Comum', a:'CF, art. 114; STF, ADI 3.395 e Temas 550 e 1.389',
 s:'Ficam fora da Justiça do Trabalho as causas de servidores estatutários (ADI 3.395) e as de representação comercial autônoma (Tema 550). A competência para julgar alegações de fraude em contratos civis de prestação de serviços (pejotização) está em discussão no STF, no Tema 1.389.',
 j:['STF, ADI 3.395 (2006 e 2020).','STF, Tema 550 (RE 606.003, 2020).','STF, Tema 1.389 (ARE 1.532.603): pendente de julgamento. Em junho de 2026, a suspensão nacional foi levantada para o primeiro grau e os TRTs, voltando a incidir depois do julgamento regional.'],
 r:['wt3']},

{id:'wa4', n:'<i>Jus postulandi</i>', a:'CLT, art. 791; Súmula 425 TST',
 s:'Empregados e empregadores podem reclamar pessoalmente perante a Justiça do Trabalho e acompanhar suas reclamações até o final (791). O TST limita a capacidade postulatória às Varas e aos TRTs: não alcança a ação rescisória, a ação cautelar, o mandado de segurança e os recursos de competência do TST.',
 t:['Acesso à justiça em tensão com a complexidade técnica crescente do processo.'],
 j:['Súmula 425 TST.'],
 r:['wa5']},

{id:'wa5', n:'Preposto e representação', a:'CLT, arts. 791 a 793 e 843',
 s:'O empregador pode ser substituído por gerente ou qualquer preposto que tenha conhecimento dos fatos, cujas declarações o obrigam (843, §1º); desde a Lei 13.467/2017, o preposto não precisa ser empregado (§3º). O menor de 18 anos é representado por seus responsáveis legais ou, na falta, pela Procuradoria do Trabalho, sindicato, MP estadual ou curador (793).',
 r:['wc3']},

{id:'wa6', n:'Substituição processual sindical', a:'CF, art. 8º, III',
 s:'O sindicato tem legitimidade ampla para defender em juízo os direitos e interesses coletivos ou individuais da categoria, como substituto processual, independentemente de autorização dos substituídos.',
 j:['STF, RE 883.642 (Tema 823, 2015): legitimidade ampla do sindicato para atuar como substituto processual.'],
 r:['wd1']},

{id:'wa7', n:'Gratuidade da justiça', a:'CLT, art. 790, §§3º e 4º',
 s:'Concedida a quem receber salário igual ou inferior a 40% do teto do RGPS (§3º) ou comprovar insuficiência de recursos (§4º). O TST firmou que a declaração de hipossuficiência, nos termos da Lei 7.115/1983, basta para a concessão, salvo prova em contrário.',
 j:['TST, Tema 21 de recursos repetitivos: o juiz tem o poder-dever de conceder a gratuidade mediante declaração de hipossuficiência, admitida a impugnação.'],
 r:['wa9']},

{id:'wa8', n:'Custas', a:'CLT, art. 789',
 s:'Na fase de conhecimento, 2% sobre o valor do acordo ou da condenação, com mínimo legal e máximo de 4 vezes o teto do RGPS (789). Pagas pelo vencido depois do trânsito em julgado ou, havendo recurso, dentro do prazo recursal (§1º).',
 r:['wr7']},

{id:'wa9', n:'Honorários sucumbenciais e periciais', a:'CLT, arts. 790-B e 791-A',
 s:'Desde a Lei 13.467/2017, há honorários sucumbenciais de 5% a 15% (791-A), inclusive em sucumbência recíproca. Os honorários periciais cabem à parte sucumbente no objeto da perícia (790-B). Para o beneficiário da gratuidade, a obrigação fica sob condição suspensiva, vedada a compensação com créditos obtidos no processo ou em outro; os honorários periciais, nesse caso, são custeados pela União.',
 j:['STF, ADI 5.766 (2021, com embargos em 2022): inconstitucionalidade parcial dos arts. 790-B e 791-A, §4º.'],
 r:['wa7']},

{id:'wa10', n:'Pedido líquido', a:'CLT, art. 840, §§1º e 3º; IN 41/2018 TST',
 s:'A reclamação escrita deve conter pedido certo, determinado e com indicação de seu valor (840, §1º). O TST entende que o valor pode ser estimado, sem limitar a condenação (IN 41, art. 12, §2º). Pedidos sem valor são extintos sem resolução do mérito (§3º), mas, segundo o TST, só depois de oportunizada a emenda.',
 j:['Súmula 263 TST: o indeferimento da inicial por defeito sanável exige prévia oportunidade de emenda.'],
 r:['wc1','wa13']},

{id:'wa11', n:'Prescrição', a:'CF, art. 7º, XXIX; CLT, arts. 11 e 11-A',
 s:'Prescrição quinquenal dos créditos, contada do ajuizamento, limitada a 2 anos após a extinção do contrato (bienal). O ajuizamento de reclamação, ainda que arquivada, interrompe a prescrição quanto aos pedidos idênticos (11, §3º). Desde 2017, há prescrição intercorrente na execução (11-A).',
 j:['Súmula 308 TST.','Súmula 268 TST: a ação arquivada interrompe a prescrição só em relação aos pedidos idênticos.'],
 r:['wb6']},

{id:'wa12', n:'Escolha do rito', a:'CLT, arts. 852-A e 852-B; Lei 5.584/1970, art. 2º, §§3º e 4º',
 s:'Causas de até 40 salários mínimos seguem o rito sumaríssimo, salvo quando parte for a administração pública direta, autárquica ou fundacional (852-A). Acima disso, o ordinário. As causas de alçada, de até 2 salários mínimos, têm recurso restrito a matéria constitucional (Lei 5.584/1970, art. 2º, §4º).',
 r:['ws1','wc1']},

{id:'wa13', n:'Emenda e remessa', a:'CLT, arts. 800 e 840; CPC, art. 321',
 s:'Vícios da inicial corrigem-se por emenda (Súmula 263 TST). Acolhida a exceção de incompetência territorial, os autos são remetidos ao juízo competente (800, §4º). Corrigido o vício, o processo retoma a rota.',
 r:['wa0']},

{id:'wa14', end:true, n:'Extinção sem resolução do mérito', a:'CLT, arts. 732, 840, §3º, e 844; CPC, art. 485',
 s:'Pedidos sem valor não emendados (840, §3º), arquivamento por ausência do reclamante (844) e as demais hipóteses do CPC. O reclamante que der causa a dois arquivamentos seguidos perde, por 6 meses, o direito de reclamar (perempção trabalhista, 731 e 732).',
 r:[]},

/* ───── TRILHO PRINCIPAL: RECLAMAÇÃO TRABALHISTA ───── */
{id:'wc1', n:'Petição inicial', a:'CLT, art. 840',
 s:'Escrita ou verbal (reduzida a termo). A escrita contém a designação do juízo, a qualificação das partes, breve exposição dos fatos, o pedido certo, determinado e com valor, data e assinatura (840, §1º). Dispensa-se a indicação de provas e o requerimento de citação.',
 t:['Simplicidade e informalidade do processo do trabalho.'],
 r:['wc2']},

{id:'wc2', n:'Notificação', a:'CLT, art. 841',
 s:'Em até 48 horas, a secretaria notifica o reclamado para comparecer à audiência, a primeira desimpedida depois de 5 dias (841), em regra por via postal. Desde a Lei 13.467/2017, oferecida a contestação, o reclamante não pode desistir da ação sem o consentimento do reclamado (§3º).',
 j:['Súmula 16 TST: presume-se recebida a notificação 48 horas depois da postagem; o não recebimento é ônus do destinatário provar.'],
 r:['wc3']},

{id:'wc3', n:'Audiência e primeira proposta', a:'CLT, arts. 843 a 846',
 s:'As partes devem comparecer pessoalmente, independentemente de seus advogados (843). Aberta a audiência, o juiz propõe a conciliação (846). A ausência do reclamante leva ao arquivamento; a do reclamado, à revelia e à confissão quanto à matéria de fato (844).',
 t:['Audiência una como modelo legal, frequentemente fracionada na prática em inicial e de instrução.'],
 r:['wc11','wc12','wc4']},

{id:'wc4', n:'Defesa', a:'CLT, arts. 847, 799 e 800',
 s:'Não havendo acordo, o reclamado tem 20 minutos para defesa oral, ou apresenta defesa escrita pelo sistema eletrônico até a audiência (847, parágrafo único). Exceções de suspeição e de incompetência suspendem o processo (799); a de incompetência territorial deve ser apresentada em 5 dias da notificação, antes da audiência (800).',
 r:['wc13','wc14','wc5']},

{id:'wc5', n:'Instrução', a:'CLT, arts. 818, 820, 821 e 848',
 s:'Interrogatório das partes, a requerimento ou de ofício (848), oitiva de testemunhas, até 3 por parte (821), que comparecem independentemente de intimação (825), e perícia. O ônus da prova é de quem alega, admitida a distribuição dinâmica por decisão fundamentada (818, §1º).',
 j:['Súmula 74 TST: confissão ficta da parte que não comparece à audiência em que deveria depor, desde que intimada com essa cominação.'],
 r:['wc15','wc6']},

{id:'wc6', n:'Razões finais e segunda proposta', a:'CLT, art. 850',
 s:'Terminada a instrução, as partes têm 10 minutos cada para razões finais, e o juiz renova a proposta de conciliação. Não havendo acordo, profere a decisão.',
 r:['wc7']},

{id:'wc7', n:'Sentença', a:'CLT, arts. 831, 832 e 852; CPC, art. 489',
 s:'Contém o nome das partes, o resumo do pedido e da defesa, a apreciação das provas, os fundamentos e a conclusão (832). Deve indicar a natureza jurídica das parcelas, para fins de incidência previdenciária (832, §3º), e, quando possível, já vir líquida.',
 r:['wr1']},

{id:'wr1', n:'Recurso ordinário', a:'CLT, art. 895',
 s:'Contra as decisões definitivas ou terminativas das Varas, ao TRT, em 8 dias (úteis, como todos os prazos trabalhistas desde 2017, art. 775). Exige preparo: custas e depósito recursal. Tem efeito meramente devolutivo (899), e a parte pode pedir efeito suspensivo ao tribunal.',
 j:['Súmula 414 TST: a tutela provisória concedida na sentença se ataca no recurso ordinário, com pedido de efeito suspensivo.'],
 r:['wr7','wr2']},

{id:'wr2', n:'Recurso de revista', a:'CLT, arts. 896 e 896-A',
 s:'Ao TST, em 8 dias, contra acórdão regional em recurso ordinário, por divergência jurisprudencial, contrariedade a súmula do TST ou súmula vinculante, ou violação literal de lei federal ou direta da Constituição (896). Exige indicar o trecho do acórdão que consubstancia o prequestionamento (§1º-A) e demonstrar transcendência (896-A).',
 x:'Desde 2025, o TST passou a julgar em larga escala recursos repetitivos, fixando mais de uma centena de teses vinculantes, e não cabe mais agravo de instrumento contra decisão que nega seguimento a recurso de revista com base nessas teses: a impugnação se faz por agravo interno no próprio TRT.',
 t:['Função uniformizadora: o TST como corte de precedentes, e não de revisão de fatos.'],
 j:['Súmula 126 TST: o recurso de revista não reexamina fatos e provas.'],
 r:['wr3','wr4','wr5','wc8']},

{id:'wc8', n:'Trânsito em julgado', a:'CLT, arts. 831 e 836',
 s:'A partir dele, a sentença se executa definitivamente. Antes, admite-se execução provisória até a penhora (899). O termo de conciliação vale como decisão irrecorrível, salvo para a Previdência quanto às contribuições (831, parágrafo único).',
 r:['wr6','wx1']},

{id:'wx1', n:'Liquidação de sentença', a:'CLT, art. 879',
 s:'Por cálculo, arbitramento ou artigos (879). Elaborada a conta, as partes têm 8 dias para impugná-la fundamentadamente, com indicação de itens e valores, sob pena de preclusão (§2º). A União é intimada sobre as contribuições previdenciárias (§3º).',
 j:['ADCs 58 e 59 e Lei 14.905/2024: critérios de correção e juros dos créditos trabalhistas (ver o bloco de grandes teses).'],
 r:['wt2','wx2']},

{id:'wx2', n:'Citação e garantia da execução', a:'CLT, arts. 876, 878, 880 a 883',
 s:'Liquidada a sentença, o executado é citado para pagar ou garantir a execução em 48 horas, sob pena de penhora (880). A garantia pode ser feita por depósito, nomeação de bens ou seguro garantia judicial (882). Desde 2017, a execução de ofício só cabe quando as partes não tiverem advogado (878).',
 r:['wx7','wx3']},

{id:'wx3', n:'Penhora e embargos à execução', a:'CLT, art. 884',
 s:'Garantida a execução ou penhorados os bens, o executado tem 5 dias para embargos, e o exequente, igual prazo para impugnar a sentença de liquidação (884 e §3º). A matéria dos embargos é restrita: cumprimento da decisão ou do acordo, quitação ou prescrição da dívida (§1º), além das matérias de ordem pública. Entidades filantrópicas e seus diretores ficam dispensados da garantia (§6º).',
 r:['wx8','wx4']},

{id:'wx4', n:'Agravo de petição', a:'CLT, art. 897, a, e §1º',
 s:'Contra as decisões do juiz na execução, em 8 dias. Só é recebido se o agravante delimitar, justificadamente, as matérias e os valores impugnados, permitindo a execução imediata da parte incontroversa (§1º).',
 r:['wx5']},

{id:'wx5', n:'Expropriação e pagamento', a:'CLT, art. 888; CPC, arts. 876 a 903',
 s:'Avaliação e alienação dos bens em hasta pública, com adjudicação preferencial pelo exequente (888, §1º). Aplicam-se subsidiariamente a Lei de Execução Fiscal (889) e o CPC.',
 r:['wx6']},

{id:'wx6', end:true, tg:'Fim do percurso', n:'Extinção da execução', a:'CPC, art. 924; CLT, art. 11-A',
 s:'Pela satisfação do crédito, pela transação ou pela prescrição intercorrente, que ocorre em 2 anos, contados do momento em que o exequente deixa de cumprir determinação judicial no curso da execução (11-A).',
 r:[]},

/* ───── RAMAIS DO TRILHO PRINCIPAL ───── */
{id:'wc11', end:true, tg:'Custas, salvo justificativa', n:'Arquivamento', a:'CLT, art. 844, §§2º e 3º',
 s:'A ausência do reclamante importa arquivamento. Desde 2017, ele paga as custas, ainda que beneficiário da gratuidade, salvo se comprovar motivo legalmente justificável em 15 dias, e o pagamento é condição para nova demanda (§§2º e 3º).',
 j:['STF, ADI 5.766: a regra do art. 844, §2º, foi mantida.'],
 r:['wa14']},

{id:'wc12', end:true, tg:'Vale como decisão irrecorrível', n:'Acordo homologado', a:'CLT, arts. 831, parágrafo único, e 846',
 s:'O termo de conciliação vale como decisão irrecorrível, salvo para a Previdência quanto às contribuições, e só é impugnável por ação rescisória (Súmula 259 TST).',
 j:['Súmula 259 TST.'],
 r:['wr6']},

{id:'wc13', n:'Reconvenção', a:'CPC, art. 343; CLT, art. 769',
 s:'Admitida no processo do trabalho por aplicação subsidiária do CPC, apresentada na própria contestação, quando conexa com a ação principal ou com o fundamento da defesa.',
 r:['wc5']},

{id:'wc14', n:'Revelia e confissão', a:'CLT, art. 844, §§4º e 5º',
 s:'A revelia não produz efeitos se houver litisconsorte que conteste, direitos indisponíveis, falta de documento indispensável ou alegações inverossímeis (§4º). Ainda que ausente o reclamado, presente o advogado, são aceitos a contestação e os documentos (§5º).',
 j:['Súmula 122 TST: a revelia só se afasta com atestado médico que declare expressamente a impossibilidade de locomoção do empregador ou de seu preposto.'],
 r:['wc7']},

{id:'wc15', n:'Perícia', a:'CLT, arts. 195 e 790-B; CPC, arts. 464 a 480',
 s:'Obrigatória para a caracterização de insalubridade e periculosidade (195, §2º). Os honorários periciais cabem à parte sucumbente no objeto da perícia; o juiz não pode exigir adiantamento (790-B, §3º).',
 j:['STF, ADI 5.766: o beneficiário da gratuidade não arca com os honorários periciais.'],
 r:['wc6']},

{id:'wr7', n:'Preparo e depósito recursal', a:'CLT, arts. 789, §1º, e 899, §§1º a 11',
 s:'O depósito recursal é exigido do empregador recorrente até o limite fixado periodicamente, e reduzido pela metade para entidades sem fins lucrativos, empregadores domésticos, MEI, microempresas e EPP (§9º). São isentos os beneficiários da gratuidade, as entidades filantrópicas e as empresas em recuperação judicial (§10). Pode ser substituído por fiança bancária ou seguro garantia judicial (§11).',
 j:['Súmula 128 TST: o depósito deve ser complementado a cada novo recurso, até o valor da condenação.'],
 r:['wr1']},

{id:'wr3', n:'Transcendência', a:'CLT, art. 896-A',
 s:'O TST examina, previamente, se a causa oferece transcendência econômica, política, social ou jurídica (§1º). É irrecorrível a decisão monocrática do relator que, em agravo de instrumento, considerar ausente a transcendência (§5º).',
 t:['Filtro de relevância análogo à repercussão geral.'],
 r:['wr2']},

{id:'wr4', n:'Agravo de instrumento', a:'CLT, art. 897, b',
 s:'Contra o despacho que nega seguimento a recurso, em 8 dias, com depósito de 50% do valor do depósito do recurso que se pretende destrancar (899, §7º). Não cabe mais contra a negativa fundada em tese vinculante do TST, que se impugna por agravo interno no TRT.',
 r:['wr2']},

{id:'wr5', n:'Embargos à SDI-1', a:'CLT, art. 894, II',
 s:'Contra decisões das Turmas do TST que divergirem entre si ou das decisões da Seção de Dissídios Individuais, ou contrariarem súmula ou orientação jurisprudencial do TST ou súmula vinculante do STF, em 8 dias. Do acórdão do TST, cabe ainda recurso extraordinário ao STF.',
 r:['wc8']},

{id:'wr6', n:'Ação rescisória', a:'CLT, art. 836; CPC, arts. 966 a 975',
 s:'Admitida nos termos do CPC, com depósito prévio de 20% do valor da causa, salvo prova de miserabilidade (836). É de competência dos TRTs ou do TST, e não admite <i>jus postulandi</i>.',
 j:['Súmula 100 TST: contagem do prazo decadencial.','Súmula 259 TST: o termo de conciliação só é atacável por ação rescisória.'],
 r:['wx1']},

{id:'wx7', n:'Protesto e BNDT', a:'CLT, arts. 642-A e 883-A',
 s:'A decisão transitada em julgado pode ser protestada e o nome do executado inscrito em órgãos de proteção ao crédito e no Banco Nacional de Devedores Trabalhistas depois de 45 dias da citação sem garantia da execução (883-A). A inscrição no BNDT impede a obtenção de certidão negativa (642-A).',
 r:['wx2']},

{id:'wx8', n:'Exceção de pré-executividade', a:'construção doutrinária e jurisprudencial',
 s:'Admitida no processo do trabalho para matérias de ordem pública que dispensem dilação probatória, sem garantia do juízo. A decisão que a rejeita é interlocutória e irrecorrível de imediato.',
 r:['wx3']},

/* ───── TRILHO DO RITO SUMARÍSSIMO ───── */
{id:'ws1', n:'Pedido no sumaríssimo', a:'CLT, arts. 852-A e 852-B',
 s:'Causas de até 40 salários mínimos. O pedido deve ser certo e determinado, com o valor correspondente, e o autor deve indicar o nome e endereço corretos do reclamado, pois não há citação por edital. Descumpridos esses requisitos, a reclamação é arquivada (852-B, §1º).',
 t:['Celeridade como valor central: o rito foi concebido para causas de menor complexidade.'],
 r:['ws2']},

{id:'ws2', n:'Audiência única', a:'CLT, arts. 852-C a 852-H',
 s:'Instrução e julgamento em audiência única (852-C), com até 2 testemunhas por parte (852-H, §2º). A perícia é admitida quando a prova do fato exigir (§4º), e os incidentes são decididos de plano.',
 r:['ws3']},

{id:'ws3', n:'Sentença no sumaríssimo', a:'CLT, art. 852-I',
 s:'Dispensa o relatório e menciona os elementos de convicção, com resumo dos fatos relevantes.',
 r:['ws4']},

{id:'ws4', n:'Recurso ordinário no sumaríssimo', a:'CLT, art. 895, §1º',
 s:'Distribuído imediatamente, com parecer oral do MP, quando necessário, e julgado em 10 dias; o acórdão consiste apenas na certidão de julgamento, com fundamentação sucinta, e, se a sentença for confirmada pelos próprios fundamentos, a certidão serve de acórdão.',
 r:['ws5']},

{id:'ws5', n:'Recurso de revista restrito', a:'CLT, art. 896, §9º',
 s:'No sumaríssimo, a revista só cabe por contrariedade a súmula do TST ou súmula vinculante do STF, ou por violação direta da Constituição.',
 r:['wc8']},

/* ───── TRILHO DO INQUÉRITO PARA APURAÇÃO DE FALTA GRAVE ───── */
{id:'wi1', n:'Suspensão do empregado estável', a:'CLT, arts. 494 e 853',
 s:'O empregado estável acusado de falta grave pode ser suspenso, mas sua dispensa só se efetiva depois do inquérito em que se verifique a falta (494). O empregador tem 30 dias, contados da suspensão, para ajuizar o inquérito (853), prazo decadencial.',
 j:['Súmula 403 STF.','Súmula 379 TST: o dirigente sindical só pode ser dispensado por falta grave apurada em inquérito judicial.'],
 r:['wi2']},

{id:'wi2', n:'Inquérito judicial', a:'CLT, arts. 821 e 853 a 855',
 s:'Ação do empregador, por petição escrita, com até 6 testemunhas por parte (821). Segue, no mais, o procedimento ordinário.',
 r:['wi3']},

{id:'wi3', n:'Sentença no inquérito', a:'CLT, arts. 495 e 855',
 s:'Reconhecida a falta grave, resolve-se o contrato. Afastada, o empregador é obrigado a readmitir o empregado e a pagar os salários do período de suspensão (495).',
 r:['wr1']},

/* ───── TRILHO DA HOMOLOGAÇÃO DE ACORDO EXTRAJUDICIAL ───── */
{id:'wh1', n:'Petição conjunta', a:'CLT, arts. 855-B e 855-C',
 s:'Processo de jurisdição voluntária iniciado por petição conjunta, com as partes obrigatoriamente representadas por advogados distintos; o empregado pode ser assistido pelo advogado do sindicato (855-B). Não afasta o prazo de pagamento das verbas rescisórias nem a multa do art. 477 (855-C).',
 t:['Jurisdição voluntária no processo do trabalho, criada pela Lei 13.467/2017.'],
 r:['wh2']},

{id:'wh2', n:'Análise do acordo', a:'CLT, arts. 855-D e 855-E',
 s:'Em 15 dias, o juiz analisa o acordo, designa audiência se entender necessário e profere sentença (855-D). A petição suspende a prescrição dos direitos nela especificados, voltando a correr no dia seguinte ao trânsito em julgado da decisão que negar a homologação (855-E).',
 r:['wh3']},

{id:'wh3', n:'Homologação ou recusa', a:'CLT, art. 855-D; Súmula 418 TST',
 s:'A homologação é faculdade do juiz, que pode recusá-la fundamentadamente, por exemplo diante de quitação ampla desproporcional. Contra a recusa cabe recurso ordinário.',
 j:['Súmula 418 TST: a homologação de acordo constitui faculdade do juiz, inexistindo direito líquido e certo tutelável por mandado de segurança.'],
 r:['wh4','wr1']},

{id:'wh4', end:true, tg:'Encerra o procedimento', n:'Acordo homologado', a:'CLT, art. 831, parágrafo único',
 s:'A sentença homologatória faz coisa julgada quanto às parcelas abrangidas e é título executivo judicial.',
 r:['wx1']},

/* ───── TRILHO DO DISSÍDIO COLETIVO ───── */
{id:'wd1', n:'Instauração do dissídio', a:'CF, art. 114, §§2º e 3º; CLT, arts. 856 a 859',
 s:'Frustrada a negociação coletiva, as partes podem, de comum acordo, ajuizar dissídio coletivo de natureza econômica (114, §2º). Em greve em atividade essencial com possibilidade de lesão do interesse público, o MPT pode ajuizar dissídio (§3º). A instauração depende de aprovação em assembleia (859).',
 t:['Poder normativo da Justiça do Trabalho: criação de normas e condições de trabalho por sentença.'],
 j:['STF, ADI 3.423 (2020): é constitucional a exigência de comum acordo.'],
 r:['wd2']},

{id:'wd2', n:'Audiência de conciliação', a:'CLT, arts. 860 a 864',
 s:'Recebida a representação, o presidente do tribunal designa audiência de conciliação em 10 dias (860). Não havendo acordo, o processo é submetido a julgamento (864).',
 r:['wd3']},

{id:'wd3', n:'Sentença normativa', a:'CLT, arts. 866 a 871',
 s:'Fixa normas e condições de trabalho para a categoria, respeitadas as disposições mínimas legais e as convencionadas anteriormente (CF, art. 114, §2º). Pode ser estendida a toda a categoria (868 e 869), com vigência máxima de 4 anos (868, parágrafo único).',
 r:['wd4']},

{id:'wd4', n:'Recurso ordinário à SDC', a:'CLT, art. 895, II; Lei 10.192/2001, art. 14',
 s:'Das decisões dos TRTs em dissídio coletivo cabe recurso ordinário à Seção de Dissídios Coletivos do TST. O presidente do TST pode conceder efeito suspensivo (Lei 10.192/2001, art. 14).',
 r:['wd5']},

{id:'wd5', n:'Ação de cumprimento', a:'CLT, art. 872',
 s:'Não cumpridas as condições fixadas, os empregados ou o sindicato, como substituto processual, ajuízam ação de cumprimento na Vara do Trabalho, sem poder discutir matéria de fato e de direito já apreciada na decisão.',
 j:['Súmula 246 TST: é dispensável o trânsito em julgado da sentença normativa para a propositura da ação de cumprimento.'],
 r:[]},

/* ───── FAIXAS TRANSVERSAIS ───── */
{id:'wb1', n:'Princípios do processo do trabalho', a:'CLT, arts. 763 a 769 e 791',
 s:'Oralidade, concentração dos atos em audiência, simplicidade das formas, celeridade, <i>jus postulandi</i>, irrecorribilidade imediata das interlocutórias e busca permanente da conciliação. O impulso oficial é amplo, embora a Reforma tenha restringido a execução de ofício.',
 t:['O princípio da proteção no processo: igualdade material entre partes desiguais.'],
 d:['Wagner D. Giglio e Claudia Giglio Veltri Corrêa, <i>Direito processual do trabalho</i>.','Manoel Antonio Teixeira Filho — obras sobre o sistema dos recursos e a execução trabalhista.'],
 r:['wb2']},

{id:'wb2', n:'Conciliação a qualquer tempo', a:'CLT, arts. 764 e 831',
 s:'Os dissídios estão sempre sujeitos à conciliação, e é lícito às partes celebrar acordo mesmo depois de encerrado o juízo conciliatório (764, §3º). O juiz deve propor a conciliação na abertura da audiência e antes da sentença.',
 r:['wc12']},

{id:'wb3', n:'Aplicação subsidiária do CPC', a:'CLT, arts. 769 e 889; CPC, art. 15; IN 39/2016 TST',
 s:'Nos casos omissos, o direito processual comum é fonte subsidiária, salvo incompatibilidade (769). Na execução, aplica-se primeiro a Lei de Execução Fiscal (889). A IN 39 do TST lista os dispositivos do CPC aplicáveis e inaplicáveis.',
 r:['wb1']},

{id:'wb4', n:'Irrecorribilidade das interlocutórias', a:'CLT, art. 893, §1º; Súmula 214 TST',
 s:'As decisões interlocutórias não são recorríveis de imediato; impugnam-se no recurso contra a decisão definitiva. Exceções: decisão de TRT contrária a súmula ou OJ do TST, decisão suscetível de impugnação por recurso para o mesmo tribunal e decisão que acolhe exceção de incompetência territorial com remessa a TRT distinto.',
 j:['Súmula 214 TST.'],
 r:['wb7']},

{id:'wb5', n:'Embargos de declaração', a:'CLT, art. 897-A',
 s:'Em 5 dias, contra sentença ou acórdão com omissão, contradição ou obscuridade, ou manifesto equívoco no exame dos pressupostos extrínsecos do recurso, admitido efeito modificativo, com vista prévia à parte contrária. Interrompem o prazo para outros recursos (§3º).',
 r:['wr1']},

{id:'wb6', n:'Prescrição ao longo do processo', a:'CF, art. 7º, XXIX; CLT, arts. 11 e 11-A',
 s:'A prescrição bienal e a quinquenal se aferem no ajuizamento; na execução, corre a prescrição intercorrente de 2 anos, declarável de ofício (11-A, §2º).',
 r:['wb8']},

{id:'wb8', n:'Prescrição intercorrente', a:'CLT, art. 11-A',
 s:'Introduzida pela Lei 13.467/2017: corre a partir do descumprimento de determinação judicial pelo exequente no curso da execução, em 2 anos, e pode ser declarada de ofício.',
 j:['TST: aplica-se só às determinações descumpridas depois de 11/11/2017 (IN 41, art. 2º).'],
 r:['wx6']},

{id:'wb7', n:'Mandado de segurança contra ato judicial', a:'Lei 12.016/2009; Súmula 414 TST',
 s:'Como as interlocutórias são irrecorríveis, o mandado de segurança ganha espaço contra decisões teratológicas ou que causem dano irreparável, como a tutela provisória concedida antes da sentença (Súmula 414, II). Não cabe contra decisão passível de recurso próprio.',
 r:['wg1']},

{id:'wb9', n:'Desconsideração da personalidade jurídica', a:'CLT, art. 855-A; CPC, arts. 133 a 137',
 s:'Aplica-se o incidente do CPC, que suspende o processo. Na fase de conhecimento, a decisão é irrecorrível de imediato; na execução, cabe agravo de petição (855-A, §1º). A Justiça do Trabalho aplica, em regra, a teoria menor da desconsideração.',
 r:['wx3']},

{id:'wb10', n:'Precedentes do TST', a:'CLT, arts. 896-B e 896-C; CPC, art. 927',
 s:'Recursos de revista repetitivos e incidentes de assunção de competência formam teses vinculantes para toda a Justiça do Trabalho. Em 2025, o TST passou a usar o sistema em larga escala, convertendo súmulas e orientações em teses e cancelando enunciados.',
 r:['wr2']},

/* ───── AÇÕES ESPECIAIS ───── */
{id:'wg1', n:'Mandado de segurança trabalhista', a:'CF, art. 114, IV; Lei 12.016/2009',
 s:'Contra ato de juiz do trabalho, é de competência originária do TRT; contra ato de autoridade fiscalizadora do trabalho, da Vara. Exige advogado (Súmula 425 TST).',
 r:['wb7']},

{id:'wg2', n:'Ação civil pública trabalhista', a:'LC 75/1993, art. 83, III; Lei 7.347/1985',
 s:'Proposta pelo Ministério Público do Trabalho, sindicatos e demais legitimados para defesa de interesses coletivos quando desrespeitados direitos sociais constitucionalmente garantidos.',
 r:['wg3']},

{id:'wg3', n:'Ação anulatória de cláusula convencional', a:'LC 75/1993, art. 83, IV; CLT, art. 611-A, §5º',
 s:'Para declarar a nulidade de cláusula de convenção ou acordo coletivo que viole liberdades individuais ou coletivas ou direitos indisponíveis. Os sindicatos subscritores participam como litisconsortes necessários (611-A, §5º).',
 r:['wt1']},

{id:'wg4', n:'Consignação em pagamento', a:'CPC, arts. 539 a 549; CLT, art. 769',
 s:'Usada pelo empregador para se liberar do pagamento de verbas rescisórias diante de recusa ou impossibilidade de recebimento, afastando a mora e a multa do art. 477.',
 r:[]},

{id:'wg5', n:'Execução de títulos extrajudiciais', a:'CLT, arts. 876 e 877-A',
 s:'Termos de ajuste de conduta firmados com o MPT e termos de conciliação firmados perante Comissões de Conciliação Prévia são executáveis na Justiça do Trabalho (876).',
 r:['wx2']},

{id:'wg6', n:'Ações sobre greve', a:'CF, art. 114, II; Lei 7.783/1989',
 s:'Dissídio de greve, que pode ser ajuizado por qualquer das partes ou pelo MPT nas atividades essenciais, e ações possessórias decorrentes do exercício do direito de greve (Súmula Vinculante 23).',
 r:['wd1']},

/* ───── MEIOS EXTRAJUDICIAIS ───── */
{id:'we1', n:'Comissões de Conciliação Prévia', a:'CLT, arts. 625-A a 625-H',
 s:'Comissões paritárias, nas empresas ou nos sindicatos, para tentar conciliar conflitos individuais. O termo de conciliação é título executivo extrajudicial com eficácia liberatória geral, salvo parcelas ressalvadas (625-E).',
 j:['STF, ADIs 2.139 e 2.160 (2018): a submissão à comissão não é condição para ajuizar a reclamação.'],
 r:['wg5']},

{id:'we2', n:'Arbitragem em contrato individual', a:'CLT, art. 507-A',
 s:'Para empregados com remuneração superior a 2 vezes o teto do RGPS, admite-se cláusula compromissória de arbitragem, por iniciativa do empregado ou com sua concordância expressa.',
 r:[]},

{id:'we3', n:'Termo de quitação anual', a:'CLT, art. 507-B',
 s:'Empregado e empregador podem firmar, perante o sindicato da categoria, termo de quitação anual de obrigações trabalhistas, com eficácia liberatória das parcelas especificadas.',
 r:[]},

{id:'we4', n:'Termo de ajuste de conduta', a:'Lei 7.347/1985, art. 5º, §6º; CLT, art. 876',
 s:'Compromisso firmado com o MPT para adequar condutas à lei, com cominações, e executável na Justiça do Trabalho.',
 r:['wg5']},

/* ───── GRANDES TESES ───── */
{id:'wt1', n:'Negociado sobre o legislado', a:'CF, art. 7º, XXVI; CLT, arts. 611-A e 611-B; STF, Tema 1.046',
 s:'São constitucionais os acordos e convenções coletivas que, ao considerarem a adequação setorial negociada, pactuem limitações ou afastamentos de direitos trabalhistas, independentemente de vantagens compensatórias, desde que respeitados os direitos absolutamente indisponíveis.',
 j:['STF, Tema 1.046 (ARE 1.121.633, 2022).'],
 r:['wg3']},

{id:'wt2', n:'Correção dos créditos trabalhistas', a:'STF, ADCs 58 e 59; CC, arts. 389 e 406 (Lei 14.905/2024)',
 s:'O STF afastou a TR e fixou o IPCA-E na fase pré-judicial e a Selic a partir do ajuizamento (ADCs 58 e 59, 2020). Com a Lei 14.905/2024, o TST passou a aplicar, a partir de 30/08/2024, o IPCA como correção e juros equivalentes à Selic deduzido o IPCA (CC, art. 406).',
 j:['TST, SDI-1 (2024): adequação dos critérios das ADCs 58 e 59 à Lei 14.905/2024.'],
 r:['wx1']},

{id:'wt3', n:'Pejotização e competência', a:'STF, Tema 1.389 (ARE 1.532.603)',
 s:'O STF discute a competência da Justiça do Trabalho para julgar alegações de fraude em contratos civis ou comerciais de prestação de serviços, a licitude da contratação de pessoa jurídica ou autônomo e o ônus da prova. A matéria dialoga com a licitude da terceirização e de outras formas de divisão do trabalho (ADPF 324 e Tema 725).',
 j:['STF, Tema 1.389: pendente. Em junho de 2026, a suspensão nacional foi levantada para o primeiro grau e os TRTs.','STF, ADPF 324 e Tema 725 (2018).'],
 r:['wa3']},

{id:'wt4', n:'Terceirização e Administração Pública', a:'Súmula 331 TST; STF, Temas 246 e 1.118',
 s:'O tomador privado responde subsidiariamente pelas verbas do terceirizado (Súmula 331, IV). A Administração Pública não responde automaticamente: exige-se prova de falha concreta na fiscalização do contrato.',
 j:['STF, Tema 246 (RE 760.931, 2017).','STF, Tema 1.118 (2025): ônus da prova da falha fiscalizatória da Administração. Confira a tese vigente antes de usar.'],
 r:['wt3']}
];
