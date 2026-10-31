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
// Cues are short and frequently adjacent, so they are packed onto as many tracks as
// they need: two clips overlapping on one track is a hard error in the contract.
const cueList = [];
for (const b of built) {
  for (const [name, t] of (CUES[b.name] || [])) cueList.push({ name, at: ms(b.start + t) });
  if (b.i === 0) continue;
  const kind = SEAM_IN[b.id];
  if (kind === "lift") {
    cueList.push({ name: "riser", at: ms(b.start - 1.30) });
    cueList.push({ name: "thunk", at: ms(b.start + 0.06) });
  } else if (kind === "zback") {
    cueList.push({ name: "sub", at: ms(b.start - 0.24) });
  } else {
    cueList.push({ name: "whoosh", at: ms(b.start - 0.16) });
  }
}
cueList.sort((a, b) => a.at - b.at);

const trackEnds = [];
const cueEls = cueList.map((c, n) => {
  const d = DURS[c.name] ?? 0.3;
  let t = trackEnds.findIndex((e) => e <= c.at);
  if (t === -1) { t = trackEnds.length; trackEnds.push(0); }
  trackEnds[t] = ms(c.at + d);
  return `      <audio id="cue-${n}-${c.name}" src="assets/sfx/${c.name}.wav" data-start="${Math.max(c.at, 0).toFixed(3)}" data-duration="${d.toFixed(3)}" data-track-index="${20 + t}" data-volume="${(GAIN[c.name] ?? 0.3)}"></audio>`;
}).join("\n");
console.log(`cues: ${cueList.length} across ${trackEnds.length} tracks`);

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
      html,body{width:1920px;height:1080px;overflow:hidden;background:#E3DDCE}
      /* opaque stage-ground: the NEWSPRINT shows through at every seam, which is
         the intended look — a page sliding over a page, never a flash of nothing. */
      #root{position:relative;width:1920px;height:1080px;overflow:hidden;background:#E3DDCE}
      .scene{position:absolute;inset:0;width:100%;height:100%}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${TOTAL.toFixed(3)}" data-width="1920" data-height="1080">
${scenes}${chip}${music}\n\n${cueEls}
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
