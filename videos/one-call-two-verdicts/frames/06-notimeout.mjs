// 06 THE REFUSAL — they considered a deadline and turned it down, and said why in one
// sentence. Verbatim from section 1.4. This frame plants what frame 12 pays off: the
// single design decision gRPC reverses.
import { page, header, headerIn, cutting, slapIn, enterAcross, penSvg, penDraw,
         underlineD, readout, readoutIn, stamp, stampIn } from "../lib/frame.mjs";

// accelerating, because the point is that nothing stops it
const EL = ["00:00.4","00:01.9","00:07.2","00:24.6","01:38.0","04:11.7","13:52.4",
            "41:08.9","2:17:33","9:44:02","1d 06:11","4d 22:37","19d 04:55"];

export function build({ len }) {
  const body = `
    ${page("news")}
    <div id="stage" class="stage"><div class="inner">
      ${header("1984 &middot; THE REFUSAL", "AND NO<br>TIMEOUT",
        "They considered a deadline and turned it down. The reasoning is one sentence long, and it stands for thirty-one years.", false, 86, 1000)}

      ${cutting("f6-q", {
        x: 150, y: 486, w: 986, h: 372, seed: 27, kind: "cut", rot: 0.8,
        body: `
          <div class="slug" style="position:absolute;left:42px;top:28px;font-size:13px;letter-spacing:.16em">BIRRELL &amp; NELSON &middot; &sect;&nbsp;1.4 &middot; VERBATIM</div>
          <div class="hair" style="left:42px;top:54px;width:900px"></div>
          <div id="f6-q1" class="qital" style="position:absolute;left:42px;top:72px;width:900px;font-size:29px;color:var(--ink)">
            &ldquo;we chose to have <span style="font-style:normal;font-weight:700">no time-out mechanism</span> limiting the duration of a remote call &hellip; whereas most communication packages consider this a worthwhile feature.&rdquo;</div>
          <div class="rule" style="left:42px;top:222px;width:900px;height:2px"></div>
          <div id="f6-q2l" class="slug" style="position:absolute;left:42px;top:238px;font-size:15px">THEIR REASON, IN FULL</div>
          <div id="f6-q2" class="quote" style="position:absolute;left:42px;top:268px;width:900px;font-size:37px">local procedure calls have no time-out mechanism</div>`,
      })}

      <!-- the mark attaches to #f6-q2, a box whose left/top this file already knows -->
      ${penSvg("f6-u", underlineD(188, 812, 786, 7), 5)}

      ${cutting("f6-clk", {
        x: 1188, y: 486, w: 592, h: 300, seed: 44, kind: "torn", rot: -1.6, bg: "var(--news2)",
        body: `
          <div class="slug" style="position:absolute;left:34px;top:28px;font-size:15px">ELAPSED &middot; ONE CALL, NO DEADLINE</div>
          <div class="hair" style="left:34px;top:56px;width:520px"></div>
          ${readout("f6-el", EL, "left:34px;top:82px;font-size:88px;height:110px", "fig")}
          <div class="rule" style="left:34px;top:216px;width:520px;height:2px"></div>
          <div id="f6-still" class="body" style="position:absolute;left:34px;top:232px;font-size:26px;font-style:italic;color:var(--ink2)">still waiting &mdash; and entitled to</div>`,
      })}

      ${stamp("f6-hold", "HOLD FOR 2015", { x: 1210, y: 830, w: 340, h: 74, seed: 23, size: 29 })}
      <div id="f6-note" class="body faint" style="position:absolute;left:150px;top:894px;width:900px;font-size:23px;font-style:italic">
        Thirty-one years later, gRPC will put a deadline in the headers of every single request.</div>
      <div id="f6-nr" class="hair" style="left:150px;top:880px;width:900px"></div>
    </div></div>`;

  const script = `
${enterAcross("#stage")}
${headerIn(0.10)}
      ${slapIn("f6-q", 1.00, 27, 0.8).trim()}
      gsap.set("#f6-q", { autoAlpha: 0 });
      tl.set("#f6-q", { autoAlpha: 1 }, 1.00);
      gsap.set("#f6-q1", { autoAlpha: 0, y: 14 });
      tl.to("#f6-q1", { autoAlpha: 1, y: 0, duration: 0.48, ease: "power3.out" }, 1.26);
      gsap.set("#f6-q2l", { autoAlpha: 0 });
      tl.to("#f6-q2l", { autoAlpha: 1, duration: 0.28 }, 3.30);
      gsap.set("#f6-q2", { autoAlpha: 0, y: 14 });
      tl.to("#f6-q2", { autoAlpha: 1, y: 0, duration: 0.44, ease: "power3.out" }, 3.48);
      ${penDraw("f6-u", 4.30, 0.62).trim()}

      // THE RUNNING SYSTEM — a call with no deadline, still running. It accelerates
      // because the argument is that nothing in the design ever stops it.
      ${slapIn("f6-clk", 5.30, 44, -1.6).trim()}
      gsap.set("#f6-clk", { autoAlpha: 0 });
      tl.set("#f6-clk", { autoAlpha: 1 }, 5.30);
      ${readoutIn("f6-el", EL.length, 5.72, 0.42).trim()}
      gsap.set("#f6-still", { autoAlpha: 0 });
      tl.to("#f6-still", { autoAlpha: 1, duration: 0.30 }, 8.10);

      ${stampIn("f6-hold", 9.10, 23).trim()}
      gsap.set("#f6-nr", { scaleX: 0, transformOrigin: "0% 50%" });
      tl.to("#f6-nr", { scaleX: 1, duration: 0.42, ease: "power3.out" }, 9.30);
      gsap.set("#f6-note", { autoAlpha: 0, y: 12 });
      tl.to("#f6-note", { autoAlpha: 1, y: 0, duration: 0.42, ease: "power3.out" }, 9.44);`;

  return { body, script };
}
