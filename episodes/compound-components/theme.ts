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
  // Warm paper — retrospectives, "how we got here" history episodes.
  "warm-paper": { accent: "#E2703A", bg: "#12100E", bgDeep: "#0A0908", ink: "#F6EFE7", isDark: true, grade: "#241708" },
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
