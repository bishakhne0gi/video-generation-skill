// 14 THE ENUM — all seventeen codes, transcribed from grpc/grpc doc/statuscodes.md.
// Seventeen, not sixteen: OK is 0 and the sixteen failures run 1..16. The two glosses
// pulled out on the right are verbatim from that file's own descriptions.
// The grid arrives via anime.js stagger({grid, from:"center"}) — the one stagger form
// GSAP needs an index-to-grid function for and anime.js takes as an argument.
import { page, header, headerIn, enterAcross, drive, penSvg, penDraw, boxD, cutting,
         slapIn, stamp, stampIn, ellipseD } from "../lib/frame.mjs";

const CODES = [
  ["0","OK"],["1","CANCELLED"],["2","UNKNOWN"],
  ["3","INVALID_ARGUMENT"],["4","DEADLINE_EXCEEDED"],["5","NOT_FOUND"],
  ["6","ALREADY_EXISTS"],["7","PERMISSION_DENIED"],["8","RESOURCE_EXHAUSTED"],
  ["9","FAILED_PRECONDITION"],["10","ABORTED"],["11","OUT_OF_RANGE"],
  ["12","UNIMPLEMENTED"],["13","INTERNAL"],["14","UNAVAILABLE"],
  ["15","DATA_LOSS"],["16","UNAUTHENTICATED"],
];
const GX = 150, GY = 466, CW = 336, CHh = 74, GAP = 10;
const cellXY = (i) => [GX + (i % 3) * (CW + GAP), GY + Math.floor(i / 3) * (CHh + GAP)];

export function build({ len }) {
  const body = `
    ${page("news")}
    <div id="stage" class="stage"><div class="inner">
      ${header("2015 &middot; THE ENUM", "SEVENTEEN WAYS<br>FOR A CALL TO END",
        "A local function returns, or it throws. A remote call has to enumerate its failures in advance.", false, 84, 1320)}

      ${CODES.map(([n, name], i) => {
        const [x, y] = cellXY(i);
        const hot = n === "14" || n === "4";
        return `<div id="f14-c${i}" style="position:absolute;left:${x}px;top:${y}px;width:${CW}px;height:${CHh}px;
          border:2px solid ${hot ? "var(--stop)" : "rgba(78,70,56,.42)"};background:${hot ? "var(--scrap)" : "transparent"}">
          <div class="head2 ${hot ? "red" : "faint"}" style="position:absolute;left:14px;top:20px;font-size:34px;width:56px;text-align:right">${n}</div>
          <div class="mono${hot ? " red" : ""}" style="position:absolute;left:84px;top:26px;font-size:${name.length > 17 ? 17 : 19}px;font-weight:700;letter-spacing:-.01em">${name}</div>
        </div>`;
      }).join("")}

      <div id="f14-hl" class="slug" style="position:absolute;left:1226px;top:466px;font-size:16px;color:var(--stopt)">THE TWO CONFESSIONS</div>
      <div id="f14-hr" class="rrule" style="left:1226px;top:494px;width:548px;transform-origin:0% 50%"></div>

      <div id="f14-a" style="position:absolute;left:1226px;top:518px;width:552px">
        <div class="mono red" style="font-size:27px;font-weight:700">UNAVAILABLE &middot; 14</div>
        <div class="quote" style="margin-top:12px;font-size:26px">&ldquo;Use <span class="red">UNAVAILABLE</span> if the client can retry just the failing call.&rdquo;</div>
      </div>

      <div id="f14-b" style="position:absolute;left:1226px;top:700px;width:552px">
        <div class="mono red" style="font-size:27px;font-weight:700">DEADLINE_EXCEEDED &middot; 4</div>
        <div class="quote" style="margin-top:12px;font-size:26px">&ldquo;this error may be returned <span class="red">even if the operation has completed successfully</span>.&rdquo;</div>
      </div>

      <div id="f14-att" class="slug" style="position:absolute;left:1226px;top:918px;font-size:15px">GRPC/GRPC &middot; DOC/STATUSCODES.MD &middot; VERBATIM</div>

      <div id="f14-tie" class="bodyi" style="position:absolute;left:150px;top:960px;width:1030px;font-size:24px;color:var(--ink2)">
        This is 1994's partial failure, written down as an enum: the caller is told it does not know, and told what to do about it.</div>
      ${penSvg("f14-ok", ellipseD(318, 503, 186, 50, 4), 5)}
      ${penSvg("f14-ring", boxD(1214, 690, 572, 190, 6), 4)}
    </div></div>`;

  const ids = CODES.map((_, i) => `"#f14-c${i}"`).join(",");
  const script = `
${enterAcross("#stage")}
${headerIn(0.10)}
      // anime.js owns this arrival: a grid stagger from the centre outwards. Seeded
      // nothing here, so it is deterministic by construction.
      var g14 = [${ids}].map(function (s) { return document.querySelector(s); });
      g14.forEach(function (e) { gsap.set(e, { autoAlpha: 0 }); });
      var A14 = anime.animate(g14, {
        opacity: [0, 1], scale: [1.22, 1], duration: 130, ease: anime.steps(3),
        autoplay: false, delay: anime.stagger(64, { grid: [3, 6], from: "center" }) });
      tl.set(g14, { autoAlpha: 1 }, 0.88);
      ${drive("A14", 0.88, 1.30).trim()}

      gsap.set("#f14-hl", { autoAlpha: 0 });
      gsap.set("#f14-hr", { scaleX: 0 });
      tl.to("#f14-hl", { autoAlpha: 1, duration: 0.26 }, 2.90);
      tl.to("#f14-hr", { scaleX: 1, duration: 0.44, ease: "power3.out" }, 2.98);
      gsap.set("#f14-a", { autoAlpha: 0, y: 16 });
      tl.to("#f14-a", { autoAlpha: 1, y: 0, duration: 0.46, ease: "power3.out" }, 3.90);
      gsap.set("#f14-b", { autoAlpha: 0, y: 16 });
      tl.to("#f14-b", { autoAlpha: 1, y: 0, duration: 0.46, ease: "power3.out" }, 6.10);
      ${penDraw("f14-ring", 7.00, 0.78).trim()}
      gsap.set("#f14-att", { autoAlpha: 0 });
      tl.to("#f14-att", { autoAlpha: 1, duration: 0.28 }, 7.86);
      gsap.set("#f14-tie", { autoAlpha: 0, y: 14 });
      // seventeen codes; the pen rings the only one that is not a failure
      ${penDraw("f14-ok", 10.30, 0.90).trim()}
      tl.to("#f14-tie", { autoAlpha: 1, y: 0, duration: 0.46, ease: "power3.out" }, 11.90);`;

  return { body, script };
}
