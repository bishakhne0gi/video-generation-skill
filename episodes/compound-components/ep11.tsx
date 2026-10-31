// Author: Bishakh
//
// ══ EP 11 vocabulary — "Your chatbot doesn't stutter because of a trick from 1962."
//
// THE WORLD IS A MEMORY MAP. Everything this episode shows lives at a fixed
// coordinate inside one 40GB bar, and the camera spends the whole film moving
// around inside it. Nothing here is a "screen": these are objects with
// addresses, which is the point — the argument has geography, so beat 9 is
// somewhere in relation to beat 6 and the viewer never re-orients.
//
// World layout, in world units (the bar is authored 3200 wide on the 1920 grid):
//
//   x -1600 ──────────────────────────────────────────────── +1600
//        │ weights 65% ......... │ cache 30% ..... │ act 5% │
//        │                        ▲                 ▲
//        │                        │                 └ activations
//        └ the model itself       └ WHERE THE FILM HAPPENS
//
// THE VALUE ARC is continuous too: the field is keyed on absolute seconds from
// near-white (acts 1 and 3) to near-black (act 2, the waste). Text colour
// follows it, so an act change is a change of *light* rather than a change of
// slide.
//
// Figures come from references/ep11-facts.md, sourced only. The three waste
// states are the paper's own taxonomy, not a simplification: reserved (held for
// tokens not yet written), internal (rounded up to the longest possible answer)
// and external (gaps between differently-sized allocations).

import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { GEIST, MONO, SERIF } from "../fonts";
import { clamp01, lerp, rand, useAppear, useAppearAt, useLoop, stagger } from "./anim";
import { WorldItem, Wire, SelectionBox } from "./space";
import { hasShot, KlingClip, Ambient } from "./footage";

/* ── the episode's colour, as a function of TIME ─────────────────────────── */

export const E = {
  // Palette: coolors.co/131515-2b2c28-339989-7de2d1-fffafb
  //
  // Near-black field, charcoal surfaces, PERSIAN GREEN as the working accent and
  // TIFFANY BLUE as its highlight, snow for ink on dark. Two accents rather than
  // one is the upgrade: teal carries structure, aqua carries emphasis, and the
  // gradient between them is the film's signature fill.
  paper: "#FFFAFB",
  paperDeep: "#F0ECED",
  ink: "#131515",
  inkSoft: "#2B2C28",
  muted: "#6E7269",
  accent: "#339989",
  accent2: "#7DE2D1",
  accentSoft: "#DFF5F0",
  night: "#131515",
  nightInk: "#FFFAFB",
  nightSurface: "#2B2C28",
  nightBorder: "#3A3C36",
};

/** The signature fill: structure colour into highlight colour. */
export const GRAD = `linear-gradient(100deg, ${"#339989"}, ${"#7DE2D1"})`;

/** Field keyframes: absolute seconds → background. Acts change by LIGHT. */
export type FieldKey = { at: number; bg: string; dark: boolean };

export const useField = (keys: FieldKey[]) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  let i = 0;
  for (let k = 0; k < keys.length; k++) if (t >= keys[k].at) i = k;
  const a = keys[i];
  const b = keys[Math.min(i + 1, keys.length - 1)];
  const span = Math.max(0.001, b.at - a.at);
  // smoothstep: a linear crossfade between two full-frame colours has a hard
  // corner at each end and reads as a snap. Eased, the act change lands as a
  // dip in the light instead.
  const raw = clamp01((t - a.at) / span);
  const p = raw * raw * (3 - 2 * raw);
  const mix = (x: string, y: string, q: number) => {
    const h = (c: string) => [1, 3, 5].map((o) => parseInt(c.slice(o, o + 2), 16));
    const A = h(x), B = h(y);
    return "#" + A.map((v, k) => Math.round(lerp(v, B[k], q)).toString(16).padStart(2, "0")).join("");
  };
  return { bg: mix(a.bg, b.bg, p), dark: p > 0.5 ? b.dark : a.dark };
};

/** Ink that belongs to the act it is sitting on. */
export const inkFor = (dark: boolean) => (dark ? E.nightInk : E.ink);
export const mutedFor = (dark: boolean) => (dark ? E.muted : E.inkSoft);

/* ── type ────────────────────────────────────────────────────────────────── */

export const Head: React.FC<{
  children: React.ReactNode; size?: number; dark?: boolean; weight?: number; style?: React.CSSProperties;
}> = ({ children, size = 96, dark = false, weight = 700, style }) => (
  <div
    style={{
      fontFamily: GEIST, fontWeight: weight, letterSpacing: "-0.04em",
      fontSize: size, lineHeight: 1.02, color: inkFor(dark), ...style,
    }}
  >
    {children}
  </div>
);

export const Label: React.FC<{ children: React.ReactNode; size?: number; dark?: boolean; color?: string }> = ({
  children, size = 24, dark = false, color,
}) => (
  <div
    style={{
      fontFamily: MONO, fontSize: size, letterSpacing: "0.16em", textTransform: "uppercase",
      color: color ?? mutedFor(dark), whiteSpace: "nowrap",
    }}
  >
    {children}
  </div>
);

/** One italic serif accent word per title card. Never more. */
export const Accent: React.FC<{ children: React.ReactNode; size?: number }> = ({ children, size = 96 }) => (
  <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, fontSize: size * 1.06, color: E.accent }}>
    {children}
  </span>
);

/* ── the memory bar — the one object the whole film is about ─────────────── */

export const BAR = { x: 0, y: 0, w: 3200, h: 460 };
/** Sub-ranges of the bar, in world x. Shares are the paper's Figure 1. */
export const REGION = {
  weights: { x0: -1600, x1: 480 },   // 65%
  cache: { x0: 480, x1: 1440 },      // 30%  ← where the film happens
  act: { x0: 1440, x1: 1600 },       // 5%
};
export const CACHE_MID = (REGION.cache.x0 + REGION.cache.x1) / 2;

const Seg: React.FC<{
  x0: number; x1: number; fill: string; border: string; label?: string; sub?: string;
  a: number; dark: boolean; labelColor?: string;
}> = ({ x0, x1, fill, border, label, sub, a, dark, labelColor }) => (
  <WorldItem x={(x0 + x1) / 2} y={0} w={(x1 - x0) * a} h={BAR.h}>
    <div style={{ width: "100%", height: "100%", background: fill, border: `3px solid ${border}`, borderRadius: 10 }} />
    {label && a > 0.9 && (
      <div style={{ position: "absolute", left: 22, top: -54, display: "flex", gap: 18, alignItems: "baseline" }}>
        <span style={{ fontFamily: GEIST, fontWeight: 700, fontSize: 30, letterSpacing: "0.02em", color: labelColor ?? inkFor(dark) }}>
          {label.toUpperCase()}
        </span>
        {sub && <Label size={24} dark={dark}>{sub}</Label>}
      </div>
    )}
  </WorldItem>
);

/**
 * The 40GB bar. `phase` walks it through the argument:
 *   "weights"  — only the model is loaded
 *   "cache"    — the cache region appears beside it
 *   "waste"    — the cache fills with reserved / rounded / gap cells
 *   "packed"   — THE SIGNATURE MOVE: the same cells re-pack into an even lattice
 */
export const MemoryBar: React.FC<{
  phase: "weights" | "cache" | "waste" | "packed"; dark: boolean; delay?: number; dim?: number;
}> = ({ phase, dark, delay = 0, dim = 1 }) => {
  // Every hook unconditionally, at the top: `phase` changes between beats, and
  // a hook called inside `{showCache && …}` would change the hook ORDER on the
  // frame the phase flips — React tears down the whole subtree there.
  const a = useAppear(delay, 180);
  const aCache = useAppear(delay + 8, 180);
  const aAct = useAppear(delay + 12, 180);
  const showCache = phase !== "weights";
  return (
    <>
      <Seg
        x0={REGION.weights.x0} x1={REGION.weights.x1} a={a} dark={dark}
        fill={dark ? E.nightSurface : E.paperDeep} border={dark ? E.nightBorder : "#D6D6D6"}
        label="model weights" sub="26 GB · 65%"
      />
      {showCache && (
        <Seg
          x0={REGION.cache.x0} x1={REGION.cache.x1} a={aCache} dark={dark}
          fill={dark ? "#0A0A0A" : E.paper} border={E.accent}
          label="kv cache" sub="30%" labelColor={E.accent}
        />
      )}
      {showCache && (
        <Seg
          x0={REGION.act.x0} x1={REGION.act.x1} a={aAct} dark={dark}
          fill={dark ? E.nightSurface : E.paperDeep} border={dark ? E.nightBorder : "#D6D6D6"}
        />
      )}
      {(phase === "waste" || phase === "packed") && <CacheCells packed={phase === "packed"} dark={dark} delay={delay + 14} dim={dim} />}
    </>
  );
};

/* ── the cache, cell by cell ─────────────────────────────────────────────── */

type CellKind = "real" | "reserved" | "internal" | "gap";

/**
 * Real tokens are the ONLY colour in the cache. Every kind of waste is a grey.
 *
 * The first version gave each waste type its own hue and the bar came out as
 * red/orange/blue confetti — busy, and it implied the three wastes differ in
 * kind when the only thing that matters is that none of them are your data.
 * One hot colour against greys says it in one glance.
 */
const CELL_COLOR: Record<CellKind, string> = {
  real: E.accent,
  reserved: E.inkSoft,
  internal: E.muted,
  gap: "transparent",
};

/**
 * 96 cells across the cache region.
 *
 * Ragged by construction: each request takes a run of cells, holds a reserve
 * beyond what it has written, rounds up to the longest answer it might produce,
 * and leaves a gap before the next one starts. Roughly a third end up `real`,
 * which is the paper's 20.4–38.2% — the layout is the citation.
 *
 * `packed` re-lays the SAME number of real cells contiguously from the left.
 * That is the whole episode in one transition: nothing was added, nothing got
 * faster, the blocks just stopped being wasted.
 */
export const CacheCells: React.FC<{ packed: boolean; dark: boolean; delay?: number; dim?: number }> = ({
  packed, dark, delay = 0, dim = 1,
}) => {
  const frame = useCurrentFrame();
  const COLS = 24, ROWS = 4;
  const x0 = REGION.cache.x0 + 16, x1 = REGION.cache.x1 - 16;
  const cw = (x1 - x0) / COLS, ch = (BAR.h - 40) / ROWS;

  // Deterministic ragged layout — the same every render.
  const kinds: CellKind[] = [];
  let i = 0;
  while (kinds.length < COLS * ROWS) {
    const real = 1 + Math.floor(rand(i * 3 + 1) * 3);
    const reserved = 1 + Math.floor(rand(i * 3 + 2) * 3);
    const internal = 1 + Math.floor(rand(i * 3 + 3) * 2);
    const gap = Math.floor(rand(i * 3 + 4) * 2);
    for (let k = 0; k < real; k++) kinds.push("real");
    for (let k = 0; k < reserved; k++) kinds.push("reserved");
    for (let k = 0; k < internal; k++) kinds.push("internal");
    for (let k = 0; k < gap; k++) kinds.push("gap");
    i++;
  }
  kinds.length = COLS * ROWS;

  const realCount = kinds.filter((k) => k === "real").length;
  // The re-pack: every real cell walks to its packed position. Spring per cell,
  // staggered along the bar so it reads as a sweep rather than a snap.
  const t = clamp01((frame - delay) / 46);
  const ease = Easing.bezier(0.45, 0, 0.15, 1)(t);

  let packedIndex = 0;
  return (
    <>
      {kinds.map((kind, n) => {
        const from = { c: n % COLS, r: Math.floor(n / COLS) };
        const isReal = kind === "real";
        const to = isReal
          ? { c: packedIndex % COLS, r: Math.floor(packedIndex++ / COLS) }
          : from;
        const p = packed ? clamp01((ease * 1.5) - (from.c / COLS) * 0.5) : 0;
        const c = lerp(from.c, to.c, p), r = lerp(from.r, to.r, p);
        // A travelling WAVE, not per-cell noise. At the scale `pace.mjs`
        // measures (64x36) uncorrelated flicker averages out to nothing; a
        // wave crossing the bar is large-scale motion the eye and the audit
        // both register.
        const wave = Math.sin((frame / 26) - (from.c / COLS) * Math.PI * 2);
        const opacity = kind === "gap"
          ? 0
          : packed && !isReal
            ? 1 - clamp01(p * 2)
            : 1;
        if (opacity <= 0.01) return null;
        return (
          <WorldItem
            key={n}
            x={x0 + c * cw + cw / 2}
            y={-BAR.h / 2 + 20 + r * ch + ch / 2}
            w={cw - 6}
            h={ch - 6}
          >
            <div
              style={{
                width: "100%", height: "100%", borderRadius: 4,
                background: CELL_COLOR[kind],
                opacity: dim * opacity * (isReal ? 0.72 + 0.28 * (0.5 + 0.5 * wave) : 0.8),
              }}
            />
          </WorldItem>
        );
      })}
      {/* the count, so the claim on screen is the layout's own arithmetic */}
      <WorldItem x={CACHE_MID} y={BAR.h / 2 + 96} w={1200} h={60}>
        <div style={{ display: "flex", gap: 26, justifyContent: "center", alignItems: "baseline" }}>
          <Label size={26} dark={dark} color={E.accent}>
            {packed ? "real tokens · under four percent wasted" : `real tokens · ${Math.round((realCount / kinds.length) * 100)}%`}
          </Label>
        </div>
      </WorldItem>
    </>
  );
};

/* ── the block table ─────────────────────────────────────────────────────── */

/**
 * Logical blocks on the left, physical blocks scattered on the right, wires
 * between them. This is paging, and drawing it is the entire explanation: the
 * blocks do not have to be next to each other, so nothing has to be reserved.
 */
export const BlockTable: React.FC<{ dark: boolean; delay?: number; shared?: boolean }> = ({ dark, delay = 0, shared = false }) => {
  const logical = [0, 1, 2, 3];
  const physical = [2, 0, 3, 1];
  const lx = CACHE_MID - 700, px = CACHE_MID + 700;
  const gap = 150;
  return (
    <>
      {/* column headings, set in DISPLAY type at the ink colour. They were
          22px muted mono and effectively invisible — a heading nobody can read
          is a heading that isn't there. */}
      <WorldItem x={lx} y={-320} w={520} h={54}>
        <div style={{ fontFamily: GEIST, fontWeight: 700, fontSize: 40, letterSpacing: "-0.02em", color: inkFor(dark), textAlign: "center" }}>
          {shared ? "Two answers" : "Logical blocks"}
        </div>
      </WorldItem>
      <WorldItem x={px} y={-320} w={520} h={54}>
        <div style={{ fontFamily: GEIST, fontWeight: 700, fontSize: 40, letterSpacing: "-0.02em", color: E.accent, textAlign: "center" }}>
          Physical blocks
        </div>
      </WorldItem>
      {logical.map((n, i) => {
        const a = useAppear(delay + stagger(i, 5), 170);
        return (
          <WorldItem key={`l${n}`} x={lx} y={-200 + i * gap} w={420} h={104} style={{ opacity: a }}>
            <div
              style={{
                width: "100%", height: "100%", borderRadius: 12,
                border: `3px solid ${shared && i > 1 ? E.accent : dark ? E.nightBorder : E.ink}`,
                background: dark ? E.nightSurface : E.paper,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: MONO, fontSize: 34, color: inkFor(dark),
              }}
            >
              block {n}
            </div>
          </WorldItem>
        );
      })}
      {physical.map((n, i) => {
        const a = useAppear(delay + 10 + stagger(i, 5), 170);
        return (
          <WorldItem key={`p${n}`} x={px} y={-200 + i * gap} w={420} h={104} style={{ opacity: a }}>
            <div
              style={{
                width: "100%", height: "100%", borderRadius: 12,
                border: `3px solid ${E.accent}`, background: dark ? E.nightSurface : E.accentSoft,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: MONO, fontSize: 34, color: dark ? E.nightInk : E.ink,
              }}
            >
              {n}
            </div>
          </WorldItem>
        );
      })}
      {logical.map((n, i) => (
        <Wire
          key={`w${n}`}
          pal={{ borderMid: dark ? "#2A3346" : "#C9CEDA", accent: E.accent } as any}
          from={[lx + 210, -200 + i * gap]}
          to={[px - 210, -200 + physical.indexOf(n) * gap]}
          delay={delay + 18 + i * 4}
          dur={22}
          accent={shared && i > 1}
        />
      ))}
    </>
  );
};

/* ── figures ─────────────────────────────────────────────────────────────── */

/** A number, its unit and its provenance. The register the audience trusts. */
export const Figure: React.FC<{
  value: string; unit: string; caption?: string; note?: string;
  dark?: boolean; delay?: number; accent?: boolean;
}> = ({ value, unit, caption, note, dark = false, delay = 0, accent = true }) => {
  const a = useAppear(delay, 175);
  return (
    // NO PLATE. A card laid over the world hides the one thing that makes a
    // travelled episode worth watching. Legibility comes from the world DIMMING
    // under the annotation instead (see `worldDim` in Episode.tsx) — the motion
    // stays visible, the type still reads.
    <div style={{ opacity: a, transform: `translateY(${lerp(22, 0, a)}px)` }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 22 }}>
        <div style={{ fontFamily: GEIST, fontWeight: 900, fontSize: 190, letterSpacing: "-0.05em", lineHeight: 0.9, color: accent ? E.accent : inkFor(dark) }}>
          {value}
        </div>
        <div style={{ fontFamily: MONO, fontSize: 34, letterSpacing: "0.08em", color: inkFor(dark), maxWidth: 520, lineHeight: 1.25 }}>
          {unit}
        </div>
      </div>
      {caption && <div style={{ marginTop: 22 }}><Label size={24} dark={dark}>{caption}</Label></div>}
      {note && (
        <div style={{ marginTop: 14, maxWidth: 900, fontFamily: MONO, fontSize: 21, lineHeight: 1.45, color: dark ? "#9FB0C6" : mutedFor(false) }}>
          {note}
        </div>
      )}
    </div>
  );
};

/** The three wastes, arriving one at a time — the spine of act two. */
export const WasteList: React.FC<{ dark: boolean; delay?: number }> = ({ dark, delay = 0 }) => {
  const items: [string, string, string][] = [
    // the swatch IS the cell colour. A legend that disagrees with the diagram
    // it labels is worse than no legend.
    ["reserved", E.inkSoft, "held for tokens not yet written"],
    ["internal", E.muted, "rounded up to the longest possible answer"],
    ["external", "transparent", "gaps between differently sized requests"],
  ];
  return (
    // Constrained and plated. The first pass ran the descriptions straight
    // across the bar — legible in a still, unreadable in motion, because the
    // cells underneath are the busiest thing in the film.
    <div
      // hard width cap: the descriptions are the longest strings in the film and
      // will happily run under the grid if left to wrap on their own
      style={{ display: "flex", flexDirection: "column", gap: 30, width: 470 }}
    >
      {items.map(([name, colour, why], i) => {
        const a = useAppear(delay + stagger(i, 7), 170);
        return (
          <div key={name} style={{ opacity: a, transform: `translateX(${lerp(-20, 0, a)}px)` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div
                style={{
                  width: 34, height: 34, borderRadius: 7,
                  background: colour,
                  // every swatch carries an outline so it survives on black;
                  // "external" IS absence, so that one is outline only
                  border: colour === "transparent"
                    ? `3px dashed ${dark ? "#8A8A8A" : E.muted}`
                    : `2px solid ${dark ? "#8A8A8A" : E.inkSoft}`,
                }}
              />
              <div style={{ fontFamily: GEIST, fontWeight: 700, fontSize: 46, letterSpacing: "-0.03em", color: inkFor(dark) }}>{name}</div>
            </div>
            <div style={{ marginLeft: 40, marginTop: 4, fontFamily: MONO, fontSize: 23, lineHeight: 1.4, color: dark ? "#B4B4B4" : E.inkSoft }}>{why}</div>
          </div>
        );
      })}
    </div>
  );
};

/* ── cards over the world ────────────────────────────────────────────────── */

/** Statement layer: one idea, full frame, over whatever the camera is looking at. */
export const Statement: React.FC<{ text: string; accent?: string; dark?: boolean; delay?: number }> = ({
  text, accent, dark = false, delay = 2,
}) => {
  const a = useAppear(delay, 165);
  // THE WHOLE LINE ARRIVES AT ONCE.
  //
  // The previous version faded the accent word in late, which left a literal
  // HOLE in the sentence for two and a half seconds: "A GPU runs out of ____,
  // not maths." On screen that reads as a bug, not as staging. Emphasis is
  // animated instead: the rule under the accent draws after the line has
  // landed, so the beat still keeps delivering without breaking the reading.
  const rule = useAppearAt(46, 200);
  const parts = accent && text.includes(accent) ? text.split(accent) : null;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 170 }}>
      <div style={{ opacity: a, transform: `translateY(${lerp(18, 0, a)}px)`, textAlign: "center", maxWidth: 1560 }}>
        <Head size={104} dark={dark}>
          {parts ? (
            <>
              {parts[0]}
              <span style={{ position: "relative", display: "inline-block" }}>
                <Accent size={104}>{accent}</Accent>
                <span
                  style={{
                    position: "absolute", left: 0, bottom: -14, height: 5,
                    width: `${rule * 100}%`, background: E.accent, borderRadius: 3,
                  }}
                />
              </span>
              {parts[1]}
            </>
          ) : text}
        </Head>
      </div>
    </AbsoluteFill>
  );
};

export const Slate: React.FC<{ n: number; title: string; dark?: boolean }> = ({ n, title, dark = false }) => {
  const a = useAppear(1, 170);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", opacity: a }}>
        <div
          style={{
            width: 132, height: 132, borderRadius: 30, margin: "0 auto 34px",
            background: E.accent, display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: GEIST, fontWeight: 900, fontSize: 66, color: "#fff",
            transform: `scale(${lerp(0.86, 1, a)})`,
          }}
        >
          {String(n).padStart(2, "0")}
        </div>
        <div style={{ opacity: useAppearAt(26, 175) }}><Head size={88} dark={dark}>{title}</Head></div>
      </div>
    </AbsoluteFill>
  );
};

export const TitleCard: React.FC<{ kicker: string; title: string; accent: string; sub: string }> = ({
  kicker, title, accent, sub,
}) => {
  const a = useAppear(0, 170);
  const parts = title.includes(accent) ? title.split(accent) : null;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 160 }}>
      <div style={{ textAlign: "center", opacity: a, maxWidth: 1560 }}>
        <div style={{ marginBottom: 30, transform: `translateY(${lerp(14, 0, a)}px)` }}>
          <Label size={26} color={E.accent}>{kicker}</Label>
        </div>
        <Head size={112} weight={700}>
          {parts ? (<>{parts[0]}<Accent size={112}>{accent}</Accent>{parts[1]}</>) : title}
        </Head>
        <div style={{ marginTop: 34, fontFamily: MONO, fontSize: 27, lineHeight: 1.5, color: mutedFor(false), opacity: useAppearAt(54, 180) }}>{sub}</div>
      </div>
    </AbsoluteFill>
  );
};

export const EndCard: React.FC<{ line: string; accent: string; cta: string; next: string }> = ({ line, accent, cta, next }) => {
  const a = useAppear(1, 170);
  const parts = line.includes(accent) ? line.split(accent) : null;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 160 }}>
      <div style={{ textAlign: "center", opacity: a, maxWidth: 1500 }}>
        <Head size={104}>{parts ? (<>{parts[0]}<Accent size={104}>{accent}</Accent>{parts[1]}</>) : line}</Head>
        <div style={{ marginTop: 46, display: "flex", gap: 40, justifyContent: "center", flexWrap: "wrap", opacity: useAppearAt(78, 180) }}>
          <div style={{ fontFamily: MONO, fontSize: 25, letterSpacing: "0.1em", color: E.accent }}>{cta}</div>
          <div style={{ fontFamily: MONO, fontSize: 25, letterSpacing: "0.1em", color: "#5B6880" }}>{next}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Persistent playlist mark. */
export const Mark: React.FC<{ series: string; episode: string; dark?: boolean }> = ({ series, episode, dark = false }) => (
  <div style={{ position: "absolute", right: 74, bottom: 60, display: "flex", alignItems: "center", gap: 14, opacity: 0.7 }}>
    <div style={{ width: 9, height: 9, borderRadius: "50%", background: E.accent }} />
    <Label size={22} dark={dark}>{series} · {episode}</Label>
  </div>
);

/* ── footage, guarded ────────────────────────────────────────────────────── */
//
// Kling may not have run yet. A missing shot must never break the render, and a
// placeholder must never look like a mistake — so the fallback is a designed
// plate in the episode's own palette rather than a black hole.

export const Shot: React.FC<{ id: string; dark?: boolean; children?: React.ReactNode }> = ({ id, dark = false, children }) => {
  if (hasShot(id)) {
    return (
      <KlingClip id={id} pal={{ bgDeep: dark ? E.night : E.paperDeep, grade: dark ? "#0A1020" : "#E7EAF6", accent: E.accent, isDark: dark } as any} grade={0.45} push={1.05}>
        {children}
      </KlingClip>
    );
  }
  return (
    <AbsoluteFill style={{ background: dark ? E.night : E.paperDeep }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 70% at 30% 30%, ${E.accentSoft}, transparent 70%)`,
          opacity: dark ? 0.18 : 0.6,
        }}
      />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <Label size={22} dark={dark}>shot pending · {id}</Label>
      </AbsoluteFill>
      {children}
    </AbsoluteFill>
  );
};

/** The act's surface, if it has been generated. Silent no-op if not. */
export const Surface: React.FC<{ id: string; dark: boolean; opacity?: number }> = ({ id, dark, opacity }) =>
  hasShot(id) ? (
    <Ambient
      id={id}
      pal={{ isDark: dark, grade: dark ? "#0A1020" : "#E7EAF6" } as any}
      opacity={opacity ?? (dark ? 0.16 : 0.08)}
      blur={4}
    />
  ) : null;

/** One line burned over a shot — the cold open. */
export const OverLine: React.FC<{ text: string; delay?: number }> = ({ text, delay = 8 }) => {
  const a = useAppear(delay, 160);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", padding: 150 }}>
      <div style={{ opacity: a, transform: `translateY(${lerp(18, 0, a)}px)`, textAlign: "center" }}>
        <div style={{ fontFamily: GEIST, fontWeight: 700, fontSize: 78, letterSpacing: "-0.04em", color: "#fff", textShadow: "0 18px 60px rgba(0,0,0,.6)" }}>
          {text}
        </div>
      </div>
    </AbsoluteFill>
  );
};

void SelectionBox;
void interpolate;

/**
 * The single cache cell beat 4 pushes into — what one token actually occupies.
 *
 * It sits at the first cell position of the waste layout, so when the cells
 * arrive later this one is already where the viewer last saw it. Geography has
 * to stay true or the world stops being a place.
 */
export const TokenCell: React.FC<{ dark: boolean }> = ({ dark }) => {
  const a = useAppear(0, 170);
  const x0 = REGION.cache.x0 + 16;
  const cw = (REGION.cache.x1 - 32 - x0) / 24;
  const ch = (BAR.h - 40) / 4;
  return (
    <>
      <WorldItem x={x0 + cw / 2} y={-BAR.h / 2 + 20 + ch / 2} w={cw - 6} h={ch - 6}>
        <div style={{ width: "100%", height: "100%", borderRadius: 4, background: E.accent, opacity: a }} />
        <SelectionBox pal={{ accent: E.accent, bg: dark ? E.night : E.paper } as any} inset={-8} />
      </WorldItem>
      <WorldItem x={x0 + cw / 2 + 330} y={-BAR.h / 2 + 20 + ch / 2} w={520} h={40}>
        <div style={{ opacity: a, fontFamily: MONO, fontSize: 17, letterSpacing: "0.1em", color: mutedFor(dark), whiteSpace: "nowrap" }}>
          one token
        </div>
      </WorldItem>
    </>
  );
};

/**
 * Tokens arriving. A continuous procession of cells travelling out of the model
 * weights and into the cache, for as long as the world is on screen.
 *
 * This exists because of a measurement, not a hunch. The first cut of EP11 was
 * 61% STATIC: the camera holds — "arrive, then hold", which is the right
 * instinct — leave a completely motionless frame whenever the beat's content
 * has finished arriving. A travelled canvas does not save you from that; it
 * just moves the stall into the holds.
 *
 * So the world gets a system that never finishes. It is also the literal
 * subject: this is what fills the cache, and it keeps filling it while the
 * narration explains what that costs.
 */
export const TokenStream: React.FC<{ dark: boolean; rate?: number; count?: number }> = ({
  dark, rate = 150, count = 20,
}) => {
  const frame = useCurrentFrame();
  const x0 = REGION.weights.x1 - 700;
  const x1 = REGION.cache.x0 + 60;
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const t = ((frame / rate + i / count) % 1 + 1) % 1;
        // ease-in so they accelerate into the cache rather than crawling evenly
        const e = t * t * (3 - 2 * t);
        const y = (rand(i * 5 + 2) - 0.5) * (BAR.h - 120);
        const fade = Math.sin(Math.PI * t);
        return (
          <WorldItem key={i} x={lerp(x0, x1, e)} y={y} w={64} h={64}>
            <div
              style={{
                width: "100%", height: "100%", borderRadius: 6,
                background: E.accent,
                opacity: fade * (dark ? 0.85 : 0.6),
                boxShadow: `0 0 ${44}px ${12}px ${E.accent}55`,
              }}
            />
          </WorldItem>
        );
      })}
    </>
  );
};

/**
 * The cache filling. A translucent level inside the cache region that rises as
 * tokens arrive and resets when it is full — occupancy, made large.
 *
 * Scale is the point. `pace.mjs` measures the film at 64x36, which is roughly
 * what peripheral vision gets, and at that size a travelling dot is one pixel
 * while a REGION changing brightness is unmissable. The wide beats (the problem,
 * the memory map) were dead precisely because everything moving in them was
 * small.
 */
export const CacheFill: React.FC<{ dark: boolean; period?: number }> = ({ dark, period = 210 }) => {
  const frame = useCurrentFrame();
  const t = ((frame / period) % 1 + 1) % 1;
  const h = (BAR.h - 24) * t;
  return (
    <WorldItem
      x={(REGION.cache.x0 + REGION.cache.x1) / 2}
      y={BAR.h / 2 - 12 - h / 2}
      w={REGION.cache.x1 - REGION.cache.x0 - 24}
      h={h}
    >
      <div
        style={{
          width: "100%", height: "100%", borderRadius: 6,
          background: `linear-gradient(180deg, ${E.accent}${dark ? "55" : "33"}, ${E.accent}${dark ? "22" : "14"})`,
          borderTop: `3px solid ${E.accent}`,
        }}
      />
    </WorldItem>
  );
};

/** A light sweeping across the packed cells — the beat's late arrival. */
export const PackSweep: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const t = clamp01((frame - delay) / 70);
  if (t <= 0 || t >= 1) return null;
  const x = lerp(REGION.cache.x0, REGION.cache.x1, t);
  return (
    <WorldItem x={x} y={0} w={220} h={BAR.h}>
      <div
        style={{
          width: "100%", height: "100%",
          background: `linear-gradient(90deg, transparent, ${E.accent}44, transparent)`,
          filter: "blur(6px)",
        }}
      />
    </WorldItem>
  );
};

/**
 * THE PAYOFF, over footage. A replacement for dropping a `Figure` plate onto a
 * shot — which is what the first cut did, and it read as a terminal dump pasted
 * over a photograph.
 *
 * Three decisions, all of them the opposite of the plate:
 *
 *  1. NO BOX. A hard-edged card sitting in the middle of a corridor shot kills
 *     the depth that made the shot worth generating. Legibility comes from a
 *     gradient scrim rising out of the bottom-left corner instead — the shot
 *     keeps its vanishing point, the type still holds contrast.
 *  2. TYPE HAS A HIERARCHY. Mono is for provenance only: the eyebrow, the
 *     sources, the caveat. The number and its qualifier are display Geist, so
 *     the eye lands on the claim first and reads the citation second. The first
 *     version set four different things in mono at four sizes, which is why it
 *     had no shape.
 *  3. AN ACCENT RULE, NOT A BORDER. One short bar carries the episode's colour
 *     and separates claim from citation. It does the job the box was doing
 *     without enclosing anything.
 */
export const PayoffCard: React.FC<{
  eyebrow: string; value: string; unit: string; sub: string; source: string; note: string;
}> = ({ eyebrow, value, unit, sub, source, note }) => {
  const a = useAppearAt(6, 175);
  const b = useAppearAt(22, 175);
  const c = useAppearAt(44, 180);
  const d = useAppearAt(70, 190);
  return (
    <AbsoluteFill>
      {/* scrim: reaches just far enough to hold the type, then gets out of the way */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(100deg, rgba(4,7,14,.88) 0%, rgba(4,7,14,.70) 32%, rgba(4,7,14,.26) 54%, transparent 70%)",
        }}
      />
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "flex-start", padding: "0 0 212px 132px" }}>
        <div style={{ maxWidth: 1080 }}>
          <div style={{ opacity: a, transform: `translateY(${lerp(14, 0, a)}px)` }}>
            <div style={{ fontFamily: MONO, fontSize: 25, letterSpacing: "0.28em", textTransform: "uppercase", color: E.accent }}>
              {eyebrow}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 20, opacity: b, transform: `translateY(${lerp(20, 0, b)}px)` }}>
            <div style={{ fontFamily: GEIST, fontWeight: 900, fontSize: 196, letterSpacing: "-0.055em", lineHeight: 0.82, color: "#fff" }}>
              {value}
            </div>
            {/* the multiplier is part of the NUMBER, not a footnote to it —
                at 66px beside a 224px numeral it read as a stray mark */}
            <div style={{ fontFamily: GEIST, fontWeight: 900, fontSize: 118, letterSpacing: "-0.05em", color: E.accent, lineHeight: 0.82 }}>
              {unit}
            </div>
          </div>

          <div style={{ marginTop: 18, opacity: c, transform: `translateY(${lerp(14, 0, c)}px)` }}>
            <div style={{ fontFamily: GEIST, fontWeight: 500, fontSize: 46, letterSpacing: "-0.02em", color: "rgba(255,255,255,.9)" }}>
              {sub}
            </div>
          </div>

          <div style={{ height: 4, width: lerp(0, 168, d), background: E.accent, margin: "34px 0 24px", borderRadius: 2 }} />

          <div style={{ opacity: d }}>
            <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: "0.1em", color: "rgba(255,255,255,.72)" }}>{source}</div>
            <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: "0.1em", color: "rgba(255,255,255,.6)", marginTop: 10, maxWidth: 980 }}>
              {note}
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * Every annotation layer dissolves in and out inside its own beat.
 *
 * THE PROBLEM THIS SOLVES: this episode cuts on `enter: "cut"`, which is right
 * for a travelled canvas (the camera is already mid-move, so there is nothing
 * to transition between) but means the beats share ZERO frames. At each
 * boundary the outgoing type vanished in a single frame while the incoming
 * sprang in. The world glided; the type popped.
 *
 * The obvious fix, switching the beats to `fade`, buys overlap by shortening
 * the film, and those frames come out of the 0.35s breath at the end of each
 * narration line. Fading the layers WITHIN their own beats costs no timing at
 * all: the outgoing is still on screen while the incoming rises, so the join
 * reads as a dissolve and every VO tail keeps its room.
 *
 * `useVideoConfig().durationInFrames` inside a Sequence is the SEQUENCE length,
 * which is what makes this self-measuring: a beat never needs to be told how
 * long it is.
 */
export const Soft: React.FC<{ children: React.ReactNode; inF?: number; outF?: number }> = ({
  children, inF = 11, outF = 16,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const rise = clamp01(frame / inF);
  const fall = clamp01((durationInFrames - frame) / outF);
  // smoothstep both ends: a linear fade has a visible corner where it starts
  // and stops, which on a full-frame layer reads as a flicker
  const ease = (x: number) => x * x * (3 - 2 * x);
  // A pure opacity change reads as a lamp being switched off. Letting the
  // outgoing layer sink a few pixels as it goes gives the join a direction, so
  // it reads as one thing making way for the next.
  const sink = (1 - ease(fall)) * 26;
  return (
    <AbsoluteFill style={{ opacity: ease(rise) * ease(fall), transform: `translateY(${sink.toFixed(2)}px)` }}>
      {children}
    </AbsoluteFill>
  );
};
