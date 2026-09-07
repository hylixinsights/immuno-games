const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.resolve(__dirname,'../single-cell'),ctx={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'course.js'),'utf8'),ctx);
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
assert.equal(Object.keys(C.references).length,23);
for(const [id,r]of Object.entries(C.references)){assert.ok(r.title.length>20,id);assert.ok(r.url.startsWith('https://'),id);assert.ok(!/Disponível|livro on-line/.test(r.title),id);}
const total=all.reduce((n,g)=>n+g.questions.length,0);assert.equal(total,96);
console.log('PASS: 96 question records, 17 lesson steps, 2 real-data UMAP figures, 23 references.');
console.log('PASS: XP cannot be farmed; trophies require lessons and case; mastery and final require 4/5.');
console.log('PASS: progress round-trip, validation, incompatible imports, score bounds, name bounds.');
// Route rendering smoke checks without a browser. Stubs do not validate layout.
const events={},elements={};
function el(id){return elements[id]||(elements[id]={innerHTML:'',hidden:true,classList:{add(){},remove(){},toggle(){}},focus(){},setAttribute(){},scrollIntoView(){},querySelector(){return null},querySelectorAll(){return[]}});}
const document={querySelector(sel){if(['#main','#score','#storage-warning','#toast','#import-file','#image-dialog','#image-dialog .close'].includes(sel))return el(sel);return null;},querySelectorAll(){return[]},title:''};
const fakeWindow={COURSE:C,Learning:require(path.join(root,'engine.js')),scrollTo(){},addEventListener(n,fn){events[n]=fn}};
fakeWindow.Labs={render(){return ''},bind(){}};
const sandbox={window:fakeWindow,Learning:require(path.join(root,'engine.js')),document,location:{hash:'#map',protocol:'https:',href:'https://example.org/course/'},localStorage:{getItem(){return null},setItem(){}},setTimeout(){},clearTimeout(){},console,Math,URL,Blob};
vm.runInNewContext(fs.readFileSync(path.join(root,'app.js'),'utf8'),sandbox);
assert.match(el('#main').innerHTML,/Your course map/);
const routes=[...C.lessons.flatMap(l=>l.steps.map(s=>'lesson/'+s.id)),...C.cases.map(c=>'case/'+c.block),...C.mastery.map(c=>'mastery/'+c.block),'final','achievements','resources','missing'];
for(const route of routes){sandbox.location.hash='#'+route;events.hashchange();assert.ok(el('#main').innerHTML.length>100,route);if(route.startsWith('lesson/'))assert.match(el('#main').innerHTML,/Make the call/);}
console.log('PASS: map, 17 lesson routes, 5 cases, 5 mastery routes, final lock, resources and unknown route render.');

// A restored completed record unlocks the final assessment and completion card.
sandbox.localStorage.getItem=()=>JSON.stringify(s);
sandbox.location.hash='#final';
vm.runInNewContext(fs.readFileSync(path.join(root,'app.js'),'utf8'),sandbox);
assert.match(el('#main').innerHTML,/Submit decisions/);
sandbox.location.hash='#achievements';events.hashchange();
assert.match(el('#main').innerHTML,/Single-cell Essentials · Completed/);
assert.match(el('#main').innerHTML,/Download card/);
console.log('PASS: restored completion unlocks final and renders the sharing controls.');

// Scientific teaching arithmetic and source-data integrity.
const labContext={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'labs.js'),'utf8'),labContext);
const M=labContext.window.LabModels;
assert.equal(M.sparse().length,7);
assert.equal(M.composition(80).bPercent,20);
assert.ok(M.composition(400).bPercent<5);
assert.equal(M.composition(400).b,20);
assert.equal(M.normalize(100,1000),M.normalize(200,2000));
assert.equal(Object.keys(M.aggregate('condition')).length,2);
assert.equal(Object.keys(M.aggregate('donor')).length,4);
assert.equal(Object.keys(M.aggregate('type')).length,8);
const sum=x=>Object.values(x).reduce((n,g)=>n+g.count,0);
assert.equal(sum(M.aggregate('condition')),sum(M.aggregate('type')));
assert.equal(M.qc(200,40,20000)[0].keep,true);
assert.equal(M.qc(500,40,20000)[0].keep,false);
assert.equal(M.trajectory(0)[0],0);assert.equal(M.trajectory(3)[3],0);
assert.notDeepEqual(Array.from(M.trajectory(0)),Array.from(M.trajectory(3)));
const dc={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'pbmc.js'),'utf8'),dc);
const data=dc.window.PBMC;assert.equal(data.n,2638);assert.equal(data.groups.length,data.n);
assert.equal(data.embeddings.length,2);for(const xy of data.embeddings){assert.equal(xy.length,data.n);assert.ok(xy.every(p=>p.length===2&&p.every(Number.isFinite)));}
assert.ok(data.groups.every(n=>n>=0&&n<data.labels.length));
assert.notDeepEqual(data.embeddings[0],data.embeddings[1]);
for(const lesson of C.lessons)for(const st of lesson.steps){if(st.interactive)assert.ok(labContext.window.Labs.render(st.interactive).length>100,st.interactive);}
console.log('PASS: 10 interactive activity types, aggregation arithmetic, filter trade-offs and 2 real-data embeddings.');
