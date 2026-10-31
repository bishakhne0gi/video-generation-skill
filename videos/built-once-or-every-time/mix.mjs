// EP29 bed. HyperFrames mounts BGM as ONE <audio> with ONE data-volume, so a two-level
// mix has to be BAKED INTO THE FILE: build a voice key from the real narration at its
// real offsets, level the source's macro swells, draw the designed shape by hand, then
// sidechain-duck against the key and set a single fixed gain.
//
// Source: "Lost in Memory" by gurdonark, ccMixter, CC BY 3.0 (no share-alike).
// https://ccmixter.org/files/gurdonark/37767 — 239s, and it was NOT chosen by its
// ranking. 443 tracks were harvested, 74 downloaded and 26 cleared the length and
// loudness floors; three tracks scored a wider speech-band carve than this one and all
// three were rejected on their SPECTROGRAM: dense regular vertical striations, which is
// a drum kit, which would fight every cut in the film. This one reads the way the memo
// says a bed should — energy low, upper region dark, slow drift, no pulse. Carve 13.6 dB
// (body -21.1, speech -34.7). Ranking on the number alone would have shipped a beat.
//
// Verified against the padding trap: at t=232 the file still measures -29.8 dB, which is
// a real fade rather than the digital silence ElevenLabs Music pads with. The runtime is
// 207.4s, so the end card plays over music at about -19 dB.
//
// Every step of the designed shape is a RAMP, not a step. `between()` produces an
// instantaneous 30% jump, which is a click, not a lift.
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { DEFS, START, RUNTIME, LEN } from "./schedule.mjs";
const LENOF = (i) => LEN[i];
import durs from "./vo-durations.json" with { type: "json" };

const FF = "/opt/homebrew/bin/ffmpeg";
const T = "/tmp/ep29mix";
mkdirSync(T, { recursive: true });
const R = RUNTIME;
const run = (a) => execFileSync(FF, ["-hide_banner", "-nostats", ...a], { stdio: ["ignore", "pipe", "pipe"] });

// ---- 1. the voice key: the real lines at the real starts ------------------------
const voices = DEFS.map((d, i) => (d.vo ? { vo: d.vo, at: START[i] } : null)).filter(Boolean);
const ins = voices.flatMap((v) => ["-i", `assets/voice/${String(v.vo).padStart(2, "0")}.wav`]);
const chain =
  voices.map((v, n) => `[${n}:a]adelay=${Math.round(v.at * 1000)}|${Math.round(v.at * 1000)}[a${n}]`).join(";") +
  ";" + voices.map((_, n) => `[a${n}]`).join("") + `amix=inputs=${voices.length}:normalize=0[k]`;
run([...ins, "-filter_complex", chain, "-map", "[k]", "-t", String(R), "-ar", "44100", "-ac", "2", "-y", `${T}/key.wav`]);
console.log(`voice key: ${voices.length} lines over ${R.toFixed(2)}s`);

// ---- 2. the designed shape ------------------------------------------------------
const cl = (e) => `clip(${e},0,1)`;
/** a smooth bump: ramps up over `d` into [a,b] and back down over `d` out of it */
const bump = (a, b, amt, d = 0.9) =>
  `(1 + ${amt}*${cl(`(t-${(a - d).toFixed(2)})/${d}`)}*${cl(`(${(b + d).toFixed(2)}-t)/${d}`)})`;
/** a smooth dip */
const dip = (a, b, amt, d = 0.9) => bump(a, b, -amt, d);

const SHAPE = [
  `min(1, t/3.0)`,              // the bed arrives under the cold open
  // The DUCK supplies most of the lift on its own — the silent frames simply are not
  // ducked. Measured on EP28: with these bumps at 0.30 the silent frames sat 6.5 dB
  // above the spoken ones, and 7 dB reads as the music barging in rather than as a lift.
  // So the designed bumps are small; they shape, they do not carry.
  bump(10.43, 18.26, 0.08),     // the title band + slate 01: 7.8s with no voice at all
  bump(56.74, 59.35, 0.05),     // slate 02
  bump(86.09, 88.70, 0.05),     // slate 03
  dip(143.0, 147.5, 0.16),      // STILLNESS + the Z-BACK: the turn lands dry, on purpose
  bump(196.96, R, 0.15),        // the sign-off
  `(1 - ${cl(`(t-${(R - 2.6).toFixed(2)})/2.6`)})`,   // out
].join(" * ");

// ---- 3. level the source, draw the shape, duck, set one gain --------------------
// dynaudnorm is gentle here: this source varies 4.3 dB in the speech band on its own,
// so a hard normaliser would only add pumping to something that is already even.
run([
  "-i", "assets/audio/source.mp3", "-i", `${T}/key.wav`,
  "-filter_complex",
  `[0:a]atrim=0:${R},asetpts=N/SR/TB,aresample=44100,` +
  `dynaudnorm=f=400:g=17:p=0.78:m=4,` +
  `volume='${SHAPE}':eval=frame[bed];` +
  `[1:a]aresample=44100[key];` +
  `[bed][key]sidechaincompress=threshold=0.040:ratio=1.70:attack=24:release=700:makeup=1[d];` +
  `[d]volume=-10.4dB,alimiter=limit=0.92[o]`,
  "-map", "[o]", "-t", String(R), "-ar", "44100", "-ac", "2", "-b:a", "192k",
  "-y", "assets/audio/bed.mp3",
]);
console.log("bed written");

// ---- 4. verify per frame, in the file that was actually written -----------------
// volumedetect writes to STDERR. Capture it or every measurement is NaN.
import { execSync } from "node:child_process";
const at = (a, d) => {
  const o = execSync(`${FF} -hide_banner -nostats -ss ${a.toFixed(2)} -t ${d.toFixed(2)} ` +
    `-i assets/audio/bed.mp3 -af volumedetect -f null - 2>&1`, { encoding: "utf8" });
  const m = /mean_volume: (-?[\d.]+) dB/.exec(o);
  return m ? +m[1] : NaN;
};
const spoken = [], silent = [];
console.log("\nframe        len   bed dB");
DEFS.forEach((d, i) => {
  const v = at(START[i], Math.min(LENOF(i), 9));
  (d.vo ? spoken : silent).push(v);
  console.log(`${d.id.padEnd(11)} ${LENOF(i).toFixed(2).padStart(6)} ${v.toFixed(1).padStart(7)}${d.vo ? "" : "   (no voice)"}`);
});
const rng = (a) => `${Math.min(...a).toFixed(1)} .. ${Math.max(...a).toFixed(1)} dB  (spread ${(Math.max(...a) - Math.min(...a)).toFixed(1)})`;
console.log(`\nunder narration : ${rng(spoken)}`);
console.log(`no narration    : ${rng(silent)}`);
console.log(`lift            : +${(silent.reduce((x, y) => x + y, 0) / silent.length - spoken.reduce((x, y) => x + y, 0) / spoken.length).toFixed(1)} dB`);
