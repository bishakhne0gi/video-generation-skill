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
 * EP 18's field — the director's own stripe gradient, taken verbatim.
 *
 * Supplied as CSS: `linear-gradient(32deg, #FFFFFF 3.84%, #FFFFFF 30.16%,
 * #78B8F9 35.2%, #78B8F9 53.8%, #5667FF 56.2%, #5667FF 78.8%, #4D2FF9 80%,
 * #4D2FF9 100%)` under fractalNoise at `baseFrequency 0.9`, two octaves, tiled
 * 120px, `opacity 0.210`, blended `overlay`.
 *
 * That description IS this file's machine, which is why the port is exact
 * rather than approximate: the angle is the prop, the tile and the blend mode
 * are `Grain`'s defaults already, and `grain={42}` reproduces 0.210 to the digit
 * — the component writes `(amount / 100) * 0.5`. Nothing was reinterpreted.
 *
 * The stop POSITIONS carry the character and are kept to two decimals. Note the
 * ramps are deliberately uneven — white holds for 26% and then feathers into
 * azure over 5.04%, while the #5667FF → #4D2FF9 boundary is 1.2% wide and reads
 * as a hard edge. Averaging those would flatten exactly what makes it look like
 * a shader rather than a gradient.
 *
 * Unlike the gg preset below, these hues DO belong to this playlist: #5667FF and
 * #4D2FF9 sit a few degrees off the brand's own #533AFD, so the field and the
 * accent read as one system. They still never appear as a flat fill anywhere in
 * the film — same rule stripe-mesh applies to ruby and magenta.
 */
export const AZURE_STOPS: Stop[] = [
  { hex: "#FFFFFF", at: 3.84 },
  { hex: "#FFFFFF", at: 30.16 },
  { hex: "#78B8F9", at: 35.2 },
  { hex: "#78B8F9", at: 53.8 },
  { hex: "#5667FF", at: 56.2 },
  { hex: "#5667FF", at: 78.8 },
  { hex: "#4D2FF9", at: 80 },
  { hex: "#4D2FF9", at: 100 },
];

/**
 * The same four hues as a BLOOM rather than a stripe field.
 *
 * Both are needed and they are not interchangeable. The stripe field is banded —
 * hard edges and a palette that changes sharply across the frame — which is
 * right behind a title and wrong behind a diagram, because the bands cut
 * straight through the content. This is the same colour story with no edges at
 * all, so a station can sit on it and still be read.
 *
 * Ordered core → rim, so the deep indigo is the source of the glow and the white
 * is where it runs out. That is the supplied gradient read backwards, which is
 * correct: in the CSS the light end is the near corner, and in a bloom the light
 * end is the far field.
 */
export const BLOOM_AZURE: Stop[] = [
  { hex: "#4D2FF9", at: 0 },
  { hex: "#5667FF", at: 14 },
  { hex: "#6A7CFB", at: 26 },
  { hex: "#78B8F9", at: 42 },
  { hex: "#A8D2FB", at: 58 },
  { hex: "#D3E6FD", at: 74 },
  { hex: "#EDF4FE", at: 88 },
  { hex: "#FFFFFF", at: 100 },
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

/* ── the mesh field ──────────────────────────────────────────────────────────
 *
 * EP 20's field, and the third instrument in this file alongside the ribbon and
 * the bloom. It exists because neither of the other two could do this job.
 *
 * The RIBBON is banded — hard edges, high contrast, a palette that changes
 * sharply across the frame. Right behind a title, wrong behind a diagram,
 * because the bands cut straight through the content. The BLOOM has no edges
 * but it is ONE lobe: a single glow off one side, which is atmosphere rather
 * than colour, and it goes flat and grey the moment you dim it enough to put a
 * station on top of it.
 *
 * A mesh gradient is what designers actually reach for when they want a surface
 * that is soft AND chromatic: several wide colour lobes overlapping, each one
 * placed independently, no edge anywhere. That is what this is.
 *
 * WHY IT READS AS A SHADER RATHER THAN AS A GRADIENT WITH AN ANIMATION ON IT —
 * every lobe runs on its OWN clock, and the periods are deliberately chosen to
 * be mutually incommensurate (13.7 / 19.3 / 23.1 / 17.9 / 29.3 seconds). Five
 * sines whose ratios are not rational never return to the same configuration,
 * so the field has no loop point. Give two lobes the same period and the eye
 * finds the cycle inside about twenty seconds; that is the entire difference
 * between weather and a screensaver.
 *
 * THE ZERO-AT-t=0 RULE, same as everywhere else in this file: every modulation
 * is written `sin(x + p) − sin(p)`, so the field starts exactly at its declared
 * layout and drifts away from it. A background that jumps on frame one is the
 * first thing a viewer notices and the last thing they forgive.
 *
 * Nothing is quantised. No Math.round on a centre, a radius or a hue.
 * ─────────────────────────────────────────────────────────────────────────── */

export type Lobe = {
  hex: string;
  /** Rest position, in % of the frame. The lobe wanders around this. */
  x: number;
  y: number;
  /** Radius as a % of the frame. Wide — 60+ — or the lobes read as blobs. */
  size: number;
  /** How far it wanders from rest, in % of frame. */
  wander?: number;
  /** Seconds per cycle. Keep these mutually incommensurate across the set. */
  period?: number;
  /** Where this lobe's clock starts. Also keep these apart. */
  phase?: number;
  /** Peak alpha at the core. */
  strength?: number;
};

/**
 * EP 20's field — the stripe-mesh brand as a mesh rather than as bands.
 *
 * Same hues EP 18's `AZURE_STOPS` carries and the same ones DESIGN.md declares,
 * so the three films read as one system: electric indigo is the mass and the
 * brand, azure and lavender do the middle, and the cool off-white canvas is
 * what everything resolves into. Indigo sits BOTTOM-LEFT and the palest lobe
 * TOP-CENTRE, because every station in that film puts its content in the upper
 * middle of the frame and the field has to be at its quietest exactly there.
 *
 * `strength` is low across the board on purpose. This is a WHITE film: the mesh
 * is a tint on a white page, not a coloured background, and the moment any lobe
 * goes past ~0.5 the panels stop reading as black-on-white and start reading as
 * black-on-blue.
 */
export const MESH_AZURE: Lobe[] = [
  { hex: "#4D2FF9", x: 8, y: 88, size: 78, wander: 7.0, period: 13.7, phase: 0.4, strength: 0.5 },
  { hex: "#5667FF", x: 88, y: 78, size: 72, wander: 6.2, period: 19.3, phase: 2.1, strength: 0.42 },
  { hex: "#78B8F9", x: 74, y: 16, size: 66, wander: 8.4, period: 23.1, phase: 3.9, strength: 0.34 },
  { hex: "#C3B7F7", x: 20, y: 26, size: 70, wander: 7.6, period: 17.9, phase: 5.2, strength: 0.3 },
  { hex: "#F6F9FC", x: 50, y: 48, size: 58, wander: 4.4, period: 29.3, phase: 1.3, strength: 0.55 },
];

/** The same field turned up and pulled in — the title, the open, the end card. */
export const MESH_AZURE_DEEP: Lobe[] = [
  { hex: "#3B23D6", x: 12, y: 84, size: 86, wander: 8.0, period: 13.7, phase: 0.4, strength: 1 },
  { hex: "#5667FF", x: 86, y: 72, size: 80, wander: 7.4, period: 19.3, phase: 2.1, strength: 0.9 },
  { hex: "#78B8F9", x: 70, y: 12, size: 74, wander: 9.0, period: 23.1, phase: 3.9, strength: 0.76 },
  { hex: "#C3B7F7", x: 18, y: 22, size: 72, wander: 8.2, period: 17.9, phase: 5.2, strength: 0.62 },
  // The pale lobe is pushed UP and held down in strength. In the light variant
  // it sits at the centre, which is correct there because the content is dark
  // panels. Here the centre is where the white headline goes, and a pale lobe
  // under white type is the one place this field can defeat its own foreground.
  { hex: "#EDF4FE", x: 52, y: 18, size: 44, wander: 5.0, period: 29.3, phase: 1.3, strength: 0.22 },
];

export type MeshProps = {
  lobes?: Lobe[];
  /** The page under the lobes. On a white film this stays white. */
  base?: string;
  /** Scales every lobe's strength at once — the one dial for "how much field". */
  intensity?: number;
  grain?: number;
  grainScale?: number;
  grainBlend?: React.CSSProperties["mixBlendMode"];
  opacity?: number;
  atSeconds?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

/**
 * Full-bleed animated mesh field. Drop it as the first child of an
 * `AbsoluteFill` and put content over it.
 *
 * The lobes composite in `normal` rather than `screen` or `soft-light`, and
 * that is a deliberate choice rather than an oversight: on a WHITE base every
 * additive blend mode drives straight to white and the field disappears, which
 * is the failure mode that makes a light-theme mesh look like nothing at all.
 * Plain alpha over white keeps each hue as a hue.
 */
export const MeshField: React.FC<MeshProps> = ({
  lobes = MESH_AZURE,
  base = "#FFFFFF",
  intensity = 1,
  grain = 34,
  grainScale = 120,
  grainBlend = "multiply",
  opacity = 1,
  atSeconds,
  style,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = atSeconds ?? frame / fps;

  // sin(x + p) − sin(p): exactly 0 at t = 0, so the field starts where it is
  // declared and drifts away from there rather than snapping into motion.
  const s1 = (a: number, p: number) => Math.sin(a + p) - Math.sin(p);

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: base, opacity, ...style }}>
      {lobes.map((L, i) => {
        const w = (2 * Math.PI) / Math.max(1, L.period ?? 18);
        const ph = L.phase ?? 0;
        const wan = L.wander ?? 6;
        // x and y run at different multiples of the lobe's own clock, so each
        // lobe travels an open Lissajous path instead of a circle. A circle is
        // legible as a circle after two passes; this never closes.
        const x = L.x + s1(t * w, ph) * wan;
        const y = L.y + s1(t * w * 0.67, ph + 1.7) * wan * 0.72;
        const r = (L.size ?? 70) * (1 + s1(t * w * 0.43, ph + 3.1) * 0.13);
        const a = (L.strength ?? 0.4) * intensity;
        return (
          <AbsoluteFill
            key={i}
            style={{
              background:
                `radial-gradient(${r.toFixed(2)}% ${(r * 0.94).toFixed(2)}% ` +
                `at ${x.toFixed(2)}% ${y.toFixed(2)}%, ` +
                `${L.hex}${alphaHex(a)} 0%, ${L.hex}${alphaHex(a * 0.55)} 34%, ` +
                `${L.hex}00 72%)`,
            }}
          />
        );
      })}
      {grain > 0 && (
        <Grain amount={grain} atSeconds={atSeconds} tile={grainScale} blend={grainBlend} />
      )}
      {children}
    </AbsoluteFill>
  );
};

/** 0–1 → the two hex digits a CSS 8-digit colour wants. */
const alphaHex = (a: number) =>
  Math.round(Math.max(0, Math.min(1, a)) * 255)
    .toString(16)
    .padStart(2, "0");

/* ── the WAL field ───────────────────────────────────────────────────────────
 *
 * EP 21's field, and the fourth instrument in this file. It exists because the
 * episode is about something MOVING FROM LEFT TO RIGHT — a write-ahead log
 * streaming from a primary to a replica — and none of the other three carry a
 * direction. The ribbon bends in place, the bloom sits still, the mesh wanders
 * without going anywhere. All three are correct as weather; none of them is a
 * current.
 *
 * So: soft horizontal streaks of light, travelling. Every streak runs at its own
 * speed, which is the whole point — a replica that kept pace with its primary
 * would not be a subject. The eye reads the differential without being told.
 *
 * FOUR THINGS THAT MAKE IT SURVIVE A RENDER, each of which is a rule from
 * SKILL.md that this file has learned the hard way:
 *
 * 1. NO HARD EDGES. Each streak is masked to nothing at its top and bottom, so
 *    unlike `RibbonField` it can run under a diagram without cutting through it.
 *    That is what lets ONE instrument sit under every station in the film.
 *
 * 2. DRIFT IS MODULO, NOT UNBOUNDED. The streak element is 300% wide and its
 *    gradient repeats on a fixed period, so the translate is taken `% period`.
 *    A gradient translated without bound eventually scrolls off its own stop
 *    list and goes flat — the failure `spreadMethod="reflect"` fixes for the
 *    ribbon. Here the tiling does it, exactly, with no seam.
 *
 * 3. SPEEDS ARE MUTUALLY INCOMMENSURATE. Same reason the mesh's periods are:
 *    give two streaks a rational speed ratio and the pattern visibly re-forms
 *    every few seconds. These never re-align.
 *
 * 4. EVERY MODULATION IS ZERO AT t=0 (`sin(x+p) − sin(p)`), so nothing snaps on
 *    frame one. The DRIFT itself is linear in t, which is already 0 at t=0 and
 *    is the one thing here that is supposed to accumulate.
 * ─────────────────────────────────────────────────────────────────────────── */

export type Streak = {
  hex: string;
  /** Band centre, in % of frame height. */
  y: number;
  /** Band height, in % of frame height. Wide and soft — 14+ — or it reads as a rule. */
  h: number;
  /**
   * Travel, in % of the ELEMENT width per second. The element is 300% of the
   * frame, so 1 here is 3% of the frame per second. Keep these mutually
   * incommensurate across the set.
   */
  speed: number;
  /** Width of one light-and-gap cycle, in % of the element. */
  period?: number;
  /** How much of the cycle is lit. 0.3 reads as pulses, 0.7 as a wash. */
  duty?: number;
  /** Peak alpha at the core of the band. */
  strength?: number;
  /** Seconds per vertical-wander cycle. */
  wanderPeriod?: number;
  /** How far it wanders vertically, in % of frame. */
  wander?: number;
  phase?: number;
};

/**
 * EP 21's field — the stripe-mesh brand as a CURRENT.
 *
 * Same hues as `MESH_AZURE` and `AZURE_STOPS`, so EP 18, EP 20 and EP 21 read as
 * one system. Strengths are low for the same reason the mesh's are: this is a
 * white film and the field is a tint on a page, not a coloured background.
 *
 * The fast streaks are the pale ones and the slow streaks are the saturated
 * ones, which is not arbitrary — it keeps the visually heavy material calm and
 * lets the light do the travelling.
 */
export const WAL_AZURE: Streak[] = [
  { hex: "#4D2FF9", y: 90, h: 17, speed: 1.30, period: 41, duty: 0.58, strength: 0.50, wanderPeriod: 19.3, wander: 2.4, phase: 0.4 },
  { hex: "#5667FF", y: 76, h: 13, speed: 1.87, period: 34, duty: 0.52, strength: 0.42, wanderPeriod: 23.1, wander: 2.0, phase: 2.1 },
  { hex: "#4D2FF9", y: 63, h: 11, speed: 2.41, period: 29, duty: 0.48, strength: 0.34, wanderPeriod: 26.7, wander: 1.8, phase: 4.4 },
  { hex: "#78B8F9", y: 47, h: 15, speed: 3.13, period: 37, duty: 0.55, strength: 0.44, wanderPeriod: 17.9, wander: 2.6, phase: 3.9 },
  { hex: "#78B8F9", y: 33, h: 11, speed: 3.79, period: 27, duty: 0.46, strength: 0.36, wanderPeriod: 21.3, wander: 1.9, phase: 1.1 },
  { hex: "#A79BF2", y: 20, h: 13, speed: 4.57, period: 31, duty: 0.5, strength: 0.34, wanderPeriod: 29.3, wander: 2.2, phase: 5.2 },
  { hex: "#C3B7F7", y: 8, h: 12, speed: 5.23, period: 26, duty: 0.44, strength: 0.28, wanderPeriod: 24.1, wander: 1.7, phase: 2.8 },
];

/**
 * ACT TWO. The same current, a few degrees colder and a shade heavier.
 *
 * The director's note was for the palette to turn as the film does, and this is
 * where that lives — in the FIELD and nowhere else. The ink, the accent, the
 * type and the panel black are all untouched, because a brand that changes
 * halfway through a film stops being a brand. What changes is the temperature of
 * the light: indigo cools toward true blue, the warm lavender is dropped for a
 * slate, and every strength comes up slightly so act two sits heavier.
 *
 * There is no cross-fade between the two sets and none is needed: each station
 * declares its own, so the change happens across the act-break lift, under the
 * slate's wash, which is the one moment in the film the frame is already covered.
 */
export const WAL_AZURE_COLD: Streak[] = [
  { hex: "#2C1FB8", y: 90, h: 17, speed: 1.30, period: 41, duty: 0.58, strength: 0.56, wanderPeriod: 19.3, wander: 2.4, phase: 0.4 },
  { hex: "#3D5BE8", y: 76, h: 13, speed: 1.87, period: 34, duty: 0.52, strength: 0.48, wanderPeriod: 23.1, wander: 2.0, phase: 2.1 },
  { hex: "#2C1FB8", y: 63, h: 11, speed: 2.41, period: 29, duty: 0.48, strength: 0.38, wanderPeriod: 26.7, wander: 1.8, phase: 4.4 },
  { hex: "#5AA6E8", y: 47, h: 15, speed: 3.13, period: 37, duty: 0.55, strength: 0.48, wanderPeriod: 17.9, wander: 2.6, phase: 3.9 },
  { hex: "#5AA6E8", y: 33, h: 11, speed: 3.79, period: 27, duty: 0.46, strength: 0.40, wanderPeriod: 21.3, wander: 1.9, phase: 1.1 },
  { hex: "#7E93C4", y: 20, h: 13, speed: 4.57, period: 31, duty: 0.5, strength: 0.38, wanderPeriod: 29.3, wander: 2.2, phase: 5.2 },
  { hex: "#93A8CE", y: 8, h: 12, speed: 5.23, period: 26, duty: 0.44, strength: 0.32, wanderPeriod: 24.1, wander: 1.7, phase: 2.8 },
];

/**
 * THE SATURATED VARIANT — the title, the cold open's field and the end card.
 *
 * Same current, but the streaks are PALE and the wash beneath them is deep, so
 * the light reads as light travelling over a saturated ground rather than as
 * colour laid on white. That inversion is the whole reason a separate set is
 * needed: at strength on a white base the field just goes chalky, which is
 * exactly what the first render of this episode did.
 */
export const WAL_AZURE_DEEP: Streak[] = [
  { hex: "#B9D4FF", y: 90, h: 17, speed: 1.30, period: 41, duty: 0.58, strength: 0.34, wanderPeriod: 19.3, wander: 2.4, phase: 0.4 },
  { hex: "#DCE8FF", y: 76, h: 13, speed: 1.87, period: 34, duty: 0.52, strength: 0.26, wanderPeriod: 23.1, wander: 2.0, phase: 2.1 },
  { hex: "#9FC6FF", y: 63, h: 11, speed: 2.41, period: 29, duty: 0.48, strength: 0.22, wanderPeriod: 26.7, wander: 1.8, phase: 4.4 },
  { hex: "#DCE8FF", y: 47, h: 15, speed: 3.13, period: 37, duty: 0.55, strength: 0.24, wanderPeriod: 17.9, wander: 2.6, phase: 3.9 },
  { hex: "#9FC6FF", y: 33, h: 11, speed: 3.79, period: 27, duty: 0.46, strength: 0.22, wanderPeriod: 21.3, wander: 1.9, phase: 1.1 },
  { hex: "#EDF4FE", y: 20, h: 13, speed: 4.57, period: 31, duty: 0.5, strength: 0.18, wanderPeriod: 29.3, wander: 2.2, phase: 5.2 },
  { hex: "#EDF4FE", y: 8, h: 12, speed: 5.23, period: 26, duty: 0.44, strength: 0.14, wanderPeriod: 24.1, wander: 1.7, phase: 2.8 },
];

export type WalProps = {
  streaks?: Streak[];
  /**
   * Wide soft lobes under the streaks, for chroma. Without them a light film
   * gets faint stripes on white rather than a surface — the streaks supply the
   * MOTION and the wash supplies the COLOUR.
   */
  wash?: Lobe[];
  base?: string;
  /** Scales every streak and lobe at once — the one dial for "how much field". */
  intensity?: number;
  grain?: number;
  grainScale?: number;
  grainBlend?: React.CSSProperties["mixBlendMode"];
  opacity?: number;
  atSeconds?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

/** The wash under EP 21's streaks. Two lobes only — the streaks do the rest. */
export const WAL_WASH: Lobe[] = [
  { hex: "#4D2FF9", x: 10, y: 86, size: 82, wander: 6.0, period: 31.7, phase: 0.9, strength: 0.34 },
  { hex: "#78B8F9", x: 84, y: 18, size: 74, wander: 7.2, period: 26.3, phase: 3.1, strength: 0.26 },
];

export const WAL_WASH_COLD: Lobe[] = [
  { hex: "#2C1FB8", x: 10, y: 86, size: 84, wander: 6.0, period: 31.7, phase: 0.9, strength: 0.40 },
  { hex: "#5AA6E8", x: 84, y: 18, size: 74, wander: 7.2, period: 26.3, phase: 3.1, strength: 0.24 },
];

/**
 * The deep ground. Four wide lobes at full strength, and — the same correction
 * `MESH_AZURE_DEEP` needed — the palest one is pushed UP and held down, because
 * the centre of these frames is where the white headline goes and a pale lobe
 * under white type is the one place this field can defeat its own foreground.
 */
export const WAL_WASH_DEEP: Lobe[] = [
  { hex: "#3B23D6", x: 12, y: 84, size: 90, wander: 7.0, period: 31.7, phase: 0.9, strength: 1 },
  { hex: "#5667FF", x: 86, y: 70, size: 84, wander: 6.4, period: 26.3, phase: 3.1, strength: 0.92 },
  { hex: "#4F8FE8", x: 72, y: 12, size: 76, wander: 8.0, period: 22.7, phase: 1.7, strength: 0.7 },
  { hex: "#8E7FEA", x: 16, y: 24, size: 72, wander: 7.4, period: 18.9, phase: 4.6, strength: 0.6 },
  { hex: "#EDF4FE", x: 52, y: 14, size: 40, wander: 5.0, period: 29.3, phase: 1.3, strength: 0.18 },
];

export const WAL_WASH_DEEP_COLD: Lobe[] = [
  { hex: "#241B9E", x: 12, y: 84, size: 92, wander: 7.0, period: 31.7, phase: 0.9, strength: 1 },
  { hex: "#3D5BE8", x: 86, y: 70, size: 84, wander: 6.4, period: 26.3, phase: 3.1, strength: 0.94 },
  { hex: "#3F7FD4", x: 72, y: 12, size: 76, wander: 8.0, period: 22.7, phase: 1.7, strength: 0.74 },
  { hex: "#6B74C8", x: 16, y: 24, size: 72, wander: 7.4, period: 18.9, phase: 4.6, strength: 0.62 },
  { hex: "#DCE6F6", x: 52, y: 14, size: 40, wander: 5.0, period: 29.3, phase: 1.3, strength: 0.16 },
];

export const WalField: React.FC<WalProps> = ({
  streaks = WAL_AZURE,
  wash = WAL_WASH,
  base = "#FFFFFF",
  intensity = 1,
  grain = 30,
  grainScale = 120,
  grainBlend = "multiply",
  opacity = 1,
  atSeconds,
  style,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = atSeconds ?? frame / fps;

  const s1 = (a: number, p: number) => Math.sin(a + p) - Math.sin(p);

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: base, opacity, ...style }}>
      {/* the chroma, standing still */}
      {wash.map((L, i) => {
        const w = (2 * Math.PI) / Math.max(1, L.period ?? 28);
        const ph = L.phase ?? 0;
        const wan = L.wander ?? 6;
        const x = L.x + s1(t * w, ph) * wan;
        const y = L.y + s1(t * w * 0.67, ph + 1.7) * wan * 0.72;
        const r = (L.size ?? 76) * (1 + s1(t * w * 0.43, ph + 3.1) * 0.11);
        const a = (L.strength ?? 0.3) * intensity;
        return (
          <AbsoluteFill
            key={`w${i}`}
            style={{
              background:
                `radial-gradient(${r.toFixed(2)}% ${(r * 0.94).toFixed(2)}% ` +
                `at ${x.toFixed(2)}% ${y.toFixed(2)}%, ` +
                `${L.hex}${alphaHex(a)} 0%, ${L.hex}${alphaHex(a * 0.55)} 34%, ` +
                `${L.hex}00 72%)`,
            }}
          />
        );
      })}

      {/* the current, travelling */}
      {streaks.map((S, i) => {
        const per = S.period ?? 16;
        const duty = S.duty ?? 0.45;
        const wp = (2 * Math.PI) / Math.max(1, S.wanderPeriod ?? 21);
        const ph = S.phase ?? 0;

        // Modulo the period, so the translate is bounded no matter how long the
        // film runs and the tiling hides the wrap completely.
        const drift = (t * S.speed) % per;
        const y = S.y + s1(t * wp, ph) * (S.wander ?? 2.5);
        // The band breathes in weight rather than in size — a streak that
        // changes height reads as a shape, one that changes brightness reads as
        // light.
        const a = (S.strength ?? 0.25) * intensity * (1 + s1(t * wp * 1.31, ph + 2.2) * 0.22);

        const lit = per * duty;
        return (
          <div
            key={`s${i}`}
            style={{
              position: "absolute",
              left: "-100%",
              width: "300%",
              top: `${(y - S.h / 2).toFixed(2)}%`,
              height: `${S.h}%`,
              translate: `${drift.toFixed(3)}% 0`,
              background:
                `repeating-linear-gradient(90deg, ` +
                `${S.hex}00 0%, ` +
                `${S.hex}${alphaHex(a)} ${(lit * 0.5).toFixed(2)}%, ` +
                `${S.hex}00 ${lit.toFixed(2)}%, ` +
                `${S.hex}00 ${per.toFixed(2)}%)`,
              // No top or bottom edge anywhere. This is the property that lets
              // the field run under a diagram instead of behind one.
              maskImage:
                "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 38%, rgba(0,0,0,1) 62%, rgba(0,0,0,0) 100%)",
              WebkitMaskImage:
                "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 38%, rgba(0,0,0,1) 62%, rgba(0,0,0,0) 100%)",
              pointerEvents: "none",
            }}
          />
        );
      })}

      {grain > 0 && (
        <Grain amount={grain} atSeconds={atSeconds} tile={grainScale} blend={grainBlend} />
      )}
      {children}
    </AbsoluteFill>
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
