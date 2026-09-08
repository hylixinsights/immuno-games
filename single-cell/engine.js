/* Learning progress and one-submission assessment rules. Keeps v1 progress compatible. */
(function(root){
'use strict';
function create(course){
 const regular=[...course.lessons.flatMap(l=>l.steps),...course.cases];
 const groups=[...regular,course.final];
 const groupMap=new Map(regular.map(g=>[g.id,g]));
 const allowed=new Set(groups.flatMap(g=>g.questions.map((_,i)=>`${g.id}:${i}`)));
 const questions=new Map(regular.flatMap(g=>g.questions.map((q,i)=>[`${g.id}:${i}`,q])));
 const exams=new Map([...course.mastery,course.final,...(course.recovery?[course.recovery]:[])].map(g=>[g.id,g]));
 const stepIds=course.lessons.flatMap(l=>l.steps.map(s=>s.id));
 const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
 const blank=()=>({course:course.id,version:course.version,solved:[],best:{},last:stepIds[0],name:'',answers:{},reviewed:[],examAttempts:{}});
 function validate(v){
  if(!v||Array.isArray(v)||v.course!==course.id||v.version!==course.version||!Array.isArray(v.solved)||v.solved.length>allowed.size||!v.solved.every(x=>typeof x==='string'&&allowed.has(x)))throw Error('This is not a compatible progress file for this course.');
  if(!v.best||typeof v.best!=='object'||Array.isArray(v.best))throw Error('Invalid challenge results.');
  const s=blank();s.solved=[...new Set(v.solved)];
  for(const[id,n]of Object.entries(v.best)){if(!exams.has(id)||!Number.isInteger(n)||n<0||n>exams.get(id).questions.length)throw Error('Invalid challenge score.');s.best[id]=n;}
  if(v.answers!==undefined){if(!v.answers||typeof v.answers!=='object'||Array.isArray(v.answers))throw Error('Invalid saved answers.');for(const[k,a]of Object.entries(v.answers)){const q=questions.get(k);if(!q||!Number.isInteger(a)||a<0||a>=q.options.length)throw Error('Invalid saved answer.');s.answers[k]=a;if(a!==q.answer&&s.solved.includes(k))throw Error('A reviewed error cannot earn XP.');if(a===q.answer&&!s.solved.includes(k))s.solved.push(k);}}
  if(v.reviewed!==undefined){if(!Array.isArray(v.reviewed)||v.reviewed.length>questions.size||!v.reviewed.every(k=>questions.has(k)&&own(s.answers,k)))throw Error('Invalid review record.');s.reviewed=[...new Set(v.reviewed)];}
  if(v.examAttempts!==undefined){if(!v.examAttempts||typeof v.examAttempts!=='object'||Array.isArray(v.examAttempts))throw Error('Invalid assessment record.');for(const[id,record]of Object.entries(v.examAttempts)){const g=exams.get(id);if(!g||!record||!Array.isArray(record.answers)||record.answers.length!==g.questions.length||!record.answers.every((a,i)=>Number.isInteger(a)&&a>=0&&a<g.questions[i].options.length))throw Error('Invalid assessment answers.');const answers=[...record.answers],score=g.questions.reduce((n,q,i)=>n+Number(answers[i]===q.answer),0);s.examAttempts[id]={answers,score};s.best[id]=score;}}
  if(s.examAttempts.final){s.solved=s.solved.filter(k=>!k.startsWith('final:'));s.examAttempts.final.answers.forEach((a,i)=>{if(a===course.final.questions[i].answer)s.solved.push('final:'+i);});}
  s.last=stepIds.includes(v.last)?v.last:stepIds[0];s.name=typeof v.name==='string'?v.name.replace(/[\x00-\x1f]/g,'').slice(0,60):'';return s;
 }
 const resolved=(s,key)=>s.solved.includes(key)||(s.reviewed||[]).includes(key);
 const complete=(s,g)=>g.questions.every((_,i)=>resolved(s,`${g.id}:${i}`));
 const lessonDone=(s,l)=>l.steps.every(g=>complete(s,g));
 const blockDone=(s,b)=>course.lessons.filter(l=>l.block===b.id).every(l=>lessonDone(s,l))&&complete(s,course.cases.find(c=>c.block===b.id));
 const trophies=s=>course.blocks.filter(b=>blockDone(s,b));
 const mastery=s=>course.blocks.filter(b=>(s.best['mastery-'+b.id]||0)>=4);
 const graduated=s=>trophies(s).length===course.blocks.length&&Math.max(s.best.final||0,s.best['final-review']||0)>=4;
 const examDone=(s,id)=>own(s.best,id)||own(s.examAttempts||{},id);
 function award(s,id,i){const key=`${id}:${i}`;if(!allowed.has(key))throw Error('Unknown activity.');if(s.solved.includes(key))return false;if(own(s.answers||{},key)&&s.answers[key]!==questions.get(key)?.answer)return false;s.solved.push(key);return true;}
 function submit(s,id,i,answer){const g=groupMap.get(id),key=`${id}:${i}`,q=g?.questions[i];if(!q||!Number.isInteger(answer)||answer<0||answer>=q.options.length)throw Error('Invalid answer.');s.answers||={};if(own(s.answers,key)||s.solved.includes(key))return {locked:true};s.answers[key]=answer;const correct=answer===q.answer;if(correct)award(s,id,i);return {locked:false,correct};}
 function acknowledge(s,id,i){const key=`${id}:${i}`;if(!own(s.answers||{},key))return false;s.reviewed||=[];if(!s.reviewed.includes(key))s.reviewed.push(key);return true;}
 function submitExam(s,id,answers){const g=exams.get(id);if(!g)throw Error('Unknown assessment.');if(examDone(s,id))return {locked:true};if((id==='final'||id==='final-review')&&trophies(s).length<course.blocks.length)throw Error('Finish the five blocks first.');if(id==='final-review'&&(!examDone(s,'final')||(s.best.final||0)>=4))throw Error('The recovery investigation follows a first final attempt.');if(!Array.isArray(answers)||answers.length!==g.questions.length||!answers.every((a,i)=>Number.isInteger(a)&&a>=0&&a<g.questions[i].options.length))throw Error('Answer every question before submitting.');const score=g.questions.reduce((n,q,i)=>n+Number(answers[i]===q.answer),0);s.examAttempts||={};s.examAttempts[id]={answers:[...answers],score};s.best[id]=score;if(id==='final')g.questions.forEach((q,i)=>{if(answers[i]===q.answer)award(s,id,i);});return {locked:false,score};}
 function merge(a,b){const s=validate(a),other=validate(b),keepFinal=examDone(s,'final');for(const[k,v]of Object.entries(other.answers))if(!own(s.answers,k)&&!s.solved.includes(k))s.answers[k]=v;for(const k of other.solved)if(!(keepFinal&&k.startsWith('final:'))&&!s.solved.includes(k)&&(!own(s.answers,k)||s.answers[k]===questions.get(k)?.answer))s.solved.push(k);for(const k of other.reviewed)if(own(s.answers,k)&&!s.reviewed.includes(k))s.reviewed.push(k);for(const[id,n]of Object.entries(other.best))if(!examDone(s,id)){s.best[id]=n;if(other.examAttempts[id])s.examAttempts[id]=other.examAttempts[id];}if(other.name)s.name=other.name;s.last=other.last;return validate(s);}
 const progress=s=>({xp:s.solved.length*10,total:allowed.size*10,steps:course.lessons.flatMap(l=>l.steps).filter(g=>complete(s,g)).length,stepTotal:stepIds.length,trophies:trophies(s).length});
 const next=s=>course.lessons.flatMap(l=>l.steps).find(g=>!complete(s,g))?.id||s.last;
 return {blank,validate,resolved,complete,lessonDone,blockDone,trophies,mastery,graduated,award,progress,next,submit,acknowledge,submitExam,examDone,merge};
}
root.Learning={create};if(typeof module!=='undefined')module.exports=root.Learning;
})(typeof window!=='undefined'?window:globalThis);
