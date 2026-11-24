// Cutaway beneath the pitch. The three inks belong to the central visual, motor
// and sensory circuits. All landing positions are supplied by the game model.
const STOCK = [
  {
    sky: '#152d3b', middle: '#215569', deep: '#102e3d', far: '#2b5864',
    motif: '#42727b', relief: '#1c4756', rim: '#87aba2', land: '#153847',
    fold: '#1e4b55', foldRim: '#416b6a', dark: '#1e5759', shade: '#438780',
    mid: '#78ad94', top: '#b0d1a6', light: '#e1e1b2', accent: '#d3c477',
    cord: '#ce8268', cordLight: '#edaa81', cordDark: '#804c53'
  },
  {
    sky: '#25283d', middle: '#465164', deep: '#243947', far: '#444758',
    motif: '#6d6476', relief: '#3b4054', rim: '#ad9b9e', land: '#263747',
    fold: '#364453', foldRim: '#656172', dark: '#815655', shade: '#ad715e',
    mid: '#ce8f70', top: '#e8b594', light: '#f1d3a9', accent: '#c1c991',
    cord: '#d89c68', cordLight: '#f0c084', cordDark: '#8a6558'
  },
  {
    sky: '#1b2c42', middle: '#345270', deep: '#173546', far: '#2b4b64',
    motif: '#526b85', relief: '#2a425e', rim: '#9caec0', land: '#1c354c',
    fold: '#2a455b', foldRim: '#52728a', dark: '#415974', shade: '#697e9b',
    mid: '#94a7bb', top: '#c1c6ca', light: '#e1d7c3', accent: '#a8c5a4',
    cord: '#cc886d', cordLight: '#ebb28d', cordDark: '#845861'
  }
];
const INK = '#182f36';
const SUN = '#ffe69b';
const TAU = Math.PI * 2;
const stores = new WeakMap();
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const lerp = (a, b, u) => a + (b - a) * u;

function surface(w, h) {
  const width = Math.max(1, Math.ceil(w));
  const height = Math.max(1, Math.ceil(h));
  if (typeof OffscreenCanvas === 'function') return new OffscreenCanvas(width, height);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function rng(seed) {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function polygon(ctx, points, fill) {
  ctx.beginPath();
  ctx.moveTo(points[0], points[1]);
  for (let i = 2; i < points.length; i += 2) ctx.lineTo(points[i], points[i + 1]);
  ctx.closePath();
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
}

function ellipse(ctx, x, y, rx, ry, color, rotation = 0) {
  ctx.beginPath();
  ctx.ellipse(x, y, Math.max(.01, rx), Math.max(.01, ry), rotation, 0, TAU);
  ctx.fillStyle = color;
  ctx.fill();
}

function stroke(ctx, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

function grainTile() {
  const canvas = surface(146, 146);
  const ctx = canvas.getContext('2d');
  const random = rng(271);
  for (let i = 0; i < 3600; i++) {
    const x = random() * 146;
    const y = random() * 146;
    ctx.fillStyle = i % 3 ? 'rgba(239,222,179,.17)' : 'rgba(1,20,33,.35)';
    ctx.fillRect(x, y, .4 + random() * 1.2, .5 + random() * .9);
  }
  ctx.lineCap = 'round';
  for (let i = 0; i < 140; i++) {
    const x = random() * 146;
    const y = random() * 146;
    const length = 1 + 5 * random();
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + length * .45, y - 1, x + length, y + random() * 1.6 - .8);
    stroke(ctx, i % 2 ? 'rgba(239,228,192,.22)' : 'rgba(7,32,37,.36)', .45);
  }
  return canvas;
}

// Embossed illustrations in the stock. They stay well behind the playable lane.
function eyePrint(c, p) {
  c.lineCap = 'round';
  c.lineJoin = 'round';
  c.beginPath();
  c.moveTo(-95, 4);
  c.bezierCurveTo(-62, -36, -31, -46, 1, -43);
  c.bezierCurveTo(39, -40, 65, -17, 87, 4);
  c.bezierCurveTo(52, 36, 22, 48, -5, 44);
  c.bezierCurveTo(-43, 44, -70, 24, -95, 4);
  c.fillStyle = p.relief;
  c.fill();
  stroke(c, p.motif, 3.0);
  c.beginPath();
  c.moveTo(-87, 3);
  c.bezierCurveTo(-45, -32, -26, -35, -6, -36);
  stroke(c, p.rim, 1.5);
  c.save();
  c.beginPath();
  c.ellipse(0, 1, 29, 34, -.14, 0, TAU);
  c.clip();
  ellipse(c, 0, 1, 29, 34, p.motif, -.14);
  for (let i = 0; i < 19; i++) {
    const a = i / 19 * TAU;
    c.beginPath();
    c.moveTo(Math.cos(a) * 16, Math.sin(a) * 19 + 1);
    c.lineTo(Math.cos(a + .10) * 25, Math.sin(a + .10) * 30 + 1);
    stroke(c, p.relief, i % 3 ? 1.7 : 3.2);
  }
  ellipse(c, -1, 1, 13, 17, p.relief, -.14);
  ellipse(c, -6, -7, 3.5, 3, p.rim);
  c.restore();
  // Bundles leaving the back of the eye suggest the optic nerve.
  for (let n = 0; n < 5; n++) {
    c.beginPath();
    c.moveTo(73 + n * 2.9, 9 - n * 2.0);
    c.bezierCurveTo(99, 12 + n * 4, 88 + n * 5, 46 + n * 1.5, 133 + n * 3, 41 + n * 4);
    stroke(c, n === 1 ? p.rim : p.motif, n === 1 ? 1.3 : 2.1);
  }
}

function foliaPrint(c, p) {
  c.lineCap = 'round';
  c.lineJoin = 'round';
  c.beginPath();
  c.moveTo(-94, 17);
  c.bezierCurveTo(-96, -4, -77, -40, -49, -46);
  c.bezierCurveTo(-34, -63, -7, -65, 7, -57);
  c.bezierCurveTo(30, -61, 56, -51, 65, -37);
  c.bezierCurveTo(96, -24, 96, -1, 85, 19);
  c.bezierCurveTo(78, 38, 53, 48, 30, 44);
  c.bezierCurveTo(5, 57, -15, 53, -29, 43);
  c.bezierCurveTo(-57, 49, -80, 36, -94, 17);
  c.closePath();
  c.fillStyle = p.relief;
  c.fill();
  stroke(c, p.motif, 3.6);
  c.save();
  c.clip();
  // Successive, narrow folia following the fan of the hemispheres.
  for (let i = 0; i < 12; i++) {
    const x = -79 + i * 14;
    const top = -42 - Math.sin((i + .5) / 12 * Math.PI) * 23;
    c.beginPath();
    c.moveTo(x - 9, top);
    c.bezierCurveTo(x - 14, -33, x - 30, 2, x + 6, 33);
    c.bezierCurveTo(x + 12, 39, x + 14, 42, x + 17, 48);
    stroke(c, p.motif, 3.0);
    c.beginPath();
    c.moveTo(x - 7.5, top + 2);
    c.bezierCurveTo(x - 11, -31, x - 26, 5, x + 6, 29);
    stroke(c, p.rim, 1.1);
  }
  c.restore();
  c.beginPath();
  c.moveTo(14, 48);
  c.quadraticCurveTo(19, 62, 42, 71);
  c.lineTo(58, 70);
  c.quadraticCurveTo(43, 57, 43, 45);
  c.fillStyle = p.motif;
  c.fill();
}

function tractPrint(c, p) {
  c.lineCap = 'round';
  c.lineJoin = 'round';
  // Cross-section of a cord, with its butterfly-shaped gray matter and paired tracts.
  c.beginPath();
  c.moveTo(-3, -41);
  c.bezierCurveTo(-42, -64, -82, -34, -80, 6);
  c.bezierCurveTo(-76, 47, -42, 53, -4, 44);
  c.bezierCurveTo(39, 56, 79, 39, 81, 3);
  c.bezierCurveTo(84, -32, 42, -63, -3, -41);
  c.fillStyle = p.relief;
  c.fill();
  stroke(c, p.motif, 3.4);
  c.beginPath();
  c.moveTo(0, -5);
  c.bezierCurveTo(-13, -4, -29, -31, -34, -28);
  c.bezierCurveTo(-47, -22, -30, -6, -25, 2);
  c.bezierCurveTo(-27, 7, -44, 17, -42, 23);
  c.bezierCurveTo(-33, 33, -13, 21, -3, 9);
  c.bezierCurveTo(8, 14, 26, 33, 39, 22);
  c.bezierCurveTo(39, 13, 27, 9, 24, 3);
  c.bezierCurveTo(33, -8, 43, -22, 34, -28);
  c.bezierCurveTo(25, -25, 16, -10, 0, -5);
  c.fillStyle = p.motif;
  c.fill();
  ellipse(c, -2, 3, 4, 3.7, p.relief);
  for (const side of [-1, 1]) {
    for (let i = 0; i < 4; i++) {
      c.beginPath();
      c.moveTo(side * (73 + i), 12 - i * 5);
      c.bezierCurveTo(side * 96, 18 - i * 4, side * 87, 38 - i * 2, side * 116, 50 - i * 3);
      stroke(c, p.motif, 2.4);
      ellipse(c, side * (11 + i * 5), -20 - i * 2.1, 1.1 + i * .17, 2.3, p.rim, side * .45);
    }
  }
}

const prints = [eyePrint, foliaPrint, tractPrint];

function background(w, h, stage, grain) {
  const density = Math.min(1.3, 1500 / w, 1100 / h);
  const canvas = surface(w * density, h * density);
  const c = canvas.getContext('2d');
  c.scale(canvas.width / w, canvas.height / h);
  const p = STOCK[stage];
  const grad = c.createLinearGradient(0, 0, .24 * w, h);
  grad.addColorStop(0, p.sky);
  grad.addColorStop(.59, p.middle);
  grad.addColorStop(1, p.deep);
  c.fillStyle = grad;
  c.fillRect(0, 0, w, h);

  // Broad folded sheets cast tinted shadows along the back of the cutaway.
  c.save();
  c.scale(w, h);
  polygon(c, [-.02, .17, .27, .04, .46, -.02, -.02, -.02], p.relief);
  polygon(c, [-.02, .18, .27, .043, .36, .012, .04, .182, -.02, .208], p.far);
  polygon(c, [.34, 1.02, .54, .83, .89, .5, 1.02, .44, 1.02, 1.02], p.relief);
  polygon(c, [.71, 1.02, .87, .81, 1.02, .70, 1.02, 1.02], p.far);
  c.restore();

  // Printed contour bundles, brightest at the outer cut to preserve the flight window.
  c.save();
  c.lineCap = 'round';
  c.globalAlpha = .55;
  for (let row = 0; row < 11; row++) {
    c.beginPath();
    const t = row / 11;
    c.moveTo(-.035 * w, (.58 + .27 * t) * h);
    c.bezierCurveTo(.12 * w, (.48 + .35 * t) * h, .12 * w, (.17 + .26 * t) * h, .30 * w, (.21 + .15 * t) * h);
    c.bezierCurveTo(.47 * w, (.22 + .10 * t) * h, .48 * w, (.08 + .12 * t) * h, .65 * w, (-.075 + .12 * t) * h);
    stroke(c, row === 7 ? p.motif : p.far, Math.max(.8, h * (row === 7 ? .003 : .0017)));
  }
  c.restore();

  const impression = Math.min(w * .00138, h * .0022);
  c.save();
  c.translate(.17 * w, .355 * h);
  c.rotate(-.074);
  c.scale(impression, impression);
  c.globalAlpha = .78;
  prints[stage](c, p);
  c.restore();

  const random = rng(74 + 631 * stage);
  c.save();
  c.fillStyle = p.motif;
  for (let l = 0; l < 7; l++) {
    const x0 = random() * w;
    const y0 = (.18 + .75 * random()) * h;
    if (x0 > .27 * w && x0 < .84 * w && y0 > .2 * h && y0 < .65 * h) continue;
    const dist = Math.max(4.5, Math.min(w, h) * .012);
    c.globalAlpha = .24;
    for (let j = 0; j < 5; j++) {
      for (let i = 0; i < 8 - j; i++) {
        const x = x0 + (i + (j % 2) * .5) * dist;
        const y = y0 + j * dist * .80;
        ellipse(c, x, y, dist * .19, dist * .14, p.motif);
      }
    }
  }
  c.restore();

  // Low sheets echo the layered edge of the grass on the opposite face.
  for (let layer = 0; layer < 3; layer++) {
    const y = (.79 + layer * .079) * h;
    c.beginPath();
    c.moveTo(-.02 * w, y);
    c.bezierCurveTo(.2 * w, y - h * .026, .24 * w, y + h * .095, .47 * w, y + h * .038);
    c.bezierCurveTo(.67 * w, y - h * .024, .83 * w, y + h * .059, 1.02 * w, y - h * .015);
    c.lineTo(1.02 * w, h * 1.04);
    c.lineTo(-.02 * w, h * 1.04);
    c.closePath();
    c.save();
    c.shadowColor = 'rgba(5,24,39,.60)';
    c.shadowBlur = h * .013;
    c.shadowOffsetY = h * .013;
    c.fillStyle = layer % 2 ? p.land : p.fold;
    c.fill();
    c.restore();
    c.strokeStyle = layer === 2 ? p.relief : p.foldRim;
    c.lineWidth = Math.max(.7, h * .0018);
    c.stroke();
  }

  const pattern = c.createPattern(grain, 'repeat');
  c.globalAlpha = .40;
  c.fillStyle = pattern;
  c.fillRect(0, 0, w, h);
  c.globalAlpha = 1;
  return canvas;
}

function coilOutline(c, length, r) {
  c.beginPath();
  c.moveTo(0, -r);
  c.bezierCurveTo(length * .28, -r * 1.06, length * .54, -r * .94, length, -r);
  c.bezierCurveTo(length + r * .49, -r * .98, length + r * .50, r * .95, length, r);
  c.bezierCurveTo(length * .71, r * 1.045, length * .25, r * 1.02, 0, r);
  c.bezierCurveTo(-r * .48, r * .97, -r * .48, -r * .97, 0, -r);
  c.closePath();
}

function inflammation(c, x, y, r, turn) {
  c.save();
  c.translate(x, y);
  c.rotate(turn);
  c.beginPath();
  for (let i = 0; i <= 48; i++) {
    const a = TAU * i / 48;
    const radius = r * (1 + .11 * Math.cos(a * 6) + .07 * Math.cos(a * 3 + .7));
    const px = Math.cos(a) * radius;
    const py = Math.sin(a) * radius * .83;
    if (i === 0) c.moveTo(px, py);
    else c.lineTo(px, py);
  }
  c.closePath();
  c.fillStyle = '#ac685c';
  c.fill();
  stroke(c, '#70485a', r * .13);
  ellipse(c, -r * .15, -r * .06, r * .48, r * .38, '#d79270', -.45);
  ellipse(c, r * .2, r * .12, r * .27, r * .21, '#895968', -.20);
  c.restore();
}

function frayedTape(c, x, y, length, r, p) {
  // Outside-to-inside faces of a loose piece of the same membrane.
  c.save();
  c.translate(x, y);
  c.beginPath();
  c.moveTo(-r * .37, r * .64);
  c.bezierCurveTo(r * .51, -r * .11, length * .23, -r * .91, length * .47, -r * .64);
  c.bezierCurveTo(length * .63, -r * .46, length * .70, -r * .04, length, -r * .56);
  c.lineTo(length - r * .13, -r * .17);
  c.lineTo(length + r * .07, -r * .21);
  c.bezierCurveTo(length * .79, r * .28, length * .58, r * .11, length * .45, -r * .08);
  c.bezierCurveTo(length * .24, -r * .29, length * .20, r * .43, 0, r * .82);
  c.closePath();
  c.fillStyle = p.shade;
  c.fill();
  stroke(c, p.dark, Math.max(1, .06 * r));
  c.beginPath();
  c.moveTo(-r * .24, r * .66);
  c.bezierCurveTo(r * .43, .03 * r, length * .23, -r * .78, length * .45, -r * .57);
  stroke(c, p.light, r * .07);
  c.beginPath();
  c.moveTo(length * .46, -r * .55);
  c.bezierCurveTo(length * .61, -r * .40, length * .73, 0, length * .89, -r * .23);
  stroke(c, p.accent, r * .12);
  c.restore();
}

// Print a rolled jacket once. A small set of aspect ratios keeps the end grain
// round as a node moves a few pixels or the view rolls on to the next fibre.
function sleevePrint(stage, ratio, damage, variant, grain) {
  const r = 38;
  const len = r * ratio;
  const extraX = .58 * r;
  const top = r * 2.82;
  const cvs = surface(len + 2 * extraX, r * 5.4);
  const c = cvs.getContext('2d');
  const p = STOCK[stage];
  const random = rng(888 + variant * 19 + stage * 256);
  c.translate(extraX, top);
  c.lineJoin = 'round';
  c.lineCap = 'round';
  coilOutline(c, len, r);
  c.fillStyle = p.shade;
  c.fill();
  stroke(c, INK, 2.7);
  c.save();
  c.clip();
  // Three broad values model the facets of a tightly rolled length of card.
  c.beginPath();
  c.moveTo(-r * .5, -r * 1.1);
  c.lineTo(len + r * .5, -r * 1.1);
  c.lineTo(len + r * .5, -r * .55);
  c.bezierCurveTo(len * .68, -r * .28, len * .34, -r * .57, -r * .5, -r * .36);
  c.closePath();
  c.fillStyle = p.top;
  c.fill();
  c.beginPath();
  c.moveTo(-r * .8, -r * .45);
  c.bezierCurveTo(len * .38, -r * .6, len * .74, -r * .30, len + r * .55, -r * .56);
  c.lineTo(len + r * .55, r * .37);
  c.bezierCurveTo(len * .66, r * .50, len * .31, r * .24, -r * .5, r * .51);
  c.closePath();
  c.fillStyle = p.mid;
  c.fill();
  c.beginPath();
  c.moveTo(-r * .5, .78 * r);
  c.bezierCurveTo(len * .29, r * .62, len * .64, r * .91, len + r * .6, r * .68);
  c.lineTo(len + r, r * 1.3);
  c.lineTo(-r, r * 1.3);
  c.closePath();
  c.fillStyle = p.dark;
  c.fill();

  const bands = clamp(Math.round(ratio / 1.6), 2, 10);
  const period = len / bands;
  for (let i = -1; i <= bands; i++) {
    const x = i * period;
    const skew = r * (.37 + .13 * random());
    const seam = (n) => {
      c.beginPath();
      c.moveTo(x - skew + n, -r * 1.08);
      c.bezierCurveTo(x - r * .1 + n, -r * .54, x + skew * 1.45 + n, r * .57, x + skew * .60 + n, r * 1.09);
    };
    seam(2.7);
    stroke(c, p.dark, 4.2);
    seam(-1.8);
    stroke(c, p.light, 3.1);
    // Raised folds catch warm light on one side.
    c.save();
    c.globalAlpha = .53;
    seam(9.3);
    stroke(c, p.shade, 3.6);
    c.restore();
    // Short purposeful printed marks follow the wrap rather than the screen.
    for (let n = 0; n < 3; n++) {
      const mx = x + period * (.40 + .08 * n);
      const my = r * (.035 + .115 * n);
      c.beginPath();
      c.moveTo(mx - r * .10, my - r * .09);
      c.lineTo(mx + r * .014, my + r * .05);
      stroke(c, p.top, 2.1);
    }
    c.beginPath();
    c.moveTo(x + period * .34, -r * .76);
    c.lineTo(x + period * .69, -r * .77);
    stroke(c, p.light, 2.2);
  }
  c.globalAlpha = .55;
  c.fillStyle = c.createPattern(grain, 'repeat');
  c.fillRect(-r, -r * 1.07, len + 2 * r, 2.2 * r);
  c.restore();
  // The visible cut face shows the insulation as several turns around the core.
  const face = len - .045 * r;
  const rings = [
    [1, .395, p.dark], [.953, .371, p.light], [.867, .337, p.shade],
    [.773, .295, p.top], [.676, .260, p.shade], [.585, .221, p.light],
    [.49, .184, p.dark], [.37, .147, p.cordDark], [.27, .105, p.cordLight]
  ];
  for (const [ry, rx, color] of rings) ellipse(c, face + r * (.10 - rx * .20), r * .025, r * rx, r * ry, color, -.012);
  c.beginPath();
  c.moveTo(r * .03, -r * .97);
  c.bezierCurveTo(len * .36, -r * 1.03, len * .57, -r * .95, len - r * .08, -r * .97);
  stroke(c, p.light, 2.2);
  if (damage) {
    // Remove a patch of insulation and reveal the unbroken axon below the sprite.
    const a = len * .40;
    const b = len * .66;
    const start = [a - .30 * r, -r * 1.18, a + .09 * r, -r * .71, a - .13 * r, -.49 * r, a + .19 * r, -.10 * r, a + .02 * r, .19 * r, a + .25 * r, .57 * r, a + .03 * r, r * 1.18];
    const end = [b + .15 * r, r * 1.18, b - .14 * r, .69 * r, b + .10 * r, .44 * r, b - .16 * r, .05 * r, b + .07 * r, -.26 * r, b - .20 * r, -.66 * r, b + .04 * r, -r * 1.18];
    c.save();
    c.globalCompositeOperation = 'destination-out';
    polygon(c, [...start, ...end], '#111');
    c.restore();
    // Edge ink restricted to the insulation: the same shape can never mark the axon.
    c.save();
    c.globalCompositeOperation = 'source-atop';
    for (const edge of [start, end]) {
      c.beginPath();
      c.moveTo(edge[0], edge[1]);
      for (let i = 2; i < edge.length; i += 2) c.lineTo(edge[i], edge[i + 1]);
      stroke(c, '#f0c292', 5.4);
    }
    c.restore();
    frayedTape(c, a - r * .27, -r * .8, Math.min(r * 2.1, (b - a) * 1.20), r * .83, p);
    inflammation(c, a + (b - a) * .62, r * 1.34, r * .48, -.21);
    inflammation(c, a + (b - a) * .32, r * 1.64, r * .24, .76);
  }
  return { canvas: cvs, extraX, top, length: len, radius: r };
}

function cachedSleeve(store, stage, ratio, damage, variant) {
  const index = clamp(Math.round(ratio * 2), 3, 66);
  const key = [stage, index, damage ? 1 : 0, variant].join('-');
  let sprite = store.sleeves.get(key);
  if (!sprite) {
    sprite = sleevePrint(stage, index * .5, damage, variant, store.grain);
    // Rotation and resize should not reserve an unbounded number of texture prints.
    if (store.sleeves.size >= 42) store.sleeves.delete(store.sleeves.keys().next().value);
    store.sleeves.set(key, sprite);
  }
  return sprite;
}

function drawSleeve(c, start, end, centerY, radius, stage, damage, variant, store) {
  const y0 = centerY(start);
  const y1 = centerY(end);
  const len = Math.hypot(end - start, y1 - y0);
  if (len < radius * .5) return;
  const sprite = cachedSleeve(store, stage, len / radius, damage, variant);
  const sx = len / sprite.length;
  const sy = radius / sprite.radius;
  c.save();
  c.translate(start, y0);
  c.rotate(Math.atan2(y1 - y0, end - start));
  c.drawImage(sprite.canvas, -sprite.extraX * sx, -sprite.top * sy, sprite.canvas.width * sx, sprite.canvas.height * sy);
  c.restore();
}

function levelAt(x, launch, target, fromY, toY) {
  // Extend the cable past the playable pair without diverging at narrow aspect ratios.
  return lerp(fromY, toY, clamp((x - launch) / Math.max(1, target - launch), -.52, 1.52));
}

function ribbonCord(c, w, centerY, r, p) {
  c.save();
  c.lineCap = 'round';
  c.lineJoin = 'round';
  const track = (dy) => {
    c.beginPath();
    for (let i = 0; i <= 28; i++) {
      const x = (i / 28 * 1.24 - .12) * w;
      const y = centerY(x) + dy;
      if (i === 0) c.moveTo(x, y);
      else c.lineTo(x, y);
    }
  };
  track(r * 1.15);
  stroke(c, 'rgba(5,26,38,.22)', r * 1.41);
  track(r * .98);
  stroke(c, 'rgba(7,35,46,.62)', r * .87);
  track(r * .10);
  stroke(c, p.cordDark, r * .79);
  track(0);
  stroke(c, p.cord, r * .62);
  track(-r * .17);
  stroke(c, p.cordLight, r * .15);
  c.restore();
}

function nodeTarget(c, x, y, halfWidth, r, time, feedback, quality) {
  // The upright clamp points at exposed axolemma. The inner marks are its actual
  // perfect window. Truncated marks and shape remain readable without colour.
  const floor = y + r * .17;
  const bracketH = Math.max(6, r * .31);
  const thick = clamp(r * .075, 1.6, 3.2);
  c.save();
  c.lineCap = 'round';
  c.lineJoin = 'round';
  for (const s of [-1, 1]) {
    const side = x + halfWidth * s;
    c.beginPath();
    c.moveTo(side - s * r * .17, floor);
    c.lineTo(side, floor);
    c.lineTo(side, floor - bracketH);
    stroke(c, INK, thick * 2.46);
    stroke(c, '#ffe5a2', thick);
  }
  // Little double pennant is the only stationary target above the wire.
  const dy = (Math.sin(time * 4) * .035 - 1.10) * r;
  const sz = Math.max(5, Math.min(r * .33, halfWidth * .74));
  c.save();
  c.translate(x, y + dy);
  polygon(c, [-sz, -sz * .49, 0, sz * .08, sz, -sz * .49, sz, .01 * sz, 0, sz * .72, -sz, sz * .015], '#253c41');
  c.translate(0, -thick * .58);
  polygon(c, [-sz, -sz * .49, 0, sz * .08, sz, -sz * .49, sz, .01 * sz, 0, sz * .72, -sz, sz * .015], SUN);
  c.restore();

  if (feedback > 0 && quality > .47) {
    c.globalAlpha = clamp(feedback, 0, 1);
    const spread = (1 - feedback) * r * .37;
    for (let i = 0; i < 6; i++) {
      const a = Math.PI * (1.12 + i * .155);
      const radius = r * .86 + spread;
      c.beginPath();
      c.moveTo(x + Math.cos(a) * radius, y + Math.sin(a) * radius);
      c.lineTo(x + Math.cos(a) * (radius + r * .20), y + Math.sin(a) * (radius + r * .20));
      stroke(c, SUN, thick);
    }
  }
  c.restore();
}

function trajectory(c, x0, y0, x1, y1, height, r, held) {
  const controlY = (y0 + y1) * .5 - 2 * height;
  const cx = (x0 + x1) / 2;
  const thickness = clamp(r * .064, 1.65, 2.9);
  c.save();
  c.lineCap = 'round';
  c.beginPath();
  c.moveTo(x0, y0);
  c.quadraticCurveTo(cx, controlY, x1, y1);
  stroke(c, held ? 'rgba(17,44,49,.84)' : 'rgba(16,40,48,.67)', thickness * 2.70);
  c.setLineDash(held ? [r * .32, r * .19] : [r * .20, r * .24]);
  stroke(c, held ? '#ffe6a1' : '#e3dcc0', thickness);
  c.setLineDash([]);
  // A hollow projected landing and the solid live spark are deliberately different.
  c.beginPath();
  c.ellipse(x1, y1, r * .34, r * .15, 0, 0, TAU);
  stroke(c, '#193a44', thickness * 2.25);
  stroke(c, held ? SUN : '#e3dcc0', thickness);
  c.restore();
}

function spark(c, x, y, r, time, airborne, holding) {
  const size = r * (holding ? .55 : .49);
  // A folded diamond rides inside a five-point comet. Cream is restricted to its leading edge.
  c.save();
  c.translate(x, y);
  const angle = Math.sin(time * 4.5) * (holding ? .025 : .045);
  c.rotate(angle);
  const speed = airborne ? 1.18 : .80;
  const tail = (n, dy, width, color) => {
    c.beginPath();
    c.moveTo(-size * .26, dy - width);
    c.quadraticCurveTo(-size * n * .65, dy - width, -size * n * speed, dy + width * .65);
    c.quadraticCurveTo(-size * .95, dy + width * .57, -size * .2, dy + width);
    c.fillStyle = color;
    c.fill();
  };
  tail(2.68, size * .23, size * .105, '#d78c52');
  tail(2.17, -size * .07, size * .14, '#e8b35b');
  tail(1.65, -size * .34, size * .095, '#f6d983');
  const points = [
    -.52 * size, -.30 * size, -.48 * size, -.95 * size, -.08 * size, -.61 * size,
    .17 * size, -1.23 * size, .38 * size, -.29 * size, 1.03 * size, -.23 * size,
    .56 * size, .21 * size, .71 * size, .80 * size, .11 * size, .57 * size,
    -.18 * size, 1.04 * size, -.40 * size, .39 * size, -1.04 * size, .27 * size
  ];
  c.save();
  c.translate(size * .08, size * .13);
  polygon(c, points, '#715749');
  c.restore();
  polygon(c, points, '#f7bd58');
  stroke(c, '#674b36', Math.max(.9, size * .085));
  polygon(c, [0, -.28 * size, .17 * size, -1.05 * size, .38 * size, -.28 * size, .92 * size, -.22 * size, .37 * size, .035 * size, .14 * size, .16 * size], '#fff0b0');
  polygon(c, [-.66 * size, .18 * size, .06 * size, -.28 * size, .36 * size, .01 * size, -.13 * size, .48 * size], '#ffe295');
  c.restore();
}

/** Draws the optic, motor or central touch circuit. The caller owns time and input.
 * All supplied coordinates and arcHeight are fractions of the actual canvas.
 */
export function drawNerve(ctx, width, height, frame = {}) {
  if (!(width > 1 && height > 1)) return;
  let store = stores.get(ctx);
  if (!store) {
    store = { grain: grainTile(), sleeves: new Map(), background: null, backdropKey: '' };
    stores.set(ctx, store);
  }
  const stage = clamp(frame.stage | 0, 0, 2);
  const day = frame.day | 0;
  const time = Number.isFinite(frame.time) ? frame.time : 0;
  const launch = (frame.launchX ?? .23) * width;
  const target = (frame.targetX ?? .71) * width;
  const fromY = (frame.launchY ?? .68) * height;
  const toY = (frame.targetY ?? .68) * height;
  const r = clamp(Math.min(width * .068, height * .068), 6, 54);
  const perfect = Math.max(2, (frame.targetRadius ?? .032) * width);
  const centerY = (x) => levelAt(x, launch, target, fromY, toY) + r * .27;
  const span = Math.max(r * 2.3, target - launch);
  const gap = Math.max(perfect * 1.06, r * .84);
  const p = STOCK[stage];
  const key = [stage, Math.round(width), Math.round(height)].join('/');
  if (store.backdropKey !== key) {
    store.background = background(width, height, stage, store.grain);
    store.backdropKey = key;
  }

  ctx.save();
  // The far sheet moves less than the live current. Its small overscan keeps
  // the paper continuous during a running approach, a jump and a replay.
  const drift = clamp(frame.travel ?? 0, 0, 1);
  const bleed = width * .014;
  ctx.drawImage(store.background, -bleed * (.25 + .7 * drift), 0, width + bleed, height);
  ribbonCord(ctx, width, centerY, r, p);
  const injured = (day === 1 && stage === 0) || (day === 2 && stage === 1);
  const startId = Math.floor((-r * 2 - launch) / span);
  const endId = Math.ceil((width + r * 2 - launch) / span);
  for (let id = startId; id < endId; id++) {
    const start = launch + id * span + gap;
    const end = launch + (id + 1) * span - gap;
    drawSleeve(ctx, start, end, centerY, r, stage, injured && id === 0, Math.abs(id) % 3, store);
  }
  nodeTarget(ctx, target, toY, perfect, r, time, frame.feedback ?? 0, frame.quality ?? 0);
  if (frame.prediction !== false) {
    trajectory(ctx, launch, fromY, (frame.landingX ?? .55) * width, (frame.landingY ?? frame.targetY ?? .68) * height, (frame.arcHeight ?? .24) * height, r, frame.holding);
  }
  spark(ctx, (frame.sparkX ?? frame.launchX ?? .23) * width, (frame.sparkY ?? frame.launchY ?? .68) * height, r, time, frame.prediction === false, frame.holding);
  ctx.restore();
}
