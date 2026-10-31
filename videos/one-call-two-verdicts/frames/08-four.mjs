// 08 FOUR — Waldo, Wyant, Wollrath & Kendall, SMLI TR-94-29, November 1994.
// The abstract sentence and the partial-failure sentence are VERBATIM and set in
// Playfair, which in this register means "this is a quotation". The four glosses are
// mine and are set in PT Serif, which means "this is the film talking". The reader can
// tell them apart without reading a single attribution.
import { page, header, headerIn, cutting, slapIn, enterAcross, penSvg, penDraw,
         ellipseD, strikeD, stamp, stampIn } from "../lib/frame.mjs";

const CARDS = [
  ["01", "LATENCY",             "Nanoseconds become milliseconds. Four orders of magnitude, and no amount of API design makes it go away."],
  ["02", "MEMORY<br>ACCESS",    "A pointer means nothing on the other machine. Everything is copied &mdash; and a copy is stale on arrival."],
  ["03", "CONCURRENCY",         "The other side is not waiting for you. It serves everybody else, in an order you do not control."],
  ["04", "PARTIAL<br>FAILURE",  "&ldquo;Partial failure is a central reality of distributed computing.&rdquo;"],
];
const CY = 440, CH = 352;

export function build({ len }) {
  const body = `
    ${page("news2")}
    <div id="stage" class="stage"><div class="inner">
      ${header("1994 &middot; THE REBUTTAL", "FOUR THINGS<br>YOU CANNOT HIDE",
        "Ten years on, Sun Microsystems Laboratories answers Xerox PARC, and the answer is a list.", false, 86, 1320)}

      ${CARDS.map((c, i) => {
        const two = c[1].includes("<br"), ty = two ? 172 : 136;
        return cutting(`f8-c${i}`, {
          x: 150 + i * 410, y: CY, w: 380, h: CH, seed: 50 + i * 7,
          kind: i === 3 ? "torn" : "cut",
          body: `
            <div class="head2 ${i === 3 ? "red" : "faint"}" style="position:absolute;left:26px;top:22px;font-size:46px">${c[0]}</div>
            <div class="head2 ${i === 3 ? "red" : ""}" style="position:absolute;left:26px;top:82px;width:330px;font-size:34px">${c[1]}</div>
            <div class="hair" style="left:26px;top:${ty}px;width:330px"></div>
            <div class="${i === 3 ? "qital" : "body"}" style="position:absolute;left:26px;top:${ty + 16}px;width:330px;font-size:${i === 3 ? 25 : 20}px;color:var(--ink${i === 3 ? "" : "2"})">${c[2]}</div>`,
        });
      }).join("")}

      ${penSvg("f8-ring", ellipseD(1570, CY + CH / 2 - 4, 212, 192, 12), 5)}
      ${penSvg("f8-s0", strikeD(176, CY + 108, 330, 3), 6)}
      ${penSvg("f8-s1", strikeD(586, CY + 108, 330, 8), 6)}
      ${stamp("f8-st", "THE ONE THAT MATTERS", { x: 1348, y: 812, w: 436, h: 60, seed: 33, size: 25 })}

      <div id="f8-r" class="rrule" style="left:150px;top:838px;width:1150px;transform-origin:0% 50%"></div>
      <div id="f8-q" class="quote" style="position:absolute;left:150px;top:864px;width:1160px;font-size:30px">
        &ldquo;distributed systems require that the programmer be aware of latency, have a different model of memory access, and take into account issues of concurrency and partial failure.&rdquo;</div>
      <div id="f8-a" class="slug" style="position:absolute;left:150px;top:996px;font-size:16px">SMLI TR-94-29 &middot; ABSTRACT &middot; VERBATIM</div>

      <!-- PT Serif, not Playfair: in this register that alone says "not a quotation" -->
      <div id="f8-p" class="bodyi" style="position:absolute;left:1348px;top:894px;width:440px;font-size:21px;color:var(--ink2)">
        The paper allows that the first two could, in principle, be masked. It says the last two cannot.</div>
    </div></div>`;

  let script = `
${enterAcross("#stage")}
${headerIn(0.10)}`;
  CARDS.forEach((c, i) => {
    const t = 1.00 + i * 0.86;
    script += `\n      gsap.set("#f8-c${i}", { autoAlpha: 0 });` +
      `\n      tl.set("#f8-c${i}", { autoAlpha: 1 }, ${t.toFixed(2)});` + slapIn(`f8-c${i}`, t, 50 + i * 7);
  });
  script += `
      // the fourth is what the rest of the film is about, so the pen rings it and
      // nothing else — one mark, on the thing that earns it
      ${penDraw("f8-ring", 4.72, 0.86).trim()}
      ${stampIn("f8-st", 5.86, 33).trim()}

      gsap.set("#f8-r", { scaleX: 0 });
      tl.to("#f8-r", { scaleX: 1, duration: 0.46, ease: "power3.out" }, 6.44);
      gsap.set("#f8-q", { autoAlpha: 0, y: 16 });
      tl.to("#f8-q", { autoAlpha: 1, y: 0, duration: 0.50, ease: "power3.out" }, 6.60);
      gsap.set("#f8-a", { autoAlpha: 0 });
      tl.to("#f8-a", { autoAlpha: 1, duration: 0.30 }, 7.20);

      // and then the film keeps working: the two that CAN be hidden get struck out
      ${penDraw("f8-s0", 8.10, 0.34).trim()}
      ${penDraw("f8-s1", 8.62, 0.34).trim()}
      gsap.set("#f8-p", { autoAlpha: 0, y: 12 });
      tl.to("#f8-p", { autoAlpha: 1, y: 0, duration: 0.40, ease: "power3.out" }, 9.16);`;

  return { body, script };
}
