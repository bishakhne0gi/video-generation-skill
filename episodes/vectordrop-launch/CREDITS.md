# VectorDrop — launch film · provenance

**1:48.8 · 1920×1080 · 30fps · h264 High yuv420p/bt709 · AAC 48kHz stereo**

## Where the product footage came from

Everything on screen is the real product. The conversion was run **live on
production** (vectordrop.co.in) on 2026-08-20 against a clean account: the demo
image was uploaded through the real dropzone, the real pipeline converted it,
and the result was opened, edited, saved as v2 and exported as SVG. That session
is what the film depicts, beat for beat.

The UI is **rebuilt as live DOM** rather than pasted in as screenshots, for two
reasons: beat 07 pushes to 4000% and a bitmap would turn to mush exactly where
the script claims it does not, and the UI has to animate — paths landing, a
panel filling, a slider re-thresholding. Every string, number, colour and
control is transcribed from the running app.

## Where the artwork came from

`assets/app/rocket.svg` was produced by running the product's **own** pipeline
offline — `lib/conversion/{quantize,maskTrace,assembleSvg}` from the VectorDrop
repo, at the app's default `colourCount` of 32 — over the supplied demo image.
It returns **31 `<path>` elements: one white ground plus 30 traced colour
clusters**, which is exactly what the live editor reported (`31 paths`). Trace
time 973 ms locally; the live end-to-end run measured ~9 s.

The traced stack is monotonic dark→light, asserted at build time
(`MONOTONIC_DARK_TO_LIGHT`) rather than taken on trust, because line 05 says so
out loud.

## Claims, and what backs each one

| claim | source |
|---|---|
| 20 kilobyte JPEG, 400 × 400 | the file: 20,059 bytes, 400×400 |
| four stages: normalize, quantize, trace, assemble | `ConversionStep` union in `lib/types.ts` |
| the four on-screen status lines | the app's own toast strings, verbatim |
| nine seconds for this one | measured on the live production run |
| thirty-one paths | the editor's status bar, and the file |
| stacked dark to light | `quantize.ts` sorts clusters by luminance; asserted in `art.mjs` |
| forty times in | `editorStore.ts` clamps zoom to `0.05–40` |
| fill, opacity, shape, anchor point | the real Properties panel + MOVE/BEND/ADD/CUT |
| three ways out | the Color / Grayscale / Black-and-white modes, 0–100 intensity |
| switching versions costs nothing | the panel's own label, "VERSIONS · SWITCHING IS FREE" |
| SVG, PNG 1× and 2× | the real export menu |
| three credits free, no card | `SIGNUP_GRANT_UNITS = 30` in `lib/credits/constants.ts` |
| 20 credits, $3 + tax | `PURCHASE_GRANT_UNITS`, `PACK_PRICE_CENTS` |

**Deliberately not claimed.** Icon generation ships as `Soon` in the editor
toolbar, so the film never mentions it. The SVG is **larger** than the source
JPEG (204 KB vs 20 KB), so the film never claims a size win — it claims scale,
which is the true one.

**One honest divergence.** The live editor showed the selected layer as
`path-17 / #989299`; a local re-run of the same pipeline rounds that shade to
`#979299` at `path-18`. The film reads the label out of the file it actually
renders, so what is on screen matches the SVG on screen.

## Design

VectorDrop's own `docs/DESIGN.md`, not a house look. `#161516` ground, `#0D0D0D`
panels, `#131313` cards, `#1E1E1E` canvas, `#FFFFFF` type. Teal `#14B8A6` is the
single accent; the 135° gradient `#0D9488 → #14B8A6 → #0891B2` is reserved for
the hero headline and the figure 500, exactly as the brand reserves it, and
`#0891B2` never appears as a flat fill. The two ambient blobs are the documented
ones, at the documented alphas.

Type is **Geist** and **Geist Mono** (latin subsets, wOF2 verified) plus the
product's own **AuxMono** for every micro-cap, which is what makes a VectorDrop
screen recognisable at a glance.

Contrast was computed, not estimated: teal clears AA at 6.70–7.81:1 on every
ground in the film. `rgba(255,255,255,0.42)` measured **4.0:1 and failed**, so
the secondary tone was raised to 0.55 (5.4:1); 0.28 white was removed outright.

## Kling

Six plates in total, 600 credits. The first three were **retired** when the film
turned to the brand's brick motif; the three that ship are photographed bricks.

**Shipping (300 credits):** `brick-macro` — glossy teal and blue bricks scattered
under a raking light, shallow DOF, under the product acts. `brick-build` — bricks
stacked into a low wall, under the editing acts. `brick-fall` — rainbow bricks on
a dark ground, under the milestone. All prompted as generic *plastic toy building
bricks*, with logos, branding and embossed lettering hard-negatived, so no
third-party trademark is reproduced. `brick-build` opened on a human hand placing
a brick despite the negative, so it is trimmed past it and boomeranged to 14s —
a plate that runs out and freezes is the same defect as a static plate.

**Retired (300 credits):** three subjectless **texture plates**, `kling-video-v3_0_turbo`, 1080p, 10s,
100 credits each (300 total): teal ink diffusing in black water, dust in a teal
light shaft, and a slow volumetric light sweep. Locked camera, one shared style
clause, hard text negatives. They run under the graphics at **0.055–0.085**
opacity on screen blend — the first composite at 0.15 was visibly a cloud, which
is the tell that a plate has stopped being texture. No Kling footage is used as
a shot; the product is not something Kling can render.

## Audio

**Voice** — Kokoro-82M `am_michael` at speed 1.0, local. The ElevenLabs series
voice was tested first and is still out: 30,040 of 30,050 characters used,
resetting 2026-08-31.

**Score** — *Spinnin'* by **AlexBeroza**, ccMixter, **CC BY 3.0**. Attribution is
required; put it in the video description. Chosen by measurement across 14
candidates: it has the most stable level of the field (RMS σ 0.045, the lowest
measured), a strong pulse, and 4.1% of its energy in the speech band. No
share-alike anywhere in the shortlist, so the film carries no copyleft
obligation.

The bed is **baked**, because the assembler mounts one flat volume per clip:
three notches at 160/330/520 Hz carve out the voice's fundamentals (this
narrator's energy is concentrated at 125 Hz and 396 Hz, measured off the actual
recordings), then a two-level duck — `0.34` open, `0.155` under — drawn from the
real VO windows, then a limiter. Measured: −27 dB under a spoken line, −21 dB on
the silent title card, −23 dB under the end card, fading only after the last
word. Per-beat means sit in a 3.6 dB band.

**Cues** — 66 placements from the offline-synthesised `terminal` set. Every one is
attached to something that moves; the soft transitions are deliberately silent.
Seam kinds sound differently from each other: `swipe` across, `thunk` on an act
break, `whoosh` into the Z push, `sub` on the one arrival. **The rising sweep on
act breaks was cut at the director's request** — an act break still lands on a
thunk, it just no longer announces itself on the way in.

## Motion

96 BPM grid; every cut lands on it. 13 seams: 7 across (the house current is
left), 3 lifts on the act breaks, and exactly 3 reserved vectors — one
zoom-through into the pixels, one **inverse zoom onto 500** (the arrival, spent
once), one lift into the end card. Both halves of every seam are authored inside
the frames; the transition injector is not used, because it holds the outgoing
frame's last frame across the overlap, which is a frozen exit.

## Verification

`hyperframes check` — 0 errors across lint, runtime, layout, motion and WCAG AA
contrast. 26 boundary stills at every cut (−0.10 / +0.05). Pacing **5.8% static**
at this film's own scaled floor (0.434, from the render's mean luma — the default
1.6 is calibrated for a white page), mean motion energy 6.92.

Four defects were caught by looking rather than by the gates:
- the **continuity of the title card**: every element faded up from zero, so the
  cut landed on black. Every gate passed. The mark, wordmark and both headline
  lines now sit at full opacity from frame zero and ride the stage in.
- the **figure 500 rendered at 86px instead of 300** — `counter()` puts its class
  on every value span, and `.hdr` hard-sets a font size that beats the parent's.
- the **live recolour never happened**: GSAP cannot tween an SVG `fill`, so the
  panel read `#14B8A6` while the canvas stayed grey. A stacked teal copy of the
  path is cross-faded to instead.
- the **cold open's spec chips** were swallowed by the plate as it scaled. The
  layout gate only compares text to text, so it saw nothing.
- the **type-on stacked vertically**: `white-space: pre` made the HTML
  indentation between character spans real, so every glyph took its own line.
- the **figure 500 painted transparent** after the gradient moved to the
  wrapper — `background-clip:text` does not carry to the counter's stacked value
  spans, which have no background of their own. Caught by the contrast gate.

**Not done: nobody has watched this with sound on.** Chrome in this environment
will not decode local media — `readyState 0`, `duration null`, no error code —
and it failed identically for a range-served master, a `data:` URI, and a 388 KB
Constrained Baseline 640×360 proxy, so it is an environment restriction rather
than anything about the file. Stills, measured pacing and measured levels cover
collisions, blank entries and the mix. They do not cover whether the film is
boring, which is the failure only a real viewing catches. **That pass is owed.**


## Revision — director's pass

- **Risers removed.** The rising sweep under every act break is gone; the
  landing thunk stays.
- **The milestone re-cut.** The figure is centred on the optical centre with the
  burst originating inside it, the beat's tail grew from 2.6s to 4.1s so the
  confetti has room to fall, and the gradient now shifts across the glyphs
  (two stacked gradient copies cross-faded — `backgroundPosition` is not
  animatable in this runtime). 150 pieces, larger, with varied burst and fall
  times and sideways drift, on `power3.out` out and `sine.in` down.
- **Text cut hard.** The cold open is one object, a typed filename and three
  chips. The raster beat lost its three-line paragraph for a single typed mono
  line. The destinations beat lost its paragraph and three descriptions. The
  pricing beat went from four rows to two.
- **Type-on added** (`typeLine` / `typeRun`): characters revealed by
  zero-duration sets with a caret whose x is arithmetic, because the line is set
  in Geist Mono. Seek-safe, and nothing reflows as it fills.


## Revision — second director's pass

**Gradient headers.** Every section headline now carries the brand gradient; body
copy, chips and figures stay solid. The rule holds because the gradient is only
ever on a headline.

**The pipeline beat** stopped being four chips in a row. The stages now sit on a
rail with a pulse travelling it and a node lighting at each stop, and the preview
is **wiped** stage to stage rather than cross-faded — a bright bar sweeps top-down
and the next state is revealed under it, including the real potrace outlines at
the TRACE stage. The wipe is built from two counter-moving y-translations (an
outer clip window and an inner counter-translate), because this runtime animates
neither `height` nor `stroke-dashoffset` and ships no DrawSVG plugin. The elapsed
clock moved to the empty lower-left at 176px, as a supergraphic.

**The versions beat** gained a 430px `FREE` bled off the frame and drifting behind
the cards at 16% — oversized type used as a graphic element rather than as
something to read, which is what was carrying nothing before.

**The destinations beat** carries the real Figma, Illustrator and React marks,
drawn as paths so nothing 404s and everything stays crisp. The React atom spins,
which is the one motion that mark owns.

**The paths beat** moved its counter out of the canvas and into the PROPERTIES
panel, which had been empty for the whole beat. The panel now also shows each
cluster's real fill and hex as it lands, and states the stacking order.

**The milestone**, again:
- **The figure was off-centre**, and this was a bug in `counter()` — the box was
  sized by its *first* value, so a one-character `0` held the width and `430`
  overflowed to the right of it. The box is now sized by the widest value, with
  `tabular-nums` so longest-string actually means widest-rendered. This affected
  every counter in the film.
- **A visible dot sat at the origin** before the burst: `fromTo` applies its
  from-vars at frame zero by default, so all the confetti was stacked at the
  centre, visible, from the first frame. `immediateRender: false`.
- **The two gradient copies were offset** from each other, doubling the glyphs.
  Both now share the counter's centred box.
- Confetti is **rainbow** now, 210 pieces, thrown harder, and it fires out of a
  **party popper**: a white flash, an expanding ring, and 26 streaks thrown
  radially on the frame the number lands, with a thunk under the success cue.


## Revision — the LEGO pass

The product's own design system carries a brick motif (`docs/DESIGN.md`, "LEGO
hero": base `#1a1c22`, layered radial-gradient studs on a 30px grid, fading into
`--bg-primary`). The film now wears it, and it earns its place rather than being
decoration: **a traced vector is a stack of flat colour pieces** — 31 of them for
this image, laid darkest to lightest — which is exactly what the film already
claims out loud.

- **The stud texture is transcribed, not approximated** — the three radial
  gradients and the vignette are lifted verbatim from `app/globals.css`, at the
  same 30px pitch, and drift a fraction of a brick across each beat.
- **`LegoStud` is ported 1:1** from `components/shared/LegoStud.tsx` — the plate,
  its four edge shades, and the eight-layer raised stud.
- **Every layer swatch in the film is now a brick** in that cluster's real traced
  fill: the layers list, the CURRENT FILL readout, the pipeline rail's waypoints
  and the three-mode switch.
- **The paths beat lays out the pieces.** As each of the 31 paths lands, a stud in
  its real colour drops onto a strip along the canvas floor — the picture and the
  stack of pieces it is made of, side by side, in the file's own palette.
- **A third of the confetti is bricks**, tumbling with the rest.
- Because a stud is eight stacked shapes rather than one fill, the lit states are
  a second stacked stud cross-faded to, not a `backgroundColor` tween.


**Plate levels, final.** The brick plates ship at 0.042-0.062 (0.095 on the
milestone) and the studded CSS plate at 0.22-0.24. An earlier cut ran them at
roughly double that and the bricks were legible as bricks, which is the tell that
a plate has stopped being texture.
