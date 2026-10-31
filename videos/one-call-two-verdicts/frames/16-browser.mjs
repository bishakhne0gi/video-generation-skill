// 16 THE CATCH — both sentences are verbatim from grpc/grpc doc/PROTOCOL-WEB.md, and
// the 1-2 years prediction was checked against that file's FIRST commit
// (4daba4b6, 2016-11-08) rather than against master, because the whole point of the
// beat is when it was written. On the black plate nothing red is ever a letter:
// --stop on --plate measures 3.20:1, so rules stay red and type turns cream.
import { page, header, headerIn, cutting, slapIn, enterLift, penSvg, penDraw,
         crossD, boxD, stamp, stampIn } from "../lib/frame.mjs";

const RX0 = 1128, RX1 = 1748;
const rowY = [536, 690, 844];
const bx = (x, y, w, label, sub) => `
  <div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:66px;border:2px solid var(--scrap)">
    <div class="slug" style="position:absolute;left:0;top:14px;width:100%;text-align:center;font-size:13px;color:var(--scrap)">${label}</div>
    <div class="mono" style="position:absolute;left:0;top:36px;width:100%;text-align:center;font-size:15px;color:#A79E8D">${sub}</div>
  </div>`;

export function build({ len }) {
  const body = `
    ${page("plate")}
    <div id="stage" class="stage"><div class="inner rev">
      ${header("2026 &middot; THE CATCH", "BROWSERS STILL<br>CANNOT SPEAK IT",
        "The protocol that replaced REST for services still cannot reach the thing most people build.", true, 84, 940)}

      <div id="f16-r" class="rrule" style="left:150px;top:474px;width:900px;transform-origin:0% 50%"></div>
      <div id="f16-q" class="quote" style="position:absolute;left:150px;top:502px;width:910px;font-size:37px;color:var(--scrap)">
        &ldquo;decouple from HTTP/2 framing which is not, and <span style="font-family:'Playfair';font-style:italic">will never be</span>, directly exposed by browsers&rdquo;</div>
      <div id="f16-a" class="slug" style="position:absolute;left:150px;top:640px;font-size:16px;color:#A79E8D">GRPC/GRPC &middot; DOC/PROTOCOL-WEB.MD &middot; DESIGN GOALS &middot; VERBATIM</div>

      ${cutting("f16-p", {
        x: 150, y: 692, w: 900, h: 292, seed: 121, kind: "torn", rot: -1.1,
        body: `
          <div class="slug" style="position:absolute;left:34px;top:26px;font-size:14px">THE SAME FILE, PREDICTING ITS OWN OBSOLESCENCE</div>
          <div class="hair" style="left:34px;top:52px;width:832px"></div>
          <div class="quote" style="position:absolute;left:34px;top:70px;width:832px;font-size:30px">&ldquo;become optional <span class="red">(in 1-2 years)</span> when browsers are able to speak the native gRPC protocol&rdquo;</div>
          <div class="rule" style="left:34px;top:186px;width:832px;height:2px"></div>
          <div class="mono" style="position:absolute;left:34px;top:204px;font-size:22px;line-height:32px">committed&nbsp;&nbsp;8 November 2016<br>today&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;22 August 2026</div>
          <div class="head2 red" style="position:absolute;left:566px;top:210px;font-size:38px;text-align:right;width:300px">NINE YEARS,<br>NINE MONTHS</div>`,
      })}

      <div id="f16-dl" class="slug" style="position:absolute;left:${RX0}px;top:474px;font-size:16px;color:#A79E8D">WHAT ACTUALLY REACHES THE SERVER</div>
      <div id="f16-dh" class="revrule" style="left:${RX0}px;top:500px;width:${RX1 - RX0}px;height:2px;transform-origin:0% 50%"></div>

      ${rowY.map((y, i) => `
      <div id="f16-row${i}">
        ${bx(RX0, y, 190, "BROWSER", "fetch()")}
        ${i === 0 ? "" : bx(RX0 + 216, y, 188, i === 1 ? "PROXY" : "CONNECT", i === 1 ? "envoy" : "http/1.1")}
        ${bx(RX1 - 190, y, 190, "gRPC SERVER", "unchanged")}
        <div style="position:absolute;left:${RX0 + 190}px;top:${y + 32}px;width:${i === 0 ? RX1 - 190 - RX0 - 190 : 26}px;height:2px;background:var(--scrap)"></div>
        ${i === 0 ? "" : `<div style="position:absolute;left:${RX0 + 404}px;top:${y + 32}px;width:${RX1 - 190 - RX0 - 404}px;height:2px;background:var(--scrap)"></div>`}
        <div class="slug" style="position:absolute;left:${RX0}px;top:${y + 78}px;font-size:13px;color:${i === 2 ? "#F0A6A9" : "#8E8677"}">${
          ["HTTP/2 FRAMING IS NOT AVAILABLE HERE", "GRPC-WEB &middot; A TRANSLATOR IN THE PATH SINCE 2016", "CONNECT &middot; WIRE-COMPATIBLE, NO PROXY"][i]}</div>
      </div>`).join("")}

      ${penSvg("f16-x", crossD(RX0 + 300, rowY[0] + 33, 32, 5), 7)}
      ${penSvg("f16-ok", boxD(RX0 - 12, rowY[2] - 12, RX1 - RX0 + 24, 92, 7), 4)}
      ${stamp("f16-st", "STILL TRUE", { x: RX1 - 300, y: 960, w: 300, h: 62, seed: 51, size: 26, dark: true })}
    </div></div>`;

  const script = `
${enterLift("#stage")}
${headerIn(0.10)}
      gsap.set("#f16-r", { scaleX: 0 });
      tl.to("#f16-r", { scaleX: 1, duration: 0.46, ease: "power3.out" }, 0.60);
      gsap.set("#f16-q", { autoAlpha: 0, y: 16 });
      tl.to("#f16-q", { autoAlpha: 1, y: 0, duration: 0.52, ease: "power3.out" }, 0.76);
      gsap.set("#f16-a", { autoAlpha: 0 });
      tl.to("#f16-a", { autoAlpha: 1, duration: 0.30 }, 1.42);

      gsap.set("#f16-dl", { autoAlpha: 0 });
      gsap.set("#f16-dh", { scaleX: 0 });
      tl.to("#f16-dl", { autoAlpha: 1, duration: 0.26 }, 1.90);
      tl.to("#f16-dh", { scaleX: 1, duration: 0.44, ease: "power3.out" }, 1.98);
      gsap.set("#f16-row0", { autoAlpha: 0, x: 18 });
      tl.to("#f16-row0", { autoAlpha: 1, x: 0, duration: 0.36, ease: "power2.out" }, 2.20);
      ${penDraw("f16-x", 2.90, 0.34).trim()}
      gsap.set("#f16-row1", { autoAlpha: 0, x: 18 });
      tl.to("#f16-row1", { autoAlpha: 1, x: 0, duration: 0.36, ease: "power2.out" }, 3.60);
      gsap.set("#f16-row2", { autoAlpha: 0, x: 18 });
      tl.to("#f16-row2", { autoAlpha: 1, x: 0, duration: 0.36, ease: "power2.out" }, 6.40);

      gsap.set("#f16-p", { autoAlpha: 0 });
      tl.set("#f16-p", { autoAlpha: 1 }, 4.60);
      ${slapIn("f16-p", 4.60, 121, -1.1).trim()}
      ${penDraw("f16-ok", 7.30, 0.86).trim()}
      ${stampIn("f16-st", 9.30, 51).trim()}`;

  return { body, script };
}
