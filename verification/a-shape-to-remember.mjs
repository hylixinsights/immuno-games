// The browser modules are also exercised from Node to check progress after a reload.
import assert from 'node:assert/strict';
import { newJourney, restore, visit, act, objects, sceneConfig, chapters, line } from '../a-shape-to-remember/story.js';

import { stations, pathEnd, validPosition, startPosition } from '../a-shape-to-remember/route.js';
import { stagePrompt, momentText, stationName, actionName } from '../a-shape-to-remember/words.js';
import { peptidePuzzler } from '../a-shape-to-remember/peptide.js';

for (const target of [0, 1, 2]) {
  for (const sideStory of [true, false]) {
    let state = newJourney();
    state.started = true;
    state.name = 'Iara';
    state.target = target;
    function checkpoint() {
      for (const lang of ['en', 'pt']) {
        assert.ok(line(state)[lang]);
        assert.ok(stagePrompt(state)[lang]);
        for (const stop of stations(state)) {
          assert.ok(stop.at >= 0 && stop.at <= pathEnd[state.stage]);
          assert.ok(Number.isFinite(stop.lane) && stop.height > 0 && stop.art);
          assert.ok(stationName(stop, state)[lang] && actionName(stop, state)[lang]);
        }
        assert.ok(sceneConfig(state,lang,true).objects.every(o => o.label && Number.isFinite(o.x) && Number.isFinite(o.z)));
      }
      assert.deepEqual(validPosition(state.stage, startPosition(state)), startPosition(state));
      const copy = restore(JSON.parse(JSON.stringify(state)));
      assert.deepEqual(copy,state);
      state = copy;
    }
    function touch(id) {
      assert.ok(id.startsWith('@') || objects(state).some(o=>o.id===id),state.stage+' lacks '+id);
      const from=state.stage;
      const result=act(state,id);
      const words=momentText(id,from,state,result);
      if(words)assert.ok(words.en && words.pt);
      checkpoint();
      return result;
    }
    assert.equal(visit(state,'recall'),false);
    touch('origin');touch('friend');touch('node-tab');
    if(sideStory){
      touch('tonsil');touch('friend');touch('vellum');touch('leaf');touch('back');
      assert.ok(state.notes.includes('ebv'));
    }
    touch('trail');touch(sideStory?'decoy':'@watch');touch('@seen');
    assert.ok(state.notes.includes('specificity'));
    touch('follicle');
    const firstIndex=state.order.indexOf(target);
    assert.equal(touch('ant-4').sound,'brush');
    assert.equal(state.steps.recognition,'search');
    assert.equal(touch('ant-'+target).sound,'motif');
    touch('membrane');touch('mhc');touch('helper');touch('garden');touch('fan');
    touch('sister-0');touch('fdc');assert.equal(state.steps.garden,'choose');
    touch(sideStory?'sister-1':'sister-2');touch('fdc');touch('tfh');touch('il21');touch('marrow');
    touch('plasma');touch('antibody');touch('memory');touch('years');
    assert.notEqual(state.again.indexOf(target),firstIndex);
    assert.equal(touch('ant-3').sound,'brush');assert.equal(state.steps.recall,'search');
    assert.equal(touch('late-mica').message.en.includes('EBV'),sideStory);
    touch('ant-'+target);touch('expand');touch('finish');
    assert.ok(state.completed);assert.equal(state.notes.includes('recall'),true);
    assert.ok(touch('family').family);
    for(const place of chapters){assert.equal(visit(state,place),true);checkpoint();}
    assert.equal(visit(state,'tonsil'),true);touch('back');assert.equal(state.stage,'recall');
  }
}
assert.equal(restore({version:1,started:true,order:[]}),null);
console.log('Six complete journeys, both languages, all recognition contours, optional EBV, both selection outcomes, chapter revisits and save/restore passed.');

// Two taps and a drag must load the same peptide, exactly once. A miss leaves the
// vesicle open, so slow and one-handed input have the same biological outcome.
function verifyDock(gesture) {
  const parts = new Map();
  function control(name) {
    if (!parts.has(name)) {
      const listeners = {};
      parts.set(name, {listeners, classList:{add(){}}, style:{removeProperty(){}},
        setAttribute(){}, addEventListener(id,fn){listeners[id]=fn;},
        getBoundingClientRect(){return {left:90,right:145,top:40,bottom:100};}
      });
    }
    return parts.get(name);
  }
  let loaded=0;
  peptidePuzzler({querySelector:control}, 'pt', ()=>loaded++);
  const strip=control('.peptide-strip').listeners, socket=control('.mhc-socket').listeners;
  socket.click(); assert.equal(loaded,0);
  if(gesture==='tap') { strip.click(); socket.click(); }
  else {
    const event=(x,y)=>({pointerId:1,isPrimary:true,button:0,clientX:x,clientY:y});
    strip.pointerdown(event(10,30));strip.pointermove(event(28,30));strip.pointerup(event(28,30));assert.equal(loaded,0);
    strip.pointerdown(event(10,30));strip.pointermove(event(115,65));strip.pointerup(event(115,65));
  }
  socket.click();assert.equal(loaded,1);
}
verifyDock('tap'); verifyDock('drag');
assert.equal(validPosition('river', {at:NaN,lane:0}),null);
assert.deepEqual(validPosition('garden',{at:-4,lane:9}),{at:0,lane:2.15});
console.log('Route locations, bilingual contact controls, restored positions and both MHC II gestures passed.');
