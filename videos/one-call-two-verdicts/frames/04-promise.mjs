// 04 PROMISE — Birrell & Nelson, ACM TOCS Vol. 2 No. 1, February 1984, pages 39-59.
// Both quotations are verbatim from the paper, which was downloaded and text-extracted
// rather than taken second-hand. Section 1.3 "Aims" and section 1.4 respectively.
import { page, header, headerIn, cutting, slapIn, stamp, stampIn, enterAcross,
         typeOn, penSvg, penDraw, underlineD, bracketD } from "../lib/frame.mjs";

const ABSTRACT = `Remote procedure calls (RPC) appear to be a useful paradigm for providing communication across a network between programs written in a high-level language. This paper describes a package providing a remote procedure call facility, the options that face the designer of such a package, and the decisions we made.`.replace(/, the options[^]*$/, ".");

export function build({ len }) {
  const body = `
    ${page("news")}
    <div id="stage" class="stage"><div class="inner">
      ${header("1984 &middot; XEROX PARC", "MAKE DISTRIBUTED<br>COMPUTATION EASY",
        "Andrew Birrell and Bruce Nelson propose that a procedure should run on a machine that is not yours &mdash; and that you should barely notice.", false, 86, 1000)}

      ${cutting("f4-paper", {
        x: 150, y: 508, w: 872, h: 396, seed: 21, kind: "cut", rot: -0.9,
        body: `
          <div class="slug" style="position:absolute;left:44px;top:34px;font-size:13px;letter-spacing:.16em">ACM TRANSACTIONS ON COMPUTER SYSTEMS &middot; VOL.&nbsp;2, No.&nbsp;1 &middot; FEBRUARY 1984 &middot; PP.&nbsp;39&ndash;59</div>
          <div class="hair" style="left:44px;top:60px;width:784px"></div>
          <div id="f4-t" class="bodyb" style="position:absolute;left:44px;top:78px;width:784px;font-size:44px;line-height:1.14">Implementing Remote Procedure Calls</div>
          <div id="f4-a" class="slug" style="position:absolute;left:44px;top:184px;font-size:17px;letter-spacing:.10em;color:var(--ink)">ANDREW D. BIRRELL <span class="bodyi" style="letter-spacing:0;text-transform:none;font-size:19px">and</span> BRUCE JAY NELSON</div>
          <div id="f4-x" class="body faint" style="position:absolute;left:44px;top:214px;font-size:21px;font-style:italic">Xerox Palo Alto Research Center, Palo Alto, California</div>
          <div class="rule" style="left:44px;top:256px;width:784px;height:2px"></div>
          <div id="f4-abs" class="body" style="position:absolute;left:44px;top:274px;width:784px;font-size:19px;line-height:1.44;text-align:justify;color:var(--ink2)">${ABSTRACT}</div>`,
      })}

      <!-- the two sentences the whole film turns on, set as broadsheet pull-quotes -->
      <div id="f4-r1" class="rrule" style="left:1078px;top:472px;width:692px;transform-origin:0% 50%"></div>
      <div id="f4-q1" class="quote" style="position:absolute;left:1078px;top:502px;width:700px;font-size:39px">
        &ldquo;The primary purpose of our RPC project was to make <span class="red">distributed computation easy</span>.&rdquo;</div>
      <div id="f4-c1" class="slug" style="position:absolute;left:1078px;top:684px;font-size:16px">&sect;&nbsp;1.3 &mdash; AIMS</div>

      <div id="f4-r2" class="hair" style="left:1078px;top:726px;width:692px"></div>
      <div id="f4-q2" class="qital" style="position:absolute;left:1078px;top:746px;width:700px;font-size:30px;color:var(--ink)">
        &ldquo;the semantics of remote procedure calls should be</div>
      <div id="f4-q2b" class="quote" style="position:absolute;left:1078px;top:820px;font-size:44px;white-space:nowrap">as close as possible</div>
      <div id="f4-q2c" class="qital" style="position:absolute;left:1078px;top:876px;width:700px;font-size:30px;color:var(--ink)">
        to those of local (single-machine) procedure calls.&rdquo;</div>
      <div id="f4-c2" class="slug" style="position:absolute;left:1078px;top:946px;font-size:16px">&sect;&nbsp;1.4 &mdash; A DESIGN PRINCIPLE</div>

      <!-- the mark attaches to #f4-q2b, a box whose left and top are known exactly.
           Its width is verified against the render, never estimated. -->
      ${penSvg("f4-u", underlineD(1074, 874, 428, 5), 5)}
      ${penSvg("f4-br", bracketD(178, 786, 890, 20, -1), 5)}
      ${stamp("f4-st", "FILED", { x: 856, y: 792, w: 168, h: 56, seed: 17, size: 24 })}
    </div></div>`;

  const script = `
${enterAcross("#stage")}
${headerIn(0.10)}
      ${slapIn("f4-paper", 1.10, 21, -0.9).trim()}
      gsap.set("#f4-paper", { autoAlpha: 0 });
      tl.set("#f4-paper", { autoAlpha: 1 }, 1.10);
      // the paper fills in the order a page is read
      gsap.set("#f4-t", { autoAlpha: 0, y: 12 });
      tl.to("#f4-t", { autoAlpha: 1, y: 0, duration: 0.40, ease: "power3.out" }, 1.34);
      gsap.set("#f4-a", { autoAlpha: 0 });
      tl.to("#f4-a", { autoAlpha: 1, duration: 0.32 }, 1.62);
      gsap.set("#f4-x", { autoAlpha: 0 });
      tl.to("#f4-x", { autoAlpha: 1, duration: 0.32 }, 1.80);
      // RUNNING SYSTEM — the abstract sets itself across three seconds of the frame
      ${typeOn("f4-abs", 2.10, 3.30, 118).trim()}

      gsap.set("#f4-r1", { scaleX: 0 });
      tl.to("#f4-r1", { scaleX: 1, duration: 0.46, ease: "power3.out" }, 3.90);
      gsap.set("#f4-q1", { autoAlpha: 0, y: 18 });
      tl.to("#f4-q1", { autoAlpha: 1, y: 0, duration: 0.50, ease: "power3.out" }, 4.06);
      gsap.set("#f4-c1", { autoAlpha: 0 });
      tl.to("#f4-c1", { autoAlpha: 1, duration: 0.30 }, 4.62);

      gsap.set("#f4-r2", { scaleX: 0, transformOrigin: "0% 50%" });
      tl.to("#f4-r2", { scaleX: 1, duration: 0.44, ease: "power3.out" }, 6.60);
      gsap.set("#f4-q2", { autoAlpha: 0, y: 16 });
      tl.to("#f4-q2", { autoAlpha: 1, y: 0, duration: 0.48, ease: "power3.out" }, 6.76);
      gsap.set("#f4-q2b", { autoAlpha: 0, y: 14 });
      tl.to("#f4-q2b", { autoAlpha: 1, y: 0, duration: 0.40, ease: "power3.out" }, 7.16);
      gsap.set("#f4-q2c", { autoAlpha: 0, y: 14 });
      tl.to("#f4-q2c", { autoAlpha: 1, y: 0, duration: 0.42, ease: "power3.out" }, 7.44);
      gsap.set("#f4-c2", { autoAlpha: 0 });
      tl.to("#f4-c2", { autoAlpha: 1, duration: 0.30 }, 7.92);

      // the pen finds the clause the next forty-two years argue about
      ${penDraw("f4-u", 8.30, 0.56).trim()}
      ${stampIn("f4-st", 9.60, 17).trim()}
      // the reader brackets the abstract in the margin — the beat keeps working to the line
      ${penDraw("f4-br", 10.20, 0.62).trim()}`;

  return { body, script };
}
