// Both halves of every cut are authored inside the frames. The transition
// injector is not used: it extends the OUTGOING frame and holds its final frame
// across the overlap, which is a frozen exit.
//
// Every seam cuts mid-motion on both sides — exit power4.in, entry power4.out,
// entry travel ~127% of exit travel. A cut where either side is at rest reads
// as a slide change.

const EXIT = 0.34, ENTRY = 0.43;

// ACROSS — the house current is LEFT. Most legs.
export const acrossIn  = (sel) =>
  `      tl.fromTo("${sel}", { x: 300 }, { x: 0, duration: ${ENTRY}, ease: "power4.out" }, 0);`;
export const acrossOut = (sel, len) =>
  `      tl.to("${sel}", { x: -236, duration: ${EXIT}, ease: "power4.in" }, ${(len - EXIT).toFixed(3)});`;

// LIFT — act breaks only. The camera steps up and over. Spending it on an
// ordinary beat means it says nothing when the act actually changes.
export const liftIn  = (sel) =>
  `      tl.fromTo("${sel}", { y: 250, scale: 0.94 }, { y: 0, scale: 1, duration: 0.62, ease: "power4.out" }, 0);`;
export const liftOut = (sel, len) =>
  `      tl.to("${sel}", { y: -197, scale: 0.92, duration: 0.50, ease: "power4.in" }, ${(len - 0.50).toFixed(3)});`;

// Z-FORWARD — deeper into the same thought. Outgoing pushes IN, so the incoming
// half must ALSO be pushing in: it enters from BELOW 1.0 and grows. Both scale
// velocities positive, or the seam reads as a bounce.
export const zInIn  = (sel) =>
  `      tl.fromTo("${sel}", { scale: 0.80 }, { scale: 1, duration: 0.46, ease: "power4.out" }, 0);`;
export const zInOut = (sel, len) =>
  `      tl.to("${sel}", { scale: 1.16, duration: 0.36, ease: "power4.in" }, ${(len - 0.36).toFixed(3)});`;

// Z-BACK — the ARRIVAL, the thesis landing. Reserved; spent ONCE, on the seam
// into "the sole is the most important piece". Outgoing recedes, so the
// incoming half enters from ABOVE 1.0 and settles.
export const zBackIn  = (sel) =>
  `      tl.fromTo("${sel}", { scale: 1.18 }, { scale: 1, duration: 0.46, ease: "power4.out" }, 0);`;
export const zBackOut = (sel, len) =>
  `      tl.to("${sel}", { scale: 0.86, duration: 0.36, ease: "power4.in" }, ${(len - 0.36).toFixed(3)});`;

// UP — elevation into the conclusion. Spent once, into the end card.
export const upIn  = (sel) =>
  `      tl.fromTo("${sel}", { y: 267 }, { y: 0, duration: ${ENTRY}, ease: "power4.out" }, 0);`;
export const upOut = (sel, len) =>
  `      tl.to("${sel}", { y: -210, duration: ${EXIT}, ease: "power4.in" }, ${(len - EXIT).toFixed(3)});`;

// The ledger the seam gate reads. `carrier` must name the element that actually
// MOVES — where the painted ground is full-bleed it is the content, not the
// stage, and pointing the gate at a static wrapper makes it correctly report no
// motion.
//
// Reserved vectors are spent three times in the whole film: zin once (into the
// brand), zback once (the arrival), up once (into the sign-off). Everything
// else is the house pair.
export const SEAMS = [
  { i:  0, kind: "zin",    carrier: "#stg0" },  // open  -> title
  { i:  1, kind: "lift",   carrier: "#stg1" },  // title -> ask     ACT 0→1
  { i:  2, kind: "across", carrier: "#stg2" },  // ask   -> tie
  { i:  3, kind: "across", carrier: "#stg3" },  // tie   -> spec
  { i:  4, kind: "across", carrier: "#stg4" },  // spec  -> rank
  { i:  5, kind: "lift",   carrier: "#stg5" },  // rank  -> base    ACT 1→2
  { i:  6, kind: "across", carrier: "#stg6" },  // base  -> plan
  { i:  7, kind: "across", carrier: "#stg7" },  // plan  -> sheet
  { i:  8, kind: "lift",   carrier: "#stg8" },  // sheet -> stl     ACT 2→3
  { i:  9, kind: "across", carrier: "#stg9" },  // stl   -> found
  { i: 10, kind: "lift",   carrier: "#stg10" },  // found -> sole    ACT 3→4
  { i: 11, kind: "across", carrier: "#stg11" },  // sole  -> hit
  { i: 12, kind: "zback",  carrier: "#stg12" },  // hit   -> why     THE ARRIVAL
  { i: 13, kind: "lift",   carrier: "#stg13" },  // why   -> rest    ACT 4→5
  { i: 14, kind: "up",     carrier: "#stg14" },  // rest  -> end
];

const IN  = { across: acrossIn,  lift: liftIn,  zin: zInIn,  zback: zBackIn,  up: upIn  };
const OUT = { across: acrossOut, lift: liftOut, zin: zInOut, zback: zBackOut, up: upOut };

// Frame i enters on the seam that PRECEDES it and exits on the one that follows.
export const enterOf = (i) => (i === 0 ? "" : IN[SEAMS[i - 1].kind](`#stg${i}`));
export const exitOf  = (i, len) => {
  const s = SEAMS[i];
  return s ? OUT[s.kind](`#stg${i}`, len) : "";
};
