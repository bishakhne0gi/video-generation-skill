# Narration — directing the read

The house voice for this playlist is **directive**. The narrator knows the
thing, and is handing it to you in order, without hedging. Not a podcaster being
wry about it. Not a trailer voice selling it. Not a storyteller withholding the
reveal — *an instructor*, with the confidence that comes from having actually
built the thing.

That register is made in the WRITING. The model choice only protects it.

Everything here is authored in `episode.config.json → vo` and applied by
`tts.mjs`. Lint before you record:

```bash
node tts.mjs --check        # hedges, long sentences, register, pace — records nothing
node tts.mjs --audition 3   # scene 3, four readings, pick one
```

## The model is settled: `eleven_multilingual_v2`

| Model | Tags | Use |
|---|---|---|
| `eleven_multilingual_v2` | **spoken aloud** | **the series voice.** Steady, even, cheap. No tags, ever. |
| `eleven_v3` | performed | a deliberate departure from the series. `--check` warns. |
| `eleven_flash_v2_5` | spoken aloud | drafts and timing passes only — a scratch track. |

v2 *cannot* perform audio tags — it reads them out loud, and `tts.mjs` refuses
to record a tagged line rather than hand you sixteen files saying "open bracket
whispers". That refusal is the point: it makes "no modulation" a structural
guarantee instead of a setting that drifts between episodes. v2 also gets
`previous_text`/`next_text` continuity, which v3 lacks, so one register holds
across all eighteen lines.

```json
"voiceModel": "eleven_multilingual_v2",
"voiceSettings": { "stability": 0.72, "similarity_boost": 0.85, "style": 0.05, "use_speaker_boost": true },
"voiceSeed": 4242
```

High stability, style near zero: the same person, at the same energy, for the
whole episode. If the read comes back *mechanical* rather than *even*, drop
stability toward 0.5 — not below. `voiceSeed` makes re-records deterministic, so
fixing scene 9 doesn't change how scene 9 sits against 8 and 10.

Pick a voice with a **narrow, even range**. A wide-range voice reads a directive
script as though it were withholding something.

## Writing the directive read

### Instruct, don't observe

The difference is whether the listener is being handed the thing or told about
it. `--check` counts the lines that do the first and complains if too few do.

| Observing | Instructing |
|---|---|
| "The queue starts to back up here." | "Watch the queue. It backs up here." |
| "This is where most systems fail." | "This is where you'll break it first." |
| "There's a trade-off involved." | "You're trading latency for durability. Pick one." |
| "It turns out the shuffle was fine." | "The shuffle was fine. The problem is upstream." |

Second person and instruction verbs — *watch, notice, count, start, assume,
forget, remember* — are the markers. Not every line needs one; roughly a quarter
does, or the script has drifted into commentary.

### State it or cut it

Every hedge is the narrator declining to know the thing they are explaining, and
the authority of the whole read leaks out of it. `--check` flags them: *maybe,
perhaps, sort of, kind of, I think, probably, arguably, somewhat, more or less.*
Delete the hedge and keep the claim. If the claim isn't true without the hedge,
the claim is what needs fixing.

Same for exclamation marks. This voice never raises. The fact carries it.

### One clause, one line

A teaching sentence is short enough that the listener never has to hold it open.
The moment a line needs its second comma it needs a full stop instead. `--check`
flags any sentence over 20 words.

```
Most systems scale for a curve. This one scales for a cliff.
```

Two statements. No conjunction, no subordinate clause, nothing to track. That is
the register.

### Front-load the subject

Subordinate clauses first make the model guess the intonation, and guess wrong.
"When traffic spikes, the queue backs up" comes out as a question hanging in the
air. "The queue backs up when traffic spikes" comes out as a fact.

### Definition, then consequence

The move that makes an episode feel like teaching rather than a tour: name the
thing, then say what it costs. Two lines, in that order, every time.

```
This is back-pressure. The queue tells the producer to slow down.
Get it wrong and you don't drop requests… you drop the whole node.
```

### Then the mechanics

- **Spell numbers out.** "twenty fourteen", not "2014". "nought point nine
  three", not "0.93". Digits are where models most reliably embarrass you.
- **Space acronyms only when the natural read is wrong** — "M C P", "U K". Check
  the clip; over-spacing sounds robotic.
- **Write contractions.** "It wasn't" reads human, "It was not" reads legal.
- **Lines are 12–24 words.** Past ~26 the listener stops hearing sentences.
- **Read every line aloud.** If you stumble on it, the model will too.

## Punctuation — the only performance control you get

This works on every model and costs nothing. On v2 it is the *entire* lever.

| You write | You get |
|---|---|
| `…` | a held beat — the pause before the thing you want landed |
| line break | a longer beat — a paragraph break in the read |
| `,` | a breath |
| `.` instead of `,` | a harder stop; short sentences pace better than long ones |
| `ALL CAPS` | stress on that word |

```
The shuffle was Fisher-Yates. Every possible ordering exactly equally likely.
Provably uniform. There was NO bug.
```

Three full stops and one stressed word. Nothing else needed.

An even read still needs somewhere to land — `--check` complains if under a
fifth of the lines hold a beat at all. Level is not the same as unpunctuated.

## The arc — what changes when the delivery doesn't

A directive voice doesn't swing between registers; the *structure* does the work
instead. Map it to the beat:

| Beat | What carries it |
|---|---|
| Cold open | short sentences, a concrete fact, no wind-up. Never a rhetorical question |
| The claim | flat and declarative. Let the fact be the fact |
| The turn | `…` before the pivot, ALL CAPS on the word that turns it |
| Chapter slate | four to six words. Structure, not performance |
| The evidence | steady and unhurried. Full stops; resist speeding up |
| The mechanism | definition, then consequence — the two-line move above |
| The payoff | the number, alone, in its own sentence |
| The honest limitation | same voice, shorter sentences. Don't soften it |
| Close | one instruction the viewer leaves with, then stop |

The most common failure in this register is the script sliding into
description — eighteen lines *about* a system, none of them handed to anyone.
`--check` catches it; re-read the "Instruct, don't observe" table and fix the
verbs.

## Pace — measure SYLLABLES, not words

`tts.mjs` prints both, and flags on the syllable rate.

- **3.5–4.5 syll/s** — documentary narration. Aim here.
- **> 5.0** — genuinely rushed. Add a full stop, or cut a clause.
- **< 3.0** — dragging. Cut words; don't slow the picture to match.

**Why not words per minute.** This register is deliberately built from short
words, and wpm punishes exactly that. EP11's claim line — "a GPU runs out of
MEMORY long before it runs out of maths" — is nineteen monosyllables. It scores
200 wpm and sounds perfectly measured, because its syllable rate is 4.2. On the
first pass of that episode, four of twelve lines flagged as rushed on wpm and
**none** of them were rushed on syllable rate; three re-recording passes were
spent before anyone checked whether the metric was right. wpm is still printed,
for continuity with the earlier episodes, but it is not what to act on.

Levers that actually change the rate, in order:

1. **A full stop.** Hard stop, real pause.
2. **An ellipsis.** A held beat mid-line.
3. **A line break — on v2, close to nothing.** Measured: adding two line breaks
   to a line changed its duration by 0.00s. Don't spend a re-record on one.

## Auditioning

```bash
node tts.mjs --audition 3
```

Four takes of scene 3 into `public/audio/vo/audition/`: as-written, instructor,
level and held. The spread is deliberately narrow — you are finding the right
instructor, not a performance. Listen to all four, then put the winner's text
and settings back into `episode.config.json`. Finding a delivery by re-recording
the whole episode and hoping is how you burn credits without learning anything.
