import { field, grainDrift, counter, counterRun, T } from "../lib/frame.mjs";
import { editorChrome, layerRow } from "../lib/ui.mjs";
import { stud } from "../lib/lego.mjs";
import { PATHS, artSVG } from "../lib/art.mjs";
import { enterOf, exitOf } from "../lib/seams.mjs";
import { LEN as SCHED } from "../schedule.mjs";
export const LEN = SCHED[5];   // never restate a duration the schedule owns

// The hero beat, and the longest in the film. These are the actual 31 paths the
// product returned for this image — the same bytes the editor loaded — landing
// in document order, which is dark to light because the quantizer sorts its
// clusters by luminance before the tracer ever runs.
const N = PATHS.length;                 // 31
const T0 = 0.95, SPAN = 6.60;
const at = (i) => T0 + (i * SPAN) / N;

export const body = `${field("app", "paths", LEN)}
    <div id="stage" class="stage"><div class="inner">
${editorChrome({ zoom: "100%", paths: "31 paths" })}

      <div style="position:absolute;left:282px;right:330px;top:72px;bottom:52px;background:${T.canvas}">
        <div id="art" style="position:absolute;left:50%;top:50%;width:726px;height:726px;
             margin:-363px 0 0 -363px;background:#fff">
          <img id="ghost" src="assets/plates/source.jpg" width="726" height="726"
               style="display:block;position:absolute;left:0;top:0;opacity:0.30"/>
          ${artSVG("svg1", { extra: 'width="726" height="726" style="display:block"' })}
        </div>
      </div>

      <!-- the 31 pieces the picture is made of, laid out as they are traced -->
      <div id="strip" style="position:absolute;left:302px;right:350px;bottom:82px;height:34px;
           display:flex;gap:5px;align-items:flex-end;justify-content:center">
${PATHS.map((p, i) => `        <span id="bk${i}" style="display:flex;opacity:0">${stud(p.fill, 30)}</span>`).join("\n")}
      </div>

      <div style="position:absolute;left:0;top:142px;width:282px;height:838px;overflow:hidden">
      <div id="layerlist2" style="position:absolute;left:0;top:0;width:282px">
${PATHS.map((p, i) => layerRow(i + 1, p.fill)).join("")}
      </div></div>

      <div style="position:absolute;right:26px;top:150px;width:278px">
        <div class="tag" style="font-size:12px;color:${T.faint}">PATHS TRACED</div>
        <div style="margin-top:12px;font-size:64px;line-height:1.16;color:${T.ink}">
          ${counter("pc", Array.from({ length: N + 1 }, (_, i) => `${String(i).padStart(2, "0")}/31`))}
        </div>
        <div style="height:1px;background:${T.rule};margin:30px 0 26px"></div>
        <div class="tag" style="font-size:12px;color:${T.faint}">CURRENT FILL</div>
        <div style="display:flex;align-items:center;gap:13px;margin-top:14px">
          <span id="sw" style="width:34px;height:34px;border-radius:6px;background:${PATHS[0].fill};border:1px solid ${T.hair}"></span>
          <span class="mono" style="font-size:21px;color:${T.ink}">
            ${counter("fx", PATHS.map((p) => p.fill.length === 4 ? "#" + [...p.fill.slice(1)].map((c) => c + c).join("").toUpperCase() : p.fill.toUpperCase()))}
          </span>
        </div>
        <div style="height:1px;background:${T.rule};margin:26px 0"></div>
        <div class="tag" style="font-size:12px;color:${T.faint}">ORDER</div>
        <div class="mono" style="margin-top:12px;font-size:19px;color:${T.dim}">dark &rarr; light</div>
      </div>
    </div></div>`;

export const script = `${enterOf(5)}
${grainDrift(LEN)}
      tl.fromTo("#art", { autoAlpha: 0, scale: 0.965 }, { autoAlpha: 1, scale: 1, duration: 0.60, ease: "power3.out" }, 0);
${PATHS.map((_, i) => `      tl.set("#svg1-p${i}", { autoAlpha: 0 }, 0);
      tl.to("#svg1-p${i}", { autoAlpha: 1, duration: 0.30, ease: "power2.out" }, ${at(i).toFixed(3)});`).join("\n")}
${PATHS.map((_, i) => `      tl.fromTo("#bk${i}", { autoAlpha: 0, y: -26, scale: 0.7 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.34, ease: "back.out(2.4)", immediateRender: false }, ${at(i).toFixed(3)});`).join("\n")}
${PATHS.map((_, i) => `      tl.set("#lr${i + 1}", { autoAlpha: 0 }, 0);
      tl.to("#lr${i + 1}", { autoAlpha: 1, duration: 0.24, ease: "power2.out" }, ${at(i).toFixed(3)});`).join("\n")}
      // the list runs past the panel, so it scrolls as it fills
      tl.fromTo("#layerlist2", { y: 0 }, { y: -252, duration: ${SPAN.toFixed(2)}, ease: "none" }, ${T0.toFixed(2)});
      // a row that has scrolled past the top is removed from layout, not just
      // clipped — a clipped row keeps its rect and still counts as an overlap
${Array.from({ length: 7 }, (_, i) =>
  `      tl.set("#lr${i + 1}", { autoAlpha: 0 }, ${(T0 + (SPAN * (i * 38 + 38)) / 252).toFixed(3)});`).join("\n")}
${counterRun("pc", N + 1, T0 - 0.10, SPAN)}
${counterRun("fx", N, T0, SPAN)}
${PATHS.map((p, i) => `      tl.to("#sw", { backgroundColor: "${p.fill}", duration: 0.16, ease: "none" }, ${at(i).toFixed(3)});`).join("\n")}
      tl.to("#ghost", { autoAlpha: 0, duration: 2.60, ease: "power1.in" }, ${(T0 + SPAN * 0.55).toFixed(2)});
      // stillness before the frame hands off — the whole stack, finished, held
      tl.to("#art", { scale: 1.035, duration: 1.10, ease: "power2.out" }, ${(T0 + SPAN).toFixed(2)});

${exitOf(5, LEN)}`;
