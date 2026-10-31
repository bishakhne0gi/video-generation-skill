# EP 26 — "Everything Costs Milliseconds"

3:08.6 · 1920×1080 · 30fps · HyperFrames 0.8.4 · shipped 2026-08-20

## Music
**"Intergalactic Journey" — spinmeister** (ccMixter, upload 21067)
Licence: **CC0 1.0 (public domain)** — no attribution obligation; credited anyway.
https://ccmixter.org/files/spinmeister/21067

Chosen on **spectrum, not level**. Ten CC BY / CC0 candidates were measured for how
much energy sits in the 300–3400 Hz speech band:

| track | speech band | below 250 Hz | level SD |
|---|---|---|---|
| **21067 (chosen)** | **32.5%** | **45.2%** | **1.75 dB** |
| 12093 | 45.1% | 32.2% | 2.53 dB |
| 45486 | 84.0% | 10.6% | 3.62 dB |

Lowest speech-band conflict, most energy underneath the voice, steadiest level, and
359s of real music so nothing loops. Share-alike tracks were excluded before ranking.

ElevenLabs Music was tried first and returned `401 quota_exceeded` — it draws on the
same credit pool as the series voice. `music.mjs` then **silently fell back to the
synth bed and reported success**; that bed was discarded, not shipped.

The duck is **baked offline** (open 0.34 / under 0.11 = 9.8 dB across 17 windows,
0.45s ramps), because the assembler mounts one flat volume per audio element.
Measured in the final render: every beat lands between −22.0 and −23.3 dB, and the
silent title card sits at −22.4 dB — level with the spoken beats.

## Voice
**Kokoro-82M `am_michael`, speed 0.95**, local, no quota. The ElevenLabs series voice
is out of credits until 2026-08-31; the director chose the stand-in over waiting.
17 lines, 141.0s total, measured straight off the files.

## Footage — Kling
9 plates, `kling-image-v3_0_omni`, 2K 16:9, 20 credits total. No video generation.

`cabinet` `lamplit` `interior` `inspection` `glass` `brass` `leather` `letterpress` `negatives`

One shared style clause across every prompt, and a hard text negative on all of them.
The first `cabinet` roll was **rejected and re-rolled**: Kling hallucinated a ruler
scale with `30` and `75` numerals despite the negative, and returned a pale mint value
where the act needed near-black. Re-rolled at 2 variants; B became the title/end-card
ground, A the lamplit act ground.

## Cue set
16 cues, `sfx.mjs --register warm`, synthesised offline, licence-free.
193 placements across 3 tracks. Act breaks are sounded `riser`+`thunk`, ordinary
seams `whoosh`, the reserved Z-back `sub`.

## Type
Archivo (variable, wdth 62–125) · JetBrains Mono 400/700 · Instrument Serif italic.
All SIL OFL, vendored locally as woff2. **Latin subsets** — Google's `css2` returns
subsets in order and taking the first gives Cyrillic (a 4KB JetBrains Mono was the tell).

## Verification
- `hyperframes check`: 0 errors, 0 warnings (lint, runtime, layout, motion)
- Pacing: **21.5% static** at this film's own floor (0.208, scaled from mean luma 25.0;
  the default 1.6 is calibrated for a white page and would report ~48%)
- Mean motion energy 1.74
- Audio stream present; per-beat levels within 1.3 dB
- Seam stills at −0.10 / +0.05 / +0.25s on all 17 cuts

**Not done:** the film could not be played back in Chrome in this environment —
`readyState 0` on localhost media for both the master and a Constrained Baseline
960×540 proxy, with the range server verifiably returning 206. Real-time viewing was
replaced by boundary stills and measured audio. A human pass with sound on is still owed.
