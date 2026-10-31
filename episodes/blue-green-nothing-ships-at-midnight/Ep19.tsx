// Author: Bishakh
//
// EP 19 — "Nothing Ships At Midnight."
// Blue-green deployment: build the new stack beside the old one, move the
// traffic, and keep the old one warm.
//
// THE CONSTRUCTION is the station strip (references/station-strip.md), which
// is now five episodes deep and works: one continuous canvas on a serpentine,
// stations instead of slides, LEAD mounting each one before the camera reaches
// it, a continuity chip pinned outside the strip, and a route map at the close.
//
// THE SURFACE IS ENTIRELY NEW, and most of it is the OPPOSITE of EP13–EP18.
// references/ferrari-editorial.md is the brand of record. Four rules, and each
// one is a reflex this kit has to actively suppress:
//
//   1. SHARP 0px CORNERS on every surface. The rest of the playlist is built on
//      12–20px radii. Pill geometry survives in exactly one place — the badge.
//   2. NO DROP SHADOWS, at all. This system documents no shadow tiers: depth is
//      photography, a brightness step (#181818 → #303030), and a 1px hairline.
//      `SHADOW` from lib/cards.tsx is never imported here.
//   3. DISPLAY WEIGHT 500. Never bold. The photography does the visual
//      heavy-lifting, so the type does not compete. `display()` from
//      lib/cards.tsx is the house register and is the wrong brand here.
//   4. NEAR-BLACK #181818, never #000. It carries a slight warmth and pure
//      black reads as a different, cheaper system on sight.
//
// THE ACT BREAK IS THE SYSTEM'S OWN `livery-band` — a full-width Rosso Corsa
// band that WIPES across the frame, holds its chapter title, and wipes off. It
// replaces the white chapter slate EP16–18 overlay. Three of them is the film's
// entire red budget, plus one hero number on the cutover; the system is
// explicit that Rosso Corsa is used scarcely and that scarcity IS the brand.
//
// FOOTAGE IS A DESIGN REQUIREMENT HERE, not a flourish — this system says
// full-bleed cinematic photography IS the depth treatment. Five Kling plates:
// the cold open and end card (the same dark aisle, opening and closing the film
// in one room), the title (two identical rows, one lit and one dark — the
// episode's argument stated photographically before the narration reaches it),
// and two subjectless textures run under the graphics acts as `Ambient`.
//
// BLUE AND GREEN ARE THE SYSTEM'S OWN SEMANTIC TOKENS, not new brand colours:
// `semantic-info #4c98b9` is the live stack and `semantic-success #03904a` is
// the idle one. The pattern is named after two colours and the film has to show
// them; taking them from the brand's documented semantic set instead of
// inventing a palette is what keeps Rosso Corsa scarce.
//
// EVERY FIGURE IS SOURCED OR LABELLED AS ONE SYSTEM'S MEASUREMENT. Documented
// defaults: AWS ALB `deregistration_delay.timeout_seconds` is 300s; Kubernetes
// `terminationGracePeriodSeconds` is 30s. Attributions: blue-green is Humble &
// Farley, Continuous Delivery (2010), after Daniel Terhorst-North;
// expand/contract is Fowler & Sato's ParallelChange (2014). Everything else on
// screen — the 2-hour window, 11,400 in-flight requests, the 4-minute bake, the
// 18-minute overlap — is captioned "this system" and is not offered as fact.

import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Cue, TypeCues } from "../lib/sound";
import { snapUp } from "../lib/tempo";
import { buildPalette } from "../theme";
import { FERRARI, MONO } from "../fonts";
import { useK, useAppearAt, useLoop, lerp, clamp01 } from "../lib/anim";
import { KlingClip, Ambient, hasShot } from "../lib/footage";
import cfg from "../../episode.config.json";
// Its OWN measured lengths, out of its archive. `vo-durations.json` at the repo
// root is a SINGLE SHARED file, so the next episode with fewer lines makes
// `durs[10]` undefined here and this composition's durationInFrames becomes NaN.
import durs from "../../episodes/blue-green-nothing-ships-at-midnight/vo-durations.json";

export const EP19_FPS = 30;
export const PAL19 = buildPalette("ferrari");

const F = (n: number) => Math.round(n * EP19_FPS);

/* ── the tokens ──────────────────────────────────────────────────────────────
 *
 * Straight out of the supplied extract. Named here rather than inlined so the
 * "never introduce another saturated colour" rule is checkable by reading one
 * block instead of grepping the file.
 * ─────────────────────────────────────────────────────────────────────────── */

const CANVAS = "#181818"; // never #000000
const ELEVATED = "#303030"; // cards, panels — the brightness step
const HAIRLINE = "#303030"; // same hex as elevated, by design
const LIGHT = "#FFFFFF"; // editorial light bands only
const HAIRLINE_LIGHT = "#D2D2D2";
const INK = "#FFFFFF";
const BODY = "#969696";
const MUTED = "#666666";
const ON_LIGHT = "#181818";
/** Groove/track colour INSIDE an elevated panel. `HAIRLINE` and `ELEVATED`
 *  are deliberately the same hex in this system, so a track drawn in the
 *  hairline colour on a panel is invisible — every progress channel in the
 *  first cut of this film was a bar with nothing behind it. Grooves step
 *  DOWN to the canvas instead. */
const TRACK = "#181818";

/** The single brand voltage. Three livery bands and one hero number. */
const ROSSO = "#DA291C";

/** The two stacks, from the system's OWN semantic tokens. */
const BLUE = "#4C98B9"; // semantic-info — the live stack
const GREEN = "#03904A"; // semantic-success — the idle stack
const WARN = "#F13A2C"; // semantic-warning

/** The 8px ladder, named. Use these, not ad-hoc pixels. */
const S = { xxxs: 4, xxs: 8, xs: 16, sm: 24, md: 32, lg: 48, xl: 64, xxl: 96, super: 128 };

/* ── the type register ───────────────────────────────────────────────────────
 *
 * ONE family across every text role — the system has no display/body split.
 * Display sizes carry negative tracking; body stays at 0. Weight 500 on every
 * display size, and it is the rule this file exists to not break.
 *
 * MONO is the one deliberate departure, and it is functional rather than
 * stylistic: the extract describes a marketing site with no terminals in it, and
 * a shell transcript set in a proportional face is genuinely harder to read.
 * Mono appears ONLY inside terminal chrome and on file paths.
 * ─────────────────────────────────────────────────────────────────────────── */

const fDisplay = (px: number): React.CSSProperties => ({
  fontFamily: FERRARI,
  fontWeight: 500,
  fontSize: px,
  letterSpacing: `${-px * 0.02}px`,
  lineHeight: 1.08,
});
const fNum = (px: number): React.CSSProperties => ({
  fontFamily: FERRARI,
  fontWeight: 700,
  fontSize: px,
  letterSpacing: `${-px * 0.02}px`,
  lineHeight: 1,
  fontVariantNumeric: "tabular-nums",
  fontFeatureSettings: '"tnum"',
});
const fCaps = (px: number): React.CSSProperties => ({
  fontFamily: FERRARI,
  fontWeight: 600,
  fontSize: px,
  letterSpacing: `${px * 0.1}px`,
  textTransform: "uppercase",
  lineHeight: 1.4,
});
const fBody = (px: number): React.CSSProperties => ({
  fontFamily: FERRARI,
  fontWeight: 400,
  fontSize: px,
  letterSpacing: 0,
  lineHeight: 1.5,
});
const fMono = (px: number): React.CSSProperties => ({
  fontFamily: MONO,
  fontWeight: 400,
  fontSize: px,
  letterSpacing: 0,
  fontVariantNumeric: "tabular-nums",
});

/* ── the schedule ────────────────────────────────────────────────────────────
 *
 * Scene seconds = VO + 0.35s breath, snapped UP to the 84bpm grid, off measured
 * narration lengths. Nothing here is hand-guessed, and re-recording one line
 * re-times every cut, camera key and cue below.
 * ─────────────────────────────────────────────────────────────────────────── */

const BREATH = 0.35;

type BeatDef = { id: string; vo?: number; hold?: number };

const DEFS: BeatDef[] = [
  { id: "open", vo: 1 }, // what the maintenance window costs
  { id: "title", hold: 4.6 }, // ── silent: the bed lifts
  { id: "two", vo: 2 }, // two identical stacks
  { id: "switch", vo: 3 }, // where the switch actually is
  { id: "deploy", vo: 4 }, // deploy into the idle one
  { id: "prove", vo: 5 }, // health + smoke on real infrastructure
  { id: "cut", vo: 6 }, // ← ACT BREAK: move the traffic
  { id: "drain", vo: 7 }, // in-flight requests
  { id: "bake", vo: 8 }, // the three numbers
  { id: "rollback", vo: 9 }, // ← ACT BREAK: the switch you already own
  { id: "database", vo: 10 }, // the part that is neither blue nor green
  { id: "bill", vo: 11 }, // what it costs
  { id: "end", hold: 8.0 }, // ── silent: the bed lifts again
];

const LEN = DEFS.map((d) => (d.vo ? snapUp(durs[d.vo - 1] + BREATH) : snapUp(d.hold ?? 4)));
const START: number[] = [];
DEFS.reduce((acc, _d, i) => {
  START[i] = acc;
  return acc + LEN[i];
}, 0);

const at = (id: string) => START[DEFS.findIndex((d) => d.id === id)];
const len = (id: string) => LEN[DEFS.findIndex((d) => d.id === id)];
const endOf = (id: string) => at(id) + len(id);

export const EP19_SECONDS = START[START.length - 1] + LEN[LEN.length - 1];
export const EP19_DURATION = Math.round(EP19_SECONDS * EP19_FPS);

/** Windows where a line is actually playing — the score ducks against these. */
const VO_WINDOWS = DEFS.map((d, i) =>
  d.vo ? [START[i], START[i] + durs[d.vo - 1]] : null,
).filter(Boolean) as [number, number][];

/* ── the strip ───────────────────────────────────────────────────────────── */

const STRIP_FROM = 2;
const STRIP_IDS = DEFS.slice(STRIP_FROM).map((d) => d.id);
const STRIP_T0 = at(STRIP_IDS[0]);

/* ── THE ROUTE ───────────────────────────────────────────────────────────────
 *
 * Four across, down, three back, down, three across, down to the sign-off. The
 * rows ARE the acts, and each row change is a livery band:
 *
 *   row 0 — the second stack   two · switch · deploy · prove
 *   row 1 — the cutover        cut · drain · bake        (travelling back)
 *   row 2 — what it costs      rollback · database · bill
 *   row 3 — the sign-off       end
 * ─────────────────────────────────────────────────────────────────────────── */

const G = 100;

const ROUTE: Record<string, [number, number]> = {
  two: [0, 0], switch: [1, 0], deploy: [2, 0], prove: [3, 0],
  cut: [3, 1], drain: [2, 1], bake: [1, 1],
  rollback: [1, 2], database: [2, 2], bill: [3, 2],
  end: [3, 3],
};

const cellOf = (id: string) => ROUTE[id] ?? [0, 0];
export const isActBreak = (id: string) => {
  const i = STRIP_IDS.indexOf(id);
  return i > 0 && cellOf(STRIP_IDS[i - 1])[1] !== cellOf(id)[1];
};

type Key = { at: number; x: number; y: number; s: number };

const RIDE: Key[] = [];
STRIP_IDS.forEach((id, i) => {
  const [cx, cy] = cellOf(id);
  const s = at(id);
  if (i === 0) {
    RIDE.push({ at: s, x: cx * G, y: cy * G, s: 1 });
    return;
  }
  const [px, py] = cellOf(STRIP_IDS[i - 1]);
  const down = py !== cy;
  const dur = down ? 1.4 : 0.9;
  RIDE.push({ at: s - dur, x: px * G, y: py * G, s: 1 });
  if (down) {
    RIDE.push({ at: s - dur / 2, x: ((px + cx) / 2) * G, y: ((py + cy) / 2) * G, s: 0.84 });
  }
  RIDE.push({ at: s, x: cx * G, y: cy * G, s: 1 });
});
RIDE.push({ at: endOf("end"), x: cellOf("end")[0] * G, y: cellOf("end")[1] * G, s: 1 });

/* ── the film ────────────────────────────────────────────────────────────── */

export const Ep19: React.FC = () => (
  <AbsoluteFill style={{ background: CANVAS }}>
    <Sequence from={0} durationInFrames={F(len("open"))} name="1 · what the window costs">
      <ColdOpen />
    </Sequence>

    <Sequence from={F(at("title"))} durationInFrames={F(len("title"))} name="2 · title">
      <TitleCard />
    </Sequence>

    <Sequence
      from={F(STRIP_T0)}
      durationInFrames={EP19_DURATION - F(STRIP_T0)}
      name="3–13 · the strip"
    >
      <Strip />
    </Sequence>

    <ReleaseTrail />

    {/* LAST, so the band covers the pinned chip too. */}
    <LiveryBand />

    <Track />
  </AbsoluteFill>
);

/* ── beat 1 — what the maintenance window costs ──────────────────────────────
 *
 * `hero-band-cinema`: the photograph fills the frame edge to edge with zero
 * padding, and the headline floats over the BOTTOM of it. No card, no panel —
 * the system is explicit that the photography IS the chrome, and putting a
 * floating card on top of it is the house habit this episode does not have.
 * ─────────────────────────────────────────────────────────────────────────── */

const ColdOpen: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const fade = (a: number, b: number) =>
    interpolate(frame, [F(a), F(b)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Plate id="ep19_open" push={1.07} />
      {/* The scrim is a bottom-weighted linear ramp, not a radial pool: the
          headline sits in the lower band, so the shade belongs there. */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(24,24,24,0.25) 0%, rgba(24,24,24,0) 34%, rgba(24,24,24,0.72) 76%, rgba(24,24,24,0.94) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: S.super * k,
          right: S.super * k,
          bottom: S.xxl * k,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: S.xl * k,
        }}
      >
        <div style={{ opacity: fade(0.5, 1.1) }}>
          <div style={{ ...fCaps(20 * k), color: BODY }}>the maintenance window</div>
          <div
            style={{
              ...fDisplay(76 * k),
              color: INK,
              marginTop: S.sm * k,
              maxWidth: 980 * k,
              translate: `0 ${interpolate(frame, [F(0.5), F(1.4)], [22, 0], {
                extrapolateLeft: "clamp", extrapolateRight: "clamp",
                easing: Easing.bezier(0.2, 1, 0.3, 1),
              }) * k}px`,
            }}
          >
            Two hours of planned downtime, every release.
          </div>
        </div>
        <WindowCost />
      </div>
    </AbsoluteFill>
  );
};

/**
 * The cost, counting. `spec-cell`: the value in number-display, the label under
 * it in caption-uppercase, transparent background — no card, because a card
 * over a cinematic plate is exactly the depth treatment this system rejects.
 *
 * The clock keeps running for the whole beat rather than resolving, which is
 * both the argument (it is still costing you) and what stops the beat going
 * still after the headline lands.
 */
const WindowCost: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const p = useAppearAt(F(1.2), 220);
  const t = clamp01((frame - F(1.2)) / F(5.2));
  const mins = Math.floor(t * 120);
  return (
    <div style={{ textAlign: "right", opacity: p, flexShrink: 0 }}>
      <div style={{ ...fNum(96 * k), color: INK }}>
        {String(Math.floor(mins / 60)).padStart(2, "0")}:{String(mins % 60).padStart(2, "0")}
      </div>
      <div style={{ ...fCaps(15 * k), color: BODY, marginTop: S.xs * k, whiteSpace: "nowrap" }}>
        offline · this system
      </div>
    </div>
  );
};

/** A graded, slowly pushed Kling plate. Never naked footage. */
const Plate: React.FC<{ id: string; push?: number; startAt?: number }> = ({
  id, push = 1.06, startAt = 0.45,
}) =>
  hasShot(id as never) ? (
    <KlingClip
      id={id as never}
      pal={PAL19}
      startAt={startAt}
      grade={0.42}
      push={push}
      vignette={0.62}
      grain
    />
  ) : (
    <AbsoluteFill style={{ background: CANVAS }} />
  );

/* ── beat 2 — the title ──────────────────────────────────────────────────────
 *
 * The plate is two identical rows with one lit and one dark, so the photograph
 * is already making the episode's argument. The headline sits over the bottom
 * of it in display-mega at weight 500 — no shimmer, no italic serif accent.
 * Those are house devices and this brand does not have them: the accent word
 * carries in Rosso Corsa instead, which is the one place the film spends red
 * outside the livery bands.
 * ─────────────────────────────────────────────────────────────────────────── */

const TitleCard: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const fade = (a: number, b: number) =>
    interpolate(frame, [F(a), F(b)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rise = (a: number, b: number) =>
    interpolate(frame, [F(a), F(b)], [26, 0], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
      easing: Easing.bezier(0.2, 1, 0.3, 1),
    });
  return (
    <AbsoluteFill>
      <Plate id="ep19_title" push={1.05} startAt={0.5} />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(24,24,24,0.4) 0%, rgba(24,24,24,0.1) 30%, rgba(24,24,24,0.78) 74%, rgba(24,24,24,0.96) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: S.super * k,
          right: S.super * k,
          bottom: S.xxl * k,
        }}
      >
        <div style={{ ...fCaps(20 * k), color: BODY, opacity: fade(0.15, 0.6) }}>
          {cfg.series} · {cfg.episode} · Blue-green deployment
        </div>
        <div
          style={{
            ...fDisplay(116 * k),
            color: INK,
            marginTop: S.sm * k,
            opacity: fade(0.4, 0.95),
            translate: `0 ${rise(0.4, 1.2) * k}px`,
          }}
        >
          {cfg.title}{" "}
          <span style={{ color: ROSSO }}>{cfg.titleAccent}</span>
        </div>
        <div
          style={{
            marginTop: S.md * k,
            ...fBody(26 * k),
            color: BODY,
            opacity: fade(1.2, 1.8),
            maxWidth: 1080 * k,
          }}
        >
          {cfg.subtitle}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ── the act break — the LIVERY BAND ─────────────────────────────────────────
 *
 * The system's own `livery-band` component, promoted to the film's chapter
 * device: a full-width Rosso Corsa band that WIPES across the frame, holds its
 * title, and wipes off the other side.
 *
 * It replaces the white wash EP16–18 overlay, and it is better here for a
 * reason that is not taste: on a near-black film a white wash is a flash, and a
 * flash three times in a hundred seconds is an effect. A saturated band moving
 * across the frame is a physical object, it reads at a glance as "new section",
 * and it is the only way this palette can spend its accent at scale without
 * breaking the scarcity rule — a band exists for 1.9 seconds and then is gone.
 *
 * The wipe is authored as ONE clip rect whose two edges move on different
 * clocks: the right edge sweeps out to cover, the left edge sweeps out to
 * reveal. Both use a hard ease so the band arrives with weight rather than
 * drifting in — sharp corners, sharp motion, the same idea twice.
 *
 * Like the slates before it, it costs NO RUNTIME: it is mounted outside the
 * strip and laid over moves the film is already making, and it takes the TAIL
 * of the outgoing beat so it covers a hold rather than covering content.
 * ─────────────────────────────────────────────────────────────────────────── */

const ACTS: { n: number; title: string; kicker: string; at: number; hold: number }[] = [
  { n: 1, title: "The second stack", kicker: "Build it before you need it", at: at("two") - 1.15, hold: 1.75 },
  { n: 2, title: "The cutover", kicker: "Move the traffic, then wait", at: at("cut") - 2.5, hold: 1.8 },
  { n: 3, title: "What it costs", kicker: "The parts that are neither", at: at("rollback") - 2.5, hold: 1.8 },
];

const LiveryBand: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const t = frame / EP19_FPS;

  const IN = 0.34;
  const OUT = 0.44;
  const act = ACTS.find((a) => t >= a.at && t <= a.at + a.hold + OUT);
  if (!act) return null;

  const local = t - act.at;
  const cover = clamp01(local / IN);
  const reveal = clamp01((local - act.hold) / OUT);
  const hard = (p: number) => 1 - Math.pow(1 - p, 3);

  // right edge sweeps out to cover; left edge sweeps out to reveal
  const right = (1 - hard(cover)) * 100;
  const left = hard(reveal) * 100;
  if (left >= 100) return null;

  const textP = clamp01((local - 0.28) / 0.36) * (1 - clamp01((local - act.hold + 0.1) / 0.3));

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          // The one place in the film the red gradient is used, and it is the
          // system's documented accent-band gradient rather than a flat fill.
          background: `linear-gradient(180deg, #A00C01 0%, ${ROSSO} 64%)`,
          clipPath: `inset(0 ${right}% 0 ${left}%)`,
        }}
      />
      <AbsoluteFill
        style={{
          clipPath: `inset(0 ${right}% 0 ${left}%)`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingLeft: S.super * k,
          paddingRight: S.super * k,
        }}
      >
        <div style={{ opacity: textP }}>
          <div style={{ ...fCaps(18 * k), color: "rgba(255,255,255,0.72)" }}>
            {String(act.n).padStart(2, "0")} — {act.kicker}
          </div>
          <div
            style={{
              ...fDisplay(84 * k),
              color: INK,
              marginTop: S.sm * k,
              translate: `0 ${lerp(14, 0, clamp01((local - 0.28) / 0.36)) * k}px`,
            }}
          >
            {act.title}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ── the continuity layer ────────────────────────────────────────────────────
 *
 * ONE release, followed the whole way through, pinned OUTSIDE the strip so no
 * cut can interrupt it. `rel_2f91` is the build id the deploy station types,
 * and every state below is something the film has just said.
 *
 * Sharp corners here too — this is the chip that in EP15–18 was a pill. The
 * badge is the only pill this brand allows, and a continuity chip is not one.
 * ─────────────────────────────────────────────────────────────────────────── */

type TrailState = "idle" | "green" | "live" | "risk" | "done";

const TRAIL: { at: number; label: string; state: TrailState }[] = [
  { at: at("two"), label: "built · not deployed", state: "idle" },
  { at: at("deploy") + 3.0, label: "running on green · 0 traffic", state: "green" },
  { at: at("prove") + 3.6, label: "24 smoke checks passed", state: "green" },
  { at: at("cut") + 3.4, label: "live · serving 100%", state: "live" },
  { at: at("drain") + 3.0, label: "blue draining", state: "risk" },
  { at: at("bake") + 4.0, label: "baked 4:00 · clean", state: "live" },
  { at: at("rollback") + 3.6, label: "blue kept warm", state: "green" },
  { at: at("database") + 4.2, label: "old column dropped", state: "done" },
  { at: at("bill") + 3.4, label: "blue torn down", state: "done" },
];

const TRAIL_COLOR: Record<TrailState, string> = {
  idle: MUTED,
  green: GREEN,
  live: BLUE,
  risk: WARN,
  done: INK,
};

const ReleaseTrail: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const t = frame / EP19_FPS;
  if (t < STRIP_T0 - 0.4 || t > endOf("bill") + 0.6) return null;

  let cur = TRAIL[0];
  let idx = 0;
  TRAIL.forEach((s, i) => {
    if (t >= s.at) { cur = s; idx = i; }
  });
  const tone = TRAIL_COLOR[cur.state];
  const since = clamp01((t - cur.at) / 0.42);
  const inOut = clamp01((t - (STRIP_T0 - 0.4)) / 0.6) * clamp01((endOf("bill") + 0.6 - t) / 0.6);

  return (
    <div
      style={{
        position: "absolute",
        left: S.lg * k,
        bottom: S.lg * k,
        display: "flex",
        alignItems: "center",
        gap: S.xs * k,
        background: ELEVATED,
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 0,
        padding: `${S.xs * k}px ${S.sm * k}px`,
        opacity: inOut,
        pointerEvents: "none",
      }}
    >
      <span
        style={{
          width: 10 * k, height: 10 * k, borderRadius: 0,
          background: tone,
          opacity: 0.5 + 0.5 * since,
          flexShrink: 0,
        }}
      />
      <span style={{ ...fMono(18 * k), color: INK }}>rel_2f91</span>
      <span style={{ ...fMono(16 * k), color: MUTED }}>/</span>
      <span
        style={{
          ...fCaps(14 * k),
          color: tone,
          opacity: 0.4 + 0.6 * since,
          translate: `0 ${lerp(6, 0, since) * k}px`,
          whiteSpace: "nowrap",
        }}
      >
        {cur.label}
      </span>
      <span style={{ ...fMono(13 * k), color: MUTED, marginLeft: S.xxs * k }}>
        {idx + 1}/{TRAIL.length}
      </span>
    </div>
  );
};

/* ── the strip ───────────────────────────────────────────────────────────── */

const Strip: React.FC = () => {
  const frame = useCurrentFrame();
  const abs = STRIP_T0 + frame / EP19_FPS;

  const ride = (pick: (k: Key) => number, easing: (n: number) => number) =>
    interpolate(abs, RIDE.map((r) => r.at), RIDE.map(pick), {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing,
    });

  const x = ride((r) => r.x, Easing.bezier(0.45, 0, 0.15, 1));
  const y = ride((r) => r.y, Easing.bezier(0.45, 0, 0.15, 1));
  const s = ride((r) => r.s, Easing.bezier(0.33, 0, 0.24, 1));

  return (
    // Scale on the OUTER fill, translate on the INNER one. Both on one element
    // scales the offset too and the camera drifts off its station.
    <AbsoluteFill style={{ scale: `${s}` }}>
      <AbsoluteFill style={{ translate: `${-x}% ${-y}%` }}>
        <Station id="two" bg="canvas"><TwoStacks /></Station>
        <Station id="switch" bg="elevated"><SwitchPoint /></Station>
        <Station id="deploy" bg="canvas"><DeployGreen /></Station>
        <Station id="prove" bg="elevated"><Prove /></Station>
        <Station id="cut" bg="charged"><CutOver /></Station>
        <Station id="drain" bg="elevated"><Drain /></Station>
        <Station id="bake" bg="canvas"><Bake /></Station>
        <Station id="rollback" bg="elevated"><Rollback /></Station>
        <Station id="database" bg="light"><Database /></Station>
        <Station id="bill" bg="canvas"><Bill /></Station>
        <Station id="end" bg="plate"><EndCard /></Station>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const LEAD = 1.2;
const bt = (sec: number) => sec + LEAD;

/**
 * True while the camera is close enough to this station for its background to
 * be on screen at all. The travel takes at most 1.4s, so a 2s skirt either side
 * of the station's own beat is comfortably more than the eye can ever see.
 */
const nearCamera = (id: string, abs: number) =>
  abs > at(id) - LEAD - 2 && abs < endOf(id) + 2;

type BgKind = "canvas" | "elevated" | "charged" | "light" | "plate";

const Station: React.FC<{ id: string; bg: BgKind; children: React.ReactNode }> = ({
  id, bg, children,
}) => {
  const frame = useCurrentFrame();
  const abs = STRIP_T0 + frame / EP19_FPS;
  return (
    <div
      style={{
        position: "absolute",
        left: `${cellOf(id)[0] * G}%`,
        top: `${cellOf(id)[1] * G}%`,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* THE VIDEO IS GATED TO THIS STATION'S OWN WINDOW, and that is not an
          optimisation — it is the difference between a render that finishes and
          one that does not.

          `Strip` is a SINGLE Sequence spanning the whole rest of the film, so
          every station's background is mounted on every frame of it. On EP13–18
          those backgrounds were CSS gradients and it cost nothing. Here eight of
          them hold a Kling clip, so an ungated `ActBg` asks the renderer to
          decode eight or nine 1080p videos simultaneously for all 2,900 frames.
          The first attempt at this film ran sixteen minutes, burned six minutes
          of CPU across all of it, and never wrote a frame.

          The camera can only ever see one cell, so outside its own window the
          background collapses to a flat fill and the decoder is never created. */}
      <ActBg kind={bg} atSeconds={abs} live={nearCamera(id, abs)} />
      {/* `position: relative; z-index: 1` is LOAD-BEARING. `ActBg` is an
          AbsoluteFill — a positioned sibling — and CSS paints positioned
          descendants above non-positioned in-flow ones regardless of DOM order.
          Without it, every element that happens not to carry an opacity < 1, a
          transform or a translate paints UNDERNEATH the background and
          vanishes. It looks like a timing bug and it is not. */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Sequence
          from={F(at(id) - STRIP_T0 - LEAD)}
          durationInFrames={F(len(id) + LEAD + 0.4)}
          layout="none"
          name={id}
        >
          {children}
        </Sequence>
      </div>
    </div>
  );
};

/**
 * The value journey, on a film that is near-black almost throughout.
 *
 * The range available is narrow, so it is spent deliberately: photographic at
 * both ends, a brightness step between canvas and elevated across the body, one
 * charged station at the turn, and ONE WHITE EDITORIAL BAND on the database —
 * the system's `hero-band-light`, and the single brightest graphics beat in the
 * film, landing exactly where the argument turns hardest. A near-black film
 * that never leaves near-black has no journey at all.
 *
 * A texture runs under EVERY station, including the plain ones. A field that is
 * only present where it is obvious makes the quiet stations read as a flatter,
 * different film.
 */
const ActBg: React.FC<{ kind: BgKind; atSeconds: number; live: boolean }> = ({ kind, atSeconds, live }) => {
  if (kind === "plate")
    return (
      <AbsoluteFill>
        {live && <Plate id="ep19_end" push={1.08} startAt={0.4} />}
        <AbsoluteFill
          style={{ background: "radial-gradient(70% 62% at 50% 50%, rgba(24,24,24,0.74) 0%, rgba(24,24,24,0.93) 100%)" }}
        />
      </AbsoluteFill>
    );
  if (kind === "light")
    return <AbsoluteFill style={{ background: LIGHT }} />;
  if (kind === "charged")
    return (
      <AbsoluteFill style={{ background: CANVAS }}>
        {live && <Texture id="ep19_tex2" opacity={0.24} />}
        <AbsoluteFill
          style={{ background: "radial-gradient(70% 60% at 50% 50%, rgba(24,24,24,0.1) 0%, rgba(24,24,24,0.82) 100%)" }}
        />
      </AbsoluteFill>
    );
  if (kind === "elevated")
    return (
      <AbsoluteFill style={{ background: "#1F1F1F" }}>
        {live && <Texture id="ep19_tex1" opacity={0.10} />}
      </AbsoluteFill>
    );
  return (
    <AbsoluteFill style={{ background: CANVAS }}>
      {live && <Texture id="ep19_tex1" opacity={0.09} />}
    </AbsoluteFill>
  );
};

const Texture: React.FC<{ id: string; opacity: number }> = ({ id, opacity }) =>
  hasShot(id as never) ? (
    <Ambient id={id as never} pal={PAL19} opacity={opacity} blend="screen" grade={0.8} speed={0.5} />
  ) : null;

/* ── shared surfaces ─────────────────────────────────────────────────────────
 *
 * Every one of these is `#303030` on `#181818` with a 1px `#303030` hairline
 * and ZERO corner radius. No shadow anywhere in this file. That combination is
 * the whole elevation vocabulary the system documents, and it is what makes a
 * frame of these read as one system rather than as a deck.
 * ─────────────────────────────────────────────────────────────────────────── */

const Panel: React.FC<{
  at: number; w?: number; pad?: number; light?: boolean; style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ at: a, w, pad = S.md, light = false, style, children }) => {
  const k = useK();
  const p = useAppearAt(a, 200);
  return (
    <div
      style={{
        background: light ? LIGHT : ELEVATED,
        border: `1px solid ${light ? HAIRLINE_LIGHT : HAIRLINE}`,
        borderRadius: 0,
        padding: pad * k,
        width: w ? w * k : undefined,
        opacity: p,
        translate: `0 ${lerp(12, 0, p) * k}px`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** `spec-cell` — transparent, big number, uppercase caption under it. */
const Spec: React.FC<{
  value: string; label: string; at: number; tone?: string; size?: number; light?: boolean;
}> = ({ value, label, at: a, tone, size = 72, light = false }) => {
  const k = useK();
  const p = useAppearAt(a, 200);
  return (
    <div style={{ opacity: p, translate: `0 ${lerp(10, 0, p) * k}px` }}>
      <div style={{ ...fNum(size * k), color: tone ?? (light ? ON_LIGHT : INK), whiteSpace: "nowrap" }}>
        {value}
      </div>
      <div
        style={{
          ...fCaps(14 * k),
          color: light ? MUTED : BODY,
          marginTop: S.xs * k,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
    </div>
  );
};

/** The station header — the system's `caption-uppercase` over a hairline rule. */
const Head: React.FC<{ n: string; children: React.ReactNode; light?: boolean }> = ({
  n, children, light = false,
}) => {
  const k = useK();
  const p = useAppearAt(2, 200);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: S.sm * k,
        borderBottom: `1px solid ${light ? HAIRLINE_LIGHT : HAIRLINE}`,
        paddingBottom: S.xs * k,
        marginBottom: S.lg * k,
        width: 1560 * k,
        opacity: p,
      }}
    >
      <span style={{ ...fNum(20 * k), color: ROSSO }}>{n}</span>
      <span style={{ ...fCaps(17 * k), color: light ? MUTED : BODY }}>{children}</span>
    </div>
  );
};

const Note: React.FC<{ at: number; light?: boolean; children: React.ReactNode }> = ({
  at: a, light = false, children,
}) => {
  const k = useK();
  const p = useAppearAt(a, 200);
  return (
    <div
      style={{
        marginTop: S.lg * k,
        ...fBody(24 * k),
        color: light ? MUTED : BODY,
        opacity: p,
        translate: `0 ${lerp(8, 0, p) * k}px`,
        width: 1560 * k,
      }}
    >
      {children}
    </div>
  );
};

/** A shell surface. Mono here is functional, not stylistic. */
const Term: React.FC<{
  title: string; lines: { text: string; out?: boolean; hot?: string; cont?: boolean }[];
  at: number; start: number; cps: number; w: number;
}> = ({ title, lines, at: a, start, cps, w }) => {
  const k = useK();
  const frame = useCurrentFrame();
  const p = useAppearAt(a, 200);
  let budget = Math.max(0, ((frame - start) / EP19_FPS) * cps);
  return (
    <div
      style={{
        width: w * k,
        background: "#101010",
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 0,
        opacity: p,
        translate: `0 ${lerp(12, 0, p) * k}px`,
      }}
    >
      <div
        style={{
          borderBottom: `1px solid ${HAIRLINE}`,
          padding: `${S.xs * k}px ${S.sm * k}px`,
          ...fCaps(13 * k),
          color: MUTED,
        }}
      >
        {title}
      </div>
      <div style={{ padding: `${S.sm * k}px ${S.sm * k}px ${S.md * k}px` }}>
        {lines.map((l, i) => {
          const take = Math.min(l.text.length, Math.floor(budget));
          budget -= l.text.length;
          if (take <= 0 && budget < 0) return null;
          const shown = l.text.slice(0, Math.max(0, take));
          const done = take >= l.text.length;
          return (
            <div
              key={i}
              style={{
                ...fMono(21 * k),
                color: l.out ? BODY : INK,
                whiteSpace: "pre",
                lineHeight: 1.65,
              }}
            >
              {!l.out && !l.cont && <span style={{ color: MUTED }}>$ </span>}
              {l.cont && <span style={{ color: "transparent" }}>$ </span>}
              {l.hot && done ? (
                <>
                  {shown.split(l.hot)[0]}
                  <span style={{ color: GREEN }}>{l.hot}</span>
                  {shown.split(l.hot).slice(1).join(l.hot)}
                </>
              ) : (
                shown
              )}
              {!done && take > 0 && <span style={{ color: ROSSO }}>▌</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** The layout every station sits in — 1560px editorial column, left aligned. */
const Bay: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
    {children}
  </div>
);

/* ── beat 3 — two identical stacks ───────────────────────────────────────── */

const TIER = ["edge", "app", "worker"];

const TwoStacks: React.FC = () => {
  const k = useK();
  return (
    <Bay>
      <Head n="01">two identical environments</Head>
      <div style={{ display: "flex", alignItems: "stretch", gap: S.lg * k }}>
        <Router at={F(bt(0.3))} />
        <StackCard name="blue" role="live" tone={BLUE} share={100} at={F(bt(1.0))} />
        <StackCard name="green" role="idle" tone={GREEN} share={0} at={F(bt(1.8))} />
      </div>
      <Note at={F(bt(4.4))}>
        Identical is not similar. Same image digest, same configuration, same
        instance types — or the second stack is a different system wearing the
        same name.
      </Note>
    </Bay>
  );
};

const Router: React.FC<{ at: number }> = ({ at: a }) => {
  const k = useK();
  const t = useLoop(F(2.4));
  return (
    <Panel at={a} w={340} style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <div style={{ ...fCaps(14 * k), color: BODY }}>the switch</div>
      <div style={{ ...fDisplay(34 * k), color: INK, marginTop: S.xs * k }}>load balancer</div>
      <div style={{ ...fMono(17 * k), color: MUTED, marginTop: S.xxs * k }}>listener :443</div>
      <div style={{ marginTop: S.md * k, display: "flex", flexDirection: "column", gap: 6 * k }}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            style={{
              height: 3 * k,
              width: "100%",
              background: (t * 6 + 6 - i) % 6 < 1.4 ? BLUE : TRACK,
            }}
          />
        ))}
      </div>
    </Panel>
  );
};

const StackCard: React.FC<{
  name: string; role: string; tone: string; share: number; at: number;
}> = ({ name, role, tone, share, at: a }) => {
  const k = useK();
  const t = useLoop(F(2.4));
  return (
    <Panel at={a} w={470}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <span style={{ ...fDisplay(34 * k), color: INK }}>{name}</span>
        <Badge tone={tone}>{role}</Badge>
      </div>
      <div style={{ marginTop: S.md * k, display: "flex", flexDirection: "column", gap: S.xxs * k }}>
        {TIER.map((tier, i) => (
          <div
            key={tier}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              border: `1px solid ${HAIRLINE}`, padding: `${S.xs * k}px ${S.xs * k}px`,
              background: CANVAS,
            }}
          >
            <span style={{ ...fMono(18 * k), color: BODY }}>{tier}</span>
            <span style={{ display: "flex", gap: 4 * k }}>
              {[0, 1, 2].map((j) => (
                <span
                  key={j}
                  style={{
                    width: 8 * k, height: 8 * k,
                    background: share > 0 && (t * 3 + 3 - i - j * 0.3) % 3 < 1 ? tone : share > 0 ? `${tone}66` : HAIRLINE,
                  }}
                />
              ))}
            </span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: S.md * k, display: "flex", alignItems: "baseline", gap: S.xs * k }}>
        <span style={{ ...fNum(52 * k), color: share > 0 ? tone : MUTED }}>{share}%</span>
        <span style={{ ...fCaps(13 * k), color: MUTED }}>of live traffic</span>
      </div>
    </Panel>
  );
};

/** The ONE pill in the film — the system reserves pill geometry for badges. */
const Badge: React.FC<{ tone: string; children: React.ReactNode }> = ({ tone, children }) => {
  const k = useK();
  return (
    <span
      style={{
        ...fCaps(12 * k),
        color: tone,
        border: `1px solid ${tone}`,
        borderRadius: 9999,
        padding: `${S.xxxs * k}px ${12 * k}px`,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
};

/* ── beat 4 — where the switch actually is ───────────────────────────────── */

const SWITCHES: { name: string; how: string; time: string; ok: boolean; note: string }[] = [
  { name: "ALB target group", how: "modify-listener", time: "seconds", ok: true, note: "one API call, atomic" },
  { name: "Service selector", how: "kubectl patch svc", time: "seconds", ok: true, note: "endpoints repoint" },
  { name: "DNS record", how: "change A / CNAME", time: "minutes → hours", ok: false, note: "resolvers and runtimes cache past the TTL" },
];

const SwitchPoint: React.FC = () => {
  const k = useK();
  return (
    <Bay>
      <Head n="02">own the switch point</Head>
      <div style={{ display: "flex", flexDirection: "column", gap: S.xxs * k, width: 1560 * k }}>
        {SWITCHES.map((s, i) => (
          <SwitchRow key={s.name} {...s} at={F(bt(0.5)) + i * 16} />
        ))}
      </div>
      <div style={{ display: "flex", gap: S.xl * k, marginTop: S.lg * k }}>
        <Spec value="60s" label="TTL we published" at={F(bt(3.6))} size={56} />
        <Spec value="11 min" label="until the last client moved · this system" at={F(bt(4.4))} size={56} tone={WARN} />
      </div>
      <Note at={F(bt(5.6))}>
        Put the switch somewhere you control end to end. You do not control a
        resolver, and you do not control a client's connection pool.
      </Note>
    </Bay>
  );
};

const SwitchRow: React.FC<{
  name: string; how: string; time: string; ok: boolean; note: string; at: number;
}> = ({ name, how, time, ok, note, at: a }) => {
  const k = useK();
  const p = useAppearAt(a, 200);
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: S.md * k,
        background: ELEVATED, border: `1px solid ${ok ? HAIRLINE : `${WARN}55`}`,
        padding: `${S.sm * k}px ${S.md * k}px`,
        opacity: p, translate: `0 ${lerp(10, 0, p) * k}px`,
      }}
    >
      <span style={{ width: 10 * k, height: 10 * k, background: ok ? GREEN : WARN, flexShrink: 0 }} />
      <span style={{ ...fDisplay(28 * k), color: INK, width: 380 * k }}>{name}</span>
      <span style={{ ...fMono(18 * k), color: MUTED, width: 330 * k }}>{how}</span>
      <span style={{ ...fCaps(15 * k), color: ok ? GREEN : WARN, width: 250 * k }}>{time}</span>
      <span style={{ ...fBody(18 * k), color: BODY, flex: 1, whiteSpace: "nowrap" }}>{note}</span>
    </div>
  );
};

/* ── beat 5 — deploy into the idle one ───────────────────────────────────── */

const DEPLOY_LINES = [
  { text: "deploy --target green --release rel_2f91" },
  { text: "pulling sha256:9c41f0…  ok", out: true },
  { text: "green: 12/12 healthy", out: true, hot: "12/12" },
  { text: "traffic weight  blue 100  green 0", out: true },
];

const WARMUP = ["connection pools", "JIT warm", "page cache", "TLS session tickets"];

const DeployGreen: React.FC = () => {
  const k = useK();
  return (
    <Bay>
      <Head n="03">deploy into the idle stack</Head>
      <div style={{ display: "flex", alignItems: "flex-start", gap: S.lg * k }}>
        <Term
          title="ci · deploy"
          lines={DEPLOY_LINES}
          at={F(bt(0.3))}
          start={F(bt(0.7))}
          cps={54}
          w={940}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: S.sm * k }}>
          <Panel at={F(bt(1.4))} w={560}>
            <div style={{ ...fCaps(13 * k), color: MUTED }}>warming green</div>
            <div style={{ marginTop: S.sm * k, display: "flex", flexDirection: "column", gap: 10 * k }}>
              {WARMUP.map((w, i) => (
                <WarmRow key={w} label={w} at={F(bt(2.0)) + i * 14} />
              ))}
            </div>
          </Panel>
          <Panel at={F(bt(3.4))} w={560}>
            <Spec value="0" label="users affected so far" at={0} size={64} tone={GREEN} />
          </Panel>
        </div>
      </div>
      <Note at={F(bt(5.4))}>
        A cold stack that takes production traffic is a stack that fails under
        it. Warm it while nobody is watching.
      </Note>
    </Bay>
  );
};

const WarmRow: React.FC<{ label: string; at: number }> = ({ label, at: a }) => {
  const k = useK();
  const frame = useCurrentFrame();
  const p = clamp01((frame - a) / F(1.4));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: S.xs * k }}>
      <span style={{ ...fBody(19 * k), color: p > 0.99 ? INK : BODY, width: 280 * k }}>{label}</span>
      <span style={{ flex: 1, height: 6 * k, background: TRACK }}>
        <span style={{ display: "block", height: "100%", width: `${p * 100}%`, background: GREEN }} />
      </span>
      <span style={{ ...fMono(15 * k), color: p > 0.99 ? GREEN : MUTED, width: 60 * k, textAlign: "right" }}>
        {p > 0.99 ? "ok" : `${Math.round(p * 100)}%`}
      </span>
    </div>
  );
};

/* ── beat 6 — prove it on real infrastructure ────────────────────────────── */

const CHECKS = [
  "GET /healthz            200",
  "GET /readyz             200",
  "POST /orders            201",
  "GET /orders/{id}        200",
  "queue consumer          attached",
  "migrations              in sync",
];

const Prove: React.FC = () => {
  const k = useK();
  return (
    <Bay>
      <Head n="04">prove it before anyone sees it</Head>
      <div style={{ display: "flex", alignItems: "flex-start", gap: S.lg * k }}>
        <Panel at={F(bt(0.4))} w={900}>
          <div style={{ ...fCaps(13 * k), color: MUTED }}>
            smoke suite · green.internal · real dependencies
          </div>
          <div style={{ marginTop: S.sm * k, display: "flex", flexDirection: "column" }}>
            {CHECKS.map((c, i) => (
              <CheckRow key={c} label={c} at={F(bt(1.2)) + i * 15} />
            ))}
          </div>
        </Panel>
        <div style={{ display: "flex", flexDirection: "column", gap: S.md * k }}>
          <Spec value="24 / 24" label="checks passed on green" at={F(bt(4.4))} size={62} tone={GREEN} />
          <Spec value="0" label="requests from real users" at={F(bt(5.0))} size={62} />
        </div>
      </div>
      <Note at={F(bt(5.8))}>
        This is the same build, on the same infrastructure, against the same
        database. Staging never tells you this.
      </Note>
    </Bay>
  );
};

const CheckRow: React.FC<{ label: string; at: number }> = ({ label, at: a }) => {
  const k = useK();
  const frame = useCurrentFrame();
  const p = useAppearAt(a, 180);
  const done = frame > a + 10;
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: S.xs * k,
        borderBottom: `1px solid ${HAIRLINE}`, padding: `${11 * k}px 0`,
        opacity: p,
      }}
    >
      <span style={{ width: 8 * k, height: 8 * k, background: done ? GREEN : MUTED, flexShrink: 0 }} />
      <span style={{ ...fMono(20 * k), color: INK, whiteSpace: "pre" }}>{label}</span>
      <span style={{ ...fCaps(12 * k), color: done ? GREEN : MUTED, marginLeft: "auto" }}>
        {done ? "pass" : "…"}
      </span>
    </div>
  );
};

/* ── beat 7 — the cutover (ACT BREAK, the turn) ──────────────────────────────
 *
 * The one beat that earns the film's second spend of Rosso Corsa: the elapsed
 * time is a `race-position-cell`, the system's own component for the number
 * that matters, set in the accent.
 *
 * The switch is authored as a hard THROW rather than a fade — a fast ease over
 * ~0.35s, held either side. The subject of this beat is that the change is
 * instantaneous, so a gentle crossfade would be depicting the opposite of what
 * the narration says.
 * ─────────────────────────────────────────────────────────────────────────── */

const CutOver: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  // the throw: one hard move, at a fixed point in the beat
  const p = clamp01((frame - F(bt(2.6))) / F(0.35));
  const eased = 1 - Math.pow(1 - p, 4);
  const blueShare = Math.round(100 * (1 - eased));
  const greenShare = 100 - blueShare;
  const t = clamp01((frame - F(bt(2.95))) / F(4.0));
  return (
    <Bay>
      <Head n="05">move the traffic</Head>
      <Term
        title="ops · cutover"
        lines={[
          { text: "aws elbv2 modify-listener \\" },
          { text: "  --default-actions TargetGroupArn=$GREEN", hot: "$GREEN", cont: true },
          { text: "listener updated", out: true },
        ]}
        at={F(bt(0.3))}
        start={F(bt(0.7))}
        cps={40}
        w={1000}
      />
      <div style={{ display: "flex", alignItems: "flex-end", gap: S.xxl * k, marginTop: S.lg * k }}>
        <ShareBar blue={blueShare} green={greenShare} />
        <div>
          {/* `race-position-cell` — the one hero number, in Rosso Corsa. */}
          <div style={{ ...fNum(104 * k), color: ROSSO }}>
            {p > 0 ? (t * 4 + 0.4).toFixed(1) : "0.0"}s
          </div>
          <div style={{ ...fCaps(14 * k), color: BODY, marginTop: S.xs * k, whiteSpace: "nowrap" }}>
            since the switch · this system
          </div>
        </div>
      </div>
      <Note at={F(bt(5.2))}>
        Nothing was deployed at this moment. The build has been running for
        minutes — only the routing changed.
      </Note>
    </Bay>
  );
};

const ShareBar: React.FC<{ blue: number; green: number }> = ({ blue, green }) => {
  const k = useK();
  return (
    <div style={{ width: 900 * k }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: S.xs * k }}>
        <span style={{ ...fCaps(14 * k), color: blue > 0 ? BLUE : MUTED }}>blue {blue}%</span>
        <span style={{ ...fCaps(14 * k), color: green > 0 ? GREEN : MUTED }}>green {green}%</span>
      </div>
      <div style={{ display: "flex", height: 56 * k, border: `1px solid ${HAIRLINE}` }}>
        <span style={{ width: `${blue}%`, background: BLUE }} />
        <span style={{ width: `${green}%`, background: GREEN }} />
      </div>
    </div>
  );
};

/* ── beat 8 — let the old stack finish ───────────────────────────────────── */

const Drain: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const t = clamp01((frame - F(bt(0.9))) / F(5.0));
  // a real drain curve: fast at first, then a long tail of slow connections
  const left = Math.round(11400 * Math.pow(1 - t, 2.6));
  return (
    <Bay>
      <Head n="06">let the old stack finish</Head>
      <div style={{ display: "flex", alignItems: "flex-start", gap: S.lg * k }}>
        <Panel at={F(bt(0.4))} w={760}>
          <div style={{ ...fCaps(13 * k), color: MUTED }}>in flight on blue</div>
          <div style={{ ...fNum(96 * k), color: left > 0 ? WARN : GREEN, marginTop: S.xs * k }}>
            {left.toLocaleString("en-US")}
          </div>
          <div style={{ marginTop: S.md * k, height: 10 * k, background: TRACK }}>
            <span
              style={{
                display: "block", height: "100%",
                width: `${(left / 11400) * 100}%`,
                background: left > 0 ? WARN : GREEN,
              }}
            />
          </div>
          <div style={{ ...fCaps(13 * k), color: left > 0 ? WARN : GREEN, marginTop: S.xs * k }}>
            {left > 0 ? "draining" : "blue is idle"}
          </div>
        </Panel>
        <div style={{ display: "flex", flexDirection: "column", gap: S.sm * k }}>
          <DefaultRow
            k1="deregistration_delay"
            k2="AWS ALB default"
            v="300s"
            at={F(bt(2.0))}
          />
          <DefaultRow
            k1="terminationGracePeriodSeconds"
            k2="Kubernetes default"
            v="30s"
            at={F(bt(2.8))}
          />
          <DefaultRow
            k1="longest request observed"
            k2="this system"
            v="41s"
            at={F(bt(3.6))}
            hot
          />
        </div>
      </div>
      <Note at={F(bt(5.2))}>
        Kill blue too early and you drop the requests it is still answering. The
        grace period has to outlast your slowest response.
      </Note>
    </Bay>
  );
};

const DefaultRow: React.FC<{ k1: string; k2: string; v: string; at: number; hot?: boolean }> = ({
  k1, k2, v, at: a, hot = false,
}) => {
  const k = useK();
  const p = useAppearAt(a, 200);
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: S.md * k,
        border: `1px solid ${HAIRLINE}`, background: ELEVATED,
        padding: `${S.sm * k}px ${S.md * k}px`, width: 740 * k,
        opacity: p, translate: `0 ${lerp(10, 0, p) * k}px`,
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ ...fMono(19 * k), color: INK, whiteSpace: "nowrap" }}>{k1}</div>
        <div style={{ ...fCaps(12 * k), color: MUTED, marginTop: 6 * k }}>{k2}</div>
      </div>
      <span style={{ ...fNum(40 * k), color: hot ? WARN : INK }}>{v}</span>
    </div>
  );
};

/* ── beat 9 — the bake ───────────────────────────────────────────────────── */

const Bake: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const t = clamp01((frame - F(bt(0.8))) / F(5.4));
  const secs = Math.round(t * 240);
  return (
    <Bay>
      <Head n="07">watch three numbers</Head>
      <div style={{ display: "flex", alignItems: "stretch", gap: S.sm * k }}>
        <Meter label="error rate" value="0.02%" series={0} at={F(bt(0.5))} good />
        <Meter label="p99 latency" value="214 ms" series={1} at={F(bt(1.1))} good />
        <Meter label="saturation" value="61%" series={2} at={F(bt(1.7))} good />
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: S.xxl * k, marginTop: S.lg * k }}>
        <Spec
          value={`${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`}
          label="bake elapsed · this system"
          at={F(bt(2.4))}
          size={72}
        />
        <Spec value="4:00" label="before blue is torn down" at={F(bt(3.2))} size={72} tone={MUTED} />
      </div>
      <Note at={F(bt(5.0))}>
        The failure you are waiting for is the one that needs traffic to appear.
        Give it longer than feels necessary.
      </Note>
    </Bay>
  );
};

/**
 * A live sparkline, seeded deterministically per series. It never stops, which
 * is what a bake window is — the whole point of the beat is that you are
 * watching something that has not finished.
 */
const Meter: React.FC<{
  label: string; value: string; series: number; at: number; good?: boolean;
}> = ({ label, value, series, at: a, good = true }) => {
  const k = useK();
  const frame = useCurrentFrame();
  const p = useAppearAt(a, 200);
  const N = 44;
  const pts: string[] = [];
  for (let i = 0; i < N; i++) {
    const ph = frame * 0.06 - i * 0.34 + series * 2.1;
    const v =
      0.5 +
      0.19 * Math.sin(ph) +
      0.1 * Math.sin(ph * 2.31 + series) +
      0.05 * Math.sin(ph * 4.7 + series * 3);
    pts.push(`${(i / (N - 1)) * 100},${(1 - v) * 100}`);
  }
  return (
    <div
      style={{
        background: ELEVATED, border: `1px solid ${HAIRLINE}`,
        padding: S.md * k, width: 500 * k,
        opacity: p, translate: `0 ${lerp(12, 0, p) * k}px`,
      }}
    >
      <div style={{ ...fCaps(13 * k), color: MUTED }}>{label}</div>
      <div style={{ ...fNum(48 * k), color: good ? INK : WARN, marginTop: S.xs * k }}>{value}</div>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ width: "100%", height: 90 * k, marginTop: S.sm * k, display: "block" }}
      >
        <polyline
          points={pts.join(" ")}
          fill="none"
          stroke={good ? GREEN : WARN}
          strokeWidth={2.2}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
};

/* ── beat 10 — rollback (ACT BREAK) ──────────────────────────────────────── */

const RollBack: React.FC = () => null;

const Rollback: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  // the flip back, on the same hard throw as the cutover — same gesture, other way
  const p = clamp01((frame - F(bt(2.2))) / F(0.32));
  const eased = 1 - Math.pow(1 - p, 4);
  const blueShare = Math.round(100 * eased);
  return (
    <Bay>
      <Head n="08">rollback is a switch, not a deploy</Head>
      <ShareBar blue={blueShare} green={100 - blueShare} />
      <div style={{ display: "flex", gap: S.sm * k, marginTop: S.lg * k }}>
        <CompareCard
          title="switch back to blue"
          value="11s"
          rows={["one modify-listener call", "blue is still warm", "no build, no image pull"]}
          tone={GREEN}
          at={F(bt(3.0))}
        />
        <CompareCard
          title="redeploy the old version"
          value="9 min"
          rows={["rebuild from the tag", "pull, start, warm", "and it is cold when it lands"]}
          tone={WARN}
          at={F(bt(3.8))}
        />
      </div>
      <Note at={F(bt(5.4))}>
        This only works while blue is still running. The instinct to tear it
        down immediately is the instinct that removes your rollback.
      </Note>
    </Bay>
  );
};

const CompareCard: React.FC<{
  title: string; value: string; rows: string[]; tone: string; at: number;
}> = ({ title, value, rows, tone, at: a }) => {
  const k = useK();
  const p = useAppearAt(a, 200);
  return (
    <div
      style={{
        background: ELEVATED, border: `1px solid ${HAIRLINE}`,
        padding: S.md * k, width: 770 * k,
        opacity: p, translate: `0 ${lerp(12, 0, p) * k}px`,
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <span style={{ ...fDisplay(28 * k), color: INK }}>{title}</span>
        <span style={{ ...fNum(48 * k), color: tone }}>{value}</span>
      </div>
      <div style={{ marginTop: S.sm * k, display: "flex", flexDirection: "column", gap: 8 * k }}>
        {rows.map((r) => (
          <div key={r} style={{ display: "flex", alignItems: "center", gap: S.xs * k }}>
            <span style={{ width: 6 * k, height: 6 * k, background: tone, flexShrink: 0 }} />
            <span style={{ ...fBody(19 * k), color: BODY, whiteSpace: "nowrap" }}>{r}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── beat 11 — the database (the WHITE editorial band) ───────────────────────
 *
 * The system's `hero-band-light`, and the only white frame in the film. It lands
 * on the one station that is not about blue or green at all — the shared thing
 * underneath both — so the value inversion carries the argument rather than
 * decorating it.
 * ─────────────────────────────────────────────────────────────────────────── */

const PHASES: { n: string; name: string; body: string; when: string }[] = [
  { n: "1", name: "Expand", body: "Add the new column. Both versions write to both.", when: "before green ships" },
  { n: "2", name: "Migrate", body: "Backfill the old rows. Nothing reads the new column yet.", when: "while blue serves" },
  { n: "3", name: "Contract", body: "Drop the old column — only once blue is gone for good.", when: "days later, usually" },
];

const Database: React.FC = () => {
  const k = useK();
  return (
    <Bay>
      <Head n="09" light>the part that is neither blue nor green</Head>
      <div style={{ display: "flex", gap: S.sm * k }}>
        {PHASES.map((p, i) => (
          <PhaseCard key={p.n} {...p} at={F(bt(0.6)) + i * 20} />
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: S.xxl * k, marginTop: S.lg * k }}>
        <Spec value="1" label="database, shared by both stacks" at={F(bt(3.4))} size={64} light />
        <Spec value="0" label="schema changes that may break blue" at={F(bt(4.2))} size={64} light tone={ROSSO} />
      </div>
      <Note at={F(bt(5.4))} light>
        Every migration has to work against the old code and the new code at the
        same time. Expand and contract — Fowler and Sato, ParallelChange, 2014.
      </Note>
    </Bay>
  );
};

const PhaseCard: React.FC<{
  n: string; name: string; body: string; when: string; at: number;
}> = ({ n, name, body, when, at: a }) => {
  const k = useK();
  const p = useAppearAt(a, 200);
  return (
    <div
      style={{
        background: LIGHT, border: `1px solid ${HAIRLINE_LIGHT}`,
        padding: S.md * k, width: 505 * k, minHeight: 260 * k,
        opacity: p, translate: `0 ${lerp(12, 0, p) * k}px`,
        display: "flex", flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: S.xs * k }}>
        <span style={{ ...fNum(22 * k), color: ROSSO }}>{n}</span>
        <span style={{ ...fDisplay(32 * k), color: ON_LIGHT }}>{name}</span>
      </div>
      <div style={{ ...fBody(21 * k), color: "#4A4A4A", marginTop: S.sm * k, flex: 1 }}>{body}</div>
      <div style={{ ...fCaps(12 * k), color: MUTED, borderTop: `1px solid ${HAIRLINE_LIGHT}`, paddingTop: S.xs * k }}>
        {when}
      </div>
    </div>
  );
};

/* ── beat 12 — what it costs ─────────────────────────────────────────────── */

const ORPHANS = [
  ["sticky sessions", "pinned to blue's instances"],
  ["local caches", "cold on green, warm on blue"],
  ["in-flight jobs", "started on blue, finishing there"],
  ["cron and consumers", "must run on exactly one stack"],
];

const Bill: React.FC = () => {
  const k = useK();
  return (
    <Bay>
      <Head n="10">then pay for it</Head>
      <div style={{ display: "flex", alignItems: "flex-start", gap: S.lg * k }}>
        <div style={{ display: "flex", flexDirection: "column", gap: S.lg * k }}>
          <div style={{ display: "flex", gap: S.xl * k }}>
            <Spec value="2×" label="production capacity, live at once" at={F(bt(0.5))} size={76} />
            <Spec value="18 min" label="overlap window · this system" at={F(bt(1.2))} size={76} />
          </div>
          <Panel at={F(bt(2.0))} w={880}>
            <div style={{ ...fCaps(13 * k), color: MUTED }}>state that belongs to neither stack</div>
            <div style={{ marginTop: S.sm * k, display: "flex", flexDirection: "column" }}>
              {ORPHANS.map(([a, b], i) => (
                <OrphanRow key={a} label={a} note={b} at={F(bt(2.6)) + i * 16} />
              ))}
            </div>
          </Panel>
        </div>
        <Panel at={F(bt(1.6))} w={600}>
          <div style={{ ...fCaps(13 * k), color: MUTED }}>the trade</div>
          <div style={{ ...fDisplay(34 * k), color: INK, marginTop: S.sm * k, lineHeight: 1.3 }}>
            You are buying a rollback you can perform in eleven seconds.
          </div>
          <div style={{ ...fBody(20 * k), color: BODY, marginTop: S.md * k }}>
            Whether that is worth twice the infrastructure for eighteen minutes
            is a question about your release, not about the pattern.
          </div>
          <div
            style={{
              ...fCaps(12 * k), color: MUTED, marginTop: S.md * k,
              borderTop: `1px solid ${HAIRLINE}`, paddingTop: S.xs * k,
            }}
          >
            Humble &amp; Farley, Continuous Delivery, 2010
          </div>
        </Panel>
      </div>
    </Bay>
  );
};

const OrphanRow: React.FC<{ label: string; note: string; at: number }> = ({ label, note, at: a }) => {
  const k = useK();
  const p = useAppearAt(a, 200);
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: S.md * k,
        borderBottom: `1px solid ${HAIRLINE}`, padding: `${13 * k}px 0`,
        opacity: p,
      }}
    >
      <span style={{ width: 7 * k, height: 7 * k, background: ROSSO, flexShrink: 0, opacity: 0.7 }} />
      <span style={{ ...fBody(21 * k), color: INK, width: 320 * k }}>{label}</span>
      <span style={{ ...fBody(19 * k), color: BODY, whiteSpace: "nowrap" }}>{note}</span>
    </div>
  );
};

/* ── beat 13 — the end card ──────────────────────────────────────────────── */

const MAP_LABELS: Record<string, string> = {
  two: "two stacks", switch: "the switch", deploy: "deploy green", prove: "prove it",
  cut: "cut over", drain: "drain blue", bake: "the bake",
  rollback: "rollback", database: "the database", bill: "the bill",
};

const EndCard: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const fade = (a: number, b: number) =>
    interpolate(frame, [F(a), F(b)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const SIGN = 3.4;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ opacity: fade(0.2, 0.8) * (1 - 0.9 * fade(SIGN - 0.5, SIGN + 0.4)) }}>
        <RouteMap />
      </div>
      <div
        style={{
          position: "absolute",
          left: S.super * k,
          right: S.super * k,
          bottom: S.xxl * k,
        }}
      >
        <div
          style={{
            ...fDisplay(84 * k), color: INK, opacity: fade(SIGN, SIGN + 0.5),
            translate: `0 ${interpolate(frame, [F(SIGN), F(SIGN + 0.7)], [22, 0], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
              easing: Easing.bezier(0.2, 1, 0.3, 1),
            }) * k}px`,
          }}
        >
          Thanks for watching.
        </div>
        <div
          style={{
            width: interpolate(frame, [F(SIGN + 0.6), F(SIGN + 2.2)], [0, 420 * k], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
              easing: Easing.bezier(0.25, 0, 0.15, 1),
            }),
            height: 3 * k, background: ROSSO, marginTop: S.md * k,
          }}
        />
        <div
          style={{
            marginTop: S.md * k, ...fDisplay(32 * k), color: INK,
            opacity: fade(SIGN + 1.0, SIGN + 1.5),
          }}
        >
          Bishakh
        </div>
        <div
          style={{
            marginTop: S.xs * k, ...fCaps(16 * k), color: BODY,
            opacity: fade(SIGN + 1.5, SIGN + 2.0),
          }}
        >
          {cfg.next}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const RouteMap: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const ids = STRIP_IDS.filter((id) => id !== "end");
  const CW_ = 290, CH_ = 150;
  const pts = ids.map((id) => {
    const [cx, cy] = cellOf(id);
    return { id, x: cx * CW_ + CW_ / 2, y: cy * CH_ + CH_ / 2 };
  });
  const W = 4 * CW_, H = 3 * CH_;
  const drawn = clamp01((frame - F(0.5)) / F(2.2));
  const lit = drawn * ids.length;
  const d = pts.map((p, i) => `${i ? "L" : "M"} ${p.x} ${p.y}`).join(" ");

  return (
    <div style={{ position: "relative", width: W * k, height: H * k }}>
      <svg
        width={W * k} height={H * k} viewBox={`0 0 ${W} ${H}`}
        style={{ position: "absolute", inset: 0, overflow: "visible" }}
      >
        <path d={d} fill="none" stroke={HAIRLINE} strokeWidth={2} />
        <path
          d={d} fill="none" stroke={ROSSO} strokeWidth={2.6}
          pathLength={1} strokeDasharray={1} strokeDashoffset={1 - drawn}
        />
      </svg>
      {pts.map((p, i) => {
        const on = i < lit;
        return (
          <div
            key={p.id}
            style={{
              position: "absolute", left: p.x * k, top: p.y * k, translate: "-50% -50%",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 7 * k,
              opacity: on ? 1 : 0.3,
            }}
          >
            {/* Square, not a dot. Sharp geometry is the brand. */}
            <span
              style={{
                width: 10 * k, height: 10 * k,
                background: on ? INK : MUTED,
              }}
            />
            <span style={{ ...fNum(14 * k), color: MUTED }}>{String(i + 1).padStart(2, "0")}</span>
            <span style={{ ...fCaps(11 * k), color: on ? INK : MUTED, whiteSpace: "nowrap" }}>
              {MAP_LABELS[p.id]}
            </span>
          </div>
        );
      })}
    </div>
  );
};

/* ── the mix ─────────────────────────────────────────────────────────────── */

const OPEN = 0.34;
const UNDER = 0.15;
const HAS_VO = Boolean(cfg.audio?.vo);

const bedVolume = (f: number) => {
  const t = f / EP19_FPS;
  const ramp = 0.55;
  let v = OPEN;
  if (HAS_VO) {
    for (const [a, b] of VO_WINDOWS) {
      if (t > a - ramp && t < b + ramp) {
        const into = clamp01((t - (a - ramp)) / ramp);
        const outOf = clamp01((b + ramp - t) / ramp);
        v = Math.min(v, lerp(OPEN, UNDER, Math.min(into, outOf)));
      }
    }
  }
  const head = clamp01(t / 1.2);
  const tail = clamp01((EP19_SECONDS - t) / 1.6);
  return v * head * tail;
};

const Track: React.FC = () => (
  <>
    {cfg.audio?.music && (
      <Sequence from={0} durationInFrames={EP19_DURATION} layout="none" name="score">
        <Audio src={staticFile("audio/music/bed.mp3")} volume={bedVolume} />
      </Sequence>
    )}

    {HAS_VO &&
      DEFS.map((d, i) =>
        d.vo ? (
          <Sequence key={d.id} from={F(START[i])} layout="none" name={`vo ${d.vo}`}>
            <Audio src={staticFile(`audio/vo/scene${d.vo}.mp3`)} volume={1} />
          </Sequence>
        ) : null,
      )}

    {/* the travel */}
    {STRIP_IDS.map((id) =>
      isActBreak(id) ? (
        <React.Fragment key={id}>
          <Cue name="riser" at={F(at(id) - 1.35)} volume={0.24} />
          <Cue name="thunk" at={F(at(id) - 0.06)} volume={0.3} />
        </React.Fragment>
      ) : (
        <Cue key={id} name="whoosh" at={F(at(id) - 0.25)} volume={0.2} />
      ),
    )}

    {/* the livery bands — a hard swipe in, a softer one out */}
    {ACTS.map((a) => (
      <React.Fragment key={a.n}>
        <Cue name="swipe" at={F(a.at)} volume={0.34} />
        <Cue name="thunk" at={F(a.at + 0.3)} volume={0.3} />
        <Cue name="latch" at={F(a.at + 0.62)} volume={0.22} />
        <Cue name="swipe" at={F(a.at + a.hold)} volume={0.24} />
      </React.Fragment>
    ))}

    <Cue name="sub" at={F(at("open") + 1.2)} volume={0.3} />
    <Cue name="thunk" at={F(at("title") + 0.4)} volume={0.32} />

    {/* 01 — the two stacks landing */}
    {[0.3, 1.0, 1.8].map((s, i) => (
      <Cue key={`s${i}`} name="tick" at={F(at("two") + bt(s))} volume={0.22} />
    ))}
    {/* 02 — three rows, then the DNS verdict */}
    {[0, 1, 2].map((i) => (
      <Cue key={`sw${i}`} name="tick" at={F(at("switch") + bt(0.5)) + i * 16} volume={0.2} />
    ))}
    <Cue name="error" at={F(at("switch") + bt(4.4))} volume={0.28} />
    {/* 03 — the deploy typing, then four warm-ups completing */}
    <TypeCues text={DEPLOY_LINES[0].text} start={F(at("deploy") + bt(0.7))} cps={54} volume={0.16} max={26} />
    {[0, 1, 2, 3].map((i) => (
      <Cue key={`w${i}`} name="blip" at={F(at("deploy") + bt(3.4) + i * 0.47)} volume={0.18} />
    ))}
    {/* 04 — six checks passing */}
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <Cue key={`c${i}`} name="tick" at={F(at("prove") + bt(1.2)) + i * 15 + 10} volume={0.2} />
    ))}
    <Cue name="success" at={F(at("prove") + bt(4.4))} volume={0.3} />
    {/* 05 — the throw. One hard sound, because it is one hard move. */}
    <TypeCues text="aws elbv2 modify-listener" start={F(at("cut") + bt(0.7))} cps={40} volume={0.16} max={22} />
    <Cue name="thunk" at={F(at("cut") + bt(2.6))} volume={0.42} />
    <Cue name="success" at={F(at("cut") + bt(2.9))} volume={0.3} />
    {/* 06 — the drain emptying */}
    {Array.from({ length: 6 }).map((_, i) => (
      <Cue
        key={`d${i}`}
        name="blip"
        at={F(at("drain") + bt(0.9) + (1 - Math.pow(1 - (i + 1) / 6, 1 / 2.6)) * 5.0)}
        volume={0.14}
      />
    ))}
    <Cue name="success" at={F(at("drain") + bt(6.0))} volume={0.26} />
    {/* 07 — three meters */}
    {[0.5, 1.1, 1.7].map((s, i) => (
      <Cue key={`m${i}`} name="tick" at={F(at("bake") + bt(s))} volume={0.22} />
    ))}
    {/* 08 — the flip back, same gesture as the cutover */}
    <Cue name="thunk" at={F(at("rollback") + bt(2.2))} volume={0.4} />
    <Cue name="success" at={F(at("rollback") + bt(3.0))} volume={0.26} />
    <Cue name="error" at={F(at("rollback") + bt(3.8))} volume={0.22} />
    {/* 09 — three phases, on the white band */}
    {[0, 1, 2].map((i) => (
      <Cue key={`p${i}`} name="latch" at={F(at("database") + bt(0.6)) + i * 20} volume={0.24} />
    ))}
    {/* 10 — the bill */}
    <Cue name="sub" at={F(at("bill") + bt(0.5))} volume={0.28} />
    {[0, 1, 2, 3].map((i) => (
      <Cue key={`o${i}`} name="tick" at={F(at("bill") + bt(2.6)) + i * 16} volume={0.18} />
    ))}
    <Cue name="thunk" at={F(at("end") + 0.3)} volume={0.34} />
  </>
);

void RollBack;
