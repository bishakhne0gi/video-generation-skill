// 01 OPEN — the evidence, before the argument.
//
// Everything on this frame was taken from the live web on 2026-08-23 and nothing is
// illustrative. The two byte counts are `curl … | wc -c` against the real origins; the
// status, cache and TTFB rows are read off the real response headers and a real Chrome
// trace. The frame's whole job is to establish that the network is NOT the difference,
// so that every later number is read as being about the document instead.
import { page, header, headerIn, well, wellIn, typeOn, countTo, stamp, stampIn,
  penSvg, penDraw, boxD, ENTER } from "../lib/frame.mjs";

export function build({ seamIn }) {
  const RAIL = 1360;
  const C1 = RAIL + 208, C2 = RAIL + 330;   // the two value columns in the rail
  const rows = [
    ["status", "200", "200"],
    ["cache", "HIT", "HIT"],
    ["ttfb", "16 ms", "74 ms"],
  ];

  const body = `${page("canvas")}
    <div id="stage" class="stage"><div class="inner">
      ${header("EP 29 · RENDERING STRATEGIES",
        "The same request,<br>answered twice.",
        "Two live sites. One phone. One minute. Now read what actually came back.",
        false, 84, 1080)}

      ${well("w1", {
        x: 112, y: 530, w: 1180, h: 372, deep: true, tabs: ["curl", "· 2026-08-23"], on: -1,
        text: null,
        extra: `
        <div id="w1-a" class="wellbody" style="top:78px;font-size:26px">$ curl -s https://jekyllrb.com/    | wc -c</div>
        <div id="w1-r1" class="wellbody hot" style="top:126px;font-size:38px">0</div>
        <div id="w1-b" class="wellbody" style="top:214px;font-size:26px">$ curl -s https://excalidraw.com/  | wc -c</div>
        <div id="w1-r2" class="wellbody hot" style="top:262px;font-size:38px">0</div>`,
      })}

      <div id="r-slug" class="slug" style="position:absolute;left:${RAIL}px;top:534px">Both responses</div>
      <div id="r-h0" class="hair" style="left:${RAIL}px;top:578px;width:448px;transform-origin:0% 50%"></div>
      ${rows.map(([k, a, b], i) => {
        const y = 606 + i * 74;
        return `
      <div class="r-row" style="position:absolute;left:${RAIL}px;top:${y}px;width:448px">
        <span class="body" style="font-size:22px;color:var(--mute)">${k}</span>
        <span class="monob" style="position:absolute;left:${C1 - RAIL}px;font-size:26px">${a}</span>
        <span class="monob" style="position:absolute;left:${C2 - RAIL}px;font-size:26px">${b}</span>
      </div>
      <div class="r-hr hair" style="left:${RAIL}px;top:${y + 50}px;width:448px"></div>`;
      }).join("")}
      <div id="r-leg" class="mono" style="position:absolute;left:${RAIL}px;top:846px;width:460px;font-size:18px;color:var(--charcoal);line-height:1.5">jekyllrb.com&nbsp;&nbsp;·&nbsp;&nbsp;excalidraw.com<br>Slow 4G, 4× CPU, cold cache</div>

      ${penSvg("p-ttfb", boxD(RAIL - 16, 742, 484, 62, 7), 4, "ink")}
      ${stamp("st1", "SAME 200. SAME CACHE.", { x: 112, y: 968 })}
    </div></div>`;

  const script = `${seamIn ? ENTER[seamIn]("#stage") : ""}
${headerIn(0.10)}
      // the sheet's furniture is staged, never dumped: the rail rules draw, the rows
      // arrive one at a time, and the frame is still delivering at nine seconds.
      gsap.set(["#w1-r1", "#w1-r2", ".r-row", ".r-hr", "#r-slug", "#r-leg"], { autoAlpha: 0 });
      gsap.set("#r-h0", { scaleX: 0 });
${wellIn("w1", 0.30)}
${typeOn("w1-a", 0.58, 0.90, 46, 41)}
      tl.set("#w1-r1", { autoAlpha: 1 }, 1.72);
${countTo("w1-r1", 1.72, 0, 10393, 0.62)}
${typeOn("w1-b", 2.94, 0.92, 46, 42)}
      tl.set("#w1-r2", { autoAlpha: 1 }, 4.08);
${countTo("w1-r2", 4.08, 0, 6862, 0.56)}

      tl.fromTo("#r-slug", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.34, ease: "power3.out" }, 5.20);
      tl.to("#r-h0", { scaleX: 1, duration: 0.44, ease: "power3.out" }, 5.34);
      tl.fromTo(".r-row", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.38, ease: "power3.out", stagger: 0.36 }, 5.62);
      tl.fromTo(".r-hr", { scaleX: 0 }, { scaleX: 1, duration: 0.34, ease: "power3.out", stagger: 0.36, transformOrigin: "0% 50%" }, 5.74);
      tl.fromTo("#r-leg", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.36, ease: "power3.out" }, 7.30);

${stampIn("st1", 8.62)}
      // the mark lands LAST and it lands on the row that carries the argument: the
      // network delivered both pages in the same breath.
${penDraw("p-ttfb", 9.30, 0.52)}`;

  return { body, script };
}
