---
workflow: faceless-explainer
flow: automation
voice: am_michael
style_preset: broadside
length: 100s
---

# EP 25 — Your Source of Truth Went Down

## Intent

The system design of Cursor Origin, taught through the thing that happened to it
on day one: it launched as a mirror of GitHub, with GitHub designated the source
of truth, on the same day GitHub returned errors for seven and a half hours.

**The one idea:** git content merges because it is content-addressed; forge
metadata — pull requests, comments, checks, issues — does not, because it lives
in exactly one database. That boundary is why "GitHub is down" is survivable for
your code and fatal for your workflow, and it is the constraint any GitHub
alternative has to design around.

**Before → after:** the viewer thinks a GitHub alternative is a UI problem. They
leave knowing it is a replication problem with a designated primary, and that
the hard part is the metadata, not the commits.

## Customizations

- **Register: maximalist claymorphism + glassmorphism.** Replaces EP 24's
  hand-painted Ghibli system outright. Clay is the furniture; glass is the type
  surface. See DESIGN.md.
- Both supplied logos used as real assets (Cursor, GitHub), never redrawn.
- Continuity object: one pull request, `origin/pr-118`.

## Notes

- **Cursor has published no architecture for Origin.** Every internal-mechanism
  claim in this film is either (a) sourced to Cursor's own public description, or
  (b) general distributed-systems reasoning that applies to any system making
  those claims. Beat 5 onward is explicitly framed as the shape of the problem,
  not as a leak of Origin's internals. CREDITS.md marks which is which.
- The GitHub outage is reported variously as six, seven and eight hours. The
  film uses the status-page timeline: 13:40 → 21:15 UTC, stated as
  "seven and a half hours".
- **Subagents is now SIX episodes overdue.** EP 25 was the director's explicit
  request; the end card names EP 26 · Subagents.
