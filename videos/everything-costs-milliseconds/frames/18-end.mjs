import { field, enterZBack, header } from "../lib/frame.mjs";
// END CARD — the Z-BACK lands here. Reserved vector, spent once, on the thesis.
export const body = `
    ${field("cabinet")}
    <div id="stage" class="stage"><div class="inner">
      <div id="e-plate" class="panel" style="left:250px;top:264px;width:1420px;height:412px;
        background:rgba(11,16,15,.55);border-color:rgba(232,161,60,.22)"></div>
      <div id="e-seam" class="rule" style="left:250px;top:264px;width:1420px;height:2px;
        background:linear-gradient(90deg,rgba(232,161,60,0),rgba(232,161,60,.85),rgba(232,161,60,0));transform-origin:50% 50%"></div>

      <div id="e-h1" class="hdr" style="position:absolute;left:0;top:330px;width:1920px;text-align:center;font-size:104px">EVERYTHING COSTS</div>
      <div id="e-h2" style="position:absolute;left:0;top:450px;width:1920px;text-align:center;
        font-family:'Instrument',Georgia,serif;font-style:italic;font-weight:400;
        font-size:118px;line-height:1;color:var(--brass);letter-spacing:-.01em">milliseconds</div>
      <div id="e-sub" class="lead" style="position:absolute;left:0;top:596px;width:1920px;text-align:center;font-size:30px;opacity:.82">
        Spend them where the user is looking.</div>

      <div id="e-next" style="position:absolute;left:0;top:772px;width:1920px;text-align:center">
        <div class="mono" style="font-size:16px;letter-spacing:.22em;color:var(--emerald-lit);opacity:.6">NEXT EPISODE</div>
        <div class="hdr" style="font-size:54px;margin-top:12px">EP 27 &middot; SUBAGENTS</div></div>

      <div id="e-mark" class="mono" style="position:absolute;left:0;top:936px;width:1920px;text-align:center;
        font-size:15px;letter-spacing:.24em;opacity:.34">EP 26 &middot; FRONTEND PERFORMANCE</div>
      <div id="e-route" style="position:absolute;left:610px;top:700px;width:700px;height:34px"></div>
    </div></div>`;

export const script = `${enterZBack()}
      // everything is already on screen and settling out of the Z-back together — the card
      // does not assemble itself after the seam, it arrives having been assembled.
      // SEAM CARRIER — the plate and the display line are at full opacity from frame zero
      // and ride the Z-back in. Faded up, the reserved vector lands on an empty frame.
      tl.fromTo("#e-seam", { scaleX: 0 }, { scaleX: 1, duration: 0.78, ease: "power3.out" }, 0.10);
      tl.fromTo("#e-h1", { y: 16 }, { y: 0, duration: 0.60, ease: "power3.out" }, 0);
      tl.fromTo("#e-h2", { autoAlpha: 0, y: 28, scale: 0.95 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.74, ease: "back.out(1.2)" }, 0.40);
      tl.fromTo("#e-sub", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.52 }, 0.92);
      // the promise, given its own beat so it is read rather than skipped.
      // the route, drawn once, in the order we travelled it — fifteen marks lighting
      // across the tail, then dimming as the promise takes the frame.
      var rt = document.querySelector("#e-route");
      for (var i = 0; i < 15; i++) {
        var m = document.createElement("div");
        m.style.cssText = "position:absolute;left:" + (i*47) + "px;top:12px;width:30px;height:5px;border-radius:3px;" +
          "background:" + (i === 14 ? "var(--brass)" : "var(--mint)");
        rt.appendChild(m);
        tl.fromTo(m, { autoAlpha: 0, scaleX: 0 }, { autoAlpha: 0.75, scaleX: 1, duration: 0.30, ease: "power3.out" }, 2.10 + i*0.16);
      }
      tl.fromTo("#e-next", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.62, ease: "power3.out" }, 4.80);
      tl.to("#e-route", { autoAlpha: 0.30, duration: 0.90, ease: "power2.out" }, 5.10);
      tl.fromTo("#e-mark", { autoAlpha: 0 }, { autoAlpha: 0.34, duration: 0.60 }, 5.70);
      // the last motion in the film: the brass seam fading out under the sign-off.
      tl.to("#e-seam", { autoAlpha: 0.25, duration: 2.20, ease: "power2.inOut" }, 7.20);
      // no exit: the film ends here. The bed carries the last four seconds alone.
      void ${JSON.stringify(typeof header === "function")};`;
