// Author: Bishakh
//
// ══ EP 09 — "Uber broke the monolith. Then the pieces broke them." ══════════
//
// Register: iluli flat collage, matched to the reference film the director
// supplied. The WHOLE FRAME is one saturated colour and it swaps between beats —
// cream, yellow, sky, near-black — with one big flat geometric shape behind the
// hero object, sparkles in the negative space, and type arriving as stickers.
//
// Colour carries the argument:
//   Act 1 (the escape)  → cream / sky      — daylight, the optimistic decision
//   Act 2 (the cost)    → near-black       — the bill arriving, lights out
//   Act 3 (the domains) → yellow / sky     — resolution
//
// Kling's ONLY job here is the greyscale photo cutouts collaged into the flat
// vector — a monolith, a switchboard, a card index, a stopwatch. It cannot make
// flat vector, legible type, UI or logos without hallucinating them, and it
// cannot hold one flat style across twenty beats. Everything else is Remotion.
//
// The protagonist motif is the service tile: a slab in Act 1, a swarm in Act 2,
// a domain in Act 3. Same shape, three meanings.
//
// EP 08 lives in episodes/spotify-shuffle-randomness/Episode.tsx.

import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { buildPalette } from "../theme";
import { Timeline, totalFrames, type Beat } from "../lib/transitions";
import {
  Field, Stage, U, TopTag, Display, Sticker, PhotoCutout, PhotoCard, CityMap, GrowthGraph, inkOn, type ShapeKind,
  TraceWeb, TwoMonoliths, Shatter, ItWorked,
  Swarm, RootCause, HiddenCoupling, NetworkedMonolith, NoTurningBack,
  DomainCollapse, LayerRule, OneDoor, Payoff, HalfBuilt,
  DomaTitle, DomaChapter, DomaStatement, DomaEnd, DomaMark,
} from "../lib/ep09";
import cfg from "../../episode.config.json";
import durs from "../../vo-durations.json";

export const PAL = buildPalette(cfg.theme || "uber-dark");
const FPS = cfg.fps || 30;

/**
 * Scene length = its narration + a breath. The house breath is 0.35s: it only
 * has to cover the transition overlap and let the last word land. Pass a bigger
 * one deliberately — beats 12 and 20 earn a held silence.
 */
/**
 * 0.9s, not the house 0.35s. MEASURED: at 0.35 the VO starts 5 frames in and
 * ends with 0.17-0.20s of scene left on 18 of 20 beats — every trailing syllable
 * was landing on the cut, which is what made the flow feel choppy. The breath is
 * the one place to spend time; the pacing fix belongs in the content.
 */
const sec = (scene: number, breath = 0.9) => (durs[scene - 1] ?? 4) + breath;

/**
 * Every beat is: the flat field in this act's colour, then the hero object.
 * Keeping the field here rather than inside each scene is what stops the colour
 * drifting beat to beat.
 */
const Beat_: React.FC<{
  hue: string; seed: number; tag?: string; children: React.ReactNode;
  shape?: ShapeKind; shapeColor?: string; sparkle?: number;
}> = ({ hue, seed, tag, children, shape = "none", shapeColor, sparkle = 14 }) => (
  <AbsoluteFill>
    <Field hue={hue} seed={seed} shape={shape} shapeColor={shapeColor} sparkle={sparkle} />
    {tag && <TopTag color={inkOn(hue)}>{tag}</TopTag>}
    {children}
  </AbsoluteFill>
);

/* ── the beats ───────────────────────────────────────────────────────────── */

export const buildBeats = (): Beat[] => [
  // ACT 1 — THE ESCAPE (blue) ───────────────────────────────────────────────

  // 1 — COLD OPEN. One red origin in a mesh, and a trace that never stops
  // crawling. Never open on a slide.
  {
    seconds: sec(1), vo: 1, enter: "cut",
    node: (
      <Beat_ hue={U.cream} seed={1} sparkle={10} shape="disc" shapeColor={U.g100}>
        {/* One trip, running under the dependency mesh it actually touches. */}
        <CityMap road={U.g100} route={U.blue} cabs={1} opacity={0.95} />
        <TraceWeb pal={PAL} />
        <Sticker text="one bug" x={17} y={82} rotate={-3} delay={2} bg={U.cream} fg={U.ink} size={38} i={1} />
        <Sticker text="fifty services" x={20} y={91} rotate={2} delay={10} bg={U.pink} fg={U.ink} size={38} i={2} />
      </Beat_>
    ),
  },

  // 2 — TITLE, straight off the cold open.
  {
    seconds: sec(2), vo: 2, enter: "flash",
    node: (
      <Beat_ hue={U.cream} seed={2} shape="x" shapeColor={U.g100}>
        <DomaTitle kicker={`${cfg.series} · ${cfg.episode}`} title={cfg.title} accent={cfg.titleAccent} sub={cfg.subtitle} hue={U.cream} />
      </Beat_>
    ),
  },

  // 3 — CHAPTER SLATE. Act 1's photo cutout: the monolith itself.
  {
    seconds: sec(3), vo: 3, enter: "iris",
    node: (
      <Beat_ hue={U.ink} seed={3} sparkle={16}>
        <PhotoCutout src="cutouts/monolith.png" width={430} x={78} y={54} rotate={2} delay={2} i={1} />
        <DomaChapter n={1} title="The escape" hue={U.ink} />
      </Beat_>
    ),
  },

  // 4 — 2013. Two monoliths, and they are enormous.
  {
    seconds: sec(4), vo: 4, enter: "iris",
    node: (
      <Beat_ hue={U.cream} seed={4} tag="2013" shape="band" shapeColor={U.g100}>
        <PhotoCard src="cutouts/raw_roadmap.png" width={330} x={85} y={26} rotate={4} delay={4} i={1} />
        <TwoMonoliths pal={PAL} />
      </Beat_>
    ),
  },

  // 5 — CONTINUITY CUT. Same two slabs, same positions — now cracking. The
  // audience reads it as one continuous shot rather than a new scene.
  {
    seconds: sec(5), vo: 5, enter: "cut",
    // Same seed AND same band colour as beat 4 — this is a continuity cut, and a
    // background that changes colour across it destroys the illusion.
    node: <Beat_ hue={U.cream} seed={4} shape="band" shapeColor={U.g100}><TwoMonoliths pal={PAL} cracked /></Beat_>,
  },

  // 6 — THE BREAK-UP. The slabs fragment into independent services.
  {
    seconds: sec(6), vo: 6, enter: "zoom",
    node: <Beat_ hue={U.cream} seed={6} sparkle={18}><Shatter pal={PAL} /></Beat_>,
  },

  // 7 — AND IT WORKED. The part everyone forgets. Each service ships on its own
  // clock, so the screen keeps delivering for the whole beat.
  {
    seconds: sec(7), vo: 7, enter: "light-leak",
    node: (
      <Beat_ hue={U.sky} seed={7} sparkle={10}>
        {/* Six cabs and a rising curve: this is what "it worked" looked like.
            The route stays near-white — in yellow it was indistinguishable from
            the graph line sharing the frame. */}
        <CityMap road="#FFFFFF2A" route="#FFFFFF66" cabs={6} speed={1.5} opacity={0.9} />
        <Stage>
          <GrowthGraph color={U.yellow} grid="#FFFFFF88" label="services in production" />
        </Stage>
        <Sticker text="independent deploys" x={50} y={88} rotate={-1.5} delay={10} bg={U.green} fg={U.white} size={34} i={5} />
      </Beat_>
    ),
  },

  // ACT 2 — THE COST (red) ──────────────────────────────────────────────────

  // 8 — ACT BREAK. A hard stop is the point.
  {
    seconds: sec(8), vo: 8, enter: "dip-black",
    node: <Beat_ hue={U.ink} seed={8} sparkle={26}><DomaChapter n={2} title="The cost" hue={U.ink} /></Beat_>,
  },

  // 9 — 2,200. The number arrives on a crowd that is still filling in.
  {
    seconds: sec(9), vo: 9, enter: "iris",
    node: (
      <Beat_ hue={U.ink} seed={9} tag="2020" sparkle={0}>
        <PhotoCutout src="cutouts/skyline.png" width={1500} x={50} y={88} rotate={0} delay={2} i={9} />
        <Swarm pal={PAL} />
        <PhotoCutout src="cutouts/rack.png" width={280} x={88} y={57} rotate={2} delay={4} i={5} />
      </Beat_>
    ),
  },

  // 10 — WHAT ONE ROOT CAUSE COSTS. Fifty tiles light one at a time across the
  // beat — the counter is still counting when the narration lands.
  {
    seconds: sec(10), vo: 10, enter: "push-up",
    node: <Beat_ hue={U.ink} seed={10} tag="one root cause" sparkle={14} shape="disc" shapeColor={U.g700}><RootCause pal={PAL} /></Beat_>,
  },

  // 11 — THE ONES THAT ONLY LOOK INDEPENDENT.
  {
    seconds: sec(11), vo: 11, enter: "iris",
    node: <Beat_ hue={U.ink} seed={11} sparkle={20} shape="band" shapeColor={U.g800}><HiddenCoupling pal={PAL} /></Beat_>,
  },

  // 12 — THE STAMP. Act 2's photo cutout — a real switchboard is what a
  // networked monolith actually looks like. Earns a longer breath after it.
  {
    seconds: sec(12, 1.3), vo: 12, enter: "speed-ramp",
    node: (
      <Beat_ hue={U.ink} seed={12} sparkle={18} shape="x" shapeColor={U.g800}>
        <PhotoCutout src="cutouts/switchboard.png" width={520} x={80} y={62} rotate={-3} delay={4} i={2} />
        <NetworkedMonolith pal={PAL} />
      </Beat_>
    ),
  },

  // 13 — NO TURNING BACK. Uber's own words, and they're blunt.
  {
    seconds: sec(13), vo: 13, enter: "dip-black",
    node: <Beat_ hue={U.ink} seed={13} sparkle={16} shape="disc" shapeColor={U.cream}><NoTurningBack pal={PAL} /></Beat_>,
  },

  // ACT 3 — DOMAINS ─────────────────────────────────────────────────────────

  // 14 — Act 3's photo cutout: a card index is exactly what a domain is.
  {
    seconds: sec(14), vo: 14, enter: "light-leak",
    node: (
      <Beat_ hue={U.ink} seed={14} sparkle={16}>
        <PhotoCutout src="cutouts/cardindex.png" width={400} x={79} y={56} rotate={-2} delay={2} i={3} />
        <DomaChapter n={3} title="Domains" hue={U.ink} />
      </Beat_>
    ),
  },

  // 15 — THE TURN. 2,200 services fly into 70 domains; both counters run.
  {
    seconds: sec(15), vo: 15, enter: "iris",
    node: <Beat_ hue={U.sky} seed={15} sparkle={0}><DomainCollapse pal={PAL} /></Beat_>,
  },

  // 16 — THE ONE RULE. An illegal upward dependency is attempted and struck out.
  {
    seconds: sec(16), vo: 16, enter: "iris",
    node: <Beat_ hue={U.sky} seed={16} tag="five layers, one rule" sparkle={10}><LayerRule pal={PAL} /></Beat_>,
  },

  // 17 — ONE DOOR. Callers keep arriving at the gateway all beat long.
  {
    seconds: sec(17), vo: 17, enter: "push-up",
    node: (
      <Beat_ hue={U.sky} seed={17} tag="one door per domain" sparkle={10} shape="band" shapeColor="#FFFFFF1F">
        <OneDoor pal={PAL} />
        {/* Whose door it is: the rider, at the edge of the whole system. */}
        <PhotoCard src="cutouts/raw_phone.png" width={190} x={10} y={76} rotate={-6} delay={8} i={4} />
      </Beat_>
    ),
  },

  // 18 — THE PAYOFF, in Uber's real numbers, with the stopwatch.
  {
    seconds: sec(18), vo: 18, enter: "speed-ramp",
    node: (
      <Beat_ hue={U.cream} seed={18} tag="what it bought" shape="x" shapeColor={U.g100}>
        <PhotoCutout src="cutouts/stopwatch.png" width={230} x={12} y={26} rotate={-8} delay={6} i={4} />
        <Payoff pal={PAL} />
      </Beat_>
    ),
  },

  // 19 — THE HONEST LIMITATION. Half the grid never fills in.
  {
    seconds: sec(19), vo: 19, enter: "iris",
    node: <Beat_ hue={U.cream} seed={19} sparkle={12} shape="band" shapeColor={U.g100}><HalfBuilt pal={PAL} /></Beat_>,
  },

  // 20 — CLOSE. The thesis, then stop.
  {
    seconds: sec(20, 1.5), vo: 20, enter: "pull",
    node: (
      <Beat_ hue={U.cream} seed={20} shape="x" shapeColor={U.g100}>
        {/* Texture only — at full strength the route ran straight through the
            closing line and the CTA. */}
        <CityMap road={U.g100} route={U.blue} cabs={2} opacity={0.3} />
        <PhotoCutout src="cutouts/car.png" width={330} x={84} y={80} rotate={-2} delay={8} i={6} />
        <DomaEnd
          line="Microservices were never the mistake."
          accent="never"
          cta={cfg.cta}
          next={cfg.next}
          hue={U.cream}
        />
      </Beat_>
    ),
  },
];

export const BEATS = buildBeats();
export const DURATION = totalFrames(BEATS, FPS);

/* ── the composition ─────────────────────────────────────────────────────── */

export const Episode: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: U.cream }}>
    {/* LOCKED OFF. The director asked for still frames: no push, no pan, no
        drift. Every bit of motion now has to come from the content itself. */}
    <Timeline beats={buildBeats()} pal={PAL} voVolume={1} vo={cfg.audio?.vo !== false} camera={false} />
    {cfg.audio?.music !== false && (
      <Audio src={staticFile(cfg.music?.file || "audio/music/bed.mp3")} volume={cfg.music?.volume ?? 0.17} loop />
    )}
    {/* Series mark starts after the title card so it doesn't duplicate the kicker. */}
    <Sequence from={Math.round((sec(1) + sec(2)) * FPS)} layout="none" name="Series mark">
      <DomaMark series={cfg.series} episode={cfg.episode} hue={U.cream} />
    </Sequence>
  </AbsoluteFill>
);

// Vocabulary kept alive for the next scene — not dead code.
void [DomaStatement];
