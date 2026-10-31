// EP26 shared frame scaffold. Asset paths are HOST-relative (frames are cloned
// into the root index.html), so "assets/..." — never "../assets/...".

export const STYLE = `
@font-face{font-family:"Archivo";src:url("assets/fonts/Archivo-var.woff2") format("woff2");font-weight:100 900;font-stretch:62% 125%;font-display:block}
@font-face{font-family:"JBMono";src:url("assets/fonts/JetBrainsMono-400.woff2") format("woff2");font-weight:400;font-display:block}
@font-face{font-family:"JBMono";src:url("assets/fonts/JetBrainsMono-700.woff2") format("woff2");font-weight:700;font-display:block}
@font-face{font-family:"Instrument";src:url("assets/fonts/InstrumentSerif-italic.woff2") format("woff2");font-weight:400;font-style:italic;font-display:block}

#root{position:relative;width:1920px;height:1080px;overflow:hidden;
  --void:#091413; --forest:#285A48; --emerald:#408A71; --emerald-lit:#6FD0AA;
  --mint:#B0E4CC; --brass:#E8A13C; --ink:#091413;
  background:var(--void); font-family:"Archivo",system-ui,sans-serif;
  -webkit-font-smoothing:antialiased;
  font-variant-numeric:tabular-nums; font-feature-settings:"tnum" 1;}
#root *{margin:0;padding:0;box-sizing:border-box}

/* ---- the field: one plate per act, dimmed, never absent ---- */
.plate{position:absolute;inset:0;background-size:cover;background-position:center}
.scrim{position:absolute;inset:0}
/* stage carries every seam move; content never animates the clip itself */
.stage{position:absolute;inset:0}
.inner{position:relative;z-index:1;width:100%;height:100%}

/* ---- MATERIAL: bezel -> face -> glass. All lighting static. ---- */
.bezel{position:absolute;background-image:url("assets/plates/brass.jpg");
  background-size:cover;background-position:center;
  box-shadow:inset 2px 2px 5px rgba(255,236,196,.55), inset -3px -3px 7px rgba(0,0,0,.62),
             0 18px 44px rgba(0,0,0,.62), 0 2px 0 rgba(255,236,196,.14)}
.face{position:absolute;background:
   radial-gradient(120% 120% at 32% 22%, #2E6551 0%, #16302A 46%, #091413 100%);
  box-shadow:inset 0 8px 26px rgba(0,0,0,.66), inset 0 -2px 0 rgba(255,255,255,.05)}
/* .glasscap is the DOME photograph and belongs to ROUND instruments only. Laid over a
   rectangular case it reads as a dark ellipse floating on the content. Flat covers get
   .glassflat: a sheen, not a photograph. */
.glasscap{position:absolute;pointer-events:none;
  background-image:url("assets/plates/glass.jpg");background-size:cover;background-position:center;
  mix-blend-mode:screen;opacity:.20}
.glassflat{position:absolute;pointer-events:none;background:
  linear-gradient(176deg, rgba(176,228,204,.09) 0%, rgba(176,228,204,.02) 18%,
                  rgba(255,255,255,0) 46%, rgba(9,20,19,.16) 100%);
  box-shadow:inset 0 1px 0 rgba(176,228,204,.20)}
.spec{position:absolute;pointer-events:none;background:
  linear-gradient(107deg, rgba(255,255,255,0) 34%, rgba(255,255,255,.07) 46%,
                  rgba(255,255,255,.02) 53%, rgba(255,255,255,0) 62%)}
.leather{background-image:url("assets/plates/leather.jpg");background-size:cover;
  box-shadow:inset 0 2px 0 rgba(255,255,255,.08), 0 16px 40px rgba(0,0,0,.55)}

/* the needle — the film's signature. transform-origin at the pivot. */
.needle{position:absolute;transform-origin:50% 100%;
  background:linear-gradient(180deg,var(--mint) 0%, #7FC4A6 62%, #33604F 100%);
  box-shadow:0 0 12px rgba(176,228,204,.36), 0 2px 5px rgba(0,0,0,.6);border-radius:2px}
.needle.hot{background:linear-gradient(180deg,var(--brass) 0%, #C07C22 70%, #4A3210 100%);
  box-shadow:0 0 16px rgba(232,161,60,.44), 0 2px 5px rgba(0,0,0,.6)}
.hub{position:absolute;border-radius:50%;background-image:url("assets/plates/brass.jpg");
  background-size:cover;box-shadow:inset 1px 1px 3px rgba(255,236,196,.6),
  inset -2px -2px 4px rgba(0,0,0,.6),0 3px 8px rgba(0,0,0,.7)}

/* ---- TYPE ---- */
.hdr{font-weight:800;font-stretch:125%;letter-spacing:-.04em;color:var(--mint);line-height:.94}
.lead{font-weight:400;color:var(--mint);opacity:.86;line-height:1.28}
.mono{font-family:"JBMono",monospace;color:var(--emerald-lit)}
.tag{font-family:"JBMono",monospace;font-weight:700;letter-spacing:.18em;
  color:var(--emerald-lit);font-size:21px}
.hot{color:var(--brass)}
.chipmint{background:var(--mint);color:var(--ink);font-family:"JBMono",monospace;
  font-weight:700;border-radius:5px;display:inline-block}
/* one black + a hairline for every surface. no coloured edges, ever. */
.panel{position:absolute;background:#0B100F;border:1px solid rgba(176,228,204,.14);
  border-radius:10px;box-shadow:0 20px 48px rgba(0,0,0,.6)}
.rule{position:absolute;background:var(--emerald);height:2px}
`;

export const PLATES = {
  lamplit:    { img: "lamplit.jpg",    op: 0.50, scrim: "radial-gradient(78% 90% at 30% 26%, rgba(9,20,19,.30) 0%, rgba(9,20,19,.86) 62%, rgba(9,20,19,.96) 100%)" },
  interior:   { img: "interior.jpg",   op: 0.38, scrim: "radial-gradient(84% 96% at 50% 46%, rgba(9,20,19,.52) 0%, rgba(9,20,19,.93) 66%, rgba(9,20,19,.99) 100%)" },
  inspection: { img: "inspection.jpg", op: 0.26, scrim: "radial-gradient(80% 92% at 52% 34%, rgba(9,20,19,.24) 0%, rgba(9,20,19,.80) 60%, rgba(9,20,19,.94) 100%)" },
  cabinet:    { img: "cabinet.jpg",    op: 0.62, scrim: "radial-gradient(90% 100% at 46% 42%, rgba(9,20,19,.24) 0%, rgba(9,20,19,.78) 64%, rgba(9,20,19,.94) 100%)" },
};

export const field = (name) => {
  const p = PLATES[name];
  return `<div class="plate" style="background-image:url('assets/plates/${p.img}');opacity:${p.op}"></div>
  <div class="scrim" style="background:${p.scrim}"></div>`;
};

/** Wrap a frame body + timeline into the sub-composition contract.
    `transparent` is REQUIRED for any overlay composition mounted on a track above the
    stations: #root carries an opaque --void background, so an overlay that keeps it
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

/* ---------- SEAMS: both halves authored in-frame, transition_in is always cut ----------
   House current is LEFT. Exit travel E, entry travel ~1.27E, mirrored power4. */
export const EXIT = 236, ENTRY = 300;

export const enterAcross = (sel = "#stage") =>
  `      // SEAM ENTRY — across, cut-the-curve LEFT. Enters mid-flight at full opacity:
      // the gate measures MOTION, so a frame that fades up still enters visibly blank.
      tl.fromTo("${sel}", { x: ${ENTRY} }, { x: 0, duration: 0.43, ease: "power4.out" }, 0);`;

export const exitAcross = (sel, at) =>
  `      // SEAM EXIT — across, travelling LEFT out of frame at matched velocity.
      tl.to("${sel}", { x: -${EXIT}, duration: 0.34, ease: "power4.in" }, ${at.toFixed(2)});`;

export const enterLift = (sel = "#stage") =>
  `      // SEAM ENTRY — ACT BREAK lift. Rises from below through a softer scale curve
      // than the travel, so the pull-back reads as the camera stepping up and over.
      tl.fromTo("${sel}", { y: 372, scale: 0.84 }, { y: 0, duration: 0.62, ease: "power4.out" }, 0);
      tl.fromTo("${sel}", { scale: 0.84 }, { scale: 1, duration: 0.78, ease: "power2.out" }, 0);`;

export const exitLift = (sel, at) =>
  `      // SEAM EXIT — ACT BREAK lift. Travels UP and pulls back to 0.84.
      tl.to("${sel}", { y: -300, duration: 0.46, ease: "power4.in" }, ${at.toFixed(2)});
      tl.to("${sel}", { scale: 0.84, duration: 0.52, ease: "power2.in" }, ${at.toFixed(2)});`;

/** Z-back — reserved for the thesis landing. Spent ONCE in the film. */
export const exitZBack = (sel, at) =>
  `      // SEAM EXIT — Z-BACK, the arrival vector. Reserved; spent once in this film.
      tl.to("${sel}", { scale: 0.62, duration: 0.52, ease: "power4.in" }, ${at.toFixed(2)});`;

export const enterZBack = (sel = "#stage") =>
  `      // SEAM ENTRY — Z-BACK continued: enters ABOVE 1.0 and settles down to it, so both
      // halves share the sign of the scale velocity. Mirroring reads as a bounce, not a move.
      tl.fromTo("${sel}", { scale: 1.46 }, { scale: 1, duration: 0.62, ease: "power4.out" }, 0);`;

/** The needle law: overshoot ~4%, then a damped settle. Never a smooth ease to rest. */
export const swing = (sel, from, to, at, hot = false) => {
  const over = to + (to - from) * 0.04;
  return `      tl.fromTo("${sel}", { rotation: ${from} }, { rotation: ${over.toFixed(2)}, duration: 0.74, ease: "power3.out" }, ${at.toFixed(2)});
      tl.to("${sel}", { rotation: ${to}, duration: 0.42, ease: "elastic.out(1, 0.62)" }, ${(at + 0.74).toFixed(2)});`;
};

/** Station header block: box tag + rule + headline + lead line. */
export const header = (n, tag, head, lead) => {
  const lines = head.split(/<br\s*\/?>/i).length;
  const leadTop = 176 + lines * 77 + 42;
  return `
      <div id="s-tag" class="tag" style="position:absolute;left:118px;top:112px">${n} · ${tag}</div>
      <div id="s-rule" class="rule" style="left:118px;top:150px;width:96px;transform-origin:0% 50%"></div>
      <div id="s-hdr" class="hdr" style="position:absolute;left:118px;top:176px;width:1180px;font-size:82px">${head}</div>
      <div id="s-lead" class="lead" style="position:absolute;left:120px;top:${leadTop}px;width:840px;font-size:31px">${lead}</div>`;
};

export const headerIn = (t = 0.10) => `
      // SEAM CARRIER — the box tag and the headline are at FULL opacity from frame zero
      // and ride the cut in on the stage. They are never faded up: the seam gate measures
      // MOTION, so a station whose content fades in at 0.1s passes the gate while visibly
      // entering on an empty frame. Only the rule and the lead line are staged.
      tl.fromTo("#s-rule", { scaleX: 0 }, { scaleX: 1, duration: 0.50, ease: "power3.out" }, ${t + 0.04});
      tl.fromTo("#s-hdr",  { y: 14 }, { y: 0, duration: 0.52, ease: "power3.out" }, 0);
      tl.fromTo("#s-lead", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.52, ease: "power3.out" }, ${t + 0.20});`;

/* ---------- seek-safe readouts -------------------------------------------------
   A tween on text content is a no-op and tl.call is not reliably seekable, so a
   changing figure is a STACK of spans toggled with zero-duration tl.set. */
export const readout = (id, values, style = "") =>
  `<div id="${id}" style="position:relative;${style}">` +
  values.map((v, i) => `<span id="${id}-${i}" style="position:absolute;left:0;top:0;white-space:nowrap">${v}</span>`).join("") +
  `</div>`;

export const readoutIn = (id, n, t0, dt) => {
  let s = `\n      for (var _r = 0; _r < ${n}; _r++) gsap.set("#${id}-" + _r, { autoAlpha: 0 });`;
  for (let i = 0; i < n; i++) {
    s += `\n      tl.set("#${id}-${i}", { autoAlpha: 1 }, ${(t0 + i * dt).toFixed(2)});`;
    if (i > 0) s += `\n      tl.set("#${id}-${i - 1}", { autoAlpha: 0 }, ${(t0 + i * dt).toFixed(2)});`;
  }
  return s;
};

/** A full-width band that sweeps a panel — large-area motion the pacing audit can see,
    and motivated: these are instruments taking a reading. */
export const sweep = (id, x, y, w, h) =>
  `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:${Math.round(w * 0.22)}px;height:${h}px;
    background:linear-gradient(90deg,rgba(176,228,204,0),rgba(176,228,204,.16),rgba(176,228,204,0));pointer-events:none"></div>`;

export const sweepIn = (id, travel, t0, dur = 1.5, reps = 0) =>
  `\n      tl.fromTo("#${id}", { x: 0, autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, ${t0});` +
  `\n      tl.fromTo("#${id}", { x: 0 }, { x: ${travel}, duration: ${dur}, ease: "none", repeat: ${reps} }, ${t0});`;
