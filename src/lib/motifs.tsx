// Author: Bishakh
//
// THE CONTINUITY LAYER — animated graphics that live across the WHOLE film
// instead of inside one beat.
//
// The problem this solves: an episode assembled as twelve self-contained screens
// teaches twelve things and lands none of them. Each beat resets, the viewer
// re-orients, and the argument the episode is making stops being visible on
// screen — the intent goes dead somewhere around beat five even though every
// individual screen is fine.
//
// The fix is one element that SURVIVES the cuts and changes state as the story
// does. A single dot that travels, gets blocked, gets unblocked. A line that
// keeps drawing. A field that never stops breathing. The viewer tracks it
// without being told to, and every cut becomes a continuation instead of a
// restart.
//
// These are rendered OUTSIDE `Timeline`, as siblings of it, so they run on
// absolute composition frames and no cut can interrupt them:
//
//   <AbsoluteFill>
//     <Timeline beats={buildBeats()} pal={PAL} />
//     <MotifTrack pal={PAL} keys={JOURNEY} />     {/* over every scene */}
//     <SeriesMark pal={PAL} … />
//   </AbsoluteFill>
//
// Everything here is deterministic and PACE-independent: it is the one layer
// that must look identical on a re-render.

import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import type { Palette } from "../theme";
import { alpha, mix } from "../theme";
import { MONO } from "../fonts";
import { clamp01, rand, useK } from "./anim";

/* ── the protagonist ─────────────────────────────────────────────────────── */

/**
 * What the motif is doing at a keyframe. The state is the argument: a dot that
 * goes `travelling → blocked → travelling → resolved` has told the episode's
 * story before a single word of narration lands.
 */
export type MotifState = "idle" | "travelling" | "blocked" | "resolved";

export type MotifKey = {
  /** ABSOLUTE seconds into the film — not seconds into a beat. */
  at: number;
  /** Position as a percentage of frame. */
  x: number;
  y: number;
  state?: MotifState;
  /** 1 = normal. Grow it on the beat where the thing it represents matters. */
  scale?: number;
};

const stateColor = (pal: Palette, s: MotifState) =>
  s === "blocked" ? mix(pal.accent, "#FF3B30", 0.75)
  : s === "resolved" ? pal.accent2
  : s === "idle" ? pal.textMuted
  : pal.accent;

/** Value of a keyed channel at an arbitrary frame, eased like a camera move. */
const track = (frame: number, fps: number, keys: MotifKey[], pick: (k: MotifKey) => number) =>
  keys.length === 1
    ? pick(keys[0])
    : interpolate(frame, keys.map((k) => k.at * fps), keys.map(pick), {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      });

/** The keyframe in force at this frame — states are held, not interpolated. */
const stateAt = (frame: number, fps: number, keys: MotifKey[]): MotifState => {
  let s: MotifState = keys[0]?.state ?? "travelling";
  for (const k of keys) {
    if (frame >= k.at * fps && k.state) s = k.state;
  }
  return s;
};

/**
 * One element travelling through the entire episode, above every scene.
 *
 * Give it 6–12 keyframes — roughly one per beat, at the absolute time that beat
 * starts (read them off `pace.mjs`'s scene windows, which prints exactly that).
 * It does not need to move on every one: a motif that HOLDS through two beats
 * and then moves is more legible than one in constant transit.
 *
 * The trail is what makes it read as one continuous object rather than a dot
 * that teleports — it samples the same track backwards in time, so it is always
 * exactly the path just travelled.
 */
export const MotifTrack: React.FC<{
  pal: Palette; keys: MotifKey[]; size?: number; trail?: number; label?: string; opacity?: number;
}> = ({ pal, keys, size = 22, trail = 14, label, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = useK();
  if (!keys.length) return null;

  const state = stateAt(frame, fps, keys);
  const color = stateColor(pal, state);
  const x = track(frame, fps, keys, (kk) => kk.x);
  const y = track(frame, fps, keys, (kk) => kk.y);
  const sc = track(frame, fps, keys, (kk) => kk.scale ?? 1);

  // Blocked shudders in place; resolved breathes. Both are sub-perceptual —
  // you read the state as a feeling before you notice the motion.
  const pulse =
    state === "blocked" ? 1 + Math.sin(frame * 0.9) * 0.06
    : state === "resolved" ? 1 + Math.sin(frame * 0.08) * 0.05
    : 1;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity }}>
      {Array.from({ length: trail }).map((_, i) => {
        const f = frame - (i + 1) * 2;
        const a = (1 - (i + 1) / (trail + 1)) * 0.5;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${track(f, fps, keys, (kk) => kk.x)}%`,
              top: `${track(f, fps, keys, (kk) => kk.y)}%`,
              width: size * k * sc * (1 - (i + 1) / (trail + 2)),
              height: size * k * sc * (1 - (i + 1) / (trail + 2)),
              marginLeft: -(size * k * sc) / 2,
              marginTop: -(size * k * sc) / 2,
              borderRadius: "50%",
              background: color,
              opacity: a,
              filter: `blur(${1.5 * k}px)`,
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute", left: `${x}%`, top: `${y}%`,
          width: size * k * sc * pulse, height: size * k * sc * pulse,
          marginLeft: -(size * k * sc * pulse) / 2, marginTop: -(size * k * sc * pulse) / 2,
          borderRadius: "50%", background: color,
          boxShadow: `0 0 ${34 * k}px ${8 * k}px ${color}${alpha(0.45)}`,
        }}
      />
      {label && (
        <div
          style={{
            position: "absolute", left: `${x}%`, top: `${y}%`,
            transform: `translate(${size * k}px, -50%)`,
            fontFamily: MONO, fontSize: 20 * k, letterSpacing: "0.14em",
            textTransform: "uppercase", color, whiteSpace: "nowrap", opacity: 0.85,
          }}
        >
          {label}
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ── the through-line ────────────────────────────────────────────────────── */

/**
 * A line that keeps drawing for the whole episode — the argument, made visible.
 *
 * `from`/`to` are absolute seconds; between them the path draws at a constant
 * rate, so at any moment "how far along are we" is answerable at a glance. Park
 * it at the frame edge (a rule under the safe area, a spine down the left) and
 * it never competes with a beat.
 */
export const Thread: React.FC<{
  pal: Palette; from: number; to: number; d?: string; width?: number; opacity?: number;
}> = ({ pal, from, to, d, width = 3, opacity = 0.5 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = clamp01((frame - from * fps) / Math.max(1, (to - from) * fps));
  // A straight rule along the bottom safe area, unless you hand it a path.
  const path = d ?? "M 120 1010 L 1800 1010";
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity }}>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="none">
        <path d={path} stroke={pal.border} strokeWidth={width} fill="none" strokeLinecap="round" />
        <path
          d={path}
          stroke={pal.accent}
          strokeWidth={width}
          fill="none"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - p}
        />
      </svg>
    </AbsoluteFill>
  );
};

/* ── the living field ────────────────────────────────────────────────────── */

/**
 * A node lattice that never stops breathing — the base plate for any systems /
 * infrastructure episode, and a beat's cheapest insurance against going still.
 *
 * Deterministic, sub-perceptual, and independent of `PACE`: it is the layer that
 * is always running underneath whatever is arriving on top of it. `active`
 * lights a fraction of the nodes, so the same component reads as "idle system"
 * at 0.1 and "system at load" at 0.8 — one prop, and the field carries the
 * argument of the act it's in.
 */
export const Lattice: React.FC<{
  pal: Palette; count?: number; active?: number; speed?: number; opacity?: number; links?: boolean;
}> = ({ pal, count = 34, active = 0.25, speed = 1, opacity = 0.5, links = true }) => {
  const frame = useCurrentFrame();
  const k = useK();
  const nodes = Array.from({ length: count }).map((_, i) => {
    const bx = rand(i * 3 + 1) * 100;
    const by = rand(i * 3 + 2) * 100;
    const ph = rand(i * 3 + 3) * Math.PI * 2;
    return {
      i,
      x: bx + Math.sin(frame * 0.006 * speed + ph) * 1.4,
      y: by + Math.cos(frame * 0.005 * speed + ph * 1.3) * 1.1,
      // Which nodes are hot rotates slowly, so the field keeps changing without
      // anything ever "happening" — motion with no event in it.
      hot: (rand(i * 7 + 5) + Math.sin(frame * 0.01 * speed + ph) * 0.25) < active,
    };
  });
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        {links &&
          nodes.map((n, i) => {
            const m = nodes[(i * 5 + 3) % nodes.length];
            const d = Math.hypot(n.x - m.x, n.y - m.y);
            if (d > 26) return null;
            return (
              <line
                key={`l${i}`}
                x1={n.x} y1={n.y} x2={m.x} y2={m.y}
                stroke={pal.borderMid}
                // viewBox units, NOT pixels: the box is 100×100 stretched over
                // the frame, so 0.1 lands at ~2px wide. `vectorEffect` would
                // pin it to 0.1 REAL pixels and the links vanish entirely.
                strokeWidth={0.1}
                opacity={0.9 - d / 30}
              />
            );
          })}
      </svg>
      {nodes.map((n) => (
        <div
          key={n.i}
          style={{
            position: "absolute", left: `${n.x}%`, top: `${n.y}%`,
            width: (n.hot ? 9 : 5) * k, height: (n.hot ? 9 : 5) * k,
            marginLeft: -(n.hot ? 4.5 : 2.5) * k, marginTop: -(n.hot ? 4.5 : 2.5) * k,
            borderRadius: "50%",
            background: n.hot ? pal.accent : pal.borderMid,
            boxShadow: n.hot ? `0 0 ${18 * k}px ${3 * k}px ${pal.accent}${alpha(0.5)}` : undefined,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

/* ── the running strip ───────────────────────────────────────────────────── */

/**
 * A marquee of real strings — log lines, ids, metric names — that never stops.
 *
 * Use it as the second thing on a beat that has one big idea and nothing else
 * to do: the number lands, the strip keeps running, the beat stays alive. It is
 * also the honest way to show "volume" without inventing a chart.
 *
 * Seamless because the items are rendered twice and the strip translates by
 * exactly half its width. Keep `items` short and real — invented log lines read
 * as invented.
 */
export const Ticker: React.FC<{
  pal: Palette; items: string[]; y?: number; period?: number; size?: number; opacity?: number;
}> = ({ pal, items, y = 92, period = 420, size = 22, opacity = 0.6 }) => {
  const frame = useCurrentFrame();
  const k = useK();
  const t = ((frame / Math.max(1, period)) % 1 + 1) % 1;
  const row = [...items, ...items];
  return (
    <div
      style={{
        position: "absolute", left: 0, right: 0, top: `${y}%`,
        overflow: "hidden", pointerEvents: "none", opacity,
        maskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
        WebkitMaskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
      }}
    >
      <div style={{ display: "flex", gap: 56 * k, transform: `translateX(${-t * 50}%)`, width: "200%" }}>
        {row.map((s, i) => (
          <div
            key={i}
            style={{
              fontFamily: MONO, fontSize: size * k, whiteSpace: "nowrap",
              color: i % 4 === 1 ? pal.accent : pal.textMuted, letterSpacing: "0.08em",
            }}
          >
            {s}
          </div>
        ))}
      </div>
    </div>
  );
};
