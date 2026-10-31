// VectorDrop launch film — the design system.
// Every token below is lifted from the product's own docs/DESIGN.md. The film
// wears the brand; it does not invent a look for it.

export const T = {
  ground:  "#161516",   // --bg-primary
  deep:    "#0D0D0D",   // --bg-secondary / --bg-panel
  card:    "#131313",   // --bg-card
  canvas:  "#1E1E1E",   // --bg-canvas
  ink:     "#FFFFFF",   // --text-primary
  dim:     "rgba(255,255,255,0.62)",
  faint:   "rgba(255,255,255,0.55)",   // 5.4:1 on every ground — 0.42 measured 4.0:1 and failed AA
  rule:    "rgba(255,255,255,0.08)",  // --border-default
  hair:    "rgba(255,255,255,0.04)",  // --border-subtle
  teal:    "#14B8A6",   // --accent
  deepteal:"#0D9488",   // --accent-hover, and the gradient's dark stop
  lit:     "#2DD4BF",   // --accent-light
  cyan:    "#0891B2",   // gradient ONLY — never a flat fill
};

// The hero gradient. Reserved for the title word and the milestone figure —
// the brand reserves it for the hero headline, so the film does too.
export const GRAD = `linear-gradient(135deg,${T.deepteal} 0%,${T.teal} 60%,${T.cyan} 100%)`;

import { LEGO_CSS } from "./lego.mjs";

export const STYLE = `${LEGO_CSS}
@font-face{font-family:Geist;src:url("assets/fonts/Geist-400.woff2")format("woff2");font-weight:400;font-display:block}
@font-face{font-family:Geist;src:url("assets/fonts/Geist-500.woff2")format("woff2");font-weight:500;font-display:block}
@font-face{font-family:Geist;src:url("assets/fonts/Geist-600.woff2")format("woff2");font-weight:600;font-display:block}
@font-face{font-family:GeistMono;src:url("assets/fonts/GeistMono-400.woff2")format("woff2");font-weight:400;font-display:block}
@font-face{font-family:GeistMono;src:url("assets/fonts/GeistMono-500.woff2")format("woff2");font-weight:500;font-display:block}
@font-face{font-family:AuxMono;src:url("assets/fonts/AuxMono-Regular.ttf")format("truetype");font-weight:400;font-display:block}

*{margin:0;padding:0;box-sizing:border-box}
#root{width:1920px;height:1080px;overflow:hidden;background:${T.ground};
  font-family:Geist,-apple-system,sans-serif;color:${T.ink};
  letter-spacing:-0.011em;-webkit-font-smoothing:antialiased}

/* ---- grounds -------------------------------------------------------------
   Every ground over-scans by 18%: a frame whose seam enters from below 1.0
   would otherwise expose the stage edge. */
.ground{position:absolute;inset:-18%}
.g-void  {background:${T.deep}}
.g-app   {background:${T.ground}}
.g-canvas{background:${T.canvas}}
.g-bloom {background:${T.ground}}

/* The two ambient blobs, straight out of DESIGN.md — 70vw top-right and
   50vw bottom-left, at the documented alphas. They are the brand's own
   atmosphere, not a gradient I picked. */
.blob{position:absolute;border-radius:50%;filter:blur(10px)}
.blob-a{width:1340px;height:1340px;top:-380px;right:-260px;
  background:radial-gradient(circle,rgba(13,148,136,0.14) 0%,rgba(20,184,166,0.07) 45%,transparent 70%)}
.blob-b{width:960px;height:960px;bottom:-190px;left:-130px;
  background:radial-gradient(circle,rgba(8,145,178,0.10) 0%,rgba(13,148,136,0.05) 45%,transparent 70%)}
.blob-hot{opacity:2.1}

/* Grain must MOVE. A static tile renders identical noise on all 3,200 frames,
   which reads as dirt on the lens rather than as film. This one is 3x
   oversized and translated by the timeline. */
.grain{position:absolute;left:-640px;top:-360px;width:3200px;height:1800px;
  opacity:0.055;pointer-events:none;mix-blend-mode:overlay;
  background-image:url("assets/plates/noise.png");background-repeat:repeat}

.vig{position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(ellipse 78% 70% at 50% 46%,transparent 40%,rgba(0,0,0,0.55) 100%)}

/* ---- type ---------------------------------------------------------------- */
.stage{position:absolute;inset:0}
.inner{position:absolute;inset:0}

.hdr{font-weight:500;font-size:86px;line-height:1.06;letter-spacing:-0.025em;color:${T.ink}}
.hdr-xl{font-weight:500;font-size:132px;line-height:1.02;letter-spacing:-0.028em}
.lead{font-size:27px;line-height:1.56;color:${T.dim};max-width:760px;letter-spacing:-0.008em}
.grad{background:${GRAD};-webkit-background-clip:text;background-clip:text;color:transparent}

/* AuxMono is the product's own UI micro-face — it is what makes a VectorDrop
   screen recognisable at a glance, so every chip and label in the film uses it. */
.tag{font-family:AuxMono,GeistMono,monospace;font-size:15px;letter-spacing:0.19em;
  text-transform:uppercase;color:${T.dim}}
.tag-teal{color:${T.lit}}
.mono{font-family:GeistMono,monospace;font-variant-numeric:tabular-nums;letter-spacing:-0.01em}
.rule{height:1px;background:${T.rule};transform-origin:left center}

/* ---- product surfaces ----------------------------------------------------
   One black and a 1px hairline for every panel in the film. Nothing carries a
   coloured edge: colour belongs to the content, never to a container. */
.panel{background:${T.card};border:1px solid ${T.rule};border-radius:16px}
.panel-deep{background:${T.deep};border:1px solid ${T.rule};border-radius:16px}
.win{background:${T.deep};border:1px solid ${T.rule};border-radius:14px;overflow:hidden}
.winbar{height:46px;border-bottom:1px solid ${T.rule};display:flex;align-items:center;
  padding:0 16px;gap:8px;background:rgba(255,255,255,0.015)}
.dot{width:11px;height:11px;border-radius:50%}
.chip{display:inline-flex;align-items:center;gap:9px;padding:8px 15px;border-radius:8px;
  border:1px solid ${T.rule};background:rgba(255,255,255,0.03);
  font-family:AuxMono,monospace;font-size:14px;letter-spacing:0.15em;text-transform:uppercase;color:${T.dim}}
.chip-on{border-color:rgba(20,184,166,0.30);background:rgba(20,184,166,0.07);color:${T.lit}}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:22px;padding:13px 30px;
  background:#fff;color:#000;font-family:AuxMono,monospace;font-size:15px;
  letter-spacing:0.03em;text-transform:uppercase}
.btn-ghost{background:transparent;color:${T.dim};border:1px dashed rgba(255,255,255,0.22)}

/* The oversized macOS cursor. It is the film's only actor, so it is 2.4x life
   size — at 1:1 a pointer is invisible at this distance. */
.cursor{position:absolute;width:56px;height:56px;pointer-events:none;z-index:90;
  filter:drop-shadow(0 3px 7px rgba(0,0,0,0.62))}
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

// The four grounds. `hot` lifts the brand blobs for the milestone act.
// Real photographed bricks, in the client's own palette, replacing the
// abstract ink plates: the brand's motif is building bricks, so its texture
// should be building bricks.
export const PLATE = { app: "brick-macro", canvas: "brick-build", bloom: "brick-macro", void: null };
export const PLATE_OPACITY = { app: 0.052, canvas: 0.042, bloom: 0.062 };

// `len` lets the plate declare its own clip window. data-start is LOCAL to the
// frame — the assembler applies the global offset, and writing the global start
// here would add it twice and render the frame blank with every gate passing.
export const field = (kind, id = "f", len = 8, override = null) => {
  const hot = kind === "bloom";
  const plate = override || PLATE[kind];
  return `    <div class="ground g-${kind}"></div>${plate ? `
    <video id="${id}-plate" src="assets/plates/${plate}.mp4" muted playsinline
      data-start="0" data-duration="${Math.min(len, 10.0).toFixed(3)}" data-track-index="0" data-volume="0"
      style="position:absolute;inset:-4%;width:108%;height:108%;object-fit:cover;
             opacity:${override ? 0.095 : PLATE_OPACITY[kind]};mix-blend-mode:screen;pointer-events:none"></video>` : ""}
    <div class="blob blob-a${hot ? " blob-hot" : ""}"></div>
    <div class="blob blob-b${hot ? " blob-hot" : ""}"></div>
    <div id="grain" class="grain"></div>
    <div class="vig"></div>`;
};

// Grain drift — 9s to cross one tile, restarted per frame so it never sits still.
export const grainDrift = (len) =>
  `      tl.fromTo("#grain", { x: 0, y: 0 },
        { x: -128, y: -72, duration: ${Math.max(len, 4).toFixed(2)}, ease: "none" }, 0);`;

export const cursorSVG = `<svg viewBox="0 0 24 24" width="56" height="56" xmlns="http://www.w3.org/2000/svg">
  <path d="M5.5 2.2 L5.5 19.4 L9.8 15.4 L12.6 21.6 L15.8 20.2 L13.0 14.1 L18.8 14.1 Z"
    fill="#fff" stroke="#0b0b0b" stroke-width="1.05" stroke-linejoin="round"/></svg>`;

// ---- readouts -------------------------------------------------------------
// A number that changes cannot be tweened: tl.set({text}) is a no-op here and
// tl.call is not reliably seekable. So every state is its own span, stacked in
// one fixed-size slot, and toggled with a zero-duration tl.set on autoAlpha.
// Seek-safe, deterministic, and it survives scrubbing.
export const counter = (id, values, cls = "mono") => {
  // The box must be as wide as the WIDEST value, not the first one. Sizing it
  // on values[0] left "0" holding the width while "430" overflowed to the right
  // of a centred one-character box — the figure visibly off-centre.
  const widest = values.reduce((a, b) => (String(b).length > String(a).length ? b : a), values[0]);
  return `<span id="${id}" style="position:relative;display:inline-block;font-variant-numeric:tabular-nums">
      <span class="${cls}" aria-hidden="true" style="visibility:hidden;white-space:pre">${widest}</span>
${values.map((v, i) => `      <span class="${cls}" data-k="${i}" style="position:absolute;left:0;right:0;top:0;text-align:inherit;white-space:pre;opacity:${i ? 0 : 1}">${v}</span>`).join("\n")}
    </span>`;
};

// Steps a counter through its values across [at, at+span]. The first state is
// already up at frame zero, so the readout is never blank on entry.
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
// stage in on the cut. Fading them up from 0.10s makes the frame render
// essentially blank at the boundary — the motion gate passes, and the film
// still enters empty. Only the lead line is allowed to fade.
export const head = (tag, hdr, lead, opt = {}) => {
  const x = opt.x ?? 132, y = opt.y ?? 118;
  const lines = String(hdr).split(/<br\s*\/?>/i).length;
  const size = opt.size ?? 86;
  const leadTop = y + 62 + lines * Math.round(size * 1.06) + 34;
  return `      <div class="tag" id="s-tag" style="position:absolute;left:${x}px;top:${y}px">${tag}</div>
      <div class="rule" id="s-rule" style="position:absolute;left:${x}px;top:${y + 32}px;width:${opt.rule ?? 250}px"></div>
      <div class="hdr" id="s-hdr" style="position:absolute;left:${x}px;top:${y + 62}px;font-size:${size}px${opt.hw ? `;max-width:${opt.hw}px` : ""}">
        <span class="grad" style="display:inline-block;padding-bottom:0.06em">${hdr}</span></div>
${lead ? `      <div class="lead" id="s-lead" style="position:absolute;left:${x}px;top:${leadTop}px${opt.lw ? `;max-width:${opt.lw}px` : ""}">${lead}</div>` : ""}`;
};

export const headIn = (t = 0.10) => `
      tl.fromTo("#s-rule", { scaleX: 0 }, { scaleX: 1, duration: 0.50, ease: "power3.out" }, ${(t + 0.04).toFixed(2)});
      tl.fromTo("#s-hdr",  { y: 16 }, { y: 0, duration: 0.54, ease: "power3.out" }, 0);
      tl.fromTo("#s-lead", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.54, ease: "power3.out" }, ${(t + 0.22).toFixed(2)});`;

// Nothing lands as a group: 3-6 frames between siblings at 30fps.
export const stagger = (sel, at, n, from = { autoAlpha: 0, y: 22 }, step = 0.13, dur = 0.5) =>
  Array.from({ length: n }, (_, i) =>
    `      tl.fromTo("${sel}${i}", ${JSON.stringify(from)}, { autoAlpha: 1, y: 0, x: 0, scale: 1, duration: ${dur}, ease: "power3.out" }, ${(at + i * step).toFixed(3)});`
  ).join("\n");

// Cursor: enters from off-frame (never fades in — a pointer that materialises
// has no author), travels to the target, and taps.
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
export const cursorTap = (at) =>
  `      tl.to("#cur", { scale: 0.82, duration: 0.07, ease: "power2.in" }, ${at.toFixed(3)});
      tl.to("#cur", { scale: 1, duration: 0.17, ease: "back.out(2.6)" }, ${(at + 0.07).toFixed(3)});`;

// ---- type-on ---------------------------------------------------------------
// Characters are revealed with zero-duration sets rather than by rewriting text:
// tl.set({text}) is a no-op in this runtime and tl.call is not seek-safe. The
// line is set in Geist Mono so the caret's x is arithmetic (advance = 0.6em)
// instead of a measured guess, and every glyph holds its layout slot from frame
// zero, so nothing reflows as it fills.
export const ADVANCE = 0.6;

export const typeLine = (id, text, size, opt = {}) => {
  const chars = [...text];
  return `<div id="${id}" class="mono" style="position:relative;display:inline-block;
      font-size:${size}px;line-height:1.14;letter-spacing:-0.01em;white-space:nowrap;color:${opt.color ?? T.ink}">
${chars.map((c, i) => `<span data-c="${i}" style="opacity:0">${c === " " ? "&nbsp;" : c === "<" ? "&lt;" : c}</span>`).join("")}
      <span id="${id}-caret" style="position:absolute;left:0;top:${(size * 0.16).toFixed(0)}px;
        width:${(size * ADVANCE * 0.82).toFixed(0)}px;height:${(size * 0.9).toFixed(0)}px;
        background:${opt.caret ?? T.lit};opacity:0"></span>
    </div>`;
};

// cps ~= 22 reads as deliberate typing rather than a machine dumping a string
export const typeRun = (id, text, size, at, cps = 22) => {
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
  // the caret blinks twice and goes, the way a real one does
  for (let b = 0; b < 4; b++)
    out += `      tl.set("#${id}-caret", { autoAlpha: ${b % 2 ? 1 : 0} }, ${(end + 0.16 + b * 0.30).toFixed(3)});\n`;
  out += `      tl.set("#${id}-caret", { autoAlpha: 0 }, ${(end + 1.50).toFixed(3)});\n`;
  return out;
};

// ---- scanline wipe ---------------------------------------------------------
// A progressive top-down reveal built from nothing but y-translation, because
// this runtime animates neither `height` nor `stroke-dashoffset` and ships no
// DrawSVG plugin.
//
// An outer clip window (overflow:hidden, full height) starts translated fully
// ABOVE the plate; the inner content counter-translates by exactly the opposite
// amount, so the content never appears to move while the window grows down over
// it. A bright bar rides the leading edge — the tracer, sweeping the image.
export const wipe = (id, h, content, opt = {}) => `
      <div id="${id}" style="position:absolute;left:0;top:0;width:${opt.w ?? h}px;height:${h}px;overflow:hidden">
        <div id="${id}-in" style="position:absolute;left:0;top:0;width:${opt.w ?? h}px;height:${h}px">${content}</div>
      </div>
      <div id="${id}-scan" style="position:absolute;left:-10px;top:0;width:${(opt.w ?? h) + 20}px;height:2px;
           background:${T.lit};opacity:0"></div>
      <div id="${id}-glow" style="position:absolute;left:0;top:-46px;width:${opt.w ?? h}px;height:46px;opacity:0;
           background:linear-gradient(to bottom,transparent,rgba(45,208,191,0.30))"></div>`;

export const wipeRun = (id, h, at, dur = 0.9, ease = "power2.inOut") => `
      tl.set("#${id}", { y: -${h} }, 0);
      tl.set("#${id}-in", { y: ${h} }, 0);
      tl.to("#${id}", { y: 0, duration: ${dur}, ease: "${ease}" }, ${at.toFixed(3)});
      tl.to("#${id}-in", { y: 0, duration: ${dur}, ease: "${ease}" }, ${at.toFixed(3)});
      tl.set("#${id}-scan", { autoAlpha: 1, y: 0 }, ${at.toFixed(3)});
      tl.set("#${id}-glow", { autoAlpha: 1, y: 0 }, ${at.toFixed(3)});
      tl.to("#${id}-scan", { y: ${h}, duration: ${dur}, ease: "${ease}" }, ${at.toFixed(3)});
      tl.to("#${id}-glow", { y: ${h}, duration: ${dur}, ease: "${ease}" }, ${at.toFixed(3)});
      tl.set("#${id}-scan", { autoAlpha: 0 }, ${(at + dur).toFixed(3)});
      tl.set("#${id}-glow", { autoAlpha: 0 }, ${(at + dur).toFixed(3)});`;

// A pulse that travels a horizontal connector — the pipeline actually carrying
// something, rather than four chips sitting next to each other.
export const pulse = (id, w) => `
      <div id="${id}-track" style="position:absolute;left:0;top:0;width:${w}px;height:2px;background:rgba(255,255,255,0.07)"></div>
      <div id="${id}-fill" style="position:absolute;left:0;top:0;width:${w}px;height:2px;background:${T.teal};
           transform-origin:left center"></div>
      <div id="${id}-dot" style="position:absolute;left:-7px;top:-6px;width:14px;height:14px;border-radius:50%;
           background:${T.lit};opacity:0"></div>`;

export const pulseRun = (id, w, at, dur) => `
      tl.fromTo("#${id}-fill", { scaleX: 0 }, { scaleX: 1, duration: ${dur}, ease: "none" }, ${at.toFixed(3)});
      tl.set("#${id}-dot", { autoAlpha: 1, x: 0 }, ${at.toFixed(3)});
      tl.to("#${id}-dot", { x: ${w}, duration: ${dur}, ease: "none" }, ${at.toFixed(3)});
      tl.to("#${id}-dot", { autoAlpha: 0, duration: 0.24 }, ${(at + dur).toFixed(3)});`;
