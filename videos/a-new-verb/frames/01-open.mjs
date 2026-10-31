// EP27 · 01 OPEN — the URL that will not fit.
// Cold open on the artifact, never on a slide. One printed request, typing itself, and
// the only thing that happens is that it does not stop. The byte figure is REAL: it is
// the measured length of the string this file generates, so the narration's "just passed
// eight thousand bytes" is arithmetic rather than a claim.
import { field, exitAcross, penPath, penIn, underlineD, marker, markerIn, readout, readoutIn, tilt } from "../lib/frame.mjs";

const BASE = "https://api.shop.example/products?sort=-rating,price&fields=id,name,price,stock";
const B32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";           // Crockford, as ULIDs use
const ID = (i) => { let s = ""; for (let k = 0; k < 16; k++) s += B32[(Math.abs(Math.sin((i * 16 + k) * 12.9898 + 4.1) * 65536) | 0) % 32]; return s; };
const IDS = Array.from({ length: 400 }, (_, i) => ID(i));
const FULL = BASE + IDS.map((h) => `&id=${h}`).join("");
const BYTES = FULL.length;                                  // 8,079

// wrap to the sheet's real measure: JetBrains Mono advances 0.6em, 24px in a 1060px well
const COLS = 72, ROWS = 14;
const LINES = [];
for (let r = 0; r < ROWS; r++) LINES.push(FULL.slice(r * COLS, (r + 1) * COLS));
const SHOWN = ROWS * COLS;
const IDS_SHOWN = Math.floor((SHOWN - BASE.length) / 20);
const IDS_LEFT = 400 - IDS_SHOWN;

// the counter is PRINTED digits, so it changes by stacking spans, never by tweening text
const STEPS = [0, 79, 419, 1099, 1899, 2779, 3699, 4599, 5399, 6099, 6699, 7199, 7599, 7899, 8079];
const COUNTS = STEPS.map((n) => n.toLocaleString("en-US"));

export function build({ len }) {
  const esc = (c) => c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === " " ? "&nbsp;" : c;
  const rows = LINES.map((L, r) =>
    `<div class="f1row" style="height:34px">${L.split("").map((c) => `<span class="g">${esc(c)}</span>`).join("")}</div>`).join("");

  const under = underlineD(150, 902, 940, 4);
  const brk   = { d: "M1786,236 L1826,236 M1826,236 L1826,392 M1826,392 L1786,392", len: 260 };

  const body = `${field("paper")}
    <div id="stage" class="stage"><div class="inner">

      <div class="tag" style="position:absolute;left:118px;top:88px">EP 27 · A NEW VERB</div>

      <!-- the request, printed on a sheet -->
      <div class="sheet" style="left:112px;top:150px;width:1140px;height:614px;transform:rotate(${tilt(2)}deg)"></div>
      <div style="position:absolute;left:112px;top:150px;width:1140px;height:614px;overflow:hidden;transform:rotate(${tilt(2)}deg)">
        <div class="tag" style="position:absolute;left:38px;top:28px;font-size:17px">GET · REQUEST TARGET</div>
        <div class="hair" style="left:38px;top:64px;width:1064px"></div>
        <div id="f1-flow" class="mono" style="position:absolute;left:38px;top:84px;width:1070px;font-size:24px;line-height:34px;white-space:pre">${rows}</div>
        <div id="f1-more" class="mono" style="position:absolute;left:38px;top:${84 + ROWS * 34 + 10}px;font-size:22px;color:var(--ink2);opacity:0">… and ${IDS_LEFT} more ids</div>
      </div>

      <!-- the figure. It is not a limit; it is the floor below which you are promised nothing. -->
      <div class="tag" style="position:absolute;left:1330px;top:196px;font-size:18px">LENGTH</div>
      <div style="position:absolute;left:1330px;top:222px;width:460px;height:110px">
        ${readout("f1-n", COUNTS.map((c) => `<span class="hdr" style="font-size:96px">${c}</span>`), "font-size:96px")}
      </div>
      <div id="f1-unit" class="tag" style="position:absolute;left:1332px;top:344px;font-size:20px">BYTES</div>
      <div class="hair" style="left:1330px;top:404px;width:462px"></div>
      <div id="f1-note" class="deck" style="position:absolute;left:1330px;top:428px;width:462px;font-size:27px;opacity:0">400 product ids. One sort. One field list.</div>

      <!-- the mark -->
      <div style="position:absolute;left:150px;top:832px;width:1160px">
        ${marker("f1-mk", -8, 8, 990, 56)}
        <div class="phrase quote" style="position:relative;font-size:54px">at least <span class="mono" style="font-size:46px">8000</span> octets — RFC 9110 §4.1</div>
        <div id="f1-sub" class="deck" style="position:absolute;left:2px;top:96px;width:1120px;font-size:29px;opacity:0">A floor, not a ceiling. Past it, no intermediary owes you anything.</div>
      </div>

      ${penPath("f1-u", under.d, under.len, 5)}
      ${penPath("f1-b", brk.d, brk.len, 5)}
    </div></div>`;

  // Line one is typed at reading speed; everything after it accelerates hard. The
  // acceleration IS the argument, and it is 1,000 glyphs appearing across a 1060px
  // well — motion the pacing audit can actually see.
  const HEAD_N = COLS, TAIL_N = SHOWN - COLS, T0 = 0.45;
  const T1 = T0 + HEAD_N / 64;
  const script = `
      // the reveal lives in the TO vars: a from-only autoAlpha encodes as invisible on
      // cold render workers even though sequential snapshots look correct.
      gsap.set(".g", { autoAlpha: 0 });
      tl.to(".g:nth-child(-n+${HEAD_N})", { autoAlpha: 1, duration: 0.01, ease: "none", stagger: ${(1 / 64).toFixed(4)} }, ${T0});
      tl.to(".f1row:not(:first-child) .g", { autoAlpha: 1, duration: 0.01, ease: "none", stagger: ${(3.30 / TAIL_N).toFixed(5)} }, ${T1.toFixed(2)});
      tl.fromTo("#f1-more", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.26, ease: "steps(4)" }, ${(T1 + 3.35).toFixed(2)});
${readoutIn("f1-n", COUNTS.length, 0.62, 0.44)}
      // the figure goes red as it leaves the floor the spec guarantees everyone
      tl.to("#f1-n-${COUNTS.length - 1}", { color: "#B32414", duration: 0.01 }, ${(0.62 + (COUNTS.length - 2) * 0.44).toFixed(2)});
      tl.to("#f1-unit", { color: "#B32414", duration: 0.28, ease: "power2.out" }, ${(0.62 + (COUNTS.length - 2) * 0.44).toFixed(2)});
${penIn("f1-b", brk.len, 6.35, 0.46)}
      tl.fromTo("#f1-note", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.40, ease: "power3.out" }, 6.70);
${markerIn("f1-mk", 7.30, 0.46)}
${penIn("f1-u", under.len, 7.95, 0.58)}
      tl.fromTo("#f1-sub", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.44, ease: "power3.out" }, 8.60);
${exitAcross("#stage", len - 0.34)}`;

  return { body, script };
}
