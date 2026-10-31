# EP 29 — Built Once, or Built Again Every Time

**Slug** `built-once-or-every-time` · **Runtime** 3:27 · **Renderer** HyperFrames 0.8.11
· **Runtimes** GSAP 3 + anime.js 4.5.0 · **Register** the Proof Sheet, on the
Replicate design system · **Recorded** 2026-08-23 / 24

---

## The honesty note

Nothing in this film is illustrative. Every number on screen was measured on the live
web on **2026-08-23**, and every sentence in quotation marks is verbatim from a primary
source that is named on the frame carrying it. Where a line is my own gloss rather than
a quotation, it is set in Inter; quotations are set in Bricolage on a dark act and in
the mono lane when they are code. A figure with no visible provenance did not go on a
frame.

Two things the film asserts that are **not** measurements, and are marked as such on
screen:

- **The decision rule in frame 17** is a way of thinking, not a result. The taxonomy it
  uses is web.dev's and is cited on the frame.
- **Frame 18's list of page kinds** (docs, blogs, marketing, pricing) is my
  characterisation of where the mistake is common. It is not a survey.

### Two caveats that change how the numbers should be read

1. **Excalidraw registers a service worker.** Everything measured here is a **cold,
   first visit**, which is stated on every frame that carries a timing. A repeat visit
   is a substantially better story and this film does not show it.
2. **These are two sites, not a benchmark.** They demonstrate the mechanism. jekyllrb.com
   is unusually lean and excalidraw.com is an unusually heavy application; the gap
   between a median static site and a median SPA is smaller than the gap here. Named on
   the frame.

---

## The measurements

Chrome DevTools, **Slow 4G network + 4× CPU throttle, cold cache, 412×823 @2×**, same
device, minutes apart. Raw traces in `research/trace-ssg-cold.json` and
`research/trace-csr-cold.json`.

| | jekyllrb.com (SSG) | excalidraw.com (CSR) |
|---|---|---|
| TTFB | 16 ms | 74 ms |
| **First Contentful Paint** | **1,728 ms** | **6,836 ms** |
| Largest Contentful Paint | 1,630 ms | 7,105 ms |
| load event | 2,877 ms | 6,800 ms |
| HTML on the wire | 3,449 B (gzip) | 2,391 B (brotli) |
| HTML decoded | 10,393 B | 6,862 B |
| JavaScript on the wire | 48,113 B | 855,457 B |
| main bundle, decoded | — | 2,165,763 B |
| all subresources | 268,916 B | 895,441 B |
| Screenshot events in the trace | 37 | 7 |
| `body.innerText`, scripts removed | 1,105 chars | 10 chars |

Per-asset byte counts are `content-length` on real responses fetched with
`Accept-Encoding: br, gzip`. jekyllrb.com's first-party total is
3,449 + 13,881 + 1,350 + 2,152 = **20,832 B**; the 44,611 B `docsearch.min.js` is
third-party and is shown below a rule on frame 11 rather than folded into that total.

### The ETag

```
etag: "6a3960e0-2899"        jekyllrb.com, GitHub Pages
```

`0x6a3960e0` = 1782145248 = **Mon, 22 Jun 2026 16:20:48 GMT**, which is exactly the
`last-modified` header on the same response. `0x2899` = **10393**, which is exactly the
byte count. Decoded and checked; the arithmetic is reproducible in two lines of Python.
Excalidraw's `"048dfd962c80b256c88cecf254e4a4e3"` is shown as a contrast and **no claim
is made about its meaning** beyond that it is a hash with no date and no size in it.

### The two renderings

`assets/web/ssg-plate.png` and `assets/web/csr-plate.png` are the two delivered
documents rendered at 1200×900 @2×, with every `<script>` element removed and a `<base>`
tag added so stylesheets and images still resolve. Nothing else was changed, and the
frame says so on the sheet. `research/nojs/` holds the exact HTML that was rendered.

`assets/web/csr-turn.png` is Excalidraw's own start screen, captured live.

### The localStorage listing

Frame 16's keys are the genuine `Object.keys(localStorage)` on `https://excalidraw.com`
on 2026-08-23, in a browser that had opened the app and drawn nothing:
`excalidraw` (2 bytes — an empty scene), `excalidraw-state` (1,626 bytes),
`excalidraw-theme`, `version-files`, `version-dataState`, `i18nextLng`.

---

## Sources, in the order the film uses them

| # | Source | Used for |
|---|---|---|
| 1 | **Create React App**, `packages/cra-template/template/public/index.html`, lines 27–41 — MIT | the `<noscript>` line, the `<div id="root">`, and the comment *"If you open it directly in the browser, you will see an empty page."* |
| 2 | **Tom Preston-Werner**, *"Blogging Like a Hacker"*, 17 Nov 2008 | *"It takes a template directory … and spits out a complete, static website suitable for serving with Apache or your favorite web server."* |
| 3 | **web.dev**, *"Rendering on the Web"*, Addy Osmani & Jason Miller, published 6 Feb 2019, last updated 5 Jan 2026 | *"Static rendering happens at build time."* · *"The primary downside to client-side rendering is that the amount of JavaScript required tends to grow as an application grows."* · the build/request/run taxonomy |
| 4 | **Excalidraw**, its own start screen | *"Your drawings are saved in your browser's storage."* |
| 5 | **jekyllrb.com** (Jekyll 4.4.1, GitHub Pages) and **excalidraw.com** (React SPA, Vercel) | every header, byte count and trace. Both projects are MIT, so their HTML is quotable in full |

---

## Assets

- **Music** — *"Lost in Memory"* by **gurdonark**, ccMixter,
  **CC BY 3.0 — attribution required in the episode description.** No share-alike.
  <https://ccmixter.org/files/gurdonark/37767>
- **Voice** — Kokoro-82M `am_michael` at speed 0.95, the series stand-in. The ElevenLabs
  series voice is still out of credits (see the quota note in memory).
- **Type** — Bricolage Grotesque (display), Inter (body), JetBrains Mono (code),
  Instrument Serif italic (one accent word). All SIL Open Font License. These are the
  documented substitutes for Replicate's unlicensed rb-freigeist-neue and basier-square.
- **Cue set** — 16 sounds synthesised offline for the series; no third-party audio.
- **No Kling, no generated imagery.** Every picture in this film is either a real
  screenshot or live DOM.

### How the bed was chosen

443 ccMixter tracks harvested across 14 tags with share-alike excluded at harvest time;
74 downloaded; 26 passed the length and loudness floors. **The winner was not the
top-ranked track.** Three tracks scored a wider speech-band carve and all three were
rejected on their spectrogram — dense regular vertical striations, which is a drum kit,
which would have fought every cut. *Lost in Memory* has its energy low, a dark upper
region and no pulse: carve 13.6 dB (body −21.1, speech −34.7). Ranking on the number
alone would have shipped a beat.

The two-level mix is **baked offline** (`mix.mjs`) because HyperFrames mounts BGM as one
`<audio>` with one `data-volume`: a voice key at the real offsets, `dynaudnorm`, a
hand-drawn `volume=…:eval=frame` envelope built from smooth ramps (never `between()`,
which is a click), `sidechaincompress`, one fixed gain, `alimiter`. Measured on the file
that shipped: **−27.1 to −37.7 dB under narration, −23.9 to −27.0 dB with none,
lift +3.8 dB.**

---

## Documented defects — things that went wrong and what fixed them

1. **`ease: steps(3)` emitted unquoted** killed every frame's script at the first line.
   The timeline was never registered, so the film rendered as static DOM — and every
   gate passed, because the DOM was correct. Only `hyperframes check`'s
   `console_error` caught it.
2. **White on the orange hero band failed AA-large.** Measured: white on `#ea2804` is
   4.37:1, on `#ff6a3d` 2.85 and on `#f4a8a0` 1.92. The mesh was rebuilt so the light
   pools live in the right third where nothing is ever set, and the left 60% runs
   `#a81a00 → #ea2804`. The contrast budget wrote the layout.
3. **`--primary` cannot be a word on cream** (4.09:1). `--primary-deep #c01f00` (5.71:1)
   is the only orange allowed to be type. Same shape as the forest/emerald split in EP 26.
4. **The header rule was orange on all nineteen frames**, which spent the
   one-orange-per-frame budget before any frame had said anything. It is `--ink` now —
   which is Replicate's own `hairline-strong`, not a substitution.
5. **A `left` tween on the travelling dot** snaps to integer device pixels under
   seek-by-frame capture. Caught by the motion gate; moved to `x`.
6. **385 cue clips timed the mixer out.** `audio_processing_failed / ffmpeg_timeout`
   after 325 seconds on 422 timed clips. Fixed by baking the cue bus offline
   (`sfxmix.mjs`) into one file, taking the contract from 422 clips to 38.
7. **The one soft drop shadow cost two renders.** A 24px-blur `box-shadow` on a plate
   that is being scaled and translated forces a full blurred-layer re-raster every
   frame; capture died at frame 750 of 6,222 — inside the frame carrying two of them —
   once on protocol timeout and once with Chrome gone (`write EPIPE`). Replaced with a
   1px hairline, which is closer to the system's own colour-blocking rule anyway.

---

## The promise still owed

EP 26, EP 27 and EP 28 each ended naming subagents as the next episode. This episode
took the 29 slot at the director's explicit request, which makes subagents **ten**
episodes overdue and the promise broken on camera four times running. EP 29's end card
names `EP 30 · SUBAGENTS`.
