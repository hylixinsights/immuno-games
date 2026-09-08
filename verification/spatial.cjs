const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.resolve(__dirname,'../spatial'),ctx={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'course.js'),'utf8'),ctx);
vm.runInNewContext(fs.readFileSync(path.join(root,'recovery.js'),'utf8'),ctx);
const C=ctx.window.COURSE,E=require(path.join(root,'engine.js')).create(C);
let s=E.blank();const groups=[...C.lessons.flatMap(l=>l.steps),...C.cases,C.final],all=[...groups,...C.mastery];
assert.equal(C.lessons.length,15);assert.equal(C.lessons.flatMap(l=>l.steps).length,17);
assert.equal(new Set(all.map(g=>g.id)).size,all.length);
for(const g of all){assert.ok(g.questions.length===3||g.questions.length===5);for(const q of g.questions){assert.equal(q.options.length,3);assert.equal(new Set(q.options).size,3);assert.ok(q.answer>=0&&q.answer<q.options.length);assert.ok(q.explanation.length>20);}}
assert.equal(E.progress(s).xp,0);assert.equal(E.graduated(s),false);
assert.equal(E.award(s,'1a',0),true);assert.equal(E.award(s,'1a',0),false);assert.equal(E.progress(s).xp,10);
assert.equal(E.complete(s,C.lessons[0].steps[0]),false);
assert.throws(()=>E.award(s,'made-up',0));
for(const lesson of C.lessons)for(const st of lesson.steps)st.questions.forEach((_,i)=>E.award(s,st.id,i));
assert.equal(E.progress(s).steps,17);assert.equal(E.trophies(s).length,0);
for(const g of C.cases)g.questions.forEach((_,i)=>E.award(s,g.id,i));
assert.equal(E.trophies(s).length,5);assert.equal(E.progress(s).xp,660);assert.equal(E.graduated(s),false);
s.best.final=3;assert.equal(E.graduated(s),false);s.best.final=4;assert.equal(E.graduated(s),true);
assert.equal(E.mastery(s).length,0);s.best['mastery-A']=3;assert.equal(E.mastery(s).length,0);s.best['mastery-A']=4;assert.equal(E.mastery(s).length,1);
for(const g of groups)g.questions.forEach((_,i)=>E.award(s,g.id,i));
assert.equal(E.progress(s).xp,710);assert.equal(E.progress(s).total,710);
assert.deepEqual(E.validate(JSON.parse(JSON.stringify(s))),s);
assert.throws(()=>E.validate({...s,course:'bulk'}));assert.throws(()=>E.validate({...s,version:999}));assert.throws(()=>E.validate({...s,solved:['bad:0']}));assert.throws(()=>E.validate({...s,best:{final:6}}));assert.throws(()=>E.validate({...s,best:{'mastery-A':-1}}));
assert.ok(E.validate({...s,name:'x'.repeat(1000)}).name.length<=60);
for(const f of Object.values(C.figures)){assert.ok(fs.existsSync(path.join(root,f.src)),f.src);if(f.ref!=='course')assert.ok(C.references[f.ref]);}
for(const l of C.lessons)for(const st of l.steps){if(st.figure)assert.ok(C.figures[st.figure]);for(const id of st.refs)assert.ok(C.references[id],id);}
for(let n=1;n<=53;n++)assert.ok(C.references['R'+n],n);
for(const [id,r]of Object.entries(C.references)){assert.ok(r.title.length>20,id);assert.ok(r.url.startsWith('https://'),id);assert.ok(!/Disponível|livro on-line/.test(r.title),id);}
const total=all.reduce((n,g)=>n+g.questions.length,0);assert.equal(total,96);
console.log('PASS: 96 question records, 17 lesson steps, 17 local figures, 61 references.');
console.log('PASS: XP cannot be farmed; trophies require lessons and case; mastery and final require 4/5.');
console.log('PASS: progress round-trip, validation, incompatible imports, score bounds, name bounds.');
// Route rendering smoke checks without a browser. Stubs do not validate layout.
const events={},elements={};
function el(id){return elements[id]||(elements[id]={innerHTML:'',hidden:true,classList:{add(){},remove(){},toggle(){}},focus(){},setAttribute(){},scrollIntoView(){},querySelector(){return null},querySelectorAll(){return[]}});}
const document={querySelector(sel){if(['#main','#score','#storage-warning','#toast','#import-file','#image-dialog','#image-dialog .close'].includes(sel))return el(sel);return null;},querySelectorAll(){return[]},title:''};
const fakeWindow={COURSE:C,Learning:require(path.join(root,'engine.js')),scrollTo(){},addEventListener(n,fn){events[n]=fn}};
const sandbox={window:fakeWindow,Learning:require(path.join(root,'engine.js')),document,location:{hash:'#map',protocol:'https:',href:'https://example.org/course/'},localStorage:{getItem(){return null},setItem(){}},setTimeout(){},clearTimeout(){},console,Math,URL,Blob};
vm.runInNewContext(fs.readFileSync(path.join(root,'app.js'),'utf8'),sandbox);
assert.match(el('#main').innerHTML,/Your course map/);
const routes=[...C.lessons.flatMap(l=>l.steps.map(s=>'lesson/'+s.id)),...C.cases.map(c=>'case/'+c.block),...C.mastery.map(c=>'mastery/'+c.block),...C.lessons.flatMap(l=>l.steps.map(s=>'check/'+s.id)),...C.cases.map(c=>'check/'+c.id),'recovery','final','achievements','resources','missing'];
for(const route of routes){sandbox.location.hash='#'+route;events.hashchange();assert.ok(el('#main').innerHTML.length>100,route);if(route.startsWith('lesson/'))assert.match(el('#main').innerHTML,/Start the knowledge check/);}
console.log('PASS: map, 17 lesson routes, 5 cases, 5 mastery routes, final lock, resources and unknown route render.');

// A restored completed record unlocks the final assessment and completion card.
sandbox.localStorage.getItem=()=>JSON.stringify(s);
sandbox.location.hash='#final';
vm.runInNewContext(fs.readFileSync(path.join(root,'app.js'),'utf8'),sandbox);
assert.match(el('#main').innerHTML,/Course completed!/);
sandbox.location.hash='#achievements';events.hashchange();
assert.match(el('#main').innerHTML,/Spatial Essentials · Completed/);
assert.match(el('#main').innerHTML,/Download card/);
console.log('PASS: restored completion unlocks final and renders the sharing controls.');
