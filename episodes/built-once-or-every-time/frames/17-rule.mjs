// 17 RULE — the decision, reduced to one question with three destinations.
//
// This is the frame the episode exists to hand over. It deliberately does NOT say "SSG
// is faster": it says the speed argument is downstream of a question about the content,
// and then names all three honest answers including the middle one the film has
// otherwise ignored.
//
// The taxonomy and both definitions are web.dev's, "Rendering on the Web" (Addy Osmani &
// Jason Miller, 6 Feb 2019, last updated 5 Jan 2026) — cited on the sheet, because the
// frame is asserting a way of thinking rather than a measurement.
import { page, header, headerIn, ENTER, penSvg, penDraw, arrowD, stamp, stampIn } from "../lib/frame.mjs";

export function build({ seamIn }) {
  const X = 128;
  const OUT = [
    { k: "Yes — it is the same for everyone", w: "Build it once", n: "SSG · a static file, cached anywhere",
      ex: "docs · blogs · marketing · pricing" },
    { k: "Yes, but it changes often", w: "Build it per request", n: "SSR · ISR · on a server you run",
      ex: "listings · search results · feeds" },
    { k: "No — it depends on this person", w: "Build it on the device", n: "CSR · in the browser, after load",
      ex: "your drawing · your inbox · your cart" },
  ];
  const Y = 468, H = 176;

  const body = `${page("canvas")}
    <div id="stage" class="stage"><div class="inner">
      ${header("04 · THE TURN", "Stop asking which is faster.", "", false, 62)}

      <div id="r-q" class="disp" style="position:absolute;left:${X}px;top:296px;width:1560px;font-size:52px;line-height:1.1;letter-spacing:-1.2px;color:var(--primary-deep)">Does this page’s content exist before the request?</div>

      ${OUT.map((o, i) => `
      <div id="ro${i}" style="position:absolute;left:${X}px;top:${Y + i * H}px;width:760px">
        <div class="mono" style="font-size:24px;color:var(--mute)">${o.k}</div>
        <div class="disp" style="margin-top:12px;font-size:46px;letter-spacing:-1px;color:var(--ink)">${o.w}</div>
      </div>
      <div id="rd${i}" style="position:absolute;left:${X + 820}px;top:${Y + i * H + 6}px;width:840px">
        <div class="monob" style="font-size:25px;color:var(--ink)">${o.n}</div>
        <div class="mono" style="margin-top:17px;font-size:23px;color:var(--mute)">${o.ex}</div>
      </div>
      <div id="rh${i}" class="hair" style="left:${X}px;top:${Y + i * H + 126}px;width:1660px;transform-origin:0% 50%"></div>`).join("")}

      <div id="r-src" class="mono" style="position:absolute;left:${X}px;top:1002px;font-size:20px;color:var(--charcoal)">taxonomy: web.dev · “Rendering on the Web” · Addy Osmani &amp; Jason Miller · 6 Feb 2019, updated 5 Jan 2026</div>
      ${penSvg("p-arr", arrowD(X + 26, 402, X + 26, 456, 0), 4, "")}
      ${stamp("st17", "ASK THE CONTENT, NOT THE BENCHMARK", { x: 1050, y: 196 })}
    </div></div>`;

  const script = `${ENTER[seamIn]("#stage")}
${headerIn(0.10, false)}
      gsap.set(["#ro0", "#ro1", "#ro2", "#rd0", "#rd1", "#rd2", "#r-src"], { autoAlpha: 0 });
      gsap.set(["#rh0", "#rh1", "#rh2"], { scaleX: 0 });
      // the question is the SEAM CARRIER: it is the only thing on the frame at t=0 and
      // it rides the cut in at full opacity.
      tl.fromTo("#r-q", { y: 20 }, { y: 0, duration: 0.54, ease: "power3.out" }, 0);
${penDraw("p-arr", 1.10, 0.34)}

      // Each answer arrives in TWO halves — the condition, then the destination — 1.3s
      // apart. As one block per answer the frame sat still for 2.7s three times over,
      // which the frozen-frame test found and scrubbing never would.
${[0, 1, 2].map((i) => {
  const t = 1.62 + i * 2.70;
  return `      tl.fromTo("#ro${i}", { autoAlpha: 0, x: -22 }, { autoAlpha: 1, x: 0, duration: 0.46, ease: "power3.out" }, ${t.toFixed(2)});
      tl.to("#rh${i}", { scaleX: 1, duration: 0.50, ease: "power3.out" }, ${(t + 0.24).toFixed(2)});
      tl.fromTo("#rd${i}", { autoAlpha: 0, x: 22 }, { autoAlpha: 1, x: 0, duration: 0.44, ease: "power3.out" }, ${(t + 1.30).toFixed(2)});`;
}).join("\n")}

      tl.fromTo("#r-src", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.36, ease: "power3.out" }, 10.30);
${stampIn("st17", 11.10)}`;

  return { body, script };
}
