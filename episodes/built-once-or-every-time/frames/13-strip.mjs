// 13 STRIP — the two page loads, drawn from the traces themselves.
//
// Chrome writes a Screenshot event into a performance trace when the pixels change. The
// tick marks below are EVERY such event in each of the two cold traces, at its true
// millisecond offset from navigationStart — 37 of them for the static page and 7 for the
// client-rendered one. Nothing here is sampled, smoothed or chosen: the whole list is on
// the sheet, and the shape of the two lanes is the shape of the two loads.
//
// Traces archived at research/trace-ssg-cold.json and research/trace-csr-cold.json.
// Slow 4G, 4x CPU, cold cache, same device, minutes apart.
import { page, header, headerIn, ENTER, stamp, stampIn, countTo } from "../lib/frame.mjs";

// every Screenshot event in each trace, in ms after navigationStart
const SSG = [34, 1614, 1804, 1824, 1915, 1922, 1931, 1945, 1957, 1963, 1971, 1987, 1996,
  2004, 2023, 2030, 2039, 2046, 2063, 2072, 2079, 2097, 2107, 2113, 2131, 2137, 2146,
  2154, 2171, 2180, 2187, 2196, 2212, 2722, 2912, 2921, 2931];
const CSR = [2717, 6805, 6955, 7097, 7779, 7785, 7796];

export function build({ seamIn }) {
  const X0 = 268, X1 = 1800, SPAN = 8000;
  const px = (ms) => X0 + (ms / SPAN) * (X1 - X0);
  const LANES = [
    { id: "s", y: 486, name: "jekyllrb.com", data: SSG, fcp: 1728, col: "var(--ink)" },
    { id: "c", y: 742, name: "excalidraw.com", data: CSR, fcp: 6836, col: "var(--ink)" },
  ];

  const body = `${page("canvas")}
    <div id="stage" class="stage"><div class="inner">
      ${header("03 · WHAT IT COSTS", "One of them had something to draw.", "", false, 62)}
      <div id="k-note" class="mono" style="position:absolute;left:130px;top:284px;font-size:20px;color:var(--charcoal)">every frame Chrome captured, at its true offset · Slow 4G, 4× CPU, cold cache, first visit · 2026-08-23</div>

      ${[0, 2000, 4000, 6000, 8000].map((ms) => `
      <div class="k-gr" style="position:absolute;left:${px(ms)}px;top:400px;width:1px;height:520px;background:var(--hair)"></div>
      <div class="k-gl mono" style="position:absolute;left:${px(ms) - 40}px;top:942px;width:80px;text-align:center;font-size:21px;color:var(--mute)">${ms / 1000}s</div>`).join("")}

      ${LANES.map((L) => `
      <div id="k-${L.id}-n" class="monob" style="position:absolute;left:128px;top:${L.y - 46}px;font-size:26px;color:var(--ink)">${L.name}</div>
      <div id="k-${L.id}-c" class="mono" style="position:absolute;left:128px;top:${L.y + 2}px;font-size:22px;color:var(--mute)"><span id="k-${L.id}-num">0</span> frames</div>
      <div class="k-base" style="position:absolute;left:${X0}px;top:${L.y + 62}px;width:${X1 - X0}px;height:2px;background:var(--hair);transform-origin:0% 50%"></div>
      ${L.data.map((ms, i) => `<div class="k-t k-t-${L.id}" style="position:absolute;left:${px(ms)}px;top:${L.y - 4}px;width:3px;height:66px;background:${L.col}"></div>`).join("")}
      <div id="k-${L.id}-f" style="position:absolute;left:${px(L.fcp) - 1}px;top:${L.y - 34}px;width:3px;height:120px;background:var(--primary)"></div>
      <div id="k-${L.id}-fl" class="monob" style="position:absolute;left:${px(L.fcp) + 16}px;top:${L.y - 34}px;font-size:25px;color:var(--primary-deep)">${L.fcp.toLocaleString("en-US")} ms</div>`).join("")}

      <div id="k-say" class="body" style="position:absolute;left:128px;top:988px;width:1300px;font-size:28px;color:var(--body)">Chrome writes a frame when the pixels change. For six and a half seconds, on one of these pages, nothing did.</div>
      ${stamp("st13", "37 FRAMES  ·  7 FRAMES", { x: 1330, y: 196 })}
    </div></div>`;

  const script = `${ENTER[seamIn]("#stage")}
${headerIn(0.10, false)}
      gsap.set([".k-gr", ".k-gl", ".k-t", "#k-s-f", "#k-s-fl", "#k-c-f", "#k-c-fl", "#k-s-c", "#k-c-c", "#k-say"], { autoAlpha: 0 });
      gsap.set(".k-base", { scaleX: 0 });
      gsap.set(["#k-s-n", "#k-c-n"], { autoAlpha: 0 });

      tl.fromTo(".k-gr", { autoAlpha: 0, scaleY: 0 }, { autoAlpha: 1, scaleY: 1, duration: 0.34, ease: "power3.out", stagger: 0.05, transformOrigin: "50% 0%" }, 0.24);
      tl.fromTo(".k-gl", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.28, stagger: 0.05 }, 0.34);
      tl.to(".k-base", { scaleX: 1, duration: 0.62, ease: "power3.out", stagger: 2.60 }, 0.50);

      // ---- lane one: the ticks arrive in real order, quickly, in one dense burst.
      tl.fromTo("#k-s-n", { autoAlpha: 0, x: -14 }, { autoAlpha: 1, x: 0, duration: 0.32, ease: "power3.out" }, 0.72);
      tl.fromTo(".k-t-s", { autoAlpha: 0, scaleY: 0 }, { autoAlpha: 1, scaleY: 1, duration: 0.16, ease: "power2.out", stagger: 0.028, transformOrigin: "50% 100%" }, 1.02);
      tl.fromTo("#k-s-f", { autoAlpha: 0, scaleY: 0 }, { autoAlpha: 1, scaleY: 1, duration: 0.24, ease: "power3.out", transformOrigin: "50% 100%" }, 2.32);
      tl.fromTo("#k-s-fl", { autoAlpha: 0, x: -12 }, { autoAlpha: 1, x: 0, duration: 0.32, ease: "power3.out" }, 2.44);
      tl.set("#k-s-c", { autoAlpha: 1 }, 2.44);
${countTo("k-s-num", 2.44, 0, 37, 0.60)}

      // ---- lane two: one tick, then a gap the length of the argument, then the rest.
      tl.fromTo("#k-c-n", { autoAlpha: 0, x: -14 }, { autoAlpha: 1, x: 0, duration: 0.32, ease: "power3.out" }, 3.42);
      tl.fromTo(".k-t-c", { autoAlpha: 0, scaleY: 0 }, { autoAlpha: 1, scaleY: 1, duration: 0.18, ease: "power2.out", stagger: 0.52, transformOrigin: "50% 100%" }, 3.70);
      tl.fromTo("#k-c-f", { autoAlpha: 0, scaleY: 0 }, { autoAlpha: 1, scaleY: 1, duration: 0.24, ease: "power3.out", transformOrigin: "50% 100%" }, 7.06);
      tl.fromTo("#k-c-fl", { autoAlpha: 0, x: -12 }, { autoAlpha: 1, x: 0, duration: 0.32, ease: "power3.out" }, 7.18);
      tl.set("#k-c-c", { autoAlpha: 1 }, 7.18);
${countTo("k-c-num", 7.18, 0, 7, 0.40)}

      tl.fromTo("#k-say", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.46, ease: "power3.out" }, 8.30);
${stampIn("st13", 9.60)}`;

  return { body, script };
}
