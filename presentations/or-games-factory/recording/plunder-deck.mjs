#!/usr/bin/env node
/** Plunder Deck: the two clips for the deck (see README.md). */
import { fail, openGame, recordComparison, revealUpTo, titleAndStart } from "./lib/game.mjs";

const GAME = "plunder-deck", PROVED = /proved the optimum/;
const g = await openGame(GAME, "__pd", "world.stage");
const { page, sim, rec, real, press, text } = g;
try {
  const pd = (fn, arg) => page.evaluate(fn, arg);
  const placed = () => pd(() => window.__pd.state.deck.placed.map((q) => ({ key: q.key, x: q.x, y: q.y, z: q.z, w: q.w, d: q.d })));
  const solve = (k) => pd((k) => window.__pd.solveIsland(k).then((r) => ({ status: r.status, value: r.value, placements: r.placements.map((p) => ({ key: p.key, x: p.x, y: p.y, z: p.z, w: p.w, d: p.d, h: p.h })) })), k);
  const optima = await pd(() => window.__pd.ISLANDS.map((i) => i.opt));
  const LOOT = await pd(() => window.__pd.LOOT);
  const bottomUp = (ps) => [...ps].sort((a, b) => a.z - b.z || a.y - b.y || a.x - b.x);

  /** A screen point over the canvas from which the game picks cell (x, y) — as in the game's own verify script. */
  async function aimAt(x, y, z) {
    const c = await pd(([x, y, z]) => window.__pd.world.cellToScreen(x, y, z), [x, y, z]);
    const probes = [[0, 0]];
    for (const r of [6, 12, 18, 26]) for (let a = 0; a < 8; a++) probes.push([Math.round(Math.cos((a / 8) * 2 * Math.PI) * r), Math.round(Math.sin((a / 8) * 2 * Math.PI) * r)]);
    const find = () => pd(([cx, cy, probes, x, y]) => {
      for (const [dx, dy] of probes) {
        const px = cx + dx, py = cy + dy, el = document.elementFromPoint(px, py);
        if (!el || el.tagName !== "CANVAS") continue;
        const cell = window.__pd.world.pickCell(px, py);
        if (cell && cell.x === x && cell.y === y) return { x: px, y: py };
      }
      return null;
    }, [c.x, c.y, probes, x, y]);
    const p = await find();
    if (!p) fail(`no screen point picks cell ${x},${y} at layer ${z}`);
    return p;
  }
  /** The pointer cell the game turns into a footprint anchored at (x, y). */
  const aimCell = (p) => [p.x + Math.floor((p.w - 1) / 2), p.y + Math.floor((p.d - 1) / 2)];
  const landed = async (p, before, tag) => {
    const now = await placed(), last = now[now.length - 1];
    if (now.length !== before + 1 || !last || last.key !== p.key || last.x !== p.x || last.y !== p.y || last.z !== p.z || last.w !== p.w || last.d !== p.d) fail(`${tag}: ${p.key} did not land at ${p.x},${p.y},${p.z}: ${JSON.stringify(now)}`);
  };
  /** Off-camera: card, turn if need be, tap the deck. */
  const place = async (p, tag) => {
    const before = (await placed()).length;
    const s = await pd(() => ({ sel: window.__pd.state.selected, loot: window.__pd.ISLANDS[window.__pd.state.islandIdx].loot }));
    if (s.sel === null || s.loot[s.sel] !== p.key) await page.click(`.loot-card[data-key="${p.key}"]`);
    const t = LOOT[p.key];
    if (t.w !== t.d && (p.w !== t.w) !== (await pd(() => window.__pd.state.rotated))) await page.keyboard.press("r");
    const [ax, ay] = aimCell(p), to = await aimAt(ax, ay, p.z);
    await page.mouse.move(to.x, to.y);
    await page.mouse.click(to.x, to.y);
    await sim(0.6);
    await landed(p, before, tag);
  };
  /** On camera: press the quay card, carry the piece over the deck (turning it in the air if need be), let go. */
  const load = async (p, tag, watch = 0.7) => {
    const before = (await placed()).length;
    const card = await page.locator(`.loot-card[data-key="${p.key}"]`).boundingBox();
    const [ax, ay] = aimCell(p), to = await aimAt(ax, ay, p.z), t = LOOT[p.key];
    await rec.drag({ x: card.x + card.width / 2, y: card.y + card.height / 2 }, to, 0.9, async () => {
      if (t.w !== t.d && p.w !== t.w) { await rec.hold(0.15); await page.keyboard.press("r"); await rec.hold(0.3); }
    });
    await rec.hold(watch);
    await landed(p, before, tag);
  };
  /** Set sail off-camera and go on to the next island (or, after the last, the reveal). */
  const sail = async () => {
    await page.keyboard.press("Escape");
    await page.click("#sailBtn");
    await page.waitForSelector("#islandOverlay:not(.hidden)");
    await sim(0.5);
    await page.click("#ioNext");
    await real(150);
    await sim(0.6);
  };

  // ---- clip 1 · title, start, the first two pieces of island 1 carried aboard --------------------
  await titleAndStart(g);
  await real(700);
  await rec.hold(0.9);
  const first = await solve(0);
  if (first.status !== "OPTIMAL") fail("island 1: solver status " + first.status);
  const build1 = bottomUp(first.placements);
  await load(build1[0], "island 1");
  await load(build1[1], "island 1");
  await rec.finger(false);
  await rec.hold(0.5);
  await rec.cut(`${GAME}-start`, 0.05);

  // ---- islands 1–4 at their best, unrecorded -----------------------------------------------------
  for (const p of build1.slice(2)) await place(p, "island 1");
  if (Number(await text("#holdVal")) !== optima[0]) fail("island 1 was not loaded at its optimum");
  await sail();
  for (let k = 1; k <= 3; k++) {
    const res = await solve(k);
    if (res.status !== "OPTIMAL") fail(`island ${k + 1}: solver status ${res.status}`);
    for (const p of bottomUp(res.placements)) await place(p, `island ${k + 1}`);
    if (Number(await text("#holdVal")) !== optima[k]) fail(`island ${k + 1}: did not reach the optimum`);
    await sail();
  }

  // ---- island 5, nearly full: the solver's deck with one piece left on the quay --------------------
  // (the piece that carries nothing and is worth the least — the deck stays a legal one)
  if ((await pd(() => window.__pd.state.islandIdx)) !== 4) fail("not on island 5");
  const best = await solve(4);
  if (best.status !== "OPTIMAL" || best.value !== optima[4]) fail("island 5: solver " + best.status + " " + best.value);
  const over = (p, q) => q.z === p.z + p.h && q.x < p.x + p.w && p.x < q.x + q.w && q.y < p.y + p.d && p.y < q.y + q.d;
  const free = best.placements.filter((p) => !best.placements.some((q) => over(p, q)));
  const left = free.reduce((a, b) => (LOOT[b.key].value < LOOT[a.key].value ? b : a));
  const build5 = bottomUp(best.placements.filter((p) => p !== left));
  const expected = best.value - LOOT[left.key].value;
  for (const p of build5.slice(0, -1)) await place(p, "island 5");
  await page.keyboard.press("Escape");
  await sim(0.6);

  // ---- clip 2 · the last piece, set sail — then the solver rebuilds this deck ----------------------
  await rec.hold(0.4);
  await rec.finger(true);
  await load(build5.at(-1), "island 5", 0.6);
  const mine = Number(await text("#holdVal"));
  if (mine !== expected || mine >= optima[4]) fail(`island 5: loaded ${mine}, expected ${expected}, below the optimum ${optima[4]}`);
  await press("#sailBtn", 0.5);
  await rec.finger(false);
  await rec.hold(1.0);
  await page.waitForSelector("#islandOverlay:not(.hidden)");
  await sim(0.5);
  await page.click("#ioNext");
  await real(150);
  await sim(0.6);
  if ((await pd(() => window.__pd.state.phase)) !== "reveal") fail("the reveal did not open");
  // this game's Skip jumps to the run summary, so the first four rebuilds are simply waited out
  await revealUpTo(g, { status: PROVED, index: 4, skip: async () => {}, patience: 120, after: () => real(150) });
  await recordComparison(g, PROVED, { max: 5, tail: 1.6, skip: null });
  const you = Number(await text("#youScore")), opt = Number(await text("#optScore"));
  if (!PROVED.test(await text("#solverStatus"))) fail("island 5: the solver did not report a proven optimum");
  if (you !== mine || opt !== optima[4] || you >= opt) fail(`island 5: you ${you}, optimum ${opt}`);
  await rec.cut(`${GAME}-finish`, 0.9);
  console.log(`${GAME}: island 5 — you loaded ${you} gold (the ${LOOT[left.key].name} stayed on the quay), proven optimum ${opt}`);
} finally {
  await g.close();
}
