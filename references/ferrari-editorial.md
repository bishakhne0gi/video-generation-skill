# The FERRARI EDITORIAL surface — EP19's design system

Supplied by the director as a `DESIGN.md`-style extract. This file is the
episode's brand of record; `DESIGN.md` in the repo root belongs to EP15's
Stripi system and is unrelated.

Read this before touching `Ep19.tsx`. The construction is the STATION STRIP
(`station-strip.md`), unchanged — what changes is every surface decision below,
and several of them are the OPPOSITE of what EP13–EP18 do.

---

## What makes it recognisable

Cinematic editorial — a luxury-magazine spread, not a product site. Four things
carry it, and dropping any one of them loses the brand:

1. **Near-black `#181818`, never pure black.** Slightly warm. Pure `#000` reads
   as a different, cheaper system immediately.
2. **Rosso Corsa `#da291c`, used scarcely.** Primary CTAs, the mark, and race
   position highlights — nothing else. In a 105-second film that is about six
   frames' worth. Scarcity IS the brand.
3. **Sharp `0px` corners on every CTA, card and band.** This is the single
   biggest visual departure from the rest of the playlist, which is built on
   12–20px radii. Pill geometry is reserved for badges and nothing else.
4. **Full-bleed cinematic photography is the depth treatment.** No drop-shadow
   tiers. Elevation is a brightness step (`#181818` → `#303030`) plus a 1px
   hairline, and that is the whole vocabulary.

## Tokens

| Role | Value |
|---|---|
| canvas | `#181818` |
| canvas-elevated / surface-card | `#303030` |
| canvas-light | `#ffffff` (editorial bands only) |
| hairline (on dark) | `#303030` |
| hairline (on light) | `#d2d2d2` |
| ink | `#ffffff` |
| body | `#969696` |
| muted | `#666666` |
| primary | `#da291c` |
| primary-active | `#b01e0a` |
| info / success / warning | `#4c98b9` / `#03904a` / `#f13a2c` |

Red gradient, for accent bands only: `linear-gradient(180deg, #a00c01, #da291c 64%)`.
Atmospheric darken at section transitions: `linear-gradient(180deg, #3c3c3c, #030303 64%)`.

## Type

**FerrariSans is licensed.** The documented substitute is **Inter at weight 500
with -1% letter-spacing**, which is what this episode uses. One family across
every role — no display/body split.

| Role | px | weight | tracking |
|---|---|---|---|
| display-mega | 80 | 500 | −1.6px |
| display-xl | 56 | 500 | −1.12px |
| display-lg | 36 | 500 | −0.36px |
| display-md | 26 | 500 | +0.195px |
| title-md | 18 | 700 | 0 |
| body-md | 14 | 400 | 0 |
| caption-uppercase | 11 | 600 | +1.1px |
| button | 14 | 700 | +1.4px, UPPERCASE |
| nav-link | 13 | 600 | +0.65px, UPPERCASE |
| number-display | 80 | 700 | −1.6px |

**Display weight stays at 500. Never bold.** The photography does the visual
heavy-lifting; the type does not need to compete. This is the rule an episode
built on the house style (Poppins ExtraBold at −0.05em) will break by reflex —
`display()` from `lib/cards.tsx` is the wrong register here and must not be used.

Negative tracking on display sizes ONLY. Body stays at 0.

## Spacing

Base 4px, explicit named ladder — use these, not ad-hoc values:

`xxxs` 4 · `xxs` 8 · `xs` 16 · `sm` 24 · `md` 32 · `lg` 48 · `xl` 64 · `xxl` 96 · `super` 128

Major bands take `xxl` (96). Hero band depth takes `super` (128). Editorial
content caps at 1280px; hero photography goes full-bleed.

## The components this episode actually uses

- **`hero-band-cinema`** — full-bleed photograph, zero padding, display-mega
  headline floating over the bottom of the frame. The open, the title and the
  end card.
- **`livery-band`** — a full-width Rosso Corsa band, `display-lg`, 96px padding.
  **This episode uses it as the ACT BREAK**, replacing the white chapter slate
  EP16–18 use. It is the strongest section device in the system and the reason
  the accent is affordable: three red frames in a 105-second film.
- **`spec-cell`** — transparent, value in `number-display` (80/700/−1.6px,
  white), label under it in `caption-uppercase`. Every figure in the film.
- **`race-position-cell`** — the same geometry with the value in Rosso Corsa.
  Reserved for the one number the episode is about.
- **`feature-card-photo` / `driver-card`** — `#303030` fill, 1px `#303030`
  hairline, `0px` corners, 24–32px padding. Image edge-to-edge at the top edge.
- **`badge-pill`** — `caption-uppercase` on `#303030`, `9999px`. The ONLY pill.
- **`button-outline-on-dark`** — transparent, 1px white border, sharp corners.

## The five ways an episode gets this wrong

1. **Rounded corners.** Reflex from the rest of the kit. Every `borderRadius`
   in the file is 0 except badges.
2. **Bold display type.** `display()` in `lib/cards.tsx` is 300 weight and the
   house headline is ExtraBold; neither is this brand. 500, always.
3. **Red used as a tint.** It is not a card border, not a hairline, not a chart
   series. Primary CTA, the mark, one hero number, the livery bands.
4. **Pure black.** `#000000` anywhere is a bug.
5. **A drop shadow.** Depth is photography plus a brightness step. The system
   documents exactly one soft shadow and this film does not need it.
