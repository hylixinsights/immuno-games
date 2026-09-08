const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
for(const slug of ['single-cell','spatial']){
 const root=path.resolve(__dirname,'..',slug),ctx={window:{}};for(const file of ['course.js','recovery.js'])vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),ctx);
 const C=ctx.window.COURSE,E=require(path.join(root,'engine.js')).create(C),g=C.lessons[0].steps[0],s=E.blank(),q=g.questions[0],wrong=(q.answer+1)%3;
 assert.equal(E.submit(s,g.id,0,wrong).correct,false);assert.equal(E.progress(s).xp,0);assert.equal(E.resolved(s,g.id+':0'),false);
 const restored=E.validate(JSON.parse(JSON.stringify(s)));
 assert.equal(E.submit(restored,g.id,0,q.answer).locked,true);assert.equal(E.progress(restored).xp,0);assert.equal(E.award(restored,g.id,0),false);
 E.acknowledge(restored,g.id,0);assert(E.resolved(restored,g.id+':0'));assert.equal(E.progress(restored).xp,0);
 E.submit(restored,g.id,1,g.questions[1].answer);assert.equal(E.progress(restored).xp,10);assert(E.submit(restored,g.id,1,wrong).locked);
 const imported=E.blank();E.award(imported,g.id,0);const merged=E.merge(restored,imported);assert.equal(merged.answers[g.id+':0'],wrong);assert(!merged.solved.includes(g.id+':0'));
 for(const group of [...C.lessons.flatMap(l=>l.steps),...C.cases])group.questions.forEach((q,i)=>{E.submit(restored,group.id,i,q.answer);E.acknowledge(restored,group.id,i);});
 assert.equal(E.trophies(restored).length,5);
 const fail=C.final.questions.map(q=>(q.answer+1)%3);assert.equal(E.submitExam(restored,'final',fail).score,0);assert(!E.graduated(restored));
 assert(E.submitExam(E.validate(JSON.parse(JSON.stringify(restored))),'final',C.final.questions.map(q=>q.answer)).locked);
 const xp=E.progress(restored).xp;assert.equal(E.submitExam(restored,'final-review',C.recovery.questions.map(q=>q.answer)).score,5);assert(E.graduated(restored));assert.equal(E.progress(restored).xp,xp);
 const other=E.blank();other.best.final=5;assert.equal(E.merge(restored,other).best.final,0);
 const old=E.blank();delete old.answers;delete old.reviewed;delete old.examAttempts;old.solved=[g.id+':0'];old.best['mastery-A']=5;const migrated=E.validate(old);assert(migrated.solved.includes(g.id+':0'));assert(E.examDone(migrated,'mastery-A'));assert(E.submit(migrated,g.id,0,wrong).locked);
 assert.throws(()=>E.validate({...restored,answers:{unknown:0}}));assert.throws(()=>E.submitExam(E.blank(),'final',[0,0,0,0,0]));
 const allPrompts=[...C.lessons.flatMap(l=>l.steps.flatMap(s=>s.questions)),...C.cases.flatMap(g=>g.questions),...C.mastery.flatMap(g=>g.questions),...C.final.questions].map(q=>q.prompt);
 for(const q of C.recovery.questions){assert(!allPrompts.includes(q.prompt));assert.equal(new Set(q.options).size,3);assert(q.explanation.length>30);}
 console.log('PASS '+slug+': one submission, wrong-answer review without XP, reload/import locks, legacy migration, one separate recovery, final gates.');
}
