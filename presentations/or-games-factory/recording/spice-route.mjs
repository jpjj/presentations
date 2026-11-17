#!/usr/bin/env node
/** The Spice Route: the two clips for the deck (see README.md). */
import { fail, openGame, recordComparison, revealUpTo, titleAndStart } from "./lib/game.mjs";

const GAME = "spice-route", PROVED = /proved the shortest round/;
const g = await openGame(GAME, "__sr", "sea.stage");
const { page, sim, rec, real, press, text } = g;
try {
  const at = (node) => page.evaluate((n) => window.__sr.sea.screenOf(n), node);
  const st = () => page.evaluate(() => { const m = window.__sr, v = m.state.voyage; return { phase: m.state.phase, idx: m.state.idx, route: v ? [...v.route] : [], complete: !!v && v.complete, length: v ? v.length() : 0, crossings: m.sea.crossings }; });
  const solve = (k) => page.evaluate((k) => window.__sr.solveLevel(k).then((r) => ({ status: r.status, length: r.length, order: r.order })), k);
  const levels = await page.evaluate(() => window.__sr.LEVELS.map((L) => ({ opt: L.opt, points: L.points.map((p) => [...p]) })));
  const tap = async (node) => { const p = await at(node); await page.mouse.click(p.x, p.y); await sim(0.2); };
  /** On camera. The view may still be easing into place, so the finger aims again once it is there. */
  const tapOnCamera = async (node, sec, watch, charted = true) => {
    let p = await at(node); await rec.glide(p.x, p.y, sec);
    p = await at(node); await rec.tap(p.x, p.y, 0.1);
    await rec.hold(watch);
    if ((await st()).route.includes(node) !== charted) fail(`port ${node} was not ${charted ? "charted" : "dropped"}`);
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

  // ---- voyage 5: always on to the nearest port — then every crossing repaired -------------------
  const P = levels[4].points, left = new Set(P.map((_, i) => i).slice(1)), nearest = [];
  for (let here = 0; left.size; ) {
    let best = -1, d = Infinity;
    for (const j of left) { const dj = Math.hypot(P[j][0] - P[here][0], P[j][1] - P[here][1]); if (dj < d) { d = dj; best = j; } }
    nearest.push(best); left.delete(best); here = best;
  }
  // two legs that cross are uncrossed by sailing the stretch between them the other way round;
  // repeat until no legs cross. Shorter every time — and still not the shortest round.
  const turn = (a, b, c) => (P[b][0] - P[a][0]) * (P[c][1] - P[a][1]) - (P[b][1] - P[a][1]) * (P[c][0] - P[a][0]);
  const cross = (a, b, c, e) => a !== c && a !== e && b !== c && b !== e && turn(c, e, a) * turn(c, e, b) < 0 && turn(a, b, c) * turn(a, b, e) < 0;
  const crossing = (t) => { for (let i = 0; i < t.length; i++) for (let j = i + 1; j < t.length; j++) if (cross(t[i], t[(i + 1) % t.length], t[j], t[(j + 1) % t.length])) return [i, j]; return null; };
  let round = [0, ...nearest];
  for (let c = crossing(round); c; c = crossing(round)) round = [...round.slice(0, c[0] + 1), ...round.slice(c[0] + 1, c[1] + 1).reverse(), ...round.slice(c[1] + 1)];
  // on camera the last two ports first go in the wrong way round (legs cross), and are then put right
  const ports = round.slice(1), wrong = [...ports.slice(0, -2), ports.at(-1), ports.at(-2)];
  for (const p of wrong.slice(0, -2)) await tap(p);
  await sim(0.8);

  // ---- clip 2 · a crossing, its repair, set sail — then the solver's round over this one ----------
  await rec.hold(0.4);
  await rec.finger(true);
  for (const p of wrong.slice(-2)) await tapOnCamera(p, 0.4, 0.3);
  await rec.hold(0.9);
  const crossed = await st();
  if (!crossed.complete || !(crossed.crossings > 0)) fail("voyage 5: the first try should be complete and cross itself: " + JSON.stringify(crossed));
  // tap the port that is out of order: it leaves the round. Tap it again: it comes back as the last stop.
  await tapOnCamera(ports.at(-1), 0.4, 0.4, false);
  await tapOnCamera(ports.at(-1), 0.2, 0.3);
  await rec.hold(0.7);
  const fixed = await st(), mine = fixed.length;
  if (!fixed.complete || fixed.crossings !== 0 || fixed.route.join() !== ports.join()) fail("voyage 5: the repaired round is not the planned one: " + JSON.stringify(fixed));
  if (!(mine < crossed.length - 1)) fail(`voyage 5: the repair did not shorten the round (${crossed.length} → ${mine})`);
  if (!(mine > levels[4].opt + 1)) fail(`voyage 5: the repaired round is ${mine}, not longer than the optimum ${levels[4].opt}`);
  await press("#sailBtn", 0.5);
  await rec.finger(false);
  await rec.hold(0.8);
  await arrive(4);
  await page.waitForSelector("#endOverlay:not(.hidden)", { timeout: 60000 });
  await page.click("#revealBtn");
  await revealUpTo(g, { status: PROVED, index: 4, wait: async (k) => { await head(k + 1); await real(500); await sim(0.8); }, after: () => real(250) });
  await head(5);
  await real(500);
  await recordComparison(g, PROVED, { max: 4.2, tail: 1.6 });
  const num = (s) => Number(s.replace(/[^\d.-]/g, ""));
  const you = num(await text("#youScore")), opt = num(await text("#optScore"));
  if (!PROVED.test(await text("#solverStatus"))) fail("voyage 5: the solver did not report a proven optimum");
  // the chart counts in tenths of a league
  if (Math.abs(you - mine / 10) > 0.06 || Math.abs(opt - levels[4].opt / 10) > 0.06 || you <= opt) fail(`voyage 5: you ${you}, optimum ${opt} (expected ${(mine / 10).toFixed(1)} and ${(levels[4].opt / 10).toFixed(1)})`);
  await rec.cut(`${GAME}-finish`, 0.9);
  console.log(`${GAME}: voyage 5 — first try ${(crossed.length / 10).toFixed(1)} leagues with ${crossed.crossings} crossing(s), repaired ${you} leagues, proven shortest ${opt}`);
} finally {
  await g.close();
}
