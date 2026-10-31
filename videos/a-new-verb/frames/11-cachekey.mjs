// EP27 · 11 CACHEKEY — the engineering consequence, and the one thing about QUERY that is
// genuinely harder than GET. §2.7 is quoted verbatim; the closing line is the RFC's own
// warning about it, paraphrased into one clause.
import { field, enterAcross, exitAcross, header, headerIn, penPath, penIn, arrowD, marker, markerIn, tilt } from "../lib/frame.mjs";

const REQS = [
  ['{ "ids": [ … 400 ], "sort": "-rating" }', "3f1a"],
  ['{ "ids": [ … 400 ], "sort": "price"   }', "c082"],
];

export function build({ len }) {
  const QX = 112, QW = 690, QY = 424, QH = 168, QG = 26;
  const KX = 946, KW = 862, KH = 362;

  const cards = REQS.map(([b, h], i) => {
    const y = QY + i * (QH + QG);
    return `
      <div id="f11-q${i}" class="card" style="left:${QX}px;top:${y}px;width:${QW}px;height:${QH}px;transform:rotate(${tilt(i + 70)}deg)"></div>
      <div id="f11-q${i}t" style="position:absolute;left:${QX}px;top:${y}px;width:${QW}px;height:${QH}px;transform:rotate(${tilt(i + 70)}deg)">
        <div class="mono" style="position:absolute;left:26px;top:20px;font-size:25px;font-weight:700">QUERY /products</div>
        <div class="hair" style="left:26px;top:58px;width:${QW - 52}px"></div>
        <div class="mono" style="position:absolute;left:26px;top:74px;font-size:24px;color:var(--ink2);white-space:nowrap">${b}</div>
        <div class="tag" style="position:absolute;left:26px;top:120px;font-size:17px">SAME URI · DIFFERENT CONTENT</div>
      </div>`;
  }).join("");

  const arrows = REQS.map((_, i) => arrowD(QX + QW + 14, QY + i * (QH + QG) + QH / 2, KX - 16, QY + 74 + i * 96, i ? -30 : 30));

  const body = `${field("paper2")}
    <div id="stage" class="stage"><div class="inner">
      ${header("11", "the hard part", "THE KEY IS<br>THE BODY.", "")}

      ${cards}

      <div class="sheet" style="left:${KX}px;top:${QY}px;width:${KW}px;height:${KH}px;transform:rotate(${tilt(73)}deg)"></div>
      <div style="position:absolute;left:${KX}px;top:${QY}px;width:${KW}px;height:${KH}px;overflow:hidden;transform:rotate(${tilt(73)}deg)">
        <div class="tag" style="position:absolute;left:30px;top:24px;font-size:17px">SHARED CACHE · KEYS</div>
        <div class="hair" style="left:30px;top:56px;width:${KW - 60}px"></div>
        ${REQS.map((r, i) => `
        <div id="f11-k${i}" class="mono" style="position:absolute;left:30px;top:${88 + i * 96}px;font-size:26px;font-weight:700;white-space:nowrap">/products &oplus; ${r[1]}</div>
        <div id="f11-v${i}" class="deck" style="position:absolute;left:30px;top:${124 + i * 96}px;font-size:24px">48 results, stored and reusable</div>
        <div id="f11-w${i}" class="deck" style="position:absolute;left:30px;top:${124 + i * 96}px;font-size:24px;font-weight:700;color:var(--ink);opacity:0">the origin never sees the next one</div>
        <div id="f11-h${i}" style="position:absolute;left:${KW - 168}px;top:${84 + i * 96}px;width:118px;height:44px;opacity:0">
          <div style="position:absolute;inset:0;background:var(--ink)"></div>
          <div class="mono" style="position:absolute;left:0;top:11px;width:118px;text-align:center;font-size:22px;font-weight:700;color:var(--yellow)">HIT</div>
        </div>`).join("")}
        <div class="hair" style="left:30px;top:${88 + 2 * 96 + 12}px;width:${KW - 60}px"></div>
        <div id="f11-note" class="mono" style="position:absolute;left:30px;top:${88 + 2 * 96 + 30}px;font-size:25px;font-weight:700;opacity:0">Two entries. One URI.</div>
      </div>

      <div style="position:absolute;left:112px;top:832px;width:1720px">
        ${marker("f11-mk", -8, 8, 978, 56)}
        <div class="phrase quote" style="position:relative;font-size:52px">MUST incorporate the request content</div>
        <div id="f11-cite" class="tag" style="position:absolute;left:2px;top:78px;font-size:19px;opacity:0">RFC 10008 §2.7 · CACHING</div>
        <div id="f11-cost" class="deck" style="position:absolute;left:2px;top:112px;width:1560px;font-size:29px;opacity:0">Which costs something: a cache must read the whole body before it knows what it is holding.</div>
      </div>

      ${arrows.map((a, i) => penPath(`f11-a${i}`, a.d, a.len, 5)).join("\n      ")}
    </div></div>`;

  let s = `${enterAcross("#stage")}${headerIn(0.10, false)}\n`;
  REQS.forEach((_, i) => {
    s += `      gsap.set(["#f11-q${i}","#f11-q${i}t"], { autoAlpha: 0 });\n`;
    s += `      tl.to(["#f11-q${i}","#f11-q${i}t"], { autoAlpha: 1, duration: 0.22, ease: "steps(3)" }, ${(0.40 + i * 0.42).toFixed(2)});\n`;
    s += penIn(`f11-a${i}`, arrows[i].len, 1.60 + i * 0.90, 0.42);
    s += `\n      gsap.set(["#f11-k${i}","#f11-v${i}"], { autoAlpha: 0 });\n`;
    s += `      tl.to(["#f11-k${i}","#f11-v${i}"], { autoAlpha: 1, duration: 0.20, ease: "steps(3)", stagger: 0.08 }, ${(2.06 + i * 0.90).toFixed(2)});\n`;
  });
  s += `      tl.fromTo("#f11-note", { autoAlpha: 0, x: -14 }, { autoAlpha: 1, x: 0, duration: 0.22, ease: "steps(3)" }, 4.20);
${markerIn("f11-mk", 4.90, 0.52)}
      tl.fromTo("#f11-cite", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.24, ease: "steps(4)" }, 5.60);
      tl.fromTo("#f11-cost", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.42, ease: "power3.out" }, 6.30);
      // ---- and then the same two queries arrive again. THAT is what the key bought.
      tl.fromTo("#f11-h0", { autoAlpha: 0, scale: 0.7, rotation: -8 }, { autoAlpha: 1, scale: 1, rotation: -2, duration: 0.26, ease: "steps(4)" }, 7.30);
      tl.to("#f11-v0", { autoAlpha: 0, duration: 0.18, ease: "steps(3)" }, 7.42);
      tl.fromTo("#f11-w0", { autoAlpha: 0, x: -12 }, { autoAlpha: 1, x: 0, duration: 0.22, ease: "steps(3)" }, 7.42);
      tl.fromTo("#f11-h1", { autoAlpha: 0, scale: 0.7, rotation: 8 }, { autoAlpha: 1, scale: 1, rotation: 2, duration: 0.26, ease: "steps(4)" }, 8.30);
      tl.to("#f11-v1", { autoAlpha: 0, duration: 0.18, ease: "steps(3)" }, 8.42);
      tl.fromTo("#f11-w1", { autoAlpha: 0, x: -12 }, { autoAlpha: 1, x: 0, duration: 0.22, ease: "steps(3)" }, 8.42);
      tl.to(["#f11-q0","#f11-q0t","#f11-q1","#f11-q1t"], { autoAlpha: 0.42, duration: 0.50, ease: "power2.out", stagger: 0.06 }, 8.60);
${exitAcross("#stage", len - 0.34)}`;

  return { body, script: s };
}
