// THE FROZEN-FRAME TEST — the question is "did ANYTHING move", not "how much moved".
//
// pace.mjs scores mean frame-to-frame luma change against an absolute floor its own
// source says was set on "dark, dense, card-heavy films". A light type-led film scores
// far lower for the same visible motion, so that number settles nothing on its own.
//
// The obvious replacement — mean |delta| against a fixed 0.03 — has the SAME defect in
// a different coat: it is still an AREA metric. On this film a 1097x26 bar sweeping the
// page changes 1.4% of the pixels by ~100 levels, which is a mean delta of 0.0055, so
// a fixed 0.03 calls the film's biggest running system "frozen". Measured, not assumed.
//
// So count PIXELS THAT CHANGED instead. A pixel counts as changed if it differs by more
// than 8/255 from the same pixel 1.0s earlier. That is independent of how bright the
// film is AND of how large the moving thing is, which is the whole point.
import { execSync } from "node:child_process";
import { readFileSync, readdirSync, mkdirSync, rmSync } from "node:fs";
const FF = "/opt/homebrew/bin/ffmpeg";
const src = process.argv[2] || "renders/video.mp4";
const W = 480, H = 270, N = W * H, FPS = 10, LAG = FPS;
const DELTA = 8;            // a pixel has "changed" if it moved more than this
const FLOOR = 0.0004;       // ...and the frame is FROZEN if under this fraction did

const D = "/tmp/ep28frozen";
rmSync(D, { recursive: true, force: true }); mkdirSync(D, { recursive: true });
execSync(`${FF} -hide_banner -loglevel error -i ${src} -vf "fps=${FPS},scale=${W}:${H},format=gray" -f image2 ${D}/f%05d.pgm`);

const files = readdirSync(D).filter((f) => f.endsWith(".pgm")).sort();
const px = files.map((f) => {
  const b = readFileSync(`${D}/${f}`);
  // P5 header is FOUR whitespace-separated tokens: P5, width, height, maxval.
  let n = 0, i = 0;
  while (n < 4) { while (b[i] === 32 || b[i] === 10) i++; while (b[i] !== 32 && b[i] !== 10) i++; n++; }
  return b.subarray(i + 1);
});
if (px[0].length !== N) console.log(`WARN pixel count ${px[0].length} != ${N}`);

const frac = [];
for (let i = LAG; i < px.length; i++) {
  let c = 0; const a = px[i], b = px[i - LAG];
  for (let k = 0; k < N; k++) if (Math.abs(a[k] - b[k]) > DELTA) c++;
  frac.push(c / N);
}
const srt = [...frac].sort((a, b) => a - b);
const q = (p) => srt[Math.floor(srt.length * p)];
console.log(`sampled ${px.length} frames at ${W}x${H}, ${FPS}fps over ${(px.length / FPS).toFixed(1)}s`);
console.log(`changed-pixel fraction:  p05 ${q(.05).toFixed(5)}  p25 ${q(.25).toFixed(5)}  ` +
            `p50 ${q(.5).toFixed(5)}  p75 ${q(.75).toFixed(5)}  p95 ${q(.95).toFixed(5)}`);

const runs = []; let st = -1;
for (let i = 0; i <= frac.length; i++) {
  const frozen = i < frac.length && frac[i] < FLOOR;
  if (frozen && st < 0) st = i;
  if (!frozen && st >= 0) { if (i - st >= FPS) runs.push([(st + LAG) / FPS, (i + LAG) / FPS]); st = -1; }
}
const total = runs.reduce((a, [s, e]) => a + (e - s), 0), dur = px.length / FPS;
console.log(`\nFROZEN (>=1s with <${(FLOOR * 100).toFixed(2)}% of pixels changed vs 1.0s earlier):`);
console.log(`  ${total.toFixed(1)}s of ${dur.toFixed(1)}s = ${(total / dur * 100).toFixed(1)}%  in ${runs.length} pocket(s)`);
for (const [s, e] of runs) console.log(`    ${s.toFixed(1)}s .. ${e.toFixed(1)}s   (${(e - s).toFixed(1)}s)`);
