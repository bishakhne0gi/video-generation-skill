// EP27 · 14 END — full-bleed yellow, and the only actionable thing in the film: advertise
// Accept-Query. §3 exists precisely so a resource can say "you may QUERY me", which is the
// one move a viewer can make on Monday morning.
import { field, enterLift, tilt } from "../lib/frame.mjs";

const TAKE = [
  ["A read with a body now has a verb.", "GET could never carry one. POST could, and lied about what it was."],
  ["The word is the contract.", "Safe, idempotent, cacheable — declared in the request line, where the path can see it."],
  ["The cache key is the body.", "Same URI, different content, different entry. That is the price of the feature."],
];

export function build({ len }) {
  const body = `${field("yellow")}
    <div id="stage" class="stage"><div class="inner">
      <div id="f14-kick" class="ital" style="position:absolute;left:132px;top:88px;font-size:52px;color:var(--ink)">and so,</div>
      <div id="f14-h" class="hdr" style="position:absolute;left:124px;top:158px;font-size:150px">A READ THAT<br>SAYS SO.</div>

      <div id="f14-hr" class="rule2" style="left:130px;top:452px;width:1000px;height:6px;transform-origin:0% 50%"></div>

      ${TAKE.map(([t, d], i) => `
      <div id="f14-t${i}" style="position:absolute;left:130px;top:${492 + i * 132}px;width:1000px">
        <div class="deck" style="font-size:38px;font-weight:700;color:var(--ink)">${t}</div>
        <div class="deck" style="font-size:26px;color:#4A4335;margin-top:6px">${d}</div>
      </div>
      <div id="f14-u${i}" class="rule2" style="left:130px;top:${492 + i * 132 - 12}px;width:1000px;height:3px;transform-origin:0% 50%"></div>`).join("")}

      <!-- the one move a viewer can make on Monday -->
      <div id="f14-act" style="position:absolute;left:1196px;top:${492}px;width:624px;height:214px">
        <div class="card" style="position:absolute;inset:0;background:var(--ink);transform:rotate(${tilt(120)}deg)"></div>
        <div style="position:absolute;inset:0;transform:rotate(${tilt(120)}deg)">
          <div class="tag" style="position:absolute;left:28px;top:24px;font-size:17px;color:#B9B2A2">START HERE · RFC 10008 §3</div>
          <div class="mono" style="position:absolute;left:28px;top:66px;font-size:27px;font-weight:700;color:var(--yellow);white-space:nowrap">Accept-Query:</div>
          <div class="mono" style="position:absolute;left:28px;top:104px;font-size:25px;color:#F4F1EA;white-space:nowrap">&nbsp;&nbsp;application/json</div>
          <div style="position:absolute;left:28px;top:150px;width:568px;font-size:23px;color:#B9B2A2">Advertise it on the resource. That is how a client finds out.</div>
        </div>
      </div>

      <div id="f14-next" style="position:absolute;left:1196px;top:762px;width:624px">
        <div class="rule2" style="position:relative;width:624px;height:4px"></div>
        <div class="tag" style="position:absolute;left:0;top:22px;font-size:19px">NEXT · EPISODE 28</div>
        <div class="hdr" style="position:absolute;left:0;top:54px;font-size:104px;white-space:nowrap">SUBAGENTS</div>
      </div>

      <div id="f14-mark" class="mono" style="position:absolute;left:130px;top:902px;font-size:23px;font-weight:700;letter-spacing:.16em;color:#4A4335">SHIP IT · EPISODE 27 · A NEW VERB</div>
    </div></div>`;

  let s = `${enterLift("#stage")}
      // the two carriers ride the cut at full opacity and only settle
      tl.fromTo("#f14-h", { y: 22 }, { y: 0, duration: 0.56, ease: "power3.out" }, 0);
      tl.fromTo("#f14-kick", { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: 0.42, ease: "power3.out" }, 0.26);
`;
  TAKE.forEach((_, i) => {
    const t = 1.10 + i * 1.50;
    s += `      gsap.set("#f14-t${i}", { autoAlpha: 0 });\n`;
    s += `      tl.fromTo("#f14-t${i}", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.40, ease: "power3.out" }, ${t.toFixed(2)});\n`;
    s += `      tl.fromTo("#f14-u${i}", { scaleX: 0 }, { scaleX: 1, duration: 0.90, ease: "power3.out" }, ${(t + 0.10).toFixed(2)});\n`;
  });
  s += `      gsap.set("#f14-act", { autoAlpha: 0 });
      tl.fromTo("#f14-act", { autoAlpha: 0, scale: 0.90, rotation: -4 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.34, ease: "steps(5)" }, 6.10);
      gsap.set("#f14-next", { autoAlpha: 0 });
      tl.fromTo("#f14-next", { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.42, ease: "power3.out" }, 7.40);
      gsap.set("#f14-mark", { autoAlpha: 0 });
      tl.fromTo("#f14-mark", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.40, ease: "power2.out" }, 8.10);
      // the film does not simply stop: the last move is the takeaway block settling square
      gsap.set("#f14-hr", { scaleX: 0 });
      tl.fromTo("#f14-hr", { scaleX: 0 }, { scaleX: 1, duration: 1.30, ease: "power3.out" }, 8.60);`;

  return { body, script: s };
}
