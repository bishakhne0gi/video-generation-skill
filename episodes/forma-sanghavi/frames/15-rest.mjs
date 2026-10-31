import { field, grainDrift, head, headIn, T } from "../lib/frame.mjs";
import { dock } from "../lib/ui.mjs";
import { featherPath, VB, GEO } from "../lib/last.mjs";
import { enterOf, exitOf } from "../lib/seams.mjs";
import { LEN as SCHED } from "../schedule.mjs";
export const LEN = SCHED[14];

// The rest of the console, at its real counts. The contact sheet is the
// product's compare view: twelve lasts a page, one locked camera across all of
// them, turning together — which is why it works as a comparison and a grid of
// independently-spinning thumbnails would not.
const CELLS = [
  ["CH-521510948-42", "98.9%"], ["CH-520510989-42", "98.3%"], ["CH-522511446-42", "98.3%"],
  ["CH-524510818-42", "98.2%"], ["CH-524510775-42", "98.0%"], ["CH-524510881-42", "98.0%"],
  ["CH-521520446-42", "97.9%"], ["CH-519513326-42", "97.8%"], ["CH-524510221-42", "97.8%"],
  ["CH-522512511-42", "97.8%"], ["CH-523514071-42", "97.6%"], ["CH-524510710-42", "97.6%"],
];
const STATS = [["5,209", "LASTS ON RECORD"], ["11", "BRANDS"], ["69", "SIZES HELD"], ["243/248", "LABELED"]];

export const body = `${field("app", "rest")}
    <div id="stg14" class="stage"><div class="inner">
${head("COMPARE · INVENTORY · LABELING · OVERVIEW", "Then pick it<br/>with your eyes.", null, { y: 106, size: 60 })}

      <div style="position:absolute;left:128px;top:520px;width:540px;
           display:grid;grid-template-columns:1fr 1fr;gap:44px 40px">
${STATS.map((s, i) => `        <div id="sv${i}">
          <div class="hdr num" style="font-size:${i === 0 ? 62 : 54}px;color:${i === 0 ? T.accent6 : T.title}">${s[0]}</div>
          <div class="tag tag-sm" style="margin-top:12px">${s[1]}</div>
        </div>`).join("\n")}
      </div>

      <div id="cs" style="position:absolute;right:104px;top:120px;width:1108px;
           display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:${T.surface};
           border:1px solid ${T.line}">
${CELLS.map((c, i) => `        <div id="cc${i}" style="background:${T.surface};padding:20px 18px 16px">
          <div style="height:132px;display:flex;align-items:center;justify-content:center">
            <svg viewBox="0 0 ${VB[2]} ${VB[3]}" width="216" height="${(216 * VB[3] / VB[2]).toFixed(0)}">
              <path id="cp${i}" d="${GEO.featherPath}" fill="${T.accent}" fill-opacity="0.10"
                    stroke="${T.accent6}" stroke-width="7" stroke-linejoin="round"/>
            </svg>
          </div>
          <div style="margin-top:10px;font-size:15px;color:${T.ink}">${c[0]}</div>
          <div class="num" style="margin-top:5px;font-size:14px;color:${T.accentText}">${c[1]} match</div>
        </div>`).join("\n")}
      </div>
      <div style="position:absolute;right:112px;top:1004px;display:flex;align-items:center;gap:22px">
        <span class="tag tag-sm" id="csl" style="color:${T.faint}">SELECT · 100 LASTS &nbsp;·&nbsp; ISO &nbsp;·&nbsp; AUTO-ROTATE</span>
        <span class="num" id="csp" style="font-size:17px;color:${T.faint}">1 / 9</span>
      </div>
${dock(1)}
    </div></div>`;

export const script = `${enterOf(14)}
${grainDrift("rest", LEN)}
${headIn(0.10)}
${CELLS.map((_, i) => `      tl.fromTo("#cc${i}", ${i < 6 ? "{ y: 18 }" : "{ autoAlpha: 0, y: 16 }"}, { autoAlpha: 1, y: 0, duration: 0.44, ease: "power3.out" }, ${(i * 0.04).toFixed(3)});`).join("\n")}
      tl.fromTo("#csl", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.44, ease: "power2.out" }, 1.30);
      tl.fromTo("#csp", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.44, ease: "power2.out" }, 1.45);

      // ONE camera across all twelve: every cell turns on the same clock, in
      // the same direction, for the whole beat. That is the compare view's
      // actual behaviour and it is what makes the grid readable.
${CELLS.map((_, i) => `      tl.fromTo("#cp${i}", { rotation: -7, transformOrigin: "50% 50%" }, { rotation: 7, duration: ${LEN.toFixed(2)}, ease: "none", immediateRender: false }, 0);`).join("\n")}

${STATS.map((_, i) => `      tl.fromTo("#sv${i}", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.50, ease: "power3.out" }, ${(2.30 + i * 0.85).toFixed(2)});`).join("\n")}

${exitOf(14, LEN)}`;
