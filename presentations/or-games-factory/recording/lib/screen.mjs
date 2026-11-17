/**
 * Small helpers for recording a web page into a video, one screenshot per frame.
 *
 * Used by facility-dashboard.mjs (a plain HTML page). The games are recorded with
 * the games repo's own recorder (scripts/lib/howto.mjs), which also steps the
 * game's clock; see game.mjs.
 *
 * Needs `ffmpeg` on the PATH.
 */
import { execFileSync } from "node:child_process";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, statSync, unlinkSync } from "node:fs";
import { readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

/** `require` as seen from another checkout (to borrow its playwright-core). */
export const requireFrom = (repo) => createRequire(path.join(repo, "package.json"));

/** The Chromium to drive: CHROMIUM_PATH, the cloud sandbox's, or Playwright's own (undefined). */
export function chromiumPath() {
  for (const p of [process.env.CHROMIUM_PATH, "/opt/pw-browsers/chromium"]) if (p && existsSync(p)) return p;
  return undefined;
}

const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".wasm": "application/wasm",
  ".woff2": "font/woff2", ".mp4": "video/mp4", ".glb": "model/gltf-binary", ".mp3": "audio/mpeg",
};

/** Serve a built site from a folder. Returns `{ url, close }`. */
export async function serveDir(dir) {
  if (!existsSync(dir)) throw new Error(`${dir} not found — build that project first`);
  const server = createServer(async (req, res) => {
    let f = path.join(dir, decodeURIComponent((req.url || "/").split("?")[0]));
    if (existsSync(f) && statSync(f).isDirectory()) f = path.join(f, "index.html");
    if (!existsSync(f)) { res.writeHead(404); return res.end("not found"); }
    res.writeHead(200, { "content-type": MIME[path.extname(f)] || "application/octet-stream" });
    res.end(await readFile(f));
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  return { url: `http://127.0.0.1:${server.address().port}`, close: () => server.close() };
}

const CURSOR = `
  #__cursor{ position:fixed; left:0; top:0; z-index:2147483647; width:26px; height:26px; margin:-3px 0 0 -3px; pointer-events:none;
    background:no-repeat url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 26 26'%3E%3Cpath d='M3 2l0 19 5-4.6 3.4 7.6 3.2-1.4-3.4-7.5 6.8-.3z' fill='%23fff' stroke='%23101826' stroke-width='1.6' stroke-linejoin='round'/%3E%3C/svg%3E"); }
  #__ring{ position:fixed; left:0; top:0; z-index:2147483646; width:34px; height:34px; margin:-17px 0 0 -17px; border-radius:50%;
    border:3px solid rgba(255,205,80,.95); pointer-events:none; opacity:0; transform:scale(.4); }
  #__ring.on{ opacity:1; transform:scale(1); }
`;

/**
 * @param page  a Playwright page
 * @param opts.out  folder the video goes to
 * @param opts.fps  frames per second of the video (default 20)
 */
export async function screenRecorder(page, opts) {
  const fps = opts.fps ?? 20;
  const tmp = mkdtempSync(path.join(os.tmpdir(), "rec-"));
  mkdirSync(opts.out, { recursive: true });
  let n = 0;
  const vp = page.viewportSize();
  let at = { x: vp.width * 0.6, y: vp.height * 0.5 };
  await page.addStyleTag({ content: CURSOR });
  await page.evaluate(([x, y]) => {
    for (const id of ["__ring", "__cursor"]) { const d = document.createElement("div"); d.id = id; document.body.appendChild(d); }
    const put = (px, py) => { for (const id of ["__ring", "__cursor"]) { const d = document.getElementById(id); d.style.left = px + "px"; d.style.top = py + "px"; } };
    put(x, y);
    addEventListener("mousemove", (e) => put(e.clientX, e.clientY), true);
  }, [at.x, at.y]);
  const ease = (k) => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);

  const rec = {
    get at() { return { ...at }; },
    /** One frame of video. */
    async frame() {
      await page.screenshot({ path: path.join(tmp, String(n++).padStart(5, "0") + ".jpg"), type: "jpeg", quality: 92 });
    },
    /** Watch for `sec` seconds of video (the page keeps running in real time between frames). */
    async hold(sec) { for (let i = 0, k = Math.round(sec * fps); i < k; i++) { await page.waitForTimeout(30); await rec.frame(); } },
    /** Keep recording until `done()` is true, at most `max` seconds of video. */
    async until(done, max = 20) { for (let i = 0, k = Math.round(max * fps); i < k; i++) { await page.waitForTimeout(60); await rec.frame(); if (await done()) return true; } return false; },
    /** Move the cursor to a point. */
    async glide(x, y, sec = 0.6) {
      const from = { ...at }, k = Math.max(1, Math.round(sec * fps));
      for (let i = 1; i <= k; i++) {
        const e = ease(i / k);
        at = { x: from.x + (x - from.x) * e, y: from.y + (y - from.y) * e };
        await page.mouse.move(at.x, at.y);
        await rec.frame();
      }
    },
    /** Move there and click, with a ring to show the click. */
    async click(x, y, sec = 0.6) {
      await rec.glide(x, y, sec);
      await rec.hold(0.1);
      await page.evaluate(() => document.getElementById("__ring").classList.add("on"));
      await page.mouse.down(); await page.mouse.up();
      await rec.hold(0.25);
      await page.evaluate(() => document.getElementById("__ring").classList.remove("on"));
    },
    /** Click the middle of an element (a Playwright locator). */
    async clickOn(locator, sec = 0.6) {
      const b = await locator.boundingBox();
      if (!b) throw new Error("nothing to click: " + locator);
      await rec.click(b.x + b.width / 2, b.y + b.height / 2, sec);
    },
    /** Scroll the page smoothly to `y`. */
    async scrollTo(y, sec = 0.6) {
      const from = await page.evaluate(() => window.scrollY), k = Math.max(1, Math.round(sec * fps));
      for (let i = 1; i <= k; i++) { await page.evaluate((v) => window.scrollTo(0, v), from + (y - from) * ease(i / k)); await rec.frame(); }
    },
    /** Finish: frames → <out>/<name>.mp4 and a still <name>.jpg (the frame `poster` of the way through, 0…1). */
    cut(name, { poster = 0, width = 1600 } = {}) {
      if (!n) throw new Error(`"${name}" has no frames`);
      const mp4 = path.join(opts.out, name + ".mp4"), jpg = path.join(opts.out, name + ".jpg");
      const scale = `scale=${width}:-2:flags=lanczos`;
      execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-framerate", String(fps), "-i", path.join(tmp, "%05d.jpg"),
        "-vf", scale, "-c:v", "libx264", "-profile:v", "main", "-pix_fmt", "yuv420p", "-crf", "24", "-preset", "slow",
        "-movflags", "+faststart", "-an", mp4], { stdio: "inherit" });
      const still = path.join(tmp, String(Math.min(n - 1, Math.round(n * poster))).padStart(5, "0") + ".jpg");
      execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", still, "-vf", scale, "-q:v", "4", jpg], { stdio: "inherit" });
      console.log(`  ${name}: ${(n / fps).toFixed(1)} s, ${(statSync(mp4).size / 1e6).toFixed(2)} MB`);
      for (const f of readdirSync(tmp)) unlinkSync(path.join(tmp, f));
      n = 0;
    },
  };
  return rec;
}
