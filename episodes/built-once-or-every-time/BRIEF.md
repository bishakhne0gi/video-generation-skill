---
episode: 29
slug: built-once-or-every-time
title: "Built Once, or Built Again Every Time"
subtitle: "SSG and CSR are the same page, produced at two different moments, at two different people's expense"
renderer: hyperframes
runtimes: [gsap, animejs]
voice: am_michael
register: press-proof
design_system: replicate
date: 2026-08-23
---

# EP 29 — Built Once, or Built Again Every Time

## The conflict, stated once

EP 26's end card named `EP 27 · SUBAGENTS`. EP 27's named `EP 28 · SUBAGENTS`.
EP 28's named `EP 29 · SUBAGENTS`. This episode takes the 29 slot for rendering
strategies at the director's explicit request, which makes subagents **ten**
episodes overdue and the promise broken on camera four times running. Flagged;
the director's call. EP 29's end card points at `EP 30 · SUBAGENTS`.

## The one idea

**SSG and CSR are the same page, produced at two different moments. The question
is never which is faster — it is whether the page's content exists before the
request.**

Everything people argue about downstream — bundle size, first paint, hydration,
SEO — falls out of that one question. If the content exists before anyone asks,
a build step can put it in the HTML and every visitor gets it for free. If it
does not exist until the request (your drawing, your inbox, your cart), no build
step on earth could have put it there, and something has to construct it later.

The film is fair to both. It is not "SPAs are slow." The turn at the middle is
Excalidraw's own on-screen sentence — *"Your drawings are saved in your browser's
storage"* — which is the honest reason its `<div id="root">` is empty. The
failure named at the end is the real one in the wild: shipping an empty div for a
page whose content **did** exist at build time.

## The evidence — all of it measured or quoted today

Nothing in this film is illustrative. Every number was taken from the live web on
2026-08-23, and every sentence in a quotation mark is verbatim from a primary
source. The two subjects are **jekyllrb.com** (built by Jekyll, served by GitHub
Pages — MIT) and **excalidraw.com** (a React SPA on Vercel — MIT). Both projects
are open source, so their HTML is quotable in full.

### Measured, identical conditions

Chrome DevTools, **Slow 4G + 4× CPU throttle, cold cache**, same device, minutes
apart. Raw traces archived in `research/`.

| | jekyllrb.com (SSG) | excalidraw.com (CSR) |
|---|---|---|
| TTFB | 16 ms | 74 ms |
| **First Contentful Paint** | **1,728 ms** | **6,836 ms** |
| Largest Contentful Paint | 1,630 ms | 7,105 ms |
| load event | 2,877 ms | 6,800 ms |
| HTML over the wire | 3,449 B (gzip) | 2,391 B (br) |
| HTML decoded | 10,393 B | 6,862 B |
| JavaScript over the wire | 48,113 B | **855,457 B** |
| JavaScript decoded (main bundle) | — | **2,165,763 B** |
| all subresources | 268,916 B | 895,441 B |
| `document.body.innerText` | 1,119 chars | 201 chars |

Two facts the table is built to land:

1. **The CSR page sent LESS HTML** — 2,391 bytes against 3,449 — and still took
   five seconds longer to show anything. The HTML was never the cost.
2. **FCP 6,836 ms lands on the load event at 6,800 ms.** On a client-rendered
   page, first paint is not early — it is last. Nothing appears until everything
   has arrived.

### The ETag — the continuity object

```
etag: "6a3960e0-2899"      jekyllrb.com, GitHub Pages
```

`0x6a3960e0` = 1782145248 = **Mon, 22 Jun 2026 16:20:48 GMT** — which is exactly
the `last-modified` header. `0x2899` = **10393** — which is exactly the byte
count. *When it was built, and how big it came out.* Two facts, both fixed two
months before the request, neither of which involves the visitor. Decoded and
verified; the arithmetic is in `research/`.

Excalidraw's ETag is `"048dfd962c80b256c88cecf254e4a4e3"` — a content hash, no
timestamp, no size. Shown as a contrast, with no claim made about its meaning.

### Verbatim quotations

- **Tom Preston-Werner, "Blogging Like a Hacker", 17 Nov 2008** — *"Jekyll is a
  simple, blog aware, static site generator. It takes a template directory …
  and spits out a complete, static website suitable for serving with Apache or
  your favorite web server."*
- **web.dev, "Rendering on the Web", Addy Osmani & Jason Miller, published
  6 Feb 2019, last updated 5 Jan 2026** — *"Static rendering happens at build
  time."* · *"Rendering an app in a browser, using JavaScript to modify the
  DOM."* · *"The primary downside to client-side rendering is that the amount of
  JavaScript required tends to grow as an application grows, which can impact a
  page's INP."*
- **Create React App, `packages/cra-template/template/public/index.html`,
  lines 30–33** — `<noscript>You need to enable JavaScript to run this app.</noscript>`,
  `<div id="root"></div>`, and the comment *"This HTML file is a template. If you
  open it directly in the browser, you will see an empty page."*
  Excalidraw's live production HTML today carries the first two lines, in that
  order, unchanged. The shell that ships is the template's shell.
- **Excalidraw, on its own start screen** — *"Your drawings are saved in your
  browser's storage."*

### The two renderings

`assets/web/ssg-nojs.png` and `assets/web/csr-nojs.png` are the two delivered
documents, rendered at 1200×900 @2×, with every `<script>` element removed and a
`<base>` tag added so stylesheets and images still resolve. Nothing else was
changed. One is a complete website. One is a white rectangle. The film says on
screen exactly what was done to produce them.

`research/film-ssg/` and `research/film-csr/` are the real filmstrips extracted
from the Chrome traces — 240×498 JPEGs with their true millisecond offsets in the
filenames. Used at thumbnail size only, which is their honest resolution.

## The arc

| Act | Frames | Field | Asks |
|---|---|---|---|
| 0 | open, title | cream → orange hero | what came back? |
| 1 · WHAT CAME BACK | bytes, template, etag | cream | what is actually in the HTML? |
| 2 · WHEN | when, jekyll08 | dark code-story band | when was it built, and by whom? |
| 3 · WHAT IT COSTS | bundle, strip, paint | cream | what does the difference cost? |
| 4 · THE TURN | turn, exist, rule, mistake | cream → orange | why is the div empty, and when is that right? |
| 5 | end | black footer | what to do on Monday |

The **Z-back is reserved for `paint` → `turn`** — the moment the film stops
prosecuting CSR and starts defending it. That is the thesis landing, and it is
spent once.

## The continuity object

`GET /` — one request line pinned bottom-left on a Replicate status pill,
carrying the state of the answer through the film:

`SENT` → `10,393 B` → `BUILT 22 JUN` → `+855 KB JS` → `6.8 s` → `NOTHING TO BUILD`
→ `ASK FIRST` → `200`

Real values from the table above, held not interpolated. The method and path
never move; only the pill's content changes.

## Sourcing policy

Same as EP 27 and EP 28. Every claim is either (a) a number I measured today with
the tool and conditions named on screen, (b) a sentence quoted verbatim with its
source and date on the frame, or (c) marked as my own gloss by its typeface. A
figure with no visible provenance does not go on the frame.

Two honest caveats that must appear in `CREDITS.md` and, where they change the
reading, on screen:

- **Excalidraw registers a service worker.** The second visit is a different and
  much better story than the cold one measured here. The film says "cold cache,
  first visit" on the frame that carries the number.
- **These are two sites, not a benchmark.** The measurement demonstrates the
  mechanism; it is not a population study. jekyllrb.com is also unusually lean and
  excalidraw.com is an unusually heavy application. Named on screen.
