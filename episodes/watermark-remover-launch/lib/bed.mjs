// THE SCORE — built, not downloaded and dropped in.
//
// Source: "Minimal Techno Random Basic 1" by RutgerMuller, CC0 (public domain,
// no attribution required), fetched via the Openverse audio API.
//
// Why this one, out of eight CC0 candidates that were measured rather than
// guessed at: with 51 UI cues carrying the whole film in place of narration, the
// single most important property of the bed is how much room it leaves in the
// band those cues live in. This track sits 30.7dB down in 2.7-4.9kHz relative to
// its full band — 11dB more headroom than the nearest runner-up — while still
// reading as a steady pulse (4.25 onsets/s, crest 5.81: percussive but even).
//
// TEMPO. Detected at 124.92 BPM, downbeat at +0.364s. Rather than time-stretch
// the music 20% to reach the film's old 100 BPM grid, the FILM was re-cut to the
// bed's own tempo (see schedule.mjs). Nothing is warped, and every cut lands on
// a real beat of the real recording.
//
// SECTION. The track runs 284s and is remarkably even, but it has dropouts at
// ~26s, ~74s and a near-silent bar at ~104s. 31.1s-59s is clean throughout, and
// 31.1s is a true downbeat (0.364 + 16 bars).
//
// Regenerate with:  node lib/bed.mjs

import { execSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { DEFS, LEN, START, RUNTIME } from "../schedule.mjs";
import { SEAMS } from "./seams.mjs";

const FF = process.env.HOME + "/.claude/skills/tech-episode-video/node_modules/@ffmpeg-installer/darwin-arm64/ffmpeg";
const SRC = process.argv[2] || "assets/audio/source.mp3";
const OUT = "assets/audio/bed.mp3";

const START_AT = 31.10;          // a true downbeat inside the clean section
const TAIL     = 1.40;           // room past the last frame so the fade has somewhere to go
const TOTAL    = RUNTIME + TAIL;

// The arc. With no narration the bed never ducks — instead it BREATHES with the
// acts, so the film sounds composed rather than looped. The lift lands on the
// product beat, which is also the film's one value flip and its accent cut.
const GAIN = { prompt: 0.70, image: 0.80, post: 0.88, fix: 1.00, clean: 0.90, end: 0.84 };

// A piecewise gain over t, with a 0.5s ramp across each act boundary so the
// changes are felt and never heard as steps.
const RAMP = 0.5;
let expr = String(GAIN[DEFS[0].id]);
for (let i = 1; i < DEFS.length; i++) {
  const t0 = START[i] - RAMP / 2, g0 = GAIN[DEFS[i - 1].id], g1 = GAIN[DEFS[i].id];
  // linear blend inside the ramp window, then hold
  expr = `if(lt(t,${t0.toFixed(3)}),${expr},` +
         `if(lt(t,${(t0 + RAMP).toFixed(3)}),${g0}+(${(g1 - g0).toFixed(3)})*(t-${t0.toFixed(3)})/${RAMP},${g1}))`;
}

// THE DUCKS. Two thunks and two swipes still measured level with the bed after
// the cue levels were raised, because they are low/broadband hits landing on top
// of the track's own kick — two impacts at once is mud, not emphasis. Pushing
// them louder would boom; ducking the MUSIC for a quarter of a second under each
// one is what a mix engineer would do, and it makes the act breaks land.
const DUCKS = [
  ...SEAMS.map((x) => START[x.i] + LEN[x.i] - 0.12),   // every cut
  START[1] + 1.92,                                      // the watermark stamping on
];
const DUCK_DB = 0.58, ATT = 0.06, REL = 0.26;
const duck = DUCKS.map((t) => {
  const a = (t - ATT).toFixed(3), b = t.toFixed(3), c = (t + REL).toFixed(3);
  // in over ATT, hold at the floor, back out over REL
  return `if(between(t,${a},${b}),1-${(1 - DUCK_DB).toFixed(3)}*(t-${a})/${ATT},` +
         `if(between(t,${b},${c}),${DUCK_DB}+${(1 - DUCK_DB).toFixed(3)}*(t-${b})/${REL},1))`;
}).reduce((acc, e) => `(${acc})*(${e})`, "1");

const filters = [
  // Give the cue band room. Measured, not guessed: with a -3dB scoop the bed's own
// percussion still peaked at -18dB in 2.7-4.9kHz, which is exactly where the
// ticks and clicks live, and four cues came out level with it instead of above
// it. -5.5dB over a wider Q puts every cue clear of the bed.
  "equalizer=f=3600:width_type=h:width=2600:g=-5.5",
  // and a touch of low shelf so the pulse has weight on a phone speaker
  "equalizer=f=110:width_type=h:width=90:g=1.5",
  "loudnorm=I=-18:TP=-1.5:LRA=11",
  `volume=eval=frame:volume='(${expr})*(${duck})'`,
  "afade=t=in:st=0:d=0.35",
  `afade=t=out:st=${(TOTAL - 1.30).toFixed(3)}:d=1.30`,
].join(",");

mkdirSync("assets/audio", { recursive: true });
if (!existsSync(SRC)) { console.error(`missing source: ${SRC}`); process.exit(1); }

execSync(`"${FF}" -y -ss ${START_AT} -t ${TOTAL.toFixed(3)} -i "${SRC}" ` +
         `-af "${filters}" -c:a libmp3lame -b:a 192k "${OUT}" 2>/dev/null`, { stdio: "inherit" });

console.log(`bed.mp3 — ${TOTAL.toFixed(2)}s from +${START_AT}s of the source`);
console.log(`arc: ${DEFS.map((d) => `${d.id} ${GAIN[d.id]}`).join("  ")}`);
