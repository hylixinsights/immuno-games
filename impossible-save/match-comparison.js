import {BALL_RADIUS, CONTACT, lerp, smooth, fieldState, matchedTrial, handAt, ballAt} from './rules.js?v=7';
import {drawField, fieldProject} from './field-print.js?v=2';

export const matchCopy = {
  en: {
    homeCompare:'What does MS change?', immune:'Immune cells & natalizumab',
    tickets:['Both pathways preserved','Left eye reads later','Less room to correct the glove'],
    identity:['MS · preserved pathway','MS · left optic lesion','MS · cerebellar lesion'],
    rightIdentity:'MS · right eye preserved',
    catches:['','The left eye read the corner later. Joana still timed the dive and closed both hands on the ball.',
      'Joana read the corner on time. Your final correction brought the ball into her palm.'],
    home:['Joana has MS on every training day. Start with her visual and motor pathways working well.',
      'Through her left eye the red shirt looks faded and the corner comes into focus later.',
      'Joana sees the corner as usual. The late correction leaves less room to place her hand.'],
    pairs:['Preserved pathway','Optic nerve lesion','Cerebellar lesion'],
    test:['Play with the preserved pathway','Play this kick with the optic lesion','Play this kick with the cerebellar lesion'],
    pairTitle:'Same kick, same releases', example:'Example kick', own:'Your recorded jumps',
    matched:'Two views of the same penalty', angles:'On the pitch', paths:'Ball and glove paths',
    model:'The release brackets and flight percentages are game mechanics.',
    sample:'Three recorded releases are held constant. Change the pathway and watch the ball.',
    facts:['','A slower signal from the left optic nerve leaves less time to dive. Aim inside the smaller brackets on the visual jump.',
      'The visual read stays the same. A delayed cerebellar correction makes the motor landing more demanding.'],
    pulseWait:'Reading…', readLabel:'Direction read', reachLabel:'Reach at the ball',
    held:'Glove reaches ball', short:'Outside reach', unknown:'Contact · grip unplayed',
    opticBracket:'Visual landing · 40% narrower window', motorBracket:'Motor landing · 45% narrower window',
    guideBracket:'Dashed marks show the original margin. Land between the solid marks.',
    firstDirection:'With the preserved pathway the corner is already visible.', waitingLeft:'Left eye still reading',
    corner:'Corner', normal:'Preserved', affectedEye:'Left eye',
    finger:'Fingertips', readAt:n=>'Read at '+n+'% of flight', noGrip:'The original kick had no grip input. This view stops at contact.',
    bothRead:n=>'Both read the corner at '+n+'% of flight. Follow the glove near the ball.',
    maxDiff:n=>'The two glove paths diverge by up to '+n+(n==='1'?' ball width.':' ball widths.')
  },
  pt: {
    homeCompare:'O que a EM muda?', immune:'Células imunes e natalizumabe',
    tickets:['Vias visual e motora preservadas','Olho esquerdo lê mais tarde','Menos margem para ajustar a mão'],
    identity:['EM · via preservada','EM · lesão óptica esquerda','EM · lesão cerebelar'],
    rightIdentity:'EM · olho direito preservado',
    catches:['','Pelo olho esquerdo, Joana leu o canto mais tarde. Ainda deu tempo de mergulhar e segurar a bola.',
      'Joana leu o canto a tempo. Seu ajuste final colocou a palma atrás da bola.'],
    home:['Joana tem EM nos três treinos. Comece com as vias visual e motora funcionando bem.',
      'Pelo olho esquerdo, o vermelho parece desbotado e Joana demora mais a reconhecer o canto.',
      'Joana enxerga o canto como de costume. A correção tardia deixa menos margem para posicionar a mão.'],
    pairs:['Via preservada','Lesão no nervo óptico','Lesão cerebelar'],
    test:['Jogar com a via preservada','Jogar este chute com lesão óptica','Jogar este chute com lesão cerebelar'],
    pairTitle:'Mesmo chute, mesmos comandos', example:'Cobrança de exemplo', own:'Seus saltos gravados',
    matched:'Duas versões do mesmo pênalti', angles:'No campo', paths:'Trajetórias da bola e da luva',
    model:'As marcas de precisão e os percentuais do voo são medidas do jogo.',
    sample:'Os três comandos são idênticos. Troque a via e acompanhe a bola.',
    facts:['','O sinal do nervo óptico esquerdo chega mais tarde e sobra menos tempo para o mergulho. Mire entre as marcas menores no salto visual.',
      'A leitura do canto é a mesma. A correção cerebelar tardia exige mais precisão no salto motor.'],
    pulseWait:'Lendo…', readLabel:'Leitura do canto', reachLabel:'Alcance da mão',
    held:'A luva alcança', short:'Fora de alcance', unknown:'Contato · pegada não jogada',
    opticBracket:'Salto visual · margem 40% menor', motorBracket:'Salto motor · margem 45% menor',
    guideBracket:'O tracejado mostra a margem original. Pouse entre as marcas contínuas.',
    firstDirection:'Pela via preservada, o canto já aparece.', waitingLeft:'Olho esquerdo ainda lendo',
    corner:'Canto', normal:'Preservada', affectedEye:'Olho esquerdo',
    finger:'Pontas dos dedos', readAt:n=>'Leu aos '+n+'% do voo', noGrip:'Na cobrança gravada a bola não tocou a luva. Esta comparação termina no contato.',
    bothRead:n=>'Nas duas vias, Joana leu o canto aos '+n+'% do voo. Acompanhe a luva perto da bola.',
    maxDiff:n=>'A distância entre os trajetos da luva chegou a '+n+(n==='1'?' diâmetro da bola.':' diâmetros da bola.')
  }
};

export function pairOf(shot, marks, lesionDay) {
  return [matchedTrial(shot,marks,0,'right'), matchedTrial(shot,marks,lesionDay)];
}

export function outcomeName(trial, words, copy) {
  return trial.result ? words.outcomes[trial.result.outcome] : copy.unknown;
}

export function pairTable(pair, words, copy) {
  return '<div class="pair-table">'+pair.map(trial=>{
    const percent=Math.round(100*trial.read/CONTACT);
    return `<div class="pair-cell ${trial.day?'lesion':'preserved'}"><small>${copy.pairs[trial.day]}</small><b>${outcomeName(trial,words,copy)}</b><span>${copy.readAt(percent)}</span></div>`;
  }).join('')+'</div>';
}

export function maxHandDifference(shot,pair){
  const [ref,lesion]=pair;
  let max=0;
  for(let i=0;i<=50;i++){
    const t=lerp(ref.dive,CONTACT,i/50);
    const a=handAt(shot,ref.marks,ref.day,ref.eye,t),b=handAt(shot,lesion.marks,lesion.day,lesion.eye,t);
    max=Math.max(max,Math.hypot(a.x-b.x,a.y-b.y));
  }
  return Math.round(max/(2*BALL_RADIUS)*10)/10;
}

export function drawMatchedPitch(c,w,h,shot,trial,t) {
  if(!trial.result)t=Math.min(t,CONTACT);
  const f=fieldState(shot,trial.marks,trial.day,trial.eye,t,{time:0,run:1,kick:1,outcome:trial.result?.outcome??null});
  // Both broadcast cameras have the same lens, aim, lighting and clock.
  const near=smooth((t-.32)/.47);
  const focus=fieldProject(w,h,lerp(0,shot.x*.90,near),lerp(1.25,shot.y,near),lerp(-.6,-3.06,near));
  const zoom=lerp(1.46,3.7,near);
  c.save();c.fillStyle='#17363c';c.fillRect(0,0,w,h);
  c.translate(w*.5,h*.49);c.scale(zoom,zoom);c.translate(-focus.x,-focus.y);
  drawField(c,w,h,f);
  // A short trail stays attached to the actual shot when it rebounds or enters the net.
  if(t>.20){
    let previous=null;
    for(let i=0;i<8;i++){
      const time=t-.11+i*.013;
      const ball=ballAt(shot,trial.marks,trial.day,trial.eye,time,trial.result?.outcome);
      const pt=fieldProject(w,h,ball.x,ball.y,ball.z);
      if(previous){
        c.beginPath();c.moveTo(previous.x,previous.y);c.lineTo(pt.x,pt.y);
        c.strokeStyle='rgba(255,229,161,'+(.16+i*.075)+')';c.lineWidth=(1.1+i*.17)/zoom;c.stroke();
      }
      previous=pt;
    }
  }
  const point=fieldProject(w,h,f.ball.x,f.ball.y,f.ball.z);
  c.strokeStyle='#ffe198';c.lineWidth=1/zoom;c.setLineDash([2/zoom,2/zoom]);
  c.beginPath();c.arc(point.x,point.y,Math.max(3,w*.019),0,Math.PI*2);c.stroke();c.restore();
}

export function traceClock(t, trial, shot, copy, words) {
  if(t<trial.read)return copy.pulseWait;
  if(t<trial.dive)return shot.side<0?words.shotLeft:words.shotRight;
  if(t<CONTACT)return words.dive;
  return outcomeName(trial,words,copy);
}
