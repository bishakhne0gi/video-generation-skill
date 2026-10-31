---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "You are never sent the film. It is cut into six-second segments, encoded at several bitrates, listed in one text file, and served from a cache near you. That is how one film reaches a million people at once."
destination: youtube
aspect: 1920x1080
language: en
audience: working developers who have used a video player but never shipped one
length: 95s
angle: mechanism
voice: am_michael
style_preset: broadside
---

## Intent

Episode 24 of the tech playlist. Teach how video streaming actually works at
scale — not "there is a CDN", but the four mechanisms in the order they were
invented to solve each other: **segmentation**, **the bitrate ladder**, **the
manifest**, and **edge caching**. Land the reason it is needed with arithmetic
the viewer can check: one 4K stream is ~15 Mbps, a million of them is 15 Tbps,
and no origin serves that.

Register is instructional and direct. The narrator knows the thing and hands it
over in order.

## Customizations

- **Whole film in a hand-painted Ghibli-adjacent register** — the director's
  explicit ask, and the reason this episode does NOT use the Replicate design
  system from EP 23. See `DESIGN.md`. Six painted plates carry the grounds;
  every vector diagram is drawn to sit on paint rather than on a flat field.
- **Renderer: HyperFrames**, third episode running (memory:
  `hyperframes-over-remotion`). Nine frame sub-compositions.
- **The metaphor is load-bearing, not decorative.** The valley is a working
  model of the delivery system and every element maps to something real:
  the mill = the origin encoder, the crates = segments, three crate sizes =
  the ABR ladder, the paper list = the HLS manifest, the village shopfronts =
  edge caches, the wind on the road = throughput. The film cuts from each
  painted metaphor to the real artefact — real `.m3u8` text, real codec
  strings, real arithmetic — so it teaches rather than charms.
- **Carry the motion craft forward** (memory: `episode-motion-craft`): the
  vector law, LEFT current, three reserved vectors spent once each, locked
  frame, no idle wobble, stillness before the climax, numeric seam gate.
- **Ghibli motion, not just Ghibli colour.** The register's own motion signature
  is *wind* — slow, continuous, whole-field drift with a long period. It runs on
  the painted plates only, never on the vector layer, so it never becomes the
  idle wobble the doctrine bans.

## Notes

- Every figure on screen is verified and sourced in `CREDITS.md`. Confirmed this
  run: HLS is **RFC 8216**; Apple's HLS Authoring Specification recommends a
  **6-second** target segment duration; MPEG-DASH is **ISO/IEC 23009-1**; CMAF is
  **ISO/IEC 23000-19**; Netflix states **15 Mbps** as the connection speed for an
  Ultra HD stream. The 15 Tbps figure is that number times one million, shown as
  arithmetic on screen so the viewer checks it rather than trusts it.
- The manifest on screen is **real, valid HLS**, including correct RFC 6381 codec
  strings (`avc1.640028` = H.264 High\@4.0, `avc1.64001f` = High\@3.1,
  `avc1.64001e` = High\@3.0, `mp4a.40.2` = AAC-LC).
- The continuity object is **one segment**, `seg-00412.m4s`, pinned bottom-left
  and changing state as the argument does: `encoded → listed → requested →
  cached → played`. Real, drawn from the film's own manifest. Never a mascot.
- Not the series voice: ElevenLabs is out of credits until 2026-08-31 (memory:
  `series-voice-quota`). Local Kokoro `am_michael`, as EP 22 and EP 23.
- **The subagents promise is now four episodes old** (EP 20, 21, 22, 23). This
  episode is video streaming at the director's explicit request, so the promise
  moves to EP 25 and the end card names it. Flag it to the director rather than
  letting it lapse silently a fifth time.
- Beware the seam-carrier trap (memory: `seam-carrier-must-be-visible`): the gate
  measures motion, not visibility. Every frame's hero content is at full opacity
  from t=0 and rides its own cut.
