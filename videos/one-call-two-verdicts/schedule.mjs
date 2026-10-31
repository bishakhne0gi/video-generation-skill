// EP28 schedule — every second in the film is derived here, never hand-authored.
// Scene = VO + breath, snapped UP to the 96bpm grid, plus a designed tail. Tails are
// leaner than EP27's because this register's marks are fast: a stamp lands in 0.10s,
// a slap in 0.16s, so a mark does not need a second and a half to arrive in.
import durs from "./vo-durations.json" with { type: "json" };

export const BPM = 96;
export const BEAT = 60 / BPM;                 // 0.625s
export const BAR = BEAT * 4;
export const BREATH = 0.35;
const snapUp = (s) => Math.ceil(s / BEAT - 1e-6) * BEAT;

// id, vo line (1-based) or hold, designed tail, act, field
export const DEFS = [
  { id: "open",     vo: 1,  tail: 1.1, act: 0, field: "news"  },
  { id: "title",    hold: 5.0,         act: 0, field: "plate" },
  { id: "ed1984",   hold: 2.5,         act: 1, field: "stop"  },
  { id: "promise",  vo: 2,  tail: 0.9, act: 1, field: "news"  },
  { id: "tableone", vo: 3,  tail: 1.0, act: 1, field: "news"  },
  { id: "notimeout",vo: 4,  tail: 1.0, act: 1, field: "news"  },
  { id: "ed1994",   hold: 2.5,         act: 2, field: "plate" },
  { id: "four",     vo: 5,  tail: 1.0, act: 2, field: "news2" },
  { id: "indist",   vo: 6,  tail: 1.1, act: 2, field: "news2" },
  { id: "ed2015",   hold: 2.5,         act: 3, field: "stop"  },
  { id: "wire",     vo: 7,  tail: 0.9, act: 3, field: "news"  },
  { id: "deadline", vo: 8,  tail: 1.0, act: 3, field: "news"  },
  { id: "verdicts", vo: 9,  tail: 1.1, act: 3, field: "news"  },
  { id: "codes",    vo: 10, tail: 1.0, act: 3, field: "news"  },
  { id: "streams",  vo: 11, tail: 0.9, act: 3, field: "news"  },
  { id: "browser",  vo: 12, tail: 1.0, act: 4, field: "plate" },
  { id: "end",      vo: 13, tail: 1.2, act: 4, field: "stop"  },
];

// The seam INTO each frame. Three kinds only — the variety in this register lives in
// the cuttings, not in the cutting-together. zback is RESERVED and spent ONCE, on
// deadline -> verdicts: the title beat, and the only Z seam in the film.
export const SEAM_IN = {
  open: null,   title: "lift",   ed1984: "lift",  promise: "across", tableone: "across",
  notimeout: "across", ed1994: "lift", four: "across", indist: "across",
  ed2015: "lift",  wire: "across", deadline: "across", verdicts: "zback",
  codes: "across", streams: "across", browser: "lift", end: "lift",
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
