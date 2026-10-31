// The film's hero geometry. NONE of it is drawn by hand.
//
// `assets/data/last-525512275.json` is the output of running the product's own
// shipped instrument — `sanghavi_lasts.featherline.extract_featherline` — over
// `stls/525512275-42-WO.stl`, a real Sanghavi last, plus
// `sole_spec.inset_contour` at the shipped allowances (1.5mm sides / 2mm ends)
// to produce the matching sole outline, plus `build_signatures` to reduce both
// to the 40-station bottom signature the matcher actually compares.
//
// So every curve below is the last itself, addressable point by point: 256
// featherline points, 256 sole points, 40 stations. That is what lets a beat
// draw the outline progressively, overlay the sole on it, and light one station
// at a time — none of which a screenshot could do.
import geo from "../assets/data/last-525512275.json" with { type: "json" };
import { T } from "./frame.mjs";

export const GEO = geo;
export const VB = geo.viewBox;                    // [0,0,1200,405.09]
export const P = geo.params;

// A partial path: the first `frac` of the 256 featherline points. Used to draw
// the outline on progressively — a real curve arriving, not a fade.
const pts = (d) => d.trim().replace(/^M/, "").replace(/ Z$/, "").split(/[ML]/).filter(Boolean);

export const partial = (d, frac) => {
  const p = pts(d);
  const n = Math.max(2, Math.round(p.length * frac));
  return "M" + p.slice(0, n).join(" L");
};

// The outline, drawn as a stack of N progressively longer paths, cross-faded
// one to the next. This runtime ships no DrawSVG plugin and cannot animate
// stroke-dashoffset, so a growing curve has to be built out of frames — and
// stacked opacity toggles are seek-safe, which a scripted redraw would not be.
export const drawnPath = (id, d, steps = 26, opt = {}) =>
  Array.from({ length: steps }, (_, i) =>
    `<path data-s="${i}" d="${partial(d, (i + 1) / steps)}" fill="none"
        stroke="${opt.stroke ?? T.title}" stroke-width="${opt.w ?? 2.4}"
        stroke-linecap="round" stroke-linejoin="round" opacity="0"/>`
  ).join("\n        ");

export const drawRun = (sel, steps, at, dur) => {
  const step = dur / steps;
  let out = "";
  for (let i = 0; i < steps; i++) {
    const t = at + i * step;
    out += `      tl.set("${sel} [data-s='${i}']", { autoAlpha: 1 }, ${t.toFixed(3)});\n`;
    if (i > 0) out += `      tl.set("${sel} [data-s='${i - 1}']", { autoAlpha: 0 }, ${t.toFixed(3)});\n`;
  }
  return out;
};

// The whole featherline as one closed path — the finished outline.
export const featherPath = (opt = {}) =>
  `<path id="${opt.id ?? "feather"}" d="${geo.featherPath}" fill="${opt.fill ?? "none"}"
        stroke="${opt.stroke ?? T.title}" stroke-width="${opt.w ?? 2.4}"
        stroke-linejoin="round"/>`;

// The sole: the same curve dilated outward by the Sanghavi edge allowance.
// This is literally what a trimmed outsole is, and the film overlays the two.
export const solePath = (opt = {}) =>
  `<path id="${opt.id ?? "sole"}" d="${geo.solePath}" fill="${opt.fill ?? "none"}"
        stroke="${opt.stroke ?? T.accent}" stroke-width="${opt.w ?? 2.4}"
        stroke-dasharray="${opt.dash ?? "none"}" stroke-linejoin="round"/>`;

// The side profile — the featherline's height above the contact plane along the
// length. This is `zProf`, the half of the signature that discriminates
// hardest: calibrated on same-model siblings it separates true siblings from
// random pairs by 5.5x (docs/MATCHING_EXPLAINER.md §3).
export const profilePath = (opt = {}) =>
  `<polyline id="${opt.id ?? "prof"}" points="${geo.profilePoints.join(" ")}" fill="none"
        stroke="${opt.stroke ?? T.accent6}" stroke-width="${opt.w ?? 2.4}"
        stroke-linecap="round" stroke-linejoin="round"/>`;

// The 40-station signature, drawn as the matcher stores it: half-widths either
// side of the midline, divided by ball width, so size drops out entirely.
export const stations = (id, opt = {}) => {
  const { hwPlus, hwMinus } = geo.sig;
  const n = hwPlus.length;
  const w = opt.w ?? 1200, mid = opt.mid ?? 150, gap = w / n;
  const k = opt.k ?? 240;   // scale-free values -> pixels
  return hwPlus.map((p, i) => {
    const m = hwMinus[i];
    if (p == null || m == null) return "";
    const x = i * gap + gap / 2;
    const up = p * k, dn = m * k;
    return `<rect data-st="${i}" x="${(x - gap * 0.30).toFixed(1)}" y="${(mid - up).toFixed(1)}"
        width="${(gap * 0.60).toFixed(1)}" height="${(up + dn).toFixed(1)}"
        fill="${opt.fill ?? T.accent}" opacity="0"/>`;
  }).join("\n        ");
};

export const stationsRun = (sel, at, dur, n = 40) => {
  const step = dur / n;
  let out = "";
  for (let i = 0; i < n; i++)
    out += `      tl.to("${sel} [data-st='${i}']", { autoAlpha: ${(0.30 + 0.55 * (i % 3 === 0 ? 1 : 0.6)).toFixed(2)}, duration: 0.20, ease: "power2.out" }, ${(at + i * step).toFixed(3)});\n`;
  return out;
};

// A stylised last silhouette for the title card, built from the REAL outline
// rather than an invented blob — the same curve, filled.
export const lastFill = (opt = {}) =>
  `<path d="${geo.featherPath}" fill="${opt.fill ?? T.accent}" opacity="${opt.o ?? 0.10}"/>`;
