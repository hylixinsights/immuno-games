import { chapters, marks, shapes, notes, newJourney, restore, visit, act } from './story.js';
import { createSound, noteSketch } from './journey-audio.js';
import { createJourneyMap } from './map.js';
import { placeNames, stagePrompt, momentText, stationName, actionName } from './words.js';
import { peptidePuzzler } from './peptide.js';
import { icon, sigil, shapeIcon, markIcon, cellPlate, propIcon } from './icons.js';

const $=id=>document.getElementById(id);
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const storage='immuno.shape-book.v1', prefsKey=storage+'.preferences', travelKey=storage+'.trail';
function read(key){try{return JSON.parse(localStorage.getItem(key));}catch{return null;}}
function write(key,value){try{localStorage.setItem(key,JSON.stringify(value));}catch{}}
const prefs=read(prefsKey)||{}, saved=restore(read(storage));
let state=saved||newJourney(),draft=null,screen='title',modal=null,lang=prefs.lang==='pt'?'pt':'en',soundOn=prefs.sound!==false;
const recorded=read(travelKey);
let positions=saved&&recorded&&typeof recorded==='object'?recorded:{};
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),audio=createSound(soundOn);
const tr=(en,pt)=>lang==='pt'?pt:en, bilingual=(en,pt)=>({en,pt});
let nearInfo={items:[],watch:false,atEnd:false,atStart:true},watchTimer=0,watchKey='',cueTimer=0,cue=null;
let draftHeard=false;
let activePlace=null,view=null,seenTip=!!prefs.travelTip,seenNear=new Set(),moving=false;
const extraIcons={
  go:'<path d="M7 18c-2-7 9-6 9-15m-4 4 4-4 3.1 4.8M4 20c-.6-3.2.7-5.8 2.7-7.4"/>',
  backflow:'<path d="M15 4c2 7-7 7-7 15m-3.5-4.1L8 19l4.3-3.4M19 3c.6 3.1-.9 5.4-2.8 7.1"/>',
  menu:'<path d="M4 7h16M4 12h12M4 17h16"/>', more:'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  pin:'<path d="M19 10c0 5-7 11-7 11s-7-6-7-11a7 7 0 1 1 14 0z"/><circle cx="12" cy="10" r="2.3"/>'
};
function art(k){return extraIcons[k]?'<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+extraIcons[k]+'</svg>':icon(k);}
function label(el,markup,title,only=false){
  el.innerHTML=markup+(only?'':'<span>'+esc(title)+'</span>');el.setAttribute('aria-label',title);el.title=title;
}
function persist(){if(state.started)write(storage,state);}
function savePrefs(){write(prefsKey,{...prefs,lang,sound:soundOn,travelTip:seenTip});}
function savePosition(p){if(screen==='play'&&activePlace){positions[activePlace]=p;write(travelKey,positions);}}
function region(){return placeNames[state.stage][lang];}
function title(){return tr('A Shape to Remember','Uma Forma para Lembrar');}
function playSoundLabel(){return soundOn?tr('Sound on','Som ligado'):tr('Sound off','Som desligado');}
function drawText(){
  document.documentElement.lang=lang==='pt'?'pt-BR':'en';document.title=title()+' · immuno.games';
  $('brand-mark').innerHTML=sigil();$('en').setAttribute('aria-pressed',String(lang==='en'));$('pt').setAttribute('aria-pressed',String(lang==='pt'));
  $('title').innerHTML=tr('A Shape<br><em>to Remember</em>','Uma Forma<br><em>para Lembrar</em>');
  $('intro').textContent=tr('Follow one B cell through the bloodstream. Somewhere ahead is a shape she will recognize.','Acompanhe uma célula B pela corrente sanguínea. Mais adiante, ela vai encontrar uma forma que reconhece.');
  label($('open'),art('go'),state.started?tr('Resume journey','Continuar jornada'):tr('Begin journey','Começar jornada'));
  label($('how'),'',tr('How to play','Como jogar'));label($('about'),art('info'),tr('Credits','Créditos'));
  label($('title-sound'),art(soundOn?'sound':'mute'),playSoundLabel());$('title-sound').setAttribute('aria-pressed',String(soundOn));
  label($('journal-button'),art('journal'),tr('Field journal','Diário de campo'),true);
  label($('menu'),art('menu'),tr('Journey menu','Menu da jornada'),true);
  const ix=chapters.indexOf(state.stage);
  $('chapter-kicker').textContent=ix<0?tr('Side path','Trilha lateral'):tr('Stop ','Parada ')+(ix+1)+tr(' of 6',' de 6');
  $('place').textContent=region();$('place-symbol').innerHTML=art('map');$('places').setAttribute('aria-label',tr('Map and encounters','Mapa e encontros')+' · '+region());
  label($('receptor-button'),shapeIcon(state.target),tr('My receptor','Meu receptor'));
  label($('back-step'),art('backflow'),tr('Move back','Recuar'),true);
  label($('cue-close'),art('close'),tr('Dismiss message','Fechar mensagem'),true);
  $('map').setAttribute('aria-label',tr('Tissue map. Tap a figure, drag to travel, or use the controls below.','Mapa do tecido. Toque numa figura, arraste para nadar ou use os controles abaixo.'));
  controls();if(cue)drawCue();
}
function controls(){
  if(!$('forward'))return;
  label($('forward'),art(moving?'close':nearInfo.atEnd?'replay':'go'),moving?tr('Stop here','Parar aqui'):nearInfo.atEnd?tr('Circle back','Revisitar'):tr('Move ahead','Avançar'));
  $('back-step').disabled=nearInfo.atStart&&!moving;
  const [first,...other]=nearInfo.items;
  $('context-row').hidden=!first;
  if(first){label($('interact'),propIcon(first),actionName(first,state)[lang]);$('interact').dataset.id=first.id;}
  $('other-near').hidden=!other.length;
  label($('other-near'),art('more'),tr('Other nearby encounters','Outros encontros próximos'),true);
}
function drawCue(){
  if(!cue)return;
  $('cue').hidden=false;$('cue').dataset.kind=cue.kind;
  $('cue-icon').innerHTML=cue.kind==='motif'?noteSketch(state.target,true):art(cue.kind==='move'?'touch':cue.kind==='signal'?'music':'leaf');
  $('cue-text').textContent=cue.words[lang];
}
function clearCue(){clearTimeout(cueTimer);cue=null;$('cue').hidden=true;}
function showCue(words,kind='story',duration=7800){
  clearCue();if(!words||screen!=='play')return;
  cue={words,kind};drawCue();
  if(duration)cueTimer=setTimeout(clearCue,duration);
}
function scheduleWitness(){
  const step=state.steps.node;
  const valid=state.stage==='node'&&nearInfo.watch&&screen==='play'&&!modal&&!document.hidden&&['arrived','witness'].includes(step);
  const k=valid?step:'';
  if(k===watchKey)return;
  clearTimeout(watchTimer);watchKey=k;
  if(valid)watchTimer=setTimeout(()=>{watchKey='';if(!modal&&screen==='play'&&nearInfo.watch)engage(step==='arrived'?'@watch':'@seen');},step==='arrived'?3600:2750);
}
function syncMap(reset=false){
  const isPlay=screen==='play',target=isPlay?state:coverState;
  if(isPlay)activePlace=state.stage;
  view.setScene(target,{reset,position:isPlay?positions[target.stage]:{at:1.25,lane:.04},cover:!isPlay,reduced:reduced.matches});
  if(isPlay)audio.scene(state.stage);
  drawText();
}
const coverState=newJourney(()=>.41);
view=createJourneyMap($('map'),{
  floorHost:$('tissue'),
  near(info){
    nearInfo=info;
    if(screen==='play'){
      controls();scheduleWitness();
      const nearest=info.items[0],key=nearest&&state.stage+'/'+nearest.id;
      if(nearest&&!seenNear.has(key)&&moving){audio.play('approach',state.target);seenNear.add(key);}
    }
  },
  motion(on){moving=on;audio.travel(on);if(screen==='play')controls();},
  position:savePosition,
  gesture(){audio.unlock();if(screen==='play'&&!seenTip){seenTip=true;savePrefs();}if(cue?.kind==='move')clearCue();},
  engage
});
function setScreen(next){
  if(screen==='play'){view.stop();savePosition(view.position());}
  screen=next;clearCue();clearTimeout(watchTimer);watchKey='';nearInfo={items:[],atEnd:false,atStart:true,watch:false};activePlace=null;
  const play=screen==='play';$('shell').classList.toggle('at-title',!play);$('shell').classList.toggle('playing',play);
  $('welcome').hidden=play;$('hud').hidden=!play;
  if(!play)audio.scene(null);
  view.pause(false);syncMap(true);
  if(play){
    const first=state.stage==='river'&&!seenTip;
    showCue(first?bilingual('Swipe up to travel. Tap a paper figure to meet it.','Arraste para cima para nadar. Toque numa figura para encontrá-la.'):stagePrompt(state),first?'move':'story',first?0:7500);
  }
}
function travelTo(id){closeModal();view.approach(id,true);}
function engage(id,docked=false){
  if(screen!=='play'||modal)return;
  const before=state.stage,oldStep=state.steps[before];
  if(!id.startsWith('@')&&!view.stations().some(o=>o.id===id))return;
  if(id==='mhc'&&before==='recognition'&&oldStep==='cut'&&!docked){openModal({type:'peptide'});return;}
  const result=act(state,id);
  let fx=result.sound||id;
  if(result.sound==='motif')fx=before==='recall'?'recall':'match';
  if(result.sound==='brush'||(id==='fdc'&&state.selected===0))fx='mismatch';
  if(id.startsWith('sister-')||id==='friend'||id==='@seen')fx='encounter';
  if(id==='fdc'&&state.selected!==0)fx='signal';
  audio.play(fx,state.target);
  const changed=before!==state.stage;
  if(changed){clearTimeout(watchTimer);watchKey='';seenNear.clear();}
  persist();syncMap(changed);
  view.effect(id,fx);
  const message=momentText(id,before,state,result)||((changed||oldStep!==state.steps[state.stage])?stagePrompt(state):null);
  showCue(message,fx==='match'||fx==='recall'?'motif':fx==='signal'?'signal':'story');
  if(result.leaf)openModal({type:'leaf',id:result.leaf});
  if(result.family)openModal({type:'journal',tab:'family'});
  if(result.ending)openModal({type:'end'});
  scheduleWitness();
}
function openModal(next){
  modal=next;clearTimeout(watchTimer);watchKey='';view.pause(true);audio.scene(null);
  renderModal();if(!$('overlay').open)$('overlay').showModal();
}
function closeModal(){
  const had=!!modal;modal=null;
  if($('overlay').open)$('overlay').close();
  if(had){view.pause(false);if(screen==='play')audio.scene(state.stage);scheduleWitness();}
}
function dialogFrame(heading,body,eyebrow=''){
  return '<section class="sheet"><div class="sheet-head">'+(eyebrow?'<small>'+esc(eyebrow)+'</small>':'')+'<h2 id="dialog-title">'+esc(heading)+'</h2><button type="button" data-do="close" class="sheet-close" aria-label="'+tr('Close','Fechar')+'">'+art('close')+'</button></div>'+body+'</section>';
}
function button(id,text,ico='leaf',cls='list-button',attr=''){
  return '<button type="button" class="'+cls+'" data-do="'+id+'" '+attr+'>'+art(ico)+'<span>'+esc(text)+'</span></button>';
}
function languageSwitch(){return '<div class="switch dark" role="group" aria-label="Language / Idioma"><button data-do="lang" data-lang="en" aria-pressed="'+(lang==='en')+'">English</button><button data-do="lang" data-lang="pt" aria-pressed="'+(lang==='pt')+'">Português</button></div>';}
function binding(s){
  return '<button class="binding" type="button" data-do="hear">'+shapeIcon(s.target)+'<span><strong>'+esc(shapes[s.target][lang])+'</strong><small>'+tr('Hear your receptor','Ouvir o receptor')+'</small></span>'+noteSketch(s.target)+'</button>';
}
function setup(){
  return dialogFrame(tr('Meet your B cell','Conheça sua célula B'),'<form id="setup-form"><div class="identity-row"><button type="button" class="cell-icon" data-do="hear" aria-label="'+tr('Hear your receptor','Ouvir o receptor')+'">'+cellPlate(draft.mark,draft.target)+'</button><label>'+tr('Cell name','Nome da célula')+'<input id="cell-name" maxlength="28" autocomplete="off" value="'+esc(draft.name)+'"></label></div><fieldset><legend>'+tr('Family mark','Marca da família')+'</legend><div class="marks">'+marks.map((m,i)=>'<button type="button" data-do="mark" data-index="'+i+'" aria-pressed="'+(draft.mark===i)+'">'+markIcon(i)+'<span>'+esc(m[lang])+'</span></button>').join('')+'</div></fieldset>'+binding(draft)+'<button class="primary submit" type="submit">'+art('go')+tr('Enter the bloodstream','Entrar na corrente sanguínea')+'</button></form>',tr('Before you set off','Antes de partir'));
}
function journal(tab){
  let h='<div class="tabs" role="group" aria-label="'+tr('Journal sections','Seções do diário')+'">'+[['notes',tr('Notes','Notas')],['places',tr('Places','Lugares')],['family',tr('Family','Família')]].map(([id,l])=>'<button data-do="journal" data-tab="'+id+'" aria-pressed="'+(id===tab)+'">'+l+'</button>').join('')+'</div>';
  if(tab==='notes'){
    if(!state.notes.length)h+='<p>'+tr('Discoveries you make along the route will appear here.','As descobertas que você fizer pelo caminho vão aparecer aqui.')+'</p>';
    h+='<div class="list">'+[...state.notes].reverse().map(id=>button('note',notes[id][0][lang],'journal','list-button','data-id="'+id+'"')).join('')+'</div>';
  }else if(tab==='places'){
    h+='<div class="list">'+chapters.map((s,i)=>button('visit',placeNames[s][lang],i>state.unlocked?'lock':'pin','list-button','data-place="'+s+'" '+(i>state.unlocked?'disabled':''))).join('')+(state.unlocked>=1?button('visit',tr('Side path · Tonsil','Trilha lateral · Amígdala'),'leaf','list-button','data-place="tonsil"'):'')+'</div>';
  }else{
    h+='<div class="tree-root">'+markIcon(state.mark)+'<strong>'+esc(state.name)+'</strong></div>';
    if(state.notes.includes('memory')){
      h+='<div class="family">'+button('lineage',tr('Marrow plasma cell','Plasmócito da medula'),'leaf','list-button','data-id="plasma"')+button('lineage',tr('Memory B cell','Célula B de memória'),'tree','list-button','data-id="memory"')+'</div>';
      if(state.notes.includes('recall'))h+=button('visit',tr('Daughters of the memory cell','Filhas da célula de memória'),'tree','list-button','data-place="recall"');
    }else if(state.notes.includes('mutation'))h+=button('visit',tr('Visit the three sisters','Visitar as três irmãs'),'tree','list-button','data-place="garden"');
    else h+='<p>'+tr('This mark will travel with the daughters of your B cell.','As filhas da sua célula B vão herdar essa marca.')+'</p>';
  }
  return dialogFrame(tr('Field journal','Diário de campo'),h);
}
function renderModal(){
  if(!modal)return;
  let html='';
  switch(modal.type){
    case 'setup':html=setup();break;
    case 'peptide':html=dialogFrame(tr('Load MHC II','Carregue o MHC II'),'<div id="load-peptide"></div>',tr('Inside the B-cell vesicle','Dentro da vesícula da célula B'));break;
    case 'how':html=dialogFrame(tr('How to explore','Como explorar'),'<div class="guide">'+[
      ['touch',tr('Move through the tissue','Mover-se pelo tecido'),tr('Swipe up to move forward. Slide sideways to steer, or tap a spot to swim there.','Arraste para cima para avançar. Deslize para os lados para guiar a célula ou toque onde quiser ir.')],
      ['fold',tr('Meet the figures','Encontrar as figuras'),tr('Tap a paper figure to approach it. Move ahead takes you to the next stop. You choose whether to interact.','Toque numa figura de papel para se aproximar. Avançar leva até a próxima parada. Você escolhe se quer interagir.')],
      ['music',tr('Remember the shape','Guardar a forma'),tr('Touch My receptor to see its outline and hear its three notes again.','Toque em Meu receptor para rever o contorno e ouvir as três notas.')]
    ].map(([i,k,d])=>'<div>'+art(i)+'<p><strong>'+k+'</strong>'+d+'</p></div>').join('')+'</div><p class="fine">'+tr('On a keyboard, move with the arrow keys or WASD. Press Enter near a figure.','No teclado, use as setas ou WASD para nadar. Pressione Enter perto de uma figura.')+'</p>'+button(screen==='title'?'begin':'close',screen==='title'?tr('Set off','Partir'):tr('Back to the journey','Voltar à jornada'),'go','primary submit'));break;
    case 'menu':html=dialogFrame(tr('Journey menu','Menu da jornada'),'<div class="list">'+button('close',tr('Keep exploring','Continuar explorando'),'go','primary')+button('map',tr('Map and encounters','Mapa e encontros'),'map')+button('how',tr('How to play','Como jogar'),'help')+button('sound',playSoundLabel(),soundOn?'sound':'mute')+button('title',tr('Title screen','Tela inicial'),'home')+'</div>'+languageSwitch());break;
    case 'map':
    case 'near':{
      const subset=modal.type==='near'?nearInfo.items:view.stations();
      html=dialogFrame(modal.type==='near'?tr('Within reach','Ao seu alcance'):region(),'<p class="lead">'+esc(stagePrompt(state)[lang])+'</p><div class="list">'+[...subset].sort((a,b)=>a.at-b.at).map(o=>'<button class="list-button" data-do="approach" data-id="'+o.id+'">'+propIcon(o)+'<span>'+esc(stationName(o,state)[lang])+'</span></button>').join('')+'</div>'+button('journal',tr('Visited places','Lugares visitados'),'map','sheet-link','data-tab="places"'),tr('Encounters along the route','Encontros pelo caminho'));break;
    }
    case 'journal':html=journal(modal.tab||'notes');break;
    case 'leaf':{
      const n=notes[modal.id];html=dialogFrame(n[0][lang],'<div class="leaf-illustration">'+propIcon({kind:n[2],variant:state.target})+'</div><p>'+esc(n[1][lang])+'</p>'+button(modal.parent?'journal':'close',modal.parent?tr('All notes','Todas as notas'):tr('Continue exploring','Continuar explorando'),'go','primary submit'),tr('Field journal','Diário de campo'));break;
    }
    case 'receptor':html=dialogFrame(tr('My receptor','Meu receptor'),binding(state)+'<p>'+tr('Look at the outline and listen. When your B cell binds an antigen, these three notes will return.','Observe o contorno e escute. Quando sua célula B se ligar ao antígeno, as três notas vão voltar.')+'</p>'+button('close',tr('Back to the journey','Voltar à jornada'),'go','primary submit'),state.name);break;
    case 'about':html=dialogFrame(tr('Credits','Créditos'),'<p>'+tr('An immunology game by Helder Nakaya, Integrative Biology, Institut Pasteur de São Paulo.','Um jogo de imunologia de Helder Nakaya, grupo de Biologia Integrativa do Institut Pasteur de São Paulo.')+'</p><p>'+tr('The paper folds and their sound use the papercraft mechanisms by xikhar.','As dobras e o som do papel usam os mecanismos do Papercraft de xikhar.')+' <a href="https://github.com/xikhar/papercraft" target="_blank" rel="noopener">xikhar/papercraft</a></p><details><summary>'+tr('Immunology references','Referências de imunologia')+'</summary><ul><li><a href="https://www.ncbi.nlm.nih.gov/books/NBK10757/">Janeway · Immunobiology</a></li><li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC4702236/">B Cells, Antibodies, and More</a></li><li><a href="https://pubmed.ncbi.nlm.nih.gov/9768759/">Babcock et al. · Epstein–Barr virus</a></li></ul></details>'+(state.started?button('restart',tr('Start another journey','Começar outra jornada'),'replay','sheet-link'):''),'immuno.games');break;
    case 'end':html=dialogFrame(tr('A shape remembered','Uma forma na memória'),'<div class="end-mark">'+shapeIcon(state.target)+'</div><p>'+esc(tr('Years later, you recognized the shape that began the journey with ','Anos depois, você reconheceu a forma que deu início à jornada de ')+state.name)+tr('. Her family lives on in the marrow and in the daughters of the memory B cell.','. A família dela continua na medula e nas descendentes da célula de memória.')+'</p>'+button('journal',tr('Open the family tree','Abrir a árvore da família'),'tree','primary submit','data-tab="family"'));break;
    case 'restart':html=dialogFrame(tr('Begin a new journey?','Começar outra jornada?'),'<p>'+tr('Starting again will replace the saved journey on this device.','Recomeçar vai substituir a jornada salva neste aparelho.')+'</p><div class="list">'+button('close',tr('Keep this journey','Manter esta jornada'),'journal')+button('new',tr('Begin again','Recomeçar'),'go')+'</div>');break;
  }
  $('dialog-inner').innerHTML=html;$('overlay').scrollTop=0;
  if(modal.type==='peptide')peptidePuzzler($('load-peptide'),lang,()=>{closeModal();engage('mhc',true);});
}
function begin(){
  audio.unlock();
  if(state.started){closeModal();setScreen('play');}else{draft=draft||state;openModal({type:'setup'});}
}
function hear(s){if(modal?.type==='setup')draftHeard=true;audio.play('motif',s.target);const v=$('dialog-inner').querySelector('.note-visual');if(v){v.classList.remove('play');void v.offsetWidth;v.classList.add('play');}}
function setLang(newLang){lang=newLang;savePrefs();drawText();renderModal();}
function toggleSound(){soundOn=!soundOn;audio.set(soundOn);savePrefs();drawText();if(modal)renderModal();}
function visitPlace(id){
  if(!visit(state,id))return;closeModal();persist();seenNear.clear();syncMap(true);showCue(stagePrompt(state));
}
function closeNative(){if(!$('overlay').open&&modal)closeModal();}
$('overlay').addEventListener('close',closeNative);
$('overlay').addEventListener('cancel',e=>{e.preventDefault();closeModal();});
$('overlay').addEventListener('click',e=>{
  if(e.target===$('overlay')){const r=$('overlay').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeModal();return;}
  const b=e.target.closest('[data-do]');if(!b)return;
  const a=b.dataset.do;audio.unlock();
  if(a==='close')closeModal();
  else if(a==='begin')begin();
  else if(a==='new'){draft=newJourney();draftHeard=false;openModal({type:'setup'});}
  else if(a==='mark'){draft.mark=Number(b.dataset.index);renderModal();$('dialog-inner').querySelector('[data-index="'+draft.mark+'"]')?.focus({preventScroll:true});}
  else if(a==='hear')hear(modal.type==='setup'?draft:state);
  else if(a==='lang')setLang(b.dataset.lang);
  else if(a==='sound')toggleSound();
  else if(a==='title'){closeModal();setScreen('title');}
  else if(a==='visit')visitPlace(b.dataset.place);
  else if(a==='lineage'){const branch=b.dataset.id;visitPlace(branch==='memory'&&state.unlocked===5?'recall':'marrow');openModal({type:'leaf',id:branch});}
  else if(a==='journal')openModal({type:'journal',tab:b.dataset.tab||'notes'});
  else if(a==='note')openModal({type:'leaf',id:b.dataset.id,parent:'journal'});
  else if(a==='approach')travelTo(b.dataset.id);
  else openModal({type:a});
});
$('overlay').addEventListener('input',e=>{if(e.target.id==='cell-name'&&draft)draft.name=e.target.value;});
$('overlay').addEventListener('submit',e=>{
  if(e.target.id!=='setup-form')return;e.preventDefault();draft.name=($('cell-name').value.trim()||'Luma').slice(0,28);
  draft.started=true;state=draft;draft=null;positions={};write(travelKey,positions);seenNear.clear();seenTip=false;savePrefs();persist();
  audio.unlock();closeModal();setScreen('play');audio.play(draftHeard?'water':'motif',state.target);draftHeard=false;
});
$('open').onclick=begin;$('how').onclick=()=>openModal({type:'how'});$('about').onclick=()=>openModal({type:'about'});
$('journal-button').onclick=()=>openModal({type:'journal',tab:'notes'});$('menu').onclick=()=>openModal({type:'menu'});
$('title-sound').onclick=toggleSound;$('pt').onclick=()=>setLang('pt');$('en').onclick=()=>setLang('en');
$('places').onclick=()=>openModal({type:'map'});$('cue-close').onclick=clearCue;
$('forward').onclick=()=>{audio.unlock();if(moving)view.stop();else view.advance();};
$('back-step').onclick=()=>view.advance(-1);$('interact').onclick=()=>view.approach($('interact').dataset.id,true);
$('other-near').onclick=()=>openModal({type:'near'});$('receptor-button').onclick=()=>{openModal({type:'receptor'});hear(state);};
const directions={ArrowUp:'up',w:'up',ArrowDown:'down',s:'down',ArrowLeft:'left',a:'left',ArrowRight:'right',d:'right'};
document.addEventListener('keydown',e=>{
  if(modal||screen!=='play'||e.altKey||e.ctrlKey||e.metaKey)return;
  if(directions[e.key]){e.preventDefault();view.key(directions[e.key],true);}
  else if(e.key==='Escape'){openModal({type:'menu'});}
  else if(e.key==='Enter'&&!e.target.closest?.('button,a,input')&&nearInfo.items.length){e.preventDefault();view.approach(nearInfo.items[0].id);}
});
document.addEventListener('keyup',e=>{if(directions[e.key])view.key(directions[e.key],false);});
document.addEventListener('visibilitychange',scheduleWitness);window.addEventListener('pagehide',()=>{if(screen==='play')savePosition(view.position());});
reduced.addEventListener?.('change',()=>syncMap());
setScreen('title');
