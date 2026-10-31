---
version: alpha
name: Replicate — Frame (video / frame layer)
description: >
  Video-first companion to the supplied Replicate DESIGN.md. The unit is the frame (1920×1080).
  Atoms are identical and sacred — the warm cream canvas (never white), the single hot orange used
  as a stamp and never as decoration, the three-family type stack (Bricolage Grotesque display /
  Inter body / JetBrains Mono code), fully-rounded interactives against 10–16px content cards,
  dark code wells sitting inside cream as printed pull-quotes, and colour-blocking instead of
  shadow. Composition and scale are rewritten for the frame; the type ramp is lifted to clear the
  video legibility floor while keeping the system's proportions and tightness.
unit: the frame — 1920×1080 primary
principle: atoms are sacred · composition is free · numbers come from the script
derived_from: broadside preset (structure) remixed onto DESIGN.md (atoms)

colors:
  # — surface —
  canvas: "#f9f7f3"
  surface-bone: "#f3f0e8"
  surface-card: "#ffffff"
  surface-dark: "#202020"
  surface-deep: "#000000"
  hairline: "rgba(32,32,32,0.12)"
  hairline-strong: "#202020"
  divider-dark: "rgba(252,252,252,0.14)"
  # — brand —
  primary: "#ea2804"
  primary-deep: "#c01f00"
  hero-glow: "#ff6a3d"
  hero-pink: "#f4a8a0"
  on-primary: "#ffffff"
  # — text on light —
  ink: "#202020"
  body: "#3a3a3a"
  charcoal: "#575757"
  mute: "#646464"
  # — text on dark —
  on-dark: "#fcfcfc"
  on-dark-mute: "rgba(252,252,252,0.78)"
  # — the on-dark orange (see § Colors: the two oranges) —
  primary-on-dark: "#ff6a3d"
  # — semantic —
  badge-success: "#2b9a66"

typography:
  # — chrome ramp (JetBrains Mono, uppercase, tracked) —
  label:      { fontFamily: "JetBrains Mono", cqw: 0.85, weight: 500, tracking: "0.14em", upper: true }
  caption:    { fontFamily: "Inter", cqw: 0.85, weight: 400, lineHeight: 1.4 }
  # — code ramp (JetBrains Mono) —
  code-sm:    { fontFamily: "JetBrains Mono", cqw: 0.95, weight: 400, lineHeight: 1.5 }
  code:       { fontFamily: "JetBrains Mono", cqw: 1.15, weight: 400, lineHeight: 1.55 }
  code-lg:    { fontFamily: "JetBrains Mono", cqw: 1.45, weight: 500, lineHeight: 1.5 }
  # — reading ramp (Inter) —
  body-sm:    { fontFamily: "Inter", cqw: 1.25, weight: 400, lineHeight: 1.45 }
  body:       { fontFamily: "Inter", cqw: 1.45, weight: 400, lineHeight: 1.5 }
  subtitle:   { fontFamily: "Inter", cqw: 1.5,  weight: 500, lineHeight: 1.45 }
  button:     { fontFamily: "Inter", cqw: 1.05, weight: 600, lineHeight: 1.0 }
  # — display ramp (Bricolage Grotesque; lineHeight 1.0, negative tracking) —
  heading-md: { fontFamily: "Bricolage Grotesque", cqw: 1.75, weight: 600, lineHeight: 1.3,  tracking: "-0.01em" }
  display-md: { fontFamily: "Bricolage Grotesque", cqw: 2.2,  weight: 600, lineHeight: 1.15, tracking: "-0.015em" }
  display-lg: { fontFamily: "Bricolage Grotesque", cqw: 3.4,  weight: 700, lineHeight: 1.0,  tracking: "-0.02em" }
  display-xl: { fontFamily: "Bricolage Grotesque", cqw: 5.2,  weight: 800, lineHeight: 1.0,  tracking: "-0.025em" }
  display-xxl:{ fontFamily: "Bricolage Grotesque", cqw: 9.0,  weight: 800, lineHeight: 0.9,  tracking: "-0.03em" }
  figure:     { fontFamily: "Bricolage Grotesque", cqw: 7.0,  weight: 800, lineHeight: 1.0,  tracking: "-0.03em", tnum: true }

spacing:
  pad-x: "5.0cqw"
  pad-y: "5.0cqw"
  band: "8.3cqw"      # the 160px editorial band, at frame scale
  section: "5.0cqw"   # the 96px section step
  gap-lg: "2.5cqw"
  gap-md: "1.7cqw"
  gap-sm: "0.85cqw"
  gap-xs: "0.42cqw"

radius:
  none: "0px"
  xs: "4px"
  sm: "6px"
  md: "10px"
  lg: "16px"
  full: "9999px"

components:
  registers:
    paper:  "ground {colors.canvas}, text {colors.ink}, accent {colors.primary} — THE DEFAULT"
    bone:   "ground {colors.surface-bone}, text {colors.ink} — inset groups inside a paper frame"
    fire:   "ground {colors.primary} + the atmospheric mesh, display {colors.on-primary} — declaration only"
    dark:   "ground {colors.surface-dark}, text {colors.on-dark}, accent {colors.primary-on-dark} — the code story"
    deep:   "ground {colors.surface-deep}, text {colors.on-dark} — the sign-off"
    description: "One register per frame. The film's rhythm is paper → fire → paper → dark → paper → deep."
  hero-mesh:
    technique: "layered radial-gradient: {colors.primary} core → {colors.hero-glow} mid → {colors.hero-pink} outer wash"
    description: "The fire register's ground. Reserved for the title band. Never under a diagram."
  code-block:
    backgroundColor: "{colors.surface-dark}"
    borderRadius: "{radius.md}"
    padding: "1.7cqw 2.1cqw"
    typography: "{typography.code}"
    chrome: "a {colors.surface-deep} tab strip on top, tabs at {radius.xs} / {typography.code-sm} / {colors.on-dark-mute}; the active tab goes {colors.on-dark} with a 2px bottom rule in {colors.primary-on-dark}"
    description: "Code is print, not a grey box. Dark well inside cream, as a pull-quote. NEVER dimmed by opacity — dim its contents."
  pill:
    borderRadius: "{radius.full}"
    padding: "0.42cqw 1.05cqw"
    typography: "{typography.label}"
    variants: "outline (1px {colors.hairline} on {colors.surface-card}) · dark ({colors.surface-dark} + {colors.on-dark}) · fire ({colors.primary} + {colors.on-primary}) · success ({colors.badge-success} + white)"
    description: "The system's workhorse chrome. Every chip, badge, tag and status is a pill."
  status-chip:
    borderRadius: "{radius.full}"
    typography: "{typography.code-lg}"
    description: "The episode's continuity object — the HTTP status. A mono numeral in a pill, pinned. Only its state changes; the pill never moves."
  card:
    backgroundColor: "{colors.surface-card}"
    border: "1px solid {colors.hairline}"
    borderRadius: "{radius.md}"
    padding: "1.7cqw"
    description: "Elevation 1. White on cream. NEVER a coloured edge — colour belongs to the content."
  card-lg:
    backgroundColor: "{colors.surface-card}"
    borderRadius: "{radius.lg}"
    padding: "2.5cqw"
    description: "Elevation 1, the larger step — for a frame's single hero panel."
  photo:
    borderRadius: "{radius.md}"
    treatment: "full-bleed crop, graded warm to sit in the cream; one soft drop 0 8px 24px rgba(32,32,32,0.08) is the ONLY shadow in the system"
    description: "Editorial, not stock. Square 1:1 or 16:9."
  rule:
    backgroundColor: "{colors.hairline}"
    size: "1px"
    description: "Hairlines carry structure. On dark, {colors.divider-dark}."
  accent-rule:
    backgroundColor: "{colors.primary}"
    size: "2px"
    description: "The one place a bare orange bar is allowed: under an active code tab, or drawing in under a display line. Counts as the frame's orange."
---

# Replicate — Frame (video / frame layer)

## Source of truth (READ FIRST)

This frame layer is **the supplied `DESIGN.md` translated to 1920×1080**. The
frontmatter above is normative — use it verbatim. Where it departs from the
`broadside` preset it was remixed from, the departure is deliberate and listed in
§ Deliberate deviations. Two things carry over from the preset because they are
frame-scale craft rather than brand: the **container law** and the **fit-to-measure
display rule**.

## Overview

Replicate at frame scale is a **developer-tools system with the soul of an art
zine**. The load-bearing decision is the ground: a warm cream canvas, never white,
never near-black. Everything follows from it — photography reads as editorial,
code wells read as printed pull-quotes, and the hot orange feels like a stamp
rather than a notification.

The typography is the decoration. Bricolage Grotesque runs up to 9cqw with
`lineHeight` clamped at 0.9–1.0 and negative tracking, so a multi-line headline
packs into a geometric block. Inter carries body and UI. JetBrains Mono carries
every literal — command, status code, route, field name. **Three families, three
jobs, no overlap.**

Curves are intentional: every pill and chip is fully rounded, content cards step to
10–16px, and only full-bleed bands are square. There are no sharp corners here.
The system reads as friendly precision.

**Key characteristics at frame scale:**

- **Warm cream `#f9f7f3` ground by default.** White appears only on cards.
- **One orange, at most once per frame.** If a second wants in, it becomes
  `surface-dark` instead. This is the rule most likely to be broken by accident.
- **Massive tight display** — `display-xxl` 9cqw at `lineHeight` 0.9.
- **Emphasis is a family change, never a weight bump.** Inter 400 → Bricolage.
- **Dark code wells inside cream** — colour-blocked, radius 10px, never dimmed.
- **Colour-blocking is the elevation language.** Hairlines instead of shadows;
  the single soft drop shadow exists only to lift photography.
- **Rhythm across the film:** paper → fire → paper → dark → paper → deep.

## The Frame

**The container law (load-bearing).** Every frame ground sets
`container-type: size`; all frame-relative units are `cqw`/`cqh` against it —
never `vw`, which inflates when the frame is not full-screen. 1px hairlines stay
1px.

- 1920×1080. Type authored in `cqw` (`px ÷ 1920 × 100`).
- **Safe area:** `pad-x`/`pad-y` 5.0cqw (96px — the system's own section step).
- **Fit-to-measure:** size the headline to its length; cap the block at ≤78cqw.
  ≤2 words → `display-xxl`; 3–5 → `display-xl`; 6+ → `display-lg`. One display
  moment per frame.

### Frame Craft Bar

Four eyeball tests gate every frame:

- **Squint** — one display moment dominates at 3–6× everything else.
- **Count the orange** — exactly **one** orange element, or none. Two is a bug.
- **Silence** — declarative frames read 45–55% empty; a code frame or a diagram
  frame is the dense exception.
- **Reference** — aim at an art-zine spread with one hot stamp on it; failure looks
  like a SaaS marketing slide with a coloured border on every box.

## Colors

### The two oranges (a documented, measured deviation)

`primary` `#ea2804` is the brand orange and the only accent on **light** grounds,
where it measures **4.08:1** against the cream canvas. That clears the 3:1
large-text floor and **fails** the 4.5:1 body floor — so orange on cream is for
**display type and 2px rules only, never for a sentence**. Which is what the
supplied system already says in prose ("never use orange on body text"); the
measurement is why. An orange word inside an ink headline is fine; an orange
caption is not.

On the **dark** register it measures **3.74:1** against `#202020`, which clears the
3:1 large-text floor but fails the 4.5:1 body floor. So the dark register uses
`primary-on-dark` `#ff6a3d` — already in the supplied palette as `hero-glow` —
which measures **5.7:1** on `#202020`. Same hue family, same role, legibility only.
This is not a second brand colour and it never appears on a light ground.

### The fire register's text rule (also measured)

On the orange band, **white measures 4.4:1 and ink measures 3.7:1** — both clear
large-text AA, neither clears body AA. Therefore the fire register carries
**display type only**, in `on-primary` white. Any small chrome that must sit on
orange goes inside a **white pill with ink text**, never as bare small type on the
band. This is why the title frame has no body copy on it.

### Everything else

`canvas` is the ground; `surface-bone` a half-step deeper for inset groups;
`surface-card` white **only** on cards and inputs. Text runs
`ink` → `body` → `charcoal` → `mute` as it recedes. On dark, `on-dark` and
`on-dark-mute` (lifted to 78% — 72% measured too thin for on-screen captions).

**No second accent hue.** `badge-success` is functional, not decorative, and
appears once in this film at most.

## Typography

Two ramps and a chrome lane. The **reading ramp** (Inter `body` 1.45cqw) carries
copy; the **display ramp** (Bricolage `display-md` 2.2cqw → `display-xxl` 9cqw)
carries every statement; **JetBrains Mono** carries every literal and all chrome.

- **Legibility floor:** any load-bearing line ≥1.25cqw. Mono `label` at 0.85cqw is
  chrome only — never a load-bearing sentence.
- **Display holds `lineHeight` 0.9–1.0 with negative tracking.** Bricolage tracks
  looser than freigeist, so the two largest steps carry −0.025/−0.03em explicitly.
- **Body stays weight 400.** To emphasise a word inside a sentence, switch it to
  Bricolage 600 — never bold the Inter.
- Code is never set in Inter, even at caption size. A route, a status code, a field
  name and a header are all mono.
- Numerals in the `figure` ramp are tabular (`tnum`) so a count-up does not jitter.

## Depth & Surface

Flat plane; **colour-blocking is the elevation language.**

| Level | Treatment | Use here |
|---|---|---|
| 0 | no shadow, no border | the cream ground, full-bleed bands |
| 1 | 1px `hairline` | cards, panels, pills |
| 2 | shift to `surface-bone` | an inset group inside a paper frame |
| 3 | swap to `surface-dark` | code wells, the dark act |
| 4 | `0 8px 24px rgba(32,32,32,0.08)` | photography only |

**Ceiling:** no gradient ground except the hero mesh on the fire register; no
shadow on anything that is not a photograph; **no coloured container edge, ever** —
a 2–4px accent border on a card is the loudest "this was generated" signal
available, because nothing in the content chose that colour.

## Shapes

Radius is a semantic, not a taste: **`full` on everything interactive or
status-bearing** (pills, chips, badges, buttons, avatars), **`md` 10px on content
cards, code wells and photography**, **`lg` 16px on a frame's single hero panel**,
**`xs` 4px on code tabs**, **`none` only on full-bleed bands and the sign-off**.
Never `full` on a content card — a pill-shaped card breaks the rhythm.

## Frame Treatments

> Recipe: ground · register · composes · focal · chrome · accent · silence · density.

### 1 · Establish (concept · PAPER · left, photo right)

**Ground** canvas. **Composes** mono kicker, `display-xl` in ink, one `body` line
in `body`, one `photo` at radius `md`. **Focal** the headline; the photograph is
the frame's weight, cropped full-bleed in its own rounded box. **Chrome** mono
kicker top-left, status pill pinned. **Accent** one orange word inside the
headline, or the pill — **not both**. **Silence** ~45%. **Density** low.

### 2 · Title (declaration · FIRE · centred)

**Ground** `primary` with the hero mesh. **Composes** `display-xxl` in white, one
white outline pill for the episode mark. **Focal** the title, two lines, packed.
**Chrome** the pill only — no bare small type on orange. **Accent** the band *is*
the accent; nothing else is coloured. **Silence** ~50%. **Density** low.

### 3 · Compare (argument · PAPER · two cards, hairline between)

**Ground** canvas. **Composes** two white `card`s split by a 1px hairline, mono
labels, `display-md` headings, mono detail rows. **Focal** the pair. **Chrome**
labels + status pill. **Accent** one side carries the orange — the side the frame
is arguing for. **Silence** moderate. **Density** standard.

### 4 · Code story (documentation · DARK · full-bleed, split)

**Ground** `surface-dark` (with the shader field beneath it at low strength).
**Composes** narrative copy left in `on-dark`, a `code-block` right, a single
hairline `divider-dark` between them. **Focal** the code. **Chrome** the tab strip;
mono line numbers. **Accent** `primary-on-dark` on the one live token or the added
line. **Silence** low — this is the dense frame. **Density** dense-exception.

### 5 · Figure (data · PAPER · centred)

**Ground** canvas. **Composes** `figure` numeral in ink, `subtitle` label,
`caption` source line in `mute`, a thin progress track. **Focal** the numeral,
counted up on tabular numerals. **Chrome** the source caption — **mandatory; a
figure with no source does not ship**. **Accent** the track's fill. **Silence**
~50%. **Density** low.

### 6 · Sign-off (close · DEEP · centred)

**Ground** `surface-deep`. **Composes** `display-lg` takeaway in `on-dark`, a
hairline, one mono next-episode line in `on-dark-mute`. **Focal** the takeaway.
**Chrome** the series mark. **Accent** one orange word. **Silence** ~55%.
**Density** low.

## Composition Rules

### Do

- Ground every paper frame in `canvas`; reach for white only inside a card.
- Spend the orange **once** per frame, on the thing the narration is naming.
- Set display in Bricolage 700–800, `lineHeight` ≤1.0, negative-tracked,
  fit-to-measure.
- Put every literal — route, status, header, field — in JetBrains Mono.
- Make every chip, badge and status a **fully-rounded pill**.
- Keep code in a dark well at radius `md`, with its tab strip.
- Caption every figure with its source, on the same frame.
- Let hairlines carry structure; leave 45–55% of a declarative frame empty.

### Don't

- Never a white page ground; never a second accent hue; never orange on body copy
  or across a large surface that is not the hero band.
- Never bold Inter for emphasis — change family.
- Never loosen display `lineHeight` past 1.0.
- Never a coloured border on a container; never a shadow on anything but a photo.
- Never `radius.full` on a content card.
- Never dim a dark well with `opacity` over cream — it composites to mid-grey. Dim
  its **contents**.
- Never small type directly on the orange band.

## Numerals & Claims (hard rule)

Never invent a figure. Every numeral on screen traces to `capture/extracted/
visible-text.txt` and carries its source in a `caption` line on the same frame.
Confirmed for this episode: the OWASP Top 10 2025 A01 figures, and RFC 9110 for
the 401/403 semantics. Episode/catalogue numerals are decorative chrome.

## Deliberate deviations from the `broadside` preset

Recorded rather than silently applied:

1. **A paper register exists and is the default.** Broadside forbids a cream ground
   register; Replicate's whole identity is that ground. Broadside's two registers
   become five, ordered as the supplied section rhythm.
2. **On the fire register, text is white, not ink.** Broadside makes ink-on-fire
   absolute; `DESIGN.md` specifies `on-primary` `#ffffff`.
3. **Radius is semantic, not zero.** Broadside is flat-and-square; Replicate is
   fully-rounded interactives against 10–16px cards.
4. **Body is Inter and mono is JetBrains Mono.** The remix had mapped both display
   and body to Bricolage and left mono as IBM Plex — collapsing a deliberate
   three-family stack into two of the wrong ones.
5. **Display is sentence case, not lowercase.** Broadside's lowercase-900 signature
   is its own brand, not this one.
6. **The type ramp is lifted for video.** The supplied px ramp is browser-scale;
   holding 14–16px body at 1920 would sit under the legibility floor. Ratios,
   `lineHeight` and tracking are preserved; absolute sizes are scaled up.
7. **`on-dark-mute` lifted from 72% to 78%**, and the on-dark orange is
   `#ff6a3d` — both measured contrast fixes, § Colors.

## Pre-Render Self-Audit

- **Register** — one per frame; the film's order is paper → fire → paper → dark →
  paper → deep.
- **Orange** — count it. One per frame, or none. Never on body copy, never as a
  container edge.
- **Type** — three families in their lanes; display `lineHeight` ≤1.0 and
  negative-tracked; nothing load-bearing under 1.25cqw; mono for every literal.
- **Radius** — `full` on pills, `md` on cards/wells/photos, `none` only on bands.
- **Depth** — no shadow except on a photograph; no coloured edges.
- **Grey slab** — no dark surface sitting at partial opacity over cream.
- **Contrast** — nothing small on orange; no orange smaller than display on cream;
  on-dark accents use `#ff6a3d`.
- **Claims** — every numeral sourced and captioned on its own frame.
