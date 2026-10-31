import { writeFileSync, existsSync } from "node:fs";
import { DEFS, LEN, START, RUNTIME, isActBreak } from "./schedule.mjs";
import { wrap, field } from "./lib/frame.mjs";
import durs from "./vo-durations.json" with { type: "json" };
import { CUES, SEAM, GAIN } from "./cues.mjs";

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
    const m = await import(modPath);
    body = m.body; script = m.script;
  } else {
    // placeholder so the film stays renderable while stations are still being authored
    body = `${field(d.bg === "cabinet" ? "cabinet" : d.bg === "dark" ? "interior" : d.bg === "bright" ? "inspection" : "lamplit")}
    <div id="stage" class="stage"><div class="inner">
      <div class="tag" style="position:absolute;left:118px;top:112px">${pad(i)} · ${d.id.toUpperCase()}</div>
      <div class="hdr" style="position:absolute;left:118px;top:470px;font-size:96px;opacity:.28">${d.id}</div>
    </div></div>`;
    script = `      tl.fromTo("#stage", { x: 300 }, { x: 0, duration: 0.43, ease: "power4.out" }, 0);
      tl.to("#stage", { x: -236, duration: 0.34, ease: "power4.in" }, ${(LEN[i] - 0.34).toFixed(2)});`;
  }
  writeFileSync(`compositions/frames/${name}.html`, wrap(name, body, script));
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
// cue lengths come from the cue set's own manifest — a hardcoded guess that runs
// long silently shortens the slot at render time.
const DURS = {
  tick: 0.12,
  click: 0.08,
  key1: 0.07,
  key2: 0.07,
  key3: 0.07,
  key4: 0.07,
  notify: 0.9,
  success: 1.3,
  error: 0.7,
  whoosh: 0.5,
  swipe: 0.3,
  thunk: 0.55,
  sub: 1.1,
  riser: 1.6,
  blip: 0.05,
  latch: 0.3
};

const cueList = [];
for (const b of built) {
  for (const [name, t] of (CUES[b.name] || [])) cueList.push({ name, at: ms(b.start + t) });
  if (b.i === 0) continue;
  // the seam itself, sounded by KIND — an act break must not sound like an ordinary cut.
  const kind = b.id === "end" ? "zback" : isActBreak(b.id) ? "lift" : "across";
  if (kind === "lift") {
    cueList.push({ name: "riser", at: ms(b.start - 1.30) });
    cueList.push({ name: "thunk", at: ms(b.start + 0.06) });
  } else if (kind === "zback") {
    cueList.push({ name: "sub",   at: ms(b.start - 0.24) });
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
  return `      <audio id="cue-${n}-${c.name}" src="assets/sfx/${c.name}.wav" data-start="${Math.max(c.at,0).toFixed(3)}" data-duration="${d.toFixed(3)}" data-track-index="${20 + t}" data-volume="${(GAIN[c.name] ?? 0.3)}"></audio>`;
}).join("\n");
console.log(`cues: ${cueList.length} across ${trackEnds.length} tracks`);

// the continuity chip spans the whole film on its own track: no cut can interrupt it.
if (existsSync(new URL("./frames/00-chip.mjs", import.meta.url))) {
  const c = await import("./frames/00-chip.mjs");
  writeFileSync("compositions/frames/00-chip.html", wrap("00-chip", c.body, c.script, true));
}
const chip = existsSync(new URL("./frames/00-chip.mjs", import.meta.url))
  ? `\n      <div id="el-chip" class="scene" data-composition-id="00-chip" data-composition-src="compositions/frames/00-chip.html" data-start="0" data-duration="${TOTAL.toFixed(3)}" data-track-index="4"></div>`
  : "";

const music = existsSync(new URL("./assets/audio/bed.mp3", import.meta.url))
  ? `\n      <audio id="au-bed" src="assets/audio/bed.mp3" data-start="0" data-duration="${TOTAL.toFixed(3)}" data-track-index="11" data-volume="1"></audio>`
  : "";

writeFileSync("index.html", `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=1920, height=1080">
    <script src="assets/vendor/gsap.min.js"></script>
    <style>
      *{margin:0;padding:0;box-sizing:border-box}
      html,body{width:1920px;height:1080px;overflow:hidden;background:#091413}
      /* opaque stage-ground: guards the white flash at every seam on a dark film */
      #root{position:relative;width:1920px;height:1080px;overflow:hidden;background:#091413}
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
