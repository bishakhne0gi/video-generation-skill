// Sum the cue set into ONE track, offline.
//
// HyperFrames will happily accept 122 <audio> clips and every gate passes — and
// then the mix stage spends minutes on them and can fail the render outright
// with audio_processing_failed / ffmpeg_timeout. Summing offline makes the cue
// layer a single clip, deterministic, and free at render time.
//
//   node bake-cues.mjs   ->  assets/audio/cues.wav (+ .mp3)
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { CUES } from "./cues.mjs";
import { RUNTIME } from "./schedule.mjs";

const FF = "/Users/bishashcosx/.claude/skills/tech-episode-video/node_modules/@ffmpeg-installer/darwin-arm64/ffmpeg";
const SR = 48000;
const TAIL = 1.0;

// --- a minimal 16-bit PCM WAV reader; the cue set is mono 48k by construction
function readWav(path) {
  const b = readFileSync(path);
  let off = 12, fmt = null, data = null;
  while (off + 8 <= b.length) {
    const id = b.toString("ascii", off, off + 4);
    const size = b.readUInt32LE(off + 4);
    if (id === "fmt ") fmt = { ch: b.readUInt16LE(off + 10), rate: b.readUInt32LE(off + 12), bits: b.readUInt16LE(off + 22) };
    if (id === "data") data = b.subarray(off + 8, off + 8 + size);
    off += 8 + size + (size % 2);
  }
  if (!fmt || !data) throw new Error(`unreadable wav: ${path}`);
  if (fmt.bits !== 16) throw new Error(`${path}: expected 16-bit, got ${fmt.bits}`);
  const n = Math.floor(data.length / 2 / fmt.ch);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) out[i] = data.readInt16LE(i * 2 * fmt.ch) / 32768;  // left channel
  return { s: out, rate: fmt.rate };
}

const manifest = JSON.parse(readFileSync("assets/sfx/manifest.json", "utf8"));
const cache = new Map();
const load = (name) => {
  if (!cache.has(name)) {
    const w = readWav(`assets/sfx/${name}.wav`);
    if (w.rate !== SR) throw new Error(`${name}: ${w.rate}Hz, expected ${SR}`);
    cache.set(name, w.s);
  }
  return cache.get(name);
};

const total = Math.ceil((RUNTIME + TAIL) * SR);
const buf = new Float32Array(total);

let placed = 0;
for (const c of CUES) {
  if (!manifest.cues[c.name]) throw new Error(`cue "${c.name}" is not in the sfx manifest`);
  const s = load(c.name);
  const at = Math.round(Math.max(0, c.at) * SR);
  for (let i = 0; i < s.length && at + i < total; i++) buf[at + i] += s[i] * c.gain;
  placed++;
}

// A summed cue layer can clip where two land together; a soft limiter keeps the
// transients rather than scaling the whole track down and losing every tick.
let peak = 0;
for (let i = 0; i < total; i++) peak = Math.max(peak, Math.abs(buf[i]));
for (let i = 0; i < total; i++) {
  const x = buf[i];
  buf[i] = Math.tanh(x * 1.06) * 0.92;
}

const pcm = Buffer.alloc(total * 2);
for (let i = 0; i < total; i++) pcm.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(buf[i] * 32767))), i * 2);

const hdr = Buffer.alloc(44);
hdr.write("RIFF", 0); hdr.writeUInt32LE(36 + pcm.length, 4); hdr.write("WAVE", 8);
hdr.write("fmt ", 12); hdr.writeUInt32LE(16, 16); hdr.writeUInt16LE(1, 20); hdr.writeUInt16LE(1, 22);
hdr.writeUInt32LE(SR, 24); hdr.writeUInt32LE(SR * 2, 28); hdr.writeUInt16LE(2, 32); hdr.writeUInt16LE(16, 34);
hdr.write("data", 36); hdr.writeUInt32LE(pcm.length, 40);

mkdirSync("assets/audio", { recursive: true });
writeFileSync("assets/audio/cues.wav", Buffer.concat([hdr, pcm]));
execFileSync(FF, ["-y", "-i", "assets/audio/cues.wav", "-codec:a", "libmp3lame", "-b:a", "192k",
                  "assets/audio/cues.mp3"], { stdio: "ignore" });

console.log(`baked ${placed} cues -> assets/audio/cues.mp3`);
console.log(`  length ${(total / SR).toFixed(2)}s   pre-limiter peak ${peak.toFixed(3)}`);
