import { field, grainDrift, cursorSVG, cursorTo, cursorMove, cursorTap, T } from "../lib/frame.mjs";
import { editor, stamp, strokeDots, strokeRun } from "../lib/ui.mjs";
import { enterOf, exitOf } from "../lib/seams.mjs";
import { LEN as SCHED } from "../schedule.mjs";
export const LEN = SCHED[3];

// THE ARRIVAL — and the film's one value flip, near-black to white.
//
// This beat is the reason the piece exists, so it gets the accent seam (zback),
// the brightest ground, the longest running time, and the only actor. The
// cursor is that actor, and the rule it obeys is the one that makes or breaks a
// workspace film: EVERY MOVE IT MAKES CAUSES SOMETHING, with the cause landing
// ~0.2s before the effect. A cursor that wanders is a screensaver.
//
// The stroke is painted dot by dot under the pointer rather than revealed as a
// finished shape — you watch a person paint, which is the whole interface.

const EX = 210, EY = 96, EW = 1500, EH = 888;
const CANVAS_H = EH - 68 - 76;                    // 744 — the plate is square at this
const PLATE_X = EX + EW / 2 - CANVAS_H / 2;       // left edge of the black plate
const PLATE_Y = EY + 68;

// The mark sits at the plate's bottom-right, so that is where the brush goes.
// The stroke is sized to the MARK, not picked by eye: the stamp box is ~100px
// wide and ~24px tall at scale 1.25, sitting 22px in from the right edge and
// 18px up from the bottom. The stroke covers it with a little margin and stops
// short of the plate edge — a brush that spills onto the surround is a brush
// that was drawn rather than painted.
const MARK_R = PLATE_X + CANVAS_H - 22;          // the mark's right edge
const MX = MARK_R - 52;                           // its centre
const MY = PLATE_Y + CANVAS_H - 30;
const R = 19;
const DOTS = Array.from({ length: 13 }, (_, i) => [MX - 56 + i * 9, MY + Math.sin(i * 0.9) * 4]);

const BRUSH_AT = 1.62, BRUSH_SPAN = 0.86;
const REMOVE_AT = 3.32;          // the cursor taps Remove
const CLEAR_AT = 3.56;           // 0.24s later the mark goes — cause, then effect

export const body = `${field("paper", "p4")}
    <div id="stage" class="stage"><div class="inner">
${editor("ed", { x: EX, y: EY, w: EW, h: EH, dims: "1080 x 1079 &middot; 69%" }, `
            <img id="ed-img" src="assets/demo/planet.png" width="${CANVAS_H}" height="${CANVAS_H}"
                 style="display:block;width:${CANVAS_H}px;height:${CANVAS_H}px;object-fit:cover"/>
${stamp("ed-mark", { right: 22, bottom: 18, scale: 1.25 })}
            <div id="ed-sweep" data-layout-allow-overflow style="position:absolute;left:0;top:0;
                 width:200px;height:${CANVAS_H}px;opacity:0;
                 background:linear-gradient(90deg,transparent,rgba(139,132,255,0.42),rgba(255,255,255,0.30),rgba(139,132,255,0.42),transparent)"></div>
`)}
      <div id="ed-stroke" style="position:absolute;left:0;top:0;width:1920px;height:1080px;pointer-events:none">
${strokeDots("ed-dot", DOTS, R)}
      </div>

      <!-- the three claims. Each is a fact printed on the product's own page,
           set in mono because that is the register the audience trusts. -->
      <div style="position:absolute;left:${EX}px;top:${EY + EH + 30}px;display:flex;gap:12px">
        <span id="ed-c0" class="chip" style="opacity:0"><span class="mono" style="color:${T.accentT}">01</span>Runs on your device</span>
        <span id="ed-c1" class="chip" style="opacity:0"><span class="mono" style="color:${T.accentT}">02</span>Full original resolution</span>
        <span id="ed-c2" class="chip" style="opacity:0"><span class="mono" style="color:${T.accentT}">03</span>No sign-up</span>
      </div>

      <div id="cur" class="cursor">${cursorSVG}</div>
    </div></div>`;

export const script = `${enterOf(3)}
${grainDrift("p4", LEN)}

      // the editor is already up on the cut — it rides the seam in rather than
      // assembling itself, because the seam IS this beat's entrance.
      tl.fromTo("#ed", { y: 18 }, { y: 0, duration: 0.50, ease: "power3.out" }, 0);

      // 1 — the cursor enters from off-frame carrying intent, and goes straight
      //     to the mark. It never wanders and it never fades up.
${cursorTo([[-120, 700], [MX + 42, MY - 6, 1.05]], 0.46)}

      // 2 — it paints. The dots land under the pointer as it travels, so the
      //     stroke is being made rather than being revealed.
      // the two halves of the stroke are butt-jointed, so the second is handed
      // the pointer a frame after the first lets go of it — tweens that share a
      // property must never share an instant.
      tl.to("#cur", { x: ${MX - 58}, y: ${MY + 5}, duration: ${(BRUSH_SPAN / 2 - 0.03).toFixed(2)}, ease: "power1.inOut" }, ${BRUSH_AT.toFixed(2)});
      tl.to("#cur", { x: ${MX + 46}, y: ${MY + 2}, duration: ${(BRUSH_SPAN / 2).toFixed(2)}, ease: "power1.inOut" }, ${(BRUSH_AT + BRUSH_SPAN / 2).toFixed(2)});
${strokeRun("ed-dot", DOTS.length, BRUSH_AT, BRUSH_SPAN)}

      // 3 — the selection exists, so the primary action becomes available. The
      //     button lighting up is CAUSED by the stroke finishing.
      tl.to("#ed-remove", { backgroundColor: "${T.accent}", duration: 0.26, ease: "none" }, ${(BRUSH_AT + BRUSH_SPAN + 0.12).toFixed(2)});

      // 4 — the cursor crosses to Remove and taps it.
${cursorMove([[MX + 46, MY + 2], [1554, 152, 0.72]], (BRUSH_AT + BRUSH_SPAN + 0.20))}
${cursorTap(REMOVE_AT)}

      // 5 — the fill. The stroke and the mark leave together and the pixels
      //     under them are simply the image: nothing swaps, nothing cuts.
      tl.to("#ed-stroke", { autoAlpha: 0, duration: 0.34, ease: "power2.inOut" }, ${CLEAR_AT.toFixed(2)});
      tl.to("#ed-mark", { autoAlpha: 0, duration: 0.42, ease: "power2.inOut" }, ${CLEAR_AT.toFixed(2)});
      // one pass of the model working, sweeping the region it was given
      tl.set("#ed-sweep", { autoAlpha: 0 }, 0);
      // autoAlpha must be named in the DESTINATION too: a cold render worker
      // restores the authored hidden state, so a fromTo that only turns the
      // element on in its from-vars can encode as permanently invisible.
      tl.fromTo("#ed-sweep", { autoAlpha: 1, x: -200 },
        { autoAlpha: 1, x: ${CANVAS_H}, duration: 0.86, ease: "power1.inOut" }, ${CLEAR_AT.toFixed(2)});
      tl.to("#ed-sweep", { autoAlpha: 0, duration: 0.16 }, ${(CLEAR_AT + 0.88).toFixed(2)});

      // and the button holds a working state while it runs, so the control that
      // caused the change is visibly still responsible for it
      tl.to("#ed-remove", { autoAlpha: 0.55, duration: 0.30, ease: "power2.inOut" }, ${(CLEAR_AT + 0.04).toFixed(2)});
      tl.to("#ed-remove", { autoAlpha: 1, duration: 0.30, ease: "power2.inOut" }, ${(CLEAR_AT + 0.52).toFixed(2)});

      // 6 — the three claims, staged so the beat keeps delivering to its last
      //     frame instead of finishing early and sitting there.
      tl.fromTo("#ed-c0", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.44, ease: "power3.out" }, ${(CLEAR_AT + 0.62).toFixed(2)});
      tl.fromTo("#ed-c1", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.44, ease: "power3.out" }, ${(CLEAR_AT + 0.78).toFixed(2)});
      tl.fromTo("#ed-c2", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.44, ease: "power3.out" }, ${(CLEAR_AT + 0.94).toFixed(2)});

      // 7 — the cursor goes to Download and presses it. The film's last cause.
${cursorMove([[1554, 152], [318, 934, 0.78]], (CLEAR_AT + 0.90))}
${cursorTap(CLEAR_AT + 1.86)}
      tl.to("#ed-dl", { scale: 0.975, duration: 0.09, ease: "power2.in" }, ${(CLEAR_AT + 1.86).toFixed(2)});
      tl.to("#ed-dl", { scale: 1, duration: 0.22, ease: "back.out(3)" }, ${(CLEAR_AT + 1.95).toFixed(2)});
      tl.to("#cur", { autoAlpha: 0, duration: 0.26 }, ${(CLEAR_AT + 2.24).toFixed(2)});

${exitOf(3, LEN)}`;
