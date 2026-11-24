// A Shape to Remember. An anatomical atlas built on the original popup-3d harness.
// Rag paper (0.06-unit cuts), Venetian red #a84941 and lagoon #437b6c, ochre
// #c79d54, carbon #283e38. Side light at 49 degrees, 25-degree lens pitched
// at 45 degrees. The book is 33 by 19.4 units; the B cell stands 2.35 units.
// Paired leaves, pasted boundary tissues, slotted cells, accordion follicles,
// slow blood drift and a single three-note receptor motif supplied by the reader UI.

const LIB = new URL('./vendor/papercraft/', import.meta.url).href;
const HALF = 16.2;
const DEPTH = 9.4;
const SPAN_X = 13.45;
const SPAN_Z = 6.75;
const TWO_PI = Math.PI * 2;
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const startState = {stage: 'river', step: '', target: 0, mark: 0, selected: 0, tags: [], objects: [], lang: 'en'};

// An independent viewport preserves the template's camera, input and capture
// clock, which are intentionally scoped to the window in the upstream harness.
export function createWorld({host, onAction = () => {}, onMove = () => {}, onError = () => {}}) {
  const frame = document.createElement('iframe');
  frame.title = 'Interactive pop-up book';
  frame.tabIndex = -1;
  frame.setAttribute('loading', 'eager');
  frame.style.cssText = 'display:block;border:0;width:100%;height:100%;position:absolute;inset:0;background:transparent';
  let engine = null;
  let config = {...startState};
  let destination = null;
  let destroyed = false;
  let resolveReady, rejectReady;
  const ready = new Promise((resolve, reject) => { resolveReady = resolve; rejectReady = reject; });
  ready.catch(() => {});
  const update = (next) => {
    if(next.stage&&next.stage!==config.stage)destination=null;
    config = {...config, ...next};
    frame.title = config.lang === 'pt' ? 'Livro pop-up interativo' : 'Interactive pop-up book';
    if (engine) engine.setState(config);
  };
  frame.bookReader = {
    get config() { return config; },
    onAction, onMove,
    connect(live) {
      if (destroyed) { live.destroy(); return; }
      engine = live;
      engine.setState(config);
      if (destination) engine.moveTo(...destination);
      resolveReady(true);
    },
    fail(error) {
      if (destroyed) return;
      rejectReady(error);
      frame.remove();
      onError(error);
    }
  };
  let three;
  try { three = import.meta.resolve('three'); }
  catch { three = new URL('./vendor/three/three.module.js', import.meta.url).href; }
  const maps = JSON.stringify({imports: {three, 'papercraft/': LIB}});
  const moduleUrl = JSON.stringify(import.meta.url);
  frame.srcdoc = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#1b3831}canvas{display:block;touch-action:manipulation}</style><script type="importmap">${maps}<\/script></head><body><script type="module">const bridge=window.frameElement.bookReader;try{const {mountBook}=await import(${moduleUrl});bridge.connect(await mountBook(bridge));}catch(err){bridge.fail(err)}<\/script></body></html>`;
  host.append(frame);
  return {
    ready, setScene: update, setState: update,
    moveTo(x, z, onArrive) { destination = [x, z, onArrive]; engine?.moveTo(x, z, onArrive); },
    project(x, z) { return engine?.project(x, z) ?? null; },
    destroy() {
      destroyed = true;
      engine?.destroy();
      rejectReady(new Error('Book closed'));
      frame.remove();
      engine = null;
    }
  };
}

function randomFrom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function newCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

const riverX = z => -9.6 + 2.05 * Math.sin(z * .34 + .45) + .76 * Math.sin(z * .54 - .37);
const riverW = z => 2.75 + .36 * Math.cos(z * .44 + .6);
const surface = (x, z) => .91 + .46 * Math.sin(Math.min(1, Math.abs(x) / HALF) * Math.PI) - .30 * Math.exp(-Math.abs(x) * 1.22) + .052 * Math.cos(z * .26 + x * .17);

function line(g, points, color, width, dash = []) {
  if (points.length < 2) return;
  g.beginPath();
  points.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y));
  g.strokeStyle = color;
  g.lineWidth = width;
  g.setLineDash(dash);
  g.lineCap = g.lineJoin = 'round';
  g.stroke();
  if (dash.length) g.setLineDash([]);
}

function oval(g, x, y, rx, ry, fill, stroke = null, width = .04, tilt = 0) {
  g.beginPath();
  g.ellipse(x, y, rx, ry, tilt, 0, TWO_PI);
  if (fill) { g.fillStyle = fill; g.fill(); }
  if (stroke) { g.strokeStyle = stroke; g.lineWidth = width; g.stroke(); }
}

function curve(g, start, handles, col, width, dash) {
  g.beginPath(); g.moveTo(...start);
  for (const h of handles) g.bezierCurveTo(...h);
  g.lineWidth = width; g.strokeStyle = col; g.lineCap = 'round';
  if (dash) g.setLineDash(dash);
  g.stroke();
  if (dash) g.setLineDash([]);
}

const stages = {
  river: {folio: 'I', tint: '#bdd0a2'}, node: {folio: 'II', tint: '#b5caa4'},
  recognition: {folio: 'III', tint: '#bfd1b2'}, garden: {folio: 'IV', tint: '#b9c7ab'},
  marrow: {folio: 'V', tint: '#dbc2a3'}, recall: {folio: 'VI', tint: '#b4cba8'},
  tonsil: {folio: '∗', tint: '#d8baae'}
};

function rosette(g, x, z, size, color, offset) {
  const pts = [];
  for (let i = 0; i < 51; i++) {
    const a = i / 50 * TWO_PI;
    const r = size * (1 + .16 * Math.cos(5 * a + offset));
    pts.push([x + r * Math.cos(a), z + .77 * r * Math.sin(a)]);
  }
  line(g, pts, color, .042);
  oval(g, x, z, size * .50, size * .36, null, color, .034);
}

function bankMap(g, rng) {
  const track = [];
  for (let z = -11; z < 11.01; z += .19) track.push(z);
  const edge = (side, width) => track.map(z => [riverX(z) + side * (riverW(z) + width), z]);
  for (const side of [-1, 1]) {
    for (let k = 0; k < 7; k++) line(g, edge(side, .16 + k * .23), k % 2 ? '#c29873' : '#b99268', k === 0 ? .10 : .035, k === 4 ? [.22,.12] : []);
  }
  const fillBand = (offset, ink) => {
    const pts = edge(-1, offset).concat(edge(1, offset).reverse());
    g.beginPath(); pts.forEach(([x,z],i) => i ? g.lineTo(x,z) : g.moveTo(x,z)); g.closePath(); g.fillStyle = ink; g.fill();
  };
  fillBand(.13, '#a27558'); fillBand(.04, '#faad86'); fillBand(-.19, '#c9675e'); fillBand(-.53, '#b34d4a');
  for (let k=0; k<20; k++) {
    const z0 = -10 + rng()*18, off = (rng()-.5)*3.7, l = .7 + rng()*2.3;
    const pts = [];
    for (let dt=0;dt<=l;dt+=.13) pts.push([riverX(z0+dt) + off + .08*Math.sin(dt*3), z0+dt]);
    line(g,pts, k%3 ? '#d67c6f':'#8c4243', .026+rng()*.035);
  }
  for (const side of [-1,1]) {
    for (let z=-9.3;z<9.8;z+=.47) {
      const x=riverX(z)+side*(riverW(z)-.075);
      oval(g,x,z,.095,.20,'#a6514f',null,0,-.16);
      line(g,[[x-.04,z-.07],[x-.02,z+.07]],'#f9c197',.032);
    }
  }
}

function nodePrint(g, cx, cz, rx, rz, muted = false) {
  const rng = randomFrom(803);
  const boundary = (k=1) => Array.from({length: 105}, (_,i) => {
    const a=i/104*TWO_PI;
    const r=(1 - .19*Math.exp(-Math.pow((a-0.07)/.47,2))-.14*Math.exp(-Math.pow((a-TWO_PI)/.49,2))+.055*Math.sin(3*a-.45)) * k;
    return [cx+Math.cos(a)*rx*r,cz+Math.sin(a)*rz*r];
  });
  const outline = boundary();
  g.beginPath(); outline.forEach(([x,z],i) => i?g.lineTo(x,z):g.moveTo(x,z)); g.closePath();
  g.fillStyle = muted ? '#cfcb9f' : '#adc3a2'; g.fill();
  for (let j=0;j<4;j++) line(g,boundary(1-j*.025),['#677f6b','#f4dfaf','#849e81','#cfcea2'][j],j===0?.105:.053);
  g.save(); g.clip();
  for (let i=0;i<37;i++) {
    const x = cx+(rng()-.5)*rx*1.9, z=cz+(rng()-.5)*rz*1.84;
    const rad=.25+rng()*.65;
    oval(g,x,z,rad,rad*.73,null,'#869e7e',.035,rng()*.8);
    if (i%3===0) oval(g,x,z,rad*.64,rad*.44,'#bbcb9f',null,0,.07);
  }
  for (let j=0;j<4;j++) {
    const z=cz+(j-1.5)*rz*.47;
    curve(g,[cx+rx*.83,cz+.4],[[cx+rx*.3,cz-.16,cx+rx*.05,z,cx-rx*.4,z-.3]],'#d8d2a8',.20);
  }
  g.restore();
}

function lobes(g, cx, cz, rx, rz, base, rim, seed) {
  const rng=randomFrom(seed);
  g.beginPath(); g.ellipse(cx,cz,rx,rz,.08,0,TWO_PI); g.fillStyle=base;g.fill();
  g.save();g.clip();
  for (let i=0;i<140;i++){
    const a=rng()*TWO_PI,r=Math.sqrt(rng());
    const x=cx+Math.cos(a)*rx*r,z=cz+Math.sin(a)*rz*r;
    const d=.08+rng()*.18;
    oval(g,x,z,d,d*.78,i%4===0?rim:null,rim,.027,rng());
  }
  g.restore();
  for(let k=0;k<3;k++) oval(g,cx,cz,rx+k*.13,rz+k*.12,null,rim,.035,k?.08:.09);
}

function marrowPrint(g, rng) {
  // A continuous anastomosing trabecular mesh, with warm sinusoids in its gaps.
  g.fillStyle='#d3a794';g.fillRect(-16,-8.1,32,15.8);
  for(let i=0;i<20;i++){
    const x=-17+i*1.8;
    curve(g,[x,-9.5],[[x-3,-4,x+3,1,x-.8,5],[x-2,8,x+1,8.5,x+1.2,10]],i%3?'#c58f83':'#dcada0',.3+rng()*.38);
  }
  const rows = Array.from({length:5},(_,j)=>Array.from({length:8},(_,i)=>[-18+i*5.1+(j%2)*1.7+(rng()-.5)*2,-9.6+j*4.8+(rng()-.5)*1.1]));
  for(let j=0;j<rows.length-1;j++)for(let i=0;i<7;i++){
    for(const b of [rows[j][i+1],rows[j+1][i+(j%2)]]){
      const a=rows[j][i],mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;
      const h=[[mx+.45,my-.4,mx-.33,my+.35,...b]];
      curve(g,a,h,'#ad7a66',.68);curve(g,a,h,'#e9c89c',.55);curve(g,a,h,'#f7dbb0',.25);
    }
  }
}

function inkFibers(g,cx,cz,angle,seed){
  const rng=randomFrom(seed);
  g.save();g.translate(cx,cz);g.rotate(angle);
  for(let i=0;i<7;i++){
    const y=(i-3)*.11,x=(rng()-.6)*.36;
    curve(g,[x-1.61,y-.17],[[x-.96,y+.39,x+.34,y-.30,x+1.26+rng()*.57,y+.30]],
      i===3?'#9c9d7a':'#b3aa84',i%3===0?.06:.028);
    if(i===1||i===5){
      for(let j=0;j<6;j++){
        const k=-.77+j*.25;
        line(g,[[x+k,y+.04],[x+k+.14,y-.19]],'#b2a581',.027);
      }
    }
  }
  g.restore();
}

function tissueMap(g,stage,rng){
  if(stage==='river'||stage==='node'){
    bankMap(g,rng);
    nodePrint(g,7.3,-.1,7.1,6.0,true);
  }else if(stage==='recall'){
    nodePrint(g,-1.8,-.7,11.6,6.2);
    for(let i=0;i<3;i++)curve(g,[15.8,-7+i*5.3],[[11,-8+i*4,13,.6+i,8,2.3]],'#8ba68a',.16-i*.02);
  }else if(stage==='recognition'){
    lobes(g,-6.3,-.25,8.9,6.7,'#adc29f','#839e83',52);
    lobes(g,8,-.35,6.9,6.2,'#d3b1a5','#b69391',57);
    for(let i=0;i<4;i++) curve(g,[.75+i*.28,-9],[[2.4+i*.28,-3,-1+i*.28,3,.2+i*.28,9]],'#a99877',.052);
  }else if(stage==='garden'){
    lobes(g,-6.1,-.2,8.1,6.0,'#829f96','#697f78',923);
    lobes(g,6.6,-.65,7.5,6.1,'#becb95','#8da17b',681);
    for(let i=0;i<5;i++)curve(g,[6.4,-.8],[[7.1,-1.6,10.2-i*.6,-2-i*.5,12-i*.91,-5-i*.27]],'#e4d29e',.14);
  }else if(stage==='marrow'){
    g.save();g.beginPath();g.rect(-16.2,-9.4,16.2,18.8);g.clip();marrowPrint(g,rng);g.restore();
    nodePrint(g,8.45,-.65,6.0,4.80);
    for(let i=0;i<4;i++)curve(g,[2.4+i*.24,8.6],[[2.6,4.5,10,4.5,12.6+i*.13,1.6]],i===1?'#d79d88':'#a89675',i===1?.27:.055);

  }else{
    g.fillStyle='#d5aba0';g.fillRect(-16,-8.4,32,16.8);
    for(let i=0;i<5;i++){
      const x=-14+i*6.5;
      curve(g,[x,-9],[[x-2,-5,x+3.2,-4,x+.6,-.2],[x-2,2.8,x-2,4.8,x+.8,6.3]],'#ac7373',1.2);
      curve(g,[x,-9],[[x-2,-5,x+3.2,-4,x+.6,-.2],[x-2,2.8,x-2,4.8,x+.8,6.3]],'#f1c6a9',.86);
    }
    for(let i=0;i<8;i++) rosette(g,-13+(i%4)*7,-3+Math.floor(i/4)*7,.65,'#aa8e80',i);
  }
}

function paintAtlas(canvas, stage) {
  const g=canvas.getContext('2d');
  const rng=randomFrom(579);
  const w=canvas.width,h=canvas.height;
  g.setTransform(1,0,0,1,0,0);
  const paper=g.createLinearGradient(0,0,w,h);
  paper.addColorStop(0,'#edd8ae');paper.addColorStop(.38,'#f1e1bc');paper.addColorStop(.51,'#ebd9b0');paper.addColorStop(1,'#f2dfb7');
  g.fillStyle=paper;g.fillRect(0,0,w,h);
  g.save();g.scale(w/(2*HALF),h/(2*DEPTH));g.translate(HALF,DEPTH);
  // Deckled border stays quiet around the leading lines of every composition.
  g.save();g.beginPath();g.roundRect(-15.54,-8.78,31.08,17.46,.22);g.clip();
  for(let i=0;i<65;i++){
    const x=(rng()-.5)*33,z=(rng()-.5)*19,d=.55+rng()*1.8;
    const grad=g.createRadialGradient(x,z,0,x,z,d);
    grad.addColorStop(0,'rgba(132,138,88,.10)');grad.addColorStop(1,'rgba(132,138,88,0)');g.fillStyle=grad;g.fillRect(x-d,z-d,2*d,2*d);
  }
  for(let i=0;i<75;i++){
    const x=(rng()-.5)*32,z=(rng()-.5)*17;
    if(i%3===0)rosette(g,x,z,.18+rng()*.30,'#bcae83',rng()*5);
    else curve(g,[x,z],[[x+.2,z-.1,x+.31,z+.12,x+.52,z-.15]],'#c8b78c',.025);
  }
  tissueMap(g,stage,rng);
  if(!['river','node'].includes(stage)){
    inkFibers(g,13.65,6.45,-.38,77);
    inkFibers(g,-13.56,-6.70,.33,29);
    if(stage==='recall'||stage==='garden')inkFibers(g,-12.75,6.20,.16,61);
  }
  g.restore();
  for(const s of [-1,1]){
    const l=s<0?-15.55:.43;
    g.strokeStyle='#a19a77';g.lineWidth=.038;g.strokeRect(l,-8.78,15.1,17.46);
    const cx=s*14.74;
    for(const z of [-8.09,8.03]) {
      const d=z>0?-1:1;
      line(g,[[cx-s*.63,z],[cx,z],[cx,z+d*.63]],'#a68553',.066);
      line(g,[[cx-s*.18,z+d*.08],[cx-s*.1,z+d*.15],[cx-s*.22,z+d*.25]],'#b39967',.04);
    }
    g.fillStyle='#7e765d';g.font='italic .41px Georgia, serif';g.textAlign='center';g.textBaseline='middle';
    g.fillText(stages[stage]?.folio||'I',s*8.6,9.04);
  }
  const spine=g.createLinearGradient(-1.2,0,1.4,0);spine.addColorStop(0,'rgba(100,70,35,0)');spine.addColorStop(.40,'rgba(108,81,49,.12)');spine.addColorStop(.50,'rgba(73,54,31,.29)');spine.addColorStop(.58,'rgba(255,246,204,.38)');spine.addColorStop(1,'rgba(245,230,193,0)');
  g.fillStyle=spine;g.fillRect(-1.2,-9.4,2.6,18.8);
  g.restore();
  g.setTransform(1,0,0,1,0,0);
  for(let i=0;i<14500;i++){
    const x=rng()*w,y=rng()*h,k=rng();
    g.fillStyle=k>.42?'rgba(77,59,34,.064)':'rgba(255,251,224,.13)';
    g.fillRect(x,y,.5+2.1*rng(),.45+.4*rng());
  }
}

function pagePoint(side,u,v) {
  const bow = .12*Math.cos(v*Math.PI*.5)-.25*Math.pow(Math.abs(v),6);
  const x=side*(.10+u*(HALF+bow-.10));
  const z=v*(DEPTH-.19*u+.08*Math.sin(Math.PI*u));
  return [x,surface(x,z),z];
}

function pageGeometry(THREE,side){
  const pos=[],uv=[],idx=[],nx=25,nz=10;
  for(let j=0;j<=nz;j++)for(let i=0;i<=nx;i++){
    const u=i/nx,v=j/nz*2-1;
    pos.push(...pagePoint(side,u,v));uv.push((1+side*u)/2,1-j/nz);
  }
  for(let j=0;j<nz;j++)for(let i=0;i<nx;i++){
    const n=j*(nx+1)+i,a=n+nx+1,b=n+1,c=a+1;
    if(side===1) idx.push(n,a,b,b,a,c);else idx.push(n,b,a,b,c,a);
  }
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
  geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(idx);geo.computeVertexNormals();
  return geo;
}

function cutEdges(THREE,kit,side){
  const path=[],n=30;
  for(let i=0;i<n;i++)path.push(pagePoint(side,i/n,-1));
  for(let i=0;i<n;i++)path.push(pagePoint(side,1,-1+2*i/n));
  for(let i=0;i<n;i++)path.push(pagePoint(side,1-i/n,1));
  for(let i=0;i<=n;i++)path.push(pagePoint(side,0,1-2*i/n));
  const pos=[],col=[];
  const tones=['#d8c099','#9c876d','#ead3a6','#c4ad88','#e7cda0','#b19b7a','#e5c89a','#ad9474','#ecd3a4','#c9b28c','#f0d9ad','#bc9e78'];
  for(let j=0;j<tones.length;j++){
    const c=new THREE.Color(tones[j]);
    for(let i=0;i<path.length-1;i++){
      const vert=(p,layer) => {
        const t=layer/tones.length;
        return [p[0]*(.994+t*.006),.235+(p[1]-.235)*t,p[2]*(.995+t*.005)];
      };
      const a=vert(path[i],j),b=vert(path[i+1],j),d=vert(path[i],j+1),e=vert(path[i+1],j+1);
      pos.push(...a,...b,...d,...b,...e,...d);for(let k=0;k<6;k++)col.push(c.r,c.g,c.b);
    }
  }
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('color',new THREE.Float32BufferAttribute(col,3));geo.computeVertexNormals();
  return new THREE.Mesh(geo,kit.paperMaterial({vertexColors:true, side:THREE.DoubleSide}));
}

function flatBoard(THREE,w,h,height,round,material){
  const x=-w/2,y=-h/2;
  const shape=new THREE.Shape();
  shape.moveTo(x+round,y);shape.lineTo(-x-round,y);shape.quadraticCurveTo(-x,y,-x,y+round);
  shape.lineTo(-x,-y-round);shape.quadraticCurveTo(-x,-y,-x-round,-y);shape.lineTo(x+round,-y);
  shape.quadraticCurveTo(x,-y,x,-y-round);shape.lineTo(x,y+round);shape.quadraticCurveTo(x,y,x+round,y);
  const geo=new THREE.ExtrudeGeometry(shape,{depth:height,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:.045,bevelThickness:.035,curveSegments:4});
  const mesh=new THREE.Mesh(geo,material);mesh.rotation.x=-Math.PI/2;mesh.castShadow=mesh.receiveShadow=true;
  return mesh;
}

function layBook(H,kit,THREE,atlas){
  H.printGround(({g,W,H:height,rnd})=>{
    const grad=g.createRadialGradient(W*.47,height*.43,W*.07,W*.47,height*.48,W*.71);
    grad.addColorStop(0,'#345254');grad.addColorStop(.55,'#203e43');grad.addColorStop(1,'#16333b');g.fillStyle=grad;g.fillRect(0,0,W,height);
    g.lineWidth=1;
    for(let i=0;i<4600;i++){
      const x=rnd()*W,y=rnd()*height;g.strokeStyle=i%2?'rgba(236,219,162,.055)':'rgba(17,41,32,.08)';
      g.beginPath();g.moveTo(x,y);g.lineTo(x+rnd()*4,y+1+rnd());g.stroke();
    }
  },{ppu:10});
  const group=new THREE.Group();H.scene.add(group);
  const cover=flatBoard(THREE,33.65,19.50,.17,.2,kit.paperMaterial({color:'#345b4f'}));cover.position.y=.092;group.add(cover);
  const binding=flatBoard(THREE,33.34,19.31,.042,.12,kit.paperMaterial({color:'#ae8b55'}));binding.position.y=.245;group.add(binding);
  const tex=new THREE.CanvasTexture(atlas);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=Math.min(4,H.renderer.capabilities.getMaxAnisotropy());
  const pageMat=kit.paperMaterial({map:tex,side:THREE.DoubleSide});
  for(const side of [-1,1]){
    const edges=cutEdges(THREE,kit,side);edges.castShadow=edges.receiveShadow=true;group.add(edges);
    const page=new THREE.Mesh(pageGeometry(THREE,side),pageMat);page.receiveShadow=true;group.add(page);
  }
  // A cloth bookmark leaves the gutter and rests over the fore edge.
  const marks=[[-.38,.49,7.3],[.42,.51,7.28],[.53,.48,9.26],[-.29,.45,9.32],[.61,.27,9.95],[-.17,.23,10.02],[.82,.10,10.70],[.35,.095,10.45],[.05,.09,10.85]];
  const geom=new THREE.BufferGeometry();
  geom.setAttribute('position',new THREE.Float32BufferAttribute(marks.flat(),3));geom.setIndex([0,1,3,1,2,3,3,2,5,2,4,5,4,6,7,4,7,5,5,7,8]);geom.computeVertexNormals();
  const bookmark=new THREE.Mesh(geom,kit.paperMaterial({color:'#b1523b',side:THREE.DoubleSide}));bookmark.castShadow=true;group.add(bookmark);
  return tex;
}

function nodeCard(THREE,H,kit,layer){
  const path=new THREE.Shape();
  path.moveTo(-4.8,0);path.lineTo(4.45,0);
  path.quadraticCurveTo(5.27,.5,4.75,1.02);
  path.bezierCurveTo(4.42,1.54,3.00,1.28,3.33,2.10);path.bezierCurveTo(3.58,2.66,4.58,2.70,4.68,3.5);
  path.bezierCurveTo(4.95,4.54,3.0,5.36,1.44,5.44);path.bezierCurveTo(-.61,5.6,-2.44,5.09,-3.53,4.04);path.bezierCurveTo(-4.8,2.98,-5.26,1.36,-4.8,0);
  const pts=path.getPoints(10).map(p=>[p.x,p.y]);
  const palettes=[['#679880','#3b675e','#b4c89b'],['#85a58c','#548271','#cad3a4'],['#a7b999','#688f79','#e3d7af']];
  const [light,dark,accent]=palettes[layer];
  const border=(g,scale,stroke,width)=>{
    g.save();g.translate(0,2.25);g.scale(scale,scale);g.translate(0,-2.25);line(g,pts,stroke,width);g.restore();
  };
  return kit.makeCard(pts,{paper:H.paper,thickness:.064,edgeWidth:.055,pxPerUnit:32,seed:631+layer,back:'kraft',effects:1,paint(P){
    P.gradient(dark,light,.18);
    P.draw(()=>{
      const g=P.g,r=randomFrom(675+layer);
      for(const [sc,ink,w] of [[.99,'#436757',.21],[.963,accent,.16],[.918,dark,.065]])border(g,sc,ink,w);
      for(const [x,y,rr] of [[-3.6,1.22,.52],[-3.05,2.7,.62],[-1.92,3.63,.68],[-.31,4.16,.61],[1.23,4.21,.60],[2.73,3.83,.53]]){
        oval(g,x,y,rr*.99,rr,accent,dark,.078,.33);
        oval(g,x+.08,y+.045,rr*.65,rr*.60,light,'#e5d4a5',.070,.53);
        oval(g,x-.08,y-.05,rr*.21,rr*.16,dark);
        for(let j=0;j<6;j++){const a=r()*TWO_PI,rad=rr*(.52+r()*.26);oval(g,x+Math.cos(a)*rad,y+Math.sin(a)*rad,.037,.044,dark);}
      }
      for(let j=0;j<7;j++){
        const start=[3.73-j*.14,1.66+j*.042],end=[-3.24+j*.82,.59+Math.sin(j*.53)*1.33+j*.09];
        curve(g,start,[[2.50,1.12+j*.15,end[0]+.4,end[1]+.4,...end]],accent,.115);
        if(j%2===0)curve(g,[end[0]+.5,end[1]+.25],[[end[0]+.13,end[1]+.22,end[0]-.42,end[1]+.5,end[0]-.54,end[1]+.56]],accent,.070);
      }
      for(let j=0;j<85;j++){
        const x=r()*8.5-4.25,y=r()*3.8+.30;
        if(Math.abs((x-.8)*.22)+Math.abs((y-2.2)*.49)>.98)continue;
        oval(g,x,y,.037,.056,dark,null,0,.4);
      }
    });
    P.innerShade('#415d50',{alpha:.28,blurPx:5,dx:.018,dy:-.01});
  }});
}

const anchors={
  river:[-.72,.56],node:[-.20,.46],recognition:[-.72,.78],garden:[-.22,.52],marrow:[.08,.55],recall:[-.71,.54],tonsil:[-.56,.52]
};

function createLeafTurn(THREE,kit,H) {
  const meshes=[],nx=17,nz=4;
  for(let k=0;k<3;k++){
    const geom=new THREE.PlaneGeometry(1,1,nx,nz);
    const mat=kit.paperMaterial({color:['#ead7ac','#f0deb8','#ead3a7'][k],side:THREE.DoubleSide});
    const mesh=new THREE.Mesh(geom,mat);mesh.frustumCulled=false;mesh.castShadow=mesh.receiveShadow=true;mesh.visible=false;H.scene.add(mesh);meshes.push(mesh);
  }
  let elapsed=0,active=0;
  return {
    start(n){elapsed=0;active=n;for(const m of meshes)m.visible=false;},
    update(dt){
      if(!active)return;
      elapsed+=dt;
      for(let j=0;j<active;j++){
        const p=clamp((elapsed-j*.12)/.83,0,1),m=meshes[j];
        m.visible=p>.005&&p<.99;
        if(!m.visible)continue;
        const a=p*Math.PI,prop=Math.sin(a),pos=m.geometry.attributes.position;
        for(let iz=0;iz<=nz;iz++)for(let ix=0;ix<=nx;ix++){
          const u=ix/nx,v=iz/nz*2-1;
          const phi=a+(.40*(1-u)+.16*v)*prop;
          const x=.10+Math.cos(phi)*HALF*u,z=v*(DEPTH-.18*u)-.14*prop*u;
          pos.setXYZ(iz*(nx+1)+ix,x,surface(x,z)+.09+j*.027+Math.sin(phi)*HALF*u*.74+.38*Math.sin(u*Math.PI)*prop,z);
        }
        pos.needsUpdate=true;m.geometry.computeVertexNormals();
      }
      if(elapsed> .84+(active-1)*.12)active=0;
    }
  };
}

const kindMap={
  hero:'bcell',friend:'bcell',sister:'bcell',daughter:'bcell',naive:'bcell',memorycell:'memory',
  plasmaCell:'plasma',guardian:'macrophage',collector:'macrophage',helper:'tfh',tcell:'tfh',
  erythrocyte:'rbc',shape:'antigen',particle:'antigen',decoy:'antigen',protein:'antigen',
  lymphnode:'follicle',node:'follicle',book:'flap',origin:'marrow',stromal:'fdc',dendrite:'fdc',
  zone:'follicle',peptide:'mhc',presentation:'mhc',receptor:'bcell',venule:'hev',vessel:'hev',
  trail:'signal',il21:'signal',cxcl13:'signal',tonsil:'crypt',vellum:'ebv',endosome:'mhc',
  antibodyRibbon:'antibody',tree:'branch',branching:'fan',tab:'flap',gate:'hev'
};
const sizes = {
  bcell:2.95,memory:3.12,plasma:3.36,macrophage:3.35,tfh:3.32,rbc:1.72,antigen:2.63,fdc:3.95,follicle:3.1,
  marrow:3.2,bone:3.65,crypt:3.9,antibody:2.4,signal:1.75,ebv:2.20,fan:3.35,mhc:2.40,spleen:3.2,hev:3.2,
  branch:2.8,reed:1.6,starlet:1.3,fiber:2.7,flap:2.35
};

function specialPiece(THREE,kit,H,kind) {
  const group=new THREE.Group();
  const card=(outline,base,paint,z=0)=>{
    const mesh=kit.makeCard(outline,{paper:H.paper,thickness:.023,edgeWidth:.018,pxPerUnit:154,seed:54,
      paint(P){P.gradient(base[0],base[1],.26);P.draw(()=>paint(P.g));},effects:1});
    mesh.position.z=z;group.add(mesh);return mesh;
  };
  const roundOutline=(x,y,w,h,r)=>{
    const s=new THREE.Shape();s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);
    return s.getPoints(5).map(p=>[p.x,p.y]);
  };
  const letterLines=(g)=>{
    for(let i=0;i<3;i++)line(g,[[-.24,.30+i*.10],[.20-i*.06,.31+i*.10]],'#ad916c',.023);
  };
  if(kind==='years'){
    for(let i=0;i<3;i++){
      const m=card(roundOutline(-.39,0,.78,.94,.04),[['#e1c38e','#d4af77'],['#ecd6a5','#e3bf8a'],['#f5e3b7','#ead09f']][i],g=>{
        letterLines(g);
        curve(g,[-.20,.71],[[-.12,.59,.14,.59,.20,.73]],'#aa8054',.032);
      },i*.065);
      m.rotation.z=(i-1)*.17;
    }
  }else if(kind==='membrane'){
    const contour=Array.from({length:49},(_,i)=>{const a=i/48*TWO_PI;return [Math.cos(a)*(.55+.045*Math.sin(a*3)),.48+Math.sin(a)*.46];});
    card(contour,['#639988','#437d72'],g=>{
      oval(g,-.06,.49,.46,.35,'#a4bfa2','#e8d8a7',.026,-.16);
      oval(g,.02,.53,.25,.20,'#c47a62','#7e8d75',.05,.18);
      for(const [x,y] of [[-.10,.52],[.05,.44],[.09,.59]])line(g,[[x-.045,y-.025],[x+.045,y+.025]],'#f1d399',.046);
      curve(g,[-.40,.66],[[-.24,.80,-.15,.72,-.04,.80]],'#f0d5a4',.029);
    });
  }else if(kind==='vellum'){
    card(roundOutline(-.39,.01,.76,.91,.03),['#8b8e79','#747d70'],letterLines,-.065);
    const v=card([[-.36,.02],[.37,.03],[.41,.81],[.25,.94],[-.33,.90]],['#ddcfac','#eddfc0'],g=>{
      g.strokeStyle='#ae9c80';g.lineWidth=.02;g.setLineDash([.037,.032]);g.strokeRect(-.28,.10,.55,.69);g.setLineDash([]);
      line(g,[[.22,.91],[.23,.78],[.38,.80]],'#c2a986',.025);
    },.08);
    for(const material of (Array.isArray(v.material)?v.material:[v.material])){
      material.transparent=true;material.opacity=.68;material.depthWrite=false;
    }
    v.renderOrder=2;v.rotation.y=-.36;v.rotation.z=-.11;
  }else{
    card([[-.45,.02],[.40,.02],[.48,.73],[.34,.93],[-.31,.93],[-.46,.77]],['#d8a052','#b97c46'],g=>{
      g.strokeStyle='#f1d29a';g.lineWidth=.026;g.setLineDash([.051,.039]);g.strokeRect(-.34,.11,.68,.68);g.setLineDash([]);
      for(let i=0;i<3;i++)line(g,[[-.18,.40+i*.084],[.20,.41+i*.084]],'#87613f',.037);
      oval(g,0,.76,.045,.045,'#775e42','#f2d49b',.018);
    });
  }
  return group;
}

export async function mountBook(bridge) {
  const [THREE, harness, kit, pieces]=await Promise.all([
    import('three'),import('./vendor/papercraft/harness.js'),import('papercraft/lib/paperkit-3d.js'),import('./pieces.js')
  ]);
  let config={...startState,...bridge.config};
  const H=harness.createHarness({
    ground:'#233e35',stock:'#fbf3dd',bounds:{x0:-30,x1:30,z0:-21,z1:19},
    view:{pitch:45,yaw:-4,dist:51,fov:25,closer:1,target:[0,.90,1.15]},
    focus:[0,1.8,0],heroHeight:2.45,subject:[0,0],play:false,
    light:{target:new THREE.Vector3(0,0,0),key:'#ffdfb5',keyIntensity:2.45,fill:'#dfebdc',fillIntensity:.67,sky:'#f6ebce',ground:'#91a18a',skyIntensity:.48,
      keyDir:[-.85,1.02,.53],fillDir:[.4,.45,1],shadowExtent:25,mapSize:innerWidth<650?1024:1536,distance:70,leak:'#836f54',softness:.30,maxPenumbra:.69},
    lens:{exposure:.87,saturation:1.01,greenDesat:0,contrast:1.07,tint:[1.01,1,.985],haze:'#cccca5',hazeAmount:0,focusBand:.44,ramp:.35,maxBlur:3.2,taps:9,vignette:.05,vignetteColor:'#253f34',shadowTint:'#414c3c',sharpen:.1}
  });
  pieces.configurePieces(H.paper);
  const el=H.renderer.domElement;
  const setRatio=H.renderer.setPixelRatio.bind(H.renderer);
  H.renderer.setPixelRatio=(r)=>setRatio(Math.min(r,innerWidth<620?1.28:1.4,Math.sqrt(1400000/Math.max(1,innerWidth*innerHeight))));
  H.renderer.shadowMap.autoUpdate=false;H.renderer.shadowMap.needsUpdate=true;
  const atlas=newCanvas(1280,744);paintAtlas(atlas,config.stage);
  const bookMap=layBook(H,kit,THREE,atlas),turn=createLeafTurn(THREE,kit,H);
  const special=new Map();
  const templates=new Map();
  const layer=new THREE.Group();H.scene.add(layer);
  const clickable=new THREE.Group();H.scene.add(clickable);
  const activeObjects=[],effects=[],shells=[],decorHandles=[];
  const groundSpots=new Map();
  const heroModel=new THREE.Group();
  const hero=H.popup(null,null,{node:heroModel,height:2.4,x:-8,z:2.9,yaw:0,order:0,level:true});
  H.setHero(hero);
  let heroStyle='',stage=null,objectSig='',elapsed=0,oldShadow=-1,examined=null,friend=null,friendProp=null,friendTimer=0;
  let heroX=-8,heroZ=2.8,destX=heroX,destZ=heroZ,swing=0;
  const cursor=new THREE.Vector2(),ray=new THREE.Raycaster(),point=new THREE.Vector3();
  let pointer=null, route=null, routeNumber=0;

  const custom=(kind)=>{
    if(!special.has(kind))special.set(kind,specialPiece(THREE,kit,H,kind));
    return special.get(kind).clone(true);
  };
  const getPiece=(kind,opts={})=>{
    if(['flap','years','membrane','vellum'].includes(kind))return custom(kind);
    const view=pieces.makePiece(kind,opts);
    return view;
  };
  const shadowMap=newCanvas(64,48),sg=shadowMap.getContext('2d');
  const glow=sg.createRadialGradient(32,24,1,32,24,31);
  glow.addColorStop(0,'rgba(54,54,37,.50)');glow.addColorStop(.42,'rgba(75,66,41,.34)');glow.addColorStop(1,'rgba(75,66,41,0)');
  sg.fillStyle=glow;sg.fillRect(0,0,64,48);
  const shadowTex=new THREE.CanvasTexture(shadowMap),shadeGeom=new THREE.PlaneGeometry(1,1);
  const shadeMat=new THREE.MeshBasicMaterial({map:shadowTex,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1,side:THREE.DoubleSide});
  function shadow(parent,w){
    const m=new THREE.Mesh(shadeGeom,shadeMat);m.rotation.x=-Math.PI/2;m.scale.set(w,w*.65,1);parent.add(m);return m;
  }
  const heroShadow=shadow(H.scene,2.58);
  const shadeAt=(s,x,z)=>s.position.set(x+.08,surface(x,z)+.018,z-.025);

  function pieceAt(kind,x,z,height,opts={}){
    const parent=opts.interactive?clickable:layer;
    const mesh=opts.node??getPiece(kind,{variant:opts.variant??0,mark:opts.mark??0,seed:opts.seed??0,isoform:opts.isoform??0,friend:!!opts.friend});
    const h=H.popup(null,null,{node:mesh,height:opts.node?6:1,x,z,yaw:opts.yaw??0,scale:height,parent,order:0,sway:0,sight:false,level:true});
    h.group.position.y=surface(x,z)+.033+(opts.lift||0);
    const shade=opts.noShadow?null:shadow(parent,Math.min(5.1,Math.max(.42,height*.88)));
    if(shade)shadeAt(shade,x,z);
    const obj={kind,mesh,h,shade,x,z,height,id:opts.id,variant:opts.variant,baseYaw:opts.yaw??0,phase:opts.phase??0};
    if(opts.id){h.group.userData.choice=opts.id;activeObjects.push(obj);groundSpots.set(opts.id,obj);}
    else decorHandles.push(obj);
    if(config.reduced||opts.flat)h.reset(opts.flat?0:1);else h.set(1,opts.delay??.015);
    return obj;
  }

  function clearCollection(list,parent){
    const taken=new Set(list.map(a=>a.h));
    for(let j=H.hinges.length-1;j>=0;j--)if(taken.has(H.hinges[j]))H.hinges.splice(j,1);
    parent.clear();list.length=0;
  }

  function heroAppearance(){
    const isMemory=stage==='recall'||stage==='marrow';
    const peptide=stage==='recognition'&&['presented','helped'].includes(config.step)||stage==='garden'&&['offer','helped'].includes(config.step);
    const captured=stage==='recognition'&&config.step==='captured';
    const isoform=stage==='garden'&&['trial','offer','helped'].includes(config.step)?config.selected:0;
    const sig=[isMemory,config.target,config.mark,peptide,captured,isoform].join('/');
    if(sig===heroStyle)return;
    heroStyle=sig;heroModel.clear();
    const actor=getPiece(isMemory?'memory':'bcell',{variant:config.target,mark:config.mark,isoform,seed:0});
    actor.scale.setScalar(3.05);heroModel.add(actor);
    if(peptide||captured){
      const cargo=getPiece(peptide?'mhc':'antigen',{variant:config.target});
      cargo.scale.setScalar(peptide?.40:.33);cargo.position.set(.40,.47,.13);
      actor.add(cargo);
    }
  }

  function addShells(){
    for(let j=0;j<3;j++){
      const key='shell'+j;
      if(!templates.has(key))templates.set(key,nodeCard(THREE,H,kit,j));
      const mesh=templates.get(key).clone();
      const hScale=[1,.93,.84][j];
      const obj=pieceAt('shell',6.9,-2.80+j*.47,hScale,{node:mesh,flat:stage==='river',delay:.075*j+.01,noShadow:j!==0,yaw:-.11+j*.016});
      shells.push(obj);
    }
  }

  function addTissue(stageName){
    clearCollection(decorHandles,layer);effects.length=0;shells.length=0;friend=null;friendProp=null;
    const rnd=randomFrom(376);
    const put=(k,x,z,h,variant,yaw,extra={})=>pieceAt(k,x,z,h,{variant,yaw,seed:Math.floor(rnd()*3),delay:.018+Math.max(0,6-z)*.012,...extra});
    const cluster=(x,z,kinds,base,spacing=1)=>kinds.forEach((k,j)=>{
      const a=j*2.19+.3;
      put(k,x+Math.cos(a)*(j?.81:0)*spacing,z+Math.sin(a)*(j?.61:0)*spacing,base*(1-j*.12),j%3,(rnd()-.5)*.35);
    });
    if(stageName==='river'||stageName==='node'){
      addShells();
      for(let i=0;i<12;i++){
        const z=-8.38+i*1.46+(rnd()-.5)*.30,x=riverX(z)+(rnd()-.5)*2.65;
        const r=put('rbc',x,z,1.05+rnd()*.89,i%3,rnd()*.75-.48);
        r.trajectory=z;r.bias=x-riverX(z);r.phase=i*1.17;r.speed=.16+rnd()*.12;effects.push(r);
      }
      cluster(-14,-4.80,['fiber','rbc','reed'],2.72,.8);
      cluster(-3.25,-5.0,['hev','branch','reed'],2.15,1.2);
      cluster(12.83,-4.72,['branch','follicle','reed'],2.11,1.08);
      cluster(12.78,3.62,['follicle','reed','fiber'],1.45,.91);
      put('fiber',-14.1,3.27,1.39,1,.42);
      put('branch',3.20,-5.82,1.63,2,-.31);
      friend=put('bcell',1.45,-1.2,2.09,((config.target??0)+1)%3,-.13,{friend:true});
    }else if(stageName==='recognition'){
      cluster(-10.0,-4.75,['fdc','branch','follicle'],4.35,1.8);
      cluster(10.78,-4.52,['branch','tfh','reed'],2.75,1.3);
      cluster(13.1,3.20,['fiber','reed','bcell'],1.51,1.1);
      cluster(-13.2,3.52,['follicle','reed'],1.53,.9);
      for(let i=0;i<4;i++)put('bcell',-1.45+i*1.4,-6.0+Math.sin(i)*.26,1.02+rnd()*.34,i%3,(rnd()-.5)*.5);
    }else if(stageName==='garden'){
      cluster(-10.0,-4.25,['fan','bcell','bcell'],3.75,1.65);
      cluster(9.1,-4.65,['fdc','branch','tfh'],4.60,1.9);
      cluster(-13.3,3.53,['fiber','follicle'],1.83,.8);
      cluster(12.9,3.31,['follicle','reed','branch'],1.83,.9);
      for(let i=0;i<7;i++){
        const x=-11+i*1.13,z=-6.3+Math.sin(i*.6)*.4;
        const cell=put('bcell',x,z,.84+rnd()*.47,config.target,(rnd()-.5)*.34,{mark:config.mark});
        cell.phase=i*.72;effects.push(cell);
      }
    }else if(stageName==='marrow'){
      cluster(-10,-3.7,['bone','marrow','fiber'],4.20,1.35);
      cluster(9.9,-4.65,['fdc','follicle','branch'],3.65,1.55);
      cluster(-13.0,3.67,['marrow','reed'],1.75,.85);
      cluster(13.2,3.06,['branch','follicle'],1.75,.9);
      for(let i=0;i<6;i++)put('rbc',-4.4+i*1.88,-5.5+Math.sin(i)*.43,1.06+rnd()*.24,i%3,(rnd()-.5)*.8);
      for(let i=0;i<5;i++){
        const a=put('antibody',-6.05+i*.99,-.71-i*.42,.96+i*.045,config.target,(rnd()-.5)*.42,{mark:config.mark,noShadow:true});
        a.phase=i*1.13;a.h.group.visible=false;effects.push(a);
      }
    }else if(stageName==='recall'){
      const old=put('fdc',-9.9,-5.15,3.89,2,-.08);
      old.mesh.rotation.z=-.05;
      cluster(10.0,-4.48,['follicle','branch','memory'],3.44,1.45);
      cluster(-13.29,3.51,['fiber','reed'],1.71,.9);
      cluster(13.05,3.37,['branch','follicle'],1.63,.9);
      for(let i=0;i<5;i++)put(i%2?'memory':'bcell',-2.6+i*1.51,-5.6-Math.cos(i)*.45,1.34+rnd()*.28,(i+1)%3,(rnd()-.5)*.43);
      for(const [i,x] of [-6.15,-3.55,-1.22].entries()){
        const a=put(i===1?'memory':'plasma',x,-1.3+Math.cos(i)*.45,2.03+i*.13,config.target,(rnd()-.5)*.19,{mark:config.mark});
        a.afterRecall=true;a.h.group.visible=false;if(a.shade)a.shade.visible=false;effects.push(a);
        const y=put('antibody',x-1.0,-2.06-i*.13,.87,config.target,.21-i*.09,{noShadow:true});
        y.afterRecall=true;y.phase=i*1.13;y.h.group.visible=false;effects.push(y);
      }
    }else{
      cluster(-10.6,-4.1,['crypt','branch','bcell'],4.85,1.8);
      cluster(10.0,-4.64,['crypt','follicle','bcell'],4.35,1.4);
      cluster(-13.30,4,['follicle','branch'],1.77,1);
      cluster(13.0,3.91,['crypt','reed'],2.07,.8);
      for(let i=0;i<4;i++)put('bcell',-2.4+i*1.48,-5.3+Math.sin(i)*.28,1.2+i*.06,i%3,.13-i*.07);
    }
    H.renderer.shadowMap.needsUpdate=true;
  }

  function scatterObjects(){
    clearCollection(activeObjects,clickable);groundSpots.clear();
    const specs=config.objects||[];
    for(const o of specs){
      let kind=kindMap[o.kind]||o.kind;
      if(o.kind==='membrane'||o.kind==='vellum'||o.kind==='years')kind=o.kind;
      if(o.id==='late-mica')kind='memory';
      if(!sizes[kind]&&!['years','vellum','membrane'].includes(kind))kind='flap';
      const isFriend=o.kind==='friend';
      const variant=o.kind==='sister'?config.target:(o.variant??(isFriend?(config.target+1)%3:config.target??0));
      const x=clamp(o.x??0,-1,1)*SPAN_X,z=clamp(o.z??0,-1,1)*SPAN_Z;
      const h=o.id==='decoy'?2.25:(sizes[kind]??2.55);
      const obj=pieceAt(kind,x,z,h,{interactive:true,id:o.id,variant,mark:isFriend?(config.mark+1)%3:(o.mark??config.mark),isoform:o.kind==='sister'?o.variant:0,seed:1,friend:isFriend,yaw:Math.sin(x*.32+z*.13)*.12});
      obj.sourceKind=o.kind;obj.spec=o;
      if(o.id==='decoy')examined={x,z,variant};
      if(o.kind==='trail'){
        for(let i=1;i<=3;i++){
          const token=getPiece('signal',{variant:i%3});
          token.scale.setScalar(.38-i*.055);token.position.set(-.34-i*.27,.02,-.09+i*.10);obj.mesh.add(token);
        }
      }
      const hasTrace=config.tags?.includes('ebv');
      if(o.kind==='vellum'&&(hasTrace||config.step==='trace')){
        const sign=getPiece('ebv',{seed:1});sign.scale.setScalar(.44);sign.position.set(-.035,.24,.06);obj.mesh.add(sign);
      }
      if(isFriend&&hasTrace&&(stage==='tonsil'||stage==='recall')){
        const leaf=custom('vellum');leaf.scale.setScalar(.48);leaf.position.set(.30,.07,.13);leaf.rotation.z=-.15;
        const sign=getPiece('ebv',{seed:1});sign.scale.setScalar(.45);sign.position.set(0,.24,.13);leaf.add(sign);obj.mesh.add(leaf);
      }
    }
    if(friend){friend.h.group.visible=!specs.some(o=>o.kind==='friend');if(friend.shade)friend.shade.visible=friend.h.group.visible;}
  }

  function setShell(open,immediate=false){
    open=!!open;
    shells.forEach((s,j)=>{
      if(immediate||config.reduced)s.h.reset(open?1:0);
      else if(s.h.open!==(open?1:0))s.h.set(open?1:0,.045+j*.095);
    });
  }

  function attachDecoy(){
    const other=activeObjects.find(o=>o.sourceKind==='friend')||friend;
    if(!other||!examined)return;
    if(friendProp?.parent===other.mesh)return;
    friendProp?.removeFromParent();
    friendProp=getPiece('antigen',{variant:examined.variant,seed:1});
    friendProp.scale.setScalar(.40);friendProp.position.set(-.43,.30,.13);friendProp.rotation.z=.12;
    other.mesh.add(friendProp);
  }

  function updateState(next){
    const prev=config,old=stage;
    config={...startState,...next};
    stage=stages[config.stage]?config.stage:'river';
    const sameSpread=(old==='node'||old==='river')&&(stage==='node'||stage==='river');
    if(stage!==old){
      route=null;routeNumber++;
      if(old&&!sameSpread)turn.start(config.reduced?0:stage==='recall'?3:1);
      paintAtlas(atlas,stage);bookMap.needsUpdate=true;
      if(!sameSpread){
        addTissue(stage);
        const a=anchors[stage];heroX=destX=a[0]*SPAN_X;heroZ=destZ=a[1]*SPAN_Z;
        examined=null;friendTimer=0;
      }else if(stage==='node'){
        destX=-1.5;destZ=2.45;
      }
      objectSig='';
    }
    if(stage==='river'||stage==='node')setShell(stage==='node'||config.tags?.includes('nodeOpen'),!old);
    if(stage==='node'&&config.step==='witness'&&prev.step!=='witness')friendTimer=0;
    const sig=JSON.stringify([(config.objects||[]).map(o=>[o.id,o.kind,o.x,o.z,o.variant,o.mark]),config.target,config.mark,config.tags?.includes('ebv')]);
    if(sig!==objectSig){objectSig=sig;scatterObjects();H.renderer.shadowMap.needsUpdate=true;}
    if(stage==='node'&&config.step==='witnessed'){
      // Reloading a finished scene restores the particle the companion already holds.
      examined??={x:-.31*SPAN_X,z:.12*SPAN_Z,variant:(config.target+1)%3};
      attachDecoy();
    }
    heroAppearance();
    window.document.documentElement.lang=config.lang==='pt'?'pt-BR':'en';
  }

  function arrive(trip) {
    if(!trip?.onArrive)return;
    const done=trip.onArrive;
    trip.onArrive=null;
    queueMicrotask(()=>{if(trip.number===routeNumber)done();});
  }

  function moveTo(x,z,onArrive) {
    if(!Number.isFinite(x)||!Number.isFinite(z))return;
    destX=clamp(x,-1,1)*SPAN_X;destZ=clamp(z,-1,1)*SPAN_Z;
    const distance=Math.hypot(destX-heroX,destZ-heroZ);
    route={number:++routeNumber,fromX:heroX,fromZ:heroZ,elapsed:0,
      duration:clamp(.28+distance*.044,.28,1.10),onArrive:typeof onArrive==='function'?onArrive:null};
    if(config.reduced||distance<.43){
      heroX=destX;heroZ=destZ;arrive(route);route=null;
    }
  }

  function project(x,z){
    const wx=x*SPAN_X,wz=z*SPAN_Z;
    const match=activeObjects.find(o=>Math.abs((o.spec.x??0)-x)<.001&&Math.abs((o.spec.z??0)-z)<.001);
    const elevation=match?match.height*.50:.52;
    point.set(match?.h.group.position.x??wx,surface(wx,wz)+elevation,match?.h.group.position.z??wz).project(H.camera);
    return point.z>1||point.z< -1?null:{x:(1+point.x)/2,y:(1-point.y)/2};
  }

  function hit(e){
    const rect=el.getBoundingClientRect();cursor.set((e.clientX-rect.left)/rect.width*2-1,1-(e.clientY-rect.top)/rect.height*2);
    ray.setFromCamera(cursor,H.camera);
    const found=ray.intersectObjects(activeObjects.map(o=>o.h.group),true);
    for(const a of found){
      for(let p=a.object;p&&p!==clickable;p=p.parent)if(p.userData.choice)return groundSpots.get(p.userData.choice);
    }
    // A card's printed handle extends to a comfortable touch area at far zoom.
    let nearest=null,best=Infinity;
    for(const o of activeObjects){
      const pt=project(o.spec.x,o.spec.z);
      if(!pt)continue;
      const dx=pt.x*rect.width-(e.clientX-rect.left),dy=pt.y*rect.height-(e.clientY-rect.top);
      const ratio=Math.hypot(dx,dy)/(innerWidth<650?22:15);
      if(ratio<1&&ratio<best){best=ratio;nearest=o;}
    }
    return nearest;
  }
  // The upstream canvas normally toggles the entire model. This atlas binds
  // taps to pieces and to the page's true plane instead, keeping the same clock.
  const foldable=new Set(['tab','fan','vellum','years','membrane']);
  function releaseFold() {
    if(!pointer?.handle)return;
    const item=pointer.handle;
    item.mesh.rotation.x=0;item.mesh.position.z=0;
    if(item.sourceKind==='tab'&&stage==='river')setShell(config.tags?.includes('nodeOpen'),false);
  }
  el.addEventListener('pointerdown',e=>{
    if(e.button!==0)return;
    e.stopImmediatePropagation();
    const item=hit(e);
    pointer={x:e.clientX,y:e.clientY,handle:foldable.has(item?.sourceKind)?item:null};
    el.setPointerCapture?.(e.pointerId);
  },true);
  el.addEventListener('pointermove',e=>{
    if(!pointer){el.style.cursor=hit(e)?'pointer':'crosshair';return;}
    const handle=pointer.handle;
    if(!handle||config.reduced)return;
    const pull=clamp(Math.hypot(e.clientX-pointer.x,e.clientY-pointer.y)/67,0,1);
    handle.mesh.rotation.x=-pull*.21;handle.mesh.position.z=pull*.15;
    if(handle.sourceKind==='tab'&&stage==='river'&&!config.tags?.includes('nodeOpen')){
      for(const [j,panel] of shells.entries())panel.h.reset(pull*(.74-j*.045));
    }
  },true);
  el.addEventListener('pointercancel',()=>{releaseFold();pointer=null;},true);
  el.addEventListener('pointerup',e=>{
    if(!pointer)return;e.stopImmediatePropagation();
    const tap=Math.hypot(pointer.x-e.clientX,pointer.y-e.clientY)<11;
    const pulled=pointer.handle;releaseFold();pointer=null;
    if(!tap&&!pulled)return;
    const obj=pulled||hit(e);
    if(obj){moveTo(obj.spec.x,obj.spec.z);bridge.onAction(obj.id);return;}
    const flat=new THREE.Plane(new THREE.Vector3(0,1,0),-1.06);
    const p=ray.ray.intersectPlane(flat,new THREE.Vector3());
    if(!p||Math.abs(p.x)>HALF-.18||Math.abs(p.z)>DEPTH-.2)return;
    const x=clamp(p.x/SPAN_X,-1,1),z=clamp(p.z/SPAN_Z,-1,1);
    moveTo(x,z);bridge.onMove({x,z});
  },true);
  el.addEventListener('webglcontextlost',e=>{
    e.preventDefault();bridge.fail(new Error('WebGL context lost'));
  });

  function updateFriend(dt){
    if(stage!=='node'||!examined)return;
    const other=activeObjects.find(o=>o.sourceKind==='friend')||friend;if(!other)return;
    if(config.step==='witness'||config.step==='witnessed'){
      friendTimer+=dt;
      if(friendTimer>.25||config.reduced){
        const goalX=examined.x-.78,goalZ=examined.z+.42;
        const ease=config.reduced?1:1-Math.exp(-2.8*dt);
        other.x+=(goalX-other.x)*ease;other.z+=(goalZ-other.z)*ease;
        other.h.group.position.set(other.x,surface(other.x,other.z)+.035,other.z);
        if(other.shade)shadeAt(other.shade,other.x,other.z);
        if(config.step==='witnessed')attachDecoy();
      }
    }
  }

  function animate(t,dt) {
    elapsed+=dt;
    const reduced=!!config.reduced;
    const aspect=Math.max(.1,innerWidth/Math.max(1,innerHeight)),cameraTan=Math.tan(H.camera.fov*Math.PI/360);
    // Framing the two page margins also keeps the tucked-away bookmark visible.
    H.view.dist=Math.max(38.7/(2*cameraTan*aspect),19.2/(2*cameraTan));
    H.view.yaw=H.view.tyaw=-4-(reduced?Math.sin(t*.21)*.5:0);
    H.view.pitch=H.view.tpitch=45-(reduced?Math.sin(t*.17)*.3:0);
    const dx=destX-heroX,dz=destZ-heroZ,d=Math.hypot(dx,dz);
    if(route){
      route.elapsed+=dt;
      const p=reduced?1:clamp(route.elapsed/route.duration,0,1);
      const ease=p*p*(3-2*p);
      heroX=route.fromX+(destX-route.fromX)*ease;
      heroZ=route.fromZ+(destZ-route.fromZ)*ease;
      if(Math.hypot(destX-heroX,destZ-heroZ)<=.43)arrive(route);
      if(p>=1)route=null;
    }else{
      const travel=reduced?d:Math.min(d,dt*(3.8+Math.min(d,7)*.72));
      if(d>.005){heroX+=dx/d*travel;heroZ+=dz/d*travel;}
    }
    const y=surface(heroX,heroZ)+.035;
    hero.group.position.set(heroX,y,heroZ);
    hero.group.rotation.y=reduced?-.05:-.06+.15*clamp(dx*.6,-1,1);
    swing+=(clamp(dx*.25,-1,1)*.06-swing)*(1-Math.exp(-dt*7));
    heroModel.rotation.z=reduced?0:swing+Math.sin(t*1.50)*.014;
    shadeAt(heroShadow,heroX,heroZ);
    updateFriend(dt);
    for(const obj of effects){
      if(obj.afterRecall){
        const visible=config.step==='response'||config.step==='end';
        obj.h.group.visible=visible;
        if(obj.shade)obj.shade.visible=visible;
        if(!visible)continue;
      }
      if(obj.kind==='rbc'){
        const z=((obj.trajectory+9+elapsed*obj.speed)%18)-9;
        const px=riverX(z)+obj.bias+Math.sin(t*.40+obj.phase)*.12;
        if(!reduced){
          obj.h.group.position.set(px,surface(px,z)+.025,z);
          obj.h.group.rotation.y=obj.baseYaw+Math.sin(t*.49+obj.phase)*.66;
          obj.mesh.rotation.z=Math.sin(t*.64+obj.phase)*.075;
          if(obj.shade)shadeAt(obj.shade,px,z);
        }
      }else if(obj.kind==='bcell'){
        obj.h.group.rotation.y=obj.baseYaw+(reduced?0:.12*Math.sin(t*.58+obj.phase));
      }else if(obj.kind==='antibody'){
        obj.h.group.visible=obj.afterRecall||config.tags?.includes('antibody')||config.step==='antibody';
        if(obj.h.group.visible){
          const p=reduced?.4:(elapsed*.15+obj.phase)%1;
          obj.h.group.position.set(obj.x+.2*Math.sin(obj.phase+t*.3),surface(obj.x,obj.z)+.2+p*2.3,obj.z-.33*p);
        }
      }
    }
    if(!reduced)for(const a of activeObjects){
      if(a.sourceKind==='signal'||a.sourceKind==='trail')a.mesh.rotation.z=.045*Math.sin(t*.75+a.x);
    }
    turn.update(dt);
    if(t-oldShadow>(innerWidth<650?.16:.09)||t<oldShadow){H.renderer.shadowMap.needsUpdate=true;oldShadow=t;}
  }
  H.onStep(animate);
  H.start();
  // Only the hero hinge existed during the template's automatic opening.
  // The reader owns all audible foley, including its mute setting.
  hero.onStart=null;
  updateState(config);
  if(config.reduced)hero.reset(1);
  window.__papercraft.step(.015);window.__papercraft.resume();
  return {
    setState:updateState,moveTo,project,
    destroy(){
      route=null;routeNumber++;
      H.renderer.setAnimationLoop(null);
      H.renderer.dispose();H.renderer.forceContextLoss();
    }
  };
}
