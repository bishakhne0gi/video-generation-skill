// Author: Bishakh
//
// Pacing audit for a rendered episode. Answers the only question that matters
// about retention: WHERE IS NOTHING HAPPENING?
//
//   node pace.mjs out/episode.mp4
//   node pace.mjs out/episode.mp4 --hold 0.8   # flag stretches over 0.8s
//
// It decodes the film at 64×36 greyscale, 10fps, and measures how much the
// picture actually changes frame to frame. That number is motion energy. A
// stretch of near-zero energy is a screen the viewer is staring at with nothing
// arriving — which is where they leave, regardless of how good the narration is.
//
// This is deliberately measured on the RENDER, not on the source. Intent in the
// code doesn't matter; what shipped does.
//
// Reading the output:
//   STATIC   under the floor for longer than --hold. Fix these.
//   calm     low but alive — correct under a long narration line.
//   busy     high energy. Fine in bursts; if the whole film is busy, nothing
//            lands, because contrast is what makes a beat feel like a beat.

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const FFMPEG = require("@ffmpeg-installer/ffmpeg").path;

const HERE = new URL("./", import.meta.url);
const p = (rel) => new URL(rel, HERE).pathname;

const file = process.argv[2];
if (!file || !existsSync(file)) {
  console.error("usage: node pace.mjs <video> [--hold 1.2]\n  e.g. node pace.mjs out/episode.mp4");
  process.exit(1);
}
const argOf = (n, d) => {
  const i = process.argv.indexOf("--" + n);
  return i === -1 ? d : Number(process.argv[i + 1]);
};

const HOLD = argOf("hold", 1.2);   // seconds of stillness before it's a problem
// Mean abs 8-bit delta below this = static.
//
// CALIBRATION WARNING, learned on EP11. This floor is ABSOLUTE, and it was set
// against EP08-EP10 — dark, dense, card-heavy films where any change moves a
// large share of the pixels. A white, minimal, type-led film scores far lower
// for the same amount of visible motion: on EP11 a stretch flagged as 4.9s
// "static" was measurably alive (tokens travelling, camera crawling, a fill
// level rising) but the moving content covered ~15% of a mostly-white frame.
//
// So: on a light or sparse palette, DIFF TWO FRAMES from a flagged stretch and
// look before you act —
//   ffmpeg -ss A -i f.mp4 -frames:v 1 a.png ; ffmpeg -ss B -i f.mp4 -frames:v 1 b.png
//   ffmpeg -i a.png -i b.png -filter_complex "blend=all_mode=difference" d.png
// A black diff means genuinely frozen. Anything else means this number is
// telling you about the palette, not the film. Do not add effects to satisfy a
// metric; that is how a clean design becomes a busy one.
const FLOOR = argOf("floor", 1.6);
const LAG = argOf("lag", 1.0);     // seconds; the window the change is measured over
const W = 64, H = 36, RATE = 10;

/* ── decode to a tiny greyscale filmstrip ────────────────────────────────── */

const raw = execFileSync(
  FFMPEG,
  ["-v", "error", "-i", file, "-vf", `scale=${W}:${H},format=gray,fps=${RATE}`, "-f", "rawvideo", "-"],
  { maxBuffer: 1 << 28 },
);
const FRAME = W * H;
const n = Math.floor(raw.length / FRAME);
if (n < 2) { console.error("✗ could not decode enough frames"); process.exit(1); }

// Motion energy = mean absolute luma delta against the sample LAG seconds back,
// not against the previous frame.
//
// This matters. A slow camera push moves each pixel a hundredth of a pixel per
// frame, so frame-to-frame differencing scores a genuinely drifting shot the
// same as a frozen one — it flags a moving film as dead. Measured over ~1s, a
// push registers properly and a real freeze is still exactly zero, which is the
// distinction the viewer actually makes.
const lagFrames = Math.max(1, Math.round(LAG * RATE));
const energy = new Float64Array(Math.max(0, n - lagFrames));
for (let f = lagFrames; f < n; f++) {
  const a = f * FRAME, b = (f - lagFrames) * FRAME;
  let sum = 0;
  for (let i = 0; i < FRAME; i++) sum += Math.abs(raw[a + i] - raw[b + i]);
  energy[f - lagFrames] = sum / FRAME;
}

const at = (i) => (i + lagFrames) / RATE;
const clock = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${(s % 60).toFixed(1).padStart(4, "0")}`;

/* ── find the dead stretches ─────────────────────────────────────────────── */

const runs = [];
let start = -1;
for (let i = 0; i < energy.length; i++) {
  if (energy[i] < FLOOR) { if (start < 0) start = i; }
  else if (start >= 0) { runs.push([at(start), at(i)]); start = -1; }
}
if (start >= 0) runs.push([at(start), at(energy.length)]);
const dead = runs.filter(([a, b]) => b - a >= HOLD);

const total = at(energy.length);
const deadTime = dead.reduce((acc, [a, b]) => acc + (b - a), 0);
const mean = energy.reduce((a, b) => a + b, 0) / energy.length;

console.log(`${file}  ${clock(total)}  ·  mean motion energy ${mean.toFixed(2)}\n`);

if (dead.length) {
  console.log(`STATIC — ${dead.length} stretch(es), ${deadTime.toFixed(1)}s (${((deadTime / total) * 100).toFixed(1)}% of the film):`);
  for (const [a, b] of dead) {
    console.log(`  ${clock(a)} → ${clock(b)}   ${(b - a).toFixed(1)}s still`);
  }
  console.log(
    "\n  Fix, in order of preference:\n" +
    "   1. Cut the beat shorter — it is longer than it has anything to say.\n" +
    "   2. Give the screen a second thing to do (a counter, a packet, a chip landing).\n" +
    "   3. Stage what's already there: the same elements arriving across the beat\n" +
    "      instead of all at frame 0 (`stagger`), a loop that keeps running\n" +
    "      (`useLoop`), a Kling texture under the field (`Ambient`).\n" +
    "   4. Only then: slow the reveal down so it is still arriving here.\n" +
    "\n  NOT a fix: putting a camera move on it. A drift raises this number without\n" +
    "  giving the viewer anything, and a film where every beat drifts reads as a\n" +
    "  slideshow. Camera moves are for the two or three beats that mean one.\n",
  );
} else {
  console.log(`✓ no static stretch over ${HOLD}s — something is happening on every screen.\n`);
}

/* ── per-scene, when we know where the scenes are ────────────────────────── */

let durs = null;
try { durs = JSON.parse(readFileSync(p("vo-durations.json"), "utf8")); } catch { /* optional */ }
if (durs?.length) {
  // Scenes are laid end to end minus each cut's own overlap, which now varies
  // by transition kind (9–26 frames). ~18 is the middle of that range and this
  // only has to attribute a dead stretch to the beat that owns it, so the drift
  // across an episode stays well under a beat.
  const OVERLAP = 18 / 30;
  let t = 0;
  const rows = durs.map((d, i) => {
    const a = t, b = t + d + 0.35;
    t = b - (i < durs.length - 1 ? OVERLAP : 0);
    const seg = [];
    for (let k = 0; k < energy.length; k++) if (at(k) >= a && at(k) < b) seg.push(energy[k]);
    const m = seg.length ? seg.reduce((x, y) => x + y, 0) / seg.length : 0;
    const still = dead.filter(([da, db]) => db > a && da < b).reduce((acc, [da, db]) => acc + (Math.min(db, b) - Math.max(da, a)), 0);
    return { n: i + 1, a, b, m, still };
  });
  console.log("scene   window          energy   still");
  for (const r of rows) {
    const bar = "█".repeat(Math.min(12, Math.round(r.m)));
    const flag = r.still > HOLD ? `  ⚠ ${r.still.toFixed(1)}s` : "";
    console.log(
      `  ${String(r.n).padStart(2)}   ${clock(r.a)}–${clock(r.b)}   ${r.m.toFixed(2).padStart(5)} ${bar}${flag}`,
    );
  }
  console.log("\nA flat energy column top to bottom is its own problem: if every beat has the");
  console.log("same amount going on, nothing reads as an arrival. Vary it deliberately.");
}
