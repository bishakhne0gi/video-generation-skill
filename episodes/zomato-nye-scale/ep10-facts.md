# EP10 — Zomato NYE. Sourced facts only.

Every number that appears on screen or in the VO must be in this file with a
source. If it isn't here, it doesn't go in the film.

## Status of sourcing

`blog.zomato.com` 301s to `www.zomato.com/blog/...`, and that host **timed out
on every direct fetch** from this machine. The figures below come from search
indexes quoting those posts, not from the primary page. They are consistent
across independent summaries, but **re-verify against the primary post before
the final render** — a wrong number in an architecture explainer is the one
mistake the audience will not forgive.

## NYE 2023 — the night itself

| Fact | Figure | Source |
|---|---|---|
| Orders on the day | ~3 million | Zomato blog, "A Tale of Scale" |
| Kafka throughput | 450+ million messages/minute | ditto |
| Kafka peak bandwidth | 5.6 GBps total across clusters | ditto |
| Observability | 2.2 billion active time series | ditto |
| Observability peak | 17.8 million per second | ditto |
| LogStore (in-house logging) | 60 TB application logs that day | ditto |
| LogStore peak ingestion | 80 million RPM | ditto |
| Chat support | 19,500 peak concurrent sessions | ditto |
| Chat messages | ~51,400 per minute | ditto |
| Delivery | 60% of orders delivered under 30 min on 1 Jan | ditto |

## The preparation

| Fact | Figure | Source |
|---|---|---|
| Prep window | 15+ days, every team | Zomato blog, "Our learnings from NYE" |
| Benchmark throughput reached | 50 million requests/minute | ditto |
| Requests fired in benchmarking | 30+ billion | ditto |
| Pre-scaled fleet | ~11,000 EC2 instances | ditto |
| Chaos engineering | failures deliberately injected pre-event | Biweekly Engineering ep. 28 |
| In-house benchmarking tool | across hundreds of microservices; name not disclosed | ditto |
| Live watch metrics | timed-out orders, orders/minute, POS relay success | Zomato blog |

## Brand (for the art direction, not the script)

- **Cranberry `#E23744`** — primary brand red, Pantone Red 032 C.
- Neutrals: `#2D2D2D`, `#FFFFFF`, `#F4F4F2`.
- **Okra** is Zomato's typeface and is *a modified Metropolis*. Metropolis is
  open-source, so `@fontsource/metropolis` is the genuine base face, not a
  lookalike. Staged at `public/fonts/Metropolis-{500,700,800,900}.woff2`.
- Their design system is called **Sushi**.

## Deliberately NOT used

- "10 million daily orders" / "100 million search queries" — these appear only
  in third-party SEO blogs, never in Zomato's own engineering posts.
- Anything from the TiDB→DynamoDB billing post: that's a different episode.

## Sources

- https://blog.zomato.com/a-tale-of-scale-behind-the-scenes-at-zomato-tech-for-nye-2023
- https://blog.zomato.com/our-learnings-from-nye
- https://biweekly-engineering.beehiiv.com/p/zomatos-nye-behind-scenes-biweekly-engineering-episode-28
