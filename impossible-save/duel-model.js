// The striker and ball use one clock in both halves of a pair. Time is in seconds.
import { clamp, lerp, smooth, CONTACT, makeShot, incoming, ballAt } from './rules.js?v=3';

export const LINE = -3.06;
export const PALM = 0.23;
export const FINGERS = 0.55;
export const GRIP_BEAT = 0.5;
export const ROUNDS = 5;
export const lesionForRound = (round) => (round % 2 ? 'motor' : 'optic');

export function shootoutScore(series) {
  let total = 0,
    streak = 0;
  for (const kick of series) {
    streak = kick?.saved ? streak + 1 : 0;
    total += (kick?.score || 0) + 45 * Math.max(0, streak - 1);
  }
  return total;
}

export function penalty(seed, round = 0) {
  const p = makeShot(seed, round),
    variety = p.targets[0],
    speed = (p.pace - 0.88) / 0.32;
  p.y = clamp((p.y - 1.48) / 1.28, 0, 1) * 1.74 + 1.04;
  p.air = 2.4 - 0.33 * speed - 0.24 * p.pressure;
  p.travel = 0.38 + 0.055 * Math.abs(p.curve) + 0.018 * p.pressure;
  p.idealPower = 0.5 + (0.27 * (p.y - 1.04)) / 1.74 + 0.085 * (variety - 0.62);
  p.sweep = 0.96 - 0.09 * p.pressure + 0.04 * Math.abs(p.curve);
  p.swerve = lerp(0.12, 0.29, Math.abs(p.curve));
  return p;
}

export function readTime(p, circuit) {
  if (circuit === 'optic') {
    // The left-eye cue arrives with just enough time for a clean dive.
    return p.air - p.travel - p.idealPower * p.sweep - (0.17 - 0.065 * p.pressure);
  }
  return p.air * (0.115 + 0.04 * Math.abs(p.curve));
}

export function reachRatio(p, circuit, held) {
  const raw = clamp(held / p.sweep, 0, circuit === 'motor' ? 1.38 : 1.03) / p.idealPower;
  if (circuit !== 'motor') return raw;
  // A quick overshoot followed by a slower corrective movement through the target.
  // Waiting past the return also misses. Both opportunities are visible before release.
  if (raw <= 1) return raw + 0.38 * smooth((raw - 0.34) / 0.58);
  if (raw <= 1.53) return lerp(1.38, 0.77, smooth((raw - 1) / 0.53));
  return Math.max(0.62, 0.77 - 0.24 * (raw - 1.53));
}

function pathPoint(p, circuit, ratio, side) {
  const bump = Math.sin(Math.PI * clamp(ratio));
  const x = side * (0.52 + (Math.abs(p.x) - 0.52) * ratio);
  const bend = circuit === 'motor' ? 0.4 * Math.sin(Math.PI * clamp(ratio)) * (p.curve < 0 ? -1 : 1) : 0;
  return { x, y: 1.4 + (p.y - 1.4) * ratio + 0.24 * bump + bend, z: LINE };
}

export function aimPoint(p, circuit, held, side) {
  return pathPoint(p, circuit, reachRatio(p, circuit, held), side);
}

// Before a direction is read, only a fraction of a neutral wind-up is usable.
// An explicitly chosen corner can be loaded early, at the risk of picking the wrong side.
export function directedHold(p, circuit, down, up, declaredSide = 0, chosenAt = down) {
  const directedAt = Math.min(readTime(p, circuit), declaredSide ? chosenAt : Infinity);
  const waiting = Math.max(0, Math.min(up, directedAt) - down);
  return Math.max(0, up - down) - 0.77 * waiting;
}

export function jump(p, circuit, down, up, declaredSide = 0, chosenAt = down) {
  if (up < 0 || up >= p.air) return null;
  const seen = up >= readTime(p, circuit);
  const side = declaredSide === -1 || declaredSide === 1 ? declaredSide : seen ? p.side : 0;
  const held = directedHold(p, circuit, down, up, declaredSide, chosenAt),
    ratio = reachRatio(p, circuit, held);
  return {
    down,
    up,
    held,
    ratio,
    side,
    declaredSide,
    chosenAt,
    seen,
    end: pathPoint(p, circuit, ratio, side),
  };
}

export function gloveAt(p, circuit, move, time) {
  const side = move?.side || 0,
    rest = { x: side * 0.52, y: 1.4, z: LINE };
  if (!move || !side || time <= move.up) return rest;
  const travel = smooth((Math.min(time, p.air) - move.up) / p.travel);
  const ratio = move.ratio * travel;
  return pathPoint(p, circuit, ratio, side);
}

export function contact(p, circuit, move) {
  const hand = gloveAt(p, circuit, move, p.air);
  const gap = Math.hypot(hand.x - p.x, hand.y - p.y);
  const touches = !!move && move.side === p.side && gap <= FINGERS;
  return { hand, gap, touches };
}

export function verdict(p, circuit, move, grip = null) {
  const { gap, touches } = contact(p, circuit, move);
  const beat = grip === null ? Infinity : Math.abs(grip - 0.28);
  const firm = beat <= 0.15,
    solid = beat <= 0.21;
  let outcome = 'beaten';
  if (touches) {
    if (gap <= PALM && firm) outcome = 'catch';
    else if (gap <= 0.28 || (gap <= 0.38 && solid)) outcome = 'parry';
    else if (gap <= 0.39 || solid) outcome = 'tip';
    else outcome = gap < 0.46 ? 'spill' : 'inside';
  }
  const base = { catch: 500, parry: 300, tip: 180, beaten: 0, inside: 0, spill: 0 }[outcome];
  const precise = !!base && Math.abs((move?.ratio ?? 0) - 1) < 0.066;
  const score = base + (precise ? 50 : 0) + (outcome === 'catch' && beat < 0.07 ? 50 : 0);
  let reason = outcome;
  if (outcome === 'beaten') {
    if (!move) reason = 'idle';
    else if (!move.side) reason = 'unread';
    else if (move.side !== p.side) reason = 'wrong';
    else if (
      circuit === 'optic' &&
      contact(p, 'clear', jump(p, 'clear', move.down, move.up, move.declaredSide, move.chosenAt)).touches
    )
      reason = 'optic';
    else if (move.up > p.air - p.travel && gap > FINGERS) reason = 'late';
    else if (move.ratio > 1) reason = circuit === 'motor' ? 'overshoot' : 'long';
    else reason = 'short';
  }
  return { outcome, saved: !!base, score, reason, gap, touches, precise };
}

export function pitchFrame(p, circuit, move, time, post = 0, result = null) {
  const side = move?.side || p.side,
    before = time < 0;
  const progress = before
    ? 0
    : post > 0
      ? CONTACT + (1 - CONTACT) * clamp(post)
      : CONTACT * clamp(time / p.air);
  const f = {
    time: Math.max(0, time + 1),
    progress,
    side,
    day: circuit === 'optic' ? 1 : circuit === 'motor' ? 2 : 0,
    eye: circuit === 'optic' ? 'left' : 'right',
    run: clamp((time + 0.93) / 0.75),
    kick: smooth((time + 0.19) / 0.19),
    clap: 0,
    flex: 0,
    cheer: 0,
    outcome: result?.outcome ?? null,
    pose: { x: 0, y: 0, z: -3.1, tilt: 0 },
    dive: 0,
  };
  f.ball = post > 0 ? ballAt(p, [], 0, 'right', progress, f.outcome) : incoming(p, progress);
  let hand = gloveAt(p, circuit, move, time);
  if (move?.side && time >= move.up) {
    const dive = smooth((Math.min(time, p.air) - move.up) / p.travel);
    f.dive = dive;
    f.pose.tilt = side * 1.01 * dive;
    f.pose.x = hand.x - side * lerp(0.52, 1.52, dive);
    f.pose.y = clamp((hand.y - 1.3) * 0.55, -0.24, 0.87) * dive;
    if (post && f.outcome === 'catch') {
      hand = { x: f.ball.x - side * 0.05, y: f.ball.y - 0.045, z: f.ball.z };
      f.pose.x += f.ball.x - p.x;
      f.pose.y += (f.ball.y - p.y) * 0.5;
    } else if (post) {
      hand = { ...hand, y: hand.y - 0.27 * smooth(post) };
      f.pose.y -= 0.22 * smooth(post);
    }
    f.hand = hand;
  }
  f.flex = result?.touches ? Math.sin(Math.PI * clamp(post / 0.55)) : 0;
  f.cheer = result?.saved ? smooth(post * 2.65) : 0;
  return f;
}
