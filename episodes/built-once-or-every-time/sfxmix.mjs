// The cue layer, BAKED OFFLINE into one file.
//
// EP29 authors 385 cues. Mounted as 385 <audio> clips they are correct and they render
// — right up until the mixer, which spent 325 seconds on the audio stage and then failed
// the render with `audio_processing_failed / ffmpeg_timeout`. 422 timed clips is simply
// more than the mix stage will do in its window.
//
// So the cue track gets the same treatment the bed already gets: summed here, in JS,
// into a single 48kHz stereo WAV, and mounted as ONE clip. Reading and summing 17 short
// mono PCM files at 385 offsets is arithmetic — it is deterministic, it takes about a
// second, and it removes 384 clips from the contract.
//
// Levels are the per-cue GAIN from cues.mjs, applied here instead of by data-volume, so
// the mixed file already carries the balance the frames were designed against.
import { readFileSync, writeFileSync } from "node:fs";
import { DEFS, LEN, SEAM_IN, RUNTIME } from "./schedule.mjs";
import { CUES, GAIN } from "./cues.mjs";

const SR = 48000;
const ms = (s) => Math.round(s * 1000) / 1000;

// frame starts, quantised exactly the way build.mjs quantises them
const DUR = LEN.map(ms);
const AT = [];
DUR.reduce((acc, d, i) => { AT[i] = ms(acc); return ms(acc + d); }, 0);

/** decode a 16-bit mono PCM wav into Float32, by walking the RIFF chunks rather than
    assuming a 44-byte header — a stray LIST chunk would silently shift every sample. */
const load = (name) => {
  const b = readFileSync(`assets/sfx/${name}.wav`);
  let p = 12;
  while (p + 8 <= b.length) {
    const id = b.toString("latin1", p, p + 4);
    const size = b.readUInt32LE(p + 4);
    if (id === "data") {
      const n = Math.floor(size / 2);
      const out = new Float32Array(n);
      for (let i = 0; i < n; i++) out[i] = b.readInt16LE(p + 8 + i * 2) / 32768;
      return out;
    }
    p += 8 + size + (size & 1);
  }
  throw new Error(`no data chunk in ${name}.wav`);
};

const cache = new Map();
const get = (n) => { if (!cache.has(n)) cache.set(n, load(n)); return cache.get(n); };

// ---- gather every cue, exactly as build.mjs does ---------------------------------
const list = [];
for (let i = 0; i < DEFS.length; i++) {
  const name = `${String(i + 1).padStart(2, "0")}-${DEFS[i].id}`;
  for (const [n, t] of (CUES[name] || [])) list.push([n, ms(AT[i] + t)]);
  if (i === 0) continue;
  const kind = SEAM_IN[DEFS[i].id];
  if (kind === "lift") { list.push(["riser", ms(AT[i] - 1.30)]); list.push(["thunk", ms(AT[i] + 0.06)]); }
  else if (kind === "zback") list.push(["sub", ms(AT[i] - 0.24)]);
  else list.push(["whoosh", ms(AT[i] - 0.16)]);
}

// ---- sum ---------------------------------------------------------------------------
const N = Math.ceil((RUNTIME + 2) * SR);
const buf = new Float32Array(N);
let placed = 0;
for (const [n, t] of list) {
  const src = get(n), g = GAIN[n] ?? 0.3, off = Math.round(Math.max(t, 0) * SR);
  for (let i = 0; i < src.length && off + i < N; i++) buf[off + i] += src[i] * g;
  placed++;
}

// ---- one soft limiter pass: adjacent cues DO overlap, and a summed pair can clip -----
let peak = 0;
for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(buf[i]));
const CEIL = 0.86;
const k = peak > CEIL ? CEIL / peak : 1;

// ---- write 16-bit stereo -------------------------------------------------------------
const data = Buffer.alloc(N * 4);
for (let i = 0; i < N; i++) {
  const v = Math.max(-1, Math.min(1, buf[i] * k));
  const s = Math.round(v * 32767);
  data.writeInt16LE(s, i * 4);
  data.writeInt16LE(s, i * 4 + 2);
}
const head = Buffer.alloc(44);
head.write("RIFF", 0); head.writeUInt32LE(36 + data.length, 4); head.write("WAVE", 8);
head.write("fmt ", 12); head.writeUInt32LE(16, 16); head.writeUInt16LE(1, 20);
head.writeUInt16LE(2, 22); head.writeUInt32LE(SR, 24); head.writeUInt32LE(SR * 4, 28);
head.writeUInt16LE(4, 32); head.writeUInt16LE(16, 34);
head.write("data", 36); head.writeUInt32LE(data.length, 40);
writeFileSync("assets/audio/sfx.wav", Buffer.concat([head, data]));

console.log(`${placed} cues summed into assets/audio/sfx.wav`);
console.log(`peak ${peak.toFixed(3)}${k < 1 ? ` -> scaled by ${k.toFixed(3)}` : " (no scaling needed)"}`);
console.log(`${(N / SR).toFixed(2)}s, ${(data.length / 1e6).toFixed(1)} MB`);
