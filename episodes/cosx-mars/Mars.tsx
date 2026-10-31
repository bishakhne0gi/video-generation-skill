// Author: Bishakh
//
// COSX MARS — a launch film in the WORKSPACE register.
//
// 23 seconds, no footage, no narration. Built beat-for-beat against the
// reference in `references/workspace-film.md`: caret camera → prompt → the work
// streaming → the artifact transformed by named agents → wordmark.
//
// The whole thing holds together on one rule: every change on screen has a
// visible author, landing ~0.2s after the cursor that caused it. Read the
// ACTS table below before touching any timing — it is the film's spine, and
// moving a beat without moving its act breaks the causation the register runs
// on.
//
// Sound is not decoration here. With no voice, the cue layer IS the narration:
// it is what tells the eye that a thing just happened. Every cue below is
// attached to something that moves.

import React from "react";
import { AbsoluteFill, Audio, Easing, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { World, WorldItem, useTypeCam } from "../lib/space";
import { AgentCursors, StatusPill, PaletteBar, type Agent, type CursorKey } from "../lib/agents";
import { PromptBox, TaskStream, AppWindow, type Look } from "../lib/workspace";
import { Cue, TypeCues } from "../lib/sound";
import { buildPalette } from "../theme";
import { HEAD, MONO, SANS } from "../fonts";
import { useK, lerp } from "../lib/anim";

export const MARS_FPS = 30;
export const MARS_SECONDS = 23;
export const MARS_DURATION = MARS_SECONDS * MARS_FPS;
const s = (n: number) => Math.round(n * MARS_FPS);

export const MARS_PAL = buildPalette("mars-cream");

/* ── the film's spine ────────────────────────────────────────────────────────
 *
 * Beats 2–4 are stations on one strip (see `RIDE`), so the only cuts in the
 * film are into the strip at 4.0 and out of it at 19.4.
 *
 *  sec    what                       act                        effect (+0.2s)
 *  0.0    cold open, caret camera    MARS types                 the sentence
 *  4.0    station 0 · the prompt     MARS sends (5.9)           travel begins
 *  7.0    station 1 · the work       team arrives               three task lines
 * 10.5    station 2 · the claim      —                          —
 * 14.0    station 3 · the artifact   Animator (14.0)            headline lands
 *                                    Colorist (15.4)            design restyles
 *                                    Sound    (16.8)            cue marks land
 * 17.8    —                          —                          status → finished
 * 19.4    the wordmark               —                          —
 * ─────────────────────────────────────────────────────────────────────────── */

const T_PROMPT = 4.0;
/** Only the status pill and the cursor roster still key off these two; the
 *  strip's own schedule is `RIDE`. */
const T_WORK = 7.4;
const T_PAYOFF = 11.0;
const T_END = 19.4;

const ACT_SEND = 5.9;
const ACT_ANIMATOR = 14.0;
const ACT_COLORIST = 15.4;
const ACT_SOUND = 16.8;

/* ── the cast ────────────────────────────────────────────────────────────── */
//
// Five. Each owns exactly one visible change, which is the test for whether a
// cursor has earned a place on the roster. MARS itself takes the house accent,
// so the film's signature colour is also its protagonist.

const MARS: Agent = { name: "MARS", color: MARS_PAL.accent };
const ANIMATOR: Agent = { name: "Animator", color: "#E8543F" };
const COLORIST: Agent = { name: "Colorist", color: "#E5459B" };
const SOUND: Agent = { name: "Sound", color: "#2E7DF6" };
const TYPOGRAPHER: Agent = { name: "Typographer", color: "#7C4DFF" };

/** Two designs, far apart in VALUE, identical in layout — so the restyle reads
 *  as a decision rather than as a different file. */
const CLAY: Look = { bg: "#EDE4D6", ink: "#1A1613", accent: "#C1440E", soft: "#1A1613", disc: 0.5 };
const NIGHT: Look = { bg: "#171A24", ink: "#F6F1E8", accent: "#E8873B", soft: "#E8873B", disc: 1 };

const HEADLINE = "CosX MARS for motion graphics";

/* ── choreography ────────────────────────────────────────────────────────── */
//
// Absolute film seconds. Keys without `act` exist only so that a cursor is
// already in place when it acts — an actor that slides in and clicks in the
// same motion reads as an animation, not as a person.

const CAST: { agent: Agent; keys: CursorKey[] }[] = [
  {
    agent: MARS,
    keys: [
      { at: 0, x: 57, y: 43 },
      { at: 2.4, x: 54, y: 39 },
      { at: T_PROMPT + 0.6, x: 60, y: 38 },
      { at: ACT_SEND, x: 63, y: 61, act: true },
      { at: T_WORK + 0.8, x: 31, y: 30 },
      { at: T_PAYOFF + 1.6, x: 15, y: 50 },
      { at: T_END - 0.6, x: 19, y: 42 },
      { at: T_END + 1.0, x: 38, y: 66 },
      { at: T_END + 2.2, x: 46, y: 58 },
      { at: MARS_SECONDS, x: 41, y: 71 },
    ],
  },
  {
    agent: ANIMATOR,
    keys: [
      { at: 0, x: 78, y: 24, gone: true },
      { at: T_WORK + 0.7, x: 77, y: 26 },
      { at: T_PAYOFF + 1.2, x: 80, y: 30 },
      { at: ACT_ANIMATOR, x: 72, y: 36, act: true },
      { at: ACT_ANIMATOR + 2.4, x: 82, y: 24 },
      { at: T_END, x: 86, y: 34 },
      { at: T_END + 1.2, x: 68, y: 30 },
      { at: T_END + 2.6, x: 74, y: 24 },
    ],
  },
  {
    agent: COLORIST,
    keys: [
      { at: 0, x: 22, y: 76, gone: true },
      { at: T_WORK + 1.5, x: 24, y: 74 },
      { at: T_PAYOFF + 2.4, x: 30, y: 30 },
      { at: ACT_COLORIST, x: 41, y: 18, act: true, say: "different palette" },
      { at: ACT_COLORIST + 2.6, x: 22, y: 62 },
      { at: T_END + 0.8, x: 16, y: 70 },
      { at: T_END + 2.0, x: 27, y: 62 },
      { at: MARS_SECONDS, x: 21, y: 69 },
    ],
  },
  {
    agent: SOUND,
    keys: [
      { at: 0, x: 14, y: 62, gone: true },
      { at: T_WORK + 2.0, x: 15, y: 66 },
      { at: T_PAYOFF + 3.0, x: 22, y: 80 },
      { at: ACT_SOUND, x: 33, y: 84, act: true },
      { at: ACT_SOUND + 2.0, x: 19, y: 78 },
      { at: T_END + 1.0, x: 24, y: 84 },
      { at: T_END + 2.4, x: 33, y: 76 },
    ],
  },
  {
    agent: TYPOGRAPHER,
    keys: [
      { at: 0, x: 86, y: 68, gone: true },
      { at: T_PAYOFF + 2.0, x: 84, y: 66 },
      { at: ACT_ANIMATOR + 1.0, x: 88, y: 60 },
      { at: T_END + 0.4, x: 80, y: 72 },
      { at: T_END + 1.8, x: 71, y: 64 },
      { at: MARS_SECONDS, x: 77, y: 70 },
    ],
  },
];

/* ── the film ────────────────────────────────────────────────────────────── */

export const Mars: React.FC = () => {
  const pal = MARS_PAL;
  return (
    <AbsoluteFill style={{ background: pal.bg }}>
      {/* 1 — the cold open. Starts unreadably close; the sentence and the frame
             resolve together at ~3.3s. */}
      <Sequence from={0} durationInFrames={s(T_PROMPT)} name="1 · cold open">
        <ColdOpen />
      </Sequence>

      {/* 2–4 — ONE CANVAS. Prompt, the work, the claim and the artifact are
             four stations down a single strip, and the film travels between
             them instead of cutting. There is exactly one cut in the middle of
             this film (into the strip at 4.0s) and one out of it (19.4s).

             This is not a stylistic preference. Twelve separate screens leave
             the frame motionless whenever a beat has finished assembling, which
             `pace.mjs` reports honestly and the viewer feels as the film going
             slack; a strip is always either delivering content or travelling to
             the next thing. It is also the whole of what "everything connected"
             means in the reference — the viewer never re-orients because they
             never left. */}
      <Sequence from={s(T_PROMPT)} durationInFrames={s(T_END - T_PROMPT)} name="2–4 · the strip">
        <Strip />
      </Sequence>

      {/* 5 — the wordmark. */}
      <Sequence from={s(T_END)} durationInFrames={MARS_DURATION - s(T_END)} name="5 · wordmark">
        <EndCard />
      </Sequence>

      {/* The layers that survive every cut, mounted outside the beats — a cursor
          that restarts at a cut has stopped being a person, and the status pill
          is the film's state machine. */}
      <AgentCursors pal={pal} cast={CAST} />
      <Sequence from={s(T_WORK - 0.4)} durationInFrames={s(ACT_SOUND + 1.0 - T_WORK + 0.4)} layout="none">
        <StatusPill pal={pal} label="MARS is rendering" x={21} y={89} color={pal.accent} />
      </Sequence>
      <Sequence from={s(ACT_SOUND + 1.0)} durationInFrames={s(T_END - ACT_SOUND - 1.0)} layout="none">
        <StatusPill pal={pal} label="Motion graphics finished" x={50} y={40} done />
      </Sequence>

      <Track />
    </AbsoluteFill>
  );
};

/* ── beats ───────────────────────────────────────────────────────────────── */

/** The camera inside a letterform, falling back as the line types itself. */
const ColdOpen: React.FC = () => {
  const pal = MARS_PAL;
  const frame = useCurrentFrame();
  const cam = useTypeCam({
    text: HEADLINE,
    world: { x: 0, y: 0, w: 3180 },
    start: 6,
    cps: 15,
    zoomIn: 8.5,
    zoomOut: 1,
    settle: 0.85,
  });
  return (
    <AbsoluteFill>
      <World view={cam.view}>
        <WorldItem x={0} y={0} w={3180} h={340}>
          <div
            style={{
              fontFamily: HEAD,
              fontWeight: 800,
              fontSize: 232,
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
      {/* The eyebrow arrives only once the frame has resolved — before that
          there is nowhere on screen it could legibly sit. */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "31%",
          translate: "-50% -50%",
          fontFamily: MONO,
          fontSize: 22,
          letterSpacing: "0.3em",
          color: MARS_PAL.textMuted,
          opacity: interpolate(frame, [s(3.3), s(3.7)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        INTRODUCING
      </div>
    </AbsoluteFill>
  );
};

/**
 * THE STRIP — beats 2, 3 and 4 as four stations on one canvas.
 *
 * `STATIONS` is authored in percentages of the viewport, and the last gap is
 * deliberately short (72 rather than 100) so the claim is still leaving the top
 * of the frame as the artifact arrives from the bottom. Two things sharing the
 * frame for half a second is what makes a travel read as continuous rather than
 * as two slides with an animation between them.
 *
 * `RIDE` maps absolute film seconds to a station. Holds are where content
 * arrives; travels are ~1.1s, long enough to read as a move and short enough
 * that nobody is waiting for it.
 */
const STATIONS = [0, 100, 200, 272];

const RIDE: { at: number; station: number }[] = [
  { at: T_PROMPT, station: 0 },
  { at: ACT_SEND, station: 0 },
  { at: 7.0, station: 1 },
  { at: 9.4, station: 1 },
  { at: 10.5, station: 2 },
  { at: 12.6, station: 2 },
  { at: 14.0, station: 3 },
  { at: T_END, station: 3 },
];

const Strip: React.FC = () => {
  const pal = MARS_PAL;
  const frame = useCurrentFrame();
  const k = useK();
  const abs = T_PROMPT + frame / MARS_FPS;
  const local = (a: number) => a - T_PROMPT;

  const y = interpolate(
    abs,
    RIDE.map((r) => r.at),
    RIDE.map((r) => STATIONS[r.station]),
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      // Slow out, long settle — the same fluid-head curve `useView` uses. A
      // travel that starts and stops dead is the loudest tell of a computed
      // camera.
      easing: Easing.bezier(0.45, 0, 0.15, 1),
    },
  );

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ translate: `0 ${-y}%` }}>
        <Station offset={STATIONS[0]}>
          <PromptBox
            pal={pal}
            text="Make a launch video for my app"
            bold={["a launch video"]}
            start={6}
            cps={22}
            sendAt={s(local(ACT_SEND))}
          />
        </Station>

        <Station offset={STATIONS[1]}>
          <TaskStream
            pal={pal}
            start={s(local(7.0)) + 4}
            every={22}
            items={[
              { label: "Animating graphics…", sub: "Kinetic type, spring reveals", hot: "Kinetic type", color: ANIMATOR.color },
              { label: "Designing sound…", sub: "Whooshes synced to every cut", hot: "Whooshes", color: SOUND.color },
              { label: "Matching your style…", sub: "Palette from your reference video", hot: "Palette", color: COLORIST.color },
            ]}
            footer="one skill · a full design team, in parallel"
          />
        </Station>

        <Station offset={STATIONS[2]}>
          <div
            style={{
              textAlign: "center",
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 66 * k,
              lineHeight: 1.14,
              letterSpacing: "-0.03em",
              color: pal.ink,
              opacity: interpolate(frame, [s(local(10.4)), s(local(11.0))], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            One skill turns CosX MARS
            <br />
            into a full design team
          </div>
        </Station>

        <Station offset={STATIONS[3]}>
          <AppWindow
            pal={pal}
            title="launch_v1 — live preview"
            headline="LAUNCH DAY"
            looks={[CLAY, NIGHT]}
            headlineFrom={local(ACT_ANIMATOR) + 0.2}
            changes={[{ at: local(ACT_COLORIST) + 0.2, look: 1 }]}
            markersFrom={local(ACT_SOUND) + 0.2}
            // The preview is a VIDEO, so its playhead runs. A live preview that
            // is paused is the only static thing in a beat about work happening.
            progress={interpolate(frame, [s(local(14.2)), s(local(T_END))], [0.16, 0.74], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}
          />
        </Station>
      </AbsoluteFill>

      {/* The swatch bar is the CAUSE of the restyle, so it is pinned to the
          frame rather than to the strip — the Colorist has to be able to reach
          it while the canvas is still settling. */}
      <Sequence from={s(local(13.4))} layout="none">
        <PaletteBar
          pal={pal}
          groups={[
            ["#EDE4D6", "#C1440E", "#8A8175", "#1A1613"],
            ["#171A24", "#E8873B", "#5B6377", "#F6F1E8"],
            ["#123D33", "#7FD1A8", "#DCE9E2", "#0A0A0A"],
          ]}
          active={abs >= ACT_COLORIST + 0.2 ? 1 : -1}
          x={50}
          y={17}
          scale={1.15}
        />
      </Sequence>
    </AbsoluteFill>
  );
};

/** One full-frame stop on the strip. */
const Station: React.FC<{ offset: number; children: React.ReactNode }> = ({ offset, children }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      top: `${offset}%`,
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {children}
  </div>
);

/** The wordmark. One held frame, because the film has earned a breath. */
const EndCard: React.FC = () => {
  const pal = MARS_PAL;
  const frame = useCurrentFrame();
  const k = useK();
  const a = interpolate(frame, [0, s(0.5)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.2, 0, 0.1, 1),
  });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          fontFamily: HEAD,
          fontWeight: 800,
          fontSize: 118 * k,
          letterSpacing: "-0.05em",
          color: pal.ink,
        }}
      >
        {/* Word by word, not as a block. A two-word mark arriving as one object
            is the flattest possible last shot; eight frames apart, the eye reads
            "CosX" and then gets "MARS" as an arrival, which is the entire reason
            the accent sits on the second word. */}
        {["CosX", "MARS"].map((w, i) => (
          <span
            key={w}
            style={{
              display: "inline-block",
              marginRight: i === 0 ? "0.26em" : 0,
              color: i === 1 ? pal.accent : undefined,
              opacity: interpolate(frame, [i * 8, i * 8 + 11], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              translate: `0 ${interpolate(frame, [i * 8, i * 8 + 18], [30, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.2, 1, 0.3, 1),
              }) * k}px`,
            }}
          >
            {w}
          </span>
        ))}
      </div>
      {void a}
      {/* The rule draws across the whole hold rather than arriving with the
          wordmark. A held end card is the classic place a film goes dead — this
          keeps something arriving right up to the last frame, and it resolves
          exactly as the picture ends. */}
      <div
        style={{
          width: interpolate(frame, [s(0.5), s(3.2)], [0, 420 * k], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.25, 0, 0.15, 1),
          }),
          height: 2 * k,
          marginTop: 30 * k,
          background: pal.accent,
        }}
      />
      <div
        style={{
          marginTop: 26 * k,
          fontFamily: MONO,
          fontSize: 21 * k,
          letterSpacing: "0.22em",
          color: pal.textMuted,
          opacity: interpolate(frame, [s(1.5), s(2.1)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        ONE SKILL · A FULL DESIGN TEAM
      </div>
    </AbsoluteFill>
  );
};

/* ── the mix ─────────────────────────────────────────────────────────────── */

/**
 * With no narration, the cue layer IS the narration — it is what tells the eye
 * that something just happened, and without it the picture reads as a very
 * pretty screensaver.
 *
 * The bed therefore runs open the whole way with nothing to duck under, and it
 * has to BUILD, because it is carrying the arc a voice would have carried.
 * Every cue below is attached to something that moves; the two beats with no
 * cue at all (the caret settling, the wordmark hold) are silent on purpose —
 * if every beat has sound, none of them land.
 */
const Track: React.FC = () => (
  <>
    <Sequence from={0} durationInFrames={MARS_DURATION} layout="none" name="score">
      <Audio
        src={staticFile("audio/music/bed.wav")}
        volume={(f) =>
          interpolate(
            f,
            [0, s(1.2), s(T_END - 0.4), s(T_END + 0.8), MARS_DURATION - s(1.2), MARS_DURATION],
            [0, 0.34, 0.34, 0.42, 0.42, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
    </Sequence>

    {/* 1 — the line typing itself. */}
    <Sequence from={0} layout="none" name="cues · cold open">
      <TypeCues text={HEADLINE} start={6} cps={15} every={2} volume={0.16} />
    </Sequence>

    {/* 2 — the prompt, then the send. */}
    <Sequence from={s(T_PROMPT)} layout="none" name="cues · prompt">
      <TypeCues text="Make a launch video for my app" start={6} cps={22} every={2} volume={0.16} />
      <Cue name="click" at={s(ACT_SEND - T_PROMPT)} volume={0.4} />
      <Cue name="whoosh" at={s(ACT_SEND - T_PROMPT) + 3} volume={0.24} />
    </Sequence>

    {/* 3 — one tick per task line, on the stagger. */}
    <Sequence from={s(T_WORK)} layout="none" name="cues · the work">
      <Cue name="tick" at={5} volume={0.26} />
      <Cue name="tick" at={20} volume={0.26} />
      <Cue name="tick" at={35} volume={0.26} />
    </Sequence>

    {/* 4 — the acts. Each one is a cursor doing something, 0.2s before its
           effect, so the ear timestamps the CAUSE. */}
    <Sequence from={0} layout="none" name="cues · the acts">
      <Cue name="click" at={s(ACT_ANIMATOR)} volume={0.34} />
      <Cue name="latch" at={s(ACT_ANIMATOR) + 6} volume={0.3} />
      <Cue name="click" at={s(ACT_COLORIST)} volume={0.34} />
      <Cue name="blip" at={s(ACT_COLORIST) + 6} volume={0.2} />
      <Cue name="sub" at={s(ACT_COLORIST) + 6} volume={0.34} />
      <Cue name="click" at={s(ACT_SOUND)} volume={0.34} />
      {/* the cue marks landing one by one — the only place a stack of blips is
          honest, because there are six discrete things arriving */}
      {[0, 2, 4, 6, 8, 10].map((d, i) => (
        <Cue key={i} name="blip" at={s(ACT_SOUND) + 6 + d} volume={0.16} />
      ))}
      <Cue name="success" at={s(ACT_SOUND + 1.0)} volume={0.4} />
    </Sequence>

    {/* 5 — the wordmark gets weight, and then nothing. */}
    <Sequence from={s(T_END)} layout="none" name="cues · wordmark">
      <Cue name="thunk" at={2} volume={0.36} />
    </Sequence>
  </>
);
