import {chapters,titles,descriptions,shapes,marks,notes,newJourney,restore,visit,line,objects,act,sceneConfig} from './story.js';
import {icon,sigil,propIcon,shapeIcon,markIcon,cellPlate} from './icons.js';
import {noteSketch,createSound} from './audio.js';
import {createFlatArt} from './flat-art.js';

const $=id=>document.getElementById(id);
const str=(s)=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const key='immuno.shape-book.v1',prefsKey=key+'.preferences';
function read(key){try{return JSON.parse(localStorage.getItem(key));}catch{return null;}}
function write(key,value){try{localStorage.setItem(key,JSON.stringify(value));}catch{}}
const stored=read(prefsKey)||{};
let lang=stored.lang==='pt'?'pt':'en',soundOn=stored.sound!==false,flatPreference=stored.flat===true;
const t=(en,pt)=>lang==='pt'?pt:en;
let state=restore(read(key))||newJourney(),draft=state.started?null:state,screen='cover',modal=null,observation=null;
let flat=null,world=null,loadingWorld=false,worldFailed=false,renderTicket=0,activeStage=null,timer=0,motifTimer=0,flipTimer=0,lastMotif=false;
let approach=null, approachGuard=0;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const sound=createSound(soundOn);
const title=()=>t('A Shape to Remember','Uma Forma para Lembrar');
const two=n=>String(n).padStart(2,'0');
function save(){if(state.started)write(key,state);}
function savePrefs(){write(prefsKey,{lang,sound:soundOn,flat:flatPreference});}
function btn(el,art,txt,label=txt){el.innerHTML=icon(art)+'<span class="tool-label">'+str(txt)+'</span>';el.setAttribute('aria-label',label);el.title=label;}
function pageText(){
  document.documentElement.lang=lang==='en'?'en':'pt-BR';
  document.title=title()+' · immuno.games';
  $('brand-mark').innerHTML=sigil();$('en').setAttribute('aria-pressed',String(lang==='en'));$('pt').setAttribute('aria-pressed',String(lang==='pt'));
  btn($('sound'),soundOn?'sound':'mute',t(soundOn?'Sound on':'Sound off',soundOn?'Som ligado':'Som desligado'),soundOn?t('Mute sound','Silenciar o som'):t('Enable sound','Ativar o som'));$('sound').setAttribute('aria-pressed',String(soundOn));
  $('eyebrow').textContent=t('An interactive pop-up book','Um livro pop-up interativo');
  $('title').innerHTML=t('<span class="first-line">A Shape</span><br>to <em>Remember</em>','<span class="first-line">Uma Forma</span><br>para <em>Lembrar</em>');
  $('intro').textContent=t('Somewhere in these pages is a shape your B cell knows. Follow it through a world of folded paper, from its first encounter to a memory that lasts.','Em algum lugar destas páginas existe uma forma que sua célula B reconhece. Acompanhe-a por um mundo de papel, do primeiro encontro à memória que fica.');
  $('jacket-img').alt=t('An open pop-up book with a red river of blood cells on the left and a cut-paper lymph node on the right.','Um livro pop-up aberto com um rio de hemácias à esquerda e um linfonodo de cartolina à direita.');
  btn($('open'),'book',state.started?t('Resume the book','Continuar o livro'):t('Open the book','Abrir o livro'));
  btn($('how'),'help',t('How to play','Como jogar'));
  $('contents-label').textContent=t('Inside the book','Por dentro do livro');$('chapter-count').textContent=t('Six chapters','Seis capítulos');
  $('chapter-list').innerHTML=chapters.map((id,i)=>'<button data-preview="'+id+'"><span class="chapter-n">'+two(i+1)+'</span><span class="chapter-name">'+str(titles[id][lang])+'</span></button>').join('');
  btn($('about'),'info',t('About & credits','Sobre e créditos'));
  $('byline').innerHTML=t('A game by <strong>Helder Nakaya</strong>','Um jogo de <strong>Helder Nakaya</strong>');
  btn($('journal-button'),'journal',t('Field journal','Diário de campo'));btn($('cover-button'),'back',t('Book cover','Capa do livro'));
  btn($('receptor-button'),'music',t('My receptor','Meu receptor'));$('ribbon-title').textContent=title();
  document.querySelector('.stage-column').setAttribute('aria-label',t('Interactive book scenery','Cenário interativo do livro'));
  viewButton();
}
function viewButton(){
  const flatOnly=flatPreference||worldFailed;
  const label=worldFailed?t('Retry 3D','Tentar 3D'):flatOnly?t('Pop-up view','Vista pop-up'):t('Flat view','Vista plana');
  btn($('view-button'),flatOnly?'popup':'tiles',label);
  const caption=worldFailed?t('Illustrated view · Touch to explore.','Vista ilustrada · Toque para explorar.'):t('Touch the paper to explore.','Toque no papel para explorar.');
  $('stage-caption').innerHTML=icon('touch')+'<span>'+caption+'</span>';
  if(worldFailed)$('view-button').title=t('This browser could not start WebGL. Try the pop-up view again.','Este navegador não conseguiu iniciar o WebGL. Tente a vista pop-up novamente.');
}
function setScreen(value){
  screen=value;$('cover').hidden=value!=='cover';$('reader').hidden=value!=='reader';$('journal-button').hidden=value!=='reader';
  pageText();if(value==='reader'){ensureView();refresh();}else{clearTimeout(timer);releaseView();}
  window.scrollTo({top:0,behavior:'instant'});
}
function currentConfig(){return sceneConfig(state,lang,reduced.matches);}
function makeFlat(){
  if(flat||screen!=='reader')return;
  flat=createFlatArt({host:$('stage-flat'),onAction:id=>perform(id),onMove:()=>{sound.unlock();cancelApproach(true);}});
  flat.setScene(currentConfig());
}
function releaseView(){
  cancelApproach();++renderTicket;loadingWorld=false;world?.destroy();world=null;flat?.destroy();flat=null;activeStage=null;
  $('stage-3d').style.visibility='hidden';
}
async function ensureView(){
  if(screen!=='reader')return;
  if(flatPreference||worldFailed){if(world){world.destroy();world=null;}$('stage-3d').style.visibility='hidden';makeFlat();viewButton();return;}
  if(world||loadingWorld)return;
  makeFlat();loadingWorld=true;const ticket=++renderTicket;
  function fallBack(){
    if(ticket!==renderTicket||screen!=='reader')return;
    loadingWorld=false;worldFailed=true;world?.destroy();world=null;$('stage-3d').style.visibility='hidden';makeFlat();viewButton();
  }
  try{
    const {createWorld}=await import('./world.js');if(ticket!==renderTicket||screen!=='reader'||flatPreference)return;
    world=createWorld({host:$('stage-3d'),onAction:id=>perform(id),onMove:()=>{sound.unlock();cancelApproach(true);},onError:fallBack});
    world.setScene(currentConfig());await world.ready;
    if(ticket!==renderTicket||screen!=='reader'||flatPreference)return;
    loadingWorld=false;$('stage-3d').style.visibility='visible';flat?.destroy();flat=null;if(approach)guideTo(approach);viewButton();
  }catch{fallBack();}
}
function toggleView(){
  if(flatPreference||worldFailed){flatPreference=false;worldFailed=false;}else{flatPreference=true;}
  releaseView();savePrefs();ensureView();refresh();
}
function showMotif(){
  lastMotif=true;clearTimeout(motifTimer);
  const el=$('motif');el.hidden=false;el.innerHTML=noteSketch(state.target,true)+'<span class="screen-reader">'+t('Your three-note motif','Seu motivo de três notas')+'</span>';
  motifTimer=setTimeout(()=>{lastMotif=false;el.hidden=true;},2400);
}
function scheduleWitness(){
  clearTimeout(timer);if(screen!=='reader'||state.stage!=='node'||modal||approach||document.hidden)return;
  const step=state.steps.node;
  if(step==='arrived'||step==='witness'){
    timer=setTimeout(()=>perform(step==='arrived'?'@watch':'@seen'),step==='arrived'?7200:3600);
  }
}
function refresh(){
  if(screen!=='reader')return;
  const previous=activeStage,stage=state.stage,step=state.steps[stage],cfg=currentConfig();
  if(previous!==stage){activeStage=stage;world?.setScene(cfg);flat?.setScene(cfg);}else{world?.setState(cfg);flat?.setState(cfg);}
  const ch=chapters.indexOf(stage);$('chapter-kicker').textContent=ch<0?t('A side story · Tonsil','História opcional · Amígdala'):t('Chapter ','Capítulo ')+two(ch+1)+t(' of 06',' de 06');
  $('chapter-title').textContent=titles[stage][lang];$('chapter-title').tabIndex=-1;
  $('story-line').textContent=(line(state)?.[lang]||'').replaceAll('{name}',state.name).replaceAll('{sister}',[t('Fern','Flora'),t('Iris','Íris'),'Sol'][state.selected]);
  $('observation').hidden=!observation;$('observation').textContent=observation?.[lang]||'';
  if(!lastMotif)$('motif').hidden=true;
  const opts=objects(state),shapesOn=opts.some(o=>o.id.startsWith('ant-'));
  $('actions-label').textContent=shapesOn?t('The shapes on this page','As formas desta página'):t('On this page','Nesta página');
  const focused=document.activeElement,wasKeyboard=focused?.matches?.(':focus-visible')&&$('act-list').contains(focused);
  const focusID=focused?.dataset?.act;
  $('act-list').className='action-list'+(shapesOn?' shapes-list':'');
  $('act-list').innerHTML=opts.map(o=>'<button class="act" data-act="'+o.id+'">'+propIcon(o)+'<span>'+str(o.label[lang])+'</span></button>').join('');
  if(wasKeyboard){const el=[...$('act-list').children].find(x=>x.dataset.act===focusID)||$('chapter-title');el.focus({preventScroll:true});}
  scheduleWitness();
}
function turn(years=false){
  if(reduced.matches)return;const stage=$('stage-wrap');clearTimeout(flipTimer);stage.classList.remove('flipping','turning-years');void stage.offsetWidth;stage.classList.add(years?'turning-years':'flipping');flipTimer=setTimeout(()=>stage.classList.remove('turning-years','flipping'),years?1250:620);
}
function cancelApproach(resume=false){
  clearTimeout(approachGuard);approach=null;
  $('act-list').querySelector('[aria-busy]')?.removeAttribute('aria-busy');
  if(resume)scheduleWitness();
}
function guideTo(trip){
  const arrive=()=>{
    if(approach!==trip||screen!=='reader'||modal||state.stage!==trip.stage)return;
    cancelApproach();resolveAction(trip.id);
  };
  const engine=flat||world,box=$('stage-wrap').getBoundingClientRect();
  if(!engine||reduced.matches||box.bottom<=0||box.top>=innerHeight){arrive();return;}
  engine.moveTo(trip.point.x,trip.point.z,arrive);
  // An off-screen or heavily throttled canvas must never block the keyboard controls.
  if(approach===trip){clearTimeout(approachGuard);approachGuard=setTimeout(arrive,1800);}
}
function perform(id){
  if(screen!=='reader'||modal)return;
  const point=objects(state).find(o=>o.id===id);
  cancelApproach();
  if(point&&(point.kind==='antigen'||point.kind==='fdc'||point.kind==='helper')){
    clearTimeout(timer);
    approach={id,stage:state.stage,point};
    $('act-list').querySelector('[data-act="'+id+'"]')?.setAttribute('aria-busy','true');
    guideTo(approach);return;
  }
  if(point){world?.moveTo(point.x,point.z);flat?.moveTo(point.x,point.z);}
  resolveAction(id);
}
function resolveAction(id){
  const stage=state.stage;
  const result=act(state,id);observation=result.message||null;
  if(result.sound==='motif')showMotif();
  if(!id.startsWith('@'))sound.play(result.sound||'fold',state.target);
  save();refresh();
  if(stage!==state.stage)turn(id==='years');
  if(result.leaf)openModal({type:'leaf',id:result.leaf});
  if(result.family)openModal({type:'journal',tab:'family'});
  if(result.ending)openModal({type:'end'});
}
function hear(target,node){
  sound.play('motif',target);
  if(node){const v=node.querySelector('.note-visual');if(v){v.classList.remove('play');void v.offsetWidth;v.classList.add('play');}}
}
function button(action,art,label,css='pine-btn',data=''){return '<button type="button" class="button '+css+'" data-do="'+action+'" '+data+'>'+icon(art)+'<span>'+str(label)+'</span></button>';}
function quiet(action,label,data=''){return '<button type="button" class="quiet" data-do="'+action+'" '+data+'>'+str(label)+'</button>';}
function openModal(next){
  cancelApproach();modal=next;clearTimeout(timer);renderModal();if(!$('overlay').open)$('overlay').showModal();
  document.querySelector('.site-shell').inert=true;
}
function closeModal(){
  document.querySelector('.site-shell').inert=false;
  if($('overlay').open)$('overlay').close();
  modal=null;scheduleWitness();
}
function panel(kicker,heading,content,kind=''){
  return '<section class="paper-dialog '+kind+'"><button type="button" class="close" data-do="close" aria-label="'+t('Close','Fechar')+'">'+icon('close')+'</button><div class="eyebrow"><i></i><span>'+str(kicker)+'</span></div><h2 id="dialog-title">'+str(heading)+'</h2>'+content+'</section>';
}
function binding(s){
  const hear=t('Play the three notes','Tocar as três notas');
  return '<button type="button" class="binding" data-do="hear" aria-label="'+hear+'">'+shapeIcon(s.target)+'<span><strong>'+t('Your receptor','Seu receptor')+'</strong><span class="binding-shape">'+str(shapes[s.target][lang])+' '+noteSketch(s.target)+'</span></span><span class="hear-icon">'+icon('music')+'</span></button>';
}
function makeSetup(){
  const s=draft;
  return panel(t('The first leaf','A primeira folha'),t('Name your B cell','Dê um nome à sua célula B'),
    '<p>'+t('A naïve B cell is about to leave with the current. Give her a name and a little paper mark her daughters will keep.','Uma célula B naïve está prestes a seguir a corrente. Dê a ela um nome e uma marca de papel que suas filhas vão guardar.')+'</p><form id="bookplate"><div class="bookplate-main"><button type="button" data-do="hear" class="cell-listen" aria-label="'+t('Touch the receptor','Tocar no receptor')+'">'+cellPlate(s.mark,s.target)+'</button><div class="name-line"><label for="cell-name">'+t('Cell name','Nome da célula')+'</label><input id="cell-name" name="cell-name" maxlength="28" autocomplete="off" placeholder="Luma" value="'+str(s.name)+'"></div></div><span id="mark-label" class="legend">'+t('Family mark','Marca da família')+'</span><div class="mark-row" role="group" aria-labelledby="mark-label">'+marks.map((m,i)=>'<button type="button" aria-pressed="'+(s.mark===i)+'" data-do="mark" data-val="'+i+'">'+markIcon(i)+str(m[lang])+'</button>').join('')+'</div>'+binding(s)+'<div class="dialog-actions"><button class="button pine-btn" type="submit">'+icon('fold')+t('Enter the bloodstream','Entrar na corrente sanguínea')+'</button></div></form>');
}
function makeHow(){
  const list=[
    ['touch',t('Approach','Aproxime-se'),t('Tap the paper to move your B cell. Touch a piece of the scene or use its matching button.','Toque no papel para mover a célula B. Toque em uma peça do cenário ou use o botão correspondente.')],
    ['leaf',t('Observe','Observe'),t('Wait beside a character and see what happens. A shape, a sound, or a familiar mark may return later.','Pare perto de uma personagem e veja o que acontece. Uma forma, um som ou uma marca conhecida pode reaparecer depois.')],
    ['fold',t('Unfold','Desdobre'),t('Pull or tap a tab to lift the paper world. Open your journal to revisit discoveries and places.','Puxe ou toque em uma aba para erguer o mundo de papel. Abra o diário para revisitar lugares e descobertas.')]
  ];
  const html='<div class="how-list">'+list.map(([i,h,b])=>'<div class="how-item">'+icon(i)+'<div><strong>'+h+'</strong><p>'+b+'</p></div></div>').join('')+'</div><p class="section-note">'+t('Play at your own pace. The book also works with a keyboard or with sound muted. Progress is saved in this browser.','Jogue no seu ritmo. Você também pode usar o teclado ou desligar o som. O progresso fica salvo neste navegador.')+'</p><div class="dialog-actions">'+button('begin','book',state.started?t('Resume the book','Continuar o livro'):t('Open the book','Abrir o livro'))+'</div>';
  return panel(t('Reader’s guide','Guia de leitura'),t('How to play','Como jogar'),html);
}
function makePreview(id){
  const i=chapters.indexOf(id),available=state.started&&state.unlocked>=i;
  let actions=available?button('visit','book',t('Visit this chapter','Visitar este capítulo'),'pine-btn','data-place="'+id+'"'):button('begin','book',state.started?t('Resume the journey','Continuar a jornada'):t('Start the journey','Começar a jornada'));
  return panel(t('Chapter ','Capítulo ')+two(i+1)+t(' of 06',' de 06'),titles[id][lang],'<p>'+str(descriptions[id][lang])+'</p><div class="dialog-actions">'+actions+quiet('close',t('Back to cover','Voltar à capa'))+'</div>');
}
function leaf(id,parent){
  const n=notes[id];const art=propIcon({kind:n[2],variant:state.target});
  return panel(t('Field journal · A discovery','Diário de campo · Uma descoberta'),n[0][lang],'<div class="leaf-art">'+art+'</div><p>'+str(n[1][lang])+'</p><div class="dialog-actions">'+button(parent==='journal'?'journal-notes':'close',parent==='journal'?'journal':'book',parent==='journal'?t('All discoveries','Todas as descobertas'):t('Back to the page','Voltar à página'))+'</div>');
}
function makeJournal(tab='notes'){
  let html='<div class="journal-tabs" role="group" aria-label="'+t('Journal sections','Seções do diário')+'">'+[['notes','journal',t('Notes','Notas')],['places','map',t('Places','Lugares')],['family','tree',t('Family','Família')]].map(([k,i,n])=>'<button aria-pressed="'+(tab===k)+'" data-do="journal-'+k+'">'+icon(i)+n+'</button>').join('')+'</div>';
  if(tab==='notes'){
    html+='<div class="note-list">'+[...state.notes].reverse().map(id=>'<button class="leaf-row" data-do="read" data-id="'+id+'">'+propIcon({kind:notes[id][2],variant:state.target})+str(notes[id][0][lang])+'</button>').join('')+'</div>';
    if(!state.notes.length)html+='<p class="empty-message">'+t('Your first leaf is waiting by the red river.','Sua primeira folha espera junto ao rio vermelho.')+'</p>';
  }else if(tab==='places'){
    html+='<div class="place-list">'+chapters.map((id,i)=>'<button class="place-row" data-do="visit" data-place="'+id+'" '+(i>state.unlocked?'disabled':'')+'>'+icon(i>state.unlocked?'lock':'book')+'<span>'+two(i+1)+' · '+str(titles[id][lang])+'</span></button>').join('')+(state.unlocked>=1?'<button class="place-row" data-do="visit" data-place="tonsil">'+icon('leaf')+t('Side story · The tonsil','História opcional · A amígdala')+'</button>':'')+'</div>';
  }else{
    html+='<div class="tree-start">'+markIcon(state.mark)+str(state.name)+'</div>';
    if(state.notes.includes('memory')){
      html+='<div class="family-branches"><button data-do="lineage" data-id="plasma">'+icon('leaf')+t('Marrow plasma cell','Plasmócito da medula')+'</button><button data-do="lineage" data-id="memory">'+icon('tag')+t('Memory B cell','Célula B de memória')+'</button></div><p class="section-note">'+t('Touch a branch to visit that sister.','Toque em um ramo para visitar aquela irmã.')+'</p>';
      if(state.notes.includes('recall'))html+='<button class="leaf-row" data-do="visit" data-place="recall">'+icon('tree')+t('Daughters of the memory cell','Filhas da célula de memória')+'</button>';
    }else if(state.notes.includes('mutation')){
      html+='<p class="section-note">'+t('Three sisters in the germinal center carry this mark. The tree grows as you follow them.','Três irmãs no centro germinativo têm essa marca. A árvore cresce à medida que você as acompanha.')+'</p><div class="dialog-actions">'+button('visit','fold',t('Visit the sisters','Visitar as irmãs'),'subtle-btn','data-place="garden"')+'</div>';
    }else html+='<p class="section-note">'+t('This is the first mark on your family tree. Return here when your cell has daughters.','Esta é a primeira marca da sua árvore. Volte aqui quando sua célula tiver filhas.')+'</p>';
  }
  return panel(title(),t('Field journal','Diário de campo'),html);
}
function makeAbout(){
  return panel('immuno.games',t('About the book','Sobre o livro'),'<p class="bio-credits">'+t('An immunology game by Helder Nakaya, Integrative Biology, Institut Pasteur de São Paulo.','Um jogo de imunologia de Helder Nakaya, grupo de Biologia Integrativa do Institut Pasteur de São Paulo.')+' <a href="https://www.instagram.com/helder_nakaya/" target="_blank" rel="noopener noreferrer">@helder_nakaya</a></p><h3 class="about-section">'+t('Paper engineering','Engenharia de papel')+'</h3><p class="dialog-copy">'+t('Original pop-up framework by xikhar, built with Three.js. The book, cells and anatomical scenes were made for this game.','Estrutura pop-up original de xikhar, em Three.js. O livro, as células e os cenários anatômicos foram criados para este jogo.')+' <a href="https://github.com/xikhar/papercraft" target="_blank" rel="noopener noreferrer">xikhar/papercraft</a></p><h3 class="about-section">'+t('Science behind the pages','A ciência das páginas')+'</h3><ul class="source-links"><li><a href="https://www.ncbi.nlm.nih.gov/books/NBK10757/" target="_blank" rel="noopener noreferrer">Janeway et al. · Immunobiology</a></li><li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC4702236/" target="_blank" rel="noopener noreferrer">B Cells, Antibodies, and More</a></li><li><a href="https://pubmed.ncbi.nlm.nih.gov/9768759/" target="_blank" rel="noopener noreferrer">Babcock et al. · EBV persistence in memory B cells in vivo</a></li></ul><div class="dialog-actions">'+button('close','book',t('Return to the book','Voltar ao livro'))+(state.started?quiet('restart',t('Start a new book','Iniciar um novo livro')):'')+'</div>');
}
function renderModal(){
  if(!modal)return;
  let html='';
  switch(modal.type){
    case 'setup':html=makeSetup();break;
    case 'how':html=makeHow();break;
    case 'preview':html=makePreview(modal.id);break;
    case 'journal':html=makeJournal(modal.tab);break;
    case 'leaf':html=leaf(modal.id,modal.parent);break;
    case 'about':html=makeAbout();break;
    case 'receptor':html=panel(t('From the first leaf','Da primeira folha'),t('Your receptor','Seu receptor'),'<p>'+t('This outline fits the binding site your B cell carried into the red river. Touch the note to hear it again.','Este contorno encaixa no sítio de ligação que sua célula B levou para o rio vermelho. Toque na nota para ouvi-la novamente.')+'</p>'+binding(state)+'<div class="dialog-actions">'+button('close','book',t('Back to the page','Voltar à página'))+'</div>');break;
    case 'end':html=panel(t('The back cover','A contracapa'),t('A shape remembered','Uma forma na memória'),'<div class="leaf-art">'+shapeIcon(state.target)+'</div><p>'+t('Years later, you recognized the shape that started ','Anos depois, você reconheceu a forma que deu início à história de ')+str(state.name)+t('’s story. One sister is still in the marrow. Another has given rise to a new branch of the family.','. Uma irmã continua na medula. Outra deu origem a um novo ramo da família.')+'</p><div class="dialog-actions">'+button('journal-family','tree',t('Open the family tree','Abrir a árvore da família'))+quiet('close',t('Stay here','Ficar por aqui'))+'</div>');break;
    case 'restart':html=panel(t('The bookplate','A primeira folha'),t('Begin a new journal?','Iniciar outro diário?'),'<p>'+t('A new family will take the place of this one in this browser. Choose “Keep this book” to continue with ','Uma nova família ocupará o lugar desta neste navegador. Escolha “Manter este livro” para continuar com ')+str(state.name)+'.</p><div class="dialog-actions">'+button('close','book',t('Keep this book','Manter este livro'))+button('new','replay',t('Begin again','Recomeçar'),'subtle-btn')+'</div>');break;
  }
  $('dialog-inner').innerHTML=html;$('overlay').scrollTop=0;
}
function begin(){
  sound.unlock();if(state.started){closeModal();setScreen('reader');}else{draft=draft||newJourney();openModal({type:'setup'});}
}
function visitFromDialog(stage){
  if(visit(state,stage)){observation=null;closeModal();save();if(screen!=='reader')setScreen('reader');else refresh();turn();}
}
$('overlay').addEventListener('click',event=>{
  if(event.target===$('overlay')){const r=$('overlay').getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeModal();return;}
  const el=event.target.closest('[data-do]');if(!el)return;
  const action=el.dataset.do;sound.unlock();
  if(action==='close')closeModal();
  else if(action==='begin')begin();
  else if(action==='new'){draft=newJourney();openModal({type:'setup'});}
  else if(action==='restart')openModal({type:'restart'});
  else if(action==='hear'){const s=modal.type==='setup'?draft:state;hear(s.target,$('dialog-inner'));}
  else if(action==='mark'){draft.mark=Number(el.dataset.val);renderModal();$('dialog-inner').querySelector('[data-val="'+draft.mark+'"]')?.focus({preventScroll:true});}
  else if(action.startsWith('journal-'))openModal({type:'journal',tab:action.slice(8)});
  else if(action==='read')openModal({type:'leaf',id:el.dataset.id,parent:'journal'});
  else if(action==='visit')visitFromDialog(el.dataset.place);
  else if(action==='lineage'){
    const plasma=el.dataset.id==='plasma';visitFromDialog(plasma?'marrow':(state.unlocked===5?'recall':'marrow'));
    const p=objects(state).find(o=>o.id===(plasma?'plasma':'memory'));if(p){world?.moveTo(p.x,p.z);flat?.moveTo(p.x,p.z);}
    openModal({type:'leaf',id:plasma?'plasma':'memory'});
  }
});
$('overlay').addEventListener('input',e=>{if(e.target.id==='cell-name'&&draft)draft.name=e.target.value;});
$('overlay').addEventListener('submit',e=>{
  if(e.target.id!=='bookplate')return;e.preventDefault();draft.name=($('cell-name').value.trim()||'Luma').slice(0,28);draft.started=true;state=draft;draft=null;observation=null;lastMotif=false;save();closeModal();setScreen('reader');sound.play('fold');
});
$('overlay').addEventListener('close',()=>{if(!$('overlay').open){document.querySelector('.site-shell').inert=false;modal=null;scheduleWitness();}});
$('open').onclick=begin;$('how').onclick=()=>openModal({type:'how'});$('about').onclick=()=>openModal({type:'about'});
$('sound').onclick=()=>{soundOn=!soundOn;sound.set(soundOn);savePrefs();pageText();};
for(const code of ['en','pt'])$(code).onclick=()=>{lang=code;savePrefs();pageText();refresh();if(modal)renderModal();};
$('chapter-list').onclick=e=>{const b=e.target.closest('[data-preview]');if(b)openModal({type:'preview',id:b.dataset.preview});};
$('journal-button').onclick=()=>openModal({type:'journal',tab:'notes'});
$('cover-button').onclick=()=>{observation=null;setScreen('cover');};
$('view-button').onclick=toggleView;
$('receptor-button').onclick=()=>{openModal({type:'receptor'});hear(state.target,$('dialog-inner'));};
$('act-list').onclick=e=>{const b=e.target.closest('[data-act]');if(b)perform(b.dataset.act);};
document.addEventListener('visibilitychange',scheduleWitness);
reduced.addEventListener?.('change',refresh);
setScreen('cover');
