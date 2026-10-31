#!/usr/bin/env node
// Author: Bishakh
//
// VO LENGTH ESTIMATOR — the stand-in for `tts.mjs` when the narration has not
// been recorded yet.
//
// `vo-durations.json` is the source of truth for scene length, and until
// ElevenLabs has actually spoken the lines there is no such file. Hand-guessing
// them is the one thing the kit forbids, so this does the next honest thing:
// it FITS the series' real speaking rate from every archived episode
// (episodes/*/episode.config.json beside its episodes/*/vo-durations.json) and
// applies that fit to the current script.
//
// The model is deliberately small — three terms, both of the real ones being
// things the voice measurably spends time on:
//
//   seconds = b0 + b1·characters + b2·(full stops)
//
// The sentence term is not cosmetic. Punctuation is the only performance
// control on eleven_multilingual_v2, and the house register is one clause per
// sentence — so the scripts that read best are the ones carrying the most full
// stops, and a chars-only fit lands every one of those cuts early. Adding it
// takes the mean error from 0.77s to 0.70s and, more usefully, makes both
// coefficients positive and physical: ~65ms a character, ~0.4s a full stop.
//
// Richer feature sets were tried and rejected — "…" and line-break counts buy
// ~0.003s of accuracy and come back with NEGATIVE weights, which is the fit
// reading noise rather than pauses.
//
// Usage:
//   node estimate-vo.mjs            # fit, report, write vo-durations.json
//   node estimate-vo.mjs --dry      # fit and report, write nothing
//
// The moment `node tts.mjs` runs for real it overwrites vo-durations.json with
// measured lengths and the film re-times itself. Nothing here is load-bearing
// after that — this exists so the picture can be built, scored, cut and watched
// before a single credit is spent.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DRY = process.argv.includes("--dry");

/** Intercept, length, and the pauses the house register writes in. */
const features = (text) => [1, text.length, (text.match(/[.!?]/g) || []).length];

/* ── gather the training set ─────────────────────────────────────────────── */

const rows = [];
const epDir = path.join(ROOT, "episodes");
for (const slug of fs.existsSync(epDir) ? fs.readdirSync(epDir) : []) {
  const dir = path.join(epDir, slug);
  const cfgPath = path.join(dir, "episode.config.json");
  const durPath = path.join(dir, "vo-durations.json");
  if (!fs.existsSync(cfgPath) || !fs.existsSync(durPath)) continue;
  const cfg = JSON.parse(fs.readFileSync(cfgPath, "utf8"));
  const durs = JSON.parse(fs.readFileSync(durPath, "utf8"));
  for (const line of cfg.vo || []) {
    const d = durs[line.scene - 1];
    if (typeof d === "number" && d > 0 && line.text) {
      rows.push({ slug, x: features(line.text), y: d, text: line.text });
    }
  }
}

if (rows.length < 8) {
  console.error(
    `only ${rows.length} archived VO lines found — not enough to fit a rate.\n` +
      `record the narration with \`node tts.mjs\` instead.`,
  );
  process.exit(1);
}

/* ── least squares (normal equations, 3×3 — Gaussian elimination) ─────────── */

const N = 3;
const A = Array.from({ length: N }, () => new Array(N + 1).fill(0));
for (const r of rows) {
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) A[i][j] += r.x[i] * r.x[j];
    A[i][N] += r.x[i] * r.y;
  }
}
for (let c = 0; c < N; c++) {
  let piv = c;
  for (let r = c + 1; r < N; r++) if (Math.abs(A[r][c]) > Math.abs(A[piv][c])) piv = r;
  [A[c], A[piv]] = [A[piv], A[c]];
  for (let r = 0; r < N; r++) {
    if (r === c || Math.abs(A[c][c]) < 1e-12) continue;
    const f = A[r][c] / A[c][c];
    for (let j = c; j <= N; j++) A[r][j] -= f * A[c][j];
  }
}
const B = A.map((row, i) => row[N] / row[i]);
const predict = (text) => features(text).reduce((s, v, i) => s + v * B[i], 0);

/* ── report the fit honestly ─────────────────────────────────────────────── */

const errs = rows.map((r) => Math.abs(predict(r.text) - r.y));
const mae = errs.reduce((a, b) => a + b, 0) / errs.length;
const worst = Math.max(...errs);

console.log(`fit on ${rows.length} archived lines from ${new Set(rows.map((r) => r.slug)).size} episodes`);
console.log(
  `  seconds = ${B[0].toFixed(2)} + ${B[1].toFixed(4)}·chars + ${B[2].toFixed(2)}·full-stop`,
);
console.log(`  mean error ${mae.toFixed(2)}s · worst ${worst.toFixed(2)}s`);
if (mae > 0.9) console.log(`  ! loose fit — treat the schedule as provisional until tts.mjs runs`);

/* ── apply it to the current script ──────────────────────────────────────── */

const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, "episode.config.json"), "utf8"));
const lines = (cfg.vo || []).slice().sort((a, b) => a.scene - b.scene);
const out = lines.map((l) => Math.round(predict(l.text) * 100) / 100);

console.log(`\n${cfg.episode} — ${lines.length} lines, estimated:`);
lines.forEach((l, i) => {
  const words = l.text.trim().split(/\s+/).length;
  console.log(`  ${String(l.scene).padStart(2)}  ${out[i].toFixed(2)}s  ${String(words).padStart(3)}w  ${l.text.split("\n")[0].slice(0, 58)}`);
});
console.log(`  total ${out.reduce((a, b) => a + b, 0).toFixed(1)}s of narration`);

if (DRY) process.exit(0);
fs.writeFileSync(path.join(ROOT, "vo-durations.json"), JSON.stringify(out, null, 2) + "\n");
console.log(`\nwrote vo-durations.json (ESTIMATES — rerun \`node tts.mjs\` to replace with measured lengths)`);
