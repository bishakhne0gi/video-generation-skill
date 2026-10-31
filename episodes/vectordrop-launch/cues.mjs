// Every cue is attached to something that moves on screen. Nothing sounds a
// soft dissolve — a whoosh over a fade says "something moved" while the picture
// says "time passed", which is the classic amateur note. Levels sit at
// 0.18-0.42 so nothing competes with the voice.
import { START, LEN } from "./schedule.mjs";
import { SEAMS } from "./lib/seams.mjs";

export const GAIN = {
  tick: 0.22, click: 0.30, latch: 0.26, blip: 0.24, notify: 0.30,
  success: 0.42, whoosh: 0.30, swipe: 0.26, thunk: 0.32, sub: 0.34, riser: 0.30,
};

// Each seam kind gets its own sound, so an act break is audibly different from
// an ordinary cut and the one arrival is audibly different from both.
const SEAM_CUE = { across: "swipe", lift: "thunk", zin: "whoosh", zback: "sub", up: "swipe" };

const C = [];
const cue = (name, at, gain) => C.push({ name, at: +at.toFixed(3), gain: gain ?? GAIN[name] ?? 0.26 });
const inBeat = (i, t, name, gain) => cue(name, START[i] + t, gain);

// ---- the seams ------------------------------------------------------------
SEAMS.forEach((s) => {
  const boundary = START[s.i] + LEN[s.i];
  cue(SEAM_CUE[s.kind], boundary - 0.12);
});

// ---- 01 open: the spec chips, then the reticle ----------------------------
[0.72, 0.85, 0.98].forEach((t) => inBeat(0, t, "tick"));
inBeat(0, 4.30, "latch");
// ---- 02 fall: the grid resolving, the marker walking ----------------------
inBeat(1, 1.90, "latch"); [3.10, 3.95, 4.95].forEach((t) => inBeat(1, t, "blip"));
// ---- 03 title ------------------------------------------------------------
inBeat(2, 0.06, "latch", 0.30); inBeat(2, 1.28, "swipe", 0.20);
// ---- 04 drop: the cursor is the author, so it is the thing that sounds ----
inBeat(3, 3.52, "click"); inBeat(3, 3.72, "thunk", 0.30);
// ---- 05 pipe: one tick per stage completing, notify on ready -------------
[1.05, 2.40, 3.75, 5.10].forEach((t) => inBeat(4, t, "tick"));
inBeat(4, 6.20, "notify");
// ---- 06 paths: 31 ticks would be a rattle; every fourth reads as a system -
for (let k = 0; k < 31; k += 4) inBeat(5, 0.95 + (k * 6.60) / 31, "tick", 0.18);
inBeat(5, 7.55, "success", 0.34);
// ---- 07 zoom: one long tone under the push, nothing else ------------------
inBeat(6, 0.90, "sub", 0.24);
// ---- 08 edit: two taps, and the recolour answers -------------------------
inBeat(7, 1.48, "click"); inBeat(7, 1.62, "latch", 0.22);
inBeat(7, 3.60, "click"); inBeat(7, 3.80, "blip", 0.30); inBeat(7, 4.70, "latch"); inBeat(7, 4.95, "tick", 0.16);
// ---- 09 looks: the mode switch -------------------------------------------
inBeat(8, 2.44, "click"); inBeat(8, 4.74, "click"); inBeat(8, 6.10, "latch");
// ---- 10 ship: the menu staggering in, then the file saved ----------------
[0, 1, 2, 3, 4].forEach((k) => inBeat(9, 3.46 + k * 0.075, "tick", 0.18));
inBeat(9, 7.05, "success", 0.36);
// ---- 11 dest --------------------------------------------------------------
[2.90, 3.18, 3.46].forEach((t) => inBeat(10, t, "tick"));
// ---- 12 five: the most earned cue in the film ----------------------------
inBeat(11, 1.12, "thunk", 0.40); inBeat(11, 1.18, "success", 0.42); inBeat(11, 1.30, "notify", 0.24);
// ---- 13 free --------------------------------------------------------------
[0.62, 0.76, 0.90, 1.04].forEach((t) => inBeat(12, t, "tick", 0.20));
inBeat(12, 1.30, "latch");
// ---- 14 end: one cue, then let it go quiet -------------------------------
inBeat(13, 0.92, "latch", 0.30);

export const CUES = C.sort((a, b) => a.at - b.at);
