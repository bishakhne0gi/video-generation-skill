// Author: Bishakh
//
// EP 17 — "The Meter Ran Out."
// VectorDrop moves 1.69 GB of object storage from Supabase to Cloudflare R2,
// and rewrites zero database rows doing it.
//
// THE CONSTRUCTION is the station strip (references/station-strip.md), fourth
// episode running: nine stations on a serpentine, the camera travelling between
// them, two act slates on the two real section changes, and a continuity chip
// following ONE object the whole way through — here, object 25 of 1,156, the
// one the first run died on. It is the protagonist because the write-up already
// made it one.
//
// THE SURFACE is not the house look and not EP15/16's stripe-mesh. It is
// VectorDrop's OWN dark mode, out of its DESIGN.md:
//
//   GROUND #161516, panels #0D0D0D, cards #131313, canvas #1E1E1E. Borders are
//   rgba(255,255,255,0.08) — deliberately near-invisible, because separation
//   comes from surface lightness, not from lines.
//
//   ONE accent, teal #14B8A6. #0D9488 is DEMOTED to hover in dark mode, so it
//   appears here only inside the gradient. Cyan #0891B2 appears ONLY inside the
//   gradient, never as a flat colour — that is the brand's rule, not a
//   preference, and it is the difference between using the palette and using
//   the brand.
//
//   THE AMBIENT BLOBS replace EP15/16's bloom field: two slow radial gradients
//   drifting behind everything on 18s and 24s, the second reversed and offset
//   so they never sync, under a vignette that fades the edges back into the
//   ground. Frame-driven, never rAF.
//
// THE TYPE is the system UI face VectorDrop's own fallback stack names — SF Pro,
// loaded from /System/Library/Fonts/SFNS.ttf as a real variable font, so the
// weight axis is genuine rather than synthesised. Geist Mono carries every path,
// figure, header and status, which is most of the frame in an episode whose
// subject is object keys.
//
// EVERY NUMBER IS FROM THE MIGRATION WRITE-UP. 1,156 objects / 1.74 GB against
// a 1 GB tier; ~1.53 MB average, 8.2 MB largest; R2 egress $0.00 against S3's
// ~$0.09/GB; the crash was NGHTTP2_INTERNAL_ERROR at object 25 with a bare
// Promise.all and a pipeline that still exited 0; the HEAD discrepancy was
// 1,743 MB against 468 MB; the SDK signed x-amz-checksum-crc32=AAAAAA==, the
// CRC32 of empty; the result was 1,136 of 1,136, 1.69 GB, 0 failed, 0 rows.

import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Cue } from "../lib/sound";
import { snapUp } from "../lib/tempo";
import { buildPalette } from "../theme";
import { SFPRO, MONO } from "../fonts";
import { useK, useAppearAt, useLoop, lerp, clamp01, rand } from "../lib/anim";
import cfg from "../../episode.config.json";
// Its OWN measured lengths, out of its archive — a published episode must keep
// rebuilding to the film that shipped, not re-time itself off whatever the
// working file holds while a later episode is being cut.
import durs from "../../episodes/vectordrop-r2-migration/vo-durations.json";

export const EP17_FPS = 30;
export const PAL17 = buildPalette("vectordrop");

const F = (n: number) => Math.round(n * EP17_FPS);

/* ── the tokens, straight from DESIGN.md ─────────────────────────────────── */

const GROUND = "#161516";
const PANEL = "#0D0D0D";
const CARD = "#131313";
const CANVAS = "#1E1E1E";
const ACCENT = "#14B8A6";
const ACCENT_DEEP = "#0D9488";
const CYAN = "#0891B2";
const ON = "#FFFFFF";
const ON_MID = "rgba(255,255,255,0.50)";
const ON_DIM = "rgba(255,255,255,0.28)";
const LINE = "rgba(255,255,255,0.08)";
const LINE_SUBTLE = "rgba(255,255,255,0.04)";
const BAD = "#F87171";
const RADIUS = 16;
const SHADOW_CARD = "0 1px 2px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.4)";

/** The one gradient. Never a flat cyan anywhere — cyan lives only in here. */
const GRADIENT = `linear-gradient(135deg, ${ACCENT_DEEP} 0%, ${ACCENT} 60%, ${CYAN} 100%)`;

/* ── type helpers ────────────────────────────────────────────────────────── */

/** Display / UI. SF Pro, with DESIGN.md's -0.011em body tuning tightened for size. */
const sf = (size: number, weight = 500, track = -0.03): React.CSSProperties => ({
  fontFamily: SFPRO,
  fontWeight: weight,
  fontSize: size,
  letterSpacing: `${track}em`,
  lineHeight: 1.08,
});

/** Paths, figures, statuses — Geist Mono, tabular. */
const mono = (size: number, weight = 400): React.CSSProperties => ({
  fontFamily: MONO,
  fontWeight: weight,
  fontSize: size,
  letterSpacing: "-0.02em",
  fontFeatureSettings: '"tnum", "ss01"',
  fontVariantNumeric: "tabular-nums",
});

/** The all-caps eyebrow. */
const cap = (size: number): React.CSSProperties => ({
  fontFamily: MONO,
  fontWeight: 400,
  fontSize: size,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
});

/* ── the schedule ────────────────────────────────────────────────────────── */

const BREATH = 0.35;
type BeatDef = { id: string; vo?: number; hold?: number };

const DEFS: BeatDef[] = [
  { id: "open", vo: 1 }, // the meter ran out
  { id: "title", hold: 4.6 }, // ── silent: the bed lifts
  { id: "why", vo: 2 }, // why a vectoriser is heavy
  { id: "egress", vo: 3 }, // choose on egress
  { id: "scope", vo: 4 }, // move the broken thing
  { id: "keys", vo: 5 }, // keys byte for byte
  { id: "presign", vo: 6 }, // ← ACT BREAK: presigning lies
  { id: "dryrun", vo: 7 }, // the dry run lied
  { id: "gzip", vo: 8 }, // 1,743 vs 468
  { id: "crash", vo: 9 }, // object 25 of 1,156
  { id: "browser", vo: 10 }, // ← ACT BREAK: CSP + the empty checksum
  { id: "end", hold: 8.0 }, // ── silent: the bed lifts again
];

const LEN = DEFS.map((d) => (d.vo ? snapUp(durs[d.vo - 1] + BREATH) : snapUp(d.hold ?? 4)));
const START: number[] = [];
DEFS.reduce((acc, _d, i) => {
  START[i] = acc;
  return acc + LEN[i];
}, 0);

const at = (id: string) => START[DEFS.findIndex((d) => d.id === id)];
const len = (id: string) => LEN[DEFS.findIndex((d) => d.id === id)];
const endOf = (id: string) => at(id) + len(id);

export const EP17_SECONDS = START[START.length - 1] + LEN[LEN.length - 1];
export const EP17_DURATION = Math.round(EP17_SECONDS * EP17_FPS);

const VO_WINDOWS = DEFS.map((d, i) =>
  d.vo ? [START[i], START[i] + durs[d.vo - 1]] : null,
).filter(Boolean) as [number, number][];

const STRIP_FROM = 2;
const STRIP_IDS = DEFS.slice(STRIP_FROM).map((d) => d.id);
const STRIP_T0 = at(STRIP_IDS[0]);

/* ── the route ───────────────────────────────────────────────────────────────
 *
 *   row 0 — the decision   why · egress · scope · keys
 *   row 1 — what broke     presign · dryrun · gzip · crash   (travelling back)
 *   row 2 — what shipped   browser · end
 * ─────────────────────────────────────────────────────────────────────────── */

const G = 100;

const ROUTE: Record<string, [number, number]> = {
  why: [0, 0], egress: [1, 0], scope: [2, 0], keys: [3, 0],
  presign: [3, 1], dryrun: [2, 1], gzip: [1, 1], crash: [0, 1],
  browser: [0, 2], end: [1, 2],
};

const cellOf = (id: string) => ROUTE[id] ?? [0, 0];
export const isActBreak = (id: string) => {
  const i = STRIP_IDS.indexOf(id);
  return i > 0 && cellOf(STRIP_IDS[i - 1])[1] !== cellOf(id)[1];
};

type Key = { at: number; x: number; y: number; s: number };

const RIDE: Key[] = [];
STRIP_IDS.forEach((id, i) => {
  const [cx, cy] = cellOf(id);
  const s = at(id);
  if (i === 0) {
    RIDE.push({ at: s, x: cx * G, y: cy * G, s: 1 });
    return;
  }
  const [px, py] = cellOf(STRIP_IDS[i - 1]);
  const down = py !== cy;
  const dur = down ? 1.4 : 0.9;
  RIDE.push({ at: s - dur, x: px * G, y: py * G, s: 1 });
  if (down) {
    RIDE.push({ at: s - dur / 2, x: ((px + cx) / 2) * G, y: ((py + cy) / 2) * G, s: 0.84 });
  }
  RIDE.push({ at: s, x: cx * G, y: cy * G, s: 1 });
});
RIDE.push({ at: endOf("end"), x: cellOf("end")[0] * G, y: cellOf("end")[1] * G, s: 1 });

/* ── the film ────────────────────────────────────────────────────────────── */

export const Ep17: React.FC = () => (
  <AbsoluteFill style={{ background: GROUND }}>
    <Sequence from={0} durationInFrames={F(len("open"))} name="1 · the meter ran out">
      <ColdOpen />
    </Sequence>

    <Sequence from={F(at("title"))} durationInFrames={F(len("title"))} name="2 · title">
      <TitleCard />
    </Sequence>

    <Sequence
      from={F(STRIP_T0)}
      durationInFrames={EP17_DURATION - F(STRIP_T0)}
      name="3–12 · the strip"
    >
      <Strip />
    </Sequence>

    <ObjectTrail />
    <ActSlate />
    <Track />
  </AbsoluteFill>
);

/* ── the ambient blobs ───────────────────────────────────────────────────────
 *
 * DESIGN.md's background, and the reason a flat #161516 page does not look like
 * this product: two slow radial gradients drifting behind everything, under a
 * vignette that fades the edges back into the ground.
 *
 * The drift is derived from `useCurrentFrame()`, never a CSS keyframe — a CSS
 * animation is wall-clock, so in a frame-by-frame render it either freezes at 0
 * or judders. And every modulation is written to be exactly 0 at t=0
 * (`cos(x) − 1`), or the whole field visibly snaps the moment motion starts.
 * ─────────────────────────────────────────────────────────────────────────── */

const Blobs: React.FC<{ intensity?: number; atSeconds?: number; ground?: string }> = ({
  intensity = 1,
  atSeconds,
  ground = GROUND,
}) => {
  const frame = useCurrentFrame();
  const t = atSeconds ?? frame / EP17_FPS;

  // 18s and 24s, the second reversed with an -8s offset so they never sync
  const a = (2 * Math.PI * t) / 18;
  const b = (2 * Math.PI * (t + 8)) / -24;
  const dx1 = (Math.cos(a) - 1) * 4.5;
  const dy1 = Math.sin(a) * 3.5;
  const dx2 = (Math.cos(b) - Math.cos((2 * Math.PI * 8) / -24)) * 5.5;
  const dy2 = (Math.sin(b) - Math.sin((2 * Math.PI * 8) / -24)) * 4;

  return (
    <AbsoluteFill style={{ background: ground, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: `${-30 + dy1}%`,
          right: `${-20 + dx1}%`,
          width: "70vw",
          height: "70vw",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(13,148,136,${0.14 * intensity}) 0%, rgba(20,184,166,${0.07 * intensity}) 45%, transparent 70%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: `${-15 + dy2}%`,
          left: `${-10 + dx2}%`,
          width: "50vw",
          height: "50vw",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(8,145,178,${0.10 * intensity}) 0%, rgba(13,148,136,${0.05 * intensity}) 45%, transparent 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 90% at 50% 50%, transparent 30%, ${
            ground === "transparent" ? "rgba(0,0,0,0.55)" : ground
          } 92%)`,
        }}
      />
      <Grain />
    </AbsoluteFill>
  );
};

/**
 * Per-frame grain. A static noise tile renders identical noise on every frame,
 * which reads as dirt on the lens rather than as film; re-seeding per frame from
 * `rand(frame)` is what makes it a texture. Deterministic and frame-pure.
 */
const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = Math.floor(rand(frame) * 100000);
  return (
    <AbsoluteFill
      style={{
        opacity: 0.035,
        mixBlendMode: "overlay",
        backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(
          `<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' seed='${seed}'/></filter><rect width='140' height='140' filter='url(%23n)'/></svg>`,
        )}")`,
        backgroundPosition: `${(frame * 13) % 140}px ${(frame * 7) % 140}px`,
      }}
    />
  );
};

/* ── shared vocabulary ───────────────────────────────────────────────────── */

/**
 * A surface. ONE black and a 1px hairline for everything in the film — no
 * coloured edges, no tone per component. The content tells them apart, and a
 * wall of near-identical dark panels is what makes the frame read as an
 * application rather than as a slide deck.
 */
const Panel: React.FC<{
  w?: number;
  chrome?: string;
  chromeRight?: React.ReactNode;
  at?: number;
  pad?: number;
  fill?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ w, chrome, chromeRight, at: a = 8, pad = 0, fill, style, children }) => {
  const k = useK();
  const p = useAppearAt(a, 190);
  return (
    <div
      style={{
        width: w ? w * k : undefined,
        background: fill ?? PANEL,
        border: `1px solid ${LINE}`,
        borderRadius: RADIUS * k,
        boxShadow: SHADOW_CARD,
        overflow: "hidden",
        opacity: p,
        transform: `translateY(${lerp(14, 0, p) * k}px)`,
        ...style,
      }}
    >
      {chrome && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12 * k,
            padding: `${13 * k}px ${18 * k}px`,
            borderBottom: `1px solid ${LINE_SUBTLE}`,
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <span style={{ ...mono(17 * k), color: ON_MID, flex: 1 }}>{chrome}</span>
          {chromeRight}
        </div>
      )}
      <div style={{ padding: pad * k }}>{children}</div>
    </div>
  );
};

/** A hairline key/value row — the filler that makes a panel look inhabited. */
const Row: React.FC<{
  label: string;
  value: React.ReactNode;
  at: number;
  hue?: string;
  last?: boolean;
}> = ({ label, value, at: a, hue, last = false }) => {
  const k = useK();
  const p = useAppearAt(a, 200);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        gap: 18 * k,
        padding: `${12 * k}px ${18 * k}px`,
        borderBottom: last ? "none" : `1px solid ${LINE_SUBTLE}`,
        opacity: p,
      }}
    >
      <span style={{ ...cap(14 * k), color: ON_DIM }}>{label}</span>
      <span style={{ ...mono(18 * k), color: hue ?? ON, whiteSpace: "nowrap" }}>{value}</span>
    </div>
  );
};

/** The station header. Numbered, so nine screens read as one document. */
const Tag: React.FC<{ n: string; children: React.ReactNode }> = ({ n, children }) => {
  const k = useK();
  const p = useAppearAt(2, 200);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
        marginBottom: 40 * k,
        opacity: p,
        translate: `0 ${lerp(-8, 0, p) * k}px`,
      }}
    >
      <span
        style={{
          background: ACCENT,
          color: "#04201C",
          ...mono(20 * k, 700),
          padding: `${9 * k}px ${14 * k}px`,
          borderRadius: `${8 * k}px 0 0 ${8 * k}px`,
          display: "flex",
          alignItems: "center",
        }}
      >
        {n}
      </span>
      <span
        style={{
          border: `1px solid ${LINE}`,
          borderLeft: "none",
          borderRadius: `0 ${8 * k}px ${8 * k}px 0`,
          padding: `${9 * k}px ${20 * k}px`,
          ...cap(17 * k),
          color: ON_MID,
          display: "flex",
          alignItems: "center",
          background: "rgba(255,255,255,0.03)",
        }}
      >
        {children}
      </span>
    </div>
  );
};

const Note: React.FC<{ at: number; children: React.ReactNode }> = ({ at: a, children }) => {
  const k = useK();
  const p = useAppearAt(a, 200);
  return (
    <div
      style={{
        marginTop: 34 * k,
        ...sf(27 * k, 400, -0.015),
        lineHeight: 1.4,
        color: ON_MID,
        opacity: p,
        translate: `0 ${lerp(8, 0, p) * k}px`,
        textAlign: "center",
        maxWidth: 1200 * k,
      }}
    >
      {children}
    </div>
  );
};

/** A counting figure. A number that is simply present was never an event. */
const Figure: React.FC<{
  to: number;
  at: number;
  dur?: number;
  size: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  color?: string;
}> = ({ to, at: a, dur = 40, size, decimals = 0, prefix = "", suffix = "", color }) => {
  const frame = useCurrentFrame();
  const p = clamp01((frame - a) / dur);
  const eased = 1 - Math.pow(1 - p, 3);
  const v = to * eased;
  return (
    <span style={{ ...mono(size, 500), color: color ?? ON, whiteSpace: "nowrap" }}>
      {prefix}
      {v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
};

/* ── beat 1 — the meter ran out ──────────────────────────────────────────── */

/**
 * ONE card, centred, on the blob field, with the only motion inside it: the
 * usage bar filling past its own limit and staying there. The bar does not
 * resolve to a tidy 100% — it overshoots to 174% and sits there, because that
 * is what the product was doing, and a meter that stops neatly at the line is a
 * meter that never broke anything.
 */
const ColdOpen: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const fill = clamp01((frame - F(1.0)) / F(2.6));
  const over = fill > 0.58;
  return (
    <AbsoluteFill>
      <Blobs />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <Panel w={760} chrome="vectordrop · storage" at={10} pad={34}>
          <div style={{ ...cap(15 * k), color: ON_DIM }}>supabase storage · free tier</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 16 * k, marginTop: 18 * k }}>
            <Figure
              to={1.74}
              at={F(1.0)}
              dur={F(2.6)}
              size={104 * k}
              decimals={2}
              suffix=" GB"
              color={over ? BAD : ON}
            />
            <span style={{ ...cap(18 * k), color: ON_DIM, paddingBottom: 20 * k }}>of 1 GB</span>
          </div>

          {/* the meter. The limit line is a real position on the bar, not a
              label beside it — the overshoot has to be visible as distance. */}
          <div
            style={{
              position: "relative",
              height: 18 * k,
              marginTop: 26 * k,
              background: "rgba(255,255,255,0.05)",
              borderRadius: 9 * k,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                width: `${fill * 100}%`,
                background: over ? BAD : ACCENT,
                borderRadius: 9 * k,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: "57.5%",
                top: 0,
                bottom: 0,
                width: 2 * k,
                background: "rgba(255,255,255,0.55)",
              }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 * k }}>
            <span style={{ ...cap(13 * k), color: ON_DIM }}>1 gb limit</span>
            <span style={{ ...cap(13 * k), color: over ? BAD : ON_DIM }}>
              {over ? "uploads failing" : "…"}
            </span>
          </div>

          <div style={{ marginTop: 30 * k, borderTop: `1px solid ${LINE_SUBTLE}` }}>
            <Row label="distinct objects" value="1,156" at={F(2.2)} />
            <Row label="average object" value="~1.53 MB" at={F(2.7)} />
            <Row label="largest single svg" value="8.2 MB" at={F(3.2)} hue={ACCENT} last />
          </div>
          {/* The wall is full and the product does not stop being used because
              of it — uploads keep arriving and keep being rejected, once every
              1.3s, for the rest of the beat. That is the actual failure the
              quota caused, and it gives a nine-second beat something to do
              after its meter has finished filling. */}
          <UploadAttempts start={F(4.2)} />
        </Panel>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const ATTEMPTS = ["hero-shot.jpg", "logo-draft.png", "scan-04.webp", "poster.jpg", "icon-set.png"];

const UploadAttempts: React.FC<{ start: number }> = ({ start }) => {
  const k = useK();
  const frame = useCurrentFrame();
  const since = Math.max(0, frame - start);
  const n = Math.floor(since / F(1.3));
  const rows = ATTEMPTS.map((f, i) => ({ f, i })).filter(({ i }) => i < n);
  return (
    <div style={{ marginTop: 22 * k, minHeight: 132 * k }}>
      {rows.slice(-4).map(({ f, i }) => {
        const age = clamp01((since - i * F(1.3)) / F(0.3));
        return (
          <div
            key={`${f}-${i}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12 * k,
              padding: `${6 * k}px 0`,
              opacity: age,
              translate: `0 ${lerp(8, 0, age) * k}px`,
            }}
          >
            <span style={{ width: 7 * k, height: 7 * k, borderRadius: "50%", background: BAD }} />
            <span style={{ ...mono(16 * k), color: ON_MID, flex: 1 }}>POST /upload · {f}</span>
            <span style={{ ...mono(16 * k), color: BAD }}>413 · quota exceeded</span>
          </div>
        );
      })}
    </div>
  );
};

/* ── beat 2 — the title ──────────────────────────────────────────────────── */

const TitleCard: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const fade = (a: number, b: number) =>
    interpolate(frame, [F(a), F(b)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rise = (a: number, b: number) =>
    interpolate(frame, [F(a), F(b)], [30, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.2, 1, 0.3, 1),
    });
  return (
    <AbsoluteFill>
      <Blobs intensity={1.5} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 * k, opacity: fade(0.1, 0.55) }}>
          <Img
            src={staticFile("brand/vectordrop.png")}
            style={{ width: 44 * k, height: 44 * k, borderRadius: 10 * k }}
          />
          <span style={{ ...cap(20 * k), color: ON_MID }}>
            {cfg.series} · {cfg.episode} · VectorDrop
          </span>
        </div>

        <div
          style={{
            ...sf(140 * k, 700, -0.045),
            color: ON,
            marginTop: 34 * k,
            opacity: fade(0.35, 0.85),
            translate: `0 ${rise(0.35, 1.1) * k}px`,
            textAlign: "center",
          }}
        >
          The Meter Ran{" "}
          {/* the ONE gradient in the film, on the ONE word that earns it */}
          <span
            style={{
              background: GRADIENT,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Out.
          </span>
        </div>

        <div
          style={{
            marginTop: 28 * k,
            ...sf(30 * k, 400, -0.015),
            color: ON_MID,
            opacity: fade(1.1, 1.7),
          }}
        >
          {cfg.subtitle}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ── the act slate ───────────────────────────────────────────────────────────
 *
 * EP11's chapter mark, overlaid on moves the film already makes so it costs no
 * runtime. Two of them, on the two real section changes. The wash here is the
 * GROUND rather than white, because this is a dark film — the principle is
 * "everything else recedes", not "everything else goes pale".
 * ─────────────────────────────────────────────────────────────────────────── */

const ACTS: { n: number; title: string; at: number; hold: number }[] = [
  { n: 1, title: "The decision", at: at("why") - 1.1, hold: 1.9 },
  { n: 2, title: "What broke", at: at("presign") - 2.5, hold: 1.95 },
];

const ActSlate: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const t = frame / EP17_FPS;
  const act = ACTS.find((a) => t >= a.at - 0.25 && t <= a.at + a.hold + 0.45);
  if (!act) return null;

  const local = t - act.at;
  const veil = clamp01((local + 0.25) / 0.34) * clamp01((act.at + act.hold + 0.45 - t) / 0.5);
  const p = clamp01(local / 0.62);
  const sq = 1 - Math.pow(1 - p, 3);
  const titleP = clamp01((local - 0.9) / 0.55);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          background: GROUND,
          opacity: veil * 0.93,
          backdropFilter: `blur(${8 * veil}px)`,
          WebkitBackdropFilter: `blur(${8 * veil}px)`,
        }}
      />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: veil }}>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 132 * k,
              height: 132 * k,
              borderRadius: 30 * k,
              margin: `0 auto ${34 * k}px`,
              background: ACCENT,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              ...mono(64 * k, 700),
              color: "#04201C",
              transform: `scale(${lerp(0.86, 1, sq)})`,
              boxShadow: `0 ${16 * k}px ${44 * k}px rgba(20,184,166,0.28)`,
            }}
          >
            {String(act.n).padStart(2, "0")}
          </div>
          <div
            style={{
              ...sf(96 * k, 700, -0.045),
              color: ON,
              opacity: titleP,
              translate: `0 ${lerp(16, 0, titleP) * k}px`,
            }}
          >
            {act.title}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ── the continuity layer ────────────────────────────────────────────────────
 *
 * ONE object, followed the whole way through: object 25 of 1,156 — the one the
 * first run died on. It is the protagonist because the write-up already made it
 * one, which is the difference between a continuity device and a dot that
 * happens to persist. States are HELD, never interpolated; the id never moves,
 * only the state word.
 * ─────────────────────────────────────────────────────────────────────────── */

type TrailState = "idle" | "live" | "risk" | "safe" | "done";

const TRAIL: { at: number; label: string; state: TrailState }[] = [
  { at: at("why"), label: "8.2 MB, traced from a 200 KB photo", state: "idle" },
  { at: at("egress") + 3.0, label: "served out on every editor open", state: "live" },
  { at: at("scope") + 3.2, label: "its Postgres row is not moving", state: "safe" },
  { at: at("keys") + 3.0, label: "same key, new bucket", state: "safe" },
  { at: at("presign") + 3.6, label: "URL signed — nobody checked it exists", state: "risk" },
  { at: at("dryrun") + 3.4, label: "counted by a dry run that lied", state: "risk" },
  { at: at("gzip") + 3.6, label: "size reported gzipped — never matched", state: "risk" },
  { at: at("crash") + 2.6, label: "object 25 — the run died here", state: "risk" },
  { at: at("crash") + 6.0, label: "retried, backed off, copied", state: "safe" },
  { at: at("browser") + 3.8, label: "PUT blocked before it was sent", state: "risk" },
];

const TRAIL_COLOR: Record<TrailState, string> = {
  idle: ON_DIM,
  live: ACCENT,
  risk: BAD,
  safe: ACCENT,
  done: ACCENT,
};

const ObjectTrail: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const t = frame / EP17_FPS;
  if (t < STRIP_T0 - 0.4 || t > endOf("browser") + 0.6) return null;

  let cur = TRAIL[0];
  let idx = 0;
  TRAIL.forEach((s, i) => {
    if (t >= s.at) { cur = s; idx = i; }
  });
  const tone = TRAIL_COLOR[cur.state];
  const since = clamp01((t - cur.at) / 0.42);
  const inOut = clamp01((t - (STRIP_T0 - 0.4)) / 0.6) * clamp01((endOf("browser") + 0.6 - t) / 0.6);

  return (
    <div
      style={{
        position: "absolute",
        left: 54 * k,
        bottom: 46 * k,
        display: "flex",
        alignItems: "center",
        gap: 14 * k,
        background: PANEL,
        border: `1px solid ${LINE}`,
        borderRadius: 9999,
        padding: `${11 * k}px ${20 * k}px ${11 * k}px ${14 * k}px`,
        boxShadow: SHADOW_CARD,
        opacity: inOut,
        pointerEvents: "none",
      }}
    >
      <span
        style={{
          width: 11 * k,
          height: 11 * k,
          borderRadius: "50%",
          background: tone,
          boxShadow: `0 0 ${(8 + 12 * (1 - since)) * k}px ${tone}`,
          flexShrink: 0,
        }}
      />
      <span style={{ ...mono(18 * k), color: ON }}>output.svg · #25</span>
      <span style={{ ...mono(17 * k), color: "rgba(255,255,255,0.18)" }}>·</span>
      <span
        style={{
          ...mono(17 * k),
          color: tone,
          opacity: 0.35 + 0.65 * since,
          translate: `0 ${lerp(7, 0, since) * k}px`,
          whiteSpace: "nowrap",
        }}
      >
        {cur.label}
      </span>
      <span style={{ ...cap(12 * k), color: "rgba(255,255,255,0.22)", marginLeft: 6 * k }}>
        {idx + 1}/{TRAIL.length}
      </span>
    </div>
  );
};

/* ── the strip ───────────────────────────────────────────────────────────── */

const Strip: React.FC = () => {
  const frame = useCurrentFrame();
  const abs = STRIP_T0 + frame / EP17_FPS;

  const ride = (pick: (k: Key) => number, easing: (n: number) => number) =>
    interpolate(abs, RIDE.map((r) => r.at), RIDE.map(pick), {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing,
    });

  const x = ride((r) => r.x, Easing.bezier(0.45, 0, 0.15, 1));
  const y = ride((r) => r.y, Easing.bezier(0.45, 0, 0.15, 1));
  const s = ride((r) => r.s, Easing.bezier(0.33, 0, 0.24, 1));

  return (
    <AbsoluteFill style={{ scale: `${s}` }}>
      <AbsoluteFill style={{ translate: `${-x}% ${-y}%` }}>
        <Station id="why" bg="blobs"><WhyHeavy /></Station>
        <Station id="egress" bg="lit"><Egress /></Station>
        <Station id="scope" bg="flat"><Scope /></Station>
        <Station id="keys" bg="canvas"><Keys /></Station>
        <Station id="presign" bg="deep"><Presign /></Station>
        <Station id="dryrun" bg="deep"><DryRun /></Station>
        <Station id="gzip" bg="flat"><Gzip /></Station>
        <Station id="crash" bg="deep"><Crash /></Station>
        <Station id="browser" bg="canvas"><Browser /></Station>
        <Station id="end" bg="field"><EndCard /></Station>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const LEAD = 1.2;
const bt = (sec: number) => sec + LEAD;

type BgKind = "blobs" | "lit" | "flat" | "deep" | "canvas" | "field";

const Station: React.FC<{ id: string; bg: BgKind; children: React.ReactNode }> = ({
  id,
  bg,
  children,
}) => {
  const frame = useCurrentFrame();
  const abs = STRIP_T0 + frame / EP17_FPS;
  return (
    <div
      style={{
        position: "absolute",
        left: `${cellOf(id)[0] * G}%`,
        top: `${cellOf(id)[1] * G}%`,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <ActBg kind={bg} atSeconds={abs} />
      {/* LOAD-BEARING. ActBg is a positioned sibling, and CSS paints positioned
          descendants above non-positioned in-flow ones regardless of DOM order.
          Without this wrapper every element that happens not to carry an
          opacity, transform or translate paints UNDERNEATH the background and
          vanishes — half a beat gone, the other half fine. */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Sequence
          from={F(at(id) - STRIP_T0 - LEAD)}
          durationInFrames={F(len(id) + LEAD + 0.4)}
          layout="none"
          name={id}
        >
          {children}
        </Sequence>
      </div>
    </div>
  );
};

/**
 * The act's ground. A dark film breathes in value too — it just does it between
 * #0D0D0D and #1E1E1E instead of between white and black, and the blobs are the
 * top of that range rather than a decoration laid on all of it.
 */
const ActBg: React.FC<{ kind: BgKind; atSeconds: number }> = ({ kind, atSeconds }) => {
  // THE BLOBS RUN UNDER EVERY STATION, not just the bright ones. In the product
  // they sit behind the whole app, and dropping them on the darker acts left
  // five stations on flat colour — which is most of why the first cut of this
  // film measured an order of magnitude less motion than EP16 despite having
  // the same amount of content. A dark act is a dimmer field, not no field.
  if (kind === "field") return <Blobs intensity={1.6} atSeconds={atSeconds} />;
  if (kind === "lit") return <Blobs intensity={1.25} atSeconds={atSeconds} />;
  if (kind === "blobs") return <Blobs atSeconds={atSeconds} />;
  if (kind === "canvas")
    return (
      <AbsoluteFill style={{ background: CANVAS }}>
        <Blobs intensity={0.75} atSeconds={atSeconds} ground="transparent" />
        <GridLines />
      </AbsoluteFill>
    );
  if (kind === "deep")
    return (
      <AbsoluteFill style={{ background: PANEL }}>
        <Blobs intensity={0.55} atSeconds={atSeconds} ground="transparent" />
        <GridLines />
      </AbsoluteFill>
    );
  return (
    <AbsoluteFill style={{ background: GROUND }}>
      <Blobs intensity={0.9} atSeconds={atSeconds} />
    </AbsoluteFill>
  );
};

const GridLines: React.FC = () => {
  const k = useK();
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `linear-gradient(${LINE_SUBTLE} 1px, transparent 1px), linear-gradient(90deg, ${LINE_SUBTLE} 1px, transparent 1px)`,
        backgroundSize: `${72 * k}px ${72 * k}px`,
        maskImage: "radial-gradient(120% 100% at 50% 50%, #000 30%, transparent 88%)",
        WebkitMaskImage: "radial-gradient(120% 100% at 50% 50%, #000 30%, transparent 88%)",
      }}
    />
  );
};

/* ── station 01 — why a vectoriser is heavy ──────────────────────────────── */

/**
 * The trade that causes the whole episode: tracing is lossy in the WRONG
 * direction for file size. The bars are the argument and they are drawn to
 * scale — 200 KB against 8.2 MB is a 41× ratio, so the small bar is genuinely
 * almost invisible. Faking that ratio to make a tidier chart would be lying
 * about the one number the beat exists to deliver.
 */
const WhyHeavy: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const grow = clamp01((frame - F(bt(1.6))) / F(2.4));
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Tag n="01">why it got heavy</Tag>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 30 * k }}>
        <Panel w={640} chrome="conversion pipeline" at={F(bt(0.3))}>
          <Row label="1 · quantise" value="colour clusters" at={F(bt(0.9))} />
          <Row label="2 · trace" value="potrace, per mask" at={F(bt(1.3))} />
          <Row label="3 · assemble" value="layers → one svg" at={F(bt(1.7))} />
          <Row label="paths out" value="one per colour region" at={F(bt(2.1))} hue={ACCENT} />
          <Row label="points per path" value="hundreds" at={F(bt(2.5))} last />
        </Panel>

        <Panel w={720} chrome="what that costs on disk" at={F(bt(0.7))} pad={30}>
          <SizeBar label="source photo" bytes="200 KB" frac={0.024} grow={grow} tone={ON_MID} />
          <div style={{ height: 26 * k }} />
          <SizeBar label="traced output.svg" bytes="8.2 MB" frac={1} grow={grow} tone={ACCENT} />
          <div
            style={{
              marginTop: 28 * k,
              paddingTop: 20 * k,
              borderTop: `1px solid ${LINE_SUBTLE}`,
              display: "flex",
              alignItems: "baseline",
              gap: 12 * k,
            }}
          >
            <Figure to={41} at={F(bt(2.4))} dur={F(1.4)} size={54 * k} suffix="×" color={ACCENT} />
            <span style={{ ...cap(15 * k), color: ON_DIM }}>bigger than what was uploaded</span>
          </div>
        </Panel>
      </div>
      <Note at={F(bt(4.2))}>
        Every colour region becomes its own path. The vector is not a compression
        of the image — it is a rebuild of it.
      </Note>
    </div>
  );
};

const SizeBar: React.FC<{
  label: string; bytes: string; frac: number; grow: number; tone: string;
}> = ({ label, bytes, frac, grow, tone }) => {
  const k = useK();
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 * k }}>
        <span style={{ ...cap(14 * k), color: ON_DIM }}>{label}</span>
        <span style={{ ...mono(20 * k), color: tone }}>{bytes}</span>
      </div>
      <div style={{ height: 20 * k, background: "rgba(255,255,255,0.04)", borderRadius: 6 * k }}>
        <div
          style={{
            height: "100%",
            width: `${frac * grow * 100}%`,
            minWidth: frac * grow > 0 ? 3 * k : 0,
            background: tone,
            borderRadius: 6 * k,
          }}
        />
      </div>
    </div>
  );
};

/* ── station 02 — choose on egress ───────────────────────────────────────── */

/**
 * The decisive number, made as a divergence rather than as a table: both stores
 * hold the same bytes, and the bill separates only because one of them charges
 * to hand them back. The counter runs the whole beat, which is also what stops
 * a two-panel comparison from being a still frame with prices on it.
 */
const Egress: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const t = clamp01((frame - F(bt(1.2))) / F(4.4));
  const gb = t * 500;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Tag n="02">choose on egress</Tag>
      <div style={{ display: "flex", alignItems: "center", gap: 26 * k }}>
        <CostCard
          name="S3 · standard"
          rate="$0.09 / GB out"
          cost={gb * 0.09}
          at={F(bt(0.3))}
          tone={BAD}
        />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 * k }}>
          <span style={{ ...cap(13 * k), color: ON_DIM }}>egress this month</span>
          <Figure to={500} at={F(bt(1.2))} dur={F(4.4)} size={56 * k} suffix=" GB" />
          <span style={{ ...cap(12 * k), color: ON_DIM }}>same bytes, both stores</span>
        </div>
        <CostCard
          name="Cloudflare R2"
          rate="$0.00 / GB out"
          cost={0}
          at={F(bt(0.7))}
          tone={ACCENT}
        />
      </div>
      <Note at={F(bt(4.4))}>
        Egress is not an occasional cost for a vectoriser — it is the cost, and it
        scales with exactly the thing you want more of.
      </Note>
    </div>
  );
};

const CostCard: React.FC<{
  name: string; rate: string; cost: number; at: number; tone: string;
}> = ({ name, rate, cost, at: a, tone }) => {
  const k = useK();
  return (
    <Panel w={440} chrome={name} at={a} pad={30}>
      <div style={{ ...cap(14 * k), color: ON_DIM }}>{rate}</div>
      <div style={{ ...mono(72 * k, 500), color: tone, marginTop: 16 * k }}>
        ${cost.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
      <div style={{ ...cap(13 * k), color: ON_DIM, marginTop: 10 * k }}>bandwidth this month</div>
    </Panel>
  );
};

/* ── station 03 — move the broken thing ──────────────────────────────────── */

const Scope: React.FC = () => {
  const k = useK();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Tag n="03">scope</Tag>
      <div style={{ display: "flex", gap: 30 * k, alignItems: "flex-start" }}>
        <Panel w={560} chrome="object storage" at={F(bt(0.3))}
          chromeRight={<Pulse hue={BAD} period={F(1.0)} />}>
          <Row label="quota" value="1 GB · exhausted" at={F(bt(0.9))} hue={BAD} />
          <Row label="symptom" value="uploads failing" at={F(bt(1.3))} hue={BAD} />
          <Row label="decision" value="MOVE" at={F(bt(1.7))} hue={ACCENT} />
          <Trace hue={BAD} start={F(bt(2.1))} />
        </Panel>
        <Panel w={560} chrome="postgres" at={F(bt(0.7))}
          chromeRight={<Pulse hue={ACCENT} period={F(2.4)} />}>
          <Row label="quota" value="well inside" at={F(bt(1.3))} />
          <Row label="symptom" value="none" at={F(bt(1.7))} />
          <Row label="decision" value="STAY" at={F(bt(2.1))} hue={ACCENT} />
          <Trace hue={ACCENT} start={F(bt(2.5))} />
        </Panel>
      </div>
      <div
        style={{
          marginTop: 40 * k,
          padding: `${26 * k}px ${34 * k}px`,
          borderLeft: `2px solid ${ACCENT}`,
          background: "rgba(20,184,166,0.06)",
          borderRadius: `0 ${RADIUS * k}px ${RADIUS * k}px 0`,
          opacity: useAppearAt(F(bt(2.8)), 200),
        }}
      >
        <span style={{ ...sf(38 * k, 600, -0.03), color: ON }}>
          Migrate the thing that&apos;s broken. Not the thing next to it.
        </span>
      </div>
      <Note at={F(bt(3.8))}>
        Moving Postgres would have meant every query, every RLS policy and the
        credits ledger — enormous risk, and none of it was full.
      </Note>
    </div>
  );
};


/** A status dot that keeps beating. The cheapest honest "this is live". */
const Pulse: React.FC<{ hue: string; period: number }> = ({ hue, period }) => {
  const k = useK();
  const t = useLoop(period);
  const glow = Math.pow(Math.max(0, Math.sin(t * Math.PI * 2)), 3);
  return (
    <span
      style={{
        width: 9 * k,
        height: 9 * k,
        borderRadius: "50%",
        background: hue,
        boxShadow: `0 0 ${(4 + 14 * glow) * k}px ${hue}`,
        opacity: 0.5 + 0.5 * glow,
      }}
    />
  );
};

/**
 * A sparkline that keeps drawing and wrapping. It is not decoration: the
 * storage side flatlines at its ceiling and the database side rolls along
 * healthily, so the two panels differ in MOTION as well as in words — which is
 * the argument the beat is making.
 */
const Trace: React.FC<{ hue: string; start: number }> = ({ hue, start }) => {
  const k = useK();
  const frame = useCurrentFrame();
  const p = clamp01((frame - start) / F(0.5));
  const t = useLoop(F(4.0));
  const W = 500, H = 54, N = 60;
  const capped = hue === BAD;
  const pts = Array.from({ length: N }).map((_, i) => {
    const x = (i / (N - 1)) * W;
    const phase = i / N + t;
    const wave = Math.sin(phase * Math.PI * 6) * 0.5 + Math.sin(phase * Math.PI * 11) * 0.25;
    // the storage trace is clamped at the ceiling — a flatline you can see
    const y = capped ? H * 0.16 : H * 0.5 - wave * H * 0.34;
    return `${i ? "L" : "M"} ${x.toFixed(1)} ${y.toFixed(1)}`;
  });
  return (
    <div style={{ padding: `${14 * k}px ${18 * k}px ${18 * k}px`, opacity: p }}>
      <svg width={W * k} height={H * k} viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
        <path d={pts.join(" ")} fill="none" stroke={hue} strokeWidth={2} opacity={0.85} />
        {capped && (
          <line x1={0} y1={H * 0.16} x2={W} y2={H * 0.16} stroke={hue} strokeWidth={1} strokeDasharray="4 5" opacity={0.5} />
        )}
      </svg>
    </div>
  );
};

/* ── station 04 — keys byte for byte ─────────────────────────────────────── */

/**
 * The decision that turned a dual-write migration into a file copy, shown as the
 * three key shapes with the bucket swapping underneath them and the keys not
 * moving at all. The bucket label is the only thing that changes on the whole
 * station — which is the point, made structurally instead of stated.
 */
const KEYS = [
  "projects/{userId}/{uuid}/{filename}",
  "projects/{projectId}/output.svg",
  "projects/{projectId}/versions/{hash}.svg",
];

const Keys: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const flipped = frame > F(bt(3.0));
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Tag n="04">the keys never changed</Tag>
      <Panel w={1180} chrome="object keys" at={F(bt(0.3))} pad={0}
        chromeRight={
          <span
            style={{
              ...mono(16 * k),
              color: flipped ? ACCENT : ON_MID,
              padding: `${5 * k}px ${12 * k}px`,
              borderRadius: 6 * k,
              background: flipped ? "rgba(20,184,166,0.10)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${flipped ? "rgba(20,184,166,0.18)" : LINE}`,
            }}
          >
            {flipped ? "cloudflare r2" : "supabase storage"}
          </span>
        }
      >
        {KEYS.map((key, i) => (
          <div
            key={key}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16 * k,
              padding: `${18 * k}px ${22 * k}px`,
              borderBottom: i === KEYS.length - 1 ? "none" : `1px solid ${LINE_SUBTLE}`,
              opacity: useAppearAt(F(bt(0.9)) + i * 8, 200),
            }}
          >
            <span
              style={{
                width: 8 * k, height: 8 * k, borderRadius: "50%",
                background: flipped ? ACCENT : ON_DIM, flexShrink: 0,
              }}
            />
            <span style={{ ...mono(24 * k), color: ON, flex: 1 }}>{key}</span>
            {/* the resolve check, running down the three keys forever. The
                point of the station is that these keys still resolve, and a
                check that keeps happening says that better than a tick that
                landed once and stopped. */}
            <Resolves index={i} />
          </div>
        ))}
      </Panel>

      <div style={{ display: "flex", gap: 20 * k, marginTop: 34 * k }}>
        <Stat label="database rows rewritten" value="0" at={F(bt(3.4))} hue={ACCENT} big />
        <Stat label="downtime window" value="none" at={F(bt(3.8))} />
        <Stat label="rollback" value="point back" at={F(bt(4.2))} />
      </div>
    </div>
  );
};

/**
 * A resolve check cycling down the key rows: each row lights in turn, holds,
 * and the cycle restarts. One clock for all three, so they read as one process
 * walking the list rather than three independent blinks.
 */
const Resolves: React.FC<{ index: number }> = ({ index }) => {
  const k = useK();
  const t = useLoop(F(3.2));
  const slot = t * 3;
  const on = slot > index && slot < index + 1.6;
  return (
    <span
      style={{
        ...mono(15 * k),
        color: on ? ACCENT : "rgba(255,255,255,0.16)",
        whiteSpace: "nowrap",
        transition: "none",
      }}
    >
      {on ? "200 · resolves" : "·"}
    </span>
  );
};

const Stat: React.FC<{
  label: string; value: string; at: number; hue?: string; big?: boolean;
}> = ({ label, value, at: a, hue, big = false }) => {
  const k = useK();
  const p = useAppearAt(a, 200);
  return (
    <div
      style={{
        background: CARD,
        border: `1px solid ${LINE}`,
        borderRadius: RADIUS * k,
        padding: `${22 * k}px ${30 * k}px`,
        boxShadow: SHADOW_CARD,
        opacity: p,
        translate: `0 ${lerp(10, 0, p) * k}px`,
        minWidth: 300 * k,
      }}
    >
      <div style={{ ...mono(big ? 56 * k : 38 * k, 500), color: hue ?? ON }}>{value}</div>
      <div style={{ ...cap(13 * k), color: ON_DIM, marginTop: 10 * k }}>{label}</div>
    </div>
  );
};

/* ── station 05 — presigning lies (ACT BREAK) ────────────────────────────── */

/**
 * The first station of the failure act and the most dangerous difference in the
 * whole migration, because it is invisible in the types: one API reports a
 * missing object by failing, the other cannot report it at all.
 *
 * The two panels resolve at DIFFERENT times on purpose — Supabase's error is
 * immediate, S3's 404 only arrives when the browser finally asks. The delay
 * between them IS the bug.
 */
const Presign: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const asked = frame > F(bt(2.0));
  const truth = frame > F(bt(4.0));
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Tag n="05">presigning a file that isn&apos;t there</Tag>
      <div style={{ display: "flex", gap: 26 * k, alignItems: "flex-start" }}>
        <Panel w={560} chrome="supabase · createSignedUrl()" at={F(bt(0.3))}>
          <Row label="object" value="missing" at={F(bt(0.9))} hue={ON_DIM} />
          <Row label="call" value="round-trips to the server" at={F(bt(1.3))} />
          <Row
            label="result"
            value={asked ? "error → placeholder" : "…"}
            at={F(bt(1.7))}
            hue={asked ? ACCENT : ON_DIM}
            last
          />
        </Panel>

        <Panel w={560} chrome="s3 / r2 · getSignedUrl()" at={F(bt(0.7))}>
          <Row label="object" value="missing" at={F(bt(1.3))} hue={ON_DIM} />
          <Row label="call" value="local maths · never leaves" at={F(bt(1.7))} hue={BAD} />
          <Row
            label="result"
            value={asked ? "a perfectly valid URL" : "…"}
            at={F(bt(2.1))}
            hue={asked ? BAD : ON_DIM}
            last
          />
        </Panel>
      </div>

      <div
        style={{
          marginTop: 30 * k,
          display: "flex",
          alignItems: "center",
          gap: 18 * k,
          opacity: truth ? 1 : 0.25,
        }}
      >
        <span style={{ ...cap(14 * k), color: ON_DIM }}>browser finally asks</span>
        <span
          style={{
            ...mono(26 * k, 500),
            color: truth ? BAD : ON_DIM,
            padding: `${9 * k}px ${18 * k}px`,
            borderRadius: 8 * k,
            background: truth ? "rgba(248,113,113,0.10)" : "rgba(255,255,255,0.03)",
            border: `1px solid ${truth ? "rgba(248,113,113,0.22)" : LINE}`,
          }}
        >
          404 · broken image
        </span>
        <span style={{ ...cap(14 * k), color: ON_DIM }}>fix · HeadObject before signing</span>
      </div>

      <Note at={F(bt(5.0))}>
        Audit what you relied on a dependency&apos;s errors to tell you — not just
        its successes.
      </Note>
    </div>
  );
};

/* ── station 06 — the dry run lied ───────────────────────────────────────── */

/**
 * Two causes, one output. The panels are deliberately IDENTICAL below the
 * chrome — that equality is the whole beat, and any styling that distinguished
 * them would quietly destroy it.
 */
const DryRun: React.FC = () => {
  const k = useK();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Tag n="06">the dry run lied, confidently</Tag>
      <div style={{ display: "flex", gap: 26 * k, alignItems: "center" }}>
        <Panel w={520} chrome="bucket genuinely empty" at={F(bt(0.3))}>
          <Row label="head object" value="throws" at={F(bt(1.0))} />
          <Row label="caught as" value="not present" at={F(bt(1.4))} />
          <Row label="plan" value={<Counting />} at={F(bt(1.8))} hue={ACCENT} last />
        </Panel>
        <span style={{ ...sf(40 * k, 600), color: ON_DIM }}>≡</span>
        <Panel w={520} chrome="credentials still placeholder" at={F(bt(0.6))}>
          <Row label="head object" value="throws" at={F(bt(1.2))} />
          <Row label="caught as" value="not present" at={F(bt(1.6))} />
          <Row label="plan" value={<Counting />} at={F(bt(2.0))} hue={BAD} last />
        </Panel>
      </div>
      <Note at={F(bt(3.2))}>
        Broken and nothing-to-do produced identical output. Fixed with a
        HeadBucket preflight that aborts before any work begins.
      </Note>
    </div>
  );
};


/**
 * The same count, arrived at two different ways. It keeps re-counting on a loop
 * rather than resolving once, because the beat's whole argument is that this
 * number is produced identically by a working scan and a broken one — and a
 * number sitting still is a number you stop interrogating.
 */
const Counting: React.FC = () => {
  const t = useLoop(F(3.6));
  const n = Math.round(1136 * Math.min(1, t / 0.72));
  return <>copy {n.toLocaleString("en-US")} objects</>;
};

/* ── station 07 — gzip made the comparison useless ───────────────────────── */

const Gzip: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const fixed = frame > F(bt(3.4));
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Tag n="07">a number that changed 4×</Tag>
      <div style={{ display: "flex", gap: 24 * k, alignItems: "center" }}>
        <Stat label="measured by full download" value="1,743 MB" at={F(bt(0.4))} />
        <span style={{ ...sf(34 * k, 600), color: ON_DIM }}>vs</span>
        <Stat
          label="measured by HEAD"
          value={fixed ? "1,743.04 MB" : "468 MB"}
          at={F(bt(0.9))}
          hue={fixed ? ACCENT : BAD}
        />
      </div>
      <Panel w={1020} chrome="why" at={F(bt(1.6))} style={{ marginTop: 34 * k }}>
        <Row label="supabase reports" value="gzipped content-length" at={F(bt(2.0))} hue={BAD} />
        <Row label="r2 stores" value="uncompressed bytes" at={F(bt(2.4))} />
        <Row label="so the skip check" value="never matched — re-copied everything" at={F(bt(2.8))} hue={BAD} />
        <Row
          label="fix"
          value={fixed ? "Accept-Encoding: identity" : "…"}
          at={F(bt(3.2))}
          hue={fixed ? ACCENT : ON_DIM}
          last
        />
      </Panel>
      <Note at={F(bt(4.2))}>
        When a number changes by 4× after a harmless optimisation, that is a bug,
        not a win.
      </Note>
    </div>
  );
};

/* ── station 08 — object 25 of 1,156 ─────────────────────────────────────── */

/**
 * Eight workers, one rejection, all eight gone — drawn as eight lanes so the
 * blast radius is a shape rather than a sentence. The lanes die together on one
 * frame, which is exactly what `Promise.all` does and exactly what the retry
 * version does not.
 */
const Crash: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  // Each worker runs at its OWN rate. Eight identical bars is a loading screen;
  // eight bars at eight lengths is a pool, and it is the only way the next beat
  // — all of them stopping on the same frame — reads as one event rather than
  // as the animation ending.
  const prog = clamp01((frame - F(bt(0.6))) / F(2.4));
  const dead = frame > F(bt(3.0));
  const recovered = frame > F(bt(5.6));
  const resume = clamp01((frame - F(bt(5.6))) / F(1.4));
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Tag n="08">one dropped connection</Tag>
      <Panel w={1160} chrome="worker pool · Promise.all" at={F(bt(0.3))} pad={30}
        chromeRight={
          <span style={{ ...mono(16 * k), color: dead && !recovered ? BAD : ACCENT }}>
            {recovered ? "retrying · backoff" : dead ? "all workers down" : "copying"}
          </span>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 9 * k }}>
          {[0.62, 0.78, 0.51, 0.9, 0.7, 0.44, 0.83, 0.58].map((rate, i) => {
            // where this worker had got to when the connection dropped
            const frozen = clamp01(prog * rate * 1.35);
            const lane = recovered ? lerp(frozen, 1, resume) : frozen;
            const gone = dead && !recovered;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 * k }}>
                <span style={{ ...cap(12 * k), color: ON_DIM, width: 74 * k }}>w{i + 1}</span>
                <div
                  style={{
                    flex: 1,
                    height: 12 * k,
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: 4 * k,
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${lane * 100}%`,
                      background: gone ? BAD : ACCENT,
                      borderRadius: 4 * k,
                      opacity: gone ? 0.5 : 1,
                    }}
                  />
                </div>
                <span style={{ ...mono(14 * k), color: gone ? BAD : recovered ? ACCENT : ON_DIM, width: 96 * k, textAlign: "right" }}>
                  {gone ? "killed" : recovered ? "resumed" : "copying"}
                </span>
              </div>
            );
          })}
        </div>
      </Panel>

      <div style={{ display: "flex", gap: 20 * k, marginTop: 30 * k }}>
        <Stat label="died at" value="object 25 / 1,156" at={F(bt(3.2))} hue={BAD} />
        <Stat label="cause" value="NGHTTP2_INTERNAL_ERROR" at={F(bt(3.6))} />
        <Stat label="shell reported" value="exit code 0" at={F(bt(4.0))} hue={BAD} />
      </div>
      <Note at={F(bt(4.6))}>
        Piped into grep, the pipeline returns the last command&apos;s status. Fixed
        with backoff, and a per-object catch so the run continues.
      </Note>
    </div>
  );
};

/* ── station 09 — the browser (ACT BREAK) ────────────────────────────────── */

/**
 * Two bugs stacked in one URL, and the order matters: fixing the CSP alone would
 * have swapped one error for another, because the checksum was already baked
 * into the signature. The URL is shown as the real thing with the two faults
 * lit inside it — a screenshot of a console error would say the same and teach
 * none of it.
 */
const Browser: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const litCsp = frame > F(bt(1.2));
  const litSum = frame > F(bt(2.6));
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Tag n="09">then it failed in the browser</Tag>

      <Panel w={1320} chrome="the presigned PUT, as the browser saw it" at={F(bt(0.3))} pad={28}>
        <div style={{ ...mono(21 * k), color: ON_MID, lineHeight: 1.75, wordBreak: "break-all" }}>
          <span style={{ color: litCsp ? BAD : ON_MID, background: litCsp ? "rgba(248,113,113,0.14)" : "transparent" }}>
            https://vectordrop-images.&lt;account&gt;.r2.cloudflarestorage.com
          </span>
          <span>/projects/…/output.svg?X-Amz-Algorithm=AWS4-HMAC-SHA256&amp;</span>
          <span style={{ color: litSum ? BAD : ON_MID, background: litSum ? "rgba(248,113,113,0.14)" : "transparent" }}>
            x-amz-checksum-crc32=AAAAAA%3D%3D
          </span>
          <span>&amp;x-amz-sdk-checksum-algorithm=CRC32</span>
        </div>
      </Panel>

      {/* This is the SHORTEST beat in the film — 6.4s, off the shortest line —
          so everything is pulled forward and the note lands with time left to
          read it. A closing line that arrives 1.4s before the cut is a line
          nobody read. */}
      <div style={{ display: "flex", gap: 24 * k, marginTop: 30 * k, alignItems: "flex-start" }}>
        <Panel w={640} chrome="1 · content-security-policy" at={F(bt(1.0))}>
          <Row label="connect-src" value="listed supabase only" at={F(bt(1.4))} hue={BAD} />
          <Row label="effect" value="refused before sending" at={F(bt(1.7))} hue={BAD} />
          <Row label="fix" value="derive host from R2_ACCOUNT_ID" at={F(bt(2.0))} hue={ACCENT} last />
        </Panel>
        <Panel w={640} chrome="2 · a checksum of nothing" at={F(bt(2.4))}>
          <Row label="AAAAAA==" value="crc32 of empty" at={F(bt(2.8))} hue={BAD} />
          <Row label="why" value="presigned before a body exists" at={F(bt(3.1))} />
          <Row label="fix" value="checksum: WHEN_REQUIRED" at={F(bt(3.4))} hue={ACCENT} last />
        </Panel>
      </div>

      <Note at={F(bt(3.9))}>
        Direct-to-storage uploads make your storage provider part of the
        frontend&apos;s security policy.
      </Note>
    </div>
  );
};

/* ── the end card ────────────────────────────────────────────────────────── */

const EndCard: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const fade = (a: number, b: number) =>
    interpolate(frame, [F(a), F(b)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const SIGN = 3.4;
  const out = fade(SIGN - 0.5, SIGN + 0.5);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ opacity: fade(0.15, 0.7) * (1 - 0.9 * out), position: "absolute" }}>
        <Results />
      </div>

      <div
        style={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: out,
        }}
      >
        <Img
          src={staticFile("brand/vectordrop.png")}
          style={{
            width: 76 * k,
            height: 76 * k,
            borderRadius: 17 * k,
            marginBottom: 30 * k,
            opacity: fade(SIGN, SIGN + 0.4),
          }}
        />
        <div
          style={{
            ...sf(92 * k, 700, -0.045),
            color: ON,
            translate: `0 ${interpolate(frame, [F(SIGN), F(SIGN + 0.7)], [26, 0], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.2, 1, 0.3, 1),
            }) * k}px`,
          }}
        >
          Thanks for watching.
        </div>
        <div
          style={{
            width: interpolate(frame, [F(SIGN + 0.7), F(SIGN + 2.4)], [0, 420 * k], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.25, 0, 0.15, 1),
            }),
            height: 3 * k,
            background: GRADIENT,
            marginTop: 32 * k,
          }}
        />
        <div style={{ marginTop: 32 * k, ...sf(36 * k, 500, -0.02), color: ON, opacity: fade(SIGN + 1.1, SIGN + 1.6) }}>
          Bishakh
        </div>
        <div style={{ marginTop: 18 * k, ...cap(19 * k), color: ON_MID, opacity: fade(SIGN + 1.6, SIGN + 2.1) }}>
          {cfg.next}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** What actually shipped. The only place in the film these numbers appear. */
const RESULTS: [string, string, string?][] = [
  ["copied", "1,091", ""],
  ["already present", "45", ""],
  ["total in r2", "1,136 / 1,136", ACCENT],
  ["data transferred", "1.69 GB", ""],
  ["failed", "0", ACCENT],
  ["database rows rewritten", "0", ACCENT],
];

const Results: React.FC = () => {
  const k = useK();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ ...cap(17 * k), color: ON_DIM, marginBottom: 26 * k }}>the result</div>
      <Panel w={860} at={F(0.3)}>
        {RESULTS.map(([label, value, hue], i) => (
          <Row
            key={label}
            label={label}
            value={value}
            at={F(0.8) + i * 6}
            hue={hue || undefined}
            last={i === RESULTS.length - 1}
          />
        ))}
      </Panel>
    </div>
  );
};

/* ── the mix ─────────────────────────────────────────────────────────────── */

const OPEN = 0.34;
const UNDER = 0.15;
const HAS_VO = Boolean(cfg.audio?.vo);

const bedVolume = (f: number) => {
  const t = f / EP17_FPS;
  const ramp = 0.55;
  let v = OPEN;
  if (HAS_VO) {
    for (const [a, b] of VO_WINDOWS) {
      if (t > a - ramp && t < b + ramp) {
        const into = clamp01((t - (a - ramp)) / ramp);
        const outOf = clamp01((b + ramp - t) / ramp);
        v = Math.min(v, lerp(OPEN, UNDER, Math.min(into, outOf)));
      }
    }
  }
  const head = clamp01(t / 1.2);
  const tail = clamp01((EP17_SECONDS - t) / 1.6);
  return v * head * tail;
};

const Track: React.FC = () => (
  <>
    {cfg.audio?.music && (
      <Sequence from={0} durationInFrames={EP17_DURATION} layout="none" name="score">
        <Audio src={staticFile("audio/music/bed.mp3")} volume={bedVolume} />
      </Sequence>
    )}

    {HAS_VO &&
      DEFS.map((d, i) =>
        d.vo ? (
          <Sequence key={d.id} from={F(START[i])} layout="none" name={`vo ${d.vo}`}>
            <Audio src={staticFile(`audio/vo/scene${d.vo}.mp3`)} volume={1} />
          </Sequence>
        ) : null,
      )}

    {/* the travel: a whoosh across, a riser-into-thunk on the two lifts */}
    {STRIP_IDS.map((id) =>
      isActBreak(id) ? (
        <React.Fragment key={id}>
          <Cue name="riser" at={F(at(id) - 1.35)} volume={0.24} />
          <Cue name="thunk" at={F(at(id) - 0.06)} volume={0.3} />
        </React.Fragment>
      ) : (
        <Cue key={id} name="whoosh" at={F(at(id) - 0.25)} volume={0.2} />
      ),
    )}

    {/* the act slates landing */}
    {ACTS.map((a) => (
      <React.Fragment key={a.n}>
        <Cue name="thunk" at={F(a.at + 0.06)} volume={0.32} />
        <Cue name="latch" at={F(a.at + 0.95)} volume={0.24} />
      </React.Fragment>
    ))}

    {/* the beats that earn a real sound */}
    <Cue name="thunk" at={F(at("title") + 0.35)} volume={0.34} />
    <Cue name="error" at={F(at("open") + 2.6)} volume={0.28} />
    <Cue name="latch" at={F(at("why") + bt(2.4))} volume={0.26} />
    <Cue name="notify" at={F(at("egress") + bt(1.2))} volume={0.24} />
    <Cue name="sub" at={F(at("scope") + bt(2.8))} volume={0.3} />
    <Cue name="click" at={F(at("keys") + bt(3.0))} volume={0.32} />
    <Cue name="success" at={F(at("keys") + bt(3.4))} volume={0.28} />
    <Cue name="error" at={F(at("presign") + bt(4.0))} volume={0.3} />
    <Cue name="error" at={F(at("dryrun") + bt(2.0))} volume={0.24} />
    <Cue name="success" at={F(at("gzip") + bt(3.4))} volume={0.28} />
    {/* eight lanes dying on one frame, then the recovery */}
    <Cue name="error" at={F(at("crash") + bt(3.0))} volume={0.34} />
    <Cue name="latch" at={F(at("crash") + bt(5.6))} volume={0.26} />
    <Cue name="error" at={F(at("browser") + bt(1.2))} volume={0.26} />
    <Cue name="error" at={F(at("browser") + bt(2.6))} volume={0.26} />
    <Cue name="thunk" at={F(at("end") + 0.3)} volume={0.34} />
    {/* the results landing, one row at a time */}
    {RESULTS.map((_, i) => (
      <Cue key={`r${i}`} name="tick" at={F(at("end") + 0.8) + i * 6} volume={0.16} />
    ))}
    <Cue name="success" at={F(at("end") + 3.4)} volume={0.3} />
  </>
);
