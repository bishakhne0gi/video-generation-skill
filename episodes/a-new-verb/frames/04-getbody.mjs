// EP27 · 04 GETBODY — the obvious fix, and the sentence that kills it.
// The quote is VERBATIM from RFC 9110 §9.3.1, elided once and marked with an ellipsis.
import { field, enterAcross, exitAcross, header, headerIn, penPath, penIn, ellipseD, crossD, marker, markerIn, tilt } from "../lib/frame.mjs";

const REQ = [
  ["GET", " /products HTTP/1.1"],
  ["", "Host: api.shop.example"],
  ["", "Content-Type: application/json"],
  ["", ""],
  ["", '{ "ids": [ "THYHW4EGYP8108V7", … 399 more ],'],
  ["", '  "sort": "-rating,price" }'],
];

// verbatim, one elision
const QUOTE = [
  ["content received in a GET request", 0],
  ["has no generally defined semantics …", 1],
  ["might lead some implementations to", 0],
  ["reject the request and close the", 0],
  ["connection because of its potential", 0],
  ["as a request smuggling attack", 2],
];

export function build({ len }) {
  const QX = 942, QY = 452, LH = 62, FS = 45;
  const lines = QUOTE.map(([t], i) =>
    `<div id="f4-q${i}" class="phrase quote" style="position:absolute;left:${QX}px;top:${QY + i * LH}px;font-size:${FS}px;white-space:nowrap">${t}</div>`).join("");

  const cross = crossD(478, 640, 210, 9);
  const circ  = ellipseD(QX + 236, QY + 5 * LH + 22, 258, 44, 6);

  const body = `${field("paper")}
    <div id="stage" class="stage"><div class="inner">
      ${header("04", "the obvious fix", "PUT IT<br>IN THE BODY.", "")}

      <!-- the request nobody is allowed to send -->
      <div class="sheet" style="left:118px;top:452px;width:720px;height:376px;transform:rotate(${tilt(4)}deg)"></div>
      <div style="position:absolute;left:118px;top:452px;width:720px;height:376px;overflow:hidden;transform:rotate(${tilt(4)}deg)">
        <div class="tag" style="position:absolute;left:34px;top:26px;font-size:16px">WHAT YOU WANT TO SEND</div>
        <div class="hair" style="left:34px;top:58px;width:652px"></div>
        ${REQ.map((r, i) => `<div id="f4-r${i}" class="mono" style="position:absolute;left:34px;top:${86 + i * 40}px;font-size:${i === 0 ? 27 : 22}px;${i === 0 ? "font-weight:700;" : "color:var(--ink2);"}white-space:nowrap">${r[0] ? `<span style="color:var(--ink)">${r[0]}</span>` : ""}${r[1].replace(/</g, "&lt;")}</div>`).join("")}
      </div>

      <!-- the marker sits BEHIND its line; the phrase carries z-index 1 -->
      ${marker("f4-mk", QX - 8, QY + LH + 8, 838, 52)}
      ${lines}
      <div id="f4-cite" class="tag" style="position:absolute;left:${QX}px;top:${QY + 6 * LH + 26}px;font-size:19px;opacity:0">RFC 9110 §9.3.1 · HTTP SEMANTICS</div>

      <div id="f4-verdict" class="mono" style="position:absolute;left:118px;top:868px;width:760px;font-size:30px;font-weight:700;color:var(--pentype);opacity:0">GET cannot legally carry this.</div>

      ${penPath("f4-cir", circ.d, circ.len, 6)}
      ${penPath("f4-x", cross.d, cross.len, 9)}
    </div></div>`;

  let s = `${enterAcross("#stage")}${headerIn(0.10, false)}\n`;
  REQ.forEach((_, i) => {
    s += `      gsap.set("#f4-r${i}", { autoAlpha: 0 });\n`;
    s += `      tl.fromTo("#f4-r${i}", { autoAlpha: 0, x: -14 }, { autoAlpha: 1, x: 0, duration: 0.20, ease: "steps(3)" }, ${(0.42 + i * 0.17).toFixed(2)});\n`;
  });
  QUOTE.forEach((_, i) => {
    s += `      gsap.set("#f4-q${i}", { autoAlpha: 0 });\n`;
    s += `      tl.fromTo("#f4-q${i}", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.36, ease: "power3.out" }, ${(1.60 + i * 0.62).toFixed(2)});\n`;
  });
  s += `${markerIn("f4-mk", 5.60, 0.44)}
${penIn("f4-cir", circ.len, 7.00, 0.82)}
      tl.fromTo("#f4-cite", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.26, ease: "steps(4)" }, 8.00);
      // the correction lands on the request LAST — a mark that arrives with the thing it
      // marks is part of the layout; a mark that arrives late is somebody pointing.
${penIn("f4-x", cross.len, 9.40, 0.46)}
      tl.fromTo("#f4-verdict", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.36, ease: "power3.out" }, 10.30);
      tl.to(["#f4-r0","#f4-r1","#f4-r2","#f4-r4","#f4-r5"], { autoAlpha: 0.42, duration: 0.50, ease: "power2.out" }, 10.60);
${exitAcross("#stage", len - 0.34)}`;

  return { body, script: s };
}
