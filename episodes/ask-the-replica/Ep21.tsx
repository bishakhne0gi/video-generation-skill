// Author: Bishakh
//
// EP 21 — "Ask the Replica. It Answers From the Past."
// A read replica is not a second copy of the truth. It is the truth as of a
// moment ago, and the whole craft is deciding which reads can live in the past.
//
// THE CONSTRUCTION is EP 16 / EP 18 / EP 20's, unchanged: one continuous canvas
// the camera travels on a serpentine, stations instead of slides, one
// stroke-icon family, real product panels, the box pattern, two overlaid act
// slates, a continuity chip pinned outside the strip. Same palette too —
// `stripe-mesh`, white canvas, deep-navy ink, indigo #533AFD as the one filled
// hue. The construction and the palette ARE the series.
//
// THREE THINGS ARE THIS EPISODE'S OWN.
//
// 1. THE FIELD is `WalField` (lib/gradient.tsx), new for this film. The mesh
//    wanders but never goes anywhere; this episode is about something moving
//    from a primary to a replica, so the field had to acquire a DIRECTION. Soft
//    horizontal streaks travelling left to right at mutually incommensurate
//    speeds — the differential between them is the subject of the episode, read
//    without being named. And the ACT TWO COOL SHIFT the director asked for
//    lives here and ONLY here: `WAL_AZURE_COLD` is the same current a few
//    degrees colder, declared per station, so the temperature turns across the
//    act-break lift while the ink, the accent and the type never move.
//
// 2. THE LAG RULER (`LagRuler`) is the protagonist. One shared WAL position
//    ruler carrying four heads — sent, write, flush, replay — and the DISTANCE
//    between the primary's head and the replica's replay head IS the argument.
//    It is drawn on three different stations doing three different jobs, and it
//    is the same object each time. The four heads are not invented: they are
//    `pg_stat_replication`'s own columns, and each of the three lag columns maps
//    exactly onto one `synchronous_commit` level, which is the single most
//    useful thing in the episode and the reason station 03 exists.
//
// 3. THE LOCATOR (`Locator`) answers the director's note that the film must show
//    WHERE each mechanism happens. Three lanes — APP / PRIMARY / REPLICA — and a
//    wire between the last two, pinned outside the strip beside the chip. Every
//    station lights the lane its mechanism actually lives in. Fan-out lights the
//    primary; streaming lights the wire; the commit knob lights the primary; the
//    stale read lights the app reading the replica; routing lights the app
//    alone. It is why the film can carry eight different instruments without the
//    viewer losing the topology.
//
// EVERY FIGURE ON SCREEN IS DOCUMENTED AND THE SOURCE IS CAPTIONED UNDER IT.
// Nothing here is presented as measured on this machine — that was EP 20's
// device and this episode does not borrow it. The `Src` component exists so a
// figure cannot be drawn without saying where it came from. See CREDITS.md for
// the checked list; every one was read from the source before it was drawn.

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
import { SANS, GEIST, HEAD } from "../fonts";
import { useK, useAppearAt, useLoop, lerp, clamp01 } from "../lib/anim";
import {
  WalField,
  Grain,
  WAL_AZURE,
  WAL_AZURE_COLD,
  WAL_AZURE_DEEP,
  WAL_WASH,
  WAL_WASH_COLD,
  WAL_WASH_DEEP,
  WAL_WASH_DEEP_COLD,
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
// Its OWN measured lengths, for the reason EP20 learned the hard way:
// `vo-durations.json` at the repo root is a SINGLE SHARED file, so the next
// episode with fewer lines makes `durs[8]` undefined here and this
// composition's durationInFrames becomes NaN — a hard render failure in a film
// nobody touched. Repointed to the archive at publish time.
import durs from "../../episodes/ask-the-replica/vo-durations.json";

export const EP21_FPS = 30;
export const PAL21 = buildPalette("stripe-mesh");

const F = (n: number) => Math.round(n * EP21_FPS);

// Every panel in this film is this black. Not a tone per component, not a
// coloured edge to tell them apart — the CONTENT tells them apart.
const PANEL = "#0B0E14";
const ON = "#FFFFFF";
const ON_DIM = "rgba(255,255,255,0.45)";
const HAIR = "1px solid rgba(255,255,255,0.12)";

/**
 * Indigo is the PRIMARY and it is the brand's one filled hue. The replica gets
 * EP16 / EP18 / EP20's second hue unchanged, which is deliberate series
 * continuity: cool teal has meant "the downstream, derived, eventually-true
 * half" in all three, and that is exactly what a replica is.
 *
 * The field's own hues are NOT in this list and never fill anything.
 */
const PRIMARY = PAL21.accent;
const REPLICA = "#22B8CF";
const BAD = "#C0123C";
const OK = "#0F9D58";

/* ── the schedule ────────────────────────────────────────────────────────────
 *
 * Scene seconds = VO + 0.35s breath, snapped UP to the 84bpm grid, off measured
 * narration lengths. Nothing here is hand-guessed, and re-recording a line
 * re-times every cut, camera key and cue below.
 * ─────────────────────────────────────────────────────────────────────────── */

const BREATH = 0.35;

type BeatDef = { id: string; vo?: number; hold?: number };

const DEFS: BeatDef[] = [
  { id: "open", vo: 1 }, // reads multiply, writes do not
  { id: "title", hold: 4.6 }, // ── silent: the bed lifts
  { id: "fanout", vo: 2 }, // one primary, N replicas
  { id: "stream", vo: 3 }, // it ships WAL, not queries
  { id: "sync", vo: 4 }, // the commit knob
  { id: "lag", vo: 5 }, // the gap, measured
  { id: "stale", vo: 6 }, // ← ACT BREAK: the failure (DARK)
  { id: "route", vo: 7 }, // read-your-writes routing
  { id: "notcqrs", vo: 8 }, // this is not CQRS
  { id: "notbackup", vo: 9 }, // and it is not a backup
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

export const EP21_SECONDS = START[START.length - 1] + LEN[LEN.length - 1];
export const EP21_DURATION = Math.round(EP21_SECONDS * EP21_FPS);

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
 *   row 0 — what it buys you   fanout · stream · sync · lag
 *   row 1 — what it costs you  stale · route · notcqrs · notbackup  (back)
 *   row 2 — the sign-off       end
 * ─────────────────────────────────────────────────────────────────────────── */

const G = 100; // one cell = one frame, in %

const ROUTE: Record<string, [number, number]> = {
  fanout: [0, 0], stream: [1, 0], sync: [2, 0], lag: [3, 0],
  stale: [3, 1], route: [2, 1], notcqrs: [1, 1], notbackup: [0, 1],
  end: [0, 2],
};

const cellOf = (id: string) => ROUTE[id] ?? [0, 0];
/** True when arriving at `id` means changing act — the two lift moves. */
export const isActBreak = (id: string) => {
  const i = STRIP_IDS.indexOf(id);
  return i > 0 && cellOf(STRIP_IDS[i - 1])[1] !== cellOf(id)[1];
};
/** Act 1 is row 0; act 2 is row 1 and the sign-off. Drives the field's temperature. */
const isAct2 = (id: string) => cellOf(id)[1] >= 1;

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

/* ── SOUND-OFF MODE ──────────────────────────────────────────────────────────
 *
 * The scored film teaches through narration plus short labels, which is correct
 * on YouTube and useless in a feed, where the overwhelming majority of plays are
 * muted. `silent` builds the same film with the voice's job done by the picture:
 *
 *   1. A LEAD LINE per station — the beat's one idea in a handful of words, set
 *      big, directly under the box tag. This is what a scroller reads.
 *   2. A CAPTION BAND carrying the actual narration line, timed to the same
 *      windows the score ducks against, for anyone who stops.
 *   3. No audio track at all.
 *
 * It deliberately breaks the house rule that narration never appears on screen
 * as a sentence. That rule protects a film you WATCH; this cut is for a film
 * nobody hears, and the rule's reason — that captions make a video feel like a
 * talking head with the head removed — is answered by the lead lines carrying
 * the teaching, with the captions as a second layer rather than the only one.
 *
 * Both cuts share every timing, so the two files are the same length and the
 * archive stays a single composition.
 * ─────────────────────────────────────────────────────────────────────────── */

const SilentCtx = React.createContext(false);
const useSilent = () => React.useContext(SilentCtx);

export const Ep21: React.FC<{ silent?: boolean }> = ({ silent = false }) => (
  <SilentCtx.Provider value={silent}>
    <AbsoluteFill style={{ background: PAL21.bg, fontFeatureSettings: '"ss01"' }}>
      <Sequence from={0} durationInFrames={F(len("open"))} name="1 · reads multiply, writes do not">
        <ColdOpen />
      </Sequence>

      <Sequence from={F(at("title"))} durationInFrames={F(len("title"))} name="2 · title">
        <TitleCard />
      </Sequence>

      <Sequence
        from={F(STRIP_T0)}
        durationInFrames={EP21_DURATION - F(STRIP_T0)}
        name="3–11 · the strip"
      >
        <Strip />
      </Sequence>

      <Thread pal={PAL21} from={STRIP_T0} to={endOf("notbackup")} />
      <RowTrail />
      <Locator />
      <Captions />

      {/* LAST, so the wash covers the pinned chip, the locator and the thread. */}
      <ActSlate />

      <Track />
    </AbsoluteFill>
  </SilentCtx.Provider>
);

/**
 * The beat's one idea, in a handful of words. Only in the sound-off cut.
 *
 * These are written to be READ AT A GLANCE while scrolling, so they are shorter
 * and blunter than the narration and they never repeat the box tag beside them.
 */
const LEADS: Record<string, string> = {
  fanout: "Reads multiply. Writes do not.",
  stream: "The replica replays bytes, not queries.",
  sync: "Choose which head your commit waits for.",
  lag: "Lag is a distance in the log.",
  stale: "Both returned 200. One of them was old.",
  route: "A user's own reads go to the primary.",
  notcqrs: "A late copy — not a different model.",
  notbackup: "It copies the mistake just as faithfully.",
};

const Lead: React.FC<{ id: string; tone?: "light" | "dark" }> = ({ id, tone = "light" }) => {
  const k = useK();
  const silent = useSilent();
  const p = useAppearAt(F(bt(0.15)), 200);
  if (!silent || !LEADS[id]) return null;
  return (
    <div
      style={{
        ...display(44 * k, -0.035),
        color: tone === "dark" ? "rgba(255,255,255,0.95)" : PAL21.ink,
        marginTop: -14 * k,
        marginBottom: 32 * k,
        textAlign: "center",
        opacity: p,
        translate: `0 ${lerp(-10, 0, p) * k}px`,
        whiteSpace: "nowrap",
      }}
    >
      {LEADS[id]}
    </div>
  );
};

/**
 * The narration, on screen, timed to the windows it actually plays in — the
 * same `START[i]` and `durs[]` the score ducks against, so a re-record re-times
 * the captions along with everything else.
 *
 * It sits ABOVE the chip and locator row rather than in the usual subtitle
 * position, because that row is already occupied by two pinned panels and a
 * caption laid over them would collide on every frame of the film.
 */
const Captions: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const silent = useSilent();
  const t = frame / EP21_FPS;

  let idx = -1;
  DEFS.forEach((d, i) => {
    if (d.vo && t >= START[i] - 0.15 && t < START[i] + durs[d.vo - 1] + 0.35) idx = i;
  });
  if (!silent || idx < 0) return null;

  const d = DEFS[idx];
  const line = cfg.vo[d.vo! - 1].text;
  const a = START[idx];
  const b = a + durs[d.vo! - 1];
  const fade = clamp01((t - (a - 0.15)) / 0.28) * clamp01((b + 0.35 - t) / 0.32);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 122 * k,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        opacity: fade,
      }}
    >
      <div
        style={{
          maxWidth: 1360 * k,
          background: PANEL,
          border: HAIR,
          borderRadius: R.md * k,
          padding: `${14 * k}px ${28 * k}px`,
          boxShadow: SHADOW[3],
          ...display(29 * k, -0.015),
          fontWeight: 300,
          color: "rgba(255,255,255,0.94)",
          textAlign: "center",
          lineHeight: 1.42,
          translate: `0 ${lerp(10, 0, fade) * k}px`,
        }}
      >
        {line}
      </div>
    </div>
  );
};

/* ── the field ───────────────────────────────────────────────────────────────
 *
 * Wired once so every use of it in the film is the same object on the same
 * clock. `atSeconds` is threaded through from the station so the streaks travel
 * continuously across the whole episode instead of restarting at each stop —
 * which is the entire reason the film reads as one current travelled rather
 * than nine backgrounds visited.
 * ─────────────────────────────────────────────────────────────────────────── */

const Wal: React.FC<{
  atSeconds?: number;
  intensity?: number;
  cold?: boolean;
  /** The saturated ground — pale streaks over a deep wash. Title, open, end card. */
  deep?: boolean;
  base?: string;
  grain?: number;
  grainBlend?: React.CSSProperties["mixBlendMode"];
}> = ({
  atSeconds,
  intensity = 1,
  cold = false,
  deep = false,
  base,
  grain = 28,
  grainBlend = "multiply",
}) => (
  <WalField
    streaks={deep ? WAL_AZURE_DEEP : cold ? WAL_AZURE_COLD : WAL_AZURE}
    wash={deep ? (cold ? WAL_WASH_DEEP_COLD : WAL_WASH_DEEP) : cold ? WAL_WASH_COLD : WAL_WASH}
    base={base ?? PAL21.bg}
    intensity={intensity}
    grain={grain}
    grainBlend={grainBlend}
    atSeconds={atSeconds}
  />
);

/** The shimmer, in this film's hues. */
const SHIMMER = ["#FFFFFF", "#D3E6FD", "#78B8F9", "#A8C0FF", "#FFFFFF"];

/**
 * A soft pool of shade under centred white type. The deep field runs from pale
 * to saturated across the frame, so any FIXED text colour is illegible
 * somewhere on it; picking a grey that survives both ends just means grey.
 */
const Scrim: React.FC<{ strength?: number }> = ({ strength = 0.34 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(64% 48% at 50% 52%, rgba(6,10,40,${strength}) 0%, rgba(6,10,40,0) 74%)`,
    }}
  />
);

/* ── shared furniture ────────────────────────────────────────────────────── */

/**
 * A source caption. This exists so a figure cannot be put on screen without
 * saying where it came from — the episode's whole honesty budget is that every
 * number is documented and captioned, and a component makes that structural
 * rather than a thing I have to remember eight times.
 */
const Src: React.FC<{ children: React.ReactNode; tone?: "light" | "dark" }> = ({
  children,
  tone = "light",
}) => {
  const k = useK();
  return (
    <div
      style={{
        ...microCap(13 * k),
        letterSpacing: "0.14em",
        color: tone === "dark" ? "rgba(255,255,255,0.34)" : PAL21.textMuted,
        opacity: tone === "dark" ? 1 : 0.7,
        marginTop: 9 * k,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
};

const Panel: React.FC<{
  children: React.ReactNode;
  pad?: number;
  style?: React.CSSProperties;
}> = ({ children, pad = 22, style }) => {
  const k = useK();
  return (
    <div
      style={{
        background: PANEL,
        border: HAIR,
        borderRadius: R.lg * k,
        padding: pad * k,
        boxShadow: SHADOW[3],
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/* ── icons ──────────────────────────────────────────────────────────────────
 *
 * A labelled rectangle is a rectangle. The same rectangle with a cylinder in it
 * is A DATABASE, and the viewer knows that before reading a word. One weight,
 * one radius, one size, so they read as a family rather than clip art.
 * ─────────────────────────────────────────────────────────────────────────── */

type IcoName =
  | "db" | "app" | "wire" | "check" | "cross" | "clock" | "bolt" | "arrow"
  | "trash" | "layers" | "lock" | "eye" | "warn" | "split" | "log" | "user";

const Ico: React.FC<{ name: IcoName; size: number; color: string }> = ({ name, size, color }) => {
  const P: Record<IcoName, React.ReactNode> = {
    db: <><ellipse cx="12" cy="6" rx="7.5" ry="3" /><path d="M4.5 6v12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6" /><path d="M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3" /></>,
    app: <><rect x="3" y="4" width="18" height="16" rx="2.5" /><path d="M3 8.5h18M6.2 6.3h.01M8.8 6.3h.01" /></>,
    wire: <><path d="M3 12h5M16 12h5" /><circle cx="12" cy="12" r="3.2" /></>,
    check: <path d="M4.5 12.6 9.5 17.6 19.5 6.6" />,
    cross: <path d="M6 6l12 12M18 6 6 18" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 6.6V12l3.6 2.2" /></>,
    bolt: <path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12z" />,
    arrow: <path d="M4 12h15m-5.5-5.5L19.5 12l-6 5.5" />,
    trash: <><path d="M4 6.5h16M9.5 6.5V4h5v2.5" /><path d="M6.5 6.5 7.6 21h8.8l1.1-14.5" /><path d="M10 10.5v7M14 10.5v7" /></>,
    layers: <><path d="m12 3 9 5-9 5-9-5z" /><path d="m3 13 9 5 9-5" /><path d="m3 17.5 9 5 9-5" /></>,
    lock: <><rect x="4.5" y="10.5" width="15" height="10" rx="2" /><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" /></>,
    eye: <><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" /><circle cx="12" cy="12" r="3" /></>,
    warn: <><path d="M12 3.5 22 20H2z" /><path d="M12 9.5v5M12 17.2h.01" /></>,
    split: <><path d="M4 12h6l4-5h6M14 17h6" /><path d="M17.5 3.5 21 7l-3.5 3.5M17.5 13.5 21 17l-3.5 3.5" /></>,
    log: <><rect x="3.5" y="4" width="17" height="16" rx="2" /><path d="M7 9h10M7 12.5h10M7 16h6" /></>,
    user: <><circle cx="12" cy="8" r="3.8" /><path d="M4.5 20c0-3.6 3.4-6 7.5-6s7.5 2.4 7.5 6" /></>,
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
        marginBottom: 34 * k,
        opacity: p,
        translate: `0 ${lerp(-8, 0, p) * k}px`,
      }}
    >
      <span
        style={{
          background: PAL21.accent,
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
          border: `1px solid ${dark ? "rgba(255,255,255,0.22)" : PAL21.border}`,
          borderLeft: "none",
          borderRadius: `0 ${R.md * k}px ${R.md * k}px 0`,
          padding: `${9 * k}px ${20 * k}px`,
          ...microCap(19 * k),
          color: dark ? "rgba(255,255,255,0.72)" : PAL21.textMuted,
          display: "flex",
          alignItems: "center",
          background: dark ? "transparent" : `${PAL21.bg}CC`,
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
  const silent = useSilent();
  const p = useAppearAt(a, 200);
  // In the sound-off cut the lead line carries the idea and the caption band
  // carries the narration, both of them prose. A third block of prose in the
  // same frame is clutter — and worse, this one sits exactly where the caption
  // band goes, so the two overlap on every station.
  if (silent) return null;
  return (
    <div
      style={{
        marginTop: 28 * k,
        fontFamily: SANS,
        fontWeight: 300,
        fontSize: 28 * k,
        color: tone === "dark" ? "rgba(255,255,255,0.7)" : PAL21.textMuted,
        opacity: p,
        translate: `0 ${lerp(8, 0, p) * k}px`,
        textAlign: "center",
      }}
    >
      {children}
    </div>
  );
};

/* ── THE LAG RULER — the protagonist ─────────────────────────────────────────
 *
 * One WAL position ruler, drawn on three stations doing three different jobs,
 * and it is the same object each time. That is what makes it a protagonist
 * rather than a chart that happens to recur.
 *
 * The four heads are `pg_stat_replication`'s own columns and they are in the
 * order the bytes actually reach them:
 *
 *   sent_lsn   — the primary has put it on the wire
 *   write_lsn  — the standby has written it to its OS
 *   flush_lsn  — the standby has flushed it to durable storage
 *   replay_lsn — the standby has APPLIED it, so a query there can see it
 *
 * Only the last one is visibility, which is the entire episode in one sentence,
 * and it is why the gap that matters is measured to `replay_lsn` and not to any
 * of the three cheaper heads in front of it.
 * ─────────────────────────────────────────────────────────────────────────── */

const HEADS = [
  { key: "sent", label: "sent_lsn", tone: PRIMARY },
  { key: "write", label: "write_lsn", tone: REPLICA },
  { key: "flush", label: "flush_lsn", tone: REPLICA },
  { key: "replay", label: "replay_lsn", tone: REPLICA },
] as const;

type HeadKey = (typeof HEADS)[number]["key"];

/** A believable LSN for a position 0–1 along the ruler. */
const lsn = (p: number) => {
  const base = 0x16b0000;
  const v = Math.round(base + p * 0x9f000);
  return `0/${v.toString(16).toUpperCase()}`;
};

const RULER_W = 1180;

const LagRuler: React.FC<{
  /** 0–1 positions along the ruler. `write` is the primary's own head. */
  head: number;
  heads: Record<HeadKey, number>;
  /** Which head is currently the one being waited for, if any. */
  waiting?: HeadKey | null;
  /** Draw and label the gap between the primary head and replay. */
  showGap?: boolean;
  tone?: "light" | "dark";
  at?: number;
}> = ({ head, heads, waiting = null, showGap = true, tone = "light", at: a = 0 }) => {
  const k = useK();
  const p = useAppearAt(a, 200);
  const dark = tone === "dark";
  const ink = dark ? "rgba(255,255,255,0.9)" : PAL21.ink;
  const muted = dark ? "rgba(255,255,255,0.4)" : PAL21.textMuted;
  const track = dark ? "rgba(255,255,255,0.14)" : "rgba(13,37,61,0.14)";

  const X = (v: number) => clamp01(v) * RULER_W;
  const gap = Math.max(0, head - heads.replay);

  return (
    <div style={{ width: RULER_W * k, opacity: p }}>
      {/* the log itself — a filled bar to the primary's head, hollow beyond */}
      <div style={{ position: "relative", height: 64 * k }}>
        <div
          style={{
            position: "absolute", left: 0, top: 22 * k, width: RULER_W * k, height: 18 * k,
            background: track, borderRadius: 3 * k,
          }}
        />
        {/* what the replica has actually APPLIED — the only bar that means visible */}
        <div
          style={{
            position: "absolute", left: 0, top: 22 * k, width: X(heads.replay) * k, height: 18 * k,
            background: REPLICA, borderRadius: `${3 * k}px 0 0 ${3 * k}px`,
          }}
        />
        {/* the gap — hatched, because it is the thing that does not exist yet */}
        {showGap && gap > 0.004 && (
          <div
            style={{
              position: "absolute", left: X(heads.replay) * k, top: 22 * k,
              width: (X(head) - X(heads.replay)) * k, height: 18 * k,
              background: `repeating-linear-gradient(115deg, ${BAD}CC 0 ${5 * k}px, ${BAD}33 ${5 * k}px ${11 * k}px)`,
            }}
          />
        )}
        {/* the primary's write position — the leading edge of truth */}
        <div
          style={{
            position: "absolute", left: X(head) * k, top: 14 * k, width: 4 * k, height: 34 * k,
            background: PRIMARY, translate: "-50% 0",
            boxShadow: `0 0 ${12 * k}px ${PRIMARY}`,
          }}
        />
      </div>

      {/* the four heads, each on its own tick */}
      <div style={{ position: "relative", height: 74 * k }}>
        {HEADS.map((h) => {
          const on = waiting === h.key;
          const x = X(heads[h.key]);
          return (
            <div
              key={h.key}
              style={{
                position: "absolute", left: x * k, top: 0, translate: "-50% 0",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 5 * k,
              }}
            >
              <div
                style={{
                  width: on ? 3 * k : 2 * k, height: 14 * k,
                  background: on ? h.tone : muted, opacity: on ? 1 : 0.5,
                }}
              />
              <span
                style={{
                  ...tabular(on ? 17 * k : 15 * k),
                  color: on ? h.tone : muted,
                  whiteSpace: "nowrap",
                  fontWeight: on ? 600 : 400,
                }}
              >
                {h.label}
              </span>
              <span style={{ ...tabular(13 * k), color: muted, opacity: on ? 0.9 : 0.42, whiteSpace: "nowrap" }}>
                {lsn(heads[h.key])}
              </span>
            </div>
          );
        })}
      </div>

      {/* the only label that is about DISTANCE rather than position */}
      {showGap && (
        <div
          style={{
            display: "flex", alignItems: "baseline", gap: 12 * k, marginTop: 4 * k,
            justifyContent: "flex-end",
          }}
        >
          <span style={{ ...microCap(15 * k), color: muted }}>behind by</span>
          <span style={{ ...tabular(30 * k), color: gap > 0.12 ? BAD : ink, fontWeight: 600 }}>
            {(gap * 8.4).toFixed(1)} MB
          </span>
          <span style={{ ...tabular(22 * k), color: muted }}>·</span>
          <span style={{ ...tabular(30 * k), color: gap > 0.12 ? BAD : ink, fontWeight: 600 }}>
            {Math.round(gap * 2400)} ms
          </span>
        </div>
      )}
    </div>
  );
};

/* ── THE LOCATOR — where each mechanism actually happens ─────────────────────
 *
 * Three lanes and the wire between two of them, pinned outside the strip. Every
 * station lights the lane its mechanism lives in, so eight different
 * instruments never cost the viewer the topology.
 * ─────────────────────────────────────────────────────────────────────────── */

type LaneKey = "app" | "primary" | "wire" | "replica";

const WHERE: { at: number; lanes: LaneKey[] }[] = [
  { at: at("fanout"), lanes: ["primary"] },
  { at: at("fanout") + 4.2, lanes: ["primary", "replica"] },
  { at: at("stream"), lanes: ["wire"] },
  { at: at("sync"), lanes: ["primary", "wire"] },
  { at: at("lag"), lanes: ["wire", "replica"] },
  { at: at("stale"), lanes: ["app", "replica"] },
  { at: at("route"), lanes: ["app"] },
  { at: at("notcqrs"), lanes: ["primary", "wire", "replica"] },
  { at: at("notbackup"), lanes: ["primary", "wire", "replica"] },
];

const Locator: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const t = frame / EP21_FPS;
  if (t < STRIP_T0 - 0.4 || t > endOf("notbackup") + 0.6) return null;

  let cur = WHERE[0];
  WHERE.forEach((w) => { if (t >= w.at) cur = w; });
  const inOut =
    clamp01((t - (STRIP_T0 - 0.4)) / 0.6) * clamp01((endOf("notbackup") + 0.6 - t) / 0.6);

  const LANES: { key: LaneKey; ico: IcoName; label: string; tone: string }[] = [
    { key: "app", ico: "app", label: "app", tone: PAL21.ink },
    { key: "primary", ico: "db", label: "primary", tone: PRIMARY },
    { key: "replica", ico: "db", label: "replica", tone: REPLICA },
  ];

  const wireOn = cur.lanes.includes("wire");

  return (
    <div
      style={{
        position: "absolute",
        right: 54 * k,
        bottom: 46 * k,
        display: "flex",
        alignItems: "center",
        gap: 10 * k,
        background: PANEL,
        border: HAIR,
        borderRadius: R.pill,
        padding: `${10 * k}px ${16 * k}px`,
        boxShadow: SHADOW[3],
        opacity: inOut,
        pointerEvents: "none",
      }}
    >
      {LANES.map((L, i) => {
        const on = cur.lanes.includes(L.key);
        return (
          <React.Fragment key={L.key}>
            {i === 2 && (
              // the wire, which is a lane in its own right — station 02 lives
              // entirely on it and nowhere else
              <span
                style={{
                  width: 30 * k, height: 2 * k, position: "relative",
                  background: wireOn ? REPLICA : "rgba(255,255,255,0.18)",
                }}
              >
                {wireOn && <WirePulse />}
              </span>
            )}
            <span
              style={{
                display: "flex", alignItems: "center", gap: 7 * k,
                opacity: on ? 1 : 0.3,
              }}
            >
              <Ico name={L.ico} size={17 * k} color={on ? (L.key === "app" ? ON : L.tone) : ON_DIM} />
              <span
                style={{
                  ...microCap(14 * k),
                  color: on ? ON : ON_DIM,
                  whiteSpace: "nowrap",
                }}
              >
                {L.label}
              </span>
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
};

/** A single lit packet crossing the locator's wire — the film's smallest motion. */
const WirePulse: React.FC = () => {
  const k = useK();
  const u = useLoop(52);
  return (
    <span
      style={{
        position: "absolute", top: -2 * k, left: `${u * 100}%`,
        width: 6 * k, height: 6 * k, borderRadius: "50%", background: REPLICA,
        boxShadow: `0 0 ${8 * k}px ${REPLICA}`,
      }}
    />
  );
};

/* ── beat 1 — the cold open ──────────────────────────────────────────────────
 *
 * The premise as ONE instrument, and it has to earn the claim in the first line
 * before the title: reads multiply, writes do not.
 *
 * Two columns of capacity. Adding a replica adds a read bar and never adds a
 * write bar, and the write column stays exactly one bar tall no matter how far
 * the read column runs. Then the whole thing is undercut by the ruler sliding
 * in underneath — all that capacity, answering from behind.
 * ─────────────────────────────────────────────────────────────────────────── */

const ColdOpen: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const t = frame / EP21_FPS;

  // four replicas join, one per 0.85s, starting at 1.0s
  const joined = clamp01((t - 1.0) / (4 * 0.85)) * 4;
  const readCap = 1 + joined;

  const gapP = clamp01((t - 5.4) / 1.1);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Wal intensity={0.7} grain={24} />
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 180 * k, alignItems: "flex-end" }}>
          {/* Same five slots as the read column, and four of them never fill.
              The empty space IS the argument — a one-slot column would have
              nothing to compare against and the asymmetry would be invisible. */}
          <CapCol
            label="write capacity"
            tone={PRIMARY}
            bars={1}
            cap={5}
            note="one primary"
          />
          <CapCol
            label="read capacity"
            tone={REPLICA}
            bars={readCap}
            cap={5}
            note={`${Math.floor(joined)} replica${Math.floor(joined) === 1 ? "" : "s"}`}
          />
        </div>

        <div
          style={{
            marginTop: 54 * k,
            opacity: gapP,
            translate: `0 ${lerp(18, 0, gapP) * k}px`,
            display: "flex", flexDirection: "column", alignItems: "center",
          }}
        >
          <div style={{ ...display(62 * k, -0.04), color: PAL21.ink, textAlign: "center" }}>
            and every one of them answers from{" "}
            <span style={{ color: BAD }}>the past</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const CapCol: React.FC<{
  label: string; tone: string; bars: number; cap: number; note: string;
}> = ({ label, tone, bars, cap, note }) => {
  const k = useK();
  const BW = 132, BH = 46, GAPB = 13;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 * k }}>
      <div
        style={{
          display: "flex", flexDirection: "column-reverse", gap: GAPB * k,
          height: (cap * BH + (cap - 1) * GAPB) * k, justifyContent: "flex-end",
        }}
      >
        {Array.from({ length: cap }).map((_, i) => {
          const fill = clamp01(bars - i);
          return (
            <div
              key={i}
              style={{
                width: BW * k, height: BH * k, borderRadius: 4 * k,
                background: fill > 0 ? tone : "transparent",
                // The empty slots have to READ — they are the argument on the
                // write column, where four of five are permanently empty.
                border: fill > 0 ? "none" : `2px dashed rgba(13,37,61,0.26)`,
                opacity: fill > 0 ? 0.25 + 0.75 * fill : 1,
                scale: `1 ${lerp(0.4, 1, fill) || 1}`,
                boxShadow: fill > 0.9 ? `0 0 ${22 * k}px ${tone}55` : undefined,
              }}
            />
          );
        })}
      </div>
      <div style={{ ...tabular(64 * k), color: tone, fontWeight: 600 }}>
        {bars.toFixed(1)}×
      </div>
      <div style={{ ...microCap(20 * k), color: PAL21.textMuted, whiteSpace: "nowrap" }}>{label}</div>
      <div style={{ ...tabular(17 * k), color: PAL21.textMuted, opacity: 0.7 }}>{note}</div>
    </div>
  );
};

/* ── beat 2 — the title ──────────────────────────────────────────────────── */

const TitleCard: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const fade = (a: number, b: number) =>
    interpolate(frame, [F(a), F(b)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Wal deep intensity={1} grain={38} grainBlend="overlay" />
      <Scrim strength={0.5} />
      <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <div style={{ ...microCap(22 * k), color: "rgba(255,255,255,0.75)", opacity: fade(0.1, 0.5) }}>
          {cfg.series} · {cfg.episode}
        </div>
        <div style={{ marginTop: 26 * k, opacity: fade(0.3, 0.8) }}>
          <ShimmerText
            stops={SHIMMER}
            style={{ ...display(112 * k, -0.05), color: "#FFFFFF", lineHeight: 1.02 }}
          >
            {cfg.title}
          </ShimmerText>
        </div>
        <div
          style={{
            ...display(112 * k, -0.05), lineHeight: 1.02, color: "rgba(255,255,255,0.86)",
            opacity: fade(0.7, 1.2),
            translate: `0 ${lerp(18, 0, fade(0.7, 1.3)) * k}px`,
          }}
        >
          {cfg.titleAccent}
        </div>
        <div
          style={{
            marginTop: 40 * k, ...display(28 * k, -0.01), fontWeight: 300,
            color: "rgba(255,255,255,0.82)", opacity: fade(1.5, 2.1),
            maxWidth: 1080 * k, marginLeft: "auto", marginRight: "auto", lineHeight: 1.45,
          }}
        >
          {cfg.hook}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ── the act slate ─────────────────────────────────────────────────────────── */

const ACTS: { n: number; title: string; at: number; hold: number }[] = [
  { n: 1, title: "What it buys you", at: at("fanout") - 1.1, hold: 1.9 },
  // Cleared well BEFORE the dark station lands. Slate 02 sits over the lift into
  // `stale`, and a wash still up when a near-black station arrives puts a big
  // flat block behind the headline and eats its contrast entirely.
  { n: 2, title: "What it costs you", at: at("stale") - 2.7, hold: 1.75 },
];

const ActSlate: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const t = frame / EP21_FPS;

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
          background: PAL21.bg,
          // 0.965 rather than 0.93: slate 01 lands over the title card, which is
          // the field at full strength, and 7% of that is enough for the
          // headline to read straight through and compete with the act title.
          opacity: veil * 0.965,
          backdropFilter: `blur(${8 * veil}px)`,
          WebkitBackdropFilter: `blur(${8 * veil}px)`,
        }}
      />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: veil }}>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 132 * k, height: 132 * k, borderRadius: 30 * k,
              margin: `0 auto ${34 * k}px`,
              background: PAL21.accent,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: GEIST, fontWeight: 900, fontSize: 66 * k, color: "#FFFFFF",
              letterSpacing: "-0.02em",
              transform: `scale(${lerp(0.86, 1, sq)})`,
              boxShadow: `0 ${16 * k}px ${44 * k}px ${PAL21.accent}33`,
            }}
          >
            {String(act.n).padStart(2, "0")}
          </div>
          <div
            style={{
              fontFamily: HEAD, fontWeight: 800, fontSize: 96 * k,
              letterSpacing: "-0.045em", lineHeight: 1.04, color: PAL21.ink,
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

/* ── the continuity chip ─────────────────────────────────────────────────────
 *
 * ONE row, followed the whole way through: `order 8842`, which is printed on the
 * WAL record on station 02 and is the row that comes back stale on station 05.
 * Picked out of the episode's own content, never invented.
 *
 * Every state is something the film has just said. States are HELD, never
 * interpolated; the id never moves, only the state word animates.
 * ─────────────────────────────────────────────────────────────────────────── */

type TrailState = "waiting" | "live" | "risk" | "safe" | "done";

const TRAIL: { at: number; label: string; state: TrailState }[] = [
  { at: at("fanout"), label: "written to the primary", state: "live" },
  { at: at("stream") + 2.0, label: "in the WAL as heap_update", state: "live" },
  { at: at("sync") + 3.4, label: "commit waiting on flush_lsn", state: "waiting" },
  { at: at("lag") + 3.0, label: "still behind on the replica", state: "waiting" },
  { at: at("stale") + 2.6, label: "read back stale", state: "risk" },
  { at: at("route") + 3.4, label: "routed to the primary", state: "safe" },
  { at: at("notcqrs") + 3.0, label: "same row, both sides", state: "safe" },
  { at: at("notbackup") + 3.2, label: "and droppable from either", state: "risk" },
];

const TRAIL_COLOR: Record<TrailState, string> = {
  waiting: PAL21.textMuted,
  live: PRIMARY,
  risk: BAD,
  safe: OK,
  done: PAL21.accent,
};

const RowTrail: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const t = frame / EP21_FPS;
  if (t < STRIP_T0 - 0.4 || t > endOf("notbackup") + 0.6) return null;

  let cur = TRAIL[0];
  let idx = 0;
  TRAIL.forEach((s, i) => {
    if (t >= s.at) { cur = s; idx = i; }
  });
  const tone = TRAIL_COLOR[cur.state];
  const since = clamp01((t - cur.at) / 0.42);
  const inOut =
    clamp01((t - (STRIP_T0 - 0.4)) / 0.6) * clamp01((endOf("notbackup") + 0.6 - t) / 0.6);

  return (
    <div
      style={{
        position: "absolute", left: 54 * k, bottom: 46 * k,
        display: "flex", alignItems: "center", gap: 14 * k,
        background: PANEL, border: HAIR, borderRadius: R.pill,
        padding: `${11 * k}px ${20 * k}px ${11 * k}px ${14 * k}px`,
        boxShadow: SHADOW[3], opacity: inOut, pointerEvents: "none",
      }}
    >
      <span
        style={{
          width: 11 * k, height: 11 * k, borderRadius: "50%", background: tone,
          boxShadow: `0 0 ${(8 + 12 * (1 - since)) * k}px ${tone}`, flexShrink: 0,
        }}
      />
      <span style={{ ...tabular(19 * k), color: ON }}>order 8842</span>
      <span style={{ ...tabular(17 * k), color: "rgba(255,255,255,0.22)" }}>·</span>
      <span
        style={{
          ...tabular(18 * k), color: tone, opacity: 0.35 + 0.65 * since,
          translate: `0 ${lerp(7, 0, since) * k}px`, whiteSpace: "nowrap",
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
  const abs = STRIP_T0 + frame / EP21_FPS;

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
        <Station id="fanout" bg="tint"><FanOut /></Station>
        <Station id="stream" bg="canvas"><TheStream /></Station>
        <Station id="sync" bg="soft"><TheKnob /></Station>
        <Station id="lag" bg="canvas"><TheGap /></Station>
        <Station id="stale" bg="dark"><StaleRead /></Station>
        <Station id="route" bg="canvas"><TheRouter /></Station>
        <Station id="notcqrs" bg="soft"><NotCqrs /></Station>
        <Station id="notbackup" bg="tint"><NotBackup /></Station>
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
  const abs = STRIP_T0 + frame / EP21_FPS;
  return (
    <div
      style={{
        position: "absolute",
        left: `${cellOf(id)[0] * G}%`,
        top: `${cellOf(id)[1] * G}%`,
        width: "100%", height: "100%",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <ActBg kind={bg} atSeconds={abs} cold={isAct2(id)} />
      {/* `position: relative` here is LOAD-BEARING. `ActBg` is an AbsoluteFill —
          a POSITIONED sibling — and CSS paints positioned descendants above
          non-positioned in-flow ones regardless of DOM order. Without this
          wrapper, every element that happens NOT to carry an `opacity < 1`, a
          `transform` or a `translate` paints UNDERNEATH the background and
          vanishes, taking out half of a beat and leaving the other half looking
          fine. It looks like a timing bug and it is not. */}
      <div
        style={{
          position: "relative", zIndex: 1, width: "100%", height: "100%",
          display: "flex", alignItems: "center", justifyContent: "center",
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
 * The act's dominant field brightness — AND its temperature.
 *
 * The same instrument runs under every station: the streaks have no edges, so
 * the field never has to be cropped away from a diagram. What changes is
 * `intensity`, which makes the value journey one continuous current being
 * turned up and down rather than five different backgrounds — and, in act two,
 * `cold`, which is the entire palette shift the director asked for, applied to
 * the light and to nothing else.
 */
const ActBg: React.FC<{ kind: BgKind; atSeconds: number; cold: boolean }> = ({
  kind,
  atSeconds,
  cold,
}) => {
  if (kind === "field")
    return (
      <AbsoluteFill>
        <Wal deep intensity={1} cold={cold} atSeconds={atSeconds} grain={40} grainBlend="overlay" />
        {/* The heaviest scrim in the film, and it is not for the headline.
            "Thanks for watching." is 100px display with a shadow and survives
            anything; the `next` line under it is 22px at 0.86 white, the
            smallest type on any field beat, and the one thing on the end card a
            viewer actually has to read. */}
        <Scrim strength={0.52} />
      </AbsoluteFill>
    );
  if (kind === "dark")
    return (
      <AbsoluteFill style={{ background: "#070A14" }}>
        {/* The film's ONE true-dark station, and it has to read as the darkest
            thing in the episode or the value journey has no floor. A dark act is
            a DIMMER field, not no field: the current sits at a fifth of its
            weight — present as colour at the edges, never as brightness across
            the frame. */}
        <Wal intensity={0.24} cold base="#070A14" atSeconds={atSeconds} grain={44} grainBlend="overlay" />
        <GridPlate pal={PAL21} tone="dark" pitch={72} opacity={0.8} />
      </AbsoluteFill>
    );
  if (kind === "tint")
    return <Wal intensity={0.85} cold={cold} atSeconds={atSeconds} grain={30} />;
  if (kind === "soft")
    return (
      <AbsoluteFill style={{ background: PAL21.bgDeep }}>
        <Wal intensity={0.5} cold={cold} base={PAL21.bgDeep} atSeconds={atSeconds} grain={0} />
        <GridPlate pal={PAL21} pitch={72} opacity={0.85} />
        {/* The grain runs on EVERY station, including the quiet ones. A field
            that is only grained where it is saturated makes the plain stations
            read as a different, flatter film. */}
        <Grain amount={20} atSeconds={atSeconds} blend="multiply" />
      </AbsoluteFill>
    );
  return <Wal intensity={0.34} cold={cold} atSeconds={atSeconds} grain={22} />;
};

/* ── station 01 — the fan-out ────────────────────────────────────────────────
 *
 * WHERE: the primary, then the replicas.
 *
 * The asymmetry, drawn: writes all converge on one node and reads spread across
 * many. Replicas join one at a time and the read meter climbs with them while
 * the write meter never moves — then a write storm arrives and saturates the one
 * lane that never got wider, which is the honest limit of the whole technique.
 * ─────────────────────────────────────────────────────────────────────────── */

const FanOut: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const t = frame / EP21_FPS - LEAD;

  const joined = clamp01((t - 0.8) / 2.6) * 3; // three replicas over 2.6s
  const storm = clamp01((t - 4.6) / 1.0);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <BoxTag n="01">the fan-out</BoxTag>
      <Lead id="fanout" />

      <div style={{ position: "relative", width: 1180 * k, height: 420 * k }}>
        {/* the primary */}
        <NodeBox
          x={70} y={160} tone={PRIMARY} ico="db" title="primary"
          sub="every write" hot={storm}
        />
        {/* the replicas */}
        {[0, 1, 2].map((i) => {
          const on = clamp01(joined - i);
          return (
            <NodeBox
              key={i}
              x={870} y={40 + i * 150} tone={REPLICA} ico="db"
              title={`replica ${i + 1}`} sub="reads only" appear={on}
            />
          );
        })}
        {/* the wires, and traffic on them */}
        <svg
          width={1180 * k} height={420 * k} viewBox="0 0 1180 420"
          style={{ position: "absolute", inset: 0, overflow: "visible" }}
        >
          {[0, 1, 2].map((i) => {
            const on = clamp01(joined - i);
            return (
              <path
                key={i}
                d={`M 330 220 C 560 220, 620 ${105 + i * 150}, 870 ${105 + i * 150}`}
                fill="none" stroke={REPLICA} strokeWidth={2.2} opacity={0.22 * on}
              />
            );
          })}
        </svg>
        {[0, 1, 2].map((i) => {
          const on = clamp01(joined - i);
          return on > 0.5 ? <ReadFlow key={i} lane={i} /> : null;
        })}
        <WriteFlow storm={storm} />
      </div>

      <div style={{ display: "flex", gap: 60 * k, marginTop: 10 * k }}>
        <Meter
          label="write capacity" value={1} of={4} tone={PRIMARY}
          text="1×" warn={storm > 0.5}
        />
        <Meter
          label="read capacity" value={1 + joined} of={4} tone={REPLICA}
          text={`${(1 + joined).toFixed(1)}×`}
        />
      </div>

      <Note at={F(bt(5.0))}>
        Adding a replica never widens the write lane. That is the trade, and it is
        the whole reason the rest of this film is about time.
      </Note>
    </div>
  );
};

const NodeBox: React.FC<{
  x: number; y: number; tone: string; ico: IcoName; title: string; sub: string;
  appear?: number; hot?: number;
}> = ({ x, y, tone, ico, title, sub, appear = 1, hot = 0 }) => {
  const k = useK();
  return (
    <div
      style={{
        position: "absolute", left: x * k, top: y * k,
        width: 260 * k,
        background: PANEL, border: HAIR, borderRadius: R.lg * k,
        padding: `${16 * k}px ${18 * k}px`,
        boxShadow: hot > 0.1 ? `0 0 ${30 * hot * k}px ${BAD}88, ${SHADOW[3]}` : SHADOW[3],
        opacity: appear, scale: `${lerp(0.92, 1, appear)}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 * k }}>
        <Ico name={ico} size={22 * k} color={tone} />
        <span style={{ ...tabular(21 * k), color: ON }}>{title}</span>
      </div>
      <div style={{ ...microCap(14 * k), color: ON_DIM, marginTop: 9 * k, whiteSpace: "nowrap" }}>
        {sub}
      </div>
      {hot > 0.1 && (
        <div
          style={{
            marginTop: 11 * k, height: 5 * k, borderRadius: 3 * k,
            background: `linear-gradient(90deg, ${BAD} ${hot * 100}%, rgba(255,255,255,0.1) ${hot * 100}%)`,
          }}
        />
      )}
    </div>
  );
};

/** Read queries crawling out to a replica — a running system, not a reveal. */
const ReadFlow: React.FC<{ lane: number }> = ({ lane }) => {
  const k = useK();
  const u = useLoop(46, lane * 0.31);
  const x = lerp(330, 870, u);
  const y = lerp(220, 105 + lane * 150, u * u * (3 - 2 * u));
  return (
    <span
      style={{
        position: "absolute", left: x * k, top: y * k, translate: "-50% -50%",
        width: 9 * k, height: 9 * k, borderRadius: "50%", background: REPLICA,
        boxShadow: `0 0 ${10 * k}px ${REPLICA}`,
      }}
    />
  );
};

/** Writes converging on the one node that has to take all of them. */
const WriteFlow: React.FC<{ storm: number }> = ({ storm }) => {
  const k = useK();
  const n = 3 + Math.round(storm * 5);
  return (
    <>
      {Array.from({ length: n }).map((_, i) => (
        <WriteDot key={i} i={i} n={n} storm={storm} />
      ))}
    </>
  );
};

const WriteDot: React.FC<{ i: number; n: number; storm: number }> = ({ i, n, storm }) => {
  const k = useK();
  const u = useLoop(lerp(58, 26, storm), i / n);
  const x = lerp(-40, 90, u);
  const y = lerp(120 + (i % 3) * 60, 200, u);
  return (
    <span
      style={{
        position: "absolute", left: x * k, top: y * k, translate: "-50% -50%",
        width: 10 * k, height: 10 * k, borderRadius: "50%",
        background: storm > 0.5 ? BAD : PRIMARY,
        boxShadow: `0 0 ${11 * k}px ${storm > 0.5 ? BAD : PRIMARY}`,
      }}
    />
  );
};

const Meter: React.FC<{
  label: string; value: number; of: number; tone: string; text: string; warn?: boolean;
}> = ({ label, value, of, tone, text, warn = false }) => {
  const k = useK();
  const W = 320;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 * k }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", width: W * k }}>
        <span style={{ ...microCap(15 * k), color: PAL21.textMuted }}>{label}</span>
        <span style={{ ...tabular(28 * k), color: warn ? BAD : tone, fontWeight: 600 }}>{text}</span>
      </div>
      <div style={{ width: W * k, height: 14 * k, background: "rgba(13,37,61,0.12)", borderRadius: 3 * k }}>
        <div
          style={{
            width: (clamp01(value / of) * W) * k, height: 14 * k, borderRadius: 3 * k,
            background: warn ? BAD : tone,
          }}
        />
      </div>
    </div>
  );
};

/* ── station 02 — what actually travels ──────────────────────────────────────
 *
 * WHERE: the wire, and nowhere else.
 *
 * The single most common wrong mental model in the topic is that the replica
 * runs your query a second time. It does not — it replays physical WAL records,
 * and this station is the correction, drawn as a contrast: the SQL on the left
 * is never sent, the records on the right are what crosses.
 *
 * The records carry `order 8842`, which is the film's continuity chip, so the
 * protagonist is visibly the thing on the wire.
 * ─────────────────────────────────────────────────────────────────────────── */

/**
 * Twelve records for a five-row window, because the list SCROLLS.
 *
 * A panel that fills and then stops leaves the rest of the beat dead — 4.1s of
 * it, measured. A write-ahead log does not stop arriving, so modelling the real
 * behaviour is both more truthful and the thing that keeps the beat delivering
 * for its whole length. Same trick as a queue depth that integrates rather than
 * a sine bump that resolves at t=0.4.
 */
const RECORDS = [
  "heap_update  rel 16384  tid (3,17)  xid 4412918",
  "heap_update  rel 16384  tid (3,18)  xid 4412919",
  "btree_insert rel 16391  tid (9,4)   xid 4412919",
  "commit       xid 4412919  at 2026-08-15 14:02:11.884",
  "heap_insert  rel 16402  tid (1,92)  xid 4412920",
  "heap_update  rel 16384  tid (4,03)  xid 4412921",
  "btree_insert rel 16391  tid (9,5)   xid 4412921",
  "commit       xid 4412921  at 2026-08-15 14:02:11.902",
  "heap_delete  rel 16402  tid (1,44)  xid 4412922",
  "heap_update  rel 16384  tid (4,11)  xid 4412922",
  "commit       xid 4412922  at 2026-08-15 14:02:11.917",
  "heap_insert  rel 16384  tid (4,12)  xid 4412923",
];

/** Rows visible in the WAL window at once. */
const REC_WINDOW = 5;
/** Seconds per record. One arrives, the window scrolls by one. */
const REC_EVERY = 0.62;

const TheStream: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const t = frame / EP21_FPS - LEAD;

  const killed = clamp01((t - 1.4) / 0.5);
  // How many records have arrived, as a continuous number — the fractional part
  // drives the scroll so the window moves smoothly rather than jumping a row.
  const arrived = Math.max(0, (t + 0.6) / REC_EVERY);
  const maxScroll = Math.max(0, RECORDS.length - REC_WINDOW);
  const scroll = Math.min(maxScroll, Math.max(0, arrived - REC_WINDOW));

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <BoxTag n="02">what crosses the wire</BoxTag>
      <Lead id="stream" />

      <div style={{ display: "flex", alignItems: "center", gap: 44 * k }}>
        {/* what never travels */}
        <div style={{ position: "relative" }}>
          <Panel style={{ width: 470 * k }}>
            <div style={{ ...microCap(14 * k), color: ON_DIM, marginBottom: 12 * k }}>
              your statement
            </div>
            <div style={{ ...tabular(19 * k), color: ON, lineHeight: 1.7 }}>
              <span style={{ color: "#7DD3FC" }}>UPDATE</span> orders
              <br />
              <span style={{ color: "#7DD3FC" }}>SET</span> status = <span style={{ color: "#A5E887" }}>'paid'</span>
              <br />
              <span style={{ color: "#7DD3FC" }}>WHERE</span> id = <span style={{ color: "#F0B76B" }}>8842</span>;
            </div>
          </Panel>
          {/* The correction, laid over the thing it corrects — but NOT over the
              words. A badge centred on the card hides the middle line of the
              statement, and the viewer has to be able to read the SQL to
              understand what is being ruled out. It sits on the bottom edge. */}
          <div style={{ position: "absolute", inset: 0, opacity: killed, pointerEvents: "none" }}>
            <div
              style={{
                position: "absolute", inset: 0, borderRadius: R.lg * k,
                background: `${BAD}26`, border: `2px solid ${BAD}`,
              }}
            />
            <div
              style={{
                position: "absolute", left: "50%", bottom: 0,
                translate: `-50% ${50 * k}%`,
                display: "flex", alignItems: "center", gap: 10 * k,
                background: BAD, borderRadius: R.pill,
                padding: `${8 * k}px ${18 * k}px`,
                scale: `${lerp(0.85, 1, killed)}`,
                boxShadow: SHADOW[3],
              }}
            >
              <Ico name="cross" size={17 * k} color="#FFFFFF" />
              <span style={{ ...microCap(16 * k), color: "#FFFFFF", whiteSpace: "nowrap" }}>
                never sent to the replica
              </span>
            </div>
          </div>
        </div>

        <TheWire />

        {/* what does travel */}
        <Panel style={{ width: 620 * k }}>
          <div
            style={{
              display: "flex", justifyContent: "space-between",
              ...microCap(14 * k), color: ON_DIM, marginBottom: 12 * k,
            }}
          >
            <span>the write-ahead log</span>
            <span>replayed, in order</span>
          </div>
          {/* The window. Fixed height, clipped, with the list scrolling through
              it — and faded at both edges so records enter and leave as a
              stream rather than popping at a hard border. */}
          <div
            style={{
              height: REC_WINDOW * 30.75 * k,
              overflow: "hidden",
              maskImage:
                "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 12%, rgba(0,0,0,1) 88%, rgba(0,0,0,0) 100%)",
              WebkitMaskImage:
                "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 12%, rgba(0,0,0,1) 88%, rgba(0,0,0,0) 100%)",
            }}
          >
            <div style={{ translate: `0 ${-scroll * 30.75 * k}px` }}>
              {RECORDS.map((r, i) => {
                const on = clamp01(arrived - i);
                const isCommit = r.startsWith("commit");
                return (
                  <div
                    key={i}
                    style={{
                      ...tabular(15 * k),
                      color: isCommit ? REPLICA : "rgba(255,255,255,0.78)",
                      lineHeight: 2.05,
                      opacity: on,
                      translate: `${lerp(-14, 0, on) * k}px 0`,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span style={{ color: "rgba(255,255,255,0.32)", marginRight: 12 * k }}>
                      {lsn(0.2 + i * 0.045)}
                    </span>
                    {r}
                  </div>
                );
              })}
            </div>
          </div>
        </Panel>
      </div>

      <Note at={F(bt(5.2))}>
        Bytes, not statements. The replica has no planner in this path — it applies
        what the primary already decided.
      </Note>
    </div>
  );
};

/** The wire, with records physically crossing it for the whole beat. */
const TheWire: React.FC = () => {
  const k = useK();
  const W = 120;
  return (
    <div style={{ position: "relative", width: W * k, height: 60 * k }}>
      <div
        style={{
          position: "absolute", top: 29 * k, left: 0, width: W * k, height: 2 * k,
          background: "rgba(13,37,61,0.2)",
        }}
      />
      {[0, 1, 2].map((i) => (
        <WireDot key={i} i={i} w={W} />
      ))}
    </div>
  );
};

const WireDot: React.FC<{ i: number; w: number }> = ({ i, w }) => {
  const k = useK();
  const u = useLoop(38, i / 3);
  return (
    <span
      style={{
        position: "absolute", top: 24 * k, left: u * w * k,
        width: 12 * k, height: 12 * k, borderRadius: 2 * k,
        background: REPLICA, boxShadow: `0 0 ${10 * k}px ${REPLICA}`,
        opacity: clamp01(Math.sin(u * Math.PI) * 2),
      }}
    />
  );
};

/* ── station 03 — the commit knob ────────────────────────────────────────────
 *
 * WHERE: the primary, at COMMIT.
 *
 * The densest station in the film, and deliberately so — this is the 9.4s beat.
 * A five-position selector steps through `synchronous_commit`, and for each
 * position the RULER lights the head that commit is actually waiting for and the
 * latency bar grows. The mapping is not invented for the film: PostgreSQL's own
 * docs define `write_lag`, `flush_lag` and `replay_lag` as the delay that
 * `remote_write`, `on` and `remote_apply` respectively incur. Three columns,
 * three levels, one line each in the manual.
 * ─────────────────────────────────────────────────────────────────────────── */

const LEVELS: {
  name: string; waits: string; head: HeadKey | null; cost: number; note?: string;
}[] = [
  { name: "off", waits: "nothing — returns before the local flush", head: null, cost: 0.04, note: "up to 3 × wal_writer_delay can be lost" },
  { name: "local", waits: "the primary's own flush to disk", head: null, cost: 0.2 },
  { name: "remote_write", waits: "the standby to have written it", head: "write", cost: 0.46 },
  { name: "on", waits: "the standby to have flushed it", head: "flush", cost: 0.66, note: "the default" },
  { name: "remote_apply", waits: "the standby to have APPLIED it", head: "replay", cost: 1.0, note: "only this one means visible" },
];

const TheKnob: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const t = frame / EP21_FPS - LEAD;

  // steps through the five levels, holding on each
  const STEP = 1.5;
  const i = Math.min(LEVELS.length - 1, Math.max(0, Math.floor((t - 0.5) / STEP)));
  const L = LEVELS[i];
  const into = clamp01(((t - 0.5) % STEP) / 0.45);

  // The ruler's heads for this station: the replica is comfortably behind, and
  // the level picks which of its heads the commit blocks on.
  const heads: Record<HeadKey, number> = {
    sent: 0.78, write: 0.62, flush: 0.52, replay: 0.38,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <BoxTag n="03">synchronous_commit</BoxTag>
      <Lead id="sync" />

      {/* the selector */}
      <div style={{ display: "flex", gap: 8 * k, marginBottom: 30 * k }}>
        {LEVELS.map((lv, j) => {
          const on = j === i;
          const past = j < i;
          return (
            <div
              key={lv.name}
              style={{
                ...tabular(19 * k),
                padding: `${11 * k}px ${18 * k}px`,
                borderRadius: R.md * k,
                background: on ? PRIMARY : PANEL,
                border: on ? `1px solid ${PRIMARY}` : HAIR,
                color: on ? "#FFFFFF" : past ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.3)",
                whiteSpace: "nowrap",
                scale: `${on ? lerp(0.96, 1, into) : 1}`,
                boxShadow: on ? `0 ${8 * k}px ${24 * k}px ${PRIMARY}44` : undefined,
              }}
            >
              {lv.name}
            </div>
          );
        })}
      </div>

      {/* the ruler, showing WHICH head this level blocks on */}
      <LagRuler head={0.86} heads={heads} waiting={L.head} showGap={false} at={F(bt(0.2))} />

      {/* what it waits for, and what it costs */}
      <div
        style={{
          display: "flex", alignItems: "center", gap: 40 * k, marginTop: 22 * k,
          width: RULER_W * k, justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 8 * k }}>
          <span style={{ ...microCap(15 * k), color: PAL21.textMuted }}>commit waits for</span>
          <span
            style={{
              ...display(30 * k, -0.02), color: PAL21.ink, whiteSpace: "nowrap",
              opacity: lerp(0.3, 1, into),
            }}
          >
            {L.waits}
          </span>
          {L.note && (
            <span style={{ ...tabular(17 * k), color: L.head === "replay" ? OK : BAD, whiteSpace: "nowrap" }}>
              {L.note}
            </span>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 9 * k }}>
          <span style={{ ...microCap(15 * k), color: PAL21.textMuted }}>commit latency</span>
          <div
            style={{
              width: 300 * k, height: 22 * k, background: "rgba(13,37,61,0.12)",
              borderRadius: 3 * k, overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${L.cost * 100}%`, height: "100%",
                background: L.cost > 0.8 ? BAD : L.cost > 0.5 ? "#E8A33D" : OK,
              }}
            />
          </div>
        </div>
      </div>

      <Src>
        PostgreSQL 17 · runtime-config-wal · monitoring-stats (pg_stat_replication)
      </Src>
    </div>
  );
};

/* ── station 04 — the gap, measured ──────────────────────────────────────────
 *
 * WHERE: the wire and the replica.
 *
 * The ruler again, this time as the thing itself: push the write rate up and
 * watch the replay head fall behind. Two things on ONE clock, which is the
 * pacing rule — the rate drives the gap, and past a threshold the gap trips the
 * second cost nobody expects, which is that the replica will CANCEL a long read
 * rather than fall further behind.
 * ─────────────────────────────────────────────────────────────────────────── */

const TheGap: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const t = frame / EP21_FPS - LEAD;

  // the write rate ramps, then holds high
  const rate = clamp01((t - 0.6) / 3.2);
  // the replay head integrates the difference — it drains slowly rather than
  // tracking the rate, which is what actually happens and is also what keeps
  // this beat moving for its whole length
  const head = 0.9;
  const replay = clamp01(0.82 - rate * 0.52 + Math.sin(t * 1.7) * 0.018);

  const heads: Record<HeadKey, number> = {
    sent: lerp(0.88, 0.86, rate),
    write: lerp(0.86, 0.72, rate),
    flush: lerp(0.84, 0.62, rate),
    replay,
  };

  // 2.9s, not 4.6s. Act slate 02 takes the TAIL of this beat (it starts washing
  // at 44.91s absolute), so a payoff landing at 4.6s got 0.3 seconds of clear
  // screen before being covered by the slate it was supposed to precede.
  const cancel = clamp01((t - 2.9) / 0.6);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <BoxTag n="04">replication lag</BoxTag>
      <Lead id="lag" />

      {/* the driver */}
      <div
        style={{
          display: "flex", alignItems: "center", gap: 20 * k, marginBottom: 26 * k,
          width: RULER_W * k,
        }}
      >
        <span style={{ ...microCap(15 * k), color: PAL21.textMuted, whiteSpace: "nowrap" }}>
          write rate
        </span>
        <div style={{ flex: 1, height: 12 * k, background: "rgba(13,37,61,0.12)", borderRadius: 3 * k }}>
          <div style={{ width: `${rate * 100}%`, height: "100%", background: PRIMARY, borderRadius: 3 * k }} />
        </div>
        <span style={{ ...tabular(22 * k), color: PRIMARY, fontWeight: 600, whiteSpace: "nowrap" }}>
          {Math.round(lerp(120, 9400, rate)).toLocaleString()} tx/s
        </span>
      </div>

      <LagRuler head={head} heads={heads} waiting="replay" showGap at={F(bt(0.2))} />

      {/* the second cost — the one nobody expects */}
      <div
        style={{
          marginTop: 30 * k, opacity: cancel,
          translate: `0 ${lerp(14, 0, cancel) * k}px`,
        }}
      >
        <Panel style={{ width: RULER_W * k }} pad={18}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 * k }}>
            <Ico name="warn" size={24 * k} color={BAD} />
            <div style={{ flex: 1 }}>
              <div style={{ ...tabular(19 * k), color: ON, whiteSpace: "nowrap" }}>
                ERROR: canceling statement due to conflict with recovery
              </div>
              <div style={{ ...microCap(14 * k), color: ON_DIM, marginTop: 7 * k, whiteSpace: "nowrap" }}>
                a long read on the replica loses to the WAL it conflicts with
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ ...tabular(15 * k), color: ON_DIM, whiteSpace: "nowrap" }}>
                max_standby_streaming_delay
              </div>
              <div style={{ ...tabular(26 * k), color: BAD, fontWeight: 600 }}>30 s</div>
            </div>
          </div>
        </Panel>
      </div>

      <Src>PostgreSQL 17 · runtime-config-replication · default 30s, hot_standby_feedback off</Src>
    </div>
  );
};

/* ── station 05 — the stale read (DARK) ──────────────────────────────────────
 *
 * WHERE: the app, reading the replica.
 *
 * The failure, run as a real sequence and then run again. Two requests eight
 * milliseconds apart: the write goes to the primary and succeeds, the read goes
 * to a replica that has not applied it yet, and the user is shown their old
 * name back. The cycle repeats because a bug you see twice is a bug you believe.
 *
 * The whole card washes red on the failure rather than a chip turning red — a
 * small element changing colour is motion the metric misses and the viewer
 * misses too. Enlarge what already moves.
 * ─────────────────────────────────────────────────────────────────────────── */

const StaleRead: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const t = frame / EP21_FPS - LEAD;

  const CYCLE = 3.9;
  const c = Math.max(0, (t - 0.4) % CYCLE);
  const wrote = clamp01((c - 0.3) / 0.35);
  const read = clamp01((c - 1.5) / 0.35);
  // The result STAYS once it has happened, and the loop only re-emphasises it.
  // Resetting it every cycle left the lower half of the frame empty for 2.3s out
  // of every 3.9 — the repetition is there to make the bug believable, not to
  // take the payoff away again.
  const shown = clamp01((t - 2.7) / 0.35);
  const pulse = clamp01((c - 2.3) / 0.35) * clamp01((CYCLE - 0.2 - c) / 0.4);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <BoxTag n="05" tone="dark">read your own write</BoxTag>
      <Lead id="stale" tone="dark" />

      <div style={{ display: "flex", alignItems: "stretch", gap: 26 * k }}>
        <ReqCard
          t={0} method="POST" path="/profile" target="primary" tone={PRIMARY}
          body="name = 'Bishakh N.'" status="200 committed" on={wrote} ok
        />
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ ...tabular(17 * k), color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap" }}>
            + 8 ms
          </span>
        </div>
        <ReqCard
          t={1} method="GET" path="/profile" target="replica" tone={REPLICA}
          body="lag: 240 ms" status="200 stale" on={read} ok={false}
        />
      </div>

      {/* what the user actually sees — the whole card washes, not a chip */}
      <div
        style={{
          marginTop: 30 * k, opacity: shown,
          translate: `0 ${lerp(16, 0, shown) * k}px`,
        }}
      >
        <div
          style={{
            display: "flex", gap: 0, borderRadius: R.lg * k, overflow: "hidden",
            border: `2px solid ${BAD}`,
            boxShadow: `0 0 ${(18 + 40 * pulse) * shown * k}px ${BAD}${pulse > 0.5 ? "77" : "44"}`,
          }}
        >
          <div style={{ background: PANEL, padding: `${20 * k}px ${34 * k}px` }}>
            <div style={{ ...microCap(14 * k), color: ON_DIM }}>what they saved</div>
            <div style={{ ...display(38 * k, -0.02), color: ON, marginTop: 10 * k, whiteSpace: "nowrap" }}>
              Bishakh N.
            </div>
          </div>
          <div
            style={{
              background: `${BAD}${Math.round(shown * 0.34 * 255).toString(16).padStart(2, "0")}`,
              backgroundColor: PANEL,
              padding: `${20 * k}px ${34 * k}px`,
              position: "relative",
            }}
          >
            <div style={{ position: "absolute", inset: 0, background: BAD, opacity: 0.34 * shown }} />
            <div style={{ position: "relative" }}>
              <div style={{ ...microCap(14 * k), color: "rgba(255,255,255,0.75)" }}>
                what the page shows
              </div>
              <div style={{ ...display(38 * k, -0.02), color: ON, marginTop: 10 * k, whiteSpace: "nowrap" }}>
                Bishakh
              </div>
            </div>
          </div>
        </div>
      </div>

      <Note at={F(bt(5.4))} tone="dark">
        Nothing failed. Both requests returned 200. The replica was simply telling
        the truth about an earlier moment.
      </Note>
    </div>
  );
};

const ReqCard: React.FC<{
  t: number; method: string; path: string; target: string; tone: string;
  body: string; status: string; on: number; ok: boolean;
}> = ({ method, path, target, tone, body, status, on, ok }) => {
  const k = useK();
  return (
    <div
      style={{
        width: 400 * k, background: PANEL,
        border: `1px solid ${on > 0.5 ? (ok ? `${OK}66` : `${BAD}88`) : "rgba(255,255,255,0.12)"}`,
        borderRadius: R.lg * k, padding: 20 * k, boxShadow: SHADOW[3],
        opacity: lerp(0.35, 1, on),
        position: "relative", overflow: "hidden",
      }}
    >
      {/* the wash lives on the CARD, not on a chip */}
      {!ok && <div style={{ position: "absolute", inset: 0, background: BAD, opacity: 0.16 * on }} />}
      <div style={{ position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 * k }}>
          <span
            style={{
              ...tabular(15 * k), background: tone, color: "#FFFFFF",
              padding: `${4 * k}px ${9 * k}px`, borderRadius: 3 * k,
            }}
          >
            {method}
          </span>
          <span style={{ ...tabular(20 * k), color: ON }}>{path}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 9 * k, marginTop: 14 * k }}>
          <Ico name="db" size={16 * k} color={tone} />
          <span style={{ ...microCap(14 * k), color: ON_DIM }}>{target}</span>
        </div>
        <div style={{ ...tabular(17 * k), color: "rgba(255,255,255,0.7)", marginTop: 12 * k, whiteSpace: "nowrap" }}>
          {body}
        </div>
        <div
          style={{
            ...tabular(17 * k), color: ok ? OK : BAD, marginTop: 12 * k,
            display: "flex", alignItems: "center", gap: 8 * k,
          }}
        >
          <Ico name={ok ? "check" : "warn"} size={15 * k} color={ok ? OK : BAD} />
          {status}
        </div>
      </div>
    </div>
  );
};

/* ── station 06 — routing by intent ──────────────────────────────────────────
 *
 * WHERE: the app, and only the app.
 *
 * The fix, and the point that it is a fix in YOUR code rather than a database
 * setting. Two mechanisms, weakest first: a sticky window, which is what most
 * teams ship, and the LSN wait, which is what is actually correct. Requests
 * stream in for the whole beat and get sorted, so the station keeps delivering
 * rather than presenting a rule and stopping.
 * ─────────────────────────────────────────────────────────────────────────── */

/**
 * Fourteen requests for a six-row window, because this list SCROLLS too.
 *
 * Same lesson station 02 taught: a panel that fills and stops leaves the rest of
 * the beat dead. Pulling the rows earlier to kill the empty-container problem
 * just moved the dead air to the END of the beat — 3.1s of it, measured, the
 * longest still stretch in the film. A router does not handle six requests and
 * retire, so the feed runs for the whole beat and the rule cards land over it.
 */
const REQS: { who: string; kind: string; own: boolean }[] = [
  { who: "u_8842", kind: "GET /profile", own: true },
  { who: "u_1190", kind: "GET /feed", own: false },
  { who: "u_4471", kind: "GET /search", own: false },
  { who: "u_8842", kind: "GET /orders", own: true },
  { who: "u_2205", kind: "GET /feed", own: false },
  { who: "u_9930", kind: "GET /report", own: false },
  { who: "u_3318", kind: "GET /feed", own: false },
  { who: "u_2205", kind: "GET /profile", own: true },
  { who: "u_7742", kind: "GET /search", own: false },
  { who: "u_1190", kind: "GET /orders", own: false },
  { who: "u_5063", kind: "GET /report", own: false },
  { who: "u_7742", kind: "GET /profile", own: true },
  { who: "u_9930", kind: "GET /feed", own: false },
  { who: "u_4471", kind: "GET /orders", own: false },
];

/** Rows visible in the router window at once. */
const REQ_WINDOW = 6;
/** Seconds per request. */
const REQ_EVERY = 0.62;

const TheRouter: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const t = frame / EP21_FPS - LEAD;

  // Rows start arriving DURING the lead-in, not on arrival. A station is mounted
  // 1.2s before the camera reaches it, and this one's panel is tall enough that
  // an empty one reads as a large black void through the whole approach — the
  // exact "slide loading" failure the lead exists to prevent. The panel now
  // fades in with its first row rather than waiting to be filled.
  // Rows are laid out at `opacity: 0` rather than absent, so an unfilled panel
  // is FULL HEIGHT and reads as a black void — and `LEAD` mounts this station
  // 1.2s before the camera arrives. So the rows start landing at mount
  // (t = −1.15), not on arrival: by the time the camera gets here roughly half
  // are in and the rest arrive over the first second and a half of the beat,
  // which is the "assembling as you approach" the lead exists to buy.
  const arrived = Math.max(0, (t + 1.15) / REQ_EVERY);
  const maxScroll = Math.max(0, REQS.length - REQ_WINDOW);
  const scroll = Math.min(maxScroll, Math.max(0, arrived - REQ_WINDOW));
  const panelIn = clamp01((t + 1.18) / 0.4);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <BoxTag n="06">route by intent</BoxTag>
      <Lead id="route" />

      <div style={{ display: "flex", gap: 34 * k, alignItems: "flex-start" }}>
        {/* the requests, sorted */}
        <Panel style={{ width: 560 * k, opacity: panelIn, scale: `${lerp(0.97, 1, panelIn)}` }}>
          <div style={{ ...microCap(14 * k), color: ON_DIM, marginBottom: 14 * k }}>
            incoming reads
          </div>
          <div
            style={{
              height: REQ_WINDOW * 44 * k,
              overflow: "hidden",
              maskImage:
                "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 10%, rgba(0,0,0,1) 90%, rgba(0,0,0,0) 100%)",
              WebkitMaskImage:
                "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 10%, rgba(0,0,0,1) 90%, rgba(0,0,0,0) 100%)",
            }}
          >
          <div style={{ translate: `0 ${-scroll * 44 * k}px` }}>
          {REQS.map((r, i) => {
            const on = clamp01(arrived - i);
            const tone = r.own ? PRIMARY : REPLICA;
            return (
              <div
                key={i}
                style={{
                  display: "flex", alignItems: "center", gap: 12 * k,
                  height: 44 * k, boxSizing: "border-box",
                  opacity: on,
                  translate: `${lerp(-16, 0, on) * k}px 0`,
                  borderBottom: i < REQS.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none",
                }}
              >
                <span style={{ ...tabular(16 * k), color: "rgba(255,255,255,0.5)", width: 90 * k }}>
                  {r.who}
                </span>
                <span style={{ ...tabular(17 * k), color: ON, flex: 1, whiteSpace: "nowrap" }}>
                  {r.kind}
                </span>
                <Ico name="arrow" size={15 * k} color={tone} />
                <span
                  style={{
                    ...microCap(14 * k), color: "#FFFFFF", background: tone,
                    padding: `${4 * k}px ${10 * k}px`, borderRadius: R.pill,
                    whiteSpace: "nowrap", opacity: on,
                  }}
                >
                  {r.own ? "primary" : "replica"}
                </span>
              </div>
            );
          })}
          </div>
          </div>
        </Panel>

        {/* the two mechanisms, weakest first */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 * k, width: 580 * k }}>
          <RuleCard
            at={F(bt(1.2))}
            tag="what most teams ship"
            code={`if (wroteWithin(user, LAG_WINDOW))\n  → primary\nelse\n  → replica`}
            verdict="a guess, sized to a number you hope holds"
            tone={"#E8A33D"}
          />
          <RuleCard
            at={F(bt(3.0))}
            tag="what is actually correct"
            code={`lsn = pg_current_wal_lsn()   -- on write\nwait until\n  pg_last_wal_replay_lsn() >= lsn`}
            verdict="the replica is asked, not assumed"
            tone={OK}
          />
        </div>
      </div>

      <Src>PostgreSQL 17 · functions-admin (WAL location functions)</Src>
    </div>
  );
};

const RuleCard: React.FC<{
  at: number; tag: string; code: string; verdict: string; tone: string;
}> = ({ at: a, tag, code, verdict, tone }) => {
  const k = useK();
  const p = useAppearAt(a, 200);
  return (
    <div style={{ opacity: p, translate: `0 ${lerp(14, 0, p) * k}px` }}>
      <Panel pad={18}>
        <div style={{ ...microCap(13 * k), color: ON_DIM, marginBottom: 11 * k }}>{tag}</div>
        <div
          style={{
            ...tabular(16 * k), color: ON, lineHeight: 1.72,
            whiteSpace: "pre", overflow: "hidden",
          }}
        >
          {code}
        </div>
        <div
          style={{
            display: "flex", alignItems: "center", gap: 9 * k, marginTop: 13 * k,
            paddingTop: 12 * k, borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <span style={{ width: 7 * k, height: 7 * k, borderRadius: "50%", background: tone }} />
          <span style={{ ...microCap(14 * k), color: "rgba(255,255,255,0.66)", whiteSpace: "nowrap" }}>
            {verdict}
          </span>
        </div>
      </Panel>
    </div>
  );
};

/* ── station 07 — this is not CQRS ───────────────────────────────────────────
 *
 * WHERE: both sides, compared.
 *
 * The film's longest beat at 9.4s, carrying the line that `tts.mjs` flags as
 * dragging. The fix for a long line is a DENSER picture, not a slower one, so
 * this is the most information-rich station in the episode: six rows of
 * comparison, each arriving on its own, each carrying a real artifact rather
 * than an adjective.
 *
 * It is also series continuity — EP 18 built the CQRS film, and naming it here
 * is the playlist referring to itself rather than a filler contrast.
 * ─────────────────────────────────────────────────────────────────────────── */

const ROWS: { k: string; rep: string; cqrs: string }[] = [
  { k: "the schema", rep: "identical, byte for byte", cqrs: "different on purpose" },
  { k: "what travels", rep: "WAL records", cqrs: "domain events" },
  { k: "who writes it", rep: "the database", cqrs: "a projection you maintain" },
  { k: "the read model", rep: "the same tables", cqrs: "shaped for one query" },
  { k: "when it breaks", rep: "the replica falls behind", cqrs: "the projection is wrong" },
  { k: "to fix it", rep: "wait", cqrs: "rebuild and replay" },
];

const NotCqrs: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const t = frame / EP21_FPS - LEAD;
  const shown = clamp01((t - 0.6) / 4.4) * ROWS.length;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <BoxTag n="07">read replica ≠ CQRS</BoxTag>
      <Lead id="notcqrs" />

      <div style={{ width: 1240 * k }}>
        {/* the two headers */}
        <div style={{ display: "flex", alignItems: "flex-end", marginBottom: 16 * k }}>
          <div style={{ width: 300 * k }} />
          <ColHead tone={REPLICA} ico="db" title="read replica" sub="physical" />
          <ColHead tone={PAL21.accent} ico="layers" title="CQRS" sub="logical · EP 18" />
        </div>

        {ROWS.map((r, i) => {
          const on = clamp01(shown - i);
          return (
            <div
              key={r.k}
              style={{
                display: "flex", alignItems: "stretch",
                opacity: on, translate: `0 ${lerp(12, 0, on) * k}px`,
                borderTop: "1px solid rgba(13,37,61,0.12)",
              }}
            >
              <div
                style={{
                  width: 300 * k, padding: `${15 * k}px ${18 * k}px ${15 * k}px 0`,
                  ...microCap(16 * k), color: PAL21.textMuted, whiteSpace: "nowrap",
                  display: "flex", alignItems: "center",
                }}
              >
                {r.k}
              </div>
              <Cell text={r.rep} tone={REPLICA} on={on} />
              <Cell text={r.cqrs} tone={PAL21.accent} on={on} />
            </div>
          );
        })}
      </div>

      <Note at={F(bt(5.6))}>
        One is a copy that is late. The other is a different answer, computed on
        purpose. Confusing them is how teams end up building neither.
      </Note>
    </div>
  );
};

const ColHead: React.FC<{ tone: string; ico: IcoName; title: string; sub: string }> = ({
  tone, ico, title, sub,
}) => {
  const k = useK();
  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 11 * k, paddingLeft: 18 * k }}>
      <Ico name={ico} size={22 * k} color={tone} />
      <div>
        <div style={{ ...display(26 * k, -0.02), color: PAL21.ink, whiteSpace: "nowrap" }}>{title}</div>
        <div style={{ ...microCap(13 * k), color: PAL21.textMuted, marginTop: 3 * k, whiteSpace: "nowrap" }}>
          {sub}
        </div>
      </div>
    </div>
  );
};

const Cell: React.FC<{ text: string; tone: string; on: number }> = ({ text, tone, on }) => {
  const k = useK();
  return (
    <div
      style={{
        flex: 1, padding: `${15 * k}px ${18 * k}px`,
        display: "flex", alignItems: "center", gap: 11 * k,
      }}
    >
      <span
        style={{
          width: 6 * k, height: 6 * k, borderRadius: "50%", background: tone,
          opacity: on, flexShrink: 0,
        }}
      />
      <span style={{ ...tabular(19 * k), color: PAL21.ink, whiteSpace: "nowrap" }}>{text}</span>
    </div>
  );
};

/* ── station 08 — and it is not a backup ─────────────────────────────────────
 *
 * WHERE: everywhere at once, which is the point.
 *
 * The fastest beat in the film at 7.1s, so it does exactly one thing: a
 * destructive statement is typed on the primary, the record crosses the wire,
 * and the replica loses the table too. Replication is not a safety net — it is
 * a faithful copier, and faithfulness is the problem.
 * ─────────────────────────────────────────────────────────────────────────── */

const NotBackup: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const t = frame / EP21_FPS - LEAD;

  const typed = clamp01((t - 0.5) / 1.1);
  const cmd = "DROP TABLE orders;";
  const chars = Math.floor(typed * cmd.length);
  const fired = clamp01((t - 1.8) / 0.25);
  const crossed = clamp01((t - 2.2) / 0.7);
  const dead = clamp01((t - 3.0) / 0.4);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <BoxTag n="08">a replica is not a backup</BoxTag>
      <Lead id="notbackup" />

      <div style={{ display: "flex", alignItems: "center", gap: 30 * k }}>
        <DbCard
          label="primary" tone={PRIMARY} rows={fired > 0.5 ? 0 : 812_004} dead={fired}
          cmd={cmd.slice(0, chars)} caret={typed < 1}
        />
        <div style={{ position: "relative", width: 170 * k, height: 60 * k }}>
          <div
            style={{
              position: "absolute", top: 29 * k, left: 0, width: 170 * k, height: 2 * k,
              background: "rgba(13,37,61,0.2)",
            }}
          />
          <div
            style={{
              position: "absolute", top: 18 * k, left: lerp(0, 158, crossed) * k,
              opacity: crossed > 0 && crossed < 1 ? 1 : 0,
              ...tabular(13 * k), color: BAD, whiteSpace: "nowrap",
              translate: "-50% 0",
            }}
          >
            <span
              style={{
                display: "block", width: 12 * k, height: 12 * k, borderRadius: 2 * k,
                background: BAD, boxShadow: `0 0 ${12 * k}px ${BAD}`, margin: "0 auto",
              }}
            />
          </div>
          <div
            style={{
              position: "absolute", top: 40 * k, width: 170 * k, textAlign: "center",
              ...microCap(13 * k), color: PAL21.textMuted, opacity: crossed,
              whiteSpace: "nowrap",
            }}
          >
            replicated
          </div>
        </div>
        <DbCard label="replica" tone={REPLICA} rows={dead > 0.5 ? 0 : 812_004} dead={dead} />
      </div>

      <div
        style={{
          marginTop: 34 * k, opacity: clamp01((t - 3.6) / 0.5),
          display: "flex", alignItems: "center", gap: 14 * k,
        }}
      >
        <Ico name="clock" size={22 * k} color={PAL21.ink} />
        <span style={{ ...display(32 * k, -0.025), color: PAL21.ink, whiteSpace: "nowrap" }}>
          A backup is a point in time. A replica is a point of view.
        </span>
      </div>
    </div>
  );
};

const DbCard: React.FC<{
  label: string; tone: string; rows: number; dead: number; cmd?: string; caret?: boolean;
}> = ({ label, tone, rows, dead, cmd, caret }) => {
  const k = useK();
  return (
    <div
      style={{
        width: 420 * k, background: PANEL, borderRadius: R.lg * k,
        border: `1px solid ${dead > 0.5 ? `${BAD}99` : "rgba(255,255,255,0.12)"}`,
        boxShadow: SHADOW[3], overflow: "hidden", position: "relative",
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: BAD, opacity: 0.2 * dead }} />
      <div style={{ position: "relative", padding: 20 * k }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 * k }}>
          <Ico name="db" size={20 * k} color={tone} />
          <span style={{ ...tabular(20 * k), color: ON }}>{label}</span>
        </div>
        <div style={{ marginTop: 16 * k, display: "flex", alignItems: "baseline", gap: 12 * k }}>
          <span style={{ ...tabular(15 * k), color: ON_DIM }}>orders</span>
          <span
            style={{
              ...tabular(30 * k), fontWeight: 600,
              color: dead > 0.5 ? BAD : ON,
              // No strike on the words "does not exist" — striking out a
              // negative reads as a double negative. The strike belongs to a
              // COUNT that has been taken away, and there is no longer one.
            }}
          >
            {rows === 0 ? "does not exist" : rows.toLocaleString()}
          </span>
        </div>
        {cmd !== undefined && (
          <div
            style={{
              marginTop: 16 * k, paddingTop: 14 * k,
              borderTop: "1px solid rgba(255,255,255,0.08)",
              ...tabular(17 * k), color: BAD, whiteSpace: "nowrap", height: 24 * k,
            }}
          >
            {cmd}
            {caret && <span style={{ opacity: 0.8 }}>▌</span>}
          </div>
        )}
      </div>
    </div>
  );
};

/* ── beat 11 — the end card ──────────────────────────────────────────────── */

const EndCard: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const fade = (a: number, b: number) =>
    interpolate(frame, [F(a), F(b)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
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
  fanout: "the fan-out", stream: "the wire", sync: "the knob", lag: "the gap",
  stale: "stale read", route: "route by intent", notcqrs: "not CQRS", notbackup: "not a backup",
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
 *
 * BACK TO SOMETHING NEAR THE HOUSE LEVELS, and that is not a reversion — it is
 * the same rule EP 20 established, applied to a different bed. Mix levels are a
 * property of the BED, not of the series. EP 20 was scored with a CC0 piano at
 * roughly −25 dB and needed 0.62 / 0.26 to lift at all; this episode's CC0 bed
 * is mastered at −16.7 dB, about 8 dB hotter, so the same numbers would have it
 * shouting over the narration. Confirmed per beat with `volumedetect` after the
 * render rather than assumed.
 * ─────────────────────────────────────────────────────────────────────────── */

const OPEN = 0.34;
const UNDER = 0.15;
const HAS_VO = Boolean(cfg.audio?.vo);

const bedVolume = (f: number) => {
  const t = f / EP21_FPS;
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
  const tail = clamp01((EP21_SECONDS - t) / 1.6);
  return v * head * tail;
};

const Track: React.FC = () => {
  // The sound-off cut mounts no audio at all.
  //
  // Note that this is NOT sufficient on its own: Remotion still muxes an AAC
  // track of true digital silence (measured at −91 dB), so the published file is
  // finished with a copy-remux `-c copy -an`. Dropping the elements here is what
  // makes that remux lossless — strip the track without doing this and you are
  // throwing away a real mix.
  if (useSilent()) return null;
  return <ScoredTrack />;
};

const ScoredTrack: React.FC = () => (
  <>
    {cfg.audio?.music && (
      <Sequence from={0} durationInFrames={EP21_DURATION} layout="none" name="score">
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

    {/* One cue per station arrival — the travel resolving, nothing else. The two
        ACT BREAKS get a different pair: a riser under the lift and a thunk on
        the landing, because a move that means "new section" has to sound like
        one or it is just a longer slide. */}
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

    {/* 1 — four replicas joining, then the undercut */}
    {[0, 1, 2, 3].map((i) => (
      <Cue key={`o${i}`} name="tick" at={F(at("open") + 1.0 + i * 0.85)} volume={0.2} />
    ))}
    <Cue name="sub" at={F(at("open") + 5.4)} volume={0.26} />

    {/* 01 — three replicas joining, then the write storm */}
    {[0, 1, 2].map((i) => (
      <Cue key={`f${i}`} name="latch" at={F(at("fanout") + bt(0.8) + i * 0.87)} volume={0.22} />
    ))}
    <Cue name="error" at={F(at("fanout") + bt(4.7))} volume={0.24} />

    {/* 02 — the statement struck out, then the records arriving */}
    <Cue name="error" at={F(at("stream") + bt(1.4))} volume={0.24} />
    {/* one per record, on the SAME clock the list scrolls to: record i arrives
        at t = i * REC_EVERY − 0.6 */}
    {RECORDS.map((_, i) => (
      <Cue key={`r${i}`} name="blip" at={F(at("stream") + bt(i * 0.62 - 0.6))} volume={0.14} />
    ))}

    {/* 03 — the knob stepping through its five positions */}
    {[0, 1, 2, 3, 4].map((i) => (
      <Cue key={`k${i}`} name="click" at={F(at("sync") + bt(0.5) + i * 1.5)} volume={0.24} />
    ))}
    <Cue name="success" at={F(at("sync") + bt(6.6))} volume={0.24} />

    {/* 04 — the gap opening, then the cancellation */}
    <Cue name="sub" at={F(at("lag") + bt(0.6))} volume={0.24} />
    <Cue name="error" at={F(at("lag") + bt(2.9))} volume={0.28} />

    {/* 05 — write, read, and the stale answer. Twice. */}
    {[0, 1].map((c) => (
      <React.Fragment key={`s${c}`}>
        <Cue name="click" at={F(at("stale") + bt(0.7) + c * 3.9)} volume={0.24} />
        <Cue name="blip" at={F(at("stale") + bt(1.9) + c * 3.9)} volume={0.2} />
        <Cue name="error" at={F(at("stale") + bt(2.7) + c * 3.9)} volume={0.28} />
      </React.Fragment>
    ))}

    {/* 06 — the requests sorting, then the two rules landing */}
    {/* one per request, on the SAME clock the feed scrolls to */}
    {REQS.map((_, i) => (
      <Cue key={`q${i}`} name="tick" at={F(at("route") + bt(i * 0.62 - 1.15))} volume={0.13} />
    ))}
    <Cue name="latch" at={F(at("route") + bt(1.2))} volume={0.22} />
    <Cue name="success" at={F(at("route") + bt(3.0))} volume={0.24} />

    {/* 07 — six comparison rows, on the same clock the picture uses */}
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <Cue key={`c${i}`} name="tick" at={F(at("notcqrs") + bt(0.6) + i * 0.73)} volume={0.17} />
    ))}

    {/* 08 — typed, fired, crossed, dead */}
    <TypeCues text="DROP TABLE orders;" start={F(at("notbackup") + bt(0.5))} cps={17} volume={0.17} max={20} />
    <Cue name="error" at={F(at("notbackup") + bt(1.8))} volume={0.3} />
    <Cue name="whoosh" at={F(at("notbackup") + bt(2.2))} volume={0.2} />
    <Cue name="error" at={F(at("notbackup") + bt(3.0))} volume={0.3} />

    {/* the route map drawing under the sign-off */}
    <Cue name="latch" at={F(at("end") + 3.0)} volume={0.26} />
  </>
);
