---
format: 1920x1080
duration: 80s
message: "Authentication proves who you are. Authorisation decides what you may touch. Skipping the second is the #1 security risk on the web."
arc: "Hook (the door) → Title → AuthN (the desk) → AuthZ (the lock, the thesis) → The naming trap (401/403) → The route (the bug and the one-line fix) → What it costs (OWASP A01) → Takeaway"
audience: "working developers who ship APIs and web apps"
mode: autonomous
music: tense-minimal-editorial
---

## Video direction

**Register rhythm (from `frame.md`, the supplied section rhythm):**
paper → **fire** → paper → paper → paper → **dark** → paper → **deep**.
One dominant ground per act, so the value change arrives *with* the cut rather
than as one. The two full-bleed colour bands (frame 2 orange, frame 8 black) are
also the two silent frames — the bed lifts exactly where the picture changes
temperature.

**The current is LEFT.** Every ordinary seam is a cut-the-curve travelling left:
exit `power4.in`, entry `power4.out`, entry travel ≈127% of exit, the cut landing
mid-motion on both sides, outgoing side hard-killed at the cut. Three reserved
vectors, spent once each and never adjacent:

| Seam | Cut | Vector | Meaning |
|---|---|---|---|
| 1 → 2 | door → title | x −1 (the current) | next beat |
| 2 → 3 | title → desk | x −1 (the current) | next beat |
| **3 → 4** | desk → lock | **z −1 (inverse zoom)** | **ARRIVAL — the thesis lands: a valid card is refused** |
| 4 → 5 | lock → 401/403 | x −1 (the current) | next beat |
| **5 → 6** | 401/403 → route | **z +1 (zoom-through)** | deeper into the same thought — concept into implementation |
| 6 → 7 | route → cost | x −1 (the current) | next beat |
| **7 → 8** | cost → takeaway | **y −1 (up)** | elevation into the conclusion |

Recorded in `ledger.json` and verified numerically with
`seam-gate.mjs verify` — no seam ships on the strength of scrubbing.

**Continuity object — the HTTP status.** A mono numeral in a fully-rounded pill,
pinned bottom-left from frame 1 to frame 7, never moving. Only its state changes,
and every state is something the film has just said:

`— · —` → **401** (frame 3, the desk turns you away) → **200** (frame 4, the card is
valid) → **403** (frame 4's payoff, the door refuses it) → **401 / 403** (frame 5,
side by side) → **200** (frame 6, the bug — the wrong invoice returns OK) →
**403** (frame 6, after the fix). It is a real observable artifact, not a mascot,
and it carries the episode's sharpest insight in its own label.

**Camera budget: two moves, both motivated.** Frame 1's unbroken pull-back (the
blueprint's signature move) and frame 4's lateral travel across the four doors.
Every other frame holds a locked plate and lets the content move. **No idle
wobble anywhere** — every frame names a sustained-motion route below.

**Stillness before the climax:** 0.7s of held frame in frame 4 between the card
touching the 413 reader and the refusal landing. Frame 6 holds 0.5s between the
inserted line and the response flipping.

**Held beats, placed deliberately** so the film is not uniformly busy: the back
1.4s of frame 2, the back 1.1s of frame 5, and the back 1.8s of frame 8.

**Catalog draw** (blocks and components from the 375-item registry, wired rather
than hand-rolled): `halftone-field` (the GPU shader ground under the dark act) ·
`split-flap-board` (the status codes resolving mechanically) · `mk-progress-stat`
(the OWASP figure) · `code-diff` (the one-line insertion) · `vox-annotate` (the marker on "Unauthorized") ·
`grain-overlay` + `vignette` (texture).

**Photography:** two real editorial photographs, graded warm to sit in the cream
and cropped full-bleed inside 10px-radius boxes with the system's single soft
drop shadow. They carry frames 1, 3 and 4 — the real-life half of the argument.
Every other visual is invented.

**Sourcing rule:** every numeral on screen is captioned with its source on the
same frame. Nothing is presented as measured.

---

## Frame 1 — The door

- status: animated
- src: compositions/frames/01-door.html
- duration: 8.2s
- transition_in: cut
- scene: a macro on a hotel door reader pulls back to reveal the whole corridor; the headline builds over it
- voiceover: "Walk up to a hotel room door. Your keycard proves who you are. It does not decide which doors open."
- type: hook
- persuasion: Concretization — start inside an object the viewer has physically held
- beat: recognition
- blueprint: zoom-out-workspace-reveal (Adapt)
- focal: the door reader's LED, then the corridor it belongs to
- roles: reader macro + corridor photograph = foreground subject · warm cream ground = background · headline + status pill = supporting
- sfx: reader-beep, whoosh-soft
- register: paper
- catalog: mk-background (ground), grain-overlay
- assets: public/img/corridor.jpg (CC BY-SA 4.0) — the reader is an invented vector

Adapt: keep the signature single unbroken decelerating pull-back; the design-tool
workspace becomes a hotel corridor, and the micro-action in close-up is the
reader's LED settling from amber to green.

Scene 1 (0.0–1.9s): full-bleed macro on the door reader, filling the frame,
nothing else on screen. Its LED holds amber, then settles green as the VO reaches
"keycard" — layered-depth framing, 3 layers (reader / soft-focus door grain /
cream vignette). The pull-back has already begun, slowly.
Scene 2 (1.9–4.4s): the pull-back continues on one unbroken decelerating curve
and the corridor resolves around the reader — a receding row of identical doors.
Nothing has been added; the frame is *revealing*, which is the shape's whole
engine. `401` has not appeared yet; the status pill sits at `— · —`.
Scene 3 (4.4–6.6s): the camera locks. `Your keycard proves who you are.` builds
per-line in ink, right of the corridor plate — asymmetric 60/40, the photograph
holding the left 60%. One word, `who`, switches family to Bricolage 600 as the VO
lands it; the rest stays Inter 400 (emphasis is a family change, never a weight
bump).
Scene 4 (6.6–8.6s): the second line lands beneath it on its spoken cue — `It does
not decide which doors open.` — with `which doors open` carrying the frame's one
orange, at display size. Then still: no continuing push, no drift. The reader's
LED is the only thing alive, and it holds green.

**Sustained motion:** the camera pull-back for the first half, staged reveals for
the second. Nothing overlaps them.

---

## Frame 2 — Title

- status: animated
- src: compositions/frames/02-title.html
- duration: 5.0s
- transition_in: cut
- scene: the title lands full-bleed on the orange hero band
- voiceover: —
- type: branding
- persuasion: Naming the thing — the two words the whole film separates
- beat: orientation
- blueprint: titlecard-reveal (Reproduce)
- focal: the two-line title
- roles: title = foreground subject · the orange band + its radial mesh = background · episode pill = supporting
- sfx: impact-soft
- register: fire
- catalog: grain-overlay

Scene 1 (0.0–1.4s): the orange band arrives already full-bleed (carried in by the
seam, not faded up) with the hero mesh live beneath it — `primary` core through
`hero-glow` to a `hero-pink` wash at the lower edge, drifting slowly. The title's
first word, `Authentication`, is mid-flight from the right at the seam's matched
velocity and settles.
Scene 2 (1.4–2.6s): `Authorisation` lands underneath on the beat, and the `≠`
between them snaps in last, at `display-xxl` scale — one restrained move, which is
this blueprint's whole point. White on orange, display only: **no small type
touches the band** (measured — neither white nor ink clears body AA on `#ea2804`).
Scene 3 (2.6–3.6s): a single white outline pill fades in low-right — `EP 23 ·
JETBRAINS MONO` chrome inside a white pill so the label clears contrast on its own
ground, never as bare small type on orange.
Scene 4 (3.6–5.0s): **held.** Nothing moves but the mesh's drift and the grain.
This is one of the film's three placed still beats, and it is where the bed lifts
its full amount.

**Sustained motion:** staged reveals, then a deliberate hold. Low motion is the
payload here, not a deficiency.

---

## Frame 3 — The front desk

- status: animated
- src: compositions/frames/03-desk.html
- duration: 11.9s
- transition_in: cut
- scene: three step-cards cascade across a front-desk photograph — a claim, a check, a credential issued
- voiceover: "Start at the front desk. Hand over a passport. They check it, then they issue a card. Authentication is that whole exchange — a claim, a check, a credential."
- type: feature_showcase
- persuasion: Progressive disclosure — the definition assembles from its three parts rather than arriving as a sentence
- beat: comprehension
- blueprint: grid-card-assemble (Adapt)
- focal: the three step-cards
- roles: step-cards = foreground subject · front-desk photograph = background (dim ~40%, right third) · mono definition line + status pill = supporting
- sfx: tick, card-issue, thunk
- register: paper
- catalog: mk-background (ground), grain-overlay
- assets: public/img/frontdesk.jpg (CC BY 2.0)

Adapt: keep the staggered self-assembling cascade; the feature grid becomes a
three-step exchange, and the cards arrive **one per spoken clause** rather than as
one stagger, so the definition is built by the narration instead of illustrated
after it.

Scene 1 (0.0–2.4s): the frame opens nearly empty — the front-desk photograph
seated in the right 40% at radius `md`, dimmed to sit back, and one mono kicker
`AUTHENTICATION · AUTHN` upper-left. Asymmetric 60/40. The status pill, carried
across from frame 1, is still `— · —`.
Scene 2 (2.4–4.6s): card one cascades in on `Hand over a passport` — a white card
at radius `md`, 1px hairline, holding a mono row `claim: passport #C4419827` and
the label `01 / THE CLAIM`. No coloured edge on it; the colour is in the content.
Scene 3 (4.6–6.8s): card two lands on `They check it` — `02 / THE CHECK` — and a
hairline draws between the two cards. As it settles, the status pill flips to
**`401`** with a mono gloss beneath it, `no valid credentials`, held for a beat:
this is what failing *this* check looks like, and it is the only place in the film
where 401 is the live state.
Scene 4 (6.8–9.4s): card three lands on `they issue a card` — `03 / THE
CREDENTIAL` — carrying a small keycard graphic and the mono line `card
4A·9F·22·E1 · doors: 412, gym, pool`. That door list is planted here on purpose;
frame 4 spends it. The pill returns to a neutral `200`.
Scene 5 (9.4–12.0s): the three cards dim very slightly and the definition line
draws in beneath the row on its spoken cue — `a claim, a check, a credential` —
each noun arriving on its own beat, the word `credential` switching to Bricolage
600. Then held. The photograph never moves.

**Sustained motion:** staged reveals, one card per spoken clause, plus the status
pill's state change. Reveals are spread across the back 60% of the shot.

---

## Frame 4 — The lock

- status: animated
- src: compositions/frames/04-lock.html
- duration: 11.6s
- transition_in: cut
- scene: the camera travels a strip of four doors; the same valid card opens two and is refused by two
- voiceover: "Now carry that card to a door. Four twelve opens. Four thirteen does not. The lock never asks who you are — only what you may open."
- type: feature_showcase
- persuasion: The controlled contradiction — the credential is provably valid and the door still says no
- beat: the thesis
- blueprint: spatial-pan-stations (Adapt)
- focal: the four door stations, and the 413 reader that refuses
- roles: four door stations on one oversized strip = foreground subject · corridor photograph = background · the travelling keycard + status pill = supporting
- sfx: whoosh-soft ×3, unlock-chime ×2, deny-buzz, thunk
- register: paper
- catalog: mk-background (ground), grain-overlay
- assets: public/img/corridor.jpg (CC BY-SA 4.0), held far back

Adapt: keep the signature — pre-placed labelled stations on one oversized canvas
traversed by a single camera, landing held on the last. The pain-station web
becomes four doors, and the callout revealed at each station is a mono verdict.
The camera arrives already large from the inverse-zoom seam and *settles* into the
first station rather than pushing into it, so the Z-vector and the lateral travel
never fight.

Scene 1 (0.0–2.2s): station one — door `412` centred, its reader lit. The keycard
graphic, carried over from frame 3, travels in from the right and touches the
reader. Green; the mono verdict `OPEN` lands beside it and the pill reads `200`.
Full-width strip framing, the other three stations already placed off-frame right.
Scene 2 (2.2–4.0s): the camera travels left to station two — `GYM` — at the
current's own velocity. Same card, same result, revealed faster than the first: the
shape earns its pace by repeating. `OPEN`.
Scene 3 (4.0–6.4s): the camera travels to station three — `413` — and the card
touches the reader. **0.7s of held stillness**: nothing moves, the reader holds
amber, the frame waits. This is the film's dramatic comma and it is scheduled, not
incidental.
Scene 4 (6.4–8.6s): the refusal lands — the reader goes to the deep orange, the
mono verdict `DENIED` snaps in, and the status pill flips to **`403`**. Beneath the
card, a mono line states the contradiction plainly: `card 4A·9F·22·E1 — valid,
issued 20s ago`. The card is not the problem, and the frame says so in its own
chrome.
Scene 5 (8.6–11.6s): the camera settles a half-step further to hold `413` and
station four, `MANAGER`, in one frame, both refusing. The frame's one orange line
draws in at display size across the lower third — `The lock never asks who you
are.` — and holds. Locked, still, no drift.

**Sustained motion:** camera with intent — a mapped three-leg lateral travel, each
leg landing on a station and paying off a verdict. The travel *is* the argument.

---

## Frame 5 — The naming trap

- status: animated
- src: compositions/frames/05-naming.html
- duration: 11.8s
- transition_in: cut
- scene: 401 and 403 resolve mechanically side by side; a marker annotates the word that misleads everyone
- voiceover: "Read the two status codes carefully. Four oh one says Unauthorized, but it means we do not know you. Four oh three means we know you, and the answer is no."
- type: feature_showcase
- persuasion: Correcting a belief the viewer already holds — the strongest form of teaching
- beat: the correction
- blueprint: comparison-split (Adapt)
- focal: the two status numerals
- roles: two split panels = foreground subject · cream ground with a centre hairline = background · the annotation marker + RFC caption = supporting
- sfx: split-flap-clatter, marker-scratch, tick
- register: paper
- catalog: split-flap-board, vox-annotate, grain-overlay

Adapt: keep the paired-equal-weight entry from opposite wings and the badge
spring-pop; drop the 3D book-open tilt (this system is a flat plane — no
perspective tricks, no shadow). The numerals resolve on a **split-flap cascade**
instead of fading, which makes the two codes feel mechanical and specified rather
than designed.

Scene 1 (0.0–2.0s): two white panels enter from opposite wings and settle either
side of a single 1px hairline — split-screen, exact halves. Both are empty except
a mono label: `401` left, `403` right. Nothing else yet.
Scene 2 (2.0–4.4s): on `Four oh one says Unauthorized`, the left panel's
split-flap board walks its cells through the alphabet and lands on
`UNAUTHORIZED`. A pill spring-pops beneath it: `RFC 9110 §15.5.2`.
Scene 3 (4.4–6.6s): the annotation fires — a hand-drawn marker strikes through
the word `UNAUTHORIZED` and a thin connector draws up to a mono callout:
`misnamed — this is the AUTHENTICATION failure`. The marker carries the frame's
one orange. This is the frame's key reveal and it lands on the VO's own
correction, `but it means we do not know you`, which types in beneath as plain
ink.
Scene 4 (6.6–9.2s): the right panel resolves — `FORBIDDEN` clatters up on the same
split-flap cascade, its pill reads `RFC 9110 §15.5.4`, and its gloss lands: `we
know exactly who you are`. No marker on this side; nothing is wrong with this
name, and withholding the annotation is what makes the left one mean something.
Scene 5 (9.2–11.8s): the two one-line translations settle into place under each
panel — `401 — I don't know who you are.` / `403 — I know, and the answer is no.`
— then **held** for the back 1.1s. The status pill shows both codes at once, the
only frame where it does.

**Sustained motion:** staged reveals on a mechanical cadence — the split-flap
cascades are themselves sustained motion, running 0.9s each rather than resolving
instantly.

---

## Frame 6 — The route

- status: animated
- src: compositions/frames/06-route.html
- duration: 11.8s
- transition_in: cut
- scene: a real route returns 200 with the wrong invoice; one inserted line turns it into 403
- voiceover: "Look at this route. The token is valid, so it returns two hundred, and it returns someone else's invoice. Check ownership, not identity."
- type: feature_showcase
- persuasion: Show the defect in code the viewer could have written, then fix it in one line
- beat: the mechanism
- blueprint: panel-edit-live-sync (Adapt)
- focal: the code well, and the line inserted into it
- roles: code well = foreground subject · the halftone shader field behind the dark band = background (low strength) · the response panel + status pill = supporting
- sfx: key-taps, insert-thunk, deny-buzz, tick
- register: dark
- catalog: halftone-field (shader ground), code-diff, vignette, grain-overlay

Adapt: keep the bipartite editor-bound-to-surface stage and the live coupled
update; the cursor-scrubbed control becomes a **single inserted line**, and the
coupled surface is the HTTP response beside it. The camera holds throughout — this
system does not punch in.

Scene 1 (0.0–2.2s): the dark band arrives full-bleed, carried by the zoom-through
at matched scale-velocity, with the halftone shader field alive behind it at low
strength — broad slow bands of light crossing a near-black ground, never
competing with the type. The code well sits right at 55% width, radius `md`, its
tab strip reading `routes/invoices.ts`. The well arrives **solid** — its contents
fill in, the surface never dims (a dark panel held at partial opacity over cream
composites to mid-grey).
Scene 2 (2.2–5.0s): the route types in, four lines, JetBrains Mono, on `Look at
this route`. `requireAuth` takes the one accent — `#ff6a3d`, the on-dark orange,
because brand orange measures 3.74:1 on this ground and fails body AA.
Scene 3 (5.0–7.2s): the response panel resolves left on `it returns two hundred` —
`200 OK` and a JSON body — and the status pill flips to **`200`**. Then the
contradiction lands: the mono line `invoice 1043 · ownerId: usr_8812` appears
beside the caller's own `req.user.id: usr_2140`, and the two ids sit one above the
other so the mismatch is visible before it is named. A caption reads `IDOR —
Insecure Direct Object Reference`.
Scene 4 (7.2–9.4s): the fix. One line is **inserted** into the well as a diff
addition — the lines below it slide down to make room, and the new line arrives on
a `badge-success` gutter marker (semantic, not decorative — the only non-orange
hue in the film):
`if (invoice.ownerId !== req.user.id) return res.sendStatus(403)`.
**0.5s of stillness** while it sits there unexecuted.
Scene 5 (9.4–11.8s): the coupled surface updates in the same beat — the response
panel flips from `200 OK` to `403 Forbidden`, the status pill follows to **`403`**,
and the closing line lands beneath: `ownership, not identity`. Held.

**Sustained motion:** sequenced UI life — the route types, the response resolves,
the line inserts, the response flips. The panel behaves over time; nothing is
decorative.

---

## Frame 7 — What it costs

- status: animated
- src: compositions/frames/07-cost.html
- duration: 10.6s
- transition_in: cut
- scene: the OWASP figure counts up beside the breakdown that sources it
- voiceover: "Now count what that costs. Broken access control ranks number one on the OWASP Top Ten, with one point eight million recorded occurrences."
- type: social_proof
- persuasion: Authority + scale — the abstract bug gets a rank and a count
- beat: consequence
- blueprint: dataviz-countup (Adapt)
- focal: the 1,839,701 figure
- roles: the figure + its progress track = foreground subject · cream ground = background · the sourced breakdown rail + the OWASP quote = supporting
- sfx: count-ticks, thunk, notify
- register: paper
- catalog: mk-progress-stat, mk-background (ground), grain-overlay

Adapt: keep the count-up-on-a-track signature; drop the camera push-through (two
camera moves is this film's whole budget and both are spent). The tilted stat grid
becomes a left-aligned figure against a sourced breakdown rail, so the number
never appears without the thing that authorises it.

Scene 1 (0.0–2.0s): a mono kicker lands upper-left — `OWASP TOP 10 · 2025 ·
A01` — and the rank arrives as a single ink line: `#1`. Rule-of-thirds framing;
the right rail is still empty.
Scene 2 (2.0–5.2s): the figure counts up on tabular numerals from 0 to
`1,839,701` on its spoken cue, at `figure` scale, with a thin progress track
filling beneath it. The count runs 3.2s — long enough to read as a quantity rather
than a transition — and its label lands as it finishes: `recorded occurrences`.
Scene 3 (5.2–7.6s): the breakdown rail builds on the right, one row per beat, all
four sourced from the same page: `40 CWEs mapped` · `32,654 CVEs` · `100% of
applications tested` · `3.74% average incidence`. Mono rows, hairline between
them, no coloured edges.
Scene 4 (7.6–10.6s): the OWASP prevention line arrives beneath as a pull-quote in
Bricolage — *"Enforce record ownership rather than allowing users to create, read,
update, or delete any record"* — with `record ownership` carrying the frame's one
orange. The caption line under it names the source in full:
`OWASP Top 10 2025 · A01:2025 Broken Access Control`. It is the same fix frame 6
just typed, written as policy, and that is the whole reason this frame exists.
Then held.

**Sustained motion:** the count-up across 3.2s, then staged reveals one row per
beat. The figure is still counting while the rail begins to build, so the frame is
never doing only one thing.

---

## Frame 8 — Authenticate once. Authorise every time.

- status: animated
- src: compositions/frames/08-takeaway.html
- duration: 7.2s
- transition_in: cut
- scene: the takeaway lands on black, then the next episode is named
- voiceover: —
- type: cta
- persuasion: The rule, stated as an instruction the viewer can apply today
- beat: resolution
- blueprint: titlecard-reveal (Reproduce)
- focal: the two-clause takeaway
- roles: takeaway = foreground subject · deep black ground = background · series mark + next-episode line = supporting
- sfx: impact-soft, success
- register: deep
- catalog: grain-overlay

Scene 1 (0.0–1.6s): the black ground arrives from below, carrying the takeaway's
first clause mid-flight — `Authenticate once.` — in `on-dark` at `display-lg`. One
restrained move; it settles and stops.
Scene 2 (1.6–3.0s): the second clause lands beneath on the beat — `Authorise every
time.` — with `every time` in the frame's one orange. The two clauses are the whole
episode and they are the only large type on the frame.
Scene 3 (3.0–5.4s): a hairline draws left-to-right beneath them, and one mono line
fades in under it: `A token proves the front desk let you in. It never proves the
door should open.` Then the series mark and the next-episode line arrive low —
`EP 24 · SUBAGENTS` — paying a promise EP 20, 21 and 22 all made and none kept.
Scene 4 (5.4–7.2s): **held.** Grain only. The second of the film's two silent
frames, and the second place the bed lifts.

**Sustained motion:** staged reveals, then a deliberate hold. The film ends still.
