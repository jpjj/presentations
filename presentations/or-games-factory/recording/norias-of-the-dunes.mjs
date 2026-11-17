#!/usr/bin/env node
/** Norias of the Dunes: the two clips for the deck (see README.md). */
import { fail, openGame, recordComparison, revealUpTo, titleAndStart } from "./lib/game.mjs";

const GAME = "norias-of-the-dunes", PROVED = /proved the optimum/;
const g = await openGame(GAME, "__nd", "world.stage");
const { page, sim, rec, real, press, text } = g;
try {
  const at = (r, c) => page.evaluate(([r, c]) => window.__nd.world.screenOf(r, c), [r, c]);
  const settle = () => page.waitForFunction("!window.__nd.busy()", null, { timeout: 60000, polling: 100 });
  const st = () => page.evaluate(() => { const s = window.__nd.state, b = s.board; return { phase: s.phase, idx: s.idx, n: b.norias.length, watered: b.watered() }; });
  const solve = (k) => page.evaluate((k) => window.__nd.solveLevel(k).then((r) => ({ status: r.status, covered: r.covered, chosen: r.chosen.map((c) => [...c]) })), k);
  const levels = await page.evaluate(() => window.__nd.LEVELS.map((L) => ({ norias: L.norias, opt: L.opt, trees: L.trees, rocks: L.rocks, cols: L.cols, rows: L.rows })));
  const tapWheel = async (r, c, sec) => { const p = await at(r, c); await rec.tap(p.x, p.y, sec); };

  // ---- clip 1 · title, start, the first wheels of oasis 1 -------------------------------------
  await titleAndStart(g);
  await settle();
  await real(700);
  await rec.hold(1.2);
  const first = await solve(0);
  if (first.status !== "OPTIMAL") fail("oasis 1: solver status " + first.status);
  for (const [r, c] of first.chosen) { await tapWheel(r, c, 0.7); await rec.hold(1.4); }
  await rec.finger(false);
  await rec.hold(0.8);
  await rec.cut(`${GAME}-start`, 0.05);
  if ((await st()).watered !== levels[0].opt) fail("oasis 1 was not finished at its optimum");

  // ---- oases 1–4: on to the last one, unrecorded -----------------------------------------------
  const next = async () => { await page.click("#nextBtn"); await settle(); await sim(0.8); };
  await next();
  for (let k = 1; k <= 3; k++) {
    const res = await solve(k);
    for (const [r, c] of res.chosen) { const p = await at(r, c); await page.mouse.click(p.x, p.y); await sim(0.35); }
    await sim(1.2);
    if ((await st()).watered !== levels[k].opt) fail(`oasis ${k + 1}: did not reach the optimum`);
    await next();
  }

  // ---- oasis 5, the obvious way: every wheel where it waters the most palms that are still dry ---
  const L = levels[4];
  const blocked = new Set([...L.trees, ...L.rocks].map(([r, c]) => r + "-" + c));
  const reach = (r, c, tr, tc) => (r - tr) ** 2 + (c - tc) ** 2 <= 2.5 * 2.5 + 1e-9;
  const wet = new Set(), greedy = [];
  for (let n = 0; n < L.norias; n++) {
    let best = -1, gain = [], cell = null;
    for (let r = 0; r < L.rows; r++) for (let c = 0; c < L.cols; c++) {
      if (blocked.has(r + "-" + c) || greedy.some(([a, b]) => a === r && b === c)) continue;
      const got = L.trees.flatMap(([tr, tc], i) => (!wet.has(i) && reach(r, c, tr, tc) ? [i] : []));
      if (got.length > best) { best = got.length; gain = got; cell = [r, c]; }
    }
    greedy.push(cell);
    for (const i of gain) wet.add(i);
  }
  const lead = greedy.slice(0, -2), last = greedy.slice(-2);
  for (const [r, c] of lead) { const p = await at(r, c); await page.mouse.click(p.x, p.y); await sim(0.35); }
  await sim(1.2);

  // ---- clip 2 · the last two wheels, then the solver's answer for this oasis --------------------
  await rec.hold(0.5);
  await rec.finger(true);
  for (const [r, c] of last) { await tapWheel(r, c, 0.6); await rec.hold(1.0); }
  const mine = (await st()).watered;
  if (mine >= L.opt) fail(`oasis 5: the obvious play watered ${mine}, not fewer than the optimum ${L.opt}`);
  await press("#nextBtn", 0.7);
  await rec.finger(false);
  await settle();
  if ((await page.evaluate(() => window.__nd.state.phase)) !== "reveal") fail("the reveal did not open");
  await revealUpTo(g, { status: PROVED, index: 4, after: settle });
  await recordComparison(g, PROVED);
  const you = Number(await text("#youScore")), opt = Number(await text("#optScore"));
  if (!PROVED.test(await text("#solverStatus"))) fail("oasis 5: the solver did not report a proven optimum");
  if (you !== mine || opt !== L.opt || you >= opt) fail(`oasis 5: you ${you}, optimum ${opt}`);
  await rec.cut(`${GAME}-finish`, 0.9);
  console.log(`${GAME}: oasis 5 — you ${you} palms, proven optimum ${opt}`);
} finally {
  await g.close();
}
