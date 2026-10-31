import { writeFileSync, readFileSync, existsSync, mkdirSync } from "node:fs";
import { DEFS, LEN, RUNTIME } from "./schedule.mjs";
import { wrap, T } from "./lib/frame.mjs";
import { CUES } from "./cues.mjs";

// Quantise every boundary to whole milliseconds and accumulate the ROUNDED
// values. Rounding start and duration independently lets them drift apart by a
// microsecond, and two clips overlapping on one track is a hard contract error.
const ms = (s) => Math.round(s * 1000) / 1000;
const DUR = LEN.map(ms);
const AT = [];
DUR.reduce((acc, d, i) => { AT[i] = ms(acc); return ms(acc + d); }, 0);
const TOTAL = ms(AT.at(-1) + DUR.at(-1));

mkdirSync("compositions/frames", { recursive: true });

const built = [];
for (let i = 0; i < DEFS.length; i++) {
  const name = `${String(i + 1).padStart(2, "0")}-${DEFS[i].id}`;
  const m = await import(`./frames/${name}.mjs`);
  if (Math.abs(m.LEN - LEN[i]) > 0.001)
    throw new Error(`${name}: frame LEN ${m.LEN} != schedule ${LEN[i].toFixed(3)}`);
  writeFileSync(`compositions/frames/${name}.html`, wrap(name, m.body, m.script));
  built.push({ ...DEFS[i], name, start: AT[i], len: DUR[i] });
}

const scenes = built.map((b) =>
  `      <div id="el-${b.name}" class="scene" data-composition-id="${b.name}" data-composition-src="compositions/frames/${b.name}.html" data-start="${b.start.toFixed(3)}" data-duration="${b.len.toFixed(3)}" data-track-index="1"></div>`
).join("\n");

// ---- the cue layer --------------------------------------------------------
// Cues are short and frequently adjacent, so they are packed greedily onto as
// many tracks as they need. Lengths come from the cue set's own manifest — a
// hardcoded guess produces a clip_media_fit warning on every one of them.
const SFX = JSON.parse(readFileSync("assets/sfx/manifest.json", "utf8"));
const tracks = [];
const cueEls = CUES.map((c, k) => {
  const d = SFX[c.name];
  if (d == null) throw new Error(`cue "${c.name}" is not in the sfx manifest`);
  const at = ms(Math.max(0, c.at)), end = ms(at + d);
  let t = tracks.findIndex((free) => free <= at);
  if (t === -1) { t = tracks.length; tracks.push(0); }
  tracks[t] = end;
  return `      <audio id="cu-${k}" src="assets/sfx/${c.name}.wav" data-start="${at.toFixed(3)}" data-duration="${d.toFixed(3)}" data-track-index="${20 + t}" data-volume="${c.gain}"></audio>`;
}).join("\n");

// The bed carries its own act-by-act arc (see lib/bed.mjs), so this is one
// static level rather than an automation lane.
const bed = existsSync("assets/audio/bed.mp3")
  ? `\n      <audio id="bed" src="assets/audio/bed.mp3" data-start="0.000" data-duration="${TOTAL.toFixed(3)}" data-track-index="5" data-volume="0.72"></audio>`
  : "";

writeFileSync("index.html", `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=1920, height=1080">
    <script src="assets/vendor/gsap.min.js"></script>
    <style>
      *{margin:0;padding:0;box-sizing:border-box}
      html,body{width:1920px;height:1080px;overflow:hidden;background:${T.deep}}
      /* An opaque stage ground. Without it a seam's opacity dip shows the page
         through, which on a dark film reads as a white flash at every cut. */
      #root{position:relative;width:1920px;height:1080px;overflow:hidden;background:${T.deep}}
      .scene{position:absolute;inset:0;width:100%;height:100%}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${TOTAL.toFixed(3)}" data-width="1920" data-height="1080">
${scenes}
${bed}

${cueEls}
    </div>
    <script>
      // The root needs its own registered timeline or the runtime reports
      // missing_timeline_registry and nothing plays.
      window.__timelines = window.__timelines || {};
      window.__timelines["main"] = gsap.timeline({ paused: true });
    </script>
  </body>
</html>`);

console.log(`built ${built.length} frames`);
built.forEach((b) => console.log(`  ${b.name.padEnd(12)} ${b.start.toFixed(2).padStart(6)}s  +${b.len.toFixed(2)}s  act ${b.act}  ${b.bg}`));
console.log(`runtime ${TOTAL.toFixed(2)}s = ${Math.floor(TOTAL / 60)}:${String(Math.round(TOTAL % 60)).padStart(2, "0")}`);
console.log(`cues ${CUES.length} on ${tracks.length} tracks   bed ${bed ? "yes" : "NOT YET"}`);
console.log(`schedule RUNTIME ${RUNTIME.toFixed(2)}  quantised ${TOTAL.toFixed(3)}`);
