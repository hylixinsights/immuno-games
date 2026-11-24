// Brazilian training ground. A folded 19.2 × 18 cm page with an accordion stand,
// a laced paper net and two banks of punched floodlights. The pitch and all
// scenery travel together when the page is turned. Local +Z faces the striker.
export function createStadium(THREE) {
  const group = new THREE.Group();
  group.name = 'Estádio de papel';
  const ink = '#17353b';
  const cream = '#f6e9bf';
  const amber = '#efb94e';
  const green = '#398366';
  const teal = '#27615c';
  const cut = '#695841';
  const timeFlags = [];
  const stands = [];
  const fanHinges = [];
  const palette = new Map();
  let state = 0x9c441a;
  const random = () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  const color = (hex) => {
    if (!palette.has(hex)) palette.set(hex, new THREE.Color(hex).toArray());
    return palette.get(hex);
  };
  const paper = new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide });
  const litPaper = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide });
  function batch() {
    const vertices = [], colors = [];
    function face(a, b, c, hex) {
      vertices.push(...a, ...b, ...c);
      const rgb = color(hex);
      colors.push(...rgb, ...rgb, ...rgb);
    }
    function quad(a, b, c, d, hex) {
      face(a, b, d, hex);
      face(b, c, d, hex);
    }
    function polygon(points, z, hex) {
      const xy = points.map(([x, y]) => new THREE.Vector2(x, y));
      const triangles = THREE.ShapeUtils.triangulateShape(xy, []);
      for (const [a, b, c] of triangles) {
        face([...points[a], z], [...points[b], z], [...points[c], z], hex);
      }
    }
    function rect(x, y, w, h, z, hex) {
      quad([x, y, z], [x+w, y, z], [x+w, y+h, z], [x, y+h, z], hex);
    }
    function disk(x, y, r, z, hex, ratio = 1, sides = 12) {
      for (let i = 0; i < sides; i++) {
        const a = i * Math.PI * 2 / sides, b = (i+1) * Math.PI * 2 / sides;
        face([x, y, z], [x+Math.cos(a)*r, y+Math.sin(a)*r*ratio, z],
          [x+Math.cos(b)*r, y+Math.sin(b)*r*ratio, z], hex);
      }
    }
    function strip(a, b, width, hex) {
      const dx = b[0]-a[0], dy = b[1]-a[1];
      const h = width / (2 * (Math.hypot(dx, dy) || 1));
      quad([a[0]+dy*h, a[1]-dx*h, a[2]], [b[0]+dy*h, b[1]-dx*h, b[2]],
        [b[0]-dy*h, b[1]+dx*h, b[2]], [a[0]-dy*h, a[1]+dx*h, a[2]], hex);
    }
    // A length of folded rectangular stock with a cap and two visible edge inks.
    function beam(a, b, w, d, front, edge = front) {
      const axis = new THREE.Vector3().fromArray(b).sub(new THREE.Vector3().fromArray(a)).normalize();
      const ref = Math.abs(axis.z) > 0.88 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(0, 0, 1);
      const width = new THREE.Vector3().crossVectors(axis, ref).normalize().multiplyScalar(w/2);
      const depth = new THREE.Vector3().crossVectors(width, axis).normalize().multiplyScalar(d/2);
      const corners = (v) => [[-1,-1],[1,-1],[1,1],[-1,1]].map(([s,t]) => [
        v[0]+s*width.x+t*depth.x, v[1]+s*width.y+t*depth.y, v[2]+s*width.z+t*depth.z
      ]);
      const u = corners(a), v = corners(b);
      for (let i=0; i<4; i++) {
        const j=(i+1)%4;
        quad(u[i], v[i], v[j], u[j], i%2 ? edge : front);
      }
      quad(...v, edge);
      quad(...u, edge);
    }
    function mesh(parent, name, mat = paper, cast = false) {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      geometry.computeVertexNormals();
      geometry.computeBoundingSphere();
      const result = new THREE.Mesh(geometry, mat);
      result.name = name;
      result.castShadow = cast;
      result.receiveShadow = mat === paper;
      parent.add(result);
      return result;
    }
    return { face, quad, polygon, rect, disk, strip, beam, mesh };
  }

  function printPitch() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 960;
    const g = canvas.getContext('2d');
    const k = canvas.width / 19.2;
    const x = (v) => (v + 9.6) * k, z = (v) => (v + 9.5) * k;
    g.fillStyle = '#448b68';
    g.fillRect(0,0,canvas.width,canvas.height);
    // Broad adjoining sheets of grass. A crease sits on just one edge of each
    // fold; paper fibres and the broken second ink continue over the whole field.
    const strips = ['#518f69','#68a376','#55966e','#72a97d','#54946d','#69a478','#59986f','#72a779','#53936c','#65a174','#56966e'];
    strips.forEach((c,i) => {
      const h = canvas.height / strips.length, top = Math.floor(i*h);
      g.fillStyle = c;
      g.fillRect(0,top,canvas.width,Math.ceil(h));
      g.fillStyle = 'rgba(238,222,161,.19)';
      g.fillRect(0,top+1,canvas.width,1);
      g.fillStyle = 'rgba(25,71,56,.10)';
      g.fillRect(0,top+2,canvas.width,1);
    });
    for (let i=0; i<18500; i++) {
      const px=random()*1024, py=random()*960;
      g.fillStyle = i%3 ? 'rgba(235,231,179,.12)' : 'rgba(35,95,67,.15)';
      g.fillRect(px,py,.45+random()*1.5,.4+random()*1.6);
    }
    g.lineWidth=.7;
    for (let i=0; i<2000; i++) {
      const px=random()*1024,py=random()*960;
      g.strokeStyle = i%2 ? 'rgba(244,230,187,.13)' : 'rgba(30,74,58,.09)';
      g.beginPath(); g.moveTo(px,py); g.lineTo(px+1+random()*4,py-random()*1.2); g.stroke();
    }
    // A very slight central valley catches opposite inks on either side of the scored fold.
    g.fillStyle='rgba(29,83,62,.15)'; g.fillRect(510,0,1.7,960);
    g.fillStyle='rgba(242,228,183,.16)'; g.fillRect(513,0,1.1,960);
    g.lineJoin='round'; g.lineCap='square';
    const lines = () => {
      const path = (pts) => { g.beginPath(); pts.forEach(([a,b],i)=>i?g.lineTo(x(a),z(b)):g.moveTo(x(a),z(b))); g.stroke(); };
      path([[-8.62,8.65],[-8.62,-3.41],[8.62,-3.41],[8.62,8.65]]);
      path([[-6.83,-3.41],[-6.83,5.65],[6.83,5.65],[6.83,-3.41]]);
      path([[-5.14,-3.41],[-5.14,-.78],[5.14,-.78],[5.14,-3.41]]);
      const angle = Math.asin((5.65-3.8)/3.16);
      g.beginPath();g.arc(x(0),z(3.8),3.16*k,angle,Math.PI-angle);g.stroke();
      g.beginPath();g.arc(x(-8.62),z(-3.41),.33*k,0,Math.PI/2);g.stroke();
      g.beginPath();g.arc(x(8.62),z(-3.41),.33*k,Math.PI/2,Math.PI);g.stroke();
      g.beginPath();g.arc(x(0),z(3.8),.10*k,0,Math.PI*2);g.fill();
    };
    g.save(); g.translate(.8,1.2);g.strokeStyle='rgba(30,75,57,.33)';g.fillStyle=g.strokeStyle;g.lineWidth=5;lines();g.restore();
    g.strokeStyle='#e9dfb1';g.fillStyle='#f7ebc7';g.lineWidth=3.4;lines();
    // Applied corner reinforcing tabs and a coloured open lamination at the page edges.
    for (const side of [-1,1]) {
      const sx = side < 0 ? 0 : 1024;
      g.fillStyle='rgba(29,75,65,.23)';g.fillRect(side<0?sx:sx-13,0,13,960);
      g.fillStyle='rgba(233,213,151,.7)';g.fillRect(side<0?2:sx-4,0,2,960);
      g.strokeStyle='rgba(225,214,171,.42)';g.lineWidth=2;
      for(let p=80;p<950;p+=56){g.beginPath();g.moveTo(side<0?3:sx-3,p);g.lineTo(side<0?8:sx-8,p-5);g.stroke();}
    }
    // Small, sparse strips of confetti beyond the playing lines.
    const inks=['#eccd73','#c8cf92','#34796b','#de9261','#ebdba9'];
    for(let i=0;i<58;i++){
      const side=i%2?1:-1, cx=x(side*(8.76+random()*.62)),cz=z(-4.2+random()*12.2);
      g.save();g.translate(cx,cz);g.rotate(random()*3);g.fillStyle=inks[i%inks.length];g.fillRect(-1,-2,2,4+random()*2.6);g.restore();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    return texture;
  }

  const grass = new THREE.MeshLambertMaterial({map:printPitch(), side:THREE.FrontSide});
  const turf = new THREE.Mesh(new THREE.PlaneGeometry(19.2,18), grass);
  turf.name='Frente da folha · campo';
  turf.rotation.x=-Math.PI/2;
  turf.position.set(0,0,-.5);
  turf.receiveShadow=true;
  group.add(turf);

  const staticPrint=batch(), hillPrint=batch();
  // Thin bound page and staggered coloured laminations, open to the circuit below.
  const outline=[[-9.6,-9.5],[9.6,-9.5],[9.6,8.5],[-9.6,8.5]];
  for(let i=0;i<4;i++){
    const a=outline[i], b=outline[(i+1)%4];
    [[-.005,-.042,'#d1b578'],[-.042,-.075,'#9e7953'],[-.075,-.093,'#f4dba3'],[-.093,-.114,'#775e43']].forEach(([top,bottom,c])=>{
      staticPrint.quad([a[0],top,a[1]],[b[0],top,b[1]],[b[0],bottom,b[1]],[a[0],bottom,a[1]],c);
    });
  }
  // Printed silhouettes of the rounded granitic headlands behind the back row.
  const ridges=[
    {z:-9.38,top:[[-9.45,2.45],[-8.6,2.64],[-7.6,3.43],[-6.88,3.63],[-6.25,4.56],[-5.84,4.72],[-5.45,4.7],[-5.19,4.45],[-4.91,3.65],[-4.39,3.19],[-3.81,3.11],[-2.73,3.57],[-2.10,3.78],[-1.38,3.62],[-.49,3.34],[.18,3.18],[1.18,3.31],[2.02,3.04],[2.76,3.4],[3.4,3.92],[4.12,4.36],[4.76,4.46],[5.3,4.08],[5.99,3.74],[6.61,3.82],[7.32,4.2],[7.87,4.24],[8.42,3.65],[9.44,3.06]], c:'#32636b', lip:'#77938a'},
    {z:-9.05,top:[[-9.5,2.01],[-8.64,2.48],[-8.05,2.95],[-7.47,3.09],[-6.83,2.97],[-6.13,2.62],[-5.21,2.63],[-4.46,3.1],[-3.96,3.25],[-3.53,3.17],[-3.11,2.85],[-2.18,2.69],[-1.53,3.14],[-.98,3.3],[-.57,3.12],[.18,2.83],[.88,2.95],[1.63,2.83],[2.4,2.54],[3.18,2.9],[3.94,3.22],[4.47,3.2],[5.09,2.85],[5.61,2.98],[6.27,3.42],[6.88,3.46],[7.38,3.19],[8.14,3.01],[8.7,2.59],[9.5,2.56]], c:'#285557',lip:'#5a8178'}
  ];
  for(const r of ridges){
    for(let i=0;i<r.top.length-1;i++){
      const [ax,ay]=r.top[i],[bx,by]=r.top[i+1];
      hillPrint.quad([ax,.01,r.z],[bx,.01,r.z],[bx,by,r.z],[ax,ay,r.z],r.c);
      if(by>=ay-.15) hillPrint.quad([ax,ay-.035,r.z+.007],[bx,by-.035,r.z+.007],[bx,by,r.z+.007],[ax,ay,r.z+.007],r.lip);
    }
  }
  // Long folded highlights follow the granite's slope, like inked contour cuts.
  hillPrint.polygon([[-6.74,3.19],[-6.25,4.47],[-5.83,4.65],[-6.08,4.09],[-6.17,3.46]],-9.36,'#578082');
  hillPrint.polygon([[3.2,3.42],[3.9,4.11],[4.65,4.38],[4.28,4.01],[4,3.71]],-9.36,'#517578');
  // A distant strip of neighbourhood houses made from folded rectangles.
  for(let i=0;i<42;i++){
    const x=-9.2+i*.446+random()*.1, base=1.63+Math.sin(i*.42)*.23;
    const w=.19+random()*.25,h=.26+random()*.65,z=-8.86-random()*.12;
    const c=['#3a6462','#536e63','#49706a','#677766'][i%4];
    hillPrint.rect(x,base,w,h,z,c);
    hillPrint.rect(x,base+h-.017,w,.034,z+.012,'#99a283');
    if(i%4!==0){
      const wh=.045;
      hillPrint.rect(x+.04,base+h*.54,wh,.077,z+.014,'#dcc98b');
      if(w>.30)hillPrint.rect(x+w-.10,base+h*.54,wh,.077,z+.014,'#b8b685');
    }
  }
  hillPrint.mesh(group,'Morros e bairro · recortes superpostos');

  // The net remains open at the front. Its upper sheet slants onto a laced back
  // panel, so the goalkeeper can really stand between the crossbar and the mesh.
  const goal=batch();
  const half=4.3, gz=-3.4, rear=-4.96, gh=3.1, rearH=2.41;
  const meshInk='#d4d6b5',meshEdge='#a2ab91';
  const netXCount=22,netYCount=7;
  for(let i=0;i<=netXCount;i++){
    const u=i/netXCount,x=-half+u*half*2,sag=Math.sin(Math.PI*u);
    const y0=.038, yr=rearH-.085*sag, zr=rear-.058*sag;
    goal.beam([x,y0,rear],[x,yr,zr],.034,.022,meshInk,meshEdge);
    goal.beam([x,yr,zr],[x,gh-.045,gz-.026],.034,.024,meshInk,meshEdge);
  }
  for(let j=0;j<=netYCount;j++){
    const v=j/netYCount;
    for(let i=0;i<netXCount;i++){
      const point=(u)=>[-half+half*2*u,.038+v*(rearH-.038-.085*Math.sin(Math.PI*u)),rear-.058*v*Math.sin(Math.PI*u)];
      goal.beam(point(i/netXCount),point((i+1)/netXCount),.032,.022,meshInk,meshEdge);
    }
  }
  for(let j=1;j<=3;j++){
    const t=j/4;
    goal.beam([-half,gh+(rearH-gh)*t,gz+(rear-gz)*t],[half,gh+(rearH-gh)*t,gz+(rear-gz)*t],.032,.024,meshInk,meshEdge);
  }
  for(const s of [-1,1]){
    const x=s*half;
    for(let j=0;j<=3;j++){
      const t=j/3;
      goal.beam([x,.025,gz+(rear-gz)*t],[x,gh+(rearH-gh)*t,gz+(rear-gz)*t],.027,.031,meshInk,meshEdge);
    }
    for(let j=0;j<=netYCount;j++){
      const v=j/netYCount;
      goal.beam([x,.025+v*(gh-.05),gz],[x,.025+v*(rearH-.05),rear],.03,.032,meshInk,meshEdge);
    }
    goal.beam([x,.026,gz],[x,gh+.035,gz],.128,.13,'#f7eac8','#b6b397');
    goal.beam([x,.045,gz+.009],[x,.32,gz+.009],.14,.145,'#e9d7a7','#abac87');
    goal.beam([x,.040,rear],[x,rearH+.017,rear],.067,.069,'#c3c6a4','#a2a68c');
    goal.beam([x,gh,gz],[x,rearH,rear],.072,.068,'#ddd8b7','#a8b098');
    goal.beam([x,.039,gz],[x,.039,rear],.075,.065,'#c6c7a6','#a2ac91');
  }
  goal.beam([-half-.05,gh,gz],[half+.05,gh,gz],.14,.14,'#fff0cc','#c0ba9d');
  goal.beam([-half,.035,rear],[half,.035,rear],.069,.060,'#c9c9a7','#a6aa8c');
  goal.mesh(group,'Baliza com rede de tiras de papel',paper,true);

  // Distinct silhouettes and shirt prints share a single mesh per stand. No
  // transparent sprites: the raised scarf, curled hair and paper hands are cut.
  function supporter(b,x,y,z,size,kind){
    const scale=size;
    const fn=(p)=>p.map(([dx,dy])=>[x+dx*scale,y+dy*scale]);
    const poly=(pts,ink,layer=0)=>b.polygon(fn(pts),z+.003*layer,ink);
    const rect=(dx,dy,w,h,ink,i)=>b.rect(x+dx*scale,y+dy*scale,w*scale,h*scale,z+.003*i,ink);
    const disk=(dx,dy,r,c,i,t=1,n=8)=>b.disk(x+dx*scale,y+dy*scale,r*scale,z+.003*i,c,t,n);
    const stroke=(a,c,w,hex,layer)=>{
      b.strip([x+a[0]*scale,y+a[1]*scale,z+.003*layer],[x+c[0]*scale,y+c[1]*scale,z+.003*layer],w*scale,hex);
    };
    const kits=['#efbc53','#f1d77b','#598b72','#de855c','#e6dcb1','#376875','#7c9a82','#e7b552'];
    const skins=['#af744f','#e1aa70','#a8684b','#d09a71','#edc18f','#986448'];
    const hair=['#393932','#72513d','#41433b','#5e4136'];
    const kit=kits[Math.floor(random()*kits.length)], skin=skins[Math.floor(random()*skins.length)], cap=hair[Math.floor(random()*4)];
    const trim=kit===kits[2]||kit===kits[5]?'#edd88b':'#357262';
    const pose=kind%7;
    const left=pose===0||pose===2||pose===4||pose===5, right=pose===1||pose===2||pose===4;
    // Arms join the torso through separate shoulder seams.
    for(const s of [-1,1]){
      const high=s<0?left:right;
      const hand=high?[s*.24,pose===4?.746:.63]:[s*.199,.21];
      const elbow=high?[s*.235,.49]:[s*.203,.31];
      stroke([s*.105,.405],elbow,.102,kit,1);
      stroke(elbow,hand,.065,skin,2);
      disk(...hand,.037,skin,3);
    }
    poly([[-.16,.04],[.158,.04],[.137,.35],[.163,.402],[.13,.438],[.062,.459],[-.062,.46],[-.14,.438],[-.169,.39],[-.14,.348]],kit,3);
    poly([[-.063,.46],[.06,.46],[.025,.405],[-.009,.39]],trim,4);
    if(kind%3===0){rect(-.145,.19,.279,.052,trim,4);rect(-.145,.117,.279,.026,cream,4);}
    if(kind%3===1){
      poly([[-.126,.36],[-.064,.439],[.134,.168],[.133,.083]],trim,4);
    }
    if(kind%3===2){rect(.071,.287,.041,.068,cream,4);rect(-.142,.069,.283,.035,trim,4);}
    rect(-.042,.432,.084,.066,skin,4);
    disk(0,.55,.115,skin,5,1.12,9);
    if(kind%5===0){
      disk(-.087,.595,.063,cap,5,1.01);
      disk(.082,.599,.057,cap,5,1.02);
      disk(.008,.637,.086,cap,6,.55);
    }else if(kind%5===2){
      poly([[-.118,.589],[-.115,.651],[-.073,.686],[.028,.688],[.097,.64],[.115,.596],[.035,.609],[-.052,.603]],trim,6);
      rect(-.135,.589,.2,.027,cream,7);
    }else{
      poly([[-.111,.55],[-.115,.6],[-.079,.652],[-.031,.676],[.05,.668],[.103,.631],[.113,.58],[.047,.612],[-.044,.618],[-.087,.58]],cap,6);
    }
    if(kind%6===1){rect(-.078,.552,.15,.023,ink,7);}
    if(pose===4){
      rect(-.29,.743,.58,.088,trim,6);rect(-.22,.749,.31,.018,cream,7);
      rect(.12,.746,.048,.079,amber,7);rect(-.26,.704,.045,.04,trim,6);rect(.23,.704,.045,.04,trim,6);
    }
  }

  function smallFlag(parent,x,y,z,w,h,design,phase){
    const pivot=new THREE.Group();
    pivot.position.set(x,y,z); parent.add(pivot);
    // The cloth is a scored zig-zag broadside. All motifs follow its creases.
    const a=batch(); const steps=5;
    const pt=(u,v)=>[w*u,(v-.5)*h-.11*u+.039*Math.sin(u*5+phase), .115*Math.sin(u*8)+.028*v];
    const patch=(u0,u1,v0,v1,c)=>a.quad(pt(u0,v0),pt(u1,v0),pt(u1,v1),pt(u0,v1),c);
    const tones=design==='brazil'?['#338461','#3a9872','#357c63','#4e9a70','#348869']:
      design==='gold'?['#d5a346','#edbc5c','#d4a14b','#e3b565','#e4b95d']:['#28706d','#42817a','#327971','#4c8a7b','#31736d'];
    for(let i=0;i<steps;i++) patch(i/steps,(i+1)/steps,0,1,tones[i]);
    const front=(u,v,depth)=>{ const [a,b,c]=pt(u,v); return [a,b,c+depth]; };
    if(design==='brazil'){
      const mid=.54;
      for(let j=0;j<14;j++){
        const u0=.07+j*.86/14,u1=.07+(j+1)*.86/14;
        const half=(u)=>.397*(1-Math.abs((u-.50)/.43));
        a.quad(front(u0,.5-half(u0),.012),front(u1,.5-half(u1),.012),front(u1,.5+half(u1),.012),front(u0,.5+half(u0),.012),'#efd36c');
      }
      for(let j=0;j<14;j++){
        const angle=j*Math.PI*2/14,next=(j+1)*Math.PI*2/14;
        a.face(front(.5,mid,.020),front(.5+Math.cos(angle)*.147,mid+Math.sin(angle)*.22,.020),front(.5+Math.cos(next)*.147,mid+Math.sin(next)*.22,.020),'#31566b');
      }
      a.quad(front(.365,.574,.027),front(.623,.469,.027),front(.628,.508,.027),front(.373,.618,.027),'#f3e6b6');
    }else{
      for(let j=0;j<steps;j++)patch(j/steps,(j+1)/steps,.26,.41,design==='gold'?'#2a6e60':'#e4c25c');
      for(let j=0;j<steps;j++)patch(j/steps,(j+1)/steps,.55,.63,cream);
    }
    a.mesh(pivot,'Bandeira vincada');
    timeFlags.push({pivot,phase,amp:design==='brazil'?.084:.102});
  }

  function terrace(a,b,rows,section){
    const dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz);
    const anchor=new THREE.Group();
    anchor.position.set((a[0]+b[0])/2,.005,(a[1]+b[1])/2);
    anchor.rotation.y=-Math.atan2(dz,dx);
    group.add(anchor);
    const fold=new THREE.Group();
    anchor.add(fold);
    const built=batch();
    const half=len/2-.035;
    const step=.52,rise=.43;
    for(let r=0;r<rows;r++){
      const h=.22+(r+1)*rise, z=-r*step -.28;
      const w=half+Math.min(.30,r*.075);
      built.quad([-w,h-rise,z],[w,h-rise,z],[w,h,z],[-w,h,z],r%2?'#a17755':'#ba8d5c');
      built.quad([-w,h,z],[w,h,z],[w,h,z-step],[-w,h,z-step],r%2?'#dfba7d':'#e3c188');
      built.rect(-w,h-.052,w*2,.047,z+.012,'#f2d49a');
      built.rect(-w,h-rise+.018,w*2,.041,z+.015,'#876d4d');
      // Two scored stringers at the ends show the fold even from the side.
      [-w,w].forEach((end)=>{
        const xx=end+Math.sign(end)*.005;
        const brace = r%2 ? '#899b7c' : '#9fa381';
        built.quad([xx,h-.12,z],[xx,h-.12,z-step],[xx,h,z-step],[xx,h,z], '#c6a876');
        built.beam([xx,.025,z-.06],[xx,h-.04,z-.06],.085,.075,brace,'#627d6d');
        built.beam([xx,.05,z-.06],[xx,h-.055,z-step+.035],.090,.063,brace,'#627d6d');
        built.beam([xx,h-.18,z-.06],[xx,.06,z-step+.035],.068,.055,'#7f9379','#657c69');
      });
      // A compact central aisle keeps the supporters in irregular groups.
      const n=Math.max(3,Math.floor((2*w-.26)/.42));
      const fans=new THREE.Group();
      fans.position.set(0,h-.05,z-.24);
      fold.add(fans);const rowPrint=batch();
      for(let j=0;j<n;j++){
        const px=(-w+.20)+(2*w-.40)*(j+.22*random())/Math.max(1,n-.71);
        if(section%2===1 && Math.abs(px)<.29) continue;
        const sz=.66+random()*.36, offset=random()*.054;
        supporter(rowPrint,px,0,offset,sz,Math.floor(random()*40));
      }
      rowPrint.mesh(fans,'Torcida recortada');
      fanHinges.push({group:fans,phase:r*.73+section*.92});
      if(section%2===1){
        built.rect(-.23,h-rise+.025,.47,rise-.055,z+.02,'#997d55');
        built.rect(-.235,h-.058,.47,.052,z+.022,cream);
        built.quad([-.23,h+.004,z],[.23,h+.004,z],[.23,h+.004,z-step],[-.23,h+.004,z-step],'#d7b77d');
      }
    }
    // Back rail: narrow slotted uprights and a warm top stitch.
    const back=-rows*step-.23,top=.22+rows*rise;
    for(let p=-half+.12;p<=half;p+=1.16)
      built.beam([p,top,back],[p,top+.38,back],.048,.05,'#779283','#597266');
    built.beam([-half,top+.38,back],[half,top+.38,back],.052,.052,'#c2bf94','#809581');
    // Field-side advertising rail is printed with regional textile and pavement shapes.
    const front=.19;
    built.rect(-half,.035,half*2,.46,front,'#173e46');
    built.rect(-half,.414,half*2,.048,front+.008,cream);
    const segmentCount=Math.max(2,Math.round((2*half)/1.48)), panelW=2*half/segmentCount;
    for(let j=0;j<segmentCount;j++){
      const l=-half+j*panelW+.028, w=panelW-.056, typ=(j+section)%4;
      const base=['#37726a','#d9b455','#e5d3a1','#b66f51'][typ], mark=['#e5cb81','#356a59','#397469','#eed391'][typ];
      built.rect(l,.069,w,.328,front+.012,base);
      if(typ===0 || typ===3){
        for(let k=0;k<4;k++){
          const m=l+w*(.055+k*.235);
          built.polygon([[m,.12],[m+w*.084,.12],[m+w*.225,.349],[m+w*.139,.349]],front+.018,mark);
        }
      }else if(typ===1){
        for(let k=0;k<3;k++){
          const m=l+w*(.185+k*.315);
          built.polygon([[m-w*.12,.228],[m,.321],[m+w*.12,.228],[m,.134]],front+.018,mark);
          built.disk(m,.228,.032,front+.025,'#e7cb7e',.96,7);
        }
      }else{
        for(let k=0;k<6;k++){
          const m=l+w*.01+k*w*.16, y0=.162+((k%2) ? .089 : 0);
          built.strip([m,y0,front+.021],[m+w*.155,.162+(k%2 ? 0 : .089),front+.021],.034,mark);
          built.strip([m,y0+.065,front+.021],[m+w*.155,.227+(k%2 ? 0 : .089),front+.021],.033,mark);
        }
      }
    }
    built.mesh(fold,'Arquibancada sanfonada',paper,true);
    stands.push({fold,phase:section*.64});
    if(section===1||section===3||section===5){
      const poleX=(section===3 ? .66 : -.43)*half,poleH=top+.88+(section%3)*.20;
      const pole=batch();
      pole.beam([poleX,top-.09,back],[poleX,poleH+.04,back],.048,.045,'#d0bb8c','#a5896a');
      pole.mesh(fold,'Mastro');
      smallFlag(fold,poleX,poleH-.27,back,.90+(section%3)*.16,.52+(section%2)*.07,section===3?'brazil':section===5?'gold':'teal',section*.88);
    }
  }
  const anchors=[[-8.10,1.55],[-8.08,-2.65],[-6.57,-4.92],[-4.29,-5.89],[-.3,-5.95],[3.68,-5.93],[6.40,-5.09],[7.97,-2.74],[8.13,.63]];
  for(let i=0;i<anchors.length-1;i++){
    terrace(anchors[i],anchors[i+1],i===0||i===7?2:3,i);
  }
  // Supporters painted BRASIL onto a slightly bowed ochre paper streamer.
  const banner=new THREE.Group();
  banner.position.set(-2.91,2.21,-7.79); banner.rotation.y=.025;
  group.add(banner);
  const sign=batch(),textInk='#285d53',baseY=-.04;
  const bow=(x)=>.093*x*x/1.85;
  for(let n=0;n<8;n++){
    const x0=-1.49+n*2.98/8,x1=x0+2.98/8;
    sign.quad([x0,baseY+bow(x0),0],[x1,baseY+bow(x1),0],[x1,.36+bow(x1),0],[x0,.36+bow(x0),0],n%2?'#e2b45e':'#ebbf6b');
    sign.strip([x0,baseY+bow(x0)+.016,.012],[x1,baseY+bow(x1)+.016,.012],.032,'#598365');
  }
  for(const sx of [-1,1]){
    sign.beam([sx*1.48,-.64,0],[sx*1.48,.48,0],.045,.042,'#afac83','#698371');
    sign.polygon([[sx*1.47,.44],[sx*1.69,.48],[sx*1.61,.31],[sx*1.72,.19],[sx*1.47,.14]],-.05,'#c49d53');
  }
  const letters={
    B:[[[0,0],[0,1],[.66,1],[.86,.84],[.86,.65],[.64,.50],[0,.50]],[[.61,.50],[.9,.38],[.9,.18],[.68,0],[0,0]]],
    R:[[[0,0],[0,1],[.63,1],[.88,.85],[.88,.64],[.65,.49],[0,.49]],[[.49,.49],[.94,0]]],
    A:[[[0,0],[.48,1],[.94,0]],[[.18,.36],[.76,.36]]],
    S:[[[.90,.85],[.70,1],[.25,1],[.04,.79],[.04,.63],[.25,.51],[.73,.49],[.91,.32],[.90,.16],[.71,0],[.25,0],[.04,.14]]],
    I:[[[.12,1],[.76,1]],[[.43,1],[.43,0]],[[.12,0],[.76,0]]],
    L:[[[0,1],[0,0],[.88,0]]]
  };
  'BRASIL'.split('').forEach((name,i)=>{
    const start=-1.02+i*.355;
    for(const stroke of letters[name]){
      for(let j=0;j<stroke.length-1;j++){
        const coord=([lx,ly])=>[start+lx*.224,baseY+.083+ly*.24+bow(start),.022];
        sign.strip(coord(stroke[j]),coord(stroke[j+1]),.040,textInk);
      }
    }
  });
  sign.mesh(banner,'Faixa da torcida');

  // Lattice made from punched, folded slats. The housings wrap around two rows
  // of dry-ink cream lamp circles, with slightly differing warm paper centres.
  function floodlight(x,z,height,yaw){
    const frame=new THREE.Group(); frame.position.set(x,0,z); frame.rotation.y=yaw;
    group.add(frame);
    const tower=batch(),glow=batch();
    for(const side of [-1,1]){
      tower.beam([side*.45,.03,.17],[side*.16,height-.16,0],.092,.09,'#92a99b','#51786e');
      tower.beam([side*.45,.03,-.28],[side*.16,height-.16,-.22],.072,.065,'#607e76','#415f5e');
      tower.beam([side*.45,.04,.25],[side*.46,.04,-.35],.15,.14,'#c9b58b','#9b876d');
    }
    const n=8;
    for(let j=0;j<n;j++){
      const y0=.10+(height-.19)*j/n,y1=.10+(height-.19)*(j+1)/n;
      const w0=.45-(.29*j/n),w1=.45-.29*(j+1)/n;
      if(j%2){
        tower.strip([-w0,y0,.11],[w1,y1,.11],.066,'#b1b69b');
        tower.strip([w0,y0,.07],[-w1,y1,.07],.045,'#708f82');
      }else{
        tower.strip([w0,y0,.11],[-w1,y1,.11],.066,'#b1b69b');
        tower.strip([-w0,y0,.07],[w1,y1,.07],.045,'#708f82');
      }
      tower.beam([-w0,y0,.115],[w0,y0,.115],.054,.05,'#839f8d','#56746b');
    }
    tower.polygon([[-1.02,height+.03],[-.93,height-.10],[.89,height-.10],[1.00,height+.01],[1,height+.66],[.89,height+.76],[-.90,height+.76],[-1.02,height+.64]],.015,'#213f48');
    tower.rect(-.92,height-.035,1.84,.71,.047,'#9f9a78');
    tower.rect(-.86,height+.021,1.72,.596,.063,'#51665e');
    for(let r=0;r<2;r++){
      for(let j=0;j<5;j++){
        const px=-.665+j*.331, py=height+.157+r*.312;
        tower.disk(px,py,.140,.087,'#233e43',.98,10);
        tower.disk(px,py+.023,.124,.090,'#ccb780',.83,10);
        glow.disk(px,py+.022,.105,.095,j%3===0?'#ffe0a0':'#f9edbf',.78,12);
        glow.disk(px-.025,py+.044,.060,.097,'#fff3ca',.72,8);
      }
    }
    tower.rect(-1.03,height+.662,2.04,.065,.098,'#e4c091');
    tower.mesh(frame,'Torre de refletores',paper,true);
    glow.mesh(frame,'Lâmpadas impressas',litPaper);
  }
  floodlight(-7.57,-7.76,5.05,.12);
  floodlight(7.90,-6.56,5.43,-.13);

  // Curving paper fronds, split along the midrib into a cool and a warm face.
  function palm(x,z,height,side){
    const palm=batch(),bot=[x,0,z],mid=[x+.12*side,height*.48,z+.035],top=[x+.35*side,height,z];
    palm.beam(bot,mid,.17,.11,'#7d8263','#556c58');
    palm.beam(mid,top,.128,.088,'#9b9169','#667760');
    for(let k=1;k<=6;k++){
      const t=k/7,xx=x+.32*side*t*t,yy=height*t;
      palm.strip([xx-.070,yy+.038,z+.054],[xx+.075,yy-.024,z+.06],.034,'#c0a977');
    }
    for(let k=0;k<8;k++){
      const phi=k*Math.PI/4+.11,length=1.12+random()*.34,span=.18+random()*.085;
      const dx=Math.cos(phi)*length,dz=Math.sin(phi)*length*.70,lift=k%2?.47:.32;
      const pt=(t,wing)=>{
        const shape=Math.sin(t*Math.PI)*span;
        return [top[0]+dx*t-Math.sin(phi)*shape*wing,
          top[1]+Math.sin(Math.PI*t)*lift-.43*t+Math.abs(wing)*-.055,
          top[2]+dz*t+Math.cos(phi)*shape*wing];
      };
      for(let j=0;j<4;j++){
        const u=j/4,v=(j+1)/4;
        palm.quad(pt(u,0),pt(v,0),pt(v,-1),pt(u,-1),k%3?'#4e8666':'#5c906b');
        palm.quad(pt(u,1),pt(v,1),pt(v,0),pt(u,0),k%3?'#396958':'#44765a');
      }
    }
    palm.mesh(group,'Palmeira de lâminas vincadas',paper,true);
  }
  palm(-8.85,-5.25,3.0,-1);
  palm(8.69,-3.64,2.87,1);

  function flagpole(x,z,h,yaw){
    const frame=new THREE.Group();frame.position.set(x,0,z);frame.rotation.y=yaw;group.add(frame);
    const p=batch();
    p.beam([0,.03,0],[0,h+.035,0],.071,.064,'#d8bd88','#8f8e70');
    p.disk(0,h+.052,.054,.021,'#f3d293',1,8);
    p.mesh(frame,'Mastro de bandeira',paper,true);
    smallFlag(frame,.033,h-.46,.02,1.64,.94,'brazil',.53);
  }
  flagpole(-5.08,-7.47,3.69,-.13);

  // Bunting hangs on two shallow cables behind the crowd, keeping the goal mouth clear.
  function bunting(a,b,n){
    const span=batch(),point=(u)=>[a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u-.34*Math.sin(Math.PI*u),a[2]+(b[2]-a[2])*u];
    const inks=['#e3c060','#57927b','#eee0a9','#ba7156'];
    for(let j=0;j<n;j++){
      const u=j/n,v=(j+1)/n;
      span.beam(point(u),point(v),.019,.015,'#c1bf9b','#7e927f');
      const p=point(u+.20/n),q=point(u+.80/n),m=point(u+.54/n);
      span.face([p[0],p[1]-.012,p[2]+.007],[q[0],q[1]-.012,q[2]+.007],[m[0],m[1]-.19-random()*.10,m[2]+.08],inks[j%4]);
    }
    span.mesh(group,'Bandeirolas');
  }
  bunting([-7.57,3.38,-7.75],[-5.08,3.47,-7.47],6);
  bunting([.99,2.46,-7.82],[7.9,3.44,-6.56],13);

  // A small striped card marks either corner. The pitch beyond the baseline is
  // left free of scenery so the ball can visibly fly wide or over the crossbar.
  for(const s of [-1,1]){
    const x=s*8.62,z=-3.41;
    staticPrint.beam([x,.016,z],[x,.715,z],.041,.039,'#f1dfaf','#b3ac87');
    staticPrint.face([x,.706,z],[x+.34*s,.613,z-.015],[x,.501,z],s<0?'#e3ae50':'#c9654b');
  }
  staticPrint.mesh(group,'Cantos e bordas da folha');
  function animate(time,cheer=0){
    const lift=Math.max(0,Math.min(1,cheer));
    for(const {fold,phase} of stands){
      fold.rotation.x=-.055+lift*(.225+.032*Math.sin(time*8-phase));
    }
    for(const item of fanHinges){
      item.group.rotation.x=-.07+.032*Math.sin(time*1.7+item.phase)+lift*(.30+.09*Math.sin(time*8-item.phase));
    }
    for(const item of timeFlags){
      item.pivot.rotation.y=item.amp*Math.sin(time*2.4+item.phase)+lift*.075*Math.sin(time*5+item.phase);
      item.pivot.rotation.z=.018*Math.sin(time*1.8+item.phase);
    }
  }
  animate(0,0);
  return {group,turf,animate};
}
