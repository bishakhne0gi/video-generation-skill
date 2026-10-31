import { field, grainDrift, T } from "../lib/frame.mjs";
import { MARK } from "../lib/logo.mjs";
import { legoPlate } from "../lib/lego.mjs";
import { artSVGmode } from "../lib/art.mjs";
import { enterOf } from "../lib/seams.mjs";
import { LEN as SCHED } from "../schedule.mjs";
export const LEN = SCHED[13];   // never restate a duration the schedule owns

// Enters on the film's third and last reserved vector — up, the elevation into
// the conclusion. The mark and the wordmark are at full opacity from frame
// zero and ride the cut in; only the URL and the button are allowed to arrive.
export const body = `${field("void", "end", LEN)}
    <div id="stage" class="stage"><div class="inner">
${legoPlate("lg", { h: 660, o: 0.22 })}
      <!-- the vector the film just made, launching. Slow, low, behind the type:
           the closing image, not decoration. -->
      <div id="rise" style="position:absolute;left:50%;margin-left:-235px;top:640px;width:470px;height:470px;opacity:0">
        ${artSVGmode("mend", "color", { extra: 'width="470" height="470" style="display:block"' })}
      </div>
      <div style="position:absolute;left:50%;top:326px;transform:translateX(-50%)"><div id="mark">${MARK(112)}</div></div>
      <div id="wm" style="position:absolute;left:0;right:0;top:486px;text-align:center;
           font-size:76px;font-weight:500;letter-spacing:-0.03em">VectorDrop</div>
      <div id="tag2" class="lead" style="position:absolute;left:0;right:0;top:596px;text-align:center;
           max-width:none;font-size:30px">Turn any image into editable vectors.</div>
      <div id="url" class="mono" style="position:absolute;left:0;right:0;top:684px;text-align:center;
           font-size:29px;color:${T.lit}">vectordrop.co.in</div>
      <div id="cta" style="position:absolute;left:0;right:0;top:772px;text-align:center">
        <span class="btn" style="font-size:16px;padding:16px 40px">CONVERT NOW — IT'S FREE &nbsp;&rarr;</span>
      </div>
    </div></div>`;

export const script = `${enterOf(13)}
${grainDrift(LEN)}
      tl.fromTo("#lg-studs", { x: 0, y: 0 }, { x: -30, y: -12, duration: 11.0, ease: "none" }, 0);
      tl.fromTo("#mark", { y: 26, scale: 0.94 }, { y: 0, scale: 1, duration: 0.70, ease: "power3.out" }, 0);
      tl.fromTo("#wm",   { y: 18 }, { y: 0, duration: 0.62, ease: "power3.out" }, 0.06);
      tl.fromTo("#tag2", { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.56, ease: "power3.out" }, 0.34);
      tl.fromTo("#url",  { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.56, ease: "power3.out" }, 0.60);
      tl.fromTo("#cta",  { autoAlpha: 0, y: 24, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.60, ease: "back.out(1.6)" }, 0.92);
      tl.to("#cta", { scale: 1.04, duration: 0.85, ease: "power2.out" }, 3.30);
      tl.to("#cta", { scale: 1.0, duration: 0.85, ease: "power2.inOut" }, 4.15);
      tl.fromTo("#rise", { autoAlpha: 0, y: 120, scale: 1.0 },
        { autoAlpha: 0.14, y: -300, scale: 0.72, duration: 4.60, ease: "power1.inOut" }, 2.60);`;
