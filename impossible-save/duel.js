import { copy } from './duel-copy.js?v=4';
import {
  penalty,
  readTime,
  jump,
  contact,
  verdict,
  pitchFrame,
  aimPoint,
  directedHold,
  lesionForRound,
  shootoutScore,
  GRIP_BEAT,
  ROUNDS,
  LINE,
} from './duel-model.js?v=4';
import { fitCanvas, printedPitch, playInk, fibre, signalProgress, replayPaths } from './duel-art.js?v=4';
import { clamp, CONTACT, incoming } from './rules.js?v=3';
import { MatchSound } from './sound.js';
import { drawImmune, immuneCopy, immuneSources, immuneStops, immuneStage } from './immune.js?v=3';
import { words, sources } from './words.js?v=3';

const $ = (id) => document.getElementById(id),
  pitch = $('pitch'),
  dialog = $('sheet'),
  sheetBody = $('sheet-body');
const icon = (id) => '<svg aria-hidden="true"><use href="#i-' + id + '"/></svg>';
const button = (a, text, cls = '', symbol = '') =>
  '<button data-act="' + a + '" class="' + cls + '">' + (symbol ? icon(symbol) : '') + text + '</button>';
const show = (element, visible) => {
  element.hidden = !visible;
};
function load(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem('impossible-save.' + key)) ?? fallback;
  } catch {
    return fallback;
  }
}
function save(key, value) {
  try {
    localStorage.setItem('impossible-save.' + key, JSON.stringify(value));
  } catch {}
}
const first = 0x5e21b3,
  reduced = matchMedia('(prefers-reduced-motion: reduce)');
const state = {
  lang: load('language', 'en') === 'pt' ? 'pt' : 'en',
  phase: 'home',
  round: 0,
  leg: 0,
  lesion: 'optic',
  shot: penalty(first),
  time: 0,
  age: 0,
  homeTime: 0,
  holding: false,
  down: 0,
  declared: 0,
  chosenAt: 0,
  pointer: null,
  origin: 0,
  move: null,
  grip: null,
  result: null,
  seen: false,
  legs: [null, null],
  series: [],
  practice: false,
  best: Number(load('duel.best', 0)) || 0,
  newRecord: false,
  pane: null,
  world: null,
};
const inspect = {
  clock: 0,
  playing: false,
  matched: false,
  fibre: 0,
  treated: false,
  wall: 0.29,
  eye: 'left',
};
const t = () => copy[state.lang],
  circuit = () => (state.leg ? state.lesion : 'clear');
const audio = new MatchSound(load('sound', true) !== false);
let last = performance.now(),
  lastDraw = 0,
  readyWorld = null,
  loading = false,
  width = 1,
  height = 1,
  oldCue = '';
new ResizeObserver((entries) => {
  const r = entries[0].contentRect;
  width = Math.max(1, Math.round(r.width));
  height = Math.max(1, Math.round(r.height));
  lastDraw = 0;
  if (state.pane) requestAnimationFrame(drawSheet);
}).observe(pitch);

function prepareWorld() {
  if (loading) return;
  loading = true;
  try {
    const probe = document.createElement('canvas').getContext('webgl2');
    if (!probe) return;
    probe.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    return;
  }
  import('./scene.js?v=4')
    .then(({ makeWorld }) => {
      const world = makeWorld($('three'));
      world.canvas.addEventListener('webglcontextlost', (e) => {
        e.preventDefault();
        readyWorld = null;
        state.world = null;
        show($('three'), false);
      });
      // Warm the first frame before a live shot. A pair always keeps the same camera.
      if (state.phase === 'home' && width > 1) {
        const f = pitchFrame(state.shot, 'clear', null, -0.93);
        f.camera = 'duel';
        world.render(width, height, f, state.shot);
      }
      readyWorld = world;
    })
    .catch(() => {
      readyWorld = null;
    });
}

function setPhase(phase) {
  state.phase = phase;
  state.age = 0;
  document.body.dataset.phase = phase;
  pitch.dataset.phase = phase;
  oldCue = '';
  panels();
}
function announce(s) {
  if ($('live').textContent !== s) $('live').textContent = s;
}
function cancelHold() {
  state.holding = false;
  state.pointer = null;
  pitch.dataset.hold = 'off';
}
function nowStamp() {
  last = performance.now();
}
function nextSeed() {
  let n = window.crypto?.getRandomValues
    ? crypto.getRandomValues(new Uint32Array(1))[0]
    : Math.floor(Math.random() * 4294967296);
  for (let i = 0; i < 14; i++) {
    const next = penalty(n);
    if (n !== state.shot.seed && (next.side !== state.shot.side || Math.abs(next.y - state.shot.y) > 0.55))
      break;
    n = (n + 0x9e3779b9) >>> 0;
  }
  return n;
}
function startPair(seed, round) {
  state.round = round;
  state.shot = penalty(seed, round);
  state.lesion = lesionForRound(round);
  state.legs = [null, null];
  state.world = readyWorld;
  startLeg(0);
}
function startLeg(leg) {
  if (dialog.open) close(false);
  state.leg = leg;
  state.legs[leg] = null;
  if (!leg) state.legs[1] = null;
  state.practice = !!state.series[state.round];
  state.move = null;
  state.grip = null;
  state.result = null;
  state.seen = false;
  state.declared = 0;
  state.chosenAt = 0;
  state.down = 0;
  state.newRecord = false;
  cancelHold();
  state.time = leg ? -1.05 : -0.92;
  nowStamp();
  audio.unlock();
  setPhase('run');
  pitch.focus({ preventScroll: true });
  announce(leg ? t().sameBall + '. ' + t().short[state.lesion] : t().control);
}
function begin() {
  state.series = [];
  startPair(first, 0);
}
function newKick() {
  const seed = nextSeed();
  if (state.round === ROUNDS - 1) {
    state.series = [];
    startPair(seed, 0);
  } else startPair(seed, state.round + 1);
}
function chooseSide(side) {
  if (state.declared !== side) {
    state.declared = side;
    state.chosenAt = Math.max(0, state.time);
  }
}
function press(id, x) {
  if (state.pane) return;
  if (state.phase === 'home') {
    begin();
    return;
  }
  if (state.phase === 'grip') {
    state.grip = state.age;
    endShot();
    return;
  }
  if (!['run', 'flight'].includes(state.phase) || state.move || state.holding) return;
  if (state.phase === 'run' && state.time < -0.36) return;
  state.holding = true;
  pitch.dataset.hold = 'on';
  state.down = Math.max(0, state.time);
  state.pointer = id;
  state.origin = x;
}
function release(id) {
  if (!state.holding || state.pointer !== id || state.pane) return;
  if (state.phase === 'flight' && state.time < state.shot.air) {
    state.move = jump(state.shot, circuit(), state.down, state.time, state.declared, state.chosenAt);
    audio.jump();
  }
  cancelHold();
}
function endShot() {
  state.result = verdict(state.shot, circuit(), state.move, state.grip);
  state.legs[state.leg] = { circuit: circuit(), move: state.move, grip: state.grip, result: state.result };
  if (state.leg && !state.practice) {
    state.series[state.round] = { score: state.result.score, saved: state.result.saved };
    const score = shootoutScore(state.series);
    if (score > state.best) {
      state.best = score;
      state.newRecord = true;
      save('duel.best', score);
    }
  }
  cancelHold();
  audio.result(state.result.saved);
  setPhase('end');
  announce(t().outcome[state.result.outcome]);
}
function advance(dt) {
  state.age += dt;
  if (state.phase === 'home') {
    state.homeTime += dt;
    return;
  }
  if (state.phase === 'run' || state.phase === 'flight') {
    state.time += dt;
    if (state.phase === 'run' && state.time >= 0) {
      audio.kick();
      setPhase('flight');
    }
    if (state.phase === 'flight' && !state.seen && state.time >= readTime(state.shot, circuit())) {
      state.seen = true;
      announce(state.shot.side < 0 ? t().left : t().right);
      audio.sound(560, 820, 0.105, 0.12, 'triangle');
    }
    if (state.phase === 'flight' && state.time >= state.shot.air) {
      state.time = state.shot.air;
      cancelHold();
      if (contact(state.shot, circuit(), state.move).touches) {
        setPhase('grip');
        audio.touch();
        announce(t().grip);
      } else endShot();
    }
  } else if (state.phase === 'grip' && state.age >= GRIP_BEAT) {
    endShot();
  } else if (state.phase === 'end' && state.age >= 1.05) {
    setPhase(state.leg ? 'result' : 'half');
  } else if (state.phase === 'half' && state.age >= 2.6) {
    startLeg(1);
  }
}
function sync(stamp = performance.now()) {
  stamp = Math.max(stamp, last);
  // A slow display still gets a frame in the release and grip windows.
  let maxStep = 0.18;
  if (!state.pane && state.phase === 'flight' && state.holding) maxStep = 0.055;
  else if (!state.pane && state.phase === 'grip') maxStep = 0.1;
  const dt = Math.min(maxStep, (stamp - last) / 1000);
  last = stamp;
  if (document.hidden) return;
  if (state.pane) {
    if (state.pane === 'replay' && inspect.playing) {
      inspect.clock = clamp(inspect.clock + dt / (state.shot.air + 1.1));
      if (inspect.clock === 1) {
        inspect.playing = false;
        updateReplayControl();
      }
    } else if (state.pane === 'flip') {
      inspect.fibre = (inspect.fibre + dt / 3.1) % 1;
    } else if (state.pane === 'immune' && inspect.playing) {
      inspect.wall = clamp(inspect.wall + dt / 8);
      if (inspect.wall === 1) inspect.playing = false;
    }
    return;
  }
  advance(dt);
}

function label(id, text) {
  const b = $(id);
  b.setAttribute('aria-label', text);
  b.title = text;
}
function localization() {
  const v = t();
  document.documentElement.lang = state.lang === 'en' ? 'en' : 'pt-BR';
  document.title = v.title + ' · immuno.games';
  $('name').innerHTML =
    '<small>' + v.lines[0] + '</small><span>' + v.lines[1] + '</span><strong>' + v.lines[2] + '</strong>';
  $('tagline').textContent = v.tag;
  $('start').querySelector('span').textContent = v.play;
  for (const b of document.querySelectorAll('[data-act=en],[data-act=pt]'))
    b.setAttribute('aria-pressed', String(b.dataset.act === state.lang));
  $('sound').innerHTML = icon(audio.enabled ? 'sound' : 'mute');
  label('sound', audio.enabled ? v.soundOn : v.soundOff);
  label('back', v.back);
  label('menu', v.help);
  label('close-sheet', v.close);
  label('pause', v.pause);
  pitch.setAttribute('aria-label', v.title + '. ' + v.hold);
  oldCue = '';
  panels();
  if (state.pane) sheetContent();
}
function seriesWins() {
  return state.series.filter((r) => r.saved).length;
}
function panels() {
  const ph = state.phase,
    v = t(),
    inPlay = !['home', 'result', 'half'].includes(ph);
  show($('home'), ph === 'home');
  show($('hud'), ph !== 'home');
  show($('nerve-fold'), ph === 'flight' || ph === 'grip');
  show($('halftime'), ph === 'half');
  show($('result'), ph === 'result');
  show($('cue'), inPlay);
  $('condition').textContent = circuit() === 'clear' ? v.control : v.short[circuit()];
  $('condition').parentElement.dataset.circuit = circuit();
  $('pitch').dataset.circuit = circuit();
  $('round-label').textContent =
    (state.practice ? v.practice : v.round) + ' ' + (state.round + 1) + '/' + ROUNDS;
  $('dots').innerHTML = Array.from({ length: ROUNDS }, (_, i) => {
    const r = state.series[i],
      status = r ? (r.saved ? 'win' : 'loss') : '';
    return (
      '<i class="pip ' +
      status +
      ' ' +
      (i === state.round ? 'now' : '') +
      '">' +
      (r ? (r.saved ? '✓' : '×') : '') +
      '</i>'
    );
  }).join('');
  $('dots').setAttribute('aria-label', seriesWins() + ' / 3 ' + v.saves);
  if (ph === 'half') {
    $('halftime').innerHTML =
      '<span class="print-label">' +
      v.short.clear +
      '</span><h2 class="result-title">' +
      v.outcome[state.result.outcome] +
      '</h2><div class="slip-actions">' +
      button('second', v.second, 'main-btn', 'play') +
      '</div><div class="slip-foot">' +
      button('same', v.again, 'text-btn') +
      button('flip', v.flip, 'text-btn') +
      '</div>';
  }
  if (ph === 'result') {
    const a = state.legs[0],
      b = state.legs[1],
      final = state.round === ROUNDS - 1;
    const title = final ? (seriesWins() >= 3 ? v.won : v.lost) : v.outcome[b.result.outcome];
    const savedLine = state.lesion === 'optic' ? v.opticSave : v.motorSave;
    const detail = b.result.saved ? savedLine : v.reason[b.result.reason];
    const one = final
      ? seriesWins() + ' / ' + ROUNDS + ' ' + v.saves + ' · ' + shootoutScore(state.series) + ' ' + v.pts
      : detail;
    let streak = 0;
    for (let n = state.round; n >= 0 && state.series[n]?.saved; n--) streak++;
    const bonus = b.result.saved ? 45 * Math.max(0, streak - 1) : 0;
    const earned =
      b.result.score && !state.practice
        ? ' · +' + (b.result.score + bonus) + (bonus ? ' (×' + streak + ')' : '')
        : '';
    const scores = [a, b]
      .map(
        (r) =>
          '<span><small>' + v.short[r.circuit] + '</small><b>' + v.outcome[r.result.outcome] + '</b></span>',
      )
      .join('');
    $('result').innerHTML =
      '<div class="pair-score">' +
      scores +
      '</div>' +
      (final ? '<h2 class="result-title">' + title + '</h2>' : '') +
      '<p class="one-line">' +
      one +
      (final ? (state.newRecord ? ' · ' + v.record : '') : earned) +
      '</p><div class="slip-actions">' +
      button('new', final ? v.nextSeries : v.next, 'main-btn', 'play') +
      button('same', v.again, 'soft-btn', 'repeat') +
      '</div><div class="slip-foot">' +
      button('flip', v.flip, 'text-btn') +
      button('replay', v.replay, 'text-btn') +
      '</div>';
  }
}
function liveCue() {
  if ($('cue').hidden) return;
  const ph = state.phase,
    v = t();
  let message = '',
    tone = 'normal';
  if (ph === 'run') {
    message = state.leg ? v.sameBall + ' · ' + v.short[state.lesion] : v.target;
    tone = 'kick';
  } else if (ph === 'end') {
    message = v.outcome[state.result.outcome];
    tone = 'kick';
  } else if (ph === 'grip') {
    message = v.grip;
    tone = 'ready';
  } else if (state.move) {
    message = state.move.side ? v.dive : v.blind;
  } else if (!state.holding) {
    message = circuit() === 'optic' && !state.seen ? v.blind : v.hold;
  } else {
    const p = state.shot,
      c = circuit(),
      side = state.declared || (state.seen ? p.side : 0);
    const aim = aimPoint(
      p,
      c,
      directedHold(p, c, state.down, state.time, state.declared, state.chosenAt),
      side,
    );
    if (side === p.side && Math.hypot(aim.x - p.x, aim.y - p.y) < 0.37) {
      message = v.release;
      tone = 'ready';
    } else if (c === 'motor' && state.time - state.down > p.idealPower * p.sweep * 0.9) message = v.returning;
    else message = state.seen ? v.hold : v.blind;
  }
  if (message + tone !== oldCue) {
    if (ph === 'flight' && tone === 'ready') audio.sound(710, 970, 0.075, 0.12, 'triangle');
    $('cue').textContent = message;
    $('cue').dataset.tone = tone;
    oldCue = message + tone;
  }
}

function render() {
  const p = state.shot,
    c = circuit(),
    ph = state.phase;
  const home = ph === 'home',
    frozen = ph === 'half' || ph === 'result';
  const time = home ? -0.93 : state.time,
    post = ph === 'end' ? clamp(state.age / 1.05) : frozen ? 1 : 0;
  const f = pitchFrame(p, c, state.move, time, post, state.result);
  if (home) {
    f.clap = Math.pow(Math.max(0, Math.sin(state.homeTime * 3.8)), 4);
    f.time = state.homeTime;
  }
  f.camera = 'duel';
  f.cameraT = 0;
  if (ph === 'end' && !reduced.matches) {
    f.camera = state.result.touches ? 'duelExit' : 'duelMiss';
    f.cameraT = post;
  }
  let project = null;
  const gl = !home && state.world;
  if (gl) {
    try {
      gl.render(width, height, f, p);
      project = (point) => gl.project(point);
    } catch {
      state.world = null;
      readyWorld = null;
    }
  }
  show($('three'), !!project);
  show($('paper'), !project);
  if (!project) project = printedPitch(fitCanvas($('paper'), width, height), width, height, f, home);
  const ink = fitCanvas($('ink'), width, height);
  ink.clearRect(0, 0, width, height);
  $('field-layer').classList.toggle('soft-eye', c === 'optic' && ph !== 'home');
  if (!home && !frozen) {
    const overlay = {
      circuit: c,
      time,
      phase: ph,
      holding: state.holding,
      down: state.down,
      declared: state.declared,
      chosenAt: state.chosenAt,
      move: state.move,
      gripAge: state.age,
      ghost: state.leg ? state.legs[0] : null,
      post,
      frame: f,
      result: state.result,
      reduced: reduced.matches,
      prevBall: incoming(p, CONTACT * clamp((time - 0.13) / p.air)),
    };
    playInk(ink, width, height, project, p, overlay);
    if (ph === 'end' && state.result.touches && post < 0.24 && !reduced.matches) {
      const at = f.hand ? project(f.hand) : { x: width / 2, y: height / 2 },
        u = post / 0.24;
      const cx = lerp(width * 0.5, at.x, 0.23),
        cy = lerp(height * 0.5, at.y, 0.23),
        radius = Math.max(1, Math.hypot(width, height) * u * u);
      ink.save();
      for (let i = 2; i >= 0; i--) {
        const rr = radius + i * height * 0.05 * (1 - u);
        ink.beginPath();
        ink.rect(-1, -1, width + 2, height + 2);
        ink.moveTo(cx + rr, cy);
        ink.arc(cx, cy, rr, 0, 2 * Math.PI, true);
        ink.fillStyle = ['#adbc99', '#738e7f', '#305454'][i];
        ink.fill('evenodd');
      }
      ink.restore();
    }
    if (!$('nerve-fold').hidden) {
      const n = $('nerve'),
        w = n.clientWidth,
        h = n.clientHeight,
        ctx = fitCanvas(n, w, h);
      ctx.clearRect(0, 0, w, h);
      const stage = c === 'motor' ? 'motor' : 'visual';
      fibre(ctx, 0, 0, w, h, c, signalProgress(p, c, time, stage), stage);
    }
  }
  liveCue();
}
function lerp(a, b, u) {
  return a + (b - a) * u;
}

function open(pane) {
  if (state.pane === 'immune' && pane === 'flip') inspect.playing = false;
  state.pane = pane;
  cancelHold();
  nowStamp();
  if (pane === 'flip') {
    inspect.circuit = state.leg ? state.lesion : 'clear';
    inspect.fibre = 0;
  }
  if (pane === 'replay') {
    inspect.clock = reduced.matches ? 0.78 : 0;
    inspect.playing = !reduced.matches;
    inspect.matched = !state.legs[1];
  }
  if (pane === 'immune') {
    inspect.wall = immuneStops[0];
    inspect.treated = false;
    inspect.playing = false;
  }
  if (pane === 'eyes') inspect.eye = 'left';
  sheetContent();
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop = 0;
  requestAnimationFrame(drawSheet);
}
function close(focus = true) {
  state.pane = null;
  inspect.playing = false;
  if (dialog.open) dialog.close();
  nowStamp();
  if (focus) (state.phase === 'home' ? $('start') : pitch).focus({ preventScroll: true });
}
function choice(action, title, on) {
  return '<button data-act="' + action + '" aria-pressed="' + on + '">' + title + '</button>';
}
function sourceBlock() {
  const i = immuneCopy[state.lang],
    w = words[state.lang];
  const links = [
    ...sources.slice(0, 3).map((url, n) => [url, w.refs[n]]),
    ...immuneSources.map((url, n) => [url, i.refs[n]]),
  ];
  return (
    '<details><summary>' +
    t().sources +
    '</summary><p>' +
    t().model +
    '</p>' +
    w.scienceBody.map((text) => '<p>' + text + '</p>').join('') +
    '<ul>' +
    links
      .map(([u, s]) => '<li><a href="' + u + '" target="_blank" rel="noopener">' + s + '</a></li>')
      .join('') +
    '</ul></details>'
  );
}
function recordedPair() {
  const p = state.shot,
    a = state.legs[0],
    b = state.legs[1];
  if (a && b && !inspect.matched) return [a, b];
  const down = readTime(p, 'clear') + 0.19,
    up = down + p.idealPower * p.sweep;
  const ideal = jump(p, 'clear', down, up);
  const source = a || b || { move: ideal, grip: 0.28, result: verdict(p, 'clear', ideal, 0.28) };
  return ['clear', state.lesion].map((c) => {
    const m = source.move
      ? jump(p, c, source.move.down, source.move.up, source.move.declaredSide, source.move.chosenAt)
      : null;
    const unknown = !source.result.touches && contact(p, c, m).touches;
    return { circuit: c, move: m, grip: source.grip, result: verdict(p, c, m, source.grip), unknown };
  });
}
function sheetContent() {
  const v = t(),
    i = immuneCopy[state.lang],
    w = words[state.lang],
    mode = state.pane;
  let body = '',
    title = '';
  if (mode === 'menu' || mode === 'pause') {
    title = mode === 'pause' ? v.pause : v.menu;
    body =
      '<div class="sheet-menu">' +
      (state.phase !== 'home' ? button('close', v.resume, 'main-btn', 'play') : '') +
      button('how', v.assist, 'sheet-link') +
      button('immune', v.study, 'sheet-link', 'book') +
      '<a class="sheet-link" href="training.html?v=4" target="_blank" rel="noopener">' +
      v.training +
      '</a>' +
      (state.phase !== 'home' ? button('home', v.home, 'sheet-link') : '') +
      '</div>' +
      '<p class="menu-score">' +
      icon('cup') +
      v.best +
      ' · ' +
      state.best +
      ' ' +
      v.pts +
      '</p>' +
      button('credits', v.credits, 'text-btn');
  } else if (mode === 'how') {
    title = v.assist;
    body =
      '<p>' +
      v.how +
      '</p><p>' +
      v.early +
      '</p><p>' +
      v.model +
      '</p>' +
      button('close', v.resume, 'main-btn', 'play');
  } else if (mode === 'credits') {
    title = v.credits;
    body =
      '<p>' +
      v.created +
      '</p><p><a href="https://www.instagram.com/helder_nakaya/" target="_blank" rel="noopener">@helder_nakaya</a> · <a href="https://github.com/xikhar/papercraft" target="_blank" rel="noopener">Papercraft</a> · Three.js</p>' +
      sourceBlock();
  } else if (mode === 'flip') {
    title = v.nerveTitle;
    const c = inspect.circuit;
    body =
      '<div class="tab-set">' +
      choice('path-clear', v.short.clear, c === 'clear') +
      choice('path-lesion', v.short[state.lesion], c !== 'clear') +
      '</div><canvas id="fiber-diagram" class="chart-fiber" aria-label="' +
      v.circuit[c] +
      '"></canvas><h3>' +
      v.circuit[c] +
      '</h3><p>' +
      v.flipLine[c] +
      '</p><div class="row">' +
      button('replay', v.replay, 'soft-btn', 'play') +
      (state.lesion === 'optic' ? button('eyes', v.eye, 'soft-btn') : '') +
      button('immune', v.study, 'text-btn') +
      '</div>' +
      sourceBlock();
  } else if (mode === 'eyes') {
    const left = inspect.eye === 'left';
    title = v.eye;
    body =
      '<canvas class="sheet-art" id="eye-frame" aria-label="' +
      v.eye +
      '"></canvas><div class="tab-set">' +
      choice('left-eye', w.leftEye, left) +
      choice('right-eye', w.rightEye, !left) +
      '</div><p>' +
      (left ? i.site[1] : w.rightNerveNote) +
      '</p>' +
      button('flip', v.flip, 'text-btn');
  } else if (mode === 'immune') {
    title = v.immuneTitle;
    const k = immuneStage(inspect.wall);
    body =
      '<div class="tab-set">' +
      i.modes.map((s, n) => choice('treat-' + n, s, inspect.treated === !!n)).join('') +
      '</div><canvas id="immune-chart" class="sheet-art" aria-label="' +
      i.diagram +
      '"></canvas><div class="tab-set">' +
      i.steps.map((s, n) => choice('wall-' + n, s, n === k)).join('') +
      '</div><p id="immune-line">' +
      v.immuneBrief[Number(inspect.treated)][k] +
      '</p><div class="replay-controls">' +
      button('wall-play', '', 'icon', inspect.playing ? 'pause' : 'play') +
      '<input id="wall-slider" aria-label="' +
      i.time +
      '" type="range" min="0" max="1000" value="' +
      Math.round(inspect.wall * 1000) +
      '"></div><details><summary>' +
      v.extra +
      '</summary>' +
      i.roles.map((s, n) => '<h3>' + s + '</h3><p>' + i.rolesText[n] + '</p>').join('') +
      '<p>' +
      i.phases[1][0] +
      ' ' +
      i.phases[1][2] +
      '</p><p>' +
      i.safety +
      '</p></details>' +
      sourceBlock();
  } else if (mode === 'replay') {
    title = v.replay;
    const pair = recordedPair(),
      both = !!state.legs[1];
    body =
      (both
        ? '<div class="tab-set">' +
          choice('recorded', v.observed, !inspect.matched) +
          choice('matched', v.matched, inspect.matched) +
          '</div>'
        : '') +
      '<div class="replay-pair">' +
      pair
        .map(
          (r, n) =>
            '<figure><figcaption>' +
            v.short[r.circuit] +
            '</figcaption><canvas id="replay-' +
            n +
            '" class="replay-field" aria-label="' +
            v.short[r.circuit] +
            '"></canvas><output>' +
            (r.unknown ? w.contact : v.outcome[r.result.outcome]) +
            '</output></figure>',
        )
        .join('') +
      '</div>' +
      '<div class="replay-controls">' +
      button('replay-play', '', 'icon', inspect.playing ? 'pause' : 'play') +
      '<input id="replay-slider" aria-label="' +
      v.timeline +
      '" type="range" min="0" max="1000" value="' +
      Math.round(inspect.clock * 1000) +
      '"></div>' +
      '<p>' +
      (state.lesion === 'optic'
        ? v.opticClock(
            (readTime(state.shot, 'optic') - readTime(state.shot, 'clear')).toLocaleString(state.lang, {
              maximumFractionDigits: 1,
              minimumFractionDigits: 1,
            }),
          )
        : v.motorClock) +
      '</p>' +
      '<div class="row">' +
      button(
        state.phase === 'home' ? 'start' : 'pair',
        state.phase === 'home' ? v.play : v.againPair,
        'main-btn',
        'play',
      ) +
      button('flip', v.flip, 'text-btn') +
      '</div>';
  }
  sheetBody.innerHTML = '<h2 id="sheet-title">' + title + '</h2>' + body;
  dialog.setAttribute('aria-labelledby', 'sheet-title');
  for (const [a, name] of [
    ['wall-play', inspect.playing ? i.pause : i.play],
    ['replay-play', inspect.playing ? v.stopReplay : v.runReplay],
  ])
    sheetBody.querySelector('[data-act="' + a + '"]')?.setAttribute('aria-label', name);
  requestAnimationFrame(drawSheet);
}
function updateReplayControl() {
  const b = sheetBody.querySelector('[data-act=replay-play]');
  if (b) {
    b.innerHTML = icon(inspect.playing ? 'pause' : 'play');
    b.setAttribute('aria-label', inspect.playing ? t().stopReplay : t().runReplay);
  }
}
function drawSheet() {
  const pane = state.pane,
    p = state.shot;
  if (pane === 'immune') {
    const node = $('immune-chart');
    if (!node) return;
    const w = node.clientWidth,
      h = node.clientHeight,
      c = fitCanvas(node, w, h);
    drawImmune(c, w, h, { time: inspect.wall, treated: inspect.treated, role: 0 }, immuneCopy[state.lang]);
    const step = immuneStage(inspect.wall),
      text = t().immuneBrief[Number(inspect.treated)][step];
    if ($('immune-line').textContent !== text) $('immune-line').textContent = text;
    for (const b of sheetBody.querySelectorAll('[data-act^=wall-]:not([data-act=wall-play])'))
      b.setAttribute('aria-pressed', String(b.dataset.act === 'wall-' + step));
    $('wall-slider').value = Math.round(inspect.wall * 1000);
    const play = sheetBody.querySelector('[data-act=wall-play]'),
      mode = inspect.playing ? 'pause' : 'play';
    if (play.dataset.icon !== mode) {
      play.innerHTML = icon(mode);
      play.dataset.icon = mode;
      play.setAttribute(
        'aria-label',
        inspect.playing ? immuneCopy[state.lang].pause : immuneCopy[state.lang].play,
      );
    }
  } else if (pane === 'flip') {
    const n = $('fiber-diagram');
    if (!n) return;
    const w = n.clientWidth,
      h = n.clientHeight,
      c = fitCanvas(n, w, h);
    c.fillStyle = '#2d5250';
    c.fillRect(0, 0, w, h);
    const sci = inspect.circuit,
      stage = state.lesion === 'motor' ? 'motor' : 'visual';
    fibre(c, 0, 0, w, h, sci, signalProgress(p, sci, inspect.fibre * p.air, stage), stage, true);
  } else if (pane === 'eyes') {
    const n = $('eye-frame');
    if (!n) return;
    const w = n.clientWidth,
      h = n.clientHeight;
    const f = pitchFrame(p, 'clear', null, readTime(p, 'clear'));
    printedPitch(fitCanvas(n, w, h), w, h, f);
    n.style.filter = inspect.eye === 'left' ? 'saturate(.22) contrast(.76)' : 'none';
  } else if (pane === 'replay') {
    const elapsed = inspect.clock * (p.air + 1.1);
    recordedPair().forEach((trial, i) => {
      const node = $('replay-' + i);
      if (!node) return;
      const w = node.clientWidth,
        h = node.clientHeight,
        c = fitCanvas(node, w, h),
        time = Math.min(p.air, elapsed);
      const post = trial.unknown ? 0 : clamp((elapsed - p.air) / 1.1);
      const raw = trial.move,
        active = raw && raw.up <= time ? raw : null;
      const f = pitchFrame(p, trial.circuit, active, time, post, trial.result);
      const project = printedPitch(c, w, h, f);
      replayPaths(c, project, p, trial, time, w);
      const seen = time >= readTime(p, trial.circuit),
        at = project({ x: p.x, y: p.y, z: LINE });
      if (seen) {
        c.strokeStyle = '#ffda78';
        c.setLineDash([3, 3]);
        c.lineWidth = 1.8;
        c.beginPath();
        c.arc(at.x, at.y, Math.max(5, w * 0.04), 0, Math.PI * 2);
        c.stroke();
        c.setLineDash([]);
      }
    });
    $('replay-slider').value = Math.round(inspect.clock * 1000);
  }
}

function handle(a) {
  if (a === 'en' || a === 'pt') {
    state.lang = a;
    save('language', a);
    localization();
    return;
  }
  if (a === 'sound') {
    audio.set(!audio.enabled);
    save('sound', audio.enabled);
    localization();
    return;
  }
  if (a === 'close') {
    close();
    return;
  }
  if (['menu', 'pause', 'how', 'credits', 'flip', 'eyes', 'immune', 'replay'].includes(a)) {
    open(a);
    return;
  }
  if (a === 'home') {
    close(false);
    cancelHold();
    state.legs = [null, null];
    state.leg = 0;
    state.round = 0;
    state.shot = penalty(first);
    state.lesion = 'optic';
    state.series = [];
    state.move = null;
    state.result = null;
    setPhase('home');
    $('start').focus();
    return;
  }
  if (a === 'start') {
    if (state.pane) close(false);
    begin();
    return;
  }
  if (a === 'pair') {
    startLeg(0);
    return;
  }
  if (a === 'second') {
    startLeg(1);
    return;
  }
  if (a === 'same') {
    startLeg(state.leg);
    return;
  }
  if (a === 'new') {
    newKick();
    return;
  }
  if (a === 'left-eye' || a === 'right-eye') {
    inspect.eye = a.split('-')[0];
  } else if (a === 'path-clear' || a === 'path-lesion') {
    inspect.circuit = a === 'path-clear' ? 'clear' : state.lesion;
    inspect.fibre = 0;
  } else if (a === 'matched' || a === 'recorded') {
    inspect.matched = a === 'matched';
    inspect.playing = false;
  } else if (a === 'replay-play') {
    if (inspect.clock >= 1) inspect.clock = 0;
    inspect.playing = !inspect.playing;
    updateReplayControl();
    return;
  } else if (a === 'wall-play') {
    if (inspect.wall >= 1) inspect.wall = 0;
    inspect.playing = !inspect.playing;
  } else if (a.startsWith('treat-')) {
    inspect.treated = a === 'treat-1';
    inspect.playing = false;
  } else if (a.startsWith('wall-')) {
    inspect.wall = immuneStops[Number(a.slice(5))];
    inspect.playing = false;
  } else return;
  sheetContent();
  sheetBody.querySelector('[data-act="' + a + '"]')?.focus({ preventScroll: true });
}
document.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-act]');
  if (btn) handle(btn.dataset.act);
});
sheetBody.addEventListener('input', (e) => {
  if (e.target.id === 'replay-slider') {
    inspect.clock = Number(e.target.value) / 1000;
    inspect.playing = false;
    updateReplayControl();
    drawSheet();
  } else if (e.target.id === 'wall-slider') {
    inspect.wall = Number(e.target.value) / 1000;
    inspect.playing = false;
    drawSheet();
  }
});
dialog.addEventListener('cancel', (e) => {
  e.preventDefault();
  close();
});
dialog.addEventListener('click', (e) => {
  if (e.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) close();
  }
});
pitch.addEventListener('pointerdown', (e) => {
  if (!e.isPrimary || e.button !== 0 || e.target.closest('button,a,input') || state.pane) return;
  e.preventDefault();
  pitch.focus({ preventScroll: true });
  sync();
  press(e.pointerId, e.clientX);
  if (state.holding)
    try {
      pitch.setPointerCapture(e.pointerId);
    } catch {}
});
window.addEventListener('pointermove', (e) => {
  if (
    state.holding &&
    state.pointer === e.pointerId &&
    Math.abs(e.clientX - state.origin) > Math.max(20, width * 0.045)
  )
    chooseSide(e.clientX < state.origin ? -1 : 1);
});
window.addEventListener('pointerup', (e) => {
  if (state.pointer === e.pointerId) {
    e.preventDefault();
    sync();
    release(e.pointerId);
  }
});
window.addEventListener('pointercancel', (e) => {
  if (state.holding && state.pointer === e.pointerId) open('pause');
});
window.addEventListener('keydown', (e) => {
  if (state.pane) return;
  if (e.key === 'Escape' && state.phase !== 'home') {
    e.preventDefault();
    open('pause');
    return;
  }
  if (e.repeat || e.target.closest?.('button,a,input,summary')) return;
  if (
    ['ArrowLeft', 'ArrowRight', 'KeyA', 'KeyD'].includes(e.code) &&
    ['run', 'flight'].includes(state.phase)
  ) {
    e.preventDefault();
    chooseSide(e.code === 'ArrowLeft' || e.code === 'KeyA' ? -1 : 1);
    return;
  }
  if (e.code !== 'Space') return;
  e.preventDefault();
  sync();
  if (state.phase === 'result') newKick();
  else if (state.phase === 'half') startLeg(1);
  else press('space', 0);
});
window.addEventListener('keyup', (e) => {
  if (e.code === 'Space' && state.pointer === 'space') {
    e.preventDefault();
    sync();
    release('space');
  }
});
function pauseHidden() {
  if (!state.pane && ['run', 'flight', 'grip', 'end', 'half'].includes(state.phase)) open('pause');
  nowStamp();
}
document.addEventListener('visibilitychange', () => {
  if (document.hidden) pauseHidden();
  else nowStamp();
});
window.addEventListener('blur', () => {
  if (state.holding) pauseHidden();
});
window.addEventListener('storage', (e) => {
  if (e.key === 'impossible-save.language') {
    state.lang = load('language', 'en') === 'pt' ? 'pt' : 'en';
    localization();
  }
});
function link() {
  if (location.hash === '#immunity') open('immune');
  else if (location.hash === '#compare') open('replay');
}
function tick(stamp) {
  sync(stamp);
  if (!document.hidden) {
    if (state.pane) {
      if ((inspect.playing || state.pane === 'flip') && stamp - lastDraw >= 32) {
        drawSheet();
        lastDraw = stamp;
      }
    } else if (stamp - lastDraw >= (['home', 'half', 'result'].includes(state.phase) ? 42 : 0)) {
      render();
      lastDraw = stamp;
    }
  }
  requestAnimationFrame(tick);
}
localization();
link();
window.addEventListener('hashchange', link);
requestAnimationFrame(tick);
if ('requestIdleCallback' in window) requestIdleCallback(prepareWorld, { timeout: 1200 });
else setTimeout(prepareWorld, 350);
