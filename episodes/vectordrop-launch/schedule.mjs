// Every second in the film is derived here. Nothing downstream hand-guesses a time.
import durs from "./vo-durations.json" with { type: "json" };

export const FPS = 30;
export const BPM = 96;                 // launch energy; the teaching series runs 84
export const BEAT = 60 / BPM;          // 0.625s
export const BREATH = 0.35;            // the house breath after a spoken line

// Quantise UPWARD only — the line always finishes, and the cut still lands on a beat.
export const snapUp = (s) => Math.ceil(s / BEAT - 1e-9) * BEAT;
export const barAt = (n) => n * BEAT * 4;

// act 0 the problem · 1 the product · 2 the work · 3 shipping it · 4 the milestone
export const DEFS = [
  { id: "open",  vo:  1, tail: 1.0, act: 0, bg: "void"   },
  { id: "fall",  vo:  2, tail: 1.2, act: 0, bg: "void"   },
  { id: "title", hold: 4.2,         act: 0, bg: "bloom"  },
  { id: "drop",  vo:  3, tail: 1.2, act: 1, bg: "app"    },
  { id: "pipe",  vo:  4, tail: 1.4, act: 1, bg: "app"    },
  { id: "paths", vo:  5, tail: 2.2, act: 1, bg: "app"    },
  { id: "zoom",  vo:  6, tail: 1.6, act: 2, bg: "canvas" },
  { id: "edit",  vo:  7, tail: 1.4, act: 2, bg: "canvas" },
  { id: "looks", vo:  8, tail: 1.4, act: 2, bg: "canvas" },
  { id: "ship",  vo:  9, tail: 1.3, act: 3, bg: "app"    },
  { id: "dest",  vo: 10, tail: 1.6, act: 3, bg: "app"    },
  { id: "five",  vo: 11, tail: 4.1, act: 4, bg: "bloom"  },
  { id: "free",  vo: 12, tail: 1.3, act: 4, bg: "bloom"  },
  { id: "end",   vo: 13, tail: 3.0, act: 4, bg: "void"   },
];

export const LEN = DEFS.map((d) =>
  d.vo ? snapUp(durs[d.vo - 1] + BREATH + d.tail) : snapUp(d.hold));

export const START = [];
LEN.reduce((acc, d, i) => { START[i] = acc; return acc + d; }, 0);
export const RUNTIME = START[START.length - 1] + LEN[LEN.length - 1];

// A VO window is where the spoken line actually sits inside its beat.
export const VO_WINDOWS = DEFS.map((d, i) =>
  d.vo ? { at: START[i], len: durs[d.vo - 1] } : null);

// An act break is the first beat of a new act — it gets the 1.4s LIFT, not the 0.9s ACROSS.
export const isActBreak = (i) => i > 0 && DEFS[i].act !== DEFS[i - 1].act;
