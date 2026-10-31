// The cue layer. Three rules: every cue is attached to something that MOVES, nothing
// competes with the voice, and silence is a cue too. In this register the PEN is the
// loudest thing on screen, so every marker sweep and every pen stroke is sounded and
// almost nothing else is. Seams are sounded by kind in build.mjs, not here.
export const DURS = { tick:0.12, click:0.08, key1:0.07, key2:0.07, key3:0.07, key4:0.07,
  notify:0.9, success:1.3, error:0.7, whoosh:0.5, swipe:0.3, thunk:0.55, sub:1.1,
  riser:1.6, blip:0.05, latch:0.3 };

// deliberately quiet: the narration runs almost continuously in this film
export const GAIN = { tick:0.22, click:0.20, key1:0.14, key2:0.14, key3:0.14, key4:0.14,
  notify:0.24, success:0.28, error:0.24, whoosh:0.28, swipe:0.32, thunk:0.32, sub:0.32,
  riser:0.26, blip:0.16, latch:0.22 };

// per-frame cues, in FRAME-LOCAL seconds. Keyed by frame file name.
export const CUES = {
  "01-open": [["key1",0.5],["key2",0.59],["tick",0.62],["key3",0.68],["key4",0.77],["key1",0.86],["key2",0.95],["tick",1.94],["tick",3.26],["tick",4.58],["tick",5.9],["latch",6.14],["swipe",6.35],["notify",6.7],["swipe",7.3],["swipe",7.95],["latch",8.6]],
  "02-title": [["thunk",0.92],["latch",1.24],["click",1.44],["click",1.68],["blip",3.1]],
  "03-shelf": [["tick",0.8],["tick",0.93],["tick",1.06],["tick",1.19],["tick",1.32],["tick",1.45],["tick",1.58],["tick",1.71],["thunk",2.2],["click",2.6],["blip",2.7],["blip",3.03],["blip",3.36],["blip",3.69],["blip",4.02],["swipe",4.2],["blip",4.35],["blip",4.68],["blip",5.01],["blip",5.34],["swipe",5.6],["thunk",7.1],["click",7.42],["swipe",7.62]],
  "04-getbody": [["key1",0.42],["key2",0.59],["key3",0.76],["key4",0.93],["key1",1.1],["key2",1.27],["tick",1.6],["tick",2.22],["tick",2.84],["tick",3.46],["tick",4.08],["tick",4.7],["swipe",5.6],["swipe",7.0],["click",8.0],["thunk",9.2],["error",9.9]],
  "05-post": [["key1",0.4],["key2",0.56],["key3",0.72],["key4",0.88],["key1",1.04],["swipe",1.46],["tick",1.94],["tick",2.1],["tick",2.26],["tick",2.42],["tick",2.58],["swipe",3.1],["latch",3.7],["blip",4.7],["blip",6.0]],
  "06-notapparent": [["tick",0.36],["tick",0.5],["tick",0.64],["tick",0.78],["tick",0.92],["swipe",1.1],["latch",2.62],["latch",3.48],["latch",4.34],["swipe",5.9],["notify",6.6],["click",7.3]],
  "07-cost": [["tick",0.6],["tick",0.9],["blip",0.9],["tick",1.2],["latch",1.3],["tick",1.5],["latch",2.02],["blip",2.54],["swipe",3.6],["blip",4.18],["swipe",5.15],["blip",5.82],["swipe",6.7],["blip",7.46],["swipe",8.25],["blip",9.1],["swipe",10.0],["latch",10.74]],
  "08-slate": [["thunk",0.1],["latch",0.44],["click",0.72]],
  "09-query": [["swipe",0.9],["click",1.24],["blip",1.9],["tick",2.4],["tick",2.74],["tick",3.08],["tick",3.42],["latch",4.6],["swipe",4.86],["latch",6.1],["swipe",6.36],["swipe",6.9],["click",8.0],["latch",8.44]],
  "10-table": [["tick",0.36],["tick",0.5],["tick",0.64],["tick",0.9],["tick",1.68],["tick",2.46],["tick",3.24],["tick",4.02],["swipe",5.2],["swipe",6.1],["swipe",8.0],["click",9.1]],
  "11-cachekey": [["latch",0.4],["latch",0.82],["swipe",1.6],["tick",2.06],["swipe",2.5],["tick",2.96],["click",4.2],["swipe",4.9],["click",5.6],["notify",6.3],["success",7.3],["success",8.3]],
  "12-name": [["latch",0.5],["latch",0.84],["latch",1.18],["notify",3.3],["swipe",4.1],["click",4.8],["thunk",5.4],["thunk",6.38],["thunk",7.36],["success",8.9]],
  "13-catch": [["tick",0.44],["tick",0.74],["tick",1.04],["latch",2.4],["latch",3.26],["latch",4.12],["click",5.3],["swipe",5.9],["click",6.9],["tick",7.18],["tick",7.52],["tick",7.86]],
  "14-end": [["latch",1.1],["latch",2.6],["latch",4.1],["thunk",6.1],["success",7.4],["blip",8.1],["swipe",8.6]],
};
