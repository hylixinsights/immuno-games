// All narrative and movement rules are independent of the rendering mode.
export const say = (en, pt) => ({ en, pt });
const t = say;
export const chapters = ['river','node','recognition','garden','marrow','recall'];
export const titles = {
  river: t('The red river','O rio vermelho'),
  node: t('A thousand shapes','O linfonodo das mil formas'),
  recognition: t('Three notes','As três notas'),
  garden: t('The sisters’ garden','O jardim das irmãs'),
  marrow: t('Back to the marrow','A medula, de novo'),
  recall: t('Years later','Anos depois'),
  tonsil: t('Under the vellum','Sob o papel vegetal')
};
export const descriptions = {
  river:t('Between the red cells, a little traveler drifts downstream. A folded doorway waits on the opposite page.','Entre as hemácias, uma pequena viajante segue a corrente. Na outra página, uma porta de papel espera por ela.'),
  node:t('Beneath the folds of a lymph node, two cells see different things in the very same particle.','Nas dobras de um linfonodo, duas células veem coisas diferentes na mesma partícula.'),
  recognition:t('A familiar outline in a crowded follicle. Listen closely when the pieces meet.','Um contorno familiar no meio de um folículo movimentado. Escute quando as peças se encontram.'),
  garden:t('One B cell becomes a family. Open the paper fan and spend a little time with its daughters.','Uma célula B dá origem a uma família. Abra o leque de papel e acompanhe suas filhas.'),
  marrow:t('The place where your story began has a new resident. Follow the ribbons to find her.','O lugar onde sua história começou tem uma nova moradora. Siga as fitas para encontrá-la.'),
  recall:t('Years have passed. You have been in these folds before. Where will you stop this time?','Os anos passaram. Você já andou por essas dobras. Onde vai parar desta vez?'),
  tonsil:t('An old acquaintance has kept something between her pages.','Uma velha conhecida guarda algo entre suas páginas.')
};
export const shapes = [
  t('Trefoil','Trevo'),t('Crescent','Lua crescente'),t('Kite','Pipa'),
  t('Fan','Leque'),t('Ring','Anel')
];
export const marks = [t('Sunburst','Sol'),t('Twin strokes','Dois traços'),t('Scalloped arch','Arco ondulado')];
export const notes = {
  origin:[t('Before the river','Antes do rio'),t('You developed in the bone marrow. As a transitional B cell you passed through the spleen and finished maturing. Now you travel with many copies of the same B-cell receptor (BCR).','Você se desenvolveu na medula óssea. Como célula B de transição, passou pelo baço e completou a maturação. Agora viaja com muitas cópias de um mesmo receptor de célula B (BCR).'),'origin'],
  hev:[t('Two ways into a node','Dois caminhos para o linfonodo'),t('Your B cell crossed a high endothelial venule from the blood. The particles at the entrance arrived by afferent lymph.','Sua célula B atravessou uma vênula de endotélio alto e saiu do sangue. As partículas na entrada chegaram pela linfa aferente.'),'tab'],
  specificity:[t('What Mica saw','O que Mica viu'),t('A macrophage held an intact particle where B cells could examine it. Mica bound a shape your own receptor let go. Each clone carries its own binding sites.','Um macrófago reteve uma partícula intacta onde as células B podiam examiná-la. Mica se ligou a uma forma que seu receptor deixou passar. Cada clone tem seus próprios sítios de ligação.'),'friend'],
  cxcl13:[t('The dotted trail','A trilha pontilhada'),t('The chemokine CXCL13 attracts B cells expressing CXCR5 toward the follicle. The dots show a scent trail your cell can sense.','A quimiocina CXCL13 atrai células B que expressam CXCR5 para o folículo. Os pontos representam uma trilha química que sua célula consegue perceber.'),'trail'],
  capture:[t('A familiar shape','Uma forma familiar'),t('Your B-cell receptor bound an exposed part of an intact protein antigen. Once bound, the cell drew the protein inside. Three notes mark the moment of recognition.','Seu receptor se ligou a uma parte exposta de um antígeno proteico intacto. A célula então trouxe a proteína para dentro. Três notas marcam esse encontro.'),'antigen'],
  present:[t('The piece in the cradle','O fragmento no suporte'),t('Inside the cell, the protein was cut into peptides. One peptide traveled back to the surface bound to MHC class II. A primed helper T cell can recognize this particular peptide–MHC II complex.','Dentro da célula, a proteína foi cortada em peptídeos. Um deles voltou à superfície ligado ao MHC de classe II. Uma célula T auxiliar previamente ativada pode reconhecer esse complexo peptídeo–MHC II.'),'mhc'],
  help:[t('Two parts of one protein','Duas partes de uma proteína'),t('The B cell captured the intact protein. The T cell recognized a peptide from it on MHC II. Their meeting at the T–B border supplied help, including contact between CD40 and CD40L.','A célula B capturou a proteína intacta. A célula T reconheceu um peptídeo dessa proteína no MHC II. Na fronteira T–B, a T ofereceu ajuda, incluindo o contato entre CD40 e CD40L.'),'helper'],
  mutation:[t('The family resemblance','O traço de família'),t('Daughters divided in the dark zone of the germinal center. Somatic hypermutation introduced small differences in their receptors. All kept the paper mark of their shared ancestor.','As filhas se dividiram na zona escura do centro germinativo. A hipermutação somática introduziu pequenas diferenças nos receptores. Todas guardaram a marca de papel da ancestral comum.'),'fan'],
  selection:[t('A turn in the light','Uma volta na zona clara'),t('In the light zone, follicular dendritic cells displayed intact antigen. B cells that captured it could present peptide on MHC II and compete for help from follicular helper T cells (Tfh).','Na zona clara, células dendríticas foliculares exibiram antígeno intacto. As células B que o capturaram puderam apresentar peptídeo no MHC II e disputar a ajuda das células T auxiliares foliculares (Tfh).'),'fdc'],
  il21:[t('The note from a Tfh cell','A nota de uma Tfh'),t('IL-21 is one of the cytokines a Tfh cell can deliver. Together with contact signals, it supports the B-cell response and differentiation.','A IL-21 é uma das citocinas que uma Tfh pode oferecer. Em conjunto com sinais de contato, ela favorece a resposta e a diferenciação da célula B.'),'signal'],
  plasma:[t('The marrow sister','A irmã da medula'),t('A daughter traveled through the blood as a plasmablast and found a survival niche in the marrow. As a long-lived plasma cell, she can keep secreting antibodies even after the antigen has gone.','Uma filha viajou pelo sangue como plasmablasto e encontrou um nicho de sobrevivência na medula. Como plasmócito de longa vida, ela pode continuar secretando anticorpos mesmo depois que o antígeno desaparece.'),'plasma'],
  memory:[t('A sister who remembers','A irmã que lembra'),t('Another daughter became a long-lived memory B cell. She kept receptors on her surface and could respond again on meeting a related antigen.','Outra filha se tornou uma célula B de memória de longa vida. Ela manteve receptores na superfície e pode responder novamente ao reencontrar um antígeno relacionado.'),'memory'],
  recall:[t('The second meeting','O segundo encontro'),t('On re-exposure, the memory B cell expanded. Some of her daughters became antibody-secreting cells, contributing to a faster secondary response.','Na reexposição, a célula B de memória se expandiu. Algumas filhas se tornaram células secretoras de anticorpos, contribuindo para uma resposta secundária mais rápida.'),'antibody'],
  ebv:[t('A tracing that stays','Um desenho que permanece'),t('Epstein–Barr virus (EBV) can infect B cells and persist latently in memory B cells. The tracing represents the viral genome that persists inside Mica.','O vírus Epstein–Barr (EBV) pode infectar células B e persistir de forma latente em células B de memória. O desenho representa o genoma viral que permanece dentro de Mica.'),'vellum']
};
export const firstSteps = {river:'drift',node:'arrived',recognition:'search',garden:'closed',marrow:'visit',recall:'search',tonsil:'hello'};
const validSteps = {river:['drift'],node:['arrived','witness','witnessed'],recognition:['search','captured','cut','presented','helped'],garden:['closed','choose','trial','offer','helped'],marrow:['visit','ribbons','branches'],recall:['search','found','response','end'],tonsil:['hello','flap','trace','remains']};
function shuffled(n,random) {
  const list=Array.from({length:n},(_,i)=>i);
  for(let i=n-1;i>0;i--){const j=Math.floor(random()*(i+1));[list[i],list[j]]=[list[j],list[i]];}
  return list;
}
export function newJourney(random=Math.random) {
  const order=shuffled(5,random),target=Math.floor(random()*3),offset=1+Math.floor(random()*4);
  return {version:1,name:'Luma',mark:0,target,order,again:[...order.slice(offset),...order.slice(0,offset)],stage:'river',from:'river',unlocked:0,steps:{...firstSteps},notes:[],met:false,started:false,completed:false,selected:0};
}
export function restore(data) {
  if(!data||data.version!==1||!data.started)return null;
  if(![0,1,2].includes(data.target)||!Array.isArray(data.order)||!Array.isArray(data.again))return null;
  const validOrder=a=>a.length===5&&[0,1,2,3,4].every(i=>a.includes(i));
  if(!validOrder(data.order)||!validOrder(data.again))return null;
  const s=newJourney(()=>0.4);
  Object.assign(s,{started:true,target:data.target,order:data.order,again:data.again,mark:[0,1,2].includes(data.mark)?data.mark:0,name:String(data.name||'Luma').slice(0,28),unlocked:Math.max(0,Math.min(5,Math.trunc(Number(data.unlocked)||0))),completed:!!data.completed,met:!!data.met,selected:[0,1,2].includes(data.selected)?data.selected:0});
  const places=chapters.slice(0,s.unlocked+1);
  for(const key of Object.keys(firstSteps)){const v=data.steps?.[key];if(validSteps[key].includes(v))s.steps[key]=v;}
  s.from=places.includes(data.from)?data.from:(places.includes('node')?'node':'river');
  s.stage=places.includes(data.stage)||(data.stage==='tonsil'&&s.unlocked>=1)?data.stage:places.at(-1);
  s.notes=Array.isArray(data.notes)?[...new Set(data.notes.filter(n=>Object.hasOwn(notes,n)))]:[];
  return s;
}
export function collect(s,id){if(!s.notes.includes(id))s.notes.push(id);}
export function visit(s,stage) {
  if(stage==='tonsil'){if(s.unlocked<1)return false;if(s.stage!=='tonsil')s.from=s.stage;}
  else if(!chapters.includes(stage)||chapters.indexOf(stage)>s.unlocked)return false;
  s.stage=stage;return true;
}
function advance(s,stage){s.unlocked=Math.max(s.unlocked,chapters.indexOf(stage));visit(s,stage);}
export const storyLines={
  drift:t('The current nudges {name} between the red cells. On the far bank, a paper tab sticks out. Where would you like to stop?','A corrente leva {name} entre as hemácias. Na outra margem, uma lingueta de papel está à mostra. Onde você quer parar?'),
  arrived:t('A macrophage holds a particle that drifted in with the lymph. Mica is just behind you. Stay a moment and see what catches her eye.','Um macrófago segura uma partícula que chegou com a linfa. Mica vem logo atrás. Fique um instante e veja o que chama a atenção dela.'),
  witness:t('The particle slips past your receptor. Behind you, Mica turns and crosses the page toward the same shape.','A partícula escapa do seu receptor. Atrás de você, Mica se vira e atravessa a página em direção à mesma forma.'),
  witnessed:t('Mica stops. Her receptor holds the particle you passed. A dotted trail threads its way deeper into the follicle.','Mica para. Seu receptor prende a partícula que você deixou passar. Uma trilha pontilhada leva ao interior do folículo.'),
  recognition_search:t('The follicle is crowded with folded shapes. One has a contour you have seen before. Bring your receptor close to a shape.','O folículo está cheio de formas dobradas. Você já viu o contorno de uma delas. Aproxime seu receptor de uma forma.'),
  captured:t('Three notes. The intact protein is held against your membrane. Lift the fold to follow it inside.','Três notas. A proteína intacta está presa à sua membrana. Levante a dobra para acompanhá-la até o interior.'),
  cut:t('The protein has unfolded into short peptide strips inside a vesicle. Set one in the groove of MHC II and follow it to the surface.','Dentro de uma vesícula, a proteína foi cortada em pequenos peptídeos. Acomode um deles no sulco do MHC II e acompanhe-o até a superfície.'),
  presented:t('At the edge of the T-cell zone, a helper T cell pauses beside you. Her receptor meets the peptide nestled in your MHC II.','Na borda da zona T, uma célula T auxiliar para ao seu lado. O receptor dela encontra o peptídeo acomodado no seu MHC II.'),
  recognition_helped:t('The helper T cell takes your cell by the fold. With contact and signals, the family can begin to grow.','A T auxiliar segura uma dobra da sua célula. Com esse contato e os sinais que recebe, a família pode começar a crescer.'),
  closed:t('Your cell divides in the dark zone. Unfold the paper fan and look at the receptors its daughters now carry.','Sua célula se divide na zona escura. Abra o leque de papel e observe os receptores que suas filhas carregam.'),
  choose:t('Three sisters, one family mark. Choose one to follow into the light zone, where a follicular dendritic cell is displaying antigen.','Três irmãs, uma marca de família. Escolha uma para acompanhar até a zona clara, onde uma célula dendrítica folicular exibe antígeno.'),
  trial:t('{sister} reaches for the intact antigen on a branching follicular dendritic cell. Visit the branch to see how firmly it holds.','{sister} estende o receptor até o antígeno intacto em uma célula dendrítica folicular ramificada. Visite o ramo para ver a força dessa ligação.'),
  offer:t('This receptor held long enough to capture protein. Carry its peptide on MHC II to a follicular helper T cell.','O contato durou o suficiente para capturar a proteína. Leve um peptídeo dela no MHC II até uma célula T auxiliar folicular.'),
  garden_helped:t('A soft note passes from the Tfh cell to your sister. You can touch the signal, follow another sister, or visit the marrow.','Uma nota suave passa da Tfh para sua irmã. Você pode tocar no sinal, acompanhar outra irmã ou visitar a medula.'),
  marrow_visit:t('One sister traveled here through the blood as a plasmablast. Find her among the marrow folds, settled into a sheltered niche.','Uma das irmãs chegou pelo sangue como plasmablasto. Encontre-a entre as dobras da medula, instalada em um nicho protegido.'),
  ribbons:t('Your sister is a long-lived plasma cell now. Antibodies drift from her niche. Across the fold, another sister still carries her receptors.','Sua irmã agora é um plasmócito de longa vida. Anticorpos saem de seu nicho. Do outro lado da dobra, outra irmã ainda carrega seus receptores.'),
  branches:t('Two branches share your first paper mark. Stay with the plasma cell or turn the years with the daughter who became a memory B cell.','Dois ramos guardam sua primeira marca de papel. Fique com o plasmócito ou avance no tempo com a filha que se tornou uma célula B de memória.'),
  recall_search:t('New faces in an old lymph node. The memory B cell slows as she passes the display. Where will you stop?','Rostos novos em um velho linfonodo. A célula B de memória diminui o passo diante das partículas. Onde você vai parar?'),
  found:t('You stopped at the same contour, years later. The three notes return. Unfold this last branch of the family.','Anos depois, você parou diante do mesmo contorno. As três notas voltam. Desdobre este último ramo da família.'),
  response:t('The memory cell divides. Some daughters become plasma cells and release antibodies into the current. Your first mark is still there.','A célula de memória se divide. Algumas filhas viram plasmócitos e liberam anticorpos na corrente. A primeira marca continua ali.'),
  end:t('A shape on the first page, a meeting on the last. The family tree on the back cover keeps both moments. You can visit any part of the book again.','Uma forma na primeira página, um reencontro na última. A árvore na contracapa guarda os dois momentos. Você pode revisitar qualquer parte do livro.'),
  hello:t('Mica, the B cell with the coral sash, is resting in a tonsil. The corner of her page looks a little different.','Mica, a célula B da faixa coral, descansa em uma amígdala. Um canto da página dela parece um pouco diferente.'),
  flap:t('Mica lifts the corner. Underneath is a sheet of tracing paper so thin you can see two pages at once.','Mica levanta o canto. Por baixo aparece uma folha de papel vegetal tão fina que dá para ver duas páginas de uma vez.'),
  trace:t('There is a drawing on the tracing paper. Turn one more leaf with Mica and watch the mark.','Há um desenho no papel vegetal. Vire mais uma folha com Mica e observe a marca.'),
  remains:t('The drawing is still there. It stands for Epstein–Barr virus, which can persist quietly inside a B cell. Mica keeps her tracing when the book moves on.','O desenho continua ali. Ele representa o vírus Epstein–Barr, que pode persistir silenciosamente dentro de uma célula B. Mica guarda a folha quando o livro segue adiante.')
};
export function line(s){
  const step=s.steps[s.stage];return storyLines[s.stage+'_'+step]||storyLines[step];
}
const names = {
  origin:t('Open the first diary leaf','Abrir a primeira folha do diário'),rbc:t('Drift with the red cells','Seguir as hemácias'),
  friend:t('Meet Mica','Conhecer Mica'),'node-tab':t('Pull the node tab','Puxar a aba do linfonodo'),
  macrophage:t('Visit the macrophage','Visitar o macrófago'),decoy:t('Examine the particle','Examinar a partícula'),
  trail:t('Touch the dotted trail','Tocar na trilha pontilhada'),tonsil:t('Visit the tonsil','Visitar a amígdala'),
  follicle:t('Enter the follicle','Entrar no folículo'),membrane:t('Unfold the membrane','Desdobrar a membrana'),
  mhc:t('Lift the peptide to the surface','Levar o peptídeo à superfície'),helper:t('Meet the helper T cell','Encontrar a T auxiliar'),
  garden:t('Open the sisters’ garden','Abrir o jardim das irmãs'),fan:t('Unfold the sisters','Desdobrar as irmãs'),
  'sister-0':t('Follow Fern','Acompanhar Flora'),'sister-1':t('Follow Iris','Acompanhar Íris'),'sister-2':t('Follow Sol','Acompanhar Sol'),
  fdc:t('Reach for the displayed antigen','Alcançar o antígeno exposto'),choose:t('Visit the other sisters','Visitar as outras irmãs'),
  tfh:t('Bring the peptide to a Tfh','Levar o peptídeo à Tfh'),il21:t('Listen to the signal','Escutar o sinal'),
  marrow:t('Travel to the marrow','Viajar até a medula'),plasma:t('Visit the marrow sister','Visitar a irmã da medula'),
  memory:t('Meet the memory sister','Encontrar a irmã de memória'),antibody:t('Follow an antibody','Acompanhar um anticorpo'),
  years:t('Turn the years','Avançar alguns anos'),family:t('Open the family tree','Abrir a árvore da família'),
  'late-mica':t('Sit with Mica','Sentar com Mica'),expand:t('Unfold the memory branch','Desdobrar o ramo de memória'),
  finish:t('Close the last fold','Fechar a última dobra'),vellum:t('Lift the tracing paper','Levantar o papel vegetal'),
  leaf:t('Turn Mica’s leaf','Virar a folha de Mica'),back:t('Return to the journey','Voltar à jornada')
};
const brief = {
  rbc:t('A red cell tilts edge-on. Through the gap you glimpse the folded vessels on the other bank. The current turns it face-up again.','Uma hemácia gira de lado. Pela fresta, você vislumbra os vasos dobrados da outra margem. A corrente a vira de novo.'),
  friend:t('A B cell with a coral sash falls into step. Her name is Mica. You may see her again in the folds ahead.','Uma célula B de faixa coral se aproxima. O nome dela é Mica. Talvez vocês voltem a se ver nas próximas dobras.'),
  macrophage:t('The macrophage holds intact particles near the lymph-filled sinus. A B cell can touch their exposed surfaces here.','O macrófago segura partículas intactas junto ao seio cheio de linfa. Aqui as células B podem tocar as superfícies expostas.'),
  mismatch:t('Your receptor brushes the fold. The particle slips free, and the rest of the display waits.','Seu receptor roça a dobra. A partícula se solta. As outras formas continuam ali.'),
  looseEn:t('Fern’s receptor brushes the antigen, then slips. The little piece stays on the branch. Two other sisters are waiting by the fan.','O receptor de Flora roça o antígeno e escapa. A pequena peça fica no ramo. Outras duas irmãs esperam ao lado do leque.'),
  moderate:t('Iris holds the antigen just long enough to take it up. She can now display a peptide from that protein.','Íris mantém o antígeno preso o suficiente para capturá-lo. Agora pode exibir um peptídeo dessa proteína.'),
  strong:t('Sol holds on firmly and takes up the protein. A peptide from it can now be shown to a Tfh cell.','Sol se liga com firmeza e captura a proteína. Agora pode mostrar um peptídeo dela a uma Tfh.'),
  antibody:t('Look at the ends of the Y. Their binding sites resemble the receptor that first recognized the shape. The antibody floats on without the cell.','Observe as pontas do Y. Seus sítios de ligação lembram o receptor que reconheceu a forma pela primeira vez. O anticorpo segue livre, sem a célula.'),
  late:t('The coral sash gives her away. Mica is a memory B cell now. When she lifts her vellum, the EBV tracing is still there.','A faixa coral entrega quem ela é. Mica agora é uma célula B de memória. Ela levanta o papel vegetal e o desenho do EBV continua ali.'),
  familiar:t('Mica recognizes you by the paper mark. Her folded page is waiting back in the tonsil.','Mica reconhece você pela marca de papel. A página dobrada dela está esperando na amígdala.')
};
function o(id,kind,x,z,variant){return {id,kind,x,z,variant,label:names[id]};}
function antigenRow(s){
  const layout=[[-.73,-.22],[-.41,.40],[-.05,-.33],[.33,.36],[.72,-.16]];
  return (s.stage==='recall'?s.again:s.order).map((v,i)=>({...o('ant-'+v,'antigen',...layout[i],v),label:shapes[v]}));
}
export function objects(s){
  const step=s.steps[s.stage], target=s.target;
  switch(s.stage){
    case 'river':return [o('origin','origin',-.73,-.25),o('rbc','rbc',-.48,.37),o('friend','friend',-.07,.08),o('node-tab','tab',.61,.12)];
    case 'node':{
      const arr=[o('macrophage','macrophage',-.55,-.15),o('trail','trail',.05,.41),o('tonsil','tonsil',.67,-.43)];
      if(step!=='witnessed')arr.splice(1,0,o('decoy','antigen',-.31,.12,(target+1)%3));
      else arr.push(o('follicle','tab',.58,.29));return arr;
    }
    case 'recognition':
      if(step==='search')return antigenRow(s);
      if(step==='captured')return [o('membrane','membrane',.22,.10,target)];
      if(step==='cut')return [o('mhc','mhc',.05,.14)];
      if(step==='presented')return [o('helper','helper',.42,.05)];
      return [o('garden','tab',.52,.13)];
    case 'garden':
      if(step==='closed')return [o('fan','fan',.16,.15)];
      if(step==='choose')return [o('sister-0','sister',-.47,.17,0),o('sister-1','sister',.03,-.05,1),o('sister-2','sister',.52,.19,2)];
      if(step==='trial')return [o('fdc','fdc',.32,.08),o('choose','fan',-.48,.15)];
      if(step==='offer')return [o('tfh','helper',.42,.08),o('choose','fan',-.48,.15)];
      return [o('il21','signal',.23,.03),o('choose','fan',-.48,.15),o('marrow','tab',.65,.32)];
    case 'marrow':{
      const arr=[o('plasma','plasma',-.40,.05)];
      if(step!=='visit')arr.push(o('antibody','antibody',-.04,-.30,target),o('memory','memory',.40,.13));
      if(step==='branches')arr.push(o('years','years',.68,-.32));return arr;
    }
    case 'recall':{
      const extra=o('late-mica','friend',.74,.68);
      if(step==='search')return [...antigenRow(s),extra];
      if(step==='found')return [o('expand','fan',.1,.15),extra];
      if(step==='response')return [o('antibody','antibody',-.34,-.12,target),o('finish','years',.46,.11),extra];
      return [o('family','origin',-.34,.06),o('tonsil','tonsil',.40,-.16),extra];
    }
    case 'tonsil':{
      const obj=step==='hello'?o('friend','friend',-.32,.12):step==='flap'?o('vellum','vellum',.01,.14):step==='trace'?o('leaf','vellum',.27,.05):o('friend','friend',.06,.18);
      return [obj,o('back','tab',.67,-.22)];
    }
    default:return [];
  }
}
// A response can be a momentary observation, a notebook leaf, or an audible event.
export function act(s,id){
  const stage=s.stage,step=s.steps[stage],set=v=>{s.steps[stage]=v;},out={};
  if(id==='@watch'&&stage==='node'&&step==='arrived'){set('witness');s.met=true;return out;}
  if(id==='@seen'&&stage==='node'&&step==='witness'){set('witnessed');collect(s,'specificity');return out;}
  if(!objects(s).some(a=>a.id===id))return out;
  if(id.startsWith('ant-')){
    if(Number(id.slice(4))!==s.target){out.message=brief.mismatch;out.sound='brush';return out;}
    out.sound='motif';
    if(stage==='recall'){set('found');}else{set('captured');collect(s,'capture');}
    return out;
  }
  if(id.startsWith('sister-')){s.selected=Number(id.slice(-1));set('trial');return out;}
  switch(id){
    case 'origin':collect(s,'origin');out.leaf='origin';break;
    case 'rbc':out.message=brief.rbc;break;
    case 'friend':s.met=true;if(stage==='tonsil'){if(step==='hello')set('flap');else out.leaf='ebv';}else out.message=brief.friend;break;
    case 'node-tab':collect(s,'hev');advance(s,'node');break;
    case 'macrophage':out.message=brief.macrophage;break;
    case 'decoy':if(step==='arrived'){set('witness');s.met=true;}break;
    case 'trail':collect(s,'cxcl13');out.leaf='cxcl13';break;
    case 'tonsil':visit(s,'tonsil');break;
    case 'follicle':advance(s,'recognition');break;
    case 'membrane':set('cut');break;
    case 'mhc':set('presented');collect(s,'present');break;
    case 'helper':set('helped');collect(s,'help');break;
    case 'garden':advance(s,'garden');break;
    case 'fan':set('choose');collect(s,'mutation');break;
    case 'choose':set('choose');break;
    case 'fdc':
      collect(s,'selection');
      if(s.selected===0){set('choose');out.message=brief.looseEn;}
      else{set('offer');out.message=s.selected===1?brief.moderate:brief.strong;}
      break;
    case 'tfh':set('helped');out.sound='signal';break;
    case 'il21':collect(s,'il21');out.leaf='il21';out.sound='signal';break;
    case 'marrow':advance(s,'marrow');break;
    case 'plasma':collect(s,'plasma');if(step==='visit')set('ribbons');else out.leaf='plasma';break;
    case 'antibody':out.message=brief.antibody;break;
    case 'memory':collect(s,'memory');if(step==='ribbons')set('branches');else out.leaf='memory';break;
    case 'years':advance(s,'recall');out.sound='years';break;
    case 'late-mica':out.message=s.notes.includes('ebv')?brief.late:brief.familiar;break;
    case 'expand':set('response');collect(s,'recall');break;
    case 'finish':set('end');s.completed=true;out.ending=true;break;
    case 'family':out.family=true;break;
    case 'vellum':set('trace');break;
    case 'leaf':set('remains');collect(s,'ebv');break;
    case 'back':visit(s,s.from);break;
  }
  return out;
}
export function sceneConfig(s,lang,reduced){
  const tags=[...(s.unlocked>=1?['nodeOpen']:[]),...(s.notes.includes('ebv')?['ebv']:[]),...(s.notes.includes('plasma')?['antibody']:[])];
  return {stage:s.stage,step:s.steps[s.stage],target:s.target,mark:s.mark,selected:s.selected,tags,lang,reduced,objects:objects(s).map(o=>({...o,label:o.label[lang],mark:s.mark}))};
}
