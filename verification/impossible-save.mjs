import assert from 'node:assert/strict';
import {BALL_RADIUS, CONTACT, makeShot, randomStream, jumpGeometry, judge, reachesBall,
  finish, readAt, diveAt, handAt, incoming} from '../impossible-save/rules.js';
import {coaching} from '../impossible-save/coaching.js';

const next=randomStream(0xcafeba11);
const totals={fixed:0, blind:0, aimed:0, clean:0};
const outcomes=new Set();
const count=12000;

function centered(shot,day,stage,age) {
  const start=jumpGeometry(shot,day,stage,age,0);
  const end=jumpGeometry(shot,day,stage,age,shot.sweeps[stage]);
  assert.ok(start.landingX < start.targetX && start.targetX < end.landingX);
  return (start.targetX-start.landingX)/(end.landingX-start.landingX)*shot.sweeps[stage];
}
function signedMiss(shot,day,stage,widths) {
  const g=jumpGeometry(shot,day,stage,.20,0);
  return judge({...g,landingX:g.targetX+widths*g.targetRadius});
}
for(let i=0;i<count;i++){
  const seed=Math.floor(next()*4294967296),day=i%3, eye=day===1?'left':'right';
  const shot=makeShot(seed,Math.floor(i/3)%5);
  const ages=[next()*.5,next()*.5,next()*.5];
  const blind=[.15+next()*.78,.15+next()*.78,.15+next()*.78];
  const aimed=ages.map((age,j)=>centered(shot,day,j,age));
  for(const [name,holds] of [['fixed',[.45,.45,.45]],['blind',blind],['aimed',aimed]]){
    const marks=holds.map((h,j)=>judge(jumpGeometry(shot,day,j,ages[j],h)));
    const result=finish(shot,marks,day,eye);
    totals[name]+=Number(result.saved);outcomes.add(result.outcome);
    const markedMisses=marks.filter(m=>m.band==='miss'||m.timeout);
    if(markedMisses.length>=2)assert.equal(result.saved,false);
    if(result.outcome==='catch')assert.ok(marks.every(m=>m.perfect));
    if(!result.saved)assert.equal(result.score,0);
    if(name==='aimed'){
      assert.equal(result.outcome,'catch');assert.equal(result.score,770);totals.clean++;
    }
    const b=incoming(shot,CONTACT),h=handAt(shot,marks,day,eye,CONTACT);
    assert.ok(Math.abs(Math.hypot(b.x-h.x,b.y-h.y,b.z-h.z)-result.miss)<1e-9);
    assert.equal(reachesBall(shot,marks,day,eye),result.miss<=BALL_RADIUS);
    assert.equal(!reachesBall(shot,marks,day,eye),result.outcome==='beaten');
    assert.equal(readAt(shot,marks,0,'right'),readAt(shot,marks,2,'right'));
    assert.equal(diveAt(shot,marks,0,'right'),diveAt(shot,marks,2,'right'));
    assert.ok(readAt(shot,marks,1,'left')>readAt(shot,marks,1,'right'));
    assert.equal(readAt(shot,marks,1,'right'),readAt(shot,marks,0,'right'));
  }
}
assert.ok(totals.fixed/count < .03 && totals.blind/count < .12);
assert.deepEqual([...outcomes].sort(),['beaten','catch','inside','parry','spill','tip']);
const shot=makeShot(0x5e21b3);
const perfect=[0,1,2].map(j=>signedMiss(shot,0,j,0));
const severe=[0,1,2].map(j=>signedMiss(shot,0,j,-5));
assert.equal(finish(shot,[severe[0],perfect[1],perfect[2]],0,'right').outcome,'tip');
assert.equal(finish(shot,[severe[0],perfect[1],severe[2]],0,'right').outcome,'inside');
assert.equal(finish(shot,[perfect[0],perfect[1],severe[2]],0,'right').outcome,'spill');
assert.equal(finish(shot,[severe[0],severe[1]],0,'right').outcome,'beaten');
assert.deepEqual(makeShot(shot.seed),shot);
assert.deepEqual(coaching.en.cases.map(a=>a.map(c=>c[2])),coaching.pt.cases.map(a=>a.map(c=>c[2])));
for(const copy of Object.values(coaching)){
  assert.equal(copy.cases.flat(1).length,9);
  for(const cases of copy.cases)for(const [,choices,answer,explanation] of cases){
    assert.ok(choices[answer]&&explanation.length>30);
  }
}
console.log('12,000 kicks per policy (all three days), all six outcomes, contact geometry, recovery and matched circuits:',totals);

// Identical hand timings across all conditions, with no tuning to any one lesion.
const {releaseMargin,matchedTrial,exampleLandings}=await import('../impossible-save/rules.js');
const {immuneFrame,immuneStops,immuneStage,immuneCopy,immuneSources}=await import('../impossible-save/immune.js');
const pairedRandom=randomStream(0x23a91),saves=[0,0,0,0];
for(let i=0;i<10000;i++){
  const shot=makeShot(Math.floor(pairedRandom()*4294967296),i%5);
  const inputs=[0,1,2].map(stage=>{
    const age=pairedRandom()*.65;
    const held=centered(shot,0,stage,age)+(pairedRandom()*2-1)*.100;
    return {...judge(jumpGeometry(shot,0,stage,age,held)),age,held};
  });
  const [ref,optic,motor,right]=[[0,'right'],[1,'left'],[2,'right'],[1,'right']].map(
    ([d,e])=>matchedTrial(shot,inputs,d,e));
  for(const [k,trial] of [ref,optic,motor,right].entries()){
    saves[k]+=Number(trial.result.saved);
    for(const [stage,m] of trial.marks.entries()){
      const g=jumpGeometry(shot,trial.day,stage,m.age,m.held,trial.eye);
      assert.equal(m.geometry.landingX,g.landingX);
      assert.equal(m.quality,judge(g).quality);
      assert.equal(m.geometry.targetRadius,g.referenceRadius*releaseMargin(trial.day,trial.eye,stage));
    }
  }
  assert.equal(ref.result.outcome,right.result.outcome);
  assert.equal(ref.read,motor.read);assert.equal(ref.dive,motor.dive);
  assert.ok(optic.read>ref.read);
}
assert.equal(saves[0],saves[3]);assert.ok(saves[0]>6500&&saves[0]<8500);
assert.ok(saves[1]<saves[0]*.65 && saves[1]>1800);
assert.ok(saves[2]<saves[0]*.65 && saves[2]>1500);
const example=exampleLandings(shot),copies=[0,1,2].map(day=>matchedTrial(shot,example,day));
assert.deepEqual(copies.map(c=>c.result.outcome),['catch','tip','beaten']);
assert.equal(copies[0].dive,copies[2].dive);
assert.equal(matchedTrial(shot,example.slice(0,2),0).result,null);
for(let k=0;k<=100;k++){
  const untreated=immuneFrame(k/100,false),treated=immuneFrame(k/100,true);
  assert.ok(treated.bound && !treated.inTissue && treated.priorLesion && untreated.priorLesion);
  assert.equal(untreated.bound,false);
}
assert.ok(immuneFrame(1,false).inTissue);
assert.deepEqual(immuneStops.map(immuneStage),[0,1,2]);
for(const copy of Object.values(immuneCopy)){
  assert.equal(copy.refs.length,immuneSources.length);assert.equal(copy.phases.length,2);
  assert.ok(copy.phases.every(p=>p.length===3));assert.equal(copy.questions.length,2);
}
console.log('Identical kick and release errors up to 100 ms; 10,000 saves tested per pathway:',saves);

// The football-first shootout runs on a continuous ball clock in both halves.
const duel=await import('../impossible-save/duel-model.js');
const saved=score=>({saved:true,score}), lost={saved:false,score:0};
assert.equal(duel.shootoutScore([lost,lost,lost,lost,lost]),0);
assert.equal(duel.shootoutScore([saved(500),saved(300),lost,saved(180),lost]),1025);
assert.equal(duel.shootoutScore([saved(600),saved(600),saved(600),saved(600),saved(600)]),3450);
const ds=duel.penalty(0x5e21b3);
const wind=ds.idealPower*ds.sweep, press=duel.readTime(ds,'clear')+.19, release=press+wind;
const match=c=>duel.verdict(ds,c,duel.jump(ds,c,press,release),.28);
assert.equal(match('clear').outcome,'catch');
assert.deepEqual([match('optic').outcome,match('optic').reason],['beaten','optic']);
assert.deepEqual([match('motor').outcome,match('motor').reason],['beaten','overshoot']);
// Betting on a corner before the visual cue helps only if the guess is right.
assert.equal(duel.verdict(ds,'optic',duel.jump(ds,'optic',press,release,ds.side,press),.28).outcome,'catch');
const returnHold=wind*1.31;
assert.ok(duel.reachRatio(ds,'motor',wind)>1.35);
assert.ok(Math.abs(duel.reachRatio(ds,'motor',returnHold)-1)<.12);
assert.ok(duel.reachRatio(ds,'motor',wind*1.53)<.85);
assert.equal(duel.jump(ds,'clear',0,ds.air+.01),null);
assert.equal(duel.readTime(ds,'clear'),duel.readTime(ds,'motor'));
assert.ok(duel.readTime(ds,'optic')-duel.readTime(ds,'clear')>.65);
for(const c of ['clear','optic','motor']){
  assert.equal(duel.verdict(ds,c,null,null).saved,false);
  assert.equal(duel.verdict(ds,c,duel.jump(ds,c,press,release,-ds.side),.28).reason,'wrong');
}
const opts=['clear','optic','motor'],reacting=[0,0,0],adapted=[0,0,0],pairedOutcomes=new Set(),samples=5000;
const rng=randomStream(63217);
for(let n=0;n<samples;n++){
  const shot=duel.penalty(Math.floor(rng()*4294967296),n%5);
  const reaction=.14+rng()*.36, jitter=(rng()*2-1)*.13, touch=rng()<.19?null:rng()*.50;
  for(const [k,c] of opts.entries()){
    const down=duel.readTime(shot,c)+reaction, held=shot.idealPower*shot.sweep+jitter;
    const m=duel.jump(shot,c,down,down+held);
    const v=duel.verdict(shot,c,m,touch);reacting[k]+=Number(v.saved);pairedOutcomes.add(v.outcome);
    const f=duel.pitchFrame(shot,c,m,shot.air);
    const hand=f.hand??duel.gloveAt(shot,c,m,shot.air);
    assert.ok(Math.abs(Math.hypot(f.ball.x-hand.x,f.ball.y-hand.y)-v.gap)<1e-6);
    assert.equal(v.touches,duel.contact(shot,c,m).touches);
    assert.ok(v.saved||v.score===0);
    // A player who reads the new trajectory can still reach and catch every shot.
    let lo=0,hi=shot.idealPower*shot.sweep*1.01;
    for(let j=0;j<18;j++){const mid=(lo+hi)/2;if(duel.reachRatio(shot,c,mid)>1)hi=mid;else lo=mid;}
    const early=duel.readTime(shot,c)+.05, perfect=duel.jump(shot,c,early,early+hi);
    adapted[k]+=Number(duel.verdict(shot,c,perfect,.28).outcome==='catch');
    assert.equal(duel.verdict(shot,c,perfect,null).outcome,'parry');
    assert.deepEqual(duel.pitchFrame(shot,c,null,shot.air*.6).ball,duel.pitchFrame(shot,'clear',null,shot.air*.6).ball);
  }
}
assert.equal(pairedOutcomes.size,6);
assert.ok(reacting[0]>samples*.55&&reacting[0]<samples*.93);
assert.ok(reacting[1]<reacting[0]*.66&&reacting[1]>samples*.12);
assert.ok(reacting[2]<reacting[0]*.55&&reacting[2]>0);
assert.deepEqual(adapted,[samples,samples,samples]);
console.log('Continuous-clock pairs, same human reaction and hold error:',reacting,'of',samples,'per circuit; adapted:',adapted);
