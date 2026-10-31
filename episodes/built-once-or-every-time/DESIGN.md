# EP 29 — THE PROOF SHEET

The Replicate design system (`videos/authentication-vs-authorisation/DESIGN.md`,
supplied by the director 2026-08-17) at EP 26's craft level. Colour and type come
from Replicate and are not negotiable. Everything below is the *translation* of
that system to a 1920×1080 moving frame, plus the one signature move this episode
owns.

The film is a **printed proof of a website**. Cream stock, editorial whitespace,
and every piece of evidence pasted onto it as one of exactly four things. Nothing
here is a slide with a rectangle on it.

---

## The four kinds of thing on the page

| | What it is | Made of | Moves like |
|---|---|---|---|
| **THE SHEET** | the cream ground. Full-bleed, no edges | `--canvas`, hairline rules | only on a seam |
| **A WELL** | a dark print pull-quote holding real bytes | `--dark` / `--deep`, radius 10, mono | colour-blocks in, then TYPES |
| **A PLATE** | a real screenshot from the real web | a `.png` from `assets/web/` | rises out of a well |
| **A STAMP** | the one decided thing | `--primary` ground, radius full | lands, once per frame |

The register's whole discipline: **a well holds what was sent; a plate holds what
was seen; a stamp holds what it means.** If a piece of evidence does not fit one
of those three, it is prose and it gets cut.

---

## Tokens — WCAG measured, not estimated

Straight from Replicate. The ratios are computed, and three of them are
load-bearing rules rather than trivia.

| Token | Hex | on `--canvas` | on `--dark` | Job |
|---|---|---|---|---|
| `--canvas` | `#f9f7f3` | — | 15.23 | the sheet. **Never `#fff` at page level** |
| `--bone` | `#f3f0e8` | 1.06 | 14.31 | inset groups, the second column |
| `--card` | `#ffffff` | 1.07 | 16.29 | cards, inputs, plate mounts — the ONLY white |
| `--dark` | `#202020` | 15.23 | — | code wells. Warmer than black, matching cream |
| `--deep` | `#000000` | 19.63 | — | the code-tab strip, the footer |
| `--ink` | `#202020` | **15.23** | — | every heading and figure on cream |
| `--body` | `#3a3a3a` | **10.63** | — | prose at 18px+ |
| `--charcoal` | `#575757` | **6.75** | — | captions, metadata, source lines |
| `--mute` | `#646464` | **5.53** | — | supporting labels, inactive columns |
| `--ash` | `#8d8d8d` | 3.10 | **4.91** | comments INSIDE a dark well only |
| `--stone` | `#bbbbbb` | 1.79 | **8.49** | secondary text inside a dark well |
| `--on-dark` | `#fcfcfc` | 1.04 | **15.88** | every word inside a well |
| `--primary` | `#ea2804` | 4.09 | 3.73 | **THE STAMP. A fill, a band, a rule — never a word** |
| `--primary-deep` | `#c01f00` | **5.71** | 2.67 | orange as a LETTER. The only orange allowed to be type |
| `--success` | `#2b9a66` | 3.32 | 4.59 | ≥30px only, and only where a state is genuinely OK |

Three rules that fell out of computing the numbers:

1. **`--primary` can never be a word on cream.** 4.09:1 fails AA for normal text.
   Same lesson as `--forest` in the instrument register and clay in the clay
   register: *the fill colour and the type colour are two different values.*
   `#ea2804` fills; `#c01f00` speaks.
2. **The orange hero band can only carry display type.** `--canvas` on
   `--primary` is 4.09 and `#ffffff` on `--primary` is 4.26 — both AA-large only.
   Which is exactly what the system already says the hero band is for
   (`display-xxl`, 128px). The constraint enforces the design; do not fight it.
3. **`--ash` flips sides.** 3.10 on cream (fails) but 4.91 on `--dark` (passes).
   It exists for one job: the greyed comment inside a code well. It never appears
   on the sheet.

**One orange element per frame.** This is Replicate's hardest rule and the film
turns it into an argument: in a two-column comparison **orange belongs to exactly
one column, and it moves to the other column when the argument does.** The
viewer learns to read the stamp as "this is the one being talked about" without
being told.

---

## Type — three lanes, one accent

Replicate's proprietary faces are unlicensed here, so the documented substitutes
are used, with the documented corrections.

| Face | Weight / size | Job |
|---|---|---|
| **Bricolage Grotesque** | 800, `lineHeight 1.0`, `-0.028em` | display ≥30px — heads, act slates, figures |
| **Inter** | 400 | body, decks, captions, metadata. **Never 500** |
| **JetBrains Mono** | 400 / 700 | every byte, header, path, ETag, figure with a unit |
| **Instrument Serif** italic | 400 | exactly ONE word, on the title card only |

- Display holds `lineHeight: 1.0` and negative tracking that scales with size:
  −3px at 128, −1.8px at 72, −1px at 48, −0.5px at 30. Substitutes track looser
  by default, so the tracking is explicit everywhere and never inherited.
- **Emphasis is a family change, never a weight bump.** Inter 400 → Bricolage. If
  a line reads flat, it is the wrong family, not the wrong weight.
- `font-variant-numeric: tabular-nums` on every figure. A byte count whose digits
  change width while it counts is not a measurement.
- Code is never set in Inter, at any size. A `<div id="root">` in a sans is a
  drawing of code.

**The display cut is checked at the size it renders.** Bodoni cost EP 28 a render
by dissolving below 80px; Bricolage 800 is a text-safe grotesque and holds down
to 30px, which is why the system caps display there and hands everything smaller
to Inter or the mono.

---

## THE SIGNATURE MOVE — the fill

EP 26's move was the needle, because `rotation` is animatable and a number with
mass has to swing. EP 29's move is **the fill**, because the film is about when
HTML gets its content — so the move has to *be* that.

Every well in this film performs the same three-part action, and the two sides of
the argument perform it differently. That difference is the whole episode.

**The move**

1. **The well colour-blocks in** — `--dark` sweeps across the cream from the
   left on `power4.out`, 0.34s. Not a fade, not a shadow: Replicate's elevation
   language is colour-blocking, so a well *arrives as a block of colour*.
2. **It types** — real bytes, monospace, `anime.text.splitText` + a stagger
   driven by GSAP, ~58 cps, with `key1..4` cues underneath. A block of code that
   is simply present was never typed, and the viewer reads it in a second and
   waits.
3. **The plate rises out of it** — a `--card` panel scales `0.92 → 1.00` and
   translates up out of the well's top edge over 0.5s on `power3.out`, carrying
   the rendered form of exactly those bytes.

**The two sides**

- **SSG** — steps 2 and 3 overlap. The plate begins rising while the type is
  still landing, because the words were already in the document. It reads as
  *effortless*.
- **CSR** — step 2 types `<div id="root"></div>` in 0.4s and stops. The plate
  starts to rise **and stalls at 6%**, because there is nothing to lift. A
  `--primary` bar then fills across the bottom of the well counting real bytes
  to `855,457`, and only on completion does the plate **snap** the remaining 94%
  in 0.18s on `power4.out`. Everything at once, at the end.

The stall is the single most important 1.2 seconds in the film. It is not a
stylistic flourish — it is the measured 6,836 ms, played as a gesture.

**Never re-light a well.** `box-shadow` is not animatable in HyperFrames (the
lesson from clay and from the instrument panel), and Replicate forbids shadows on
cream anyway. Wells are translated, scaled and clipped — never re-lit.

---

## The two clocks — the value journey

Replicate's section rhythm is **cream → orange hero → cream → dark code-story
band → cream → black footer**, and the film's act structure follows it exactly.
Each act also carries one clock, top-right, in mono:

| Act | Field | Clock | Reads as |
|---|---|---|---|
| 0 open / title | cream → **orange hero** | none / none | the question |
| 1 · WHAT CAME BACK | cream | **BUILD 22 JUN 2026 16:20:48** — stopped | evidence, at rest |
| 2 · WHEN | **dark code-story band** | both, side by side | the mechanism |
| 3 · WHAT IT COSTS | cream | **REQUEST +0000 ms** — running | measurement, live |
| 4 · THE TURN | cream → **orange** | stopped again, and empty | the concession |
| 5 · end | **black footer** | none | the instruction |

A stopped clock and a running clock are the same object in two states, which is
what makes the act change land as a change of *argument* rather than a change of
slide. Act 2 is the only frame that shows both, because Act 2 is the one that
names the three moments.

---

## Shapes, elevation and the things that are banned

- **Radius `full` (9999px) on every interactive-looking element** — pills,
  badges, the status chip, the CTA. **Radius 10 on content cards and wells.**
  Radius 0 only on full-bleed bands and the footer. There are no sharp corners on
  this sheet outside a band.
- **Elevation is colour-blocking, not shadow.** Hairline `rgba(32,32,32,0.12)`
  dividers replace shadow on cream. Exactly one soft drop shadow exists —
  `0 8px 24px rgba(32,32,32,0.08)` — and it is reserved for lifting a **plate**
  (a real screenshot), because that is the one element that is photography.
- **Never dim a dark well with opacity.** On a light field that produces mid-grey
  slab, which is the defect [[grey-slab-failure-mode]] records. Dim the *content*
  inside the well, never the well.
- **Never put a colour on a container's edge.** No 3px accent top-borders, no 4px
  left-borders. Colour belongs to content. One `--dark`, one hairline, and the
  bytes tell the wells apart.
- **No orange on body text, ever**, and no second brand hue. `--success` is
  functional, not decorative.

---

## Seams

`transition_in: cut` everywhere; both halves authored — the entry inside the
frame, the exit appended centrally in `build.mjs`, because a seam authored on one
side only is the defect that shipped EP 28's first cut. House current is **LEFT**.

- **ACROSS** (ordinary frames) — outgoing travels left over its last 0.34s on
  `power4.in` (236px); incoming enters from the right over 0.43s on `power4.out`
  (300px ≈ 127% of the exit travel). Sounded `whoosh`.
- **LIFT** (the four act breaks only) — outgoing exits UP and pulls back to 0.86;
  incoming rises from below through the same scale on a softer curve. Sounded
  `riser` + `thunk`.
- **Z-BACK — reserved, spent ONCE, on `paint` → `turn`.** The moment the film
  stops prosecuting client rendering and starts defending it. Both halves share
  the sign of the scale velocity: the outgoing recedes 1.00 → 0.60, the incoming
  enters at 1.48 and settles **down** to 1.00. Mirroring reads as a bounce and is
  wrong. Sounded `sub`.

A 0.6s **stillness** sits immediately before the Z-back. It is the cheapest
emphasis available and this film's one climax has earned it.

---

## What this register is NOT

- Not a dashboard. There are no gauges, no sparklines and no KPI tiles. The
  instrument-panel vocabulary belongs to EP 26 and is not reused.
- Not a terminal film. There is exactly one shell prompt (frame 01, the two
  `curl`s) and it exists to establish that the evidence is real.
- Not a slide deck. Every dark rectangle on screen is a **code well containing
  real bytes**, not a card with a title in it.
- Not white. `#ffffff` appears on cards, plate mounts and inputs and nowhere
  else. The temperature of the film comes from the cream, and a pure-white page
  loses the brand in one frame.

---

## The two runtimes

GSAP owns the spine, every seam, and every clock. **anime.js owns three jobs it
genuinely wins** — `text.splitText` for the type-on (one instance instead of
three hundred zero-duration `tl.set` calls), `svg.createDrawable` for the hairline
rules and connector paths (it computes path length itself, which is exactly the
number that gets estimated wrong by hand), and `stagger({ grid, from })` for the
byte-block matrix.

anime is **driven by GSAP**, never registered on `window.__hfAnime`: an instance
created inside a frame sub-composition is never discovered by the adapter, and
even when discovered it receives *global* time while GSAP receives frame-*local*
time. Both failures are silent. `drive()` in `lib/frame.mjs` is the fix — anime
computes every value, GSAP is only the clock, and the result stays frame-local
and seek-safe.

`anime.steps(n)` is a **top-level** export. The v4 string form `"steps(n)"` warns
to the console and then silently falls back to the default ease, which cost EP 28
119 silently-smooth animations.
