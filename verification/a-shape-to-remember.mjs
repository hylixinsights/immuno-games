// The browser modules are also exercised from Node to check progress after a reload.
import assert from 'node:assert/strict';
import { newJourney, restore, visit, act, objects, sceneConfig, chapters, line } from '../a-shape-to-remember/story.js';

for (const target of [0, 1, 2]) {
  for (const sideStory of [true, false]) {
    let state = newJourney();
    state.started = true;
    state.name = 'Iara';
    state.target = target;
    function checkpoint() {
      for (const lang of ['en', 'pt']) {
        assert.ok(line(state)[lang]);
        assert.ok(sceneConfig(state,lang,true).objects.every(o => o.label && Number.isFinite(o.x) && Number.isFinite(o.z)));
      }
      const copy = restore(JSON.parse(JSON.stringify(state)));
      assert.deepEqual(copy,state);
      state = copy;
    }
    function touch(id) {
      assert.ok(id.startsWith('@') || objects(state).some(o=>o.id===id),state.stage+' lacks '+id);
      const result=act(state,id);
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
