---
format: 1920x1080
duration: 80s
message: "ISR serves the stale page instantly and rebuilds it behind you — the visitor who triggers the update never waits for it"
arc: "Question → Title → The two bad options → Second sixty-one → The next visitor → On-demand → The honest cost → Sign-off"
audience: "Working web developers who have typed `export const revalidate = 60` without being able to say what the first request after second sixty-one receives"
mode: autonomous
---

# Storyboard — Incremental Static Regeneration

**The film asks one question in the first ten seconds and answers it at the
midpoint.** The question is *who waits for the rebuild*, and the answer is
*nobody — the visitor who triggers it gets the stale page instantly*. Everything
before frame 4 sets that question up; everything after it spends the answer.

**The continuity object is the `x-nextjs-cache` response header.** It is a real
artifact from the Next.js docs, not an invention, and it appears in every frame
from 3 to 7 as a small monospace chip, changing only when the argument changes:
`MISS` → `HIT` → `STALE` → `HIT` → `REVALIDATED`. Only the value animates; the
header name never moves, because the point is that it is the same header.

## Motion plan (per `/motion-doctrine`)

- **The current is LEFT.** Every ordinary seam is a cut-the-curve travelling left.
- **Reserved vectors, spent three times only:**
  - **Z forward (zoom-through)** — frame 2 → 3, pushing deeper into the same thought.
  - **Z backward (inverse zoom)** — frame 3 → 4, ARRIVAL. The thesis lands and it
    must feel bigger than what preceded it. This is the film's one true event.
  - **Upward** — frame 7 → 8, elevation into the conclusion.
- **Transition budget: 3.** cut-the-curve (LEFT), zoom-through, inverse-zoom.
- **No idle wobble anywhere.** Every frame names its sustained-motion route below.
- **Stillness before climax:** a 0.6s hold after the request lands in frame 4 and
  before `STALE` resolves — the dramatic comma.

---

## Frame 1 — The question

- status: outline
- duration: 9s
- transition_in: cut
- scene: One line of config types itself, then the question the film exists to answer drops beneath it
- voiceover: Type revalidate sixty on a static page. Now answer one question — at second sixty-one, who waits for the rebuild?
- sustained_motion: staged reveals
- exit_vector: x-left
- catalog: code-typing

The config types on the warm-navy code surface — `export const revalidate = 60`
alone, no file chrome, no surrounding function. It is one line because the whole
point is that it is one line.

It settles. Then, beneath it, the question arrives in display serif: **"second 61
— who waits?"** The coral spike marks the `61`. The frame holds on the question,
not on the code.

## Frame 2 — Title

- status: outline
- duration: 5s
- transition_in: cut-the-curve-left
- scene: Title card — Serve the Stale. Rebuild Behind It.
- voiceover:
- sustained_motion: staged reveals
- exit_vector: z-forward
- catalog: titlecard-lockup

**Silent — no narration.** The bed lifts here, and it is one of only two places
in the film that happens.

`Ship It · EP 22` as the mono kicker. The title in two lines, the second
answering the first. A hairline rule draws left to right beneath it and the
lockup holds truly still.

## Frame 3 — The two you already have

- status: outline
- duration: 10s
- transition_in: zoom-through
- scene: Static and dynamic side by side — one is instant and wrong, the other is right and expensive
- voiceover: Compare what you already have. Static is instant, and wrong until you rebuild all ten thousand pages. Dynamic is right, and pays to render every request.
- sustained_motion: sequenced UI life
- exit_vector: z-back
- catalog: data-chart

Two columns. LEFT is **static**: a response time of `12ms` and a build bar that
runs `10,000 pages · 6m 40s` every time anything changes. RIGHT is **dynamic**:
always current, and a render cost meter that ticks up on every single request
and never stops for the length of the beat.

The costs are what animate — the build bar filling on the left, the request
counter climbing on the right. Neither column is the answer, and the frame ends
with both marked with a small coral `✱` cost.

## Frame 4 — Second sixty-one

- status: outline
- duration: 10s
- transition_in: inverse-zoom
- scene: THE THESIS — the request after expiry gets the stale page instantly, and the rebuild starts behind it
- voiceover: Watch second sixty-one. The request still gets the cached page, immediately — and the rebuild starts behind it.
- sustained_motion: animated sequences
- exit_vector: x-left
- catalog: —

**The film's one true arrival.** It enters on an inverse zoom because something
bigger has landed.

A horizontal timeline with the `revalidate = 60` window marked. Requests arrive
as small marks along it — `HIT`, `HIT`, `HIT` — instant every time. The window
expires; the track past `60` goes cool.

The next request arrives. **Stillness — 0.6s.** Then two things happen at once
and the split is the whole teaching: the response fires back immediately stamped
`STALE`, *and* a second track opens underneath it labelled *regenerating in the
background*. The visitor's line is already gone before the rebuild bar has moved.

## Frame 5 — The next visitor

- status: outline
- duration: 9s
- transition_in: cut-the-curve-left
- scene: The rebuild completes and the following request gets the fresh page, never knowing
- voiceover: Now take the next visitor. They get the new page, and they never knew a rebuild happened.
- sustained_motion: animated sequences
- exit_vector: x-left
- catalog: —

The background bar completes and swaps the cached page beneath the cache line —
interpolated, not cut, because it is a cache entry being replaced rather than a
slide changing. The next request arrives and comes back `HIT`, with the new
content.

The frame's quiet point, set small: **the visitor who paid for the rebuild is not
the visitor who benefits from it.**

## Frame 6 — Don't wait for the clock

- status: outline
- duration: 11s
- transition_in: cut-the-curve-left
- scene: On-demand revalidation — and the nuance that it invalidates rather than rebuilds
- voiceover: Skip the timer. Call revalidatePath the moment the data changes. But know what it does — it invalidates the entry, it does not rebuild it.
- sustained_motion: staged reveals
- exit_vector: x-left
- catalog: code-highlight

A server action on the code surface:

    'use server'
    import { revalidatePath } from 'next/cache'

    export async function createPost() {
      revalidatePath('/posts')
    }

`revalidateTag('posts', 'max')` arrives beneath it as the granular alternative,
with the docs' own guidance set small: *prefer revalidating entire paths*.

Then the correction, which is the reason this frame exists: the cache entry is
struck through as invalidated, and the rebuild bar **does not move** until a
request arrives to trigger it. The header chip reads `REVALIDATED`.

## Frame 7 — The honest cost

- status: outline
- duration: 11s
- transition_in: cut-the-curve-left
- scene: THE CATCH — with multiple instances the cache is per-instance, and revalidation reaches only one
- voiceover: Now scale it out. Each instance keeps its own cache, so revalidating reaches one of them. The rest serve the old page until their own timer expires.
- sustained_motion: animated sequences
- exit_vector: y-up
- catalog: —

Four instances, each with its own cache. `revalidatePath` is called and lands on
exactly one of them — that one flips to fresh. **The other three keep serving the
old page**, each with its own timer counting down independently, and they are the
loud part of the frame.

The fix is named rather than dramatised: a shared **custom cache handler** draws
in beneath them, connecting the four to one store.

Source captioned: *Next.js 16.3.1 · caveats*.

## Frame 8 — Sign-off

- status: outline
- duration: 7s
- transition_in: cut-up
- scene: End card — the takeaway and the next episode
- voiceover:
- sustained_motion: staged reveals
- exit_vector: —
- catalog: titlecard-lockup

**Silent — the bed lifts for the second and last time.**

The takeaway, stated as the rule rather than a recap: **"Serve the stale. Rebuild
behind it. Just never promise the first visitor it's fresh."**

Then `Bishakh`, and the next episode named.
