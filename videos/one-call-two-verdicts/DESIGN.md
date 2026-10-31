# EP 28 — THE NEWSPRINT CUTOUT

> **The core rule: nothing on this page was typeset. Everything was cut out of
> something else and stuck down.**
>
> That single sentence decides every question below. A word does not fade in —
> it is cut, lifted, and slapped onto the page. Two words never share a typeface
> unless they were cut from the same clipping. Nothing is square, because
> scissors are not. And the page underneath is *newsprint*: absorbent, warm,
> already yellowing, printed in exactly two inks.

## The two inks

Real newsprint is a black plate and one spot plate, printed slightly out of
register. That is the whole palette. There is no third colour and no gradient.

```
--news    #E3DDCE   the newsprint ground. Warm grey. Never white.
--news2   #D3CBB8   older stock — the 1994 act, visibly further back in time
--scrap   #F2EDE1   a fresh cutting, brighter than the page so it reads as ON it
--plate   #141210   a solid black plate — reversed-out type, the slates
--ink     #171310   press black. Never #000: ink on absorbent paper never gets there
--ink2    #4E4638   faded ink — captions, credits, secondary rules
--stop    #C1272D   STOP-PRESS RED. Rules, boxes, stamps, strokes, fills.
--stopt   #A81E24   red as a LETTER. The only red allowed to be type.
```

### Measured contrast (computed, not eyeballed)

| pair | ratio | verdict |
|---|---|---|
| ink / news | **13.63:1** | AA |
| ink2 / news | 6.87:1 | AA |
| stop / news | 4.31:1 | AA-large — **strokes and fills only** |
| stopt / news | **5.39:1** | AA — red type lives here |
| ink / news2 | 11.44:1 | AA |
| ink2 / news2 | 5.76:1 | AA |
| stopt / news2 | 4.52:1 | AA |
| ink / scrap | **15.81:1** | AA |
| stopt / scrap | 6.25:1 | AA |
| scrap / plate | **16.00:1** | AA |
| stop / plate | 3.20:1 | AA-large — **never type on black** |

**Red has two values and they are not interchangeable.** `--stop` is the plate:
it prints rules, stamp outlines, boxes and strikes. `--stopt` is the letter. Red
type on the black plate is forbidden outright at 3.20:1 — on `--plate`, red
becomes a *rule under* white type, never the type.

### Misregistration is the only "effect" in the film

Newspapers print the spot plate a hair off the black one. That artifact — and
nothing else — is how this film gets texture. A misregistered headline is a
`--stop` duplicate offset 3px at 0.42 alpha *behind* the black original.

**The ghost is never a separate colour and never carries meaning.** It is also
never the only copy of a word, so it can never be the thing a reader has to read
— which is why it does not appear in the contrast table. If you find yourself
reading the ghost, it is composited too hot.

## The four kinds of thing on the page

Everything in the film is one of these. There is no fifth.

| | what it is | how it moves |
|---|---|---|
| **THE PAGE** | the newsprint ground, halftone screen, fold shadow | never moves except on a seam |
| **A CUTTING** | a torn or scissored scrap with type already on it | **THE SLAP** (below) |
| **A MARK** | red pen, stamp, strike, circle, arrow — made *on* the page | draws on twos, always AFTER what it marks |
| **PRESS TYPE** | type set for this page: heads, decks, tables, code | arrives smooth, staged, never slapped |

## THE SLAP — the film's signature move

A cutting is not faded in and it is not slid in. It is **put down**:

```
from   scale 1.13   rotate  final ± (7…12)°   y −34   autoAlpha 1
to     scale 1.00   rotate  final              y 0
ease   steps(3)     duration 0.16s
```

Three positions and it is down. That is the whole move, and stepping it is what
makes it read as a hand rather than a tween. Two consequences that are rules:

- **It arrives at full opacity.** A cutting that fades up is a cutting that is
  not there yet, and the seam gate measures motion rather than visibility — a
  frame can enter blank and pass every check.
- **The shadow lands one frame late.** A separate shadow element steps from
  `y+7, scale 1.06` to `y+3, scale 1.0` starting 1/30s after the face. Paper hits
  the page, then settles onto it. Skip this and the cutting looks printed, not stuck.

**Only cuttings are stepped.** Press type, tables and diagrams move smoothly, and
**the seams are never stepped** — a velocity-matched `power4` cut rendered on
threes reads as a dropped frame, not as craft.

## Torn vs scissored — they mean different things

- **SCISSORED** (`clip-path`, straight segments, corners jittered ±3px): a
  deliberate cut. Quotations, evidence, anything the film is *citing*.
- **TORN** (`clip-path`, 14–20 points, ±7px jitter, plus a 2px lighter fibre lip
  behind): impatience. Anything the film is *arguing with*.

The 1984 and 1994 papers are scissored, because they are being quoted with
respect. The claims the film contradicts are torn.

## Type — eight families, and that is the point

A ransom note where two scraps share a typeface stops being a ransom note.
Each family has exactly one job and never takes another.

| family | job |
|---|---|
| **UnifrakturMaguntia** | the masthead. **Once in the film.** Nothing else, ever. |
| **Anton** | the headline cut — condensed, black, the loudest thing on a page |
| **Oswald 700** | the second headline voice, so two heads never match |
| **Playfair Display 900 / 700 italic** | the broadsheet cut — quotations and pull-quotes |
| **Bodoni Moda 900** | the didone cut — figures, and single words that must not match anything |
| **PT Serif** | body. Decks, captions, paper abstracts, running text |
| **Courier Prime** | the typewriter — wire copy, code, headers, protobuf, paths |
| **Archivo** | the only *non*-newspaper face: slugs, labels, small caps, the furniture |

Rule: **a headline never uses the body face, and a quotation is always Playfair.**
When the film quotes a paper, the reader should recognise the voice before reading
the attribution.

## The stamp

Verdicts arrive as a **rubber stamp**: `--stop` outline box, `--stopt` letters,
rotated 4–9°, landing in `steps(2)` over 0.10s with a hard thump, at 0.88 alpha
so the page shows through the ink. A stamp is never straight and never re-used at
the same angle twice.

## The halftone

Photographic material in a newspaper is a dot screen. Any image-like plate in this
film is drawn as a **CSS radial-gradient dot grid** at 4px pitch, `--ink` on the
page, and it is *static*. It is texture, not motion. It never animates, because a
halftone that moves is a moiré and it will destroy the encode.

## What this register is NOT

No gradients. No glass. No blur. No glow. No rounded corners over 2px. No drop
shadows softer than 12px. No coloured borders — a coloured edge is decoration
pretending to be information, and in this register colour belongs to the *ink*.
No third colour. No motion that means nothing.

## The two runtimes

GSAP owns the timeline spine, every seam, and everything the seam gate measures,
because the house motion doctrine is written against it.

**Anime.js v4.5.0 owns three jobs, each because it is genuinely the better tool:**

1. **`text.splitText`** — the ransom-note title. Every character becomes its own
   cutting with its own seeded angle and offset. Hand-rolling per-character spans
   for a 20-character headline is 60 lines; this is four.
2. **`svg.createDrawable`** — every red pen stroke, circle and arrow. It computes
   the path length itself, which is exactly the number that gets estimated wrong
   by hand.
3. **`stagger` with `grid` + `from`** — the sixteen status codes arriving as a
   4×4 grid from its centre. GSAP needs an index-to-grid function; anime.js takes
   `{grid:[4,4], from:"center"}`.

Both register with HyperFrames: GSAP on `window.__timelines[id]`, anime.js on
`window.__hfAnime`. **Anime.js instances are all `autoplay:false` and explicitly
pushed** — v4 removed `anime.running`, so the adapter's auto-discovery cannot
work and an unpushed instance silently never advances. All scatter uses
`createSeededRandom`, never `anime.utils.random`, which is not seeded and would
break frame purity.
