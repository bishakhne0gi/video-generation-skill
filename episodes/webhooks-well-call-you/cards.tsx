// Author: Bishakh
//
// THE CARD VOCABULARY — the marketing-surface half of the kit, built to the
// DESIGN.md system and to the framing of the reference clip.
//
// Three things live here, and they are three different jobs:
//
//  1. `HeroCard` — ONE floating panel, centred, big, over a full-bleed gradient
//     field. This is the reference clip's whole grammar: the card is the
//     subject, the gradient is the room it is in, and the only motion is the
//     number resolving inside it. Reach for it when a beat has one figure to
//     deliver and nothing else to say.
//
//  2. `Marquee3D` — many small cards under a perspective tilt, columns running
//     in alternating directions, edges faded into the field. This is a QUANTITY
//     argument: it says "there are more of these than you want to handle" in a
//     way no list of nine chips can. It is the wrong tool for anything the
//     viewer is meant to read.
//
//  3. `ChapterBox` / `HighlightBox` / `GridPlate` — the box pattern. A hairline
//     grid plate under a bordered box, with the section number set large and
//     the rule drawing itself across. Chapters use it full-frame; highlights
//     use it inline, around the one thing on the beat that matters.
//
// House rules that apply to all of them:
//
//   Every number is tabular. `tnum` plus the tightening tracking is DESIGN.md's
//   quiet financial-data signal, and it is also just correct — a figure that
//   counts up with proportional digits visibly jitters its own width.
//
//   Display type is weight 300 with negative tracking. Bumping it to 400
//   collapses the editorial air the whole system is built on, and it is the
//   single easiest way to make this look like a different brand.
//
//   Nothing animates on a CSS keyframe. Every motion here is derived from
//   `useCurrentFrame()`, because a CSS animation is wall-clock and a render is
//   not — it would come out either frozen or juddering.

import React from "react";
import { useCurrentFrame, useVideoConfig, Easing, interpolate } from "remotion";
import { useK, useAppearAt, useLoop, lerp, clamp01, stagger } from "./anim";
import type { Palette } from "../theme";
import { alpha } from "../theme";
import { SANS, MONO } from "../fonts";

/* ── the DESIGN.md primitives ────────────────────────────────────────────── */

/** Radius scale. Cards 12, mockup chrome 16, buttons and tags pill. */
export const R = { xs: 4, sm: 6, md: 8, lg: 12, xl: 16, pill: 9999 };

/** Elevation. Level 3 is the gradient mesh itself, which is not a shadow. */
export const SHADOW = {
  1: "rgba(0,55,112,0.08) 0 1px 3px",
  2: "rgba(0,55,112,0.08) 0 8px 24px, rgba(0,55,112,0.04) 0 2px 6px",
  3: "rgba(0,20,60,0.28) 0 28px 70px, rgba(0,20,60,0.16) 0 8px 20px",
};

/** Display type: always weight 300, always negative tracking. */
export const display = (size: number, track = -0.025): React.CSSProperties => ({
  fontFamily: SANS,
  fontWeight: 300,
  fontSize: size,
  letterSpacing: `${track}em`,
  lineHeight: 1.06,
  fontFeatureSettings: '"ss01"',
});

/** Any cell containing money, a count or an id. */
export const tabular = (size: number): React.CSSProperties => ({
  fontFamily: MONO,
  fontSize: size,
  letterSpacing: "-0.03em",
  fontFeatureSettings: '"tnum", "ss01"',
  fontVariantNumeric: "tabular-nums",
});

/** The all-caps eyebrow. */
export const microCap = (size: number): React.CSSProperties => ({
  fontFamily: MONO,
  fontSize: size,
  letterSpacing: "0.22em",
  textTransform: "uppercase",
});

/* ── counting ────────────────────────────────────────────────────────────── */

/**
 * A figure resolving from `from` to `to` between two frames, eased out so it
 * lands rather than stops. Deterministic, and the ONLY way a number should
 * appear on a hero card — a figure that is simply present was never an event.
 */
export const useCount = (to: number, at: number, dur = 34, from = 0) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [at, at + dur], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
};

/* ── surfaces ────────────────────────────────────────────────────────────── */

export type Tone = "light" | "dark";

type SurfaceProps = {
  pal: Palette;
  tone?: Tone;
  radius?: number;
  pad?: number;
  elevation?: 0 | 1 | 2 | 3;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

/** The base card. Light is canvas + hairline; dark is the brand-dark-900 fill. */
export const Card: React.FC<SurfaceProps> = ({
  pal,
  tone = "light",
  radius = R.lg,
  pad = 0,
  elevation = 1,
  style,
  children,
}) => (
  <div
    style={{
      background: tone === "dark" ? DARK : pal.bg,
      border: `1px solid ${tone === "dark" ? "rgba(255,255,255,0.10)" : pal.border}`,
      borderRadius: radius,
      padding: pad,
      boxShadow: elevation ? SHADOW[elevation] : undefined,
      color: tone === "dark" ? "#FFFFFF" : pal.ink,
      ...style,
    }}
  >
    {children}
  </div>
);

/** DESIGN.md's brand-dark-900 — the featured-tier fill. */
export const DARK = "#1C1E54";

/* THE ONE BLACK. Every panel, terminal, chip and table in a film shares it, so
   a frame reads as one application rather than as a set of cards someone made
   separately. The three lights are the real macOS values — those are colours
   the viewer has seen ten thousand times and would notice as wrong. */
export const TERM_BG = "#0B0E14";
export const TERM_BAR = "#171A22";
export const TERM_INK = "#E6E9EF";
export const TERM_DIM = "rgba(230,233,239,0.42)";
/** The real ones. Getting these wrong is the tell. */
export const TERM_LIGHTS = ["#FF5F57", "#FEBC2E", "#28C840"];

/* ── the hero card ───────────────────────────────────────────────────────── */

export type HeroCardProps = {
  pal: Palette;
  /** Design-space width. Scaled by `useK()` like everything else in the kit. */
  w?: number;
  tone?: Tone;
  /** Chrome row: a ring glyph and a label, exactly as the reference clip. */
  title?: string;
  /** Frame the card lands on. */
  at?: number;
  /** Degrees of Y-tilt. The reference sits between −7 and +7 and never moves. */
  tiltY?: number;
  tiltX?: number;
  /** Footer pips — the reference's page indicator. `pips[1]` is the live one. */
  pips?: [number, number];
  accent?: string;
  children?: React.ReactNode;
};

/**
 * ONE panel, floating, centred, with chrome at the top and the content given
 * the whole middle.
 *
 * The framing is the point and it is worth being explicit about: the card is
 * roughly a third of the frame's width, it sits dead centre, the field behind
 * it is untouched, and it does not drift. Everything that moves is INSIDE the
 * card. That is what makes the reference clip read as a product rather than as
 * a slide with a rectangle on it.
 */
export const HeroCard: React.FC<HeroCardProps> = ({
  pal,
  w = 620,
  tone = "dark",
  title,
  at = 8,
  tiltY = -6,
  tiltX = 2,
  pips,
  accent,
  children,
}) => {
  const k = useK();
  const p = useAppearAt(at, 190);
  const hue = accent ?? pal.accent;
  const dark = tone === "dark";
  return (
    <div style={{ perspective: `${1600 * k}px` }}>
      <div
        style={{
          width: w * k,
          borderRadius: 26 * k,
          padding: `${26 * k}px ${28 * k}px ${22 * k}px`,
          background: dark
            ? `radial-gradient(120% 90% at 12% 0%, ${hue}${alpha(0.34)} 0%, transparent 58%), ${TERM_BG}`
            : `radial-gradient(120% 90% at 12% 0%, ${hue}${alpha(0.1)} 0%, transparent 58%), ${pal.bg}`,
          border: `1px solid ${dark ? "rgba(255,255,255,0.12)" : pal.border}`,
          boxShadow: dark ? SHADOW[3] : SHADOW[2],
          color: dark ? "#FFFFFF" : pal.ink,
          opacity: p,
          transformStyle: "preserve-3d",
          transform: `rotateX(${tiltX * p}deg) rotateY(${tiltY * p}deg) scale(${lerp(0.93, 1, p)})`,
        }}
      >
        {title && (
          <div style={{ display: "flex", alignItems: "center", gap: 12 * k, marginBottom: 26 * k }}>
            <Ring size={22 * k} color={hue} />
            <span
              style={{
                fontFamily: SANS,
                fontWeight: 400,
                fontSize: 21 * k,
                letterSpacing: "-0.01em",
                color: dark ? "rgba(255,255,255,0.82)" : pal.textBody,
              }}
            >
              {title}
            </span>
          </div>
        )}
        {children}
        {pips && (
          <div style={{ display: "flex", gap: 7 * k, marginTop: 26 * k }}>
            {Array.from({ length: pips[0] }).map((_, i) => (
              <span
                key={i}
                style={{
                  height: 3 * k,
                  width: (i === pips[1] ? 26 : 14) * k,
                  borderRadius: 2 * k,
                  background: i === pips[1] ? hue : dark ? "rgba(255,255,255,0.18)" : pal.border,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/** The chrome glyph — an arc that keeps turning, so the card is never frozen. */
export const Ring: React.FC<{ size: number; color: string }> = ({ size, color }) => {
  const spin = useLoop(190);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ rotate: `${spin * 360}deg` }}>
      <circle cx="12" cy="12" r="9" fill="none" stroke={color} strokeOpacity={0.28} strokeWidth={2.4} />
      <path
        d="M12 3a9 9 0 0 1 9 9"
        fill="none"
        stroke={color}
        strokeWidth={2.4}
        strokeLinecap="round"
      />
    </svg>
  );
};

/** The reference clip's headline figure. Thin, tabular, and it counts. */
export const BigFigure: React.FC<{
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  at?: number;
  dur?: number;
  size?: number;
  color?: string;
}> = ({ value, suffix = "", prefix = "", decimals = 0, at = 20, dur = 40, size = 118, color }) => {
  const k = useK();
  const v = useCount(value, at, dur);
  return (
    <div
      style={{
        ...display(size * k, -0.045),
        fontWeight: 300,
        color,
        fontVariantNumeric: "tabular-nums",
        fontFeatureSettings: '"tnum", "ss01"',
        whiteSpace: "nowrap",
      }}
    >
      {prefix}
      {v.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </div>
  );
};

/**
 * The reference clip's tick meter — a row of vertical bars filled to a value,
 * with the un-filled tail left visible so the number has somewhere to go.
 */
export const TickMeter: React.FC<{
  pal: Palette;
  value: number;
  ticks?: number;
  at?: number;
  tone?: Tone;
  color?: string;
  rows?: [string, string][];
}> = ({ pal, value, ticks = 34, at = 20, tone = "dark", color, rows = [] }) => {
  const k = useK();
  const dark = tone === "dark";
  const v = useCount(value, at, 40);
  const lit = (v / 100) * ticks;
  const hue = color ?? pal.accent;
  return (
    <div>
      {rows.length > 0 && (
        <div style={{ display: "flex", gap: 26 * k, marginBottom: 16 * k }}>
          {rows.map(([label, val]) => (
            <div key={label} style={{ display: "flex", alignItems: "baseline", gap: 8 * k }}>
              <span
                style={{
                  ...microCap(14 * k),
                  letterSpacing: "0.14em",
                  color: dark ? "rgba(255,255,255,0.45)" : pal.textMuted,
                }}
              >
                {label}
              </span>
              <span style={{ ...tabular(17 * k), color: dark ? "#FFFFFF" : pal.ink }}>{val}</span>
            </div>
          ))}
        </div>
      )}
      <div style={{ display: "flex", gap: 3 * k, alignItems: "flex-end", height: 44 * k }}>
        {Array.from({ length: ticks }).map((_, i) => {
          const on = i < Math.floor(lit);
          const edge = clamp01(lit - i);
          return (
            <span
              key={i}
              style={{
                flex: 1,
                height: `${64 + 36 * Math.sin((i / ticks) * Math.PI)}%`,
                borderRadius: 2 * k,
                background: on
                  ? hue
                  : edge > 0
                    ? `${hue}${alpha(edge)}`
                    : dark
                      ? "rgba(255,255,255,0.14)"
                      : pal.border,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

/** The reference clip's distribution card — labelled bars, growing in sequence. */
export const BarRows: React.FC<{
  pal: Palette;
  rows: { label: string; v: number; note?: string }[];
  max?: number;
  at?: number;
  tone?: Tone;
  color?: string;
  suffix?: string;
}> = ({ pal, rows, max = 100, at = 20, tone = "dark", color, suffix = "" }) => {
  const k = useK();
  const dark = tone === "dark";
  const hue = color ?? pal.accent;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 * k }}>
      {rows.map((r, i) => (
        <BarRow
          key={r.label}
          pal={pal}
          {...r}
          max={max}
          at={at + stagger(i, 9)}
          dark={dark}
          hue={hue}
          suffix={suffix}
        />
      ))}
    </div>
  );
};

const BarRow: React.FC<{
  pal: Palette;
  label: string;
  v: number;
  note?: string;
  max: number;
  at: number;
  dark: boolean;
  hue: string;
  suffix: string;
}> = ({ pal, label, v, note, max, at, dark, hue, suffix }) => {
  const k = useK();
  const grow = useCount(1, at, 38);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 * k, opacity: clamp01(grow * 5) }}>
      <span
        style={{
          width: 190 * k,
          ...microCap(15 * k),
          letterSpacing: "0.12em",
          color: dark ? "rgba(255,255,255,0.5)" : pal.textMuted,
          textAlign: "right",
        }}
      >
        {label}
      </span>
      <div
        style={{
          flex: 1,
          height: 13 * k,
          borderRadius: 7 * k,
          background: dark ? "rgba(255,255,255,0.10)" : pal.bgDeep,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${(v / max) * 100 * grow}%`,
            height: "100%",
            borderRadius: 7 * k,
            background: hue,
          }}
        />
      </div>
      <span style={{ ...tabular(19 * k), width: 120 * k, color: dark ? "#FFFFFF" : pal.ink }}>
        {(v * grow).toLocaleString("en-US", { maximumFractionDigits: 0 })}
        {suffix}
      </span>
      {note && (
        <span
          style={{
            ...microCap(13 * k),
            width: 130 * k,
            color: dark ? "rgba(255,255,255,0.4)" : pal.textMuted,
          }}
        >
          {note}
        </span>
      )}
    </div>
  );
};

/* ── the 3D card marquee ─────────────────────────────────────────────────── */

export type MarqueeColumn = {
  items: React.ReactNode[];
  reverse?: boolean;
  /** Seconds for one full pass of the column's own content. */
  duration?: number;
};

export type Marquee3DProps = {
  pal: Palette;
  columns: MarqueeColumn[];
  /** Design-space height of one item, INCLUDING nothing — the gap is separate. */
  itemHeight: number;
  gap?: number;
  colGap?: number;
  colWidth?: number;
  /** Copies of the item list stacked per column. Three is always enough. */
  repeat?: number;
  perspective?: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  translateX?: number;
  translateY?: number;
  translateZ?: number;
  /** Colour the four edge fades run to. Defaults to the palette background. */
  fadeTo?: string;
  fade?: number;
  at?: number;
};

/**
 * Vertical marquees under a shared perspective tilt.
 *
 * The upstream component animates with a CSS keyframe, which cannot survive a
 * frame-by-frame render: Chrome advances a CSS animation on wall-clock time, so
 * a render either freezes it at 0 or samples it at whatever the encoder's pace
 * happened to be. Here the offset is computed from the frame, and the content
 * height is computed rather than measured (`items.length × (itemHeight + gap)`)
 * so nothing depends on layout having settled.
 *
 * `repeat` copies are stacked and the track is translated by exactly one
 * copy-height per cycle, which is what makes the wrap invisible.
 */
export const Marquee3D: React.FC<Marquee3DProps> = ({
  pal,
  columns,
  itemHeight,
  gap = 22,
  colGap = 26,
  colWidth = 330,
  repeat = 3,
  perspective = 1400,
  rotateX = 14,
  rotateY = -10,
  rotateZ = 16,
  translateX = -60,
  translateY = 0,
  translateZ = -180,
  fadeTo,
  fade = 0.26,
  at = 0,
}) => {
  const k = useK();
  const { fps, width, height } = useVideoConfig();
  const frame = useCurrentFrame();
  const t = (frame - at) / fps;
  const p = useAppearAt(at, 210);
  const edge = fadeTo ?? pal.bg;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        perspective: `${perspective * k}px`,
        opacity: p,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          translate: "-50% -50%",
          display: "flex",
          gap: colGap * k,
          transformStyle: "preserve-3d",
          transform:
            `translateX(${translateX * k}px) translateY(${translateY * k}px) ` +
            `translateZ(${translateZ * k}px) ` +
            `rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) ` +
            `scale(${lerp(0.94, 1, p)})`,
        }}
      >
        {columns.map((col, ci) => {
          const cycle = col.items.length * (itemHeight + gap) * k;
          const dur = col.duration ?? 26;
          const phase = ((t / dur) % 1 + 1) % 1;
          const shift = col.reverse ? -(1 - phase) * cycle : -phase * cycle;
          return (
            <div
              key={ci}
              style={{
                width: colWidth * k,
                // Tall enough that the tilted column always overshoots the
                // frame — a marquee whose ends are visible stops being a
                // firehose and becomes a list.
                height: height * 2.1,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: -cycle,
                  display: "flex",
                  flexDirection: "column",
                  gap: gap * k,
                  translate: `0 ${shift}px`,
                }}
              >
                {Array.from({ length: repeat + 1 }).flatMap((_, r) =>
                  col.items.map((it, i) => (
                    <div key={`${r}-${i}`} style={{ height: itemHeight * k, flexShrink: 0 }}>
                      {it}
                    </div>
                  )),
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* The four fades. Without them the tilt ends in a hard diagonal edge and
          the whole thing reads as a screenshot of a webpage. */}
      {(
        [
          ["to bottom", { top: 0, left: 0, right: 0, height: `${fade * 100}%` }],
          ["to top", { bottom: 0, left: 0, right: 0, height: `${fade * 100}%` }],
          ["to right", { left: 0, top: 0, bottom: 0, width: `${fade * 100}%` }],
          ["to left", { right: 0, top: 0, bottom: 0, width: `${fade * 100}%` }],
        ] as const
      ).map(([dir, box], i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            ...box,
            background: `linear-gradient(${dir}, ${edge}, ${edge}00)`,
            pointerEvents: "none",
          }}
        />
      ))}
      {void width}
    </div>
  );
};

/**
 * The card that goes inside the marquee. Deliberately unreadable at speed —
 * it carries a type, an id and a status, and the viewer takes the SHAPE of it.
 */
export const EventCard: React.FC<{
  pal: Palette;
  type: string;
  id: string;
  note?: string;
  tone?: Tone;
  hue?: string;
  dim?: boolean;
}> = ({ pal, type, id, note, tone = "light", hue, dim = false }) => {
  const k = useK();
  const dark = tone === "dark";
  const c = hue ?? pal.accent;
  return (
    <div
      style={{
        height: "100%",
        borderRadius: R.lg * k,
        background: dark ? DARK : pal.bg,
        border: `1px solid ${dark ? "rgba(255,255,255,0.10)" : pal.border}`,
        boxShadow: SHADOW[1],
        padding: `${16 * k}px ${18 * k}px`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 8 * k,
        opacity: dim ? 0.55 : 1,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 * k }}>
        <span
          style={{
            width: 9 * k,
            height: 9 * k,
            borderRadius: "50%",
            background: c,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            ...tabular(17 * k),
            color: dark ? "#FFFFFF" : pal.ink,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {type}
        </span>
      </div>
      <span style={{ ...tabular(15 * k), color: dark ? "rgba(255,255,255,0.45)" : pal.textMuted }}>
        {id}
      </span>
      {note && (
        <span
          style={{
            fontFamily: SANS,
            fontWeight: 300,
            fontSize: 15 * k,
            color: dark ? "rgba(255,255,255,0.55)" : pal.textMuted,
          }}
        >
          {note}
        </span>
      )}
    </div>
  );
};

/* ── the product panel ───────────────────────────────────────────────────────
 *
 * THE FIX FOR "the cards look like AI slop".
 *
 * A rounded rectangle with a coloured top border, a stroke icon and two lines of
 * centred text is the house style of every generated diagram on the internet.
 * It is not a card — it is a label with a border, and the eye reads it as
 * filler in well under a second because there is nothing in it to look at.
 *
 * DESIGN.md is explicit about the alternative and says it twice: "pair every
 * feature explanation with a composited product UI mockup", and "the brand's
 * argument is *look at the actual product*". So a node in a diagram here is a
 * small piece of software: a title bar with real chrome, a route or a row of
 * live-looking data, a hairline table, a status. It takes four times the code
 * and it is the difference between a wireframe and a film.
 *
 * The three rules that make these read as real rather than as a drawing of
 * real:
 *
 *   Put ONE piece of true, specific data in it. `POST /webhooks` with a `200`
 *   beside it is a product. `your service` centred in a box is a caption.
 *
 *   Let it be busy at the edges. Real UI has a scrollbar, a truncated string, a
 *   row that runs out of room. Perfectly balanced content is the tell.
 *
 *   Never centre the body. Software is left-aligned; centred body copy inside a
 *   window is the single loudest signal that the panel is decorative.
 * ─────────────────────────────────────────────────────────────────────────── */

export type PanelProps = {
  pal: Palette;
  /** Design-space width and height — panels are sized, not content-hugged. */
  w: number;
  h?: number;
  /** The chrome strip: what this window claims to be. */
  chrome: string;
  /** Optional right-hand chrome slug — a status, a version, a count. */
  chromeRight?: string;
  tone?: Tone;
  accent?: string;
  at?: number;
  /** Traffic-light dots. Off for panels that are a console rather than an app. */
  dots?: boolean;
  elevation?: 0 | 1 | 2 | 3;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

export const ProductPanel: React.FC<PanelProps> = ({
  pal,
  w,
  h,
  chrome,
  chromeRight,
  tone = "dark",
  accent,
  at = 10,
  dots = true,
  elevation = 2,
  style,
  children,
}) => {
  const k = useK();
  const p = useAppearAt(at, 190);
  const dark = tone === "dark";
  const hue = accent ?? pal.accent;
  const line = dark ? "rgba(255,255,255,0.10)" : pal.border;
  // One black, shared with the terminal, so a diagram made of panels and a
  // diagram made of terminals are visibly the same system.
  return (
    <div
      style={{
        width: w * k,
        height: h ? h * k : undefined,
        background: dark ? TERM_BG : pal.bg,
        border: `1px solid ${line}`,
        borderRadius: R.xl * k,
        boxShadow: elevation ? SHADOW[elevation] : undefined,
        overflow: "hidden",
        opacity: p,
        transform: `translateY(${lerp(14, 0, p) * k}px) scale(${lerp(0.965, 1, p)})`,
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10 * k,
          padding: `${13 * k}px ${18 * k}px`,
          borderBottom: `1px solid ${line}`,
          background: dark ? TERM_BAR : pal.bgDeep,
          flexShrink: 0,
        }}
      >
        {dots &&
          [0, 1, 2].map((n) => (
            <span
              key={n}
              style={{
                width: 9 * k,
                height: 9 * k,
                borderRadius: "50%",
                background: dark ? "rgba(255,255,255,0.18)" : "#D7DEE8",
                flexShrink: 0,
              }}
            />
          ))}
        <span
          style={{
            marginLeft: dots ? 8 * k : 0,
            ...tabular(17 * k),
            color: dark ? "rgba(255,255,255,0.55)" : pal.textMuted,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {chrome}
        </span>
        {chromeRight && (
          <span
            style={{
              marginLeft: "auto",
              ...tabular(16 * k),
              color: hue,
              whiteSpace: "nowrap",
            }}
          >
            {chromeRight}
          </span>
        )}
      </div>
      <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
        {children}
      </div>
    </div>
  );
};

/** A method + path + status row. The most product-looking object in the kit. */
export const RouteRow: React.FC<{
  pal: Palette;
  method: string;
  path: string;
  status?: string;
  tone?: Tone;
  hue?: string;
  at?: number;
  live?: boolean;
}> = ({ pal, method, path, status, tone = "dark", hue, at: a = 20, live = false }) => {
  const k = useK();
  const p = useAppearAt(a, 200);
  const dark = tone === "dark";
  const c = hue ?? pal.accent;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12 * k,
        padding: `${13 * k}px ${18 * k}px`,
        borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.07)" : pal.border}`,
        background: live ? `${c}${alpha(dark ? 0.18 : 0.07)}` : "transparent",
        opacity: p,
      }}
    >
      <span
        style={{
          background: c,
          color: "#FFFFFF",
          ...tabular(15 * k),
          padding: `${4 * k}px ${9 * k}px`,
          borderRadius: R.xs * k,
          flexShrink: 0,
        }}
      >
        {method}
      </span>
      <span style={{ ...tabular(19 * k), color: dark ? "#FFFFFF" : pal.ink, flex: 1 }}>{path}</span>
      {status && (
        <span style={{ ...tabular(18 * k), color: dark ? "rgba(255,255,255,0.6)" : pal.textMuted }}>
          {status}
        </span>
      )}
    </div>
  );
};

/** A hairline key/value row — the filler that makes a panel look inhabited. */
export const MetaRow: React.FC<{
  pal: Palette;
  label: string;
  value: string;
  tone?: Tone;
  hue?: string;
  at?: number;
  mutedValue?: boolean;
}> = ({ pal, label, value, tone = "dark", hue, at: a = 20, mutedValue = false }) => {
  const k = useK();
  const p = useAppearAt(a, 200);
  const dark = tone === "dark";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        gap: 16 * k,
        padding: `${11 * k}px ${18 * k}px`,
        borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.06)" : pal.border}`,
        opacity: p,
      }}
    >
      <span style={{ ...microCap(15 * k), letterSpacing: "0.12em", color: dark ? "rgba(255,255,255,0.42)" : pal.textMuted }}>
        {label}
      </span>
      <span
        style={{
          ...tabular(18 * k),
          color: mutedValue ? (dark ? "rgba(255,255,255,0.55)" : pal.textMuted) : hue ?? (dark ? "#FFFFFF" : pal.ink),
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {value}
      </span>
    </div>
  );
};

/** A feed row — a dot, a type, a timestamp. Stack three and it is a dashboard. */
export const FeedRow: React.FC<{
  pal: Palette;
  type: string;
  when: string;
  tone?: Tone;
  hue?: string;
  at?: number;
  live?: boolean;
}> = ({ pal, type, when, tone = "dark", hue, at: a = 20, live = false }) => {
  const k = useK();
  const p = useAppearAt(a, 200);
  const dark = tone === "dark";
  const c = hue ?? pal.accent;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12 * k,
        padding: `${12 * k}px ${18 * k}px`,
        borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.06)" : pal.border}`,
        background: live ? `${c}${alpha(dark ? 0.16 : 0.06)}` : "transparent",
        opacity: p,
      }}
    >
      <span
        style={{
          width: 8 * k,
          height: 8 * k,
          borderRadius: "50%",
          background: live ? c : dark ? "rgba(255,255,255,0.28)" : "#C6CEDA",
          flexShrink: 0,
          boxShadow: live ? `0 0 ${10 * k}px ${c}` : undefined,
        }}
      />
      <span
        style={{
          ...tabular(18 * k),
          color: dark ? (live ? "#FFFFFF" : "rgba(255,255,255,0.7)") : live ? pal.ink : pal.textBody,
          flex: 1,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {type}
      </span>
      <span style={{ ...tabular(16 * k), color: dark ? "rgba(255,255,255,0.4)" : pal.textMuted, flexShrink: 0 }}>
        {when}
      </span>
    </div>
  );
};

/* ── the terminal ────────────────────────────────────────────────────────────
 *
 * A real black macOS window, typing.
 *
 * The thing it replaces — a light card with a 4px coloured left border and a
 * block of pre-rendered monospace — is the single most generated-looking object
 * in motion design. Two reasons it fails, and the terminal fixes both:
 *
 *   The coloured edge is decoration pretending to be information. Nothing in
 *   the content chose that colour; it is there because a flat card looked
 *   empty. Real developer surfaces are almost monochrome, and the ONE place
 *   colour belongs on this window is the three traffic lights, because those
 *   are colours the viewer has seen ten thousand times and would notice as
 *   wrong.
 *
 *   Code that is simply PRESENT was never typed. A viewer reads a full code
 *   block in about a second and then waits. Typing it turns the same six lines
 *   into six seconds of a beat that keeps delivering — and the cursor gives the
 *   frame something alive in it without a single decorative element.
 *
 * The typing is frame-derived, so it survives a render, and `cps` is faster
 * than a person types on purpose: the viewer needs to READ the command, not
 * watch it being entered.
 */

export type TermLine = {
  text: string;
  /** A shell prompt prefix, for a command rather than output. */
  prompt?: string;
  /** Output lines are dimmer and arrive whole instead of typing. */
  out?: boolean;
  /** A substring lit in the accent — the one token the beat is about. */
  hot?: string;
  /** Skip typing this line and just hold it. */
  instant?: boolean;
};

/**
 * `start` is a FRAME, `cps` characters per second. Pass the same pair to
 * `TypeCues` from lib/sound and the key taps land on the characters.
 */
export const Terminal: React.FC<{
  pal: Palette;
  lines: TermLine[];
  title: string;
  w: number;
  h?: number;
  start?: number;
  cps?: number;
  at?: number;
  accent?: string;
  size?: number;
  /** Render every line already typed — for a beat that opens on the result. */
  done?: boolean;
}> = ({
  pal,
  lines,
  title,
  w,
  h,
  start = 14,
  cps = 42,
  at = 8,
  accent,
  size = 23,
  done = false,
}) => {
  const k = useK();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = useAppearAt(at, 190);
  const hue = accent ?? pal.accent;

  // One budget of characters spent down the list, so line 4 starts when line 3
  // finishes — the same way a terminal actually fills.
  const budget = done ? Infinity : Math.max(0, ((frame - start) / fps) * cps);
  let spent = 0;
  const shown = lines.map((l) => {
    const full = (l.prompt ?? "") + l.text;
    if (spent >= budget) {
      spent += full.length + (l.out ? 0 : 6); // a beat of thinking between lines
      return { l, n: 0 };
    }
    const left = budget - spent;
    // Output does not type — a machine answers all at once.
    const n = l.out || l.instant ? (left > 0 ? full.length : 0) : Math.min(full.length, Math.floor(left));
    spent += full.length + (l.out ? 0 : 6);
    return { l, n };
  });
  const typing = shown.some((s) => s.n > 0 && s.n < (s.l.prompt ?? "").length + s.l.text.length);
  const lastLit = shown.reduce((acc, s, i) => (s.n > 0 ? i : acc), -1);

  return (
    <div
      style={{
        width: w * k,
        height: h ? h * k : undefined,
        borderRadius: 14 * k,
        overflow: "hidden",
        background: TERM_BG,
        // ONE hairline, and it is not a colour. The window reads as a window
        // because of its chrome, never because of its edge.
        border: `1px solid rgba(255,255,255,0.10)`,
        boxShadow: SHADOW[3],
        opacity: p,
        transform: `translateY(${lerp(12, 0, p) * k}px) scale(${lerp(0.975, 1, p)})`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          position: "relative",
          height: 44 * k,
          background: TERM_BAR,
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          alignItems: "center",
          padding: `0 ${16 * k}px`,
          flexShrink: 0,
        }}
      >
        {TERM_LIGHTS.map((c) => (
          <span
            key={c}
            style={{
              width: 12 * k,
              height: 12 * k,
              borderRadius: "50%",
              background: c,
              marginRight: 8 * k,
              flexShrink: 0,
            }}
          />
        ))}
        {/* macOS centres the title in the bar, not beside the lights. */}
        <span
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            textAlign: "center",
            ...tabular(16 * k),
            color: "rgba(255,255,255,0.42)",
            pointerEvents: "none",
          }}
        >
          {title}
        </span>
      </div>

      <div
        style={{
          flex: 1,
          padding: `${20 * k}px ${22 * k}px`,
          fontFamily: MONO,
          fontSize: size * k,
          lineHeight: 1.62,
          color: TERM_INK,
          whiteSpace: "pre",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {shown.map(({ l, n }, i) => {
          if (n <= 0) return <div key={i} style={{ height: size * 1.62 * k }} />;
          const full = (l.prompt ?? "") + l.text;
          const vis = full.slice(0, n);
          const isCursor = !done && i === lastLit && typing;
          return (
            <div key={i} style={{ color: l.out ? TERM_DIM : TERM_INK }}>
              {l.prompt && (
                <span style={{ color: hue, opacity: 0.85 }}>{vis.slice(0, Math.min(n, l.prompt.length))}</span>
              )}
              <HotSpan
                text={vis.slice(Math.min(n, (l.prompt ?? "").length))}
                hot={l.hot}
                hue={hue}
              />
              {isCursor && (
                <span
                  style={{
                    display: "inline-block",
                    width: size * 0.56 * k,
                    height: size * 1.02 * k,
                    background: TERM_INK,
                    verticalAlign: "text-bottom",
                    opacity: frame % 26 < 16 ? 0.9 : 0.25,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** Lights one substring once it has finished typing. */
const HotSpan: React.FC<{ text: string; hot?: string; hue: string }> = ({ text, hot, hue }) => {
  if (!hot || !text.includes(hot)) return <>{text}</>;
  const [a, ...rest] = text.split(hot);
  return (
    <>
      {a}
      <span style={{ color: hue, background: `${hue}22`, borderRadius: 3, padding: "0 3px" }}>{hot}</span>
      {rest.join(hot)}
    </>
  );
};

/* ── the shimmer ─────────────────────────────────────────────────────────────
 *
 * A multi-stop highlight band sweeping across a headline, clipped to the glyphs.
 *
 * Ported rather than copied, for the usual reason: the source drives the sweep
 * with the Web Animations API and measures the text with
 * `getBoundingClientRect`. Both are wall-clock and layout-dependent — a render
 * would either freeze the sweep or sample it wherever the encoder happened to
 * be. Here the position comes from the frame and the band is sized in `em`, so
 * nothing waits on measurement and nothing depends on when the browser painted.
 *
 * The sweep runs, pauses, and runs again. The pause is the part people skip and
 * it is the part that works: a highlight that never stops reads as a loading
 * skeleton, and one that passes every few seconds reads as light moving over a
 * surface. Use it on ONE headline in a film — the title. A second one and it is
 * a effect rather than a finish.
 */
export const ShimmerText: React.FC<{
  children: string;
  /** Band colours, left to right across the sweep. */
  stops?: string[];
  /** The colour the band fades back into — the real text colour. */
  base?: string;
  /** Seconds for one pass. */
  duration?: number;
  /** Seconds of stillness between passes. */
  pause?: number;
  /** Frame the first sweep starts on. */
  start?: number;
  angle?: number;
  /** Band half-width, in em of the text size. */
  spread?: number;
  style?: React.CSSProperties;
}> = ({
  children,
  stops = ["#F5E9D4", "#F7B267", "#F96BEE", "#C3B7F7", "#FFFFFF"],
  base = "#FFFFFF",
  duration = 1.9,
  pause = 1.5,
  start = 0,
  angle = 105,
  spread = 1.6,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, (frame - start) / fps);
  const cycle = duration + pause;
  const phase = (t % cycle) / duration; // >1 during the pause — parked off-text
  const p = Math.min(1, phase);
  // Ease-in-out, so the band dwells off the text at both ends and accelerates
  // across the glyphs. A linear sweep reads mechanical.
  const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
  // −20% → 120% of the text box, so the band enters and leaves cleanly.
  const pos = -20 + e * 140;

  const band = [
    `${base} calc(${pos}% - ${spread * 2}em)`,
    ...stops.map((c, i) => {
      const f = (i / Math.max(1, stops.length - 1) - 0.5) * 2 * spread;
      return `${c} calc(${pos}% + ${f.toFixed(3)}em)`;
    }),
    `${base} calc(${pos}% + ${spread * 2}em)`,
  ].join(", ");

  return (
    <span
      style={{
        display: "inline-block",
        backgroundImage: `linear-gradient(${angle}deg, ${band})`,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        // text-fill-color rather than `color: transparent`, so the base colour
        // in the band still resolves against the real ink.
        WebkitTextFillColor: "transparent",
        ...style,
      }}
    >
      {children}
    </span>
  );
};

/* ── the box pattern ─────────────────────────────────────────────────────── */

/**
 * The hairline plate every box sits on. A 1px grid at a fixed pitch, faded from
 * the centre so it never competes with what is on top of it.
 *
 * It is doing one job: giving a flat panel a SURFACE. A box floating on plain
 * canvas has no scale to it; the same box on a measured grid reads as a plan.
 */
export const GridPlate: React.FC<{
  pal: Palette;
  pitch?: number;
  tone?: Tone;
  opacity?: number;
  radius?: number;
  style?: React.CSSProperties;
}> = ({ pal, pitch = 56, tone = "light", opacity = 1, radius = 0, style }) => {
  const k = useK();
  const line = tone === "dark" ? "rgba(255,255,255,0.07)" : `${pal.ink}12`;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: radius,
        opacity,
        backgroundImage: `linear-gradient(${line} 1px, transparent 1px), linear-gradient(90deg, ${line} 1px, transparent 1px)`,
        backgroundSize: `${pitch * k}px ${pitch * k}px`,
        maskImage: "radial-gradient(120% 100% at 50% 50%, #000 30%, transparent 88%)",
        WebkitMaskImage: "radial-gradient(120% 100% at 50% 50%, #000 30%, transparent 88%)",
        pointerEvents: "none",
        ...style,
      }}
    />
  );
};

/**
 * The chapter slate. A number set enormous and thin, a title, and a rule that
 * draws itself across the box — the one moment in the film where the frame is
 * allowed to be almost empty.
 */
export const ChapterBox: React.FC<{
  pal: Palette;
  n: string;
  title: string;
  sub?: string;
  at?: number;
  tone?: Tone;
  w?: number;
}> = ({ pal, n, title, sub, at = 6, tone = "light", w = 1180 }) => {
  const k = useK();
  const frame = useCurrentFrame();
  const p = useAppearAt(at, 200);
  const dark = tone === "dark";
  const rule = interpolate(frame, [at + 14, at + 46], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.25, 0, 0.15, 1),
  });
  return (
    <div
      style={{
        position: "relative",
        width: w * k,
        padding: `${54 * k}px ${58 * k}px`,
        borderRadius: R.xl * k,
        background: dark ? `${DARK}E6` : `${pal.bg}E6`,
        border: `1px solid ${dark ? "rgba(255,255,255,0.14)" : pal.border}`,
        boxShadow: SHADOW[2],
        backdropFilter: "blur(14px)",
        opacity: p,
        transform: `scale(${lerp(0.96, 1, p)})`,
        overflow: "hidden",
      }}
    >
      <GridPlate pal={pal} tone={tone} opacity={0.9} />
      <div style={{ position: "relative", display: "flex", alignItems: "flex-start", gap: 44 * k }}>
        <span
          style={{
            ...display(140 * k, -0.05),
            color: pal.accent,
            fontVariantNumeric: "tabular-nums",
            lineHeight: 0.86,
          }}
        >
          {n}
        </span>
        <div style={{ flex: 1, paddingTop: 8 * k }}>
          <div style={{ ...display(58 * k, -0.032), color: dark ? "#FFFFFF" : pal.ink }}>{title}</div>
          <div
            style={{
              height: 2 * k,
              width: `${rule * 100}%`,
              background: pal.accent,
              marginTop: 24 * k,
              marginBottom: sub ? 24 * k : 0,
            }}
          />
          {sub && (
            <div
              style={{
                fontFamily: SANS,
                fontWeight: 300,
                fontSize: 28 * k,
                lineHeight: 1.4,
                color: dark ? "rgba(255,255,255,0.7)" : pal.textMuted,
              }}
            >
              {sub}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * The inline version — a bordered box around the one thing on the beat that
 * matters, with an eyebrow tag notched into its top edge.
 *
 * Use it sparingly. The box means "this, specifically"; two of them on a frame
 * means neither.
 */
export const HighlightBox: React.FC<{
  pal: Palette;
  label?: string;
  at?: number;
  tone?: Tone;
  hue?: string;
  pad?: number;
  grid?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ pal, label, at = 8, tone = "light", hue, pad = 28, grid = true, style, children }) => {
  const k = useK();
  const p = useAppearAt(at, 200);
  const dark = tone === "dark";
  const c = hue ?? pal.accent;
  return (
    <div
      style={{
        position: "relative",
        borderRadius: R.lg * k,
        // A HAIRLINE, not a coloured frame. The label tag carries the accent;
        // the box itself never does. A coloured rectangle around content is
        // decoration wearing the costume of emphasis.
        border: `1px solid ${dark ? "rgba(255,255,255,0.12)" : pal.border}`,
        background: dark ? TERM_BG : pal.bgDeep,
        padding: pad * k,
        opacity: p,
        transform: `scale(${lerp(0.97, 1, p)})`,
        ...style,
      }}
    >
      {grid && <GridPlate pal={pal} tone={tone} pitch={40} opacity={0.7} radius={R.lg * k} />}
      {label && (
        <div
          style={{
            position: "absolute",
            top: -11 * k,
            left: 24 * k,
            background: dark ? TERM_BG : pal.bg,
            padding: `0 ${12 * k}px`,
            ...microCap(16 * k),
            color: c,
          }}
        >
          {label}
        </div>
      )}
      <div style={{ position: "relative" }}>{children}</div>
    </div>
  );
};

/**
 * DESIGN.md's one filled button, as a graphic element — the indigo pill. Used
 * as a LABEL on this brand's surfaces, never as a real control.
 */
export const Pill: React.FC<{
  pal: Palette;
  children: React.ReactNode;
  filled?: boolean;
  hue?: string;
  size?: number;
  at?: number;
}> = ({ pal, children, filled = true, hue, size = 20, at = 8 }) => {
  const k = useK();
  const p = useAppearAt(at, 200);
  const c = hue ?? pal.accent;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        background: filled ? c : pal.bg,
        color: filled ? "#FFFFFF" : c,
        border: filled ? "none" : `1px solid ${c}`,
        borderRadius: R.pill,
        padding: `${8 * k}px ${16 * k}px`,
        fontFamily: SANS,
        fontWeight: 400,
        fontSize: size * k,
        letterSpacing: "-0.01em",
        lineHeight: 1,
        opacity: p,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
};
