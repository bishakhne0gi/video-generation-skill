// Author: Bishakh
//
// EP08 scene vocabulary — "Spotify's shuffle wasn't broken. Randomness was."
//
// These sit alongside src/lib/kit.tsx rather than replacing it: the kit carries
// the house primitives, this file carries the things only this episode needs —
// the playlist strip, the maths, Clarke's table and the blue-noise payoff.
//
// The protagonist motif is PlaylistStrip: one row of 100 dots that survives the
// whole film. It clumps in Act 2 and re-spaces itself in Act 3. Same component,
// two orders — that continuity is what makes the payoff land.

import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import type { Palette } from "../theme";
import { HEAD, SANS, MONO, SERIF } from "../fonts";
import { lerp, clamp01, useAppear, useK, shake, rand } from "./anim";
import { Backdrop, Head, TopEyebrow } from "./kit";
import D from "../data/ep08.json";

/** Spotify's brand green. Used ONLY where it means Spotify — never as decoration. */
export const SPOTIFY = "#1DB954";

/**
 * Scene content layer. ALWAYS wrap what follows a <Backdrop> in this.
 *
 * Backdrop is an AbsoluteFill, so it paints in CSS's positioned step and covers
 * any static, untransformed sibling. Elements that happen to carry a transform
 * or a fractional opacity get promoted and survive by accident — so a scene
 * looks right until a spring settles on exactly 1, the stacking context
 * disappears, and the element silently drops behind the backdrop. This makes the
 * layering explicit instead of accidental.
 */
export const Layer: React.FC<{ center?: boolean; children: React.ReactNode; style?: React.CSSProperties }> = ({
  center, children, style,
}) => (
  <AbsoluteFill
    style={{ zIndex: 1, ...(center ? { alignItems: "center", justifyContent: "center" } : null), ...style }}
  >
    {children}
  </AbsoluteFill>
);

/** Ten distinguishable artist hues at even lightness on white. */
export const ARTIST_COLORS = [
  "#E5484D", "#F5A524", "#46A758", "#00A2C7", "#4940FF",
  "#8E4EC6", "#D6409F", "#12A594", "#F76B15", "#3E63DD",
];

/* ── the real Spotify mark ───────────────────────────────────────────────────
   Drawn from the official path data, not generated — Kling is never allowed
   near a logo. Editorial/nominative use in a commentary piece. */
export const SpotifyMark: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = ({
  size = 120, color = SPOTIFY, style,
}) => (
  <svg width={size} height={size} viewBox="0 0 168 168" style={style}>
    <path
      fill={color}
      d="M83.996.277C37.747.277.253 37.77.253 84.019c0 46.251 37.494 83.741 83.743 83.741 46.254 0 83.744-37.49 83.744-83.741 0-46.246-37.49-83.738-83.745-83.738l.001-.004zm38.404 120.78a5.217 5.217 0 01-7.18 1.73c-19.662-12.01-44.414-14.73-73.564-8.07a5.222 5.222 0 01-6.249-3.93 5.213 5.213 0 013.926-6.25c31.9-7.291 59.263-4.15 81.337 9.34 2.46 1.51 3.24 4.72 1.73 7.18zm10.25-22.805c-1.89 3.075-5.91 4.045-8.98 2.155-22.51-13.839-56.823-17.846-83.448-9.764-3.453 1.043-7.1-.903-8.148-4.35a6.538 6.538 0 014.354-8.143c30.413-9.228 68.222-4.758 94.072 11.127 3.07 1.89 4.04 5.91 2.15 8.976v-.001zm.88-23.744c-26.99-16.031-71.52-17.505-97.289-9.684-4.138 1.255-8.514-1.081-9.768-5.219a7.835 7.835 0 015.221-9.771c29.581-8.98 78.756-7.245 109.83 11.202a7.823 7.823 0 012.74 10.733c-2.2 3.722-7.02 4.949-10.73 2.739z"
    />
  </svg>
);

/* ── Vox cutout collage (Act 1) ──────────────────────────────────────────── */

/** A keyed photographic cutout with the hard offset shadow of a paper collage. */
export const Cutout: React.FC<{
  src: string; width: number; x: number; y: number; rotate?: number; delay?: number; shadow?: string;
}> = ({ src, width, x, y, rotate = 0, delay = 0, shadow = "rgba(12,25,39,0.22)" }) => {
  const a = useAppear(delay, 160);
  const k = useK();
  return (
    <div
      style={{
        position: "absolute", left: `${x}%`, top: `${y}%`, width: width * k,
        transform: `translate(-50%,-50%) rotate(${rotate}deg) translateY(${lerp(40, 0, a)}px) scale(${lerp(0.92, 1, a)})`,
        opacity: a,
        filter: `drop-shadow(${18 * k}px ${20 * k}px 0px ${shadow})`,
      }}
    >
      <Img src={staticFile(src)} style={{ width: "100%", display: "block" }} />
    </div>
  );
};

/** A complaint, set as a paper card. Never a full narration sentence — these are
 *  the users' words, short, as they were actually written. */
export const ComplaintCard: React.FC<{
  pal: Palette; text: string; x: number; y: number; rotate?: number; delay?: number; accent?: boolean;
}> = ({ pal, text, x, y, rotate = 0, delay = 0, accent = false }) => {
  const a = useAppear(delay, 150);
  const k = useK();
  return (
    <div
      style={{
        position: "absolute", left: `${x}%`, top: `${y}%`, maxWidth: 520 * k,
        transform: `translate(-50%,-50%) rotate(${rotate}deg) translateY(${lerp(28, 0, a)}px)`,
        opacity: a,
        background: accent ? pal.accent : "#FFFFFF",
        color: accent ? "#FFFFFF" : pal.ink,
        border: `2px solid ${accent ? pal.accent : pal.ink}`,
        borderRadius: 8 * k,
        padding: `${22 * k}px ${30 * k}px`,
        boxShadow: `${12 * k}px ${13 * k}px 0px ${accent ? "rgba(12,25,39,0.25)" : pal.ink}`,
        fontFamily: SANS, fontWeight: 600, fontSize: 32 * k, lineHeight: 1.25,
      }}
    >
      {text}
    </div>
  );
};

export const ComplaintCollage: React.FC<{ pal: Palette }> = ({ pal }) => {
  const k = useK();
  const a = useAppear(2);
  return (
    <AbsoluteFill style={{ background: "#F4F1EA" }}>
      {/* newsprint tint + faint rule grid: the Vox paper register */}
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${pal.ink}0c 1px, transparent 1px)`,
          backgroundSize: `100% ${44 * k}px`, opacity: 0.5,
        }}
      />
      <div style={{ position: "absolute", zIndex: 1, left: 120 * k, top: 90 * k, display: "flex", alignItems: "center", gap: 22 * k, opacity: a }}>
        <SpotifyMark size={54 * k} color={pal.ink} />
        <div style={{ fontFamily: MONO, fontSize: 24 * k, letterSpacing: "0.18em", textTransform: "uppercase", color: pal.ink, opacity: 0.65 }}>
          Community · 2014
        </div>
      </div>

      {/* Runs off the bottom edge on purpose — a cutout that stops just short of
          the frame reads as a crop mistake. */}
      <Cutout src="cutouts/person.png" width={690} x={25} y={63} rotate={-3} delay={6} />
      <Cutout src="cutouts/earbuds.png" width={240} x={57} y={84} rotate={7} delay={30} />

      <ComplaintCard pal={pal} text="Your shuffle is broken." x={62} y={26} rotate={-2} delay={14} accent />
      <ComplaintCard pal={pal} text="It keeps playing the same artist." x={72} y={46} rotate={2} delay={30} />
      <ComplaintCard pal={pal} text="I pay for this. Fix it." x={64} y={66} rotate={-1.5} delay={48} />
    </AbsoluteFill>
  );
};

/* ── the protagonist motif: 100 songs in a row ───────────────────────────── */

const UNIFORM: number[] = D.uniform as number[];
const SPREAD: number[] = D.spread as number[];

/** Playlist positions 0..99 → x across the strip. */
const stripX = (i: number, w: number) => (i / 99) * w;

/**
 * One hundred songs, ten artists, laid out left to right in play order.
 *
 * `morph` 0 → the fair Fisher–Yates order, 1 → Poláček's spaced order. Dots keep
 * their identity across the morph, so Act 3's fix reads as the same playlist
 * rearranging rather than a new graphic.
 */
export const PlaylistStrip: React.FC<{
  pal: Palette;
  morph?: number;
  showRepeats?: number;   // 0..1, how many of the 9 repeats have flared
  appearFrom?: number;    // frame the dots start landing
  y?: number;             // vertical centre, % of frame
  label?: string;
}> = ({ pal, morph = 0, showRepeats = 0, appearFrom = 0, y = 50, label }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const k = useK();
  const w = width - 260 * k;
  const x0 = 130 * k;
  const cy = (height * y) / 100;
  const r = 9 * k;

  // where each artist's songs sit in each of the two orders
  const posA = React.useMemo(() => {
    const m: number[][] = Array.from({ length: 10 }, () => []);
    UNIFORM.forEach((art, i) => m[art].push(i));
    return m;
  }, []);
  const posB = React.useMemo(() => {
    const m: number[][] = Array.from({ length: 10 }, () => []);
    SPREAD.forEach((art, i) => m[art].push(i));
    return m;
  }, []);

  // adjacent same-artist pairs in the fair shuffle — the 9 the maths predicts
  const repeats = React.useMemo(
    () => UNIFORM.map((a, i) => (i > 0 && UNIFORM[i - 1] === a ? i : -1)).filter((i) => i >= 0),
    []
  );
  const flared = Math.floor(showRepeats * repeats.length + 0.001);

  const dots = UNIFORM.map((artist, i) => {
    const nth = posA[artist].indexOf(i);        // this dot's index within its artist
    const target = posB[artist][nth];           // where the same dot goes after the fix
    const idx = lerp(i, target, morph);
    const land = spring({ frame: frame - appearFrom - i * 0.55, fps: 30, config: { damping: 200 }, durationInFrames: 22 });
    const isRepeat = repeats.indexOf(i) >= 0 && repeats.indexOf(i) < flared;
    const isPrev = repeats.indexOf(i + 1) >= 0 && repeats.indexOf(i + 1) < flared;
    const hot = isRepeat || isPrev;
    return { i, artist, x: x0 + stripX(idx, w), land, hot };
  });

  return (
    <>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {/* connector brackets under each flared repeat pair */}
        {repeats.slice(0, flared).map((i, n) => {
          const s = spring({ frame: frame - appearFrom - 34 - n * 5, fps: 30, config: { damping: 170 }, durationInFrames: 18 });
          const xa = x0 + stripX(lerp(i - 1, posB[UNIFORM[i - 1]][posA[UNIFORM[i - 1]].indexOf(i - 1)], morph), w);
          const xb = x0 + stripX(lerp(i, posB[UNIFORM[i]][posA[UNIFORM[i]].indexOf(i)], morph), w);
          return (
            <path
              key={i}
              d={`M ${xa} ${cy + r + 10 * k} L ${xa} ${cy + r + 26 * k} L ${xb} ${cy + r + 26 * k} L ${xb} ${cy + r + 10 * k}`}
              fill="none" stroke={pal.ink} strokeWidth={3 * k} strokeLinecap="round" strokeLinejoin="round"
              opacity={s * 0.85}
            />
          );
        })}
        {dots.map((d) => (
          <circle
            key={d.i}
            cx={d.x}
            cy={cy + lerp(-26 * k, 0, d.land)}
            r={r * lerp(0.2, d.hot ? 1.45 : 1, d.land)}
            fill={ARTIST_COLORS[d.artist]}
            opacity={d.land * (flared > 0 && !d.hot ? 0.28 : 1)}
            stroke={d.hot ? pal.ink : "none"}
            strokeWidth={d.hot ? 3 * k : 0}
          />
        ))}
      </svg>
      {label && (
        <div
          style={{
            position: "absolute", left: 130 * k, top: cy - 92 * k,
            fontFamily: MONO, fontSize: 24 * k, letterSpacing: "0.16em",
            textTransform: "uppercase", color: pal.textMuted,
          }}
        >
          {label}
        </div>
      )}
    </>
  );
};

/** Act 2 beat 1 — the fair shuffle, and what fair actually looks like. */
export const ClumpScene: React.FC<{ pal: Palette }> = ({ pal }) => {
  const frame = useCurrentFrame();
  const k = useK();
  // 0 → dots land; then repeats flare one at a time
  const reveal = clamp01((frame - 76) / 60);
  const count = Math.floor(reveal * 9 + 0.001);
  const c = useAppear(80, 180);
  return (
    <AbsoluteFill>
      <Backdrop pal={pal} grid={false} bloom={0.5} />
      <TopEyebrow pal={pal}>One fair shuffle · Fisher–Yates</TopEyebrow>
      <Layer>
      <PlaylistStrip pal={pal} showRepeats={reveal} appearFrom={6} y={48} label="100 songs · 10 artists" />
      <div style={{ position: "absolute", left: 130 * k, bottom: 150 * k, opacity: c }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 26 * k }}>
          <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 150 * k, letterSpacing: "-0.05em", color: pal.accent, lineHeight: 0.9 }}>
            {count}
          </div>
          <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 44 * k, letterSpacing: "-0.03em", color: pal.ink }}>
            back-to-back repeats
          </div>
        </div>
      </div>
      </Layer>
    </AbsoluteFill>
  );
};

/* ── the maths ───────────────────────────────────────────────────────────── */

/** n(n−1)/N, stepped, then multiplied out. Real numbers land better than prose. */
export const FormulaScene: React.FC<{ pal: Palette }> = ({ pal }) => {
  const frame = useCurrentFrame();
  const k = useK();
  const a1 = useAppear(6, 170);
  const a2 = useAppear(44, 170);
  const a3 = useAppear(86, 150);
  const a4 = useAppear(132, 140);
  const big = spring({ frame: frame - 150, fps: 30, config: { damping: 150 }, durationInFrames: 26 });

  const Row: React.FC<{ o: number; children: React.ReactNode; muted?: boolean }> = ({ o, children, muted }) => (
    <div
      style={{
        fontFamily: MONO, fontSize: 62 * k, letterSpacing: "-0.01em",
        color: muted ? pal.textMuted : pal.ink, opacity: o,
        transform: `translateY(${lerp(22, 0, o)}px)`, whiteSpace: "pre",
      }}
    >
      {children}
    </div>
  );

  return (
    <AbsoluteFill>
      <Backdrop pal={pal} grid={false} bloom={0.5} />
      <TopEyebrow pal={pal}>Expected adjacent repeats</TopEyebrow>
      <Layer center>
      <div style={{ display: "flex", flexDirection: "column", gap: 30 * k, alignItems: "flex-start" }}>
        <Row o={a1} muted>n(n − 1) / N</Row>
        <Row o={a2}>10 × 9 / 100</Row>
        <Row o={a3}>
          = <span style={{ color: pal.accent, fontWeight: 700 }}>0.9</span>
          <span style={{ fontSize: 34 * k, color: pal.textMuted }}>  per artist</span>
        </Row>
        <Row o={a4}>
          × 10 artists ={" "}
          <span style={{ color: pal.accent, fontWeight: 700 }}>9</span>
          <span style={{ fontSize: 34 * k, color: pal.textMuted }}>  per playlist</span>
        </Row>
      </div>
      <div
        style={{
          position: "absolute", bottom: 128 * k,
          fontFamily: SANS, fontWeight: 600, fontSize: 38 * k, color: pal.ink,
          opacity: big, transform: `scale(${lerp(0.94, 1, big)})`,
        }}
      >
        The users were reporting a real property of randomness.
      </div>
      </Layer>
    </AbsoluteFill>
  );
};

/* ── which of these is random? ───────────────────────────────────────────── */

type Pt = { x: number; y: number };

const Field: React.FC<{
  pal: Palette; pts: Pt[]; x: number; y: number; w: number; h: number;
  delay: number; verdict?: string; verdictAt?: number; correct?: boolean;
}> = ({ pal, pts, x, y, w, h, delay, verdict, verdictAt = 999, correct }) => {
  const frame = useCurrentFrame();
  const k = useK();
  const a = useAppear(delay, 180);
  const v = spring({ frame: frame - verdictAt, fps: 30, config: { damping: 160 }, durationInFrames: 20 });
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx={18 * k} fill="none" stroke={pal.border} strokeWidth={2 * k} opacity={a} />
      {pts.map((p, i) => {
        const s = spring({ frame: frame - delay - i * 0.4, fps: 30, config: { damping: 200 }, durationInFrames: 18 });
        return (
          <circle
            key={i}
            cx={x + p.x * w}
            cy={y + p.y * h}
            r={7 * k * s}
            fill={verdict && v > 0.1 ? (correct ? pal.accent : pal.textMuted) : pal.ink}
            opacity={0.9}
          />
        );
      })}
      {verdict && (
        <foreignObject x={x} y={y + h + 18 * k} width={w} height={90 * k} opacity={v}>
          <div
            style={{
              fontFamily: MONO, fontSize: 26 * k, letterSpacing: "0.14em", textTransform: "uppercase",
              color: correct ? pal.accent : pal.textMuted, textAlign: "center", opacity: v,
            }}
          >
            {verdict}
          </div>
        </foreignObject>
      )}
    </>
  );
};

/**
 * The A/B. Ends by collapsing to the single uniform field, full frame — that
 * last frame is the head of the Kling morph bridge into London, so the two
 * images share their dominant shape.
 */
export const ABScene: React.FC<{ pal: Palette }> = ({ pal }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const k = useK();
  const q = useAppear(4);
  // collapse: B slides away, A grows to fill the frame, ready for the bridge
  const collapse = spring({ frame: frame - 186, fps: 30, config: { damping: 200 }, durationInFrames: 30 });

  const panelW = 760 * k, panelH = 560 * k;
  const gap = 90 * k;
  const totalW = panelW * 2 + gap;
  const leftX = lerp((width - totalW) / 2, (width - 1560 * k) / 2, collapse);
  const topY = lerp(height * 0.34, height * 0.22, collapse);
  const growW = lerp(panelW, 1560 * k, collapse);
  const growH = lerp(panelH, 700 * k, collapse);

  return (
    <AbsoluteFill>
      <Backdrop pal={pal} grid={false} bloom={0.5} />
      <Layer>
      <div style={{ position: "absolute", top: 104 * k, width: "100%", textAlign: "center", opacity: q * (1 - collapse) }}>
        <Head pal={pal} size={62}>Which one is random?</Head>
      </div>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {/* A — uniform random. The one nobody picks. */}
        <Field
          pal={pal} pts={D.fieldUniform as Pt[]}
          x={leftX} y={topY} w={growW} h={growH}
          delay={10} verdict="Uniform random" verdictAt={120} correct
        />
        {/* B — a jittered grid. Even, and therefore manufactured. */}
        <g opacity={1 - collapse} transform={`translate(${collapse * 240 * k}, 0)`}>
          <Field
            pal={pal} pts={D.fieldBlue as Pt[]}
            x={leftX + panelW + gap} y={topY} w={panelW} h={panelH}
            delay={10} verdict="Manufactured" verdictAt={120}
          />
        </g>
      </svg>
      </Layer>
    </AbsoluteFill>
  );
};

/* ── archival plate (Act 2) ──────────────────────────────────────────────── */

/** A generated archival still, treated as newsreel: mono, grain, slow push. */
export const ArchivalPlate: React.FC<{
  id: string; children?: React.ReactNode; push?: number; mono?: number;
}> = ({ id, children, push = 1.12, mono = 1 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = clamp01(frame / Math.max(1, durationInFrames));
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0908", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${lerp(1, push, t)})` }}>
        <Img
          src={staticFile(`kling/${id}.png`)}
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: `grayscale(${mono}) contrast(1.12) brightness(0.92)` }}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,9,8,0.5), transparent 38%, rgba(10,9,8,0.82))" }} />
      <AbsoluteFill style={{ boxShadow: "inset 0 0 260px 130px #0A0908", opacity: 0.85 }} />
      {/* deterministic 6-frame grain loop */}
      <AbsoluteFill style={{ opacity: 0.11, mixBlendMode: "overlay", pointerEvents: "none" }}>
        <svg width="100%" height="100%">
          <filter id={`ag${frame % 6}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={frame % 6} />
          </filter>
          <rect width="100%" height="100%" filter={`url(#ag${frame % 6})`} />
        </svg>
      </AbsoluteFill>
      {children}
    </AbsoluteFill>
  );
};

/* ── Clarke's table ──────────────────────────────────────────────────────── */

/** R. D. Clarke, 1946 — the real observed/expected counts. */
const CLARKE = [
  { hits: "0", obs: 229, exp: "226.74" },
  { hits: "1", obs: 211, exp: "211.39" },
  { hits: "2", obs: 93, exp: "98.54" },
  { hits: "3", obs: 35, exp: "30.62" },
  { hits: "4", obs: 7, exp: "7.14" },
  { hits: "5+", obs: 1, exp: "0.57" },
];

export const ClarkeScene: React.FC<{ pal: Palette }> = ({ pal }) => {
  const frame = useCurrentFrame();
  const k = useK();
  const head = useAppear(6);
  const cw = [370, 290, 300];
  const Cell: React.FC<{ w: number; children: React.ReactNode; align?: string; color?: string; bold?: boolean }> = ({
    w, children, align = "right", color, bold,
  }) => (
    <div
      style={{
        width: w * k, textAlign: align as any, fontFamily: MONO, whiteSpace: "nowrap",
        fontSize: 40 * k, color: color || pal.ink, fontWeight: bold ? 700 : 400,
      }}
    >
      {children}
    </div>
  );
  return (
    <AbsoluteFill>
      <Backdrop pal={pal} grid={false} bloom={0.5} />
      <TopEyebrow pal={pal}>R. D. Clarke · 1946 · South London</TopEyebrow>
      <Layer center>
      <div style={{ opacity: head }}>
        <div style={{ display: "flex", gap: 40 * k, paddingBottom: 20 * k, borderBottom: `2px solid ${pal.ink}` }}>
          <Cell w={cw[0]} align="left" color={pal.textMuted}>bombs / square</Cell>
          <Cell w={cw[1]} color={pal.textMuted}>observed</Cell>
          <Cell w={cw[2]} color={pal.textMuted}>Poisson says</Cell>
        </div>
        {CLARKE.map((r, i) => {
          const a = spring({ frame: frame - 26 - i * 11, fps: 30, config: { damping: 190 }, durationInFrames: 22 });
          return (
            <div
              key={r.hits}
              style={{
                display: "flex", gap: 40 * k, padding: `${14 * k}px 0`,
                borderBottom: `1px solid ${pal.border}`,
                opacity: a, transform: `translateX(${lerp(-24, 0, a)}px)`,
              }}
            >
              <Cell w={cw[0]} align="left" bold>{r.hits}</Cell>
              <Cell w={cw[1]}>{r.obs}</Cell>
              <Cell w={cw[2]} color={pal.accent}>{r.exp}</Cell>
            </div>
          );
        })}
      </div>
      </Layer>
    </AbsoluteFill>
  );
};

/**
 * The move the episode owns: 0.9 repeats per artist and 0.93 bombs per square
 * are the same number. Stamp it once, hard, and let the rhyme do the work.
 */
export const RhymeScene: React.FC<{ pal: Palette }> = ({ pal }) => {
  const frame = useCurrentFrame();
  const k = useK();
  // Both numbers land FIRST, then the equals slams between them — cutting to a
  // lone floating "=" wastes the beat and reads as dead air.
  const l = useAppear(4, 170);
  const r = useAppear(14, 170);
  const stamp = spring({ frame: frame - 26, fps: 30, config: { damping: 130, mass: 0.9 }, durationInFrames: 30 });
  const kicker = useAppear(150, 160);
  const scale = lerp(2.2, 1, stamp);
  const rot = lerp(-8, -3, stamp);

  const Side: React.FC<{ o: number; value: string; label: string; sub: string; align: "left" | "right" }> = ({
    o, value, label, sub, align,
  }) => (
    <div style={{ opacity: o, textAlign: align, transform: `translateY(${lerp(20, 0, o)}px)`, width: 520 * k }}>
      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 148 * k, letterSpacing: "-0.05em", color: pal.ink, lineHeight: 1 }}>{value}</div>
      <div style={{ marginTop: 18 * k, fontFamily: SANS, fontWeight: 600, fontSize: 32 * k, color: pal.ink }}>{label}</div>
      <div style={{ marginTop: 8 * k, fontFamily: MONO, fontSize: 22 * k, letterSpacing: "0.12em", textTransform: "uppercase", color: pal.textMuted }}>{sub}</div>
    </div>
  );

  return (
    <AbsoluteFill>
      <Backdrop pal={pal} grid={false} bloom={0.5} />
      <Layer center>
      <div style={{ display: "flex", alignItems: "center", gap: 56 * k, transform: `translateX(${shake(frame, 26, 10)}px)` }}>
        <Side o={l} value="0.9" label="repeats per artist" sub="Spotify · 100 songs" align="right" />
        <div
          style={{
            fontFamily: HEAD, fontWeight: 800, fontSize: 120 * k, letterSpacing: "-0.06em",
            color: pal.accent, transform: `scale(${scale}) rotate(${rot}deg)`, lineHeight: 0.9,
          }}
        >
          =
        </div>
        <Side o={r} value="0.93" label="bombs per square" sub="London · 1944" align="left" />
      </div>
      <div
        style={{
          position: "absolute", bottom: 140 * k, opacity: kicker,
          fontFamily: SERIF, fontStyle: "italic", fontSize: 54 * k, color: pal.ink,
        }}
      >
        A cluster is not a plan.
      </div>
      </Layer>
    </AbsoluteFill>
  );
};

/* ── Act 3: the fix ──────────────────────────────────────────────────────── */

/** Poláček's four steps, ticking, over the strip re-spacing itself. */
export const FixScene: React.FC<{ pal: Palette }> = ({ pal }) => {
  const frame = useCurrentFrame();
  const k = useK();
  const morph = spring({ frame: frame - 96, fps: 30, config: { damping: 200 }, durationInFrames: 66 });
  const STEPS = [
    "Group the songs by artist",
    "Space them every N / n",
    "Offset each artist at random",
    "Add a little jitter",
  ];
  return (
    <AbsoluteFill>
      <Backdrop pal={pal} grid={false} bloom={0.5} />
      <TopEyebrow pal={pal}>Lukáš Poláček · Spotify · 2014</TopEyebrow>
      <Layer>
      <div style={{ position: "absolute", left: 130 * k, top: 210 * k, display: "flex", flexDirection: "column", gap: 22 * k }}>
        {STEPS.map((s, i) => {
          const a = spring({ frame: frame - 10 - i * 20, fps: 30, config: { damping: 190 }, durationInFrames: 22 });
          return (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 24 * k, opacity: a, transform: `translateX(${lerp(-26, 0, a)}px)` }}>
              <div
                style={{
                  width: 46 * k, height: 46 * k, borderRadius: 10 * k, flexShrink: 0,
                  background: pal.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: MONO, fontSize: 24 * k, fontWeight: 700,
                }}
              >
                {i + 1}
              </div>
              <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 40 * k, color: pal.ink }}>{s}</div>
            </div>
          );
        })}
      </div>
      <PlaylistStrip pal={pal} morph={morph} appearFrom={0} y={76} label="the same 100 songs" />
      </Layer>
    </AbsoluteFill>
  );
};

/** The transferable idea. The comparison table is the reason to watch. */
export const NoiseTable: React.FC<{ pal: Palette }> = ({ pal }) => {
  const frame = useCurrentFrame();
  const k = useK();
  const ROWS: [string, string, string][] = [
    ["How it's made", "Each sample independent", "Even spacing + jitter"],
    ["Statistically", "Truly random", "Not uniform"],
    ["Looks random to a human", "No — it visibly clumps", "Yes"],
    ["Used for", "Almost nothing", "Dithering, sampling, shuffle"],
  ];
  const head = useAppear(4);
  const colW = [430, 460, 470];
  return (
    <AbsoluteFill>
      <Backdrop pal={pal} grid={false} bloom={0.5} />
      <TopEyebrow pal={pal}>The trade</TopEyebrow>
      <Layer center>
        <div style={{ display: "flex", gap: 30 * k, opacity: head, paddingBottom: 18 * k, borderBottom: `2px solid ${pal.ink}` }}>
          <div style={{ width: colW[0] * k }} />
          <div style={{ width: colW[1] * k, fontFamily: HEAD, fontWeight: 800, fontSize: 38 * k, letterSpacing: "-0.03em", color: pal.textMuted }}>
            Uniform random
          </div>
          <div style={{ width: colW[2] * k, fontFamily: HEAD, fontWeight: 800, fontSize: 38 * k, letterSpacing: "-0.03em", color: pal.accent }}>
            Blue noise
          </div>
        </div>
        {ROWS.map((r, i) => {
          const a = spring({ frame: frame - 20 - i * 16, fps: 30, config: { damping: 190 }, durationInFrames: 24 });
          return (
            <div
              key={r[0]}
              style={{
                display: "flex", gap: 30 * k, alignItems: "center", padding: `${20 * k}px 0`,
                borderBottom: `1px solid ${pal.border}`, opacity: a, transform: `translateY(${lerp(18, 0, a)}px)`,
              }}
            >
              <div style={{ width: colW[0] * k, fontFamily: MONO, fontSize: 24 * k, letterSpacing: "0.1em", textTransform: "uppercase", color: pal.textMuted }}>
                {r[0]}
              </div>
              <div style={{ width: colW[1] * k, fontFamily: SANS, fontSize: 32 * k, color: pal.textBody }}>{r[1]}</div>
              <div style={{ width: colW[2] * k, fontFamily: SANS, fontWeight: 600, fontSize: 32 * k, color: pal.ink }}>{r[2]}</div>
            </div>
          );
        })}
      </Layer>
    </AbsoluteFill>
  );
};

export { interpolate, rand };
