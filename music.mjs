// Author: Bishakh
//
// Background score for an episode. Four engines, all clearable — nothing here
// puts a copyright claim on your video.
//
//   node music.mjs --gen "slow documentary strings, tension" --seconds 95
//                                          # GENERATED, follows a written brief
//   node music.mjs --gen "..." --plan      # generated, sectioned to the episode arc
//   node music.mjs --engine stable-audio --gen "..."   # generated locally, free forever
//   node music.mjs --search "ambient technology"       # CC0 track from Openverse
//   node music.mjs --mood dark-tech --seconds 95       # synth bed (offline, deterministic)
//   node music.mjs --list                              # moods and engines
//
// ENGINES, in the order they're worth reaching for:
//
//  1. `elevenlabs` (default for --gen) — ElevenLabs Music on the SAME key the
//     narration uses, so there's nothing new to sign up for. Costs credits, and
//     the free plan's monthly allowance covers a couple of episodes. It is the
//     only engine here that will write to a brief ("hold back until 0:40, then
//     open up"), and with --plan it scores the episode's actual structure.
//  2. `stable-audio` — Stable Audio Open, run LOCALLY. Free forever, no key, no
//     quota, no network after the first download. Trained only on CC0 / CC-BY
//     audio, and the Stability Community Licence permits commercial use under
//     $1M revenue — the cleanest provenance of any music model. Costs you a
//     one-time ~4GB install and 47s maximum per generation, so it makes loops,
//     not through-composed scores.
//  3. `openverse` — search real CC0 recordings. Free, instant, but you take
//     what exists.
//  4. `synth` — additive pads + sub + pulse, generated offline and
//     deterministically. Nothing to license, any length, always available. The
//     fallback every other engine falls back TO.
//
// Whatever generated it, the file lands at public/audio/music/bed.* and the
// provenance lands in public/audio/music/CREDITS.md. Fill that into the episode
// description — for the licensed engines it's courtesy, for `stable-audio` it's
// the licence.
//
// Mix guidance: bed sits at volume 0.16–0.20 under narration, 0.32–0.40 in a
// no-VO montage. Duck it, don't fight the voice.

import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const HERE = new URL("./", import.meta.url);
const p = (rel) => new URL(rel, HERE).pathname;
const arg = (name, dflt) => {
  const i = process.argv.indexOf("--" + name);
  return i === -1 ? dflt : process.argv[i + 1];
};

/* ── moods ───────────────────────────────────────────────────────────────── */
// root frequencies are chord voicings in Hz; `pulse` adds a heartbeat kick,
// `bells` a sparse high arpeggio, `drift` the tremolo depth.
const BPM = Number(arg("bpm", 84));
const BEAT = 60 / BPM;

const MOODS = {
  "cinematic-hopeful": {
    chords: [[110.0, 164.81, 220.0, 277.18], [146.83, 220.0, 293.66, 369.99], [92.5, 138.59, 185.0, 220.0], [82.41, 123.47, 164.81, 207.65]],
    bells: [880.0, 1108.73, 1318.51, 1108.73, 987.77, 1318.51], pulse: 0, drift: 0.14, tone: 1.0,
  },
  "dark-tech": {
    chords: [[65.41, 98.0, 130.81, 155.56], [61.74, 92.5, 123.47, 146.83], [73.42, 110.0, 146.83, 174.61], [58.27, 87.31, 116.54, 138.59]],
    bells: [523.25, 622.25, 783.99, 622.25], pulse: 0.5, drift: 0.1, tone: 0.72,
  },
  "driving-build": {
    chords: [[87.31, 130.81, 174.61, 261.63], [98.0, 146.83, 196.0, 293.66], [110.0, 164.81, 220.0, 329.63], [116.54, 174.61, 233.08, 349.23]],
    bells: [659.25, 783.99, 987.77, 783.99], pulse: 0.85, drift: 0.06, tone: 0.9,
  },
  "calm-focus": {
    chords: [[130.81, 196.0, 261.63, 329.63], [146.83, 220.0, 293.66, 349.23], [116.54, 174.61, 233.08, 293.66], [123.47, 185.0, 246.94, 311.13]],
    bells: [1046.5, 1244.51, 1567.98, 1244.51], pulse: 0, drift: 0.18, tone: 1.1,
  },
  mystery: {
    chords: [[73.42, 110.0, 138.59, 185.0], [69.3, 103.83, 130.81, 174.61], [82.41, 123.47, 155.56, 207.65], [61.74, 92.5, 116.54, 155.56]],
    bells: [739.99, 830.61, 987.77, 830.61], pulse: 0.3, drift: 0.22, tone: 0.8,
  },
};

if (process.argv.includes("--list")) {
  console.log("engines:");
  console.log("  elevenlabs    --gen \"<brief>\" [--plan]   generated, writes to a brief. Same key as the VO, costs credits.");
  console.log("  stable-audio  --gen \"<brief>\"            generated locally. Free forever, 47s loop, one-time ~4GB install.");
  console.log("  openverse     --search \"<query>\"         real CC0 recordings. Free, instant, take what exists.");
  console.log("  synth         --mood <mood>              offline, deterministic, any length. Always available.");
  console.log("\nmoods:", Object.keys(MOODS).join(", "));
  process.exit(0);
}

const SECONDS = Number(arg("seconds", 90));
const MOOD = arg("mood", "dark-tech");
const SEARCH = arg("search");
const OUT_DIR = p("public/audio/music/");
mkdirSync(OUT_DIR, { recursive: true });

/* ── engine: ElevenLabs Music ────────────────────────────────────────────── */
// Same key as the narration. A brief, not a mood — say what the music should DO
// under the film, and say what it must not do (the negative styles matter more
// than the positive ones; "no drums, no melody" is what keeps a bed a bed).

const KEY = () => {
  const f = p(".env.local");
  const m = existsSync(f) && readFileSync(f, "utf8").match(/ELEVENLABS_API_KEY=(.+)/);
  if (!m) throw new Error("ELEVENLABS_API_KEY missing from .env.local");
  return m[1].trim();
};

const NEG = ["vocals", "lyrics", "drum solo", "sudden dynamic jumps", "prominent melody"];

/**
 * A composition plan built from the episode's OWN timing — the bed changes
 * where the film changes instead of looping obliviously underneath it. Reads
 * vo-durations.json, so run tts.mjs first.
 */
function planFromEpisode(brief, seconds, explicitSeconds) {
  let durs = [];
  try { durs = JSON.parse(readFileSync(p("vo-durations.json"), "utf8")); } catch { /* no VO yet */ }
  // An explicit --seconds wins: it's how you score a short, or test the plan
  // without paying for a full-length generation.
  const total = explicitSeconds || durs.reduce((a, b) => a + b, 0) || seconds;
  // The arc every episode of this series has: cold open, evidence, turn, land.
  const shape = [
    { name: "Cold open", w: 0.18, styles: ["sparse", "low drone", "restrained", "one held note"] },
    { name: "Evidence", w: 0.34, styles: ["steady pulse", "understated", "forward motion"] },
    { name: "Turn", w: 0.30, styles: ["rising tension", "harmonic shift", "widening"] },
    { name: "Land", w: 0.18, styles: ["resolve", "warm", "settling", "fading out"] },
  ];
  return {
    positive_global_styles: brief.split(/,\s*/).map((s) => s.trim()).filter(Boolean),
    negative_global_styles: NEG,
    sections: shape.map((s) => ({
      section_name: s.name,
      positive_local_styles: s.styles,
      negative_local_styles: NEG,
      // sections are capped at 120s by the API
      duration_ms: Math.min(120000, Math.max(3000, Math.round(total * s.w * 1000))),
      lines: [],
    })),
  };
}

async function fromElevenLabs(brief, seconds, usePlan, explicitSeconds) {
  const body = usePlan
    ? { composition_plan: planFromEpisode(brief, seconds, explicitSeconds), model_id: "music_v1" }
    : {
        prompt:
          `Instrumental background score for a technology documentary. ${brief}. ` +
          `It sits UNDER narration: no vocals, no lyrics, no prominent melody, no sudden ` +
          `dynamic jumps. Consistent texture, slow evolution, mixable at low volume.`,
        music_length_ms: Math.min(600000, Math.max(3000, Math.round(seconds * 1000))),
        model_id: "music_v1",
      };

  const res = await fetch("https://api.elevenlabs.io/v1/music?output_format=mp3_44100_128", {
    method: "POST",
    headers: { "xi-api-key": KEY(), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`ElevenLabs Music ${res.status}: ${(await res.text()).slice(0, 240)}`);

  const file = `${OUT_DIR}bed.mp3`;
  writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  writeFileSync(
    `${OUT_DIR}CREDITS.md`,
    `# Music credits\n\n- Generated with **ElevenLabs Music** (\`music_v1\`${usePlan ? ", composition plan" : ""}).\n` +
      `  - brief: "${brief}"\n  - ${usePlan ? "sectioned to the episode arc (cold open / evidence / turn / land)" : `${seconds}s`}\n` +
      `  - Generated audio; check your ElevenLabs plan's terms for the commercial-use\n` +
      `    position before monetising.\n`,
  );
  console.log(`✓ bed.mp3 — ElevenLabs Music${usePlan ? " (sectioned to the episode arc)" : ""}`);
  console.log(`  brief: "${brief}"`);
  return true;
}

/* ── engine: Stable Audio Open (local, free) ─────────────────────────────── */
// No key, no quota, no network once installed. 47s maximum per generation, so
// it produces a LOOP — generate ~45s and let <Audio loop> carry the episode.
// A loop point under narration is inaudible; a hard stop is not.

const SA_VENV = p(".venv-stableaudio/");
const SA_PY = `${SA_VENV}bin/python`;

function stableAudioPreflight() {
  if (existsSync(SA_PY)) return true;
  console.log(
    "· Stable Audio Open isn't installed yet. It is free and unlimited, but it's a\n" +
    "  one-time ~4GB install (torch + diffusers + the model weights).\n\n" +
    "    python3 -m venv .venv-stableaudio\n" +
    "    .venv-stableaudio/bin/pip install torch torchaudio diffusers transformers soundfile\n" +
    "    # accept the licence once at https://huggingface.co/stabilityai/stable-audio-open-1.0\n" +
    "    # then put HF_TOKEN=hf_... in .env.local\n\n" +
    "  Run that, then re-run this command. Falling back to the synth bed for now.",
  );
  return false;
}

function fromStableAudio(brief, seconds) {
  if (!stableAudioPreflight()) return false;
  const secs = Math.min(47, seconds); // hard model limit
  const hf = (() => {
    const f = p(".env.local");
    const m = existsSync(f) && readFileSync(f, "utf8").match(/HF_TOKEN=(.+)/);
    return m ? m[1].trim() : "";
  })();

  const script = `
import torch, soundfile as sf
from diffusers import StableAudioPipeline
pipe = StableAudioPipeline.from_pretrained("stabilityai/stable-audio-open-1.0", torch_dtype=torch.float16)
pipe = pipe.to("mps" if torch.backends.mps.is_available() else ("cuda" if torch.cuda.is_available() else "cpu"))
audio = pipe(
    "${brief.replace(/"/g, "'")}, instrumental background bed, no vocals, no melody, consistent texture",
    negative_prompt="vocals, lyrics, drums solo, harsh, distorted, sudden changes",
    num_inference_steps=200, audio_end_in_s=${secs}, num_waveforms_per_prompt=1,
    generator=torch.Generator("cpu").manual_seed(0),
).audios
sf.write("${OUT_DIR}bed.wav", audio[0].T.float().cpu().numpy(), pipe.vae.sampling_rate)
print("ok")
`;
  try {
    execFileSync(SA_PY, ["-c", script], { stdio: "inherit", env: { ...process.env, HF_TOKEN: hf } });
  } catch {
    console.log("· Stable Audio generation failed — synthesising instead.");
    return false;
  }
  writeFileSync(
    `${OUT_DIR}CREDITS.md`,
    `# Music credits\n\n- Generated locally with **Stable Audio Open 1.0** (Stability AI Community Licence).\n` +
      `  - brief: "${brief}" · ${secs}s loop\n` +
      `  - Trained only on CC0 / CC-BY / CC-Sampling+ audio (Freesound, Free Music Archive).\n` +
      `  - Commercial use permitted under the Community Licence below $1M annual revenue;\n` +
      `    above that, see https://stability.ai/license\n`,
  );
  console.log(`✓ bed.wav — Stable Audio Open, ${secs}s loop (free, local)`);
  return true;
}

/* ── route 1: Openverse CC0 ──────────────────────────────────────────────── */

async function fromOpenverse(query) {
  const url =
    "https://api.openverse.org/v1/audio/?" +
    new URLSearchParams({ q: query, license: "cc0", page_size: "12", peaks: "false" });
  const res = await fetch(url, { headers: { "User-Agent": "tech-episode-video/1.0 (skill)" } });
  if (!res.ok) throw new Error(`Openverse ${res.status}`);
  const json = await res.json();
  const hits = (json.results || []).filter((r) => r.url && (r.duration || 0) / 1000 >= SECONDS * 0.6);
  const pick = hits[0] || (json.results || [])[0];
  if (!pick) throw new Error("no CC0 results");
  const audio = await fetch(pick.url);
  if (!audio.ok) throw new Error(`download ${audio.status}`);
  const ext = (pick.filetype || "mp3").replace(/[^a-z0-9]/gi, "");
  const file = `${OUT_DIR}bed.${ext}`;
  writeFileSync(file, Buffer.from(await audio.arrayBuffer()));
  writeFileSync(
    `${OUT_DIR}CREDITS.md`,
    `# Music credits\n\n- **${pick.title || "Untitled"}** by ${pick.creator || "unknown"} — ${pick.license.toUpperCase()} ${pick.license_version || ""}\n  - source: ${pick.foreign_landing_url || pick.url}\n  - fetched via Openverse for episode use\n`
  );
  console.log(`✓ bed.${ext} — "${pick.title}" by ${pick.creator} (${pick.license.toUpperCase()})`);
  console.log(`  ${Math.round((pick.duration || 0) / 1000)}s · credits written to public/audio/music/CREDITS.md`);
  console.log(`  Loop/trim it to ${SECONDS}s in the composition, or with ffmpeg -t ${SECONDS}.`);
  return true;
}

/* ── route 2: synthesised bed ────────────────────────────────────────────── */

function synth() {
  const m = MOODS[MOOD] || MOODS["dark-tech"];
  const SR = 44100;
  const N = SR * SECONDS;
  const CHORD_LEN = SECONDS / m.chords.length;
  const XFADE = 2.2;
  const BELL_EVERY = 2.0;
  const L = new Float64Array(N), R = new Float64Array(N);
  const sine = Math.sin;

  for (let i = 0; i < N; i++) {
    const t = i / SR;
    const pos = t / CHORD_LEN;
    const idx = Math.min(m.chords.length - 1, Math.floor(pos));
    const nxt = Math.min(m.chords.length - 1, idx + 1);
    const into = t - idx * CHORD_LEN;
    const w = into > CHORD_LEN - XFADE ? (into - (CHORD_LEN - XFADE)) / XFADE : 0;

    let s = 0;
    const addChord = (chord, gain) => {
      if (gain <= 0) return;
      for (let v = 0; v < chord.length; v++) {
        const f = chord[v] * m.tone;
        const voiceGain = v === 0 ? 0.5 : 0.32 - v * 0.03;
        s += gain * voiceGain * 0.5 * sine(2 * Math.PI * (f - 0.18) * t);
        s += gain * voiceGain * 0.5 * sine(2 * Math.PI * (f + 0.18) * t + 0.6);
      }
      s += gain * 0.34 * sine(2 * Math.PI * ((chord[0] * m.tone) / 2) * t);
    };
    addChord(m.chords[idx], 1 - w);
    addChord(m.chords[nxt], w);

    s *= 1 - m.drift + m.drift * sine(2 * Math.PI * 0.13 * t);

    // heartbeat pulse ON THE TEMPO GRID — this is what the picture snaps to,
    // so it must be a real, declared bpm rather than "every second".
    if (m.pulse) {
      const bt = t % BEAT;
      const env = Math.exp(-bt * 14) * (1 - Math.exp(-bt * 300));
      s += m.pulse * 0.22 * env * sine(2 * Math.PI * (55 - 18 * bt) * t);
    }

    // sparse bell
    const bt2 = t % BELL_EVERY;
    if (bt2 < 1.4) {
      const bi = Math.floor(t / BELL_EVERY) % m.bells.length;
      const env = Math.exp(-bt2 * 3.2) * (1 - Math.exp(-bt2 * 40));
      s += 0.09 * env * sine(2 * Math.PI * m.bells[bi] * t);
    }

    let fade = 1;
    if (t < 2.5) fade = t / 2.5;
    if (t > SECONDS - 3.5) fade = Math.max(0, (SECONDS - t) / 3.5);
    s = Math.tanh(s * fade * 0.5 * 1.1);

    L[i] = s;
    R[i] = Math.tanh((s * 0.96 + 0.04 * sine(2 * Math.PI * 0.07 * t)) * 1.02);
  }

  let peak = 0;
  for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
  const norm = peak > 0 ? 0.84 / peak : 1;

  const channels = 2, bps = 2, dataLen = N * channels * bps;
  const buf = Buffer.alloc(44 + dataLen);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + dataLen, 4); buf.write("WAVE", 8);
  buf.write("fmt ", 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(channels, 22); buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * channels * bps, 28); buf.writeUInt16LE(channels * bps, 32);
  buf.writeUInt16LE(16, 34); buf.write("data", 36); buf.writeUInt32LE(dataLen, 40);
  let off = 44;
  const clamp16 = (x) => Math.max(-32768, Math.min(32767, Math.round(x * norm * 32767)));
  for (let i = 0; i < N; i++) { buf.writeInt16LE(clamp16(L[i]), off); off += 2; buf.writeInt16LE(clamp16(R[i]), off); off += 2; }

  writeFileSync(`${OUT_DIR}bed.wav`, buf);
  // Always rewrite the credits. Leaving a previous engine's note in place after
  // a fallback is how an episode ends up crediting music it isn't using.
  writeFileSync(
    `${OUT_DIR}CREDITS.md`,
    `# Music credits\n\nBed synthesised in \`music.mjs\` — mood "${MOOD in MOODS ? MOOD : "dark-tech"}", ${SECONDS}s.\n` +
      `Original, generated offline and deterministically. No licence required, nothing to clear.\n`,
  );
  console.log(`✓ bed.wav — mood "${MOOD in MOODS ? MOOD : "dark-tech"}", ${SECONDS}s, ${(buf.length / 1e6).toFixed(1)} MB (synthesised, licence-free)`);
}

/* ── dispatch ────────────────────────────────────────────────────────────── */
// Every engine falls back to the synth bed rather than leaving you without one.
// A missing key or a dead network should cost you a nicer score, not a render.

const GEN = arg("gen");
const ENGINE = arg("engine", GEN ? "elevenlabs" : SEARCH ? "openverse" : "synth");
const USE_PLAN = process.argv.includes("--plan");

let done = false;
try {
  if (ENGINE === "elevenlabs") {
    if (!GEN) throw new Error('--engine elevenlabs needs a brief: --gen "slow strings, tension"');
    done = await fromElevenLabs(GEN, SECONDS, USE_PLAN, arg("seconds") ? Number(arg("seconds")) : null);
  } else if (ENGINE === "stable-audio") {
    if (!GEN) throw new Error('--engine stable-audio needs a brief: --gen "warm analogue pad"');
    done = fromStableAudio(GEN, SECONDS);
  } else if (ENGINE === "openverse") {
    done = await fromOpenverse(SEARCH || GEN || MOOD);
  }
} catch (e) {
  console.log(`· ${ENGINE} failed (${e.message}) — synthesising instead.`);
}
if (!done) synth(); // synth() writes its own CREDITS.md, so provenance always matches the file
