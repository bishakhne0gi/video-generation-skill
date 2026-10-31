---
format: 1920x1080
duration: 99s
message: "Origin launched as a mirror with GitHub designated the source of truth, on the day GitHub returned errors for seven and a half hours. Commits are content-addressed, so they merge. Pull requests, comments and checks live in one database, and do not."
arc: "The status page going amber → Title → What Origin is → The mirror with a designated primary → Naming the shape → The primary fails → The real boundary: content vs metadata → Why agent-first → Takeaway"
audience: "working developers who use GitHub every day and have never had to design a replica of it"
mode: autonomous
music: tense-modern-electronic-pulse-restrained
---

## Video direction

**Register (from `DESIGN.md`): maximalist claymorphism + glassmorphism.**
Clay is the furniture, glass is the type surface. One ground for all nine
frames — `--void`, a deep indigo-plum — because a frame already carrying five
saturated hues cannot also carry a shifting field. The film breathes in value
through **how much clay is lit and how close it is**, not through the canvas:

sparse clay → dense clay (title) → sparse → two clay masses → two masses lit →
**one mass failing, the rest drained** → clay split in half → clay reassembled →
all five, closest.

**Every word in the film is on glass.** That is a legibility rule before it is a
style rule: `backdrop-filter` samples whatever clay is behind it, and clay moves,
so type set directly on the field has no bounded contrast. Glass at 0.76 opacity
bounds the worst case at 8.61:1 for `--ink`. The only type off glass is a short
dark label on a clay chip, where the measured floor is 7.07:1.

**The metaphor is a working model, not decoration.** Each clay hue is a node and
keeps its assignment for the whole film:

| Clay | Is |
|---|---|
| amber | GitHub — the designated source of truth |
| lilac | Cursor / Origin — the mirror |
| sky | the sync channel between them |
| mint | healthy, reconciled state |
| **coral** | **`origin/pr-118`, and the failure state** |

**The current is LEFT.** Every ordinary seam is a cut-the-curve travelling left:
exit `x −238` on `power4.in` (which ends at peak velocity, so the cut lands
mid-motion), entry from `+302` — 127% of the exit travel — on `power4.out`.
Zero overlap; the outgoing stage is hard-killed at the cut.

Three reserved vectors, spent once each, never adjacent:

| Seam | Cut | Vector | Meaning |
|---|---|---|---|
| 1 → 2 | status → title | x −1 (the current) | next beat |
| 2 → 3 | title → origin | x −1 (the current) | next beat |
| 3 → 4 | origin → mirror | x −1 (the current) | next beat |
| **4 → 5** | mirror → shape | **z +1 (zoom-through)** | deeper into the same thought — the diagram becomes the thing it is an instance of |
| 5 → 6 | shape → failure | x −1 (the current) | next beat |
| **6 → 7** | failure → boundary | **z −1 (inverse zoom)** | **ARRIVAL — the thesis: commits merge, metadata does not** |
| 7 → 8 | boundary → agent | x −1 (the current) | next beat |
| **8 → 9** | agent → takeaway | **y −1 (up)** | elevation into the conclusion |

**The Z-sign rule.** Both halves of a Z seam share the sign of the scale
velocity, or the seam reads as a bounce. Zoom-through (+1): the exit grows past
1.0, the entry starts **below** 1.0 and grows. Inverse zoom (−1): the exit
shrinks below 1.0, the entry starts **above** 1.0 and settles.

Recorded in `ledger.json`, verified numerically with `seam-gate.mjs verify`.

**Continuity object — one pull request.** `origin/pr-118`, a mono string in a
fully rounded glass pill pinned bottom-left from frame 4 to frame 9. The id never
moves; only its state word changes, in `--coral`, and every state is something
the film has just shown:

**opened** (f4, on Origin) → **mirrored** (f5, it now exists twice) →
**stalled** (f6, the authority is erroring) → **held** (f7, its commits merged
and its review state did not) → **readable** (f8, the merge state is data) →
**reconciled** (f9).

**Camera budget: two moves.** The zoom-through at 4 → 5 and the inverse zoom at
6 → 7. Both are seams, both are content. Every other frame is locked, and motion
comes from staged arrival and running systems.

**Scheduled stillness:** the last ~1.0s of frames 1, 6 and 7. Three holds, each
before or after a reserved vector.

**Sourcing rule.** Every figure on screen is sourced in `CREDITS.md`. Anything
that is inference rather than Cursor's own published description is marked on
screen as a question or a general shape, never as a statement about Origin's
internals — Cursor has published no architecture.

---

## Frame 1 — The status page

- status: animated
- src: compositions/frames/01-status.html
- duration: 10.0s
- transition_in: cut
- scene: a GitHub status board degrading service by service while an outage counter runs
- voiceover: "Seventeenth of August. Thirteen forty UTC. GitHub starts returning errors, and it does not stop for seven and a half hours."
- type: hook
- persuasion: A familiar surface failing in front of you, then the number that says it was not a one-off
- beat: recognition
- focal: the status rows flipping
- roles: glass status board = foreground subject · clay = ground · figure panel = supporting
- sfx: tick per row, blip per state flip
- register: sparse clay, two glass panels
- assets: public/img/logo-github.png (supplied)

Scene 1 (0.0–1.2s): four clay masses settle in with a `back.out(1.3)` overshoot.
They have visible weight, so they arrive and rock back rather than snapping.
Scene 2 (0.5–3.0s): the status board slides in from the left and fills — logo,
`STATUS`, `13:40 UTC`, a rule drawing out, then six service rows 0.13s apart.
Scene 3 (3.0–5.4s): the running system. Each row degrades on its own cue —
mint → amber → coral, the state word rewriting under it. API and Actions first,
Pull Requests to MAJOR OUTAGE, then Pages, Webhooks, Copilot.
Scene 4 (4.6–8.6s): the second panel arrives and `257` counts for 3.2 seconds —
long, so the beat is still delivering when the line ends. The coral `20% ERROR
RATE` chip pops in on `back.out(1.6)`.
Scene 5 (8.6–9.66s): still. Scheduled stillness.

**Sustained motion:** the degrade cascade, then the count. They do not overlap.

---

## Frame 2 — Title

- status: animated
- src: compositions/frames/02-title.html
- duration: 5.5s
- transition_in: cut-the-curve left
- scene: the title on the densest clay in the film, both logos below it
- voiceover: (none — the bed lifts here)
- type: title
- persuasion: Name the episode after the failure mode, not the product
- beat: framing
- focal: the word AUTHORITY
- roles: title plate = foreground subject · clay field = ground · logo row = supporting
- sfx: thunk on the plate landing
- register: densest clay of the film
- assets: both supplied logos

Scene 1 (0.0–0.43s): the title plate enters from `+302` on `power4.out`,
carrying the cut. It is at full opacity from frame zero — the carrier has to be
visible mid-flight, not fading up behind its own travel.
Scene 2 (0.4–2.2s): five clay masses converge behind it, staggered, the densest
arrangement in the film.
Scene 3 (2.0–4.4s): `EP 25` mono kicker, the two-line title, then the logo row —
Cursor and GitHub side by side on one glass strip, separated by a `⇄`.
Scene 4 (4.4–5.16s): still.

---

## Frame 3 — What shipped

- status: animated
- src: compositions/frames/03-origin.html
- duration: 12.0s
- transition_in: cut-the-curve left
- scene: the Codebase tab — a pull request being reviewed without leaving the editor
- voiceover: "That same day, Cursor shipped Origin. Git hosting inside the editor. Browse the repository, open the pull request, review it, merge it, without leaving."
- type: explanation
- persuasion: Show the product doing the thing, with real-looking data, before arguing about it
- beat: orientation
- focal: the PR row
- roles: editor window = foreground subject · clay = ground · verb chips = supporting
- sfx: click on each verb chip
- register: sparse clay, one large glass window
- assets: public/img/logo-cursor.png (supplied)

Scene 1 (0.0–0.43s): the window carries the cut in from the right.
Scene 2 (0.4–3.0s): the window fills — a sidebar with a file tree, a `Codebase`
tab lighting, then the PR header `origin/pr-118 · Add retry budget to sync
worker`.
Scene 3 (3.0–7.4s): four verb chips arrive on their spoken cues — `BROWSE`,
`OPEN`, `REVIEW`, `MERGE` — each one lighting a different region of the window
as it lands, so the chips are labelling something rather than sitting beside it.
Scene 4 (7.4–11.0s): a diff hunk types into the review pane at 64 cps, with a
caret riding the write head.
Scene 5 (11.0–11.66s): still.

**Sustained motion:** the chip cascade, then the diff typing.

---

## Frame 4 — The mirror

- status: animated
- src: compositions/frames/04-mirror.html
- duration: 12.5s
- transition_in: cut-the-curve left
- scene: two clay masses, a bidirectional sync channel, and a stamp landing on one of them
- voiceover: "But look at how it starts. Your GitHub repository syncs in. GitHub stays the source of truth. Pushes route back to it, and both sides update in real time."
- type: mechanism
- persuasion: The whole episode turns on one stamp — show it landing, do not narrate it
- beat: the setup
- focal: the SOURCE OF TRUTH stamp
- roles: the two masses = foreground subject · the channel = supporting · clay ground = ground
- sfx: whoosh per packet, thunk on the stamp
- register: two clay masses, balanced
- assets: both supplied logos

Scene 1 (0.0–0.43s): the amber mass carries the cut in from the right.
Scene 2 (0.4–2.6s): amber (GitHub) settles left, lilac (Origin) settles right,
each with its logo on a small glass plate.
Scene 3 (2.6–5.4s): the sky channel draws between them, then packets run it —
right-to-left and left-to-right, continuously, on a 1.9s loop. This is the
running system and it never stops for the rest of the frame.
Scene 4 (5.4–8.2s): the `SOURCE OF TRUTH` stamp lands on amber with a
`back.out(1.7)` overshoot and a scale settle. The pill `origin/pr-118 · opened`
mounts bottom-left.
Scene 5 (8.2–11.0s): a glass caption strip states the three facts in Cursor's own
words: repos sync in, GitHub stays authoritative, updates are bidirectional.
Scene 6 (11.0–12.04s): the packets keep running. Nothing else moves.

---

## Frame 5 — Name the shape

- status: animated
- src: compositions/frames/05-shape.html
- duration: 11.0s
- transition_in: **zoom-through (z +1)** — the diagram becomes the general case
- scene: the same two masses, relabelled as the general primary/replica problem
- voiceover: "Name that shape. Two systems accepting writes, one of them holding authority. Every replicated system you have ever run has this exact problem."
- type: teaching
- persuasion: Move from the specific product to the pattern the viewer already owns
- beat: the lift
- focal: the two labels changing
- roles: the label plates = foreground subject · the masses = supporting
- sfx: tick on each relabel
- register: two clay masses, lit

Scene 1 (0.0–0.46s): entry from `scale 0.80` growing to 1.0 — **below** 1.0 and
growing, matching the sign of the outgoing frame's push-in.
Scene 2 (0.5–3.0s): the two masses are in the same places they were, which is the
point of a zoom-through. Their glass name plates cross-fade: `GITHUB` → `PRIMARY`,
`ORIGIN` → `REPLICA`.
Scene 3 (3.0–6.4s): three examples arrive as glass chips beneath, 0.16s apart —
`Postgres + read replica`, `Kafka mirror`, `multi-region cache`. Each is a system
the audience has run.
Scene 4 (6.4–9.2s): one line lands on glass: `Two writers. One authority.`
Scene 5 (9.2–10.66s): the pill flips to `mirrored`. Still otherwise.

---

## Frame 6 — Break it

- status: animated
- src: compositions/frames/06-failure.html
- duration: 12.0s
- transition_in: cut-the-curve left
- scene: the authority erroring, and the mirror's three choices laid out as clay cards
- voiceover: "Now break it. The authority is returning one request in five as an error. Your mirror has three choices. Refuse the write, queue it, or diverge."
- type: mechanism
- persuasion: Three options, all bad in different ways — the viewer picks, and is now invested
- beat: the tension
- focal: the three cards
- roles: three clay cards = foreground subject · the failing mass = supporting
- sfx: a dropped-packet blip, thunk per card
- register: **one mass failing, the rest drained** — the film's lowest chroma

Scene 1 (0.0–0.43s): carries the cut in from the right.
Scene 2 (0.4–2.8s): amber drains toward coral. The channel's packets start
failing — one in five turns coral and falls out of the line rather than arriving.
That ratio is the number the narration is saying, shown rather than stated, and
it keeps running for the whole frame.
Scene 3 (2.8–7.6s): three clay cards land 0.42s apart — `REFUSE THE WRITE`,
`QUEUE IT`, `DIVERGE` — each with its own one-line cost on glass beneath.
Scene 4 (7.6–10.2s): the pill flips to `stalled`.
Scene 5 (10.2–11.66s): still, the failing packets still running. Scheduled
stillness before the film's one arrival.

---

## Frame 7 — The real boundary

- status: animated
- src: compositions/frames/07-boundary.html
- duration: 15.0s
- transition_in: **inverse zoom (z −1)** — ARRIVAL, the thesis
- scene: the frame splits in half — content on the left, metadata on the right
- voiceover: "Here is the line that matters. Commits are content addressed, so any two copies merge themselves. Pull requests, comments and checks are not. That state lives in one database, and there is only one."
- type: thesis
- persuasion: A single vertical line, and everything the viewer knows sorts itself onto one side
- beat: the payoff
- focal: the dividing rule
- roles: the split = foreground subject · both columns = supporting
- sfx: thunk on the rule landing, tick per item
- register: clay split in half

Scene 1 (0.0–0.46s): entry from `scale 1.18` settling to 1.0 — **above** 1.0 and
shrinking, matching the sign of the outgoing frame's recede.
Scene 2 (0.4–2.2s): a rule drops down the centre of the frame and the two clay
masses part around it. The longest single move in the film.
Scene 3 (2.2–6.6s): the left column fills with what merges — `commits`, `trees`,
`blobs`, `tags` — each with its SHA on glass, each landing with a mint tick.
Scene 4 (6.6–11.0s): the right column fills with what does not — `pull requests`,
`review comments`, `check runs`, `issue state` — each landing coral, each
labelled `one row, one database`.
Scene 5 (11.0–13.4s): the pill flips to `held`, and the line lands on glass
across the bottom: `Your code survived. Your workflow did not.`
Scene 6 (13.4–14.66s): still.

---

## Frame 8 — Why rebuild it

- status: animated
- src: compositions/frames/08-agent.html
- duration: 11.0s
- transition_in: cut-the-curve left
- scene: a unified diff on the left, the same change as structured merge state on the right
- voiceover: "Now the reason to rebuild any of this. A diff is a rendering, made for your eyes. An agent needs the merge state as data. That is the whole bet."
- type: argument
- persuasion: Show the same fact twice, once for a human and once for a machine
- beat: the turn
- focal: the transform from diff to structure
- roles: the two panes = foreground subject · clay = reassembling ground
- sfx: type cues under the diff, a blip on the transform
- register: clay reassembled

Scene 1 (0.0–0.43s): carries the cut in from the right.
Scene 2 (0.4–3.4s): the left pane holds a real unified diff — `@@ -14,7 +14,9 @@`
with two changed lines, coloured the way every diff the viewer has read is
coloured.
Scene 3 (3.4–7.2s): the right pane resolves the same change as a structured
record — a merge-state object with `base`, `head`, `conflicts: []`,
`checks: passing`, `semantic: rename`. Each key lands 0.15s apart.
Scene 4 (7.2–9.6s): one line on glass: `Cursor's pitch: machine-readable merge
state.` — attributed, because it is their claim and not a measurement.
Scene 5 (9.6–10.66s): the pill flips to `readable`.

---

## Frame 9 — Takeaway

- status: animated
- src: compositions/frames/09-takeaway.html
- duration: 10.0s
- transition_in: **elevation (y −1)** — up into the conclusion
- scene: three instructions on glass over the fullest clay field in the film
- voiceover: "Mirror the content. Name the authority. Decide in advance what happens when it goes dark. Next episode, subagents."
- type: takeaway
- persuasion: Three imperatives the viewer can apply to a system that is not Origin
- beat: release
- focal: the three lines
- roles: the three lines = foreground subject · clay = ground · end card = supporting
- sfx: tick per line, success on the pill reconciling
- register: all five clays, closest to camera

Scene 1 (0.0–0.5s): entry from below, `y +250` on `power4.out`, carrying the
elevation.
Scene 2 (0.5–5.4s): the three instructions land 0.9s apart on one glass column.
Scene 3 (5.4–7.4s): the pill flips to `reconciled` in mint — the only time the
continuity object leaves coral, and the film's only `success` cue.
Scene 4 (7.4–10.0s): the end card — `EP 26 · SUBAGENTS` — and the tail runs
silent so the bed lifts under it.
