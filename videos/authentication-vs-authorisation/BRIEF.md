---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "Authentication proves who you are. Authorisation decides what you may touch. Skipping the second is the #1 security risk on the web."
destination: youtube
aspect: 1920x1080
language: en
audience: working developers who ship APIs and web apps
length: 80s
angle: concept
voice: am_michael
style_preset: broadside
---

## Intent

Episode 23 of the tech playlist. Teach the difference between authentication and
authorisation through one real-life example a viewer already understands — a
hotel keycard — then land the reason it matters: the two checks are separate, and
leaving out the second one is Broken Access Control, ranked #1 in the OWASP Top
10 2025.

Register is instructional and direct, not a podcast and not a trailer. The
narrator knows the thing and hands it over in order. Editorial-zine surface
rather than dark-terminal SaaS: warm cream paper, one hot orange used as a stamp,
massive tight display type, dark code wells that read as printed pull-quotes.

## Customizations

- **Renderer: HyperFrames**, not Remotion — the director's standing preference
  (faster render, native bt709, numeric verification). Second episode on it.
- **Design system is supplied**, not chosen: the **Replicate** system, verbatim in
  `DESIGN.md`. Cream `#f9f7f3` canvas (never white), one orange `#ea2804` used at
  most once per viewport, three-family type stack, everything interactive fully
  rounded, code wells always dark. The `broadside` preset is the structural
  starting point only; the tokens are Replicate's.
- **Use the catalog.** EP 22 hand-authored every frame and skipped the 375-block
  registry; this episode draws on it. Committed: `code-diff` (the bug and its
  fix), `split-flap-board` (the 403 resolving mechanically), `mk-progress-stat`
  (the OWASP figure), `halftone-field` (the shader ground under the dark code
  act), plus `grain-overlay` and `vignette` as texture.
- **Shader backgrounds** — a real GPU shader ground, not a CSS gradient, on at
  least the dark act.
- **Real photographic images** in the hotel beats, graded to the cream/orange
  palette so they read as editorial rather than as stock.
- **Carry the Remotion-era motion craft forward** (memory: `episode-motion-craft`):
  the vector law, the LEFT current, reserved Z vectors spent at most twice, locked
  frame, no idle wobble, stillness before the climax, numeric seam gate.

## Notes

- Every figure on screen must be verified and captioned with its source. Confirmed
  this run: **OWASP Top 10 2025, A01 Broken Access Control** — #1, 40 CWEs mapped,
  **1,839,701 occurrences**, 32,654 CVEs, 100% of tested applications, average
  incidence 3.74%. Its own prevention wording — *"Enforce record ownership rather
  than allowing users to create, read, update, or delete any record"* — is the
  film's fix. **RFC 9110** for the 401/403 semantics.
- Not the series voice: the ElevenLabs voice is out of credits until 2026-08-31
  (memory: `series-voice-quota`). Local Kokoro `am_michael`, as EP 22.
- The continuity object is the **HTTP status** — `401` → `403`. Real, observable,
  and it carries the episode's sharpest insight: 401 is *named* "Unauthorized" but
  it means unauthenticated. Never invent a mascot.
- Beware the grey-slab failure mode (memory: `grey-slab-failure-mode`) — this is a
  light canvas and the code wells are dark. Never dim a well with opacity; dim its
  contents.
- EP 20, 21 and 22 all end promising "next: subagents". That promise is still
  unpaid and this episode must not add a fourth. It names EP 24 explicitly.
