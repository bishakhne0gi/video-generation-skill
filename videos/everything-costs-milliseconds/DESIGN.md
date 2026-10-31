# EP 26 — the INSTRUMENT PANEL register

Skeuomorphic. The film is a cabinet of vintage measuring equipment; every
performance domain is shown on the physical instrument that actually matches it.
Built on the director's supplied green palette, EP 26 only. Series continuity
lives in the CONSTRUCTION (station strip, act slates, continuity chip, cue set),
never in the colour.

## Tokens — measured with WCAG, not estimated

| Token | Hex | on `--void` | Job |
|---|---|---|---|
| `--void` | `#091413` | — | the cabinet. The ground, always |
| `--forest` | `#285A48` | **2.36** | MATERIAL ONLY — bezels, leather, felt, panel bodies. Never a word |
| `--emerald` | `#408A71` | **4.54** | lit edges, 2px rules, display type ≥30px only |
| `--emerald-lit` | `#6FD0AA` | **10.06** | every small technical word — mono, chips, labels |
| `--mint` | `#B0E4CC` | **13.22** | body and display type. Every word in the film |
| `--brass` | `#E8A13C` | **8.56** | RESERVED: over-budget values only. One per frame, max |
| `--ink` | `#091413` | 13.22 on mint | type on a mint chip |

Three rules that fell out of computing the contrast rather than eyeballing it:

1. **`--forest` can never carry type.** At 2.36:1 it is a surface. This is the
   same lesson as the clay register: the fill colour and the type colour are
   different values.
2. **`--emerald` fails at small sizes.** 4.54:1 clears AA for normal text by
   0.04. Anything under 30px takes `--emerald-lit` instead. Two tokens, not one
   token at two opacities — brightening with alpha does not work.
3. **Never `#000` and never `#fff`.** The floor is `--void`; the light is
   `--mint`. Pure black on enamel kills the material.

## The material recipe

Every instrument is **bezel → face → glass**, in that order.

- **Bezel** — `brass.jpg` clipped to the ring, plus two inset shadows (light
  upper-left, shade lower-right) and one drop shadow for mass.
- **Face** — dark enamel: a radial gradient from `--forest` at 22% toward
  `--void` at the rim, with the plate texture at 0.18.
- **Glass** — `glass.jpg` at `mix-blend-mode: screen`, 0.22, plus ONE static
  specular streak at 18°.

**All lighting is static.** `box-shadow` is not animatable in HyperFrames, so an
instrument is *rotated, moved and scaled* — never re-lit. Same constraint the
clay register hit, same answer.

## The signature move: the needle

Every number in this film arrives on a needle. Nothing fades in. `rotation` IS
animatable, which is exactly why the register works here.

Needle law: swing on `power3.out` to ~4% past the target, settle back over
0.42s with a damped micro-bounce (`elastic.out(1, 0.62)`). A needle that eases
smoothly to rest has no mass and reads as a CSS transition.

**Brass appears on a needle only when the value is over budget.** That is the
whole warm-accent budget: one per frame, and the frame has to have earned it.

## Type

| Face | Weight / width | Job |
|---|---|---|
| Archivo (variable) | 800, `wdth 125`, `-0.04em` | display — station headers, act slates |
| Archivo (variable) | 400–500, `wdth 100` | body, lead lines |
| JetBrains Mono | 400 / 700 | every figure, identifier, path, header — and all gauge faces |
| Instrument Serif italic | 400 | exactly ONE word on the title card |

`font-variant-numeric: tabular-nums` on every figure — a gauge whose numerals
change width is not an instrument.

## The value journey — one field per act

| Act | Stations | Plate | Reads as |
|---|---|---|---|
| 1 · THE MEASURE | dist, lcp, cls, inp | `lamplit.jpg` | a lamp raking across the panel |
| 2 · THE DELIVERY | path, fonts, images, bundle | `interior.jpg` | inside the cabinet — **the floor of the film** |
| 3 · THE MACHINE | render, hydrate, thread, paint | `inspection.jpg` | cold inspection light — the brightest act |
| 4 · THE HOLD | cache, third, field | `lamplit.jpg` | back to lamplight, closing the loop |

Title and end card sit on `cabinet.jpg`. A dark act is a **dimmer** field, never
no field — the plate runs under every station at reduced opacity.

## The continuity chip — `nav 8842`

A small brass-ringed gauge pinned bottom-left, reading **time to interactive for
one real navigation**, carried across all fifteen stations. It climbs through
Acts 1–2 as the film names the costs, and falls through Acts 3–4 as it names the
fixes. States are HELD, never interpolated. The needle moves; the id never does.

## Seams

`transition_in: cut` everywhere; both halves authored inside the frames. House
current is LEFT.

- **ACROSS** (ordinary stations) — outgoing travels left over its last 0.34s on
  `power4.in`; incoming enters from the right over 0.43s on `power4.out`, entry
  travel ≈127% of exit travel.
- **LIFT** (the three act breaks only) — outgoing exits UP, incoming rises from
  below, both scaling through 0.84 at the midpoint on a softer curve than the
  travel. Sounded `riser` + `thunk`, where an across gets a `whoosh`.
- **Z-back is reserved** for the thesis landing on `field` → `end`. Spent once.
