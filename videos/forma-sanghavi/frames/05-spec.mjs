import { field, grainDrift, head, headIn, typeLine, typeRun, T } from "../lib/frame.mjs";
import { chipSlot, chipLatch } from "../lib/ui.mjs";
import { enterOf, exitOf } from "../lib/seams.mjs";
import { LEN as SCHED } from "../schedule.mjs";
export const LEN = SCHED[4];

// The spec panel. The three subtitles under the fields are the product's own
// words for how each number is USED — read off the live panel, not invented:
// ball girth never filters, stick length regrades first, heel height gates a
// +/-15mm family. That is the whole reason a number beats a name.
const FIELDS = [
  { k: "Stick length", v: "285", u: "mm", rule: "regrade first · rank w2.5", at: 1.55 },
  { k: "Ball girth",   v: "250", u: "mm", rule: "no filter · rank w3",       at: 3.20 },
  { k: "Heel height",  v: "15",  u: "mm", rule: "filter ±15mm family · rank w2", at: 4.85 },
];
const REST = ["Bottom length", "Toe spring · ±2mm", "Toe thickness · from sole",
              "Comb height · cone · ±10mm", "Cone length · top plate · ±10mm", "Back lean"];

export const body = `${field("app", "spec")}
    <div id="stg4" class="stage"><div class="inner">
${head("LAST SPEC", "Give it numbers.", null, { y: 116, size: 72 })}

      <div style="position:absolute;left:128px;top:392px;width:1664px;
           background:${T.fill};border:1px solid ${T.line};padding:48px 54px">
        <div style="display:flex;gap:22px;margin-bottom:26px">
${FIELDS.map((f, i) => `          <div id="fd${i}" style="position:relative;flex:1;background:${T.surface};border:1px solid ${T.line};padding:24px 26px">
            <div id="fd${i}-ring" style="position:absolute;inset:-1px;border:1px solid ${T.accent};opacity:0"></div>
            <div style="display:flex;align-items:baseline">
              <span style="font-size:26px;color:${T.body}">${f.k}</span>
              <span class="num" style="margin-left:auto;font-size:34px;color:${T.ink}">${typeLine(`v${i}`, f.v, 34)}</span>
              <span style="margin-left:10px;font-size:22px;color:${T.faint}">${f.u}</span>
            </div>
            <div id="fd${i}-r" style="margin-top:14px;font-size:17px;color:${T.accentText};opacity:0">${f.rule}</div>
          </div>`).join("\n")}
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:13px">
${REST.map((t, i) => chipSlot(`rs${i}`, `${t} &nbsp;<span style="color:${T.faint}">— mm</span>`)).join("\n")}
        </div>
        <div style="margin-top:30px;font-size:17px;color:${T.faint};text-align:center">
          * mandatory on the customer request form · Category sits in the search bar ·
          sizes match on stick length, not the label</div>
      </div>
    </div></div>`;

export const script = `${enterOf(4)}
${grainDrift("spec", LEN)}
${headIn(0.10)}
${FIELDS.map((_, i) => `      tl.fromTo("#fd${i}", { y: ${22 + i * 10} }, { y: 0, duration: 0.54, ease: "power3.out" }, ${(i * 0.07).toFixed(3)});`).join("\n")}
${REST.map((_, i) => `      tl.fromTo("#rs${i}", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.44, ease: "power3.out" }, ${(0.30 + i * 0.06).toFixed(2)});`).join("\n")}

      // each number is typed, and its rule answers ~0.25s later — cause, then effect
${FIELDS.map((f, i) => `      tl.fromTo("#fd${i}-ring", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.22, ease: "power2.out" }, ${(f.at - 0.18).toFixed(2)});
${typeRun(`v${i}`, f.v, f.at, 9)}      tl.fromTo("#fd${i}-r", { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.40, ease: "power3.out" }, ${(f.at + 0.62).toFixed(2)});
      tl.to("#fd${i}-ring", { autoAlpha: 0, duration: 0.45, ease: "power2.inOut" }, ${(f.at + 1.05).toFixed(2)});`).join("\n")}

${exitOf(4, LEN)}`;
