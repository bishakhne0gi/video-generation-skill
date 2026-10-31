// EP29 — the Replicate system's three lanes plus one accent. The proprietary faces
// (rb-freigeist-neue, basier-square) are unlicensed here, so DESIGN.md's documented
// substitutes are used: Bricolage Grotesque for display, Inter for body. JetBrains
// Mono is open source and is used directly, as the system says.
import { writeFileSync, existsSync } from "node:fs";
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36";
const WANT = [
  // Bricolage is a variable font; pin the display axes so the render can't drift.
  ["Bricolage Grotesque", "Bricolage+Grotesque", "opsz,wdth,wght@48,100,800", "Bricolage-800"],
  ["Bricolage Grotesque", "Bricolage+Grotesque", "opsz,wdth,wght@14,100,600", "Bricolage-600"],
  ["Inter",               "Inter",               "wght@400",                 "Inter-400"],
  ["Inter",               "Inter",               "wght@600",                 "Inter-600"],
  ["JetBrains Mono",      "JetBrains+Mono",      "wght@400",                 "Mono-400"],
  ["JetBrains Mono",      "JetBrains+Mono",      "wght@700",                 "Mono-700"],
  ["Instrument Serif",    "Instrument+Serif",    "ital@1",                   "Instrument-400i"],
];
for (const [name, fam, axes, out] of WANT) {
  const dest = `assets/fonts/${out}.woff2`;
  if (existsSync(dest)) { console.log(`skip ${out}`); continue; }
  const url = `https://fonts.googleapis.com/css2?family=${fam}:${axes}&display=block`;
  const css = await (await fetch(url, { headers: { "User-Agent": UA } })).text();
  // the LAST src block in a css2 response is the latin subset
  const urls = [...css.matchAll(/src:\s*url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)/g)].map((m) => m[1]);
  if (!urls.length) { console.log(`FAIL ${out}: no woff2 in css`); console.log(css.slice(0, 300)); continue; }
  const buf = Buffer.from(await (await fetch(urls[urls.length - 1])).arrayBuffer());
  if (buf.slice(0, 4).toString("latin1") !== "wOF2") { console.log(`FAIL ${out}: not wOF2`); continue; }
  writeFileSync(dest, buf);
  console.log(`ok   ${out.padEnd(16)} ${(buf.length / 1024).toFixed(0)}kB  ${name}`);
}
