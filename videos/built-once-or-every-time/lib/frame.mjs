// EP29 shared frame scaffold — THE PROOF SHEET.
//
// Asset paths are HOST-relative (frames are cloned into the root index.html),
// so "assets/..." — never "../assets/...".
//
// THE CORE SPLIT, and it governs every helper below:
//   THE SHEET     the cream ground. Full-bleed, no edges. Moves only on a seam.
//   A WELL        a dark print pull-quote holding REAL BYTES. Colour-blocks in, types.
//   A PLATE       a real screenshot from the real web. Rises out of a well.
//   A STAMP       the one decided thing. Orange, radius-full, lands once per frame.
//
// THE COLOUR LAW (measured, see DESIGN.md): --primary #ea2804 is 4.09:1 on cream and
// therefore CANNOT be a word. It fills, bands and rules. --primary-deep #c01f00 is
// 5.71:1 and is the only orange allowed to be type. Same shape as the forest/emerald
// split in the instrument register and clay/glass before it: the fill colour and the
// type colour are two different values.
//
// THE TWO RUNTIMES. GSAP owns the spine and every seam. Anime.js owns splitText,
// createDrawable and grid-stagger — but it is DRIVEN BY GSAP, never registered on
// window.__hfAnime. Verified by render on EP28: the HyperFrames animejs adapter reads
// its registry at composition init, before a frame sub-composition's script has run,
// so an instance registered from inside a frame is never discovered — and even when it
// is discovered it receives GLOBAL time while GSAP receives frame-LOCAL time. Both
// failures are silent. `drive()` below is the fix.

export const STYLE = `
@font-face{font-family:'Bric';src:url('assets/fonts/Bricolage-800.woff2') format('woff2');font-weight:800;font-display:block}
@font-face{font-family:'BricM';src:url('assets/fonts/Bricolage-600.woff2') format('woff2');font-weight:600;font-display:block}
@font-face{font-family:'Inter';src:url('assets/fonts/Inter-400.woff2') format('woff2');font-weight:400;font-display:block}
@font-face{font-family:'InterS';src:url('assets/fonts/Inter-600.woff2') format('woff2');font-weight:600;font-display:block}
@font-face{font-family:'Mono';src:url('assets/fonts/Mono-400.woff2') format('woff2');font-weight:400;font-display:block}
@font-face{font-family:'MonoB';src:url('assets/fonts/Mono-700.woff2') format('woff2');font-weight:700;font-display:block}
@font-face{font-family:'Instr';src:url('assets/fonts/Instrument-400i.woff2') format('woff2');font-style:italic;font-display:block}

:root{
  --canvas:#f9f7f3; --bone:#f3f0e8; --card:#ffffff; --dark:#202020; --deep:#000000;
  --ink:#202020; --body:#3a3a3a; --charcoal:#575757; --mute:#646464;
  --ash:#8d8d8d; --stone:#bbbbbb; --on-dark:#fcfcfc;
  --primary:#ea2804; --primary-deep:#c01f00; --glow:#ff6a3d; --pink:#f4a8a0;
  --success:#2b9a66; --hair:rgba(32,32,32,0.12);
}
*{margin:0;padding:0;box-sizing:border-box}
#root{position:relative;width:1920px;height:1080px;overflow:hidden;background:var(--canvas);
  -webkit-font-smoothing:antialiased}

/* THE SHEET. Over-scanned by 18% so the Z-BACK never shows the stage edge; the
   overflow is declared, not accidental. */
.field{position:absolute;inset:-18%}
.stage{position:absolute;inset:0}
.inner{position:absolute;inset:0}

/* ---- TYPE — three lanes, one accent. Tracking is EXPLICIT at every size because
   the substitutes track looser than the licensed faces they stand in for. ---- */
.disp{font-family:'Bric',system-ui,sans-serif;font-weight:800;line-height:1.0;
  letter-spacing:-0.028em;color:var(--ink)}
.dispm{font-family:'BricM',system-ui,sans-serif;font-weight:600;line-height:1.06;
  letter-spacing:-0.018em;color:var(--ink)}
.body{font-family:'Inter',system-ui,sans-serif;font-weight:400;line-height:1.5;
  color:var(--body);letter-spacing:0}
.bodys{font-family:'InterS',system-ui,sans-serif;font-weight:600;line-height:1.4;
  color:var(--ink);letter-spacing:-0.006em}
.mono{font-family:'Mono',ui-monospace,monospace;font-weight:400;
  font-variant-numeric:tabular-nums;letter-spacing:0;color:var(--ink)}
.monob{font-family:'MonoB',ui-monospace,monospace;font-weight:700;
  font-variant-numeric:tabular-nums;letter-spacing:0;color:var(--ink)}
.acc{font-family:'Instr',Georgia,serif;font-style:italic;letter-spacing:-0.01em}
/* the SLUG: Replicate's small metadata lane. Never orange — 4.09:1 fails at this size. */
.slug{font-family:'MonoB',ui-monospace,monospace;font-weight:700;font-size:21px;
  letter-spacing:0.16em;text-transform:uppercase;color:var(--charcoal)}

/* ---- A WELL — a dark print pull-quote. Elevation is COLOUR-BLOCKING: no shadow on
   cream, ever, and never a coloured edge. One black, one hairline, and the bytes
   tell the wells apart. ---- */
.well{position:absolute;background:var(--dark);border-radius:10px;overflow:hidden}
.welltab{position:absolute;left:0;top:0;height:44px;width:100%;background:var(--deep);
  display:flex;align-items:center;gap:26px;padding:0 20px}
.tab{font-family:'Mono',ui-monospace,monospace;font-size:17px;color:rgba(252,252,252,.72);
  letter-spacing:0.04em;padding:0 2px;height:44px;line-height:44px}
.tab.on{color:var(--on-dark);box-shadow:inset 0 -2px 0 0 var(--primary)}
.wellbody{position:absolute;left:26px;right:22px;font-family:'Mono',ui-monospace,monospace;
  font-size:24px;line-height:1.62;color:var(--on-dark);white-space:pre;
  font-variant-numeric:tabular-nums}
.cmt{color:var(--ash)}
.dim{color:var(--stone)}
.hot{color:var(--glow)}
.tag{color:#8FD6FF}
.att{color:#F5C77E}

/* ---- A PLATE — the one element in the film that is photography.
   The system allows exactly one soft drop shadow here, and it COST TWO RENDERS: a
   24px-blur box-shadow on an element being scaled and translated forces the compositor
   to re-raster the whole blurred layer every single frame, and capture died at frame
   750 of 6222 — inside the one frame that carries two of them — twice, once on protocol
   timeout and once with the Chrome process gone (write EPIPE). A 1px hairline reads as
   printed rather than floating, which is more on-register anyway, and it costs nothing.
   Replicate's own rule is that elevation is colour-blocking, not shadow. ---- */
.plate{position:absolute;background:var(--card);border-radius:10px;overflow:hidden;
  border:1px solid var(--hair)}
.plate img{display:block;width:100%;height:auto}
.platecap{position:absolute;font-family:'Mono',ui-monospace,monospace;font-size:18px;
  color:var(--charcoal);letter-spacing:0.03em}

/* ---- RADIUS FULL on everything interactive-looking. There are no sharp corners on
   this sheet outside a full-bleed band. ---- */
.pill{position:absolute;display:inline-flex;align-items:center;gap:12px;height:46px;
  padding:0 22px;border-radius:9999px;border:1px solid var(--hair);background:var(--card);
  font-family:'MonoB',ui-monospace,monospace;font-size:20px;color:var(--ink);
  font-variant-numeric:tabular-nums;white-space:nowrap}
.pill.dark{background:var(--dark);border-color:rgba(252,252,252,.16);color:var(--on-dark)}
.stamp{position:absolute;display:inline-flex;align-items:center;height:52px;padding:0 26px;
  border-radius:9999px;background:var(--primary);color:#ffffff;
  font-family:'Bric',system-ui,sans-serif;font-weight:800;font-size:26px;
  letter-spacing:0.02em;white-space:nowrap}

/* rules: the hairline replaces shadow on cream. The HEADER rule is --ink, not orange:
   a 4px orange bar on every one of nineteen frames would spend the one-orange-per-frame
   budget before the frame had said anything. Replicate's own hairline-strong IS #202020,
   so this is the system's own token, not a substitution. --primary is kept for the four
   places it earns: the hero band, the active code-tab underline inside a dark well, a
   bar FILL, and the single stamp on the cream sheet. */
.hair{position:absolute;height:1px;background:var(--hair)}
.hairD{position:absolute;height:1px;background:rgba(252,252,252,.18)}
.krule{position:absolute;height:4px;background:var(--ink);border-radius:2px}
.krule.dk{background:var(--on-dark)}
.orule{position:absolute;height:4px;background:var(--primary);border-radius:2px}

/* the byte bar — a fill, so --primary is correct here */
.barbg{position:absolute;height:18px;border-radius:9999px;background:rgba(32,32,32,.10)}
.barbg.on-dark{background:rgba(252,252,252,.14)}
.barfg{position:absolute;height:18px;border-radius:9999px;background:var(--primary);
  transform-origin:0% 50%}
.barfg.ink{background:var(--ink)}
.barfg.dark{background:var(--on-dark)}

/* the two clocks */
.clock{position:absolute;right:112px;top:112px;text-align:right}
.clockk{font-family:'MonoB',ui-monospace,monospace;font-size:17px;letter-spacing:0.18em;
  text-transform:uppercase;color:var(--mute)}
.clockv{font-family:'Mono',ui-monospace,monospace;font-size:27px;color:var(--ink);
  font-variant-numeric:tabular-nums;margin-top:5px}

/* the ORANGE HERO BAND — Replicate's atmospheric mesh, hero band only.
   MEASURED, and it writes the layout: white on --primary is 4.37:1 (AA-large), on
   --hero-glow 2.85 and on --hero-pink 1.92 — both of which FAIL even for display type.
   So the light pools are pushed into the right third, where nothing is ever set, and
   the left 60% runs #a81a00 -> #ea2804, which holds white at 4.37:1 or better all the
   way across. Every word on a hero frame lives in that left band. */
.hero{position:absolute;inset:0;background:
  radial-gradient(58% 54% at 90% 84%, rgba(244,168,160,.92) 0%, rgba(244,168,160,0) 62%),
  radial-gradient(52% 58% at 94% 18%, rgba(255,138,92,.88) 0%, rgba(255,138,92,0) 60%),
  radial-gradient(46% 44% at 74% 52%, rgba(255,106,61,.55) 0%, rgba(255,106,61,0) 66%),
  linear-gradient(102deg, #a81a00 0%, #c01f00 30%, #de2504 62%, #ea2804 100%)}

svg.pen{position:absolute;left:0;top:0;width:1920px;height:1080px;pointer-events:none;z-index:5}
svg.pen path{fill:none;stroke:var(--primary);stroke-linecap:round;stroke-linejoin:round}
svg.pen path.ink{stroke:var(--ink)}
svg.pen path.dk{stroke:var(--on-dark)}
`;

/* ---------- deterministic noise --------------------------------------------- */
export const rnd = (s) => { const x = Math.sin(s * 127.1 + 11.7) * 43758.5453; return x - Math.floor(x); };
export const sn = (s) => rnd(s) * 2 - 1;

/* ---------- eases ------------------------------------------------------------ */
export const st = (n) => `steps(${n})`;                 // GSAP: the string form is correct
/** ANIME.JS v4 removed the string form of steps. It warns to the console and then
    silently falls back to the default ease, so every stepped move tweens smoothly.
    `steps` is a TOP-LEVEL export — not anime.eases.steps. */
export const stA = (n) => `anime.steps(${Math.max(2, Math.round(n))})`;
export const stADrawn = (dur) => stA(Math.max(2, Math.round(dur * 15)));

/* ---------- ANIME.JS, DRIVEN BY GSAP ---------------------------------------- */
export const drive = (v, at, dur) =>
  `\n      var P_${v} = { p: 0 };` +
  `\n      tl.to(P_${v}, { p: 1, duration: ${dur.toFixed(2)}, ease: "none",` +
  ` onUpdate: function () { ${v}.seek(P_${v}.p * ${v}.duration); } }, ${at.toFixed(2)});`;

/* ---------- THE FIELD -------------------------------------------------------- */
export const FIELDS = {
  canvas: "var(--canvas)", bone: "var(--bone)", dark: "var(--dark)",
  deep: "var(--deep)", hero: null,
};
export const isDark = (n) => n === "dark" || n === "deep" || n === "hero";

/** the sheet. `hero` is the atmospheric mesh; everything else is a flat colour block,
    because Replicate's elevation language is colour-blocking rather than shadow. */
export const page = (name) => name === "hero"
  ? `      <div class="field hero" data-layout-allow-overflow></div>`
  : `      <div class="field" data-layout-allow-overflow style="background:${FIELDS[name] || FIELDS.canvas}"></div>`;

/* ---------- THE HEADER BLOCK ------------------------------------------------- */
/** slug + orange rule + Bricolage head + Inter deck. The rule is a FILL, which is the
    only role --primary is allowed on cream. */
export const header = (kicker, head, deck, dark = false, headSize = 84, deckW = 940, deckDy = 0) => {
  const lines = head.split(/<br\s*\/?>/i).length;
  const deckTop = 196 + lines * (headSize * 1.0) + 40 + deckDy;
  const kc = dark ? "#B9B2A6" : "var(--charcoal)";
  const hc = dark ? "var(--on-dark)" : "var(--ink)";
  const dc = dark ? "var(--stone)" : "var(--body)";
  const tr = headSize >= 110 ? "-3px" : headSize >= 70 ? "-1.8px" : "-1px";
  return `
      <div id="s-kick" class="slug" style="position:absolute;left:112px;top:112px;color:${kc}">${kicker}</div>
      <div id="s-rule" class="krule${dark ? " dk" : ""}" style="left:112px;top:152px;width:118px;transform-origin:0% 50%"></div>
      <div id="s-head" class="disp" style="position:absolute;left:110px;top:196px;width:1340px;font-size:${headSize}px;letter-spacing:${tr};color:${hc};z-index:1">${head}</div>
      ${deck ? `<div id="s-deck" class="body" style="position:absolute;left:112px;top:${deckTop}px;width:${deckW}px;font-size:30px;color:${dc}">${deck}</div>` : ""}`;
};

export const headerIn = (t = 0.10, hasDeck = true) => `
      // SEAM CARRIER — the slug and the headline are at FULL opacity from frame zero
      // and ride the cut in on the stage. They are never faded up: the seam gate
      // measures MOTION, so a frame that fades up still enters visibly blank.
      tl.fromTo("#s-rule", { scaleX: 0 }, { scaleX: 1, duration: 0.40, ease: "power3.out" }, ${(t + 0.04).toFixed(2)});
      tl.fromTo("#s-head", { y: 14 }, { y: 0, duration: 0.48, ease: "power3.out" }, 0);${hasDeck ? `
      tl.fromTo("#s-deck", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.48, ease: "power3.out" }, ${(t + 0.18).toFixed(2)});` : ""}`;

/* ---------- A WELL ----------------------------------------------------------- */
/**
 * A dark code well holding real bytes.
 * o: { x, y, w, h, tabs:[..], on:0, pad:34, fs:24, deep:false }
 * The tab strip is `--deep` with the active tab underlined in --primary — a 2px FILL,
 * which is the system's own component and the one place a coloured edge is correct,
 * because it marks WHICH tab rather than decorating the container.
 */
export const well = (id, o) => {
  const tabs = o.tabs || null;
  const top = tabs ? 44 + (o.pad ?? 30) : (o.pad ?? 30);
  return `
      <div id="${id}" class="well" style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px${o.deep ? ";background:var(--deep)" : ""}">
        ${tabs ? `<div class="welltab">${tabs.map((t, i) => `<span class="tab${i === (o.on ?? 0) ? " on" : ""}">${t}</span>`).join("")}</div>` : ""}
        ${o.text === null ? "" : `<div id="${id}-b" class="wellbody" style="top:${top}px;font-size:${o.fs ?? 24}px${o.lh ? `;line-height:${o.lh}` : ""}">${o.text ?? ""}</div>`}${o.extra ?? ""}
      </div>`;
};

/** THE COLOUR BLOCK. A well does not fade and does not drop a shadow — it arrives as a
    block of colour sweeping from the left, which is Replicate's elevation language
    performed rather than described. */
export const wellIn = (id, t, dur = 0.34) => `
      tl.fromTo("#${id}", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: ${dur.toFixed(2)}, ease: "power4.out" }, ${t.toFixed(2)});`;

/** a well already on the page at t=0 (a seam carrier) needs no clip at all */
export const wellHeld = (id) => `\n      gsap.set("#${id}", { clipPath: "inset(0 0% 0 0)" });`;

/* ---------- THE TYPEWRITER --------------------------------------------------- */
/** anime.text.splitText + a stagger, driven by GSAP. A 300-character block is ONE
    instance here and three hundred zero-duration tl.set calls otherwise. Whitespace
    survives because .wellbody is white-space:pre and splitText keeps text nodes it
    does not wrap. */
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
export const caret = (id, x, y, w = 13, h = 30, dark = true) =>
  `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:${dark ? "var(--on-dark)" : "var(--ink)"}"></div>`;

/* ---------- A PLATE ---------------------------------------------------------- */
/**
 * A real screenshot from the real web, mounted as photography.
 * o: { x, y, w, h?, src, cap, capDy }  — height comes from the image's own aspect unless
 *     `h` is given, in which case the plate CROPS to it (.plate is overflow:hidden). The
 *     crop is declared on the img so the layout gate reads it as intent, not as spill.
 */
export const plate = (id, o) => `
      <div id="${id}" class="plate" style="left:${o.x}px;top:${o.y}px;width:${o.w}px${o.h ? `;height:${o.h}px` : ""}">
        <img id="${id}-i" src="${o.src}" alt=""${o.h ? " data-layout-allow-overflow" : ""}>
      </div>${o.cap ? `
      <div id="${id}-c" class="platecap" style="left:${o.x}px;top:${o.y + (o.capDy ?? -38)}px">${o.cap}</div>` : ""}`;

/**
 * THE SIGNATURE MOVE — the plate rises out of the well it was described by.
 * Scale 0.92 -> 1.00 and a translate up out of the well's top edge. This is the
 * SSG form: it begins while the type is still landing, because the words were
 * already in the document.
 */
export const plateRise = (id, t, dur = 0.50, from = 46) => `
      tl.fromTo("#${id}", { autoAlpha: 0, y: ${from}, scale: 0.92 }, { autoAlpha: 1, y: 0, scale: 1, duration: ${dur.toFixed(2)}, ease: "power3.out" }, ${t.toFixed(2)});`;

/**
 * THE STALL — the CSR form of the same move, and the most important 1.2 seconds in
 * the film. The plate starts to rise, reaches 6% of the way, and stops, because there
 * is nothing to lift. It resumes only when `t2` arrives, and then it SNAPS the
 * remaining 94% in 0.18s: everything at once, at the end.
 */
export const plateStall = (id, t, t2, from = 46) => `
      tl.fromTo("#${id}", { autoAlpha: 0, y: ${from}, scale: 0.92 },
        { autoAlpha: 1, y: ${(from * 0.94).toFixed(1)}, scale: 0.925, duration: 0.26, ease: "power2.out" }, ${t.toFixed(2)});
      // ... and it holds here. The gap is the measurement, played as a gesture.
      tl.to("#${id}", { y: 0, scale: 1, duration: 0.18, ease: "power4.out" }, ${t2.toFixed(2)});`;

/* ---------- A STAMP ---------------------------------------------------------- */
/** ONE per frame. In a two-column comparison it belongs to exactly one column, and it
    moves to the other column when the argument does. */
export const stamp = (id, text, o) =>
  `      <div id="${id}" class="stamp" style="left:${o.x}px;top:${o.y}px${o.rot ? `;transform:rotate(${o.rot}deg)` : ""}${o.cream ? ";background:var(--canvas);color:var(--ink)" : ""}">${text}</div>`;

export const stampIn = (id, t, rot = 0) => `
      tl.fromTo("#${id}", { autoAlpha: 0, scale: 0.80, rotate: ${(rot - 5).toFixed(1)} },
        { autoAlpha: 1, scale: 1, rotate: ${rot}, duration: 0.12, ease: "${st(3)}" }, ${t.toFixed(2)});
      tl.fromTo("#${id}", { y: -14 }, { y: 0, duration: 0.14, ease: "power4.out" }, ${t.toFixed(2)});`;

/* ---------- A PILL ----------------------------------------------------------- */
export const pill = (id, text, o) =>
  `      <div id="${id}" class="pill${o.dark ? " dark" : ""}" style="left:${o.x}px;top:${o.y}px${o.fs ? `;font-size:${o.fs}px` : ""}${o.h ? `;height:${o.h}px` : ""}">${text}</div>`;

export const pillIn = (id, t) => `
      tl.fromTo("#${id}", { autoAlpha: 0, y: 12, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.30, ease: "power3.out" }, ${t.toFixed(2)});`;

/* ---------- A BAR ------------------------------------------------------------ */
/** the byte bar. --primary as a FILL is correct; the same hue as a word would not be. */
export const bar = (id, o) => `
      <div class="barbg${o.dark ? " on-dark" : ""}" style="left:${o.x}px;top:${o.y}px;width:${o.w}px${o.h ? `;height:${o.h}px;border-radius:9999px` : ""}"></div>
      <div id="${id}" class="barfg${o.kind ? ` ${o.kind}` : ""}" style="left:${o.x}px;top:${o.y}px;width:${o.w}px${o.h ? `;height:${o.h}px;border-radius:9999px` : ""}"></div>`;

export const barTo = (id, t, to, dur = 0.9, ease = "power2.out") => `
      tl.fromTo("#${id}", { scaleX: 0 }, { scaleX: ${to.toFixed(4)}, duration: ${dur.toFixed(2)}, ease: "${ease}" }, ${t.toFixed(2)});`;

/* ---------- A COUNTER -------------------------------------------------------- */
/**
 * A figure that counts. Tabular numerals are compulsory — a byte count whose digits
 * change width while it counts is not a measurement.
 * `fmt` is inlined into the composition and must be a pure expression of `v`.
 */
export const countTo = (id, t, from, to, dur, fmt = "Math.round(v).toLocaleString('en-US')", ease = "power2.out") => {
  const v = `c_${id.replace(/\W/g, "")}`;
  return `
      var ${v} = { v: ${from} };
      tl.to(${v}, { v: ${to}, duration: ${dur.toFixed(2)}, ease: "${ease}",
        onUpdate: function () { var v = ${v}.v; document.getElementById("${id}").textContent = ${fmt}; } }, ${t.toFixed(2)});`;
};

/* ---------- THE TWO CLOCKS --------------------------------------------------- */
/** A stopped clock and a running clock are the same object in two states, which is
    what makes an act change land as a change of ARGUMENT rather than of slide. */
export const clock = (id, kicker, value, dark = false) => `
      <div id="${id}" class="clock">
        <div class="clockk"${dark ? ' style="color:#9A9287"' : ""}>${kicker}</div>
        <div id="${id}-v" class="clockv"${dark ? ' style="color:var(--on-dark)"' : ""}>${value}</div>
      </div>`;

export const clockIn = (id, t) => `
      tl.fromTo("#${id}", { autoAlpha: 0, x: 18 }, { autoAlpha: 1, x: 0, duration: 0.40, ease: "power3.out" }, ${t.toFixed(2)});`;

/** the running clock: real milliseconds, stepped at 15fps so it reads as an instrument
    rather than as a blur of digits */
export const clockRun = (id, t, from, to, dur) =>
  countTo(`${id}-v`, t, from, to, dur, "'+' + String(Math.round(v/15)*15).padStart(4,'0') + ' ms'", "none");

/* ---------- DRAWN GEOMETRY ---------------------------------------------------- */
/** anime.svg.createDrawable computes the path length itself — which is precisely the
    number that gets estimated wrong by hand. */
export const penSvg = (id, d, w = 4, cls = "") =>
  `      <svg id="${id}-svg" class="pen" viewBox="0 0 1920 1080"><path id="${id}" class="${cls}" d="${d}" stroke-width="${w}"/></svg>`;

export const penDraw = (id, at, dur = 0.5) => {
  const v = `pen_${id.replace(/\W/g, "")}`;
  return `\n      var ${v}_d = anime.svg.createDrawable("#${id}");` +
    `\n      var ${v} = anime.animate(${v}_d, { draw: ["0 0", "0 1"], duration: ${Math.round(dur * 1000)},` +
    ` ease: ${stADrawn(dur)}, autoplay: false });` + drive(v, at, dur);
};

/* THE RULE, carried over from EP27's ten broken highlighter sweeps and EP28's two
   mis-measured pen boxes: a mark attaches to a BOX, never to a phrase inside a
   paragraph. When a phrase needs a mark, promote the phrase to its own positioned
   element first, so its x, y and width are numbers this file already knows. */
export const boxD = (x, y, w, h, seed = 1) => {
  const j = (k) => (sn(seed * 3.1 + k) * 2.2).toFixed(1);
  return `M ${x + 10} ${y + (+j(1))} L ${x + w + 6} ${y + (+j(2))} L ${x + w + (+j(3))} ${y + h + 2} ` +
    `L ${x - 3} ${y + h + (+j(4))} L ${x + (+j(5))} ${y - 4} L ${x + 34} ${y + (+j(6)) - 3}`;
};
export const underlineD = (x, y, w, seed = 1) => {
  const j = (k) => (sn(seed * 5.7 + k) * 2.0).toFixed(1);
  return `M ${x} ${y + (+j(1))} C ${x + w * 0.3} ${y + (+j(2)) - 2}, ${x + w * 0.7} ${y + (+j(3)) + 2}, ${x + w} ${y + (+j(4))}`;
};
export const arrowD = (x1, y1, x2, y2, bow = 22) => {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1;
  const cx = mx - (dy / L) * bow, cy = my + (dx / L) * bow;
  const a = Math.atan2(y2 - cy, x2 - cx);
  const h = 17;
  return `M ${x1} ${y1} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${x2} ${y2} ` +
    `M ${x2} ${y2} L ${(x2 - h * Math.cos(a - 0.42)).toFixed(1)} ${(y2 - h * Math.sin(a - 0.42)).toFixed(1)} ` +
    `M ${x2} ${y2} L ${(x2 - h * Math.cos(a + 0.42)).toFixed(1)} ${(y2 - h * Math.sin(a + 0.42)).toFixed(1)}`;
};
export const crossD = (cx, cy, r) =>
  `M ${cx - r} ${cy - r} L ${cx + r} ${cy + r} M ${cx + r} ${cy - r} L ${cx - r} ${cy + r}`;
export const tickD = (cx, cy, r) =>
  `M ${cx - r} ${cy} L ${cx - r * 0.25} ${cy + r * 0.72} L ${cx + r * 1.05} ${cy - r * 0.86}`;

/* ---------- SEAMS ------------------------------------------------------------ */
// House current is LEFT. Exit travel E, entry travel ~1.27E, mirrored power4.
// Both halves are authored: the entry here, the exit appended centrally in build.mjs,
// because a seam authored on one side only is a half-seam — the incoming frame flies
// in over an outgoing frame that is standing still, which reads as a slide changing.
export const EXIT = 236, ENTRY = 300;

export const enterAcross = (sel = "#stage") =>
  `      // SEAM ENTRY — across, cut-the-curve LEFT, mid-flight at FULL opacity.
      tl.fromTo("${sel}", { x: ${ENTRY} }, { x: 0, duration: 0.43, ease: "power4.out" }, 0);`;
export const exitAcross = (sel, at) =>
  `      // SEAM EXIT — across, travelling LEFT out of frame at matched velocity.
      tl.to("${sel}", { x: -${EXIT}, duration: 0.34, ease: "power4.in" }, ${at.toFixed(2)});`;

export const enterLift = (sel = "#stage") =>
  `      // SEAM ENTRY — ACT BREAK lift. The sheet is turned up and over.
      tl.fromTo("${sel}", { y: 372 }, { y: 0, duration: 0.62, ease: "power4.out" }, 0);
      tl.fromTo("${sel}", { scale: 0.86 }, { scale: 1, duration: 0.78, ease: "power2.out" }, 0);`;
export const exitLift = (sel, at) =>
  `      // SEAM EXIT — ACT BREAK lift. Travels UP and pulls back to 0.86.
      tl.to("${sel}", { y: -300, duration: 0.46, ease: "power4.in" }, ${at.toFixed(2)});
      tl.to("${sel}", { scale: 0.86, duration: 0.52, ease: "power2.in" }, ${at.toFixed(2)});`;

/** Z-BACK — the ARRIVAL vector. RESERVED; spent ONCE in this film, on paint -> turn:
    the moment the argument reverses. Both halves share the SIGN of the scale
    velocity — the outgoing recedes to 0.60, the incoming enters ABOVE 1.0 and settles
    DOWN to it. Mirroring the sign reads as a bounce and is wrong. */
export const exitZBack = (sel, at) =>
  `      // SEAM EXIT — Z-BACK. Recedes 1.00 -> 0.60. The field over-scans by 18%, or
      // this shows the stage edge for the length of the cut.
      tl.to("${sel}", { scale: 0.60, duration: 0.52, ease: "power4.in" }, ${at.toFixed(2)});`;
export const enterZBack = (sel = "#stage") =>
  `      // SEAM ENTRY — Z-BACK continued: enters at 1.48 and settles DOWN to 1.0.
      tl.fromTo("${sel}", { scale: 1.48 }, { scale: 1, duration: 0.62, ease: "power4.out" }, 0);`;

export const ENTER = { across: enterAcross, lift: enterLift, zback: enterZBack };
export const EXITF = { across: exitAcross, lift: exitLift, zback: exitZBack };

/* ---------- THE WRAP --------------------------------------------------------- */
/** `transparent` is REQUIRED for any overlay mounted on a track ABOVE the frames:
    #root carries an opaque --canvas background, so an overlay that keeps it paints
    over the entire film — and lint, layout, motion and contrast all still pass. */
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

/* ---------- STAGGER ----------------------------------------------------------- */
/** nothing lands as a group: 3-6 frames between siblings, then the INFORMATION is
    staged so the beat keeps delivering across its length. */
export const stagger = (sel, t, o = {}) => `
      tl.fromTo("${sel}", { autoAlpha: 0, y: ${o.y ?? 20} }, { autoAlpha: 1, y: 0, duration: ${(o.dur ?? 0.42).toFixed(2)}, ease: "power3.out", stagger: ${(o.step ?? 0.11).toFixed(3)} }, ${t.toFixed(2)});`;
