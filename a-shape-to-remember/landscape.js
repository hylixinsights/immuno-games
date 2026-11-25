import { groundCenter } from './art/ground/path.js';
import { castSprite } from './cast.js';

const clamp = (n,lo,hi) => Math.max(lo,Math.min(hi,n));
const sin = .7547, cos = .6561;
const tint = {river:'#e4be93',node:'#c7cda9',recognition:'#c2cbaa',garden:'#b8c394',marrow:'#e2b89a',recall:'#c5caa5',tonsil:'#dcbca5'};
const images = new Map();
export function groundImage(stage) {
  if (!images.has(stage)) {
    const img = new Image(); img.src = new URL('./art/ground/'+stage+'.webp',import.meta.url).href;
    images.set(stage,img);
  }
  return images.get(stage);
}
export function camera(width,height,at,lane,cover=false) {
  const scale = clamp(Math.min(width/(cover?6.85:6.9),height/(cover?7.5:8.7)),34,95);
  const distance = Math.max(10,height/(scale*1.08));
  const tile = Math.max(11.5,width/(scale*.50));
  const view = {width,height,scale,distance,tile,length:tile*5/3,at,anchor:height*(cover?.77:.698)};
  view.camX = channel(view,at) + lane*.53;
  return view;
}
export function channel(v,z) { return (groundCenter(.91-z/v.length)-.5)*v.tile; }
export function project(v,x,z,up=0) {
  const dz=z-v.at, k=v.scale*v.distance/Math.max(v.distance*.26,v.distance+dz*cos-up*sin);
  return {x:v.width*.5+(x-v.camX)*k,y:v.anchor-(dz*sin+up*cos)*k,k};
}
export function groundAt(v,y) {
  const delta = (v.anchor-y)/v.scale;
  return v.at+delta/Math.max(.12,sin-delta*cos/v.distance);
}
export function groundLane(v,x,y) {
  const z=groundAt(v,y), p=project(v,0,z);
  return {at:z,lane:(x-v.width*.5)/p.k+v.camX-channel(v,z)};
}
export function paintGround(g,v,stage) {
  const img=groundImage(stage),w=v.width,h=v.height;
  g.fillStyle=tint[stage];g.fillRect(0,0,w,h);
  if (!img.naturalWidth && !img.width) return false;
  const iw=img.naturalWidth||img.width, ih=img.naturalHeight||img.height;
  // Scan across a single continuous tilted plane. Only the UV coordinate wraps.
  const band=clamp(Math.round(h/66),6,15);
  for(let y=0;y<h;y+=band){
    const bottom=Math.min(h,y+band),z0=groundAt(v,y),z1=groundAt(v,bottom);
    const vtop=((.91-z0/v.length)%1+1)%1*ih, sy=Math.min(ih-.01,vtop);
    const sh=Math.max(.06,(z0-z1)/v.length*ih);
    const p=project(v,0,(z0+z1)*.5),vw=v.tile*p.k, left=p.x-vw/2;
    const ph=bottom-y+.35, first=Math.min(ih-sy,sh),h1=first/sh*ph;
    if(first>.001)g.drawImage(img,0,sy,iw,first,left,y,vw,h1+.15);
    if(sh>first+.001)g.drawImage(img,0,0,iw,sh-first,left,y+h1,vw,ph-h1+.15);
    // Reflect the printed margin at the edges of wide views.
    function margin(axis) {
      g.save();g.translate(axis*2,0);g.scale(-1,1);
      if(first>.001)g.drawImage(img,0,sy,iw,first,left-.2,y,vw+.4,h1+.15);
      if(sh>first+.001)g.drawImage(img,0,0,iw,sh-first,left-.2,y+h1,vw+.4,ph-h1+.15);
      g.restore();
    }
    if(left>0)margin(left);
    if(left+vw<w)margin(left+vw);
  }
  const haze=g.createLinearGradient(0,0,0,h*.29);
  haze.addColorStop(0,'rgba(239,223,185,.38)');haze.addColorStop(1,'rgba(239,223,185,0)');
  g.fillStyle=haze;g.fillRect(0,0,w,h*.3);
  return true;
}
function ellipse(c,x,y,rx,ry,angle,color) {
  c.beginPath();c.ellipse(x,y,Math.max(.3,rx),Math.max(.3,ry),angle,0,Math.PI*2);c.fillStyle=color;c.fill();
}
const shadeCache=new Map();
function leafShade(image,factor) {
  const key=factor;
  // Key by the original canvas, including its receptor and family mark.
  let variants=shadeCache.get(image);
  if (!variants){variants=new Map();shadeCache.set(image,variants);}
  if(variants.has(key))return variants.get(key);
  const copy=document.createElement('canvas');copy.width=image.width;copy.height=image.height;
  const c=copy.getContext('2d');c.drawImage(image,0,0);c.globalCompositeOperation='source-atop';
  c.fillStyle='rgba(83,58,37,'+factor+')';c.fillRect(0,0,copy.width,copy.height);
  variants.set(key,copy);return copy;
}
// The paper body is a folded ridge with two actual planes in x, depth and height.
// Each half projects independently about its bottom fold. The printed face and its
// shaded reverse share the same cutout, including holes between receptor arms.
export function drawCut(c,v,prop) {
  const {art,x,z,height:h}=prop;
  const sprite=castSprite(art,{variant:prop.variant||0,mark:prop.mark||0,target:prop.target||0,marked:!!prop.marked});
  if(!sprite?.width)return null;
  const scaleY=prop.scaleY||1, w=clamp(sprite.width/sprite.height,.35,2.75)*h;
  const tilt=prop.tilt??0, fold=clamp(prop.fold??1,0,1.105);
  const angle=(prop.flat ? 2.35 : .15+fold*1.66)+tilt;
  const rise=Math.sin(angle)*h*scaleY, away=-Math.cos(angle)*h;
  const elevation=prop.lift||0, yaw=prop.yaw||0;
  const ridge=(prop.ridge??.065)*w*fold;
  const col=(f,level)=>{
    const dx=(f-.5)*w, bend=(1-Math.abs(f*2-1))*ridge;
    return project(v,x+dx*Math.cos(yaw),z+dx*Math.sin(yaw)-bend+away*level,elevation+rise*level);
  };
  const foot=project(v,x,z);
  if(foot.k*h<3||foot.y < -h*foot.k || foot.y>v.height+h*foot.k*1.8 || foot.x< -w*foot.k*.7 || foot.x>v.width+w*foot.k*.7)return null;
  const size=foot.k*h;
  if(prop.shadow!==false){
    ellipse(c,foot.x+size*.13,foot.y+size*.025,size*(art==='rbc'?.38:.33),size*.078,-.13,'rgba(76,49,29,.16)');
    ellipse(c,foot.x+size*.045,foot.y+size*.015,size*.20,size*.041,0,'rgba(68,43,28,.22)');
  }
  if(['node','follicle','marrow','tonsil','family','fan','venule'].includes(art)&&fold>.12){
    const base=project(v,x+w*.14,z),end=project(v,x+w*.48,z+h*.18),tip=project(v,x+w*.18,z+away*.40,rise*.44);
    c.beginPath();c.moveTo(base.x,base.y);c.lineTo(end.x,end.y);c.lineTo(tip.x,tip.y);c.closePath();
    c.fillStyle='#dcc391';c.fill();c.strokeStyle='#87714a';c.lineWidth=Math.max(.65,foot.k*.018);c.stroke();
  }
  const single=prop.flat||size<39||['reed','branch','bone','antibody'].includes(art);
  const fractions=single?[0,1]:[0,.5,1],pts=[];
  // Affine panels share the central ridge. Small distant pieces can be drawn
  // in one pass using their projected centerline.
  for(let i=0;i<fractions.length-1;i++){
    const l=fractions[i],r=fractions[i+1],tl=col(l,1),tr=col(r,1),bl=col(l,0),br=col(r,0);
    pts.push(tl,tr,bl,br);
    const paper=fold<.39?leafShade(sprite,.20):i===1?leafShade(sprite,.09):sprite;
    const sw=sprite.width*(r-l),sh=sprite.height,centerTop=col(.5,1),centerBase=col(.5,0);
    c.save();
    c.transform((tr.x-tl.x)/sw,(tr.y-tl.y)/sw,(centerBase.x-centerTop.x)/sh,(centerBase.y-centerTop.y)/sh,tl.x,tl.y);
    c.drawImage(paper,l*sprite.width,0,sw,sh,0,0,sw+(single?0:.28),sh);
    c.restore();
  }
  const left=Math.min(...pts.map(p=>p.x)), right=Math.max(...pts.map(p=>p.x)), top=Math.min(...pts.map(p=>p.y)),bottom=Math.max(...pts.map(p=>p.y));
  return {x:(left+right)/2,y:(top+bottom)/2,rx:Math.max(24,(right-left)*.495),ry:Math.max(24,(bottom-top)*.51),foot};
}
export function ring(c,p,rx,ry,color,alpha=1) {
  c.save();c.globalAlpha=alpha;c.strokeStyle=color;c.lineWidth=Math.max(1.2,p.k*.027);
  c.beginPath();c.ellipse(p.x,p.y,rx,ry,-.045,0,Math.PI*2);c.stroke();c.restore();
}

// The anatomical print is a physical plane. In browsers it can be composited
// directly, so camera movement reuses the same decoded artwork on every frame.
export function tissuePlane(host) {
  if(!host||!window.CSS?.supports('transform','matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)'))return null;
  const rows=new Map();
  let place='';
  return function update(v,stage){
    if(stage!==place){host.replaceChildren();rows.clear();place=stage;host.style.backgroundColor=tint[stage];}
    const far=groundAt(v,-2),near=groundAt(v,v.height+2);
    const min=Math.ceil(near/v.length-.91),max=Math.ceil(far/v.length-.91);
    for(const [i,row] of rows)if(i<min||i>max){row.remove();rows.delete(i);}
    const unit=v.tile/768,mid=v.width*.5, slope=-unit*cos/v.distance;
    for(let i=min;i<=max;i++){
      let row=rows.get(i);
      if(!row){
        row=document.createElement('div');row.className='ground-sheet';
        const src=groundImage(stage).src;
        for(let j=0;j<3;j++){const img=document.createElement('img');img.src=src;img.alt='';img.draggable=false;row.append(img);}
        rows.set(i,row);host.append(row);
      }
      const dz=(.91+i)*v.length-v.at, denom=1+dz*cos/v.distance;
      row.style.transform='matrix3d('+[
        v.scale*unit,0,0,0,
        mid*slope,v.anchor*slope+v.scale*unit*sin,0,slope,
        0,0,1,0,
        mid*denom+v.scale*(-1.5*v.tile-v.camX),v.anchor*denom-v.scale*dz*sin,0,denom
      ].join(',')+')';
    }
  };
}
