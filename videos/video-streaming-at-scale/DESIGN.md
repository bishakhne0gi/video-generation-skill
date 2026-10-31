# The Valley — design system for EP 24

A hand-painted animation register. Everything on screen either *is* paint, or is
drawn to sit **on** paint: warm, soft-edged, humane, with no pure black anywhere
and no element that looks computed.

This system replaces the Replicate system used in EP 23 for this episode only, at
the director's request. Series continuity is carried by the *construction* — the
seam grammar, the continuity object, the sign-off — not by the colour.

## 1. Colours

Painted grounds are the real palette; these tokens are what the vector layer is
allowed to use so it never fights the paint.

### Ground registers

| Register | Field | Where |
|---|---|---|
| **sky** | the painted plate, full bleed | cold open, the takeaway |
| **paper** | `--paper` `#F4EBD9` washed over a painted plate at 0.90 | the argument frames — arithmetic, the ladder |
| **meadow** | painted plate at full strength, vectors in a paper card | segmentation, adaptive bitrate |
| **night** | `--night` `#1E2A38` | the manifest — the one dark frame in the film |

### Tokens

| Token | Value | Role |
|---|---|---|
| `--paper` | `#F4EBD9` | the wash. Aged cream. **Never white.** |
| `--paper-warm` | `#FBF6EA` | raised cards on paper |
| `--cloud` | `#FDFBF4` | type on dark or saturated grounds |
| `--ink` | `#3B2F2A` | all body and display type on light. A warm brown-black |
| `--ink-soft` | `#6B5A4E` | secondary type, captions, sources |
| `--sky` | `#7FB4DC` | painted-sky sampled fill |
| `--sky-deep` | `#2E5F8A` | headers on paper, the river |
| `--meadow` | `#7FA653` | the "smaller / lighter" rung |
| `--meadow-deep` | `#3F6B34` | the "correct" state, ticks, resolved |
| `--terracotta` | `#C4552F` | **the accent.** Roof-tile red |
| `--terracotta-lit` | `#EE8557` | the accent, dark register only |
| `--night` | `#1E2A38` | the code well. Deep indigo, never `#000` |
| `--night-mute` | `#A8BACB` | secondary type inside the code well |

**Measured contrast** (all computed, not estimated):

| Pair | Ratio | Verdict |
|---|---|---|
| `ink` on `paper` | **10.91:1** | AA body ✓ |
| `ink-soft` on `paper` | **5.55:1** | AA body ✓ |
| `sky-deep` on `paper` | **5.68:1** | AA body ✓ |
| `meadow-deep` on `paper` | **5.27:1** | AA body ✓ |
| `ink` on `sky` | **5.82:1** | AA body ✓ |
| `cloud` on `night` | **14.05:1** | AA body ✓ |
| `night-mute` on `night` | **7.31:1** | AA body ✓ |
| `terracotta-lit` on `night` | **5.63:1** | AA body ✓ |
| **`terracotta` on `paper`** | **3.78:1** | **large text only** |

### The accent rule

`--terracotta` is the roof-tile red that already exists in every painted plate,
which is exactly why it is the accent: it is *sampled from the art*, not imposed
on it. It appears **at most once per frame**, in one of three roles:

1. the one hot word in a display line,
2. a 2px rule or underline,
3. the live/current state of the continuity object.

At **3.78:1 on paper it fails AA for body copy**, so it is permitted only at
display sizes and on rules. On the dark register it is replaced outright by
`--terracotta-lit` (5.63:1), never merely brightened by opacity.

**Never `#000` and never `#fff`.** The deepest tone in the film is `--ink`; the
lightest is `--cloud`. Pure black on a painted ground is the single loudest way
to make paint look like a slide.

## 2. Typography

Three families. Emphasis is a **change of family**, never a change of weight.

| Role | Family | Weight | Size (cqw) | Line | Tracking |
|---|---|---|---|---|---|
| `display-xxl` | Zen Maru Gothic | 900 | 8.2 | 0.95 | −0.02em |
| `display-xl` | Zen Maru Gothic | 900 | 6.0 | 1.00 | −0.02em |
| `display-l` | Zen Maru Gothic | 700 | 4.2 | 1.08 | −0.01em |
| `lede` | Zen Kaku Gothic New | 500 | 2.15 | 1.42 | 0 |
| `body` | Zen Kaku Gothic New | 400 | 1.55 | 1.55 | 0 |
| `label` | Zen Kaku Gothic New | 700 | 0.92 | 1.2 | **0.16em**, uppercase |
| `code` | JetBrains Mono | 400/700 | 1.30 | 1.62 | 0 |
| `figure` | JetBrains Mono | 700 | 5.4 | 1.0 | −0.01em |

**Zen Maru Gothic** is the register's whole argument in a typeface: a rounded
gothic whose terminals are literally circular, so display type reads as *drawn*
rather than set. **Zen Kaku Gothic New** is its non-rounded sibling — same design
family, so body copy is a quiet relative of the headline instead of a foreign
font. **JetBrains Mono** carries every technical artefact: manifests, codec
strings, bitrates, byte counts, the segment id.

Numbers always use `font-variant-numeric: tabular-nums`. A figure that reflows
while it counts has broken the frame.

## 3. Surfaces

- **The paper card.** `--paper-warm`, `border-radius: 14px`, a 1px `--ink` at 12%
  hairline, and a soft warm drop shadow. This is the only container in the film.
  There is no second card style.
- **No coloured container edges, ever.** Colour belongs to content — a word, a
  rung, a tick, a state. A card that needs a coloured border is a card with
  nothing in it.
- **The code well** is `--night` at full opacity, radius 12px, mono only. It is
  never dimmed with opacity (memory: `grey-slab-failure-mode`); to de-emphasise a
  line, dim the *line*.
- **Rounded everything.** Chips and pills are `border-radius: 999px`. Cards 14px.
  The register has no sharp corner except a deliberate 2px rule.
- **Paint shows through.** Every wash over a painted plate is 0.86–0.92, never
  1.0. If you cannot see brushwork through the wash, the wash is too strong.

## 4. Motion

The register's signature is **wind**: a slow, continuous, whole-field drift on the
painted plates with a 14–22 second period and 1.5–3% travel. It is the one place
in the film where continuous idle motion is allowed, because it is what the
painting depicts.

**It never touches the vector layer.** Diagrams, type and cards obey the house
doctrine unchanged: locked frame, staged arrival, running systems, no idle wobble.
Paint breathes; information does not.

## 5. Deliberate deviations from the `broadside` preset

1. Preset display family → **Zen Maru Gothic**; preset body → **Zen Kaku Gothic New**.
2. Preset's flat single-colour field → **painted photographic plates** under every frame.
3. Preset's zero radius → **14px cards, 999px chips**.
4. Preset's near-black → `--ink` `#3B2F2A`, and `--night` `#1E2A38` for the well.
5. Preset allows accent on container edges → **forbidden**; accent is content-only.
6. Preset has one register → **four grounds** (sky / paper / meadow / night), one per act.
7. Preset bans continuous motion → **wind is permitted on paint only**.
