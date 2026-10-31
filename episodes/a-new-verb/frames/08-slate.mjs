// EP27 · 08 SLATE — the turn. Navy, full bleed, three seconds. It arrives on the Z-BACK
// the previous frame launched: entering ABOVE 1.0 and settling down to it, so both halves
// share the sign of the scale velocity. Mirroring the sign reads as a bounce.
import { field, enterZBack, exitAcross } from "../lib/frame.mjs";

export function build({ len }) {
  const body = `${field("navy")}
    <div id="stage" class="stage"><div class="inner onnavy">
      <div id="f8-kick" class="ital" style="position:absolute;left:132px;top:344px;font-size:62px;color:var(--yellow)">there is now a third option</div>
      <div id="f8-q" class="mono" style="position:absolute;left:126px;top:434px;font-size:210px;font-weight:700;letter-spacing:-.01em;color:var(--sheet)">QUERY</div>
      <div id="f8-rule" style="position:absolute;left:132px;top:720px;width:1160px;height:6px;background:var(--yellow);transform-origin:0% 50%"></div>
      <div id="f8-meta" class="mono" style="position:absolute;left:132px;top:760px;font-size:30px;font-weight:700;letter-spacing:.10em;color:var(--yellow)">SAFE · IDEMPOTENT · CACHEABLE · WITH A BODY</div>
    </div></div>`;

  const script = `${enterZBack("#stage")}
      // the two carriers ride the cut at full opacity and only settle
      tl.fromTo("#f8-q", { y: 20 }, { y: 0, duration: 0.56, ease: "power3.out" }, 0);
      tl.fromTo("#f8-kick", { autoAlpha: 0, x: -22 }, { autoAlpha: 1, x: 0, duration: 0.44, ease: "power3.out" }, 0.22);
      tl.fromTo("#f8-rule", { scaleX: 0 }, { scaleX: 1, duration: 0.54, ease: "power3.out" }, 0.44);
      tl.fromTo("#f8-meta", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.38, ease: "power3.out" }, 0.72);
${exitAcross("#stage", len - 0.34)}`;

  return { body, script };
}
