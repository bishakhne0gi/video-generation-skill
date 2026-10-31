// EP27 · 06 NOTAPPARENT — the pivot. The request is fine; what the PATH can tell about
// it is not. The chain is the frame's running system: the request card travels it end to
// end twice, which is the large-area motion this beat is built on.
import { field, enterAcross, exitAcross, header, headerIn, penPath, penIn, marker, markerIn, tilt } from "../lib/frame.mjs";

const HOPS = [
  ["CLIENT", "sends it"],
  ["BROWSER CACHE", "can I store this?"],
  ["CDN EDGE", "can I store this?"],
  ["REVERSE PROXY", "can I retry this?"],
  ["ORIGIN", "runs the query"],
];

export function build({ len }) {
  const X0 = 112, NW = 306, GAP = 42, Y = 452, NH = 178;
  const nodes = HOPS.map(([name, q], i) => {
    const x = X0 + i * (NW + GAP);
    const mid = i > 0 && i < 4;
    return `
      <div id="f6-n${i}" class="card" style="left:${x}px;top:${Y}px;width:${NW}px;height:${NH}px;transform:rotate(${tilt(i + 40)}deg)"></div>
      <div style="position:absolute;left:${x}px;top:${Y}px;width:${NW}px;height:${NH}px;transform:rotate(${tilt(i + 40)}deg)">
        <div class="mono" style="position:absolute;left:24px;top:26px;font-size:${name.length > 12 ? 22 : 25}px;font-weight:700">${name}</div>
        <div class="hair" style="left:24px;top:66px;width:${NW - 48}px"></div>
        <div class="deck" style="position:absolute;left:24px;top:82px;width:${NW - 48}px;font-size:23px">${q}</div>
        ${mid ? `<div id="f6-a${i}" class="mono" style="position:absolute;left:24px;top:126px;font-size:26px;font-weight:700;color:var(--pentype);opacity:0">no idea</div>` : ""}
      </div>`;
  }).join("");

  const rail = { d: `M${X0 + NW + 6},${Y + NH + 46} L${X0 + 4 * (NW + GAP) - 6},${Y + NH + 46}`, len: 1320 };
  const TRAVEL = 4 * (NW + GAP);

  const body = `${field("paper")}
    <div id="stage" class="stage"><div class="inner">
      ${header("06", "what the path sees", "NOTHING HERE<br>SAYS &ldquo;READ&rdquo;.", "")}

      ${nodes}
      ${penPath("f6-rail", rail.d, rail.len, 3)}

      <!-- the request itself, travelling. It is the same req#4f2a the corner tab follows. -->
      <div id="f6-pkt" style="position:absolute;left:${X0 + 40}px;top:${Y + NH + 20}px;width:212px;height:52px">
        <div class="card" style="position:absolute;inset:0;background:var(--ink)"></div>
        <div class="mono" style="position:absolute;left:0;top:13px;width:212px;text-align:center;font-size:22px;font-weight:700;color:var(--sheet)">POST /products</div>
      </div>

      <div style="position:absolute;left:112px;top:${Y + NH + 132}px;width:1700px">
        ${marker("f6-mk", -8, 8, 660, 56)}
        <div class="phrase quote" style="position:relative;font-size:50px">it is not readily apparent …</div>
        <div id="f6-q2" class="quote" style="position:absolute;left:0;top:66px;font-size:50px;opacity:0">… that a safe, idempotent query is being performed</div>
        <div id="f6-cite" class="tag" style="position:absolute;left:2px;top:140px;font-size:19px;opacity:0">RFC 10008 §1 · THE HTTP QUERY METHOD</div>
      </div>
    </div></div>`;

  let s = `${enterAcross("#stage")}${headerIn(0.10, false)}\n`;
  HOPS.forEach((_, i) => {
    s += `      gsap.set("#f6-n${i}", { autoAlpha: 0 });\n`;
    s += `      tl.fromTo("#f6-n${i}", { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.22, ease: "steps(3)" }, ${(0.36 + i * 0.14).toFixed(2)});\n`;
  });
  s += `${penIn("f6-rail", rail.len, 1.10, 0.60)}
      // pass one: the request crosses the whole chain. Nothing about it is legible to
      // anything in the middle, so each intermediary answers the same way.
      tl.fromTo("#f6-pkt", { x: 0 }, { x: ${TRAVEL}, duration: 3.10, ease: "none" }, 1.70);
      tl.fromTo("#f6-a1", { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.18, ease: "steps(3)" }, 2.62);
      tl.fromTo("#f6-a2", { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.18, ease: "steps(3)" }, 3.48);
      tl.fromTo("#f6-a3", { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.18, ease: "steps(3)" }, 4.34);
      // pass two: it goes again, because a query that cannot be cached is a query that
      // gets sent again. Same travel, same answers, and that IS the cost.
      tl.fromTo("#f6-pkt", { x: 0 }, { x: ${TRAVEL}, duration: 3.10, ease: "none" }, 5.60);
${markerIn("f6-mk", 5.90, 0.46)}
      tl.fromTo("#f6-q2", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.38, ease: "power3.out" }, 6.60);
      tl.fromTo("#f6-cite", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.24, ease: "steps(4)" }, 7.30);
${exitAcross("#stage", len - 0.34)}`;

  return { body, script: s };
}
