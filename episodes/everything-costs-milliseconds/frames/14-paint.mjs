import { field, enterAcross, exitLift, header, headerIn , readout, readoutIn} from "../lib/frame.mjs";
// STATION 12 — the pixel pipeline. Closes ACT 3. Four stages, and the two ways to
// spend them: read-after-write forces the whole chain, transform skips to the end.
const STAGES = ["STYLE", "LAYOUT", "PAINT", "COMPOSITE"];
export const body = `
    ${field("inspection")}
    <div id="stage" class="stage"><div class="inner">
      ${header("12", "LAYOUT AND PAINT", "Four stages.<br>Skip three.", "Reading a layout value after writing one forces the browser to run the whole chain, synchronously, inside your loop. Transform and opacity never touch it.")}

      <div id="v-pipe" style="position:absolute;left:158px;top:552px;width:1604px;height:104px"></div>

      <div id="v-bad" style="position:absolute;left:158px;top:706px;width:770px">
        <div class="mono hot" style="font-size:17px;letter-spacing:.15em">LAYOUT THRASH &mdash; 40 FORCED REFLOWS</div>
        <div class="panel" style="position:relative;left:0;top:16px;width:770px;height:184px;background:#080C0B">
          <div class="mono" style="position:absolute;left:22px;top:22px;font-size:19px;line-height:1.8;color:var(--emerald-lit)">
            <span style="opacity:.55">for (const el of items) {</span><br>
            &nbsp;&nbsp;el.style.height = h + <span style="color:var(--mint)">"px"</span>;<span style="opacity:.45"> // write</span><br>
            &nbsp;&nbsp;h = el.<span class="hot">offsetHeight</span>;<span style="opacity:.45"> // read &rarr; forced reflow</span><br>
            <span style="opacity:.55">}</span></div></div></div>

      <div id="v-good" style="position:absolute;left:992px;top:706px;width:770px">
        <div class="mono" style="font-size:17px;letter-spacing:.15em;color:var(--emerald-lit)">COMPOSITOR ONLY &mdash; NO LAYOUT AT ALL</div>
        <div class="panel" style="position:relative;left:0;top:16px;width:770px;height:184px;background:#080C0B">
          <div class="mono" style="position:absolute;left:22px;top:22px;font-size:19px;line-height:1.8;color:var(--emerald-lit)">
            el.style.<span style="color:var(--mint)">transform</span> = <span style="color:var(--mint)">"translateY(8px)"</span>;<br>
            el.style.<span style="color:var(--mint)">opacity</span> = <span style="color:var(--mint)">".4"</span>;<br>
            <span style="opacity:.45">// straight to the compositor</span><br>
            <span style="opacity:.45">// content-visibility / contain help too</span></div></div></div>

      ${readout("v-fps", ["24 fps","38 fps","52 fps","60 fps"],
        "position:absolute;left:1462px;top:462px;width:300px;text-align:right;height:60px;font-family:'JBMono',monospace;font-size:46px;font-weight:700;color:var(--mint)")}
      <div id="v-fpslbl" class="mono" style="position:absolute;left:1462px;top:524px;width:300px;text-align:right;font-size:16px;letter-spacing:.14em;opacity:.55">FRAME RATE WHILE SCROLLING</div>
    </div></div>`;

export const script = `${enterAcross()}${headerIn()}
      // the pipeline itself, built as four physical stations with a belt between them.
      var S = ${JSON.stringify(STAGES)}, pipe = document.querySelector("#v-pipe"), boxes = [];
      for (var i = 0; i < 4; i++) {
        var b = document.createElement("div");
        b.style.cssText = "position:absolute;left:" + (i*412) + "px;top:0;width:344px;height:104px;border-radius:10px;" +
          "background:rgba(11,16,15,.9);border:1px solid rgba(176,228,204,.18);display:flex;align-items:center;justify-content:center";
        b.innerHTML = '<span style="font-family:JBMono,monospace;font-size:24px;font-weight:700;letter-spacing:.14em;' +
          'color:var(--emerald-lit)">' + S[i] + '</span>';
        pipe.appendChild(b); boxes.push(b);
        if (i < 3) {
          var arrow = document.createElement("div");
          arrow.className = "arr";
          arrow.style.cssText = "position:absolute;left:" + (i*412 + 344) + "px;top:50px;width:68px;height:3px;" +
            "transform-origin:0% 50%;background:rgba(176,228,204,.35)";
          pipe.appendChild(arrow);
          tl.fromTo(arrow, { scaleX: 0 }, { scaleX: 1, duration: 0.28, ease: "power3.out" }, 0.44 + i*0.20);
        }
        tl.fromTo(b, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.42, ease: "power3.out" }, 0.24 + i*0.20);
      }
      tl.fromTo("#v-bad",  { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.50, ease: "power3.out" }, 1.50);
      tl.fromTo("#v-good", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.50, ease: "power3.out" }, 3.10);
      // the thrash: the whole chain lights, over and over, once per item. It repeats for
      // the rest of the beat because that is exactly what the loop does.
      for (var r = 0; r < 5; r++) {
        for (var s = 0; s < 4; s++) {
          tl.to(boxes[s], { backgroundColor: "rgba(232,161,60,0.80)", duration: 0.10, ease: "none" }, 2.10 + r*0.62 + s*0.07);
          tl.to(boxes[s], { backgroundColor: "rgba(11,16,15,0.90)", duration: 0.22, ease: "none" }, 2.24 + r*0.62 + s*0.07);
        }
      }
      // then the honest contrast: only the last stage runs, and it keeps running.
      for (var q = 0; q < 6; q++) {
        tl.to(boxes[3], { backgroundColor: "rgba(176,228,204,0.72)", duration: 0.10, ease: "none" }, 5.40 + q*0.44);
        tl.to(boxes[3], { backgroundColor: "rgba(11,16,15,0.90)", duration: 0.24, ease: "none" }, 5.54 + q*0.44);
      }
      // the frame rate is the reason any of this matters, and it resolves last.
      tl.fromTo("#v-fpslbl", { autoAlpha: 0 }, { autoAlpha: 0.55, duration: 0.36 }, 6.20);${readoutIn("v-fps", 4, 6.20, 0.66)}
      // the compositor keeps ticking on its own to the cut: one stage, doing all the work.
      for (var w2 = 0; w2 < 5; w2++) {
        tl.to(boxes[3], { backgroundColor: "rgba(176,228,204,0.72)", duration: 0.09, ease: "none" }, 8.10 + w2*0.40);
        tl.to(boxes[3], { backgroundColor: "rgba(11,16,15,0.90)", duration: 0.22, ease: "none" }, 8.22 + w2*0.40);
      }
${exitLift("#stage", 10.97)}`;
