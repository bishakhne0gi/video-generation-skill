import { field, grainDrift, counter, counterRun, typeLine, typeRun, T } from "../lib/frame.mjs";
import { LEN as SCHED } from "../schedule.mjs";
import { exitOf } from "../lib/seams.mjs";
export const LEN = SCHED[0];

// The opening. One object, lit, in an inspection frame that draws itself, and
// almost no type — the filename types on, the specs arrive, and the plate
// starts growing while he says "watch what happens when you need it bigger".
const BOX = 640, BX = (1920 - BOX) / 2, BY = 176;
const corner = (x, y, sx, sy, i) => `      <span id="cn${i}" style="position:absolute;${x}:-1px;${y}:-1px;
        width:44px;height:44px;border-${x}:2px solid ${T.lit};border-${y}:2px solid ${T.lit};opacity:0"></span>`;

export const body = `${field("void", "open", LEN)}
    <div id="stage" class="stage"><div class="inner">

      <div class="tag" id="s-tag" style="position:absolute;left:132px;top:112px">SOURCE FILE</div>
      <div class="rule" id="s-rule" style="position:absolute;left:132px;top:144px;width:250px"></div>

      <div style="position:absolute;right:132px;top:104px;text-align:right">
        <div class="tag" style="font-size:13px;color:${T.faint}">ZOOM</div>
        <div style="margin-top:8px;font-size:66px;line-height:1.16">
          ${counter("z1", ["100%", "128%", "162%", "196%", "222%", "244%", "252%"])}
        </div>
      </div>

      <!-- the object, in a frame that draws its own corners -->
      <div id="plate" style="position:absolute;left:${BX}px;top:${BY}px;width:${BOX}px;height:${BOX}px">
        <div id="glow" style="position:absolute;inset:-90px;border-radius:50%;opacity:0;
             background:radial-gradient(circle,rgba(20,184,166,0.20) 0%,transparent 68%)"></div>
        <div id="edge" style="position:absolute;inset:-1px;border:1px solid ${T.rule}"></div>
        <img id="raster" src="assets/plates/source.jpg" width="${BOX}" height="${BOX}"
             style="display:block;position:relative;width:${BOX}px;height:${BOX}px"/>
${corner("left", "top", 1, 1, 0)}
${corner("right", "top", -1, 1, 1)}
${corner("left", "bottom", 1, -1, 2)}
${corner("right", "bottom", -1, -1, 3)}
        <div id="retic" style="position:absolute;left:250px;top:192px;width:150px;height:150px;
             border:1px solid ${T.lit};opacity:0"></div>
      </div>

      <div style="position:absolute;left:0;right:0;top:${BY + BOX + 46}px;text-align:center">
        ${typeLine("fn", "elon.jpg", 52)}
      </div>

      <div id="specs" style="position:absolute;left:0;right:0;top:${BY + BOX + 128}px;
           display:flex;gap:12px;justify-content:center">
        <div class="chip" id="sp0">400 &times; 400</div>
        <div class="chip" id="sp1">20,059 bytes</div>
        <div class="chip" id="sp2">JPEG</div>
      </div>
    </div></div>`;

export const script = `${grainDrift(LEN)}
      tl.fromTo("#s-rule", { scaleX: 0 }, { scaleX: 1, duration: 0.55, ease: "power3.out" }, 0.12);
      tl.fromTo("#plate", { autoAlpha: 0, scale: 0.955 }, { autoAlpha: 1, scale: 1, duration: 0.92, ease: "power3.out" }, 0.08);
      tl.to("#glow", { autoAlpha: 1, duration: 1.30, ease: "power2.out" }, 0.30);
${[0, 1, 2, 3].map((i) => `      tl.fromTo("#cn${i}", { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 1, scale: 1, duration: 0.42, ease: "back.out(2.2)" }, ${(0.62 + i * 0.09).toFixed(2)});`).join("\n")}
${typeRun("fn", "elon.jpg", 52, 1.05, 15)}
${[0, 1, 2].map((i) => `      tl.fromTo("#sp${i}", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.48, ease: "power3.out" }, ${(1.95 + i * 0.12).toFixed(2)});`).join("\n")}

      // the upscale runs the rest of the beat — it IS what the line describes
      tl.to("#plate", { scale: 1.24, duration: 6.35, ease: "power1.in" }, 1.85);
${counterRun("z1", 7, 1.85, 6.35)}
      tl.to("#retic", { autoAlpha: 1, duration: 0.34, ease: "power2.out" }, 4.10);
      tl.to("#retic", { scale: 1.32, duration: 2.60, ease: "power2.in" }, 4.40);

${exitOf(0, LEN)}`;
