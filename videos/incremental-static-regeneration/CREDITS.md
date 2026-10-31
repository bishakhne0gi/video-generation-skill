# EP 22 — "Serve the Stale. Rebuild Behind It."

Incremental Static Regeneration. 1:10, 1920×1080, eight frames.

**First episode built on HyperFrames rather than Remotion**, at the director's
request, and the first with a deliberately fresh look rather than the series'
stripe-mesh construction.

---

## Toolchain

| | EP 13–21 | EP 22 |
|---|---|---|
| Renderer | Remotion (React) | **HyperFrames** (HTML + GSAP, headless Chrome) |
| Design system | hand-built `stripe-mesh` | `code-editorial` frame preset |
| Render time | ~8 min for 89s | **24s for 70s** |
| Colour tags | `yuvj420p` / `bt470bg` (needed a re-encode for Chrome) | **`yuv420p` / bt709 natively** |
| Seam verification | none | **`seam-gate.mjs` — numeric, 7/7 passed** |
| Narration | ElevenLabs (series voice) | local Kokoro-82M |

Skill pack: `npx skills add heygen-com/hyperframes --full-depth` (25 skills).
Authoring followed `/hyperframes` → `/faceless-explainer`, with `/motion-doctrine`
loaded first as its gateway requires.

## Design system

`code-editorial` preset, unmodified except for legibility:

- warm cream paper `#FAF9F5` (never pure white), ink `#141413`
- **one** terracotta coral `#CC785C` as scarce "voltage" — never two per frame
- warm-navy code surface `#1F1E1B`, syntax in coral / teal `#5DB8A6` / amber `#E8A55A`
- EB Garamond 400 display, Inter body, JetBrains Mono for code and chrome
- the ✱ coral spike as the kicker mark, hairline borders, one soft warm shadow

Two deliberate deviations, both forced by the contrast checker and both recorded
here rather than silently applied:

1. Source captions and the episode mark were lifted from 38–42% ink to 62% — they
   failed WCAG AA at 2.4–2.7:1.
2. The code keyword coral was lifted to `#D98A6E` **on the navy surface only**.
   Brand coral on warm navy measures 2.97:1 against a 3:1 floor for large text.
   Same hue, same role, legibility only.

Final check: **65/65 text checks pass WCAG AA.**

## Motion

Per `/motion-doctrine`. The current is **LEFT**; every ordinary seam is a
cut-the-curve travelling left, exit `power4.in` / entry `power4.out`, entry ≈127%
of exit, cut landing mid-motion on both sides.

Three reserved vectors, spent three times only:

| Seam | Vector | Meaning |
|---|---|---|
| title → options | z-forward (zoom-through) | deeper into the same thought |
| options → second sixty-one | **z-back (inverse zoom)** | **ARRIVAL — the thesis lands** |
| cost → sign-off | y-up | elevation into the conclusion |

`node motion-doctrine/scripts/seam-gate.mjs verify --ledger ledger.json` →
**PASSED, 0 fail / 0 warn across 7 seams**: exit still moving at every cut, entry
mid-flight rather than from rest, measured direction matching the ledger, zero
overlap (one side visible per frame), and both Z seams sign-matched.

No idle wobble anywhere; every frame names a sustained-motion route in
`STORYBOARD.md`. A 0.65s stillness sits before the climax in frame 4.

## Every figure on screen, and its source

All verified against the **Next.js 16.3.1** documentation,
`/docs/app/guides/incremental-static-regeneration` (last updated 2026-06-23), and
captioned on screen. Nothing is presented as measured.

- `export const revalidate = 60` — route segment config.
- The mechanism, in the docs' own order: after the window passes *the next
  request still returns the cached (now stale) page*; the cache is invalidated and
  a new version *begins generating in the background*; *once generated, the next
  request returns the updated page*.
- `revalidatePath('/posts')` and `revalidateTag('posts', 'max')` from `next/cache`.
- **`revalidatePath` invalidates; it does not eagerly regenerate** — regeneration
  waits for the next request. This is frame 6's whole reason for existing.
- `x-nextjs-cache`: `HIT` · `STALE` · `MISS` · `REVALIDATED` — the film's
  continuity object, because it is a real observable artifact rather than an
  invented mascot.
- Frame 7's caveat, quoted: with multiple instances the default file-system cache
  is **per-instance**, and on-demand revalidation only invalidates the instance
  that receives the call; a shared custom cache handler is required to coordinate.

The `10,000 pages` and `41,850 requests` counters are illustrative scale, not
claimed measurements, and are captioned as the cost of each approach rather than
as benchmarks.

## Narration

**Kokoro-82M, `am_michael`, speed 0.95, local — not the series voice.**

The ElevenLabs voice used by EP 13–21 was out of credits until 2026-08-31 (10
characters remaining). The director chose the local voice knowingly rather than
wait. Six lines, 55.7s of speech in a 70.1s film; frames 2 and 8 carry no line,
which is where the bed lifts.

Line 4 was rewritten and re-recorded. At 17 words it measured 185 wpm and looked
rushed — but on **syllable rate**, which is the metric that actually matters, it
was 4.0 syll/s against line 1's 3.9. It was never rushed; short common words
inflate wpm. It was rewritten anyway, to say the film's real insight out loud:
*"The one who paid for it never saw it."*

## Music

**"ambient sounds 14.mp3"** by burning-mir — CC0 1.0
https://freesound.org/people/burning-mir/sounds/117782

Chosen on measurement, not on the first search hit: eight CC0 candidates were
downloaded and measured across the stretch that plays, and this one moves
**2.4 dB** across five equal slices against 2.9–4.8 dB for the rest.

Ducked **offline** with an ffmpeg sidechain carve against the real narration, so
the mix is baked and deterministic rather than depending on runtime automation.
Verified per beat in the render: every beat lands between −22.5 and −24.6 dB, and
the title (−24.3) and end card (−22.5) sit level with the VO beats — the bed
lifts on the two beats that exist for it. Peak −3.6 dB, no clipping.

## Known follow-ups

- `check` reports two advisory warnings: the composition is a single 480-line file
  and track 1 carries 8 timed elements. Both suggest splitting frames into
  sub-compositions under `compositions/`. Monolithic was chosen deliberately for a
  first build on a new toolchain — it avoids every sub-composition transport rule
  (template wrapping, host-id matching, id prefixing). Worth splitting before EP 23.
- The `hyperframes-registry` catalog (375 blocks) was **not** drawn on for this
  episode; every frame is hand-authored against the preset. Blocks like
  `code-morph`, `code-shader-dissolve` and `bar-chart-race` are the obvious next
  upgrade.
