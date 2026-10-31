// Author: Bishakh
//
// THE REVIEW ROOM. Builds a page that plays the rendered episode next to its
// own beat sheet, and serves it, so the film can be WATCHED — in a browser, by
// a person or by an agent driving Chrome — instead of inferred from a folder of
// PNGs.
//
//   node review.mjs                      # out/episode.mp4 → http://localhost:8123
//   node review.mjs out/episode-short.mp4
//   node review.mjs --port 9000
//   node review.mjs --no-serve           # just write out/review.html
//
// Contact sheets tell you a frame was fine. They cannot tell you a transition
// stutters, that the VO lands a beat late, that two elements collide for four
// frames, or that the film is boring — which is the failure that actually
// matters and the only one you cannot see in a still.
//
// The page exposes a small automation API on `window.R`, so an agent can step
// the film cut by cut and screenshot each one:
//
//   R.seek(12.5)   R.next()   R.prev()   R.beat(7)   R.state()
//
// `R.state()` returns { time, beat, line } — read it back after every seek so
// the screenshot you took is attributable to a beat and a narration line.

import { readFileSync, writeFileSync, existsSync, statSync, createReadStream, mkdirSync } from "node:fs";
import { createServer } from "node:http";
import { durationOf } from "./kling.mjs";

const HERE = new URL("./", import.meta.url);
const p = (rel) => new URL(rel, HERE).pathname;

const argv = process.argv.slice(2);
const flag = (n, d) => { const i = argv.indexOf("--" + n); return i === -1 ? d : argv[i + 1]; };
const VIDEO = argv.find((a) => !a.startsWith("--") && /\.(mp4|webm|mov)$/.test(a)) || "out/episode.mp4";
const PORT = Number(flag("port", 8123));

if (!existsSync(p(VIDEO))) {
  console.error(`✗ ${VIDEO} not found — render it first: npm run render`);
  process.exit(1);
}

const cfg = JSON.parse(readFileSync(p("episode.config.json"), "utf8"));
const durs = existsSync(p("vo-durations.json")) ? JSON.parse(readFileSync(p("vo-durations.json"), "utf8")) : [];
const VO = (cfg.vo || []).map((v) => (typeof v === "string" ? { text: v } : v));
const TOTAL = durationOf(p(VIDEO));

// Beat windows. Overlaps now vary by transition kind (9–26 frames), so this is
// an approximation — accurate enough to jump to a beat, not accurate enough to
// judge a frame by. Judge frames in the Studio.
const OVERLAP = 18 / 30;
const BREATH = Number(flag("breath", 0.35));
let t = 0;
const beats = durs.map((d, i) => {
  const a = t;
  const b = t + d + BREATH;
  t = b - (i < durs.length - 1 ? OVERLAP : 0);
  return { n: i + 1, a: +a.toFixed(2), b: +b.toFixed(2), line: VO[i]?.text || "" };
});

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const html = `<!doctype html>
<meta charset="utf-8">
<title>${esc(cfg.series || "Episode")} ${esc(cfg.episode || "")} — review</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body { margin: 0; background: #0A0C10; color: #E8EEF4;
         font: 14px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace; }
  header { padding: 14px 22px; border-bottom: 1px solid #1C2230; display: flex;
           gap: 18px; align-items: baseline; position: sticky; top: 0; background: #0A0C10; z-index: 2; }
  h1 { font-size: 15px; margin: 0; font-weight: 600; letter-spacing: .02em; }
  .muted { color: #7C8899; }
  main { display: grid; grid-template-columns: minmax(0,1fr) 420px; gap: 0; align-items: start; }
  .stage { padding: 22px; position: sticky; top: 52px; }
  video { width: 100%; background: #000; border-radius: 10px; display: block; }
  .bar { display: flex; gap: 10px; align-items: center; margin-top: 12px; flex-wrap: wrap; }
  button { background: #151B26; color: #E8EEF4; border: 1px solid #262F3F; border-radius: 7px;
           padding: 7px 13px; font: inherit; cursor: pointer; }
  button:hover { border-color: #4DE1C1; color: #4DE1C1; }
  #hud { margin-left: auto; font-variant-numeric: tabular-nums; color: #4DE1C1; }
  ol { list-style: none; margin: 0; padding: 0 22px 60px 0; }
  li { padding: 11px 14px; border-left: 2px solid transparent; cursor: pointer; border-radius: 0 7px 7px 0; }
  li:hover { background: #10151E; }
  li.on { background: #10151E; border-left-color: #4DE1C1; }
  .n { color: #4DE1C1; margin-right: 9px; }
  .t { color: #56637A; float: right; font-size: 12px; }
  .line { color: #B9C4D2; margin-top: 3px; }
</style>
<header>
  <h1>${esc(cfg.series || "")} ${esc(cfg.episode || "")} — ${esc(cfg.title || "")}</h1>
  <span class="muted">${esc(VIDEO)} · ${TOTAL.toFixed(1)}s · ${beats.length} beats</span>
</header>
<main>
  <div class="stage">
    <video id="v" src="/${esc(VIDEO)}" controls preload="auto"></video>
    <div class="bar">
      <button onclick="R.prev()">◀ prev cut</button>
      <button onclick="R.play()">play / pause</button>
      <button onclick="R.next()">next cut ▶</button>
      <button onclick="R.seek(0)">restart</button>
      <span id="hud">00:00.0</span>
    </div>
  </div>
  <ol id="list">${beats
    .map(
      (b) =>
        `<li data-n="${b.n}" data-a="${b.a}" onclick="R.beat(${b.n})">` +
        `<span class="n">${String(b.n).padStart(2, "0")}</span>` +
        `<span class="t">${b.a.toFixed(1)}s</span>` +
        `<div class="line">${esc(b.line)}</div></li>`,
    )
    .join("")}</ol>
</main>
<script>
  const BEATS = ${JSON.stringify(beats)};
  const v = document.getElementById("v");
  const hud = document.getElementById("hud");
  const fmt = (s) => String(Math.floor(s / 60)).padStart(2, "0") + ":" + (s % 60).toFixed(1).padStart(4, "0");
  const beatAt = (t) => BEATS.filter((b) => t >= b.a).slice(-1)[0] || BEATS[0] || null;

  window.R = {
    // Seek and RESOLVE when the frame is actually painted — an agent that
    // screenshots straight after setting currentTime captures the old frame.
    seek(t) {
      return new Promise((res) => {
        const done = () => { v.removeEventListener("seeked", done); requestAnimationFrame(() => res(R.state())); };
        v.addEventListener("seeked", done);
        v.currentTime = Math.max(0, Math.min(t, v.duration || t));
      });
    },
    beat(n) { const b = BEATS.find((x) => x.n === n); return b ? R.seek(b.a + 0.25) : null; },
    next() { const b = BEATS.find((x) => x.a > v.currentTime + 0.05); return R.seek(b ? b.a : v.duration); },
    prev() { const b = BEATS.filter((x) => x.a < v.currentTime - 0.35).slice(-1)[0]; return R.seek(b ? b.a : 0); },
    play() { v.paused ? v.play() : v.pause(); },
    state() { const b = beatAt(v.currentTime); return { time: +v.currentTime.toFixed(2), beat: b && b.n, line: b && b.line }; },
    beats: BEATS,
  };

  v.addEventListener("timeupdate", () => {
    hud.textContent = fmt(v.currentTime);
    const b = beatAt(v.currentTime);
    document.querySelectorAll("li").forEach((li) => li.classList.toggle("on", b && +li.dataset.n === b.n));
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") R.next();
    if (e.key === "ArrowLeft") R.prev();
    if (e.key === " ") { e.preventDefault(); R.play(); }
  });
</script>
`;

mkdirSync(p("out/"), { recursive: true });
writeFileSync(p("out/review.html"), html);
console.log("· wrote out/review.html");

if (argv.includes("--no-serve")) process.exit(0);

/* ── static server with Range support (Chrome cannot seek without it) ─────── */

const TYPES = { html: "text/html", mp4: "video/mp4", webm: "video/webm", png: "image/png", json: "application/json" };

createServer((req, res) => {
  const rel = decodeURIComponent(req.url.split("?")[0]).replace(/^\/+/, "") || "out/review.html";
  // Serve only from inside the skill directory.
  const file = p(rel);
  if (!file.startsWith(p("")) || !existsSync(file) || !statSync(file).isFile()) {
    res.writeHead(404).end("not found");
    return;
  }
  const size = statSync(file).size;
  const type = TYPES[rel.split(".").pop()] || "application/octet-stream";
  const range = req.headers.range;
  if (range) {
    const m = /bytes=(\d*)-(\d*)/.exec(range) || [];
    const start = m[1] ? +m[1] : 0;
    const end = m[2] ? +m[2] : size - 1;
    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": end - start + 1,
      "Content-Type": type,
    });
    createReadStream(file, { start, end }).pipe(res);
  } else {
    res.writeHead(200, { "Content-Length": size, "Content-Type": type, "Accept-Ranges": "bytes" });
    createReadStream(file).pipe(res);
  }
}).listen(PORT, () => {
  console.log(`\n  REVIEW ROOM → http://localhost:${PORT}\n`);
  console.log("  Open it and WATCH the film. In Chrome, drive it from the console or an agent:");
  console.log("    await R.beat(4)   await R.next()   R.state()\n");
  console.log("  Ctrl-C when you're done.");
});
