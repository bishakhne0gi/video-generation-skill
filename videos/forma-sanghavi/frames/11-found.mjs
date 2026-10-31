import { field, grainDrift, brackets, T } from "../lib/frame.mjs";
import { axis, girth } from "../lib/ui.mjs";
import { enterOf, exitOf } from "../lib/seams.mjs";
import { LEN as SCHED } from "../schedule.mjs";
export const LEN = SCHED[10];

// The film's proof. The uploaded file is named for model 525512275; the row
// Forma returned first is model 525512275. Nothing in the request said so —
// the request was a bare mesh. So the frame does one thing: hold the two
// strings above each other and light the nine digits they share.
//
// The rest of the ranked set is on screen underneath at its real numbers,
// because a single row would be a claim and a ladder is evidence: note that
// row 5 carries a HIGHER percentage than rows 2-4 and still ranks last. The
// badge is a similarity display; `base fit` is the ranking. Showing both is
// the honest way to show either.
const DIGITS = "525512275";
const REST = [
  { c: "TZ-525512550-42", b: "TEMPE ZARA",  p: "98.7% match", f: "base fit 0.74" },
  { c: "525511600-8.5-wo", b: "N.M.ZACKARIAH LLP", p: "98.7% match", f: "base fit 0.76" },
  { c: "525511600-9.5-wo", b: "N.M.ZACKARIAH LLP", p: "97.5% match", f: "base fit 0.81" },
  { c: "CH-526512145-42", b: "COLE HAAN",   p: "99.2% match", f: "base fit 0.82" },
];

const lit = (pre, post) =>
  `<span style="color:${T.faint}">${pre}</span>` +
  DIGITS.split("").map((d, i) => `<span data-d="${i}" style="color:${T.faint}">${d}</span>`).join("") +
  `<span style="color:${T.faint}">${post}</span>`;

export const body = `${field("app", "found")}
    <div id="stg10" class="stage"><div class="inner">
      <div class="tag" id="k1" style="position:absolute;left:128px;top:112px">WHAT CAME BACK</div>
      <div class="rule" id="k2" style="position:absolute;left:128px;top:142px;width:230px"></div>

      <div class="num" id="up" style="position:absolute;left:128px;top:214px;font-size:62px;letter-spacing:-0.01em">
        <span class="tag tag-sm" style="display:block;margin-bottom:16px">I UPLOADED</span>
        <span id="upd">${lit("", "-42-WO.stl")}</span>
      </div>

      <div id="arrow" style="position:absolute;left:128px;top:352px;width:3px;height:96px;
           background:${T.accent};transform-origin:top center"></div>

      <div class="num" id="dn" style="position:absolute;left:128px;top:472px;font-size:62px;letter-spacing:-0.01em">
        <span class="tag tag-sm" style="display:block;margin-bottom:16px;color:${T.accentText}">FORMA RANKED FIRST</span>
        <span id="dnd">${lit("ZT-", "-42")}</span>
      </div>

      <div id="hero" style="position:absolute;left:128px;top:626px;width:1000px;
           background:${T.surface};border:1px solid rgba(0,174,239,0.55);padding:34px 40px">
${brackets()}
        <div style="display:flex;align-items:center">
          <span style="font-size:34px;font-weight:600;color:${T.title}">ZT-525512275-42</span>
          <span class="chip chip-sm" style="margin-left:18px;font-size:14px">TEMPE ZARA</span>
          <span class="badge" style="margin-left:auto">99.2% match</span>
        </div>
        <div style="display:flex;align-items:center;margin-top:22px">
          <div style="display:flex;gap:11px">${axis("L", "291.6")}${axis("W", "94.4")}${axis("H", "101.1")}${girth("255")}</div>
          <span class="num" style="margin-left:auto;font-size:24px;color:${T.accentText}">base fit 0.41</span>
        </div>
      </div>

      <div style="position:absolute;left:1200px;top:214px;width:592px">
        <div class="tag tag-sm" id="rl">AND THE REST OF THE LADDER</div>
        <div style="height:1px;background:${T.line};margin:20px 0 8px"></div>
${REST.map((r, i) => `        <div id="rq${i}" style="display:flex;align-items:center;padding:26px 0;border-bottom:1px solid ${T.line}">
          <div>
            <div style="font-size:24px;color:${T.ink}">${r.c}</div>
            <div style="margin-top:7px;font-size:16px;color:${T.faint}">${r.b}</div>
          </div>
          <div style="margin-left:auto;text-align:right">
            <div class="num" style="font-size:20px;color:${T.muted}">${r.p}</div>
            <div class="num" style="margin-top:7px;font-size:20px;color:${T.accentText}">${r.f}</div>
          </div>
        </div>`).join("\n")}
        <div id="note" style="margin-top:26px;font-size:19px;color:${T.muted}">
          The last row scores the highest percentage in the set and still ranks fifth.
          The badge is a similarity display. <span style="color:${T.accentText}">Base fit is the ranking.</span></div>
      </div>
    </div></div>`;

// The nine shared digits light in pairs, top and bottom together — the only
// way to say "these are the same number" without saying it.
const LIGHT = (t) => DIGITS.split("").map((_, i) =>
  `      tl.to("#upd [data-d='${i}']", { color: "${T.title}", duration: 0.18, ease: "power2.out" }, ${(t + i * 0.085).toFixed(3)});
      tl.to("#dnd [data-d='${i}']", { color: "${T.accent6}", duration: 0.18, ease: "power2.out" }, ${(t + i * 0.085).toFixed(3)});`).join("\n");

export const script = `${enterOf(10)}
${grainDrift("found", LEN)}
      tl.fromTo("#k1", { y: 12 }, { y: 0, duration: 0.50, ease: "power3.out" }, 0);
      tl.fromTo("#k2", { scaleX: 0 }, { scaleX: 1, duration: 0.50, ease: "power3.out" }, 0.06);
      tl.fromTo("#up", { y: 18 }, { y: 0, duration: 0.56, ease: "power3.out" }, 0.02);
      tl.fromTo("#arrow", { scaleY: 0 }, { scaleY: 1, duration: 0.50, ease: "power3.out" }, 1.55);
      tl.fromTo("#dn", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.56, ease: "power3.out" }, 2.00);

      // the nine digits, lit in step — the whole argument in one gesture
${LIGHT(3.60)}

      tl.fromTo("#hero", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.58, ease: "power3.out" }, 5.10);

      tl.fromTo("#rl", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.44, ease: "power2.out" }, 6.00);
${REST.map((_, i) => `      tl.fromTo("#rq${i}", { autoAlpha: 0, x: 30 }, { autoAlpha: 1, x: 0, duration: 0.46, ease: "power3.out" }, ${(6.16 + i * 0.30).toFixed(2)});`).join("\n")}
      tl.fromTo("#note", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.50, ease: "power3.out" }, 7.65);

${exitOf(10, LEN)}`;
