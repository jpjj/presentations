/**
 * Shared set-up for the two-clip game recordings (see ../README.md).
 *
 * Every game gets two upright clips of about ten seconds:
 *   <game>-start.mp4   the title screen, the press on Start, the first moves of level 1
 *   <game>-finish.mp4  the last moves of level 5 — played a bit worse than the best — and the
 *                      comparison with the solver for that level
 *
 * The games are recorded from the BUILT site of the games repo (`npm run build:pages` there),
 * with that repo's own recorder (scripts/lib/howto.mjs): the game's clock is stepped one frame
 * at a time and every frame is a screenshot, because software rendering is far slower than
 * real time. Title cards, curtains between levels and modals run on the real clock instead,
 * so in the clips they change in a cut rather than a fade.
 *
 *   GAMES_REPO=<path>    the games repo (default: a checkout beside this repo)
 *   HOWTO_DRAFT=<dir>    a quick, rough pass into <dir> (few frames, low resolution)
 */
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const GAMES = path.resolve(process.env.GAMES_REPO || path.join(HERE, "../../../../../games"));
export const OUT = path.join(HERE, "..", "..", "public", "assets", "clips-play");
/** An upright phone, 9 : 16. The whole screen is in the picture. */
export const VIEW = { width: 390, height: 694 };

const lib = (f) => import(pathToFileURL(path.join(GAMES, "scripts", "lib", f)).href);
const headless = await lib("headless.mjs");
const howto = await lib("howto.mjs");
export const fail = headless.fail;
export const DRAFT = howto.DRAFT;

/**
 * Open a game on the phone screen with the title showing, ready to record.
 * @param game  folder name in the built site, e.g. "norias-of-the-dunes"
 * @param hook  the game's test hook on `window`, e.g. "__nd"
 * @param stage path from the hook to its Stage, e.g. "world.stage"
 * @param hide  more page furniture to keep out of the picture (CSS selectors)
 */
export async function openGame(game, hook, stage, hide = []) {
  const srv = await headless.serve(path.join(GAMES, "_site"));
  const browser = await headless.launch();
  const { page, sim } = await headless.open(browser, `${srv.url}${game}/`, VIEW, { hook, stage, name: game, dsf: howto.HOWTO_DSF });
  page.setDefaultTimeout(240000);
  await page.evaluate(() => { try { localStorage.setItem("jpj-sound", "off"); } catch { /* fine */ } });
  /** Wait on the real clock (for things the game does with CSS or timers). */
  const real = (ms) => page.waitForTimeout(ms);
  // the title card has finished its entrance; the scene behind it has moved a little
  await sim(2);
  await real(3600);
  const rec = await howto.recorder(page, {
    stage: `${hook}.${stage}`, out: OUT, clip: { x: 0, y: 0, width: VIEW.width, height: VIEW.height },
    hide: [".jpj-footer", ...hide],
  });
  /** Centre of an element on the page. */
  const centre = async (sel) => {
    const b = await page.locator(sel).first().boundingBox();
    if (!b) fail(`${game}: nothing at ${sel}`);
    return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
  };
  /** The finger presses a button. */
  const press = async (sel, sec = 0.6) => { const p = await centre(sel); await rec.tap(p.x, p.y, sec); };
  const text = (sel) => page.evaluate((s) => document.querySelector(s)?.textContent ?? "", sel);
  const close = async () => { await browser.close(); srv.close(); };
  return { page, sim, rec, real, press, centre, text, close };
}

/** The title screen for a moment, then the finger presses Start. Recorded. */
export async function titleAndStart(g, startSel = "#teaserStart") {
  await g.rec.hold(1.6);
  await g.rec.finger(true);
  await g.press(startSel, 0.7);
  await g.rec.hold(0.2);
}

/**
 * In the reveal, get past the comparisons of the first levels without recording them, and stop
 * at the start of comparison number `index` (0-based).
 * @param g       from openGame
 * @param opts.status  what #solverStatus says once a level's live solve is proven
 * @param opts.index   the comparison to stop at
 * @param opts.skip    how to finish a running comparison (default: click #cmpSkip if enabled)
 * @param opts.after   what to wait for after pressing "next" (curtains …)
 * @param opts.wait    (k) => … something more to wait for before comparison k is looked at
 * @param opts.patience  how many half seconds of game time a comparison may take to finish (default 40)
 */
export async function revealUpTo(g, opts) {
  const { page, sim } = g;
  for (let k = 0; k < opts.index; k++) {
    if (opts.wait) await opts.wait(k);
    await page.waitForFunction((re) => new RegExp(re).test(document.getElementById("solverStatus")?.textContent ?? ""), opts.status.source, { timeout: 120000, polling: 300 });
    if (opts.skip) await opts.skip();
    else if (await page.isEnabled("#cmpSkip").catch(() => false)) await page.click("#cmpSkip");
    for (let i = 0; i < (opts.patience ?? 40) && (await page.isDisabled("#cmpNext")); i++) await sim(0.5);
    if (await page.isDisabled("#cmpNext")) fail(`reveal ${k + 1}: the comparison never finished`);
    await page.click("#cmpNext");
    if (opts.after) await opts.after();
    await sim(0.5);
  }
}

/**
 * Record the running comparison until the solver's answer is proven and fully shown.
 * If it runs longer than `max` seconds of video, the rest is finished off-camera (the game's own
 * Skip, or — with `skip: null` — by letting it play out) and the finished comparison is recorded
 * for `tail` seconds — one more cut, no speed-up.
 */
export async function recordComparison(g, status, { max = 7, tail = 1.8, skip = "#cmpSkip" } = {}) {
  const { page, rec, sim } = g;
  const done = () => page.evaluate((re) => new RegExp(re).test(document.getElementById("solverStatus")?.textContent ?? "") && !document.getElementById("cmpNext").disabled, status.source);
  let finished = await rec.until(done, max);
  if (!finished) {
    if (skip && (await page.isEnabled(skip).catch(() => false))) await page.click(skip);
    for (let i = 0; i < 120 && !(await done()); i++) await sim(0.5);
    finished = await done();
  }
  await rec.hold(tail);
  return finished;
}
