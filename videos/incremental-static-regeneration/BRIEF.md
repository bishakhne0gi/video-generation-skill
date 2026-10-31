---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "ISR serves the stale page instantly and rebuilds it behind you — the visitor who triggers the update never waits for it"
destination: youtube
aspect: 1920x1080
language: en
length: 80s
angle: concept
voice: kokoro:am_michael
style_preset: code-editorial
---

## Intent

Episode 22 of the "Ship It" playlist — a hand-directed tech explainer series. The
topic is **Incremental Static Regeneration** in Next.js: how a static page can
update itself after it has been built.

The audience is working web developers who already know what static and dynamic
rendering are, and who have probably typed `export const revalidate = 60` without
being able to say exactly what the first request after second sixty-one actually
receives. That single question is the film: the answer is *the stale page,
immediately*, with the rebuild happening behind it.

Tone is the series' own — instructional and direct. The narrator knows the thing
and hands it over in order, without hedging. Every line opens on an instruction
verb. No hype, no "in today's video".

## Customizations

- **New toolchain.** EP 13–21 were built in Remotion; the director asked for
  HyperFrames for its motion craft and its 375-item catalog. This is the first
  episode on the new engine.
- **Fresh look, catalog-led.** The director explicitly chose NOT to carry EP 13–21's
  stripe-mesh palette and construction. `code-editorial` is the design system, and
  catalog blocks are used as designed rather than reskinned into the old series look.
- **Local voice.** The series' ElevenLabs voice is out of credits until 2026-08-31,
  so narration is local Kokoro (`am_michael`, speed 0.95 ≈ 144 wpm). This is
  audibly a different narrator from EP 13–21 and the director accepted that
  trade knowingly.

## Notes

**Every figure and every API on screen is verified against the Next.js 16.3.1
documentation (`/docs/app/guides/incremental-static-regeneration`, last updated
2026-06-23) and captioned with its source.** Nothing is presented as measured.
The checked list:

- `export const revalidate = 60` — route segment config.
- The seven-step mechanism, in the docs' own order. The load-bearing steps are
  4–6: after the window passes, *the next request still returns the cached (now
  stale) page*; the cache is invalidated and a new version *begins generating in
  the background*; once generated, *the next request returns the updated page*.
- `revalidatePath('/posts')` and `revalidateTag('posts', 'max')` from `next/cache`.
- `revalidatePath` **invalidates; it does not eagerly regenerate** — regeneration
  happens on the next request.
- The `x-nextjs-cache` response header: `HIT` · `STALE` · `MISS` · `REVALIDATED`.
  This is the film's continuity object — a real, observable artifact.
- Caveat carried as the honest-limitation beat: with multiple instances the
  default file-system cache is **per-instance**, and on-demand revalidation only
  invalidates the instance that receives the call. A shared custom cache handler
  is required to coordinate.
- Caveat: background regeneration runs on the instance that received the
  triggering request, and on per-request billing that background work is
  additional compute.

**Things to avoid:** calling ISR "the best of both worlds" (it is a trade with a
named cost); implying the first visitor after expiry gets fresh content (they do
not); implying `revalidatePath` rebuilds immediately (it does not).
