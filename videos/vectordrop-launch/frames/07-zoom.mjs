import { field, grainDrift, counter, counterRun, T } from "../lib/frame.mjs";
import { artSVG } from "../lib/art.mjs";
import { enterOf, exitOf } from "../lib/seams.mjs";
import { LEN as SCHED } from "../schedule.mjs";
export const LEN = SCHED[6];   // never restate a duration the schedule owns

// The payoff of the cold open, and the only honest way to make it: the same
// region of the same picture, at the same magnification, side by side. The
// left half is the JPEG from beat 01. The right half is what the product
// returned. Nothing is staged — both are simply scaled by the same number.
export const body = `${field("canvas", "zoom", LEN)}
    <div id="stage" class="stage"><div class="inner">

      <div class="tag" id="s-tag" style="position:absolute;left:132px;top:106px">SAME PIXELS · SAME ZOOM</div>
      <div class="rule" id="s-rule" style="position:absolute;left:132px;top:138px;width:330px"></div>
      <div class="hdr" id="s-hdr" style="position:absolute;left:132px;top:168px;font-size:66px"><span class="grad" style="display:inline-block;padding-bottom:0.06em">Every edge, still exact.</span></div>

      <div style="position:absolute;left:350px;top:322px;width:1220px;height:610px;overflow:hidden;
           border:1px solid ${T.rule};background:#fff">
        <!-- left: the raster -->
        <div style="position:absolute;left:0;top:0;width:610px;height:610px;overflow:hidden">
          <img id="zr" src="assets/plates/source.jpg" width="610" height="610"
               style="display:block;position:absolute;left:0;top:0;image-rendering:pixelated;
                      transform-origin:50% 50%"/>
        </div>
        <!-- right: the vector -->
        <div style="position:absolute;left:610px;top:0;width:610px;height:610px;overflow:hidden">
          <div id="zv" style="position:absolute;left:0;top:0;width:610px;height:610px;transform-origin:50% 50%">
            ${artSVG("svg2", { extra: 'width="610" height="610" style="display:block"' })}
          </div>
        </div>
        <div style="position:absolute;left:610px;top:0;bottom:0;width:1px;background:rgba(0,0,0,0.55);z-index:2"></div>
        <div class="tag" style="position:absolute;left:26px;top:24px;font-size:15px;color:#fff;
             background:rgba(0,0,0,0.78);padding:8px 14px">JPEG</div>
        <div class="tag" style="position:absolute;left:636px;top:24px;font-size:15px;color:#fff;
             background:rgba(0,0,0,0.78);padding:8px 14px">SVG</div>
      </div>

      <div style="position:absolute;right:132px;top:150px;text-align:right">
        <div class="tag" style="font-size:13px;color:${T.faint}">ZOOM</div>
        <div style="margin-top:10px;font-size:92px;line-height:1.16;color:${T.ink}">
          ${counter("z2", ["100%", "400%", "900%", "1600%", "2500%", "3200%", "4000%"])}
        </div>
      </div>
    </div></div>`;

export const script = `${enterOf(6)}
${grainDrift(LEN)}
      tl.fromTo("#s-rule", { scaleX: 0 }, { scaleX: 1, duration: 0.50, ease: "power3.out" }, 0.14);
      tl.fromTo("#s-hdr",  { y: 16 }, { y: 0, duration: 0.54, ease: "power3.out" }, 0);
      // both halves are driven by the SAME numbers — that is the whole argument
      tl.fromTo("#zr", { scale: 1 }, { scale: 9.4, duration: 5.60, ease: "power1.inOut" }, 0.90);
      tl.fromTo("#zv", { scale: 1 }, { scale: 9.4, duration: 5.60, ease: "power1.inOut" }, 0.90);
${counterRun("z2", 7, 0.90, 5.60)}

${exitOf(6, LEN)}`;
