import { field, grainDrift, head, headIn, cursorSVG, cursorTo, cursorTap, T } from "../lib/frame.mjs";
import { measured } from "../lib/ui.mjs";
import { featherPath, drawnPath, drawRun, VB, GEO } from "../lib/last.mjs";
import { enterOf, exitOf } from "../lib/seams.mjs";
import { LEN as SCHED } from "../schedule.mjs";
export const LEN = SCHED[9];

// ACT 3. The other door in: no spec sheet, just the mesh. Every chip that
// appears is what the server measured off THIS upload, read verbatim off the
// live panel after the file landed.
const CHIPS = [
  "Stick 291.5mm", "Joint girth 252.7mm", "Waist girth 253.4mm", "Instep girth 257.2mm",
  "Tread width 93.1mm", "Toe round", "Ball pos 63.2%", "Sole signature ✓",
];
const STEPS = 24;

export const body = `${field("app", "stl")}
    <div id="stg9" class="stage"><div class="inner">
${head("MATCH AN STL", "No spec sheet?<br/>Hand it the mesh.", null, { y: 116, size: 68 })}

      <div id="drop" style="position:absolute;left:128px;top:452px;width:760px;height:300px;
           border:1px dashed ${T.line2};background:${T.fill};
           display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px">
        <div id="drop-ring" style="position:absolute;inset:-1px;border:1px solid ${T.accent};opacity:0"></div>
        <div id="dropt" style="font-size:26px;color:${T.muted}">Drop a last STL to measure and match</div>
        <div class="tag tag-sm" style="color:${T.faint}">.STL &nbsp;·&nbsp; MEASURED SERVER-SIDE</div>
      </div>

      <div id="file" style="position:absolute;left:404px;top:520px;width:208px;opacity:0">
        <div style="background:${T.surface};border:1px solid ${T.line};padding:22px 20px">
          <svg viewBox="0 0 ${VB[2]} ${VB[3]}" width="166" height="${(166 * VB[3] / VB[2]).toFixed(0)}">
            ${featherPath({ id: "fic", w: 5, stroke: T.wire })}
          </svg>
        </div>
        <div class="num" style="margin-top:11px;font-size:16px;color:${T.body};text-align:center">525512275-42-WO.stl</div>
      </div>

      <div style="position:absolute;left:980px;top:186px;width:812px">
        <div class="tag tag-sm" id="mh" style="opacity:0;color:${T.accentText}">MEASURED WITH THE CORPUS INSTRUMENTS</div>
        <div style="height:1px;background:${T.line};margin:20px 0 28px"></div>
${measured("mz", CHIPS)}

        <svg id="ml" viewBox="0 0 ${VB[2]} ${VB[3]}" width="812" height="${(812 * VB[3] / VB[2]).toFixed(0)}"
             style="margin-top:44px;overflow:visible">
          ${drawnPath("ml", GEO.featherPath, STEPS, { w: 3.0, stroke: T.accent })}
          ${featherPath({ id: "ml-full", w: 3.0, stroke: T.accent })}
        </svg>
        <div class="tag tag-sm" id="mll" style="margin-top:22px;color:${T.faint};opacity:0">
          FEATHERLINE EXTRACTED · 256 POINTS · THE SAME INSTRUMENT THE ARCHIVE WAS BUILT WITH</div>
      </div>
      <div id="cur" class="cursor">${cursorSVG}</div>
    </div></div>`;

export const script = `${enterOf(9)}
${grainDrift("stl", LEN)}
${headIn(0.10)}
      tl.fromTo("#drop", { y: 26 }, { y: 0, duration: 0.58, ease: "power3.out" }, 0.02);

      // the cursor CARRIES the file in and drops it; the ring answers the drop
${cursorTo([[-160, 640], [560, 600, 0.90], [606, 646, 0.42]], 1.05)}
      tl.fromTo("#file", { autoAlpha: 0, x: -840, y: 0, scale: 0.86 },
        { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 0.90, ease: "power2.out" }, 1.05);
      tl.to("#file", { x: 42, y: 34, duration: 0.42, ease: "power2.inOut", overwrite: "auto" }, 1.95);
${cursorTap(2.40)}
      tl.to("#file", { autoAlpha: 0, scale: 0.92, duration: 0.28, ease: "power2.in" }, 2.52);
      tl.to("#dropt", { autoAlpha: 0, duration: 0.24, ease: "power2.in" }, 2.52);
      tl.fromTo("#drop-ring", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.26, ease: "power2.out" }, 2.60);
      tl.to("#cur", { x: 1500, y: 940, duration: 0.72, ease: "power2.inOut" }, 2.70);
      tl.to("#cur", { autoAlpha: 0, duration: 0.26 }, 3.42);

      // measurement comes back a chip at a time — a server working, not a list
      tl.fromTo("#mh", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.40, ease: "power3.out" }, 2.86);
${CHIPS.map((_, i) => `      tl.fromTo("#mz-m${i}", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.40, ease: "power3.out" }, ${(3.00 + i * 0.30).toFixed(2)});`).join("\n")}

      tl.set("#ml-full", { autoAlpha: 0 }, 0);
${drawRun("#ml", STEPS, 5.55, 2.35)}
      tl.set("#ml [data-s='${STEPS - 1}']", { autoAlpha: 0 }, 7.95);
      tl.set("#ml-full", { autoAlpha: 1 }, 7.95);
      tl.fromTo("#mll", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.48, ease: "power2.out" }, 8.05);

${exitOf(9, LEN)}`;
