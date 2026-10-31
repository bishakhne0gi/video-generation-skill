# Forma · Sanghavi — product walk-through

**Register.** Client product film, not an episode. Directive and measured — the
narrator has operated the console and is handing it over. One clause a sentence.
No hedges, no marketing verbs (DESIGN.md §1 forbids them in the product's own
voice, so the film obeys the same rule).

**The spine.** A name is not a specification (line 04). A sole is (line 13).
Everything between is the console earning the distance.

**Every number below was read off the running product on 2026-09-09**, signed in
as `admin` at `forma-sanghavi-shoes.vercel.app`, or produced by running the
repo's own pipeline offline. Nothing is authored — DESIGN.md §10: *do not invent
an identifier, metric, or status, ever*.

| # | line | source of the claim |
|---|---|---|
| 01 | Five thousand two hundred and nine lasts. Every shoe Sanghavi makes starts on one of them. | topbar + `/overview` — `5,209 LASTS` |
| 02 | *(title, no VO)* | — |
| 03 | Describe the shoe. Cole Haan, gents, size forty-two, round toe. Forma reads the sentence and sets the filters. | typed live; URL became `brand=COLE+HAAN&size=42&cat=Gents&toe=Round` |
| 04 | That returns a hundred lasts, and every one of them reads a hundred percent. A name is not a specification. | live: `100 results`, top 8 all `100% match · rework 0.0 mm` |
| 05 | So give it numbers. Stick length two eighty-five. Ball girth two fifty. Heel height fifteen. | the three fields set live |
| 06 | Now the archive separates. Forma ranks by the cost of the rework, not by resemblance. | `search.ts` / `specGen.ts` — modelleur score, least rework |
| 07 | Your base last. Ninety-eight point nine percent, and seven tenths of a millimetre of work. | live: `CH-521510948-42 · 98.9% match · rework 0.7 mm` |
| 08 | Rasp one millimetre of girth. Grade up three point eight. Putty half a millimetre. The modeller's own words, priced. | live plan text on cards 1, 2 and 5 (`reworkPlan`) |
| 09 | Open it. Taped girths beside the mesh estimate. Forty-six thousand triangles, levelled to the contact plane. | live order sheet: `251 mm · mesh ≈ 252`, `46,915`, `units ok · watertight` |
| 10 | No spec sheet? Hand Forma the mesh. It measures your upload with the instruments the archive was built with. | `POST /api/match-stl`; live chips `Stick 291.5mm · Joint girth 252.7mm · Sole signature ✓` |
| 11 | I uploaded model five two five five one two two seven five. Forma ranked model five two five five one two two seven five first. | live: `ZT-525512275-42 · 99.2% match · base fit 0.41` |
| 12 | Now the harder ask. You have the sole, not the last. Forma reconstructs the featherline it sat on. | `docs/SOLE_MATCHING.md` stage 1; `POST /api/match-sole` |
| 13 | Flat outsole, detected. Inset by the allowance. First out of five thousand two hundred and nine. | live: `detected: flat outsole ✓`, `Sides 1.5mm / Toe·heel 2mm`, `sole fit 0.25` |
| 14 | The sole is the most important piece. Deform the donor, and Forma keeps the bottom you matched on. | verbatim modellers' rule, quoted in `specGen.ts` and `build_signatures.py` |
| 15 | Inventory, labeling, overview. Twelve lasts a page, one locked view, turning together. | live `/inventory`, `/labeling` (243 of 248), `/overview`, compare contact sheet `1/9` |
| 16 | Forma. Find the last you already own. | the sign-off, bookending the title card |

## The demonstration in line 11 and 13 — how it was produced

The film's two strongest moments are one experiment run twice, live in
production, and both are self-verifying:

1. `stls/525512275-42-WO.stl` — a real Sanghavi last, on disk, never uploaded
   before — was handed to **Match an STL**. Forma measured it server-side and
   ranked `ZT-525512275-42` first. **The archive row it found carries the same
   model number as the file.** Nothing in the request said so; the match is
   geometry alone.
2. A **sole** was then built from that same last using the repository's *own*
   regression method (`backend/scripts/dev_verify_sole.py` →
   `make_synthetic_sole`): extract the featherline, dilate outward by the
   Sanghavi edge allowance read from `sole_spec.py` (**1.5 mm sides, 2 mm
   toe/heel**), extrude an open wall tube. That sole was handed to **Match a
   sole**. Forma detected `flat outsole`, inset the allowance back off, and
   ranked `ZT-525512275-42` first again — `99.8% match · sole fit 0.25`.

   The round trip is checkable: the last's true featherline measures **284.5 mm**
   (offline run of `sanghavi_lasts.featherline`), the sole was dilated to
   **288.5 mm**, and Forma read the featherline back out of it at **283.4 mm** —
   **1.1 mm** over a 284 mm last.

## Deliberately not claimed

- **Photographs.** The brief asked for "photos or an STL". The only upload the
  product accepts is `accept=".stl"` (`StlMatch.tsx`) — there is no image path
  in the codebase. The film says *mesh*, and never says photo.
- **CosX.** At the client's request the builder credit and the CosX mark were
  removed from the end card, and the sign-off line re-recorded to drop the
  spoken mention — a card that no longer shows it while the narrator still says
  it is a mismatch. The film now names only Sanghavi.
- **Users / admin.** `/users` returns 404 on the deployment that was filmed, so
  the film shows the four surfaces the dock actually offers.
- **Intake.** The route exists but is hidden from the dock ("Intake paused",
  `nav.ts`) and reads `0 INTAKES` in production. Not shown.
- **Generate.** `generate_from_spec --generate` needs the donor STL on disk plus
  a live DB (README, open decision 1) and was not exercised end to end here, so
  line 14 claims what the deformation *preserves*, never a generated output.
- **A single accuracy figure.** The badge is a similarity display, not the
  ranking — `SOLE_MATCHING.md` §3 says so explicitly — so the film reads the
  fit numbers (`rework`, `base fit`, `sole fit`) that actually rank, and shows
  the badge beside them without leaning on it.
