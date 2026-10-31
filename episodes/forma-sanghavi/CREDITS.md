# Forma · Sanghavi — product walk-through · credits and derivation

**2:19 · 1920×1080 · 30fps · 16 frames · HyperFrames (HTML + GSAP, headless Chrome)**

Made for Sanghavi Shoe Accessories. Not part of the Ship It playlist and not
numbered.

**Revision, 2026-09-10:** the builder credit and the CosX mark were removed from
the end card at the client's request, and the sign-off line re-recorded from
*"Forma. Built by CosX for Sanghavi Shoe Accessories."* to *"Forma. Find the last
you already own."* — dropping the visual while leaving the voice saying it would
have been a mismatch. The line came back 1.14s shorter and the end card's hold
was lengthened by the same amount, so the seam times and every other beat are
bit-for-bit unchanged; the gate was re-run and still passes. The music source was
also vendored into the project (`assets/audio/source-bed.mp3`) — the first build
read it from `/tmp`, which meant the film could not be rebuilt after a reboot.

---

## Licences and attribution — what the description MUST carry

**Music: *"reNovation"* by airtone**, from ccMixter —
<http://ccmixter.org/files/airtone/60674> — licensed **CC BY 3.0**.
**Attribution is required wherever this film is published.** Suggested line:

> Music: "reNovation" by airtone (ccMixter), CC BY 3.0.

There is no share-alike clause, so the film itself carries no licence obligation
beyond that credit. CC BY was preferred over CC BY-SA deliberately.

**Everything else is unencumbered.** The 16 sound-design cues are synthesised
offline and deterministically by this kit (`sfx.mjs`, `editorial` register) — no
licence, no attribution. The narration is generated locally by **Kokoro-82M**
(voice `am_michael`, speed 0.95) — no key, no quota, no per-use licence. Fonts
are **Figtree** and **Manrope**, both SIL Open Font License. Brand marks are the
client's own.

**Not used:** ElevenLabs, for either voice or music. The account was at
30,040 / 30,050 characters when this was built, so both its TTS and its Music
endpoint were unavailable. The local stack was used instead, which is why the
film cost nothing to voice or score.

---

## Every claim, and where it came from

Nothing in this film was authored. DESIGN.md §10 — *do not invent an identifier,
metric, or status, ever* — is the client's own rule, and the film obeys it.
Figures were read off the running product on **2026-09-09**, signed in as `admin`
at `forma-sanghavi-shoes.vercel.app`, or produced by running the repository's own
code offline.

| On screen | Source |
|---|---|
| `5,209` lasts, `11` brands, `69` sizes held, `0` intakes | `/overview` and the topbar, live |
| `Cole Haan gents size 42 round toe` → four chips | typed into the composer live; the URL became `?brand=COLE+HAAN&size=42&cat=Gents&toe=Round` |
| `100 results`, every row `100% match · rework 0.0 mm` | the live result set for that name-only query |
| `CH-521510948-42 · 98.9% · rework 0.7 mm · rasp 1mm girth` | the same query plus stick 285 / girth 250 / heel 15 |
| `grade up 3.8mm`, `girth lands 250.1 ✓`, `putty +0.5mm length` | the plan text `reworkPlan` printed on live cards 2 and 5 |
| `251 mm · mesh ≈ 252`, `46,915` triangles, `958 cc`, `units ok`, `watertight`, ball position `69% from heel` | the live order sheet for `ING-CH-521510948-42` |
| `Stick 291.5mm · Joint girth 252.7mm · … · Sole signature ✓` | what `POST /api/match-stl` measured off the uploaded mesh, live |
| `ZT-525512275-42 · 99.2% · base fit 0.41` | rank 1 of that upload, live |
| `Path Flat outsole`, `Sole length 283.4mm`, `Sides 1.5 / Toe·heel 2 mm` | what `POST /api/match-sole` reported, live |
| `ZT-525512275-42 · 99.8% · sole fit 0.25` | rank 1 of the sole query, live, out of 5,209 |
| `243 of 248 labeled` | `/labeling`, live |
| the 12-up compare grid, `1 / 9` of 100, ISO / auto-rotate | the live compare contact sheet |
| the featherline, the sole outline, the side profile, the 40 stations | measured offline — see below |
| *"The sole is the most important piece."* | the modellers' rule, quoted verbatim in `specGen.ts` and `build_signatures.py` |

## The two demonstrations, and why they are self-verifying

Both are the same experiment, run live in production, and neither needed a
staged input.

**1 — a mesh finds itself.** `stls/525512275-42-WO.stl` — a real Sanghavi last,
on disk, never uploaded before — was handed to **Match an STL**. Forma measured
it server-side and returned `ZT-525512275-42` first. *The archive row it found
carries the same nine-digit model number as the file.* Nothing in the request
said so; the request was a bare mesh, and the match is geometry alone.

**2 — a sole finds its last.** A sole was then built from that same last using
the repository's own regression method (`backend/scripts/dev_verify_sole.py` →
`make_synthetic_sole`): extract the featherline, dilate outward by the Sanghavi
edge allowance read straight out of `sole_spec.py` (**1.5 mm sides, 2 mm
toe/heel**), extrude an open wall tube. Handed to **Match a sole**, Forma
detected `flat outsole`, inset the allowance back off, and returned
`ZT-525512275-42` first again — `99.8% match · sole fit 0.25`.

The round trip is checkable end to end: the last's true featherline measures
**284.5 mm**, the sole was dilated to **288.5 mm**, and Forma read the
featherline back out of it at **283.4 mm** — **1.1 mm** over a 284 mm last.

## The hero geometry is the real thing

`assets/data/last-525512275.json` is the output of the product's own shipped
instrument (`sanghavi_lasts.featherline.extract_featherline`) run over that STL,
plus `sole_spec.inset_contour` and `build_signatures.signature_from_contour`.
So the film's curves are addressable point by point — 256 featherline points,
256 sole points, 40 stations — which is what lets a beat *draw* the outline,
overlay the sole on it, and light one station at a time. A screenshot could do
none of that. Measured: length **284.5 mm**, ball width **93.1 mm**, ball
position **64.2 %**, toe **round**, toe spring **19.9 mm**.

## Deliberately not claimed

- **Photographs.** The brief asked for "photos or an STL". The only upload the
  product accepts is `accept=".stl"` (`StlMatch.tsx`); there is no image path in
  the codebase. The film says *mesh*, and never says photo.
- **Users / admin.** `/users` returns 404 on the filmed deployment, so the film
  shows the four surfaces the dock actually offers.
- **Intake.** The route exists but is hidden from the dock (`nav.ts`, "Intake
  paused") and reads `0 INTAKES` in production. Not shown.
- **Generate.** `generate_from_spec --generate` needs the donor STL on disk plus
  a live DB (README, open decision 1) and was not exercised end to end, so the
  film claims only what the deformation *preserves*.
- **A headline accuracy figure.** `SOLE_MATCHING.md` §3 says the % badge is a
  similarity display and not the ranking, so the film shows the fit numbers that
  actually rank (`rework`, `base fit`, `sole fit`) beside the badge, and leans on
  neither alone. Frame 11 makes the point explicitly: the fifth row carries the
  highest percentage in its set and still ranks last.

## Design

Built on the client's own `DESIGN.md` and on the running console, with one
documented divergence: **DESIGN.md's frontmatter names Gloock as the display
face, and the shipped app renders every headline in Figtree 600.** Verified with
`getComputedStyle($('h1')).fontFamily` → `"Figtree, …"` and
`document.fonts.check('800 48px Manrope')` → `false`. The film wears what ships.

Carried across exactly: the paper ground `#F4F6F8`, the single `#00AEEF` signal,
**zero radius everywhere**, the lit-top/dark-bottom bevel, corner brackets, the
hairline-divided frames, wireframes over solids, the ink CTA, and the L/W/H axis
palette — the one categorical exception in the system, three validated hues bound
to three measurement axes and used nowhere else.

Two accessibility departures from the product, both measured rather than guessed:
the caption ramp was darkened (`#9AA3AF` → `#5C6470`, `#6B7280` → `#575F6B`) and
the accent gained a text-only sibling (`#00688F`), because the shipped values
measure 2.3–4.1 : 1 in the render. That is fine on a screen you sit at and
illegible in a film watched across a room.

## Verification

- `hyperframes check` — **0 errors** (lint, runtime, layout, motion, contrast).
  Runtime went from 73 warnings to 0 after two dead-selector bugs were found and
  fixed; one of them meant the film's central graphic, the sole being walked,
  was animating nothing at all.
- **Seam gate — PASSED, 0 fail / 0 warn across 15 seams**, including the single
  reserved Z-back arrival with matching scale-velocity sign on both halves.
- Every seam eyeballed at cut + 0.06 s. The first pass showed most frames
  entering nearly blank and filling afterwards; the primary mass of each frame
  now rides the cut.
- Audio measured, not assumed: the bed sits **1.5 dB** apart across the fifteen
  narration beats and lifts **2.8 dB** where nobody speaks.

## Motion budget

15 seams: 7 across, 5 lift, and three reserved vectors spent once each — Z-in
into the brand, **Z-back on the arrival** (*"the sole is the most important
piece"*), and up into the sign-off. No camera moves; the frame is locked and the
content moves. Everything is ease-out: no springs, no bounce, no overshoot,
because `DESIGN.md` §6 says the product moves that way.
