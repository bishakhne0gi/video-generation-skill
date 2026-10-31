// Author: Bishakh
//
// ══ EP 10 vocabulary — Zomato's New Year's Eve ══════════════════════════════
//
// Read off references/ep10-inspo/pin.jpg. Seven rules, and they are the whole
// look:
//
//   1. Cream field #F7F4EF. The series has been dark twice; this one is light.
//   2. EVERYTHING is outlined — a 3px #1C1C1C stroke on every card, star and
//      glyph. This single rule is what makes the frame read as one system.
//      No shadows, no gradients, no glow anywhere in this file.
//   3. One hue, ramped. Every fill is a step on the Zomato red ramp.
//   4. Gold #F5A623 stars are the ONLY second colour, used as punctuation.
//   5. Rounded rectangles at angles. Nothing axis-aligned except the centre
//      object and the type.
//   6. One hero object holds the centre, still, while the collage moves.
//   7. ~40% of the frame stays empty cream. Do not fill it.
//
// The reconciliation: the director kept full photoreal footage against this
// flat register. `FootageCard` is the answer — a Kling clip lives INSIDE an
// outlined rounded card, cropped to the collage's own geometry and graded warm,
// so the stroke language runs through both registers instead of the two sitting
// next to each other. Footage is never full-bleed in this episode.

import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { ZOMATO, MONO, SERIF } from "../fonts";
import { lerp, rand, useAppear, useK, useAlive, counter, clamp01 } from "./anim";
import manifest from "../../public/kling/manifest.json";

/* ── tokens ──────────────────────────────────────────────────────────────── */

/** The palette, straight off Zomato's brand + the reference's construction. */
export const Z = {
  cream: "#F7F4EF",
  creamDeep: "#EFEAE2",
  ink: "#1C1C1C",
  /** Cranberry — the exact brand red, and the fill in Zomato's own wordmark. */
  red: "#E23744",
  /** The ramp. Every fill in the film is one of these six, nothing between. */
  r1: "#FBE7E9",
  r2: "#F6C3C7",
  r3: "#EE9199",
  r4: "#E8606B",
  r5: "#E23744",
  r6: "#B92B36",
  /** The only second colour. Punctuation, never content. */
  gold: "#F5A623",
  white: "#FFFFFF",
} as const;

export const RAMP = [Z.r1, Z.r2, Z.r3, Z.r4, Z.r5, Z.r6];

/** The stroke. One width across the whole episode — vary it and the system breaks. */
const S = (k: number, w = 3) => `${w * k}px solid ${Z.ink}`;

const shotFile = (id: string) => (manifest as any)?.[id]?.file ?? `kling/${id}.mp4`;

/* ── the field ───────────────────────────────────────────────────────────── */

/** A five-point star, drawn not glyphed, so it can carry the stroke. */
export const Star: React.FC<{ x: number; y: number; size: number; delay?: number; i?: number; rotate?: number }> = ({
  x, y, size, delay = 0, i = 0, rotate = 0,
}) => {
  const a = useAppear(delay, 120); // low damping: stars POP, they don't ease
  const k = useK();
  const alive = useAlive(i + 40, 0.7);
  const pts = Array.from({ length: 10 }, (_, n) => {
    const r = n % 2 === 0 ? 50 : 21;
    const ang = (Math.PI / 5) * n - Math.PI / 2;
    return `${50 + r * Math.cos(ang)},${50 + r * Math.sin(ang)}`;
  }).join(" ");
  return (
    <div
      style={{
        position: "absolute", left: `${x}%`, top: `${y}%`,
        width: size * k, height: size * k,
        transform: `translate(-50%,-50%) rotate(${rotate}deg) scale(${lerp(0.2, 1, a)})`,
        opacity: clamp01(a * 1.4),
      }}
    >
      <div style={alive}>
        <svg viewBox="-4 -4 108 108" style={{ width: "100%", height: "100%", overflow: "visible" }}>
          <polygon points={pts} fill={Z.gold} stroke={Z.ink} strokeWidth={7} strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
};

/**
 * An outlined rounded card. The atom of this style — a message bubble in the
 * reference, a service / instance / shard here.
 */
export const Card: React.FC<{
  x: number; y: number; w: number; h: number; fill: string; rotate?: number;
  delay?: number; i?: number; children?: React.ReactNode; radius?: number; alive?: boolean;
}> = ({ x, y, w, h, fill, rotate = 0, delay = 0, i = 0, children, radius = 28, alive = true }) => {
  const a = useAppear(delay, 170);
  const k = useK();
  const float = useAlive(i, alive ? 1 : 0);
  return (
    <div
      style={{
        position: "absolute", left: `${x}%`, top: `${y}%`,
        width: w * k, height: h * k,
        // Tumble in: overshoot the angle slightly, settle at `rotate`.
        transform: `translate(-50%,-50%) rotate(${lerp(rotate - 9, rotate, a)}deg) scale(${lerp(0.82, 1, a)})`,
        opacity: clamp01(a * 1.6),
      }}
    >
      <div
        style={{
          ...float,
          width: "100%", height: "100%", background: fill,
          border: S(k), borderRadius: radius * k,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
};

/**
 * The cream field with its scatter of cards and stars. Every beat sits on one.
 * `seed` decorrelates the scatter so consecutive beats don't share a layout;
 * `density` is how much collage — drop it to 0 when the beat's own content is
 * busy, because rule 7 (keep 40% empty) outranks the scatter.
 */
export const Field: React.FC<{ seed: number; density?: number; stars?: number }> = ({
  seed, density = 7, stars = 5,
}) => {
  const k = useK();
  return (
    <AbsoluteFill style={{ background: Z.cream, overflow: "hidden" }}>
      {Array.from({ length: density }, (_, n) => {
        const r1 = rand(seed * 31 + n * 7.3);
        const r2 = rand(seed * 17 + n * 3.1);
        const r3 = rand(seed * 53 + n * 11.7);
        // Pushed to the edges: the centre belongs to the hero object.
        const edge = n % 2 === 0 ? 8 + r1 * 16 : 76 + r1 * 16;
        return (
          <Card
            key={n}
            x={edge}
            y={8 + r2 * 84}
            w={150 + r3 * 190}
            h={70 + r1 * 90}
            fill={RAMP[Math.floor(r3 * 4)]}
            rotate={(r2 - 0.5) * 26}
            delay={2 + n * 2}
            i={n + seed}
          />
        );
      })}
      {Array.from({ length: stars }, (_, n) => {
        const r1 = rand(seed * 91 + n * 13.9);
        const r2 = rand(seed * 41 + n * 5.5);
        return (
          <Star
            key={`s${n}`}
            x={n % 2 === 0 ? 5 + r1 * 18 : 78 + r1 * 18}
            y={6 + r2 * 88}
            size={38 + r1 * 46}
            rotate={(r2 - 0.5) * 40}
            delay={6 + n * 3}
            i={n + seed * 2}
          />
        );
      })}
      {/* Paper tooth. The reference is a flat digital piece, but at 1920 a pure
          flat cream reads as an empty canvas on a phone; this is barely there. */}
      <AbsoluteFill style={{ opacity: 0.035, pointerEvents: "none" }}>
        <svg width="100%" height="100%">
          <filter id="ep10paper">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={3} />
          </filter>
          <rect width="100%" height="100%" filter="url(#ep10paper)" />
        </svg>
      </AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, border: `${0 * k}px solid transparent` }} />
    </AbsoluteFill>
  );
};

/* ── the mark ────────────────────────────────────────────────────────────── */

/**
 * Zomato's app mark, centred and still, the way the reference centres the
 * WhatsApp glyph. Editorial use in a commentary piece about their engineering.
 */
export const ZomatoMark: React.FC<{ size?: number; delay?: number; y?: number }> = ({ size = 300, delay = 4, y = 50 }) => {
  const a = useAppear(delay, 200);
  const k = useK();
  return (
    <div
      style={{
        position: "absolute", left: "50%", top: `${y}%`,
        transform: `translate(-50%,-50%) scale(${lerp(0.86, 1, a)})`,
        opacity: a,
        width: size * k, height: size * k,
        border: S(k, 3.5), borderRadius: 64 * k, overflow: "hidden",
        background: Z.red,
      }}
    >
      <Img src={staticFile("brand/zomato-mark.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
  );
};

/* ── footage, brought into the collage ───────────────────────────────────── */

/**
 * THE reconciliation between photoreal footage and a flat outlined style.
 *
 * The clip is cropped into the collage's own shape — same radius, same 3px ink
 * stroke as every card — and pushed toward the red ramp so it shares the film's
 * hue. It never bleeds to the frame edge. Treated this way a Kling shot reads as
 * a photograph pinned into the collage, which is a thing this style does; played
 * full-bleed it would read as a different film spliced in.
 */
export const FootageCard: React.FC<{
  id: string; x?: number; y?: number; w?: number; h?: number; rotate?: number;
  delay?: number; startAt?: number; grade?: number; speed?: number; i?: number;
  /**
   * How far the clip pushes INSIDE its card across the beat. The default is a
   * slow drift. Raise it for a clip that is locked off in the footage itself —
   * a static plate in a static card is the one thing the pacing audit cannot
   * forgive, and this is the only motion such a shot has.
   */
  push?: number;
  children?: React.ReactNode;
}> = ({ id, x = 50, y = 50, w = 1180, h = 664, rotate = -2, delay = 3, startAt = 0.35, grade = 0.5, speed = 1, i = 3, push = 1.13, children }) => {
  const a = useAppear(delay, 180);
  const k = useK();
  const float = useAlive(i, 0.6);
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute", left: `${x}%`, top: `${y}%`,
        width: w * k, height: h * k,
        transform: `translate(-50%,-50%) rotate(${lerp(rotate - 5, rotate, a)}deg) scale(${lerp(0.88, 1, a)})`,
        opacity: clamp01(a * 1.5),
      }}
    >
      <div
        style={{
          ...float,
          width: "100%", height: "100%", position: "relative", overflow: "hidden",
          border: S(k, 3.5), borderRadius: 34 * k, background: Z.ink,
        }}
      >
        <OffthreadVideo
          src={staticFile(shotFile(id))}
          startFrom={Math.round(startAt * 30)}
          playbackRate={speed}
          muted
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            // A push INSIDE the card, so a still card still has motion.
            transform: `scale(${lerp(1.04, push, clamp01(frame / 150))})`,
          }}
        />
        {/* Grade toward the ramp. `color` blend keeps the luminance and swaps the
            hue, which is what pulls a blue data-centre into a red film. */}
        <AbsoluteFill style={{ background: Z.red, mixBlendMode: "color", opacity: 0.42 * grade }} />
        <AbsoluteFill style={{ background: Z.gold, mixBlendMode: "overlay", opacity: 0.12 * grade }} />
        {children}
      </div>
    </div>
  );
};

/** A short label pinned to a footage card — the Remotion element footage must carry. */
export const PinLabel: React.FC<{ text: string; x?: number; y?: number; delay?: number; fill?: string }> = ({
  text, x = 50, y = 90, delay = 12, fill = Z.gold,
}) => {
  const a = useAppear(delay, 150);
  const k = useK();
  return (
    <div
      style={{
        position: "absolute", left: `${x}%`, top: `${y}%`,
        transform: `translate(-50%,-50%) rotate(-1.5deg) scale(${lerp(0.8, 1, a)})`,
        opacity: clamp01(a * 1.6),
        background: fill, border: S(k, 2.5), borderRadius: 999,
        padding: `${11 * k}px ${26 * k}px`,
        fontFamily: MONO, fontWeight: 700, fontSize: 25 * k,
        letterSpacing: "0.06em", textTransform: "uppercase", color: Z.ink,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

/* ── type ────────────────────────────────────────────────────────────────── */

export const Display: React.FC<{
  children: React.ReactNode; size?: number; color?: string; delay?: number; align?: "center" | "left"; max?: number;
}> = ({ children, size = 96, color = Z.ink, delay = 3, align = "center", max = 1380 }) => {
  const a = useAppear(delay, 180);
  const k = useK();
  return (
    <div
      style={{
        fontFamily: ZOMATO, fontWeight: 800, letterSpacing: "-0.035em",
        fontSize: size * k, lineHeight: 1.02, color, textAlign: align,
        maxWidth: max * k, opacity: a, transform: `translateY(${lerp(22, 0, a)}px)`,
      }}
    >
      {children}
    </div>
  );
};

/** Centred stack — the layout nearly every beat uses. */
export const Stage: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 30 }) => {
  const k = useK();
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: gap * k, padding: 120 * k }}>
      {children}
    </AbsoluteFill>
  );
};

export const ZTitle: React.FC<{ kicker: string; title: string; accent?: string; sub?: string }> = ({ kicker, title, accent, sub }) => {
  const k = useK();
  const a = useAppear(2, 200);
  const parts = accent && title.includes(accent)
    ? [title.slice(0, title.indexOf(accent)), accent, title.slice(title.indexOf(accent) + accent.length)]
    : [title, "", ""];
  return (
    <Stage gap={26}>
      <div
        style={{
          fontFamily: MONO, fontSize: 26 * k, letterSpacing: "0.22em", textTransform: "uppercase",
          color: Z.ink, opacity: a, background: Z.gold, border: S(k, 2.5), borderRadius: 999,
          padding: `${9 * k}px ${24 * k}px`,
        }}
      >
        {kicker}
      </div>
      <Display size={104} delay={5}>
        {parts[0]}
        {parts[1] && <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, color: Z.red }}>{parts[1]}</span>}
        {parts[2]}
      </Display>
      {sub && (
        <div
          style={{
            fontFamily: MONO, fontSize: 27 * k, lineHeight: 1.5, color: Z.ink, opacity: 0.72 * a,
            maxWidth: 1000 * k, textAlign: "center", marginTop: 6 * k,
          }}
        >
          {sub}
        </div>
      )}
    </Stage>
  );
};

export const ZChapter: React.FC<{ n: number; title: string }> = ({ n, title }) => {
  const k = useK();
  const a = useAppear(2, 150);
  return (
    <Stage gap={22}>
      <div
        style={{
          width: 168 * k, height: 168 * k, borderRadius: 44 * k, background: Z.red, border: S(k, 3.5),
          display: "flex", alignItems: "center", justifyContent: "center",
          transform: `rotate(${lerp(-14, -5, a)}deg) scale(${lerp(0.7, 1, a)})`, opacity: a,
          fontFamily: ZOMATO, fontWeight: 900, fontSize: 92 * k, color: Z.white,
        }}
      >
        {String(n).padStart(2, "0")}
      </div>
      <Display size={86} delay={7}>{title}</Display>
    </Stage>
  );
};

export const ZStatement: React.FC<{ text: string; accent?: string }> = ({ text, accent }) => {
  const parts = accent && text.includes(accent)
    ? [text.slice(0, text.indexOf(accent)), accent, text.slice(text.indexOf(accent) + accent.length)]
    : [text, "", ""];
  return (
    <Stage>
      <Display size={108}>
        {parts[0]}
        {parts[1] && <span style={{ color: Z.red }}>{parts[1]}</span>}
        {parts[2]}
      </Display>
    </Stage>
  );
};

/* ── the signature move: the cliff ───────────────────────────────────────── */

/**
 * THE shape of this episode. Order volume does not ramp on New Year's Eve — it
 * steps, and stays stepped. Drawn as a hard step function precisely because a
 * smooth curve would be the lie the whole film is arguing against.
 *
 * `ghost` renders it as a pale silhouette behind other content, which is how it
 * recurs under the later diagrams: the cliff is literally the shape of the film.
 */
export const StepGraph: React.FC<{ delay?: number; ghost?: boolean; label?: string }> = ({
  delay = 4, ghost = false, label,
}) => {
  const a = useAppear(delay, 190);
  const k = useK();
  const W = 1240, H = 520;
  // A flat evening, one vertical wall at midnight, a long high plateau.
  const pts: [number, number][] = [
    [0, 430], [190, 424], [330, 415], [430, 404],
    [470, 402], [470, 96], // ← the cliff
    [620, 88], [800, 92], [980, 84], [1120, 96], [1240, 108],
  ];
  const n = Math.max(2, Math.round(pts.length * clamp01(a * 1.25)));
  const shown = pts.slice(0, n);
  const d = shown.map((p, j) => `${j === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
  const area = `${d} L${shown[shown.length - 1][0]},${H} L0,${H} Z`;
  return (
    <div
      style={{
        position: "absolute", left: "50%", top: ghost ? "56%" : "54%",
        transform: `translate(-50%,-50%)`, width: W * k, opacity: ghost ? 0.16 : 1,
      }}
    >
      <svg viewBox={`-6 -6 ${W + 12} ${H + 40}`} style={{ width: "100%", overflow: "visible" }}>
        {/* baseline */}
        <line x1={0} y1={H} x2={W} y2={H} stroke={Z.ink} strokeWidth={3} />
        <path d={area} fill={Z.r2} opacity={0.85} />
        <path d={d} fill="none" stroke={Z.ink} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" />
        {/* The wall gets its own mark — this is the point of the whole graph. */}
        {a > 0.55 && !ghost && (
          <>
            <line x1={470} y1={96} x2={470} y2={430} stroke={Z.red} strokeWidth={7} strokeDasharray="14 12" />
            <circle cx={470} cy={96} r={17} fill={Z.gold} stroke={Z.ink} strokeWidth={6} />
          </>
        )}
      </svg>
      {label && !ghost && (
        <div
          style={{
            fontFamily: MONO, fontSize: 24 * k, letterSpacing: "0.14em", textTransform: "uppercase",
            color: Z.ink, opacity: 0.6, textAlign: "center", marginTop: 14 * k,
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};

/* ── diagrams ────────────────────────────────────────────────────────────── */

/**
 * The event spine. Producers on the left, one queue down the middle, consumers
 * on the right, and messages travelling the whole beat — the "something is
 * always happening" layer for a beat whose narration is long.
 */
export const EventSpine: React.FC<{ delay?: number }> = ({ delay = 3 }) => {
  const a = useAppear(delay, 180);
  const k = useK();
  const frame = useCurrentFrame();
  const rows = ["order", "payment", "dispatch", "rider", "kitchen"];
  return (
    <div style={{ position: "absolute", left: "50%", top: "52%", transform: "translate(-50%,-50%)", width: 1420 * k, opacity: a }}>
      <svg viewBox="0 0 1420 560" style={{ width: "100%", overflow: "visible" }}>
        {/* the queue itself */}
        <rect x={560} y={60} width={300} height={440} rx={34} fill={Z.r5} stroke={Z.ink} strokeWidth={5} />
        {rows.map((r, i) => {
          const y = 100 + i * 88;
          const on = a > 0.25 + i * 0.09;
          // a packet crawling producer → queue → consumer, decorrelated per row
          const p = ((frame * 0.014 + rand(i + 7)) % 1);
          const px = p < 0.5 ? lerp(250, 560, p * 2) : lerp(860, 1180, (p - 0.5) * 2);
          return (
            <g key={r} opacity={on ? 1 : 0}>
              <rect x={60} y={y - 34} width={200} height={68} rx={22} fill={Z.r2} stroke={Z.ink} strokeWidth={4} />
              <rect x={1160} y={y - 34} width={200} height={68} rx={22} fill={Z.r3} stroke={Z.ink} strokeWidth={4} />
              <line x1={260} y1={y} x2={560} y2={y} stroke={Z.ink} strokeWidth={3} />
              <line x1={860} y1={y} x2={1160} y2={y} stroke={Z.ink} strokeWidth={3} />
              <circle cx={px} cy={y} r={13} fill={Z.gold} stroke={Z.ink} strokeWidth={4} />
            </g>
          );
        })}
        <text
          x={710} y={310} textAnchor="middle"
          style={{ fontFamily: ZOMATO, fontWeight: 900, fontSize: 58, fill: Z.white }}
        >
          QUEUE
        </text>
      </svg>
    </div>
  );
};

/** A big sourced number, counting up, on a card. The evidence beats. */
export const BigStat: React.FC<{ value: string; unit: string; caption?: string; delay?: number; fill?: string }> = ({
  value, unit, caption, delay = 3, fill = Z.r5,
}) => {
  const a = useAppear(delay, 200);
  const k = useK();
  return (
    <Stage gap={24}>
      <div
        style={{
          background: fill, border: S(k, 3.5), borderRadius: 44 * k,
          padding: `${46 * k}px ${74 * k}px`, textAlign: "center",
          transform: `rotate(${lerp(-6, -1.5, a)}deg) scale(${lerp(0.86, 1, a)})`, opacity: a,
        }}
      >
        <div style={{ fontFamily: ZOMATO, fontWeight: 900, fontSize: 168 * k, lineHeight: 0.92, color: Z.white, letterSpacing: "-0.04em" }}>
          {counter(value, a)}
        </div>
        <div style={{ fontFamily: MONO, fontSize: 30 * k, letterSpacing: "0.16em", textTransform: "uppercase", color: Z.white, opacity: 0.9, marginTop: 14 * k }}>
          {unit}
        </div>
      </div>
      {caption && (
        <div style={{ fontFamily: MONO, fontSize: 26 * k, color: Z.ink, opacity: 0.66, textAlign: "center" }}>{caption}</div>
      )}
    </Stage>
  );
};

/**
 * Eleven thousand instances, pre-scaled. A grid that fills across the whole beat
 * — the counter is still running when the narration lands on the number, which
 * is what keeps this beat off the pacing report's static list.
 */
export const InstanceGrid: React.FC<{ cols?: number; rows?: number; delay?: number; total?: string }> = ({
  cols = 34, rows = 14, delay = 2, total = "11,000",
}) => {
  const a = useAppear(delay, 210);
  const k = useK();
  const frame = useCurrentFrame();
  const n = cols * rows;
  const lit = Math.floor(n * clamp01((frame - 6) / 74));
  return (
    <div style={{ position: "absolute", left: "50%", top: "54%", transform: "translate(-50%,-50%)", width: 1460 * k, opacity: a }}>
      {/* Cream backing plate. Without it the field's scatter cards and stars sit
          BEHIND the lattice and poke through the gaps between cells, which reads
          as a rendering fault rather than a collage. */}
      <div
        style={{
          position: "absolute", inset: `${-34 * k}px ${-30 * k}px ${-24 * k}px`,
          background: Z.cream, borderRadius: 26 * k,
        }}
      />
      <div style={{ position: "relative", display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 7 * k }}>
        {Array.from({ length: n }, (_, i) => (
          <div
            key={i}
            style={{
              aspectRatio: "1", borderRadius: 5 * k,
              background: i < lit ? RAMP[3 + (i % 3)] : Z.creamDeep,
              border: `${1.4 * k}px solid ${i < lit ? Z.ink : "#00000018"}`,
            }}
          />
        ))}
      </div>
      <div
        style={{
          position: "relative",
          fontFamily: ZOMATO, fontWeight: 900, fontSize: 70 * k, color: Z.ink,
          textAlign: "center", marginTop: 26 * k, letterSpacing: "-0.03em",
        }}
      >
        {counter(total, clamp01((frame - 6) / 74))}
        <span style={{ fontFamily: MONO, fontSize: 26 * k, letterSpacing: "0.16em", marginLeft: 16 * k, opacity: 0.6 }}>
          INSTANCES, PRE-SCALED
        </span>
      </div>
    </div>
  );
};

/**
 * A live time-series strip: bars that never stop arriving from the right.
 *
 * This exists because of a MEASURED failure. The observability beat has 6.6s of
 * narration but its two cards landed in the first 1.5s, and the pacing audit
 * found the remaining 5.5s as the only static stretch in the film — 5.7% of the
 * runtime, all in one place. Counters that finish early are worse than no
 * counters: the screen announces it is done while the voice keeps talking. This
 * strip is the "something is still happening" layer, and it is deliberately the
 * literal thing the narration is describing — data points arriving every second.
 */
const SeriesStrip: React.FC<{ n?: number; delay?: number }> = ({ n = 54, delay = 10 }) => {
  const k = useK();
  const a = useAppear(delay, 180);
  const frame = useCurrentFrame();
  // Scroll by whole bars so the motion is continuous but never blurs.
  const off = frame * 0.42;
  return (
    <div
      style={{
        display: "flex", alignItems: "flex-end", gap: 5 * k, height: 96 * k,
        opacity: a * 0.95, overflow: "hidden",
        background: Z.cream, border: S(k, 2.5), borderRadius: 22 * k,
        padding: `${12 * k}px ${16 * k}px`,
      }}
    >
      {Array.from({ length: n }, (_, i) => {
        const idx = Math.floor(off) + i;
        const h = 18 + rand(idx * 1.7) * 78;
        return (
          <div
            key={i}
            style={{
              width: 9 * k, height: h * 0.72 * k, borderRadius: 3 * k,
              background: RAMP[2 + (idx % 4)],
              border: `${1.2 * k}px solid ${Z.ink}`,
            }}
          />
        );
      })}
    </div>
  );
};

/** Two stacked evidence rows + the live strip — the observability beat. */
export const StatPair: React.FC<{ a1: [string, string]; a2: [string, string]; delay?: number }> = ({ a1, a2, delay = 3 }) => {
  const k = useK();
  const frame = useCurrentFrame();
  // NOT the spring: springs settle in well under a second. These ramp across
  // ~3.5s so the numbers are still climbing when the narration reaches them.
  const p = clamp01((frame - 4) / 84);
  const q = clamp01((frame - 26) / 92);
  // The card LANDS fast (spring) while its number keeps CLIMBING (linear ramp).
  // Tying both to one value is what made this beat finish early.
  const ap = useAppear(delay, 190);
  const aq = useAppear(delay + 8, 190);
  const Row = (v: string, l: string, t: number, appear: number, fill: string, rot: number) => (
    <div
      style={{
        display: "flex", alignItems: "baseline", gap: 26 * k,
        background: fill, border: S(k, 3.5), borderRadius: 34 * k,
        padding: `${28 * k}px ${52 * k}px`,
        transform: `rotate(${lerp(rot - 4, rot, appear)}deg) scale(${lerp(0.9, 1, appear)})`, opacity: appear,
      }}
    >
      <div style={{ fontFamily: ZOMATO, fontWeight: 900, fontSize: 104 * k, color: Z.white, letterSpacing: "-0.04em", lineHeight: 1 }}>
        {counter(v, t)}
      </div>
      <div style={{ fontFamily: MONO, fontSize: 27 * k, letterSpacing: "0.13em", textTransform: "uppercase", color: Z.white, opacity: 0.9 }}>
        {l}
      </div>
    </div>
  );
  // gap 54: at 30 the two rotated rows overlapped each other's corners, which
  // read as a collision rather than a stack.
  return (
    <Stage gap={54}>
      {Row(a1[0], a1[1], p, ap, Z.r5, -2.5)}
      {Row(a2[0], a2[1], q, aq, Z.r6, 2)}
      <SeriesStrip delay={14} />
    </Stage>
  );
};

/* ── close ───────────────────────────────────────────────────────────────── */

export const ZEnd: React.FC<{ line: string; accent?: string; cta?: string; next?: string }> = ({ line, accent, cta, next }) => {
  const k = useK();
  const a = useAppear(3, 190);
  const b = useAppear(16, 190);
  const parts = accent && line.includes(accent)
    ? [line.slice(0, line.indexOf(accent)), accent, line.slice(line.indexOf(accent) + accent.length)]
    : [line, "", ""];
  return (
    <Stage gap={30}>
      <Display size={100} delay={3}>
        {parts[0]}
        {parts[1] && <span style={{ color: Z.red }}>{parts[1]}</span>}
        {parts[2]}
      </Display>
      <div style={{ display: "flex", gap: 18 * k, opacity: b, transform: `translateY(${lerp(20, 0, b)}px)` }}>
        {cta && (
          <div
            style={{
              background: Z.red, border: S(k, 3), borderRadius: 999, padding: `${15 * k}px ${34 * k}px`,
              fontFamily: MONO, fontSize: 26 * k, fontWeight: 700, color: Z.white, letterSpacing: "0.05em",
            }}
          >
            {cta}
          </div>
        )}
        {next && (
          <div
            style={{
              background: Z.gold, border: S(k, 3), borderRadius: 999, padding: `${15 * k}px ${34 * k}px`,
              fontFamily: MONO, fontSize: 26 * k, fontWeight: 700, color: Z.ink, letterSpacing: "0.05em",
            }}
          >
            {next}
          </div>
        )}
      </div>
    </Stage>
  );
};

/** Persistent series mark. Outlined, like everything else. */
export const ZMark: React.FC<{ series: string; episode: string }> = ({ series, episode }) => {
  const k = useK();
  return (
    <div
      style={{
        // Same push clearance as TopTag.
        position: "absolute", right: 108 * k, bottom: 88 * k,
        display: "flex", alignItems: "center", gap: 12 * k,
        background: Z.cream, border: S(k, 2.5), borderRadius: 999,
        padding: `${9 * k}px ${20 * k}px`, opacity: 0.9,
      }}
    >
      <div style={{ width: 13 * k, height: 13 * k, borderRadius: "50%", background: Z.red, border: `${2 * k}px solid ${Z.ink}` }} />
      <div style={{ fontFamily: MONO, fontSize: 21 * k, letterSpacing: "0.15em", textTransform: "uppercase", color: Z.ink }}>
        {series} · {episode}
      </div>
    </div>
  );
};

/** Top-left beat tag — the "2013" / "one root cause" register from EP09. */
export const TopTag: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const k = useK();
  const a = useAppear(4, 160);
  return (
    <div
      style={{
        // 112/92, not 64/54. MEASURED on the first render: the automatic ~7%
        // camera push crops up to ~67px a side at 1920, and at a 64px inset the
        // tag lost its first characters — "ORDERS PER MINUTE" rendered as "RS
        // PER MINUTE". Anything pinned to an edge in this film needs to clear
        // the push, not just the frame.
        position: "absolute", left: 112 * k, top: 92 * k, opacity: a,
        background: Z.cream, border: S(k, 2.5), borderRadius: 999,
        padding: `${9 * k}px ${22 * k}px`,
        fontFamily: MONO, fontSize: 22 * k, letterSpacing: "0.15em", textTransform: "uppercase", color: Z.ink,
      }}
    >
      {children}
    </div>
  );
};
