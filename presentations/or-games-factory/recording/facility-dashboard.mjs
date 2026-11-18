#!/usr/bin/env node
/**
 * The facility-location tool for the deck: three still pictures and one video.
 *
 *   public/assets/facility-current.jpg     the map, "Current": everything enforced
 *   public/assets/facility-potential.jpg   the map, "Potential": the page's example
 *   public/assets/facility-optimal.jpg     the map, "Optimal": nothing enforced
 *   public/assets/facility-opening.jpg     the whole tool on the example (the "project" picture)
 *   public/assets/facility-rules.jpg       the same, with the priced constraints in view
 *   public/assets/videos/facility-dashboard.mp4 (+ .jpg, the still the slide opens on)
 *
 *   # once: in the website repo (jpjj.github.io)   npm ci && npm run build
 *   WEBSITE_REPO=../jpjj.github.io node presentations/or-games-factory/recording/facility-dashboard.mjs
 *
 * The video, about half a minute: Current (all solid, unused sites crossed out) →
 * Optimal (all dashed) → Potential, which starts as Current → every customer
 * assignment released → Stuttgart and Köln released, Dortmund made possible,
 * Hamburg released → Frankfurt fixed to München → the price of each constraint
 * that is left. It ends on the page's own example, the middle picture of the slide.
 *
 * The page solves live while it is recorded; the script stops if a number is not
 * the one the slides quote.
 */
import path from "node:path";
import { execFileSync } from "node:child_process";
import { mkdtempSync } from "node:fs";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { chromiumPath, requireFrom, screenRecorder, serveDir } from "./lib/screen.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const WEBSITE = path.resolve(process.env.WEBSITE_REPO || path.join(HERE, "../../../../jpjj.github.io"));
const ASSETS = path.join(HERE, "..", "public", "assets");
const { chromium } = requireFrom(WEBSITE)("playwright-core");

/** What the slides quote, in thousand euros a year. */
const CURRENT = 9004, OPTIMAL = 7166, POTENTIAL = 7815;
const need = (ok, msg) => { if (!ok) throw new Error(msg); };

const srv = await serveDir(path.join(WEBSITE, "dist"));
const browser = await chromium.launch({ executablePath: chromiumPath(), args: ["--no-sandbox"] });

/** Open the tool, wait for the first proof, and scroll it to the top of the window. */
async function openTool(viewport, deviceScaleFactor) {
  const page = await browser.newPage({ viewport, deviceScaleFactor });
  page.on("pageerror", (e) => { throw e; });
  await page.goto(srv.url + "/use-cases/facility-location/", { waitUntil: "load" });
  const state = () => page.evaluate(() => JSON.parse(JSON.stringify(window.__fl.state())));
  const settled = () => page.waitForFunction(() => window.__fl?.state().settled, null, { timeout: 120000 });
  await settled();
  const top = await page.evaluate(() => Math.round(document.getElementById("fl-tool").getBoundingClientRect().top + window.scrollY - 12));
  await page.evaluate((y) => window.scrollTo(0, y), top);
  await page.waitForTimeout(400);
  return { page, state, settled, top };
}
const pin = (page, id) => page.locator(".fl-pin", { hasText: new RegExp("^\\s*" + id) }).first();
const card = (page, view) => page.locator(`[data-view="${view}"]`);
async function customer(page, name) {
  const j = await page.evaluate((n) => window.__fl.customers.indexOf(n), name);
  need(j >= 0, "no customer " + name);
  return page.locator("#fl-map path.leaflet-interactive").nth(j);
}
function jpg(png, out, width) {
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", png, "-vf", `scale=${width}:-2:flags=lanczos`, "-q:v", "3", out], { stdio: "inherit" });
}

try {
  // ── the still pictures ───────────────────────────────────────────────────
  {
    const { page, state, settled, top } = await openTool({ width: 1280, height: 860 }, 2);
    // the map's zoom buttons are of no use in a picture
    await page.addStyleTag({ content: ".leaflet-control-zoom{display:none!important}" });
    const tmp = mkdtempSync(path.join(os.tmpdir(), "fl-"));
    const map = async (name) => {
      await page.mouse.move(5, 5);              // no tooltip in the picture
      await page.waitForTimeout(300);
      await page.locator("#fl-map").screenshot({ path: path.join(tmp, name + ".png") });
      jpg(path.join(tmp, name + ".png"), path.join(ASSETS, name + ".jpg"), 900);
    };
    const tool = async (name, scroll = 0) => {
      await page.evaluate((y) => window.scrollTo(0, y), top + scroll);
      await page.mouse.move(5, 5);
      await page.waitForTimeout(300);
      await page.screenshot({ path: path.join(tmp, name + ".png") });
      jpg(path.join(tmp, name + ".png"), path.join(ASSETS, name + ".jpg"), 1600);
      await page.evaluate((y) => window.scrollTo(0, y), top);
    };
    let s = await state();
    need(s.view === "current" && s.current.total === CURRENT, "the page does not open on the current network at " + CURRENT);
    need(s.optimum?.status === "optimal" && s.optimum.total === OPTIMAL, "the optimum is not proved at " + OPTIMAL);
    await map("facility-current");
    await card(page, "optimal").click();
    await map("facility-optimal");
    await card(page, "potential").click();
    await page.locator("#fl-example").click();
    await settled();
    s = await state();
    need(s.potential?.status === "optimal" && s.potential.total === POTENTIAL, `the example is not proved at ${POTENTIAL}: ${s.potential?.status} ${s.potential?.total}`);
    await map("facility-potential");
    await tool("facility-opening");
    await tool("facility-rules", 110);
    await page.close();
    console.log(`  stills: current ${CURRENT} k€, potential (the example) ${s.potential.total} k€ with ${s.left} constraints left, optimal ${OPTIMAL} k€`);
  }

  // ── the video ────────────────────────────────────────────────────────────
  const { page, state, top } = await openTool({ width: 1280, height: 800 }, 1.5);
  const rec = await screenRecorder(page, { out: path.join(ASSETS, "videos") });
  /** Keep recording until the solver has answered with this total (and, if asked, priced everything). */
  const answer = async (total, priced = false) => {
    const ok = await rec.until(() => page.evaluate(([t, p]) => {
      const s = window.__fl.state();
      return s.potential?.status === "optimal" && s.potential.total === t && (!p || s.settled);
    }, [total, priced]), 30);
    if (!ok) { const s = await state(); throw new Error(`expected a proved potential of ${total}, got ${s.potential?.status} ${s.potential?.total}`); }
  };

  // 1 · Current: every line and frame solid, the unused sites crossed out
  await rec.hold(2.0);
  // 2 · Optimal: nothing enforced — everything dashed, nothing crossed out
  await rec.clickOn(card(page, "optimal"), 0.9);
  await rec.hold(2.4);
  // 3 · Potential starts as the current network
  await rec.clickOn(card(page, "potential"), 0.8);
  await rec.hold(1.6);
  // 4 · release every customer assignment: the lines turn dashed — and the cost stays
  await rec.clickOn(page.locator("#fl-release-customers"), 0.9);
  await answer(CURRENT);
  await rec.hold(1.4);
  // 5 · Stuttgart is rented year by year: release it. The solver closes it.
  await rec.clickOn(pin(page, "STR"), 0.8);
  await answer(7866);
  await rec.hold(1.3);
  // 6 · Köln too — nothing changes yet …
  await rec.clickOn(pin(page, "CGN"), 0.7);
  await answer(7866);
  await rec.hold(0.5);
  // 7 · … until Dortmund becomes possible: the solver opens it and closes Köln
  await rec.clickOn(pin(page, "DTM"), 0.7);
  await answer(7767);
  await rec.hold(1.3);
  // 8 · Hamburg is up for decision as well: the solver keeps it
  await rec.clickOn(pin(page, "HAM"), 0.8);
  await answer(7767);
  await rec.hold(0.6);
  // 9 · a constraint is added: Frankfurt is served from München
  await rec.clickOn(await customer(page, "Frankfurt am Main"), 0.8);
  await rec.hold(0.4);
  await rec.clickOn(pin(page, "MUC"), 0.7);
  await answer(POTENTIAL, true);
  await rec.hold(0.8);
  // 10 · what each constraint that is left costs
  await rec.scrollTo(top + 110, 0.6);
  await rec.hold(3.0);

  const end = await state();
  const example = await page.evaluate(() => JSON.stringify(window.__fl.example));
  need(JSON.stringify(end.constraints) === example, "the video does not end on the page's example");
  need(end.current.total === CURRENT && end.optimum.total === OPTIMAL && end.potential.total === POTENTIAL, "a total is not the one the slides quote");
  const prices = end.prices.filter((p) => p.price > 0).sort((a, b) => b.price - a.price).map((p) => `${p.text}: ${p.price}`);
  rec.cut("facility-dashboard", { poster: 0 });
  console.log(`  video: ${CURRENT} → ${POTENTIAL} → ${OPTIMAL} k€; priced constraints: ${prices.join("; ")}`);
} finally {
  await browser.close();
  srv.close();
}
