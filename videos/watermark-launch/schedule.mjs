// Every second in the film is derived here. Nothing downstream hand-guesses a time.
//
// This is a WORKSPACE-register film: no footage, no narration. With no voice to
// time the picture to, the MUSIC GRID is the clock — every beat length is a
// whole number of musical beats, so every cut lands on one.

export const FPS = 30;
export const BPM = 124.92;             // NOT chosen — MEASURED off the bed (see lib/bed.mjs).
                                       // The film is cut to the music rather than the music
                                       // stretched to the film, so nothing is time-warped.
export const BEAT = 60 / BPM;          // 0.48031s
export const BAR = BEAT * 4;           // 1.92124s

export const barAt = (n) => n * BAR;
export const beatAt = (n) => n * BEAT;
// Quantise UPWARD only, so a move never gets cut short to fit the grid.
export const snapUp = (s) => Math.ceil(s / BEAT - 1e-9) * BEAT;

// act 0 the generation · 1 the post · 2 the fix · 3 the payoff
// `beats` is the length in whole musical beats. A first cut ran 48 of them and
// the pacing audit measured 44% of the film static — every beat was outliving
// what it had to say. This is that cut tightened, then re-gridded to the bed.
export const DEFS = [
  { id: "prompt", beats:  9, act: 0, bg: "dark"  },  //  4.32  typing into Gemini
  { id: "image",  beats:  9, act: 0, bg: "dark"  },  //  4.32  the image, and the mark
  { id: "post",   beats:  9, act: 1, bg: "dark"  },  //  4.32  posted — the CR badge lands
  { id: "fix",    beats: 14, act: 2, bg: "paper" },  //  6.72  the product. the value flip
  { id: "clean",  beats:  8, act: 3, bg: "dark"  },  //  3.84  reposted — no badge
  { id: "end",    beats:  6, act: 3, bg: "paper" },  //  2.88  the card
];

export const LEN = DEFS.map((d) => +(d.beats * BEAT).toFixed(3));

export const START = [];
LEN.reduce((acc, d, i) => { START[i] = +acc.toFixed(3); return acc + d; }, 0);
export const RUNTIME = +(START[START.length - 1] + LEN[LEN.length - 1]).toFixed(3);

export const isActBreak = (i) => i > 0 && DEFS[i].act !== DEFS[i - 1].act;
