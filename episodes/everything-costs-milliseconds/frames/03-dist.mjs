import { field, enterAcross, exitAcross, header, headerIn , readout, readoutIn, sweep, sweepIn} from "../lib/frame.mjs";
// STATION 01 — the distribution. The instrument is a histogram under glass, and the
// argument is the brass p75 marker landing a long way right of the developer's laptop.
const X0 = 980, W = 812, BARS = 26, BW = 22, GAP = 9;
// a real-shaped LCP distribution: log-normal, long right tail.
const H = [3,7,14,26,42,58,71,80,84,82,76,68,60,53,46,40,34,29,25,21,17,14,11,9,7,5];
export const body = `
    ${field("lamplit")}
    <div id="stage" class="stage"><div class="inner">
      ${header("01", "THE DISTRIBUTION", "One number<br>is a lie.", "Your users are a curve, not an average. The only figure that describes them is the seventy-fifth percentile &mdash; and it is nowhere near your machine.")}

      <div id="d-case" class="panel" style="left:${X0-46}px;top:352px;width:${W+92}px;height:452px"></div>
      <div id="d-base" class="rule" style="left:${X0}px;top:712px;width:${W}px;transform-origin:0% 50%"></div>
      <div id="d-bars" style="position:absolute;left:${X0}px;top:392px;width:${W}px;height:320px"></div>

      <div id="d-lap" style="position:absolute;left:${X0 + 1*(BW+GAP)}px;top:640px;width:2px;height:74px;background:var(--mint);opacity:.55"></div>
      <div id="d-laplbl" class="mono" style="position:absolute;left:${X0 + 1*(BW+GAP) + 10}px;top:640px;font-size:17px;opacity:.62">your laptop &middot; 0.8s</div>

      <div id="d-p50" style="position:absolute;left:${X0 + 8*(BW+GAP)}px;top:432px;width:2px;height:282px;background:var(--mint);opacity:.55"></div>
      <div id="d-p50lbl" class="mono" style="position:absolute;left:${X0 + 8*(BW+GAP) + 10}px;top:410px;font-size:18px">p50 &middot; 2.1s</div>

      <div id="d-p75" style="position:absolute;left:${X0 + 16*(BW+GAP)}px;top:392px;width:3px;height:322px;background:var(--brass);
        box-shadow:0 0 14px rgba(232,161,60,.5)"></div>
      <div id="d-p75lbl" style="position:absolute;left:${X0 + 16*(BW+GAP) + 12}px;top:368px">
        <div class="mono hot" style="font-size:24px;font-weight:700">p75 &middot; 4.2s</div>
        <div class="mono hot" style="font-size:16px;opacity:.8">this is your score</div></div>

      <div class="glassflat" style="left:${X0-46}px;top:352px;width:${W+92}px;height:452px;border-radius:10px"></div>
      <div class="spec" style="left:${X0-46}px;top:352px;width:${W+92}px;height:452px;border-radius:10px"></div>
      ${sweep("d-sweep", X0-46, 352, W+92, 452)}
      <div id="d-live" style="position:absolute;left:118px;top:566px;width:800px">
        <div class="mono" style="font-size:17px;letter-spacing:.15em;opacity:.55">FIELD DATA, LAST 28 DAYS</div>
        ${readout("d-n", ["412,908","618,441","901,772","1,144,036","1,284,902"],
          "height:66px;margin-top:8px;font-family:'JBMono',monospace;font-size:52px;font-weight:700;color:var(--mint)")}
        <div id="d-nlbl" class="mono" style="position:absolute;left:0;top:150px;font-size:17px;opacity:.5">real navigations &mdash; not one lab run</div>
      </div>
    </div></div>`;

export const script = `${enterAcross()}${headerIn()}
      gsap.set("#d-base", { transformOrigin: "0% 50%" });
      tl.fromTo("#d-case", { autoAlpha: 0, scale: 0.97 }, { autoAlpha: 1, scale: 1, duration: 0.60, ease: "power3.out" }, 0.06);
      tl.fromTo("#d-base", { scaleX: 0 }, { scaleX: 1, duration: 0.70, ease: "power3.out" }, 0.30);
      // the curve builds left to right — it is a distribution being measured, not a chart appearing.
      var H = ${JSON.stringify(H)}, bars = document.querySelector("#d-bars");
      for (var i = 0; i < ${BARS}; i++) {
        var b = document.createElement("div"), h = H[i] * 3.2;
        b.style.cssText = "position:absolute;left:" + (i * ${BW + GAP}) + "px;bottom:0;width:${BW}px;height:" + h +
          "px;background:" + (i >= 16 ? "rgba(232,161,60,.30)" : "rgba(64,138,113,.62)") +
          ";border-top:2px solid " + (i >= 16 ? "rgba(232,161,60,.85)" : "var(--emerald-lit)") + ";transform-origin:50% 100%";
        bars.appendChild(b);
        tl.fromTo(b, { scaleY: 0 }, { scaleY: 1, duration: 0.46, ease: "power3.out" }, 0.52 + i * 0.035);
      }
      // the laptop reading arrives first and looks fine. That is the trap.
      tl.fromTo("#d-lap",    { autoAlpha: 0, scaleY: 0 }, { autoAlpha: 1, scaleY: 1, duration: 0.34, ease: "power3.out" }, 2.30);
      tl.fromTo("#d-laplbl", { autoAlpha: 0, x: -12 },    { autoAlpha: 1, x: 0, duration: 0.40, ease: "power3.out" }, 2.42);
      tl.fromTo("#d-p50",    { autoAlpha: 0, scaleY: 0 }, { autoAlpha: 1, scaleY: 1, duration: 0.34, ease: "power3.out" }, 3.20);
      tl.fromTo("#d-p50lbl", { autoAlpha: 0, x: -12 },    { autoAlpha: 1, x: 0, duration: 0.40, ease: "power3.out" }, 3.32);
      // the p75 marker TRAVELS from the laptop mark out to the truth — the beat's payoff.
      gsap.set("#d-p75", { transformOrigin: "50% 100%" });
      tl.fromTo("#d-p75", { autoAlpha: 0, x: -${15*(BW+GAP)} }, { autoAlpha: 1, x: 0, duration: 1.15, ease: "power3.inOut" }, 4.30);
      tl.fromTo("#d-p75lbl", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.46, ease: "power3.out" }, 5.30);
      // the sample never stops arriving: the counter climbs and the tail bars keep
      // growing for the rest of the beat, which is what a live measurement looks like.
      tl.fromTo("#d-live", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.46, ease: "power3.out" }, 6.10);${readoutIn("d-n", 5, 6.30, 0.78)}
      tl.fromTo("#d-nlbl", { autoAlpha: 0 }, { autoAlpha: 0.5, duration: 0.40 }, 6.90);
      for (var q = 17; q < 26; q++) {
        var bq = bars.children[q];
        tl.to(bq, { scaleY: 1.34, duration: 0.55, ease: "sine.inOut", repeat: 3, yoyo: true }, 6.20 + (q-17)*0.14);
      }${sweepIn("d-sweep", W+92-Math.round((W+92)*0.22), 6.40, 2.10, 1)}
${exitAcross("#stage", 11.09)}`;
