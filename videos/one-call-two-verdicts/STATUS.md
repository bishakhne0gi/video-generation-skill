# EP 28 — where this stands (checkpoint 2026-08-22)

All 17 frames + the continuity docket are authored. `npx hyperframes check .` passes:
0 errors across lint / runtime / layout / motion, 75/75 WCAG AA. Runtime 170.00s (2:50).

## The render on disk is STALE
`renders/video.mp4` predates two changes that have not been rendered yet:
1. **Seam exits** — every cut was a half-seam until now. The seam gate measured the
   encoded file and found 0px of change across the 0.3s before the Z-back cut: entries
   were authored in all 17 frames, exits in none. `build.mjs` now appends the exit
   centrally, chosen by the seam kind of the NEXT frame.
2. **Four retimed tails** — frames 05, 14, 16, 17 had their last beat land ~2s early.

Re-render, then re-run `node frozen.mjs` and `node seamgate.mjs 108.13 0.30`.

## Verified so far (on the stale render, still valid where noted)
- probe: h264 / yuv420p / bt709 / 30fps + AAC 48k stereo — valid
- 16/16 seams enter mid-flight with readable content — valid (entries unchanged)
- frozen-frame test: 17.4s -> 5.4s (3.2%) after eight content beats were added
- bed: under narration -27.8..-25.5 dB (spread 2.3), silent frames spread 0.6, lift +3.7 dB

## Tools built this session (reusable)
- `measure.mjs <frame> <t> <selector...>` — real client rects AND ink boxes from the
  same headless Chrome the renderer uses. Ink boxes are what an overlay gate measures,
  and they run far outside the declared box whenever line-height is under 1.
- `frozen.mjs` — counts CHANGED PIXELS, not mean delta. A mean-delta floor is an area
  metric and called this film's 1097px sweeping bar "frozen".
- `seamgate.mjs <cut> <span>` — ink-extent per frame either side of a cut, from the
  encoded file.
