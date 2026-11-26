import {relayCopy} from './relay-copy.js?v=7';
import {FLIGHT, JOIN, TAKEOFF, LESION_DEFAULT, nodeCount, affected, route, geometry, transit, pulseAt, section, pairedRun, exampleCommands, landingPoint, setLesionDelay, tuning} from './conduction.js?v=7';
import {words,sources} from './words.js?v=3';
import {coaching} from './coaching.js?v=2';
import {clamp,lerp,smooth,CONTACT,SERIES,makeShot,readAt,diveAt,reachesBall,finish,handAt,ballAt,fieldState,seriesScore} from './rules.js?v=7';
import {drawField,fieldProject} from './field-print.js?v=2';
import {drawNerve,drawRelayRace} from './nerve.js?v=5';
import {MatchSound} from './sound.js?v=2';
import {matchCopy,pairTable,drawMatchedPitch,traceClock} from './match-comparison.js?v=7';
import {immuneCopy,immuneSources,immuneStops,immuneStage,drawImmune,drawBarrier,barrierView,sleeveX} from './immune.js?v=5';

const $=id=>document.getElementById(id), el={};
for(const id of ['view','arena','gl','field','neural','cinema','fieldWrap','tickets','dayDialogue','matchHud','phaseLabel','kickLabel','scoreValue','inset','mini','fieldCue','signalClock','liveHint','compareDock','flipStrip','result','matchBar','modal','modalBody','announce'])el[id]=$(id);
const icon=name=>`<svg aria-hidden="true"><use href="#i-${name}"/></svg>`;
const button=(action,label,klass='secondary',symbol='')=>`<button class="${klass}" data-a="${action}">${symbol?icon(symbol):''}<span>${label}</span></button>`;
const show=(node,value)=>{node.hidden=!value};
function load(key,fallback){try{return JSON.parse(localStorage.getItem('impossible-save.'+key))??fallback}catch{return fallback}}
function save(key,value){try{localStorage.setItem('impossible-save.'+key,JSON.stringify(value))}catch{/* Private browsing can still run a full series. */}}
const priorNodes=load('records.v2',[]),originalRecords=load('records',[]);
const earlierRecords=[0,1,2].map(i=>Math.max(Number(priorNodes?.[i])||0,Number(originalRecords?.[i])||0));
const rawRecords=load('records.relay',[]),records=[0,1,2,3].map(i=>Number.isFinite(rawRecords?.[i])?Math.max(0,rawRecords[i]):0);
const firstSeed=0x5e21b3;
const S={lang:load('language',/^pt/i.test(navigator.language||'')?'pt':'en')==='pt'?'pt':'en',day:0,eye:'right',readEye:null,mode:'home',age:0,time:0,stage:0,shot:makeShot(firstSeed),marks:[],summary:null,slot:0,slots:[],attempt:0,holding:false,holdAt:0,holdAge:0,flight:null,stageAge:0,feedback:null,finished:false,newBest:false,frozen:null,modal:null,tab:'how',caseAnswer:null,lessonDay:1,dayScores:[[],[],[]],traceDay:1,traceView:'pitch',pair:null,flipStage:0,flipT:0,replayT:0,replayOn:false,dialogFrame:null};
const audio=new MatchSound(load('sound',true)!==false,load('music',true)!==false);
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const languageBook=Object.fromEntries(['en','pt'].map(key=>[key,{...words[key],...relayCopy[key]}]));
const W=()=>languageBook[S.lang];
Object.assign(S,{hop:0,elapsed:0,readyAt:0,commands:[[],[],[]],queued:null,
  moreTime:load('relay.moreTime',false)===true,twoTaps:load('relay.twoTaps',false)===true,
  // Series rules: the first attempt at each kick counts, later attempts and pathway comparisons are practice.
  homeDay:3,level:[0,0,0,0],daySaves:[[],[],[],[]],dayQuiz:[[],[],[],[]],seriesN:0,practice:false,tickAt:0,
  tutorial:load('tutorial.done',false)!==true});
const QUIZ_BONUS=100;
function resetSeries(){S.dayScores=[[],[],[],[]];S.daySaves=[[],[],[],[]];S.dayQuiz=[[],[],[],[]];S.slots=S.dayScores[S.homeDay];resetSeason();}
// The season: lesions appear at the barrier, stay, and may partly remyelinate.
// Pathway states: 0 intact, 1 partly remyelinated, 2 demyelinated, 3 extensive demyelination.
const LESION=[[0,.5,.94,1.36],[0,.45,.86,1.25]], RING=[.7,.6,.52,.45], RECHARGE=1.15;
const season={optic:0,motor:0,blocked:0,total:0,entered:0,repaired:0,bonus:0,sleeves:{}};
const wave={claimed:[],cells:[],t:0,charges:0,maxCharges:0,recharge:0,treated:false,entered:0,held:0,attacks:[],sites:[],width:620,sleeves:season.sleeves};
function resetSeason(){Object.assign(season,{optic:0,motor:0,blocked:0,total:0,entered:0,repaired:0,bonus:0,sleeves:{}});wave.sleeves=season.sleeves;wave.cells=[];wave.attacks=[];}
const inSeason=()=>S.homeDay===3;
const dayFor=stage=>S.day!==3?S.day:stage===0?(season.optic?1:0):stage===1?(season.motor?2:0):0;
const kickDay=()=>S.day!==3?S.day:season.motor?2:season.optic?1:0;
function applyLesions(){
  if(S.day===3){setLesionDelay(LESION[0][season.optic],LESION[1][season.motor]);S.eye=season.optic?'left':'right'}else setLesionDelay();
  tuning.ring=RING[S.level[S.homeDay]];
}
const pathStatus=()=>{const t=W();return `${t.pathNames[0]}: ${t.lesionStates[season.optic]}. ${t.pathNames[1]}: ${t.lesionStates[season.motor]}.`};
const quizTotal=()=>S.dayQuiz[S.homeDay].reduce((a,b)=>a+(b>0?b:0),0)+(inSeason()?season.bonus:0);
const seriesTotal=()=>seriesScore(S.slots)+quizTotal();
const seriesSaves=()=>S.daySaves[S.homeDay].filter(Boolean).length;
const seriesComplete=()=>{for(let i=0;i<SERIES;i++)if(S.slots[i]===undefined)return false;return true};
const practiceRun=()=>S.day!==S.homeDay||(S.day===1&&eyeForRun()==='right')||S.slots[S.slot]!==undefined;
const C=()=>coaching[S.lang];
const P=()=>matchCopy[S.lang];
const I=()=>immuneCopy[S.lang];
const wall={time:0,treated:false,playing:false,role:0,boundAt:null};
const preserved=()=>S.day===3?kickDay()===0:S.day===0||(S.day===1&&eyeForRun()==='right');
const eyeForRun=()=>S.readEye??S.eye;
const matchStarted=()=>!['home','result','flip'].includes(S.mode);
const nf=n=>n.toLocaleString(S.lang==='pt'?'pt-BR':'en-US');
let world=null,worldPending=null,frameLast=performance.now(),lastDraw=-1,viewSize={w:0,h:0},lastField=null;
let activeInput=null,announced='',lastHint='';
const canvases=new WeakMap();
function context(canvas,w,h,limit=1.8){
  w=Math.max(1,Math.round(w));h=Math.max(1,Math.round(h));const dpr=Math.max(1,Math.min(devicePixelRatio||1,limit));
  let c=canvases.get(canvas);if(!c){c=canvas.getContext('2d');canvases.set(canvas,c)}
  if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr)}
  c.setTransform(canvas.width/w,0,0,canvas.height/h,0,0);return c;
}
new ResizeObserver(entries=>{const r=entries[0].contentRect;viewSize={w:Math.round(r.width),h:Math.round(r.height)};lastDraw=-1}).observe(el.view);
function preloadWorld(){
  if(worldPending)return worldPending;
  let probe;try{probe=document.createElement('canvas').getContext('webgl2',{failIfMajorPerformanceCaveat:true});}catch{probe=null;}
  if(!probe){worldPending=Promise.resolve(null);return worldPending;}
  probe.getExtension('WEBGL_lose_context')?.loseContext();
  worldPending=import('./scene.js?v=5').then(({makeWorld})=>{
    const ready=makeWorld(el.gl);ready.canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();world=null;el.gl.hidden=true;lastDraw=-1});world=ready;
    if(viewSize.w>1){const f=fieldState(S.shot,[],kickDay(),S.eye,0);world.render(viewSize.w,viewSize.h,f,S.shot);}return ready;
  }).catch(()=>{el.gl.hidden=true;return null});return worldPending;
}
const firstPaint=()=>{if('requestIdleCallback' in window)requestIdleCallback(preloadWorld,{timeout:1300});else setTimeout(preloadWorld,200)};
function tell(message){if(message!==announced){el.announce.textContent=message;announced=message}}
function applyLanguage(){
  announced='';el.announce.textContent='';const t=W();document.documentElement.lang=S.lang==='pt'?'pt-BR':'en';document.title=t.title+' · immuno.games';el.arena.setAttribute('aria-label',t.title);el.view.setAttribute('aria-label',t.controls);
  document.querySelectorAll('[data-t]').forEach(n=>n.textContent=t[n.dataset.t]);
  if(inSeason()){document.querySelector('.intro').textContent=t.seasonIntro;document.querySelector('#startBtn [data-t]').textContent=t.seasonPlay}document.querySelectorAll('[data-aria]').forEach(n=>n.setAttribute('aria-label',t[n.dataset.aria]));
  for(const lang of ['en','pt'])document.querySelectorAll(`[data-a="${lang}"]`).forEach(n=>n.setAttribute('aria-pressed',String(S.lang===lang)));
  $('heroTitle').innerHTML=`<small>${t.titleLines[0]}</small><span>${t.titleLines[1]}</span><strong>${t.titleLines[2]}</strong>`;
  const aud=$('audioBtn');aud.innerHTML=icon(audio.enabled?'volume':'mute');aud.setAttribute('aria-label',audio.enabled?t.soundOn:t.soundOff);aud.title=aud.getAttribute('aria-label');aud.setAttribute('aria-pressed',String(audio.enabled));
  el.tickets.innerHTML=t.shortDays.map((name,day)=>`<button class="ticket" data-a="day${day}" aria-pressed="${S.day===day}"><img width="48" height="44" src="assets/day-${day+1}.webp" alt=""><span>${name}</span></button>`).join('');
  el.dayDialogue.innerHTML=`<span><b>Joana</b> ${t.quotes[S.day]}${inSeason()?' · '+t.freeTraining:''}</span><button data-a="settings" class="flat-link">${t.access}</button>`;
  el.signalClock.setAttribute('aria-label',t.clockName);
  lastHint='';el.view.title='';drawUI();if(S.modal)dialogContent();
}
function setMode(mode){S.mode=mode;S.age=0;audio.scene(['home','result','flip','reverse'].includes(mode)?'full':'pulse');lastHint='';lastDraw=-1;document.body.dataset.mode=mode;drawUI();}
function nextSeed(){let a=new Uint32Array(1);if(window.crypto?.getRandomValues)crypto.getRandomValues(a);else a[0]=Math.random()*4294967296;let n=a[0]>>>0;for(let i=0;i<32;i++){const candidate=makeShot(n);if(candidate.seed!==S.shot.seed&&(candidate.side!==S.shot.side||Math.abs(candidate.y-S.shot.y)>.38))return n;n=(n+0x9e3779b9)>>>0}return (S.shot.seed+0x9e3779b9)>>>0;}
function selectDay(day){S.day=day;S.homeDay=day;S.slot=0;resetSeries();S.lessonDay=day===2?2:1;S.attempt=0;S.summary=null;S.marks=[];S.readEye=null;S.eye=day===1?'left':'right';S.shot=makeShot(firstSeed,0,S.level[day]);S.time=0;S.stage=0;S.hop=0;S.commands=[[],[],[]];S.finished=false;S.feedback=null;applyLesions();setMode('home');applyLanguage();}
function start(which='same'){
  if(inSeason()&&which==='same'&&S.mode!=='home')return;
  if(S.modal)closeDialog(false);if(which==='new'){
    // A comparison on another pathway was a visit. The series continues on the chosen training day.
    const visiting=S.day!==S.homeDay;S.day=S.homeDay;S.eye=S.day===1?'left':'right';S.slots=S.dayScores[S.day];
    if(S.slot===SERIES-1){if(seriesComplete())S.level[S.day]=clamp(S.level[S.day]+(seriesSaves()>=3?1:-1),0,3);S.slot=0;resetSeries();S.seriesN++}else S.slot++;
    if(S.day===0)S.lessonDay=1+(S.slot%2);S.shot=makeShot(nextSeed(), S.slot, S.level[S.day]);S.readEye=null;S.attempt=0;if(visiting)applyLanguage();}
  frameLast=performance.now();audio.unlock();preloadWorld();S.time=0;S.stage=0;S.hop=0;S.elapsed=0;S.readyAt=0;S.firstLook=S.tutorial?45:S.slot===0?.85:0;S.queued=null;S.streak=0;S.commands=[[],[],[]];S.readEye=null;S.marks=[];S.feedback=null;S.flight=null;S.finished=false;S.newBest=false;S.outcomeSound=false;S.summary=null;S.holding=false;S.attempt++;activeInput=null;S.stepBeat=0;S.caseAnswer=null;
  el.view.focus({preventScroll:true});
  if(inSeason()&&S.slot>0){gateOpen();return}
  applyLesions();setMode('run');tell(W().ready);
}
// ---- The barrier. T cells flow in the blood, dock at VCAM-1 and cross unless natalizumab binds them first.
function gateOpen(){
  const t=W(),view=barrierView(viewSize.w||620,viewSize.h||330),round=S.slot,level=S.level[3];
  const treated=round>=2,count=treated?round+1+level:1,speed=treated?1+.09*(round-2)+.13*level:1;
  const sites=[];for(let x=120;x<view.width-50;x+=78)sites.push(x);
  let at=.8;
  Object.assign(wave,{claimed:[],t:0,treated,charges:treated?2:0,maxCharges:treated?2:0,recharge:0,entered:0,held:0,attacks:[],sites,width:view.width,sleeves:season.sleeves});
  wave.cells=Array.from({length:count},()=>{
    const lane=[36,58,80][Math.floor(Math.random()*3)];
    const cell={born:at,x:-28,y:lane,lane,v:(treated?64+Math.random()*44:60)*speed,site:treated?sites[Math.floor(Math.random()*sites.length)]:sites[Math.min(2,sites.length-1)],state:'wait',age:0,phase:Math.random()*6};
    at+=(.55+Math.random()*.85)/Math.sqrt(speed);return cell;
  });
  if(treated)season.total+=count;
  wave.feedback=treated?'gateHow':'gateUntreated';
  wave.changedPaths=[];
  setMode('gate');tell(t.gateTitle+'. '+t[wave.feedback]);
}
function pickSleeve(x){
  let best=-1,gap=1e9;
  for(let n=0;sleeveX(n)+56<wave.width;n++){
    if(n===4||n===5||season.sleeves[n]==='gone'||wave.claimed.includes(n))continue;
    const d=Math.abs(sleeveX(n)+28-x)+(season.sleeves[n]==='thin'?0:8);
    if(d<gap){gap=d;best=n}
  }
  if(best>=0)wave.claimed.push(best);
  return best;
}
function gateStep(dt){
  wave.t+=dt;
  if(wave.treated&&wave.charges<wave.maxCharges){
    wave.recharge+=dt/RECHARGE;
    if(wave.recharge>=1){
      wave.charges++;wave.recharge=0;
      if(wave.feedback==='gateEmpty'){wave.feedback='gateHow';liveHint()}
    }
  }
  for(const c of wave.cells){
    if(c.state==='wait'){if(wave.t>=c.born)c.state='flow';continue}
    c.age+=dt;
    if(c.state==='flow'){
      c.x+=c.v*dt;c.y=c.lane+5*Math.sin(c.phase+c.age*2.2);
      if(c.x>=c.site-44){c.from={x:c.x,y:c.y};c.span=Math.hypot(c.site-c.x,91-c.y)/c.v;c.state='dock';c.age=0}
    }else if(c.state==='dock'){
      const u=clamp(c.age/c.span);c.x=lerp(c.from.x,c.site,smooth(u));c.y=lerp(c.from.y,91,smooth(u));
      if(u>=1){c.state='adhere';c.age=0}
    }else if(c.state==='adhere'){
      if(c.age>=.3){c.state='cross';c.age=0;wave.entered++;wave.feedback='gateCross';audio.miss();drawUI()}
    }else if(c.state==='cross'){
      const u=clamp(c.age/.9);c.y=lerp(91,172,smooth(u));
      if(u>=1){c.target=pickSleeve(c.x);c.from={x:c.x,y:c.y};c.state='attack';c.age=0}
    }else if(c.state==='attack'){
      const u=clamp(c.age/.7),tx=c.target<0?c.x:sleeveX(c.target)+28;c.x=lerp(c.from.x,tx,smooth(u));c.y=lerp(c.from.y,205,smooth(u));
      if(u>=1){c.state='in';c.age=0;if(c.target>=0)season.sleeves[c.target]='gone';wave.attacks.push({x:tx,age:0});audio.touch()}
    }else if(c.state==='bound'){
      c.x+=c.v*1.25*dt;c.y=lerp(c.y,c.lane-8,clamp(dt*4));if(c.x>wave.width+34)c.state='out';
    }
  }
  for(const a of wave.attacks)a.age+=dt;
  if(wave.cells.every(c=>c.state==='out'||(c.state==='in'&&c.age>.9)))gateClose();
}
function gateTap(px,py){
  if(S.mode!=='gate'||!wave.treated)return;
  if(wave.charges<1){wave.feedback='gateEmpty';audio.urgent();liveHint();return}
  const live=wave.cells.filter(c=>c.state==='flow'||c.state==='dock');
  let pick=null;
  if(px==null){
    // Keyboard and switch access: the antibody goes to the T cell closest to the wall.
    pick=live.sort((a,b)=>(a.site-a.x)/a.v-(b.site-b.x)/b.v)[0]??null;
    if(!pick)return;
  }else{
    const r=el.neural.getBoundingClientRect(),v=barrierView(viewSize.w,viewSize.h),x=(px-r.left)/v.s,y=(py-r.top-v.top)/v.s;
    let reach=Math.max(27,32/v.s);
    for(const c of live){const d=Math.hypot(c.x-x,c.y-y);if(d<reach){reach=d;pick=c}}
  }
  wave.charges--;
  if(pick){pick.state='bound';pick.age=0;wave.held++;season.blocked++;season.bonus+=40;wave.feedback='gateBound';audio.bind()}
  else{wave.feedback='gateMiss';audio.miss()}
  drawUI();
}
function gateRecap(t){
  const paths=wave.changedPaths.map(key=>t.pathNames[key==='optic'?0:1]+': '+t.lesionBrief[season[key]]+'.').join(' ');
  return wave.entered?t.gateIn(wave.entered)+' '+paths:t.gateHeld+' '+(paths||t.gateNoNew);
}
function gateClose(){
  if(wave.entered){
    const hit=new Set();
    for(let i=0;i<wave.entered;i++){const key=season.optic<=season.motor?'optic':'motor';season[key]=season[key]<2?2:3;hit.add(key)}
    season.entered+=wave.entered;
    wave.changedPaths=[...hit];
  }else{
    const key=season.optic>=season.motor?'optic':'motor';season.bonus+=100;
    if(season[key]>=2){
      season[key]--;season.repaired++;
      const gone=Object.keys(season.sleeves).find(n=>season.sleeves[n]==='gone');if(gone!==undefined&&season[key]===1)season.sleeves[gone]='thin';
      wave.changedPaths=[key];
    }
    audio.quiz(true);
  }
  setMode('gateEnd');tell(gateRecap(W()));
}
function gateLeave(){applyLesions();S.time=0;setMode('run');tell(W().ready);}
function canStartMatchedDay() {
  return S.mode === 'home' || (!inSeason() && (S.mode === 'result' || S.mode === 'flip'));
}
function playMatchedDay(day) {
  if (!canStartMatchedDay()) return;
  if(S.modal)closeDialog(false);
  if (S.mode === 'home') {
    selectDay(day);
    start();
    return;
  }
  if(day>0)S.lessonDay=day;
  S.day=day;S.eye=day===1?'left':'right';S.readEye=null;
  S.slots=S.dayScores[S.homeDay];S.attempt=0;
  start('same');applyLesions();applyLanguage();
}
function track() {
  return route(S.shot, S.stage);
}
function heldSeconds() {
  return S.holding ? Math.max(0, S.elapsed - S.holdAt) : null;
}
function stageWindow() {
  const p = track();
  return S.hop === 0 ? p.firstLimit : p.deadline;
}
function beginHold(id) {
  if (S.modal || S.holding) return;
  if (S.mode === 'land' && S.hop === 0 && S.stage < 2 && nextReady() - S.elapsed < 0.24) {
    S.queued = id;
    return;
  }
  if (S.mode !== 'surf') return;
  S.firstLook = 0;
  S.holding = true;
  activeInput = id;
  S.holdAt = S.elapsed;
  S.holdAge = Math.max(0, S.elapsed - S.readyAt);
  drawUI();
}
function releaseHold(id, timeout = false) {
  if (S.mode !== 'surf' || (!timeout && (!S.holding || id !== activeInput))) return;
  const wait = S.holding ? S.holdAge : Math.max(0, S.elapsed - S.readyAt);
  S.commands[S.stage][S.hop] = { wait, held: heldSeconds() ?? 0, idle: timeout };
  const mark = section(S.shot, dayFor(S.stage), eyeForRun(), S.stage, S.commands[S.stage]);
  S.marks[S.stage] = mark;
  S.flight = mark.nodes[S.hop];
  S.stageAge = S.elapsed;
  if (S.stage === 0 && S.hop === 0) S.readEye = S.eye;
  cancelHold();
  audio.jump();
  setMode('flight');
}
function cancelHold() {
  S.holding = false;
  activeInput = null;
  S.queued = null;
}
function armStage() {
  cancelHold();
  S.hop = 0;
  S.elapsed = 0;
  S.readyAt = 0;
  S.feedback = null;
  S.flight = null;
  setMode('surf');
  advanceClock();
  tell(W().signals[S.stage] + '. ' + (S.twoTaps ? W().twoJump : W().jump));
}
function nextReady() {
  const first = S.marks[S.stage].nodes[0];
  return first.up + FLIGHT + transit(dayFor(S.stage), eyeForRun(), S.stage, first);
}
function armNext() {
  const queued = S.queued;
  cancelHold();
  S.hop = 1;
  S.readyAt = nextReady();
  S.feedback = null;
  S.flight = null;
  setMode('surf');
  advanceClock();
  if (queued !== null) beginHold(queued);
  tell(W().nextNode);
}

function openExit(){S.summary=finish(S.shot,S.marks,kickDay(),eyeForRun());setMode('exit');if(S.summary.outcome!=='beaten')audio.touch();}
function recordResult(){
  if(S.finished)return;S.finished=true;const res=S.summary,score=Math.round(res.score*(1+.1*S.level[S.homeDay]));S.earned=score;S.practice=practiceRun();
  if(!S.practice){S.slots[S.slot]=score;S.daySaves[S.homeDay][S.slot]=res.saved;}
  if(S.tutorial){S.tutorial=false;save('tutorial.done',true)}
  const total=seriesTotal();S.newBest=!S.practice&&total>records[S.homeDay];if(S.newBest){records[S.homeDay]=total;save('records.relay',records)}
  if(res.outcome==='catch')audio.held();
  if(!S.practice&&S.slot===SERIES-1&&seriesComplete())audio.series(seriesSaves()>=3);
  setMode('result');tell(W().outcomes[res.outcome]+' '+score+' '+W().points);
}
function liveLabel(){const t=W();if(S.mode==='gate')return t.gateTitle;if(S.mode==='gateEnd')return t.gateAfter;if(['run','eye'].includes(S.mode))return S.slot===0&&!practiceRun()?t.goal:t.ready;if(S.mode==='result')return t.result;if(['flip','reverse'].includes(S.mode))return t.review;if(S.mode==='exit')return S.summary?.outcome==='beaten'?t.noContact:t.contact;if(S.mode==='touch')return t.contact;return t.stages[S.stage];}
function grade(mark){
  const names=W().jumpTags;
  if(mark.timeout)return names[5];
  if(mark.perfect)return names[2];
  return names[mark.band==='edge'?(mark.delta<0?3:4):(mark.delta<0?0:1)];
}
function cues(){const t=W(),m=S.marks;
  if(S.stage>=2&&m[1])return diveAt(S.shot,m,kickDay(),eyeForRun())<.47?t.diveEarly:t.diveLate;
  if(m[0])return readAt(S.shot,m,kickDay(),eyeForRun())<.262?t.readEarly:t.readLate;return '';
}
function coachingReason(reference) {
  const out=S.summary.outcome, [vision,motor]=S.marks;
  if(out==='beaten'){
    if(!preserved()&&reference.touches)return kickDay()===1?'visual':'coord';
    if(vision.band!=='perfect'&&motor.band!=='perfect'&&vision.quality<.51&&motor.quality<.51)return 'both';
    if(1-vision.quality>(1-motor.quality)*1.48)return 'visual';
    return kickDay()===2?'coord':'motor';
  }
  return out==='tip'&&(vision.quality<.46||vision.nodes?.[0]?.band==='miss')?'rescue':out;
}
function gamePair(day = S.lessonDay, commands = S.commands) {
  return [pairedRun(S.shot, commands, 0), pairedRun(S.shot, commands, day)];
}
function resultCard() {
  const t = W(),
    a = S.summary,
    day = preserved() ? 0 : kickDay(),
    compareDay = day === 0 ? 1 : day === 1 ? 2 : 0;
  const reason = S.commands.flat().every((c) => c.idle)
    ? t.noMove
    : day
      ? t.consequence[day]
      : C().reason[coachingReason(gamePair()[0])];
  const last = S.slot === SERIES - 1,
    ended = last && seriesComplete(),
    won = seriesSaves() >= 3,
    asked = S.dayQuiz[S.homeDay][S.slot] !== undefined;
  const verdict = ended
    ? `<b>${inSeason() ? (won ? t.seasonWon : t.seasonLost) : won ? t.seriesWon : t.seriesLost}</b> ${seriesSaves()}/${SERIES} ${t.savesWord} · ${nf(seriesTotal())} ${t.points}.${won && S.level[S.homeDay] < 3 ? ' ' + t.levelUp : ''}<br>`
    : '';
  const seasonal = inSeason();
  if (seasonal) {
    el.result.innerHTML = `<small class="outcome-label">${t.practices[3]} · ${S.slot + 1}/${SERIES} · ${t.savesCount(seriesSaves())}</small><div class="result-head"><h2>${t.outcomes[a.outcome]}</h2><div class="earned">+${nf(S.earned ?? a.score)}<small>${S.newBest ? t.newBest : t.points}</small></div></div><p class="match-reason">${verdict}${S.slot ? pathStatus() + '<br>' : ''}${reason}</p>
    <div class="result-buttons">${button(ended ? 'seasonEnd' : 'new', ended ? t.seasonSummary : t.nextRound, 'primary', ended ? 'cup' : 'ball')}</div>
    <div class="minor-actions">${button('case', t.quizLink + ' · ' + (asked ? t.quizDone : t.bonusPts(QUIZ_BONUS)), '', 'book')}${button('flip', t.discover, '', 'flip')}</div>`;
    return;
  }
  el.result.innerHTML = `<small class="outcome-label">${t.practices[S.day]} · ${S.slot + 1}/${SERIES} · ${t.savesCount(seriesSaves())}</small><div class="result-head"><h2>${t.outcomes[a.outcome]}</h2><div class="earned">+${nf(S.earned ?? a.score)}<small>${S.practice ? t.practiceTag : S.newBest ? t.newBest : t.points}</small></div></div><p class="match-reason">${verdict}${reason}</p>
    <div class="result-buttons">${button('new', last ? t.nextSeries : t.newBall, 'primary', 'ball')}${button('same', t.practiceRetry, 'secondary', 'repeat')}${button('paired-' + compareDay, t.primaryCompare[day], 'secondary', 'play')}</div>
    <div class="minor-actions">${button('case', t.quizLink + ' · ' + (asked ? t.quizDone : t.bonusPts(QUIZ_BONUS)), '', 'book')}${button('flip', t.discover, '', 'flip')}${button('replay', t.rewind, '', 'play')}</div>`;
}
function liveHint() {
  const t = W(),
    m = S.mode;
  let text = '',
    tone = 'plain';
  if (m === 'surf') {
    if (!S.holding) text = S.twoTaps ? t.twoJump : t.jump;
    else {
      const g = geometry(track(), S.hop, S.holdAge, heldSeconds());
      const aligned = Math.abs(g.targetX - g.landingX) <= g.targetRadius;
      // The release cue is a learning aid. It goes away after the first round and above level 1.
      const cue = aligned && S.level[S.homeDay] === 0 && (!inSeason() || S.slot === 0);
      text = cue ? (S.twoTaps ? t.tapFire : t.fire) : S.twoTaps ? t.tapAim : t.aim;
      tone = cue ? 'ready' : 'plain';
    }
  } else if (m === 'land') {
    const running = S.hop === 0 && S.stage < 2 && S.age > 0.14;
    const lesion = running && affected(dayFor(S.stage), eyeForRun(), S.stage);
    const state = S.day === 3 ? (S.stage === 0 ? season.optic : season.motor) : 2;
    text = running
      ? lesion
        ? state === 1
          ? t.slowThin
          : state === 3
            ? t.slowWide
            : S.stage === 0
              ? t.slowOptic
              : t.slowMotor
        : t.quickRelay
      : grade(S.feedback) + (S.streak > 1 ? ' ×' + S.streak : '');
    tone = lesion ? 'delayed' : S.feedback?.perfect ? 'ready' : 'plain';
  }
  if (m === 'gate' || m === 'gateEnd') {
    text = m === 'gate' ? t[wave.feedback] : gateRecap(t);
    tone = m === 'gateEnd' ? (wave.entered ? 'delayed' : 'ready') : 'plain';
  }
  show(el.liveHint, !!text);
  if (text + tone !== lastHint) {
    if (S.holding && tone === 'ready') audio.sound(635, 820, 0.07, 0.075, 'triangle');
    el.liveHint.textContent = text;
    el.liveHint.dataset.tone = tone;
    lastHint = text + tone;
  }
}
function drawUI() {
  const t = W(),
    m = S.mode,
    home = m === 'home',
    neural = ['surf', 'flight', 'land', 'switch'].includes(m),
    res = m === 'result',
    flip = m === 'flip';
  show(el.matchHud, !home && !flip && m !== 'reverse');
  show(el.matchBar, !home && !res && !flip && m !== 'reverse');
  show(el.inset, neural);
  show(el.result, res);
  show(el.flipStrip, flip);
  show(el.signalClock, neural && m !== 'switch');
  show(el.compareDock, S.day === 1 && !res && !home && !flip && m !== 'reverse');
  const rehearsal = S.finished ? S.practice : m !== 'home' && practiceRun(),
    level = S.level[S.homeDay];
  el.kickLabel.textContent = `${t.practices[S.day]} · ${S.slot + 1}/${SERIES}${level ? ' · ' + t.levelTag + ' ' + (level + 1) : ''}${rehearsal ? ' · ' + t.practiceTag : ''}`;
  el.phaseLabel.textContent = neural ? t.signals[S.stage] : liveLabel();
  el.scoreValue.textContent = nf(seriesTotal()) + ' ' + t.points;
  const gating = m === 'gate' || m === 'gateEnd',
    worn = (i) => (S.day === 3 && i < 2 && [season.optic, season.motor][i] ? ' · ' + t.lesionShort[[season.optic, season.motor][i]] : '');
  // During the barrier the bar shows the whole chain of cause and effect. During the kick it shows the circuits.
  const status = gating
    ? t.chain.map((name, i) => `<span class="${i === (m === 'gate' ? 0 : 1) ? 'now' : i < (m === 'gate' ? 0 : 1) ? 'done' : ''}"><i></i>${name}</span>`).join('')
    : [0, 1, 2]
        .map(
          (i) =>
            `<span class="${i === S.stage ? 'now' : i < S.stage ? 'done' : ''}"><i></i>${t.circuits[i]}${worn(i)}</span>`,
        )
        .join('');
  el.matchBar.innerHTML = `<div class="little-path">${status}</div><b>${gating ? (wave.treated ? t.gateCount(wave.held, wave.entered) : '') : neural ? t.nodeName + ' ' + (S.hop + 1) + '/' + nodeCount(S.stage) : ''}</b>`;
  liveHint();
  if (res) resultCard();
  if (flip) {
    const st = S.flipStage,
      damaged = affected(dayFor(st), S.flipEye, st),
      line = damaged ? t.explain[dayFor(st)] : st === 0 ? t.explain[0] : t.flipLines[st];
    el.flipStrip.innerHTML = `<div><h2>${damaged ? t.pathways[dayFor(st)] : t.anatomyNames[st]}</h2><p>${line}</p></div><div class="action-row">${inSeason() ? button('backResult', t.returnResult, 'primary', 'play') : button('same', t.resetSame, 'primary', 'repeat')}${button('circuit', t.nextCircuit, 'secondary')}${button('immune', t.inTissue, 'flat-link', 'book')}${button('backResult', t.returnResult, 'flat-link')}</div>`;
  }
  el.fieldCue.textContent = neural ? cues() : '';
}
function advanceClock() {
  const p = track(),
    remaining = 1 - clamp(S.elapsed / p.deadline);
  el.signalClock.style.setProperty('--time', remaining);
  el.signalClock.dataset.urgent = String(remaining < 0.26);
  if (remaining < 0.26 && remaining > 0 && S.mode === 'surf' && Math.abs(S.time - S.tickAt) > 0.3) {
    S.tickAt = S.time;
    audio.urgent();
  }
  const n = Math.round(remaining * 100);
  if (el.signalClock.getAttribute('aria-valuenow') !== String(n))
    el.signalClock.setAttribute('aria-valuenow', n);
  liveHint();
}
function advance(dt) {
  S.time += dt;
  S.age += ['run', 'eye', 'touch', 'exit'].includes(S.mode) ? dt * S.shot.pace : dt;
  if (['surf', 'flight', 'land'].includes(S.mode)) {
    const look =
      S.mode === 'surf' && !S.holding && S.stage === 0 && S.hop === 0 ? Math.min(dt, S.firstLook || 0) : 0;
    S.firstLook = Math.max(0, (S.firstLook || 0) - look);
    S.elapsed += dt - look;
  }
  if (S.mode === 'gate') gateStep(dt);
  else if (S.mode === 'gateEnd') {
    for (const a of wave.attacks) a.age += dt;
    wave.t += dt;
    if (S.age >= 4.2) gateLeave();
  } else if (S.mode === 'run') {
    let beat = Math.min(3, Math.floor(S.age / 0.18));
    if (beat > S.stepBeat) {
      S.stepBeat = beat;
      audio.step(beat);
    }
    if (S.age >= 0.69) {
      audio.kick();
      setMode('eye');
    }
  } else if (S.mode === 'eye' && S.age >= 0.58) armStage();
  else if (S.mode === 'surf') {
    if (S.elapsed >= stageWindow()) releaseHold(null, true);
    else advanceClock();
  } else if (S.mode === 'flight') {
    advanceClock();
    if (S.elapsed >= S.flight.up + FLIGHT) {
      S.feedback = S.flight;
      S.streak = S.feedback.perfect ? S.streak + 1 : 0;
      audio.land(S.feedback.quality, S.stage);
      if (S.streak >= 3) audio.sound(430 + S.streak * 75, 560 + S.streak * 74, 0.11, 0.065, 'triangle', 0.07);
      setMode('land');
      tell(grade(S.feedback));
    }
  } else if (S.mode === 'land') {
    advanceClock();
    if (S.hop === 0 && S.stage < 2) {
      if (S.elapsed >= nextReady()) {
        audio.sound(415, 640, 0.1, 0.085, 'triangle');
        armNext();
      }
    } else if (S.elapsed >= S.flight.up + FLIGHT + JOIN) {
      if (S.stage === 0) {
        setMode('switch');
        audio.fold();
      } else if (S.stage === 1) {
        S.contactFrom = phaseProgress();
        if (!reachesBall(S.shot, S.marks, kickDay(), eyeForRun())) openExit();
        else {
          setMode('touch');
          audio.touch();
        }
      } else openExit();
    }
  } else if (S.mode === 'switch' && S.age >= 0.43) {
    S.stage = 1;
    armStage();
  } else if (S.mode === 'touch' && S.age >= 0.68) {
    S.stage = 2;
    armStage();
  } else if (S.mode === 'exit') {
    if (!S.outcomeSound && S.age > 0.29) {
      S.outcomeSound = true;
      audio.result(S.summary.saved);
    }
    if (S.age >= 1.65) {
      S.outcomeSound = false;
      recordResult();
    }
  } else if (S.mode === 'reverse' && S.age >= 0.89) {
    S.flipT = 0;
    setMode('flip');
  } else if (S.mode === 'flip') {
    S.flipT += dt;
  }
}
function phaseProgress() {
  const p = track(),
    read = readAt(S.shot, S.marks, kickDay(), eyeForRun());
  const fraction = clamp(S.elapsed / (p.deadline + FLIGHT));
  if (S.stage === 0) {
    const raw = 0.063 + 0.322 * fraction;
    if (S.marks[0]?.complete && S.mode === 'land')
      return Math.max(raw, lerp(raw, read + 0.022, clamp(S.age / JOIN)));
    return raw;
  }
  if (S.stage === 1) return lerp(read + 0.025, 0.745, fraction);
  return CONTACT;
}
function pitchFrame() {
  const a = S.age,
    m = S.mode,
    shot = S.shot,
    marks = S.marks;
  let t = 0,
    extra = {};
  if (m === 'home') {
    extra.clap = Math.pow(Math.max(0, Math.sin(a * 3.15)), 5);
  } else if (m === 'run') {
    extra.run = clamp(a / 0.66);
    extra.kick = smooth((a - 0.49) / 0.25);
    extra.clap = (1 - extra.run) * 0.45;
  } else {
    extra.run = 1;
    extra.kick = 1;
    if (m === 'eye') {
      t = lerp(0, 0.055, clamp(a / 0.62));
      extra.camera = 'eye';
      extra.cameraT = clamp(a / 0.62);
    } else if (['surf', 'flight', 'land', 'switch'].includes(m)) {
      t = phaseProgress();
    } else if (m === 'touch') {
      t = lerp(S.contactFrom ?? 0.735, CONTACT, smooth(a / 0.68));
      extra.camera = 'contact';
      extra.cameraT = clamp(a / 0.68);
    } else if (m === 'exit') {
      const x = clamp(a / 1.65),
        miss = S.summary.outcome === 'beaten';
      if (miss)
        t =
          x < 0.34
            ? lerp(S.contactFrom ?? 0.735, CONTACT, smooth(x / 0.34))
            : lerp(CONTACT, 1, smooth((x - 0.49) / 0.51));
      else t = lerp(CONTACT, 1, smooth((x - 0.09) / 0.88));
      extra.camera = miss ? 'miss' : 'exit';
      extra.cameraT = x;
      extra.outcome = S.summary.outcome;
    } else {
      t = 1;
      extra.outcome = S.summary?.outcome;
      extra.camera = 'result';
      if (m === 'reverse') extra.fold = smooth(a / 0.89);
    }
  }
  const f = fieldState(shot, marks, kickDay(), eyeForRun(), t, { time: S.time, phase: m, ...extra });
  if (m === 'home' || m === 'run' || m === 'eye') {
    delete f.hand;
    f.pose = { x: 0, y: 0, z: -3.1, tilt: 0 };
  }
  return f;
}
function nerveFrame(stage, mode = S.mode) {
  const plan = route(S.shot, stage),
    isReplay = mode === 'flip';
  const eye = isReplay ? S.flipEye : eyeForRun(),
    day = dayFor(stage);
  const evidence = S.commands[stage],
    marks =
      isReplay && evidence?.length
        ? section(S.shot, day, eye, stage, evidence)?.nodes
        : S.marks[stage]?.nodes;
  const first = marks?.[0],
    last = marks?.at(-1);
  let elapsed = S.elapsed,
    hop = S.hop,
    held = heldSeconds(),
    wait = S.holding ? S.holdAge : Math.max(0, elapsed - S.readyAt),
    phase = mode;
  if (isReplay && first) {
    const length = last.up + FLIGHT + JOIN;
    elapsed = S.flipT % (length + 0.64);
    hop = marks[1] && elapsed >= marks[1].ready ? 1 : 0;
    const n = marks[hop];
    wait = clamp(elapsed - n.ready, 0, n.wait);
    held = elapsed >= n.ready + n.wait ? clamp(elapsed - n.ready - n.wait, 0, n.held) : null;
    phase = elapsed < n.up ? 'surf' : elapsed < n.up + FLIGHT ? 'flight' : 'land';
  } else if (stage !== S.stage && !isReplay) {
    hop = 0;
    elapsed = 0;
    wait = 0;
    held = null;
    phase = 'surf';
  }
  const n = marks?.[hop],
    willJump = phase === 'surf';
  const g = !willJump && n ? n.geometry : geometry(plan, hop, wait, held);
  const origin = plan.nodes[hop * 2];
  let scroll = origin - TAKEOFF,
    ref = null,
    at = landingPoint(g, 0);
  let axle = false,
    flux = 0;
  if (!willJump && n) {
    at = landingPoint(g, (elapsed - n.up) / FLIGHT);
    if (phase === 'land' && hop === 0 && stage < 2) {
      const duration = transit(day, eye, stage, first),
        normal = transit(0, 'right', stage, first);
      const since = Math.max(0, elapsed - first.up - FLIGHT),
        e = clamp(since / duration);
      flux = pulseAt(since, duration, normal);
      const a = plan.nodes[1],
        b = plan.nodes[2],
        settle = 1 - smooth(since / 0.11);
      at = {
        x: lerp(a, b, flux) + (g.landingX - a) * settle,
        y: g.targetY - 0.014 * Math.sin(Math.PI * flux),
      };
      if (affected(day, eye, stage)) ref = lerp(a, b, clamp(since / normal));
      scroll = (b - TAKEOFF) * smooth(e);
      axle = true;
    }
  }
  // A fixed overview keeps both jumps visible when the player prefers reduced motion.
  const fixed = reduced.matches && stage < 2;
  const scale = fixed ? 0.85 / (plan.nodes[3] - plan.nodes[0]) : 1;
  const project = (x) => (fixed ? 0.075 + (x - plan.nodes[0]) * scale : x - scroll);
  return {
    ...g,
    stage,
    day: day === 1 && eye === 'right' ? 0 : day,
    time: S.time,
    track: (stage === 2 ? plan.nodes.slice(0, 2) : plan.nodes).map(project),
    launchX: project(g.launchX),
    targetX: project(g.targetX),
    targetRadius: g.targetRadius * scale,
    referenceRadius: g.referenceRadius * scale,
    landingX: project(g.landingX),
    referenceX: ref === null ? null : project(ref),
    nextX: stage < 2 && hop === 0 ? project(plan.nodes[2]) : null,
    sparkX: project(at.x),
    sparkY: at.y,
    travel: clamp((scroll + 0.12) / 1.3),
    prediction: willJump,
    holding: willJump && held !== null,
    noTarget: axle && flux > 0.3,
    quality: n?.quality ?? 0,
    feedback: phase === 'land' && n ? clamp(1 - (elapsed - n.up - FLIGHT) / 0.3) : 0,
  };
}
let homeCanvasTime = -1;
function drawHomeSignal() {
  const n = $('homeAxon'),
    w = n.clientWidth,
    h = n.clientHeight;
  if (w < 2 || h < 2) return;
  const plan = route(S.shot, 0),
    duration = 2.4,
    phase = (S.age % duration) / duration;
  const g = geometry(plan, 0, 0, plan.wind[0]);
  const t = reduced.matches ? 0.45 : clamp(phase / 0.64),
    spark = landingPoint(g, t);
  const x =
    phase > 0.64 && !reduced.matches ? lerp(plan.nodes[1], plan.nodes[2], (phase - 0.64) / 0.36) : spark.x;
  drawNerve(context(n, w, h, 1.2), w, h, {
    ...g,
    track: plan.nodes,
    stage: 0,
    day: S.day === 3 ? 0 : S.day,
    time: S.time,
    sparkX: x,
    sparkY: spark.y,
    prediction: phase < 0.67,
    holding: false,
    noTarget: false,
    nextX: plan.nodes[2],
  });
}

function field2D(c,w,h,f){
  const isClose=['eye','contact','exit','miss'].includes(f.camera);let z=1,anchor=null,centering=0;
  if(isClose){
    if(f.camera==='eye'){anchor={x:f.eye==='left'?.08:-.08,y:2.13,z:-3.1};z=1+8*smooth(f.cameraT);centering=smooth(f.cameraT)}
    else if(f.camera==='miss'){
      anchor={x:lerp(f.hand.x,f.ball.x,.55),y:lerp(f.hand.y,f.ball.y,.55),z:lerp(f.hand.z,f.ball.z,.55)};
      centering=smooth(f.cameraT/.27)*(1-smooth((f.cameraT-.65)/.35));z=1+3.8*centering;
    }else{anchor=f.hand??f.ball;z=f.camera==='contact'?1+3*smooth(f.cameraT):1+7*(1-smooth(f.cameraT));centering=f.camera==='contact'?smooth(f.cameraT):1-smooth(f.cameraT)}
  }
  if(reduced.matches){z=1+(z-1)*.32;centering*=.65}
  c.save();if(anchor){const q=fieldProject(w,h,anchor.x,anchor.y,anchor.z);c.translate(lerp(q.x,w*.5,centering),lerp(q.y,h*.51,centering));c.scale(z,z);c.translate(-q.x,-q.y);}
  if(f.fold){c.translate(w/2,h/2);c.scale(1,Math.max(.008,Math.abs(Math.cos(Math.PI*f.fold))));c.translate(-w/2,-h/2)}
  drawField(c,w,h,f);c.restore();
}
function miniPitch(w,h,f){const c=context(el.mini,w,h,1.5);drawField(c,w,h,f);const b=f.ball,q=fieldProject(w,h,b.x,b.y,b.z),r=Math.max(4,w*.032);
  c.save();c.lineWidth=1.3;c.strokeStyle='#102c37';c.beginPath();c.arc(q.x,q.y,r+1,0,Math.PI*2);c.stroke();c.strokeStyle='#ffdc83';c.setLineDash([3,2]);c.beginPath();c.arc(q.x,q.y,r,0,Math.PI*2);c.stroke();c.restore();
  el.mini.classList.toggle('affected',dayFor(0)===1&&S.eye==='left');
  const t=W(),read=readAt(S.shot,S.marks,kickDay(),eyeForRun());
  const readNow=S.marks[0]?.complete&&f.progress>=read-.002;
  let cue=readNow?(S.shot.side<0?t.shotLeft:t.shotRight):'';
  if(S.stage===0&&!readNow&&affected(dayFor(0),eyeForRun(),0)&&S.mode==='land'&&S.hop===0)cue=P().pulseWait;
  if(dayFor(1)===2&&S.stage===1&&S.marks[1]){
    if(S.refMark!==S.marks[1]){S.refMark=S.marks[1];S.motorRef=gamePair(2)[0];}
    const ref=S.motorRef,at=handAt(S.shot,ref.marks,0,'right',f.progress),ghost=fieldProject(w,h,at.x,at.y,at.z);
    c.save();c.strokeStyle='#fff3c9';c.lineWidth=1.6;c.setLineDash([3,2]);c.strokeRect(ghost.x-4,ghost.y-4,8,8);c.restore();
  }

  if(el.fieldCue.textContent!==cue)el.fieldCue.textContent=cue;
}
// A moving aperture connects the camera to the printed axon and the actual fingertip contact point.
function portal(c,w,h,openness,at,side){
  const u=clamp(openness),cx=lerp(w*.5,at?.x??w*.5,.18*Math.sin(Math.PI*u)),cy=lerp(h*.5,at?.y??h*.5,.18*Math.sin(Math.PI*u));
  const R=Math.hypot(w,h)*.65,r=Math.max(1,R*u*u), palettes=['#193641','#294d54','#67938d','#8da89a','#cfb780','#e5cc91'];
  c.save();c.translate(cx,cy);c.rotate(side*.095*(1-u));c.scale(1,.91);
  let outer=R*3;for(let k=0;k<6;k++){const radius=r+(5-k)*Math.min(h,w)*.061*(1-u);c.beginPath();c.arc(0,0,outer,0,2*Math.PI);c.moveTo(radius,0);c.arc(0,0,radius,0,2*Math.PI,true);c.fillStyle=palettes[k];c.fill('evenodd');outer=radius;}
  for(let k=0;k<13;k++){let a=(k+.4)*Math.PI*2/13;c.strokeStyle='#3a5a4f88';c.lineWidth=2;c.beginPath();c.moveTo(Math.cos(a)*r,Math.sin(a)*r);c.lineTo(Math.cos(a+.08)*(r+Math.min(w,h)*.14),Math.sin(a+.08)*(r+Math.min(w,h)*.14));c.stroke()}c.restore();
}
function draw(now){
  const {w,h}=viewSize;if(w<1||h<1)return;const m=S.mode;
  const surf=['surf','flight','land','switch','flip'].includes(m),reversing=m==='reverse'&&!world&&S.age>.445;
  if(m==='gate'||m==='gateEnd'){
    show(el.gl,false);show(el.fieldWrap,false);show(el.cinema,false);show(el.neural,true);
    drawBarrier(context(el.neural,w,h),w,h,wave,I());return;
  }
  const f=pitchFrame();if(reduced.matches&&['eye','contact','exit','miss'].includes(f.camera)){f.camera='duel';f.cameraT=0;}lastField=f;const useGL=!!world&&m!=='home'&&!surf&&!reversing;
  show(el.gl,useGL);show(el.field,!useGL);show(el.fieldWrap,!surf&&!reversing);show(el.neural,surf||reversing);const affected=dayFor(0)===1&&S.eye==='left';el.fieldWrap.classList.toggle('affected',affected);
  if(!surf&&!reversing){if(useGL){try{world.render(w,h,f,S.shot)}catch{world=null;show(el.gl,false);show(el.field,true);field2D(context(el.field,w,h),w,h,f)}}else{const c=context(el.field,w,h);c.clearRect(0,0,w,h);field2D(c,w,h,f)}}
  if(m==='home'&&(S.time-homeCanvasTime>.045||S.time<homeCanvasTime)){drawHomeSignal();homeCanvasTime=S.time;}
  if(surf||reversing){const c=context(el.neural,w,h);let stage=m==='flip'||reversing?S.flipStage:S.stage,mode=reversing?'flip':m;let stretch=1;
    if(m==='switch'){const t=clamp(S.age/.43);if(t>=.5){stage=1;mode='surf'}stretch=Math.max(.025,Math.abs(Math.cos(t*Math.PI)));}
    if(reversing){stretch=Math.max(.025,-Math.cos(Math.PI*clamp(S.age/.89)));}
    c.fillStyle='#15333d';c.fillRect(0,0,w,h);c.save();if(stretch!==1&&!reduced.matches){c.translate(0,h/2);c.scale(1,stretch);c.translate(0,-h/2)}
    drawNerve(c,w,h,nerveFrame(stage,mode));c.restore();if(!el.inset.hidden){miniPitch(Math.max(20,el.mini.clientWidth),Math.max(10,el.mini.clientHeight),f)}
  }
  let aperture=null;if(m==='eye'&&S.age>.28)aperture=1-smooth((S.age-.28)/.34);
  else if(m==='surf'&&S.stage===0&&S.age<.17)aperture=smooth(S.age/.17);
  else if(m==='touch'&&S.age>.5)aperture=1-smooth((S.age-.5)/.18);
  else if(m==='surf'&&S.stage===2&&S.age<.13)aperture=smooth(S.age/.13);
  else if(m==='exit'&&S.summary.outcome!=='beaten'&&S.age<.52)aperture=smooth(S.age/.52);
  if(reduced.matches)aperture=null;
  show(el.cinema,aperture!==null);if(aperture!==null){const c=context(el.cinema,w,h);c.clearRect(0,0,w,h);const target=f.hand??f.ball;const pt=useGL?world?.project(target):fieldProject(w,h,target.x,target.y,target.z);portal(c,w,h,aperture,pt,S.shot.side)}
}
function drawEye(){const canvas=$('eyeScreen');if(!canvas||!S.dialogFrame)return;const w=Math.max(1,canvas.clientWidth),h=Math.max(1,canvas.clientHeight),c=context(canvas,w,h);
  c.save();const frozen=S.dialogFrame;drawField(c,w,h,frozen);
  const q=fieldProject(w,h,lerp(-.84,-.62,frozen.run),1.44,lerp(5.57,4.36,frozen.run));
  const radius=h*.235,cx=radius+12,cy=radius+10,scale=canvas.width/w,area=radius*.56;
  c.beginPath();c.arc(cx,cy,radius,0,Math.PI*2);c.clip();c.drawImage(canvas,(q.x-area)*scale,(q.y-area)*scale,area*2*scale,area*2*scale,cx-radius,cy-radius,radius*2,radius*2);c.restore();
  c.strokeStyle='#f3d996';c.lineWidth=2;c.beginPath();c.arc(cx,cy,radius,0,Math.PI*2);c.stroke();canvas.classList.toggle('affected',S.eye==='left');}
function updatePair(){
  S.pair=gamePair(S.traceDay, S.summary ? S.commands : exampleCommands(S.shot));
}
function pathChart(canvas,which){const w=canvas.clientWidth||180,h=canvas.clientHeight||120,c=context(canvas,w,h);c.fillStyle='#204449';c.fillRect(0,0,w,h);
  const [ref,trial]=S.pair, end=ballAt(S.shot,trial.marks,trial.day,trial.eye,1,trial.result?.outcome);
  const pad=w*.07,bottom=h*.87,scale=(w-2*pad)/(2*Math.max(4.83,Math.abs(end.x)+.31)),ys=Math.min(h*.225,scale*1.55),project=p=>({x:w/2+p.x*scale,y:bottom-p.y*ys});
  const endpoint=trial.result?1:CONTACT, cursor=Math.min(S.replayT,endpoint);
  const at=(q,kind)=>{
    if(kind==='ball')return ballAt(S.shot,trial.marks,trial.day,trial.eye,q,trial.result?.outcome);
    if(kind==='reference')return handAt(S.shot,ref.marks,ref.day,ref.eye,q);
    return fieldState(S.shot,trial.marks,trial.day,trial.eye,q,{outcome:trial.result?.outcome}).hand;
  };
  const p0=project({x:-4.3,y:0}),p1=project({x:4.3,y:3.1});c.strokeStyle='#86a99a';c.lineWidth=1.6;c.strokeRect(p0.x,p1.y,p1.x-p0.x,p0.y-p1.y);
  c.lineWidth=.6;c.strokeStyle='#5b7b73';for(let x=-4;x<=4;x++){const a=project({x,y:0});c.beginPath();c.moveTo(a.x,bottom);c.lineTo(a.x,p1.y);c.stroke()}for(let y=.5;y<3.1;y+=.5){const a=project({x:0,y});c.beginPath();c.moveTo(p0.x,a.y);c.lineTo(p1.x,a.y);c.stroke()}
  function trail(kind,end,color,dash,weight){c.beginPath();c.setLineDash(dash);c.lineWidth=weight;c.strokeStyle=color;for(let i=0;i<=64;i++){let p=project(at(end*i/64,kind));if(!i)c.moveTo(p.x,p.y);else c.lineTo(p.x,p.y);}c.stroke();c.setLineDash([])}
  const hue=which==='ball'?'#f6c465':'#a2ded8';trail(which,endpoint,hue+'8a',[3,4],1.5);if(which==='hand')trail('ball',endpoint,'#ecd19485',[1.5,4],1);
  if(which==='hand'&&S.traceDay===2){
    trail('reference',CONTACT,'#f9efcf',[6,3],1.8);
    const pt=project(at(Math.min(CONTACT,cursor),'reference'));
    c.strokeStyle='#fff3d9';c.lineWidth=1.6;c.strokeRect(pt.x-3,pt.y-3,6,6);
  }
  trail(which,cursor,hue,[],2.4);const current=project(at(cursor,which));c.fillStyle=hue;c.strokeStyle='#173438';c.lineWidth=1.3;c.beginPath();c.arc(current.x,current.y,Math.max(3.7,w*.021),0,Math.PI*2);c.fill();c.stroke();}
function redrawReplay(){
  if(S.modal!=='replay')return;
  if(S.traceView==='race'){
    const cv=$('raceCanvas');if(!cv)return;
    const w=cv.clientWidth||400,h=cv.clientHeight||170,st=S.traceDay-1;
    const first=S.pair[0].marks[st]?.nodes[0], intact=transit(0,'right',st,first),delayed=intact+LESION_DEFAULT[st];
    const elapsed=S.replayT*(delayed+.18);
    drawRelayRace(context(cv,w,h,1.7),w,h,{stage:st,age:elapsed,injured:true,position:S.studyBlock?Math.min(.50,pulseAt(elapsed,delayed,intact)):pulseAt(elapsed,delayed,intact),normalPosition:clamp(elapsed/intact),blocked:S.studyBlock&&elapsed>delayed*.61,labels:[W().refKey,S.studyBlock?W().blockLabel:W().slowKey]});
  }else if(S.traceView==='paths'){
    for(const kind of ['ball','hand']){const node=$('plot-'+kind);if(node)pathChart(node,kind)}
  }else {
    S.pair.forEach((trial,i)=>{
      const node=$('trial-'+i);if(!node)return;
      const w=node.clientWidth||160,h=node.clientHeight||110;
      drawMatchedPitch(context(node,w,h,1.5),w,h,S.shot,trial,S.replayT);
      const cue=$('trial-cue-'+i),label=traceClock(S.replayT,trial,S.shot,P(),W());
      if(cue.textContent!==label)cue.textContent=label;
    });
  }
  const range=$('replayRange');if(range)range.value=Math.round(S.replayT*1000);
}
function replayContent() {
  const p = P(),
    t = W(),
    day = S.traceDay,
    st = day - 1;
  const tabs = (options, selected) =>
    options
      .map(([key, name]) => `<button data-a="${key}" aria-pressed="${key === selected}">${name}</button>`)
      .join('');
  const circuits = tabs(
    [
      ['trace-1', t.shortDays[1]],
      ['trace-2', t.shortDays[2]],
    ],
    'trace-' + day,
  );
  const views = tabs(
    [
      ['view-race', t.race],
      ['view-pitch', t.replayPitch],
      ['view-paths', t.replayPaths],
    ],
    'view-' + S.traceView,
  );
  const pitch = S.pair
    .map(
      (r, i) =>
        `<figure><figcaption>${p.pairs[r.day]}</figcaption><canvas id="trial-${i}" aria-label="${p.pairs[r.day]}"></canvas><span id="trial-cue-${i}" class="trial-cue"></span></figure>`,
    )
    .join('');
  const paths = ['ball', 'hand']
    .map(
      (k, i) =>
        `<figure><figcaption>${i ? t.handPath : t.ballPath}</figcaption><canvas id="plot-${k}" aria-label="${i ? t.handPath : t.ballPath}"></canvas></figure>`,
    )
    .join('');
  const diagram =
    S.traceView === 'race'
      ? `<canvas class="race-art" id="raceCanvas" aria-label="${t.sameSignals}"></canvas>`
      : `<div class="replay-plots matched-pitches">${S.traceView === 'pitch' ? pitch : paths}</div>`;
  const difference = LESION_DEFAULT[st];
  const actions = canStartMatchedDay()
    ? button('paired-' + day, t.changePath, 'primary', 'play') + button('paired-0', t.refKey, 'secondary')
    : button('close', S.mode === 'result' ? t.returnResult : t.justPlay, 'primary', 'play');
  const line =
    S.traceView === 'race' && S.studyBlock
      ? t.blockLine
      : S.traceView === 'race'
        ? t.compareTime(
            difference.toLocaleString(S.lang === 'pt' ? 'pt-BR' : 'en', { maximumFractionDigits: 2 }),
          )
        : t.consequence[day];
  return `<h2 id="dialogTitle">${t.compareTitle}</h2>${S.summary ? '' : '<small>' + p.example + '</small>'}<div class="sheet-tabs trace-tabs">${circuits}</div>
    <div class="view-choices">${views}</div>${diagram}
    <div class="replay-tools">${button('replayToggle', S.replayOn ? t.stopReplay : t.runReplay, 'secondary', S.replayOn ? 'pause' : 'play')}<input id="replayRange" type="range" min="0" max="1000" value="${Math.round(S.replayT * 1000)}" aria-label="${t.time}"></div><p class="trace-note">${line}</p>
    <div class="action-row">${actions}</div>
    <details id="diagramDetails"><summary>${t.evidence}</summary>${S.traceView === 'race' ? button('block-example', S.studyBlock ? t.restoreRace : t.tryBlock, 'secondary') : ''}${pairTable(S.pair, t, p)}<p>${t.unitNote} ${p.noGrip && S.pair.some((r) => !r.result) ? p.noGrip : ''}</p></details>`;
}

function sourceLinks(){
  return `<ul class="sources">${immuneSources.map((url,i)=>`<li><a href="${url}" target="_blank" rel="noopener">${I().refs[i]}</a></li>`).join('')}</ul>`;
}
function immuneContent(){
  const i=I(),t=W(),day=S.day===2?2:S.lessonDay;
  return `<div class="sub-label">${i.section}</div><h2 id="dialogTitle">${i.title}</h2>
    <div class="immune-modes eye-tabs">${i.modes.map((label,n)=>`<button data-a="treatment-${n}" aria-pressed="${Boolean(n)===wall.treated}">${label}</button>`).join('')}</div>
    <div class="immune-art"><canvas id="immuneCanvas" aria-label="${i.diagram}"></canvas></div>
    <div class="immune-steps">${i.steps.map((label,n)=>`<button data-a="immuneStep-${n}" aria-pressed="${immuneStage(wall.time)===n}"><b>${n+1}</b> ${label}</button>`).join('')}</div>
    <p id="immuneCaption" class="immune-caption">${i.phases[Number(wall.treated)][immuneStage(wall.time)]}</p>
    <div class="replay-tools">${button('immunePlay',wall.playing?i.pause:i.play,'secondary',wall.playing?'pause':'play')}<input id="immuneRange" type="range" min="0" max="1000" value="${Math.round(wall.time*1000)}" aria-label="${i.time}"></div>
    <details class="immune-sources"><summary>${t.evidence}</summary><div class="immune-roles">${i.roles.map((label,n)=>`<button data-a="role-${n}" aria-pressed="${wall.role===n}">${label}</button>`).join('')}</div>
    <p class="role-note">${i.rolesText[wall.role]}</p><p class="immune-site">${i.site[day]}<br>${button('immuneReplay',i.onPitch[day],'flat-link','play')}</p>
    </details><details class="immune-sources"><summary>${t.science} · ${t.source}</summary><p>${i.safety}</p>${sourceLinks()}</details>`;
}
function redrawImmune(){
  if(S.modal!=='immune')return;
  const node=$('immuneCanvas');if(!node)return;
  const w=node.clientWidth||400,h=node.clientHeight||187;
  drawImmune(context(node,w,h,1.8),w,h,wall,I());
  const step=immuneStage(wall.time),caption=I().phases[Number(wall.treated)][step];
  if($('immuneCaption').textContent!==caption){
    $('immuneCaption').textContent=caption;
    el.modalBody.querySelectorAll('.immune-steps button').forEach((b,i)=>b.setAttribute('aria-pressed',String(step===i)));
  }
  $('immuneRange').value=Math.round(wall.time*1000);
}
function settingsContent() {
  const t = W();
  const pick = (a, label, on) => `<button data-a="${a}" aria-pressed="${on}">${label}</button>`;
  return `<h2 id="dialogTitle">${t.settings}</h2><h3>${t.pace}</h3><div class="eye-tabs">${pick('pace-standard', t.regular, !S.moreTime)}${pick('pace-room', t.relaxed, S.moreTime)}</div>
   <h3>${t.gesture}</h3><div class="eye-tabs">${pick('input-hold', t.holdControl, !S.twoTaps)}${pick('input-tap', t.tapControl, S.twoTaps)}</div>
   <p>${t.accessNote}</p><h3>${t.music}</h3><div class="eye-tabs">${pick('music-on', t.musicOn, audio.musicOn)}${pick('music-off', t.musicOff, !audio.musicOn)}</div>${button('close', t.justPlay, 'primary', 'play')}`;
}

function caseFor(){
  // Kicks 1, 3 and 5 ask about the pathway of the training day. Kicks 2 and 4 ask about immunology.
  const pool=I().questions.concat(I().quiz),day=S.homeDay;
  if(day===3)return {immuneCase:true,item:pool[(S.seriesN*SERIES+S.slot)%pool.length]};
  if(S.slot%2===0)return {immuneCase:false,item:C().cases[day][S.slot/2]};
  return {immuneCase:true,item:pool[(S.seriesN*2+day*2+(S.slot>>1))%pool.length]};
}
function dialogContent(){const t=W();let html='';
  if(S.modal==='settings'){html=settingsContent();}
  else if(S.modal==='guide'){const tab=S.tab;
    let body=tab==='how'?`<ol>${t.helpLines.map(p=>`<li>${p}</li>`).join('')}</ol>`:tab==='science'?t.scienceHeads.map((q,i)=>`<h3>${q}</h3><p>${t.scienceBody[i]}</p>`).join('')+`<h3>${t.source}</h3><ul class="sources">${sources.map((href,i)=>`<li><a href="${href}" target="_blank" rel="noopener">${t.refs[i]}</a></li>`).join('')}<li><a href="https://www.mssociety.org.uk/about-ms/diagnosis/tests-ms/ms-lesions" target="_blank" rel="noopener">MS Society · ${t.lesionsSource}</a></li></ul>`:`<p>${t.creditText}</p><div class="sub-label">${t.creditLead}</div><b class="credits-name">Helder Nakaya</b><p><a href="https://www.instagram.com/helder_nakaya/" target="_blank" rel="noopener">@helder_nakaya</a> · CSBL</p><div class="sub-label">${t.creditSupport}</div><p>SBI · Einstein</p><div class="sub-label">${t.creditPaper}</div><p><a href="https://github.com/xikhar/papercraft" target="_blank" rel="noopener">Papercraft · xikhar</a> / Three.js</p>`;
    if(tab==='how')body=button('settings',t.settings,'pair-play','tap')+body;
    if(tab==='science')body=button('immune',P().immune,'pair-play','book')+`<p>${t.perspective}</p><details><summary>${t.sourcesTitle}</summary><p>${t.anatomyNote}</p>`+body+`<p>${t.unitNote}</p></details>`+(S.summary?button('case',C().caseLink,'flat-link','book'):'');
    html=`<div class="sub-label">${t.title}</div><h2 id="dialogTitle">${t.guide}</h2><div class="sheet-tabs">${['how','science','credits'].map(k=>`<button data-a="tab-${k}" aria-pressed="${tab===k}">${k==='science'?t.science:t[k]}</button>`).join('')}</div>${body}`;
    if(tab==='how')html+=`<p class="legacy-best">${t.record} · ${nf(records[S.day])} ${t.points}</p>`;
    if(tab==='how'&&earlierRecords?.[S.day]>0)html+=`<p class="legacy-best">${C().legacy} · ${nf(earlierRecords[S.day])} ${t.points}</p>`;
  }else if(S.modal==='pause'){html=`<div class="sub-label">${t.practices[S.day]}</div><h2 id="dialogTitle">${t.paused}</h2><div class="action-row">${button('close',t.resume,'primary','play')}${button('settings',t.settings,'secondary','tap')}${inSeason()?'':button('same',t.same,'secondary','repeat')}${button('menu',t.days,'quiet','list')}</div>`;}
  else if(S.modal==='compare'){html=`<div class="sub-label">${t.freezeAt} · ${t.practices[1]}</div><h2 id="dialogTitle">${t.compare}</h2><p>${t.eyeCaption}</p><div class="eye-image"><canvas id="eyeScreen" aria-label="${t.compared}"></canvas></div><div class="eye-tabs">${['left','right'].map(s=>`<button data-a="eye-${s}" aria-pressed="${S.eye===s}">${icon('eye')}${s==='left'?t.leftEye:t.rightEye}</button>`).join('')}</div><p>${t.eyeHelp}</p><div class="action-row">${button('close',S.mode==='home'?t.close:t.backToKick,'primary','play')}${button('same',t.same,'secondary','repeat')}</div>`;}
  else if(S.modal==='case'){
    const c=C(),{immuneCase,item}=caseFor();
    const [question,options,key,explanation]=item, choice=S.caseAnswer;
    const answered=choice!=null, correct=choice===key, earned=answered&&correct&&S.caseEarned;
    const showEvidence=immuneCase?['immune',P().immune,'book']:S.homeDay===1?['swapRetry',c.testEye,'eye']:S.homeDay===2?['replay',c.seeTrace,'play']:['caseFlip',c.seeNerve,'flip'];
    html=`<div class="sub-label">${c.caseLabel} · ${t.practices[S.homeDay]}</div><h2 id="dialogTitle">${c.caseLink}</h2><p class="case-question">${question}</p>
      <div class="case-answers">${options.map((label,i)=>`<button data-a="answer-${i}" aria-pressed="${choice===i}" class="${choice===i?(correct?'correct':'wrong'):''}"><i>${String.fromCharCode(65+i)}</i>${label}</button>`).join('')}</div>
      ${answered?`<p role="status" class="case-response"><b>${correct?c.correct:c.reconsider}${earned?' '+t.bonusPts(QUIZ_BONUS):''}</b> ${explanation}</p>`:''}
      <div class="action-row">${button(showEvidence[0],showEvidence[1],'primary',showEvidence[2])}${button('close',t.returnResult,'flat-link')}</div>`;
  }else if(S.modal==='replay'){html=replayContent();}
  else if(S.modal==='immune'){html=immuneContent();}
  else if(S.modal==='season'){
    const won=seriesSaves()>=3;
    html=`<div class="sub-label">${seriesSaves()}/${SERIES} ${t.savesWord} · ${nf(seriesTotal())} ${t.points}</div><h2 id="dialogTitle">${t.seasonTitle}</h2>
      <p><b>${won?t.seasonWon:t.seasonLost}</b> ${pathStatus()}</p><ul>${t.seasonStats(season).map(line=>`<li>${line}</li>`).join('')}</ul>
      <h3>${t.seenTitle}</h3><ol>${t.seen(season).map(line=>`<li>${line}</li>`).join('')}</ol><p class="legacy-best">${t.seasonCaveat}</p>
      <div class="action-row">${button('new',t.newSeason,'primary','ball')}${button('immune',P().immune,'secondary','book')}${button('close',t.close,'flat-link')}</div>`;
  }
  el.modalBody.innerHTML=html;el.modal.setAttribute('aria-labelledby','dialogTitle');if(S.modal==='compare')requestAnimationFrame(drawEye);if(S.modal==='replay')requestAnimationFrame(redrawReplay);if(S.modal==='immune')requestAnimationFrame(redrawImmune);
}
function openDialog(type,tab){cancelHold();S.modal=type;
  if(type==='immune'){wall.time=reduced.matches?immuneStops[0]:.05;wall.treated=false;wall.boundAt=null;wall.playing=!reduced.matches;wall.role=0;}if(type==='case')S.caseEarned=false;if(tab)S.tab=tab;if(type==='compare'){
  S.dialogFrame=S.mode==='result'?fieldState(S.shot,S.marks,kickDay(),eyeForRun(),readAt(S.shot,S.marks,kickDay(),eyeForRun()),{time:0,run:1,kick:1}):structuredClone(lastField??pitchFrame());
}if(type==='replay'){S.studyBlock=false;S.traceDay=S.lessonDay;S.traceView='race';updatePair();S.replayT=reduced.matches?.42:0;S.replayOn=!reduced.matches;}dialogContent();if(!el.modal.open)el.modal.showModal();el.modal.scrollTop=0;drawUI();}
function closeDialog(focus=true){S.modal=null;S.replayOn=false;wall.playing=false;if(el.modal.open)el.modal.close();frameLast=performance.now();if(focus&&S.mode!=='home')el.view.focus({preventScroll:true});drawUI();}
function turnPitch(){if(!S.summary)return;S.flipStage=kickDay()===2&&!(S.day===3&&season.optic)?1:0;S.flipT=0;S.flipEye=eyeForRun();
  if(world?.printReverse){const sheet=document.createElement('canvas');sheet.width=768;sheet.height=432;drawNerve(sheet.getContext('2d'),768,432,nerveFrame(S.flipStage,'flip'));world.printReverse(sheet,S.flipStage,affected(dayFor(S.flipStage),S.flipEye,S.flipStage))}
  audio.fold();setMode('reverse');}
function action(a){
  if(a==='en'||a==='pt'){S.lang=a;save('language',a);applyLanguage();if(!S.modal&&S.mode!=='home')el.view.focus({preventScroll:true});return}
  if(a==='audio'){audio.set(!audio.enabled);save('sound',audio.enabled);applyLanguage();return}
  if(a==='music-on'||a==='music-off'){audio.setMusic(a==='music-on');save('music',audio.musicOn);dialogContent();el.modal.querySelector('[data-a="'+a+'"]')?.focus({preventScroll:true});return}
  if(a.startsWith('day')){const d=Number(a.slice(3));selectDay(S.homeDay===d?3:d);return}
  if(a==='start'||a==='same'||a==='new'){start(a==='new'?'new':'same');return}
  if(a==='guide'||a==='credits'){openDialog('guide',a==='credits'?'credits':'how');return}
  if(a.startsWith('tab-')){S.tab=a.slice(4);dialogContent();el.modal.querySelector(`[data-a="${a}"]`)?.focus();return}
  if(a==='pause'||a==='settings'){openDialog(a);return;}
  if(a.startsWith('pace-')||a.startsWith('input-')){
    if(a.startsWith('pace-')){S.moreTime=a==='pace-room';save('relay.moreTime',S.moreTime);}
    else {S.twoTaps=a==='input-tap';save('relay.twoTaps',S.twoTaps);cancelHold();}
    dialogContent();el.modal.querySelector('[data-a="'+a+'"]')?.focus({preventScroll:true});return;
  }
  if(a==='close'){closeDialog();return}
  if(a==='menu'){if(S.modal)closeDialog(false);selectDay(S.homeDay);tell(W().title);$('startBtn').focus({preventScroll:true});return}
  if(a.startsWith('paired-')){playMatchedDay(Number(a.slice(7)));return}
  if(a==='immune'){openDialog('immune');return}
  if(S.modal==='immune'){
    if(a==='immuneReplay'){openDialog('replay');return}
    if(a.startsWith('treatment-'))wall.treated=a==='treatment-1';
    else if(a.startsWith('role-'))wall.role=Number(a.slice(5));
    else if(a.startsWith('immuneStep-')){wall.time=immuneStops[Number(a.slice(11))];wall.playing=false;}
    else if(a==='immunePlay'){if(wall.time>=.998)wall.time=0;wall.playing=!wall.playing;}
    else return;
    // Keep both conditions at the instant chosen by the player.
    if(a.startsWith('treatment-'))wall.playing=false;
    dialogContent();if(a.startsWith('role-'))el.modalBody.querySelector('details').open=true;el.modal.querySelector(`[data-a="${a}"]`)?.focus({preventScroll:true});return;
  }
  if(a==='case'){openDialog('case');return}
  if(a==='seasonEnd'){openDialog('season');return}
  if(a.startsWith('answer-')&&S.modal==='case'){S.caseAnswer=Number(a.slice(7));
    const quiz=S.dayQuiz[S.homeDay],right=S.caseAnswer===caseFor().item[2];
    if(quiz[S.slot]===undefined){
      quiz[S.slot]=right?QUIZ_BONUS:-1;S.caseEarned=right;
      if(right&&seriesTotal()>records[S.homeDay]){records[S.homeDay]=seriesTotal();save('records.relay',records)}
    }
    audio.quiz(right);dialogContent();el.modal.querySelector(`[data-a="${a}"]`)?.focus();return}
  if(a==='swapRetry'){S.day=1;S.eye=eyeForRun()==='left'?'right':'left';start('same');return}
  if(a==='caseFlip'){closeDialog(false);turnPitch();return}
  if(a==='flip'){turnPitch();return}
  if(a==='backResult'){setMode('result');return}
  if(a==='flipEye'){S.flipEye=S.flipEye==='left'?'right':'left';S.flipT=0;drawUI();return}
  if(a==='circuit'){S.flipStage=(S.flipStage+1)%S.marks.length;S.flipT=0;drawUI();return}
  if(a==='replay'){openDialog('replay');return}
  if(a==='compare'){openDialog('compare');return}
  if(a.startsWith('eye-')){S.eye=a.slice(4);el.modal.querySelectorAll('.eye-tabs button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.a===a)));drawEye();if(S.mode==='home')lastDraw=-1;return}
  if(a.startsWith('trace-')&&S.modal==='replay'){
    S.traceDay=Number(a.slice(6));if(S.day===0)S.lessonDay=S.traceDay;S.replayOn=false;updatePair();dialogContent();
    el.modal.querySelector(`[data-a="${a}"]`)?.focus();return;
  }
  if(a==='block-example'&&S.modal==='replay'){
    S.studyBlock=!S.studyBlock;S.replayT= reduced.matches?.8:0;S.replayOn=!reduced.matches;
    dialogContent();$('diagramDetails').open=true;el.modalBody.querySelector('[data-a="block-example"]').focus({preventScroll:true});return;
  }
  if(a.startsWith('view-')&&S.modal==='replay'){
    S.traceView=a.slice(5);dialogContent();el.modal.querySelector(`[data-a="${a}"]`)?.focus({preventScroll:true});return;
  }
  if(a==='replayToggle'){S.replayOn=!S.replayOn;if(S.replayOn&&S.replayT>=.998)S.replayT=0;dialogContent();return;}
}
document.addEventListener('click',e=>{const b=e.target.closest('button[data-a]');if(b){if(b.dataset.a!=='audio'){audio.unlock();audio.click()}action(b.dataset.a)}});
el.modal.addEventListener('cancel',e=>{e.preventDefault();closeDialog()});el.modal.addEventListener('click',e=>{if(e.target===el.modal){const b=el.modal.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)closeDialog()}});
document.addEventListener('input',e=>{
  if(e.target.id==='immuneRange'){
    wall.time=Number(e.target.value)/1000;wall.playing=false;
    const b=el.modalBody.querySelector('[data-a="immunePlay"]');if(b)b.innerHTML=icon('play')+'<span>'+I().play+'</span>';
    redrawImmune();return;
  }
  if(e.target.id==='replayRange'){S.replayT=Number(e.target.value)/1000;S.replayOn=false;const b=el.modalBody.querySelector('[data-a="replayToggle"]');if(b)b.innerHTML=icon('play')+W().runReplay;redrawReplay()}});
function inputDown(id) {
  syncClock(performance.now());
  if (S.twoTaps && S.holding) {
    releaseHold(activeInput);
    return;
  }
  beginHold(id);
}
function inputUp(id) {
  if (S.modal || S.twoTaps) return;
  if (S.queued === id) {
    S.queued = null;
    return;
  }
  if (activeInput === id) {
    syncClock(performance.now());
    releaseHold(id);
  }
}
el.arena.addEventListener('pointerdown', (e) => {
  if (e.button !== 0 || !e.isPrimary || e.target.closest('button,a,input') || S.modal) return;
  e.preventDefault();
  if (S.mode === 'home') {
    start();
    return;
  }
  if (S.mode === 'gate') {
    gateTap(e.clientX, e.clientY);
    return;
  }
  if (S.mode === 'gateEnd') {
    if (S.age > 0.9) gateLeave();
    return;
  }
  el.view.focus({ preventScroll: true });
  inputDown(e.pointerId);
  if (S.holding || S.queued !== null)
    try {
      el.arena.setPointerCapture(e.pointerId);
    } catch {}
});
document.addEventListener('pointerdown', (e) => {
  if (!S.modal && e.isPrimary && e.button === 0 && !e.target.closest('#arena,button,a,input,dialog')) {
    if (S.mode === 'surf' || S.mode === 'land') {
      e.preventDefault();
      inputDown(e.pointerId);
    }
  }
});
window.addEventListener('pointerup', (e) => {
  if (activeInput === e.pointerId || S.queued === e.pointerId) {
    e.preventDefault();
    inputUp(e.pointerId);
  }
});
window.addEventListener('pointercancel', (e) => {
  if (activeInput === e.pointerId || S.queued === e.pointerId) {
    cancelHold();
    if (matchStarted()) openDialog('pause');
  }
});
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !S.modal && matchStarted()) {
    e.preventDefault();
    openDialog('pause');
    return;
  }
  if (S.modal || e.code !== 'Space' || e.repeat || e.target.closest('button,a,input,summary')) return;
  e.preventDefault();
  if (S.mode === 'home') start();
  else if (S.mode === 'result') {
    if (S.age > 0.6) el.result.querySelector('.result-buttons .primary')?.click();
  } else if (S.mode === 'flip') el.flipStrip.querySelector('.primary')?.click();
  else if (S.mode === 'gate') gateTap(null);
  else if (S.mode === 'gateEnd') {
    if (S.age > 0.9) gateLeave();
  } else inputDown('space');
});
window.addEventListener('keyup', (e) => {
  if (e.code === 'Space' && (activeInput === 'space' || S.queued === 'space')) {
    e.preventDefault();
    inputUp('space');
  }
});

function pauseHidden(){if(!S.modal&&matchStarted()){cancelHold();openDialog('pause')}}
document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseHidden();frameLast=performance.now()});window.addEventListener('blur',()=>{if(S.holding)pauseHidden()});
function syncClock(stamp) {
  stamp = Math.max(stamp, frameLast);
  const cap = S.holding ? 0.046 : 0.15;
  const dt = Math.max(0, Math.min(cap, (stamp - frameLast) / 1000));
  frameLast = stamp;
  if (!document.hidden && !S.modal) advance(dt * (S.moreTime ? 0.58 : 1));
  return dt;
}
function tick(stamp) {
  const dt = syncClock(stamp);
  if (!document.hidden) {
    if (!S.modal) {
      const interval = S.mode === 'home' ? 1000 / 24 : S.mode === 'result' ? 1000 / 22 : 0;
      if (lastDraw < 0 || stamp - lastDraw >= interval) {
        draw(stamp);
        lastDraw = stamp;
      }
    } else if (S.modal === 'immune' && wall.playing) {
      wall.time = clamp(wall.time + dt / 8.5);
      redrawImmune();
      if (wall.time >= 1) {
        wall.playing = false;
        const b = el.modalBody.querySelector('[data-a="immunePlay"]');
        if (b) b.innerHTML = icon('play') + '<span>' + I().play + '</span>';
      }
    } else if (S.modal === 'replay' && S.replayOn) {
      S.replayT = clamp(S.replayT + (dt * S.shot.pace) / 3.4);
      redrawReplay();
      if (S.replayT === 1) {
        S.replayOn = false;
        dialogContent();
      }
    }
  }
  requestAnimationFrame(tick);
}

function openLinkedScene(){
  if(S.mode!=='home')return;
  if(location.hash==='#compare')openDialog('replay');
  else if(location.hash==='#immunity')openDialog('immune');
}
selectDay(3);openLinkedScene();window.addEventListener('hashchange',openLinkedScene);
if(location.hash==='#test')window.__game={S,season,wave,aligned(){if(S.mode!=='surf'||!S.holding)return false;const g=geometry(track(),S.hop,S.holdAge,heldSeconds());return Math.abs(g.targetX-g.landingX)<=g.targetRadius*.5},view:()=>barrierView(viewSize.w,viewSize.h)};
requestAnimationFrame(tick);firstPaint();
