// Author: Bishakh
//
// THE AGENT LAYER — named cursors that operate the software on screen.
//
// This is the device behind the product films that feel alive without a single
// frame of footage and without a word of narration. A multiplayer cursor with a
// name tag ("Animator", "Colorist", "Sound") arrives, and then the thing it
// points at changes. Three things fall out of that, and they are the reason to
// spend a whole layer on it:
//
//   1. CAUSATION becomes visible. A card that recolours on its own is a motion
//      graphic. A card that recolours 6 frames after a cursor labelled
//      "Colorist" drops a palette on it is a STORY — the viewer infers an actor,
//      an intent and a result from three moving objects and no explanation.
//   2. It survives the cuts, so it does the job `MotifTrack` does for a
//      diagram film: continuity. The same five names are on screen at second 2
//      and second 20, so the film is one continuous session rather than twelve
//      slides.
//   3. It buys PARALLELISM for free. Five cursors working at once says "a team,
//      simultaneously" in a way no diagram of a team says it.
//
// The rules, and they are what separate this from a decorative cursor:
//
//   • EVERY cursor move must cause something, or precede something it caused.
//     A cursor that wanders is a screensaver — it is the exact failure mode of
//     this technique and it is very easy to ship.
//   • Cursors live in the MARGINS. They annotate the content; they never sit on
//     top of the thing the viewer is reading.
//   • They are small. Roughly 2% of frame height for the arrow. Big cursors
//     read as a tutorial screencast, small ones read as a workspace.
//   • Name and colour are FIXED for the whole film. The moment "Animator" is
//     red at second 3 and blue at second 14, the layer stops being people.
//   • Between 3 and 6 of them. Two reads as a pair programming session, seven
//     reads as noise.
//
// Pair with `workspace.tsx` (the surfaces they operate) and, for the sound, a
// `click` cue on the frame a cursor acts — the cursor is the picture half of an
// event whose other half is a tick.

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { Palette } from "../theme";
import { alpha } from "../theme";
import { SANS } from "../fonts";
import { clamp01, rand, useK, lerp } from "./anim";

/* ── the roster ──────────────────────────────────────────────────────────── */

/**
 * One participant. `color` is its identity for the entire film — pick them far
 * apart in hue, and keep the house accent for the agent that represents the
 * product itself so the film's signature colour is also its protagonist.
 */
export type Agent = {
  name: string;
  color: string;
};

/**
 * A pose. `at` is ABSOLUTE seconds into the film (like `MotifKey`), `x`/`y` are
 * percentages of the frame — so a roster authored once survives a re-time and
 * reflows into the 9:16 cut.
 *
 * `act` marks the frame where this cursor DOES the thing: it plays a click
 * flare, and it is the frame the caused change should be keyed to. Author the
 * effect at `at + 0.2s`, never simultaneously — cause is legible only when it
 * precedes effect by a beat the eye can resolve.
 */
export type CursorKey = {
  at: number;
  x: number;
  y: number;
  act?: boolean;
  /** Optional short text that types out beside the cursor while it is here. */
  say?: string;
  /** Hide the cursor entirely from this key onward (it left the document). */
  gone?: boolean;
};

/* ── motion ──────────────────────────────────────────────────────────────── */

// A real cursor does not travel in a straight line at constant speed, and the
// straight constant-speed version is instantly readable as computed. Two fixes,
// both cheap: ease hard out of rest and settle long into the target, and bow
// the path sideways so the move has a wrist in it.
const CURSOR_EASE = Easing.bezier(0.3, 0, 0.08, 1);

/** Seconds a cursor spends travelling between two poses. */
const TRAVEL = 0.5;

const poseAt = (keys: CursorKey[], t: number) => {
  if (!keys.length) return { x: 50, y: 50, k: 0, seg: 0, gone: true };
  let i = 0;
  while (i < keys.length - 1 && keys[i + 1].at <= t) i++;
  const cur = keys[i];
  const next = keys[i + 1];
  if (!next) return { x: cur.x, y: cur.y, k: 1, seg: i, gone: !!cur.gone };
  // The move happens in the TRAVEL window that ENDS on the next key's `at`, so
  // a cursor is already in place when it acts rather than sliding in late.
  const start = Math.max(cur.at, next.at - TRAVEL);
  const p = clamp01((t - start) / Math.max(0.0001, next.at - start));
  const e = CURSOR_EASE(p);
  const dx = next.x - cur.x;
  const dy = next.y - cur.y;
  // Perpendicular bow, proportional to distance and capped — long moves arc,
  // small corrections stay straight.
  const bow = Math.min(3.5, Math.hypot(dx, dy) * 0.12) * Math.sin(Math.PI * p);
  const len = Math.max(0.001, Math.hypot(dx, dy));
  return {
    x: lerp(cur.x, next.x, e) + (-dy / len) * bow,
    y: lerp(cur.y, next.y, e) + (dx / len) * bow,
    k: p,
    seg: i,
    gone: !!(p < 1 ? cur.gone : next.gone),
  };
};

/**
 * The idle life of a parked cursor. Without it a stationary cursor looks like a
 * PNG, and the eye notices the deadness before it notices anything else on the
 * frame. Deterministic (`rand`), sub-pixel-ish, and slow.
 */
// Amplitude matters more than it looks: at 0.3% of frame this is sub-pixel and
// the cursor still reads as a PNG. The reference films float visibly — measure
// one and its parked cursors never stop moving. Two incommensurate frequencies
// per axis so the path never repeats and never looks like an orbit.
const breathe = (frame: number, seed: number) => ({
  bx: Math.sin(frame * 0.021 + rand(seed) * 6.28) * 0.5 + Math.sin(frame * 0.0091 + rand(seed + 3) * 6.28) * 0.34,
  by: Math.cos(frame * 0.017 + rand(seed + 9) * 6.28) * 0.4 + Math.cos(frame * 0.0073 + rand(seed + 5) * 6.28) * 0.28,
});

/* ── the cursor itself ───────────────────────────────────────────────────── */

/** The arrow. Drawn, not an emoji — an emoji cursor renders differently on every machine. */
const Arrow: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <svg width={size} height={size * 1.16} viewBox="0 0 24 28" style={{ display: "block", overflow: "visible" }}>
    <path
      d="M4 2 L4 21.5 L9.4 16.6 L12.8 24.4 L16.4 22.8 L13.1 15.2 L20.4 14.6 Z"
      fill={color}
      stroke="#FFFFFF"
      strokeWidth={1.6}
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * One named cursor with its own choreography.
 *
 * `at` on the keys is absolute film seconds, so mount this OUTSIDE `Timeline`
 * (alongside `MotifTrack`) — a cursor interrupted by a cut is a cursor that
 * stopped being a person.
 */
export const Cursor: React.FC<{
  pal: Palette;
  agent: Agent;
  keys: CursorKey[];
  /** Fraction of frame height for the arrow. The house value reads as a workspace. */
  scale?: number;
  seed?: number;
}> = ({ pal, agent, keys, scale = 0.021, seed = 0 }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  const pose = poseAt(keys, t);
  if (pose.gone) return null;

  const size = height * scale;
  const { bx, by } = breathe(frame, seed);

  // The click flare: a ring that snaps out and dies in ~10 frames. Short, because
  // the flare's job is to timestamp the action, not to be an animation.
  const cur = keys[pose.seg];
  const act = cur?.act ? (t - cur.at) * fps : -99;
  const flare = clamp01(act / 10);
  const flaring = act >= 0 && act < 10;

  const say = cur?.say;
  const sayChars = say ? Math.floor(Math.max(0, (t - cur.at) * 26) - 4) : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: `${pose.x + bx}%`,
        top: `${pose.y + by}%`,
        // Anchor is the arrow TIP, which is what the viewer reads as "where it is".
        translate: "-8% -6%",
        pointerEvents: "none",
      }}
    >
      {flaring && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: size * 2.6,
            height: size * 2.6,
            marginLeft: -size * 1.3,
            marginTop: -size * 1.3,
            borderRadius: "50%",
            border: `${Math.max(1.5, size * 0.09)}px solid ${agent.color}`,
            opacity: 1 - flare,
            scale: `${lerp(0.2, 1.35, flare)}`,
          }}
        />
      )}
      <Arrow color={agent.color} size={size} />
      <div
        style={{
          position: "absolute",
          left: size * 0.62,
          top: size * 0.95,
          display: "flex",
          alignItems: "center",
          gap: size * 0.28,
          whiteSpace: "nowrap",
        }}
      >
        <span
          style={{
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: size * 0.56,
            letterSpacing: "0.005em",
            color: "#FFFFFF",
            background: agent.color,
            padding: `${size * 0.14}px ${size * 0.4}px`,
            borderRadius: size * 0.42,
            // A cursor pill is a UI object sitting above the artwork; the shadow
            // is what puts it on a different plane from the content.
            boxShadow: `0 ${size * 0.18}px ${size * 0.5}px -${size * 0.18}px ${pal.bgDeep}${alpha(0.45)}`,
          }}
        >
          {agent.name}
        </span>
        {say && sayChars > 0 && (
          <span
            style={{
              fontFamily: SANS,
              fontWeight: 500,
              fontSize: size * 0.52,
              color: pal.textBody,
              background: pal.surface,
              border: `1px solid ${pal.border}`,
              padding: `${size * 0.14}px ${size * 0.4}px`,
              borderRadius: size * 0.36,
            }}
          >
            {say.slice(0, sayChars)}
            {sayChars < say.length ? "|" : ""}
          </span>
        )}
      </div>
      {void width}
    </div>
  );
};

/**
 * The whole roster in one mount.
 *
 * ```tsx
 * <AgentCursors pal={PAL} cast={[
 *   { agent: { name: "Animator", color: "#E8543F" }, keys: [...] },
 *   { agent: { name: "Colorist", color: "#E5459B" }, keys: [...] },
 * ]} />
 * ```
 */
export const AgentCursors: React.FC<{
  pal: Palette;
  cast: { agent: Agent; keys: CursorKey[] }[];
  scale?: number;
}> = ({ pal, cast, scale }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    {cast.map((c, i) => (
      <Cursor key={c.agent.name} pal={pal} agent={c.agent} keys={c.keys} scale={scale} seed={i * 7 + 3} />
    ))}
  </AbsoluteFill>
);

/* ── drag a box, push into it ────────────────────────────────────────────── */

/**
 * The marquee gesture: a cursor DRAGS a rectangle across the frame, and then
 * the frame pushes into what it enclosed.
 *
 * This is the strongest single move in the register, and it is strong for a
 * reason that has nothing to do with the zoom. A push on its own is a camera
 * decision — the film asserts that this part matters. A push that follows a
 * hand-drawn box is an ARGUMENT: someone looked at the whole picture, decided
 * which part of it mattered, showed you the decision, and only then took you
 * there. The viewer watches the selection being made, so by the time the frame
 * arrives they already know why they are looking at it.
 *
 * It also solves the hardest problem in a diagram beat — "which of these nine
 * boxes should I be reading?" — without a label, an arrow or a narration line
 * spent pointing.
 *
 * The four phases, and the timings that make it read (all seconds, local to the
 * enclosing Sequence):
 *
 *   drag    0.45–0.7   the box is pulled open. Faster reads as a wipe.
 *   hold    0.25–0.45  the beat where the selection just SITS. Skipping this is
 *                      the single most common way to ruin the move: without it
 *                      the box and the push are one event, and the viewer never
 *                      registers that a choice was made.
 *   push    0.8–1.2    into the rect. Eased, never linear.
 *   release optional   pull back out. Omit and the beat ends close.
 *
 * `rect` is in percentages of the frame. Pass `agent` and the dragging cursor is
 * drawn at the live corner for you — the box must visibly be drawn BY someone,
 * and hand-keying a cursor to match the corner is how that drifts.
 */
export const MarqueeZoom: React.FC<{
  pal: Palette;
  rect: { x: number; y: number; w: number; h: number };
  /** [start, end] of the drag, in seconds. */
  drag?: [number, number];
  hold?: number;
  push?: number;
  /** Seconds at which to pull back out. Omit to stay close. */
  release?: number;
  releaseDur?: number;
  agent?: Agent;
  /** Keep the marquee visible after the push instead of fading it. */
  keepBox?: boolean;
  children: React.ReactNode;
}> = ({
  pal, rect, drag = [0.4, 1.0], hold = 0.32, push = 1.0, release, releaseDur = 0.9,
  agent, keepBox = false, children,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;

  const [d0, d1] = drag;
  // The drag itself eases: a hand pulling a marquee accelerates off the anchor
  // and decelerates into the corner. Linear reads as a wipe, every time.
  const dp = clamp01((t - d0) / Math.max(0.0001, d1 - d0));
  const de = Easing.bezier(0.3, 0, 0.2, 1)(dp);

  const pushStart = d1 + hold;
  const pp = clamp01((t - pushStart) / Math.max(0.0001, push));
  const pe = Easing.bezier(0.45, 0, 0.15, 1)(pp);

  const rp = release === undefined ? 0 : clamp01((t - release) / Math.max(0.0001, releaseDur));
  const re = Easing.bezier(0.45, 0, 0.2, 1)(rp);

  // How far in we are: 0 = whole frame, 1 = the rect fills it.
  const z = pe * (1 - re);

  // At z=1 the rect fills the frame. Scale is the inverse of its width, and the
  // translate has to be applied in the SCALED frame or the centring drifts as
  // the push goes in — same reasoning as `World`.
  const scale = lerp(1, 100 / Math.max(0.001, rect.w), z);
  const cx = rect.x + rect.w / 2;
  const cy = rect.y + rect.h / 2;

  // The live corner of the box being dragged.
  const curX = rect.x + rect.w * de;
  const curY = rect.y + rect.h * de;

  const boxOpacity = keepBox ? 1 : 1 - clamp01((pp - 0.25) / 0.5);
  const drawn = dp > 0;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          // ONE transform string, in pixels — the same pattern `World` uses and
          // for the same reason. Two things this got wrong before, both worth
          // stating because neither is visible until you look at a still:
          //
          //   1. Separate `scale`/`translate` properties with PERCENTAGE values
          //      resolve against a box that is itself being scaled, and the
          //      centring silently did nothing — the push zoomed but never
          //      travelled, so it clipped whatever sat off-centre.
          //   2. The translate must be multiplied by `z`. Unscaled, the frame is
          //      displaced by the full offset even at zero zoom, so a beat whose
          //      selection is off-centre sits visibly shifted for its whole
          //      length before the push has even started.
          //
          // The view interpolates: scale 1 → 100/rect.w, centre → rect centre.
          transform: `scale(${scale.toFixed(5)}) translate(${(-((cx - 50) / 100) * width * z).toFixed(2)}px, ${(-((cy - 50) / 100) * height * z).toFixed(2)}px)`,
          transformOrigin: "50% 50%",
        }}
      >
        {children}
      </AbsoluteFill>

      {drawn && boxOpacity > 0.01 && (
        <div
          style={{
            position: "absolute",
            left: `${rect.x}%`,
            top: `${rect.y}%`,
            width: `${rect.w * de}%`,
            height: `${rect.h * de}%`,
            border: `2px dashed ${agent?.color ?? pal.accent}`,
            background: `${agent?.color ?? pal.accent}${alpha(0.07)}`,
            borderRadius: 4,
            opacity: boxOpacity,
            pointerEvents: "none",
            // The box lives in SCREEN space, not in the scaled content — a
            // marquee that zooms with the picture is a shape someone drew on the
            // artwork; one that stays put is a selection.
          }}
        />
      )}

      {agent && drawn && boxOpacity > 0.01 && (
        <div
          style={{
            position: "absolute",
            left: `${curX}%`,
            top: `${curY}%`,
            opacity: boxOpacity,
            pointerEvents: "none",
          }}
        >
          <Arrow color={agent.color} size={height * 0.021} />
          <span
            style={{
              position: "absolute",
              left: height * 0.013,
              top: height * 0.02,
              fontFamily: SANS,
              fontWeight: 600,
              fontSize: height * 0.0118,
              color: "#FFFFFF",
              background: agent.color,
              padding: `${height * 0.003}px ${height * 0.0084}px`,
              borderRadius: 999,
              whiteSpace: "nowrap",
            }}
          >
            {agent.name}
          </span>
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ── the status line ─────────────────────────────────────────────────────── */

/**
 * The little pill that says what the system is doing: "Claude is rendering" →
 * "Motion graphics finished".
 *
 * Small thing, disproportionate effect. It gives the film a STATE MACHINE the
 * viewer can follow, so the long middle of a demo has narrative tension (it is
 * still working) and the end has a release (it finished). Without it, a demo
 * film is a sequence of pretty screens with no idea when it is over.
 *
 * `done` flips the dot to a check and the pulse to a settle. Sound the flip
 * with a `success` cue — this is the single most earned cue in a demo film.
 */
export const StatusPill: React.FC<{
  pal: Palette;
  label: string;
  done?: boolean;
  x?: number;
  y?: number;
  color?: string;
}> = ({ pal, label, done = false, x = 50, y = 88, color }) => {
  const frame = useCurrentFrame();
  const k = useK();
  const c = color || pal.accent;
  // A working pulse; a settled dot when done. The pulse is slow (1.6s) — a fast
  // blink reads as an error state.
  const pulse = done ? 1 : 0.45 + 0.55 * (0.5 - 0.5 * Math.cos(frame * 0.065));
  const pop = interpolate(frame % 100000, [0, 8], [0.94, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.2, 1.3, 0.4, 1),
  });

  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        translate: "-50% -50%",
        display: "flex",
        alignItems: "center",
        gap: 12 * k,
        fontFamily: SANS,
        fontWeight: 500,
        fontSize: 26 * k,
        color: pal.textBody,
        background: pal.surface,
        border: `1px solid ${pal.border}`,
        borderRadius: 999,
        padding: `${11 * k}px ${22 * k}px`,
        boxShadow: `0 ${10 * k}px ${30 * k}px -${10 * k}px ${pal.bgDeep}${alpha(0.35)}`,
        scale: `${pop}`,
      }}
    >
      {done ? (
        <svg width={20 * k} height={20 * k} viewBox="0 0 20 20">
          <path d="M4 10.5 L8 14.5 L16 5.5" fill="none" stroke="#1DA463" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <span style={{ width: 11 * k, height: 11 * k, borderRadius: "50%", background: c, opacity: pulse }} />
      )}
      {label}
    </div>
  );
};

/* ── the palette bar ─────────────────────────────────────────────────────── */

/**
 * Swatch groups, one of which gets picked — the visible cause of a restyle.
 *
 * This is the clearest single demonstration of the whole technique: three rows
 * of colour, a cursor arrives, `active` changes, and the artwork behind it
 * becomes a different design. The viewer understands "it restyled the deck"
 * without a label, a narration line or a transition.
 */
export const PaletteBar: React.FC<{
  pal: Palette;
  groups: string[][];
  active?: number;
  x?: number;
  y?: number;
  scale?: number;
}> = ({ pal, groups, active = -1, x = 50, y = 12, scale = 1 }) => {
  const k = useK() * scale;
  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        translate: "-50% -50%",
        display: "flex",
        gap: 16 * k,
      }}
    >
      {groups.map((g, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            gap: 7 * k,
            padding: `${8 * k}px ${10 * k}px`,
            borderRadius: 10 * k,
            background: pal.surface,
            border: `${i === active ? 2 : 1}px solid ${i === active ? pal.accent : pal.border}`,
            boxShadow: i === active ? `0 ${8 * k}px ${22 * k}px -${8 * k}px ${pal.bgDeep}${alpha(0.4)}` : "none",
            scale: `${i === active ? 1.06 : 1}`,
          }}
        >
          {g.map((c, j) => (
            <span key={j} style={{ width: 18 * k, height: 18 * k, borderRadius: 4 * k, background: c }} />
          ))}
        </div>
      ))}
    </div>
  );
};
