import { field, grainDrift, head, headIn, T } from "../lib/frame.mjs";
import { featherPath, solePath, drawnPath, drawRun, VB, GEO } from "../lib/last.mjs";
import { enterOf, exitOf } from "../lib/seams.mjs";
import { LEN as SCHED } from "../schedule.mjs";
export const LEN = SCHED[11];

// ACT 4, and the frame the whole film is built to earn. Both curves here are
// real and they are the SAME last: the inner one is the featherline the
// instrument walked off `525512275-42-WO.stl`, the outer one is that curve
// dilated by `sole_spec.inset_contour` at the shipped Sanghavi allowance —
// 1.5mm along the sides, 2mm at toe and heel. That dilation is, geometrically,
// what a trimmed outsole IS.
//
// So the beat can run the argument backwards on screen: draw the sole, then
// inset it, and the featherline of an unknown last appears. That is stage 1 of
// docs/SOLE_MATCHING.md, drawn rather than described.
const STEPS = 26;
const W = 1180, H = (W * VB[3] / VB[2]);

export const body = `${field("paper", "sole")}
    <div id="stg11" class="stage"><div class="inner">
${head("MATCH A SOLE", "You have the sole,<br/>not the last.",
       "A sole has no girths and no heel seat. What it has is an outline — and an outline is enough.",
       { y: 112, size: 66, lw: 700 })}

      <svg id="sv" viewBox="-30 -30 ${VB[2] + 60} ${VB[3] + 60}" width="${W}" height="${H.toFixed(0)}"
           style="position:absolute;right:110px;top:300px;overflow:visible">
        <g id="sg">
          <g id="sd">${drawnPath("sd", GEO.solePath, STEPS, { w: 3.4, stroke: T.accent })}</g>
          <path id="band" d="${GEO.solePath}" fill="${T.accent}" fill-opacity="0.34" opacity="0"/>
          <path id="core" d="${GEO.featherPath}" fill="${T.bg}" opacity="0"/>
          ${solePath({ id: "so", w: 3.4 })}
          ${featherPath({ id: "fo", w: 3.0, stroke: T.title })}
          <g id="dim" opacity="0">
            <line x1="596" y1="-26" x2="596" y2="34" stroke="${T.accentText}" stroke-width="2.5"/>
            <text x="612" y="6" font-family="Manrope" font-size="26" font-weight="600"
                  fill="${T.accentText}">1.5 mm</text>
          </g>
        </g>
      </svg>

      <div id="lg" style="position:absolute;right:120px;top:${(300 + H + 40).toFixed(0)}px;display:flex;gap:44px">
        <div id="lg0" style="display:flex;align-items:center;gap:14px;opacity:0">
          <span style="width:34px;height:3px;background:${T.accent}"></span>
          <span style="font-size:21px;color:${T.body}">scanned outsole</span></div>
        <div id="lg1" style="display:flex;align-items:center;gap:14px;opacity:0">
          <span style="width:34px;height:3px;background:${T.title}"></span>
          <span style="font-size:21px;color:${T.body}">featherline, reconstructed</span></div>
        <div id="lg2" style="display:flex;align-items:center;gap:14px;opacity:0">
          <span class="num" style="font-size:21px;color:${T.accentText}">inset 1.5 mm sides · 2 mm toe &amp; heel</span></div>
      </div>
    </div></div>`;

export const script = `${enterOf(11)}
${grainDrift("sole", LEN)}
${headIn(0.10)}

      // 1. the sole arrives as a curve being walked
      tl.set("#so", { autoAlpha: 0 }, 0);
      tl.set("#fo", { autoAlpha: 0 }, 0);
${drawRun("#sd", STEPS, 0.0, 3.15)}
      tl.set("#sd [data-s='${STEPS - 1}']", { autoAlpha: 0 }, 3.22);
      tl.set("#so", { autoAlpha: 1 }, 3.22);
      tl.fromTo("#lg0", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.42, ease: "power3.out" }, 3.32);

      // 2. it is inset, and the last's own edge is what is left behind
      tl.set("#band", { autoAlpha: 1 }, 4.55);
      tl.fromTo("#fo", { autoAlpha: 0, scale: 1.028, transformOrigin: "50% 50%" },
        { autoAlpha: 1, scale: 1, duration: 1.15, ease: "power3.out" }, 4.70);
      tl.fromTo("#core", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.80, ease: "power2.inOut" }, 4.90);
      tl.fromTo("#dim", { autoAlpha: 0, x: -14 }, { autoAlpha: 1, x: 0, duration: 0.50, ease: "power3.out" }, 5.70);
      tl.fromTo("#lg2", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.42, ease: "power3.out" }, 4.95);
      tl.fromTo("#lg1", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.42, ease: "power3.out" }, 6.15);

      // 3. the pair holds and turns very slowly, so the gap between them reads
      tl.fromTo("#sg", { rotation: -1.0, transformOrigin: "50% 50%" },
        { rotation: 1.0, duration: ${LEN.toFixed(2)}, ease: "none", immediateRender: false }, 0);

${exitOf(11, LEN)}`;
