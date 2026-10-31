// Author: Bishakh
//
// THE MARQUEE GESTURE, on its own — drag a box, hold, push into it, pull back.
//
// Scrub it to tune the four phase lengths before wiring the move into a beat.
// The one you will get wrong is `hold`: at 0 the box and the push read as a
// single event and the viewer never registers that a CHOICE was made, which is
// the entire value of the gesture over a plain camera push.
//
// Never rendered as output.

import React from "react";
import { AbsoluteFill } from "remotion";
import { MarqueeZoom, type Agent } from "../lib/agents";
import { buildPalette } from "../theme";
import { HEAD, MONO } from "../fonts";

export const MARQUEE_SECONDS = 8;

const PAL = buildPalette("mars-cream");
const OPERATOR: Agent = { name: "MARS", color: PAL.accent };

/** A nine-box field, so the selection is visibly a choice among alternatives. */
const FIELD = [
  "client", "transport", "server",
  "tools", "resources", "prompts",
  "sampling", "roots", "logging",
];

export const MarqueeLab: React.FC = () => (
  <AbsoluteFill style={{ background: PAL.bg }}>
    <MarqueeZoom
      pal={PAL}
      agent={OPERATOR}
      // the middle-right cell of the grid below
      rect={{ x: 55.5, y: 41, w: 23, h: 17 }}
      drag={[0.7, 1.3]}
      hold={0.38}
      push={1.1}
      release={5.4}
      releaseDur={1.0}
    >
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 340px)", gap: 28 }}>
          {FIELD.map((label, i) => (
            <div
              key={label}
              style={{
                height: 150,
                borderRadius: 16,
                background: PAL.surface,
                border: `2px solid ${i === 4 ? PAL.accent : PAL.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: i === 4 ? HEAD : MONO,
                fontWeight: i === 4 ? 800 : 400,
                fontSize: i === 4 ? 40 : 26,
                letterSpacing: i === 4 ? "-0.04em" : "0.1em",
                color: i === 4 ? PAL.ink : PAL.textMuted,
              }}
            >
              {i === 4 ? label : label.toUpperCase()}
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </MarqueeZoom>
  </AbsoluteFill>
);
