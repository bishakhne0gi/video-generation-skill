// A MEASURING TOOL, not a guess.
//
// Mounts one frame sub-composition standalone (same gsap + anime.js + fonts the
// renderer uses), seeks its timeline to a frame-LOCAL time, and prints the real client
// rects of whatever selectors you name. Built after two rounds of estimating element
// geometry against font metrics that had never been measured — the exact defect class
// that shipped ten broken highlighter sweeps in EP27.
//
//   node measure.mjs <frame-basename> <local-seconds> <selector> [selector...]
//   node measure.mjs 05-tableone 6.0 "#f5-n2" "#f5-l1"
//   node measure.mjs 03-ed1984 1.0 --all      # every element with an id
import { readFileSync, writeFileSync, globSync } from "node:fs";

const HF = `${process.env.HOME}/.npm/_npx/0f94ee7615faf582/node_modules`;
const puppeteer = (await import(`${HF}/puppeteer-core/lib/puppeteer/puppeteer-core.js`)).default;
const CHROME = globSync(`${process.env.HOME}/.cache/hyperframes/chrome/chrome-headless-shell/*/*/chrome-headless-shell`)[0];

const [, , frame, at, ...sels] = process.argv;
const src = readFileSync(`compositions/frames/${frame}.html`, "utf8");
const inner = src.replace(/^[\s\S]*?<template>/, "").replace(/<\/template>[\s\S]*$/, "");

// The harness lives OUTSIDE the project: a second file carrying data-composition-id in
// the project root is discovered as a rival entry point and aborts `hyperframes check`
// before layout and contrast ever run.
const ROOT = process.cwd();
const OUT = `${process.env.TMPDIR || "/tmp"}/hf-measure.html`;
const harness = `<!DOCTYPE html><html><head><meta charset="UTF-8"><base href="file://${ROOT}/">
<script src="file://${ROOT}/assets/vendor/gsap.min.js"></script>
<script src="file://${ROOT}/assets/vendor/anime.umd.min.js"></script>
<style>*{margin:0;padding:0;box-sizing:border-box}html,body{width:1920px;height:1080px;overflow:hidden}</style>
</head><body>${inner}</body></html>`;
writeFileSync(OUT, harness);

const b = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox"] });
const p = await b.newPage();
await p.setViewport({ width: 1920, height: 1080 });
const errs = [];
p.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
await p.goto("file://" + OUT, { waitUntil: "networkidle0" });
await p.evaluate(() => document.fonts.ready);
await new Promise((r) => setTimeout(r, 900));   // lazily-referenced faces finish here

const out = await p.evaluate((t, ss) => {
  const T = window.__timelines || {};
  for (const k in T) { try { T[k].seek(+t); } catch (e) {} }
  const pick = ss[0] === "--all"
    ? [...document.querySelectorAll("[id]")].map((e) => "#" + CSS.escape(e.id))
    : ss;
  return pick.map((s) => {
    const e = document.querySelector(s);
    if (!e) return { sel: s, missing: true };
    const b = e.getBoundingClientRect();
    // the INK box too: a Range over the element's text nodes gives what the eye sees,
    // which is what an overlap gate cares about — not the block's declared box.
    let ink = null;
    try {
      const r = document.createRange(); r.selectNodeContents(e);
      const k = r.getBoundingClientRect();
      if (k.width) ink = [Math.round(k.x), Math.round(k.y), Math.round(k.right), Math.round(k.bottom)];
    } catch (_) {}
    return { sel: s, x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height),
             x2: Math.round(b.right), y2: Math.round(b.bottom), ink,
             txt: (e.textContent || "").replace(/\s+/g, " ").trim().slice(0, 30) };
  });
}, at, sels.length ? sels : ["--all"]);

for (const r of out) {
  if (r.missing) { console.log(`${r.sel.padEnd(16)} MISSING`); continue; }
  console.log(`${r.sel.padEnd(15)} box x ${String(r.x).padStart(5)}..${String(r.x2).padStart(5)} y ${String(r.y).padStart(4)}..${String(r.y2).padStart(4)}` +
    (r.ink ? `  ink x ${String(r.ink[0]).padStart(5)}..${String(r.ink[2]).padStart(5)} y ${String(r.ink[1]).padStart(4)}..${String(r.ink[3]).padStart(4)}` : "".padEnd(38)) + `  ${r.txt}`);
}
if (errs.length) console.log("\nCONSOLE ERRORS:\n" + errs.slice(0, 6).join("\n"));
await b.close();
