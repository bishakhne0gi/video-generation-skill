// Author: Bishakh
//
// ══ EP 12 vocabulary — "The component that knew too much." ══════════════════
//
// THE WORLD IS ONE SOURCE FILE. A column of code six hundred lines tall that
// the camera falls down, and which in act three breaks into short siblings laid
// side by side. Vertical travel for the monolith, horizontal spread for the
// composition: the geography IS the argument.
//
// THE CODE IS THE HERO. EP11 could teach with a diagram because memory is
// invisible; this episode is about an API, so the call site has to be on screen
// and legible. Everything readable is Remotion. Kling supplies the material
// under it and nothing else.
//
// Series pieces (type, statements, slates, dissolves, surfaces) are imported
// from ep11.tsx rather than copied. They are episode-agnostic and belong in a
// shared `series.tsx` the moment EP13 needs them; keeping one copy is better
// than two that drift.
//
// Facts: references/ep12-facts.md. First-party, from the CosX codebase.

import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { GEIST, MONO } from "../fonts";
import { clamp01, lerp, rand, useAppear, useAppearAt, stagger } from "./anim";
import { WorldItem } from "./space";
import { E, inkFor, mutedFor, Head, Label } from "./ep11";

export { E, Soft, Statement, Slate, Mark, Surface, Shot, inkFor, mutedFor, Head, Label } from "./ep11";

/* ── code ────────────────────────────────────────────────────────────────── */

export type Tone = "dim" | "ink" | "flag" | "tag" | "muted";

const TONE: Record<Tone, (dark: boolean) => string> = {
  dim: (d) => (d ? "#3A3A3A" : "#D2D2D2"),
  muted: (d) => (d ? "#7C7A7A" : "#9A9A9A"),
  ink: (d) => (d ? "#FFFFFF" : "#000000"),
  flag: () => E.accent,
  tag: (d) => (d ? "#C9C9C9" : "#494949"),
};

export type Line = { t: string; tone?: Tone; indent?: number };

/**
 * A block of source. Mono, generously leaded, and deliberately NOT syntax
 * highlighted like an editor: four tones only, so the eye goes to the flags
 * instead of to a rainbow. The pink is reserved for the thing being argued
 * about, which in act one is every boolean.
 */
export const Code: React.FC<{
  lines: Line[]; size?: number; dark?: boolean; delay?: number; stagger?: number;
}> = ({ lines, size = 34, dark = false, delay = 0, stagger: per = 2 }) => (
  <div style={{ fontFamily: MONO, fontSize: size, lineHeight: 1.62, whiteSpace: "pre" }}>
    {lines.map((l, i) => (
      <CodeLine key={i} line={l} dark={dark} delay={delay + i * per} />
    ))}
  </div>
);

const CodeLine: React.FC<{ line: Line; dark: boolean; delay: number }> = ({ line, dark, delay }) => {
  const a = useAppear(delay, 190);
  return (
    <div
      style={{
        color: TONE[line.tone ?? "ink"](dark),
        paddingLeft: (line.indent ?? 0) * 28,
        opacity: a,
        transform: `translateX(${lerp(-10, 0, a)}px)`,
      }}
    >
      {line.t}
    </div>
  );
};

/* ── the world: one very long file ───────────────────────────────────────── */

export const COLUMN = { x: 0, w: 1420, top: -300, lh: 54 };

/**
 * The monolith, as geography. Seventy-four rendered lines standing in for six
 * hundred: enough that the bottom is never in frame at reading zoom, which is
 * the entire point. The camera falls and the file does not end.
 *
 * Boolean props are the only pink in the column, so scrolling past them reads
 * as scrolling past the problem.
 */
export const CodeColumn: React.FC<{ dark: boolean; delay?: number; dim?: number }> = ({
  dark, delay = 0, dim = 1,
}) => {
  const a = useAppear(delay, 190);
  const LH = COLUMN.lh;
  return (
    <WorldItem
      x={COLUMN.x}
      y={COLUMN.top + (MONOLITH_SRC.length * LH) / 2}
      w={COLUMN.w}
      h={MONOLITH_SRC.length * LH}
    >
      <div style={{ opacity: a * dim, fontFamily: MONO, fontSize: 30, whiteSpace: "pre" }}>
        {MONOLITH_SRC.map((line, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", height: LH }}>
            <span style={{ color: dimOf(dark), width: 74, textAlign: "right", paddingRight: 24, fontSize: 20 }}>
              {i + 1}
            </span>
            <span>
              {tokenise(line).map((t, k) => (
                <span key={k} style={{ color: tokColour(t.c, dark) }}>{t.t}</span>
              ))}
            </span>
          </div>
        ))}
      </div>
    </WorldItem>
  );
};

/* ── the explosion ───────────────────────────────────────────────────────── */

/**
 * Four booleans, every combination. Sixteen cells, and the film's whole first
 * argument: the flags do not add cases, they multiply them.
 *
 * Only the four cells with exactly one flag set are plausible; the rest are
 * combinations nobody designed and every one of them compiles. They are drawn
 * struck through rather than hidden, because "unreachable" is the lie the
 * pattern exists to correct.
 */
export const StateGrid: React.FC<{ dark?: boolean; delay?: number }> = ({ dark = false, delay = 0 }) => {
  const FLAGS = ["thread", "dm", "editing", "forward"];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 286px)", gap: 22 }}>
      {Array.from({ length: 16 }).map((_, n) => {
        const bits = FLAGS.map((_, b) => Boolean(n & (1 << b)));
        const count = bits.filter(Boolean).length;
        const sane = count === 1;
        const a = useAppear(delay + stagger(n, 3), 195);
        return (
          <div
            key={n}
            style={{
              height: 146, borderRadius: 14, opacity: a,
              transform: `scale(${lerp(0.9, 1, a)})`,
              border: `2px solid ${sane ? E.accent : dark ? "#2A2A2A" : "#E0E0E0"}`,
              background: sane ? (dark ? "#1A0E11" : E.accentSoft) : "transparent",
              display: "flex", flexDirection: "column", justifyContent: "center", gap: 6,
              padding: "0 18px",
            }}
          >
            {bits.map((on, b) => (
              <div
                key={b}
                style={{
                  fontFamily: MONO, fontSize: 23, letterSpacing: "0.04em",
                  color: on ? (sane ? E.accent : mutedFor(dark)) : TONE.dim(dark),
                  textDecoration: !sane && on ? "line-through" : "none",
                }}
              >
                {on ? FLAGS[b] : "·"}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

/* ── the pattern ─────────────────────────────────────────────────────────── */

/**
 * The composed tree: a root that owns state, children that read it. Context is
 * drawn as a spine down the left with a tick into each child, because the whole
 * idea is that nothing is passed hand to hand.
 */
export const Tree: React.FC<{
  root: string; children_: string[]; dark?: boolean; delay?: number; added?: number;
}> = ({ root, children_, dark = false, delay = 0, added = -1 }) => {
  const a = useAppear(delay, 190);
  const spine = useAppearAt(52, 200);
  return (
    <div style={{ position: "relative", paddingLeft: 8 }}>
      <div
        style={{
          fontFamily: MONO, fontSize: 40, color: inkFor(dark), opacity: a,
          transform: `translateY(${lerp(-10, 0, a)}px)`,
        }}
      >
        {root}
      </div>
      <div style={{ position: "relative", marginTop: 18, paddingLeft: 46 }}>
        <div
          style={{
            position: "absolute", left: 14, top: 0, width: 3, borderRadius: 2,
            height: `${spine * 100}%`, background: E.accent,
          }}
        />
        {children_.map((c, i) => {
          const ca = useAppear(delay + 10 + stagger(i, 6), 190);
          const isNew = i === added;
          return (
            <div key={c} style={{ display: "flex", alignItems: "center", gap: 16, height: 74, opacity: ca }}>
              <div style={{ width: 30, height: 3, background: E.accent, borderRadius: 2, transform: `scaleX(${ca})`, transformOrigin: "left" }} />
              <div
                style={{
                  fontFamily: MONO, fontSize: 34,
                  color: isNew ? E.accent : inkFor(dark),
                  transform: `translateX(${lerp(-14, 0, ca)}px)`,
                }}
              >
                {c}
              </div>
              {isNew && (
                <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: "0.14em", color: E.accent, textTransform: "uppercase" }}>
                  new variant
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** The thrown error, as the developer would actually meet it. */
export const ThrowCard: React.FC<{ dark?: boolean; delay?: number }> = ({ dark = false, delay = 0 }) => {
  const a = useAppear(delay, 185);
  return (
    <div
      style={{
        opacity: a, transform: `translateY(${lerp(16, 0, a)}px)`,
        borderLeft: `5px solid ${E.accent}`, paddingLeft: 30,
      }}
    >
      <Label size={22} color={E.accent}>throws immediately</Label>
      <div style={{ marginTop: 16, fontFamily: MONO, fontSize: 32, lineHeight: 1.5, color: inkFor(dark) }}>
        useSelect must be used
        <br />
        inside {"<Select>"}
      </div>
    </div>
  );
};

/* ── material, and the mark ──────────────────────────────────────────────── */

/** A Kling still used as a design element: Remotion supplies all the motion. */
export const Plate: React.FC<{
  id: string; x?: number; y?: number; w?: number; delay?: number; scale?: number; opacity?: number;
  exitAt?: number; exitFor?: number;
}> = ({ id, x = 50, y = 50, w = 1100, delay = 0, scale = 1.06, opacity = 1, exitAt, exitFor = 26 }) => {
  const a = useAppear(delay, 180);
  const frame = useCurrentFrame();
  // exit is a scale-and-fade, so a plate leaving looks like it TURNED INTO the
  // one arriving in the same place rather than being swapped for it
  const out = exitAt == null ? 0 : clamp01((frame - exitAt) / exitFor);
  const ease = (v: number) => v * v * (3 - 2 * v);
  const e = ease(out);
  return (
    <div
      style={{
        position: "absolute", left: `${x}%`, top: `${y}%`, width: w,
        transform: `translate(-50%,-50%) scale(${lerp(scale * 0.97, scale, clamp01(frame / 260)) * lerp(0.98, 1, a) * lerp(1, 1.08, e)})`,
        opacity: a * opacity * (1 - e),
      }}
    >
      <Img src={staticFile(`kling/${id}.png`)} style={{ width: "100%", display: "block" }} />
    </div>
  );
};

/**
 * The CosX mark, assembled rather than faded in.
 *
 * The logo is already the episode's argument: the X is built from separate
 * slabs that only read as a letter once they are composed. So the wordmark
 * wipes in from the left and an accent rule closes under it, which is the same
 * gesture the film has used for every other arrival.
 */
export const CosXMark: React.FC<{ dark?: boolean; delay?: number; width?: number }> = ({
  dark = false, delay = 0, width = 380,
}) => {
  const a = useAppearAt(delay, 190);
  const rule = useAppearAt(delay + 22, 200);
  return (
    <div style={{ width, position: "relative" }}>
      <div style={{ clipPath: `inset(0 ${(1 - a) * 100}% 0 0)` }}>
        <Img
          src={staticFile(dark ? "brand/cosx-white.png" : "brand/cosx-black.png")}
          style={{ width: "100%", display: "block" }}
        />
      </div>
      <div
        style={{
          marginTop: 18, height: 4, borderRadius: 2, background: E.accent,
          width: `${rule * 100}%`,
        }}
      />
    </div>
  );
};

/** EP12 end card: the closing line, the mark, the next episode. */
export const EndCard12: React.FC<{ line: string; accent: string; next: string; dark?: boolean }> = ({
  line, accent, next, dark = false,
}) => {
  const a = useAppear(1, 175);
  const parts = line.includes(accent) ? line.split(accent) : null;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 150 }}>
      <div style={{ textAlign: "center", opacity: a, maxWidth: 1500 }}>
        <Head size={96} dark={dark}>
          {parts ? (
            <>
              {parts[0]}
              <span style={{ color: E.accent }}>{accent}</span>
              {parts[1]}
            </>
          ) : line}
        </Head>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 62 }}>
          <CosXMark dark={dark} delay={40} width={300} />
        </div>
        <div style={{ marginTop: 46, fontFamily: MONO, fontSize: 24, letterSpacing: "0.1em", color: mutedFor(dark) }}>
          {next}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ══ THE CODE BLOCK ═══════════════════════════════════════════════════════ */
//
// A flat list of mono lines is not a code block, it is a paragraph in a
// monospace font, and it reads as dull because nothing about it says "this is
// the thing you edit every day". This is a real panel: window chrome, a
// filename, line numbers, a syntax system where COLOUR CARRIES MEANING, and
// four kinds of motion.
//
// The colour scheme is deliberate rather than decorative. One hue per concept,
// used identically everywhere in the film:
//
//   violet   component and tag names      the things you compose
//   pink     boolean props                the thing the episode argues about
//   amber    values and identifiers       data the caller supplies
//   green    keywords, and lines added    the path forward
//   red      lines removed                what the pattern deletes
//
// Five colours, each meaning exactly one thing, is legible. A rainbow per token
// type is an editor theme, and an editor theme on a 1080 frame is noise.

export const SYNTAX = {
  tag: "#7A5CFF",
  flag: E.accent,
  value: "#D98A1F",
  keyword: "#12A06A",
  add: "#16A34A",
  del: "#E5484D",
};

export type TokColour = keyof typeof SYNTAX | "text" | "punct";
export type Tok = { t: string; c?: TokColour };
export type CodeRow = { toks: Tok[]; indent?: number; mark?: "add" | "del" };

const dimOf = (dark: boolean) => (dark ? "#6D6D6D" : "#A8A8A8");
const inkOf = (dark: boolean) => (dark ? "#EDEDED" : "#141414");

const tokColour = (c: TokColour | undefined, dark: boolean): string => {
  if (!c || c === "text") return inkOf(dark);
  if (c === "punct") return dimOf(dark);
  return SYNTAX[c];
};

/**
 * The panel. Motion, in the order it reads:
 *  1. the window scales up on a spring
 *  2. rows arrive staggered, each sliding a little from the left
 *  3. an optional highlight bar travels to the line being talked about
 *  4. added and removed rows carry a gutter mark and a tinted wash
 */
export const CodeBlock: React.FC<{
  file: string; rows: CodeRow[]; dark?: boolean; delay?: number;
  highlight?: number; highlightAt?: number; width?: number; size?: number;
}> = ({ file, rows, dark = false, delay = 0, highlight, highlightAt = 70, width = 980, size = 30 }) => {
  const open = useAppear(delay, 185);
  const hl = useAppearAt(highlightAt, 200);
  const LH = size * 1.86;
  const surface = dark ? "#101010" : "#FBFBFB";
  const chrome = dark ? "#181818" : "#F1F1F1";
  const edge = dark ? "#282828" : "#E4E4E4";
  return (
    <div
      style={{
        width, borderRadius: 18, overflow: "hidden", border: `1px solid ${edge}`,
        background: surface, opacity: open,
        transform: `translateY(${lerp(22, 0, open)}px) scale(${lerp(0.985, 1, open)})`,
        boxShadow: dark ? "0 40px 90px -50px #000" : "0 40px 90px -50px rgba(0,0,0,.45)",
      }}
    >
      <div style={{ height: 54, background: chrome, borderBottom: `1px solid ${edge}`, display: "flex", alignItems: "center", gap: 12, padding: "0 22px" }}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
          <div key={c} style={{ width: 13, height: 13, borderRadius: "50%", background: c, opacity: 0.9 }} />
        ))}
        <div style={{ marginLeft: 14, fontFamily: MONO, fontSize: 21, color: dimOf(dark), letterSpacing: "0.04em" }}>{file}</div>
      </div>

      <div style={{ position: "relative", padding: "24px 0 26px" }}>
        {highlight != null && (
          <div
            style={{
              position: "absolute", left: 0, right: 0, height: LH,
              top: 24 + highlight * LH,
              background: `${E.accent}${dark ? "26" : "18"}`,
              borderLeft: `4px solid ${E.accent}`,
              opacity: hl, transform: `scaleY(${lerp(0.6, 1, hl)})`,
            }}
          />
        )}
        {rows.map((r, i) => (
          <Row key={i} row={r} i={i} lh={LH} size={size} dark={dark} delay={delay + 6 + i * 3} />
        ))}
      </div>
    </div>
  );
};

const Row: React.FC<{ row: CodeRow; i: number; lh: number; size: number; dark: boolean; delay: number }> = ({
  row, i, lh, size, dark, delay,
}) => {
  const a = useAppear(delay, 190);
  const wash = row.mark === "add" ? `${SYNTAX.add}14` : row.mark === "del" ? `${SYNTAX.del}14` : "transparent";
  const gutter = row.mark === "add" ? "+" : row.mark === "del" ? "-" : String(i + 1);
  const gutterColour = row.mark === "add" ? SYNTAX.add : row.mark === "del" ? SYNTAX.del : dimOf(dark);
  return (
    <div
      style={{
        height: lh, display: "flex", alignItems: "center", background: wash,
        opacity: a, transform: `translateX(${lerp(-14, 0, a)}px)`,
      }}
    >
      <div style={{ width: 74, textAlign: "right", paddingRight: 22, fontFamily: MONO, fontSize: size * 0.66, color: gutterColour }}>
        {gutter}
      </div>
      <div style={{ fontFamily: MONO, fontSize: size, whiteSpace: "pre", paddingLeft: (row.indent ?? 0) * 30 }}>
        {row.toks.map((t, k) => (
          <span key={k} style={{ color: tokColour(t.c, dark) }}>{t.t}</span>
        ))}
      </div>
    </div>
  );
};

/* ── connective tissue ───────────────────────────────────────────────────── */

/** A label that points at something, with the line drawing itself first. */
export const Callout: React.FC<{
  text: string; x: number; y: number; w?: number; dir?: "left" | "right"; delay?: number; dark?: boolean;
}> = ({ text, x, y, w = 200, dir = "right", delay = 0, dark = false }) => {
  const a = useAppearAt(delay, 200);
  return (
    <div style={{ position: "absolute", left: `${x}%`, top: `${y}%`, display: "flex", alignItems: "center", gap: 14, flexDirection: dir === "right" ? "row" : "row-reverse" }}>
      <div style={{ height: 3, width: w * a, background: E.accent, borderRadius: 2 }} />
      <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: "0.12em", textTransform: "uppercase", color: E.accent, opacity: a, whiteSpace: "nowrap" }}>
        {text}
      </div>
    </div>
  );
};

/**
 * A prop escaping the monolith and travelling to where it belongs.
 *
 * This is the film's protagonist: `isEditing` starts as a pink flag inside the
 * component, and across the episode it leaves, becomes state the parent owns,
 * and ends up as a sibling. Following one thing through the argument is what
 * turns a sequence of diagrams into a story.
 */
export const FlyingProp: React.FC<{
  label: string; from: [number, number]; to: [number, number]; delay?: number; dur?: number;
}> = ({ label, from, to, delay = 0, dur = 34 }) => {
  const frame = useCurrentFrame();
  const t = clamp01((frame - delay) / dur);
  const e = t * t * (3 - 2 * t);
  if (t <= 0) return null;
  const x = lerp(from[0], to[0], e);
  const y = lerp(from[1], to[1], e) - Math.sin(e * Math.PI) * 7;
  return (
    <div
      style={{
        position: "absolute", left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)",
        fontFamily: MONO, fontSize: 26, color: "#fff", background: E.accent,
        padding: "10px 20px", borderRadius: 999, whiteSpace: "nowrap",
        boxShadow: `0 16px 40px -14px ${E.accent}`,
        opacity: t < 0.06 ? t / 0.06 : 1,
      }}
    >
      {label}
    </div>
  );
};

/** EP12 title card. No italics: the accent word carries colour and a rule. */
export const TitleCard12: React.FC<{ kicker: string; title: string; accent: string; sub: string }> = ({
  kicker, title, accent, sub,
}) => {
  const a = useAppear(0, 175);
  const rule = useAppearAt(46, 200);
  const subA = useAppearAt(58, 185);
  const parts = title.includes(accent) ? title.split(accent) : null;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 150 }}>
      <div style={{ textAlign: "center", opacity: a, maxWidth: 1580 }}>
        <div style={{ marginBottom: 30 }}>
          <Label size={26} color={E.accent}>{kicker}</Label>
        </div>
        <div style={{ fontFamily: GEIST, fontWeight: 700, fontSize: 116, letterSpacing: "-0.045em", lineHeight: 1.02, color: E.ink }}>
          {parts ? (
            <>
              {parts[0]}
              <span style={{ position: "relative", display: "inline-block", color: E.accent }}>
                {accent}
                <span style={{ position: "absolute", left: 0, bottom: -10, height: 7, width: `${rule * 100}%`, background: E.accent, borderRadius: 4 }} />
              </span>
              {parts[1]}
            </>
          ) : title}
        </div>
        <div style={{ marginTop: 44, fontFamily: MONO, fontSize: 27, lineHeight: 1.5, color: E.inkSoft, opacity: subA }}>{sub}</div>
      </div>
    </AbsoluteFill>
  );
};

/* ══ ATMOSPHERE ═══════════════════════════════════════════════════════════ */
//
// Techniques studied from the videocaptions.ai launch film, which is the look
// Bishakh pointed at. Four things carry it, and none of them need a real GLSL
// shader: layered blurred gradients read as one when they move slowly enough.
//
//   1. a flowing colour field, high saturation, deep valleys
//   2. a faint dot matrix over everything, which ties frames together
//   3. selection handles around the hero element, borrowed from design tools
//   4. gradient-filled type for the one word that matters
//
// Grain sits on top of all of it. Without grain the gradients band visibly at
// 1080 and the whole thing looks like a CSS demo.

/**
 * The flowing field. Six large radial blobs drifting on slow, mutually prime
 * sine periods, so the pattern never visibly repeats. Heavy blur is what turns
 * six circles into silk.
 */
export const MeshField: React.FC<{ dark?: boolean; intensity?: number; speed?: number }> = ({
  dark = true, intensity = 1, speed = 1,
}) => {
  const frame = useCurrentFrame();
  const blobs = [
    { c: E.accent, r: 62, px: 0.00071, py: 0.00053, ax: 26, ay: 18, x: 22, y: 30 },
    { c: E.accent2, r: 54, px: 0.00047, py: 0.00061, ax: 30, ay: 22, x: 74, y: 26 },
    { c: E.accent, r: 70, px: 0.00039, py: 0.00043, ax: 22, ay: 26, x: 58, y: 74 },
    { c: E.accent2, r: 46, px: 0.00059, py: 0.00037, ax: 34, ay: 20, x: 18, y: 78 },
    { c: dark ? "#1C6F63" : "#BDEDE3", r: 58, px: 0.00033, py: 0.00067, ax: 28, ay: 24, x: 88, y: 62 },
    { c: dark ? "#0E2E2A" : "#FFFFFF", r: 78, px: 0.00029, py: 0.00031, ax: 18, ay: 14, x: 44, y: 12 },
  ];
  return (
    <AbsoluteFill style={{ background: dark ? E.night : E.paper, overflow: "hidden" }}>
      {blobs.map((b, i) => {
        const x = b.x + Math.sin(frame * b.px * speed * 6.28) * b.ax;
        const y = b.y + Math.cos(frame * b.py * speed * 6.28) * b.ay;
        return (
          <div
            key={i}
            style={{
              position: "absolute", left: `${x}%`, top: `${y}%`,
              width: `${b.r}%`, height: `${b.r}%`, transform: "translate(-50%,-50%)",
              borderRadius: "50%", background: b.c,
              filter: `blur(${dark ? 150 : 170}px)`,
              opacity: (dark ? 0.55 : 0.42) * intensity,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** The dot matrix. Faint, and the same on every beat, which is what ties them. */
export const DotGrid: React.FC<{ dark?: boolean; gap?: number; opacity?: number }> = ({
  dark = true, gap = 30, opacity = 0.5,
}) => (
  <AbsoluteFill
    style={{
      opacity,
      backgroundImage: `radial-gradient(${dark ? "#FFFAFB" : "#131515"} 1.2px, transparent 1.2px)`,
      backgroundSize: `${gap}px ${gap}px`,
      maskImage: "radial-gradient(ellipse 76% 76% at 50% 50%, #000 30%, transparent 78%)",
      WebkitMaskImage: "radial-gradient(ellipse 76% 76% at 50% 50%, #000 30%, transparent 78%)",
      mixBlendMode: dark ? "overlay" : "multiply",
    }}
  />
);

/** Deterministic grain. Gradients band at 1080 without it. */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.055 }) => {
  const frame = useCurrentFrame();
  const seed = frame % 5;
  return (
    <AbsoluteFill style={{ opacity, mixBlendMode: "overlay", pointerEvents: "none" }}>
      <svg width="100%" height="100%">
        <filter id={`gr${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves={2} seed={seed} />
        </filter>
        <rect width="100%" height="100%" filter={`url(#gr${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

/** Design-tool handles around the hero element. */
export const SelectionFrame: React.FC<{ inset?: number; delay?: number; colour?: string }> = ({
  inset = -34, delay = 0, colour = E.accent2,
}) => {
  const a = useAppearAt(delay, 200);
  if (a <= 0.01) return null;
  return (
    <div style={{ position: "absolute", inset, border: `1px solid ${colour}88`, opacity: a }}>
      {[[0, 0], [1, 0], [0, 1], [1, 1]].map(([cx, cy], i) => (
        <div
          key={i}
          style={{
            position: "absolute", left: `${cx * 100}%`, top: `${cy * 100}%`,
            width: 13, height: 13, marginLeft: -6.5, marginTop: -6.5,
            background: colour, borderRadius: 2,
          }}
        />
      ))}
    </div>
  );
};

/** Type filled with the signature gradient, for the one word that matters. */
export const GradText: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span
    style={{
      backgroundImage: `linear-gradient(100deg, ${E.accent2}, ${E.accent})`,
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
    }}
  >
    {children}
  </span>
);

/* ══ COUNTERS AND WIPES ═══════════════════════════════════════════════════ */

/**
 * A number that counts up to itself.
 *
 * A figure that simply appears is a fact; a figure that COUNTS is an event, and
 * the ear gets a blip per step so the eye and the ear arrive together. Handles
 * prefixes and suffixes ("~600", "16", "55%") by counting only the digits.
 */
export const CountUp: React.FC<{
  value: string; size?: number; dark?: boolean; delay?: number; dur?: number; colour?: string;
}> = ({ value, size = 110, dark = false, delay = 0, dur = 40, colour }) => {
  const frame = useCurrentFrame();
  const t = clamp01((frame - delay) / dur);
  // ease-out: fast at first, settling on the last few digits, which is what
  // makes a counter feel mechanical rather than linear
  const e = 1 - Math.pow(1 - t, 2.4);
  const m = value.match(/^([^\d-]*)(-?[\d,.]+)(.*)$/);
  const shown = (() => {
    if (!m) return value;
    const target = parseFloat(m[2].replace(/,/g, ""));
    const dec = (m[2].split(".")[1] || "").length;
    const cur = target * e;
    return `${m[1]}${dec ? cur.toFixed(dec) : Math.round(cur).toLocaleString()}${m[3]}`;
  })();
  return (
    <div
      style={{
        fontFamily: GEIST, fontWeight: 700, fontSize: size, letterSpacing: "-0.045em",
        lineHeight: 1, color: colour ?? inkFor(dark),
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {shown}
    </div>
  );
};

/**
 * Directional reveal for a whole beat.
 *
 * `Soft` dissolves, which is right for a travelled canvas but reads as one
 * texture when every join does it. A wipe gives the cut a DIRECTION, and
 * alternating the direction across the film stops the edit feeling like a
 * slideshow of fades. Timing is untouched: the wipe happens inside the beat's
 * own length, so no frames come out of the narration breath.
 */
export const Wipe: React.FC<{
  children: React.ReactNode; dir?: "left" | "right" | "up" | "down";
  inF?: number; outF?: number;
}> = ({ children, dir = "left", inF = 16, outF = 14 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const ease = (x: number) => x * x * (3 - 2 * x);
  const rise = ease(clamp01(frame / inF));
  const fall = ease(clamp01((durationInFrames - frame) / outF));
  // incoming is revealed from `dir`; outgoing leaves the opposite way, so the
  // two halves of a join move as one gesture
  const openPct = (1 - rise) * 100;
  const closePct = (1 - fall) * 100;
  const clip =
    dir === "left" ? `inset(0 ${openPct}% 0 ${closePct}%)`
    : dir === "right" ? `inset(0 ${closePct}% 0 ${openPct}%)`
    : dir === "up" ? `inset(${openPct}% 0 ${closePct}% 0)`
    : `inset(${closePct}% 0 ${openPct}% 0)`;
  return (
    <AbsoluteFill style={{ clipPath: clip, WebkitClipPath: clip }}>
      <AbsoluteFill style={{ opacity: ease(clamp01(frame / 8)) }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ══ THE REAL MONOLITH ════════════════════════════════════════════════════ */
//
// The column the camera falls down is REAL REACT, not abstract grey bars.
// Bars taught nothing: they said "a lot of code" when the point is "a lot of
// code THAT KNOWS TOO MUCH". With the real source on screen the audience can
// see the nested ternaries and the eleven flags, and the scroll becomes
// evidence instead of decoration.
//
// Tokenised by rule rather than by hand so the source stays readable here:
// keywords green, JSX tags violet, boolean-ish props the accent, strings amber.

const KEYWORDS = /^(import|from|type|export|function|const|let|return|null|true|false|undefined|as)$/;
const FLAGISH = /^(is|show|has|can|with)[A-Z]/;

/** Split a line of source into coloured tokens by rule. */
export const tokenise = (line: string): Tok[] => {
  const out: Tok[] = [];
  const re = /([A-Za-z_$][\w$.]*)|("[^"]*")|(\s+)|([^\sA-Za-z_$"]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    const [t] = m;
    if (m[2]) out.push({ t, c: "value" });
    else if (m[3]) out.push({ t, c: "punct" });
    else if (m[4]) out.push({ t, c: "punct" });
    else if (KEYWORDS.test(t)) out.push({ t, c: "keyword" });
    else if (FLAGISH.test(t)) out.push({ t, c: "flag" });
    else if (/^[A-Z]/.test(t)) out.push({ t, c: "tag" });
    else out.push({ t, c: "text" });
  }
  return out;
};

/** The component that knows every case. Real, and really this shape. */
export const MONOLITH_SRC = `import { useState } from "react"
import type { ReactNode } from "react"

type ComposerProps = {
  onSubmit: (value: string) => void
  isThread?: boolean
  channelId?: string
  isDMThread?: boolean
  dmId?: string
  isEditing?: boolean
  isForwarding?: boolean
  showAttachments?: boolean
  showFormatting?: boolean
  showEmojis?: boolean
  renderHeader?: () => ReactNode
  renderFooter?: () => ReactNode
  renderActions?: () => ReactNode
}

export function Composer({
  onSubmit,
  isThread,
  channelId,
  isDMThread,
  dmId,
  isEditing,
  isForwarding,
  showAttachments,
  showFormatting,
  showEmojis,
  renderHeader,
  renderFooter,
  renderActions,
}: ComposerProps) {
  const [value, setValue] = useState("")
  const [draft, setDraft] = useState(null)

  const canSubmit = value.trim().length > 0
  const target = isDMThread ? dmId : channelId

  return (
    <form onSubmit={() => onSubmit(value)}>
      {renderHeader?.()}

      <TextInput
        value={value}
        onChange={setValue}
        placeholder={
          isEditing
            ? "Edit message"
            : isForwarding
              ? "Add a comment"
              : "Message"
        }
      />

      {showAttachments && <Attachments draft={draft} />}

      {isDMThread ? (
        <AlsoSendToDM id={dmId} />
      ) : isThread ? (
        <AlsoSendToChannel id={channelId} />
      ) : null}

      {renderFooter ? (
        renderFooter()
      ) : (
        <Footer>
          {showFormatting && <Formatting />}
          {showEmojis && <Emojis />}
          {renderActions?.()}
        </Footer>
      )}

      {isEditing ? (
        <EditActions onCancel={reset} />
      ) : isForwarding ? (
        <ForwardActions target={target} />
      ) : (
        <DefaultActions disabled={!canSubmit} />
      )}
    </form>
  )
}`.split("\n");
