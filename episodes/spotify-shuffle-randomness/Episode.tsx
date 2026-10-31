// Author: Bishakh
//
// ══ EP 08 — "Spotify's shuffle wasn't broken. Randomness was." ══════════════
//
// Two palettes on purpose. PAL is the Vox register: paper white, near-black
// Poppins, indigo accent — it carries every graphics beat. PAL_F is the footage
// grade: near-black, so Kling clips read cinematic and white type sits on them.
// Bright explainer / dark film, cut against each other. Spotify green appears
// only where it means Spotify.
//
// Versioning rule: never replace a scene the director has already seen. A change
// to "Scene 5" creates `Scene5V2`; the old one stays, `void`-referenced.

import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, staticFile } from "remotion";
import { buildPalette } from "../theme";
import { Backdrop, TitleCard, ChapterCard, Statement, CodeWindow, EndCard, StackDiagram, StatRow, Checklist, QuoteCard, FlowDiagram, TerminalRun, Compare } from "../lib/kit";
import { KlingClip, KlingStill, LowerThird, Chip, OverText, Letterbox, FootagePlate, SeriesMark, hasShot, shotSeconds } from "../lib/footage";
import { Timeline, totalFrames, MorphBridge, type Beat } from "../lib/transitions";
import { ComplaintCollage, ClumpScene, FormulaScene, ABScene, ArchivalPlate, ClarkeScene, RhymeScene, FixScene, NoiseTable, SpotifyMark, PlaylistStrip } from "../lib/ep08";
import { useK } from "../lib/anim";
import cfg from "../../episode.config.json";
import durs from "../../vo-durations.json";

/** The Vox register — every graphics beat. */
export const PAL = buildPalette(cfg.theme || "white-light");
/** The footage grade — every Kling beat, so white type reads over it. */
export const PAL_F = buildPalette({
  accent: PAL.accent, bg: "#0B0E14", bgDeep: "#05070B", ink: "#F2F5FA", isDark: true, grade: "#0D1420",
});

const FPS = cfg.fps || 30;

/** Scene length = its narration + a breath. Never hand-guess these. */
const sec = (scene: number, breath = 0.9) => (durs[scene - 1] ?? 4) + breath;

/** The one Kling morph bridge; falls back to a straight cut until generated. */
const BRIDGE = "ep08_morph";

/* ── the beats ───────────────────────────────────────────────────────────── */

/** Archival inset — the V-1 itself, as a card over the London plate. */
const V1Inset: React.FC<{ delay?: number }> = () => {
  const k = useK();
  return (
    <div
      style={{
        position: "absolute", right: 130 * k, top: 180 * k, width: 520 * k,
        border: `3px solid #F2F5FA`, boxShadow: "0 40px 90px -30px #000",
        transform: "rotate(1.5deg)",
      }}
    >
      <Img
        src={staticFile("kling/ep08_v1.png")}
        style={{ width: "100%", display: "block", filter: "grayscale(1) contrast(1.15)" }}
      />
      <div
        style={{
          position: "absolute", left: 0, right: 0, bottom: -46 * k,
          fontFamily: "monospace", fontSize: 20 * k, letterSpacing: "0.16em",
          textTransform: "uppercase", color: "#F2F5FA", opacity: 0.8, textAlign: "center",
        }}
      >
        V-1 flying bomb
      </div>
    </div>
  );
};

export const buildBeats = (): Beat[] => {
  const P = PAL;
  const F = PAL_F;
  return [
    // 1 — COLD OPEN. Real footage, the complaint burned over it. Never a slide.
    // Clip is 5.04s and the line is 5.88s, so it runs at 0.7× — which also
    // gives the shot the weight a cold open wants.
    {
      seconds: sec(1), vo: 1, enter: "cut",
      node: (
        <KlingClip id="ep08_open" pal={F} startAt={0.3} speed={0.7} grade={0.5} push={1.1} panX={-1.5}>
          <Letterbox pal={F} height={80} />
          <OverText pal={F} text={cfg.hook} />
        </KlingClip>
      ),
    },

    // 2 — TITLE. Hard flash off the footage into the paper register.
    {
      seconds: sec(2), vo: 2, enter: "flash",
      node: <TitleCard pal={P} kicker={`${cfg.series} · ${cfg.episode}`} title={cfg.title} accentWord={cfg.titleAccent} sub={cfg.subtitle} />,
    },

    // 3 — THE COMPLAINTS. Vox cutout collage: real photographic cutouts, hard
    // paper shadows, the real Spotify mark as SVG.
    { seconds: sec(3), vo: 3, enter: "push-up", node: <ComplaintCollage pal={P} /> },

    // 4 — SPOTIFY CHECKS. The actual algorithm, one hot line.
    {
      seconds: sec(4), vo: 4, enter: "wipe",
      node: (
        <CodeWindow
          pal={P}
          eyebrow="What was actually shipping"
          filename="shuffle.js"
          highlight={3}
          lines={[
            "// Fisher-Yates: every ordering equally likely",
            "for (let i = a.length - 1; i > 0; i--) {",
            "  const j = Math.floor(Math.random() * (i + 1));",
            "  [a[i], a[j]] = [a[j], a[i]];",
            "}",
          ]}
        />
      ),
    },

    // 5 — THE TURN. One statement, full frame, so the line lands.
    { seconds: sec(5), vo: 5, enter: "zoom", node: <Statement pal={P} text="There was no bug." accentWord="no bug" /> },

    // 6 — CHAPTER SLATE.
    { seconds: sec(6), vo: 6, enter: "split", node: <ChapterCard pal={P} n={1} title="The clump" /> },

    // 7 — THE PROTAGONIST MOTIF ARRIVES. One real fair shuffle, its nine
    // repeats flaring one at a time.
    { seconds: sec(7), vo: 7, enter: "iris", node: <ClumpScene pal={P} /> },

    // 8 — THE MATHS. n(n−1)/N, stepped out to 9.
    { seconds: sec(8), vo: 8, enter: "circle-out", node: <FormulaScene pal={P} /> },

    // 9 — THE A/B. Ends by collapsing to the uniform field full frame — that
    // frame is the head of the morph bridge.
    { seconds: sec(9), vo: 9, enter: "push-left", node: <ABScene pal={P} /> },

    // 10 — THE IMPOSSIBLE CUT. Kling interpolates scattered dots into London
    // rooftops. Neighbours fade so nothing competes with it.
    hasShot(BRIDGE)
      ? MorphBridge(BRIDGE, F, shotSeconds(BRIDGE))
      : { seconds: 1.2, enter: "fade", enterDur: 6, node: <AbsoluteFill style={{ background: P.bg }} /> },

    // 11 — 1944. Archival plate, V-1 inset, documentary lower third.
    {
      seconds: sec(10), vo: 10, enter: "fade", enterDur: 8,
      node: (
        <ArchivalPlate id="ep08_london" push={1.14}>
          <Letterbox pal={F} height={70} />
          <V1Inset />
          <LowerThird pal={F} label="South London, 1944" sub="“they are aiming at us”" />
        </ArchivalPlate>
      ),
    },

    // 12 — THE COUNT. Clarke's real observed-vs-expected table.
    { seconds: sec(11), vo: 11, enter: "blinds", node: <ClarkeScene pal={P} /> },

    // 13 — THE MOVE THIS EPISODE OWNS. 0.9 = 0.93. Stamp it once.
    { seconds: sec(12), vo: 12, enter: "flash", node: <RhymeScene pal={P} /> },

    // 14 — CHAPTER TWO.
    { seconds: sec(13), vo: 13, enter: "split", node: <ChapterCard pal={P} n={2} title="The fix" /> },

    // 15 — THE FIX. Four real steps, and the same 100 dots re-spacing themselves.
    { seconds: sec(14), vo: 14, enter: "push-up", node: <FixScene pal={P} /> },

    // 16 — THE TRANSFERABLE IDEA. The table is the reason to watch.
    { seconds: sec(15), vo: 15, enter: "wipe-down", node: <NoiseTable pal={P} /> },

    // 17 — CLOSE.
    {
      seconds: sec(16), vo: 16, enter: "pull",
      node: <EndCard pal={P} line="When it feels wrong, that's data too." cta={cfg.cta} next={cfg.next} nextLabel="" />,
    },
  ];
};

export const BEATS = buildBeats();
export const DURATION = totalFrames(BEATS, FPS);

/* ── the composition ─────────────────────────────────────────────────────── */

export const Episode: React.FC = () => {
  const beats = buildBeats();
  return (
    <AbsoluteFill style={{ backgroundColor: PAL.bg }}>
      <Timeline beats={beats} pal={PAL} voVolume={1} vo={cfg.audio?.vo !== false} />
      {cfg.audio?.music !== false && (
        <Audio src={staticFile(cfg.music?.file || "audio/music/bed.wav")} volume={cfg.music?.volume ?? 0.17} loop />
      )}
      {/* Series mark starts after the title card so it doesn't duplicate the kicker. */}
      <Sequence from={Math.round((sec(1) + sec(2)) * FPS)} layout="none" name="Series mark">
        <SeriesMark pal={PAL} series={cfg.series} episode={cfg.episode} />
      </Sequence>
    </AbsoluteFill>
  );
};

// Vocabulary kept alive for the next scene — not dead code.
void [KlingStill, FootagePlate, Chip, Backdrop, StackDiagram, StatRow, Checklist, QuoteCard, FlowDiagram, TerminalRun, Compare, SpotifyMark, PlaylistStrip];
