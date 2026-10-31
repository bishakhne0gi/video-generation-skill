// The cue layer. Three rules: every cue is attached to something that MOVES, nothing
// competes with the voice (0.18-0.46), and silence is a cue too — the soft seams are
// deliberately left unsounded, because a whoosh on a dissolve says "something moved"
// while the picture says "time passed".
export const SEAM = { across: "whoosh", lift: "riser", zback: "sub" };

// per-frame cues, in FRAME-LOCAL seconds. Keyed by frame id.
export const CUES = {
  "01-open":   [["click",7.42],["success",7.62],["tick",0.24],["tick",0.33],["tick",0.42],["tick",0.51],["tick",0.60],
                ["latch",1.42],["latch",3.10],["notify",3.70],
                ["click",4.80],["click",5.42],["click",6.04],["click",6.66]],
  "02-title":  [["thunk",0.52],["latch",0.86]],
  "03-dist":   [["tick",6.30],["tick",7.08],["tick",7.86],["tick",8.64],["latch",9.42],["tick",2.30],["tick",3.20],["swipe",4.30],["notify",5.30]],
  "04-lcp":    [["latch",6.30],["swipe",6.90],["success",8.50],["tick",1.30],["latch",1.72],["swipe",3.30],["notify",4.16]],
  "05-cls":    [["latch",6.40],["thunk",6.90],["click",8.90],["success",9.10],["tick",0.72],["thunk",3.20],["click",3.42],["notify",4.30]],
  "06-inp":    [["latch",6.90],["click",7.30],["success",7.52],["click",1.40],["blip",3.94],["notify",4.10],["tick",5.00],["tick",5.52],["tick",6.04]],
  "07-path":   [["latch",6.30],["tick",6.60],["tick",6.70],["tick",6.80],["tick",6.90],["success",7.90],["tick",0.90],["tick",1.28],["tick",1.74],["tick",2.16],["latch",3.42],["notify",5.30]],
  "08-fonts":  [["latch",6.10],["error",7.70],["success",8.36],["key1",0.50],["key2",0.66],["key3",0.82],["key4",0.98],["key1",1.14],
                ["tick",1.30],["tick",2.40],["latch",3.50],["notify",4.70]],
  "09-images": [["latch",6.30],["tick",6.60],["tick",7.34],["tick",8.08],["success",8.82],["tick",0.90],["tick",1.36],["latch",1.82],["swipe",3.60],["key1",4.62],["key2",4.92],["key3",5.22]],
  "10-bundle": [["latch",6.10],["thunk",6.50],["success",8.40],["thunk",1.60],["tick",3.30],["tick",3.70],["tick",4.10],["tick",4.50],["notify",5.30]],
  "11-render": [["swipe",4.60],["latch",6.60],["notify",7.95],["tick",0.80],["tick",1.42],["tick",2.04],["latch",2.66],["notify",3.90]],
  "12-hydrate":[["latch",6.30],["blip",7.30],["blip",7.60],["blip",7.90],["success",8.20],["tick",0.70],["blip",1.80],["success",5.52],["notify",5.60]],
  "13-thread": [["tick",6.10],["click",7.00],["click",7.94],["click",8.88],["success",8.90],["latch",1.02],["error",2.02],["tick",3.40],["tick",3.70],["tick",4.00],["success",4.90]],
  "14-paint":  [["tick",6.20],["tick",6.86],["tick",7.52],["success",8.18],["tick",0.24],["tick",0.44],["tick",0.64],["tick",0.84],
                ["blip",2.10],["blip",2.72],["blip",3.34],["latch",5.40]],
  "15-cache":  [["latch",6.10],["thunk",6.60],["thunk",7.58],["success",8.56],["tick",0.40],["thunk",2.00],["latch",2.90],["success",4.40]],
  "16-third":  [["latch",5.60],["swipe",6.30],["swipe",7.12],["swipe",7.94],["success",8.76],["tick",0.72],["tick",1.12],["tick",1.52],["tick",1.92],["tick",2.32],
                ["notify",3.20],["swipe",4.20]],
  "17-field":  [["latch",6.60],["blip",7.30],["success",7.40],["tick",0.60],["tick",1.06],["tick",1.52],["tick",1.98],["tick",2.44],
                ["latch",2.90],["error",4.70]],
  "18-end":    [["tick",2.10],["tick",2.58],["tick",3.06],["tick",3.54],["tick",4.02],["latch",4.80],["thunk",0.18],["latch",0.40],["success",2.30]],
};

export const GAIN = { tick:0.22, click:0.30, blip:0.26, latch:0.30, thunk:0.40, whoosh:0.34,
  swipe:0.30, riser:0.32, sub:0.36, notify:0.34, success:0.40, error:0.32,
  key1:0.20, key2:0.20, key3:0.20, key4:0.20 };
