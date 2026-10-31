import { field, grainDrift, head, headIn, counter, counterRun, T } from "../lib/frame.mjs";
import { resultCard } from "../lib/ui.mjs";
import { enterOf, exitOf } from "../lib/seams.mjs";
import { LEN as SCHED } from "../schedule.mjs";
export const LEN = SCHED[5];

// The same hundred lasts, now separated. Both columns are live: the LEFT is
// the name-only tie (every badge 100%, every rework 0.0mm), the RIGHT is what
// the three numbers did to it. The rework figures are the ranking; the
// percentages are not, which is why they no longer agree.
const BEFORE = ["100%", "100%", "100%", "100%", "100%"];
const AFTER  = [
  { code: "CH-521510948-42", pct: "98.9%", fit: "rework 0.7 mm" },
  { code: "CH-520510989-42", pct: "98.3%", fit: "rework 1.0 mm" },
  { code: "CH-522511446-42", pct: "98.3%", fit: "rework 1.0 mm" },
  { code: "CH-524510818-42", pct: "98.2%", fit: "rework 1.1 mm" },
  { code: "CH-524510775-42", pct: "98.0%", fit: "rework 1.2 mm" },
];

// A rework bar, drawn to scale against the worst in the set. This is the one
// piece of chart in the film and it encodes the thing the film is about.
const BARW = 300;
const bar = (i, mm) => `
          <div style="position:relative;width:${BARW}px;height:12px;background:${T.fill2}">
            <div id="bar${i}" style="position:absolute;left:0;top:0;height:12px;width:${BARW}px;
                 background:${T.accent};transform-origin:left center;transform:scaleX(0)"></div>
          </div>`;

export const body = `${field("app", "rank")}
    <div id="stg5" class="stage"><div class="inner">
${head("RANKING · EFFORT-STEP", "Ranked by the work,<br/>not the resemblance.", null, { y: 112, size: 66 })}

      <div style="position:absolute;left:940px;top:104px;width:856px">
        <div style="display:flex;margin-bottom:20px">
          <span class="tag tag-sm" style="width:400px">NAME ONLY</span>
          <span class="tag tag-sm" style="color:${T.accentText}">+ STICK 285 · GIRTH 250 · HEEL 15</span>
        </div>
${AFTER.map((a, i) => `        <div id="rr${i}" style="display:flex;align-items:center;height:${i === 0 ? 108 : 96}px;border-top:1px solid ${T.line}">
          <div style="width:400px">
            <div class="num" style="font-size:${i === 0 ? 30 : 26}px;color:${T.faint}">${BEFORE[i]}</div>
            <div style="margin-top:6px;font-size:16px;color:${T.faint}">rework 0.0 mm</div>
          </div>
          <div id="rr${i}-new" style="opacity:0">
            <div style="display:flex;align-items:baseline;gap:16px">
              <span class="num" style="font-size:${i === 0 ? 34 : 28}px;color:${i === 0 ? T.title : T.ink}">${a.pct}</span>
              <span class="num" style="font-size:${i === 0 ? 22 : 19}px;color:${i === 0 ? T.accent6 : T.muted}">${a.fit}</span>
            </div>
            <div style="margin-top:10px;display:flex;align-items:center;gap:16px">
${bar(i, 0)}
              <span style="font-size:16px;color:${T.faint}">${a.code}</span>
            </div>
          </div>
        </div>`).join("\n")}
      </div>

      <div style="position:absolute;left:128px;top:600px">
        <div class="tag" id="dl">DISTANCE BETWEEN FIRST AND FIFTH</div>
        <div class="hdr num" id="dv" style="margin-top:18px;font-size:104px;color:${T.accent6}">
          ${counter("dvv", ["0.0", "0.2", "0.4", "0.5"], "hdr num")}<span style="font-size:44px;color:${T.muted}"> mm</span></div>
        <div class="lead" id="dd" style="margin-top:14px;font-size:22px;max-width:560px">
          Half a millimetre of hand work is the whole gap. Forma prices it before anyone touches a rasp.</div>
      </div>
    </div></div>`;

// Bars scale to the worst (1.2mm) so the first row reads as the shortest.
const MM = [0.7, 1.0, 1.0, 1.1, 1.2];

export const script = `${enterOf(5)}
${grainDrift("rank", LEN)}
${headIn(0.10)}
${AFTER.map((_, i) => `      tl.fromTo("#rr${i}", { x: ${34 + i * 18} }, { x: 0, duration: 0.52, ease: "power3.out" }, ${(i * 0.06).toFixed(3)});`).join("\n")}

      // the numbers separate, top-down, one row at a time
${AFTER.map((_, i) => `      tl.fromTo("#rr${i}-new", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.46, ease: "power3.out" }, ${(1.55 + i * 0.46).toFixed(2)});
      tl.fromTo("#bar${i}", { scaleX: 0 }, { scaleX: ${(MM[i] / 1.2).toFixed(3)}, duration: 0.86, ease: "power2.out" }, ${(1.70 + i * 0.46).toFixed(2)});`).join("\n")}

      tl.fromTo("#dl", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.44, ease: "power2.out" }, 4.20);
      tl.fromTo("#dv", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.54, ease: "power3.out" }, 4.35);
${counterRun("dvv", 4, 4.50, 1.40)}
      tl.fromTo("#dd", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.50, ease: "power3.out" }, 6.05);

${exitOf(5, LEN)}`;
