// EP26 schedule — every second in the film is derived here, never hand-authored.
// Scene = VO + breath, snapped UP to the 84bpm grid, plus a designed tail so the
// payoff can land after the spoken line (sync-durations would give zero breath).
import durs from "./vo-durations.json" with { type: "json" };

export const BPM = 84;
export const BEAT = 60 / BPM;                 // 0.714286s
export const BAR = BEAT * 4;
export const BREATH = 0.35;
const snapUp = (s) => Math.ceil(s / BEAT - 1e-6) * BEAT;

// id, vo line (1-based) or hold, designed tail, act, grid cell [col,row], bg
export const DEFS = [
  { id: "open",    vo: 1,  tail: 1.2, act: 0, bg: "interior"   },
  { id: "title",   hold: 5.0,         act: 0, bg: "cabinet"    },
  { id: "dist",    vo: 2,  tail: 1.6, act: 1, cell: [0,0], bg: "lamplit" },
  { id: "lcp",     vo: 3,  tail: 1.9, act: 1, cell: [1,0], bg: "lamplit" },
  { id: "cls",     vo: 4,  tail: 1.7, act: 1, cell: [2,0], bg: "lamplit" },
  { id: "inp",     vo: 5,  tail: 1.9, act: 1, cell: [3,0], bg: "lamplit" },
  { id: "path",    vo: 6,  tail: 1.7, act: 2, cell: [3,1], bg: "dark"    },
  { id: "fonts",   vo: 7,  tail: 1.6, act: 2, cell: [2,1], bg: "dark"    },
  { id: "images",  vo: 8,  tail: 1.6, act: 2, cell: [1,1], bg: "dark"    },
  { id: "bundle",  vo: 9,  tail: 1.8, act: 2, cell: [0,1], bg: "dark"    },
  { id: "render",  vo: 10, tail: 1.6, act: 3, cell: [0,2], bg: "bright"  },
  { id: "hydrate", vo: 11, tail: 1.6, act: 3, cell: [1,2], bg: "bright"  },
  { id: "thread",  vo: 12, tail: 1.8, act: 3, cell: [2,2], bg: "bright"  },
  { id: "paint",   vo: 13, tail: 1.7, act: 3, cell: [3,2], bg: "bright"  },
  { id: "cache",   vo: 14, tail: 1.6, act: 4, cell: [3,3], bg: "lamplit" },
  { id: "third",   vo: 15, tail: 1.6, act: 4, cell: [2,3], bg: "lamplit" },
  { id: "field",   vo: 16, tail: 1.9, act: 4, cell: [1,3], bg: "lamplit" },
  { id: "end",     vo: 17, tail: 3.4, act: 4, bg: "cabinet"   },
];

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

export const STRIP = DEFS.filter((d) => d.cell);
export const isActBreak = (id) => {
  const i = STRIP.findIndex((d) => d.id === id);
  return i > 0 && STRIP[i - 1].cell[1] !== STRIP[i].cell[1];
};
