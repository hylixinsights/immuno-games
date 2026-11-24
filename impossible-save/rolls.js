// The reverse of the field carries rolled strips of card. Each spiral is an open
// sheet with two visible end cuts, wound twice around a continuous axonal core.
export function makeReverseAxon(T){
  const group=new T.Group(),wraps=new T.Group();group.add(wraps);group.rotation.x=Math.PI;
  group.position.set(0,-.135,.2);group.visible=false;
  const core=new T.Mesh(new T.CylinderGeometry(.18,.18,17.1,10),new T.MeshLambertMaterial({color:'#b46a53',flatShading:true}));
  core.position.y=.58;core.rotation.z=Math.PI/2;group.add(core);
  function build(stage,injured){
    for(const old of [...wraps.children]){wraps.remove(old);old.geometry.dispose();old.material.dispose();}
    const stock=[['#8cc0a0','#e3d49b','#557f75'],['#d79272','#e7cc9e','#996a55'],['#7b9dad','#d1c6bb','#586e82']][stage];
    const pos=[],col=[];const shade=new T.Color();
    function tri(a,b,c,ink){pos.push(...a,...b,...c);shade.set(ink);for(let j=0;j<3;j++)col.push(shade.r,shade.g,shade.b);}
    for(let i=-2;i<=2;i++){
      const middle=i*3.36, damaged=injured&&i===0;
      for(let j=0;j<50;j++){
        if(damaged&&j>31&&j<42)continue;
        const end=(j,side)=>{const t=j/50,angle=t*Math.PI*4.12,r=.26+.32*t+(damaged&&j>=42?(j-42)*.047:0),w=1.32+(damaged?.15*Math.sin(j*1.8+side):0);return [middle+side*w,.63+r*Math.cos(angle),r*Math.sin(angle)];};
        const a=end(j,-1),b=end(j,1),c=end(j+1,1),d=end(j+1,-1);const ink=stock[j%12===0?1:0];tri(a,b,c,ink);tri(a,c,d,ink);
        for(const side of [-1,1]){const l=end(j,side),m=end(j+1,side),n=[m[0]+side*.043,m[1]-.032,m[2]],o=[l[0]+side*.043,l[1]-.032,l[2]];tri(l,m,n,stock[1]);tri(l,n,o,stock[2]);}
      }
    }
    const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(pos,3));geo.setAttribute('color',new T.Float32BufferAttribute(col,3));geo.computeVertexNormals();const mat=new T.MeshLambertMaterial({vertexColors:true,side:T.DoubleSide,flatShading:true});wraps.add(new T.Mesh(geo,mat));group.visible=true;
  }
  return {group,build};
}
export function gloveTunnel(T){
  const group=new T.Group();
  const colors=['#568b81','#87ae97','#d8bd80','#e8c483'];
  for(let i=0;i<4;i++){
    const geometry=new T.CylinderGeometry(.105+i*.021,.090+i*.021,.115,16,1,true);geometry.rotateX(Math.PI/2);
    const shell=new T.Mesh(geometry,new T.MeshLambertMaterial({color:colors[i],side:T.DoubleSide,flatShading:true}));shell.position.z=-.34+i*.074;group.add(shell);
  }
  group.visible=false;return group;
}
