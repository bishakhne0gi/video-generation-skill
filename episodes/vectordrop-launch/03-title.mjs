import { field, grainDrift, T, GRAD } from "../lib/frame.mjs";
import { MARK } from "../lib/logo.mjs";
import { legoPlate } from "../lib/lego.mjs";
import { enterOf, exitOf } from "../lib/seams.mjs";
import { LEN as SCHED } from "../schedule.mjs";
export const LEN = SCHED[2];   // never restate a duration the schedule owns

// The brand reserves the teal gradient for the hero headline and nothing else.
// So does the film: it appears on two words here, on the figure 500, and never
// again. The title has no VO, which is also what lets the score lift.
export const body = `${field("bloom", "title", LEN)}
    <div id="stage" class="stage"><div class="inner">
${legoPlate("lg", { h: 700, o: 0.24 })}
      <div style="position:absolute;left:50%;top:296px;transform:translateX(-50%)"><div id="mark">${MARK(104)}</div></div>

      <div id="wm" class="tag" style="position:absolute;left:0;right:0;top:440px;text-align:center;
           font-size:19px;letter-spacing:0.42em;color:${T.dim}">VECTORDROP</div>

      <div id="t1" class="hdr hdr-xl" style="position:absolute;left:0;right:0;top:520px;text-align:center">Turn any image into</div>
      <div id="t2" class="hdr hdr-xl" style="position:absolute;left:0;right:0;top:658px;text-align:center">
        <span class="grad">editable vectors.</span>
      </div>

    </div></div>`;

export const script = `${enterOf(2)}
${grainDrift(LEN)}
      tl.fromTo("#lg-studs", { x: 0, y: 0 }, { x: -30, y: -12, duration: 11.67, ease: "none" }, 0);
      // SEAM CARRIERS — visible at frame zero, travelling on the cut
      tl.fromTo("#mark", { y: 34, scale: 0.92 }, { y: 0, scale: 1, duration: 0.76, ease: "back.out(1.6)" }, 0);
      tl.fromTo("#wm",   { y: 20 }, { y: 0, duration: 0.58, ease: "power3.out" }, 0.04);
      tl.fromTo("#t1",   { y: 40 }, { y: 0, duration: 0.66, ease: "power3.out" }, 0.02);
      tl.fromTo("#t2",   { y: 52 }, { y: 0, duration: 0.70, ease: "power3.out" }, 0.10);

${exitOf(2, LEN)}`;
