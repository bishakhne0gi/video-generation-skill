import { field, grainDrift, T } from "../lib/frame.mjs";
import { lockup } from "../lib/ui.mjs";
import { lastFill, VB } from "../lib/last.mjs";
import { enterOf } from "../lib/seams.mjs";
import { LEN as SCHED } from "../schedule.mjs";
export const LEN = SCHED[15];

// The sign-off, entered on the film's one UP vector — elevation into the
// conclusion. The lockup is the Sanghavi mark, a hairline, then the product
// name: DESIGN.md §9 makes the divider load-bearing, because without it the
// client mark and the product name read as a single wordmark, and Sanghavi
// Shoe Accessories is the client, not the product.
export const body = `${field("bloom", "end")}
    <div id="stg15" class="stage"><div class="inner">
      <svg viewBox="0 0 ${VB[2]} ${VB[3]}" width="1680" height="${(1680 * VB[3] / VB[2]).toFixed(0)}"
           id="gh" style="position:absolute;left:50%;top:548px;transform:translateX(-50%)">
        ${lastFill({ o: 0.075 })}
      </svg>

      <div id="lk" style="position:absolute;left:50%;top:398px;transform:translateX(-50%)">
${lockup(64)}
      </div>

      <div class="hdr" id="e1" style="position:absolute;left:0;right:0;top:556px;text-align:center;font-size:104px">
        Find the last you already own.</div>

      <div class="rule" id="e2" style="position:absolute;left:50%;top:722px;width:420px;margin-left:-210px"></div>

      <div class="tag tag-sm" id="e5" style="position:absolute;left:0;right:0;bottom:74px;text-align:center;color:${T.faint}">
        FORMA &nbsp;·&nbsp; RETRIEVAL CONSOLE &nbsp;·&nbsp; TENANT SANGHAVI &nbsp;·&nbsp; VELLORE</div>
    </div></div>`;

export const script = `${enterOf(15)}
${grainDrift("end", LEN)}
      tl.fromTo("#lk", { y: 24 }, { y: 0, duration: 0.68, ease: "power3.out" }, 0);
      tl.fromTo("#e1", { y: 32 }, { y: 0, duration: 0.70, ease: "power3.out" }, 0.04);
      tl.fromTo("#e2", { scaleX: 0 }, { scaleX: 1, duration: 0.66, ease: "power3.out" }, 0.62);
      tl.fromTo("#e5", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.60, ease: "power2.out" }, 1.30);
      tl.fromTo("#gh", { scale: 1.0, autoAlpha: 0.0 }, { scale: 1.05, autoAlpha: 1, duration: ${LEN.toFixed(2)}, ease: "none", immediateRender: false }, 0);
`;
