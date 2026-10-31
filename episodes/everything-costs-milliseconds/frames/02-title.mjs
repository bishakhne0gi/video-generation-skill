import { field, enterAcross, exitAcross } from "../lib/frame.mjs";
// TITLE — silent by design. This is where the bed lifts the full 7dB.
export const body = `
    ${field("cabinet")}
    <div id="stage" class="stage"><div class="inner">
      <div id="t-plate" class="panel" style="left:250px;top:312px;width:1420px;height:472px;
        background:rgba(11,16,15,.55);border-color:rgba(232,161,60,.22)"></div>
      <div id="t-seam" class="rule" style="left:250px;top:312px;width:1420px;height:2px;
        background:linear-gradient(90deg,rgba(232,161,60,0),rgba(232,161,60,.85),rgba(232,161,60,0));transform-origin:50% 50%"></div>

      <div id="t-ep" class="tag" style="position:absolute;left:0;top:370px;width:1920px;text-align:center">EP 26 · FRONTEND PERFORMANCE</div>

      <div id="t-h1" class="hdr" style="position:absolute;left:0;top:418px;width:1920px;text-align:center;font-size:142px">EVERYTHING COSTS</div>
      <div id="t-h2" style="position:absolute;left:0;top:566px;width:1920px;text-align:center;
        font-family:'Instrument',Georgia,serif;font-style:italic;font-weight:400;
        font-size:150px;line-height:1;color:var(--brass);letter-spacing:-.01em">milliseconds</div>

      <div id="t-sub" class="lead" style="position:absolute;left:0;top:730px;width:1920px;text-align:center;font-size:28px;opacity:.72">
        Fifteen instruments. One page load.</div>
    </div></div>`;

export const script = `${enterAcross()}
      // carrier: the plate rides the cut in at full opacity rather than fading up.
      tl.fromTo("#t-plate", { scale: 0.965 }, { scale: 1, duration: 0.66, ease: "power3.out" }, 0.06);
      tl.fromTo("#t-seam",  { scaleX: 0 },  { scaleX: 1, duration: 0.80, ease: "power3.out" }, 0.14);
      tl.fromTo("#t-ep",    { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.46, ease: "power3.out" }, 0.34);
      // the two display lines land as one move, staggered — the serif is the accent word.
      tl.fromTo("#t-h1", { y: 24 }, { y: 0, duration: 0.62, ease: "power3.out" }, 0);
      tl.fromTo("#t-h2", { autoAlpha: 0, y: 42, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.78, ease: "back.out(1.25)" }, 0.86);
      tl.fromTo("#t-sub", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.52, ease: "power2.out" }, 1.42);
      // stillness before the strip begins — the cheapest emphasis in the kit.
${exitAcross("#stage", 4.66)}`;
