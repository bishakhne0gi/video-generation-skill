import { field, grainDrift, head, headIn, stagger, T } from "../lib/frame.mjs";
import { enterOf, exitOf } from "../lib/seams.mjs";
import { LEN as SCHED } from "../schedule.mjs";
export const LEN = SCHED[12];   // never restate a duration the schedule owns

// Every figure here is from lib/credits/constants.ts, which the product treats
// as the single source of every price. Nothing is rounded for the film.
const ROWS = [
  ["One conversion", "1 credit"],
  ["Editing and export", "Free"],
];

export const body = `${field("bloom", "free", LEN)}
    <div id="stage" class="stage"><div class="inner">
${head("GET STARTED", "Three credits, free.", "", { x: 132, y: 150, size: 82 })}

      <div id="note" class="lead" style="position:absolute;left:132px;top:372px;font-size:30px">No card.</div>

      <div style="position:absolute;left:132px;top:492px;width:1030px">
${ROWS.map(([k, v], i) => `        <div id="pr${i}" style="display:flex;align-items:baseline;padding:28px 0;border-bottom:1px solid ${T.hair}">
          <span style="font-size:32px;color:${T.dim}">${k}</span>
          <span class="mono" style="margin-left:auto;font-size:32px;color:${v === "Free" ? T.lit : T.ink}">${v}</span>
        </div>`).join("\n")}
      </div>

      <div id="pack" class="panel" style="position:absolute;right:170px;top:492px;width:440px;padding:42px 44px;text-align:center">
        <div class="tag" style="font-size:14px;color:${T.faint}">TOP-UP PACK</div>
        <div style="margin-top:20px;font-size:104px;line-height:1.14;font-weight:500">20</div>
        <div class="tag" style="font-size:15px;margin-top:6px">CREDITS</div>
        <div class="mono" style="margin-top:26px;font-size:26px;color:${T.lit}">$3 <span style="color:${T.faint};font-size:19px">+ tax</span></div>
      </div>
    </div></div>`;

export const script = `${enterOf(12)}
${grainDrift(LEN)}
${headIn()}
      tl.fromTo("#note", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.50, ease: "power3.out" }, 0.34);
${stagger("#pr", 0.62, 2, { autoAlpha: 0, y: 20 }, 0.14, 0.46)}
      tl.fromTo("#pack", { autoAlpha: 0, y: 34, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.60, ease: "back.out(1.4)" }, 1.30);
      tl.to("#pack", { scale: 1.03, duration: 0.90, ease: "power2.out" }, 3.60);

${exitOf(12, LEN)}`;
