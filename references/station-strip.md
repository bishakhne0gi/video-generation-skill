# The STATION STRIP — the register EP13–EP17 are built in

This is TRAVELLED (step 7) made concrete and hardened over five episodes, fused
with the marketing surface (step 7b). It is the highest-yield construction in
this kit and it needs **no Kling at all** — EP15 and EP16 shipped on graphics
alone, so an episode in this register costs one TTS run and one music run.
It also carries a client's brand cleanly: EP17 is the same construction rebuilt
on a customer's own dark design system, and the only things that changed were
the palette, the field and the display face.

Read this before writing a new `EpNN.tsx`. Then open the most recent archived
episode (`episodes/<slug>/EpNN.tsx`) and **copy its skeleton rather than
re-deriving it** — everything below is already implemented there.

---

## What it is, in one paragraph

Nine to thirteen **stations** are laid out on one continuous canvas in a
serpentine — four across, down, four back, down — and the camera travels
between them. There are no cuts in the body of the film; there are two kinds of
move, and the layout is the transition vocabulary. Every station is one idea,
built out of real product panels rather than labelled rectangles, on a
background whose brightness belongs to the act. A cold open and a title card sit
before the strip, an end card closes it, and one continuity chip follows a
single named object from the first station to the last.

**Why it works:** the viewer never re-orients. Twelve self-contained screens
teach twelve things and land none of them; a journey through one space keeps the
argument visible, and "how far along are we" is answerable at a glance.

---

## Sizing the episode — do this first

Station count comes out of the runtime, and runtime comes out of the narration.
A recorded line in the house voice runs **6.5–9s**; budget **~8s per beat**
after the 0.35s breath and the 84bpm upward snap.

| Target runtime | Teaching stations | VO lines | Shape |
|---|---|---|---|
| ~60s | 5 | 6 | 3 across, 2 back, 1 act break |
| **~90s** | **8** | **9** | **4 across, 4 back, 2 act breaks** |
| ~130s | 12 | 13 | 4 across, 4 back, 4 across, 3 act breaks |

Then: `runtime ≈ (VO lines × 8) + 5 (title) + 8 (end card)`.

**Two act breaks is the budget at 90 seconds.** A lift that means "new section"
spent three times in a minute and a half stops meaning anything.

---

## The pipeline, in the order that actually works

Deviating from this order costs a re-render or a re-record.

1. **Write `episode.config.json`** — title, `titleAccent`, subtitle, `next`,
   theme, voice block, and the VO lines. Keep the same `voice` id as the rest of
   the playlist; bump `voiceSeed` per episode.
2. **`node tts.mjs --check`** — free. Fix hedges, long sentences, directive
   count before spending anything.
3. **`FORCE=1 node tts.mjs`** — records, and writes measured lengths into
   `vo-durations.json`. **Everything downstream is derived from this file.**
4. **Fix any `⚠ dragging` line NOW, not later** — see the pacing section; a
   dragging line and a static beat are the same defect.
5. **Compute the runtime** from the durations before writing any TSX, so the
   music request and the station count are right the first time.
6. **Generate the score** — `node music.mjs --gen "<brief>" --plan --seconds
   <runtime × 1.2> --bpm 84`, then **verify the tail** (see gotchas).
7. **Write `EpNN.tsx`**, register it in `src/Root.tsx` (two compositions: 1920×1080
   and the 1080×1920 short).
8. **`npx tsc --noEmit`**, then **one still per station** — look at every one
   before rendering 2,500 frames.
9. **Render, then `node stills.mjs`, `node pace.mjs`, per-beat `volumedetect`,
   then WATCH it** (`node review.mjs out/epNN.mp4`).
10. **Archive**: copy `episode.config.json`, `vo-durations.json`, `EpNN.tsx`,
    `CREDITS.md` and `tempo.json` into `episodes/<slug>/`.

---

## The schedule block — copy this verbatim

Scene seconds = VO + 0.35s breath, snapped UP to the grid. Nothing is
hand-guessed, and re-recording one line re-times every cut, camera key and cue
in the file.

```tsx
const BREATH = 0.35;
type BeatDef = { id: string; vo?: number; hold?: number };

const DEFS: BeatDef[] = [
  { id: "open",  vo: 1 },        // the cold open carries a line
  { id: "title", hold: 4.6 },    // ── silent: the bed lifts
  { id: "topic", vo: 2 },
  /* … one row per teaching station … */
  { id: "end",   hold: 7.5 },    // ── silent: the bed lifts again
];

const LEN = DEFS.map((d) => (d.vo ? snapUp(durs[d.vo - 1] + BREATH) : snapUp(d.hold ?? 4)));
const START: number[] = [];
DEFS.reduce((acc, _d, i) => { START[i] = acc; return acc + LEN[i]; }, 0);

const at    = (id: string) => START[DEFS.findIndex((d) => d.id === id)];
const len   = (id: string) => LEN[DEFS.findIndex((d) => d.id === id)];
const endOf = (id: string) => at(id) + len(id);

export const EPNN_SECONDS  = START[START.length - 1] + LEN[LEN.length - 1];
export const EPNN_DURATION = Math.round(EPNN_SECONDS * EPNN_FPS);

/** Windows where a line is actually playing — the score ducks against these. */
const VO_WINDOWS = DEFS.map((d, i) =>
  d.vo ? [START[i], START[i] + durs[d.vo - 1]] : null,
).filter(Boolean) as [number, number][];
```

**The title and the end card exist to carry no line.** That is where the bed
lifts the full 7dB, and it is the only reason a graphics film sounds scored
rather than narrated.

**Never author an absolute second anywhere else in the file.** Every position is
`at(id)`, `len(id)`, `endOf(id)`, or a station-local offset. Anything hardcoded
silently desynchronises the moment a line is re-recorded — which will happen.

---

## The route and the camera

```tsx
const G = 100;                                   // one cell = one frame, in %

const ROUTE: Record<string, [number, number]> = {
  topic: [0, 0], message: [1, 0], filter: [2, 0], buffer: [3, 0],
  visible: [3, 1], dlq: [2, 1], fifo: [1, 1], poll: [0, 1],   // travelling BACK
  end: [0, 2],
};

export const isActBreak = (id: string) => {
  const i = STRIP_IDS.indexOf(id);
  return i > 0 && cellOf(STRIP_IDS[i - 1])[1] !== cellOf(id)[1];
};
```

Two moves, and only two:

| Move | When | Duration | What it does |
|---|---|---|---|
| **ACROSS** | every ordinary station | 0.9s | flat, quick; the next station is already sliding in as the last leaves, so the cut is not a cut |
| **DOWN** | act breaks only | 1.4s | the camera **lifts** — pulls back to `s: 0.84` at the midpoint and settles. Reads as stepping up and over |

The `RIDE` keyframe array is built by walking `STRIP_IDS`, and the lift is the
only place the camera ever changes scale.

**Two things that will break the camera if you get them wrong:**

- **Scale on the OUTER `AbsoluteFill`, translate on the INNER one.** Both on one
  element scales the offset too and the camera drifts off its station.
- **The lift eases differently from the travel.** Matched easings make the
  pull-back look like a side effect; a softer scale curve makes it read as the
  camera rising over the section break.

Sound the two moves differently: `whoosh` on an across, `riser` + `thunk` on a
lift. A move that means "new section" has to sound like one.

---

## The Station wrapper — and the bug that hides in it

```tsx
const LEAD = 1.2;              // seconds a station is mounted before the camera arrives
const bt = (sec: number) => sec + LEAD;   // beat-seconds → station-local seconds
```

Content mounts **1.2s before the camera reaches it**. A station that populates
on arrival reads as a slide loading; one already assembling as you approach
reads as a place you are travelling to. Author every in-station timing as
`F(bt(seconds))` so it stays expressed in beat time.

The background is rendered **outside** the inner `Sequence` and driven by
absolute time, so the bloom field's wave clock is continuous across the whole
film instead of restarting at every station.

> **The `position: relative; z-index: 1` wrapper around the station content is
> LOAD-BEARING.** `ActBg` is an `AbsoluteFill` — a positioned sibling — and CSS
> paints positioned descendants above non-positioned in-flow ones regardless of
> DOM order. Without the wrapper, every element that happens *not* to carry an
> `opacity < 1`, a `transform` or a `translate` paints underneath the background
> and vanishes. It takes out half of a beat and leaves the other half looking
> fine, which is exactly why it survives to a render. It looks like a timing bug
> and it is not.

---

## The value journey

One dominant field brightness per act, painted by each station's own `ActBg`, so
the value change arrives WITH the travel instead of as a cut.

| `bg` | What it is | Use for |
|---|---|---|
| `field` | full-bleed bloom + scrim | title, end card |
| `band` | bloom cropped to the top 52% over canvas, masked out | the mechanism, the sign-off station |
| `canvas` | flat `pal.bg` | the plain teaching stations |
| `soft` | `pal.bgDeep` + `GridPlate` | the cool interlude stations |
| `dark` | `#0A0C18` + a **dialled-down** bloom + dark `GridPlate` | ONE station — the failure beat |

EP15 ran cream → canvas → cool → canvas → saturated. EP16 ran saturated →
canvas → dark → canvas → saturated.

**The dark station has to actually be the darkest thing in the film** or the
journey has no floor. A bloom at `opacity: 0.62` over `#0A0C18` renders as bright
magenta; `opacity: 0.34, size: 112` keeps it as colour in the corners and never
as brightness across the frame.

---

## Wearing a client's design system

The construction is the series; the surface is the episode. EP15/16 ran
`stripe-mesh`, EP17 ran VectorDrop's own dark tokens — same strip, same slates,
same chip, same cue set. Four things to carry across, and they are the ones an
episode quietly drops:

- **Take the tokens literally, from their file.** Ground, panel, card, canvas,
  border alpha, radius, shadow. If their card is DARKER than their page (it
  often is in dark mode), keep it that way — "cards lift off the page" is a
  habit, not a rule.
- **Honour the reserved colours.** VectorDrop's cyan appears *only* inside the
  gradient and its deep teal is demoted to hover in dark mode. Using either as a
  flat fill is the difference between using the palette and using the brand.
  Reserve the gradient for exactly one thing — here, one word of the title.
- **Take their background device, not ours.** The bloom field belongs to
  stripe-mesh. VectorDrop has drifting ambient blobs, so the blobs became the
  field — same job, their language. Rebuild it frame-driven; the CSS keyframe
  version in their app cannot survive a render.
- **A local OS font is loadable.** `@remotion/fonts`' `loadFont` takes a
  `staticFile()` URL, so a face on the machine (e.g. macOS's SF Pro at
  `/System/Library/Fonts/SFNS.ttf`) can be staged into `public/fonts/` and used
  directly. Declare a VARIABLE font across its whole axis (`weight: "100 900"`)
  in one `@font-face` — a single declared weight leaves the renderer
  synthesising faux-bold, which on a display face is visible immediately.
  Smoke-test it on a specimen composition before building a film on it.

## The act slate — EP11's chapter mark, overlaid for free

The strongest "new section" device in the playlist, and the one that makes a
strip film feel like a document with chapters rather than a continuous ride: a
filled accent square with the act number set heavy inside it, the act title
enormous underneath, and the film beneath washed out to near-white.

```tsx
const ACTS = [
  { n: 1, title: "How it works", at: at("topic")   - 1.1, hold: 1.9  },
  { n: 2, title: "How it fails", at: at("visible") - 2.5, hold: 1.95 },
];
```

**It costs no runtime, and that is the only reason it is affordable in a
90-second film.** It is mounted outside the strip and laid over moves the film
already makes. A slate that needs its own beat costs four seconds and one of the
nine stations; a slate over a move that is already happening costs nothing and
makes the move mean something.

Five rules, each of which was a visible defect first:

1. **Take the TAIL of the outgoing beat, clear BEFORE the incoming station
   lands.** The last second of a beat is a hold, so covering it is free. Running
   the slate past the arrival is the version that looks wrong, and specifically:
   the incoming station paints through the wash as a big flat block behind the
   headline — and on the dark station that block eats the headline's contrast
   entirely.
2. **Two of them.** A third spends the device on something that is not a section
   change, and then none of them read as one.
3. **The square lands first, the title follows ~0.9s later.** Both arriving
   together reads as a card fading in. Staggered, the number introduces the
   section and the title names it. Spring the square from `scale(0.86)`.
4. **Mount it LAST**, after the continuity chip and the thread, so the wash
   covers those too. A slate with the chip still burning through it is a slide
   with a sticker on it.
5. **Set the title HEAVY** — `HEAD` at 800, `-0.045em`, in the palette's ink —
   not the thin `display()` register the stations use. The slate is a different
   kind of object from a station header and must not be mistakable for one.

The wash is the palette background at ~0.93 with a small `backdropFilter` blur,
faded in over ~0.34s and out over ~0.5s. Not a flat opaque plate: the film
staying faintly readable underneath is what makes it a slate laid ON the film
rather than a slide the film cut to. Sound it `thunk` on the square, `latch` on
the title.

Original implementation: `episodes/vllm-paged-attention/ep11.tsx` → `Slate`.
Overlaid version: `episodes/sns-sqs-shout-once/Ep16.tsx` → `ActSlate`.

## The continuity chip

One named object, followed the whole way through, mounted **outside** the strip
so no cut can interrupt it.

```tsx
const TRAIL: { at: number; label: string; state: TrailState }[] = [
  { at: at("topic"),           label: "published to the topic",       state: "waiting" },
  { at: at("visible") + 3.2,   label: "invisible for 30s",            state: "live" },
  { at: at("poll") + 4.2,      label: "received, handled, deleted",   state: "done" },
];
```

Four rules, and all four matter:

1. **Pick the protagonist out of the episode, never invent one.** EP15 followed
   `evt_1PxKq2`, an id already printed in two of its own beats. EP16 followed
   `m-8f21c4`, the MessageId shown on the envelope station.
2. **Every state is something the film just said.** That is the difference
   between a continuity device and a dot that happens to persist.
3. **States are HELD, never interpolated.** The chip changes when the argument
   changes and holds through beats that do not move the story on.
4. **Only the state word animates. The id never moves** — the whole point is
   that it is the same object.

Pair it with `<Thread pal from={STRIP_T0} to={endOf(<last teaching station>)} />`.

---

## Station content — the rules that keep it from looking generated

- **`ProductPanel` replaces the labelled rectangle outright.** One piece of true
  specific data, something busy at the edges (a truncated string, a status that
  is currently `—`), and never centre the body — software is left-aligned.
- **One black (`PANEL = "#0B0E14"`) and a 1px white-alpha hairline for every
  surface in the film.** No coloured top-borders, no per-component tint. The
  content tells them apart. A wall of near-identical dark windows over a bright
  field reads as an application; six different coloured edges read as a deck.
- **`Terminal` for anything with code in it**, typed, with `TypeCues` on the same
  `start`/`cps`. Code that is simply present was never typed.
- **One stroke-icon family** — one weight, one radius, one size. A rectangle with
  three stacked bars in it is a QUEUE before anyone reads a word.
- **`BoxTag` on every station** (`01`, `02`, …). That is what turns nine screens
  into a document with sections.
- **Author each diagram in ONE fixed design space** (`Canvas`, 1760 wide, scaled
  as a unit) so a connector's endpoint IS the box's edge.
- **Numbers must be real and sourced.** Put the sources in the config's `_` field.

---

## Pacing — the part that decides whether it holds attention

`node pace.mjs out/epNN.mp4` measures the render. **Target: under ~30% static**
(EP15 shipped at 32%, EP16 at 31%).

**What the metric actually sees:** large-area frame-to-frame change. A row of
11px chips, a 10px-stroke ring draining, a three-digit counter in a small card —
all of these are genuine motion the metric does not register, and more
importantly they are motion **the viewer does not register either at video
scale**. So the metric is blunt but it is not lying.

Three fixes, in order of honesty:

1. **The beat is longer than it has anything to say → shorten the LINE.** A
   `⚠ dragging` warning from `tts.mjs` and a static stretch in `pace.mjs` are
   usually the same defect seen twice. Tightening two lines on EP16 (removing a
   held `…` and a subordinate clause) cut 2s of runtime and took the film from
   38% static to 31% — with no change to the picture at all. **Do this first.**
2. **Give the beat a second thing to do, on one clock.** A curve that peaks and
   resolves at t=0.4 leaves five dead seconds. Model the real behaviour instead:
   a producer spike that passes, a consumer pinned at capacity, and a queue depth
   that *integrates the difference* and drains slowly, keeps moving for the whole
   beat and is more truthful than the sine bump it replaced. A cycle that repeats
   (a message taken, timing out, and taken again) is the same trick.
3. **Enlarge the thing that is already moving.** A hairline arc draining around a
   circle is a legible instrument and an invisible number of pixels; a filled
   sector sweeping through 360° is the same information at a size the eye
   registers.

**Never** fix a static beat with a camera move. It raises the number and gives
the viewer nothing.

### On a DARK film, check the floor before you believe the number

`pace.mjs` measures the **mean absolute luma delta** in raw 0–255 greyscale
against a fixed `FLOOR` of 1.6. That floor is calibrated for the light films
this kit mostly makes, and it is *linear in the picture's luma scale* — so a
dark episode is structurally penalised and will report as frozen while moving
perfectly well.

Measured, on two episodes with the same construction and the same amount of
content:

| | mean luma | mean motion energy | static @ floor 1.6 |
|---|---|---|---|
| EP16 (white ground) | 192.9 | 16.56 | 28.6% |
| EP17 (#161516 ground) | 22.4 | 1.97 | **66.0%** |

The luma ratio is 8.6×; the energy ratio is 8.4×. That is not a coincidence and
it is not a pacing problem — it is the same film measured through a scale that
assumes a white page.

**So scale the floor to the film**, and compare against that:

```bash
FF=node_modules/@ffmpeg-installer/darwin-arm64/ffmpeg
"$FF" -i out/epNN.mp4 -vf "scale=64:36,format=gray" -f rawvideo - 2>/dev/null \
  | python3 -c "import sys;d=sys.stdin.buffer.read();print(round(sum(d)/len(d),1))"
# floor = 1.6 × (thisFilm / 192.9)   → EP17: 1.6 × 22.4/192.9 ≈ 0.19
node pace.mjs out/epNN.mp4 --floor 0.19
```

EP17 at its own floor is **11.8% static** — better than EP15 or EP16, off the
same construction. Diagnose before you operate: a dark film "fixed" against the
default floor gets motion piled onto beats that were already fine.

---

## Gotchas that cost a render or a re-record

| Symptom | Cause | Fix |
|---|---|---|
| `durationInFrames must be an integer, but got NaN` in a **previously shipped** composition | `vo-durations.json` is a single shared file. A new episode with fewer VO lines makes `durs[9]` etc. `undefined` for every older composition registered in `Root.tsx` | Point each archived episode at its own archive: `import durs from "../../episodes/<slug>/vo-durations.json"`. A published episode must keep rebuilding to the film that shipped |
| Music goes digitally silent under the end card | ElevenLabs Music returns **less audio than the composition plan asks for** and pads the file to length with true silence. The container duration looks correct | Request **~20% more than the runtime**, then verify: `ffmpeg -ss <runtime-3> -t 3 -i bed.mp3 -af volumedetect -f null -`. Anything near −90dB is padding |
| A perfectly good bed gets replaced by a thin synth one | `node music.mjs --help` is not a recognised flag, so it falls through to the default engine and **generates** | Use `node music.mjs --list`. Read the header comment for usage |
| React error #310, or a hook count change mid-render | A hook called inside a conditional branch (`if (p > 0.99)`) or inside a `.map` callback | Hoist the hook above the branch; extract map bodies into a subcomponent |
| Half a beat's elements missing, the rest fine | The `ActBg` stacking-context bug above | `position: relative; z-index: 1` wrapper |
| `await R.seek()` / `await R.beat()` hangs the CDP call in `review.mjs` | the promise does not settle under automation | Set `video.currentTime` directly and screenshot |
| Text wrapping inside chips, pills and meta rows | design-space widths sized to the shortest label | `whiteSpace: "nowrap"` plus an explicit width; check it in a still, not in the editor |
| A label disagrees with the animation beside it (`depth 3` over a 7-slot bar) | the label is a constant, the bar is animated | Derive the label from the same value that drives the animation |
| A DARK episode reports 60%+ static and mean energy under 2 | `pace.mjs`'s fixed floor is calibrated for a white page and its energy scales linearly with luma | Scale the floor: `1.6 × meanLuma / 192.9`. See the dark-film section above — do NOT add motion until you have re-measured |
| A dark station renders as flat colour with nothing moving on it | the field was dropped on the darker acts and only kept on the bright ones | A dark act is a DIMMER field, not no field. Run the same field under every station at reduced intensity |
| A panel that should be black renders as a flat mid-grey slab | a dark surface dimmed with `opacity` over a LIGHT field blends toward the page | **Dim the CONTENT, never the surface.** Keep the panel at full `PANEL` black and drop the text/icon colours instead. EP 20 shipped this bug into four separate components before it was named |
| The review video will not load in Chrome — `readyState 0`, `duration null`, no error, even for a freshly created `<video>` | Remotion writes **`yuvj420p` with `bt470bg` primaries and unknown transfer/matrix**. The server is fine; it returns 200/206 with valid `ftypisom` | Re-encode a review copy: `-vf format=yuv420p -color_primaries bt709 -color_trc bt709 -colorspace bt709 -color_range tv -movflags +faststart`. This is a DIFFERENT root cause from EP 19's long-GOP seek cost — check the colour tags first, they cost nothing to read |
| The bed is dead on the title and end card, the two beats it exists to lift on | `open`/`under` were set against ElevenLabs-generated beds; a CC0 recording can be 5–8 dB off that | **Mix levels are a property of the BED, not of the series.** Measure the source (`volumedetect`), then set the levels. EP 20's CC0 piano needed 0.62/0.26; EP 21's CC0 pad is 8 dB hotter and needed the house 0.34/0.15. Confirm per beat after the render |
| A station's payoff appears and is instantly covered by the act slate | the slate deliberately takes the TAIL of the outgoing beat, so anything landing in the last ~3s of that beat is washed out | Derive the slate's start (`at(next) − 2.7`) and keep the outgoing beat's payoff at least ~1.5s clear of it. EP 21's query-cancellation panel landed at 4.6s of a 7.86s beat and got 0.3s on screen |
| A tall panel reads as a large empty black void for the whole approach | the container is mounted at full opacity by `LEAD` while its contents are still waiting on the beat clock | Tie the container to its content: fade the panel in over the lead-in and start the first rows arriving BEFORE the camera lands. An empty box is the "slide loading" failure the lead exists to prevent |
| `vo-durations.json` disagrees with the mp3s on disk | `tts.mjs` writes that file at the END of a run. Any mid-run failure (quota, network) leaves the previous run's numbers in place while the new audio is already recorded | Re-probe straight from the files before deriving any timing: `ffmpeg -i sceneN.mp3` per scene. Everything downstream — cuts, camera keys, cues, `durationInFrames` — is derived from that one file |

---

## Verification ladder — all of it, in this order

```bash
npx tsc --noEmit                                  # before any render
npx remotion still src/index.ts EpNN out/epNN/<station>.png --frame=<sec*30>
                                                  # one per station — LOOK at each
npx remotion render src/index.ts EpNN out/epNN.mp4
node stills.mjs out/epNN.mp4                      # must print an `Audio:` stream
node pace.mjs out/epNN.mp4                        # under ~30% static
node review.mjs out/epNN.mp4                      # then WATCH it, sound on
```

Plus the mix, per beat — a render can carry an audio stream and still have the
bed dead where it should lift:

```bash
FF=node_modules/@ffmpeg-installer/darwin-arm64/ffmpeg
"$FF" -ss <beat start> -t <len> -i out/epNN.mp4 -af volumedetect -f null - 2>&1 | grep mean_volume
```

Expect the VO beats within a couple of dB of each other, and the **end card at
roughly the same level as a VO beat** — that is the bed at `open` against the bed
ducked to `under`. An end card 20dB down means the music ran out.

---

---

## The sound-off cut (EP 21)

Nearly every play in a feed is muted, and this register teaches through narration
plus short labels — which means a muted play of a strip film delivers almost
nothing. The fix is a second cut from the SAME composition behind a `silent`
prop, so both files share every timing and the archive stays one file:

```tsx
const SilentCtx = React.createContext(false);
export const Ep21: React.FC<{ silent?: boolean }> = ({ silent = false }) => (
  <SilentCtx.Provider value={silent}> … </SilentCtx.Provider>
);
```
```tsx
<Composition id="Ep21Silent" component={Ep21} defaultProps={{ silent: true }} … />
```

Three changes, and the order matters:

1. **A LEAD LINE per station** — the beat's one idea in a handful of words, set
   at ~44px directly under the box tag. This is what a scroller reads, and it is
   the part that does the teaching. Write them shorter and blunter than the
   narration; never restate the box tag beside them.
2. **A CAPTION BAND** carrying the actual narration, timed off the same
   `START[i]` / `durs[]` the score ducks against, so a re-record re-times the
   captions too. Put it ABOVE the chip/locator row — the usual subtitle position
   is already occupied by two pinned panels and will collide on every frame.
3. **No audio track at all** — return `null` from the whole `Track`, not a muted
   one. A stream of digital silence still costs bandwidth and still gives the
   viewer a volume control to pointlessly turn up.

**Suppress the station `Note` in silent mode.** The lead line and the caption are
both prose, and the Note is a third block of it landing exactly where the caption
band goes. This was a visible collision on every station in the first render.

This deliberately breaks the house rule that narration never appears on screen as
a sentence. That rule protects a film you WATCH; its reason — that captions make
a video feel like a talking head with the head removed — is answered by the lead
lines carrying the teaching and the captions being a second layer rather than the
only one.

## A field with a DIRECTION (EP 21's `WalField`)

The ribbon bends in place, the bloom sits still, the mesh wanders without going
anywhere. All three are correct as weather and none of them is a CURRENT — so an
episode whose subject moves from A to B (a log streaming to a replica, a queue
draining, a pipeline) has no field that agrees with it.

`WalField` is soft horizontal streaks travelling at mutually incommensurate
speeds. Two things it got wrong first, both worth knowing before building
another one:

- **A streak must be long and thin or it reads as a blob.** The first pass had a
  lit segment about as wide as the band was tall and rendered as a grid of soft
  smudges. Aim for a lit run **4× the band height or more** — band height 10–17%
  of frame, lit segment 40–60% of frame.
- **A light film needs a SATURATED variant for the title and end card.** Streak
  colours that read as a tint on white go chalky at strength, and white type on
  them is illegible. Invert instead: PALE streaks over a DEEP wash, as a separate
  exported set (`WAL_AZURE_DEEP` + `WAL_WASH_DEEP`), same as `MESH_AZURE_DEEP`.

Drift is taken `% period` against a 300%-wide element whose gradient repeats on
that same period — bounded forever, no seam, and no `spreadMethod` needed.

**An act-two temperature shift belongs to the FIELD and nothing else.** EP 21
declares `WAL_AZURE_COLD` per station, so the light turns colder across the act
break while the ink, the accent, the panel black and the type never move. No
cross-fade is needed and none should be built: the change happens under the act
slate's wash, the one moment in the film the frame is already covered.

---

## Worked examples in this repo

| Episode | Runtime | Stations | What it adds |
|---|---|---|---|
| `episodes/webhooks-well-call-you/Ep15.tsx` | 2:10 | 12 | the register at full length; the 3D marquee; the marquee drag+zoom |
| `episodes/sns-sqs-shout-once/Ep16.tsx` | 1:24 | 8 | the 90-second shape; the two-act serpentine; no footage at all |
| `episodes/vectordrop-r2-migration/Ep17.tsx` | 1:35 | 9 | the register on a DARK product palette; a client's own design system instead of the house look; a local OS font as the display face |
| `episodes/read-the-label-open-the-book/Ep20.tsx` | 1:25 | 8 | `MeshField` — one edgeless instrument under EVERY station, so the value journey is one surface turned up and down; a supplied React component ported frame-pure and made to carry the argument |
| `episodes/ask-the-replica/Ep21.tsx` | 1:29 | 8 | `WalField` — the first field with a DIRECTION, and the act-two temperature shift living in the light alone; a RULER as protagonist, drawn on three stations doing three jobs; a LOCATOR (app/primary/replica) that lets eight bespoke instruments coexist without losing the topology; the SOUND-OFF cut. **6.4% static — the best in the run** |
