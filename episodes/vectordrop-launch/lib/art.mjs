// The traced artwork, straight out of the product's own pipeline.
// rocket.svg was produced by running lib/conversion/{quantize,maskTrace,assembleSvg}
// from the VectorDrop repo over assets/demo/elon.jpg at the app's default
// colourCount of 32 — the same code path the live conversion takes. 31 paths.
import { readFileSync } from "node:fs";

const raw = readFileSync(new URL("../assets/app/rocket.svg", import.meta.url), "utf8");

const all = [...raw.matchAll(/<path\s+fill="([^"]+)"([^>]*?)d="([^"]+)"/g)]
  .map((m) => ({ fill: m[1], d: m[3] }));

// 31 <path> elements: the white ground the assembler always writes, then 30
// traced colour clusters. The editor's status bar counts all 31 and names them
// path-1..path-31, so the film uses 31 too — the number on screen in the film
// must be the number on screen in the product.
export const BG = all[0];
export const PATHS = all;                       // all 31, ground first
export const TRACED = all.slice(1);             // the 30 colour clusters
export const VIEWBOX = "0 0 400 400";

// The assembler stacks clusters dark -> light, so drawing them in document
// order IS drawing them dark to light. The film says that out loud, so it had
// better be true — assert it rather than trust the comment.
const lum = ({ fill }) => {
  const [r, g, b] = fill.length === 4
    ? [...fill.slice(1)].map((c) => parseInt(c + c, 16))
    : [1, 3, 5].map((i) => parseInt(fill.slice(i, i + 2), 16));
  return 0.299 * r + 0.587 * g + 0.114 * b;
};
export const LUMS = TRACED.map(lum);
export const MONOTONIC_DARK_TO_LIGHT =
  LUMS.every((v, i) => i === 0 || v >= LUMS[i - 1] - 12);

// `id` lets a frame address one layer; `upto` renders only the first n.
export const artSVG = (id, { upto = PATHS.length, extra = "" } = {}) =>
  `<svg id="${id}" viewBox="${VIEWBOX}" xmlns="http://www.w3.org/2000/svg" ${extra}>
${PATHS.slice(0, upto).map((p, i) =>
  `      <path id="${id}-p${i}" fill="${p.fill}" fill-rule="evenodd" d="${p.d}"/>`).join("\n")}
    </svg>`;

// The editor's three adjustment modes, applied to the real fills so the film
// shows what the product would actually output rather than a CSS filter over
// a picture of it. Grayscale is Rec.601 luma; black-and-white is the same
// threshold the B&W slider applies.
const chan = (fill) => fill.length === 4
  ? [...fill.slice(1)].map((c) => parseInt(c + c, 16))
  : [1, 3, 5].map((i) => parseInt(fill.slice(i, i + 2), 16));
const hex = (r, g, b) => "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");

export const grayFill = (fill) => { const [r, g, b] = chan(fill); const y = 0.299*r + 0.587*g + 0.114*b; return hex(y, y, y); };
export const bwFill = (fill, t = 0.5) => { const [r, g, b] = chan(fill); return (0.299*r + 0.587*g + 0.114*b) / 255 > t ? "#ffffff" : "#111111"; };

export const artSVGmode = (id, mode, opts = {}) => {
  const f = mode === "gray" ? grayFill : mode === "bw" ? ((x) => bwFill(x, opts.t ?? 0.5)) : ((x) => x);
  return `<svg id="${id}" viewBox="${VIEWBOX}" xmlns="http://www.w3.org/2000/svg" ${opts.extra ?? ""}>
${PATHS.map((p, i) => `      <path id="${id}-p${i}" fill="${f(p.fill)}" fill-rule="evenodd" d="${p.d}"/>`).join("\n")}
    </svg>`;
};

// The trace stage, drawn as outlines: the same 31 path shapes with no fill.
// This is literally what potrace hands back before assembleSvg stacks the
// colours onto it, so the pipeline beat can show the real intermediate.
export const artOutline = (id, opts = {}) =>
  `<svg id="${id}" viewBox="${VIEWBOX}" xmlns="http://www.w3.org/2000/svg" ${opts.extra ?? ""}>
      <rect width="400" height="400" fill="#fff"/>
${TRACED.map((p, i) => `      <path fill="none" stroke="#1b1b1b" stroke-width="0.5" d="${p.d}"/>`).join("\n")}
    </svg>`;

// Real anchor positions along a traced path, so the node-edit beat shows the
// actual control points of the actual curve rather than a scatter of dots.
// Handles the subset of the path grammar SVGO emits for potrace output.
export const anchors = (d, step = 9) => {
  const toks = d.match(/[MmLlHhVvCcSsQqTtAaZz]|-?\d*\.?\d+(?:e-?\d+)?/g) || [];
  let i = 0, x = 0, y = 0, sx = 0, sy = 0, cmd = "M";
  const pts = [];
  const num = () => parseFloat(toks[i++]);
  while (i < toks.length) {
    if (/[A-Za-z]/.test(toks[i])) cmd = toks[i++];
    if (i >= toks.length) break;
    const rel = cmd === cmd.toLowerCase();
    switch (cmd.toUpperCase()) {
      case "M": { const a = num(), b = num(); x = rel ? x + a : a; y = rel ? y + b : b; sx = x; sy = y; cmd = rel ? "l" : "L"; break; }
      case "L": { const a = num(), b = num(); x = rel ? x + a : a; y = rel ? y + b : b; break; }
      case "H": { const a = num(); x = rel ? x + a : a; break; }
      case "V": { const a = num(); y = rel ? y + a : a; break; }
      case "C": { num(); num(); num(); num(); const a = num(), b = num(); x = rel ? x + a : a; y = rel ? y + b : b; break; }
      case "S": case "Q": { num(); num(); const a = num(), b = num(); x = rel ? x + a : a; y = rel ? y + b : b; break; }
      case "T": { const a = num(), b = num(); x = rel ? x + a : a; y = rel ? y + b : b; break; }
      case "A": { num(); num(); num(); num(); num(); const a = num(), b = num(); x = rel ? x + a : a; y = rel ? y + b : b; break; }
      case "Z": x = sx; y = sy; continue;
      default: i++; continue;
    }
    pts.push([+x.toFixed(1), +y.toFixed(1)]);
  }
  return pts.filter((_, k) => k % step === 0);
};
