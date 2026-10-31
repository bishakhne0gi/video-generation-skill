// Both halves of every cut are authored inside the frames. Every seam cuts
// mid-motion on BOTH sides — exit power4.in, entry power4.out, entry travel
// ~127% of exit travel. A cut where either side is at rest reads as a slide
// change, which is the single loudest amateur note in a launch film.

const EXIT = 0.32, ENTRY = 0.42;

// ACROSS — the house current is LEFT. The ordinary leg.
export const acrossIn  = (sel = "#stage") =>
  `      tl.fromTo("${sel}", { x: 300 }, { x: 0, duration: ${ENTRY}, ease: "power4.out" }, 0);`;
export const acrossOut = (sel, len) =>
  `      tl.to("${sel}", { x: -236, duration: ${EXIT}, ease: "power4.in" }, ${(len - EXIT).toFixed(3)});`;

// LIFT — act breaks only. The camera steps up and over.
export const liftIn  = (sel = "#stage") =>
  `      tl.fromTo("${sel}", { y: 250, scale: 0.94 }, { y: 0, scale: 1, duration: 0.60, ease: "power4.out" }, 0);`;
export const liftOut = (sel, len) =>
  `      tl.to("${sel}", { y: -197, scale: 0.92, duration: 0.48, ease: "power4.in" }, ${(len - 0.48).toFixed(3)});`;

// Z-FORWARD — deeper into the same thought. Outgoing pushes IN, so the incoming
// half must ALSO push in: it enters BELOW 1.0 and grows. Both scale velocities
// positive, or the seam reads as a bounce.
export const zInIn  = (sel = "#stage") =>
  `      tl.fromTo("${sel}", { scale: 0.82 }, { scale: 1, duration: 0.46, ease: "power4.out" }, 0);`;
export const zInOut = (sel, len) =>
  `      tl.to("${sel}", { scale: 1.15, duration: 0.34, ease: "power4.in" }, ${(len - 0.34).toFixed(3)});`;

// Z-BACK — THE ARRIVAL. Spent exactly once, on the cut into the product, where
// it lands together with the film's one value flip from near-black to white.
// Outgoing recedes, so the incoming half enters from ABOVE 1.0 and settles.
export const zBackIn  = (sel = "#stage") =>
  `      tl.fromTo("${sel}", { scale: 1.18 }, { scale: 1, duration: 0.48, ease: "power4.out" }, 0);`;
export const zBackOut = (sel, len) =>
  `      tl.to("${sel}", { scale: 0.86, duration: 0.36, ease: "power4.in" }, ${(len - 0.36).toFixed(3)});`;

// UP — elevation into the conclusion. Spent once, into the end card.
export const upIn  = (sel = "#stage") =>
  `      tl.fromTo("${sel}", { y: 267 }, { y: 0, duration: ${ENTRY}, ease: "power4.out" }, 0);`;
export const upOut = (sel, len) =>
  `      tl.to("${sel}", { y: -210, duration: ${EXIT}, ease: "power4.in" }, ${(len - EXIT).toFixed(3)});`;

// The ledger the cue layer reads. One entry per CUT, so there are five for six
// frames. Four kinds, one of them (zback) an accent spent once.
export const SEAMS = [
  { i: 0, kind: "zin"   },   // prompt → image: deeper into the same thought
  { i: 1, kind: "lift"  },   // image  → post:  act break
  { i: 2, kind: "zback" },   // post   → fix:   THE ARRIVAL (+ the value flip)
  { i: 3, kind: "across"},   // fix    → clean
  { i: 4, kind: "up"    },   // clean  → end
];

const IN  = { across: acrossIn,  lift: liftIn,  zin: zInIn,  zback: zBackIn,  up: upIn  };
const OUT = { across: acrossOut, lift: liftOut, zin: zInOut, zback: zBackOut, up: upOut };

// Frame i enters on the seam that PRECEDES it and exits on the one that follows.
export const enterOf = (i) => (i === 0 ? "" : IN[SEAMS[i - 1].kind]());
export const exitOf  = (i, len) => {
  const s = SEAMS[i];
  return s ? OUT[s.kind]("#stage", len) : "";
};
