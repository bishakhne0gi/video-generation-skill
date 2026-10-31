// EP28 bed. HyperFrames mounts BGM as ONE <audio> with ONE data-volume, so a two-level
// mix has to be BAKED INTO THE FILE: build a voice key from the real narration at its
// real offsets, level the source's macro swells, draw the designed shape by hand, then
// sidechain-duck against the key and set a single fixed gain.
//
// Source: "hvit vinterlys" by teru, ccMixter, CC BY 3.0. Chosen by measurement, not by
// ear: 139 candidates passed the length and loudness floors, and this one had the
// widest speech-band carve (23.4 dB) of all of them. Its 1-4 kHz level sits between
// -34.6 and -38.9 dB across the whole track — a 4.3 dB range — which is why the duck
// can be gentle. Offset 0 is deliberate: the track is at its quietest in its first
// eight seconds, which is exactly where the cold open is.
//
// Every step of the designed shape is a RAMP, not a step. `between()` produces an
// instantaneous 30% jump, which is a click, not a lift.
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { DEFS, START, RUNTIME, LEN } from "./schedule.mjs";
const LENOF = (i) => LEN[i];
import durs from "./vo-durations.json" with { type: "json" };

const FF = "/opt/homebrew/bin/ffmpeg";
const T = "/tmp/ep28mix";
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
  // ducked. Measured: with these bumps at 0.30 the silent frames sat 6.5 dB above the
  // spoken ones, and 7 dB reads as the music barging in rather than as a lift. So the
  // designed bumps are small; they shape, they do not carry.
  bump(10.0, 17.4, 0.07),       // the masthead + the 1984 edition: 7.4s with no voice
  bump(55.0, 57.4, 0.05),       // the 1994 edition
  bump(80.6, 83.0, 0.06),       // the turn: the film becomes present tense
  dip(108.1, 120.6, 0.14),      // step back under the title beat, so the trailers land dry
  bump(156.9, R, 0.15),         // the sign-off
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
