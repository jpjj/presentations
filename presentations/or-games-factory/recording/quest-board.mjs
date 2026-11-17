#!/usr/bin/env node
/** The Quest Board: the two clips for the deck (see README.md). */
import { fail, openGame, recordComparison, revealUpTo, titleAndStart } from "./lib/game.mjs";

const GAME = "quest-board", PROVED = /proved the richest of [\d,]+ possible rosters/;
const g = await openGame(GAME, "__qb", "world.stage");
const { page, sim, rec, real, press, text } = g;
try {
  const st = () => page.evaluate(() => { const s = window.__qb.state; return { phase: s.phase, idx: s.idx, assign: [...s.assign], selected: s.selected }; });
  const level = (k) => page.evaluate((k) => { const L = window.__qb.LEVELS[k]; return { n: L.heroCount, opt: L.opt, greedy: L.greedy, values: window.__qb.valuesFor(k) }; }, k);
  const solve = (k) => page.evaluate((k) => window.__qb.solveLevel(k).then((r) => ({ status: r.status, total: r.total, assign: r.assign })), k);
  /** Where to tap for a hero / a contract: the figure or notice in the scene, or its name plate if the HUD covers that spot. */
  const point = (what, i) => page.evaluate(([what, i]) => {
    const p = what === "hero" ? window.__qb.world.heroPoint(i) : window.__qb.world.questPoint(i);
    const inView = p.x > 6 && p.y > 6 && p.x < innerWidth - 6 && p.y < innerHeight - 6;
    if (inView && document.elementFromPoint(p.x, p.y)?.tagName === "CANVAS") return p;
    const plate = document.querySelector(what === "hero" ? `.plate.hero[data-h="${i}"]` : `.plate.quest[data-q="${i}"]`);
    if (!plate) return p;
    const r = plate.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }, [what, i]);
  /** Post hero h to contract j off-camera. */
  const post = async (h, j) => {
    let p = await point("hero", h); await page.mouse.click(p.x, p.y); await sim(0.1);
    p = await point("quest", j); await page.mouse.click(p.x, p.y); await sim(0.1);
    if ((await st()).assign[h] !== j) fail(`hero ${h} was not posted to contract ${j}`);
  };
  /** The same, on camera: tap the hero (every notice shows its pay), tap the notice, watch the walk. */
  const postOnCamera = async (h, j, walk) => {
    let p = await point("hero", h); await rec.tap(p.x, p.y, 0.4);
    await rec.hold(0.35);
    p = await point("quest", j); await rec.tap(p.x, p.y, 0.4);
    await rec.hold(walk);
    if ((await st()).assign[h] !== j) fail(`hero ${h} was not posted to contract ${j}`);
  };
  const nextDay = async () => { await page.click("#nextBtn"); await real(900); await sim(0.6); };
  /** Best pair first — the obvious play (as in the game's own verify script). */
  const greedy = (values) => {
    const n = values.length, rowFree = Array(n).fill(true), colFree = Array(n).fill(true), assign = Array(n).fill(-1);
    for (let step = 0; step < n; step++) {
      let bi = -1, bj = -1, best = -Infinity;
      for (let i = 0; i < n; i++) if (rowFree[i]) for (let j = 0; j < n; j++) if (colFree[j] && values[i][j] > best) { best = values[i][j]; bi = i; bj = j; }
      assign[bi] = bj; rowFree[bi] = false; colFree[bj] = false;
    }
    return assign;
  };

  // ---- clip 1 · title, start, the first postings of day 1 --------------------------------------
  await titleAndStart(g);
  await real(900);
  await rec.hold(0.6);
  const day1 = await solve(0);
  if (day1.status !== "OPTIMAL") fail("day 1: solver status " + day1.status);
  await postOnCamera(0, day1.assign[0], 1.0);
  await postOnCamera(1, day1.assign[1], 1.3);
  await rec.finger(false);
  await rec.hold(0.4);
  await rec.cut(`${GAME}-start`, 0.05);

  // ---- days 1–4 at their best, unrecorded --------------------------------------------------------
  for (let h = 2; h < day1.assign.length; h++) await post(h, day1.assign[h]);
  await sim(2.2);
  await nextDay();
  for (let k = 1; k <= 3; k++) {
    const res = await solve(k);
    if (res.status !== "OPTIMAL") fail(`day ${k + 1}: solver status ${res.status}`);
    for (let h = 0; h < res.assign.length; h++) await post(h, res.assign[h]);
    await sim(2.2);
    await nextDay();
  }

  // ---- day 5, the obvious way: best pair first — and ONLY that roster (the game keeps a day's best) ---
  const L = await level(4);
  const plan = greedy(L.values);
  const mine = plan.reduce((t, j, i) => t + L.values[i][j], 0);
  if (mine >= L.opt) fail(`day 5: best-pair-first pays ${mine}, not less than the optimum ${L.opt}`);
  const n = plan.length;
  for (let h = 0; h < n - 1; h++) await post(h, plan[h]);
  await sim(2.2);

  // ---- clip 2 · the last posting, then the solver's roster for this day ---------------------------
  await rec.hold(0.4);
  await rec.finger(true);
  await postOnCamera(n - 1, plan[n - 1], 1.3);
  await press("#nextBtn", 0.5);
  await rec.finger(false);
  await real(900);
  if ((await st()).phase !== "reveal") fail("the reveal did not open: " + JSON.stringify(await st()));
  await revealUpTo(g, { status: PROVED, index: 4, after: () => real(900) });
  await recordComparison(g, PROVED, { max: 5, tail: 1.6 });
  const num = (s) => Number(s.replace(/[^\d.-]/g, ""));
  const you = num(await text("#youScore")), opt = num(await text("#optScore"));
  if (!PROVED.test(await text("#solverStatus"))) fail("day 5: the solver did not report a proven optimum");
  if (you !== mine || opt !== L.opt || you >= opt) fail(`day 5: you ${you}, optimum ${opt} (expected ${mine} and ${L.opt})`);
  await rec.cut(`${GAME}-finish`, 0.9);
  console.log(`${GAME}: day 5 — you ${you} gold, proven optimum ${opt}`);
} finally {
  await g.close();
}
