// Author: Bishakh
//
// ══ EP 10 — "India orders dinner at midnight. All of it, at once." ══════════
//
// Register: the cream outlined-sticker collage from references/ep10-inspo/ —
// a WhatsApp brand still, restated in Zomato's own Cranberry #E23744 and set in
// Metropolis, the open-source face Zomato's Okra is built from. Vocabulary and
// the seven rules live in ../lib/ep10.tsx.
//
// THE ONE STRUCTURAL DECISION: the director kept all twelve photoreal Kling
// shots against a flat vector style after being warned the two registers fight.
// So footage never plays full-bleed here. Every clip is cropped into a
// `FootageCard` — the same 34px radius and the same 3px ink stroke as every
// other card in the collage — and graded toward the red ramp. A photograph
// pinned into a collage is something this style genuinely does; a full-bleed
// night exterior cutting to flat cream is not.
//
// Colour carries the argument, as it did in EP09:
//   Act 1 (the cliff)      → r1/r2 pale — evening, nothing has happened yet
//   Act 2 (the spine)      → r5 Cranberry — the system at full load
//   Act 3 (the rehearsal)  → r6 deep — December, the work nobody sees
//
// The signature move is `StepGraph`: order volume does not ramp on New Year's
// Eve, it steps. It arrives as the problem in beat 6 and then recurs as a pale
// ghost behind the later diagrams, so the cliff is literally the shape of the
// film.
//
// EP 09 lives in episodes/uber-doma-microservices/Episode.tsx.

import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { buildPalette } from "../theme";
import { Timeline, totalFrames, type Beat } from "../lib/transitions";
import {
  Z, Field, Card, Star, Stage, Display, TopTag,
  ZTitle, ZChapter, ZStatement, ZEnd, ZMark, ZomatoMark,
  FootageCard, PinLabel, StepGraph, EventSpine, BigStat, InstanceGrid, StatPair,
} from "../lib/ep10";
import cfg from "../../episode.config.json";
import durs from "../../vo-durations.json";

export const PAL = buildPalette(cfg.theme || "zomato-cream");
const FPS = cfg.fps || 30;

/**
 * Scene length = its narration + a breath.
 *
 * 0.9s, carried over from EP09 where it was measured: at the house 0.35s the VO
 * starts a few frames in and ends with under 0.2s of scene left, so every
 * trailing syllable lands on the cut. Spend a longer one deliberately — beats 6
 * and 18 earn a held silence.
 */
const sec = (scene: number, breath = 0.9) => ((durs as number[])[scene - 1] ?? 4) + breath;

/** Every beat is the cream field, then the hero object. Field first, always. */
const B: React.FC<{
  seed: number; density?: number; stars?: number; tag?: string; children: React.ReactNode;
}> = ({ seed, density = 7, stars = 5, tag, children }) => (
  <AbsoluteFill>
    <Field seed={seed} density={density} stars={stars} />
    {tag && <TopTag>{tag}</TopTag>}
    {children}
  </AbsoluteFill>
);

/* ── the beats ───────────────────────────────────────────────────────────── */

export const buildBeats = (): Beat[] => [
  // ACT 1 — THE CLIFF ────────────────────────────────────────────────────────

  // 1 — COLD OPEN. Never open on a slide. The street, pinned into the collage,
  // with the clock as the only type on screen.
  {
    seconds: sec(1), vo: 1, enter: "cut", camera: false,
    node: (
      <B seed={1} density={5} stars={3}>
        <FootageCard id="ep10_open" w={1300} h={730} rotate={-1.5} delay={0} startAt={0.4} grade={0.45} i={1}>
          <PinLabel text="23:58" x={50} y={88} delay={10} />
        </FootageCard>
      </B>
    ),
  },

  // 2 — TITLE, straight off the open, with the mark that owns the episode.
  {
    seconds: sec(2), vo: 2, enter: "flash",
    node: (
      <B seed={2} density={8} stars={6}>
        <ZTitle kicker={`${cfg.series} · ${cfg.episode}`} title={cfg.title} accent={cfg.titleAccent} sub={cfg.subtitle} />
      </B>
    ),
  },

  // 3 — THE PROBLEM, stated flat. The bags card is the evidence sitting beside
  // the claim rather than illustrating it.
  {
    seconds: sec(3), vo: 3, enter: "push-up",
    node: (
      <B seed={3} density={4} stars={4}>
        <FootageCard id="ep10_bags" w={430} h={250} x={83} y={74} rotate={7} delay={12} grade={0.55} i={5} />
        <ZStatement text="Most systems scale for a curve." accent="curve" />
      </B>
    ),
  },

  // 4 — WHY IT HURTS. The ticket rail: a queue backing up, in the physical
  // world, where the audience can already read it.
  {
    seconds: sec(4), vo: 4, enter: "iris", camera: false,
    node: (
      <B seed={4} density={4} stars={3}>
        <FootageCard id="ep10_kitchen" w={1240} h={700} rotate={1.8} delay={0} startAt={0.5} grade={0.5} i={2}>
          <PinLabel text="a kitchen has a ceiling" x={50} y={89} delay={14} fill={Z.r2} />
        </FootageCard>
      </B>
    ),
  },

  // 5 — CHAPTER SLATE. The wok is texture, not information — one hot moving
  // thing in the corner so the slate isn't a dead card.
  {
    seconds: sec(5), vo: 5, enter: "wipe",
    node: (
      <B seed={5} density={6} stars={5}>
        <FootageCard id="ep10_wok" w={400} h={230} x={16} y={76} rotate={-8} delay={8} grade={0.6} i={7} />
        <ZChapter n={1} title="The cliff" />
      </B>
    ),
  },

  // 6 — THE SIGNATURE MOVE. The step, drawn hard, because a smooth curve is the
  // exact lie the episode is arguing against. Earns a longer breath.
  {
    seconds: sec(6, 1.2), vo: 6, enter: "push-left",
    node: (
      <B seed={6} density={3} stars={4} tag="orders per minute">
        <FootageCard id="ep10_crowd" w={370} h={210} x={85} y={22} rotate={6} delay={16} grade={0.55} i={9} />
        <StepGraph delay={3} label="new year's eve — one night" />
      </B>
    ),
  },

  // ACT 2 — THE SPINE ───────────────────────────────────────────────────────

  // 7 — CHAPTER SLATE. The ghost cliff arrives underneath and the stars land
  // late — a bare slate measured 3.24 energy on the first pass, the second
  // stillest beat in the film.
  {
    seconds: sec(7), vo: 7, enter: "wipe",
    node: (
      <B seed={7} density={6} stars={5}>
        <StepGraph ghost />
        <FootageCard id="ep10_bags" w={390} h={224} x={16} y={74} rotate={-7} delay={7} grade={0.55} i={19} />
        <ZChapter n={2} title="The spine" />
        <Star x={79} y={30} size={58} delay={18} i={72} rotate={16} />
      </B>
    ),
  },

  // 8 — THE ARCHITECTURE. Packets keep crawling producer → queue → consumer for
  // the whole beat, so the screen is never finished while the VO is still going.
  {
    seconds: sec(8), vo: 8, enter: "push-up",
    node: (
      <B seed={8} density={3} stars={3} tag="event-driven, end to end">
        <StepGraph ghost />
        <EventSpine delay={2} />
      </B>
    ),
  },

  // 9 — THE NUMBER. Kafka's real throughput that night, counting up.
  {
    seconds: sec(9), vo: 9, enter: "iris",
    node: (
      <B seed={9} density={4} stars={5}>
        <FootageCard id="ep10_fireworks" w={400} h={228} x={84} y={23} rotate={5} delay={14} grade={0.5} i={11} />
        <BigStat value="450" unit="million messages / minute" caption="peak Kafka throughput · 5.6 GBps across the clusters" delay={2} />
      </B>
    ),
  },

  // 10 — SEEING IT. The data centre, pinned in, under the logging number.
  {
    seconds: sec(10), vo: 10, enter: "push-left", camera: false,
    node: (
      <B seed={10} density={3} stars={3}>
        <FootageCard id="ep10_datacentre" w={1180} h={664} y={44} rotate={-1.2} delay={0} startAt={0.4} grade={0.5} i={4}>
          <PinLabel text="60 TB of logs · one day" x={50} y={87} delay={12} />
        </FootageCard>
      </B>
    ),
  },

  // 11 — THE SCALE OF SIGHT. Two rows, staggered, over a strip of series data
  // that never stops arriving. No ghost cliff here: behind three stacked
  // elements it stopped reading as the graph and became a stray pale
  // rectangle, so it stays on beat 8.
  {
    seconds: sec(11), vo: 11, enter: "push-up",
    node: (
      <B seed={11} density={4} stars={4} tag="observability">
        <StatPair a1={["2.2", "billion active time series"]} a2={["17.8", "million data points / second"]} delay={2} />
      </B>
    ),
  },

  // ACT 3 — THE REHEARSAL ───────────────────────────────────────────────────

  // 12 — CHAPTER SLATE.
  {
    seconds: sec(12), vo: 12, enter: "wipe",
    node: (
      <B seed={12} density={6} stars={5}>
        <FootageCard id="ep10_rider" w={380} h={218} x={84} y={75} rotate={7} delay={9} grade={0.55} i={13} />
        <ZChapter n={3} title="The rehearsal" />
      </B>
    ),
  },

  // 13 — THE TURN. The ops room: the same night from the other side. This is the
  // cut that most wants a Kling morph bridge — see the note at the foot of this
  // file — so its neighbours are already on `fade`.
  // The ops-room plate is locked off IN THE FOOTAGE, so with camera:false this
  // beat measured 0.79 energy — by far the stillest in the film. Fixed by
  // letting the camera work, shortening the breath, and landing a second label
  // late so something still arrives at the end of the beat.
  {
    seconds: sec(13, 0.9), vo: 13, enter: "fade", enterDur: 8,
    node: (
      <B seed={13} density={3} stars={2}>
        <FootageCard id="ep10_opsroom" w={1260} h={710} rotate={1} delay={0} startAt={0.3} grade={0.45} i={6} push={1.42}>
          <PinLabel text="december" x={30} y={88} delay={8} fill={Z.r2} />
          <PinLabel text="fifteen days out" x={69} y={88} delay={26} />
        </FootageCard>
        <Star x={13} y={22} size={62} delay={18} i={73} rotate={-14} />
      </B>
    ),
  },

  // 14 — LOAD TESTING. Thirty billion requests, fired deliberately.
  {
    seconds: sec(14), vo: 14, enter: "push-left",
    node: (
      <B seed={14} density={4} stars={4} tag="fifteen days">
        <BigStat value="30" unit="billion requests" caption="fired at their own systems, on purpose" delay={2} fill={Z.r6} />
      </B>
    ),
  },

  // 15 — PRE-SCALED. The grid fills across the whole beat and the counter is
  // still running when the narration lands on the number.
  {
    seconds: sec(15), vo: 15, enter: "iris",
    // density/stars 0: the scatter sat behind the lattice and poked through the
    // gaps between cells. The grid IS this beat's collage — it needs the air.
    node: (
      <B seed={15} density={0} stars={0} tag="autoscaling is too slow">
        <InstanceGrid delay={2} />
        <Star x={7} y={16} size={70} delay={16} i={74} rotate={-10} />
        <Star x={94} y={80} size={58} delay={24} i={75} rotate={18} />
      </B>
    ),
  },

  // 16 — CHAOS. The one optical transition in the episode, spent here: a
  // deliberately injected failure deserves the one cut that feels like an event.
  {
    seconds: sec(16), vo: 16, enter: "light-leak", camera: false,
    node: (
      <B seed={16} density={3} stars={3}>
        <FootageCard id="ep10_rack_dark" w={1200} h={676} rotate={-1.6} delay={0} startAt={0.4} grade={0.5} i={8}>
          <PinLabel text="break it yourself" x={50} y={88} delay={12} />
        </FootageCard>
      </B>
    ),
  },

  // 17 — THE PAYOFF, in their real numbers, over the empty dawn road.
  {
    seconds: sec(17), vo: 17, enter: "push-up",
    node: (
      <B seed={17} density={3} stars={5}>
        <FootageCard id="ep10_dawn" w={420} h={240} x={16} y={75} rotate={-7} delay={12} grade={0.5} i={15} />
        <BigStat value="3" unit="million orders" caption="60% delivered in under thirty minutes" delay={2} />
      </B>
    ),
  },

  // 18 — CLOSE. The thesis, the morning after, then stop. Longest breath.
  {
    seconds: sec(18, 1.4), vo: 18, enter: "pull",
    node: (
      <B seed={18} density={5} stars={6}>
        <FootageCard id="ep10_morning" w={400} h={228} x={84} y={76} rotate={6} delay={14} grade={0.55} i={17} />
        <ZEnd line="You cannot load-test appetite." accent="appetite" cta={cfg.cta} next={cfg.next} />
      </B>
    ),
  },
];

export const BEATS = buildBeats();
export const DURATION = totalFrames(BEATS, FPS);

/* ── the composition ─────────────────────────────────────────────────────── */

export const Episode: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: Z.cream }}>
    <Timeline beats={buildBeats()} pal={PAL} voVolume={1} vo={cfg.audio?.vo !== false} />
    {cfg.audio?.music !== false && (
      <Audio src={staticFile(cfg.music?.file || "audio/music/bed.mp3")} volume={cfg.music?.volume ?? 0.17} loop />
    )}
    {/* Series mark starts after the title card so it doesn't duplicate the kicker. */}
    <Sequence from={Math.round((sec(1) + sec(2)) * FPS)} layout="none" name="Series mark">
      <ZMark series={cfg.series} episode={cfg.episode} />
    </Sequence>
  </AbsoluteFill>
);

// Vocabulary kept alive for the next pass — not dead code.
void [Card, Star, Stage, Display, ZomatoMark];
