// Hand-printed stadium plate. A 910 × 565 mm sheet uses six matte inks, with a
// warm cut edge on left-facing folds. All animation receives the match clock.
// Camera basis and paper layers are identical for either eye and every retry.
const PAGE_W = 910;
const PAGE_H = 565;
const CREAM = '#f4e8b9';
const INK = '#192d35';
const TAU = Math.PI * 2;
const saturate = n => Math.max(0, Math.min(1, n || 0));
const mix = (a, b, v) => a + (b - a) * v;
const mixPoint = (a, b, v) => [mix(a[0], b[0], v), mix(a[1], b[1], v)];
const noise = n => { const a = Math.sin(n * 234.63 + 16.15) * 45218.75; return a - Math.floor(a); };
function layout(w, h) {
  const scale = Math.min(w / 850, h / 526);
  return {scale, x: (w - PAGE_W * scale) / 2, y: (h - PAGE_H * scale) / 2};
}
function paperPoint(x, y, z) {
  return [462 + 36.5 * x - 12.8 * z, 346 + 4.85 * x + 15.1 * z - 32 * y];
}
export function fieldProject(w, h, x, y, z) {
  const v = layout(w, h);
  const p = paperPoint(x, y, z);
  return {x: v.x + p[0] * v.scale, y: v.y + p[1] * v.scale};
}
function polygon(c, points, fill, border, weight = 1) {
  c.beginPath();
  c.moveTo(...points[0]);
  for (let i = 1; i < points.length; i++) c.lineTo(...points[i]);
  c.closePath();
  if (fill) { c.fillStyle = fill; c.fill(); }
  if (border) { c.strokeStyle = border; c.lineWidth = weight; c.stroke(); }
}
function line(c, points, ink, width = 1) {
  c.beginPath();
  c.moveTo(...points[0]);
  for (let i = 1; i < points.length; i++) c.lineTo(...points[i]);
  c.lineWidth = width;
  c.strokeStyle = ink;
  c.stroke();
}
function ellipse(c, x, y, rx, ry, fill, angle = 0) {
  c.beginPath();
  c.ellipse(x, y, Math.max(.02, rx), Math.max(.02, ry), angle, 0, TAU);
  c.fillStyle = fill;
  c.fill();
}
function quad(c, x0, x1, z0, z1, y, ink) {
  polygon(c, [paperPoint(x0,y,z0),paperPoint(x1,y,z0),paperPoint(x1,y,z1),paperPoint(x0,y,z1)], ink);
}
function fascia(c, a, b, height, top, front) {
  polygon(c, [a,b,[b[0],b[1]+height],[a[0],a[1]+height]], front);
  line(c,[a,b],top,1.5);
}
function star(c,x,y,r,color) {
  polygon(c,[[x,y-r*1.7],[x+r*.3,y-r*.3],[x+r,y],[x+r*.3,y+r*.3],[x,y+r*1.7],[x-r*.28,y+r*.3],[x-r,y],[x-r*.28,y-r*.3]],color);
}
function landscape(c) {
  const sky = c.createLinearGradient(0,-170,0,365);
  sky.addColorStop(0,'#102735'); sky.addColorStop(.55,'#213e50'); sky.addColorStop(1,'#52776d');
  c.fillStyle = sky; c.fillRect(-900,-800,2800,1900);
  // Inlaid sheets in the sky have gently slanting inked edges.
  polygon(c,[[-300,92],[165,35],[366,41],[607,-24],[-300,-80]],'#243e4e');
  polygon(c,[[-80,118],[214,78],[503,89],[829,32],[1220,13],[1240,92],[764,83],[545,112],[166,98],[-80,128]],'#2b4858');
  for (let i=0;i<75;i++) {
    const x=noise(i+11)*1250-160, y=noise(i+87)*235-54, s=noise(i+33);
    if(s>.9) star(c,x,y,1.5+s*1.35,'#ebcf91');
    else ellipse(c,x,y,.55+s*.7,.6+s*.45,s>.5?'#d5c799':'#78918b');
  }
  // The moon uses actual clipped ink facets and an indented edge.
  c.save(); c.translate(697,80);
  ellipse(c,2.5,3.5,25,25,'#354c54'); ellipse(c,0,0,25,25,'#f1cb77');
  c.beginPath(); c.arc(0,0,25,0,TAU); c.clip();
  polygon(c,[[-30,-9],[-12,-20],[16,-25],[28,-12],[12,-16],[-1,-15]],'#fbdfa0');
  polygon(c,[[8,28],[8,17],[16,10],[22,-5],[29,-10],[31,28]],'#d8a65b');
  ellipse(c,-8,3,4,2.5,'#dbb667',-.4); ellipse(c,4,-10,2.8,1.7,'#e2bb6a'); ellipse(c,3,13,5.2,2,'#dfb668',-.28);
  c.restore();
  // Far and near Brazilian coastal ridgelines, each cut on its own fold.
  polygon(c,[[-600,247],[-220,206],[-14,195],[21,180],[58,176],[95,149],[116,143],[161,166],[221,171],[278,147],[311,140],[336,155],[391,145],[443,123],[463,116],[485,124],[516,149],[554,150],[573,138],[613,127],[637,130],[685,151],[735,143],[780,120],[803,113],[823,117],[864,155],[914,149],[962,163],[1009,144],[1340,135],[1550,350],[-600,350]],'#49606c');
  polygon(c,[[-600,243],[-40,218],[19,207],[66,197],[124,147],[143,122],[157,112],[171,111],[192,128],[207,162],[226,172],[273,177],[299,165],[324,169],[344,155],[363,153],[397,172],[437,185],[477,177],[503,156],[519,155],[541,170],[588,177],[625,153],[646,132],[667,126],[683,136],[699,168],[730,182],[776,179],[810,150],[829,142],[863,168],[911,174],[982,155],[1200,167],[1450,145],[1450,335],[-600,335]],'#344c5b');
  polygon(c,[[115,153],[143,121],[158,112],[169,113],[153,130],[136,159],[121,169]],'#526b70');
  polygon(c,[[623,154],[646,132],[667,126],[650,139],[631,163]],'#52696c');
  polygon(c,[[734,188],[768,164],[793,155],[819,161],[791,164],[751,192]],'#425d68');
  const city = ['#3b555d','#496269','#425964','#566568'];
  for(let i=0;i<80;i++) {
    const x=i*13.7-84+noise(i+50)*5, base=230+9*Math.sin(x*.008), ww=7+noise(i+330)*15, hh=8+noise(i+160)*34;
    polygon(c,[[x,base],[x,base-hh],[x+ww*.27,base-hh-2],[x+ww,base-hh+1],[x+ww,base]],city[i%4]);
    if (i%3!==0) {
      for(let k=0;k<3;k++) if(noise(i*4+k)>.42) {
        c.fillStyle=k===1?'#c4b079':'#9ca78d'; c.fillRect(x+3+(k%2)*5,base-hh+5+6*(k>>1),1.8,1.5);
      }
    }
  }
  // A dark base under the book makes the close cut edge stand forward.
  polygon(c,[[-600,268],[100,244],[380,232],[730,258],[1100,240],[1500,211],[1500,850],[-600,850]],'#25444c');
  polygon(c,[[-600,375],[123,272],[493,275],[910,319],[1390,255],[1500,515],[-600,705]],'#29494c');
  for(let i=0;i<26;i++){
    const x=-125+noise(i+455)*1180, y=252+noise(i+456)*174;
    line(c,[[x,y],[x+9+noise(i)*16,y-1]],'#3b5757',.8);
  }
}
function palm(c, x,y,s,mirror=1) {
  c.save(); c.translate(x,y); c.scale(s*mirror,s);
  polygon(c,[[-3,0],[-1,-14],[5,-32],[6,-52],[4,-72],[7,-74],[11,-52],[10,-32],[6,-10],[7,0]],'#254344','#182f36',1);
  for(let i=0;i<5;i++) line(c,[[2+i*.75,-13-i*10],[5+i*.55,-14-i*10]],'#59716a',1);
  for(let k=0;k<8;k++){
    const direction=k<4?-1:1, layer=k%4;
    const pts=[[7,-72],[7+direction*(10+layer*2),-86+layer*8],[7+direction*(25+layer*3),-87+layer*10],[7+direction*(34+layer*1.4),-77+layer*11]];
    polygon(c,[...pts,[7+direction*(25+layer*2),-78+layer*8],[7+direction*(22+layer*2),-78+layer*8],[7+direction*(13+layer),-77+layer*5],[7+direction*12,-74+layer*4]],layer%2?'#2d5750':'#3b6759');
  }
  c.restore();
}
function tower(c,x,z,height,mir=1) {
  const [cx,cy]=paperPoint(x,0,z), h=height;
  c.save(); c.translate(cx,cy);
  polygon(c,[[-10,2],[-4,-h+12],[1,-h+8],[-4,2]],'#849287','#213a42',1.2);
  polygon(c,[[10,2],[5,-h+11],[9,-h+9],[15,2]],'#596f6c','#243d44',1.2);
  for(let j=0;j<7;j++) {
    const yy=-j*(h-12)/7, yy2=-(j+1)*(h-12)/7;
    const a=mix(-6,-2,j/7), b=mix(10,6,j/7);
    line(c,[[a,yy],[b,yy2],[a+1,yy2]],'#81948a',2.3);
    line(c,[[b,yy],[a+1,yy2]],'#4c6868',1.45);
  }
  c.save(); c.translate(0,-h); c.rotate(mir*.095);
  polygon(c,[[-21,-15],[23,-15],[27,-9],[24,4],[-22,4],[-25,0]],'#314a52','#1b3038',1.15);
  polygon(c,[[-25,-15],[-21,-19],[22,-19],[25,-15]],'#899b8a');
  // Two orderly rows of pasted lamp lenses.
  for(let j=0;j<2;j++) for(let i=0;i<5;i++) {
    const xx=-19.5+i*8.5, yy=-11+j*7;
    polygon(c,[[xx-3.1,yy-2.3],[xx+2.6,yy-2.3],[xx+3.4,yy+1.8],[xx-2.4,yy+2.4]],'#f8dea0');
    line(c,[[xx-2.8,yy+1.8],[xx+2.6,yy+1.4]],'#cda568',1);
  }
  c.restore(); c.restore();
}
const jerseyPrint=['#e7b958','#e4d39a','#2d7b75','#dc8665','#749885','#d99e4c','#5f8c9d','#d2b679'];
const skinPrint=['#b67550','#86553e','#cb946c','#a16b50','#d5a275'];
function fan(c,x,y,size,seed,cheer) {
  const shirt=jerseyPrint[Math.floor(noise(seed+130)*jerseyPrint.length)], skin=skinPrint[Math.floor(noise(seed+401)*skinPrint.length)];
  const sx=(.85+noise(seed+413)*.3)*size, sy=(.8+noise(seed+49)*.45)*size;
  const rise=cheer*(.7+noise(seed+441)*.7), swing=(noise(seed+393)-.5)*3;
  c.save(); c.translate(x, y-rise*2); c.scale(sx,sy);
  polygon(c,[[-2.2,-4.8],[-3.1,-4.7],[-4.1,-1.2],[-6.2,-.2-rise*4],[-6.5,-1.4-rise*4.1],[-5.2,1.9-rise*2.5],[-3.2,1.2],[-2,0],[2.2,.3],[3.3,1.5],[5.5,-.8-rise*2.5],[6.1,-2.5-rise*4.1],[4.9,-2.2-rise*3.9],[3.3,-1.7],[2.6,-4.6]],shirt);
  polygon(c,[[-2.4,-5.3],[-1.5,-5.7],[-1.65,-7.2],[-1.9,-8.4],[-.8,-9.1],[.8,-9.4],[2.25,-8.2],[2.05,-6.8],[1.1,-5.7],[1.4,-5.1]],skin);
  polygon(c,[[-2,-7.8],[-2,-8.9],[-.8,-9.8],[1,-9.95],[2.4,-8.8],[2.25,-8.05],[.65,-8.6],[-.05,-8.3]],'#263c3e');
  polygon(c,[[-2.1,-.5],[-1.4,-4.8],[-1,-4.6],[-.5,-.4]],'#ffffff24');
  if(seed%6===0) {
    line(c,[[-2.5,-3.9],[2.1,-3+swing*.1]],'#e8dbaf',.9);
  }
  c.restore();
}
function terrace(c,a,b,away,seed,cheer,rows=4) {
  const [dx,dz]=away;
  const at=(tx,off,h)=>paperPoint(mix(a[0],b[0],tx)+dx*off,h,mix(a[1],b[1],tx)+dz*off);
  const treads=['#426765','#527b6a','#5a796e','#648272'];
  // Far tier first. The linked crowd strips pivot upward at contact.
  for(let r=rows-1;r>=0;r--){
    const off=(r+.35)*.43, lift=Math.max(0,Math.min(1,cheer*1.35-r*.09));
    const height=.26+r*.38+lift*.18;
    const A=at(0,off,height),B=at(1,off,height),D=at(0,off+.44,height),E=at(1,off+.44,height);
    polygon(c,[A,B,E,D],treads[r%4], '#314e51',.75);
    fascia(c,A,B,4+r*.2,'#a9ac80','#345754');
    if(r===rows-1) line(c,[D,E],'#a9a77e',1.6);
    const distance=Math.hypot(B[0]-A[0],B[1]-A[1]), count=Math.floor(distance/11.1);
    for(let i=0;i<count;i++){
      const t=(i+.32+(r%2)*.32)/Math.max(1,count);
      if (Math.abs((t*5)%1-.5)<.046) continue;
      const [fx,fy]=at(t,off+.25,height+.025);
      fan(c,fx,fy,1.08+(seed%3)*.025+i%4*.025,seed+r*113+i, lift);
    }
    // The ends of each stair flight alternate lit and shaded folded paper.
    for(let g=0;g<5;g++){
      const tt=(g+.5)/5, A0=at(tt-.009,off+.02,height+.01), B0=at(tt+.009,off+.02,height+.01);
      polygon(c,[A0,B0,at(tt+.009,off+.43,height+.01),at(tt-.009,off+.43,height+.01)],'#b2a97d');
    }
  }
  const A=at(0,0,.31), B=at(1,0,.31),D=at(0,0,-.04),E=at(1,0,-.04);
  polygon(c,[A,B,E,D],'#547b70','#314f4e',1);
  line(c,[A,B],'#d0c590',1.8);
  for(let i=0;i<8;i++){
    const t=(i+.25)/8, l=.052;
    polygon(c,[at(t,0,.23),at(t+l,0,.23),at(t+l-.005,0,.03),at(t-.004,0,.03)], i%3===0?'#d7b65f':i%3===1?'#699d85':'#d7cda2');
  }
}
function banner(c,x0,x1,z,y,caption) {
  const a=paperPoint(x0,y,z), b=paperPoint(x1,y,z);
  c.save(); c.transform((b[0]-a[0])/106,(b[1]-a[1])/106,0,1,a[0],a[1]);
  polygon(c,[[0,0],[106,0],[105,14],[76,12],[39,15],[0,13]],'#e1b550','#6a704f',.8);
  polygon(c,[[1,0],[104,0],[97,2],[16,2]],'#f7d786');
  for(const q of [7,95]) polygon(c,[[q,7],[q+4,4],[q+8,7],[q+4,10]],'#4d815f');
  c.fillStyle='#2e5b52'; c.textAlign='center'; c.textBaseline='top'; c.font='bold 10px sans-serif'; c.fillText(caption,53,1);
  c.restore();
}
function flags(c, time) {
  const points=[[-8.84,-6.0,1.1],[-5.8,-7.67,.95],[-3.72,-7.73,1.0],[1.3,-7.63,.91],[3.33,-7.82,1.03],[5.55,-7.67,.9],[8.15,-7.52,1.07]];
  points.forEach(([x,z,s],i)=>{
    const [a,b]=paperPoint(x,1.35,z), ht=15+13*s+i%3*2;
    line(c,[[a,b],[a,b-ht]],'#ac9e76',1.6);
    const wave=1.5*Math.sin(time*1.45+i*1.4),w=18*s,h=10*s;
    c.save(); c.translate(a,b-ht+1);
    polygon(c,[[0,0],[w*.47,wave-2],[w,wave+.3],[w-2,h-1],[w*.48,h+wave-1.5],[0,h]],i%3===0?'#347f62':i%3===1?'#dfb656':'#549799','#45574f',.5);
    if(i%3===0){
      polygon(c,[[2,h*.47],[w*.49,1],[w-3,h*.4+wave*.4],[w*.49,h-1]],'#eac559');
      ellipse(c,w*.48,h*.47,2.5,2.15,'#395d76');
    } else line(c,[[2,2.6],[w*.45,1.4+wave],[w-3,3+wave]],'#e5d39b',1.15);
    c.restore();
  });
}
function bunting(c,time){
  const L=[184,103],R=[820,143], ctrl=[490,227];
  const at=t=>[(1-t)*(1-t)*L[0]+2*(1-t)*t*ctrl[0]+t*t*R[0],(1-t)*(1-t)*L[1]+2*(1-t)*t*ctrl[1]+t*t*R[1]];
  const rope=[];
  for(let i=0;i<=32;i++) rope.push(at(i/32));
  line(c,rope,'#65847c',1.1);
  const inks=['#ddb958','#45968a','#cf8164','#88a775','#e2cd99'];
  for(let i=1;i<30;i++){
    const t=i/30,a=at(t-.007),b=at(t+.007),m=at(t),flap=Math.sin(time*1.6+i*.66);
    polygon(c,[a,b,[m[0]+1.4*flap,m[1]+7.1+(i%3)*1.4]],inks[i%5],'#435e58',.4);
  }
}
function turf(c){
  const x0=-8.65,x1=8.65,z0=-5.05,z1=6.30;
  const edge=(y)=>[paperPoint(x0,y,z0+.42),paperPoint(x0+.32,y,z0),paperPoint(x1-.42,y,z0),paperPoint(x1,y,z0+.41),paperPoint(x1,y,z1-.43),paperPoint(x1-.4,y,z1),paperPoint(x0+.4,y,z1),paperPoint(x0,y,z1-.39)];
  const base=edge(0);
  const b1=edge(-.2),b2=edge(-.37),b3=edge(-.47);
  polygon(c,base.map(([x,y])=>[x+8,y+18]),'#193c40');
  polygon(c,b3,'#5b6153','#314741',1.3); polygon(c,b2,'#ac8456','#514e41',.9);
  polygon(c,b1,'#d1b079','#89775b',.8); polygon(c,base,'#80a77a','#656e50',1.4);
  const corner=(s,off)=>paperPoint(s*(8.65-off),0,6.30);
  const rim1=corner(-1,.45),rim2=corner(1,.45);
  for(let i=0;i<129;i++) {
    const [x,y]=mixPoint(rim1,rim2,i/129);
    line(c,[[x,y+7.4],[x+2.2,y+10.2]],i%4===0?'#d0ac71':'#94734f',.8);
  }
  c.save(); c.beginPath(); c.moveTo(...base[0]); base.slice(1).forEach(p=>c.lineTo(...p)); c.closePath(); c.clip();
  const colors=['#85a876','#77a276','#82a674','#72a076','#83a777','#76a276','#85a877','#78a578'];
  for(let i=0;i<9;i++) quad(c,x0,x1,z0+(z1-z0)*i/9,z0+(z1-z0)*(i+1.002)/9,.005,colors[i%colors.length]);
  // Broad off-register wedges and sparse inked blades, printed into the grass.
  polygon(c,[paperPoint(-8.5,0,-4.7),paperPoint(-5.7,0,-4.7),paperPoint(3.8,0,6.3),paperPoint(-.6,0,6.3)],'#e2d5880b');
  for(let i=0;i<560;i++) {
    const x=mix(-8.6,8.65,noise(i+938)), z=mix(-5.05,6.30,noise(i+2813));
    const q=paperPoint(x,.009,z), d=1.2+noise(i+4521)*3.2;
    line(c,[q,[q[0]+d,q[1]+d*.12]],i%3===0?'#c2c79865':'#628c6974',.65+noise(i+241)*.65);
  }
  const pitch=(pts,ww=1.9)=>line(c,pts.map(([x,z])=>paperPoint(x,.024,z)),'#efe7bf',ww);
  pitch([[-7.98,6.32],[-7.98,-3.4],[7.98,-3.4],[7.98,6.32]]);
  pitch([[-6.48,-3.4],[-6.48,4.78],[6.48,4.78],[6.48,-3.4]]);
  pitch([[-5.14,-3.4],[-5.14,-1.63],[5.14,-1.63],[5.14,-3.4]],1.65);
  const arc=[];
  const alpha=Math.asin((4.78-3.8)/1.86);
  for(let i=0;i<=24;i++){const v=mix(alpha,Math.PI-alpha,i/24); arc.push([1.86*Math.cos(v),3.8+1.86*Math.sin(v)]);}
  pitch(arc,1.65);
  for(let s of [-1,1]){
    const arr=[]; for(let i=0;i<=6;i++){const a=(Math.PI/2)*i/6;arr.push([s*(7.98-.38*Math.sin(a)),-3.4+.38*Math.cos(a)]);}
    pitch(arr,1.5);
  }
  const spot=paperPoint(0,.04,3.8); ellipse(c,spot[0],spot[1],3.2,1.35,'#f1e7b9',.1);
  // A printed crease in the page, quieter than the court markings.
  line(c,[paperPoint(0,.016,-5.05),paperPoint(0,.016,6.3)],'#567e6549',1.2);
  line(c,[paperPoint(.045,.016,-5.05),paperPoint(.045,.016,6.3)],'#b0bd8460',.8);
  c.restore();
  line(c,[base[5],base[6],base[7]],'#e6c694',1.25);
}
function net(c){
  const z=-3.4,back=-4.46,H=3.1,X=4.3;
  const rearH=2.27;
  const p=(x,y,zz=z)=>paperPoint(x,y,zz);
  // Skewed side shadows and the soft grid shadow lie ON the grass.
  const shade=[p(-X,0),p(-X+.55,0,-4.73),p(X+1.42,0,-4.53),p(X+.28,0)];
  polygon(c,shade,'#3d735c47');
  polygon(c,[p(-X,H),p(-X,rearH,back),p(X,rearH,back),p(X,H)],'#d6dbbd25');
  polygon(c,[p(-X,0,back),p(-X,rearH,back),p(X,rearH,back),p(X,0,back)],'#d5debc27');
  polygon(c,[p(X,0),p(X,H),p(X,rearH,back),p(X,0,back)],'#d2d5b737');
  // Crossed open paper net strips, clipped to the back face.
  c.save();
  const clip=[p(-X,0,back),p(-X,rearH,back),p(X,rearH,back),p(X,0,back)];
  c.beginPath();c.moveTo(...clip[0]);clip.slice(1).forEach(q=>c.lineTo(...q));c.closePath();c.clip();
  for(let i=-13;i<=18;i++){
    const xx=i*.56;
    line(c,[p(xx,0,back),p(xx+1.19,rearH,back)],'#edebc9b5',.95);
    line(c,[p(xx,0,back),p(xx-1.19,rearH,back)],'#d4dec2ab',.9);
  }
  c.restore();
  for(let i=0;i<=22;i++){
    const x=mix(-X,X,i/22);
    line(c,[p(x,H),p(x,rearH,back)],'#e6e2beac',1);
  }
  for(let j=0;j<=3;j++) {
    const k=j/3;
    line(c,[p(-X,mix(H,rearH,k),mix(z,back,k)),p(X,mix(H,rearH,k),mix(z,back,k))],'#e7e5c5af',.95);
  }
  for(let side of [-X,X]){
    const x=side;
    for(let j=0;j<=6;j++){
      const k=j/6;line(c,[p(x,k*H),p(x,k*rearH,back)],'#e4e5c5c7',.95);
    }
    for(let j=0;j<=4;j++){
      const k=j/4,zp=mix(z,back,k); line(c,[p(x,0,zp),p(x,mix(H,rearH,k),zp)],'#e0dfbbbd',.95);
    }
    line(c,[p(x,0),p(x,0,back),p(x,rearH,back),p(x,H)],'#a8b29d',2);
  }
  const post=(pts,width=4.6)=>{
    line(c,pts.map(q=>[q[0]+1.7,q[1]+1.8]),'#566d63',width+.9);
    line(c,pts,'#ece5bb',width);
    line(c,pts.map(q=>[q[0]-.65,q[1]-.7]),'#f8efd0',1.1);
  };
  post([p(-X,0),p(-X,H),p(X,H),p(X,0)]);
}
function assembled(c,level) {
  landscape(c);
  palm(c,87,246,.75,-1); palm(c,107,251,.54); palm(c,880,275,.8);
  c.save();
  polygon(c,[[164,85],[191,88],[424,362],[299,343]],'#ead89a09');
  polygon(c,[[830,134],[854,139],[671,431],[487,387]],'#f9dea50a');
  c.restore();
  tower(c,-9.1,-6.43,121,-1);
  tower(c,8.25,-7.00,142,1);
  // Back terrace, splayed corners and the visible folded terrace end panels.
  terrace(c,[-7.9,-5.36],[7.7,-5.36],[0,-1],41,level,4);
  terrace(c,[-8.4,-4.62],[-7.92,-5.34],[-.68,-.74],146,level,3);
  terrace(c,[7.7,-5.36],[8.15,-4.76],[.58,-.79],177,level,3);
  terrace(c,[-8.43,3.3],[-8.43,-4.67],[-1,0],81,level,3);
  turf(c);
  banner(c,-7.35,-4.45,-5.33,.54,'BRASIL');
  net(c);
  terrace(c,[8.58,-4.75],[8.58,.9],[1,0],99,level,3);
  // Tiny corner poles give the turf a distinct scale.
  for(const s of [-1,1]){
    const p=paperPoint(s*7.98,0,-3.4);
    line(c,[p,[p[0]+.1,p[1]-15]],'#ddc68a',1.2);
    polygon(c,[[p[0],p[1]-15],[p[0]+9,p[1]-13.5],[p[0],p[1]-10]],s<0?'#edc15b':'#d17757');
  }
}
function makeCanvas(w,h) {
  if(typeof document!=='undefined'){
    const c=document.createElement('canvas');c.width=w;c.height=h;return c;
  }
  if(typeof OffscreenCanvas!=='undefined')return new OffscreenCanvas(w,h);
  return null;
}
const plates=new Map();
const paperAt=new Map();
const BORDER=90;
function getPlate(level,scale) {
  const key=level+'|'+scale;
  if(plates.has(key))return plates.get(key);
  const width=PAGE_W+BORDER*2,height=PAGE_H+BORDER*2;
  const canvas=makeCanvas(Math.round(width*scale),Math.round(height*scale));
  if(!canvas)return null;
  const c=canvas.getContext('2d');
  c.scale(scale,scale);c.translate(BORDER,BORDER);
  c.lineCap='round';c.lineJoin='round'; assembled(c,level/4);
  if(plates.size>7) plates.delete(plates.keys().next().value);
  plates.set(key,canvas);return canvas;
}
function stock(c,scale) {
  if(!paperAt.has(scale)){
    const canvas=makeCanvas(128,128);
    if(!canvas)return;
    const g=canvas.getContext('2d');
    for(let i=0;i<1850;i++){
      const l=noise(i+11);
      g.fillStyle=l>.52?'rgba(247,229,181,.092)':'rgba(18,41,48,.105)';
      g.fillRect(noise(i+548)*128,noise(i+778)*128,.38+l*.85,.45+noise(i+123)*.7);
    }
    for(let i=0;i<28;i++){
      const x=noise(i+250)*128,y=noise(i+555)*128;
      line(g,[[x,y],[x+noise(i+54)*3.2,y-.6]],'rgba(234,219,172,.105)',.5);
    }
    paperAt.set(scale,canvas);
  }
  const pattern=c.createPattern(paperAt.get(scale),'repeat');
  c.fillStyle=pattern;c.fillRect(-BORDER,-BORDER,PAGE_W+BORDER*2,PAGE_H+BORDER*2);
}
function strip(c,A,B,w1,w2,fill,lit,edge=INK){
  const dx=B[0]-A[0],dy=B[1]-A[1],len=Math.max(.1,Math.hypot(dx,dy)),nx=-dy/len,ny=dx/len;
  const p=[[A[0]+nx*w1,A[1]+ny*w1],[B[0]+nx*w2,B[1]+ny*w2],[B[0]-nx*w2,B[1]-ny*w2],[A[0]-nx*w1,A[1]-ny*w1]];
  polygon(c,p,fill,edge,1.35);
  if(lit)line(c,[p[3],p[2]],lit,1.1);
}
function cleat(c,x,y,s,reverse=1) {
  c.save();c.translate(x,y);c.scale(s*reverse,s);
  polygon(c,[[-4,-4],[3,-4],[5,-2],[11,0],[11,2],[8,4],[-4,4],[-5,2]],'#263e40','#263238',1.1);
  polygon(c,[[-4,1],[4,2],[10.7,1.5],[11,3],[7,4],[-4,4]],'#c6b779');
  line(c,[[1,-2],[5,-.6]],'#d3c8a3',1);c.restore();
}
function glove(c,x,y,angle,flex,scale=1) {
  c.save();c.translate(x,y);c.rotate(angle);c.scale(scale,scale);
  // Centre of the upper palm meets the physical hand anchor.
  const gloveShape=[[-4,8],[-6.2,3],[-7.8,.8],[-9.1,-2],[-7.6,-3.8],[-4.1,-1.6],[-5,-5.6],[-4.4,-8.2],[-2.3,-8.2],[-1.6,-3.9],[-1.3,-9.1],[.8,-9.6],[2,-8.5],[2.1,-4.4],[3.3,-8.4],[5.1,-8.1],[5.5,-6.3],[4.7,-3.2],[6.3,-6],[8,-5],[7.6,-2.1],[6.4,3.4],[3.2,7.1],[3.1,10],[-3.2,10]];
  polygon(c,gloveShape.map(([a,b])=>b< -2?[a+(a<0?.55:-.55)*flex,-2+(b+2)*(1-flex*.59)]:[a,b]),'#f2be4f','#715941',1.05);
  polygon(c,[[-3,-2],[-.1,-4],[3,-3.5],[4,1.6],[2.1,5.5],[-2.4,5.6],[-4.2,2]],'#faD77e');
  for(let i=0;i<3;i++)line(c,[[-3+i*3.1,-5.2+flex*2],[-2+i*3,-2+flex]],'#ba8546',.75+flex*.5);
  polygon(c,[[-3.8,7],[3.8,6.2],[4.3,10],[-3.1,11]],'#437966','#344f48',.7);
  c.restore();
}
function shadow(c,x,z,rx,ry) {
  const p=paperPoint(x,.02,z);
  ellipse(c,p[0]+rx*.63,p[1]+.8,rx,ry,'#345e5347',.11);
  ellipse(c,p[0]+2.5,p[1]+1.2,rx*.61,ry*.64,'#365b4e58',.12);
}
function drawKeeper(c,f) {
  const pose=f.pose||{},dive=saturate(f.dive), side=f.side<0?-1:1,tm=f.time||0;
  const x=pose.x||0,y=pose.y||0,z=Number.isFinite(pose.z)?pose.z:-3.1;
  const [gx,gy]=paperPoint(x,y,z), angle=pose.tilt||0;
  const clap=Number.isFinite(f.clap)?saturate(f.clap):Math.pow(Math.max(0,Math.sin(tm*4.25)),3)*(1-dive);
  const bob=(1-dive)*(Math.sin(tm*2.25)*.7+clap*.7),scale=.86;
  const saved=(p)=>{
    const dx=(p[0]-gx)/scale,dy=(p[1]-gy)/scale,co=Math.cos(angle),sn=Math.sin(angle);
    return [co*dx+sn*dy,-sn*dx+co*dy];
  };
  const supplied=f.hand&&Number.isFinite(f.hand.x)&&Number.isFinite(f.hand.y)&&Number.isFinite(f.hand.z)?saved(paperPoint(f.hand.x,f.hand.y,f.hand.z)):null;
  shadow(c,x,z,19+12*dive,3.4);
  c.save();c.translate(gx,gy);c.scale(scale,scale);c.rotate(angle);
  const chest=-53+bob,hip=-33+bob;
  const A=[-5.6,hip],B=[5.3,hip], LK=[-10.9-5*dive,-17.6-7*dive],RK=[10.7+2*dive,-16-10*dive];
  const LF=[-13-9*dive,-2.6-11*dive],RF=[13.3+5*dive,-2.5-16*dive];
  strip(c,A,LK,4,3.5,'#ac7654','#d49b6b');strip(c,B,RK,4.1,3.4,'#bd8157','#d6a275');
  strip(c,LK,LF,3.3,2.65,'#347c72','#66ad91');strip(c,RK,RF,3.35,2.6,'#327a70','#6ca991');
  for(const [a,b] of [[LK,LF],[RK,RF]])strip(c,mixPoint(a,b,.09),mixPoint(a,b,.29),3.45,3.25,'#dfc677',null,'#688d72');
  cleat(c,...LF,.75,-1);cleat(c,...RF,.78,1);
  polygon(c,[[-9,-37+bob],[8.5,-37+bob],[10.8,-27+bob],[3.6,-24.5+bob],[.1,-30+bob],[-5,-24.3+bob],[-12,-26.5+bob]],'#28444c','#233c41',1.3);
  const left=[-10,chest+1.4],right=[10,chest+1.4];
  const hands=[[-19+clap*16,-51-clap*2+bob],[19-clap*16,-52-clap*2+bob]];
  if(dive>.02) {
    hands[side>0?1:0]=[side*(20+23*dive),-51-13*dive];
    hands[side>0?0:1]=[-side*(11+7*dive),-46-5*dive];
  }
  if(supplied){hands[side>0?1:0]=supplied;if(f.outcome==='catch'&&f.progress>=.84){const tuck=saturate((f.progress-.84)/.103);hands[side>0?0:1]=mixPoint(hands[side>0?0:1],[supplied[0]+side*8,supplied[1]+4],tuck);}}
  for(let i=0;i<2;i++){
    const sign=i?1:-1, shoulders=i?right:left, hand=hands[i];
    const elbow=[mix(shoulders[0],hand[0],.52)+sign*(4-2*dive),mix(shoulders[1],hand[1],.49)+6.5*(1-dive)];
    strip(c,shoulders,elbow,4.2,3.4,i?'#298e86':'#267e77','#82b6a0');
    strip(c,elbow,hand,3.4,2.8,'#56a795','#90c5a6');
    const rot=Math.atan2(hand[0]-elbow[0],elbow[1]-hand[1]);
    glove(c,hand[0],hand[1],rot,saturate(f.flex),.75+(.09*dive));
  }
  polygon(c,[[-9.8,chest-.1],[-4.5,chest-3],[4.7,chest-3],[10.2,chest+1],[8,chest+10],[8.7,hip-.3],[3,hip+1.5],[-8.8,hip-.7],[-8.3,chest+10]],'#359386','#245957',1.4);
  polygon(c,[[-9,chest+1],[-5.5,chest-1],[0,chest+3.8],[6,chest-1],[9.6,chest+1],[.1,chest+7.3]],'#e6c473');
  polygon(c,[[4.8,chest+8],[8.7,chest+6],[7.6,hip-.5],[3.6,hip+.2]],'#2a736b');
  c.fillStyle='#f5e6b9';c.font='bold 10px sans-serif';c.textAlign='center';c.fillText('1',0,hip-2.6);
  polygon(c,[[-3.1,chest-7],[3,chest-7],[3.7,chest-2],[.4,chest],[-3.4,chest-2]],'#ae7250','#826348',.6);
  // Dark coiled ponytail with two cut facets and ochre elastic.
  ellipse(c,-6.3,chest-13.2,5.6,6.3,'#2a3439',-.33);ellipse(c,-8.7,chest-11.3,3.5,3.6,'#263237');
  polygon(c,[[-8.7,chest-15],[-6.4,chest-17],[-4.4,chest-16.3],[-4.7,chest-13],[-6,chest-12]],'#d6af65');
  polygon(c,[[-5.5,chest-16.5],[-2.5,chest-20.5],[2.9,chest-20.7],[5.5,chest-17.8],[6.3,chest-12.6],[4.4,chest-8],[1.8,chest-6.7],[-1.6,chest-7.6],[-4.7,chest-11.1]],'#c48a60','#5f5144',1);
  polygon(c,[[-5.8,chest-13.1],[-6.5,chest-16.2],[-5.5,chest-18.9],[-3.7,chest-21],[-1.1,chest-21.8],[2.5,chest-21.8],[5.1,chest-20.1],[5.8,chest-17.5],[3.2,chest-17.8],[1.9,chest-18.5],[-.6,chest-16.8],[-2.2,chest-17.3],[-3,chest-15.4]],'#30383a');
  line(c,[[-2.5,chest-14],[.1,chest-13.7]],'#343d3b',1);line(c,[[2.6,chest-13.9],[4.65,chest-14.2]],'#38413c',1);
  line(c,[[.7,chest-9.5],[2.8,chest-9.45]],'#885e47',.85);
  c.restore();
}
function drawStriker(c,f){
  const run=saturate(f.run),kick=saturate(f.kick);
  const z=mix(5.57,4.36,run), x=mix(-.84,-.62,run),p=paperPoint(x,0,z);
  shadow(c,x,z,22,3.55);
  const cycle=Math.sin(run*Math.PI*3.2),s=.99,tilt=-.09+.09*kick;
  c.save();c.translate(...p);c.scale(s,s);c.rotate(tilt);
  const hip=-29+cycle*1.2,shoulder=-52+cycle*1.35;
  const L=[-5.4,hip],R=[4.6,hip];
  const LK=[-10-2*run,-14+cycle*4],RK=[8-kick*11,-14-cycle*6-kick*3];
  const LF=[-12-4*run+cycle*4,-1-cycle*2],RF=[11+cycle*6+kick*13,-1-2*run-kick*16];
  for(const [a,b,d] of [[L,LK,LF],[R,RK,RF]]){
    strip(c,a,b,4.25,3.7,'#ae6b4a','#ce9367');
    strip(c,b,d,3.6,2.6,'#e6d8a5','#f3dfb2');
    strip(c,mixPoint(b,d,.12),mixPoint(b,d,.28),3.55,3.3,'#b85548',null,'#985244');
    cleat(c,...d,.83,1);
  }
  polygon(c,[[-9.4,hip-5],[7.7,hip-4],[10.7,hip+4],[4,hip+7],[.9,hip+4],[-3.9,hip+6.2],[-10.7,hip+3.4]],'#303d48','#25363d',1.35);
  const fore=[-10.5,shoulder+5],far=[8.5,shoulder+4.8];
  const le=[-14-cycle*1.4-run*4,shoulder+12-kick*5],re=[12+cycle*1.4+3*kick,shoulder+9-kick*9];
  const lh=[le[0]-4-kick*3,le[1]+2-kick*5],rh=[re[0]+3+5*kick,re[1]-2-kick*6];
  for(const [a,b,h] of [[fore,le,lh],[far,re,rh]]){
    strip(c,a,b,3.5,2.5,'#b87a53','#dca372');strip(c,b,h,2.65,1.8,'#bd8157','#dba276');ellipse(c,h[0],h[1],2.5,2.25,'#c88c63');
  }
  polygon(c,[[-4.7,shoulder-2],[4.2,shoulder-2],[8.6,shoulder+.6],[12.2,shoulder+4.7],[9.4,shoulder+8.2],[6.9,shoulder+6.9],[6.1,hip-2.3],[-3.3,hip-1.8],[-8.7,hip-3.2],[-8.2,shoulder+7],[-11.7,shoulder+8.6],[-14,shoulder+4],[-10.5,shoulder+.2]],'#c76049','#713e3b',1.35);
  polygon(c,[[-11.8,shoulder+1],[-9.2,shoulder-.3],[.2,shoulder+8.7],[6.8,shoulder+12.7],[6.3,shoulder+15.5],[-1,shoulder+11.8]],'#edd5a1');
  polygon(c,[[4.5,shoulder+2],[8,shoulder+3],[6,hip-2], [2,hip-2]],'#a85142');
  c.fillStyle='#fae5b3';c.font='bold 12px sans-serif';c.textAlign='center';c.fillText('9',-.4,hip-5.7);
  polygon(c,[[-3.4,shoulder-7],[3.3,shoulder-7],[4.1,shoulder-2],[1.2,shoulder],[-3.8,shoulder-2]],'#b97b54','#7c5947',.7);
  polygon(c,[[-5.3,shoulder-15.8],[-2.1,shoulder-18.6],[3.8,shoulder-18.4],[6,shoulder-14.6],[5.4,shoulder-9.6],[3,shoulder-6],[-1.3,shoulder-6.2],[-4.6,shoulder-9.1]],'#bb805a','#654e43',1);
  polygon(c,[[-5.6,shoulder-10.4],[-6.3,shoulder-15.1],[-4.3,shoulder-18.7],[-.4,shoulder-20.3],[3.1,shoulder-19.6],[6.1,shoulder-16.8],[6.4,shoulder-13.1],[3.3,shoulder-13.6],[1.3,shoulder-10],[-2.5,shoulder-8]],'#353535');
  polygon(c,[[-3.6,shoulder-13.2],[-7.8,shoulder-11.7],[-10.6,shoulder-7.5],[-12.3,shoulder-7.7],[-10.7,shoulder-12.6],[-6.9,shoulder-15.8]],'#29363a');
  line(c,[[-5.3,shoulder-14.6],[-6.8,shoulder-12.6]],'#d9b366',1.7);
  c.restore();
}
function football(c,ball,progress,flex,side) {
  const [gx,gy]=paperPoint(ball.x,ball.y,ball.z),[sx,sy]=paperPoint(ball.x,0,ball.z);
  const r=7.35+Math.max(0,ball.z+4)*.115;
  ellipse(c,sx+1.5+ball.y*2,sy+.45,r*.8,r*.23,'#42645465',.13);
  c.save();c.translate(gx,gy);c.rotate((progress||0)*5.8);
  const hull=[];for(let k=0;k<12;k++){const a=-Math.PI*.52+k*TAU/12;hull.push([Math.cos(a)*r,Math.sin(a)*r]);}
  polygon(c,hull,'#ebdfb4','#354348',1.5);
  c.save();c.beginPath();c.moveTo(...hull[0]);hull.slice(1).forEach(q=>c.lineTo(...q));c.closePath();c.clip();
  polygon(c,[[-r*.96,r*.04],[-r*.34,r*.45],[r*.37,r*.68],[r*.91,r*.2],[r*.65,r],[0,r*1.1],[-r,r*.7]],'#b7b59a');
  polygon(c,[[-.32*r,-.13*r],[-.04*r,-.42*r],[.36*r,-.23*r],[.34*r,.16*r],[-.11*r,.27*r]],'#2d4044');
  polygon(c,[[-.9*r,-.63*r],[-.48*r,-.86*r],[-.41*r,-.58*r],[-.69*r,-.28*r],[-r,-.27*r]],'#334548');
  polygon(c,[[.5*r,-.83*r],[.79*r,-.71*r],[r,-.24*r],[.74*r,-.36*r]],'#34494b');
  polygon(c,[[.71*r,.36*r],[r,.24*r],[.97*r,.67*r],[.55*r,.88*r],[.5*r,.67*r]],'#344549');
  polygon(c,[[-.53*r,.55*r],[-.22*r,.75*r],[-.29*r,1.05*r],[-.79*r,.89*r],[-.81*r,.63*r]],'#344548');
  for(const seg of [[[-.7,-.28],[-.32,-.13]],[[.35,-.23],[.75,-.37]],[[.33,.15],[.73,.37]],[[-.11,.27],[-.51,.56]],[[-.03,-.42],[-.08,-.78]]])line(c,seg.map(q=>[q[0]*r,q[1]*r]),'#9e9e87',.7);
  c.restore();c.restore();
  if(flex>.26){
    const d=10+flex*3;
    for(let i=0;i<3;i++){
      const a=side>0?-.9+i*.6:Math.PI-.7+i*.55;
      line(c,[[gx+Math.cos(a)*d,gy+Math.sin(a)*d],[gx+Math.cos(a)*(d+3+4*flex),gy+Math.sin(a)*(d+3+4*flex)]],'#f2cd74',1.6);
    }
  }
}
export function drawField(ctx,w,h,f={}) {
  if(!(w>0&&h>0))return;
  const time=Number.isFinite(f.time)?f.time:0, cheer=saturate(f.cheer);
  const view=layout(w,h), zoom=Number.isFinite(f.zoom)?Math.max(.4,Math.min(8,f.zoom)):1;
  ctx.save();
  ctx.fillStyle='#1b353f';ctx.fillRect(0,0,w,h);
  ctx.translate(view.x,view.y);ctx.scale(view.scale,view.scale);
  if(zoom!==1) {
    const focus=f.hand||f.ball||{x:0,y:.9,z:-2.1}, p=paperPoint(focus.x,focus.y,focus.z);
    ctx.translate(p[0],p[1]);ctx.scale(zoom,zoom);ctx.translate(-p[0],-p[1]);
  }
  ctx.lineCap='round';ctx.lineJoin='round';
  const plateScale=(w>460||h>390)?1.15:.74, level=Math.round(cheer*4), sheet=getPlate(level,plateScale);
  if(sheet)ctx.drawImage(sheet,-BORDER,-BORDER,PAGE_W+BORDER*2,PAGE_H+BORDER*2);
  else assembled(ctx,level/4);
  flags(ctx,time);bunting(ctx,time);
  drawKeeper(ctx,f);
  const ball=f.ball&&Number.isFinite(f.ball.x)&&Number.isFinite(f.ball.y)&&Number.isFinite(f.ball.z)?f.ball:{x:0,y:.27,z:3.8};
  drawStriker(ctx,f);
  football(ctx,ball,f.progress||0,saturate(f.flex),f.side<0?-1:1);
  stock(ctx,1);
  ctx.restore();
}
