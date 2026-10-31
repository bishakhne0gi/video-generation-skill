import { field, grainDrift, head, headIn, stagger, T, GRAD } from "../lib/frame.mjs";
import { enterOf, exitOf } from "../lib/seams.mjs";
import { LEN as SCHED } from "../schedule.mjs";
export const LEN = SCHED[9];   // never restate a duration the schedule owns

// The version list and the export menu are transcribed from the running editor,
// including the 0.1 CREDIT tag on v2 and the exact five menu items.
const MENU = ["Download SVG", "Export PNG 1&times;", "Export PNG 2&times;", "Copy SVG code", "Copy as Data URL"];

export const body = `${field("app", "ship", LEN)}
    <div id="stage" class="stage"><div class="inner">
      <div id="super" style="position:absolute;left:220px;top:392px;font-size:430px;line-height:0.86;
           font-weight:600;letter-spacing:-0.05em;white-space:nowrap;opacity:0;
           background:${GRAD};-webkit-background-clip:text;background-clip:text;color:transparent">FREE</div>
${head("SAVE &amp; SHIP", "Versions are free.", "", { x: 132, y: 118, size: 72 })}

      <div style="position:absolute;left:132px;top:346px;width:700px">
        <div class="tag" style="font-size:13px;color:${T.faint};margin-bottom:20px">VERSIONS · SWITCHING IS FREE</div>
        <div id="v1" class="panel" style="padding:24px 28px;display:flex;align-items:center;margin-bottom:14px">
          <div><div style="font-size:26px;font-weight:500">v2</div>
            <div class="mono" style="font-size:15px;color:${T.faint};margin-top:7px">20 Aug, 20:54</div></div>
          <div class="tag mono" style="margin-left:auto;font-size:14px;color:${T.lit}">0.1 CREDIT</div>
        </div>
        <div id="v0" class="panel" style="padding:24px 28px;display:flex;align-items:center">
          <div><div style="font-size:26px;font-weight:500">v1 · original</div>
            <div class="mono" style="font-size:15px;color:${T.faint};margin-top:7px">20 Aug, 20:47</div></div>
          <div class="tag mono" style="margin-left:auto;font-size:14px;color:${T.faint}">FREE</div>
        </div>
      </div>

      <div id="menu" class="panel-deep" style="position:absolute;right:200px;top:300px;width:470px;padding:16px 0">
${MENU.map((m, i) => `        <div id="mi${i}" style="padding:19px 30px;font-size:24px;color:${i === 0 ? T.ink : T.dim};
             ${i === 3 ? `border-top:1px solid ${T.rule};margin-top:12px;padding-top:26px;` : ""}">${m}</div>`).join("\n")}
        <div id="mhi" style="position:absolute;left:12px;right:12px;top:16px;height:60px;
             background:rgba(20,184,166,0.09);border-radius:9px;opacity:0"></div>
      </div>

      <div id="done" class="chip chip-on" style="position:absolute;right:200px;top:772px;font-size:16px;padding:14px 24px;opacity:0">
        elon.svg &nbsp;·&nbsp; 204 KB &nbsp;·&nbsp; SAVED
      </div>
    </div></div>`;

export const script = `${enterOf(9)}
${grainDrift(LEN)}
${headIn()}
      // the supergraphic arrives wide and settles, then drifts across the beat
      tl.fromTo("#super", { autoAlpha: 0, x: 90, scale: 1.10 },
        { autoAlpha: 0.16, x: 0, scale: 1, duration: 1.30, ease: "power3.out" }, 0.10);
      tl.to("#super", { x: -132, duration: ${(LEN - 1.6).toFixed(2)}, ease: "none" }, 1.40);
      tl.fromTo("#v1", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.52, ease: "power3.out" }, 0.34);
      tl.fromTo("#v0", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.52, ease: "power3.out" }, 0.50);
      tl.fromTo("#menu", { autoAlpha: 0, y: -20, scale: 0.975 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.46, ease: "power3.out" }, 3.30);
${stagger("#mi", 3.46, 5, { autoAlpha: 0, y: 14 }, 0.075, 0.34)}
      tl.to("#mhi", { autoAlpha: 1, duration: 0.22 }, 4.55);
      // the highlight walks the menu, then settles back on the one being taken
      tl.to("#mhi", { y: 79, duration: 0.34, ease: "power2.inOut" }, 5.15);
      tl.to("#mhi", { y: 158, duration: 0.34, ease: "power2.inOut" }, 5.70);
      tl.to("#mhi", { y: 0, duration: 0.40, ease: "power2.inOut" }, 6.35);
      tl.to("#done", { autoAlpha: 1, y: 0, duration: 0.42, ease: "back.out(1.9)" }, 7.05);
      tl.to("#v1", { scale: 1.02, duration: 0.50, ease: "power2.out" }, 7.05);
      tl.to("#v1", { scale: 1.0, duration: 0.50, ease: "power2.inOut" }, 7.55);

${exitOf(9, LEN)}`;
