# EP 12 facts — compound components, as they actually went at CosX

Unlike EP11, the primary source here is not a paper. It is the founder's own
account of the CosX codebase, given directly. That changes the rules rather than
relaxing them:

- **Nothing on screen is invented.** Every claim below came from Bishakh. If a
  figure is not here, it does not go in the film.
- **Nothing is rounded up.** "Near six hundred lines" stays "near six hundred",
  never "over six hundred".
- **The unflattering parts stay in.** The adoption is uneven and the monolith
  survived. That is the ending, not a footnote. A first-party story is only
  worth telling if it is allowed to be true.

## Where the pattern shows up in CosX

| Kind | What it is | Shared state? |
|---|---|---|
| **Pure slot shells** | card-style container shipping header / title / description / content / footer as separate siblings. The consumer arranges them. | No. Named slots only. |
| **Primitive-library wrappers** | the dialog / menu / select / tabs family: a root, a trigger, a content. | Yes, invisibly, root to children. |
| **Hand-rolled with real context** | a chart wrapper, a toggle group, and in the newer app a modal built from scratch. Root creates the context, children consume it. | Yes, explicitly. |

## The problem

The default instinct was **one component that does everything through props.**

The **filter surface** is the cautionary tale:
- a type file full of variant prop shapes
- one file **near six hundred lines**
- every new filter kind meant another prop, another branch, another conditional render

> "The component knew about every case it might ever be asked to be."

Safe arithmetic, derived not claimed: four independent booleans is **sixteen**
reachable states. Most are meaningless and all of them compile.

## How it was tackled

**Invert ownership.** The parent holds the state and publishes it downward
through context. The children are dumb readers. Adding a variant becomes adding
a **sibling** next to the others, instead of adding a flag inside one component.

Two sub-problems fell out of it:

| Sub-problem | The fix |
|---|---|
| **Controlled vs uncontrolled.** Sometimes the caller owns the value, sometimes it should not have to. | One internal switch at the root: if a value is passed in, defer to it; otherwise keep local state. Same API either way, so the caller never picks a different component. |
| **Orphaned children.** A child rendered outside its parent fails late, at render, far from the cause. | The context hook throws immediately, with a message naming the required parent. The failure becomes loud and local. |

## The honest ending

The pattern was **adopted unevenly**. The clean composed pieces sit next to the
monolith they were meant to replace, and **the monolith is still the biggest file
in that folder.**

This is the episode's closing beat. It is the equivalent of EP11's "paging buys
memory, not intelligence": the moment the film declines to oversell its own
subject, which is the only reason a technical audience trusts the other twelve.

## Wording rules

- "Near six hundred lines", never "over" and never a precise figure we do not have.
- The three kinds are **not** a maturity ladder. Slot shells are not a worse
  version of context components; they are the right answer when there is no
  shared state. Do not imply progression.
- CosX is the subject, not the sponsor. The brand appears on the end card and in
  one mark animation. The episode teaches the pattern; the credibility comes
  from showing our own unfinished migration.
