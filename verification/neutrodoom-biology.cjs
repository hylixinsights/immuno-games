'use strict';

// Execute the actual game with inert browser/drawing adapters. This verifies
// gameplay, not layout; responsive layout and pointer controls need browser QA.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const {execFileSync} = require('node:child_process');
const root = path.resolve(__dirname, '..');
const gamePath = path.join(root, 'neutrodoom/index.html');
const currentHTML = fs.readFileSync(gamePath, 'utf8');
const baselineHTML = execFileSync('git', ['show', 'b654344:neutrodoom/index.html'], {cwd:root, encoding:'utf8'});
const plain = value => JSON.parse(JSON.stringify(value));
const inlineScripts = html => [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(match => match[1]);

function loadGame(html, preferences = {}) {
  const elements = new Map(), events = new Map(), timers = new Map();
  let timerId = 0, randomSeed = 12345;
  const noop = () => {};
  const canvas = new Proxy({
    createImageData:(w,h) => ({data:new Uint8ClampedArray(w*h*4), width:w, height:h}),
    getImageData:(x,y,w,h) => ({data:new Uint8ClampedArray(w*h*4), width:w, height:h}),
    createLinearGradient:() => ({addColorStop:noop}),
    createRadialGradient:() => ({addColorStop:noop}),
    createPattern:() => ({}),
    measureText:text => ({width:String(text).length*8}),
  }, {get:(target,key) => key in target ? target[key] : noop});
  function element(id = '') {
    if (id && elements.has(id)) return elements.get(id);
    const classes = new Set(), attributes = new Map(), listeners = new Map(), children = new Map();
    const node = {
      id, tagName:'DIV', hidden:false, checked:false, value:id==='difficulty'?'veteran':'',
      textContent:'', innerHTML:'', dataset:{}, clientWidth:1280, clientHeight:720,
      width:1280, height:720, offsetParent:{}, scrollTop:0,
      style:{setProperty:noop, removeProperty:noop},
      classList:{add:(...names)=>names.forEach(n=>classes.add(n)), remove:(...names)=>names.forEach(n=>classes.delete(n)), contains:name=>classes.has(name), toggle(name,force){const next=force??!classes.has(name);next?classes.add(name):classes.delete(name);return next;}},
      setAttribute:(name,value)=>attributes.set(name,String(value)), getAttribute:name=>attributes.get(name)??null,
      removeAttribute:name=>attributes.delete(name),
      addEventListener(name,fn){if(!listeners.has(name))listeners.set(name,[]);listeners.get(name).push(fn);},
      dispatch(name,detail={}){for(const fn of listeners.get(name)||[])fn({target:node,preventDefault:noop,stopPropagation:noop,...detail});},
      querySelector(selector){if(!children.has(selector))children.set(selector,element());return children.get(selector);},
      querySelectorAll:()=>[], closest:()=>null,
      getBoundingClientRect:()=>({x:0,y:0,left:0,top:0,width:1280,height:720}),
      getContext:()=>canvas, append:noop, replaceChildren:noop, remove:noop,
      focus(){document.activeElement=node;}, blur(){document.activeElement=null;},
      select:noop, click(){node.dispatch('click');},
    };
    Object.defineProperties(node,{firstElementChild:{get:()=>node.querySelector(':first-child')},lastElementChild:{get:()=>node.querySelector(':last-child')}});
    if(id) elements.set(id,node);
    return node;
  }
  const document = {
    hidden:false, pointerLockElement:null, activeElement:null,
    getElementById:element, createElement:tag=>{const n=element();n.tagName=tag.toUpperCase();return n;},
    querySelector:selector=>element(selector),
    querySelectorAll:selector=>selector==='.phag'?[element('ph0'),element('ph1'),element('ph2')]:selector==='[data-learning-setting]'?[element('learningTitle'),element('learningPause')]:[],
    createTreeWalker:()=>({nextNode:()=>null}),
    addEventListener(name,fn){if(!events.has(name))events.set(name,[]);events.get(name).push(fn);},
    exitPointerLock:noop,
  };
  document.body=element('body');document.documentElement=element('html');
  for(const match of html.matchAll(/<([a-z][a-z0-9]*)\b([^>]*\bid="([^"]+)"[^>]*)>/gi)) {
    const node=element(match[3]);node.tagName=match[1].toUpperCase();node.hidden=/\bhidden\b/.test(match[2]);
    const value=match[2].match(/\bvalue="([^"]*)"/);if(value)node.value=value[1];
  }
  const storage = new Map([['neutrodoom.preferences',JSON.stringify({...preferences,music:false,sfx:false})]]);
  const math = Object.create(Math);
  math.random=()=>{randomSeed=(Math.imul(randomSeed,1664525)+1013904223)>>>0;return randomSeed/4294967296;};
  const context = vm.createContext({
    console, document, Math:math, URL, URLSearchParams, Blob,
    location:{search:'',href:'https://example.test/neutrodoom/'},
    navigator:{}, performance:{now:()=>0},
    localStorage:{getItem:key=>storage.get(key)??null,setItem:(key,value)=>storage.set(key,value)},
    NodeFilter:{SHOW_TEXT:4}, Image:class {},
    setTimeout:(fn,delay)=>{timers.set(++timerId,{fn,delay});return timerId;}, clearTimeout:id=>timers.delete(id),
    setInterval:()=>++timerId, clearInterval:noop, requestAnimationFrame:noop,
    addEventListener:document.addEventListener.bind(document),
    matchMedia:()=>({matches:false}),
  });
  context.window=context;
  const script=inlineScripts(html).find(source=>source.includes('window.__neutrodoom='));
  assert(script,'Actual game script is present');
  // Expose existing lexical values solely inside this test VM.
  const exposed=script.replace(/\}\)\(\);\s*$/, 'window.__checks={MODES,why,net,applyLocale};})();');
  new vm.Script(exposed,{filename:'neutrodoom/index.html'}).runInContext(context,{timeout:10000});
  return {game:context.__neutrodoom, checks:context.__checks, elements, timers, context};
}

function start(h, difficulty='veteran') {
  h.elements.get('difficulty').value=difficulty;
  h.game.newGame(0);
  const {G,P}=h.game;
  Object.assign(G,{queue:[],enemies:[],births:[],shots:[],nets:[],picks:[],parts:[],waveDone:false,cleared:0,score:0,kills:0,phago:0,combo:0,comboT:0,maxCombo:0,collateral:0});
  Object.assign(P,{x:3.5,y:2.5,a:0,hp:50,gran:100,slots:[0,0,0],slotMax:[1,1,1],engulf:0,fireCd:0,netCd:0,rosCd:0,dead:false});
}

function enemy(h,type,fields={}) {
  const {P,G}=h.game;
  const e=h.game.spawnEnemy(type,P.x+.7,P.y);
  Object.assign(e,{spawnGrace:0},fields);
  G.births=[];G.enemies=[e];
  return e;
}

function mechanics(h) {
  const g=h.game, snapshots={};
  snapshots.waves=plain(g.WAVES.map(w=>({ep:w.ep,s:w.s,ab:!!w.ab})));
  snapshots.difficulties=plain(h.checks.MODES);
  for(const difficulty of ['recruit','veteran','nightmare']) {
    snapshots[difficulty]={};
    for(const type of ['swarm','nuclease','yeast','hypha','boss','capsule','toxin']) {
      start(h,difficulty);const e=enemy(h,type);g.phago();
      snapshots[difficulty]['engulf-'+type]=plain({dead:e.dead,hp:e.hp,phago:g.G.phago,kills:g.G.kills,score:g.G.score,slots:g.P.slots});
      assert.equal(e.dead,['swarm','nuclease','yeast'].includes(type),`${difficulty}: engulf eligibility for ${type}`);
    }
    start(h,difficulty);const cap=enemy(h,'capsule',{ops:16});g.phago();
    assert(cap.dead,'Opsonized capsules can be engulfed');
    snapshots[difficulty].opsonized=plain({dead:cap.dead,slots:g.P.slots,score:g.G.score});
    start(h,difficulty);const tox=enemy(h,'toxin');tox.hp=tox.max*.5;g.phago();
    assert(tox.dead,'Toxin aggregate can be engulfed at the existing half-health threshold');
    snapshots[difficulty].toxinThreshold=plain({dead:tox.dead,slots:g.P.slots,score:g.G.score});
    start(h,difficulty);const full=enemy(h,'swarm');g.P.slots=[1,1,1];g.phago();
    assert(!full.dead,'Three occupied slots prevent another engulfment');
    snapshots[difficulty].full=plain({dead:full.dead,slots:g.P.slots,score:g.G.score});
    for(const ops of [0,16]) {
      start(h,difficulty);const e=enemy(h,'capsule',{ops});const hp=e.hp;g.fire();
      assert.equal(g.P.gran,90,'Granule shot costs 10');assert.equal(g.P.fireCd,.32);
      assert(e.hp<hp,'Granules damage capsule');
      snapshots[difficulty]['granules-'+ops]=plain({hp:e.hp,gran:g.P.gran,cd:g.P.fireCd,score:g.G.score});
    }
    start(h,difficulty);enemy(h,'swarm');g.P.gran=9;g.fire();assert.equal(g.P.gran,9,'Insufficient resources cannot fire');
    snapshots[difficulty].dryFire=plain({hp:g.G.enemies[0].hp,gran:g.P.gran,cd:g.P.fireCd});
    start(h,difficulty);const target=enemy(h,'boss');const hp=target.hp;
    // Put one existing tissue cell within the existing area-of-effect rule.
    const tissueCell=g.CELLS[0], saved={x:tissueCell.x,y:tissueCell.y};
    tissueCell.x=g.P.x;tissueCell.y=g.P.y;g.ros();
    assert.equal(hp-target.hp,130,'ROS retains its damage');assert.equal(g.P.gran,80);assert.equal(g.P.rosCd,7);
    assert(tissueCell.hp<100&&g.G.collateral>0,'ROS still harms nearby tissue and counts collateral');
    snapshots[difficulty].ros=plain({hp:target.hp,gran:g.P.gran,cd:g.P.rosCd,cell:tissueCell.hp,collateral:g.G.collateral});
    Object.assign(tissueCell,saved);
    start(h,difficulty);enemy(h,'boss');g.P.gran=19;g.ros();
    snapshots[difficulty].dryROS=plain({hp:g.G.enemies[0].hp,gran:g.P.gran,cd:g.P.rosCd});
    assert.equal(g.P.gran,19);assert.equal(g.P.rosCd,0);
    start(h,difficulty);h.checks.net();
    assert.equal(g.P.gran,100,'Q has no granule charge');assert.equal(g.P.netCd,13);assert.equal(g.G.nets.length,1);assert.equal(g.G.nets[0].lytic,false,'Q is nonlytic');
    h.checks.net();assert.equal(g.G.nets.length,1,'Q cooldown prevents repeated casts');
    snapshots[difficulty].net=plain({gran:g.P.gran,cd:g.P.netCd,nets:g.G.nets.map(({x,y,r,hp,dur,lytic})=>({x,y,r,hp,dur,lytic}))});
  }
  start(h);Object.assign(g.G,{cleared:7,score:3750,kills:25,phago:10,maxCombo:6,time:123,collateral:20,lives:1});
  snapshots.score=plain(g.scoreResult('win'));
  delete snapshots.score.date;
  // Clear waves where optional learned cards are expected. Their arrival must
  // preserve the fast-wave cadence and may not pause the player automatically.
  snapshots.transitions=[];
  for(const wave of [0,2,4,5]) {
    start(h);g.startWave(wave);g.G.cleared=wave;g.G.queue=[];g.G.enemies=[];g.G.births=[];
    g.update(.025);
    assert.equal(g.G.state,'play','Learning cards do not force a pause');
    assert.equal(g.G.nextT,.725,'Wave-clear delay is unchanged');
    assert.equal(g.G.score,0,'Learning cards do not award combat points');
    g.update(.725);
    assert.equal(g.G.wave,wave+1,'Learning cards do not delay the next wave');
    snapshots.transitions.push(plain({wave:g.G.wave,cleared:g.G.cleared,nextT:g.G.nextT,state:g.G.state,time:g.G.time,score:g.G.score,queue:g.G.queue}));
  }
  return snapshots;
}

for(const [index,source] of inlineScripts(currentHTML).entries())new vm.Script(source,{filename:`game-inline-${index}.js`});
const baseline=mechanics(loadGame(baselineHTML));
assert.equal(baseline.waves.length,7);assert.equal(new Set(baseline.waves.map(w=>w.ep)).size,3);
assert.deepEqual(baseline.waves.map(w=>w.s),[{swarm:14},{swarm:12,toxin:3},{swarm:16,toxin:3,nuclease:3},{capsule:5,swarm:10},{capsule:6,toxin:4,nuclease:4,swarm:12},{yeast:14,swarm:4},{boss:1,yeast:6,swarm:12,nuclease:2}]);
for(const learning of [false,true]) {
  const result=mechanics(loadGame(currentHTML,{learning}));
  assert.deepEqual(result,baseline,`Current gameplay matches b654344 with optional learning=${learning}`);
}

const learningHarness=loadGame(currentHTML), lg=learningHarness.game, nodes=learningHarness.elements;
assert.equal(lg.SETTINGS.learning,false,'Molecule tips are opt-in');
for(const enabled of [false,true]) {
  nodes.get('learningTitle').checked=enabled;nodes.get('learningTitle').dispatch('change');
  assert.equal(lg.SETTINGS.learning,enabled);assert.equal(nodes.get('learningPause').checked,enabled,'Both settings stay synchronized');
  assert.equal(JSON.parse(learningHarness.context.localStorage.getItem('neutrodoom.preferences')).learning,enabled,'Learning setting is saved');
  for(const ability of ['phago','fire','ros','net']) {
    start(learningHarness);enemy(learningHarness,'swarm');
    (ability==='net'?learningHarness.checks.net:lg[ability])();
    assert.equal(nodes.get('moleculeTip').hidden,!enabled,`${ability}: tips only appear when opted in`);
    if(enabled)assert(nodes.get('moleculeText').textContent.length>0,'A successful ability provides actual molecular information');
    assert.equal(lg.G.state,'play','Molecule tips never pause combat');
  }
}
start(learningHarness);enemy(learningHarness,'hypha');lg.phago();
assert.equal(nodes.get('moleculeTip').hidden,true,'A failed engulf does not show a success tooltip');
assert(nodes.get('toast').textContent.length>0,'Failed engulf explains the obstacle');
start(learningHarness);lg.G.queue=[];lg.G.enemies=[];lg.G.births=[];lg.update(.025);
assert.equal(nodes.get('learnedBtn').hidden,false,'Clearing a milestone offers an optional recap');
assert.equal(lg.G.state,'play','The recap invitation does not stop combat');
const beforeRecap=plain({score:lg.G.score,time:lg.G.time,nextT:lg.G.nextT,wave:lg.G.wave});
lg.K.KeyW=true;lg.IN.fire=true;nodes.get('learnedBtn').click();
assert.equal(lg.G.state,'pause');assert.equal(nodes.get('learnedCard').open,true);
assert.equal(lg.K.KeyW,false);assert.equal(lg.IN.fire,false,'Reading a recap clears held controls');
nodes.get('resumeBtn').click();assert.equal(lg.G.state,'play');
assert.deepEqual(plain({score:lg.G.score,time:lg.G.time,nextT:lg.G.nextT,wave:lg.G.wave}),beforeRecap,'Opening/closing a recap preserves progress and wave timing');
start(learningHarness);enemy(learningHarness,'swarm');lg.fire();
assert.equal(nodes.get('moleculeTip').hidden,false);
nodes.get('learningPause').checked=false;nodes.get('learningPause').dispatch('change');
assert.equal(nodes.get('moleculeTip').hidden,true,'Disabling tips hides an active tooltip');
lg.newGame(0);assert.equal(nodes.get('learnedBtn').hidden,true,'New campaign resets recap history');

assert.match(currentHTML,/<a\b[^>]*data-biology-link[^>]*href="biology\.html\?lang=en"/,'Main menu links to the separate biology page');
assert.match(currentHTML,/<a\b[^>]*data-topic="quiz"[^>]*href="biology\.html\?lang=en#quiz"[^>]*target="_blank"/,'Optional final challenge preserves the game tab');
assert(!/<(?:script|iframe)\b[^>]*src=["'][^"']*biology/i.test(currentHTML),'The FPS does not load the biology page or scripts');
assert(!/<link\b[^>]*href=["'][^"']*biology\.css/i.test(currentHTML),'The FPS does not load the biology stylesheet');
const biologyDir=path.join(root,'neutrodoom'), biologyHTML=fs.readFileSync(path.join(biologyDir,'biology.html'),'utf8');
for(const match of biologyHTML.matchAll(/<script\b[^>]*src="([^"]+)"/gi)) {
  const scriptPath=path.resolve(biologyDir,match[1]);
  assert(scriptPath.startsWith(biologyDir+path.sep),'Biology scripts are local to the game');
  new vm.Script(fs.readFileSync(scriptPath,'utf8'),{filename:match[1]});
}
const dataContext={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(biologyDir,'biology-content.js'),'utf8'),dataContext);
const content=dataContext.window.NEUTRO_BIOLOGY;
assert.equal(content.abilities.length,4);assert.equal(content.waves.length,7);assert.equal(content.quiz.length,5);
const pair=(value,label)=>assert(Array.isArray(value)&&value.length===2&&value.every(s=>typeof s==='string'&&s.trim()),`${label} has English and Portuguese text`);
const references=new Set(content.references.map(ref=>ref.n));
assert.equal(references.size,content.references.length,'Reference identifiers are unique');
for(const ability of content.abilities) {
  for(const field of ['name','game','limitation'])pair(ability[field],`${ability.id}.${field}`);
  assert(ability.biology.length&&ability.molecules.length,`${ability.id} has biological and molecular explanations`);
  ability.biology.forEach(value=>pair(value,`${ability.id}.biology`));
  ability.molecules.forEach(molecule=>{
    // Formula labels are shared between languages; their explanations are not.
    if(typeof molecule.name==='string')assert(molecule.name.trim());else pair(molecule.name,`${ability.id}.molecule`);
    pair(molecule.text,`${ability.id}.molecule description`);
  });
  assert(ability.refs.every(id=>references.has(id)),`${ability.id} cites existing references`);
}
for(const [index,wave] of content.waves.entries()) {
  assert.equal(wave.n,index+1);assert.equal(wave.episode,index<3?1:index<5?2:3);
  for(const field of ['name','enemies','game','biology','note'])pair(wave[field],`Wave ${wave.n}.${field}`);
}
for(const [index,question] of content.quiz.entries()) {
  pair(question.q,`Question ${index+1}`);pair(question.explanation,`Question ${index+1} explanation`);
  assert(question.options.length>=2);question.options.forEach(option=>pair(option,`Question ${index+1} option`));
  assert(Number.isInteger(question.correct)&&question.correct>=0&&question.correct<question.options.length,'Quiz answer points to an existing option');
}
for(const ref of content.references)assert(/^https:\/\/(?:doi\.org\/10\.|pubmed\.ncbi\.nlm\.nih\.gov\/\d)/.test(ref.url),'References link to DOI or PubMed records');
assert(!currentHTML.includes('window.NEUTRO_BIOLOGY'),'The full educational content remains outside the FPS payload');
console.log('PASS NEUTRODOOM: gameplay matches b654344; optional learning, recap/resume, separate assets, bilingual content, seven-wave guide and five-question quiz verified.');
