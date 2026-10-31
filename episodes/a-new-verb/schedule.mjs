// EP27 schedule — every second in the film is derived here, never hand-authored.
// Scene = VO + breath, snapped UP to the 92bpm grid, plus a designed tail. This
// register needs generous tails: the whole design rule is that a MARK lands after
// the thing it marks, so the annotation has to have somewhere to land.
import durs from "./vo-durations.json" with { type: "json" };

export const BPM = 92;
export const BEAT = 60 / BPM;                 // 0.652174s
export const BAR = BEAT * 4;
export const BREATH = 0.35;
const snapUp = (s) => Math.ceil(s / BEAT - 1e-6) * BEAT;

// id, vo line (1-based) or hold, designed tail, act, field
export const DEFS = [
  { id: "open",        vo: 1,  tail: 1.0, act: 0, field: "paper"  },
  { id: "title",       hold: 4.6,         act: 0, field: "yellow" },
  { id: "shelf",       vo: 2,  tail: 1.2, act: 1, field: "paper"  },
  { id: "getbody",     vo: 3,  tail: 1.0, act: 1, field: "paper"  },
  { id: "post",        vo: 4,  tail: 1.0, act: 1, field: "paper"  },
  { id: "notapparent", vo: 5,  tail: 1.0, act: 1, field: "paper"  },
  { id: "cost",        vo: 6,  tail: 1.2, act: 1, field: "paper"  },
  { id: "slate",       hold: 2.4,         act: 2, field: "navy"   },
  { id: "query",       vo: 7,  tail: 1.2, act: 2, field: "paper2" },
  { id: "table",       vo: 8,  tail: 1.2, act: 2, field: "paper2" },
  { id: "cachekey",    vo: 9,  tail: 1.2, act: 2, field: "paper2" },
  { id: "name",        vo: 10, tail: 0.9, act: 3, field: "paper"  },
  { id: "catch",       vo: 11, tail: 1.0, act: 3, field: "navy"   },
  { id: "end",         vo: 12, tail: 2.0, act: 4, field: "yellow" },
];

// The seam INTO each frame. Three kinds only — the variety in this register lives in
// the annotation layer, not in the cutting. zback is spent ONCE, on the turn.
export const SEAM_IN = {
  open: null, title: "lift", shelf: "lift", getbody: "across", post: "across",
  notapparent: "across", cost: "across", slate: "zback", query: "across",
  table: "across", cachekey: "across", name: "lift", catch: "across", end: "lift",
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
