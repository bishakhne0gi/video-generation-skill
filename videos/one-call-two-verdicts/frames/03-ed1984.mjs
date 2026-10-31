// 03 EDITION — the act slate, as a front page. In this register an act break is a new
// edition, and the film's structure IS the dates: 1984 / 1994 / 2026. Cream on the red
// plate measures 5.00:1; black on red is only 3.16:1, so nothing here is set in ink.
import { page, enterLift, penSvg, penDraw, underlineD } from "../lib/frame.mjs";

export function build({ len }) {
  const body = `
    ${page("stop")}
    <div id="stage" class="stage"><div class="inner rev">
      <div id="f3-kick" class="slug" style="position:absolute;left:0;top:158px;width:1920px;text-align:center;font-size:26px;letter-spacing:.42em;color:var(--scrap)">LATE EDITION</div>
      <div id="f3-yr" class="head" style="position:absolute;left:0;top:312px;width:1920px;text-align:center;font-size:280px;color:var(--scrap)">1984</div>
      <div id="f3-r" class="revrule" style="left:660px;top:646px;width:600px;height:4px;transform-origin:50% 50%"></div>
      <div id="f3-a" class="body" style="position:absolute;left:0;top:684px;width:1920px;text-align:center;font-size:32px;color:var(--scrap)">
        Xerox Palo Alto Research Center announces a package for calling<br>a procedure that is not on this machine</div>
      <div id="f3-b" class="slug" style="position:absolute;left:0;top:786px;width:1920px;text-align:center;font-size:19px;color:#F6D6D7">ACM TRANSACTIONS ON COMPUTER SYSTEMS &middot; VOL.&nbsp;2, No.&nbsp;1 &middot; FEBRUARY 1984</div>
      ${penSvg("f3-u", underlineD(700, 762, 520, 3), 4, "penw")}
    </div></div>`;

  const script = `
${enterLift("#stage")}
      // SEAM CARRIER — the year is full-size and full-opacity from frame zero.
      tl.fromTo("#f3-yr", { y: 20 }, { y: 0, duration: 0.58, ease: "power3.out" }, 0);
      gsap.set("#f3-kick", { autoAlpha: 0 });
      tl.to("#f3-kick", { autoAlpha: 1, duration: 0.28 }, 0.20);
      gsap.set("#f3-r", { scaleX: 0 });
      tl.to("#f3-r", { scaleX: 1, duration: 0.46, ease: "power3.out" }, 0.46);
      gsap.set("#f3-a", { autoAlpha: 0, y: 14 });
      tl.to("#f3-a", { autoAlpha: 1, y: 0, duration: 0.42, ease: "power3.out" }, 0.62);
      gsap.set("#f3-b", { autoAlpha: 0 });
      tl.to("#f3-b", { autoAlpha: 1, duration: 0.32 }, 1.00);
      ${penDraw("f3-u", 1.36, 0.50).trim()}`;

  return { body, script };
}
