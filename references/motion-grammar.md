# Motion grammar — the API and the rules

## Timing model

```
scene seconds  = VO duration (vo-durations.json) + 0.35s breath
scene overlap  = the length of the incoming beat's own transition (9–26 frames)
VO starts 5 frames into its scene, so the cut lands before the voice
```

`sec(n)` in `Episode.tsx` does the first line. `totalFrames(BEATS)` feeds
`durationInFrames` in `Root.tsx`, so the composition length is always correct —
never type a duration by hand.

A beat:

```tsx
{ seconds: sec(4), vo: 4, enter: "luma-wipe", node: <Shot id="ep03_tangle" …/> }
```

Each `enter` kind carries its own length (`ENTER_FRAMES` in `transitions.tsx`),
and that length *is* the overlap between the two scenes. A dissolve takes 26
frames because light takes time; a whip takes 9 because a whip that takes longer
is a smear you sit through. Override per beat with `enterDur` when you have a
reason; the default is nearly always right.

## Where motion comes from

**The frame is locked. The content moves.** This is the house rule, and it is
the difference between a film and a slideshow with an effect on it.

The tempting fix for a beat that feels dead is to drift the whole frame. Don't.
A constant push or pan raises the pacing number without giving the viewer
anything: the eye starts tracking the drift instead of the content, and every
beat begins to feel like the same beat, because underneath the graphics they are
all doing the identical thing. Four layers, in the order you should reach for
them:

### 1. Staged arrival — the screen assembles across the beat

Nothing lands at frame 0 as a group. `stagger(i, 4)` from `anim.ts` puts 3–6
frames between siblings, so six cards read as one move instead of one slide.
Then stage the *information*: the diagram at 0, the label when the narration
names it, the number when it's earned. A screen that keeps delivering is a
screen nobody leaves.

### 2. Running systems — something that never finishes

`useLoop(period, offset)` is a continuous 0→1 sawtooth: a packet crawling an
edge, a scan sweeping a diagram, a ring pulsing out of a node, log lines
marching. Unlike a drift it *means* something — the viewer reads the packet as
the packet. This is the single biggest upgrade available to a diagram beat.
`easeLoop()` smooths the wrap so a repeat doesn't snap. `useAlive(i)` is the
sub-perceptual version for elements that have already arrived.

### 3. Depth — `Ambient` and `useParallax`

A Kling texture under the field (`Ambient`, `footage.tsx`) puts real grain,
moving light and depth of field behind flat vectors — the frame stops looking
computed. Keep it under the perceptual floor: if you can point at the video it's
too strong. `useParallax(depth)` separates background plate, mid-ground cards
and foreground labels by magnitude, so a composition has dimension without the
frame moving.

### 4. The camera — two or three beats an episode, no more

`camera: "push"` on a `Beat`, opt-in, off by default. Spend it where the move
*means* something: a push into the turn, a pull out of the close, `rise`/`fall`
over something with real vertical extent, or `pan-left`/`pan-right` to carry
motion through a cut (the outgoing scene drifts left, the incoming enters from
the right at the same velocity — the one place a pan is invisible and does
work). `cameraAmount` tunes the travel; the default 0.055 is ≈7% of frame.

Never stack a camera move on footage — `KlingClip` carries its own Ken Burns
push and the two swim.

### What that looks like in a beat

```tsx
// A "how it works" beat. The frame never moves; four things do.
{
  seconds: sec(6), vo: 6, enter: "luma-wipe",
  node: (
    <AbsoluteFill>
      <Backdrop pal={PAL} />
      <Ambient id="ep03_haze" pal={PAL} opacity={0.14} blur={6} />   {/* 3. depth */}
      <FlowDiagram pal={PAL} stages={STAGES} />                       {/* 1. staggered inside */}
      <Packet t={useLoop(72)} />                                      {/* 2. still running */}
      <Chip pal={PAL} text="p99 · 40ms" x={78} y={26} delay={38} />   {/* 1. arrives late */}
    </AbsoluteFill>
  ),
}
```

No `camera`. The diagram assembles in a stagger, the packet never stops
travelling, the chip lands when the narration reaches the number, and the haze
plate keeps the whole thing sitting on a real surface.

## The space (`src/lib/space.tsx`) — the premium register

The films that read as expensive are usually not cut at all. They are **one
continuous canvas the camera travels**: every diagram, card and image the
episode will show exists in one large world, and getting from idea to idea is a
camera move through it.

Two things fall out of that, and they are the entire reason to build this way:

1. **The viewer never re-orients.** Every arrival has a direction and a
   distance, so the film has geography — beat 7 is *somewhere* relative to beat
   3, and the argument keeps its shape for the whole runtime.
2. **Transitions stop being effects.** A move through real space is something no
   wipe can imitate, and it costs nothing to render.

**This does not contradict the locked-frame rule.** That rule bans a drift laid
on top of a static composition — motion that goes nowhere and means nothing. A
move *through* a space is the opposite: it is the content. Never put a
`Beat.camera` on a beat that is already travelling the world.

| API | What it is |
|---|---|
| `World` + `useView(keys)` | the canvas and the camera. `ViewKey` = `{ at, x, y, zoom }` in absolute seconds; zoom is interpolated in log space so a push reads at constant speed |
| `WorldItem` | anything at a world coordinate |
| `Node` | a card in the world: label above in caps, sub-label in mono, editor chrome around |
| `Wire` | a bezier connector with endpoint dots, drawn on. Horizontal control points, always — vertical handles read as a scribble, not a cable |
| `SelectionBox` | dashed marquee with corner handles: "this is the thing" |
| `ScaleFrom` | the next beat starts exactly where a node was and grows to fill frame — the push-through cut |

Rules that make it work:

- **Author the world before the beats.** The layout *is* the argument; moving a
  node in `SpaceLab` is far cheaper than re-timing six beats around one that
  sits wrong.
- **Every move needs a direction.** Left, then right, then left again reads as
  fidgeting however smooth each move is. Walk the space one way and push in at
  the end.
- **Ease, never linear.** A dolly that starts and stops dead is the loudest tell
  of a computed camera. `useView` does this for you; don't hand-roll it.
- **Push through, don't cross-fade.** When a node's content should become the
  film, `ScaleFrom` with `enter: "cut"`. Read the node's rect off a boundary
  still; within a couple of percent the join is invisible, wrong and it reads as
  a zoom.
- **The wide shot must actually read.** If the establishing view is a diagram
  nobody can parse, the geography does nothing — fewer nodes, bigger.

### Why the reference films look expensive

Beyond the space itself, the things that separate them from competent work:

- **The film breathes in VALUE.** Each act has one dominant field: near-black →
  white → saturated full-bleed → black → accent → white. Nothing looks premium
  when every beat is the same brightness.
- **One accent, recurring at the moments of emphasis.** The same hue on the hot
  element, on the one highlighted word, on the end card. Not a palette — a
  signature.
- **The UI is the design system.** Pills, wires, dashed selections, small-caps
  labels: a language the audience already reads, so you skip explaining the
  diagram and spend the narration on the idea. Identical stroke weights and
  radii everywhere; that consistency is most of what "premium" means.
- **Depth from blur and bloom, not from camera movement.** Soft shadow, a glow
  around the one hot element, focus falling off at the far end of the world.
- **Type is almost absent.** Two- and three-word labels in caps with tight
  tracking, and one typographic statement, landing late.
- **The photoreal material is the OUTPUT of the diagram, not decoration.** A
  Kling still or clip sitting inside a node, then pushed into until it fills the
  frame — with the graph labels still overlaid — is the single strongest move in
  this register.

## The continuity layer (`src/lib/motifs.tsx`)

The fifth layer, and the one that keeps the *intent* alive rather than the
screen. An episode assembled as twelve self-contained beats teaches twelve
things and lands none: each cut resets the viewer, and the argument stops being
visible on screen somewhere around beat five.

The fix is animated graphics that survive the cuts. Render them as siblings of
`Timeline`, not inside a beat, so they run on absolute composition frames:

```tsx
<AbsoluteFill>
  <Timeline beats={buildBeats()} pal={PAL} />
  <MotifTrack pal={PAL} keys={JOURNEY} label="request" />
  <Thread pal={PAL} from={4} to={TOTAL_SECONDS - 6} />
</AbsoluteFill>
```

| Component | What it does |
|---|---|
| `MotifTrack` | one element travelling the whole film, `idle → travelling → blocked → resolved`. Keyframed in ABSOLUTE seconds; the trail samples the same track backwards so it always reads as one object |
| `Thread` | a line that keeps drawing across the episode — progress, answerable at a glance |
| `Lattice` | a node field that never stops breathing. `active` 0.1 = idle system, 0.8 = system at load |
| `Ticker` | a marquee of real log lines / ids — the second thing on a beat with one big idea |

Rules:

- **One motif per episode.** Two protagonists is no protagonist.
- **State changes are the story.** A dot that goes blocked exactly where the
  narration says "and here it stalls" is worth a paragraph of script.
- **It doesn't have to move every beat.** Holding through two beats and then
  moving is more legible than constant transit.
- **Design it in `MotifLab` first** (`npm run studio`). A protagonist that reads
  as a stray dot is worse than none.
- Deterministic and `PACE`-independent — this is the one layer that must look
  identical on a re-render.

## Pacing — measure it, don't argue about it

```bash
node pace.mjs out/episode.mp4        # where is nothing happening?
```

It decodes the render at 64×36 grey and measures how much the picture changes
over a ~1 second window. A beat under the floor for more than 1.2s is a screen
the viewer is staring at with nothing arriving. On the first pass of EP08 that
was **58% of the film**. Aim under ~15%, with a *varied* energy column.

Two rules on top of the four motion layers:

1. **Reveals finish early.** `PACE` in `src/lib/anim.ts` scales every reveal in
   the kit; the house value is `0.55`. A screen should be assembled *before* the
   narration reaches the thing it shows. The viewer reads a finished screen in
   well under a second — they are waiting for you.
2. **The breath is 0.35s, not 0.9s.** `sec(n)`. It only has to cover the
   transition overlap and let the last word land. Spend a bigger one
   deliberately, on the two or three beats that earn a held silence.

**A beat scoring under ~3 needs a second thing to do** — a counter still
counting, a packet still travelling, a chip landing late. Staged information
beats decoration. Failing that, the beat is longer than it has anything to say:
cut it. A flat energy column top to bottom is its own failure — if every beat
has the same amount going on, nothing reads as an arrival.

## `Enter` vocabulary (`src/lib/transitions.tsx`)

Every variant is spring-driven, so the whole film shares one motion signature.
Scrub the **`TransitionGallery`** composition in `npm run studio` before choosing
— it plays all 36 back to back. This table names them; the gallery shows them.

They are sorted into three registers, and the registers are the whole point.
**Classy is almost entirely restraint**: a transition the viewer notices is a
transition that interrupted them.

| Register | Export | Budget per episode |
|---|---|---|
| **House** — quiet, editorial, unhurried | `HOUSE_KINDS` (20) | build the body of the film from 4–5 of these |
| **Accent** — a cut allowed to be an event | `ACCENT_KINDS` (12) | 2, maybe 3. A fourth costs you the first three |
| **Loud** — effects in a transition's clothes | `LOUD_KINDS` (4) | only when the CONTENT is what they depict |

Never the same kind twice in a row. Never more than 5–6 distinct kinds total.

### House — clip-path, transform and light. Your default register.

| kind | Frames | Reads as | Use when |
|---|---|---|---|
| `cut` | 0 | hard cut | first beat; a continuity cut where both scenes share element positions |
| `fade` | 20 | neutral | either side of a morph bridge |
| `dissolve` | 26 | film dissolve, with the mid-point dip | time passing; the reflective beat |
| `luma-wipe` | 26 | ink bleeding across the frame | into a diagram; the softest wipe available |
| `halation` | 22 | highlights swelling before the image resolves | into a beauty shot or hero plate |
| `defocus` | 20 | rack focus | changing what matters in the same place — no pan, unlike `whip` |
| `clock` | 20 | a sweep completing | timing, cycles, "meanwhile" |
| `pull` | 20 | stepping back | the closing beat |
| `mask-through` | 20 | the subject carries the cut | a shape travels across the boundary |
| `iris` | 18 | opening the subject | entering an explanation |
| `circle-out` | 18 | a point expands | zooming into a detail |
| `split` | 18 | reveal from the middle | chapter slates |
| `barn-door` | 18 | opening outward | a reveal that shouldn't feel vertical |
| `zoom` | 18 | arriving | the payoff |
| `wipe`, `wipe-down` | 16 | mechanical, editorial | lists, terminal beats |
| `push-up`, `push-left`, `push-right` | 16 | physical continuation | when the outgoing scene was already moving that way |
| `blinds` | 16 | technical scan | data / system beats |

### Accent — spend two or three, on the beats that carry the episode.

| kind | Frames | Reads as | Use when |
|---|---|---|---|
| `film-burn` | 24 | a reel change | the biggest structural turn; once, at most |
| `grain-dissolve` | 24 | the image eroding | entropy, decay, "this doesn't scale" |
| `light-leak` | 22 | warmth, memory, analogue | into archival footage or a "how we got here" beat |
| `dip-white` | 18 | a clean break | act break, chapter boundary |
| `dip-black` | 18 | a hard stop | before the honest-limitation beat; the end |
| `displace` | 18 | reality warping | the surreal beat; adjacent to a Kling morph bridge |
| `streak` | 16 | anamorphic flare | the beat that should feel expensive |
| `push3d` | 16 | a card being turned | showing a new surface (UI, page, plate) |
| `cross-zoom` | 14 | punching through | the hardest turn in the episode |
| `flip` | 14 | a card flipping over | before/after, claim/reality |
| `whip` | 9 | motion-blurred pan | change of subject or location |
| `flash` | 8 | impact | title after a cold open |

### Loud — only when the content is the failure they depict.

| kind | Frames | Reads as |
|---|---|---|
| `cube` | 14 | rotating to an adjacent face — parallel alternatives, option A / option B |
| `speed-ramp` | 10 | arriving fast and settling |
| `glitch` | 8 | something is wrong |
| `chroma-split` | 12 | signal breaking up — data corruption, a failure mode |

**Both halves of the cut.** `Enter` only reaches the incoming scene.
`dissolve`, `dip-white`, `dip-black`, `cross-zoom`, `defocus`, `speed-ramp`,
`light-leak`, `film-burn` and `halation` also animate the OUTGOING scene through
`Exit`, which `Timeline` drives from the next beat's kind — you don't wire it,
but it's why those nine feel like one gesture and the rest feel like an arrival.

**Carry the motion through the cut.** If the outgoing scene drifts left, the
incoming one enters from the right at the same velocity. That single habit is
most of the difference between "fine" and "seamless".

## Graphics vocabulary (`src/lib/kit.tsx`)

| Component | Beat it serves |
|---|---|
| `Backdrop` / `Particles` | base plate for every graphics scene |
| `TitleCard` | the title, one italic serif accent word |
| `ChapterCard` | numbered slate, resets attention mid-episode |
| `Statement` | one idea, full frame — the beat that lets narration land |
| `CodeWindow` | real code, line-by-line reveal, one `highlight` line dims the rest |
| `TerminalRun` | command types itself, then output streams — the credibility beat |
| `FlowDiagram` | 2–5 stages with packets travelling the edges — "how it works" |
| `StackDiagram` | layers, built bottom-up, one `focus` layer |
| `Compare` | before/after bars with counting numbers — the payoff |
| `StatRow` | 2–4 big numbers |
| `Checklist` | auto-ticking steps / requirements |
| `QuoteCard` | a spec line, a docs sentence, a tweet |
| `EndCard` | takeaway + CTA + next episode |
| `Head`, `Eyebrow`, `TopEyebrow` | the type primitives everything else uses |

## Footage vocabulary (`src/lib/footage.tsx`)

Two jobs, and they are different. **As a shot**: the footage is what you're
looking at. **As a design element**: the footage is what the graphics are
printed on, and you should never quite notice it.

| Component | Use |
|---|---|
| `KlingClip` | full-bleed shot: grade + grain + slow push. `startAt`, `speed`, `grade`, `push`, `panX/Y` |
| `KlingStill` | a generated image as a plate, same grade language |
| `Ambient` | **a Kling texture running UNDER a graphics beat**, blended into the field. Depth and real moving light behind flat vectors — the house alternative to a camera move. `opacity` 0.10–0.22 dark, 0.05–0.12 light |
| `FootageShape` | footage cropped into a piece of the layout — circle, pill, arch, panel. The shot becomes a design element instead of a window cut into one |
| `FootagePlate` | footage inside a floating card — mixes a shot INTO a graphics scene |
| `LowerThird` | documentary label + rule; anchors a shot without covering it |
| `Chip` | floating callout with a real number; **2–3 per shot, maximum** |
| `OverText` | one line burned over footage — the cold open and the quote beat |
| `Letterbox` | cinema bars; footage beats only, never graphics beats |
| `SeriesMark` | persistent playlist mark, bottom-right |
| `shotSeconds(id)` / `hasShot(id)` | real clip length from the manifest; never guess |

`Grade` is applied by `KlingClip`, `FootageShape` and `Ambient` automatically —
that's what makes shots from different prompts feel like one series.
`grade: 0.35` when the footage is already on-palette, `0.7` when it fights the
episode.

## Motion primitives (`src/lib/anim.ts`)

`useAppear(delay, damping)` · `stagger(i, per, base)` · `useLoop(period, offset)`
· `easeLoop(t)` · `useAlive(i, amp)` · `useParallax(depth, amp)` · `useK()`
(everything is `n * k`) · `usePortrait()` · `lerp` · `clamp01` ·
`counter(value, a)` · `useTyped(text)` · `useKenBurns(dur, to)` ·
`shake(frame, start)` · `rand(i)` / `drift(frame, i)` (deterministic — never
`Math.random`) · `fadeWindow` · `clip` · `splitAccent` · `PACE` / `beat(frames)`.

## Signature moves worth reusing

- **Protagonist motif** — one element (a dot, a packet, a single line of light)
  survives every scene and changes state as the story does. Implemented:
  `MotifTrack` in `motifs.tsx`.
- **Stamp slam** — `shake()` + a spring from 2.2×→1 with −8°→−3° rotation, then
  `flash` out. One per episode, on the turn.
- **Count-up on the payoff** — `counter()` in `Compare` / `StatRow`. Numbers
  that land are worth three sentences of narration.
- **Continuity cut** — two adjacent scenes share element positions and cut with
  `enter: "cut"`. The audience reads it as one continuous move.
- **Type-on for anything technical** — commands, ids, queries. Never for prose.
- **The texture bed** — one `Ambient` plate, generated in the episode's palette,
  running under every graphics beat of an act. It ties the act together the way
  a colour grade ties footage together, and it's why the vectors don't look flat.

## Non-negotiables

- No `Math.random()` / `Date.now()` anywhere in `src/`.
- No full sentences on screen. 1–4 word labels.
- No naked Kling clip — grade + at least one Remotion element, always.
- No hand-typed scene durations.
- No camera move you can't justify in one sentence. The frame is locked by
  default and that is a feature.
- Never delete a scene the director has seen — version it (`Scene 5 V2`).
