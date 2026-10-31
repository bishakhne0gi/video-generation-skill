// Forma · Sanghavi — the design system.
//
// Tokens are read off the RUNNING console (2026-09-09,
// forma-sanghavi-shoes.vercel.app, signed in) rather than off DESIGN.md alone,
// because the doc's frontmatter is stale on one load-bearing point: it names
// Gloock as the display face, and the shipped app renders every headline in
// FIGTREE 600 (`getComputedStyle($('h1')).fontFamily === "Figtree, …"`,
// `document.fonts.check('800 48px Manrope') === false`). The film wears what
// ships. Everything else below — the paper ground, the single #00AEEF signal,
// zero radius, the bevel, the L/W/H axis palette — matches the doc exactly.

export const T = {
  bg:      "#F4F6F8",              // --color-fc-bg  (verified live)
  surface: "#FFFFFF",              // --color-fc-surface
  fill:    "rgba(16,24,40,0.035)", // --color-fc-fill
  fill2:   "rgba(16,24,40,0.07)",  // --color-fc-fill-2
  line:    "rgba(16,24,40,0.12)",  // --color-fc-line  (verified live)
  line2:   "rgba(16,24,40,0.28)",  // --color-fc-line-2
  title:   "#0B0D12",              // headings        (verified live)
  ink:     "#16191D",              // strong body / table values
  body:    "#4B5563",              // body copy       (verified live)
  muted:   "#575F6B",              // labels, captions — DESIGN.md ships #6B7280;
                                   // measured in the render it lands at 4.12:1, just
                                   // under AA, so the film takes it to 5.96:1.
  faint:   "#5C6470",              // metadata — DESIGN.md ships #9AA3AF, which
                                   // measures 2.35:1 on this ground. That is fine on a
                                   // screen you sit at and illegible in a film watched
                                   // across a room, so the film darkens the ramp to
                                   // 5.52:1 and keeps the hue.
  wire:    "#6B7482",              // drawn lines, darkened with the ramp
  accent:  "#00AEEF",              // --color-accent — the Sanghavi brand blue
  accent6: "#0090C8",              // --color-accent-600 — MARKS and borders only
  // The accent as TEXT. #00AEEF measures 2.34:1 and #0090C8 3.33:1 on paper;
  // neither carries small type. DESIGN.md already accepts a darker sibling for
  // the letter of an axis chip while the mark keeps its hue, and this is the
  // same move applied to the one accent.
  accentText: "#00688F",           // 5.74:1 on the ground, 6.22:1 on white
  accentSoft: "#7FD3F7",
  // The axis palette — the ONE categorical exception (DESIGN.md §2). Three
  // hues bound to three measurement axes, validated for CVD separation, and
  // usable nowhere else in the film.
  axL: "#0090C8", axLt: "#0369A1",
  axW: "#D97706", axWt: "#B45309",
  axH: "#DB2777", axHt: "#BE185D",
};

// The bevel — every raised surface (DESIGN.md §5). Both insets are ZERO-BLUR,
// and there is deliberately no outer drop shadow: a blurred box-shadow on an
// element that is being transformed kills the HyperFrames capture outright
// (it took three renders to learn that). A 1px hairline does the separating.
export const BEVEL =
  "inset 0 1px 0 #fff, inset 0 -1px 0 rgba(16,24,40,0.06)";

export const STYLE = `
@font-face{font-family:Figtree;src:url("assets/fonts/Figtree.woff2")format("woff2");font-weight:100 900;font-display:block}
@font-face{font-family:Manrope;src:url("assets/fonts/Manrope.woff2")format("woff2");font-weight:100 900;font-display:block}

*{margin:0;padding:0;box-sizing:border-box}
/* The console is square. Every corner, everywhere — no exceptions. */
*{border-radius:0}
#root{width:1920px;height:1080px;overflow:hidden;background:${T.bg};
  font-family:Manrope,ui-sans-serif,system-ui,sans-serif;color:${T.ink};
  -webkit-font-smoothing:antialiased}

/* ---- grounds -------------------------------------------------------------
   Over-scanned by 18%: a frame whose seam enters from below 1.0 would
   otherwise expose the stage edge. */
.ground{position:absolute;inset:-18%}
.g-paper{background:${T.bg}}
.g-app  {background:${T.bg}}
.g-bloom{background:${T.bg}}

/* The page substrate, straight out of DESIGN.md §4: a 5rem grid at ~6%, a top
   light bleed, and noise. On paper the grid is ink, not white. */
.grid{position:absolute;inset:-18%;
  background-image:linear-gradient(${T.line} 1px,transparent 1px),
                   linear-gradient(90deg,${T.line} 1px,transparent 1px);
  background-size:80px 80px;opacity:0.40}
.bleed{position:absolute;left:-18%;right:-18%;top:-18%;height:520px;
  background:linear-gradient(to bottom,rgba(255,255,255,0.92),rgba(255,255,255,0))}

/* The one atmosphere the light console allows: a soft accent pool, never a
   tint on the ground itself (DESIGN.md §2 — never tint the background). */
.pool{position:absolute;width:1500px;height:1500px;
  background:radial-gradient(circle,rgba(0,174,239,0.055) 0%,rgba(0,174,239,0.022) 42%,transparent 68%)}
.pool-a{top:-560px;right:-380px}
.pool-b{bottom:-620px;left:-300px}
.pool-hot{opacity:1.8}

/* Grain must MOVE. A static tile renders identical noise on all 4,200 frames,
   which reads as dirt on the lens rather than as film. 3x oversized and
   translated by the timeline. */
/* 0.10, not the 0.42 a dark film wants. A multiply grain over PAPER darkens
   the whole ground, and at dark-film strength it turned #F4F6F8 into a grey-blue
   murk — the console stopped looking printed and started looking dirty. This is
   the light-ground cousin of dimming a dark panel with opacity. */
.grain{position:absolute;left:-640px;top:-360px;width:3200px;height:1800px;
  opacity:0.10;pointer-events:none;mix-blend-mode:multiply;
  background-image:url("assets/plates/noise.png");background-repeat:repeat}

/* Paper takes a fraction of the vignette a dark frame does, and it has to stay
   transparent much further out or the corners read as shadow on a white page. */
.vig{position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(ellipse 92% 88% at 50% 46%,transparent 68%,rgba(16,24,40,0.035) 100%)}

/* ---- type ----------------------------------------------------------------
   Figtree 600 at -0.02em is the shipped headline, measured on /login and / .
   Manrope carries everything else. Two families, no third. */
.stage{position:absolute;inset:0}
.inner{position:absolute;inset:0}

.hdr{font-family:Figtree,sans-serif;font-weight:600;font-size:82px;line-height:1.05;
  letter-spacing:-0.02em;color:${T.title}}
.hdr-xl{font-size:124px;line-height:1.02}
.hdr-sm{font-size:56px}
.lead{font-size:26px;line-height:1.55;color:${T.body};max-width:820px}

/* The eyebrow: uppercase Manrope 500 at 0.32em, muted. Every panel carries a
   technical tag — DESIGN.md §10 makes that non-negotiable. */
.tag{font-family:Manrope,sans-serif;font-weight:500;font-size:15px;
  letter-spacing:0.32em;text-transform:uppercase;color:${T.muted}}
.tag-sm{font-size:12px;letter-spacing:0.22em}
.tag-acc{color:${T.accent}}
.num{font-variant-numeric:tabular-nums;letter-spacing:-0.01em}
.rule{height:1px;background:${T.line};transform-origin:left center}

/* ---- surfaces ------------------------------------------------------------
   One white, one hairline, the bevel. Nothing carries a coloured edge:
   colour belongs to the content, never to a container. */
.panel{background:${T.surface};border:1px solid ${T.line};box-shadow:${BEVEL}}
.frame{border:1px solid ${T.line}}
.fill{background:${T.fill}}

/* Corner brackets — four 8px L's inset at a frame's corners, purely
   structural signage (DESIGN.md §5). */
.br{position:absolute;width:10px;height:10px;pointer-events:none}
.br-tl{left:-1px;top:-1px;border-left:1px solid ${T.accent6};border-top:1px solid ${T.accent6}}
.br-tr{right:-1px;top:-1px;border-right:1px solid ${T.accent6};border-top:1px solid ${T.accent6}}
.br-bl{left:-1px;bottom:-1px;border-left:1px solid ${T.accent6};border-bottom:1px solid ${T.accent6}}
.br-br{right:-1px;bottom:-1px;border-right:1px solid ${T.accent6};border-bottom:1px solid ${T.accent6}}

.chip{display:inline-flex;align-items:center;gap:10px;padding:11px 18px;
  border:1px solid ${T.line};box-shadow:${BEVEL};background:${T.surface};
  font-size:19px;color:${T.body};white-space:nowrap}
.chip-on{border-color:rgba(0,174,239,0.55);background:rgba(0,174,239,0.07);color:${T.accentText}}
.chip-sm{padding:7px 12px;font-size:15px}

/* The match badge. The console really does fill this one with the accent —
   verified on screen — so the film does too, and nothing else is filled. */
.badge{display:inline-block;padding:7px 13px;background:${T.accent};color:#fff;
  font-size:17px;font-weight:600}

/* The axis chip: a tinted mark carrying identity, the value in ink. */
.ax{display:inline-flex;align-items:center;gap:9px;padding:7px 13px;font-size:19px;
  border:1px solid;font-variant-numeric:tabular-nums}
.ax b{font-weight:700;font-size:15px}

/* The primary CTA is INK, never the accent (DESIGN.md §2). */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:16px;
  padding:14px 28px;background:linear-gradient(to bottom,#2b3138,#16191d);color:#fff;
  font-size:16px;font-weight:500;letter-spacing:0.06em;text-transform:uppercase}

/* The oversized macOS cursor. It is the film's only actor, so it is well over
   life size — at 1:1 a pointer is invisible at this distance. */
.cursor{position:absolute;width:54px;height:54px;pointer-events:none;z-index:90}
`;

// Every frame is cloned into the root document, so asset URLs are HOST-relative.
// `transparent` is for compositions mounted on a track ABOVE the film: an opaque
// #root there paints over every scene below it and no gate reports it.
export const wrap = (id, body, script, transparent = false) => `<template>
  <style>${STYLE}${transparent ? "\n#root{background:transparent}" : ""}</style>
  <div id="root" data-composition-id="${id}" data-start="0" data-width="1920" data-height="1080">
${body}
  </div>
  <script src="assets/vendor/gsap.min.js"></script>
  <script>
    (function(){
      const tl = gsap.timeline({ paused: true });
${script}
      window.__timelines = window.__timelines || {};
      window.__timelines[${JSON.stringify(id)}] = tl;
    })();
  </script>
</template>`;

// `len` lets the plate declare its own clip window. data-start is LOCAL to the
// frame — the assembler applies the global offset, and writing the global start
// here would add it twice and render the frame blank with every gate passing.
export const field = (kind, id = "f") => {
  const hot = kind === "bloom";
  return `    <div class="ground g-${kind}"></div>
    <div class="grid"></div>
    <div class="bleed"></div>
    <div class="pool pool-a${hot ? " pool-hot" : ""}"></div>
    <div class="pool pool-b${hot ? " pool-hot" : ""}"></div>
    <div id="${id}-grain" class="grain"></div>
    <div class="vig"></div>`;
};

// Grain drift — slow, restarted per frame so it never sits still.
export const grainDrift = (id, len) =>
  `      tl.fromTo("#${id}-grain", { x: 0, y: 0 },
        { x: -132, y: -74, duration: ${Math.max(len, 4).toFixed(2)}, ease: "none" }, 0);`;

export const cursorSVG = `<svg viewBox="0 0 24 24" width="54" height="54" xmlns="http://www.w3.org/2000/svg">
  <path d="M5.5 2.2 L5.5 19.4 L9.8 15.4 L12.6 21.6 L15.8 20.2 L13.0 14.1 L18.8 14.1 Z"
    fill="#fff" stroke="#0B0D12" stroke-width="1.15" stroke-linejoin="round"/></svg>`;

export const brackets = () =>
  `<i class="br br-tl"></i><i class="br br-tr"></i><i class="br br-bl"></i><i class="br br-br"></i>`;

// ---- readouts -------------------------------------------------------------
// A number that changes cannot be tweened: tl.set({text}) is a no-op in this
// runtime (no TextPlugin) and tl.call is not reliably seekable. So every state
// is its own span, stacked in one fixed-size slot, toggled with a zero-duration
// set on autoAlpha. Seek-safe, deterministic, survives scrubbing.
export const counter = (id, values, cls = "num") => {
  // The box must be as wide as the WIDEST value, not the first one.
  const widest = values.reduce((a, b) => (String(b).length > String(a).length ? b : a), values[0]);
  return `<span id="${id}" style="position:relative;display:inline-block;font-variant-numeric:tabular-nums">
      <span class="${cls}" aria-hidden="true" style="visibility:hidden;white-space:pre">${widest}</span>
${values.map((v, i) => `      <span class="${cls}" data-k="${i}" style="position:absolute;left:0;right:0;top:0;text-align:inherit;white-space:pre;opacity:${i ? 0 : 1}">${v}</span>`).join("\n")}
    </span>`;
};

export const counterRun = (id, n, at, span) => {
  const step = span / Math.max(n - 1, 1);
  let out = "";
  for (let i = 1; i < n; i++) {
    out += `      tl.set("#${id} [data-k='${i - 1}']", { autoAlpha: 0 }, ${(at + i * step).toFixed(3)});\n`;
    out += `      tl.set("#${id} [data-k='${i}']", { autoAlpha: 1 }, ${(at + i * step).toFixed(3)});\n`;
  }
  return out;
};

// ---- the seam carrier -----------------------------------------------------
// The tag and the headline sit at FULL opacity from frame zero and ride the
// stage in on the cut. Fading them up makes the frame render essentially blank
// at the boundary — the motion gate passes, and the film still enters empty.
// Only the lead line is allowed to fade.
export const head = (tag, hdr, lead, opt = {}) => {
  const x = opt.x ?? 128, y = opt.y ?? 112;
  const size = opt.size ?? 82;
  const lines = String(hdr).split(/<br\s*\/?>/i).length;
  const leadTop = y + 58 + lines * Math.round(size * 1.05) + 30;
  return `      <div class="tag" id="s-tag" style="position:absolute;left:${x}px;top:${y}px">${tag}</div>
      <div class="rule" id="s-rule" style="position:absolute;left:${x}px;top:${y + 30}px;width:${opt.rule ?? 230}px"></div>
      <div class="hdr" id="s-hdr" style="position:absolute;left:${x}px;top:${y + 58}px;font-size:${size}px${opt.hw ? `;max-width:${opt.hw}px` : ""}">${hdr}</div>
      <div class="lead" id="s-lead" style="position:absolute;left:${x}px;top:${leadTop}px${opt.lw ? `;max-width:${opt.lw}px` : ""}${lead ? "" : ";display:none"}">${lead ?? ""}</div>`;
};

// Everything is ease-out. No springs, no bounces, no overshoot — DESIGN.md §6
// says so about the product, and the film obeys the product's own motion rule.
export const headIn = (t = 0.10) => `
      tl.fromTo("#s-rule", { scaleX: 0 }, { scaleX: 1, duration: 0.52, ease: "power3.out" }, ${(t + 0.04).toFixed(2)});
      tl.fromTo("#s-hdr",  { y: 16 }, { y: 0, duration: 0.56, ease: "power3.out" }, 0);
      tl.fromTo("#s-lead", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.56, ease: "power3.out" }, ${(t + 0.22).toFixed(2)});`;

// Nothing lands as a group: 3-6 frames between siblings at 30fps.
export const stagger = (sel, at, n, from = { autoAlpha: 0, y: 20 }, step = 0.12, dur = 0.48) =>
  Array.from({ length: n }, (_, i) =>
    `      tl.fromTo("${sel}${i}", ${JSON.stringify(from)}, { autoAlpha: 1, y: 0, x: 0, scale: 1, duration: ${dur}, ease: "power3.out" }, ${(at + i * step).toFixed(3)});`
  ).join("\n");

// Cursor: enters from off-frame (never fades in — a pointer that materialises
// has no author), travels to the target, and taps.
export const cursorTo = (pts, at) => {
  let out = `      tl.set("#cur", { x: ${pts[0][0]}, y: ${pts[0][1]} }, 0);\n`;
  let t = at;
  for (let i = 1; i < pts.length; i++) {
    const [x, y, d = 0.60] = pts[i];
    out += `      tl.to("#cur", { x: ${x}, y: ${y}, duration: ${d}, ease: "power2.inOut", overwrite: "auto" }, ${t.toFixed(3)});\n`;
    t += d;
  }
  return out;
};
export const cursorTap = (at) =>
  `      tl.to("#cur", { scale: 0.84, duration: 0.08, ease: "power2.in" }, ${at.toFixed(3)});
      tl.to("#cur", { scale: 1, duration: 0.20, ease: "power3.out" }, ${(at + 0.08).toFixed(3)});`;

// ---- type-on ---------------------------------------------------------------
// Characters are revealed with zero-duration sets rather than by rewriting text
// (tl.set({text}) is a no-op here — no TextPlugin — and tl.call is not seekable).
// Every glyph holds its layout slot from frame zero, so nothing reflows.
//
// The caret is NOT positioned by measurement. Manrope is proportional, so an
// arithmetic advance drifts visibly by the end of a sentence — and measuring
// real glyph boxes at script time is worse, because it silently measures the
// FALLBACK face whenever the webfont has not landed yet, and nothing errors.
// Instead one zero-width caret is parked in the flow after every character and
// the right one is switched on: the browser's own layout does the positioning,
// so it is exact in any face and immune to load order.
export const typeLine = (id, text, size, opt = {}) => {
  const chars = [...text];
  const caret = (i) => `<span data-r="${i}" style="display:inline-block;width:0;overflow:visible;opacity:0;vertical-align:baseline"><span style="display:inline-block;width:2px;height:${(size * 1.02).toFixed(0)}px;background:${opt.caret ?? T.accent};transform:translateY(${(size * 0.16).toFixed(0)}px)"></span></span>`;
  return `<div id="${id}" style="position:relative;display:inline-block;
      font-size:${size}px;line-height:1.2;white-space:nowrap;color:${opt.color ?? T.ink}">${caret(0)}` +
    chars.map((c, i) =>
      `<span data-c="${i}" style="opacity:0">${c === " " ? "&nbsp;" : c === "<" ? "&lt;" : c === "&" ? "&amp;" : c}</span>${caret(i + 1)}`
    ).join("") + `</div>`;
};

export const typeRun = (id, text, at, cps = 26) => {
  const n = [...text].length;
  const step = 1 / cps;
  let out = `      tl.set("#${id} [data-r='0']", { autoAlpha: 1 }, ${at.toFixed(3)});\n`;
  for (let i = 0; i < n; i++) {
    const t = at + i * step;
    out += `      tl.set("#${id} [data-c='${i}']", { autoAlpha: 1 }, ${t.toFixed(3)});\n`;
    out += `      tl.set("#${id} [data-r='${i}']", { autoAlpha: 0 }, ${t.toFixed(3)});\n`;
    out += `      tl.set("#${id} [data-r='${i + 1}']", { autoAlpha: 1 }, ${t.toFixed(3)});\n`;
  }
  // the caret blinks twice and goes, the way a real one does
  const end = at + n * step;
  for (let b = 0; b < 4; b++)
    out += `      tl.set("#${id} [data-r='${n}']", { autoAlpha: ${b % 2 ? 1 : 0} }, ${(end + 0.18 + b * 0.30).toFixed(3)});\n`;
  out += `      tl.set("#${id} [data-r='${n}']", { autoAlpha: 0 }, ${(end + 1.5).toFixed(3)});\n`;
  return out;
};

// ---- a progressive reveal --------------------------------------------------
// Built from nothing but y-translation, because this runtime animates neither
// `height` nor `stroke-dashoffset` and ships no DrawSVG plugin. An outer clip
// window starts translated fully above the content; the inner content
// counter-translates by exactly the opposite amount, so the content never
// appears to move while the window grows down over it.
export const wipe = (id, w, h, content) => `
      <div id="${id}" style="position:absolute;left:0;top:0;width:${w}px;height:${h}px;overflow:hidden">
        <div id="${id}-in" style="position:absolute;left:0;top:0;width:${w}px;height:${h}px">${content}</div>
      </div>
      <div id="${id}-scan" style="position:absolute;left:0;top:0;width:${w}px;height:2px;
           background:${T.accent};opacity:0"></div>`;

export const wipeRun = (id, h, at, dur = 0.9, ease = "power2.inOut") => `
      tl.set("#${id}", { y: -${h} }, 0);
      tl.set("#${id}-in", { y: ${h} }, 0);
      tl.to("#${id}", { y: 0, duration: ${dur}, ease: "${ease}" }, ${at.toFixed(3)});
      tl.to("#${id}-in", { y: 0, duration: ${dur}, ease: "${ease}" }, ${at.toFixed(3)});
      tl.set("#${id}-scan", { autoAlpha: 1, y: 0 }, ${at.toFixed(3)});
      tl.to("#${id}-scan", { y: ${h}, duration: ${dur}, ease: "${ease}" }, ${at.toFixed(3)});
      tl.set("#${id}-scan", { autoAlpha: 0 }, ${(at + dur).toFixed(3)});`;
