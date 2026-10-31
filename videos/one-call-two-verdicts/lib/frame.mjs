// EP28 shared frame scaffold — THE NEWSPRINT CUTOUT.
//
// Asset paths are HOST-relative (frames are cloned into the root index.html),
// so "assets/..." — never "../assets/...".
//
// THE CORE SPLIT, and it governs every helper below:
//   THE PAGE      newsprint ground, halftone, folds. Moves only on a seam.
//   A CUTTING     a scrap with type already on it. Arrives by THE SLAP, on threes.
//   A MARK        red pen, stamp, strike. Draws on twos, always AFTER what it marks.
//   PRESS TYPE    type set for this page. Smooth, staged, never slapped.
//
// THE TWO RUNTIMES.  GSAP owns the spine and every seam. Anime.js owns splitText,
// createDrawable and grid-stagger — but it is DRIVEN BY GSAP, never registered on
// window.__hfAnime. Verified by render: the HyperFrames animejs adapter reads its
// registry at composition init, before a frame sub-composition's script has run, so
// an instance registered from inside a frame is never discovered — and even when it
// is discovered it receives GLOBAL time while GSAP receives frame-LOCAL time. Both
// failures are silent. `drive()` below is the fix: anime computes every value, GSAP
// is only the clock, and the whole thing stays frame-local and seek-safe.

export const STYLE = `
@font-face{font-family:"Fraktur";src:url("assets/fonts/Fraktur-400.woff2") format("woff2");font-weight:400;font-display:block}
@font-face{font-family:"Anton";src:url("assets/fonts/Anton-400.woff2") format("woff2");font-weight:400;font-display:block}
@font-face{font-family:"Oswald";src:url("assets/fonts/Oswald-700.woff2") format("woff2");font-weight:700;font-display:block}
@font-face{font-family:"Playfair";src:url("assets/fonts/Playfair-900.woff2") format("woff2");font-weight:900;font-style:normal;font-display:block}
@font-face{font-family:"Playfair";src:url("assets/fonts/Playfair-700i.woff2") format("woff2");font-weight:700;font-style:italic;font-display:block}
@font-face{font-family:"Bodoni";src:url("assets/fonts/Bodoni-900.woff2") format("woff2");font-weight:900;font-display:block}
@font-face{font-family:"PTSerif";src:url("assets/fonts/PTSerif-400.woff2") format("woff2");font-weight:400;font-style:normal;font-display:block}
@font-face{font-family:"PTSerif";src:url("assets/fonts/PTSerif-700.woff2") format("woff2");font-weight:700;font-style:normal;font-display:block}
@font-face{font-family:"PTSerif";src:url("assets/fonts/PTSerif-400i.woff2") format("woff2");font-weight:400;font-style:italic;font-display:block}
@font-face{font-family:"Courier";src:url("assets/fonts/Courier-400.woff2") format("woff2");font-weight:400;font-display:block}
@font-face{font-family:"Courier";src:url("assets/fonts/Courier-700.woff2") format("woff2");font-weight:700;font-display:block}
@font-face{font-family:"Archivo";src:url("assets/fonts/Archivo-var.woff2") format("woff2");font-weight:100 900;font-stretch:62% 125%;font-display:block}

#root{position:relative;width:1920px;height:1080px;overflow:hidden;
  --news:#E3DDCE; --news2:#D3CBB8; --scrap:#F2EDE1; --plate:#141210;
  --ink:#171310; --ink2:#4E4638; --stop:#C1272D; --stopt:#A81E24;
  background:var(--news); color:var(--ink);
  font-family:"Archivo",system-ui,sans-serif; -webkit-font-smoothing:antialiased;
  font-variant-numeric:tabular-nums; font-feature-settings:"tnum" 1;}
#root *{margin:0;padding:0;box-sizing:border-box}

/* stage carries every seam move; content never animates the .clip itself */
.stage{position:absolute;inset:0}
.inner{position:relative;z-index:1;width:100%;height:100%}
/* The field OVER-SCANS. A frame whose exit shrinks (the reserved Z-back) would
   otherwise show the stage edge for the length of the cut. -18% covers the largest
   travel in a 1920-wide frame and costs nothing on the frames that never shrink. */
.field{position:absolute;inset:-18%}

/* ---- THE PAGE: newsprint is a HALFTONE, not a flat fill --------------------
   A 4px dot screen in press black at low alpha. Static, always: a halftone that
   moves is a moire and it will wreck the encode. */
.screen{position:absolute;inset:-18%;pointer-events:none;
  background-image:radial-gradient(circle at 1px 1px, rgba(23,19,16,.115) 0.85px, transparent 0.9px);
  background-size:4px 4px}
/* the press never lays ink perfectly evenly */
.grain{position:absolute;inset:-18%;pointer-events:none;opacity:.5;
  background-image:radial-gradient(circle at 2px 3px, rgba(23,19,16,.08) 1px, transparent 1.1px);
  background-size:11px 9px}

/* ---- TYPE: eight families, one job each ---------------------------------- */
.mast{font-family:"Fraktur",serif;font-weight:400;line-height:.95;color:var(--ink)}
.head{font-family:"Anton",sans-serif;font-weight:400;line-height:.88;
  letter-spacing:-.005em;text-transform:uppercase;color:var(--ink)}
.head2{font-family:"Oswald",sans-serif;font-weight:700;line-height:.94;
  letter-spacing:.005em;text-transform:uppercase;color:var(--ink)}
.quote{font-family:"Playfair",Georgia,serif;font-weight:900;line-height:1.10;color:var(--ink)}
.qital{font-family:"Playfair",Georgia,serif;font-weight:700;font-style:italic;line-height:1.14}
/* Bodoni Moda is loaded at optical size 96 — a DISPLAY cut. Below about 80px its
   hairline stems vanish in the render and N becomes a bare diagonal, 1 a bare stem.
   .fig is for BIG figures only; anything smaller uses .head2 (Oswald). Verified by
   measuring the render, not by looking at the font in a browser. */
.fig{font-family:"Bodoni",serif;font-weight:900;line-height:.86;color:var(--ink)}
.body{font-family:"PTSerif",Georgia,serif;font-weight:400;line-height:1.30;color:var(--ink)}
.bodyb{font-family:"PTSerif",Georgia,serif;font-weight:700;line-height:1.28}
.bodyi{font-family:"PTSerif",Georgia,serif;font-style:italic;line-height:1.30}
.mono{font-family:"Courier",monospace;font-weight:400;color:var(--ink)}
.monob{font-family:"Courier",monospace;font-weight:700}
.slug{font-family:"Archivo",sans-serif;font-weight:700;letter-spacing:.20em;
  text-transform:uppercase;font-size:20px;color:var(--ink2)}
.red{color:var(--stopt)}      /* red as a LETTER — the only red allowed to be type */
.faint{color:var(--ink2)}
.rev{color:var(--scrap)}      /* reversed out of the black plate */
.rev .faint{color:#A79E8D}
.rev .slug{color:#A79E8D}

/* ---- RULES: press furniture. Never a glyph. ------------------------------ */
.rule{position:absolute;background:var(--ink);height:3px}
.hair{position:absolute;background:var(--ink2);height:1px;opacity:.55}
.rrule{position:absolute;background:var(--stop);height:5px}
.revrule{position:absolute;background:var(--scrap);height:3px}

/* ---- A CUTTING ----------------------------------------------------------
   Four layers, and all four are required. The drop-shadow lives on a SIBLING,
   not in box-shadow: box-shadow follows the border box, so on a clip-path shape
   it draws a rectangle behind a torn edge — the single loudest tell in the register. */
.cutw{position:absolute}                                   /* the slap wrapper */
.cutsh{position:absolute;inset:0;background:rgba(23,19,16,.34);filter:blur(7px)}
.cutfib{position:absolute;inset:0;background:#FFFCF4}      /* the torn fibre lip */
.cutface{position:absolute;inset:0;background:var(--scrap);overflow:hidden}
.cutbody{position:absolute;inset:0}

/* ---- MISREGISTRATION -----------------------------------------------------
   The one "effect" in the film, and it is a real press artifact: the spot plate lands
   a hair off the black one. Carried as a TEXT-SHADOW on the headline itself, never as
   a duplicated element — a second copy of the words in the same place is two text
   blocks the layout gate is right to reject, and it doubles what a contrast checker
   has to reason about. One impression, one fringe. */

/* ---- THE STAMP ---------------------------------------------------------- */
/* on the black plate the stamp turns CREAM: red type on plate measures 3.20:1 and
   this register does not put red type on black. */
.stampw{border-color:var(--scrap)!important;color:var(--scrap)!important}
.stamp{position:absolute;border:4px solid var(--stop);color:var(--stopt);
  font-family:"Archivo",sans-serif;font-weight:800;letter-spacing:.10em;
  text-transform:uppercase;opacity:.88;display:flex;align-items:center;
  justify-content:center;white-space:nowrap}

/* ---- THE PEN: red strokes drawn on the page. Never a glyph. -------------- */
/* z-index 5 is load-bearing: a cutting is z-index 2, so a pen with auto z-index
   draws UNDERNEATH the very thing it is marking and is invisible in the render. */
.pen{position:absolute;left:0;top:0;width:1920px;height:1080px;pointer-events:none;overflow:visible;z-index:5}
.pen path,.pen line,.pen polyline{fill:none;stroke:var(--stop);stroke-linecap:round;
  stroke-linejoin:round}
.penk path,.penk line,.penk polyline{stroke:var(--ink)}
.penw path,.penw line,.penw polyline{stroke:var(--scrap)}
`;

/* ---------- deterministic imperfection --------------------------------------
   Nothing in this register is square. Every rotation, tear and wobble is derived
   from an integer seed at BUILD time, so the render stays frame-pure. */
export const rnd = (s) => { const x = Math.sin(s * 127.1 + 11.7) * 43758.5453; return x - Math.floor(x); };
/** stable signed unit in [-1,1] */
export const sn = (s) => rnd(s) * 2 - 1;
/** the resting angle of a cutting, in degrees */
export const tilt = (i, amp = 1.9) => (sn(i) * amp).toFixed(2);

/* ---------- ON THREES -------------------------------------------------------
   A cutting is PUT DOWN, not tweened: three positions and it is on the page.
   Stepping is what makes it read as a hand. The SEAMS are never stepped — a
   velocity-matched power4 cut rendered on threes reads as a dropped frame. */
export const SLAP_STEPS = 3;
export const SLAP_DUR = 0.16;
export const st = (n) => `steps(${n})`;                 // GSAP: string form is correct
/** marks are drawn at 15fps inside a 30fps render — one new position every 2 frames */
export const stDrawn = (dur) => `steps(${Math.max(2, Math.round(dur * 15))})`;
/** ANIME.JS: v4 removed the string form of steps. It warns to the console and then
    silently falls back to the default ease, so a stepped anime tween runs smooth.
    `steps` is a TOP-LEVEL export (anime.steps), not anime.eases.steps. */
export const stA = (n) => `anime.steps(${Math.max(2, Math.round(n))})`;
export const stADrawn = (dur) => stA(Math.max(2, Math.round(dur * 15)));

/* ---------- THE TEAR --------------------------------------------------------
   A clip-path polygon walked around the perimeter. `torn` uses many points and a
   big amplitude (impatience — anything the film argues with); `cut` uses few points
   and a small one (scissors — anything the film cites with respect). */
export const edge = (w, h, seed = 1, kind = "cut") => {
  const torn = kind === "torn";
  const amp = torn ? 7 : 2.6;
  const step = torn ? 26 : 74;
  const pts = [];
  let k = seed * 13.7;
  const push = (x, y) => pts.push(`${x.toFixed(1)}px ${y.toFixed(1)}px`);
  const jit = (a) => sn(k += 1.37) * a + (torn ? sn(k += 0.61) * a * 0.42 : 0);
  const side = (x0, y0, x1, y1) => {
    const L = Math.hypot(x1 - x0, y1 - y0), n = Math.max(2, Math.round(L / step));
    const nx = (y1 - y0) / L, ny = -(x1 - x0) / L;            // inward-ish normal
    for (let i = 0; i < n; i++) {
      const t = i / n, j = jit(amp);
      push(x0 + (x1 - x0) * t + nx * j, y0 + (y1 - y0) * t + ny * j);
    }
  };
  side(0, 0, w, 0); side(w, 0, w, h); side(w, h, 0, h); side(0, h, 0, 0);
  return `polygon(${pts.join(",")})`;
};

/* ---------- A CUTTING -------------------------------------------------------
   Emits the four layers. `rot` is the RESTING angle; the slap supplies the rest. */
export const cutting = (id, o) => {
  const { x, y, w, h, seed = 1, kind = "cut", rot = null, bg = "var(--scrap)", body = "", pad = 0, z = 2 } = o;
  const r = rot === null ? tilt(seed) : rot;
  const cp  = edge(w, h, seed, kind);
  const cpf = edge(w + 5, h + 5, seed + 0.5, kind);          // the fibre lip, a touch proud
  return `
      <div id="${id}" class="cutw" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;z-index:${z};transform:rotate(${r}deg)">
        <div id="${id}-sh"  class="cutsh"  style="clip-path:${cp}"></div>
        <div id="${id}-fib" class="cutfib" style="left:-2.5px;top:-2.5px;right:-2.5px;bottom:-2.5px;clip-path:${cpf}"></div>
        <div id="${id}-fc"  class="cutface" style="background:${bg};clip-path:${cp}">
          <div class="cutbody" style="padding:${pad}px">${body}</div>
        </div>
      </div>`;
};
/** the resting angle a cutting was emitted with — the slap has to tween back TO it */
export const restRot = (seed, rot = null) => (rot === null ? +tilt(seed) : rot);

/* ---------- THE SLAP — the film's signature move ----------------------------
   from scale 1.13 / rot ±(7..12)deg / y -34, in three steps, at FULL opacity. A
   cutting that fades up is a cutting that is not there yet, and the seam gate
   measures motion rather than visibility: a frame can enter blank and still pass.
   The shadow lands ONE FRAME (1/30s) late — paper hits the page, then settles. */
export const slapIn = (id, t, seed = 1, rot = null) => {
  const r = restRot(seed, rot);
  const from = (r + (sn(seed * 3.1) > 0 ? 1 : -1) * (7 + rnd(seed * 5.7) * 5)).toFixed(2);
  const D = SLAP_DUR, S = st(SLAP_STEPS);
  return (
    `\n      gsap.set("#${id}", { rotation: ${from}, scale: 1.13, y: -34 });` +
    `\n      tl.fromTo("#${id}", { rotation: ${from}, scale: 1.13, y: -34 },` +
    ` { rotation: ${r}, scale: 1, y: 0, duration: ${D}, ease: "${S}" }, ${t.toFixed(2)});` +
    `\n      gsap.set("#${id}-sh", { y: 9, scale: 1.07 });` +
    `\n      tl.fromTo("#${id}-sh", { y: 9, scale: 1.07 }, { y: 4, scale: 1, duration: ${D}, ease: "${S}" }, ${(t + 1 / 30).toFixed(3)});`
  );
};
/** a cutting already on the page at t=0 (a seam carrier) still needs its shadow set */
export const restShadow = (id) => `\n      gsap.set("#${id}-sh", { y: 4 });`;

/** lift a cutting off the page again — used when the film replaces one with another */
export const slapOut = (id, t, seed = 1) =>
  `\n      tl.to("#${id}", { y: -26, scale: 1.09, autoAlpha: 0, duration: 0.13, ease: "${st(2)}" }, ${t.toFixed(2)});` +
  `\n      tl.to("#${id}-sh", { autoAlpha: 0, duration: 0.13, ease: "${st(2)}" }, ${t.toFixed(2)});`;

/* ---------- THE STAMP ------------------------------------------------------- */
export const stamp = (id, text, o) => {
  const { x, y, w, h = 62, seed = 1, size = 26, z = 6, dark = false } = o;
  const r = (sn(seed * 7.3) * 5 + (sn(seed) > 0 ? 5.5 : -5.5)).toFixed(2);
  return `<div id="${id}" class="stamp${dark ? " stampw" : ""}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;font-size:${size}px;transform:rotate(${r}deg);z-index:${z}">${text}</div>`;
};
export const stampIn = (id, t, seed = 1) => {
  const r = (sn(seed * 7.3) * 5 + (sn(seed) > 0 ? 5.5 : -5.5)).toFixed(2);
  return `\n      gsap.set("#${id}", { rotation: ${r}, scale: 1.30, autoAlpha: 0 });` +
    `\n      tl.fromTo("#${id}", { rotation: ${r}, scale: 1.30, autoAlpha: 0 },` +
    ` { rotation: ${r}, scale: 1, autoAlpha: 0.88, duration: 0.10, ease: "${st(2)}" }, ${t.toFixed(2)});`;
};

/* ---------- FIELDS: one dominant brightness per act ------------------------- */
export const FIELDS = { news: "var(--news)", news2: "var(--news2)", plate: "var(--plate)", stop: "var(--stop)" };
export const isDark = (n) => n === "plate" || n === "stop";
/** the page: field + halftone + press grain. Dark fields get a much lighter screen. */
export const page = (name) => {
  const dark = isDark(name);
  return `<div class="field" data-layout-allow-overflow style="background:${FIELDS[name]}"></div>` +
    `<div class="screen" data-layout-allow-overflow ${dark ? ' style="background-image:radial-gradient(circle at 1px 1px, rgba(242,237,225,.10) 0.85px, transparent 0.9px)"' : ""}></div>` +
    `<div class="grain" data-layout-allow-overflow></div>`;
};

/* ---------- ANIME.JS, DRIVEN BY GSAP ---------------------------------------
   anime computes every value; GSAP is only the clock. See the header note for why
   window.__hfAnime cannot be used from inside a frame sub-composition. */
export const drive = (v, at, dur) =>
  `\n      var P_${v} = { p: 0 };` +
  `\n      tl.to(P_${v}, { p: 1, duration: ${dur.toFixed(2)}, ease: "none",` +
  ` onUpdate: function () { ${v}.seek(P_${v}.p * ${v}.duration); } }, ${at.toFixed(2)});`;

/** a red pen stroke, drawn. anime.svg.createDrawable computes the path length itself —
    which is precisely the number that gets estimated wrong by hand. */
export const penSvg = (id, d, w = 5, cls = "") =>
  `<svg id="${id}-svg" class="pen ${cls}" viewBox="0 0 1920 1080"><path id="${id}" d="${d}" stroke-width="${w}"/></svg>`;

export const penDraw = (id, at, dur = 0.55) => {
  const v = `pen_${id.replace(/\W/g, "")}`;
  return `\n      var ${v}_d = anime.svg.createDrawable("#${id}");` +
    `\n      var ${v} = anime.animate(${v}_d, { draw: ["0 0", "0 1"], duration: ${Math.round(dur * 1000)},` +
    ` ease: ${stADrawn(dur)}, autoplay: false });` + drive(v, at, dur);
};

/* ---------- PEN GEOMETRY ----------------------------------------------------
   THE RULE: a pen mark attaches to a BOX, never to a phrase inside a paragraph.
   Underlining "as close as possible" by estimating where it falls inside a wrapped
   line is the defect EP27 shipped ten times over — the geometry is guessed against
   font metrics that were never measured, and no gate looks at it. When a phrase
   needs a mark, promote the phrase to its own positioned element first, so its x, y
   and width are numbers this file already knows.
   --- ------------------------------------------------- */
/** a hand-drawn ellipse: -0.10 to 1.07 turns, so it leaves a gap and an overshoot */
export const ellipseD = (cx, cy, rx, ry, seed = 1) => {
  const A0 = -0.10 * Math.PI * 2, A1 = 1.07 * Math.PI * 2, N = 100, p = [];
  for (let i = 0; i <= N; i++) {
    const a = A0 + (A1 - A0) * (i / N);
    const k = 1 + 0.038 * Math.sin(a * 3 + seed * 2.3) + 0.019 * Math.sin(a * 5 + seed);
    p.push(`${(cx + Math.cos(a) * rx * k).toFixed(1)},${(cy + Math.sin(a) * ry * k).toFixed(1)}`);
  }
  return "M" + p.join(" L");
};
export const underlineD = (x, y, w, seed = 1) =>
  `M${x},${y} Q${(x + w * 0.45).toFixed(1)},${(y + 3 + rnd(seed) * 4).toFixed(1)} ${x + w},${(y - 1.5).toFixed(1)}`;
export const arrowD = (x1, y1, x2, y2, bow = 26) => {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
  const cx = mx + (-dy / L) * bow, cy = my + (dx / L) * bow;
  const ax = Math.atan2(y2 - cy, x2 - cx), h = 22;
  const a = (o) => [(x2 - Math.cos(ax + o) * h).toFixed(1), (y2 - Math.sin(ax + o) * h).toFixed(1)];
  const [h1x, h1y] = a(-0.42), [h2x, h2y] = a(0.42);
  return `M${x1},${y1} Q${cx.toFixed(1)},${cy.toFixed(1)} ${x2},${y2} M${h1x},${h1y} L${x2},${y2} L${h2x},${h2y}`;
};
export const strikeD = (x, y, w, seed = 1) =>
  `M${x},${(y + sn(seed) * 2).toFixed(1)} Q${(x + w * 0.5).toFixed(1)},${(y + 2 + sn(seed + 1) * 3).toFixed(1)} ${x + w},${(y + sn(seed + 2) * 2).toFixed(1)}`;
export const crossD = (cx, cy, r, seed = 1) => {
  let k = seed; const j = () => (sn(k += 1.1) * 2.6);
  return `M${(cx - r + j()).toFixed(1)},${(cy - r + j()).toFixed(1)} L${(cx + r + j()).toFixed(1)},${(cy + r + j()).toFixed(1)}` +
    ` M${(cx + r + j()).toFixed(1)},${(cy - r + j()).toFixed(1)} L${(cx - r + j()).toFixed(1)},${(cy + r + j()).toFixed(1)}`;
};
/** a hand-drawn box round a KNOWN element — starts short, overshoots the corner it
    started from, and wobbles off a seeded sine. The honest way to mark a row. */
export const boxD = (x, y, w, h, seed = 1) => {
  let k = seed * 4.1; const j = (a = 3) => sn(k += 1.19) * a;
  const x0 = x + j(), y0 = y + j(), x1 = x + w + j(), y1 = y + h + j();
  return `M${(x0 + 24).toFixed(1)},${y0.toFixed(1)} L${x1.toFixed(1)},${(y0 + j(2)).toFixed(1)}` +
    ` L${(x1 + j(2)).toFixed(1)},${y1.toFixed(1)} L${x0.toFixed(1)},${(y1 + j(2)).toFixed(1)}` +
    ` L${(x0 + j(2)).toFixed(1)},${(y0 - j(2)).toFixed(1)} L${(x0 + 62).toFixed(1)},${(y0 - 5 + j(2)).toFixed(1)}`;
};

export const tickD = (cx, cy, r) =>
  `M${cx - r},${cy} L${(cx - r * 0.25).toFixed(1)},${(cy + r * 0.72).toFixed(1)} L${(cx + r * 1.05).toFixed(1)},${(cy - r * 0.95).toFixed(1)}`;
export const bracketD = (x, yTop, yBot, w = 22, dir = 1) =>
  `M${x + w * dir},${yTop} L${x},${yTop} L${x},${yBot} L${x + w * dir},${yBot}`;

/* ---------- SEEK-SAFE READOUTS ---------------------------------------------
   A tween on text content is a no-op (no TextPlugin) and tl.call is not reliably
   seekable, so a changing figure is a STACK of spans toggled with zero-duration set. */
export const readout = (id, values, style = "", cls = "") =>
  `<div id="${id}" style="position:relative;${style}">` +
  values.map((v, i) => `<span id="${id}-${i}" class="${cls}" style="position:absolute;left:0;top:0;white-space:nowrap">${v}</span>`).join("") +
  `</div>`;

export const readoutIn = (id, n, t0, dt) => {
  const k = id.replace(/\W/g, "");
  let s = `\n      for (var _r${k} = 1; _r${k} < ${n}; _r${k}++) gsap.set("#${id}-" + _r${k}, { autoAlpha: 0 });`;
  for (let i = 1; i < n; i++) {
    const t = (t0 + (i - 1) * dt).toFixed(2);
    s += `\n      tl.set("#${id}-${i}", { autoAlpha: 1 }, ${t});`;
    s += `\n      tl.set("#${id}-${i - 1}", { autoAlpha: 0 }, ${t});`;
  }
  return s;
};

/* ---------- SEAMS -----------------------------------------------------------
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
  `      // SEAM ENTRY — ACT BREAK lift. The page is turned up and over.
      tl.fromTo("${sel}", { y: 372 }, { y: 0, duration: 0.62, ease: "power4.out" }, 0);
      tl.fromTo("${sel}", { scale: 0.86 }, { scale: 1, duration: 0.78, ease: "power2.out" }, 0);`;
export const exitLift = (sel, at) =>
  `      // SEAM EXIT — ACT BREAK lift. Travels UP and pulls back to 0.86.
      tl.to("${sel}", { y: -300, duration: 0.46, ease: "power4.in" }, ${at.toFixed(2)});
      tl.to("${sel}", { scale: 0.86, duration: 0.52, ease: "power2.in" }, ${at.toFixed(2)});`;

/** Z-BACK — the ARRIVAL vector. Reserved; spent ONCE in this film: indist -> ed2026. */
export const exitZBack = (sel, at) =>
  `      // SEAM EXIT — Z-BACK. Recedes 1.0 -> 0.60. The field over-scans, or this
      // shows the stage edge for the length of the cut.
      tl.to("${sel}", { scale: 0.60, duration: 0.52, ease: "power4.in" }, ${at.toFixed(2)});`;
export const enterZBack = (sel = "#stage") =>
  `      // SEAM ENTRY — Z-BACK continued: enters ABOVE 1.0 and settles DOWN to it, so
      // both halves share the SIGN of the scale velocity. Mirroring reads as a bounce.
      tl.fromTo("${sel}", { scale: 1.48 }, { scale: 1, duration: 0.62, ease: "power4.out" }, 0);`;

export const ENTER = { across: enterAcross, lift: enterLift, zback: enterZBack };
export const EXITF = { across: exitAcross, lift: exitLift, zback: exitZBack };

/* ---------- THE HEADER BLOCK — newspaper page furniture ---------------------
   A kicker in red small caps, a red rule, an Anton head, a PT Serif deck. The head
   carries a misregistered spot-plate ghost 3px off, which is the register's only
   texture and is never the only copy of the words. */
export const header = (kicker, head, deck, dark = false, headSize = 92, deckW = 900) => {
  const lines = head.split(/<br\s*\/?>/i).length;
  const deckTop = 186 + lines * (headSize * 0.90) + 34;
  const kc = dark ? "#E88F92" : "var(--stopt)";
  return `
      <div id="s-kick" class="slug" style="position:absolute;left:120px;top:110px;color:${kc}">${kicker}</div>
      <div id="s-rule" class="rrule" style="left:120px;top:146px;width:132px;transform-origin:0% 50%"></div>
      <div id="s-head" class="head" style="position:absolute;left:120px;top:186px;width:1300px;font-size:${headSize}px;z-index:1;text-shadow:3px 2px 0 rgba(193,39,45,.42)${dark ? ";color:var(--scrap)" : ""}">${head}</div>
      ${deck ? `<div id="s-deck" class="body" style="position:absolute;left:122px;top:${deckTop}px;width:${deckW}px;font-size:31px${dark ? ";color:#A79E8D" : ""}">${deck}</div>` : ""}`;
};

export const headerIn = (t = 0.10, hasDeck = true) => `
      // SEAM CARRIER — the kicker and the headline are at FULL opacity from frame zero
      // and ride the cut in on the stage. They are never faded up.
      tl.fromTo("#s-rule", { scaleX: 0 }, { scaleX: 1, duration: 0.42, ease: "power3.out" }, ${(t + 0.04).toFixed(2)});
      tl.fromTo("#s-head", { y: 15 }, { y: 0, duration: 0.50, ease: "power3.out" }, 0);${hasDeck ? `
      tl.fromTo("#s-deck", { autoAlpha: 0, y: 17 }, { autoAlpha: 1, y: 0, duration: 0.50, ease: "power3.out" }, ${(t + 0.20).toFixed(2)});` : ""}`;

/* ---------- THE WRAP ---------------------------------------------------------
   `transparent` is REQUIRED for any overlay mounted on a track ABOVE the frames:
   #root carries an opaque --news background, so an overlay that keeps it paints over
   the entire film — and lint, layout, motion and contrast all still pass. */
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

/* ---------- THE TYPEWRITER --------------------------------------------------
   anime.text.splitText + a stagger, driven by GSAP. This is the second job anime.js
   genuinely wins: a 300-character block is ONE instance here and three hundred
   zero-duration tl.set calls otherwise. Whitespace is preserved by the wrapper's
   white-space:pre — splitText keeps the text nodes it does not wrap. */
export const typeOn = (id, at, dur, cps = 58, chars = 0) => {
  const v = `ty_${id.replace(/\W/g, "")}`;
  const step = Math.max(6, Math.round(1000 / cps));
  const total = chars ? chars * step + 40 : Math.round(dur * 1000);
  return `\n      var ${v}_s = anime.text.splitText("#${id}", { chars: { wrap: false } });` +
    `\n      var ${v} = anime.animate(${v}_s.chars, { opacity: [0, 1], duration: 1,` +
    ` ease: "linear", autoplay: false, delay: anime.stagger(${step}) });` +
    `\n      gsap.set("#${id}", { autoAlpha: 1 });` + drive(v, at, Math.max(dur, total / 1000));
};

/** the caret that follows a type-on: a solid block that steps along, then stops */
export const caret = (id, x, y, w = 15, h = 30) =>
  `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:var(--ink)"></div>`;

/* ---------- A TEAR ON AN ELEMENT OF UNKNOWN SIZE ---------------------------
   The ransom letters are laid out by the browser (a flex row), so their pixel sizes
   are not known at build time. Percentage polygons clip correctly at any size. */
export const edgePct = (seed = 1, kind = "cut") => {
  const torn = kind === "torn";
  const amp = torn ? 6 : 2.4, n = torn ? 5 : 3;
  let k = seed * 9.13;
  const j = () => sn(k += 1.29) * amp;
  const pts = [];
  const side = (x0, y0, x1, y1) => {
    for (let i = 0; i < n; i++) {
      const t = i / n;
      pts.push(`${(x0 + (x1 - x0) * t + j()).toFixed(1)}% ${(y0 + (y1 - y0) * t + j()).toFixed(1)}%`);
    }
  };
  side(0, 0, 100, 0); side(100, 0, 100, 100); side(100, 100, 0, 100); side(0, 100, 0, 0);
  return `polygon(${pts.join(",")})`;
};

/* ---------- THE RANSOM HEADLINE — the register's signature image ------------
   Every LETTER is its own cutting: its own typeface, its own paper, its own angle,
   its own tear. Laid out as a flex row so the browser owns the widths, and animated
   on transform only. Two letters may share a family only by seeded accident, which
   is what a real ransom note looks like. */
// SINGLE quotes, always. A double-quoted family name inside a style="..." attribute
// closes the attribute, and every declaration after font-family is silently dropped —
// which cost this film its entire ransom headline on the first render.
const RANSOM_FAMS = [
  ["'Anton',sans-serif", 400, "1.00em"],
  ["'Oswald',sans-serif", 700, "0.98em"],
  ["'Playfair',Georgia,serif", 900, "0.96em"],
  ["'Bodoni',serif", 900, "1.04em"],
  ["'Courier',monospace", 700, "0.88em"],
  ["'PTSerif',Georgia,serif", 700, "0.94em"],
];
const RANSOM_PAPERS = [
  ["var(--scrap)", "var(--ink)"], ["var(--news)", "var(--ink)"],
  ["var(--news2)", "var(--ink)"], ["var(--ink)", "var(--scrap)"],
  ["var(--scrap)", "var(--stopt)"], ["var(--news)", "var(--ink2)"],
];
export const ransom = (id, text, o = {}) => {
  const { x, y, size = 150, seed = 1, gap = 7, w = null } = o;
  let k = seed * 3.7, n = 0;
  const kids = [...text].map((ch) => {
    if (ch === " ") return `<span style="display:inline-block;width:${(size * 0.26).toFixed(0)}px"></span>`;
    const s = seed * 100 + n;
    const [fam, wt, sz] = RANSOM_FAMS[Math.floor(rnd(s * 1.7) * RANSOM_FAMS.length)];
    const [bg, fg] = RANSOM_PAPERS[Math.floor(rnd(s * 2.3) * RANSOM_PAPERS.length)];
    const rot = (sn(s * 5.1) * 5.4).toFixed(2);
    const kind = rnd(s * 4.4) > 0.55 ? "torn" : "cut";
    const padx = (5 + rnd(s * 6.2) * 8).toFixed(0), pady = (3 + rnd(s * 7.9) * 7).toFixed(0);
    const dy = (sn(s * 8.8) * size * 0.045).toFixed(1);
    n++;
    return `<span class="rl" id="${id}-l${n - 1}" style="display:inline-block;` +
      `font-family:${fam};font-weight:${wt};font-size:${sz};line-height:1;` +
      `background:${bg};color:${fg};padding:${pady}px ${padx}px;margin:0 ${gap}px;` +
      `clip-path:${edgePct(s, kind)};transform:rotate(${rot}deg) translateY(${dy}px)">${ch}</span>`;
  });
  return {
    n,
    html: `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;${w ? `width:${w}px;` : ""}` +
      `font-size:${size}px;display:flex;flex-wrap:wrap;align-items:center;z-index:3">${kids.join("")}</div>`,
  };
};

/** the letters are SLAPPED on, one after another, by anime.js. Seeded scatter only —
    anime.utils.random is NOT seeded and would break frame purity. */
export const ransomIn = (id, n, at, per = 62, seed = 1) => {
  const v = `rn_${id.replace(/\W/g, "")}`;
  const dur = 150;
  return `\n      var ${v}_r = anime.createSeededRandom(${Math.round(seed * 977)});` +
    `\n      var ${v}_e = [];` +
    `\n      for (var i_${v} = 0; i_${v} < ${n}; i_${v}++) ${v}_e.push(document.getElementById("${id}-l" + i_${v}));` +
    `\n      var ${v} = anime.animate(${v}_e.filter(Boolean), {` +
    `\n        scale: [function () { return 1.5 + 0.7 * ${v}_r(); }, 1],` +
    `\n        y: [function () { return -70 - 90 * ${v}_r(); }, 0],` +
    `\n        opacity: [0, 1],` +
    `\n        duration: ${dur}, ease: anime.steps(3), autoplay: false,` +
    `\n        delay: anime.stagger(${per}) });` +
    drive(v, at, (n * per + dur) / 1000);
};

/* ---------- A COLUMN — the page furniture that makes a page a PAGE -----------
   Newsprint is columns. Every frame carries one of real source text at reading size:
   legible if you pause, texture at speed. It is never greeked — the words are always
   the actual document the frame is arguing about. */
export const column = (id, o) => {
  const { x, y, w, h, head = "", text = "", size = 15.5, cols = 1, dark = false, z = 1 } = o;
  const c = dark ? "#8E8677" : "var(--ink2)";
  return `
      <div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;overflow:hidden;z-index:${z}">
        ${head ? `<div class="slug" style="font-size:13px;letter-spacing:.20em;color:${c}">${head}</div>
        <div class="hair" style="position:relative;margin-top:7px;width:${w}px"></div>` : ""}
        <div class="body" style="margin-top:9px;font-size:${size}px;line-height:1.44;text-align:justify;
          color:${c};column-count:${cols};column-gap:26px;column-rule:1px solid rgba(78,70,56,.35)">${text}</div>
      </div>`;
};
