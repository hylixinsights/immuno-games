/* Brazilian night training ground. Two printed faces share one X-axis crease.
 * Stock: 0.04–0.08 unit cut edges, forest green pitch and blue reverse, amber gloves.
 * Four paper floodlight towers, three tiers, a striped pitch, a cut net, two articulated figures.
 * 32° lens for the pitch; close focus travels from the optic nerve to the glove. Same fixed lighting on every replay.
 * popup-3d supplies the camera, renderer, textured card stock and lighting rig. The match runs its own input and clock.
 */
import * as THREE from 'three';
import {createHarness} from './paper/harness.js';
import {paperLights} from './paper/lib/paperkit-3d.js';
import {makeReverseAxon,gloveTunnel} from './rolls.js';
import {createStadium} from './stadium.js';
import {createAthlete,createBall} from './athletes.js';
import {clamp,lerp,smooth} from './rules.js';

export function makeWorld(mount){
  const H=createHarness({bounds:{x0:-10,x1:10,z0:-10,z1:9},ground:'#18323b',stock:'#f5e8cb',view:{pitch:29,dist:25,target:[0,1,0],fov:32},play:false});
  const {renderer,scene,camera}=H;
  mount.replaceChildren(renderer.domElement);
  camera.near=.014;camera.far=150;renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.6));
  renderer.shadowMap.type=THREE.PCFShadowMap;
  const rig=paperLights(scene,{key:'#ffdfb0',keyIntensity:1.68,keyDir:[-.7,1,.58],fill:'#cbdedc',fillIntensity:.73,sky:'#fff0cf',ground:'#457067',skyIntensity:1.03,mapSize:512,shadowExtent:13,distance:33,target:new THREE.Vector3(0,0,-.5)});
  rig.key.shadow.bias=-.001;rig.key.shadow.normalBias=.022;
  const stadium=createStadium(THREE), sheet=stadium.group;
  const keeper=createAthlete(THREE,'keeper'),striker=createAthlete(THREE,'striker'),ball=createBall(THREE);
  sheet.add(keeper.group,striker.group,ball);scene.add(sheet);striker.group.rotation.y=Math.PI-.22;
  const rolled=makeReverseAxon(THREE),tunnel=gloveTunnel(THREE);sheet.add(rolled.group);scene.add(tunnel);
  const reverse=new THREE.Mesh(new THREE.PlaneGeometry(19.2,18),new THREE.MeshLambertMaterial({color:0x58767c,side:THREE.DoubleSide,map:H.paper.map}));
  reverse.rotation.x=Math.PI/2;reverse.position.set(0,-.115,-.5);sheet.add(reverse);
  const sky=document.createElement('canvas');sky.width=768;sky.height=512;
  const g=sky.getContext('2d'),wash=g.createLinearGradient(0,0,0,512);wash.addColorStop(0,'#122b3a');wash.addColorStop(.72,'#264650');wash.addColorStop(1,'#233d40');g.fillStyle=wash;g.fillRect(0,0,768,512);
  let n=3467;const rnd=()=>{n=(n*1664525+1013904223)>>>0;return n/4294967296};
  for(let i=0;i<3400;i++){g.fillStyle=i%3?'#f7dfac0c':'#071c2b19';g.fillRect(rnd()*768,rnd()*512,1+rnd()*2,1)}
  for(let i=0;i<58;i++){let x=rnd()*768,y=rnd()*245;g.fillStyle=i%4?'#c9c9a789':'#e7bc73';g.fillRect(x,y,1.5,1.5);if(i%9===0){g.fillRect(x-2,y,5,1);g.fillRect(x,y-2,1,5)}}
  g.fillStyle='#e8bf73';g.beginPath();g.arc(611,75,15,0,Math.PI*2);g.fill();g.fillStyle='#bfa06b';for(const [x,y,r] of [[606,70,3],[615,80,4],[619,71,1.8]]){g.beginPath();g.arc(x,y,r,0,Math.PI*2);g.fill()}
  scene.background=new THREE.CanvasTexture(sky);scene.background.colorSpace=THREE.SRGBColorSpace;
  let w=0,h=0;const eye=new THREE.Vector3(),finger=new THREE.Vector3(),p=new THREE.Vector3(),at=new THREE.Vector3(),wide=new THREE.Vector3(),target=new THREE.Vector3(),v=new THREE.Vector3(),anchor=new THREE.Vector3();
  function render(width,height,f,shot){
    if(width<2||height<2)return;
    if(width!==w||height!==h){w=width;h=height;renderer.setSize(w,h,false);camera.aspect=w/h;}
    sheet.rotation.x=0;tunnel.visible=false;
    stadium.animate(f.time,f.cheer);
    keeper.pose({time:f.time,clap:f.clap,dive:f.dive,side:f.side,flex:f.flex,grip:f.outcome==='catch'?smooth((f.progress-.84)/.085):0});keeper.group.position.set(f.pose.x,f.pose.y,f.pose.z);keeper.group.rotation.z=-f.pose.tilt;
    striker.pose({time:f.time,run:f.run,kick:f.kick});striker.group.position.set(lerp(-1.12,-.22,f.run),0,lerp(5.75,4.17,f.run));
    ball.position.set(f.ball.x,f.ball.y,f.ball.z);ball.rotation.set(f.progress*5.3,f.progress*5.7*shot.side,shot.curve*f.progress*5);
    sheet.updateMatrixWorld(true);keeper.glove(f.side).getWorldPosition(finger);
    if(f.dive>0){const k=smooth(f.dive*1.35);keeper.group.position.addScaledVector(v.set(f.hand.x,f.hand.y,f.hand.z).sub(finger),k);}
    sheet.updateMatrixWorld(true);keeper.glove(f.side).getWorldPosition(finger);keeper.eye.localToWorld(eye.set(f.eye==='right'?-.18:0,0,0));
    const a=w/h,wideScale=Math.max(1,1.12/a);
    target.set(0,1.12,-1.0);wide.set(6.7,8.35,18.6).multiplyScalar(wideScale).add(target);p.copy(wide);at.copy(target);camera.fov=34;
    if(f.camera==='eye'){
      const u=smooth(f.cameraT);p.lerp(v.copy(eye).add(new THREE.Vector3(.015,.002,.035)),u);at.lerp(eye,u);
    }else if(f.camera==='contact'){
      const u=smooth(f.cameraT);p.lerp(v.copy(finger).add(new THREE.Vector3(f.side*.55,.38,1.75)),u*.98);at.lerp(finger,u);
    }else if(f.camera==='exit'){
      const t=f.cameraT;anchor.copy(finger);
      const far=clamp((t-.30)/.7), near=-.13+1.33*smooth(t/.31);
      p.copy(anchor).add(v.set(-f.side*.22,.18,1).multiplyScalar(near));
      p.lerp(wide,smooth(far)*.88);at.copy(anchor);at.z-=.27*(1-smooth(t/.27));at.lerp(target,smooth(far)*.82);
      tunnel.position.copy(anchor);tunnel.visible=t<.245;
    }else if(f.camera==='result'){
      p.copy(wide).multiplyScalar(.91);at.set(shot.side*.44,1.15,-1.4);
    }
    if(f.fold){sheet.rotation.x=-Math.PI*f.fold;}
    camera.position.copy(p);camera.lookAt(at);camera.updateProjectionMatrix();renderer.render(scene,camera);
  }
  const canvas=renderer.domElement;
  let reversePrint=null;
  function printReverse(canvas,stage,injured){rolled.build(stage,injured);if(reversePrint)reversePrint.dispose();reversePrint=new THREE.CanvasTexture(canvas);reversePrint.colorSpace=THREE.SRGBColorSpace;reverse.material.color.set(0xffffff);reverse.material.map=reversePrint;reverse.material.needsUpdate=true;}
  return {render,printReverse,project(world){v.set(world.x,world.y,world.z).project(camera);return{x:(v.x+1)*w/2,y:(1-v.y)*h/2}},canvas};
}
