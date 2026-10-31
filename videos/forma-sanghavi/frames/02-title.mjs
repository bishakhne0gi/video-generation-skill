import { field, grainDrift, T } from "../lib/frame.mjs";
import { lockup } from "../lib/ui.mjs";
import { lastFill, VB } from "../lib/last.mjs";
import { enterOf, exitOf } from "../lib/seams.mjs";
import { LEN as SCHED } from "../schedule.mjs";
export const LEN = SCHED[1];

// The title has no VO, which is what lets the score lift. The accent appears
// on exactly one word in the whole film and this is it — DESIGN.md reserves
// #00AEEF for state, so the film reserves it for the one word that names the
// state everything else is in.
export const body = `${field("bloom", "title")}
    <div id="stg1" class="stage"><div class="inner">
      <svg viewBox="0 0 ${VB[2]} ${VB[3]}" width="1560" height="${(1560 * VB[3] / VB[2]).toFixed(0)}"
           id="ghost" style="position:absolute;left:50%;top:560px;transform:translateX(-50%)">
        ${lastFill({ o: 0.09 })}
      </svg>

      <div id="lk" style="position:absolute;left:50%;top:318px;transform:translateX(-50%)">
${lockup(58)}
      </div>

      <div class="hdr hdr-xl" id="t1" style="position:absolute;left:0;right:0;top:472px;text-align:center">Find the last</div>
      <div class="hdr hdr-xl" id="t2" style="position:absolute;left:0;right:0;top:604px;text-align:center">
        you already <span style="color:${T.accentText}">own</span>.</div>

      <div class="tag" id="t3" style="position:absolute;left:0;right:0;top:790px;text-align:center;font-size:16px">
        RETRIEVAL &nbsp;·&nbsp; MATCHING &nbsp;·&nbsp; MESH MEASUREMENT</div>
      <div class="rule" id="t4" style="position:absolute;left:50%;top:756px;width:420px;margin-left:-210px"></div>
    </div></div>`;

export const script = `${enterOf(1)}
${grainDrift("title", LEN)}
      // SEAM CARRIERS — visible at frame zero, travelling on the cut
      tl.fromTo("#lk", { y: 26 }, { y: 0, duration: 0.70, ease: "power3.out" }, 0);
      tl.fromTo("#t1", { y: 38 }, { y: 0, duration: 0.66, ease: "power3.out" }, 0.02);
      tl.fromTo("#t2", { y: 48 }, { y: 0, duration: 0.70, ease: "power3.out" }, 0.10);
      tl.fromTo("#t4", { scaleX: 0 }, { scaleX: 1, duration: 0.62, ease: "power3.out" }, 0.62);
      tl.fromTo("#t3", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.56, ease: "power2.out" }, 0.76);
      // the ghost outline drifts a hair — the only continuous motion on a beat
      // that is otherwise deliberately still before the console arrives
      tl.fromTo("#ghost", { scale: 1.0, autoAlpha: 0.0 }, { scale: 1.045, autoAlpha: 1, duration: ${LEN.toFixed(2)}, ease: "none", immediateRender: false }, 0);

${exitOf(1, LEN)}`;
