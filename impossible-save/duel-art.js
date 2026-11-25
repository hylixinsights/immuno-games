// Printed pitch, overlaid jump projection and the continuous axon along the paper fold.
import { drawField, fieldProject } from './field-print.js?v=2';
import { clamp, lerp, smooth, incoming, CONTACT } from './rules.js?v=3';
import { aimPoint, readTime, gloveAt, directedHold, LINE, GRIP_BEAT } from './duel-model.js?v=4';

export function fitCanvas(canvas, w, h, cap = 1.7) {
  const ratio = Math.min(cap, window.devicePixelRatio || 1);
  const width = Math.max(1, Math.round(w * ratio)),
    height = Math.max(1, Math.round(h * ratio));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  const c = canvas.getContext('2d');
  c.setTransform(width / Math.max(1, w), 0, 0, height / Math.max(1, h), 0, 0);
  return c;
}

export function printedPitch(c, w, h, f, home = false) {
  const g = fieldProject(w, h, 0, 1.38, -3.22),
    post = fieldProject(w, h, 4.3, 1.38, -3.22);
  const width = (home ? 0.66 : 0.86) * w,
    z = Math.min(home ? 2.0 : 2.9, width / (2 * (post.x - g.x)), (h * 0.84) / ((5.1 * (post.x - g.x)) / 4.3));
  const x = w * (home && w > h * 1.18 ? 0.63 : 0.5),
    y = h * (home ? 0.46 : 0.425);
  let zoom = z,
    anchor = g,
    fx = x,
    fy = y;
  if (f.camera === 'duelExit' || f.camera === 'duelMiss') {
    const ph = f.cameraT,
      hit = f.hand || f.ball,
      p = fieldProject(w, h, hit.x, hit.y, hit.z);
    const close =
      f.camera === 'duelExit' ? 1 - smooth((ph - 0.05) / 0.73) : 0.42 * Math.sin(Math.PI * clamp(ph));
    zoom = z * (1 + 1.9 * close);
    anchor = { x: lerp(g.x, p.x, close), y: lerp(g.y, p.y, close) };
    fx = lerp(x, w * 0.5, close);
    fy = lerp(y, h * 0.47, close);
  }
  c.save();
  c.fillStyle = '#213a42';
  c.fillRect(0, 0, w, h);
  c.translate(fx, fy);
  c.scale(zoom, zoom);
  c.translate(-anchor.x, -anchor.y);
  drawField(c, w, h, f);
  c.restore();
  return (p) => {
    const v = fieldProject(w, h, p.x, p.y, p.z);
    return { x: fx + (v.x - anchor.x) * zoom, y: fy + (v.y - anchor.y) * zoom };
  };
}

function stroke(c, points, ink, width, dash = []) {
  if (!points.length) return;
  c.save();
  c.strokeStyle = ink;
  c.lineWidth = width;
  c.lineJoin = 'round';
  c.lineCap = 'round';
  c.setLineDash(dash);
  c.beginPath();
  points.forEach((p, i) => (i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y)));
  c.stroke();
  c.restore();
}
function circle(c, x, y, r, ink, width = 0) {
  c.beginPath();
  c.arc(x, y, Math.max(0.01, r), 0, Math.PI * 2);
  if (width) {
    c.strokeStyle = ink;
    c.lineWidth = width;
    c.stroke();
  } else {
    c.fillStyle = ink;
    c.fill();
  }
}
function polygon(c, pts, fill, edge, weight = 1.5) {
  c.beginPath();
  pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
  c.closePath();
  c.fillStyle = fill;
  c.fill();
  if (edge) {
    c.lineWidth = weight;
    c.strokeStyle = edge;
    c.stroke();
  }
}
function star(c, x, y, r) {
  polygon(
    c,
    [
      [x, y - r],
      [x + r * 0.34, y - r * 0.28],
      [x + r * 0.86, y],
      [x + r * 0.28, y + r * 0.26],
      [x, y + r],
      [x - r * 0.24, y + r * 0.27],
      [x - r * 0.86, y],
      [x - r * 0.28, y - r * 0.22],
    ],
    '#ffdf82',
    '#7e542f',
    1,
  );
}
function glove(c, x, y, size, side = 1, ghost = false) {
  c.save();
  c.translate(x, y);
  c.scale(size * (side || 1), size);
  c.rotate(0.39);
  const pts = [
    [-7, 7],
    [-10, 1],
    [-12, -2],
    [-11, -5],
    [-8, -4],
    [-5, -1],
    [-6, -9],
    [-5, -12],
    [-3, -12],
    [-1, -5],
    [0, -14],
    [3, -14],
    [4, -5],
    [6, -12],
    [9, -11],
    [8, -4],
    [11, -8],
    [13, -6],
    [11, -1],
    [8, 6],
    [4, 10],
    [-4, 11],
  ];
  if (ghost) {
    c.globalAlpha = 0.72;
    c.setLineDash([2.5, 2]);
  }
  polygon(c, pts, ghost ? '#1e424888' : '#ffd063', ghost ? '#f6edcc' : '#402e2c', 1.6);
  if (!ghost) {
    polygon(
      c,
      [
        [-4, 7],
        [5, 7],
        [4, 12],
        [-4, 12],
      ],
      '#55a390',
      '#294842',
      1,
    );
    stroke(
      c,
      [
        { x: -4, y: 0 },
        { x: 0, y: 4 },
        { x: 5, y: 3 },
      ],
      '#d89643',
      1.5,
    );
  }
  c.restore();
}
function brackets(c, p, r, known, pulse) {
  const scale = known ? 1 + 0.09 * pulse : 1,
    a = r * scale;
  c.save();
  c.translate(p.x, p.y);
  c.rotate(Math.PI / 4);
  const corners = [
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
  ];
  for (const [x, y] of corners) {
    const path = [
      { x: x * a * 0.52, y: y * a },
      { x: x * a, y: y * a },
      { x: x * a, y: y * a * 0.52 },
    ];
    stroke(c, path, '#112c35d8', known ? 5.5 : 3.5);
    stroke(c, path, known ? '#fff3bb' : '#f2eac79c', known ? 2.7 : 1.7);
  }
  c.restore();
  if (known) {
    circle(c, p.x, p.y, r * 0.25, '#13373d');
    circle(c, p.x, p.y, r * 0.15, '#fff2af');
  }
}

export function replayPaths(c, project, p, trial, time, width) {
  const t = Math.max(0, time),
    read = readTime(p, trial.circuit),
    move = trial.move;
  const trail = [];
  for (let i = 0; i <= 18; i++) trail.push(project(incoming(p, (CONTACT * t * i) / (18 * p.air))));
  stroke(c, trail, '#243436b8', 2.8);
  stroke(c, trail, '#fff3ca', 1.4, [3, 3]);
  if (!move || t < move.down) return;
  const now = Math.min(t, move.up);
  const correction = [];
  let side = 0;
  for (let i = 0; i <= 29; i++) {
    const sample = lerp(move.down, now, i / 29);
    side = move.declaredSide && sample >= move.chosenAt ? move.declaredSide : sample >= read ? p.side : 0;
    if (!side) continue;
    const held = directedHold(p, trial.circuit, move.down, sample, move.declaredSide, move.chosenAt);
    correction.push(project(aimPoint(p, trial.circuit, held, side)));
  }
  stroke(c, correction, '#292b25c7', 3.2);
  stroke(c, correction, '#ffbd4c', 1.8);
  if (side && t <= move.up && correction.length) {
    const tip = correction[correction.length - 1];
    glove(c, tip.x, tip.y, clamp(width * 0.0027, 0.35, 0.73), side);
  }
}

export function playInk(c, w, h, project, p, state) {
  const { circuit, time, holding, down, declared, move, phase, gripAge, ghost, post, reduced } = state;
  const seen = time >= readTime(p, circuit),
    side = declared || (seen ? p.side : 0);
  const size = clamp(Math.min(w, h) * 0.035, 12, 23);
  const goal = project({ x: p.x, y: p.y, z: LINE }),
    atOther = project({ x: -p.x, y: p.y, z: LINE });
  const ball = state.frame.ball;
  const b = project(ball);
  if (phase === 'flight') {
    brackets(c, goal, size, seen, reduced ? 0 : Math.sin(Math.max(0, time) * 12));
    if (!seen) brackets(c, atOther, size, false, 0);
    if (seen) {
      // A trail appears on the actual ball only once the goalkeeper reads the shot.
      const tail = project(state.prevBall);
      stroke(c, [tail, b], '#283a3a99', 5);
      stroke(c, [tail, b], '#ffdf9be0', 2.5);
    }
    if (!move) {
      const held = holding ? directedHold(p, circuit, down, time, declared, state.chosenAt) : 0.13;
      const sides = side ? [side] : [-1, 1];
      for (const s of sides) {
        const alpha = side ? 1 : 0.55;
        c.save();
        c.globalAlpha = alpha;
        const full = aimPoint(p, circuit, held, s),
          point = project(full);
        const target = project({ x: s * Math.abs(p.x), y: p.y, z: LINE });
        const start = project({ x: s * 0.52, y: 1.4, z: LINE });
        const path = [];
        for (let i = 0; i <= 22; i++) {
          const f = i / 22;
          path.push(project(aimPoint(p, circuit, held * f, s)));
        }
        stroke(c, [start, target], '#19353799', 2, [4, 6]);
        stroke(c, path, '#132f36c9', 4);
        stroke(c, path, holding ? '#ffd36a' : '#eddfb0', 2.3, holding ? [] : [3, 4]);
        if (holding) {
          glove(c, point.x, point.y, size * 0.057, s);
          star(c, point.x - size * 0.37, point.y + size * 0.68, size * 0.23);
        } else {
          star(c, point.x, point.y, size * 0.43);
        }
        c.restore();
      }
    }
  }
  if (ghost && phase !== 'run' && (time >= readTime(p, circuit) || phase !== 'flight')) {
    if (ghost.move && time >= ghost.move.up) {
      const a = gloveAt(p, 'clear', ghost.move, time),
        q = project(a);
      glove(c, q.x, q.y, size * 0.05, ghost.move.side, true);
    }
  }
  if (phase === 'grip') {
    const hand = state.frame.hand || ball,
      at = project(hand);
    const r = size * Math.max(0.24, 1 + (0.28 - clamp(gripAge, 0, GRIP_BEAT)) * 4.5);
    circle(c, at.x, at.y, r, '#1a333bbf', 5);
    circle(c, at.x, at.y, r, '#ffdc80', 2.6);
    circle(c, at.x, at.y, size, '#fff1be', 1.4);
  }
  if (phase === 'end' && post > 0.15 && post < 0.68 && state.result?.touches) {
    const q = project(state.frame.ball),
      fade = Math.sin((Math.PI * (post - 0.15)) / 0.53);
    c.save();
    c.globalAlpha = 0.8 * fade;
    for (let k = 0; k < 5; k++) {
      const a = k * 1.3 + 0.5,
        rr = size * (1.3 + post);
      stroke(
        c,
        [
          { x: q.x + Math.cos(a) * rr, y: q.y + Math.sin(a) * rr },
          { x: q.x + Math.cos(a) * (rr + size * 0.7), y: q.y + Math.sin(a) * (rr + size * 0.7) },
        ],
        '#ffe39a',
        2,
      );
    }
    c.restore();
  }
}

export function fibre(c, x, y, w, h, circuit, progress, stage = 'visual', large = false) {
  const damaged = (circuit === 'optic' && stage === 'visual') || (circuit === 'motor' && stage === 'motor');
  const cy = y + h * 0.54,
    r = Math.max(4, h * (large ? 0.15 : 0.115)),
    start = x + w * 0.075,
    end = x + w * 0.925,
    L = end - start;
  c.save();
  c.lineJoin = 'round';
  c.lineCap = 'round';
  stroke(
    c,
    [
      { x: start, y: cy + 1 },
      { x: end, y: cy + 1 },
    ],
    '#805f55',
    r * 0.78,
  );
  stroke(
    c,
    [
      { x: start, y: cy - 1 },
      { x: end, y: cy - 1 },
    ],
    '#dd9f79',
    r * 0.27,
  );
  const n = 7,
    step = L / n;
  for (let i = 0; i < n; i++) {
    const a = start + i * step + step * 0.13,
      b = start + (i + 1) * step - step * 0.08;
    if (damaged && i === 3) {
      const tip = a + (b - a) * 0.36;
      polygon(
        c,
        [
          [a, cy - r],
          [tip, cy - r],
          [tip - 3, cy - r * 0.36],
          [tip + 3, cy],
          [tip - 3, cy + r * 0.33],
          [tip + 1, cy + r],
          [a, cy + r],
        ],
        '#deb08d',
        '#684e48',
      );
      polygon(
        c,
        [
          [tip - 2, cy - r * 0.4],
          [tip + 3, cy - r * 1.85],
          [tip + 9, cy - r * 2.1],
          [tip + 5, cy - r * 0.7],
        ],
        '#f0c69a',
        '#79574d',
      );
      for (let j = 0; j < 2; j++)
        stroke(
          c,
          [
            { x: tip + 10 + j * 6, y: cy + r * 1.28 },
            { x: tip + 12 + j * 6, y: cy + r * 1.05 },
          ],
          '#df9f79',
          1.4,
        );
    } else {
      polygon(
        c,
        [
          [a, cy - r],
          [b - 3, cy - r * 0.98],
          [b, cy - r * 0.52],
          [b, cy + r * 0.62],
          [b - 3, cy + r],
          [a, cy + r],
          [a - 2, cy + r * 0.6],
          [a - 2, cy - r * 0.5],
        ],
        '#a2c3ab',
        '#4b746a',
        1,
      );
      for (let j = 1; j <= 3; j++) {
        const xx = a + ((b - a) * j) / 4;
        stroke(
          c,
          [
            { x: xx - 1, y: cy - r * 0.93 },
            { x: xx + 2, y: cy - r * 0.22 },
            { x: xx + 3, y: cy + r * 0.48 },
            { x: xx + 1, y: cy + r * 0.93 },
          ],
          '#699083',
          1.1,
        );
      }
    }
  }
  const t = clamp(progress),
    scaled = t * n,
    k = Math.min(n - 1, Math.floor(scaled)),
    u = scaled - k;
  const px = start + L * t,
    py = cy - r * (0.6 + 1.9 * Math.sin(Math.PI * u));
  const tail = [];
  for (let j = 0; j < 9; j++) {
    const f = clamp(t - j * 0.0038);
    tail.push({ x: start + L * f, y: cy - r * (0.6 + 1.9 * Math.sin(Math.PI * ((f * n) % 1))) });
  }
  stroke(c, tail, '#f8c75caa', 3);
  circle(c, px, py, r * 0.9, '#f8cf6533');
  star(c, px, py, Math.max(4, r * 0.76));
  c.restore();
}

export function signalProgress(p, circuit, time, stage) {
  if (stage === 'motor') {
    const a = clamp((time - readTime(p, circuit)) / (p.air - readTime(p, circuit)));
    return circuit === 'motor' ? hesitate(a) : a;
  }
  const relative = clamp(Math.max(0, time) / readTime(p, circuit));
  return circuit === 'optic' ? hesitate(relative) : relative;
}
function hesitate(t) {
  if (t < 0.29) return (t / 0.29) * 0.45;
  if (t < 0.73) return 0.45 + ((t - 0.29) / 0.44) * 0.08;
  return 0.53 + ((t - 0.73) / 0.27) * 0.47;
}
