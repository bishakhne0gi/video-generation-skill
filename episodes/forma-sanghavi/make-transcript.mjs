// Build the transcript / subtitle files from the SCHEDULE, not from ASR.
//
// The film's narration is authored, and every clip is mounted at a known
// offset (START[i] + VO_LEAD) for a measured length (vo-durations.json). That
// makes the timings exact by construction — a speech-to-text pass over the
// render could only approximate what is already known here, and would also
// mis-hear the model numbers the film is built on.
//
// Long lines are split into caption-sized cues at sentence boundaries, with
// each cue's share of the line's time allocated by character count. A single
// seven-second subtitle card is unreadable; 1-2 lines of ~42 characters is the
// broadcast convention and what players expect.
import { writeFileSync } from "node:fs";
import { DEFS, LEN, START, RUNTIME } from "./schedule.mjs";
import vo from "./vo.json" with { type: "json" };
import durs from "./vo-durations.json" with { type: "json" };

const VO_LEAD = 0.30;          // must match build.mjs
const MAX_CHARS = 42;          // per displayed line
const MAX_LINES = 2;
const MIN_CUE = 1.10;          // seconds
const GAP = 0.06;              // keeps adjacent cues from touching

// ---- split one spoken line into caption-sized chunks ----------------------
function chunk(text) {
  // sentence first — the narration is written one clause per sentence, so this
  // almost always lands on the natural pause the reader hears
  const sentences = text.match(/[^.!?]+[.!?]*\s*/g)?.map((s) => s.trim()).filter(Boolean) ?? [text];
  const out = [];
  for (const s of sentences) {
    if (s.length <= MAX_CHARS * MAX_LINES) { out.push(s); continue; }
    // too long for one card: break on commas, else on words
    const parts = s.split(/,\s*/);
    let buf = "";
    const flush = () => { if (buf.trim()) out.push(buf.trim()); buf = ""; };
    for (const p of parts) {
      const join = buf ? `${buf}, ${p}` : p;
      if (join.length <= MAX_CHARS * MAX_LINES) { buf = join; continue; }
      flush();
      if (p.length <= MAX_CHARS * MAX_LINES) { buf = p; continue; }
      let w = "";
      for (const word of p.split(/\s+/)) {
        const j = w ? `${w} ${word}` : word;
        if (j.length > MAX_CHARS * MAX_LINES) { out.push(w); w = word; } else w = j;
      }
      buf = w;
    }
    flush();
  }
  return out;
}

// wrap a cue onto at most MAX_LINES display lines, balanced
function wrap(s) {
  if (s.length <= MAX_CHARS) return [s];
  const words = s.split(/\s+/);
  let best = null;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(" "), b = words.slice(i).join(" ");
    if (a.length > MAX_CHARS || b.length > MAX_CHARS) continue;
    const score = Math.abs(a.length - b.length);
    if (!best || score < best.score) best = { a, b, score };
  }
  return best ? [best.a, best.b] : [s];
}

// ---- lay the cues out on the master clock --------------------------------
const cues = [];
DEFS.forEach((d, i) => {
  if (!d.vo) return;
  const text = vo[d.vo - 1];
  const at = START[i] + VO_LEAD;
  const len = durs[d.vo - 1];
  let parts = chunk(text);
  // A cue's time is its share of the line, so a short fragment ("Flat outsole,
  // detected.") can be allocated well under a readable duration. Merge any
  // chunk that would fall below MIN_CUE into a neighbour, as long as the
  // merged text still fits on the card. Do it before layout, not after —
  // clamping afterwards just produces a cue nobody can read.
  for (let pass = 0; pass < 4; pass++) {
    const totalC = parts.reduce((n, p) => n + p.length, 0);
    const short = parts.findIndex((p) => (p.length / totalC) * len < MIN_CUE);
    if (short === -1 || parts.length === 1) break;
    const prev = short > 0 ? parts[short - 1] : null;
    const next = short < parts.length - 1 ? parts[short + 1] : null;
    const fits = (a, b) => a && b && (a.length + b.length + 1) <= MAX_CHARS * MAX_LINES;
    if (fits(prev, parts[short]) && (!next || prev.length <= next.length))
      parts.splice(short - 1, 2, `${prev} ${parts[short]}`);
    else if (fits(parts[short], next))
      parts.splice(short, 2, `${parts[short]} ${next}`);
    else break;
  }
  const total = parts.reduce((n, p) => n + p.length, 0);
  let t = at;
  parts.forEach((p, k) => {
    const share = (p.length / total) * len;
    const end = k === parts.length - 1 ? at + len : t + share;
    cues.push({ start: t, end: Math.max(end, t + MIN_CUE), text: p, beat: d.id, line: d.vo });
    t = end;
  });
});

// never let a cue run into the next one
for (let i = 0; i < cues.length - 1; i++)
  if (cues[i].end > cues[i + 1].start - GAP) cues[i].end = cues[i + 1].start - GAP;

const clock = (s, sep) => {
  const ms = Math.round(s * 1000);
  const h = String(Math.floor(ms / 3600000)).padStart(2, "0");
  const m = String(Math.floor(ms / 60000) % 60).padStart(2, "0");
  const ss = String(Math.floor(ms / 1000) % 60).padStart(2, "0");
  return `${h}:${m}:${ss}${sep}${String(ms % 1000).padStart(3, "0")}`;
};
const short = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

// ---- SRT -----------------------------------------------------------------
writeFileSync("transcript/forma-sanghavi.srt",
  cues.map((c, i) =>
    `${i + 1}\n${clock(c.start, ",")} --> ${clock(c.end, ",")}\n${wrap(c.text).join("\n")}\n`
  ).join("\n"));

// ---- WebVTT --------------------------------------------------------------
writeFileSync("transcript/forma-sanghavi.vtt",
  "WEBVTT\n\n" + cues.map((c, i) =>
    `${i + 1}\n${clock(c.start, ".")} --> ${clock(c.end, ".")}\n${wrap(c.text).join("\n")}\n`
  ).join("\n"));

// ---- a reading transcript ------------------------------------------------
const ACTS = ["The archive", "Describe it", "The base last", "The mesh", "The sole", "The rest, and out"];
let md = `# Forma · Sanghavi — product walk-through\n## Transcript\n\n`;
md += `**Runtime ${short(RUNTIME)}** · 1920×1080 · 30 fps · narration by Kokoro-82M (\`am_michael\`)\n\n`;
md += `Timings are taken from the film's own schedule, so they are exact rather than\n`;
md += `transcribed. Times are the start of each spoken line on the master clock.\n\n---\n\n`;
let act = -1;
DEFS.forEach((d, i) => {
  if (d.act !== act) { act = d.act; md += `\n### Act ${act} — ${ACTS[act]}\n\n`; }
  const at = START[i] + (d.vo ? VO_LEAD : 0);
  if (!d.vo) { md += `**${short(at)}**  ·  *(title card — no narration)*\n\n`; return; }
  md += `**${short(at)}**  ${vo[d.vo - 1]}\n\n`;
});
md += `\n---\n\n## Plain text, no timings\n\n`;
md += DEFS.filter((d) => d.vo).map((d) => vo[d.vo - 1]).join(" ") + "\n";
writeFileSync("transcript/forma-sanghavi-transcript.md", md);

const words = vo.join(" ").split(/\s+/).length;
const spoken = durs.reduce((a, b) => a + b, 0);
console.log(`${cues.length} caption cues from ${durs.length} spoken lines`);
console.log(`runtime ${short(RUNTIME)}   spoken ${spoken.toFixed(1)}s (${(spoken / RUNTIME * 100).toFixed(0)}% of the film)`);
console.log(`${words} words   ${(words / (spoken / 60)).toFixed(0)} wpm while speaking`);
console.log(`longest cue ${Math.max(...cues.map((c) => c.end - c.start)).toFixed(2)}s   shortest ${Math.min(...cues.map((c) => c.end - c.start)).toFixed(2)}s`);
