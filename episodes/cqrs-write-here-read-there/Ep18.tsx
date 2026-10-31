// Author: Bishakh
//
// EP 18 — "Write Here. Read There."
// CQRS: one model splits into two, and each half only has to be good at one job.
//
// THE CONSTRUCTION is EP 16's, unchanged, because it works: one continuous
// canvas the camera travels on a serpentine, stations instead of slides, one
// stroke-icon family so no box is ever just a labelled rectangle, real product
// panels, the box pattern, the two overlaid act slates, and a continuity chip
// pinned to the frame that follows ONE order the whole way through. Same
// palette too — `stripe-mesh`, white canvas, deep-navy ink, indigo #533AFD as
// the single filled hue.
//
// WHAT IS NEW IS THE FIELD. The director supplied a stripe gradient — 32°,
// white holding a quarter of the axis and then feathering through #78B8F9 into
// #5667FF and #4D2FF9 — under fractalNoise grain at 0.210, blended overlay,
// tiled at 120px. That description is exactly the machine in lib/gradient.tsx,
// so nothing was reinterpreted: the stops are `AZURE_STOPS` verbatim, `angle`
// is 32, `grain={42}` reproduces 0.210 to the digit, and the tile and blend
// mode are already the component's defaults. The bands are hard, so the field
// runs FULL BLEED behind the title, the open and the end card, cropped to a
// BAND over the two stations that can carry it, and as `BLOOM_AZURE` — the same
// four hues with no edges at all — everywhere a diagram has to stay readable.
//
// THE FILM BREATHES IN VALUE, per act: the saturated stripe field on the open
// and title, white canvas across the mechanism, the cool canvas-soft and one
// true-dark station through the cost act, then back to the field to sign off.
//
// TERMINOLOGY IS SOURCED. CQRS was named by Greg Young in 2010 and separates
// the MODEL; it derives from Bertrand Meyer's Command-Query Separation (Object-
// Oriented Software Construction, 1988), which separates METHODS. Young's own
// repeated correction is that it is not event sourcing, not eventual
// consistency, not a top-level architecture, and not what most systems need —
// which is why the last station refuses it by default.
//
// THE FIGURES ARE ONE WORKED SYSTEM'S AND THE FILM SAYS SO ON SCREEN: a single
// order-history screen, six tables in the join, p99 840 ms normalised against
// 4 ms projected, a projector consuming four event types, replica lag measured
// at 340 ms p50 / 1.4 s p99, and a read model rebuilt by replaying 4,200,000
// events. Nothing here is presented as a universal number.

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
import { SANS, SERIF, GEIST, HEAD } from "../fonts";
import { useK, useAppearAt, useLoop, lerp, clamp01 } from "../lib/anim";
import {
  RibbonField,
  BloomField,
  Grain,
  AZURE_STOPS,
  BLOOM_AZURE,
} from "../lib/gradient";
import {
  HeroCard,
  BigFigure,
  ProductPanel,
  Terminal,
  ShimmerText,
  RouteRow,
  MetaRow,
  FeedRow,
  GridPlate,
  R,
  SHADOW,
  display,
  tabular,
  microCap,
} from "../lib/cards";
import cfg from "../../episode.config.json";
// Its OWN measured lengths, out of its archive. `vo-durations.json` at the repo
// root is a SINGLE SHARED file, so the next episode with fewer lines makes
// `durs[8]` undefined here and this composition's durationInFrames becomes NaN —
// a hard render failure in a film nobody touched. A published episode keeps
// rebuilding to the cut that shipped.
import durs from "../../episodes/cqrs-write-here-read-there/vo-durations.json";

export const EP18_FPS = 30;
export const PAL18 = buildPalette("stripe-mesh");

const F = (n: number) => Math.round(n * EP18_FPS);

// Every panel in this film is this black. Not a tone per component, not a
// coloured edge to tell them apart — the CONTENT tells them apart.
const PANEL = "#0B0E14";
const ON = "#FFFFFF";
const ON_DIM = "rgba(255,255,255,0.45)";

/**
 * Indigo is the WRITE side, and it is the brand's one filled hue. The read side
 * gets EP16's second hue unchanged, which is deliberate series continuity: the
 * cool teal meant "the buffered, downstream, eventually-consistent half" there
 * and it means the same thing here. Red fails, green settles.
 *
 * The field's own #78B8F9 and #4D2FF9 are NOT in this list and never fill
 * anything — same rule stripe-mesh applies to ruby and magenta.
 */
const READ = "#22B8CF";
const BAD = "#C0123C";
const OK = "#0F9D58";

/* ── the schedule ────────────────────────────────────────────────────────────
 *
 * Scene seconds = VO + 0.35s breath, snapped UP to the 84bpm grid, off measured
 * narration lengths in `vo-durations.json`. Nothing here is hand-guessed, and
 * re-recording a line re-times every cut, camera key and cue below.
 * ─────────────────────────────────────────────────────────────────────────── */

const BREATH = 0.35;

type BeatDef = { id: string; vo?: number; hold?: number };

const DEFS: BeatDef[] = [
  { id: "open", vo: 1 }, // what one normalised read costs
  { id: "title", hold: 4.6 }, // ── silent: the bed lifts
  { id: "split", vo: 2 }, // the whole mechanism in one picture
  { id: "command", vo: 3 }, // a command is an intent
  { id: "read", vo: 4 }, // the read model is the screen
  { id: "project", vo: 5 }, // the projector does the work
  { id: "lag", vo: 6 }, // ← ACT BREAK: eventual consistency
  { id: "fix", vo: 7 }, // closing the gap on purpose
  { id: "rebuild", vo: 8 }, // the read model is disposable
  { id: "when", vo: 9 }, // refuse it by default
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

export const EP18_SECONDS = START[START.length - 1] + LEN[LEN.length - 1];
export const EP18_DURATION = Math.round(EP18_SECONDS * EP18_FPS);

/** Windows where a line is actually playing — the score ducks against these. */
const VO_WINDOWS = DEFS.map((d, i) =>
  d.vo ? [START[i], START[i] + durs[d.vo - 1]] : null,
).filter(Boolean) as [number, number][];

/* ── the strip ───────────────────────────────────────────────────────────── */

const STRIP_FROM = 2; // the strip starts after the title
const STRIP_IDS = DEFS.slice(STRIP_FROM).map((d) => d.id);
const STRIP_T0 = at(STRIP_IDS[0]);

/* ── THE ROUTE ───────────────────────────────────────────────────────────────
 *
 * Four across, down, four back, down to the sign-off — EP16's shape, because
 * this is the same 85-second film. Two kinds of move, which at this length is
 * the whole transition budget:
 *
 *   ACROSS (six legs) — 0.9s, flat and quick.
 *   DOWN (two legs) — 1.4s, and the camera LIFTS to 0.84 at the midpoint.
 *
 * The rows ARE the acts:
 *   row 0 — two models    split · command · read · project
 *   row 1 — what it costs  lag · fix · rebuild · when   (travelling back)
 *   row 2 — the sign-off   end
 * ─────────────────────────────────────────────────────────────────────────── */

const G = 100; // one cell = one frame, in %

const ROUTE: Record<string, [number, number]> = {
  split: [0, 0], command: [1, 0], read: [2, 0], project: [3, 0],
  lag: [3, 1], fix: [2, 1], rebuild: [1, 1], when: [0, 1],
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

export const Ep18: React.FC = () => (
  <AbsoluteFill style={{ background: PAL18.bg, fontFeatureSettings: '"ss01"' }}>
    <Sequence from={0} durationInFrames={F(len("open"))} name="1 · what one read costs">
      <ColdOpen />
    </Sequence>

    <Sequence from={F(at("title"))} durationInFrames={F(len("title"))} name="2 · title">
      <TitleCard />
    </Sequence>

    <Sequence
      from={F(STRIP_T0)}
      durationInFrames={EP18_DURATION - F(STRIP_T0)}
      name="3–11 · the strip"
    >
      <Strip />
    </Sequence>

    <Thread pal={PAL18} from={STRIP_T0} to={endOf("when")} />
    <OrderTrail />

    {/* LAST, so the wash covers the pinned chip and the thread too. */}
    <ActSlate />

    <Track />
  </AbsoluteFill>
);

/* ── the field ───────────────────────────────────────────────────────────────
 *
 * The supplied gradient, wired once so every use of it in the film is the same
 * object with the same clock. `atSeconds` is threaded through from the station
 * so the wave and the drift are continuous across the whole episode instead of
 * restarting at each stop.
 *
 * `grain={42}` is not a taste call: the component writes `(amount/100)*0.5` into
 * the SVG rect's opacity, so 42 lands on the supplied 0.210 exactly.
 * ─────────────────────────────────────────────────────────────────────────── */

const AzureField: React.FC<{
  atSeconds?: number;
  opacity?: number;
  drift?: number;
  offset?: number;
}> = ({ atSeconds, opacity = 1, drift = 0.019, offset = 0 }) => (
  <RibbonField
    angle={32}
    stops={AZURE_STOPS}
    grain={42}
    wave={30}
    waveCycles={2.2}
    wave2={15}
    wave2Cycles={1.1}
    motionAmount={0.2}
    soften={7}
    drift={drift}
    offset={offset}
    opacity={opacity}
    atSeconds={atSeconds}
  />
);

/**
 * The shimmer, in this film's own hues.
 *
 * The component's defaults are cream, sherbet and magenta — DESIGN.md's mesh,
 * correct on EP15 and EP16 and visibly wrong here: a warm gold band sweeping a
 * headline on an azure field is the one element in the frame nothing else
 * agrees with. Same machine, this episode's stops.
 */
const SHIMMER = ["#FFFFFF", "#D3E6FD", "#78B8F9", "#A8C0FF", "#FFFFFF"];

/**
 * A soft pool of shade under centred white type. The field runs from pure white
 * to deep #4D2FF9 across one diagonal, so any FIXED text colour is illegible
 * somewhere on it; picking a grey that survives both ends just means picking
 * grey. The scrim is the fix.
 */
const Scrim: React.FC<{ strength?: number }> = ({ strength = 0.34 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(64% 48% at 50% 52%, rgba(6,10,40,${strength}) 0%, rgba(6,10,40,0) 74%)`,
    }}
  />
);

/* ── beat 1 — what one normalised read costs ─────────────────────────────── */

/**
 * ONE card, centred, on the full-bleed field, with the only motion inside it.
 *
 * The figure is the beat: the order-history screen runs a six-table join on
 * every page load, and its p99 is 840 ms. The number counts UP, which is the
 * argument in one movement — this got worse as the schema got more correct.
 */
const ColdOpen: React.FC = () => {
  const k = useK();
  return (
    <AbsoluteFill>
      <AzureField />
      <Scrim strength={0.22} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <HeroCard
          pal={PAL18}
          title="GET /orders — one screen, one query"
          w={760}
          at={10}
          pips={[4, 0]}
        >
          <div style={{ display: "flex", alignItems: "flex-end", gap: 18 * k }}>
            <BigFigure value={840} at={26} dur={F(4.0)} size={124} />
            <span
              style={{
                ...microCap(19 * k),
                color: "rgba(255,255,255,0.55)",
                paddingBottom: 22 * k,
                whiteSpace: "nowrap",
              }}
            >
              ms · p99 · this system
            </span>
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 300,
              fontSize: 25 * k,
              lineHeight: 1.45,
              color: "rgba(255,255,255,0.66)",
              marginTop: 20 * k,
              maxWidth: 560 * k,
            }}
          >
            Six tables joined to answer one question, on every page load. The
            schema is correct. The screen is slow.
          </div>
          <div style={{ marginTop: 30 * k }}>
            <JoinChain />
          </div>
        </HeroCard>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * The six tables of the join, resolving left to right, forever. The last one
 * always stalls — the eye finds it and then watches the query keep waiting on
 * it. It never resolves, because that is the point: the beat has something to
 * do for its whole length rather than assembling and then holding.
 */
const JOIN = ["orders", "order_lines", "products", "customers", "addresses", "shipments"];

const JoinChain: React.FC = () => {
  const k = useK();
  const t = useLoop(F(3.8));
  const head = t * (JOIN.length + 1);
  return (
    // Six chips and five connectors have to fit the card's 704px inner width,
    // so the sizes here are measured against that, not chosen. The version that
    // shipped first was 16px with 10px padding and ran `shipments` off the
    // card's right edge — visible only in a still.
    <div style={{ display: "flex", alignItems: "center", gap: 6 * k }}>
      {JOIN.map((c, i) => {
        const on = head > i;
        const slow = i === JOIN.length - 1 && head > i + 0.4;
        return (
          <React.Fragment key={c}>
            {i > 0 && (
              <span
                style={{
                  width: 10 * k,
                  height: 2 * k,
                  background: on ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.12)",
                  flexShrink: 0,
                }}
              />
            )}
            <span
              style={{
                ...tabular(14 * k),
                color: slow ? "#FFFFFF" : on ? "rgba(255,255,255,0.86)" : "rgba(255,255,255,0.26)",
                background: slow ? BAD : on ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${on ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.07)"}`,
                borderRadius: R.sm * k,
                padding: `${8 * k}px ${8 * k}px`,
                whiteSpace: "nowrap",
              }}
            >
              {c}
            </span>
          </React.Fragment>
        );
      })}
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
      {/* The title is the ONE beat with large white type and no card under it,
          and the supplied field runs to pure white across its first third — so
          a fixed white headline is illegible somewhere on it no matter where it
          sits. `offset` slides the field along its own axis so the saturated
          half is behind the centre, and the scrim then only has to do the rest.
          Picking a grey that survives both ends would just mean picking grey. */}
      <AzureField drift={0.024} offset={-0.34} />
      <Scrim strength={0.2} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ ...microCap(24 * k), color: "rgba(255,255,255,0.8)", opacity: fade(0.15, 0.6) }}>
          {cfg.series} · {cfg.episode} · CQRS
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
            Write Here.
          </ShimmerText>
          <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, marginLeft: "0.26em" }}>
            Read There.
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
            maxWidth: 1180 * k,
          }}
        >
          {cfg.subtitle}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ── the act slate ───────────────────────────────────────────────────────────
 *
 * EP11's chapter mark, overlaid: a filled accent square with the act number set
 * heavy inside it, the act title enormous underneath, and the film beneath
 * washed out to near-white so the frame belongs entirely to the slate for a
 * moment.
 *
 * It costs NO RUNTIME, which is the only reason it is affordable at 85 seconds.
 * Both slates take the TAIL of the outgoing beat and clear BEFORE the incoming
 * station lands: taking the tail is free because the last second of a beat is a
 * hold, and clearing early matters because the station underneath has already
 * been mounting for LEAD seconds, so the wash lifts onto a frame that is half
 * assembled rather than onto an empty one. Running a slate past the arrival is
 * the version that looks wrong — the incoming station paints through the wash as
 * a big flat block behind the headline, and on the dark station that block eats
 * the headline's contrast entirely.
 * ─────────────────────────────────────────────────────────────────────────── */

const ACTS: { n: number; title: string; at: number; hold: number }[] = [
  // over the title card's tail, into the strip
  { n: 1, title: "Two models", at: at("split") - 1.1, hold: 1.9 },
  // over the projector beat's tail and the lift, clearing before the dark station
  { n: 2, title: "What it costs", at: at("lag") - 2.5, hold: 1.95 },
];

const ActSlate: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const t = frame / EP18_FPS;

  const act = ACTS.find((a) => t >= a.at - 0.25 && t <= a.at + a.hold + 0.45);
  if (!act) return null;

  const local = t - act.at;
  // in fast, out slower — the wash lifting slowly is what hands the frame back
  // to the film instead of cutting away from the slate
  const veil =
    clamp01((local + 0.25) / 0.34) * clamp01((act.at + act.hold + 0.45 - t) / 0.5);
  const p = clamp01(local / 0.62);
  const sq = 1 - Math.pow(1 - p, 3);
  const titleP = clamp01((local - 0.9) / 0.55);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* the wash. Not a flat white plate — the film stays faintly readable
          underneath, which is what makes it a slate laid ON the film rather
          than a slide the film cut to. */}
      <AbsoluteFill
        style={{
          background: PAL18.bg,
          // 0.965, not the 0.93 EP15–17 use. Those films wash out a white
          // canvas; slate 01 here lands over the title card, which is the
          // saturated field at full strength, and 7% of that is enough for
          // "Write Here. Read There." to read straight through the wash and
          // compete with the act title. The wash still is not opaque — the film
          // staying faintly there is what makes this a slate laid ON it rather
          // than a slide it cut to — but the threshold moves with the ground.
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
              background: PAL18.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: GEIST,
              fontWeight: 900,
              fontSize: 66 * k,
              color: "#FFFFFF",
              letterSpacing: "-0.02em",
              transform: `scale(${lerp(0.86, 1, sq)})`,
              boxShadow: `0 ${16 * k}px ${44 * k}px ${PAL18.accent}33`,
            }}
          >
            {String(act.n).padStart(2, "0")}
          </div>
          {/* HEAVY here, not the thin display register the stations use. The
              slate is a different kind of object from a station header and it
              must not be mistakable for one. */}
          <div
            style={{
              fontFamily: HEAD,
              fontWeight: 800,
              fontSize: 96 * k,
              letterSpacing: "-0.045em",
              lineHeight: 1.04,
              color: PAL18.ink,
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
 * ONE order, followed the whole way through, as a chip pinned to the frame
 * OUTSIDE the strip so no cut can interrupt it. `ord_9c14` is the id the command
 * station hands back in its 202 response, and every state below is something
 * the film has just said — which is the difference between a continuity device
 * and a dot that happens to persist.
 *
 * States are HELD, never interpolated. The id never moves; only the state word
 * animates, because the point is that it is the same order.
 * ─────────────────────────────────────────────────────────────────────────── */

type TrailState = "waiting" | "live" | "risk" | "safe" | "done";

const TRAIL: { at: number; label: string; state: TrailState }[] = [
  { at: at("split"), label: "command accepted", state: "waiting" },
  { at: at("split") + 4.6, label: "OrderPlaced appended", state: "live" },
  { at: at("command") + 3.6, label: "202 · no body returned", state: "waiting" },
  { at: at("read") + 3.6, label: "one row in order_summary", state: "safe" },
  { at: at("project") + 3.4, label: "4 events applied", state: "safe" },
  { at: at("lag") + 2.4, label: "written, not yet readable", state: "risk" },
  // NOT "stale for 340 ms". The lag station runs on a 3.9s loop that closes the
  // gap in its second half, so a chip asserting a live staleness contradicts the
  // panel beside it for half of every cycle. The chip states what HAPPENED to
  // this order, which is true at every frame of the beat.
  { at: at("lag") + 5.4, label: "readable — 340 ms later", state: "safe" },
  { at: at("fix") + 4.2, label: "pinned to the write side", state: "safe" },
  { at: at("rebuild") + 3.8, label: "replayed from event 1", state: "live" },
  { at: at("when") + 4.2, label: "answered in 4 ms", state: "done" },
];

const TRAIL_COLOR: Record<TrailState, string> = {
  waiting: PAL18.textMuted,
  live: READ,
  risk: BAD,
  safe: OK,
  done: PAL18.accent,
};

const OrderTrail: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const t = frame / EP18_FPS;
  if (t < STRIP_T0 - 0.4 || t > endOf("when") + 0.6) return null;

  let cur = TRAIL[0];
  let idx = 0;
  TRAIL.forEach((s, i) => {
    if (t >= s.at) { cur = s; idx = i; }
  });
  const tone = TRAIL_COLOR[cur.state];
  const since = clamp01((t - cur.at) / 0.42);
  const inOut = clamp01((t - (STRIP_T0 - 0.4)) / 0.6) * clamp01((endOf("when") + 0.6 - t) / 0.6);

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
      <span style={{ ...tabular(19 * k), color: ON }}>ord_9c14</span>
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
  const abs = STRIP_T0 + frame / EP18_FPS;

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
        <Station id="split" bg="band"><Mechanism /></Station>
        <Station id="command" bg="canvas"><TheCommand /></Station>
        <Station id="read" bg="soft"><ReadModel /></Station>
        <Station id="project" bg="canvas"><Projector /></Station>
        <Station id="lag" bg="dark"><Lag /></Station>
        <Station id="fix" bg="soft"><CloseTheGap /></Station>
        <Station id="rebuild" bg="canvas"><Rebuild /></Station>
        <Station id="when" bg="band"><WhenNot /></Station>
        <Station id="end" bg="field"><EndCard /></Station>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Seconds a station is mounted before the camera reaches it. */
const LEAD = 1.2;
/** Beat-seconds → station-local seconds, for anything authored in beat time. */
const bt = (sec: number) => sec + LEAD;

type BgKind = "canvas" | "soft" | "band" | "field" | "dark";

/**
 * One stop. Content mounts 1.2s before the camera arrives — a station that
 * populates on arrival reads as a slide loading; one already assembling as you
 * approach reads as a place you are travelling to.
 */
const Station: React.FC<{ id: string; bg: BgKind; children: React.ReactNode }> = ({
  id,
  bg,
  children,
}) => {
  const frame = useCurrentFrame();
  const abs = STRIP_T0 + frame / EP18_FPS;
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
 * The supplied field is BANDED — hard edges and a palette that changes sharply
 * across the frame — so it runs full-bleed only where there is no diagram to
 * cut through, and cropped to the top band where there is. Everywhere a station
 * has to stay readable it is `BLOOM_AZURE` instead: the same four hues with no
 * edges at all. Same colour story, two instruments.
 */
const ActBg: React.FC<{ kind: BgKind; atSeconds: number }> = ({ kind, atSeconds }) => {
  if (kind === "field")
    return (
      <AbsoluteFill>
        <AzureField atSeconds={atSeconds} drift={0.016} />
        <Scrim strength={0.24} />
      </AbsoluteFill>
    );
  if (kind === "dark")
    return (
      <AbsoluteFill style={{ background: "#080A16" }}>
        {/* This is the film's ONE true-dark station and it has to read as the
            darkest thing in the episode, or the value journey has no floor.
            A dark act is a DIMMER field, not no field: the bloom sits under a
            third of its own weight — present as colour in the corners, never as
            brightness across the frame. */}
        <BloomField
          stops={BLOOM_AZURE}
          origin="top-right"
          second={BLOOM_AZURE}
          secondOrigin="bottom-left"
          secondOpacity={0.5}
          size={112}
          grain={58}
          opacity={0.3}
          atSeconds={atSeconds}
        />
        <GridPlate pal={PAL18} tone="dark" pitch={72} opacity={0.8} />
      </AbsoluteFill>
    );
  if (kind === "band")
    return (
      <AbsoluteFill style={{ background: PAL18.bg }}>
        <div
          style={{
            position: "absolute", left: 0, right: 0, top: 0, height: "52%", overflow: "hidden",
            maskImage: "linear-gradient(to bottom, #000 52%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, #000 52%, transparent 100%)",
          }}
        >
          {/* The field is authored against the full frame and then cropped, so
              the band shows the SAME part of the gradient a full bleed would —
              re-deriving it against the band's own height would change the
              angle's apparent slope. */}
          <AzureField atSeconds={atSeconds} drift={0.013} />
        </div>
      </AbsoluteFill>
    );
  if (kind === "soft")
    return (
      <AbsoluteFill style={{ background: PAL18.bgDeep }}>
        <BloomField
          stops={BLOOM_AZURE}
          origin="bottom-right"
          size={104}
          grain={0}
          opacity={0.16}
          atSeconds={atSeconds}
        />
        <GridPlate pal={PAL18} pitch={72} opacity={0.85} />
        {/* The grain runs on EVERY station, including the plain ones. A field
            that is only grained where it is saturated makes the quiet stations
            read as a different, flatter film. */}
        <Grain amount={20} atSeconds={atSeconds} blend="multiply" />
      </AbsoluteFill>
    );
  return (
    <AbsoluteFill style={{ background: PAL18.bg }}>
      <BloomField
        stops={BLOOM_AZURE}
        origin="top-left"
        second={BLOOM_AZURE}
        secondOrigin="bottom-right"
        secondOpacity={0.5}
        size={110}
        grain={0}
        opacity={0.11}
        atSeconds={atSeconds}
      />
      <Grain amount={18} atSeconds={atSeconds} blend="multiply" />
    </AbsoluteFill>
  );
};

/* ── icons ──────────────────────────────────────────────────────────────────
 *
 * A labelled rectangle is a rectangle. The same rectangle with a cylinder in it
 * is A DATABASE, and the viewer knows that before reading a word. One weight,
 * one radius, one size, so they read as a family rather than clip art.
 * ─────────────────────────────────────────────────────────────────────────── */

type IcoName =
  | "server" | "db" | "list" | "cycle" | "check" | "cross" | "clock" | "screen"
  | "file" | "hash" | "split" | "person" | "sand" | "bolt" | "arrow" | "trash";

const Ico: React.FC<{ name: IcoName; size: number; color: string }> = ({ name, size, color }) => {
  const P: Record<IcoName, React.ReactNode> = {
    server: <><rect x="3" y="4" width="18" height="7" rx="2" /><rect x="3" y="13" width="18" height="7" rx="2" /><path d="M7 7.5h.01M7 16.5h.01" /></>,
    db: <><ellipse cx="12" cy="6" rx="8" ry="3.2" /><path d="M4 6v12c0 1.8 3.6 3.2 8 3.2s8-1.4 8-3.2V6" /><path d="M4 12c0 1.8 3.6 3.2 8 3.2s8-1.4 8-3.2" /></>,
    list: <path d="M4 6h16M4 12h16M4 18h10" />,
    cycle: <><path d="M20.5 12a8.5 8.5 0 1 1-2.9-6.4" /><path d="M20.8 3.6v4.8h-4.8" /></>,
    check: <path d="M4.5 12.6 9.5 17.6 19.5 6.6" />,
    cross: <path d="M6 6l12 12M18 6 6 18" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 6.6V12l3.6 2.2" /></>,
    screen: <><rect x="2.5" y="4" width="19" height="13" rx="2" /><path d="M9 21h6M12 17v4" /></>,
    file: <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4M9 12h6M9 16h4" /></>,
    hash: <path d="M5 9h14M5 15h14M9.5 4l-1.6 16M16 4l-1.6 16" />,
    split: <><path d="M4 12h4" /><path d="M8 12c4 0 4-6 8-6h4" /><path d="M8 12c4 0 4 6 8 6h4" /><path d="M17.5 3.5 20.5 6l-3 2.5M17.5 15.5 20.5 18l-3 2.5" /></>,
    person: <><circle cx="12" cy="8" r="3.4" /><path d="M5 20c1.2-3.6 4-5.4 7-5.4s5.8 1.8 7 5.4" /></>,
    sand: <><path d="M7 3h10M7 21h10" /><path d="M7 3c0 5 5 6.4 5 9s-5 4-5 9M17 3c0 5-5 6.4-5 9s5 4 5 9" /></>,
    bolt: <path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12z" />,
    arrow: <path d="M4 12h15m-5.5-5.5L19.5 12l-6 5.5" />,
    trash: <><path d="M4 6.5h16M9.5 6.5V4h5v2.5" /><path d="M6.5 6.5 7.6 21h8.8l1.1-14.5" /><path d="M10 10.5v7M14 10.5v7" /></>,
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

/**
 * The chapter mark, shrunk to a header and put on EVERY station. That is what
 * turns eight screens into a document with sections.
 */
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
          background: PAL18.accent,
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
          border: `1px solid ${dark ? "rgba(255,255,255,0.22)" : PAL18.border}`,
          borderLeft: "none",
          borderRadius: `0 ${R.md * k}px ${R.md * k}px 0`,
          padding: `${9 * k}px ${20 * k}px`,
          ...microCap(19 * k),
          color: dark ? "rgba(255,255,255,0.72)" : PAL18.textMuted,
          display: "flex",
          alignItems: "center",
          background: dark ? "transparent" : `${PAL18.bg}CC`,
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
        color: tone === "dark" ? "rgba(255,255,255,0.7)" : PAL18.textMuted,
        opacity: p,
        translate: `0 ${lerp(8, 0, p) * k}px`,
        textAlign: "center",
      }}
    >
      {children}
    </div>
  );
};

/* ── the coordinate space ────────────────────────────────────────────────────
 *
 * Every diagram is authored in ONE fixed design space and scaled as a unit, so
 * a connector's endpoint IS the box's edge. Boxes laid out with flexbox and
 * wires drawn with hand-guessed SVG coordinates will never agree, and the gap
 * reads as sloppy long before anyone can name why.
 * ─────────────────────────────────────────────────────────────────────────── */

const CW = 1760;

const Canvas: React.FC<{ h?: number; children: React.ReactNode }> = ({ h = 880, children }) => {
  const k = useK();
  return <div style={{ position: "relative", width: CW * k, height: h * k }}>{children}</div>;
};

const NodeBox: React.FC<{
  x: number; y: number; w: number; h: number;
  title: string; sub?: string; icon?: IcoName; tone?: string; at: number; fill?: string;
}> = ({ x, y, w, h, title, sub, icon, tone = PAL18.borderMid, at: a, fill }) => {
  const k = useK();
  const p = useAppearAt(a, 180);
  return (
    <div
      style={{
        position: "absolute", left: x * k, top: y * k, width: w * k, height: h * k,
        borderRadius: R.lg * k,
        background: fill ?? PANEL,
        border: "1px solid rgba(255,255,255,0.10)",
        boxShadow: SHADOW[3],
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: 8 * k, opacity: p, transform: `scale(${lerp(0.94, 1, p)})`,
      }}
    >
      {icon && <Ico name={icon} size={30 * k} color={tone} />}
      <div style={{ ...display(28 * k, -0.02), fontWeight: 400, color: ON, whiteSpace: "nowrap" }}>{title}</div>
      {sub && <div style={{ ...tabular(18 * k), color: ON_DIM, whiteSpace: "nowrap" }}>{sub}</div>}
    </div>
  );
};

/** A labelled connector, drawn on, with a packet running it once drawn. */
const Link: React.FC<{
  pts: [number, number][]; label?: string; at: number; dur?: number;
  tone?: string; flow?: boolean; labelAt?: [number, number]; h?: number; speed?: number;
  dashed?: boolean; bg?: string;
}> = ({
  pts, label, at: a, dur = 24, tone = PAL18.borderMid, flow = true, labelAt,
  h = 880, speed = 70, dashed = false, bg,
}) => {
  const k = useK();
  const frame = useCurrentFrame();
  const p = clamp01((frame - a) / dur);
  // Hoisted deliberately: a hook called inside the `p > 0.99` branch would make
  // the hook count change on the frame a line finishes drawing, which is React
  // error #310 — a hard render failure rather than a visual bug.
  const t = useLoop(speed, a / 200);
  const d = pts.map((q, i) => `${i ? "L" : "M"} ${q[0]} ${q[1]}`).join(" ");
  let pos = pts[0];
  if (p > 0.99 && flow) {
    const segs = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]));
    const total = segs.reduce((x, y) => x + y, 0);
    let want = t * total;
    for (let i = 0; i < segs.length; i++) {
      if (want <= segs[i]) {
        const u = want / Math.max(0.001, segs[i]);
        pos = [lerp(pts[i][0], pts[i + 1][0], u), lerp(pts[i][1], pts[i + 1][1], u)];
        break;
      }
      want -= segs[i];
    }
  }
  const [lx, ly] = labelAt ?? [
    (pts[0][0] + pts[pts.length - 1][0]) / 2,
    (pts[0][1] + pts[pts.length - 1][1]) / 2 - 22,
  ];
  const end = pts[pts.length - 1];
  const prev = pts[pts.length - 2] ?? pts[0];
  const ang = (Math.atan2(end[1] - prev[1], end[0] - prev[0]) * 180) / Math.PI;
  return (
    <>
      <svg
        style={{ position: "absolute", left: 0, top: 0, width: CW * k, height: h * k, overflow: "visible", pointerEvents: "none" }}
        viewBox={`0 0 ${CW} ${h}`}
      >
        <path
          d={d}
          fill="none"
          stroke={tone}
          strokeWidth={2.4}
          strokeDasharray={dashed ? "9 8" : undefined}
          pathLength={dashed ? undefined : 1}
          strokeDashoffset={dashed ? undefined : 1 - p}
          opacity={dashed ? p : 1}
        />
        {p > 0.98 && (
          <polygon points="0,-6 12,0 0,6" fill={tone} transform={`translate(${end[0]},${end[1]}) rotate(${ang})`} />
        )}
        {p > 0.99 && flow && <circle cx={pos[0]} cy={pos[1]} r={9} fill={tone} opacity={0.9} />}
      </svg>
      {label && p > 0.4 && (
        <div
          style={{
            position: "absolute", left: lx * k, top: ly * k, translate: "-50% -50%",
            ...tabular(21 * k), color: bg ? "#FFFFFF" : PAL18.textBody,
            background: bg ?? PAL18.bg, padding: `${3 * k}px ${10 * k}px`, borderRadius: 5 * k,
            opacity: clamp01((p - 0.4) / 0.4), whiteSpace: "nowrap",
          }}
        >
          {label}
        </div>
      )}
    </>
  );
};

/* ── beat 3 — the whole mechanism ────────────────────────────────────────────
 *
 * The signature graphic and the whole episode in one picture: one service with
 * TWO doors. Commands go up into the write model and become events; the
 * projector consumes them and upserts a row; queries go down into that row and
 * never touch the write side at all. Every station after this is a detail
 * lifted out of this diagram.
 *
 * Laid out as two lanes with the client between them, because the symmetry IS
 * the argument — the two paths leave the same box and never meet again.
 * ─────────────────────────────────────────────────────────────────────────── */

const MH = 700;

const CLIENT = { x: 40, y: 265, w: 340, h: 170 };
const WRITE = { x: 520, y: 90, w: 400, h: 170 };
const LOG = { x: 1120, y: 90, w: 400, h: 170 };
const PROJ = { x: 1120, y: 440, w: 400, h: 170 };
const READM = { x: 520, y: 440, w: 400, h: 170 };

const Mechanism: React.FC = () => {
  const k = useK();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <BoxTag n="01">two models, one service</BoxTag>
      <Canvas h={MH}>
        <NodeBox {...CLIENT} title="order-service" sub="one API" icon="server" tone={PAL18.accent} at={F(bt(0.2))} />
        <NodeBox {...WRITE} title="write model" sub="orders · order_lines" icon="db" tone="#FFFFFF" fill={PAL18.accent} at={F(bt(0.9))} />
        <NodeBox {...LOG} title="event log" sub="orders.events" icon="list" tone={PAL18.accent} at={F(bt(1.6))} />
        <NodeBox {...PROJ} title="projector" sub="apply → upsert" icon="cycle" tone={READ} at={F(bt(2.3))} />
        <NodeBox {...READM} title="read model" sub="order_summary" icon="db" tone={READ} at={F(bt(4.2))} />

        {/* the two doors, leaving the same box */}
        <Link
          pts={[[CLIENT.x + CLIENT.w, 320], [450, 320], [450, 175], [WRITE.x - 14, 175]]}
          label="command" labelAt={[452, 240]} at={F(bt(1.2))} tone={PAL18.accent} h={MH} speed={54}
        />
        <Link
          pts={[[CLIENT.x + CLIENT.w, 380], [450, 380], [450, 525], [READM.x - 14, 525]]}
          label="query" labelAt={[452, 462]} at={F(bt(4.8))} tone={READ} h={MH} speed={54}
        />

        {/* the one-way trip round the outside */}
        <Link pts={[[WRITE.x + WRITE.w, 175], [LOG.x - 14, 175]]} label="event" at={F(bt(1.9))} tone={PAL18.accent} h={MH} speed={60} />
        <Link pts={[[1320, LOG.y + LOG.h], [1320, PROJ.y - 14]]} label="consume" labelAt={[1320, 350]} at={F(bt(3.1))} tone={READ} h={MH} speed={66} />
        <Link pts={[[PROJ.x, 525], [READM.x + READM.w + 14, 525]]} label="upsert" at={F(bt(3.9))} tone={READ} h={MH} speed={72} />
      </Canvas>
      <Note at={F(bt(6.2))}>
        One service. Two doors. The read side never learns how the write side
        stores anything.
      </Note>
      <div style={{ height: 6 * k }} />
    </div>
  );
};

/* ── beat 4 — a command is an intent ─────────────────────────────────────── */

/**
 * The command as a piece of SOFTWARE rather than a drawing of one. A real
 * request, a real 202, and the field people expect and do not get — a body. The
 * panel puts `returns` second to last so the emptiness underneath it lands.
 */
const TheCommand: React.FC = () => {
  const k = useK();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <BoxTag n="02">send an intent, not a row</BoxTag>
      <div style={{ display: "flex", alignItems: "stretch", gap: 34 * k }}>
        <ProductPanel
          pal={PAL18}
          w={780}
          chrome="POST /orders · PlaceOrder"
          chromeRight="202"
          at={F(bt(0.4))}
        >
          <RouteRow pal={PAL18} method="POST" path="/orders" status="202" at={F(bt(1.0))} live />
          <MetaRow pal={PAL18} label="intent" value="PlaceOrder" at={F(bt(1.5))} hue={PAL18.accent} />
          <MetaRow pal={PAL18} label="payload" value='{"customer":"c_2210","items":3}' at={F(bt(2.1))} />
          <MetaRow pal={PAL18} label="checked against" value="the write model, and only it" at={F(bt(2.9))} />
          <MetaRow pal={PAL18} label="returns" value='{"id":"ord_9c14"}' at={F(bt(4.4))} hue={READ} />
          <MetaRow pal={PAL18} label="body" value="— nothing else" at={F(bt(5.4))} mutedValue />
        </ProductPanel>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 * k, justifyContent: "center" }}>
          <Fact k1="accepted" k2="not the same as completed" at={F(bt(3.4))} hot />
          <Fact k1="0 rows" k2="a command returns no data" at={F(bt(5.8))} />
          <Invariants at={F(bt(1.6))} />
        </div>
      </div>
      <Note at={F(bt(6.4))}>
        A command can be refused. That is the entire reason it exists.
      </Note>
    </div>
  );
};

const Fact: React.FC<{ k1: string; k2: string; at: number; hot?: boolean }> = ({
  k1, k2, at: a, hot = false,
}) => {
  const k = useK();
  const p = useAppearAt(a, 200);
  return (
    <div
      style={{
        background: PANEL,
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: R.md * k,
        padding: `${16 * k}px ${22 * k}px`,
        width: 400 * k,
        boxShadow: SHADOW[2],
        opacity: p,
        translate: `0 ${lerp(10, 0, p) * k}px`,
      }}
    >
      <div style={{ ...display(38 * k, -0.03), fontWeight: 400, color: hot ? PAL18.accent : ON, whiteSpace: "nowrap" }}>
        {k1}
      </div>
      <div style={{ ...microCap(15 * k), color: ON_DIM, marginTop: 8 * k, whiteSpace: "nowrap" }}>
        {k2}
      </div>
    </div>
  );
};

/**
 * The write model's four invariants, checked one at a time, forever. The whole
 * point of a command is that it can be told no, and a rule that is visibly
 * being evaluated says that better than a caption does. It loops, so the beat
 * keeps delivering for its whole length rather than assembling and holding.
 */
const RULES = ["stock reserved", "credit authorised", "address valid", "not a duplicate"];

const Invariants: React.FC<{ at: number }> = ({ at: a }) => {
  const k = useK();
  const p = useAppearAt(a, 200);
  const t = useLoop(F(4.4));
  const head = t * (RULES.length + 1.2);
  return (
    <div
      style={{
        background: PANEL,
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: R.md * k,
        padding: `${16 * k}px ${22 * k}px`,
        width: 400 * k,
        boxShadow: SHADOW[2],
        opacity: p,
        translate: `0 ${lerp(10, 0, p) * k}px`,
      }}
    >
      <div style={{ ...microCap(15 * k), color: ON_DIM, marginBottom: 12 * k }}>
        invariants · write side
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 * k }}>
        {RULES.map((r, i) => {
          const on = head > i + 1;
          return (
            <div key={r} style={{ display: "flex", alignItems: "center", gap: 10 * k }}>
              <Ico name={on ? "check" : "sand"} size={16 * k} color={on ? OK : "rgba(255,255,255,0.28)"} />
              <span
                style={{
                  ...tabular(17 * k),
                  color: on ? "rgba(255,255,255,0.86)" : "rgba(255,255,255,0.3)",
                  whiteSpace: "nowrap",
                }}
              >
                {r}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ── beat 5 — the read model IS the screen ───────────────────────────────── */

const JOIN_SQL = [
  { text: "SELECT o.id, o.placed_at, c.name, a.city,", prompt: ">" },
  { text: "       sum(l.qty * p.price) AS total, s.status", instant: true },
  { text: "  FROM orders o", instant: true },
  { text: "  JOIN order_lines l ON l.order_id = o.id", instant: true },
  { text: "  JOIN products p ON p.id = l.product_id", instant: true },
  { text: "  JOIN customers c ON c.id = o.customer_id", instant: true },
  { text: "  JOIN addresses a ON a.id = o.address_id", instant: true },
  { text: "  JOIN shipments s ON s.order_id = o.id", hot: "shipments", instant: true },
  { text: "", out: true, instant: true },
  { text: "Time: 840.212 ms", out: true, instant: true },
];

/**
 * The comparison beat, and the one place the film shows the same question
 * answered twice. The join TYPES — eight lines of it, which is the argument
 * made at length — and only once it has finished do the two latency bars land.
 * That staging is deliberate: the beat has a first half and a second half.
 */
const ReadModel: React.FC = () => {
  const k = useK();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <BoxTag n="03">shape it like the screen</BoxTag>
      <div style={{ display: "flex", alignItems: "center", gap: 36 * k }}>
        <Terminal
          pal={PAL18}
          lines={JOIN_SQL}
          title="psql · normalised"
          w={900}
          start={F(bt(0.5))}
          cps={116}
          at={F(bt(0.2))}
          size={20}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 18 * k }}>
          <ProductPanel
            pal={PAL18}
            w={620}
            chrome="order_summary · projected"
            chromeRight="1 row"
            at={F(bt(3.2))}
            dots={false}
          >
            <MetaRow pal={PAL18} label="order_id" value="ord_9c14" at={F(bt(3.6))} hue={READ} />
            <MetaRow pal={PAL18} label="customer_name" value="Priya Raman" at={F(bt(3.9))} />
            <MetaRow pal={PAL18} label="total_cents" value="860000" at={F(bt(4.2))} />
            <MetaRow pal={PAL18} label="status" value="shipped" at={F(bt(4.5))} />
          </ProductPanel>
          <Latency at={F(bt(5.0))} />
        </div>
      </div>
      <Note at={F(bt(6.6))}>
        The join is still correct. It is just answering a question nobody needed
        asked twice.
      </Note>
    </div>
  );
};

/**
 * Two bars and two counting numbers on ONE clock, so the join's bar crawling and
 * the projected bar arriving instantly are the same event seen twice rather
 * than two animations that happen to overlap.
 */
const Latency: React.FC<{ at: number }> = ({ at: a }) => {
  const k = useK();
  const frame = useCurrentFrame();
  const p = useAppearAt(a, 200);
  // the slow bar takes ~2.6s to fill; the fast one is done in a tenth of that
  const t = clamp01((frame - a) / F(2.6));
  const slow = Math.round(840 * t);
  const fast = Math.round(4 * clamp01(t / 0.05));
  const rows: [string, number, number, string][] = [
    ["six tables, joined", slow, t, BAD],
    ["one projected row", fast, clamp01(t / 0.05) * (4 / 840), READ],
  ];
  return (
    <div
      style={{
        background: PANEL,
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: R.md * k,
        padding: `${20 * k}px ${24 * k}px`,
        width: 620 * k,
        boxShadow: SHADOW[2],
        opacity: p,
        translate: `0 ${lerp(10, 0, p) * k}px`,
      }}
    >
      {rows.map(([label, v, frac, hue], i) => (
        <div key={label} style={{ marginTop: i ? 18 * k : 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 * k }}>
            <span style={{ ...microCap(15 * k), color: ON_DIM, flex: 1, whiteSpace: "nowrap" }}>{label}</span>
            <span style={{ ...display(34 * k, -0.03), fontWeight: 400, color: ON, fontVariantNumeric: "tabular-nums" }}>
              {v}
            </span>
            <span style={{ ...microCap(14 * k), color: ON_DIM }}>ms p99</span>
          </div>
          <div style={{ marginTop: 9 * k, height: 10 * k, borderRadius: 5 * k, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
            <div style={{ width: `${Math.max(0.6, frac * 100)}%`, height: "100%", background: hue, borderRadius: 5 * k }} />
          </div>
        </div>
      ))}
    </div>
  );
};

/* ── beat 6 — the projector ──────────────────────────────────────────────── */

const PROJECTOR = [
  { text: "async function apply(e: OrderEvent) {", prompt: ">" },
  { text: "  switch (e.type) {", instant: true },
  { text: "    case 'OrderPlaced':    return insert(e)", instant: true },
  { text: "    case 'OrderPaid':      return setStatus(e, 'paid')", instant: true },
  { text: "    case 'OrderShipped':   return setStatus(e, 'shipped')", instant: true },
  { text: "    case 'OrderCancelled': return remove(e)", instant: true },
  { text: "  }", instant: true },
  { text: "}", hot: "}", instant: true },
];

/**
 * The projector as code, typed, with its input running beside it. The event
 * feed and the applied counter never stop, which is what keeps this beat alive
 * after the code has finished typing.
 */
const Projector: React.FC = () => {
  const k = useK();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <BoxTag n="04">the projector does the work</BoxTag>
      <div style={{ display: "flex", alignItems: "center", gap: 36 * k }}>
        <Terminal
          pal={PAL18}
          lines={PROJECTOR}
          title="projector.ts"
          w={860}
          start={F(bt(0.5))}
          cps={120}
          at={F(bt(0.2))}
          size={21}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 18 * k }}>
          <EventStream at={F(bt(1.4))} />
          <Applied at={F(bt(3.2))} />
        </div>
      </div>
      <Note at={F(bt(4.6))}>
        Each event is read once and written once. Nothing recomputes a total
        that has not changed.
      </Note>
    </div>
  );
};

const EVENTS: [string, string][] = [
  ["OrderPlaced", "ord_9c14"],
  ["OrderPaid", "ord_9c14"],
  ["OrderShipped", "ord_9c14"],
  ["OrderCancelled", "ord_8f02"],
];

/** The log arriving, one event at a time, on a loop that never finishes. */
const EventStream: React.FC<{ at: number }> = ({ at: a }) => {
  const k = useK();
  const p = useAppearAt(a, 200);
  const t = useLoop(F(5.2));
  const head = Math.floor(t * EVENTS.length * 1.0001);
  return (
    <div style={{ opacity: p, translate: `0 ${lerp(10, 0, p) * k}px`, width: 600 * k }}>
      <ProductPanel pal={PAL18} w={600} chrome="orders.events" chromeRight="tail -f" at={0} dots={false}>
        {EVENTS.map(([type, id], i) => (
          <FeedRow
            key={type}
            pal={PAL18}
            type={type}
            when={id}
            at={0}
            hue={i === head ? PAL18.accent : READ}
            live={i === head}
          />
        ))}
      </ProductPanel>
    </div>
  );
};

/** A counter that never stops climbing — the log is always a bit further on. */
const Applied: React.FC<{ at: number }> = ({ at: a }) => {
  const k = useK();
  const frame = useCurrentFrame();
  const p = useAppearAt(a, 200);
  const n = 4_182_110 + Math.max(0, Math.round((frame - a) * 7.3));
  return (
    <div
      style={{
        background: PANEL,
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: R.md * k,
        padding: `${20 * k}px ${24 * k}px`,
        width: 600 * k,
        boxShadow: SHADOW[2],
        opacity: p,
        translate: `0 ${lerp(10, 0, p) * k}px`,
        display: "flex",
        alignItems: "baseline",
        gap: 16 * k,
      }}
    >
      <span style={{ ...display(50 * k, -0.04), fontWeight: 300, color: ON, fontVariantNumeric: "tabular-nums" }}>
        {n.toLocaleString("en-US")}
      </span>
      <span style={{ ...microCap(15 * k), color: ON_DIM, whiteSpace: "nowrap" }}>
        events applied · since the first one
      </span>
    </div>
  );
};

/* ── beat 7 — eventual consistency (ACT BREAK) ───────────────────────────────
 *
 * The first station of the cost act and the only true-dark station in the film.
 * The whole beat is ONE cycle, run twice: the write commits, the read model is
 * behind, the user refreshes into the gap, and then the projector catches up.
 * Modelling the real behaviour rather than fading in a caption is what gives
 * the beat something to do for its whole length.
 * ─────────────────────────────────────────────────────────────────────────── */

const Lag: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const t = useLoop(F(3.6), 0);
  // Four phases on ONE clock, and the third one is the whole reason this beat
  // is not static: the projector does not snap the gap shut, it works the
  // backlog off, so the counter CLIMBS to 340 and then falls back to zero.
  // Modelling that is both what a replica actually does and what keeps the
  // number moving for the beat's full length — the first cut of this station
  // held a frozen "0 · caught up" for 1.8s of every 3.9s cycle.
  //   0.00–0.06  idle
  //   0.06–0.58  written, not yet readable — the gap opens
  //   0.58–0.88  the projector catches up — the gap closes
  //   0.88–1.00  level, then the next write
  const written = t > 0.06 && t < 0.94;
  const projected = t > 0.58 && t < 0.94;
  const opening = clamp01((t - 0.06) / 0.52);
  const closing = clamp01((t - 0.58) / 0.3);
  const ms = Math.round(340 * opening * (1 - closing));
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <BoxTag n="05" tone="dark">the gap you just created</BoxTag>
      <div style={{ display: "flex", alignItems: "center", gap: 28 * k }}>
        <SidePanel
          label="write model"
          value={written ? "paid" : "pending"}
          hot={written}
          hue={PAL18.accent}
          at={F(bt(0.4))}
        />
        <GapMeter ms={ms} closed={projected && ms === 0} catching={projected} at={F(bt(0.8))} />
        <SidePanel
          label="read model"
          value={projected ? "paid" : "pending"}
          hot={projected}
          hue={READ}
          at={F(bt(1.2))}
        />
      </div>
      <ReplicationTrack opening={opening} closing={closing} at={F(bt(1.6))} />
      <RefreshRow stale={written && !projected} at={F(bt(2.2))} />
      <Note at={F(bt(5.4))} tone="dark">
        Measured on this system: 340 ms at p50, 1.4 s at p99. Both are long
        enough for a refresh.
      </Note>
    </div>
  );
};

const SidePanel: React.FC<{ label: string; value: string; hot: boolean; hue: string; at: number }> = ({
  label, value, hot, hue, at: a,
}) => {
  const k = useK();
  const p = useAppearAt(a, 190);
  return (
    <div
      style={{
        background: PANEL,
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: R.lg * k,
        padding: `${26 * k}px ${30 * k}px`,
        width: 420 * k,
        boxShadow: SHADOW[3],
        opacity: p,
        transform: `scale(${lerp(0.95, 1, p)})`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 * k }}>
        <span style={{ width: 9 * k, height: 9 * k, borderRadius: "50%", background: hue }} />
        <span style={{ ...microCap(16 * k), color: ON_DIM }}>{label}</span>
      </div>
      <div style={{ ...tabular(19 * k), color: "rgba(255,255,255,0.4)", marginTop: 16 * k }}>
        ord_9c14 · status
      </div>
      <div
        style={{
          ...display(64 * k, -0.045),
          fontWeight: 300,
          color: hot ? "#FFFFFF" : "rgba(255,255,255,0.34)",
          marginTop: 8 * k,
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </div>
    </div>
  );
};

/** The distance between the two panels, drawn as the distance it is. */
const GapMeter: React.FC<{ ms: number; closed: boolean; catching: boolean; at: number }> = ({
  ms, closed, catching, at: a,
}) => {
  const k = useK();
  const p = useAppearAt(a, 190);
  const tone = closed ? OK : catching ? READ : BAD;
  return (
    <div style={{ width: 280 * k, textAlign: "center", opacity: p }}>
      <div style={{ ...display(56 * k, -0.045), fontWeight: 300, color: tone, fontVariantNumeric: "tabular-nums" }}>
        {ms}
      </div>
      <div style={{ ...microCap(15 * k), color: ON_DIM, marginTop: 6 * k }}>ms behind</div>
      <div
        style={{
          marginTop: 16 * k,
          height: 8 * k,
          borderRadius: 4 * k,
          background: "rgba(255,255,255,0.09)",
          overflow: "hidden",
        }}
      >
        {/* The bar is derived from the SAME `ms` that is printed above it. A
            constant width beside an animated number is the small incoherence
            that makes an instrument look drawn rather than live. */}
        <div
          style={{
            width: `${Math.max(1, (ms / 340) * 100)}%`,
            height: "100%",
            background: tone,
            borderRadius: 4 * k,
          }}
        />
      </div>
      <div style={{ ...microCap(14 * k), color: tone, marginTop: 22 * k, whiteSpace: "nowrap" }}>
        {closed ? "caught up" : catching ? "catching up…" : "projecting…"}
      </div>
    </div>
  );
};

/**
 * The distance between the two panels, drawn at the width it actually is.
 *
 * The centre column was carrying this beat's whole argument in a 280px meter,
 * and a 280px meter is genuine motion that neither the pacing audit nor the eye
 * registers at video scale. This is the same information across 1,300px: the
 * event sits on the write side while the gap is open — pulsing, going nowhere —
 * and then crosses in one fast sweep when the projector catches up.
 */
const ReplicationTrack: React.FC<{ opening: number; closing: number; at: number }> = ({
  opening, closing, at: a,
}) => {
  const k = useK();
  const p = useAppearAt(a, 190);
  const W = 1300;
  const waiting = opening > 0 && closing === 0;
  const x = closing * W;
  const pulse = waiting ? 1 + 0.35 * Math.sin(opening * Math.PI * 8) : 1;
  return (
    <div style={{ width: W * k, marginTop: 34 * k, opacity: p, position: "relative", height: 46 * k }}>
      <div
        style={{
          position: "absolute", left: 0, right: 0, top: 28 * k, height: 4 * k,
          borderRadius: 2 * k, background: "rgba(255,255,255,0.09)",
        }}
      />
      <div
        style={{
          position: "absolute", left: 0, top: 28 * k, height: 4 * k, borderRadius: 2 * k,
          width: x * k, background: READ,
        }}
      />
      {opening > 0 && (
        <div
          style={{
            position: "absolute", left: x * k, top: 30 * k, translate: "-50% -50%",
            width: 20 * k, height: 20 * k, borderRadius: "50%",
            background: closing > 0 ? READ : BAD,
            transform: `scale(${pulse})`,
            boxShadow: `0 0 ${22 * k}px ${closing > 0 ? READ : BAD}`,
          }}
        />
      )}
      <span
        style={{
          position: "absolute", left: 0, top: 0, ...microCap(13 * k),
          color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap",
        }}
      >
        committed
      </span>
      <span
        style={{
          position: "absolute", right: 0, top: 0, ...microCap(13 * k),
          color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap",
        }}
      >
        readable
      </span>
    </div>
  );
};

/** The user, refreshing into the gap. The only person in the film. */
const RefreshRow: React.FC<{ stale: boolean; at: number }> = ({ stale, at: a }) => {
  const k = useK();
  const p = useAppearAt(a, 200);
  return (
    <div
      style={{
        marginTop: 34 * k,
        display: "flex",
        alignItems: "center",
        gap: 16 * k,
        background: PANEL,
        border: `1px solid ${stale ? `${BAD}88` : "rgba(255,255,255,0.12)"}`,
        borderRadius: R.pill,
        padding: `${13 * k}px ${26 * k}px`,
        boxShadow: SHADOW[2],
        opacity: p,
        translate: `0 ${lerp(10, 0, p) * k}px`,
      }}
    >
      <Ico name="person" size={22 * k} color={stale ? BAD : ON_DIM} />
      <span style={{ ...tabular(20 * k), color: ON, whiteSpace: "nowrap" }}>
        GET /orders/ord_9c14
      </span>
      <span style={{ ...tabular(18 * k), color: "rgba(255,255,255,0.22)" }}>·</span>
      <span style={{ ...microCap(16 * k), color: stale ? BAD : OK, whiteSpace: "nowrap" }}>
        {stale ? "they see pending — it is paid" : "they see the truth"}
      </span>
    </div>
  );
};

/* ── beat 8 — close the gap deliberately ─────────────────────────────────── */

const CloseTheGap: React.FC = () => {
  const k = useK();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <BoxTag n="06">three ways to close it</BoxTag>
      <div style={{ display: "flex", alignItems: "stretch", gap: 22 * k }}>
        {/* Spread across the WHOLE beat, not the first two seconds of it. Three
            cards landing inside 1.6s and then holding for six is the single
            longest dead stretch a station can have, and the fix is staging the
            information rather than adding motion to it. */}
        <Strategy
          n="A"
          title="answer from the command"
          body="Return the new state in the 202 itself. The one client who caused the change never has to ask for it."
          at={F(bt(0.5))}
          foot="200 { status: 'paid' }"
        />
        <PinStrategy at={F(bt(2.8))} />
        <Strategy
          n="C"
          title="carry a version"
          body="The client sends the version it last saw. The read side waits for it, or says so."
          at={F(bt(5.0))}
          foot="If-Match: v41"
        />
      </div>
      <Note at={F(bt(4.6))}>
        Pick one on purpose. Discovering it in production is how CQRS gets its
        reputation.
      </Note>
    </div>
  );
};

const Strategy: React.FC<{
  n: string; title: string; body: string; at: number; foot?: string;
}> = ({ n, title, body, at: a, foot }) => {
  const k = useK();
  const p = useAppearAt(a, 200);
  return (
    <div
      style={{
        background: PANEL,
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: R.lg * k,
        padding: `${26 * k}px ${28 * k}px`,
        width: 480 * k,
        minHeight: 340 * k,
        boxShadow: SHADOW[3],
        opacity: p,
        translate: `0 ${lerp(14, 0, p) * k}px`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 * k }}>
        <span
          style={{
            width: 34 * k, height: 34 * k, borderRadius: R.sm * k,
            background: PAL18.accent, color: "#FFFFFF",
            ...tabular(18 * k), display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          {n}
        </span>
        <span style={{ ...display(28 * k, -0.02), fontWeight: 400, color: ON }}>{title}</span>
      </div>
      <div
        style={{
          fontFamily: SANS, fontWeight: 300, fontSize: 24 * k, lineHeight: 1.5,
          color: "rgba(255,255,255,0.66)", marginTop: 20 * k, flex: 1,
        }}
      >
        {body}
      </div>
      {foot && (
        <div style={{ ...tabular(18 * k), color: READ, marginTop: 18 * k, whiteSpace: "nowrap" }}>
          {foot}
        </div>
      )}
    </div>
  );
};

/**
 * Strategy B carries the beat's motion: the session pin is a real countdown, so
 * one of the three cards is doing something for the whole length instead of all
 * three sitting still after they land.
 */
const PinStrategy: React.FC<{ at: number }> = ({ at: a }) => {
  const k = useK();
  const p = useAppearAt(a, 200);
  const t = useLoop(F(4.0));
  const left = (1 - t) * 3.0;
  return (
    <div
      style={{
        background: PANEL,
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: R.lg * k,
        padding: `${26 * k}px ${28 * k}px`,
        width: 480 * k,
        minHeight: 340 * k,
        boxShadow: SHADOW[3],
        opacity: p,
        translate: `0 ${lerp(14, 0, p) * k}px`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 * k }}>
        <span
          style={{
            width: 34 * k, height: 34 * k, borderRadius: R.sm * k,
            background: PAL18.accent, color: "#FFFFFF",
            ...tabular(18 * k), display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          B
        </span>
        <span style={{ ...display(28 * k, -0.02), fontWeight: 400, color: ON, whiteSpace: "nowrap" }}>
          read your own writes
        </span>
      </div>
      <div
        style={{
          fontFamily: SANS, fontWeight: 300, fontSize: 24 * k, lineHeight: 1.5,
          color: "rgba(255,255,255,0.66)", marginTop: 20 * k, flex: 1,
        }}
      >
        Route that one session to the write side for a few seconds. Everyone
        else keeps the fast path.
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 * k, marginTop: 18 * k }}>
        <Ico name="clock" size={20 * k} color={PAL18.accent} />
        <span style={{ ...tabular(18 * k), color: ON, whiteSpace: "nowrap" }}>c_2210 → write side</span>
        <span
          style={{
            ...tabular(18 * k), color: PAL18.accent, marginLeft: "auto",
            fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap",
          }}
        >
          {left.toFixed(1)}s
        </span>
      </div>
      <div style={{ marginTop: 10 * k, height: 6 * k, borderRadius: 3 * k, background: "rgba(255,255,255,0.09)", overflow: "hidden" }}>
        <div style={{ width: `${(1 - t) * 100}%`, height: "100%", background: PAL18.accent, borderRadius: 3 * k }} />
      </div>
    </div>
  );
};

/* ── beat 9 — the read model is disposable ───────────────────────────────── */

const REBUILD = [
  { text: "psql -c 'DROP TABLE order_summary'", prompt: "$" },
  { text: "DROP TABLE", out: true, instant: true },
  { text: "./projector --replay --from 1", prompt: "$", instant: true },
  { text: "replaying orders.events…", out: true, instant: true },
];

/**
 * The payoff, and the beat with the longest single movement in the film: the
 * replay meter runs for five seconds straight. That is not padding — a rebuild
 * taking visible time is the whole reason the read model being disposable is
 * remarkable rather than obvious.
 */
const Rebuild: React.FC = () => {
  const k = useK();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <BoxTag n="07">throw the read model away</BoxTag>
      <div style={{ display: "flex", alignItems: "center", gap: 36 * k }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 * k }}>
          <Terminal
            pal={PAL18}
            lines={REBUILD}
            title="deploy · rebuild"
            w={780}
            start={F(bt(0.5))}
            cps={40}
            at={F(bt(0.2))}
            size={22}
          />
          <div style={{ display: "flex", gap: 16 * k }}>
            <Fact k1="0" k2="events lost" at={F(bt(6.9))} />
            <Fact k1="0" k2="writes blocked" at={F(bt(7.2))} />
          </div>
        </div>
        <Replay at={F(bt(1.6))} />
      </div>
      <Note at={F(bt(5.2))}>
        The log is the source of truth. Everything else is a cache you are
        allowed to delete.
      </Note>
    </div>
  );
};

const TOTAL_EVENTS = 4_200_000;

const Replay: React.FC<{ at: number }> = ({ at: a }) => {
  const k = useK();
  const frame = useCurrentFrame();
  const p = useAppearAt(a, 200);
  const t = clamp01((frame - a) / F(5.0));
  // LINEAR, deliberately. The first cut eased this out, which meant the arc
  // barely moved across the last two seconds and the beat measured as static
  // through the middle of its own headline animation. A replay runs at a
  // roughly constant rate anyway, so the honest curve is also the one that
  // keeps the largest moving object on screen actually moving.
  const eased = t;
  const done = Math.round(TOTAL_EVENTS * eased);
  const rows = Math.round(11_400 * eased);
  const complete = t > 0.995;
  const ring = 128;
  const circ = 2 * Math.PI * ring;
  return (
    <div
      style={{
        background: PANEL,
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: R.lg * k,
        padding: `${30 * k}px ${34 * k}px`,
        width: 620 * k,
        boxShadow: SHADOW[3],
        opacity: p,
        transform: `scale(${lerp(0.95, 1, p)})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ position: "relative", width: 300 * k, height: 300 * k }}>
        <svg width={300 * k} height={300 * k} viewBox="0 0 300 300" style={{ position: "absolute", inset: 0 }}>
          {/* A filled sector rather than a hairline arc: the same information at
              a size the eye actually registers at video scale. */}
          <circle cx="150" cy="150" r={ring} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={34} />
          <circle
            cx="150" cy="150" r={ring} fill="none"
            stroke={complete ? OK : READ} strokeWidth={34} strokeLinecap="butt"
            strokeDasharray={`${circ * eased} ${circ}`}
            transform="rotate(-90 150 150)"
          />
        </svg>
        <div
          style={{
            position: "absolute", inset: 0, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
          }}
        >
          <div style={{ ...display(52 * k, -0.045), fontWeight: 300, color: ON, fontVariantNumeric: "tabular-nums" }}>
            {Math.round(eased * 100)}%
          </div>
          <div style={{ ...microCap(14 * k), color: ON_DIM, marginTop: 6 * k, whiteSpace: "nowrap" }}>
            {done.toLocaleString("en-US")} events
          </div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12 * k, marginTop: 20 * k }}>
        <span style={{ ...tabular(20 * k), color: complete ? OK : ON, whiteSpace: "nowrap" }}>
          {complete ? "order_summary rebuilt" : "order_summary building"}
        </span>
        <span style={{ ...microCap(14 * k), color: ON_DIM, whiteSpace: "nowrap" }}>
          {rows.toLocaleString("en-US")} rows
        </span>
      </div>
    </div>
  );
};

/* ── beat 10 — refuse it by default ──────────────────────────────────────── */

/**
 * The honest limitation, and the last thing the film says. Three corrections
 * that come from Greg Young himself, and one condition under which the pattern
 * is worth it — with a strip beside them testing four real systems against that
 * condition, so the beat argues instead of asserting.
 */
const NOTS: [string, string][] = [
  ["not event sourcing", "you can project from a table, a WAL, or a queue"],
  ["not eventual consistency", "project inside the transaction and there is no lag"],
  ["not an architecture", "it is one bounded context, not your whole system"],
];

const WhenNot: React.FC = () => {
  const k = useK();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <BoxTag n="08">use it almost never</BoxTag>
      <div style={{ display: "flex", alignItems: "center", gap: 34 * k }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 * k }}>
          {NOTS.map(([t, s], i) => (
            <NotRow key={t} title={t} sub={s} at={F(bt(0.5)) + i * 12} />
          ))}
          <Attribution at={F(bt(5.6))} />
        </div>
        <FitStrip at={F(bt(1.6))} />
      </div>
      <Note at={F(bt(6.4))}>
        Two models cost twice as much to own. Make the read side earn it.
      </Note>
    </div>
  );
};

const NotRow: React.FC<{ title: string; sub: string; at: number }> = ({ title, sub, at: a }) => {
  const k = useK();
  const p = useAppearAt(a, 200);
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 16 * k,
        background: PANEL,
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: R.md * k,
        padding: `${16 * k}px ${22 * k}px`,
        width: 720 * k,
        boxShadow: SHADOW[2],
        opacity: p,
        translate: `0 ${lerp(10, 0, p) * k}px`,
      }}
    >
      <Ico name="cross" size={20 * k} color={BAD} />
      <div>
        <div style={{ ...display(26 * k, -0.02), fontWeight: 400, color: ON, whiteSpace: "nowrap" }}>{title}</div>
        <div style={{ ...microCap(14 * k), color: ON_DIM, marginTop: 6 * k, whiteSpace: "nowrap" }}>{sub}</div>
      </div>
    </div>
  );
};

const Attribution: React.FC<{ at: number }> = ({ at: a }) => {
  const k = useK();
  const p = useAppearAt(a, 200);
  return (
    <div
      style={{
        ...tabular(18 * k),
        color: PAL18.textMuted,
        opacity: p,
        marginTop: 6 * k,
        whiteSpace: "nowrap",
      }}
    >
      named by Greg Young, 2010 · after Bertrand Meyer's CQS, 1988
    </div>
  );
};

/**
 * Four real systems judged against the one condition that justifies the
 * pattern — do the reads and the writes actually have different shapes? Three
 * fail it. The strip cycles, so the beat is still arguing when the narration
 * reaches the last line.
 */
const FITS: [string, string, boolean][] = [
  ["a CRUD admin panel", "same shape both ways", false],
  ["an internal dashboard", "cache it and move on", false],
  ["a product catalogue", "read-heavy, one shape", false],
  ["an order history screen", "6 joins, 40× the reads", true],
];

const FitStrip: React.FC<{ at: number }> = ({ at: a }) => {
  const k = useK();
  const p = useAppearAt(a, 200);
  const t = useLoop(F(5.6));
  const head = t * (FITS.length + 0.6);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 * k, opacity: p }}>
      {FITS.map(([name, why, fit], i) => {
        const on = head > i + 0.6;
        return (
          <div
            key={name}
            style={{
              display: "flex", alignItems: "center", gap: 14 * k,
              background: PANEL,
              border: `1px solid ${on && fit ? `${OK}66` : "rgba(255,255,255,0.10)"}`,
              borderRadius: R.md * k,
              padding: `${15 * k}px ${20 * k}px`,
              width: 560 * k,
              boxShadow: SHADOW[2],
            }}
          >
            <Ico
              name={on ? (fit ? "check" : "cross") : "sand"}
              size={19 * k}
              color={on ? (fit ? OK : "rgba(255,255,255,0.3)") : "rgba(255,255,255,0.22)"}
            />
            <span style={{ ...tabular(19 * k), color: on ? ON : "rgba(255,255,255,0.4)", flex: 1, whiteSpace: "nowrap" }}>
              {name}
            </span>
            <span
              style={{
                ...microCap(13 * k),
                color: on ? (fit ? OK : ON_DIM) : "rgba(255,255,255,0.2)",
                whiteSpace: "nowrap",
              }}
            >
              {on ? why : "…"}
            </span>
          </div>
        );
      })}
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
  split: "two models", command: "the command", read: "the read model",
  project: "the projector", lag: "the gap", fix: "closing it",
  rebuild: "rebuild", when: "refuse it",
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
  // The path draws in travel order, one station per ~7 frames.
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

const OPEN = 0.34;
const UNDER = 0.15;
const HAS_VO = Boolean(cfg.audio?.vo);

const bedVolume = (f: number) => {
  const t = f / EP18_FPS;
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
  const tail = clamp01((EP18_SECONDS - t) / 1.6);
  return v * head * tail;
};

const Track: React.FC = () => (
  <>
    {cfg.audio?.music && (
      <Sequence from={0} durationInFrames={EP18_DURATION} layout="none" name="score">
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

    {/* the beats that earn a real sound */}
    <Cue name="thunk" at={F(at("title") + 0.35)} volume={0.34} />
    {/* the two act slates landing — the square, then the title */}
    {ACTS.map((a) => (
      <React.Fragment key={a.n}>
        <Cue name="thunk" at={F(a.at + 0.06)} volume={0.32} />
        <Cue name="latch" at={F(a.at + 0.95)} volume={0.24} />
      </React.Fragment>
    ))}
    <Cue name="error" at={F(at("open") + 2.6)} volume={0.24} />
    <Cue name="latch" at={F(at("open") + 3.6)} volume={0.28} />

    {/* 01 — the five boxes landing, then the two doors opening */}
    {[0, 1, 2, 3, 4].map((i) => (
      <Cue key={`m${i}`} name="tick" at={F(at("split") + bt(0.2) + i * 0.7)} volume={0.2} />
    ))}
    <Cue name="sub" at={F(at("split") + bt(1.2))} volume={0.3} />
    <Cue name="blip" at={F(at("split") + bt(4.8))} volume={0.26} />

    {/* 02 — the request, then the four invariants clearing */}
    <TypeCues text="POST /orders" start={F(at("command") + bt(1.0))} cps={12} volume={0.18} />
    <Cue name="success" at={F(at("command") + bt(4.4))} volume={0.28} />
    {[0, 1, 2, 3].map((i) => (
      <Cue key={`inv${i}`} name="tick" at={F(at("command") + bt(1.8) + i * 1.1)} volume={0.16} />
    ))}

    {/* 03 — the join typing, then the two bars */}
    <TypeCues text={JOIN_SQL[0].text} start={F(at("read") + bt(0.5))} cps={116} volume={0.16} max={22} />
    <Cue name="error" at={F(at("read") + bt(7.6))} volume={0.24} />
    <Cue name="success" at={F(at("read") + bt(5.15))} volume={0.26} />

    {/* 04 — the projector typing, then the feed running */}
    <TypeCues text={PROJECTOR[0].text} start={F(at("project") + bt(0.5))} cps={120} volume={0.16} max={18} />
    {[0, 1, 2, 3].map((i) => (
      <Cue key={`ev${i}`} name="blip" at={F(at("project") + bt(1.6) + i * 1.3)} volume={0.18} />
    ))}

    {/* 05 — the cycle: commit, then the catch-up, twice */}
    {[0, 1].map((c) => (
      <React.Fragment key={`lag${c}`}>
        <Cue name="click" at={F(at("lag") + bt(0.9) + c * 3.6)} volume={0.28} />
        <Cue name="error" at={F(at("lag") + bt(1.5) + c * 3.6)} volume={0.24} />
        <Cue name="success" at={F(at("lag") + bt(3.0) + c * 3.6)} volume={0.26} />
      </React.Fragment>
    ))}

    {/* 06 — the three strategies landing */}
    {[0.5, 2.8, 5.0].map((s, i) => (
      <Cue key={`s${i}`} name="latch" at={F(at("fix") + bt(s))} volume={0.24} />
    ))}

    {/* 07 — DROP, then the replay running out, then the finish */}
    <Cue name="thunk" at={F(at("rebuild") + bt(1.1))} volume={0.3} />
    {Array.from({ length: 8 }).map((_, i) => (
      <Cue
        key={`r${i}`}
        name="tick"
        at={F(at("rebuild") + bt(1.6) + (1 - Math.pow(1 - (i + 1) / 8, 1 / 1.7)) * 5.0)}
        volume={0.15}
      />
    ))}
    <Cue name="success" at={F(at("rebuild") + bt(6.6))} volume={0.3} />

    {/* 08 — the three refusals, then the one that fits */}
    {[0, 1, 2].map((i) => (
      <Cue key={`n${i}`} name="error" at={F(at("when") + bt(0.5)) + i * 12} volume={0.2} />
    ))}
    <Cue name="success" at={F(at("when") + bt(5.6))} volume={0.28} />

    <Cue name="thunk" at={F(at("end") + 0.3)} volume={0.34} />
  </>
);
