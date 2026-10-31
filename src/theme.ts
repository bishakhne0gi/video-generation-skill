// Author: Bishakh
//
// Episode palettes. An episode picks ONE theme name in episode.config.json and
// every primitive inherits it, so the playlist stays visually coherent while
// each episode still gets its own accent.

export type Palette = {
  accent: string; accent2: string; accentSoft: string;
  ink: string; bg: string; bgDeep: string; surface: string; surfaceMid: string;
  border: string; borderMid: string; textBody: string; textMuted: string;
  isDark: boolean; radius: number;
  /** Multiply-friendly tint laid over Kling footage so it belongs to the episode. */
  grade: string;
};

const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
const hexToRgb = (h: string) => {
  const m = (h || "").replace("#", "").match(/.{1,2}/g);
  if (!m || m.length < 3) return [73, 64, 255];
  return m.slice(0, 3).map((x) => parseInt(x.length === 1 ? x + x : x, 16));
};
const rgbToHex = (r: number, g: number, b: number) =>
  "#" + [r, g, b].map((x) => clamp(x).toString(16).padStart(2, "0")).join("");
export const mix = (a: string, b: string, t: number) => {
  const A = hexToRgb(a), B = hexToRgb(b);
  return rgbToHex(A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t);
};
/** `${pal.accent}${alpha(0.14)}` — 8-digit hex opacity without rgba() string math. */
export const alpha = (a: number) => Math.round(Math.max(0, Math.min(1, a)) * 255).toString(16).padStart(2, "0");

type Preset = { accent: string; bg: string; bgDeep?: string; ink: string; isDark: boolean; grade?: string };

export const THEMES: Record<string, Preset> = {
  // Default for the tech playlist: near-black, cyan-electric accent, footage
  // graded cool. Reads as "engineering", not "marketing".
  "terminal-dark": { accent: "#4DE1C1", bg: "#080B10", bgDeep: "#04060A", ink: "#EAF2F7", isDark: true, grade: "#0A1A24" },
  // Editorial daylight — for explainer / concept episodes.
  "white-light": { accent: "#339989", bg: "#FFFAFB", bgDeep: "#F0ECED", ink: "#131515", isDark: false, grade: "#DFF5F0" },
  // High-contrast synth for hype / launch episodes.
  "neon-grid": { accent: "#FF4D8D", bg: "#0A0713", bgDeep: "#05030B", ink: "#F6EEFF", isDark: true, grade: "#1A0A22" },
  // EP09 — Uber's own brand system (base.uber.com): true black, white ink, the
  // one blue accent. Uber Move is proprietary, so the face is a stand-in; the
  // colour is exact.
  "uber-dark": { accent: "#276EF1", bg: "#000000", bgDeep: "#000000", ink: "#FFFFFF", isDark: true, grade: "#0A1020" },
  // EP10 — Zomato brand red on the cream field of the reference piece
  // (references/ep10-inspo/). "Cranberry" #E23744 is exact, Pantone Red 032 C,
  // and matches the fill in their own wordmark SVG. The ink is #1C1C1C, not
  // black: every shape in this style carries a stroke, and true black strokes
  // read as harsh against cream. Footage, if any, grades red so it can sit
  // inside an outlined card without looking like a different film.
  "zomato-cream": { accent: "#E23744", bg: "#F7F4EF", bgDeep: "#EFEAE2", ink: "#1C1C1C", isDark: false, grade: "#E9D9D2" },
  // CosX MARS — the workspace-register launch film. A warm near-white field
  // (paper, not screen) so the artifact inside the app window is the only
  // saturated thing on frame, and Mars rust as the one accent. #C1440E is the
  // iron-oxide red of the planet's surface rather than a brand guess, and it
  // sits close enough to the cursor coral that the whole cast reads as one
  // system instead of a colour wheel.
  "mars-cream": { accent: "#C1440E", bg: "#F7F4EE", bgDeep: "#E9E2D6", ink: "#191714", isDark: false, grade: "#E8D5C4" },
  // EP15 — the DESIGN.md system. White canvas, deep navy ink (#0d253d, never
  // black), and ONE saturated hue: indigo #533afd, which is a CTA and an accent
  // and nothing else. Ruby and magenta exist in this brand but only inside the
  // gradient mesh, so they live in lib/gradient.tsx rather than here — putting
  // them in the palette is how they end up on a button.
  //
  // `bgDeep` is the cool-tinted off-white DESIGN.md calls canvas-soft, used on
  // the feature bands under the hero rather than as a darker background.
  "stripe-mesh": { accent: "#533AFD", bg: "#FFFFFF", bgDeep: "#F6F9FC", ink: "#0D253D", isDark: false, grade: "#E7E3FF" },
  // EP19 — the FERRARI EDITORIAL system, from the director's supplied extract
  // (references/ferrari-editorial.md). Near-black #181818 that is deliberately
  // NOT pure black — it carries a slight warmth, and #000 anywhere reads as a
  // different, cheaper system immediately. Rosso Corsa #da291c is the single
  // brand voltage and is used SCARCELY: primary CTAs, the mark, race-position
  // highlights. In this film that is three livery bands and one hero number.
  //
  // `bgDeep` is canvas-elevated #303030 — the brightness STEP that replaces
  // drop shadows entirely. This system documents no shadow tiers: depth is
  // photography plus a brightness step plus a 1px hairline, and the hairline is
  // the same #303030 as the elevated surface.
  //
  // The grade is a deep oxblood rather than a red: Kling plates graded toward
  // #da291c itself would put the scarce accent across whole frames of footage,
  // which is the one thing the system says not to do.
  "ferrari": { accent: "#DA291C", bg: "#181818", bgDeep: "#303030", ink: "#FFFFFF", isDark: true, grade: "#1A0705" },
  // Warm paper — retrospectives, "how we got here" history episodes.
  "warm-paper": { accent: "#E2703A", bg: "#12100E", bgDeep: "#0A0908", ink: "#F6EFE7", isDark: true, grade: "#241708" },
  // EP17 — VectorDrop's own dark mode, straight out of its DESIGN.md rather
  // than picked by eye. `#161516` is the page ground and `#0D0D0D` the panel;
  // teal #14B8A6 is the accent, and #0D9488 is DEMOTED to hover in dark mode,
  // which is why it lives in the gradient and never as a flat fill here. Text
  // is pure #FFFFFF in dark mode (light mode's green-tinted near-black is the
  // variant, not this). Cyan #0891B2 exists ONLY inside gradients.
  "vectordrop": { accent: "#14B8A6", bg: "#161516", bgDeep: "#0D0D0D", ink: "#FFFFFF", isDark: true, grade: "#06302C" },
};

export function buildPalette(nameOrTokens: string | Partial<Preset> = "terminal-dark"): Palette {
  const t: Preset = typeof nameOrTokens === "string"
    ? THEMES[nameOrTokens] || THEMES["terminal-dark"]
    : { ...THEMES["terminal-dark"], ...nameOrTokens } as Preset;

  const { accent, bg, ink, isDark } = t;
  const lift = isDark ? "#FFFFFF" : "#0C1927";
  return {
    accent,
    accent2: mix(accent, isDark ? "#FFFFFF" : "#000000", 0.3),
    accentSoft: mix(accent, bg, 0.82),
    ink,
    bg,
    bgDeep: t.bgDeep || mix(bg, "#000000", 0.4),
    surface: mix(bg, lift, isDark ? 0.06 : 0.03),
    surfaceMid: mix(bg, lift, isDark ? 0.11 : 0.06),
    border: mix(bg, lift, isDark ? 0.16 : 0.1),
    borderMid: mix(bg, lift, isDark ? 0.28 : 0.18),
    textBody: mix(ink, bg, 0.25),
    textMuted: mix(ink, bg, 0.5),
    isDark,
    radius: 18,
    grade: t.grade || mix(accent, "#000000", 0.7),
  };
}
