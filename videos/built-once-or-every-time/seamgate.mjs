// THE SEAM GATE — measured from the ENCODED FILE, not from the composition.
//
// A Z seam only reads as one continuous rush if the outgoing and incoming halves are
// scaling in the SAME DIRECTION at the cut. Mirroring them produces two opposed moves
// abutted, which reads as a bounce — and each half looks perfectly correct on its own,
// so scrubbing will not catch it. Both EP24 Z seams shipped backwards this way.
//
// Proxy: the horizontal extent of INK across each frame. The outgoing frame recedes
// (1.0 -> 0.60) so its ink narrows; the incoming frame enters ABOVE 1.0 (1.48) with its
// content cropped by the frame edge, and narrows as it settles. Both narrowing = both
// scale velocities negative = the seam is continuous.
import { execSync } from "node:child_process";
import { readFileSync, readdirSync, mkdirSync, rmSync } from "node:fs";
const FF = "/opt/homebrew/bin/ffmpeg";
const [, , cutS, spanS] = process.argv;
const cut = +cutS, span = +(spanS || 0.6);
const W = 480, H = 270, FPS = 30;
const D = "/tmp/ep28seam";
rmSync(D, { recursive: true, force: true }); mkdirSync(D, { recursive: true });
execSync(`${FF} -hide_banner -loglevel error -ss ${(cut - span).toFixed(3)} -t ${(span * 2).toFixed(3)} ` +
  `-i renders/video.mp4 -vf "fps=${FPS},scale=${W}:${H},format=gray" -f image2 ${D}/f%04d.pgm`);
const files = readdirSync(D).filter((f) => f.endsWith(".pgm")).sort();
console.log(`cut at ${cut.toFixed(2)}s — ${files.length} frames at ${FPS}fps\n`);
console.log("  t(rel)   ink-left  ink-right   width   d(width)");
let prev = null;
files.forEach((f, i) => {
  const b = readFileSync(`${D}/${f}`);
  let n = 0, o = 0;
  while (n < 4) { while (b[o] === 32 || b[o] === 10) o++; while (b[o] !== 32 && b[o] !== 10) o++; n++; }
  const px = b.subarray(o + 1);
  // "ink" = anything materially darker or lighter than this frame's own modal ground
  const hist = new Array(256).fill(0);
  for (let k = 0; k < W * H; k++) hist[px[k]]++;
  const ground = hist.indexOf(Math.max(...hist));
  let lo = W, hi = -1;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (Math.abs(px[y * W + x] - ground) > 40) { if (x < lo) lo = x; if (x > hi) hi = x; }
  }
  const w = hi - lo;
  const t = -span + i / FPS;
  const d = prev === null ? null : w - prev;
  console.log(`  ${t >= 0 ? "+" : ""}${t.toFixed(3).padStart(6)}   ${String(lo).padStart(6)}   ${String(hi).padStart(8)}` +
    `  ${String(w).padStart(6)}   ${d === null ? "     —" : (d > 0 ? "+" : "") + String(d).padStart(5)}` +
    `${Math.abs(t) < 1 / FPS / 2 ? "   <-- THE CUT" : ""}`);
  prev = w;
});
