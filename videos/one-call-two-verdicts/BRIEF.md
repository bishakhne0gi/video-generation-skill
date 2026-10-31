---
episode: 28
slug: one-call-two-verdicts
title: "One Call, Two Verdicts"
subtitle: "gRPC, and forty-two years of arguing about what a remote call is"
renderer: hyperframes
runtimes: [gsap, animejs]
voice: am_michael
register: newsprint-cutout
date: 2026-08-22
---

# EP 28 — One Call, Two Verdicts

## The conflict, stated once

EP 26's end card named `EP 27 · Subagents`. EP 27's end card named `EP 28 ·
SUBAGENTS`. This episode takes the 28 slot for gRPC at the director's explicit
request, which makes subagents **nine** episodes overdue and the promise broken
on camera three times running. Flagged; the director's call. EP 28's end card
points at `EP 29 · SUBAGENTS`.

## The one idea

**gRPC keeps the shape of a function call and spends its entire design admitting
that it is not one.**

Every feature people list as "gRPC's features" — deadlines in the headers,
sixteen status codes, a verdict in the trailers, four streaming shapes — is the
protocol conceding a specific thing that a local function call gets for free.
The episode is that list, in the order the industry learned it.

## Before / after

- **Before:** gRPC is "the fast binary one." Protobuf, HTTP/2, better numbers
  than REST. A performance choice.
- **After:** gRPC is a *failure* protocol. The binary framing is the boring part.
  The design is a forty-two-year argument about whether you can hide a network
  behind a function signature — and gRPC's answer is *no, so here is the paperwork*.

## Why this arc and not a feature tour

Because the sources make it airtight, and none of it is my invention:

1. **1984** — Birrell & Nelson invent RPC at Xerox PARC to "make distributed
   computation easy," on the stated principle that remote calls should be "as
   close as possible" to local ones. They deliberately **refuse a timeout**
   because local calls do not have one.
2. **Their own Table I** — a null call: **9 µs local, 1097 µs remote.** 122×.
   The abstraction leaks in the paper that proposes it, and they publish the
   number.
3. **1994** — Waldo, Wyant, Wollrath & Kendall at Sun answer with four
   differences, of which **partial failure** is the one that cannot be papered
   over: *"the failure of a network link is indistinguishable from the failure
   of a processor on the other side of that link."*
4. **2015** — gRPC ships, and its own principles page says it is built for
   *"avoiding the pitfalls of distributed objects and the fallacies of ignoring
   the network."* **gRPC names the 1994 rebuttal in its founding document.**
   The arc is not a device I imposed; the protocol claims it.
5. **2016–2026** — the catch. gRPC-Web exists because HTTP/2 framing "is not,
   and will never be, directly exposed by browsers," and the same file predicted
   its own obsolescence "in 1-2 years." It was written 2016-11-08.

## The continuity object

**Call №4171** — one RPC, on a press cutting held by a paperclip, top right,
carrying a rubber-stamped verdict that restamps as the argument moves:
`PENDING → 9 µs LOCAL → 1097 µs REMOTE → ? UNKNOWN → FRAMED → 200 / 5 → OK 0`.
Every state is something the film has just said. Only the stamp changes; the
docket never moves.

## The register

**Newsprint cutout** — the director asked for "newspaper cutout edits." See
DESIGN.md. Three date-stamped EDITION slates carry the acts, because in this
register an act break is a front page and the film's structure *is* the dates.

## Animation runtimes

GSAP owns the timeline spine and every seam, because the seam gate and the house
motion doctrine are written against it. **Anime.js v4.5.0 owns three jobs it is
genuinely better at** — see DESIGN.md § The two runtimes. Vendored locally at
`assets/vendor/anime.umd.min.js` (MIT); nothing is fetched at render time.

## Sourcing policy

Same as EP 27. Every quotation on screen is verbatim, carries its source and
date, and was read in the original — both papers were downloaded and text-extracted,
both gRPC protocol docs were fetched from `grpc/grpc@master`, and the 2016
prediction was checked against the file's **first commit**, not against master.
Anything reported rather than specified is labelled on screen.
