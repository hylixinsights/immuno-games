// World coordinates and the replay timeline are shared by both renderers and the analysis board.
export const clamp=(v,lo=0,hi=1)=>Math.min(hi,Math.max(lo,v));
export const lerp=(a,b,t)=>a+(b-a)*t;
export const smooth=t=>{t=clamp(t);return t*t*(3-2*t)};
export const CONTACT=.84;
export const SERIES=5;
export function randomStream(seed){let n=seed>>>0;return ()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296}}
export function makeShot(seed){
  const next=randomStream(seed),side=next()<.5?-1:1;
  return {seed:seed>>>0,side,x:side*(3.03+next()*.88),y:1.48+next()*1.28,curve:(next()-.5)*1.65,loft:.27+next()*.63,pace:.84+next()*.32,targets:[.63+next()*.075,.61+next()*.13,.62+next()*.11]};
}
export function jumpGeometry(shot,day,stage,age,held=null){
  const drift=.075*clamp(age/2.5), start=.184+drift;
  const speed=(stage===0?1.02:stage===1?.87:.95)/shot.pace;
  const phase=held===null?.52:clamp(held,0,100)/speed;
  const power=held===null?.52:1-Math.abs((phase%2)-1);
  const span=.225+power*.53;
  const target=shot.targets[stage]+(day===2&&stage===1?.027:0);
  const perfect=stage===0?.043:stage===1?.036:.039;
  return {launchX:start,targetX:target,landingX:start+span,launchY:.69,targetY:.66,arcHeight:.14+span*.13,targetRadius:perfect,power};
}
export function judge(g,timeout=false){
  const delta=g.landingX-g.targetX, error=Math.abs(delta);
  const quality=timeout?0:clamp(1-Math.max(0,error-g.targetRadius*.3)/(.187-g.targetRadius*.3));
  return {quality,delta,perfect:!timeout&&error<=g.targetRadius,timeout,geometry:{...g}};
}
export function readAt(shot,marks,day,eye){
  const q=marks[0]?.quality??.55;
  // On the coordination day the direction of this shot is read normally; difficulty lies in correcting the reach.
  return (day===2?.176:.165+(1-q)*.155)+(day===1&&eye==='left'?.115:0);
}
export function diveAt(shot,marks,day,eye){return readAt(shot,marks,day,eye)+.115+(1-(marks[1]?.quality??.55))*.12;}
export function reachError(shot,marks,day,eye){
  const a=1-(marks[0]?.quality??.56), b=1-(marks[1]?.quality??.56);
  return .025+a*(day===2?.085:.325)+b*(day===2?.60:.41)+(day===1&&eye==='left'?.055:0);
}
export function finish(shot,marks,day,eye){
  const miss=reachError(shot,marks,day,eye),touch=marks[2]?.quality??0;
  let outcome;
  if(miss>.695)outcome='beaten';
  else if(miss+(.25-touch*.25)>.69)outcome='inside';
  else if(miss<.255&&touch>.71)outcome='catch';
  else if(miss<.535&&touch>.31)outcome='parry';
  else outcome='tip';
  let combo=0,best=0,bonus=0;
  for(const mark of marks){combo=mark.perfect?combo+1:0;best=Math.max(best,combo);bonus+=45*combo;}
  const base={catch:500,parry:330,tip:180,inside:0,beaten:0}[outcome];
  return {outcome,saved:base>0,base,bonus,score:base+bonus,combo:best,miss};
}
export function incoming(shot,t){
  const p=clamp(t/CONTACT),curve=Math.sin(Math.PI*p);
  return {x:shot.x*Math.pow(p,1.13)+shot.curve*curve,y:lerp(.265,shot.y,p)+shot.loft*curve,z:lerp(3.8,-3.06,p)};
}
export function handAt(shot,marks,day,eye,t){
  const side=shot.side, start=diveAt(shot,marks,day,eye), m=reachError(shot,marks,day,eye);
  const u=marks[1]?clamp((t-start)/(CONTACT-start)):0, p=smooth(u), drift=Math.sin(Math.PI*clamp((u-.47)/.53));
  const gap=m>.695?.53+(m-.695):.065+.165*smooth(m/.695);
  const correction=day===2?(.38+(1-(marks[1]?.quality??.55))*.49):.095;
  // An initially mis-scaled reach bends toward the measured endpoint during the last third of the dive.
  return {x:side*lerp(.53,Math.abs(shot.x)-gap,p)-side*correction*drift,y:lerp(1.47,shot.y-.025-gap*.16,p)+.12*Math.sin(Math.PI*u)-correction*drift*.51,z:lerp(-3.10,-3.06,p)};
}
export function ballAt(shot,marks,day,eye,t,outcome){
  if(t<=CONTACT||!outcome)return incoming(shot,t);
  const u=clamp((t-CONTACT)/(1-CONTACT)), side=shot.side, b=incoming(shot,CONTACT);
  if(outcome==='catch')return {x:b.x-side*.30*smooth(u),y:b.y-.38*smooth(u),z:b.z+.06*u};
  if(outcome==='parry')return {x:b.x+side*(1.85*u),y:b.y+.95*Math.sin(Math.PI*u)-.78*u,z:b.z+2.45*u};
  if(outcome==='tip')return {x:b.x+side*((4.68-Math.abs(b.x))*clamp(u*2.6)+.94*u),y:b.y+.8*Math.sin(Math.PI*u)+.24*u,z:b.z-.71*u};
  return {x:b.x+side*(outcome==='inside'?.22:.36)*u,y:b.y-.48*u*u,z:b.z-1.39*u};
}
export function fieldState(shot,marks,day,eye,t,extra={}){
  const outcome=extra.outcome||null, side=shot.side;
  const start=diveAt(shot,marks,day,eye);
  const dive=marks[1]?smooth((Math.min(t,CONTACT)-start)/(CONTACT-start)):0;
  const post=clamp((t-CONTACT)/(1-CONTACT));
  const ball=ballAt(shot,marks,day,eye,t,outcome);
  const hand=handAt(shot,marks,day,eye,t);
  if(t>=CONTACT&&outcome==='catch'){hand.x=ball.x-side*.14;hand.y=ball.y-.04;hand.z=ball.z;}
  else if(t>CONTACT){hand.x+=side*.12*Math.sin(post*Math.PI);hand.y-=.38*smooth(post);}
  const tilt=side*(1.02+(.18*(2.5-shot.y)))*dive;
  return {time:0,day,eye,run:0,kick:0,clap:0,progress:t,dive,side,tilt,flex:outcome==='beaten'?0:Math.sin(Math.PI*clamp((t-CONTACT+.012)/.143)),cheer:outcome&&['parry','tip','catch'].includes(outcome)?smooth(post*3):0,outcome,ball,hand,pose:{x:hand.x-side*lerp(.53,1.78,dive),y:(shot.y-1.45)*dive*.66-.17*post,z:-3.10,tilt},...extra};
}
export function seriesScore(slots){return slots.reduce((a,b)=>a+(b||0),0)}
