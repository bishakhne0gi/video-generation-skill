// Author: Bishakh
//
// Scene vocabulary for tech episodes. A VOCABULARY, not a template — compose,
// restyle and invent alongside these so each episode is its own film. Every
// primitive takes the episode `Palette` and sizes itself off `useK()`, so it
// works at 1080p, 4K and 9:16 without edits.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import type { Palette } from "../theme";
import { alpha } from "../theme";
import { HEAD, SANS, MONO, SERIF } from "../fonts";
import { lerp, useAppear, useK, clip, counter, splitAccent, rand, drift, useTyped, shake, useAlive } from "./anim";

/* ── atmosphere ──────────────────────────────────────────────────────────── */

/**
 * Base plate for every graphics scene: deep bg, accent bloom, engineering grid.
 *
 * It is never still. The blooms drift, the grid parallaxes, and a soft light
 * sweeps the frame on a slow cycle — so a screen that has finished assembling
 * still has something happening on it. A frozen frame reads as a stall even
 * while the narration is running, and that is where viewers leave.
 */
export const Backdrop: React.FC<{ pal: Palette; grid?: boolean; bloom?: number }> = ({ pal, grid = true, bloom = 1 }) => {
  const frame = useCurrentFrame();
  // ~13s cycle: fast enough to be alive, slow enough that you can't point at it
  const bx = 72 + Math.sin(frame / 42) * 6;
  const by = 4 + Math.cos(frame / 55) * 3;
  const sweep = ((frame * 0.42) % 260) - 60; // light crossing the frame, %
  return (
    <AbsoluteFill style={{ backgroundColor: pal.bg }}>
      <AbsoluteFill
        style={{
          background:
            `radial-gradient(ellipse 62% 58% at ${bx}% ${by}%, ${pal.accent}${alpha(0.16 * bloom)}, transparent 62%),` +
            `radial-gradient(ellipse 55% 50% at ${6 + Math.sin(frame / 67) * 4}% 96%, ${pal.accent2}${alpha(0.12 * bloom)}, transparent 66%)`,
        }}
      />
      {grid && (
        <AbsoluteFill
          style={{
            backgroundImage: `linear-gradient(${pal.border} 1px, transparent 1px), linear-gradient(90deg, ${pal.border} 1px, transparent 1px)`,
            backgroundSize: "88px 88px",
            // the grid creeps — one cell every ~10s, invisible until it's gone
            backgroundPosition: `${(frame * 0.14) % 88}px ${(frame * 0.09) % 88}px`,
            maskImage: "radial-gradient(ellipse 80% 70% at 50% 45%, #000 30%, transparent 85%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 45%, #000 30%, transparent 85%)",
            opacity: 0.6,
          }}
        />
      )}
      <AbsoluteFill
        style={{
          background: `linear-gradient(100deg, transparent ${sweep - 26}%, ${pal.accent}${alpha(0.05 * bloom)} ${sweep}%, transparent ${sweep + 26}%)`,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

/** Drifting particles — use sparingly, one scene in five at most. */
export const Particles: React.FC<{ pal: Palette; count?: number }> = ({ pal, count = 26 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: rand(i) * width,
            top: (rand(i + 99) * height + frame * (0.3 + rand(i + 7))) % height,
            width: 3 + rand(i + 3) * 4, height: 3 + rand(i + 3) * 4,
            borderRadius: "50%", background: pal.accent,
            opacity: 0.15 + rand(i + 11) * 0.35,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

export const Eyebrow: React.FC<{ pal: Palette; children: React.ReactNode; delay?: number }> = ({ pal, children, delay = 4 }) => {
  const a = useAppear(delay);
  const k = useK();
  return (
    <div style={{ fontFamily: MONO, fontSize: 24 * k, fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: pal.accent, opacity: a, transform: `translateY(${lerp(14, 0, a)}px)` }}>
      {children}
    </div>
  );
};

export const TopEyebrow: React.FC<{ pal: Palette; children: React.ReactNode }> = ({ pal, children }) => {
  const k = useK();
  return <div style={{ position: "absolute", top: 104 * k, left: 130 * k }}><Eyebrow pal={pal}>{children}</Eyebrow></div>;
};

/** The house headline. Poppins ExtraBold, -0.05em, letters almost touching. */
export const Head: React.FC<{ pal: Palette; size?: number; color?: string; children: React.ReactNode; style?: React.CSSProperties }> = ({
  pal, size = 96, color, children, style,
}) => {
  const k = useK();
  return (
    <div style={{ fontFamily: HEAD, fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 1.02, fontSize: size * k, color: color || pal.ink, ...style }}>
      {children}
    </div>
  );
};

/* ── openers ─────────────────────────────────────────────────────────────── */

/** Cold open title. `accentWord` is set in italic serif — exactly one per card. */
export const TitleCard: React.FC<{ pal: Palette; kicker: string; title: string; accentWord?: string; sub?: string }> = ({
  pal, kicker, title, accentWord, sub,
}) => {
  const k = useK();
  const a1 = useAppear(3), a2 = useAppear(8, 170), a3 = useAppear(15);
  const parts = splitAccent(title, accentWord);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Backdrop pal={pal} />
      <div style={{ textAlign: "center", padding: 90 * k }}>
        <div style={{ opacity: a1 }}><Eyebrow pal={pal}>{kicker}</Eyebrow></div>
        <Head pal={pal} size={132} style={{ marginTop: 28 * k, opacity: a2, transform: `translateY(${lerp(34, 0, a2)}px)` }}>
          {parts.pre}
          {parts.accent && <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, letterSpacing: "-0.01em", color: pal.accent }}>{parts.accent}</span>}
          {parts.post}
        </Head>
        {sub && (
          <div style={{ marginTop: 34 * k, fontFamily: SANS, fontSize: 34 * k, color: pal.textBody, opacity: a3 }}>{sub}</div>
        )}
      </div>
    </AbsoluteFill>
  );
};

/** Numbered chapter slate — "01 / THE PROBLEM". Keeps a long episode navigable. */
export const ChapterCard: React.FC<{ pal: Palette; n: number; title: string }> = ({ pal, n, title }) => {
  const frame = useCurrentFrame();
  const k = useK();
  const a = useAppear(4, 140);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Backdrop pal={pal} bloom={0.6} />
      <div style={{ display: "flex", alignItems: "baseline", gap: 40 * k, transform: `translateX(${shake(frame, 6, 8)}px)` }}>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 260 * k, letterSpacing: "-0.06em", color: pal.accent, opacity: a, lineHeight: 0.9 }}>
          {String(n).padStart(2, "0")}
        </div>
        <div style={{ overflow: "hidden" }}>
          <Head pal={pal} size={72} style={{ transform: `translateY(${lerp(90, 0, a)}px)`, textTransform: "uppercase" }}>{title}</Head>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** One idea, full frame. The beat that lets the narration land. */
export const Statement: React.FC<{ pal: Palette; text: string; accentWord?: string }> = ({ pal, text, accentWord }) => {
  const k = useK();
  const a = useAppear(6, 160);
  const parts = splitAccent(text, accentWord);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Backdrop pal={pal} grid={false} />
      <Head pal={pal} size={78} style={{ maxWidth: 1420 * k, textAlign: "center", opacity: a, transform: `translateY(${lerp(26, 0, a)}px)`, lineHeight: 1.14 }}>
        {parts.pre}
        {parts.accent && <span style={{ color: pal.accent }}>{parts.accent}</span>}
        {parts.post}
      </Head>
    </AbsoluteFill>
  );
};

/* ── code & terminal ─────────────────────────────────────────────────────── */

const tokenColor = (line: string, pal: Palette) => {
  if (/^\s*(\/\/|#)/.test(line)) return pal.textMuted;
  if (/\b(import|export|from|const|let|function|return|async|await|class|def|type|interface)\b/.test(line)) return pal.accent2;
  if (/\b(error|Error|fail|FAIL|✗)\b/.test(line)) return "#FF6B6B";
  if (/\b(ok|OK|done|✓|success)\b/.test(line)) return "#4ADE80";
  return "#E6E6F0";
};

/** Code panel with a line-by-line reveal and an optional highlighted line. */
export const CodeWindow: React.FC<{
  pal: Palette; filename: string; lines: string[]; eyebrow?: string;
  highlight?: number; caption?: string; cps?: number; width?: number;
}> = ({ pal, filename, lines, eyebrow, highlight = -1, caption, cps = 4, width = 1240 }) => {
  const frame = useCurrentFrame();
  const k = useK();
  const win = useAppear(6, 160);
  const alive = useAlive(2);
  const shown = Math.floor((frame - 8) / cps);
  const cap = useAppear(10 + lines.length * cps);
  const longest = lines.reduce((m, l) => Math.max(m, l.length), 1);
  const fit = Math.min(30, ((width - 80) / longest) / 0.6);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Backdrop pal={pal} />
      {eyebrow && <TopEyebrow pal={pal}>{eyebrow}</TopEyebrow>}
      <div
        style={{
          width: width * k, borderRadius: 24 * k, overflow: "hidden", background: pal.isDark ? "#0A0C11" : "#0C0C0E",
          border: `1px solid ${pal.border}`, boxShadow: `0 60px 140px -50px #000, 0 0 0 ${8 * k}px ${pal.accent}10`,
          opacity: win,
          // reveal transform first, then hand the panel over to the idle drift
          transform: `translateY(${lerp(44, 0, win)}px) scale(${lerp(0.97, 1, win)}) ${win > 0.98 ? alive.transform : ""}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 * k, padding: `${18 * k}px ${26 * k}px`, borderBottom: `1px solid ${pal.border}` }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <span key={c} style={{ width: 13 * k, height: 13 * k, borderRadius: "50%", background: c }} />
          ))}
          <span style={{ marginLeft: 16 * k, fontFamily: MONO, fontSize: 22 * k, letterSpacing: "0.12em", color: "rgba(255,255,255,0.45)" }}>{filename}</span>
        </div>
        {/* Auto-fit so no line ever wraps — wrapped code reads as a bug on screen.
            Geist Mono advance ≈ 0.6em. Keep lines under ~64 chars anyway. */}
        <div style={{ padding: `${34 * k}px ${40 * k}px`, fontFamily: MONO, fontSize: fit * k, lineHeight: 1.55, whiteSpace: "pre" }}>
          {lines.map((ln, i) => {
            const on = i <= shown;
            const hot = i === highlight && shown >= highlight;
            return (
              <div
                key={i}
                style={{
                  color: hot ? pal.accent : tokenColor(ln, pal),
                  opacity: on ? (highlight >= 0 && !hot && shown > highlight ? 0.42 : 1) : 0,
                  transform: `translateX(${on ? 0 : 10}px)`,
                  background: hot ? `${pal.accent}14` : "transparent",
                  margin: `0 ${-16 * k}px`, padding: `0 ${16 * k}px`, borderRadius: 6 * k,
                  borderLeft: hot ? `3px solid ${pal.accent}` : "3px solid transparent",
                }}
              >
                {ln || " "}
              </div>
            );
          })}
        </div>
      </div>
      {caption && (
        <div style={{ position: "absolute", bottom: 120 * k, fontFamily: SANS, fontSize: 36 * k, color: pal.ink, opacity: cap }}>{caption}</div>
      )}
    </AbsoluteFill>
  );
};

/** A command typing itself, then output streaming in. The most credible tech beat. */
export const TerminalRun: React.FC<{ pal: Palette; command: string; output: string[]; eyebrow?: string; prompt?: string }> = ({
  pal, command, output, eyebrow, prompt = "~/episode",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = useK();
  const win = useAppear(4, 160);
  const alive = useAlive(5);
  const typed = useTyped(command, 14, 26);
  const startOut = 14 + (command.length / 26) * fps + 8;
  const shown = Math.floor((frame - startOut) / 7);
  const longest = Math.max(command.length + prompt.length + 3, ...output.map((l) => l.length), 1);
  const fit = Math.min(30, (1230 / longest) / 0.6);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Backdrop pal={pal} />
      {eyebrow && <TopEyebrow pal={pal}>{eyebrow}</TopEyebrow>}
      <div
        style={{
          width: 1320 * k, minHeight: 560 * k, borderRadius: 22 * k, background: "#07090D", border: `1px solid ${pal.border}`,
          padding: `${40 * k}px ${44 * k}px`, fontFamily: MONO, fontSize: fit * k, lineHeight: 1.6, whiteSpace: "pre",
          boxShadow: `0 60px 140px -50px #000`, opacity: win,
          transform: `translateY(${lerp(40, 0, win)}px) ${win > 0.98 ? alive.transform : ""}`,
        }}
      >
        <div style={{ color: pal.accent }}>
          {prompt} <span style={{ color: "#fff" }}>$ {typed.text}</span>
          {!typed.done && <span style={{ opacity: Math.floor(frame / 8) % 2 ? 1 : 0 }}>▌</span>}
        </div>
        <div style={{ marginTop: 20 * k }}>
          {output.map((ln, i) => (
            <div key={i} style={{ color: tokenColor(ln, pal), opacity: i <= shown ? 1 : 0, transform: `translateY(${i <= shown ? 0 : 6}px)` }}>{ln || " "}</div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ── diagrams ────────────────────────────────────────────────────────────── */

/**
 * Left→right architecture flow with packets travelling the edges.
 * The workhorse for "how it actually works" beats. 2–5 stages.
 */
export const FlowDiagram: React.FC<{ pal: Palette; eyebrow?: string; stages: { label: string; sub?: string }[]; caption?: string }> = ({
  pal, eyebrow, stages, caption,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const k = useK();
  const items = stages.slice(0, 5);
  const boxW = 300 * k, boxH = 170 * k;
  const gap = (width - 260 * k - items.length * boxW) / Math.max(1, items.length - 1);
  const y = height * 0.5;
  const x0 = 130 * k;
  const cap = useAppear(10 + items.length * 4);
  return (
    <AbsoluteFill>
      <Backdrop pal={pal} />
      {eyebrow && <TopEyebrow pal={pal}>{eyebrow}</TopEyebrow>}
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {items.slice(0, -1).map((_, i) => {
          const xa = x0 + (i + 1) * boxW + i * gap;
          const xb = xa + gap;
          const edge = spring({ frame: frame - 7 - i * 4, fps: 30, config: { damping: 200 }, durationInFrames: 12 });
          // packets keep travelling for the whole beat — this is the diagram's pulse
          const t = ((frame - 9 - i * 4) % 30) / 30;
          return (
            <g key={i}>
              <line x1={xa} y1={y} x2={lerp(xa, xb, edge)} y2={y} stroke={pal.borderMid} strokeWidth={2} strokeDasharray="3 10" />
              {edge > 0.85 && t >= 0 && <circle cx={lerp(xa, xb, t)} cy={y} r={7 * k} fill={pal.accent} />}
            </g>
          );
        })}
      </svg>
      {items.map((s, i) => {
        const a = spring({ frame: frame - 8 - i * 9, fps: 30, config: { damping: 180 }, durationInFrames: 26 });
        const x = x0 + i * (boxW + gap);
        return (
          <div
            key={i}
            style={{
              position: "absolute", left: x, top: y - boxH / 2, width: boxW, height: boxH,
              borderRadius: 20 * k, background: pal.surface, border: `1.5px solid ${i === items.length - 1 ? pal.accent : pal.border}`,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 * k,
              opacity: a, transform: `translateY(${lerp(30, drift(frame, i, 4, 0.03), a)}px) scale(${lerp(0.9, 1, a)})`,
              boxShadow: i === items.length - 1 ? `0 0 ${60 * k}px ${pal.accent}33` : `0 30px 70px -40px #000`,
            }}
          >
            <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 34 * k, letterSpacing: "-0.03em", color: pal.ink, textAlign: "center", padding: `0 ${16 * k}px` }}>
              {clip(s.label, 20)}
            </div>
            {s.sub && <div style={{ fontFamily: MONO, fontSize: 20 * k, letterSpacing: "0.08em", color: pal.textMuted }}>{clip(s.sub, 22)}</div>}
          </div>
        );
      })}
      {caption && <div style={{ position: "absolute", bottom: 130 * k, width: "100%", textAlign: "center", fontFamily: SANS, fontSize: 34 * k, color: pal.textBody, opacity: cap }}>{caption}</div>}
    </AbsoluteFill>
  );
};

/** Layered stack — protocol/architecture episodes. Top layer highlights last. */
export const StackDiagram: React.FC<{ pal: Palette; eyebrow?: string; layers: string[]; focus?: number }> = ({ pal, eyebrow, layers, focus = -1 }) => {
  const frame = useCurrentFrame();
  const k = useK();
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Backdrop pal={pal} />
      {eyebrow && <TopEyebrow pal={pal}>{eyebrow}</TopEyebrow>}
      <div style={{ display: "flex", flexDirection: "column", gap: 18 * k, width: 1100 * k }}>
        {layers.map((l, i) => {
          const idx = layers.length - 1 - i;                      // build bottom-up
          const a = spring({ frame: frame - 8 - idx * 8, fps: 30, config: { damping: 190 }, durationInFrames: 24 });
          const hot = i === focus;
          return (
            <div
              key={i}
              style={{
                height: 104 * k, borderRadius: 16 * k, display: "flex", alignItems: "center", paddingLeft: 40 * k, gap: 24 * k,
                background: hot ? `${pal.accent}1f` : pal.surface, border: `1.5px solid ${hot ? pal.accent : pal.border}`,
                opacity: a, transform: `translateY(${lerp(26, 0, a)}px)`,
                boxShadow: hot ? `0 0 ${70 * k}px ${pal.accent}30` : "none",
              }}
            >
              <div style={{ fontFamily: MONO, fontSize: 22 * k, color: pal.textMuted, width: 60 * k }}>{String(layers.length - i).padStart(2, "0")}</div>
              <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 40 * k, letterSpacing: "-0.03em", color: hot ? pal.accent : pal.ink }}>{l}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** Before / after — the payoff beat. Bars count up to real numbers. */
export const Compare: React.FC<{ pal: Palette; eyebrow?: string; before: { label: string; value: string; pct: number }; after: { label: string; value: string; pct: number } }> = ({
  pal, eyebrow, before, after,
}) => {
  const k = useK();
  const a1 = useAppear(4, 190), a2 = useAppear(12, 190);
  const row = (d: { label: string; value: string; pct: number }, a: number, hot: boolean) => (
    <div style={{ opacity: a, transform: `translateY(${lerp(24, 0, a)}px)` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 * k }}>
        <div style={{ fontFamily: MONO, fontSize: 26 * k, letterSpacing: "0.12em", textTransform: "uppercase", color: hot ? pal.accent : pal.textMuted }}>{d.label}</div>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 64 * k, letterSpacing: "-0.04em", color: hot ? pal.accent : pal.textBody }}>{counter(d.value, a)}</div>
      </div>
      <div style={{ height: 26 * k, borderRadius: 999, background: pal.surfaceMid, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${d.pct * a}%`, background: hot ? pal.accent : pal.borderMid, borderRadius: 999, boxShadow: hot ? `0 0 ${40 * k}px ${pal.accent}80` : "none" }} />
      </div>
    </div>
  );
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Backdrop pal={pal} />
      {eyebrow && <TopEyebrow pal={pal}>{eyebrow}</TopEyebrow>}
      <div style={{ width: 1280 * k, display: "flex", flexDirection: "column", gap: 72 * k }}>
        {row(before, a1, false)}
        {row(after, a2, true)}
      </div>
    </AbsoluteFill>
  );
};

/** Big numbers. 2–4 max, each with a one-word label. */
export const StatRow: React.FC<{ pal: Palette; eyebrow?: string; stats: { value: string; label: string }[] }> = ({ pal, eyebrow, stats }) => {
  const frame = useCurrentFrame();
  const k = useK();
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Backdrop pal={pal} />
      {eyebrow && <TopEyebrow pal={pal}>{eyebrow}</TopEyebrow>}
      <div style={{ display: "flex", gap: 110 * k }}>
        {stats.slice(0, 4).map((s, i) => {
          const a = spring({ frame: frame - 10 - i * 9, fps: 30, config: { damping: 200 }, durationInFrames: 30 });
          return (
            <div key={i} style={{ textAlign: "center", opacity: a, transform: `translateY(${lerp(28, 0, a)}px)` }}>
              <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 128 * k, letterSpacing: "-0.05em", color: pal.accent, lineHeight: 1 }}>{counter(s.value, a)}</div>
              <div style={{ marginTop: 18 * k, fontFamily: MONO, fontSize: 24 * k, letterSpacing: "0.14em", textTransform: "uppercase", color: pal.textMuted }}>{clip(s.label, 22)}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** Auto-ticking checklist — steps, requirements, "what it takes" beats. */
export const Checklist: React.FC<{ pal: Palette; eyebrow?: string; items: string[]; every?: number }> = ({ pal, eyebrow, items, every = 9 }) => {
  const frame = useCurrentFrame();
  const k = useK();
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Backdrop pal={pal} />
      {eyebrow && <TopEyebrow pal={pal}>{eyebrow}</TopEyebrow>}
      <div style={{ display: "flex", flexDirection: "column", gap: 26 * k, width: 1180 * k }}>
        {items.map((it, i) => {
          const a = spring({ frame: frame - 4 - i * 5, fps: 30, config: { damping: 190 }, durationInFrames: 13 });
          const ticked = frame > 8 + i * every;
          const tick = spring({ frame: frame - (8 + i * every), fps: 30, config: { damping: 140 }, durationInFrames: 11 });
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 30 * k, opacity: a, transform: `translateX(${lerp(-26, 0, a)}px)` }}>
              <div
                style={{
                  width: 56 * k, height: 56 * k, borderRadius: 14 * k, flexShrink: 0,
                  border: `2px solid ${ticked ? pal.accent : pal.borderMid}`, background: ticked ? pal.accent : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${ticked ? lerp(1.15, 1, tick) : 1})`,
                }}
              >
                {ticked && (
                  <svg width={30 * k} height={30 * k} viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke={pal.isDark ? "#04060A" : "#fff"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="24" strokeDashoffset={24 - 24 * tick} />
                  </svg>
                )}
              </div>
              <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 40 * k, color: ticked ? pal.ink : pal.textMuted }}>{clip(it, 44)}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** Pull-quote / spec card — a tweet, a spec line, a docs sentence. */
export const QuoteCard: React.FC<{ pal: Palette; quote: string; source?: string }> = ({ pal, quote, source }) => {
  const k = useK();
  const a = useAppear(6, 150);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Backdrop pal={pal} grid={false} />
      <div style={{ width: 1300 * k, padding: `${64 * k}px ${72 * k}px`, background: pal.surface, border: `1px solid ${pal.border}`, borderLeft: `6px solid ${pal.accent}`, borderRadius: 24 * k, opacity: a, transform: `translateY(${lerp(30, 0, a)}px)`, boxShadow: `0 60px 140px -60px #000` }}>
        <div style={{ fontFamily: SERIF, fontSize: 62 * k, lineHeight: 1.24, color: pal.ink }}>“{quote}”</div>
        {source && <div style={{ marginTop: 32 * k, fontFamily: MONO, fontSize: 24 * k, letterSpacing: "0.12em", textTransform: "uppercase", color: pal.accent }}>{source}</div>}
      </div>
    </AbsoluteFill>
  );
};

/**
 * Closing card: takeaway + where to go next. Always the last beat.
 * `nextLabel` defaults to "Next:" — pass "" when the line stands alone
 * (e.g. "Follow for more") and the prefix would read wrong.
 */
export const EndCard: React.FC<{ pal: Palette; line: string; cta?: string; next?: string; nextLabel?: string }> = ({
  pal, line, cta, next, nextLabel = "Next:",
}) => {
  const k = useK();
  const a = useAppear(4, 150), b = useAppear(12, 170);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Backdrop pal={pal} />
      <Particles pal={pal} count={18} />
      <div style={{ textAlign: "center", opacity: a, transform: `translateY(${lerp(26, 0, a)}px)` }}>
        <Head pal={pal} size={104}>{line}</Head>
        {cta && (
          <div style={{ marginTop: 46 * k, opacity: b }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 16 * k, background: pal.accent, color: pal.isDark ? "#04060A" : "#fff", fontFamily: HEAD, fontWeight: 700, fontSize: 34 * k, padding: `${20 * k}px ${44 * k}px`, borderRadius: 999 }}>
              {cta}
              <svg width={28 * k} height={28 * k} viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
          </div>
        )}
        {next && (
          <div style={{ marginTop: 40 * k, fontFamily: MONO, fontSize: 26 * k, letterSpacing: "0.14em", textTransform: "uppercase", color: pal.textMuted, opacity: b }}>
            {nextLabel ? `${nextLabel} ${next}` : next}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

export { interpolate };
