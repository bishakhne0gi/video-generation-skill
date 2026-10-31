---
episode: 27
slug: a-new-verb
title: "A New Verb"
subtitle: "HTTP got its first new method in sixteen years"
workflow: faceless-explainer
renderer: hyperframes
register: editorial-annotation
voice: am_michael (Kokoro-82M, local)
length_target: ~115s
date: 2026-08-22
---

# EP 27 — A New Verb

## The one idea

**A read that is too big for a URL has had no honest way to be sent.**
GET cannot legally carry a body. POST can, but POST means *this might change
something* — so every cache, every retry and every prefetch in the path steps
back. RFC 10008 gives that request its own word: **QUERY** — a read, with a
body, that says so out loud.

## Before / after

| | |
|---|---|
| **Before** | "`POST /search` is fine. Everyone does it." |
| **After** | "POST tells the network it might have changed something, so nothing can cache it, retry it or prefetch it. QUERY is the word that says *read*." |

## Where it sits

EP 27 of the Ship It playlist. **EP 26's end card names `EP 27 · Subagents`** —
the director took this slot for QUERY instead, so subagents moves to EP 28 and
is now eight episodes overdue. Flagged; the director's call.

## Register

**Editorial annotation** — a Vox-style explainer, and the first *light* episode
in the playlist (EP 22–26 were all dark grounds). Cream paper, heavy grotesque,
one yellow highlighter, one red pen. The recurring surface is a **printed page**
and the recurring gesture is **drawing on it**. See `DESIGN.md`.

Two mechanics carried deliberately from Vox's own house craft, and both are
documented in `CREDITS.md` as homage rather than coincidence:

- **The highlight sweep** — a yellow marker wiping across a phrase as the
  narration reaches it. Vox's most-copied single move.
- **Animation on twos** — Vox animates graphics at 12fps inside a 24fps
  timeline for a handmade, slightly choppy feel. Here the *annotation layer*
  steps at 15fps inside a 30fps render; the camera and the seams stay smooth.

## Sourcing

Every technical claim in this film comes from a published specification, and the
two that matter are quoted verbatim on screen:

- **RFC 10008**, *The HTTP QUERY Method* — Reschke (greenbytes), Snell
  (Cloudflare), Bishop (Akamai). Standards Track, **June 2026**.
- **RFC 9110**, *HTTP Semantics* §9.3.1 — the sentence that makes GET-with-a-body
  unusable.

Adoption claims (Node, OpenAPI 3.2, framework support, CORS preflight) are
secondary reporting, not spec text, and the film attributes them as *reported*
rather than stating them as spec. `origin`-style invented data: none — the
example query in the film is the RFC's own (`q=foo&limit=10&sort=-published`),
extended into a realistic product filter.

## Continuity object

**One query.** A small taped index tab, top-right, carrying a mono id and a
state word that changes when the argument does:

`too long` → `no semantics` → `mislabelled` → `uncacheable` → `QUERY` →
`cacheable` → `shareable` → `not routed yet`

## Owed on delivery

- A human viewing pass with sound on.
- Social copy, still unwritten for EP 21–26.
