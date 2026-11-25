import { FlapSpring } from './vendor/papercraft/lib/paper-motion.js';
import { camera, channel, drawCut, groundAt, groundImage, groundLane, paintGround, project, ring, tissuePlane } from './landscape.js';
import { pathEnd, startPosition, stations, validPosition } from './route.js';

const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const rng=n=>{const x=Math.sin(n*91.71+19.13)*43758.543;return x-Math.floor(x);};
const rim={river:'reed',node:'branch',recognition:'branch',garden:'branch',marrow:'bone',recall:'branch',tonsil:'reed'};
const travelSpeed=6.4;
export function createJourneyMap(canvas,events={}) {
  const floor=tissuePlane(events.floorHost);
  const ctx=canvas.getContext('2d',{alpha:!!floor});
  const ground=document.createElement('canvas'),groundCtx=ground.getContext('2d',{alpha:false});
  let transition=null;
  let width=1,height=1,dpr=1,view=null,state=null,choices=[],folds=new Map(),hits=[];
  let z=0,lane=0,camZ=0,camLane=0,trip=null,cover=true,paused=false,reduced=false,moving=false,drag=null;
  let clock=0,stageTime=0,stepTime=0,lastStep='',currentStage='',frame=0,previous=0,fpsStamp=0,savedAt=0;
  let nearKey='',near=[],picked=null,lastEffect=null,lastTravel=false,groundKey='',groundReady=false;
  const keys=new Set();
  function updateSize(){
    const r=canvas.getBoundingClientRect();
    if(!r.width||!r.height)return;
    width=Math.round(r.width);height=Math.round(r.height);dpr=Math.min(2,window.devicePixelRatio||1);
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
    ground.width=Math.ceil(width);ground.height=Math.ceil(height);
    groundKey='';if(state){updateCamera();draw();}
  }
  function updateCamera(){view=camera(width,height,camZ,camLane,cover);}
  function position(){return {at:z,lane};}
  function persist(){if(!cover&&state)events.position?.(position());}
  function setMoving(v){moving=v;if(v!==lastTravel){lastTravel=v;events.motion?.(v);}}
  function stop(){trip=null;drag=null;keys.clear();setMoving(false);persist();}
  function setScene(s,options={}){
    const newPlace=currentStage!==s.stage||options.reset;
    if(!floor&&newPlace&&currentStage&&!cover&&!options.cover&&!options.reduced&&canvas.width){
      transition=document.createElement('canvas');transition.width=width;transition.height=height;
      transition.getContext('2d').drawImage(canvas,0,0,width,height);
    }else if(newPlace)transition=null;
    state=s;reduced=!!options.reduced;cover=!!options.cover;
    if(newPlace){
      currentStage=s.stage;groundKey='';groundReady=false;stageTime=0;folds=new Map();picked=null;hits=[];lastEffect=null;
      const p=validPosition(s.stage,options.position)||startPosition(s);
      z=p.at;lane=p.lane;camZ=z;camLane=lane;trip=null;drag=null;setMoving(false);nearKey='?';
      groundImage(currentStage);
    }
    choices=stations(s);
    if(newPlace||lastStep!==s.steps[s.stage]){lastStep=s.steps[s.stage];stepTime=0;}
    for(const o of choices)if(!folds.has(o.id))folds.set(o.id,new FlapSpring({p:0,size:o.height/4,jitter:rng(o.at)-.5}));
    if(trip?.id&&!choices.some(o=>o.id===trip.id))trip=null;
    if(cover||paused)updateCamera();
    proximity(true);draw();schedule();
  }
  function proximity(force=false){
    if(!state||cover)return;
    near=choices.map(o=>({o,d:Math.hypot((o.at-z)*.92,(o.lane-lane)*.68)})).filter(p=>p.d<2.9).sort((a,b)=>a.d-b.d).map(p=>p.o);
    const watch=state.stage==='node'&&z>=2&&z<=7.8;
    const total=pathEnd[state.stage],atEnd=!choices.some(o=>o.at>z+1.16)&&z>total*.48;
    const key=near.map(o=>o.id).join(',')+'|'+watch+'|'+atEnd+'|'+(z<.15);
    if(force||key!==nearKey){nearKey=key;events.near?.({items:near,watch,atEnd,atStart:z<.15});}
  }
  function moveTo(at,toLane,id=null,engage=false) {
    if(cover||paused)return;
    const next={at:clamp(at,0,pathEnd[state.stage]),lane:clamp(toLane,-2.15,2.15),id,engage};
    trip=next;picked=id;events.gesture?.();
    if(reduced){z=next.at;lane=next.lane;camZ=z;camLane=lane;finish(next);updateCamera();draw();return;}
    setMoving(true);schedule();
  }
  function finish(order) {
    if(order!==trip)return;
    trip=null;setMoving(false);persist();proximity(true);
    if(order.engage&&order.id)events.engage?.(order.id);
  }
  function approach(id,engage=true) {
    const o=choices.find(item=>item.id===id);if(!o)return;
    const side=o.lane>.15?-1:o.lane<-.15?1:lane>.1?1:-1;
    moveTo(o.at-.92,o.lane+side*.49,o.id,engage);
  }
  function advance(dir=1){
    if(cover||paused)return;
    const sorted=[...choices].sort((a,b)=>a.at-b.at);
    if(dir<0){
      const prev=sorted.filter(o=>o.at-1.10<z-1.3).at(-1);
      if(prev)approach(prev.id,false);else moveTo(0,0);
      return;
    }
    const next=sorted.find(o=>o.at-1.10>z+.61);
    if(next){approach(next.id,false);return;}
    if(sorted.length)approach(sorted[0].id,false);
  }
  function sceneEffect(id,type){
    lastEffect={id,type,t:clock};picked=id;
    for(const item of choices){if(item.id===id){const spring=folds.get(id);if(spring&&!reduced){spring.v+=1.15;spring.atRest=false;}break;}}
    draw();
  }
  function pause(v){
    paused=v;
    if(v){stop();cancelAnimationFrame(frame);frame=0;previous=0;}else{groundKey='';schedule();}
  }
  function resize(){updateSize();schedule();}
  const ro=typeof ResizeObserver!=='undefined'?new ResizeObserver(resize):null;
  ro?.observe(canvas);window.addEventListener('resize',resize);
  function schedule(){if(!frame&&!paused&&!document.hidden)frame=requestAnimationFrame(loop);}
  function loop(ts){
    frame=0;if(paused||document.hidden||!state)return;
    const rate=(trip||keys.size||drag?.active||stageTime<1.4||stepTime<1.5)?60:30;
    if(ts-fpsStamp+1<1000/rate){schedule();return;}
    const dt=previous?Math.min((ts-previous)/1000,.55):1/60;previous=ts;fpsStamp=ts;
    tick(dt);draw();schedule();
  }
  function tick(dt){
    clock+=dt;stageTime+=dt;stepTime+=dt;
    if(!cover){
      let dz=0,dx=0;
      if(keys.has('up'))dz+=1;if(keys.has('down'))dz-=1;if(keys.has('right'))dx+=1;if(keys.has('left'))dx-=1;
      if(dz||dx){
        trip=null;picked=null;z=clamp(z+dz*dt*4.55,0,pathEnd[state.stage]);lane=clamp(lane+dx*dt*3.05,-2.15,2.15);setMoving(true);
      }else if(trip){
        const target=trip,dx=target.lane-lane,dz=target.at-z,d=Math.hypot(dx,dz),s=travelSpeed*dt;
        if(d<=s){z=target.at;lane=target.lane;finish(target);}
        else{const a=s/d;z+=dz*a;lane+=dx*a;setMoving(true);}
      }else if(!drag?.active)setMoving(false);
      if(moving&&clock-savedAt>1.05){persist();savedAt=clock;}
      proximity();
    }
    const follow=reduced?1:1-Math.exp(-dt*5.8);
    camZ+=(z-camZ)*follow;camLane+=(lane-camLane)*follow;updateCamera();
    for(const o of choices){
      const spring=folds.get(o.id), dist=o.at-z;
      const open=cover||dist<8.8;
      if(reduced)spring.reset(1);
      else{spring.set(open?1:0);spring.step(dt);}
    }
  }
  function worldProps(){
    const props=[];const stage=state.stage, heroZ=cover?z+.08:z;
    const stationary=(art,at,offset,h,extras={})=>props.push({art,z:at,x:channel(view,at)+offset,height:h,...extras});
    const sway=reduced?0:clock;
    // Pressed fiber stands at the banks; their bases stay fixed as the camera moves.
    const min=Math.floor((camZ-5)/3.6),max=Math.ceil((camZ+24)/3.6);
    for(let i=min;i<=max;i++){
      const at=i*3.6+rng(i+8)*.95,side=i%2?1:-1,offset=side*(2.66+rng(i+5)*1.12);
      if(stage!=='river'&&stage!=='tonsil'&&i%3!==0)stationary(rim[stage],at,offset*1.12,.65+rng(i+37)*1.0,{yaw:side*.23,tilt:.035*Math.sin(sway*.65+i),variant:Math.abs(i)%3,fold:1,ridge:.12});
    }
    if(stage==='river'){
      const gate=choices.find(o=>o.id==='node-tab');
      if(gate)stationary('venule',gate.at-.24,gate.lane-.83,1.64,{fold:cover?1:folds.get(gate.id)?.p||0,yaw:-.31});
      for(let i=-3;i<14;i++){
        const base=i*2.72, at=reduced?base:base+(sway*.50%40);
        // Periodic flow keeps the river populated when a player pauses for a while.
        const wrapped=((at+8)%40+40)%40-8;
        const side=i%2?1:-1,offset=side*(.82+rng(i+4)*1.08)+.21*Math.sin(wrapped*.75+i);
        stationary('rbc',wrapped,offset,.70+rng(i+7)*.48,{flat:true,fold:1,scaleY:.70+.27*Math.sin(sway*.87+i*17.3),tilt:.38*Math.sin(sway*.85+i),yaw:.78*Math.sin(i*9+sway*.28),lift:.035,ridge:.12,variant:Math.abs(i)%3});
      }
    }
    const nodeStage=stage==='node',witness=state.steps.node;
    if(nodeStage){
      const travel=witness==='witness'?(reduced?1:clamp(stepTime/2.35,0,1)):witness==='witnessed'?1:0;
      const ease=travel*travel*(3-2*travel),at=6.55-1.83*ease,offset=-.22+1.00*ease;
      stationary('friend',at,offset,1.78,{mark:1,target:state.target,yaw:.10*Math.sin(sway*1.1),lift:.07,fold:1});
      if(witness==='witnessed')stationary('antigen',at-.04,offset-.37,.54,{lift:1.05,variant:(state.target+1)%3,fold:1,shadow:false});
    }
    if(stage==='marrow'&&state.steps.marrow!=='visit'||stage==='recall'&&['response','end'].includes(state.steps.recall)){
      for(let i=0;i<5;i++){
        const t=((reduced?i*.21:sway*.11+i*.21)%1),base=stage==='marrow'?4.9:15.5;
        stationary('antibody',base+t*4.0,.67+Math.sin(t*4+i*.8)*.74,.53,{fold:1,lift:.42+t*.65,yaw:Math.sin(t*5+i)*.43,variant:state.target,shadow:false});
      }
    }
    for(const o of choices){
      let off=o.lane,at=o.at,lift=o.art==='antigen'?.14:0;
      const e=lastEffect,elapsed=e?clock-e.t:10;
      if(e?.id===o.id&&elapsed<.8&&e.type==='mismatch'&&!reduced)off+=Math.sin(elapsed/.8*Math.PI)*.43;
      const fold=cover?1:folds.get(o.id)?.p??1;
      stationary(o.art,at,off,o.height,{id:o.id,variant:o.variant,mark:state.mark,target:state.target,marked:state.notes.includes('ebv'),fold,
        ridge:o.art==='node'?.16:.07,lift:lift+(o.art==='antigen'?.07*Math.sin(sway*1.6+at):0),yaw:.12*Math.sin(at),flat:o.art==='rbc',tilt:o.art==='rbc'?.09*Math.sin(sway):0});
    }
    const heroLane=cover?-.07:lane,heroX=channel(view,heroZ)+heroLane, bob=reduced?0:(moving?.084:.035)*Math.sin(sway*(moving?8.5:2.05));
    const memory=stage==='recall'||stage==='marrow'&&state.notes.includes('memory');
    props.push({art:memory?'memory':'hero',hero:true,x:heroX,z:heroZ,height:cover?2.05:1.89,mark:state.mark,target:state.target,fold:1,
      lift:.135+bob,ridge:.075,yaw:.055*Math.sin(sway*1.6)+(moving?.08:0),tilt:.04*Math.sin(sway*1.3)});
    const step=state.steps[stage];
    if(stage==='recognition'&&['captured','cut','presented','helped'].includes(step)){
      props.push({art:step==='captured'?'antigen':step==='cut'?'membrane':'mhc',x:heroX+.56,z:heroZ-.12,height:.66,fold:1,lift:.71,variant:state.target,shadow:false});
    }
    if(stage==='garden'&&['trial','offer','helped'].includes(step)){
      const hero=props.find(p=>p.hero);hero.art='sister';hero.variant=state.selected;
      if(step!=='trial')props.push({art:'mhc',x:heroX+.55,z:heroZ-.09,height:.57,fold:1,lift:.7,shadow:false});
    }
    if(stage==='garden'&&lastEffect?.type==='mismatch'&&clock-lastEffect.t<.9){
      const t=clock-lastEffect.t;
      props.push({art:'antigen',x:heroX+.48+t*.72,z:heroZ-.12,height:.57,fold:1,lift:Math.max(0,.85-t*.9),variant:state.target,shadow:false});
    }
    return props.sort((a,b)=>b.z-a.z);
  }
  function draw(){
    if(!state||!ctx||!width||!height)return;
    updateCamera();
    const key=[currentStage,camZ.toFixed(2),camLane.toFixed(2),width,height,cover].join('/');
    ctx.setTransform(dpr,0,0,dpr,0,0);
    if(floor){
      if(key!==groundKey){floor(view,state.stage);groundKey=key;}
      ctx.clearRect(0,0,width,height);
    }else{
      if(key!==groundKey||!groundReady){groundReady=paintGround(groundCtx,view,state.stage);groundKey=key;}
      ctx.drawImage(ground,0,0,width,height);
    }
    hits=[];
    if(state.stage==='node'){
      for(let i=0;i<26;i++){
        const at=6.5+i*.30,spread=(i%3-1)*(.20+(i/25)*.15);
        const p=project(view,channel(view,at)+.42*Math.sin(at*1.15)+spread,at);
        if(p.y<-5||p.y>height+5)continue;
        ctx.beginPath();ctx.ellipse(p.x,p.y,Math.max(1.8,p.k*.061),Math.max(1.5,p.k*.043),0,0,Math.PI*2);
        ctx.fillStyle=i%2?'#4d836a':'#bca354';ctx.fill();
      }
    }
    const props=worldProps(), now=lastEffect?clock-lastEffect.t:10;
    for(const piece of props){
      const foot=project(view,piece.x,piece.z);
      if(piece.hero){
        ring(ctx,foot,foot.k*.84,foot.k*.245,'#fff4c5',.89);
        ring(ctx,foot,foot.k*.93,foot.k*.275,'#684d38',.54);
        if(moving&&!reduced){for(let i=0;i<3;i++){const w=(clock*1.28+i*.333)%1, pp=project(view,piece.x,piece.z-w*1.18);ring(ctx,pp,pp.k*(.52+w*.38),pp.k*(.09+w*.12),'#fff2c9',(1-w)*.45);}}
      } else if(!cover&&piece.id&&(picked===piece.id||near[0]?.id===piece.id)){
        ring(ctx,foot,foot.k*Math.min(1.25,piece.height*.49),foot.k*.22,'#fff5b8',.88);
      }
      const box=drawCut(ctx,view,piece);
      if(box&&piece.id)hits.push({...box,id:piece.id});
      if(piece.hero&&box&&lastEffect&&now<1.42&&['match','recall','signal','encounter'].includes(lastEffect.type)){
        const soft=reduced?.6:now/1.42;
        for(let i=0;i<3;i++){const n=soft*1.52-i*.24;if(n<0||n>1)continue;ring(ctx,foot,foot.k*(.62+n*1.3),foot.k*(.19+n*.44),lastEffect.type==='signal'?'#8af2ca':'#ffef9a',(1-n)*.94);}
      }
    }
    if(transition){
      if(stageTime>=.45||reduced)transition=null;
      else{ctx.save();ctx.globalAlpha=1-stageTime/.45;ctx.drawImage(transition,0,0,width,height);ctx.restore();}
    }
  }
  function point(e){const r=canvas.getBoundingClientRect();return {x:e.clientX-r.left,y:e.clientY-r.top};}
  function hitAt(p){
    let best=null,score=Infinity;
    for(const h of [...hits].reverse()){
      const d=((p.x-h.x)/h.rx)**2+((p.y-h.y)/h.ry)**2;
      if(d<=1.22&&d<score){best=h;score=d;}
    }
    return best;
  }
  canvas.addEventListener('pointerdown',e=>{
    if(cover||paused||!e.isPrimary||e.button!==0)return;
    const p=point(e);trip=null;setMoving(false);drag={id:e.pointerId,first:p,last:p,active:false};canvas.setPointerCapture?.(e.pointerId);
    events.gesture?.();
  });
  canvas.addEventListener('pointermove',e=>{
    if(!drag||e.pointerId!==drag.id||paused)return;
    const p=point(e);if(!drag.active&&Math.hypot(p.x-drag.first.x,p.y-drag.first.y)<7)return;
    drag.active=true;picked=null;
    const units=Math.min(height*.12,77),dx=(p.x-drag.last.x)/Math.max(40,width*.16),dz=(drag.last.y-p.y)/units;
    z=clamp(z+dz*1.48,0,pathEnd[state.stage]);lane=clamp(lane+dx,-2.15,2.15);drag.last=p;
    setMoving(true);proximity();if(reduced){camZ=z;camLane=lane;draw();}
  });
  canvas.addEventListener('pointerup',e=>{
    if(!drag||e.pointerId!==drag.id)return;
    const p=point(e),wasDrag=drag.active;drag=null;
    if(wasDrag){setMoving(false);persist();return;}
    const hit=hitAt(p);if(hit){approach(hit.id,true);return;}
    const dest=groundLane(view,p.x,p.y);moveTo(dest.at,dest.lane);
  });
  canvas.addEventListener('pointercancel',stop);
  function key(name,pressed){if(cover||paused)return;if(pressed){keys.add(name);events.gesture?.();schedule();}else{keys.delete(name);if(!keys.size){setMoving(false);persist();}}}
  function redrawOnFocus(){if(document.hidden){stop();cancelAnimationFrame(frame);frame=0;previous=0;}else schedule();}
  document.addEventListener('visibilitychange',redrawOnFocus);window.addEventListener('blur',stop);
  updateSize();
  return {setScene,approach,advance,effect:sceneEffect,pause,position,stop,key,draw,nearby:()=>near.slice(),stations:()=>choices.slice(),
    destroy(){pause(true);ro?.disconnect();window.removeEventListener('resize',resize);window.removeEventListener('blur',stop);document.removeEventListener('visibilitychange',redrawOnFocus);}
  };
}
