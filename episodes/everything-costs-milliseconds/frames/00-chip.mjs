import { at } from "../schedule.mjs";
// THE CONTINUITY CHIP — nav 8842, one real navigation, followed across all fifteen
// stations. It climbs while the film names the costs and falls while it names the fixes.
// States are HELD, never interpolated. Only the needle and the state word move; the id
// never does, because the whole point is that it is the same navigation.
const CX = 1648, CY = 176, R = 46;
const deg = (v) => -120 + (v / 6) * 240;

// every state is something the film has just said, on the beat it says it.
export const KEYS = [
  { t: at("dist"),    v: 4.20, s: "p75 baseline" },
  { t: at("path"),    v: 4.20, s: "4 chained requests" },
  { t: at("bundle"),  v: 5.60, s: "780 KB parsed", hot: true },
  { t: at("render"),  v: 3.90, s: "streamed" },
  { t: at("thread"),  v: 2.80, s: "yielded" },
  { t: at("cache"),   v: 1.60, s: "cached" },
  { t: at("field"),   v: 1.42, s: "held at budget" },
];

export const body = `
    <div id="chip" style="position:absolute;left:${CX-R-118}px;top:${CY-R-30}px;width:342px;height:${R*2+60}px;
      background:rgba(11,16,15,.82);border:1px solid rgba(176,228,204,.16);border-radius:12px;
      box-shadow:0 14px 34px rgba(0,0,0,.55)">
      <div class="mono" style="position:absolute;left:22px;top:22px;font-size:20px;font-weight:700;color:var(--mint)">nav 8842</div>
      <div style="position:absolute;left:22px;top:50px;width:150px;height:22px">
        ${KEYS.map((k, i) => `<div class="cstate mono" id="cs${i}" style="position:absolute;left:0;top:0;width:170px;
          font-size:15px;line-height:1.4;color:${k.hot ? "var(--brass)" : "var(--emerald-lit)"};white-space:nowrap">${k.s}</div>`).join("")}
      </div>
      <div class="mono" style="position:absolute;left:22px;top:82px;font-size:13px;letter-spacing:.14em;opacity:.4;color:var(--mint)">TIME TO INTERACTIVE</div>

      <div style="position:absolute;left:222px;top:${30-R+16}px;width:${R*2}px;height:${R*2}px;border-radius:50%;
        background-image:url('assets/plates/brass.jpg');background-size:cover;
        box-shadow:inset 1px 1px 3px rgba(255,236,196,.5),inset -2px -2px 4px rgba(0,0,0,.6),0 5px 12px rgba(0,0,0,.5)"></div>
      <div style="position:absolute;left:${222+6}px;top:${30-R+22}px;width:${R*2-12}px;height:${R*2-12}px;border-radius:50%;
        background:radial-gradient(120% 120% at 32% 22%, #2E6551 0%, #16302A 52%, #091413 100%)"></div>
      <div id="c-needle" style="position:absolute;left:${222+R-2}px;top:${30-R+28}px;width:4px;height:${R-12}px;
        transform-origin:50% 100%;border-radius:2px;background:var(--mint)"></div>
      <div id="c-needlehot" style="position:absolute;left:${222+R-2}px;top:${30-R+28}px;width:4px;height:${R-12}px;
        transform-origin:50% 100%;border-radius:2px;background:var(--brass)"></div>
    </div>`;

export const script = `
      // The chip enters once, with the first station, and is never interrupted again.
      gsap.set("#chip", { autoAlpha: 0 });
      tl.to("#chip", { autoAlpha: 1, duration: 0.60, ease: "power3.out" }, ${(at("dist") - 0.4).toFixed(2)});
      var K = ${JSON.stringify(KEYS)};
      // stack one span per state and toggle with zero-duration sets: a tl.call is not
      // reliably seekable, and a tween on text content is a no-op.
      for (var i = 0; i < K.length; i++) gsap.set("#cs" + i, { autoAlpha: 0 });
      gsap.set("#c-needle", { rotation: ${deg(0).toFixed(2)} });
      gsap.set("#c-needlehot", { rotation: ${deg(0).toFixed(2)}, autoAlpha: 0 });
      for (var j = 0; j < K.length; j++) {
        (function (k, idx) {
          tl.set("#cs" + idx, { autoAlpha: 1 }, k.t);
          if (idx > 0) tl.set("#cs" + (idx - 1), { autoAlpha: 0 }, k.t);
          // the needle swings with the same law as every other instrument in the film.
          tl.to("#c-needle",    { rotation: -120 + (k.v / 6) * 240, duration: 0.78, ease: "power3.out" }, k.t);
          tl.to("#c-needlehot", { rotation: -120 + (k.v / 6) * 240, duration: 0.78, ease: "power3.out" }, k.t);
          // brass only while the value is over budget — the same accent rule as the rest.
          tl.set("#c-needle",    { autoAlpha: k.hot ? 0 : 1 }, k.t);
          tl.set("#c-needlehot", { autoAlpha: k.hot ? 1 : 0 }, k.t);
        })(K[j], j);
      }`;
