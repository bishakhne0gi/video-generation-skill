// 13 TWO VERDICTS — the film's title beat, and the only Z-BACK seam in it. The previous
// frame recedes 1.0 -> 0.60; this one enters ABOVE 1.0 at 1.48 and settles DOWN to it,
// so both halves share the SIGN of the scale velocity. Mirroring reads as a bounce.
// Both spec sentences are verbatim from grpc/grpc doc/PROTOCOL-HTTP2.md.
import { page, header, headerIn, cutting, slapIn, enterZBack, penSvg, penDraw,
         boxD, arrowD, tickD, crossD, stamp, stampIn } from "../lib/frame.mjs";

const PART = (label, note, lines, red) => `
  <div class="slug" style="position:absolute;left:32px;top:22px;font-size:14px${red ? ";color:var(--stopt)" : ""}">${label}</div>
  <div class="slug faint" style="position:absolute;left:32px;top:22px;width:812px;text-align:right;font-size:13px">${note}</div>
  <div class="hair" style="left:32px;top:48px;width:812px"></div>
  <pre class="mono" style="position:absolute;left:32px;top:62px;font-size:25px;line-height:38px;white-space:pre">${lines}</pre>`;

export function build({ len }) {
  const body = `
    ${page("news")}
    <div id="stage" class="stage"><div class="inner">
      ${header("2015 &middot; THE TRAILERS", "TWO HUNDRED OK.<br>AND NOT FOUND.",
        "One response. The transport reports success and the call reports failure, and both are correct.", false, 84, 1320)}

      ${cutting("f13-h", { x: 150, y: 470, w: 876, h: 158, seed: 101, kind: "cut", rot: -0.6,
        body: PART("HEADERS", "HTTP/2 HEADERS FRAME", `:status       <span style="font-weight:700">200</span>\ncontent-type  application/grpc+proto`) })}

      ${cutting("f13-b", { x: 150, y: 646, w: 876, h: 120, seed: 106, kind: "cut", rot: 0.7, bg: "var(--news2)",
        body: PART("MESSAGE", "DATA FRAME", `00 00 00 00 00                  <span class="faint">empty</span>`) })}

      ${cutting("f13-t", { x: 150, y: 784, w: 876, h: 158, seed: 111, kind: "torn", rot: -0.9,
        body: PART("TRAILERS", "HTTP/2 HEADERS FRAME, END_STREAM", `grpc-status   <span class="red" style="font-weight:700">5</span>\ngrpc-message  feature not found`, true) })}

      ${penSvg("f13-b1", boxD(386, 536, 68, 30, 3), 5)}
      ${penSvg("f13-b2", boxD(386, 852, 36, 30, 8), 5)}
      ${penSvg("f13-tick", tickD(496, 548, 20), 6)}
      ${penSvg("f13-cross", crossD(452, 864, 20, 4), 6)}
      ${penSvg("f13-arr", arrowD(1046, 520, 1130, 748, 54), 5)}

      ${stamp("f13-s1", "HTTP SAYS: OK", { x: 1094, y: 470, w: 396, h: 76, seed: 12, size: 30 })}
      ${stamp("f13-s2", "GRPC SAYS: NOT_FOUND", { x: 1094, y: 736, w: 496, h: 76, seed: 21, size: 30 })}

      <div id="f13-r" class="rrule" style="left:1094px;top:570px;width:676px;transform-origin:0% 50%"></div>
      <div id="f13-q" class="quote" style="position:absolute;left:1094px;top:592px;width:690px;font-size:26px">
        &ldquo;This will prevent other HTTP/2 clients from interpreting a gRPC error response, which uses status 200 (OK), as successful.&rdquo;</div>

      <div id="f13-q2" class="quote" style="position:absolute;left:1094px;top:848px;width:690px;font-size:30px">
        &ldquo;Status must be sent in Trailers <span class="red">even if the status code is OK</span>.&rdquo;</div>
      <div id="f13-a" class="slug" style="position:absolute;left:1094px;top:948px;font-size:15px">GRPC/GRPC &middot; DOC/PROTOCOL-HTTP2.MD &middot; VERBATIM</div>
    </div></div>`;

  const script = `
${enterZBack("#stage")}
${headerIn(0.10)}
      gsap.set("#f13-h", { autoAlpha: 0 });
      tl.set("#f13-h", { autoAlpha: 1 }, 0.92);
      ${slapIn("f13-h", 0.92, 101, -0.6).trim()}
      ${penDraw("f13-b1", 1.54, 0.44).trim()}
      ${stampIn("f13-s1", 2.06, 12).trim()}

      gsap.set("#f13-b", { autoAlpha: 0 });
      tl.set("#f13-b", { autoAlpha: 1 }, 2.70);
      ${slapIn("f13-b", 2.70, 106, 0.7).trim()}

      // STILLNESS BEFORE THE CLIMAX — 0.6s of nothing, then the trailers land. It is
      // the cheapest emphasis in the kit and this is the beat that has earned it.
      gsap.set("#f13-t", { autoAlpha: 0 });
      tl.set("#f13-t", { autoAlpha: 1 }, 4.10);
      ${slapIn("f13-t", 4.10, 111, -0.9).trim()}
      ${penDraw("f13-b2", 4.74, 0.42).trim()}
      ${penDraw("f13-arr", 5.20, 0.50).trim()}
      ${stampIn("f13-s2", 5.72, 21).trim()}

      gsap.set("#f13-r", { scaleX: 0 });
      tl.to("#f13-r", { scaleX: 1, duration: 0.44, ease: "power3.out" }, 6.60);
      gsap.set("#f13-q", { autoAlpha: 0, y: 14 });
      tl.to("#f13-q", { autoAlpha: 1, y: 0, duration: 0.46, ease: "power3.out" }, 6.76);

      gsap.set("#f13-q2", { autoAlpha: 0, y: 14 });
      tl.to("#f13-q2", { autoAlpha: 1, y: 0, duration: 0.46, ease: "power3.out" }, 8.90);
      gsap.set("#f13-a", { autoAlpha: 0 });
      tl.to("#f13-a", { autoAlpha: 1, duration: 0.30 }, 9.44);
      // both verdicts marked, in the order the response delivers them
      ${penDraw("f13-tick", 10.10, 0.30).trim()}
      ${penDraw("f13-cross", 10.60, 0.32).trim()}`;

  return { body, script };
}
