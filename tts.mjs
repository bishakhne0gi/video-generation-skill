// Author: Bishakh
//
// ElevenLabs narration for one episode. Lines live in episode.config.json under
// `vo` so the script, the shots and the edit stay in ONE file.
//
//   node tts.mjs              # render missing lines → public/audio/vo/sceneN.mp3
//   FORCE=1 node tts.mjs      # re-record everything (after a script or voice change)
//   node tts.mjs 3 7          # re-record only scenes 3 and 7
//   node tts.mjs --audition 3 # 4 takes of scene 3 → public/audio/vo/audition/
//   node tts.mjs --check      # lint the script for pace/length/tags, record nothing
//
// THE HOUSE VOICE IS DIRECTIVE. This series teaches: the narrator knows the
// thing and is handing it to you, in order, without hedging. Not a podcaster
// being wry about it, not a trailer voice selling it. That register is built in
// the WRITING — imperatives, second person, front-loaded subjects, full stops
// where a weaker script reaches for a comma — and then protected by the model
// choice, not decorated by it.
//
// So: `eleven_multilingual_v2`, high stability, style near zero. It CANNOT
// perform audio tags at all, which makes "no modulation" a structural guarantee
// rather than a setting that drifts between episodes. `eleven_v3` and its tag
// vocabulary exist and this script still supports them, but reaching for them
// is a deliberate departure from the series voice — it warns.
//
// What actually carries the read, in order of effect:
//
//  1. THE SENTENCES — short, declarative, verb early. A teaching line lands
//     because there is nothing in it to get lost in.
//  2. PUNCTUATION — a full stop is a hard stop, an ellipsis is a held beat, a
//     line break is a longer one, ALL CAPS is stress. Free, and it works on
//     every model.
//  3. CONTEXT — each scene is a separate API call, so by default line 7 has no
//     idea what line 6 did, and comes in with a fresh, unrelated intonation.
//     `previous_text`/`next_text` fix that (v2 only); it's why the episode lands
//     as one lesson instead of sixteen announcements.
//
// Writes vo-durations.json — the source of truth for scene lengths. Never guess
// a scene length; read it from there.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { durationOf } from "./kling.mjs";

const HERE = new URL("./", import.meta.url);
const p = (rel) => new URL(rel, HERE).pathname;

const KEY = (() => {
  const f = p(".env.local");
  const m = existsSync(f) && readFileSync(f, "utf8").match(/ELEVENLABS_API_KEY=(.+)/);
  if (!m) { console.error("✗ ELEVENLABS_API_KEY missing from .env.local"); process.exit(1); }
  return m[1].trim();
})();

const cfg = JSON.parse(readFileSync(p("episode.config.json"), "utf8"));
const VO = (cfg.vo || []).map((v) => (typeof v === "string" ? { text: v } : v));
if (!VO.length) { console.error("✗ No `vo` lines in episode.config.json"); process.exit(1); }

// Voices that hold up for tech narration (audition before committing):
//   Daniel  onwK4e9ZLuTAKqWW03F9  British, authoritative — the instructor register
//   Brian   nPczCjzI2devNBz1zQrb  US, deep — trailer / hype register
//   Charlie IKne3meq5aSn9XLyUdCD  Australian, conversational — tutorial register
// Pick one with a NARROW, even range for this series. A wide-range voice reads
// a directive script as if it were withholding something.
const VOICE = cfg.voice || "onwK4e9ZLuTAKqWW03F9";
const MODEL = cfg.voiceModel || "eleven_multilingual_v2";

// v3 reads `stability` as three discrete modes, not a continuum:
//   0.0 Creative — most expressive, most likely to drift off-script
//   0.5 Natural  — tags land and the voice stays itself
//   1.0 Robust   — steadiest, but it largely IGNORES tags. Never tag on Robust.
const V3_DEFAULT = { stability: 0.5, similarity_boost: 0.8, style: 0.35, use_speaker_boost: true };
// The house setting. High stability and near-zero style is what an instructor
// sounds like: the same person, at the same energy, for the whole episode. Drop
// stability toward 0.5 only if the read comes back mechanical rather than even.
const V2_DEFAULT = { stability: 0.72, similarity_boost: 0.85, style: 0.05, use_speaker_boost: true };
const IS_V3 = MODEL === "eleven_v3";
const SETTINGS = cfg.voiceSettings || (IS_V3 ? V3_DEFAULT : V2_DEFAULT);

const TAG = /\[([^\]\n]{1,40})\]/;
const hasTag = (s) => TAG.test(s);
const words = (s) => s.replace(/\[[^\]\n]{1,40}\]/g, " ").split(/\s+/).filter(Boolean).length;

/**
 * Rough syllable count. Words-per-minute is a poor measure of THIS series,
 * because the directive register is deliberately built from short words —
 * "a GPU runs out of memory long before it runs out of maths" is nineteen
 * monosyllables and scores 200wpm while sounding perfectly measured. Syllables
 * per second is what the ear actually hears. Documentary narration sits at
 * 3.5-4.5 syll/s; past ~5.0 it is genuinely rushed.
 */
const syllables = (s) =>
  s.replace(/\[[^\]\n]{1,40}\]/g, " ")
    .toLowerCase()
    .split(/[^a-z']+/)
    .filter(Boolean)
    .reduce((n, w) => {
      const groups = w.replace(/e\b/, "").match(/[aeiouy]+/g);
      return n + Math.max(1, groups ? groups.length : 1);
    }, 0);

/* ── script lint ─────────────────────────────────────────────────────────── */
// Runs before every record. Two jobs: catch the things that make a track sound
// like a robot reading a memo, and catch the things that make a teaching script
// stop teaching — hedging, describing instead of instructing, sentences the
// listener has to hold in their head.

// Hedges. Every one of these is the narrator declining to know the thing they
// are supposedly explaining, and the authority of the whole read leaks out of
// them. Cut the hedge or cut the claim.
const HEDGES = /\b(maybe|perhaps|sort of|kind of|i think|i guess|probably|arguably|somewhat|a bit of|more or less|if you will|in a sense)\b/i;
// Throat-clearing openers: the line starts before it has started.
const FILLER_OPEN = /^\s*(so|well|basically|actually|anyway|now then|of course)\s*,/i;
// The directive markers — second person, or an instruction verb up front.
const DIRECT = /\b(you|your|you're|yours)\b/i;
const IMPERATIVE = /^\s*(notice|watch|look|see|think|remember|forget|start|stop|take|count|imagine|picture|consider|follow|keep|hold|add|run|build|ask|assume|read|say|call|note|understand|ignore|compare|track|pay)\b/i;

function lint() {
  const warn = [];
  const tagged = VO.filter((v) => hasTag(v.text));

  // The series voice is the flat directive one. Reaching for v3 is a departure,
  // not an upgrade — say so out loud rather than letting an episode drift.
  if (IS_V3) {
    warn.push(
      `voiceModel is eleven_v3 — the series voice is eleven_multilingual_v2, directive and unmodulated.\n` +
      `    v3 performs; this playlist teaches. If that's deliberate, fine; if it isn't, switch it back.`,
    );
  }

  if (tagged.length && !IS_V3) {
    console.error(
      `✗ ${tagged.length} line(s) use audio tags but voiceModel is "${MODEL}".\n` +
      `  Only eleven_v3 performs tags — every other model SPEAKS them aloud.\n` +
      `  Fix: set "voiceModel": "eleven_v3" in episode.config.json, or strip the tags.\n` +
      `  First offender — scene ${VO.indexOf(tagged[0]) + 1}: ${tagged[0].text.slice(0, 70)}…`,
    );
    process.exit(1);
  }
  if (IS_V3 && (SETTINGS.stability ?? 0.5) >= 0.9 && tagged.length) {
    warn.push(`stability ${SETTINGS.stability} is Robust — v3 largely ignores tags there. Use 0.5.`);
  }
  let directive = 0;
  VO.forEach((v, i) => {
    const bare = v.text.replace(/\[[^\]\n]{1,40}\]/g, "");
    const w = words(v.text);
    if (w > 26) warn.push(`scene ${i + 1}: ${w} words — past ~26 the viewer stops hearing sentences. Split it.`);
    if (w < 4 && !/^chapter/i.test(v.text)) warn.push(`scene ${i + 1}: ${w} words — very short; deliberate beat, or an accident?`);
    if (/\d/.test(bare)) {
      warn.push(`scene ${i + 1}: contains digits — spell numbers out ("twenty fourteen"), models mis-say them.`);
    }
    const hedge = bare.match(HEDGES);
    if (hedge) warn.push(`scene ${i + 1}: hedge "${hedge[0]}" — an instructor states it or cuts it. Delete the hedge, keep the claim.`);
    if (FILLER_OPEN.test(bare)) warn.push(`scene ${i + 1}: opens on throat-clearing ("${bare.trim().split(",")[0]},") — start on the subject.`);
    if (/!/.test(bare)) warn.push(`scene ${i + 1}: exclamation mark — this voice never raises. Let the fact carry it.`);
    // Sentences the listener has to hold open. A teaching line is one clause
    // long; the moment it needs a second comma it needs a full stop instead.
    const longest = bare.split(/[.!?…\n]+/).map((s) => s.split(/\s+/).filter(Boolean).length).sort((a, b) => b - a)[0] || 0;
    if (longest > 20) warn.push(`scene ${i + 1}: a ${longest}-word sentence — break it. Two short statements teach; one long one describes.`);
    if (DIRECT.test(bare) || IMPERATIVE.test(bare)) directive++;
  });

  // The register check. A script with no second person and no imperatives is
  // narration ABOUT a system; this series hands the system to someone.
  if (directive < Math.ceil(VO.length / 4)) {
    warn.push(
      `only ${directive}/${VO.length} lines are directive (second person, or an instruction verb up front).\n` +
      `    This reads as commentary, not teaching. Point at things: "Watch what happens", "You now have two problems".`,
    );
  }
  // A whole script with no held beat and nothing stressed is the flat read.
  const held = VO.filter((v) => /…|\.\.\.|\[pause\]|\n/.test(v.text)).length;
  if (held < Math.ceil(VO.length / 5)) {
    warn.push(`only ${held}/${VO.length} lines hold a beat (… or a line break) — even a level read needs somewhere to land.`);
  }
  if (!VO.some((v) => /\b[A-Z]{2,}\b/.test(v.text.replace(/\[[^\]\n]{1,40}\]/g, "")))) {
    warn.push(`no line uses ALL CAPS for stress — nothing in the episode is being pointed at.`);
  }

  if (warn.length) console.log("· script notes:\n" + warn.map((w) => "  - " + w).join("\n") + "\n");
  return warn.length;
}

/* ── request ─────────────────────────────────────────────────────────────── */

async function speak(text, i, { seedOffset = 0, settings } = {}) {
  const body = {
    text,
    model_id: MODEL,
    voice_settings: settings || VO[i].voiceSettings || SETTINGS,
  };
  // Prosody continuity across the cut. Request stitching is unavailable on v3 —
  // there the tags carry the through-line instead.
  if (!IS_V3) {
    if (i > 0) body.previous_text = VO[i - 1].text;
    if (i < VO.length - 1) body.next_text = VO[i + 1].text;
  }
  if (cfg.voiceSeed != null) body.seed = Number(cfg.voiceSeed) + seedOffset;

  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE}?output_format=mp3_44100_128`,
    { method: "POST", headers: { "xi-api-key": KEY, "Content-Type": "application/json" }, body: JSON.stringify(body) },
  );
  if (!res.ok) throw new Error(`${res.status} ${(await res.text()).slice(0, 300)}`);
  return Buffer.from(await res.arrayBuffer());
}

/* ── audition ────────────────────────────────────────────────────────────── */
// The same line, read four ways. Listen to all four and put the winner's text
// and settings back into episode.config.json. This is how you find a delivery —
// not by re-recording the whole episode and hoping it improved.

async function audition(n) {
  const i = n - 1;
  if (!VO[i]) { console.error(`✗ no scene ${n}`); process.exit(1); }
  const dir = p("public/audio/vo/audition/");
  mkdirSync(dir, { recursive: true });
  const takes = IS_V3
    ? [
        { label: "as-written", text: VO[i].text },
        { label: "confiding", text: `[whispers] ${VO[i].text}` },
        { label: "weighted", text: VO[i].text.replace(/\.\s/, "… "), settings: { ...SETTINGS, style: 0.6 } },
        { label: "flat-serious", text: VO[i].text, settings: { ...SETTINGS, stability: 0.85, style: 0.1 } },
      ]
    : [
        // The v2 spread is deliberately narrow: this is finding the right
        // INSTRUCTOR, not finding a performance. Every take is the same person.
        { label: "as-written", text: VO[i].text },
        { label: "instructor", text: VO[i].text, settings: { ...SETTINGS, stability: 0.72, style: 0.05 } },
        { label: "level", text: VO[i].text, settings: { ...SETTINGS, stability: 0.9, style: 0 } },
        { label: "held", text: VO[i].text.replace(/\.\s/, "… ") },
      ];
  for (let k = 0; k < takes.length; k++) {
    const t = takes[k];
    const buf = await speak(t.text, i, { seedOffset: k, settings: t.settings });
    const file = `${dir}scene${n}-${t.label}.mp3`;
    writeFileSync(file, buf);
    console.log(`  ${t.label.padEnd(13)} ${durationOf(file).toFixed(2)}s  →  ${file.split("/").slice(-1)[0]}`);
  }
  console.log(`\nListen to all ${takes.length}. Put the winner's text and settings back into episode.config.json.`);
}

/* ── main ────────────────────────────────────────────────────────────────── */

const argv = process.argv.slice(2);
lint();
if (argv.includes("--check")) { console.log("✓ lint only — nothing recorded."); process.exit(0); }
if (argv.includes("--audition")) {
  const n = Number(argv[argv.indexOf("--audition") + 1]);
  console.log(`Auditioning scene ${n} on ${MODEL}:\n`);
  await audition(n);
  process.exit(0);
}

const only = argv.map(Number).filter(Boolean);
const OUT = p("public/audio/vo/");
mkdirSync(OUT, { recursive: true });

const durations = [];
for (let i = 0; i < VO.length; i++) {
  const n = i + 1;
  const file = `${OUT}scene${n}.mp3`;
  const skip = (only.length && !only.includes(n)) || (existsSync(file) && !process.env.FORCE && !only.includes(n));
  if (skip && existsSync(file)) {
    const d = durationOf(file);
    durations.push(d);
    console.log(`scene${n}  ${d.toFixed(2)}s  (cached)`);
    continue;
  }
  let buf;
  try {
    buf = await speak(VO[i].text, i);
  } catch (e) {
    console.error(`✗ scene${n}: ${e.message}`);
    process.exit(1);
  }
  writeFileSync(file, buf);
  const d = durationOf(file);
  durations.push(d);
  // Pace is the tell. Documentary narration lives at 130–165 wpm; past ~175 the
  // viewer is being talked at, under ~115 they leave.
  const wpm = Math.round((words(VO[i].text) / d) * 60);
  const sps = syllables(VO[i].text) / d;
  // Flag on the SYLLABLE rate; wpm is printed for continuity but it punishes
  // the short-word directive register this series is written in.
  const flag = sps > 5.0 ? "  ⚠ rushed" : sps < 3.0 ? "  ⚠ dragging" : "";
  console.log(`scene${n}  ${d.toFixed(2)}s  ${wpm} wpm  ${sps.toFixed(2)} syll/s${flag}`);
}

writeFileSync(p("vo-durations.json"), JSON.stringify(durations, null, 2));
console.log("\nTOTAL VO:", durations.reduce((a, b) => a + b, 0).toFixed(2) + "s");
console.log("Scene seconds = VO + a breath (house 0.35s; 0.9s where the last syllable");
console.log("otherwise lands on the cut). Re-time the beats before rendering.");
