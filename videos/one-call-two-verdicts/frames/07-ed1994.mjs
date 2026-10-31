// 07 EDITION — the second act break. The black plate, so the value journey runs
// red -> paper -> BLACK -> darker paper: the film is stepping further back in time
// and the page is getting older as it does.
import { page, enterLift, penSvg, penDraw, underlineD } from "../lib/frame.mjs";

export function build({ len }) {
  const body = `
    ${page("plate")}
    <div id="stage" class="stage"><div class="inner rev">
      <div id="f7-kick" class="slug" style="position:absolute;left:0;top:158px;width:1920px;text-align:center;font-size:26px;letter-spacing:.42em;color:var(--scrap)">LATE EDITION</div>
      <div id="f7-yr" class="head" style="position:absolute;left:0;top:312px;width:1920px;text-align:center;font-size:280px;color:var(--scrap)">1994</div>
      <div id="f7-r" class="rrule" style="left:660px;top:646px;width:600px;transform-origin:50% 50%"></div>
      <div id="f7-a" class="body" style="position:absolute;left:0;top:684px;width:1920px;text-align:center;font-size:32px;color:var(--scrap)">
        Four engineers at Sun Microsystems Laboratories reply, and name<br>the four things a remote call can never hide</div>
      <div id="f7-b" class="slug" style="position:absolute;left:0;top:786px;width:1920px;text-align:center;font-size:19px;color:#A79E8D">WALDO, WYANT, WOLLRATH &amp; KENDALL &middot; SMLI TR-94-29 &middot; NOVEMBER 1994</div>
      ${penSvg("f7-u", underlineD(690, 762, 540, 8), 4, "penw")}
    </div></div>`;

  const script = `
${enterLift("#stage")}
      tl.fromTo("#f7-yr", { y: 20 }, { y: 0, duration: 0.58, ease: "power3.out" }, 0);
      gsap.set("#f7-kick", { autoAlpha: 0 });
      tl.to("#f7-kick", { autoAlpha: 1, duration: 0.28 }, 0.20);
      gsap.set("#f7-r", { scaleX: 0 });
      tl.to("#f7-r", { scaleX: 1, duration: 0.46, ease: "power3.out" }, 0.46);
      gsap.set("#f7-a", { autoAlpha: 0, y: 14 });
      tl.to("#f7-a", { autoAlpha: 1, y: 0, duration: 0.42, ease: "power3.out" }, 0.62);
      gsap.set("#f7-b", { autoAlpha: 0 });
      tl.to("#f7-b", { autoAlpha: 1, duration: 0.32 }, 1.00);
      ${penDraw("f7-u", 1.36, 0.50).trim()}`;

  return { body, script };
}
