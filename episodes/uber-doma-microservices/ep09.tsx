// Author: Bishakh
//
// EP09 scene vocabulary — "Uber broke the monolith. Then the pieces broke them."
//
// REGISTER: iluli flat collage, matched to the reference the director supplied
// (iluli, "Personal Knowledge Management"). Sampled from that film, the system is:
//
//   • The WHOLE FRAME is one saturated colour, and it changes by act — not a
//     dark field with an accent. Cream → near-black → sky blue.
//   • One BIG GEOMETRIC SHAPE sits behind everything: an X/bowtie, a disc, a
//     diagonal band. Hard-edged, flat, no gradients.
//   • Real GREYSCALE PHOTO CUTOUTS are collaged into flat vector artwork. That
//     contrast — halftone photograph against flat colour — is the whole look.
//   • Type arrives as STICKERS: rotated cards, hard offset shadows, tight caps.
//   • Sparkles, four-point stars and dotted starfields fill the negative space.
//
// Kling's job here is ONLY the photo cutouts. It cannot make flat vector, legible
// type, UI or logos without hallucinating, and it cannot hold one flat style
// across twenty beats — so everything else is Remotion.
//
// The protagonist motif is the service tile: a slab in Act 1, a swarm in Act 2,
// a domain in Act 3. Same shape, three meanings.
//
// House rule that bit us on EP08: anything after the background goes inside
// <Stage>, a positioned layer. A static, untransformed sibling of an AbsoluteFill
// background is painted UNDER it once its opacity spring settles on exactly 1.

import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import type { Palette } from "../theme";
import { UBER, MONO } from "../fonts";
import { lerp, clamp01, useAppear, useK, usePortrait, useAlive, rand, drift, counter, shake, beat } from "./anim";

/* ── palette, sampled from the reference film ────────────────────────────── */

/**
 * Uber's own brand palette (base.uber.com), in the iluli collage STRUCTURE.
 *
 * Uber's identity is black, white and one blue — far more restrained than the
 * reference film's yellow/pink/sky. So the structure is kept (whole-frame colour
 * swaps, big flat shapes, stickers, photo cutouts) and the hues are Uber's:
 * the frame swaps between white, blue and black, and the secondary brand colours
 * do the accent work the reference gave to pink.
 *
 * `cream` and `sky` are retained as KEYS so every existing scene keeps compiling,
 * but they now hold Uber values — cream is Uber's off-white, sky is Uber blue.
 */
export const U = {
  // field colours — a whole frame is one of these
  cream: "#FFFFFF",   // Uber white
  ink: "#000000",     // Uber black
  yellow: "#FFC043",  // Uber yellow
  sky: "#276EF1",     // Uber blue — the brand hue, now a full field
  // accents
  pink: "#E11900",    // Uber red — the alert/failure accent
  green: "#05A357",   // Uber green
  red: "#E11900",
  purple: "#7356BF",
  /** Uber's brand blue, by its real name. */
  blue: "#276EF1",
  white: "#FFFFFF",
  black: "#000000",
  g100: "#E2E2E2",
  g300: "#AFAFAF",
  g500: "#757575",
  g700: "#333333",
  g800: "#1F1F1F",
};

/** True when a field colour is light, so type flips to ink. Uber blue is dark. */
export const onLight = (hue: string) => hue === U.cream || hue === U.yellow || hue === U.g100;
export const inkOn = (hue: string) => (onLight(hue) ? U.ink : U.cream);

/* ── the field ───────────────────────────────────────────────────────────── */

/** Four-point sparkle — the reference's signature confetti. */
const Star: React.FC<{ x: number; y: number; r: number; color: string; o: number }> = ({ x, y, r, color, o }) => (
  <svg width={r * 2} height={r * 2} viewBox="-10 -10 20 20" style={{ position: "absolute", left: x, top: y, opacity: o }}>
    <path d="M0 -10 Q1.6 -1.6 10 0 Q1.6 1.6 0 10 Q-1.6 1.6 -10 0 Q-1.6 -1.6 0 -10 Z" fill={color} />
  </svg>
);

const Sparkles: React.FC<{ color: string; count: number; seed: number; stars?: boolean }> = ({
  color, count, seed, stars = true,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const k = useK();
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const s = seed * 37 + i;
        const x = rand(s) * width;
        const y = rand(s + 7) * height;
        const tw = 0.3 + Math.abs(Math.sin(frame * 0.035 + rand(s + 11) * 6.28)) * 0.7;
        const dy = drift(frame, s, 5, 0.011);
        return stars && rand(s + 5) > 0.55 ? (
          <Star key={i} x={x} y={y + dy} r={(7 + rand(s + 2) * 9) * k} color={color} o={tw * 0.85} />
        ) : (
          <div
            key={i}
            style={{
              position: "absolute", left: x, top: y + dy,
              width: (2.4 + rand(s + 3) * 3) * k, height: (2.4 + rand(s + 3) * 3) * k,
              borderRadius: "50%", background: color, opacity: tw * 0.8,
            }}
          />
        );
      })}
    </>
  );
};

export type ShapeKind = "x" | "disc" | "band" | "none";

/** The big flat geometric shape behind everything. Hard-edged, never a gradient. */
const BigShape: React.FC<{ kind: ShapeKind; color: string }> = ({ kind, color }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const grow = spring({ frame: frame - beat(2), fps: 30, config: { damping: 200 }, durationInFrames: beat(34) });
  if (kind === "none") return null;

  // NEVER SETTLES. This is the largest area on screen, so a slow continuous
  // drift here is what keeps a beat alive after its reveal has finished — the
  // pacing audit showed 47% of the film frozen when this shape held still.
  // Big and slow reads as intentional; small and twitchy reads as a glitch.
  const breathe = 1 + Math.sin(frame * 0.017) * 0.06;
  const glide = Math.sin(frame * 0.012) * 5.0;   // degrees
  const slideX = Math.sin(frame * 0.009) * 3.5;  // %

  if (kind === "disc") {
    return (
      <div
        style={{
          position: "absolute", left: "50%", top: "50%",
          width: Math.min(width, height) * 0.86, height: Math.min(width, height) * 0.86, borderRadius: "50%", background: color,
          transform: `translate(-50%,-50%) translateX(${slideX}%) scale(${lerp(0.7, 1, grow) * breathe})`,
        }}
      />
    );
  }
  if (kind === "band") {
    return (
      <div
        style={{
          position: "absolute", left: "-10%", top: "50%", width: "120%", height: height * 0.42,
          background: color,
          transform: `translateY(-50%) translateX(${slideX * 0.6}%) rotate(${-9 + glide}deg) scaleX(${lerp(0.6, 1, grow)})`,
        }}
      />
    );
  }
  // the X / bowtie: two opposed triangles meeting at centre
  const w = width, h = height;
  const s = lerp(0.75, 1, grow) * breathe;
  return (
    <svg width={w} height={h} style={{ position: "absolute", inset: 0 }}>
      <g transform={`rotate(${glide * 1.4} ${w / 2} ${h / 2}) translate(${w / 2} ${h / 2}) scale(${s}) translate(${-w / 2} ${-h / 2})`}>
        <path d={`M0 0 L${w * 0.46} ${h / 2} L0 ${h} Z`} fill={color} />
        <path d={`M${w} 0 L${w * 0.54} ${h / 2} L${w} ${h} Z`} fill={color} />
      </g>
    </svg>
  );
};

/** Paper grain on light fields, so cream doesn't read as flat digital white. */
const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.16 }) => {
  const frame = useCurrentFrame();
  const seed = frame % 5;
  return (
    <AbsoluteFill style={{ opacity, mixBlendMode: "multiply", pointerEvents: "none" }}>
      <svg width="100%" height="100%">
        <filter id={`pg${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves={3} seed={seed} />
        </filter>
        <rect width="100%" height="100%" filter={`url(#pg${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

/**
 * The base plate. `hue` is the WHOLE FRAME; `shape` is the flat geometric form
 * behind the hero object. Change hue by act, not by beat.
 */
export const Field: React.FC<{
  hue?: string; shape?: ShapeKind; shapeColor?: string; sparkle?: number; seed?: number;
}> = ({ hue = U.cream, shape = "none", shapeColor, sparkle = 14, seed = 1 }) => {
  const dark = !onLight(hue);
  return (
    <AbsoluteFill style={{ backgroundColor: hue, overflow: "hidden" }}>
      <BigShape kind={shape} color={shapeColor || (dark ? U.yellow : U.ink)} />
      <Sparkles color={dark ? U.cream : U.ink} count={sparkle} seed={seed} stars={!dark} />
      {onLight(hue) && <Grain />}
    </AbsoluteFill>
  );
};

/** Content layer — always wrap scene content in this. */
export const Stage: React.FC<{ center?: boolean; children: React.ReactNode; style?: React.CSSProperties }> = ({
  center = true, children, style,
}) => (
  <AbsoluteFill
    style={{
      zIndex: 1,
      ...(center ? { alignItems: "center", justifyContent: "center" } : null),
      ...style,
    }}
  >
    {children}
  </AbsoluteFill>
);

/* ── collage elements ────────────────────────────────────────────────────── */

/**
 * A keyed greyscale photograph collaged into the flat artwork. This is the one
 * thing Kling makes for this episode, and the contrast against flat colour is
 * the entire reason the style reads as collage rather than as a slide.
 */
export const PhotoCutout: React.FC<{
  src: string; width: number; x: number; y: number; rotate?: number; delay?: number; i?: number;
}> = ({ src, width, x, y, rotate = 0, delay = 0, i = 0 }) => {
  const a = useAppear(delay, 165);
  const k = useK();
  const alive = useAlive(i, 1);
  return (
    <div
      style={{
        position: "absolute", left: `${x}%`, top: `${y}%`, width: width * k,
        transform: `translate(-50%,-50%) ${alive.transform} rotate(${rotate}deg) scale(${lerp(0.86, 1, a)})`,
        opacity: a,
        filter: `grayscale(1) contrast(1.25) drop-shadow(${14 * k}px ${18 * k}px 0px rgba(20,20,20,0.28))`,
      }}
    >
      <Img src={staticFile(src)} style={{ width: "100%", display: "block" }} />
    </div>
  );
};

/**
 * A photograph in a bordered card, for subjects too light-toned to key cleanly.
 *
 * A colour key on a pale subject (a paper map, a hand) either punches holes in
 * the subject or leaves a halo of background. The reference film frames photos
 * like this too, so it is the register's own answer rather than a workaround.
 * Uses the RAW file — no key applied.
 */
export const PhotoCard: React.FC<{
  src: string; width: number; x: number; y: number; rotate?: number; delay?: number; i?: number;
}> = ({ src, width, x, y, rotate = -2, delay = 0, i = 0 }) => {
  const a = useAppear(delay, 160);
  const k = useK();
  const alive = useAlive(i + 21, 0.8);
  return (
    <div
      style={{
        position: "absolute", left: `${x}%`, top: `${y}%`, width: width * k,
        transform: `translate(-50%,-50%) ${alive.transform} rotate(${rotate}deg) scale(${lerp(0.88, 1, a)})`,
        opacity: a,
        background: U.white,
        border: `${5 * k}px solid ${U.black}`,
        boxShadow: `${12 * k}px ${13 * k}px 0px ${U.black}`,
        lineHeight: 0,
      }}
    >
      <Img src={staticFile(src)} style={{ width: "100%", display: "block", filter: "grayscale(1) contrast(1.15)" }} />
    </div>
  );
};

/**
 * Type as a physical sticker: rotated, hard offset shadow, tight caps. The
 * reference builds almost all of its on-screen language out of these.
 */
export const Sticker: React.FC<{
  text: string; x: number; y: number; rotate?: number; delay?: number;
  bg?: string; fg?: string; size?: number; i?: number;
}> = ({ text, x, y, rotate = -2, delay = 0, bg = U.yellow, fg = U.ink, size = 40, i = 0 }) => {
  const a = useAppear(delay, 150);
  const k = useK();
  const alive = useAlive(i + 9, 0.7);
  return (
    <div
      style={{
        position: "absolute", left: `${x}%`, top: `${y}%`,
        transform: `translate(-50%,-50%) ${alive.transform} rotate(${rotate}deg) scale(${lerp(0.8, 1, a)})`,
        opacity: a,
        background: bg, color: fg,
        padding: `${14 * k}px ${26 * k}px`,
        border: `${3 * k}px solid ${U.ink}`,
        boxShadow: `${9 * k}px ${10 * k}px 0px ${U.ink}`,
        fontFamily: UBER, fontWeight: 800, fontSize: size * k,
        letterSpacing: "-0.02em", textTransform: "uppercase", whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

/* ── type primitives (Plus Jakarta Sans stands in for Uber Move) ─────────── */

export const Display: React.FC<{ size?: number; color?: string; children: React.ReactNode; style?: React.CSSProperties }> = ({
  size = 96, color = U.ink, children, style,
}) => {
  const k = useK();
  return (
    <div style={{ fontFamily: UBER, fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.04, fontSize: size * k, color, ...style }}>
      {children}
    </div>
  );
};

export const Tag: React.FC<{ children: React.ReactNode; color?: string; delay?: number }> = ({
  children, color = U.ink, delay = 2,
}) => {
  const a = useAppear(delay);
  const k = useK();
  return (
    <div
      style={{
        fontFamily: MONO, fontSize: 22 * k, letterSpacing: "0.2em", textTransform: "uppercase",
        color, opacity: a, transform: `translateY(${lerp(10, 0, a)}px)`,
      }}
    >
      {children}
    </div>
  );
};

export const TopTag: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color }) => {
  const k = useK();
  return (
    <div style={{ position: "absolute", top: 92 * k, left: 116 * k, zIndex: 2 }}>
      <Tag color={color}>{children}</Tag>
    </div>
  );
};

/* ── the protagonist motif ───────────────────────────────────────────────── */

/** One service. Flat fill, thick ink outline — vector, never a gradient. */
export const Tile: React.FC<{
  x: number; y: number; size: number; color?: string; label?: string;
  a?: number; i?: number; dim?: boolean; outline?: boolean;
}> = ({ x, y, size, color = U.pink, label, a = 1, i = 0, dim = false, outline = true }) => {
  const k = useK();
  const alive = useAlive(i, 0.7);
  return (
    <div
      style={{
        position: "absolute", left: x, top: y,
        width: size * k, height: size * k, borderRadius: size * 0.26 * k,
        background: color, opacity: a * (dim ? 0.32 : 1),
        transform: `${alive.transform} scale(${lerp(0.4, 1, a)})`,
        border: outline ? `${Math.max(2, size * 0.05) * k}px solid ${U.ink}` : undefined,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      {label && <span style={{ fontFamily: MONO, fontSize: size * 0.28 * k, color: U.ink }}>{label}</span>}
    </div>
  );
};

/* ── maps & graphs — the Uber-native illustration language ───────────────── */

/**
 * A stylised street grid with a route drawn across it and a cab travelling the
 * route. Deterministic: the grid, the route and the timing are all derived from
 * `rand(i)`, never from Math.random.
 *
 * This is the episode's most Uber-specific image, and it doubles as continuous
 * motion — the cab never stops, so any beat carrying a map is never static.
 */
export const CityMap: React.FC<{
  hue?: string; road?: string; route?: string; cabs?: number; opacity?: number; speed?: number;
  carWidth?: number;
}> = ({ hue = U.blue, road = U.g100, route = U.blue, cabs = 1, opacity = 1, speed = 1, carWidth = 190 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const k = useK();

  // an irregular street grid — evenly spaced roads read as graph paper
  const vs = React.useMemo(() => Array.from({ length: 9 }, (_, i) => 90 + i * 210 + rand(i) * 70), []);
  const hs = React.useMemo(() => Array.from({ length: 6 }, (_, i) => 70 + i * 190 + rand(i + 30) * 60), []);

  // the route: a staircase along real streets, the way a car actually drives
  const pts = React.useMemo(() => {
    const p: { x: number; y: number }[] = [];
    let vi = 1, hi = 4;
    p.push({ x: vs[vi], y: hs[hi] });
    for (let s = 0; s < 7; s++) {
      if (s % 2 === 0) { vi = Math.min(vs.length - 1, vi + 1 + Math.floor(rand(s) * 2)); p.push({ x: vs[vi], y: hs[hi] }); }
      else { hi = Math.max(0, hi - 1); p.push({ x: vs[vi], y: hs[hi] }); }
    }
    return p;
  }, [vs, hs]);

  const total = React.useMemo(() => {
    let t = 0;
    for (let i = 1; i < pts.length; i++) t += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    return t;
  }, [pts]);

  /** Position along the polyline at 0..1. */
  const at = (u: number) => {
    let want = clamp01(u) * total;
    for (let i = 1; i < pts.length; i++) {
      const seg = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
      if (want <= seg) {
        const f = seg === 0 ? 0 : want / seg;
        return {
          x: lerp(pts[i - 1].x, pts[i].x, f),
          y: lerp(pts[i - 1].y, pts[i].y, f),
          ang: Math.atan2(pts[i].y - pts[i - 1].y, pts[i].x - pts[i - 1].x) * (180 / Math.PI),
        };
      }
      want -= seg;
    }
    const l = pts[pts.length - 1];
    return { x: l.x, y: l.y, ang: 0 };
  };

  const draw = clamp01((frame - beat(4)) / beat(40));
  const d = pts.map((p, i) => `${i ? "L" : "M"} ${p.x * k} ${p.y * k}`).join(" ");

  return (
    <AbsoluteFill style={{ opacity }}>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {/* streets */}
        {vs.map((x, i) => (
          <line key={`v${i}`} x1={x * k} y1={0} x2={x * k} y2={height} stroke={road} strokeWidth={(i % 3 === 0 ? 9 : 4) * k} opacity={0.5} />
        ))}
        {hs.map((y, i) => (
          <line key={`h${i}`} x1={0} y1={y * k} x2={width} y2={y * k} stroke={road} strokeWidth={(i % 2 === 0 ? 9 : 4) * k} opacity={0.5} />
        ))}
        {/* the route, drawn on */}
        <path d={d} stroke={route} strokeWidth={11 * k} fill="none" strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray={total * k} strokeDashoffset={(1 - draw) * total * k} />
        {/* pickup + dropoff */}
        <circle cx={pts[0].x * k} cy={pts[0].y * k} r={15 * k} fill={route} stroke={hue} strokeWidth={5 * k} />
        <rect x={(pts[pts.length - 1].x - 13) * k} y={(pts[pts.length - 1].y - 13) * k} width={26 * k} height={26 * k}
          rx={5 * k} fill={route} stroke={hue} strokeWidth={5 * k} opacity={draw > 0.98 ? 1 : 0} />
      </svg>
      {/* THE CAR. A real photographed car driving the route, not a vector box.
          It sits outside the <svg> so it can be an <Img>: the cutout is flipped
          to face travel direction rather than rotated, because a photographed
          side-profile car rotated past ~20° reads as a crash, not a turn. */}
      {Array.from({ length: cabs }, (_, c) => {
        const u = (((frame * 0.0042 * speed) + c / Math.max(1, cabs)) % 1) * Math.min(1, draw + 0.001);
        const p = at(u);
        const facingLeft = Math.abs(p.ang) > 90;
        const w = carWidth * k;
        return (
          <div
            key={c}
            style={{
              position: "absolute",
              left: p.x * k, top: p.y * k,
              width: w,
              transform: `translate(-50%,-58%) scaleX(${facingLeft ? -1 : 1})`,
              filter: `grayscale(1) contrast(1.3) drop-shadow(${3 * k}px ${5 * k}px ${5 * k}px rgba(0,0,0,0.45))`,
              lineHeight: 0,
            }}
          >
            <Img src={staticFile("cutouts/car.png")} style={{ width: "100%", display: "block" }} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/**
 * Uber's real service growth, as a line that keeps drawing. Two points are
 * documented (two monoliths in 2013; 2,200 critical microservices by 2020) —
 * the curve between them is an interpolation and is labelled as such on screen.
 */
export const GrowthGraph: React.FC<{ color?: string; grid?: string; label?: string }> = ({
  color = U.blue, grid = U.g500, label,
}) => {
  const frame = useCurrentFrame();
  const k = useK();
  const portrait = usePortrait();
  const W = portrait ? 830 : 1080, H = portrait ? 520 : 420;
  const YEARS = [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020];
  // exponential ramp between the two documented endpoints
  const vals = YEARS.map((_, i) => 2 * Math.pow(2200 / 2, i / (YEARS.length - 1)));
  const max = 2200;
  const pts = vals.map((v, i) => ({
    x: (i / (YEARS.length - 1)) * W,
    y: H - (Math.log10(v) / Math.log10(max)) * H,
  }));
  const draw = clamp01((frame - beat(5)) / 135);
  const shown = draw * (pts.length - 1);
  const d = pts.map((p, i) => `${i ? "L" : "M"} ${p.x * k} ${p.y * k}`).join(" ");
  const len = 2000;
  const head = pts[Math.min(pts.length - 1, Math.floor(shown))];
  return (
    <div style={{ position: "relative", width: W * k, height: H * k }}>
      <svg width={W * k} height={H * k} style={{ overflow: "visible" }}>
        {[0, 0.25, 0.5, 0.75, 1].map((g) => (
          <line key={g} x1={0} y1={g * H * k} x2={W * k} y2={g * H * k} stroke={grid} strokeWidth={1.5 * k} opacity={0.35} />
        ))}
        <path d={d} stroke={color} strokeWidth={9 * k} fill="none" strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray={len * k} strokeDashoffset={(1 - draw) * len * k} />
        <circle cx={head.x * k} cy={head.y * k} r={(10 + Math.abs(Math.sin(frame * 0.09)) * 5) * k} fill={color} />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: -46 * k, display: "flex", justifyContent: "space-between" }}>
        {YEARS.map((y, i) => (
          <span key={y} style={{ fontFamily: MONO, fontSize: 19 * k, color: grid, opacity: i % 2 ? 0.35 : 0.85 }}>{y}</span>
        ))}
      </div>
      {label && (
        <div style={{ position: "absolute", left: 0, top: -44 * k, fontFamily: MONO, fontSize: 21 * k, letterSpacing: "0.16em", textTransform: "uppercase", color }}>
          {label}
        </div>
      )}
    </div>
  );
};

/* ── ACT 1 ───────────────────────────────────────────────────────────────── */

/** Beat 1 — cold open: the dependency mesh, one pink origin, a crawling trace. */
export const TraceWeb: React.FC<{ pal: Palette }> = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const k = useK();
  const N = 40;
  const nodes = React.useMemo(
    () => Array.from({ length: N }, (_, i) => ({
      x: 230 + rand(i * 3 + 1) * (1920 - 460),
      y: 210 + rand(i * 3 + 2) * (1080 - 480),
    })),
    [],
  );
  const edges = React.useMemo(() => {
    const out: [number, number][] = [];
    nodes.forEach((n, i) => {
      const d = nodes.map((m, j) => ({ j, d: (m.x - n.x) ** 2 + (m.y - n.y) ** 2 }))
        .filter((o) => o.j !== i).sort((a, b) => a.d - b.d);
      out.push([i, d[0].j], [i, d[1].j]);
    });
    return out;
  }, [nodes]);
  const grow = clamp01((frame - beat(3)) / beat(30));
  const pulse = (frame % 140) / 140;
  return (
    <AbsoluteFill>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, zIndex: 1 }}>
        {edges.map(([i, j], e) => {
          const t = clamp01(grow * edges.length - e);
          const a = nodes[i], b = nodes[j];
          const hot = pulse > e / edges.length && pulse < e / edges.length + 0.13;
          return (
            <line
              key={e}
              x1={a.x * k} y1={a.y * k}
              x2={lerp(a.x, b.x, t) * k} y2={lerp(a.y, b.y, t) * k}
              stroke={hot ? U.pink : U.ink} strokeWidth={(hot ? 5 : 2.4) * k} opacity={hot ? 1 : 0.5}
            />
          );
        })}
      </svg>
      <AbsoluteFill style={{ zIndex: 2 }}>
        {nodes.map((n, i) => {
          const a = clamp01(grow * N - i * 0.6);
          const origin = i === 0;
          // The origin never stops pulsing — the cold open's second thing to do.
          const puls = origin ? 1 + Math.abs(Math.sin(frame * 0.055)) * 0.5 : 1;
          return (
            <Tile key={i} x={(n.x - 16) * k} y={(n.y - 16) * k}
              size={(origin ? 54 : 32) * puls} color={origin ? U.pink : U.cream} a={a} i={i} />
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Beat 4/5 — two monoliths. The photo cutout does the weight; vector does the rest. */
export const TwoMonoliths: React.FC<{ pal: Palette; cracked?: boolean }> = ({ cracked = false }) => {
  const frame = useCurrentFrame();
  const k = useK();
  const portrait = usePortrait();
  const a1 = useAppear(2, 180), a2 = useAppear(6, 180);
  const slab = (a: number, i: number, label: string, color: string) => (
    <div
      style={{
        width: 360 * k, height: 500 * k, borderRadius: 28 * k, background: color,
        border: `${5 * k}px solid ${U.ink}`, boxShadow: `${14 * k}px ${16 * k}px 0px ${U.ink}`,
        opacity: a, transform: `translateY(${lerp(50, 0, a)}px) scale(${lerp(0.92, 1, a)})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden",
      }}
    >
      <div style={{ fontFamily: UBER, fontWeight: 800, fontSize: 50 * k, color: U.ink, letterSpacing: "-0.03em", zIndex: 1 }}>{label}</div>
      {/* A deploy sweeping down the slab, over and over. Both these beats sat
          frozen once the slabs landed; this is what they do for the rest of it. */}
      <div
        style={{
          position: "absolute", left: 0, right: 0, height: 120 * k,
          top: `${(((frame * 1.15 + i * 130) % 620) / 620) * 100 - 12}%`,
          // A CREAM highlight, not an ink shadow — darkening the slab turned the
          // pink one lavender and pulled it off-palette.
          // Kept faint: at full strength the sweep reads as a gradient fill, and
          // this style is strictly flat colour.
          background: `linear-gradient(180deg, transparent, ${U.white}2E, transparent)`,
        }}
      />
      {/* Two jagged fractures, not three smooth curves — a gentle S-bend reads
          as decorative striping rather than as breakage. */}
      {cracked && (
        <svg width={360 * k} height={500 * k} style={{ position: "absolute", inset: 0 }}>
          {[0, 1].map((c) => {
            const p = clamp01((frame - beat(6) - c * 6) / beat(18));
            const x = 96 + c * 150;
            const d = `M ${x * k} 0 L ${(x + 34) * k} ${96 * k} L ${(x - 22) * k} ${182 * k} `
              + `L ${(x + 40) * k} ${286 * k} L ${(x - 16) * k} ${372 * k} L ${(x + 26) * k} ${500 * k}`;
            return (
              <path key={c} d={d} stroke={U.ink} strokeWidth={8 * k} fill="none"
                strokeLinejoin="miter"
                strokeDasharray={900 * k} strokeDashoffset={(1 - p) * 900 * k} />
            );
          })}
        </svg>
      )}
    </div>
  );
  return (
    <Stage>
      <div style={{ display: "flex", gap: (portrait ? 40 : 110) * k, alignItems: "center" }}>
        {slab(a1, 1, "API", U.yellow)}
        {slab(a2, 2, "DISPATCH", U.pink)}
      </div>
      {cracked && <Sticker text="every team, one deploy" x={50} y={84} rotate={-2} delay={14} bg={U.pink} fg={U.ink} size={34} i={3} />}
    </Stage>
  );
};

/** Beat 6 — the break-up. */
export const Shatter: React.FC<{ pal: Palette }> = () => {
  const frame = useCurrentFrame();
  const k = useK();
  const COLS = 8, ROWS = 5;
  const t = spring({ frame: frame - beat(3), fps: 30, config: { damping: 62, mass: 1.1 }, durationInFrames: beat(44) });
  const cols = [U.yellow, U.pink, U.sky, U.cream];
  return (
    <Stage>
      <div style={{ position: "relative", width: 1150 * k, height: 540 * k }}>
        {Array.from({ length: COLS * ROWS }, (_, i) => {
          const cx = i % COLS, cy = Math.floor(i / COLS);
          const x0 = cx * 144, y0 = cy * 110;
          const x1 = x0 + (rand(i) - 0.5) * 320;
          const y1 = y0 + (rand(i + 50) - 0.5) * 250;
          return (
            <Tile key={i}
              x={lerp(x0, x1, t) * k} y={lerp(y0, y1, t) * k}
              size={lerp(140, 78, t)} color={cols[i % 4]} a={1} i={i} />
          );
        })}
      </div>
    </Stage>
  );
};

/** Beat 7 — and it worked. Each service ships on its own clock. */
export const ItWorked: React.FC<{ pal: Palette }> = () => {
  const frame = useCurrentFrame();
  const k = useK();
  return (
    <Stage>
      <div style={{ position: "relative", width: 1240 * k, height: 500 * k }}>
        {Array.from({ length: 24 }, (_, i) => {
          const cx = i % 8, cy = Math.floor(i / 8);
          const a = useAppear(2 + i * 0.5, 170);
          const ship = (frame + i * 17) % 92;
          const lit = ship < 20;
          return (
            <div key={i} style={{ position: "absolute", left: cx * 155 * k, top: cy * 172 * k }}>
              <Tile x={0} y={0} size={106} color={lit ? U.green : U.cream} a={a} i={i} />
              {lit && (
                <div style={{
                  position: "absolute", left: 0, top: 0, width: 106 * k, height: 106 * k,
                  borderRadius: 28 * k, border: `${4 * k}px solid ${U.green}`,
                  transform: `scale(${1 + (ship / 20) * 0.55})`, opacity: 1 - ship / 20,
                }} />
              )}
            </div>
          );
        })}
      </div>
      <Sticker text="independent deploys" x={50} y={87} rotate={-1.5} delay={10} bg={U.green} fg={U.cream} size={36} i={5} />
    </Stage>
  );
};

/* ── ACT 2 ───────────────────────────────────────────────────────────────── */

/** Beat 9 — 2,200 services. */
export const Swarm: React.FC<{ pal: Palette }> = () => {
  const frame = useCurrentFrame();
  const k = useK();
  const N = 240;
  const a = clamp01((frame - beat(2)) / beat(28));
  const num = useAppear(5);
  return (
    <Stage center={false}>
      <AbsoluteFill>
        {Array.from({ length: N }, (_, i) => {
          const x = 110 + rand(i * 2 + 3) * 1700;
          const y = 130 + rand(i * 2 + 9) * 830;
          const on = clamp01(a * N - i * 0.9);
          return <Tile key={i} x={x * k} y={y * k} size={22} color={U.sky} a={on} i={i}
            dim={rand(i + 3) > 0.5} outline={false} />;
        })}
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 400 * k, textAlign: "center", opacity: num }}>
        <Display size={210} color={U.cream}>{counter("2,200", num)}</Display>
        <div style={{ marginTop: 6 * k, fontFamily: MONO, fontSize: 26 * k, letterSpacing: "0.22em", color: U.yellow, textTransform: "uppercase" }}>
          critical microservices · 2020
        </div>
      </div>
    </Stage>
  );
};

/** Beat 10 — 12 teams, 50 services, lighting one at a time. */
export const RootCause: React.FC<{ pal: Palette }> = () => {
  const frame = useCurrentFrame();
  const k = useK();
  const portrait = usePortrait();
  const TEAMS = 12, PER = 12;
  // Deliberately NOT beat()-scaled: this ramp is the beat's second thing to do,
  // so it must still be arriving when the narration reaches "fifty services",
  // not finish in the first second and leave the screen frozen.
  const lit = clamp01((frame - beat(5)) / 190) * 50;
  let seen = 0;
  return (
    <Stage center={false}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${portrait ? 3 : 4}, auto)`, gap: (portrait ? 34 : 50) * k }}>
          {Array.from({ length: TEAMS }, (_, t) => (
            <div key={t} style={{ display: "grid", gridTemplateColumns: "repeat(4, auto)", gap: 9 * k, padding: 14 * k, border: `${2 * k}px solid ${U.g700}`, borderRadius: 14 * k }}>
              {Array.from({ length: PER }, (_, j) => {
                const idx = t * PER + j;
                const isLit = rand(idx + 17) > 0.62;
                let on = 0;
                if (isLit) { on = clamp01(lit - seen); seen += 1; }
                const hot = isLit && on > 0.05;
                return (
                  <div key={j} style={{
                    width: 26 * k, height: 26 * k, borderRadius: 8 * k,
                    background: hot ? U.pink : U.g800,
                    transform: `scale(${isLit ? lerp(0.85, 1, on) : 1})`,
                  }} />
                );
              })}
            </div>
          ))}
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 116 * k, bottom: 120 * k }}>
        <Display size={104} color={U.pink}>{counter("50", clamp01(lit / 50))}</Display>
        <div style={{ fontFamily: MONO, fontSize: 24 * k, letterSpacing: "0.18em", color: U.cream, textTransform: "uppercase", marginTop: 6 * k }}>
          services · 12 teams · one bug
        </div>
      </div>
    </Stage>
  );
};

/** Beat 11 — only LOOKS independent. */
export const HiddenCoupling: React.FC<{ pal: Palette }> = () => {
  const frame = useCurrentFrame();
  const k = useK();
  const portrait = usePortrait();
  const a = useAppear(2, 180);
  const reveal = clamp01((frame - beat(15)) / beat(14));
  const tug = Math.sin(frame * 0.12) * 9 * reveal;
  return (
    <Stage>
      <div style={{ display: "flex", alignItems: "center", gap: (portrait ? 120 : 280) * k, position: "relative" }}>
        <div style={{ transform: `translateX(${tug}px)` }}><Tile x={0} y={0} size={200} color={U.yellow} a={a} i={1} /></div>
        <div style={{ transform: `translateX(${-tug}px)` }}><Tile x={0} y={0} size={200} color={U.sky} a={a} i={2} /></div>
        <div style={{
          position: "absolute", left: (portrait ? 150 : 200) * k, right: (portrait ? 150 : 200) * k, top: "50%",
          height: 22 * k, background: U.pink, border: `${3 * k}px solid ${U.ink}`, opacity: reveal,
          transform: `translateY(-50%) scaleX(${lerp(0.2, 1, reveal)})`, borderRadius: 11 * k,
        }} />
      </div>
      <Sticker text="deploy together — or not at all" x={50} y={85} rotate={-2} delay={20} bg={U.pink} fg={U.ink} size={34} i={7} />
    </Stage>
  );
};

/** Beat 12 — the stamp. The one hard impact in the film. */
export const NetworkedMonolith: React.FC<{ pal: Palette }> = () => {
  const frame = useCurrentFrame();
  const k = useK();
  const portrait = usePortrait();
  const s = spring({ frame: frame - beat(5), fps: 30, config: { damping: 130, mass: 0.9 }, durationInFrames: beat(28) });
  const sub = useAppear(22);
  return (
    <Stage>
      <div style={{ textAlign: "center", transform: `translateX(${shake(frame, beat(5), 13)}px)` }}>
        <Display size={portrait ? 84 : 128} color={U.yellow}
          style={{ transform: `scale(${lerp(portrait ? 1.6 : 2.1, 1, s)}) rotate(${lerp(-7, -2, s)}deg)`, opacity: Math.min(1, s * 2) }}>
          A networked<br />monolith
        </Display>
        <div style={{ marginTop: 46 * k, opacity: sub }}>
          <Display size={38} color={U.cream}>
            All the cost of distribution. <span style={{ color: U.pink }}>None of the freedom.</span>
          </Display>
        </div>
      </div>
    </Stage>
  );
};

/** Beat 13 — no turning back. */
export const NoTurningBack: React.FC<{ pal: Palette }> = () => {
  const frame = useCurrentFrame();
  const k = useK();
  const a = useAppear(2, 170);
  const barred = clamp01((frame - beat(16)) / beat(12));
  return (
    <Stage>
      <div style={{ position: "relative", opacity: a }}>
        {/* Ink, not cream: this beat sits on the yellow disc, and cream on yellow
            is unreadable. The whole beat is inside the disc, so ink is safe. */}
        <svg width={720 * k} height={200 * k} viewBox="0 0 720 200">
          <path d="M 700 100 L 90 100 M 160 40 L 90 100 L 160 160"
            stroke={U.ink} strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round"
            opacity={1 - barred * 0.55} />
        </svg>
        <div style={{
          position: "absolute", left: "50%", top: "50%",
          width: 320 * k, height: 20 * k, background: U.pink, borderRadius: 10 * k,
          transform: `translate(-50%,-50%) rotate(-38deg) scaleX(${barred})`,
        }} />
      </div>
      <div style={{ position: "absolute", bottom: 190 * k, textAlign: "center", opacity: barred }}>
        <Display size={62} color={U.ink}>There is no turning back.</Display>
        <div style={{ marginTop: 12 * k, fontFamily: MONO, fontSize: 22 * k, letterSpacing: "0.18em", color: U.ink, opacity: 0.6, textTransform: "uppercase" }}>
          Uber engineering, 2020
        </div>
      </div>
    </Stage>
  );
};

/* ── ACT 3 ───────────────────────────────────────────────────────────────── */

/** Beat 15 — 2,200 services collapse into 70 domains. The turn. */
export const DomainCollapse: React.FC<{ pal: Palette }> = () => {
  const frame = useCurrentFrame();
  const k = useK();
  const N = 240;
  const t = spring({ frame: frame - beat(6), fps: 30, config: { damping: 90, mass: 1 }, durationInFrames: 120 });
  const portrait = usePortrait();
  const COLS = portrait ? 7 : 10, ROWS = portrait ? 10 : 7;
  const GX = portrait ? 150 : 292, GY = portrait ? 420 : 232, PITCH = portrait ? 118 : 132;
  return (
    <Stage center={false}>
      <AbsoluteFill>
        {Array.from({ length: N }, (_, i) => {
          const x0 = 110 + rand(i * 2 + 3) * 1700;
          const y0 = 130 + rand(i * 2 + 9) * 830;
          const d = i % (COLS * ROWS);
          const gx = GX + 8 + (d % COLS) * PITCH;
          const gy = GY + 8 + Math.floor(d / COLS) * 82;
          return <Tile key={i} x={lerp(x0, gx, t) * k} y={lerp(y0, gy, t) * k}
            size={lerp(22, 10, t)} color={U.g100} a={1 - t * 0.8} i={i} outline={false} />;
        })}
        {Array.from({ length: COLS * ROWS }, (_, d) => (
          <Tile key={`d${d}`} x={(GX + (d % COLS) * PITCH) * k} y={(GY + Math.floor(d / COLS) * 82) * k}
            size={64} color={U.yellow} a={t} i={d + 400} />
        ))}
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 110 * k, textAlign: "center" }}>
        {/* The left number HOLDS at 2,200 — it is the claim, not a countdown.
            Counting it to zero reads as "0 → 70", which is not the story. */}
        <Display size={76} color={U.white}>
          2,200 <span style={{ opacity: 0.5 }}>→</span> <span style={{ color: U.yellow }}>{counter("70", t)}</span>
        </Display>
        <div style={{ marginTop: 10 * k, fontFamily: MONO, fontSize: 24 * k, letterSpacing: "0.2em", color: U.white, opacity: 0.75, textTransform: "uppercase" }}>
          services → domains
        </div>
      </div>
    </Stage>
  );
};

/** Beat 16 — five layers, one rule. */
export const LayerRule: React.FC<{ pal: Palette }> = () => {
  const frame = useCurrentFrame();
  const k = useK();
  const portrait = usePortrait();
  const LAYERS = ["Edge", "Presentation", "Product", "Business", "Infrastructure"];
  const bad = clamp01((frame - beat(40)) / beat(9));
  const reject = clamp01((frame - beat(49)) / beat(7));
  return (
    <Stage>
      <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 13 * k }}>
        {LAYERS.map((l, i) => {
          const idx = LAYERS.length - 1 - i;
          const a = useAppear(2 + idx * 3, 180);
          const alive = useAlive(i, 0.5);
          return (
            <div key={l} style={{
              width: (portrait ? 760 : 880) * k, height: (portrait ? 104 : 88) * k, borderRadius: 18 * k,
              background: i === 0 ? U.yellow : U.cream,
              border: `${4 * k}px solid ${U.ink}`,
              boxShadow: `${8 * k}px ${9 * k}px 0px ${U.ink}`,
              display: "flex", alignItems: "center", paddingLeft: 36 * k, gap: 24 * k,
              opacity: a, transform: `${alive.transform} translateY(${lerp(22, 0, a)}px)`,
            }}>
              <span style={{ fontFamily: MONO, fontSize: 20 * k, color: U.g500 }}>{String(LAYERS.length - i).padStart(2, "0")}</span>
              <span style={{ fontFamily: UBER, fontWeight: 800, fontSize: 38 * k, color: U.ink, letterSpacing: "-0.02em" }}>{l}</span>
            </div>
          );
        })}
        <svg width={120 * k} height={510 * k} style={{ position: "absolute", right: -96 * k, top: 0 }}>
          <path d={`M ${30 * k} ${40 * k} L ${30 * k} ${460 * k} M ${14 * k} ${430 * k} L ${30 * k} ${462 * k} L ${46 * k} ${430 * k}`}
            stroke={U.green} strokeWidth={7 * k} fill="none" strokeLinecap="round" />
        </svg>
        <svg width={120 * k} height={510 * k} style={{ position: "absolute", left: -96 * k, top: 0, opacity: bad }}>
          <path d={`M ${60 * k} ${460 * k} L ${60 * k} ${58 * k} M ${44 * k} ${90 * k} L ${60 * k} ${56 * k} L ${76 * k} ${90 * k}`}
            stroke={U.pink} strokeWidth={7 * k} fill="none" strokeLinecap="round" />
          <line x1={18 * k} y1={300 * k} x2={102 * k} y2={214 * k} stroke={U.pink} strokeWidth={9 * k} strokeLinecap="round" opacity={reject} />
        </svg>
      </div>
      <Sticker text="depend only downward" x={50} y={90} rotate={-1.5} delay={26} bg={U.green} fg={U.cream} size={34} i={11} />
    </Stage>
  );
};

/** Beat 17 — one door per domain. */
export const OneDoor: React.FC<{ pal: Palette }> = () => {
  const frame = useCurrentFrame();
  const k = useK();
  const portrait = usePortrait();
  const a = useAppear(2, 180);
  const gate = useAppear(6, 170);
  const pk = (i: number) => ((frame + i * 30) % 104) / 104;
  const ext = clamp01((frame - beat(34)) / beat(18));
  return (
    <Stage>
      <div style={{ position: "relative", width: 1420 * k, height: 500 * k, transform: `scale(${portrait ? 0.7 : 1})` }}>
        {[0, 1, 2].map((i) => (
          <Tile key={i} x={30 * k} y={(60 + i * 160) * k} size={94} color={U.cream} a={a} i={i} />
        ))}
        <svg width={1420 * k} height={500 * k} style={{ position: "absolute", inset: 0 }}>
          {/* Packets are large on purpose — at 9px they were invisible both to
              the viewer and to the pacing audit, so the beat read as frozen. */}
          {[0, 1, 2].map((i) => {
            const y = (107 + i * 160) * k;
            return (
              <g key={i}>
                <line x1={132 * k} y1={y} x2={556 * k} y2={250 * k} stroke={U.ink} strokeWidth={3 * k} opacity={0.5} />
                <circle cx={lerp(132 * k, 556 * k, pk(i))} cy={lerp(y, 250 * k, pk(i))} r={20 * k}
                  fill={U.pink} stroke={U.ink} strokeWidth={4 * k} />
              </g>
            );
          })}
        </svg>
        <div style={{
          position: "absolute", left: 556 * k, top: 160 * k, width: 150 * k, height: 180 * k,
          borderRadius: 20 * k, background: U.yellow, border: `${5 * k}px solid ${U.ink}`,
          boxShadow: `${10 * k}px ${11 * k}px 0px ${U.ink}`,
          opacity: gate, transform: `scale(${lerp(0.86, 1, gate)})`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontFamily: UBER, fontWeight: 800, fontSize: 28 * k, color: U.ink }}>Gateway</span>
        </div>
        <div style={{
          position: "absolute", left: 800 * k, top: 80 * k, width: 520 * k, height: 340 * k,
          borderRadius: 24 * k, border: `${3 * k}px dashed ${U.ink}`, opacity: gate * 0.6,
        }} />
        {[0, 1, 2, 3].map((i) => (
          <Tile key={`s${i}`} x={(850 + (i % 2) * 230) * k} y={(130 + Math.floor(i / 2) * 160) * k}
            size={92} color={U.cream} a={gate} i={i + 20} />
        ))}
      </div>
      <Sticker text="plugins → logic" x={82} y={30} rotate={4} delay={34} bg={U.green} fg={U.cream} size={28} i={13} />
      <Sticker text="protobuf → data" x={84} y={44} rotate={-3} delay={38} bg={U.pink} fg={U.ink} size={28} i={14} />
    </Stage>
  );
};

/** Beat 18 — the payoff, in Uber's real numbers. */
export const Payoff: React.FC<{ pal: Palette }> = () => {
  const frame = useCurrentFrame();
  const k = useK();
  const portrait = usePortrait();
  const stats: [string, string, string][] = [
    ["3 days", "3 hours", "to integrate a feature"],
    ["", "up to 50%", "faster onboarding"],
    ["", "10×", "lower support cost"],
  ];
  return (
    <Stage>
      <div style={{ display: "flex", flexDirection: portrait ? "column" : "row", gap: (portrait ? 54 : 80) * k, alignItems: portrait ? "center" : "flex-start" }}>
        {stats.map(([before, after, label], i) => {
          const a = useAppear(2 + i * 4, 170);
          // All three count TOGETHER and briefly. Staggering them left "0×" on
          // screen for two seconds, which reads as the result rather than as an
          // animation in progress. Continuous motion comes from the background.
          const count = clamp01((frame - 10) / 38);
          const alive = useAlive(i, 0.6);
          return (
            <div key={label} style={{ textAlign: "center", opacity: a, transform: `${alive.transform} translateY(${lerp(24, 0, a)}px)`, width: (portrait ? 900 : 450) * k }}>
              {before && (
                <div style={{ fontFamily: UBER, fontWeight: 700, fontSize: 42 * k, color: U.ink, opacity: 0.45, textDecoration: "line-through" }}>{before}</div>
              )}
              {/* Hours count DOWN from three days, so every intermediate frame is
                  a true, grammatical number. Counting up gave "1 hours". */}
              <Display size={106} color={U.ink} style={{ marginTop: before ? 8 * k : 58 * k }}>
                {i === 0 ? `${Math.round(lerp(72, 3, count))} hours` : counter(after, count)}
              </Display>
              <div style={{ marginTop: 12 * k, fontFamily: MONO, fontSize: 22 * k, letterSpacing: "0.16em", textTransform: "uppercase", color: U.ink, opacity: 0.75 }}>
                {label}
              </div>
            </div>
          );
        })}
      </div>
    </Stage>
  );
};

/** Beat 19 — the honest limitation. Half the grid never fills in. */
export const HalfBuilt: React.FC<{ pal: Palette }> = () => {
  const frame = useCurrentFrame();
  const k = useK();
  const portrait = usePortrait();
  const COLS = portrait ? 7 : 10, ROWS = portrait ? 10 : 7;
  const fill = clamp01((frame - beat(3)) / 150); // raw, not beat() — must span the beat
  return (
    <Stage>
      <div style={{ position: "relative", width: (portrait ? 826 : 1180) * k, height: (portrait ? 720 : 500) * k }}>
        {Array.from({ length: COLS * ROWS }, (_, d) => {
          const built = rand(d + 91) > 0.5;
          const on = clamp01(fill * COLS * ROWS - d);
          return (
            <div key={d} style={{
              position: "absolute", left: (d % COLS) * 118 * k, top: Math.floor(d / COLS) * 72 * k,
              width: 96 * k, height: 54 * k, borderRadius: 14 * k,
              background: built ? U.ink : "transparent",
              border: `${3 * k}px ${built ? "solid" : "dashed"} ${U.ink}`,
              opacity: built ? on : 0.5,
              transform: `scale(${built ? lerp(0.8, 1, on) : 1})`,
            }} />
          );
        })}
      </div>
      <Sticker text="half the domains still unbuilt" x={50} y={88} rotate={-2} delay={14} bg={U.ink} fg={U.yellow} size={34} i={17} />
    </Stage>
  );
};

/* ── structural cards ────────────────────────────────────────────────────── */

export const DomaTitle: React.FC<{ kicker: string; title: string; accent?: string; sub?: string; hue?: string }> = ({
  kicker, title, accent, sub, hue = U.cream,
}) => {
  const k = useK();
  const fg = inkOn(hue);
  const a1 = useAppear(2), a2 = useAppear(5, 170), a3 = useAppear(11);
  const i = accent && title.includes(accent) ? title.indexOf(accent) : -1;
  return (
    <Stage>
      <div style={{ textAlign: "center", padding: 100 * k }}>
        <div style={{ opacity: a1 }}><Tag color={fg}>{kicker}</Tag></div>
        <Display size={108} color={fg} style={{ marginTop: 24 * k, opacity: a2, transform: `translateY(${lerp(26, 0, a2)}px)` }}>
          {i < 0 ? title : (<>{title.slice(0, i)}<span style={{ color: U.pink }}>{accent}</span>{title.slice(i + (accent?.length || 0))}</>)}
        </Display>
        {sub && <div style={{ marginTop: 30 * k, fontFamily: UBER, fontWeight: 500, fontSize: 31 * k, color: fg, opacity: 0.72, maxWidth: 1250 * k, marginLeft: "auto", marginRight: "auto" }}>{sub}</div>}
      </div>
    </Stage>
  );
};

export const DomaChapter: React.FC<{ n: number; title: string; hue?: string }> = ({ n, title, hue = U.cream }) => {
  const frame = useCurrentFrame();
  const k = useK();
  const fg = inkOn(hue);
  const a = useAppear(2, 150);
  return (
    <Stage>
      <div style={{ display: "flex", alignItems: "baseline", gap: 34 * k, transform: `translateX(${shake(frame, beat(3), 9)}px)` }}>
        <Display size={230} color={U.pink} style={{ opacity: a, lineHeight: 0.9 }}>{String(n).padStart(2, "0")}</Display>
        <div style={{ overflow: "hidden" }}>
          <Display size={68} color={fg} style={{ transform: `translateY(${lerp(84, 0, a)}px)`, textTransform: "uppercase" }}>{title}</Display>
        </div>
      </div>
    </Stage>
  );
};

export const DomaStatement: React.FC<{ text: string; accent?: string; hue?: string }> = ({ text, accent, hue = U.cream }) => {
  const k = useK();
  const fg = inkOn(hue);
  const a = useAppear(3, 160);
  const i = accent && text.includes(accent) ? text.indexOf(accent) : -1;
  return (
    <Stage>
      <Display size={76} color={fg} style={{ maxWidth: 1420 * k, textAlign: "center", opacity: a, transform: `translateY(${lerp(20, 0, a)}px)`, lineHeight: 1.14 }}>
        {i < 0 ? text : (<>{text.slice(0, i)}<span style={{ color: U.pink }}>{accent}</span>{text.slice(i + (accent?.length || 0))}</>)}
      </Display>
    </Stage>
  );
};

export const DomaEnd: React.FC<{ line: string; accent?: string; cta?: string; next?: string; hue?: string }> = ({
  line, accent, cta, next, hue = U.cream,
}) => {
  const k = useK();
  const fg = inkOn(hue);
  const a = useAppear(2, 150), b = useAppear(10, 170);
  const i = accent && line.includes(accent) ? line.indexOf(accent) : -1;
  return (
    <Stage>
      <div style={{ textAlign: "center", opacity: a, transform: `translateY(${lerp(20, 0, a)}px)` }}>
        <Display size={84} color={fg} style={{ maxWidth: 1500 * k }}>
          {i < 0 ? line : (<>{line.slice(0, i)}<span style={{ color: U.pink }}>{accent}</span>{line.slice(i + (accent?.length || 0))}</>)}
        </Display>
        {cta && (
          <div style={{ marginTop: 42 * k, opacity: b }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 14 * k, background: U.yellow, color: U.ink,
              border: `${4 * k}px solid ${U.ink}`, boxShadow: `${8 * k}px ${9 * k}px 0px ${U.ink}`,
              fontFamily: UBER, fontWeight: 800, fontSize: 31 * k, padding: `${16 * k}px ${36 * k}px`, borderRadius: 999,
            }}>
              {cta}
              <svg width={24 * k} height={24 * k} viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
          </div>
        )}
        {next && (
          <div style={{ marginTop: 34 * k, fontFamily: MONO, fontSize: 24 * k, letterSpacing: "0.16em", textTransform: "uppercase", color: fg, opacity: 0.55 }}>
            {next}
          </div>
        )}
      </div>
    </Stage>
  );
};

export const DomaMark: React.FC<{ series: string; episode: string; hue?: string }> = ({ series, episode, hue = U.cream }) => {
  const k = useK();
  const fg = inkOn(hue);
  return (
    <div style={{ position: "absolute", right: 62 * k, bottom: 48 * k, display: "flex", alignItems: "center", gap: 11 * k, opacity: 0.5, zIndex: 3 }}>
      <div style={{ width: 8 * k, height: 8 * k, borderRadius: "50%", background: U.pink }} />
      <div style={{ fontFamily: MONO, fontSize: 20 * k, letterSpacing: "0.16em", textTransform: "uppercase", color: fg }}>
        {series} · {episode}
      </div>
    </div>
  );
};

export { interpolate };
