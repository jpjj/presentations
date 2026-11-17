#!/usr/bin/env node
/** The Labyrinth Keeper: the two clips for the deck (see README.md). */
import { fail, openGame, recordComparison, revealUpTo, titleAndStart } from "./lib/game.mjs";

const GAME = "labyrinth-keeper", PROVED = /proved the longest forced path/;
/** Labyrinth 5, one wall a tile off the best spot: the hero still finds a shorter way round. */
const NEARLY = [[3, 5], [4, 6], [2, 5]];
const g = await openGame(GAME, "__lk", "world.stage");
const { page, sim, rec, real, press, text } = g;
try {
  const at = (r, c) => page.evaluate(([r, c]) => window.__lk.world.screenOf(r, c), [r, c]);
  const settle = () => page.waitForFunction("!window.__lk.busy()", null, { timeout: 120000, polling: 100 });
  const st = () => page.evaluate(() => { const s = window.__lk.state; return { phase: s.phase, idx: s.idx, length: s.maze.length(), walls: s.maze.walls.length }; });
  const solve = (k) => page.evaluate((k) => window.__lk.solveLevel(k).then((r) => ({ status: r.status, length: r.length, walls: r.walls.map((c) => [...c]) })), k);
  const levels = await page.evaluate(() => window.__lk.LEVELS.map((L) => ({ opt: L.opt, base: L.base, budget: L.budget })));
  const wall = async (r, c) => { const p = await at(r, c); await page.mouse.click(p.x, p.y); await sim(0.4); };
  const wallOnCamera = async (r, c, sec, watch) => { const p = await at(r, c); await rec.tap(p.x, p.y, sec); await rec.hold(watch); };
  /** After "Send the hero": hurry the walk along and wait for the next labyrinth (or the reveal). */
  const onward = async (k) => {
    if (await page.evaluate(() => window.__lk.world.walking)) await page.click("#nextBtn");
    for (let i = 0; i < 30; i++) { await sim(0.5); const now = await st(); if (now.idx !== k || now.phase !== "play") break; }
    await settle();
    await sim(0.8);
  };

  // ---- clip 1 · title, start, the one wall of labyrinth 1, the hero sets out ---------------------
  await titleAndStart(g);
  await settle();
  await real(600);
  await rec.hold(1.0);
  const first = await solve(0);
  if (first.status !== "OPTIMAL") fail("labyrinth 1: solver status " + first.status);
  for (const [r, c] of first.walls) await wallOnCamera(r, c, 0.7, 1.5);
  if ((await st()).length !== levels[0].opt) fail("labyrinth 1 was not built at its optimum");
  await press("#nextBtn", 0.6);
  await rec.finger(false);
  await rec.hold(2.4);
  await rec.cut(`${GAME}-start`, 0.05);
  await onward(0);

  // ---- labyrinths 2–4 at their best, unrecorded -------------------------------------------------
  for (let k = 1; k <= 3; k++) {
    const res = await solve(k);
    if (res.status !== "OPTIMAL") fail(`labyrinth ${k + 1}: solver status ${res.status}`);
    for (const [r, c] of res.walls) await wall(r, c);
    await sim(1.4);
    if ((await st()).length !== levels[k].opt) fail(`labyrinth ${k + 1}: did not reach the optimum`);
    await page.click("#nextBtn");
    await sim(0.6);
    await onward(k);
  }

  // ---- labyrinth 5, nearly right — and ONLY these walls (the game keeps a labyrinth's best) -------
  const L = levels[4];
  if ((await st()).idx !== 4) fail("not on labyrinth 5: " + JSON.stringify(await st()));
  // the game's live solve of this labyrinth, started now so that it runs while nothing is being drawn
  // (the reveal shows how long it took)
  const best = await solve(4);
  if (best.status !== "OPTIMAL" || best.length !== L.opt) fail(`labyrinth 5: solver ${best.status}, ${best.length}`);
  for (const [r, c] of NEARLY.slice(0, -1)) await wall(r, c);
  await sim(1.2);

  // ---- clip 2 · the last wall, the hero sets out, then the solver's walls ------------------------
  await rec.hold(0.4);
  await rec.finger(true);
  const [lr, lc] = NEARLY.at(-1);
  await wallOnCamera(lr, lc, 0.6, 1.0);
  const mine = (await st()).length;
  if ((await st()).walls !== NEARLY.length) fail("labyrinth 5: a wall was refused");
  if (mine >= L.opt || mine <= L.base) fail(`labyrinth 5: these walls force ${mine} steps (open path ${L.base}, optimum ${L.opt})`);
  await press("#nextBtn", 0.6);
  await rec.finger(false);
  await rec.hold(1.4);
  await onward(4);
  if ((await st()).phase !== "reveal") fail("the reveal did not open: " + JSON.stringify(await st()));
  await revealUpTo(g, { status: PROVED, index: 4, after: settle });
  await recordComparison(g, PROVED, { max: 5, tail: 1.6 });
  const you = Number(await text("#youScore")), opt = Number(await text("#optScore"));
  if (!PROVED.test(await text("#solverStatus"))) fail("labyrinth 5: the solver did not report a proven optimum");
  if (you !== mine || opt !== L.opt || you >= opt) fail(`labyrinth 5: you ${you}, optimum ${opt}`);
  await rec.cut(`${GAME}-finish`, 0.9);
  console.log(`${GAME}: labyrinth 5 — you forced ${you} steps, proven optimum ${opt}`);
} finally {
  await g.close();
}
