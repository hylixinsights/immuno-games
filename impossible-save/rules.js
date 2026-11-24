// World coordinates and the replay timeline are shared by both renderers and the analysis board.
export const clamp=(v,lo=0,hi=1)=>Math.min(hi,Math.max(lo,v));
export const lerp=(a,b,t)=>a+(b-a)*t;
export const smooth=t=>{t=clamp(t);return t*t*(3-2*t)};
export const CONTACT=.84;
export const SERIES=5;
export function randomStream(seed){let n=seed>>>0;return ()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296}}
export const BALL_RADIUS = .25;

export function makeShot(seed, slot = 0) {
  const next = randomStream(seed);
  const side = next() < .5 ? -1 : 1;
  const x = side * (3.03 + next() * .88), y = 1.48 + next() * 1.28;
  const curve = (next() - .5) * 1.65, loft = .27 + next() * .63;
  const pressure = clamp(slot / (SERIES - 1));
  const pace = .88 + next() * .23 + .08 * pressure;
  // Each kick asks for a short, middle and long jump, in a seeded order.
  const targets = [.478 + next() * .093, .608 + next() * .088, .741 + next() * .098];
  for (let i = targets.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [targets[i], targets[j]] = [targets[j], targets[i]];
  }
  const sweeps = [1.22, 1.09, 1.14].map(base => base * (.91 + next() * .20) / pace);
  return {seed:seed >>> 0, side, x, y, curve, loft, pace, pressure, targets, sweeps};
}

export function jumpGeometry(shot, day, stage, age, held = null) {
  const launchX = .163 + .075 * clamp(age / 2.3);
  // A single outward sweep. The release, the ghost and the replay use the same coordinates.
  const power = held === null ? .39 : clamp(held / shot.sweeps[stage]);
  const span = .131 + .601 * power;
  const targetRadius = [.031, .028, .027][stage] * (1 - .19 * shot.pressure);
  return {launchX, targetX:shot.targets[stage], landingX:launchX + span, launchY:.69, targetY:.66,
    arcHeight:.14 + span * .13, targetRadius, power};
}

export function judge(g, timeout = false) {
  const delta = g.landingX - g.targetX;
  const widths = Math.abs(delta) / g.targetRadius;
  const perfect = !timeout && widths <= 1;
  const quality = timeout ? 0 : clamp(1 - Math.max(0, widths - .54) / 3.12);
  const band = timeout ? 'timeout' : perfect ? 'perfect' : widths <= 2.10 ? 'edge' : 'miss';
  return {quality, delta, perfect, band, timeout, geometry:{...g}};
}

export function signalDelay(day, eye, stage) {
  if (stage === 0 && day === 1 && eye === 'left') return .118;
  if (stage === 1 && day === 2) return .091;
  return 0;
}

export function readAt(shot, marks, day, eye) {
  // An intact visual pathway can still be played late on the coordination day.
  // Identical landings always produce the same read on that day and the reference day.
  const quality = marks[0]?.quality ?? .56;
  return .144 + .026 * (shot.pace - .88) + (1 - quality) * .188 + signalDelay(day, eye, 0);
}

export function diveAt(shot, marks, day, eye) {
  const quality = marks[1]?.quality ?? .56;
  return readAt(shot, marks, day, eye) + .115 + (1 - quality) * .148;
}

export function reachError(shot, marks, day, eye) {
  const readError = 1 - (marks[0]?.quality ?? .56);
  const motorError = 1 - (marks[1]?.quality ?? .56);
  const stretch = (Math.abs(shot.x) - 3.03) / .88;
  const base = .032 + stretch * .012 + shot.pressure * .008;
  const visual = readError * (.172 + .027 * stretch) + signalDelay(day, eye, 0) * .24;
  const motor = motorError * (.276 + .040 * shot.pressure) + signalDelay(day, eye, 1) * (.23 + 1.26 * motorError);
  return base + visual + motor + .27 * readError * motorError;
}

export function reachesBall(shot, marks, day, eye) {
  return reachError(shot, marks, day, eye) <= BALL_RADIUS;
}

export function finish(shot, marks, day, eye) {
  const miss = reachError(shot, marks, day, eye);
  const grip = marks[2]?.quality ?? 0;
  let outcome = 'beaten';
  if (reachesBall(shot, marks, day, eye)) {
    const contact = miss / BALL_RADIUS;
    // Missing the tactile node loses the ball even after a palm contact.
    // At the outer edge, only a precise last jump can turn the shot past the post.
    if (marks.length === 3 && marks.every(mark => mark.perfect) && contact <= .72) outcome = 'catch';
    else if (contact <= .66 && grip >= .57 && marks.slice(0, 2).every(mark => mark.band !== 'miss' && !mark.timeout)) outcome = 'parry';
    else if (grip >= .38 + .44 * contact) outcome = 'tip';
    else outcome = contact < .62 ? 'spill' : 'inside';
  }
  let combo = 0, best = 0, potential = 0;
  for (const mark of marks) {
    combo = mark.perfect ? combo + 1 : 0;
    best = Math.max(best, combo);
    potential += 45 * combo;
  }
  const base = {catch:500, parry:330, tip:180, spill:0, inside:0, beaten:0}[outcome];
  const bonus = base ? potential : 0;
  return {outcome, saved:base > 0, base, bonus, score:base + bonus, combo:best, miss};
}
export function incoming(shot,t){
  const p=clamp(t/CONTACT),curve=Math.sin(Math.PI*p);
  return {x:shot.x*Math.pow(p,1.13)+shot.curve*curve,y:lerp(.265,shot.y,p)+shot.loft*curve,z:lerp(3.8,-3.06,p)};
}
export function handAt(shot,marks,day,eye,t){
  const side=shot.side, start=diveAt(shot,marks,day,eye), m=reachError(shot,marks,day,eye);
  const u = marks[1] ? clamp((t-start)/(CONTACT-start)) : 0, p = smooth(u);
  const quality = marks[1]?.quality ?? .56;
  const affected = signalDelay(day, eye, 1) > 0;
  // On this day the intended side is unchanged. The late hand correction can
  // finish above or below the target according to the signed motor landing.
  const angle = affected ? (marks[1]?.delta > 0 ? -.86 : .86) : .20;
  const pull = affected ? .48 + (1-quality)*.68 : .085;
  const correction = pull * Math.sin(Math.PI * clamp((u-(affected ? .35 : .47))/(affected ? .65 : .53)));
  return {
    x:side*lerp(.53, Math.abs(shot.x)-m*Math.cos(angle), p)-side*correction,
    y:lerp(1.47, shot.y-m*Math.sin(angle), p)+.12*Math.sin(Math.PI*u)-correction*Math.sin(angle)*.68,
    z:lerp(-3.10,-3.06,p)
  };
}
export function ballAt(shot,marks,day,eye,t,outcome){
  if(t<=CONTACT||!outcome)return incoming(shot,t);
  const u=clamp((t-CONTACT)/(1-CONTACT)), side=shot.side, b=incoming(shot,CONTACT);
  if(outcome==='catch')return {x:b.x-side*.30*smooth(u),y:b.y-.38*smooth(u),z:b.z+.06*u};
  if(outcome==='parry')return {x:b.x+side*(1.85*u),y:b.y+.95*Math.sin(Math.PI*u)-.78*u,z:b.z+2.45*u};
  if(outcome==='tip')return {x:b.x+side*((4.68-Math.abs(b.x))*clamp(u*2.6)+.94*u),y:b.y+.8*Math.sin(Math.PI*u)+.24*u,z:b.z-.71*u};
  if(outcome==='spill')return {x:b.x-side*.43*u,y:lerp(b.y,.25,u*u),z:b.z-1.13*u};
  return {x:b.x+side*(outcome==='inside'?.22:.36)*u,y:b.y-.48*u*u,z:b.z-1.39*u};
}
export function fieldState(shot,marks,day,eye,t,extra={}){
  const outcome=extra.outcome||null, side=shot.side;
  const start=diveAt(shot,marks,day,eye);
  const dive=marks[1]?smooth((Math.min(t,CONTACT)-start)/(CONTACT-start)):0;
  const post=clamp((t-CONTACT)/(1-CONTACT));
  const ball=ballAt(shot,marks,day,eye,t,outcome);
  const hand=handAt(shot,marks,day,eye,t);
  if(t>CONTACT&&outcome==='catch'){const tuck=smooth(post*4);hand.x+=ball.x-shot.x+(shot.x-side*.10-hand.x)*tuck;hand.y+=ball.y-shot.y+(shot.y-.03-hand.y)*tuck;hand.z=ball.z;}
  else if(t>CONTACT){hand.x+=side*.12*Math.sin(post*Math.PI);hand.y-=.38*smooth(post);}
  const tilt=side*(1.02+(.18*(2.5-shot.y)))*dive;
  return {time:0,day,eye,run:0,kick:0,clap:0,progress:t,dive,side,tilt,flex:outcome==='beaten'?0:Math.sin(Math.PI*clamp((t-CONTACT+.012)/.143)),cheer:outcome&&['parry','tip','catch'].includes(outcome)?smooth(post*3):0,outcome,ball,hand,pose:{x:hand.x-side*lerp(.53,1.78,dive),y:(shot.y-1.45)*dive*.66-.17*post,z:-3.10,tilt},...extra};
}
export function seriesScore(slots){return slots.reduce((a,b)=>a+(b||0),0)}
