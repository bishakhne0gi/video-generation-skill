// Author: Bishakh
//
// EP 20 — "Read the Label. Open the Book."
// Agent skills and agent memory: both are an index in context and a payload on
// disk, and the whole craft is knowing which half you are paying for.
//
// THE CONSTRUCTION is EP 16's and EP 18's, unchanged: one continuous canvas the
// camera travels on a serpentine, stations instead of slides, one stroke-icon
// family, real product panels, the box pattern, two overlaid act slates, and a
// continuity chip pinned outside the strip. Same palette too — `stripe-mesh`,
// white canvas, deep-navy ink, indigo #533AFD as the single filled hue.
//
// TWO THINGS ARE THIS EPISODE'S OWN.
//
// 1. THE FIELD is `MeshField` (lib/gradient.tsx), new for this film. EP18's
//    ribbon is BANDED — hard edges that cut through a diagram, which is why it
//    had to be cropped to a top band anywhere content had to stay readable.
//    This is the same brand hues as five wide overlapping lobes with no edge
//    anywhere, each on its own incommensurate clock (13.7 / 19.3 / 23.1 / 17.9
//    / 29.3s) so the field never returns to a configuration it has been in. It
//    runs under EVERY station at a different intensity, which is what makes the
//    value journey a continuous surface rather than five different backgrounds.
//
// 2. THE DECK is the director's supplied stacked drag-carousel (shadcn/motion,
//    `carousel-07`), ported. See `SkillDeck` for what was kept verbatim and the
//    one thing that had to change. It is not decoration: a stack where every
//    card is present and exactly one is in the frame at full resolution IS
//    progressive disclosure, so the motif carries the argument.
//
// THE FILM BREATHES IN VALUE, per act: the mesh at full depth on the open and
// title, tinted white across the skills act, cool canvas-soft and one true-dark
// station through the memory act, then back to full depth to sign off.
//
// EVERY FIGURE IS MEASURED ON THIS MACHINE AND THE FILM SAYS SO ON SCREEN.
// 113 SKILL.md files under ~/.claude; 37,337 tokens of frontmatter, which is
// always in context; 277,907 tokens of bodies, loaded only on a match; 942
// bundled level-three files at ~1,395,306 tokens, loaded only when a body asks.
// 1,710,550 all in, against the 1,000,000-token window this session runs on.
// The self-referential figure is this very skill: 227 tokens of label against
// 14,762 of body — 65x — and 205,378 further tokens in its references.

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
import { Thread } from "../lib/motifs";
import { snapUp } from "../lib/tempo";
import { buildPalette } from "../theme";
import { SANS, SERIF, GEIST, HEAD, MONO } from "../fonts";
import { useK, useAppearAt, useLoop, lerp, clamp01 } from "../lib/anim";
import {
  MeshField,
  Grain,
  MESH_AZURE,
  MESH_AZURE_DEEP,
} from "../lib/gradient";
import {
  ShimmerText,
  GridPlate,
  R,
  SHADOW,
  display,
  tabular,
  microCap,
} from "../lib/cards";
import cfg from "../../episode.config.json";
// Its OWN measured lengths. `vo-durations.json` at the repo root is a SINGLE
// SHARED file, so the next episode with fewer lines makes `durs[8]` undefined
// here and this composition's durationInFrames becomes NaN — a hard render
// failure in a film nobody touched. A published episode keeps rebuilding to
// the cut that shipped.
import durs from "../../episodes/read-the-label-open-the-book/vo-durations.json";

export const EP20_FPS = 30;
export const PAL20 = buildPalette("stripe-mesh");

const F = (n: number) => Math.round(n * EP20_FPS);

// Every panel in this film is this black. Not a tone per component, not a
// coloured edge to tell them apart — the CONTENT tells them apart.
const PANEL = "#0B0E14";
const ON = "#FFFFFF";
const ON_DIM = "rgba(255,255,255,0.45)";

/**
 * Indigo is the SKILLS half and it is the brand's one filled hue. Memory gets
 * EP16's and EP18's second hue unchanged, which is deliberate series
 * continuity: the cool teal meant "the downstream, derived, eventually-true
 * half" in both, and that is exactly what memory is here. Red is stale, green
 * is verified.
 *
 * The field's own #78B8F9 and #4D2FF9 are NOT in this list and never fill
 * anything — same rule stripe-mesh applies to ruby and magenta.
 */
const MEM = "#22B8CF";
const BAD = "#C0123C";
const OK = "#0F9D58";

/* ── the measured numbers ────────────────────────────────────────────────────
 *
 * Counted on this machine, not quoted. Every place one of these appears on
 * screen it is captioned as a measurement of this install.
 * ─────────────────────────────────────────────────────────────────────────── */

const N_SKILLS = 113;
const TOK_L1 = 37_337; // every name + description — always in context
const TOK_L2 = 277_907; // every SKILL.md body — loaded on a match
const TOK_L3 = 1_395_306; // 942 bundled files — loaded when a body asks
const TOK_ALL = TOK_L1 + TOK_L2 + TOK_L3; // 1,710,550
const WINDOW = 1_000_000; // the context window this session runs on

/* ── the schedule ────────────────────────────────────────────────────────────
 *
 * Scene seconds = VO + 0.35s breath, snapped UP to the 84bpm grid, off measured
 * narration lengths. Nothing here is hand-guessed, and re-recording a line
 * re-times every cut, camera key and cue below.
 * ─────────────────────────────────────────────────────────────────────────── */

const BREATH = 0.35;

type BeatDef = { id: string; vo?: number; hold?: number };

const DEFS: BeatDef[] = [
  { id: "open", vo: 1 }, // it does not fit
  { id: "title", hold: 4.6 }, // ── silent: the bed lifts
  { id: "deck", vo: 2 }, // THE DECK — labels, not books
  { id: "label", vo: 3 }, // the anatomy of one SKILL.md
  { id: "match", vo: 4 }, // one description wins
  { id: "deeper", vo: 5 }, // level three, on demand
  { id: "memory", vo: 6 }, // ← ACT BREAK: the other half
  { id: "recall", vo: 7 }, // one fact per file, one index line
  { id: "stale", vo: 8 }, // the memory that went wrong
  { id: "divide", vo: 9 }, // sort it before you save it
  { id: "end", hold: 7.5 }, // ── silent: the bed lifts again
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

export const EP20_SECONDS = START[START.length - 1] + LEN[LEN.length - 1];
export const EP20_DURATION = Math.round(EP20_SECONDS * EP20_FPS);

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
 * Four across, down, four back, down to the sign-off. Two kinds of move, which
 * at this length is the whole transition budget:
 *
 *   ACROSS (six legs) — 0.9s, flat and quick.
 *   DOWN (two legs) — 1.4s, and the camera LIFTS to 0.84 at the midpoint.
 *
 * The rows ARE the acts:
 *   row 0 — what it can do    deck · label · match · deeper
 *   row 1 — what it remembers  memory · recall · stale · divide  (travelling back)
 *   row 2 — the sign-off       end
 * ─────────────────────────────────────────────────────────────────────────── */

const G = 100; // one cell = one frame, in %

const ROUTE: Record<string, [number, number]> = {
  deck: [0, 0], label: [1, 0], match: [2, 0], deeper: [3, 0],
  memory: [3, 1], recall: [2, 1], stale: [1, 1], divide: [0, 1],
  end: [0, 2],
};

const cellOf = (id: string) => ROUTE[id] ?? [0, 0];
/** True when arriving at `id` means changing act — the two lift moves. */
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
    // the lift — the only place the camera ever changes scale
    RIDE.push({ at: s - dur / 2, x: ((px + cx) / 2) * G, y: ((py + cy) / 2) * G, s: 0.84 });
  }
  RIDE.push({ at: s, x: cx * G, y: cy * G, s: 1 });
});
RIDE.push({ at: endOf("end"), x: cellOf("end")[0] * G, y: cellOf("end")[1] * G, s: 1 });

/* ── the film ────────────────────────────────────────────────────────────── */

export const Ep20: React.FC = () => (
  <AbsoluteFill style={{ background: PAL20.bg, fontFeatureSettings: '"ss01"' }}>
    <Sequence from={0} durationInFrames={F(len("open"))} name="1 · it does not fit">
      <ColdOpen />
    </Sequence>

    <Sequence from={F(at("title"))} durationInFrames={F(len("title"))} name="2 · title">
      <TitleCard />
    </Sequence>

    <Sequence
      from={F(STRIP_T0)}
      durationInFrames={EP20_DURATION - F(STRIP_T0)}
      name="3–11 · the strip"
    >
      <Strip />
    </Sequence>

    <Thread pal={PAL20} from={STRIP_T0} to={endOf("divide")} />
    <SkillTrail />

    {/* LAST, so the wash covers the pinned chip and the thread too. */}
    <ActSlate />

    <Track />
  </AbsoluteFill>
);

/* ── the field ───────────────────────────────────────────────────────────────
 *
 * Wired once so every use of it in the film is the same object on the same
 * clock. `atSeconds` is threaded through from the station so the five lobes
 * drift continuously across the whole episode instead of restarting at each
 * stop — which is the entire reason the film reads as one surface travelled
 * rather than nine backgrounds visited.
 * ─────────────────────────────────────────────────────────────────────────── */

const Mesh: React.FC<{
  atSeconds?: number;
  intensity?: number;
  deep?: boolean;
  base?: string;
  grain?: number;
}> = ({ atSeconds, intensity = 1, deep = false, base, grain = 30 }) => (
  <MeshField
    lobes={deep ? MESH_AZURE_DEEP : MESH_AZURE}
    base={base ?? PAL20.bg}
    intensity={intensity}
    grain={grain}
    grainBlend={deep ? "overlay" : "multiply"}
    atSeconds={atSeconds}
  />
);

/**
 * The shimmer, in this film's own hues. The component's defaults are cream,
 * sherbet and magenta — DESIGN.md's mesh, correct on EP15/16 and visibly wrong
 * on an azure field.
 */
const SHIMMER = ["#FFFFFF", "#D3E6FD", "#78B8F9", "#A8C0FF", "#FFFFFF"];

/**
 * A soft pool of shade under centred white type. The deep mesh runs from pale
 * lavender to #3B23D6 across the frame, so any FIXED text colour is illegible
 * somewhere on it; picking a grey that survives both ends just means picking
 * grey.
 */
const Scrim: React.FC<{ strength?: number }> = ({ strength = 0.34 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(64% 48% at 50% 52%, rgba(6,10,40,${strength}) 0%, rgba(6,10,40,0) 74%)`,
    }}
  />
);

/* ── beat 1 — it does not fit ────────────────────────────────────────────────
 *
 * The whole episode's premise as ONE instrument: a track scaled so the context
 * window is a fixed landmark, and the three levels of the skill set stacked
 * along it. Level one is a sliver. Level two is affordable. Level three runs
 * clean off the end of the window and keeps going past the edge of the panel.
 *
 * That overflow is the argument, and it is why this beat is an instrument
 * rather than a figure on a card: a number that is bigger than another number
 * has to be READ, a bar that leaves the frame is understood.
 * ─────────────────────────────────────────────────────────────────────────── */

const ColdOpen: React.FC = () => {
  const k = useK();
  return (
    <AbsoluteFill>
      <Mesh deep intensity={1} grain={40} />
      <Scrim strength={0.34} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <FitMeter />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Window = 900 design units. Everything else is drawn to that same scale. */
const MW = 900;
const PX = MW / WINDOW; // design units per token

const FitMeter: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const p = useAppearAt(F(0.3), 190);
  // The three levels fill in sequence, so the beat delivers across its length
  // rather than arriving as one block. The third one is still growing when the
  // narration reaches "against a window that holds one".
  const g = (a: number, b: number) =>
    clamp01((frame - F(a)) / F(b - a));
  const f1 = g(1.0, 1.5);
  const f2 = g(1.6, 2.6);
  const f3 = g(2.8, 5.2);
  const shown = TOK_L1 * f1 + TOK_L2 * f2 + TOK_L3 * f3;
  const over = shown > WINDOW;
  return (
    <div
      style={{
        background: PANEL,
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: R.lg * k,
        padding: `${40 * k}px ${48 * k}px ${44 * k}px`,
        boxShadow: SHADOW[3],
        opacity: p,
        transform: `scale(${lerp(0.95, 1, p)})`,
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 18 * k }}>
        <span
          style={{
            ...display(104 * k, -0.045),
            fontWeight: 300,
            color: over ? BAD : ON,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {Math.round(shown).toLocaleString("en-US")}
        </span>
        <span style={{ ...microCap(19 * k), color: ON_DIM, whiteSpace: "nowrap" }}>
          tokens of skills · measured on this machine
        </span>
      </div>

      {/* the track. The window is a FIXED landmark on it, so the overflow is
          visible as distance rather than as a comparison the viewer has to do. */}
      <div style={{ position: "relative", width: 1420 * k, height: 132 * k, marginTop: 34 * k }}>
        {/* THE TRACK IS THE WINDOW — it stops at 1,000,000 and not at the panel
            edge. That is the whole instrument: a groove the bar is supposed to
            fit inside, and a bar that leaves it. Drawn to the full panel width
            instead, the overflow becomes a comparison the viewer has to make
            between two numbers rather than a distance they can see. */}
        <div
          style={{
            position: "absolute", left: 0, top: 44 * k, width: MW * k, height: 44 * k,
            borderRadius: 6 * k, background: "rgba(255,255,255,0.06)",
          }}
        />
        {/* the three levels, stacked left to right at one scale */}
        {([
          [0, TOK_L1 * f1, PAL20.accent, "labels"],
          [TOK_L1 * f1, TOK_L2 * f2, "#78B8F9", "bodies"],
          [TOK_L1 * f1 + TOK_L2 * f2, TOK_L3 * f3, MEM, "bundled files"],
        ] as [number, number, string, string][]).map(([off, wTok, hue], i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: off * PX * k,
              top: 44 * k,
              width: wTok * PX * k,
              height: 44 * k,
              background: hue,
              // The last segment is the one that leaves the panel, and it is
              // SQUARE on its right edge. A rounded cap floating on the field
              // past the card reads as the bar ending there; a cut edge reads
              // as it continuing past the frame, which is the true statement.
              borderRadius: i === 2 ? `${6 * k}px 0 0 ${6 * k}px` : 6 * k,
            }}
          />
        ))}
        {/* the window edge — the landmark everything is measured against */}
        <div
          style={{
            position: "absolute", left: MW * k, top: 26 * k, width: 3 * k, height: 80 * k,
            background: "#FFFFFF",
          }}
        />
        <span
          style={{
            position: "absolute", left: MW * k, top: 0, translate: "-50% 0",
            ...microCap(15 * k), color: "#FFFFFF", whiteSpace: "nowrap",
          }}
        >
          1,000,000 · the window
        </span>
        <span
          style={{
            position: "absolute", left: MW * k, top: 112 * k, translate: "-50% 0",
            ...microCap(14 * k), color: over ? BAD : "rgba(255,255,255,0.3)",
            whiteSpace: "nowrap",
          }}
        >
          {over ? "everything right of here does not fit" : ""}
        </span>
      </div>

      <div style={{ display: "flex", gap: 14 * k, marginTop: 30 * k }}>
        <LevelKey hue={PAL20.accent} n={TOK_L1} label="always in context" on={f1 > 0} />
        <LevelKey hue="#78B8F9" n={TOK_L2} label="loaded on a match" on={f2 > 0} />
        <LevelKey hue={MEM} n={TOK_L3} label="loaded on demand" on={f3 > 0} />
      </div>
    </div>
  );
};

const LevelKey: React.FC<{ hue: string; n: number; label: string; on: boolean }> = ({
  hue, n, label, on,
}) => {
  const k = useK();
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 12 * k,
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: R.md * k,
        padding: `${12 * k}px ${18 * k}px`,
        opacity: on ? 1 : 0.3,
        flex: 1,
      }}
    >
      <span style={{ width: 11 * k, height: 11 * k, borderRadius: 3 * k, background: hue, flexShrink: 0 }} />
      <span style={{ ...tabular(21 * k), color: ON, whiteSpace: "nowrap" }}>
        {n.toLocaleString("en-US")}
      </span>
      <span style={{ ...microCap(14 * k), color: ON_DIM, whiteSpace: "nowrap" }}>{label}</span>
    </div>
  );
};

/* ── beat 2 — the title ──────────────────────────────────────────────────── */

const TitleCard: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const fade = (a: number, b: number) =>
    interpolate(frame, [F(a), F(b)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rise = (a: number, b: number) =>
    interpolate(frame, [F(a), F(b)], [30, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.2, 1, 0.3, 1),
    });
  return (
    <AbsoluteFill>
      <Mesh deep intensity={1} grain={40} />
      {/* 0.42, not 0.3. This is the only beat with large white type and no
          panel under it, and the deep mesh runs pale through its upper middle —
          which is exactly where the headline sits. The scrim is what gives both
          the headline and the shimmer band something to read against. */}
      <Scrim strength={0.42} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ ...microCap(24 * k), color: "rgba(255,255,255,0.8)", opacity: fade(0.15, 0.6) }}>
          {cfg.series} · {cfg.episode} · SKILLS &amp; MEMORY
        </div>
        <div
          style={{
            ...display(140 * k, -0.05),
            color: "#FFFFFF",
            marginTop: 34 * k,
            opacity: fade(0.35, 0.85),
            translate: `0 ${rise(0.35, 1.1) * k}px`,
            textShadow: `0 ${8 * k}px ${40 * k}px rgba(4,8,40,0.4)`,
            whiteSpace: "nowrap",
          }}
        >
          <ShimmerText start={F(0.6)} duration={2.0} pause={1.4} spread={1.5} stops={SHIMMER}>
            Read the Label.
          </ShimmerText>
          <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, marginLeft: "0.26em" }}>
            Open the Book.
          </span>
        </div>
        <div
          style={{
            marginTop: 30 * k,
            fontFamily: SANS,
            fontWeight: 300,
            fontSize: 31 * k,
            color: "rgba(255,255,255,0.86)",
            opacity: fade(1.1, 1.7),
            textAlign: "center",
            maxWidth: 1240 * k,
          }}
        >
          {cfg.subtitle}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ── the act slate ─────────────────────────────────────────────────────────── */

const ACTS: { n: number; title: string; at: number; hold: number }[] = [
  { n: 1, title: "What it can do", at: at("deck") - 1.1, hold: 1.9 },
  { n: 2, title: "What it remembers", at: at("memory") - 2.5, hold: 1.95 },
];

const ActSlate: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const t = frame / EP20_FPS;

  const act = ACTS.find((a) => t >= a.at - 0.25 && t <= a.at + a.hold + 0.45);
  if (!act) return null;

  const local = t - act.at;
  const veil =
    clamp01((local + 0.25) / 0.34) * clamp01((act.at + act.hold + 0.45 - t) / 0.5);
  const p = clamp01(local / 0.62);
  const sq = 1 - Math.pow(1 - p, 3);
  const titleP = clamp01((local - 0.9) / 0.55);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          background: PAL20.bg,
          // 0.965 rather than the 0.93 EP15–17 use, for the same reason EP18
          // needed it: slate 01 lands over the title card, which is the deep
          // mesh at full strength, and 7% of that is enough for the headline to
          // read straight through the wash and compete with the act title.
          opacity: veil * 0.965,
          backdropFilter: `blur(${8 * veil}px)`,
          WebkitBackdropFilter: `blur(${8 * veil}px)`,
        }}
      />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: veil }}>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 132 * k,
              height: 132 * k,
              borderRadius: 30 * k,
              margin: `0 auto ${34 * k}px`,
              background: PAL20.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: GEIST,
              fontWeight: 900,
              fontSize: 66 * k,
              color: "#FFFFFF",
              letterSpacing: "-0.02em",
              transform: `scale(${lerp(0.86, 1, sq)})`,
              boxShadow: `0 ${16 * k}px ${44 * k}px ${PAL20.accent}33`,
            }}
          >
            {String(act.n).padStart(2, "0")}
          </div>
          <div
            style={{
              fontFamily: HEAD,
              fontWeight: 800,
              fontSize: 96 * k,
              letterSpacing: "-0.045em",
              lineHeight: 1.04,
              color: PAL20.ink,
              opacity: titleP,
              translate: `0 ${lerp(16, 0, titleP) * k}px`,
              whiteSpace: "nowrap",
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
 * ONE skill, followed the whole way through: `tech-episode-video`, the skill
 * that is making this film. It is the right protagonist because it spans both
 * acts honestly — in act one it is a label that matches and loads, and in act
 * two the thing the agent remembers is a fact ABOUT it.
 *
 * Every state is something the film has just said. States are HELD, never
 * interpolated; the id never moves, only the state word animates.
 * ─────────────────────────────────────────────────────────────────────────── */

type TrailState = "waiting" | "live" | "risk" | "safe" | "done";

const TRAIL: { at: number; label: string; state: TrailState }[] = [
  { at: at("deck"), label: "on disk · not loaded", state: "waiting" },
  { at: at("deck") + 4.6, label: "227 tokens in context", state: "waiting" },
  { at: at("label") + 3.8, label: "body still below the fence", state: "waiting" },
  { at: at("match") + 2.4, label: "description matched", state: "live" },
  // NOT "14,762 tokens loaded". The match station runs on a 4.6s loop that
  // returns to "label only" in its first half, so a chip asserting a live
  // loaded-size contradicts the meter beside it for most of every cycle. The
  // chip states what HAPPENED to this skill, which is true at every frame.
  { at: at("match") + 4.6, label: "body loaded when it matched", state: "safe" },
  { at: at("deeper") + 4.0, label: "references/ opened on demand", state: "safe" },
  { at: at("memory") + 3.6, label: "remembered: use EP16's palette", state: "live" },
  { at: at("recall") + 4.4, label: "one fact · one file", state: "safe" },
  { at: at("stale") + 3.4, label: "and one of them is now wrong", state: "risk" },
  { at: at("divide") + 4.2, label: "procedure → skill", state: "done" },
];

const TRAIL_COLOR: Record<TrailState, string> = {
  waiting: PAL20.textMuted,
  live: MEM,
  risk: BAD,
  safe: OK,
  done: PAL20.accent,
};

const SkillTrail: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const t = frame / EP20_FPS;
  if (t < STRIP_T0 - 0.4 || t > endOf("divide") + 0.6) return null;

  let cur = TRAIL[0];
  let idx = 0;
  TRAIL.forEach((s, i) => {
    if (t >= s.at) { cur = s; idx = i; }
  });
  const tone = TRAIL_COLOR[cur.state];
  const since = clamp01((t - cur.at) / 0.42);
  const inOut = clamp01((t - (STRIP_T0 - 0.4)) / 0.6) * clamp01((endOf("divide") + 0.6 - t) / 0.6);

  return (
    <div
      style={{
        position: "absolute",
        left: 54 * k,
        bottom: 46 * k,
        display: "flex",
        alignItems: "center",
        gap: 14 * k,
        background: PANEL,
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: R.pill,
        padding: `${11 * k}px ${20 * k}px ${11 * k}px ${14 * k}px`,
        boxShadow: SHADOW[3],
        opacity: inOut,
        pointerEvents: "none",
      }}
    >
      <span
        style={{
          width: 11 * k,
          height: 11 * k,
          borderRadius: "50%",
          background: tone,
          boxShadow: `0 0 ${(8 + 12 * (1 - since)) * k}px ${tone}`,
          flexShrink: 0,
        }}
      />
      <span style={{ ...tabular(19 * k), color: ON }}>tech-episode-video</span>
      <span style={{ ...tabular(17 * k), color: "rgba(255,255,255,0.22)" }}>·</span>
      <span
        style={{
          ...tabular(18 * k),
          color: tone,
          opacity: 0.35 + 0.65 * since,
          translate: `0 ${lerp(7, 0, since) * k}px`,
          whiteSpace: "nowrap",
        }}
      >
        {cur.label}
      </span>
      <span style={{ ...microCap(13 * k), color: "rgba(255,255,255,0.3)", marginLeft: 6 * k }}>
        {idx + 1}/{TRAIL.length}
      </span>
    </div>
  );
};

/* ── beats 3–11 — the strip ──────────────────────────────────────────────── */

const Strip: React.FC = () => {
  const frame = useCurrentFrame();
  const abs = STRIP_T0 + frame / EP20_FPS;

  const ride = (pick: (k: Key) => number, easing: (n: number) => number) =>
    interpolate(abs, RIDE.map((r) => r.at), RIDE.map(pick), {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing,
    });

  const x = ride((r) => r.x, Easing.bezier(0.45, 0, 0.15, 1));
  const y = ride((r) => r.y, Easing.bezier(0.45, 0, 0.15, 1));
  // The lift eases differently from the travel on purpose. Matched easings make
  // the pull-back look like a side effect of the move; a softer scale curve
  // makes it read as the camera rising over the section break.
  const s = ride((r) => r.s, Easing.bezier(0.33, 0, 0.24, 1));

  return (
    // The scale sits on the OUTER fill so it zooms about the frame centre; the
    // translate sits on the inner one so the two never fight.
    <AbsoluteFill style={{ scale: `${s}` }}>
      <AbsoluteFill style={{ translate: `${-x}% ${-y}%` }}>
        <Station id="deck" bg="tint"><TheDeck /></Station>
        <Station id="label" bg="canvas"><Anatomy /></Station>
        <Station id="match" bg="soft"><TheMatch /></Station>
        <Station id="deeper" bg="canvas"><Deeper /></Station>
        <Station id="memory" bg="tint"><TheOtherHalf /></Station>
        <Station id="recall" bg="soft"><Recall /></Station>
        <Station id="stale" bg="dark"><Stale /></Station>
        <Station id="divide" bg="tint"><Divide /></Station>
        <Station id="end" bg="field"><EndCard /></Station>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Seconds a station is mounted before the camera reaches it. */
const LEAD = 1.2;
/** Beat-seconds → station-local seconds, for anything authored in beat time. */
const bt = (sec: number) => sec + LEAD;

type BgKind = "canvas" | "soft" | "tint" | "field" | "dark";

const Station: React.FC<{ id: string; bg: BgKind; children: React.ReactNode }> = ({
  id,
  bg,
  children,
}) => {
  const frame = useCurrentFrame();
  const abs = STRIP_T0 + frame / EP20_FPS;
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
      <ActBg kind={bg} atSeconds={abs} />
      {/* `position: relative` here is LOAD-BEARING. `ActBg` is an AbsoluteFill —
          a POSITIONED sibling — and CSS paints positioned descendants above
          non-positioned in-flow ones regardless of DOM order. Without this
          wrapper, every element that happens NOT to carry an `opacity < 1`, a
          `transform` or a `translate` paints UNDERNEATH the background and
          vanishes, taking out half of a beat and leaving the other half looking
          fine. It looks like a timing bug and it is not. */}
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
 * The act's dominant field brightness.
 *
 * Unlike EP18, the SAME instrument runs under every station here — the mesh has
 * no edges, so it never has to be cropped away from a diagram. What changes is
 * `intensity`, which means the value journey is one continuous surface being
 * turned up and down rather than five different backgrounds. That is the whole
 * argument for building a new field rather than re-skinning the ribbon.
 */
const ActBg: React.FC<{ kind: BgKind; atSeconds: number }> = ({ kind, atSeconds }) => {
  if (kind === "field")
    return (
      <AbsoluteFill>
        <Mesh deep intensity={1} atSeconds={atSeconds} grain={40} />
        {/* 0.52 — the heaviest scrim in the film, and it is not for the
            headline. "Thanks for watching." is 100px display with a shadow and
            survives anything; the `next` line under it is 22px at 0.86 white,
            the smallest type on any field beat, and it is the one thing on the
            end card a viewer actually has to read. */}
        <Scrim strength={0.52} />
      </AbsoluteFill>
    );
  if (kind === "dark")
    return (
      <AbsoluteFill style={{ background: "#080A16" }}>
        {/* The film's ONE true-dark station, and it has to read as the darkest
            thing in the episode or the value journey has no floor. A dark act
            is a DIMMER field, not no field: the mesh sits at a fifth of its
            weight — present as colour in the corners, never as brightness
            across the frame. */}
        <Mesh deep intensity={0.22} base="#080A16" atSeconds={atSeconds} grain={44} />
        <GridPlate pal={PAL20} tone="dark" pitch={72} opacity={0.8} />
      </AbsoluteFill>
    );
  if (kind === "tint")
    return <Mesh intensity={0.85} atSeconds={atSeconds} grain={30} />;
  if (kind === "soft")
    return (
      <AbsoluteFill style={{ background: PAL20.bgDeep }}>
        <Mesh intensity={0.5} base={PAL20.bgDeep} atSeconds={atSeconds} grain={0} />
        <GridPlate pal={PAL20} pitch={72} opacity={0.85} />
        {/* The grain runs on EVERY station, including the quiet ones. A field
            that is only grained where it is saturated makes the plain stations
            read as a different, flatter film. */}
        <Grain amount={20} atSeconds={atSeconds} blend="multiply" />
      </AbsoluteFill>
    );
  return <Mesh intensity={0.34} atSeconds={atSeconds} grain={22} />;
};

/* ── icons ──────────────────────────────────────────────────────────────────
 *
 * A labelled rectangle is a rectangle. The same rectangle with a cylinder in it
 * is A DATABASE, and the viewer knows that before reading a word. One weight,
 * one radius, one size, so they read as a family rather than clip art.
 * ─────────────────────────────────────────────────────────────────────────── */

type IcoName =
  | "file" | "folder" | "tag" | "book" | "search" | "check" | "cross" | "clock"
  | "brain" | "link" | "bolt" | "arrow" | "trash" | "layers" | "pin" | "sand";

const Ico: React.FC<{ name: IcoName; size: number; color: string }> = ({ name, size, color }) => {
  const P: Record<IcoName, React.ReactNode> = {
    file: <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4M9 12h6M9 16h4" /></>,
    folder: <path d="M3 7a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
    tag: <><path d="M3 12V5a2 2 0 0 1 2-2h7l9 9-9 9z" /><circle cx="7.5" cy="7.5" r="1.6" /></>,
    book: <><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v16H6.5A2.5 2.5 0 0 0 4 20.5z" /><path d="M4 17.5A2.5 2.5 0 0 1 6.5 15H20" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m16.2 16.2 4.3 4.3" /></>,
    check: <path d="M4.5 12.6 9.5 17.6 19.5 6.6" />,
    cross: <path d="M6 6l12 12M18 6 6 18" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 6.6V12l3.6 2.2" /></>,
    brain: <><path d="M9.5 3.5A3 3 0 0 0 6.6 7 3 3 0 0 0 5 12.5a3 3 0 0 0 1.7 5.3A3 3 0 0 0 12 20V4a2.5 2.5 0 0 0-2.5-.5z" /><path d="M14.5 3.5A3 3 0 0 1 17.4 7 3 3 0 0 1 19 12.5a3 3 0 0 1-1.7 5.3A3 3 0 0 1 12 20" /></>,
    link: <><path d="M10 13.5a4 4 0 0 0 5.7 0l2.8-2.8a4 4 0 0 0-5.7-5.7L11.5 6.4" /><path d="M14 10.5a4 4 0 0 0-5.7 0L5.5 13.3a4 4 0 0 0 5.7 5.7l1.3-1.3" /></>,
    bolt: <path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12z" />,
    arrow: <path d="M4 12h15m-5.5-5.5L19.5 12l-6 5.5" />,
    trash: <><path d="M4 6.5h16M9.5 6.5V4h5v2.5" /><path d="M6.5 6.5 7.6 21h8.8l1.1-14.5" /><path d="M10 10.5v7M14 10.5v7" /></>,
    layers: <><path d="m12 3 9 5-9 5-9-5z" /><path d="m3 13 9 5 9-5" /><path d="m3 17.5 9 5 9-5" /></>,
    pin: <><path d="M12 21v-7" /><path d="M8 3h8l-1.2 6.4 2.7 2.4H4.5l2.7-2.4z" /></>,
    sand: <><path d="M7 3h10M7 21h10" /><path d="M7 3c0 5 5 6.4 5 9s-5 4-5 9M17 3c0 5-5 6.4-5 9s5 4 5 9" /></>,
  };
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.7}
      strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flexShrink: 0 }}
    >
      {P[name]}
    </svg>
  );
};

/* ── the box pattern, as the station header ─────────────────────────────── */

const BoxTag: React.FC<{ n: string; children: React.ReactNode; tone?: "light" | "dark" }> = ({
  n,
  children,
  tone = "light",
}) => {
  const k = useK();
  const p = useAppearAt(2, 200);
  const dark = tone === "dark";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
        marginBottom: 40 * k,
        opacity: p,
        translate: `0 ${lerp(-8, 0, p) * k}px`,
      }}
    >
      <span
        style={{
          background: PAL20.accent,
          color: "#FFFFFF",
          ...tabular(21 * k),
          letterSpacing: "0.06em",
          padding: `${9 * k}px ${14 * k}px`,
          borderRadius: `${R.md * k}px 0 0 ${R.md * k}px`,
          display: "flex",
          alignItems: "center",
        }}
      >
        {n}
      </span>
      <span
        style={{
          border: `1px solid ${dark ? "rgba(255,255,255,0.22)" : PAL20.border}`,
          borderLeft: "none",
          borderRadius: `0 ${R.md * k}px ${R.md * k}px 0`,
          padding: `${9 * k}px ${20 * k}px`,
          ...microCap(19 * k),
          color: dark ? "rgba(255,255,255,0.72)" : PAL20.textMuted,
          display: "flex",
          alignItems: "center",
          background: dark ? "transparent" : `${PAL20.bg}CC`,
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </span>
    </div>
  );
};

const Note: React.FC<{ at: number; tone?: "light" | "dark"; children: React.ReactNode }> = ({
  at: a,
  tone = "light",
  children,
}) => {
  const k = useK();
  const p = useAppearAt(a, 200);
  return (
    <div
      style={{
        marginTop: 34 * k,
        fontFamily: SANS,
        fontWeight: 300,
        fontSize: 29 * k,
        color: tone === "dark" ? "rgba(255,255,255,0.7)" : PAL20.textMuted,
        opacity: p,
        translate: `0 ${lerp(8, 0, p) * k}px`,
        textAlign: "center",
      }}
    >
      {children}
    </div>
  );
};

/* ── beat 3 — THE DECK ───────────────────────────────────────────────────────
 *
 * THE PORT. The director supplied `carousel-07` — a shadcn/motion stacked drag
 * carousel — and its geometry is here verbatim. Kept exactly:
 *
 *   • the wrapped offset:  diff = (index − progress) % total, folded into
 *     ±total/2, so the deck is a ring rather than a list;
 *   • the transform set and its desktop constants: x = o·170, rotate = o·12
 *     (dead-zoned under |o| < 0.05), y = |o|·40, scale = 1 − |o|·0.12,
 *     zIndex = 100 − |o|·10;
 *   • the opacity ramp keyed on [−t/2, −t/2+0.5, 0, t/2−0.5, t/2] → [0,1,1,1,0],
 *     which is what makes cards dissolve at the back of the ring instead of
 *     popping;
 *   • the card aspect (256×384 at the desktop breakpoint), scaled as a unit.
 *
 * ONE THING CHANGED, and it had to. Upstream, `progress` is a `useMotionValue`
 * driven by a pointer and settled with a spring on release. A render has no
 * pointer, and `animate()` is wall-clock, which is exactly what a frame-pure
 * render cannot contain — so progress is derived from `useCurrentFrame()`.
 *
 * That forced a second, better decision. A drag flings and settles wherever
 * momentum leaves it; a film has to HOLD each card long enough to read the
 * description on it. So progress is stepped rather than continuous: it rests on
 * an integer for 62% of each cycle and eases to the next over the remaining
 * 38%. Same geometry, a reading cadence instead of a flick.
 *
 * WHY IT IS HERE AT ALL, which matters more than the port being faithful: a
 * stack where every card is present and exactly ONE is at full resolution is
 * what progressive disclosure looks like. The motif is the argument.
 * ─────────────────────────────────────────────────────────────────────────── */

/** The desktop breakpoint of the source config, verbatim. */
const DECK = {
  xMultiplier: 170,
  yMultiplier: 40,
  rotationMultiplier: 12,
  scaleReduction: 0.12,
  cardW: 256,
  cardH: 384,
};
/**
 * The deck is authored at the source's own pixel scale, then zoomed as a unit.
 *
 * 1.0, not the 1.6 this shipped at first. The source constants are a WIDTH
 * budget as much as a look: at |o| = 2.5 a card sits 2.5 × 170 = 425 units off
 * centre plus its own half-width, so the ring is ~1,110 units across before it
 * is zoomed at all. At 1.6 that is 1,780 units for the deck alone, which ran
 * the leftmost card off the frame and painted the whole ring straight over the
 * stat column beside it. Scale the port, then check what it costs in space.
 */
const DECK_K = 1.0;

/** Real skills on this machine, with their real measured token costs. */
const SKILLS: { name: string; desc: string; fm: number; body: number }[] = [
  { name: "tech-episode-video", desc: "the only way videos get made", fm: 227, body: 14_762 },
  { name: "graphify", desc: "any input → knowledge graph", fm: 39, body: 15_132 },
  { name: "website-designer", desc: "award-tier landing pages", fm: 126, body: 1_767 },
  { name: "workos", desc: "auth, SSO, SCIM, RBAC", fm: 136, body: 3_394 },
  { name: "pagespeed-insights", desc: "Core Web Vitals audits", fm: 91, body: 3_224 },
  { name: "logo-creator", desc: "logos, icons, brand marks", fm: 93, body: 1_394 },
];

const TheDeck: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();

  // Stepped progress: rest on a card, then ease to the next. `CYCLE` is the
  // whole hold-plus-move, and the move takes the last 38% of it.
  const CYCLE = F(2.3);
  const raw = Math.max(0, frame - F(bt(0.2))) / CYCLE;
  const i = Math.floor(raw);
  const f = raw - i;
  const HOLD = 0.62;
  const adv = f < HOLD ? 0 : (() => {
    const u = (f - HOLD) / (1 - HOLD);
    return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
  })();
  const progress = i + adv;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <BoxTag n="01">a hundred and thirteen skills, one line each</BoxTag>
      {/* 90, not 40. The ring is WIDER than its container at the fade-out edge:
          a card at |o| = 2.7 sits 459 + 128 = 587 units from centre against a
          560-unit half-width, so the dissolving card at the back of the deck
          clipped the left edge of the stat column. The port's spread is a
          layout constraint, and the gap has to be sized against it. */}
      <div style={{ display: "flex", alignItems: "center", gap: 90 * k }}>
        {/* `isolation: isolate` is load-bearing. The port's own zIndex runs to
            100, and without a containing stacking context those values compete
            with everything else on the station — the ring paints over the stat
            column no matter what order the DOM is in. Isolating it keeps the
            source's z-ordering doing its job INSIDE the deck and lets ordinary
            DOM order settle the deck against its neighbour. */}
        <div
          style={{
            position: "relative",
            isolation: "isolate",
            zIndex: 0,
            width: 1120 * k,
            height: 560 * k,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {SKILLS.map((s, idx) => (
            <DeckCard key={s.name} skill={s} index={idx} total={SKILLS.length} progress={progress} />
          ))}
        </div>
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 16 * k }}>
          <DeckStat
            big={N_SKILLS.toLocaleString("en-US")}
            unit="skills on disk"
            sub="every one of them addressable right now"
            at={F(bt(0.6))}
          />
          <DeckStat
            big={TOK_L1.toLocaleString("en-US")}
            unit="tokens in context"
            sub="the names and the descriptions — nothing else"
            hue={PAL20.accent}
            at={F(bt(1.4))}
          />
          <DeckStat
            big={TOK_L2.toLocaleString("en-US")}
            unit="tokens still on disk"
            sub="the bodies, waiting to be asked for"
            hue={MEM}
            dim
            at={F(bt(2.2))}
          />
        </div>
      </div>
      <Note at={F(bt(5.4))}>
        The deck is always complete. Exactly one card is ever in focus, and that
        is the whole trick.
      </Note>
    </div>
  );
};

const DeckCard: React.FC<{
  skill: { name: string; desc: string; fm: number; body: number };
  index: number;
  total: number;
  progress: number;
}> = ({ skill, index, total, progress }) => {
  const k = useK();

  // ── the source's offset, verbatim: a signed distance around the ring
  let o = (index - progress) % total;
  if (o > total / 2) o -= total;
  if (o < -total / 2) o += total;

  const abs = Math.abs(o);
  const x = o * DECK.xMultiplier;
  const rotate = abs < 0.05 ? 0 : o * DECK.rotationMultiplier;
  const y = abs < 0.05 ? 0 : abs * DECK.yMultiplier;
  const scale = 1 - abs * DECK.scaleReduction;
  const opacity = interpolate(
    o,
    [-total / 2, -total / 2 + 0.5, 0, total / 2 - 0.5, total / 2],
    [0, 1, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const zIndex = Math.round(100 - abs * 10);

  // The one card in focus is the only one that reads as loaded. The rest are
  // present, dimmed and tilted — which is the picture the beat is arguing.
  const focus = clamp01(1 - abs * 1.6);

  return (
    <div
      style={{
        position: "absolute",
        width: DECK.cardW * DECK_K * k,
        height: DECK.cardH * DECK_K * k,
        zIndex,
        opacity,
        transform:
          `translate(${x * DECK_K * k}px, ${y * DECK_K * k}px) ` +
          `rotate(${rotate}deg) scale(${scale})`,
        borderRadius: 22 * k,
        overflow: "hidden",
        background: PANEL,
        border: `1px solid rgba(255,255,255,${0.1 + 0.14 * focus})`,
        boxShadow: SHADOW[3],
        display: "flex",
        flexDirection: "column",
        padding: `${26 * k}px ${26 * k}px`,
      }}
    >
      {/* the indigo wash only reaches the focused card — "loaded" as a value,
          not as a badge */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 80% at 14% 0%, ${PAL20.accent}${
            Math.round(0.42 * 255 * focus).toString(16).padStart(2, "0")
          } 0%, transparent 62%)`,
        }}
      />
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
        <Ico name="tag" size={26 * k} color={focus > 0.5 ? "#FFFFFF" : "rgba(255,255,255,0.4)"} />
        <div
          style={{
            // 21, not 25. The port's card is 256 units wide and the longest
            // real skill name here is 18 characters; at 25 the mono runs past
            // the 204-unit inner width and breaks mid-name. Sized against the
            // content, not chosen.
            ...tabular(21 * k),
            color: focus > 0.4 ? ON : "rgba(255,255,255,0.55)",
            marginTop: 22 * k,
            lineHeight: 1.3,
          }}
        >
          {skill.name}
        </div>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 300,
            fontSize: 20 * k,
            lineHeight: 1.4,
            color: focus > 0.4 ? "rgba(255,255,255,0.72)" : "rgba(255,255,255,0.34)",
            marginTop: 14 * k,
            flex: 1,
          }}
        >
          {skill.desc}
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 * k }}>
          <span style={{ ...tabular(24 * k), color: PAL20.accent }}>{skill.fm}</span>
          <span style={{ ...microCap(13 * k), color: ON_DIM, whiteSpace: "nowrap" }}>tok label</span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 * k, marginTop: 6 * k }}>
          <span style={{ ...tabular(24 * k), color: "rgba(255,255,255,0.34)" }}>
            {skill.body.toLocaleString("en-US")}
          </span>
          <span style={{ ...microCap(13 * k), color: "rgba(255,255,255,0.28)", whiteSpace: "nowrap" }}>
            tok body · not loaded
          </span>
        </div>
      </div>
    </div>
  );
};

const DeckStat: React.FC<{
  big: string; unit: string; sub: string; at: number; hue?: string; dim?: boolean;
}> = ({ big, unit, sub, at: a, hue, dim = false }) => {
  const k = useK();
  const p = useAppearAt(a, 200);
  return (
    <div
      style={{
        background: PANEL,
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: R.md * k,
        padding: `${20 * k}px ${26 * k}px`,
        width: 500 * k,
        boxShadow: SHADOW[2],
        // `p` only — the `dim` card dims its CONTENT below, never the surface.
        // A black panel at 0.72 over this field is a grey slab.
        opacity: p,
        translate: `0 ${lerp(12, 0, p) * k}px`,
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 14 * k }}>
        <span
          style={{
            ...display(42 * k, -0.04),
            fontWeight: 300,
            color: hue ?? ON,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {big}
        </span>
        <span
          style={{
            ...microCap(15 * k),
            color: dim ? "rgba(255,255,255,0.32)" : ON_DIM,
            whiteSpace: "nowrap",
          }}
        >
          {unit}
        </span>
      </div>
      <div
        style={{
          ...microCap(14 * k),
          color: dim ? "rgba(255,255,255,0.24)" : "rgba(255,255,255,0.34)",
          marginTop: 8 * k,
          whiteSpace: "nowrap",
        }}
      >
        {sub}
      </div>
    </div>
  );
};

/* ── beat 4 — the anatomy of one SKILL.md ────────────────────────────────────
 *
 * The one artifact in the film, shown as a DOCUMENT rather than as a typed
 * terminal. The frontmatter types in — it is the part that is always paid for,
 * so it earns the keystrokes — and the body arrives as greyed block lines,
 * because the point is precisely that nobody has read them.
 *
 * The fence between them is the whole idea, so it is the one drawn element on
 * the beat and it draws ACROSS rather than fading in.
 * ─────────────────────────────────────────────────────────────────────────── */

const FM_LINES = [
  "name: tech-episode-video",
  "description: Use when making an episode for a tech",
  "  video playlist — a graphic-motion explainer with",
  "  real cinematic footage, narration and a score.",
];

const Anatomy: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const typed = clamp01((frame - F(bt(0.6))) / F(2.4));
  const fence = clamp01((frame - F(bt(3.2))) / F(0.7));
  const bodyIn = clamp01((frame - F(bt(3.7))) / F(1.8));
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <BoxTag n="02">what is above the line, and what is below it</BoxTag>
      <div style={{ display: "flex", alignItems: "stretch", gap: 40 * k }}>
        <div
          style={{
            width: 1020 * k,
            background: PANEL,
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: R.lg * k,
            boxShadow: SHADOW[3],
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex", alignItems: "center", gap: 12 * k,
              padding: `${16 * k}px ${24 * k}px`,
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <Ico name="file" size={20 * k} color={ON_DIM} />
            <span style={{ ...tabular(19 * k), color: "rgba(255,255,255,0.8)" }}>
              ~/.claude/skills/tech-episode-video/SKILL.md
            </span>
          </div>
          <div style={{ padding: `${26 * k}px ${28 * k}px ${30 * k}px` }}>
            <div style={{ ...tabular(19 * k), color: "rgba(255,255,255,0.3)" }}>---</div>
            {FM_LINES.map((l, i) => {
              const per = 1 / FM_LINES.length;
              const local = clamp01((typed - i * per) / per);
              const cut = Math.round(l.length * local);
              return (
                <div
                  key={i}
                  style={{
                    ...tabular(21 * k),
                    color: PAL20.accent,
                    lineHeight: 1.62,
                    whiteSpace: "pre",
                    minHeight: 21 * 1.62 * k,
                  }}
                >
                  {l.slice(0, cut)}
                  {local > 0 && local < 1 && (
                    <span style={{ background: PAL20.accent, color: PANEL }}>&nbsp;</span>
                  )}
                </div>
              );
            })}
            <div style={{ ...tabular(19 * k), color: "rgba(255,255,255,0.3)" }}>---</div>

            {/* THE FENCE — the one drawn element on the beat */}
            <div style={{ position: "relative", height: 34 * k, marginTop: 10 * k }}>
              <div
                style={{
                  position: "absolute", left: 0, top: 16 * k, height: 2 * k,
                  width: `${fence * 100}%`, background: "#FFFFFF", opacity: 0.65,
                }}
              />
              <span
                style={{
                  position: "absolute", right: 0, top: 0, ...microCap(13 * k),
                  color: "rgba(255,255,255,0.5)", opacity: fence, whiteSpace: "nowrap",
                }}
              >
                everything below here waits
              </span>
            </div>

            {/* the body, as block lines. Never legible, and that is the point. */}
            {Array.from({ length: 9 }).map((_, i) => {
              const local = clamp01((bodyIn - i * 0.06) / 0.3);
              const w = 42 + ((i * 37) % 55);
              return (
                <div
                  key={i}
                  style={{
                    height: 11 * k,
                    marginTop: 13 * k,
                    borderRadius: 3 * k,
                    width: `${w * local}%`,
                    background: "rgba(255,255,255,0.13)",
                  }}
                />
              );
            })}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 * k, justifyContent: "center" }}>
          <Weigh label="above the fence" n={227} sub="always in context" hue={PAL20.accent} at={F(bt(1.4))} />
          <Weigh label="below the fence" n={14_762} sub="loaded only on a match" hue="rgba(255,255,255,0.4)" at={F(bt(4.0))} />
          <Ratio at={F(bt(5.0))} />
        </div>
      </div>
      <Note at={F(bt(5.8))}>
        The description is a promise about the body. It is the only part the
        agent reads for free.
      </Note>
    </div>
  );
};

const Weigh: React.FC<{ label: string; n: number; sub: string; hue: string; at: number }> = ({
  label, n, sub, hue, at: a,
}) => {
  const k = useK();
  const frame = useCurrentFrame();
  const p = useAppearAt(a, 200);
  const v = Math.round(n * clamp01((frame - a) / F(1.1)));
  return (
    <div
      style={{
        background: PANEL,
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: R.md * k,
        padding: `${20 * k}px ${26 * k}px`,
        width: 500 * k,
        boxShadow: SHADOW[2],
        opacity: p,
        translate: `0 ${lerp(12, 0, p) * k}px`,
      }}
    >
      <div style={{ ...microCap(15 * k), color: ON_DIM }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12 * k, marginTop: 10 * k }}>
        <span
          style={{
            ...display(52 * k, -0.045),
            fontWeight: 300,
            color: hue,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {v.toLocaleString("en-US")}
        </span>
        <span style={{ ...microCap(14 * k), color: ON_DIM, whiteSpace: "nowrap" }}>tokens</span>
      </div>
      <div style={{ ...microCap(13 * k), color: "rgba(255,255,255,0.34)", marginTop: 8 * k, whiteSpace: "nowrap" }}>
        {sub}
      </div>
    </div>
  );
};

const Ratio: React.FC<{ at: number }> = ({ at: a }) => {
  const k = useK();
  const p = useAppearAt(a, 200);
  return (
    <div
      style={{
        display: "flex", alignItems: "baseline", gap: 14 * k,
        padding: `${4 * k}px ${26 * k}px`,
        opacity: p,
      }}
    >
      {/* PAL20.ink, not ON. This is the one figure in the film that sits
          directly on the field with no panel under it, and `ON` is #FFFFFF —
          white type on a white page. The colour of a value has to come from
          what is BEHIND it, not from what the rest of the component uses. */}
      <span style={{ ...display(62 * k, -0.045), fontWeight: 300, color: PAL20.ink }}>65×</span>
      <span style={{ ...microCap(15 * k), color: PAL20.textMuted, whiteSpace: "nowrap" }}>
        body to label · this skill, measured
      </span>
    </div>
  );
};

/* ── beat 5 — one description wins ───────────────────────────────────────────
 *
 * The match, as a race that resolves. Five real descriptions score against a
 * real task, the bars run, one crosses the line and the other four go grey —
 * then the token meter slams from the label cost to the loaded cost.
 *
 * It runs on a LOOP, so the beat is still arguing when the narration lands
 * rather than having finished in its first two seconds.
 * ─────────────────────────────────────────────────────────────────────────── */

const CANDIDATES: [string, number][] = [
  ["tech-episode-video", 1.0],
  ["website-designer", 0.42],
  ["logo-creator", 0.31],
  ["graphify", 0.24],
  ["pagespeed-insights", 0.12],
];

const TheMatch: React.FC = () => {
  const k = useK();
  const t = useLoop(F(4.6));
  // 0.00–0.14 the task lands · 0.14–0.62 the scores race · 0.62–1.00 one wins
  const race = clamp01((t - 0.14) / 0.48);
  const won = t > 0.62;
  const load = clamp01((t - 0.62) / 0.26);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <BoxTag n="03">the description is the only thing that gets matched</BoxTag>
      <TaskChip on={t > 0.06} />
      <div style={{ display: "flex", alignItems: "center", gap: 44 * k, marginTop: 30 * k }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 * k }}>
          {CANDIDATES.map(([name, score], i) => {
            const w = score * race;
            const winner = i === 0;
            const dim = won && !winner;
            return (
              <div
                key={name}
                style={{
                  display: "flex", alignItems: "center", gap: 18 * k,
                  background: PANEL,
                  border: `1px solid ${won && winner ? `${PAL20.accent}99` : "rgba(255,255,255,0.10)"}`,
                  borderRadius: R.md * k,
                  padding: `${14 * k}px ${22 * k}px`,
                  width: 780 * k,
                  boxShadow: SHADOW[2],
                  // The losing rows dim their CONTENT, not the panel — a black
                  // surface at 0.34 over this station's near-white ground is a
                  // grey slab, not a card that lost.
                }}
              >
                <span
                  style={{
                    ...tabular(20 * k),
                    color: dim ? "rgba(255,255,255,0.34)" : ON,
                    width: 300 * k,
                    whiteSpace: "nowrap",
                  }}
                >
                  {name}
                </span>
                <div
                  style={{
                    flex: 1, height: 10 * k, borderRadius: 5 * k,
                    background: "rgba(255,255,255,0.08)", overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${w * 100}%`, height: "100%", borderRadius: 5 * k,
                      background: winner ? PAL20.accent : dim ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.3)",
                    }}
                  />
                </div>
                <span
                  style={{
                    ...tabular(19 * k),
                    color: winner && won ? PAL20.accent : dim ? "rgba(255,255,255,0.26)" : ON_DIM,
                    width: 74 * k, textAlign: "right", fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {w.toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>
        <LoadMeter load={load} at={F(bt(1.0))} />
      </div>
      <Note at={F(bt(4.4))}>
        Nothing was read to decide this. The agent chose between one-line
        promises.
      </Note>
    </div>
  );
};

const TaskChip: React.FC<{ on: boolean }> = ({ on }) => {
  const k = useK();
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 16 * k,
        background: PANEL,
        border: `1px solid ${on ? "rgba(255,255,255,0.24)" : "rgba(255,255,255,0.08)"}`,
        borderRadius: R.pill,
        padding: `${14 * k}px ${30 * k}px`,
        boxShadow: SHADOW[2],
        opacity: on ? 1 : 0.35,
      }}
    >
      <Ico name="search" size={22 * k} color={on ? PAL20.accent : ON_DIM} />
      <span style={{ ...tabular(23 * k), color: ON, whiteSpace: "nowrap" }}>
        “make episode 20 about agent memory and skills”
      </span>
    </div>
  );
};

const LoadMeter: React.FC<{ load: number; at: number }> = ({ load, at: a }) => {
  const k = useK();
  const p = useAppearAt(a, 200);
  const n = Math.round(227 + (14_762 - 227) * load);
  return (
    <div
      style={{
        background: PANEL,
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: R.lg * k,
        padding: `${30 * k}px ${34 * k}px`,
        width: 560 * k,
        boxShadow: SHADOW[3],
        opacity: p,
        transform: `scale(${lerp(0.95, 1, p)})`,
      }}
    >
      <div style={{ ...microCap(15 * k), color: ON_DIM }}>context cost of this skill</div>
      <div
        style={{
          ...display(84 * k, -0.045),
          fontWeight: 300,
          color: load > 0.02 ? PAL20.accent : ON,
          fontVariantNumeric: "tabular-nums",
          marginTop: 12 * k,
        }}
      >
        {n.toLocaleString("en-US")}
      </div>
      <div
        style={{
          marginTop: 18 * k, height: 12 * k, borderRadius: 6 * k,
          background: "rgba(255,255,255,0.08)", overflow: "hidden",
        }}
      >
        {/* derived from the SAME `load` that drives the number above it — a
            constant bar beside an animated figure is the small incoherence that
            makes an instrument look drawn rather than live */}
        <div
          style={{
            width: `${Math.max(1.2, load * 100)}%`, height: "100%",
            background: PAL20.accent, borderRadius: 6 * k,
          }}
        />
      </div>
      <div style={{ ...microCap(14 * k), color: load > 0.9 ? OK : ON_DIM, marginTop: 18 * k, whiteSpace: "nowrap" }}>
        {load > 0.9 ? "body loaded · the promise is now paid for" : load > 0.02 ? "loading the body…" : "label only"}
      </div>
    </div>
  );
};

/* ── beat 6 — level three, on demand ─────────────────────────────────────────
 *
 * The third level, which is the one that actually makes the arithmetic work:
 * the body does not contain the knowledge, it POINTS at it. A fan of real files
 * from this skill's own references/ directory, one of which opens.
 *
 * The fan re-picks which file opens on every loop, so the beat keeps moving
 * for its full length and the point ("any of them, none of them, until asked")
 * is made by the behaviour rather than by a caption.
 * ─────────────────────────────────────────────────────────────────────────── */

const REFS = [
  "station-strip.md",
  "motion-grammar.md",
  "kling-shots.md",
  "narration.md",
  "audio.md",
  "workspace-film.md",
  "ferrari-editorial.md",
];

const Deeper: React.FC = () => {
  const k = useK();
  const t = useLoop(F(5.2));
  const pick = Math.floor(t * REFS.length) % REFS.length;
  const openP = clamp01(((t * REFS.length) % 1) / 0.45);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <BoxTag n="04">the body does not hold the knowledge — it points at it</BoxTag>
      <div style={{ display: "flex", alignItems: "center", gap: 44 * k }}>
        <Ladder at={F(bt(0.4))} />
        <div style={{ display: "flex", flexDirection: "column", gap: 11 * k }}>
          {REFS.map((f, i) => {
            const open = i === pick;
            return (
              <div
                key={f}
                style={{
                  display: "flex", alignItems: "center", gap: 14 * k,
                  background: PANEL,
                  border: `1px solid ${open ? `${MEM}88` : "rgba(255,255,255,0.10)"}`,
                  borderRadius: R.md * k,
                  padding: `${13 * k}px ${20 * k}px`,
                  width: 620 * k,
                  boxShadow: SHADOW[2],
                  transform: `translateX(${open ? openP * 22 * k : 0}px)`,
                  // NOT `opacity: 0.45` on the panel. Over a light field a
                  // black surface at partial opacity blends toward the page and
                  // renders as a mid-GREY slab — it stops being one of the
                  // film's black windows and starts reading as a disabled
                  // control. Dim the CONTENT and leave the surface alone.
                }}
              >
                <Ico name={open ? "book" : "file"} size={19 * k} color={open ? MEM : "rgba(255,255,255,0.26)"} />
                <span style={{ ...tabular(19 * k), color: open ? ON : "rgba(255,255,255,0.38)", flex: 1, whiteSpace: "nowrap" }}>
                  references/{f}
                </span>
                <span style={{ ...microCap(13 * k), color: open ? MEM : "rgba(255,255,255,0.24)", whiteSpace: "nowrap" }}>
                  {open ? "read now" : "not read"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <Note at={F(bt(5.0))}>
        942 bundled files across every skill. The agent has opened one of them.
      </Note>
    </div>
  );
};

/** The three levels as a ladder — the shape of the whole mechanism, once. */
const LADDER: [string, string, number, string][] = [
  ["level 1", "name + description", TOK_L1, "always"],
  ["level 2", "the SKILL.md body", TOK_L2, "on a match"],
  ["level 3", "bundled files", TOK_L3, "on demand"],
];

const Ladder: React.FC<{ at: number }> = ({ at: a }) => {
  const k = useK();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 * k }}>
      {LADDER.map(([lv, what, n, when], i) => {
        const hue = [PAL20.accent, "#78B8F9", MEM][i];
        return (
          <LadderRow key={lv} lv={lv} what={what} n={n} when={when} hue={hue} at={a + i * 14} />
        );
      })}
    </div>
  );
};

const LadderRow: React.FC<{
  lv: string; what: string; n: number; when: string; hue: string; at: number;
}> = ({ lv, what, n, when, hue, at: a }) => {
  const k = useK();
  const p = useAppearAt(a, 200);
  return (
    <div
      style={{
        background: PANEL,
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: R.md * k,
        padding: `${18 * k}px ${24 * k}px`,
        width: 620 * k,
        boxShadow: SHADOW[2],
        opacity: p,
        translate: `0 ${lerp(12, 0, p) * k}px`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 * k }}>
        <Ico name="layers" size={20 * k} color={hue} />
        <span style={{ ...microCap(15 * k), color: ON_DIM }}>{lv}</span>
        <span style={{ ...tabular(19 * k), color: ON, flex: 1, whiteSpace: "nowrap" }}>{what}</span>
        <span style={{ ...microCap(13 * k), color: hue, whiteSpace: "nowrap" }}>{when}</span>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 * k, marginTop: 12 * k }}>
        <span
          style={{
            ...display(36 * k, -0.035),
            fontWeight: 300,
            color: hue,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {n.toLocaleString("en-US")}
        </span>
        <span style={{ ...microCap(13 * k), color: ON_DIM, whiteSpace: "nowrap" }}>tokens on this machine</span>
      </div>
    </div>
  );
};

/* ── beat 7 — the other half (ACT BREAK) ─────────────────────────────────────
 *
 * The turn. Skills and memory are the same MECHANISM and different MATERIAL,
 * and the beat has to say both things at once — so it is one divide with the
 * two halves built identically and labelled differently.
 *
 * The line between them draws down the middle as the beat opens: the one drawn
 * element, on the one beat that is about a distinction.
 * ─────────────────────────────────────────────────────────────────────────── */

const TheOtherHalf: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const line = clamp01((frame - F(bt(0.5))) / F(1.1));
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <BoxTag n="05">same mechanism, different material</BoxTag>
      <div style={{ position: "relative", display: "flex", alignItems: "stretch", gap: 96 * k }}>
        <HalfCol
          icon="tag"
          hue={PAL20.accent}
          title="skills"
          what="what it can do"
          rows={[
            ["shape", "a procedure, written once"],
            ["lives in", "the repo, versioned"],
            ["portable", "same on every machine"],
            ["ages", "with the codebase"],
          ]}
          at={F(bt(1.0))}
        />
        {/* the divide */}
        <div
          style={{
            position: "absolute", left: "50%", top: 0, width: 2 * k,
            height: `${line * 100}%`, background: PAL20.borderMid, translate: "-50% 0",
          }}
        />
        <HalfCol
          icon="brain"
          hue={MEM}
          title="memory"
          what="what it knows about you"
          rows={[
            ["shape", "one fact, one file"],
            ["lives in", "your machine, not the repo"],
            ["portable", "no — it is yours"],
            ["ages", "badly, and silently"],
          ]}
          at={F(bt(1.6))}
        />
      </div>
      <Note at={F(bt(4.6))}>
        Both keep a cheap line in context and the expensive part on disk. Only
        one of them is allowed to be wrong.
      </Note>
    </div>
  );
};

const HalfCol: React.FC<{
  icon: IcoName; hue: string; title: string; what: string;
  rows: [string, string][]; at: number;
}> = ({ icon, hue, title, what, rows, at: a }) => {
  const k = useK();
  const p = useAppearAt(a, 200);
  return (
    <div
      style={{
        background: PANEL,
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: R.lg * k,
        padding: `${30 * k}px ${34 * k}px`,
        width: 660 * k,
        boxShadow: SHADOW[3],
        opacity: p,
        translate: `0 ${lerp(14, 0, p) * k}px`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 * k }}>
        <Ico name={icon} size={30 * k} color={hue} />
        <span style={{ ...display(44 * k, -0.03), fontWeight: 400, color: ON }}>{title}</span>
      </div>
      <div style={{ ...microCap(16 * k), color: hue, marginTop: 12 * k }}>{what}</div>
      {/* The rows arrive one at a time across the beat, not as a block with the
          column. Both columns run the SAME row clock, so `shape` lands against
          `shape` and `ages` against `ages` — the comparison is read across, and
          the beat keeps delivering instead of assembling in 1.6s and holding
          for the remaining three. */}
      <div style={{ marginTop: 26 * k, display: "flex", flexDirection: "column", gap: 14 * k }}>
        {rows.map(([kk, v], i) => (
          <Compare key={kk} label={kk} value={v} first={i === 0} at={a + F(0.9) + i * F(0.95)} />
        ))}
      </div>
    </div>
  );
};

const Compare: React.FC<{ label: string; value: string; first: boolean; at: number }> = ({
  label, value, first, at: a,
}) => {
  const k = useK();
  const p = useAppearAt(a, 200);
  return (
    <div
      style={{
        display: "flex", alignItems: "baseline", gap: 16 * k,
        paddingTop: first ? 0 : 14 * k,
        borderTop: first ? undefined : "1px solid rgba(255,255,255,0.07)",
        opacity: p,
        translate: `${lerp(-14, 0, p) * k}px 0`,
      }}
    >
      <span style={{ ...microCap(14 * k), color: ON_DIM, width: 130 * k, whiteSpace: "nowrap" }}>
        {label}
      </span>
      <span style={{ ...tabular(20 * k), color: ON, whiteSpace: "nowrap" }}>{value}</span>
    </div>
  );
};

/* ── beat 8 — one fact per file ──────────────────────────────────────────────
 *
 * Memory's own two levels, which are the SAME two levels the skills act just
 * built — an index that is always paid for, and bodies that are not. Showing
 * them in the identical shape is the argument; a different diagram here would
 * quietly undo the beat before it.
 *
 * The shelf lights a different file each cycle, so the beat keeps working.
 * ─────────────────────────────────────────────────────────────────────────── */

/**
 * Real memories from this project's own store. The third column is sized
 * against the row, not written and hoped for: the name column is fixed and
 * truncates, which leaves ~29 characters here, so every body is under that.
 * The first cut ran "grain and drift, never a flat gradient" straight off the
 * panel's right edge — visible only in a still.
 */
const MEMORIES: [string, string, string][] = [
  ["ep16-palette-is-the-series", "project", "the palette is the series"],
  ["director-wants-shader-fields", "feedback", "grain and drift, never flat"],
  ["watch-pass-is-mandatory", "feedback", "stills are not watching"],
  ["dark-films-need-a-scaled-floor", "reference", "scale the floor by luma"],
  ["publish-to-desktop-shipit", "user", "dot-dirs hide in Finder"],
];

const Recall: React.FC = () => {
  const k = useK();
  const t = useLoop(F(5.0));
  const lit = Math.floor(t * MEMORIES.length) % MEMORIES.length;
  const liftP = clamp01(((t * MEMORIES.length) % 1) / 0.4);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <BoxTag n="06">an index in context, the facts on disk</BoxTag>
      <div style={{ display: "flex", alignItems: "center", gap: 44 * k }}>
        <IndexCard at={F(bt(0.4))} lit={lit} />
        <div style={{ display: "flex", flexDirection: "column", gap: 12 * k }}>
          {MEMORIES.map(([name, kind, body], i) => {
            const on = i === lit;
            return (
              <div
                key={name}
                style={{
                  display: "flex", alignItems: "center", gap: 16 * k,
                  background: PANEL,
                  border: `1px solid ${on ? `${MEM}88` : "rgba(255,255,255,0.10)"}`,
                  borderRadius: R.md * k,
                  padding: `${15 * k}px ${22 * k}px`,
                  width: 860 * k,
                  boxShadow: SHADOW[2],
                  transform: `translateY(${on ? -liftP * 8 * k : 0}px)`,
                  // Same rule as the reference shelf above: dim the content,
                  // never the black surface. A closed memory file is a window
                  // nobody has opened, not a greyed-out row.
                }}
              >
                <Ico name={on ? "pin" : "file"} size={19 * k} color={on ? MEM : "rgba(255,255,255,0.26)"} />
                {/* Fixed width and it TRUNCATES. The names run from 22 to 30
                    characters, so letting the column size itself moves the
                    badge and the body on every row and pushes the longest one
                    off the panel. A clipped filename is also what real UI does. */}
                <span
                  style={{
                    ...tabular(19 * k),
                    color: on ? ON : "rgba(255,255,255,0.38)",
                    width: 420 * k,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    flexShrink: 0,
                  }}
                >
                  {name}.md
                </span>
                <span
                  style={{
                    ...microCap(12 * k), color: on ? MEM : "rgba(255,255,255,0.26)",
                    border: `1px solid ${on ? `${MEM}55` : "rgba(255,255,255,0.12)"}`,
                    borderRadius: R.pill, padding: `${3 * k}px ${10 * k}px`, whiteSpace: "nowrap",
                  }}
                >
                  {kind}
                </span>
                <span
                  style={{
                    ...microCap(13 * k), color: on ? "rgba(255,255,255,0.62)" : "rgba(255,255,255,0.2)",
                    marginLeft: "auto", whiteSpace: "nowrap",
                  }}
                >
                  {on ? body : "—"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <Note at={F(bt(5.2))}>
        One fact per file, so a fact that goes wrong can be deleted without
        taking four true ones with it.
      </Note>
    </div>
  );
};

const IndexCard: React.FC<{ at: number; lit: number }> = ({ at: a, lit }) => {
  const k = useK();
  const p = useAppearAt(a, 200);
  return (
    <div
      style={{
        background: PANEL,
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: R.lg * k,
        width: 620 * k,
        boxShadow: SHADOW[3],
        opacity: p,
        transform: `scale(${lerp(0.95, 1, p)})`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex", alignItems: "center", gap: 12 * k,
          padding: `${16 * k}px ${22 * k}px`,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Ico name="folder" size={19 * k} color={MEM} />
        <span style={{ ...tabular(18 * k), color: "rgba(255,255,255,0.8)" }}>MEMORY.md</span>
        <span style={{ ...microCap(12 * k), color: MEM, marginLeft: "auto", whiteSpace: "nowrap" }}>
          loaded every session
        </span>
      </div>
      <div style={{ padding: `${20 * k}px ${22 * k}px ${24 * k}px` }}>
        {MEMORIES.map(([name], i) => (
          <div
            key={name}
            style={{
              ...tabular(16 * k),
              color: i === lit ? MEM : "rgba(255,255,255,0.4)",
              lineHeight: 1.9,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            - [{name}]({name}.md)
          </div>
        ))}
        <div style={{ ...microCap(13 * k), color: "rgba(255,255,255,0.3)", marginTop: 16 * k, whiteSpace: "nowrap" }}>
          one line each · the facts themselves stay closed
        </div>
      </div>
    </div>
  );
};

/* ── beat 9 — the memory that went wrong (DARK) ──────────────────────────────
 *
 * The failure station and the only true-dark beat in the film. A real memory,
 * written in March, still perfectly formatted, still confidently recalled — and
 * false, because the thing it describes was renamed in June.
 *
 * The whole beat is ONE verification cycle run twice: the memory is recalled,
 * the claim is checked against the repo, and the check FAILS. Modelling the
 * check rather than captioning the problem is what gives the beat something to
 * do for its whole length.
 * ─────────────────────────────────────────────────────────────────────────── */

const Stale: React.FC = () => {
  const k = useK();
  const t = useLoop(F(4.2));
  //   0.00–0.10  idle
  //   0.10–0.42  recalled — it looks fine
  //   0.42–0.74  verifying against what is actually there
  //   0.74–1.00  it does not exist. The memory is wrong.
  const recalled = t > 0.1;
  const verifying = t > 0.42 && t <= 0.74;
  const failed = t > 0.74;
  const scan = clamp01((t - 0.42) / 0.32);
  // The failed phase was 1.1s of held colour — the single longest dead stretch
  // in the film. Now the claim is struck THROUGH across it, so the last quarter
  // of every cycle is the beat's conclusion being drawn rather than displayed.
  const strike = clamp01((t - 0.74) / 0.2);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <BoxTag n="07" tone="dark">a memory does not know it has expired</BoxTag>
      <div style={{ display: "flex", alignItems: "center", gap: 34 * k }}>
        <MemoryCard recalled={recalled} failed={failed} strike={strike} at={F(bt(0.4))} />
        <VerifyMeter scan={scan} verifying={verifying} failed={failed} at={F(bt(1.0))} />
        <TruthCard failed={failed} strike={strike} at={F(bt(1.4))} />
      </div>
      <Note at={F(bt(5.0))} tone="dark">
        It was true in March. Nothing in the file says so, and nothing in the
        recall checks.
      </Note>
    </div>
  );
};

const MemoryCard: React.FC<{
  recalled: boolean; failed: boolean; strike: number; at: number;
}> = ({ recalled, failed, strike, at: a }) => {
  const k = useK();
  const p = useAppearAt(a, 190);
  const tone = failed ? BAD : recalled ? MEM : "rgba(255,255,255,0.3)";
  return (
    <div
      style={{
        background: PANEL,
        border: `1px solid ${failed ? `${BAD}99` : "rgba(255,255,255,0.12)"}`,
        borderRadius: R.lg * k,
        width: 620 * k,
        boxShadow: SHADOW[3],
        opacity: p,
        transform: `scale(${lerp(0.95, 1, p)})`,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* THE VERDICT AS A WASH OVER THE WHOLE CARD, not just a red word.
          The strike-through and the status line are both true and both almost
          no pixels — this beat measured as 4.5 seconds of frozen film with all
          of its state changes happening inside 20px of text. A 620×300 surface
          taking on colour is the same information at a size the eye registers
          at video scale, which is the third fix in station-strip.md and the
          right one here: enlarge what is already moving. */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${BAD}26 0%, ${BAD}0D 100%)`,
          opacity: strike,
        }}
      />
      <div
        style={{
          position: "relative",
          display: "flex", alignItems: "center", gap: 12 * k,
          padding: `${16 * k}px ${22 * k}px`,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Ico name="pin" size={19 * k} color={tone} />
        <span style={{ ...tabular(18 * k), color: "rgba(255,255,255,0.82)", whiteSpace: "nowrap" }}>
          deploy-target.md
        </span>
        <span style={{ ...microCap(12 * k), color: ON_DIM, marginLeft: "auto", whiteSpace: "nowrap" }}>
          written 2026-03-04
        </span>
      </div>
      <div style={{ position: "relative", padding: `${24 * k}px ${24 * k}px ${28 * k}px` }}>
        <div style={{ ...tabular(16 * k), color: "rgba(255,255,255,0.34)", lineHeight: 1.8 }}>
          type: project
        </div>
        <div
          style={{
            ...tabular(23 * k),
            color: failed ? BAD : ON,
            lineHeight: 1.5,
            marginTop: 14 * k,
          }}
        >
          deploys go through{" "}
          <span style={{ position: "relative", background: failed ? `${BAD}33` : "transparent" }}>
            staging.cosx.dev
            {/* the strike draws across the claim rather than appearing on it */}
            <span
              style={{
                position: "absolute",
                left: 0,
                top: "52%",
                height: 2 * k,
                width: `${strike * 100}%`,
                background: BAD,
              }}
            />
          </span>
        </div>
        <div
          style={{
            ...microCap(14 * k),
            color: failed ? BAD : ON_DIM,
            marginTop: 20 * k,
            whiteSpace: "nowrap",
          }}
        >
          {failed ? "that host was renamed in June" : recalled ? "recalled · looks perfectly fine" : "on disk"}
        </div>
      </div>
    </div>
  );
};

const VerifyMeter: React.FC<{
  scan: number; verifying: boolean; failed: boolean; at: number;
}> = ({ scan, verifying, failed, at: a }) => {
  const k = useK();
  const p = useAppearAt(a, 190);
  const tone = failed ? BAD : verifying ? MEM : "rgba(255,255,255,0.3)";
  return (
    // 420 wide and a 20px bar, up from 300 and 8. This column carries the
    // beat's only continuous movement and at the original size it was a
    // legible instrument made of almost no pixels — genuine motion that
    // neither the audit nor a viewer registers at video scale.
    <div style={{ width: 420 * k, textAlign: "center", opacity: p }}>
      <Ico name={failed ? "cross" : "search"} size={54 * k} color={tone} />
      <div style={{ height: 22 * k }} />
      <div
        style={{
          height: 20 * k, borderRadius: 10 * k,
          background: "rgba(255,255,255,0.09)", overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${Math.max(1, scan * 100)}%`, height: "100%",
            background: tone, borderRadius: 10 * k,
          }}
        />
      </div>
      <div style={{ ...microCap(14 * k), color: tone, marginTop: 18 * k, whiteSpace: "nowrap" }}>
        {failed ? "does not exist" : verifying ? "verifying…" : "not checked"}
      </div>
    </div>
  );
};

const TruthCard: React.FC<{ failed: boolean; strike: number; at: number }> = ({
  failed, strike, at: a,
}) => {
  const k = useK();
  const p = useAppearAt(a, 190);
  return (
    <div
      style={{
        background: PANEL,
        border: `1px solid ${failed ? `${OK}66` : "rgba(255,255,255,0.12)"}`,
        borderRadius: R.lg * k,
        width: 620 * k,
        boxShadow: SHADOW[3],
        opacity: p,
        transform: `scale(${lerp(0.95, 1, p)})`,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* the answering half of the wash — the truth lights as the memory fails */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${OK}22 0%, ${OK}0A 100%)`,
          opacity: strike,
        }}
      />
      <div
        style={{
          position: "relative",
          display: "flex", alignItems: "center", gap: 12 * k,
          padding: `${16 * k}px ${22 * k}px`,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Ico name="folder" size={19 * k} color={failed ? OK : "rgba(255,255,255,0.3)"} />
        <span style={{ ...tabular(18 * k), color: "rgba(255,255,255,0.82)" }}>the repo, today</span>
      </div>
      <div style={{ position: "relative", padding: `${24 * k}px ${24 * k}px ${28 * k}px` }}>
        <div style={{ ...tabular(16 * k), color: "rgba(255,255,255,0.34)", lineHeight: 1.8 }}>
          .github/workflows/deploy.yml
        </div>
        <div
          style={{
            ...tabular(23 * k),
            color: failed ? OK : "rgba(255,255,255,0.34)",
            lineHeight: 1.5,
            marginTop: 14 * k,
          }}
        >
          host: preview.cosx.app
        </div>
        <div
          style={{
            ...microCap(14 * k),
            color: failed ? OK : ON_DIM,
            marginTop: 20 * k,
            whiteSpace: "nowrap",
          }}
        >
          {failed ? "the file was right here the whole time" : "never consulted"}
        </div>
      </div>
    </div>
  );
};

/* ── beat 10 — sort it before you save it ────────────────────────────────────
 *
 * The refusal, and the last thing the film says. Three bins, and the third is
 * the one that matters: most of what an agent is tempted to remember is already
 * written down somewhere that cannot go stale.
 *
 * Items fall into their bins on a loop, so the beat is still arguing when the
 * narration reaches the last line rather than having assembled and stopped.
 * ─────────────────────────────────────────────────────────────────────────── */

/**
 * THE DISTRIBUTION IS THE ARGUMENT, so it has to be true on the frame. The
 * header says most of it goes in the third bin; the first cut of this beat put
 * two items in each, which made the picture flatly contradict its own caption.
 * Five of nine now land in "nowhere", which is both the honest ratio and the
 * only reason the station is worth its eight seconds.
 */
const ITEMS: [string, 0 | 1 | 2][] = [
  ["how we cut an episode", 0],
  ["the palette EP16 set", 1],
  ["what src/lib/kit.tsx does", 2],
  ["“always watch it before shipping”", 1],
  ["the bug we fixed last Tuesday", 2],
  ["the render + verify checklist", 0],
  ["which files import cards.tsx", 2],
  ["the house rules in CLAUDE.md", 2],
  ["last week's git history", 2],
];

const BINS: [string, string, string][] = [
  ["→ a skill", "a procedure, reusable", "#533AFD"],
  ["→ memory", "true, and only you know it", MEM],
  ["→ nowhere", "the repo already records it", "rgba(255,255,255,0.34)"],
];

const Divide: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  // FILLS AND HOLDS, rather than looping. Every other station in this film
  // cycles, because a cycle keeps a middle beat alive. This is the last thing
  // the film teaches, and it has to END on the complete picture — a loop here
  // restarted at 6.4s and left the closing station almost empty underneath its
  // own conclusion.
  const t = clamp01((frame - F(bt(0.5))) / F(5.6));
  const head = t * (ITEMS.length + 1.4);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <BoxTag n="08">three bins, and most of it goes in the third</BoxTag>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 26 * k }}>
        {BINS.map(([title, sub, hue], b) => (
          <div
            key={title}
            style={{
              background: PANEL,
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: R.lg * k,
              padding: `${26 * k}px ${26 * k}px`,
              width: 520 * k,
              minHeight: 400 * k,
              boxShadow: SHADOW[3],
            }}
          >
            <div style={{ ...display(34 * k, -0.03), fontWeight: 400, color: hue, whiteSpace: "nowrap" }}>
              {title}
            </div>
            <div style={{ ...microCap(14 * k), color: ON_DIM, marginTop: 10 * k, whiteSpace: "nowrap" }}>
              {sub}
            </div>
            <div style={{ marginTop: 24 * k, display: "flex", flexDirection: "column", gap: 10 * k }}>
              {ITEMS.map(([label, bin], i) => {
                if (bin !== b) return null;
                // An INTERPOLATED drop, not a binary flip. Nine rows switching
                // state on one frame each is real information and almost no
                // pixels; the same nine falling ~26px into place over a third
                // of a second is the same information at a size the eye — and
                // the pacing audit — actually registers.
                const land = clamp01((head - (i + 1)) / 0.9);
                const eased = 1 - Math.pow(1 - land, 3);
                return (
                  <div
                    key={label}
                    style={{
                      display: "flex", alignItems: "center", gap: 12 * k,
                      border: `1px solid rgba(255,255,255,${0.06 + 0.12 * eased})`,
                      borderRadius: R.sm * k,
                      padding: `${11 * k}px ${16 * k}px`,
                      opacity: 0.16 + 0.84 * eased,
                      translate: `0 ${lerp(-26, 0, eased) * k}px`,
                    }}
                  >
                    <Ico
                      name={b === 2 ? "trash" : b === 0 ? "tag" : "brain"}
                      size={17 * k}
                      color={eased > 0.6 ? hue : "rgba(255,255,255,0.2)"}
                    />
                    <span
                      style={{
                        ...tabular(18 * k),
                        color: eased > 0.6 ? ON : "rgba(255,255,255,0.3)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <Note at={F(bt(5.4))}>
        A memory that repeats the repo is not free. It is a second copy that is
        allowed to disagree.
      </Note>
    </div>
  );
};

/* ── beat 11 — the end card ──────────────────────────────────────────────── */

const EndCard: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const fade = (a: number, b: number) =>
    interpolate(frame, [F(a), F(b)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // The sign-off waits for the map. Everything below is offset by SIGN.
  const SIGN = 3.0;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ opacity: fade(0.15, 0.7) * (1 - 0.88 * fade(SIGN - 0.5, SIGN + 0.5)) }}>
        <RouteMap />
      </div>
      <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div
          style={{
            ...display(100 * k, -0.045), color: "#FFFFFF", opacity: fade(SIGN, SIGN + 0.5),
            translate: `0 ${interpolate(frame, [F(SIGN), F(SIGN + 0.7)], [26, 0], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.2, 1, 0.3, 1),
            }) * k}px`,
            textShadow: `0 ${8 * k}px ${40 * k}px rgba(4,8,40,0.5)`,
          }}
        >
          Thanks for watching.
        </div>
        <div
          style={{
            width: interpolate(frame, [F(SIGN + 0.7), F(SIGN + 2.4)], [0, 440 * k], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.25, 0, 0.15, 1),
            }),
            height: 3 * k, background: "rgba(255,255,255,0.9)", marginTop: 34 * k,
          }}
        />
        <div
          style={{
            marginTop: 34 * k, ...display(40 * k, -0.02), fontWeight: 400,
            color: "#FFFFFF", opacity: fade(SIGN + 1.1, SIGN + 1.6),
          }}
        >
          Bishakh
        </div>
        <div
          style={{
            marginTop: 20 * k, ...microCap(22 * k), color: "rgba(255,255,255,0.86)",
            opacity: fade(SIGN + 1.6, SIGN + 2.1), whiteSpace: "nowrap",
          }}
        >
          {cfg.next}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** The eight stations, in the order the camera walked them. */
const MAP_LABELS: Record<string, string> = {
  deck: "the deck", label: "the label", match: "the match", deeper: "level three",
  memory: "the other half", recall: "the index", stale: "gone stale", divide: "sort it",
};

const RouteMap: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const ids = STRIP_IDS.filter((id) => id !== "end");
  const CW_ = 300, CH_ = 170;
  const pts = ids.map((id) => {
    const [cx, cy] = cellOf(id);
    return { id, x: cx * CW_ + CW_ / 2, y: cy * CH_ + CH_ / 2 };
  });
  const W = 4 * CW_, H = 2 * CH_;
  const drawn = clamp01((frame - F(0.5)) / F(2.0));
  const lit = drawn * ids.length;

  const d = pts.map((p, i) => `${i ? "L" : "M"} ${p.x} ${p.y}`).join(" ");

  return (
    <div style={{ position: "relative", width: W * k, height: H * k }}>
      <svg
        width={W * k} height={H * k} viewBox={`0 0 ${W} ${H}`}
        style={{ position: "absolute", inset: 0, overflow: "visible" }}
      >
        <path d={d} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth={2.5} />
        <path
          d={d} fill="none" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round"
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
              display: "flex", flexDirection: "column", alignItems: "center", gap: 8 * k,
              opacity: on ? 1 : 0.22,
            }}
          >
            <span
              style={{
                width: 13 * k, height: 13 * k, borderRadius: "50%",
                background: on ? "#FFFFFF" : "rgba(255,255,255,0.35)",
                boxShadow: on ? `0 0 ${14 * k}px rgba(255,255,255,0.8)` : undefined,
              }}
            />
            <span style={{ ...tabular(15 * k), color: "rgba(255,255,255,0.55)" }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span
              style={{
                ...microCap(13 * k), letterSpacing: "0.16em",
                color: "rgba(255,255,255,0.86)", whiteSpace: "nowrap",
              }}
            >
              {MAP_LABELS[p.id]}
            </span>
          </div>
        );
      })}
    </div>
  );
};

/* ── the mix ─────────────────────────────────────────────────────────────────
 *
 * The bed sits at `open` and ducks to `under` while a line plays, off the SAME
 * schedule the picture uses so it cannot drift from the cut. The title and the
 * end card carry no line, which is where it lifts the full 7dB — that is the
 * entire reason those two beats exist.
 * ─────────────────────────────────────────────────────────────────────────── */

/**
 * 0.62 / 0.26, not the 0.34 / 0.15 EP13–19 use.
 *
 * Those numbers were set against ElevenLabs-generated beds. This episode is
 * scored with a CC0 recording (arseniiv's piano loop) which is mastered about
 * 5dB quieter, and at the house levels the film measured with the title at
 * −30.2dB and the end card at −31.8dB against VO beats at −25 to −27 — the bed
 * DROPPING on the two beats that exist for it to lift on.
 *
 * The levels are a property of the bed, not of the series. Peak stays safe:
 * the source maxes at −8.1dB, so 0.62 puts the loudest moment at −11.8dB.
 */
const OPEN = 0.62;
const UNDER = 0.26;
const HAS_VO = Boolean(cfg.audio?.vo);

const bedVolume = (f: number) => {
  const t = f / EP20_FPS;
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
  const tail = clamp01((EP20_SECONDS - t) / 1.6);
  return v * head * tail;
};

const Track: React.FC = () => (
  <>
    {cfg.audio?.music && (
      <Sequence from={0} durationInFrames={EP20_DURATION} layout="none" name="score">
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

    {/* One cue per station arrival — the travel resolving, nothing else. The
        two ACT BREAKS get a different pair: a riser under the lift and a thunk
        on the landing, because a move that means "new section" has to sound
        like one or it is just a longer slide. */}
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

    <Cue name="thunk" at={F(at("title") + 0.35)} volume={0.34} />
    {/* the two act slates landing — the square, then the title */}
    {ACTS.map((a) => (
      <React.Fragment key={a.n}>
        <Cue name="thunk" at={F(a.at + 0.06)} volume={0.32} />
        <Cue name="latch" at={F(a.at + 0.95)} volume={0.24} />
      </React.Fragment>
    ))}

    {/* 1 — the three levels filling, then the overflow */}
    <Cue name="tick" at={F(at("open") + 1.0)} volume={0.22} />
    <Cue name="tick" at={F(at("open") + 1.6)} volume={0.22} />
    <Cue name="error" at={F(at("open") + 3.4)} volume={0.26} />

    {/* 01 — the deck advancing. One tick per card that arrives in focus. */}
    {Array.from({ length: 4 }).map((_, i) => (
      <Cue key={`d${i}`} name="tick" at={F(at("deck") + bt(0.2) + (i + 1) * 2.3)} volume={0.2} />
    ))}
    <Cue name="latch" at={F(at("deck") + bt(1.4))} volume={0.24} />

    {/* 02 — the frontmatter typing, the fence drawing, the body arriving */}
    <TypeCues text={FM_LINES[0]} start={F(at("label") + bt(0.6))} cps={26} volume={0.17} max={24} />
    <Cue name="sub" at={F(at("label") + bt(3.2))} volume={0.28} />
    <Cue name="blip" at={F(at("label") + bt(3.8))} volume={0.2} />

    {/* 03 — the match: the task lands, the race, the win, twice */}
    {[0, 1].map((c) => (
      <React.Fragment key={`m${c}`}>
        <Cue name="click" at={F(at("match") + bt(0.3) + c * 4.6)} volume={0.26} />
        <Cue name="success" at={F(at("match") + bt(3.1) + c * 4.6)} volume={0.28} />
      </React.Fragment>
    ))}

    {/* 04 — the ladder landing, then the files opening one at a time */}
    {[0, 1, 2].map((i) => (
      <Cue key={`l${i}`} name="latch" at={F(at("deeper") + bt(0.4)) + i * 14} volume={0.22} />
    ))}
    {Array.from({ length: 5 }).map((_, i) => (
      <Cue key={`rf${i}`} name="blip" at={F(at("deeper") + bt(1.2) + i * 0.74)} volume={0.16} />
    ))}

    {/* 05 — the divide drawing, then the two columns */}
    <Cue name="sub" at={F(at("memory") + bt(0.5))} volume={0.28} />
    <Cue name="latch" at={F(at("memory") + bt(1.0))} volume={0.24} />
    <Cue name="latch" at={F(at("memory") + bt(1.6))} volume={0.24} />

    {/* 06 — the shelf lighting, one file at a time */}
    {Array.from({ length: 5 }).map((_, i) => (
      <Cue key={`mm${i}`} name="tick" at={F(at("recall") + bt(0.6) + i * 1.0)} volume={0.18} />
    ))}

    {/* 07 — recall, verify, fail. Twice. */}
    {[0, 1].map((c) => (
      <React.Fragment key={`s${c}`}>
        <Cue name="blip" at={F(at("stale") + bt(0.6) + c * 4.2)} volume={0.22} />
        <Cue name="error" at={F(at("stale") + bt(3.3) + c * 4.2)} volume={0.28} />
      </React.Fragment>
    ))}

    {/* 08 — the nine items landing in their bins */}
    {/* derived from the SAME fill curve the picture uses — an item lands when
        `head` passes i+1, so the tick is at bt(0.5 + (i+1)/10.4 × 5.6) */}
    {Array.from({ length: ITEMS.length }).map((_, i) => (
      <Cue
        key={`b${i}`}
        name="tick"
        at={F(at("divide") + bt(0.5 + ((i + 1) / (ITEMS.length + 1.4)) * 5.6))}
        volume={0.19}
      />
    ))}
    <Cue name="success" at={F(at("divide") + bt(5.6))} volume={0.26} />

    <Cue name="thunk" at={F(at("end") + 0.3)} volume={0.34} />
  </>
);

void MONO;
