// EP27 shared frame scaffold — THE ANNOTATED PAGE.
// Asset paths are HOST-relative (frames are cloned into the root index.html),
// so "assets/..." — never "../assets/...".
//
// THE CORE SPLIT, and it governs every helper below:
//   PRINTED things (type, rules, sheets, panels) move smoothly and arrive staged.
//   DRAWN things (marker, pen, ticks, crosses, arrows) STEP at 15fps and land AFTER
//   the thing they mark. `st(dur)` returns the steps() ease for a given duration.

export const STYLE = `
@font-face{font-family:"Archivo";src:url("assets/fonts/Archivo-var.woff2") format("woff2");font-weight:100 900;font-stretch:62% 125%;font-display:block}
@font-face{font-family:"JBMono";src:url("assets/fonts/JetBrainsMono-400.woff2") format("woff2");font-weight:400;font-display:block}
@font-face{font-family:"JBMono";src:url("assets/fonts/JetBrainsMono-700.woff2") format("woff2");font-weight:700;font-display:block}
@font-face{font-family:"Serif";src:url("assets/fonts/InstrumentSerif-400.woff2") format("woff2");font-weight:400;font-style:normal;font-display:block}
@font-face{font-family:"Serif";src:url("assets/fonts/InstrumentSerif-italic.woff2") format("woff2");font-weight:400;font-style:italic;font-display:block}

#root{position:relative;width:1920px;height:1080px;overflow:hidden;
  --paper:#F4F1EA; --paper2:#E7E1D4; --sheet:#FBF9F4;
  --ink:#14110E; --ink2:#5A5245; --navy:#16233B;
  --yellow:#FFEB00; --pen:#DC3220; --pentype:#B32414; --rule:#B8B0A0;
  background:var(--paper); color:var(--ink);
  font-family:"Archivo",system-ui,sans-serif; -webkit-font-smoothing:antialiased;
  font-variant-numeric:tabular-nums; font-feature-settings:"tnum" 1;}
#root *{margin:0;padding:0;box-sizing:border-box}

/* stage carries every seam move; content never animates the clip itself */
.stage{position:absolute;inset:0}
.inner{position:relative;z-index:1;width:100%;height:100%}
/* the coloured field travels WITH the stage, so a navy or yellow frame reads as a
   card sliding over the page rather than as the ground changing colour. */
.field{position:absolute;inset:0}

/* ---- TYPE ---- */
.hdr{font-weight:800;font-stretch:88%;letter-spacing:-.045em;line-height:.90;color:var(--ink)}
.deck{font-weight:500;line-height:1.26;color:var(--ink2)}
.quote{font-family:"Serif",Georgia,serif;line-height:1.16;color:var(--ink)}
.ital{font-family:"Serif",Georgia,serif;font-style:italic}
.mono{font-family:"JBMono",monospace;color:var(--ink)}
.tag{font-family:"JBMono",monospace;font-weight:700;letter-spacing:.18em;
  text-transform:uppercase;color:var(--ink2);font-size:21px}
.redtype{color:var(--pentype)}
.onnavy{color:var(--sheet)}
.onnavy .tag,.onnavy .deck{color:#A9B6C9}

/* ---- PAPER: a sheet is defined by its shadow and its edge, never by a stripe ---- */
.sheet{position:absolute;background:var(--sheet);
  box-shadow:0 1px 0 rgba(20,17,14,.16), 0 10px 24px rgba(20,17,14,.12)}
.card{position:absolute;background:var(--sheet);
  box-shadow:0 1px 0 rgba(20,17,14,.14), 0 7px 18px rgba(20,17,14,.10)}
.hair{position:absolute;background:var(--rule);height:1px}
.rule2{position:absolute;background:var(--ink);height:3px}

/* ---- THE MARKER: sits BEHIND its phrase, skewed, origin left ---- */
.mark{position:absolute;background:var(--yellow);z-index:0;transform-origin:0% 50%}
.marknavy{background:var(--yellow)}
.phrase{position:relative;z-index:1}

/* ---- THE PEN: strokes only. Never a glyph, never on navy. ---- */
.pen{position:absolute;pointer-events:none;overflow:visible}
.pen path,.pen line,.pen polyline{fill:none;stroke:var(--pen);stroke-linecap:round;
  stroke-linejoin:round}
.penY path,.penY line,.penY polyline{stroke:var(--yellow)}
.penD path,.penD line,.penD polyline{stroke:var(--pentype)}
.penI path,.penI line,.penI polyline{stroke:var(--ink)}
`;

/* ---------- deterministic imperfection --------------------------------------
   Nothing in this register is perfectly square. Every rotation and every wobble is
   derived from an integer seed at BUILD time, so the render stays frame-pure. */
export const rnd = (s) => { const x = Math.sin(s * 127.1 + 11.7) * 43758.5453; return x - Math.floor(x); };
/** −1.4deg .. +1.4deg, stable per index */
export const tilt = (i) => ((rnd(i) * 2 - 1) * 1.4).toFixed(2);

/* ---------- ON TWOS ---------------------------------------------------------
   Vox animates graphics at 12fps inside a 24fps timeline. This film renders at 30,
   so the annotation layer steps at 15 — the closest clean division, one new position
   every other frame. The SEAMS are never stepped: a velocity-matched power4 cut
   rendered on twos reads as a dropped frame, not as craft. */
export const FPS_DRAWN = 15;
export const st = (dur) => `steps(${Math.max(2, Math.round(dur * FPS_DRAWN))})`;

/* ---------- FIELDS: one dominant brightness per act ---------------------- */
export const FIELDS = {
  paper:  "var(--paper)",
  paper2: "var(--paper2)",
  navy:   "var(--navy)",
  yellow: "var(--yellow)",
};
export const field = (name) => `<div class="field" style="background:${FIELDS[name]}"></div>`;
export const isDark = (name) => name === "navy";

/* ---------- THE MARKER SWEEP — the film's signature ----------------------
   A yellow bar behind a phrase, scaleX 0->1 on twos. It arrives AFTER the type, on
   the narration's word. Six in the film; the seventh would make it a transition. */
export const marker = (id, x, y, w, h) =>
  `<div id="${id}" class="mark" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"></div>`;

export const markerIn = (id, t, dur = 0.38) =>
  // The skew rides in BOTH tween var sets. GSAP overwrites the whole transform, so a
  // skewX authored in CSS is destroyed the instant scaleX is tweened.
  `\n      gsap.set("#${id}", { scaleX: 0, skewX: -1.2 });` +
  `\n      tl.fromTo("#${id}", { scaleX: 0, skewX: -1.2 }, { scaleX: 1, skewX: -1.2, duration: ${dur}, ease: "${st(dur)}" }, ${t.toFixed(2)});`;

/* ---------- THE PEN -------------------------------------------------------
   Drawn with stroke-dasharray + strokeDashoffset. The `d` is authored statically in
   the HTML (a path with no static d measures 0 in Chrome and silently draws nothing),
   and the dash length is a deliberate OVER-estimate so offset=L is fully hidden. */
export const penPath = (id, d, len, w = 5, cls = "") =>
  `<svg id="${id}-svg" class="pen ${cls}" style="left:0;top:0;width:1920px;height:1080px" viewBox="0 0 1920 1080">
      <path id="${id}" d="${d}" stroke-width="${w}" style="stroke-dasharray:${len};stroke-dashoffset:${len}"/>
    </svg>`;

export const penIn = (id, len, t, dur = 0.55) =>
  `\n      gsap.set("#${id}", { strokeDashoffset: ${len} });` +
  `\n      tl.to("#${id}", { strokeDashoffset: 0, duration: ${dur}, ease: "${st(dur)}" }, ${t.toFixed(2)});`;

/** A hand-drawn ellipse: traced from -0.12 turns to 1.06 turns, so it leaves a gap
    where the pen started and an overshoot where it crossed its own line. Radius
    wobbles ~3% off a seeded sine. */
export const ellipseD = (cx, cy, rx, ry, seed = 1) => {
  const A0 = -0.12 * Math.PI * 2, A1 = 1.06 * Math.PI * 2, N = 96;
  const pts = [];
  for (let i = 0; i <= N; i++) {
    const a = A0 + (A1 - A0) * (i / N);
    const k = 1 + 0.035 * Math.sin(a * 3 + seed * 2.3) + 0.018 * Math.sin(a * 5 + seed);
    pts.push(`${(cx + Math.cos(a) * rx * k).toFixed(1)},${(cy + Math.sin(a) * ry * k).toFixed(1)}`);
  }
  return { d: "M" + pts.join(" L"), len: Math.ceil(Math.PI * (rx + ry) * 1.30) };
};

/** An underline the pen dragged: two nearly-parallel strokes, the second shorter. */
export const underlineD = (x, y, w, seed = 1) => {
  const dip = 3 + rnd(seed) * 4;
  return {
    d: `M${x},${y} Q${x + w * 0.45},${y + dip} ${x + w},${y - 1.5}`,
    len: Math.ceil(w * 1.06),
  };
};

/** A pen arrow: a slightly bowed shaft plus a two-stroke head. */
export const arrowD = (x1, y1, x2, y2, bow = 26) => {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
  const nx = -dy / L, ny = dx / L;
  const cx = mx + nx * bow, cy = my + ny * bow;
  const ax = Math.atan2(y2 - cy, x2 - cx);
  const h = 22;
  const h1x = x2 - Math.cos(ax - 0.42) * h, h1y = y2 - Math.sin(ax - 0.42) * h;
  const h2x = x2 - Math.cos(ax + 0.42) * h, h2y = y2 - Math.sin(ax + 0.42) * h;
  return {
    d: `M${x1},${y1} Q${cx.toFixed(1)},${cy.toFixed(1)} ${x2},${y2} M${h1x.toFixed(1)},${h1y.toFixed(1)} L${x2},${y2} L${h2x.toFixed(1)},${h2y.toFixed(1)}`,
    len: Math.ceil(L * 1.22 + h * 2 + 8),
  };
};

/** A cross-out: two strokes, drawn as one path so they land on one tween. */
export const crossD = (cx, cy, r, seed = 1) => {
  const j = () => (rnd(seed++) * 2 - 1) * 2.5;
  return {
    d: `M${cx - r + j()},${cy - r + j()} L${cx + r + j()},${cy + r + j()} M${cx + r + j()},${cy - r + j()} L${cx - r + j()},${cy + r + j()}`,
    len: Math.ceil(r * 5.8),
  };
};

/** A tick: down-stroke then the long up-stroke. */
export const tickD = (cx, cy, r) => ({
  d: `M${cx - r},${cy} L${cx - r * 0.25},${cy + r * 0.72} L${cx + r * 1.05},${cy - r * 0.95}`,
  len: Math.ceil(r * 3.4),
});

/* ---------- SEEK-SAFE READOUTS -------------------------------------------
   A tween on text content is a no-op (no TextPlugin) and tl.call is not reliably
   seekable, so a changing figure is a STACK of spans toggled with zero-duration set. */
export const readout = (id, values, style = "") =>
  `<div id="${id}" style="position:relative;${style}">` +
  values.map((v, i) => `<span id="${id}-${i}" style="position:absolute;left:0;top:0;white-space:nowrap">${v}</span>`).join("") +
  `</div>`;

export const readoutIn = (id, n, t0, dt) => {
  let s = `\n      for (var _r_${id.replace(/\W/g, "")} = 1; _r_${id.replace(/\W/g, "")} < ${n}; _r_${id.replace(/\W/g, "")}++) gsap.set("#${id}-" + _r_${id.replace(/\W/g, "")}, { autoAlpha: 0 });`;
  for (let i = 1; i < n; i++) {
    s += `\n      tl.set("#${id}-${i}", { autoAlpha: 1 }, ${(t0 + (i - 1) * dt).toFixed(2)});`;
    s += `\n      tl.set("#${id}-${i - 1}", { autoAlpha: 0 }, ${(t0 + (i - 1) * dt).toFixed(2)});`;
  }
  return s;
};

/* ---------- SEAMS ---------------------------------------------------------
   House current is LEFT. Exit travel E, entry travel ~1.27E, mirrored power4.
   Both halves authored in-frame; transition_in on the clip is always a cut. */
export const EXIT = 236, ENTRY = 300;

export const enterAcross = (sel = "#stage") =>
  `      // SEAM ENTRY — across, cut-the-curve LEFT. Enters mid-flight at FULL opacity:
      // the gate measures MOTION, so a frame that fades up still enters visibly blank.
      tl.fromTo("${sel}", { x: ${ENTRY} }, { x: 0, duration: 0.43, ease: "power4.out" }, 0);`;

export const exitAcross = (sel, at) =>
  `      // SEAM EXIT — across, travelling LEFT out of frame at matched velocity.
      tl.to("${sel}", { x: -${EXIT}, duration: 0.34, ease: "power4.in" }, ${at.toFixed(2)});`;

export const enterLift = (sel = "#stage") =>
  `      // SEAM ENTRY — ACT BREAK lift. Rises from below through a softer scale curve
      // than the travel, so the pull-back reads as the page being turned up and over.
      tl.fromTo("${sel}", { y: 372 }, { y: 0, duration: 0.62, ease: "power4.out" }, 0);
      tl.fromTo("${sel}", { scale: 0.86 }, { scale: 1, duration: 0.78, ease: "power2.out" }, 0);`;

export const exitLift = (sel, at) =>
  `      // SEAM EXIT — ACT BREAK lift. Travels UP and pulls back to 0.86.
      tl.to("${sel}", { y: -300, duration: 0.46, ease: "power4.in" }, ${at.toFixed(2)});
      tl.to("${sel}", { scale: 0.86, duration: 0.52, ease: "power2.in" }, ${at.toFixed(2)});`;

/** Z-BACK — reserved for the turn. Spent ONCE in this film: cost -> slate. */
export const exitZBack = (sel, at) =>
  `      // SEAM EXIT — Z-BACK, the arrival vector. Reserved; spent once in this film.
      tl.to("${sel}", { scale: 0.60, duration: 0.52, ease: "power4.in" }, ${at.toFixed(2)});`;

export const enterZBack = (sel = "#stage") =>
  `      // SEAM ENTRY — Z-BACK continued: enters ABOVE 1.0 and settles DOWN to it, so both
      // halves share the sign of the scale velocity. Mirroring reads as a bounce, not a move.
      tl.fromTo("${sel}", { scale: 1.48 }, { scale: 1, duration: 0.62, ease: "power4.out" }, 0);`;

export const ENTER = { across: enterAcross, lift: enterLift, zback: enterZBack };
export const EXITF = { across: exitAcross, lift: exitLift, zback: exitZBack };

/* ---------- THE HEADER BLOCK --------------------------------------------- */
export const header = (n, tag, head, deck, dark = false) => {
  const lines = head.split(/<br\s*\/?>/i).length;
  const deckTop = 172 + lines * 84 + 40;
  return `
      <div id="s-tag" class="tag" style="position:absolute;left:118px;top:108px">${n} · ${tag}</div>
      <div id="s-rule" class="rule2" style="left:118px;top:146px;width:104px;transform-origin:0% 50%;${dark ? "background:var(--yellow)" : ""}"></div>
      <div id="s-hdr" class="hdr" style="position:absolute;left:114px;top:172px;width:1240px;font-size:88px${dark ? ";color:var(--sheet)" : ""}">${head}</div>
      ${deck ? `<div id="s-deck" class="deck" style="position:absolute;left:118px;top:${deckTop}px;width:860px;font-size:32px${dark ? ";color:#A9B6C9" : ""}">${deck}</div>` : ""}`;
};

export const headerIn = (t = 0.10, hasDeck = true) => `
      // SEAM CARRIER — the tag and the headline are at FULL opacity from frame zero and
      // ride the cut in on the stage. They are never faded up: the gate measures MOTION,
      // so a frame whose content fades in at 0.1s passes while visibly entering blank.
      tl.fromTo("#s-rule", { scaleX: 0 }, { scaleX: 1, duration: 0.46, ease: "power3.out" }, ${(t + 0.04).toFixed(2)});
      tl.fromTo("#s-hdr",  { y: 16 }, { y: 0, duration: 0.52, ease: "power3.out" }, 0);${hasDeck ? `
      tl.fromTo("#s-deck", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.52, ease: "power3.out" }, ${(t + 0.20).toFixed(2)});` : ""}`;

/* ---------- THE WRAP ------------------------------------------------------ */
/** `transparent` is REQUIRED for any overlay composition mounted on a track above the
    frames: #root carries an opaque --paper background, so an overlay that keeps it
    paints over the entire film and every gate still passes. */
export const wrap = (id, body, script, transparent = false) => `<template>
  <style>${STYLE}${transparent ? "\n#root{background:transparent}" : ""}${"\n"}  </style>

  <div id="root" data-composition-id="${id}" data-start="0" data-width="1920" data-height="1080">
${body}
  </div>

  <script>
    (function () {
      var tl = gsap.timeline({ paused: true });
${script}
      window.__timelines = window.__timelines || {};
      window.__timelines["${id}"] = tl;
    })();
  </script>
</template>
`;
