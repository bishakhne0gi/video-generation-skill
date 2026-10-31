// The act slate, authored once so the three of them cannot drift apart.
//
// Replicate's rhythm puts a full-bleed dark band between cream sections; these are that
// band, held for 2.6s with no narration over them. They are the only frames in the film
// with nothing to read but their own number, which is what makes them punctuation
// rather than content. The bed lifts under them because there is no voice to duck.
import { page, ENTER } from "../lib/frame.mjs";

export function slate(n, name, sub, seamIn) {
  const L = 132;
  const body = `${page("dark")}
    <div id="stage" class="stage"><div class="inner">
      <div id="sl-n" class="disp" style="position:absolute;left:${L}px;top:280px;font-size:270px;letter-spacing:-9px;color:var(--on-dark);line-height:1.0">${n}</div>
      <div id="sl-rule" style="position:absolute;left:${L + 6}px;top:604px;width:1200px;height:4px;background:var(--on-dark);border-radius:2px;transform-origin:0% 50%"></div>
      <div id="sl-t" class="disp" style="position:absolute;left:${L}px;top:646px;font-size:82px;letter-spacing:-1.8px;color:var(--on-dark)">${name}</div>
      <div id="sl-s" class="mono" style="position:absolute;left:${L + 6}px;top:768px;font-size:27px;color:var(--stone);letter-spacing:0.02em">${sub}</div>
    </div></div>`;

  const script = `${ENTER[seamIn]("#stage")}
      gsap.set(["#sl-t", "#sl-s"], { autoAlpha: 0 });
      gsap.set("#sl-rule", { scaleX: 0 });
      // the number is the SEAM CARRIER: full opacity from frame zero, riding the lift in.
      tl.fromTo("#sl-n", { y: 26 }, { y: 0, duration: 0.56, ease: "power4.out" }, 0);
      tl.to("#sl-rule", { scaleX: 1, duration: 0.62, ease: "power4.out" }, 0.34);
      tl.fromTo("#sl-t", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.48, ease: "power3.out" }, 0.52);
      tl.fromTo("#sl-s", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.44, ease: "power3.out" }, 0.84);`;

  return { body, script };
}
