// Author: Bishakh
//
// Kling footage inside Remotion.
//
// Rule: raw Kling output never goes on screen naked. It is always graded to the
// episode palette and carries at least one Remotion element (label, chip, rule,
// type) so the cut reads as one authored film rather than "AI clip, then slide".

import React from "react";
import { AbsoluteFill, Loop, OffthreadVideo, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import type { Palette } from "../theme";
import { alpha } from "../theme";
import { HEAD, MONO, SANS } from "../fonts";
import { clamp01, lerp, useAppear, useK } from "./anim";
import manifest from "../../public/kling/manifest.json";

export type ShotId = string;

/** Real length of a generated clip, in seconds — written by `kling.mjs manifest`. */
export const shotSeconds = (id: ShotId): number => (manifest as any)?.[id]?.seconds ?? 5;
/** Frames a clip can fill at this fps. Never schedule a scene longer than this. */
export const shotFrames = (id: ShotId, fps = 30) => Math.floor(shotSeconds(id) * fps);
export const hasShot = (id: ShotId) => Boolean((manifest as any)?.[id]);
const shotFile = (id: ShotId) => (manifest as any)?.[id]?.file ?? `kling/${id}.mp4`;

/* ── grade ───────────────────────────────────────────────────────────────── */

/**
 * The look. Every clip gets it, so Kling shots from different prompts still feel
 * like one series. `strength` 0 = untouched, 1 = heavy episode tint.
 */
export const Grade: React.FC<{ pal: Palette; strength?: number; vignette?: number }> = ({
  pal, strength = 0.55, vignette = 0.5,
}) => (
  <>
    <AbsoluteFill style={{ background: pal.grade, mixBlendMode: "color", opacity: 0.55 * strength }} />
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${pal.accent}${alpha(0.1 * strength)}, transparent 45%, ${pal.bgDeep}${alpha(0.65 * strength)})` }} />
    <AbsoluteFill style={{ boxShadow: `inset 0 0 ${240 * vignette}px ${120 * vignette}px ${pal.bgDeep}`, opacity: 0.9 }} />
  </>
);

/** Deterministic film grain — 6-frame loop, no Math.random. */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.055 }) => {
  const frame = useCurrentFrame();
  const seed = frame % 6;
  return (
    <AbsoluteFill style={{ opacity, mixBlendMode: "overlay", pointerEvents: "none" }}>
      <svg width="100%" height="100%">
        <filter id={`grain${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={seed} />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

/* ── the clip ────────────────────────────────────────────────────────────── */

/**
 * Full-bleed Kling shot with grade, grain and a slow push.
 *
 * - `startAt` seconds into the source (trim off Kling's first-frame settle,
 *   which is usually 4–8 frames of warping — trimming 0.3s fixes most of it).
 * - `speed` < 1 for a luxurious slow-mo; Kling clips hold up down to ~0.6.
 * - `hold` freezes the last frame if the scene outlives the footage, instead of
 *   showing black. Always prefer re-generating a longer clip.
 */
export const KlingClip: React.FC<{
  id: ShotId; pal: Palette; startAt?: number; speed?: number; grade?: number;
  push?: number; panX?: number; panY?: number; vignette?: number; grain?: boolean;
  children?: React.ReactNode;
}> = ({ id, pal, startAt = 0.3, speed = 1, grade = 0.55, push = 1.06, panX = 0, panY = 0, vignette = 0.5, grain = true, children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = clamp01(frame / Math.max(1, durationInFrames));
  return (
    <AbsoluteFill style={{ backgroundColor: pal.bgDeep, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${lerp(1, push, t)}) translate(${lerp(0, panX, t)}%, ${lerp(0, panY, t)}%)` }}>
        <OffthreadVideo
          src={staticFile(shotFile(id))}
          startFrom={Math.round(startAt * 30)}
          playbackRate={speed}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
      <Grade pal={pal} strength={grade} vignette={vignette} />
      {grain && <Grain />}
      {children}
    </AbsoluteFill>
  );
};

/** A Kling still (from `kling.mjs image`) used as a plate — same grade language. */
export const KlingStill: React.FC<{ id: ShotId; pal: Palette; push?: number; grade?: number; children?: React.ReactNode }> = ({
  id, pal, push = 1.1, grade = 0.5, children,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = clamp01(frame / Math.max(1, durationInFrames));
  return (
    <AbsoluteFill style={{ backgroundColor: pal.bgDeep, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${lerp(1, push, t)})` }}>
        <Img src={staticFile(`kling/${id}.png`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <Grade pal={pal} strength={grade} />
      <Grain />
      {children}
    </AbsoluteFill>
  );
};

/* ── footage as a DESIGN ELEMENT (not as a shot) ─────────────────────────── */
//
// The other half of what Kling is for. A graphics beat built entirely out of
// vectors is flat — clean, but obviously computed, and twelve of them in a row
// is the thing that reads as "template". Real footage underneath the graphics
// gives the beat depth of field, grain, moving light and imperfection: it makes
// the frame look photographed rather than drawn, without the footage ever being
// what you're looking at.
//
// Generate these as their own shots (see references/kling-shots.md → "Theme
// elements"): slow, loopable, subjectless texture, prompted in the episode's own
// palette so the colour is already right before the grade touches it.

/**
 * A Kling texture running UNDER the graphics of a beat, blended into the field.
 *
 * This is the house alternative to a camera move: the plate is genuinely moving
 * — ink diffusing, haze drifting, light crawling across a surface — so the beat
 * is alive at every frame while the frame itself stays locked and the content
 * keeps the meaning.
 *
 * Keep it under the perceptual floor. If you can point at the video, it's too
 * strong: `opacity` 0.10–0.22 on dark themes, 0.05–0.12 on light ones. It
 * should read as the surface the graphics are printed on.
 *
 * `blend`: `"screen"` adds light (dark themes), `"multiply"` adds shadow (light
 * themes), `"soft-light"` adds tonality either way without shifting the field.
 */
export const Ambient: React.FC<{
  id: ShotId; pal: Palette; opacity?: number; blend?: "screen" | "multiply" | "soft-light" | "overlay";
  blur?: number; scale?: number; speed?: number; grade?: number;
}> = ({ id, pal, opacity = 0.16, blend, speed = 0.6, blur = 0, scale = 1.06, grade = 0.7 }) => {
  const { fps } = useVideoConfig();
  const mode = blend ?? (pal.isDark ? "screen" : "multiply");
  // The plate is 5–10s and the beat can be longer: loop it rather than freeze.
  // Loop length is the clip's REAL length divided by the playback rate, or the
  // second pass starts before the first has finished playing.
  const period = Math.max(1, Math.floor((shotSeconds(id) / Math.max(0.1, speed)) * fps) - 2);
  return (
    <AbsoluteFill style={{ opacity, mixBlendMode: mode, pointerEvents: "none", overflow: "hidden" }}>
      <Loop durationInFrames={period} layout="none">
        <AbsoluteFill style={{ transform: `scale(${scale})`, filter: blur ? `blur(${blur}px)` : undefined }}>
          <OffthreadVideo
            src={staticFile(shotFile(id))}
            playbackRate={speed}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AbsoluteFill>
      </Loop>
      {grade > 0 && <AbsoluteFill style={{ background: pal.grade, mixBlendMode: "color", opacity: grade }} />}
    </AbsoluteFill>
  );
};

/**
 * Footage cropped into a piece of the layout — a circle, a pill, an arch, a
 * panel — so the shot IS a design element rather than a window cut into one.
 *
 * The classiest way to mix registers: the shape belongs to the episode's
 * geometry (same radius language as its cards), the footage inside it is real,
 * and the two stop fighting. Use it for the "human stakes" beat inside an
 * otherwise diagrammatic act, or to put one hot moving thing in the corner of a
 * still composition.
 */
export const FootageShape: React.FC<{
  id: ShotId; pal: Palette; shape?: "circle" | "pill" | "arch" | "panel";
  size?: number; ratio?: number; x?: number; y?: number; rotate?: number;
  delay?: number; startAt?: number; speed?: number; grade?: number; ring?: boolean;
  children?: React.ReactNode;
}> = ({
  id, pal, shape = "circle", size = 520, ratio = 1, x = 50, y = 50, rotate = 0,
  delay = 6, startAt = 0.35, speed = 1, grade = 0.5, ring = true, children,
}) => {
  const a = useAppear(delay, 165);
  const k = useK();
  const radius =
    shape === "circle" ? "50%"
    : shape === "pill" ? `${size * k}px`
    : shape === "arch" ? `${size * 0.5 * k}px ${size * 0.5 * k}px ${26 * k}px ${26 * k}px`
    : `${28 * k}px`;
  return (
    <div
      style={{
        position: "absolute", left: `${x}%`, top: `${y}%`,
        width: size * k, height: size * ratio * k,
        transform: `translate(-50%,-50%) rotate(${rotate}deg) scale(${lerp(0.94, 1, a)})`,
        opacity: a, borderRadius: radius, overflow: "hidden",
        border: ring ? `${1.5 * k}px solid ${pal.borderMid}` : undefined,
        boxShadow: `0 ${60 * k}px ${140 * k}px -${50 * k}px ${pal.bgDeep}`,
      }}
    >
      <OffthreadVideo
        src={staticFile(shotFile(id))}
        startFrom={Math.round(startAt * 30)}
        playbackRate={speed}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <Grade pal={pal} strength={grade} vignette={0.35} />
      {children}
    </div>
  );
};

/* ── things that sit ON footage ──────────────────────────────────────────── */

/** Documentary lower-third: rule, label, sub. Anchors a shot without covering it. */
export const LowerThird: React.FC<{ pal: Palette; label: string; sub?: string; delay?: number }> = ({ pal, label, sub, delay = 10 }) => {
  const a = useAppear(delay, 170);
  const k = useK();
  return (
    <div style={{ position: "absolute", left: 130 * k, bottom: 140 * k, opacity: a, transform: `translateY(${lerp(24, 0, a)}px)` }}>
      <div style={{ width: lerp(0, 96, a) * k, height: 4 * k, background: pal.accent, marginBottom: 22 * k }} />
      <div style={{ fontFamily: HEAD, fontWeight: 800, letterSpacing: "-0.05em", fontSize: 76 * k, color: "#fff", lineHeight: 1 }}>{label}</div>
      {sub && (
        <div style={{ marginTop: 16 * k, fontFamily: MONO, fontSize: 26 * k, letterSpacing: "0.1em", textTransform: "uppercase", color: pal.accent }}>{sub}</div>
      )}
    </div>
  );
};

/** Floating callout chip — put real numbers over footage, 2–3 max per shot. */
export const Chip: React.FC<{ pal: Palette; text: string; x: number; y: number; delay?: number; accent?: boolean }> = ({
  pal, text, x, y, delay = 16, accent = false,
}) => {
  const a = useAppear(delay, 160);
  const frame = useCurrentFrame();
  const k = useK();
  return (
    <div
      style={{
        position: "absolute", left: `${x}%`, top: `${y}%`,
        transform: `translate(-50%,-50%) translateY(${lerp(18, Math.sin(frame / 26) * 4, a)}px) scale(${lerp(0.9, 1, a)})`,
        opacity: a,
        background: accent ? pal.accent : `${pal.bgDeep}cc`,
        color: accent ? (pal.isDark ? "#04060A" : "#fff") : "#fff",
        border: `1.5px solid ${accent ? pal.accent : pal.borderMid}`,
        backdropFilter: "blur(14px)",
        borderRadius: 999, padding: `${14 * k}px ${28 * k}px`,
        fontFamily: MONO, fontSize: 26 * k, fontWeight: 500, whiteSpace: "nowrap",
        boxShadow: `0 18px 50px -20px ${pal.bgDeep}`,
      }}
    >
      {text}
    </div>
  );
};

/** Full-frame statement burned over footage — the "quote card" beat. */
export const OverText: React.FC<{ pal: Palette; text: string; align?: "center" | "left" }> = ({ pal, text, align = "center" }) => {
  const a = useAppear(8, 150);
  const k = useK();
  return (
    <AbsoluteFill style={{ alignItems: align === "center" ? "center" : "flex-start", justifyContent: "center", padding: 160 * k }}>
      <div
        style={{
          maxWidth: 1400 * k, textAlign: align, fontFamily: HEAD, fontWeight: 800, letterSpacing: "-0.05em",
          fontSize: 92 * k, lineHeight: 1.06, color: "#fff", opacity: a,
          transform: `translateY(${lerp(26, 0, a)}px)`, textShadow: `0 20px 60px ${pal.bgDeep}`,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

/** Cinema bars — use on footage beats only, never on graphics beats. */
export const Letterbox: React.FC<{ pal: Palette; height?: number }> = ({ pal, height = 90 }) => {
  const frame = useCurrentFrame();
  const h = interpolate(frame, [0, 18], [0, height], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: h, background: pal.bgDeep }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: h, background: pal.bgDeep }} />
    </>
  );
};

/** Footage inside a floating plate — mixes a shot INTO a graphics scene. */
export const FootagePlate: React.FC<{ id: ShotId; pal: Palette; label?: string; width?: number; delay?: number; speed?: number }> = ({
  id, pal, label, width = 1120, delay = 8, speed = 1,
}) => {
  const a = useAppear(delay, 150);
  const k = useK();
  return (
    <div
      style={{
        width: width * k, aspectRatio: "16 / 9", borderRadius: 26 * k, overflow: "hidden",
        border: `1px solid ${pal.borderMid}`, position: "relative",
        boxShadow: `0 60px 140px -50px ${pal.bgDeep}, 0 0 0 ${10 * k}px ${pal.accent}12`,
        opacity: a, transform: `perspective(1600px) rotateY(${lerp(9, 0, a)}deg) translateY(${lerp(50, 0, a)}px)`,
      }}
    >
      <OffthreadVideo src={staticFile(shotFile(id))} startFrom={9} playbackRate={speed} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <AbsoluteFill style={{ background: `linear-gradient(180deg, transparent 55%, ${pal.bgDeep}dd)` }} />
      {label && (
        <div style={{ position: "absolute", left: 34 * k, bottom: 28 * k, fontFamily: MONO, fontSize: 24 * k, letterSpacing: "0.12em", textTransform: "uppercase", color: pal.accent }}>
          {label}
        </div>
      )}
    </div>
  );
};

/** Tiny persistent series mark — bottom-right on every scene ties the playlist together. */
export const SeriesMark: React.FC<{ pal: Palette; series: string; episode: string }> = ({ pal, series, episode }) => {
  const k = useK();
  return (
    <div style={{ position: "absolute", right: 70 * k, bottom: 56 * k, display: "flex", alignItems: "center", gap: 14 * k, opacity: 0.62 }}>
      <div style={{ width: 9 * k, height: 9 * k, borderRadius: "50%", background: pal.accent }} />
      <div style={{ fontFamily: MONO, fontSize: 22 * k, letterSpacing: "0.16em", textTransform: "uppercase", color: pal.textMuted }}>
        {series} · {episode}
      </div>
    </div>
  );
};

export const Sans = SANS;
