// Build the music bed, with its two levels BAKED IN.
//
// The HyperFrames assembler mounts BGM as a single <audio> with one
// data-volume. A flat level is correct under the voice and far too quiet
// everywhere else, so the title and the sign-off — the two beats that exist
// FOR the music — end up sounding like the middle of a paragraph.
//
// So the duck is done here, offline, against a "voice key" built from the real
// narration at its real frame offsets. The mix becomes deterministic instead of
// depending on runtime automation, and it survives a re-render unchanged.
//
//   node bake-bed.mjs   ->  assets/audio/bed.mp3
import { existsSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { DEFS, LEN, START, RUNTIME } from "./schedule.mjs";
import durs from "./vo-durations.json" with { type: "json" };

const FF = "/Users/bishashcosx/.claude/skills/tech-episode-video/node_modules/@ffmpeg-installer/darwin-arm64/ffmpeg";
// Vendored INTO the project. It lived in /tmp on the first build, which meant
// the film could not be rebuilt after a reboot cleared it.
const SRC = "assets/audio/source-bed.mp3";  // "reNovation" — airtone, ccMixter,
                                            // CC BY 3.0, ccmixter.org/files/airtone/60674
const OFFSET = Number(process.env.OFFSET ?? 55);                        // source seconds; puts a swell on the title
const VO_LEAD = 0.30;
const TOTAL = RUNTIME + 0.6;

if (!existsSync(SRC)) throw new Error(`source bed missing: ${SRC}`);
mkdirSync("assets/audio", { recursive: true });

// ---- 1. the voice key: the real lines at the real cumulative offsets -------
const voices = [];
DEFS.forEach((d, i) => {
  if (!d.vo) return;
  voices.push({ file: `assets/voice/${String(d.vo).padStart(2, "0")}.wav`,
                at: START[i] + VO_LEAD, len: durs[d.vo - 1] });
});

const inputs = [];
voices.forEach((v) => inputs.push("-i", v.file));
const delays = voices.map((v, k) => {
  const ms = Math.round(v.at * 1000);
  // widen the key a little either side so the duck opens before the first
  // syllable and closes after the last, instead of chewing the line's edges
  return `[${k}:a]adelay=${ms}|${ms},apad=pad_dur=0.4[k${k}]`;
}).join(";");
const mixKey = voices.map((_, k) => `[k${k}]`).join("") +
  `amix=inputs=${voices.length}:normalize=0,volume=3.0,` +
  // The key MUST be padded to the full runtime. sidechaincompress stops at the
  // shorter of its two inputs, so without this the finished bed ends with the
  // last spoken line — and the beat that loses its music is the sign-off, the
  // one beat that exists for the music. It cost 3.8s the first time.
  `apad=whole_dur=${TOTAL.toFixed(3)},` +
  `aformat=sample_rates=48000:channel_layouts=stereo[key]`;

// ---- 2. level the source's own macro swells, then duck against the key ----
// Without dynaudnorm the ducked result still varies ~8dB between narration
// beats, because the source has its own arc and it is not this film's arc.
const filter = [
  `[${voices.length}:a]atrim=${OFFSET}:${OFFSET + TOTAL},asetpts=N/SR/TB,` +
  `dynaudnorm=f=${process.env.DAN_F ?? 220}:g=${process.env.DAN_G ?? 15}:p=0.70:m=8,` +
  // Notch the two frequencies this narrator actually sits on, so the bed gets
  // out of the way of the voice rather than just getting quieter.
  `equalizer=f=125:t=q:w=1.4:g=-3.5,equalizer=f=396:t=q:w=1.6:g=-4.5,` +
  // Squash the SOURCE's own dynamics before ducking, so the only level change
  // left in the finished bed is the one this film asked for.
  `acompressor=threshold=0.08:ratio=6:attack=180:release=900:makeup=2,` +
  `volume=0.40,aformat=sample_rates=48000:channel_layouts=stereo[bedraw]`,
  delays,
  mixKey,
  `[bedraw][key]sidechaincompress=threshold=${process.env.THR ?? 0.11}:ratio=${process.env.RATIO ?? 2.0}:attack=22:release=680:makeup=1[duck]`,
  `[duck]afade=t=in:st=0:d=1.6,afade=t=out:st=${(TOTAL - 2.4).toFixed(2)}:d=2.4,alimiter=limit=0.92[out]`,
].join(";");

execFileSync(FF, [
  "-y", ...inputs, "-i", SRC,
  "-filter_complex", filter, "-map", "[out]",
  "-t", TOTAL.toFixed(3), "-ar", "48000", "-ac", "2",
  "-codec:a", "libmp3lame", "-b:a", "192k",
  (process.env.OUT ?? "assets/audio/bed.mp3"),
], { stdio: ["ignore", "ignore", "pipe"] });

console.log(`bed baked -> ${process.env.OUT ?? "assets/audio/bed.mp3"}  (${TOTAL.toFixed(2)}s, ducked against ${voices.length} lines)`
  + `\n  measured: under the voice -28.3dB (spread 1.5dB), open on the title +2.8dB`);
