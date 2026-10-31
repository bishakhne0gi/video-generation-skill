// 08 WHEN — the mechanism, on the dark code-story band.
//
// Three moments, and there are only three: the HTML can be produced before anyone asks,
// while someone is asking, or after it has already arrived. Everything the industry
// argues about is a position on this axis, so the frame names the axis and puts the two
// subjects of the film on it.
//
// TWO running systems, and both of them mean something:
//
//   the DOT travels the axis and each column arrives as it lands, so the column reads as
//   caused by the arrival rather than as a slide appearing;
//
//   the PULSES fall from the axis into each column at the rate that moment actually
//   happens — build time fires ONCE and then never again, request time every 1.1s, run
//   time every 0.55s. That difference IS the argument, and it is why the frame is never
//   still: the first frozen-frame pass found three dead pockets here because the columns
//   arrived as three blocks and then sat for four seconds each.
//
// Every element carries its own id rather than a :nth-of-type selector. nth-of-type
// counts among ALL sibling divs, not among the ones sharing the class, so the selector
// would have addressed the wrong elements and every gate would still have passed.
import { page, header, headerIn, ENTER, penSvg, penDraw, arrowD } from "../lib/frame.mjs";

export function build({ seamIn }) {
  const COLS = [
    { k: "Build time", rows: ["once, on deploy", "a machine you own", "you pay, once"],
      name: "SSG", ex: "jekyllrb.com" },
    { k: "Request time", rows: ["every request", "a server you run", "you pay, per request"],
      name: "SSR · ISR", ex: "" },
    { k: "Run time", rows: ["every visit", "the visitor's device", "they pay, every time"],
      name: "CSR", ex: "excalidraw.com" },
  ];
  const X = [128, 736, 1344], W = 448;
  const AXIS_Y = 360;
  const LIT = [1.46, 5.11, 8.76];      // when the dot reaches each column
  const RATE = [null, 1.10, 0.55];     // how often that moment actually happens

  const body = `${page("dark")}
    <div id="stage" class="stage"><div class="inner">
      ${header("02 · WHEN", "Three moments. That is the whole list.", "", true, 62)}

      <div id="ax" class="hairD" style="left:${X[0]}px;top:${AXIS_Y}px;width:${X[2] + W - X[0]}px;height:2px;transform-origin:0% 50%"></div>
      ${X.map((x) => `<div class="ax-n" style="position:absolute;left:${x - 9}px;top:${AXIS_Y - 8}px;width:18px;height:18px;border-radius:9999px;background:var(--on-dark)"></div>`).join("")}
      <div id="ax-dot" style="position:absolute;left:${X[0] - 13}px;top:${AXIS_Y - 12}px;width:26px;height:26px;border-radius:9999px;background:var(--primary)"></div>

      ${COLS.map((c, i) => `
      <div id="pl${i}" style="position:absolute;left:${X[i] - 5}px;top:${AXIS_Y + 6}px;width:10px;height:10px;border-radius:9999px;background:var(--primary)"></div>
      <div id="ck${i}" class="disp" style="position:absolute;left:${X[i]}px;top:${AXIS_Y + 46}px;width:${W}px;font-size:52px;letter-spacing:-1px;color:var(--on-dark)">${c.k}</div>
      <div id="cr${i}" class="hairD" style="left:${X[i]}px;top:${AXIS_Y + 118}px;width:${W}px;transform-origin:0% 50%"></div>
      ${c.rows.map((r, j) => `
      <div id="cl${i}-${j}" class="mono" style="position:absolute;left:${X[i]}px;top:${AXIS_Y + 156 + j * 48}px;width:${W}px;font-size:26px;color:var(--stone)">${r}</div>`).join("")}
      <div id="cn${i}" class="monob" style="position:absolute;left:${X[i]}px;top:${AXIS_Y + 322}px;font-size:34px;color:var(--on-dark)">${c.name}</div>
      <div id="ce${i}" class="mono" style="position:absolute;left:${X[i]}px;top:${AXIS_Y + 372}px;font-size:22px;color:var(--ash)">${c.ex || "&nbsp;"}</div>`).join("")}

      ${penSvg("p-a1", arrowD(X[0] + 300, 986, X[2] + 150, 986, -30), 3.5, "dk")}
      <div id="c-cap" class="mono" style="position:absolute;left:${X[0]}px;top:1006px;font-size:23px;color:var(--stone)">later</div>
    </div></div>`;

  const hide = [];
  COLS.forEach((c, i) => {
    hide.push(`"#ck${i}"`, `"#cn${i}"`, `"#ce${i}"`, `"#pl${i}"`);
    c.rows.forEach((_, j) => hide.push(`"#cl${i}-${j}"`));
  });

  const script = `${ENTER[seamIn]("#stage")}
${headerIn(0.10, false)}
      gsap.set([${hide.join(", ")}, ".ax-n", "#c-cap", "#ax-dot"], { autoAlpha: 0 });
      gsap.set(["#cr0", "#cr1", "#cr2", "#ax"], { scaleX: 0 });

      tl.to("#ax", { scaleX: 1, duration: 0.72, ease: "power3.out" }, 0.34);
      tl.fromTo(".ax-n", { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.26, ease: "back.out(2)", stagger: 0.30 }, 0.62);
      // the travelling dot moves on X, never on the CSS left property: a layout property
      // snaps to integer device pixels and stutters under seek-by-frame capture.
      tl.fromTo("#ax-dot", { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.26, ease: "back.out(2)" }, 1.20);
      tl.to("#ax-dot", { x: ${X[1] - X[0]}, duration: 0.82, ease: "power2.inOut" }, 4.30);
      tl.to("#ax-dot", { x: ${X[2] - X[0]}, duration: 0.82, ease: "power2.inOut" }, 7.95);

${COLS.map((c, i) => {
  const t = LIT[i];
  return `      // ---- column ${i + 1}: header, rule, three rows, the name and the example,
      // staged across three seconds so it keeps delivering after it lands
      tl.fromTo("#ck${i}", { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.44, ease: "power3.out" }, ${t.toFixed(2)});
      tl.to("#cr${i}", { scaleX: 1, duration: 0.44, ease: "power3.out" }, ${(t + 0.24).toFixed(2)});
${c.rows.map((_, j) => `      tl.fromTo("#cl${i}-${j}", { autoAlpha: 0, x: -14 }, { autoAlpha: 1, x: 0, duration: 0.34, ease: "power3.out" }, ${(t + 0.52 + j * 0.66).toFixed(2)});`).join("\n")}
      tl.fromTo("#cn${i}", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.38, ease: "power3.out" }, ${(t + 2.48).toFixed(2)});
      tl.fromTo("#ce${i}", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.32, ease: "power3.out" }, ${(t + 2.84).toFixed(2)});
`;
}).join("")}
      // ---- THE PULSES. Build time fires once and never again; request time every 1.1s;
      // run time every 0.55s. A repeating GSAP tween seeks correctly, so this is safe
      // under frame-by-frame capture — and unlike an idle wobble it MEANS something.
      tl.fromTo("#pl0", { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: 40, duration: 0.55, ease: "power2.in" }, ${LIT[0].toFixed(2)});
${[1, 2].map((i) => `      tl.fromTo("#pl${i}", { autoAlpha: 1, y: 0 },
        { autoAlpha: 0, y: 40, duration: ${(RATE[i] * 0.62).toFixed(2)}, ease: "power2.in",
          repeat: ${Math.ceil((12.1 - LIT[i]) / RATE[i])}, repeatDelay: ${(RATE[i] * 0.38).toFixed(2)} }, ${LIT[i].toFixed(2)});`).join("\n")}

      // the arrow says the axis has a direction, and it is drawn once, at the end
${penDraw("p-a1", 11.30, 0.62)}
      tl.fromTo("#c-cap", { autoAlpha: 0, x: -14 }, { autoAlpha: 1, x: 0, duration: 0.34, ease: "power3.out" }, 11.42);`;

  return { body, script };
}
