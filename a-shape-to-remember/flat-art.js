// An alternate, ink-printed spread for browsers where the live 3D book is unavailable.
const W = 1000, H = 550, TAU = Math.PI * 2;
const ink = '#4c4231', cream = '#f7e9c8', gold = '#e5b65d';
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const geom = new Map();
function p(d) {
  if (!geom.has(d)) geom.set(d, new Path2D(d));
  return geom.get(d);
}
function rand(seed) {
  return () => { seed = Math.imul(seed, 1664525) + 1013904223 >>> 0; return seed / 4294967296; };
}
function line(c, d, color, width = 1) {
  c.strokeStyle = color; c.lineWidth = width; c.stroke(typeof d === 'string' ? p(d) : d);
}
function fill(c, d, color) { c.fillStyle = color; c.fill(typeof d === 'string' ? p(d) : d); }
function oval(c, x, y, rx, ry, color, stroke, w=1, angle=0) {
  c.beginPath(); c.ellipse(x,y,rx,ry,angle,0,TAU); c.fillStyle=color; c.fill();
  if(stroke) { c.strokeStyle=stroke; c.lineWidth=w; c.stroke(); }
}
function arc(c, x, y, rx, ry, a, b, color, w=1, angle=0) {
  c.beginPath(); c.ellipse(x,y,rx,ry,angle,a,b); c.strokeStyle=color;c.lineWidth=w;c.stroke();
}
function at(c,x,y,scale,rotation,fn) {
  c.save(); c.translate(x,y); c.rotate(rotation); c.scale(scale,scale); fn(); c.restore();
}
function cut(c,d,tone,edge='#7b6243',depth=3) {
  const shape=typeof d==='string'?p(d):d;
  c.save(); c.translate(2.4,depth+1.8); c.shadowBlur=depth*2.1;c.shadowOffsetX=2;c.shadowOffsetY=2;
  c.shadowColor='rgba(72,45,30,.30)'; fill(c,shape,edge); c.restore();
  fill(c,shape,tone); line(c,shape,edge,1.7);
}
function gradient(c,x,y,x2,y2,colors) {
  const g=c.createLinearGradient(x,y,x2,y2); colors.forEach(([t,k])=>g.addColorStop(t,k)); return g;
}
function fiber(c,shape,seed,box,n,color='rgba(88,63,33,.14)') {
  const r=rand(seed); c.save(); c.clip(typeof shape==='string'?p(shape):shape); c.lineWidth=.8;c.strokeStyle=color; c.beginPath();
  for(let i=0;i<n;i++) { const x=box[0]+r()*box[2], y=box[1]+r()*box[3]; c.moveTo(x,y);c.lineTo(x+.9+r()*3.9,y-1+r()*1.6); }
  c.stroke(); c.restore();
}
const leftPage='M107 135 Q218 99 323 109 Q429 112 500 145 L500 470 Q390 423 278 429 Q163 429 44 464 Z';
const rightPage='M500 145 Q570 112 677 105 Q786 95 895 123 L957 454 Q822 418 721 423 Q601 426 500 470 Z';
const bed='M102 147 Q300 87 499 150 Q678 89 900 132 L966 475 Q758 422 507 492 Q495 499 485 488 Q297 423 34 487 Z';
function pageAt(x,z) {
  return { x:500+x*(350+z*32), y:304+z*118+22*Math.pow(1-Math.abs(x),1.9)-x*5 };
}
function unproject(x,y) {
  let z=clamp((y-304)/118,-1,1), xx=0;
  for(let i=0;i<4;i++) { xx=clamp((x-500)/(350+z*32),-1,1);z=clamp((y-304-22*(1-Math.abs(xx))**1.9+xx*5)/118,-1,1); }
  return {x:xx,z};
}
function desk(c) {
  c.fillStyle=gradient(c,0,0,W,H,[[0,'#163b32'],[.52,'#23443a'],[1,'#0c2b25']]);c.fillRect(0,0,W,H);
  const r=rand(502); c.lineWidth=.55;
  for(let i=0;i<1450;i++) {const x=r()*W,y=r()*H; c.strokeStyle=i%4?'rgba(219,201,142,.07)':'rgba(4,19,18,.20)'; c.beginPath();c.moveTo(x,y);c.lineTo(x+r()*12+1,y-r()*3);c.stroke();}
  c.save(); c.translate(10,16); c.shadowColor='rgba(6,24,20,.77)'; c.shadowBlur=24;c.shadowOffsetY=10;fill(c,bed,'#142e25');c.restore();
  c.save();c.translate(0,11);cut(c,bed,'#274d3c','#162e27',3);line(c,bed,'#ad8e46',2.2);c.restore();
  c.save();c.translate(0,4);line(c,bed,'#547451',3);c.restore();
  // The fore-edge is a gathered stack, not a single inflated page.
  for(let j=12;j>=1;j--) {
    c.save();c.translate(0,j*1.32);c.scale(1,1+j*.0005);
    const tone=['#c8a574','#dfc79b','#ae8d5c','#e1c793','#ead1a1'][j%5];
    fill(c,leftPage,tone);fill(c,rightPage,tone);line(c,leftPage,'rgba(91,65,37,.28)',1);line(c,rightPage,'rgba(91,65,37,.26)',1);c.restore();
  }
  fill(c,leftPage,gradient(c,48,160,501,178,[[0,'#ead8af'],[.19,'#f5e6c5'],[.53,'#f6eacc'],[.83,'#ead6aa'],[1,'#bea477']]));
  fill(c,rightPage,gradient(c,500,165,955,160,[[0,'#bea477'],[.14,'#efdfb9'],[.47,'#f8eac9'],[.83,'#efdfb8'],[1,'#d9c49a']]));
  line(c, leftPage,'#8e744e',1.3); line(c,rightPage,'#8e744e',1.3);
  fiber(c,leftPage,18,[35,97,480,379],1100); fiber(c,rightPage,39,[500,91,470,385],1100);
  // Two simple flyleaf rules follow the curve of the spread.
  line(c,'M62 448 Q280 388 480 449 M519 449 Q748 379 938 442','rgba(151,115,59,.45)',1.4);
  line(c,'M65 443 Q279 382 476 443 M523 443 Q748 373 935 436','rgba(151,115,59,.28)',.8);
  line(c,'M501 150 C493 248 507 374 500 465','rgba(104,79,48,.44)',1.4);
  cut(c,'M827 438 L840 435 L855 482 L844 479 L838 489 Z','#b95d49','#78503b',1.4);
}
function flecks(c,x,y,rad,n,seed,colors) {
  const r=rand(seed);
  for(let i=0;i<n;i++){const a=r()*TAU, d=Math.sqrt(r())*rad, sz=.8+r()*1.6;oval(c,x+Math.cos(a)*d,y+Math.sin(a)*d*.77,sz,sz*.68,colors[i%colors.length],null,0,a);}
}
function ruled(c,x,y,rx,ry,color,n=10,rot=0) {
  c.save();c.translate(x,y);c.rotate(rot);c.lineCap='round';
  for(let i=0;i<n;i++){const k=(i+.5)/n, a=(.10+.40*k)*Math.PI; arc(c,0,0,rx*(1-.52*k),ry*(1-.57*k),a,Math.PI*.94,color,1.25);}
  c.restore();
}
// A vein ribbon is printed in the plane. Its cells turn above it on separate cards.
const vessel='M96 178 C143 147 233 135 281 155 C348 181 328 211 289 241 C251 271 177 287 177 307 C175 337 283 321 353 337 C415 352 458 382 482 438 L353 418 C333 399 309 389 264 384 C201 382 103 404 88 344 C74 292 129 257 197 232 C236 217 249 194 223 184 C193 173 139 188 99 208 Z';
function river(c,dim=false) {
  c.save();c.clip(p(leftPage));fill(c,vessel,dim?'#d2aa87':'#ca765e');line(c,vessel,dim?'#b19a77':'#8d4e3b',3);
  c.save();c.clip(p(vessel));
  const colors=dim?['#c0a07d','#e3bc98','#b99673']:['#e69d7b','#b86654','#eeb092'];
  for(let i=0;i<21;i++){c.save();c.translate(i*1.2,(i-10)*3.3);line(c,'M76 186 C228 121 377 174 291 233 C216 284 125 278 137 325 C150 381 343 322 413 406',colors[i%3],i%3===1?1.6:1.2);c.restore();}
  fiber(c,vessel,78,[80,130,422,300],920);c.restore();c.restore();
  if(!dim){
    const pleats=[['M101 177 Q181 135 246 143 Q206 137 153 151 Q121 159 101 169 Z','#ddab82'],['M90 313 Q96 272 146 252 Q111 264 94 283 Q86 297 84 312 Z','#d6a781'],['M226 389 Q305 379 348 401 Q304 374 224 381 Z','#dfb38b']];
    pleats.forEach(([path,color])=>{cut(c,path,color,'#ad805d',1);});
  }
  line(c,'M112 170 C185 134 258 137 282 151 M98 280 C115 259 152 244 181 237 M184 389 C217 394 245 387 284 390','rgba(116,66,42,.56)',2);
}
const bean='M-157 20 C-173 -41 -139 -113 -65 -132 C6 -153 89 -128 117 -86 C145 -44 129 -13 94 -7 C72 -4 62 8 69 22 C78 38 117 29 124 51 C134 80 99 109 62 114 C-23 129 -126 107 -153 47 Q-158 32 -157 20 Z';
function rosette(c,x,y,r,palette,seed) {
  const [shell,mid,pale]=palette;
  at(c,x,y,1,seed*.06,()=>{
    oval(c,1.5,2,r*1.12,r*.96,shell,'rgba(60,65,37,.65)',1.3);oval(c,-1,0,r*.93,r*.79,mid);
    oval(c,-2,-1,r*.58,r*.46,pale);arc(c,-1,0,r*.87,r*.72,3.5,5.65,pale,2);
    const rnd=rand(88+seed);for(let k=0;k<12;k++){const a=k*TAU/12;oval(c,Math.cos(a)*r*.79,Math.sin(a)*r*.66,1.4+r*.045,1.1+r*.028,k%3?shell:pale,null,0,a);}
    for(let i=0;i<9;i++){const a=rnd()*TAU,d=rnd()*r*.43;oval(c,-2+Math.cos(a)*d,-1+Math.sin(a)*d*.72,1.2,.9,i%2?shell:mid);}
  });
}
function nodeLeaf(c,x,y,s,open,age=false) {
  c.save(); c.translate(x,y);c.rotate(-.17);c.scale(s,s*(open?1:.43));
  if(open){c.save();c.translate(9,10);cut(c,bean,'#8b7650','#705a3e',5);c.restore();}
  cut(c,bean,open?'#587d69':'#a5ad88','#776b50',open?5:1.4);
  c.save();c.translate(-2,-2);c.scale(.94,.94);fill(c,bean,open?(age?'#b7bd8b':'#a9bb91'):'#c7c5a3');line(c,bean,'#e8dabc',3);c.restore();
  c.save();c.scale(.85,.82);fill(c,bean,open?'#759680':'#bec09b');line(c,bean,'#7b896d',1.4);c.restore();
  if(open) {
    fill(c,'M-111 41 C-79 -22 -65 12 -40 -64 C-28 -49 -38 -19 -42 -1 C-23 -17 1 -30 30 -51 C38 -44 12 -19 1 -6 C36 -14 50 -37 72 -45 C61 -20 35 -5 7 5 C35 4 49 -3 67 -8 L56 7 C19 20 -18 9 -48 33 C-67 48 -56 64 -80 78 Z','#476e61');
    line(c,'M-106 52 Q-72 13 -43 10 Q7 -15 31 -42 M-65 25 Q-50 4 -41 -38 M-41 9 Q4 2 53 -20','#e4d092',2.4);
  }
  const rosettes=[[-103,-63,23],[-56,-98,19],[-2,-104,23],[57,-87,20],[96,-58,15],[-122,-15,18],[-100,43,22],[-59,77,17],[-12,79,18],[40,83,16],[77,64,14]];
  rosettes.forEach(([xx,yy,r],i)=>rosette(c,xx,yy,r,open?(age?['#758968','#ceb87a','#eddba9']:['#547b66','#cfac6e','#f0d6a0']):['#98a083','#c7bf96','#dbccab'],i));
  fiber(c,bean,73,[-165,-145,310,277],610,'rgba(48,63,45,.2)');
  line(c,'M-150 -14 C-158 -82 -94 -133 -24 -134 M-113 88 Q-74 114 -16 112',open?'#ead7a7':'#ddcfad',2.5);
  if(open){for(let q=0;q<13;q++){const a=-2.9+q*.145;const r=114;line(c,`M${Math.cos(a)*r} ${Math.sin(a)*r*.84} l-4 -6`,'#71836a',.9);}}
  c.restore();
}
function branch(c,x,y,s,rotation=0,pale=false) {
  const twigs='M-11 0 Q-12 -25 -26 -39 Q-36 -46 -54 -51 L-55 -56 Q-32 -55 -22 -47 Q-35 -73 -36 -96 L-29 -95 Q-24 -67 -15 -58 Q-16 -87 -7 -116 L-1 -116 Q-8 -82 -1 -69 Q5 -93 22 -110 L26 -107 Q13 -86 10 -72 Q26 -84 39 -82 L40 -76 Q17 -70 8 -56 Q33 -63 47 -52 L44 -47 Q25 -55 10 -46 Q31 -45 38 -37 L34 -33 Q13 -39 3 -32 Q-4 -20 6 -1 Z';
  at(c,x,y,s,rotation,()=>{
    cut(c,twigs,pale?'#91a087':'#527b65',pale?'#72775c':'#415747',2.3);
    line(c,'M-4 -2 Q-10 -31 -11 -50 Q-9 -80 -7 -98 M-8 -41 Q2 -62 24 -75 M-11 -47 Q-29 -58 -33 -75',pale?'#dbcda3':'#b7bb86',2);
    [[-51,-54,-.8],[-35,-92,-.45],[-4,-112,.35],[22,-106,.62],[38,-80,1], [44,-51,1.7]].forEach(([xx,yy,a],i)=>{
      at(c,xx,yy,1,a,()=>{cut(c,'M0 1 Q-7 -2 -5 -11 Q1 -17 3 -14 Q8 -7 0 1 Z',i%2?'#a4ae77':'#bfaf73','#687855',1);});
    });
  });
}
function fanPlate(c,opened) {
  const root=[499,368], a0=-2.77, sweep=2.38, radius=270;
  for(let i=0;i<10;i++) {
    const a=a0+i*sweep/10,b=a0+(i+1)*sweep/10, r=radius*(.91+.08*Math.sin(i*1.49));
    const vx=n=>root[0]+Math.cos(n)*r*(opened?1.04:.60);
    const vy=n=>root[1]+Math.sin(n)*r*(opened?.87:.33);
    const d=`M${root[0]} ${root[1]} L${vx(a)} ${vy(a)} Q${vx((a+b)/2)} ${vy((a+b)/2)-5} ${vx(b)} ${vy(b)} Z`;
    const colors=['#6c947f','#a5b397','#789a8c','#acbca4','#789687','#c1b77f','#d7c89c','#acb084','#d5bd87','#c7b383'];
    cut(c,d,colors[i],'#818260',1.4);
    line(c,`M499 365 L${vx(a)+2} ${vy(a)+2}`,i%2?'#dace9c':'#6e8c77',1.7);
    const xx=root[0]*.27+vx((a+b)/2)*.73, yy=root[1]*.27+vy((a+b)/2)*.73;
    rosette(c,xx,yy,9+(i%3)*1.5,['#819572','#cec491','#f2deaf'],i);
  }
  cut(c,'M422 365 Q475 338 551 349 L566 365 Q487 353 434 382 Z','#c2a563','#8c764b',2);oval(c,499,361,6,5,'#d4a64a','#887343',1.2);
}
function marrowPlate(c) {
  c.save();
  const inner='M96 378 Q87 308 127 244 Q160 176 243 162 Q307 127 378 158 Q450 197 505 172 Q587 139 665 154 Q762 135 824 178 Q864 223 888 313 L893 361 Q806 347 751 367 Q675 342 598 361 Q536 384 490 374 Q410 355 361 375 Q288 346 218 378 Q141 356 96 378 Z';
  cut(c,inner,'#b97564','#976e4e',3);
  c.save();c.clip(p(inner));
  for(const [x,y,rx,ry] of [[187,245,100,51],[300,318,76,44],[426,241,115,52],[579,271,69,46],[677,230,82,49],[768,322,91,52]]) {
    oval(c,x,y,rx,ry,'#bd8974');ruled(c,x,y,rx*.9,ry*.84,'#ab7464',7,.16);flecks(c,x,y,rx*.76,32,Math.round(x),['#a87067','#d39d7b','#dcb08d']);
  }
  const sample=rand(301);
  for(let j=0;j<60;j++){
    const x=100+sample()*780,y=164+sample()*190,r=2.2+sample()*4.7;
    if(j%4===0){oval(c,x,y,r*1.8,r*1.24,'#dbb394','#b7856e',1.1);oval(c,x-1.2,y-.8,r*1.24,r*.82,'#e7c6a4');}
    else {oval(c,x,y,r,r*.82,j%3?'#b27a6e':'#97858a','#926f68',.7);oval(c,x+.3,y-.45,r*.53,r*.47,j%3?'#90626a':'#7c7183');}
  }
  const connect=['M83 369 Q186 349 211 284 Q242 211 193 153','M105 218 Q171 256 221 247 Q303 217 330 154','M155 358 Q236 325 289 349 Q343 369 392 380','M268 158 Q280 226 350 247 Q387 260 418 312 Q443 345 494 371','M321 375 Q318 322 375 280 Q436 245 450 172','M436 253 Q520 270 552 230 Q585 199 614 142','M523 372 Q594 300 555 246','M571 331 Q644 327 679 285 Q716 235 694 143','M698 252 Q739 274 797 230 Q819 205 858 195','M661 370 Q694 322 752 332 Q834 341 877 362'];
  connect.forEach((d,i)=>{line(c,d,'#965e46',i%3===0?24:19);line(c,d,'#e7c492',i%3===0?18:13);line(c,d,'#f0d7aa',i%3===0?6:3);});
  [[199,243],[211,277],[142,340],[303,196],[357,252],[365,288],[416,323],[462,259],[537,244],[561,291],[614,320],[682,279],[733,257],[793,240],[762,331]].forEach(([x,y],i)=>{
    oval(c,x,y,2.4,.9,'#b48a62',null,0,(i%3)*.54-.6);
  });
  fiber(c,inner,877,[84,132,812,250],1100);c.restore();c.restore();
}
function tonsilPlate(c) {
  const tissue='M95 287 Q125 158 210 154 Q292 121 347 162 Q401 185 451 150 Q530 95 606 143 Q655 175 698 152 Q748 126 797 159 Q863 173 894 286 L906 354 Q825 354 745 367 Q668 367 611 378 Q505 393 418 378 Q345 354 269 369 Q174 343 104 359 Z';
  cut(c,tissue,'#d8ab90','#966f56',4); c.save();c.clip(p(tissue));
  const crypt='M90 171 Q168 159 225 185 Q265 206 278 251 Q296 302 333 296 Q356 292 354 276 Q345 254 322 249 Q311 238 329 226 Q351 204 391 189 Q449 176 503 133 L542 122 Q514 174 460 198 Q441 212 448 227 Q472 257 446 286 Q422 300 413 314 Q415 331 398 335 Q374 339 378 321 Q380 300 409 277 Q432 255 419 235 Q384 222 362 251 Q395 283 367 309 Q336 335 304 316 Q279 304 265 272 Q245 220 216 211 Q150 184 96 199 Z';
  fill(c,crypt,'#9d605d');line(c,crypt,'#f1cfb2',4);
  for(let i=0;i<45;i++) {const x=104+i*17; const y=174+21*Math.sin(i*.34); oval(c,x,y-3,6.2,3.4,i%3===0?'#b87572':'#d49982','#a87a69',.8,.14*Math.cos(i));}
  [[194,300,29],[246,326,20],[539,242,31],[612,207,27],[692,266,37],[764,207,21],[800,295,28],[480,328,16]].forEach(([x,y,r],i)=>rosette(c,x,y,r,['#ac8176','#c7aa98','#e8d0ac'],i));
  fiber(c,tissue,90,[80,116,840,270],1000);c.restore();
}
function smallSprigs(c) {
  // Fragmented peripheral tissue echoes tiny engravings near the edge of a plate.
  [[97,405,.40,-.66],[880,401,.48,.64],[861,378,.28,.96],[123,399,.24,-1.03]].forEach(([x,y,s,a])=>branch(c,x,y,s,a,true));
}
function plate(c,cfg) {
  desk(c);const stage=cfg.stage;
  if(stage==='river'||stage==='node'||stage==='recall') {
    river(c,stage!=='river');
    const open=stage!=='river'||cfg.tags?.includes('nodeOpen');
    if(open){branch(c,835,233,.75,.32,true);branch(c,573,224,.49,-.46,true);}
    if(!open || cfg.stage==='river') nodeLeaf(c,705,open?238:272,open?1:.99,open,stage==='recall');
    [[530,179,12],[553,198,7],[567,176,9]].forEach(([x,y,r],i)=>rosette(c,x,y,r,['#96a185','#bec29c','#eadbb2'],i));
  } else if(stage==='recognition') {
    nodeLeaf(c,283,247,.80,true);
    branch(c,567,281,1.19,-.11);branch(c,640,263,.91,.2,true);branch(c,489,239,.83,-.42,true);
    for(const [i,x,y] of [[1,739,196],[2,809,218],[3,729,255],[4,785,275],[5,668,223]])rosette(c,x,y,11+i%3*3,['#b6a276','#dbc593','#efe1b7'],i);
  } else if(stage==='garden') {
    const wide=!['start','arrived','entry','closed','folded','fan'].includes(cfg.step);
    branch(c,744,285,1.26,.08);branch(c,842,251,.77,.22,true);branch(c,678,244,.79,-.25,true);
    nodeLeaf(c,267,276,.67,true);fanPlate(c,wide);
  } else if(stage==='marrow') marrowPlate(c);
  else if(stage==='tonsil') tonsilPlate(c);
  smallSprigs(c);
  // Curved brass-colored gather threads hold the two leaves to the spine.
  for (const yy of [173,259,354,422]) { arc(c,500,yy,5,2.9,0,Math.PI,'#b89d69',1.5); }
}
const cellOutline='M-20 -8 Q-24 -21 -21 -33 Q-18 -44 -7 -47 Q8 -52 18 -42 Q27 -32 24 -21 Q23 -7 14 -3 Q-5 4 -20 -8 Z';
const marrowNucleus='M-13 -18 Q-22 -29 -10 -39 Q1 -46 9 -36 Q14 -30 6 -25 Q0 -23 -1 -17 Q-5 -11 -13 -18 Z';
function alphaMark(c,index,x,y,s=1) {
  at(c,x,y,s,0,()=>{
    if(index===1){line(c,'M-3 3 L0 -3 M2 3 L5 -3','#f3ce78',2.15);}
    else if(index===2){line(c,'M-5 -1 Q-4 3 -2 1 Q0 5 2 1 Q5 2 5 -2','#f3ce78',1.8);}
    else {fill(c,'M0 -6 L1.4 -2.2 L4.6 -3.6 L3 0 L6 1 L2 2 L2 5 L-.6 3 L-3 6 L-3 2 L-6 1 L-3.1 -.8 L-4 -4 L-1.6 -2.5 Z','#f4cd79');}
  });
}
function hook(c,x,y,s=1,rotation=0,col='#57867b') {
  at(c,x,y,s,rotation,()=>{line(c,'M0 5 L0 -3 L-4.5 -8 M0 -3 L4.5 -8','#4d6555',3.4);line(c,'M0 5 L0 -3 L-4.5 -8 M0 -3 L4.5 -8',col,1.85);});
}
const antigenOutlines=[
  'M0 -6 C-9 -22 -24 -16 -20 -3 C-19 1 -14 3 -10 3 C-26 10 -15 25 -4 16 Q-1 14 0 10 C4 24 20 22 20 9 C20 3 12 -1 7 1 C18 -7 11 -18 4 -12 Q1 -10 0 -6 Z',
  'M13 -20 C-15 -25 -26 0 -13 15 C-1 28 15 20 19 10 C3 15 -7 6 -5 -5 C-4 -12 3 -18 13 -20 Z',
  'M-2 -24 L18 -3 L-3 23 L-19 0 Z',
  'M-21 10 C-23 4 -20 -2 -17 -6 Q-17 -15 -8 -12 Q-4 -23 3 -16 Q11 -21 15 -11 Q24 -9 19 0 L5 18 L-4 18 Z',
  'M0 -22 A21 21 0 1 1 -.05 -22 Z M1 -10 A10 10 0 1 0 1.05 -10 Z'
];
function antigen(c,type=0,x=0,y=-27,s=1,monochrome=false) {
  const k=((Math.round(Number(type)||0)%5)+5)%5;
  at(c,x,y,s,0,()=>{
    const path=p(antigenOutlines[k]);
    if(monochrome){line(c,path,'#f1cf85',2.5);return;}
    cut(c,path,'#e5b561','#8d6b40',2.1);
    const highlights=['M-17 -8 Q-14 -14 -8 -12 M-15 10 Q-17 15 -12 16 M4 -7 Q6 -12 9 -10','M-14 -8 Q-7 -18 4 -19 M-15 6 Q-13 13 -8 15','M-2 -20 L-15 -1 L-4 18','M-17 6 L-13 -6 M-8 0 L-6 -9 M2 0 L4 -10','M-15 -5 Q-11 -17 0 -17 M-15 7 Q-12 14 -6 16'];
    line(c,highlights[k],'#f6d793',2);
    if(k===2){fill(c,'M-2 -20 L14 -3 L-3 18 L1 -1 Z','#c39251');line(c,'M-14 0 L1 -1 L14 -3','#8e744c',.8);}
    else if(k===0){line(c,'M-12 -7 Q-7 -3 -2 2 M-10 13 L-3 5 M12 11 L4 6','#b58247',1.25);}
    else if(k===1){arc(c,0,0,17,18,1.76,3.90,'#c09552',1.3);}
    else if(k===3){line(c,'M-15 -4 L-1 14 M-6 -11 L1 14 M6 -13 L3 14 M15 -8 L4 15','#b98749',1.3);}
    else {arc(c,0,0,15,16,.12,2.68,'#c19656',1.3);}
  });
}
function bcell(c,mode='hero',mark=0,target=0,isoform=0) {
  const friend=mode==='friend',memory=mode==='memory',sister=mode==='sister';
  const pal=friend?['#629d8b','#a7c4a1','#3e7662','#7ca78d']:memory?['#427d77','#adc7a2','#456b64','#91ad85']:['#408b84','#a8c7ab','#3b726a','#89b99f'];
  const hooks=[[-20,-13,-1.43],[-23,-27,-1.32],[-16,-40,-.70],[-6,-47,-.25],[9,-46,.29],[21,-36,1.04],[25,-23,1.40],[18,-10,1.79]];
  hooks.forEach(([x,y,a],i)=>hook(c,x,y,.72+(i===3?.18:0),a,i%2?pal[1]:'#e2c589'));
  cut(c,cellOutline,pal[0],'#3e6258',2.8);
  line(c,'M-19 -28 Q-18 -41 -8 -44 Q1 -48 10 -44',pal[1],2.1);
  cut(c,marrowNucleus,'#365e60','#35544d',1.2);
  line(c,'M-15 -28 Q-12 -37 -4 -38 M-13 -24 Q-11 -32 -4 -34 M-11 -21 Q-8 -28 -3 -30','#89a599',1.15);
  [[15,-27,3],[11,-15,2.3],[-7,-8,2.1],[0,-39,1.4],[-17,-14,1.7],[-1,-12,1.2],[6,-18,1.1]].forEach(([x,y,r],i)=>oval(c,x,y,r,r*.76,i%2?pal[3]:'#bcceab'));
  if(friend) {cut(c,'M-21 -15 Q-2 -12 21 -25 L22 -19 Q2 -4 -18 -8 Z','#ce8061','#93684f',.85);line(c,'M-16 -12 Q0 -9 16 -20','#e5a680',1.1);}
  else alphaMark(c,mark,13,-36,.78);
  if(mode==='hero'||sister){
    at(c,-7,-56,1,sister?(isoform-1)*.19:0,()=>{c.scale(sister?.88+.10*isoform:1,1);antigen(c,target,0,0,.23,true);});
  }
  if(sister) {for(let i=0;i<(Number(isoform)||0)+1;i++) oval(c,5+i*3,-7-i*.4,.8,.7,'#dfca8d');}
}
function macrophage(c) {
  const d='M-26 -8 Q-36 -3 -38 -12 Q-37 -18 -30 -21 Q-22 -26 -30 -33 Q-40 -40 -35 -44 Q-30 -49 -23 -43 Q-15 -37 -12 -43 Q-11 -56 -3 -55 Q3 -55 3 -47 Q4 -40 11 -45 L18 -51 Q30 -57 28 -47 L23 -34 Q23 -29 33 -31 Q41 -34 42 -25 Q43 -18 34 -16 Q23 -16 25 -10 Q28 0 21 0 Q15 1 10 -7 Q5 -10 -1 -3 Q-7 4 -16 0 L-19 -6 Q-23 -12 -26 -8 Z';
  cut(c,d,'#d1876a','#8e644f',3);cut(c,'M-14 -17 Q-22 -30 -12 -35 Q-6 -40 1 -34 Q6 -22 17 -25 Q24 -21 17 -15 Q0 -4 -14 -17 Z','#a76158','#825a4d',1.2);
  line(c,'M-30 -37 L-25 -35 M-8 -43 Q-8 -48 -5 -51 M24 -45 L20 -37 M28 -26 L35 -27','#f0b496',2.2);
  [[-22,-20,2.6],[-2,-39,2.3],[12,-36,3.5],[19,-12,2.5],[-12,-9,2]].forEach(([x,y,r],i)=>oval(c,x,y,r,r*.77,i%2?'#e4a478':'#e8be90','#b57a63',.7));
}
function helper(c) {
  const d='M-22 -4 Q-29 -16 -24 -30 Q-20 -45 -6 -46 Q12 -50 21 -36 Q28 -25 23 -11 Q21 1 9 3 Q-11 7 -22 -4 Z';cut(c,d,'#cba255','#8c754a',3.1);
  cut(c,'M-15 -19 Q-16 -34 -7 -38 Q7 -43 13 -30 Q15 -20 7 -13 Q-7 -5 -15 -19 Z','#927a53','#7b674d',1.3);
  line(c,'M-20 -24 Q-16 -39 -6 -42 M-13 -27 Q-9 -35 -6 -35','#ead5a0',1.8);
  [[17,-27],[-17,-8],[8,-4],[3,-42]].forEach(([x,y],i)=>oval(c,x,y,2.1,1.5,i%2?'#dabc77':'#edce86'));
  [[-23,-17,-1.4],[-13,-41,-.62],[12,-41,.66],[25,-23,1.4]].forEach(([x,y,r])=>at(c,x,y,.8,r,()=>{cut(c,'M-2 3 L-3 -4 L-6 -8 L-3 -9 L0 -6 L4 -9 L6 -7 L2 -3 L2 3 Z','#dcc897','#9e8358',.4);}));
}
function plasma(c,mark) {
  const d='M-28 -4 Q-34 -19 -24 -36 Q-13 -54 9 -53 Q26 -54 30 -39 Q38 -19 25 -6 Q7 11 -16 5 Z';
  cut(c,d,'#988d99','#736a71',3);
  const nucleusX=-15,nucleusY=-19;oval(c,nucleusX,nucleusY,11,14,'#63596b','#5f5562',1.5,-.17);
  for(let j=0;j<7;j++){const a=j*TAU/7;oval(c,nucleusX+7*Math.cos(a),nucleusY+10*Math.sin(a),1.9,2.1,'#9f91a0');}
  for(let j=0;j<5;j++){const x=j*3.2,y=j*2.3; c.save();c.translate(x,y);line(c,'M-4 -39 Q18 -43 18 -29 Q16 -16 3 -10','#dbbca8',2.7);line(c,'M-2 -36 Q14 -38 14 -28','#776e81',.8);c.restore();}
  line(c,'M-25 -32 Q-16 -49 1 -50','#dec8b8',2);alphaMark(c,mark,15,-6,.7);
}
function redCell(c) {
  c.save();c.rotate(-.20);
  oval(c,2,0,28,13,'#944e41');oval(c,0,-4,28,14,'#c56e58','#914d42',1.5);
  oval(c,-.2,-5,15,6.8,'#a45249','#d17d60',1);oval(c,2,-4.6,11.6,4.1,'#ac5f50');
  arc(c,-1,-4,24,10,3.58,5.86,'#ecc09a',2.1);arc(c,1,-6,16,7.4,.44,2.70,'#dc9a78',1.65);
  arc(c,1,0,23,8,.25,2.38,'#945046',1.7);c.restore();
}
function memoBook(c,pages=false) {
  const d='M-26 -25 Q-13 -32 0 -25 Q12 -32 24 -27 L29 -4 Q10 -7 1 0 Q-14 -7 -29 -3 Z';
  if(pages){for(let i=3;i>0;i--){c.save();c.translate(2*i,1.5*i);c.rotate(i*.06);cut(c,d,'#ddc091','#9b7e59',1.2);c.restore();}}
  cut(c,d,'#ecdaac','#987843',2);fill(c,'M-25 -24 Q-10 -29 0 -24 L1 -3 Q-15 -7 -26 -6 Z','#e2c89a');line(c,'M0 -25 L1 -2','#a78a59',1.8);
  line(c,'M-20 -20 Q-11 -24 -3 -20 M-19 -15 Q-12 -18 -7 -16 M5 -20 Q13 -24 20 -23 M6 -15 Q14 -18 21 -17','#b89e78',1.2);
}
function tab(c) {
  cut(c,'M-28 -10 L-12 -18 L-3 -27 L5 -29 L15 -24 L28 -9 L24 -5 L-24 -1 Z','#c99d60','#8e714c',2.2);
  line(c,'M-22 -8 L-10 -14 L-1 -23 L5 -25','#edd4a1',2.3);line(c,'M12 -20 L17 -11 M8 -17 L13 -8','#a27b4d',1.35);
}
function signal(c,teal=false) {
  for(const [i,x,y,s] of [[0,-19,-4,3.5],[1,-9,-9,4.3],[2,1,-20,4.7],[3,13,-29,5.5],[4,23,-31,3]]) {
    oval(c,x+1.2,y+1.5,s,s*.70,teal?'#618b72':'#a78857');oval(c,x,y,s,s*.72,teal?(i%2?'#83aaa0':'#adc098'):(i%2?'#d99c5d':'#e5ba6c'),teal?'#6a8974':'#a68452',.9);
  }
}
function vesicle(c,target) {
  cut(c,'M-29 -28 Q-27 -45 -7 -45 Q15 -47 27 -33 Q34 -13 16 -6 Q-4 4 -20 -8 Q-31 -17 -29 -28 Z','#779b87','#5c7968',2.8);
  cut(c,'M-22 -30 Q-11 -37 0 -32 Q10 -29 14 -38 L22 -31 Q18 -18 7 -16 Q-5 -11 -17 -16 Q-24 -20 -22 -30 Z','#bfbb90','#6f8974',1.4);
  antigen(c,target,-6,-24,.35);
  line(c,'M-25 -30 Q-23 -42 -9 -42 M-18 -23 Q-10 -17 -1 -21','#d4d3aa',2);line(c,'M-1 -21 L5 -24 L9 -22 L13 -25','#a86c55',3);
}
function mhc(c) {
  cut(c,'M-4 0 L-7 -17 L-18 -24 Q-23 -31 -17 -38 L-11 -35 Q-13 -30 -9 -29 L-1 -24 L4 -18 L5 -1 Z','#749a8a','#526e60',2.3);
  cut(c,'M4 0 L4 -13 L9 -22 L17 -27 Q22 -31 18 -36 L24 -39 Q31 -29 24 -21 L15 -15 L13 -1 Z','#98b5a0','#607b6b',2.1);
  cut(c,'M-14 -35 L-5 -37 L2 -33 L9 -35 L17 -32 L16 -28 L9 -29 L3 -27 L-4 -31 L-13 -30 Z','#d99072','#a66e55',1.1);
  line(c,'M-7 -35 L-3 -31 M0 -33 L4 -29 M8 -33 L12 -30','#f0c09a',1.2);
}
function antibody(c,v=0) {
  const d='M-3 1 L-4 -18 L-20 -34 L-16 -40 L-2 -28 L1 -26 L13 -40 L19 -36 L4 -17 L4 1 Z';
  cut(c,d,'#d4a760','#988052',2.2);line(c,'M-16 -36 L-1 -23 L15 -37 M0 -22 L.5 -3','#f3cf84',2);
  antigen(c,v,14,-40,.10,true);
}
function velum(c,marked) {
  cut(c,'M-24 -34 Q-6 -43 23 -39 L28 -9 Q3 -12 -21 -3 Z','#d3ceb0','#999370',1.2);
  fill(c,'M-18 -31 Q2 -37 17 -34 L21 -14 Q4 -17 -15 -10 Z','rgba(243,234,199,.55)');
  if(marked){at(c,2,-24,.47,0,()=>{cut(c,'M-12 -9 L-1 -17 L13 -12 L18 1 L11 12 L-4 15 L-15 5 Z','#a48691','#806c79',.9);line(c,'M-7 0 C-9 -9 2 -10 6 -5 C11 0 4 8 -1 7 Q-7 7 -7 0 Z','#e7c7bc',2.3);arc(c,1,-1,6,4,3.2,5.5,'#c4a1ab',1.2,-.3);});}
  line(c,'M-21 -31 Q-8 -37 9 -37','#f5e8bd',1.5);
}
function prop(c,kind,o,cfg) {
  const v=Number(o.variant)||0,mark=o.mark??cfg.mark??0;
  if(kind==='hero'||kind==='friend'||kind==='memory'||kind==='sister') bcell(c,kind,mark,cfg.target,v);
  else if(kind==='plasma') plasma(c,mark);
  else if(kind==='macrophage')macrophage(c);
  else if(kind==='helper')helper(c);
  else if(kind==='rbc')redCell(c);
  else if(kind==='antigen')antigen(c,v);
  else if(kind==='fdc')branch(c,0,0,.63);
  else if(kind==='fan')at(c,0,-1,.13,0,()=>{c.translate(-499,-368);fanPlate(c,true);});
  else if(kind==='mhc')mhc(c);
  else if(kind==='membrane')vesicle(c,cfg.target);
  else if(kind==='signal'||kind==='trail')signal(c,kind==='trail');
  else if(kind==='origin'||kind==='years')memoBook(c,kind==='years');
  else if(kind==='vellum')velum(c, Boolean(cfg.tags?.includes('ebv')||['trace','remains'].includes(cfg.step)));
  else if(kind==='tab')tab(c);
  else if(kind==='tonsil'){rosette(c,0,-18,19,['#a58074','#d3a48b','#eacead'],3);line(c,'M-14 -26 Q-8 -31 -2 -20 Q2 -16 6 -20','#bf8c79',2.8);}
  else if(kind==='antibody') antibody(c,cfg.target);
  else memoBook(c);
}
function sheet(width,height,density,draw) {
  const img=document.createElement('canvas');img.width=Math.ceil(width*density);img.height=Math.ceil(height*density);
  const g=img.getContext('2d');g.scale(density,density);g.lineCap='round';g.lineJoin='round';draw(g);return img;
}
const bloodCurves=[
  [[92,190],[204,138],[330,158],[291,213]],[[291,213],[272,241],[185,257],[150,285]],
  [[150,285],[86,359],[214,351],[258,353]],[[258,353],[342,354],[395,371],[445,429]]
];
function veinPoint(f) {
  const n=((f%1)+1)%1*bloodCurves.length,i=Math.floor(n),t=n-i,tt=1-t,pts=bloodCurves[i];
  return [0,1].map(j=>tt*tt*tt*pts[0][j]+3*tt*tt*t*pts[1][j]+3*tt*t*t*pts[2][j]+t*t*t*pts[3][j]);
}
const restingPlaces={river:[-.72,.30],node:[-.58,.26],recognition:[-.45,.42],garden:[-.51,.40],marrow:[-.60,.45],recall:[-.60,.31],tonsil:[-.63,.43]};
const largePieces=new Set(['hero','friend','memory','sister','plasma','macrophage','helper','fdc']);
function sizeOf(kind) {
  if(kind==='hero')return 1.28;
  if(kind==='antigen')return 1.12;
  if(kind==='rbc'||kind==='tab'||kind==='origin'||kind==='years')return 1.16;
  return largePieces.has(kind)?1.11:1.03;
}
/** Flat artwork has the same normalized page coordinates and object callbacks as the 3D spread. */
export function createFlatArt({host, onAction=()=>{}, onMove=()=>{}}) {
  const canvas=document.createElement('canvas'); canvas.setAttribute('aria-hidden','true');
  canvas.style.cssText='position:absolute;inset:0;display:block;width:100%;height:100%;touch-action:pan-y;';host.appendChild(canvas);
  const c=canvas.getContext('2d',{alpha:false});
  let cfg={stage:'river',step:'',target:0,mark:0,tags:[],objects:[],reduced:false};
  let box={w:1,h:1,scale:1,ox:0,oy:0},background,cacheKey='',clock=0;
  let moving=null,pos={x:-.72,z:.30},hinge=null,witness=null,lastDecoy=null,lastTime=0;
  let turn=null,hasScene=false,pendingArrival=null;
  let raf=0,wake=0,alive=true,visible=true,down=null,hitAreas=[],arrival=null;
  const sprites=new Map(),nodeSprites=new Map();
  function sprite(kind,o={}) {
    const taggedVellum=kind==='vellum' ? String(cfg.tags.includes('ebv'))+cfg.step : '';
    const key=[kind,o.variant??0,o.mark??cfg.mark,cfg.target,taggedVellum].join('/');
    if(!sprites.has(key)) {
      sprites.set(key,sheet(146,141,1.75,g=>{g.translate(72,112);prop(g,kind,o,cfg);}));
    }
    return sprites.get(key);
  }
  function piece(x,y,kind,o,s=1,rotation=0,tilt=1) {
    c.save();c.translate(x,y);c.rotate(rotation);c.scale(s,s*tilt);c.drawImage(sprite(kind,o),-72,-112,146,141);c.restore();
  }
  function shadow(x,y,s,tall=1) {
    c.save();c.translate(x,y);c.rotate(-.14);oval(c,6*s,-2*s,22*s,5*s,'rgba(77,67,45,.15)');
    if(tall)oval(c,12*s,-5*s,21*s,4.5*s,'rgba(91,73,48,.085)');c.restore();
  }
  function nodeFace(amount) {
    const age=cfg.stage==='recall';
    if(!nodeSprites.has(age))nodeSprites.set(age,sheet(390,330,1.2,g=>nodeLeaf(g,192,164,1,true,age)));
    let fold=amount??1;
    if(amount===undefined&&hinge){let t=clamp((clock-hinge)/.93,0,1);fold=1-Math.pow(1-t,3)*Math.cos(t*8.3);if(t===1)hinge=null;}
    c.save();c.translate(705,347);c.scale(1,.40+.60*fold);c.drawImage(nodeSprites.get(age),-192,-273,390,330);c.restore();
  }
  function decor() {
    if(cfg.stage==='node'||cfg.stage==='recall')nodeFace();
    else if(cfg.stage==='river'&&down?.handle?.id==='node-tab'&&down.amount>.04&&!cfg.tags.includes('nodeOpen'))nodeFace(down.amount*.77);
    if(cfg.stage==='river'||cfg.stage==='node'||cfg.stage==='recall'){
      const count=cfg.stage==='river'?9:4;
      c.save();c.clip(p(leftPage));
      for(let i=0;i<count;i++){
        const f=(clock*.017+i/count+.041)%1, [x,y]=veinPoint(f),[xx,yy]=veinPoint(f+.001);
        const angle=Math.atan2(yy-y,xx-x)*.47,sz=(.39+.13*(i%4))*(cfg.stage==='river'?1:.77);
        shadow(x+2,y+5,sz,0);piece(x,y,'rbc',{},sz,angle+(i%2)*.44,.50+.50*Math.abs(Math.cos(i*.69+clock*.48)));
      }c.restore();
    }
    if(cfg.tags?.includes('antibody')&&(cfg.stage==='marrow'||cfg.stage==='recall')) {
      if(cfg.stage==='recall'&&!['response','end'].includes(cfg.step))return;
      const obj=cfg.objects.find(o=>o.kind==='plasma')||{x:.14,z:-.18};const anchor=pageAt(obj.x,obj.z);
      for(let i=0;i<7;i++){const t=(i/7+clock*.037)%1;const xx=anchor.x+22+110*t, yy=anchor.y-34-56*t+4*Math.sin(t*7+i);piece(xx,yy,'antibody',{},.30+.05*Math.sin(i),-1+t*.55);}
    }
  }
  function deliverArrival() {
    const visit=pendingArrival;
    if(!visit||!visit.reached||visit.queued||!alive||!visible||document.hidden)return;
    visit.queued=true;
    queueMicrotask(()=>{
      visit.queued=false;
      if(pendingArrival!==visit||!alive||!visible||document.hidden)return;
      pendingArrival=null;
      visit.callback();
    });
  }
  function finishMotion() {
    moving=null;
    if(pendingArrival){pendingArrival.reached=true;deliverArrival();}
  }
  function updateMotion() {
    if(!moving)return false;
    const f=clamp((clock-moving.at)/moving.duration,0,1),k=f*f*(3-2*f);
    pos={x:moving.x+(moving.tx-moving.x)*k,z:moving.z+(moving.tz-moving.z)*k};
    if(f>=1){finishMotion();return false;}return true;
  }
  function actorPositions() {
    const objects=(cfg.objects||[]).map(o=>({...o}));
    const hasFriend=objects.some(o=>o.kind==='friend');
    if(cfg.stage==='node'&&!hasFriend)objects.push({kind:'friend',x:.49,z:-.19});
    if(cfg.stage==='garden'&&['trial','offer','helped'].includes(cfg.step))objects.push({kind:'sister',variant:cfg.selected??0,mark:cfg.mark,x:.08,z:.18});
    if(cfg.stage==='recall'&&['response','end'].includes(cfg.step))objects.push({kind:'plasma',mark:cfg.mark,x:.14,z:-.18});
    let f=objects.find(o=>o.kind==='friend');
    if(cfg.stage==='node'&&f&&(cfg.step==='witness'||cfg.step==='witnessed')){
      const d=lastDecoy||objects.find(o=>o.id==='decoy')||{x:.06,z:.09};
      const t=cfg.step==='witnessed'||cfg.reduced?1:clamp((clock-(witness??clock))/1.55,0,1),k=t*t*(3-2*t);
      f.x=f.x+(d.x+.06-f.x)*k;f.z=f.z+(d.z+.10-f.z)*k;f.carry=t>.90;
    }
    objects.push({kind:'hero',x:pos.x,z:pos.z,mark:cfg.mark});
    return objects.filter(o=>Number.isFinite(o.x)&&Number.isFinite(o.z)).sort((a,b)=>a.z-b.z+(a.kind==='hero'?.003:0)-(b.kind==='hero'?.003:0));
  }
  function turnPage() {
    if(!turn)return;
    const f=(clock-turn.at)/turn.duration;
    if(f>=turn.count){turn=null;return;}
    const t=clamp(f%1,0,1),swing=Math.cos(Math.PI*t),rise=Math.sin(Math.PI*t);
    const tip=500+378*swing,back=129-105*rise,front=450-74*rise;
    c.save();c.globalAlpha=Math.min(1,t*7,(1-t)*6)*.93;
    c.fillStyle=swing>0?'#ead9b1':'#d9c49e';c.strokeStyle='#947e59';c.lineWidth=1.4;
    c.shadowColor='rgba(66,52,38,.28)';c.shadowBlur=7+rise*4;c.shadowOffsetX=5;c.shadowOffsetY=4;
    c.beginPath();c.moveTo(500,145);c.bezierCurveTo(500+swing*118,132-rise*73,tip-swing*55,back-9,tip,back);
    c.lineTo(tip+swing*38,front);c.bezierCurveTo(tip-36*swing,front-17,500+swing*97,428-rise*34,500,470);
    c.closePath();c.fill();c.shadowColor='transparent';c.stroke();
    c.lineWidth=1;c.strokeStyle='rgba(143,113,71,.32)';c.beginPath();c.moveTo(506+4*swing,455);c.quadraticCurveTo(500+swing*129,414-rise*22,tip+swing*26,front-11);c.stroke();c.restore();
  }
  function draw() {
    if(!alive)return;
    const {w,h,scale,ox,oy}=box;
    if(!w||!h)return;
    const key=[cfg.stage,cfg.stage==='garden'?cfg.step:'',cfg.tags.includes('nodeOpen')].join('/');
    if(key!==cacheKey||!background){background=sheet(W,H,1.2,g=>plate(g,cfg));cacheKey=key;}
    const d=canvas.width/w;
    c.setTransform(d,0,0,d,0,0);c.fillStyle='#173b31';c.fillRect(0,0,w,h);
    if(oy>.5){c.drawImage(background,0,0,background.width,12,ox,0,W*scale,oy+1);c.drawImage(background,0,background.height-12,background.width,12,ox,h-oy-1,W*scale,oy+1);}
    if(ox>.5){c.drawImage(background,0,0,12,background.height,0,oy,ox+1,H*scale);c.drawImage(background,background.width-12,0,12,background.height,w-ox-1,oy,ox+1,H*scale);}
    c.translate(ox,oy);c.scale(scale,scale);
    c.lineJoin='round';c.lineCap='round';c.drawImage(background,0,0,W,H);decor();const walking=updateMotion();hitAreas=[];
    if(arrival&&!cfg.reduced){const age=clock-arrival.at;if(age>.9)arrival=null;else {const atPos=pageAt(arrival.x,arrival.z);c.save();c.globalAlpha=(1-age/.9)*.7;c.strokeStyle='#9f8151';c.lineWidth=2;c.setLineDash([4,5]);c.beginPath();c.ellipse(atPos.x,atPos.y,13,5,0,0,TAU);c.stroke();c.restore();}}
    for(const o of actorPositions()){
      const atPos=pageAt(o.x,o.z),isHero=o.kind==='hero';
      const s=sizeOf(o.kind)*(.94+.09*o.z);
      shadow(atPos.x,atPos.y,s,largePieces.has(o.kind));
      const sway=cfg.reduced?0:(isHero&&walking?.045*Math.sin(clock*12):.015*Math.sin(clock*.91+o.x*8));
      const bob=isHero&&walking&&!cfg.reduced?Math.abs(Math.sin(clock*13))*1.8:0;
      const drag=down?.handle?.id===o.id&&o.id?(down.amount||0):0;
      piece(atPos.x+drag*5,atPos.y-bob-drag*3,o.kind,o,s,sway+drag*.14,1-drag*.11);
      if(o.carry){const k=Number(lastDecoy?.variant??((cfg.target+1)%3));piece(atPos.x-23*s,atPos.y-1*s,'antigen',{variant:k},s*.57,-.32);}
      if(o.kind==='friend'&&cfg.tags.includes('ebv')&&(cfg.stage==='recall'||(cfg.stage==='tonsil'&&cfg.step==='remains')))piece(atPos.x+16*s,atPos.y+2*s,'vellum',{},s*.58,.13);
      if(o.id){const cy=atPos.y-(largePieces.has(o.kind)?25:o.kind==='rbc'?6:17)*s;
        hitAreas.push({o,x:atPos.x,y:cy,r:Math.max(25*s,Math.min(46,16/Math.max(.2,scale)))});}
    }
    turnPage();
  }
  function queue(immediate=false) {
    if(!alive||!visible||document.hidden)return;
    if(immediate){clearTimeout(wake);wake=0;if(!raf)raf=requestAnimationFrame(tick);return;}
    if(wake||raf||cfg.reduced)return;
    const fast=Boolean(moving||hinge||turn||(cfg.step==='witness'&&clock-(witness??clock)<1.7));
    const ambient=cfg.stage==='river'||cfg.stage==='node'||cfg.stage==='recall'||(cfg.stage==='marrow'&&cfg.tags.includes('antibody'));
    if(fast||ambient||arrival)wake=setTimeout(()=>{wake=0;if(!raf)raf=requestAnimationFrame(tick);},fast?32:135);
  }
  function tick(t) {
    raf=0;
    if(!alive||!visible||document.hidden)return;
    if(lastTime)clock+=Math.min(.18,(t-lastTime)/1000);lastTime=t;
    draw();queue();
  }
  function measure() {
    if(!alive)return;
    const r=host.getBoundingClientRect(),w=Math.max(1,r.width),h=Math.max(1,r.height);
    // Keep the hinge-to-object projection identical to the one used for selection.
    const scale=Math.min(w/W,h/H),d=Math.min(window.devicePixelRatio||1,1.7);
    box={w,h,scale,ox:(w-W*scale)/2,oy:(h-H*scale)/2};
    if(canvas.width!==Math.round(w*d)||canvas.height!==Math.round(h*d)){canvas.width=Math.max(1,Math.round(w*d));canvas.height=Math.max(1,Math.round(h*d));}
    draw();queue();
  }
  function moveTo(x,z,onArrive) {
    if(!Number.isFinite(x)||!Number.isFinite(z)||!alive)return;
    // Stop by the model so its silhouette stays readable after arrival.
    const object=cfg.objects.find(o=>Math.abs(x-o.x)<.001&&Math.abs(z-o.z)<.001);
    const offsetX=object?(x>0?-.11:.11):0;
    const offsetZ=object ? (object.kind==='antigen' ? .12 : .11) : 0;
    const tx=clamp(x+offsetX,-1,1),tz=clamp(z+offsetZ,-1,1);updateMotion();
    pendingArrival=typeof onArrive==='function'?{callback:onArrive,reached:false,queued:false}:null;
    const distance=Math.hypot(tx-pos.x,tz-pos.z);
    if(cfg.reduced||distance<.002){pos={x:tx,z:tz};finishMotion();draw();return;}
    moving={x:pos.x,z:pos.z,tx,tz,at:clock,duration:.18+Math.min(1.10,distance*.55)};
    arrival={x:tx,z:tz,at:clock};queue(true);
  }
  function apply(next={}) {
    if(!alive)return;
    const old=cfg;cfg={...cfg,...next};
    if(!Array.isArray(cfg.objects))cfg.objects=[];if(!Array.isArray(cfg.tags))cfg.tags=[];
    if(old.stage!==cfg.stage){
      pendingArrival=null;
      const sameSpread=new Set(['river','node']);
      if(hasScene&&!cfg.reduced&&!(sameSpread.has(old.stage)&&sameSpread.has(cfg.stage)))turn={at:clock,duration:cfg.stage==='recall'?.27:.38,count:cfg.stage==='recall'?3:1};
      else turn=null;
      const anchor=restingPlaces[cfg.stage]||restingPlaces.river;pos={x:anchor[0],z:anchor[1]};moving=null;arrival=null;witness=null;
      hinge=old.stage==='river'&&cfg.stage==='node'&&!cfg.reduced?clock+.0001:null;
      if(cfg.stage==='node')lastDecoy=null;
    }
    if(cfg.stage==='node'){
      const d=cfg.objects.find(o=>o.id==='decoy');if(d)lastDecoy={...d};
      if(cfg.step==='witness'&&(old.step!=='witness'||old.stage!=='node'))witness=clock;
    }
    if(cfg.reduced){if(moving){pos={x:moving.tx,z:moving.tz};finishMotion();}hinge=null;turn=null;arrival=null;clearTimeout(wake);wake=0;}
    hasScene=true;draw();queue(true);
  }
  function point(e) {const rect=canvas.getBoundingClientRect();return {x:(e.clientX-rect.left-box.ox)/box.scale,y:(e.clientY-rect.top-box.oy)/box.scale};}
  function hit(q) {
    let winner=null,best=Infinity;
    for(const a of hitAreas){const dist=Math.hypot(q.x-a.x,(q.y-a.y)*.92)/a.r;
      if(dist<1.12&&dist<=best){winner=a.o;best=dist;}}
    return winner;
  }
  const handles=new Set(['tab','fan','vellum','years','membrane']);
  const pointerDown=e=>{if(e.button!==0)return;const o=hit(point(e));down={x:e.clientX,y:e.clientY,id:e.pointerId,handle:handles.has(o?.kind)?o:null,amount:0};if(down.handle)canvas.setPointerCapture?.(e.pointerId);};
  const pointerCancel=()=>{down=null;queue(true);};
  const pointerMove=e=>{
    if(down?.handle&&!cfg.reduced){down.amount=clamp(Math.hypot(e.clientX-down.x,e.clientY-down.y)/56,0,1);queue(true);}
    if(e.pointerType==='mouse')canvas.style.cursor=hit(point(e))?'pointer':'default';
  };
  const pointerUp=e=>{
    if(!down||e.pointerId!==down.id)return;
    const moved=Math.hypot(e.clientX-down.x,e.clientY-down.y),picked=down.handle;down=null;queue(true);if(moved>12&&!picked)return;
    const at=point(e),o=picked||hit(at);
    if(o){moveTo(o.x,o.z);onAction(o.id);}
    else {if(at.x<40||at.x>960||at.y<80||at.y>475)return;const where=unproject(at.x,at.y);moveTo(where.x,where.z);onMove(where);}
  };
  canvas.addEventListener('pointerdown',pointerDown);canvas.addEventListener('pointermove',pointerMove);canvas.addEventListener('pointerup',pointerUp);canvas.addEventListener('pointercancel',pointerCancel);
  const changeVisibility=()=>{lastTime=0;if(visible&&!document.hidden){deliverArrival();queue(true);}else{clearTimeout(wake);wake=0;cancelAnimationFrame(raf);raf=0;}};
  const intersection=typeof IntersectionObserver==='function'?new IntersectionObserver(entries=>{visible=entries.some(e=>e.isIntersecting);changeVisibility();}):null;
  intersection?.observe(host);
  const resize=typeof ResizeObserver==='function'?new ResizeObserver(measure):null;
  if(resize)resize.observe(host);else window.addEventListener('resize',measure);
  document.addEventListener('visibilitychange',changeVisibility);measure();
  return {setScene:apply,setState:apply,moveTo,project(x,z){const a=hitAreas.find(h=>Math.abs(h.o.x-x)<.001&&Math.abs(h.o.z-z)<.001)||pageAt(x,z);return {x:(box.ox+a.x*box.scale)/box.w,y:(box.oy+a.y*box.scale)/box.h};},destroy(){
    alive=false;pendingArrival=null;clearTimeout(wake);cancelAnimationFrame(raf);intersection?.disconnect();resize?.disconnect();window.removeEventListener('resize',measure);document.removeEventListener('visibilitychange',changeVisibility);
    canvas.removeEventListener('pointerdown',pointerDown);canvas.removeEventListener('pointermove',pointerMove);canvas.removeEventListener('pointerup',pointerUp);canvas.removeEventListener('pointercancel',pointerCancel);canvas.remove();sprites.clear();nodeSprites.clear();background=null;
  }};
}
