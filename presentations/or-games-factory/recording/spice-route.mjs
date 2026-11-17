#!/usr/bin/env node
/** The Spice Route: the two clips for the deck (see README.md). */
import { fail, openGame, recordComparison, revealUpTo, titleAndStart } from "./lib/game.mjs";

const GAME = "spice-route", PROVED = /proved the shortest round/;
const g = await openGame(GAME, "__sr", "sea.stage");
const { page, sim, rec, real, press, text } = g;
try {
  const at = (node) => page.evaluate((n) => window.__sr.sea.screenOf(n), node);
  const st = () => page.evaluate(() => { const m = window.__sr, v = m.state.voyage; return { phase: m.state.phase, idx: m.state.idx, route: v ? [...v.route] : [], complete: !!v && v.complete, length: v ? v.length() : 0 }; });
  const solve = (k) => page.evaluate((k) => window.__sr.solveLevel(k).then((r) => ({ status: r.status, length: r.length, order: r.order })), k);
  const levels = await page.evaluate(() => window.__sr.LEVELS.map((L) => ({ opt: L.opt, points: L.points.map((p) => [...p]) })));
  const tap = async (node) => { const p = await at(node); await page.mouse.click(p.x, p.y); await sim(0.2); };
  /** On camera. The view may still be easing into place, so the finger aims again once it is there. */
  const tapOnCamera = async (node, sec, watch) => {
    let p = await at(node); await rec.glide(p.x, p.y, sec);
    p = await at(node); await rec.tap(p.x, p.y, 0.1);
    await rec.hold(watch);
    if (!(await st()).route.includes(node)) fail(`port ${node} was not charted`);
  };
  /** After "Set sail": skip the sailing and wait for the next voyage (or the end of the run). */
  const arrive = async (k) => {
    await page.click("#skipBtn");
    const there = (s) => (k + 1 < levels.length ? s.phase === "play" && s.idx === k + 1 : s.phase === "done");
    for (let i = 0; i < 40 && !there(await st()); i++) { await sim(0.4); await real(120); }
    if (!there(await st())) fail(`voyage ${k + 1} never ended`);
    await real(450);
    await sim(1.5);
  };
  const head = (n) => page.waitForFunction((n) => new RegExp(`Voyage ${n} of`).test(document.getElementById("cmpHead")?.textContent ?? ""), n, { timeout: 180000, polling: 200 });

  // ---- clip 1 · title, start, the round of voyage 1 charted, set sail ----------------------------
  await titleAndStart(g);
  await real(700);
  await rec.hold(0.6);
  const first = await solve(0);
  if (first.status !== "OPTIMAL") fail("voyage 1: solver status " + first.status);
  for (const p of first.order.slice(1, -1)) await tapOnCamera(p, 0.3, 0.15);
  await rec.hold(0.5);
  if (!(await st()).complete) fail("voyage 1: the round is not complete");
  await press("#sailBtn", 0.5);
  await rec.finger(false);
  await rec.hold(1.2);
  await rec.cut(`${GAME}-start`, 0.05);
  await arrive(0);

  // ---- voyages 2–4 at their best, unrecorded ----------------------------------------------------
  for (let k = 1; k <= 3; k++) {
    const res = await solve(k);
    if (res.status !== "OPTIMAL") fail(`voyage ${k + 1}: solver status ${res.status}`);
    for (const p of res.order.slice(1, -1)) await tap(p);
    await sim(0.8);
    if (Math.abs((await st()).length - levels[k].opt) > 1e-3) fail(`voyage ${k + 1}: did not chart the optimum`);
    await page.click("#sailBtn");
    await sim(1.2);
    await arrive(k);
  }

  // ---- voyage 5 the obvious way: always on to the nearest port not yet visited --------------------
  const P = levels[4].points, left = new Set(P.map((_, i) => i).slice(1)), nearest = [];
  for (let here = 0; left.size; ) {
    let best = -1, d = Infinity;
    for (const j of left) { const dj = Math.hypot(P[j][0] - P[here][0], P[j][1] - P[here][1]); if (dj < d) { d = dj; best = j; } }
    nearest.push(best); left.delete(best); here = best;
  }
  for (const p of nearest.slice(0, -2)) await tap(p);
  await sim(0.8);

  // ---- clip 2 · the last two ports, set sail — then the solver's round over this one ------------
  await rec.hold(0.4);
  await rec.finger(true);
  for (const p of nearest.slice(-2)) await tapOnCamera(p, 0.4, 0.3);
  await rec.hold(0.5);
  const mine = (await st()).length;
  if (!(await st()).complete) fail("voyage 5: the round is not complete");
  if (!(mine > levels[4].opt + 1)) fail(`voyage 5: nearest-port-first sails ${mine}, not more than the optimum ${levels[4].opt}`);
  await press("#sailBtn", 0.5);
  await rec.finger(false);
  await rec.hold(0.8);
  await arrive(4);
  await page.waitForSelector("#endOverlay:not(.hidden)", { timeout: 60000 });
  await page.click("#revealBtn");
  await revealUpTo(g, { status: PROVED, index: 4, wait: async (k) => { await head(k + 1); await real(500); await sim(0.8); }, after: () => real(250) });
  await head(5);
  await real(500);
  await recordComparison(g, PROVED, { max: 4.4, tail: 1.5 });
  const num = (s) => Number(s.replace(/[^\d.-]/g, ""));
  const you = num(await text("#youScore")), opt = num(await text("#optScore"));
  if (!PROVED.test(await text("#solverStatus"))) fail("voyage 5: the solver did not report a proven optimum");
  // the chart counts in tenths of a league
  if (Math.abs(you - mine / 10) > 0.06 || Math.abs(opt - levels[4].opt / 10) > 0.06 || you <= opt) fail(`voyage 5: you ${you}, optimum ${opt} (expected ${(mine / 10).toFixed(1)} and ${(levels[4].opt / 10).toFixed(1)})`);
  await rec.cut(`${GAME}-finish`, 0.9);
  console.log(`${GAME}: voyage 5 — you sailed ${you} leagues, proven shortest ${opt}`);
} finally {
  await g.close();
}
