// EP27 · 09 QUERY — the fix, shown as a copy-editor's correction: POST struck, QUERY
// written in above it, and NOTHING else on the request touched. That is the argument.
// The response teaches the two headers people confuse, straight out of §2.3 and §2.4.
import { field, enterAcross, exitAcross, header, headerIn, penPath, penIn, arrowD, marker, markerIn, tilt } from "../lib/frame.mjs";

const REQ = ["", "Host: api.shop.example", "Content-Type: application/json", "", '{ "ids": [ … 400 ], "sort": "-rating,price" }'];
const RES = ["HTTP/1.1 200 OK", "Content-Type: application/json", "Content-Location: /products/r/8f21", "Location:         /products/q/4f2a"];

export function build({ len }) {
  const RX = 112, RW = 716, RY = 436, RH = 320;
  const SX = 884, SW = 924;
  const strike = { d: "M137,564 Q174,557 219,566", len: 94 };
  const a1 = arrowD(1064, 816, 1040, 700, 34);
  const a2 = arrowD(1520, 816, 1342, 702, 44);

  const note = (id, x, w, h, label, text) => `
      <div id="${id}" class="card" style="left:${x}px;top:824px;width:${w}px;height:${h}px;transform:rotate(${tilt(x)}deg)"></div>
      <div id="${id}-t" style="position:absolute;left:${x}px;top:824px;width:${w}px;height:${h}px;transform:rotate(${tilt(x)}deg)">
        <div class="mono" style="position:absolute;left:24px;top:20px;font-size:24px;font-weight:700">${label}</div>
        <div class="deck" style="position:absolute;left:24px;top:58px;width:${w - 48}px;font-size:25px">${text}</div>
      </div>`;

  const body = `${field("paper2")}
    <div id="stage" class="stage"><div class="inner">
      ${header("09", "the fix", "CHANGE<br>ONE WORD.", "")}

      <div class="sheet" style="left:${RX}px;top:${RY}px;width:${RW}px;height:${RH}px;transform:rotate(${tilt(90)}deg)"></div>
      <div style="position:absolute;left:${RX}px;top:${RY}px;width:${RW}px;height:${RH}px;overflow:hidden;transform:rotate(${tilt(90)}deg)">
        <div class="tag" style="position:absolute;left:32px;top:24px;font-size:16px">THE REQUEST</div>
        <div class="hair" style="left:32px;top:54px;width:${RW - 64}px"></div>
        <div id="f9-was" class="mono" style="position:absolute;left:32px;top:112px;font-size:27px;font-weight:700;color:var(--ink)">POST</div>
        <div id="f9-now" class="mono" style="position:absolute;left:32px;top:70px;font-size:27px;font-weight:700;color:var(--pentype);opacity:0">QUERY</div>
        <div id="f9-path" class="mono" style="position:absolute;left:150px;top:112px;font-size:27px;font-weight:700">/products HTTP/1.1</div>
        <div id="f9-get" class="mono" style="position:absolute;left:32px;top:112px;font-size:27px;font-weight:700;white-space:nowrap;opacity:0">GET /products/q/4f2a</div>
        ${REQ.map((L, i) => i === 0 ? "" : `<div id="f9-b${i}" class="mono" style="position:absolute;left:32px;top:${112 + i * 40}px;font-size:22px;color:var(--ink2);white-space:nowrap">${L}</div>`).join("")}
        <div id="f9-nobody" class="mono" style="position:absolute;left:32px;top:232px;font-size:23px;font-weight:700;color:var(--pentype);white-space:nowrap;opacity:0">no body resent &middot; same answer</div>
      </div>
      <div id="f9-same" class="tag" style="position:absolute;left:${RX + 4}px;top:${RY + RH + 22}px;font-size:19px;opacity:0">EVERYTHING BELOW THE VERB IS UNCHANGED</div>

      <div class="sheet" style="left:${SX}px;top:${RY}px;width:${SW}px;height:${RH}px;transform:rotate(${tilt(91)}deg)"></div>
      <div style="position:absolute;left:${SX}px;top:${RY}px;width:${SW}px;height:${RH}px;overflow:hidden;transform:rotate(${tilt(91)}deg)">
        <div class="tag" style="position:absolute;left:32px;top:24px;font-size:16px">THE RESPONSE</div>
        <div class="hair" style="left:32px;top:54px;width:${SW - 64}px"></div>
        ${RES.map((L, i) => `<div id="f9-s${i}" class="mono" style="position:absolute;left:32px;top:${76 + i * 46}px;font-size:${i === 0 ? 27 : 25}px;${i === 0 ? "font-weight:700;" : i > 1 ? "font-weight:700;color:var(--ink);" : "color:var(--ink2);"}white-space:nowrap">${L}</div>`).join("")}
      </div>

      ${note("f9-n1", 884, 430, 178, "Content-Location", "The RESULTS. GET this to read the same answer again.")}
      ${note("f9-n2", 1378, 430, 178, "Location", "The QUERY. GET this to run it again, without resending the body.")}

      <div style="position:absolute;left:${RX}px;top:846px;width:720px">
        ${marker("f9-mk", -8, 8, 726, 54)}
        <div class="phrase quote" style="position:relative;font-size:50px">Same body. Same media type.</div>
      </div>

      ${penPath("f9-x", strike.d, strike.len, 6)}
      ${penPath("f9-a1", a1.d, a1.len, 5)}
      ${penPath("f9-a2", a2.d, a2.len, 5)}
    </div></div>`;

  let s = `${enterAcross("#stage")}${headerIn(0.10, false)}
      // the correction: the old verb is struck, the new one written in above it
${penIn("f9-x", strike.len, 0.90, 0.30)}
      tl.fromTo("#f9-now", { autoAlpha: 0, y: 12, rotation: -3 }, { autoAlpha: 1, y: 0, rotation: -1.6, duration: 0.26, ease: "steps(4)" }, 1.24);
      tl.to("#f9-was", { autoAlpha: 0.40, duration: 0.34, ease: "power2.out" }, 1.24);
      tl.fromTo("#f9-same", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.24, ease: "steps(4)" }, 1.90);
`;
  RES.forEach((_, i) => {
    s += `      gsap.set("#f9-s${i}", { autoAlpha: 0 });\n`;
    s += `      tl.fromTo("#f9-s${i}", { autoAlpha: 0, x: -12 }, { autoAlpha: 1, x: 0, duration: 0.20, ease: "steps(3)" }, ${(2.40 + i * 0.34).toFixed(2)});\n`;
  });
  s += `      gsap.set(["#f9-n1","#f9-n1-t","#f9-n2","#f9-n2-t"], { autoAlpha: 0 });
      tl.to(["#f9-n1","#f9-n1-t"], { autoAlpha: 1, duration: 0.24, ease: "steps(4)" }, 4.60);
${penIn("f9-a1", a1.len, 4.86, 0.44)}
      tl.to(["#f9-n2","#f9-n2-t"], { autoAlpha: 1, duration: 0.24, ease: "steps(4)" }, 6.10);
${penIn("f9-a2", a2.len, 6.36, 0.48)}
${markerIn("f9-mk", 6.90, 0.46)}
      // ---- the second request. Location's whole purpose, performed rather than captioned:
      // the client switches to GET on the equivalent resource and stops sending the body.
      tl.to(["#f9-now","#f9-was","#f9-path"], { autoAlpha: 0, duration: 0.20, ease: "steps(3)" }, 7.90);
      tl.to("#f9-x", { autoAlpha: 0, duration: 0.20, ease: "steps(3)" }, 7.90);
      tl.fromTo("#f9-get", { autoAlpha: 0, x: -18 }, { autoAlpha: 1, x: 0, duration: 0.26, ease: "steps(4)" }, 8.00);
      tl.to(["#f9-b2","#f9-b4"], { autoAlpha: 0.16, duration: 0.34, ease: "power2.out", stagger: 0.08 }, 8.10);
      tl.fromTo("#f9-nobody", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.24, ease: "steps(4)" }, 8.44);
      tl.to("#f9-n2", { scale: 1.03, duration: 0.30, ease: "power2.out" }, 8.44);
      tl.to("#f9-n2-t", { scale: 1.03, duration: 0.30, ease: "power2.out" }, 8.44);
${exitAcross("#stage", len - 0.34)}`;

  return { body, script: s };
}
