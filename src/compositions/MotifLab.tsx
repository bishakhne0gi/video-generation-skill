// Author: Bishakh
//
// The continuity layer, on its own, in the episode's palette — the companion to
// `TransitionGallery`. Scrub it in `npm run studio` to design the motif BEFORE
// you wire it into the film, because a protagonist that reads as a stray dot is
// worse than no protagonist at all.
//
// What you are looking for:
//   - can you follow the dot without being told to?
//   - do the state changes (travelling → blocked → resolved) read as a change,
//     or just as a colour?
//   - does the lattice stay under the perceptual floor, or does it pull focus?
//   - does the ticker read as real, or as filler?
//
// Copy the keyframes you like into the composition. Never rendered as output.

import React from "react";
import { AbsoluteFill } from "remotion";
import { MotifTrack, Thread, Lattice, Ticker, type MotifKey } from "../lib/motifs";
import { Backdrop, TopEyebrow } from "../lib/kit";
import { PAL } from "./Episode";

export const LAB_SECONDS = 24;

/**
 * A journey with the shape a real episode has: idle at the edge, travelling
 * into the system, blocked at the problem, moving again, resolved on the payoff.
 * Times are ABSOLUTE seconds — in a real episode you read them off the scene
 * windows `pace.mjs` prints.
 */
export const LAB_KEYS: MotifKey[] = [
  { at: 0, x: 8, y: 76, state: "idle" },
  { at: 3, x: 22, y: 62, state: "travelling" },
  { at: 7, x: 44, y: 48 },
  { at: 10, x: 52, y: 44, state: "blocked", scale: 1.35 },
  { at: 14, x: 52, y: 44 },
  { at: 17, x: 72, y: 32, state: "travelling", scale: 1 },
  { at: 21, x: 88, y: 22, state: "resolved", scale: 1.2 },
  { at: 24, x: 92, y: 20 },
];

export const MotifLab: React.FC = () => (
  <AbsoluteFill style={{ background: PAL.bg }}>
    <Backdrop pal={PAL} />
    <Lattice pal={PAL} active={0.3} opacity={0.55} />
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: 90 }}>
      <TopEyebrow pal={PAL}>motif lab · idle → travelling → blocked → resolved</TopEyebrow>
    </AbsoluteFill>
    <Thread pal={PAL} from={1} to={LAB_SECONDS - 2} />
    <Ticker
      pal={PAL}
      items={["GET /v1/orders 200 12ms", "queue.depth=1840", "consumer-lag 2.4s", "retry after 500ms", "shard 07 rebalanced"]}
      y={86}
    />
    <MotifTrack pal={PAL} keys={LAB_KEYS} label="request" />
  </AbsoluteFill>
);
