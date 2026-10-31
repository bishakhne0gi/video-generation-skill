// Author: Bishakh
//
// EP 15 — "We'll Call You."
// Webhooks: an HTTP request you didn't make, arriving at a route you own.
//
// THE CONSTRUCTION is EP 13/14's, unchanged, because it works: one continuous
// vertical strip the camera travels, stations instead of slides, a single
// stroke-icon family so no box is ever just a rectangle, and the marquee
// drag+zoom on the two beats where the narration says "look at this part".
//
// THE SURFACE is new, and it is the whole point of this episode's look. Three
// pieces of vocabulary carry it, all of them in `lib/gradient.tsx` and
// `lib/cards.tsx`, all of them designed in the `SurfaceLab` composition first:
//
//   THE RIBBON FIELD — the animated stripe gradient. Full-bleed under the cold
//   open, the title and the end card; cropped to a header band over canvas on
//   the teaching stations, which is DESIGN.md's actual marketing construction
//   rather than a decoration laid over everything.
//
//   THE 3D CARD MARQUEE — four columns of event cards under one perspective
//   tilt, running in alternating directions. It appears exactly once, on the
//   beat whose argument is QUANTITY, because a firehose used twice is wallpaper.
//
//   THE BOX PATTERN — a hairline grid plate under a bordered box. Chapters get
//   it full-width (`ChapterBox`), highlights get it inline and small
//   (`HighlightBox`), and every station is numbered with a `BoxTag` so the film
//   has a table of contents you can feel.
//
// THE FILM BREATHES IN VALUE, per act: saturated field → white canvas → the
// cool canvas-soft of the security act → white canvas → saturated field again.
// Each station paints its own act, so the value change arrives WITH the travel
// instead of as a cut.
//
// EVERY NUMBER ON SCREEN IS REAL AND SOURCED (docs.stripe.com/webhooks,
// docs.github.com webhooks best practices, shopify.dev, docs.slack.dev):
// Stripe-Signature is `t=<unix>,v1=<hex>` and v1 is the only valid live scheme;
// the signed payload is `${t}.${raw_body}`; HMAC-SHA256 keyed by whsec_…;
// library default tolerance 5 minutes; compare in constant time; retries run
// with exponential backoff for up to 3 days in live mode; Slack wants 2xx in
// 3s, Shopify times out at 5s with a 1s connect budget and retries 8 times over
// 4 hours, GitHub wants 2xx in 10s. Delivery is at-least-once and ordering is
// explicitly not guaranteed — both stated by the vendor, both on screen.

import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { MarqueeZoom, type Agent } from "../lib/agents";
import { Cue } from "../lib/sound";
import { Thread } from "../lib/motifs";
import { snapUp } from "../lib/tempo";
import { buildPalette, alpha } from "../theme";
import { SANS, MONO, SERIF } from "../fonts";
import { useK, useAppearAt, useLoop, stagger, lerp, clamp01 } from "../lib/anim";
import {
  BloomField,
  BLOOM_INDIGO,
  BLOOM_CREAM,
  BLOOM_RUBY,
} from "../lib/gradient";
import {
  HeroCard,
  BigFigure,
  TickMeter,
  BarRows,
  Marquee3D,
  EventCard,
  ChapterBox,
  HighlightBox,
  ProductPanel,
  Terminal,
  ShimmerText,
  RouteRow,
  MetaRow,
  FeedRow,
  GridPlate,
  Pill,
  DARK,
  R,
  SHADOW,
  display,
  tabular,
  microCap,
  useCount,
} from "../lib/cards";
import cfg from "../../episode.config.json";
import durs from "../../vo-durations.json";

export const EP15_FPS = 30;
export const PAL15 = buildPalette("stripe-mesh");

const F = (n: number) => Math.round(n * EP15_FPS);

/** The three voices on this film. Indigo is ours, teal is theirs, red fails. */
// Every panel in this film is this black. Not a tone per component, not a
// coloured edge to tell them apart — the CONTENT tells them apart, and a wall
// of near-identical dark windows over a bright field is what makes the frame
// look like software instead of like a slide deck.
const PANEL = "#0B0E14";
const ON = "#FFFFFF";
const ON_MID = "rgba(255,255,255,0.72)";
const ON_DIM = "rgba(255,255,255,0.45)";

const SENDER = "#22B8CF";
const BAD = "#C0123C";
const OK = "#0F9D58";

/* ── the schedule ────────────────────────────────────────────────────────────
 *
 * Scene seconds = VO + 0.35s breath, snapped UP to the 84bpm grid. The VO is
 * RECORDED — `vo-durations.json` holds measured lengths, and every cut, every
 * camera key and every cue below re-timed itself off them when it landed. The
 * read came in 11s longer than the `estimate-vo.mjs` fit it replaced, which is
 * the whole reason the file is the source of truth and nothing here is a
 * hand-guessed number.
 * ─────────────────────────────────────────────────────────────────────────── */

const BREATH = 0.35;

type BeatDef = { id: string; vo?: number; hold?: number };

const DEFS: BeatDef[] = [
  { id: "open", vo: 1 }, // what polling costs
  { id: "title", hold: 4.6 }, // ── silent: the bed lifts
  { id: "mech", vo: 2 }, // the whole mechanism in one picture
  { id: "delivery", vo: 3 }, // it is an ordinary POST
  { id: "types", vo: 4 }, // the firehose            ← 3D MARQUEE
  { id: "public", vo: 5 }, // the URL is public
  { id: "verify", vo: 6 }, // the signature           ← MARQUEE ZOOM
  { id: "raw", vo: 7 }, // the raw-body trap
  { id: "clock", vo: 8 }, // tolerance and replay
  { id: "ack", vo: 9 }, // return 2xx first
  { id: "dupes", vo: 10 }, // at-least-once          ← MARQUEE ZOOM
  { id: "order", vo: 11 }, // no ordering guarantee
  { id: "retry", vo: 12 }, // the retry ladder
  { id: "sweep", vo: 13 }, // keep the sweep
  { id: "end", hold: 8.2 }, // ── silent: the bed lifts again
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

export const EP15_SECONDS = START[START.length - 1] + LEN[LEN.length - 1];
export const EP15_DURATION = Math.round(EP15_SECONDS * EP15_FPS);

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
 * The stations are laid out on a SERPENTINE, not a column: four across, then
 * down and four back, then down and four across again. It is the shape of a
 * page of reading, and it buys the film the thing a single vertical strip could
 * not — arrivals that are not all the same move.
 *
 * Twelve legs, and only two kinds, which is the transition budget the house
 * style asks for:
 *
 *   ACROSS (nine of them) — 0.9s, flat, quick. The default. The next station is
 *   already sliding in from the edge as the last one leaves, so the cut is not a
 *   cut and the motion carries straight through it.
 *
 *   DOWN (three of them) — 1.4s, and the camera LIFTS as it goes: it pulls back
 *   to 0.84 at the midpoint and settles back to 1. That reads as stepping up and
 *   over rather than sliding, and it is reserved for the three act breaks,
 *   because a move that means "new section" spent on an ordinary beat is a move
 *   that will not mean anything when the section actually changes.
 *
 * The rows ARE the acts:
 *   row 0 — the mechanism      mech · delivery · types · public
 *   row 1 — trust              verify · raw · clock · ack        (travelling back)
 *   row 2 — delivery semantics dupes · order · retry · sweep
 *   row 3 — the sign-off       end
 * ─────────────────────────────────────────────────────────────────────────── */

const G = 100; // one cell = one frame, in %

const ROUTE: Record<string, [number, number]> = {
  mech: [0, 0], delivery: [1, 0], types: [2, 0], public: [3, 0],
  verify: [3, 1], raw: [2, 1], clock: [1, 1], ack: [0, 1],
  dupes: [0, 2], order: [1, 2], retry: [2, 2], sweep: [3, 2],
  end: [3, 3],
};

const cellOf = (id: string) => ROUTE[id] ?? [0, 0];
/** True when arriving at `id` means changing act — the three lift moves. */
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

/** The two cursors. Both are mid-gesture whenever they are on screen. */
const AUDITOR: Agent = { name: "auditor", color: PAL15.accent };
const OPERATOR: Agent = { name: "operator", color: SENDER };

/* ── the film ────────────────────────────────────────────────────────────── */

export const Ep15: React.FC = () => (
  <AbsoluteFill style={{ background: PAL15.bg, fontFeatureSettings: '"ss01"' }}>
    <Sequence from={0} durationInFrames={F(len("open"))} name="1 · what polling costs">
      <ColdOpen />
    </Sequence>

    <Sequence from={F(at("title"))} durationInFrames={F(len("title"))} name="2 · title">
      <TitleCard />
    </Sequence>

    <Sequence
      from={F(STRIP_T0)}
      durationInFrames={EP15_DURATION - F(STRIP_T0)}
      name="3–15 · the strip"
    >
      <Strip />
    </Sequence>

    <Thread pal={PAL15} from={STRIP_T0} to={endOf("sweep")} />
    <EventTrail />

    <Track />
  </AbsoluteFill>
);

/* ── beat 1 — what polling costs ─────────────────────────────────────────── */

/**
 * The reference clip's framing, used as an argument rather than as a look: ONE
 * card, centred, on the full-bleed field, with the only motion inside it.
 *
 * The figure is the beat. 5,760 requests a day at one every fifteen seconds,
 * counting up while a single indigo tick — the one poll that actually returned
 * something — sits in a wall of grey ones. The card does not drift and the
 * field does not cut; the number arriving IS the event.
 */
const ColdOpen: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
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
        <HeroCard pal={PAL15} title="GET /v1/payment_intents/pi_3QxL — polling" w={720} at={10} pips={[4, 0]}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 18 * k }}>
            {/* the count runs almost the whole beat rather than resolving in
                under two seconds and leaving the card frozen */}
            <BigFigure value={5760} at={26} dur={F(4.4)} size={124} />
            <span
              style={{
                ...microCap(19 * k),
                color: "rgba(255,255,255,0.55)",
                paddingBottom: 22 * k,
              }}
            >
              requests / day
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
              maxWidth: 520 * k,
            }}
          >
            One every fifteen seconds, around the clock, to be told one thing once.
          </div>
          <div style={{ marginTop: 30 * k }}>
            <PollWall />
          </div>
        </HeroCard>
      </AbsoluteFill>
      {void frame}
    </AbsoluteFill>
  );
};

/**
 * 96 polls. One of them mattered.
 *
 * It never stops filling — it wraps and starts again, because that is what
 * polling does and because a wall that finishes leaves the beat with nothing to
 * do for its last four seconds. The hit lands at the same index every pass, so
 * the eye finds the single indigo tick and then watches the grey ones keep
 * arriving around it.
 */
const PollWall: React.FC = () => {
  const k = useK();
  const fill = useLoop(F(5.2));
  const shown = fill * 96;
  const HIT = 61;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 * k, width: 560 * k }}>
      {Array.from({ length: 96 }).map((_, i) => {
        const on = i < shown;
        const hit = i === HIT && on;
        // the tick currently landing, so the wall reads as arriving rather than
        // as a bar that got wider
        const head = on && shown - i < 2.2;
        return (
          <span
            key={i}
            style={{
              width: 12 * k,
              height: 12 * k,
              borderRadius: 3 * k,
              background: hit
                ? PAL15.accent
                : head
                  ? "rgba(255,255,255,0.7)"
                  : on
                    ? "rgba(255,255,255,0.22)"
                    : "rgba(255,255,255,0.05)",
              boxShadow: hit ? `0 0 ${14 * k}px ${PAL15.accent}` : undefined,
            }}
          />
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
          {cfg.series} · {cfg.episode} · Webhooks
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
            {"We'll Call"}
          </ShimmerText>
          <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, marginLeft: "0.3em" }}>
            You.
          </span>
        </div>
        <div
          style={{
            height: 2 * k,
            width: interpolate(frame, [F(1.0), F(2.6)], [0, 520 * k], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.25, 0, 0.15, 1),
            }),
            background: "rgba(255,255,255,0.85)",
            marginTop: 40 * k,
          }}
        />
        <div
          style={{
            ...tabular(26 * k),
            color: "rgba(255,255,255,0.86)",
            marginTop: 36 * k,
            opacity: fade(1.9, 2.5),
            textAlign: "center",
          }}
        >
          POST /webhooks · Stripe-Signature: t=…,v1=… · 200 OK
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * A soft dark pool under white type laid straight on the field.
 *
 * The gg field runs from pure white to near-black across one diagonal, so any
 * fixed text colour is unreadable somewhere on it. A vignette is the cheap fix
 * and it is also the honest one — the alternative is choosing a text colour
 * that survives both ends, which means choosing grey.
 */
const Scrim: React.FC<{ strength?: number }> = ({ strength = 0.34 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(74% 62% at 50% 50%, rgba(28,4,20,${strength}) 0%, rgba(28,4,20,${
        strength * 0.55
      }) 46%, rgba(28,4,20,0) 78%)`,
      pointerEvents: "none",
    }}
  />
);

/* ── the continuity layer ────────────────────────────────────────────────────
 *
 * ONE EVENT, followed for the whole film.
 *
 * Thirteen self-contained stations teach thirteen things and land none of them:
 * each beat resets, the viewer re-orients, and the argument stops being visible
 * somewhere around beat five even though every screen is fine. The fix is an
 * element that survives the cuts, rendered OUTSIDE `Strip` so no travel and no
 * marquee zoom can touch it.
 *
 * The protagonist here picks itself. `evt_1PxKq2Gd8Lm3Nq` is already on screen
 * in the delivery beat and again in the dedupe ledger — so instead of inventing
 * a dot, the film follows THAT event from the moment their side creates it to
 * the moment the sweep reconciles it. Every state below is something the
 * episode actually just said, which is the difference between a continuity
 * device and a decoration that happens to persist.
 *
 * States are held, never interpolated: the chip changes when the argument
 * changes, and holds through beats that do not move the story on.
 * ─────────────────────────────────────────────────────────────────────────── */

type TrailState = "waiting" | "live" | "risk" | "safe" | "done";

const TRAIL: { at: number; label: string; state: TrailState }[] = [
  { at: at("mech"), label: "created on their side", state: "waiting" },
  { at: at("delivery"), label: "in flight", state: "live" },
  { at: at("types"), label: "subscribed · you asked for this one", state: "live" },
  { at: at("public"), label: "unverified — anyone could have sent it", state: "risk" },
  { at: at("verify") + 4.6, label: "signature v1 matches", state: "safe" },
  { at: at("raw") + 4.6, label: "raw bytes intact", state: "safe" },
  { at: at("clock") + 5.6, label: "226s old — inside tolerance", state: "safe" },
  { at: at("ack") + 2.4, label: "queued · answered 200", state: "safe" },
  { at: at("dupes") + 3.0, label: "delivered twice — second one skipped", state: "risk" },
  { at: at("order") + 2.6, label: "arrived third, not first", state: "risk" },
  { at: at("retry") + 1.6, label: "attempt 3 of the backoff", state: "live" },
  { at: at("sweep") + 4.6, label: "reconciled by the sweep", state: "done" },
];

const TRAIL_COLOR: Record<TrailState, string> = {
  waiting: PAL15.textMuted,
  live: SENDER,
  risk: BAD,
  safe: OK,
  done: PAL15.accent,
};

const EventTrail: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const t = frame / EP15_FPS;
  if (t < STRIP_T0 - 0.4 || t > endOf("sweep") + 0.6) return null;

  let cur = TRAIL[0];
  let idx = 0;
  TRAIL.forEach((s, i) => {
    if (t >= s.at) { cur = s; idx = i; }
  });
  const tone = TRAIL_COLOR[cur.state];
  // Only the STATE slides. The id never moves, because the whole point is that
  // it is the same event — an element that re-animates wholesale every beat is
  // thirteen elements again.
  const since = clamp01((t - cur.at) / 0.42);
  const inOut = clamp01((t - (STRIP_T0 - 0.4)) / 0.6) * clamp01((endOf("sweep") + 0.6 - t) / 0.6);

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
        border: `1px solid rgba(255,255,255,0.12)`,
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
      <span style={{ ...tabular(19 * k), color: ON }}>evt_1PxKq2</span>
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

/* ── beats 3–15 — the strip ──────────────────────────────────────────────── */

const Strip: React.FC = () => {
  const frame = useCurrentFrame();
  const abs = STRIP_T0 + frame / EP15_FPS;

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
        <Station id="mech" bg="band"><Mechanism /></Station>
        <Station id="delivery" bg="canvas"><Delivery /></Station>
        <Station id="types" bg="soft"><Firehose /></Station>
        <Station id="public" bg="dark"><PublicUrl /></Station>
        <Station id="verify" bg="soft"><Verify /></Station>
        <Station id="raw" bg="soft"><RawBody /></Station>
        <Station id="clock" bg="dark"><Tolerance /></Station>
        <Station id="ack" bg="canvas"><Acknowledge /></Station>
        <Station id="dupes" bg="canvas"><Duplicates /></Station>
        <Station id="order" bg="soft"><Ordering /></Station>
        <Station id="retry" bg="canvas"><Retries /></Station>
        <Station id="sweep" bg="band"><Sweep /></Station>
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
 *
 * The background is rendered OUTSIDE that inner Sequence and driven by absolute
 * time, so the ribbon field's wave clock is continuous across the whole film
 * rather than restarting at every station.
 */
const Station: React.FC<{ id: string; bg: BgKind; children: React.ReactNode }> = ({
  id,
  bg,
  children,
}) => {
  const frame = useCurrentFrame();
  const abs = STRIP_T0 + frame / EP15_FPS;
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
      {/* `position: relative` here is LOAD-BEARING, and the bug it fixes is
          invisible in code review. `ActBg` is an AbsoluteFill — a POSITIONED
          sibling — and CSS paints positioned descendants above non-positioned
          in-flow ones regardless of DOM order. Without this wrapper, every
          element on a station that happened NOT to carry an `opacity < 1`, a
          `transform` or a `translate` (each of which quietly makes its own
          stacking context) painted UNDERNEATH the background and vanished.
          It took out half of four beats and left the other half looking fine,
          which is exactly why it survived to a render. */}
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
 * The act's dominant field brightness. Five values across the film, and the
 * travel is what carries you between them — nothing reads as premium when every
 * beat is the same brightness, and this is the cheapest luxury in the kit.
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
        <BloomField
          stops={BLOOM_RUBY}
          origin="top-right"
          second={BLOOM_INDIGO}
          secondOrigin="bottom-left"
          secondOpacity={0.5}
          size={130}
          grain={58}
          opacity={0.62}
          atSeconds={atSeconds}
        />
        <GridPlate pal={PAL15} tone="dark" pitch={72} opacity={0.8} />
      </AbsoluteFill>
    );
  if (kind === "band")
    return (
      <AbsoluteFill style={{ background: PAL15.bg }}>
        <div style={{
          position: "absolute", left: 0, right: 0, top: 0, height: "52%", overflow: "hidden",
          maskImage: "linear-gradient(to bottom, #000 52%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, #000 52%, transparent 100%)",
        }}>
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
      <AbsoluteFill style={{ background: PAL15.bgDeep }}>
        <GridPlate pal={PAL15} pitch={72} opacity={0.85} />
      </AbsoluteFill>
    );
  return <AbsoluteFill style={{ background: PAL15.bg }} />;
};

/* ── icons ──────────────────────────────────────────────────────────────────
 *
 * A labelled rectangle is a rectangle. The same rectangle with a globe in it is
 * THE INTERNET, and the viewer knows that before reading a word. One weight,
 * one radius, one size, so they read as a family rather than as clip art.
 * ─────────────────────────────────────────────────────────────────────────── */

type IcoName =
  | "globe" | "server" | "bolt" | "lock" | "key" | "clock" | "queue" | "check"
  | "cross" | "cycle" | "list" | "file" | "shield" | "hash" | "bell" | "db"
  | "card" | "person" | "mask" | "sweep" | "braces" | "arrow" | "sand";

const Ico: React.FC<{ name: IcoName; size: number; color: string }> = ({ name, size, color }) => {
  const P: Record<IcoName, React.ReactNode> = {
    globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 3 2.5 15 0 18-2.5-3-2.5-15 0-18Z" /></>,
    server: <><rect x="3" y="4" width="18" height="7" rx="2" /><rect x="3" y="13" width="18" height="7" rx="2" /><path d="M7 7.5h.01M7 16.5h.01" /></>,
    bolt: <path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12z" />,
    lock: <><rect x="4.5" y="10.5" width="15" height="10" rx="2" /><path d="M8 10.5V7.6a4 4 0 0 1 8 0v2.9" /></>,
    key: <><circle cx="8" cy="12" r="4.2" /><path d="M12.2 12H21M18 12v3.4M15 12v2.4" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 6.6V12l3.6 2.2" /></>,
    queue: <><rect x="3" y="5" width="18" height="4" rx="1.4" /><rect x="3" y="11" width="13" height="4" rx="1.4" /><rect x="3" y="17" width="8" height="4" rx="1.4" /></>,
    check: <path d="M4.5 12.6 9.5 17.6 19.5 6.6" />,
    cross: <path d="M6 6l12 12M18 6 6 18" />,
    cycle: <><path d="M20.5 12a8.5 8.5 0 1 1-2.9-6.4" /><path d="M20.8 3.6v4.8h-4.8" /></>,
    list: <><path d="M4 6h16M4 12h16M4 18h10" /></>,
    file: <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4M9 12h6M9 16h4" /></>,
    shield: <path d="M12 3l8 3v6c0 5-3.4 8.2-8 9-4.6-.8-8-4-8-9V6l8-3Z" />,
    hash: <path d="M5 9h14M5 15h14M9.5 4l-1.6 16M16 4l-1.6 16" />,
    bell: <><path d="M6 9a6 6 0 0 1 12 0c0 5 1.6 6.4 1.6 6.4H4.4S6 14 6 9Z" /><path d="M10 19a2 2 0 0 0 4 0" /></>,
    db: <><ellipse cx="12" cy="6" rx="8" ry="3.2" /><path d="M4 6v12c0 1.8 3.6 3.2 8 3.2s8-1.4 8-3.2V6" /><path d="M4 12c0 1.8 3.6 3.2 8 3.2s8-1.4 8-3.2" /></>,
    card: <><rect x="2.5" y="5" width="19" height="14" rx="2.4" /><path d="M2.5 10h19M6 15h4" /></>,
    person: <><circle cx="12" cy="8" r="3.4" /><path d="M5 20c1.2-3.6 4-5.4 7-5.4s5.8 1.8 7 5.4" /></>,
    mask: <><path d="M3 8.5c3-1.6 5-1.6 9 0s6 1.6 9 0v4c0 4.4-4 8.5-9 8.5S3 16.9 3 12.5z" /><path d="M8.5 12.5h.01M15.5 12.5h.01" /></>,
    sweep: <><path d="M4 20 14 10" /><path d="m12.5 5.5 6 6-3.5 3.5-6-6z" /><path d="M4 20l4.5-1.5" /></>,
    braces: <><path d="M9 3c-2 0-2.6 1-2.6 3v2c0 2-.8 3-2.4 3 1.6 0 2.4 1 2.4 3v2c0 2 .6 3 2.6 3" /><path d="M15 3c2 0 2.6 1 2.6 3v2c0 2 .8 3 2.4 3-1.6 0-2.4 1-2.4 3v2c0 2-.6 3-2.6 3" /></>,
    arrow: <path d="M4 12h15m-5.5-5.5L19.5 12l-6 5.5" />,
    sand: <><path d="M7 3h10M7 21h10" /><path d="M7 3c0 5 5 6.4 5 9s-5 4-5 9M17 3c0 5-5 6.4-5 9s5 4 5 9" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.7}
      strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flexShrink: 0 }}>
      {P[name]}
    </svg>
  );
};

/* ── the box pattern, as the station header ─────────────────────────────── */

/**
 * The chapter mark. The number lives in a filled indigo box and the label sits
 * beside it — the same box that `ChapterBox` sets large, shrunk to a header.
 * Doing it on EVERY station is what turns thirteen screens into a document with
 * sections, which is the thing twelve self-contained slides can never be.
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
        gap: 0,
        marginBottom: 40 * k,
        opacity: p,
        translate: `0 ${lerp(-8, 0, p) * k}px`,
      }}
    >
      <span
        style={{
          background: PAL15.accent,
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
          border: `1px solid ${dark ? "rgba(255,255,255,0.22)" : PAL15.border}`,
          borderLeft: "none",
          borderRadius: `0 ${R.md * k}px ${R.md * k}px 0`,
          padding: `${9 * k}px ${20 * k}px`,
          ...microCap(19 * k),
          color: dark ? "rgba(255,255,255,0.72)" : PAL15.textMuted,
          display: "flex",
          alignItems: "center",
          background: dark ? "transparent" : `${PAL15.bg}CC`,
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
        color: tone === "dark" ? "rgba(255,255,255,0.7)" : PAL15.textMuted,
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
  title: string; sub?: string; icon?: IcoName; tone?: string; at: number;
  dark?: boolean; fill?: string;
}> = ({ x, y, w, h, title, sub, icon, tone = PAL15.borderMid, at: a, dark = false, fill }) => {
  const k = useK();
  const p = useAppearAt(a, 180);
  return (
    <div style={{
      position: "absolute", left: x * k, top: y * k, width: w * k, height: h * k,
      borderRadius: R.lg * k,
      background: fill ?? PANEL,
      border: `1px solid rgba(255,255,255,0.10)`,
      boxShadow: SHADOW[3],
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: 8 * k, opacity: p, transform: `scale(${lerp(0.94, 1, p)})`,
    }}>
      {icon && <Ico name={icon} size={30 * k} color={tone} />}
      <div style={{ ...display(28 * k, -0.02), fontWeight: 400, color: ON }}>
        {title}
      </div>
      {sub && (
        <div style={{ ...tabular(19 * k), color: ON_DIM }}>
          {sub}
        </div>
      )}
    </div>
  );
};

/** A labelled connector, drawn on, with a packet running it once drawn. */
const Link: React.FC<{
  pts: [number, number][]; label?: string; at: number; dur?: number;
  tone?: string; flow?: boolean; labelAt?: [number, number]; h?: number; speed?: number;
  dashed?: boolean; bg?: string;
}> = ({
  pts, label, at: a, dur = 24, tone = PAL15.borderMid, flow = true, labelAt,
  h = 880, speed = 70, dashed = false, bg,
}) => {
  const k = useK();
  const frame = useCurrentFrame();
  const p = clamp01((frame - a) / dur);
  // Hoisted deliberately: a hook called inside the `p > 0.99` branch would make
  // the hook count change the frame a line finishes drawing, which is React
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
      <svg style={{ position: "absolute", left: 0, top: 0, width: CW * k, height: h * k, overflow: "visible", pointerEvents: "none" }}
        viewBox={`0 0 ${CW} ${h}`}>
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
        {p > 0.98 && <polygon points="0,-6 12,0 0,6" fill={tone} transform={`translate(${end[0]},${end[1]}) rotate(${ang})`} />}
        {p > 0.99 && flow && <circle cx={pos[0]} cy={pos[1]} r={6} fill={tone} opacity={0.9} />}
      </svg>
      {label && p > 0.4 && (
        <div style={{
          position: "absolute", left: lx * k, top: ly * k, translate: "-50% -50%",
          ...tabular(21 * k), color: bg ? "#FFFFFF" : PAL15.textBody,
          background: bg ?? PAL15.bg, padding: `${3 * k}px ${10 * k}px`, borderRadius: 5 * k,
          opacity: clamp01((p - 0.4) / 0.4), whiteSpace: "nowrap",
        }}>{label}</div>
      )}
    </>
  );
};

/**
 * A small black panel with a glyph and a label. `on` lights it, for a selection
 * that travels a row.
 *
 * It is black on the light stations too, deliberately. A translucent chip on
 * white canvas has no presence, and a chip with a coloured left border is the
 * exact object this pass exists to delete — the icon carries the colour, the
 * container never does.
 */
const Chip: React.FC<{
  label: string; sub?: string; icon: IcoName; tone: string; at: number; dark?: boolean;
  on?: boolean;
}> = ({ label, sub, icon, tone, at: a, dark = false, on = false }) => {
  const k = useK();
  const p = useAppearAt(a, 200);
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12 * k,
      background: PANEL,
      border: `1px solid rgba(255,255,255,${on ? 0.26 : 0.1})`,
      borderRadius: R.md * k,
      padding: `${12 * k}px ${18 * k}px`, boxShadow: dark ? undefined : SHADOW[3],
      opacity: p, translate: `0 ${lerp(10, 0, p) * k}px`,
      scale: `${on ? 1.03 : 1}`,
    }}>
      <Ico name={icon} size={24 * k} color={tone} />
      <span style={{ ...tabular(23 * k), color: ON }}>{label}</span>
      {sub && (
        <span style={{ fontFamily: SANS, fontWeight: 300, fontSize: 21 * k, color: ON_DIM }}>
          {sub}
        </span>
      )}
    </div>
  );
};

/* ── beat 3 — the whole mechanism ────────────────────────────────────────────
 *
 * The signature graphic and the whole episode in one picture: the polling arrow
 * you just paid for, struck out, and the single POST that replaces it. Every
 * beat after this is a detail lifted out of this diagram.
 * ─────────────────────────────────────────────────────────────────────────── */

const MH = 640;
// Two REAL panels, sized rather than content-hugged, so the connectors between
// them land on an edge that is not going to move when a string gets longer.
const YOU = { x: 70, y: 130, w: 520, h: 300 };
const THEM = { x: 1170, y: 130, w: 520, h: 300 };
const cxOf = (b: { x: number; w: number }) => b.x + b.w / 2;
const cyOf = (b: { y: number; h: number }) => b.y + b.h / 2;

const Mechanism: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const struck = useAppearAt(F(3.4), 200);
  const beatT = useLoop(F(2.4));
  const fire = Math.floor(beatT * FIRING.length);
  const pulse = (beatT * FIRING.length) % 1;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <BoxTag n="01">THE WHOLE MECHANISM</BoxTag>
      <Canvas h={MH}>
        {/* Your side: an actual route table, with the one route that matters
            lighting when a delivery lands on it. */}
        <div style={{ position: "absolute", left: YOU.x * k, top: YOU.y * k }}>
          <ProductPanel
            pal={PAL15}
            w={YOU.w}
            h={YOU.h}
            chrome="api.yourapp.com"
            chromeRight="routes"
            at={16}
          >
            <RouteRow pal={PAL15} method="POST" path="/webhooks" status={pulse > 0.72 ? "200" : "—"} at={26} live={pulse > 0.72} />
            <RouteRow pal={PAL15} method="GET" path="/orders/:id" status="200" at={34} hue={PAL15.textMuted} />
            <RouteRow pal={PAL15} method="GET" path="/health" status="200" at={42} hue={PAL15.textMuted} />
            <MetaRow pal={PAL15} label="verified" value="whsec_…4b1c" at={50} mutedValue />
            <MetaRow pal={PAL15} label="queue depth" value={`${Math.round(1 + pulse * 3)}`} at={58} />
          </ProductPanel>
        </div>

        {/* Their side: a live event feed. It keeps producing whether or not you
            are listening, which is the entire premise of the episode. */}
        <div style={{ position: "absolute", left: THEM.x * k, top: THEM.y * k }}>
          <ProductPanel
            pal={PAL15}
            w={THEM.w}
            h={THEM.h}
            chrome="their platform · events"
            chromeRight="live"
            accent={SENDER}
            at={30}
          >
            {FIRING.map((t, i) => (
              <FeedRow
                key={t}
                pal={PAL15}
                type={t}
                when={["just now", "0:04 ago", "0:11 ago"][i]}
                hue={SENDER}
                at={40 + stagger(i, 9)}
                live={i === fire}
              />
            ))}
            <MetaRow pal={PAL15} label="destination" value="api.yourapp.com/webhooks" at={70} mutedValue />
            <MetaRow pal={PAL15} label="delivery" value="at-least-once" at={78} hue={SENDER} />
          </ProductPanel>
        </div>

        {/* the way you were doing it */}
        <Link
          h={MH} at={44} dur={20} tone={PAL15.textMuted} flow={false} dashed
          pts={[[YOU.x + YOU.w, cyOf(YOU) - 74], [THEM.x, cyOf(THEM) - 74]]}
          label="GET … anything yet?" labelAt={[880, 176]}
        />
        <div style={{
          position: "absolute", left: 880 * k, top: 248 * k, translate: "-50% -50%",
          opacity: struck,
        }}>
          <Ico name="cross" size={34 * k} color={BAD} />
        </div>

        {/* the way it works */}
        <Link
          h={MH} at={F(2.4)} dur={26} tone={SENDER} speed={62}
          pts={[[THEM.x, cyOf(THEM) + 66], [YOU.x + YOU.w, cyOf(YOU) + 66]]}
          label="POST /webhooks" labelAt={[880, 392]} bg={SENDER}
        />

        <div style={{
          position: "absolute", left: 620 * k, top: 496 * k, width: 520 * k,
          textAlign: "center", opacity: useAppearAt(F(4.6), 200),
        }}>
          <span style={{ ...display(30 * k, -0.02), color: PAL15.ink, lineHeight: 1.35 }}>
            You gave them the URL.
            <br />
            They decide when to use it.
          </span>
        </div>
      </Canvas>
      {void frame}
    </div>
  );
};

/** What their side keeps doing while you are reading the diagram. */
const FIRING = ["charge.succeeded", "invoice.paid", "charge.refunded"];

/* ── beat 4 — the delivery itself ────────────────────────────────────────── */

const Delivery: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  // ONE selection travelling the delivery, over and over: the signature header,
  // then the id, then the type — and the chip that names each one lights with
  // it. Without this the beat is two code blocks that finished typing, which
  // measured 0.61 energy and read as a slide.
  // Hoisted, not inlined into the ternary below: a hook inside a conditional
  // changes the hook count the frame the condition flips, which is React error
  // #310 and a hard render failure rather than a visual bug.
  const cyc = useLoop(F(3.6));
  const step = frame > F(3.0) ? Math.floor(cyc * 3) : -1;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <BoxTag n="02">IT IS AN ORDINARY POST</BoxTag>
      {/* ONE window, typed. Two side-by-side code cards were two blocks of
          monospace that had already finished; a terminal filling itself is the
          same information arriving across the whole beat, and the caret gives
          the frame something alive without a single decorative element. */}
      <Terminal
        pal={PAL15}
        w={1500}
        h={520}
        title="tail -f  ·  incoming delivery"
        start={F(0.5)}
        cps={72}
        at={12}
        size={25}
        accent={SENDER}
        lines={[
          { prompt: "$ ", text: "curl -i -X POST https://api.yourapp.com/webhooks" },
          { text: "POST /webhooks HTTP/1.1", out: true },
          { text: "Host: api.yourapp.com", out: true },
          { text: "Content-Type: application/json", out: true },
          { text: "Stripe-Signature: t=1748291105,v1=5257a869…", out: true, hot: "Stripe-Signature" },
          { text: "", out: true },
          { text: "{", out: true },
          { text: '  "id":      "evt_1PxKq2Gd8Lm3Nq",', out: true, hot: '"evt_1PxKq2Gd8Lm3Nq"' },
          { text: '  "type":    "payment_intent.succeeded",', out: true, hot: '"payment_intent.succeeded"' },
          { text: '  "created": 1748291105,', out: true },
          { text: '  "data":    { "object": { … } }', out: true },
          { text: "}", out: true },
        ]}
      />
      <div style={{ display: "flex", gap: 16 * k, marginTop: 34 * k }}>
        <Chip label="id" sub="dedupe on this" icon="hash" tone={PAL15.accent} at={F(5.4)} on={step === 0} />
        <Chip label="type" sub="route on this" icon="arrow" tone={PAL15.accent} at={F(5.4) + stagger(1, 9)} on={step === 1} />
        <Chip label="signature" sub="trust on this" icon="lock" tone={SENDER} at={F(5.4) + stagger(2, 9)} on={step === 2} />
      </div>
    </div>
  );
};

/* ── beat 5 — the firehose  ← 3D MARQUEE ─────────────────────────────────── */

const EVENT_TYPES = [
  "payment_intent.succeeded", "charge.refunded", "invoice.paid",
  "customer.subscription.created", "checkout.session.completed",
  "payment_method.attached", "invoice.payment_failed", "customer.updated",
  "charge.dispute.created", "payout.paid", "invoice.finalized",
  "customer.subscription.deleted", "charge.succeeded", "setup_intent.succeeded",
  "invoice.upcoming", "balance.available",
];

/** The four you actually handle. Everything else in the wall is dimmed. */
const HANDLED = new Set([
  "payment_intent.succeeded",
  "invoice.paid",
  "charge.dispute.created",
  "customer.subscription.deleted",
]);

const column = (offsetIdx: number) =>
  EVENT_TYPES.map((t, i) => {
    const n = (offsetIdx + i) % EVENT_TYPES.length;
    const type = EVENT_TYPES[n];
    return (
      <EventCard
        key={`${offsetIdx}-${i}`}
        pal={PAL15}
        type={type}
        id={`evt_1P${((offsetIdx + 1) * 977 + i * 131).toString(36).toUpperCase().padStart(6, "0")}`}
        note={HANDLED.has(type) ? "subscribed" : "not subscribed"}
        hue={HANDLED.has(type) ? PAL15.accent : PAL15.textMuted}
        dim={!HANDLED.has(type)}
      />
    );
  });

const Firehose: React.FC = () => (
  <AbsoluteFill>
    <Marquee3D
      pal={PAL15}
      fadeTo={PAL15.bgDeep}
      itemHeight={116}
      colWidth={360}
      colGap={28}
      gap={22}
      at={0}
      columns={[
        { items: column(0), duration: 27 },
        { items: column(5), reverse: true, duration: 31 },
        { items: column(9), duration: 24 },
        { items: column(13), reverse: true, duration: 34 },
      ]}
    />
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <ChapterBox
        pal={PAL15}
        n="03"
        title="Subscribe to what you handle"
        sub="Listening to everything is not thoroughness. It is load you agreed to carry, on every host, forever."
        at={F(1.6)}
        w={1240}
      />
    </AbsoluteFill>
  </AbsoluteFill>
);

/* ── beat 6 — the URL is public ──────────────────────────────────────────── */

const PublicUrl: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const SENDERS = [
    { who: "their platform", icon: "globe" as IcoName, ok: true, note: "signed" },
    { who: "anyone with the URL", icon: "person" as IcoName, ok: false, note: "unsigned" },
    { who: "someone replaying yesterday", icon: "mask" as IcoName, ok: false, note: "stale" },
  ];
  const cyc = useLoop(F(2.7));
  const hitter = Math.floor(cyc * 3);
  const within = (cyc * 3) % 1;
  // a short strike, not a slow throb — the endpoint is being HIT
  const hitGlow = clamp01(1 - Math.abs(within - 0.55) * 5);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <BoxTag n="04" tone="dark">THE URL IS PUBLIC</BoxTag>
      {/* The endpoint keeps taking hits, from all three, forever — which is the
          argument. A static URL under three labelled cards states the problem;
          a URL being struck by requests it cannot tell apart demonstrates it. */}
      <div style={{ position: "relative", opacity: useAppearAt(10, 200) }}>
        <div style={{
          ...tabular(38 * k), color: "#FFFFFF",
          background: `rgba(255,255,255,${0.07 + 0.1 * hitGlow})`,
          border: `1px solid rgba(255,255,255,${0.18 + 0.3 * hitGlow})`, borderRadius: R.pill,
          padding: `${16 * k}px ${34 * k}px`,
          boxShadow: hitGlow > 0.05 ? `0 0 ${40 * hitGlow * k}px rgba(255,255,255,${0.3 * hitGlow})` : undefined,
        }}>
          https://api.yourapp.com/webhooks
        </div>
        <span style={{
          position: "absolute", right: -110 * k, top: "50%", translate: "0 -50%",
          ...tabular(24 * k), color: OK, opacity: hitGlow,
        }}>
          200
        </span>
      </div>
      <div style={{ display: "flex", gap: 26 * k, marginTop: 56 * k }}>
        {SENDERS.map((s, i) => (
          <SenderCard key={s.who} {...s} at={F(2.0) + stagger(i, 14)} live={hitter === i} />
        ))}
      </div>
      <Note at={F(5.0)} tone="dark">
        HTTPS proves the pipe. It says nothing about who is at the other end of it.
      </Note>
      {void frame}
    </div>
  );
};

const SenderCard: React.FC<{
  who: string; icon: IcoName; ok: boolean; note: string; at: number; live?: boolean;
}> = ({ who, icon, ok, note, at: a, live = false }) => {
  const k = useK();
  const p = useAppearAt(a, 190);
  const tone = ok ? OK : BAD;
  return (
    <div style={{
      width: 470 * k, padding: `${28 * k}px`, borderRadius: R.lg * k,
      background: live ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.05)",
      border: `1px solid rgba(255,255,255,${live ? 0.34 : 0.14})`, opacity: p,
      translate: `0 ${(lerp(16, 0, p) + (live ? -5 : 0)) * k}px`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 * k }}>
        <div style={{
          width: 52 * k, height: 52 * k, borderRadius: R.md * k, background: `${tone}${alpha(0.2)}`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Ico name={icon} size={27 * k} color={tone} />
        </div>
        <span style={{ ...display(30 * k, -0.02), color: "#FFFFFF" }}>{who}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 * k, marginTop: 22 * k }}>
        <Ico name={ok ? "check" : "cross"} size={22 * k} color={tone} />
        <span style={{ ...tabular(22 * k), color: tone }}>{note}</span>
        <span style={{ ...tabular(22 * k), color: "rgba(255,255,255,0.42)" }}>
          — POST 200 either way
        </span>
      </div>
    </div>
  );
};

/* ── beat 7 — the signature  ← MARQUEE ZOOM ──────────────────────────────── */

const VH = 820;

const Verify: React.FC = () => (
  // The rect is measured off a rendered still, not computed: the point of the
  // selection is the SIGNED PAYLOAD box, so the marquee has to start above the
  // label that names it.
  <MarqueeZoom
    pal={PAL15}
    agent={AUDITOR}
    rect={{ x: 24, y: 33, w: 53, h: 26 }}
    drag={[bt(3.0), bt(3.8)]}
    hold={0.36}
    push={1.0}
    release={bt(len("verify") - 1.9)}
    releaseDur={0.85}
  >
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <BoxTag n="05">HOW THE SIGNATURE IS MADE</BoxTag>
        <Canvas h={VH}>
          <HeaderStrip />
          <SignedPayload />
          {/* the header feeding the payload feeding the HMAC, still moving —
              the chain is the argument, and a drawn line that has stopped is
              just a rule */}
          <Link
            h={VH} at={F(2.0)} dur={20} tone={PAL15.accent} speed={52}
            pts={[[880, 300], [880, 358]]}
          />
          <Link
            h={VH} at={F(4.6)} dur={20} tone={PAL15.accent} speed={52}
            pts={[[880, 560], [880, 618]]}
          />
          <NodeBox
            x={520} y={618} w={720} h={132}
            title="HMAC-SHA256" sub="key: whsec_… · compare in constant time"
            icon="key" tone={PAL15.accent} at={F(5.0)}
          />
        </Canvas>
      </div>
    </AbsoluteFill>
  </MarqueeZoom>
);

/** The header, split into the two things it carries. */
const HeaderStrip: React.FC = () => {
  const k = useK();
  const p = useAppearAt(14, 190);
  return (
    <div style={{
      position: "absolute", left: 190 * k, top: 150 * k, width: 1380 * k,
      background: PANEL, border: `1px solid rgba(255,255,255,0.10)`,
      borderRadius: R.lg * k, boxShadow: SHADOW[3], padding: `${22 * k}px ${26 * k}px`,
      opacity: p, transform: `scale(${lerp(0.96, 1, p)})`,
    }}>
      <div style={{ ...microCap(18 * k), color: ON_DIM, marginBottom: 14 * k }}>
        Stripe-Signature
      </div>
      <div style={{ ...tabular(30 * k), color: ON, whiteSpace: "nowrap" }}>
        <Span label="t" hue={SENDER} at={F(0.9)}>t=1748291105</Span>
        <span style={{ color: ON_DIM }}>,</span>
        <Span label="v1" hue={PAL15.accent} at={F(1.3)}>v1=5257a869e7eceb…d0ce8e108d8bd</Span>
      </div>
      <div style={{ ...tabular(20 * k), color: ON_DIM, marginTop: 12 * k, opacity: useAppearAt(F(1.7), 200) }}>
        v1 is the only valid live scheme — ignore every other one, or you have written a downgrade attack
      </div>
    </div>
  );
};

const Span: React.FC<{ label: string; hue: string; at: number; children: React.ReactNode }> = ({
  hue, at: a, children,
}) => {
  const k = useK();
  const p = useAppearAt(a, 200);
  return (
    <span style={{
      background: `${hue}${alpha(0.12 * p)}`, borderBottom: `2px solid ${hue}${alpha(p)}`,
      padding: `${2 * k}px ${5 * k}px`, borderRadius: 4 * k,
    }}>
      {children}
    </span>
  );
};

/** The one thing everyone gets wrong, set as the thing being pointed at. */
const SignedPayload: React.FC = () => {
  const k = useK();
  const p = useAppearAt(F(2.4), 190);
  return (
    <div style={{
      position: "absolute", left: 420 * k, top: 358 * k, width: 920 * k, opacity: p,
      transform: `scale(${lerp(0.96, 1, p)})`,
    }}>
      <HighlightBox pal={PAL15} label="the signed payload" at={F(2.4)} pad={30} tone="dark">
        <div style={{ ...tabular(34 * k), color: ON, textAlign: "center", lineHeight: 1.5 }}>
          {"`${t}"}
          <span style={{ color: PAL15.accent, fontWeight: 700 }}>.</span>
          {"${raw_body}`"}
        </div>
        <div style={{
          ...microCap(17 * k), color: ON_DIM, textAlign: "center", marginTop: 14 * k,
          opacity: useAppearAt(F(3.6), 200),
        }}>
          timestamp · a literal dot · the bytes exactly as they arrived
        </div>
      </HighlightBox>
    </div>
  );
};

/* ── beat 8 — the raw-body trap ──────────────────────────────────────────── */

const RawBody: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const fail = useAppearAt(F(4.8), 210);
  const buzz = 1 + 0.05 * Math.sin(useLoop(28) * Math.PI * 2);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <BoxTag n="06">THE BYTES, NOT THE OBJECT</BoxTag>
      <div style={{ display: "flex", gap: 30 * k, alignItems: "stretch" }}>
        <ByteCard
          title="what arrived on the wire"
          body={`{"id":"evt_1PxKq2","type":"charge.succeeded"}`}
          tone={OK}
          verdict="signature matches"
          ok
          at={18}
        />
        <ByteCard
          title="after JSON.parse, then JSON.stringify"
          body={`{ "id": "evt_1PxKq2", "type": "charge.succeeded" }`}
          tone={BAD}
          verdict="signature fails"
          ok={false}
          at={F(2.6)}
        />
      </div>
      <div style={{
        display: "flex", alignItems: "center", gap: 16 * k, marginTop: 40 * k,
        opacity: fail, transform: `scale(${buzz})`,
      }}>
        <Ico name="cross" size={34 * k} color={BAD} />
        <span style={{ ...display(36 * k, -0.02), color: BAD }}>
          three spaces different · every signature in the request now fails
        </span>
      </div>
      <Note at={F(6.2)}>
        Reach for the raw body before any body-parser touches it. Most frameworks give you one flag.
      </Note>
      {void frame}
    </div>
  );
};

const ByteCard: React.FC<{
  title: string; body: string; tone: string; verdict: string; ok: boolean; at: number;
}> = ({ title, body, tone, verdict, ok, at: a }) => {
  const k = useK();
  const p = useAppearAt(a, 190);
  // A byte scanner crawling the payload. It is not decoration: the claim is
  // that the DIFFERENCE is at the byte level, and a bar reading the string one
  // character at a time is the only way to make a wall of monospace feel like
  // something being inspected.
  const scan = useLoop(F(3.2));
  return (
    <div style={{
      width: 760 * k, padding: `${26 * k}px`, background: PANEL,
      border: `1px solid rgba(255,255,255,0.10)`,
      borderRadius: R.lg * k, boxShadow: SHADOW[3],
      opacity: p, translate: `0 ${lerp(16, 0, p) * k}px`,
    }}>
      <div style={{ ...microCap(17 * k), color: ON_DIM }}>{title}</div>
      <div style={{
        position: "relative", overflow: "hidden",
        ...tabular(23 * k), color: ON, background: "rgba(255,255,255,0.05)",
        border: `1px solid rgba(255,255,255,0.09)`, borderRadius: R.md * k,
        padding: `${18 * k}px ${18 * k}px`, marginTop: 18 * k, wordBreak: "break-all", lineHeight: 1.5,
      }}>
        <div style={{
          position: "absolute", top: 0, bottom: 0, left: `${scan * 100}%`, width: 46 * k,
          background: `linear-gradient(90deg, ${tone}00, ${tone}2E, ${tone}00)`,
          pointerEvents: "none",
        }} />
        <span style={{ position: "relative" }}>{body}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 11 * k, marginTop: 18 * k }}>
        <Ico name={ok ? "check" : "cross"} size={24 * k} color={tone} />
        <span style={{ ...tabular(23 * k), color: tone }}>{verdict}</span>
      </div>
    </div>
  );
};

/* ── beat 9 — tolerance and replay ───────────────────────────────────────── */

const Tolerance: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  // A LIVE clock, not a counter that resolves. It climbs across almost the
  // whole beat and crosses 300 near the end, so the card has a middle with
  // tension and an end with a verdict — which is the difference between a
  // number on a card and a state machine.
  const age = interpolate(frame, [F(1.8), F(7.6)], [7, 338], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rejected = age > 300;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <BoxTag n="07" tone="dark">THE TIMESTAMP IS SIGNED TOO</BoxTag>
      <div style={{ display: "flex", gap: 30 * k, alignItems: "center" }}>
        <HeroCard pal={PAL15} tone="dark" title="Delivery age" w={620} at={10} accent={rejected ? BAD : OK}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 16 * k }}>
            <span style={{
              ...display(120 * k, -0.045), color: rejected ? BAD : "#FFFFFF",
              fontVariantNumeric: "tabular-nums", fontFeatureSettings: '"tnum", "ss01"',
            }}>
              {Math.round(age)}
            </span>
            <span style={{ ...microCap(20 * k), color: "rgba(255,255,255,0.55)", paddingBottom: 20 * k }}>
              seconds old
            </span>
          </div>
          <div style={{ marginTop: 26 * k }}>
            <TickMeter
              pal={PAL15}
              value={Math.min(100, (age / 300) * 100)}
              at={-1}
              ticks={40}
              color={rejected ? BAD : OK}
              rows={[
                ["tolerance", "300s"],
                ["default", "5 minutes"],
                ["never", "0"],
              ]}
            />
          </div>
          <div style={{
            marginTop: 26 * k, display: "flex", alignItems: "center", gap: 12 * k,
            opacity: useAppearAt(F(2.6), 210),
          }}>
            <Ico name={rejected ? "cross" : "check"} size={26 * k} color={rejected ? BAD : OK} />
            <span style={{ ...tabular(25 * k), color: rejected ? BAD : OK }}>
              {rejected ? "reject — outside tolerance" : "inside tolerance — accept"}
            </span>
          </div>
        </HeroCard>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 * k, width: 640 * k }}>
          <Chip label="the timestamp is inside the HMAC" icon="lock" tone={PAL15.accent} at={F(1.2)} dark />
          <Chip label="so an attacker cannot move it" icon="shield" tone={PAL15.accent} at={F(1.8)} dark />
          <Chip label="a captured POST expires by itself" icon="sand" tone={SENDER} at={F(2.4)} dark />
          <Chip label="keep the host on NTP" icon="clock" tone={SENDER} at={F(3.0)} dark />
          <div style={{ marginTop: 16 * k }}>
            <HighlightBox pal={PAL15} label="never" at={F(6.0)} tone="dark" hue={BAD} pad={22}>
              <span style={{ ...tabular(25 * k), color: "#FFFFFF" }}>tolerance: 0</span>
              <span style={{ fontFamily: SANS, fontWeight: 300, fontSize: 23 * k, color: "rgba(255,255,255,0.6)", marginLeft: 14 * k }}>
                — that disables the recency check entirely
              </span>
            </HighlightBox>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── beat 10 — return 2xx first ──────────────────────────────────────────── */

const BUDGETS = [
  { who: "Slack", s: 3, note: "3 retries, exponential" },
  { who: "Shopify", s: 5, note: "1s just to connect · 8 retries / 4h" },
  { who: "GitHub", s: 10, note: "then the delivery is failed" },
];

const Acknowledge: React.FC = () => {
  const k = useK();
  // A wall clock sweeping the budgets, over and over. Three bars of different
  // lengths are a chart; the same three with a hand crossing them one after
  // another is a deadline, and the viewer feels which ones it has already blown.
  const now = useLoop(F(4.6)) * 12;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <BoxTag n="08">ACKNOWLEDGE, THEN WORK</BoxTag>
      <div style={{ display: "flex", gap: 54 * k, alignItems: "flex-start" }}>
        <div style={{ width: 700 * k }}>
          <div style={{ ...microCap(19 * k), color: PAL15.textMuted, marginBottom: 20 * k }}>
            the whole budget you are given
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 22 * k }}>
            {BUDGETS.map((b, i) => (
              <Budget key={b.who} {...b} at={20 + stagger(i, 16)} now={now} />
            ))}
          </div>
        </div>
        <div style={{ width: 860 * k }}>
          <Terminal
            pal={PAL15}
            w={860}
            h={356}
            title="handler.ts — the right order"
            start={F(1.6)}
            cps={38}
            at={F(0.6)}
            size={23}
            lines={[
              { text: "const evt = verify(rawBody, sig, whsec)" },
              { text: "await queue.push(evt)", hot: "queue.push" },
              { text: "return res.status(200).end()", hot: "200" },
              { text: "" },
              { text: "// the fulfilment, the email, the ledger", instant: true },
              { text: "// write — all of it happens over there", instant: true },
            ]}
          />
          <div style={{ display: "flex", gap: 14 * k, marginTop: 26 * k }}>
            <Pill pal={PAL15} at={F(5.4)}>200 in milliseconds</Pill>
            <Pill pal={PAL15} filled={false} at={F(5.8)}>the work takes as long as it takes</Pill>
          </div>
        </div>
      </div>
      <Note at={F(6.6)}>
        A timeout is a failed delivery. It comes back — and now you are doing the work twice.
      </Note>
    </div>
  );
};

const Budget: React.FC<{ who: string; s: number; note: string; at: number; now: number }> = ({
  who, s, note, at: a, now,
}) => {
  const k = useK();
  const grow = useCount(1, a + 10, 34);
  const p = useAppearAt(a, 190);
  const blown = now > s;
  return (
    <div style={{ opacity: p }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 * k }}>
        <span style={{ ...display(30 * k, -0.02), color: PAL15.ink }}>{who}</span>
        <span style={{ ...tabular(30 * k), color: blown ? BAD : PAL15.accent }}>
          {blown ? "timed out" : `${(s * grow).toFixed(1)}s`}
        </span>
      </div>
      <div style={{ position: "relative", height: 16 * k, borderRadius: 8 * k, background: PAL15.bgDeep, overflow: "hidden" }}>
        <div style={{
          width: `${(s / 12) * 100 * grow}%`, height: "100%", borderRadius: 8 * k,
          background: blown ? `${BAD}55` : PAL15.accent,
        }} />
        {/* the hand crossing the deadline */}
        <div style={{
          position: "absolute", top: 0, bottom: 0, left: `${Math.min(100, (now / 12) * 100)}%`,
          width: 3 * k, background: PAL15.ink, opacity: 0.8 * grow,
        }} />
      </div>
      <div style={{ ...tabular(19 * k), color: PAL15.textMuted, marginTop: 9 * k }}>{note}</div>
    </div>
  );
};

/* ── beat 11 — at-least-once  ← MARQUEE ZOOM ─────────────────────────────── */

const Duplicates: React.FC = () => (
  // The rect names the ledger row that stops the second delivery. Measured off
  // a still: a tighter box crops the id, which is the one thing being pointed at.
  <MarqueeZoom
    pal={PAL15}
    agent={OPERATOR}
    rect={{ x: 30, y: 52, w: 41, h: 17 }}
    drag={[bt(3.6), bt(4.4)]}
    hold={0.34}
    push={1.0}
    release={bt(len("dupes") - 1.8)}
    releaseDur={0.8}
  >
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <DuplicatesInner />
    </AbsoluteFill>
  </MarqueeZoom>
);

const DuplicatesInner: React.FC = () => {
  const k = useK();
  const ROWS = [
    { id: "evt_1PxKq2Gd8Lm3Nq", when: "12:04:11.208", act: "processed", ok: true },
    { id: "evt_1PxKq2Gd8Lm3Nq", when: "12:04:39.774", act: "already seen — skipped", ok: false },
    { id: "evt_1PxKr9Ha2Bc7Vf", when: "12:05:02.331", act: "processed", ok: true },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <BoxTag n="09">DELIVERY IS AT-LEAST-ONCE</BoxTag>
      <div style={{
        width: 1420 * k, background: PANEL, border: `1px solid rgba(255,255,255,0.10)`,
        borderRadius: R.lg * k, boxShadow: SHADOW[3], overflow: "hidden",
      }}>
        <div style={{
          display: "grid", gridTemplateColumns: "1.5fr 0.8fr 1.3fr",
          padding: `${16 * k}px ${28 * k}px`, borderBottom: `1px solid rgba(255,255,255,0.08)`,
          background: "rgba(255,255,255,0.04)",
        }}>
          {["event id", "received", "what you did"].map((h) => (
            <span key={h} style={{ ...microCap(17 * k), color: ON_DIM }}>{h}</span>
          ))}
        </div>
        {ROWS.map((r, i) => (
          <LedgerRow key={i} {...r} at={F(1.2) + stagger(i, 22)} />
        ))}
      </div>
      <div style={{ display: "flex", gap: 16 * k, marginTop: 34 * k }}>
        <Chip label="processed_events" sub="event id, primary key" icon="db" tone={PAL15.accent} at={F(6.0)} />
        <Chip label="INSERT … ON CONFLICT DO NOTHING" sub="the whole defence" icon="shield" tone={OK} at={F(6.5)} />
      </div>
    </div>
  );
};

const LedgerRow: React.FC<{
  id: string; when: string; act: string; ok: boolean; at: number;
}> = ({ id, when, act, ok, at: a }) => {
  const k = useK();
  const p = useAppearAt(a, 200);
  // The skipped row keeps turning. It is the one row on the table that is doing
  // something — a delivery arriving and being thrown away — and the rest of the
  // beat is a static ledger by design.
  const spin = useLoop(150);
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "1.5fr 0.8fr 1.3fr", alignItems: "center",
      padding: `${20 * k}px ${28 * k}px`, borderBottom: `1px solid rgba(255,255,255,0.07)`,
      opacity: p, translate: `${lerp(14, 0, p) * k}px 0`,
      background: ok ? "transparent" : "rgba(255,255,255,0.07)",
    }}>
      <span style={{ ...tabular(25 * k), color: ON }}>{id}</span>
      <span style={{ ...tabular(23 * k), color: ON_DIM }}>{when}</span>
      <span style={{ display: "flex", alignItems: "center", gap: 11 * k }}>
        <span style={{ rotate: ok ? undefined : `${spin * 360}deg`, display: "flex" }}>
          <Ico name={ok ? "check" : "cycle"} size={22 * k} color={ok ? OK : PAL15.accent} />
        </span>
        <span style={{ ...tabular(23 * k), color: ok ? ON_MID : PAL15.accent }}>{act}</span>
      </span>
    </div>
  );
};

/* ── beat 12 — ordering ──────────────────────────────────────────────────── */

const ORDER_SENT = [
  "customer.subscription.created",
  "invoice.created",
  "invoice.paid",
  "charge.succeeded",
];
const ORDER_GOT = [
  "invoice.paid",
  "charge.succeeded",
  "customer.subscription.created",
  "invoice.created",
];

const Ordering: React.FC = () => {
  const k = useK();
  // One event walked from the order it was GENERATED in to the row it actually
  // ARRIVED in, then the next, forever. Two static lists state that the order
  // differs; a selection jumping between them shows you by how much, which is
  // the only part that changes what you write.
  const walk = useLoop(F(3.6));
  const live = ORDER_SENT[Math.floor(walk * ORDER_SENT.length)];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <BoxTag n="10">ORDER IS NOT GUARANTEED</BoxTag>
      <div style={{ display: "flex", gap: 70 * k, alignItems: "flex-start" }}>
        <OrderList label="generated, in this order" items={ORDER_SENT} tone={SENDER} at={18} live={live} />
        <div style={{ paddingTop: 130 * k, opacity: useAppearAt(F(2.4), 200) }}>
          <Ico name="arrow" size={44 * k} color={PAL15.textMuted} />
        </div>
        <OrderList label="delivered, in this one" items={ORDER_GOT} tone={PAL15.accent} at={F(2.8)} shuffled live={live} />
      </div>
      <div style={{ marginTop: 44 * k, width: 1180 * k }}>
        <HighlightBox pal={PAL15} label="the rule" at={F(5.6)} tone="dark">
          <span style={{ ...display(32 * k, -0.02), color: ON, lineHeight: 1.4 }}>
            Reconcile against the object, never against arrival. If `invoice.paid` lands first,
            fetch the subscription — do not wait for the event that explains it.
          </span>
        </HighlightBox>
      </div>
    </div>
  );
};

const OrderList: React.FC<{
  label: string; items: string[]; tone: string; at: number; shuffled?: boolean; live?: string;
}> = ({ label, items, tone, at: a, shuffled = false, live }) => {
  const k = useK();
  return (
    <div style={{ width: 640 * k }}>
      <div style={{ ...microCap(18 * k), color: PAL15.textMuted, marginBottom: 20 * k, opacity: useAppearAt(a - 6, 200) }}>
        {label}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 * k }}>
        {items.map((t, i) => (
          <div
            key={t}
            style={{
              display: "flex", alignItems: "center", gap: 14 * k,
              background: PANEL,
              border: `1px solid rgba(255,255,255,${live === t ? 0.3 : 0.1})`,
              borderRadius: R.md * k, boxShadow: SHADOW[3],
              padding: `${15 * k}px ${18 * k}px`,
              opacity: useAppearAt(a + stagger(i, 12), 200),
              translate: `${(live === t ? 8 : 0) * k}px 0`,
            }}
          >
            <span style={{
              width: 30 * k, height: 30 * k, borderRadius: "50%", flexShrink: 0,
              background: `${tone}${alpha(0.14)}`, color: tone, ...tabular(18 * k),
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {shuffled ? ORDER_SENT.indexOf(t) + 1 : i + 1}
            </span>
            <span style={{ ...tabular(23 * k), color: ON }}>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── beat 13 — the retry ladder ──────────────────────────────────────────── */

const Retries: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  // The ladder climbs, lands on the 200, holds, and climbs again. A ladder that
  // resolves once leaves five seconds of the beat with a finished bar chart on
  // it — and "it comes back" is precisely the thing that should not happen once.
  const climb = useLoop(F(4.8));
  const step = frame < F(1.6) ? -1 : Math.min(6, Math.floor(climb * 7.6));
  const GAPS = ["now", "+5s", "+30s", "+2m", "+10m", "+1h", "+6h"];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <BoxTag n="11">A FAILED DELIVERY COMES BACK</BoxTag>
      <div style={{ display: "flex", gap: 14 * k, alignItems: "flex-end", height: 240 * k }}>
        {GAPS.map((g, i) => (
          <Attempt key={g} n={i + 1} gap={g} on={i <= step} last={i === 6} />
        ))}
      </div>
      <div style={{ display: "flex", gap: 22 * k, marginTop: 50 * k }}>
        <Window who="Stripe" v="3 days" note="exponential backoff, live mode" at={F(4.6)} hero />
        <Window who="Shopify" v="8 tries" note="over 4 hours, then dropped" at={F(4.6) + 12} />
        <Window who="Slack" v="3 tries" note="then the subscription is disabled" at={F(4.6) + 24} />
      </div>
      <Note at={F(6.6)}>
        Every retry is a duplicate you already know how to swallow. That is why the ledger came first.
      </Note>
    </div>
  );
};

const Attempt: React.FC<{ n: number; gap: string; on: boolean; last: boolean }> = ({
  n, gap, on, last,
}) => {
  const k = useK();
  const h = 60 + n * 24;
  const tone = last ? OK : BAD;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 * k }}>
      <span style={{ ...tabular(20 * k), color: on ? tone : PAL15.border }}>{last ? "200" : "500"}</span>
      <div style={{
        width: 116 * k, height: h * k, borderRadius: R.md * k,
        background: on ? `${tone}${alpha(last ? 0.9 : 0.16)}` : PAL15.bgDeep,
        border: `1.5px solid ${on ? tone : PAL15.border}`,
        transition: "none",
      }} />
      <span style={{ ...tabular(20 * k), color: on ? PAL15.ink : PAL15.textMuted }}>{gap}</span>
    </div>
  );
};

const Window: React.FC<{ who: string; v: string; note: string; at: number; hero?: boolean }> = ({
  who, v, note, at: a, hero = false,
}) => {
  const k = useK();
  const p = useAppearAt(a, 190);
  return (
    <div style={{
      width: 470 * k, padding: `${24 * k}px ${26 * k}px`,
      background: PANEL,
      border: `1px solid rgba(255,255,255,${hero ? 0.26 : 0.1})`,
      borderRadius: R.lg * k, boxShadow: SHADOW[3],
      opacity: p, translate: `0 ${lerp(14, 0, p) * k}px`,
    }}>
      <div style={{ ...microCap(17 * k), color: ON_DIM }}>{who}</div>
      <div style={{ ...display(48 * k, -0.03), color: hero ? PAL15.accent : ON, marginTop: 10 * k }}>{v}</div>
      <div style={{
        fontFamily: SANS, fontWeight: 300, fontSize: 21 * k, marginTop: 10 * k,
        color: ON_DIM,
      }}>
        {note}
      </div>
    </div>
  );
};

/* ── beat 14 — keep the sweep ────────────────────────────────────────────── */

const Sweep: React.FC = () => {
  const k = useK();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <BoxTag n="12">THE PART NOBODY BUILDS</BoxTag>
      <div style={{ display: "flex", gap: 40 * k, alignItems: "stretch" }}>
        <Path
          head="the webhook"
          sub="fast, and allowed to fail"
          tone={PAL15.accent}
          icon="bolt"
          items={[
            { t: "arrives in a second", i: "bolt" as IcoName },
            { t: "verified, queued, acked", i: "check" as IcoName },
            { t: "can be lost, replayed, reordered", i: "cycle" as IcoName },
          ]}
          at={20}
        />
        <Path
          head="the sweep"
          sub="slow, and never wrong"
          tone={SENDER}
          icon="sweep"
          items={[
            { t: "list what changed since the cursor", i: "list" as IcoName },
            { t: "compare against your own rows", i: "db" as IcoName },
            { t: "run it on a schedule, forever", i: "clock" as IcoName },
          ]}
          at={F(2.6)}
          /* the one card on the beat that should visibly still be running —
             "forever" is a claim, and a bar that keeps refilling makes it */
          progress={useLoop(F(5.0))}
        />
      </div>
      <div style={{ marginTop: 44 * k, width: 1240 * k }}>
        <HighlightBox pal={PAL15} label="the whole episode" at={F(5.4)} tone="dark">
          <span style={{ ...display(38 * k, -0.025), color: ON, lineHeight: 1.35, display: "block", textAlign: "center" }}>
            A webhook is an optimisation on a thing you can already do.
            <br />
            Build the thing you can already do.
          </span>
        </HighlightBox>
      </div>
    </div>
  );
};

const Path: React.FC<{
  head: string; sub: string; tone: string; icon: IcoName;
  items: { t: string; i: IcoName }[]; at: number; progress?: number;
}> = ({ head, sub, tone, icon, items, at: a, progress }) => {
  const k = useK();
  const p = useAppearAt(a - 6, 190);
  // Hoisted out of the conditional JSX below — a hook behind an `&&` is a hook
  // whose presence depends on a prop, and that is one refactor away from #310.
  const barIn = useAppearAt(a + 60, 200);
  return (
    <div style={{
      width: 700 * k, padding: `${30 * k}px`, background: PANEL,
      border: `1px solid rgba(255,255,255,0.10)`,
      borderRadius: R.lg * k, boxShadow: SHADOW[3],
      opacity: p, translate: `0 ${lerp(16, 0, p) * k}px`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 15 * k }}>
        <div style={{
          width: 56 * k, height: 56 * k, borderRadius: R.md * k, background: `${tone}${alpha(0.12)}`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Ico name={icon} size={29 * k} color={tone} />
        </div>
        <span style={{ ...display(40 * k, -0.03), color: ON }}>{head}</span>
      </div>
      <div style={{ fontFamily: SANS, fontWeight: 300, fontSize: 23 * k, color: ON_DIM, marginTop: 12 * k, marginBottom: 24 * k }}>
        {sub}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 * k }}>
        {items.map((x, n) => (
          <div key={x.t} style={{
            display: "flex", alignItems: "center", gap: 15 * k,
            background: "rgba(255,255,255,0.05)", borderRadius: R.md * k, padding: `${14 * k}px ${16 * k}px`,
            opacity: useAppearAt(a + stagger(n, 14), 200),
          }}>
            <Ico name={x.i} size={24 * k} color={tone} />
            <span style={{ fontFamily: SANS, fontWeight: 300, fontSize: 24 * k, color: ON_MID }}>{x.t}</span>
          </div>
        ))}
      </div>
      {progress !== undefined && (
        <div style={{ marginTop: 22 * k, opacity: barIn }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 9 * k }}>
            <span style={{ ...microCap(15 * k), color: ON_DIM }}>sweeping since cursor</span>
            <span style={{ ...tabular(17 * k), color: tone }}>
              {Math.round(progress * 14832).toLocaleString("en-US")} / 14,832
            </span>
          </div>
          <div style={{ height: 8 * k, borderRadius: 4 * k, background: "rgba(255,255,255,0.10)", overflow: "hidden" }}>
            <div style={{ width: `${progress * 100}%`, height: "100%", background: tone }} />
          </div>
        </div>
      )}
    </div>
  );
};

/* ── beat 15 — the sign-off ──────────────────────────────────────────────── */

/**
 * The end card, with the route revealed underneath it first.
 *
 * A film built as a journey should be allowed to show you the journey once, at
 * the end, and this is the only moment where the geography stops being implicit.
 * The map draws its path in the order you travelled it, holds for a beat with
 * every station lit, and then dims as the sign-off arrives over it — so the last
 * thing on screen is the argument's shape rather than a black rectangle with a
 * name on it.
 */
const EndCard: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const fade = (a: number, b: number) =>
    interpolate(frame, [F(a), F(b)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // The sign-off waits for the map. Everything below is offset by SIGN.
  const SIGN = 3.2;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ opacity: fade(0.15, 0.7) * (1 - 0.88 * fade(SIGN - 0.5, SIGN + 0.5)) }}>
        <RouteMap />
      </div>
      <div style={{
        position: "absolute", display: "flex", flexDirection: "column", alignItems: "center",
      }}>
        <div style={{
          ...display(100 * k, -0.045), color: "#FFFFFF", opacity: fade(SIGN, SIGN + 0.5),
          translate: `0 ${interpolate(frame, [F(SIGN), F(SIGN + 0.7)], [26, 0], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.2, 1, 0.3, 1),
          }) * k}px`,
          textShadow: `0 ${8 * k}px ${40 * k}px rgba(10,4,30,0.5)`,
        }}>
          Thanks for watching.
        </div>
        <div style={{
          width: interpolate(frame, [F(SIGN + 0.7), F(SIGN + 2.6)], [0, 440 * k], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.25, 0, 0.15, 1),
          }),
          height: 3 * k, background: "rgba(255,255,255,0.9)", marginTop: 34 * k,
        }} />
        <div style={{
          marginTop: 34 * k, ...display(40 * k, -0.02), fontWeight: 400,
          color: "#FFFFFF", opacity: fade(SIGN + 1.2, SIGN + 1.7),
        }}>
          Bishakh
        </div>
        <div style={{
          marginTop: 20 * k, ...microCap(22 * k), color: "rgba(255,255,255,0.86)",
          opacity: fade(SIGN + 1.8, SIGN + 2.3),
        }}>
          {cfg.next}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** The twelve stations, in the order the camera walked them. */
const MAP_LABELS: Record<string, string> = {
  mech: "the mechanism", delivery: "the delivery", types: "subscribe narrowly",
  public: "the URL is public", verify: "the signature", raw: "the raw body",
  clock: "tolerance", ack: "ack first", dupes: "at-least-once",
  order: "no ordering", retry: "retries", sweep: "the sweep",
};

const RouteMap: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const ids = STRIP_IDS.filter((id) => id !== "end");
  const CW_ = 300, CH_ = 150;
  const pts = ids.map((id) => {
    const [cx, cy] = cellOf(id);
    return { id, x: cx * CW_ + CW_ / 2, y: cy * CH_ + CH_ / 2 };
  });
  const W = 4 * CW_, H = 3 * CH_;
  // The path draws in travel order, one station per ~7 frames.
  const drawn = clamp01((frame - F(0.5)) / F(2.1));
  const lit = drawn * ids.length;

  const d = pts.map((p, i) => `${i ? "L" : "M"} ${p.x} ${p.y}`).join(" ");

  return (
    <div style={{ position: "relative", width: W * k, height: H * k }}>
      <svg width={W * k} height={H * k} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <path d={d} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth={2.5} />
        <path
          d={d}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={3}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - drawn}
        />
      </svg>
      {pts.map((p, i) => {
        const on = i < lit;
        return (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: p.x * k,
              top: p.y * k,
              translate: "-50% -50%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8 * k,
              opacity: on ? 1 : 0.22,
            }}
          >
            <span style={{
              width: 13 * k, height: 13 * k, borderRadius: "50%",
              background: on ? "#FFFFFF" : "rgba(255,255,255,0.35)",
              boxShadow: on ? `0 0 ${14 * k}px rgba(255,255,255,0.8)` : undefined,
            }} />
            <span style={{ ...tabular(15 * k), color: "rgba(255,255,255,0.55)" }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span style={{
              ...microCap(13 * k), letterSpacing: "0.16em",
              color: "rgba(255,255,255,0.86)", whiteSpace: "nowrap",
            }}>
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
 * The VO track is gated on `audio.vo` in the config, now TRUE: the lines are
 * recorded in the series voice and the bed ducks against their real windows.
 * ─────────────────────────────────────────────────────────────────────────── */

const OPEN = 0.34;
const UNDER = 0.15;
const HAS_VO = Boolean(cfg.audio?.vo);

const bedVolume = (f: number) => {
  const t = f / EP15_FPS;
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
  const tail = clamp01((EP15_SECONDS - t) / 1.6);
  return v * head * tail;
};

const Track: React.FC = () => (
  <>
    {cfg.audio?.music && (
      <Sequence from={0} durationInFrames={EP15_DURATION} layout="none" name="score">
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
        three ACT BREAKS get a different pair: a riser under the lift and a
        thunk on the landing, because a move that means "new section" has to
        sound like one or it is just a longer slide. */}
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
    <Cue name="notify" at={F(at("open") + 1.4)} volume={0.26} />
    <Cue name="latch" at={F(at("open") + 2.6)} volume={0.3} />
    <Cue name="tick" at={F(at("mech")) + 44 + 20} volume={0.24} />
    <Cue name="error" at={F(at("mech") + 3.4)} volume={0.22} />
    <Cue name="sub" at={F(at("mech") + 2.4)} volume={0.28} />
    <Cue name="blip" at={F(at("delivery") + 3.0)} volume={0.24} />
    <Cue name="blip" at={F(at("delivery") + 4.4)} volume={0.24} />
    <Cue name="latch" at={F(at("types") + 1.6)} volume={0.3} />
    <Cue name="error" at={F(at("public") + 2.4)} volume={0.22} />
    <Cue name="click" at={F(at("verify") + bt(3.0))} volume={0.32} />
    <Cue name="sub" at={F(at("verify") + bt(4.2))} volume={0.3} />
    <Cue name="latch" at={F(at("verify") + 5.0)} volume={0.26} />
    <Cue name="error" at={F(at("raw") + 4.8)} volume={0.28} />
    <Cue name="notify" at={F(at("clock") + 5.4)} volume={0.28} />
    <Cue name="tick" at={F(at("ack") + 5.4)} volume={0.24} />
    <Cue name="click" at={F(at("dupes") + bt(3.6))} volume={0.32} />
    <Cue name="sub" at={F(at("dupes") + bt(4.8))} volume={0.3} />
    <Cue name="blip" at={F(at("order") + 2.8)} volume={0.22} />
    <Cue name="success" at={F(at("retry") + 4.4)} volume={0.3} />
    <Cue name="latch" at={F(at("sweep") + 5.4)} volume={0.28} />
    <Cue name="thunk" at={F(at("end") + 0.3)} volume={0.34} />

    {/* the retry ladder climbing, one cue a rung */}
    {Array.from({ length: 6 }).map((_, i) => (
      <Cue key={`r${i}`} name="tick" at={F(at("retry") + 1.6 + i * 0.52)} volume={0.16} />
    ))}
  </>
);

void useVideoConfig;
void BarRows;
