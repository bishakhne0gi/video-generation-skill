// AI Watermark Remover — launch film design system.
//
// Every token below was measured off the live product at watermarkairemover.com
// (computed styles, not eyeballed). The film wears the brand; it does not invent
// a look for it. The two signatures worth naming, because they are what make a
// frame recognisable as this product:
//
//   1. radius is 2px, everywhere. Not 8, not 12. Sharp corners are the brand.
//   2. the headline highlight — a solid indigo marker band sitting BEHIND the
//      display type, straight off the hero. It is the only place a big field of
//      accent is allowed.

export const T = {
  // the product's light surface
  paper:  "#FFFFFF",
  surround:"#E3EAF3",   // the editor's canvas surround
  line:   "#E3EAF3",    // 1px borders
  rail:   "#CBD5E2",    // dashed dropzone rail
  ink:    "#0C1927",    // --text-primary
  dim:    "rgba(12,25,39,0.70)",
  faint:  "rgba(12,25,39,0.62)",   // 0.50 measured 3.4:1 on white and failed AA

  // the dark surfaces the story starts on (Gemini, then X)
  deep:   "#0B0F16",
  panel:  "#12171F",
  card:   "#161C26",
  wire:   "rgba(255,255,255,0.09)",
  hair:   "rgba(255,255,255,0.05)",
  snow:   "#FFFFFF",
  ash:    "rgba(255,255,255,0.62)",
  mute:   "rgba(255,255,255,0.46)",

  // the accent. One hue, and it belongs to the CONTENT — never to a container edge.
  accent: "#4940FF",    // filled buttons, active tool, the marker band
  accentT:"#3A32E0",    // accent as TEXT on a tint
  tint:   "rgba(73,64,255,0.08)",
  lit:    "#8B84FF",    // accent lifted for legibility on the dark grounds

  // the one warning hue — the CR badge and the AI flag. Used twice, then never again.
  flag:   "#E8B339",
};

export const STYLE = `
@font-face{font-family:Archivo;src:url("assets/fonts/Archivo.woff2")format("woff2");font-weight:100 900;font-display:block}
@font-face{font-family:InterV;src:url("assets/fonts/Inter.woff2")format("woff2");font-weight:100 900;font-display:block}
@font-face{font-family:JBMono;src:url("assets/fonts/JetBrainsMono.woff2")format("woff2");font-weight:100 900;font-display:block}

*{margin:0;padding:0;box-sizing:border-box}
#root{width:1920px;height:1080px;overflow:hidden;background:${T.deep};
  font-family:InterV,-apple-system,sans-serif;color:${T.ink};
  -webkit-font-smoothing:antialiased;text-rendering:geometricPrecision}

/* ---- grounds -------------------------------------------------------------
   Over-scanned by 18% so a seam entering from off-frame never exposes the
   stage edge. */
.ground{position:absolute;inset:-18%}
.g-dark {background:${T.deep}}
.g-paper{background:${T.paper}}
.g-brand{background:${T.accent}}

/* The atmosphere. On dark it is one soft indigo bloom off the upper right —
   the product's own accent, at an alpha you should never quite notice. */
.bloom{position:absolute;border-radius:50%;filter:blur(12px);pointer-events:none}
.bloom-a{width:1500px;height:1500px;top:-460px;right:-320px;
  background:radial-gradient(circle,rgba(73,64,255,0.20) 0%,rgba(73,64,255,0.08) 46%,transparent 70%)}
.bloom-b{width:1020px;height:1020px;bottom:-260px;left:-180px;
  background:radial-gradient(circle,rgba(73,64,255,0.11) 0%,rgba(73,64,255,0.04) 46%,transparent 70%)}
/* on the white act the bloom inverts to a cool paper tint, or the frame glares */
.bloom-p{background:radial-gradient(circle,rgba(73,64,255,0.055) 0%,rgba(73,64,255,0.02) 46%,transparent 70%)}

/* Grain must MOVE. A static tile renders identical noise on every frame, which
   reads as dirt on the lens rather than as film. 3x oversized, translated by
   the timeline. */
.grain{position:absolute;left:-640px;top:-360px;width:3200px;height:1800px;
  pointer-events:none;background-image:url("assets/plates/noise.png");background-repeat:repeat}
.grain-d{opacity:0.052;mix-blend-mode:overlay}
.grain-l{opacity:0.030;mix-blend-mode:multiply}

.vig{position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(ellipse 80% 72% at 50% 46%,transparent 42%,rgba(0,0,0,0.50) 100%)}
.vig-l{background:radial-gradient(ellipse 82% 74% at 50% 46%,transparent 46%,rgba(12,25,39,0.10) 100%)}

/* ---- type ----------------------------------------------------------------
   Archivo 700 at -0.03em is the product's own display setting, measured off
   the hero h1. Inter carries every piece of UI. JetBrains Mono carries every
   number, id, filename and dimension — the register the audience trusts. */
.stage{position:absolute;inset:0}
.inner{position:absolute;inset:0}

.hdr{font-family:Archivo,sans-serif;font-weight:700;font-size:92px;line-height:1.04;
  letter-spacing:-0.03em;color:${T.ink}}
.hdr-xl{font-size:132px;line-height:1.0}
.hdr-on{color:${T.snow}}
.lead{font-size:27px;line-height:1.5;color:${T.dim};letter-spacing:-0.006em;max-width:820px}
.lead-on{color:${T.ash}}

/* The brand's marker band. A solid accent rectangle behind the glyphs, with the
   type sitting on top — this is the hero's own move and the film's title card
   is built on it. Skewless, sharp-cornered, and it wipes in from the left. */
.mark{position:relative;display:inline-block;padding:0.02em 0.10em 0.10em}
.mark-bg{position:absolute;left:0;top:0.08em;right:0;bottom:0.10em;background:${T.accent};
  transform-origin:left center}
.mark-tx{position:relative}

.tag{font-family:JBMono,monospace;font-size:15px;letter-spacing:0.20em;
  text-transform:uppercase;color:${T.faint}}
.tag-on{color:${T.mute}}
.tag-ac{color:${T.accentT}}
.mono{font-family:JBMono,monospace;font-variant-numeric:tabular-nums;letter-spacing:-0.005em}
.rule{height:1px;background:${T.line};transform-origin:left center}
.rule-on{background:${T.wire}}

/* ---- product surfaces ----------------------------------------------------
   One ground and a 1px hairline for every panel in the film. Nothing carries a
   coloured edge: colour belongs to the content, never to a container. Radius is
   2px because that is what the product does. */
.win{background:${T.paper};border:1px solid ${T.line};border-radius:2px;overflow:hidden}
.win-d{background:${T.panel};border:1px solid ${T.wire};border-radius:2px;overflow:hidden}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:9px;height:44px;padding:0 14px;
  border-radius:2px;border:1px solid ${T.line};background:${T.paper};color:${T.ink};
  font-family:InterV,sans-serif;font-size:14px;font-weight:500;white-space:nowrap}
.btn-on{background:${T.accent};border-color:${T.accent};color:#fff}
.btn-off{color:${T.faint};background:${T.paper}}
.btn-lg{height:52px;padding:0 20px;font-size:16px}
.chip{display:inline-flex;align-items:center;gap:8px;height:34px;padding:0 12px;border-radius:2px;
  border:1px solid ${T.line};background:${T.paper};font-size:13px;font-weight:500;color:${T.dim}}
.chip-d{border-color:${T.wire};background:rgba(255,255,255,0.04);color:${T.ash}}

/* The oversized macOS pointer. It is the film's only actor, so it runs 2.3x
   life size — at 1:1 a cursor is invisible at this viewing distance. */
.cursor{position:absolute;width:54px;height:54px;pointer-events:none;z-index:95;
  filter:drop-shadow(0 3px 8px rgba(0,0,0,0.45))}
`;

// Every frame is cloned into the root document, so asset URLs are HOST-relative.
export const wrap = (id, body, script) => `<template>
  <style>${STYLE}</style>
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

// The three grounds. `id` keeps the grain element unique across the assembled page.
export const field = (kind, id = "f") => {
  const light = kind === "paper" || kind === "brand";
  return `    <div class="ground g-${kind}" data-layout-allow-overflow></div>
    <div class="bloom bloom-a${light ? " bloom-p" : ""}" data-layout-allow-overflow></div>
    <div class="bloom bloom-b${light ? " bloom-p" : ""}" data-layout-allow-overflow></div>
    <div id="${id}-grain" class="grain ${light ? "grain-l" : "grain-d"}" data-layout-allow-overflow></div>
    <div class="vig${light ? " vig-l" : ""}"></div>`;
};

// One tile crossed slowly, restarted per frame so the grain never sits still.
export const grainDrift = (id, len) =>
  `      tl.fromTo("#${id}-grain", { x: 0, y: 0 },
        { x: -128, y: -74, duration: ${Math.max(len, 4).toFixed(2)}, ease: "none" }, 0);`;

export const cursorSVG = `<svg viewBox="0 0 24 24" width="54" height="54" xmlns="http://www.w3.org/2000/svg">
  <path d="M5.5 2.2 L5.5 19.4 L9.8 15.4 L12.6 21.6 L15.8 20.2 L13.0 14.1 L18.8 14.1 Z"
    fill="#fff" stroke="#0b0b0b" stroke-width="1.05" stroke-linejoin="round"/></svg>`;

// Cursor: enters from off-frame (a pointer that fades up has no author),
// travels to its target, and taps. Every move it makes causes something.
export const cursorTo = (pts, at) => {
  let out = `      tl.set("#cur", { x: ${pts[0][0]}, y: ${pts[0][1]} }, 0);\n`;
  let t = at;
  for (let i = 1; i < pts.length; i++) {
    const [x, y, d = 0.62] = pts[i];
    out += `      tl.to("#cur", { x: ${x}, y: ${y}, duration: ${d}, ease: "power2.inOut" }, ${t.toFixed(3)});\n`;
    t += d;
  }
  return out;
};
export const cursorMove = (pts, at) => cursorTo(pts, at).split("\n").slice(1).join("\n");
export const cursorTap = (at) =>
  `      tl.to("#cur", { scale: 0.80, duration: 0.07, ease: "power2.in" }, ${at.toFixed(3)});
      tl.to("#cur", { scale: 1, duration: 0.18, ease: "back.out(2.8)" }, ${(at + 0.07).toFixed(3)});`;

// Nothing lands as a group: 3-6 frames between siblings at 30fps.
export const stagger = (sel, at, n, from = { autoAlpha: 0, y: 20 }, step = 0.085, dur = 0.46) =>
  Array.from({ length: n }, (_, i) =>
    `      tl.fromTo("${sel}${i}", ${JSON.stringify(from)}, { autoAlpha: 1, y: 0, x: 0, scale: 1, duration: ${dur}, ease: "power3.out" }, ${(at + i * step).toFixed(3)});`
  ).join("\n");

// ---- the marker band ------------------------------------------------------
// The hero's own move: the band wipes in from the left, THEN the type appears
// over it, so the reveal reads as a highlighter drawn across the line.
export const mark = (id, text) =>
  `<span class="mark"><span id="${id}-bg" class="mark-bg"></span><span id="${id}-tx" class="mark-tx">${text}</span></span>`;

export const markRun = (id, at, dur = 0.52) =>
  `      tl.fromTo("#${id}-bg", { scaleX: 0 }, { scaleX: 1, duration: ${dur}, ease: "power3.out" }, ${at.toFixed(3)});
      tl.fromTo("#${id}-tx", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.20, ease: "none" }, ${(at + dur * 0.42).toFixed(3)});`;

// ---- readouts -------------------------------------------------------------
// A number that changes cannot be tweened: tl.set({text}) is a no-op in this
// runtime and tl.call is not reliably seekable. So every state is its own span,
// stacked in one fixed-size slot and toggled with a zero-duration set on
// autoAlpha. Seek-safe, deterministic, and it survives scrubbing.
//
// The box is sized on the WIDEST value, not the first — sizing it on values[0]
// leaves a one-character box holding the width while a three-digit value spills
// out of it, and the figure sits visibly off its own centre.
export const counter = (id, values, cls = "mono") => {
  const widest = values.reduce((a, b) => (String(b).length > String(a).length ? b : a), values[0]);
  return `<span id="${id}" style="position:relative;display:inline-block">
      <span class="${cls}" aria-hidden="true" style="visibility:hidden;white-space:pre">${widest}</span>
${values.map((v, i) => `      <span class="${cls}" data-k="${i}" style="position:absolute;left:0;top:0;white-space:pre;opacity:${i ? 0 : 1}">${v}</span>`).join("\n")}
    </span>`;
};

// Steps a counter through its values across [at, at+span]. The first state is
// already up at frame zero, so the readout is never blank on entry.
export const counterRun = (id, n, at, span) => {
  const step = span / Math.max(n - 1, 1);
  let out = "";
  for (let i = 1; i < n; i++) {
    const t = (at + i * step).toFixed(3);
    out += `      tl.set("#${id} [data-k='${i - 1}']", { autoAlpha: 0 }, ${t});\n`;
    out += `      tl.set("#${id} [data-k='${i}']", { autoAlpha: 1 }, ${t});\n`;
  }
  return out;
};

// ---- type-on ---------------------------------------------------------------
// Characters are revealed with zero-duration sets rather than by rewriting text:
// tl.set({text}) is a no-op in this runtime and tl.call is not seek-safe. The
// line is set in mono so the caret's x is arithmetic (advance = 0.6em) rather
// than a measured guess, and every glyph holds its layout slot from frame zero,
// so nothing reflows as the line fills.
export const ADVANCE = 0.6;

export const typeLine = (id, text, size, opt = {}) => {
  const chars = [...text];
  return `<div id="${id}" class="mono" data-layout-allow-overflow style="position:relative;display:inline-block;
      font-size:${size}px;line-height:1.2;white-space:nowrap;color:${opt.color ?? T.snow}">
${chars.map((c, i) => `<span data-c="${i}" style="opacity:0">${c === " " ? "&nbsp;" : c === "<" ? "&lt;" : c === "&" ? "&amp;" : c}</span>`).join("")}
      <span id="${id}-caret" style="position:absolute;left:0;top:${(size * 0.14).toFixed(0)}px;
        width:${(size * ADVANCE * 0.86).toFixed(0)}px;height:${(size * 0.92).toFixed(0)}px;
        background:${opt.caret ?? T.lit};opacity:0"></span>
    </div>`;
};

// cps ~= 24 reads as a person typing rather than a machine dumping a string
export const typeRun = (id, text, size, at, cps = 24) => {
  const chars = [...text];
  const step = 1 / cps;
  const w = size * ADVANCE;
  let out = `      tl.set("#${id}-caret", { autoAlpha: 1, x: 0 }, ${at.toFixed(3)});\n`;
  chars.forEach((_, i) => {
    const t = at + i * step;
    out += `      tl.set("#${id} [data-c='${i}']", { autoAlpha: 1 }, ${t.toFixed(3)});\n`;
    out += `      tl.set("#${id}-caret", { x: ${((i + 1) * w).toFixed(1)} }, ${t.toFixed(3)});\n`;
  });
  const end = at + chars.length * step;
  for (let b = 0; b < 4; b++)
    out += `      tl.set("#${id}-caret", { autoAlpha: ${b % 2 ? 1 : 0} }, ${(end + 0.16 + b * 0.28).toFixed(3)});\n`;
  out += `      tl.set("#${id}-caret", { autoAlpha: 0 }, ${(end + 1.40).toFixed(3)});\n`;
  return out;
};
export const typeEnd = (text, at, cps = 24) => at + [...text].length / cps;
