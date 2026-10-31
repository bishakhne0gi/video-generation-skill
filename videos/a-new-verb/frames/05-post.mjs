// EP27 · 05 POST — the workaround, shown WORKING. The film has to concede this beat
// honestly or the next one has nothing to take away.
import { field, enterAcross, exitAcross, header, headerIn, penPath, penIn, arrowD, marker, markerIn, tilt } from "../lib/frame.mjs";

const REQ = ["POST /products HTTP/1.1", "Host: api.shop.example", "Content-Type: application/json", "", '{ "ids": [ … 400 ], "sort": "-rating,price" }'];
const RES = ["HTTP/1.1 200 OK", "Content-Type: application/json", "Cache-Control: no-store", "", '{ "results": [ … 48 ], "total": 400 }'];

export function build({ len }) {
  const arw = arrowD(866, 604, 1058, 604, -34);

  const sheet = (id, x, tag, lines, hot) => `
      <div class="sheet" style="left:${x}px;top:452px;width:748px;height:352px;transform:rotate(${tilt(x)}deg)"></div>
      <div style="position:absolute;left:${x}px;top:452px;width:748px;height:352px;overflow:hidden;transform:rotate(${tilt(x)}deg)">
        <div class="tag" style="position:absolute;left:34px;top:26px;font-size:16px">${tag}</div>
        <div class="hair" style="left:34px;top:58px;width:680px"></div>
        ${lines.map((L, i) => `<div id="${id}-${i}" class="mono" style="position:absolute;left:34px;top:${86 + i * 40}px;font-size:${i === 0 ? 26 : 22}px;${i === 0 ? "font-weight:700;color:var(--ink);" : "color:var(--ink2);"}white-space:nowrap">${L}</div>`).join("")}
      </div>`;

  const body = `${field("paper")}
    <div id="stage" class="stage"><div class="inner">
      ${header("05", "the workaround", "SO EVERYONE<br>USED POST.", "")}

      ${sheet("f5-q", 96, "THE REQUEST", REQ)}
      ${sheet("f5-a", 1076, "THE RESPONSE", RES)}

      <div style="position:absolute;left:96px;top:848px;width:1160px">
        ${marker("f5-mk", -8, 8, 356, 54)}
        <div class="phrase quote" style="position:relative;font-size:52px">And it works.</div>
        <div id="f5-sub" class="deck" style="position:absolute;left:420px;top:14px;width:740px;font-size:29px;opacity:0">Forty-eight results, every time. Nobody had a better option.</div>
      </div>

      ${penPath("f5-arw", arw.d, arw.len, 6)}
    </div></div>`;

  let s = `${enterAcross("#stage")}${headerIn(0.10, false)}\n`;
  REQ.forEach((_, i) => {
    s += `      gsap.set("#f5-q-${i}", { autoAlpha: 0 });\n`;
    s += `      tl.fromTo("#f5-q-${i}", { autoAlpha: 0, x: -12 }, { autoAlpha: 1, x: 0, duration: 0.18, ease: "steps(3)" }, ${(0.40 + i * 0.16).toFixed(2)});\n`;
  });
  s += `${penIn("f5-arw", arw.len, 1.46, 0.40)}\n`;
  RES.forEach((_, i) => {
    s += `      gsap.set("#f5-a-${i}", { autoAlpha: 0 });\n`;
    s += `      tl.fromTo("#f5-a-${i}", { autoAlpha: 0, x: -12 }, { autoAlpha: 1, x: 0, duration: 0.18, ease: "steps(3)" }, ${(1.94 + i * 0.16).toFixed(2)});\n`;
  });
  s += `${markerIn("f5-mk", 3.10, 0.40)}
      tl.fromTo("#f5-sub", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.40, ease: "power3.out" }, 3.70);
      // the request runs again, and again, because that is the point of this beat: the
      // workaround is not broken. Two more round trips, on twos.
      tl.fromTo("#f5-arw", { autoAlpha: 1 }, { autoAlpha: 0.28, duration: 0.24, ease: "steps(3)", yoyo: true, repeat: 1 }, 4.70);
      tl.fromTo("#f5-arw", { autoAlpha: 1 }, { autoAlpha: 0.28, duration: 0.24, ease: "steps(3)", yoyo: true, repeat: 1 }, 6.00);
      tl.fromTo(["#f5-a-0","#f5-a-1","#f5-a-2","#f5-a-4"], { autoAlpha: 1 }, { autoAlpha: 0.35, duration: 0.20, ease: "steps(3)", yoyo: true, repeat: 1, stagger: 0.05 }, 5.00);
      tl.fromTo(["#f5-a-0","#f5-a-1","#f5-a-2","#f5-a-4"], { autoAlpha: 1 }, { autoAlpha: 0.35, duration: 0.20, ease: "steps(3)", yoyo: true, repeat: 1, stagger: 0.05 }, 6.30);
${exitAcross("#stage", len - 0.34)}`;

  return { body, script: s };
}
