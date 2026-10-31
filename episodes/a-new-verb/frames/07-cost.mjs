// EP27 · 07 COST — the thesis. Two promises withheld, four capabilities lost. The status
// words are the RFC's OWN wording from Table 1, not a paraphrase.
// Exits on the Z-BACK: the reserved vector, spent once, on the turn.
import { field, enterAcross, exitZBack, header, headerIn, penPath, penIn, crossD, marker, markerIn, readout, readoutIn, tilt } from "../lib/frame.mjs";

const PROMISE = [
  ["SAFE", "the client does not request or expect any change to the state of the target resource", "potentially no"],
  ["IDEMPOTENT", "the request can be retried or repeated when needed, after a connection failure", "potentially no"],
];
const LOST = ["STORE IT IN A CACHE", "RETRY IT AUTOMATICALLY", "PREFETCH IT", "GIVE THE QUERY A URL"];
const SENT = [0, 240, 690, 1340, 2180, 3110, 4120, 5180, 6240, 7220, 8090, 8760, 9140].map((n) => n.toLocaleString("en-US"));

export function build({ len }) {
  const CX = 112, CW = 764, CY = 430, CH = 200;
  const cards = PROMISE.map(([w, d, v], i) => {
    const y = CY + i * (CH + 22);
    return `
      <div class="card" style="left:${CX}px;top:${y}px;width:${CW}px;height:${CH}px;transform:rotate(${tilt(i + 60)}deg)"></div>
      <div style="position:absolute;left:${CX}px;top:${y}px;width:${CW}px;height:${CH}px;transform:rotate(${tilt(i + 60)}deg)">
        <div class="mono" style="position:absolute;left:30px;top:24px;font-size:32px;font-weight:700">${w}</div>
        <div class="deck" style="position:absolute;left:30px;top:70px;width:${CW - 60}px;font-size:25px">${d}</div>
        <div class="hair" style="left:30px;top:${CH - 58}px;width:${CW - 60}px"></div>
        <div class="tag" style="position:absolute;left:30px;top:${CH - 44}px;font-size:17px">POST</div>
        <div id="f7-v${i}" class="mono" style="position:absolute;right:30px;top:${CH - 48}px;font-size:24px;font-weight:700;color:var(--pentype);opacity:0">${v}</div>
      </div>`;
  }).join("");

  const LX = 966, LW = 842, LY = 470, LH = 88;
  const rows = LOST.map((t, i) => `
      <div id="f7-l${i}" class="mono" style="position:absolute;left:${LX}px;top:${LY + i * LH}px;font-size:34px;font-weight:700">${t}</div>`).join("");
  const strikes = LOST.map((t, i) => {
    const w = t.length * 20.4;
    return { id: `f7-s${i}`, d: `M${LX - 12},${LY + i * LH + 30} Q${LX + w / 2},${LY + i * LH + 24} ${LX + w + 14},${LY + i * LH + 32}`, len: Math.ceil(w * 1.1) };
  });

  const body = `${field("paper")}
    <div id="stage" class="stage"><div class="inner">
      ${header("07", "the cost", "TWO PROMISES,<br>WITHHELD.", "")}

      ${cards}

      <div class="tag" style="position:absolute;left:${LX}px;top:${LY - 40}px;font-size:18px">SO THE PATH MAY NOT</div>

      <!-- the consequence, running. Every one of these is the same question asked twice. -->
      <div class="tag" style="position:absolute;left:1206px;top:206px;font-size:17px">THE SAME QUERY, SENT AGAIN &middot; ILLUSTRATION</div>
      <div style="position:absolute;left:1206px;top:236px;width:600px;height:112px">
        ${readout("f7-n", SENT.map((n) => `<span class="hdr" style="font-size:100px">${n}</span>`), "font-size:100px")}
      </div>
      <div id="f7-nu" class="tag" style="position:absolute;left:1208px;top:352px;font-size:19px">TIMES, IN ONE HOUR, AT THE ORIGIN</div>
      ${rows}
      ${strikes.map((s) => penPath(s.id, s.d, s.len, 6)).join("\n      ")}

      <div style="position:absolute;left:112px;top:872px;width:1700px">
        ${marker("f7-mk", -8, 10, 1292, 56)}
        <div class="phrase quote" style="position:relative;font-size:52px">A read the network is not allowed to treat as a read.</div>
      </div>
    </div></div>`;

  let s = `${enterAcross("#stage")}${headerIn(0.10, false)}\n`;
  PROMISE.forEach((_, i) => {
    s += `      tl.fromTo("#f7-v${i}", { autoAlpha: 0, x: 18 }, { autoAlpha: 1, x: 0, duration: 0.22, ease: "steps(3)" }, ${(1.30 + i * 0.72).toFixed(2)});\n`;
  });
  LOST.forEach((_, i) => {
    s += `      gsap.set("#f7-l${i}", { autoAlpha: 0 });\n`;
    s += `      tl.fromTo("#f7-l${i}", { autoAlpha: 0, x: -16 }, { autoAlpha: 1, x: 0, duration: 0.22, ease: "steps(3)" }, ${(0.60 + i * 0.30).toFixed(2)});\n`;
  });
  // the counter runs the WHOLE length of the frame: it is the one thing on this beat that
  // never stops, and it is the cost being paid while the strikes land.
  s += readoutIn("f7-n", SENT.length, 0.90, 0.92);
  // the four strikes land one per bar of the bed
  strikes.forEach((st, i) => { s += penIn(st.id, st.len, 3.60 + i * 1.55, 0.34); });
  LOST.forEach((_, i) => {
    s += `\n      tl.to("#f7-l${i}", { autoAlpha: 0.50, duration: 0.34, ease: "power2.out" }, ${(3.94 + i * 1.55).toFixed(2)});`;
  });
  s += `
      tl.to("#f7-n-${SENT.length - 1}", { color: "#B32414", duration: 0.01 }, ${(0.90 + (SENT.length - 1) * 0.92).toFixed(2)});
      tl.to("#f7-nu", { color: "#B32414", duration: 0.30, ease: "power2.out" }, ${(0.90 + (SENT.length - 1) * 0.92).toFixed(2)});
${markerIn("f7-mk", 10.00, 0.52)}
${exitZBack("#stage", len - 0.52)}`;

  return { body, script: s };
}
