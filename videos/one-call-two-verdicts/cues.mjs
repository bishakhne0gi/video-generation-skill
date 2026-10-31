// The cue layer. Three rules: every cue is attached to something that MOVES, nothing
// competes with the voice, and silence is a cue too.
//
// In this register the loudest events are physical: a cutting being SLAPPED down and a
// rubber STAMP landing. Those get `thunk`. A pen stroke gets `swipe`. Everything else
// is deliberately unsounded — a film where every arrival ticks has no arrivals.
// Seams are sounded by kind in build.mjs, not here.
export const DURS = { tick:0.12, click:0.08, key1:0.07, key2:0.07, key3:0.07, key4:0.07,
  notify:0.9, success:1.3, error:0.7, whoosh:0.5, swipe:0.3, thunk:0.55, sub:1.1,
  riser:1.6, blip:0.05, latch:0.3 };

// deliberately quiet: the narration runs almost continuously in this film
export const GAIN = { tick:0.20, click:0.17, key1:0.13, key2:0.13, key3:0.13, key4:0.13,
  notify:0.23, success:0.27, error:0.23, whoosh:0.27, swipe:0.26, thunk:0.33, sub:0.31,
  riser:0.25, blip:0.15, latch:0.22 };

// a short burst of key taps under a type-on, at the real characters-per-second
const keys = (t0, n, cps) => Array.from({ length: n }, (_, i) =>
  [`key${(i % 4) + 1}`, +(t0 + i * (1 / cps) * 6).toFixed(2)]);
// a run of ticks under a counter, on the counter's own step
const ticks = (t0, n, dt, name = "tick") => Array.from({ length: n }, (_, i) =>
  [name, +(t0 + i * dt).toFixed(2)]);

export const CUES = {
  "01-open": [["thunk",0.08], ...keys(0.40,9,82), ["swipe",3.52], ["thunk",4.32], ["swipe",4.86],
    ["blip",5.30], ...ticks(5.44,7,0.37), ["error",7.36], ["thunk",7.86], ["swipe",8.16], ["latch",8.32]],

  "02-title": [["thunk",0.62], ["click",0.75], ["click",0.88], ["click",1.01], ["click",1.14],
    ["thunk",1.44], ["click",1.56], ["click",1.68], ["click",1.80], ["click",1.92], ["click",2.04],
    ["swipe",2.36], ["latch",2.52], ["blip",3.02], ["swipe",3.62]],

  "03-ed1984": [["latch",0.46], ["click",0.62], ["blip",1.00], ["swipe",1.36]],
  "07-ed1994": [["latch",0.46], ["click",0.62], ["blip",1.00], ["swipe",1.36]],
  "10-ed2015": [["latch",0.50], ["click",0.66], ["blip",1.04], ["swipe",1.40]],

  "04-promise": [["thunk",1.10], ["tick",1.34], ["click",1.62], ["click",1.80],
    ...keys(2.10,7,118), ["swipe",3.90], ["latch",4.06], ["swipe",6.60], ["latch",6.76],
    ["click",7.16], ["click",7.44], ["swipe",8.30], ["thunk",9.60], ["swipe",10.20]],

  "05-tableone": [["thunk",1.00], ...ticks(1.34,5,0.30), ["click",3.60], ["blip",4.10],
    ["latch",4.60], ["click",6.20], ["blip",6.50], ["swipe",6.66], ["click",7.06],
    ["whoosh",7.62], ["blip",10.30], ["swipe",11.60]],

  "06-notimeout": [["thunk",1.00], ["latch",1.26], ["click",3.30], ["latch",3.48],
    ["swipe",4.30], ["thunk",5.30], ...ticks(5.72,13,0.42), ["click",8.10],
    ["thunk",9.10], ["swipe",9.30], ["latch",9.44]],

  "08-four": [["thunk",1.00], ["thunk",1.86], ["thunk",2.72], ["thunk",3.58],
    ["swipe",4.72], ["thunk",5.86], ["swipe",6.44], ["latch",6.60], ["click",7.20],
    ["swipe",8.10], ["swipe",8.62], ["latch",9.16]],

  "09-indist": [["swipe",0.42], ["latch",0.58], ["click",1.18], ["thunk",1.90], ["thunk",2.22],
    ["blip",2.90], ["blip",4.90], ["blip",6.30], ["error",4.14], ["error",4.42],
    ["thunk",7.60], ["thunk",7.92], ["swipe",8.60], ["swipe",9.10], ["notify",9.82], ["swipe",10.40], ["swipe",10.80]],

  "11-wire": [["thunk",0.80], ...keys(1.06,8,96), ["swipe",3.90], ["swipe",4.70],
    ["click",5.50], ...ticks(5.86,13,0.235,"blip"), ["latch",6.18], ["latch",6.76],
    ["click",7.86], ["swipe",9.10], ["latch",10.10], ["swipe",11.10]],

  "12-deadline": [["thunk",0.90], ["thunk",2.60], ["swipe",3.30], ["swipe",3.90],
    ["swipe",4.10], ["thunk",4.36], ["latch",5.18], ...ticks(6.66,10,0.30),
    ["error",9.42], ["click",9.70], ["latch",10.20]],

  "13-verdicts": [["thunk",0.92], ["swipe",1.54], ["thunk",2.06], ["thunk",2.70],
    ["thunk",4.10], ["swipe",4.74], ["swipe",5.20], ["thunk",5.72],
    ["swipe",6.60], ["latch",6.76], ["latch",8.90], ["click",9.44], ["swipe",10.10], ["swipe",10.60]],

  "14-codes": [...ticks(0.88,17,0.064,"click"), ["swipe",2.98], ["latch",3.90],
    ["latch",6.10], ["swipe",7.00], ["click",7.86], ["swipe",10.30], ["latch",11.90]],

  "15-streams": [["click",0.70], ["latch",0.86], ["latch",1.28], ["latch",1.70], ["latch",2.12],
    ["blip",3.30], ["blip",4.16], ["blip",6.00], ["blip",6.86], ["blip",8.70], ["blip",9.56]],

  "16-browser": [["swipe",0.60], ["latch",0.76], ["click",1.90], ["latch",2.20],
    ["error",2.90], ["latch",3.60], ["thunk",4.60], ["latch",6.40], ["swipe",7.30], ["thunk",9.30]],

  "17-end": [["swipe",0.16], ["latch",0.90], ["latch",2.26], ["latch",3.62],
    ["click",4.60], ["notify",5.30], ["thunk",6.40], ["latch",7.60], ["swipe",8.60],
    ["swipe",9.90], ["success",10.90], ["swipe",11.20]],
};
