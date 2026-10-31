# EP 25 — "Your Source of Truth Went Down"

**Runtime** 1:39 · 1920×1080 · 30fps · h264/yuv420p/bt709 · AAC 48 kHz stereo
**Renderer** HyperFrames 0.8.3 · nine frame sub-compositions · rendered in 1m 25s

---

## The honesty note that matters most

**Cursor has published no architecture for Origin.** Nothing in this film is a
claim about Origin's internals, because nobody outside Anysphere has them. The
film is split into two kinds of statement, and they are visually distinct:

- **Frames 1, 3, 4 and 8** state things Cursor or GitHub have said publicly, or
  that were reported. Frame 8's claim is captioned `CURSOR'S STATED PITCH`
  precisely so it reads as their claim rather than a measurement.
- **Frames 5, 6, 7 and 9** are general distributed-systems reasoning about the
  shape any system makes when it designates a primary. Frame 5 names it as a
  pattern (`Two writers. One authority.`) and lists three systems the audience
  already runs. None of it is presented as a description of Origin's code.

## Every on-screen claim, with its source

| Frame | On screen | Source |
|---|---|---|
| 1 | `13:40 UTC` outage start | GitHub status timeline, 17 Aug 2026, 13:40 → 21:15 UTC |
| 1 | "seven and a half hours" (VO) | the same timeline. Press reports vary between six and eight hours; the film uses the status page. |
| 1 | `20% ERROR RATE` | peak error rate on web experience and API traffic |
| 1 | `50% ON RAW + ARCHIVE DOWNLOADS` | peak on archive downloads and raw repository content |
| 1 | Service rows: API, Actions, Pull Requests, Pages, Webhooks, Copilot | the services reported affected. SAML/OIDC, SCIM and Team Sync were also hit; cut for space. |
| 1 | `257` outages in twelve months | LeadDev analysis, cited widely in coverage of the incident |
| 3 | `CODEBASE` tab, PR review without leaving the editor | Origin ships in a new Codebase tab with "full pull request support, including diffs, comments, and merging, without requiring users to leave the editor" |
| 4 | `SOURCE OF TRUTH` stamp on GitHub | Cursor's own launch framing: GitHub repos sync in, GitHub remains the "source of truth", pushes from Cursor route back to it |
| 4 | "Both sides update in real time" | synced repos and PRs update bidirectionally in real time |
| 8 | machine-readable merge state, structured semantic diffs | Origin's stated differentiator vs traditional unified diffs |

**Not claimed on screen, but true and worth knowing:** Origin shipped in early
beta to paid Cursor users (excluding opted-out enterprise orgs) on 17–18 Aug
2026, ahead of a promised "fall" timeline, with integrations already live from
Vercel, Depot and Buildkite. GitHub has not published a root cause for the
outage.

**`origin/pr-118` is invented.** It is the film's continuity object, not a real
pull request. Its title, SHAs, diff and merge-state record are all constructed —
plausible, and labelled nowhere as real. Everything it does on screen is a thing
the film has just explained.

## The continuity object

One pull request, `origin/pr-118`, in a glass pill from frame 4 to frame 9. The
id never moves; only the state word changes, and every state is something the
film has just shown:

**opened** (f4) → **mirrored** (f5) → **stalled** (f6) → **held** (f7) →
**readable** (f8) → **reconciled** (f9, and the only time it leaves coral).

## Design

Maximalist **claymorphism + glassmorphism**, specified in `DESIGN.md`. Clay is
the furniture; glass is the type surface. Every word in the film sits on glass,
which is a legibility rule before it is a style rule — `backdrop-filter` samples
whatever clay is behind it, and clay moves.

Contrast was **computed, not eyeballed**, and the maths changed the palette
twice:
- Glass is pinned at `rgba(22,16,43,0.76)`. That floor is what bounds the
  composite when the backdrop is at its brightest; the worst case (glass over
  pure white) measures **8.61:1** for `--ink` and **4.93:1** for `--ink-soft`.
- `--clay-coral` and `--clay-lilac` measured **3.31:1** and **3.28:1** as type on
  glass — hard AA failures. Two lit variants were added, `--coral-lit #FFB2A6`
  (4.93:1) and `--lilac-lit #D2B8FF` (4.88:1). The fill colour and the type
  colour are different values in this system.
- `--ink-mute` fails on glass (2.94:1) and is restricted to the bare void.
- White on any clay fill measures 1.6–2.6:1 and is banned; clay takes
  `--clay-ink`.

Final: **59/59 text checks pass WCAG AA.**

## Type

| Role | Face | Licence |
|---|---|---|
| Display | Bricolage Grotesque 700/800 | SIL Open Font License 1.1 |
| Body | Plus Jakarta Sans (variable 200–800) | SIL Open Font License 1.1 |
| Technical | JetBrains Mono 400/700 | SIL Open Font License 1.1 |

Latin subsets extracted from the Google Fonts `css2` response and vendored to
`assets/fonts/`; every file verified `wOF2`.

## Logos

Both supplied by the director. Trimmed to their content bounding box
programmatically (`logo-cursor-trim.png` 291×76, `logo-github-trim.png` 255×65)
and set on white plates rather than inverted — inverting left a visible box.
Used as identification only; both marks belong to their owners.

## Audio

**Narration** — Kokoro-82M (`am_michael`), local, 8 lines, 82.0s total. Not the
series voice: the ElevenLabs voice is out of credits until 2026-08-31.

**Bed** — *"Strange Contemplations"* by **PorchCat**, **CC BY 3.0**
(http://creativecommons.org/licenses/by/3.0/) —
https://ccmixter.org/files/PorchCat/27233

Deliberately **not share-alike**, for the reason EP 23 is still unresolved.

Selection was measured, not auditioned-first: 870 ccMixter candidates harvested,
129 downloaded and measured, each scored on **speech-band carve** (how much
quieter it is in 1–4 kHz than overall) minus 1.4× its **level instability**.
"Strange Contemplations" scored carve **31.8 dB** with a **2.7 dB** spread. Its
spectrogram confirmed the ranking: energy almost entirely below 1.7 kHz, very
few transients, and a real three-part arc.

**The offset is the interesting part.** Cut from source **67s**, which lands the
bed's own section changes on the film's cuts:

| Bed event | Film time | Lands on |
|---|---|---|
| density lift | 27.5s | the mirror cut |
| breakdown | ~53s | the failure beat |
| full return | 63.0s | **the arrival** — the thesis cut |

**Mix** — ducked offline with `sidechaincompress` keyed on a voice track built
from the real narration at its real offsets, `apad`ed to the full 99s (EP 24 lost
5.3s to skipping that), then `dynaudnorm` and a fixed −13.0 dB. The assembler
mounts one flat volume; the two levels are baked in.

Measured **in the finished render**:

| Beat | Level |
|---|---|
| narration, frame 1 | −23.0 dB |
| narration, frame 3 | −23.1 dB |
| narration, frame 7 | −23.4 dB |
| narration, frame 9 | −22.6 dB |
| title card (no VO) | −28.0 dB |
| sign-off tail (no VO) | −27.2 dB |
| peak | −2.2 dB |

Narration sits within **0.8 dB** across the film. The bed lifts **+3.0 dB** under
the title and **+3.8 dB** under the sign-off.

## Verification

| Gate | Result |
|---|---|
| `hyperframes check` — lint | 0 errors, 0 warnings |
| — runtime | 0 errors, 8 expected `clip_media_fit` warnings (designed tails) |
| — layout | 0 issues across 9 samples |
| — motion | 0 errors, 0 warnings |
| — contrast | **59/59 pass WCAG AA** |
| `seam-gate.mjs verify` | **PASSED — 0 fail, 0 warn across 8 seams** |
| Cut snapshots at +0.06s | 8/8 enter with readable content mid-flight |
| Beat-midpoint snapshots | reviewed; 4 defects found and fixed |
| Pacing | 27.1% static (see below) |

## Defects found and fixed

1. **`data-start` inside a frame sub-composition must be local (`0`).** Every
   frame carried its global start, which pushed its content past its own slot;
   frames 2–9 rendered as an empty canvas. The assembler applies the offset.
2. **Both Z seams would have mirrored** without the sign rule: zoom-through
   enters below 1.0 and grows, inverse zoom enters above 1.0 and settles. Written
   into the frames from the start, and the gate passed 0/0 on the first run.
3. **Coral and lilac failed AA as type on glass** (3.31 / 3.28). Lit variants
   added.
4. **`tl.set(el, { text })` silently does nothing** — GSAP's TextPlugin is not
   loaded. Frame 1's status words never changed. Rebuilt as stacked spans toggled
   by zero-duration `tl.set`, which is also seek-safe.
5. **Every frame entered nearly blank.** Content faded up at ~0.4s while the clay
   carried the cut, so the gate passed on motion while the viewer saw an empty
   plate. Each frame's primary surface and headline now ride the cut at full
   opacity.
6. **Frame 3's diff well was anchored to the window, not the main pane**, and
   spanned the sidebar.
7. **Frame 5's chips stacked on one point** — `.glass` sets `position: absolute`,
   which removed them from the flex row.
8. **Frame 4's caption panel sat mostly empty** while three lines trickled in.
   Rebuilt as three strips that each arrive whole.
9. **Frame 9's third instruction wrapped** and its rule landed across the wrap.
10. **The Cursor logo carried a grey box** — the source PNG's off-white
    background against a pure-white plate. Flattened.
11. **`volumedetect` reports at info level on stderr**, so the first spectrum
    ranking returned zero rows under `-v quiet`.

## Pacing — the honest number

**27.1% static**, against the doctrine's ~15% target, after four content passes
(36.1 → 32.0 → 29.6 → 27.1). Every pass was content, never a camera move.

Where it still sits high, the cause is partly the measurement. The audit scores
mean frame-to-frame luminance difference, which is dominated by **area**. This
register's late-beat motion is deliberately small: a 5px rule sweeping a headline,
32px packets crossing a channel, a caret riding a write head. Frame 9 reads 64.3%
while its three underlines are drawing *during* every flagged stretch.

That is an explanation, not an excuse. Frames 1 and 3 could carry more, and a
future episode in this register should plan a large-area running system per beat
rather than retrofitting one.

Frame 6 measures **3.1%** — the failing-packet system runs for the whole beat and
is the model for how this should be done.

## Not done

- **No registry blocks were used.** The catalog's blocks own their own canvases
  and container colours, which would fight a translucent surface over saturated
  clay. A smaller draw than the director asked for, stated plainly.
- **No SFX cue set.** The film ships with narration and bed only.
- **Not watched end-to-end in a browser with sound.** Verified by gates, cut
  snapshots, beat snapshots and measured mix, but the `review.mjs` pass was not
  run.
