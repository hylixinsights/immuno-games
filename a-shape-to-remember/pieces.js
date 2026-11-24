// Cut-paper plates for the pop-up. Drawings use an illustrator's 100-unit,
// top-down square. The finished cardstock stands in the book's XY plane.
import * as THREE from 'three';
import { makeCard } from './vendor/papercraft/lib/paperkit-3d.js';

const tau = Math.PI * 2;
const stock = {
  ink: '#294845', teal: '#327c75', foam: '#b9cead',
  gold: '#dfae54', straw: '#f3d68d', amber: '#ad743c', brick: '#a94c43',
  blush: '#edb29a',
  violet: '#7d515b', plum: '#5f3d4e', parchment: '#ece1bc'
};
let currentPaper;
let plates;
const collections = new WeakMap();

export function configurePieces(paper) {
  if (!paper?.sheet || !paper?.map) throw new Error('The paper pieces need the popup-3d harness paper.');
  currentPaper = paper;
  if (!collections.has(paper)) collections.set(paper, new Map());
  plates = collections.get(paper);
}

// The same authored contours drive the die and its illustration.
function die(d) {
  const nums = d.match(/[MLQCZ]|-?(?:\d*\.)?\d+/g);
  const shape = new THREE.Shape();
  let i = 0, op;
  const x = () => (Number(nums[i++]) - 50) / 100;
  const y = () => 1 - Number(nums[i++]) / 100;
  while (i < nums.length) {
    if (/[MLQCZ]/.test(nums[i])) op = nums[i++];
    if (op === 'M') { shape.moveTo(x(), y()); op = 'L'; }
    else if (op === 'L') shape.lineTo(x(), y());
    else if (op === 'Q') shape.quadraticCurveTo(x(), y(), x(), y());
    else if (op === 'C') shape.bezierCurveTo(x(), y(), x(), y(), x(), y());
    else if (op === 'Z') { shape.closePath(); op = null; }
    else throw new Error('Invalid paper die');
  }
  const pts = shape.getPoints(6).map(p => [p.x, p.y]);
  const first = pts[0], end = pts[pts.length - 1];
  if (Math.hypot(first[0] - end[0], first[1] - end[1]) < 1e-5) pts.pop();
  return pts;
}

function ellipse(cx, cy, rx, ry) {
  const k = .552285;
  return `M ${cx + rx} ${cy} C ${cx+rx} ${cy+ry*k} ${cx+rx*k} ${cy+ry} ${cx} ${cy+ry} C ${cx-rx*k} ${cy+ry} ${cx-rx} ${cy+ry*k} ${cx-rx} ${cy} C ${cx-rx} ${cy-ry*k} ${cx-rx*k} ${cy-ry} ${cx} ${cy-ry} C ${cx+rx*k} ${cy-ry} ${cx+rx} ${cy-ry*k} ${cx+rx} ${cy} Z`;
}

const polygon = pts => 'M ' + pts.map(p => p.join(' ')).join(' L ') + ' Z';
function motifPath(variant) {
  return [
    'M 50 10 C 66 8 78 22 71 38 L 67 45 C 79 38 94 43 96 58 C 99 74 85 86 70 83 Q 57 81 51 69 Q 45 82 34 84 C 17 88 4 75 5 60 C 5 46 19 38 34 44 C 24 30 30 15 43 11 Q 46 10 50 10 Z',
    'M 76 10 C 52 10 43 26 44 40 C 45 61 61 73 85 66 C 72 89 38 96 18 78 C -2 60 3 32 20 18 C 35 5 57 4 76 10 Z',
    'M 50 4 L 84 35 L 77 52 L 51 90 L 16 38 Z',
    'M 6 49 Q 3 35 19 33 Q 17 19 34 21 Q 36 7 49 15 Q 58 4 69 17 Q 83 12 84 29 Q 99 26 97 43 L 57 84 L 43 86 Z',
    ellipse(50,50,42,43)
  ][Math.floor(variant) % 5];
}
const kit = new Map();
function cut(d) {
  if (!kit.has(d)) kit.set(d, die(d));
  return kit.get(d);
}
function illustrated(P, fn) {
  P.draw(g => {
    g.transform(.01, 0, 0, -.01, -.5, 1);
    g.lineJoin = 'round'; g.lineCap = 'round';
    fn(g);
  });
}
function layer(P, colour, d, depth=.1) {
  P.layer(g => {
    g.transform(.01, 0, 0, -.01, -.5, 1);
    g.fillStyle = colour; g.fill(new Path2D(d));
  }, colour, {depth, lip:.85, shadow:.7, shade:.72, rim:0});
}
function fill(g, d, colour) { g.fillStyle=colour; g.fill(new Path2D(d)); }
function line(g, d, colour, width=1) { g.strokeStyle=colour; g.lineWidth=width; g.stroke(new Path2D(d)); }
function dot(g, x,y,rx,ry,colour, angle=0) {
  g.beginPath(); g.ellipse(x,y,rx,ry,angle,0,tau); g.fillStyle=colour; g.fill();
}
function clip(g, d, fn) { g.save(); g.clip(new Path2D(d)); fn(); g.restore(); }
function hatch(g, d, colour, spacing=5, width=.72, slope=.43) {
  clip(g,d,()=> {
    g.beginPath();
    for(let x=-80; x<215; x+=spacing) { g.moveTo(x,-15); g.lineTo(x+125*slope,113); }
    g.lineWidth=width; g.strokeStyle=colour; g.stroke();
  });
}
function marks(g, coords, colour) {
  for (const [x,y,rx,ry,rot] of coords) dot(g,x,y,rx,ry,colour,rot);
}
function simpleCard(d, paint, {seed=3, ppu=142, width=.02, thick=.018, holes}={}) {
  return makeCard(cut(d), {paper:currentPaper, paint, seed, pxPerUnit:ppu, thickness:thick,
    edgeWidth:width, contact:null, tone:.009, back:false, folds:[], holes:holes?.map(cut)});
}

const familySigns = [
  'M 0 -8 L 1.9 -2.4 L 6 -5 L 3.4 -.7 L 8 1 L 2.7 2 L 5.3 6.6 L .5 3.6 L -1 8 L -2.3 3 L -6 5.6 L -3.7 .8 L -8 0 L -2.6 -1.6 L -4 -6 Z',
  'M -7 5 L -3 -7 L .2 -7 L -3.4 6 Z M -.4 6 L 3.5 -6 L 7 -6 L 3 6.5 Z',
  'M -8 -4 Q -5 -5 -3 -1 Q 0 -5 2 -1 Q 4 -6 8 -4 L 7 -.4 Q 4 -.9 3 3 Q .5 5 -2 1.3 Q -5 4 -7 1 Z'
];
function sign(g,mark,x,y,size=1) {
  g.save(); g.translate(x,y); g.scale(size,size);
  g.shadowColor='rgba(56,38,34,.48)'; g.shadowOffsetY=.7; g.shadowBlur=.8;
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

function imprint(g, variant, x, y, w, h, colour, ground) {
  g.save(); g.translate(x, y); g.scale(w/100, h/100);
  fill(g, motifPath(variant), colour);
  if (variant === 4) dot(g,50,50,19.7,21.4,ground);
  g.restore();
}

function printLymphocyte(P, {mark,variant,memory,friend,isoform}) {
  P.fill(memory?'#739c84':stock.foam);
  illustrated(P,g=>{
    forks.forEach(a=>{
      const p=radialPoint(a,0,5), h=radialPoint(a,.35,11.1);
      line(g,`M ${p.join(' ')} L ${h.join(' ')}`,stock.teal,1.45);
    });
  });
  layer(P, memory?'#426b61':'#28665f',cellBody);
  layer(P, memory?'#82a387':'#67aa99',cellInside);
  illustrated(P,g=>{
    const crescent='M 13 51 C 25 80 46 92 78 62 C 72 84 56 92 37 88 C 21 86 14 72 13 51 Z';
    fill(g,crescent,memory?'#547b6c':'#428980'); hatch(g,crescent,'#31726b',2.9,.75,.6);
    line(g,'M 18 43 Q 21 30 38 25 M 67 25 Q 75 29 77 37','#d2d3aa',1.2);
    marks(g,[[24,41,2.1,1.2,-.8],[21,48,1.4,1.3,0],[73,36,2,1.25,.8],[77,46,1.1,2,.15],[35,80,2.3,1.1,.4],[67,79,2.2,1.1,-.5],[73,68,1,1,0],[17,61,1.8,.95,-1.1]],stock.parchment);
  });
  layer(P, memory?'#745358':'#7b5057',bNucleus,.13);
  illustrated(P,g=>{
    const shadow='M 26 53 C 36 65 53 75 72 51 Q 74 83 48 80 C 33 81 23 70 26 53 Z';
    fill(g,shadow,'#68434f'); hatch(g,shadow,'#935c64',3.2,.85,.65);
    line(g,'M 31 47 Q 34 35 46 34 M 49 33 Q 55 31 61 35','#c2877c',1.4);
    marks(g,[[30,53,1.25,1,0],[34,42,1.2,.95,-.7],[57,38,1,1,0],[45,70,1.5,.9,.25],[50,73,1,.9,0],[65,61,1.15,.8,-.65],[37,66,.9,.7,0]],'#bd8178');
    // Two flecks of dark ink give the lymphocyte a discreet, consistent expression.
    dot(g,43,52,1.65,2.25,stock.plum); dot(g,56.3,50,1.65,2.25,stock.plum);
    dot(g,42.8,51.4,.45,.55,stock.straw); dot(g,55.9,49.4,.45,.55,stock.straw);
    line(g,'M 47 57 Q 50 59 52 55','#563a44',1.35);
    sign(g,mark,62.6,67.7,.78);
    // A magnified binding-site imprint is printed on a copper inset in the rim.
    const width=[10.2,8.8,11.3][isoform], height=[10.2,11.7,9.3][isoform];
    dot(g,48,19.6,6.6,5.4,stock.ink,-.12);
    imprint(g,variant,48-width/2,19.6-height/2,width,height,stock.straw,stock.ink);
    if(isoform){
      const outer=isoform===1?'M 11 46 Q 17 43 18 39 M 80 31 L 87 30':'M 13 46 L 18 42 M 79 33 Q 82 29 86 30';
      line(g,outer,stock.straw,1.4);
    }
    if(friend){
      const sash='M 18 32 Q 19 28 23 27 Q 39 46 81 66 L 77 72 Q 39 54 18 32 Z';
      fill(g,sash,'#ba6758');line(g,'M 22 31 Q 43 51 78 67','#efad86',1.35);
    }
    if(memory){
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

const antigenPaint = [
  {inset:'M 49 21 C 59 19 67 28 61 41 L 55 51 C 65 50 75 43 83 50 C 93 60 84 74 73 74 Q 60 74 51 58 Q 41 77 30 76 C 18 77 11 68 16 57 C 20 47 32 48 44 54 L 40 43 C 33 30 38 23 49 21 Z',
   crease:'M 51 19 Q 46 34 51 54 M 17 59 Q 32 53 51 54 M 81 57 Q 66 50 51 54'},
  {inset:'M 46 15 C 26 26 22 50 34 68 C 40 75 50 79 60 79 Q 34 84 20 69 C 6 49 18 25 35 18 Z',
   crease:'M 23 36 C 15 58 26 74 45 78 M 23 34 Q 28 25 35 22'},
  {inset:'M 49 14 L 72 35 L 51 75 L 26 39 Z',crease:'M 49 14 L 51 75 M 26 39 L 51 34 L 72 35'},
  {inset:'M 13 45 L 23 38 L 28 30 L 38 29 L 48 22 L 55 24 L 63 21 L 71 26 L 77 29 L 81 37 L 88 39 L 52 76 Z',crease:'M 23 38 L 51 77 L 37 29 M 49 22 L 51 77 L 64 22 M 78 31 L 51 77'},
  {inset:ellipse(50,50,34,35),crease:'M 25 40 C 28 24 43 20 54 21 M 61 22 Q 70 24 75 31 M 73 66 Q 67 74 55 78'}
];
function printAntigen(P,variant){
  P.fill('#c28c42');const art=antigenPaint[variant];layer(P,'#f0c875',art.inset,.12);
  illustrated(P,g=>{
    hatch(g,art.inset,'rgba(151,98,48,.48)',4.6,.7,.52);
    line(g,art.crease,'#fff0b2',2.0);line(g,art.crease,'#b08243',.8);
    if(variant===0)dot(g,50,48,2.25,2.25,'#a8753c');
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

const fiberDie='M -34 88 Q -12 73 12 70 C 36 66 59 76 83 61 Q 102 50 121 51 L 129 60 C 106 59 96 68 80 76 Q 58 89 29 85 Q -8 81 -28 98 Z';
function printFiber(P,variant){
  const colours=[['#918d70','#c2b58d'],['#b17c6e','#dfaa8a'],['#7b9890','#aac0a4']][variant]; P.fill(colours[0]);
  illustrated(P,g=>{
    for(let i=0;i<3;i++){
      line(g,`M -25 ${88+i*2} Q -1 ${71+i*3} 28 ${74+i*3} Q 58 ${82+i*2} 83 ${66+i*2.4} Q 104 ${52+i*2.1} 122 ${55+i*2.1}`,colours[1],1.15);
    }
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
    // A short linear peptide rests in the groove rather than the whole native shape.
    line(g,'M 27 35 Q 36 30 43 39 T 60 38 Q 70 32 75 36',stock.brick,4.6);
    line(g,'M 27 34 Q 36 29 43 38 T 60 37 Q 70 31 75 35','#e5a07e',1.8);
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

const spleenDie='M 26 12 C 50 -1 83 7 91 26 C 97 39 90 53 79 57 Q 64 61 63 74 C 63 90 45 99 29 94 C 16 90 16 79 12 70 C 0 44 7 21 26 12 Z';
function printSpleen(P){
  P.fill('#995b63');layer(P,'#c4837f','M 25 18 C 47 6 75 9 84 24 Q 94 40 77 51 Q 56 59 57 72 Q 56 91 39 91 Q 22 91 20 72 C 5 50 11 26 25 18 Z');
  illustrated(P,g=>{
    hatch(g,'M 13 55 Q 30 86 51 79 Q 53 93 36 94 Q 15 89 13 55 Z','#a7676c',3.4,.85,.52);
    ['M 77 52 Q 55 47 23 27','M 56 46 Q 57 30 48 18','M 55 45 Q 34 48 21 58','M 63 49 Q 43 59 39 79','M 40 38 Q 25 39 17 35'].forEach(d=>line(g,d,'#e1ac95',1.6));
    marks(g,[[30,28,3.0,2.6,0],[54,27,2.4,1.9,0],[25,54,2.4,2,0],[44,66,2.8,2.2,0],[64,38,2.2,1.9,0]],'#d8ba9d');
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
const starDie='M 49 4 L 59 32 L 77 20 L 70 41 L 96 50 L 70 58 L 79 80 L 59 68 L 50 95 L 42 69 L 22 82 L 30 59 L 5 51 L 30 40 L 20 19 L 41 32 Z';
function printStar(P){
  P.fill(stock.amber);layer(P,stock.gold,'M 49 15 L 54 42 L 68 33 L 61 47 L 81 51 L 60 54 L 68 70 L 54 60 L 50 81 L 46 61 L 32 71 L 39 56 L 19 51 L 39 47 L 31 34 L 45 42 Z');
  illustrated(P,g=>line(g,'M 50 18 L 50 80 M 21 51 L 80 51',stock.straw,1.55));
}

// The gusset is a bent strip behind the featured actors. The creased edge
// remains legible in profile when a standee turns or its page is unfolded.
const gussetDie='M 37 96 L 32 82 L 29 64 L 32 43 Q 34 36 41 34 L 57 32 Q 66 36 69 45 L 70 65 L 64 83 L 62 96 Z';
function gusset(tint) {
  const key='gusset/'+tint;
  if(!plates.has(key)){
    plates.set(key,simpleCard(gussetDie,P=>{
      P.fill(tint);
      illustrated(P,g=>{
        fill(g,'M 44 34 L 56 33 L 57 94 L 48 94 Z','rgba(247,221,177,.25)');
        line(g,'M 45 38 L 46 92','rgba(56,57,45,.4)',1.6);
        line(g,'M 57 36 L 58 93','rgba(237,216,173,.57)',1.5);
      });
    },{ppu:70,width:.012,thick:.013}));
  }
  return plates.get(key).clone();
}

const official = [
  'bcell','memory','plasma','macrophage','tfh','rbc','antigen','fdc',
  'follicle','marrow','bone','crypt','branch','antibody','signal','ebv',
  'fan','mhc','spleen','hev','fiber','reed','starlet'
];
export const pieceKinds = Object.freeze(official.slice());

function plateShape(kind,options){
  const {variant,mark} = options;
  switch(kind) {
    case 'bcell': case 'memory':
      return simpleCard(receptorOutline,p=>printLymphocyte(p,{...options,memory:kind==='memory'}),{ppu:184,width:.013,thick:.026});
    case 'plasma': return simpleCard(plasmaDie,p=>printPlasma(p,mark),{ppu:162,thick:.026});
    case 'tfh': return simpleCard(helperDie,printHelper,{ppu:148,thick:.024,width:.016});
    case 'macrophage': return simpleCard(macrophageDie,printMacrophage,{ppu:152,thick:.025,width:.016});
    case 'rbc': return simpleCard(rbcDie,p=>printRbc(p,variant),{ppu:118,thick:.037,width:.014});
    case 'antigen': return simpleCard(motifPath(variant),p=>printAntigen(p,variant),{
      ppu:138,width:.017,thick:.035,holes:variant===4?[ellipse(50,50,19.7,21.4)]:undefined});
    case 'fdc': return simpleCard(fdcDie,printFdc,{ppu:142,width:.011});
    case 'follicle': return simpleCard(follicleDie,p=>printFollicle(p,variant),{ppu:146,thick:.022});
    case 'marrow': case 'bone': return simpleCard(boneDie,p=>printBone(p,kind==='marrow'?1:variant),{ppu:132,thick:.028,width:.013});
    case 'crypt': return simpleCard(cryptDie,printCrypt,{ppu:128});
    case 'branch': return simpleCard(branchDie,p=>printBranch(p,variant),{ppu:114,width:.013});
    case 'antibody': return simpleCard(antibodyDie,p=>printAntibody(p,variant),{ppu:135,thick:.024});
    case 'signal': return simpleCard(signalDie,p=>printSignal(p,variant),{ppu:96});
    case 'ebv': return simpleCard(ebvDie,printEbv,{ppu:134});
    case 'fan': return simpleCard(fanDie,p=>printFan(p,mark),{ppu:145,width:.016});
    case 'mhc': return simpleCard(mhcDie,printMhc,{ppu:130,width:.015});
    case 'spleen': return simpleCard(spleenDie,printSpleen,{ppu:130});
    case 'hev': return simpleCard(venuleDie,printVenule,{ppu:140,thick:.03});
    case 'fiber': return simpleCard(fiberDie,p=>printFiber(p,variant),{ppu:105,width:.01});
    case 'reed': return simpleCard(reedDie,p=>printReed(p,variant),{ppu:112,width:.012});
    case 'starlet': return simpleCard(starDie,printStar,{ppu:95,width:.014});
    default: throw new Error('Unknown paper piece: '+kind);
  }
}

const actors = new Set(['bcell','memory','plasma','tfh','macrophage']);
const colourVariants = new Set(['rbc','follicle','bone','branch','fiber','reed','signal']);
const marked = new Set(['bcell','memory','plasma','fan']);
function range(value,n){
  const i=Number.isFinite(Number(value))?Math.floor(Number(value)):0;
  return (i%n+n)%n;
}

export function makePiece(kind, options={}) {
  if(!plates) throw new Error('Call configurePieces with the harness paper before cutting pieces.');
  const lymphocyte=kind==='bcell'||kind==='memory';
  const variant=kind==='antigen'||kind==='antibody'||lymphocyte ? range(options.variant??options.target??0,5)
    : colourVariants.has(kind)?range(options.variant??options.seed??0,3):0;
  const mark=marked.has(kind)?range(options.mark??0,3):0;
  const friend=lymphocyte && Boolean(options.friend || options.sash);
  const isoform=lymphocyte ? range(options.isoform??0,3) : 0;
  const key=[kind,variant,mark,friend?1:0,isoform].join('/');
  if(!plates.has(key)){
    const group=new THREE.Group(), drawing=new THREE.Group();
    const face=plateShape(kind,{variant,mark,friend,isoform});
    face.name=kind+'-print';
    if(actors.has(kind)){
      const side=gusset(kind==='tfh'?'#bd9859':kind==='macrophage'?'#be8973':'#688d7d');
      side.rotation.y=1.04;side.position.set(-.018,0,-.105);
      drawing.add(side);
    }
    drawing.add(face);
    if(kind==='mhc'){
      const peptide='M 25 30 Q 33 25 42 33 Q 47 39 54 34 Q 65 25 75 31 L 74 36 Q 65 32 57 40 Q 47 46 39 38 Q 33 32 27 36 Z';
      const sliver=simpleCard(peptide,p=>{
        p.fill('#cb795e');illustrated(p,g=>line(g,'M 27 31 Q 34 28 41 34 T 55 35 Q 65 29 73 32','#f4c68b',1.5));
      },{ppu:112,width:.008,thick:.012});
      sliver.position.z=.022;drawing.add(sliver);
    }
    const bounds=new THREE.Box3().setFromObject(drawing);
    // The fibres are low landscape ribbons. Everything else has a predictable
    // nominal height so the scene can place each figure by the page's surface.
    const height=bounds.max.y-bounds.min.y;
    const factor=kind==='fiber'?1:1/Math.max(.01,height);
    drawing.scale.setScalar(factor);
    drawing.position.y=-bounds.min.y*factor;
    group.add(drawing);group.name=kind;group.userData.kind=kind;
    plates.set(key,group);
  }
  return plates.get(key).clone(true);
}
