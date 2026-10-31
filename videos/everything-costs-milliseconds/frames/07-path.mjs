import { field, enterLift, exitAcross, header, headerIn , readout, readoutIn, sweep, sweepIn} from "../lib/frame.mjs";
// STATION 05 — the critical path, drawn by a chart recorder. ACT 2 opens here: the
// darkest field in the film. The argument is the STAIRCASE — each chained request
// waiting on the one above it — and then the same work flattened.
const PX = 980, PY = 396, ROW = 62, SCALE = 172;   // px per second
const CHAIN = [
  { n: "index.html",  s: 0.00, d: 0.62 },
  { n: "app.css",     s: 0.62, d: 0.74 },
  { n: "theme.css",   s: 1.36, d: 0.68 },
  { n: "brand.woff2", s: 2.04, d: 0.81 },
  { n: "first paint", s: 2.85, d: 1.25 },
];
export const body = `
    ${field("interior")}
    <div id="stage" class="stage"><div class="inner">
      ${header("05", "THE CRITICAL PATH", "Everything that<br>blocks the paint.", "A chained request cannot start until its parent finishes. Every link costs a full round trip, and the chain is nearly always deeper than you think.")}

      <div id="p-case" class="panel" style="left:${PX-48}px;top:${PY-52}px;width:812px;height:${ROW*5+130}px"></div>
      <div id="p-paper" style="position:absolute;left:${PX-24}px;top:${PY-28}px;width:764px;height:${ROW*5+82}px;
        background:repeating-linear-gradient(90deg, rgba(176,228,204,.07) 0 1px, rgba(176,228,204,0) 1px 43px);
        border-radius:4px"></div>
      <div id="p-rows" style="position:absolute;left:${PX}px;top:${PY}px;width:716px;height:${ROW*5}px"></div>
      <div id="p-pen" style="position:absolute;left:${PX}px;top:${PY-40}px;width:3px;height:${ROW*5+56}px;
        background:linear-gradient(180deg,var(--brass),rgba(232,161,60,.15));box-shadow:0 0 12px rgba(232,161,60,.5)"></div>
      <div id="p-nib" style="position:absolute;left:${PX-7}px;top:${PY-52}px;width:17px;height:22px;
        background:linear-gradient(180deg,#F0C07A,#8A5A18);clip-path:polygon(0 0,100% 0,50% 100%);
        filter:drop-shadow(0 2px 4px rgba(0,0,0,.7))"></div>

      <div id="p-tot" style="position:absolute;left:${PX}px;top:${PY+ROW*5+34}px;width:716px;display:flex;justify-content:space-between">
        <div class="mono" style="font-size:17px;letter-spacing:.15em;opacity:.6">4 CHAINED REQUESTS</div>
        <div class="mono hot" style="font-size:30px;font-weight:700">4.10s</div></div>

      <div id="p-fix" style="position:absolute;left:118px;top:742px;width:764px">
        <div class="mono" style="font-size:18px;letter-spacing:.15em;color:var(--emerald-lit);opacity:.75">FLATTENED &mdash; PRECONNECT, INLINE, PRELOAD</div>
        <div id="p-fixbars" style="position:relative;width:764px;height:104px;margin-top:16px"></div>
        <div id="p-fixtot" class="mono" style="font-size:30px;font-weight:700;color:var(--mint);margin-top:10px">1.42s</div></div>
      ${sweep("p-sweep", PX-48, PY-52, 812, ROW*5+130)}
      <div id="p-why" style="position:absolute;left:118px;top:930px;width:820px">
        <div class="mono" style="font-size:18px;color:var(--emerald-lit);line-height:1.7">
          each link is a full round trip &mdash; <span style="color:var(--mint);font-weight:700">4 &times; 180ms</span> of pure latency,<br>
          before a single byte of your CSS is parsed</div></div>
    </div></div>`;

export const script = `${enterLift()}${headerIn()}
      tl.fromTo("#p-case",  { autoAlpha: 0, scale: 0.97 }, { autoAlpha: 1, scale: 1, duration: 0.56, ease: "power3.out" }, 0.08);
      tl.fromTo("#p-paper", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.44 }, 0.24);
      var CH = ${JSON.stringify(CHAIN)}, rows = document.querySelector("#p-rows"), T0 = 0.90, SPD = 0.62;
      for (var i = 0; i < CH.length; i++) {
        var c = CH[i], last = i === CH.length - 1;
        var row = document.createElement("div");
        row.style.cssText = "position:absolute;left:0;top:" + (i*${ROW}) + "px;width:716px;height:${ROW}px";
        row.innerHTML = '<span style="position:absolute;left:0;top:9px;font-family:JBMono,monospace;font-size:17px;color:' +
            (last ? "var(--brass)" : "var(--emerald-lit)") + '">' + c.n + '</span>' +
          '<div class="bar" style="position:absolute;left:' + (188 + c.s*${SCALE}) + 'px;top:6px;width:' + (c.d*${SCALE}) +
            'px;height:26px;border-radius:5px;transform-origin:0% 50%;background:' +
            (last ? "rgba(232,161,60,.85)" : "rgba(64,138,113,.86)") + '"></div>' +
          '<span style="position:absolute;left:' + (196 + (c.s+c.d)*${SCALE}) + 'px;top:10px;font-family:JBMono,monospace;' +
            'font-size:15px;opacity:.65;color:var(--mint)">' + c.d.toFixed(2) + 's</span>';
        rows.appendChild(row);
        // the pen draws each bar in real time — the recorder IS the animation.
        tl.fromTo(row, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.18 }, T0 + c.s*SPD);
        tl.fromTo(row.querySelector(".bar"), { scaleX: 0 }, { scaleX: 1, duration: c.d*SPD, ease: "none" }, T0 + c.s*SPD);
      }
      // the pen head travels the whole width once, in step with the bars it is drawing.
      tl.fromTo("#p-pen", { x: 188 }, { x: 188 + 4.10*${SCALE}, duration: 4.10*SPD, ease: "none" }, T0);
      tl.fromTo("#p-nib", { x: 188 }, { x: 188 + 4.10*${SCALE}, duration: 4.10*SPD, ease: "none" }, T0);
      tl.fromTo("#p-tot", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.40, ease: "power3.out" }, T0 + 4.10*SPD + 0.10);
      // the fix: the SAME work with the chain removed. Bars stack instead of stepping.
      var fx = document.querySelector("#p-fixbars"), FW = [0.62, 0.74, 0.68, 0.81];
      for (var j = 0; j < 4; j++) {
        var b = document.createElement("div");
        b.style.cssText = "position:absolute;left:0;top:" + (j*26) + "px;width:" + (FW[j]*${SCALE}) +
          "px;height:18px;border-radius:4px;transform-origin:0% 50%;background:rgba(64,138,113,.9)";
        fx.appendChild(b);
        tl.fromTo(b, { scaleX: 0 }, { scaleX: 1, duration: 0.42, ease: "power3.out" }, 4.60 + j*0.09);
      }
      tl.fromTo("#p-fix", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.50, ease: "power3.out" }, 4.42);
      tl.fromTo("#p-fixtot", { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 0.46, ease: "back.out(1.5)" }, 5.30);
      // the recorder keeps running: the pen makes a second pass over the flattened
      // chain, so the beat is still drawing right up to the cut.
      tl.fromTo("#p-why", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.44, ease: "power3.out" }, 6.30);
      tl.fromTo("#p-pen", { x: 188 }, { x: 188 + 1.42*${SCALE}, duration: 1.30, ease: "power2.inOut" }, 6.60);
      tl.fromTo("#p-nib", { x: 188 }, { x: 188 + 1.42*${SCALE}, duration: 1.30, ease: "power2.inOut" }, 6.60);
      for (var z = 0; z < 4; z++)
        tl.fromTo(fx.children[z], { scaleX: 0 }, { scaleX: 1, duration: 0.34, ease: "none" }, 6.60 + z*0.10);${sweepIn("p-sweep", 812-Math.round(812*0.22), 8.10, 1.90, 0)}
${exitAcross("#stage", 10.37)}`;
