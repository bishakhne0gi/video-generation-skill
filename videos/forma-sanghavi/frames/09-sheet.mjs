import { field, grainDrift, head, headIn, counter, counterRun, T } from "../lib/frame.mjs";
import { cell } from "../lib/ui.mjs";
import { profilePath, VB, GEO } from "../lib/last.mjs";
import { enterOf, exitOf } from "../lib/seams.mjs";
import { LEN as SCHED } from "../schedule.mjs";
export const LEN = SCHED[8];

// The order sheet. The pairing that matters is on the left: the TAPED girth
// the modeller quotes, printed beside the mesh's own estimate, with the
// product's own note that ranking prefers the tape. A console that showed one
// number would be hiding which one it trusted.
const SPEC = [
  ["JOINT GIRTH (TAPED)", "251 mm", "· mesh ≈ 252"],
  ["WAIST GIRTH (TAPED)", "250 mm", "· mesh ≈ 254"],
  ["INSTEP GIRTH (TAPED)", "253 mm", "· mesh ≈ 256"],
  ["STICK LENGTH", "285.4 mm", ""],
  ["BOTTOM LENGTH", "280.8 mm", ""],
  ["HEEL HEIGHT", "15 mm", ""],
  ["TOE SPRING", "8.7 mm", ""],
  ["COMB HEIGHT (CONE)", "80 mm", ""],
];
const DERIVED = [
  ["BALL POSITION", "69%", "from heel"],
  ["BALL WIDTH", "93.0 mm", ""],
  ["WAIST WIDTH", "60.1 mm", ""],
  ["TOE LIFT (LAID FLAT)", "17.4 mm", ""],
];

export const body = `${field("app", "sheet")}
    <div id="stg8" class="stage"><div class="inner">
${head("CH-521510948-42 · SPEC SHEET", "Both numbers,<br/>and which one wins.", null, { y: 108, size: 62 })}

      <div style="position:absolute;left:128px;top:452px;width:1000px">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:34px 56px">
${SPEC.map((c, i) => `          <div id="sc${i}">${cell(c[0], c[1], c[2])}</div>`).join("\n")}
        </div>
        <div id="scn" style="margin-top:40px;font-size:19px;color:${T.muted};max-width:900px">
          From the model spec sheet. The taped girths are the numbers the modeller quotes,
          and search ranking prefers them over the mesh estimates shown alongside.</div>
      </div>

      <div style="position:absolute;left:1180px;top:190px;width:620px">
        <div class="tag tag-sm" id="dh" style="color:${T.accentText}">DERIVED FROM THE MESH</div>
        <div style="height:1px;background:${T.line};margin:20px 0 30px"></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:30px 40px">
${DERIVED.map((c, i) => `          <div id="dc${i}">${cell(c[0], c[1], c[2])}</div>`).join("\n")}
        </div>

        <div id="tri" style="margin-top:44px">
          <div class="tag tag-sm">TRIANGLES</div>
          <div class="hdr num" style="margin-top:12px;font-size:76px;color:${T.title}">
            ${counter("triv", ["0", "18,402", "36,110", "46,915"], "hdr num")}</div>
        </div>

        <div style="margin-top:34px;display:flex;gap:12px">
          <span class="chip chip-sm" id="ok0">units ok</span>
          <span class="chip chip-sm" id="ok1">watertight</span>
        </div>

        <div style="margin-top:44px">
          <div class="tag tag-sm" id="pfl">SIDE PROFILE · LEVELLED TO THE CONTACT PLANE</div>
          <svg id="pf" viewBox="0 0 ${VB[2]} ${GEO.profileHeightPx + 8}" width="620" height="${(620 * (GEO.profileHeightPx + 8) / VB[2]).toFixed(0)}"
               style="margin-top:18px;overflow:visible">
            <line x1="0" y1="${GEO.profileHeightPx.toFixed(1)}" x2="${VB[2]}" y2="${GEO.profileHeightPx.toFixed(1)}"
                  stroke="${T.line}" stroke-width="2" stroke-dasharray="10 10"/>
            ${profilePath({ w: 3.2 })}
          </svg>
        </div>
      </div>
    </div></div>`;

export const script = `${enterOf(8)}
${grainDrift("sheet", LEN)}
${headIn(0.10)}
${SPEC.map((_, i) => `      tl.fromTo("#sc${i}", ${i < 4 ? "{ y: 18 }" : "{ autoAlpha: 0, y: 16 }"}, { autoAlpha: 1, y: 0, duration: 0.46, ease: "power3.out" }, ${(i * 0.075).toFixed(3)});`).join("\n")}
      tl.fromTo("#scn", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.50, ease: "power2.out" }, 2.35);

      tl.fromTo("#dh", { y: 12 }, { y: 0, duration: 0.44, ease: "power3.out" }, 0.02);
${DERIVED.map((_, i) => `      tl.fromTo("#dc${i}", ${i < 2 ? "{ y: 16 }" : "{ autoAlpha: 0, y: 14 }"}, { autoAlpha: 1, y: 0, duration: 0.46, ease: "power3.out" }, ${(0.10 + i * 0.34).toFixed(3)});`).join("\n")}

      tl.fromTo("#tri", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.50, ease: "power3.out" }, 3.15);
${counterRun("triv", 4, 3.30, 1.95)}
      tl.fromTo("#ok0", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.36, ease: "power3.out" }, 5.45);
      tl.fromTo("#ok1", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.36, ease: "power3.out" }, 5.62);

      tl.fromTo("#pfl", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.42, ease: "power2.out" }, 6.05);
      // the profile arrives by sweeping its own contact plane under it
      tl.fromTo("#pf", { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.62, ease: "power3.out" }, 6.20);

${exitOf(8, LEN)}`;
