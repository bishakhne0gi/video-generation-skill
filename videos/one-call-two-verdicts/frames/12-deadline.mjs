// 12 THE REVERSAL — the single design decision gRPC takes back. Frame 06 planted the
// 1984 sentence; this frame brings the same cutting back on the same aged stock, and
// strikes it. The timeout units are verbatim from the ABNF in PROTOCOL-HTTP2.md.
import { page, header, headerIn, cutting, slapIn, enterAcross, penSvg, penDraw,
         arrowD, strikeD, stamp, stampIn, readout, readoutIn } from "../lib/frame.mjs";

const UNITS = [["H", "Hour"], ["M", "Minute"], ["S", "Second"],
               ["m", "Millisecond"], ["u", "Microsecond"], ["n", "Nanosecond"]];
const CD = ["1500", "1210", "940", "700", "480", "300", "160", "60", "10", "0"];

export function build({ len }) {
  const body = `
    ${page("news")}
    <div id="stage" class="stage"><div class="inner">
      ${header("2015 &middot; THE REVERSAL", "THE ONE RULE<br>THEY OVERTURNED",
        "Nineteen eighty-four refused a deadline on principle. Every gRPC request carries one in its headers.", false, 84, 1320)}

      ${cutting("f12-old", {
        x: 150, y: 470, w: 748, h: 268, seed: 91, kind: "torn", rot: -1.4, bg: "var(--news2)",
        body: `
          <div class="slug" style="position:absolute;left:32px;top:24px;font-size:14px">FILED 1984 &middot; BIRRELL &amp; NELSON</div>
          <div class="hair" style="left:32px;top:50px;width:684px"></div>
          <div class="quote" style="position:absolute;left:32px;top:76px;width:684px;font-size:38px">local procedure calls have no time-out mechanism</div>`,
      })}

      ${penSvg("f12-strike", strikeD(186, 570, 690, 4), 7)}
      ${penSvg("f12-strike2", strikeD(186, 612, 236, 9), 7)}
      ${penSvg("f12-arr", arrowD(922, 604, 1042, 604, -22), 6)}

      ${cutting("f12-new", {
        x: 1062, y: 470, w: 708, h: 268, seed: 96, kind: "cut", rot: 1.1,
        body: `
          <div class="slug" style="position:absolute;left:32px;top:24px;font-size:14px">2015 &middot; REQUEST-HEADERS &middot; EVERY CALL</div>
          <div class="hair" style="left:32px;top:50px;width:644px"></div>
          <div class="mono" style="position:absolute;left:32px;top:84px;font-size:44px;font-weight:700">grpc-timeout<span class="red">:</span> 1500m</div>
          <div class="body faint" style="position:absolute;left:32px;top:158px;width:644px;font-size:21px;font-style:italic">If Timeout is omitted a server should assume an infinite timeout.</div>`,
      })}

      ${stamp("f12-st", "OVERTURNED", { x: 560, y: 682, w: 300, h: 66, seed: 37, size: 27 })}

      <!-- THE RUNNING SYSTEM: the deadline the header just declared, actually running -->
      <div id="f12-cl" class="slug" style="position:absolute;left:150px;top:800px;font-size:16px">THE DEADLINE, RUNNING</div>
      <div id="f12-cr" class="hair" style="left:150px;top:826px;width:748px"></div>
      ${readout("f12-cd", CD.map((c) => `${c} <span style="font-size:44px">ms left</span>`),
        "left:150px;top:846px;font-size:96px;height:118px", "fig")}
      <div id="f12-x" class="head2" style="position:absolute;left:150px;top:846px;font-size:52px;color:var(--stopt)">DEADLINE_EXCEEDED &middot; 4</div>
      <div id="f12-xs" class="body faint" style="position:absolute;left:150px;top:912px;font-size:22px;font-style:italic">the call is over, whatever the server is still doing</div>

      <div id="f12-ul" class="slug" style="position:absolute;left:1062px;top:800px;font-size:16px">TIMEOUTUNIT &middot; ABNF, VERBATIM</div>
      <div id="f12-ur" class="hair" style="left:1062px;top:826px;width:708px"></div>
      <div id="f12-un" class="mono" style="position:absolute;left:1062px;top:842px;width:708px;font-size:22px;line-height:34px;display:grid;grid-template-columns:1fr 1fr;gap:2px 30px">${
        UNITS.map(([k, v]) => `<div><span class="red" style="font-weight:700">${k}</span>&nbsp;&nbsp;${v}</div>`).join("")}</div>
      <div id="f12-cx" class="bodyi" style="position:absolute;left:1062px;top:952px;width:708px;font-size:20px;color:var(--ink2)">
        &ldquo;cancellation allows servers to reclaim resources when clients are well-behaved.&rdquo; &mdash; gRPC design principles</div>
    </div></div>`;

  const script = `
${enterAcross("#stage")}
${headerIn(0.10)}
      gsap.set("#f12-old", { autoAlpha: 0 });
      tl.set("#f12-old", { autoAlpha: 1 }, 0.90);
      ${slapIn("f12-old", 0.90, 91, -1.4).trim()}
      gsap.set("#f12-new", { autoAlpha: 0 });
      tl.set("#f12-new", { autoAlpha: 1 }, 2.60);
      ${slapIn("f12-new", 2.60, 96, 1.1).trim()}
      ${penDraw("f12-arr", 3.30, 0.44).trim()}
      ${penDraw("f12-strike", 3.90, 0.40).trim()}
      ${penDraw("f12-strike2", 4.10, 0.22).trim()}
      ${stampIn("f12-st", 4.36, 37).trim()}

      gsap.set("#f12-ul", { autoAlpha: 0 }); gsap.set("#f12-un", { autoAlpha: 0 });
      gsap.set("#f12-ur", { scaleX: 0, transformOrigin: "0% 50%" });
      tl.to("#f12-ul", { autoAlpha: 1, duration: 0.26 }, 5.10);
      tl.to("#f12-ur", { scaleX: 1, duration: 0.40, ease: "power3.out" }, 5.18);
      tl.to("#f12-un", { autoAlpha: 1, duration: 0.34 }, 5.34);
      gsap.set("#f12-cx", { autoAlpha: 0 });
      tl.to("#f12-cx", { autoAlpha: 1, duration: 0.32 }, 10.20);

      // and then the deadline runs down, on screen, to the status code it produces
      gsap.set("#f12-cl", { autoAlpha: 0 });
      gsap.set("#f12-cr", { scaleX: 0, transformOrigin: "0% 50%" });
      tl.to("#f12-cl", { autoAlpha: 1, duration: 0.26 }, 6.20);
      tl.to("#f12-cr", { scaleX: 1, duration: 0.40, ease: "power3.out" }, 6.28);
      gsap.set("#f12-cd", { autoAlpha: 0 });
      tl.to("#f12-cd", { autoAlpha: 1, duration: 0.20 }, 6.44);
      ${readoutIn("f12-cd", CD.length, 6.66, 0.30).trim()}
      gsap.set("#f12-x", { autoAlpha: 0, scale: 1.24 });
      tl.set("#f12-cd", { autoAlpha: 0 }, 9.42);
      tl.fromTo("#f12-x", { autoAlpha: 0, scale: 1.24 }, { autoAlpha: 1, scale: 1, duration: 0.12, ease: "steps(2)" }, 9.42);
      gsap.set("#f12-xs", { autoAlpha: 0 });
      tl.to("#f12-xs", { autoAlpha: 1, duration: 0.30 }, 9.70);`;

  return { body, script };
}
