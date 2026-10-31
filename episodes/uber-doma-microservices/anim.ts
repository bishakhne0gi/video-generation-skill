// Author: Bishakh
// Motion primitives. Keep easing math here so scenes stay about composition.
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

/**
 * GLOBAL TEMPO. Every reveal in the kit is scaled by this, so the whole film's
 * pace is one number.
 *
 * The failure this exists to prevent: a screen that spends four seconds
 * assembling itself and then sits frozen for two. The viewer reads a finished
 * screen in well under a second — they are waiting for you, and at 0:20 they
 * leave. Reveals should be finished BEFORE the narration reaches the thing they
 * reveal, not arriving alongside it.
 *
 * 1.0 = the old pace. 0.55 = the house pace. Below ~0.4 reveals stop reading as
 * motion and start reading as popping.
 */
export const PACE = 0.55;

/** Scale a frame count by the global tempo. Use for any hand-written delay. */
export const beat = (frames: number) => Math.max(1, Math.round(frames * PACE));

/**
 * Spring 0→1 starting `delay` frames into the current Sequence. Lower damping =
 * bouncier. Both the delay and the travel are PACE-scaled, so retuning the film
 * never means editing call sites.
 */
export const useAppear = (delay = 0, damping = 200) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: frame - beat(delay),
    fps,
    config: { damping },
    durationInFrames: beat(30),
  });
};

/**
 * Continuous, never-settling motion for a screen that has finished assembling.
 * A static frame reads as a stall even when the narration is still going — this
 * is the "something is always happening" layer. Deliberately sub-perceptual:
 * you should not be able to point at it, only notice its absence.
 *
 * `i` decorrelates instances so a grid of cards doesn't move as one slab.
 */
export const useAlive = (i = 0, amp = 1) => {
  const frame = useCurrentFrame();
  const ph = rand(i + 1) * Math.PI * 2;
  const x = Math.sin(frame * 0.021 + ph) * 1.7 * amp;
  const y = Math.cos(frame * 0.016 + ph * 1.3) * 2.4 * amp;
  const s = 1 + Math.sin(frame * 0.011 + ph) * 0.0024 * amp;
  return { transform: `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${s.toFixed(5)})` };
};

/**
 * Scale factor vs the design grid — every size in the kit is `n * k`.
 *
 * The grid is 1920 wide in landscape and 1080 wide in portrait. Without the
 * portrait case, a 9:16 cut scales everything by 1080/1920 = 0.56: the content
 * shrinks to just over half size while the frame gets TALLER, so every beat
 * reads as a thin stranded band. Rows still need stacking by hand, but this is
 * what stops the vertical cut looking broken by default.
 */
export const useK = () => {
  const { width, height } = useVideoConfig();
  return width / (height > width ? 1080 : 1920);
};

/** True in the 9:16 cut. Branch layout (row → column) on this, not on width. */
export const usePortrait = () => {
  const { width, height } = useVideoConfig();
  return height > width;
};

/** Fade in/out window inside a scene of `dur` frames. */
export const fadeWindow = (frame: number, dur: number, hold = 12) =>
  frame < hold ? frame / hold : frame > dur - hold ? Math.max(0, (dur - frame) / hold) : 1;

/** Deterministic pseudo-random — Math.random() breaks Remotion's frame purity. */
export const rand = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** Slow drifting float for particles/cards. */
export const drift = (frame: number, i: number, amp = 14, speed = 0.02) =>
  Math.sin(frame * speed + rand(i) * Math.PI * 2) * amp;

/** Ken Burns push on footage: scale 1→`to` across the clip, with a tiny pan. */
export const useKenBurns = (dur: number, to = 1.08, panX = 0, panY = 0) => {
  const frame = useCurrentFrame();
  const t = clamp01(frame / Math.max(1, dur));
  return { transform: `scale(${lerp(1, to, t)}) translate(${lerp(0, panX, t)}%, ${lerp(0, panY, t)}%)` };
};

/**
 * Type-on reveal: how many characters of `text` are visible at this frame.
 * 55 cps is faster than a person types and that is the point — the viewer needs
 * to READ the command, not watch it being entered.
 */
export const useTyped = (text: string, start = 7, cps = 55) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = Math.max(0, Math.floor(((frame - start) / fps) * cps));
  return { text: text.slice(0, n), done: n >= text.length };
};

/** Truncate at a word boundary. */
export const clip = (s: string, n: number) => {
  s = (s || "").trim();
  return s.length <= n ? s : s.slice(0, n).replace(/\s+\S*$/, "") + "…";
};

/** Split a phrase so one word can be set as the italic serif accent. */
export const splitAccent = (text: string, accentWord?: string) => {
  if (accentWord && text.includes(accentWord)) {
    const i = text.indexOf(accentWord);
    return { pre: text.slice(0, i), accent: accentWord, post: text.slice(i + accentWord.length) };
  }
  return { pre: text, accent: "", post: "" };
};

/** Animate "1.2M" / "300+" / "99.9%" from 0 → value as `a` goes 0→1. */
export const counter = (value: string, a: number) => {
  const m = String(value).match(/^([^\d-]*)(-?[\d,.]+)(.*)$/);
  if (!m) return value;
  const target = parseFloat(m[2].replace(/,/g, ""));
  const decimals = (m[2].split(".")[1] || "").length;
  const cur = target * clamp01(a);
  const num = decimals ? cur.toFixed(decimals) : Math.round(cur).toLocaleString();
  return `${m[1]}${num}${m[3]}`;
};

/** 8-frame decaying shake — the stamp-slam / impact accent. */
export const shake = (frame: number, start: number, amp = 10) => {
  const d = frame - start;
  if (d < 0 || d > 8) return 0;
  return Math.sin(d * 2.4) * amp * (1 - d / 8);
};

export { interpolate };
