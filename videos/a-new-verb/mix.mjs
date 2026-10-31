// EP27 bed. HyperFrames mounts BGM as ONE <audio> with ONE data-volume, so the two-level
// mix has to be baked into the file: build a voice key from the real narration at its real
// offsets, level the source's macro swells, draw the designed shape by hand, then duck.
//
// Source shape (measured in 4s windows) drove the offset choice, and offset 0 was kept
// deliberately even though it is not the loudest option: the track fades IN under the cold
// open, breaks DOWN at source 72-80s — which lands on the turn — and peaks through 92-132s,
// which is the payoff act. Loudness at the silent frames is what the duck is for.
import { execFileSync } from "node:child_process";
import { DEFS, START, RUNTIME } from "./schedule.mjs";
import durs from "./vo-durations.json" with { type: "json" };

const FF = "/opt/homebrew/bin/ffmpeg";
const R = RUNTIME;
const run = (a) => execFileSync(FF, ["-hide_banner", "-nostats", ...a], { stdio: ["ignore", "pipe", "pipe"] });

// ---- 1. the voice key: the real lines at the real starts ------------------------
const voices = DEFS.map((d, i) => d.vo ? { vo: d.vo, at: START[i] } : null).filter(Boolean);
const ins = voices.flatMap((v) => ["-i", `assets/voice/${String(v.vo).padStart(2, "0")}.wav`]);
const chain = voices.map((v, n) => `[${n}:a]adelay=${Math.round(v.at * 1000)}|${Math.round(v.at * 1000)}[a${n}]`).join(";")
  + ";" + voices.map((_, n) => `[a${n}]`).join("") + `amix=inputs=${voices.length}:normalize=0[k]`;
run([...ins, "-filter_complex", chain, "-map", "[k]", "-t", String(R), "-ar", "44100", "-ac", "2", "-y", "/tmp/ep27bgm/key.wav"]);
console.log(`voice key: ${voices.length} lines over ${R.toFixed(2)}s`);

// ---- 2. the designed shape, drawn by hand -------------------------------------
// dynaudnorm flattens the source's own dynamics so the duck behaves the same everywhere;
// this envelope then puts back only the shape the FILM wants, at the times the film wants it.
const SHAPE = [
  "min(1, t/2.6)",                                   // the bed arrives under the cold open
  "1 + 0.14*between(t, 10.43, 15.60)",               // it lifts under the title card
  "1 - 0.34*between(t, 68.60, 71.60)",               // it steps back on the turn
  "1 + 0.26*between(t, 71.70, 78.60)",
  "1 - 0.20*between(t, 92.30, 103.20)",              // the source peaks under CACHEKEY and
                                                     // pushed that frame 2.5 dB above its neighbours               // and rebuilds: the source breaks down here,
                                                     // and a 6 dB hole under a spoken frame reads as
                                                     // a dropout rather than as breathing
  "1 + 0.16*between(t, 125.87, " + R.toFixed(2) + ")",// and lifts under the end card
  `1 - max(0, (t-(${(R - 2.2).toFixed(2)}))/2.2)`,   // out
].join(" * ");

run(["-i", "assets/audio/source.mp3", "-t", String(R),
  "-af", `dynaudnorm=f=300:g=15:p=0.74:m=5,volume='${SHAPE}':eval=frame`,
  "-ar", "44100", "-ac", "2", "-y", "/tmp/ep27bgm/shaped.wav"]);

// ---- 3. duck against the key, then a fixed gain -------------------------------
const RATIO = process.env.RATIO || "3.2";
const GAIN = process.env.GAIN || "-10.5";
run(["-i", "/tmp/ep27bgm/shaped.wav", "-i", "/tmp/ep27bgm/key.wav", "-filter_complex",
  `[1:a]apad=whole_dur=${R.toFixed(2)}[key];` +
  `[0:a][key]sidechaincompress=threshold=0.035:ratio=${RATIO}:attack=22:release=680:makeup=1[d];` +
  `[d]volume=${GAIN}dB[out]`,
  "-map", "[out]", "-t", String(R), "-b:a", "192k", "-y", "assets/audio/bed.mp3"]);

// ---- 4. verify, per frame ------------------------------------------------------
const lvl = (f, ss, t) => {
  const out = run(["-ss", String(ss), "-t", String(t), "-i", f, "-af", "volumedetect", "-f", "null", "-"]);
  const err = execFileSync("bash", ["-c",
    `${FF} -hide_banner -nostats -ss ${ss} -t ${t} -i ${f} -af volumedetect -f null - 2>&1 | sed -nE 's/.*mean_volume: (-?[0-9.]+) dB.*/\\1/p'`]).toString().trim();
  return parseFloat(err);
};
console.log(`\nbed after duck  (ratio ${RATIO}, gain ${GAIN} dB)`);
const rows = DEFS.map((d, i) => {
  const v = lvl("assets/audio/bed.mp3", START[i] + 0.6, Math.min(6, (d.vo ? durs[d.vo - 1] : 3) - 0.8));
  return { id: d.id, vo: !!d.vo, v };
});
for (const r of rows) console.log(`  ${r.id.padEnd(12)} ${r.vo ? "vo  " : "HOLD"} ${r.v.toFixed(1)} dB`);
const spoken = rows.filter((r) => r.vo).map((r) => r.v);
const held = rows.filter((r) => !r.vo).map((r) => r.v);
const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
console.log(`\n  spoken: ${Math.min(...spoken).toFixed(1)} … ${Math.max(...spoken).toFixed(1)}  (spread ${(Math.max(...spoken) - Math.min(...spoken)).toFixed(1)} dB)`);
console.log(`  held:   ${mean(held).toFixed(1)}  →  lift ${(mean(held) - mean(spoken)).toFixed(1)} dB  (target 1.5-3.0)`);
