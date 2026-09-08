const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
for(const slug of ['single-cell','spatial']){
 const root=path.resolve(__dirname,'..',slug),ctx={window:{}};
 for(const f of ['course.js','recovery.js','journey.js'])vm.runInNewContext(fs.readFileSync(path.join(root,f),'utf8'),ctx);
 const C=ctx.window.COURSE,Learning=require(path.join(root,'engine.js')),E=Learning.create(C);
 const explored=()=>{const s=E.blank();for(const g of [...C.lessons.flatMap(l=>l.steps),...C.cases])g.questions.forEach((q,i)=>{E.submit(s,g.id,i,q.answer);E.acknowledge(s,g.id,i);});return s;};
 const a=explored(),b=explored();E.submitExam(a,'final',C.final.questions.map(q=>(q.answer+1)%3));E.submitExam(b,'final',C.final.questions.map(q=>q.answer));
 const merged=E.merge(a,b);assert.equal(merged.best.final,0);assert.equal(E.progress(merged).xp,E.progress(a).xp,'A conflicting imported final must not add XP');
 const reverse=E.merge(b,a);assert.equal(reverse.best.final,5);assert.equal(E.progress(reverse).xp,E.progress(b).xp);
 const inconsistent={...a,solved:[...a.solved,...C.final.questions.map((_,i)=>'final:'+i)]};assert.equal(E.progress(E.validate(inconsistent)).xp,E.progress(a).xp,'Scores derive from the kept final attempt');
 const elements={},events={};const el=id=>elements[id]||(elements[id]={innerHTML:'',hidden:true,classList:{add(){},remove(){},toggle(){}},focus(){},setAttribute(){},scrollIntoView(){},querySelector(){return null},querySelectorAll(){return[]}});
 const document={querySelector(s){return ['#main','#score','#storage-warning','#toast','#import-file','#image-dialog','#image-dialog .close','#learning-journey','.skip'].includes(s)?el(s):null;},querySelectorAll(){return[]},title:''};
 const render=(s,hash)=>{const win={COURSE:C,Learning,LearningJourney:ctx.window.LearningJourney,Labs:{render(){return''},bind(){}},scrollTo(){},addEventListener(n,f){events[n]=f;}};const sb={window:win,Learning,document,location:{hash,protocol:'https:',href:'https://example.org/'+slug+'/'+hash},localStorage:{getItem(){return JSON.stringify(s)},setItem(){}},setTimeout(){},clearTimeout(){},console,Math,URL,Blob};vm.runInNewContext(fs.readFileSync(path.join(root,'app.js'),'utf8'),sb);return el('#main').innerHTML;};
 const s=E.blank(),g=C.lessons[0].steps[0];
 render(s,'#lesson/'+g.id);const lessonHTML=el('#main').innerHTML;let prevented=false;el('.skip').onclick({preventDefault(){prevented=true;}});assert(prevented,'Skip link must not replace the lesson hash with #main');assert.equal(el('#main').innerHTML,lessonHTML);g.questions.forEach((q,i)=>{E.submit(s,g.id,i,q.answer);if(i<g.questions.length-1)E.acknowledge(s,g.id,i);});
 const feedback=render(s,'#check/'+g.id);assert.match(feedback,/Happy cell guide/);assert.match(feedback,/Finish this check/);assert(!feedback.includes('Knowledge check complete.'));assert(feedback.includes(g.questions.at(-1).explanation.replace(/&/g,'&amp;').replace(/'/g,'&#39;')));
 E.acknowledge(s,g.id,g.questions.length-1);assert.match(render(s,'#check/'+g.id),/Knowledge check complete/);
 E.submitExam(a,'final-review',C.recovery.questions.map(q=>q.answer));const result=render(a,'#final');assert.match(result,/Course completed through recovery/);assert(!result.includes('Try the recovery investigation - new questions'));
 render(a,'#journey');assert.match(el('#learning-journey').innerHTML,/Finish line reached/);
 console.log('PASS '+slug+': last-answer explanation, final XP merge, recovery completion message, skip-link navigation and journey render.');
}
