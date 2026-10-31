import { field, grainDrift, T } from "../lib/frame.mjs";
import { stations, stationsRun, VB } from "../lib/last.mjs";
import { enterOf, exitOf } from "../lib/seams.mjs";
import { LEN as SCHED } from "../schedule.mjs";
export const LEN = SCHED[13];

// THE ARRIVAL. This frame enters on the film's one reserved Z-back — the
// outgoing beat recedes and this one settles in from above 1.0, both halves
// scaling the same way, so the cut reads as landing rather than as a bounce.
//
// The line on screen is not a slogan. It is the modellers' own rule, quoted
// verbatim in two places in the codebase — `specGen.ts` and
// `build_signatures.py` — and it is the reason the whole matcher is built
// around a bottom signature instead of a girth table.
//
// Under it: the real 40 stations, from the real last. Half-widths either side
// of the midline, each divided by ball width, which is what makes the
// signature scale-free — a size 8 and a size 11 of the same style read the
// same, and only genuine shape survives.
export const body = `${field("paper", "why")}
    <div id="stg13" class="stage"><div class="inner">
      <div class="tag" id="q0" style="position:absolute;left:0;right:0;top:172px;text-align:center;font-size:15px">
        THE MODELLERS' RULE · QUOTED IN THE SOURCE</div>

      <div class="hdr" id="q1" style="position:absolute;left:0;right:0;top:236px;text-align:center;font-size:96px">
        The sole is the</div>
      <div class="hdr" id="q2" style="position:absolute;left:0;right:0;top:352px;text-align:center;font-size:96px">
        most <span style="color:${T.accentText}">important</span> piece.</div>

      <div class="lead" id="q3" style="position:absolute;left:50%;top:508px;transform:translateX(-50%);
           text-align:center;max-width:1180px;font-size:27px">
        So the deformation drives length and girth to your numbers, and deliberately leaves
        the donor's bottom alone. You keep the thing you matched on.</div>

      <svg id="sig" viewBox="0 0 ${VB[2]} 300" width="1440" height="360"
           style="position:absolute;left:50%;top:646px;transform:translateX(-50%);overflow:visible">
        ${stations("sig", { mid: 150, k: 250, w: VB[2] })}
        <line x1="0" y1="150" x2="${VB[2]}" y2="150" stroke="${T.muted}" stroke-width="2.5"/>
      </svg>
      <div class="tag tag-sm" id="sigl" style="position:absolute;left:0;right:0;top:1016px;text-align:center;color:${T.faint};opacity:0">
        BOTTOM SIGNATURE · 40 STATIONS · HALF-WIDTHS ÷ BALL WIDTH, SO SIZE DROPS OUT</div>
    </div></div>`;

export const script = `${enterOf(13)}
${grainDrift("why", LEN)}
      // SEAM CARRIERS — the quote is at full opacity from frame zero and rides
      // the Z-back in. Nothing here fades up behind a moving stage.
      tl.fromTo("#q0", { y: 14 }, { y: 0, duration: 0.54, ease: "power3.out" }, 0);
      tl.fromTo("#q1", { y: 26 }, { y: 0, duration: 0.62, ease: "power3.out" }, 0);
      tl.fromTo("#q2", { y: 34 }, { y: 0, duration: 0.66, ease: "power3.out" }, 0.08);
      tl.fromTo("#q3", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.58, ease: "power3.out" }, 0.70);

      // the forty stations light heel-to-toe, which is the order the instrument
      // walks them in
${stationsRun("#sig", 1.45, 4.45, 40)}
      tl.fromTo("#sigl", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.50, ease: "power2.out" }, 6.15);

${exitOf(13, LEN)}`;
