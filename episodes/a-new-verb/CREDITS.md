# EP 27 — "A New Verb"

`episodes/a-new-verb.mp4` · **2:16.97** · 1920×1080 · h264 / yuv420p / bt709 / 30 fps ·
AAC 48 kHz stereo · 13.6 MB. Rendered with **HyperFrames 0.8.8** in 1m 39s.

---

## The honesty note

Everything the film asserts about the QUERY method comes from **RFC 10008** or
**RFC 9110**, and the two sentences that carry the most weight are on screen
**verbatim**, with their section numbers:

- *"content received in a GET request has no generally defined semantics … might
  lead some implementations to reject the request and close the connection because
  of its potential as a request smuggling attack"* — RFC 9110 §9.3.1, elided once,
  and the ellipsis is shown.
- *"it is not readily apparent … that a safe, idempotent query is being performed"*
  — RFC 10008 §1.
- *"MUST incorporate the request content"* — RFC 10008 §2.7.
- *"they all originate from the WebDAV activity, about which many have mixed
  feelings"* — RFC 10008 Appendix B.

**Frame 10 is the RFC's own Table 1**, transcribed rather than invented, including
POST's *"potentially no"* and GET's *"no defined semantics"* — those are the spec's
words, not a characterisation.

**Frame 13 is not spec text and says so on screen.** CORS safelisting, method
allowlists and framework support are secondary reporting from August 2026, and the
frame carries the label `REPORTED, AUGUST 2026 — NOT RFC TEXT` under the three
cards. It would have been easy to let the RFC's authority cover them. It doesn't.

**The one illustrative figure is labelled.** Frame 7's counter (the same query sent
again, 9,140 times in an hour) is captioned `ILLUSTRATION`. It is a demonstration of
what "uncacheable" means, not a measurement of anything.

**The arithmetic is real.** The cold open's `8,079 bytes` is the measured length of
the string `frames/01-open.mjs` generates: an 79-character base plus 400 × 20-byte
`&id=<16 chars>` — so "it has just passed eight thousand bytes" is a fact about the
file, not a claim. `… and 354 more ids` is computed from what fits on the sheet.

**Invented:** the endpoint `api.shop.example`, the 400 product ids, the two cache
digests (`3f1a`, `c082`), the URLs `/products/r/8f21` and `/products/q/4f2a`, and
the continuity id `req#4f2a`. All are illustrative request data of the kind the RFC
itself uses; none is presented as a real system.

---

## Sources

| Claim | Source |
|---|---|
| QUERY is safe, idempotent, cacheable, body-carrying | RFC 10008 §2, §2.7 |
| Published June 2026, Standards Track; Reschke / Snell / Bishop | RFC 10008 front matter |
| The cache key MUST incorporate the request content | RFC 10008 §2.7 |
| `Content-Location` = the results; `Location` = the query | RFC 10008 §2.3, §2.4 |
| `Accept-Query` advertises support | RFC 10008 §3 |
| PROPFIND / REPORT / SEARCH, and the WebDAV line | RFC 10008 Appendix B |
| The GET/QUERY/POST property table | RFC 10008 §1, Table 1 |
| Senders SHOULD support at least 8000 octets in a request line | RFC 9110 §4.1, cited via RFC 10008 §1 |
| Content in GET has no generally defined semantics | RFC 9110 §9.3.1 |
| PATCH is RFC 5789 (2010); the WebDAV methods are RFC 4918 / 3253 / 5323 | IANA HTTP Method Registry |
| CORS preflight, allowlists, Node since 2024, OpenAPI 3.2 | secondary reporting — labelled on screen |

Both RFCs were downloaded and read in full (`rfc-editor.org/rfc/rfc10008.txt`,
`rfc9110.txt`); no quotation is second-hand.

---

## The register — "The Annotated Page"

First **light** episode in the playlist; EP 22–26 were all dark grounds. Full system
in `DESIGN.md`. Two mechanics are deliberate homage to Vox's own house craft, and
naming them is the point of this section:

- **The highlight sweep** — a yellow marker wiping across a phrase as the narration
  reaches it. Vox's most-copied single move. Ten of them in this film.
- **Animation on twos** — Vox animates graphics at 12fps inside a 24fps timeline for
  a handmade, slightly choppy feel. Here the **annotation layer** steps at 15fps
  inside a 30fps render (`st(dur)` → `steps(round(dur × 15))`), which is the closest
  clean division. The **seams are never stepped**: a velocity-matched `power4` cut
  rendered on twos reads as a dropped frame, not as craft.
- The "don't make it perfect" rule is Vox art director **Joey Sendaydiego's**, quoted
  in `DESIGN.md`. Every cut-out carries a deterministic rotation between ±1.4°.

Nothing of Vox's is used: no logo, no typeface of theirs, no asset. The palette,
type and layout are this film's own.

### Measured contrast

**1090/1090 text checks pass WCAG AA.** The palette needed two decisions to get
there, both recorded in `DESIGN.md`:

- Red has **two values**. `--pen #DC3220` measures 4.12:1 on paper — large-text only
   — so it is **strokes only**. `--pen-type #B32414` measures 5.86:1 and is the only
  red allowed to be a letter.
- On the navy field the pen would measure 3.38:1, so **on navy the annotation colour
  becomes yellow**, and the marker carries **navy type on yellow** (12.81:1) rather
  than cream.

---

## Verification

| Gate | Result |
|---|---|
| `hyperframes check` — lint | 0 errors, 0 warnings |
| — runtime | 0 errors, 0 warnings |
| — layout | 0 errors, 0 warnings, 3 infos (deliberate clipping) |
| — motion | 0 errors, 0 warnings |
| — contrast | **1090 / 1090 pass WCAG AA** |
| Cut snapshots at +0.06s | **13 / 13** enter with readable content mid-flight |
| Frozen frames (energy ≈ 0 for ≥1s) | **0.0s** |
| Marker coverage, measured in the render | **10 / 10** cover their phrase |
| Narration level across the film | −23.8 … −21.9 dB, **spread 1.9 dB** |
| Bed lift on the music-only frames | **+2.9 dB** (target 1.5–3.0) |
| Programme peak | −0.9 dBFS |
| Playback in Chrome, sound on | **decoded; 279-sample audio trace, zero dropouts** |

### The viewing pass — done, and this time it worked

EP 26 and the VectorDrop film both shipped owing a sound-on review, because Chrome
in this environment would not decode local media. It does now. The film was served
over HTTP with byte ranges, played end to end at 4× through a `MediaElementSource`
→ `AnalyserNode`, and sampled every 120 ms: **279 samples, min −40.8 dB, max −16 dB,
mean −26 dB, and not one run below −60 dB.** There is no silent stretch anywhere in
the film. The Z-back seam (`cost → slate`, 69.13s) was stepped frame by frame out of
the encoded file and both halves share the sign of the scale velocity — no bounce.

### Pacing — two numbers, and the honest reading

`pace.mjs` reports **67.8% static**. That number needs its context, and the tool
supplies it in its own source:

> *"This floor is ABSOLUTE, and it was set against EP08–EP10 — dark, dense,
> card-heavy films where any change moves a large share of the pixels. A white,
> minimal, type-led film scores far lower for the same amount of visible motion."*

EP 27 is exactly that film. Its whole motion-energy distribution sits below the
absolute floor of 1.6: **p25 = 0.31, p50 = 0.68, p90 = 11.5.** Scoring it against a
floor derived from its own p25 gives **7.6% static**, inside the ~15% target.

That is an explanation, and it is not the whole answer, so here is the check that
does not depend on calibration: **how much of the film is literally frozen?** The
first cut measured **5.8s (4.3%)** of stretches where not one pixel moved for a
second — four of five sitting in frame tails, after the last mark landed and before
the exit began. Those are real dead air. They were closed by **content, never by a
camera move**:

- every designed tail cut (runtime 146.1s → 137.0s);
- **frame 3** now counts the gap — sixteen years spent on screen as sixteen years,
  2010 → 2026, instead of a caption saying so;
- **frame 7** runs a counter for its whole length: the same query, sent again;
- **frame 9** performs the second request — `Location`'s entire purpose, which the
  frame had been claiming in a caption;
- **frame 10** disqualifies GET on the one cell that disqualifies it;
- **frame 11** shows the cache **HIT**, which is the payoff the caching argument
  was missing;
- **frame 13** turns its three problem cards over into three instructions.

Final: **0.0s frozen.** Every one of those changes made the film say more, which is
the only pacing fix this kit endorses.

**Still owed, honestly:** the register's motion amplitude is genuinely low. A page
that gets marked is a small-area event by construction, and a future episode in this
register should plan one large-area running system per beat from the storyboard
rather than retrofitting six of them.

---

## Craft defects found and fixed

1. **Seven of ten markers under-ran their own phrase.** Widths were estimated from
   character counts against a font whose metrics were never measured. **No gate in
   the pipeline checks this** — lint, layout, motion and contrast all passed while
   the film's signature move was cutting off mid-word (`RFC 911|0`, `to treat| as a
   read`). Found by scanning the render for the yellow band and the phrase's ink
   extent, then widening each from the measured number.
2. **A CSS `skewX` on the marker was destroyed the moment `scaleX` was tweened** —
   GSAP overwrites the whole transform. The skew now rides in both tween var sets.
3. **Every product id rendered as `undefined`** — `a | 0 & 31` is `a | (0 & 31)`;
   `&` binds tighter than `|`.
4. **A bare `2010` floated in the year gap** before its label arrived, reading as a
   stray caption rather than a clock. Hidden until it starts counting.
5. **Frame 13's card flip put two text blocks in one slot** at low opacity — the
   layout gate was right to fail it. The problem line is now replaced, not dimmed.
6. **Frame 9's `QUERY` correction sat on the sheet's rule**; the request block moved
   down so the written-in mark has air.
7. **`hyperframes tts` reads "HTTP" and "URL" fast enough to be ambiguous.** Both
   were respelled letter-by-letter in `SCRIPT.md` and re-recorded.
8. **Line 1 was rewritten to match the arithmetic.** The first draft said "three
   filters, a sort, a page size", which does not reach 8,000 bytes. The visual and
   the claim now agree because both come from the same generated string.
9. **The bed's first mix was 12.4 dB uneven across spoken frames.** Fixed with a
   faster `dynaudnorm` plus three hand-drawn envelope segments (a lift on the title,
   a step-back on the turn, a dip where the source peaks under `cachekey`).

---

## Assets and provenance

**Fonts** — all `wOF2`-verified, self-hosted, no runtime fetch.

| Face | Role | Licence |
|---|---|---|
| Archivo (variable) | headlines, deck | SIL OFL 1.1 |
| Instrument Serif 400 + italic | spec quotations, kickers | SIL OFL 1.1 |
| JetBrains Mono 400 / 700 | every technical token | SIL OFL 1.1 |

*Naming hazard noted:* the serif is declared as `font-family: "Serif"`, which
collides with the CSS generic. It resolves correctly in the render but defeated an
out-of-band measurement page. A future episode should name it `InstrumentSerif`.

**Music** — *"Iceberg 20 Below"* by **Loveshadow**, ccMixter, **CC BY 3.0**
(<https://ccmixter.org/files/Loveshadow/23792>). **Attribution is required in the
episode description.** Not share-alike — checked before ranking, per the standing
concern about EP 23.

Chosen by measurement, not audition: 848 candidates harvested across ten tags, 150
downloaded, all 150 measured for duration, overall level, 1–4 kHz speech-band level
and sub-500 Hz body. 121 passed the duration and loudness floor; the top ten were
ranked on **speech-band carve** and their spectrograms were read. Iceberg 20 Below
won by a clear margin — carve **26.2 dB**, and a spectrogram whose upper region is
essentially black, which is where the narration lives.

**Offset 0 was kept deliberately, and it is not the loudest option.** The track fades
in under the cold open, breaks down at source 72–80s — which lands on the turn — and
peaks through 92–132s, which is the payoff act. Loudness at the music-only frames is
what the duck is for, and it delivers +2.9 dB there.

**Voice** — Kokoro-82M `am_michael` at speed 0.95, run locally. The series
ElevenLabs voice is still out of credits (verified: `401` on 2026-08-22; quota
resets 2026-08-31).

**Sound design** — 16 cues synthesised offline in the **editorial** register (woody,
paper), `node sfx.mjs --register editorial`. Licence-free, deterministic. 178
frame-local cues plus 13 seam cues across 3 tracks. Every cue is attached to
something that moves; the pen is the loudest thing on screen, so the marker sweeps
and the pen strokes carry the cue layer and almost nothing else does.

---

## Structure

136.97s, 14 frames, four acts. Every second derived in `schedule.mjs` from the
measured VO lengths — nothing hand-timed.

| # | frame | len | start | seam in | field |
|---|---|---|---|---|---|
| 1 | open | 10.43 | 0.00 | — | paper |
| 2 | title | 5.22 | 10.43 | lift | **yellow** |
| 3 | shelf | 10.43 | 15.65 | lift | paper |
| 4 | getbody | 12.39 | 26.09 | across | paper |
| 5 | post | 7.83 | 38.48 | across | paper |
| 6 | notapparent | 9.78 | 46.30 | across | paper |
| 7 | cost | 13.04 | 56.09 | across | paper |
| 8 | slate | 2.61 | 69.13 | **z-back** | **navy** |
| 9 | query | 10.43 | 71.74 | across | paper-2 |
| 10 | table | 10.43 | 82.17 | across | paper-2 |
| 11 | cachekey | 10.43 | 92.61 | across | paper-2 |
| 12 | name | 11.74 | 103.04 | lift | paper |
| 13 | catch | 11.09 | 114.78 | across | **navy** |
| 14 | end | 11.09 | 125.87 | lift | **yellow** |

Three seam kinds only — across ×9, lift ×3, z-back ×1. The z-back is the reserved
vector and is spent once, on the turn. The variety in this register lives in the
annotation layer, not in the cutting, which is a deliberate departure from the
kit's "4–5 house kinds" guidance and is stated here rather than hidden.

**Continuity object:** one request, `req#4f2a`, followed on a taped index tab that no
cut can interrupt — `TOO LONG` → `NO SEMANTICS` → `MISLABELLED` → `UNCACHEABLE` →
`QUERY` → `CACHEABLE` → `NOT ROUTED` → `SHAREABLE`. Only the state changes; the id
never moves, because the point is that it is the same request.

---

## Not done

- **No registry blocks.** The 375-block catalog is the director's standing
  preference and this film uses none of it. Deliberate: catalog blocks own their own
  canvases and container colours, and this register's whole discipline is one paper,
  one marker, one pen, no coloured edges on any container.
- **No 9:16 vertical cut.** The wide table (frame 10) and the five-node chain (frame
  6) need vertical variants; they would not survive a crop.
- **No social copy.** Still unwritten for EP 21–27.
- **The bed's attribution must go in the episode description** — CC BY 3.0 is not
  satisfied by this file alone.
