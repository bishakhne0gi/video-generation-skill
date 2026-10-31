# EP 27 — The Annotated Page

The first **light** episode in the playlist. Everything sits on paper, and the
film's recurring gesture is a hand drawing on that paper.

> **Core rule: the page is printed, the marks are made.**
> Type, rules and panels are *printed* — flat, exact, no motion of their own.
> Highlighter, circles, arrows, ticks and crossings-out are *drawn* — stepped at
> 15fps, never perfectly straight, always arriving after the thing they mark.
>
> A mark that appears at the same instant as the type it annotates is part of
> the layout. A mark that arrives 0.4s later is somebody pointing.

## Tokens

```
--paper    #F4F1EA   the ground. Never pure white.
--paper-2  #E7E1D4   the second paper — act 3's warmer field
--sheet    #FBF9F4   a document laid ON the ground (the request, the RFC page)
--ink      #14110E   type. Warm near-black, never #000
--ink-2    #5A5245   secondary type, captions, de-emphasised rows
--navy     #16233B   a FIELD, not an accent. Slates and the honest ending
--yellow   #FFEB00   the highlighter. Reserved.
--pen      #DC3220   the red pen. STROKES ONLY.
--pen-type #B32414   red as a glyph. The only red that may be a letter.
--rule     #B8B0A0   hairlines and dividers. Never a glyph.
```

## Measured contrast (WCAG 2.1 relative luminance)

| Pair | Ratio | Verdict |
|---|---|---|
| `--ink` on `--paper` | **16.68:1** | body ✓ |
| `--ink` on `--sheet` | **17.88:1** | body ✓ |
| `--ink-2` on `--paper` | **6.83:1** | body ✓ |
| `--ink-2` on `--paper-2` | **5.91:1** | body ✓ |
| `--ink` on `--yellow` | **15.35:1** | body ✓ |
| `--navy` on `--yellow` | **12.81:1** | body ✓ |
| `--pen-type` on `--paper` | **5.86:1** | body ✓ |
| `--pen` on `--paper` | 4.12:1 | **large only — hence strokes** |
| `--sheet` on `--navy` | **14.92:1** | body ✓ |
| `--yellow` on `--navy` | **12.81:1** | body ✓ |
| `--rule` on `--paper` | 1.91:1 | **never a glyph** |
| `--pen` on `--navy` | 3.38:1 | **never appears** |

## The four rules

**1 — Yellow is a highlighter, not a fill.**
It appears in exactly two forms: *behind* ink type as a swiped marker bar, or as
a full-bleed field (title card, end card) carrying ink or navy type. It is never
a chip, never a border, never a glyph. Reserved to roughly one phrase per frame;
a frame with two highlights has one too many.

**2 — Red has two values and they are not interchangeable.**
`--pen #DC3220` measures 4.12:1 and is therefore **strokes only** — circles,
arrows, underlines, crossings-out, the ✗ column. `--pen-type #B32414` measures
5.86:1 and is the only red allowed to be a letter. Picking one value for both
would mean either an illegible word or a pen too dark to read as a pen.

**3 — Navy is a field, not an accent.**
Full-bleed navy is spent twice: the chapter slate, and the honest ending. Type
on it is `--sheet` or `--yellow`. The red pen never touches navy (3.38:1) — on
the dark field the annotation colour becomes yellow.

**4 — Nothing is perfectly square.**
Every cut-out (a sheet, a card, a tab) carries a rotation between −1.4° and
+1.4°, derived from its index so the render stays deterministic. Marker bars are
skewed −1.2°. Hand-drawn circles are ellipses with a gap in the stroke and an
overshoot where the pen crossed its own start. *"You don't want it to look
perfect because that might make it look more like an ad than an editorial
piece."* — Joey Sendaydiego, Vox art director.

## Motion

**Printed things move as one.** Type, rules and sheets ride the stage; inside a
frame they arrive with a staged, smooth `power3.out`.

**Drawn things step.** Every annotation tween carries `ease: "steps(N)"` with
`N = round(duration × 15)` — a 0.40s marker sweep is `steps(6)`. At a 30fps
render that is a new position every other frame, which is the closest clean
division to Vox's 12fps-in-24. The stage seams are **never** stepped: a
velocity-matched `power4` cut rendered on twos reads as a dropped frame, not as
craft.

**The value journey** — one dominant field brightness per act:

| Act | Frames | Field |
|---|---|---|
| 0 | open, title | paper → full-bleed **yellow** |
| 1 | shelf, getbody, post, notapparent, cost | **paper** |
| — | slate | full-bleed **navy** |
| 2 | query, table, cachekey | **paper-2** (warmer — the fix feels different) |
| 3 | name, catch | paper → full-bleed **navy** |
| 4 | end | full-bleed **yellow** |

## Type

| Role | Face | Setting |
|---|---|---|
| Headlines | **Archivo** 800, stretch 88% | `-0.045em`, line-height .90 |
| Deck / lead | Archivo 500, stretch 100% | 31–34px |
| Spec quotations | **Instrument Serif** 400 | 46–58px, the thing the highlighter marks |
| One accent word per title | Instrument Serif *italic* | house rule, carried |
| Anything technical | **JetBrains Mono** 400/700 | requests, headers, ids, status codes |
| Labels / tags | JetBrains Mono 700 | `.18em` tracking, uppercase |

Numerals are `tnum` everywhere. Method names (`GET`, `POST`, `QUERY`) are always
mono, always uppercase, never in the headline face — the method is a token, not
a word.

## The signature move

**The highlight sweep.** A `--yellow` bar, ~0.82× the type's font-size tall,
sitting behind the phrase at `z-index: 0`, `transform-origin: 0% 50%`,
`skewX(-1.2deg)`, animated `scaleX 0 → 1` over 0.34–0.44s on `steps(N)`. It
arrives *after* the type, on the narration's word. Six of them in the film. The
seventh would make it a transition.

## What this register is NOT

No gradients. No glass. No blur. No glow. No drop shadow softer than
`0 10px 24px rgba(20,17,14,.12)`. No coloured borders on any container — a sheet
is defined by its shadow and its edge, not by a stripe. If a frame needs a
colour to be interesting, the frame has nothing to say.
