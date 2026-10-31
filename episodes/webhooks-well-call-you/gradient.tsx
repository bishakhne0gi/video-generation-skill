// Author: Bishakh
//
// THE RIBBON FIELD — the animated gradient the marketing surfaces sit on.
//
// A port of the 21st.dev "gg" gradient (Ribbon Field / stripes) into something
// Remotion can render deterministically. The original is a requestAnimationFrame
// canvas loop; rAF is exactly the thing that cannot exist in a frame-pure render,
// so the clock is derived from `useCurrentFrame()` instead and every frame
// re-derives the field from scratch.
//
// HOW IT IS BUILT, and why it is built that way:
//
// The field is a stripe gradient laid along `angle`. The wave bends the bands by
// displacing the field ALONG the gradient axis as a function of the CROSS axis —
// so the honest construction is a stack of very thin slabs, each carrying the
// same linear gradient, each shifted sideways by that slab's wave offset. 800
// slabs at 1080p puts the sideways step between neighbours under two frame
// pixels, and the `soften` blur closes what is left.
//
// Doing it as four wavy `<path>` bands would have been fewer nodes and wrong:
// the per-boundary ramp widths in the source gradient are not uniform (the
// white→coral transition is 4.7% wide, the ruby→charcoal one is 0.36%), and a
// path-per-band construction can only feather them all the same. Carrying the
// real stop list on every slab keeps the palette distribution exact.
//
// THE MOTION RULE FROM THE SOURCE, kept: every modulation must be exactly zero
// at t = 0, or the field visibly snaps the moment motion starts. Here that is
// automatic — the wave clock STARTS at its phase constant (20.75) and advances
// from there, and the angle sway is multiplied by `motionAmount`, which the gg
// preset sets to 0. Hard bands sway; they never spin.
//
// Nothing is quantised. No Math.round on the angle, the offsets or the stop
// positions — rounding those per frame is precisely what makes gradient motion
// visibly step.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { rand } from "./anim";

export type Stop = { hex: string; at: number };

/**
 * THE BRAND FIELD — the stop list an episode built on DESIGN.md should use.
 *
 * Read the source prompt for the gg gradient as a description of the MACHINE —
 * a feathered stripe field bent by a cross-axis sine, grained, on a slow clock —
 * and not as a palette. Its own colours are ruby and charcoal, and dropping
 * those into a system whose primary is indigo #533afd produces a film that is
 * technically the right gradient and visibly the wrong brand.
 *
 * So the machine is kept and the stops come from DESIGN.md's mesh: pastel cream,
 * sherbet orange, lavender, electric indigo, ruby pink. Indigo owns the middle
 * and the mass, because it is the brand; ruby is a thin stripe near the tail
 * because DESIGN.md says ruby is a gradient stop and never a surface; and the
 * field lands on brand-dark-900 so white type has somewhere to sit.
 */
export const BRAND_STOPS: Stop[] = [
  { hex: "#FFFFFF", at: 0 },
  { hex: "#FBF6EE", at: 9 },
  { hex: "#F5E9D4", at: 19 }, // canvas-cream
  { hex: "#F7B267", at: 27 }, // sherbet — thin, it is a highlight not a band
  { hex: "#D9C9F5", at: 38 },
  { hex: "#C3B7F7", at: 46 }, // lavender
  { hex: "#665EFD", at: 57 }, // primary-soft
  { hex: "#533AFD", at: 68 }, // primary — the mass
  { hex: "#4434D4", at: 79 }, // primary-deep
  { hex: "#EA2261", at: 88 }, // ruby — the accent stripe, and only a stripe
  { hex: "#1C1E54", at: 100 }, // brand-dark-900
];

/**
 * The gg preset, verbatim — the stop list from the source CSS rather than the
 * four `pos` values, because the ramps between them are not uniform and the
 * unevenness is the character.
 *
 * Kept as a reference specimen. Do not put it under an episode that has a brand.
 */
export const GG_STOPS: Stop[] = [
  { hex: "#FFFFFF", at: 4.32 },
  { hex: "#FFFFFF", at: 33.18 },
  { hex: "#B96A96", at: 37.86 },
  { hex: "#B96A96", at: 58.14 },
  { hex: "#950F46", at: 58.86 },
  { hex: "#950F46", at: 79.64 },
  { hex: "#4D0026", at: 80 },
  { hex: "#4D0026", at: 100 },
];

/**
 * The DESIGN.md mesh, as a ribbon field: pastel cream → sherbet → lavender →
 * electric indigo → ruby → magenta. Same machine, the brand's own hues, so the
 * marketing surfaces and the gg surfaces are one system rather than two.
 */
export const MESH_STOPS: Stop[] = [
  { hex: "#F5E9D4", at: 0 },
  { hex: "#F5E9D4", at: 17 },
  { hex: "#F7B267", at: 27 },
  { hex: "#C3B7F7", at: 42 },
  { hex: "#533AFD", at: 58 },
  { hex: "#4434D4", at: 70 },
  { hex: "#EA2261", at: 86 },
  { hex: "#F96BEE", at: 100 },
];

/** The mesh at marketing-hero weight — cream and indigo, ruby only at the tail. */
export const MESH_SOFT_STOPS: Stop[] = [
  { hex: "#FFFFFF", at: 0 },
  { hex: "#F6F9FC", at: 14 },
  { hex: "#F5E9D4", at: 30 },
  { hex: "#C3B7F7", at: 52 },
  { hex: "#533AFD", at: 74 },
  { hex: "#1C1E54", at: 100 },
];

/* ── the bloom field ─────────────────────────────────────────────────────────
 *
 * A big soft radial glow rising off one edge, under heavy moving grain.
 *
 * Ported from the "noisy gradient backgrounds" component, and it is a PORT, not
 * a copy — the original paints per-pixel noise with `Math.random()` inside a
 * `requestAnimationFrame` loop, and both of those are wall-clock and
 * non-deterministic, which is exactly what a frame-by-frame render cannot have.
 * Same picture, rebuilt on `useCurrentFrame()` and a seeded noise tile.
 *
 * Why it is here alongside the ribbon field, rather than replacing it outright:
 * the ribbon field is BANDED — hard edges, a lot of contrast, and a palette that
 * changes sharply across the frame. That is right behind a title and wrong
 * behind a diagram, because the bands cut through the content. The bloom has no
 * edges at all, so it can sit under anything.
 *
 * The grain is not optional here and it is not a texture. At 0% grain this is a
 * CSS radial gradient and looks like one — flat, digital, obviously computed.
 * The moving grain is the entire difference between that and something that
 * looks photographed.
 * ─────────────────────────────────────────────────────────────────────────── */

export type BloomOrigin =
  | "bottom-middle" | "bottom-left" | "bottom-right"
  | "top-middle" | "top-left" | "top-right"
  | "left-middle" | "right-middle" | "center";

const ORIGIN_XY: Record<BloomOrigin, [number, number]> = {
  "bottom-middle": [50, 101], "bottom-left": [0, 101], "bottom-right": [100, 101],
  "top-middle": [50, -1], "top-left": [0, -1], "top-right": [100, -1],
  "left-middle": [-1, 50], "right-middle": [101, 50], "center": [50, 50],
};

/**
 * DESIGN.md's mesh as a bloom: electric indigo at the core, lavender through
 * the middle, and the cool off-white canvas at the far edge. This is the
 * brand's own hero, and it is what white type sits on.
 */
export const BLOOM_INDIGO: Stop[] = [
  { hex: "#3B23D6", at: 0 },
  { hex: "#4434D4", at: 11 },
  { hex: "#533AFD", at: 18 },
  { hex: "#665EFD", at: 26 },
  { hex: "#8E86FB", at: 38 },
  { hex: "#C3B7F7", at: 54 },
  { hex: "#DED6F6", at: 70 },
  { hex: "#EDEFF7", at: 86 },
  { hex: "#F6F9FC", at: 100 },
];

/**
 * The warm interlude — canvas-cream and sherbet at the core, resolving through
 * lavender into canvas. DESIGN.md's chromatic break, for the acts that should
 * not be blue.
 */
export const BLOOM_CREAM: Stop[] = [
  { hex: "#F0A24E", at: 0 },
  { hex: "#F7B267", at: 12 },
  { hex: "#F3C98E", at: 22 },
  { hex: "#F5E9D4", at: 36 },
  { hex: "#EBD9E4", at: 52 },
  { hex: "#C3B7F7", at: 70 },
  { hex: "#E4E9F3", at: 88 },
  { hex: "#FFFFFF", at: 100 },
];

/** Ruby into indigo — the accent bloom, for the one beat that earns it. */
export const BLOOM_RUBY: Stop[] = [
  { hex: "#C4104A", at: 0 },
  { hex: "#EA2261", at: 14 },
  { hex: "#F96BEE", at: 28 },
  { hex: "#B39BF3", at: 46 },
  { hex: "#533AFD", at: 64 },
  { hex: "#2E2B8C", at: 82 },
  { hex: "#1C1E54", at: 100 },
];

export type BloomProps = {
  stops?: Stop[];
  origin?: BloomOrigin;
  /** Radius as a % of the frame. The source preset is 125. */
  size?: number;
  /** A second, offset bloom under the first. Depth for free. */
  second?: Stop[];
  secondOrigin?: BloomOrigin;
  secondSize?: number;
  secondOpacity?: number;
  /**
   * How far the core wanders, in % of frame. 0 pins it.
   *
   * This and `breathe` are the whole motion budget, and they are easy to
   * under-set: a bloom is so soft that small values produce a field measurably
   * MORE static than a hard-banded one, even though it is technically moving.
   * If a pacing audit says a bloom beat is still, this is the dial.
   */
  wander?: number;
  /** How much the radius breathes, as a fraction. */
  breathe?: number;
  /** Seconds per full cycle. Under ~10 it stops being weather and starts pulsing. */
  period?: number;
  grain?: number;
  /** Grain tile size in px. Larger = coarser, more filmic, less digital. */
  grainScale?: number;
  opacity?: number;
  atSeconds?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

const gradientOf = (stops: Stop[], x: number, y: number, w: number, h: number) =>
  `radial-gradient(${w.toFixed(2)}% ${h.toFixed(2)}% at ${x.toFixed(2)}% ${y.toFixed(2)}%, ` +
  stops.map((s) => `${s.hex} ${s.at}%`).join(", ") +
  ")";

export const BloomField: React.FC<BloomProps> = ({
  stops = BLOOM_INDIGO,
  origin = "bottom-middle",
  size = 125,
  second,
  secondOrigin = "top-right",
  secondSize = 105,
  secondOpacity = 0.55,
  wander = 5.6,
  breathe = 0.11,
  period = 15,
  grain = 66,
  grainScale = 140,
  opacity = 1,
  atSeconds,
  style,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = atSeconds ?? frame / fps;
  const w = (2 * Math.PI) / Math.max(1, period);

  // Every modulation written as sin(x + p) − sin(p), so all of them are exactly
  // 0 at t = 0 and the field never snaps when it starts. Same rule the ribbon
  // field follows, and the reason is the same: a background that jumps on frame
  // one is the first thing a viewer notices and the last thing they forgive.
  const s1 = (a: number, p: number) => Math.sin(a + p) - Math.sin(p);

  const [ox, oy] = ORIGIN_XY[origin];
  const x = ox + s1(t * w, 0.7) * wander;
  const y = oy + s1(t * w * 0.73, 2.1) * wander * 0.6;
  const r = size * (1 + s1(t * w * 0.61, 1.2) * breathe);

  const [sx, sy] = ORIGIN_XY[secondOrigin];
  const x2 = sx + s1(t * w * 0.84, 3.4) * wander * 1.3;
  const y2 = sy + s1(t * w * 0.55, 0.3) * wander;
  const r2 = secondSize * (1 + s1(t * w * 0.47, 2.6) * breathe * 1.4);

  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity, ...style }}>
      <AbsoluteFill style={{ background: gradientOf(stops, x, y, r, r * 0.98) }} />
      {second && (
        <AbsoluteFill
          style={{
            background: gradientOf(second, x2, y2, r2, r2 * 0.92),
            opacity: secondOpacity,
            mixBlendMode: "soft-light",
          }}
        />
      )}
      {grain > 0 && <Grain amount={grain} atSeconds={atSeconds} tile={grainScale} />}
      {children}
    </AbsoluteFill>
  );
};

export type RibbonProps = {
  /** Degrees. The gg preset is 38. */
  angle?: number;
  stops?: Stop[];
  /** 0–100. The gg preset is 14. 0 gives dead-straight bands. */
  wave?: number;
  /** Cross-axis wave cycles across the field. The source uses 2.4. */
  waveCycles?: number;
  /** Where the wave clock starts. The source constant is 20.75. */
  wavePhase?: number;
  /** Wave clock speed, in radians of phase per second. The source uses 1.2. */
  waveSpeed?: number;
  /** 0–100, the preset's `speed`. Scales the whole clock. */
  speed?: number;
  /** 0–1, the preset's `motionAmount`. gg ships 0: bands sway, never spin. */
  motionAmount?: number;
  /** Feather, in frame pixels. Closes the slab seams and reads as `softness`. */
  soften?: number;
  /** 0–100 grain, the preset's `grain`. 42 → 0.21 opacity, as in the source CSS. */
  grain?: number;
  /**
   * Second wave harmonic — cycles, speed and amplitude relative to the first.
   * One sine across a field reads as a wipe; two incommensurate ones read as a
   * material. This is most of why the field looks like a shader and not a
   * gradient with an animation on it.
   */
  wave2?: number;
  wave2Cycles?: number;
  wave2Speed?: number;
  /** Zoom on the gradient axis. >1 shows less of the ramp across the frame. */
  zoom?: number;
  /** Scrolls the field along its own axis, in fractions of the axis. */
  offset?: number;
  /**
   * Fractions of the axis the field travels per second. THE motion cue — the
   * wave bends the bands, but only the drift makes them go anywhere, and
   * without it a viewer reads the field as a still image with a wobble.
   * At 0.008 a band edge travels about 20px a second on a 1080p frame — slow
   * enough to stay out of the way of the reading, fast enough that nobody would
   * call it a still image. Requires the gradient's `spreadMethod="reflect"`
   * below, or it scrolls off the end of its own stop list.
   */
  drift?: number;
  /** Whole-field opacity, for running it under content. */
  opacity?: number;
  /** Absolute seconds to evaluate at, instead of this Sequence's local frame. */
  atSeconds?: number;
  style?: React.CSSProperties;
};

/**
 * Full-bleed animated stripe field. Drop it as the first child of an
 * `AbsoluteFill` and put content over it.
 */
export const RibbonField: React.FC<RibbonProps> = ({
  angle = 38,
  stops = BRAND_STOPS,
  wave = 34,
  waveCycles = 2.4,
  wavePhase = 20.75,
  waveSpeed = 1.9,
  wave2 = 17,
  wave2Cycles = 1.15,
  wave2Speed = -1.15,
  speed = 100,
  motionAmount = 0.34,
  soften = 7,
  grain = 62,
  zoom = 1,
  offset = 0,
  drift = 0.021,
  opacity = 1,
  atSeconds,
  style,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const t = (atSeconds ?? frame / fps) * (speed / 100);
  const clock = wavePhase + t * waveSpeed;
  // The second clock runs backwards and at an irrational-ish ratio to the first,
  // so the two never come back into phase and the field never repeats.
  const clock2 = wavePhase * 0.37 + t * wave2Speed;

  // The one sway the preset permits, written as sin(x + p) − sin(p) so it is
  // exactly 0 at t = 0. With the gg preset's motionAmount of 0 this is a no-op,
  // and it stays in because the moment anyone raises that number the field has
  // to sway from where it already is rather than jumping there.
  const spin = t;
  const ang =
    angle + (Math.sin(spin * 0.6 + wavePhase) - Math.sin(wavePhase)) * 28 * motionAmount;

  const cx = width / 2;
  const cy = height / 2;
  // Oversized so no rotation of the field can expose an edge of it.
  const span = Math.hypot(width, height) * 1.16;
  const x0 = cx - span / 2;
  const y0 = cy - span / 2;

  // 800 slabs puts the sideways step between neighbours under two frame pixels
  // at the wave's steepest point; below ~500 the staircase shows on the hard
  // ruby→charcoal edge, which is the one boundary with no ramp to hide it.
  const SLABS = 800;
  const sh = span / SLABS;
  const amp = (wave / 100) * 0.35 * span;
  const amp2 = (wave2 / 100) * 0.35 * span;

  const axis = span / Math.max(0.05, zoom);
  // `drift` is what actually makes the bands travel. It is applied to the
  // gradient's own origin rather than to the slabs, so the field slides
  // through the frame without the wave shape sliding with it.
  const ax0 = cx - axis / 2 + (offset + drift * t) * axis;

  const id = React.useId().replace(/[:]/g, "");

  const slabs: React.ReactNode[] = [];
  for (let i = 0; i < SLABS; i++) {
    const v = (i + 0.5) / SLABS;
    const dx =
      amp * Math.sin(v * waveCycles * Math.PI * 2 + clock) +
      amp2 * Math.sin(v * wave2Cycles * Math.PI * 2 + clock2);
    slabs.push(
      <rect
        key={i}
        x={x0 + dx}
        y={y0 + i * sh}
        width={span}
        // +1 rather than exactly sh: adjacent slabs must overlap by a hair or
        // sub-pixel rasterisation leaves hairline gaps that read as scan lines.
        height={sh + 1}
        fill={`url(#rf${id})`}
      />,
    );
  }

  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity, ...style }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{
          position: "absolute",
          inset: 0,
          filter: soften > 0 ? `blur(${soften}px)` : undefined,
          // The blur eats into the frame edge; scale past it rather than
          // letting a soft white rim appear on all four sides.
          scale: soften > 0 ? `${1 + (soften * 2.5) / width}` : undefined,
        }}
      >
        <defs>
          <linearGradient
            id={`rf${id}`}
            gradientUnits="userSpaceOnUse"
            // REFLECT, not the default pad. Drift accumulates without bound —
            // over a two-minute film it scrolls the gradient more than a full
            // axis length, and with `pad` everything past the last stop is the
            // last stop, so the field silently degrades to a flat colour and
            // then to solid white. Reflect mirrors instead: the palette
            // ping-pongs, there is no seam to see, and the drift can run
            // forever. This is the difference between a field that moves for
            // eight seconds and one that is alive for the whole episode.
            spreadMethod="reflect"
            x1={ax0}
            y1={0}
            x2={ax0 + axis}
            y2={0}
          >
            {stops.map((s, i) => (
              <stop key={i} offset={`${s.at}%`} stopColor={s.hex} />
            ))}
          </linearGradient>
        </defs>
        <g transform={`rotate(${ang} ${cx} ${cy})`}>{slabs}</g>
      </svg>

      {grain > 0 && <Grain amount={grain} atSeconds={atSeconds} />}
    </AbsoluteFill>
  );
};

/**
 * FILM GRAIN — fractal noise at baseFrequency 0.9, two octaves, tiled at 120px,
 * composited `overlay`, exactly as the source CSS specifies it.
 *
 * With ONE difference that matters more than everything else in this file: it
 * moves. The source is a CSS background, and a CSS background is a static
 * texture — laid on a video it renders the identical noise on all 3,471 frames,
 * which does not read as grain. It reads as dirt on the lens. Grain is grain
 * because it is different every frame.
 *
 * So the tile is re-seeded and re-offset per frame from `rand(frame)`, which is
 * deterministic (Remotion frame purity survives) and reshuffles the noise
 * completely each time. Four seeds cycling stops the offset alone from reading
 * as a texture sliding around.
 *
 * `still` opts back out — a grain that crawls under a paused hero card is
 * occasionally what you want, and it is never what you want under a whole film.
 */
export const Grain: React.FC<{
  amount?: number;
  blend?: React.CSSProperties["mixBlendMode"];
  still?: boolean;
  /** Absolute seconds, when the grain must be continuous across a Sequence cut. */
  atSeconds?: number;
  /** Tile size in px. Larger reads coarser and more filmic, less digital. */
  tile?: number;
}> = ({ amount = 42, blend = "overlay", still = false, atSeconds, tile = 120 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = still ? 0 : Math.round((atSeconds ?? frame / fps) * fps);
  const seed = still ? 2 : 2 + (f % 4);
  const ox = still ? 0 : Math.round(rand(f + 1) * tile);
  const oy = still ? 0 : Math.round(rand(f + 97) * tile);
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='${seed}' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='${(
          (amount / 100) *
          0.5
        ).toFixed(3)}'/></svg>")`,
        backgroundSize: `${tile}px ${tile}px`,
        backgroundPosition: `${ox}px ${oy}px`,
        mixBlendMode: blend,
        pointerEvents: "none",
      }}
    />
  );
};

/**
 * The mesh as a HEADER BAND rather than a full bleed — DESIGN.md's actual
 * marketing construction, where the gradient owns the upper third and the page
 * below it is canvas. `height` is a fraction of the frame.
 *
 * The fade at the bottom is a mask rather than a white overlay so whatever sits
 * behind the band still shows through the tail of it.
 */
export const RibbonBand: React.FC<RibbonProps & { height?: number; fade?: number }> = ({
  height: h = 0.38,
  fade = 0.34,
  ...rest
}) => (
  <AbsoluteFill style={{ overflow: "hidden" }}>
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        height: `${h * 100}%`,
        maskImage: `linear-gradient(to bottom, #000 ${(1 - fade) * 100}%, transparent 100%)`,
        WebkitMaskImage: `linear-gradient(to bottom, #000 ${(1 - fade) * 100}%, transparent 100%)`,
        overflow: "hidden",
      }}
    >
      {/* The field is authored against the full frame and then cropped, so the
          band shows the SAME part of the gradient it would in a full bleed —
          re-deriving it against the band's own height would change the angle's
          apparent slope every time the band is resized. */}
      <RibbonField {...rest} />
    </div>
  </AbsoluteFill>
);
