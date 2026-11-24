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
