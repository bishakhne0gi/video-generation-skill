// Author: Bishakh
//
// EP 13 — "The port, the wire, and the loop"
// MCP, traced against cosx-mcp: 15 read-only tools, stdio + Auth0-gated HTTP.
//
// WORKSPACE REGISTER WITH NARRATION. The CosX MARS construction — one
// continuous canvas the camera travels, named agent cursors operating it — but
// this film teaches, so it carries a voice. That combination is new here and
// the balance it needs is specific:
//
//   • The cursors still have to CAUSE things, but they no longer have to carry
//     the argument, because the narration does. So there are fewer of them,
//     they act less often, and they stay out of the reading path entirely.
//   • The strip earns its keep differently. In MARS it stopped the film going
//     slack; here it stops fifteen separate diagrams reading as fifteen
//     unrelated screens, which is the exact failure that kills a twelve-beat
//     explainer around beat five.
//   • The marquee is the teaching instrument. On the two beats where the
//     narration says "look at this part", a cursor draws the box and the frame
//     goes there — so the viewer sees the selection being made rather than
//     being told about it.
//
// EVERY NUMBER ON SCREEN IS REAL and comes from the source artifact: 12 private
// contracts, 7 implementations, protocol revision 2025-06-18, {"tools": {}},
// 15 tools, -32601, 20 of 340. Nothing here is illustrative.

import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { World, WorldItem, useTypeCam } from "../lib/space";
import {
  AgentCursors,
  MarqueeZoom,
  type Agent,
  type CursorKey,
} from "../lib/agents";
import { Cue, TypeCues } from "../lib/sound";
import { Thread } from "../lib/motifs";
import { snapUp } from "../lib/tempo";
import { buildPalette, alpha } from "../theme";
import { HEAD, MONO, SANS } from "../fonts";
import {
  useK,
  useAppearAt,
  useLoop,
  stagger,
  lerp,
  clamp01,
} from "../lib/anim";
import cfg from "../../episode.config.json";
import durs from "../../vo-durations.json";

export const EP13_FPS = 30;
export const PAL13 = buildPalette("mars-cream");

const F = (n: number) => Math.round(n * EP13_FPS);

/* ── the schedule ────────────────────────────────────────────────────────────
 *
 * Scene seconds = VO + 0.35s breath, snapped UP to the 84bpm beat grid, so the
 * line always finishes AND the cut lands on the music. Never hand-guessed —
 * `vo-durations.json` is the source of truth.
 *
 * Two beats carry no VO on purpose. The title and the end card are where the
 * bed lifts to `open`, and a score that never lifts is the difference between
 * a film that is scored and a film with music playing under it.
 * ─────────────────────────────────────────────────────────────────────────── */

const BREATH = 0.35;

type BeatDef = {
  id: string;
  /** 1-based scene in episode.config.json, or omit for a silent beat. */
  vo?: number;
  /** Seconds, for silent beats only. */
  hold?: number;
};

const DEFS: BeatDef[] = [
  { id: "open", vo: 1 }, // a model is a text function
  { id: "title", hold: 4.6 }, // ── silent: the bed lifts
  { id: "mxn", vo: 2 }, // 3 × 4 = 12 private contracts
  { id: "mpn", vo: 3 }, // 3 + 4 = 7 implementations
  { id: "roles", vo: 4 }, // host / client / server   ← MARQUEE
  { id: "exposes", vo: 5 }, // tools / resources / prompts
  { id: "tool", vo: 6 }, // the search_meetings contract
  { id: "wire", vo: 7 }, // three envelope shapes
  { id: "handshake", vo: 8 }, // initialize → initialized → list → call
  { id: "loop", vo: 9 }, // where the model actually sits ← MARQUEE
  { id: "transports", vo: 10 }, // stdio vs streamable HTTP
  { id: "failure", vo: 11 }, // protocol error vs isError
  { id: "auth", vo: 12 }, // authn ≠ authz
  { id: "context", vo: 13 }, // context economics
  { id: "end", hold: 6.2 }, // ── silent: the bed lifts again
];

const LEN = DEFS.map((d) =>
  d.vo ? snapUp(durs[d.vo - 1] + BREATH) : snapUp(d.hold ?? 4),
);
const START: number[] = [];
DEFS.reduce((acc, _d, i) => {
  START[i] = acc;
  return acc + LEN[i];
}, 0);

const at = (id: string) => START[DEFS.findIndex((d) => d.id === id)];
const len = (id: string) => LEN[DEFS.findIndex((d) => d.id === id)];
const endOf = (id: string) => at(id) + len(id);

export const EP13_SECONDS = START[START.length - 1] + LEN[LEN.length - 1];
export const EP13_DURATION = Math.round(EP13_SECONDS * EP13_FPS);

/** Windows where a line is actually playing — the score ducks against these. */
const VO_WINDOWS = DEFS.map((d, i) =>
  d.vo ? [START[i], START[i] + durs[d.vo - 1]] : null,
).filter(Boolean) as [number, number][];

/* ── the canvas ──────────────────────────────────────────────────────────────
 *
 * Every beat after the title is a station on one vertical strip. The camera
 * holds while a line plays and travels in the last 0.9s of each beat, so the
 * frame is never still at a boundary and the viewer never re-orients.
 * ─────────────────────────────────────────────────────────────────────────── */

const STRIP_FROM = 2; // "mxn" — the strip starts after the title
const STRIP_IDS = DEFS.slice(STRIP_FROM).map((d) => d.id);
const STATION_GAP = 100; // % of frame height
const TRAVEL = 0.9;

const stationOf = (id: string) => STRIP_IDS.indexOf(id) * STATION_GAP;

const RIDE: { at: number; y: number }[] = [];
STRIP_IDS.forEach((id, i) => {
  const s = at(id);
  const y = i * STATION_GAP;
  if (i === 0) RIDE.push({ at: s, y });
  else {
    RIDE.push({ at: s - TRAVEL, y: (i - 1) * STATION_GAP });
    RIDE.push({ at: s, y });
  }
});
RIDE.push({ at: endOf("end"), y: (STRIP_IDS.length - 1) * STATION_GAP });

/* ── the cast ────────────────────────────────────────────────────────────── */
//
// Three, not five. With a narrator carrying the argument, a full roster競 for
// attention with the voice — the cursors are here to make two selections and
// to keep the film feeling operated, nothing more.

const HOST: Agent = { name: "host", color: PAL13.accent };
const CLIENT: Agent = { name: "client", color: "#2E7DF6" };
const SERVER: Agent = { name: "server", color: "#12A594" };

// No roster. `MarqueeZoom` draws its own cursor at the live corner of the box
// it is dragging, so the only two cursors in this film are the two that are
// actually doing something — the server selecting its own card, and the host
// closing a box around the approval gate. A cursor that is not mid-gesture has
// no business on a teaching frame; it competes with the reading.
void CLIENT;
void SERVER;
void HOST;

/* ── the film ────────────────────────────────────────────────────────────── */

export const Ep13: React.FC = () => (
  <AbsoluteFill style={{ background: PAL13.bg }}>
    <Sequence
      from={0}
      durationInFrames={F(len("open"))}
      name="1 · a text function"
    >
      <ColdOpen />
    </Sequence>

    <Sequence
      from={F(at("title"))}
      durationInFrames={F(len("title"))}
      name="2 · title"
    >
      <TitleCard />
    </Sequence>

    <Sequence
      from={F(at("mxn"))}
      durationInFrames={EP13_DURATION - F(at("mxn"))}
      name="3–15 · the strip"
    >
      <Strip />
    </Sequence>

    <Thread pal={PAL13} from={at("mxn")} to={endOf("context")} />

    <Track />
  </AbsoluteFill>
);

/* ── beat 1 — the cold open ──────────────────────────────────────────────── */

/**
 * The caret camera from MARS, put to work as an argument rather than a title:
 * the sentence being typed IS the claim, and it resolves at the same moment the
 * frame does. Then the three things it cannot reach fade up around it, greyed,
 * so the limitation is visible before the narration finishes naming it.
 */
const ColdOpen: React.FC = () => {
  const frame = useCurrentFrame();
  const k = useK();
  const TEXT = "A language model is a text function.";
  const cam = useTypeCam({
    text: TEXT,
    world: { x: 0, y: 0, w: 1700 },
    start: 8,
    cps: 16,
    zoomIn: 7,
    zoomOut: 1,
    settle: 0.9,
  });

  const CANT = ["your minutes", "Postgres", "a file"];

  return (
    <AbsoluteFill>
      <World view={cam.view}>
        <WorldItem x={0} y={0} w={1700} h={220}>
          <div
            style={{
              fontFamily: HEAD,
              fontWeight: 800,
              fontSize: 96,
              letterSpacing: "-0.05em",
              color: PAL13.ink,
              whiteSpace: "nowrap",
              lineHeight: 1,
            }}
          >
            {cam.visible}
            <span
              style={{
                opacity: cam.typing && frame % 26 < 15 ? 1 : 0,
                fontWeight: 400,
              }}
            >
              |
            </span>
          </div>
        </WorldItem>
      </World>

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "62%",
          translate: "-50% -50%",
          display: "flex",
          gap: 26 * k,
        }}
      >
        {CANT.map((c, i) => (
          <Unreachable key={c} label={c} at={F(4.4) + stagger(i, 12)} k={k} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

/** A thing the model cannot reach: struck through, held at arm's length. */
const Unreachable: React.FC<{ label: string; at: number; k: number }> = ({
  label,
  at: a,
  k,
}) => {
  const p = useAppearAt(a, 200);
  return (
    <div
      style={{
        opacity: p * 0.75,
        translate: `0 ${lerp(12, 0, p) * k}px`,
        fontFamily: MONO,
        fontSize: 32 * k,
        letterSpacing: "0.04em",
        color: PAL13.textMuted,
        border: `1px dashed ${PAL13.borderMid}`,
        borderRadius: 10 * k,
        padding: `${10 * k}px ${18 * k}px`,
        textDecoration: "line-through",
        textDecorationColor: `${PAL13.accent}${alpha(0.7)}`,
      }}
    >
      {label}
    </div>
  );
};

/* ── beat 2 — the title ──────────────────────────────────────────────────── */

const TitleCard: React.FC = () => {
  const frame = useCurrentFrame();
  const k = useK();
  const words = ["The port,", "the wire,", "and the loop"];
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          fontFamily: MONO,
          fontSize: 26 * k,
          letterSpacing: "0.3em",
          color: PAL13.textMuted,
          marginBottom: 30 * k,
          opacity: interpolate(frame, [0, F(0.4)], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        MODEL CONTEXT PROTOCOL
      </div>
      <div
        style={{
          textAlign: "center",
          fontFamily: HEAD,
          fontWeight: 800,
          fontSize: 104 * k,
          letterSpacing: "-0.05em",
          lineHeight: 1.04,
        }}
      >
        {words.map((w, i) => (
          <div
            key={w}
            style={{
              color: i === 2 ? PAL13.accent : PAL13.ink,
              opacity: interpolate(
                frame,
                [F(0.35) + i * 7, F(0.35) + i * 7 + 12],
                [0, 1],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                },
              ),
              translate: `0 ${
                interpolate(
                  frame,
                  [F(0.35) + i * 7, F(0.35) + i * 7 + 20],
                  [34, 0],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.bezier(0.2, 1, 0.3, 1),
                  },
                ) * k
              }px`,
            }}
          >
            {w}
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 34 * k,
          fontFamily: MONO,
          fontSize: 24 * k,
          letterSpacing: "0.12em",
          color: PAL13.textMuted,
          opacity: interpolate(frame, [F(1.5), F(2.1)], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        JSON-RPC 2.0 · revision 2025-06-18 · stdio + HTTP
      </div>
    </AbsoluteFill>
  );
};

/* ── beats 3–15 — the strip ──────────────────────────────────────────────── */

const Strip: React.FC = () => {
  const frame = useCurrentFrame();
  const abs = at("mxn") + frame / EP13_FPS;

  const y = interpolate(
    abs,
    RIDE.map((r) => r.at),
    RIDE.map((r) => r.y),
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.45, 0, 0.15, 1),
    },
  );

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ translate: `0 ${-y}%` }}>
        <Station id="mxn">
          <MxN />
        </Station>
        <Station id="mpn">
          <MPlusN />
        </Station>
        <Station id="roles">
          <Roles />
        </Station>
        <Station id="exposes">
          <Exposes />
        </Station>
        <Station id="tool">
          <ToolContract />
        </Station>
        <Station id="wire">
          <Wire />
        </Station>
        <Station id="handshake">
          <Handshake />
        </Station>
        <Station id="loop">
          <Loop />
        </Station>
        <Station id="transports">
          <Transports />
        </Station>
        <Station id="failure">
          <Failure />
        </Station>
        <Station id="auth">
          <Auth />
        </Station>
        <Station id="context">
          <Context />
        </Station>
        <Station id="end">
          <EndCard />
        </Station>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * One stop. Content is mounted from 1.2s before the camera arrives — a station
 * that populates on arrival reads as a slide loading; one already assembling as
 * you approach reads as a place you are travelling to.
 */
/** Seconds a station is mounted before the camera reaches it. */
const LEAD = 1.2;
/** Beat-seconds → station-local seconds. Marquee timings are authored in beat
 *  time; without this they fire LEAD early. */
const bt = (sec: number) => sec + LEAD;

const Station: React.FC<{ id: string; children: React.ReactNode }> = ({
  id,
  children,
}) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      top: `${stationOf(id)}%`,
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Sequence
      from={F(at(id) - at("mxn") - LEAD)}
      durationInFrames={F(len(id) + LEAD + 0.4)}
      layout="none"
      name={id}
    >
      {children}
    </Sequence>
  </div>
);

/* ── icons ──────────────────────────────────────────────────────────────────
 *
 * A labelled rectangle is a rectangle. The same rectangle with a database
 * cylinder in it is a DATABASE, and the viewer knows that before they have read
 * a word — which is the entire reason to spend twenty lines on a glyph set. One
 * weight, one corner radius, one size, so they read as a family rather than as
 * clip art.
 * ─────────────────────────────────────────────────────────────────────────── */

type IcoName =
  | "assistant" | "db" | "cloud" | "ticket" | "doc" | "server" | "host" | "plug"
  | "wrench" | "file" | "chat" | "terminal" | "globe" | "shield" | "person";

const Ico: React.FC<{ name: IcoName; size: number; color: string }> = ({ name, size, color }) => {
  const P: Record<IcoName, React.ReactNode> = {
    assistant: <><rect x="3" y="4" width="18" height="14" rx="2.5" /><path d="M8 21h8M12 18v3" /></>,
    db: <><ellipse cx="12" cy="6" rx="8" ry="3" /><path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6" /><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" /></>,
    cloud: <path d="M6.5 18h11a3.5 3.5 0 0 0 .3-7 5.5 5.5 0 0 0-10.6-1.2A4 4 0 0 0 6.5 18Z" />,
    ticket: <><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M9 6v12" /></>,
    doc: <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4M9 12h6M9 16h6" /></>,
    server: <><rect x="3" y="4" width="18" height="7" rx="1.6" /><rect x="3" y="13" width="18" height="7" rx="1.6" /><path d="M7 7.5h.01M7 16.5h.01" /></>,
    host: <><rect x="2.5" y="4" width="19" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></>,
    plug: <><path d="M9 3v6M15 3v6" /><path d="M6 9h12v3a6 6 0 0 1-12 0z" /><path d="M12 18v3" /></>,
    wrench: <path d="M15.5 3a5.5 5.5 0 0 0-4.9 8L3 18.6 5.4 21l7.6-7.6a5.5 5.5 0 0 0 2.5-10.4Z" />,
    file: <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4" /></>,
    chat: <path d="M4 5h16v11H9l-5 4V5Z" />,
    terminal: <><rect x="2.5" y="4" width="19" height="16" rx="2" /><path d="M7 9l3 3-3 3M13 15h4" /></>,
    globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 3 2.5 15 0 18-2.5-3-2.5-15 0-18Z" /></>,
    shield: <path d="M12 3l8 3v6c0 5-3.4 8.2-8 9-4.6-.8-8-4-8-9V6l8-3Z" />,
    person: <><circle cx="12" cy="8" r="3.4" /><path d="M5 20c1.2-3.6 4-5.4 7-5.4s5.8 1.8 7 5.4" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.7}
      strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flexShrink: 0 }}>
      {P[name]}
    </svg>
  );
};

/* ── shared ─────────────────────────────────────────────────────────────── */

const Eyebrow: React.FC<{ children: React.ReactNode; n?: string }> = ({ children, n }) => {
  const k = useK();
  const a = useAppearAt(2, 200);
  return (
    <div style={{ display: "flex", gap: 14 * k, alignItems: "baseline", marginBottom: 34 * k, opacity: a }}>
      {n && <span style={{ fontFamily: MONO, fontSize: 25 * k, color: PAL13.accent }}>{n}</span>}
      <span style={{ fontFamily: MONO, fontSize: 25 * k, letterSpacing: "0.22em", color: PAL13.textMuted }}>
        {children}
      </span>
    </div>
  );
};

const Note: React.FC<{ at: number; children: React.ReactNode }> = ({ at: a, children }) => {
  const k = useK();
  const p = useAppearAt(a, 200);
  return (
    <div style={{ marginTop: 30 * k, fontFamily: SANS, fontSize: 31 * k, color: PAL13.textBody,
      opacity: p, translate: `0 ${lerp(8, 0, p) * k}px`, textAlign: "center" }}>
      {children}
    </div>
  );
};

/* ── the coordinate space ────────────────────────────────────────────────────
 *
 * Every diagram is authored in ONE fixed design space and scaled as a unit.
 * This is not tidiness: the previous version positioned boxes with flexbox and
 * then drew the connecting lines with hand-guessed SVG coordinates, so the
 * lines never actually touched the boxes. If the boxes and the wires do not
 * share a coordinate system, they will always disagree.
 * ─────────────────────────────────────────────────────────────────────────── */

const CW = 1760;

const Canvas: React.FC<{ h?: number; children: React.ReactNode }> = ({ h = 900, children }) => {
  const k = useK();
  return <div style={{ position: "relative", width: CW * k, height: h * k }}>{children}</div>;
};

const Lane: React.FC<{ y: number; label: string; at: number }> = ({ y, label, at: a }) => {
  const k = useK();
  const p = useAppearAt(a, 200);
  return (
    <div style={{ position: "absolute", left: 0, top: y * k, width: CW * k, opacity: p }}>
      <div style={{ fontFamily: MONO, fontSize: 24 * k, letterSpacing: "0.24em", color: PAL13.textMuted, marginBottom: 8 * k }}>
        {label}
      </div>
      <div style={{ height: 1, width: "100%", background: PAL13.borderMid }} />
    </div>
  );
};

/** A box on the canvas, with an optional glyph. */
const NodeBox: React.FC<{
  x: number; y: number; w: number; h: number;
  title: string; sub?: string; icon?: IcoName; tone?: string; dashed?: boolean; at: number;
}> = ({ x, y, w, h, title, sub, icon, tone = PAL13.borderMid, dashed = false, at: a }) => {
  const k = useK();
  const p = useAppearAt(a, 180);
  return (
    <div style={{
      position: "absolute", left: x * k, top: y * k, width: w * k, height: h * k,
      borderRadius: 14 * k,
      background: dashed ? `${tone}${alpha(0.1)}` : PAL13.surface,
      border: `${dashed ? 2.5 : 1.5}px ${dashed ? "dashed" : "solid"} ${tone}`,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: 6 * k, opacity: p, scale: `${lerp(0.93, 1, p)}`,
    }}>
      {icon && <Ico name={icon} size={30 * k} color={tone} />}
      <div style={{ fontFamily: MONO, fontSize: 26 * k, color: PAL13.ink }}>{title}</div>
      {sub && <div style={{ fontFamily: SANS, fontSize: 21 * k, color: PAL13.textMuted }}>{sub}</div>}
    </div>
  );
};

/** A labelled connector, drawn on, with a packet running it once drawn. */
const Link: React.FC<{
  pts: [number, number][]; label?: string; at: number; dur?: number;
  tone?: string; flow?: boolean; labelAt?: [number, number]; h?: number;
}> = ({ pts, label, at: a, dur = 24, tone = PAL13.borderMid, flow = true, labelAt, h = 900 }) => {
  const k = useK();
  const frame = useCurrentFrame();
  const p = clamp01((frame - a) / dur);
  const t = useLoop(70, a / 200);
  const d = pts.map((q, i) => `${i ? "L" : "M"} ${q[0]} ${q[1]}`).join(" ");
  let pos = pts[0];
  if (p > 0.99 && flow) {
    const segs = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]));
    const total = segs.reduce((x, y) => x + y, 0);
    let want = t * total;
    for (let i = 0; i < segs.length; i++) {
      if (want <= segs[i]) {
        const u = want / Math.max(0.001, segs[i]);
        pos = [lerp(pts[i][0], pts[i + 1][0], u), lerp(pts[i][1], pts[i + 1][1], u)];
        break;
      }
      want -= segs[i];
    }
  }
  const [lx, ly] = labelAt ?? [
    (pts[0][0] + pts[pts.length - 1][0]) / 2,
    (pts[0][1] + pts[pts.length - 1][1]) / 2 - 20,
  ];
  const end = pts[pts.length - 1];
  const prev = pts[pts.length - 2] ?? pts[0];
  const ang = (Math.atan2(end[1] - prev[1], end[0] - prev[0]) * 180) / Math.PI;
  return (
    <>
      <svg style={{ position: "absolute", left: 0, top: 0, width: CW * k, height: h * k, overflow: "visible", pointerEvents: "none" }}
        viewBox={`0 0 ${CW} ${h}`}>
        <path d={d} fill="none" stroke={tone} strokeWidth={2.2} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
        {p > 0.98 && <polygon points="0,-6 12,0 0,6" fill={tone} transform={`translate(${end[0]},${end[1]}) rotate(${ang})`} />}
        {p > 0.99 && flow && <circle cx={pos[0]} cy={pos[1]} r={5} fill={PAL13.accent} opacity={0.85} />}
      </svg>
      {label && p > 0.4 && (
        <div style={{
          position: "absolute", left: lx * k, top: ly * k, translate: "-50% -50%",
          fontFamily: MONO, fontSize: 21 * k, color: PAL13.textBody,
          background: PAL13.bg, padding: `${2 * k}px ${8 * k}px`,
          opacity: clamp01((p - 0.4) / 0.4), whiteSpace: "nowrap",
        }}>{label}</div>
      )}
    </>
  );
};

const Counter: React.FC<{ value: number; suffix: string }> = ({ value, suffix }) => {
  const k = useK();
  return (
    <div style={{ marginTop: 26 * k, display: "flex", gap: 16 * k, alignItems: "baseline" }}>
      <span style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 82 * k, letterSpacing: "-0.04em", color: PAL13.accent }}>
        {value}
      </span>
      <span style={{ fontFamily: MONO, fontSize: 26 * k, letterSpacing: "0.1em", color: PAL13.textMuted }}>{suffix}</span>
    </div>
  );
};

/* ── beat 3 — twelve private contracts ───────────────────────────────────── */

const APPS: { t: string; i: IcoName }[] = [
  { t: "Assistant A", i: "assistant" },
  { t: "Assistant B", i: "assistant" },
  { t: "Assistant C", i: "assistant" },
];
const SRCS: { t: string; i: IcoName }[] = [
  { t: "Postgres", i: "db" },
  { t: "Drive", i: "cloud" },
  { t: "Jira", i: "ticket" },
  { t: "Minutes", i: "doc" },
];

const MH = 720;                       // canvas height for these two beats
const LX = 70, LW = 330, LH = 150;    // left column
const RX = 1360, RW = 330, RH = 132;  // right column
const LY = [40, 250, 460];            // left tops
const RY = [20, 200, 380, 560];       // right tops
const lc = (i: number) => LY[i] + LH / 2;
const rc = (j: number) => RY[j] + RH / 2;

const MxN: React.FC = () => {
  const frame = useCurrentFrame();
  const drawn = clamp01((frame - F(1.6)) / F(4.6));
  // Hoisted deliberately: calling this inside the `p > 0.99` branch below makes
  // the hook count change the moment a line finishes drawing, which is React
  // error #310 and a hard render failure rather than a visual bug.
  const traffic = useLoop(64);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Eyebrow n="01">BEFORE — M × N</Eyebrow>
      <Canvas h={MH}>
        {APPS.map((a, i) => (
          <NodeBox key={a.t} x={LX} y={LY[i]} w={LW} h={LH} title={a.t} icon={a.i} tone={PAL13.accent} at={stagger(i, 12, 26)} />
        ))}
        {SRCS.map((r, j) => (
          <NodeBox key={r.t} x={RX} y={RY[j]} w={RW} h={RH} title={r.t} icon={r.i} tone={CLIENT.color} at={stagger(j, 10, 40)} />
        ))}
        {APPS.map((_, i) =>
          SRCS.map((__, j) => {
            const idx = i * 4 + j;
            const p = clamp01(drawn * 12 - idx);
            return (
              <svg key={`${i}-${j}`}
                style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", overflow: "visible", pointerEvents: "none" }}
                viewBox={`0 0 ${CW} ${MH}`}>
                <line x1={LX + LW} y1={lc(i)} x2={RX} y2={rc(j)}
                  stroke={PAL13.borderMid} strokeWidth={1.6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
                {p > 0.99 && (
                  <circle
                    cx={LX + LW + (RX - LX - LW) * ((traffic + idx * 0.083) % 1)}
                    cy={lc(i) + (rc(j) - lc(i)) * ((traffic + idx * 0.083) % 1)}
                    r={4} fill={PAL13.accent} opacity={0.65} />
                )}
              </svg>
            );
          }),
        )}
      </Canvas>
      <Counter value={Math.round(drawn * 12)} suffix="private contracts" />
    </div>
  );
};

/* ── beat 4 — seven implementations of one contract ──────────────────────── */

const SRVS: { t: string; i: IcoName }[] = [
  { t: "db server", i: "db" },
  { t: "drive server", i: "cloud" },
  { t: "jira server", i: "ticket" },
  { t: "cosx-mcp", i: "server" },
];
const BX = 800, BW = 130;

const MPlusN: React.FC = () => {
  const frame = useCurrentFrame();
  const grow = clamp01((frame - F(1.4)) / F(1.6));
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Eyebrow n="01">AFTER — M + N</Eyebrow>
      <Canvas h={MH}>
        {APPS.map((a, i) => (
          <NodeBox key={a.t} x={LX} y={LY[i]} w={LW} h={LH} title={a.t} icon={a.i} tone={PAL13.accent} at={stagger(i, 12, 22)} />
        ))}
        <div style={{
          position: "absolute", left: BX * useK(), top: 40 * useK(),
          width: BW * useK(), height: 570 * useK() * grow,
          borderRadius: 12 * useK(), border: `2.5px solid ${PAL13.accent}`,
          background: `${PAL13.accent}${alpha(0.12)}`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30 * useK(), letterSpacing: "0.24em",
            color: PAL13.accent, writingMode: "vertical-rl", opacity: grow }}>MCP</span>
        </div>
        {SRVS.map((r, j) => (
          <NodeBox key={r.t} x={RX} y={RY[j]} w={RW} h={RH} title={r.t} icon={r.i}
            tone={r.t === "cosx-mcp" ? SERVER.color : CLIENT.color} at={stagger(j, 10, 70)} />
        ))}
        {APPS.map((_, i) => (
          <Link key={`l${i}`} pts={[[LX + LW, lc(i)], [BX, 325]]} at={40 + i * 6} dur={18} h={MH} />
        ))}
        {SRVS.map((_, j) => (
          <Link key={`r${j}`} pts={[[BX + BW, 325], [RX, rc(j)]]} at={70 + j * 6} dur={18} h={MH} tone={CLIENT.color} />
        ))}
      </Canvas>
      <Counter value={7} suffix="implementations of one contract" />
      <Note at={F(6.6)}>the lines did not get shorter — they got standard</Note>
    </div>
  );
};

/* ── beat 5 — host, client, server ───────────────────────────────────────── */

const Roles: React.FC = () => {
  const k = useK();
  const R = [
    { t: "HOST", h: "the app the human uses", b: "owns the model, the conversation, the prompts", c: HOST.color, i: "host" as IcoName },
    { t: "CLIENT", h: "one connector per server", b: "exactly one session with exactly one server", c: CLIENT.color, i: "plug" as IcoName },
    { t: "SERVER", h: "a capability, wrapped", b: "no idea a model exists — JSON-RPC in, rows out", c: SERVER.color, i: "server" as IcoName },
  ];
  return (
    <MarqueeZoom pal={PAL13} agent={SERVER} rect={{ x: 51, y: 29, w: 37, h: 40 }}
      drag={[bt(5.6), bt(6.3)]} hold={0.34} push={1.0} release={bt(len("roles") - 1.6)} releaseDur={0.7}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Eyebrow n="02">HOST · CLIENT · SERVER</Eyebrow>
          <div style={{ display: "flex", gap: 38 * k }}>
            {R.map((r, i) => <RoleCard key={r.t} {...r} at={stagger(i, 42, 34)} />)}
          </div>
          <Note at={F(8.4)}>sessions are strictly 1:1</Note>
        </div>
      </AbsoluteFill>
    </MarqueeZoom>
  );
};

const RoleCard: React.FC<{ t: string; h: string; b: string; c: string; i: IcoName; at: number }> = ({
  t, h, b, c, i, at: a,
}) => {
  const k = useK();
  const p = useAppearAt(a, 190);
  return (
    <div style={{
      width: 400 * k, padding: `${30 * k}px ${28 * k}px ${32 * k}px`, borderRadius: 18 * k,
      background: PAL13.surface, border: `1px solid ${PAL13.border}`,
      borderTop: `4px solid ${c}`, opacity: p, translate: `0 ${lerp(16, 0, p) * k}px`,
    }}>
      <div style={{
        width: 62 * k, height: 62 * k, borderRadius: 14 * k, marginBottom: 20 * k,
        background: `${c}${alpha(0.14)}`, display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Ico name={i} size={34 * k} color={c} />
      </div>
      <div style={{ fontFamily: MONO, fontSize: 22 * k, letterSpacing: "0.2em", color: c }}>{t}</div>
      <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 34 * k, letterSpacing: "-0.02em", color: PAL13.ink, marginTop: 10 * k, lineHeight: 1.15 }}>
        {h}
      </div>
      <div style={{ fontFamily: SANS, fontSize: 25 * k, lineHeight: 1.4, color: PAL13.textMuted, marginTop: 14 * k }}>{b}</div>
    </div>
  );
};

/* ── beat 6 — what a server exposes ──────────────────────────────────────── */

const Exposes: React.FC = () => {
  const k = useK();
  const P = [
    { n: "tools", who: "the model", w: "functions with a JSON Schema", d: "tools/list", c: PAL13.accent, i: "wrench" as IcoName },
    { n: "resources", who: "the application", w: "read-only context the host attaches", d: "resources/list", c: CLIENT.color, i: "file" as IcoName },
    { n: "prompts", who: "the user", w: "templates the human picks", d: "prompts/list", c: SERVER.color, i: "chat" as IcoName },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Eyebrow n="03">WHAT A SERVER EXPOSES — AND WHO DECIDES</Eyebrow>
      <div style={{ display: "flex", gap: 34 * k }}>
        {P.map((x, i) => <PrimCard key={x.n} {...x} at={stagger(i, 46, 34)} />)}
      </div>
      <Note at={F(8.2)}>cosx-mcp declares one capability — {'{"tools": {}}'} — and 15 read-only tools</Note>
    </div>
  );
};

const PrimCard: React.FC<{ n: string; who: string; w: string; d: string; c: string; i: IcoName; at: number }> = ({
  n, who, w, d, c, i, at: a,
}) => {
  const k = useK();
  const p = useAppearAt(a, 190);
  return (
    <div style={{
      width: 420 * k, padding: `${28 * k}px`, borderRadius: 18 * k,
      background: PAL13.surface, border: `1px solid ${PAL13.border}`, borderTop: `4px solid ${c}`,
      opacity: p, translate: `0 ${lerp(16, 0, p) * k}px`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 * k }}>
        <div style={{ width: 56 * k, height: 56 * k, borderRadius: 13 * k, background: `${c}${alpha(0.14)}`,
          display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Ico name={i} size={31 * k} color={c} />
        </div>
        <span style={{ fontFamily: MONO, fontSize: 34 * k, color: c }}>{n}</span>
      </div>
      <div style={{ fontFamily: SANS, fontSize: 25 * k, color: PAL13.textBody, marginTop: 20 * k, lineHeight: 1.35 }}>{w}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 * k, marginTop: 20 * k }}>
        <span style={{ fontFamily: SANS, fontSize: 21 * k, color: PAL13.textMuted }}>controlled by</span>
        <span style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 22 * k, color: PAL13.ink }}>{who}</span>
      </div>
      <div style={{ marginTop: 16 * k, display: "inline-block", fontFamily: MONO, fontSize: 21 * k,
        color: c, background: `${c}${alpha(0.1)}`, borderRadius: 8 * k, padding: `${7 * k}px ${12 * k}px` }}>
        {d}
      </div>
    </div>
  );
};

/* ── beat 7 — the tool contract ──────────────────────────────────────────── */

const CodeCard: React.FC<{
  title: string; lines: string[]; hot?: number[]; at?: number; per?: number; width?: number; lit?: boolean;
}> = ({ title, lines, hot = [], at: a = 32, per = 12, width = 1220, lit = true }) => {
  const k = useK();
  const glow = 0.5 + 0.5 * Math.sin(useLoop(70) * Math.PI * 2);
  return (
    <div style={{ width: width * k, background: PAL13.surface, border: `1px solid ${PAL13.border}`,
      borderLeft: `4px solid ${PAL13.accent}`, borderRadius: 14 * k, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 * k, padding: `${12 * k}px ${20 * k}px`,
        borderBottom: `1px solid ${PAL13.border}` }}>
        <Ico name="terminal" size={22 * k} color={PAL13.textMuted} />
        <span style={{ fontFamily: MONO, fontSize: 20 * k, color: PAL13.textMuted, letterSpacing: "0.08em" }}>{title}</span>
      </div>
      <div style={{ padding: `${22 * k}px ${26 * k}px`, fontFamily: MONO, fontSize: 25 * k, lineHeight: 1.5 }}>
        {lines.map((l, i) => (
          <CodeRow key={i} line={l} hot={hot.includes(i) && lit} at={a + i * per} glow={glow} />
        ))}
      </div>
    </div>
  );
};

const CodeRow: React.FC<{ line: string; hot: boolean; at: number; glow: number }> = ({ line, hot, at: a, glow }) => {
  const p = useAppearAt(a, 200);
  return (
    <div style={{ whiteSpace: "pre", opacity: p, color: hot ? PAL13.ink : PAL13.textBody,
      background: hot ? `${PAL13.accent}${alpha(0.1 + 0.06 * glow)}` : "transparent" }}>
      {line}
    </div>
  );
};

const ToolContract: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Eyebrow n="03">ONE ENTRY FROM tools/list</Eyebrow>
      <CodeCard
        title="tools/list → response"
        width={1280}
        at={30}
        per={11}
        hot={[2, 3]}
        lit={frame > F(4.6)}
        lines={[
          `{`,
          `  "name": "search_meetings",`,
          `  "description": "Cheap; returns snippets.`,
          `                  Follow with get_meeting for detail.",`,
          `  "inputSchema": {`,
          `    "properties": {`,
          `      "query":  {"type": "string"},`,
          `      "limit":  {"type": "integer", "default": 20}`,
          `    }`,
          `  }`,
          `}`,
        ]}
      />
      <Note at={F(6.6)}>that description is prompt engineering, not documentation</Note>
    </div>
  );
};

/* ── beat 8 — the wire format ────────────────────────────────────────────── */

const Wire: React.FC = () => {
  const k = useK();
  const S = [
    { tone: PAL13.accent, tag: "request", body: `{"jsonrpc":"2.0","id":7,"method":"tools/call"}`, note: "has an id · expects exactly one response", hot: `"id":7`, i: "chat" as IcoName },
    { tone: SERVER.color, tag: "notification", body: `{"jsonrpc":"2.0","method":"notifications/initialized"}`, note: "no id · no response may EVER be sent", hot: null, i: "globe" as IcoName },
    { tone: CLIENT.color, tag: "response", body: `{"jsonrpc":"2.0","id":7,"result":{…}}`, note: "matched by id · result or error, never both", hot: `"id":7`, i: "file" as IcoName },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 * k }}>
      <Eyebrow n="04">JSON-RPC 2.0 AND NOTHING ELSE</Eyebrow>
      {S.map((x, i) => <Envelope key={x.tag} {...x} at={stagger(i, 62, 34)} />)}
    </div>
  );
};

const Envelope: React.FC<{
  tag: string; body: string; note: string; hot: string | null; at: number; tone: string; i: IcoName;
}> = ({ tag, body, note, hot, at: a, tone, i }) => {
  const k = useK();
  const p = useAppearAt(a, 190);
  const parts = hot ? body.split(hot) : [body];
  return (
    <div style={{ width: 1300 * k, display: "flex", gap: 20 * k, alignItems: "center",
      opacity: p, translate: `0 ${lerp(12, 0, p) * k}px` }}>
      <div style={{ width: 60 * k, height: 60 * k, borderRadius: 14 * k, background: `${tone}${alpha(0.14)}`,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Ico name={i} size={30 * k} color={tone} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: MONO, fontSize: 23 * k, letterSpacing: "0.14em", color: tone, marginBottom: 6 * k }}>
          {tag}
        </div>
        <div style={{ fontFamily: MONO, fontSize: 26 * k, color: PAL13.ink, background: PAL13.surface,
          border: `1px solid ${PAL13.border}`, borderLeft: `4px solid ${tone}`, borderRadius: 10 * k,
          padding: `${14 * k}px ${18 * k}px`, whiteSpace: "pre" }}>
          {parts.map((t, n) => (
            <React.Fragment key={n}>
              {t}
              {n < parts.length - 1 && hot && (
                <span style={{ background: `${tone}${alpha(0.26)}`, borderRadius: 4, padding: "0 4px" }}>{hot}</span>
              )}
            </React.Fragment>
          ))}
        </div>
        <div style={{ fontFamily: SANS, fontSize: 23 * k, color: PAL13.textMuted, marginTop: 7 * k }}>{note}</div>
      </div>
    </div>
  );
};

/* ── beat 9 — the handshake ──────────────────────────────────────────────── */

const Handshake: React.FC = () => {
  const k = useK();
  const M = [
    { dir: "→", t: "initialize", s: "protocolVersion, clientInfo", tone: PAL13.accent },
    { dir: "←", t: "2025-06-18", s: 'capabilities {"tools": {}}', tone: CLIENT.color },
    { dir: "→", t: "notifications/initialized", s: "no id → no reply, ever", tone: SERVER.color },
    { dir: "→", t: "tools/list", s: "15 tool specs", tone: PAL13.accent },
    { dir: "←", t: "content[] · isError", s: "repeats for the session", tone: CLIENT.color },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Eyebrow n="05">THE LIFECYCLE, MESSAGE BY MESSAGE</Eyebrow>
      <div style={{ display: "flex", justifyContent: "space-between", width: 1280 * k, marginBottom: 20 * k }}>
        <span style={{ display: "flex", gap: 12 * k, alignItems: "center", fontFamily: MONO, fontSize: 24 * k, letterSpacing: "0.2em", color: PAL13.textMuted }}>
          <Ico name="plug" size={26 * k} color={PAL13.textMuted} /> CLIENT
        </span>
        <span style={{ display: "flex", gap: 12 * k, alignItems: "center", fontFamily: MONO, fontSize: 24 * k, letterSpacing: "0.2em", color: PAL13.textMuted }}>
          SERVER <Ico name="server" size={26 * k} color={PAL13.textMuted} />
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 22 * k, width: 1280 * k }}>
        {M.map((m, i) => <Msg key={i} {...m} at={stagger(i, 44, 34)} />)}
      </div>
    </div>
  );
};

const Msg: React.FC<{ dir: string; t: string; s: string; tone: string; at: number }> = ({ dir, t, s, tone, at: a }) => {
  const k = useK();
  const p = useAppearAt(a, 200);
  const fly = useLoop(58, a / 120);
  const rtl = dir === "←";
  return (
    <div style={{ opacity: p, translate: `${lerp(rtl ? 30 : -30, 0, p) * k}px 0` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 * k, flexDirection: rtl ? "row-reverse" : "row" }}>
        <span style={{ fontFamily: MONO, fontSize: 30 * k, color: tone }}>{dir}</span>
        <span style={{ fontFamily: MONO, fontSize: 29 * k, color: PAL13.ink }}>{t}</span>
        <div style={{ position: "relative", flex: 1, height: 1.5, background: PAL13.border }}>
          <span style={{ position: "absolute", left: `${(rtl ? 1 - fly : fly) * 100}%`, top: -3 * k,
            width: 8 * k, height: 7 * k, borderRadius: "50%", background: tone, opacity: p * 0.9 }} />
        </div>
        <span style={{ fontFamily: SANS, fontSize: 23 * k, color: PAL13.textMuted }}>{s}</span>
      </div>
    </div>
  );
};

/* ── beat 10 — where the model actually sits ─────────────────────────────── */

const Loop: React.FC = () => {
  const HOSTC = PAL13.accent;
  const WIRE = SERVER.color;
  return (
    <MarqueeZoom pal={PAL13} agent={HOST} rect={{ x: 40.5, y: 27, w: 20, h: 14.5 }}
      drag={[bt(4.6), bt(5.3)]} hold={0.36} push={1.05} release={bt(len("loop") - 1.6)} releaseDur={0.9}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <Canvas>
          <Lane y={10} label="HUMAN" at={24} />
          <Lane y={190} label="HOST APPLICATION" at={30} />
          <Lane y={556} label="MCP WIRE" at={36} />

          <NodeBox x={30} y={72} w={340} h={78} title={"“what’s overdue?”"} icon="person" at={34} />
          <NodeBox x={24} y={258} w={330} h={104} title="assemble" sub="prompt + 15 schemas" tone={HOSTC} at={44} />
          <NodeBox x={410} y={258} w={270} h={104} title="MODEL" sub="emits intent" tone={HOSTC} at={58} />
          <NodeBox x={740} y={258} w={300} h={104} title="approval gate" sub="human may refuse" icon="shield" tone={HOSTC} dashed at={72} />
          <NodeBox x={1100} y={258} w={300} h={104} title="MCP client" sub="builds envelope" icon="plug" tone={HOSTC} at={86} />
          <NodeBox x={690} y={640} w={360} h={104} title="cosx-mcp" sub="dispatch → handler" icon="server" tone={WIRE} at={104} />
          <NodeBox x={1180} y={640} w={290} h={104} title="Postgres" sub="filtered by user" icon="db" tone={WIRE} at={118} />

          <Link pts={[[200, 154], [200, 252]]} at={40} flow={false} />
          <Link pts={[[358, 310], [404, 310]]} label="tools" at={56} />
          <Link pts={[[684, 310], [734, 310]]} label="intent" at={70} />
          <Link pts={[[1044, 310], [1094, 310]]} label="approved" at={84} />
          <Link pts={[[1255, 366], [1255, 500], [880, 500], [880, 634]]} label="tools/call" labelAt={[1075, 478]} at={100} dur={30} tone={WIRE} />
          <Link pts={[[1054, 672], [1174, 672]]} label="SELECT" at={116} tone={WIRE} />
          <Link pts={[[1174, 714], [1056, 714]]} label="rows" at={128} tone={WIRE} />
          <Link pts={[[690, 692], [500, 692], [500, 400], [545, 400], [545, 366]]} label="content[] → context" labelAt={[640, 545]} at={140} dur={34} tone={HOSTC} />
        </Canvas>
      </AbsoluteFill>
    </MarqueeZoom>
  );
};

/* ── beat 11 — transports ────────────────────────────────────────────────── */

const Transports: React.FC = () => {
  const k = useK();
  const COLS = [
    { name: "stdio", i: "terminal" as IcoName, c: PAL13.accent,
      rows: [["Shape", "host spawns a child process"], ["Framing", "one JSON message per line"], ["Auth", "none — inherits the env"], ["Lifetime", "dies with the host"]] },
    { name: "Streamable HTTP", i: "globe" as IcoName, c: CLIENT.color,
      rows: [["Shape", "long-running HTTP endpoint"], ["Framing", "one JSON-RPC body per POST"], ["Auth", "OAuth 2.1 bearer token"], ["Lifetime", "independent, many users"]] },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Eyebrow n="07">SAME MESSAGES, TWO PIPES</Eyebrow>
      <div style={{ display: "flex", gap: 40 * k }}>
        {COLS.map((col, ci) => (
          <div key={col.name} style={{
            width: 620 * k, borderRadius: 18 * k, background: PAL13.surface,
            border: `1px solid ${PAL13.border}`, borderTop: `4px solid ${col.c}`,
            padding: `${28 * k}px`, opacity: useAppearAt(34 + ci * 40, 190),
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 * k, marginBottom: 24 * k }}>
              <div style={{ width: 56 * k, height: 56 * k, borderRadius: 13 * k, background: `${col.c}${alpha(0.14)}`,
                display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Ico name={col.i} size={31 * k} color={col.c} />
              </div>
              <span style={{ fontFamily: MONO, fontSize: 32 * k, color: col.c }}>{col.name}</span>
            </div>
            {col.rows.map((r, ri) => (
              <TRow key={r[0]} label={r[0]} value={r[1]} at={54 + ci * 40 + ri * 12} />
            ))}
          </div>
        ))}
      </div>
      <div style={{
        marginTop: 30 * k, background: `${PAL13.accent}${alpha(0.1)}`,
        border: `1px solid ${PAL13.accent}${alpha(0.45)}`, borderRadius: 12 * k,
        padding: `${18 * k}px ${28 * k}px`, fontFamily: MONO, fontSize: 26 * k, color: PAL13.ink,
        opacity: useAppearAt(F(8.4), 200), display: "flex", alignItems: "center", gap: 14 * k,
      }}>
        <Ico name="terminal" size={26 * k} color={PAL13.accent} />
        stdout is the protocol channel — logs go to stderr
      </div>
    </div>
  );
};

const TRow: React.FC<{ label: string; value: string; at: number }> = ({ label, value, at: a }) => {
  const k = useK();
  const p = useAppearAt(a, 200);
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 16 * k, padding: `${13 * k}px 0`,
      borderTop: `1px solid ${PAL13.border}`, opacity: p }}>
      <span style={{ width: 150 * k, fontFamily: MONO, fontSize: 21 * k, letterSpacing: "0.12em", color: PAL13.textMuted, flexShrink: 0 }}>
        {label.toUpperCase()}
      </span>
      <span style={{ fontFamily: SANS, fontSize: 25 * k, color: PAL13.textBody }}>{value}</span>
    </div>
  );
};

/* ── beat 12 — two kinds of failure ──────────────────────────────────────── */

const Failure: React.FC = () => {
  const k = useK();
  const CODES = [
    ["-32700", "malformed JSON"],
    ["-32600", "missing jsonrpc or method"],
    ["-32601", "unknown method or tool"],
    ["-32602", "arguments not an object"],
    ["-32603", "unhandled exception"],
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Eyebrow n="08">TWO KINDS OF FAILURE</Eyebrow>
      <div style={{ display: "flex", gap: 40 * k, alignItems: "stretch" }}>
        <Panel title="error" sub="transport fault — the model never sees it" tint={PAL13.textMuted} i="globe" at={32}>
          {CODES.map((c, i) => (
            <CodeLine key={c[0]} code={c[0]} what={c[1]} at={stagger(i, 26, 60)} hot={c[0] === "-32601"} />
          ))}
        </Panel>
        <Panel title="isError: true" sub="lands in context — the model recovers" tint={PAL13.accent} i="chat" at={110}>
          <div style={{ fontFamily: MONO, fontSize: 26 * k, color: PAL13.ink, lineHeight: 1.6,
            background: `${PAL13.accent}${alpha(0.08)}`, borderRadius: 10 * k, padding: `${16 * k}px ${18 * k}px`,
            opacity: useAppearAt(F(4.6), 200) }}>
            "Meeting not found or you
            <br />do not have access: 8f2c…"
          </div>
          <div style={{ fontFamily: SANS, fontSize: 24 * k, color: PAL13.textMuted, marginTop: 20 * k,
            opacity: useAppearAt(F(7.2), 200) }}>
            so it realises it guessed the wrong id, and searches instead
          </div>
        </Panel>
      </div>
    </div>
  );
};

const Panel: React.FC<{ title: string; sub: string; tint: string; i: IcoName; at: number; children: React.ReactNode }> = ({
  title, sub, tint, i, at: a, children,
}) => {
  const k = useK();
  const p = useAppearAt(a, 190);
  return (
    <div style={{ width: 620 * k, padding: `${28 * k}px`, background: PAL13.surface,
      border: `1px solid ${PAL13.border}`, borderTop: `4px solid ${tint}`, borderRadius: 18 * k,
      opacity: p, translate: `0 ${lerp(14, 0, p) * k}px` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 * k }}>
        <div style={{ width: 52 * k, height: 52 * k, borderRadius: 12 * k, background: `${tint}${alpha(0.14)}`,
          display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Ico name={i} size={28 * k} color={tint} />
        </div>
        <span style={{ fontFamily: MONO, fontSize: 30 * k, color: tint }}>{title}</span>
      </div>
      <div style={{ fontFamily: SANS, fontSize: 23 * k, color: PAL13.textMuted, marginTop: 10 * k, marginBottom: 22 * k }}>{sub}</div>
      {children}
    </div>
  );
};

const CodeLine: React.FC<{ code: string; what: string; at: number; hot?: boolean }> = ({ code, what, at: a, hot }) => {
  const k = useK();
  const p = useAppearAt(a, 200);
  return (
    <div style={{ display: "flex", gap: 18 * k, opacity: p, marginBottom: 11 * k, alignItems: "baseline" }}>
      <span style={{ fontFamily: MONO, fontSize: 26 * k, color: hot ? PAL13.accent : PAL13.textBody, width: 130 * k }}>{code}</span>
      <span style={{ fontFamily: SANS, fontSize: 24 * k, color: PAL13.textMuted }}>{what}</span>
    </div>
  );
};

/* ── beat 13 — authorization ≠ authentication ────────────────────────────── */

const Auth: React.FC = () => {
  const k = useK();
  const RULES: { e: string; who: string; tone: string; i: IcoName }[] = [
    { e: "Meeting", who: "direct members only — no cascade", tone: PAL13.accent, i: "doc" },
    { e: "Customer", who: "direct members; admins see all", tone: CLIENT.color, i: "person" },
    { e: "Project", who: "members, or an owner/editor cascade", tone: CLIENT.color, i: "ticket" },
    { e: "BRD / PRD", who: "anyone who can view the project", tone: SERVER.color, i: "file" },
    { e: "Knowledge", who: "anyone who can view the customer", tone: SERVER.color, i: "cloud" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Eyebrow n="10">AUTHORIZATION ≠ AUTHENTICATION</Eyebrow>
      <div style={{ display: "flex", gap: 44 * k, alignItems: "flex-start" }}>
        <div>
          <CodeCard
            title="backend/app/mcp/tools/base.py"
            width={700}
            at={34}
            per={20}
            hot={[3]}
            lines={[
              "@dataclass(frozen=True)",
              "class ToolContext:",
              "    session: AsyncSession",
              "    user: User    # non-optional",
            ]}
          />
          <div style={{ marginTop: 24 * k, fontFamily: SANS, fontSize: 26 * k, lineHeight: 1.4,
            color: PAL13.textBody, width: 700 * k, opacity: useAppearAt(F(5.4), 200) }}>
            No nullable user, so there is no unscoped path to forget.
          </div>
        </div>
        <div style={{ width: 840 * k }}>
          {RULES.map((r, i) => <VisRow key={r.e} {...r} at={stagger(i, 26, 96)} />)}
        </div>
      </div>
    </div>
  );
};

const VisRow: React.FC<{ e: string; who: string; tone: string; i: IcoName; at: number }> = ({ e, who, tone, i, at: a }) => {
  const k = useK();
  const p = useAppearAt(a, 200);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18 * k, padding: `${14 * k}px ${18 * k}px`,
      marginBottom: 8 * k, background: PAL13.surface, borderLeft: `4px solid ${tone}`, borderRadius: 10 * k,
      opacity: p, translate: `${lerp(14, 0, p) * k}px 0` }}>
      <Ico name={i} size={26 * k} color={tone} />
      <span style={{ fontFamily: MONO, fontSize: 25 * k, color: tone, width: 190 * k }}>{e}</span>
      <span style={{ fontFamily: SANS, fontSize: 24 * k, color: PAL13.textBody }}>{who}</span>
    </div>
  );
};

/* ── beat 14 — context economics ─────────────────────────────────────────── */

const Context: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const shown = Math.round(clamp01((frame - F(1.4)) / F(3.4)) * 20);
  const fill = clamp01((frame - F(1.4)) / F(3.4)) * (20 / 340);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Eyebrow n="11">CONTEXT ECONOMICS</Eyebrow>
      <div style={{ display: "flex", gap: 20 * k, alignItems: "baseline" }}>
        <span style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 140 * k, letterSpacing: "-0.05em", color: PAL13.accent }}>
          {shown}
        </span>
        <span style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 70 * k, letterSpacing: "-0.04em", color: PAL13.textMuted }}>
          of 340
        </span>
      </div>
      {/* the bar IS the argument: what the model saw against what existed */}
      <div style={{ width: 1100 * k, height: 34 * k, borderRadius: 8 * k, background: PAL13.surfaceMid,
        border: `1px solid ${PAL13.border}`, marginTop: 30 * k, overflow: "hidden" }}>
        <div style={{ width: `${fill * 100}%`, height: "100%", background: PAL13.accent }} />
      </div>
      <Note at={F(5.4)}>a model that got 20 of 340 answers as though it saw everything</Note>
      <div style={{ marginTop: 26 * k, fontFamily: MONO, fontSize: 27 * k, color: PAL13.ink,
        background: PAL13.surface, border: `1px solid ${PAL13.border}`, borderLeft: `4px solid ${PAL13.accent}`,
        borderRadius: 10 * k, padding: `${18 * k}px ${24 * k}px`, opacity: useAppearAt(F(7.0), 200) }}>
        {"{ returned: 20, total_matching: 340, truncated: true }"}
      </div>
    </div>
  );
};

/* ── beat 15 — the sign-off ──────────────────────────────────────────────── */

const EndCard: React.FC = () => {
  const k = useK();
  const frame = useCurrentFrame();
  const fade = (a: number, b: number) =>
    interpolate(frame, [F(a), F(b)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 92 * k, letterSpacing: "-0.05em",
        color: PAL13.ink, opacity: fade(0.2, 0.7),
        translate: `0 ${interpolate(frame, [F(0.2), F(0.9)], [26, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.2, 1, 0.3, 1) }) * k}px` }}>
        Thanks for watching.
      </div>
      <div style={{ width: interpolate(frame, [F(0.9), F(3.4)], [0, 420 * k], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.25, 0, 0.15, 1) }),
        height: 3 * k, background: PAL13.accent, marginTop: 34 * k }} />
      <div style={{ marginTop: 32 * k, fontFamily: HEAD, fontWeight: 700, fontSize: 40 * k,
        letterSpacing: "-0.02em", color: PAL13.accent, opacity: fade(1.4, 1.9) }}>
        Bishakh
      </div>
      <div style={{ marginTop: 16 * k, fontFamily: MONO, fontSize: 24 * k, letterSpacing: "0.2em",
        color: PAL13.textMuted, opacity: fade(2.1, 2.6) }}>
        FOLLOW FOR MORE
      </div>
    </div>
  );
};

/* ── the mix ─────────────────────────────────────────────────────────────── */

/**
 * The bed sits at `open` and ducks to `under` while a line plays, off the SAME
 * schedule the picture uses so it cannot drift from the cut. The two silent
 * beats — the title and the end card — are where it lifts the full 7dB, which
 * is the entire reason they exist.
 */
const OPEN = 0.34;
const UNDER = 0.15;

const bedVolume = (f: number) => {
  const t = f / EP13_FPS;
  const ramp = 0.55;
  let v = OPEN;
  for (const [a, b] of VO_WINDOWS) {
    if (t > a - ramp && t < b + ramp) {
      const into = clamp01((t - (a - ramp)) / ramp);
      const outOf = clamp01((b + ramp - t) / ramp);
      v = Math.min(v, lerp(OPEN, UNDER, Math.min(into, outOf)));
    }
  }
  // top and tail
  const head = clamp01(t / 1.2);
  const tail = clamp01((EP13_SECONDS - t) / 1.6);
  return v * head * tail;
};

const Track: React.FC = () => (
  <>
    <Sequence
      from={0}
      durationInFrames={EP13_DURATION}
      layout="none"
      name="score"
    >
      <Audio src={staticFile("audio/music/bed.mp3")} volume={bedVolume} />
    </Sequence>

    {DEFS.map((d, i) =>
      d.vo ? (
        <Sequence
          key={d.id}
          from={F(START[i])}
          layout="none"
          name={`vo ${d.vo}`}
        >
          <Audio src={staticFile(`audio/vo/scene${d.vo}.mp3`)} volume={1} />
        </Sequence>
      ) : null,
    )}

    {/* the type-on under the cold open */}
    <Sequence from={0} layout="none" name="cues · cold open">
      <TypeCues
        text="A language model is a text function."
        start={8}
        cps={16}
        every={2}
        volume={0.14}
      />
    </Sequence>

    {/* one cue per station arrival — the travel resolving, nothing else */}
    {STRIP_IDS.map((id) => (
      <Cue key={id} name="whoosh" at={F(at(id) - 0.25)} volume={0.2} />
    ))}

    {/* the beats that earn a real sound */}
    <Cue name="thunk" at={F(at("title") + 0.35)} volume={0.34} />
    <Cue name="latch" at={F(at("mpn") + 1.0)} volume={0.3} />
    <Cue name="click" at={F(at("roles") + 5.4)} volume={0.32} />
    <Cue name="sub" at={F(at("roles") + 6.3)} volume={0.3} />
    <Cue name="click" at={F(at("loop") + 4.6)} volume={0.32} />
    <Cue name="sub" at={F(at("loop") + 5.6)} volume={0.3} />
    <Cue name="error" at={F(at("failure") + 2.0)} volume={0.22} />
    <Cue name="notify" at={F(at("context") + 3.2)} volume={0.3} />
    <Cue name="thunk" at={F(at("end") + 0.3)} volume={0.34} />

    {/* the twelve contracts drawing themselves */}
    {Array.from({ length: 12 }).map((_, i) => (
      <Cue
        key={i}
        name="blip"
        at={F(at("mxn") + 1.4 + i * 0.28)}
        volume={0.11}
      />
    ))}
  </>
);
