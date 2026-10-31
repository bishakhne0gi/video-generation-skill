// EP29 schedule — every second in the film is derived here, never hand-authored.
// Scene = VO + breath, snapped UP to the 92bpm grid, plus a designed tail.
//
// Tails are ~0.85s because this register's marks are quick: a well colour-blocks in
// in 0.34s and a stamp lands in 0.12s. They are longer only where the frame owes a
// running system a moment to finish (the byte bar, the counter, the stall).
import durs from "./vo-durations.json" with { type: "json" };

export const BPM = 92;
export const BEAT = 60 / BPM;                 // 0.6522s
export const BAR = BEAT * 4;
export const BREATH = 0.35;
const snapUp = (s) => Math.ceil(s / BEAT - 1e-6) * BEAT;

// id, vo line (1-based) or hold, designed tail, act, field
export const DEFS = [
  { id: "open",     vo: 1,  tail: 0.83, act: 0, field: "canvas" },
  { id: "title",    hold: 5.0,          act: 0, field: "hero"   },

  { id: "slate1",   hold: 2.2,          act: 1, field: "dark"   },
  { id: "bytes",    vo: 2,  tail: 0.78, act: 1, field: "canvas" },
  { id: "template", vo: 3,  tail: 0.63, act: 1, field: "canvas" },
  { id: "etag",     vo: 4,  tail: 0.78, act: 1, field: "canvas" },

  { id: "slate2",   hold: 2.2,          act: 2, field: "dark"   },
  { id: "when",     vo: 5,  tail: 0.73, act: 2, field: "dark"   },
  { id: "jekyll08", vo: 6,  tail: 0.63, act: 2, field: "dark"   },

  { id: "slate3",   hold: 2.2,          act: 3, field: "dark"   },
  { id: "bundle",   vo: 7,  tail: 0.63, act: 3, field: "canvas" },
  { id: "weight",   vo: 8,  tail: 0.83, act: 3, field: "canvas" },
  { id: "strip",    vo: 9,  tail: 0.78, act: 3, field: "canvas" },
  // the 0.6s stillness before the climax is authored INSIDE paint's tail, not added here
  { id: "paint",    vo: 10, tail: 0.98, act: 3, field: "canvas" },

  { id: "turn",     vo: 11, tail: 0.73, act: 4, field: "canvas" },
  { id: "exist",    vo: 12, tail: 0.68, act: 4, field: "bone"   },
  { id: "rule",     vo: 13, tail: 0.73, act: 4, field: "canvas" },
  { id: "mistake",  vo: 14, tail: 0.68, act: 4, field: "hero"   },

  { id: "end",      vo: 15, tail: 0.93, act: 5, field: "deep"   },
];

// The seam INTO each frame.
//
// Every ACT opens on a reserved vector and nothing else does: three lifts for Acts
// 1-3, and the Z-BACK for Act 4 — the moment the film stops prosecuting client
// rendering and starts defending it. The title and the end card also lift, because
// they are the two frames that are not part of the argument. Everything else is an
// across on the house LEFT current.
export const SEAM_IN = {
  open: null,     title: "lift",     slate1: "lift",   bytes: "across",
  template: "across", etag: "across", slate2: "lift",  when: "across",
  jekyll08: "across", slate3: "lift", bundle: "across", weight: "across",
  strip: "across",    paint: "across",
  turn: "zback",  exist: "across",   rule: "across",   mistake: "across",
  end: "lift",
};

export const LEN = DEFS.map((d) =>
  d.vo ? snapUp(durs[d.vo - 1] + BREATH + d.tail) : snapUp(d.hold));

export const START = [];
LEN.reduce((acc, l, i) => { START[i] = acc; return acc + l; }, 0);

export const idx   = (id) => DEFS.findIndex((d) => d.id === id);
export const at    = (id) => START[idx(id)];
export const len   = (id) => LEN[idx(id)];
export const endOf = (id) => at(id) + len(id);
export const RUNTIME = START[START.length - 1] + LEN[LEN.length - 1];

/** windows where a line is actually playing — the bed ducks against these */
export const VO_WINDOWS = DEFS.map((d, i) =>
  d.vo ? [START[i], START[i] + durs[d.vo - 1]] : null).filter(Boolean);
