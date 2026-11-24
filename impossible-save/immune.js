// Interactive paper cross-section of a CNS venule. Time belongs to this diagram,
// independently of the penalty. Both conditions begin with the same prior lesion.
export const immuneSources = [
  'https://www.nature.com/articles/s41392-025-02415-4',
  'https://dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=c5fdde91-1989-4dd2-9129-4f3323ea2962',
  'https://pubmed.ncbi.nlm.nih.gov/16510744/',
  'https://pubmed.ncbi.nlm.nih.gov/33503348/'
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
    safety:'Natalizumab is a disease-modifying treatment for relapsing forms of MS. It requires clinical monitoring, including for the risk of progressive multifocal leukoencephalopathy (PML).',
    refs:['Review · immune cells and MS lesions','Prescribing information · natalizumab and α4 integrin','AFFIRM trial · relapses and new MRI lesions','B cells · antigen presentation to T cells']
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
    safety:'O natalizumabe modifica a atividade inflamatória nas formas recorrentes da EM. O tratamento exige acompanhamento clínico, inclusive pelo risco de leucoencefalopatia multifocal progressiva (LEMP).',
    refs:['Revisão · células imunes e lesões na EM','Bula · natalizumabe e integrina α4','Ensaio AFFIRM · surtos e lesões novas na ressonância','Células B · apresentação de antígenos a linfócitos T']
  }
};

const cap=x=>Math.max(0,Math.min(1,x));
const ease=x=>{x=cap(x);return x*x*(3-2*x)};
const mix=(a,b,t)=>a+(b-a)*t;
export const immuneStops=[.29,.61,.94];
export const immuneStage=t=>t<.41?0:t<.75?1:2;

// Motion is qualitative. Treatment affects adhesion/entry of the illustrated incoming cell.
export function immuneFrame(time, treated) {
  const t=cap(time), approach=ease(t/.32);
  let x=mix(118,295,approach),y=mix(57,83,approach);
  if(treated){
    x=mix(x,548,ease((t-.30)/.63));
    y=mix(57,69,approach)-13*ease((t-.34)/.28);
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
function sleeve(c,x,len,broken=false) {
  const y=239,h=18,points=broken?[[x,y-h],[x+len-5,y-h-1],[x+len-10,y-8],[x+len+2,y-2],[x+len-11,y+3],[x+len-3,y+h],[x,y+h]]:
    [[x,y-h],[x+len-6,y-h-1],[x+len,y-h+6],[x+len,y+h-5],[x+len-7,y+h],[x,y+h]];
  shape(c,points,'#a4c1a1','#496e64');
  oval(c,x,y,6,h,'#698d7e');oval(c,x+1,y,3.8,11,'#ddc998');oval(c,x+1,y,2.2,6,'#a76658');
  for(let j=10;j<len-12;j+=13)line(c,[[x+j,y-h+2],[x+j+4,y-9],[x+j+6,y+4],[x+j+4,y+h-2]],'#739a88',1.6);
  if(broken)shape(c,[[x+len-8,y-9],[x+len-1,y-26],[x+len+12,y-31],[x+len+5,y-17]],'#e3d3a8','#537a6c');
}

export function drawImmune(c,w,h,state,copy){
  const t=state.time,treated=state.treated,frame=immuneFrame(t,treated);
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
