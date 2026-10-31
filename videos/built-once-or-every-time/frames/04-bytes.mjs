// 04 BYTES — the signature move, introduced, and the frame the whole film rests on.
//
// Two wells holding the two real documents; two plates holding those documents
// RENDERED. The left plate rises while its type is still landing, because the words
// were already in the file. The right plate starts to rise, stalls at 6%, and then
// snaps the remaining 94% at the very end — everything at once, at the last moment.
// That stall is the measured 6,836 ms played as a gesture, and it is the single most
// important second and a half in the episode.
//
// Both screenshots are the delivered documents rendered at 1200x900 @2x with every
// <script> element removed and a <base> tag added so stylesheets and images resolve.
// Nothing else was changed, and the frame says so on the sheet.
//
// The two character counts are `document.body.innerText`, whitespace-collapsed, on
// exactly those two rendered documents: 1,105 and 10. The ten are Excalidraw's
// visually-hidden <h1>, which is why the gloss is on the frame and not left implied.
import { page, header, headerIn, well, wellIn, typeOn, plate, plateRise, plateStall,
  stamp, stampIn, penSvg, penDraw, boxD, countTo, ENTER } from "../lib/frame.mjs";

export function build({ seamIn }) {
  const A = 112, B = 1168, W = 640;
  const WELL_Y = 418, WELL_H = 200, PL_Y = 640, PL_W = 640;
  const LN = 29;   // 19px mono at line-height 1.52

  // the intro section of jekyllrb.com/, verbatim apart from a wrapping <div class="grid">
  const LEFT = [
    `<span class="tag">&lt;section</span> <span class="att">class</span>=<span class="dim">"intro"</span><span class="tag">&gt;</span>`,
    `  <span class="tag">&lt;p</span> <span class="att">class</span>=<span class="dim">"first"</span><span class="tag">&gt;</span>Transform your plain`,
    `  text into static&amp;nbsp;websites`,
    `  and&amp;nbsp;blogs.<span class="tag">&lt;/p&gt;</span>`,
    `<span class="tag">&lt;/section&gt;</span>`,
  ].join("\n");

  // the real body of excalidraw.com/ — this IS the whole body, minus the analytics
  // <script> that follows it. These two lines are Create React App's template, unchanged.
  const RIGHT = [
    `<span class="tag">&lt;body&gt;</span>`,
    `  <span class="tag">&lt;noscript&gt;</span>You need to enable`,
    `  JavaScript to run this app.<span class="tag">&lt;/noscript&gt;</span>`,
  ].join("\n");

  const body = `${page("canvas")}
    <div id="stage" class="stage"><div class="inner">
      ${header("01 · WHAT CAME BACK", "One has its words.<br>One has a div.", "", false, 64)}
      <div id="b-note" class="mono" style="position:absolute;left:114px;top:340px;font-size:20px;color:var(--charcoal);letter-spacing:0.01em">Both documents below are shown rendered with every &lt;script&gt; element removed. Nothing else was changed.</div>

      <div id="b-la" class="monob" style="position:absolute;left:${A}px;top:386px;font-size:23px;color:var(--ink)">jekyllrb.com<span style="color:var(--mute)">/index.html</span></div>
      <div id="b-lb" class="monob" style="position:absolute;left:${B}px;top:386px;font-size:23px;color:var(--ink)">excalidraw.com<span style="color:var(--mute)">/index.html</span></div>

      ${well("wa", { x: A, y: WELL_Y, w: W, h: WELL_H, pad: 28, fs: 19, lh: 1.52, text: LEFT })}
      ${well("wb", { x: B, y: WELL_Y, w: W, h: WELL_H, pad: 28, fs: 19, lh: 1.52, text: RIGHT,
        // the div is promoted to its own positioned element so the pen mark below has
        // exact geometry instead of arithmetic against font metrics it never measured.
        extra: `<div id="wb-div" class="wellbody" style="top:${28 + 3 * LN}px;font-size:19px"><span class="tag">  &lt;div</span> <span class="att">id</span>=<span class="dim">"root"</span><span class="tag">&gt;&lt;/div&gt;</span></div>
        <div id="wb-end" class="wellbody" style="top:${28 + 4 * LN}px;font-size:19px"><span class="tag">&lt;/body&gt;</span></div>` })}

      ${plate("pa", { x: A, y: PL_Y, w: PL_W, src: "assets/web/ssg-plate.png" })}
      ${plate("pb", { x: B, y: PL_Y, w: PL_W, src: "assets/web/csr-plate.png" })}

      <div id="dl-l" class="mono" style="position:absolute;left:${B + 44}px;top:${PL_Y + 128}px;font-size:22px;color:var(--mute)">downloading the bundle</div>
      <div id="dl-n" class="monob" style="position:absolute;left:${B + 44}px;top:${PL_Y + 168}px;font-size:44px;color:var(--ink);white-space:nowrap">0 B</div>
      <div id="dl-bg" class="barbg" style="left:${B + 44}px;top:${PL_Y + 250}px;width:${PL_W - 88}px;height:14px"></div>
      <div id="dl-fg" class="barfg" style="left:${B + 44}px;top:${PL_Y + 250}px;width:${PL_W - 88}px;height:14px"></div>

      <div id="c-a" class="mono" style="position:absolute;left:${A}px;top:1042px;width:${W}px;font-size:21px;color:var(--charcoal)">1,105 characters of text</div>
      <div id="c-b" class="mono" style="position:absolute;left:${B}px;top:1042px;width:${W}px;font-size:21px;color:var(--charcoal)">10 characters — a hidden &lt;h1&gt;</div>

      ${penSvg("p-div", boxD(B + 44, WELL_Y + 118, 264, 32, 4), 3.5, "dk")}
      ${stamp("st4", "BUILT AT DIFFERENT TIMES", { x: 1204, y: 196 })}
    </div></div>`;

  const script = `${ENTER[seamIn]("#stage")}
${headerIn(0.10, false)}
      gsap.set(["#b-note", "#b-la", "#b-lb", "#wb-div", "#wb-end", "#c-a", "#c-b",
        "#dl-l", "#dl-n", "#dl-bg", "#dl-fg"], { autoAlpha: 0 });
      gsap.set("#dl-fg", { scaleX: 0 });
      tl.fromTo("#b-note", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.40, ease: "power3.out" }, 0.26);

      // ---- THE STATIC SIDE: the plate begins rising while the type is still landing,
      // because the words were already in the document. It reads as effortless.
      tl.fromTo("#b-la", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.34, ease: "power3.out" }, 0.58);
${wellIn("wa", 0.62)}
${typeOn("wa-b", 0.92, 1.95, 62, 128)}
${plateRise("pa", 2.34, 0.58, 52)}
      tl.fromTo("#c-a", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.34, ease: "power3.out" }, 3.24);

      // ---- THE CLIENT SIDE: the same three-part move, performed by a document that
      // has nothing in it.
      tl.fromTo("#b-lb", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.34, ease: "power3.out" }, 4.26);
${wellIn("wb", 4.30)}
${typeOn("wb-b", 4.62, 1.28, 62, 82)}
      tl.set("#wb-div", { autoAlpha: 1 }, 5.98);
${typeOn("wb-div", 5.98, 0.42, 62, 24)}
      tl.fromTo("#wb-end", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.14 }, 6.52);
${penDraw("p-div", 6.76, 0.50)}

      // THE STALL. It rises 6% of the way and stops, because there is nothing to lift.
${plateStall("pb", 7.44, 10.72, 52)}
      // ...and this is what the stall is WAITING FOR. The frozen-frame test found 2.3s
      // of literally zero changed pixels here: the plate had stopped and nothing else on
      // the sheet was doing anything. The fix is not motion, it is the content the frame
      // already owed — the 855,457 bytes that have to arrive before the div can be
      // filled. It runs for the exact length of the stall and leaves as the plate snaps.
      tl.fromTo(["#dl-l", "#dl-bg"], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.28, ease: "power2.out" }, 7.66);
      tl.set(["#dl-n", "#dl-fg"], { autoAlpha: 1 }, 7.74);
${countTo("dl-n", 7.74, 0, 855457, 2.82, "Math.round(v).toLocaleString('en-US') + ' B'", "none")}
      tl.fromTo("#dl-fg", { scaleX: 0 }, { scaleX: 1, duration: 2.82, ease: "none" }, 7.74);
      tl.to(["#dl-l", "#dl-n", "#dl-bg", "#dl-fg"], { autoAlpha: 0, duration: 0.14 }, 10.62);
      tl.fromTo("#c-b", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.34, ease: "power3.out" }, 11.06);
${stampIn("st4", 11.42)}`;

  return { body, script };
}
