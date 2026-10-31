// 09 INDISTINGUISHABLE — the film's central diagram, and the sentence it is drawn from
// is verbatim from SMLI TR-94-29 section 4.3. Two different failures are staged side by
// side, run three times, and produce byte-identical evidence at the caller. The two
// readout cuttings are generated from ONE template so they cannot accidentally differ.
import { page, header, headerIn, cutting, slapIn, enterAcross, penSvg, penDraw,
         crossD, boxD, underlineD } from "../lib/frame.mjs";

const PY = 496, PH = 292, PW = 780;
const AX = 150, BX = 990;

// panel-local geometry, shared by both panels so the two diagrams are the same drawing
const CLI = [30, 92, 190, 96], WIRE = [220, 136, 300, 5], SRV = [520, 92, 190, 96];
const box = (g, label, sub) =>
  `<div style="position:absolute;left:${g[0]}px;top:${g[1]}px;width:${g[2]}px;height:${g[3]}px;border:3px solid var(--ink);background:var(--scrap)">
     <div class="slug" style="position:absolute;left:0;top:20px;width:100%;text-align:center;font-size:15px;color:var(--ink)">${label}</div>
     <div class="mono faint" style="position:absolute;left:0;top:48px;width:100%;text-align:center;font-size:19px">${sub}</div>
   </div>`;

const READOUT = `
  <div class="slug" style="position:absolute;left:28px;top:22px;font-size:15px">WHAT THE CALLER SEES</div>
  <div class="hair" style="left:28px;top:48px;width:724px"></div>
  <div class="mono" style="position:absolute;left:28px;top:62px;font-size:25px;line-height:34px;white-space:pre">sent      14:22:07.113
received  &mdash;
status    &mdash;</div>`;

const panel = (id, seed, rot, title, deadWire) => cutting(id, {
  x: id === "f9-a" ? AX : BX, y: PY, w: PW, h: PH, seed, kind: "cut", rot,
  body: `
    <div class="slug" style="position:absolute;left:28px;top:22px;font-size:15px">${title}</div>
    <div class="hair" style="left:28px;top:48px;width:724px"></div>
    ${box(CLI, "CLIENT", "your process")}
    <div style="position:absolute;left:${WIRE[0]}px;top:${WIRE[1]}px;width:${WIRE[2]}px;height:${WIRE[3]}px;background:var(--ink)"></div>
    ${box(SRV, "SERVER", "10.4.2.19")}
    <div id="${id}-pkt" style="position:absolute;left:${WIRE[0] + 6}px;top:${WIRE[1] - 10}px;width:24px;height:24px;background:var(--ink)"></div>
    <div class="slug faint" style="position:absolute;left:${WIRE[0]}px;top:${WIRE[1] + 40}px;width:${WIRE[2]}px;text-align:center;font-size:14px">${deadWire ? "LINK" : "PROCESS"}</div>`,
});

export function build({ len }) {
  // the X lands on the LINK in case A and on the SERVER in case B — frame-absolute
  const xA = [AX + WIRE[0] + 150, PY + WIRE[1] + 2];
  const xB = [BX + SRV[0] + 95, PY + SRV[1] + 48];

  const body = `
    ${page("news2")}
    <div id="stage" class="stage"><div class="inner">
      ${header("1994 &middot; PARTIAL FAILURE", "TWO FAILURES.<br>ONE SILENCE.", "", false, 86)}

      <div id="f9-r" class="rrule" style="left:150px;top:352px;width:1620px;transform-origin:0% 50%"></div>
      <div id="f9-q" class="quote" style="position:absolute;left:150px;top:380px;width:1620px;font-size:35px">
        &ldquo;In a distributed system, the failure of a network link is <span class="red">indistinguishable</span> from the failure of a processor on the other side of that link.&rdquo;</div>
      <div id="f9-att" class="slug" style="position:absolute;left:150px;top:466px;font-size:16px">SMLI TR-94-29 &middot; &sect;&nbsp;4.3 PARTIAL FAILURE AND CONCURRENCY &middot; VERBATIM</div>

      ${panel("f9-a", 61, -0.8, "CASE A &mdash; THE LINK DIES", true)}
      ${panel("f9-b", 68, 1.1, "CASE B &mdash; THE MACHINE DIES", false)}
      ${penSvg("f9-xa", crossD(xA[0], xA[1], 30, 3), 7)}
      ${penSvg("f9-xb", crossD(xB[0], xB[1], 30, 9), 7)}

      ${cutting("f9-oa", { x: AX, y: 828, w: PW, h: 190, seed: 71, kind: "torn", rot: 0.9, body: READOUT })}
      ${cutting("f9-ob", { x: BX, y: 828, w: PW, h: 190, seed: 77, kind: "torn", rot: -1.2, body: READOUT })}
      ${penSvg("f9-ba", boxD(AX + 16, 884, 744, 116, 5), 4)}
      ${penSvg("f9-bb", boxD(BX + 16, 884, 744, 116, 11), 4)}
      ${penSvg("f9-ua", underlineD(AX + 28, 996, 172, 3), 4)}
      ${penSvg("f9-ub", underlineD(BX + 28, 996, 172, 9), 4)}
      <div id="f9-eq" class="head2" style="position:absolute;left:944px;top:882px;font-size:86px;color:var(--stopt)">=</div>
    </div></div>`;

  const script = `
${enterAcross("#stage")}
${headerIn(0.10, false)}
      gsap.set("#f9-r", { scaleX: 0 });
      tl.to("#f9-r", { scaleX: 1, duration: 0.50, ease: "power3.out" }, 0.42);
      gsap.set("#f9-q", { autoAlpha: 0, y: 16 });
      tl.to("#f9-q", { autoAlpha: 1, y: 0, duration: 0.52, ease: "power3.out" }, 0.58);
      gsap.set("#f9-att", { autoAlpha: 0 });
      tl.to("#f9-att", { autoAlpha: 1, duration: 0.30 }, 1.18);

      gsap.set("#f9-a", { autoAlpha: 0 }); gsap.set("#f9-b", { autoAlpha: 0 });
      tl.set("#f9-a", { autoAlpha: 1 }, 1.90);
      tl.set("#f9-b", { autoAlpha: 1 }, 2.22);
      ${slapIn("f9-a", 1.90, 61, -0.8).trim()}
      ${slapIn("f9-b", 2.22, 68, 1.1).trim()}

      // THE RUNNING SYSTEM — the same request, sent three times, on both diagrams at
      // once. It stops at a different place in each panel and that difference never
      // reaches the caller. This is the frame's whole middle and it is the argument.
      gsap.set("#f9-a-pkt", { autoAlpha: 0 }); gsap.set("#f9-b-pkt", { autoAlpha: 0 });
      tl.set("#f9-a-pkt", { autoAlpha: 1 }, 2.90);
      tl.set("#f9-b-pkt", { autoAlpha: 1 }, 2.90);`;

  // pass 1 stops short; the crosses draw; passes 2 and 3 repeat the same dead end
  const runs = [[2.90, 1.10], [4.90, 0.95], [6.30, 0.80]];
  let s2 = "";
  for (const [t, d] of runs) {
    s2 += `\n      tl.fromTo("#f9-a-pkt", { x: 0 }, { x: 138, duration: ${d}, ease: "power2.out" }, ${t});` +
      `\n      tl.fromTo("#f9-b-pkt", { x: 0 }, { x: 288, duration: ${d}, ease: "power2.out" }, ${t});` +
      `\n      tl.set("#f9-a-pkt", { autoAlpha: 0 }, ${(t + d + 0.22).toFixed(2)});` +
      `\n      tl.set("#f9-b-pkt", { autoAlpha: 0 }, ${(t + d + 0.22).toFixed(2)});` +
      `\n      tl.set("#f9-a-pkt", { autoAlpha: 1, x: 0 }, ${(t + d + 0.50).toFixed(2)});` +
      `\n      tl.set("#f9-b-pkt", { autoAlpha: 1, x: 0 }, ${(t + d + 0.50).toFixed(2)});`;
  }

  const s3 = `
      ${penDraw("f9-xa", 4.14, 0.36).trim()}
      ${penDraw("f9-xb", 4.42, 0.36).trim()}

      // and the evidence: two cuttings, generated from one template, side by side
      gsap.set("#f9-oa", { autoAlpha: 0 }); gsap.set("#f9-ob", { autoAlpha: 0 });
      tl.set("#f9-oa", { autoAlpha: 1 }, 7.60);
      tl.set("#f9-ob", { autoAlpha: 1 }, 7.92);
      ${slapIn("f9-oa", 7.60, 71, 0.9).trim()}
      ${slapIn("f9-ob", 7.92, 77, -1.2).trim()}
      ${penDraw("f9-ba", 8.60, 0.62).trim()}
      ${penDraw("f9-bb", 9.10, 0.62).trim()}
      gsap.set("#f9-eq", { autoAlpha: 0, scale: 0.5 });
      tl.fromTo("#f9-eq", { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 1, scale: 1, duration: 0.16, ease: "steps(3)" }, 9.82);
      // the mark lands on the one line that is identical in both cases
      ${penDraw("f9-ua", 10.40, 0.34).trim()}
      ${penDraw("f9-ub", 10.80, 0.34).trim()}`;

  return { body, script: script + s2 + s3 };
}
