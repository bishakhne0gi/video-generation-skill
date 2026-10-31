import { field, grainDrift, typeLine, typeRun, cursorSVG, cursorTo, cursorTap, T } from "../lib/frame.mjs";
import { topbar, dock, composer, chipLatch } from "../lib/ui.mjs";
import { enterOf, exitOf } from "../lib/seams.mjs";
import { LEN as SCHED } from "../schedule.mjs";
export const LEN = SCHED[2];

// ACT 1. The console arrives, and the film's only actor puts a sentence into
// it. Every chip that lights below is one Forma set for itself: typed live on
// 2026-09-09, the URL became
// ?brand=COLE+HAAN&size=42&cat=Gents&toe=Round — nothing here was authored.
const Q = "Cole Haan gents size 42 round toe";

export const body = `${field("app", "ask")}
    <div id="stg2" class="stage"><div class="inner">
${topbar()}
      <div class="tag" id="eb" style="position:absolute;left:0;right:0;top:236px;text-align:center;font-size:15px">
        RETRIEVAL &nbsp;·&nbsp; <span style="color:${T.accentText}">5,209</span> LASTS INDEXED</div>
      <div class="hdr" id="h1" style="position:absolute;left:0;right:0;top:284px;text-align:center;font-size:76px">
        What are you looking for?</div>
      <div class="lead" id="h2" style="position:absolute;left:0;right:0;top:396px;text-align:center;max-width:none;font-size:24px">
        Type naturally and Forma fills the filters below, or set them yourself.</div>

${composer("cp", {
  x: 360, y: 470, w: 1200,
  slot: `<span style="color:${T.ink}">${typeLine("q", Q, 30)}</span>`,
  chips: [
    { t: `Brand · <b style="font-weight:600">COLE HAAN</b>` },
    { t: `Category · <b style="font-weight:600">Gents</b>` },
    { t: `Size · <b style="font-weight:600">42</b>` },
    { t: `Toe shape · <b style="font-weight:600">Round</b>` },
    { t: "Geometry +" },
    { t: "Match an STL ⬆" },
  ],
})}
${dock(0)}
      <div id="cur" class="cursor">${cursorSVG}</div>
    </div></div>`;

// Each chip is a state change with an author: the sentence typed it. So each
// one latches ~0.2s after the word that caused it has finished, never as a
// group.
const LATCH = [4.85, 5.62, 6.35, 7.25];

export const script = `${enterOf(2)}
${grainDrift("ask", LEN)}
      tl.fromTo("#eb", { y: 14 }, { y: 0, duration: 0.52, ease: "power3.out" }, 0);
      tl.fromTo("#h1", { y: 22 }, { y: 0, duration: 0.58, ease: "power3.out" }, 0.02);
      tl.fromTo("#h2", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.54, ease: "power3.out" }, 0.24);
      tl.fromTo("#cp", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.62, ease: "power3.out" }, 0.36);

      // the cursor arrives from off-frame and clicks INTO the field; the focus
      // ring answers the click rather than appearing on its own
${cursorTo([[-160, 690], [700, 620, 0.86], [742, 578, 0.44]], 1.05)}
${cursorTap(2.36)}
      tl.fromTo("#cp-ring", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.26, ease: "power2.out" }, 2.46);
      tl.to("#cur", { x: 1420, y: 900, duration: 0.80, ease: "power2.inOut" }, 2.62);
      tl.to("#cur", { autoAlpha: 0, duration: 0.26 }, 3.42);

${typeRun("q", Q, 2.62, 17)}

      // the chips Forma set for itself
${LATCH.map((t, i) => chipLatch(`cp-c${i}`, t)).join("\n")}

${exitOf(2, LEN)}`;
