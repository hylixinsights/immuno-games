import {words,sources} from './words.js?v=2';
import {coaching} from './coaching.js?v=2';
import {clamp,lerp,smooth,CONTACT,SERIES,makeShot,jumpGeometry,judge,readAt,diveAt,reachesBall,signalDelay,BALL_RADIUS,finish,handAt,ballAt,fieldState,seriesScore} from './rules.js?v=2';
import {drawField,fieldProject} from './field-print.js?v=2';
import {drawNerve} from './nerve.js?v=2';
import {MatchSound} from './sound.js';

const $=id=>document.getElementById(id), el={};
for(const id of ['view','arena','gl','field','neural','cinema','fieldWrap','tickets','dayDialogue','matchHud','phaseLabel','kickLabel','scoreValue','inset','mini','fieldCue','signalStrip','liveHint','compareDock','flipStrip','result','matchBar','modal','modalBody','announce','homeRecord'])el[id]=$(id);
const icon=name=>`<svg aria-hidden="true"><use href="#i-${name}"/></svg>`;
const button=(action,label,klass='secondary',symbol='')=>`<button class="${klass}" data-a="${action}">${symbol?icon(symbol):''}<span>${label}</span></button>`;
const show=(node,value)=>{node.hidden=!value};
function load(key,fallback){try{return JSON.parse(localStorage.getItem('impossible-save.'+key))??fallback}catch{return fallback}}
function save(key,value){try{localStorage.setItem('impossible-save.'+key,JSON.stringify(value))}catch{/* Private browsing can still run a full series. */}}
const earlierRecords=load('records',[]);
const rawRecords=load('records.v2',[]),records=[0,1,2].map(i=>Number.isFinite(rawRecords?.[i])?Math.max(0,rawRecords[i]):0);
const firstSeed=0x5e21b3;
const S={lang:load('language','en')==='pt'?'pt':'en',day:0,eye:'right',readEye:null,mode:'home',age:0,time:0,stage:0,shot:makeShot(firstSeed),marks:[],summary:null,slot:0,slots:[],attempt:0,holding:false,holdAt:0,holdAge:0,flight:null,stageAge:0,feedback:null,finished:false,newBest:false,frozen:null,modal:null,tab:'how',caseAnswer:null,traceDay:0,flipStage:0,flipT:0,replayT:0,replayOn:false,dialogFrame:null};
const audio=new MatchSound(load('sound',true)!==false);
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const W=()=>words[S.lang];
const C=()=>coaching[S.lang];
const eyeForRun=()=>S.readEye??S.eye;
const matchStarted=()=>!['home','result','flip'].includes(S.mode);
const nf=n=>n.toLocaleString(S.lang==='pt'?'pt-BR':'en-US');
let world=null,worldPending=null,frameLast=performance.now(),lastDraw=-1,viewSize={w:0,h:0},lastField=null;
let activeInput=null,holdStartStamp=0,announced='';
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
  const probe=document.createElement('canvas').getContext('webgl2');
  if(!probe){worldPending=Promise.resolve(null);return worldPending;}
  probe.getExtension('WEBGL_lose_context')?.loseContext();
  worldPending=import('./scene.js?v=2').then(({makeWorld})=>{
    const ready=makeWorld(el.gl);ready.canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();world=null;el.gl.hidden=true;lastDraw=-1});world=ready;
    if(viewSize.w>1){const f=fieldState(S.shot,[],S.day,S.eye,0);world.render(viewSize.w,viewSize.h,f,S.shot);}return ready;
  }).catch(()=>{el.gl.hidden=true;return null});return worldPending;
}
const firstPaint=()=>{if('requestIdleCallback' in window)requestIdleCallback(preloadWorld,{timeout:1300});else setTimeout(preloadWorld,200)};
function tell(message){if(message!==announced){el.announce.textContent=message;announced=message}}
function applyLanguage(){
  announced='';el.announce.textContent='';const t=W();document.documentElement.lang=S.lang==='pt'?'pt-BR':'en';document.title=t.title+' · immuno.games';el.arena.setAttribute('aria-label',t.title);el.view.setAttribute('aria-label',t.controls);
  document.querySelectorAll('[data-t]').forEach(n=>n.textContent=t[n.dataset.t]);document.querySelectorAll('[data-aria]').forEach(n=>n.setAttribute('aria-label',t[n.dataset.aria]));
  for(const lang of ['en','pt'])document.querySelectorAll(`[data-a="${lang}"]`).forEach(n=>n.setAttribute('aria-pressed',String(S.lang===lang)));
  $('heroTitle').innerHTML=`<small>${t.titleLines[0]}</small><span>${t.titleLines[1]}</span><strong>${t.titleLines[2]}</strong>`;
  const aud=$('audioBtn');aud.innerHTML=icon(audio.enabled?'volume':'mute');aud.setAttribute('aria-label',audio.enabled?t.soundOn:t.soundOff);aud.title=aud.getAttribute('aria-label');aud.setAttribute('aria-pressed',String(audio.enabled));
  el.tickets.innerHTML=t.practices.map((title,i)=>`<button class="ticket" style="--ticket-color:${['#f5c363','#9ed4c9','#f1a089'][i]}" data-a="day${i}" aria-pressed="${S.day===i}"><img width="76" height="70" src="assets/day-${i+1}.webp" alt=""><span><small>${t.day} 0${i+1}</small><b>${title}</b></span><span class="tick">${icon('check')}</span></button>`).join('');
  el.dayDialogue.innerHTML=`<b>${t.goalkeeper}</b><span>${t.quotes[S.day]}</span>${S.day===1?button('compare',t.compare,'flat-link'):''}`;
  el.homeRecord.textContent=nf(records[S.day]);el.view.title='';drawUI();if(S.modal)dialogContent();
}
function setMode(mode){S.mode=mode;S.age=0;lastDraw=-1;document.body.dataset.mode=mode;drawUI();}
function nextSeed(){let a=new Uint32Array(1);if(window.crypto?.getRandomValues)crypto.getRandomValues(a);else a[0]=Math.random()*4294967296;let n=a[0]>>>0;for(let i=0;i<32;i++){const candidate=makeShot(n);if(candidate.seed!==S.shot.seed&&(candidate.side!==S.shot.side||Math.abs(candidate.y-S.shot.y)>.38))return n;n=(n+0x9e3779b9)>>>0}return (S.shot.seed+0x9e3779b9)>>>0;}
function selectDay(day){S.day=day;S.slot=0;S.slots=[];S.attempt=0;S.summary=null;S.marks=[];S.readEye=null;S.eye=day===1?'left':'right';S.shot=makeShot(firstSeed+day*10007);S.time=0;S.stage=0;S.finished=false;S.feedback=null;setMode('home');applyLanguage();}
function start(which='same'){
  if(S.modal)closeDialog(false);if(which==='new'){if(S.slot===SERIES-1){S.slot=0;S.slots=[]}else S.slot++;S.shot=makeShot(nextSeed(), S.slot);S.attempt=0;}
  audio.unlock();preloadWorld();S.time=0;S.stage=0;S.readEye=null;S.marks=[];S.feedback=null;S.flight=null;S.finished=false;S.newBest=false;S.outcomeSound=false;S.summary=null;S.holding=false;S.attempt++;activeInput=null;S.stepBeat=0;S.caseAnswer=null;
  setMode('run');el.view.focus({preventScroll:true});tell(W().ready);
}
function heldSeconds(){return S.holding?Math.max(0,(performance.now()-holdStartStamp)/1000):null;}
function beginHold(id){if(S.mode!=='surf'||S.holding||S.modal)return;activeInput=id;S.holding=true;S.holdAge=S.age;holdStartStamp=performance.now();drawUI();}
function releaseHold(id,timeout=false){
  if(S.mode!=='surf'||(!timeout&&(!S.holding||activeInput!==id)))return;
  const age=S.holding?S.holdAge:S.age, held=heldSeconds();let g=jumpGeometry(S.shot,S.day,S.stage,age,timeout?0:held);
  if(timeout)g={...g,landingX:g.launchX+.12};
  const mark=judge(g,timeout);mark.age=age;mark.held=held??0;
  S.holding=false;activeInput=null;S.flight=mark;S.stageAge=S.age;S.marks[S.stage]=mark;if(S.stage===0)S.readEye=S.eye;
  audio.jump();setMode('flight');
}
function cancelHold(){S.holding=false;activeInput=null;}
function armStage(){cancelHold();S.feedback=null;S.flight=null;setMode('surf');tell(W().stages[S.stage]+'. '+W().jump);}
function openExit(){S.summary=finish(S.shot,S.marks,S.day,eyeForRun());setMode('exit');if(S.summary.outcome!=='beaten')audio.touch();}
function recordResult(){
  if(S.finished)return;S.finished=true;const res=S.summary,score=res.score;S.slots[S.slot]=Math.max(S.slots[S.slot]||0,score);
  const total=seriesScore(S.slots);S.newBest=total>records[S.day];if(S.newBest){records[S.day]=total;save('records.v2',records)}setMode('result');tell(W().outcomes[res.outcome]+' '+score+' '+W().points);el.homeRecord.textContent=nf(records[S.day]);
}
function liveLabel(){const t=W();if(['run','eye'].includes(S.mode))return t.ready;if(S.mode==='result')return t.result;if(['flip','reverse'].includes(S.mode))return t.review;if(S.mode==='exit')return S.summary?.outcome==='beaten'?t.noContact:t.contact;if(S.mode==='touch')return t.contact;return t.stages[S.stage];}
function grade(mark) {
  const labels=C().rings;
  if(mark.timeout)return labels[5];
  if(mark.perfect)return labels[2];
  if(mark.band==='edge')return labels[mark.delta<0?3:4];
  return labels[mark.delta<0?0:1];
}
function stageWindow() {
  if(S.stage===0 && S.slot===0 && S.attempt===1)return 6.2;
  return (3.35-.78*S.shot.pressure+(S.stage===0?.22:0))/S.shot.pace;
}
function relayDuration(stage=S.stage,eye=eyeForRun()) {
  return .43+4.7*signalDelay(S.day,eye,stage);
}
function cues(){const t=W(),m=S.marks;
  if(S.stage>=2&&m[1])return diveAt(S.shot,m,S.day,eyeForRun())<.47?t.diveEarly:t.diveLate;
  if(m[0])return readAt(S.shot,m,S.day,eyeForRun())<.262?t.readEarly:t.readLate;return '';
}
function coachingReason() {
  const out=S.summary.outcome, [vision,motor]=S.marks;
  if(out==='beaten'){
    if(vision.band!=='perfect'&&motor.band!=='perfect'&&vision.quality<.51&&motor.quality<.51)return 'both';
    if(1-vision.quality>(1-motor.quality)*1.48)return 'visual';
    return S.day===2?'coord':'motor';
  }
  return out==='tip'&&vision.quality<.46?'rescue':out;
}
function playedEvidence() {
  const c=C();
  if(S.day===1)return eyeForRun()==='left'?c.leftFinding:c.rightFinding;
  if(S.day===2)return c.coordFinding;
  return c.baseline[S.slot % c.baseline.length];
}
function readComparison() {
  const c=C(), t=W();
  return `<div class="read-compare"><small>${c.readFlight}</small>${['left','right'].map(eye=>{
    const percent=Math.round(100*readAt(S.shot,S.marks,1,eye)/CONTACT);
    return `<div class="read-row"><span>${eye==='left'?t.leftEye:t.rightEye}</span><i><em style="width:${percent}%"></em></i><b>${percent}%</b></div>`;
  }).join('')}</div>`;
}
function gloveDifference() {
  const start=diveAt(S.shot,S.marks,2,'right');let furthest=0;
  for(let i=0;i<=48;i++){
    const t=lerp(start,CONTACT,i/48);
    const a=handAt(S.shot,S.marks,2,'right',t), b=handAt(S.shot,S.marks,0,'right',t);
    furthest=Math.max(furthest,Math.hypot(a.x-b.x,a.y-b.y));
  }
  const balls=Math.round(furthest/(2*BALL_RADIUS)*10)/10;
  return balls===1?C().distanceSingle:C().distance(nf(balls));
}
function liveScience(neural) {
  const c=C(), stage=S.stage, eye=eyeForRun(), land=S.mode==='land';
  const showNote=neural && S.mode!=='switch' && !(stage===0&&S.day===0&&S.slot===0&&S.attempt===1&&!land);
  show(el.signalStrip,showNote);
  if(!showNote)return;
  let label=stage===2?W().circuits[2]:c.intact, message=c.live[stage];
  if(S.day===1&&stage===0){
    label=eye==='left'?c.optic:W().rightNerve;
    message=eye==='right'?c.right:land?c.slowOptic:c.left;
  }else if(S.day===2&&stage===1){
    label=c.cerebellum;message=land?c.slowMotor:c.coord;
  }
  el.signalStrip.innerHTML=`<b>${label}</b><span>${message}</span>`;
}
function resultCard() {
  const t=W(),c=C(),a=S.summary, stages=[t.visual,t.motor,t.tactile];
  const status=S.slot===SERIES-1?t.completed:S.newBest?t.newBest:t.result;
  const steps=stages.map((name,i)=>{
    const m=S.marks[i],symbol=m?.perfect?'◆':m?.band==='edge'?'◇':m?'×':'—';
    return `<div class="landing" data-grade="${m?.band??'none'}"><small>${name}</small><b><i aria-hidden="true">${symbol}</i>${m?grade(m):c.missing}</b></div>`;
  }).join('');
  el.result.innerHTML=`<div class="outcome-label">${status}</div><div class="result-head"><h2>${t.outcomes[a.outcome]}</h2><div class="earned">+${nf(a.score)}<small>${t.points}</small></div></div>
    <p class="match-reason">${c.reason[coachingReason()]}</p><div class="landing-strip">${steps}</div>
    <div class="result-buttons">${button('same',t.same,'primary','repeat')}${button('new',S.slot===SERIES-1?t.nextSeries:t.next,'secondary','ball')}</div>
    <section class="result-evidence"><b>${c.match}</b><p>${playedEvidence()}</p>${S.day===1?readComparison():''}${a.bonus?`<small>${c.combo} ×${a.combo} · +${a.bonus} ${t.points}</small>`:''}</section>
    <div class="minor-actions">${button('flip',t.flip,'','flip')}${button('replay',c.labTitle,'','play')}${button('case',c.caseLink,'','book')}${S.day===1?button('compare',t.compare,'','eye'):''}</div>`;
}
function drawUI(){const t=W(),home=S.mode==='home',neural=['surf','flight','land','switch'].includes(S.mode),res=S.mode==='result',flipped=S.mode==='flip';
  show(el.matchHud,!home);show(el.matchBar,!home);show(el.inset,!home&&neural);show(el.result,res);show(el.flipStrip,flipped);show(el.compareDock,S.day===1&&!home&&!flipped&&!['reverse','result'].includes(S.mode));
  el.kickLabel.textContent=`${t.day} ${S.day+1} · ${t.kick} ${S.slot+1}/${SERIES}`;el.phaseLabel.textContent=liveLabel();el.scoreValue.textContent=nf(seriesScore(S.slots));
  const showHint=S.mode==='surf'||S.mode==='land';show(el.liveHint,showHint);
  liveScience(neural);
  if(showHint){
    const land=S.mode==='land', m=S.feedback;
    const message=land?grade(m):S.holding?t.aim:t.jump;
    const cap=land&&m.perfect?`${C().combo} ×${consecutive()}`:S.stage===0&&S.attempt===1&&!land?'':`${t.stageTag} ${S.stage+1}/3 · ${t.circuits[S.stage]}`;
    el.liveHint.innerHTML=`${cap?`<small>${cap}</small>`:''}<b>${message}</b>${land?'':'<i class="release-clock" aria-hidden="true"><em></em></i>'}`;
    if(!land)el.liveHint.style.setProperty('--remaining',clamp(1-S.age/stageWindow()));
  }
  el.matchBar.innerHTML=`<div class="little-path">${[t.visual,t.motor,t.tactile].map((x,i)=>`<span class="${(res||flipped)?(S.marks[i]?'done':''):(i===S.stage?'now':i<S.stage?'done':'')}"><i></i>${x}</span>`).join('')}</div>${button('menu',t.days,'','list')}`;
  if(res)resultCard();
  if(flipped){const i=S.flipStage,optic=S.day===1&&i===0,lesion=(optic&&S.flipEye==='left')||(S.day===2&&i===1),ex=lesion?(i===0?t.flipVisual:t.flipMotor):optic?t.rightNerveNote:t.flipLines[i];el.flipStrip.innerHTML=`<div><small class="outcome-label">${lesion?t.location:t.healthy}</small><h2>${optic?(S.flipEye==='left'?t.leftNerve:t.rightNerve):t.anatomy[i]}</h2><p>${ex}</p></div><div class="action-row">${button('same',t.same,'primary','repeat')}${button('new',S.slot===4?t.nextSeries:t.next,'secondary','ball')}${optic?button('flipEye',S.flipEye==='left'?t.rightEye:t.leftEye,'secondary','eye'):''}${button('circuit',t.nextCircuit,'secondary')}${button('backResult',t.returnResult,'flat-link')}</div>`;}
  el.fieldCue.textContent=neural?cues():'';
}
function consecutive(){let n=0;for(let i=S.stage;i>=0&&S.marks[i]?.perfect;i--)n++;return n;}
function advance(dt){
  S.time+=dt;S.age+=['run','eye','touch','exit'].includes(S.mode)?dt*S.shot.pace:dt;
  if(S.mode==='run'){let beat=Math.min(3,Math.floor(S.age/.18));if(beat>S.stepBeat){S.stepBeat=beat;audio.step(beat)}if(S.age>=.74){audio.kick();setMode('eye')}}
  else if(S.mode==='eye'&&S.age>=.62)armStage();
  else if(S.mode==='surf'){
    const left=clamp(1-S.age/stageWindow());el.liveHint.style.setProperty('--remaining',left);
    if(!left)releaseHold(null,true);
  }
  else if(S.mode==='flight'&&S.age>=.38){S.feedback=S.flight;audio.land(S.feedback.quality,S.stage);setMode('land');tell(grade(S.feedback));}
  else if(S.mode==='land'&&S.age>=relayDuration()){
    if(S.stage===0){setMode('switch');audio.fold()}
    else if(S.stage===1){if(!reachesBall(S.shot,S.marks,S.day,eyeForRun())){openExit()}else{setMode('touch');audio.touch()}}
    else openExit();
  }else if(S.mode==='switch'&&S.age>=.43){S.stage=1;armStage()}
  else if(S.mode==='touch'&&S.age>=.68){S.stage=2;armStage()}
  else if(S.mode==='exit'){if(!S.outcomeSound&&S.age>.29){S.outcomeSound=true;audio.result(S.summary.saved)}if(S.age>=1.65){S.outcomeSound=false;recordResult()}}
  else if(S.mode==='reverse'&&S.age>=.89){S.flipT=0;setMode('flip')}
  else if(S.mode==='flip'){S.flipT+=dt;}
}
function pitchFrame(){
  const a=S.age,m=S.mode,shot=S.shot,marks=S.marks;let t=0,extra={};
  if(m==='home'){extra.clap=Math.pow(Math.max(0,Math.sin(a*3.15)),5);}
  else if(m==='run'){extra.run=clamp(a/.66);extra.kick=smooth((a-.49)/.25);extra.clap=(1-extra.run)*.45;}
  else{extra.run=1;extra.kick=1;
    if(m==='eye'){t=lerp(0,.055,clamp(a/.62));extra.camera='eye';extra.cameraT=clamp(a/.62)}
    else if(['surf','flight','land','switch'].includes(m)){
      const read=readAt(shot,marks,S.day,eyeForRun());
      const lo=[.055,read+.043,CONTACT][S.stage],idleSpan=[.068,.05,.0008][S.stage],hi=[read+.039,.735,CONTACT+.003][S.stage];
      const age=m==='surf'?a:S.stageAge,approach=lo+idleSpan*(1-Math.exp(-age*shot.pace/1.3));
      const relayEnd=S.stage===0?Math.max(approach,hi-.060):hi;
      t=m==='surf'?approach:m==='flight'?lerp(approach,relayEnd,clamp(a/.38)):m==='land'?lerp(relayEnd,hi,clamp(a/relayDuration())):hi;
    }
    else if(m==='touch'){t=lerp(.735,CONTACT,smooth(a/.68));extra.camera='contact';extra.cameraT=clamp(a/.68);}
    else if(m==='exit'){
      const x=clamp(a/1.65),miss=S.summary.outcome==='beaten';
      if(miss)t=x<.34?lerp(.735,CONTACT,smooth(x/.34)):lerp(CONTACT,1,smooth((x-.49)/.51));
      else t=lerp(CONTACT,1,smooth((x-.09)/.88));
      extra.camera=miss?'miss':'exit';extra.cameraT=x;extra.outcome=S.summary.outcome;
    }
    else{t=1;extra.outcome=S.summary?.outcome;extra.camera='result';if(m==='reverse')extra.fold=smooth(a/.89);}
  }
  const f=fieldState(shot,marks,S.day,eyeForRun(),t,{time:S.time,phase:m,...extra});if(m==='home'||m==='run'||m==='eye'){delete f.hand;f.pose={x:0,y:0,z:-3.10,tilt:0};}
  return f;
}
function nerveFrame(stage,mode=S.mode){
  const fl=mode==='flip',m=S.marks[stage],useMark=fl||['flight','land','switch'].includes(mode),a=fl?S.flipT%2.25:S.age;
  let g=useMark&&m?m.geometry:jumpGeometry(S.shot,S.day,stage,S.holding?S.holdAge:S.age,heldSeconds());
  let u=fl?clamp((a-.53)/.66):mode==='flight'?clamp(a/.38):['land','switch'].includes(mode)?1:0;
  let x=lerp(g.launchX,g.landingX,u), y=lerp(g.launchY,g.targetY,u)-4*g.arcHeight*u*(1-u);
  const shownEye=fl?S.flipEye:eyeForRun(),artDay=S.day===1&&stage===0&&shownEye==='right'?0:S.day;
  const delay=signalDelay(S.day,shownEye,stage);
  let relay=fl?(a-1.04)/relayDuration(stage,shownEye):mode==='land'?a/relayDuration(stage,shownEye):-1;
  if(relay>=0&&relay<=1&&delay>0){
    if(relay<.27)relay=.44*relay/.27;
    else if(relay<.69)relay=.44+.13*(relay-.27)/.42;
    else relay=.57+.43*(relay-.69)/.31;
  }
  return {...g,stage,day:artDay,time:S.time,relay,sparkX:x,sparkY:y,travel:fl?clamp(a/1.4):mode==='surf'?clamp(S.age/5)*.44:.44+.56*u,prediction:mode==='surf'||(fl&&a<.63),holding:!fl&&S.holding,quality:m?.quality??0,feedback:(fl&&a>1.16&&a<1.7)?1:mode==='land'?clamp(1-a/.45):0};
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
  el.mini.classList.toggle('affected',S.day===1&&S.eye==='left');
  const t=W(),read=readAt(S.shot,S.marks,S.day,eyeForRun()),direction=S.marks[0]&&f.progress>=read?(S.shot.side<0?t.shotLeft:t.shotRight):'';
  const cue=S.stage===0?direction:S.stage===1&&f.progress<read?'':cues();if(el.fieldCue.textContent!==cue)el.fieldCue.textContent=cue;
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
  const f=pitchFrame();lastField=f;const useGL=!!world&&m!=='home'&&!surf&&!reversing;
  show(el.gl,useGL);show(el.field,!useGL);show(el.fieldWrap,!surf&&!reversing);show(el.neural,surf||reversing);const affected=S.day===1&&S.eye==='left';el.fieldWrap.classList.toggle('affected',affected);
  if(!surf&&!reversing){if(useGL){try{world.render(w,h,f,S.shot)}catch{world=null;show(el.gl,false);show(el.field,true);field2D(context(el.field,w,h),w,h,f)}}else{const c=context(el.field,w,h);c.clearRect(0,0,w,h);field2D(c,w,h,f)}}
  if(surf||reversing){const c=context(el.neural,w,h);let stage=m==='flip'||reversing?S.flipStage:S.stage,mode=reversing?'flip':m;let stretch=1;
    if(m==='switch'){const t=clamp(S.age/.43);if(t>=.5){stage=1;mode='surf'}stretch=Math.max(.025,Math.abs(Math.cos(t*Math.PI)));}
    if(reversing){stretch=Math.max(.025,-Math.cos(Math.PI*clamp(S.age/.89)));}
    c.fillStyle='#15333d';c.fillRect(0,0,w,h);c.save();if(stretch!==1){c.translate(0,h/2);c.scale(1,stretch);c.translate(0,-h/2)}
    drawNerve(c,w,h,nerveFrame(stage,mode));c.restore();if(!el.inset.hidden){miniPitch(Math.max(20,el.mini.clientWidth),Math.max(10,el.mini.clientHeight),f)}
  }
  let aperture=null;if(m==='eye'&&S.age>.28)aperture=1-smooth((S.age-.28)/.34);
  else if(m==='surf'&&S.stage===0&&S.age<.17)aperture=smooth(S.age/.17);
  else if(m==='touch'&&S.age>.5)aperture=1-smooth((S.age-.5)/.18);
  else if(m==='surf'&&S.stage===2&&S.age<.13)aperture=smooth(S.age/.13);
  else if(m==='exit'&&S.summary.outcome!=='beaten'&&S.age<.52)aperture=smooth(S.age/.52);
  show(el.cinema,aperture!==null);if(aperture!==null){const c=context(el.cinema,w,h);c.clearRect(0,0,w,h);const target=f.hand??f.ball;const pt=useGL?world?.project(target):fieldProject(w,h,target.x,target.y,target.z);portal(c,w,h,aperture,pt,S.shot.side)}
}
function drawEye(){const canvas=$('eyeScreen');if(!canvas||!S.dialogFrame)return;const w=Math.max(1,canvas.clientWidth),h=Math.max(1,canvas.clientHeight),c=context(canvas,w,h);
  c.save();const frozen=S.dialogFrame;drawField(c,w,h,frozen);
  const q=fieldProject(w,h,lerp(-.84,-.62,frozen.run),1.44,lerp(5.57,4.36,frozen.run));
  const radius=h*.235,cx=radius+12,cy=radius+10,scale=canvas.width/w,area=radius*.56;
  c.beginPath();c.arc(cx,cy,radius,0,Math.PI*2);c.clip();c.drawImage(canvas,(q.x-area)*scale,(q.y-area)*scale,area*2*scale,area*2*scale,cx-radius,cy-radius,radius*2,radius*2);c.restore();
  c.strokeStyle='#f3d996';c.lineWidth=2;c.beginPath();c.arc(cx,cy,radius,0,Math.PI*2);c.stroke();canvas.classList.toggle('affected',S.eye==='left');}
function replayEye(){return S.traceDay===S.day?eyeForRun():S.traceDay===1?'left':'right'}
function pathChart(canvas,which){const w=canvas.clientWidth||180,h=canvas.clientHeight||120,c=context(canvas,w,h);c.fillStyle='#204449';c.fillRect(0,0,w,h);
  const end=ballAt(S.shot,S.marks,S.day,eyeForRun(),1,S.summary.outcome);
  const pad=w*.07,bottom=h*.87,scale=(w-2*pad)/(2*Math.max(4.83,Math.abs(end.x)+.31)),ys=Math.min(h*.225,scale*1.55),project=p=>({x:w/2+p.x*scale,y:bottom-p.y*ys});
  const actual=S.traceDay===S.day, endpoint=actual?1:CONTACT, cursor=Math.min(S.replayT,endpoint);
  const at=(q,kind)=>{
    if(kind==='ball')return ballAt(S.shot,S.marks,S.traceDay,replayEye(),q,actual?S.summary.outcome:null);
    if(kind==='reference')return handAt(S.shot,S.marks,0,'right',q);
    return actual?fieldState(S.shot,S.marks,S.traceDay,replayEye(),q,{outcome:S.summary.outcome}).hand:handAt(S.shot,S.marks,S.traceDay,replayEye(),q);
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
function redrawReplay(){if(S.modal!=='replay')return;for(const kind of ['ball','hand']){const node=$('plot-'+kind);if(node)pathChart(node,kind)}const range=$('replayRange');if(range)range.value=Math.round(S.replayT*1000)}
function dialogContent(){const t=W();let html='';
  if(S.modal==='guide'){const tab=S.tab;
    let body=tab==='how'?`<ol>${t.howBody.map(p=>`<li>${p}</li>`).join('')}</ol>`:tab==='science'?t.scienceHeads.map((q,i)=>`<h3>${q}</h3><p>${t.scienceBody[i]}</p>`).join('')+`<h3>${t.source}</h3><ul class="sources">${sources.map((href,i)=>`<li><a href="${href}" target="_blank" rel="noopener">${t.refs[i]}</a></li>`).join('')}</ul>`:`<p>${t.creditText}</p><div class="sub-label">${t.creditLead}</div><b class="credits-name">Helder Nakaya</b><p><a href="https://www.instagram.com/helder_nakaya/" target="_blank" rel="noopener">@helder_nakaya</a> · CSBL</p><div class="sub-label">${t.creditSupport}</div><p>SBI · Einstein</p><div class="sub-label">${t.creditPaper}</div><p><a href="https://github.com/xikhar/papercraft" target="_blank" rel="noopener">Papercraft · xikhar</a> / Three.js</p>`;
    html=`<div class="sub-label">${t.title}</div><h2 id="dialogTitle">${t.guide}</h2><div class="sheet-tabs">${['how','science','credits'].map(k=>`<button data-a="tab-${k}" aria-pressed="${tab===k}">${k==='science'?t.science:t[k]}</button>`).join('')}</div>${body}`;
    if(tab==='how'&&earlierRecords?.[S.day]>0)html+=`<p class="legacy-best">${C().legacy} · ${nf(earlierRecords[S.day])} ${t.points}</p>`;
  }else if(S.modal==='pause'){html=`<div class="sub-label">${t.practices[S.day]}</div><h2 id="dialogTitle">${t.paused}</h2><div class="action-row">${button('close',t.resume,'primary','play')}${button('same',t.same,'secondary','repeat')}${button('menu',t.days,'quiet','list')}</div>`;}
  else if(S.modal==='compare'){html=`<div class="sub-label">${t.freezeAt} · ${t.practices[1]}</div><h2 id="dialogTitle">${t.compare}</h2><p>${t.eyeCaption}</p><div class="eye-image"><canvas id="eyeScreen" aria-label="${t.compared}"></canvas></div><div class="eye-tabs">${['left','right'].map(s=>`<button data-a="eye-${s}" aria-pressed="${S.eye===s}">${icon('eye')}${s==='left'?t.leftEye:t.rightEye}</button>`).join('')}</div><p>${t.eyeHelp}</p><div class="action-row">${button('close',S.mode==='home'?t.close:t.backToKick,'primary','play')}${button('same',t.same,'secondary','repeat')}</div>`;}
  else if(S.modal==='case'){
    const c=C(),[question,options,key,explanation]=c.cases[S.day][S.slot%3], choice=S.caseAnswer;
    const answered=choice!=null, correct=choice===key;
    const showEvidence=S.day===1?['swapRetry',c.testEye,'eye']:S.day===2?['replay',c.seeTrace,'play']:['caseFlip',c.seeNerve,'flip'];
    html=`<div class="sub-label">${c.caseLabel} · ${t.practices[S.day]}</div><h2 id="dialogTitle">${c.caseLink}</h2><p class="case-question">${question}</p>
      <div class="case-answers">${options.map((label,i)=>`<button data-a="answer-${i}" aria-pressed="${choice===i}" class="${choice===i?(correct?'correct':'wrong'):''}"><i>${String.fromCharCode(65+i)}</i>${label}</button>`).join('')}</div>
      ${answered?`<p role="status" class="case-response"><b>${correct?c.correct:c.reconsider}</b> ${explanation}</p>`:''}
      <div class="action-row">${button(showEvidence[0],showEvidence[1],'primary',showEvidence[2])}${button('close',t.returnResult,'flat-link')}</div>`;
  }else if(S.modal==='replay'){
    const marks=S.marks,c=C(), day=S.traceDay, eye=replayEye(), actual=day===S.day;
    const legend=day===2?`<div class="replay-legend"><span><i class="actual"></i>${c.actualPath}</span><span><i class="ref"></i>${c.referencePath}</span></div>`:'';
    const compare=day===1?readComparison():day===2?`<p class="trace-note">${gloveDifference()}</p>`:'';
    const touches=reachesBall(S.shot,marks,day,eye);
    const clock=[[t.read,readAt(S.shot,marks,day,eye)],[t.dive,diveAt(S.shot,marks,day,eye)],...(touches?[[t.contact,CONTACT]]:[])];
    const tabs=c.labTabs.map((label,i)=>`<button data-a="trace-${i}" aria-pressed="${day===i}">${label}</button>`).join('');
    const note=day===0?c.referenceNote:day===1?(eye==='left'?c.leftFinding:c.rightFinding):c.coordFinding;
    html=`<div class="sub-label">${c.comparison} · ${t.practices[S.day]}</div><h2 id="dialogTitle">${c.labTitle}</h2><p>${c.labPrompt}</p><div class="sheet-tabs trace-tabs">${tabs}</div><p>${note}</p><div class="replay-plots">${['ball','hand'].map((k,i)=>`<figure><figcaption>${i?t.handPath:t.ballPath}</figcaption><canvas id="plot-${k}" aria-label="${i?t.handPath:t.ballPath}"></canvas></figure>`).join('')}</div>${legend}<div class="replay-tools">${button('replayToggle',S.replayOn?t.stopReplay:t.runReplay,'secondary',S.replayOn?'pause':'play')}<input id="replayRange" type="range" min="0" max="1000" value="${Math.round(S.replayT*1000)}" aria-label="${t.time}"></div>
      <div class="clock-notes">${clock.map(([label,v])=>`<span>${label} ${Math.round(v/CONTACT*100)}%</span>`).join('')}${!touches?`<span>${t.noTouch}</span>`:''}</div>${compare}<p class="measure-note">${actual?'':c.counterfactual+' '}${c.model}</p>
      <div class="action-row">${button('same',t.same,'primary','repeat')}${button('new',S.slot===4?t.nextSeries:t.next,'secondary','ball')}</div>`;
  }
  el.modalBody.innerHTML=html;el.modal.setAttribute('aria-labelledby','dialogTitle');if(S.modal==='compare')requestAnimationFrame(drawEye);if(S.modal==='replay')requestAnimationFrame(redrawReplay);
}
function openDialog(type,tab){if(type==='replay'&&!S.summary)return;cancelHold();S.modal=type;if(tab)S.tab=tab;if(type==='compare'){
  S.dialogFrame=S.mode==='result'?fieldState(S.shot,S.marks,S.day,eyeForRun(),readAt(S.shot,S.marks,S.day,eyeForRun()),{time:0,run:1,kick:1}):structuredClone(lastField??pitchFrame());
}if(type==='replay'){S.traceDay=S.day;S.replayT=0;S.replayOn=true;}dialogContent();if(!el.modal.open)el.modal.showModal();el.modal.scrollTop=0;drawUI();}
function closeDialog(focus=true){S.modal=null;S.replayOn=false;if(el.modal.open)el.modal.close();frameLast=performance.now();if(focus&&S.mode!=='home')el.view.focus({preventScroll:true});drawUI();}
function turnPitch(){if(!S.summary)return;S.flipStage=S.day===2?1:0;S.flipT=0;S.flipEye=eyeForRun();
  if(world?.printReverse){const sheet=document.createElement('canvas');sheet.width=768;sheet.height=432;drawNerve(sheet.getContext('2d'),768,432,nerveFrame(S.flipStage,'flip'));world.printReverse(sheet,S.flipStage,(S.day===1&&S.flipEye==='left'&&S.flipStage===0)||(S.day===2&&S.flipStage===1))}
  audio.fold();setMode('reverse');}
function action(a){
  if(a==='en'||a==='pt'){S.lang=a;save('language',a);applyLanguage();if(!S.modal&&S.mode!=='home')el.view.focus({preventScroll:true});return}
  if(a==='audio'){audio.set(!audio.enabled);save('sound',audio.enabled);applyLanguage();return}
  if(a.startsWith('day')){selectDay(Number(a.slice(3)));return}
  if(a==='start'||a==='same'||a==='new'){start(a==='new'?'new':'same');return}
  if(a==='guide'||a==='credits'){openDialog('guide',a==='credits'?'credits':'science');return}
  if(a.startsWith('tab-')){S.tab=a.slice(4);dialogContent();el.modal.querySelector(`[data-a="${a}"]`)?.focus();return}
  if(a==='pause'){openDialog('pause');return}
  if(a==='close'){closeDialog();return}
  if(a==='menu'){if(S.modal)closeDialog(false);selectDay(S.day);$('startBtn').focus({preventScroll:true});return}
  if(a==='case'){openDialog('case');return}
  if(a.startsWith('answer-')&&S.modal==='case'){S.caseAnswer=Number(a.slice(7));dialogContent();el.modal.querySelector(`[data-a="${a}"]`)?.focus();return}
  if(a==='swapRetry'){S.eye=eyeForRun()==='left'?'right':'left';start('same');return}
  if(a==='caseFlip'){closeDialog(false);turnPitch();return}
  if(a==='flip'){turnPitch();return}
  if(a==='backResult'){setMode('result');return}
  if(a==='flipEye'){S.flipEye=S.flipEye==='left'?'right':'left';S.flipT=0;drawUI();return}
  if(a==='circuit'){S.flipStage=(S.flipStage+1)%S.marks.length;S.flipT=0;drawUI();return}
  if(a==='replay'){openDialog('replay');return}
  if(a==='compare'){openDialog('compare');return}
  if(a.startsWith('eye-')){S.eye=a.slice(4);el.modal.querySelectorAll('.eye-tabs button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.a===a)));drawEye();if(S.mode==='home')lastDraw=-1;return}
  if(a.startsWith('trace-')&&S.modal==='replay'){
    S.traceDay=Number(a.slice(6));S.replayOn=false;dialogContent();
    el.modal.querySelector(`[data-a="${a}"]`)?.focus();return;
  }
  if(a==='replayToggle'){S.replayOn=!S.replayOn;if(S.replayOn&&S.replayT>=.998)S.replayT=0;dialogContent();return;}
}
document.addEventListener('click',e=>{const b=e.target.closest('button[data-a]');if(b)action(b.dataset.a)});
el.modal.addEventListener('cancel',e=>{e.preventDefault();closeDialog()});el.modal.addEventListener('click',e=>{if(e.target===el.modal){const b=el.modal.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)closeDialog()}});
document.addEventListener('input',e=>{if(e.target.id==='replayRange'){S.replayT=Number(e.target.value)/1000;S.replayOn=false;const b=el.modalBody.querySelector('[data-a="replayToggle"]');if(b)b.innerHTML=icon('play')+W().runReplay;redrawReplay()}});
el.arena.addEventListener('pointerdown',e=>{if(e.button!==0||!e.isPrimary||e.target.closest('button,a,input')||S.modal)return;
  if(S.mode==='home'){e.preventDefault();start();return}if(S.mode==='surf'){e.preventDefault();el.view.focus({preventScroll:true});beginHold(e.pointerId);try{el.arena.setPointerCapture?.(e.pointerId)}catch{/* Window-level release also covers browsers that decline capture. */}} });
document.addEventListener('pointerdown',e=>{if(S.mode==='surf'&&!S.modal&&e.isPrimary&&e.button===0&&!e.target.closest('#arena,button,a,input,dialog')){e.preventDefault();beginHold(e.pointerId)}});
window.addEventListener('pointerup',e=>{if(activeInput===e.pointerId){e.preventDefault();releaseHold(e.pointerId)}});
window.addEventListener('pointercancel',e=>{if(activeInput===e.pointerId){cancelHold();if(matchStarted())openDialog('pause')}});
window.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&!S.modal&&matchStarted()){e.preventDefault();openDialog('pause');return}if(S.modal||e.code!=='Space'||e.repeat)return;
  if(e.target.closest('button,a,input')&&e.target!==el.view)return;e.preventDefault();if(S.mode==='home')start();else if(S.mode==='surf')beginHold('space');else if(S.mode==='result'||S.mode==='flip')start('same');
});window.addEventListener('keyup',e=>{if(e.code==='Space'&&activeInput==='space'){e.preventDefault();releaseHold('space')}});
function pauseHidden(){if(!S.modal&&matchStarted()){cancelHold();openDialog('pause')}}
document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseHidden();frameLast=performance.now()});window.addEventListener('blur',()=>{if(S.holding)pauseHidden()});
function tick(stamp){
  const dt=Math.max(0,Math.min(.16,(stamp-frameLast)/1000));frameLast=stamp;
  if(!document.hidden){if(!S.modal){advance(dt);const interval=S.mode==='home'?1000/24:S.mode==='result'?1000/22:0;if(lastDraw<0||stamp-lastDraw>=interval){draw(stamp);lastDraw=stamp}}
    else if(S.modal==='replay'&&S.replayOn){S.replayT=clamp(S.replayT+dt*S.shot.pace/3.4);redrawReplay();if(S.replayT===1){S.replayOn=false;dialogContent();}}
  }requestAnimationFrame(tick);
}
selectDay(0);applyLanguage();requestAnimationFrame(tick);firstPaint();
