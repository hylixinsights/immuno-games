// Usage: node impossible-save-season.cjs <game URL or JOGAR.html file URL>
// Set CHROME_BIN to use an installed Chrome instead of Playwright's Chromium.
const assert = require('node:assert/strict');
const { chromium } = require('playwright');

const url = new URL(process.argv[2]);
url.hash = 'test';

function installClock() {
  // Advance the real game loop in bounded steps. Inputs still go through the
  // browser, and neither the season state nor the random shots are overridden.
  let now = performance.now();
  const frames = [];
  performance.now = () => now;
  window.requestAnimationFrame = callback => frames.push(callback);
  window.framesUntil = (condition, step = 100) => {
    for (let count = 0; count < 1200; count++) {
      if (condition()) return;
      now += step;
      for (const callback of frames.splice(0)) callback(now);
    }
    throw new Error('Game clock timed out in ' + document.body.dataset.mode);
  };
}

async function playKick(page, aim) {
  for (;;) {
    const mode = await page.evaluate(() => {
      framesUntil(() => ['result', 'surf'].includes(__game.S.mode));
      return __game.S.mode;
    });
    if (mode === 'result') return;
    if (aim) {
      await page.keyboard.down('Space');
      await page.evaluate(() => framesUntil(() => __game.aligned(), 10));
      await page.keyboard.up('Space');
    } else {
      await page.evaluate(() => framesUntil(() => __game.S.mode !== 'surf'));
    }
  }
}

async function holdBarrier(page) {
  for (;;) {
    const mode = await page.evaluate(() => {
      const { S, wave } = __game;
      framesUntil(() => S.mode !== 'gate' || (wave.charges > 0 && wave.cells.some(
        cell => ['flow', 'dock'].includes(cell.state) && cell.x > 0,
      )), 30);
      return S.mode;
    });
    if (mode !== 'gate') return;
    await page.keyboard.press('Space');
  }
}

async function testTouchFeedback(page) {
  const points = await page.evaluate(() => {
    const { wave } = __game;
    framesUntil(() => wave.cells.some(cell => cell.state === 'flow' && cell.x > 55), 35);
    const cell = wave.cells.find(cell => cell.state === 'flow' && cell.x > 55);
    const rect = document.querySelector('#neural').getBoundingClientRect();
    const { s, top, width } = __game.view();
    const point = (x, y) => [rect.left + x * s, rect.top + top + y * s];
    return { hit: point(cell.x, cell.y), miss: point(width / 2, 165) };
  });
  const hint = page.locator('#liveHint');
  const counts = page.locator('#matchBar > b');
  await page.touchscreen.tap(...points.miss);
  assert.match(await hint.innerText(), /Errou o alvo/);
  await page.touchscreen.tap(...points.hit);
  assert.match(await hint.innerText(), /Natalizumabe na α4/);
  assert.equal(await counts.innerText(), 'Bloqueados 1 · Entraram 0');
  await page.touchscreen.tap(...points.miss);
  assert.match(await hint.innerText(), /Sem cargas/);
  await page.evaluate(() => framesUntil(() => __game.wave.charges > 0, 30));
  assert.doesNotMatch(await hint.innerText(), /Sem cargas/);
  await page.evaluate(() => framesUntil(() => __game.wave.entered > 0, 30));
  assert.match(await hint.innerText(), /atravessou a barreira/);
  assert.equal(await counts.innerText(), 'Bloqueados 1 · Entraram 1');
}

async function runSeason(browser, locale, aim) {
  const page = await browser.newPage({
    locale, viewport: aim ? { width: 1100, height: 740 } : { width: 390, height: 844 },
    hasTouch: !aim, isMobile: !aim,
  });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  try {
    await page.addInitScript(installClock);
    await page.goto(url.href);
    await page.waitForFunction(() => window.__game, null, { polling: 30, timeout: 10000 });
    assert.equal(await page.locator('html').getAttribute('lang'), aim ? 'en' : 'pt-BR');
    // Force skips the two real-time animation frames Playwright normally waits
    // for before clicking. Coordinate hit testing and native input still apply.
    const click = selector => page.locator(selector).click({ force: true });
    await click('#startBtn');
    for (let kick = 1; kick <= 5; kick++) {
      if (kick > 1) {
        await click('#result [data-a="new"]');
        assert.equal(await page.locator('body').getAttribute('data-mode'), 'gate');
        if (kick >= 3 && aim) await holdBarrier(page);
        if (kick === 3 && !aim) await testTouchFeedback(page);
        await page.evaluate(() => framesUntil(() => __game.S.mode === 'gateEnd'));
        if (kick === 2) {
          assert.match(await page.locator('#liveHint').innerText(), /optic nerve|nervo óptico/i);
          assert.equal(await page.evaluate(() => __game.season.optic), 2);
        }
      }
      await playKick(page, aim);
      assert.equal(await page.evaluate(() => __game.S.slot + 1), kick);
    }
    const state = await page.evaluate(() => ({
      repaired: __game.season.repaired,
      saves: __game.S.daySaves[3].filter(Boolean).length,
      perfect: __game.S.marks.every(mark => mark.perfect),
    }));
    assert.ok(aim ? state.repaired > 0 : state.repaired === 0, JSON.stringify(state));
    assert.ok(aim ? state.saves >= 3 && state.perfect : state.saves === 0, JSON.stringify(state));
    if (aim) {
      await page.evaluate(() => framesUntil(() => __game.S.age > 0.6));
      await page.keyboard.press('Space');
    } else {
      await click('#result [data-a="seasonEnd"]');
    }
    const dialog = page.locator('dialog[open]');
    assert.equal(await dialog.locator('h2').textContent(), aim ? 'Joana’s season' : 'A temporada de Joana');
    const summary = await dialog.textContent();
    assert.match(summary, aim ? /Season won!/ : /Fim da temporada/);
    assert.match(summary, aim ? /grew back this season/ : /permaneceu sem reparo/);
    assert.match(summary, aim ? /varies from lesion to lesion/ : /varia de uma lesão para outra/);
    assert.deepEqual(errors, []);
    console.log(locale, state.saves + '/5 saves, rounds with repair:', state.repaired);
  } finally {
    await page.close();
  }
}

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_BIN,
    args: ['--disable-webgl', '--mute-audio'],
  });
  try {
    await runSeason(browser, 'pt-BR', false);
    await runSeason(browser, 'en-US', true);
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
