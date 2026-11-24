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
