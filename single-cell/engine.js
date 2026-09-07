/* Pure progress rules; content and interface are independent of this module. */
(function(root){
'use strict';
function create(course){
 const stepIds=course.lessons.flatMap(l=>l.steps.map(s=>s.id));
 const groups=[...course.lessons.flatMap(l=>l.steps),...course.cases,course.final];
 const allowed=new Set(groups.flatMap(g=>g.questions.map((_,i)=>`${g.id}:${i}`)));
 const exams=new Map([...course.mastery,course.final].map(g=>[g.id,g.questions.length]));
 const blank=()=>({course:course.id,version:course.version,solved:[],best:{},last:stepIds[0],name:''});
 function validate(value){
  if(!value||Array.isArray(value)||value.course!==course.id||value.version!==course.version||!Array.isArray(value.solved)||value.solved.length>allowed.size||!value.solved.every(x=>typeof x==='string'&&allowed.has(x)))throw Error('This is not a compatible progress file for this course.');
  if(!value.best||typeof value.best!=='object'||Array.isArray(value.best))throw Error('Invalid challenge results.');
  const state=blank();state.solved=[...new Set(value.solved)];
  for(const [id,n]of Object.entries(value.best)){if(!exams.has(id)||!Number.isInteger(n)||n<0||n>exams.get(id))throw Error('Invalid challenge score.');state.best[id]=n;}
  state.last=stepIds.includes(value.last)?value.last:stepIds[0];state.name=typeof value.name==='string'?value.name.replace(/[\x00-\x1f]/g,'').slice(0,60):'';return state;
 }
 const complete=(state,g)=>g.questions.every((_,i)=>state.solved.includes(`${g.id}:${i}`));
 const lessonDone=(state,l)=>l.steps.every(s=>complete(state,s));
 const blockDone=(state,b)=>course.lessons.filter(l=>l.block===b.id).every(l=>lessonDone(state,l))&&complete(state,course.cases.find(c=>c.block===b.id));
 const trophies=state=>course.blocks.filter(b=>blockDone(state,b));
 const mastery=state=>course.blocks.filter(b=>(state.best['mastery-'+b.id]||0)>=4);
 const graduated=state=>trophies(state).length===course.blocks.length&&(state.best.final||0)>=4;
 function award(state,id,i){const key=`${id}:${i}`;if(!allowed.has(key))throw Error('Unknown activity.');if(state.solved.includes(key))return false;state.solved.push(key);return true;}
 const progress=state=>({xp:state.solved.length*10,total:allowed.size*10,steps:course.lessons.flatMap(l=>l.steps).filter(s=>complete(state,s)).length,stepTotal:stepIds.length,trophies:trophies(state).length});
 function next(state){return course.lessons.flatMap(l=>l.steps).find(s=>!complete(state,s))?.id||state.last;}
 return {blank,validate,complete,lessonDone,blockDone,trophies,mastery,graduated,award,progress,next};
}
root.Learning={create};if(typeof module!=='undefined')module.exports=root.Learning;
})(typeof window!=='undefined'?window:globalThis);
