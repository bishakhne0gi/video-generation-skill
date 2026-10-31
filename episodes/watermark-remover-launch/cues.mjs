// THE CUE LAYER. In a film with no narration this is the narration: there is no
// voice to duck under, so the bed runs open throughout and every event has to be
// sounded. The eye reads an arrival as an event only when the ear confirms it.
//
// Three rules, and they are the difference between sound design and noise:
//   1. every cue is attached to something that MOVES on screen
//   2. nothing sounds a soft dissolve — a whoosh over a fade says "something
//      moved" while the picture says "time passed"
//   3. silence is a cue too. Beat 6 gets one hit and is then left alone.

import { START, LEN } from "./schedule.mjs";
import { SEAMS } from "./lib/seams.mjs";

// Levels are set against the REAL BED, not in the abstract. Each cue was measured
// in its own frequency band against the music at the moment it fires; anything
// lifting less than 3dB over the bed was inaudible and got raised until it wasn't.
// The bed is a recording with its own kick and hats, so the low cues (thunk, sub)
// and mid transients (latch, click) needed the most room bought back.
export const GAIN = {
  tick: 0.26, click: 0.486, latch: 0.411, blip: 0.298, notify: 0.36,
  success: 0.496, whoosh: 0.403, swipe: 0.36, thunk: 0.499, sub: 0.442, riser: 0.378,
  key1: 0.2, key2: 0.2, key3: 0.2, key4: 0.2,
};

// Each seam kind gets its own sound, so the act break is audibly different from
// an ordinary cut and the one arrival is audibly different from both.
const SEAM_CUE = { across: "swipe", lift: "thunk", zin: "whoosh", zback: "sub", up: "swipe" };

const C = [];
const cue = (name, at, gain) => C.push({ name, at: +Math.max(0, at).toFixed(3), gain: gain ?? GAIN[name] ?? 0.26 });
const inBeat = (i, t, name, gain) => cue(name, START[i] + t, gain);

// ---- the seams ------------------------------------------------------------
SEAMS.forEach((s) => cue(SEAM_CUE[s.kind], START[s.i] + LEN[s.i] - 0.12));

// ---- 01 prompt: the keystrokes, then the send -----------------------------
// Key taps run under the type-on at the SAME start and rate the picture uses
// (0.12s, 26cps), or the sound drifts off the glyphs. Every third character is
// struck — 43 taps would be a rattle, 15 reads as typing.
const P_AT = 0.12, P_CPS = 26, P_N = 43;
for (let k = 0; k < P_N; k += 3) inBeat(0, P_AT + k / P_CPS, `key${(k % 4) + 1}`);
inBeat(0, 2.47, "click", 0.518);      // the send button, on the tap
inBeat(0, 2.64, "blip", 0.322);       // the composer answering it

// ---- 02 image: the scan, and the stamp landing ----------------------------
inBeat(1, 0.30, "sub", 0.304);        // the scan begins its pass
inBeat(1, 1.35, "latch", 0.379);      // the plate finishes resolving
inBeat(1, 1.92, "thunk", 0.562);      // THE MARK LANDS — the antagonist arrives
inBeat(1, 1.96, "notify", 0.24);

// ---- 03 post: published, then the platform answers twice ------------------
inBeat(2, 0.86, "whoosh", 0.346);     // the post rises into place
inBeat(2, 0.98, "latch", 0.411);
inBeat(2, 2.02, "notify", 0.408);     // the badge is painted on
inBeat(2, 2.58, "blip", 0.347);       // the credential row opens
inBeat(2, 3.44, "tick", 0.208);       // the single breath

// ---- 04 fix: the beat with the most to sound ------------------------------
// The brush is 13 dots over 0.86s; sounding all of them is a rattle, so every
// fourth is struck and the ear fills in the rest.
inBeat(3, 1.51, "tick", 0.234);       // the cursor arrives at the mark
for (let k = 0; k < 13; k += 4) inBeat(3, 1.62 + (k * 0.86) / 13, "tick", 0.195);
inBeat(3, 2.60, "latch", 0.379);      // Remove becomes available — caused by the stroke
inBeat(3, 3.32, "click", 0.518);      // the tap
inBeat(3, 3.56, "sub", 0.414);        // the fill runs
inBeat(3, 3.62, "blip", 0.322);
[0, 1, 2].forEach((k) => inBeat(3, 4.18 + k * 0.16, "tick", 0.208));   // the three claims
inBeat(3, 5.42, "click", 0.486);      // Download
inBeat(3, 5.52, "success", 0.471);    // the file is yours

// ---- 05 clean: the most earned cue in the film ---------------------------
inBeat(4, 0.30, "whoosh", 0.317);
inBeat(4, 0.96, "swipe", 0.33);      // the credential lifting off
inBeat(4, 1.14, "swipe", 0.27);      // the mark following it
inBeat(4, 1.58, "success", 0.521);    // gone
inBeat(4, 1.76, "tick", 0.208);

// ---- 06 end: one hit, then let it go quiet -------------------------------
inBeat(5, 0.46, "latch", 0.474);      // the marker band drawn across the headline
// and nothing after it. The last 2.5s of the film are the bed alone.

export const CUES = C.sort((a, b) => a.at - b.at);
