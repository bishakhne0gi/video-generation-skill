// Author: Bishakh
//
// The transition system. This is where "the animation felt off" gets fixed.
//
// Four rules that do most of the work:
//  1. Scenes OVERLAP. The incoming scene animates over the outgoing one for the
//     length of its transition — a hard cut between two fades reads as amateur.
//  2. Every transition is DRIVEN BY A SPRING, not a linear interpolate. Linear
//     motion is the single biggest tell of template motion graphics.
//  3. Movement carries THROUGH the cut. If the outgoing scene is drifting left,
//     the incoming one enters from the right at the same velocity.
//  4. THE FRAME IS LOCKED unless you unlock it. A film where every beat pans or
//     pushes reads as a slideshow with a Ken Burns filter on it, no matter how
//     good the individual screens are — the eye reads the constant drift as the
//     motion, stops reading the content, and every beat starts to feel the same.
//     Motion is supposed to come from the CONTENT: things arriving, counting,
//     travelling, resolving. `Camera` is opt-in, for the two or three beats an
//     episode where a moving frame is the point (see the camera section below).
//
// The vocabulary is in four families — geometric (clip-path + transform),
// optical (light behaves like it hit a lens), luma (an organic matte erodes one
// scene into the next) and dimensional (the frame is a surface in space).
// Optical and luma kinds cost more to render; two or three per episode.
//
// Some transitions need the OUTGOING scene too (cross-zoom, defocus, the dips).
// `Enter` can only reach the incoming scene, so those are paired with `Exit`,
// which `Timeline` drives from the NEXT beat's kind. Kinds that don't need it
// skip the wrapper entirely, so existing episodes render byte-identically.
//
// For the two or three cuts per episode that must feel impossible, don't use
// this file — render the boundary stills and let Kling morph between them
// (`kling.mjs bridge`), then drop the result in as a `MorphBridge` beat.

import React from "react";
import { AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig, interpolate, Audio, staticFile } from "remotion";
import type { Palette } from "../theme";
import { alpha } from "../theme";
import { KlingClip } from "./footage";
import { clamp01 } from "./anim";

/**
 * Fallback overlap for a kind with no entry in `ENTER_FRAMES`. Most cuts now
 * carry their own length — see `enterFrames` — so this is only a floor.
 */
export const OVERLAP = 14;

export type EnterKind =
  // geometric — clip-path and transform; cheap, editorial
  | "cut" | "fade" | "iris" | "circle-out" | "wipe" | "wipe-down"
  | "push-up" | "push-left" | "push-right" | "split" | "barn-door"
  | "blinds" | "clock" | "zoom" | "pull" | "cross-zoom" | "mask-through"
  // optical — light hitting a lens; the "shot on film" register
  | "dissolve" | "dip-white" | "dip-black" | "light-leak" | "film-burn"
  | "halation" | "defocus" | "chroma-split" | "streak" | "flash"
  // luma — an organic matte, not a straight edge
  | "luma-wipe" | "grain-dissolve" | "displace"
  // dimensional + kinetic
  | "push3d" | "cube" | "flip" | "whip" | "speed-ramp" | "glitch";

/** Every kind, in family order. Drives the `TransitionGallery` composition. */
export const ALL_ENTER_KINDS: EnterKind[] = [
  "cut", "fade", "iris", "circle-out", "wipe", "wipe-down",
  "push-up", "push-left", "push-right", "split", "barn-door",
  "blinds", "clock", "zoom", "pull", "cross-zoom", "mask-through",
  "dissolve", "dip-white", "dip-black", "light-leak", "film-burn",
  "halation", "defocus", "chroma-split", "streak", "flash",
  "luma-wipe", "grain-dissolve", "displace",
  "push3d", "cube", "flip", "whip", "speed-ramp", "glitch",
];

/* ── the three registers ─────────────────────────────────────────────────── */
//
// Not every kind belongs in every film. Sorted by how much attention the cut
// asks for, because "classy" is almost entirely a question of restraint: a
// transition the viewer notices is a transition that interrupted them.

/**
 * HOUSE — the register the body of an episode is cut in. Quiet, editorial,
 * unhurried; none of them announce themselves. Build the film out of four or
 * five of these and it reads as edited rather than assembled.
 */
export const HOUSE_KINDS: EnterKind[] = [
  "cut", "fade", "dissolve", "push-up", "push-left", "push-right",
  "wipe", "wipe-down", "iris", "circle-out", "split", "barn-door",
  "blinds", "clock", "zoom", "pull", "mask-through", "defocus",
  "halation", "luma-wipe",
];

/**
 * ACCENT — a cut that is allowed to be an event. Two or three in an episode,
 * on the beats that carry it: the turn, the payoff, the act break. A fourth
 * one costs you the first three.
 */
export const ACCENT_KINDS: EnterKind[] = [
  "light-leak", "film-burn", "streak", "flash", "dip-white", "dip-black",
  "grain-dissolve", "displace", "cross-zoom", "push3d", "flip", "whip",
];

/**
 * LOUD — effects wearing a transition's clothes. Only when the CONTENT is the
 * thing they depict (a `glitch` into the failure beat, `chroma-split` into
 * corrupted data). Never as a way to make a dull cut interesting.
 */
export const LOUD_KINDS: EnterKind[] = ["glitch", "chroma-split", "cube", "speed-ramp"];

/**
 * How long each kind takes, in frames — and therefore how many frames the two
 * scenes share, because a transition and its overlap are the same thing.
 *
 * These are not one number for a reason. A dissolve that resolves in 14 frames
 * is a blink; a whip pan that takes 14 is a smear the viewer sits through. The
 * optical and luma kinds are SLOW (they're standing in for light and chemistry,
 * both of which take time), the geometric kinds are brisk, and the kinetic ones
 * are over before you can look at them. Getting these lengths right is most of
 * what separates "classy" from "has transitions".
 */
export const ENTER_FRAMES: Partial<Record<EnterKind, number>> = {
  cut: 0,
  // geometric — brisk, editorial
  wipe: 16, "wipe-down": 16, "push-up": 16, "push-left": 16, "push-right": 16,
  blinds: 16, iris: 18, "circle-out": 18, split: 18, "barn-door": 18,
  zoom: 18, clock: 20, pull: 20, "mask-through": 20, "cross-zoom": 14,
  // optical + luma — light and chemistry; give them time or they read as a flicker
  fade: 20, defocus: 20, halation: 22, "light-leak": 22, "film-burn": 24,
  dissolve: 26, "luma-wipe": 26, "grain-dissolve": 24, displace: 18,
  "dip-white": 18, "dip-black": 18, streak: 16, flash: 8, "chroma-split": 12,
  // dimensional + kinetic — fast by definition
  push3d: 16, cube: 14, flip: 14, whip: 9, "speed-ramp": 10, glitch: 8,
};

/** Kinds whose outgoing half is animated by `Exit`. Everything else is a no-op. */
const EXIT_KINDS = new Set<EnterKind>([
  "dissolve", "dip-white", "dip-black", "cross-zoom", "defocus",
  "speed-ramp", "light-leak", "film-burn", "halation",
]);

/* ── svg matte helpers ───────────────────────────────────────────────────── */

/** Inline SVG as a CSS url() — used for mattes CSS gradients can't express. */
const svgUrl = (inner: string) =>
  `url("data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080' preserveAspectRatio='none'>${inner}</svg>`,
  )}")`;

/**
 * Noise matte that erodes from nothing to full. Alpha = slope·(noise − T) + 0.5
 * with T swept past both ends of the noise range, so it truly starts empty and
 * truly ends solid — a threshold that stops short leaves the scene masked for
 * its whole life.
 */
const grainMatte = (s: number, slope = 6) => {
  const T = 1.15 - 1.3 * s;
  const intercept = 0.5 - slope * T;
  return svgUrl(
    `<filter id='g' x='-20%' y='-20%' width='140%' height='140%'>` +
      `<feTurbulence type='fractalNoise' baseFrequency='0.012' numOctaves='4' seed='7'/>` +
      `<feColorMatrix type='matrix' values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 1 0 0 0 0'/>` +
      `<feComponentTransfer><feFuncA type='linear' slope='${slope}' intercept='${intercept.toFixed(3)}'/></feComponentTransfer>` +
      `</filter><rect width='1920' height='1080' filter='url(#g)'/>`,
  );
};

/** Angled gradient wipe whose edge is displaced by turbulence — an ink bleed. */
const lumaMatte = (s: number) => {
  const a = -0.4 + 1.4 * s;
  return svgUrl(
    `<defs><filter id='d' x='-30%' y='-30%' width='160%' height='160%'>` +
      `<feTurbulence type='fractalNoise' baseFrequency='0.005' numOctaves='3' seed='3' result='n'/>` +
      `<feDisplacementMap in='SourceGraphic' in2='n' scale='240' xChannelSelector='R' yChannelSelector='G'/>` +
      `</filter><linearGradient id='g' x1='0' y1='0' x2='1' y2='0.4'>` +
      `<stop offset='${Math.max(0, a).toFixed(3)}' stop-color='#fff' stop-opacity='1'/>` +
      `<stop offset='${Math.min(1, a + 0.4).toFixed(3)}' stop-color='#fff' stop-opacity='0'/>` +
      `</linearGradient></defs>` +
      `<rect x='-260' y='-260' width='2440' height='1600' fill='url(#g)' filter='url(#d)'/>`,
  );
};

/* ── optical overlays ────────────────────────────────────────────────────── */

/**
 * Warm streak that blooms in from a frame edge and decays. Screen-blended, so
 * it adds light rather than covering the scene. Leaks are warm by physics; one
 * band picks up the episode accent so it still belongs to the film.
 */
const LightLeak: React.FC<{ pal: Palette; t: number; intensity?: number }> = ({ pal, t, intensity = 1 }) => {
  const o = interpolate(t, [0, 0.35, 1], [0, 1, 0], { extrapolateRight: "clamp" }) * intensity;
  if (o <= 0.001) return null;
  const slide = interpolate(t, [0, 1], [-18, 26]);
  return (
    <AbsoluteFill
      style={{
        mixBlendMode: "screen",
        opacity: o,
        pointerEvents: "none",
        transform: `translateX(${slide}%)`,
        background:
          `radial-gradient(ellipse 46% 120% at 8% 40%, #FFD9A3${alpha(0.9)}, transparent 62%),` +
          `radial-gradient(ellipse 30% 90% at 22% 70%, #FF6A3D${alpha(0.7)}, transparent 66%),` +
          `radial-gradient(ellipse 22% 70% at 34% 22%, ${pal.accent}${alpha(0.5)}, transparent 70%)`,
      }}
    />
  );
};

/** Thin horizontal lens streak sweeping the cut — anamorphic flare. */
const Streak: React.FC<{ pal: Palette; t: number }> = ({ pal, t }) => {
  const o = interpolate(t, [0, 0.25, 1], [0, 1, 0], { extrapolateRight: "clamp" });
  if (o <= 0.001) return null;
  return (
    <AbsoluteFill style={{ mixBlendMode: "screen", opacity: o, pointerEvents: "none" }}>
      {/* soft halo under a hot core — one thin bar alone reads as a stray line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "50%",
          height: 190,
          filter: "blur(70px)",
          transform: `translateY(-50%) scaleX(${interpolate(t, [0, 1], [0.4, 1.5])})`,
          background: `linear-gradient(90deg, transparent, ${pal.accent}${alpha(0.55)}, #FFFFFF${alpha(0.75)}, ${pal.accent}${alpha(0.55)}, transparent)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "50%",
          height: 16,
          filter: "blur(14px)",
          transform: `translateY(-50%) scaleX(${interpolate(t, [0, 1], [0.3, 1.4])})`,
          background: `linear-gradient(90deg, transparent, ${pal.accent}, #FFFFFF, ${pal.accent}, transparent)`,
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * Wraps the incoming scene and animates it over the outgoing one.
 * `dur` is the transition length in frames (defaults to OVERLAP).
 */
export const Enter: React.FC<{
  kind: EnterKind; pal: Palette; dur?: number; bg?: string; children: React.ReactNode;
}> = ({
  kind, pal, dur: durIn = OVERLAP, bg, children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // `cut` is 0 frames long; a 0-frame spring divides by zero and every style
  // below reads NaN, so the whole scene renders blank. Floor it at 1.
  const dur = Math.max(1, durIn);
  // one spring drives every variant → the whole film shares a motion signature
  const s = spring({ frame, fps, config: { damping: 200, mass: 0.7 }, durationInFrames: dur });
  // the one exception: a speed ramp needs the overshoot a stiff spring removes
  const sLoose = spring({ frame, fps, config: { damping: 14, mass: 0.6, stiffness: 90 }, durationInFrames: dur });
  const t = clamp01(frame / dur);
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");

  const style: React.CSSProperties = {};
  let flash = 0;
  let overlay: React.ReactNode = null;
  let defs: React.ReactNode = null;

  switch (kind) {
    /* ── geometric ─────────────────────────────────────────────────────── */
    case "cut":
      break;
    case "fade":
      // alpha-over at `s` composites to s·incoming + (1−s)·outgoing — a real
      // cross-dissolve. `dissolve` is the film variant, with the luminance dip.
      style.opacity = s;
      break;
    // A clip-path transition must END fully open, or it clips the scene for its
    // whole life — an off-centre circle needs to reach the FARTHEST corner, not
    // just 75%. (Cost us a silently cropped scene once; don't lower these.)
    case "iris":
      style.clipPath = `circle(${s * 85}% at 50% 50%)`;
      style.transform = `scale(${1.06 - 0.06 * s})`;
      break;
    case "circle-out":
      style.clipPath = `circle(${s * 125}% at 82% 22%)`;
      break;
    case "wipe":
      style.clipPath = `inset(0 ${100 - s * 100}% 0 0)`;
      break;
    case "wipe-down":
      style.clipPath = `inset(0 0 ${100 - s * 100}% 0)`;
      break;
    case "push-up":
      style.transform = `translateY(${(1 - s) * 100}%)`;
      break;
    case "push-left":
      style.transform = `translateX(${(1 - s) * 100}%)`;
      break;
    case "push-right":
      style.transform = `translateX(${-(1 - s) * 100}%)`;
      break;
    case "split":
      style.clipPath = `inset(${50 - s * 50}% 0 ${50 - s * 50}% 0)`;
      break;
    case "barn-door":
      style.clipPath = `inset(0 ${50 - s * 50}% 0 ${50 - s * 50}%)`;
      break;
    case "blinds": {
      const bars = 6;
      // CSS can't stack clip-paths; a repeating mask gives the segmented reveal
      style.maskImage = `repeating-linear-gradient(180deg, #000 0 ${(100 / bars) * s}%, transparent ${(100 / bars) * s}% ${100 / bars}%)`;
      style.WebkitMaskImage = style.maskImage as string;
      break;
    }
    case "clock":
      // must overshoot 360deg or the last wedge never closes
      style.maskImage = `conic-gradient(from 0deg, #000 0deg ${s * 362}deg, transparent ${s * 362}deg 360deg)`;
      style.WebkitMaskImage = style.maskImage as string;
      break;
    case "zoom":
      style.transform = `scale(${0.72 + 0.28 * s})`;
      style.opacity = Math.min(1, s * 1.8);
      break;
    case "pull":
      style.transform = `scale(${1.35 - 0.35 * s})`;
      style.opacity = Math.min(1, s * 1.8);
      break;
    case "cross-zoom":
      // the incoming half; `Exit` pushes the outgoing scene INTO the blur
      style.transform = `scale(${1.55 - 0.55 * s})`;
      style.filter = `blur(${(1 - s) * 34}px)`;
      style.opacity = Math.min(1, s * 2);
      break;
    case "mask-through": {
      // a shape travels across frame and wipes it — reads as the subject itself
      // carrying the cut
      const x = interpolate(s, [0, 1], [14, 52]);
      style.clipPath = `circle(${s * 145}% at ${x}% 50%)`;
      break;
    }

    /* ── optical ───────────────────────────────────────────────────────── */
    case "dissolve":
      // paired with Exit's dim, this reproduces the slight mid-point darkening
      // of a real optical dissolve — the thing a straight alpha ramp lacks
      style.opacity = s;
      style.filter = `brightness(${1 + (1 - s) * 0.12})`;
      break;
    case "dip-white":
    case "dip-black": {
      style.opacity = Math.min(1, s * 2.4);
      const solid = kind === "dip-white" ? (pal.isDark ? "#FFFFFF" : "#FFFFFF") : "#000000";
      const o = interpolate(t, [0, 0.55], [1, 0], { extrapolateRight: "clamp" });
      overlay = o > 0.001 ? <AbsoluteFill style={{ background: solid, opacity: o, pointerEvents: "none" }} /> : null;
      break;
    }
    case "light-leak":
      style.opacity = Math.min(1, s * 1.5);
      style.filter = `brightness(${1 + (1 - s) * 0.2}) saturate(${1 + (1 - s) * 0.3})`;
      overlay = <LightLeak pal={pal} t={t} />;
      break;
    case "film-burn":
      // leak + the overexposed core of a reel change
      style.opacity = Math.min(1, s * 1.8);
      style.transform = `scale(${1.04 - 0.04 * s})`;
      style.filter = `brightness(${1 + (1 - s) * 0.45}) contrast(${1 + (1 - s) * 0.2})`;
      overlay = (
        <>
          <LightLeak pal={pal} t={t} intensity={1.3} />
          <AbsoluteFill
            style={{
              mixBlendMode: "screen",
              pointerEvents: "none",
              opacity: interpolate(t, [0, 0.3, 0.8], [0.2, 0.95, 0], { extrapolateRight: "clamp" }),
              background: `radial-gradient(circle 42% at 62% 46%, #FFFFFF, #FFD9A3${alpha(0.75)} 38%, transparent 72%)`,
            }}
          />
        </>
      );
      break;
    case "halation":
      // highlights swell before the image resolves
      style.opacity = Math.min(1, s * 1.6);
      style.filter = `blur(${(1 - s) * 7}px) brightness(${1 + (1 - s) * 0.35}) contrast(${1 - (1 - s) * 0.15})`;
      break;
    case "defocus":
      // pure rack focus — no pan, unlike `whip`
      style.filter = `blur(${(1 - s) * 30}px)`;
      style.opacity = Math.min(1, s * 2.2);
      style.transform = `scale(${1.03 - 0.03 * s})`;
      break;
    case "chroma-split": {
      // drop-shadow() is useless here — the layer is opaque, so every shadow
      // lands behind it. A real channel split has to happen inside the image.
      const d = (1 - s) * 24;
      style.filter = `url(#chr${uid})`;
      style.opacity = Math.min(1, s * 2);
      defs = (
        <svg width={0} height={0} style={{ position: "absolute" }} aria-hidden>
          <filter id={`chr${uid}`} x="-10%" y="-10%" width="120%" height="120%">
            <feOffset in="SourceGraphic" dx={-d} dy={0} result="ro" />
            <feColorMatrix in="ro" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="rc" />
            <feOffset in="SourceGraphic" dx={d} dy={0} result="bo" />
            <feColorMatrix in="bo" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" result="bc" />
            <feBlend in="rc" in2="bc" mode="screen" />
          </filter>
        </svg>
      );
      break;
    }
    case "streak":
      // a screen-blended flare adds light, so it vanishes on a near-white
      // plate. The luminance pulse is what makes the flare read there.
      style.opacity = Math.min(1, s * 1.7);
      style.transform = `scale(${1.05 - 0.05 * s}) scaleY(${1 + (1 - s) * 0.03})`;
      style.filter = `brightness(${1 + (1 - s) * 0.5}) contrast(${1 - (1 - s) * 0.25}) saturate(${1 - (1 - s) * 0.4})`;
      overlay = <Streak pal={pal} t={t} />;
      break;
    case "flash":
      style.opacity = Math.min(1, s * 2);
      flash = interpolate(frame, [0, 3, 10], [0.85, 0.55, 0], { extrapolateRight: "clamp" });
      break;

    /* ── luma ──────────────────────────────────────────────────────────── */
    case "luma-wipe":
      style.maskImage = lumaMatte(s);
      style.WebkitMaskImage = style.maskImage as string;
      style.maskSize = "100% 100%";
      style.WebkitMaskSize = "100% 100%";
      break;
    case "grain-dissolve":
      style.maskImage = grainMatte(s);
      style.WebkitMaskImage = style.maskImage as string;
      style.maskSize = "100% 100%";
      style.WebkitMaskSize = "100% 100%";
      break;
    case "displace":
      style.filter = `url(#dsp${uid})`;
      style.opacity = Math.min(1, s * 1.6);
      defs = (
        <svg width={0} height={0} style={{ position: "absolute" }} aria-hidden>
          <filter id={`dsp${uid}`} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves={3} seed={5} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={(1 - s) * 220} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
      );
      break;

    /* ── dimensional + kinetic ─────────────────────────────────────────── */
    case "push3d":
      style.transform = `perspective(2000px) rotateY(${(1 - s) * 26}deg) translateX(${(1 - s) * 46}%) scale(${0.86 + 0.14 * s})`;
      style.opacity = Math.min(1, s * 1.6);
      break;
    case "cube":
      style.transform = `perspective(1600px) rotateY(${(1 - s) * 88}deg) translateZ(${(1 - s) * -240}px)`;
      style.transformOrigin = "left center";
      style.backfaceVisibility = "hidden";
      break;
    case "flip":
      style.transform = `perspective(1800px) rotateX(${(1 - s) * -84}deg)`;
      style.transformOrigin = "center bottom";
      style.backfaceVisibility = "hidden";
      style.opacity = Math.min(1, s * 2.4);
      break;
    case "whip":
      // motion-blurred pan — the cut that hides a change of subject
      style.transform = `translateX(${(1 - s) * 62}%)`;
      style.filter = `blur(${(1 - s) * 26}px)`;
      break;
    case "speed-ramp":
      // loose spring: it arrives fast, overshoots, settles — the ramp's whip
      style.transform = `translateX(${(1 - sLoose) * 46}%) scale(${1.06 - 0.06 * clamp01(sLoose)})`;
      style.filter = `blur(${Math.max(0, 1 - s) * 18}px)`;
      style.opacity = Math.min(1, s * 2.6);
      break;
    case "glitch": {
      const j = Math.sin(frame * 5.1) * (1 - t) * 18;
      style.transform = `translateX(${j}px) scaleY(${1 + (1 - t) * 0.02})`;
      style.opacity = frame < 2 ? 0.4 : 1;
      style.filter = `saturate(${1 + (1 - t) * 2})`;
      break;
    }
  }

  return (
    <>
      {defs}
      <AbsoluteFill style={{ ...style, backgroundColor: bg ?? pal.bg }}>{children}</AbsoluteFill>
      {overlay}
      {flash > 0 && <AbsoluteFill style={{ background: pal.isDark ? "#fff" : pal.accent, opacity: flash, pointerEvents: "none" }} />}
    </>
  );
};

/**
 * Animates the OUTGOING scene's last `dur` frames, so a transition can own both
 * halves of the cut. Driven by the NEXT beat's kind; a no-op wrapper for every
 * kind that doesn't need it, so nothing already authored changes.
 */
export const Exit: React.FC<{
  kind?: EnterKind; pal: Palette; len: number; dur?: number; bg?: string; children: React.ReactNode;
}> = ({ kind, pal, len, dur = OVERLAP, bg, children }) => {
  const frame = useCurrentFrame();
  const start = Math.max(0, len - dur);
  const p = clamp01((frame - start) / Math.max(1, dur));

  if (!kind || !EXIT_KINDS.has(kind) || frame < start) return <>{children}</>;

  const style: React.CSSProperties = {};
  let overlay: React.ReactNode = null;

  switch (kind) {
    case "dissolve":
      style.opacity = 1 - p;
      style.filter = `brightness(${1 - p * 0.18})`;
      break;
    case "dip-white":
    case "dip-black":
      overlay = (
        <AbsoluteFill
          style={{ background: kind === "dip-white" ? "#FFFFFF" : "#000000", opacity: clamp01(p * 1.6), pointerEvents: "none" }}
        />
      );
      break;
    case "cross-zoom":
      style.transform = `scale(${1 + p * 0.55})`;
      style.filter = `blur(${p * 34}px)`;
      style.opacity = 1 - p * 0.6;
      break;
    case "defocus":
      style.filter = `blur(${p * 30}px)`;
      style.opacity = 1 - p * 0.5;
      break;
    case "speed-ramp":
      style.transform = `translateX(${-p * 34}%)`;
      style.filter = `blur(${p * 20}px)`;
      break;
    case "light-leak":
    case "film-burn":
      style.filter = `brightness(${1 + p * 0.4}) contrast(${1 - p * 0.1})`;
      style.transform = `scale(${1 + p * 0.02})`;
      break;
    case "halation":
      style.filter = `blur(${p * 6}px) brightness(${1 + p * 0.3})`;
      break;
  }

  return (
    <>
      <AbsoluteFill style={{ ...style, backgroundColor: bg ?? pal.bg }}>{children}</AbsoluteFill>
      {overlay}
    </>
  );
};

/* ── the camera ──────────────────────────────────────────────────────────── */

/**
 * A slow move across a beat — the thing live action gets for free.
 *
 * OPT-IN, AND RARE. This used to run on every beat, cycling through six moves,
 * and it was wrong: a film where the frame never stops moving reads as a
 * slideshow with an effect applied to it. The drift becomes the motion the eye
 * tracks, the content stops being what's moving, and — the real cost — every
 * beat feels identical, because they are all doing the same thing underneath
 * whatever is on them. A locked frame is what makes the two or three moves you
 * DO spend land as a camera move rather than as the default state.
 *
 * So: the frame is locked unless a beat asks for a move. Spend one where the
 * move means something —
 *
 *   - `push`  into the beat the episode turns on
 *   - `pull`  out of the closing statement
 *   - `rise` / `fall` over something with real vertical extent (a stack, a
 *     column of logs, a diagram taller than the frame)
 *   - `pan-left` / `pan-right` only to CARRY MOTION THROUGH A CUT: the outgoing
 *     scene drifts left, the incoming one enters from the right at the same
 *     velocity. That's the one place a pan is invisible and does work.
 *
 * Never stack it on footage — `KlingClip` carries its own Ken Burns push, and
 * two moves at once swims.
 *
 * The amount is the Ken Burns range: invisible as an effect, decisive as a
 * feeling. Under ~5% it stops registering as motion at all (measured: at 2.5%,
 * a frame and the frame 1.5s later are identical to the eye), so if you're
 * reaching for a small move to fill dead air, you want content motion instead —
 * see `useAlive`/`useLoop` in `anim.ts`. A camera move is not a pacing fix.
 */
export type CameraMove = "push" | "pull" | "pan-left" | "pan-right" | "rise" | "fall" | "none";

/**
 * A pan needs somewhere to pan FROM, so every move sits on a constant overscan.
 * Constant is the point: a fixed magnification is invisible, while a changing
 * one is the zoom we are trying to avoid.
 */
const OVERSCAN = 1.095;

export const Camera: React.FC<{
  len: number; amount?: number; move?: CameraMove; children: React.ReactNode;
}> = ({ len, amount = 0.055, move = "push", children }) => {
  const frame = useCurrentFrame();
  // eased, not linear — a linear ramp starts and stops dead, which is exactly
  // what a real dolly does not do
  const raw = clamp01(frame / Math.max(1, len));
  const t = raw * raw * (3 - 2 * raw);

  let scale = OVERSCAN;
  let x = 0, y = 0;
  const travel = amount * 130; // ≈7% of frame across the whole beat

  switch (move) {
    case "push":  scale = 1 + amount * t; break;
    case "pull":  scale = (1 + amount) - amount * t; break;
    case "pan-left":  x = travel * (0.5 - t); break;
    case "pan-right": x = -travel * (0.5 - t); break;
    case "rise":  y = travel * 0.6 * (0.5 - t); break;
    case "fall":  y = -travel * 0.6 * (0.5 - t); break;
    case "none":  scale = 1; break;
  }

  return (
    <AbsoluteFill style={{ transform: `scale(${scale.toFixed(5)}) translate(${x.toFixed(3)}%, ${y.toFixed(3)}%)` }}>
      {children}
    </AbsoluteFill>
  );
};

/* ── beats → timeline ────────────────────────────────────────────────────── */

export type Beat = {
  /** Scene length in SECONDS. Derive it from vo-durations.json (VO + 0.35s breath). */
  seconds: number;
  enter: EnterKind;
  node: React.ReactNode;
  /** 1-based scene number → public/audio/vo/sceneN.mp3. Omit for silent beats. */
  vo?: number;
  /**
   * Transition length override in frames — and therefore how many frames this
   * beat shares with the one before it. Omit: each kind brings its own length
   * (`ENTER_FRAMES`), which is almost always what you want.
   */
  enterDur?: number;
  /**
   * Camera move across the beat. OMIT FOR A LOCKED FRAME — that's the default
   * and the right answer for most beats. Name a move (`"push"`, `"pull"`,
   * `"pan-left"`…) on the two or three beats that earn one, optionally with
   * `cameraAmount` to set how far it travels.
   */
  camera?: CameraMove;
  /** Travel of the camera move, as a fraction of the frame. House default 0.055. */
  cameraAmount?: number;
};

/**
 * Frames beat `i` overlaps the beat before it: the length of its own
 * transition, clamped so a long dissolve can never eat more than a third of
 * either scene (which would leave the shorter one still animating when it ends).
 */
export const enterFrames = (b: Beat) => Math.max(0, b.enterDur ?? ENTER_FRAMES[b.enter] ?? OVERLAP);

const layout = (beats: Beat[], fps: number) => {
  const lens = beats.map((b) => Math.round(b.seconds * fps));
  const overlaps = beats.map((b, i) =>
    i === 0 ? 0 : Math.min(enterFrames(b), Math.floor(lens[i] / 3), Math.floor(lens[i - 1] / 3)),
  );
  const starts: number[] = [];
  let cursor = 0;
  lens.forEach((len, i) => {
    cursor -= overlaps[i];
    starts.push(cursor);
    cursor += len;
  });
  return { lens, starts, overlaps, total: cursor };
};

/** A Kling morph clip used AS the transition between two authored scenes. */
export const MorphBridge = (id: string, pal: Palette, seconds: number): Beat => ({
  seconds,
  enter: "fade",
  enterDur: 6,
  node: <KlingClip id={id} pal={pal} startAt={0} grade={0.35} push={1.0} grain={false} vignette={0.25} />,
});

/**
 * Lays beats end to end, each overlapping the one before it by the length of
 * its own transition, wires per-scene VO (starting 5 frames in so the cut lands
 * before the voice) and returns the sequences plus the total frame count.
 */
export const useTimeline = (beats: Beat[]) => {
  const { fps } = useVideoConfig();
  return layout(beats, fps);
};

export const totalFrames = (beats: Beat[], fps = 30) => layout(beats, fps).total;

export const Timeline: React.FC<{
  beats: Beat[]; pal: Palette; voVolume?: number; vo?: boolean;
  /**
   * Episode-wide camera move for any beat that doesn't name its own. Leave it
   * off — the house default is a LOCKED FRAME, and motion comes from the
   * content. Pass a move here only for a film that is deliberately all-camera.
   */
  camera?: CameraMove;
  /**
   * Beats paint the palette background by default, which is right for a CUT
   * episode: each scene is an opaque screen replacing the last.
   *
   * A TRAVELLED episode is the opposite — the world and the field are rendered
   * outside this timeline and the beats are annotation layers over them. Leave
   * this false there, or every beat covers the world with an opaque rectangle
   * and the film renders as a stack of blank cards. (It did. That is why this
   * prop exists.)
   */
  transparent?: boolean;
}> = ({ beats, pal, voVolume = 1, vo = true, camera: camDefault, transparent = false }) => {
  const bg = transparent ? "transparent" : undefined;
  const { lens, starts, overlaps } = useTimeline(beats);
  return (
    <>
      {beats.map((b, i) => {
        const next = beats[i + 1];
        const move = b.camera ?? camDefault;
        return (
          <Sequence key={i} from={starts[i]} durationInFrames={lens[i]} name={`Scene ${i + 1}`} layout="none">
            <Exit kind={next?.enter} pal={pal} len={lens[i]} dur={overlaps[i + 1] ?? OVERLAP} bg={bg}>
              <Enter kind={i === 0 ? "cut" : b.enter} pal={pal} dur={overlaps[i]} bg={bg}>
                {!move || move === "none" ? (
                  b.node
                ) : (
                  <Camera len={lens[i]} move={move} amount={b.cameraAmount ?? 0.055}>
                    {b.node}
                  </Camera>
                )}
              </Enter>
            </Exit>
            {vo && b.vo != null && (
              <Sequence from={5} name={`VO ${b.vo}`} layout="none">
                <Audio src={staticFile(`audio/vo/scene${b.vo}.mp3`)} volume={voVolume} />
              </Sequence>
            )}
          </Sequence>
        );
      })}
    </>
  );
};
