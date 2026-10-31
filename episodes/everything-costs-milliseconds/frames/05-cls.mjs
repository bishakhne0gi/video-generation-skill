import { field, enterAcross, exitAcross, header, headerIn , readout, readoutIn} from "../lib/frame.mjs";
// STATION 03 — CLS. The spirit level: the one instrument that IS the metric. Layout
// shift is content moving under the reader, and a bubble going off centre is that.
const LX = 1010, LY = 706, LW = 780, LH = 96;
export const body = `
    ${field("lamplit")}
    <div id="stage" class="stage"><div class="inner">
      ${header("03", "CUMULATIVE LAYOUT SHIFT", "It moves after<br>you commit.", "CLS scores content that jumps once the reader has already aimed. It is almost always a slot nobody reserved.")}

      <div id="c-doc" class="panel" style="left:158px;top:520px;width:660px;height:430px"></div>
      <div id="c-slot" style="position:absolute;left:182px;top:548px;width:612px;height:0px;overflow:hidden">
        <div style="width:612px;height:118px;border:2px dashed rgba(232,161,60,.75);border-radius:8px;
          background:rgba(232,161,60,.10);display:flex;align-items:center;justify-content:center">
          <span class="mono hot" style="font-size:19px;letter-spacing:.14em">AD SLOT &middot; 612&times;118 &middot; ARRIVED LATE</span></div></div>
      <div id="c-body" style="position:absolute;left:182px;top:548px;width:612px;height:380px"></div>
      <div id="c-btn" style="position:absolute;left:182px;top:800px;width:214px;height:52px;
        background:var(--mint);border-radius:26px;display:flex;align-items:center;justify-content:center">
        <span class="mono" style="color:var(--ink);font-weight:700;font-size:18px">Add to basket</span></div>
      <div id="c-cur" style="position:absolute;left:274px;top:824px;width:26px;height:38px;
        background:linear-gradient(148deg,var(--mint) 0%, #6FAF93 100%);
        clip-path:polygon(0 0,0 100%,27% 76%,45% 100%,64% 88%,46% 62%,100% 46%);
        filter:drop-shadow(0 3px 6px rgba(0,0,0,.7))"></div>

      <div class="bezel" style="left:${LX-18}px;top:${LY-18}px;width:${LW+36}px;height:${LH+36}px;border-radius:${(LH+36)/2}px"></div>
      <div id="c-tube" style="position:absolute;left:${LX}px;top:${LY}px;width:${LW}px;height:${LH}px;border-radius:${LH/2}px;
        background:linear-gradient(180deg,#14352C 0%, #1E4C3E 46%, #0C201B 100%);
        box-shadow:inset 0 6px 18px rgba(0,0,0,.7), inset 0 -2px 0 rgba(176,228,204,.10)"></div>
      <div style="position:absolute;left:${LX+LW/2-46}px;top:${LY}px;width:3px;height:${LH}px;background:rgba(176,228,204,.55)"></div>
      <div style="position:absolute;left:${LX+LW/2+46}px;top:${LY}px;width:3px;height:${LH}px;background:rgba(176,228,204,.55)"></div>
      <div id="c-bub" style="position:absolute;left:${LX+LW/2-34}px;top:${LY+13}px;width:68px;height:${LH-26}px;border-radius:${(LH-26)/2}px;
        background:radial-gradient(60% 60% at 38% 30%, rgba(230,255,244,.96), rgba(150,220,192,.72) 60%, rgba(90,170,140,.5));
        box-shadow:inset 0 2px 6px rgba(255,255,255,.6), 0 0 22px rgba(176,228,204,.35)"></div>
      <div class="glassflat" style="left:${LX}px;top:${LY}px;width:${LW}px;height:${LH}px;border-radius:${LH/2}px"></div>

      <div id="c-read" style="position:absolute;left:${LX}px;top:${LY+130}px;width:${LW}px;display:flex;justify-content:space-between">
        <div><div class="mono" style="font-size:17px;letter-spacing:.16em;opacity:.6">BUDGET</div>
             <div class="mono" style="font-size:38px;font-weight:700;color:var(--mint)">0.10</div></div>
        <div style="text-align:right"><div class="mono hot" style="font-size:17px;letter-spacing:.16em;opacity:.8">THIS PAGE</div>
             <div id="c-score" class="mono hot" style="font-size:38px;font-weight:700">0.24</div></div></div>
      <div id="c-fix" style="position:absolute;left:1010px;top:912px;width:800px">
        <div class="mono" style="font-size:19px;color:var(--emerald-lit)">
          give the slot its <span style="color:var(--mint);font-weight:700">width and height up front</span> &mdash;
          the ad still arrives late, but nothing moves when it does</div></div>
      ${readout("c-score2", ["0.24","0.19","0.11","0.02"],
        "position:absolute;left:" + (LX+LW-140) + "px;top:" + (LY+164) + "px;width:140px;height:48px;text-align:right;font-family:'JBMono',monospace;font-size:38px;font-weight:700;color:var(--mint)")}
    </div></div>`;

export const script = `${enterAcross()}${headerIn()}
      tl.fromTo("#c-doc", { autoAlpha: 0, scale: 0.97 }, { autoAlpha: 1, scale: 1, duration: 0.54, ease: "power3.out" }, 0.10);
      var bodyEl = document.querySelector("#c-body"), W = [612, 560, 596, 512];
      for (var i = 0; i < 4; i++) {
        var r = document.createElement("div");
        r.style.cssText = "position:absolute;left:0;top:" + (i*30) + "px;width:" + W[i] +
          "px;height:14px;background:rgba(176,228,204,.13);border-radius:7px";
        bodyEl.appendChild(r);
        tl.fromTo(r, { autoAlpha: 0, x: -12 }, { autoAlpha: 1, x: 0, duration: 0.30, ease: "power3.out" }, 0.34 + i*0.07);
      }
      tl.fromTo("#c-btn", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.44, ease: "power3.out" }, 0.72);
      // the reader aims at the button...
      tl.fromTo("#c-cur", { autoAlpha: 0, x: 120, y: 70 }, { autoAlpha: 1, x: 0, y: 0, duration: 0.72, ease: "power3.out" }, 1.60);
      // ...and the slot arrives late, pushing everything below it DOWN. Height is not
      // animatable, so the slot's clip opens on scaleY and the rows below translate.
      gsap.set("#c-slot", { height: 118, scaleY: 0, transformOrigin: "50% 0%" });
      tl.to("#c-slot", { scaleY: 1, duration: 0.28, ease: "power4.out" }, 3.20);
      tl.to("#c-body", { y: 130, duration: 0.28, ease: "power4.out" }, 3.20);
      tl.to("#c-btn",  { y: 130, duration: 0.28, ease: "power4.out" }, 3.20);
      // the click lands on nothing, because the button left.
      tl.to("#c-cur", { scale: 0.84, duration: 0.09, ease: "power2.in" }, 3.42);
      tl.to("#c-cur", { scale: 1, duration: 0.16, ease: "power2.out" }, 3.51);
      // the bubble is the metric. It runs off centre on the same frame the content jumps.
      tl.to("#c-bub", { x: 214, duration: 0.30, ease: "power4.out" }, 3.20);
      tl.to("#c-bub", { x: 188, duration: 0.90, ease: "elastic.out(1, 0.5)" }, 3.50);
      tl.fromTo("#c-read", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.44, ease: "power3.out" }, 4.30);
      // a spirit level never fully stills — the bubble keeps hunting, and the beat keeps moving.
      tl.to("#c-bub", { x: 200, duration: 0.85, ease: "sine.inOut", repeat: 1, yoyo: true }, 5.20);
      // THE FIX — the reserved slot. The page is rebuilt with the space already held,
      // the ad lands into it, and the bubble walks back to dead centre and STAYS there.
      tl.fromTo("#c-fix", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.46, ease: "power3.out" }, 6.40);
      tl.to("#c-body", { y: 130, duration: 0.01 }, 6.90);
      tl.to("#c-btn",  { y: 130, duration: 0.01 }, 6.90);
      tl.to("#c-slot", { borderColor: "rgba(176,228,204,0.7)", duration: 0.4 }, 7.00);
      tl.set("#c-read", { autoAlpha: 0 }, 7.10);
      tl.to("#c-bub", { x: 0, duration: 1.70, ease: "power2.inOut" }, 7.10);
      tl.to("#c-bub", { x: 6, duration: 0.70, ease: "elastic.out(1, 0.5)" }, 8.80);
      // the cursor comes back and this time the button is where it was aimed.
      tl.to("#c-cur", { x: 0, y: 130, duration: 0.70, ease: "power3.out" }, 8.10);
      tl.to("#c-cur", { scale: 0.84, duration: 0.09, ease: "power2.in" }, 8.90);
      tl.to("#c-cur", { scale: 1, duration: 0.16, ease: "power2.out" }, 8.99);${readoutIn("c-score2", 4, 7.10, 0.52)}
${exitAcross("#stage", 11.80)}`;
