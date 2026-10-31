// 14 PAINT — the number, and where it lands.
//
// Measured in Chrome, Slow 4G + 4x CPU, cold cache, same device, minutes apart. Values
// read from `performance.getEntriesByType('paint')` and the navigation entry:
//
//                    FCP        LCP        load event
//   jekyllrb.com      1,728 ms   1,630 ms   2,877 ms
//   excalidraw.com    6,836 ms   7,105 ms   6,800 ms
//
// The second row is the frame's whole reason to exist: first paint at 6,836 ms and the
// load event at 6,800 ms are the SAME MOMENT. On a client-rendered page the first pixel
// is not early — it is last. Nothing appears until everything has arrived.
//
// This frame carries the film's 0.6s STILLNESS before the Z-back that follows it.
import { page, header, headerIn, ENTER, countTo, stamp, stampIn, penSvg, penDraw,
  boxD } from "../lib/frame.mjs";

export function build({ seamIn }) {
  const X0 = 480, X1 = 1800, SPAN = 8000;
  const px = (ms) => X0 + (ms / SPAN) * (X1 - X0);
  const R = [
    { id: "s", y: 430, name: "jekyllrb.com", fcp: 1728, load: 2877 },
    { id: "c", y: 700, name: "excalidraw.com", fcp: 6836, load: 6800 },
  ];

  const body = `${page("canvas")}
    <div id="stage" class="stage"><div class="inner">
      ${header("03 · WHAT IT COSTS", "First paint.", "", false, 62)}
      <div id="f-note" class="mono" style="position:absolute;left:130px;top:284px;font-size:20px;color:var(--charcoal)">first-contentful-paint, and the load event, on the same two cold loads · Slow 4G, 4× CPU</div>

      ${R.map((r) => `
      <div id="f-${r.id}-n" class="monob" style="position:absolute;left:128px;top:${r.y - 8}px;font-size:28px;color:var(--ink)">${r.name}</div>
      <div id="f-${r.id}-b" class="mono" style="position:absolute;left:128px;top:${r.y + 40}px;font-size:80px;color:var(--ink);letter-spacing:-2px"><span id="f-${r.id}-num">0</span> ms</div>
      <div class="f-track" style="position:absolute;left:${X0}px;top:${r.y + 62}px;width:${X1 - X0}px;height:16px;border-radius:9999px;background:rgba(32,32,32,.10)"></div>
      <div id="f-${r.id}-fill" style="position:absolute;left:${X0}px;top:${r.y + 62}px;width:${X1 - X0}px;height:16px;border-radius:9999px;background:var(--ink);transform-origin:0% 50%"></div>
      <div id="f-${r.id}-l" style="position:absolute;left:${px(r.load) - 2}px;top:${r.y + 30}px;width:4px;height:82px;background:var(--primary)"></div>
      <div id="f-${r.id}-ll" class="mono" style="position:absolute;left:${px(r.load) - 96}px;top:${r.y + 118}px;width:200px;text-align:center;font-size:21px;color:var(--primary-deep)">load ${r.load.toLocaleString("en-US")} ms</div>`).join("")}

      <div id="f-say" class="body" style="position:absolute;left:128px;top:886px;width:1600px;font-size:30px;color:var(--body)">Six thousand eight hundred and thirty-six against six thousand eight hundred. <span class="bodys">The first pixel and the last byte are the same moment.</span></div>

      <div id="f-crux" class="mono" style="position:absolute;left:128px;top:1014px;font-size:21px;color:var(--charcoal)">real users, p75 (Chrome UX Report): <span style="color:var(--ink)">1,112 ms</span>  ·  <span style="color:var(--ink)">2,495 ms</span>  —  the lab is harsher than the field, and the ratio survives</div>

      ${penSvg("p-same", boxD(px(6836) - 168, 762, 340, 108, 9), 4, "")}
      ${stamp("st14", "NOT EARLY. LAST.", { x: 1416, y: 196 })}
    </div></div>`;

  const script = `${ENTER[seamIn]("#stage")}
${headerIn(0.10, false)}
      gsap.set(["#f-note", "#f-s-n", "#f-c-n", "#f-s-b", "#f-c-b", "#f-s-l", "#f-c-l", "#f-s-ll", "#f-c-ll", "#f-say", "#f-crux"], { autoAlpha: 0 });
      gsap.set(["#f-s-fill", "#f-c-fill"], { scaleX: 0 });
      gsap.set(".f-track", { autoAlpha: 0 });
      tl.fromTo("#f-note", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.36, ease: "power3.out" }, 0.22);
      tl.fromTo(".f-track", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.30, stagger: 3.10 }, 0.42);

      // ---- the static row. The bar runs to first paint while the figure counts to it,
      // so the number and the distance are one gesture rather than two.
      tl.fromTo("#f-s-n", { autoAlpha: 0, x: -16 }, { autoAlpha: 1, x: 0, duration: 0.34, ease: "power3.out" }, 0.56);
      tl.set("#f-s-b", { autoAlpha: 1 }, 0.86);
${countTo("f-s-num", 0.86, 0, 1728, 1.10, "Math.round(v).toLocaleString('en-US')", "power2.out")}
      tl.fromTo("#f-s-fill", { scaleX: 0 }, { scaleX: ${(1728 / 8000).toFixed(4)}, duration: 1.10, ease: "power2.out" }, 0.86);
      tl.fromTo("#f-s-l", { autoAlpha: 0, scaleY: 0 }, { autoAlpha: 1, scaleY: 1, duration: 0.24, ease: "power3.out", transformOrigin: "50% 100%" }, 2.20);
      tl.fromTo("#f-s-ll", { autoAlpha: 0, y: -10 }, { autoAlpha: 1, y: 0, duration: 0.30, ease: "power3.out" }, 2.32);

      // ---- the client row, at the same tempo but four times the distance. It is slow
      // BECAUSE the value is large: the bar is the measurement, not an effect.
      tl.fromTo("#f-c-n", { autoAlpha: 0, x: -16 }, { autoAlpha: 1, x: 0, duration: 0.34, ease: "power3.out" }, 3.66);
      tl.set("#f-c-b", { autoAlpha: 1 }, 3.96);
${countTo("f-c-num", 3.96, 0, 6836, 2.90, "Math.round(v).toLocaleString('en-US')", "none")}
      tl.fromTo("#f-c-fill", { scaleX: 0 }, { scaleX: ${(6836 / 8000).toFixed(4)}, duration: 2.90, ease: "none" }, 3.96);
      tl.fromTo("#f-c-l", { autoAlpha: 0, scaleY: 0 }, { autoAlpha: 1, scaleY: 1, duration: 0.24, ease: "power3.out", transformOrigin: "50% 100%" }, 6.80);
      tl.fromTo("#f-c-ll", { autoAlpha: 0, y: -10 }, { autoAlpha: 1, y: 0, duration: 0.30, ease: "power3.out" }, 6.92);

      // the mark lands on the coincidence: first paint and the load event, one box.
${penDraw("p-same", 8.20, 0.58)}
      tl.fromTo("#f-say", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.48, ease: "power3.out" }, 9.60);
${stampIn("st14", 11.60)}

      // The honest caveat, and the thing that stops the frame being dead for its last
      // two and a half seconds: the CrUX field numbers for the same two URLs. The lab
      // conditions here are harsher than most real users see — and the ratio holds.
      tl.fromTo("#f-crux", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.42, ease: "power3.out" }, 12.66);

      // ---- STILLNESS. Nothing moves from 14.9s to the cut at 15.65, and the Z-BACK
      // lands into it. 0.75s is the designed length; the first cut of this frame left
      // 2.5s, which is a hole rather than an emphasis.`;

  return { body, script };
}
