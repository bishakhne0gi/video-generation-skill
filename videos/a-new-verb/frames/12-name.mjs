// EP27 · 12 NAME — the light beat before the honest ending. Appendix B, quoted verbatim,
// because the working group's own sentence is funnier than anything I would write.
import { field, enterLift, exitAcross, header, headerIn, penPath, penIn, crossD, marker, markerIn, tilt } from "../lib/frame.mjs";

const OLD = [
  ["PROPFIND", "RFC 4918", "WebDAV"],
  ["REPORT",   "RFC 3253", "WebDAV Versioning"],
  ["SEARCH",   "RFC 5323", "WebDAV SEARCH"],
];

export function build({ len }) {
  const X0 = 112, CW = 452, CG = 30, CY = 420, CH = 224;
  const cards = OLD.map(([m, rfc, org], i) => {
    const x = X0 + i * (CW + CG);
    return `
      <div id="f12-c${i}" class="card" style="left:${x}px;top:${CY}px;width:${CW}px;height:${CH}px;transform:rotate(${tilt(i + 80)}deg)"></div>
      <div id="f12-c${i}t" style="position:absolute;left:${x}px;top:${CY}px;width:${CW}px;height:${CH}px;transform:rotate(${tilt(i + 80)}deg)">
        <div class="mono" style="position:absolute;left:26px;top:26px;font-size:32px;font-weight:700">${m}</div>
        <div class="hair" style="left:26px;top:76px;width:${CW - 52}px"></div>
        <div class="deck" style="position:absolute;left:26px;top:92px;font-size:25px">safe &middot; idempotent</div>
        <div class="deck" style="position:absolute;left:26px;top:126px;font-size:25px">already in the registry</div>
        <div class="tag" style="position:absolute;left:26px;top:174px;font-size:17px">${rfc} · ${org.toUpperCase()}</div>
      </div>`;
  }).join("");

  const crosses = OLD.map((_, i) => crossD(X0 + i * (CW + CG) + CW / 2, CY + CH / 2, 84, i * 5 + 2));

  const body = `${field("paper")}
    <div id="stage" class="stage"><div class="inner">
      ${header("12", "the name", "IT NEARLY<br>WASN'T QUERY.", "")}

      <div class="tag" style="position:absolute;left:${X0}px;top:${CY - 38}px;font-size:18px">THREE SAFE, IDEMPOTENT METHODS ALREADY EXISTED</div>
      ${cards}
      ${crosses.map((c, i) => penPath(`f12-x${i}`, c.d, c.len, 7)).join("\n      ")}

      <div style="position:absolute;left:${X0}px;top:${CY + CH + 56}px;width:1720px">
        ${marker("f12-mk", -8, 76, 1002, 56)}
        <div class="quote" style="position:absolute;left:0;top:0;font-size:50px">they all originate from the WebDAV activity,</div>
        <div id="f12-q2" class="phrase quote" style="position:relative;top:68px;font-size:50px">about which many have mixed feelings</div>
        <div id="f12-cite" class="tag" style="position:absolute;left:2px;top:150px;font-size:19px;opacity:0">RFC 10008 APPENDIX B · SELECTION OF THE METHOD NAME 'QUERY'</div>
      </div>

      <div id="f12-chip" class="card" style="left:1264px;top:${CY + CH + 250}px;width:552px;height:104px;display:flex;align-items:center;justify-content:center;opacity:0">
        <span class="mono" style="font-size:46px;font-weight:700">QUERY</span>
      </div>
      <div id="f12-why" class="card" style="left:1264px;top:${CY + CH + 44}px;width:552px;height:186px;transform:rotate(${tilt(88)}deg);opacity:0"></div>
      <div id="f12-whyt" style="position:absolute;left:1264px;top:${CY + CH + 44}px;width:552px;height:186px;transform:rotate(${tilt(88)}deg);opacity:0">
        <div class="tag" style="position:absolute;left:26px;top:22px;font-size:17px">SO INSTEAD</div>
        <div class="deck" style="position:absolute;left:26px;top:54px;width:500px;font-size:27px;color:var(--ink)">&ldquo;QUERY&rdquo; captures the relation with the URI's query component well.</div>
      </div>
    </div></div>`;

  let s = `${enterLift("#stage")}${headerIn(0.10, false)}\n`;
  OLD.forEach((_, i) => {
    s += `      gsap.set(["#f12-c${i}","#f12-c${i}t"], { autoAlpha: 0 });\n`;
    s += `      tl.to(["#f12-c${i}","#f12-c${i}t"], { autoAlpha: 1, duration: 0.22, ease: "steps(3)" }, ${(0.50 + i * 0.34).toFixed(2)});\n`;
  });
  s += `      // the first quote line is a seam-safe printed line; only the second is marked
      gsap.set("#f12-q2", { autoAlpha: 0 });
      tl.fromTo("#f12-q2", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.38, ease: "power3.out" }, 2.40);
${markerIn("f12-mk", 3.20, 0.50)}
      tl.fromTo("#f12-cite", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.24, ease: "steps(4)" }, 3.90);
`;
  crosses.forEach((c, i) => { s += penIn(`f12-x${i}`, c.len, 4.90 + i * 1.05, 0.34); });
  s += `
      tl.to(["#f12-c0t","#f12-c1t","#f12-c2t"], { autoAlpha: 0.46, duration: 0.44, ease: "power2.out", stagger: 0.12 }, 5.40);
      tl.to(["#f12-why","#f12-whyt"], { autoAlpha: 1, duration: 0.26, ease: "steps(4)" }, 8.20);
      tl.fromTo("#f12-chip", { autoAlpha: 0, y: -46, rotation: -7 }, { autoAlpha: 1, y: 0, rotation: 1.4, duration: 0.34, ease: "steps(5)" }, 9.70);
${exitAcross("#stage", len - 0.34)}`;

  return { body, script: s };
}
