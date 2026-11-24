/* Penalty puppets, drawn on warm 0.025-unit cardstock. Each moving section is a
   single batched print; the keeper's four fingers and thumb hinge independently.
   Facing +Z, positive X is the right edge of the screen in a frontal view. */
const PALETTE = {
  ink: '#202d33', hair: '#382a2a', curl: '#554039', curlLight: '#795b49',
  teal: '#228e89', deepTeal: '#176462', lightTeal: '#69c7b1', mint: '#a3e0c2',
  red: '#d34e42', deepRed: '#982f34', lightRed: '#f07753',
  cream: '#fff0c8', sand: '#e4bd85', sun: '#ffbf48', gold: '#dd8c2f',
  burnt: '#a65d2e', shorts: '#203a44', shortLight: '#38565a'
};
const faceInk = { skin:'#be7d55', mid:'#a15e43', light:'#df9e70', shade:'#824a39', glow:'#edb38a' };
const awayInk = { skin:'#bd825e', mid:'#a16c4d', light:'#dfa67a', shade:'#814f3f', glow:'#f2bd90' };
const materials = new WeakMap();
function cardInk(T) {
  if (materials.has(T)) return materials.get(T);
  const n = 96, pixels = new Uint8Array(n*n*4);
  let seed = 1979;
  const random = () => ((seed = Math.imul(seed, 1664525) + 1013904223 | 0) >>> 0) / 4294967296;
  for (let i=0; i<pixels.length; i+=4) {
    const shade = Math.round(239 + 16*random());
    pixels[i]=shade; pixels[i+1]=shade; pixels[i+2]=shade; pixels[i+3]=255;
  }
  for (let j=0; j<165; j++) {
    const x=Math.floor(random()*n), y=Math.floor(random()*n), length=2+Math.floor(random()*4);
    const value=Math.round(223+random()*18);
    for (let k=0;k<length;k++) {
      const i=4*((y+Math.floor(k*.32))%n*n+(x+k)%n);
      pixels[i]=value; pixels[i+1]=value; pixels[i+2]=value;
    }
  }
  const map=new T.DataTexture(pixels,n,n,T.RGBAFormat);
  map.wrapS=map.wrapT=T.RepeatWrapping; map.colorSpace=T.SRGBColorSpace;
  map.magFilter=T.LinearFilter; map.minFilter=T.LinearMipmapLinearFilter;
  map.generateMipmaps=true; map.needsUpdate=true;
  const ink = new T.MeshLambertMaterial({color:0xffffff,vertexColors:true,map,side:T.DoubleSide});
  materials.set(T,ink);
  return ink;
}
const ellipse = (x,y,w,h,n=14,phase=0) => Array.from({length:n},(_,i)=>[x+w*Math.cos(phase+i*2*Math.PI/n),y+h*Math.sin(phase+i*2*Math.PI/n)]);
/** A single draw call for a pile of paper patches attached to the same hinge. */
function sheet(T) {
  const positions=[], colours=[], uv=[], cache=new Map();
  function tri(a,b,c,tone) {
    const color=cache.get(tone) || new T.Color(tone); cache.set(tone,color);
    for (const p of [a,b,c]) {
      positions.push(...p); colours.push(color.r,color.g,color.b);
      uv.push(p[0]*1.55+p[2]*.85,p[1]*1.55+p[2]*.31);
    }
  }
  function print(outline,z,tone,face=1) {
    const points=outline.map(([x,y])=>new T.Vector2(x,y));
    for (const ids of T.ShapeUtils.triangulateShape(points,[])) {
      const [a,b,c]=ids.map(i=>[outline[i][0],outline[i][1],z]);
      const cross=(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
      if (cross*face>0) tri(a,b,c,tone); else tri(c,b,a,tone);
    }
  }
  function fold(path,front,back,top,edge,reverse=top) {
    print(path,front,top); print(path,back,reverse,-1);
    for(let i=0;i<path.length;i++) {
      const a=path[i], b=path[(i+1)%path.length];
      tri([...a,front],[...a,back],[...b,front],edge);
      tri([...b,front],[...a,back],[...b,back],edge);
    }
  }
  function stamp(path,z,width,tone) {
    for (let i=1;i<path.length;i++) {
      const [ax,ay]=path[i-1],[bx,by]=path[i], dx=bx-ax, dy=by-ay;
      const len=Math.hypot(dx,dy)||1, x=-dy*width/(2*len), y=dx*width/(2*len);
      print([[ax+x,ay+y],[bx+x,by+y],[bx-x,by-y],[ax-x,ay-y]],z,tone,z<0?-1:1);
    }
  }
  function mesh(name) {
    const g=new T.BufferGeometry();
    g.setAttribute('position',new T.Float32BufferAttribute(positions,3));
    g.setAttribute('color',new T.Float32BufferAttribute(colours,3));
    g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));
    g.computeVertexNormals(); g.computeBoundingSphere();
    const m=new T.Mesh(g,cardInk(T)); m.name=name; m.castShadow=true;
    return m;
  }
  return {tri,print,fold,stamp,mesh};
}
function number(b,value,size,x,y,z,under) {
  const c=PALETTE, rear=z<0?-1:1;
  const zero=[[.21,0],[.78,0],[1,.18],[1,.83],[.78,1],[.21,1],[0,.81],[0,.18]];
  const one=[[.1,.75],[.48,.99],[.79,.99],[.79,.15],[.95,.15],[.95,0],[.14,0],[.14,.15],[.4,.15],[.4,.69],[.15,.53]];
  const nine=[[.08,.95],[.3,1],[.77,1],[1,.83],[1,.18],[.79,0],[.14,0],[.14,.19],[.65,.19],[.69,.24],[.69,.40],[.21,.39],[.02,.53],[.02,.80]];
  const hole0=[[.35,.2],[.65,.2],[.71,.26],[.71,.75],[.65,.81],[.35,.81],[.29,.75],[.29,.27]];
  const hole9=[[.35,.59],[.66,.59],[.70,.64],[.70,.77],[.63,.82],[.37,.82],[.31,.77],[.31,.63]];
  const w=size*.56, advance=w*1.17, start=-(value.length-1)*advance/2-w/2;
  for (let i=0;i<value.length;i++) {
    const digit=value[i], off=start+i*advance;
    const transform=p=>p.map(([xx,yy])=>[x+rear*(off+xx*w),y+yy*size]);
    const outline=transform(digit==='0'?zero:digit==='1'?one:nine);
    b.print(outline.map(([xx,yy])=>[xx+.006,yy-.008]),z,c.ink,rear);
    b.print(outline,z+.004*rear,c.cream,rear);
    if (digit!=='1') b.print(transform(digit==='0'?hole0:hole9),z+.007*rear,under,rear);
  }
}
function shirt(T,keeper) {
  const p=PALETTE,b=sheet(T),main=keeper?p.teal:p.red,shade=keeper?p.deepTeal:p.deepRed,bright=keeper?p.lightTeal:p.lightRed;
  const outline=[[-.225,.015],[-.273,.21],[-.337,.38],[-.369,.55],[-.311,.637],[-.154,.692],[.153,.694],[.308,.636],[.374,.55],[.339,.393],[.269,.201],[.226,.015],[.168,-.056],[-.171,-.059]];
  b.fold(outline,.095,-.105,main,shade,main);
  for (const s of [1,-1]) {
    const z=s>0?.095:-.105, f=(p,depth,col)=>b.print(p,z+s*depth,col,s);
    f([[-.322,.40],[-.32,.60],[-.213,.60],[-.151,.41],[-.174,.16],[-.102,-.036],[-.206,-.036],[-.273,.21]],.002,shade);
    f([[.307,.614],[.347,.55],[.325,.415],[.244,.278],[.266,.472],[.20,.596]],.002,bright);
    f([[-.22,.022],[.22,.022],[.20,-.046],[-.206,-.046]],.004,shade);
    if(keeper) {
      f([[-.337,.515],[-.326,.592],[-.20,.555],[0,.424],[.201,.557],[.33,.59],[.34,.519],[.207,.483],[0,.356],[-.207,.483]],.006,p.mint);
      f([[-.33,.476],[-.331,.498],[-.204,.465],[0,.34],[.201,.465],[.334,.50],[.332,.475],[.205,.443],[0,.319],[-.204,.443]],.008,p.sun);
    } else {
      const stripe=[[-.262,.223],[-.247,.12],[.310,.536],[.31,.62],[.249,.636]];
      f(stripe.map(([a,h])=>[a*s,h]),.005,p.cream);
      f([[-.244,.112],[-.236,.09],[.331,.518],[.33,.534]].map(([a,h])=>[a*s,h]),.007,p.sand);
    }
    f([[-.165,.674],[-.118,.685],[0,.62],[.12,.685],[.164,.673],[.119,.623],[0,.555],[-.12,.62]],.012,p.ink);
    f([[-.143,.677],[-.101,.685],[0,.629],[.106,.685],[.142,.677],[.10,.646],[0,.583],[-.102,.643]],.014,keeper?p.sun:p.cream);
    number(b,keeper?'01':'9',s>0?.181:.226,s>0?-.025:0,.067,z+s*.021,shade);
    if(s>0) {
      f([[.162,.538],[.229,.55],[.234,.621],[.207,.64],[.164,.626]],.024,p.ink);
      f([[.17,.55],[.219,.558],[.221,.614],[.201,.629],[.173,.618]],.027,p.sun);
      f([[.181,.571],[.211,.577],[.211,.601],[.181,.603]],.030,keeper?p.teal:p.red);
    }
  }
  return b.mesh('folded jersey and printed number');
}
function shorts(T,keeper) {
  const b=sheet(T),p=PALETTE,base=keeper?p.shorts:'#263d4e';
  const sh=[[-.233,.058],[.231,.059],[.276,-.048],[.312,-.195],[.125,-.23],[.025,-.143],[-.024,-.141],[-.119,-.235],[-.314,-.195],[-.279,-.05]];
  b.fold(sh,.115,-.096,base,p.ink,base);
  for(const d of [1,-1]) {
    const z=d>0?.12:-.102;
    b.print([[-.225,.03],[.228,.03],[.241,-.028],[-.244,-.028]],z,p.ink,d);
    for(const s of [-1,1]) {
      const map=path=>path.map(([x,y])=>[x*s,y]);
      b.print(map([[.243,-.016],[.272,-.056],[.303,-.19],[.264,-.199],[.215,-.05]]),z+d*.005,keeper?p.lightTeal:p.cream,d);
      b.print(map([[.096,-.12],[.112,-.196],[.192,-.207],[.133,-.157]]),z+d*.006,p.shortLight,d);
    }
  }
  return b.mesh('folded shorts');
}
function head(T,keeper) {
  const p=PALETTE,k=keeper?faceInk:awayInk,b=sheet(T);
  b.fold([[-.093,-.095],[.103,-.095],[.125,.168],[-.099,.174]],.054,-.079,k.skin,k.shade,k.mid);
  b.print([[-.096,-.018],[-.052,-.021],[.084,.058],[.108,.156],[-.09,.169]],.056,k.mid);
  const skull=[[-.235,.269],[-.247,.383],[-.211,.503],[-.146,.578],[-.054,.615],[.062,.609],[.18,.56],[.244,.456],[.245,.344],[.222,.254],[.158,.158],[.052,.095],[-.068,.109],[-.164,.172]];
  b.fold(skull,.072,-.121,p.hair,p.curl,p.hair);
  const bunX=keeper?-.117:.087, bunY=keeper?.545:.453;
  const lobed=(x,y,rx,ry,count,curls)=>Array.from({length:count},(_,i)=>{
    const a=Math.PI*2*i/count, r=1+.071*Math.cos(a*curls)+.042*Math.sin(a*3);
    return [x+rx*r*Math.cos(a),y+ry*r*Math.sin(a)];
  });
  let bun=lobed(bunX,bunY,keeper?.184:.13,keeper?.157:.145,60,9);
  b.fold(bun,-.119,-.211,p.hair,p.curl,p.hair);
  const coils=[[-.085,.007,.067],[.006,.065,.062],[.078,.014,.055],[-.018,-.063,.062],[.048,-.055,.038]];
  for (const [dx,dy,r] of coils) {
    const x=bunX+dx,y=bunY+dy;
    const mark=[[x-r*.78,y-r*.05],[x-r*.63,y+r*.53],[x,y+r*.76],[x+r*.59,y+r*.52],[x+r*.67,y+r*.4]];
    b.stamp(mark,-.214,.013,p.curlLight);
  }
  if(!keeper) {
    const tail=[[.013,.504],[.116,.492],[.192,.375],[.224,.201],[.291,.082],[.22,.104],[.224,.065],[.134,.122],[.095,.24],[.072,.367]];
    b.fold(tail,-.155,-.200,p.hair,p.curl,p.curl);
    b.print([[.104,.383],[.122,.437],[.165,.399],[.156,.348]],-.205,p.red,-1);
    b.stamp([[.128,.312],[.16,.20],[.201,.14]],-.208,.012,p.curlLight);
  }
  for(const s of [-1,1]) {
    const ear=ellipse(s*.215,.285,.056,.079,12,.2);
    b.fold(ear,.112,-.037,k.skin,k.shade,k.mid);
    b.print(ellipse(s*.224,.285,.028,.041,9,.3),.115,k.mid);
    b.print(ellipse(s*.231,.232,.014,.013,8),.119,keeper?p.sun:p.cream);
  }
  const face=[[-.207,.404],[-.184,.483],[-.103,.519],[.027,.53],[.153,.501],[.206,.438],[.216,.339],[.196,.222],[.134,.126],[.057,.08],[-.038,.073],[-.115,.112],[-.171,.184],[-.194,.267]];
  b.fold(face,.145,.06,k.skin,k.shade,k.skin);
  b.print([[-.185,.299],[-.174,.226],[-.123,.207],[-.084,.239],[-.076,.273],[-.118,.275]],.148,k.light);
  b.print([[.156,.43],[.202,.43],[.212,.34],[.194,.23],[.129,.134],[.05,.088],[.092,.138],[.143,.226],[.147,.284]],.148,k.mid);
  b.print([[-.173,.407],[-.151,.455],[-.048,.497],[.031,.493],[-.047,.457],[-.079,.414]],.149,k.light);
  // Eyes are small ink almonds with the keeper's gaze lifted towards the ball.
  for (const s of [-1,1]) {
    const ex=s*.091,ey=.322;
    const eyeOutline=[[ex-.069,ey],[ex-.028,ey+.022],[ex+.013,ey+.024],[ex+.062,ey+.005],[ex+.033,ey-.011],[ex-.023,ey-.012]];
    b.print(eyeOutline,.153,p.ink);
    b.print([[ex-.054,ey],[ex-.024,ey+.01],[ex+.017,ey+.012],[ex+.048,ey+.003],[ex+.011,ey-.003],[ex-.02,ey-.004]],.154,p.cream);
    b.print(ellipse(ex+.003,ey+.004,.017,.016,9),.155,p.ink);
    b.print(ellipse(ex-.002,ey+.009,.004,.005,6),.156,p.cream);
    const brow=[[.031,.366],[.084,.391],[.148,.391],[.166,.373],[.097,.377],[.039,.353]].map(([x,y])=>[x*s,y+(s<0?.008:0)]);
    b.print(brow,.157,p.hair);
  }
  b.print([[-.010,.324],[-.028,.264],[-.046,.234],[-.021,.222],[.020,.229],[.031,.242],[.008,.25]],.157,k.mid);
  b.print([[-.026,.238],[.004,.233],[.012,.242],[.002,.248]],.159,k.light);
  b.print([[-.067,.182],[-.018,.184],[.003,.19],[.025,.181],[.073,.186],[.046,.167],[.009,.158],[-.026,.16]],.158,'#864c41');
  b.stamp([[-.057,.18],[-.008,.177],[.031,.174],[.065,.184]],.161,.008,p.hair);
  b.print([[-.028,.151],[.006,.146],[.034,.155],[.013,.158]],.162,k.glow);
  const cap=[[-.218,.269],[-.24,.324],[-.237,.448],[-.193,.527],[-.117,.588],[-.02,.609],[.104,.591],[.187,.543],[.233,.451],[.231,.355],[.211,.302],[.185,.384],[.139,.449],[.105,.466],[.066,.445],[-.011,.437],[-.054,.452],[-.128,.419],[-.168,.378],[-.182,.294]];
  b.fold(cap,.169,.136,p.hair,p.curl,p.hair);
  b.print([[-.212,.434],[-.162,.526],[-.073,.574],[.008,.58],[-.052,.55],[-.11,.521],[-.139,.476]],.172,p.curl);
  b.print([[.045,.576],[.113,.561],[.187,.513],[.215,.464],[.162,.51],[.113,.533]],.172,p.curl);
  const band=[[-.234,.407],[-.198,.462],[-.12,.501],[-.02,.522],[.102,.516],[.184,.479],[.228,.413],[.23,.432],[.188,.502],[.109,.548],[-.014,.558],[-.129,.536],[-.208,.493],[-.24,.434]];
  b.print(band,.175,keeper?p.lightTeal:p.red);
  b.stamp([[-.198,.479],[-.127,.523],[-.043,.54]],.177,.007,keeper?p.cream:p.lightRed);
  for (const [x,y] of [[-.18,.476],[-.12,.543],[-.038,.566],[.045,.56],[.129,.534]]) {
    b.stamp([[x-.017,y+.001],[x-.013,y+.014],[x+.002,y+.018],[x+.011,y+.01]],.178,.007,p.curlLight);
  }
  b.stamp([[-.182,.27],[-.177,.205],[-.135,.149]],.152,.007,k.glow);
  for(const s of [-1,1]) b.stamp([[s*.173,.399],[s*.138,.46],[s*.061,.506]],-.124,.012,p.curlLight);
  b.print([[-.208,.406],[-.121,.447],[.07,.457],[.208,.399],[.205,.423],[.073,.481],[-.12,.474],[-.211,.435]],-.127,keeper?p.teal:p.red,-1);
  return b.mesh('face, tied hair and printed headband');
}
function sleeve(T,keeper,upper,side) {
  const p=PALETTE,b=sheet(T),skin=keeper?faceInk:awayInk, length=upper?.385:.374;
  const main=keeper?p.teal:upper?p.red:skin.skin, shade=keeper?p.deepTeal:upper?p.deepRed:skin.mid;
  const width=upper?.116:.087, lower=upper?.094:.066;
  const path=[[-width+.02,.035],[width-.015,.035],[width,.0],[lower+.006,-length+.056],[lower*.75,-length+.006],[-lower*.72,-length],[-lower,-length+.038],[-width,-.06]];
  b.fold(path,.057,-.054,main,shade,main);
  for(const s of [1,-1]) {
    const z=s>0?.06:-.057, mirror=side*s;
    const local=outline=>outline.map(([x,y])=>[mirror*x,y]);
    b.print(local([[-width*.88,-.018],[-width*.57,.023],[-width*.5,-.176],[-lower*.71,-length+.036],[-lower*.89,-length+.07]]),z,shade,s);
    if(upper) {
      b.print(local([[-.101,-.014],[-.086,.019],[.083,.010],[.11,-.023],[.025,-.045]]),z+s*.003,keeper?p.lightTeal:p.cream,s);
      b.print(local([[-.079,-.265],[.087,-.244],[.086,-.277],[-.078,-.302]]),z+s*.005,keeper?p.sun:p.cream,s);
      if(!keeper)b.print(local([[-.09,-.303],[.087,-.278],[.071,-.361],[-.071,-.361]]),z+s*.007,skin.skin,s);
    }else if(keeper) {
      b.print(local([[-.08,-.064],[.084,-.09],[.076,-.132],[-.076,-.105]]),z+s*.004,p.lightTeal,s);
      b.print(local([[-.074,-.129],[.076,-.153],[.071,-.177],[-.073,-.153]]),z+s*.005,p.mint,s);
      b.print(local([[-.065,-.289],[.065,-.271],[.058,-.354],[-.056,-.359]]),z+s*.005,p.ink,s);
    }
  }
  return b.mesh(upper?'shoulder and sleeve':'folded forearm');
}
function leg(T,keeper,upper,s) {
  const b=sheet(T),p=PALETTE,k=keeper?faceInk:awayInk,L=upper?.50:.478,w=upper?.13:.096;
  const cut=[[-w*.85,.026],[w*.82,.024],[w,-.053],[w*.84,-L*.52],[w*.70,-L+.025],[w*.49,-L],[-w*.49,-L],[-w*.73,-L+.023],[-w*.87,-L*.48],[-w,-.065]];
  const base=upper?k.skin:keeper?p.teal:p.cream;
  b.fold(cut,.062,-.064,base,upper?k.shade:keeper?p.deepTeal:p.sand,upper?k.mid:base);
  for (const d of [1,-1]) {
    const z=d>0?.065:-.067, mir=s*d;
    const local=v=>v.map(([x,y])=>[x*mir,y]);
    if(upper) {
      b.print(local([[-w*.95,-.105],[-.066,-.16],[-.052,-.35],[-.056,-.456],[-.086,-.466],[-.109,-.25]]),z,k.mid,d);
      b.print(local([[-w,-.03],[.125,-.041],[.105,-.16],[-.116,-.193]]),z+d*.003,p.shorts,d);
      b.print(local([[.080,-.049],[.122,-.05],[.107,-.156],[.075,-.161]]),z+d*.006,keeper?p.lightTeal:p.cream,d);
      if(keeper) b.print(local([[-.076,-.399],[-.049,-.374],[.049,-.375],[.078,-.396],[.066,-.489],[-.064,-.489]]),z+d*.007,p.shortLight,d);
    } else {
      b.print(local([[-.082,-.018],[.084,-.018],[.092,-.084],[-.084,-.088]]),z+d*.003,keeper?p.ink:p.deepRed,d);
      b.print(local([[-.082,-.116],[.084,-.11],[.083,-.132],[-.081,-.138]]),z+d*.005,keeper?p.sun:p.red,d);
      b.print(local([[-.072,-.16],[-.045,-.144],[-.032,-.343],[-.047,-.411],[-.062,-.315]]),z+d*.007,keeper?p.lightTeal:p.sand,d);
    }
  }
  return b.mesh(upper?'shorts leg and knee':'printed match sock');
}
function boot(T,keeper,side) {
  const b=sheet(T),p=PALETTE,c=keeper?p.ink:'#263944';
  const sole=[[ -.092,-.096],[.089,-.096],[.111,-.035],[.106,.122],[.079,.206],[-.025,.23],[-.103,.17],[-.11,.015]];
  const upperY=z=>z<0?.04:z<.13?-.007:-.038;
  for(let i=0;i<sole.length;i++) {
    const [x,z]=sole[i],[u,w]=sole[(i+1)%sole.length], v=[x,upperY(z),z],v1=[u,upperY(w),w];
    const lo=[x,-.092,z],lo1=[u,-.092,w],edge=[x,-.073,z],edge1=[u,-.073,w];
    b.tri(v,v1,[0,.057,.003],c); b.tri(v1,v,edge,p.shorts); b.tri(v1,edge,edge1,c);
    b.tri(edge,lo,lo1,p.sand); b.tri(edge,lo1,edge1,p.cream); b.tri(lo1,lo,[0,-.092,.045],p.ink);
  }
  for(const z of [.04,.077,.112]) {
    const y=.049-.32*z;
    b.tri([-.055,y,z],[.06,y-.001,z+.005],[.052,y-.003,z+.017],p.cream);
    b.tri([-.055,y,z],[.052,y-.003,z+.017],[-.046,y-.004,z+.016],p.cream);
  }
  for (const x of [-.055,.055]) for(const z of [-.052,.139]) {
    b.tri([x-.018,-.09,z],[x+.021,-.09,z],[x+.013,-.112,z+.012],p.ink);
    b.tri([x-.018,-.09,z],[x+.013,-.112,z+.012],[x-.014,-.112,z+.014],p.ink);
  }
  return b.mesh('creased football boot');
}
function hand(T,keeper,s) {
  const p=PALETTE,b=sheet(T),k=awayInk;
  const root=new T.Group(), fingers=[];
  const mirror=poly=>poly.map(([x,y])=>[s*x,y]);
  if(!keeper) {
    const silhouette=mirror([[-.049,-.013],[.041,-.011],[.075,.035],[.09,.113],[.065,.165],[.026,.182],[-.035,.153],[-.055,.112],[-.086,.105],[-.100,.069],[-.081,.055],[-.056,.069]]);
    b.fold(silhouette,.037,-.034,k.skin,k.shade,k.mid);
    b.stamp(mirror([[-.014,.122],[.03,.132],[.061,.12]]),.041,.01,k.mid);
    root.add(b.mesh('striker hand'));
    const tip=new T.Object3D(); tip.position.set(0,.15,.035); root.add(tip);
    return {root,fingers,tip};
  }
  // Each separated finger is hinged where it enters the palm, so the paper
  // bends at the contact point on a fingertip save (and a near miss).
  const palm=mirror([[-.084,-.05],[.075,-.049],[.109,.015],[.132,.083],[.147,.18],[.133,.248],[.089,.275],[-.046,.283],[-.133,.245],[-.158,.171],[-.15,.076],[-.118,.024]]);
  b.fold(palm,.057,-.038,p.sun,p.burnt,p.gold);
  const patch=(poly,z,color)=>b.print(mirror(poly),z,color,z<0?-1:1);
  patch([[-.15,.147],[-.113,.183],[-.09,.226],[.041,.257],[.124,.23],[.133,.19],[.105,.185],[.052,.211],[-.058,.185],[-.107,.118]],.060,'#f6a53d');
  patch([[-.129,.143],[-.11,.174],[-.069,.19],[-.032,.164],[-.016,.111],[-.039,.076],[-.098,.088]],.061,'#ffdb79');
  patch([[.028,.075],[.076,.096],[.114,.147],[.12,.202],[.081,.201],[.057,.183],[.025,.143]],.061,'#e99d36');
  patch([[-.081,.055],[-.014,.071],[.025,.058],[.051,.023],[-.017,.012],[-.074,.024]],.063,p.cream);
  for (const y of [.122,.145,.166]) b.stamp(mirror([[-.080,y],[-.045,y+.01],[-.025,y+.003]]),.065,.006,p.gold);
  const cuff=mirror([[-.11,-.05],[.09,-.049],[.115,-.007],[.102,.049],[-.095,.052],[-.121,.014]]);
  b.fold(cuff,.066,-.048,p.deepTeal,p.ink,p.ink);
  patch([[-.102,.036],[.097,.031],[.103,.019],[-.107,.018]],.069,p.lightTeal);
  patch([[-.074,-.033],[-.022,-.036],[-.025,.009],[-.089,.011]],.070,p.sun);
  patch([[.021,-.03],[.071,-.031],[.077,-.016],[.025,-.014]],.070,p.cream);
  patch([[-.132,.079],[-.096,.117],[-.02,.189],[.08,.207],[.123,.195],[.102,.161],[.038,.135],[-.008,.103],[-.072,.063]],-.041,p.burnt);
  patch([[-.114,.121],[-.085,.154],[-.001,.207],[.086,.224],[.121,.216],[.085,.195],[.014,.179],[-.052,.15]],-.044,p.cream);
  patch([[-.105,.145],[-.075,.185],[-.025,.232],[.046,.244],[.099,.242],[.08,.222],[.006,.209],[-.053,.185]],-.045,p.sun);
  root.add(b.mesh('glove palm, printed grip and cuff'));
  // Index is closest to the thumb. Side controls left/right handedness.
  const digits=[[-.092,.218,.173,.039,-.12],[-.028,.238,.189,.040,-.024],[.040,.238,.163,.037,.066],[.101,.220,.125,.032,.16],[-.13,.102,.127,.041,-.78]];
  let tip;
  for(let i=0;i<digits.length;i++) {
    const [offset,height,len,w,spread]=digits[i];
    const hinge=new T.Group(); hinge.position.set(s*offset,height,.015); hinge.rotation.order='ZXY';
    hinge.rotation.z=-s*spread; root.add(hinge);
    const finger=sheet(T);
    const tab=[[-w*.89,-.015],[w*.91,-.014],[w,.042],[w*.93,len-.035],[w*.56,len-.007],[w*.14,len],[-w*.58,len-.008],[-w*.91,len-.032],[-w,.04]];
    finger.fold(tab,.036,-.019,p.sun,p.burnt,p.gold);
    for(const d of [1,-1]) {
      const z=d>0?.039:-.022;
      finger.print([[-w*.91,len-.041],[w*.92,len-.035],[w*.62,len-.010],[w*.14,len-.002],[-w*.56,len-.01]],z,d>0?'#ffe492':p.cream,d);
      finger.print([[-w*.86,len*.42],[w*.94,len*.46],[w*.91,len*.54],[-w*.9,len*.51]],z+d*.001,p.gold,d);
      if(d<0) finger.print([[-w*.88,.01],[w*.92,.018],[w*.97,.033],[-w*.86,.028]],z-.002,p.burnt,d);
    }
    hinge.add(finger.mesh('articulated glove finger '+(i+1)));
    fingers.push({hinge,spread:hinge.rotation.z,amount:[.95,1,.88,.72,.6][i]});
    if(i===1) { tip=new T.Object3D(); tip.position.set(0,len-.022,.045); hinge.add(tip); }
  }
  return {root,fingers,tip};
}
function armature(T,one,two) {
  const axis=new T.Vector3(),perp=new T.Vector3(),elbow=new T.Vector3(),end=new T.Vector3();
  const up=new T.Vector3(),right=new T.Vector3(),front=new T.Vector3(),facing=new T.Vector3(0,0,1),fallback=new T.Vector3(0,1,0), basis=new T.Matrix4();
  function setBone(part,start,finish) {
    part.position.copy(start);
    up.copy(start).sub(finish).normalize();
    right.crossVectors(up,facing);
    if(right.lengthSq()<.0001)right.crossVectors(up,fallback);
    right.normalize(); front.crossVectors(right,up);
    basis.makeBasis(right,up,front); part.quaternion.setFromRotationMatrix(basis);
  }
  return function place(a,target,pole,l1,l2) {
    axis.copy(target).sub(a);
    const distance=Math.max(Math.abs(l1-l2)+.0001,Math.min(l1+l2-.0001,axis.length()));
    axis.normalize(); end.copy(a).addScaledVector(axis,distance);
    perp.copy(pole).addScaledVector(axis,-pole.dot(axis));
    if (perp.lengthSq()<.0001)perp.copy(fallback).addScaledVector(axis,-axis.y);
    perp.normalize();
    const along=(l1*l1-l2*l2+distance*distance)/(2*distance);
    elbow.copy(a).addScaledVector(axis,along).addScaledVector(perp,Math.sqrt(Math.max(0,l1*l1-along*along)));
    setBone(one,a,elbow); setBone(two,elbow,end);
    return end;
  };
}
/** Both puppets face +Z. The caller owns all transforms on group. */
export function createAthlete(THREE,role='keeper') {
  const T=THREE, keeper=role==='keeper', group=new T.Group(), hips=new T.Group(),torso=new T.Group(),neck=new T.Group();
  group.name=keeper?'Joana, goalkeeper':'Penalty taker'; group.add(hips); hips.add(torso);
  hips.add(shorts(T,keeper)); torso.add(shirt(T,keeper)); torso.add(neck);
  neck.position.set(0,.682,.016); neck.add(head(T,keeper));
  const eye=new T.Object3D(); eye.position.set(.090,.325,.162); neck.add(eye);
  const rigs=[];
  for (const s of [-1,1]) {
    const upper=sleeve(T,keeper,true,s),lower=sleeve(T,keeper,false,s),palm=hand(T,keeper,s);
    torso.add(upper,lower,palm.root);
    const thigh=leg(T,keeper,true,s),shin=leg(T,keeper,false,s),shoe=boot(T,keeper,s);
    hips.add(thigh,shin,shoe);
    rigs.push({s,palm,shoe,
      shoulder:new T.Vector3(s*.323,.548,.012), joint:new T.Vector3(s*.163,-.025,.005),
      arms:armature(T,upper,lower), legs:armature(T,thigh,shin),
      wrist:new T.Vector3(), ankle:new T.Vector3(), pole:new T.Vector3()});
  }
  const smooth=x=>x*x*(3-2*x), unit=x=>Math.max(0,Math.min(1,x)), mix=(a,b,t)=>a+(b-a)*t;
  function pose({time=0,clap=0,run=0,kick=0,dive=0,side=1,flex=0,grip=0}={}) {
    const d=unit(dive), f=unit(flex), c=unit(clap)*(1-d), r=unit(run), k=unit(kick), lead=side<0?-1:1;
    const cadence=time*(keeper?12.1:15.3), stride=Math.sin(cadence);
    const still=Math.sin(time*2.65);
    hips.position.y=(keeper?1.045:1.075)+.011*still*(1-r)*(1-d)+.055*r*Math.abs(stride)-.072*d;
    torso.rotation.set(.035+(keeper?.025:0)+r*.115+.05*k,.06*stride*r,lead*(-.205*d)+.02*still*(1-d));
    neck.rotation.set(-.025-.11*r,.075*Math.sin(time*1.3)*(1-d)+lead*.09*d,.09*lead*d);
    for (const rig of rigs) {
      const {s,palm,shoe,shoulder,joint,wrist,ankle,pole}=rig;
      const active=s===lead;
      let dx=s*(keeper?.465:.19),dy=keeper?-.33:-.557,dz=keeper?.19:.094;
      // The striker's shoulders counter-rotate against the kicking leg.
      if (!keeper) {
        dx+=s*.045*r; dy+=.12*r; dz+=s*r*.44*stride;
        dx=mix(dx,s*(s<0?.52:.44),k); dy=mix(dy,s<0?-.26:-.038,k); dz=mix(dz,s<0?.06:.24,k);
      }
      dx=mix(dx,-s*.186,c); dy=mix(dy,.005,c); dz=mix(dz,.53,c);
      dx=mix(dx,active?s*.49:lead*.47,d); dy=mix(dy,active?.535:.356,d); dz=mix(dz,active?.135:.22,d);
      if(keeper&&!active&&grip){dx=mix(dx,lead*.735,grip);dy=mix(dy,.41,grip);dz=mix(dz,.28,grip);}
      wrist.set(shoulder.x+dx,shoulder.y+dy,shoulder.z+dz);
      pole.set(s*(1-.55*d),-.83+.20*d,-.24);
      palm.root.position.copy(rig.arms(shoulder,wrist,pole,.385,.374));
      const relax=keeper?-s*.62:s*(2.76-.31*r);
      palm.root.rotation.order='ZXY';
      palm.root.rotation.z=mix(mix(relax,s*.48,c),-lead*(active?.71:.76),d);
      palm.root.rotation.x=-.1+c*.07+d*.12;
      palm.root.rotation.y=s*(-.12+c*.88)-lead*.19*d;
      for(const digit of palm.fingers) {
        const fold=Math.max(active?f:.62*f,grip*.55)*digit.amount;
        digit.hinge.rotation.x=.026+fold*1.40;
        digit.hinge.rotation.z=digit.spread*(1-.28*fold);
      }
      const step=s*stride;
      let footX=s*(keeper?.394:.23), footY=.112+.19*Math.max(0,step)*r, footZ=.018+s*.018+r*.43*step;
      if(!keeper&&k>0) {
        const pull=Math.sin(Math.PI*Math.min(1,k/.57)), sweep=smooth(unit((k-.38)/.55));
        if (s<0) {
          footZ=mix(footZ,-.41*pull+.70*sweep,k<.12?k/.12:1);
          footY+=.25*pull+.40*sweep;
          footX-=.05*pull;
        }else footZ=mix(footZ,.18,k);
      }
      footX=mix(footX,s*.32-lead*(active?.20:.34),d); footZ=mix(footZ,active?-.18:.24,d); footY+=d*(active?.23:.16);
      ankle.set(footX,footY-hips.position.y,footZ);
      pole.set(s*.10,-.26,.88);
      shoe.position.copy(rig.legs(joint,ankle,pole,.50,.478));
      shoe.rotation.set(-.06*r*step-.24*k*(s<0?1:0)+.22*d,s*.15,s*.04*d);
    }
  }
  const glove=s=>rigs[s<0?0:1].palm.tip;
  pose();
  return {group,pose,glove,eye,reach:glove};
}
/** A true truncated icosahedron: 12 charcoal pentagons and 20 cream hexagons.
    Gaps between inset panels expose the dark printed folds underneath. */
export function createBall(THREE) {
  const T=THREE,b=sheet(T),phi=(1+Math.sqrt(5))/2,radius=.25;
  const vertices=[];
  for(const a of [-1,1])for(const v of [-phi,phi]) {
    vertices.push(new T.Vector3(0,a,v),new T.Vector3(a,v,0),new T.Vector3(v,0,a));
  }
  const neighbours=vertices.map((v,i)=>vertices.map((p,j)=>i!==j&&Math.abs(p.distanceToSquared(v)-4)<1e-5?j:-1).filter(j=>j>=0));
  const between=(i,j)=>vertices[i].clone().multiplyScalar(2).add(vertices[j]).normalize().multiplyScalar(radius);
  const cream=['#fff0ca','#f9e9c9','#f7e2b7','#fff2cf'],black=['#223338','#303d3e','#253a3c'];
  function outward(a,d,e,col) {
    const outward=d.clone().sub(a).cross(e.clone().sub(a)).dot(a);
    if(outward>0)b.tri(a.toArray(),d.toArray(),e.toArray(),col); else b.tri(e.toArray(),d.toArray(),a.toArray(),col);
  }
  let id=0;
  function panel(ring,dark) {
    const center=ring.reduce((sum,pt)=>sum.add(pt),new T.Vector3()).multiplyScalar(1/ring.length);
    const axis=center.clone().normalize(),u=ring[0].clone().sub(center).normalize(),v=axis.clone().cross(u);
    ring.sort((a,d)=>{
      const x=a.clone().sub(center),y=d.clone().sub(center);
      return Math.atan2(x.dot(v),x.dot(u))-Math.atan2(y.dot(v),y.dot(u));
    });
    const fan=center.clone().addScaledVector(axis,.0012),top=fan.clone().addScaledVector(axis,.001);
    const inside=ring.map(pt=>pt.clone().lerp(center,.043).addScaledVector(axis,.0008));
    const palette=dark?black:cream;
    const base=palette[(id*7)%palette.length];
    for (let i=0;i<ring.length;i++) {
      const j=(i+1)%ring.length;
      outward(ring[i],ring[j],center,'#514c3e');
      const minor=i===0&&id%3===0?palette[(id+1)%palette.length]:base;
      outward(inside[i],inside[j],top,minor);
      if(i===1||i===3) {
        const a=inside[i].clone().lerp(inside[j],.08),d=inside[i].clone().lerp(inside[j],.84);
        const e=d.clone().lerp(center,.022).addScaledVector(axis,.00035),h=a.clone().lerp(center,.022).addScaledVector(axis,.00035);
        a.addScaledVector(axis,.0004); d.addScaledVector(axis,.0004);
        const lip=dark?'#576261':'#fff4d6'; outward(a,d,e,lip); outward(a,e,h,lip);
      }
    }
    id++;
  }
  for(let i=0;i<12;i++)panel(neighbours[i].map(j=>between(i,j)),true);
  for(let i=0;i<12;i++)for(const j of neighbours[i])if(j>i)for(const k of neighbours[j]) {
    if(k<=j||!neighbours[i].includes(k))continue;
    panel([between(i,j),between(j,i),between(j,k),between(k,j),between(k,i),between(i,k)],false);
  }
  const ball=new T.Group(); ball.name='stitched paper football'; const print=b.mesh('hand-cut football panels');
  // Tip one pentagonal panel toward the stands in the opening still.
  print.rotation.set(.18,.22,-.13); ball.add(print); return ball;
}
