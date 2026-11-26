// Interactive paper cross-section of a CNS venule. Time belongs to this diagram,
// independently of the penalty. Both conditions begin with the same prior lesion.
export const immuneSources = [
  'https://www.nature.com/articles/s41392-025-02415-4',
  'https://dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=c5fdde91-1989-4dd2-9129-4f3323ea2962',
  'https://pubmed.ncbi.nlm.nih.gov/16510744/',
  'https://pubmed.ncbi.nlm.nih.gov/33503348/',
  'https://doi.org/10.1126/science.abj8222',
  'https://doi.org/10.1056/NEJMoa1601277'
];

export const immuneCopy = {
  en: {
    title:'From blood to myelin', section:'Immune cells & natalizumab',
    intro:'Follow a T cell at the blood–brain barrier, between the blood and nervous tissue. Compare the two conditions at the same instant.',
    modes:['Without natalizumab','With natalizumab'], steps:['Adhesion','Crossing','At the lesion'],
    phases:[
      ['An activated T cell can use α4β1 integrin on its surface to bind VCAM-1 on the vessel lining. This firm adhesion helps it leave the blood.',
       'The attached T cell crosses the vessel lining into the central nervous system. Other activated immune cells can also be recruited.',
       'T and B cells can sustain inflammation. Microglia and macrophages participate in myelin injury and clear debris. A damaged stretch can slow or block an impulse.'],
      ['Natalizumab, a monoclonal antibody, binds the α4 subunit on the immune cell. This interferes with α4β1 binding to VCAM-1 on the vessel wall.',
       'This antibody-bound T cell travels on in the blood. Reduced adhesion limits the recruitment of inflammatory cells into the central nervous system.',
       'Less new immune-cell entry can reduce new inflammatory lesions and relapses over time. The torn myelin shown here was already damaged. Natalizumab does not directly rebuild it.']
    ],
    blood:'Blood', brain:'CNS tissue', wall:'Vessel lining', myelin:'Myelin', old:'Existing damage',
    bound:'Natalizumab on α4', passing:'Stays in blood', crossing:'Entering tissue',
    diagram:'Animated cross-section with blood, vessel lining, T and B cells, a resident microglial cell and a partly demyelinated axon.',
    roles:['T cell','B cell','Microglia / macrophages'],
    rolesText:['Activated T cells can cross into the CNS, release inflammatory signals and contribute to tissue injury.',
      'B cells can present antigens to T cells and release signals that sustain inflammation. Some develop into antibody-secreting cells.',
      'Microglia live in the CNS. Macrophages can also enter from the blood. In active lesions they can contribute to damage and engulf myelin debris.'],
    play:'Play sequence', pause:'Pause sequence', time:'Time in the immune sequence', site:['','In the optic nerve, a conduction delay can make Joana read the corner later.','In a cerebellar pathway, disrupted signals can impair the last correction of Joana’s hand.'],
    onPitch:['','See this optic lesion on the pitch','See this cerebellar lesion on the pitch'],
    questions:[
      ['Which cell can show antigens to T cells and help sustain this response?', ['A red blood cell','A B cell','A muscle fibre'],1,'B cells can present antigens to T cells and release inflammatory signals.'],
      ['Where does natalizumab act in the scene?', ['On α4 integrin on the immune cell','On the ball','On the damaged myelin wrap'],0,'Binding α4 limits adhesion to the vessel lining and the entry of inflammatory cells into the CNS. The drug does not directly replace lost myelin.']
    ],
    safety:'Natalizumab is a disease-modifying treatment for relapsing forms of MS. It requires clinical monitoring, including for the risk of progressive multifocal leukoencephalopathy (PML). It is one of several available therapies. The choice is individual and made with a neurologist.',
    refs:['Review · immune cells and MS lesions','Prescribing information · natalizumab and α4 integrin','AFFIRM trial · relapses and new MRI lesions','B cells · antigen presentation to T cells','Cohort study · Epstein–Barr virus and MS risk','OPERA trials · anti-CD20 therapy in relapsing MS'],
    quiz:[
      ['Before they reach my brain, where are the lymphocytes involved in MS usually activated?', ['Inside the myelin','In lymph nodes and other lymphoid organs','In my glove'],1,'In the most accepted model, self-reactive lymphocytes are activated outside the central nervous system and only then migrate into it.'],
      ['What do regulatory T cells (Tregs) do?', ['They restrain immune responses against the body itself','They make myelin','They carry the nerve impulse'],0,'Tregs help maintain tolerance. In MS there is evidence that this brake works less well.'],
      ['Which cell makes myelin in my brain and optic nerve?', ['The Schwann cell','The B cell','The oligodendrocyte'],2,'Oligodendrocytes wrap axons in the central nervous system. Schwann cells do this in peripheral nerves, which MS does not target directly.'],
      ['Can damaged myelin be rebuilt?', ['Never','Partly. Precursor cells can form new oligodendrocytes','Yes, T cells rebuild it'],1,'Remyelination does happen, especially early on. It is often incomplete and varies between people. Promoting it is an active research field.'],
      ['Which infection is the strongest known risk factor for MS?', ['Epstein–Barr virus','Seasonal flu','Dengue'],0,'A large cohort study showed that MS risk rises sharply after EBV infection. Almost everyone carries EBV and the vast majority never develop MS. The virus seems necessary, yet far from sufficient.'],
      ['Anti-CD20 therapies such as ocrelizumab mainly remove which cells?', ['Red blood cells','Neurons','B cells'],2,'Depleting B cells reduces relapses and new lesions. This showed how much B cells matter in MS, partly because they present antigens to T cells.'],
      ['Can someone catch MS from me?', ['No','Yes, by touch','Yes, through blood'],0,'MS is immune-mediated. It is not contagious. It arises from a combination of genetic and environmental factors.'],
      ['Doctors found “oligoclonal bands” in spinal fluid. What are they?', ['Fragments of myelin','Antibodies produced inside the central nervous system','T cells'],1,'They are immunoglobulins made by B-lineage cells within the CNS. They are found in most people with MS and support the diagnosis.'],
      ['Which helper T cells are most associated with inflammation in MS?', ['Th1 and Th17','Th2 only','None. T cells are not involved'],0,'Th1 and Th17 cells release cytokines such as IFN-γ and IL-17, which promote inflammation and make the barrier more permeable.']
    ]
  },
  pt: {
    title:'Do sangue à mielina', section:'Células imunes e natalizumabe',
    intro:'Acompanhe um linfócito T na barreira hematoencefálica, entre o sangue e o tecido nervoso. Compare as duas condições no mesmo instante.',
    modes:['Sem natalizumabe','Com natalizumabe'], steps:['Adesão','Travessia','Na lesão'],
    phases:[
      ['Um linfócito T ativado pode usar a integrina α4β1 da sua superfície para se ligar à VCAM-1 na parede do vaso. Essa adesão firme ajuda a célula a sair do sangue.',
       'Depois de aderir, o linfócito T atravessa o endotélio e entra no sistema nervoso central. Outras células imunes ativadas também podem ser recrutadas.',
       'Linfócitos T e B podem sustentar a inflamação. Micróglia e macrófagos participam das lesões e fagocitam restos de mielina. O impulso pode atrasar ou falhar nesse trecho.'],
      ['O natalizumabe é um anticorpo monoclonal. Ele se liga à subunidade α4 na célula imune e dificulta a ligação da integrina α4β1 à VCAM-1 da parede do vaso.',
       'O linfócito T ligado ao anticorpo segue pelo sangue. Com menos adesão, diminui o recrutamento de células inflamatórias para o sistema nervoso central.',
       'Com menor entrada de células inflamatórias, podem ocorrer menos lesões novas e surtos ao longo do tratamento. O trecho de mielina rompido nas duas cenas já estava lesado. O natalizumabe não o reconstrói diretamente.']
    ],
    blood:'Sangue', brain:'Tecido do SNC', wall:'Endotélio', myelin:'Mielina', old:'Lesão existente',
    bound:'Natalizumabe na α4', passing:'Segue no sangue', crossing:'Entra no tecido',
    diagram:'Corte animado com sangue, endotélio, linfócitos T e B, uma célula da micróglia e um axônio parcialmente desmielinizado.',
    roles:['Linfócito T','Linfócito B','Micróglia / macrófagos'],
    rolesText:['Linfócitos T ativados podem entrar no SNC, liberar sinais inflamatórios e contribuir para a lesão do tecido.',
      'Linfócitos B podem apresentar antígenos aos T e liberar sinais que sustentam a inflamação. Alguns se diferenciam em células que secretam anticorpos.',
      'A micróglia reside no SNC. Macrófagos também podem vir do sangue. Em lesões ativas, essas células podem participar do dano e fagocitar restos de mielina.'],
    play:'Reproduzir sequência', pause:'Pausar sequência', time:'Tempo na sequência imune', site:['','No nervo óptico, o atraso da condução pode fazer Joana ler o canto mais tarde.','Quando uma via cerebelar é afetada, pode faltar precisão para ajustar a mão no fim do mergulho.'],
    onPitch:['','Ver o efeito da lesão óptica no campo','Ver o efeito da lesão cerebelar no campo'],
    questions:[
      ['Que célula pode apresentar antígenos aos linfócitos T e sustentar essa resposta?', ['Uma hemácia','Um linfócito B','Uma fibra muscular'],1,'Linfócitos B podem apresentar antígenos aos T e liberar sinais inflamatórios.'],
      ['Onde o natalizumabe atua na cena?', ['Na integrina α4 da célula imune','Na bola','Na bainha de mielina lesada'],0,'A ligação à α4 dificulta a adesão à parede do vaso e a entrada de células inflamatórias no SNC. O medicamento não repõe diretamente a mielina perdida.']
    ],
    safety:'O natalizumabe modifica a atividade inflamatória nas formas recorrentes da EM. O tratamento exige acompanhamento clínico, inclusive pelo risco de leucoencefalopatia multifocal progressiva (LEMP). É uma entre várias terapias disponíveis. A escolha é individual e feita com o neurologista.',
    refs:['Revisão · células imunes e lesões na EM','Bula · natalizumabe e integrina α4','Ensaio AFFIRM · surtos e lesões novas na ressonância','Células B · apresentação de antígenos a linfócitos T','Estudo de coorte · vírus Epstein-Barr e risco de EM','Ensaios OPERA · terapia anti-CD20 na EM recorrente'],
    quiz:[
      ['Antes de chegarem ao meu cérebro, onde costumam ser ativados os linfócitos envolvidos na EM?', ['Dentro da mielina','Nos linfonodos e em outros órgãos linfoides','Na minha luva'],1,'No modelo mais aceito, linfócitos autorreativos são ativados fora do sistema nervoso central e só depois migram para ele.'],
      ['O que fazem os linfócitos T reguladores (Tregs)?', ['Freiam respostas imunes contra o próprio organismo','Produzem mielina','Conduzem o impulso nervoso'],0,'As Tregs ajudam a manter a tolerância. Na EM, há evidências de que esse freio funciona pior.'],
      ['Que célula produz a mielina no meu cérebro e no nervo óptico?', ['A célula de Schwann','O linfócito B','O oligodendrócito'],2,'Os oligodendrócitos envolvem os axônios no sistema nervoso central. As células de Schwann fazem isso nos nervos periféricos, que não são o alvo direto da EM.'],
      ['A mielina lesada pode ser refeita?', ['Nunca','Em parte. Células precursoras podem formar novos oligodendrócitos','Sim, pelos linfócitos T'],1,'A remielinização acontece, principalmente no início da doença. Costuma ser incompleta e varia de pessoa para pessoa. Estimulá-la é uma área ativa de pesquisa.'],
      ['Qual infecção é o fator de risco mais forte já identificado para a EM?', ['Vírus Epstein-Barr','Gripe','Dengue'],0,'Um grande estudo de coorte mostrou que o risco de EM sobe muito depois da infecção pelo EBV. Quase todo mundo tem o vírus e a imensa maioria nunca terá EM. O vírus parece necessário, mas está longe de ser suficiente.'],
      ['Terapias anti-CD20, como o ocrelizumabe, removem principalmente quais células?', ['Hemácias','Neurônios','Linfócitos B'],2,'A depleção de linfócitos B reduz surtos e lesões novas. Isso mostrou a importância dessas células na EM, em parte porque apresentam antígenos aos linfócitos T.'],
      ['Alguém pode pegar EM de mim?', ['Não','Sim, pelo contato','Sim, pelo sangue'],0,'A EM é imunomediada e não é contagiosa. Ela surge de uma combinação de fatores genéticos e ambientais.'],
      ['Acharam “bandas oligoclonais” no líquor. O que são?', ['Pedaços de mielina','Anticorpos produzidos dentro do sistema nervoso central','Linfócitos T'],1,'São imunoglobulinas produzidas por células da linhagem B dentro do SNC. Aparecem na maioria das pessoas com EM e ajudam no diagnóstico.'],
      ['Quais linfócitos T auxiliares são mais associados à inflamação na EM?', ['Th1 e Th17','Apenas Th2','Nenhum. Linfócitos T não participam'],0,'Células Th1 e Th17 liberam citocinas como IFN-γ e IL-17, que favorecem a inflamação e deixam a barreira mais permeável.']
    ]
  }
};

const cap=x=>Math.max(0,Math.min(1,x));
const ease=x=>{x=cap(x);return x*x*(3-2*x)};
const mix=(a,b,t)=>a+(b-a)*t;
export const immuneStops=[.29,.61,.94];
export const immuneStage=t=>t<.41?0:t<.75?1:2;

// Motion is qualitative. Treatment affects adhesion/entry of the illustrated incoming cell.
// boundAt is used by the playable barrier: the antibody attaches mid-approach and the cell eases onto the treated path.
export function immuneFrame(time, treated, boundAt = null) {
  const t=cap(time), approach=ease(t/.32);
  let x=mix(118,295,approach),y=mix(57,83,approach);
  if(treated){
    x=mix(x,548,ease((t-.30)/.63));
    y=mix(y,mix(57,69,approach)-13*ease((t-.34)/.28),boundAt==null?1:ease((t-boundAt)/.07));
  }else{
    x+=81*ease((t-.56)/.37);
    y+=95*ease((t-.39)/.33);
  }
  return {x,y,stage:immuneStage(t),bound:treated,inTissue:y>139,priorLesion:true};
}

function shape(c,points,fill,edge=null){
  c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();
  c.fillStyle=fill;c.fill();if(edge){c.strokeStyle=edge;c.lineWidth=1.6;c.stroke()}
}
function line(c,points,ink,width=2){
  c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.strokeStyle=ink;c.lineWidth=width;c.stroke();
}
function oval(c,x,y,rx,ry,ink){
  c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fillStyle=ink;c.fill();
}
function tag(c,x,y,text,align='left',small=false){
  c.save();c.font=(small?'600 13px':'700 16px')+' DM, sans-serif';
  const width=c.measureText(text).width+12, left=align==='right'?x-width:align==='center'?x-width/2:x;
  c.fillStyle='#112f36f0';c.fillRect(left,y-15,width,20);
  c.fillStyle='#fff1ce';c.textAlign='left';c.fillText(text,left+6,y);c.restore();
}
function cell(c,x,y,kind,small=1,highlight=false){
  c.save();c.translate(x,y);c.scale(small,small);
  const isT=kind==='T',ring=[],r=isT?19:17;
  const n=isT?12:7;
  for(let i=0;i<n;i++){const a=i*2*Math.PI/n-.5;ring.push([r*Math.cos(a),(r+1)*Math.sin(a)])}
  c.save();c.translate(2.8,4);shape(c,ring,'#142f3670');c.restore();
  shape(c,ring,isT?'#d39fbc':'#79b5bc',isT?'#573c57':'#285961');
  oval(c,-2,-1,r*.65,r*.75,isT?'#925c87':'#477e91');
  line(c,[[-12,4],[-15,-3],[-10,-10]],isT?'#f6cce2':'#bde3db',1.7);
  c.font='bold 18px DM,sans-serif';c.textAlign='center';c.fillStyle='#fff5d6';c.fillText(kind,-1,6);
  if(highlight){c.setLineDash([3,4]);c.beginPath();c.arc(0,0,r+6,0,Math.PI*2);c.strokeStyle='#ffdda3';c.lineWidth=1.3;c.stroke();c.setLineDash([])}
  c.restore();
}
function antibody(c,x,y,k=1){
  c.save();c.translate(x,y);c.rotate(.15);c.scale(k,k);
  for(const [ink,width] of [['#624733',7],['#f3ca6d',4]]){
    line(c,[[0,11],[0,0],[-8,-8]],ink,width);line(c,[[0,0],[8,-8]],ink,width);
  }
  c.restore();
}
function microglia(c,x,y,active,highlight){
  c.save();c.translate(x,y);
  for(let j=0;j<8;j++){
    const a=j*.785+.18,arm=19+(j%3)*3,px=Math.cos(a)*arm,py=Math.sin(a)*arm*.66;
    const tip=[px+Math.cos(a-.26)*11,py+Math.sin(a-.26)*8];
    line(c,[[0,0],[px*.55,py*.48+3],[px,py],tip],'#825640',5);
    line(c,[[px*.55,py*.48+3],[px,py],tip],'#e2a477',2.4);
    line(c,[[px,py],[px+Math.cos(a+.70)*8,py+Math.sin(a+.70)*6]],'#e8b783',2);
  }
  shape(c,[[-12,0],[-8,-10],[3,-11],[12,-3],[8,8],[-5,10]],'#d29872','#6a5142');
  oval(c,-1,-1,5,4,'#825b56');
  if(active)for(let i=0;i<4;i++)oval(c,-21-i*6,6+(i%2)*5,2.7,2.1,'#f5bd79');
  if(highlight){c.setLineDash([3,4]);c.beginPath();c.ellipse(0,0,38,30,0,0,Math.PI*2);c.strokeStyle='#ffdda3';c.lineWidth=1.3;c.stroke();c.setLineDash([])}
  c.restore();
}
function sleeve(c,x,len,broken=false,thin=false) {
  const y=239,h=thin?11:18,points=broken?[[x,y-h],[x+len-5,y-h-1],[x+len-10,y-8],[x+len+2,y-2],[x+len-11,y+3],[x+len-3,y+h],[x,y+h]]:
    [[x,y-h],[x+len-6,y-h-1],[x+len,y-h+6],[x+len,y+h-5],[x+len-7,y+h],[x,y+h]];
  shape(c,points,thin?'#bdd0b2':'#a4c1a1','#496e64');
  oval(c,x,y,6,h,'#698d7e');oval(c,x+1,y,3.8,thin?7:11,'#ddc998');oval(c,x+1,y,2.2,thin?4:6,'#a76658');
  for(let j=10;j<len-12;j+=13)line(c,[[x+j,y-h+2],[x+j+4,y-9],[x+j+6,y+4],[x+j+4,y+h-2]],'#739a88',1.6);
  if(broken)shape(c,[[x+len-8,y-9],[x+len-1,y-26],[x+len+12,y-31],[x+len+5,y-17]],'#e3d3a8','#537a6c');
}

export function drawImmune(c,w,h,state,copy){
  const t=state.time,treated=state.treated,frame=immuneFrame(t,treated,state.boundAt??null);
  c.save();c.scale(w/620,h/290);c.lineJoin='round';c.lineCap='round';
  c.fillStyle='#754a52';c.fillRect(0,0,620,113);c.fillStyle='#305354';c.fillRect(0,128,620,162);
  for(let j=0;j<200;j++){
    const x=(j*157+21)%620,y=(j*73+9)%290;
    c.fillStyle=j%3?'#f3dfb918':'#143d401d';c.fillRect(x,y,1.6+(j%4),1);
  }
  for(let i=0;i<4;i++){
    const x=(46+i*161+t*70)%675-24,y=37+(i%2)*41;
    c.save();c.translate(x,y);c.rotate(-.21);oval(c,0,0,17,7,'#aa7070');oval(c,0,0,8,3,'#805252');c.restore();
  }
  // Endothelial cells form a continuous wall. The ligand projects into the lumen.
  for(let i=-1;i<9;i++){
    const x=i*81+12;
    shape(c,[[x,111],[x+69,109],[x+80,114],[x+73,128],[x+8,130],[x-3,122]],'#cb9b82','#805f57');
    oval(c,x+38,119,11,3.4,'#9c726e');line(c,[[x+7,113],[x+61,112]],'#eac6a3',1.5);
  }
  line(c,[[0,132],[620,132]],'#c2b38e',3);
  // VCAM-1 is anchored on endothelium; alpha4beta1 travels with the T cell.
  line(c,[[295,111],[294,104],[294,101],[290,99]],'#434e49',6);
  line(c,[[295,110],[294,103],[290,99]],'#f2d8a2',3);
  line(c,[[302,103],[321,90],[356,90]],'#e5caa3',1);tag(c,357,94,'VCAM-1','left',true);
  for(const x of [21,88,155,222,289,424,491,558])sleeve(c,x,56,x===289);
  // The exposed axon and folded old edge exist in both versions.
  for(const [a,b] of [[0,16],[78,87],[144,154],[211,221],[278,288],[336,423],[480,490],[547,557],[614,620]]){
    line(c,[[a,239],[b,239]],'#8a5c55',10);line(c,[[a,236],[b,236]],'#d29175',4);
  }
  const active=!treated&&t>.68;
  if(active){
    for(let i=0;i<5;i++){const k=ease((t-.68)/.27),x=361+i*6,y=228-k*(9+(i%3)*7);shape(c,[[x-3,y],[x+1,y-3],[x+4,y-1],[x+1,y+2]],'#c1cba7')}
  }
  microglia(c,465,188,active,state.role===2);
  const bTravel=ease((t-.34)/.63);
  const bx=treated?mix(74,177,bTravel):mix(74,240,bTravel);
  const by=treated?64:mix(67,161,bTravel);
  cell(c,bx,by,'B',.8,state.role===1);
  if(treated)antibody(c,bx+13,by+7,.48);
  cell(c,frame.x,frame.y,'T',1,state.role===0);
  const ax=frame.x-4,ay=frame.y+17;
  line(c,[[ax-5,ay-2],[ax-2,ay+4],[ax,ay+3]],'#a9dec7',3);
  line(c,[[ax+4,ay-2],[ax+2,ay+4],[ax,ay+3]],'#e7f4c7',2.7);
  if(treated)antibody(c,ax+5,ay+10,.74);
  if(t<.42){
    line(c,[[ax-3,ay],[ax-37,ay+9],[ax-64,ay+9]],'#d5e6c4',1);
    tag(c,ax-37,ay+12,'α4β1','right',true);
  }
  tag(c,9,22,copy.blood);tag(c,9,155,copy.brain);
  tag(c,609,125,copy.wall,'right',true);
  if(t>.42&&t<.76)tag(c,frame.x+3,frame.y-28,treated?copy.passing:copy.crossing,'center',true);
  else if(treated&&t<.42)tag(c,610,23,copy.bound,'right',true);
  line(c,[[374,244],[387,265],[400,265]],'#e5caa3',1);tag(c,402,271,copy.old,'left',true);
  tag(c,12,272,copy.myelin,'left',true);
  c.restore();
}


// ---- Playable barrier for the season. Same paper pieces, laid out for any arena size. ----
export const sleeveX=k=>21+67*k;
export function barrierView(w,h){
  let s=Math.max(w/620,Math.min(h/330,1.25));
  if(290*s>h)s=h/290;
  return {s,width:w/s,top:Math.max(0,(h-290*s)/2)};
}
function label(c,x,y,text,align,k){c.save();c.translate(x,y);c.scale(k,k);tag(c,0,0,text,align,true);c.restore();}
export function drawBarrier(c,w,h,g,copy){
  const {s,width,top}=barrierView(w,h),k=Math.max(.85,Math.min(1.2,s))/s;
  c.save();c.fillStyle='#754a52';c.fillRect(0,0,w,top+121*s);c.fillStyle='#305354';c.fillRect(0,top+121*s,w,h);
  c.translate(0,top);c.scale(s,s);c.lineJoin='round';c.lineCap='round';
  for(let j=0;j<200*Math.ceil(width/620);j++){
    const x=(j*157+21)%(620*Math.ceil(width/620)),y=(j*73+9)%290;
    c.fillStyle=j%3?'#f3dfb918':'#143d401d';c.fillRect(x,y,1.6+(j%4),1);
  }
  for(let i=0;i<Math.ceil(width/160)+1;i++){
    const x=(46+i*161+g.t*70)%(width+55)-24,y=37+(i%2)*41;
    c.save();c.translate(x,y);c.rotate(-.21);oval(c,0,0,17,7,'#aa7070');oval(c,0,0,8,3,'#805252');c.restore();
  }
  for(let i=-1;i*81+12<width+10;i++){
    const x=i*81+12;
    shape(c,[[x,111],[x+69,109],[x+80,114],[x+73,128],[x+8,130],[x-3,122]],'#cb9b82','#805f57');
    oval(c,x+38,119,11,3.4,'#9c726e');line(c,[[x+7,113],[x+61,112]],'#eac6a3',1.5);
  }
  line(c,[[0,132],[width,132]],'#c2b38e',3);
  for(const x of g.sites){
    line(c,[[x,111],[x-1,104],[x-1,101],[x-5,99]],'#434e49',6);
    line(c,[[x,110],[x-1,103],[x-5,99]],'#f2d8a2',3);
  }
  // The axon runs under every sleeve. Where a sleeve is missing, it is exposed.
  line(c,[[0,239],[width,239]],'#8a5c55',10);line(c,[[0,236],[width,236]],'#d29175',4);
  for(let n=0;sleeveX(n)<width;n++){
    const state=n===5?'gone':g.sleeves[n]??(n===4?'old':'ok');
    if(state!=='gone')sleeve(c,sleeveX(n),56,state==='old',state==='thin');
  }
  for(const a of g.attacks){
    const u=ease(a.age/.8);
    for(let i=0;i<5;i++){const x=a.x-12+i*6,y=228-u*(9+(i%3)*7);shape(c,[[x-3,y],[x+1,y-3],[x+4,y-1],[x+1,y+2]],'#c1cba7')}
  }
  microglia(c,Math.min(465,width-70),188,g.attacks.some(a=>a.age<1.6),false);
  for(const cellNow of g.cells){
    if(cellNow.state==='wait'||cellNow.state==='out')continue;
    const {x,y}=cellNow,bound=cellNow.state==='bound';
    cell(c,x,y,'T',1,false);
    line(c,[[x-9,y+15],[x-6,y+21],[x-4,y+20]],'#a9dec7',3);line(c,[[x,y+15],[x-2,y+21],[x-4,y+20]],'#e7f4c7',2.7);
    if(bound)antibody(c,x+1,y+27,.74);
  }
  // Antibody charges. A recharging one is drawn faint.
  for(let i=0;i<g.maxCharges;i++){
    c.save();c.globalAlpha=i<g.charges?1:i===g.charges?.22+.5*g.recharge:.18;antibody(c,width-22-i*24,26,.95);c.restore();
  }
  label(c,9,22,copy.blood,'left',k);label(c,9,155,copy.brain,'left',k);label(c,9,207,copy.myelin,'left',k);
  if(g.sites.length)label(c,g.sites[0]+10,97,'VCAM-1','left',k);
  c.restore();
}
