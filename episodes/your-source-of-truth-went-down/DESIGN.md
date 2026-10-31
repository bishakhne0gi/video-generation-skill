# The Workshop — EP 25 design system

Maximalist **claymorphism + glassmorphism**. They do not compete, because they
are given different jobs:

> **Clay is the furniture. Glass is the type surface.**

Extruded pastel clay objects carry the colour, the volume and the diagram
semantics. Frosted glass panels float above them and hold **every word in the
film**. Nothing is set directly on a clay object except a short dark label.

This register replaces EP 24's hand-painted Ghibli system outright.

## Ground

One ground, all nine frames: `--void`, a deep indigo-plum. The film breathes in
value by how much clay is lit and how close the camera is, not by changing the
canvas — a maximalist frame is already carrying five hues and cannot also carry
a shifting field.

## Tokens

```
--void        #16102B   the canvas, all frames
--void-2      #241748   the lifted plate (chapter grounds, wells)
--ink         #FFFFFF   display + body on glass and on void
--ink-soft    #C9BEE8   secondary body
--ink-mute    #9E8FC4   labels — ON THE BARE VOID ONLY (see rules)
--clay-coral  #FF7A6B   THE ACCENT — reserved, see below
--clay-amber  #FFC24B
--clay-mint   #5FE0B0
--clay-lilac  #B48BFF
--clay-sky    #6FC7FF
--clay-ink    #16102B   the only ink permitted on a clay fill

--coral-lit   #FFB2A6   coral, FOR TYPE ON GLASS
--lilac-lit   #D2B8FF   lilac, FOR TYPE ON GLASS
```

**The deep clay hues are fills. The lit variants are type.** Measured against
the five worst glass composites, `--coral` reaches only 3.31:1 and `--lilac`
3.28:1 — both hard AA failures at body size. `--amber` (5.30), `--mint` (5.18)
and `--sky` (4.58) pass as they are and have no lit variant.

## Measured contrast (computed, not eyeballed)

Glass is `rgba(22,16,43,0.76)` + `backdrop-filter: blur(30px) saturate(150%)`.
The 0.76 floor is not a style choice — it is what bounds the composite when the
backdrop is at its brightest. Worst case is glass over pure white:

| Pair | Ratio | Verdict |
|---|---|---|
| `--ink` on glass (worst case, over white) | **8.61** | ✓ AA body |
| `--ink-soft` on glass (worst case) | **4.93** | ✓ AA body |
| `--ink-mute` on glass (worst case) | 2.94 | ✗ **banned** |
| `--ink` on glass over `--clay-amber` | 10.51 | ✓ |
| `--ink` on `--void` | 18.37 | ✓ |
| `--ink-soft` on `--void` | 10.51 | ✓ |
| `--ink-mute` on `--void` | 6.28 | ✓ AA body |
| `--clay-ink` on coral / amber / mint / lilac / sky | 7.22 / 11.43 / 11.18 / 7.07 / 9.88 | ✓ all AA body |
| `--ink` on any clay fill | 1.61–2.60 | ✗ **banned** |
| `--clay-coral` on `--void` | 7.22 | ✓ |
| `--clay-coral` on glass (worst of five composites) | 3.31 | ✗ **use `--coral-lit`** |
| `--clay-lilac` on glass (worst of five) | 3.28 | ✗ **use `--lilac-lit`** |
| `--coral-lit` on glass (worst of five) | **4.93** | ✓ AA body |
| `--lilac-lit` on glass (worst of five) | **4.88** | ✓ AA body |
| `--amber` / `--mint` / `--sky` on glass (worst of five) | 5.30 / 5.18 / 4.58 | ✓ |

## The three rules that fall out of that table

1. **Glass never goes lighter than 0.76.** Below it the composite is unbounded,
   because backdrop-filter samples whatever clay happens to be behind — which
   moves. 0.76 makes the worst case a known number.
2. **`--ink-mute` is for the bare void only.** It fails on glass. Use
   `--ink-soft` inside a panel.
3. **Clay fills take `--clay-ink`, never white.** White on pastel clay measures
   1.6–2.6:1. Every clay object's label is dark.
4. **Coral and lilac never appear as type on glass — only their lit variants.**
   The fill and the type are different colours in this system, and that is the
   price of running a saturated palette against a translucent surface.

## The accent

`--clay-coral` is the film's one reserved hue. It marks **the state of
`origin/pr-118`** and nothing else — never a border, never a heading, never a
decorative fill. The other four clays are structural: they identify *which node*
a shape is, and they keep their assignment for the whole film.

| Clay | Means |
|---|---|
| amber | GitHub |
| lilac | Cursor / Origin |
| sky | the network between them |
| mint | resolved / healthy state |
| **coral** | **`pr-118`, and the failure state** |

## Clay recipe

A clay object is a big-radius solid fill with **two inset shadows and one drop
shadow**, all static — `box-shadow` is not animatable in HyperFrames, so a clay
object is moved and scaled, never re-lit.

```css
.clay {
  border-radius: 44px;                 /* never below 28px */
  background: var(--clay-lilac);
  box-shadow:
    inset  10px  12px 22px rgba(255,255,255,0.55),   /* light, top-left */
    inset -12px -14px 26px rgba(0,0,0,0.22),         /* shade, bottom-right */
    0 26px 60px rgba(0,0,0,0.42);                    /* the object's own weight */
}
```

The two insets are the whole illusion; the drop shadow is what separates clay
from a flat rounded rectangle. Small clay chips scale the radius and the shadows
down together — a 28px chip with a 60px drop shadow reads as a sticker.

## Glass recipe

```css
.glass {
  background: rgba(22,16,43,0.76);
  backdrop-filter: blur(30px) saturate(150%);
  border: 1px solid rgba(255,255,255,0.22);
  border-radius: 28px;
  box-shadow: 0 20px 54px rgba(0,0,0,0.38);
}
```

The 1px top-lit border is what makes it read as a pane rather than a dim box.
**No coloured edges** — house rule, and doubly true here: a coloured border on a
glass panel is the single loudest "generated" signal in this register.

## Type

| Role | Face | Setting |
|---|---|---|
| Display | **Bricolage Grotesque 800** | `-0.035em`, 96–184px |
| Sub-display | Bricolage Grotesque 700 | `-0.02em` |
| Body | **Plus Jakarta Sans** (variable, 500/700/800) | `-0.005em`, 30–44px |
| Technical | **JetBrains Mono** 400/700 | ids, paths, UTC times, percentages |

Every figure is `font-variant-numeric: tabular-nums`. Bricolage is chosen for
its slightly irregular, over-inked forms — a neutral grotesque under this much
colour reads as a corporate slide.

## Motion within the register

The frame is locked. What moves:

- **Clay settles.** Clay objects arrive with a small overshoot (`back.out(1.4)`,
  ≤1.06 scale). They have visible mass, so they never snap.
- **Glass slides.** Panels translate and fade; they never scale, because a
  scaling frosted panel reveals that the blur is not attached to it.
- **The parallax is the depth cue.** Clay sits on a slower plane than glass —
  a shared camera move offsets them at roughly 0.6 : 1.0, which is what sells
  two materials in one space.
- **No idle wobble.** Maximalism is already busy; a breathing blob makes it
  noise.

## Deviations from the `broadside` preset

1. Ground is a single dark canvas, not per-act field brightness.
2. Five structural hues instead of one accent + neutrals (the accent rule is
   preserved by scoping it to the continuity object).
3. Display face is Bricolage Grotesque, not Poppins.
4. Panels are translucent, which the preset does not model at all.
5. Type is never set on the colour — always on glass or on void.
