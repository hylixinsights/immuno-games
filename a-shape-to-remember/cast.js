// Orthographic paper cutouts for the tissue journey. Each drawing is rooted at
// the middle of its lower edge. The map supplies projection, folds and shadows.
const tau = Math.PI * 2;
const stock = {
  ink:'#243f3b', teal:'#34796e', foam:'#a3c7ae',
  gold:'#e0a950', straw:'#ffe0a0', amber:'#a9703d', brick:'#af5246',
  blush:'#f0b49a', violet:'#815863', plum:'#5f3e4e', parchment:'#f5e7c2'
};
const drawings = new Map();
const pathTable = new Map();
function path(d) {
  if (typeof d !== 'string') return d;
  if (!pathTable.has(d)) pathTable.set(d,new Path2D(d));
  return pathTable.get(d);
}
function fill(g,d,color) { g.fillStyle=color; g.fill(path(d),'evenodd'); }
function line(g,d,color,width=1) { g.strokeStyle=color; g.lineWidth=width; g.stroke(path(d)); }
function dot(g,x,y,rx,ry,color,angle=0) {
  g.fillStyle=color; g.beginPath(); g.ellipse(x,y,rx,ry,angle,0,tau); g.fill();
}
function clip(g,d,draw) { g.save(); g.clip(path(d),'evenodd'); draw(); g.restore(); }
function hatch(g,d,color,spacing=5,width=.7,slope=.43) {
  clip(g,d,()=>{
    g.beginPath();
    for (let x=-110; x<235; x+=spacing) { g.moveTo(x,-30); g.lineTo(x+162*slope,132); }
    g.lineWidth=width; g.strokeStyle=color; g.stroke();
  });
}
function marks(g,coords,col) { for (const [x,y,rx,ry,rot] of coords) dot(g,x,y,rx,ry,col,rot); }
function ovalPath(cx,cy,rx,ry) {
  const p=new Path2D(); p.ellipse(cx,cy,rx,ry,0,0,tau); p.closePath(); return p;
}
function ellipse(cx,cy,rx,ry) {
  return 'M '+(cx-rx)+' '+cy+' a '+rx+' '+ry+' 0 1 0 '+(2*rx)+' 0 a '+rx+' '+ry+' 0 1 0 '+(-2*rx)+' 0 z';
}
const polygon = pts=>'M '+pts.map(p=>p.join(' ')).join(' L ')+' Z';

// The five dies share their contours with the receptor swatches in the interface.
const motifs=[
  'M24 17C13 7 11 19 14 25C2 23 6 37 17 35C17 43 28 46 30 36C41 39 49 29 38 24C45 13 31 10 26 20Z',
  'M35 7C21 6 11 16 11 27C11 39 22 45 35 40C24 39 20 32 21 25C21 18 26 11 35 7Z',
  'M24 5L40 21L26 43L10 23Z','M23 40L6 22L10 15L16 14L19 8L26 11L33 8L37 15L42 17L43 23Z',
  'M24 7a17 17 0 1 1-.01 0M24 17a7 7 0 1 0 .01 0'
];
function imprint(g,variant,x,y,w,h,col) {
  g.save(); g.translate(x,y); g.scale(w/48,h/48); fill(g,motifs[variant],col); g.restore();
}
function illustrated(p,draw) { draw(p.g); }
function layer(p,col,d,depth=.10) {
  const g=p.g;
  g.save(); g.translate(.82,1.2+depth*4); fill(g,d,'rgba(66,48,37,.38)'); g.restore();
  fill(g,d,col);
  line(g,d,'rgba(74,53,38,.21)',.65);
}
const edgeColors={
  moss:['#4b6656','#ecd9aa'],
  coral:['#805046','#f0c394'],
  gold:['#86603d','#ffe7ad'],
  plum:['#725265','#f1ceb5']
};
function cardboard(g,d,draw,{edge='moss',weight=1,thickness=1.4}={}) {
  const contour=path(d), [spine,edgeLight]=edgeColors[edge];
  g.save(); g.translate(.62*thickness,thickness);
  line(g,contour,spine,3.4*weight); fill(g,contour,spine); g.restore();
  line(g,contour,spine,3.35*weight);
  line(g,contour,edgeLight,2.2*weight);
  g.save(); g.clip(contour,'evenodd');
  draw({g,fill(color){fill(g,contour,color);}});
  g.restore();
  line(g,contour,'rgba(48,46,34,.37)',.60*weight);
}
function at(g,x,y,sx,sy,angle,draw) {
  g.save(); g.translate(x,y); g.rotate(angle); g.scale(sx,sy); draw(); g.restore();
}
const familySigns = [
  'M 0 -8 L 1.9 -2.4 L 6 -5 L 3.4 -.7 L 8 1 L 2.7 2 L 5.3 6.6 L .5 3.6 L -1 8 L -2.3 3 L -6 5.6 L -3.7 .8 L -8 0 L -2.6 -1.6 L -4 -6 Z',
  'M -7 5 L -3 -7 L .2 -7 L -3.4 6 Z M -.4 6 L 3.5 -6 L 7 -6 L 3 6.5 Z',
  'M -8 -4 Q -5 -5 -3 -1 Q 0 -5 2 -1 Q 4 -6 8 -4 L 7 -.4 Q 4 -.9 3 3 Q .5 5 -2 1.3 Q -5 4 -7 1 Z'
];
function sign(g,mark,x,y,size=1) {
  g.save(); g.translate(x,y); g.scale(size,size);
  line(g,familySigns[mark], '#735539', 1.3);
  fill(g,familySigns[mark], stock.straw); g.restore();
}

const cellBody='M 50 15 C 70 13 85 28 87 47 C 90 65 79 82 63 89 C 44 97 23 88 15 75 C 3 57 12 36 23 26 C 30 19 39 16 50 15 Z';
const cellInside='M 48 19 C 69 15 81 31 82 49 C 84 68 75 81 60 86 C 45 92 24 86 18 71 C 10 54 14 40 27 29 C 33 24 42 21 48 19 Z';
const bNucleus='M 42 31 C 55 25 68 32 72 42 C 77 51 72 57 71 66 C 69 75 62 80 51 80 C 34 82 23 73 24 60 C 24 52 21 38 33 34 C 37 32 39 32 42 31 Z';
const forks = Array.from({length:9}, (_,i)=> -.18 + i*tau/9);
function radialPoint(a,t,r) {
  return [50+(38.5+r)*Math.cos(a)-t*Math.sin(a),53+(36.5+r)*Math.sin(a)+t*Math.cos(a)];
}
function receptorDie() {
  const pts=[];
  forks.forEach((a,i) => {
    const arms=[[-4,0],[-1.7,4.3],[-1.65,9.1],[-6.5,13.4],[-4.8,15.5],[0,11.9],[4.7,15.5],[6.7,13.4],[1.7,9],[1.7,4.3],[4,0]];
    pts.push(...arms.map(([t,r])=>radialPoint(a,t,r)));
    const next = forks[(i+1)%forks.length] + (i+1===forks.length?tau:0);
    for(let j=1;j<=3;j++)pts.push(radialPoint(a+.12+(next-a-.24)*j/4,0,0));
  });
  return polygon(pts);
}
const receptorOutline=receptorDie();

function printLymphocyte(P, {mark,memory,friend,sister,isoform}) {
  P.fill(memory?'#94b197':'#d2dcad');
  illustrated(P,g=>{
    forks.forEach(a=>{
      const p=radialPoint(a,0,5), h=radialPoint(a,.35,11.1);
      line(g,`M ${p.join(' ')} L ${h.join(' ')}`,stock.teal,1.45);
    });
  });
  layer(P, memory?'#376459':'#226964',cellBody);
  const skin=memory?'#83a37e':sister?['#7eae99','#61a89e','#a2ba83'][isoform]:'#62b6a0';
  layer(P,skin,cellInside);
  illustrated(P,g=>{
    const crescent='M 13 51 C 25 80 46 92 78 62 C 72 84 56 92 37 88 C 21 86 14 72 13 51 Z';
    fill(g,crescent,memory?'#547b6c':'#428980'); hatch(g,crescent,'#31726b',2.9,.75,.6);
    line(g,'M 18 43 Q 21 30 38 25 M 67 25 Q 75 29 77 37','#d2d3aa',1.2);
    marks(g,[[24,41,2.1,1.2,-.8],[21,48,1.4,1.3,0],[73,36,2,1.25,.8],[77,46,1.1,2,.15],[35,80,2.3,1.1,.4],[67,79,2.2,1.1,-.5],[73,68,1,1,0],[17,61,1.8,.95,-1.1]],stock.parchment);
  });
  layer(P,memory?'#656c64':sister?['#667e75','#3d7a77','#54765f'][isoform]:'#397775',bNucleus,.13);
  illustrated(P,g=>{
    const shadow='M 26 53 C 36 65 53 75 72 51 Q 74 83 48 80 C 33 81 23 70 26 53 Z';
    fill(g,shadow,memory?'#4d5f56':'#285855'); hatch(g,shadow,memory?'#8d9981':'#5b9389',3.2,.85,.65);
    line(g,'M 31 47 Q 34 35 46 34 M 49 33 Q 55 31 61 35','#add2b5',1.4);
    marks(g,[[30,53,1.25,1,0],[34,42,1.2,.95,-.7],[57,38,1,1,0],[45,70,1.5,.9,.25],[50,73,1,.9,0],[65,61,1.15,.8,-.65],[37,66,.9,.7,0]],'#8bb8a5');
    dot(g,42.3,48.3,2.7,3.35,'#193f3c'); dot(g,55.2,46.7,2.7,3.3,'#193f3c');
    dot(g,43,47.2,.88,1.14,'#f1e6bc'); dot(g,56,45.5,.83,1.06,'#f1e6bc');
    line(g,'M 44 56 Q 49 59 52 53','#244c46',1.55);
    if (!friend) sign(g,mark,61,67,1.06);
    if(isoform){
      const outer=isoform===1?'M 11 46 Q 17 43 18 39 M 80 31 L 87 30':'M 13 46 L 18 42 M 79 33 Q 82 29 86 30';
      line(g,outer,stock.straw,1.4);
    }
    if(friend){
      const sash='M 16 32 Q 18 27 23 25 Q 35 49 85 66 L 79 76 Q 29 58 16 32 Z';
      fill(g,sash,'#c55747');line(g,'M 20 30 Q 41 56 81 69','#ffc799',2.1);
    }
    if(memory){
      const seam='M 17 68 Q 39 91 76 68 L 71 77 Q 39 95 20 77 Z';
      fill(g,seam,'#d2a959');line(g,'M 22 74 Q 42 90 68 76',stock.straw,1.4);
      line(g,'M 20 71 Q 18 80 26 82 M 75 60 Q 82 56 82 46',stock.straw,1.3);
      for(let j=0;j<3;j++) line(g,`M ${24+j*4} 79 l 1 3`,stock.gold,1);
    }
  });
}


const rbcDie='M -15 50 C -12 26 14 10 42 6 C 73 1 102 12 110 33 C 119 58 96 82 69 93 C 41 104 6 98 -8 81 C -16 71 -18 61 -15 50 Z';
function printRbc(P,variant) {
  const palettes=[
    ['#b74940','#d86a50','#e88465','#a64441','#d49077'],
    ['#a94841','#ce5c49','#e17c61','#9d4040','#cb826c'],
    ['#ba5747','#e07557','#ed916f','#b04d47','#da9676']
  ];
  const [dark,mid,light,bowl,shine]=palettes[variant];P.fill(dark);
  layer(P,mid,'M -10 49 C -4 22 28 10 53 11 C 87 7 107 23 108 45 C 110 65 88 82 61 90 C 31 99 -4 89 -10 71 C -12 65 -14 55 -10 49 Z');
  illustrated(P,g=>{
    const shade='M -12 59 C -1 94 49 98 88 73 Q 106 64 109 44 Q 117 68 83 88 C 45 109 1 100 -10 77 Z';
    fill(g,shade,dark); hatch(g,shade,'#7e3d39',3.25,.75,.54);
    line(g,'M -4 45 C 6 23 29 16 48 14 M 55 13 Q 80 10 93 21',light,2.1);
  });
  layer(P,bowl,'M 14 55 C 17 39 39 30 57 30 C 78 29 87 39 85 48 C 82 62 59 74 40 75 C 23 76 9 68 14 55 Z');
  illustrated(P,g=>{
    const centre='M 20 58 C 32 45 55 40 72 41 Q 86 42 82 49 C 75 61 59 67 43 69 Q 24 71 20 58 Z';
    fill(g,centre,shine);line(g,'M 19 58 Q 26 40 56 36',dark,2.5);
    line(g,'M 28 64 C 38 68 59 65 72 55',light,1.35);
    line(g,'M -2 76 Q 7 85 18 88 M 91 68 Q 99 61 102 54',bowl,1.35);
  });
}


const macrophageDie='M 6 57 C -7 50 -9 37 -4 34 C 1 30 8 47 15 42 C 17 36 4 22 10 18 C 18 11 24 29 29 28 C 38 24 32 10 40 9 C 50 7 47 19 53 20 C 64 20 64 5 73 9 C 81 13 71 25 77 30 C 85 35 100 20 104 26 C 110 34 90 43 94 48 C 97 54 114 44 116 51 C 119 60 98 65 88 64 Q 92 73 102 73 C 107 77 100 83 86 82 C 79 81 78 89 69 93 C 49 105 27 97 20 88 C 17 82 11 85 3 89 C -5 92 -9 86 -5 79 C -3 72 6 71 9 66 Q 13 61 6 57 Z';
function printMacrophage(P) {
  P.fill('#ca7f62');
  layer(P,'#df9b78','M 5 52 Q 17 57 19 44 L 13 27 Q 26 44 32 32 Q 39 30 42 20 Q 48 38 59 28 L 69 18 Q 64 42 78 41 L 94 32 Q 79 51 88 54 L 107 52 Q 100 61 83 62 Q 74 69 91 75 L 80 75 Q 71 80 68 87 Q 60 94 45 94 Q 27 90 25 81 Q 18 73 5 82 L 16 69 Q 23 57 5 52 Z');
  const nucleus='M 31 51 C 38 38 50 36 57 44 C 62 50 53 54 57 58 C 60 61 75 53 76 62 C 78 71 63 81 49 80 C 29 79 23 67 31 51 Z';
  layer(P,'#8d5c62',nucleus,.13);
  illustrated(P,g=>{
    hatch(g,'M 28 64 Q 50 86 74 61 Q 70 84 46 82 Q 31 79 28 64 Z','#624c57',3,.9,.62);
    line(g,'M 32 53 Q 37 44 44 43',stock.blush,1.7);
    marks(g,[[23,53,3.6,3.8,0],[66,41,3.1,3.6,0],[81,50,2.5,2.4,0],[35,83,2.6,2.1,0],[68,82,2.8,2,0],[40,29,1.4,1.25,0],[16,62,1.5,2,0],[62,86,1.4,.9,0]],'#bc705e');
    marks(g,[[23,51.9,1.4,1.25,0],[65.5,40,1.3,1.2,0],[80.5,49.4,.9,.8,0],[67.6,81.3,1,.85,0]],'#f7ca99');
    line(g,'M 12 36 Q 20 57 31 42 M 74 35 Q 65 49 72 51 M 23 77 Q 28 90 49 92',stock.blush,1.4);
    dot(g,42.5,55,1.5,1.9,'#64444a');dot(g,50,54,1.5,1.9,'#64444a');
    line(g,'M 44 60 Q 47 63 50 59','#704951',1.15);
  });
}

const helperDie='M 36 14 L 34 8 L 38 6 L 42 13 Q 51 9 59 12 L 62 4 L 66 6 L 64 15 Q 75 17 82 24 L 89 19 L 92 22 L 86 29 Q 95 38 94 48 L 103 48 L 102 53 L 94 54 Q 96 65 88 74 L 93 82 L 89 84 L 84 78 Q 75 89 64 91 L 63 97 L 59 97 L 59 92 Q 40 101 24 87 L 18 91 L 15 88 L 21 83 Q 10 74 8 60 L 2 61 L 1 57 L 8 55 Q 5 42 13 32 L 9 25 L 12 23 L 17 28 Q 24 19 36 14 Z';
function printHelper(P) {
  P.fill('#bc8d50');
  const upper='M 46 17 C 65 11 83 24 88 39 C 99 63 80 84 64 87 C 49 96 27 84 18 73 C 8 56 13 38 22 29 Q 31 20 46 17 Z';
  layer(P,'#e5b85f',upper);
  layer(P,'#b88754','M 38 31 Q 54 24 66 34 C 80 44 78 66 64 73 C 48 83 31 76 26 64 C 19 51 25 38 38 31 Z');
  illustrated(P,g=>{
    fill(g,'M 25 53 Q 53 78 76 47 Q 82 76 55 78 Q 29 79 25 60 Z','#9e7054');
    hatch(g,'M 26 56 Q 47 82 75 54 Q 72 77 49 78 Q 31 73 26 60 Z','#80574c',3,.9,.52);
    line(g,'M 21 37 Q 32 21 47 22 M 32 43 Q 39 32 49 32',stock.straw,1.75);
    line(g,'M 78 35 Q 94 61 71 77','#a97d44',1.2);
    marks(g,[[23,54,1.9,1,0],[69,28,1.4,1,0],[75,70,2,1.2,-.8],[55,84,1.75,1,0],[59,83,1,.7,0]],stock.straw);
    dot(g,42,49,1.5,2.1,'#594a45');dot(g,54.5,47,1.5,2.1,'#594a45');
    line(g,'M 45 55 Q 49 58 52 53','#664f45',1.2);
  });
}

const plasmaDie='M 61 4 C 80 3 93 18 94 39 C 96 51 100 73 87 87 C 76 99 53 102 36 96 C 18 90 8 72 8 57 C 6 41 15 24 28 18 C 40 14 44 6 61 4 Z';
function printPlasma(P,mark) {
  P.fill('#487a70');layer(P,'#84ad91','M 59 9 C 78 6 88 19 89 39 C 91 54 95 72 82 84 C 66 99 40 94 27 81 C 15 71 11 53 20 36 C 30 20 46 17 59 9 Z');
  illustrated(P,g=>{
    // Repeated folded lamellae leave a pale perinuclear area beside the off-centre nucleus.
    for(let i=0;i<6;i++){
      const x=33+i*5.8,y=30-i*2.1;
      const d=`M ${x} ${y} C ${x+19} ${y-11} ${77+i*2.5} ${35+i} ${57+i*4.65} ${54+i*3.2}`;
      line(g,d,'#477e74',2.9);line(g,d,'#b7c5a3',1.15);
    }
    const wedge='M 85 54 Q 95 79 73 89 Q 47 101 32 87 Q 60 91 85 54 Z';
    fill(g,wedge,'#639584');hatch(g,wedge,'#48786e',3.7,.75,.65);
    dot(g,57,52,9,5.5,'#c6cbb1',-.4);
  });
  layer(P,'#79565f','M 22 61 C 25 50 40 46 50 54 C 61 62 61 76 49 82 C 34 90 16 77 22 61 Z');
  illustrated(P,g=>{
    for(let i=0;i<8;i++){
      const a=i*tau/8;
      dot(g,39+12*Math.cos(a),67+10.6*Math.sin(a),2.7,1.6,'#573d4c',a);
    }
    dot(g,39,67,3.1,2.7,'#956974');sign(g,mark,70,79,.8);
    line(g,'M 31 24 Q 41 19 51 16 M 15 52 Q 15 42 21 35','#d7d7ad',1.5);
  });
}

const fdcDie='M 43 98 L 44 76 C 34 68 24 63 10 66 L -8 74 L -12 70 L -1 62 L -18 62 L -17 57 L 5 56 Q 18 54 30 58 L 17 43 L -1 41 L -11 47 L -14 44 L -8 38 L -24 30 L -22 27 L -4 33 L -13 21 L -9 18 L 2 33 L 20 36 L 17 22 L 4 11 L 7 7 L 22 18 L 27 31 L 30 22 L 27 10 L 32 7 L 36 23 L 31 39 L 42 49 Q 48 53 50 43 L 50 19 L 43 10 L 46 7 L 54 14 L 58 3 L 62 4 L 59 19 L 57 41 L 66 32 L 68 16 L 72 10 L 76 12 L 72 24 L 89 17 L 95 8 L 99 9 L 95 18 L 106 16 L 107 21 L 91 24 L 73 35 L 64 49 L 77 46 L 94 35 L 99 27 L 102 29 L 100 35 L 116 31 L 119 34 L 106 41 L 118 45 L 116 48 L 100 44 L 87 52 L 98 56 L 115 54 L 118 58 L 108 61 L 116 66 L 113 69 L 95 62 L 79 60 Q 71 64 63 71 L 65 84 L 78 94 L 74 98 L 60 90 L 55 78 L 52 97 Z';
function printFdc(P){
  P.fill('#658f77');
  illustrated(P,g=>{
    const strands=['M 49 88 Q 52 65 41 57 Q 24 46 20 27','M 51 68 Q 58 54 84 51 L 102 41','M 49 57 Q 55 43 54 21','M 46 63 Q 26 57 6 62','M 57 60 Q 68 41 83 29','M 42 55 Q 23 42 1 37'];
    strands.forEach(d=>line(g,d,'#bad0a0',1.65));
  });
  const soma='M 38 52 Q 42 49 48 52 Q 56 43 60 48 Q 63 52 63 55 Q 74 55 69 62 Q 63 65 58 66 Q 58 77 52 74 Q 48 72 47 67 Q 34 72 34 65 L 39 61 Q 31 57 38 52 Z';
  layer(P,'#8cb09a',soma);
  layer(P,'#786067',ellipse(51,61,8,5.9));
  illustrated(P,g=>{
    marks(g,[[-7,37,3.5,2.5,.3],[19,28,3.1,2.4,-.7],[54,22,3,2.4,.2],[72,26,2.7,2,0],[94,22,3.6,2.5,-.5],[102,41,3.3,2.3,-.15],[104,59,3.2,2.0,.15],[11,58,3.1,2.35,0]],stock.gold);
    line(g,'M 47 61 Q 50 57 54 59',stock.blush,1.2);
  });
}

const follicleDie='M -12 97 C -15 78 -13 55 -4 38 C 10 13 26 6 50 6 C 71 3 94 14 106 35 C 118 52 119 78 113 97 Q 95 101 75 96 Q 54 101 30 96 Q 8 100 -12 97 Z';
function printFollicle(P,variant){
  const palettes=[
    ['#5d8e7e','#8faf92','#d0cba0','#a5b79a'],
    ['#9c746f','#cd9a87','#dec3a4','#b88d83'],
    ['#677b83','#9bafaa','#cec9a7','#93a39a']
  ];
  const [outer,mantle,core,shadow]=palettes[variant];P.fill(outer);
  const border='M -7 94 C -12 64 1 35 18 22 C 34 11 53 9 70 15 Q 110 25 112 66 L 109 94 Q 95 96 76 91 Q 54 98 30 91 Q 10 96 -7 94 Z';
  layer(P,mantle,border);
  const centre='M 12 93 C 5 68 11 49 23 39 C 36 28 53 25 73 35 C 91 44 102 62 97 88 Q 73 90 62 88 Q 42 94 31 90 Z';
  layer(P,core,centre,.12);
  illustrated(P,g=>{
    const shade='M 8 64 Q 4 85 20 93 Q 41 92 53 89 Q 78 94 100 83 L 97 93 Q 76 91 65 94 Q 36 95 29 93 L 9 95 Z';
    fill(g,shade,shadow);hatch(g,shade,'rgba(61,86,69,.55)',4,.8,.5);
    for(let i=0;i<18;i++){
      const a=Math.PI+i*Math.PI/17;
      const x=51+54*Math.cos(a),y=68+46*Math.sin(a);
      dot(g,x,y,3,2.55,outer,a);dot(g,x-.6,y-.3,1.55,1.28,mantle,a);
    }
    const net=['M 20 78 Q 30 65 41 64 T 62 50','M 28 89 Q 37 78 41 64 Q 45 53 40 43','M 41 64 Q 55 67 65 77 L 74 88','M 65 77 Q 67 62 82 58','M 65 77 L 87 79','M 40 64 Q 29 61 24 49'];
    net.forEach(d=>line(g,d,'rgba(125,131,101,.69)',1.35));
    for(let i=0;i<11;i++){
      const x=28+(i*23)%52, y=46+(i*21)%37;
      dot(g,x,y,1.9,1.6,shadow,i);dot(g,x-.2,y+.15,.78,.68,outer);
    }
    line(g,'M 2 42 Q 18 13 47 13 M 53 11 Q 75 12 89 25',stock.parchment,1.6);
  });
}

const branchDie='M 31 99 C 44 76 40 60 30 47 C 20 34 7 40 -5 24 Q -9 17 -3 18 C 8 26 18 29 25 30 Q 24 17 16 8 Q 17 4 22 8 Q 38 22 36 38 Q 42 45 47 50 Q 48 31 43 14 Q 44 8 48 13 Q 56 25 55 38 Q 65 31 71 17 L 76 11 Q 80 11 78 17 C 73 34 65 44 57 51 Q 52 56 54 63 Q 70 61 82 43 L 89 35 Q 94 32 92 39 Q 86 52 80 59 Q 94 58 105 49 Q 110 47 109 52 C 100 63 86 69 74 71 Q 62 75 57 87 L 54 99 Z';
function printBranch(P,variant){
  const base=['#517c70','#a67065','#847561'][variant],bright=['#9fb79a','#e0ae8e','#b7ad88'][variant];
  P.fill(base);
  illustrated(P,g=>{
    ['M 38 97 Q 50 73 45 58 Q 41 44 25 35 L 4 25','M 42 98 Q 55 76 50 55 Q 55 42 69 31','M 49 97 Q 53 77 69 69 Q 81 66 87 59','M 46 55 Q 54 39 47 24','M 32 38 Q 30 25 25 18'].forEach(d=>line(g,d,bright,2));
    hatch(g,'M 31 94 L 45 64 L 41 48 L 50 61 L 49 81 L 43 99 Z','rgba(58,65,48,.52)',3.3,.9,.36);
  });
}

const boneDie='M -14 98 C -10 83 -3 72 5 68 C 17 61 23 48 22 37 Q 20 21 8 17 C 1 14 -5 20 -10 15 L -12 8 Q 6 0 19 7 Q 36 15 39 32 Q 48 42 55 36 Q 64 31 66 17 Q 64 9 75 4 L 90 4 Q 78 15 80 26 Q 83 37 95 39 C 108 40 115 33 119 38 L 119 48 C 105 53 96 50 88 53 Q 74 59 79 74 Q 82 87 102 98 L 84 98 Q 69 93 63 78 Q 57 64 47 66 Q 32 67 31 83 L 33 98 L 18 98 L 17 86 Q 7 85 3 98 Z';
function printBone(P,variant){
  P.fill(variant===1?'#b87965':'#c0976d');
  const plate='M -10 96 Q -2 75 12 67 Q 34 54 29 30 L 17 12 Q 32 18 35 34 Q 41 49 53 45 Q 70 40 73 22 L 71 11 Q 78 5 83 8 Q 72 29 86 41 Q 96 50 111 42 L 116 44 Q 104 49 92 48 Q 73 50 71 63 Q 69 80 88 94 Q 74 92 68 74 Q 60 55 46 60 Q 28 63 26 82 L 27 96 L 22 96 L 21 80 Q 7 75 1 96 Z';
  layer(P,variant===1?'#e1a285':'#e4c294',plate);
  illustrated(P,g=>{
    const d='M 21 97 L 20 82 Q 8 79 0 96 M 26 60 Q 40 49 35 35 M 66 53 Q 76 44 77 38 M 61 64 Q 69 67 71 79 L 80 91';
    line(g,d,'#946d51',1.4);
    const pores=[[16,71,2.8,1.4,-.5],[20,68,1.3,1,-.7],[35,54,2.5,1.3,-1],[31,58,1.2,.8,-.6],[39,47,1.7,1,0],[66,40,2.2,1.1,-.8],[74,14,1.35,.9,-1],[73,64,1.9,1,-1.1],[77,84,1.9,1,.8],[82,89,1.2,.8,.8],[81,48,2,1,-.3],[27,25,1.8,.9,1],[26,21,1.2,.8,1]];
    marks(g,pores,'#ac805e');
    line(g,'M 1 12 Q 14 7 23 17 M 44 58 Q 54 53 60 57 M 84 45 Q 96 49 107 44','#f3d7ac',1.6);
  });
}

const cryptDie='M -12 98 L -10 31 C -8 20 5 15 17 19 Q 33 22 37 38 L 42 65 Q 45 72 51 65 L 54 40 Q 52 24 62 13 C 72 1 95 4 103 16 Q 111 26 110 41 L 110 97 Z';
function printCrypt(P){
  P.fill('#a66d6c');
  const epithelium='M -10 32 C -8 17 9 17 18 21 Q 33 24 34 42 L 37 64 Q 41 79 49 74 Q 57 72 59 58 L 61 37 Q 59 20 70 13 Q 86 4 99 16 Q 106 23 106 37 L 96 40 Q 95 24 85 23 Q 75 22 73 39 L 69 66 Q 64 90 45 91 Q 26 88 24 68 L 20 43 Q 15 28 3 32 L -8 41 Z';
  layer(P,'#dfa38a',epithelium,.14);
  illustrated(P,g=>{
    const band='M -11 61 Q 7 48 18 68 Q 23 93 45 96 Q 72 93 77 69 Q 84 44 108 49 L 108 96 L -12 97 Z';
    fill(g,band,'#bf8180');hatch(g,band,'#a56f72',4,.9,.6);
    for(let i=0;i<10;i++){
      const t=i/9;const x=5+32*t,y=26+48*Math.pow(t,2.2);
      dot(g,x,y,1.4,2.2,'#af7472',-t*.7);
    }
    for(let i=0;i<11;i++){
      const t=i/10;const x=62+30*t,y=65-47*Math.sin(t*Math.PI*.76);
      dot(g,x,y,1.5,2.5,'#af7472',t);
    }
    line(g,'M -2 22 Q 24 9 33 39 M 39 72 Q 51 82 57 62 M 66 21 Q 78 5 93 13','#f1c5a0',1.8);
  });
}


const reedDie='M 29 98 Q 23 74 12 53 C 2 38 -3 24 2 25 Q 14 30 25 50 L 35 75 Q 29 54 28 34 Q 25 12 32 5 C 38 8 37 23 41 37 Q 44 49 45 66 Q 50 41 60 22 Q 65 12 69 14 C 75 20 61 46 57 64 Q 65 53 79 42 C 89 35 91 40 86 48 Q 69 65 60 84 Q 57 89 56 98 Z';
function printReed(P,variant){
  const palettes=[['#618173','#a9b695'],['#b67b71','#deb393'],['#8a9279','#c2be96']];
  const [base,light]=palettes[variant];P.fill(base);
  illustrated(P,g=>{
    ['M 36 98 Q 29 61 6 32','M 41 96 Q 38 56 32 15','M 47 95 Q 49 59 67 22','M 53 94 Q 64 67 80 49'].forEach(d=>line(g,d,light,1.8));
    line(g,'M 37 91 Q 29 71 24 64 M 47 80 Q 56 55 59 48','rgba(51,80,63,.55)',1.15);
    marks(g,[[31,37,1.1,2,-.1],[34,48,1.25,2.3,-.2],[59,41,1,2.2,.4],[20,55,1.4,2,-.6]],light);
  });
}

const antibodyDie='M 40 97 L 40 60 L 28 46 L 6 19 L 7 13 L 15 7 L 22 9 L 46 36 L 51 41 L 57 35 L 79 8 L 86 7 L 95 14 L 94 19 L 71 48 L 59 61 L 59 97 Z';
function printAntibody(P,variant){
  P.fill('#c3914d');
  illustrated(P,g=>{
    fill(g,'M 9 15 L 17 9 L 50 47 L 84 9 L 92 16 L 56 57 L 56 94 L 44 94 L 44 57 Z',stock.gold);
    fill(g,'M 8 16 L 17 9 L 28 21 L 19 29 Z M 74 20 L 84 9 L 93 16 L 81 29 Z',stock.straw);
    line(g,'M 16 14 L 48 51 L 48 93 M 86 15 L 53 52 L 53 91','#fff0ad',1.8);
    line(g,'M 24 26 L 34 38 M 77 26 L 66 38','#907350',1.7);
    for(let i=0;i<4;i++)line(g,`M 45 ${66+i*6} l 9 -3`,'#a87a43',1.4);
    imprint(g,variant,12.4,11.3,12,12,'#8c6943',stock.straw);
    imprint(g,variant,78.8,10.9,12,12,'#8c6943',stock.straw);
  });
}

const mhcDie='M 17 95 L 21 72 Q 12 58 12 45 L 11 33 Q 11 22 19 17 Q 28 10 32 16 L 32 35 Q 34 47 47 48 Q 59 49 64 41 L 69 19 Q 72 13 81 17 Q 90 20 87 33 L 82 52 Q 79 65 69 72 L 72 95 L 58 96 L 55 74 L 42 75 L 35 97 Z';
function printMhc(P){
  P.fill('#527d76');
  layer(P,'#8bb2a1','M 16 38 Q 14 22 26 19 L 27 37 Q 31 54 47 55 Q 64 57 70 43 L 76 20 Q 83 19 83 27 L 76 52 Q 71 66 58 69 L 41 69 Q 23 66 16 48 Z');
  illustrated(P,g=>{
    line(g,'M 19 39 Q 19 60 43 65 M 74 50 Q 71 61 61 64','#cfcea2',1.7);
    hatch(g,'M 43 69 L 59 68 L 68 92 L 58 94 L 55 74 L 42 74 L 35 96 L 23 96 L 36 70 Z','#467166',3.8,1,.6);
  });
}

const venuleDie='M -12 98 L -10 63 C -9 24 19 5 50 6 C 81 3 111 27 111 61 L 111 98 L 89 98 L 88 67 C 86 45 72 32 51 33 C 31 32 13 48 13 69 L 11 98 Z';
function printVenule(P){
  P.fill('#a86667');
  const rim='M -7 96 L -6 63 C -7 29 20 11 50 11 C 83 6 106 31 106 61 L 106 96 L 93 96 L 92 66 C 90 42 73 26 51 27 C 26 25 10 46 9 68 L 7 97 Z';
  layer(P,'#d69a89',rim);
  illustrated(P,g=>{
    for(let i=0;i<=12;i++){
      const a=Math.PI+i*Math.PI/12;
      const x=50+52*Math.cos(a),y=67+47*Math.sin(a);
      g.save();g.translate(x,y);g.rotate(a);dot(g,0,0,3.0,5.5,'#ad7579');dot(g,-.7,-.8,1,2.5,'#7d626f');g.restore();
    }
    line(g,'M -2 55 Q 2 21 37 16 M 72 18 Q 99 30 102 54',stock.blush,1.7);
  });
}


const fanDie='M -6 56 Q -6 42 10 40 Q 6 23 24 26 Q 25 11 40 17 Q 46 5 59 15 Q 73 6 78 21 Q 96 17 98 33 Q 111 31 109 46 L 61 94 L 47 98 Z';
function printFan(P,mark){
  P.fill('#b98c5d');
  const segments=[
    ['#c7a979','M 0 52 L 12 43 L 51 92 Z'],
    ['#e8ca8c','M 12 42 L 23 30 L 52 92 Z'],
    ['#8ca68e','M 22 30 L 39 21 L 52 92 Z'],
    ['#b2c39a','M 39 20 L 55 19 L 53 92 Z'],
    ['#cf9d7a','M 57 19 L 74 23 L 54 92 Z'],
    ['#e5b789','M 75 24 L 92 35 L 54 92 Z'],
    ['#a7aaa0','M 93 35 L 103 43 L 56 92 Z']
  ];
  illustrated(P,g=>{
    for(const [c,d] of segments) fill(g,d,c);
    for(const [x,y] of [[13,43],[24,31],[39,22],[57,21],[74,25],[91,36]])line(g,`M ${x} ${y} L 53 90`,'#7e785f',1.0);
    for(const [x,y,r] of [[25,43,5],[44,34,5],[62,34,5],[80,42,5]]){
      dot(g,x,y,r,r,'#53867c');dot(g,x+.6,y+.4,r*.59,r*.56,stock.violet);sign(g,mark,x+1.4,y+1.6,.19);
    }
    line(g,'M 47 90 Q 53 92 62 86',stock.straw,2);
  });
}

const ebvDie='M 27 13 L 44 4 L 63 8 L 79 17 L 92 35 L 90 55 L 83 74 L 64 88 L 48 95 L 27 86 L 11 73 L 5 53 L 9 32 Z';
function printEbv(P){
  P.fill('#998993');
  const face='M 29 18 L 46 10 L 63 14 L 77 23 L 86 39 L 84 55 L 77 70 L 61 82 L 48 88 L 30 79 L 16 68 L 11 52 L 16 34 Z';
  layer(P,'#bdabb2',face);
  illustrated(P,g=>{
    const network='M 29 18 L 31 43 L 16 68 M 31 43 L 52 25 L 46 10 M 52 25 L 75 39 L 77 23 M 75 39 L 72 62 L 84 55 M 72 62 L 48 76 L 48 88 M 48 76 L 31 43 M 31 43 L 72 62 M 31 43 L 52 25 L 72 62';
    line(g,network,'#887687',1.55);
    dot(g,52,50,12,10,'#8a7687',-.3);
    line(g,'M 44 50 Q 47 43 53 48 T 60 50 Q 58 57 53 52 T 44 50','#ddcbbd',1.65);
    line(g,'M 18 34 L 30 20 L 43 14', '#e7d9c4',1.8);
  });
}


const signalDie='M 48 5 Q 53 1 57 9 L 74 34 C 88 53 77 73 59 78 Q 39 83 26 68 C 14 52 23 35 35 21 Z';
function printSignal(P,variant){
  P.fill(variant===1?'#bb8646':'#5f9989');
  const facet='M 50 12 L 62 30 Q 70 42 68 54 Q 66 70 50 73 C 37 72 29 65 28 56 Q 26 44 35 32 Z';
  layer(P,variant===1?'#e5ba6a':'#9ec5a6',facet);
  illustrated(P,g=>{
    line(g,'M 50 16 Q 34 41 33 49 M 55 18 Q 73 40 64 59','#ead3a1',1.4);
    hatch(g,'M 29 58 Q 36 71 49 70 Q 64 67 68 50 Q 73 70 56 75 Q 38 80 29 64 Z',variant===1?'#b08446':'#578a77',3.1,.85,.58);
    if(variant===1){dot(g,48,48,4.9,4.9,stock.straw);dot(g,48,48,2,2,stock.amber);}
    else line(g,'M 40 49 Q 47 39 53 46 Q 56 50 59 45',stock.foam,2.1);
  });
}
// The branched lines run behind the cut face and emerge through its hilum.
const nodeDie='M 2 60 C -12 42 -5 22 13 11 C 35 -4 72 0 88 10 C 106 20 110 31 100 41 C 95 47 80 43 77 51 C 73 59 93 58 98 66 C 104 78 90 91 68 96 C 40 103 13 91 2 70 Z';
function vessel(g,d,edge,face,light,width) {
  line(g,d,edge,width+2); line(g,d,face,width); line(g,d,light,Math.max(.8,width*.25));
}
function rosette(g,x,y,r,palette,rot=0) {
  const [rim,mantle,core]=palette;
  at(g,x,y,1,.88,rot,()=>{
    dot(g,0,0,r,r,rim); dot(g,-.1,-.6,r*.82,r*.80,mantle);
    dot(g,.45,-.7,r*.56,r*.54,core);
    for (let n=0;n<12;n++) {
      const a=n*tau/12+.13;
      dot(g,Math.cos(a)*r*.72,Math.sin(a)*r*.72-.5,r*.106,r*.066,n%3?rim:core,a);
    }
    for (let n=0;n<5;n++) {
      const a=n*2.4;
      dot(g,Math.cos(a)*r*(.11+.056*n),Math.sin(a)*r*(.11+.056*n)-.8,r*.085,r*.06,mantle,a);
    }
  });
}
function lymphNode(g) {
  vessel(g,'M 81 54 Q 99 48 103 36 T 116 23','#625f4c','#d49463','#f6d5a0',3);
  vessel(g,'M 77 55 C 97 57 111 49 115 40','#53635b','#7e9d96','#cad7ba',4);
  vessel(g,'M 77 55 C 98 57 102 65 117 63','#856052','#be6d56','#efad80',3.3);
  for (const [d,w] of [
    ['M 3 45 Q -8 47 -18 44 M -10 46 L -14 53',2.5],
    ['M 28 9 Q 24 2 19 -3 M 23 3 L 24 -3',2],
    ['M 21 84 Q 10 89 6 97 M 12 91 L 6 90',2.4]
  ]) vessel(g,d,'#73856b','#adc19d','#e6d8a6',w);
  cardboard(g,nodeDie,p=>{
    p.fill('#477a6b');
    at(g,3,4,.925,.914,0,()=>{fill(g,nodeDie,'#aec59c');line(g,nodeDie,'#dfd4a0',1.2);});
    at(g,8,9,.826,.797,0,()=>{fill(g,nodeDie,'#6e9b86');line(g,nodeDie,'#537d6e',1.2);});
    const medulla='M 15 70 Q 21 51 36 52 Q 36 34 51 24 Q 49 35 52 38 Q 63 27 78 28 Q 72 37 60 42 Q 67 46 85 38 L 76 49 Q 67 54 60 54 Q 67 61 85 62 L 84 68 Q 66 70 58 65 Q 42 82 25 81 Q 30 74 33 68 Q 27 67 18 74 Z';
    fill(g,medulla,'#4b7663');hatch(g,medulla,'#355f57',3,.72,.82);
    ['M 25 73 Q 40 56 56 50 Q 73 47 83 48','M 41 58 Q 47 44 48 33','M 52 54 Q 56 64 65 67','M 61 47 Q 68 36 75 33','M 50 61 Q 41 73 36 77'].forEach(d=>line(g,d,'#e0ca87',1.45));
    const follicles=[[11,49,6.5],[16,30,8],[31,18,7.4],[48,13,6.9],[65,16,8],[82,23,6.8],[17,67,7],[28,81,7.4],[43,86,6.2],[59,85,7.7],[76,79,6.7],[88,72,4]];
    follicles.forEach(([x,y,r],k)=>rosette(g,x,y,r,['#416f60','#cbac68','#f6d899'],k*.45));
    for (let n=0;n<40;n++) {
      const a=n*2.39, x=47+Math.cos(a)*(18+n%20), y=50+Math.sin(a)*(12+n%16);
      if(x<70) dot(g,x,y,.52,.38,n%3?'#acca9c':'#526e5d',a);
    }
    line(g,'M 1 43 Q 3 21 24 11 M 34 7 Q 55 2 71 8 M 88 80 Q 77 91 59 93','#e3dab1',1.4);
  },{weight:.8,thickness:2.5});
}
function lymphocyte(g,kind,{target,variant,mark,marked}) {
  const friend=kind==='friend', memory=kind==='memory', sister=kind==='sister';
  if (friend) {
    const tail='M 73 66 Q 82 70 99 64 L 95 72 L 100 76 Q 86 82 70 74 Z';
    cardboard(g,tail,p=>{p.fill('#bc5747');line(g,'M 79 73 Q 87 75 94 70','#efaa7d',1.3);},{edge:'coral',weight:.8});
  }
  cardboard(g,receptorOutline,p=>printLymphocyte(p,{mark,memory,friend,sister,isoform:sister?variant%3:0}),{weight:1.15,thickness:2.2});
  if (sister) {
    const thread=['#d89776','#d0ad66','#8fbba5'][variant%3];
    line(g,'M 31 78 Q 45 89 61 82',thread,2.3);
    for (let i=0;i<=variant%3;i++) line(g,'M '+(39+i*5)+' 80 l -1.2 3.3',stock.parchment,1.45);
  }
  // One enlarged receptor has the same silhouette, orientation and three-note
  // identity as the native protein swatch used in each recognition encounter.
  line(g,'M 60 21 Q 66 13 74 9','#356556',4);
  line(g,'M 60 20 Q 68 11 74 9','#ddd99e',1.55);
  const back=ovalPath(73,7,11.2,10.4);
  cardboard(g,back,p=>{
    p.fill('#715b39');dot(g,72.7,6.6,9.8,8.9,'#244b46');
    const site=friend?(target+1)%3:target;
    const sw=sister?[12.5,20.2,22][variant%3]:22;
    const sh=sister?[20.7,18.3,21.9][variant%3]:21.9;
    imprint(g,site,72.8-sw/2,6.6-sh/2,sw,sh,'#f9d284');
    line(g,'M 64 7 Q 65 -.8 74 -1.5','#d9b569',.82);
  },{weight:.72,thickness:1});
  if (friend&&marked) {
    at(g,77,55,.19,.19,-.23,()=>cardboard(g,ebvDie,printEbv,{edge:'plum',weight:.6}));
  }
}
function antigen(g,variant) {
  // All antigens use the same ink. The player reads their border.
  at(g,-7,-5,2.38,2.38,0,()=>{
    const die=motifs[variant];
    cardboard(g,die,p=>{
      p.fill('#edbc67');
      hatch(g,die,'rgba(156,103,56,.42)',2.1,.44,.56);
      const crease=[
        'M 8 30 Q 17 24 23 27 Q 20 19 17 16 M 24 27 Q 30 22 37 25 M 24 27 Q 23 36 21 40 M 25 28 Q 32 34 37 31',
        'M 15 19 Q 8 31 22 39 M 14 24 Q 13 34 23 37',
        'M 24 6 L 23 22 L 26 42 M 11 23 L 23 22 L 39 21',
        'M 10 16 L 23 38 L 18 10 M 23 38 L 25 12 M 24 38 L 34 11 M 25 38 L 41 19',
        'M 12 16 Q 20 5 31 12 M 14 34 Q 22 41 31 36 M 34 19 Q 36 24 33 30'
      ][variant];
      line(g,crease,'#a57543',1.23);line(g,crease,'#fce1a3',.49);
      line(g,die,'#ffe9ad',2.1);
      if(variant===2) {
        fill(g,'M 24 7 L 39 21 L 23.8 21.5 Z','rgba(255,231,157,.72)');
        fill(g,'M 25.6 40 L 24 22.6 L 38.6 21.7 Z','rgba(154,98,56,.45)');
      }
    },{edge:'gold',weight:.66,thickness:1.05});
  });
}
function marrow(g) {
  const matrix='M -3 94 Q 5 82 10 73 Q 14 62 11 53 Q 6 42 17 26 Q 23 20 30 23 Q 47 39 57 26 Q 78 4 93 12 Q 105 20 104 42 L 99 56 Q 95 64 109 74 L 108 94 Q 96 99 77 93 Q 60 89 46 96 Q 24 88 10 97 Z';
  cardboard(g,matrix,p=>{
    p.fill('#ba776b');
    const pockets=[[26,47,13,15],[73,38,23,15],[52,77,16,12],[91,72,12,9],[18,78,8,7]];
    pockets.forEach(([x,y,rx,ry],k)=>{
      dot(g,x,y,rx,ry,k%2?'#d19b84':'#d6a88d',-.29);
      for(let i=0;i<7;i++){
        const a=i*2.39, r=.36+(i%4)*.1;
        const cx=x+Math.cos(a)*rx*r, cy=y+Math.sin(a)*ry*r;
        dot(g,cx,cy,2.6,2.1,i%3?'#986b74':'#f2c7a6',a);
        if(i%3) dot(g,cx+.2,cy,1.15,1.05,'#775864',a);
      }
    });
    hatch(g,matrix,'rgba(136,84,75,.20)',3,.55,.6);
  },{edge:'coral',weight:.8});
  cardboard(g,boneDie,p=>printBone(p,0),{edge:'gold',weight:.63,thickness:1.5});
}
function membrane(g,target) {
  const body='M 7 50 C 6 29 21 14 49 12 C 74 10 91 22 96 43 C 103 67 92 84 71 92 C 46 101 19 88 10 71 Q 6 61 7 50 Z';
  cardboard(g,body,p=>{
    p.fill('#528a76');
    const inset='M 15 49 C 16 29 33 19 54 19 C 76 18 86 31 89 49 Q 92 76 69 85 Q 37 97 20 74 Q 14 65 15 49 Z';
    layer(p,'#a6c2a0',inset);
    hatch(g,'M 12 56 Q 29 86 57 85 Q 78 84 90 65 Q 79 97 52 95 Q 22 92 12 63 Z','#5f927b',3.2,.73,.5);
    ['M 17 43 Q 20 32 31 27','M 73 28 Q 84 32 86 44','M 24 75 Q 31 82 44 83'].forEach(d=>line(g,d,'#e1d7aa',1.3));
    const well='M 25 49 C 31 39 43 45 54 48 Q 65 49 73 40 Q 87 49 81 62 Q 71 79 51 78 Q 29 78 23 63 Q 20 57 25 49 Z';
    layer(p,'#42796d',well);
    imprint(g,target,34,48,27,27,'#f0c672');
    line(g,'M 57 65 l 6 -3 6 2 6 -4','#e6a27d',2.7);
  });
  const lip='M 25 44 Q 27 25 45 17 Q 60 11 75 16 Q 85 23 88 34 Q 70 37 57 48 Q 44 55 26 53 Z';
  cardboard(g,lip,p=>{
    p.fill('#78a98c');
    fill(g,'M 25 44 Q 48 42 61 31 Q 73 21 86 27 L 88 34 Q 71 37 57 48 Q 42 54 26 53 Z','#b5c7a2');
    line(g,'M 29 42 Q 47 41 61 30 Q 74 20 82 23','#e7dbae',1.8);
  },{weight:.65,thickness:1.4});
}
function mhc(g) {
  cardboard(g,mhcDie,printMhc);
  const peptide='M 25 30 Q 32 25 42 32 Q 48 38 54 33 Q 64 26 76 31 L 74 37 Q 66 33 57 41 Q 48 47 39 39 Q 33 33 27 37 Z';
  cardboard(g,peptide,p=>{
    p.fill('#d68665');
    line(g,'M 28 32 Q 35 28 41 34 T 55 36 Q 65 29 72 33','#fbd39a',1.7);
  },{edge:'coral',weight:.72,thickness:.8});
}
function trail(g) {
  const dots=[[16,82,.16],[32,68,.29],[28,48,.20],[50,34,.35],[70,27,.18],[86,9,.27]];
  dots.forEach(([x,y,s],i)=>at(g,x-s*51,y-s*43,s,s,Math.sin(i)*.32,()=>{
    cardboard(g,signalDie,p=>printSignal(p,0),{weight:1.8});
  }));
}
function origin(g) {
  // A cutaway medullary cavity with a small, folded field-note tag.
  const section='M 11 65 C 17 51 29 48 45 36 Q 57 29 60 15 Q 63 2 76 4 Q 81 8 80 13 Q 88 13 93 18 Q 101 29 91 35 Q 80 39 72 47 L 43 78 Q 37 86 38 91 Q 37 102 25 99 Q 19 98 18 93 Q 12 96 7 90 Q 1 81 6 76 Q 11 70 11 65 Z';
  cardboard(g,section,p=>{
    p.fill('#d7b17e');
    const core='M 14 76 Q 23 62 41 52 L 65 32 Q 70 28 75 18 Q 81 11 86 23 Q 90 30 79 36 Q 67 46 60 55 L 39 78 Q 29 92 23 88 Q 14 88 14 76 Z';
    layer(p,'#b86e68',core);
    ['M 17 78 L 26 80 L 26 66 M 26 79 L 36 67 L 32 60','M 37 66 L 48 58 L 46 50 M 47 57 L 58 48 L 54 43','M 60 46 L 64 35 L 73 36 M 64 35 L 72 27 L 79 29'].forEach(d=>line(g,d,'#f0c79a',2.7));
    line(g,'M 13 73 C 23 53 37 51 50 38 Q 62 29 66 15','#f8dca7',1.7);
  },{edge:'coral'});
  const tag='M 51 76 L 61 63 L 89 67 L 92 89 L 61 88 Z';
  cardboard(g,tag,p=>{
    p.fill('#ded1a6');line(g,'M 62 69 L 81 72 M 63 75 L 83 78 M 66 82 L 80 83','#a79268',1.3);
    dot(g,57,76,1.65,1.6,'#ae885d');
  },{edge:'gold',weight:.65,thickness:.8});
  line(g,'M 57 76 Q 43 73 46 62','#a48659',1.65);
}
function years(g) {
  const wing='M 5 72 C 22 66 37 67 50 74 C 62 64 76 63 96 62 L 86 20 C 75 20 61 23 48 32 Q 31 25 18 33 Z';
  for (let i=3;i>=0;i--) {
    at(g,4+i*2,10-i*2,.89,.98,-i*.085,()=>{
      cardboard(g,wing,p=>{
        p.fill(['#e4d5aa','#c5a787','#d5b286','#c39375'][i]);
        line(g,'M 49 34 L 49 70',i?'#997b60':'#aa9165',1.45);
        if(i===0) {
          ['M 16 58 C 25 46 27 45 35 42 M 20 60 Q 32 45 38 45','M 56 54 Q 67 43 78 45 M 57 50 Q 68 38 78 40','M 64 61 Q 68 52 79 53'].forEach(d=>line(g,d,'#a98c66',1.45));
          line(g,'M 18 36 Q 34 29 46 36 M 56 32 Q 67 25 81 24','#f7e6b3',1.9);
        }
      },{edge:'gold',weight:.63});
    });
  }
}
function family(g,mark) {
  cardboard(g,branchDie,p=>printBranch(p,0),{weight:.8});
  [[4,22,.81],[23,15,.74],[48,14,.78],[73,19,.83],[89,43,.78]].forEach(([x,y,s],i)=>{
    at(g,x,y,s,s,0,()=>{
      const shape=ovalPath(0,0,8,7.2);
      cardboard(g,shape,p=>{
        p.fill(i%2?'#72a891':'#589489');
        dot(g,-.6,.35,4.6,4.2,'#345f5a');sign(g,mark,1,1.65,.42);
      },{weight:.7,thickness:1});
    });
  });
}
function vellum(g,marked) {
  const leaf='M 8 25 Q 30 10 68 16 L 82 19 Q 90 36 91 74 Q 61 72 27 90 L 16 83 Q 16 50 8 25 Z';
  at(g,9,-6,1,1,.075,()=>cardboard(g,leaf,p=>{
    p.fill('#adab8c');line(g,'M 26 71 Q 52 59 77 59','#d6c8a3',1.3);
  },{weight:.75}));
  cardboard(g,leaf,p=>{
    p.fill('#d5cfaf');
    fill(g,'M 11 26 Q 42 13 73 20 Q 45 24 25 36 L 19 75 Z','#eee3bf');
    fill(g,'M 16 80 Q 62 59 86 64 L 91 74 Q 54 73 27 90 Z','#bbb99d');
    if(marked)at(g,31,28,.39,.39,-.08,()=>cardboard(g,ebvDie,printEbv,{edge:'plum',weight:.8}));
    line(g,'M 16 26 Q 39 15 61 18 M 29 83 Q 53 72 78 69','#fff1c8',1.8);
  },{edge:'gold',weight:.8});
}
const palettes = new Set(['rbc','reed','branch','bone','follicle','sister']);
const receptorKinds=new Set(['hero','friend','sister','memory','antibody','fdc','membrane']);
const familyKinds=new Set(['hero','sister','plasma','memory','fan','family']);
const aliases={bcell:'hero',tfh:'helper',crypt:'tonsil',hev:'venule',reeds:'reed',tab:'venule',garden:'fan',
  il21:'signal',cxcl13:'trail',fh:'fdc',lymphnode:'node',spleen:'origin',tree:'family',ebv:'virus'};
function paint(g,kind,opt) {
  const {variant,target,mark,marked}=opt;
  switch(kind){
    case 'hero':case 'friend':case 'sister':case 'memory':return lymphocyte(g,kind,opt);
    case 'plasma':return cardboard(g,plasmaDie,p=>printPlasma(p,mark));
    case 'helper':return cardboard(g,helperDie,printHelper,{edge:'gold'});
    case 'macrophage':return cardboard(g,macrophageDie,printMacrophage,{edge:'coral',thickness:2.25});
    case 'rbc':return at(g,5,8,1,.81,-.098,()=>cardboard(g,rbcDie,p=>printRbc(p,variant),{edge:'coral',thickness:2.5}));
    case 'antigen':return antigen(g,variant);
    case 'fdc':
      cardboard(g,fdcDie,printFdc,{weight:.75});
      for (const [x,y,s] of [[-4,33,.18],[53,17,.21],[99,21,.16]]) {
        at(g,x-s*48,y-s*48,s,s,0,()=>antigen(g,target));
      }
      return;
    case 'node':return lymphNode(g);
    case 'follicle':return cardboard(g,follicleDie,p=>printFollicle(p,variant));
    case 'marrow':return marrow(g);
    case 'bone':return cardboard(g,boneDie,p=>printBone(p,variant),{edge:'gold',weight:.8});
    case 'tonsil':return cardboard(g,cryptDie,p=>{
      printCrypt(p);
      [[8,80,6.3],[21,89,4.1],[87,72,7.2],[97,84,5.1]].forEach(([x,y,r],i)=>rosette(g,x,y,r,['#947577','#d2a08c','#eed2aa'],i*.45));
    },{edge:'coral'});
    case 'membrane':return membrane(g,target);
    case 'mhc':return mhc(g);
    case 'venule':return cardboard(g,venuleDie,printVenule,{edge:'coral',weight:.8});
    case 'fan':return cardboard(g,fanDie,p=>printFan(p,mark),{edge:'gold'});
    case 'signal':return cardboard(g,signalDie,p=>printSignal(p,1),{edge:'gold'});
    case 'trail':return trail(g);
    case 'antibody':return cardboard(g,antibodyDie,p=>printAntibody(p,target),{edge:'gold',weight:.85});
    case 'reed':return cardboard(g,reedDie,p=>printReed(p,variant),{weight:.67});
    case 'branch':return cardboard(g,branchDie,p=>printBranch(p,variant),{weight:.74});
    case 'years':return years(g);
    case 'origin':return origin(g);
    case 'family':return family(g,mark);
    case 'vellum':return vellum(g,marked);
    case 'virus':return cardboard(g,ebvDie,printEbv,{edge:'plum'});
    default:throw new RangeError('Unknown journey cutout: '+kind);
  }
}
// Measured die-cut bounds in illustration units, including the pressed lip.
// Precomputed bounds avoid a pixel readback when a new encounter pops up.
const boxes={
  hero:[-8,-6,109,109],
  friend:[-8,-6,109,109],
  rbc:[-10,3,125,89],
  node:[-22,-7,121,103],
  macrophage:[-10,5,121,105],
  trail:[9,-8,100,90],
  tonsil:[-15,2,114,103],
  follicle:[-16,2,121,103],
  antigen0:[5,22,102,103],
  antigen1:[15,7,82,101],
  antigen2:[13,3,94,104],
  antigen3:[3,10,101,97],
  antigen4:[5,7,96,99],
  membrane:[4,9,102,100],
  mhc:[8,10,92,102],
  helper:[-2,1,107,102],
  fan:[-9,7,113,103],
  sister:[-8,-6,109,109],
  fdc:[-27,0,123,102],
  signal:[17,0,84,84],
  marrow:[-16,1,123,102],
  plasma:[4,1,100,103],
  memory:[-8,-6,109,109],
  antibody:[3,4,99,101],
  years:[6,1,111,87],
  family:[-10,3,113,103],
  vellum:[5,9,98,94],
  origin:[0,0,101,104],
  reed:[-3,3,92,102],
  branch:[-10,3,113,103],
  bone:[-17,1,123,102],
  venule:[-15,3,115,102],
  virus:[2,1,96,100],
};
let grain;
const density=2.3;
function getGrain() {
  if(grain) return grain;
  grain=document.createElement('canvas');grain.width=64;grain.height=64;
  const g=grain.getContext('2d'),im=g.createImageData(64,64);let seed=542917;
  for(let i=0;i<im.data.length;i+=4) {
    seed=Math.imul(seed,1664525)+1013904223>>>0;
    const lit=seed&4096;
    im.data[i]=lit?255:83; im.data[i+1]=lit?238:62; im.data[i+2]=lit?193:47;
    im.data[i+3]=((seed>>>24)/255)**1.8*48;
  }
  g.putImageData(im,0,0);return grain;
}
function raster(kind,opt) {
  const box=boxes[kind==='antigen'?kind+opt.variant:kind];
  if(!box) throw new RangeError('Unknown journey cutout: '+kind);
  const [left,top,right,bottom]=box, c=document.createElement('canvas');
  c.width=Math.ceil((right-left)*density);c.height=Math.ceil((bottom-top)*density);
  const g=c.getContext('2d');
  g.save();g.setTransform(density,0,0,density,-left*density,-top*density);
  g.lineCap='round';g.lineJoin='round';
  paint(g,kind,opt);g.restore();
  g.save();g.globalCompositeOperation='source-atop';
  g.fillStyle=g.createPattern(getGrain(),'repeat');g.fillRect(0,0,c.width,c.height);
  g.restore();
  return c;
}
const range=(n,max)=>{const v=Number(n);return Number.isFinite(v)?(Math.trunc(v)%max+max)%max:0;};
/** Returns the cached, alpha-cut print. Place it using a bottom-centre origin. */
export function castSprite(kind,options={}) {
  kind=aliases[kind]||kind;
  const variant=kind==='antigen'?range(options.variant,5):palettes.has(kind)?range(options.variant,3):0;
  const target=receptorKinds.has(kind)?range(options.target??(kind==='antibody'?options.variant:0),3):0;
  const mark=familyKinds.has(kind)?range(options.mark,3):0;
  const marked=(kind==='vellum'||kind==='friend')&&Boolean(options.marked);
  const key=[kind,variant,target,mark,marked?1:0].join('/');
  let sprite=drawings.get(key);
  if(!sprite){
    sprite=raster(kind,{variant,target,mark,marked});
    if(drawings.size>=96)drawings.delete(drawings.keys().next().value);
    drawings.set(key,sprite);
  }
  return sprite;
}
