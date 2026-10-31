// Every second in the film is derived here. Nothing downstream hand-guesses a time.
import durs from "./vo-durations.json" with { type: "json" };

export const FPS = 30;
// 88, not VectorDrop's 96. Forma's own voice is "diagnostic, measured,
// operational" (DESIGN.md §1) and a launch tempo argues with it.
export const BPM = 88;
export const BEAT = 60 / BPM;          // 0.6818s
export const BREATH = 0.35;            // the house breath after a spoken line

// Quantise UPWARD only — the line always finishes, and the cut still lands on a beat.
export const snapUp = (s) => Math.ceil(s / BEAT - 1e-9) * BEAT;
export const barAt = (n) => n * BEAT * 4;

// act 0 the archive · 1 describe it · 2 the base last · 3 the mesh
//     4 the sole · 5 the rest, and out
export const DEFS = [
  { id: "open",  vo:  1, tail: 1.3, act: 0, bg: "paper"  },
  { id: "title", hold: 4.0,         act: 0, bg: "bloom"  },
  { id: "ask",   vo:  2, tail: 1.4, act: 1, bg: "app"    },
  { id: "tie",   vo:  3, tail: 1.5, act: 1, bg: "app"    },
  { id: "spec",  vo:  4, tail: 1.4, act: 1, bg: "app"    },
  { id: "rank",  vo:  5, tail: 1.6, act: 1, bg: "app"    },
  { id: "base",  vo:  6, tail: 1.7, act: 2, bg: "app"    },
  { id: "plan",  vo:  7, tail: 1.5, act: 2, bg: "app"    },
  { id: "sheet", vo:  8, tail: 1.6, act: 2, bg: "app"    },
  { id: "stl",   vo:  9, tail: 1.5, act: 3, bg: "app"    },
  { id: "found", vo: 10, tail: 1.9, act: 3, bg: "app"    },
  { id: "sole",  vo: 11, tail: 1.6, act: 4, bg: "paper"  },
  { id: "hit",   vo: 12, tail: 1.7, act: 4, bg: "app"    },
  { id: "why",   vo: 13, tail: 1.8, act: 4, bg: "paper"  },
  { id: "rest",  vo: 14, tail: 1.6, act: 5, bg: "app"    },
  { id: "end",   vo: 15, tail: 3.9, act: 5, bg: "bloom"  },
];

export const LEN = DEFS.map((d) =>
  d.vo ? snapUp(durs[d.vo - 1] + BREATH + d.tail) : snapUp(d.hold));

export const START = [];
LEN.reduce((acc, d, i) => { START[i] = acc; return acc + d; }, 0);
export const RUNTIME = START[START.length - 1] + LEN[LEN.length - 1];

// A VO window is where the spoken line actually sits inside its beat.
export const VO_WINDOWS = DEFS.map((d, i) =>
  d.vo ? { at: START[i], len: durs[d.vo - 1] } : null);

// An act break is the first beat of a new act — it gets the LIFT, not the ACROSS.
export const isActBreak = (i) => i > 0 && DEFS[i].act !== DEFS[i - 1].act;
