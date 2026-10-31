// EP27 · 10 TABLE — the payoff, and it is the RFC's OWN table (§1, Table 1), transcribed
// rather than invented. The yellow marker runs VERTICALLY down the answer column: the
// signature move rotated 90°, which is why it can be spent a sixth time without wearing out.
import { field, enterAcross, exitAcross, header, headerIn, penPath, penIn, ellipseD, underlineD } from "../lib/frame.mjs";

const COLS = ["GET", "QUERY", "POST"];
const ROWS = [
  ["Safe",                 "yes",              "yes",                 "potentially no"],
  ["Idempotent",           "yes",              "yes",                 "potentially no"],
  ["A URI for the query",  "yes, by definition", "optional (Location)", "no"],
  ["Cacheable",            "yes",              "yes",                 "only for later GET"],
  ["Content (a body)",     "“no defined semantics”", "expected", "expected"],
];

export function build({ len }) {
  const LX = 112, LW = 452, CW = 402, GAP = 12, HY = 404, RY = 476, RH = 84;
  const cx = (i) => LX + LW + GAP + i * (CW + GAP);
  const circ = ellipseD(cx(1) + 96, HY + 18, 138, 40, 12);
  // the one cell that disqualifies GET for this problem
  const gx = underlineD(cx(0) - 10, RY + 4 * RH + 30, 344, 17);

  const head = COLS.map((c, i) =>
    `<div id="f10-h${i}" class="mono" style="position:absolute;left:${cx(i)}px;top:${HY}px;font-size:30px;font-weight:700">${c}</div>`).join("");

  const rows = ROWS.map((r, ri) => {
    const y = RY + ri * RH;
    const label = `<div id="f10-r${ri}l" class="deck" style="position:absolute;left:${LX}px;top:${y + 6}px;width:${LW}px;font-size:30px;color:var(--ink)">${r[0]}</div>`;
    const cells = [1, 2, 3].map((k) =>
      `<div id="f10-r${ri}c${k - 1}" class="mono phrase" style="position:absolute;left:${cx(k - 1)}px;top:${y + 8}px;width:${CW}px;font-size:24px;color:${k === 3 ? "var(--ink2)" : "var(--ink)"}">${r[k]}</div>`).join("");
    return `${label}${cells}<div class="hair" style="left:${LX}px;top:${y + RH - 12}px;width:1696px"></div>`;
  }).join("");

  const body = `${field("paper2")}
    <div id="stage" class="stage"><div class="inner">
      ${header("10", "the spec's own table", "THREE VERBS,<br>FIVE QUESTIONS.", "")}

      <!-- the answer column, marked. transform-origin top, so it wipes DOWNWARD. -->
      <div id="f10-col" class="mark" style="left:${cx(1) - 18}px;top:${HY - 14}px;width:${CW + 8}px;height:${RY + 5 * RH - HY - 4}px;transform-origin:50% 0%"></div>

      <div class="rule2" style="left:${LX}px;top:${HY + 48}px;width:1696px;height:3px"></div>
      ${head}
      ${rows}

      <div id="f10-cite" class="tag" style="position:absolute;left:${LX}px;top:${RY + 5 * RH + 18}px;font-size:19px;opacity:0">RFC 10008 §1, TABLE 1 · SUMMARY OF RELEVANT METHOD PROPERTIES</div>
      ${penPath("f10-cir", circ.d, circ.len, 6)}
      ${penPath("f10-gx", gx.d, gx.len, 6)}
    </div></div>`;

  let s = `${enterAcross("#stage")}${headerIn(0.10, false)}\n`;
  COLS.forEach((_, i) => {
    s += `      gsap.set("#f10-h${i}", { autoAlpha: 0 });\n`;
    s += `      tl.fromTo("#f10-h${i}", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.20, ease: "steps(3)" }, ${(0.36 + i * 0.14).toFixed(2)});\n`;
  });
  ROWS.forEach((_, ri) => {
    const t = 0.90 + ri * 0.78;
    s += `      gsap.set(["#f10-r${ri}l","#f10-r${ri}c0","#f10-r${ri}c1","#f10-r${ri}c2"], { autoAlpha: 0 });\n`;
    s += `      tl.to(["#f10-r${ri}l","#f10-r${ri}c0","#f10-r${ri}c1","#f10-r${ri}c2"], { autoAlpha: 1, duration: 0.18, ease: "steps(3)", stagger: 0.09 }, ${t.toFixed(2)});\n`;
  });
  s += `      // the column mark: the same gesture, run down instead of across
      gsap.set("#f10-col", { scaleY: 0, skewX: -0.8 });
      tl.fromTo("#f10-col", { scaleY: 0, skewX: -0.8 }, { scaleY: 1, skewX: -0.8, duration: 0.62, ease: "steps(9)" }, 5.20);
${penIn("f10-cir", circ.len, 6.10, 0.66)}
      // the column that used to be the only option recedes
      tl.to(["#f10-h2","#f10-r0c2","#f10-r1c2","#f10-r2c2","#f10-r3c2","#f10-r4c2"], { autoAlpha: 0.55, duration: 0.50, ease: "power2.out", stagger: 0.05 }, 7.10);
      tl.fromTo("#f10-cite", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.24, ease: "steps(4)" }, 9.10);
      // GET fails on exactly one row, and it is the row this whole film is about
${penIn("f10-gx", gx.len, 8.00, 0.40)}
      tl.to(["#f10-h0","#f10-r0c0","#f10-r1c0","#f10-r2c0","#f10-r3c0","#f10-r4c0"], { autoAlpha: 0.55, duration: 0.50, ease: "power2.out", stagger: 0.05 }, 8.44);
${exitAcross("#stage", len - 0.34)}`;

  return { body, script: s };
}
