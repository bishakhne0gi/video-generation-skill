// Author: Bishakh
//
// THE SPACE — an episode as one continuous canvas the camera travels, instead
// of a stack of screens that replace each other.
//
// This is the move behind the reference films that read as expensive. Nothing
// cuts: there is one large world holding every diagram, card and image the
// episode will ever show, and the camera flies between them. Two consequences,
// and they are the whole reason to do it:
//
//   1. The viewer never re-orients. Every arrival has a direction and a
//      distance, so the film has geography — beat 7 is somewhere in relation to
//      beat 3, and the argument keeps its shape.
//   2. The transitions stop being effects. Getting from one idea to the next is
//      a camera move through real space, which no wipe can imitate and which
//      costs nothing to render.
//
// This does NOT contradict the locked-frame rule in `transitions.tsx`. That
// rule bans a drift applied ON TOP of a static composition — motion that goes
// nowhere and means nothing. A move THROUGH a space is the opposite: it is the
// content. Keep the two straight, and never run a `Beat.camera` on a beat that
// is already travelling the world.
//
// Scale is the other half. `ScaleFrom` lets the next beat start exactly where a
// node was sitting and grow until it fills the frame, so "zoom into the picture
// until the picture IS the film" happens without a cut.

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { Palette } from "../theme";
import { alpha } from "../theme";
import { HEAD, MONO } from "../fonts";
import { clamp01, useAppear, lerp } from "./anim";

/* ── the camera in world space ───────────────────────────────────────────── */

/**
 * Where the camera is looking. `x`/`y` are the WORLD point at the centre of the
 * frame; `zoom` 1 means one world pixel is one frame pixel on the 1920 grid.
 * Build the world at roughly 3–5× the frame in each direction: big enough that
 * a move has distance in it, small enough that you can hold the whole thing in
 * your head.
 */
export type WorldView = { x: number; y: number; zoom: number };

export type ViewKey = WorldView & {
  /** ABSOLUTE seconds into the film. */
  at: number;
};

/**
 * The view at this frame, eased between keyframes.
 *
 * Ease, never linear: a dolly that starts and stops dead is the single loudest
 * tell of a computed camera. The bezier here is slow-out/slow-in with a long
 * tail, which is what a real move on a fluid head looks like.
 *
 * Zoom is interpolated in LOG space. Linear zoom between 1 and 8 spends most of
 * its time already far away and then lurches — exponential is what reads as a
 * constant-speed push.
 */
export const useView = (keys: ViewKey[]): WorldView => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!keys.length) return { x: 0, y: 0, zoom: 1 };
  if (keys.length === 1) return keys[0];
  const at = keys.map((k) => k.at * fps);
  const opts = {
    extrapolateLeft: "clamp" as const,
    extrapolateRight: "clamp" as const,
    easing: Easing.bezier(0.45, 0, 0.15, 1),
  };
  return {
    x: interpolate(frame, at, keys.map((k) => k.x), opts),
    y: interpolate(frame, at, keys.map((k) => k.y), opts),
    zoom: Math.exp(interpolate(frame, at, keys.map((k) => Math.log(k.zoom)), opts)),
  };
};

/**
 * The world. Children are positioned in world coordinates by `WorldItem`; this
 * transforms all of them as one so the camera move is a single composited
 * transform rather than N animated elements.
 */
export const World: React.FC<{ view: WorldView; children: React.ReactNode; style?: React.CSSProperties }> = ({
  view, children, style,
}) => {
  const { width } = useVideoConfig();
  const k = width / 1920; // the world is authored on the 1920 grid
  return (
    <AbsoluteFill style={{ overflow: "hidden", ...style }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 0,
          height: 0,
          // scale first, then translate: the translate has to happen in the
          // ZOOMED frame or the centring drifts as you push in
          transform: `scale(${(view.zoom * k).toFixed(5)}) translate(${(-view.x).toFixed(2)}px, ${(-view.y).toFixed(2)}px)`,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

/** Anything placed at a world coordinate. `w`/`h` are world units. */
export const WorldItem: React.FC<{
  x: number; y: number; w: number; h: number; rotate?: number; children: React.ReactNode; style?: React.CSSProperties;
}> = ({ x, y, w, h, rotate = 0, children, style }) => (
  <div
    style={{
      position: "absolute",
      left: x - w / 2,
      top: y - h / 2,
      width: w,
      height: h,
      transform: rotate ? `rotate(${rotate}deg)` : undefined,
      ...style,
    }}
  >
    {children}
  </div>
);

/* ── the editor vocabulary ───────────────────────────────────────────────── */
//
// Why this particular set of shapes: a node graph is a language the audience
// already reads — pills are things, wires are dependencies, a dashed box is a
// selection. You get to skip explaining the diagram and spend the narration on
// the idea instead. Keep the stroke weight and the radii identical everywhere;
// that consistency is most of what "premium" means here.

/** A card in the world: label above, content inside, editor chrome around. */
export const Node: React.FC<{
  pal: Palette; x: number; y: number; w: number; h: number;
  label?: string; sub?: string; delay?: number; selected?: boolean; accent?: boolean;
  children?: React.ReactNode;
}> = ({ pal, x, y, w, h, label, sub, delay = 0, selected = false, accent = false, children }) => {
  const a = useAppear(delay, 170);
  return (
    <WorldItem x={x} y={y} w={w} h={h} style={{ opacity: a, transform: `scale(${lerp(0.96, 1, a)})` }}>
      {label && (
        <div
          style={{
            position: "absolute", left: 0, bottom: "100%", marginBottom: 14,
            display: "flex", gap: 18, alignItems: "baseline", whiteSpace: "nowrap",
          }}
        >
          <span style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 26, letterSpacing: "0.06em", color: pal.ink }}>
            {label.toUpperCase()}
          </span>
          {sub && (
            <span style={{ fontFamily: MONO, fontSize: 22, letterSpacing: "0.14em", color: pal.textMuted }}>
              {sub.toUpperCase()}
            </span>
          )}
        </div>
      )}
      <div
        style={{
          width: "100%", height: "100%", borderRadius: 22, overflow: "hidden",
          background: accent ? pal.accent : pal.surface,
          border: `2px solid ${accent ? pal.accent : pal.border}`,
          boxShadow: `0 40px 90px -40px ${pal.bgDeep}${alpha(0.8)}`,
        }}
      >
        {children}
      </div>
      {selected && <SelectionBox pal={pal} />}
    </WorldItem>
  );
};

/** Dashed marquee with corner handles — the "this is the thing" pointer. */
export const SelectionBox: React.FC<{ pal: Palette; inset?: number }> = ({ pal, inset = -12 }) => (
  <div style={{ position: "absolute", inset, border: `2px dashed ${pal.accent}`, borderRadius: 6, pointerEvents: "none" }}>
    {[[0, 0], [1, 0], [0, 1], [1, 1]].map(([cx, cy], i) => (
      <div
        key={i}
        style={{
          position: "absolute", left: `${cx * 100}%`, top: `${cy * 100}%`,
          width: 14, height: 14, marginLeft: -7, marginTop: -7,
          background: pal.bg, border: `2px solid ${pal.accent}`, borderRadius: 3,
        }}
      />
    ))}
  </div>
);

/**
 * A connector between two world points, drawn on.
 *
 * Horizontal control points, always: a bezier whose handles point along the
 * flow direction reads as a cable, one with vertical handles reads as a
 * scribble. `progress` 0→1 draws it; leave it undefined and it draws itself
 * over `dur` frames from `delay`.
 */
export const Wire: React.FC<{
  pal: Palette; from: [number, number]; to: [number, number];
  delay?: number; dur?: number; progress?: number; width?: number; dots?: boolean; accent?: boolean;
}> = ({ pal, from, to, delay = 0, dur = 26, progress, width = 3, dots = true, accent = false }) => {
  const frame = useCurrentFrame();
  const p = progress ?? clamp01((frame - delay) / Math.max(1, dur));
  const [x1, y1] = from;
  const [x2, y2] = to;
  const dx = Math.max(60, Math.abs(x2 - x1) * 0.5);
  const d = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
  const pad = 400;
  const minX = Math.min(x1, x2) - pad, minY = Math.min(y1, y2) - pad;
  const w = Math.abs(x2 - x1) + pad * 2, h = Math.abs(y2 - y1) + pad * 2;
  const col = accent ? pal.accent : pal.borderMid;
  return (
    <div style={{ position: "absolute", left: minX, top: minY, width: w, height: h, pointerEvents: "none" }}>
      <svg width={w} height={h} viewBox={`${minX} ${minY} ${w} ${h}`} style={{ overflow: "visible" }}>
        <path d={d} stroke={col} strokeWidth={width} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
        {dots && p > 0.02 && <circle cx={x1} cy={y1} r={width * 2.4} fill={col} />}
        {dots && p > 0.98 && <circle cx={x2} cy={y2} r={width * 2.4} fill={col} />}
      </svg>
    </div>
  );
};

/* ── scale as the cut ────────────────────────────────────────────────────── */

/**
 * Starts this beat's content exactly where a node was sitting in the previous
 * beat and grows it until it fills the frame — the "push into the picture until
 * the picture is the film" move.
 *
 * `rect` is where the thing WAS, in percentages of the outgoing frame: read it
 * off a boundary still (`node stills.mjs out/episode.mp4 --boundaries`). Get it
 * within a couple of percent and the join is invisible; get it wrong and it
 * reads as a zoom, which is the whole difference.
 *
 * Pair it with `enter: "cut"` on the beat. A transition on top of this fights
 * it — the scale IS the transition.
 */
export const ScaleFrom: React.FC<{
  rect: { x: number; y: number; w: number; h: number };
  dur?: number; children: React.ReactNode;
}> = ({ rect, dur = 22, children }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.45, 0, 0.15, 1),
  });
  // At t=0 the content occupies `rect`; at t=1 it fills the frame.
  const scale = lerp(rect.w / 100, 1, t);
  const cx = lerp(rect.x + rect.w / 2, 50, t);
  const cy = lerp(rect.y + rect.h / 2, 50, t);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transform: `translate(${(cx - 50).toFixed(3)}%, ${(cy - 50).toFixed(3)}%) scale(${scale.toFixed(5)})`,
          transformOrigin: "50% 50%",
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
