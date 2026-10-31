import { field, enterAcross, exitAcross } from "../lib/frame.mjs";
// COLD OPEN — the thesis in one image: the page is painted long before it works,
// and the gap between those two events is the whole episode.
const T0 = 118, T1 = 1802, GAP0 = 118 + (1802-118)*0.22, GAP1 = 118 + (1802-118)*0.88;
export const body = `
    ${field("interior")}
    <div id="stage" class="stage"><div class="inner">

      <div id="o-strip" class="panel" style="left:96px;top:392px;width:1728px;height:196px"></div>
      <div id="o-track" style="position:absolute;left:118px;top:498px;width:1684px;height:3px;background:rgba(176,228,204,.22)"></div>

      <div id="o-gap" style="position:absolute;left:${GAP0}px;top:452px;width:${GAP1-GAP0}px;height:94px;
        background:repeating-linear-gradient(115deg, rgba(232,161,60,.30) 0 9px, rgba(232,161,60,0) 9px 20px);
        border-left:2px solid var(--brass);border-right:2px solid var(--brass);transform-origin:0% 50%"></div>

      <div id="o-m1" style="position:absolute;left:${GAP0-1}px;top:452px;width:3px;height:94px;background:var(--mint)"></div>
      <div id="o-m2" style="position:absolute;left:${GAP1-1}px;top:452px;width:3px;height:94px;background:var(--mint)"></div>

      <div id="o-l1" style="position:absolute;left:${GAP0-4}px;top:566px;width:420px">
        <div class="mono" style="font-size:19px;letter-spacing:.16em;color:var(--mint);opacity:.62">LOOKS FINISHED</div>
        <div class="mono" style="font-size:44px;font-weight:700;color:var(--mint);margin-top:4px">1.0s</div></div>
      <div id="o-l2" style="position:absolute;left:${GAP1-4}px;top:566px;width:420px">
        <div class="mono" style="font-size:19px;letter-spacing:.16em;color:var(--mint);opacity:.62">ACTUALLY USABLE</div>
        <div class="mono" style="font-size:44px;font-weight:700;color:var(--mint);margin-top:4px">4.2s</div></div>

      <div id="o-gaplbl" style="position:absolute;left:${GAP0}px;top:396px;width:${GAP1-GAP0}px;text-align:center">
        <div class="mono hot" style="font-size:26px;font-weight:700;letter-spacing:.20em">3.2s OF NOTHING</div></div>

      <div id="o-blocks" style="position:absolute;left:118px;top:196px;width:1684px;height:132px"></div>

      <div id="o-cur" style="position:absolute;left:${(GAP0+GAP1)/2}px;top:470px;width:26px;height:38px;
        background:linear-gradient(148deg,var(--mint) 0%, #6FAF93 100%);
        clip-path:polygon(0 0,0 100%,27% 76%,45% 100%,64% 88%,46% 62%,100% 46%);
        filter:drop-shadow(0 3px 6px rgba(0,0,0,.7))"></div>
      <div id="o-alive" style="position:absolute;left:118px;top:700px;width:1684px;text-align:center">
        <span class="chipmint" style="font-size:19px;padding:9px 18px;letter-spacing:.12em">INTERACTIVE AT LAST</span></div>
    </div></div>`;

export const script = `${enterAcross()}
      // the page paints: five blocks land fast and look complete.
      var bw = [340, 520, 250, 410, 128], bx = 0, blocks = document.querySelector("#o-blocks");
      for (var i = 0; i < 5; i++) {
        var b = document.createElement("div");
        b.style.cssText = "position:absolute;left:" + bx + "px;top:" + (i===0?0:(i<3?0:74)) +
          "px;width:" + bw[i] + "px;height:" + (i===0?60:(i<3?60:44)) +
          "px;background:#0B100F;border:1px solid rgba(176,228,204,.16);border-radius:8px";
        blocks.appendChild(b); bx += bw[i] + 26; if (i === 2) bx = 0;
        tl.fromTo(b, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.36, ease: "power3.out" }, 0.24 + i * 0.09);
      }
      // the ruler, then the two events it separates.
      gsap.set("#o-track", { transformOrigin: "0% 50%" });
      tl.fromTo("#o-track", { scaleX: 0 }, { scaleX: 1, duration: 0.72, ease: "power3.out" }, 0.86);
      tl.fromTo("#o-m1", { autoAlpha: 0, scaleY: 0 }, { autoAlpha: 1, scaleY: 1, duration: 0.34, ease: "back.out(1.8)" }, 1.42);
      tl.fromTo("#o-l1", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.40, ease: "power3.out" }, 1.54);
      // the gap opens — the one brass element in the frame, and it has earned it.
      tl.fromTo("#o-gap", { scaleX: 0 }, { scaleX: 1, duration: 0.92, ease: "power2.inOut" }, 2.30);
      tl.fromTo("#o-m2", { autoAlpha: 0, scaleY: 0 }, { autoAlpha: 1, scaleY: 1, duration: 0.34, ease: "back.out(1.8)" }, 3.10);
      tl.fromTo("#o-l2", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.40, ease: "power3.out" }, 3.22);
      tl.fromTo("#o-gaplbl", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.44, ease: "power2.out" }, 3.70);
      // the cursor clicks inside the gap, four times, and nothing answers. This is the
      // sustained motion of the beat AND the argument — not a decorative pointer.
      tl.fromTo("#o-cur", { autoAlpha: 0, x: -60, y: 40 }, { autoAlpha: 1, x: 0, y: 0, duration: 0.52, ease: "power3.out" }, 4.10);
      for (var c = 0; c < 4; c++) {
        tl.to("#o-cur", { scale: 0.84, duration: 0.09, ease: "power2.in" }, 4.80 + c * 0.62);
        tl.to("#o-cur", { scale: 1, duration: 0.16, ease: "power2.out" }, 4.89 + c * 0.62);
      }
      // it finally wakes. The click that lands is the one the whole episode is about.
      tl.to("#o-cur", { scale: 0.84, duration: 0.09, ease: "power2.in" }, 7.42);
      tl.to("#o-cur", { scale: 1, duration: 0.16, ease: "power2.out" }, 7.51);
      tl.fromTo("#o-alive", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.44, ease: "back.out(1.5)" }, 7.62);
      tl.to("#o-gap", { autoAlpha: 0.34, duration: 0.60, ease: "power2.out" }, 7.70);
      tl.fromTo("#o-m2", { boxShadow: "none" }, { duration: 0.01 }, 7.70);
      for (var k2 = 0; k2 < 5; k2++)
        tl.to(blocks.children[k2], { backgroundColor: "rgba(176,228,204,0.16)", duration: 0.34, ease: "power2.out" }, 7.66 + k2*0.07);
${exitAcross("#stage", 9.66)}`;
