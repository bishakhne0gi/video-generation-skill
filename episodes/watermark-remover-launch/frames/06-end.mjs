import { field, grainDrift, mark, markRun, T } from "../lib/frame.mjs";
import { enterOf } from "../lib/seams.mjs";
import { LEN as SCHED } from "../schedule.mjs";
export const LEN = SCHED[5];

// THE END CARD — the hero, verbatim.
//
// This is the one frame that is allowed to be the website: the same Archivo 700
// at -0.03em, the same indigo marker band behind the same words, the same
// sentence underneath. A launch film's last frame should be indistinguishable
// from the page it is sending you to, so that arriving there feels like
// continuing rather than starting over.
//
// It enters on the UP seam and then holds, almost still, with only the URL
// underline drawing. After 28 seconds of motion, stillness is the punctuation.

export const body = `${field("paper", "p6")}
    <div id="stage" class="stage"><div class="inner">

      <div style="position:absolute;left:210px;top:300px;width:1500px">
        <div class="hdr" style="font-size:118px;line-height:1.02">
          <div id="p6-l1">Remove ${mark("p6-m", "AI watermarks")}</div>
          <div id="p6-l2" style="margin-top:6px">from your images</div>
        </div>
        <div id="p6-lead" class="lead" style="margin-top:38px;font-size:27px;max-width:900px">
          Paint over it. It is filled in from the surrounding image, right here in your browser.</div>
      </div>

      <div id="p6-url" style="position:absolute;left:210px;top:806px">
        <div class="mono" style="font-size:34px;color:${T.accentT};letter-spacing:-0.01em">watermarkairemover.com</div>
        <div id="p6-ul" class="rule" style="margin-top:14px;width:436px;height:2px;background:${T.accent}"></div>
      </div>

      <div id="p6-meta" style="position:absolute;right:210px;top:812px;display:flex;gap:12px">
        <span class="chip">Free</span>
        <span class="chip">No sign-up</span>
        <span class="chip">Runs on your device</span>
      </div>
    </div></div>`;

export const script = `${enterOf(5)}
${grainDrift("p6", LEN)}

      // the two display lines arrive on their own, 0.14s apart — never as a block
      tl.fromTo("#p6-l1", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.56, ease: "power3.out" }, 0.06);
      tl.fromTo("#p6-l2", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.56, ease: "power3.out" }, 0.20);

      // the marker band is drawn across the words, then the words come up over it
${markRun("p6-m", 0.46, 0.56)}

      tl.fromTo("#p6-lead", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.52, ease: "power3.out" }, 0.72);

      tl.fromTo("#p6-url", { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.52, ease: "power3.out" }, 1.06);
      tl.fromTo("#p6-ul", { scaleX: 0 }, { scaleX: 1, duration: 0.62, ease: "power3.out" }, 1.30);

      tl.fromTo("#p6-meta", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.50, ease: "power3.out" }, 1.34);

      // and then it holds. Nothing else moves.
`;
