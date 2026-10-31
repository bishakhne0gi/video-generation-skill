---
format: 1920x1080
duration: 96s
message: "You are never sent the film. It is cut into six-second segments, encoded at several bitrates, listed in one text file, and served from a cache near you."
arc: "The valley (one film, a million people) → Title → The arithmetic (15 Tbps) → Segmentation, the thesis → The bitrate ladder → The manifest (the one dark frame) → Adaptive bitrate on the road → The edge caches at dusk → Takeaway on the hilltop"
audience: "working developers who have used a video player but never shipped one"
mode: autonomous
music: warm-pastoral-orchestral-wonder
---

## Video direction

**Register rhythm (from `DESIGN.md`):**
sky → sky → paper → meadow → paper → **night** → meadow → **sky-dusk** → sky-golden.
One dominant ground per act. The film opens at dawn, spends its middle on paper
in daylight, drops to the one dark frame for the manifest, and closes at golden
hour — so the whole episode reads as a single day in the valley, and the value
change arrives *with* the cut rather than as one.

**The metaphor is a working model, not decoration.** Every painted element maps
onto something real, and every frame cuts from the painted version to the actual
artefact:

| Valley | System |
|---|---|
| the mill on the river | the origin encoder |
| crates leaving the mill | media segments (`.m4s`) |
| three crate sizes | the ABR ladder — 1080p / 720p / 480p |
| the paper list nailed to the door | the HLS master playlist (`.m3u8`) |
| lit shopfronts across the hillside | edge caches / CDN PoPs |
| wind on the road | throughput |
| the basket you can carry | the player's buffer |

**The current is LEFT.** Every ordinary seam is a cut-the-curve travelling left:
exit `power4.in`, entry `power4.out`, entry travel ≈127% of exit, cut landing
mid-motion on both sides, outgoing hard-killed at the cut. Three reserved
vectors, spent once each, never adjacent:

| Seam | Cut | Vector | Meaning |
|---|---|---|---|
| 1 → 2 | valley → title | x −1 (the current) | next beat |
| 2 → 3 | title → arithmetic | x −1 (the current) | next beat |
| **3 → 4** | arithmetic → segments | **z −1 (inverse zoom)** | **ARRIVAL — the thesis: the film is never sent** |
| 4 → 5 | segments → ladder | x −1 (the current) | next beat |
| **5 → 6** | ladder → manifest | **z +1 (zoom-through)** | deeper into the same thought — the ladder becomes the text that describes it |
| 6 → 7 | manifest → the road | x −1 (the current) | next beat |
| 7 → 8 | the road → the edge | x −1 (the current) | next beat |
| **8 → 9** | the edge → takeaway | **y −1 (up)** | elevation into the conclusion |

Recorded in `ledger.json`, verified numerically with `seam-gate.mjs verify`.

**Continuity object — one segment.** `seg-00412.m4s`, a mono string in a fully
rounded paper pill pinned bottom-left from frame 4 to frame 8. The id never
moves; only its state word changes, and every state is something the film has
just shown:

**encoded** (frame 4, it leaves the mill) → **listed** (frame 5, it appears in the
ladder) → **in the playlist** (frame 6, its line is highlighted in the real
`.m3u8`) → **requested** (frame 7, the player asks for it) → **cached** (frame 8,
it is already at the edge) → **played**. It is drawn from the film's own manifest,
never invented.

**Camera budget: two moves, both motivated.** Frame 1's unbroken pull-back out of
the river into the whole valley, and frame 8's slow lateral drift across the lit
hillside as the caches light up. Every other frame holds a locked plate.

**Wind is the register's one licensed idle motion**, and it runs on the painted
plates only — a 14–22s period, 1.5–3% travel, always at a different phase per
frame so no two grounds breathe together. The vector layer obeys the doctrine
unchanged: staged arrival, running systems, no wobble.

**Stillness before the climax:** 0.8s of held frame in frame 4 between the film
strip stopping and the segments separating. Frame 7 holds 0.6s between the wind
dropping and the ladder stepping down.

**Held beats:** the back 2.0s of frame 2, the back 1.6s of frame 6, and the back
2.4s of frame 9. Frames 2 and 9's tail carry no voice — the bed lifts there.

**Sourcing rule:** every numeral on screen is captioned with its source on the
same frame. The arithmetic in frame 3 is shown as arithmetic so the viewer checks
it rather than trusts it.

**Painted plates:** six, generated for this episode in one consistent hand-painted
register (`public/img/`). They are grounds, not illustrations — every one carries
a vector layer, and none is ever shown naked for more than the cold open's first
beat.

---

## Frame 1 — The valley

- status: animated
- src: compositions/frames/01-valley.html
- duration: 9.0s
- transition_in: cut
- scene: a slow pull-back out of the river into the whole dawn valley; the cold-open line builds over it
- voiceover: "One film. A million people. All pressing play inside the same second."
- type: hook
- persuasion: Scale contrast — one object, then an impossible number of destinations
- beat: recognition
- focal: the river, then the valley it belongs to
- roles: painted valley = foreground subject · sky = background · headline = supporting
- sfx: whoosh-soft
- register: sky
- assets: public/img/valley-dawn.jpg (generated for this episode)

Scene 1 (0.0–2.4s): the plate is already on screen at scale 1.42, centred on the
river bend, and is already moving — a single decelerating pull-back. No type yet.
The valley is doing the work.
Scene 2 (2.4–5.0s): the pull-back completes and the camera locks at scale 1.0,
the whole valley in frame. `One film.` lands in Zen Maru 900 over the sky's
upper-left quiet third, in `--cloud` with a soft warm shadow so it survives the
cloud detail beneath it.
Scene 3 (5.0–7.0s): `A million people.` lands under it on its spoken cue. As it
does, ~140 small warm window-lights bloom across the valley floor in a staggered
cascade — one per house, 18ms apart — so the count is *shown*, not stated.
Scene 4 (7.0–9.0s): the lights hold, breathing very slightly out of phase. The
frame is still. The wind carries the plate 1.8% left, which is also the exit.

**Sustained motion:** the pull-back for the first half, the light cascade for the
second. They do not overlap.

---

## Frame 2 — Title

- status: animated
- src: compositions/frames/02-title.html
- duration: 5.5s
- transition_in: cut
- scene: the title over the painted cumulus plate, full bleed
- voiceover: —
- type: branding
- persuasion: Naming the thing
- beat: orientation
- focal: the two-line title
- roles: title = foreground subject · cloud plate = background · episode pill = supporting
- sfx: impact-soft
- register: sky
- assets: public/img/sky-texture.jpg

Scene 1 (0.0–1.3s): the cloud plate is already full-bleed and drifting, carried
in by the seam. `STREAMING` arrives in Zen Maru 900 at display-xxl, `--cloud`,
travelling left and settling.
Scene 2 (1.3–2.6s): `AT SCALE` lands beneath it, `AT` in `--cloud` and `SCALE`
in `--terracotta` — the frame's one accent, at display size where it clears
contrast.
Scene 3 (2.6–3.5s): the episode pill fades up bottom-left: `EP 24`, mono, in a
paper pill. A 2px terracotta rule draws left-to-right under the title.
Scene 4 (3.5–5.5s): held. Nothing moves but the wind on the clouds. This is the
first of the film's two deliberate silences and the bed lifts into it.

**Sustained motion:** wind only. The frame is deliberately at rest.

---

## Frame 3 — The arithmetic

- status: animated
- src: compositions/frames/03-arithmetic.html
- duration: 11.5s
- transition_in: cut
- scene: a paper card over the valley plate; the multiplication builds term by term and resolves to 15 Tbps
- voiceover: "Do the arithmetic. One ultra-high-definition stream is about fifteen megabits per second. A million of them is fifteen terabits."
- type: problem
- persuasion: Show the working — the viewer verifies rather than trusts
- beat: tension
- focal: the resolved figure
- roles: the equation = foreground subject · washed valley plate = background · source caption = supporting
- sfx: tick, notify
- register: paper
- assets: public/img/valley-dawn.jpg under a 0.90 paper wash

Scene 1 (0.0–2.2s): the paper card is already on screen and travelling in from
the right, carrying `Do the arithmetic.` at lede size. The washed valley shows
through it.
Scene 2 (2.2–5.4s): `15 Mbps` lands in JetBrains Mono at figure size, with its
caption beneath — `one Ultra HD stream · Netflix, recommended connection speed`.
Scene 3 (5.4–7.6s): `× 1,000,000` lands beside it, the multiplication sign
drawing in first, then the number counting up through six digits in 0.9s and
locking with tabular figures.
Scene 4 (7.6–9.9s): a 2px terracotta rule draws under both terms, and
`= 15 Tbps` resolves beneath in terracotta at figure size. Held 0.4s before it
appears — the stillness before the payoff.
Scene 5 (9.9–11.5s): the line `No origin serves that.` types on beneath in ink
at lede size. The card begins its zoom-out exit.

**Sustained motion:** the counter through scene 3, the rule draw and the type-on
through 4 and 5.

---

## Frame 4 — Segments

- status: animated
- src: compositions/frames/04-segments.html
- duration: 12.0s
- transition_in: cut
- scene: the film strip stops, then separates into six-second segments that leave the mill as crates
- voiceover: "So the film is never sent. It is cut into segments, six seconds each, and those are what travel."
- type: mechanism
- persuasion: The reversal — the thing you assumed was sent, is not
- beat: **the thesis lands**
- focal: the strip breaking into pieces
- roles: the strip and its segments = foreground subject · the mill plate = background · segment ids = supporting
- sfx: impact-soft, tick ×8
- register: meadow
- assets: public/img/mill.jpg

Scene 1 (0.0–2.0s): arrives on the inverse zoom — the mill plate at scale 1.0
entering from 0.82 and settling, with a single continuous film strip already
lying across the lower third at full opacity. It rides the cut.
Scene 2 (2.0–3.6s): the strip is travelling left. It slows and **stops**. Held
0.8s — the stillness before the climax. Nothing on screen moves but the mill
wheel and the wind.
Scene 3 (3.6–6.8s): the strip separates. Eight gaps open simultaneously with a
staggered 60ms cascade left to right, each cut sounding a tick. Each piece gains
a mono label — `seg-00409.m4s` through `seg-00416.m4s` — and a `6.006s` duration
chip.
Scene 4 (6.8–9.6s): the segments lift very slightly and begin travelling right
in a staggered convoy toward the frame edge, exactly as the crates beside the
mill are stacked. `seg-00412.m4s` — the continuity object — is the one that stays
lit, and its pill appears bottom-left reading **encoded**.
Scene 5 (9.6–12.0s): a caption settles under the strip:
`6-second target duration · Apple HLS Authoring Specification`. Then the frame
holds and begins its exit left.

**Sustained motion:** the strip travel, then the separation cascade, then the
convoy. Continuous, and each phase is caused by the last.

---

## Frame 5 — The ladder

- status: animated
- src: compositions/frames/05-ladder.html
- duration: 11.5s
- transition_in: cut
- scene: the same six seconds, encoded three times; three rows of different weight on a paper card
- voiceover: "Encode every segment more than once, at different bitrates. Same six seconds of story. Three different weights."
- type: mechanism
- persuasion: Same-but-different — one variable changes, everything else is held
- beat: build
- focal: the three rows and their diverging widths
- roles: the ladder = foreground subject · washed meadow plate = background · byte figures = supporting
- sfx: tick ×3, notify
- register: paper
- assets: public/img/meadow-road.jpg under a 0.90 paper wash

Scene 1 (0.0–1.8s): the card enters travelling left carrying the heading
`the same six seconds` at label size and one full-width row already drawn.
Scene 2 (1.8–5.4s): three rows resolve top to bottom, 140ms apart: `1080p`,
`720p`, `480p`. Each carries its real ladder values in mono — resolution,
`BANDWIDTH`, and the resulting segment size in megabytes.
Scene 3 (5.4–8.4s): a bar grows rightward inside each row, its width proportional
to that rung's bitrate, so the three weights are visible as length before they
are read as numbers. The 1080p bar reaches full width; 480p reaches 24% of it.
Scene 4 (8.4–11.5s): a single vertical rule sweeps down through all three rows
and each gains a `6.006s` chip in terracotta — the point of the frame, made
literal: the durations are identical, only the weight differs. The continuity
pill flips to **listed**.

**Sustained motion:** staged row arrival, then the bar growth, then the sweep.

---

## Frame 6 — The manifest

- status: animated
- src: compositions/frames/06-manifest.html
- duration: 12.5s
- transition_in: cut
- scene: the one dark frame — a real HLS master playlist types itself into a code well
- voiceover: "Then publish one text file that lists them. That playlist is everything the player is given. It works out the rest itself."
- type: mechanism
- persuasion: The artefact itself — the real file, not a drawing of one
- beat: build
- focal: the typed playlist
- roles: the code well = foreground subject · the night ground = background · the annotation = supporting
- sfx: keytap ×N, notify
- register: **night**
- assets: none — this frame is the film's one full dark ground

Scene 1 (0.0–1.1s): arrives on the zoom-through at scale 1.18 settling to 1.0.
The code well is already full-bleed and already carries its first two lines at
full opacity — it rides the cut.
Scene 2 (1.1–7.4s): the real master playlist types in at 62 characters/second,
line by line, with a caret: `#EXTM3U`, `#EXT-X-VERSION:7`, then the three
`#EXT-X-STREAM-INF` lines with their true `BANDWIDTH`, `RESOLUTION` and RFC 6381
`CODECS` strings, each followed by its variant path.
Scene 3 (7.4–9.6s): the 1080p line's `BANDWIDTH` value lights in
`--terracotta-lit` and a hairline connector draws right to a short annotation —
`bits per second, not bytes` — the one thing about this file people get wrong.
Scene 4 (9.6–10.9s): the caption `#EXTM3U · RFC 8216 · Apple HLS` settles at the
foot in `--night-mute`. The continuity pill flips to **in the playlist**.
Scene 5 (10.9–12.5s): held dark and still. The film's second deliberate silence.

**Sustained motion:** the type-on carries six of the frame's twelve seconds; then
the highlight and annotation; then rest.

---

## Frame 7 — The road

- status: animated
- src: compositions/frames/07-road.html
- duration: 12.5s
- transition_in: cut
- scene: adaptive bitrate in motion — the wind rises, throughput falls, the player steps down a rung and keeps going
- voiceover: "Watch the buffer. When throughput drops, the player asks for a smaller rendition next. The picture softens. It never stops."
- type: mechanism
- persuasion: Graceful degradation shown as an event, not described as a property
- beat: turn
- focal: the buffer meter surviving the drop
- roles: the throughput trace and buffer meter = foreground subject · the meadow road plate = background · the rung chips = supporting
- sfx: tick, notify
- register: meadow
- assets: public/img/meadow-road.jpg

Scene 1 (0.0–2.6s): the road plate enters travelling left at full opacity. A
paper card sits right, carrying a live throughput trace already drawing — a
running system, not a drift — and a buffer meter beneath it holding near full.
Scene 2 (2.6–5.2s): the trace falls. The wind on the plate visibly strengthens
(the drift rate doubles for 1.4s) so the *painting* and the *graph* say the same
thing at the same moment. The buffer meter starts draining.
Scene 3 (5.2–6.4s): held 0.6s at the lowest point, buffer at 31%. Nothing moves
but the wind. This is the frame's climax and it is a silence.
Scene 4 (6.4–9.8s): the active rung chip steps down — `1080p` dims and `720p`
lights in terracotta — and the buffer meter immediately begins refilling. The
trace stays low; the buffer recovers anyway, which *is* the mechanism.
Scene 5 (9.8–12.5s): `It never stops.` lands at lede size in ink. The continuity
pill flips to **requested**. The card begins its exit left.

**Sustained motion:** the throughput trace runs continuously for the whole frame.
Everything else is staged against it.

---

## Frame 8 — The edge

- status: animated
- src: compositions/frames/08-edge.html
- duration: 12.0s
- transition_in: cut
- scene: the lit hillside at dusk; one request reaches the origin, a million are answered locally
- voiceover: "Now put copies near people. A million viewers reach a nearby cache. The origin serves that segment once."
- type: payoff
- persuasion: The asymmetry — the number that does not grow
- beat: payoff
- focal: the two counters, one enormous and one that stays at 1
- roles: the lit village plate = foreground subject · the two counters = supporting · the origin marker = supporting
- sfx: tick, notify
- register: sky-dusk
- assets: public/img/village-dusk.jpg

Scene 1 (0.0–2.4s): the dusk plate enters travelling left at full opacity, its
windows already lit. The camera begins a slow lateral drift right — the film's
second and last camera move.
Scene 2 (2.4–6.2s): request marks bloom outward from the lit windows in a
staggered cascade, and a counter in the upper right runs up: `1,000,000 requests`,
tabular, counting in 1.1s.
Scene 3 (6.2–9.0s): a second counter appears directly beneath it, same size, same
family — `1 origin fetch` — and simply does not move. The whole frame is that
comparison, and it needs no arrow between them.
Scene 4 (9.0–12.0s): the caption settles: `the same segment, already at the
edge`. The continuity pill flips to **cached**. The camera locks, and the frame
holds still before travelling up out of the shot.

**Sustained motion:** the camera drift for the first half, the request cascade
and the counter for the second.

---

## Frame 9 — Takeaway

- status: animated
- src: compositions/frames/09-takeaway.html
- duration: 9.5s
- transition_in: cut
- scene: the hilltop at golden hour; the four mechanisms land as four lines, then the sign-off
- voiceover: "Small pieces. Several sizes. One list. Cached close. That is streaming at scale."
- type: takeaway
- persuasion: Compression — the whole film in four noun phrases
- beat: resolution
- focal: the four lines
- roles: the four lines = foreground subject · the golden hilltop plate = background · the next-episode card = supporting
- sfx: tick ×4, impact-soft
- register: sky-golden
- assets: public/img/hilltop-golden.jpg

Scene 1 (0.0–1.0s): arrives travelling up, the golden plate already full-bleed
and the first line already visible — it rides the cut.
Scene 2 (1.0–4.6s): four lines land in a staggered cascade, 420ms apart, each in
Zen Maru 700 at display-l over the sky's quiet upper-left, each with its
mechanism named in mono beneath it at label size:
`Small pieces` / `segments` · `Several sizes` / `the bitrate ladder` ·
`One list` / `the manifest` · `Cached close` / `the edge`.
Scene 3 (4.6–6.0s): `That is streaming at scale.` lands beneath in ink at lede
size, with `at scale` carrying the frame's one terracotta. The continuity pill
flips to **played** and then fades — the segment's journey is complete and the
device retires with it.
Scene 4 (6.0–9.5s): the next-episode card rises bottom-right — `EP 25 ·
SUBAGENTS` in a paper card — and the frame holds golden and still for 2.4s. The
bed lifts and carries the ending out.

**Sustained motion:** the cascade, then deliberate rest. The film ends still.
