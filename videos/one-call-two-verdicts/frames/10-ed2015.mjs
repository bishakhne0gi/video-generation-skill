// 10 EDITION — the third act break: the film stops being history and becomes the
// present tense. Act slates all share the LIFT, which is what makes them read as a
// section change; the film's one reserved Z-back is spent on frame 13 instead.
import { page, enterLift, penSvg, penDraw, underlineD } from "../lib/frame.mjs";

export function build({ len }) {
  const body = `
    ${page("stop")}
    <div id="stage" class="stage"><div class="inner rev">
      <div id="f10-kick" class="slug" style="position:absolute;left:0;top:158px;width:1920px;text-align:center;font-size:26px;letter-spacing:.42em;color:var(--scrap)">LATE EDITION</div>
      <div id="f10-yr" class="head" style="position:absolute;left:0;top:312px;width:1920px;text-align:center;font-size:280px;color:var(--scrap)">2015</div>
      <div id="f10-r" class="revrule" style="left:660px;top:646px;width:600px;height:4px;transform-origin:50% 50%"></div>
      <div id="f10-a" class="body" style="position:absolute;left:0;top:684px;width:1920px;text-align:center;font-size:32px;color:var(--scrap)">
        Google open-sources the compromise, built on a decade of Stubby,<br>and every feature it ships is a concession</div>
      <div id="f10-b" class="slug" style="position:absolute;left:0;top:786px;width:1920px;text-align:center;font-size:19px;color:#F6D6D7">ANNOUNCED 8 SEPTEMBER 2015 &middot; GRPC.IO</div>
      ${penSvg("f10-u", underlineD(1042, 762, 250, 4), 4, "penw")}
    </div></div>`;

  const script = `
${enterLift("#stage")}
      // SEAM CARRIER — the year is full-size and full-opacity from frame zero.
      tl.fromTo("#f10-yr", { y: 20 }, { y: 0, duration: 0.58, ease: "power3.out" }, 0);
      gsap.set("#f10-kick", { autoAlpha: 0 });
      tl.to("#f10-kick", { autoAlpha: 1, duration: 0.28 }, 0.24);
      gsap.set("#f10-r", { scaleX: 0 });
      tl.to("#f10-r", { scaleX: 1, duration: 0.46, ease: "power3.out" }, 0.50);
      gsap.set("#f10-a", { autoAlpha: 0, y: 14 });
      tl.to("#f10-a", { autoAlpha: 1, y: 0, duration: 0.42, ease: "power3.out" }, 0.66);
      gsap.set("#f10-b", { autoAlpha: 0 });
      tl.to("#f10-b", { autoAlpha: 1, duration: 0.32 }, 1.04);
      ${penDraw("f10-u", 1.40, 0.48).trim()}`;

  return { body, script };
}
