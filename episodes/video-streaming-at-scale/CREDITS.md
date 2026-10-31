# EP 24 — "Small pieces. Several sizes. Cached close." · derivation and credits

**Runtime** 1:36 · 1920×1080 · 30fps · h264 / yuv420p / bt709 / tv · AAC 48kHz stereo
**Master** `episodes/small-pieces-several-sizes-cached-close.{mp4,webm}`
**Renderer** HyperFrames 0.8.2, nine frame sub-compositions, rendered in 59.5s

---

## Every claim on screen, and where it comes from

| On screen | Source |
|---|---|
| `15 Mbps` — one Ultra HD stream | Netflix's published recommended connection speed for Ultra HD |
| `× 1,000,000` → `= 15 Tbps` | arithmetic, shown as arithmetic so the viewer checks it rather than trusts it: 15 Mbps × 10⁶ = 15 × 10¹² bit/s |
| `6.006s` segment duration | Apple's **HLS Authoring Specification** recommends a 6-second target duration; 6.006 is the 30/1.001 fps-exact value |
| `#EXTM3U`, `#EXT-X-VERSION`, `#EXT-X-STREAM-INF`, `BANDWIDTH`, `RESOLUTION`, `CODECS` | **RFC 8216** (HTTP Live Streaming) |
| `avc1.640028` / `avc1.64001f` / `avc1.64001e` | **RFC 6381** codec strings — H.264 High Profile at levels 4.0 / 3.1 / 3.0 |
| `mp4a.40.2` | RFC 6381 — MPEG-4 Audio, AAC-LC |
| `4.35 MB` / `2.10 MB` / `1.05 MB` | computed: bitrate × 6.006s ÷ 8. 5.8 Mbps → 4.354 MB; 2.8 → 2.102; 1.4 → 1.051 |
| bar lengths 900 / 434 / 217 px | exactly proportional to 5.8 : 2.8 : 1.4 (100% / 48.2% / 24.1%) |
| `bits per second, not bytes` | RFC 8216 defines `BANDWIDTH` as a peak bit rate in bits per second |

The manifest shown is **valid HLS** and internally consistent: its three `BANDWIDTH`
values are the same three the ladder in frame 5 measures, and the byte counts are
derived from them.

## The metaphor, and what each part of it is

The valley is a working model, not decoration. Every painted element maps to
something real, and every frame cuts from the painted version to the artefact:

| Valley | System |
|---|---|
| the mill on the river | the origin encoder |
| crates leaving the mill | media segments (`.m4s`) |
| three crate sizes | the ABR ladder |
| the list of what is available | the HLS master playlist |
| lit shopfronts across the hillside | edge caches |
| wind on the road | throughput |
| the basket you can carry | the player's buffer |

## Images — six painted plates, generated for this episode

All six were generated with **Kling `kling-image-v3_0_omni`**, 2K, 16:9, one
consistent hand-painted prompt register, 2 credits each (12 total). No third-party
artwork was used and no existing film, character or title was referenced — the
prompts describe a technique (gouache and watercolour on board, cel-painted forms,
no pure black) and a landscape.

`valley-dawn.jpg` · `mill.jpg` · `village-dusk.jpg` · `meadow-road.jpg` ·
`sky-texture.jpg` · `hilltop-golden.jpg` — all in `public/img/`.

Every plate carries a vector layer; none is shown naked for more than the cold
open's first two seconds.

## Audio

**Narration** — Kokoro-82M `am_michael`, local, 8 lines, 55.4s of voice.
*Not the series voice*: the ElevenLabs account returned `quota_exceeded` for both
speech and music this run (verified, not assumed). Quota resets 2026-08-31.

**Music** — *"too quiet (piano)"* by **oldDog**, **CC BY 3.0**
`https://ccmixter.org/files/oldDog/17322` · `http://creativecommons.org/licenses/by/3.0/`

Attribution required; **no share-alike**, so unlike EP 23's corridor photograph this
imposes no licence obligation on the film itself.

How it was chosen and cut, per the house doctrine:
1. 314 openly-licensed candidates harvested from ccMixter; 126 shortlisted by tag;
   24 downloaded and measured.
2. One rejected on a loudness floor (−35.4 dB mean = room tone, not a bed).
3. The remaining 23 ranked by **spectrogram**, not by level stability — twelve were
   rendered and read. Most showed vertical striations (transients that would fight
   every syllable) or broadband wash. *too quiet (piano)* was the only one with
   energy concentrated low, visible harmonic banding, slow swells, and a genuinely
   dark upper third leaving the 1–4 kHz speech band clear.
4. Scored to the arc: measured in 4s windows across its 189s, then started at
   **79s** so its loudest passages land on the two beats that carry no narration.
5. Ducked **offline** against a voice-key track built from the real narration at the
   real frame offsets (`sidechaincompress`, threshold 0.035, ratio 7, attack 22ms,
   release 680ms), after `dynaudnorm` levelled its macro swells.
6. A `volume … eval=frame` envelope lifts the sign-off.

**Measured in the finished render:** narration beats −23.1 to −21.3 dB (1.8 dB
spread), title lift +1.6 dB, sign-off lift +0.9 dB, programme peak −2.9 dB.

## Type

**Zen Maru Gothic** (700/900) — display. A rounded gothic whose terminals are
circular, so headlines read as drawn rather than set.
**Zen Kaku Gothic New** (400/500/700) — body. The same design family un-rounded, so
body copy is a quiet relative of the headline rather than a foreign font.
**JetBrains Mono** (400/700) — every technical artefact.
All three are SIL Open Font License 1.1. Latin subsets vendored to `assets/fonts/`.

## Verification

| Gate | Result |
|---|---|
| `hyperframes check` — lint | **0 errors** |
| — runtime | **0 errors** (8 expected `clip_media_fit` warnings: the designed per-frame tails) |
| — layout | **0 errors** |
| — motion | **0 errors** |
| — contrast | **0 errors, WCAG AA** |
| `seam-gate.mjs verify` | **PASSED — 0 fail, 0 warn across 8 seams** |
| every cut snapshotted at +0.06s | 8/8 show a visible carrier mid-flight |
| pacing audit on the render | **17.1% static**, 3 dead-air stretches (1.5–2.0s), all three the storyboard's scheduled stillness |

## Defects found and fixed during the build

Recorded because they are the episode's real cost, and several are new lessons.

1. **Both Z seams were mirrored.** The inverse zoom had its incoming frame growing
   while the outgoing one receded, and the zoom-through had the opposite. Each read
   as two opposed moves abutted at a cut rather than one continuous rush. The gate
   named it (`z-sign-scan`); scrubbing would not have.
2. **Three seams named a carrier that wasn't moving.** The ledger pointed at
   `#fN-stage` on frames whose *content* travels. The gate measured a stationary
   wrapper and failed correctly.
3. **Translating stages dragged their grounds off-frame**, leaving a black band down
   one edge of five entries. Ground layers now over-scan by 18%.
4. **Frame 3 entered as an empty card** — it carried the travel but its heading faded
   up behind it. The seam-carrier trap, hit again despite being in memory.
5. **Frame 1's headline had no class**, so the cold-open lines shipped at browser
   default size in the corner. Invisible to every numeric gate; caught by looking.
6. **`mix-blend-mode: luminosity` at 0.13** over a dark ground renders far hotter
   than a plain 0.13 overlay — the cloud plate was swamping the code well.
7. **A `scaleX` "type-on" squashes glyphs** rather than revealing them, because
   `width` and `clip-path` are not animatable here.
8. **26.8% of the film was static** on the first render, concentrated in the three
   card/dark frames. Fixed as content, not motion: the counter now actually counts,
   the encoder's byte figures resolve with their bars, and the manifest is written
   character by character with a caret riding the write head. 26.8% → 17.1%.

## Catalog

**No registry blocks were used this episode.** The register is hand-painted and
every surface is bespoke to it; the blocks reviewed for EP 23 own their own dark
canvases and container colours, which would have fought the paint rather than
served it. This is a smaller catalog draw than EP 23's and it is a deliberate
choice, not an oversight — recorded here so the ledger stays honest.

## The promise this episode does not pay

EP 20, 21, 22 and 23 each ended naming **subagents** as the next episode. This one
is video streaming at the director's explicit request, so the promise moves to
**EP 25**, which the end card names. That is now five episodes of deferral and it
should be the next one built.
