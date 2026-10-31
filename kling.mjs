// Author: Bishakh
//
// Kling shot generator for tech episodes.
//
//   node kling.mjs shots                 # generate every shot in episode.config.json (cached)
//   node kling.mjs shots hero intro      # only these shot ids
//   FORCE=1 node kling.mjs shots hero    # re-generate even if the mp4 exists
//   node kling.mjs bridge <id> --from public/stills/a.png --to public/stills/b.png [--prompt "..."]
//   node kling.mjs image <id> --prompt "..." [--aspect 16:9]
//   node kling.mjs manifest              # re-probe durations only
//
// Output: public/kling/<id>.mp4 (+ .png for images) and public/kling/manifest.json,
// which Remotion reads so scene lengths match the real clip lengths.
//
// Providers (set in .env.local):
//   KLING_PROVIDER=official  KLING_ACCESS_KEY=...  KLING_SECRET_KEY=...
//   KLING_PROVIDER=fal       FAL_KEY=...
// If a Kling MCP server is connected in the session, prefer its tools instead of
// this script — see SKILL.md "Step 0". This script is the always-works fallback.

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { createHmac } from "node:crypto";
import { execFileSync } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const HERE = new URL("./", import.meta.url);
const p = (rel) => new URL(rel, HERE).pathname;

/* ── env ─────────────────────────────────────────────────────────────────── */

const env = {};
if (existsSync(p(".env.local"))) {
  for (const line of readFileSync(p(".env.local"), "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) env[m[1]] = m[2].trim();
  }
}
const get = (k) => process.env[k] || env[k] || "";

const PROVIDER = get("KLING_PROVIDER") || (get("FAL_KEY") ? "fal" : "official");
const BASE = get("KLING_BASE") || "https://api-singapore.klingai.com";

/* ── ffmpeg (bundled — never trust a system ffmpeg) ──────────────────────── */

const ffmpegBin = () => {
  const dir = p("node_modules/@ffmpeg-installer/");
  if (!existsSync(dir)) return "ffmpeg";
  const plat = readdirSync(dir).find((d) => existsSync(`${dir}${d}/ffmpeg`));
  return plat ? `${dir}${plat}/ffmpeg` : "ffmpeg";
};
const FFMPEG = ffmpegBin();
export const durationOf = (file) => {
  // `ffmpeg -i <file>` prints the probe on stderr and exits 1 (no output file) —
  // that's the expected path, so read stderr off the thrown error.
  let out = "";
  try {
    out = execFileSync(FFMPEG, ["-i", file], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  } catch (e) {
    out = `${e.stderr || ""}${e.stdout || ""}`;
  }
  const m = out.match(/Duration:\s*(\d+):(\d+):(\d+\.\d+)/);
  return m ? +m[1] * 3600 + +m[2] * 60 + parseFloat(m[3]) : 0;
};

/* ── auth ────────────────────────────────────────────────────────────────── */

const b64url = (buf) => Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

/** Kling OpenAPI wants a short-lived HS256 JWT, not a raw key. */
function klingJWT() {
  const ak = get("KLING_ACCESS_KEY"), sk = get("KLING_SECRET_KEY");
  if (!ak || !sk) die("Missing KLING_ACCESS_KEY / KLING_SECRET_KEY in .env.local");
  const now = Math.floor(Date.now() / 1000);
  const head = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = b64url(JSON.stringify({ iss: ak, exp: now + 1800, nbf: now - 5 }));
  const sig = b64url(createHmac("sha256", sk).update(`${head}.${body}`).digest());
  return `${head}.${body}.${sig}`;
}

const authHeaders = () =>
  PROVIDER === "fal"
    ? { Authorization: `Key ${get("FAL_KEY") || die("Missing FAL_KEY in .env.local")}`, "Content-Type": "application/json" }
    : { Authorization: `Bearer ${klingJWT()}`, "Content-Type": "application/json" };

function die(msg) { console.error("✗ " + msg); process.exit(1); }

/* ── http ────────────────────────────────────────────────────────────────── */

async function api(method, url, body) {
  const res = await fetch(url, { method, headers: authHeaders(), body: body ? JSON.stringify(body) : undefined });
  const text = await res.text();
  let json; try { json = JSON.parse(text); } catch { json = { raw: text }; }
  if (!res.ok) die(`${method} ${url} → ${res.status}\n${text.slice(0, 900)}`);
  return json;
}

const dataUri = (file) => `data:image/png;base64,${readFileSync(file).toString("base64")}`;
const asImage = (v) => (!v ? undefined : /^https?:/.test(v) ? v : dataUri(v.startsWith("/") ? v : p(v)));

/* ── submit + poll (official Kling) ──────────────────────────────────────── */

const OFFICIAL_PATHS = { t2v: "/v1/videos/text2video", i2v: "/v1/videos/image2video", image: "/v1/images/generations" };

async function officialRun(kind, payload) {
  const path = OFFICIAL_PATHS[kind];
  const submitted = await api("POST", BASE + path, payload);
  const id = submitted?.data?.task_id;
  if (!id) die(`No task_id back from Kling:\n${JSON.stringify(submitted).slice(0, 600)}`);
  process.stdout.write(`   task ${id} `);
  for (let i = 0; i < 120; i++) {
    await sleep(i < 3 ? 5000 : 10000);
    const st = await api("GET", `${BASE}${path}/${id}`);
    const status = st?.data?.task_status;
    if (status === "succeed") {
      const r = st.data.task_result || {};
      const url = r.videos?.[0]?.url || r.images?.[0]?.url;
      if (!url) die(`Task succeeded with no asset:\n${JSON.stringify(st).slice(0, 600)}`);
      process.stdout.write("✓\n");
      return url;
    }
    if (status === "failed") die(`Kling task failed: ${st?.data?.task_status_msg || "unknown"}`);
    process.stdout.write(".");
  }
  die("Kling task timed out after ~20 min");
}

/* ── submit + poll (fal.ai hosted Kling) ─────────────────────────────────── */

const FAL_MODELS = {
  t2v: "fal-ai/kling-video/v2.1/master/text-to-video",
  i2v: "fal-ai/kling-video/v2.1/master/image-to-video",
  image: "fal-ai/flux/dev",
};

async function falRun(kind, payload) {
  const model = FAL_MODELS[kind];
  const q = await api("POST", `https://queue.fal.run/${model}`, payload);
  process.stdout.write(`   request ${q.request_id} `);
  for (let i = 0; i < 120; i++) {
    await sleep(i < 3 ? 5000 : 10000);
    const st = await api("GET", q.status_url);
    if (st.status === "COMPLETED") {
      const out = await api("GET", q.response_url);
      const url = out?.video?.url || out?.images?.[0]?.url;
      if (!url) die(`fal completed with no asset:\n${JSON.stringify(out).slice(0, 600)}`);
      process.stdout.write("✓\n");
      return url;
    }
    if (st.status === "FAILED" || st.detail) die(`fal job failed: ${JSON.stringify(st).slice(0, 400)}`);
    process.stdout.write(".");
  }
  die("fal job timed out");
}

/* ── shot → provider payload ─────────────────────────────────────────────── */

const NEGATIVE_DEFAULT =
  "text, watermark, logo, subtitles, distorted hands, warped faces, extra limbs, " +
  "low resolution, jpeg artifacts, oversaturated, flicker, morphing geometry, cartoon";

function payloadFor(shot) {
  const duration = String(shot.duration || 5);          // Kling accepts "5" or "10"
  const aspect = shot.aspect || "16:9";
  const prompt = shot.prompt;
  const negative = shot.negative || NEGATIVE_DEFAULT;
  const start = asImage(shot.image);
  const tail = asImage(shot.imageTail);
  const kind = shot.kind || (start ? "i2v" : "t2v");

  if (PROVIDER === "fal") {
    const body = { prompt, negative_prompt: negative, duration, aspect_ratio: aspect, cfg_scale: shot.cfg ?? 0.5 };
    if (kind === "i2v") { body.image_url = start; if (tail) body.tail_image_url = tail; }
    return [kind, body];
  }
  const body = {
    model_name: shot.model || get("KLING_MODEL") || "kling-v2-master",
    prompt,
    negative_prompt: negative,
    cfg_scale: shot.cfg ?? 0.5,
    mode: shot.mode || "pro",
    duration,
  };
  if (kind === "i2v") { body.image = start; if (tail) body.image_tail = tail; }
  else body.aspect_ratio = aspect;
  if (shot.cameraControl) body.camera_control = shot.cameraControl;
  return [kind, body];
}

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) die(`Download failed ${res.status} ${url}`);
  writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
}

async function generate(shot) {
  const ext = shot.kind === "image" ? "png" : "mp4";
  const dest = p(`public/kling/${shot.id}.${ext}`);
  if (existsSync(dest) && !process.env.FORCE) {
    console.log(`● ${shot.id}.${ext} (cached)`);
    return dest;
  }
  console.log(`▸ ${shot.id} — ${PROVIDER} — ${String(shot.prompt).slice(0, 70)}…`);
  const [kind, body] = shot.kind === "image"
    ? ["image", PROVIDER === "fal"
        ? { prompt: shot.prompt, image_size: "landscape_16_9" }
        : { model_name: shot.model || "kling-v2", prompt: shot.prompt, negative_prompt: shot.negative || NEGATIVE_DEFAULT, aspect_ratio: shot.aspect || "16:9", n: 1 }]
    : payloadFor(shot);
  const url = PROVIDER === "fal" ? await falRun(kind, body) : await officialRun(kind, body);
  await download(url, dest);
  console.log(`  → public/kling/${shot.id}.${ext}`);
  return dest;
}

/* ── manifest ────────────────────────────────────────────────────────────── */

function writeManifest() {
  const dir = p("public/kling/");
  mkdirSync(dir, { recursive: true });
  const manifest = {};
  for (const f of readdirSync(dir)) {
    if (!f.endsWith(".mp4")) continue;
    const id = f.replace(/\.mp4$/, "");
    manifest[id] = { file: `kling/${f}`, seconds: +durationOf(dir + f).toFixed(3) };
  }
  writeFileSync(p("public/kling/manifest.json"), JSON.stringify(manifest, null, 2));
  console.log("\nmanifest:", Object.entries(manifest).map(([k, v]) => `${k} ${v.seconds}s`).join(", ") || "(empty)");
}

/* ── cli ─────────────────────────────────────────────────────────────────── */

// tts.mjs and stills.mjs import durationOf from here — only run the CLI when
// this file is the entry point.
const isMain = process.argv[1] && new URL(`file://${process.argv[1]}`).pathname === p("kling.mjs");
if (!isMain) { /* imported as a library */ } else {

const argv = process.argv.slice(2);
const cmd = argv[0] || "shots";
const flag = (name) => { const i = argv.indexOf("--" + name); return i === -1 ? undefined : argv[i + 1]; };
const config = () => JSON.parse(readFileSync(p("episode.config.json"), "utf8"));

mkdirSync(p("public/kling/"), { recursive: true });

if (cmd === "manifest") {
  writeManifest();
} else if (cmd === "bridge") {
  // A morph clip that carries the LAST frame of one scene into the FIRST frame
  // of the next — the seamless-transition move. Both stills come from Remotion.
  const id = argv[1] || die("usage: kling.mjs bridge <id> --from a.png --to b.png [--prompt ...]");
  await generate({
    id,
    kind: "i2v",
    image: flag("from") || die("--from <png> required"),
    imageTail: flag("to") || die("--to <png> required"),
    duration: flag("duration") || 5,
    prompt: flag("prompt") ||
      "seamless cinematic morph between the two frames, continuous camera move, " +
      "elements dissolve and reassemble, motion blur, no cut, no text",
  });
  writeManifest();
} else if (cmd === "image") {
  const id = argv[1] || die("usage: kling.mjs image <id> --prompt '...'");
  await generate({ id, kind: "image", prompt: flag("prompt") || die("--prompt required"), aspect: flag("aspect") });
} else if (cmd === "shots") {
  const only = argv.slice(1).filter((a) => !a.startsWith("--"));
  const shots = (config().shots || []).filter((s) => !only.length || only.includes(s.id));
  if (!shots.length) die("No matching shots in episode.config.json");
  for (const shot of shots) await generate(shot);   // serial: Kling rate-limits hard
  writeManifest();
} else {
  die(`Unknown command "${cmd}". Try: shots | bridge | image | manifest`);
}

}
