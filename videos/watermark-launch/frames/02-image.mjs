import { field, grainDrift, T } from "../lib/frame.mjs";
import { geminiWin, imageBox, stamp } from "../lib/ui.mjs";
import { enterOf, exitOf } from "../lib/seams.mjs";
import { LEN as SCHED } from "../schedule.mjs";
export const LEN = SCHED[1];

// THE IMAGE ARRIVES — and so does the thing the film is actually about.
//
// The image resolves with a scan sweeping down it, so it reads as being MADE
// rather than pasted. Then the watermark stamps into the corner: late, hard,
// and with a sound. It is the antagonist entering, so it does not fade in.

const S = 540;                    // the plate is square, like the source
const SCAN_AT = 0.30, SCAN_DUR = 1.05;
const STAMP_AT = 1.92;

export const body = `${field("dark", "p2")}
    <div id="stage" class="stage"><div class="inner">
${geminiWin("g2", { x: 300, y: 176, w: 1320, h: 728 }, `
          <div style="position:absolute;left:52px;top:44px">
            <div class="tag tag-on">RESULT</div>
          </div>
          <div class="mono" id="g2-meta" style="position:absolute;left:52px;top:78px;font-size:16px;color:${T.mute}">
            1080 &times; 1079 &middot; png &middot; 2.4s</div>

          <div id="g2-wrap" style="position:absolute;left:52px;top:120px;width:${S}px;height:${S}px;overflow:hidden">
${imageBox("g2-plate", { x: 0, y: 0, s: S, src: "assets/demo/planet.png" })}
${stamp("g2-mark", { right: 16, bottom: 13 })}
            <div id="g2-ring" style="position:absolute;right:6px;bottom:2px;width:150px;height:46px;
                 border:1px solid rgba(255,255,255,0.55);border-radius:2px;opacity:0"></div>
            <div id="g2-scan" style="position:absolute;left:0;top:0;width:${S}px;height:3px;
                 background:${T.lit};opacity:0;box-shadow:0 0 22px 6px rgba(139,132,255,0.55)"></div>
            <div id="g2-veil" data-layout-allow-overflow style="position:absolute;left:0;top:0;width:${S}px;height:${S}px;background:#000"></div>
          </div>

          <div id="g2-note" style="position:absolute;left:${52 + S + 78}px;top:168px;width:560px">
            <div class="hdr hdr-on" style="font-size:62px;line-height:1.05">Every image<br/>comes stamped.</div>
            <div class="lead lead-on" style="margin-top:22px;font-size:23px">The mark in the corner is the part
              you can see.</div>
          </div>
        `)}
    </div></div>`;

export const script = `${enterOf(1)}
${grainDrift("p2", LEN)}

      // the plate is revealed by a veil retreating UPWARD behind a bright scan
      // line — the image is being written, not shown.
      tl.set("#g2-scan", { autoAlpha: 1, y: 0 }, ${SCAN_AT.toFixed(2)});
      tl.to("#g2-scan", { y: ${S}, duration: ${SCAN_DUR}, ease: "power1.inOut" }, ${SCAN_AT.toFixed(2)});
      tl.fromTo("#g2-veil", { y: 0 }, { y: ${S}, duration: ${SCAN_DUR}, ease: "power1.inOut" }, ${SCAN_AT.toFixed(2)});
      tl.to("#g2-scan", { autoAlpha: 0, duration: 0.20 }, ${(SCAN_AT + SCAN_DUR).toFixed(2)});
      tl.fromTo("#g2-meta", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: "none" }, ${(SCAN_AT + SCAN_DUR - 0.3).toFixed(2)});

      // the stamp LANDS. Scaled down from above with a hard settle, not a fade —
      // a watermark is applied to an image, it does not materialise on one.
      tl.set("#g2-mark", { autoAlpha: 0 }, 0);
      tl.fromTo("#g2-mark", { autoAlpha: 0, scale: 2.6, y: -18 },
        { autoAlpha: 1, scale: 1, y: 0, duration: 0.40, ease: "back.out(2.2)" }, ${STAMP_AT.toFixed(2)});
      // and one ring pushing out of it, so the eye is taken to the corner.
      // The set at 0 is load-bearing: a fromTo with a non-zero start alpha
      // paints that state from frame ZERO, which is a stray box on the plate
      // for the two seconds before the cue.
      tl.set("#g2-ring", { autoAlpha: 0 }, 0);
      tl.fromTo("#g2-ring", { autoAlpha: 0.55, scale: 0.5 },
        { autoAlpha: 0, scale: 1.9, duration: 0.70, ease: "power2.out" }, ${STAMP_AT.toFixed(2)});

      // the statement arrives after the mark, never with it — the picture makes
      // the point first and the words confirm it.
      tl.fromTo("#g2-note", { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.58, ease: "power3.out" }, ${(STAMP_AT + 0.30).toFixed(2)});

${exitOf(1, LEN)}`;
