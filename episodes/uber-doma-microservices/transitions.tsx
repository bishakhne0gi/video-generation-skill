// Author: Bishakh
//
// The transition system. This is where "the animation felt off" gets fixed.
//
// Three rules that do most of the work:
//  1. Scenes OVERLAP. The incoming scene animates over the outgoing one for
//     `OVERLAP` frames — a hard cut between two fades is what reads as amateur.
//  2. Every transition is DRIVEN BY A SPRING, not a linear interpolate. Linear
//     motion is the single biggest tell of template motion graphics.
//  3. Movement carries THROUGH the cut. If the outgoing scene is drifting left,
//     the incoming one enters from the right at the same velocity.
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

export const OVERLAP = 14; // frames two scenes share; 10–18 is the useful range

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
export const Enter: React.FC<{ kind: EnterKind; pal: Palette; dur?: number; children: React.ReactNode }> = ({
  kind, pal, dur = OVERLAP, children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
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
      <AbsoluteFill style={{ ...style, backgroundColor: pal.bg }}>{children}</AbsoluteFill>
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
  kind?: EnterKind; pal: Palette; len: number; dur?: number; children: React.ReactNode;
}> = ({ kind, pal, len, dur = OVERLAP, children }) => {
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
      <AbsoluteFill style={{ ...style, backgroundColor: pal.bg }}>{children}</AbsoluteFill>
      {overlay}
    </>
  );
};

/* ── the camera ──────────────────────────────────────────────────────────── */

/**
 * A slow, continuous push across the whole beat — the thing live action gets
 * for free and motion graphics have to be given deliberately.
 *
 * Why every beat needs it: scene length is set by the narration, and a reveal
 * that lands in half a second leaves the rest of the line playing over a
 * COMPLETELY STILL frame. Speeding the reveals up without this makes the
 * problem worse, not better — the dead tail just gets longer. A screen that is
 * still drifting is a screen the viewer is still watching.
 *
 * 7% over a beat is the Ken Burns range: invisible as an effect, decisive as a
 * feeling. Below ~5% it stops registering as motion at all — measured, not
 * guessed: at 2.5% a frame and the frame 1.5s later are pixel-identical to the
 * eye, and `pace.mjs` scores the beat as dead. Set `camera: false` on a beat
 * that already moves (footage carries its own push; stacking the two swims).
 */
export type CameraMove = "push" | "pull" | "pan-left" | "pan-right" | "rise" | "fall" | "none";

/**
 * The moves, cycled per beat. Only two of the seven change scale, so a run of
 * scenes no longer reads as "everything zooms" — which is exactly how a uniform
 * push across every beat looks once you watch the whole film.
 */
const MOVES: CameraMove[] = ["pan-left", "rise", "push", "pan-right", "fall", "pan-left", "pull", "rise"];

/**
 * A pan needs somewhere to pan FROM, so every move sits on a constant 4.5%
 * overscan. Constant is the point: a fixed magnification is invisible, while a
 * changing one is the zoom we are trying to get rid of.
 */
const OVERSCAN = 1.095;

export const Camera: React.FC<{
  len: number; amount?: number; i?: number; move?: CameraMove; children: React.ReactNode;
}> = ({ len, amount = 0.055, i = 0, move, children }) => {
  const frame = useCurrentFrame();
  const t = clamp01(frame / Math.max(1, len));
  const m: CameraMove = move ?? MOVES[i % MOVES.length];

  let scale = OVERSCAN;
  let x = 0, y = 0;
  // A pan has to cross ~7% of the frame to read at all — the same perceptual
  // weight as the push it replaces. At 2.3% the audit scored these beats dead,
  // which is the measured floor in references/motion-grammar.md, not a guess.
  const travel = amount * 130; // ≈7.2% of frame across the whole beat

  switch (m) {
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
  /** Transition length override in frames. */
  enterDur?: number;
  /**
   * Camera move across the beat. Omit to take the cycled default (see `MOVES`),
   * name one explicitly, `false` for none, or a number to set the amount.
   * A number sets the amount. `false` for beats that already move — footage
   * carries its own Ken Burns push and the two stack badly.
   */
  camera?: boolean | number | CameraMove;
};

/** A Kling morph clip used AS the transition between two authored scenes. */
export const MorphBridge = (id: string, pal: Palette, seconds: number): Beat => ({
  seconds,
  enter: "fade",
  enterDur: 6,
  camera: false,
  node: <KlingClip id={id} pal={pal} startAt={0} grade={0.35} push={1.0} grain={false} vignette={0.25} />,
});

/**
 * Lays beats end to end with `OVERLAP` frames of overlap, wires per-scene VO
 * (starting 5 frames in so the cut lands before the voice) and returns the
 * sequences plus the total frame count.
 */
export const useTimeline = (beats: Beat[]) => {
  const { fps } = useVideoConfig();
  const lens = beats.map((b) => Math.round(b.seconds * fps));
  const starts: number[] = [];
  let cursor = 0;
  lens.forEach((len, i) => {
    starts.push(cursor);
    cursor += len - (i < beats.length - 1 ? OVERLAP : 0);
  });
  const total = cursor;
  return { lens, starts, total };
};

export const totalFrames = (beats: Beat[], fps = 30) =>
  beats.reduce((acc, b, i) => acc + Math.round(b.seconds * fps) - (i < beats.length - 1 ? OVERLAP : 0), 0);

export const Timeline: React.FC<{
  beats: Beat[]; pal: Palette; voVolume?: number; vo?: boolean;
  /**
   * Episode-wide default camera move, used for any beat that doesn't name its
   * own. Pass `false` for a locked-off film — the frame never moves and all
   * motion comes from the content. Costs pacing; measure it.
   */
  camera?: Beat["camera"];
}> = ({ beats, pal, voVolume = 1, vo = true, camera: camDefault }) => {
  const { lens, starts } = useTimeline(beats);
  return (
    <>
      {beats.map((b, i) => {
        const next = beats[i + 1];
        return (
          <Sequence key={i} from={starts[i]} durationInFrames={lens[i]} name={`Scene ${i + 1}`} layout="none">
            <Exit kind={next?.enter} pal={pal} len={lens[i]} dur={next?.enterDur ?? OVERLAP}>
              <Enter kind={i === 0 ? "cut" : b.enter} pal={pal} dur={b.enterDur ?? OVERLAP}>
                {(b.camera ?? camDefault) === false ? (
                  b.node
                ) : (
                  <Camera
                    len={lens[i]}
                    i={i}
                    amount={typeof (b.camera ?? camDefault) === "number" ? ((b.camera ?? camDefault) as number) : 0.055}
                    move={typeof (b.camera ?? camDefault) === "string" ? ((b.camera ?? camDefault) as CameraMove) : undefined}
                  >
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
