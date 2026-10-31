// 09 JEKYLL 2008 — the definition, from the people who wrote it.
//
// Two verbatim quotations, eighteen years apart, saying the same thing. Both are set in
// display on the dark band because on this act a quotation IS the content; the mono lane
// is reserved for the attributions, which are the part that has to be checkable.
//
//   Tom Preston-Werner, "Blogging Like a Hacker", 17 Nov 2008
//   web.dev, "Rendering on the Web", Addy Osmani & Jason Miller,
//     published 6 Feb 2019, last updated 5 Jan 2026
//
// The dates run 2008 -> 2019 -> 2026 along a rule, because the film's claim is that this
// is old, settled ground rather than a new argument.
import { page, header, headerIn, ENTER, penSvg, penDraw, underlineD } from "../lib/frame.mjs";

export function build({ seamIn }) {
  const X = 128;

  const body = `${page("dark")}
    <div id="stage" class="stage"><div class="inner">
      ${header("02 · WHEN", "None of this is new.", "", true, 62)}

      <div id="q1" class="disp" style="position:absolute;left:${X}px;top:330px;width:1180px;font-size:54px;line-height:1.14;letter-spacing:-1px;color:var(--on-dark)">“It takes a template directory … and spits out a complete, static website suitable for serving with Apache or your favorite web server.”</div>
      <div id="a1" class="mono" style="position:absolute;left:${X + 4}px;top:588px;font-size:24px;color:var(--stone)">Tom Preston-Werner · “Blogging Like a Hacker” · 17 November 2008</div>
      <div id="a1b" class="mono" style="position:absolute;left:${X + 4}px;top:626px;font-size:24px;color:var(--ash)">the post that shipped Jekyll</div>

      <div id="hr1" class="hairD" style="left:${X}px;top:690px;width:1180px;transform-origin:0% 50%"></div>

      <div id="q2" class="disp" style="position:absolute;left:${X}px;top:734px;width:1180px;font-size:62px;line-height:1.1;letter-spacing:-1.4px;color:var(--on-dark)">“Static rendering happens at build time.”</div>
      <div id="a2" class="mono" style="position:absolute;left:${X + 4}px;top:872px;font-size:24px;color:var(--stone)">web.dev · “Rendering on the Web” · Addy Osmani &amp; Jason Miller</div>
      <div id="a2b" class="mono" style="position:absolute;left:${X + 4}px;top:910px;font-size:24px;color:var(--ash)">published 6 Feb 2019 · last updated 5 Jan 2026</div>

      <div id="tl-rule" class="hairD" style="left:1419px;top:392px;width:4px;height:560px;transform-origin:50% 0%"></div>
      <div id="tl-fill" style="position:absolute;left:1419px;top:392px;width:4px;height:560px;background:var(--primary);transform-origin:50% 0%"></div>
      ${[["2008", "Jekyll"], ["2019", "the taxonomy"], ["2026", "this episode"]].map(([y, t], i) => `
      <div class="tl-n" style="position:absolute;left:1408px;top:${392 + i * 260}px;width:26px;height:26px;border-radius:9999px;background:${i === 2 ? "var(--primary)" : "var(--on-dark)"}"></div>
      <div class="tl-t" style="position:absolute;left:1466px;top:${384 + i * 260}px;width:340px">
        <div class="monob" style="font-size:40px;color:var(--on-dark)">${y}</div>
        <div class="mono" style="font-size:22px;color:var(--ash);margin-top:6px">${t}</div>
      </div>`).join("")}
      ${penSvg("p-now", underlineD(1466, 998, 250, 6), 4, "")}
    </div></div>`;

  const script = `${ENTER[seamIn]("#stage")}
${headerIn(0.10, false)}
      gsap.set(["#a1", "#a1b", "#q2", "#a2", "#a2b", ".tl-n", ".tl-t"], { autoAlpha: 0 });
      gsap.set("#tl-fill", { scaleY: 0 });
      gsap.set(["#hr1", "#tl-rule"], { scaleX: 0 });
      gsap.set("#tl-rule", { scaleY: 0, scaleX: 1 });

      // the first quotation is the SEAM CARRIER — full opacity, riding the cut in.
      tl.fromTo("#q1", { y: 18 }, { y: 0, duration: 0.52, ease: "power3.out" }, 0);
      tl.fromTo("#a1", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.42, ease: "power3.out" }, 1.90);
      tl.fromTo("#a1b", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.38, ease: "power3.out" }, 3.30);

      tl.to("#hr1", { scaleX: 1, duration: 0.56, ease: "power3.out" }, 4.30);
      tl.fromTo("#q2", { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.52, ease: "power3.out" }, 4.58);
      tl.fromTo("#a2", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.42, ease: "power3.out" }, 6.10);
      tl.fromTo("#a2b", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.38, ease: "power3.out" }, 7.40);

      // the dates arrive last and in order, so the eighteen years are something the
      // viewer counts rather than something the narration asserts.
      tl.to("#tl-rule", { scaleY: 1, duration: 0.90, ease: "power3.out" }, 8.60);
      tl.fromTo(".tl-n", { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1, duration: 0.28, ease: "back.out(2.2)", stagger: 0.90 }, 8.86);
      tl.fromTo(".tl-t", { autoAlpha: 0, x: 18 }, { autoAlpha: 1, x: 0, duration: 0.40, ease: "power3.out", stagger: 0.90 }, 9.00);

      // the tail: the date rule fills orange from 2008 down to now. The frozen-frame
      // test found 2.4s of nothing here — this is the frame's own content finishing the
      // sentence rather than a drift added to cover the gap.
      tl.to("#tl-fill", { scaleY: 1, duration: 2.00, ease: "power1.inOut" }, 11.10);
      // and the mark lands on the year the film is being made in. A 2px bar was too
      // thin for the frozen test to see, which means it was too thin to read.
${penDraw("p-now", 13.10, 0.52)}`;

  return { body, script };
}
