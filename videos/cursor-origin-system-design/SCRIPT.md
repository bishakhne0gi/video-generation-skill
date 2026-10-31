# SCRIPT — cursor-origin-system-design

**Voice:** Michael (`am_michael`, Kokoro-82M, local)
**Voice settings:** speed 1.0 · en-us
**Voice direction:** Instructional and direct. The narrator is walking you
through a system design problem in the order you would hit it. Every line after
the cold open opens on an instruction verb. One clause per sentence. No hype.

> **Not the series voice.** EP 13–21 are narrated by an ElevenLabs voice that is
> out of credits until 2026-08-31. This is a local model standing in, chosen
> knowingly. Frame 2 carries no line — that is where the bed lifts for the title.

> **Spell the technical bits.** Kokoro mangles `UTC`, `PR` and percentages.
> Times, ids and figures are written phonetically below and appear as real
> numerals and symbols on screen.

---

## Line 1 — The status page (Frame 1)

**Delivery:** Flat, factual, unhurried. Three statements. The last one lands and
stops.

    Seventeenth of August. Thirteen forty U T C. GitHub starts returning errors, and it does not stop for seven and a half hours.

## Line 2 — What shipped (Frame 3)

**Delivery:** Pick up the pace. This is the news.

    That same day, Cursor shipped Origin. Git hosting inside the editor. Browse the repository, open the pull request, review it, merge it, without leaving.

## Line 3 — The launch mode (Frame 4)

**Delivery:** Slow down on "source of truth". That phrase is the whole episode.

    But look at how it starts. Your GitHub repository syncs in. GitHub stays the source of truth. Pushes route back to it, and both sides update in real time.

## Line 4 — Name the shape (Frame 5)

**Delivery:** Direct. This is the teaching line.

    Name that shape. Two systems accepting writes, one of them holding authority. Every replicated system you have ever run has this exact problem.

## Line 5 — Break it (Frame 6)

**Delivery:** Hard stop after "diverge". Let the three options sit.

    Now break it. The authority is returning one request in five as an error. Your mirror has three choices. Refuse the write, queue it, or diverge.

## Line 6 — The real boundary (Frame 7)

**Delivery:** The thesis. Take the pause before "Pull requests".

    Here is the line that matters. Commits are content addressed, so any two copies merge themselves. Pull requests, comments and checks are not. That state lives in one database, and there is only one.

## Line 7 — Why rebuild it (Frame 8)

**Delivery:** Level, confident. This is the argument, not a pitch.

    Now the reason to rebuild any of this. A diff is a rendering, made for your eyes. An agent needs the merge state as data. That is the whole bet.

## Line 8 — Takeaway (Frame 9)

**Delivery:** Three instructions, evenly spaced, then the sign-off.

    Mirror the content. Name the authority. Decide in advance what happens when it goes dark. Next episode, subagents.
