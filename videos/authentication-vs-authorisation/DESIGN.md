# Replicate — Design System (supplied by the director, 2026-08-17)

The normative source for this episode and the ones after it. `frame.md` is this
system translated to the 1920×1080 frame; where the two disagree, this file wins
on *atoms* (colour, type, radius, component identity) and `frame.md` wins on
*frame-scale composition*.

Overview, in the director's words: a developer-tools platform with the soul of an
art zine. Public surfaces sit on a warm cream canvas rather than the
white-or-near-black default of typical AI infrastructure sites, and that single
decision colours everything else — photography reads as editorial, code wells read
as printed pull-quotes, and the brand orange feels like a stamp rather than a
notification.

## Colors

### Brand & accent
| Token | Hex | Role |
|---|---|---|
| `primary` | `#ea2804` | Replicate Orange. Primary CTA, hero band, inline link colour. **A stamp — one orange element per viewport at most.** |
| `primary-deep` | `#c01f00` | pressed state of primary |
| `hero-glow` | `#ff6a3d` | lighter orange, mid-stop of the hero radial mesh |
| `hero-pink` | `#f4a8a0` | warm pink wash softening the hero band's bottom edge |
| `on-primary` | `#ffffff` | label colour on primary surfaces |

### Surface
| Token | Hex | Role |
|---|---|---|
| `canvas` | `#f9f7f3` | default page background. Warm cream, **never pure white** |
| `surface-bone` | `#f3f0e8` | half-step deeper cream, inset card groups and feature bands |
| `surface-card` | `#ffffff` | model cards, search inputs, pricing tiers — **the only place white appears** |
| `surface-dark` | `#202020` | code wells, featured pricing tier, the "how it works" band |
| `surface-deep` | `#000000` | footer canvas, the inset code-tab strip |
| `hairline` | `rgba(32,32,32,0.12)` | 1px dividers on cream |
| `hairline-strong` | `#202020` | button outlines, focused inputs, structural separators |

### Text
| Token | Hex | Role |
|---|---|---|
| `ink` | `#202020` | primary text. Notably warmer than `#000000`, matching the cream |
| `body` | `#3a3a3a` | long-form copy at 18px+ |
| `charcoal` | `#575757` | captions, metadata, secondary nav |
| `mute` | `#646464` | supporting text, inactive labels |
| `ash` | `#8d8d8d` | tertiary text, placeholders |
| `stone` | `#bbbbbb` | disabled foreground, neutral icon outlines |
| `on-dark` | `#fcfcfc` | primary text on dark/deep |
| `on-dark-mute` | `rgba(252,252,252,0.72)` | secondary text in dark regions |

### Semantic
`badge-success` `#2b9a66` · `link` `#ea2804` (same as primary, links pull into the
brand accent) · `ring-focus` `rgba(59,130,246,0.5)` · `github-dark` `#24292e`.

## Typography

Three families, three jobs, no overlap:

- **rb-freigeist-neue** — heavy, slightly condensed grotesque; all display 30px+.
  Carries the editorial-magazine personality through `lineHeight: 1.0` and
  negative tracking.
- **basier-square** — humanist sans; body, button labels, captions, metadata.
- **JetBrains Mono** — every code well, command, model slug, inline literal.

**Substitutes** (the proprietary faces are unlicensed here): **Bricolage
Grotesque** or Migra for freigeist; **Inter** or Geist for basier-square;
JetBrains Mono is open-source and used directly. When substituting, clamp display
`lineHeight` to 1.0 explicitly and apply −3% tracking on the two largest steps —
substitutes track looser by default.

| Token | Size | Weight | LH | Tracking | Use |
|---|---|---|---|---|---|
| `display-xxl` | 128 | 700 | 1.0 | −3px | the single hero headline. One per page |
| `display-xl` | 72 | 700 | 1.0 | −1.8px | section openers |
| `display-lg` | 48 | 700 | 1.0 | −1px | sub-section titles, tier names |
| `display-md` | 30 | 600 | 1.2 | −0.5px | feature card titles |
| `heading-lg` | 38.4 | 600 | 0.83 | −0.5px | tightly-stacked basier headlines |
| `heading-md` | 24 | 600 | 1.33 | −0.35px | card titles |
| `heading-sm` | 20 | 600 | 1.4 | −0.3px | list section headers |
| `subtitle` | 18 | 600 | 1.56 | 0 | lead paragraphs |
| `body-lg` / `body-md` / `body-sm` | 18 / 16 / 14 | 400 | 1.56 / 1.5 / 1.43 | 0 | prose, default, captions |
| `button-md` / `button-sm` | 16 / 14 | 600 | 1.0 | 0 | button labels, sub-nav pills |
| `caption` | 12 | 400 | 1.33 | 0 | footer disclosure |
| `caption-tight` | 14 | 600 | 1.43 | −0.35px | emphatic pricing rows |
| `code-md` / `code-sm` | 14 / 11 | 400 | 1.43 / 1.5 | 0 | code blocks, code-tab labels |

Principles: display holds `lineHeight: 1.0`; negative tracking scales with size
(−3px at 128 down to −0.3px at 20), body stays at 0. **Body weight stays 400 —
never bumped to 500 for emphasis. Emphasis is a family change** (basier →
freigeist). Code is never set in basier, even at small sizes.

## Layout

Base unit 4px. `xxs` 2 · `xs` 4 · `sm` 8 · `md` 12 · `lg` 16 · `xl` 24 · `xxl` 32
· `xxxl` 48 · `section` 96 · `band` 160.

Max content width ≈1280px on body sections, 1440px on full-bleed hero bands.
Section padding 96px between bands; 160px where a band needs editorial breathing
room. Card padding: 16px on model cards, 32px on pricing tiers. Code-story
sections are a 2-up split — narrative left, code well right.

Whitespace on cream is generous and editorial. Inside cards the system tightens to
16–32px. Hairline dividers replace shadow on cream.

## Elevation

| Level | Treatment | Use |
|---|---|---|
| 0 flat | no shadow, no border | cream canvas, full-bleed bands |
| 1 outline | 1px `hairline` / `hairline-strong` | cards, tiers, tiles |
| 2 bone inset | surface shift to `surface-bone` inside a canvas band | feature groups, walkthroughs |
| 3 dark inversion | swap to `surface-dark` against cream | code wells, featured tier |
| 4 soft drop | `0 8px 24px rgba(32,32,32,0.08)` | floating photography thumbnails only |

**The dominant elevation language is colour-blocking, not shadow.**

Decorative depth: the **hero atmospheric mesh** is a layered radial —
`primary` core → `hero-glow` mid-stop → `hero-pink` outer wash — reserved for the
hero band. The **code-story dark band** is full-bleed `surface-dark` with a single
hairline dividing narrative from code well.

## Shapes

`none` 0 (hero bands, full-bleed sections, footer) · `xs` 4 (code tabs, tags
inside wells) · `sm` 6 · `md` 10 (cards, tiles, code wells) · `lg` 16 (pricing
tiers, large feature cards) · `full` 9999 (**every** interactive element —
buttons, inputs, badges, avatars, pills).

**There are no sharp corners on Replicate** outside full-bleed bands. The system
reads as friendly precision.

Photography: thumbnails square 1:1 at radius `md`, full-bleed to the card edge;
hero outputs 4:3 or 16:9 at radius `md`; avatars circular.

## Components

- **`button-primary`** — `primary` ground, `on-primary` label, `button-md`,
  12×24 padding, radius `full`, 44px tall. The single most important action.
- **`button-dark`** — `surface-dark` ground, `on-dark` label, radius `full`.
  Equal-weight secondary, or primary on cream when orange would be too loud.
- **`button-outline`** — `surface-card` ground, `ink` label, 1px
  `hairline-strong`, radius `full`.
- **`button-ghost`** / **`button-icon`** — canvas ground / 36×36 circular.
- **`model-card`** — white, radius `md`, 16px padding: square thumbnail, owner +
  name, one-line description in `charcoal`, status pill bottom-left.
- **`pricing-tier`** / **`-featured`** — white / `surface-dark` inversion, radius
  `lg`, 32px padding.
- **`code-block`** — `surface-dark` ground, `on-dark` text, `code-md`, radius
  `md`, 24px padding, with a **`code-tab`** strip on `surface-deep` (radius `xs`,
  `code-sm`, `on-dark-mute`; the active tab goes `on-dark` and takes a 2px bottom
  underline in `primary`).
- **`hero-band`** — full-bleed, the atmospheric mesh, `display-xxl` title.
- **`text-input`** — white, 1px hairline, radius `full`, 12×20 padding, 44px tall.
- **`badge-status`** — `badge-success` ground, radius `full`, 4×10 padding.
- **`badge-tag`** — canvas ground, 1px hairline, radius `full`.
- **`footer`** — `surface-deep`, `on-dark`, radius `none`, 64×32 padding.

## Section rhythm

**cream → orange hero → cream → dark code-story band → cream → black footer.**

## Do

Cream as the default page background; white only on cards, inputs and the hero
illustration backdrop. Orange for exactly three roles — primary CTA, hero band,
inline links. Radius `full` on every interactive element; `md`/`lg` on content
cards. Hero bands open at `display-xxl`/`display-xl`, `lineHeight: 1.0`, negative
tracking. Keep the three type lanes strict. Render code in `code-block` on
`surface-dark` — code is print, not an inline grey box. Photography at radius `md`,
full-bleed crop.

## Don't

Don't replace cream with pure white at page level — the brand temperature comes
from the canvas. Don't introduce a second brand colour; green and focus blue are
functional, not decorative. Don't loosen display `lineHeight` past 1.0. Don't bump
body weight to 500 — change family. Don't apply radius `full` to content cards.
Don't put code in a light grey box. Don't use orange on body text or large
surfaces — it loses its stamp quality immediately. Don't add drop shadows on cream.

## Iteration notes carried from the source

Focus on one component at a time; most interactive elements share radius `full`
and the canvas/white pair, and only role-specific tokens shift. Reference token
names directly rather than paraphrasing. Default body to `body-md`; reach for
`subtitle` only on hero subtitles. **Keep orange scarce — if more than one orange
element appears per viewport, ask whether one should drop to `surface-dark`.**

## Known gaps in the supplied system

Pressed/active states documented only for `button-primary`. Logged-in playground,
dashboard, billing and API-key surfaces are out of scope. The hero illustration
("the tinkerer at the workbench") is bespoke artwork, not a system component.
