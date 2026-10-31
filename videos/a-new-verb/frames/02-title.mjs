// EP27 · 02 TITLE — full-bleed yellow. The one frame in the film with no annotation on
// it: the pen has not spoken yet, which is what makes its first stroke in 03 land.
import { field, enterLift, exitLift, tilt } from "../lib/frame.mjs";

export function build({ len }) {
  const body = `${field("yellow")}
    <div id="stage" class="stage"><div class="inner">
      <div id="f2-kick" class="ital" style="position:absolute;left:132px;top:164px;font-size:58px;color:var(--ink)">sixteen years later,</div>
      <div id="f2-l1" class="hdr" style="position:absolute;left:124px;top:272px;font-size:224px">A NEW</div>
      <div id="f2-l2" class="hdr" style="position:absolute;left:124px;top:478px;font-size:224px">VERB</div>

      <!-- the method itself is a TOKEN, so it is set in mono and never in the headline face -->
      <div id="f2-stampwrap" style="position:absolute;left:1090px;top:330px;width:640px;height:230px">
        <div id="f2-stamp" style="position:absolute;inset:0;border:4px solid var(--ink);display:flex;align-items:center;justify-content:center">
          <span class="mono" style="font-size:118px;font-weight:700;letter-spacing:.02em">QUERY</span>
        </div>
      </div>

      <div id="f2-rule" class="rule2" style="left:130px;top:786px;width:820px;height:5px;transform-origin:0% 50%"></div>
      <div id="f2-meta" class="mono" style="position:absolute;left:130px;top:822px;font-size:29px;font-weight:700;letter-spacing:.10em">RFC 10008 · STANDARDS TRACK · JUNE 2026</div>
      <div id="f2-auth" class="deck" style="position:absolute;left:130px;top:874px;font-size:27px;color:#5A5245">Reschke · Snell · Bishop — greenbytes, Cloudflare, Akamai</div>
    </div></div>`;

  const script = `${enterLift("#stage")}
      // the two title lines ride the cut at full opacity and only settle; the kicker,
      // the stamp and the metadata are the staged half.
      tl.fromTo("#f2-l1", { y: 22 }, { y: 0, duration: 0.54, ease: "power3.out" }, 0);
      tl.fromTo("#f2-l2", { y: 34 }, { y: 0, duration: 0.60, ease: "power3.out" }, 0.06);
      tl.fromTo("#f2-kick", { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: 0.46, ease: "power3.out" }, 0.34);
      // the stamp is DRAWN, so it steps: it lands the way a rubber stamp lands.
      gsap.set("#f2-stampwrap", { rotation: -13, scale: 1.5, autoAlpha: 0 });
      tl.fromTo("#f2-stampwrap", { rotation: -13, scale: 1.5, autoAlpha: 0 },
                { rotation: ${tilt(5)}, scale: 1, autoAlpha: 1, duration: 0.36, ease: "steps(5)" }, 0.92);
      tl.fromTo("#f2-rule", { scaleX: 0 }, { scaleX: 1, duration: 0.52, ease: "power3.out" }, 1.24);
      tl.fromTo("#f2-meta", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.40, ease: "power3.out" }, 1.44);
      tl.fromTo("#f2-auth", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.40, ease: "power3.out" }, 1.68);
      // one late move so the card is not finished before the cut: the stamp settles square
      tl.to("#f2-stampwrap", { rotation: 0, duration: 0.70, ease: "power2.inOut" }, 3.10);
${exitLift("#stage", len - 0.46)}`;

  return { body, script };
}
