import { writeFileSync, existsSync } from "node:fs";
import { DEFS, LEN, SEAM_IN } from "./schedule.mjs";
import { wrap, page, header, headerIn, ENTER, EXITF, isDark } from "./lib/frame.mjs";
import durs from "./vo-durations.json" with { type: "json" };
import { CUES, GAIN, DURS } from "./cues.mjs";

// Quantise every boundary to whole milliseconds and accumulate the ROUNDED values.
// Rounding start and duration independently drifts them apart and the clips overlap.
const ms = (s) => Math.round(s * 1000) / 1000;
const DUR = LEN.map(ms);
const AT = [];
DUR.reduce((acc, d, i) => { AT[i] = ms(acc); return ms(acc + d); }, 0);
const TOTAL = ms(AT[AT.length - 1] + DUR[DUR.length - 1]);

const pad = (i) => String(i + 1).padStart(2, "0");
const built = [];

for (let i = 0; i < DEFS.length; i++) {
  const d = DEFS[i];
  const name = `${pad(i)}-${d.id}`;
  const modPath = `./frames/${name}.mjs`;
  let body, script;
  if (existsSync(new URL(modPath, import.meta.url))) {
    const m = await import(modPath + `?v=${Date.now()}`);
    ({ body, script } = m.build({ len: LEN[i], seamIn: SEAM_IN[d.id], def: d }));
  } else {
    // placeholder so the film stays renderable while frames are still being authored
    const dark = isDark(d.field);
    body = `${page(d.field)}
    <div id="stage" class="stage"><div class="inner">
      ${header(pad(i), d.id, d.id.toUpperCase(), "", dark)}
    </div></div>`;
    const enter = SEAM_IN[d.id] ? ENTER[SEAM_IN[d.id]]("#stage") : "";
    script = `${enter}${headerIn(0.1, false)}`;
  }
  // THE OTHER HALF OF EVERY SEAM.
  //
  // Each frame authors its own ENTRY, but the EXIT belongs to the frame BEFORE the cut
  // and is decided by the seam kind of the frame AFTER it — so it is appended centrally
  // here rather than duplicated into seventeen modules. Without it every cut is a
  // half-seam: the incoming frame flies in over an outgoing frame that is standing
  // still, which reads as a slide changing rather than as a continuous move. The seam
  // gate measured this from the encoded file — 0px of change across the 0.3s before
  // the cut — after every entry already looked perfect on its own.
  const nextKind = i + 1 < DEFS.length ? SEAM_IN[DEFS[i + 1].id] : null;
  const EXIT_DUR = { across: 0.34, lift: 0.46, zback: 0.52 };
  const exit = nextKind ? EXITF[nextKind]("#stage", LEN[i] - EXIT_DUR[nextKind]) : "";
  writeFileSync(`compositions/frames/${name}.html`, wrap(name, body, script + "\n" + exit));
  built.push({ ...d, name, i, start: AT[i], len: DUR[i] });
}

const scenes = built.map((b) => {
  const voice = b.vo
    ? `\n      <audio id="au-${b.name}" src="assets/voice/${String(b.vo).padStart(2, "0")}.wav" data-start="${b.start.toFixed(3)}" data-duration="${ms(durs[b.vo - 1]).toFixed(3)}" data-track-index="10" data-volume="1"></audio>`
    : "";
  return `      <div id="el-${b.name}" class="scene" data-composition-id="${b.name}" data-composition-src="compositions/frames/${b.name}.html" data-start="${b.start.toFixed(3)}" data-duration="${b.len.toFixed(3)}" data-track-index="1"></div>${voice}`;
}).join("\n\n");

// ---- the cue layer -------------------------------------------------------------
// Mounted as ONE clip, summed offline by sfxmix.mjs. Authored as 385 separate <audio>
// elements it is correct and it still fails: the mix stage spent 325 seconds on 422
// timed clips and then returned `audio_processing_failed / ffmpeg_timeout`. Baking the
// cue bus is the same move the bed already needed for a different reason, and it takes
// the contract from 422 timed clips to 38.
const sfx = existsSync(new URL("./assets/audio/sfx.mp3", import.meta.url))
  ? `\n      <audio id="au-sfx" src="assets/audio/sfx.mp3" data-start="0" data-duration="${TOTAL.toFixed(3)}" data-track-index="20" data-volume="1"></audio>`
  : "";

// the continuity tab spans the whole film on its own track: no cut can interrupt it.
let chip = "";
if (existsSync(new URL("./frames/00-tab.mjs", import.meta.url))) {
  const c = await import(`./frames/00-tab.mjs?v=${Date.now()}`);
  const r = c.build({ total: TOTAL, built });
  writeFileSync("compositions/frames/00-tab.html", wrap("00-tab", r.body, r.script, true));
  chip = `\n      <div id="el-tab" class="scene" data-composition-id="00-tab" data-composition-src="compositions/frames/00-tab.html" data-start="0" data-duration="${TOTAL.toFixed(3)}" data-track-index="4"></div>`;
}

const music = existsSync(new URL("./assets/audio/bed.mp3", import.meta.url))
  ? `\n      <audio id="au-bed" src="assets/audio/bed.mp3" data-start="0" data-duration="${TOTAL.toFixed(3)}" data-track-index="11" data-volume="1"></audio>`
  : "";

writeFileSync("index.html", `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=1920, height=1080">
    <script src="assets/vendor/gsap.min.js"></script>
    <!-- anime.js v4.5.0 (MIT), vendored. Loaded at the ROOT so every frame's script can
         see the global; each frame drives its own instances off its own GSAP clock. -->
    <script src="assets/vendor/anime.umd.min.js"></script>
    <style>
      *{margin:0;padding:0;box-sizing:border-box}
      html,body{width:1920px;height:1080px;overflow:hidden;background:#f9f7f3}
      /* opaque stage-ground: the CREAM SHEET shows through at every seam, which is
         the intended look — a sheet sliding over a sheet, never a flash of nothing.
         A white #root here would lose the brand temperature in one frame. */
      #root{position:relative;width:1920px;height:1080px;overflow:hidden;background:#f9f7f3}
      .scene{position:absolute;inset:0;width:100%;height:100%}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${TOTAL.toFixed(3)}" data-width="1920" data-height="1080">
${scenes}${chip}${music}${sfx}
    </div>
    <script>
      // The root carries no animation of its own — every move lives in a frame — but the
      // contract still requires main to register a timeline.
      window.__timelines = window.__timelines || {};
      window.__timelines["main"] = gsap.timeline({ paused: true });
    </script>
  </body>
</html>
`);

console.log(`built ${built.length} frames + index.html — runtime ${TOTAL.toFixed(2)}s`);
console.log("authored:", built.filter(b => existsSync(new URL(`./frames/${b.name}.mjs`, import.meta.url))).map(b => b.name).join(" ") || "none");
