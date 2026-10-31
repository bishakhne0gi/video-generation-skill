import { field, grainDrift, brackets, counter, counterRun, T } from "../lib/frame.mjs";
import { chipSlot, chipLatch, axis, girth } from "../lib/ui.mjs";
import { enterOf, exitOf } from "../lib/seams.mjs";
import { LEN as SCHED } from "../schedule.mjs";
export const LEN = SCHED[12];

// The result of that reconstruction, live. The path was detected, not
// declared: the panel reported `detected: flat outsole ✓` on its own, and the
// three-way Auto / Cupsole / Flat control is the override for when it is wrong.
const MEAS = ["Sole length 283.4mm", "Tread width 93.5mm", "Waist width 63.5mm",
              "Heel seat width 61.3mm", "Toe round", "Ball pos 64.2%", "Sole signature ✓"];
const HITS = [
  { c: "CH-525510978-42", b: "COLE HAAN",  p: "99.8% match", f: "sole fit 0.30" },
  { c: "CH-526511045-42", b: "COLE HAAN",  p: "99.2% match", f: "sole fit 0.59" },
  { c: "TZ-522513225-9",  b: "TEMPE ZARA", p: "98.7% match", f: "sole fit 0.74" },
];

export const body = `${field("app", "hit")}
    <div id="stg12" class="stage"><div class="inner">
      <div class="tag" id="k1" style="position:absolute;left:128px;top:112px">CLOSEST LASTS TO SOLE-525512275-SCAN.STL</div>
      <div class="rule" id="k2" style="position:absolute;left:128px;top:142px;width:230px"></div>

      <div style="position:absolute;left:128px;top:196px;width:1664px;
           background:${T.surface};border:1px solid ${T.line};padding:34px 38px">
        <div style="display:flex;flex-wrap:wrap;gap:12px" id="mz">
${MEAS.map((t, i) => `          <span id="mz${i}" class="chip chip-sm" style="font-size:18px">${t}</span>`).join("\n")}
        </div>
        <div style="height:1px;background:${T.line};margin:28px 0"></div>
        <div style="display:flex;align-items:center;gap:20px">
          <span class="tag tag-sm" style="color:${T.faint}">SCAN TYPE — RE-MEASURES LIVE</span>
${chipSlot("st0", "Auto")}
${chipSlot("st1", "Cupsole")}
${chipSlot("st2", "Flat")}
          <span id="det" style="margin-left:16px;font-size:21px;color:${T.accentText};opacity:0">detected: flat outsole ✓</span>
          <span class="tag tag-sm" style="margin-left:auto;color:${T.faint}">EDGE ALLOWANCE</span>
${chipSlot("al0", "Sides &nbsp;<b style='font-weight:600'>1.5</b> mm", true)}
${chipSlot("al1", "Toe/heel &nbsp;<b style='font-weight:600'>2</b> mm", true)}
        </div>
      </div>

      <div id="win" style="position:absolute;left:128px;top:498px;width:1000px;
           background:${T.surface};border:1px solid rgba(0,174,239,0.55);padding:40px 44px">
${brackets()}
        <div style="display:flex;align-items:center">
          <span style="font-size:44px;font-weight:600;color:${T.title}">ZT-525512275-42</span>
          <span class="chip chip-sm" style="margin-left:20px;font-size:15px">TEMPE ZARA</span>
          <span class="badge" id="wb" style="margin-left:auto;font-size:20px">99.8% match</span>
        </div>
        <div style="display:flex;align-items:center;margin-top:26px">
          <div style="display:flex;gap:11px">${axis("L", "291.6")}${axis("W", "94.4")}${axis("H", "101.1")}${girth("255")}</div>
        </div>
        <div style="height:1px;background:${T.line};margin:32px 0 28px"></div>
        <div style="display:flex;align-items:flex-end;gap:70px">
          <div id="rk">
            <div class="tag tag-sm">RANK</div>
            <div class="hdr num" style="margin-top:12px;font-size:80px;color:${T.title}">1
              <span style="font-size:34px;color:${T.muted}"> of ${"5,209"}</span></div>
          </div>
          <div id="sf">
            <div class="tag tag-sm">SOLE FIT</div>
            <div class="hdr num" style="margin-top:12px;font-size:80px;color:${T.accent6}">
              ${counter("sfv", ["1.00", "0.61", "0.34", "0.25"], "hdr num")}</div>
          </div>
        </div>
      </div>

      <div style="position:absolute;left:1200px;top:498px;width:592px">
        <div class="tag tag-sm" id="nl">NEXT THREE</div>
        <div style="height:1px;background:${T.line};margin:20px 0 4px"></div>
${HITS.map((h, i) => `        <div id="hq${i}" style="display:flex;align-items:center;padding:28px 0;border-bottom:1px solid ${T.line}">
          <div>
            <div style="font-size:24px;color:${T.ink}">${h.c}</div>
            <div style="margin-top:7px;font-size:16px;color:${T.faint}">${h.b}</div>
          </div>
          <div style="margin-left:auto;text-align:right">
            <div class="num" style="font-size:20px;color:${T.muted}">${h.p}</div>
            <div class="num" style="margin-top:7px;font-size:20px;color:${T.accentText}">${h.f}</div>
          </div>
        </div>`).join("\n")}
        <div id="hn" style="margin-top:26px;font-size:19px;color:${T.muted}">
          Lasts that share this bottom rank together. The side-by-side viewers are the human call.</div>
      </div>
    </div></div>`;

export const script = `${enterOf(12)}
${grainDrift("hit", LEN)}
      tl.fromTo("#k1", { y: 12 }, { y: 0, duration: 0.50, ease: "power3.out" }, 0);
      tl.fromTo("#k2", { scaleX: 0 }, { scaleX: 1, duration: 0.50, ease: "power3.out" }, 0.06);
${MEAS.map((_, i) => `      tl.fromTo("#mz${i}", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.38, ease: "power3.out" }, ${(0.20 + i * 0.11).toFixed(2)});`).join("\n")}

      // the path detects itself, then says so
${chipLatch("st0", 1.35)}
${chipLatch("st2", 1.62)}
      tl.fromTo("#det", { autoAlpha: 0, x: -12 }, { autoAlpha: 1, x: 0, duration: 0.42, ease: "power3.out" }, 1.82);

      tl.fromTo("#win", { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.60, ease: "power3.out" }, 2.35);
      tl.fromTo("#rk", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.52, ease: "power3.out" }, 3.20);
      tl.fromTo("#sf", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.52, ease: "power3.out" }, 3.55);
${counterRun("sfv", 4, 3.70, 2.15)}
      tl.fromTo("#wb", { scale: 0.94 }, { scale: 1, duration: 0.40, ease: "power3.out" }, 5.95);

      tl.fromTo("#nl", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.42, ease: "power2.out" }, 4.60);
${HITS.map((_, i) => `      tl.fromTo("#hq${i}", { autoAlpha: 0, x: 28 }, { autoAlpha: 1, x: 0, duration: 0.44, ease: "power3.out" }, ${(4.80 + i * 0.34).toFixed(2)});`).join("\n")}
      tl.fromTo("#hn", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.48, ease: "power3.out" }, 6.35);

${exitOf(12, LEN)}`;
