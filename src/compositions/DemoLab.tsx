// Author: Bishakh
//
// THE WORKSPACE REGISTER, on its own — the fourth lab, after `TransitionGallery`
// (what a cut looks like), `MotifLab` (what the through-line looks like) and
// `SpaceLab` (what the world looks like).
//
// This one is a whole small film rather than a specimen sheet, because the
// register only exists in the JOINS: a cursor moving is nothing, a card
// recolouring is nothing, and the two twelve frames apart is the entire idea.
// You cannot check that on a still, so this composition is built to be watched.
//
// It is also the reference implementation. Twenty seconds, no footage, no
// narration, four cursors, one artifact — the shape described in
// `references/workspace-film.md`. Copy it and change the content; do not try to
// remember the timing offsets from prose.
//
// What you are checking when you scrub it:
//   - does every cursor move CAUSE something? (park the film on any second and
//     ask what each cursor is for; if the honest answer is "nothing", cut it)
//   - does the restyle read as a re-render, or as a slide changing?
//   - is the caret camera resolving the sentence at the same moment it resolves
//     the frame — or is one of them early?
//   - are the cursors in the margins, or are they sitting on the copy?
//
// Never rendered as output.

import React from "react";
import { AbsoluteFill, Easing, Sequence, interpolate, useCurrentFrame } from "remotion";
import { World, WorldItem, useTypeCam } from "../lib/space";
import { AgentCursors, StatusPill, PaletteBar, type Agent, type CursorKey } from "../lib/agents";
import { PromptBox, TaskStream, AppWindow, type Look } from "../lib/workspace";
import { HEAD, SANS } from "../fonts";
import { useK } from "../lib/anim";
import { PAL } from "./Episode";

export const DEMO_SECONDS = 20;
const FPS = 30;
const s = (n: number) => Math.round(n * FPS);

/* ── the cast ────────────────────────────────────────────────────────────── */
//
// Four, not seven. Each one owns exactly one visible change in the film, which
// is the test for whether a cursor has earned its place on the roster.

const HOST: Agent = { name: "Claude", color: "#D97757" };
const ANIMATOR: Agent = { name: "Animator", color: "#E8543F" };
const COLORIST: Agent = { name: "Colorist", color: "#E5459B" };
const SOUND: Agent = { name: "Sound", color: "#2E7DF6" };

/** The two designs the artifact lives in. Far apart on value, same layout. */
const CREAM: Look = { bg: "#EFE7D8", ink: "#1A1A1A", accent: "#E8543F", soft: "#1A1A1A", disc: 0.5 };
const NAVY: Look = { bg: "#141C2E", ink: "#F6F3EC", accent: "#F0A92B", soft: "#F0A92B", disc: 1 };

const HEADLINE = "Claude for motion graphics";

/* ── choreography ────────────────────────────────────────────────────────── */
//
// Absolute seconds, authored against the beats below. The `act: true` keys are
// the load-bearing ones — everything else is a cursor getting into position so
// that the act does not arrive from off-screen.

const CAST: { agent: Agent; keys: CursorKey[] }[] = [
  {
    agent: HOST,
    keys: [
      { at: 0, x: 58, y: 44 },
      { at: 2.6, x: 55, y: 40 },
      { at: 5.0, x: 63, y: 62, act: true },      // sends the prompt
      { at: 8.0, x: 30, y: 30 },
      { at: 13.0, x: 16, y: 52 },
      { at: 18.5, x: 20, y: 44 },
    ],
  },
  {
    agent: ANIMATOR,
    keys: [
      { at: 0, x: 20, y: 20, gone: true },
      { at: 8.4, x: 76, y: 26 },
      { at: 11.0, x: 71, y: 34, act: true },     // drops the headline in
      { at: 15.0, x: 79, y: 22 },
      { at: 18.0, x: 84, y: 40 },
    ],
  },
  {
    agent: COLORIST,
    keys: [
      { at: 0, x: 80, y: 80, gone: true },
      { at: 9.2, x: 24, y: 78 },
      { at: 13.4, x: 41, y: 17, act: true, say: "different palette" }, // picks the swatch
      { at: 16.5, x: 22, y: 66 },
      { at: 19.0, x: 16, y: 74 },
    ],
  },
  {
    agent: SOUND,
    keys: [
      { at: 0, x: 12, y: 60, gone: true },
      { at: 9.8, x: 14, y: 68 },
      { at: 12.6, x: 26, y: 86, act: true },     // lands the cue layer
      { at: 17.0, x: 18, y: 80 },
    ],
  },
];

/* ── the film ────────────────────────────────────────────────────────────── */

export const DemoLab: React.FC = () => {
  const pal = PAL;
  return (
    <AbsoluteFill style={{ background: pal.bg }}>
      {/* Beat 1 — the caret camera. Starts unreadably close, resolves at 3.2s. */}
      <Sequence from={0} durationInFrames={s(3.6)}>
        <ColdOpen />
      </Sequence>

      {/* Beat 2 — the prompt. The promise the rest of the film is judged against. */}
      <Sequence from={s(3.6)} durationInFrames={s(3.4)}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <PromptBox
            pal={pal}
            text="Make a launch video for my app"
            bold={["a launch video"]}
            start={4}
            cps={24}
            sendAt={s(1.4)}
          />
        </AbsoluteFill>
      </Sequence>

      {/* Beat 3 — the work, streaming. */}
      <Sequence from={s(7.0)} durationInFrames={s(3.6)}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <TaskStream
            pal={pal}
            start={4}
            every={13}
            items={[
              { label: "Animating graphics…", sub: "Kinetic type, spring reveals", hot: "Kinetic type", color: ANIMATOR.color },
              { label: "Designing sound…", sub: "Whooshes synced to every cut", hot: "Whooshes", color: SOUND.color },
              { label: "Matching your style…", sub: "Palette from your reference video", hot: "Palette", color: COLORIST.color },
            ]}
            footer="one skill · a full design team, in parallel"
          />
        </AbsoluteFill>
      </Sequence>

      {/* Beat 4 — the claim, and the artifact rising under it. */}
      <Sequence from={s(10.6)} durationInFrames={s(9.4)}>
        <Payoff />
      </Sequence>

      {/* The layers that survive every cut — mounted outside the beats, exactly
          as `MotifTrack` is. A cursor that restarts at a cut stops being a
          person, and the status pill is the film's state machine. */}
      <AgentCursors pal={pal} cast={CAST} />
      <Sequence from={s(6.4)} durationInFrames={s(9.4)} layout="none">
        <StatusPill pal={pal} label="Claude is rendering" x={22} y={88} color={HOST.color} />
      </Sequence>
      <Sequence from={s(15.8)} durationInFrames={s(4.2)} layout="none">
        <StatusPill pal={pal} label="Motion graphics finished" x={50} y={40} done />
      </Sequence>
    </AbsoluteFill>
  );
};

/** The cold open: one sentence, typed, with the camera falling back off it. */
const ColdOpen: React.FC = () => {
  const pal = PAL;
  const cam = useTypeCam({
    text: HEADLINE,
    world: { x: 0, y: 0, w: 3000 },
    start: 4,
    cps: 24,
    zoomIn: 8,
    zoomOut: 1,
    settle: 0.8,
  });
  const frame = useCurrentFrame();
  return (
    <World view={cam.view}>
      <WorldItem x={0} y={0} w={3000} h={340}>
        <div
          style={{
            fontFamily: HEAD,
            fontWeight: 800,
            fontSize: 250,
            letterSpacing: "-0.05em",
            color: pal.ink,
            whiteSpace: "nowrap",
            lineHeight: 1,
          }}
        >
          {cam.visible}
          <span style={{ opacity: cam.typing && frame % 26 < 15 ? 1 : 0, fontWeight: 400 }}>|</span>
        </div>
      </WorldItem>
    </World>
  );
};

/** The claim, then the artifact restyling under it while the cursors work. */
const Payoff: React.FC = () => {
  const pal = PAL;
  const frame = useCurrentFrame();
  const k = useK();

  // The whole beat scrolls upward as the artifact rises — one continuous canvas
  // travel, not a cut. The claim leaves the top exactly as the window arrives.
  const scroll = interpolate(frame, [s(0.6), s(3.0)], [0, -30], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.15, 1),
  });

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ translate: `0 ${scroll}%` }}>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "34%",
            translate: "-50% -50%",
            textAlign: "center",
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 68 * k,
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            color: pal.ink,
            opacity: interpolate(frame, [s(0.2), s(0.9)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          One skill turns Claude
          <br />
          into a full design team
        </div>

        <div style={{ position: "absolute", left: "50%", top: "96%", translate: "-50% -50%" }}>
          <AppWindow
            pal={pal}
            title="launch_v1 — live preview"
            headline="LAUNCH DAY"
            looks={[CREAM, NAVY]}
            // 13.4s absolute is the Colorist's act; this Sequence starts at
            // 10.6s, and the change trails the act by 0.2s so cause reads before
            // effect.
            changes={[{ at: 3.0, look: 1 }]}
            progress={0.42}
          />
        </div>
      </AbsoluteFill>

      {/* The swatch bar is the CAUSE, so it lives above the scroll, pinned where
          the Colorist can reach it. */}
      <Sequence from={s(2.2)} layout="none">
        <PaletteBar
          pal={pal}
          groups={[
            ["#EFE7D8", "#E8543F", "#8A8A8A", "#1A1A1A"],
            ["#141C2E", "#F0A92B", "#5B6C8F", "#F6F3EC"],
            ["#0F3D2E", "#7FD1A8", "#D9E8DF", "#0A0A0A"],
          ]}
          active={frame >= s(2.8) ? 1 : -1}
          x={50}
          y={17}
          scale={1.15}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
