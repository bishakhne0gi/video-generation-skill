import { field, grainDrift, typeLine, typeRun, typeEnd, T } from "../lib/frame.mjs";
import { geminiWin, composer, I } from "../lib/ui.mjs";
import { exitOf } from "../lib/seams.mjs";
import { LEN as SCHED } from "../schedule.mjs";
export const LEN = SCHED[0];   // never restate a duration the schedule owns

// THE COLD OPEN — the caret camera.
//
// The frame starts pushed inside the composer's first glyph and falls back as
// the sentence types, so the sentence and the frame resolve on the same beat.
// It is not a drift: the camera is following the caret, and the caret is going
// somewhere. That is the difference between a move and a wobble.
//
// Two things this beat has to get right, and both were wrong on the first pass:
//   · it must never open on EMPTY. At 14x on an unwritten line the first half
//     second was a dark slab with one edge in it, which reads as a mistake. The
//     push is 7x and the typing starts at 0.12s, so there is a letterform on
//     screen from the first frame.
//   · the window must not be a void. A chat with nothing in it yet is honest,
//     so the empty area carries a real empty state that the send then clears.

const PROMPT = "a planet that is also an eye, gold on black";
const TYPE_AT = 0.12, CPS = 26;
const TYPED = typeEnd(PROMPT, TYPE_AT, CPS);   // ~1.77s

// The composer sits low in the window, the way a real one does.
const WX = 300, WY = 176, WW = 1320, WH = 728;
const CY = 470;                                   // composer top, inside the window body
const CARET_X = WX + 52 + 22;                     // where the first glyph starts
const CARET_Y = WY + 58 + CY + 37;                // its vertical centre

export const body = `${field("dark", "p1")}
    <div id="stage" class="stage"><div id="cam" class="inner">
${geminiWin("g1", { x: WX, y: WY, w: WW, h: WH }, `
          <div style="position:absolute;left:52px;top:${CY - 60}px">
            <div class="tag tag-on">PROMPT</div>
          </div>

          <!-- the empty state. It is what the surface actually looks like before
               you ask it anything, and it gives the void something to be. -->
          <div id="g1-empty" style="position:absolute;left:0;top:96px;width:100%;text-align:center">
            <div style="color:${T.lit};opacity:0.30;transform:scale(3.4);margin-bottom:64px">${I.star}</div>
            <div style="font-size:26px;color:${T.mute};letter-spacing:-0.008em">Describe the image you want</div>
          </div>

          <!-- ...and what replaces it. The tail of this beat used to be 2.9s of
               a frozen frame; the audit called it and it was right. A request
               that has been sent is a thing in progress, so the beat now SHOWS
               that progress and never stops moving until the cut. -->
          <div id="g1-gen" style="position:absolute;left:0;top:150px;width:100%;text-align:center;opacity:0">
            <div style="font-size:24px;color:${T.ash};letter-spacing:-0.008em;margin-bottom:34px">Generating</div>
            <div style="position:relative;width:620px;height:6px;margin:0 auto;background:${T.wire};overflow:hidden">
              <div id="g1-bar" style="position:absolute;left:0;top:0;height:6px;width:620px;
                   background:${T.lit};transform-origin:left center"></div>
              <div id="g1-shim" style="position:absolute;left:0;top:0;height:6px;width:180px;opacity:0;
                   background:linear-gradient(90deg,transparent,rgba(255,255,255,0.85),transparent)"></div>
            </div>
          </div>

${composer("g1-comp", { x: 52, y: CY, w: 1216 }, typeLine("p1-line", PROMPT, 27, { color: T.snow }))}

          <div id="g1-hint" style="position:absolute;left:52px;top:${CY + 104}px;display:flex;gap:10px">
            <span class="chip chip-d" style="height:30px;font-size:12px">Photoreal</span>
            <span class="chip chip-d" style="height:30px;font-size:12px">1:1</span>
            <span class="chip chip-d" style="height:30px;font-size:12px">Best quality</span>
          </div>
        `)}
    </div></div>`;

export const script = `
${grainDrift("p1", LEN)}

      // the caret camera. Anchored on the composer's first glyph so that point
      // stays put while everything else falls away from it — a push, not a pan.
      tl.fromTo("#cam", { scale: 7, transformOrigin: "${CARET_X}px ${CARET_Y}px" },
        { scale: 1, duration: 2.45, ease: "power3.out" }, 0);

      // the furniture only resolves once the camera is most of the way back
      tl.fromTo("#g1", { autoAlpha: 0.6 }, { autoAlpha: 1, duration: 0.95, ease: "none" }, 1.35);
      tl.fromTo("#g1-empty", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.60, ease: "none" }, 1.05);

${typeRun("p1-line", PROMPT, 27, TYPE_AT, CPS)}

      // the chips arrive while the line is still typing, so the beat keeps
      // delivering rather than dumping everything at frame zero
      tl.fromTo("#g1-hint", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.50, ease: "power3.out" }, 2.08);

      // the send. Cause, then effect six frames later — the button answers the key.
      tl.fromTo("#g1-comp", { borderColor: "${T.wire}" }, { borderColor: "${T.accent}", duration: 0.22, ease: "none" }, ${(TYPED + 0.62).toFixed(2)});
      tl.to("#g1-comp-send", { scale: 0.86, duration: 0.07, ease: "power2.in" }, ${(TYPED + 0.70).toFixed(2)});
      tl.to("#g1-comp-send", { scale: 1, duration: 0.20, ease: "back.out(3)" }, ${(TYPED + 0.78).toFixed(2)});

      // ...and the surface commits: the empty state clears, the line dims and
      // lifts, the chips go. The window is now waiting for an answer.
      tl.to("#g1-empty", { autoAlpha: 0, y: -24, duration: 0.42, ease: "power2.in" }, ${(TYPED + 0.86).toFixed(2)});
      tl.to("#p1-line", { autoAlpha: 0.45, y: -10, duration: 0.34, ease: "power2.inOut" }, ${(TYPED + 0.96).toFixed(2)});
      tl.to("#g1-hint", { autoAlpha: 0, duration: 0.30, ease: "power2.in" }, ${(TYPED + 0.96).toFixed(2)});

      // the request is now in flight, and the bar keeps filling right up to the
      // cut — the beat hands over mid-motion instead of sitting still waiting.
      tl.fromTo("#g1-gen", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.40, ease: "power3.out" }, ${(TYPED + 1.10).toFixed(2)});
      tl.fromTo("#g1-bar", { scaleX: 0 }, { scaleX: 0.82, duration: ${(LEN - TYPED - 1.10).toFixed(2)}, ease: "power1.out" }, ${(TYPED + 1.10).toFixed(2)});
      tl.fromTo("#g1-shim", { autoAlpha: 1, x: -180 },
        { autoAlpha: 1, x: 620, duration: 1.05, ease: "power1.inOut" }, ${(TYPED + 1.16).toFixed(2)});

${exitOf(0, LEN)}`;
