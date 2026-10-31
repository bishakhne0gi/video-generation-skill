# VectorDrop — launch film

**Register.** Product launch, not an episode. Directive but warm: the narrator
has used the thing and is handing it over. One clause a sentence. No hedges.
Every number below is measured, not estimated — see CREDITS.md for provenance.

**The spine.** A raster falls apart when you zoom (line 02). A vector does not
(line 06). Everything between those two lines is the product earning that claim.

| # | line | source of the claim |
|---|---|---|
| 01 | This is a twenty kilobyte JPEG. Four hundred pixels square. Watch what happens when you need it bigger. | `elon.jpg` = 20,059 bytes, 400×400 |
| 02 | It falls apart. Every raster does. There is nothing inside the file to zoom into. | — |
| 03 | VectorDrop rebuilds it as a vector. Drop the image in — that is the entire interface. | dashboard dropzone |
| 04 | Four stages run. Normalize, quantize, trace, assemble. Nine seconds for this one. | `ConversionStep` = upload/normalize/trace/assemble; measured 9s live |
| 05 | Thirty-one paths come back. Real bezier curves, stacked dark to light, every one of them editable. | 32 clusters → 31 paths; `quantize.ts` sorts dark→light |
| 06 | Now zoom again. Forty times in, and every edge is still exact. That is the whole point. | `editorStore.ts` clamps zoom to 0.05–40 |
| 07 | Click any path. Change its fill, its opacity, or its shape, down to the anchor point. | Properties panel + MOVE/BEND/ADD/CUT |
| 08 | Take one trace three ways. Full colour, grayscale, or a hard stencil for vinyl and screen print. | Color / Grayscale / Black-and-white, 0–100 |
| 09 | Save a version. Switching between them costs nothing. Export SVG, or PNG at one or two times. | "VERSIONS · SWITCHING IS FREE"; export menu |
| 10 | It opens in Figma, in Illustrator, or straight into your build. No plugin, no round trip. | landing copy |
| 11 | Five hundred people are already using it. | the milestone |
| 12 | Sign up and three credits are on us. No card, no trial timer. | `SIGNUP_GRANT_UNITS = 30` = 3 credits |
| 13 | VectorDrop. Turn any image into editable vectors. | the hero headline, verbatim |

**Deliberately not claimed.** Icon generation ships as `Soon` in the editor
toolbar, so the film never mentions it. The SVG is *larger* than the source
JPEG (204 KB vs 20 KB), so the film never claims a size win — it claims scale,
which is the true one.
