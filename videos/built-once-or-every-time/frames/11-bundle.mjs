// 11 BUNDLE — the static side's byte accounting, first party and third party kept apart.
//
// Every figure is `content-length` on a real response fetched on 2026-08-23 with
// `Accept-Encoding: br, gzip`, so these are bytes ON THE WIRE, not on disk.
//
//   index.html             3,449 B   gzip
//   css/screen.css        13,881 B   gzip   (60,510 B uncompressed)
//   js/html5shiv.min.js    1,350 B   gzip
//   js/respond.min.js      2,152 B   gzip
//   docsearch.min.js      44,611 B   third party, jsDelivr
//
// The two first-party scripts are html5shiv (HTML5 elements in IE 6-9) and respond.js
// (media queries in IE 6-8). Neither renders anything in a browser made this decade,
// which is the frame's actual point. The third-party search widget is FOUR TIMES the
// size of everything first-party put together and it is on the frame, below the rule,
// because leaving it off would make the narration's "three and a half kilobytes" a
// half-truth.
import { page, header, headerIn, ENTER, bar, barTo, countTo, stamp, stampIn } from "../lib/frame.mjs";

export function build({ seamIn }) {
  const X = 128, LBL = 700, BAR = 1010, BW = 540;
  // 1 px = 70 B on this frame, chosen so the LARGEST row fits the 640px track. The scale
  // is printed on the sheet, because frame 12 changes it by a factor of ten and the
  // rescale is that frame's whole argument.
  const PPB = 70;
  const rows = [
    ["index.html", 3449, "gzip"],
    ["css/screen.css", 13881, "gzip · 60,510 B raw"],
    ["js/html5shiv.min.js", 1350, "IE 6–9 polyfill"],
    ["js/respond.min.js", 2152, "IE 6–8 media queries"],
  ];

  const body = `${page("canvas")}
    <div id="stage" class="stage"><div class="inner">
      ${header("03 · WHAT IT COSTS", "Ten kilobytes, and two polyfills.", "", false, 62)}
      <div id="n-note" class="mono" style="position:absolute;left:130px;top:284px;font-size:20px;color:var(--charcoal)">jekyllrb.com · bytes on the wire, Accept-Encoding: br, gzip · 2026-08-23 · 1 px = ${PPB} B</div>

      <div id="g1" class="slug" style="position:absolute;left:${X}px;top:346px">First party</div>
      ${rows.map(([k, v, note], i) => {
        const y = 400 + i * 92;
        return `
      <div class="n-row" style="position:absolute;left:${X}px;top:${y}px;width:1700px">
        <span class="mono" style="font-size:27px;color:var(--ink)">${k}</span>
        <span class="mono" style="position:absolute;left:${LBL - X}px;font-size:20px;color:var(--mute)">${note}</span>
        <span id="n-v${i}" class="monob" style="position:absolute;left:${BAR - X + BW + 34}px;font-size:27px;color:var(--ink);white-space:nowrap">0 B</span>
      </div>
      ${bar(`n-b${i}`, { x: BAR, y: y + 12, w: BW, h: 16, kind: "ink" })}`;
      }).join("")}

      <div id="n-hr" class="hair" style="left:${X}px;top:${400 + 4 * 92 - 16}px;width:1700px;transform-origin:0% 50%"></div>
      <div id="g2" class="slug" style="position:absolute;left:${X}px;top:${400 + 4 * 92 + 16}px">Third party</div>
      <div id="n-row4" style="position:absolute;left:${X}px;top:${400 + 4 * 92 + 66}px;width:1700px">
        <span class="mono" style="font-size:27px;color:var(--mute)">docsearch.min.js</span>
        <span class="mono" style="position:absolute;left:${LBL - X}px;font-size:20px;color:var(--mute)">jsDelivr · site search</span>
        <span id="n-v4" class="monob" style="position:absolute;left:${BAR - X + BW + 34}px;font-size:27px;color:var(--mute);white-space:nowrap">0 B</span>
      </div>
      ${bar("n-b4", { x: BAR, y: 400 + 4 * 92 + 78, w: BW, h: 16 })}

      <div id="n-say" class="body" style="position:absolute;left:${X}px;top:952px;width:1300px;font-size:29px;color:var(--body)">Neither polyfill renders anything in a browser made this decade. <span class="bodys">The page does not need JavaScript to be a page.</span></div>
      ${stamp("st11", "3,502 B OF FIRST-PARTY JS", { x: 1258, y: 196 })}
    </div></div>`;

  const script = `${ENTER[seamIn]("#stage")}
${headerIn(0.10, false)}
      gsap.set(["#n-note", "#g1", "#g2", ".n-row", "#n-row4", "#n-say"], { autoAlpha: 0 });
      gsap.set(["#n-b0", "#n-b1", "#n-b2", "#n-b3", "#n-b4"], { scaleX: 0 });
      gsap.set("#n-hr", { scaleX: 0 });
      tl.fromTo("#n-note", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.36, ease: "power3.out" }, 0.24);
      tl.fromTo("#g1", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.34, ease: "power3.out" }, 0.50);
      tl.fromTo(".n-row", { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: 0.40, ease: "power3.out", stagger: 1.44 }, 0.86);
${rows.map(([, v], i) => barTo(`n-b${i}`, 1.02 + i * 1.44, Math.min(1, v / PPB / 540), 0.66) +
  countTo(`n-v${i}`, 1.02 + i * 1.44, 0, v, 0.66, "Math.round(v).toLocaleString('en-US') + ' B'")).join("")}

      // the third-party row sits BELOW the rule and in --mute, because it is real and it
      // is not the site's own doing. Hiding it would make the narration a half-truth.
      tl.to("#n-hr", { scaleX: 1, duration: 0.52, ease: "power3.out" }, 7.20);
      tl.fromTo("#g2", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.34, ease: "power3.out" }, 7.46);
      tl.fromTo("#n-row4", { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: 0.40, ease: "power3.out" }, 7.76);
${barTo("n-b4", 7.92, Math.min(1, 44611 / PPB / 540), 0.80)}
${countTo("n-v4", 7.92, 0, 44611, 0.80, "Math.round(v).toLocaleString('en-US') + ' B'")}

      tl.fromTo("#n-say", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.46, ease: "power3.out" }, 10.10);
${stampIn("st11", 12.30)}
      // one last move on the two polyfill bars: they go quiet, because they do nothing.
      tl.to(["#n-b2", "#n-b3"], { opacity: 0.32, duration: 0.50, ease: "power2.out" }, 13.30);`;

  return { body, script };
}
