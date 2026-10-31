// Author: Bishakh
//
// ══ EP 11 — "Your chatbot doesn't stutter because of a trick from 1962." ═════
//
// THE FIRST TRAVELLED EPISODE. There is one world — a 40GB memory bar — and the
// camera lives inside it for the whole film. The world and the field are
// rendered OUTSIDE `Timeline`, so they run on absolute frames and no cut can
// interrupt them; the beats are annotation layers over a picture that never
// stops moving. That is why twelve of the fourteen `enter`s are `cut`: there is
// nothing to transition between when the camera is already mid-move.
//
// The two that aren't are the only two places continuity BREAKS on purpose —
// `flash` into the title, and `dip-black` into the honest limitation. An accent
// means something here precisely because the other twelve cuts are invisible.
//
// Three continuous layers, all keyed on absolute seconds:
//   1. the CAMERA   (`useView`) — wide, walk, push through
//   2. the FIELD    (`useField`) — the value arc: paper → night → paper
//   3. the WORLD    — the bar, its cells, the block table
//
// Everything is on the tempo grid: 84bpm, beat 0.714s. Scene lengths are
// snapped UP to the next musical beat, so the voice always finishes and the cut
// still lands on the music (see src/lib/tempo.ts).
//
// EP 10 lives in episodes/zomato-nye-scale/Episode.tsx.

import React from "react";
import { AbsoluteFill, Easing, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { buildPalette } from "../theme";
import { Timeline, totalFrames, useTimeline, type Beat } from "../lib/transitions";
import { World, useView, ScaleFrom, type ViewKey } from "../lib/space";
import { CutCues, Cue, Score, CountCues } from "../lib/sound";
import { snapUp } from "../lib/tempo";
import {
  E, useField, type FieldKey, MemoryBar, CACHE_MID, REGION, BAR,
  BlockTable, Figure, WasteList, Statement, Slate, TitleCard, EndCard, Mark, TokenCell,
  Shot, Surface, OverLine, Label, Head, TokenStream, CacheFill, PackSweep, PayoffCard, Soft,
} from "../lib/ep11";
import cfg from "../../episode.config.json";
import durs from "../../vo-durations.json";

export const PAL = buildPalette(cfg.theme || "white-light");
const FPS = cfg.fps || 30;

/**
 * Scene length = narration + a breath, rounded UP to the next musical beat.
 *
 * The snap costs 0–0.6s a scene at 84bpm and buys every cut landing on the
 * music. It is never allowed to round DOWN past the breath, so the voice always
 * finishes inside its own scene.
 */
const sec = (scene: number, breath = 0.35) => snapUp(((durs as number[])[scene - 1] ?? 4) + breath);
/** A silent beat, measured in musical beats rather than in speech. */
const bars = (n: number) => snapUp(n * 0.714 - 0.01);

/* ── the beats ───────────────────────────────────────────────────────────── */

export const buildBeats = (): Beat[] => [
  // ACT 1 — WHAT IT COSTS ────────────────────────────────────────────────────

  // 1 — COLD OPEN. Outside the world: the physical thing, before any diagram.
  {
    seconds: sec(1), vo: 1, enter: "cut",
    node: (
      <Shot id="ep11_open" dark>
        <OverLine text="It isn't thinking. It's waiting." delay={14} />
        <Cue name="sub" at={2} volume={0.3} />
      </Shot>
    ),
  },

  // 2 — TITLE. Silent, so the score opens to full for the only time in act 1.
  // The one accent transition of the first half.
  {
    seconds: bars(6), enter: "flash",
    node: (
      <>
        <TitleCard kicker={`${cfg.series} · ${cfg.episode}`} title={cfg.title} accent={cfg.titleAccent} sub={cfg.subtitle} />
        <Cue name="thunk" at={0} volume={0.42} />
      </>
    ),
  },

  // 3 — THE PROBLEM. The world arrives underneath this line, wide.
  {
    seconds: sec(2), vo: 2, enter: "cut",
    node: <Statement text="A GPU runs out of memory, not maths." accent="memory" />,
  },

  // 4 — WHAT ONE TOKEN COSTS. The camera is pushing into a single cache cell
  // while this figure counts up — the number and the geography are the same
  // fact stated twice.
  {
    seconds: sec(3), vo: 3, enter: "cut",
    node: (
      <AbsoluteFill style={{ alignItems: "flex-end", justifyContent: "flex-end", padding: "0 140px 205px" }}>
        <Figure value="800" unit="KB per token" caption="thirteen billion parameters · two bytes · forty layers" delay={125} />
        <CountCues from={72} dur={30} steps={8} />
        <Cue name="notify" at={104} volume={0.34} />
      </AbsoluteFill>
    ),
  },

  // 5 — SLATE.
  { seconds: sec(4), vo: 4, enter: "cut", node: <Slate n={1} title="The cache" /> },

  // 6 — THE MEMORY MAP. Camera pulls out; the bar is finally seen whole.
  {
    seconds: sec(5), vo: 5, enter: "cut",
    node: (
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", padding: "120px 0 0" }}>
        <Label size={26} color={E.accent}>forty gigabytes · one card</Label>
        <Cue name="tick" at={6} volume={0.26} />
      </AbsoluteFill>
    ),
  },

  // ACT 2 — WHERE IT GOES ────────────────────────────────────────────────────
  // The field goes to night here. Same world, different light.

  // 7 — THE THREE WASTES. The cells are ragged BY CONSTRUCTION: the layout is
  // the citation, and the percentage printed under the bar is counted off the
  // cells actually drawn.
  {
    seconds: sec(6), vo: 6, enter: "cut",
    node: (
      <AbsoluteFill style={{ alignItems: "flex-start", justifyContent: "center", padding: "0 0 0 116px" }}>
        <WasteList dark delay={8} />
        <Cue name="tick" at={10} volume={0.24} />
        <Cue name="tick" at={22} volume={0.24} />
        <Cue name="tick" at={34} volume={0.24} />
      </AbsoluteFill>
    ),
  },

  // 8 — SLATE.
  { seconds: sec(7), vo: 7, enter: "cut", node: <Slate n={2} title="The trick" dark /> },

  // ACT 3 — THE TRICK ────────────────────────────────────────────────────────

  // 9 — PAGING. The block table draws itself; the wires ARE the explanation.
  {
    seconds: sec(8), vo: 8, enter: "cut",
    node: (
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", padding: "110px 0 0" }}>
        <Label size={26} color={E.accent}>paging · nineteen sixty two</Label>
        <Cue name="click" at={20} volume={0.26} />
        <Cue name="click" at={32} volume={0.26} />
      </AbsoluteFill>
    ),
  },

  // 10 — SHARING. Two answers, one prompt, shared blocks until they differ.
  {
    seconds: sec(9), vo: 9, enter: "cut",
    node: (
      <AbsoluteFill style={{ alignItems: "flex-start", justifyContent: "flex-end", padding: "0 0 195px 140px" }}>
        <Figure value="55" unit="% memory saved" caption="copy on write · up to 2.2× throughput" delay={12} />
        <CountCues from={14} dur={26} steps={7} />
      </AbsoluteFill>
    ),
  },

  // 11 — THE RE-PACK. THE SIGNATURE MOVE, and the only wholly silent beat:
  // nothing was added and nothing got faster, the blocks just stopped being
  // wasted. One thunk under it, and the score lifts to full.
  {
    seconds: bars(6), enter: "cut",
    node: (
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", padding: "0 0 130px" }}>
        <Head size={62}>Nothing got faster.</Head>
        <Cue name="thunk" at={16} volume={0.46} />
        <Cue name="latch" at={40} volume={0.3} />
      </AbsoluteFill>
    ),
  },

  // 12 — THE PAYOFF. `ScaleFrom` pushes the shot up out of the cache region
  // until it fills the frame, with the figures still overlaid — the strongest
  // move this register has.
  {
    seconds: sec(10), vo: 10, enter: "cut",
    node: (
      <ScaleFrom rect={{ x: 38, y: 40, w: 24, h: 20 }} dur={26}>
        <Shot id="ep11_payoff" dark>
          <PayoffCard
            eyebrow="the result"
            value="2–4"
            unit="×"
            sub="throughput, at the same latency"
            source="Against FasterTransformer and Orca · SOSP 2023"
            note="Twenty four times against HuggingFace Transformers, which is not a serving system."
          />
          <Cue name="success" at={18} volume={0.4} />
        </Shot>
      </ScaleFrom>
    ),
  },

  // 13 — THE CATCH. The second and last accent: the film breaks its own
  // continuity exactly where the argument turns honest.
  {
    seconds: sec(11), vo: 11, enter: "dip-black",
    node: <Statement text="Paging buys memory, not intelligence." accent="intelligence" dark />,
  },

  // 14 — END CARD.
  {
    seconds: sec(12), vo: 12, enter: "cut",
    node: <EndCard line="Memory was the bottleneck." accent="bottleneck" cta={cfg.cta} next={cfg.next} />,
  },
];

/**
 * Every beat's annotation wrapped so it dissolves in and out inside its own
 * length. The cuts stay frame-exact; only the type crossfades.
 */
const softened = (): Beat[] => buildBeats().map((b) => ({ ...b, node: <Soft>{b.node}</Soft> }));

export const BEATS = softened();
export const DURATION = totalFrames(BEATS, FPS);

/* ── the continuous layers ───────────────────────────────────────────────── */

/** Cumulative start of beat `i`, in seconds — for keying the camera and field. */
const startsOf = (beats: Beat[]) => {
  let t = 0;
  return beats.map((b) => { const s = t; t += b.seconds; return s; });
};
const S = startsOf(BEATS);

/**
 * The camera. Every move has a direction: wide on the whole card, in to one
 * cell, out to the bar, along it into the waste, then the block table, then out
 * for the re-pack. Nothing doubles back.
 */
const VIEW_KEYS: ViewKey[] = [
  // "Arrive, then CRAWL" — not "arrive, then hold".
  //
  // The first cut used hard holds (a position stated twice, identically) and
  // measured 61% static: with the content finished arriving and the camera
  // stopped dead, the frame is genuinely motionless. A travelled canvas does
  // not save you from that, it just moves the stall into the holds.
  //
  // So every hold continues a little — a few percent of zoom, a hundred world
  // units in the direction of travel. This is NOT the banned drift: that rule
  // bans motion laid on a static composition, where the move means nothing.
  // Here the camera is still crossing a real space, and slowing to a crawl
  // instead of to zero is what a dolly actually does.
  { at: 0, x: 0, y: 0, zoom: 0.44 },
  { at: S[2], x: -160, y: -300, zoom: 0.45 },   // bar low; the statement owns the middle
  { at: S[3] + 0.8, x: -40, y: -300, zoom: 0.49 },        // crawl
  { at: S[3] + 2.2, x: 700, y: -40, zoom: 1.55 },
  { at: S[4] - 0.4, x: 760, y: -40, zoom: 1.62 },  // crawl
  { at: S[5] - 0.6, x: -40, y: 0, zoom: 0.45 },
  { at: S[6] - 0.5, x: 60, y: 0, zoom: 0.485 },        // crawl across the map
  { at: S[6] + 1.6, x: 546, y: 0, zoom: 0.90 },   // cache to the RIGHT half; list owns the left
  { at: S[7] + 0.4, x: 280, y: 0, zoom: 0.92 },   // crawl along the waste
  { at: S[8] + 0.6, x: CACHE_MID, y: -60, zoom: 0.92 },
  { at: S[9] - 0.3, x: CACHE_MID + 30, y: -40, zoom: 0.95 }, // crawl
  { at: S[9] + 1.2, x: CACHE_MID, y: 165, zoom: 0.92 },
  { at: S[10] - 0.3, x: CACHE_MID + 30, y: 180, zoom: 0.95 },  // crawl
  { at: S[10] + 0.9, x: -30, y: 0, zoom: 0.45 },
  { at: S[11] - 0.3, x: 40, y: 0, zoom: 0.48 },        // crawl over the re-pack
  { at: S[11] + 1.0, x: CACHE_MID - 160, y: 0, zoom: 1.45 },
  { at: S[13], x: 0, y: 0, zoom: 0.43 },
];

/** The value arc. Act two is a change of LIGHT, not a change of slide. */
const FIELD_KEYS: FieldKey[] = [
  { at: 0, bg: E.night, dark: true },
  { at: S[1], bg: E.paper, dark: false },
  { at: S[6] - 0.7, bg: E.paper, dark: false },
  { at: S[6], bg: E.night, dark: true },
  { at: S[8] - 0.7, bg: E.night, dark: true },
  { at: S[8], bg: E.paper, dark: false },
  { at: S[12] - 0.5, bg: E.paper, dark: false },
  { at: S[12], bg: E.night, dark: true },
  { at: S[13], bg: E.paper, dark: false },
];

/** Which state the bar is in, as a function of absolute time. */
const phaseAt = (t: number) =>
  t >= S[10] ? "packed" : t >= S[6] ? "waste" : t >= S[5] ? "cache" : "cache";

const WorldLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const view = useView(VIEW_KEYS);
  const { dark } = useField(FIELD_KEYS);

  // The world is not visible under the cold open or the title, and it steps
  // aside for the full-bleed payoff. Faded, never cut — this layer is the one
  // thing in the film that must never appear to restart.
  const opacity = interpolate(
    t,
    [S[2] - 0.25, S[2] + 0.55, S[11] - 0.4, S[11] + 0.6],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  // Annotation beats DIM the world rather than covering it with a card. A plate
  // over a travelled canvas hides the one thing that makes it worth watching;
  // dropping the world to a third keeps every packet visible and still gives
  // the type its contrast. Ramped, never stepped, so it reads as light changing.
  const annotation = interpolate(
    t,
    [S[2] - 0.5, S[2] + 0.2,   // beat 3  statement  -> type owns the frame
     S[3] - 0.4, S[3] + 0.4,   // beat 4  the token  -> world matters again
     S[4] - 0.4, S[4] + 0.3,   // beat 5  slate      -> type only
     S[5] - 0.4, S[5] + 0.3,   // beat 6  the map    -> world is the subject
     S[7] - 0.4, S[7] + 0.3,   // beat 8  slate      -> type only
     S[8] - 0.4, S[8] + 0.3],  // beats 9-10 table   -> world is the subject
    [1, 0.20, 0.20, 0.85, 0.85, 0.12, 0.12, 1, 1, 0.12, 0.12, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.4, 0, 0.2, 1) },
  );
  if (opacity <= 0.01) return null;

  const showTable = t >= S[8] - 0.5 && t < S[10];
  // Beat 4 pushes into the cache to show what ONE token costs. Without
  // something at that address the camera arrives on an empty rectangle, so the
  // first cell is drawn early and selected — it is also the cell the later
  // waste layout starts from, so the geography stays true.
  const showToken = t >= S[3] + 1.4 && t < S[5];
  return (
    <AbsoluteFill style={{ opacity: opacity * annotation }}>
      <World view={view}>
        <MemoryBar
          phase={phaseAt(t) as any}
          dark={dark}
          delay={Math.round(S[2] * fps)}
          dim={showTable ? 0.22 : 1}
        />
        {/* never finishes — the world's guarantee against a dead hold */}
        {t < S[6] && <TokenStream dark={dark} count={20} />}
        {showTable && <BlockTable dark={dark} delay={Math.round((S[8] - 0.5) * fps)} shared={t >= S[9]} />}
        {showToken && <TokenCell dark={dark} />}
        {/* the cache filling — large-scale motion for the wide beats */}
        {t < S[6] && <CacheFill dark={dark} />}
        {t >= S[10] && t < S[11] && <PackSweep delay={Math.round((S[10] + 1.9) * fps)} />}
      </World>
    </AbsoluteFill>
  );
};

/* ── the composition ─────────────────────────────────────────────────────── */

export const Episode: React.FC = () => {
  const { bg, dark } = useField(FIELD_KEYS);
  return (
    <AbsoluteFill style={{ backgroundColor: bg }}>
      {/* the act's surface — real grain and moving light under the vectors */}
      {/* the closing beat has its own surface — the film has stopped arguing */}
      <Surface
        id={useCurrentFrame() / FPS >= S[13] ? "ep11_close" : dark ? "ep11_tex_dark" : "ep11_tex_paper"}
        dark={dark}
        opacity={useCurrentFrame() / FPS >= S[13] ? 0.14 : undefined}
      />
      <WorldLayer />
      {/* transparent: the beats annotate the world, they do not replace it */}
      <Timeline beats={softened()} pal={PAL} voVolume={1} vo={cfg.audio?.vo !== false} transparent />
      {cfg.audio?.sfx !== false && <CutCues beats={buildBeats()} gain={cfg.audio?.sfxGain ?? 1} />}
      {cfg.audio?.music !== false && (
        <Score
          src={cfg.music?.file || "audio/music/bed.mp3"}
          beats={buildBeats()}
          vo={durs as number[]}
          open={cfg.music?.open ?? 0.34}
          under={cfg.music?.volume ?? 0.15}
          startAt={cfg.music?.startAt ?? 0}
        />
      )}
      <Sequence from={Math.round((S[2]) * FPS)} layout="none" name="Series mark">
        <Mark series={cfg.series} episode={cfg.episode} dark={dark} />
      </Sequence>
    </AbsoluteFill>
  );
};

void BAR;
