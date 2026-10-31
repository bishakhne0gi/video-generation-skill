import { field, grainDrift, head, headIn, stagger, T } from "../lib/frame.mjs";
import { artSVGmode } from "../lib/art.mjs";
import { figma, illustrator, react } from "../lib/marks.mjs";
import { enterOf, exitOf } from "../lib/seams.mjs";
import { LEN as SCHED } from "../schedule.mjs";
export const LEN = SCHED[10];   // never restate a duration the schedule owns

const DESTS = [
  { k: "FIGMA",       mark: figma(58) },
  { k: "ILLUSTRATOR", mark: illustrator(58) },
  { k: "REACT",       mark: react(58, "rx") },
];

export const body = `${field("app", "dest", LEN)}
    <div id="stage" class="stage"><div class="inner">
${head("NO ROUND TRIP", "It is just a file.", "", { x: 132, y: 150, size: 88 })}

      <div id="fileart" style="position:absolute;right:210px;top:190px;width:330px;height:330px;background:#fff;border:1px solid ${T.rule}">
        ${artSVGmode("m9", "color", { extra: 'width="330" height="330" style="display:block"' })}
      </div>
      <div class="mono" id="filelbl" style="position:absolute;right:210px;top:534px;width:330px;text-align:center;font-size:16px;color:${T.dim}">rocket.svg</div>

      <div style="position:absolute;left:132px;top:700px;display:flex;gap:24px">
${DESTS.map((d, i) => `        <div id="ds${i}" class="panel" style="width:520px;padding:34px;display:flex;align-items:center;gap:26px">
          <span style="display:flex;width:58px;height:58px;align-items:center;justify-content:center">${d.mark}</span>
          <span class="tag tag-teal" style="font-size:20px">${d.k}</span>
        </div>`).join("\n")}
      </div>
      <div id="code" style="position:absolute;left:132px;top:520px;opacity:0">
        <span class="mono" style="font-size:34px;color:${T.dim}">&lt;img src=<span style="color:${T.lit}">"rocket.svg"</span>&gt;</span>
      </div>
    </div></div>`;

export const script = `${enterOf(10)}
${grainDrift(LEN)}
${headIn()}
      tl.fromTo("#fileart", { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.60, ease: "power3.out" }, 0.30);
      tl.fromTo("#filelbl", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.40 }, 0.66);
      tl.to("#code", { autoAlpha: 1, y: 0, duration: 0.50, ease: "power3.out" }, 1.70);
${stagger("#ds", 2.90, 3, { autoAlpha: 0, y: 30 }, 0.28, 0.55)}
      // the file travels to each destination as it is named
      tl.to("#fileart", { y: -14, duration: 0.50, ease: "power2.inOut" }, 3.10);
      tl.to("#fileart", { y: 0, duration: 0.50, ease: "power2.inOut" }, 3.60);
      tl.to("#fileart", { y: -14, duration: 0.50, ease: "power2.inOut" }, 4.10);
      tl.to("#fileart", { y: 0, duration: 0.50, ease: "power2.inOut" }, 4.60);
      tl.to("#fileart", { y: -14, duration: 0.50, ease: "power2.inOut" }, 5.10);
      tl.to("#fileart", { y: 0, duration: 0.50, ease: "power2.inOut" }, 5.60);
      // each card lights as the line names it, then all three hold lit
${[0, 1, 2].map((i) => `      tl.to("#ds${i}", { backgroundColor: "rgba(20,184,166,0.06)", duration: 0.30 }, ${(3.30 + i * 0.95).toFixed(2)});`).join("\n")}
      tl.to("#fileart", { scale: 1.06, duration: 1.00, ease: "power2.out" }, 6.10);
      // the React atom does the one thing that mark is known for
      tl.fromTo("#rx-orbits", { rotation: 0 }, { rotation: 360, duration: 9.0, ease: "none", transformOrigin: "50% 50%" }, 0);

${exitOf(10, LEN)}`;
