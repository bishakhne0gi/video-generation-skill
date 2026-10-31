import { field, grainDrift, head, headIn, counter, counterRun, T } from "../lib/frame.mjs";
import { resultCard } from "../lib/ui.mjs";
import { enterOf, exitOf } from "../lib/seams.mjs";
import { LEN as SCHED } from "../schedule.mjs";
export const LEN = SCHED[3];

// The honest beat, and the one a demo usually hides: a name-only query returns
// a hundred lasts and every one of them reads 100%. These five rows are the
// literal top of that live result set — same codes, same badges, same
// `rework 0.0 mm`. The argument is made by the COLUMN, so the column is what
// the frame builds.
const ROWS = [
  { code: "CH-520522392-42", brand: "COLE HAAN", L: "282.2", W: "93.3", H: "104.8", G: "251",
    meta: "model 520522392 · Gents · size 42 · boot · round toe · heel 5mm", pct: "100% match", fit: "rework 0.0 mm" },
  { code: "CH-522511446-42", brand: "COLE HAAN", L: "285.6", W: "91.4", H: "99.6", G: "252",
    meta: "model 522511446 · Gents · size 42 · slip-on? · round toe · heel 15mm", pct: "100% match", fit: "rework 0.0 mm" },
  { code: "CH-522512154-42", brand: "COLE HAAN", L: "286.5", W: "91.6", H: "94.9", G: "248",
    meta: "model 522512154 · Gents · size 42 · oxford · round toe · heel 10mm", pct: "100% match", fit: "rework 0.0 mm" },
  { code: "CH-522512559-42", brand: "COLE HAAN", L: "279.6", W: "95.3", H: "102.2", G: "252",
    meta: "model 522512559 · Gents · size 42 · oxford? · round toe · heel 15mm", pct: "100% match", fit: "rework 0.0 mm" },
  { code: "CH-522552253-42", brand: "COLE HAAN", L: "293.7", W: "85.5", H: "105.4", G: "253",
    meta: "model 522552253 · Gents · size 42 · sneaker · round toe · back HC", pct: "100% match", fit: "rework 0.0 mm" },
];

export const body = `${field("app", "tie")}
    <div id="stg3" class="stage"><div class="inner">
${head("RESULTS · NAME ONLY", "A name is not<br/>a specification.", null, { y: 116, size: 72 })}

      <div style="position:absolute;left:128px;top:452px;display:flex;align-items:baseline;gap:18px">
        <span class="hdr num" id="rc" style="font-size:64px;color:${T.title}">
          ${counter("rcv", ["0", "38", "77", "100"], "hdr num")}</span>
        <span class="tag" id="rcl">RESULTS &nbsp;·&nbsp; CLOSEST MATCH FIRST</span>
      </div>

      <div style="position:absolute;left:760px;top:96px;width:1030px;display:flex;flex-direction:column;gap:13px">
${ROWS.map((r, i) => resultCard(`rw${i}`, r)).join("\n")}
      </div>

      <div id="tieline" style="position:absolute;left:1640px;top:96px;width:3px;height:900px;
           background:${T.axW};transform-origin:top center"></div>
      <div id="tiel" style="position:absolute;left:128px;top:556px;opacity:0">
        <div class="hdr num" style="font-size:88px;color:${T.axWt}">100%</div>
        <div class="tag tag-sm" style="margin-top:14px;color:${T.axWt}">EVERY ONE OF THEM</div>
      </div>
    </div></div>`;

export const script = `${enterOf(3)}
${grainDrift("tie", LEN)}
${headIn(0.10)}
      tl.fromTo("#rc",  { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.56, ease: "power3.out" }, 0.42);
      tl.fromTo("#rcl", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: "power2.out" }, 0.60);
${counterRun("rcv", 4, 0.55, 1.40)}

      // the rows arrive one at a time, and the sameness accumulates
${ROWS.map((_, i) => `      tl.fromTo("#rw${i}", { x: ${46 + i * 26} }, { x: 0, duration: 0.54, ease: "power3.out" }, ${(i * 0.075).toFixed(3)});`).join("\n")}

      // then a rule runs the length of the identical column and names it
      tl.fromTo("#tieline", { scaleY: 0 }, { scaleY: 1, duration: 1.60, ease: "power2.inOut" }, 3.10);
      tl.fromTo("#tiel", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.46, ease: "power3.out" }, 4.80);
${ROWS.map((_, i) => `      tl.fromTo("#rw${i}-badge", { scale: 1 }, { scale: 1.075, duration: 0.20, ease: "power2.out", overwrite: "auto" }, ${(3.20 + i * 0.72).toFixed(2)});
      tl.to("#rw${i}-badge", { scale: 1, duration: 0.28, ease: "power2.inOut", overwrite: "auto" }, ${(3.40 + i * 0.72).toFixed(2)});`).join("\n")}

${exitOf(3, LEN)}`;
