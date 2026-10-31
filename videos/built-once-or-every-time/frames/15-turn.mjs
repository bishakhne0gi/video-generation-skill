// 15 TURN — the Z-BACK lands here, and the film changes sides.
//
// Everything before this frame prosecutes client rendering. This frame is the defence,
// and it is made entirely out of Excalidraw's own words: the sentence below is printed
// on its start screen, unprompted, to every visitor. The screenshot is that screen,
// captured on 2026-08-23.
//
// The reserved arrival vector is spent HERE and nowhere else in the film, because this
// is the sentence the whole argument turns on: the div is empty because at build time
// there was nothing to put in it.
import { page, header, headerIn, ENTER, plate, plateRise, stamp, stampIn } from "../lib/frame.mjs";

export function build({ seamIn }) {
  const X = 128;

  const body = `${page("canvas")}
    <div id="stage" class="stage"><div class="inner">
      ${header("04 · THE TURN", "So delete it?", "", false, 62)}
      <div id="u-note" class="mono" style="position:absolute;left:130px;top:284px;font-size:20px;color:var(--charcoal)">excalidraw.com · its own start screen · captured 2026-08-23</div>

      <div id="u-q" class="disp" style="position:absolute;left:${X}px;top:378px;width:1000px;font-size:74px;line-height:1.1;letter-spacing:-2px;color:var(--ink)">“Your drawings are saved in your browser’s storage.”</div>
      <div id="u-q2" class="mono" style="position:absolute;left:${X + 4}px;top:672px;width:1020px;font-size:27px;color:var(--charcoal)">“Browser storage can be cleared unexpectedly.”  —  the same screen, two lines down</div>
      <div id="u-r" class="krule" style="left:${X + 4}px;top:748px;width:220px;transform-origin:0% 50%"></div>
      <div id="u-b" class="body" style="position:absolute;left:${X}px;top:792px;width:960px;font-size:31px;color:var(--body)">Not on a server. Not in a database. <span class="bodys">In your browser, on your device.</span></div>
      <div id="u-c" class="body" style="position:absolute;left:${X}px;top:888px;width:960px;font-size:31px;color:var(--body)">There is no build step anywhere on earth that could have put your drawing into that div, because on the morning it ran, your drawing did not exist.</div>

      ${plate("pt", { x: 1300, y: 300, w: 400, src: "assets/web/csr-turn.png" })}
      ${stamp("st15", "NOTHING TO PREBUILD", { x: 1216, y: 196 })}
    </div></div>`;

  const script = `${ENTER[seamIn]("#stage")}
${headerIn(0.10, false)}
      gsap.set(["#u-note", "#u-q2", "#u-b", "#u-c"], { autoAlpha: 0 });
      gsap.set("#u-r", { scaleX: 0 });
      // the quotation is the SEAM CARRIER and it arrives on the Z-BACK at full opacity.
      // A frame that fades up on the film's one reserved vector wastes the vector.
      tl.fromTo("#u-q", { y: 22 }, { y: 0, duration: 0.58, ease: "power3.out" }, 0);
      tl.fromTo("#u-note", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.34, ease: "power3.out" }, 0.30);
${plateRise("pt", 0.62, 0.62, 58)}

      // a SECOND real sentence off the same screen, so the frame keeps delivering
      // instead of holding the first quotation for eleven seconds
      tl.fromTo("#u-q2", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.44, ease: "power3.out" }, 2.30);
      tl.to("#u-r", { scaleX: 1, duration: 0.46, ease: "power3.out" }, 3.70);
      tl.fromTo("#u-b", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.46, ease: "power3.out" }, 3.92);
      tl.to("#u-r", { scaleX: 1.9, duration: 0.60, ease: "power2.inOut" }, 5.10);
      tl.fromTo("#u-c", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.48, ease: "power3.out" }, 6.10);
      tl.to("#u-r", { scaleX: 2.91, duration: 0.80, ease: "power2.inOut" }, 7.40);
${stampIn("st15", 8.90)}`;

  return { body, script };
}
