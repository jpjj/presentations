#!/usr/bin/env node
/**
 * Records the "gameplay video" of the facility-location dashboard for the deck:
 *   public/assets/videos/facility-dashboard.mp4 (+ .jpg, the still the slide opens on)
 *
 *   # once: in the website repo (jpjj.github.io)   npm ci && npm run build
 *   WEBSITE_REPO=../../../../jpjj.github.io node presentations/or-games-factory/recording/facility-dashboard.mjs
 *
 * The story, about 25 seconds: the opening network against the proved optimum →
 * a site is closed → a customer is handed to another site (a rule appears) →
 * "Start from the optimum" → two changes real life might ask for (two rules) →
 * "Re-optimise around my rules" → the price of each rule.
 *
 * The page solves live while it is recorded; the numbers in the video are the
 * ones the solver produced in this run.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromiumPath, requireFrom, screenRecorder, serveDir } from "./lib/screen.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const WEBSITE = path.resolve(process.env.WEBSITE_REPO || path.join(HERE, "../../../../jpjj.github.io"));
const OUT = path.join(HERE, "..", "public", "assets", "videos");
const { chromium } = requireFrom(WEBSITE)("playwright-core");

const srv = await serveDir(path.join(WEBSITE, "dist"));
const browser = await chromium.launch({ executablePath: chromiumPath(), args: ["--no-sandbox"] });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1.5 });
  page.on("pageerror", (e) => { throw e; });
  await page.goto(srv.url + "/use-cases/facility-location/", { waitUntil: "load" });
  const state = () => page.evaluate(() => JSON.parse(JSON.stringify(window.__fl.state())));
  await page.waitForFunction(() => window.__fl?.state().optimum?.status === "optimal", null, { timeout: 60000 });

  // the tool fills the screen: its top edge just under the top of the window
  const toolTop = await page.evaluate(() => Math.round(document.getElementById("fl-tool").getBoundingClientRect().top + window.scrollY - 12));
  await page.evaluate((y) => window.scrollTo(0, y), toolTop);
  await page.waitForTimeout(400);

  const rec = await screenRecorder(page, { out: OUT });
  const pin = (id) => page.locator(".fl-pin", { hasText: new RegExp("^" + id) }).first();
  const customer = async (name) => {
    const j = await page.evaluate((n) => window.__fl.customers.indexOf(n), name);
    if (j < 0) throw new Error("no customer " + name);
    return page.locator("#fl-map path.leaflet-interactive").nth(j);
  };

  // 1 · the opening network against the proved optimum
  await rec.hold(1.6);
  const opening = await state();

  // 2 · close a site: the cost moves
  await rec.clickOn(pin("STR"), 0.8);
  await rec.hold(1.4);

  // 3 · hand one customer to another site: a rule appears
  await rec.clickOn(await customer("Kassel"), 0.7);
  await rec.hold(0.5);
  await rec.clickOn(pin("CGN"), 0.7);
  await rec.hold(1.5);

  // 4 · start from the optimum
  await rec.clickOn(page.locator("#fl-from-opt"), 0.8);
  await rec.hold(1.4);
  const matched = await state();
  if (matched.mine.total !== matched.optimum.total) throw new Error("'Start from the optimum' did not match the optimum");

  // 5 · two things real life might ask for
  await rec.clickOn(pin("MUC"), 0.8);                 // "the lease in the south runs on"
  await rec.hold(0.8);
  await rec.clickOn(await customer("Kassel"), 0.7);   // "Kassel was promised deliveries from Berlin"
  await rec.hold(0.4);
  await rec.clickOn(pin("BER"), 0.7);
  await rec.hold(1.2);

  // 6 · re-optimise around the rules: each rule gets a price
  await rec.scrollTo(toolTop + 150, 0.6);
  await rec.clickOn(page.locator("#fl-reopt"), 0.7);
  const priced = await rec.until(async () => page.evaluate(() => {
    const s = window.__fl.state();
    return !!s.bound && !s.pricing && s.bound.prices.every((p) => p !== "pending");
  }), 30);
  if (!priced) throw new Error("the rules were not priced in time");
  await rec.hold(3.2);

  const end = await state();
  if (end.bound.result.status !== "optimal") throw new Error("the plan around the rules was not proved optimal");
  if (end.bound.prices.some((p) => typeof p !== "number" || p <= 0)) throw new Error("a rule has no price: " + JSON.stringify(end.bound.prices));
  rec.cut("facility-dashboard", { poster: 0 });
  console.log(`opening ${opening.mine.total} k€ vs optimum ${opening.optimum.total} k€; with the two rules ${end.bound.result.total} k€; rule prices ${end.bound.prices.join(", ")} k€`);
} finally {
  await browser.close();
  srv.close();
}
