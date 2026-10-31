// Author: Bishakh
//
// THE WORKSPACE — the surfaces the agents operate.
//
// `agents.tsx` supplies the actors; this file supplies the things they act on.
// The pairing is the whole register: a prompt box that gets typed into, a task
// list that streams, and a live artifact that visibly RESTYLES ITSELF while a
// cursor labelled "Colorist" sits next to it.
//
// The one idea that makes these read as software rather than as illustrations
// of software: STATE CHANGES ARE INTERPOLATED, never swapped. A card that cuts
// from cream to navy on one frame is a slide changing. The same card taking
// 13 frames to cross-fade its background, its ink, its accent shape and its
// type colour together is an application re-rendering, and the eye reads the
// difference immediately even though it cannot name it.
//
// House rules for this register:
//
//   • The artifact on screen must be a PLAUSIBLE artifact — a real title, a
//     real duration in the scrubber, a real filename in the chrome. Lorem bars
//     everywhere reads as a wireframe, and a wireframe has nothing at stake.
//   • Chrome is thin and quiet. The window frame is not the subject; the moment
//     the traffic lights are the most detailed thing on screen, the beat is
//     about a window instead of about what the window contains.
//   • One artifact per film, changed repeatedly — not five artifacts shown
//     once. The demo register earns its ending by transforming ONE thing.

import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { Palette } from "../theme";
import { alpha, mix } from "../theme";
import { HEAD, MONO, SANS } from "../fonts";
import { clamp01, useK, useAppearAt, stagger, useTyped, lerp } from "./anim";

/* ── the prompt box ──────────────────────────────────────────────────────── */

/**
 * The input the film starts from. One line of intent, typed, then sent.
 *
 * Why the film should open here rather than on a title: a prompt is a PROMISE.
 * The viewer reads "Make a launch video for my app", and every frame after it
 * is being judged against a goal they already hold — which is the cheapest
 * narrative tension available to a product film, and it costs one component.
 *
 * `bold` marks the words that carry the intent; they weight up as they land,
 * so the sentence tells you what matters while it is still being typed.
 */
export const PromptBox: React.FC<{
  pal: Palette;
  text: string;
  /** Substrings rendered at full weight. */
  bold?: string[];
  start?: number;
  cps?: number;
  /** Frame the send button flares. Sound it with `click`. */
  sendAt?: number;
  width?: number;
}> = ({ pal, text, bold = [], start = 8, cps = 26, sendAt, width = 900 }) => {
  const frame = useCurrentFrame();
  const k = useK();
  const typed = useTyped(text, start, cps);
  const sent = sendAt !== undefined && frame >= sendAt;
  const sendPop = sendAt === undefined
    ? 1
    : interpolate(frame, [sendAt, sendAt + 6, sendAt + 12], [1, 0.88, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.3, 0, 0.2, 1),
      });

  // Split the visible text on the bold spans so weight arrives with the words.
  const parts: { s: string; b: boolean }[] = [];
  let rest = typed.text;
  let guard = 0;
  while (rest.length && guard++ < 64) {
    const hit = bold
      .map((b) => ({ b, i: rest.toLowerCase().indexOf(b.toLowerCase()) }))
      .filter((h) => h.i >= 0)
      .sort((a, b) => a.i - b.i)[0];
    if (!hit) { parts.push({ s: rest, b: false }); break; }
    if (hit.i > 0) parts.push({ s: rest.slice(0, hit.i), b: false });
    parts.push({ s: rest.slice(hit.i, hit.i + hit.b.length), b: true });
    rest = rest.slice(hit.i + hit.b.length);
  }

  return (
    <div
      style={{
        width: width * k,
        background: pal.surface,
        border: `1px solid ${pal.border}`,
        borderRadius: 20 * k,
        padding: `${26 * k}px ${28 * k}px ${18 * k}px`,
        boxShadow: `0 ${26 * k}px ${70 * k}px -${26 * k}px ${pal.bgDeep}${alpha(0.32)}`,
      }}
    >
      <div style={{ fontFamily: SANS, fontSize: 30 * k, lineHeight: 1.35, color: pal.textBody, minHeight: 42 * k }}>
        {parts.map((p, i) => (
          <span key={i} style={{ fontWeight: p.b ? 700 : 400, color: p.b ? pal.ink : pal.textBody }}>
            {p.s}
          </span>
        ))}
        {!typed.done && <span style={{ opacity: frame % 30 < 16 ? 1 : 0 }}>|</span>}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 18 * k }}>
        <div style={{ display: "flex", gap: 14 * k, opacity: 0.4 }}>
          {["+", "▣", "⌥"].map((s, i) => (
            <span key={i} style={{ fontFamily: SANS, fontSize: 22 * k, color: pal.textMuted }}>{s}</span>
          ))}
        </div>
        <div
          style={{
            width: 46 * k,
            height: 46 * k,
            borderRadius: "50%",
            background: typed.done || sent ? pal.ink : pal.borderMid,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            scale: `${sendPop}`,
          }}
        >
          <svg width={22 * k} height={22 * k} viewBox="0 0 22 22">
            <path d="M11 17 L11 5 M5.5 10.5 L11 5 L16.5 10.5" fill="none" stroke={pal.bg} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
};

/* ── the task stream ─────────────────────────────────────────────────────── */

/**
 * What the system is doing, arriving one line at a time.
 *
 * The point is not the list — it is that the list arrives at reading speed and
 * each line has a SECOND line under it naming the craft detail. That second
 * line is where the density lives: "Whooshes synced to every cut" tells the
 * viewer the thing knows what it is doing, and it does so in five words while
 * the picture is busy elsewhere.
 *
 * `hot` is the word in the sub-line that gets the underline and the ink weight.
 */
export const TaskStream: React.FC<{
  pal: Palette;
  items: { label: string; sub: string; hot?: string; color?: string }[];
  every?: number;
  start?: number;
  footer?: string;
}> = ({ pal, items, every = 14, start = 6, footer }) => {
  const k = useK();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 26 * k }}>
      {items.map((it, i) => (
        <TaskLine key={i} pal={pal} it={it} at={stagger(i, every, start)} k={k} />
      ))}
      {footer && <FooterLine pal={pal} text={footer} at={stagger(items.length, every, start)} k={k} />}
    </div>
  );
};

const TaskLine: React.FC<{ pal: Palette; it: { label: string; sub: string; hot?: string; color?: string }; at: number; k: number }> = ({
  pal, it, at, k,
}) => {
  const a = useAppearAt(at, 190);
  const dot = it.color || pal.accent;
  const [pre, hot, post] = splitHot(it.sub, it.hot);
  return (
    <div style={{ display: "flex", gap: 18 * k, opacity: a, translate: `0 ${lerp(10, 0, a) * k}px` }}>
      <span style={{ width: 12 * k, height: 12 * k, borderRadius: "50%", background: dot, marginTop: 13 * k, flexShrink: 0 }} />
      <div>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30 * k, color: pal.ink, letterSpacing: "-0.01em" }}>
          {it.label}
        </div>
        <div style={{ fontFamily: SANS, fontSize: 24 * k, color: pal.textMuted, marginTop: 4 * k }}>
          {pre}
          {hot && (
            <span style={{ color: pal.textBody, borderBottom: `1.5px solid ${dot}`, paddingBottom: 1 }}>{hot}</span>
          )}
          {post}
        </div>
      </div>
    </div>
  );
};

const FooterLine: React.FC<{ pal: Palette; text: string; at: number; k: number }> = ({ pal, text, at, k }) => {
  const a = useAppearAt(at, 190);
  return (
    <div style={{ fontFamily: MONO, fontSize: 20 * k, letterSpacing: "0.04em", color: pal.textMuted, opacity: a * 0.8, marginLeft: 30 * k }}>
      {text}
    </div>
  );
};

const splitHot = (s: string, hot?: string): [string, string, string] => {
  if (!hot) return [s, "", ""];
  const i = s.toLowerCase().indexOf(hot.toLowerCase());
  if (i < 0) return [s, "", ""];
  return [s.slice(0, i), s.slice(i, i + hot.length), s.slice(i + hot.length)];
};

/* ── the live artifact ───────────────────────────────────────────────────── */

/**
 * A "look" the artifact can be in. Everything that defines a design, in five
 * values — enough to make two looks feel like genuinely different work, few
 * enough that interpolating between them can't produce a broken frame.
 */
export type Look = {
  bg: string;
  ink: string;
  accent: string;
  /** Secondary fill for the bars/lines under the headline. */
  soft: string;
  /** 0 = no decorative disc, 1 = full corner disc. */
  disc?: number;
};

/**
 * The artifact the film is about: an app/preview window whose CONTENT restyles
 * in place.
 *
 * `changes` are in seconds from this component's own start (i.e. from its
 * Sequence's first frame), and each blends over `blend` seconds. Author the
 * change 0.2s AFTER the cursor that causes it acts — see `agents.tsx`.
 *
 * ```tsx
 * <AppWindow pal={PAL} title="launch_v1 — live preview" headline="LAUNCH DAY"
 *   looks={[CREAM, NAVY]} changes={[{ at: 3.4, look: 1 }]} progress={0.6} />
 * ```
 */
export const AppWindow: React.FC<{
  pal: Palette;
  title: string;
  headline: string;
  looks: Look[];
  changes?: { at: number; look: number }[];
  blend?: number;
  /** 0–1 scrubber position, and the timecode it prints. */
  progress?: number;
  timecode?: string;
  /**
   * Seconds (component-local) at which the headline springs in, so an Animator
   * cursor has something to have caused. Omit and it is simply always there.
   */
  headlineFrom?: number;
  /**
   * Seconds at which cue marks appear on the scrubber — the visible result of a
   * Sound agent. Sound is the hardest thing to show in a silent picture, and
   * marks on a timeline is the one honest way: it is what sound design LOOKS
   * like in every editor the audience has ever seen.
   */
  markersFrom?: number;
  markers?: number[];
  width?: number;
  children?: React.ReactNode;
}> = ({
  pal, title, headline, looks, changes = [], blend = 0.45, progress = 0, timecode = "00:15",
  headlineFrom, markersFrom, markers = [0.12, 0.3, 0.47, 0.62, 0.78, 0.9], width = 1020, children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = useK();
  const t = frame / fps;

  const look = blendLooks(looks, changes, t, blend);

  return (
    <div
      style={{
        width: width * k,
        background: pal.surface,
        border: `1px solid ${pal.border}`,
        borderRadius: 16 * k,
        overflow: "hidden",
        boxShadow: `0 ${34 * k}px ${90 * k}px -${30 * k}px ${pal.bgDeep}${alpha(0.35)}`,
      }}
    >
      {/* chrome — deliberately understated */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 * k, padding: `${12 * k}px ${16 * k}px`, borderBottom: `1px solid ${pal.border}` }}>
        {["#E0605A", "#E3B341", "#4FB06B"].map((c) => (
          <span key={c} style={{ width: 9 * k, height: 9 * k, borderRadius: "50%", background: mix(c, pal.surface, 0.45) }} />
        ))}
        <span style={{ fontFamily: MONO, fontSize: 15 * k, color: pal.textMuted, marginLeft: 10 * k, letterSpacing: "0.02em" }}>
          {title}
        </span>
      </div>

      {/* the artwork — this is what restyles */}
      <div
        style={{
          position: "relative",
          height: width * k * 0.5,
          background: look.bg,
          overflow: "hidden",
          padding: `${44 * k}px ${48 * k}px`,
        }}
      >
        {(look.disc ?? 0) > 0.01 && (
          <div
            style={{
              position: "absolute",
              right: -width * k * 0.05,
              top: -width * k * 0.08,
              width: width * k * 0.28 * (look.disc ?? 0),
              height: width * k * 0.28 * (look.disc ?? 0),
              borderRadius: "50%",
              background: look.accent,
            }}
          />
        )}
        <div
          style={{
            fontFamily: HEAD,
            fontWeight: 800,
            fontSize: width * k * 0.072,
            letterSpacing: "-0.05em",
            lineHeight: 0.98,
            color: look.ink,
            maxWidth: "62%",
            opacity: headlineFrom === undefined ? 1 : clamp01((t - headlineFrom) / 0.3),
            translate: headlineFrom === undefined
              ? undefined
              : `0 ${lerp(18, 0, Easing.bezier(0.2, 1, 0.3, 1)(clamp01((t - headlineFrom) / 0.5))) * k}px`,
          }}
        >
          {headline}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 * k, marginTop: 26 * k }}>
          {[0.34, 0.22, 0.28].map((w, i) => (
            <span key={i} style={{ width: `${w * 100}%`, height: 12 * k, borderRadius: 6 * k, background: look.soft }} />
          ))}
        </div>
        {children}
      </div>

      {/* scrubber — the artifact is a VIDEO, and the timeline says so */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 * k, padding: `${12 * k}px ${16 * k}px` }}>
        <div style={{ position: "relative", flex: 1, height: 3 * k, background: pal.border, borderRadius: 2 }}>
          {markersFrom !== undefined &&
            markers.map((m, i) => (
              <span
                key={i}
                style={{
                  position: "absolute",
                  left: `${clamp01(m) * 100}%`,
                  top: -3 * k,
                  width: 2 * k,
                  height: 9 * k,
                  background: look.accent,
                  // Staggered so the marks LAND one after another rather than
                  // appearing as a row — a row is a graphic, a sequence is work.
                  opacity: clamp01((t - markersFrom - i * 0.07) / 0.18),
                }}
              />
            ))}
          <span
            style={{
              position: "absolute",
              left: `${clamp01(progress) * 100}%`,
              top: -5 * k,
              width: 2 * k,
              height: 13 * k,
              background: pal.ink,
            }}
          />
        </div>
        <span style={{ fontFamily: MONO, fontSize: 14 * k, color: pal.textMuted }}>{timecode}</span>
      </div>
    </div>
  );
};

/**
 * The look at time `t`, blended. Exported because a beat often needs to match
 * something ELSE on the frame to the artifact's current state — a chip, a
 * background wash, a wire colour — and they must move together or the restyle
 * looks like it only reached the window.
 */
export const blendLooks = (looks: Look[], changes: { at: number; look: number }[], t: number, blend = 0.45): Look => {
  let cur = looks[0];
  for (const c of [...changes].sort((a, b) => a.at - b.at)) {
    const next = looks[Math.max(0, Math.min(looks.length - 1, c.look))];
    const p = clamp01((t - c.at) / Math.max(0.0001, blend));
    if (p <= 0) break;
    const e = Easing.bezier(0.4, 0, 0.2, 1)(p);
    cur = {
      bg: mix(cur.bg, next.bg, e),
      ink: mix(cur.ink, next.ink, e),
      accent: mix(cur.accent, next.accent, e),
      soft: mix(cur.soft, next.soft, e),
      disc: lerp(cur.disc ?? 0, next.disc ?? 0, e),
    };
  }
  return cur;
};
