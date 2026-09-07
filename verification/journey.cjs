const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
for(const slug of ['single-cell','spatial']){
 const dir=path.resolve(__dirname,'..',slug),ctx={window:{}};
 for(const file of ['course.js','journey.js'])vm.runInNewContext(fs.readFileSync(path.join(dir,file),'utf8'),ctx);
 const C=ctx.window.COURSE,J=ctx.window.LearningJourney,E=require(path.join(dir,'engine.js')).create(C),s=E.blank();
 assert(J.model(C,E,s).every(b=>b.ratio===0));assert(!E.graduated(s));
 const first=C.lessons[0].steps[0];E.award(s,first.id,0);
 assert(J.model(C,E,s)[0].ratio>0);assert.equal(J.model(C,E,s)[1].ratio,0);
 const before=J.model(C,E,s)[0].ratio;E.award(s,first.id,0);assert.equal(J.model(C,E,s)[0].ratio,before);
 for(const b of C.blocks.slice().reverse()){
  for(const l of C.lessons.filter(l=>l.block===b.id))for(const g of l.steps)g.questions.forEach((_,i)=>E.award(s,g.id,i));
  const g=C.cases.find(g=>g.block===b.id);g.questions.forEach((_,i)=>E.award(s,g.id,i));
  assert(J.model(C,E,s).find(x=>x.id===b.id).done);
 }
 assert(J.model(C,E,s).every(b=>b.ratio===1));assert(!E.graduated(s));
 s.best.final=3;assert(!J.render(C,E,s).includes('Finish line reached!'));
 s.best.final=4;assert(J.render(C,E,s).includes('Finish line reached!'));
 const imported=E.validate(JSON.parse(JSON.stringify(s)));assert.equal(J.render(C,E,s),J.render(C,E,imported));
 assert(J.render(C,E,imported).includes('#achievements'));
 console.log('PASS '+slug+': partial and out-of-order progress, duplicate answers, trophies, final threshold and existing progress imports.');
}
