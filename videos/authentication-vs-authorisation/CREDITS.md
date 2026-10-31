# EP 23 — "Authenticate once. Authorise every time."

Authentication vs Authorisation. 1:18, 1920×1080, eight frames.

Second episode on **HyperFrames**. First episode on the **Replicate** design
system, supplied by the director. First episode built as **eight separate frame
sub-compositions** rather than one monolithic file — the follow-up EP 22 logged.

---

## Toolchain

| | EP 22 | EP 23 |
|---|---|---|
| Composition | one 480-line file | **8 sub-compositions** + assembled `index.html` |
| Design system | `code-editorial` preset | **Replicate** (supplied), `broadside` remixed then rewritten |
| Registry blocks | none used | **`halftone-field` nested** (GPU shader ground) |
| Render | 24s for 70s | 48s for 78s |
| Seam verification | 7/7 | **7/7** |
| GSAP | vendored | vendored (`assets/vendor/gsap.min.js`, sha384 verified against the CLI's own SRI pin) |

## Design system

`DESIGN.md` is the director's supplied Replicate spec, verbatim in substance.
`frame.md` is that spec translated to 1920×1080. The `broadside` preset was the
structural starting point; `build-frame.mjs` remixed the brand colours onto it and
then **`frame.md` was rewritten by hand**, because the remix fought the supplied
system in three load-bearing ways. All seven deviations are listed in `frame.md`
§ "Deliberate deviations"; the three that mattered:

1. **A paper register exists and is the default.** Broadside forbids a cream
   ground; Replicate's whole identity is that ground. Two registers became five,
   ordered as the supplied section rhythm.
2. **Body is Inter, mono is JetBrains Mono.** The remix had mapped display *and*
   body to Bricolage and left mono as IBM Plex — collapsing a deliberate
   three-family stack into two of the wrong ones.
3. **Radius is semantic, not zero.** Broadside is flat-and-square; Replicate is
   fully-rounded interactives against 10–16px cards.

### Contrast, measured rather than assumed

Three findings, all recorded rather than silently applied:

- **Orange on cream is 4.08:1.** That clears the 3:1 large-text floor and fails the
  4.5:1 body floor, so `#ea2804` is used for display type and 2px rules only. (I
  first wrote 4.9:1 in `frame.md` and corrected it — the supplied system already
  says "never use orange on body text"; the measurement is *why*.)
- **On the orange band, white is 4.4:1 and ink is 3.7:1** — neither clears body AA.
  So the title frame carries display type only, and its episode mark sits inside a
  **white pill with ink text** rather than as small type on the band.
- **On `#202020`, brand orange is 3.74:1.** The dark act therefore uses
  `#ff6a3d` — already in the supplied palette as `hero-glow` — which measures
  **5.7:1**. Same hue family, same role, legibility only. Not a second accent, and
  it never appears on a light ground.

Also fixed: `--ash` `#8d8d8d` measures **3.26:1** as text and failed. Every *text*
use dropped to `--mute` `#646464` (5.5:1 on cream). It stays as dots and rules.

Final: **18/18 text checks pass WCAG AA**, layout 0 issues across 9 samples,
lint 0 errors, motion 0 errors.

## The catalog — what was actually used, and what was not

The director asked for the 375-block registry to be drawn on. Honest accounting:

**Nested as a real sub-composition (1):**
- **`halftone-field`** — the GPU fragment-shader ground under the dark act (frame
  6). Re-skinned to the palette in place: ground `#202020`, crests `#ff6a3d`,
  cells enlarged 54→76 and midtones crushed 12→17 so broad slow bands of light
  cross a near-black frame without competing with type. This is the "shader
  background" the brief asked for, and it is a real one — not a CSS gradient.

**Technique adopted, block not wired (3), each with a reason:**
- **`split-flap-board`** → frame 5's status codes resolve on a drum cascade built
  in the frame's own register. The block owns a full 1920×1080 near-black canvas;
  dropping it into a cream editorial frame would have meant re-skinning it into a
  different component. The mechanism was the point, so the mechanism carried over.
- **`code-diff`** → frame 6's insertion. The block ships GitHub-dark chrome, a
  green `inset 3px 0` left border (a coloured container edge, which this system
  forbids) and its root carries `id="root"` — which collides with the frame
  contract's own root id.
- **`vox-annotate`** → frame 5's marker gesture (strike + connector + mono callout
  as one beat). The component registers its own fixed timeline key, which the
  assembled graph would not drive.

**Installed then dropped (2):**
- **`mk-background`** — a blob-gradient ground. The system's elevation language is
  flat colour-blocking and it forbids a gradient ground outside the hero mesh.
- **`mk-progress-stat`** — its fixed card layout would not sit in frame 7's
  rule-of-thirds editorial composition.

**Never viable here (2):** `zoom-through-transition` and `whip-pan-cut`. Both need
both scenes on one strip; this film's frames are separate sub-compositions, and the
seam had to be authored across the boundary instead (below).

So: one genuine shader block, three techniques, and five honest rejections. The
next episode should push the count up — `code-3d-extrude`, `code-shader-dissolve`
and `camera-dolly-zoom` all fit a dark act without re-skinning.

## Motion

Per `/motion-doctrine`, carrying the craft built across the Remotion episodes
(memory: `episode-motion-craft`). The current is **LEFT**.

**Every boundary is a hard cut at the injector level, and both halves of each seam
are authored inside the frames.** This was a deliberate departure: the workflow's
transition injector uses *extend-outgoing-only* mechanics — the outgoing frame
**holds its final frame** across the overlap while the incoming pushes in over it.
That is a frozen exit, and it fails the seam law's "cut mid-motion on **both**
sides". So the frames abut with zero overlap, the outgoing frame's last 0.34s
travels, and the incoming frame's first 0.43s enters mid-flight at matched
velocity (entry travel ≈127% of exit).

Three reserved vectors, spent once each and never adjacent:

| Seam | Cut | Vector | Meaning |
|---|---|---|---|
| desk → lock | 25.1s | **z −1 (inverse zoom)** | **ARRIVAL — a valid card is refused** |
| naming → route | 48.5s | **z +1 (zoom-through)** | deeper into the same thought: concept → implementation |
| cost → takeaway | 70.9s | **y −1 (up)** | elevation into the conclusion |

`seam-gate.mjs verify --ledger ledger.json` → **PASSED, 0 fail / 0 warn across 7
seams**: exit still moving at every cut, entry mid-flight rather than from rest,
measured direction matching the ledger, zero overlap, and both Z seams
sign-matched.

**One defect the gate could not see.** It measures transforms, not visibility — so
it passed while four frames were fading their content in *on top of* a travelling
stage, which left the incoming frame blank for a beat. On the black sign-off that
read as a dropout. Fixed by making the stage's travel the entrance: each frame's
hero content is at full opacity from t=0 and visibly rides the cut. Verified by
snapshotting all seven cuts at +0.06s.

Camera budget: **two moves**, both motivated — frame 1's unbroken decelerating
pull-back and frame 4's three-leg lateral travel across the doors. Every other
frame holds a locked plate. No idle wobble; every frame names a sustained-motion
route in `STORYBOARD.md`. Scheduled stillness: 0.7s in frame 4 before the refusal,
0.5s in frame 6 before the response flips.

## Every figure on screen, and its source

- **OWASP Top 10 2025, A01:2025 Broken Access Control** — #1 (held from 2021), 40
  CWEs mapped, **1,839,701 occurrences**, 32,654 CVEs, 100% of tested
  applications, 3.74% average incidence. Verified against
  `owasp.org/Top10/2025/A01_2025-Broken_Access_Control/`. Its own prevention
  wording is quoted on screen: *"Enforce record ownership rather than allowing
  users to create, read, update, or delete any record"* — which is the same
  one-line fix frame 6 types, written as policy. That is the whole reason frame 7
  exists.
- **RFC 9110** for the status semantics: **§15.5.2** (401 — the request lacks valid
  authentication credentials) and **§15.5.4** (403 — the server understood and
  refuses; it need not say why). The film's sharpest point is that the code *named*
  "Unauthorized" is the **authentication** failure.
- The keycard id, invoice id and user ids are illustrative and captioned as such;
  nothing is presented as measured. Frame 7 says so on the frame.

## Photography

Two real photographs, graded so they sit back as grounds rather than competing with
the brand orange (a hot photograph next to a hot accent breaks the one-orange rule).

- **"Corridor at Hotel Esplanade Stockholm"** — CC BY-SA 4.0, Wikimedia Commons,
  4608×3456. Frames 1 and 4. Cropped to 16:9 at 3840×2160, desaturated to 46% and
  lifted, so the burnt-orange walls read as a muted terracotta ground.
  **Licence note for the director:** CC BY-SA 4.0 is share-alike, so using it
  arguably obliges the episode to carry a BY-SA licence. If that is not wanted, this
  is the one asset to swap — nothing else in the film is share-alike.
- **"Hotel Front Desk Lobby"** — CC BY, Wikimedia Commons, 4752×3168. Frame 3.
  Attribution only, no share-alike. Cropped to the clerk at the counter,
  desaturated to 34%.

The door **reader** is an invented vector, not a photograph, for two reasons: no
well-licensed card-reader image exists above ~1024px, and the reader has to change
state on cue (amber → green → refuse), which a photograph cannot.

Frame 1's opening is a real macro despite a 3840px source: the pull-back runs
2.9× → 1.0× while a **focus pull** cross-fades a statically-blurred plate to a
sharp one. `filter` is not on the animatable allowlist, so an animated `blur()` is
not seek-safe — two stacked plates cross-fading on opacity is. The shallow depth of
field also does real work: at the macro end the source is upsampled ~1.5×, and
rendering that as DoF is honest rather than soft.

## Narration

**Kokoro-82M, `am_michael`, local — not the series voice** (memory:
`series-voice-quota`; the ElevenLabs voice resets 2026-08-31). Six lines, 55.5s of
speech in a 78.1s film. Frames 2 and 8 carry no line, which is where the bed lifts.

The status codes are written phonetically in `SCRIPT.md` ("four oh one") because
Kokoro reads `401` as "four hundred and one"; they appear as numerals on screen.

**Frame durations are VO + a designed tail**, not VO alone. The workflow's
`sync-durations` sets each frame to the raw voice length, which leaves zero breath
and makes any payoff that lands *after* the spoken line impossible to build — and
four of these frames do exactly that (frame 4's refusal, frame 6's fix). The
measured VO lengths are authoritative; the tails are per-frame design decisions,
1.1s to 2.7s, listed in `STORYBOARD.md`.

## Music

**"0202_184646 -p2c"** by **lonerdroner** — CC0 1.0
https://freesound.org/people/lonerdroner/sounds/721943

Chosen on **spectrum**, not on level stability. 41 CC0 candidates were measured
across the stretch that plays; ranking on level-stability alone put a **−49.6 dB
room tone in first place**, because silence is perfectly stable. With a loudness
floor applied, the top candidate turned out to be a hard rhythmic pulse train —
broadband transients ~2.5/second that would fight the narration on every hit. The
chosen bed is a slow harmonic drone: energy concentrated below the speech band,
no transients, real movement in its swells. Both were judged from **spectrograms**,
which is how a bed can be assessed without hearing it.

Ducked **offline** with an ffmpeg sidechain keyed on the real narration at its real
frame offsets, so the two-level mix is baked and deterministic — the assembler
mounts BGM at one flat volume, and a flat bed sounds like the middle of a paragraph
on the two frames that exist for the music.

Then **scored to the arc**: the source starts at 13.3s so its two loudest passages
land on the film's two silent frames, and a gain envelope shapes those two windows
(the title's swell arrived 7 dB above the narration beats — a jump, not a lift; the
sign-off dipped below them).

Verified in the render:

| | mean | peak |
|---|---|---|
| narration beats (6) | **−23.8 to −22.8 dB** (1.0 dB spread) | |
| title (silent) | **−20.5 dB** | −12.6 |
| sign-off (silent) | **−21.8 dB** | −7.7 |
| whole film | −22.3 dB | **−1.5 dB** |

The bed lifts 1.5–3 dB on the two frames nobody speaks over. Peak −1.5 dB is hot
for broadcast (−3 would be safer) but is not clipping; it comes from the narration,
and the assembler hard-codes voice `data-volume="1"`.

## Output

`yuv420p` / bt709 / tv range / 30fps, AAC stereo 48 kHz — **native, no re-encode
needed** for Chrome playback. 27.5 MB mp4, 5.2 MB VP9/Opus webm.

## Known follow-ups

- **The BY-SA corridor photograph** is the one licence decision left open (above).
- **The peak is −1.5 dB.** A limiter on the voice files, or a voice `data-volume`
  the assembler does not currently expose, would bring it to −3.
- **Six `clip_media_fit` warnings are expected**, not defects: each voice clip is
  shorter than its frame slot because the tail of silence is designed.
- **The catalog count should go up.** One nested block is a thin answer to the
  brief; `code-3d-extrude`, `code-shader-dissolve` and `camera-dolly-zoom` all fit
  a dark act without re-skinning, and `mk-line-graph` has a light scheme.
- **EP 24 must be subagents.** EP 20, 21 and 22 all promised it and none delivered;
  this episode names it explicitly on the end card rather than adding a fourth
  vague promise.
