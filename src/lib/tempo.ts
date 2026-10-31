// Author: Bishakh
//
// THE TEMPO GRID, on the picture side. One shared clock for the score and the
// edit, so cuts, camera moves and arrivals land ON the beat rather than near it.
//
// The grid comes from `tempo.mjs` (declared with --bpm, or detected from the
// bed) and lands in public/audio/music/tempo.json.
//
// THE RULE THAT MAKES THIS WORK: the voice is never moved to fit the music.
// Narration keeps its natural timing, and scene lengths are quantised UPWARD to
// the next beat or bar — so the line always finishes comfortably, the extra
// hold is at most one beat, and the cut still lands on the music. Quantising
// DOWN would clip narration, which is the one thing the grid must never do.
//
// If there is no tempo.json, every helper degrades to identity: a film without
// a grid still renders, it just isn't snapped.

import { useVideoConfig } from "remotion";
import tempo from "../../public/audio/music/tempo.json";

type Tempo = { bpm: number; offset: number; beatsPerBar: number; source?: string; confidence?: number };

const T = tempo as Tempo | null;

export const HAS_GRID = Boolean(T?.bpm);
export const BPM = T?.bpm ?? 0;
export const BEATS_PER_BAR = T?.beatsPerBar ?? 4;
/** Seconds per beat / per bar. */
export const BEAT_SEC = BPM ? 60 / BPM : 0;
export const BAR_SEC = BEAT_SEC * BEATS_PER_BAR;
/** Where the first beat sits in the bed, in seconds. */
export const GRID_OFFSET = T?.offset ?? 0;

/** Absolute time of beat `n` (0-based) — for authoring camera keys in beats. */
export const beatAt = (n: number) => GRID_OFFSET + n * BEAT_SEC;
/** Absolute time of bar `n` (0-based). Author act changes on these. */
export const barAt = (n: number) => GRID_OFFSET + n * BAR_SEC;

/**
 * Round a duration UP to the next grid line.
 *
 * This is the one function the edit actually runs through. Give it a scene
 * length derived from narration and it returns the nearest length that ends on
 * a beat (or a bar) — never shorter by more than `slack`.
 *
 * That caveat is deliberate, not a rounding accident. `slack` absorbs the case
 * where the length is already a hair PAST a grid line: without it, a scene
 * 0.004s over a beat gets a whole extra beat of dead air, which is precisely
 * the stall `pace.mjs` then flags. Since a scene is VO + a 0.35s breath, a trim
 * of up to 60ms comes out of the breath and never touches the voice.
 *
 * Snap to `"beat"` for scenes — it costs 0–0.6s each at 84bpm. Snap to `"bar"`
 * only for act breaks: on real narration it adds up to ~2.8s, which is a held
 * silence you had better have meant.
 */
export const snapUp = (seconds: number, to: "beat" | "bar" = "beat", slack = 0.06) => {
  const unit = to === "bar" ? BAR_SEC : BEAT_SEC;
  if (!unit) return seconds;
  const n = Math.ceil((seconds - slack) / unit);
  return Math.max(unit, n * unit);
};

/** Nearest grid line in either direction — for placing a cue, not a scene. */
export const snapNear = (seconds: number, to: "beat" | "bar" = "beat") => {
  const unit = to === "bar" ? BAR_SEC : BEAT_SEC;
  if (!unit) return seconds;
  return Math.round(seconds / unit) * unit;
};

/** The grid in frames, for anything that needs to count them. */
export const useTempo = () => {
  const { fps } = useVideoConfig();
  return {
    hasGrid: HAS_GRID,
    bpm: BPM,
    beatFrames: BEAT_SEC * fps,
    barFrames: BAR_SEC * fps,
    offsetFrames: GRID_OFFSET * fps,
    /** Which beat (0-based, fractional) an absolute frame falls on. */
    beatOf: (frame: number) => (BEAT_SEC ? (frame / fps - GRID_OFFSET) / BEAT_SEC : 0),
  };
};
