import { field, grainDrift, head, headIn, typeLine, typeRun, T } from "../lib/frame.mjs";
import { enterOf, exitOf } from "../lib/seams.mjs";
import { LEN as SCHED } from "../schedule.mjs";
export const LEN = SCHED[7];

// The modification plan, written the way the product writes it. Every string
// below was rendered by `reworkPlan` on the live result cards — the verbs are
// the modeller's, and the colour language is the product's: red means putty
// (building material up), muted means rasp or grade (taking it down).
const PLANS = [
  { code: "CH-521510948-42", mm: "0.7", steps: [
      { t: "rasp 1mm girth", flag: false } ] },
  { code: "CH-520510989-42", mm: "1.0", steps: [
      { t: "grade up 3.8mm", flag: false },
      { t: "girth lands 250.1 ✓", ok: true } ] },
  { code: "CH-524510775-42", mm: "1.2", steps: [
      { t: "putty +0.5mm length", flag: true },
      { t: "rasp 2mm girth", flag: false } ] },
];

const colour = (s) => s.ok ? T.accent6 : s.flag ? T.axHt : T.ink;

export const body = `${field("app", "plan")}
    <div id="stg7" class="stage"><div class="inner">
${head("MODIFICATION PLAN", "It writes the job,<br/>then prices it.", null, { y: 116, size: 68 })}

      <div style="position:absolute;left:840px;top:130px;width:950px">
${PLANS.map((p, i) => `        <div id="pl${i}" style="background:${T.surface};border:1px solid ${T.line};padding:34px 38px;margin-bottom:18px">
          <div style="display:flex;align-items:baseline">
            <span style="font-size:30px;font-weight:600;color:${T.title}">${p.code}</span>
            <span class="num" style="margin-left:auto;font-size:26px;color:${T.accentText}">rework ${p.mm} mm</span>
          </div>
          <div style="margin-top:22px;display:flex;flex-direction:column;gap:14px">
${p.steps.map((s, j) => `            <div style="display:flex;align-items:center;gap:16px">
              <i id="pl${i}s${j}-d" style="width:7px;height:7px;background:${colour(s)};opacity:0"></i>
              <span style="font-size:30px;color:${colour(s)}">${typeLine(`pl${i}s${j}`, s.t, 30, { caret: colour(s) })}</span>
            </div>`).join("\n")}
          </div>
        </div>`).join("\n")}
      </div>

      <div style="position:absolute;left:128px;top:600px;width:600px">
        <div class="tag tag-sm" id="lg">THE COLOUR IS THE COST</div>
        <div style="height:1px;background:${T.line};margin:20px 0 26px"></div>
        <div id="lg1" style="display:flex;align-items:center;gap:16px;margin-bottom:18px">
          <i style="width:9px;height:9px;background:${T.ink}"></i>
          <span style="font-size:24px;color:${T.body}">rasp · grade — material comes off</span></div>
        <div id="lg2" style="display:flex;align-items:center;gap:16px">
          <i style="width:9px;height:9px;background:${T.axHt}"></i>
          <span style="font-size:24px;color:${T.body}">putty — material goes back on, and costs about four times as much</span></div>
      </div>
    </div></div>`;

// Each line types where the narration reaches it. Dot first, then the words —
// cause 0.2s before effect.
const AT = [[1.00], [2.60, 4.05], [5.35, 6.60]];

export const script = `${enterOf(7)}
${grainDrift("plan", LEN)}
${headIn(0.10)}
${PLANS.map((_, i) => `      tl.fromTo("#pl${i}", { x: ${40 + i * 22} }, { x: 0, duration: 0.54, ease: "power3.out" }, ${(i * 0.075).toFixed(3)});`).join("\n")}

${PLANS.map((p, i) => p.steps.map((s, j) => {
  const t = AT[i][j];
  return `      tl.fromTo("#pl${i}s${j}-d", { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.26, ease: "power3.out" }, ${(t - 0.20).toFixed(2)});
${typeRun(`pl${i}s${j}`, s.t, t, 17)}`;
}).join("")).join("")}

      tl.fromTo("#lg",  { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.44, ease: "power2.out" }, 5.10);
      tl.fromTo("#lg1", { autoAlpha: 0, x: -16 }, { autoAlpha: 1, x: 0, duration: 0.46, ease: "power3.out" }, 5.28);
      tl.fromTo("#lg2", { autoAlpha: 0, x: -16 }, { autoAlpha: 1, x: 0, duration: 0.46, ease: "power3.out" }, 5.46);

${exitOf(7, LEN)}`;
