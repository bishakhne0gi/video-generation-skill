// Author: Bishakh
//
// Verification stills — you must LOOK at the film before calling it done.
//
//   node stills.mjs out/episode.mp4                 # contact sheet (5x4 tiles) → out/stills/sheet.png
//   node stills.mjs out/episode.mp4 --at 2,8.5,17   # exact timestamps → out/stills/t2.png …
//   node stills.mjs out/episode.mp4 --boundaries    # ±0.25s around every scene edge in vo-durations.json
//
// The contact sheet catches dead air, collisions and black frames in one Read.
// The --boundaries pass is the one that catches bad transitions: it samples the
// frame before, during and after each cut.

import { execFileSync } from "node:child_process";
import { mkdirSync, existsSync, readFileSync, readdirSync } from "node:fs";
import { durationOf } from "./kling.mjs";

const HERE = new URL("./", import.meta.url);
const p = (rel) => new URL(rel, HERE).pathname;
const FFMPEG = (() => {
  const dir = p("node_modules/@ffmpeg-installer/");
  if (!existsSync(dir)) return "ffmpeg";
  const plat = readdirSync(dir).find((d) => existsSync(`${dir}${d}/ffmpeg`));
  return plat ? `${dir}${plat}/ffmpeg` : "ffmpeg";
})();

const video = process.argv[2] || "out/episode.mp4";
const src = video.startsWith("/") ? video : p(video);
if (!existsSync(src)) { console.error(`✗ No such video: ${src}`); process.exit(1); }
const OUT = p("out/stills/");
mkdirSync(OUT, { recursive: true });

const flag = (n) => { const i = process.argv.indexOf("--" + n); return i === -1 ? undefined : process.argv[i + 1]; };
const grab = (t, name) => {
  execFileSync(FFMPEG, ["-y", "-ss", String(t), "-i", src, "-frames:v", "1", "-vf", "scale=960:-1", `${OUT}${name}.png`], { stdio: "ignore" });
  console.log(`  ${name}.png  @ ${(+t).toFixed(2)}s`);
};

const total = durationOf(src);
console.log(`${video} — ${total.toFixed(2)}s`);

// audio sanity: a silent film is a failed film
let probe = "";
try { probe = execFileSync(FFMPEG, ["-i", src], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }); }
catch (e) { probe = `${e.stderr || ""}`; }
console.log(probe.match(/Stream #.*Audio:.*/)?.[0] || "⚠ NO AUDIO STREAM — narration never made it into the render");

if (process.argv.includes("--boundaries")) {
  const durs = JSON.parse(readFileSync(p("vo-durations.json"), "utf8"));
  let t = 0;
  durs.forEach((d, i) => {
    t += d + 0.9;                       // scene length convention: VO + breath
    if (t + 0.3 > total) return;
    grab(Math.max(0, t - 0.3), `cut${i + 1}_pre`);
    grab(t, `cut${i + 1}_on`);
    grab(Math.min(total - 0.05, t + 0.3), `cut${i + 1}_post`);
  });
} else if (flag("at")) {
  flag("at").split(",").forEach((t) => grab(parseFloat(t), `t${t.replace(/\./g, "_")}`));
} else {
  const n = Number(flag("tiles") || 20);
  const fps = n / total;
  execFileSync(FFMPEG, ["-y", "-i", src, "-vf", `fps=${fps.toFixed(4)},scale=480:-1,tile=5x4`, "-frames:v", "1", `${OUT}sheet.png`], { stdio: "ignore" });
  console.log(`  sheet.png — ${n} frames, one every ${(total / n).toFixed(1)}s`);
}
