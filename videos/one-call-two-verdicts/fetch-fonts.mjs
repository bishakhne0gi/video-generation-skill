// Newspaper-cutout register needs MANY families: a ransom note where two scraps share
// a typeface stops being a ransom note. Seven, each doing one job.
import { writeFileSync, existsSync } from "node:fs";
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36";
const WANT = [
  ["Anton",              "Anton",              "wght@400",                 "Anton-400"],
  ["Playfair Display",   "Playfair+Display",   "wght@900",                 "Playfair-900"],
  ["Playfair Display",   "Playfair+Display",   "ital,wght@1,700",          "Playfair-700i"],
  ["PT Serif",           "PT+Serif",           "wght@400",                 "PTSerif-400"],
  ["PT Serif",           "PT+Serif",           "wght@700",                 "PTSerif-700"],
  ["PT Serif",           "PT+Serif",           "ital,wght@1,400",          "PTSerif-400i"],
  ["Courier Prime",      "Courier+Prime",      "wght@400",                 "Courier-400"],
  ["Courier Prime",      "Courier+Prime",      "wght@700",                 "Courier-700"],
  ["Bodoni Moda",        "Bodoni+Moda",        "opsz,wght@96,900",         "Bodoni-900"],
  ["UnifrakturMaguntia", "UnifrakturMaguntia", "wght@400",                 "Fraktur-400"],
  ["Oswald",             "Oswald",             "wght@700",                 "Oswald-700"],
];
for (const [name, fam, axes, out] of WANT) {
  const dest = `assets/fonts/${out}.woff2`;
  if (existsSync(dest)) { console.log(`skip ${out}`); continue; }
  const url = `https://fonts.googleapis.com/css2?family=${fam}:${axes}&display=block`;
  const css = await (await fetch(url, { headers: { "User-Agent": UA } })).text();
  // take the LATIN subset — the last src block in a css2 response is latin
  const urls = [...css.matchAll(/src:\s*url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)/g)].map(m => m[1]);
  if (!urls.length) { console.log(`FAIL ${out}: no woff2 in css`); console.log(css.slice(0,300)); continue; }
  const buf = Buffer.from(await (await fetch(urls[urls.length - 1])).arrayBuffer());
  if (buf.slice(0, 4).toString("latin1") !== "wOF2") { console.log(`FAIL ${out}: not wOF2`); continue; }
  writeFileSync(dest, buf);
  console.log(`ok   ${out.padEnd(14)} ${(buf.length / 1024).toFixed(0)}kB  ${name}`);
}
