import { field, grainDrift, counter, counterRun, T, GRAD } from "../lib/frame.mjs";
import { LEN as SCHED } from "../schedule.mjs";
import { enterOf, exitOf } from "../lib/seams.mjs";
import { stud } from "../lib/lego.mjs";
export const LEN = SCHED[11];

// The arrival. Enters on the film's one inverse-zoom seam — the reserved
// vector, spent here and nowhere else — and it is the second and last place the
// brand gradient appears.
//
// Confetti is seeded, not random: Math.random() in a renderer means a different
// film on every render and a different frame on every seek.
let s = 20260820;
const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
const COLORS = ["#FF3B30", "#FF9500", "#FFCC00", "#34C759", "#00C7BE",
                "#0A84FF", "#5E5CE6", "#BF5AF2", "#FF2D95", T.lit, "#ffffff"];

// The figure sits at the optical centre and the burst originates from inside it.
const FIG_TOP = 300, FIG_SIZE = 300, ORIGIN_Y = FIG_TOP + FIG_SIZE * 0.52;

const CONF = Array.from({ length: 210 }, () => {
  const ang = rnd() * Math.PI * 2;
  const sp = 420 + rnd() * 980;
  return {
    c: COLORS[Math.floor(rnd() * COLORS.length)],
    w: 12 + Math.round(rnd() * 12),
    h: 16 + Math.round(rnd() * 20),
    dx: Math.cos(ang) * sp,
    dy: Math.sin(ang) * sp * 0.66 - 170,
    sway: (rnd() * 150 - 75) | 0,             // drift sideways as it falls
    fall: 780 + rnd() * 620,
    rot: (rnd() * 900 - 450) | 0,
    spin: (rnd() * 1100 - 550) | 0,
    burst: 0.62 + rnd() * 0.24,               // varied, so nothing lands together
    drop: 2.90 + rnd() * 1.45,
    lag: rnd() * 0.22,
    r: rnd() > 0.5 ? "50%" : "2px",
    brick: rnd() > 0.62,
  };
});

export const body = `${field("bloom", "five", LEN, "brick-fall")}
    <div id="stage" class="stage"><div class="inner">

      <div id="bloomglow" style="position:absolute;left:50%;top:${ORIGIN_Y}px;width:1500px;height:1500px;
           margin:-750px 0 0 -750px;opacity:0;pointer-events:none;
           background:radial-gradient(circle,rgba(20,184,166,0.20) 0%,rgba(8,145,178,0.07) 42%,transparent 68%)"></div>

      <div id="fig" style="position:absolute;left:0;right:0;top:${FIG_TOP}px;text-align:center">
        <span style="position:relative;display:inline-block;font-size:${FIG_SIZE}px;line-height:1.04;
              letter-spacing:-0.04em;font-weight:500;font-variant-numeric:tabular-nums;text-align:center">
          <span aria-hidden="true" style="visibility:hidden;white-space:pre">500</span>
          <span id="gA" style="position:absolute;left:0;right:0;top:0">${counter("n500", ["0", "180", "330", "430", "480", "500"], "grad")}</span>
          <span id="gB" style="position:absolute;left:0;right:0;top:0;opacity:0;
                background:linear-gradient(135deg,${T.lit} 0%,${T.cyan} 55%,${T.deepteal} 100%);
                -webkit-background-clip:text;background-clip:text;color:transparent">500</span>
        </span>
      </div>

      <div id="cap" style="position:absolute;left:0;right:0;top:${FIG_TOP + 366}px;text-align:center;
           font-size:46px;font-weight:500;letter-spacing:-0.022em;color:${T.ink}">people are using VectorDrop</div>
      <div id="sub" class="tag" style="position:absolute;left:0;right:0;top:${FIG_TOP + 446}px;text-align:center;font-size:16px">
        THANK YOU</div>

      <div id="pop" style="position:absolute;left:50%;top:${ORIGIN_Y}px;width:0;height:0">
        <div id="flash" style="position:absolute;left:-320px;top:-320px;width:640px;height:640px;border-radius:50%;
             opacity:0;background:radial-gradient(circle,rgba(255,255,255,0.85) 0%,rgba(45,208,191,0.35) 34%,transparent 66%)"></div>
        <div id="ring" style="position:absolute;left:-90px;top:-90px;width:180px;height:180px;border-radius:50%;
             border:4px solid ${T.lit};opacity:0"></div>
${Array.from({ length: 26 }, (_, k) => {
  const a = (k / 26) * 360;
  return `        <div id="ry${k}" style="position:absolute;left:0;top:-2px;width:132px;height:4px;border-radius:2px;
             background:linear-gradient(to right,rgba(255,255,255,0.95),transparent);opacity:0;
             transform:rotate(${a.toFixed(1)}deg);transform-origin:0 50%"></div>`;
}).join("\n")}
      </div>

      <div id="burst" style="position:absolute;left:50%;top:${ORIGIN_Y}px;width:0;height:0">
${CONF.map((c, i) => `        <span id="cf${i}" style="position:absolute;left:0;top:0;opacity:0;display:flex">${
          c.brick ? stud(c.c, Math.max(c.w, c.h)) :
          `<span style="display:block;width:${c.w}px;height:${c.h}px;background:${c.c};border-radius:${c.r}"></span>`}</span>`).join("\n")}
      </div>
    </div></div>`;

export const script = `${enterOf(11)}
${grainDrift(LEN)}
      tl.fromTo("#fig", { autoAlpha: 0, scale: 0.90 }, { autoAlpha: 1, scale: 1, duration: 0.62, ease: "back.out(1.4)" }, 0);
${counterRun("n500", 6, 0.16, 1.14)}
      tl.to("#bloomglow", { autoAlpha: 1, duration: 0.80, ease: "power2.out" }, 1.20);
      // the gradient shifts across the figure rather than sitting flat
      tl.to("#gB", { autoAlpha: 1, duration: 1.60, ease: "sine.inOut" }, 1.60);
      tl.to("#gB", { autoAlpha: 0, duration: 1.80, ease: "sine.inOut" }, 3.40);
      tl.to("#fig", { scale: 1.035, duration: 2.60, ease: "power2.out" }, 1.30);

      tl.fromTo("#cap", { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.54, ease: "power3.out" }, 1.26);
      tl.fromTo("#sub", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.46 }, 1.54);

      // the pop: a flash, an expanding ring and a ring of streaks, all on the
      // frame the number resolves
      tl.fromTo("#flash", { autoAlpha: 0, scale: 0.2 }, { autoAlpha: 1, scale: 1, duration: 0.16, ease: "power2.out", immediateRender: false }, 1.12);
      tl.to("#flash", { autoAlpha: 0, scale: 1.7, duration: 0.72, ease: "power2.out" }, 1.28);
      tl.fromTo("#ring", { autoAlpha: 0.9, scale: 0.15 }, { autoAlpha: 0, scale: 5.4, duration: 0.98, ease: "power2.out", immediateRender: false }, 1.14);
${Array.from({ length: 26 }, (_, k) => `      tl.fromTo("#ry${k}", { autoAlpha: 1, scaleX: 0.12 }, { autoAlpha: 0, scaleX: 1.5, duration: ${(0.44 + (k % 5) * 0.06).toFixed(2)}, ease: "power3.out", immediateRender: false }, ${(1.13 + (k % 7) * 0.012).toFixed(3)});`).join("\n")}

      // the confetti fires with it. Out fast, then a long soft
      // fall with sideways drift — the difference between confetti and dots.
${CONF.map((c, i) => `      tl.fromTo("#cf${i}", { autoAlpha: 1, x: 0, y: 0, rotation: 0, scale: 0.45, immediateRender: false },
        { autoAlpha: 1, x: ${c.dx.toFixed(0)}, y: ${c.dy.toFixed(0)}, rotation: ${c.rot}, scale: 1, duration: ${c.burst.toFixed(2)}, ease: "power3.out" }, ${(1.16 + c.lag).toFixed(3)});
      tl.to("#cf${i}", { x: ${(c.dx + c.sway).toFixed(0)}, y: ${(c.dy + c.fall).toFixed(0)}, rotation: ${c.rot + c.spin}, duration: ${c.drop.toFixed(2)}, ease: "sine.in" }, ${(1.16 + c.lag + c.burst).toFixed(3)});
      tl.to("#cf${i}", { autoAlpha: 0, duration: 1.10, ease: "sine.in" }, ${(1.16 + c.lag + c.burst + c.drop * 0.62).toFixed(3)});`).join("\n")}

${exitOf(11, LEN)}`;
