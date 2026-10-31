import { field, grainDrift, counter, counterRun, typeLine, typeRun, T } from "../lib/frame.mjs";
import { LEN as SCHED } from "../schedule.mjs";
import { enterOf, exitOf } from "../lib/seams.mjs";
export const LEN = SCHED[1];

// Enters from BELOW 1.0 and grows — the outgoing frame was pushing IN, so this
// half must be pushing in too or the Z seam reads as a bounce.
//
// The paragraph that used to live here has gone. Nobody reads three lines at
// this speed: the headline states it, one typed line proves it, and the picture
// does the rest. image-rendering:pixelated is the honest thing — this IS the file.
const BOX = 800, BX = 962, BY = 148;
const corner = (x, y, i) => `        <span id="pc${i}" style="position:absolute;${x}:-1px;${y}:-1px;
          width:40px;height:40px;border-${x}:2px solid ${T.lit};border-${y}:2px solid ${T.lit};opacity:0"></span>`;

export const body = `${field("void", "fall", LEN)}
    <div id="stage" class="stage"><div class="inner">

      <div class="tag" id="s-tag" style="position:absolute;left:132px;top:150px">RASTER</div>
      <div class="rule" id="s-rule" style="position:absolute;left:132px;top:182px;width:250px"></div>
      <div class="hdr" id="s-hdr" style="position:absolute;left:132px;top:222px;font-size:104px"><span class="grad" style="display:inline-block;padding-bottom:0.06em">It falls<br/>apart.</span></div>

      <div style="position:absolute;left:132px;top:512px">
        ${typeLine("px1", "1 px = 1 colour", 50)}
      </div>

      <div id="chips" style="position:absolute;left:132px;top:626px;display:flex;gap:12px;opacity:0">
        <div class="chip chip-on mono" style="letter-spacing:0.04em">${counter("hexr", ["#8F8E97", "#A58C8C", "#BA8E87", "#E0A97A"])}</div>
        <div class="chip">no curve to follow</div>
      </div>

      <div id="px" style="position:absolute;left:${BX}px;top:${BY}px;width:${BOX}px;height:${BOX}px;overflow:hidden;border:1px solid ${T.rule}">
        <img src="assets/plates/source.jpg" width="3200" height="3200"
             style="display:block;position:absolute;left:-1320px;top:-1190px;image-rendering:pixelated"/>
        <div id="grid" style="position:absolute;inset:0;opacity:0;
             background-image:linear-gradient(to right,rgba(255,255,255,0.16) 1px,transparent 1px),
                              linear-gradient(to bottom,rgba(255,255,255,0.16) 1px,transparent 1px);
             background-size:40px 40px"></div>
        <div id="cell" style="position:absolute;left:360px;top:400px;width:40px;height:40px;
             border:2px solid ${T.lit};opacity:0"></div>
${corner("left", "top", 0)}
${corner("right", "top", 1)}
${corner("left", "bottom", 2)}
${corner("right", "bottom", 3)}
      </div>
    </div></div>`;

export const script = `${enterOf(1)}
${grainDrift(LEN)}
      tl.fromTo("#s-rule", { scaleX: 0 }, { scaleX: 1, duration: 0.50, ease: "power3.out" }, 0.14);
      tl.fromTo("#s-hdr",  { y: 18 }, { y: 0, duration: 0.58, ease: "power3.out" }, 0);
      tl.fromTo("#px", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.44, ease: "power2.out" }, 0);
      tl.fromTo("#px img", { scale: 1, x: 0, y: 0 }, { scale: 1.40, x: -70, y: 40, duration: 6.30, ease: "power1.inOut" }, 0.95);
${[0, 1, 2, 3].map((i) => `      tl.fromTo("#pc${i}", { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 1, scale: 1, duration: 0.40, ease: "back.out(2.2)" }, ${(0.34 + i * 0.08).toFixed(2)});`).join("\n")}
${typeRun("px1", "1 px = 1 colour", 50, 0.92, 17)}
      tl.to("#grid", { autoAlpha: 1, duration: 0.60, ease: "power2.out" }, 1.95);
      tl.to("#cell", { autoAlpha: 1, duration: 0.26, ease: "power2.out" }, 2.60);
      tl.to("#chips", { autoAlpha: 1, y: 0, duration: 0.48, ease: "power3.out" }, 2.85);
      // the marker keeps walking the grid to the end of the beat
      tl.to("#cell", { x: 120, y: -80, duration: 0.72, ease: "power2.inOut" }, 3.35);
      tl.to("#cell", { x: 40,  y: 40,  duration: 0.72, ease: "power2.inOut" }, 4.35);
      tl.to("#cell", { x: 160, y: 0,   duration: 0.72, ease: "power2.inOut" }, 5.35);
      tl.to("#cell", { x: 80,  y: -120, duration: 0.72, ease: "power2.inOut" }, 6.30);
${counterRun("hexr", 4, 3.35, 3.60)}

${exitOf(1, LEN)}`;
