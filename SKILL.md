---
name: tech-episode-video
description: Use when making an episode for a tech video playlist — a graphic-motion explainer with real cinematic footage, seamless transitions, narration and a score. Triggers on "new episode", "make the video for episode N", "graphic motion episode", "tech explainer video", "product launch film", "trailer", "short", "/episode". Three registers: CUT and TRAVELLED use footage and narration; WORKSPACE is a footage-free, voice-free product film built from named agent cursors operating a live artifact. Directs a bespoke film: Kling generates the footage, the episode's own texture and the morph-bridge transitions, Remotion renders the typography, diagrams and edit on a locked frame, ElevenLabs narrates in a directive instructional register, a synthesised cue set sounds every arrival, and a ducked generated or CC0 score carries it. Self-installs its prerequisites on first run.
---

# Tech episode — you are the motion-graphics director

## What this is

One episode of a tech playlist, hand-directed. Not a generator: the kit is a
scaffold, and every episode gets its own shot list, its own diagrams and its own
cut. Output: `episodes/<slug>.mp4` (+ `.webm`, + optional 9:16 short).

**Pick the register before anything else** (step 7 has the full decision):

| Register | What it is | Footage | Voice |
|---|---|---|---|
| **CUT** | twelve screens replacing each other | yes | yes |
| **TRAVELLED** | one canvas, the camera flies between ideas | optional | yes |
| **WORKSPACE** | software being operated by named agents | **none** | usually none |

**START HERE unless you have a reason not to: `references/station-strip.md`.**
It is TRAVELLED made concrete and hardened across EP13–EP17 — the serpentine
route, the two camera moves, the copy-paste schedule block, the act slate, the
continuity chip, the value journey, how to wear a client's own design system,
and the gotchas that each cost a render to find. It needs **no Kling at all**:
EP15 (2:10), EP16 (1:24) and EP17 (1:35) all shipped on graphics alone, so an
episode in that register costs one TTS run and one music run and nothing else.
It also carries the sizing table — how many stations a 60 / 90 / 130-second film
gets — which is the first decision to make and the easiest one to get wrong.

WORKSPACE is a complete, no-Kling path — not a degraded one. It is the shape of
a product launch film: 20 seconds, four beats, no footage, no narration, and it
holds together because every change on screen visibly has an author. Reach for
it for a launch piece, a trailer or a short, and reach for its *moves* (the
caret camera, the agent cursors, the live artifact) inside any episode.
`references/workspace-film.md` is the craft; `DemoLab` is the working film.

Everything below about Kling applies to CUT and TRAVELLED. The division of
labour there is the whole idea, and it is not negotiable:

| | Kling | Remotion |
|---|---|---|
| **Does** | photoreal footage, the episode's own texture and atmosphere, impossible morphs between two frames | typography, diagrams, code, UI, timing, the edit, audio |
| **Never** | text, UI, numbers, charts, logos (it hallucinates them) | pretends to be photoreal |
| **Why** | real light and grain create *depth* | motion graphics carry *meaning* |

Target mix per CUT/TRAVELLED episode: **~35–45% footage beats, ~55–65% graphics
beats**, and the two are laid over each other constantly — a Kling shot with a
Remotion lower-third is one beat, not two. A WORKSPACE film ignores this line
entirely and generates nothing.

Kling has **three jobs here, not one**, and the middle one is the one episodes
under-use:

1. **Shots** — the footage beats. You are looking at it.
2. **Theme elements** — subjectless texture generated in the episode's own
   palette and run *under* the graphics (`Ambient`). Real grain, moving light and
   depth of field behind flat vectors. This is what stops motion graphics
   looking computed, and you should never quite notice it. Two per episode.
3. **Bridges** — a morph between two rendered Remotion frames (`MorphBridge`).

Use video where the theme wants it, not where the beat is short of ideas. If
there is no honest shot of the thing you're explaining, run a texture under the
diagram instead of reaching for an approximation — the diagram carries the
meaning, the texture carries the realism.

---

## ALWAYS: the Remotion skills are the authority on Remotion

This kit vendors the official Remotion skill pack at
`.agents/skills/` (symlinked into `.claude/skills/`, versioned in
`skills-lock.json`). **Every time you touch anything Remotion — markup, timing,
audio, fonts, transitions, compositions, rendering — you load the relevant one
first.** Not from memory: Remotion's APIs move, and this file does not restate
them.

Start at the router, always: invoke the `remotion-best-practices` skill — it
points at the right sub-skill. If it isn't in your skills list (a fresh install
mid-session), `Read`
`.agents/skills/remotion-best-practices/SKILL.md` directly; its links are
relative and resolve from there.

The routes you will actually use here:

| Doing | Load |
|---|---|
| writing/editing `Episode.tsx`, `kit.tsx`, `footage.tsx`, `transitions.tsx` | `remotion-markup` |
| scene timing, `sec(n)`, `Sequence`, `calculateMetadata` | `remotion-markup/timing.md`, `sequencing.md`, `calculate-metadata.md` |
| VO + music beds, ducking, waveform | `remotion-markup/audio.md`, `voiceover.md`, `sfx.md` |
| embedding Kling clips, trimming, `startAt` | `remotion-markup/embedding-videos.md`, `video-editing.md`, `cropping.md` |
| Poppins / Geist Mono loading | `remotion-markup/google-fonts.md`, `local-fonts.md` |
| the `Enter` vocabulary, effects, light leaks | `remotion-markup/transitions.md`, `effects.md`, `light-leaks.md` |
| `npm run render`, `remotion still`, encoding, transparency | `remotion-render` |
| clip durations/dimensions without a render | `remotion-multimedia` |
| making the Studio editable by the director | `remotion-interactivity` |
| any API you're unsure of | `remotion-docs` — look it up, don't guess |
| bumping Remotion or the skill pack | `remotion-upgrade` |

Precedence when they disagree: this file's **house style** (division of labour,
typography, versioning, determinism) wins on *what the episode looks like*; the
Remotion skills win on *how Remotion works*. If a Remotion skill tells you to
scaffold a fresh project, ignore that part — the project already exists here.

---

## STEP 0 — Self-setup (run first, fix silently what you can)

```bash
cd ~/.claude/skills/tech-episode-video
[ -d node_modules ] || npm install
```

1. **Kling access.** First, look for a connected Kling MCP server:
   `ToolSearch("+kling")`. If tools come back, prefer them — they handle
   auth and polling for you; download whatever URL they return into
   `public/kling/<id>.mp4` and run `node kling.mjs manifest` afterwards so
   Remotion learns the real clip lengths.
   If there is no Kling MCP in the session, use `kling.mjs`, which needs
   `.env.local` (copy `.env.local.example`):
   `KLING_ACCESS_KEY` + `KLING_SECRET_KEY` (official API) **or** `FAL_KEY`
   (`KLING_PROVIDER=fal`). Ask the user for whichever is missing; never echo a
   key back, only write it to `.env.local`.
2. **ElevenLabs.** `ELEVENLABS_API_KEY` in the same file. If the user won't
   supply one, offer: skip VO (music-only cut) — but say plainly that the film
   will be weaker.
3. **ffmpeg.** Never assume a system ffmpeg; the scripts use the bundled
   `node_modules/@ffmpeg-installer/*/ffmpeg`. The `@remotion/compositor` ffmpeg
   aborts when invoked directly — don't reach for it.
4. **Remotion skills present.** `ls .agents/skills/` should list eleven
   `remotion-*` directories. If it doesn't, restore them before writing any
   markup: `npx skills add remotion-dev/skills` from this directory.
5. **Budget.** Kling is the expensive part (~10–20 clips/episode, and pro mode
   costs more than std). Show the user the shot list and the count BEFORE
   generating. Re-generating a shot is a real cost, not a free retry.

---

## The pipeline

### 1 — The brief (with the user, before anything renders)

Get, or propose and confirm: **episode title**, the **one idea** it teaches, the
audience's **before/after state**, the **theme** (`terminal-dark`, `white-light`,
`neon-grid`, `warm-paper`, `stripe-mesh`), and where it sits in the playlist.
Then write the **art-direction note** — 4–6 lines: palette, typographic
register, footage language, the story arc, the one signature move this episode
owns.

**If the repo has a `DESIGN.md`, it outranks the house look.** Read it first and
build the episode's theme out of its tokens rather than picking a preset —
`stripe-mesh` in `src/theme.ts` is exactly that, and the reason EP15 does not
look like EP14. Three things to carry across, because they are the ones that
make a brand recognisable and the ones an episode quietly drops:
the display weight and tracking (thin at -0.05em is a different brand from
semibold at 0), the single-accent rule (one filled hue, everywhere, and the
gradient hues never leak onto a button), and the numeric treatment (`tnum` on
every figure). Keep the series' own continuity in the CONSTRUCTION and the cue
set, not in the colour.

### 2 — The beat sheet (SHOW THE USER, get a yes, then build)

A table, one row per beat: `#`, beat name, what's on screen, footage or
graphics, transition in, VO line. A proven 10–12 beat arc for a tech episode:

| # | Beat | Screen | Kind | Enter |
|---|---|---|---|---|
| 1 | Cold open | footage + one burned line | Kling | cut |
| 2 | Title | title card | graphics | flash ✦ |
| 3 | The problem | one statement, full frame | graphics | push-up |
| 4 | Why it hurts | footage + 2 callout chips | Kling | iris |
| 5 | Chapter slate | 01 / THE PROTOCOL | graphics | split |
| 6 | How it works | flow / stack diagram | graphics | luma-wipe |
| 7 | The code | code window, one line hot | graphics | push-left |
| 8 | Proof it runs | terminal, real output | graphics | wipe |
| 9 | The turn | footage morph (Kling bridge) | Kling | fade |
| 10 | The payoff | before/after with real numbers | graphics | zoom |
| 11 | The catch | honest limitation | graphics | dip-black ✦ |
| 12 | End card | takeaway + next episode | graphics | pull |

Twelve beats, four or five distinct transition kinds, and exactly two marked ✦ —
the accents. That ratio is the house register; see step 8.

Never open on a slide. Never end without naming the next episode.

**A WORKSPACE film uses a different sheet — four beats, ~20s**, and the rows are
cursor choreography rather than transitions, because there are almost no cuts:

| # | Beat | ~sec | Screen | Who acts |
|---|---|---|---|---|
| 1 | Cold open | 3.5 | caret camera falling back off a typed line | Claude types |
| 2 | The prompt | 3.5 | one line of intent, sent | Claude sends |
| 3 | The work | 3.5 | three task lines, each with a craft detail | team arrives |
| 4 | The payoff | 9 | the artifact restyling live, status → finished | Animator, Colorist, Sound |

Beat 4 is nearly half the film on purpose: the transformation is what they came
for, and it needs room to happen twice. Copy `DemoLab.tsx` rather than
re-deriving the offsets.

### 3 — Write `episode.config.json`

One file drives the shots, the narration and the film: `series`, `episode`,
`title`, `titleAccent`, `hook`, `theme`, `voice`, `music`, `vo[]`, `shots[]`.
Prefix shot ids with the episode (`ep03_open`) so `public/kling/` stays sane
across the playlist.

### 4 — Narration FIRST, then time the picture to it

```bash
node tts.mjs --check         # lint pace / length / tags — records nothing
node tts.mjs                 # → public/audio/vo/sceneN.mp3 + vo-durations.json
node tts.mjs --audition 4    # scene 4, four readings, pick one
FORCE=1 node tts.mjs         # after a script change
node tts.mjs 4 7             # re-record two lines only
node estimate-vo.mjs         # no key yet? fit the schedule from the archive
```

`vo-durations.json` is the source of truth for scene length: **scene seconds =
VO + 0.35s breath** (`sec(n)` in `Episode.tsx` does this). Never hand-guess a
duration.

**No ElevenLabs key yet — build the picture anyway.** `estimate-vo.mjs` fits
`seconds = b0 + b1·chars + b2·full-stops` across every archived episode
(`episodes/*/episode.config.json` beside its `vo-durations.json`) and writes the
predicted lengths into `vo-durations.json`. On the current archive that is 104
real lines and a mean error of 0.7s, which is inside the 0.35s breath plus one
beat of grid snap — close enough to cut, score, sound-design and *watch* the
film before a credit is spent. It is not a substitute for recording: the moment
`node tts.mjs` runs it overwrites the file with measured lengths and every cut,
camera key and cue re-times itself. Set `"audio": { "vo": false }` until then so
the render is not silently missing a track it thinks it has. Lines are 12–24 words, business-led, spoken — read them aloud.

**The house voice is DIRECTIVE.** The narrator knows the thing and is handing it
to you, in order, without hedging — an instructor, not a podcaster and not a
trailer. That register is built in the writing, and the model choice protects
it: `eleven_multilingual_v2`, `stability 0.72`, `style 0.05`. v2 cannot perform
audio tags at all, which makes "no modulation" structural rather than a setting
that drifts. Reaching for `eleven_v3` is a departure from the series voice;
`--check` says so.

Four things the writing has to do — the full craft is
`references/narration.md`, read it before recording:

- **Instruct, don't observe.** "Watch the queue. It backs up here." — not "The
  queue starts to back up here." Roughly a quarter of lines carry second person
  or an instruction verb; `--check` counts them and complains.
- **State it or cut it.** Every hedge (*maybe, sort of, probably, arguably*) is
  the narrator declining to know the thing they're explaining. Flagged.
- **One clause per sentence.** The second comma should have been a full stop.
  Anything over 20 words in one sentence is flagged.
- **Definition, then consequence.** Name the thing, then say what it costs. Two
  lines, in that order. It's the move that makes an episode feel taught.

Punctuation is the only performance control on v2, and it costs nothing: `…` is
a held beat, a line break is longer, ALL CAPS is stress.

### 5 — Generate the footage AND the episode's texture

```bash
node kling.mjs shots                     # everything in the config, cached, serial
node kling.mjs shots ep03_open           # one shot
FORCE=1 node kling.mjs shots ep03_open   # re-roll it
```

Two kinds of thing come out of this step:

**Shots** — the footage beats. Then **look at every clip** before building around
it (`node stills.mjs public/kling/ep03_open.mp4 --tiles 8`). Kling fails in
specific ways: warped first 4–8 frames (trim with `startAt`), invented text
(re-prompt with a harder negative), a subject that morphs mid-shot (shorten, or
re-roll with a simpler prompt).

**Theme elements** — two subjectless texture plates, 10s, `std` mode, prompted as
a *material* in the episode's own palette: ink diffusing, dust in a light shaft,
haze drifting, paper fibre under raking light. Locked-off camera, slow
continuous behaviour, nothing that resolves. They run under the graphics beats
via `Ambient` at 0.10–0.22 opacity on dark themes, 0.05–0.12 on light ones. If
you can point at the video, it's composited too hot.

Both prompt grammars, the material catalogue by register, and the failure table
are in `references/kling-shots.md`.

### 6 — Score it

```bash
node music.mjs --gen "slow documentary strings, low tension" --plan  # generated, follows the arc
node music.mjs --engine stable-audio --gen "warm analogue pad"       # generated locally, free forever
node music.mjs --search "ambient technology" --seconds 95            # CC0 from Openverse
node music.mjs --mood dark-tech --seconds 95                         # synthesised, licence-free
```

**Reach for `--gen` first.** The synth bed is a FALLBACK — it exists so a dead
network costs you a nicer score rather than a render, and it sounds like what it
is. Every episode in this playlist that shipped well was scored with
`node music.mjs --gen "<brief>" --plan` on the same ElevenLabs key as the VO;
the briefs are in each `episodes/<slug>/CREDITS.md` and they are worth copying,
because "driving electronic build … restrained percussion entering on the
downbeat … no melody that competes with speech, 84 bpm" is a specification and
"energetic" is not.

Four engines, all clearable. `--gen` writes to a **brief** rather than picking a
mood, and `--plan` sections the score to this episode's real VO timing so the
bed changes where the film changes. `stable-audio` is Stable Audio Open running
locally — free forever, no key, 47s loop, one-time ~4GB install. Everything
falls back to the synth bed, so a dead network costs you a nicer score, not a
render. `node music.mjs --list` shows them all; `references/audio.md` says which
to reach for and how to write a brief. Note `--list`, not `--help` — an
unrecognised flag falls through and GENERATES, overwriting the bed you had.

**Ask for ~20% more than the runtime, and then check the tail.** ElevenLabs
Music routinely returns less audio than the composition plan asks for and pads
the file out with true digital silence, so the container duration looks correct
and the last fifteen seconds are dead — which is precisely the end card, the one
beat the bed is supposed to lift on. Two commands, every time:

```bash
FF=node_modules/@ffmpeg-installer/darwin-arm64/ffmpeg
"$FF" -ss <runtime-3> -t 3 -i public/audio/music/bed.mp3 -af volumedetect -f null - 2>&1 | grep mean_volume
```

Anything near −90dB is padding. Regenerate with more headroom rather than
shortening the film to fit the music.

**The bed needs TWO levels, not one.** A flat `0.17` is right under the voice and
far too quiet everywhere else, so the title, the montage and the end card all
sound like the middle of a paragraph and the film never feels scored. `Score`
(`src/lib/sound.tsx`) sits the bed at `open` (0.30–0.40) and ducks it to `under`
(0.14–0.18) while a line plays, off the same layout `Timeline` uses so it can't
drift from the cut. Measured: a 0.9s gap between lines lifts ~3dB, a beat with
no `vo` lifts the full 7 — which is an argument for giving the title, the turn
and the end card a beat of their own.

Credits land in `public/audio/music/CREDITS.md` — always rewritten to match the
file that's actually there — put them in the episode description. Then flip
`"audio": { "vo": true, "music": true, "sfx": true }` in the config.

### 6a — Put the picture on the grid

```bash
node music.mjs --mood calm-focus --seconds 150 --bpm 84   # we chose the tempo
node tempo.mjs --bpm 84                                    # declare it
node tempo.mjs --detect                                    # or work it out from the bed
node tempo.mjs --show                                      # the grid you're cutting to
```

A film timed only to narration lands its moves wherever the sentence happened
to end. Motion arriving WITH the music is most of why the reference pieces feel
tight — the eye reads the coincidence as intent even though it cannot name what
it heard.

`tempo.json` gives the score and the edit one clock. Then in the composition:

```tsx
import { snapUp, barAt } from "../lib/tempo";
const sec = (n: number, breath = 0.35) => snapUp(durs[n - 1] + breath);   // scenes → beats
const KEYS = [{ at: barAt(0), … }, { at: barAt(4), … }];                  // camera → bars
```

**The voice is never moved to fit the music.** Scene lengths are quantised
UPWARD only, so the line always finishes and the cut still lands on the beat.
At 84bpm that costs 0–0.6s a scene. Snap to `"bar"` only on act breaks — on real
narration it adds up to ~2.8s, which is a held silence you had better have meant.

Detection is spectral flux plus a Fourier tempogram, verified against click
tracks of known tempo: exact BPM, phase within 9ms (under a third of a frame).
It prints a confidence — under ~1.6 the bed has no clear pulse (pads often
don't), so either score it with something that does or set the grid by hand.

### 6b — Sound-design it (this is what holds attention)

```bash
node sfx.mjs                 # synthesise this episode's cue set
node sfx.mjs --list          # registers and cues
```

**The eye reads an arrival as an event only when the ear confirms it.** That is
the mechanism behind the videos that hold people — not louder music and not more
animation. A card lands: tick. A command types: key taps. A chapter turns: a
whoosh arriving in a thunk. A number resolves: a notification.

Sixteen cues, synthesised offline and deterministically — nothing to license,
nothing to download, and the set *belongs to the episode's register*, because a
wooden knock under a neon-grid film is a wrong note and stock libraries make
every video sound like every other video. The register picks itself from
`theme`: `terminal` (dry, digital), `editorial` (woody, paper), `neon` (bright,
synthetic), `warm` (analogue, tape).

```tsx
<Timeline beats={BEATS} pal={PAL} />
<CutCues beats={BEATS} />                      {/* every cut that earns one */}
<Cue name="notify" at={26} volume={0.4} />     {/* inside a beat */}
<TypeCues text={CMD} start={7} cps={55} />     {/* under a type-on — SAME start/cps as useTyped */}
<CountCues from={4} dur={40} steps={10} />     {/* under a counter */}
```

**In a WORKSPACE film the cue layer IS the narration.** There is no voice to
duck under, so the bed runs at `open` throughout and every event has to be
sounded: a `click` on each cursor `act`, a `click` on the send, `tick`s under
the task lines' stagger, a `blip` on the restyle, and `success` on the status
pill flipping to done — the most earned cue in the kit. Score it with something
that BUILDS rather than a pad; the music is carrying the arc that narration
would have carried.

`CutCues` sounds each transition by kind and **deliberately sounds none of the
soft ones** — a whoosh on a dissolve says "something moved" while the picture
says "time passed", which is the classic amateur note. Three rules: every cue is
attached to something that moves; nothing competes with the voice (0.2–0.5); and
silence is a cue too — if every beat has sound, none of them land. Levels and
the full cue table are in `references/audio.md`.

### 7 — Direct the film in `src/compositions/Episode.tsx`

**Load `remotion-markup` before you write a line of it** (see the ALWAYS section)
— plus `timing.md` / `sequencing.md` for the beat structure and `audio.md` for
the VO and bed.

That file ships a full worked example — read it before writing scenes. You have
`src/lib/kit.tsx` (graphics vocabulary), `src/lib/footage.tsx` (Kling clips,
grade, chips, lower-thirds), `src/lib/transitions.tsx` (the `Enter` vocabulary
and the timeline assembler). Full API and the house rules:
`references/motion-grammar.md`.

**Decide first whether this episode is CUT, TRAVELLED or WORKSPACE.**

**WORKSPACE** — `src/lib/agents.tsx` + `src/lib/workspace.tsx`, worked film in
the `DemoLab` composition, craft in `references/workspace-film.md`. No footage,
no voice. The film is a piece of software being operated by 3–6 named cursors,
and it coheres because **every change on screen visibly has an author**: a card
that recolours on its own is a motion graphic, a card that recolours twelve
frames after a cursor labelled *Colorist* drops a swatch on it is a story. That
inference does the job narration does elsewhere, which is why the register can
drop the voice track without going quiet. Four moves carry it:

- `useTypeCam` — the cold open. The camera starts inside a single letterform and
  falls back as the sentence types, so the sentence resolves at the same moment
  the frame does. Driven by the content (the caret is going somewhere and the
  camera is following), which is why it isn't a drift.
- `PromptBox` — one line of intent, typed and sent. A prompt is a promise, and
  every frame after it is judged against a goal the viewer already holds.
- `AppWindow` — ONE artifact, transformed repeatedly. Its state changes are
  **interpolated, never swapped**: 13 frames of background, ink and accent
  cross-fading together reads as an application re-rendering; a one-frame swap
  reads as a slide changing.
- `StatusPill` — "rendering" → "finished". A state machine, so a 20-second film
  has a middle with tension and an end with release.

The rule that makes or breaks it: **every cursor move must cause something, or
precede something it caused**, with cause landing ~0.2s before effect. A cursor
that wanders is a screensaver, and that is the easy failure to ship. Mount
`AgentCursors` outside `Timeline` — a cursor that restarts at a cut has stopped
being a person.

**TRAVELLED** — instead of twelve screens replacing each other, one
continuous canvas (`src/lib/space.tsx`) holding every diagram, card and image
the episode will show, with the camera flying between them. The viewer never
re-orients, the film gains geography, and the transitions stop being effects
because a move through real space is something no wipe can imitate. `World` +
`useView` is the camera, `Node`/`Wire`/`SelectionBox` the vocabulary, and
`ScaleFrom` pushes into a node until its content fills the frame — a Kling still
inside a node, pushed into with the graph labels still overlaid, is the single
strongest move available here. Author the world in the `SpaceLab` composition
*before* writing beats: the layout is the argument. This is not a contradiction
of the locked frame — that rule bans a drift laid on a static composition; a
move through a space *is* the content. Never run both on one beat.

**In practice, do not build TRAVELLED from `space.tsx` primitives — build it as a
STATION STRIP, and read `references/station-strip.md` first.** That is the same
register solved four times over (EP13–EP16) and hardened: stations on a
serpentine so the arrivals are not all the same move, `LEAD` mounting each one
1.2s before the camera reaches it, a scale-on-outer / translate-on-inner camera,
one dominant field brightness per act, and a continuity chip following a real id
out of the episode's own content. Copy the skeleton out of the newest
`episodes/<slug>/EpNN.tsx` rather than re-deriving it — the reference tells you
which decisions in that file are load-bearing and which are the episode's own.

**Then give the episode a continuity layer** (`src/lib/motifs.tsx`). Twelve
self-contained screens teach twelve things and land none of them: each beat
resets, the viewer re-orients, and the argument stops being visible — the intent
goes dead around beat five even though every screen is fine. Fix it with
animated graphics that survive the cuts, rendered *outside* `Timeline` so no cut
can interrupt them:

```tsx
<AbsoluteFill>
  <Timeline beats={buildBeats()} pal={PAL} />
  <MotifTrack pal={PAL} keys={JOURNEY} label="request" />   {/* the protagonist */}
  <Thread pal={PAL} from={4} to={DURATION / FPS - 6} />     {/* the through-line */}
  <SeriesMark pal={PAL} series={cfg.series} episode={cfg.episode} />
</AbsoluteFill>
```

- `MotifTrack` — one element travelling the whole film, changing state as the
  story does: `idle → travelling → blocked → travelling → resolved`. Keyframed
  in absolute seconds, one per beat, read off `pace.mjs`'s scene windows. It
  does not have to move on every beat; holding is legible too.
  **Pick the protagonist out of the episode, never invent one.** EP15 follows
  `evt_1PxKq2` — an id already printed in two of its own beats — from *created
  on their side* to *reconciled by the sweep*, as a small pinned chip whose
  state word changes when the argument does. Every state is something the film
  just said, which is what separates a continuity device from a dot that happens
  to persist. Only the state animates; the id never moves, because the point is
  that it is the same event.
- `Thread` — a line that keeps drawing for the whole episode, parked in the safe
  area. "How far along are we" answerable at a glance.
- `Lattice` — a node field that never stops breathing. `active` takes it from
  "idle system" to "system at load", so the base plate carries the act's
  argument.
- `Ticker` — a marquee of *real* log lines or ids. The second thing on a beat
  that has one big idea and nothing else to do.

**Design the motif before you wire it in**: scrub the `MotifLab` composition
(`npm run studio`). A protagonist that reads as a stray dot is worse than none.

### 7b — The marketing surface (`gradient.tsx` + `cards.tsx`)

The register above builds diagrams. This one builds the surfaces a *product*
lives on, and it is what you reach for when the episode has a brand behind it —
a `DESIGN.md`, a real palette, a gradient hero. Four pieces, designed in the
`SurfaceLab` composition before they go anywhere near a beat:

| Piece | What it is | When it earns its place |
|---|---|---|
| `BloomField` | a big soft radial glow off one edge, under heavy moving grain | **the default field.** No edges, so it can sit under anything — title, chapter, end card, or cropped to the upper third over canvas |
| `RibbonField` / `RibbonBand` | the animated *stripe* gradient — hard bands, high contrast | when the surface should be graphic rather than atmospheric. Never under a diagram: the bands cut through the content |
| `ShimmerText` | a multi-stop highlight band sweeping across a headline, clipped to the glyphs | ONE headline in a film, and only the title. A second one and it is an effect rather than a finish |
| `ProductPanel` + `RouteRow` / `MetaRow` / `FeedRow` | a node in a diagram, built as a small piece of SOFTWARE | every box on every diagram. This replaces the labelled rectangle outright |
| `HeroCard` + `BigFigure` / `TickMeter` / `BarRows` | ONE floating panel, centred, over the field, with the only motion inside it | a beat with one figure to deliver and nothing else to say |
| `Marquee3D` + `EventCard` | many small cards under one perspective tilt, columns running opposite ways, edges faded out | a QUANTITY argument. Once per film — a firehose used twice is wallpaper |
| `ChapterBox` / `HighlightBox` / `GridPlate` | the box pattern: a hairline grid plate under a bordered box | chapters full-width, highlights inline around the one thing that matters |

**Never put a colour on a container's edge.** A 3px accent top-border or a 4px
left-border is the most reliable "this was generated" signal in the whole kit:
nothing in the content chose that colour, it is there because a flat card looked
empty. Colour belongs to the *content* — a glyph, a status word, one lit token,
the three real macOS traffic lights. Give every panel, chip, table and terminal
in a film **one black** (`TERM_BG`) and a 1px white-alpha hairline, and let the
content tell them apart. A frame of near-identical dark windows over a bright
field reads as an application; the same frame with six different coloured edges
reads as a slide deck.

**`Terminal` is the default for anything with code in it.** Code that is simply
present was never typed — a viewer reads a code block in about a second and then
waits. A real black macOS window filling itself turns the same six lines into
six seconds of a beat that keeps delivering, and the caret gives the frame
something alive in it without one decorative element. Same `start`/`cps` as
`TypeCues` and the key taps land on the characters.

**A coloured top border and a stroke icon is not a card.** A rounded rectangle
with a centred label in it is the house style of every generated diagram on the
internet, and it reads as filler in under a second because there is nothing in
it to look at. It is the thing people mean when they say a frame "looks AI".
`ProductPanel` is the fix, and DESIGN.md-style systems ask for it explicitly:
*pair every feature explanation with a composited product UI mockup*. Three
rules make a panel read as real rather than as a drawing of real:

- **One piece of true, specific data.** `POST /webhooks` with a `200` beside it
  is a product. `your service` centred in a box is a caption.
- **Busy at the edges.** Real UI has a truncated string, a row that runs out of
  room, a status that is currently `—`. Perfectly balanced content is the tell.
- **Never centre the body.** Software is left-aligned. Centred body copy inside
  window chrome is the loudest signal that the panel is decorative.

Four things that are easy to get wrong here:

- **The field is animated, so it cannot use `requestAnimationFrame`.** Every
  modulation is derived from `useCurrentFrame()`, and every one of them must be
  exactly 0 at t=0 (write `cos(x)−1`, or `sin(x+p)−sin(p)`) or the gradient
  visibly snaps the moment motion starts. Never `Math.round` an angle, a centre
  or a stop position per frame — that rounding IS the stepping you can see.
- **A wave alone is not motion — it needs `drift`.** Bands that bend in place
  read as a still image with a wobble on it. What says *alive* is the field
  travelling along its own axis (~20px/s at 1080p). Drift accumulates without
  bound, so the gradient MUST be `spreadMethod="reflect"`: with the default
  `pad`, everything past the last stop is the last stop, and two minutes in the
  field has silently scrolled off its own stop list and gone flat.
- **Static grain is not grain.** A CSS/SVG noise tile renders the identical
  noise on every frame of the render — that reads as dirt on the lens, not as
  film. Re-seed and re-offset it per frame from `rand(frame)`: deterministic,
  frame-pure, and the difference between a surface and a texture. Check it by
  diffing two adjacent frames; if the mean difference is ~0, your grain is a
  wallpaper.
- **The palette is not part of the technique.** A gradient reference you are
  handed describes a machine — an angle, a feather, a wave, a clock. Its colours
  belong to whoever made it. Drop them into a system with its own primary and
  you ship a film that is technically the right gradient and visibly the wrong
  brand. Keep the machine; take the stops from `DESIGN.md`.
- **Same for the marquee.** The upstream component animates on a CSS keyframe,
  which is wall-clock and therefore either frozen or juddering in a render. The
  offset is computed from the frame, and the content height is *computed*
  (`items × (itemHeight + gap)`) rather than measured, so nothing waits on
  layout.
- **The hero card does not drift and the field does not cut.** The framing is
  the whole point: card centred, roughly a third of the frame wide, field
  untouched behind it, everything that moves happening INSIDE the card. That is
  the difference between a product shot and a slide with a rectangle on it.
- **White type on the field needs a scrim.** The gg field runs pure white to
  near-black across one diagonal, so any fixed text colour is illegible
  somewhere on it. A soft radial pool is the fix; picking a colour that survives
  both ends just means picking grey.

Give the film **one dominant field brightness per act** and let each station
paint its own — the value change then arrives WITH the travel instead of as a
cut. EP15 runs saturated → canvas → cool canvas-soft → canvas → saturated.

### 8 — The transitions (this is what people notice)

Every cut overlaps: the incoming scene animates over the outgoing one on a
spring, for **the length of its own transition** — each kind carries its own
(9–26 frames, `ENTER_FRAMES`), because a dissolve resolving in 14 frames is a
blink and a whip taking 14 is a smear you sit through. Getting those lengths
right is most of what separates *classy* from *has transitions*.

36 kinds, sorted into three registers, and the registers are the point. Classy
is almost entirely restraint — a transition the viewer notices is a transition
that interrupted them:

| Register | Export | Budget |
|---|---|---|
| **House** — quiet, editorial, unhurried | `HOUSE_KINDS` (20) | build the body of the film from 4–5 of these |
| **Accent** — a cut allowed to be an event | `ACCENT_KINDS` (12) | 2, maybe 3. A fourth costs you the first three |
| **Loud** — effects in a transition's clothes | `LOUD_KINDS` (4) | only when the CONTENT is what they depict |

Never the same kind twice in a row. The tables with what each one *reads as* are
in `references/motion-grammar.md`; **scrub the `TransitionGallery` composition**
(`npm run studio`) to see them before choosing.

**Carry the motion through the cut** — if the outgoing scene drifts left, the
incoming one enters from the right at the same velocity. That habit is most of
the difference between "fine" and "seamless".

**In the TRAVELLED / strip register, the LAYOUT is the transition vocabulary.**
A column of stations gives every beat the identical arrival, which is a
slideshow with a scroll on it. Lay the stations on a SERPENTINE instead — four
across, down, four back, down, four across — and you get two kinds of move for
free, which is the whole budget:

- **Across** (most legs): ~0.9s, flat and quick. The next station is already
  sliding in as the last one leaves, so the cut is not a cut.
- **Down** (the act breaks only): ~1.4s, and the camera *lifts* — pulls back to
  ~0.85 at the midpoint and settles. It reads as stepping up and over. Spend it
  ONLY on act changes; a move that means "new section" used on an ordinary beat
  will not mean anything when the section actually changes. Sound them
  differently too — a riser under the lift, a thunk on the landing.

Put the `scale` on an outer wrapper and the `translate` on an inner one. Both on
one element scales the offset as well, and the camera slides off its station.

**Then show the route once, at the end.** A film built as a journey has earned a
map: at the sign-off, draw the stations in the order you travelled them, hold
with all of them lit, and dim it as the end card arrives over the top. A
schematic beats actually zooming out to the real stations — those are illegible
at that scale and cost you every station mounted at once.

For the 2–3 cuts per episode that must feel impossible, use a **Kling morph
bridge** — Kling interpolates between the real last frame of one scene and the
real first frame of the next:

```bash
npx remotion still src/index.ts Episode public/stills/a.png --frame=<last frame of scene A>
npx remotion still src/index.ts Episode public/stills/b.png --frame=<first frame of scene B>
node kling.mjs bridge ep03_morph1 --from public/stills/a.png --to public/stills/b.png \
  --prompt "seamless cinematic morph, continuous camera move, elements dissolve and reassemble, motion blur"
```

Then drop it in as a beat: `MorphBridge("ep03_morph1", PAL, shotSeconds("ep03_morph1"))`,
and set the neighbouring beats' `enter` to `"fade"` with `enterDur: 6`. The cut
disappears. Budget: 2–3 bridges per episode, not ten — they cost money and a
film made entirely of morphs reads as a screensaver.

### 8b — Audit the pacing (the retention step)

```bash
node pace.mjs out/episode.mp4
```

Finds every stretch where **nothing is happening on screen** — the actual reason
viewers leave, and something you cannot judge by scrubbing, because you already
know what's coming. It measures the render, not the intent.

Aim for **under ~15% static** and a *varied* energy column.

**The frame is locked; the content moves.** This is the house rule and it is not
a stylistic preference — a film where every beat drifts reads as a slideshow
with an effect on it. The eye tracks the drift instead of the content, and every
beat starts to feel the same, because underneath the graphics they are all doing
the identical thing. Motion comes from four layers, in this order:

1. **Staged arrival** — nothing lands as a group. `stagger(i, 4)` puts 3–6
   frames between siblings; then stage the *information* so the beat keeps
   delivering across its length instead of dumping at frame 0.
2. **Running systems** — `useLoop(period, offset)`: a packet crawling an edge, a
   scan sweeping a diagram, a ring pulsing out of a node. Unlike a drift it
   *means* something. Biggest upgrade available to a diagram beat.
3. **Depth** — an `Ambient` Kling texture under the field, `useParallax(depth)`
   separating background plate from foreground labels.
4. **The camera** — `camera: "push"` on a `Beat`, opt-in, **two or three per
   episode**, only where the move means something: into the turn, out of the
   close, or a pan that carries motion through a cut. Never on footage; a
   `KlingClip` brings its own push and the two swim.

Plus: **reveals finish early** (`PACE = 0.55` in `src/lib/anim.ts` — the screen
is assembled before the narration reaches the thing it shows) and **the breath
is 0.35s** (`sec(n)`; spend a longer one deliberately).

A beat scoring under ~3 needs a second thing to do — a counter still counting, a
packet still travelling, a highlight arriving when the narration reaches it. Or
it's simply longer than it has anything to say: cut it. A camera move is not a
pacing fix. Detail in `references/motion-grammar.md`.

### 9 — Render, VERIFY, publish

Load `remotion-render` first — encoder flags, concurrency and stills all move
between versions.

```bash
npm run render                                   # → out/episode.mp4
node stills.mjs out/episode.mp4                  # contact sheet — LOOK at it
node stills.mjs out/episode.mp4 --boundaries     # every cut, pre/on/post — LOOK at these
```

Verification is mandatory before claiming done:
- the probe line must show an `Audio:` stream (no stream = silent film);
- read the contact sheet and every boundary still — dead air, collisions, black
  frames and half-finished transitions are all visible there;
- fix, re-render, look again.

### 9b — WATCH IT (not optional, and not the same as looking at stills)

```bash
node review.mjs &                # out/episode.mp4 → http://localhost:8123
```

A contact sheet tells you a frame was fine. It cannot tell you that a transition
stutters, that the VO lands a beat late, that two elements collide for four
frames, or that the film is *boring* — which is the failure that matters and the
only one a still cannot show. So watch it, in a browser, in Chrome:

1. `node review.mjs` — serves the render next to its own beat sheet, with the
   narration line for each beat beside it.
2. Open `http://localhost:8123` with the Claude-in-Chrome tools
   (`tabs_create_mcp` → `navigate`), and take a screenshot of what's on screen.
3. Step the film with the page's automation API via `javascript_tool`, and
   screenshot each stop — the seek promise resolves only once the new frame is
   painted, so the screenshot is never the previous frame:

   ```js
   await R.beat(4);   // jump to beat 4, returns { time, beat, line }
   await R.next();    // next cut
   R.state();         // where am I, and what is being said here
   ```

4. Go through **every beat**, and additionally hold on: the first five seconds,
   each of the two accent transitions, the payoff, and the end card.

What you are looking for, and what to do about it:

| Seen | Fix |
|---|---|
| Picture and narration are about different things | re-time the beat, or the line is on the wrong beat |
| A screen finished assembling and then nothing | step 8b — content motion, or the beat is too long |
| The frame drifting on a beat that didn't need it | drop the `camera` |
| Text over footage you can't read | `grade` up, or move the element off the busy third |
| Two accents inside a few seconds | one of them goes back to a house kind |
| You lost track of the argument | there's no continuity layer — see step 7 |
| A cut moved but you heard nothing | it's missing from `CUT_SOUND`, or `sfxGain` is too low |
| A cue with nothing on screen to explain it | delete it — that is what cheap sounds like |
| The music never lifts | the title / end card need beats with no `vo`, or raise `open` |

The whole point of this step is to experience the film the way the audience
will: in one pass, in motion, **with the sound on** — the review page plays the
real mix, so listen to it as a pass of its own. Half of what you are checking
here is audio, and none of it is visible in a still.

Publish:
```bash
FF=node_modules/@ffmpeg-installer/darwin-arm64/ffmpeg
cp out/episode.mp4 episodes/<slug>.mp4
"$FF" -i out/episode.mp4 -c:v libvpx-vp9 -crf 34 -b:v 0 -deadline good -cpu-used 4 \
  -c:a libopus -b:a 96k episodes/<slug>.webm
npm run render:short                             # optional 9:16 — re-check the stills, wide diagrams need vertical variants
```

Then archive the episode so the playlist stays reproducible:
```bash
mkdir -p episodes/<slug> && cp episode.config.json vo-durations.json episodes/<slug>/
cp src/compositions/Episode.tsx episodes/<slug>/Episode.tsx
```

---

## House style (always applies)

**Boxes and their wires must share a coordinate system.** The most common way a
diagram beat ships broken: lay the boxes out with flexbox, then draw the
connectors as SVG with hand-guessed coordinates. The lines never quite touch,
and it reads as sloppy long before anyone can say why. Author the whole diagram
in ONE fixed design space (`Canvas` in EP13 — 1760×900, scaled as a unit) so a
connector's endpoint IS the box's edge. Same rule for a marquee rect: measure it
off a rendered still, never off arithmetic.

**A labelled rectangle is a rectangle.** The same rectangle with a database
cylinder in it is a database, and the viewer knows before they read a word. Give
every diagram a small stroke-icon family — one weight, one radius, one size — and
the beat stops looking like a wireframe. Prose is the most expensive thing on a
frame: nobody reads three lines under a box. Cut the sentence, keep the glyph.

**Direct, don't caption.** Never put the narration on screen as a sentence. For
each beat ask: what is this line really saying, what should the viewer feel,
what can be removed? On-screen text is 1–4 word labels, UI tags, contrast
phrases. Improve a weak beat instead of executing it.

**Visualize the point.** speed → progress and fast cards; confusion → scattered
drifting panels; clarity → snap-to-alignment; growth → rising bars; a protocol →
one line every node speaks; AI → clean flows and glowing nodes, never robots.

**The film breathes in value.** Each act gets ONE dominant field brightness, and
the episode moves between them — near-black, then white, then a saturated
full-bleed, then black again, then the accent. Nothing reads as premium when
every beat is the same brightness; this is the cheapest luxury in the kit.

**One accent, recurring on the moments of emphasis.** The same hue on the hot
element, on the single highlighted word, on the end card. Not a palette — a
signature.

**Typography.** Headlines Poppins ExtraBold at `-0.05em`, letters almost
touching. Mono (Geist Mono) for anything technical — commands, ids, file paths,
specs; it's the register the audience trusts. Exactly one italic serif accent
word per title card.

**Footage is never naked.** Every Kling shot is graded to the episode palette
and carries at least one Remotion element. Raw clip → cut → slide is the exact
pattern that reads as AI slop.

**The frame is locked unless a move means something.** Default state: no camera.
Two or three deliberate moves an episode. Everything else moves *inside* the
frame — see step 8b.

**Every graphics act gets a surface.** One `Ambient` texture plate, generated in
the episode's palette, running under the vectors. It ties an act together the way
a grade ties footage together, and it's the difference between "clean" and
"photographed".

**Deterministic only.** No `Date.now()`, no `Math.random()` in `src/` — they
break Remotion's frame purity. Use `rand(i)` / `drift()` from `lib/anim.ts`.

**Series continuity.** Same fonts, same transition vocabulary, same `SeriesMark`,
same VO voice across the playlist. Vary the accent colour and the footage
language per episode — that's what makes it a series instead of a template.

**Versioning — never replace, always version.** Any change to a scene the
director has already seen creates `Scene N V2` built from the latest version;
the old one stays in the file, `void`-referenced. Scene numbers never change.

---

## Files

| Path | Role |
|---|---|
| `episode.config.json` | **the brief** — shots, VO, theme, music, titles |
| `kling.mjs` | shot generator (`shots` / `bridge` / `image` / `manifest`) |
| `tts.mjs` | ElevenLabs narration + performance direction, lint, audition → `vo-durations.json` |
| `tempo.mjs` | **the grid** — declare or detect BPM + downbeat → `tempo.json` |
| `music.mjs` | score — 4 engines: generated (ElevenLabs / Stable Audio Open), CC0, synth |
| `sfx.mjs` | **the cue set** — 16 sounds synthesised in the episode's register, licence-free |
| `stills.mjs` | contact sheet + per-cut stills + audio probe |
| `pace.mjs` | pacing audit — finds every screen where nothing is happening |
| `review.mjs` | **the review room** — serves the render + beat sheet at localhost, with a `window.R` API so Chrome can be driven cut by cut |
| `src/compositions/Episode.tsx` | **the film you direct** (worked example inside) |
| `src/lib/kit.tsx` | graphics vocabulary — titles, diagrams, code, stats |
| `src/lib/anim.ts` | motion primitives — `stagger`, `useLoop`, `useAlive`, `useParallax`, `PACE` |
| `src/lib/footage.tsx` | Kling clips, grade, chips, lower-thirds, plates, `Ambient` texture, `FootageShape` |
| `src/lib/transitions.tsx` | `Enter`/`Exit` vocabulary (36 kinds in 3 registers), per-kind overlap, opt-in `Camera`, morph bridge |
| `src/lib/motifs.tsx` | **the continuity layer** — `MotifTrack`, `Thread`, `Lattice`, `Ticker`; animated graphics that survive the cuts |
| `src/lib/tempo.ts` | **the grid, picture side** — `snapUp`, `barAt`, `beatAt`, `useTempo` |
| `src/lib/sound.tsx` | **sound design** — `Cue`, `CutCues`, `TypeCues`, `CountCues`, and `Score` (music ducked off the real edit) |
| `src/lib/gradient.tsx` | **the ribbon field** — the animated stripe gradient (`RibbonField`, `RibbonBand`, `Grain`) and its palettes. Frame-driven, never rAF |
| `src/lib/cards.tsx` | **the marketing surface** — `HeroCard`/`BigFigure`/`TickMeter`/`BarRows`, `Marquee3D`/`EventCard`, the box pattern (`ChapterBox`, `HighlightBox`, `GridPlate`), `Pill`, and the type helpers (`display`, `tabular`, `microCap`) |
| `src/lib/space.tsx` | **the TRAVELLED register** — one canvas the camera travels: `World`/`useView`, `Node`, `Wire`, `SelectionBox`, `ScaleFrom`, `useTypeCam` |
| `src/lib/agents.tsx` | **the WORKSPACE actors** — `AgentCursors`/`Cursor` (named cursors that cause things), `StatusPill`, `PaletteBar` |
| `src/lib/workspace.tsx` | **the WORKSPACE surfaces** — `PromptBox`, `TaskStream`, `AppWindow` + `blendLooks` (state changes interpolated, never swapped) |
| `src/compositions/TransitionGallery.tsx` | every transition back to back — scrub it to choose one |
| `src/compositions/MotifLab.tsx` | the continuity layer on its own — design the protagonist here first |
| `src/compositions/SpaceLab.tsx` | the world and the camera that travels it — design the layout here first |
| `src/compositions/DemoLab.tsx` | **the WORKSPACE register as a working 20s film** — copy it, don't re-derive the timings |
| `src/compositions/SurfaceLab.tsx` | **the marketing surface on its own** — the field, the hero card, the 3D marquee and the box pattern side by side. Tune the wave clock and the column periods here |
| `src/theme.ts`, `src/fonts.ts` | palettes, type |
| `public/kling/manifest.json` | real clip durations — never guess a shot length |
| `episodes/` | published masters + archived per-episode config |
| `references/station-strip.md` | **the STATION STRIP register (EP13–EP17)** — the default for a teaching episode. Sizing table, the pipeline order, the schedule block, the serpentine, the continuity chip, and the gotchas that each cost a render |
| `references/workspace-film.md` | **the WORKSPACE register** — why it works, the four-beat shape, the cursor rules |
| `references/` | Kling prompt grammar, motion grammar, narration direction, audio notes |
| `.agents/skills/remotion-*` | **the official Remotion skill pack — always loaded before Remotion work** (router: `remotion-best-practices`) |
| `skills-lock.json` | pinned versions of that pack — bump via the `remotion-upgrade` skill |

## Common mistakes

| Problem | Fix |
|---|---|
| Episode feels generic | You shipped the scaffold. Rewrite the beats, use real numbers, real code, real output. |
| Transitions feel off | Beats aren't overlapping, or you used linear interpolation. Springs + per-kind overlap; morph-bridge the 2–3 that matter. |
| Transitions feel cheap | Too many kinds, or accents spent on ordinary beats. 4–5 house kinds, 2 accents, nothing loud. |
| Every page seems to be panning | You put a `camera` on beats that didn't need one. Default is locked; give the *content* the motion. |
| Graphics look flat / computed | No surface under them. Generate a theme element and run it as `Ambient`. |
| **Half the elements on a beat are missing, the other half look fine** | A positioned background (`AbsoluteFill`) is painting OVER the in-flow content beside it — CSS paints positioned descendants above non-positioned ones no matter the DOM order. The survivors are the ones that happened to carry an `opacity < 1`, a `transform` or a `translate`, each of which quietly makes its own stacking context. Wrap the content in `position: relative; z-index: 1`. It looks like a timing bug and it is not. |
| Animated gradient snaps when it starts | A modulation that isn't 0 at t=0. Write it as `cos(x)−1` or `sin(x+p)−sin(p)`. |
| Animated gradient visibly steps | Something is rounded per frame — the angle, the centre, a stop position. Don't quantise any of them. |
| A marquee / gradient is frozen in the render but moved in the browser | It's on a CSS keyframe. CSS animation is wall-clock; derive the offset from `useCurrentFrame()` instead. |
| "The shader background is totally still" | The wave bends the bands in place. Add `drift` — and `spreadMethod="reflect"`, or it scrolls off its own stop list and goes flat. |
| "The grain isn't doing anything" | It's a static tile — the same noise on all 3,000 frames. Re-seed and re-offset per frame from `rand(frame)`. Diff two adjacent frames to prove it. |
| "The cards look sloppy / look AI" | They're labelled rectangles. Use `ProductPanel` with one piece of real data, a truncated edge, and a left-aligned body. |
| "The cards look sloppy" and they already have content | Look at the EDGES. A coloured top/left border is decoration pretending to be information. One black + a 1px hairline for every surface in the film. |
| A code block that just sits there | `Terminal`, typed. Same `start`/`cps` as `TypeCues`. |
| The bed sounds thin / synthetic / like a placeholder | You shipped the offline synth fallback. It exists so a dead network costs a nicer score, not a render — it is not the score. `node music.mjs --gen "<brief>" --plan` on the ElevenLabs key, same as EP13/14. |
| "It's the right gradient but the wrong brand" | You took a reference's palette along with its technique. Keep the machine, take the stops from `DESIGN.md`. |
| Everything arrives at once | No `stagger`, no staged information. The beat should keep delivering across its length. |
| Motion feels loose against the music | No grid. `node tempo.mjs`, then `snapUp` the scene lengths and author camera keys on `barAt()`. |
| Music sounds thin | One flat level. Use `Score` with `open`/`under`, and give the title and end card beats with no VO. |
| Motion feels weightless | No cue layer. `node sfx.mjs`, then `CutCues` + a `tick` on the reveals. |
| Sound design feels noisy | Turn `CutCues gain` to 0.7 before deleting cues; check you haven't sounded the dissolves. |
| Typing sound drifts off the picture | `TypeCues` needs the SAME `start`/`cps` as `useTyped`. |
| Narration sounds like commentary | It's describing, not teaching. `node tts.mjs --check` counts the directive lines; fix the verbs. |
| Cursors are on screen but the film feels aimless | They aren't causing anything. Every cursor owns one visible change; delete the rest. |
| A change happened but felt automatic | Cause and effect landed on the same frame. Put the effect ~0.2s (6 frames) after the `act` key. |
| The restyle looks like a slide changing | You swapped a look instead of blending it. `changes` + `blend`, and match everything else on the frame via `blendLooks`. |
| The workspace film has no ending | No `StatusPill`. Without the state machine it just stops. |
| Kling clip has garbled text in it | Never let Kling render text. Re-prompt with text in the negative; put the words on in Remotion. |
| Warped first half-second of a shot | `startAt: 0.3–0.5` on `KlingClip`. |
| Scene outlives its footage | `shotSeconds(id)` caps the beat, or generate a 10s clip. Black frames are unforgivable. |
| VO cut off at a scene end | Scene seconds < VO + lead. Re-time from `vo-durations.json`. |
| Render is silent | `audio.vo` / `audio.music` still `false` in the config. |
| The music stops dead under the end card, but the bed's duration looks right | ElevenLabs Music returns LESS audio than the plan asks for and pads the rest of the file with true digital silence. Ask for ~20% more than the runtime, then prove it: `ffmpeg -ss <runtime-3> -t 3 -i bed.mp3 -af volumedetect -f null -`. Near −90dB is padding, not music. |
| A good bed got replaced by a thin synth one and nobody asked for it | `node music.mjs --help` is not a recognised flag — it falls through and GENERATES. Use `--list`. |
| `durationInFrames must be an integer, but got NaN` in an episode you did not touch | `vo-durations.json` is ONE shared file. A new episode with fewer VO lines makes `durs[n]` undefined for every older composition in `Root.tsx`. Point each shipped episode at its own archive: `import durs from "../../episodes/<slug>/vo-durations.json"`. |
| A beat is flagged static AND its line is flagged `⚠ dragging` | Same defect, seen twice. Tighten the LINE — drop a held `…`, cut a subordinate clause — and re-record just that scene (`node tts.mjs 6 8`). The beat shortens, the picture needs no change. |
| Vertical cut looks broken | Wide diagrams don't shrink — author a vertical variant for those beats. |
| ffmpeg "Abort trap 6" | You used the `@remotion/compositor` binary. Use `@ffmpeg-installer`'s. |

## Verify before claiming done

Right title, intentional beats, footage that belongs to the palette, transitions
that carry motion through the cut, narration audible on every scene, music
ducked under it, no collisions, no dead air, next episode named. If you haven't
looked at the contact sheet AND the boundary stills, it isn't done.

Then the four this kit exists to enforce, each of which you can check:

- **Count the camera moves.** More than three and the film pans. `grep camera:`
  the composition.
- **Count the transition kinds.** More than six, or more than three accents, and
  the cutting is showing off.
- **`node tts.mjs --check` is quiet** on hedges, long sentences and the directive
  count — the read teaches rather than describes.
- **Every graphics act has a surface** — an `Ambient` plate under it, and you
  can't point at it.
- **You have HEARD it** — every cue attached to something that moves, nothing
  competing with the voice, the bed lifting where nobody speaks, and at least
  two beats left deliberately silent.
- **You have WATCHED it** — `node review.mjs`, in Chrome, every beat, sound on.
  Stills are not watching. If you skipped step 9b, it isn't done.
- **WORKSPACE only — every cursor causes something.** Park the film on any
  second and ask what each cursor on screen is for. If the honest answer for any
  of them is "nothing", it is decoration and it goes.
