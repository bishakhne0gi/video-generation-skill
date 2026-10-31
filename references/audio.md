# Audio — narration and score

## Narration (ElevenLabs)

Lines live in `episode.config.json → vo`. One line per scene, 12–24 words,
spoken register. Read every line aloud before recording it: if you stumble, the
model will too.

| Voice | id | Register |
|---|---|---|
| Daniel | `onwK4e9ZLuTAKqWW03F9` | British, authoritative — documentary. Default for the series. |
| Brian | `nPczCjzI2devNBz1zQrb` | US, deep — trailer / launch episodes |
| Charlie | `IKne3meq5aSn9XLyUdCD` | Australian, conversational — tutorial episodes |

Keep ONE voice across the playlist. Settings that work for tech narration:
`stability 0.42, similarity_boost 0.8, style 0.2, speaker_boost on` on a v2
model. Higher stability flattens the read; higher style makes it theatrical.

**Directing the performance — pauses, emphasis, emotion — is
`references/narration.md`.** That's where the retention is: a correct script
read flat still loses the viewer at 0:20. Read it before you record.

Writing tricks that survive TTS:
- Spell out what the model will mispronounce: "N times M", "U K eight and a
  half", "three hundred milliseconds".
- **Spell numbers out** — "twenty fourteen", not "2014". Digits are where models
  most reliably embarrass you. `tts.mjs --check` flags them.
- Full stops instead of commas. Short sentences pace better than punctuation.
- Acronyms are safer spaced ("M C P") only if the natural read is wrong — check
  the clip before committing.

```bash
node tts.mjs            # missing lines only
node tts.mjs --check    # lint pace / length / tags, record nothing
node tts.mjs --audition 4   # scene 4, four readings, pick one
FORCE=1 node tts.mjs    # everything
node tts.mjs 4 7        # scenes 4 and 7
```

`vo-durations.json` is regenerated every run and is the source of truth for
scene timing.

## Sound design — the layer that actually holds attention

A motion graphic without sound is half a motion graphic. **The eye reads an
arrival as an event only when the ear confirms it.** That is the mechanism
behind the videos that hold people — not louder music and not more animation. A
card lands: tick. A command types: key taps. A chapter turns: a whoosh arriving
in a thunk. A number resolves: a notification. Nobody notices any of it; they
notice that they didn't look away.

```bash
node sfx.mjs            # synthesise this episode's cue set
node sfx.mjs --list     # registers and cues
node sfx.mjs --register neon
```

Sixteen cues, synthesised offline and deterministically into
`public/audio/sfx/`. Nothing to license, nothing to download, and — the point —
**the cue set belongs to the episode's register**, because a wooden knock under
a neon-grid film is a wrong note and stock libraries make every video sound like
every other video.

| Register | Material | Themes |
|---|---|---|
| `terminal` | dry, digital, close | `terminal-dark`, `uber-dark` |
| `editorial` | softer, woodier, paper in the noise | `white-light`, `zomato-cream` |
| `neon` | bright, saturated, synthetic | `neon-grid` |
| `warm` | analogue, tape-ish, rounded | `warm-paper` |

It picks itself from `theme`; override with `"sfxRegister"` in the config.

### The cues, and what each is for

| Cue | Put it on |
|---|---|
| `tick` | an element landing — the workhorse; most reveals get this |
| `click` | a pointer action, a UI state change |
| `key1`–`key4` | one keystroke; four variants so typing doesn't machine-gun |
| `blip` | one increment of a counter — very quiet, there are dozens |
| `notify` | a value arriving, a step completing |
| `success` | the payoff, once |
| `error` | the failure mode / the honest-limitation beat |
| `whoosh` | a cut that moves — push, wipe, iris |
| `swipe` | harder: a whip, a speed ramp, a cross-zoom |
| `thunk` | weight — a slate landing, a stamp, an act break |
| `sub` | felt not heard, under a title or a full-frame image |
| `riser` | tension into a reveal — and it MUST resolve into something |
| `latch` | a chapter or a state locking in |

### Placing them (`src/lib/sound.tsx`)

```tsx
<Timeline beats={BEATS} pal={PAL} />
<CutCues beats={BEATS} />                                  {/* every cut that earns one */}
…
<Cue name="notify" at={26} volume={0.4} />                  {/* inside a beat */}
<TypeCues text={CMD} start={7} cps={55} />                  {/* under a type-on */}
<CountCues from={4} dur={40} steps={10} />                  {/* under a counter */}
```

`CutCues` reads the beat list and sounds each transition by kind — and
**deliberately sounds none of the soft ones**. A dissolve, a fade, a luma-wipe
and a defocus get silence: a whoosh there says "something moved" while the
picture says "time passed", which is the classic amateur note. `gain` scales the
whole layer; try `0.7` before you start deleting cues.

`TypeCues` must get the *same* `start` and `cps` you gave `useTyped`, or the
sound drifts off the picture — worse than no sound at all.

### Three rules

1. **Every cue is attached to something that moves.** A sound with nothing on
   screen to explain it is the fastest way to sound cheap.
2. **Nothing competes with the voice.** Cues live at 0.2–0.5; the levels in the
   `Cue` docstring are ceilings, not targets.
3. **Silence is a cue too.** If every beat has sound, none of them land. Two or
   three beats an episode earn the `sub`, the `riser` and the `success`.

## Score

```bash
node music.mjs --list                                          # engines + moods
node music.mjs --gen "slow strings, low tension" --seconds 95  # generated to a brief
node music.mjs --gen "slow strings" --plan                     # generated, sectioned to the arc
node music.mjs --engine stable-audio --gen "warm analogue pad" # generated locally, free
node music.mjs --search "ambient technology" --seconds 95      # CC0 from Openverse
node music.mjs --mood dark-tech --seconds 95                   # synthesised
```

Four engines. Every one falls back to the synth bed rather than leaving you
without a score, and every one rewrites `public/audio/music/CREDITS.md` so the
provenance always matches the file that's actually there.

| Engine | Cost | Length | Why |
|---|---|---|---|
| `elevenlabs` | credits, **same key as the VO** | to 10 min | The only engine that writes to a *brief*. `--plan` sections it to the episode's real VO timing — cold open / evidence / turn / land — so the bed changes where the film changes. |
| `stable-audio` | **free forever**, local | 47s loop | Stable Audio Open. No key, no quota, no network after install. Trained only on CC0 / CC-BY audio; Community Licence permits commercial use under $1M revenue. One-time ~4GB install. |
| `openverse` | free | whatever exists | Real CC0 recordings. Instant, but you take what you're given. |
| `synth` | free | any | Additive pads + sub + optional pulse, offline and deterministic. Nothing to clear, always available. |

**Which to use.** `--gen` with ElevenLabs for the episode you care about — a bed
written to "hold back until the turn, then open" is worth the credits. Set
`stable-audio` up once if you're making these weekly and want the marginal cost
to be zero. `synth` is not a consolation prize: it's deterministic and any
length, which is exactly what you want for a scratch mix while you're still
cutting.

**Write briefs, not moods.** `"slow documentary strings, low tension,
restrained"` beats `"sad"`. The negative styles matter more than the positive
ones — `music.mjs` already forces *no vocals, no lyrics, no prominent melody, no
sudden dynamic jumps* on every generated bed, because those four are what make a
score fight the narration instead of carrying it.

| Mood | Fits |
|---|---|
| `dark-tech` | default for the series — low, pulsing, engineering |
| `cinematic-hopeful` | payoff-heavy episodes, product launches |
| `driving-build` | tutorials, "let's build it" |
| `calm-focus` | deep explainers, long code beats |
| `mystery` | vulnerabilities, incidents, "what went wrong" |

### The bed needs TWO levels, not one

A score that sounds thin is almost never fixed by one bigger number. A flat
`0.17` is right under the voice and far too quiet everywhere else, so the title,
the montage and the end card all sound like the middle of a paragraph — the
music never lifts, and the film never feels scored.

`Score` (`src/lib/sound.tsx`) fixes it by ducking off the real edit:

```tsx
<Score src={cfg.music.file} beats={BEATS} vo={durs} open={0.34} under={0.15} />
```

The bed sits at `open`, drops to `under` while a line plays, with a 10-frame
slope either side. The windows are derived from the same layout `Timeline` uses,
so they cannot drift out of sync with the cut.

Consequence worth designing around: with a 0.35s breath the lines nearly abut,
so the bed only really opens on **beats that have no `vo`** — measured, a 0.9s
gap between two lines lifts about 3dB, a silent beat lifts the full 7. That is
an argument for giving the title, the turn and the end card a beat of their own.
Those silences are where the score gets to be music.

## Mix

| Layer | Volume |
|---|---|
| Narration | `1.0` |
| Bed under narration (`under`) | `0.14–0.18` |
| Bed where nobody speaks (`open`) | `0.30–0.40` |
| SFX — tick / click / key | `0.22–0.35` |
| SFX — whoosh / notify / latch | `0.30–0.50` |
| SFX — thunk / sub (2–3 an episode) | `0.40–0.55` |
| Kling clip audio | muted, always — it is never usable |

The bed loops (`<Audio loop>`), so generate it a little shorter than the film
rather than longer; a loop point under narration is inaudible, a hard stop is
not.

Other CC0 / free sources when you want something specific and Openverse comes up
short: Free Music Archive (filter CC0), Pixabay Music, Incompetech (CC-BY —
attribution required, so log it), and the Internet Archive's public-domain
collections. Always record what you used in `CREDITS.md`.
