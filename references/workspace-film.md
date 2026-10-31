# The workspace register — software being operated, by someone

The third register, after CUT (screens replace each other) and TRAVELLED (one
canvas, the camera flies). This one is the register of the product film: no
footage, usually no narration, twenty seconds, and the whole thing is a piece of
software being used by named agents whose cursors you can see.

It is worth having as a first-class register because the rest of the kit cannot
express it. The kit's default assumptions — 35–45% footage, narration as the
spine, twelve beats — are correct for an explainer and actively wrong here. A
workspace film has four beats, no voice, and its motion budget goes somewhere
else entirely.

## Why it works, mechanically

**Causation is the content.** A card that recolours on its own is a motion
graphic; a card that recolours twelve frames after a cursor labelled *Colorist*
drops a swatch on it is a story. The viewer infers an actor, an intent and a
result from three moving objects and zero explanation. That inference is doing
the job narration does in an explainer, which is why the register can drop the
voice track without going quiet.

**The prompt is a promise.** Open on an input, type one line of intent, send it.
Every frame after that is being judged against a goal the viewer already holds.
It is the cheapest narrative tension available and it costs one component.

**The status line is a state machine.** "Claude is rendering" → "Motion graphics
finished" gives a twenty-second film a middle that has tension and an end that
has release. Without it you have a sequence of pretty screens and no idea when
it is over.

**Parallelism is free.** Four cursors working at once says *a team,
simultaneously* in a way that no diagram of a team says it.

## The shape

Four beats, roughly 20 seconds. `src/compositions/DemoLab.tsx` is the reference
implementation — copy it rather than working from this table.

| # | Beat | ~sec | What carries it |
|---|---|---|---|
| 1 | Cold open | 3.5 | `useTypeCam` — camera inside a word, falling back as the sentence types |
| 2 | The prompt | 3.5 | `PromptBox`, one line of intent, sent |
| 3 | The work | 3.5 | `TaskStream` — three lines, each with a craft detail under it |
| 4 | The payoff | 9 | `AppWindow` restyling live, cursors acting, status pill flipping to done |

Beat 4 is nearly half the film. That is deliberate: the transformation is the
thing you came for, and it needs room to happen twice (a headline lands, then
the whole design changes) rather than once.

## The cold open

`useTypeCam` in `src/lib/space.tsx`. The film starts so far inside a word that
you cannot read it — a letterform and a caret — and the words are typed at you
while the camera retreats, so the sentence resolves at the same moment the frame
does. The viewer has been reading for two seconds before they realise they were
looking at a title card.

This beats a title with a push on it because the move is driven by the content:
the caret is going somewhere and the camera is following it. A push on a static
headline is a drift, which the house rules ban.

- `zoomIn` 6–10. Below 6 the first frame is legible and the trick is gone.
- `cps` 22–30. 55 reads as pasted, not typed.
- The caret is estimated as an even fraction of the block width. On a
  proportional face that is a couple of percent out mid-word — invisible while
  the frame is moving. Do not use it to point at a specific glyph.

## The cursors

`src/lib/agents.tsx`. Five rules, and the first one is the whole thing:

1. **Every cursor move must cause something, or precede something it caused.**
   A cursor that wanders is a screensaver. This is the failure mode of the
   technique and it is very easy to ship. Test: park the film on any second and
   ask what each cursor is for. If the honest answer is "nothing", cut it.
2. **Cause precedes effect by ~0.2s.** Author the change 6 frames after the
   `act: true` key. Simultaneous reads as coincidence; the small gap reads as
   causation.
3. **Cursors live in the margins.** They annotate content; they never sit on
   what the viewer is reading.
4. **Small** — about 2% of frame height for the arrow. Big cursors read as a
   tutorial screencast; small ones read as a workspace.
5. **Name and colour are fixed for the whole film**, and there are 3–6 of them.
   Two reads as pair programming, seven reads as noise.

Mount `AgentCursors` **outside** `Timeline`, alongside `MotifTrack` — a cursor
that restarts at a cut has stopped being a person. The idle breathe is
deterministic and sub-pixel; without it a parked cursor looks like a PNG and the
eye notices the deadness before it notices anything else on the frame.

## The artifact

`src/lib/workspace.tsx`. One artifact per film, changed repeatedly — not five
artifacts shown once. The register earns its ending by transforming *one* thing.

**State changes are interpolated, never swapped.** A card that cuts from cream
to navy on one frame is a slide changing. The same card taking 13 frames to
cross-fade its background, ink, accent and type together is an application
re-rendering. The eye reads the difference immediately without being able to
name it. `blendLooks` is exported so anything else on the frame that belongs to
the artifact's state can move with it — a restyle that only reaches the window
looks broken.

Keep the chrome thin. The moment the traffic lights are the most detailed thing
on screen, the beat is about a window instead of about what the window contains.
And put a plausible artifact inside it: a real title, a real duration in the
scrubber, a real filename. Lorem bars everywhere read as a wireframe, and a
wireframe has nothing at stake.

## Sound

This register lives or dies on the cue layer, more than any other, because there
is no voice to carry it. Every `act: true` gets a `click`. The send gets a
`click`, the task lines get `tick`s on their stagger, the restyle gets a `blip`,
and the status pill flipping to done gets `success` — the single most earned cue
in the kit. The bed runs at `open` throughout since nothing is ducking it, which
means the score is doing narration's job and should be chosen accordingly:
something with a build, not a pad.

## When NOT to reach for it

It teaches nothing. A workspace film shows that a thing is good; it cannot show
how a thing works, because there is no room for a diagram and no voice to
explain one. For an episode of the playlist, the register is a cold open or a
payoff beat inside a CUT or TRAVELLED film — not the whole film. Use it whole
only for a launch piece, a trailer, or a short.
