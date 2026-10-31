// Author: Bishakh
//
// SOUND DESIGN. Synthesises the episode's cue set — clicks, key taps,
// notifications, whooshes, thunks, risers — offline, deterministically, and
// licence-free. No downloads, no attribution, no stock-library sameness.
//
//   node sfx.mjs                      # generate the register in episode.config.json
//   node sfx.mjs --register terminal  # force one
//   node sfx.mjs --list               # registers and cues
//   FORCE=1 node sfx.mjs              # re-synthesise
//
// Output: public/audio/sfx/<cue>.wav + manifest.json, which src/lib/sound.tsx
// reads so a missing cue is a no-op instead of a broken render.
//
// WHY THIS EXISTS: a motion graphic without sound is half a motion graphic. The
// eye reads an arrival as an event only if the ear confirms it — that is the
// entire trick behind the videos that "hold attention". A card lands: tick. A
// counter runs: soft blips. A chapter turns: whoosh into a thunk. A number
// resolves: a notification chime. The audience never notices any of it; they
// notice that they didn't look away.
//
// AND WHY IT IS SYNTHESISED, not downloaded: the cue set has to belong to the
// episode's register. A wooden knock under a neon-grid film is a wrong note,
// and stock libraries make every video sound like every other video. Here each
// register is a different SYNTHESIS — different material, not the same sample
// with a filter on it.

import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";

const HERE = new URL("./", import.meta.url);
const p = (rel) => new URL(rel, HERE).pathname;
const argv = process.argv.slice(2);
const arg = (n, d) => { const i = argv.indexOf("--" + n); return i === -1 ? d : argv[i + 1]; };

const SR = 48000;
const OUT = p("public/audio/sfx/");

/* ── dsp ─────────────────────────────────────────────────────────────────── */

const TAU = Math.PI * 2;
/** Deterministic noise — Math.random would make every run a different cue set. */
let seed = 12345;
const noise = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return (seed / 0xffffffff) * 2 - 1; };

const buf = (secs) => new Float64Array(Math.ceil(secs * SR));

/** Exponential decay envelope — what almost every percussive sound is. */
const decay = (t, tau) => Math.exp(-t / tau);
/** Attack/decay so a cue never clicks at its own start. */
const ad = (t, a, tau) => (t < a ? t / a : decay(t - a, tau));

/** One-pole low-pass. `f` in Hz. */
function lp(x, f) {
  const a = 1 - Math.exp(-TAU * f / SR);
  const y = new Float64Array(x.length);
  let s = 0;
  for (let i = 0; i < x.length; i++) { s += a * (x[i] - s); y[i] = s; }
  return y;
}
/** One-pole high-pass, as input minus its own low-passed self. */
function hp(x, f) {
  const l = lp(x, f);
  const y = new Float64Array(x.length);
  for (let i = 0; i < x.length; i++) y[i] = x[i] - l[i];
  return y;
}
/**
 * State-variable band-pass with a swept centre — the whoosh. A static filter on
 * noise is wind; a MOVING one is something passing you, which is the whole
 * difference between a transition that reads and one that doesn't.
 */
function sweptBP(x, f0, f1, q = 2.2) {
  const y = new Float64Array(x.length);
  let low = 0, band = 0;
  for (let i = 0; i < x.length; i++) {
    const t = i / x.length;
    const f = f0 * Math.pow(f1 / f0, t);
    const F = 2 * Math.sin(Math.PI * Math.min(f, SR / 2.2) / SR);
    const Q = 1 / q;
    const high = x[i] - low - Q * band;
    band += F * high;
    low += F * band;
    y[i] = band;
  }
  return y;
}

const mixInto = (dst, src, gain = 1, at = 0) => {
  const o = Math.floor(at * SR);
  for (let i = 0; i < src.length && o + i < dst.length; i++) dst[o + i] += src[i] * gain;
};

/** A sine partial with its own envelope. */
function tone(secs, freq, { tau = 0.12, a = 0.002, glide = 1, fm = 0, fmHz = 0 } = {}) {
  const b = buf(secs);
  let ph = 0;
  for (let i = 0; i < b.length; i++) {
    const t = i / SR;
    const f = freq * Math.pow(glide, t / secs);
    ph += TAU * (f + (fm ? Math.sin(TAU * fmHz * t) * fm : 0)) / SR;
    b[i] = Math.sin(ph) * ad(t, a, tau);
  }
  return b;
}

function noiseBurst(secs, { tau = 0.02, a = 0.0005 } = {}) {
  const b = buf(secs);
  for (let i = 0; i < b.length; i++) b[i] = noise() * ad(i / SR, a, tau);
  return b;
}

/** Soft-clip: keeps a cue from ever sounding like it hit the ceiling. */
const shape = (x) => Math.tanh(x * 1.1);

function normalise(b, peak = 0.82) {
  let m = 0;
  for (const v of b) m = Math.max(m, Math.abs(v));
  if (m < 1e-9) return b;
  const g = peak / m;
  for (let i = 0; i < b.length; i++) b[i] = shape(b[i] * g);
  return b;
}

/** 4ms fades on both ends — a WAV that starts or stops mid-cycle pops. */
function deClick(b) {
  const n = Math.floor(0.004 * SR);
  for (let i = 0; i < n && i < b.length; i++) {
    b[i] *= i / n;
    b[b.length - 1 - i] *= i / n;
  }
  return b;
}

function writeWav(name, mono) {
  const N = mono.length;
  const out = Buffer.alloc(44 + N * 2);
  out.write("RIFF", 0); out.writeUInt32LE(36 + N * 2, 4); out.write("WAVE", 8);
  out.write("fmt ", 12); out.writeUInt32LE(16, 16); out.writeUInt16LE(1, 20);
  out.writeUInt16LE(1, 22); out.writeUInt32LE(SR, 24);
  out.writeUInt32LE(SR * 2, 28); out.writeUInt16LE(2, 32); out.writeUInt16LE(16, 34);
  out.write("data", 36); out.writeUInt32LE(N * 2, 40);
  for (let i = 0; i < N; i++) out.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(mono[i] * 32767))), 44 + i * 2);
  writeFileSync(OUT + name + ".wav", out);
  return N / SR;
}

/* ── the registers ───────────────────────────────────────────────────────── */
//
// A register is a MATERIAL, not a preset. Pick the one that matches the
// episode's theme and the cue set will already belong to the film.

const REGISTERS = {
  // Dry, digital, close. Terminals, systems, infrastructure. (terminal-dark)
  terminal: { root: 660, fifth: 990, body: 1.0, air: 5200, wood: 0, tau: 0.9, thump: 58 },
  // Softer and woodier, with paper in the noise. Editorial / daylight themes.
  editorial: { root: 523.25, fifth: 784, body: 0.8, air: 3400, wood: 0.55, tau: 1.15, thump: 72 },
  // Bright, saturated, synthetic. Launch and hype episodes. (neon-grid)
  neon: { root: 880, fifth: 1318.5, body: 1.15, air: 7000, wood: 0, tau: 0.75, thump: 46 },
  // Analogue, tape-ish, rounded. Retrospectives. (warm-paper)
  warm: { root: 587.33, fifth: 880, body: 0.75, air: 2600, wood: 0.35, tau: 1.3, thump: 64 },
};

/** theme name → register, so `episode.config.json` needs no extra field. */
const THEME_REGISTER = {
  "terminal-dark": "terminal", "uber-dark": "terminal",
  "white-light": "editorial", "zomato-cream": "editorial",
  // mars-cream is a paper field like the other two creams: woody and dry, not
  // digital. A terminal register under a near-white frame reads as a different
  // film's audio laid over this one.
  "mars-cream": "editorial",
  // stripe-mesh is white and indigo rather than cream, but the same argument
  // holds and one more decides it: the display type is thin with negative
  // tracking, which is an editorial voice, and the dry digital register sounds
  // like a terminal that is nowhere on screen.
  "stripe-mesh": "editorial",
  "neon-grid": "neon", "warm-paper": "warm",
};

/* ── the cues ────────────────────────────────────────────────────────────── */
//
// Levels are deliberately conservative. A cue that you notice as a SOUND is too
// loud; it should register as the graphic having weight. Mix guidance is in
// references/audio.md — but the short version is that everything here sits
// under the voice, always.

const CUES = {
  /** An element lands. The workhorse — most reveals get this. */
  tick: (R) => {
    const b = buf(0.12);
    mixInto(b, lp(noiseBurst(0.03, { tau: 0.006 }), R.air), 0.5);
    mixInto(b, tone(0.1, R.root * 2, { tau: 0.022 }), 0.35 * R.body);
    if (R.wood) mixInto(b, lp(noiseBurst(0.05, { tau: 0.014 }), 900), 0.3 * R.wood);
    return b;
  },
  /** A pointer click / a UI action. Shorter and harder than `tick`. */
  click: (R) => {
    const b = buf(0.08);
    mixInto(b, hp(noiseBurst(0.014, { tau: 0.004 }), 1800), 0.7);
    mixInto(b, tone(0.05, R.root * 3, { tau: 0.009 }), 0.25 * R.body);
    return b;
  },
  /** One keystroke. Four variants so typing never machine-guns the same sample. */
  ...Object.fromEntries([1, 2, 3, 4].map((n) => [
    `key${n}`,
    (R) => {
      const b = buf(0.07);
      const det = [1, 1.07, 0.93, 1.13][n - 1];
      mixInto(b, hp(lp(noiseBurst(0.012, { tau: 0.0032 }), R.air * det), 1200), 0.6);
      mixInto(b, tone(0.04, R.root * 2.4 * det, { tau: 0.007 }), 0.18 * R.body);
      if (R.wood) mixInto(b, lp(noiseBurst(0.03, { tau: 0.008 }), 700), 0.35 * R.wood);
      return b;
    },
  ])),
  /** A value arrives / a step completes. Two-tone, up a fifth. */
  notify: (R) => {
    const b = buf(0.9);
    mixInto(b, tone(0.55, R.root, { tau: 0.16 * R.tau, a: 0.004 }), 0.5 * R.body);
    mixInto(b, tone(0.7, R.fifth, { tau: 0.22 * R.tau, a: 0.004 }), 0.42 * R.body, 0.055);
    mixInto(b, tone(0.5, R.root * 4, { tau: 0.06 }), 0.12);
    mixInto(b, lp(noiseBurst(0.02, { tau: 0.005 }), R.air), 0.22);
    return b;
  },
  /** The payoff. Same shape as `notify`, a third higher and more open. */
  success: (R) => {
    const b = buf(1.3);
    mixInto(b, tone(0.7, R.root, { tau: 0.2 * R.tau }), 0.42 * R.body);
    mixInto(b, tone(0.8, R.root * 1.25, { tau: 0.24 * R.tau }), 0.4 * R.body, 0.07);
    mixInto(b, tone(1.0, R.fifth * 1.25, { tau: 0.3 * R.tau }), 0.36 * R.body, 0.15);
    return b;
  },
  /** Something is wrong. Minor second, flat, no sparkle. */
  error: (R) => {
    const b = buf(0.7);
    mixInto(b, tone(0.45, R.root * 0.6, { tau: 0.13 }), 0.5 * R.body);
    mixInto(b, tone(0.45, R.root * 0.635, { tau: 0.13 }), 0.45 * R.body);
    mixInto(b, lp(noiseBurst(0.08, { tau: 0.03 }), 800), 0.2);
    return b;
  },
  /** A cut that moves. Under a push / wipe / whip. */
  whoosh: (R) => {
    const b = buf(0.5);
    const n = buf(0.42);
    for (let i = 0; i < n.length; i++) {
      const t = i / n.length;
      n[i] = noise() * Math.sin(Math.PI * Math.pow(t, 0.75)) ** 1.6;
    }
    mixInto(b, sweptBP(n, 320, R.air, 1.6), 0.9);
    mixInto(b, lp(n, 220), 0.25);
    return b;
  },
  /** A harder version, for a whip or a speed ramp. */
  swipe: (R) => {
    const b = buf(0.3);
    const n = buf(0.24);
    for (let i = 0; i < n.length; i++) {
      const t = i / n.length;
      n[i] = noise() * Math.sin(Math.PI * t) ** 2.4;
    }
    mixInto(b, sweptBP(n, 900, R.air * 1.4, 3.2), 1.0);
    return b;
  },
  /** Weight. A slate landing, a stamp, an act break. */
  thunk: (R) => {
    const b = buf(0.55);
    mixInto(b, tone(0.4, R.thump * 2.2, { tau: 0.07, glide: 0.42 }), 0.75);
    mixInto(b, tone(0.5, R.thump, { tau: 0.16, glide: 0.7 }), 0.5);
    mixInto(b, lp(noiseBurst(0.05, { tau: 0.012 }), 1400), 0.3);
    return b;
  },
  /** Sub only — under a full-frame image or a title. Felt, not heard. */
  sub: (R) => {
    const b = buf(1.1);
    mixInto(b, tone(0.95, R.thump * 0.9, { tau: 0.3, a: 0.02, glide: 0.75 }), 0.9);
    return b;
  },
  /** Tension into a reveal. Put the payoff ON the end of it, not after. */
  riser: (R) => {
    const b = buf(1.6);
    const n = buf(1.6);
    for (let i = 0; i < n.length; i++) n[i] = noise() * Math.pow(i / n.length, 2.2);
    mixInto(b, sweptBP(n, 400, R.air * 1.2, 1.2), 0.65);
    mixInto(b, tone(1.55, R.root * 0.5, { tau: 6, a: 0.6, glide: 2.0 }), 0.3 * R.body);
    return b;
  },
  /** A counter running. One per increment; keep it very quiet. */
  blip: (R) => {
    const b = buf(0.05);
    mixInto(b, tone(0.035, R.root * 3.2, { tau: 0.008 }), 0.4 * R.body);
    return b;
  },
  /** A chapter or a state change locks in. */
  latch: (R) => {
    const b = buf(0.3);
    mixInto(b, hp(noiseBurst(0.02, { tau: 0.005 }), 2200), 0.45);
    mixInto(b, tone(0.22, R.root * 1.5, { tau: 0.04 }), 0.4 * R.body);
    mixInto(b, tone(0.26, R.thump * 1.6, { tau: 0.08, glide: 0.6 }), 0.4);
    return b;
  },
};

/* ── main ────────────────────────────────────────────────────────────────── */

if (argv.includes("--list")) {
  console.log("registers:", Object.keys(REGISTERS).join(", "));
  console.log("cues:     ", Object.keys(CUES).join(", "));
  console.log("\nTheme → register:");
  for (const [t, r] of Object.entries(THEME_REGISTER)) console.log(`  ${t.padEnd(15)} ${r}`);
  process.exit(0);
}

const cfg = existsSync(p("episode.config.json"))
  ? JSON.parse(readFileSync(p("episode.config.json"), "utf8"))
  : {};
const name = arg("register", cfg.sfxRegister || THEME_REGISTER[cfg.theme] || "terminal");
const R = REGISTERS[name];
if (!R) { console.error(`✗ unknown register "${name}" — try: ${Object.keys(REGISTERS).join(", ")}`); process.exit(1); }

mkdirSync(OUT, { recursive: true });
const manifest = { register: name, cues: {} };
console.log(`· register "${name}"\n`);
for (const [cue, make] of Object.entries(CUES)) {
  seed = 12345; // per-cue reset: adding a cue must not change the ones before it
  const secs = writeWav(cue, deClick(normalise(make(R))));
  manifest.cues[cue] = { file: `audio/sfx/${cue}.wav`, seconds: +secs.toFixed(3) };
  console.log(`  ${cue.padEnd(9)} ${secs.toFixed(2)}s`);
}
writeFileSync(OUT + "manifest.json", JSON.stringify(manifest, null, 2));
console.log(`\n✓ ${Object.keys(CUES).length} cues → public/audio/sfx/  (synthesised, licence-free)`);
console.log("  Place them with src/lib/sound.tsx — every arrival on screen wants one.");
