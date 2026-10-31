// 06 ETAG — the continuity object, decoded on camera.
//
// jekyllrb.com is served by GitHub Pages, whose ETags are `<mtime-hex>-<size-hex>`.
// 0x6a3960e0 = 1782145248 = Mon, 22 Jun 2026 16:20:48 GMT, which is exactly the
// last-modified header on the same response. 0x2899 = 10393, which is exactly the byte
// count. Both were decoded and checked against the live headers; the arithmetic is in
// research/. The identity of a statically generated page is WHEN IT WAS BUILT and HOW
// BIG IT CAME OUT — and neither of those two facts has anything to do with the request.
//
// Excalidraw's ETag is shown as a contrast and NO claim is made about its meaning: it
// is a 32-character hash, and that is all the frame says about it.
//
// Every string on this frame is laid out as its own positioned element so the two
// brackets underneath have exact geometry. Nothing here is measured against a font.
import { page, header, headerIn, stamp, stampIn, penSvg, penDraw,
  ENTER, countTo } from "../lib/frame.mjs";

export function build({ seamIn }) {
  // one baseline, five positioned parts, 68px JetBrains Mono (advance 0.6em = 40.8px)
  const Y = 356, FS = 68, CH = 40.8;
  const X0 = 260;                      // `etag: "` starts here
  const XH = X0 + 7 * CH;              // 6a3960e0
  const XD = XH + 8 * CH;              // -
  const XS = XD + 1 * CH;              // 2899
  const XQ = XS + 4 * CH;              // closing quote
  const bracket = (x, w, y) =>
    `M ${x} ${y} L ${x} ${y + 16} L ${x + w / 2 - 12} ${y + 16} L ${x + w / 2} ${y + 34} ` +
    `L ${x + w / 2 + 12} ${y + 16} L ${x + w} ${y + 16} L ${x + w} ${y}`;

  const colA = XH, colB = XS, colC = 1420;

  const body = `${page("canvas")}
    <div id="stage" class="stage"><div class="inner">
      ${header("01 · WHAT CAME BACK", "Its name is a receipt.", "", false, 64)}
      <div id="e-note" class="mono" style="position:absolute;left:114px;top:286px;font-size:20px;color:var(--charcoal)">response header · GET https://jekyllrb.com/ · GitHub Pages · 2026-08-23</div>

      <div id="e-pre" class="monob" style="position:absolute;left:${X0}px;top:${Y}px;font-size:${FS}px;color:var(--mute)">etag: "</div>
      <div id="e-h"   class="monob" style="position:absolute;left:${XH}px;top:${Y}px;font-size:${FS}px;color:var(--ink)">6a3960e0</div>
      <div id="e-d"   class="monob" style="position:absolute;left:${XD}px;top:${Y}px;font-size:${FS}px;color:var(--mute)">-</div>
      <div id="e-s"   class="monob" style="position:absolute;left:${XS}px;top:${Y}px;font-size:${FS}px;color:var(--ink)">2899</div>
      <div id="e-q"   class="monob" style="position:absolute;left:${XQ}px;top:${Y}px;font-size:${FS}px;color:var(--mute)">"</div>

      ${penSvg("p-ba", bracket(XH, 8 * CH, Y + 92), 3.5, "ink")}
      ${penSvg("p-bb", bracket(XS, 4 * CH, Y + 92), 3.5, "ink")}

      <div id="a-k" class="slug" style="position:absolute;left:${colA}px;top:${Y + 154}px">When it was built</div>
      <div id="a-1" class="mono"  style="position:absolute;left:${colA}px;top:${Y + 200}px;font-size:30px;color:var(--body)">= <span id="a-num">0</span></div>
      <div id="a-2" class="monob" style="position:absolute;left:${colA}px;top:${Y + 250}px;font-size:34px;color:var(--ink);width:340px">Mon, 22 Jun 2026<br>16:20:48 GMT</div>

      <div id="b-k" class="slug" style="position:absolute;left:${colB}px;top:${Y + 154}px">How big it came out</div>
      <div id="b-1" class="mono"  style="position:absolute;left:${colB}px;top:${Y + 200}px;font-size:30px;color:var(--body)">= <span id="b-num">0</span></div>
      <div id="b-2" class="monob" style="position:absolute;left:${colB}px;top:${Y + 250}px;font-size:34px;color:var(--ink);width:400px">bytes, exactly</div>

      <div id="c-k" class="slug" style="position:absolute;left:${colC}px;top:${Y + 154}px">Who asked for it</div>
      <div id="c-v" class="mono"  style="position:absolute;left:${colC}px;top:${Y + 200}px;font-size:30px;color:var(--mute)">= —</div>
      <div id="c-w" class="monob" style="position:absolute;left:${colC}px;top:${Y + 250}px;font-size:34px;color:var(--mute);width:360px">nothing at all</div>

      <div id="c-hr" class="hair" style="left:112px;top:882px;width:1696px;transform-origin:0% 50%"></div>
      <div id="c-1" class="mono" style="position:absolute;left:114px;top:912px;font-size:24px;color:var(--body)">last-modified: <span style="color:var(--ink)">Mon, 22 Jun 2026 16:20:48 GMT</span><span style="color:var(--mute)">   — the same value, sent again</span></div>
      <div id="c-2" class="mono" style="position:absolute;left:114px;top:960px;font-size:24px;color:var(--body)">excalidraw.com: <span style="color:var(--ink)">"048dfd962c80b256c88cecf254e4a4e3"</span><span style="color:var(--mute)">   — a hash. No date. No size.</span></div>

      ${stamp("st6", "NOTHING ABOUT THE REQUEST", { x: 1218, y: 196 })}
    </div></div>`;

  const script = `${ENTER[seamIn]("#stage")}
${headerIn(0.10, false)}
      gsap.set(["#e-note", "#a-k", "#a-1", "#a-2", "#b-k", "#b-1", "#b-2", "#c-k", "#c-v", "#c-w", "#c-1", "#c-2"], { autoAlpha: 0 });
      gsap.set("#c-hr", { scaleX: 0 });
      // the etag itself is the SEAM CARRIER: at full opacity from frame zero, riding in.
      tl.fromTo(["#e-pre", "#e-h", "#e-d", "#e-s", "#e-q"], { y: 18 }, { y: 0, duration: 0.50, ease: "power3.out", stagger: 0.05 }, 0);
      tl.fromTo("#e-note", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.36, ease: "power3.out" }, 0.26);

      // ---- the first half. The bracket draws, then the number resolves under it.
${penDraw("p-ba", 1.90, 0.44)}
      tl.fromTo("#a-k", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.34, ease: "power3.out" }, 2.38);
      tl.set("#a-1", { autoAlpha: 1 }, 2.66);
${countTo("a-num", 2.66, 0, 1782145248, 0.82, "String(Math.round(v))")}
      tl.fromTo("#a-2", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.40, ease: "power3.out" }, 3.86);

      // ---- the second half, at the same tempo, so the pair reads as one gesture.
${penDraw("p-bb", 5.30, 0.36)}
      tl.fromTo("#b-k", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.34, ease: "power3.out" }, 5.70);
      tl.set("#b-1", { autoAlpha: 1 }, 5.98);
${countTo("b-num", 5.98, 0, 10393, 0.66)}
      tl.fromTo("#b-2", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.40, ease: "power3.out" }, 7.02);

      // the third column has no bracket, because there is nothing in the name to
      // bracket. That absence is the frame's actual argument.
      tl.fromTo(["#c-k", "#c-v", "#c-w"], { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.36, ease: "power3.out", stagger: 0.16 }, 7.86);

      // ---- the corroboration, and the contrast. Both are real headers.
      tl.to("#c-hr", { scaleX: 1, duration: 0.52, ease: "power3.out" }, 8.30);
      tl.fromTo("#c-1", { autoAlpha: 0, x: -16 }, { autoAlpha: 1, x: 0, duration: 0.42, ease: "power3.out" }, 8.62);
      tl.fromTo("#c-2", { autoAlpha: 0, x: -16 }, { autoAlpha: 1, x: 0, duration: 0.42, ease: "power3.out" }, 10.10);
${stampIn("st6", 12.10)}
      // the last move: the two numbers that were never about the visitor go quiet.
      tl.to(["#a-2", "#b-2"], { color: "#c01f00", duration: 0.50, ease: "power2.out" }, 12.86);`;

  return { body, script };
}
