// EP28 narration. Kokoro-82M am_michael at 0.95 — the series stand-in while the
// ElevenLabs quota is out. Lines come from SCRIPT.md so there is one source of truth.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";

const VENV = `${process.env.HOME}/.cache/hyperframes/tts/venv/bin/python`;
const FF = `${process.env.HOME}/.claude/skills/tech-episode-video/node_modules/@ffmpeg-installer/darwin-arm64/ffmpeg`;
const FP = "/opt/homebrew/bin/ffprobe";

const LINES = readFileSync("SCRIPT.md", "utf8").split("\n")
  .filter((l) => /^\d\d\s/.test(l))
  .map((l) => { const [, n, id, t] = l.match(/^(\d\d)\s+(\S+)\s*\|\s*(.+)$/); return { n: +n, id, text: t.trim() }; });

mkdirSync("assets/voice", { recursive: true });
const only = process.argv.slice(2).map(Number).filter(Boolean);
const durs = [];

for (const L of LINES) {
  const out = `assets/voice/${String(L.n).padStart(2, "0")}.wav`;
  if ((!only.length || only.includes(L.n)) && (!existsSync(out) || process.env.FORCE)) {
    process.stdout.write(`${L.n} ${L.id} … `);
    execFileSync("npx", ["hyperframes", "tts", L.text, "-v", "am_michael", "-s", "0.95", "-o", out],
      { stdio: ["ignore", "ignore", "inherit"], env: { ...process.env, HYPERFRAMES_PYTHON: VENV } });
    console.log("ok");
  }
  const d = +execFileSync(FP, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", out]).toString().trim();
  durs.push(Math.round(d * 100) / 100);
}

writeFileSync("vo-durations.json", JSON.stringify(durs, null, 1) + "\n");
console.log(`\n${durs.length} lines, ${durs.reduce((a, b) => a + b, 0).toFixed(1)}s total`);
console.log(durs.map((d, i) => `  ${String(i + 1).padStart(2, "0")} ${LINES[i].id.padEnd(12)} ${d.toFixed(2)}s`).join("\n"));
