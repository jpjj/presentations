#!/usr/bin/env node
/** Dungeon Hoard: the two clips for the deck (see README.md). */
import { VIEW, fail, openGame, recordComparison, revealUpTo, titleAndStart } from "./lib/game.mjs";

const GAME = "dungeon-hoard", PROVED = /proved the optimum/;
const g = await openGame(GAME, "__dh", "world.stage", ["#musicToggle"]);
const { page, sim, rec, real, press, text } = g;
try {
  const dh = (fn, arg) => page.evaluate(fn, arg);
  const phase = () => dh(() => window.__dh.state.phase);
  const solve = (k) => dh((k) => window.__dh.solveStage(k).then((r) => ({ status: r.status, value: r.value, placements: r.placements.map((p) => ({ key: p.key, r: p.r, c: p.c, cells: p.cells })) })), k);
  const foe = { x: VIEW.width / 2, y: VIEW.height * 0.45 };
  const same = (a, b) => a.length === b.length && JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());
  const screenOf = (id) => dh((id) => { const L = window.__dh.loot; return L.screenOf(L.pieces.get(id)); }, id);
  const dropPoint = (id, pl) => dh(([id, r, c]) => { const L = window.__dh.loot; return L.dropPoint(L.pieces.get(id), r, c); }, [id, pl.r, pl.c]);
  const at = (id) => dh((id) => { const p = window.__dh.loot.pieces.get(id); return p.location === "grid" ? [p.pos.r, p.pos.c] : null; }, id);
  /** Off-camera: strike until the foe falls and the loot lies on the floor. */
  const fight = async (k) => {
    for (let i = 0; i < 40 && (await phase()) === "fight"; i++) { await page.mouse.click(foe.x, foe.y); await sim(0.5); }
    if ((await phase()) !== "loot") fail(`stage ${k + 1}: the foe never fell`);
    await sim(3);
  };
  /** A loose piece of that kind, turned (real taps — on camera if asked) into the solver's orientation. */
  const ready = async (pl, used, tag, onCamera = false) => {
    const id = await dh(([key, used]) => { for (const p of window.__dh.loot.pieces.values()) if (p.key === key && p.location === "pile" && !used.includes(p.id)) return p.id; return null; }, [pl.key, [...used]]);
    if (id === null) fail(`${tag}: no loose ${pl.key} to place`);
    used.add(id);
    for (let t = 0; t < 4; t++) {
      if (same(await dh((id) => window.__dh.loot.pieces.get(id).cells, id), pl.cells)) return id;
      if (t === 3) fail(`${tag}: could not turn ${pl.key} into the solver's orientation`);
      const a = await screenOf(id);
      if (onCamera) { await rec.tap(a.x, a.y, 0.4); await rec.hold(0.6); } else { await page.mouse.click(a.x, a.y); await sim(0.6); }
    }
    return id;
  };
  /** On camera: carry a piece into the pack. */
  const packOnCamera = async (pl, used, tag) => {
    const id = await ready(pl, used, tag, true);
    const a = await screenOf(id);
    await rec.glide(a.x, a.y, 0.4);
    await rec.hold(0.1);
    await page.mouse.down(); await rec.hold(0.15);
    await rec.glide(a.x + 10, a.y - 16, 0.15);
    let b = await dropPoint(id, pl);          // measured once the piece is in the air
    await rec.glide(b.x, b.y, 0.7);
    b = await dropPoint(id, pl);
    await rec.glide(b.x, b.y, 0.1);
    await rec.hold(0.15);
    await page.mouse.up(); await rec.frame();
    await rec.hold(0.4);
    const got = await at(id);
    if (!got || got[0] !== pl.r || got[1] !== pl.c) fail(`${tag}: ${pl.key} did not land at (${pl.r},${pl.c}) — got ${JSON.stringify(got)}`);
  };
  /** Off-camera: carry a piece into the pack. */
  const pack = async (pl, used, tag) => {
    const id = await ready(pl, used, tag);
    const a = await screenOf(id);
    await page.mouse.move(a.x, a.y);
    await page.mouse.down();
    await page.mouse.move(a.x + 14, a.y - 14, { steps: 2 });
    await sim(0.35);
    const b = await dropPoint(id, pl);
    await page.mouse.move(b.x, b.y, { steps: 3 });
    await sim(0.3);
    await page.mouse.up();
    await sim(0.5);
    const got = await at(id);
    if (!got || got[0] !== pl.r || got[1] !== pl.c) fail(`${tag}: ${pl.key} did not land at (${pl.r},${pl.c}) — got ${JSON.stringify(got)}`);
  };
  const pressOn = async () => { await page.click("#proceedBtn"); await real(900); await sim(3.5); };

  // ---- clip 1 · title, start, the first fight, the loot on the floor, the first pieces packed ------
  await titleAndStart(g);
  await real(650);
  await rec.hold(0.4);
  if ((await phase()) !== "fight") fail("did not enter the fight");
  let strikes = 0;
  for (; strikes < 14 && (await phase()) === "fight"; strikes++) { await rec.tap(foe.x, foe.y, strikes ? 0.12 : 0.4); await rec.hold(0.25); }
  if ((await phase()) !== "loot") fail("stage 1: the foe never fell");
  await rec.finger(false);
  await rec.hold(3.0);   // the foe falls and its hoard spills onto the floor
  await rec.skip(2.6);   // (a cut) the view settles over the pack before anything is measured
  const first = await solve(0);
  if (first.status !== "OPTIMAL") fail("stage 1: solver status " + first.status);
  // two pieces of the solver's pack go in on camera: the bigger ones, and those that need no turning first
  const lying = await dh(() => Object.fromEntries([...window.__dh.loot.pieces.values()].map((p) => [p.key, p.cells])));
  const fits = (pl) => (same(lying[pl.key], pl.cells) ? 1 : 0);
  const order = [...first.placements].sort((a, b) => fits(b) - fits(a) || b.cells.length - a.cells.length);
  const used1 = new Set();
  await rec.finger(true);
  for (const pl of order.slice(0, 2)) await packOnCamera(pl, used1, "stage 1");
  await rec.finger(false);
  await rec.hold(0.5);
  await rec.cut(`${GAME}-start`, 0.05);

  // ---- stages 1–4 at their best, unrecorded ------------------------------------------------------
  for (let k = 0; k <= 3; k++) {
    if (k) await fight(k);
    const res = k ? await solve(k) : first;
    if (res.status !== "OPTIMAL") fail(`stage ${k + 1}: solver status ${res.status}`);
    const used = k ? new Set() : used1;
    for (const pl of k ? res.placements : order.slice(2)) await pack(pl, used, `stage ${k + 1}`);
    if ((await dh(() => window.__dh.loot.value())) !== res.value) fail(`stage ${k + 1}: did not pack the optimum`);
    await pressOn();
  }

  // ---- stage 5 at its best too: every cell of the pack filled ------------------------------------
  await page.mouse.click(foe.x, foe.y); await sim(1.2);
  await fight(4);
  const best = await solve(4);
  if (best.status !== "OPTIMAL") fail("stage 5: solver status " + best.status);
  // the biggest piece goes in last, on camera
  const plan = [...best.placements].sort((a, b) => a.cells.length - b.cells.length);
  const used = new Set();
  for (const pl of plan.slice(0, -1)) await pack(pl, used, "stage 5");
  const last = plan.at(-1), lastId = await ready(last, used, "stage 5");
  await sim(0.6);

  // ---- clip 2 · the last piece goes in, on — then the two packs side by side ----------------------
  await rec.hold(0.4);
  await rec.finger(true);
  {
    const a = await screenOf(lastId);
    await rec.glide(a.x, a.y, 0.45);
    await rec.hold(0.1);
    await page.mouse.down(); await rec.hold(0.15);
    await rec.glide(a.x + 10, a.y - 16, 0.15);
    let b = await dropPoint(lastId, last);
    await rec.glide(b.x, b.y, 0.8);
    b = await dropPoint(lastId, last);
    await rec.glide(b.x, b.y, 0.1);
    await rec.hold(0.2);
    await page.mouse.up(); await rec.frame();
  }
  await rec.hold(0.5);
  const got = await at(lastId);
  if (!got || got[0] !== last.r || got[1] !== last.c) fail(`stage 5: ${last.key} did not land at (${last.r},${last.c})`);
  const mine = await dh(() => window.__dh.loot.value());
  if (mine !== best.value) fail(`stage 5: packed ${mine}, the optimum is ${best.value}`);
  await press("#proceedBtn", 0.5);
  await rec.finger(false);
  await rec.hold(0.8);
  await real(900);
  await sim(3.5);
  await page.waitForSelector("#endOverlay:not(.hidden)", { timeout: 60000 });
  await page.click("#revealBtn");
  await revealUpTo(g, { status: PROVED, index: 4, wait: () => sim(1), after: () => real(200) });
  await recordComparison(g, PROVED, { max: 6, tail: 1.8 });
  const you = Number(await text("#youScore")), opt = Number(await text("#optScore"));
  if (!PROVED.test(await text("#solverStatus"))) fail("stage 5: the solver did not report a proven optimum");
  if (you !== mine || opt !== best.value || you !== opt) fail(`stage 5: you ${you}, optimum ${opt}`);
  await rec.cut(`${GAME}-finish`, 0.9);
  console.log(`${GAME}: stage 5 — you packed ${you}, the proven optimum ${opt} · ${strikes} strikes in the first fight`);
} finally {
  await g.close();
}
