// Author: Bishakh
import React from "react";
import { Composition } from "remotion";
import { Episode, DURATION, PAL } from "./compositions/Episode";
import { TransitionGallery, GALLERY_DURATION } from "./compositions/TransitionGallery";
import { MotifLab, LAB_SECONDS } from "./compositions/MotifLab";
import { SpaceLab, SPACE_SECONDS } from "./compositions/SpaceLab";
import { DemoLab, DEMO_SECONDS } from "./compositions/DemoLab";
import { Mars, MARS_DURATION, MARS_FPS } from "./compositions/Mars";
import { MarqueeLab, MARQUEE_SECONDS } from "./compositions/MarqueeLab";
import { SurfaceLab, SURFACE_SECONDS } from "./compositions/SurfaceLab";
import { Ep13, EP13_DURATION, EP13_FPS } from "./compositions/Ep13";
import { Ep14, EP14_DURATION, EP14_FPS } from "./compositions/Ep14";
import { Ep15, EP15_DURATION, EP15_FPS } from "./compositions/Ep15";
import { Ep16, EP16_DURATION, EP16_FPS } from "./compositions/Ep16";
import { Ep17, EP17_DURATION, EP17_FPS } from "./compositions/Ep17";
import { Ep18, EP18_DURATION, EP18_FPS } from "./compositions/Ep18";
import { Ep19, EP19_DURATION, EP19_FPS } from "./compositions/Ep19";
import { Ep20, EP20_DURATION, EP20_FPS } from "./compositions/Ep20";
import { Ep21, EP21_DURATION, EP21_FPS } from "./compositions/Ep21";
import cfg from "../episode.config.json";

const FPS = cfg.fps || 30;

export const RemotionRoot: React.FC = () => (
  <>
    {/* The episode. 1080p master; render 4K by passing --scale=2. */}
    <Composition id="Episode" component={Episode} durationInFrames={Math.max(30, DURATION)} fps={FPS} width={1920} height={1080} />
    {/* 9:16 cut for shorts. Every kit primitive is `useK()`-scaled, so it
        reflows — but ALWAYS re-check the stills: wide diagrams need a vertical
        variant, they don't just shrink. */}
    <Composition id="EpisodeShort" component={Episode} durationInFrames={Math.max(30, DURATION)} fps={FPS} width={1080} height={1920} />
    {/* Every transition, back to back. Scrub this before choosing an `enter`
        kind — the table in references/motion-grammar.md names them, this shows
        you what they actually do. Never part of a render. */}
    <Composition id="TransitionGallery" component={TransitionGallery} durationInFrames={GALLERY_DURATION} fps={30} width={1920} height={1080} />
    {/* The continuity layer — the motif, the thread, the living field — on its
        own, in this episode's palette. Design the protagonist here before
        wiring it into the film. Never part of a render. */}
    <Composition id="MotifLab" component={MotifLab} durationInFrames={LAB_SECONDS * 30} fps={30} width={1920} height={1080} />
    {/* The world and the camera that travels it. Design the layout of the
        episode here before building beats inside it. Never part of a render. */}
    <Composition id="SpaceLab" component={SpaceLab} durationInFrames={SPACE_SECONDS * 30} fps={30} width={1920} height={1080} />
    {/* The workspace register — named cursors operating a live artifact, no
        footage and no narration. A whole small film rather than a specimen
        sheet, because this register only exists in the joins: watch it, don't
        scrub it. Never part of a render. */}
    <Composition id="DemoLab" component={DemoLab} durationInFrames={DEMO_SECONDS * 30} fps={30} width={1920} height={1080} />
    {/* The marquee gesture — drag a box, hold, push into it. Tune the four
        phase lengths here before wiring it into a beat. Never rendered. */}
    <Composition id="MarqueeLab" component={MarqueeLab} durationInFrames={MARQUEE_SECONDS * 30} fps={30} width={1920} height={1080} />
    {/* The marketing-surface vocabulary — the ribbon field, the hero-card
        framing, the 3D card marquee and the box pattern, in one place. Tune the
        field's wave clock and the marquee's column periods here; both are
        judgements you can only make in motion. Never rendered as output. */}
    <Composition id="SurfaceLab" component={SurfaceLab} durationInFrames={SURFACE_SECONDS * 30} fps={30} width={1920} height={1080} />
    {/* EP 13 — MCP. The workspace register carrying narration. */}
    <Composition id="Ep13" component={Ep13} durationInFrames={EP13_DURATION} fps={EP13_FPS} width={1920} height={1080} />
    <Composition id="Ep13Short" component={Ep13} durationInFrames={EP13_DURATION} fps={EP13_FPS} width={1080} height={1920} />
    {/* EP 14 — computer use. Same register, same palette, new material. */}
    <Composition id="Ep14" component={Ep14} durationInFrames={EP14_DURATION} fps={EP14_FPS} width={1920} height={1080} />
    <Composition id="Ep14Short" component={Ep14} durationInFrames={EP14_DURATION} fps={EP14_FPS} width={1080} height={1920} />
    {/* EP 15 — webhooks. Same construction, DESIGN.md's surface: the ribbon
        field, the 3D card marquee, the hero-card framing, the box pattern. */}
    <Composition id="Ep15" component={Ep15} durationInFrames={EP15_DURATION} fps={EP15_FPS} width={1920} height={1080} />
    <Composition id="Ep15Short" component={Ep15} durationInFrames={EP15_DURATION} fps={EP15_FPS} width={1080} height={1920} />

    <Composition id="Ep16" component={Ep16} durationInFrames={EP16_DURATION} fps={EP16_FPS} width={1920} height={1080} />
    <Composition id="Ep16Short" component={Ep16} durationInFrames={EP16_DURATION} fps={EP16_FPS} width={1080} height={1920} />
    {/* EP 17 — VectorDrop → R2. Same construction, the product's own dark
        design system and the system UI face its fallback stack names. */}
    <Composition id="Ep17" component={Ep17} durationInFrames={EP17_DURATION} fps={EP17_FPS} width={1920} height={1080} />
    <Composition id="Ep17Short" component={Ep17} durationInFrames={EP17_DURATION} fps={EP17_FPS} width={1080} height={1920} />
    {/* EP 18 — CQRS. EP 16's construction and palette exactly; the episode's own
        signature is the FIELD — the director's stripe gradient, ported verbatim
        onto lib/gradient.tsx's machine, with its no-edge bloom twin under every
        station that has a diagram to keep readable. */}
    <Composition id="Ep18" component={Ep18} durationInFrames={EP18_DURATION} fps={EP18_FPS} width={1920} height={1080} />
    <Composition id="Ep18Short" component={Ep18} durationInFrames={EP18_DURATION} fps={EP18_FPS} width={1080} height={1920} />
    {/* EP 19 — blue-green. The strip construction on the FERRARI EDITORIAL
        surface: near-black, sharp 0px corners, no shadows, display at weight
        500, and the act break promoted to the system's own Rosso Corsa livery
        band. The first episode in the run where footage is a design
        requirement rather than a flourish. */}
    <Composition id="Ep19" component={Ep19} durationInFrames={EP19_DURATION} fps={EP19_FPS} width={1920} height={1080} />
    <Composition id="Ep19Short" component={Ep19} durationInFrames={EP19_DURATION} fps={EP19_FPS} width={1080} height={1920} />
    {/* EP 20 — agent skills and memory. EP16's palette for the third time, and
        the point of the run: the CONSTRUCTION and the palette are the series.
        Two things are this episode's own — the FIELD is `MeshField`, five
        edgeless lobes on mutually incommensurate clocks, so for the first time
        one instrument runs under every station and the value journey is that
        surface being turned up and down rather than five backgrounds; and the
        DECK is the director's supplied stacked drag-carousel, ported frame-pure,
        carrying the argument rather than decorating it. */}
    <Composition id="Ep20" component={Ep20} durationInFrames={EP20_DURATION} fps={EP20_FPS} width={1920} height={1080} />
    <Composition id="Ep20Short" component={Ep20} durationInFrames={EP20_DURATION} fps={EP20_FPS} width={1080} height={1920} />
    {/* EP 21 — read replicas. EP 16's palette for the fourth time in the run;
        the construction and the palette are the series. Three things are this
        episode's own. The FIELD is `WalField` — soft horizontal streaks
        travelling at incommensurate speeds, because this is the first episode
        whose subject has a DIRECTION, and its `WAL_AZURE_COLD` variant is where
        the act-two temperature shift lives (the light turns; the ink, accent and
        type never do). The LAG RULER is the protagonist: `pg_stat_replication`'s
        four real heads — sent, write, flush, replay — drawn on three stations
        doing three different jobs, where the distance between the primary's head
        and `replay_lsn` IS the argument. And the LOCATOR pins APP / PRIMARY /
        REPLICA outside the strip so eight bespoke instruments never cost the
        viewer the topology. Every figure is documented and captioned with its
        source; nothing is presented as measured here. */}
    <Composition id="Ep21" component={Ep21} durationInFrames={EP21_DURATION} fps={EP21_FPS} width={1920} height={1080} />
    <Composition id="Ep21Short" component={Ep21} durationInFrames={EP21_DURATION} fps={EP21_FPS} width={1080} height={1920} />
    {/* The SOUND-OFF cut — same composition, same timings, same length, with the
        voice's job handed to the picture: a lead line per station carrying the
        beat's one idea, a caption band carrying the actual narration, and no
        audio track at all. For feeds, where nearly every play is muted. */}
    <Composition id="Ep21Silent" component={Ep21} defaultProps={{ silent: true }} durationInFrames={EP21_DURATION} fps={EP21_FPS} width={1920} height={1080} />
    {/* CosX MARS — the launch film. A real deliverable, not a lab. */}
    <Composition id="Mars" component={Mars} durationInFrames={MARS_DURATION} fps={MARS_FPS} width={1920} height={1080} />
    <Composition id="MarsShort" component={Mars} durationInFrames={MARS_DURATION} fps={MARS_FPS} width={1080} height={1920} />
  </>
);

void PAL;
