// 02 TITLE — the orange hero band.
//
// Replicate's section rhythm opens cream then goes to the hero, and the hero is the one
// place the atmospheric mesh is allowed. It is also the one place white type is legal:
// #fff on --primary measures 4.26:1, which clears AA-LARGE and nothing else, so every
// word on this frame is display size by necessity rather than by taste.
//
// The italic serif accent word is the series' title-card signature and there is exactly
// one of it in the film.
import { page, ENTER } from "../lib/frame.mjs";

export function build({ seamIn }) {
  const L = 132, TOP = 300, SZ = 116;
  const lines = [
    `Built once,`,
    `or built <span class="acc">again</span>`,
    `every time.`,
  ];

  const body = `${page("hero")}
    <div id="stage" class="stage"><div class="inner">
      <div id="t-slug" class="slug" style="position:absolute;left:${L}px;top:196px;color:rgba(255,255,255,.86)">Ship It · Episode 29</div>
      <div id="t-rule" style="position:absolute;left:${L}px;top:238px;width:150px;height:4px;background:#ffffff;border-radius:2px;transform-origin:0% 50%"></div>

      ${lines.map((t, i) => `
      <div class="t-line disp" style="position:absolute;left:${L}px;top:${TOP + i * (SZ + 10)}px;width:1560px;font-size:${SZ}px;letter-spacing:-3px;color:#ffffff">${t}</div>`).join("")}

      <div id="t-sub" class="mono" style="position:absolute;left:${L + 4}px;top:${TOP + 3 * (SZ + 10) + 44}px;font-size:29px;color:rgba(255,255,255,.92);letter-spacing:0.02em">Static generation, client rendering, and when the HTML gets its content</div>
      <div id="t-folio" class="mono" style="position:absolute;left:${L + 4}px;top:${TOP + 3 * (SZ + 10) + 108}px;font-size:22px;color:rgba(255,255,255,.86);line-height:1.6">jekyllrb.com&nbsp;&nbsp;·&nbsp;&nbsp;excalidraw.com&nbsp;&nbsp;·&nbsp;&nbsp;measured 2026-08-23</div>
    </div></div>`;

  const script = `${ENTER[seamIn]("#stage")}
      // WATERFALL ENTRY — the three lines arrive as a cascade, heaviest first, and the
      // accent word lands last on its own beat. Nothing on this frame fades: the band
      // is already there, and the type slides up out of it.
      gsap.set(["#t-sub", "#t-folio"], { autoAlpha: 0 });
      gsap.set("#t-rule", { scaleX: 0 });
      tl.fromTo("#t-slug", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.40, ease: "power3.out" }, 0.30);
      tl.to("#t-rule", { scaleX: 1, duration: 0.46, ease: "power3.out" }, 0.44);
      tl.fromTo(".t-line", { autoAlpha: 0, y: 68 }, { autoAlpha: 1, y: 0, duration: 0.62, ease: "power4.out", stagger: 0.16 }, 0.62);
      tl.fromTo(".acc", { scale: 0.84, y: 10 }, { scale: 1, y: 0, duration: 0.52, ease: "back.out(1.6)", transformOrigin: "0% 70%" }, 1.34);
      tl.fromTo("#t-sub", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.48, ease: "power3.out" }, 1.86);
      tl.fromTo("#t-folio", { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: 0.46, ease: "power3.out" }, 2.30);
      // one last move so the card is not standing still while the bed lifts under it
      tl.to("#t-rule", { scaleX: 2.13, duration: 0.70, ease: "power2.inOut" }, 3.30);`;

  return { body, script };
}
