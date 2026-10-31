// 19 END — the black footer. Three instructions, the sources, and the next episode.
//
// Replicate's rhythm closes on --deep, and the footer is the one place radius 0 is
// correct. The sources column is not decoration: every claim the film made is traceable
// from these five lines, which is the whole point of the sourcing policy.
//
// The next card names EP 30 · SUBAGENTS. That promise has now been made on camera four
// times running; it is recorded in BRIEF.md and it is the director's call.
import { page, ENTER, stagger, penSvg, penDraw, boxD } from "../lib/frame.mjs";

export function build({ seamIn }) {
  const X = 132;
  const TAKE = [
    ["Build what everyone shares.", "If the bytes are the same for every visitor, produce them once and cache them anywhere."],
    ["Render on the device only what only the device knows.", "The drawing, the cart, the inbox. Nothing else has earned a bundle."],
    ["Measure the first pixel, not the payload.", "A page that sends less HTML can still take five seconds to show a word."],
  ];
  const SRC = [
    "Tom Preston-Werner · “Blogging Like a Hacker” · 17 Nov 2008",
    "web.dev · “Rendering on the Web” · Osmani &amp; Miller · 2019, upd. 2026",
    "create-react-app · cra-template/template/public/index.html · MIT",
    "jekyllrb.com and excalidraw.com · headers, bytes and traces, 2026-08-23",
    "Chrome DevTools · Slow 4G, 4× CPU, cold cache · traces archived",
  ];

  const body = `${page("deep")}
    <div id="stage" class="stage"><div class="inner">
      <div id="z-slug" class="slug" style="position:absolute;left:${X}px;top:118px;color:#8d8d8d">Ship It · Episode 29</div>
      <div id="z-rule" style="position:absolute;left:${X}px;top:160px;width:150px;height:4px;background:var(--on-dark);border-radius:2px;transform-origin:0% 50%"></div>

      ${TAKE.map((t, i) => `
      <div class="z-t" style="position:absolute;left:${X}px;top:${228 + i * 176}px;width:1080px">
        <div class="disp" style="font-size:46px;line-height:1.06;letter-spacing:-1.1px;color:var(--on-dark)">${t[0]}</div>
        <div class="body" style="margin-top:16px;font-size:26px;color:var(--stone);width:1000px">${t[1]}</div>
      </div>`).join("")}

      <div id="z-sk" class="slug" style="position:absolute;left:1300px;top:232px;color:#8d8d8d">Sources</div>
      <div id="z-sr" class="hairD" style="left:1300px;top:274px;width:508px;transform-origin:0% 50%"></div>
      ${SRC.map((s, i) => `
      <div class="z-s mono" style="position:absolute;left:1300px;top:${304 + i * 74}px;width:508px;font-size:19px;color:var(--ash);line-height:1.42">${s}</div>`).join("")}

      <div id="z-hr" class="hairD" style="left:${X}px;top:856px;width:1676px;transform-origin:0% 50%"></div>
      <div id="z-n" class="mono" style="position:absolute;left:${X}px;top:900px;font-size:23px;color:#8d8d8d;letter-spacing:0.16em;text-transform:uppercase">Next</div>
      <div id="z-nx" class="disp" style="position:absolute;left:${X}px;top:936px;font-size:66px;letter-spacing:-1.6px;color:var(--on-dark)">EP 30 · Subagents</div>
      <div id="z-bd" class="mono" style="position:absolute;left:1300px;top:944px;width:508px;font-size:19px;color:var(--ash);line-height:1.42">music: “Lost in Memory” by gurdonark<br>ccMixter · CC BY 3.0</div>

      ${penSvg("p-next", boxD(X - 20, 924, 780, 96, 11), 4.5, "")}
    </div></div>`;

  const script = `${ENTER[seamIn]("#stage")}
      gsap.set([".z-t", "#z-sk", ".z-s", "#z-n", "#z-nx", "#z-bd"], { autoAlpha: 0 });
      gsap.set(["#z-rule", "#z-sr", "#z-hr"], { scaleX: 0 });
      tl.fromTo("#z-slug", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.36, ease: "power3.out" }, 0.20);
      tl.to("#z-rule", { scaleX: 1, duration: 0.44, ease: "power3.out" }, 0.34);

      // the three instructions land on the three clauses of the narration
${stagger(".z-t", 0.62, { y: 24, dur: 0.48, step: 2.10 })}

      tl.fromTo("#z-sk", { autoAlpha: 0, x: 16 }, { autoAlpha: 1, x: 0, duration: 0.34, ease: "power3.out" }, 4.60);
      tl.to("#z-sr", { scaleX: 1, duration: 0.46, ease: "power3.out" }, 4.74);
${stagger(".z-s", 4.96, { y: 12, dur: 0.34, step: 0.26 })}

      tl.to("#z-hr", { scaleX: 1, duration: 0.56, ease: "power3.out" }, 6.90);
      tl.fromTo("#z-n", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.32, ease: "power3.out" }, 7.14);
      tl.fromTo("#z-nx", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.48, ease: "power3.out" }, 7.34);
      tl.fromTo("#z-bd", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.34, ease: "power3.out" }, 8.10);
${penDraw("p-next", 8.60, 0.62)}`;

  return { body, script };
}
