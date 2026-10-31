// Author: Bishakh
//
// EP 16 — "Shout Once."
// SNS fans a message out. SQS holds it until the consumer is ready.
//
// THE CONSTRUCTION is EP 15's, unchanged, because it works: one continuous
// canvas the camera travels on a serpentine, stations instead of slides, one
// stroke-icon family so no box is ever just a labelled rectangle, the DESIGN.md
// marketing surface (bloom field, hero card, real product panels, the box
// pattern), and a continuity chip pinned to the frame that follows ONE message
// the whole way through.
//
// WHAT IS DIFFERENT is the shape, not the vocabulary. This is a 90-second
// episode: nine stations rather than thirteen, laid out four across and four
// back with the sign-off below, which gives the film exactly TWO act breaks —
// the lift into the failure act, and the lift out to the end card. A shorter
// film cannot afford three, because a move that means "new section" spent
// three times in ninety seconds stops meaning anything.
//
// THE FILM BREATHES IN VALUE, per act: saturated field on the open and title,
// white canvas across the mechanism, the cool canvas-soft and one true dark
// station through the failure act, then back to the saturated field to sign
// off. Each station paints its own act, so the value change arrives WITH the
// travel instead of as a cut.
//
// EVERY NUMBER ON SCREEN IS REAL AND SOURCED (AWS SQS/SNS developer guides):
// visibility timeout defaults to 30 seconds and maxes at 12 hours; retention
// defaults to 4 days and maxes at 14; a message is at most 256 KB; long polling
// waits up to 20 seconds; standard requests are $0.40 per million after the
// first million each month; FIFO does 300 messages a second, 3,000 with batches
// of ten, and dedupes on a 5-minute window; standard queues are at-least-once
// with best-effort ordering; a redrive policy moves a message to the
// dead-letter queue once it has been received maxReceiveCount times.

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
import { Cue } from "../lib/sound";
import { Thread } from "../lib/motifs";
import { snapUp } from "../lib/tempo";
import { buildPalette } from "../theme";
import { SANS, SERIF, GEIST, HEAD } from "../fonts";
import { useK, useAppearAt, useLoop, lerp, clamp01 } from "../lib/anim";
import { BloomField, BLOOM_INDIGO, BLOOM_CREAM, BLOOM_RUBY } from "../lib/gradient";
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
  Pill,
  R,
  SHADOW,
  display,
  tabular,
  microCap,
} from "../lib/cards";
import cfg from "../../episode.config.json";
// Its OWN measured lengths, out of its archive — a published episode must keep
// rebuilding to the film that shipped, not re-time itself off whatever the
// working file holds while a later episode is being cut.
import durs from "../../episodes/sns-sqs-shout-once/vo-durations.json";

export const EP16_FPS = 30;
export const PAL16 = buildPalette("stripe-mesh");

const F = (n: number) => Math.round(n * EP16_FPS);

// Every panel in this film is this black. Not a tone per component, not a
// coloured edge to tell them apart — the CONTENT tells them apart. A wall of
// near-identical dark windows over a bright field reads as an application; the
// same wall with six different coloured edges reads as a slide deck.
const PANEL = "#0B0E14";
const ON = "#FFFFFF";
const ON_DIM = "rgba(255,255,255,0.45)";

/** Indigo is the topic, teal is the queue, red fails, green settles. */
const QUEUE = "#22B8CF";
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
  { id: "open", vo: 1 }, // what a direct call costs
  { id: "title", hold: 4.6 }, // ── silent: the bed lifts
  { id: "topic", vo: 2 }, // the whole mechanism in one picture
  { id: "message", vo: 3 }, // what actually arrives
  { id: "filter", vo: 4 }, // filter at the subscription
  { id: "buffer", vo: 5 }, // the shock absorber
  { id: "visible", vo: 6 }, // ← ACT BREAK: visibility timeout
  { id: "dlq", vo: 7 }, // maxReceiveCount
  { id: "fifo", vo: 8 }, // standard vs FIFO
  { id: "poll", vo: 9 }, // long polling
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

export const EP16_SECONDS = START[START.length - 1] + LEN[LEN.length - 1];
export const EP16_DURATION = Math.round(EP16_SECONDS * EP16_FPS);

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
 * Four across, down, four back, down to the sign-off. Two kinds of move, which
 * on a ninety-second film is the whole transition budget:
 *
 *   ACROSS (six legs) — 0.9s, flat and quick. The next station is already
 *   sliding in as the last one leaves, so the cut is not a cut.
 *
 *   DOWN (two legs) — 1.4s, and the camera LIFTS: it pulls back to 0.84 at the
 *   midpoint and settles. It reads as stepping up and over, and it is spent
 *   only where the section actually changes.
 *
 * The rows ARE the acts:
 *   row 0 — how it works    topic · message · filter · buffer
 *   row 1 — how it fails    visible · dlq · fifo · poll   (travelling back)
 *   row 2 — the sign-off    end
 * ─────────────────────────────────────────────────────────────────────────── */

const G = 100; // one cell = one frame, in %

const ROUTE: Record<string, [number, number]> = {
  topic: [0, 0], message: [1, 0], filter: [2, 0], buffer: [3, 0],
  visible: [3, 1], dlq: [2, 1], fifo: [1, 1], poll: [0, 1],
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

export const Ep16: React.FC = () => (
  <AbsoluteFill style={{ background: PAL16.bg, fontFeatureSettings: '"ss01"' }}>
    <Sequence from={0} durationInFrames={F(len("open"))} name="1 · what a direct call costs">
      <ColdOpen />
    </Sequence>

    <Sequence from={F(at("title"))} durationInFrames={F(len("title"))} name="2 · title">
      <TitleCard />
    </Sequence>

    <Sequence
      from={F(STRIP_T0)}
      durationInFrames={EP16_DURATION - F(STRIP_T0)}
      name="3–11 · the strip"
    >
      <Strip />
    </Sequence>

    <Thread pal={PAL16} from={STRIP_T0} to={endOf("poll")} />
    <MessageTrail />

    {/* LAST, so the wash covers the pinned chip and the thread too. A slate
        with the continuity chip still burning through it is a slide with a
        sticker on it — for that second and a half the frame is the slate's. */}
    <ActSlate />

    <Track />
  </AbsoluteFill>
);

/* ── beat 1 — what a direct call costs ───────────────────────────────────── */

/**
 * ONE card, centred, on the full-bleed field, with the only motion inside it.
 *
 * The figure is the beat: five synchronous calls behind one write, and the
 * availability you actually get is the product of theirs. 99.9% five times over
 * is 99.5% — about forty minutes of failed writes a month, caused entirely by
 * services that had nothing to do with the write. The number counts DOWN, which
 * is the whole argument in one movement.
 */
const ColdOpen: React.FC = () => {
  const k = useK();
  return (
    <AbsoluteFill>
      <BloomField
        stops={BLOOM_CREAM}
        origin="bottom-middle"
        second={BLOOM_INDIGO}
        secondOrigin="top-right"
        size={132}
      />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <HeroCard
          pal={PAL16}
          title="POST /orders — waiting on 5 downstream calls"
          w={740}
          at={10}
          pips={[4, 0]}
        >
          <div style={{ display: "flex", alignItems: "flex-end", gap: 18 * k }}>
            <BigFigure value={99.5} decimals={1} suffix="%" at={26} dur={F(4.2)} size={124} />
            <span
              style={{
                ...microCap(19 * k),
                color: "rgba(255,255,255,0.55)",
                paddingBottom: 22 * k,
              }}
            >
              writes that survive
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
              maxWidth: 540 * k,
            }}
          >
            Five services at 99.9% each, in a row. Your write is only as good as
            all of them at once.
          </div>
          <div style={{ marginTop: 30 * k }}>
            <CallChain />
          </div>
        </HeroCard>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * The five calls, running left to right, forever. One of them times out on
 * every pass — always the same one, so the eye finds it and then watches the
 * chain keep trying around it. It never resolves, because that is the point:
 * the beat has something to do for its whole length instead of assembling and
 * then waiting for the narration to finish.
 */
const CALLS = ["inventory", "billing", "email", "search", "analytics"];

const CallChain: React.FC = () => {
  const k = useK();
  const t = useLoop(F(3.6));
  const head = t * (CALLS.length + 1);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 * k }}>
      {CALLS.map((c, i) => {
        const on = head > i;
        const fails = i === 3 && head > i + 0.5;
        return (
          <React.Fragment key={c}>
            {i > 0 && (
              <span
                style={{
                  width: 20 * k,
                  height: 2 * k,
                  background: on ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.12)",
                }}
              />
            )}
            <span
              style={{
                ...tabular(19 * k),
                color: fails ? "#FFFFFF" : on ? "rgba(255,255,255,0.86)" : "rgba(255,255,255,0.26)",
                background: fails ? BAD : on ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${on ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.07)"}`,
                borderRadius: R.sm * k,
                padding: `${11 * k}px ${13 * k}px`,
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
      <BloomField
        stops={BLOOM_INDIGO}
        origin="bottom-middle"
        second={BLOOM_RUBY}
        secondOrigin="bottom-right"
        secondOpacity={0.42}
        size={140}
      />
      <Scrim strength={0.18} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ ...microCap(24 * k), color: "rgba(255,255,255,0.8)", opacity: fade(0.15, 0.6) }}>
          {cfg.series} · {cfg.episode} · SNS + SQS
        </div>
        <div
          style={{
            ...display(148 * k, -0.05),
            color: "#FFFFFF",
            marginTop: 34 * k,
            opacity: fade(0.35, 0.85),
            translate: `0 ${rise(0.35, 1.1) * k}px`,
            textShadow: `0 ${8 * k}px ${40 * k}px rgba(30,0,20,0.35)`,
          }}
        >
          <ShimmerText start={F(0.6)} duration={2.0} pause={1.4} spread={1.5}>
            Shout
          </ShimmerText>
          <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, marginLeft: "0.3em" }}>
            Once.
          </span>
        </div>
        <div
          style={{
            marginTop: 30 * k,
            fontFamily: SANS,
            fontWeight: 300,
            fontSize: 32 * k,
            color: "rgba(255,255,255,0.86)",
            opacity: fade(1.1, 1.7),
          }}
        >
          {cfg.subtitle}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * A soft pool of shade under centred white type. The bloom runs from near-white
 * to deep indigo across one diagonal, so any FIXED text colour is illegible
 * somewhere on it; picking a grey that survives both ends just means picking
 * grey. The scrim is the fix.
 */
const Scrim: React.FC<{ strength?: number }> = ({ strength = 0.34 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(62% 46% at 50% 52%, rgba(8,4,26,${strength}) 0%, rgba(8,4,26,0) 72%)`,
    }}
  />
);

/* ── the act slate ───────────────────────────────────────────────────────────
 *
 * EP11's chapter mark, brought back because it is the strongest "new section"
 * device in the playlist: a filled accent square with the act number set heavy
 * inside it, the act title enormous underneath, and the film beneath washed out
 * to near-white so the frame belongs entirely to the slate for a moment.
 *
 * The reason it is affordable in an 84-second film is that it costs NO RUNTIME.
 * It is mounted outside the strip and overlaid on the two moves the film already
 * makes — the entry into the strip, and the one act-break lift. A slate that
 * needs its own beat would cost four seconds and one of the nine stations; a
 * slate laid over a move that is already happening costs nothing and makes the
 * move mean something. Two of them, at the only two real section changes: a
 * third would spend the device on a beat that is not a section change, and then
 * none of them would read as one.
 *
 * The order inside is EP11's and it matters: the square lands first on a spring
 * from 0.86, and the title follows ~0.9s later. Both arriving together reads as
 * a card fading in; staggered, the number introduces the section and the title
 * names it.
 * ─────────────────────────────────────────────────────────────────────────── */

/**
 * Both slates take the TAIL of the outgoing beat and clear before the incoming
 * station lands. That ordering is the whole thing:
 *
 *   - taking the tail is free — the last second of a beat is a hold, and a
 *     chapter card covering a hold costs nothing;
 *   - clearing early matters because the station underneath has already been
 *     mounting for `LEAD` seconds, so the wash lifts onto a frame that is
 *     halfway assembled rather than onto an empty one.
 *
 * Running a slate PAST the arrival is the version that looks wrong, and it looks
 * wrong in a specific way: the incoming station paints through the wash as a
 * big flat block behind the headline, and on the dark station that block eats
 * the headline's contrast entirely.
 */
const ACTS: { n: number; title: string; at: number; hold: number }[] = [
  // over the title card's tail, into the strip
  { n: 1, title: "How it works", at: at("topic") - 1.1, hold: 1.9 },
  // over the buffer beat's tail and the lift, clearing before the dark station
  { n: 2, title: "How it fails", at: at("visible") - 2.5, hold: 1.95 },
];

const ActSlate: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const t = frame / EP16_FPS;

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
          background: PAL16.bg,
          opacity: veil * 0.93,
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
              background: PAL16.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: GEIST,
              fontWeight: 900,
              fontSize: 66 * k,
              color: "#FFFFFF",
              letterSpacing: "-0.02em",
              transform: `scale(${lerp(0.86, 1, sq)})`,
              boxShadow: `0 ${16 * k}px ${44 * k}px ${PAL16.accent}33`,
            }}
          >
            {String(act.n).padStart(2, "0")}
          </div>
          {/* HEAVY here, not the thin DESIGN.md display register the stations
              use. The slate is a different kind of object from a station header
              and it should not be mistakable for one — and a black grotesque set
              enormous is the whole reason EP11's chapter marks land. */}
          <div
            style={{
              fontFamily: HEAD,
              fontWeight: 800,
              fontSize: 96 * k,
              letterSpacing: "-0.045em",
              lineHeight: 1.04,
              color: PAL16.ink,
              opacity: titleP,
              translate: `0 ${lerp(16, 0, titleP) * k}px`,
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
 * ONE message, followed the whole way through, as a chip pinned to the frame
 * OUTSIDE the strip so no cut can interrupt it. `m-8f21c4` is published on the
 * mechanism station and deleted on the last one, and every state below is
 * something the film has just said — which is the difference between a
 * continuity device and a dot that happens to persist.
 *
 * States are HELD, never interpolated. The id never moves; only the state word
 * animates, because the point is that it is the same message.
 * ─────────────────────────────────────────────────────────────────────────── */

type TrailState = "waiting" | "live" | "risk" | "safe" | "done";

const TRAIL: { at: number; label: string; state: TrailState }[] = [
  { at: at("topic"), label: "published to the topic", state: "waiting" },
  { at: at("topic") + 4.2, label: "copied into 3 queues", state: "live" },
  { at: at("message") + 3.0, label: "body · attributes · receipt handle", state: "live" },
  { at: at("filter") + 4.0, label: "matched the filter policy", state: "safe" },
  { at: at("buffer") + 3.4, label: "waiting · 12,400 deep", state: "waiting" },
  { at: at("visible") + 3.2, label: "invisible for 30s", state: "live" },
  { at: at("visible") + 6.4, label: "timed out — back on the queue", state: "risk" },
  { at: at("dlq") + 4.0, label: "receive 4 of 5", state: "risk" },
  { at: at("fifo") + 3.6, label: "delivered twice, order not promised", state: "risk" },
  { at: at("poll") + 4.2, label: "received, handled, deleted", state: "done" },
];

const TRAIL_COLOR: Record<TrailState, string> = {
  waiting: PAL16.textMuted,
  live: QUEUE,
  risk: BAD,
  safe: OK,
  done: PAL16.accent,
};

const MessageTrail: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const t = frame / EP16_FPS;
  if (t < STRIP_T0 - 0.4 || t > endOf("poll") + 0.6) return null;

  let cur = TRAIL[0];
  let idx = 0;
  TRAIL.forEach((s, i) => {
    if (t >= s.at) { cur = s; idx = i; }
  });
  const tone = TRAIL_COLOR[cur.state];
  const since = clamp01((t - cur.at) / 0.42);
  const inOut = clamp01((t - (STRIP_T0 - 0.4)) / 0.6) * clamp01((endOf("poll") + 0.6 - t) / 0.6);

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
      <span style={{ ...tabular(19 * k), color: ON }}>m-8f21c4</span>
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
  const abs = STRIP_T0 + frame / EP16_FPS;

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
    // translate sits on the inner one so the two never fight. Putting both on
    // one element scales the offset too, and the camera drifts off its station.
    <AbsoluteFill style={{ scale: `${s}` }}>
      <AbsoluteFill style={{ translate: `${-x}% ${-y}%` }}>
        <Station id="topic" bg="band"><Mechanism /></Station>
        <Station id="message" bg="canvas"><TheMessage /></Station>
        <Station id="filter" bg="soft"><FilterPolicy /></Station>
        <Station id="buffer" bg="canvas"><Buffer /></Station>
        <Station id="visible" bg="dark"><Visibility /></Station>
        <Station id="dlq" bg="soft"><DeadLetter /></Station>
        <Station id="fifo" bg="canvas"><StandardVsFifo /></Station>
        <Station id="poll" bg="band"><LongPoll /></Station>
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
  const abs = STRIP_T0 + frame / EP16_FPS;
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
 * The act's dominant field brightness. The travel is what carries you between
 * them — nothing reads as premium when every beat is the same brightness, and
 * this is the cheapest luxury in the kit.
 */
const ActBg: React.FC<{ kind: BgKind; atSeconds: number }> = ({ kind, atSeconds }) => {
  if (kind === "field")
    return (
      <AbsoluteFill>
        <BloomField
          stops={BLOOM_INDIGO}
          origin="bottom-middle"
          second={BLOOM_RUBY}
          secondOrigin="top-left"
          secondOpacity={0.4}
          size={145}
          atSeconds={atSeconds}
        />
        <Scrim strength={0.2} />
      </AbsoluteFill>
    );
  if (kind === "dark")
    return (
      <AbsoluteFill style={{ background: "#0A0C18" }}>
        {/* This is the film's ONE true-dark station and it has to read as the
            darkest thing in the episode, or the value journey has no floor.
            The bloom sits under a third of its own weight — present as colour
            in the corners, never as brightness across the frame. */}
        <BloomField
          stops={BLOOM_RUBY}
          origin="top-right"
          second={BLOOM_INDIGO}
          secondOrigin="bottom-left"
          secondOpacity={0.5}
          size={112}
          grain={58}
          opacity={0.34}
          atSeconds={atSeconds}
        />
        <GridPlate pal={PAL16} tone="dark" pitch={72} opacity={0.8} />
      </AbsoluteFill>
    );
  if (kind === "band")
    return (
      <AbsoluteFill style={{ background: PAL16.bg }}>
        <div
          style={{
            position: "absolute", left: 0, right: 0, top: 0, height: "52%", overflow: "hidden",
            maskImage: "linear-gradient(to bottom, #000 52%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, #000 52%, transparent 100%)",
          }}
        >
          <BloomField
            stops={BLOOM_CREAM}
            origin="top-left"
            second={BLOOM_INDIGO}
            secondOrigin="top-right"
            secondOpacity={0.5}
            size={120}
            grain={52}
            atSeconds={atSeconds}
          />
        </div>
      </AbsoluteFill>
    );
  if (kind === "soft")
    return (
      <AbsoluteFill style={{ background: PAL16.bgDeep }}>
        <GridPlate pal={PAL16} pitch={72} opacity={0.85} />
      </AbsoluteFill>
    );
  return <AbsoluteFill style={{ background: PAL16.bg }} />;
};

/* ── icons ──────────────────────────────────────────────────────────────────
 *
 * A labelled rectangle is a rectangle. The same rectangle with three stacked
 * bars in it is A QUEUE, and the viewer knows that before reading a word. One
 * weight, one radius, one size, so they read as a family rather than clip art.
 * ─────────────────────────────────────────────────────────────────────────── */

type IcoName =
  | "server" | "bell" | "queue" | "check" | "cross" | "cycle" | "clock" | "list"
  | "file" | "hash" | "db" | "person" | "sand" | "bolt" | "arrow" | "skull";

const Ico: React.FC<{ name: IcoName; size: number; color: string }> = ({ name, size, color }) => {
  const P: Record<IcoName, React.ReactNode> = {
    server: <><rect x="3" y="4" width="18" height="7" rx="2" /><rect x="3" y="13" width="18" height="7" rx="2" /><path d="M7 7.5h.01M7 16.5h.01" /></>,
    bell: <><path d="M6 9a6 6 0 0 1 12 0c0 5 1.6 6.4 1.6 6.4H4.4S6 14 6 9Z" /><path d="M10 19a2 2 0 0 0 4 0" /></>,
    queue: <><rect x="3" y="5" width="18" height="4" rx="1.4" /><rect x="3" y="11" width="13" height="4" rx="1.4" /><rect x="3" y="17" width="8" height="4" rx="1.4" /></>,
    check: <path d="M4.5 12.6 9.5 17.6 19.5 6.6" />,
    cross: <path d="M6 6l12 12M18 6 6 18" />,
    cycle: <><path d="M20.5 12a8.5 8.5 0 1 1-2.9-6.4" /><path d="M20.8 3.6v4.8h-4.8" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 6.6V12l3.6 2.2" /></>,
    list: <path d="M4 6h16M4 12h16M4 18h10" />,
    file: <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4M9 12h6M9 16h4" /></>,
    hash: <path d="M5 9h14M5 15h14M9.5 4l-1.6 16M16 4l-1.6 16" />,
    db: <><ellipse cx="12" cy="6" rx="8" ry="3.2" /><path d="M4 6v12c0 1.8 3.6 3.2 8 3.2s8-1.4 8-3.2V6" /><path d="M4 12c0 1.8 3.6 3.2 8 3.2s8-1.4 8-3.2" /></>,
    person: <><circle cx="12" cy="8" r="3.4" /><path d="M5 20c1.2-3.6 4-5.4 7-5.4s5.8 1.8 7 5.4" /></>,
    sand: <><path d="M7 3h10M7 21h10" /><path d="M7 3c0 5 5 6.4 5 9s-5 4-5 9M17 3c0 5-5 6.4-5 9s5 4 5 9" /></>,
    bolt: <path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12z" />,
    arrow: <path d="M4 12h15m-5.5-5.5L19.5 12l-6 5.5" />,
    skull: <><path d="M12 2.5c-4.7 0-8 3.2-8 7.5 0 2.6 1.2 4 2.5 5v3.5h11V15c1.3-1 2.5-2.4 2.5-5 0-4.3-3.3-7.5-8-7.5Z" /><path d="M9 11h.01M15 11h.01" /></>,
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
 * turns nine screens into a document with sections, which nine self-contained
 * slides can never be.
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
          background: PAL16.accent,
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
          border: `1px solid ${dark ? "rgba(255,255,255,0.22)" : PAL16.border}`,
          borderLeft: "none",
          borderRadius: `0 ${R.md * k}px ${R.md * k}px 0`,
          padding: `${9 * k}px ${20 * k}px`,
          ...microCap(19 * k),
          color: dark ? "rgba(255,255,255,0.72)" : PAL16.textMuted,
          display: "flex",
          alignItems: "center",
          background: dark ? "transparent" : `${PAL16.bg}CC`,
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
        color: tone === "dark" ? "rgba(255,255,255,0.7)" : PAL16.textMuted,
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
}> = ({ x, y, w, h, title, sub, icon, tone = PAL16.borderMid, at: a, fill }) => {
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
      <div style={{ ...display(28 * k, -0.02), fontWeight: 400, color: ON }}>{title}</div>
      {sub && <div style={{ ...tabular(19 * k), color: ON_DIM }}>{sub}</div>}
    </div>
  );
};

/** A labelled connector, drawn on, with a packet running it once drawn. */
const Link: React.FC<{
  pts: [number, number][]; label?: string; at: number; dur?: number;
  tone?: string; flow?: boolean; labelAt?: [number, number]; h?: number; speed?: number;
  dashed?: boolean; bg?: string;
}> = ({
  pts, label, at: a, dur = 24, tone = PAL16.borderMid, flow = true, labelAt,
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
        {p > 0.99 && flow && <circle cx={pos[0]} cy={pos[1]} r={6} fill={tone} opacity={0.9} />}
      </svg>
      {label && p > 0.4 && (
        <div
          style={{
            position: "absolute", left: lx * k, top: ly * k, translate: "-50% -50%",
            ...tabular(21 * k), color: bg ? "#FFFFFF" : PAL16.textBody,
            background: bg ?? PAL16.bg, padding: `${3 * k}px ${10 * k}px`, borderRadius: 5 * k,
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
 * The signature graphic and the whole episode in one picture: one publish
 * arriving at a topic, and the topic copying it into three queues that three
 * consumers drain at three different speeds. Every station after this is a
 * detail lifted out of this diagram.
 * ─────────────────────────────────────────────────────────────────────────── */

const MH = 660;

const PUB = { x: 60, y: 260, w: 330, h: 150 };
const TOPIC = { x: 620, y: 250, w: 340, h: 170 };
const QUEUES = [
  { y: 70, name: "orders-fulfil" },
  { y: 265, name: "orders-email" },
  { y: 460, name: "orders-search" },
];
const QX = 1250;
const QW = 440;
const QH = 130;

const Mechanism: React.FC = () => {
  const k = useK();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <BoxTag n="01">the mechanism</BoxTag>
      <Canvas h={MH}>
        <NodeBox
          {...PUB}
          title="order-service"
          sub="PutObject → Publish"
          icon="server"
          tone={PAL16.accent}
          at={F(bt(0.2))}
        />
        <NodeBox
          {...TOPIC}
          title="SNS topic"
          sub="orders.v1"
          icon="bell"
          tone={PAL16.accent}
          at={F(bt(1.0))}
          fill={PAL16.accent}
        />
        <Link
          pts={[[PUB.x + PUB.w, 335], [TOPIC.x - 14, 335]]}
          label="publish once"
          at={F(bt(1.4))}
          tone={PAL16.accent}
          h={MH}
          speed={52}
        />
        {QUEUES.map((q, i) => (
          <React.Fragment key={q.name}>
            <Link
              pts={[
                [TOPIC.x + TOPIC.w, 335],
                [TOPIC.x + TOPIC.w + 90, 335],
                [TOPIC.x + TOPIC.w + 90, q.y + QH / 2],
                [QX - 14, q.y + QH / 2],
              ]}
              at={F(bt(2.2)) + i * 7}
              tone={QUEUE}
              h={MH}
              speed={64 + i * 11}
            />
            <QueueBox x={QX} y={q.y} name={q.name} at={F(bt(2.6)) + i * 7} rate={0.7 + i * 0.5} />
          </React.Fragment>
        ))}
      </Canvas>
      <Note at={F(bt(4.4))}>
        One publish. Three copies. The publisher never learns who is listening.
      </Note>
      <div style={{ height: 6 * k }} />
    </div>
  );
};

/**
 * A queue drawn as a queue: a row of slots that fills from the right and drains
 * from the left, at its own rate, forever. Three of them running at three
 * speeds is the argument — the consumers are independent — made without a word.
 */
const QueueBox: React.FC<{
  x: number; y: number; name: string; at: number; rate: number;
}> = ({ x, y, name, at: a, rate }) => {
  const k = useK();
  const p = useAppearAt(a, 180);
  const t = useLoop(Math.round(F(4.2) / rate), a / 400);
  const SLOTS = 9;
  const filled = 2 + Math.round(Math.abs(Math.sin(t * Math.PI * 2)) * (SLOTS - 3));
  return (
    <div
      style={{
        position: "absolute", left: x * k, top: y * k, width: QW * k, height: QH * k,
        borderRadius: R.lg * k, background: PANEL,
        border: "1px solid rgba(255,255,255,0.10)", boxShadow: SHADOW[3],
        padding: `${14 * k}px ${18 * k}px`, opacity: p,
        transform: `scale(${lerp(0.94, 1, p)})`,
        display: "flex", flexDirection: "column", justifyContent: "center", gap: 12 * k,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 * k }}>
        <Ico name="queue" size={22 * k} color={QUEUE} />
        <span style={{ ...tabular(21 * k), color: ON, flex: 1 }}>{name}</span>
        {/* The depth is READ OFF the slots rather than written beside them. A
            static "depth 3" over a bar that is visibly seven long is the small
            incoherence that makes a diagram look drawn instead of live. */}
        <span style={{ ...microCap(14 * k), color: ON_DIM }}>depth {filled}</span>
      </div>
      <div style={{ display: "flex", gap: 5 * k }}>
        {Array.from({ length: SLOTS }).map((_, i) => (
          <span
            key={i}
            style={{
              flex: 1,
              height: 14 * k,
              borderRadius: 3 * k,
              background: i < filled ? QUEUE : "rgba(255,255,255,0.08)",
              opacity: i < filled ? 1 - i * 0.06 : 1,
            }}
          />
        ))}
      </div>
    </div>
  );
};

/* ── beat 4 — what actually arrives ──────────────────────────────────────── */

/**
 * The envelope, as a piece of SOFTWARE rather than a drawing of one. One real
 * body, real attributes, and the receipt handle — the field people forget,
 * which is why the panel puts it last and truncates it the way a console would.
 */
const TheMessage: React.FC = () => {
  const k = useK();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <BoxTag n="02">what arrives</BoxTag>
      <div style={{ display: "flex", alignItems: "stretch", gap: 34 * k }}>
        <ProductPanel
          pal={PAL16}
          w={760}
          chrome="ReceiveMessage · orders-fulfil"
          chromeRight="1 of 10"
          at={F(bt(0.4))}
        >
          <RouteRow pal={PAL16} method="BODY" path='{"order_id":"o_4471","total":8600}' at={F(bt(1.0))} />
          <MetaRow pal={PAL16} label="MessageId" value="m-8f21c4" at={F(bt(1.5))} hue={QUEUE} />
          <MetaRow pal={PAL16} label="attributes" value="event_type = order.placed" at={F(bt(2.0))} />
          <MetaRow pal={PAL16} label="ReceiptHandle" value="AQEB2b8…kT9w==" at={F(bt(2.5))} mutedValue />
          <MetaRow pal={PAL16} label="ApproximateReceiveCount" value="1" at={F(bt(3.0))} />
          <MetaRow pal={PAL16} label="SentTimestamp" value="1754812219417" at={F(bt(3.5))} mutedValue />
        </ProductPanel>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 * k, justifyContent: "center" }}>
          <Fact k1="256 KB" k2="max message size" at={F(bt(2.2))} />
          <Fact k1="4 days" k2="retention · 14 max" at={F(bt(2.8))} />
          <Fact k1="handle" k2="DeleteMessage needs it" at={F(bt(3.4))} hot />
        </div>
      </div>
      <Note at={F(bt(4.6))}>
        Reading a message does not remove it. Deleting it does.
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
        width: 380 * k,
        boxShadow: SHADOW[2],
        opacity: p,
        translate: `0 ${lerp(10, 0, p) * k}px`,
      }}
    >
      <div style={{ ...display(38 * k, -0.03), fontWeight: 400, color: hot ? PAL16.accent : ON }}>
        {k1}
      </div>
      <div style={{ ...microCap(15 * k), color: ON_DIM, marginTop: 8 * k, whiteSpace: "nowrap" }}>
        {k2}
      </div>
    </div>
  );
};

/* ── beat 5 — filter at the subscription ─────────────────────────────────── */

/**
 * The policy as a real console, typed rather than present — a viewer reads a
 * code block in about a second and then waits, and a window filling itself
 * turns the same five lines into five seconds of a beat that keeps delivering.
 *
 * Beside it, three subscriptions judged against it: two rejected, one kept. The
 * verdicts land one at a time, AFTER the policy has finished typing, so the
 * beat has a second half.
 */
const POLICY = [
  { text: "aws sns set-subscription-attributes \\", prompt: "$", },
  { text: "  --attribute-name FilterPolicy \\", instant: true },
  { text: '  --attribute-value \'{"event_type":["order.placed"]}\'', hot: "order.placed", instant: true },
  { text: "", out: true, instant: true },
  { text: "ok — evaluated at the topic, not in your code", out: true, instant: true },
];

const CANDIDATES: [string, boolean][] = [
  ["order.placed", true],
  ["order.refunded", false],
  ["cart.updated", false],
];

const FilterPolicy: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <BoxTag n="03">filter at the subscription</BoxTag>
      <div style={{ display: "flex", alignItems: "center", gap: 40 * k }}>
        <Terminal
          pal={PAL16}
          lines={POLICY}
          title="subscription · orders-fulfil"
          w={880}
          start={F(bt(0.6))}
          cps={46}
          at={F(bt(0.3))}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 14 * k }}>
          {CANDIDATES.map(([type, keep], i) => (
            <Verdict key={type} type={type} keep={keep} at={F(bt(3.0)) + i * 12} />
          ))}
        </div>
      </div>
      <Note at={F(bt(5.0))}>
        A dropped message is never billed to your consumer, and never wakes it up.
      </Note>
    </div>
  );
};

/**
 * One subscription judged against the policy. The verdict lands six frames
 * AFTER the row appears, so the row arriving and the row being decided are two
 * events rather than one — which is what makes the beat read as evaluation
 * rather than as three labels fading in.
 */
const Verdict: React.FC<{ type: string; keep: boolean; at: number }> = ({ type, keep, at: a }) => {
  const k = useK();
  const frame = useCurrentFrame();
  const p = useAppearAt(a, 200);
  const on = frame > a + 6;
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 14 * k,
        background: PANEL,
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: R.md * k,
        padding: `${14 * k}px ${20 * k}px`,
        width: 400 * k,
        boxShadow: SHADOW[2],
        opacity: p,
        translate: `0 ${lerp(10, 0, p) * k}px`,
      }}
    >
      <Ico
        name={on ? (keep ? "check" : "cross") : "sand"}
        size={22 * k}
        color={on ? (keep ? OK : BAD) : ON_DIM}
      />
      <span style={{ ...tabular(21 * k), color: ON, flex: 1 }}>{type}</span>
      <span style={{ ...microCap(14 * k), color: on ? (keep ? OK : BAD) : ON_DIM }}>
        {on ? (keep ? "delivered" : "dropped") : "…"}
      </span>
    </div>
  );
};

/* ── beat 6 — the shock absorber ─────────────────────────────────────────── */

/**
 * The QUANTITY argument, and the only beat in the film that gets one: a
 * producer running far faster than its consumer, with the queue depth between
 * them absorbing the difference. The bars are driven by one clock, so the spike
 * arriving, the depth climbing and the drain flattening are the SAME event seen
 * three ways rather than three animations that happen to overlap.
 */
const Buffer: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  // one clock: 0 → 1 across the beat, with the spike in the middle third
  const t = clamp01((frame - F(bt(0.8))) / F(5.6));
  // The producer spikes and comes back down; the consumer barely moves. DEPTH
  // is the integral of the difference, which is why it keeps climbing after the
  // spike has passed and then drains slowly instead of snapping to zero. That
  // shape is both what a queue actually does and what keeps the beat moving for
  // its whole length — a curve that resolves at t=0.4 leaves five dead seconds.
  const spike = Math.max(0, Math.sin(clamp01(t / 0.42) * Math.PI));
  const produced = 900 + spike * 11500;
  // Once the spike has passed the consumer does NOT drop back to idle — it is
  // pinned at capacity working the backlog off, which is the whole reason the
  // depth falls slowly instead of vanishing. Two identical numbers either side
  // of a full tank would read as a bug rather than as recovery.
  const consumed = t > 0.42 ? 1800 : 900 + spike * 900;
  const drain = 1 - 0.42 * clamp01((t - 0.5) / 0.5);
  const depth = Math.round(12400 * clamp01(t / 0.34) * drain);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <BoxTag n="04">the shock absorber</BoxTag>
      <div style={{ display: "flex", alignItems: "center", gap: 30 * k }}>
        <RateCard label="producer" value={Math.round(produced)} unit="msg / s" hue={PAL16.accent} at={F(bt(0.4))} />
        <DepthTank depth={depth} at={F(bt(0.9))} />
        <RateCard label="consumer" value={Math.round(consumed)} unit="msg / s" hue={QUEUE} at={F(bt(1.4))} />
      </div>
      <Note at={F(bt(4.6))}>
        The spike lands in the queue, not on the consumer. Nothing is dropped —
        it is just later.
      </Note>
    </div>
  );
};

const RateCard: React.FC<{
  label: string; value: number; unit: string; hue: string; at: number;
}> = ({ label, value, unit, hue, at: a }) => {
  const k = useK();
  const p = useAppearAt(a, 190);
  return (
    <div
      style={{
        background: PANEL,
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: R.lg * k,
        padding: `${26 * k}px ${30 * k}px`,
        width: 400 * k,
        boxShadow: SHADOW[3],
        opacity: p,
        transform: `scale(${lerp(0.95, 1, p)})`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 * k }}>
        <span style={{ width: 9 * k, height: 9 * k, borderRadius: "50%", background: hue }} />
        <span style={{ ...microCap(16 * k), color: ON_DIM }}>{label}</span>
      </div>
      <div style={{ ...display(74 * k, -0.045), fontWeight: 300, color: ON, marginTop: 14 * k, fontVariantNumeric: "tabular-nums" }}>
        {value.toLocaleString("en-US")}
      </div>
      <div style={{ ...microCap(15 * k), color: ON_DIM, marginTop: 6 * k }}>{unit}</div>
    </div>
  );
};

/** The queue itself, as a tank that fills between the two rates. */
const DepthTank: React.FC<{ depth: number; at: number }> = ({ depth, at: a }) => {
  const k = useK();
  const p = useAppearAt(a, 190);
  const fill = clamp01(depth / 12000);
  return (
    <div
      style={{
        width: 300 * k,
        height: 300 * k,
        borderRadius: R.lg * k,
        background: PANEL,
        border: "1px solid rgba(255,255,255,0.10)",
        boxShadow: SHADOW[3],
        opacity: p,
        transform: `scale(${lerp(0.95, 1, p)})`,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
      }}
    >
      <div
        style={{
          position: "absolute", left: 0, right: 0, bottom: 0,
          height: `${fill * 100}%`,
          background: `linear-gradient(180deg, ${QUEUE}66 0%, ${QUEUE}22 100%)`,
          borderTop: `2px solid ${QUEUE}`,
        }}
      />
      <div style={{ position: "relative", textAlign: "center", paddingBottom: 26 * k }}>
        <div style={{ ...display(56 * k, -0.04), fontWeight: 300, color: ON, fontVariantNumeric: "tabular-nums" }}>
          {depth.toLocaleString("en-US")}
        </div>
        <div style={{ ...microCap(15 * k), color: ON_DIM, marginTop: 8 * k }}>
          messages waiting
        </div>
      </div>
    </div>
  );
};

/* ── beat 7 — visibility timeout (ACT BREAK) ─────────────────────────────── */

/**
 * The first station of the failure act, and the only true-dark station in the
 * film. A message is taken, goes invisible for thirty seconds, and — because
 * this consumer crashed — comes straight back. The clock is the beat: it runs
 * once, visibly, and the return is what it resolves into.
 */
const Visibility: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  // The cycle RUNS TWICE across the beat. Once is the explanation; twice is the
  // point — a message that comes back is a message that will be taken again,
  // and the loop is the failure mode. It also gives a ten-second beat a second
  // half with as much happening in it as the first.
  const cycles = Math.max(0, (frame - F(bt(1.0))) / F(4.2));
  const pass = Math.min(1, Math.floor(cycles));
  const t = clamp01(cycles - pass);
  const returned = t > 0.9;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <BoxTag n="05" tone="dark">visibility timeout</BoxTag>
      <div style={{ display: "flex", alignItems: "center", gap: 44 * k }}>
        <ProductPanel
          pal={PAL16}
          w={520}
          chrome="orders-fulfil"
          chromeRight={returned ? "1 visible" : "0 visible"}
          at={F(bt(0.3))}
        >
          <FeedRow pal={PAL16} type="m-8f21c4" when={returned ? "visible again" : "in flight"} at={F(bt(0.9))} hue={returned ? BAD : QUEUE} live={returned} />
          <FeedRow pal={PAL16} type="m-a0d112" when="visible" at={F(bt(1.3))} hue={PAL16.textMuted} />
          <MetaRow pal={PAL16} label="VisibilityTimeout" value="30s · 12h max" at={F(bt(1.7))} />
          <MetaRow
            pal={PAL16}
            label="ApproximateReceiveCount"
            value={String(1 + pass + (returned ? 1 : 0))}
            at={F(bt(2.1))}
            hue={returned || pass > 0 ? BAD : undefined}
          />
        </ProductPanel>
        <Countdown t={t} />
        <div style={{ display: "flex", flexDirection: "column", gap: 16 * k, width: 500 * k }}>
          <StepRow n="1" label="ReceiveMessage" note="goes invisible" at={F(bt(1.4))} on={t > 0.02} />
          <StepRow n="2" label="your handler runs" note="the timeout, no more" at={F(bt(2.0))} on={t > 0.3} />
          <StepRow n="3" label="DeleteMessage" note={pass > 0 ? "still never sent" : "the worker died"} at={F(bt(2.6))} on={returned} bad />
        </div>
      </div>
      <Note at={F(bt(5.0))} tone="dark">
        No delete inside the window, and the message is simply visible again.
      </Note>
    </div>
  );
};

/**
 * The clock is the beat, so it is drawn as a WEDGE rather than a hairline arc.
 * A 10px stroke draining around a circle is a legible instrument and an
 * invisible amount of moving pixels; a filled sector sweeping through 360° is
 * the same information at a size the eye actually registers at video scale.
 */
const Countdown: React.FC<{ t: number }> = ({ t }) => {
  const k = useK();
  const secs = Math.max(0, Math.round(30 * (1 - t)));
  const done = secs === 0;
  const S = 300;
  const RAD = 122;
  const C = 2 * Math.PI * RAD;
  const ang = (1 - t) * Math.PI * 2 - Math.PI / 2;
  const large = 1 - t > 0.5 ? 1 : 0;
  const wedge = `M ${S / 2} ${S / 2} L ${S / 2} ${S / 2 - RAD} A ${RAD} ${RAD} 0 ${large} 1 ${
    S / 2 + RAD * Math.cos(ang)
  } ${S / 2 + RAD * Math.sin(ang)} Z`;
  return (
    <div style={{ position: "relative", width: S * k, height: S * k }}>
      <svg width={S * k} height={S * k} viewBox={`0 0 ${S} ${S}`}>
        <circle cx={S / 2} cy={S / 2} r={RAD} fill="rgba(255,255,255,0.04)" />
        {t < 0.999 && <path d={wedge} fill={done ? `${BAD}33` : `${QUEUE}2E`} />}
        <circle cx={S / 2} cy={S / 2} r={RAD} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="10" />
        <circle
          cx={S / 2} cy={S / 2} r={RAD} fill="none"
          stroke={done ? BAD : QUEUE} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={C * t}
          transform={`rotate(-90 ${S / 2} ${S / 2})`}
        />
      </svg>
      <div
        style={{
          position: "absolute", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
        }}
      >
        <span style={{ ...display(82 * k, -0.04), fontWeight: 300, color: done ? BAD : ON, fontVariantNumeric: "tabular-nums" }}>
          {secs}s
        </span>
        <span style={{ ...microCap(14 * k), color: ON_DIM, marginTop: 6 * k }}>
          {done ? "back on the queue" : "invisible"}
        </span>
      </div>
    </div>
  );
};

const StepRow: React.FC<{
  n: string; label: string; note: string; at: number; on: boolean; bad?: boolean;
}> = ({ n, label, note, at: a, on, bad = false }) => {
  const k = useK();
  const p = useAppearAt(a, 200);
  const hue = bad ? BAD : QUEUE;
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 14 * k,
        background: PANEL,
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: R.md * k,
        padding: `${13 * k}px ${18 * k}px`,
        opacity: p,
        translate: `0 ${lerp(10, 0, p) * k}px`,
      }}
    >
      <span
        style={{
          width: 26 * k, height: 26 * k, borderRadius: "50%",
          background: on ? hue : "rgba(255,255,255,0.10)",
          color: on ? "#FFFFFF" : ON_DIM,
          ...tabular(15 * k),
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}
      >
        {n}
      </span>
      <span style={{ ...tabular(19 * k), color: ON, whiteSpace: "nowrap" }}>{label}</span>
      <span
        style={{
          fontFamily: SANS, fontWeight: 300, fontSize: 17 * k, color: ON_DIM,
          marginLeft: "auto", textAlign: "right", whiteSpace: "nowrap",
        }}
      >
        {note}
      </span>
    </div>
  );
};

/* ── beat 8 — the dead-letter queue ──────────────────────────────────────── */

/**
 * The ladder. Five receives, each one failing, and on the fifth the message
 * leaves the queue for good. The rungs land one at a time across the beat —
 * this is the shape that has something to do for its whole length, and it is
 * why the cue set puts a tick on each one.
 */
const DeadLetter: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  // The rungs are spread across the WHOLE beat rather than resolving in three
  // seconds and leaving four with nothing on them, and the gap between them
  // widens the way a real backoff does — each wait is visibly longer than the
  // last, which is the thing the ladder is actually teaching.
  const u = clamp01((frame - F(bt(0.9))) / F(5.6));
  const step = Math.pow(u, 0.72) * 5;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <BoxTag n="06">the dead-letter queue</BoxTag>
      <div style={{ display: "flex", alignItems: "center", gap: 44 * k }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 * k }}>
          {Array.from({ length: 5 }).map((_, i) => {
            const on = step > i + 0.5;
            const last = i === 4;
            return (
              <div
                key={i}
                style={{
                  display: "flex", alignItems: "center", gap: 14 * k,
                  background: PANEL,
                  border: `1px solid rgba(255,255,255,${on ? 0.2 : 0.08})`,
                  borderRadius: R.md * k,
                  padding: `${13 * k}px ${20 * k}px`,
                  width: 480 * k,
                  boxShadow: SHADOW[2],
                  opacity: on ? 1 : 0.4,
                }}
              >
                <Ico name={on ? "cross" : "sand"} size={20 * k} color={on ? (last ? BAD : PAL16.textMuted) : ON_DIM} />
                <span style={{ ...tabular(19 * k), color: ON, flex: 1 }}>
                  receive {i + 1}
                </span>
                <span style={{ ...tabular(15 * k), color: "rgba(255,255,255,0.3)", marginRight: 10 * k }}>
                  +{[0, 20, 40, 80, 160][i]}s
                </span>
                <span style={{ ...microCap(14 * k), color: on ? (last ? BAD : ON_DIM) : "rgba(255,255,255,0.2)" }}>
                  {on ? (last ? "maxReceiveCount hit" : "handler threw") : "…"}
                </span>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 26 * k }}>
          <Ico name="arrow" size={44 * k} color={step > 5 ? BAD : PAL16.border} />
          <div
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 12 * k,
              background: PANEL,
              border: `1px solid ${step > 5 ? BAD : "rgba(255,255,255,0.10)"}`,
              borderRadius: R.lg * k,
              padding: `${30 * k}px ${40 * k}px`,
              boxShadow: SHADOW[3],
              opacity: step > 4.6 ? 1 : 0.35,
            }}
          >
            <Ico name="skull" size={40 * k} color={step > 5 ? BAD : ON_DIM} />
            <span style={{ ...display(34 * k, -0.02), fontWeight: 400, color: ON }}>orders-fulfil-dlq</span>
            <span style={{ ...tabular(18 * k), color: ON_DIM }}>1 message · 14-day retention</span>
          </div>
        </div>
      </div>
      <Note at={F(bt(5.2))}>
        A poison message loops forever without this. With it, it waits somewhere
        you can read it.
      </Note>
    </div>
  );
};

/* ── beat 9 — standard vs FIFO ───────────────────────────────────────────── */

/**
 * The trade, made as a comparison you can read in one look: what each queue
 * type promises on the left of its own panel, and what it costs on the right.
 * Both panels are the SAME black with the same hairline — the content tells
 * them apart, which is the rule that stops a comparison looking like a slide.
 */
const StandardVsFifo: React.FC = () => {
  const k = useK();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <BoxTag n="07">standard vs FIFO</BoxTag>
      <div style={{ display: "flex", gap: 34 * k }}>
        <ProductPanel pal={PAL16} w={660} chrome="standard queue" chromeRight="the default" at={F(bt(0.4))}>
          <MetaRow pal={PAL16} label="delivery" value="at-least-once" at={F(bt(1.0))} hue={BAD} />
          <MetaRow pal={PAL16} label="ordering" value="best effort" at={F(bt(1.4))} hue={BAD} />
          <MetaRow pal={PAL16} label="throughput" value="effectively unlimited" at={F(bt(1.8))} hue={OK} />
          <MetaRow pal={PAL16} label="price" value="$0.40 / million requests" at={F(bt(2.2))} mutedValue />
        </ProductPanel>
        <ProductPanel pal={PAL16} w={660} chrome="FIFO queue" chromeRight="orders.fifo" at={F(bt(0.8))} accent={QUEUE}>
          <MetaRow pal={PAL16} label="delivery" value="exactly-once processing" at={F(bt(1.2))} hue={OK} />
          <MetaRow pal={PAL16} label="ordering" value="strict, per MessageGroupId" at={F(bt(1.6))} hue={OK} />
          <MetaRow pal={PAL16} label="throughput" value="300 / s · 3,000 batched" at={F(bt(2.0))} hue={BAD} />
          <MetaRow pal={PAL16} label="dedupe window" value="5 minutes" at={F(bt(2.4))} mutedValue />
        </ProductPanel>
      </div>
      {/* The two panels state the trade; this states it in motion, and it keeps
          running for the rest of the beat. Same six messages published in the
          same order, arriving under each queue's own promise — the duplicate and
          the swap on the left are the entire argument, and no amount of prose
          in a panel row makes them as legible as watching them land wrong. */}
      <div style={{ display: "flex", gap: 34 * k, marginTop: 30 * k }}>
        <ArrivalStrip ordered={false} at={F(bt(3.2))} />
        <ArrivalStrip ordered at={F(bt(3.6))} />
      </div>
      <div style={{ display: "flex", gap: 14 * k, marginTop: 30 * k }}>
        <Pill pal={PAL16} at={F(bt(4.2))}>make the handler idempotent</Pill>
        <Pill pal={PAL16} at={F(bt(4.6))} filled={false}>and standard is usually enough</Pill>
      </div>
    </div>
  );
};

/**
 * Six messages published 1–6, arriving under one queue's promise. The standard
 * strip delivers `3` twice and puts `5` before `4`; the FIFO strip delivers
 * 1–6 once each, in order. Both loop on the same clock so they can be read
 * against each other, and the wrong ones are marked at the moment they land
 * rather than pre-coloured — the viewer sees the fault happen.
 */
const SENT = [1, 2, 3, 4, 5, 6];
const SHUFFLED = [1, 3, 2, 3, 5, 4, 6];

const ArrivalStrip: React.FC<{ ordered: boolean; at: number }> = ({ ordered, at: a }) => {
  const k = useK();
  const p = useAppearAt(a, 200);
  const seq = ordered ? SENT : SHUFFLED;
  const t = useLoop(F(4.4), ordered ? 0 : 0.02);
  const head = t * (seq.length + 1.4);
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 9 * k,
        background: PANEL,
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: R.md * k,
        padding: `${14 * k}px ${18 * k}px`,
        width: 660 * k,
        boxShadow: SHADOW[2],
        opacity: p,
      }}
    >
      <span
        style={{
          ...microCap(14 * k), color: ON_DIM, width: 126 * k, flexShrink: 0, whiteSpace: "nowrap",
        }}
      >
        {ordered ? "in order" : "as it comes"}
      </span>
      {seq.map((n, i) => {
        const on = head > i;
        // a repeat of a value already delivered, or a value that arrived before
        // one it should have followed
        const dupe = !ordered && seq.indexOf(n) !== i;
        const swap = !ordered && i > 0 && n < seq[i - 1] && !dupe;
        const wrong = on && (dupe || swap);
        return (
          <span
            key={`${n}-${i}`}
            style={{
              ...tabular(23 * k),
              width: 54 * k,
              textAlign: "center",
              padding: `${11 * k}px 0`,
              borderRadius: R.sm * k,
              color: on ? "#FFFFFF" : "rgba(255,255,255,0.22)",
              background: wrong ? BAD : on ? (ordered ? `${OK}55` : "rgba(255,255,255,0.10)") : "rgba(255,255,255,0.04)",
            }}
          >
            {n}
          </span>
        );
      })}
    </div>
  );
};

/* ── beat 10 — long polling ──────────────────────────────────────────────── */

/**
 * The cheapest fix in the episode, and the one nobody turns on. Short polling
 * returns immediately and mostly empty; long polling waits up to twenty seconds
 * and returns when there is something to return. The two columns run the SAME
 * clock, so the wall of empty receives on the left and the four real ones on
 * the right are directly comparable — which is the entire argument.
 */
const LongPoll: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const t = clamp01((frame - F(bt(0.8))) / F(4.4));
  const shortReq = Math.round(t * 120);
  const longReq = Math.round(t * 6);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <BoxTag n="08">long polling</BoxTag>
      <div style={{ display: "flex", alignItems: "stretch", gap: 34 * k }}>
        {/* The four real messages sit at FIXED positions in each card — they are
            the same four messages, arriving at the same four moments. Pinning
            them to the head of the counter instead would make them ride along
            with it, which reads as "the last four were real" and quietly
            destroys the comparison the beat exists to make. */}
        <PollCard
          title="WaitTimeSeconds = 0"
          sub="short polling · returns immediately"
          reqs={shortReq}
          total={120}
          hue={BAD}
          at={F(bt(0.3))}
        />
        <PollCard
          title="WaitTimeSeconds = 20"
          sub="long polling · waits for a message"
          reqs={longReq}
          total={6}
          hue={OK}
          at={F(bt(0.8))}
        />
      </div>
      <Note at={F(bt(4.4))}>
        Same four messages. Twenty times the requests, and you paid for every one.
      </Note>
    </div>
  );
};

const PollCard: React.FC<{
  title: string; sub: string; reqs: number; total: number; hue: string; at: number;
}> = ({ title, sub, reqs, total, hue, at: a }) => {
  const k = useK();
  const p = useAppearAt(a, 190);
  const DOTS = 120;
  // the four moments a message actually existed, as indices into this card's
  // own request count — same four events, counted on two different clocks
  const REAL = [0.18, 0.42, 0.71, 0.96].map((f) => Math.round(f * (total - 1)));
  return (
    <div
      style={{
        background: PANEL,
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: R.lg * k,
        padding: `${28 * k}px ${32 * k}px`,
        width: 660 * k,
        boxShadow: SHADOW[3],
        opacity: p,
        transform: `scale(${lerp(0.96, 1, p)})`,
      }}
    >
      <div style={{ ...tabular(24 * k), color: ON }}>{title}</div>
      <div style={{ ...microCap(15 * k), color: ON_DIM, marginTop: 8 * k }}>{sub}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 * k, marginTop: 26 * k, height: 84 * k, alignContent: "flex-start" }}>
        {Array.from({ length: DOTS }).map((_, i) => {
          const on = i < reqs;
          const real = on && REAL.includes(i);
          return (
            <span
              key={i}
              style={{
                width: 15 * k,
                height: 15 * k,
                borderRadius: 3 * k,
                background: real ? QUEUE : on ? `${hue}66` : "rgba(255,255,255,0.05)",
                boxShadow: real ? `0 0 ${10 * k}px ${QUEUE}` : undefined,
              }}
            />
          );
        })}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12 * k, marginTop: 20 * k }}>
        <span style={{ ...display(48 * k, -0.04), fontWeight: 300, color: hue, fontVariantNumeric: "tabular-nums" }}>
          {reqs}
        </span>
        <span style={{ ...microCap(15 * k), color: ON_DIM }}>requests · 4 messages</span>
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
            textShadow: `0 ${8 * k}px ${40 * k}px rgba(10,4,30,0.5)`,
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
            opacity: fade(SIGN + 1.6, SIGN + 2.1),
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
  topic: "the mechanism", message: "what arrives", filter: "filter policy",
  buffer: "the buffer", visible: "visibility", dlq: "dead letters",
  fifo: "standard vs FIFO", poll: "long polling",
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
  const t = f / EP16_FPS;
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
  const tail = clamp01((EP16_SECONDS - t) / 1.6);
  return v * head * tail;
};

const Track: React.FC = () => (
  <>
    {cfg.audio?.music && (
      <Sequence from={0} durationInFrames={EP16_DURATION} layout="none" name="score">
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
    <Cue name="error" at={F(at("open") + 2.2)} volume={0.24} />
    <Cue name="latch" at={F(at("open") + 3.4)} volume={0.28} />
    <Cue name="sub" at={F(at("topic") + bt(1.4))} volume={0.3} />
    {/* the three fan-out legs arriving, one cue each */}
    {[0, 1, 2].map((i) => (
      <Cue key={`fan${i}`} name="blip" at={F(at("topic") + bt(2.6)) + i * 7} volume={0.24} />
    ))}
    <Cue name="tick" at={F(at("message") + bt(1.5))} volume={0.24} />
    <Cue name="latch" at={F(at("message") + bt(3.4))} volume={0.28} />
    {/* the three verdicts landing */}
    {[0, 1, 2].map((i) => (
      <Cue
        key={`v${i}`}
        name={i === 0 ? "success" : "error"}
        at={F(at("filter") + bt(3.0)) + i * 12 + 6}
        volume={0.24}
      />
    ))}
    <Cue name="notify" at={F(at("buffer") + bt(2.4))} volume={0.26} />
    <Cue name="click" at={F(at("visible") + bt(1.0))} volume={0.3} />
    <Cue name="error" at={F(at("visible") + bt(4.9))} volume={0.3} />
    <Cue name="click" at={F(at("visible") + bt(5.2))} volume={0.28} />
    <Cue name="error" at={F(at("visible") + bt(9.1))} volume={0.3} />
    {/* the ladder climbing, one cue a rung, then the drop */}
    {Array.from({ length: 5 }).map((_, i) => (
      <Cue
        key={`d${i}`}
        name="tick"
        at={F(at("dlq") + bt(0.9) + Math.pow((i + 0.5) / 5, 1 / 0.72) * 5.6)}
        volume={0.18}
      />
    ))}
    <Cue name="thunk" at={F(at("dlq") + bt(6.4))} volume={0.28} />
    <Cue name="sub" at={F(at("fifo") + bt(0.8))} volume={0.28} />
    <Cue name="latch" at={F(at("fifo") + bt(4.2))} volume={0.26} />
    <Cue name="success" at={F(at("poll") + bt(4.2))} volume={0.3} />
    <Cue name="thunk" at={F(at("end") + 0.3)} volume={0.34} />
  </>
);
