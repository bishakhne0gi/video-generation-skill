// 12 WEIGHT — the same chart, at a scale ten times coarser, and the rescale IS the point.
//
// Frame 11 drew jekyllrb.com at 1 px = 70 B. This frame draws excalidraw.com at
// 1 px = 700 B, says so on the sheet, and then puts frame 11's ENTIRE first-party total
// on the new scale as a 30-pixel sliver. Rescaling silently would be a lie; rescaling
// out loud is the argument.
//
// Measured 2026-08-23, Accept-Encoding: br, gzip:
//   index.html                    2,391 B   brotli   (6,862 B decoded)
//   assets/index-BJTbkKWv.css    33,553 B   brotli
//   assets/mermaid-…D-aVQaad.js 176,948 B   brotli
//   assets/index-CmqSbLij.js    676,038 B   brotli   (2,165,763 B to parse)
//   ————
//   all JavaScript              855,457 B   over five files, from the Chrome trace
//
// The first row is the one that matters most and it is the one nobody expects: the
// client-rendered page sent 1,058 bytes LESS HTML than the static one. The HTML was
// never the cost.
import { page, header, headerIn, ENTER, bar, barTo, countTo, stamp, stampIn,
  penSvg, penDraw, underlineD } from "../lib/frame.mjs";

export function build({ seamIn }) {
  const X = 128, LBL = 690, BAR = 1108, BW = 430;
  const PPB = 700;                       // ten times coarser than frame 11
  const rows = [
    ["index.html", 2391, "brotli · 6,862 B decoded"],
    ["assets/index-…BJTbkKWv.css", 33553, "brotli"],
    ["assets/mermaid-to-excalidraw.js", 176948, "brotli"],
    ["assets/index-…CmqSbLij.js", 676038, "brotli · 2,165,763 B to parse"],
  ];

  const body = `${page("canvas")}
    <div id="stage" class="stage"><div class="inner">
      ${header("03 · WHAT IT COSTS", "It sent less HTML.", "", false, 62)}
      <div id="w-note" class="mono" style="position:absolute;left:130px;top:284px;font-size:20px;color:var(--charcoal)">excalidraw.com · bytes on the wire · 2026-08-23 · <span style="color:var(--primary-deep)">1 px = ${PPB} B — ten times coarser than the last frame</span></div>

      ${rows.map(([k, v, note], i) => {
        const y = 356 + i * 92;
        return `
      <div class="w-row" style="position:absolute;left:${X}px;top:${y}px;width:1700px">
        <span class="mono" style="font-size:26px;color:var(--ink)">${k}</span>
        <span class="mono" style="position:absolute;left:${LBL - X}px;font-size:19px;color:var(--mute)">${note}</span>
        <span id="w-v${i}" class="monob" style="position:absolute;left:${BAR - X + BW + 30}px;font-size:26px;color:var(--ink);white-space:nowrap">0 B</span>
      </div>
      ${bar(`w-b${i}`, { x: BAR, y: y + 12, w: BW, h: 16, kind: "ink" })}`;
      }).join("")}

      <div id="w-hr" class="hair" style="left:${X}px;top:${356 + 4 * 92 - 14}px;width:1700px;transform-origin:0% 50%"></div>

      <div id="w-tot" style="position:absolute;left:${X}px;top:${356 + 4 * 92 + 18}px;width:1700px">
        <span class="monob" style="font-size:30px;color:var(--ink)">all JavaScript</span>
        <span id="w-vt" class="monob" style="position:absolute;left:${BAR - X + BW + 30}px;font-size:30px;color:var(--ink);white-space:nowrap">0 B</span>
      </div>
      ${bar("w-bt", { x: BAR, y: 356 + 4 * 92 + 26, w: BW, h: 20 })}

      <div id="w-cmp" style="position:absolute;left:${X}px;top:${356 + 4 * 92 + 100}px;width:1700px">
        <span class="mono" style="font-size:26px;color:var(--mute)">everything jekyllrb.com sent, first party</span>
        <span class="monob" style="position:absolute;left:${BAR - X + BW + 30}px;font:inherit;font-size:26px;color:var(--mute)">20,832 B</span>
      </div>
      ${bar("w-bj", { x: BAR, y: 356 + 4 * 92 + 110, w: BW, h: 16 })}

      <div id="w-say" class="body" style="position:absolute;left:${X}px;top:928px;width:1600px;font-size:29px;color:var(--body)">The client-rendered page sent <span class="bodys">1,058 bytes less HTML</span> than the static one. The HTML was never the cost.</div>
      <div id="w-hl" class="monob" style="position:absolute;left:${X}px;top:998px;font-size:26px;color:var(--primary-deep)">2,391 B  ·  3,449 B</div>

      ${penSvg("p-less", underlineD(X, 1046, 322, 3), 4, "")}
      ${stamp("st12", "855,457 B OF JAVASCRIPT", { x: 1276, y: 196 })}
    </div></div>`;

  const script = `${ENTER[seamIn]("#stage")}
${headerIn(0.10, false)}
      gsap.set(["#w-note", ".w-row", "#w-tot", "#w-cmp", "#w-say", "#w-hl"], { autoAlpha: 0 });
      gsap.set(["#w-b0", "#w-b1", "#w-b2", "#w-b3", "#w-bt", "#w-bj"], { scaleX: 0 });
      gsap.set("#w-hr", { scaleX: 0 });
      tl.fromTo("#w-note", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.36, ease: "power3.out" }, 0.22);
      tl.fromTo(".w-row", { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: 0.40, ease: "power3.out", stagger: 1.22 }, 0.62);
${rows.map(([, v], i) => barTo(`w-b${i}`, 0.78 + i * 1.22, Math.min(1, v / PPB / 430), 0.70) +
  countTo(`w-v${i}`, 0.78 + i * 1.22, 0, v, 0.70, "Math.round(v).toLocaleString('en-US') + ' B'")).join("")}

      tl.to("#w-hr", { scaleX: 1, duration: 0.50, ease: "power3.out" }, 6.10);
      tl.fromTo("#w-tot", { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: 0.40, ease: "power3.out" }, 6.34);
${barTo("w-bt", 6.50, Math.min(1, 855457 / PPB / 430), 0.92, "power3.out")}
${countTo("w-vt", 6.50, 0, 855457, 0.92, "Math.round(v).toLocaleString('en-US') + ' B'")}

      // THE RESCALE, made visible: the whole of the previous frame, on this frame's axis.
      tl.fromTo("#w-cmp", { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: 0.40, ease: "power3.out" }, 8.30);
${barTo("w-bj", 8.46, 20832 / PPB / 430, 0.42)}

      tl.fromTo("#w-say", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.46, ease: "power3.out" }, 10.10);
      tl.fromTo("#w-hl", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.38, ease: "power3.out" }, 11.06);
${penDraw("p-less", 11.60, 0.44)}
${stampIn("st12", 12.60)}`;

  return { body, script };
}
