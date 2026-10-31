// Author: Bishakh
//
// THE TEMPO GRID. Gives the picture and the score one shared clock, so cuts,
// camera moves and arrivals can land ON the beat instead of near it.
//
//   node tempo.mjs --bpm 84                 # you chose the tempo (synth bed)
//   node tempo.mjs --detect                 # work it out from the bed
//   node tempo.mjs --detect path/to.mp3
//   node tempo.mjs --show                   # print the grid we're working to
//
// Output: public/audio/music/tempo.json — read by src/lib/tempo.ts.
//
// WHY: a film timed only to narration lands its moves wherever the sentence
// happened to end. That is the difference between "well made" and the reference
// pieces that feel tight — in those, the motion arrives with the music, and the
// eye reads the coincidence as intent even though it cannot name what it heard.
//
// The kit does NOT move the voice to fit the grid. Narration keeps its natural
// timing; scene lengths are quantised UPWARD to the next beat or bar, so the
// line always finishes comfortably and the cut still lands on the music.
//
// Detection is spectral flux + autocorrelation: decode to mono, measure how
// much the spectrum CHANGES frame to frame (onsets show up as spikes), then
// find the lag at which that signal best correlates with itself. That lag is
// the beat period. Phase comes from folding the envelope at that period.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const FFMPEG = require("@ffmpeg-installer/ffmpeg").path;

const HERE = new URL("./", import.meta.url);
const p = (rel) => new URL(rel, HERE).pathname;
const argv = process.argv.slice(2);
const arg = (n, d) => { const i = argv.indexOf("--" + n); return i === -1 ? d : argv[i + 1]; };

const OUT = p("public/audio/music/tempo.json");

/* ── show ────────────────────────────────────────────────────────────────── */

if (argv.includes("--show")) {
  if (!existsSync(OUT)) { console.error("✗ no tempo.json — run `node tempo.mjs --bpm 84` or `--detect`"); process.exit(1); }
  const t = JSON.parse(readFileSync(OUT, "utf8"));
  const beat = 60 / t.bpm;
  console.log(`bpm ${t.bpm}   offset ${t.offset.toFixed(3)}s   ${t.beatsPerBar}/4   source: ${t.source}`);
  console.log(`beat  ${beat.toFixed(3)}s   bar ${(beat * t.beatsPerBar).toFixed(3)}s`);
  console.log(`\nfirst 8 bars:`);
  for (let i = 0; i < 8; i++) console.log(`  bar ${i + 1}  ${(t.offset + i * beat * t.beatsPerBar).toFixed(3)}s`);
  process.exit(0);
}

/* ── fft (iterative radix-2) ─────────────────────────────────────────────── */

function fft(re, im) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = (-2 * Math.PI) / len;
    const wr = Math.cos(ang), wi = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let cr = 1, ci = 0;
      for (let k = 0; k < len / 2; k++) {
        const ur = re[i + k], ui = im[i + k];
        const vr = re[i + k + len / 2] * cr - im[i + k + len / 2] * ci;
        const vi = re[i + k + len / 2] * ci + im[i + k + len / 2] * cr;
        re[i + k] = ur + vr; im[i + k] = ui + vi;
        re[i + k + len / 2] = ur - vr; im[i + k + len / 2] = ui - vi;
        const ncr = cr * wr - ci * wi;
        ci = cr * wi + ci * wr; cr = ncr;
      }
    }
  }
}

/* ── detect ──────────────────────────────────────────────────────────────── */

const SR = 22050, WIN = 1024, HOP = 256;
const ENV_RATE = SR / HOP; // ≈86.13 envelope samples per second

function onsetEnvelope(file) {
  const raw = execFileSync(
    FFMPEG,
    ["-v", "error", "-i", file, "-ac", "1", "-ar", String(SR), "-f", "f32le", "-"],
    { maxBuffer: 1 << 29 },
  );
  const x = new Float32Array(raw.buffer, raw.byteOffset, Math.floor(raw.length / 4));
  const frames = Math.floor((x.length - WIN) / HOP);
  if (frames < 40) { console.error("✗ audio too short to detect a tempo"); process.exit(1); }

  const win = new Float64Array(WIN);
  for (let i = 0; i < WIN; i++) win[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (WIN - 1));

  const flux = new Float64Array(frames);
  let prev = new Float64Array(WIN / 2);
  const re = new Float64Array(WIN), im = new Float64Array(WIN);
  for (let f = 0; f < frames; f++) {
    const o = f * HOP;
    for (let i = 0; i < WIN; i++) { re[i] = x[o + i] * win[i]; im[i] = 0; }
    fft(re, im);
    let s = 0;
    for (let k = 0; k < WIN / 2; k++) {
      // log magnitude: onsets in music are multiplicative, not additive, and a
      // linear flux is dominated by whatever is loudest rather than by attacks
      const mag = Math.log1p(Math.hypot(re[k], im[k]) * 8);
      const d = mag - prev[k];
      if (d > 0) s += d;
      prev[k] = mag;
    }
    flux[f] = s;
  }

  // Remove the slow-moving floor so a swell doesn't read as a beat.
  const W = Math.round(ENV_RATE * 0.6);
  const env = new Float64Array(frames);
  for (let f = 0; f < frames; f++) {
    let sum = 0, n = 0;
    for (let k = Math.max(0, f - W); k <= Math.min(frames - 1, f + W); k++) { sum += flux[k]; n++; }
    env[f] = Math.max(0, flux[f] - sum / n);
  }
  return env;
}

/**
 * Tempo AND phase from one estimator: a Fourier tempogram.
 *
 * For each candidate tempo, project the onset envelope onto that frequency:
 *
 *   S(bpm) = Σ env[f]·e^(−2πif/period)
 *
 * |S| peaks at the true beat rate, and arg(S) gives where in the cycle the
 * beats sit — so tempo and downbeat come out of the same number and cannot
 * disagree with each other.
 *
 * This replaced a lag-domain autocorrelation, which had two faults that only
 * showed up against click tracks of known tempo: an integer lag drifts a
 * quarter-second across thirty seconds (a period is 61.5 frames at 84bpm, not
 * 61), and interpolating to a fractional lag biases the search BACK toward
 * integer lags, because interpolation flattens exactly the spikes being
 * matched. It reported 83.4bpm for an 84bpm signal. The projection has no lag
 * grid at all, so neither fault exists.
 */
function detectTempo(env) {
  const minBpm = 60, maxBpm = 180;
  let best = { bpm: 0, mag: -1, sr: 0, si: 0 };
  let energy = 0;
  for (let f = 0; f < env.length; f++) energy += env[f];

  for (let bpm = minBpm; bpm <= maxBpm; bpm += 0.02) {
    const period = (60 / bpm) * ENV_RATE;
    let sr = 0, si = 0;
    for (let f = 0; f < env.length; f++) {
      const a = (2 * Math.PI * f) / period;
      sr += env[f] * Math.cos(a);
      si -= env[f] * Math.sin(a);
    }
    // Prefer a human tempo: without this, half- and double-time score alike and
    // the answer flips between 70 and 140 depending on the arrangement.
    const centre = Math.exp(-Math.pow(Math.log(bpm / 100) / 0.55, 2) / 2);
    const mag = Math.hypot(sr, si) * (0.7 + 0.3 * centre);
    if (mag > best.mag) best = { bpm, mag, sr, si };
  }

  const period = (60 / best.bpm) * ENV_RATE;
  let phase = (-Math.atan2(best.si, best.sr) * period) / (2 * Math.PI);
  // Window latency. A frame's flux is elevated for as long as the attack is
  // inside its analysis window, so the envelope's centre of mass sits about
  // half a window BEFORE the onset — the phase comes back early by WIN/2/SR.
  // Measured as a constant −32ms across click tracks at 84 and 112bpm and at
  // two different phases; the derivation says 23ms, the rest is the flux tail.
  phase += (WIN / 2 / SR) * ENV_RATE;
  phase = ((phase % period) + period) % period;

  // How concentrated the envelope is at that one phase: 2·|S|/Σenv is ~1 for a
  // clean pulse train and near 0 for a pad with no attack anywhere.
  const conf = energy > 0 ? (2 * Math.hypot(best.sr, best.si)) / energy : 0;

  return { bpm: Math.round(best.bpm * 100) / 100, offset: phase / ENV_RATE, conf };
}

/* ── main ────────────────────────────────────────────────────────────────── */

const beatsPerBar = Number(arg("beats-per-bar", 4));
mkdirSync(p("public/audio/music/"), { recursive: true });

let out;
if (argv.includes("--detect")) {
  const file = argv.find((a) => !a.startsWith("--") && /\.(mp3|wav|m4a|ogg|flac)$/i.test(a))
    || (existsSync(p("public/audio/music/bed.mp3")) ? p("public/audio/music/bed.mp3") : p("public/audio/music/bed.wav"));
  if (!existsSync(file)) { console.error("✗ no bed to analyse — run music.mjs first"); process.exit(1); }
  console.log(`· analysing ${file.split("/").slice(-1)[0]} …`);
  const d = detectTempo(onsetEnvelope(file));
  out = { bpm: d.bpm, offset: +d.offset.toFixed(4), beatsPerBar, source: "detected", confidence: +d.conf.toFixed(2) };
  console.log(`  bpm ${d.bpm}   offset ${d.offset.toFixed(3)}s   confidence ${d.conf.toFixed(2)}`);
  if (d.conf < 1.6) {
    console.log("  ⚠ low confidence — this bed may have no clear pulse (pads often don't).");
    console.log("    Either score it with something that does, or set the grid by hand: --bpm N");
  }
} else {
  const bpm = Number(arg("bpm", 0));
  if (!bpm) { console.error("usage: node tempo.mjs --bpm 84 [--offset 0] [--beats-per-bar 4]\n       node tempo.mjs --detect [file]\n       node tempo.mjs --show"); process.exit(1); }
  out = { bpm, offset: Number(arg("offset", 0)), beatsPerBar, source: "declared" };
}

writeFileSync(OUT, JSON.stringify(out, null, 2));
const beat = 60 / out.bpm;
console.log(`\n✓ tempo.json — ${out.bpm} bpm · beat ${beat.toFixed(3)}s · bar ${(beat * beatsPerBar).toFixed(3)}s`);
console.log("  src/lib/tempo.ts now snaps scene lengths and camera keys to this grid.");
