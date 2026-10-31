// Author: Bishakh
//
// Every `EnterKind`, back to back, on two high-contrast plates so the matte is
// legible. This is the reference you scrub in `npm run studio` when you're
// choosing a transition — a table in a markdown file can't tell you what
// `luma-wipe` actually looks like.
//
// Each one plays at ITS OWN length (`ENTER_FRAMES`), which is the length it
// will have in an episode. That's the whole point of the gallery: a dissolve
// and a whip are not the same gesture at different speeds.
//
// Render a contact sheet of the boundaries with:
//   npx remotion still src/index.ts TransitionGallery out/tg.png --frame=N

import React from "react";
import { AbsoluteFill } from "remotion";
import { Timeline, totalFrames, ALL_ENTER_KINDS, type Beat, type EnterKind } from "../lib/transitions";
import { Backdrop, Head, TopEyebrow } from "../lib/kit";
import { buildPalette } from "../theme";
import { alpha } from "../theme";

export const GALLERY_PAL = buildPalette("terminal-dark");
const FPS = 30;
// Seconds per plate. 2.6s is not arbitrary: a cut's overlap is clamped to a
// third of the shorter scene, and the longest kinds run 26 frames — a shorter
// hold would silently truncate exactly the transitions you most need to see.
const HOLD = 2.6;

/** Two plates that differ in luminance, colour and layout, so any matte shows. */
const Plate: React.FC<{ kind: EnterKind; i: number }> = ({ kind, i }) => {
  const pal = GALLERY_PAL;
  const warm = i % 2 === 1;
  return (
    <AbsoluteFill style={{ background: warm ? pal.accent : pal.bgDeep }}>
      {!warm && <Backdrop pal={pal} />}
      {warm && (
        <AbsoluteFill
          style={{
            background:
              `radial-gradient(ellipse 70% 70% at 20% 15%, #FFFFFF${alpha(0.35)}, transparent 60%),` +
              `linear-gradient(140deg, ${pal.accent}, ${pal.accent2})`,
          }}
        />
      )}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 24 }}>
        <TopEyebrow pal={pal}>{`${i + 1} / ${ALL_ENTER_KINDS.length}`}</TopEyebrow>
        <Head pal={pal} size={110} color={warm ? pal.bgDeep : pal.ink} style={{ fontFamily: "monospace" }}>
          {kind}
        </Head>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const GALLERY_BEATS: Beat[] = ALL_ENTER_KINDS.map((kind, i) => ({
  seconds: HOLD,
  enter: kind,
  node: <Plate kind={kind} i={i} />,
}));

export const GALLERY_DURATION = totalFrames(GALLERY_BEATS, FPS);

export const TransitionGallery: React.FC = () => (
  <AbsoluteFill style={{ background: GALLERY_PAL.bg }}>
    <Timeline beats={GALLERY_BEATS} pal={GALLERY_PAL} vo={false} />
  </AbsoluteFill>
);
