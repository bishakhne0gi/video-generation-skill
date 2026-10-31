import { field, grainDrift, head, headIn, counter, counterRun, T } from "../lib/frame.mjs";
import { featherPath, drawnPath, drawRun, VB, GEO } from "../lib/last.mjs";
import { exitOf } from "../lib/seams.mjs";
import { LEN as SCHED } from "../schedule.mjs";
export const LEN = SCHED[0];

// The film opens on the object itself, drawn rather than shown: the real
// featherline of a real last, arriving as a curve the way the instrument
// actually walks it. The count runs up underneath — a system counting, not a
// number sitting there.
const STEPS = 30;

export const body = `${field("paper", "open")}
    <div id="stg0" class="stage"><div class="inner">
${head("SANGHAVI SHOE ACCESSORIES · VELLORE", "Every shoe starts<br/>on a last.",
       "One carved form. The archive holds five thousand two hundred and nine of them.",
       { y: 148, lw: 760 })}

      <div style="position:absolute;left:128px;top:742px;display:flex;align-items:flex-end;gap:26px">
        <div class="hdr" id="cnt" style="font-size:132px;line-height:0.94;color:${T.accent6}">
          ${counter("cntv", ["0", "1,204", "2,880", "4,102", "4,930", "5,209"], "hdr num")}
        </div>
        <div class="tag" id="cntl" style="padding-bottom:20px">LASTS ON RECORD</div>
      </div>

      <svg id="fl" viewBox="0 0 ${VB[2]} ${VB[3]}" width="980" height="${(980 * VB[3] / VB[2]).toFixed(0)}"
           style="position:absolute;right:96px;top:322px;overflow:visible">
        ${drawnPath("fl", GEO.featherPath, STEPS, { w: 2.6 })}
        ${featherPath({ id: "fl-full", w: 2.6 })}
      </svg>
      <div class="tag tag-sm" id="fll" style="position:absolute;right:104px;top:${(322 + 980 * VB[3] / VB[2] + 34).toFixed(0)}px;color:${T.faint}">
        FEATHERLINE · 256 POINTS · MODEL 525512275</div>
    </div></div>`;

export const script = `
${grainDrift("open", LEN)}
${headIn(0.10)}
      tl.set("#fl-full", { autoAlpha: 0 }, 0);
${drawRun("#fl", STEPS, 0.55, 3.30)}
      tl.set("#fl [data-s='${STEPS - 1}']", { autoAlpha: 0 }, 3.90);
      tl.set("#fl-full", { autoAlpha: 1 }, 3.90);
      tl.fromTo("#fll", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: "power2.out" }, 4.00);

      tl.fromTo("#cnt",  { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" }, 1.15);
      tl.fromTo("#cntl", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: "power2.out" }, 1.45);
${counterRun("cntv", 6, 1.30, 4.05)}

${exitOf(0, LEN)}`;
