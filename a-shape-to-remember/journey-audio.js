import {flapParams, noiseGen, synthFlap} from './vendor/papercraft/lib/paper-sound.js';

// The opening receptor and its memory use the same pitches and rhythm.
const motifs = [[62, 67, 71], [69, 65, 60], [62, 69, 65]];
const beats = [0, .30, .68];
const pitch = midi => 440 * 2 ** ((midi - 69) / 12);
const floor = .0001;

export function noteSketch(target, play = false) {
  const notes = motifs[target] || motifs[0];
  const lowest = Math.min(...notes);
  const dots = notes.map((n, i) =>
    '<i style="transform:translateY(' + (-.85 * (n - lowest)) + 'px);animation-delay:' + beats[i] + 's"></i>'
  ).join('');
  return '<span class="note-visual' + (play ? ' play' : '') + '" aria-hidden="true">' + dots + '</span>';
}

// Flow frequency and gain, then the pitches of widely spaced environmental swells.
const habitats = {
  river:       {color: 630, flow: .23, pitches: [50, 57, 55, 50], pace: 7.8},
  node:        {color: 920, flow: .14, pitches: [55, 62, 57, 62], pace: 6.3},
  recognition: {color: 1040, flow: .11, pitches: [55, 62, 55, 64], pace: 8.5},
  garden:      {color: 1190, flow: .13, pitches: [60, 67, 64, 62], pace: 5.2},
  marrow:      {color: 470, flow: .18, pitches: [50, 53, 57, 53], pace: 6.6},
  recall:      {color: 820, flow: .09, pitches: [55, 62, 57, 62], pace: 7.2},
  tonsil:      {color: 750, flow: .15, pitches: [57, 64, 60, 64], pace: 8.2}
};

const actions = {
  fold: 'fold', unfold: 'unfold', fan: 'fold', membrane: 'fold', vellum: 'fold', leaf: 'fold',
  'node-tab': 'unfold', follicle: 'unfold', garden: 'unfold', mhc: 'unfold',
  approach: 'approach', near: 'approach', '@watch': 'approach',
  friend: 'encounter', 'late-mica': 'encounter', '@seen': 'encounter', encounter: 'encounter',
  macrophage: 'encounter', sister: 'encounter', helper: 'signal', tfh: 'signal', il21: 'signal',
  brush: 'miss', mismatch: 'miss', miss: 'miss', decoy: 'miss', slip: 'miss',
  match: 'match', motif: 'motif', receptor: 'motif', recall: 'recall',
  signal: 'signal', trail: 'approach', rbc: 'water', travel: 'water', water: 'water',
  plasma: 'marrow', marrow: 'marrow', antibody: 'marrow', memory: 'memory',
  years: 'years', expand: 'memory', finish: 'ending', ending: 'ending', family: 'ending'
};

export function createSound(initiallyEnabled = true) {
  let enabled = !!initiallyEnabled, paused = false, disposed = false, awake = false;
  let stage = null, moving = false, bed = null, phrase = null, suspendTimer = 0;
  let ctx, master, effects, field, noise, wooden;
  const voices = new Set(), last = new Map(), folds = new Map();
  const random = noiseGen(641901);
  let foldIndex = 0;
  const now = () => ctx.currentTime;
  const allowed = () => enabled && !paused && !disposed && !document.hidden;

  function level(param, value, at, seconds) {
    if (typeof param.cancelAndHoldAtTime === 'function') param.cancelAndHoldAtTime(at);
    else {
      const current = param.value;
      param.cancelScheduledValues(at);
      param.setValueAtTime(current, at);
    }
    param.linearRampToValueAtTime(value, at + seconds);
  }

  function makeNoise() {
    // Overlap the head of the source at the far end to form a seamless loop.
    const rate = 24000, length = rate * 3, overlap = rate / 8;
    const source = new Float32Array(length + overlap);
    let low = 0;
    for (let i = 0; i < source.length; i++) {
      const white = random();
      low = low * .92 + .08 * white;
      source[i] = .28 * white + 2.1 * low;
    }
    const buffer = ctx.createBuffer(1, length, rate);
    const data = buffer.getChannelData(0);
    data.set(source.subarray(overlap));
    for (let i = 0; i < overlap; i++) {
      const u = i / overlap;
      const pos = length - overlap + i;
      data[pos] = data[pos] * (1 - u) + source[i] * u;
    }
    return buffer;
  }

  function init() {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return false;
    ctx = new Audio();
    master = ctx.createGain(); master.gain.value = floor;
    field = ctx.createGain(); field.connect(master);
    effects = ctx.createGain(); effects.connect(master);
    const room = ctx.createDelay(.2), wall = ctx.createBiquadFilter(), wet = ctx.createGain();
    room.delayTime.value = .083; wall.type = 'lowpass'; wall.frequency.value = 2100; wet.gain.value = .135;
    effects.connect(room); room.connect(wall); wall.connect(wet); wet.connect(master);
    const limit = ctx.createDynamicsCompressor();
    limit.threshold.value = -12; limit.knee.value = 9; limit.ratio.value = 3;
    limit.attack.value = .006; limit.release.value = .19;
    master.connect(limit); limit.connect(ctx.destination);
    const harmonics = new Float32Array([0, 1, .34, .13, .045, .025]);
    wooden = ctx.createPeriodicWave(new Float32Array(harmonics.length), harmonics);
    noise = makeNoise();
    return true;
  }

  // A stopped voice also releases every private node connected to its source.
  function run(source, nodes, at, until, offset) {
    voices.add(source);
    source.onended = () => {
      voices.delete(source);
      for (const n of [source, ...nodes]) n.disconnect();
    };
    if (offset === undefined) source.start(at); else source.start(at, offset);
    source.stop(until);
  }

  function strike(freq, at, strength, length, timbre = 'wood', attack = .012, bus = effects, endHz = freq) {
    const osc = ctx.createOscillator(), envelope = ctx.createGain();
    if (timbre === 'wood') osc.setPeriodicWave(wooden); else osc.type = timbre;
    osc.frequency.setValueAtTime(freq, at);
    if (endHz !== freq) osc.frequency.exponentialRampToValueAtTime(endHz, at + length * .65);
    envelope.gain.setValueAtTime(floor, at);
    envelope.gain.linearRampToValueAtTime(strength, at + attack);
    envelope.gain.exponentialRampToValueAtTime(strength * .32, at + attack + (length - attack) * .30);
    envelope.gain.exponentialRampToValueAtTime(floor, at + length);
    osc.connect(envelope); envelope.connect(bus);
    run(osc, [envelope], at, at + length + .015);
    return osc;
  }

  function paper(at, size = .45, up = true, gain = .24) {
    const variation = foldIndex++ % 3, key = [size, up, variation].join('-');
    let buffer = folds.get(key);
    if (!buffer) {
      const sr = 24000, seed = 317 + variation * 71 + Math.round(size * 97);
      const params = flapParams({size, up, seed});
      const samples = synthFlap({size, up, seed, sr, pitch: params.pitch, dur: params.dur});
      buffer = ctx.createBuffer(1, samples.length, sr);
      buffer.getChannelData(0).set(samples);
      folds.set(key, buffer);
    }
    const player = ctx.createBufferSource(), volume = ctx.createGain();
    volume.gain.value = gain;
    player.buffer = buffer; player.connect(volume); volume.connect(effects);
    run(player, [volume], at, at + buffer.duration + .01);
  }

  function puff(at, from, to, strength, duration) {
    const source = ctx.createBufferSource(), filter = ctx.createBiquadFilter(), env = ctx.createGain();
    source.buffer = noise; source.loop = true;
    filter.type = 'bandpass'; filter.Q.value = .82;
    filter.frequency.setValueAtTime(from, at); filter.frequency.exponentialRampToValueAtTime(to, at + duration);
    env.gain.setValueAtTime(floor, at); env.gain.linearRampToValueAtTime(strength, at + duration * .22);
    env.gain.exponentialRampToValueAtTime(floor, at + duration);
    source.connect(filter); filter.connect(env); env.connect(effects);
    run(source, [filter, env], at, at + duration + .02, 1.4 + random());
  }

  function duck(at, duration, depth = .24) {
    level(field.gain, depth, at, .075);
    field.gain.setValueAtTime(depth, at + duration);
    field.gain.linearRampToValueAtTime(1, at + duration + .50);
  }

  function motif(target, at, memory) {
    const series = motifs[target] || motifs[0];
    duck(at, 1.24);
    if (phrase) level(phrase.gain, floor, at, .035);
    const voice = ctx.createGain();
    voice.connect(effects); phrase = voice;
    let tail;
    series.forEach((note, i) => {
      const f = pitch(note), start = at + beats[i], duration = i === 2 ? 1.14 : .71;
      tail = strike(f, start, [.29, .23, .28][i], duration, 'wood', .012, voice);
      strike(f * 2.99, start, .055, .14, 'sine', .005, voice);
      if (memory) tail = strike(f * 2, start + .025, .048, duration + .30, 'sine', .055, voice);
    });
    const release = tail.onended;
    tail.onended = () => { release(); voice.disconnect(); if (phrase === voice) phrase = null; };
  }

  function play(id, target = 0) {
    if (!unlock()) return;
    const cue = actions[id] || (String(id).startsWith('sister-') ? 'encounter' : 'fold');
    const t = now() + .016;
    const gap = ['motif', 'match', 'recall'].includes(cue) ? .95 : cue === 'approach' ? .8 : .25;
    if (t - (last.get(cue) ?? -10) < gap) return;
    last.set(cue, t);
    switch (cue) {
      case 'motif': case 'match': case 'recall': motif(target, t, cue === 'recall'); break;
      case 'approach':
        duck(t, .28, .68);
        puff(t, 420, 1050, .38, .34);
        strike(pitch(67), t + .12, .085, .33, 'sine', .038); break;
      case 'miss':
        puff(t, 1180, 410, .48, .30);
        strike(342, t + .025, .083, .24, 'triangle', .02, effects, 247); break;
      case 'encounter':
        strike(pitch(55), t, .19, .51);
        strike(pitch(62), t + .24, .18, .71, 'triangle', .025); break;
      case 'signal':
        duck(t, .62);
        strike(pitch(74), t, .19, .68, 'sine', .055);
        strike(pitch(81), t + .26, .18, .82);
        strike(pitch(93), t + .27, .033, .52, 'sine'); break;
      case 'unfold':
        duck(t, .32, .60);
        paper(t, .9, true, .32); puff(t + .03, 430, 920, .27, .49); break;
      case 'water': puff(t, 440, 850, .43, .39); break;
      case 'marrow':
        strike(pitch(50), t, .21, .91, 'wood', .053);
        strike(pitch(57), t + .14, .12, 1.06, 'sine', .12); break;
      case 'memory': case 'ending':
        duck(t, .98);
        strike(pitch(55), t, .19, 1.34, 'wood', .055);
        strike(pitch(62), t + .12, .12, 1.42, 'triangle', .14);
        if (cue === 'ending') strike(pitch(71), t + .14, .10, 1.53, 'sine', .21); break;
      case 'years':
        paper(t, .7, true, .23); paper(t + .24, .6, false, .17);
        puff(t + .05, 1480, 390, .39, .78);
        strike(pitch(67), t + .36, .11, 1.1, 'sine', .16); break;
      default: paper(t);
    }
  }

  function stepBed(b) {
    if (b !== bed || !awake) return;
    const t = now(), ahead = t + .30;
    if (b.beat <= ahead) {
      const beat = Math.max(t + .018, b.beat);
      strike(188, beat, moving ? .13 : .10, .19, 'wood', .011, b.output, 111);
      strike(205, beat + .21, .062, .13, 'wood', .013, b.output, 137);
      b.beat = beat + 1.54 + random() * .13;
    }
    if (b.chime <= ahead) {
      const start = Math.max(t + .018, b.chime), i = b.index++ % b.habitat.pitches.length;
      const f = pitch(b.habitat.pitches[i]);
      strike(f, start, .069, 1.22, 'wood', .21, b.output);
      strike(f * 2, start + .12, .024, 1.37, 'sine', .28, b.output);
      b.chime = start + b.habitat.pace + random() * 1.15;
    }
    const next = Math.min(b.beat, b.chime);
    b.timer = setTimeout(() => stepBed(b), Math.max(110, (next - t - .23) * 1000));
  }

  function stopBed(seconds = .3) {
    if (!bed) return;
    const old = bed;
    bed = null;
    clearTimeout(old.timer);
    const end = now() + seconds + .015;
    level(old.output.gain, floor, now(), seconds);
    old.source.stop(end); old.lfo.stop(end);
    old.source.onended = () => {
      for (const node of [old.source, old.lfo, old.sway, old.filter, old.flow, old.output]) node.disconnect();
    };
  }

  function flowLevel() {
    if (!bed) return;
    const value = bed.habitat.flow;
    level(bed.flow.gain, value * (moving ? 1.25 : .78), now(), .38);
    level(bed.filter.frequency, bed.habitat.color * (moving ? 1.23 : .93), now(), .52);
  }

  function startBed() {
    if (!stage || !awake || !ctx || bed) return;
    const habitat = habitats[stage], t = now();
    const source = ctx.createBufferSource(), filter = ctx.createBiquadFilter();
    const flow = ctx.createGain(), output = ctx.createGain(), lfo = ctx.createOscillator(), sway = ctx.createGain();
    source.buffer = noise; source.loop = true; filter.type = 'bandpass'; filter.Q.value = .62;
    filter.frequency.value = habitat.color;
    flow.gain.value = habitat.flow; output.gain.setValueAtTime(floor, t);
    output.gain.linearRampToValueAtTime(1, t + .52);
    source.connect(filter); filter.connect(flow); flow.connect(output); output.connect(field);
    lfo.frequency.value = .08; sway.gain.value = habitat.color * .16;
    lfo.connect(sway); sway.connect(filter.frequency);
    source.start(t); lfo.start(t);
    bed = {source, filter, flow, output, lfo, sway, habitat, index: 0, timer: 0,
      beat: stage === 'river' ? t + .48 : Infinity, chime: t + 3.2};
    flowLevel(); stepBed(bed);
  }

  function unlock() {
    if (!allowed()) return false;
    if (!ctx && navigator.userActivation && !navigator.userActivation.hasBeenActive && !navigator.userActivation.isActive) return false;
    try {
      if (!ctx && !init()) return false;
      clearTimeout(suspendTimer);
      if (ctx.state === 'closed') return false;
      if (ctx.state === 'suspended' || ctx.state === 'interrupted') ctx.resume().catch(() => {});
      if (!awake) {
        awake = true;
        level(master.gain, .76, now(), .04);
        startBed();
      }
      return true;
    } catch { return false; }
  }

  function quiet() {
    awake = false;
    if (!ctx) return;
    const fade = document.hidden ? 0 : .04;
    clearTimeout(suspendTimer); stopBed(fade);
    level(master.gain, floor, now(), fade);
    for (const source of voices) source.stop(now() + fade);
    last.clear();
    // Suspend after the gain reaches silence. Browsers can freeze timers in a hidden tab.
    const suspend = () => {
      if (awake || ctx.state === 'closed') return;
      ctx.suspend().then(() => {
        if (awake && allowed() && ctx.state === 'suspended') ctx.resume().catch(() => {});
      }).catch(() => {});
    };
    if (document.hidden) suspend();
    else suspendTimer = setTimeout(suspend, 68);
  }

  function visibility() {
    if (!allowed()) quiet();
    else if (ctx && stage) unlock();
  }
  document.addEventListener('visibilitychange', visibility);
  return {
    unlock, play,
    set(value) {
      enabled = !!value;
      if (enabled) unlock(); else quiet();
    },
    scene(value) {
      const next = Object.hasOwn(habitats, value) ? value : null;
      if (stage === next) return;
      stage = next; moving = false;
      stopBed(); startBed();
    },
    travel(value) {
      if (moving === !!value) return;
      moving = !!value; flowLevel();
    },
    pause(value) {
      if (paused === !!value) return;
      paused = !!value;
      if (paused) quiet(); else if (ctx && allowed()) unlock();
    },
    destroy() {
      if (disposed) return;
      disposed = true; document.removeEventListener('visibilitychange', visibility);
      quiet(); clearTimeout(suspendTimer);
      if (ctx && ctx.state !== 'closed') ctx.close().catch(() => {});
    }
  };
}
