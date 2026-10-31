# AI Watermark Remover — launch film

**Deliverable.** `episodes/watermark-remover-launch.mp4` — 26.4s, 1920×1080, 30fps,
H.264 + AAC 48kHz, 8.3 MB. WebM/VP9 sibling at 1.9 MB.
Mastered to −15 LUFS with a −1.0 dBTP ceiling (measured −16.0 dB mean, −0.7 dB peak).
Source project: `videos/watermark-launch/`.

**Register.** WORKSPACE — a product launch film. No footage, no narration. The
story is told in motion, UI and sound design, so it reads on a muted timeline.
Built on HyperFrames (HTML + GSAP → video), the same pipeline as
`vectordrop-launch`.

## The spine

Gemini stamps a visible mark on the image it makes *and* writes a C2PA content
credential inside the file. A platform reads that credential and labels the post.
The product paints out the mark and hands back a clean re-encode — so the file
that comes back carries neither. Six beats, 55 musical beats at **124.92 BPM** —
the bed's own measured tempo — every cut landing on a real beat of the recording.

| # | beat | len | act | ground | what happens |
|---|---|---|---|---|---|
| 1 | prompt | 4.32s | 0 | dark | caret camera falls back off a typed prompt; send; generating |
| 2 | image | 4.32s | 0 | dark | the image resolves under a scan; the mark stamps into the corner |
| 3 | post | 4.32s | 1 | dark | posted; the CR badge paints on, the C2PA row opens, counts climb |
| 4 | fix | 6.72s | 2 | **paper** | the product. brush the mark, Remove, the fill sweeps, Download |
| 5 | clean | 3.84s | 3 | dark | reposted; both markers lift off; the corner is held empty |
| 6 | end | 2.88s | 3 | paper | the hero, verbatim |

**Value journey.** dark · dark · dark · **white** · dark · white. The one flip to
white lands on beat 4 together with the film's one accent seam (`zback`), so the
product's arrival is carried by the cut, the ground and the sound at once.

**Seams.** Five cuts, four kinds, one accent. `zin` (deeper into the same
thought) → `lift` (act break) → **`zback`** (the arrival, spent once) → `across`
→ `up` (into the end card). Both halves of every cut move: exit `power4.in`,
entry `power4.out`, entry travel ~127% of exit travel.

## Design provenance

Every token was measured off the live site's computed styles, not eyeballed.

| token | value | where it came from |
|---|---|---|
| display | Archivo 700, −0.03em | the hero `h1` (62px / −1.86px) |
| UI / mono | Inter 500 14px · JetBrains Mono | body and numeric styles |
| ink | `#0C1927` | `--text-primary` |
| accent | `#4940FF` | the Brush/Download button fill |
| accent text | `#3A32E0` | the "Gemini watermark" chip label |
| border / surround | `#E3EAF3` | control borders and the editor canvas surround |
| radius | **2px** | every control on the site |

Two brand signatures carry the film: the 2px radius (sharp, never rounded), and
the **indigo marker band** behind the display type — the hero's own move, which
the end card is built on.

The editor in beat 4 is a rebuild, not a screen recording: 44px controls, the
Brush/Box/Snip segmented group, the size slider reading `24px`, the disabled
Remove button, the `1080 x 1079 · 69%` chip and the real footer sentence
("Cleaned on your device. A copy is saved to our storage.").

**Claims on screen are all facts from the product's own page:** runs on your
device, full original resolution, no sign-up. The film never claims a size win
and never claims to defeat anything it does not.

**Third parties.** Gemini and X are named the way the product's own landing page
names them, and drawn as plain type with generic glyphs. No third-party brand
artwork is reproduced.

## Assets

- **Demo image** — `assets/demo/planet.png`, 1080×1079, carried over from the
  vectordrop kit. Dark ground, so the corner mark reads clearly arriving and
  leaving.
- **Fonts** — Archivo, Inter, JetBrains Mono, latin subsets from Google Fonts (OFL).
- **Cue set** — 51 cues on 2 tracks, from the kit's synthesised licence-free set.
  Key taps run at the picture's own start and rate (0.12s, 26cps). Every cue is
  attached to something that moves; no soft dissolve is sounded; beat 6 gets one
  hit and is then left alone.
- **Score** — **"Minimal Techno Random Basic 1" by RutgerMuller, CC0** (public
  domain, no attribution required), via the Openverse audio API. Built by
  `lib/bed.mjs`; source kept at `assets/audio/source.mp3` so it is reproducible.
  See "The score" below.

## The score

The first cut shipped on the kit's offline synth fallback, which the skill is
explicit is *not* a score, and it sounded like it. ElevenLabs Music was out of
credits (`quota_exceeded`, 10 remaining vs 438 required) and Stable Audio Open
needs a manual ~4GB install plus a HuggingFace licence acceptance. So the bed was
sourced from Openverse instead — the earlier "no CC0 results" was a too-narrow
query, not an empty catalogue.

**Choosing it.** Eight CC0 candidates were downloaded and measured rather than
picked by name (`bed-candidates.txt` lists them). With 51 UI cues carrying the
film in place of narration, the deciding metric was how much room a track leaves
in the band those cues occupy:

| | click-band headroom | onsets/s | crest | BPM |
|---|---|---|---|---|
| **Minimal Techno Random Basic 1** | **−30.7 dB** | 4.25 | 5.81 | 124.92 |
| Laid Back Electronic Beat | −19.5 dB | 4.46 | 9.30 | 179.98 |
| Very Very Electronic Beat In C | −17.4 dB | 4.21 | 1.76 | 133.16 |
| Troy's downtempo beat | −17.3 dB | 5.00 | 4.40 | 119.82 |

The winner leaves 11 dB more room than the runner-up and its crest of 5.81 is
percussive-but-even rather than peaky.

**Cutting the film to the music, not the music to the film.** The bed measures
124.92 BPM with its downbeat at +0.364s. Rather than time-stretch it 20% onto the
old 100 BPM grid, the *schedule* was re-gridded to 124.92 and the beat counts
raised (9/9/9/14/8/6 = 55 beats). Every beat got slightly longer, so no animation
needed re-timing. Nothing in the film is time-warped.

**Section.** The track runs 284s and is very even, but dips at ~26s, ~74s and
nearly drops out at ~104s. The bed is cut from **31.10s** — a true downbeat
(0.364 + 16 bars) inside the clean 31–59s stretch.

**Treatment** (`lib/bed.mjs`, all measured):
- −5.5 dB scoop at 3.6 kHz. At −3 dB the track's own hats still peaked at −18 dB
  right where the ticks live, and four cues came out level with the music.
- +1.5 dB shelf at 110 Hz so the pulse has weight on a phone speaker.
- An **act-by-act arc** — 0.70 / 0.80 / 0.88 / **1.00** / 0.90 / 0.84 — with 0.5s
  ramps. The lift lands on the product beat, which is also the value flip and the
  accent cut. Measured −21.8 dB at the open, −19.1 dB on the product beat.
- **Ducks** of −4.7 dB (60 ms in, 260 ms out) under all five cuts and under the
  watermark stamping on. Two low impacts at once is mud; ducking the music is what
  a mix engineer does, and it makes the act breaks land.

**Cue levels were then set against the real bed.** Every cue was measured *in its
own frequency band* at the instant it fires. Anything lifting under 3 dB over the
music was inaudible and was raised by type (click ×1.62, latch ×1.58, thunk ×1.56,
swipe ×1.50, whoosh ×1.44, sub ×1.38, capped at 0.75). Result: **23 of 26** loud
cues measurably clear the bed. The remaining three are broadband sweeps and a low
thunk whose perceptual role is not well captured by peak measurement, and they now
sit over a ducked bed.

Final mix: no clipping (−0.7 dB peak), no silent stretch anywhere in the film.

## Known gaps

1. **No Kling ambient plates.** No Kling credentials are configured, so the
   graphics acts carry moving film grain and the brand's own bloom rather than a
   generated texture.
2. **`#ed-remove` contrast is 1.74:1** at t=12.9s. This is the *disabled* Remove
   button and it is faithful to the live product, which renders it as pale indigo
   with white text. Deliberate.
3. **`pace.mjs` reports 24.4% static.** The metric did not move at all after two
   real motion additions (a travelling shimmer, three climbing counters verified
   changing 14→19 / 6→11 / 203→241), so it is insensitive to element-scale motion
   on a 1920×1080 frame — which is what a workspace film is made of. The first
   cut genuinely was too slow at 44.4%; that was fixed by cutting the runtime and
   giving beats 1 and 3 a second thing to do.
4. **No 9:16 short.** A vertical cut needs the beats re-authored rather than
   cropped — the 1500px editor does not fit a 1080px frame.

## Verification

- `hyperframes lint` — 0 errors, 0 warnings
- `hyperframes check` — passed (0 errors across lint, runtime, layout, motion; one
  intentional contrast warning, item 3 above)
- probe — `Video: h264 1920x1080 30fps` + `Audio: aac 48000 Hz stereo`
- watched end to end in Chrome, every beat, at 1180px

## Bugs found and fixed during the build

Recorded because each cost a render to find and each will recur.

- **A `fromTo` with a non-zero start alpha paints that state from frame 0.** Three
  elements (a ring, a badge ring, the fill sweep) were visible as stray boxes for
  seconds before their cue. Every one needs an explicit `tl.set(el, {autoAlpha:0}, 0)`.
- **`gsap_cold_seek_hidden_fromto_missing_reveal`** — a `fromTo` that only turns an
  element on in its *from*-vars can encode as permanently invisible, because cold
  render workers restore the authored hidden state. Name `autoAlpha` in the
  destination too.
- **A GSAP target that silently does not exist.** `composer("g1-comp", …)` builds
  `#g1-comp-send`, but the send-button tween targeted `#g1-send`, so it never
  animated — surfaced only as a console warning with an empty target name.
- **Two tweens on the same property must never share an instant**, not even a
  butt-joint; lint flags `2.05s and 2.05s`.
- **Backticks inside a comment inside a template literal** terminate the literal.
- The post image was sized to the card's *outer* width and overflowed its padded
  container by 53px.
- The beat-2 meta line was clipped by the image plate's top edge.
- The engagement counts went *backwards* between beat 3 and beat 5.
