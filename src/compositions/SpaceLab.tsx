// Author: Bishakh
//
// THE SPACE, on its own — the third lab, after `TransitionGallery` (what a cut
// looks like) and `MotifLab` (what the through-line looks like).
//
// Scrub it to design the world BEFORE you build the episode in it: the layout
// of the nodes IS the argument, and it is much cheaper to move a node here than
// to re-time six beats around one that sits wrong.
//
// What you are checking:
//   - does every move have a DIRECTION? (a cut that goes left then right then
//     left reads as fidgeting, however smooth each move is)
//   - does the wide view actually read, or is it a diagram nobody can parse?
//   - at the closest zoom, is the node still on the grid — or has the camera
//     pushed past what the layout can support?
//
// Never rendered as output.

import React from "react";
import { AbsoluteFill } from "remotion";
import { World, Node, Wire, useView, type ViewKey } from "../lib/space";
import { Backdrop, TopEyebrow, Head } from "../lib/kit";
import { PAL } from "./Episode";

export const SPACE_SECONDS = 22;

/**
 * A move with a direction: start wide on the whole graph, walk it left to
 * right, then push all the way into the last node until it fills the frame.
 * Reading the zoom column top to bottom tells you the shape of the film.
 */
export const SPACE_KEYS: ViewKey[] = [
  { at: 0, x: 900, y: 120, zoom: 0.42 },
  { at: 3, x: 0, y: 0, zoom: 1 },
  { at: 7, x: 720, y: 60, zoom: 1 },
  { at: 11, x: 1450, y: 300, zoom: 1 },
  { at: 15, x: 2150, y: 180, zoom: 1.1 },
  { at: 19, x: 2150, y: 180, zoom: 3.4 },
  { at: 22, x: 2150, y: 180, zoom: 4.2 },
];

const NODES = [
  { x: 0, y: 0, w: 520, h: 320, label: "prompt", sub: "text" },
  { x: 720, y: 60, w: 520, h: 320, label: "text to image", sub: "step 01" },
  { x: 1450, y: 300, w: 520, h: 320, label: "image to 3d", sub: "step 02" },
  { x: 2150, y: 180, w: 560, h: 340, label: "image to video", sub: "step 03" },
];

export const SpaceLab: React.FC = () => {
  const view = useView(SPACE_KEYS);
  return (
    <AbsoluteFill style={{ background: PAL.bg }}>
      <Backdrop pal={PAL} />
      <World view={view}>
        {NODES.slice(0, -1).map((n, i) => (
          <Wire
            key={`w${i}`}
            pal={PAL}
            from={[n.x + n.w / 2, n.y]}
            to={[NODES[i + 1].x - NODES[i + 1].w / 2, NODES[i + 1].y]}
            delay={12 + i * 22}
            accent={i === NODES.length - 2}
          />
        ))}
        {NODES.map((n, i) => (
          <Node key={i} pal={PAL} {...n} delay={i * 14} selected={i === NODES.length - 1} accent={i === NODES.length - 1}>
            <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
              <Head pal={PAL} size={70} color={i === NODES.length - 1 ? PAL.bg : PAL.textMuted}>
                {String(i + 1).padStart(2, "0")}
              </Head>
            </AbsoluteFill>
          </Node>
        ))}
      </World>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: 80 }}>
        <TopEyebrow pal={PAL}>space lab · wide → walk → push through</TopEyebrow>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
