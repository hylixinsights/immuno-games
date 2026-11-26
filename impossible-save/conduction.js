// Five playable nodes on three pathways. Seconds, distances, and deadlines are arcade units.
import { clamp, lerp, smooth, judge, finish, readAt, diveAt, reachesBall, reachError } from './rules.js?v=7';

export const FLIGHT = 0.32;
export const JOIN = 0.22;
export const TAKEOFF = 0.16;
export const PASS = 0.34;
export const nodeCount = (stage) => (stage === 2 ? 1 : 2);
export const affected = (day, eye, stage) =>
  (day === 1 && eye === 'left' && stage === 0) || (day === 2 && stage === 1);

export function route(shot, stage) {
  const pick = (i) => clamp((shot.targets[i] - 0.46) / 0.39);
  const first = 0.31 + 0.205 * pick(stage);
  const second = 0.335 + 0.164 * pick((stage + 1) % 3);
  const bridge = 0.247 + 0.025 * pick((stage + 2) % 3);
  const nodes = [TAKEOFF, TAKEOFF + first, TAKEOFF + first + bridge, TAKEOFF + first + bridge + second];
  const sweep = shot.sweeps[stage] * 0.87;
  const ring = (stage === 0 ? 0.038 : stage === 1 ? 0.035 : 0.034) * (1 - 0.17 * shot.pressure) * tuning.ring;
  const ideal = (span) => (sweep * (span - 0.112)) / 0.602;
  const wind = [ideal(first), ideal(second)];
  // The ball uses the same schedule whatever happens to the signal.
  const slack = (stage === 0 ? 1.9 : 1.78) - 0.15 * shot.pressure;
  const deadline =
    stage === 2 ? wind[0] + 1.18 - 0.18 * shot.pressure : wind[0] + wind[1] + FLIGHT + PASS + slack;
  return {
    stage,
    nodes,
    sweep,
    ring,
    wind,
    deadline,
    firstLimit: stage === 2 ? deadline : deadline - wind[1] - FLIGHT - PASS - 0.28,
  };
}

export function geometry(track, hop, wait = 0, held = null) {
  const from = track.nodes[hop * 2],
    targetX = track.nodes[hop * 2 + 1];
  const launchX = from + 0.031 * clamp(wait / 0.9);
  const power = held === null ? 0.38 : clamp(held / track.sweep);
  const span = 0.112 + 0.602 * power;
  return {
    launchX,
    targetX,
    landingX: launchX + span,
    launchY: 0.66,
    targetY: 0.66,
    arcHeight: 0.14 + 0.13 * span,
    targetRadius: track.ring,
    referenceRadius: track.ring,
    power,
  };
}
export function centeredHold(track, hop, wait = 0) {
  const g = geometry(track, hop, wait, 0);
  return ((g.targetX - g.landingX) / 0.602) * track.sweep;
}
// Extra transit across a damaged segment, in seconds, for the visual and motor stages.
// The season changes these values as lesions appear and partly remyelinate. Training days use the defaults.
// The game narrows the landing rings. The default of 1 keeps the reference model used by the verification script.
export const tuning = { ring: 1 };
export const LESION_DEFAULT = [0.94, 0.86];
export const lesionDelay = [...LESION_DEFAULT];
export function setLesionDelay(visual = LESION_DEFAULT[0], motor = LESION_DEFAULT[1]) {
  lesionDelay[0] = visual;
  lesionDelay[1] = motor;
}
export function transit(day, eye, stage, firstMark, delay = lesionDelay[stage]) {
  const settle = 0.13 * (1 - (firstMark?.quality ?? 1));
  return PASS + settle + (affected(day, eye, stage) ? delay : 0);
}
export function pulseAt(elapsed, duration, preservedDuration) {
  if (duration - preservedDuration < 0.01) return clamp(elapsed / duration);
  // Equal speed on either end; the only lost time is at the exposed middle.
  const flank = preservedDuration * 0.37;
  if (elapsed < flank) return 0.37 * clamp(elapsed / flank);
  if (elapsed < duration - flank) return 0.37 + 0.26 * clamp((elapsed - flank) / (duration - 2 * flank));
  return 0.63 + 0.37 * clamp((elapsed - duration + flank) / flank);
}
export function nodeMark(track, hop, ready, command) {
  const limit = hop === 0 ? track.firstLimit : track.deadline;
  const wait = Math.max(0, command.wait),
    held = Math.max(0, command.held);
  const up = ready + wait + held;
  const timeout = !!command.idle || up > limit + 0.00001;
  const g = geometry(track, hop, Math.min(wait, Math.max(0, limit - ready)), timeout ? 0 : held);
  return {
    ...judge(g, timeout),
    ready,
    up: timeout ? Math.max(ready, limit) : up,
    wait,
    held,
    idle: !!command.idle,
  };
}
// Rebuild the same gestures from their wait and hold at each playable node.
// A replay with a different pathway never invents a missing touch at the glove.
export function section(shot, day, eye, stage, commands, delay = lesionDelay[stage]) {
  const track = route(shot, stage),
    nodes = [];
  for (const [hop, cmd] of commands.slice(0, nodeCount(stage)).entries()) {
    const ready = hop ? nodes[0].up + FLIGHT + transit(day, eye, stage, nodes[0], delay) : 0;
    nodes.push(nodeMark(track, hop, ready, cmd));
  }
  if (!nodes.length) return null;
  const last = nodes[nodes.length - 1],
    first = nodes[0];
  const complete = nodes.length === nodeCount(stage);
  const quality = nodes.length === 1 ? first.quality : 0.44 * first.quality + 0.56 * last.quality;
  const time = last.up + FLIGHT,
    signal = complete ? clamp(time / (track.deadline + FLIGHT)) : 0;
  const band = nodes.every((n) => n.perfect) ? 'perfect' : quality > 0.51 ? 'edge' : 'miss';
  return {
    ...last,
    quality,
    referenceQuality: first.quality,
    perfect: nodes.every((n) => n.perfect),
    band,
    timeout: nodes.every((n) => n.timeout),
    nodes,
    commands: commands.slice(),
    complete,
    clock: { time, signal, firstRelease: first.up, late: complete ? clamp((signal - 0.735) / 0.265) : 0 },
  };
}
export function pairedRun(shot, commands, day, eye = day === 1 ? 'left' : 'right') {
  const marks = [];
  for (let stage = 0; stage < 3; stage++) {
    if (!commands[stage]?.length || (stage === 2 && !reachesBall(shot, marks, day, eye))) break;
    // A matched trial compares the fixed training pathways, including when opened during a season.
    marks.push(section(shot, day, eye, stage, commands[stage], LESION_DEFAULT[stage]));
  }
  const touches = reachesBall(shot, marks, day, eye);
  const result =
    marks[1]?.complete && (!touches || marks[2]?.complete) ? finish(shot, marks, day, eye) : null;
  return {
    day,
    eye,
    marks,
    touches,
    result,
    read: readAt(shot, marks, day, eye),
    dive: diveAt(shot, marks, day, eye),
    gap: reachError(shot, marks, day, eye),
  };
}
export function exampleCommands(shot) {
  return [0, 1, 2].map((s) => {
    const plan = route(shot, s);
    return Array.from({ length: nodeCount(s) }, (_, h) => {
      const wait = h ? 0.495 : 0.475;
      return { wait, held: centeredHold(plan, h, wait) + (h ? 0.032 : -0.014) };
    });
  });
}
export function landingPoint(g, fraction) {
  const t = clamp(fraction);
  return {
    x: lerp(g.launchX, g.landingX, t),
    y: lerp(g.launchY, g.targetY, t) - 4 * g.arcHeight * t * (1 - t),
  };
}
