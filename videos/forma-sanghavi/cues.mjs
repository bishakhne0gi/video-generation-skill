// Every cue is attached to something that moves on screen. Nothing sounds a
// soft dissolve — a whoosh over a fade says "something moved" while the picture
// says "time passed", which is the classic amateur note. Levels sit at
// 0.16-0.42 so nothing competes with the voice.
import { START, LEN } from "./schedule.mjs";
import { SEAMS } from "./lib/seams.mjs";

export const GAIN = {
  tick: 0.20, click: 0.28, latch: 0.24, blip: 0.22, notify: 0.28,
  success: 0.40, whoosh: 0.28, swipe: 0.24, thunk: 0.30, sub: 0.32, riser: 0.28,
};

// Each seam kind gets its own sound, so an act break is audibly different from
// an ordinary cut and the one arrival is audibly different from both.
const SEAM_CUE = { across: "swipe", lift: "thunk", zin: "whoosh", zback: "sub", up: "swipe" };

const C = [];
const cue = (name, at, gain) => C.push({ name, at: +at.toFixed(3), gain: gain ?? GAIN[name] ?? 0.24 });
const inBeat = (i, t, name, gain) => cue(name, START[i] + t, gain);

// ---- the seams ------------------------------------------------------------
SEAMS.forEach((s) => {
  const boundary = START[s.i] + LEN[s.i];
  cue(SEAM_CUE[s.kind], boundary - 0.12);
});

// ---- 01 open: the outline being walked, then the count landing -------------
// The featherline draw is one continuous gesture, so it gets ONE tone rather
// than 30 ticks — a rattle would make a curve sound like a machine gun.
inBeat(0, 0.55, "sub", 0.20);
[1.35, 2.10, 2.80, 3.35] .forEach((t) => inBeat(0, t, "tick", 0.16));
inBeat(0, 3.90, "latch", 0.26);

// ---- 02 title: no VO, so the bed is open and the frame gets two marks -----
inBeat(1, 0.06, "latch", 0.30);
inBeat(1, 0.70, "swipe", 0.18);

// ---- 03 ask: the cursor is the author, so the cursor is what sounds -------
inBeat(2, 2.36, "click");
inBeat(2, 2.48, "latch", 0.20);
// the type-on: every third character, or it reads as a printer
for (let k = 0; k < 33; k += 3) inBeat(2, 2.62 + k / 24, "tick", 0.13);
[3.05, 3.62, 4.28, 5.15].forEach((t) => inBeat(2, t, "blip", 0.26));

// ---- 04 tie: five identical rows, then the rule that names them -----------
[0.90, 1.10, 1.30, 1.50, 1.70].forEach((t) => inBeat(3, t, "tick", 0.16));
inBeat(3, 3.35, "swipe", 0.22);
inBeat(3, 4.20, "latch", 0.26);

// ---- 05 spec: three numbers typed, three rules answering ------------------
[1.05, 2.45, 3.85].forEach((t) => { inBeat(4, t, "click", 0.24); inBeat(4, t + 0.62, "blip", 0.22); });

// ---- 06 rank: the rows separating, then the gap resolving -----------------
[1.55, 1.81, 2.07, 2.33, 2.59].forEach((t) => inBeat(5, t, "tick", 0.18));
inBeat(5, 3.30, "notify", 0.26);

// ---- 07 base: the answer. Two counters resolve, so two arrivals ----------
inBeat(6, 1.20, "blip", 0.24);
inBeat(6, 2.50, "blip", 0.24);
inBeat(6, 3.60, "success", 0.34);

// ---- 08 plan: one tap per plan line being written ------------------------
[1.00, 2.60, 4.05, 5.35, 6.60].forEach((t) => inBeat(7, t - 0.20, "tick", 0.20));

// ---- 09 sheet: the spec cells, then the triangle count ------------------
for (let k = 0; k < 8; k += 2) inBeat(8, 0.44 + k * 0.10, "tick", 0.14);
inBeat(8, 2.45, "sub", 0.22);
inBeat(8, 3.95, "latch", 0.24);

// ---- 10 stl: the drop is the loudest thing in the act -------------------
inBeat(9, 2.40, "click");
inBeat(9, 2.60, "thunk", 0.30);
for (let k = 0; k < 8; k++) inBeat(9, 3.00 + k * 0.17, "tick", 0.15);
inBeat(9, 4.55, "sub", 0.20);

// ---- 11 found: the nine digits, then the row. The film's proof ----------
for (let k = 0; k < 9; k++) inBeat(10, 3.30 + k * 0.085, "tick", 0.17);
inBeat(10, 4.55, "success", 0.38);

// ---- 12 sole: the curve walked, then the inset ---------------------------
inBeat(11, 0.90, "sub", 0.22);
inBeat(11, 3.15, "latch", 0.26);
inBeat(11, 4.05, "blip", 0.28);

// ---- 13 hit: detection, then rank one. The most earned cue in the film --
inBeat(12, 1.35, "click", 0.24);
inBeat(12, 1.82, "blip", 0.28);
inBeat(12, 3.70, "sub", 0.24);
inBeat(12, 5.20, "success", 0.42);
inBeat(12, 5.30, "notify", 0.22);

// ---- 14 why: the arrival. One thunk on the landing, then the stations ---
inBeat(13, 0.04, "thunk", 0.34);
for (let k = 0; k < 40; k += 5) inBeat(13, 1.55 + (k * 3.10) / 40, "tick", 0.13);

// ---- 15 rest: the grid filling ------------------------------------------
for (let k = 0; k < 12; k += 2) inBeat(14, 0.24 + k * 0.055, "tick", 0.14);
[1.75, 1.97, 2.19, 2.41].forEach((t) => inBeat(14, t, "blip", 0.18));

// ---- 16 end: one mark, then let it go quiet -----------------------------
inBeat(15, 0.62, "latch", 0.28);

export const CUES = C.sort((a, b) => a.at - b.at);
