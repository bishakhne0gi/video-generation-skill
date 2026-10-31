# Ship It — EP 20 · Agent Memory & Skills

**Title:** Read the Label. Open the Book.
**Runtime:** 1:25
**File:** `read-the-label-open-the-book.mp4`

---

## X

Day 20 — Agent Memory & Skills

I measured my own machine: 113 skills, 1.71M tokens. The context window holds 1M.

It doesn't fit. It was never supposed to.

Skills load a 227-token label. The 14,762-token body arrives only when the description matches. 65× cheaper to know a thing exists than to know it.

Memory works the same way — an index in context, the facts on disk.

The one that bites: a memory doesn't know it expired. Still formatted. Still recalled. Confidently wrong since June.

🎬 Ship It EP 20

---

## X — short variant

Day 20 — Agent Memory & Skills

113 skills on my machine. 1.71M tokens. The window holds 1M.

It doesn't fit — and it was never supposed to.

227 tokens to know a skill exists. 14,762 to read it. The agent chooses between one-line promises, then loads.

🎬 Ship It EP 20

---

## LinkedIn

**Day 20 — Agent Memory & Skills**

Everything an agent can do doesn't fit in everything it can hold. I measured it on my own machine rather than quoting anyone: 113 skill files, 1,710,550 tokens all in, against a 1,000,000-token context window.

The resolution is progressive disclosure, and it's three levels:

→ **37,337 tokens** of names and descriptions — always in context
→ **277,907 tokens** of bodies — loaded only when a description matches
→ **1,395,306 tokens** across 942 bundled files — loaded only when a body asks

The skill that made this video costs **227 tokens to know about and 14,762 to read**. A 65× ratio. Nothing is read to make that choice — the agent picks between one-line promises.

Memory is the same mechanism on different material. Skills are what an agent can *do*: procedural, versioned, portable. Memory is what it knows *about you*: one fact per file, an index loaded each session, the facts themselves closed until relevant.

And memory is the half allowed to be wrong. A memory doesn't know it expired — perfectly formatted, confidently recalled, and false since the host was renamed in June. The correct file was in the repo the whole time.

So the rule I'd actually defend: **sort it before you save it.** Procedure becomes a skill. What only you know becomes a memory. Anything the repo already records goes nowhere — a second copy that's allowed to disagree isn't free.

🎬 Ship It EP 20 — "Read the Label. Open the Book."
Next: subagents, and the context you throw away on purpose.

---

## Hashtags

**X:** #AI #AIAgents #ClaudeCode #ContextEngineering #BuildInPublic

**LinkedIn:** #AI #AIAgents #ContextEngineering #SoftwareEngineering #DeveloperTools #BuildInPublic

---

## Credits (put these in the video description)

Music: **"s piano loop"** by arseniiv — CC0 1.0
https://freesound.org/people/arseniiv/sounds/241862

All token figures measured on one machine on 2026-08-13 and captioned as such
on screen. Progressive disclosure is Anthropic's documented term for the
three-level skills mechanism.
