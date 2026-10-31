// Author: Bishakh
//
// ══ EP 12 — "The component that knew too much." ═════════════════════════════
//
// THE GEOGRAPHY IS THE ARGUMENT. Act one falls down a source file that will not
// end: the camera scrolls, and scrolls, and the monolith keeps going. Act three
// stops scrolling entirely, because the composed version fits on one screen.
// The camera behaviour IS the point being made, which is the same trick EP11
// used when it pushed into a single cache cell.
//
// THE CODE IS THE HERO. EP11 could teach with a diagram because memory is
// invisible. This episode is about an API, so the call site has to be legible:
// every readable thing is Remotion, and Kling supplies only the material under
// it (five stills, two clips, one prompt family).
//
// Teaching order, deliberately: name the failure, show the failing call site,
// define the pattern, show the composed call site, hand over the two gotchas
// everyone hits, say when NOT to reach for it, then close with our own
// unfinished migration as evidence rather than as the subject.
//
// EP 11 lives in episodes/vllm-paged-attention/Episode.tsx.

import React from "react";
import { AbsoluteFill, Easing, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { buildPalette } from "../theme";
import { Timeline, totalFrames, type Beat } from "../lib/transitions";
import { World, useView, type ViewKey } from "../lib/space";
import { CutCues, Cue, Score, CountCues } from "../lib/sound";
import { snapUp } from "../lib/tempo";
import { useField, type FieldKey } from "../lib/ep11";
import {
  E, Soft, Statement, Slate, TitleCard12, Mark, Surface, Shot, Head, Label, inkFor,
  CodeColumn, COLUMN, StateGrid, Tree, ThrowCard, Plate, EndCard12,
  CodeBlock, SYNTAX, Callout, FlyingProp, MeshField, DotGrid, Grain, SelectionFrame, GradText,
  CountUp, Wipe,
} from "../lib/ep12";
import cfg from "../../episode.config.json";
import durs from "../../vo-durations.json";

export const PAL = buildPalette(cfg.theme || "white-light");
const FPS = cfg.fps || 30;

const sec = (scene: number, breath = 0.35) => snapUp(((durs as number[])[scene - 1] ?? 4) + breath);
const bars = (n: number) => snapUp(n * 0.714 - 0.01);

/* ── the beats ───────────────────────────────────────────────────────────── */

export const buildBeats = (): Beat[] => [
  // 1 — COLD OPEN. One object with every mechanism deployed at once.
  {
    seconds: sec(1), vo: 1, enter: "cut",
    node: (
      <Shot id="ep12_open" dark>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", padding: "0 0 150px" }}>
          <div style={{ fontFamily: "Geist", fontWeight: 700, fontSize: 74, letterSpacing: "-0.04em", color: "#fff", textShadow: "0 18px 60px rgba(0,0,0,.7)" }}>
            It works. It is also finished.
          </div>
        </AbsoluteFill>
        <Cue name="sub" at={2} volume={0.3} />
      </Shot>
    ),
  },

  // 2 — TITLE. Silent, so the score opens.
  {
    seconds: bars(6), enter: "flash",
    node: (
      <>
        <TitleCard12 kicker={`${cfg.series} · ${cfg.episode}`} title={cfg.title} accent={cfg.titleAccent} sub={cfg.subtitle} />
        <Cue name="thunk" at={0} volume={0.42} />
      </>
    ),
  },

  // 3 — THE DOUBLING. The film's first argument, and it is arithmetic: four
  // flags is sixteen states, and only four of them were ever designed.
  {
    seconds: sec(2), vo: 2, enter: "cut",
    node: (
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 44 }}>
        <Label size={26} color={E.accent}>four booleans</Label>
        <div style={{ position: "relative" }}>
          <StateGrid delay={6} />
          <SelectionFrame delay={72} />
        </div>
        <div style={{ display: "flex", gap: 40, alignItems: "baseline" }}>
          <CountUp value="16" size={92} delay={56} dur={40} />
          <Label size={26}>reachable states · four you meant</Label>
        </div>
        {/* one blip per digit step, ending on the same frame the counter lands */}
        <CountCues from={56} dur={40} steps={16} volume={0.14} />
        <Cue name="notify" at={98} volume={0.34} />
      </AbsoluteFill>
    ),
  },

  // 4 — SIX HUNDRED LINES. The camera starts falling here and does not stop
  // until the chapter slate. Nothing else on screen: the scroll is the point.
  {
    seconds: sec(3), vo: 3, enter: "cut",
    node: (
      <AbsoluteFill style={{ alignItems: "flex-end", justifyContent: "flex-start", padding: "120px 130px 0 0" }}>
        <div style={{ textAlign: "right" }}>
          <CountUp value="~600" size={112} delay={14} dur={56} />
          <div style={{ marginTop: 14 }}><Label size={25}>lines · one component</Label></div>
        </div>
        <CountCues from={14} dur={56} steps={14} volume={0.12} />
        <Cue name="whoosh" at={8} volume={0.26} />
        <Cue name="notify" at={72} volume={0.3} />
      </AbsoluteFill>
    ),
  },

  // 5 — SLATE.
  { seconds: sec(4), vo: 4, enter: "cut", node: <Slate n={1} title="What breaks" /> },

  // 6 — THE FAILING CALL SITE. You cannot tell what this renders.
  {
    seconds: sec(5), vo: 5, enter: "cut",
    node: (
      <AbsoluteFill style={{ alignItems: "flex-start", justifyContent: "center", padding: "0 0 0 132px" }}>
        <CodeBlock
          file="composer.tsx"
          delay={2}
          highlight={1}
          highlightAt={78}
          width={1180}
          size={34}
          rows={[
            { toks: [{ t: "<", c: "punct" }, { t: "Composer", c: "tag" }] },
            { toks: [{ t: "isThread", c: "flag" }], indent: 1 },
            { toks: [{ t: "isDMThread", c: "flag" }], indent: 1 },
            { toks: [{ t: "isEditing", c: "flag" }], indent: 1 },
            { toks: [{ t: "isForwarding", c: "flag" }], indent: 1 },
            { toks: [{ t: "channelId", c: "text" }, { t: "={", c: "punct" }, { t: "id", c: "value" }, { t: "}", c: "punct" }], indent: 1 },
            { toks: [{ t: "dmId", c: "text" }, { t: "={", c: "punct" }, { t: "dmId", c: "value" }, { t: "}", c: "punct" }], indent: 1 },
            { toks: [{ t: "/>", c: "punct" }] },
          ]}
        />
        <Callout text="four flags, sixteen shapes" x={57} y={44} w={150} delay={86} />
        <div style={{ marginTop: 40 }}>
          <Label size={24}>the props describe branches, not a thing</Label>
        </div>
        <Cue name="tick" at={10} volume={0.24} />
        <Cue name="tick" at={22} volume={0.24} />
      </AbsoluteFill>
    ),
  },

  // 7 — SLATE. The field turns here; act two is where the answer lives.
  { seconds: sec(6), vo: 6, enter: "cut", node: <Slate n={2} title="Invert ownership" dark /> },

  // 8 — THE DEFINITION. The single most important beat in the episode: one
  // parent owns the state, the children read it, and the spine down the left
  // is context rather than props handed from one to the next.
  {
    seconds: sec(7), vo: 7, enter: "cut",
    node: (
      <AbsoluteFill style={{ alignItems: "flex-start", justifyContent: "center", padding: "0 0 0 140px" }}>
        <Tree
          dark
          delay={4}
          root="<Select>"
          children_={["<Select.Trigger>", "<Select.Content>", "<Select.Item>"]}
        />
        <div style={{ marginTop: 46 }}>
          <Label size={24} color={E.accent2}>one parent owns the state · children read it</Label>
        </div>
        {/* the protagonist: the flag we followed out of the monolith arrives
            here as state the parent owns */}
        <FlyingProp label="isEditing" from={[16, 78]} to={[62, 30]} delay={54} dur={38} />
        <Callout text="state lives here" x={64} y={30} w={140} delay={100} dark />
        <Cue name="latch" at={16} volume={0.3} />
        <Cue name="whoosh" at={56} volume={0.26} />
      </AbsoluteFill>
    ),
  },

  // 9 — SIBLING, NOT FLAG. The same tree, one piece longer. The monolith would
  // have grown a prop; this grew a neighbour.
  {
    seconds: sec(8), vo: 8, enter: "cut",
    node: (
      <AbsoluteFill style={{ alignItems: "flex-start", justifyContent: "center", padding: "0 0 0 140px" }}>
        <Tree
          dark
          delay={2}
          added={3}
          root="<Select>"
          children_={["<Select.Trigger>", "<Select.Content>", "<Select.Item>", "<Select.Group>"]}
        />
        <Cue name="click" at={40} volume={0.28} />
        <Cue name="notify" at={54} volume={0.3} />
      </AbsoluteFill>
    ),
  },

  // 10 — CONTROLLED VS UNCONTROLLED. One switch at the root, same API either
  // way, so the caller never has to pick a different component.
  {
    seconds: sec(9), vo: 9, enter: "cut",
    node: (
      <AbsoluteFill style={{ alignItems: "flex-start", justifyContent: "center", padding: "0 0 0 132px" }}>
        <CodeBlock
          file="select.tsx"
          dark
          delay={2}
          width={1260}
          size={34}
          highlight={2}
          highlightAt={74}
          rows={[
            { toks: [{ t: "const", c: "keyword" }, { t: " isControlled = ", c: "text" }, { t: "value", c: "value" }, { t: " !== ", c: "punct" }, { t: "undefined", c: "keyword" }] },
            { toks: [] },
            { toks: [{ t: "const", c: "keyword" }, { t: " open = isControlled", c: "text" }] },
            { toks: [{ t: "? ", c: "punct" }, { t: "value", c: "value" }, { t: "        // the caller owns it", c: "punct" }], indent: 1 },
            { toks: [{ t: ": ", c: "punct" }, { t: "local", c: "value" }, { t: "        // we do", c: "punct" }], indent: 1 },
          ]}
        />
        <Callout text="one switch, same api" x={60} y={74} w={140} delay={84} dark />
        <Cue name="tick" at={14} volume={0.24} />
      </AbsoluteFill>
    ),
  },

  // 11 — ORPHANED CHILDREN. Fail loud and local, naming the parent.
  {
    seconds: sec(10), vo: 10, enter: "cut",
    node: (
      <AbsoluteFill style={{ alignItems: "flex-start", justifyContent: "center", padding: "0 0 0 140px" }}>
        <ThrowCard dark delay={6} />
        <Cue name="error" at={12} volume={0.3} />
      </AbsoluteFill>
    ),
  },

  // 12 — THE COLLAPSE. Silent, and the mirror of EP11's re-pack: one slab
  // becomes discrete parts. Nothing got simpler; the states stopped existing.
  {
    seconds: bars(7), enter: "cut",
    node: (
      <AbsoluteFill>
        <Plate id="ep12_monolith" x={50} y={46} w={1180} delay={0} exitAt={30} exitFor={30} />
        <Plate id="ep12_pieces" x={50} y={46} w={1180} delay={44} />
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", padding: "0 0 118px" }}>
          <Head size={60}>Nothing got simpler.</Head>
        </AbsoluteFill>
        <Cue name="thunk" at={22} volume={0.46} />
        <Cue name="latch" at={48} volume={0.3} />
      </AbsoluteFill>
    ),
  },

  // 13 — WHEN NOT TO. The honest counterweight: slot shells need no context,
  // and reaching for the ceremony anyway is its own mistake.
  {
    seconds: sec(11), vo: 11, enter: "cut",
    node: (
      <AbsoluteFill style={{ alignItems: "flex-start", justifyContent: "center", padding: "0 0 0 132px" }}>
        <CodeBlock
          file="card.tsx"
          delay={2}
          width={1140}
          size={34}
          rows={[
            { toks: [{ t: "<", c: "punct" }, { t: "Card", c: "tag" }, { t: ">", c: "punct" }] },
            { toks: [{ t: "<", c: "punct" }, { t: "Card.Header", c: "tag" }, { t: " />", c: "punct" }], indent: 1 },
            { toks: [{ t: "<", c: "punct" }, { t: "Card.Title", c: "tag" }, { t: " />", c: "punct" }], indent: 1 },
            { toks: [{ t: "<", c: "punct" }, { t: "Card.Content", c: "tag" }, { t: " />", c: "punct" }], indent: 1 },
            { toks: [{ t: "<", c: "punct" }, { t: "Card.Footer", c: "tag" }, { t: " />", c: "punct" }], indent: 1 },
            { toks: [{ t: "</", c: "punct" }, { t: "Card", c: "tag" }, { t: ">", c: "punct" }] },
          ]}
        />
        <div style={{ marginTop: 40 }}>
          <Label size={24} color={E.accent}>named slots · no shared state · no context</Label>
        </div>
        <Cue name="tick" at={12} volume={0.22} />
      </AbsoluteFill>
    ),
  },

  // 14 — END CARD, with the mark.
  {
    seconds: sec(12), vo: 12, enter: "cut",
    node: <EndCard12 line="Composition is a default, not a refactor." accent="default" next={cfg.next} />,
  },
];

export const BEATS = buildBeats().map((b) => ({ ...b, node: <Soft>{b.node}</Soft> }));
// Alternating directions so no two consecutive joins move the same way. The
// two silent beats keep the soft dissolve, because a wipe on a held moment
// draws attention to the edit rather than to the beat.
const DIRS = ["left", "right", "left", "up", "right", "left", "right", "up", "left", "right", "left", "right", "up", "left"] as const;
const softened = (): Beat[] =>
  buildBeats().map((b, i) =>
    i === 1 || i === 11
      ? { ...b, node: <Soft>{b.node}</Soft> }
      : { ...b, node: <Wipe dir={DIRS[i % DIRS.length]}>{b.node}</Wipe> },
  );
export const DURATION = totalFrames(BEATS, FPS);

/* ── the continuous layers ───────────────────────────────────────────────── */

const startsOf = (beats: Beat[]) => {
  let t = 0;
  return beats.map((b) => { const s = t; t += b.seconds; return s; });
};
const S = startsOf(BEATS);

/**
 * The camera FALLS. From the head of the file to somewhere in its middle, and
 * it never reaches the end, because the file does not have one worth showing.
 * Then act two leaves the column behind entirely and the camera stops moving:
 * the composed version does not need to be travelled.
 */
const VIEW_KEYS: ViewKey[] = [
  { at: 0, x: 0, y: COLUMN.top - 40, zoom: 0.62 },
  { at: S[2], x: 0, y: COLUMN.top + 60, zoom: 0.60 },
  { at: S[3] - 0.4, x: 0, y: COLUMN.top + 190, zoom: 0.62 },
  { at: S[3] + 1.2, x: 0, y: COLUMN.top + 900, zoom: 0.64 },   // the fall
  { at: S[4] - 0.3, x: 0, y: COLUMN.top + 1750, zoom: 0.66 },
  { at: S[5] - 0.3, x: 0, y: COLUMN.top + 2280, zoom: 0.68 },
  { at: S[6], x: 0, y: COLUMN.top + 2600, zoom: 0.70 },
];

/** Paper for the failure, night for the pattern, paper again to close. */
const FIELD_KEYS: FieldKey[] = [
  { at: 0, bg: E.night, dark: true },
  { at: S[1], bg: E.paper, dark: false },
  { at: S[6] - 0.9, bg: E.paper, dark: false },
  { at: S[6], bg: E.night, dark: true },
  { at: S[11] - 0.9, bg: E.night, dark: true },
  { at: S[11], bg: E.paper, dark: false },
];

const WorldLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const view = useView(VIEW_KEYS);
  const { dark } = useField(FIELD_KEYS);

  // The column exists from the doubling beat until the second slate, then it is
  // gone for good. Leaving it faintly present under act three would undercut
  // the whole point, which is that you stop needing to scroll.
  const opacity = interpolate(
    t,
    [S[2] - 0.3, S[2] + 0.5, S[6] - 0.6, S[6] + 0.4],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.4, 0, 0.2, 1) },
  );
  // and it steps back under the beats that put type over it
  const annotation = interpolate(
    t,
    [S[2] - 0.3, S[2] + 0.3, S[3] - 0.3, S[3] + 0.3, S[4] - 0.3, S[4] + 0.3, S[5] - 0.3, S[5] + 0.3],
    [1, 0.0, 0.0, 1, 1, 0.16, 0.16, 0.10],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.4, 0, 0.2, 1) },
  );
  if (opacity <= 0.01) return null;
  return (
    <AbsoluteFill style={{ opacity: opacity * annotation }}>
      <World view={view}>
        <CodeColumn dark={dark} delay={Math.round(S[1] * fps)} />
      </World>
    </AbsoluteFill>
  );
};

/* ── the composition ─────────────────────────────────────────────────────── */

export const Episode: React.FC = () => {
  const { bg, dark } = useField(FIELD_KEYS);
  const frame = useCurrentFrame();
  const t = frame / FPS;
  return (
    <AbsoluteFill style={{ backgroundColor: bg }}>
      {/* atmosphere, studied from the reference film: a flowing colour field,
          a dot matrix that ties every beat together, and grain so the gradients
          do not band at 1080. */}
      <MeshField dark={dark} intensity={dark ? 1 : 0.5} />
      <DotGrid dark={dark} opacity={dark ? 0.42 : 0.26} />
      <Surface
        id={t >= S[13] ? "ep12_close" : dark ? "ep12_tex_dark" : "ep12_tex_paper"}
        dark={dark}
        opacity={dark ? 0.1 : 0.07}
      />
      <WorldLayer />
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
      <Sequence from={Math.round(S[2] * FPS)} layout="none" name="Series mark">
        <Mark series={cfg.series} episode={cfg.episode} dark={dark} />
      </Sequence>
      <Grain opacity={dark ? 0.05 : 0.032} />
    </AbsoluteFill>
  );
};
