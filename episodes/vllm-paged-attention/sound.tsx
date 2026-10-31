// Author: Bishakh
//
// SOUND DESIGN — placing the cue set from `sfx.mjs` against the picture.
//
// The premise: a motion graphic without sound is half a motion graphic. The eye
// reads an arrival as an EVENT only when the ear confirms it. That is the whole
// mechanism behind the videos that hold attention — not louder music, not more
// animation. A card lands and there is a tick. A counter runs and there are
// blips. A chapter turns and a whoosh arrives in a thunk. The audience never
// notices any of it; they notice that they didn't look away.
//
// Three rules, and they are the difference between sound design and noise:
//
//  1. EVERY CUE IS ATTACHED TO SOMETHING THAT MOVES. A sound with nothing on
//     screen to explain it is the single fastest way to sound cheap.
//  2. NOTHING COMPETES WITH THE VOICE. Cues sit at 0.2–0.5 and the bed ducks
//     under narration automatically (`Score`). If you can hear yourself mixing,
//     it's too loud.
//  3. SILENCE IS A CUE TOO. If every beat has sound, none of them land. The
//     two or three beats that carry the episode earn the sub and the riser;
//     the rest get a tick or nothing.

import React from "react";
import { Audio, Sequence, staticFile, useVideoConfig, interpolate } from "remotion";
import { useTimeline, type Beat, type EnterKind } from "./transitions";
import manifest from "../../public/audio/sfx/manifest.json";

export type CueName =
  | "tick" | "click" | "key1" | "key2" | "key3" | "key4"
  | "notify" | "success" | "error"
  | "whoosh" | "swipe" | "thunk" | "sub" | "riser" | "blip" | "latch";

const CUES = (manifest as any)?.cues ?? {};
/** A missing cue is a no-op, never a broken render — run `node sfx.mjs`. */
export const hasCue = (n: CueName) => Boolean(CUES[n]);
export const cueSeconds = (n: CueName): number => CUES[n]?.seconds ?? 0;
const cueFile = (n: CueName) => CUES[n]?.file ?? `audio/sfx/${n}.wav`;

/**
 * One cue, `at` frames into the current Sequence.
 *
 * House levels — start here and only come DOWN:
 *   tick / click / key   0.22–0.35   under everything, felt not heard
 *   blip                 0.14–0.20   there are dozens of them
 *   whoosh / swipe       0.30–0.45
 *   notify / latch       0.35–0.50
 *   thunk / sub          0.40–0.55   the weight cues; two or three an episode
 *   riser                0.30–0.40   and it must RESOLVE into something
 */
export const Cue: React.FC<{ name: CueName; at?: number; volume?: number }> = ({ name, at = 0, volume = 0.3 }) => {
  if (!hasCue(name)) return null;
  return (
    <Sequence from={at} layout="none" name={`SFX ${name}`}>
      <Audio src={staticFile(cueFile(name))} volume={volume} />
    </Sequence>
  );
};

/** Several cues in one beat: `[{ at: 8, name: "tick" }, …]`. */
export const Cues: React.FC<{ cues: { at: number; name: CueName; volume?: number }[] }> = ({ cues }) => (
  <>
    {cues.map((c, i) => (
      <Cue key={i} name={c.name} at={c.at} volume={c.volume ?? 0.3} />
    ))}
  </>
);

/**
 * Keystrokes under a type-on, at the same cadence `useTyped` reveals characters.
 *
 * Pass the SAME `start` and `cps` you gave `useTyped` or the sound drifts off
 * the picture, which is worse than no sound at all. `every` skips characters —
 * a key click on every one of 60 characters is a machine gun, and the ear reads
 * every second or third as continuous typing anyway.
 */
export const TypeCues: React.FC<{
  text: string; start?: number; cps?: number; every?: number; volume?: number; max?: number;
}> = ({ text, start = 7, cps = 55, every = 2, volume = 0.24, max = 40 }) => {
  const { fps } = useVideoConfig();
  const n = Math.min(Math.floor(text.replace(/\s/g, "").length / every), max);
  return (
    <>
      {Array.from({ length: n }).map((_, i) => (
        <Cue
          key={i}
          // rotate the four variants so it never machine-guns one sample
          name={(`key${(i % 4) + 1}`) as CueName}
          at={Math.round(start + ((i * every) / cps) * fps)}
          volume={volume}
        />
      ))}
    </>
  );
};

/**
 * Blips under a counter. `dur` should match the count-up's own length so the
 * last blip lands on the final digit.
 */
export const CountCues: React.FC<{ from?: number; dur: number; steps?: number; volume?: number }> = ({
  from = 0, dur, steps = 10, volume = 0.16,
}) => (
  <>
    {Array.from({ length: steps }).map((_, i) => (
      <Cue key={i} name="blip" at={Math.round(from + (dur * i) / steps)} volume={volume} />
    ))}
  </>
);

/* ── cues from the edit itself ───────────────────────────────────────────── */

/**
 * What each transition sounds like.
 *
 * The important entries are the EMPTY ones. A dissolve, a fade, a luma wipe and
 * a defocus are soft by definition — putting a whoosh on one is the classic
 * amateur move, because the sound says "something moved" while the picture says
 * "time passed". Silence is the correct cue there.
 */
const CUT_SOUND: Partial<Record<EnterKind, { name: CueName; volume: number }>> = {
  "push-up": { name: "whoosh", volume: 0.3 },
  "push-left": { name: "whoosh", volume: 0.3 },
  "push-right": { name: "whoosh", volume: 0.3 },
  push3d: { name: "whoosh", volume: 0.3 },
  cube: { name: "whoosh", volume: 0.32 },
  flip: { name: "swipe", volume: 0.28 },
  whip: { name: "swipe", volume: 0.4 },
  "speed-ramp": { name: "swipe", volume: 0.4 },
  wipe: { name: "whoosh", volume: 0.24 },
  "wipe-down": { name: "whoosh", volume: 0.24 },
  blinds: { name: "whoosh", volume: 0.22 },
  clock: { name: "tick", volume: 0.26 },
  iris: { name: "whoosh", volume: 0.2 },
  "circle-out": { name: "whoosh", volume: 0.2 },
  split: { name: "latch", volume: 0.3 },
  "barn-door": { name: "latch", volume: 0.28 },
  "mask-through": { name: "whoosh", volume: 0.24 },
  zoom: { name: "sub", volume: 0.34 },
  pull: { name: "sub", volume: 0.28 },
  "cross-zoom": { name: "swipe", volume: 0.36 },
  flash: { name: "thunk", volume: 0.42 },
  "dip-white": { name: "thunk", volume: 0.34 },
  "dip-black": { name: "thunk", volume: 0.34 },
  "film-burn": { name: "sub", volume: 0.34 },
  "light-leak": { name: "sub", volume: 0.26 },
  streak: { name: "swipe", volume: 0.3 },
  glitch: { name: "error", volume: 0.3 },
  "chroma-split": { name: "error", volume: 0.26 },
  displace: { name: "sub", volume: 0.24 },
  // deliberately silent: cut, fade, dissolve, luma-wipe, grain-dissolve,
  // halation, defocus
};

/**
 * A cue on every cut that deserves one, placed from the beat list.
 *
 * Render it as a SIBLING of `Timeline`, with the same beats, so the cues sit on
 * absolute frames and survive the overlaps:
 *
 *   <Timeline beats={BEATS} pal={PAL} />
 *   <CutCues beats={BEATS} />
 *
 * `gain` scales the whole layer at once — the one knob to turn when the edit
 * feels noisy. Try 0.7 before you start deleting cues.
 */
export const CutCues: React.FC<{ beats: Beat[]; gain?: number }> = ({ beats, gain = 1 }) => {
  const { starts } = useTimeline(beats);
  return (
    <>
      {beats.map((b, i) => {
        if (i === 0) return null;
        const s = CUT_SOUND[b.enter];
        if (!s) return null;
        // Two frames before the incoming scene starts: sound reaching the ear
        // slightly ahead of the picture is what makes a cut feel driven by the
        // sound rather than followed by it.
        return <Cue key={i} name={s.name} at={Math.max(0, starts[i] - 2)} volume={s.volume * gain} />;
      })}
    </>
  );
};

/* ── the score ───────────────────────────────────────────────────────────── */

/**
 * The music bed, ducked under the narration automatically.
 *
 * This is the fix for a score that sounds thin: the answer is not one louder
 * number, it is TWO. A flat 0.17 for the whole film is quiet under the voice
 * and far too quiet everywhere else, so the music never lifts — the title, the
 * montage and the end card all sound like the middle of a paragraph.
 *
 * Here the bed sits at `open` and drops to `under` while a line is playing,
 * with a `ramp`-frame slope either side. The film breathes: loud where nothing
 * is being said, out of the way where something is.
 *
 * Pass `vo` = the contents of `vo-durations.json`; the windows are derived from
 * the same layout `Timeline` uses, so they cannot drift out of sync with the
 * edit.
 */
export const Score: React.FC<{
  src: string; beats: Beat[]; vo: number[];
  open?: number; under?: number; ramp?: number; lead?: number;
  /**
   * Seconds to skip at the head of the bed.
   *
   * Generated scores usually fade IN, and a film's first silent beat — the
   * title — is exactly where the bed is supposed to lift to full. On EP11 those
   * two collided: the title measured -37.9dB because it sat in the track's own
   * intro. Start past the intro and the lift lands.
   */
  startAt?: number;
}> = ({ src, beats, vo, open = 0.34, under = 0.15, ramp = 10, lead = 5, startAt = 0 }) => {
  // 10 frames (~0.33s) each side: slow enough not to pump, fast enough that the
  // 0.9s gap between two lines actually opens. At 14 it measured barely 3dB of
  // lift in a real gap — the ramps ate the whole hole.
  const { fps } = useVideoConfig();
  const { starts } = useTimeline(beats);

  // [start, end] of every narration line, in absolute frames.
  const windows: [number, number][] = [];
  beats.forEach((b, i) => {
    if (b.vo == null) return;
    const d = vo[b.vo - 1];
    if (!d) return;
    windows.push([starts[i] + lead, starts[i] + lead + Math.round(d * fps)]);
  });

  return (
    <Audio
      src={staticFile(src)}
      startFrom={Math.round(startAt * fps)}
      loop
      volume={(f) => {
        let duck = 0;
        for (const [a, z] of windows) {
          if (f < a - ramp || f > z + ramp) continue;
          duck = Math.max(
            duck,
            f < a ? interpolate(f, [a - ramp, a], [0, 1])
            : f > z ? interpolate(f, [z, z + ramp], [1, 0])
            : 1,
          );
        }
        return open + (under - open) * duck;
      }}
    />
  );
};
