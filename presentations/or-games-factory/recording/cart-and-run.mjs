#!/usr/bin/env node
/** Cart & Run: the two clips for the deck (see README.md). */
import { fail, openGame, recordComparison, revealUpTo, titleAndStart } from "./lib/game.mjs";

const GAME = "cart-and-run", PROVED = /proved the best possible haul/;
/**
 * Room 5 the obvious way: always the loot with the most gold per weight that still fits and is
 * still in reach (node 0 is the cart). A legal raid — the script checks every pick-up — but not
 * the best one.
 */
const OBVIOUS = [[0, 10, 2, 7, 0], [0, 4, 1, 0], [0, 5, 6, 0]];
const g = await openGame(GAME, "__cr", "stage");
const { page, sim, rec, real, press, text } = g;
try {
  const cr = (fn, arg) => page.evaluate(fn, arg);
  const at = (node) => cr((n) => window.__cr.world.screenOf(n), node);
  const busy = () => cr(() => window.__cr.world.busy);
  const settle = async () => { for (let i = 0; i < 120; i++) { if (!(await busy())) return; await sim(0.25); } fail("the room never stopped animating"); };
  const st = () => cr(() => { const s = window.__cr.state; return { phase: s.phase, idx: s.idx, carried: [...s.carried], prize: s.bankedPrize() }; });
  const solve = (k) => cr((k) => window.__cr.solveRoom(k).then((r) => ({ status: r.status, prize: r.prize, trips: r.trips })), k);
  const tap = async (node) => { const p = await at(node); await page.mouse.click(p.x, p.y); await sim(0.1); await settle(); };
  /** On camera: tap, then watch the walk (at most `max` seconds of it). */
  const tapOnCamera = async (node, max) => {
    const p = await at(node);
    await rec.tap(p.x, p.y, 0.5);
    await rec.until(async () => !(await busy()), max);
    await settle();
  };
  /** Walk a list of trips off-camera, checking every pick-up and every unloading. */
  const raid = async (trips, tag) => {
    for (const trip of trips) {
      for (const n of trip.slice(1, -1)) { await tap(n); if (!(await st()).carried.includes(n)) fail(`${tag}: loot ${n} was not picked up`); }
      await tap(0);
      if ((await st()).carried.length) fail(`${tag}: the cart did not take the load`);
    }
  };
  /** Flee with the cart (if the room has not ended by itself), then on to the next room / the reveal. */
  const leave = async () => {
    if ((await st()).phase === "play") { await page.click("#goBtn"); await sim(0.3); }
    if ((await st()).phase !== "over") fail("the room did not end");
    await settle(); await sim(2.2);
    await page.click("#goBtn");
    await sim(0.8);
  };
  const opts = await cr(() => window.__cr.levels.map((L) => L.opt));

  // ---- clip 1 · title, start, the first trip of room 1 -------------------------------------------
  await titleAndStart(g);
  await real(650);
  await rec.hold(0.9);
  const first = await solve(0);
  if (first.status !== "OPTIMAL") fail("room 1: solver status " + first.status);
  const [trip1, ...rest1] = first.trips;
  for (const n of trip1.slice(1, -1)) await tapOnCamera(n, 2.2);
  await tapOnCamera(0, 2.2);
  await rec.finger(false);
  await rec.hold(0.6);
  await rec.cut(`${GAME}-start`, 0.05);

  // ---- rooms 1–4 at their best, unrecorded -------------------------------------------------------
  await raid(rest1, "room 1");
  if ((await st()).prize !== opts[0]) fail("room 1 was not raided at its optimum");
  await leave();
  for (let k = 1; k <= 3; k++) {
    const res = await solve(k);
    if (res.status !== "OPTIMAL") fail(`room ${k + 1}: solver status ${res.status}`);
    await raid(res.trips, `room ${k + 1}`);
    if ((await st()).prize !== opts[k]) fail(`room ${k + 1}: did not reach the optimum`);
    await leave();
  }

  // ---- room 5 the obvious way, all but the last unloading -----------------------------------------
  if ((await st()).idx !== 4) fail("not in room 5: " + JSON.stringify(await st()));
  // the game's live solve of this room, started now so that it runs while nothing is being drawn
  // (the reveal shows how long it took)
  const best = await solve(4);
  if (best.status !== "OPTIMAL" || best.prize !== opts[4]) fail(`room 5: solver ${best.status}, ${best.prize}`);
  await raid(OBVIOUS.slice(0, -1), "room 5");
  const lastTrip = OBVIOUS.at(-1);
  for (const n of lastTrip.slice(1, -1)) { await tap(n); if (!(await st()).carried.includes(n)) fail(`room 5: loot ${n} was not picked up`); }
  await sim(0.6);

  // ---- clip 2 · the last load goes into the cart, flee — then the solver's raid of this room -------
  await rec.hold(0.4);
  await rec.finger(true);
  await tapOnCamera(0, 2.4);
  const mine = (await st()).prize;
  if ((await st()).carried.length) fail("room 5: the cart did not take the last load");
  if (mine >= opts[4]) fail(`room 5: the obvious raid banked ${mine}, not less than the optimum ${opts[4]}`);
  if ((await st()).phase === "play") await press("#goBtn", 0.5);
  await rec.finger(false);
  await rec.hold(0.9);
  if ((await st()).phase !== "over") fail("room 5 did not end");
  await settle(); await sim(2.2);
  await page.click("#goBtn");
  await sim(0.8);
  if ((await st()).phase !== "reveal") fail("the reveal did not open");
  await revealUpTo(g, { status: PROVED, index: 4 });
  await recordComparison(g, PROVED, { max: 4.5, tail: 1.6 });
  const you = Number(await text("#youScore")), opt = Number(await text("#optScore"));
  if (!PROVED.test(await text("#solverStatus"))) fail("room 5: the solver did not report a proven optimum");
  if (you !== mine || opt !== opts[4] || you >= opt) fail(`room 5: you ${you}, optimum ${opt}`);
  await rec.cut(`${GAME}-finish`, 0.9);
  console.log(`${GAME}: room 5 — you banked ${you} gold, proven optimum ${opt}`);
} finally {
  await g.close();
}
