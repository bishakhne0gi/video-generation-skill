// The cue layer. Three rules: every cue is attached to something that MOVES, nothing
// competes with the voice, and silence is a cue too — if every beat has sound, none of
// them land.
//
// In THIS register the loudest events are editorial rather than physical: a well
// colour-blocking in (`latch`), a stamp landing (`thunk`), bytes typing (`key1..4`),
// a counter running (`tick`), a mark being drawn (`swipe`). The one `error` in the
// film is spent on the stall. Seams are sounded by kind in build.mjs, not here.
export const DURS = { tick:0.12, click:0.08, key1:0.07, key2:0.07, key3:0.07, key4:0.07,
  notify:0.9, success:1.3, error:0.7, whoosh:0.5, swipe:0.3, thunk:0.55, sub:1.1,
  riser:1.6, blip:0.05, latch:0.3 };

// deliberately quiet: the narration runs almost continuously in this film
export const GAIN = { tick:0.19, click:0.16, key1:0.12, key2:0.12, key3:0.12, key4:0.12,
  notify:0.22, success:0.26, error:0.22, whoosh:0.26, swipe:0.25, thunk:0.32, sub:0.30,
  riser:0.24, blip:0.14, latch:0.23 };

/** a short burst of key taps under a type-on, thinned to one tap per six characters */
export const keys = (t0, n, cps) => Array.from({ length: n }, (_, i) =>
  [`key${(i % 4) + 1}`, +(t0 + i * (1 / cps) * 6).toFixed(2)]);
/** a run of ticks under a counter, on the counter's own step */
export const ticks = (t0, n, dt, name = "tick") => Array.from({ length: n }, (_, i) =>
  [name, +(t0 + i * dt).toFixed(2)]);

export const CUES = {};

Object.assign(CUES, {
  // 01 — two commands typed, two figures resolving, the rail, the mark
  "01-open": [["latch",0.30], ...keys(0.58,7,46), ["blip",1.72], ...ticks(1.78,5,0.11),
    ...keys(2.94,7,46), ["blip",4.08], ...ticks(4.14,4,0.11),
    ["click",5.20], ["swipe",5.34], ["click",5.62], ["click",5.98], ["click",6.34],
    ["thunk",8.62], ["swipe",9.30]],

  // 02 — the title card. The cascade is the sound: one click per line, then the accent.
  "02-title": [["swipe",0.44], ["thunk",0.62], ["thunk",0.78], ["thunk",0.94],
    ["blip",1.34], ["click",1.86], ["click",2.30], ["swipe",3.30]],

  "03-slate1": [["swipe",0.34], ["click",0.52], ["blip",0.84]],
  "07-slate2": [["swipe",0.34], ["click",0.52], ["blip",0.84]],
  "10-slate3": [["swipe",0.34], ["click",0.52], ["blip",0.84]],

  // 04 — the signature move. The stall gets the film's ONE `error`, at the moment the
  // plate stops. Nothing else in the episode is allowed that sound.
  "04-bytes": [["click",0.26], ["latch",0.62], ...keys(0.92,14,62), ["thunk",2.34],
    ["click",3.24], ["latch",4.30], ...keys(4.62,9,62), ...keys(5.98,3,62), ["swipe",6.76],
    ["blip",7.44], ["error",7.70], ...ticks(7.90,9,0.31), ["thunk",10.72], ["click",11.06],
    ["thunk",11.42]],

  // 05 — the template, then the string match, then the comment
  "05-template": [["click",0.24], ["latch",0.52], ...keys(0.86,16,66), ...keys(3.30,8,66),
    ["click",5.10], ["blip",5.44], ["blip",6.36], ["swipe",7.42], ["notify",7.52],
    ["thunk",8.06], ["swipe",9.06], ["blip",9.74]],

  // 06 — two brackets, two numbers, one absence
  "06-etag": [["click",0.26], ["swipe",1.90], ["click",2.38], ...ticks(2.70,7,0.12),
    ["blip",3.86], ["swipe",5.30], ["click",5.70], ...ticks(6.02,5,0.12), ["blip",7.02],
    ["click",7.86], ["click",8.02], ["swipe",8.30], ["blip",8.62], ["blip",10.10],
    ["thunk",12.10]],

  // 08 — the dot travelling the axis. Each landing is a `latch`; each staged row inside
  // a column gets a `blip`. The PULSES are deliberately UNSOUNDED: a tick every 0.55s
  // for four seconds is a metronome, and the film already has a bed keeping time.
  "08-when": [["swipe",0.34], ["click",0.62], ["click",0.92], ["click",1.22],
    ["latch",1.46], ["blip",1.98], ["blip",2.64], ["blip",3.30], ["click",3.94],
    ["latch",5.11], ["blip",5.63], ["blip",6.29], ["blip",6.95], ["click",7.59],
    ["latch",8.76], ["blip",9.28], ["blip",9.94], ["blip",10.60], ["click",11.24],
    ["swipe",11.30]],

  "09-jekyll08": [["click",1.90], ["blip",3.30], ["swipe",4.30], ["blip",4.58],
    ["click",6.10], ["blip",7.40], ["swipe",8.60], ["click",8.86], ["click",9.76],
    ["click",10.66], ["latch",11.10], ["swipe",13.10]],

  // 11 — four bars, four counters, then the third-party row below the rule
  "11-bundle": [["click",0.24], ["click",0.50],
    ["blip",0.86], ...ticks(1.02,4,0.16),
    ["blip",2.30], ...ticks(2.46,4,0.16),
    ["blip",3.74], ...ticks(3.90,4,0.16),
    ["blip",5.18], ...ticks(5.34,4,0.16),
    ["swipe",7.20], ["click",7.46], ["blip",7.76], ...ticks(7.92,5,0.16),
    ["click",10.10], ["thunk",12.30]],

  // 12 — the same shape, then the rescale, then the reveal that it sent LESS html
  "12-weight": [["click",0.22],
    ["blip",0.62], ...ticks(0.78,4,0.17),
    ["blip",1.84], ...ticks(2.00,4,0.17),
    ["blip",3.06], ...ticks(3.22,4,0.17),
    ["blip",4.28], ...ticks(4.44,5,0.17),
    ["swipe",6.10], ["blip",6.34], ...ticks(6.50,6,0.15),
    ["blip",8.30], ["tick",8.46],
    ["click",10.10], ["click",11.06], ["swipe",11.60], ["thunk",12.60]],

  // 13 — the two lanes. Lane one is a burst; lane two is seven separate events, and
  // the silence between them is the argument.
  "13-strip": [["click",0.24], ["swipe",0.50],
    ["click",0.72], ...ticks(1.02,12,0.09,"blip"), ["notify",2.32], ["click",2.44],
    ["click",3.42], ["blip",3.70], ["blip",4.22], ["blip",4.74], ["blip",5.26],
    ["blip",5.78], ["blip",6.30], ["blip",6.82], ["notify",7.06], ["click",7.18],
    ["click",8.30], ["thunk",9.60]],

  // 14 — one fast bar and one slow one. The tick run under the second is deliberately
  // long: the sound is how the frame communicates that the wait is the point.
  "14-paint": [["click",0.22], ["click",0.56], ...ticks(0.86,6,0.18), ["notify",2.20],
    ["click",3.66], ...ticks(3.96,14,0.21), ["notify",6.80],
    ["swipe",8.20], ["click",9.60], ["thunk",11.60], ["click",12.66]],

  // 15 — the Z-BACK lands; the plate rises clean; then two beats and the stamp
  "15-turn": [["click",0.30], ["latch",0.62], ["blip",2.30], ["swipe",3.70],
    ["click",3.92], ["swipe",5.10], ["click",6.10], ["swipe",7.40], ["thunk",8.90]],

  "16-exist": [["click",0.22], ["latch",0.48], ...keys(0.82,20,66),
    ["click",4.40], ["swipe",4.56], ["blip",4.86], ["error",5.50], ["click",6.20],
    ["click",8.20], ["thunk",9.90]],

  // 17 — the question, then three answers, each in two halves: the condition lands on a
  // `latch` and the destination on a `click` 1.3s later.
  "17-rule": [["swipe",1.10],
    ["latch",1.62], ["swipe",1.86], ["click",2.92],
    ["latch",4.32], ["swipe",4.56], ["click",5.62],
    ["latch",7.02], ["swipe",7.26], ["click",8.32],
    ["click",10.30], ["thunk",11.10]],

  // 18 — the orange band. Four pills, one at a time, then the quotation.
  "18-mistake": [["click",0.24], ["swipe",0.38], ["blip",1.00], ["blip",2.10],
    ["click",3.50],
    ["thunk",5.40], ["thunk",6.32], ["thunk",7.24], ["thunk",8.16],
    ["click",10.10], ["click",11.90], ["swipe",13.10],
    ["latch",13.90], ["latch",14.34], ["latch",14.78], ["latch",15.22]],

  // 19 — the end card. `success` is the most earned cue in the kit and it is spent once,
  // on the ring closing round the next episode.
  "19-end": [["click",0.20], ["swipe",0.34], ["blip",0.62], ["blip",2.72], ["blip",4.82],
    ["click",4.60], ["swipe",4.74], ...ticks(4.96,5,0.26,"click"),
    ["swipe",6.90], ["click",7.14], ["blip",7.34], ["click",8.10],
    ["swipe",8.60], ["success",8.92]],
});
