# EP 21 — "Ask the Replica. It Answers From the Past."

Read replicas. The STATION STRIP register, EP 16's palette, eight teaching
stations on a two-act serpentine. No footage.

---

## Every figure on screen, and where it came from

This episode's honesty device is that **nothing is presented as measured here** —
that was EP 20's, and borrowing it would have been a lie, because no Postgres was
run to make this film. Instead every number is documented and the source is
captioned under it on screen, via the `Src` component. Each was read from the
source before it was drawn.

### PostgreSQL 17 — `runtime-config-wal` → `synchronous_commit`

Station 03. The five levels, in the order the selector steps through them, and
what each one waits for:

| level | commit waits until |
|---|---|
| `off` | nothing — no waiting at all |
| `local` | the primary's own flush to disk, but not for replication |
| `remote_write` | the standby has **written** the commit record to its file system |
| `on` | the standby has **flushed** it to durable storage — **this is the default** |
| `remote_apply` | the standby has **applied** it, so it is visible to queries there |

Also drawn on that station: with `synchronous_commit = off` the maximum window of
transactions at risk is **three times `wal_writer_delay`** (default 200 ms, so up
to ~600 ms).

Source: https://www.postgresql.org/docs/17/runtime-config-wal.html

### PostgreSQL 17 — `monitoring-stats` → `pg_stat_replication`

The four heads on the LAG RULER are this view's own columns, in the order the
bytes reach them: `sent_lsn` → `write_lsn` → `flush_lsn` → `replay_lsn`. Only
`replay_lsn` means *visible to a query on the standby*.

The mapping station 03 is built on is the docs' own, not an interpretation — each
lag column is documented as gauging the delay one specific `synchronous_commit`
level incurs:

- `write_lag` → `remote_write`
- `flush_lag` → `on`
- `replay_lag` → `remote_apply`

Source: https://www.postgresql.org/docs/17/monitoring-stats.html

### PostgreSQL 17 — `runtime-config-replication`

Station 04's second panel — the cost nobody expects, that a replica will cancel a
long read rather than fall further behind:

| parameter | default |
|---|---|
| `max_standby_streaming_delay` | **30 s** |
| `hot_standby_feedback` | **off** |
| `wal_receiver_status_interval` | 10 s |
| `wal_receiver_timeout` | 60 s |
| `max_wal_senders` | 10 |

Source: https://www.postgresql.org/docs/17/runtime-config-replication.html

### PostgreSQL 17 — `functions-admin`

Station 06's correct routing mechanism: capture `pg_current_wal_lsn()` at write
time, then wait until `pg_last_wal_replay_lsn()` on the replica has reached it.

Source: https://www.postgresql.org/docs/17/functions-admin.html

### Not drawn, but checked

Aurora's documented replica lag is "usually much less than 100 milliseconds",
exposed as the `AuroraReplicaLag` CloudWatch metric. It was verified and then cut
— the episode teaches the mechanism rather than one vendor's numbers, and a
managed-service figure on screen would have implied the film was about Aurora.

---

## Narration

ElevenLabs, `eleven_multilingual_v2`, voice `nlyULslzTRhqlyv46oPj` — unchanged
from EP 13–20. Nine lines, 71.6s of speech, 89.3s of film.

**Scene 8 is not the line in the config's history.** The quota ran out mid-session
(10 credits remaining against 56 required) after scene 6 had been re-recorded and
before scene 8 could be. The config carries the ORIGINAL scene-8 text, which is
what the audio on disk says, plus a `_recorded` note with the replacement to
record when quota resets. It reads at 2.77 syll/s and `tts.mjs --check` flags it
as dragging; the answer was a denser picture rather than a slower one, which is
why station 07 carries six staged comparison rows and is the most
information-dense frame in the film.

That same abort meant `vo-durations.json` was never rewritten — it still claimed
scene 6 was 9.04s when the mp3 on disk was 6.92s. The durations were re-probed
directly from the nine mp3s before any timing was derived.

## Music

**"Space Atmosphere"** by PearceWilsonKing — CC0 1.0
https://freesound.org/people/PearceWilsonKing/sounds/274222

ElevenLabs Music was unavailable (same exhausted quota as the narration), so the
bed is CC0 again — but chosen on measurement rather than taken from the first
search hit. Seven candidates were downloaded and measured across the 110s that
actually plays; this one moves **1.1 dB** across five equal slices against 3.5,
4.9 and 8.4 dB for the others. A bed wants to sit still under narration.

Verified not padded: the last three seconds under the end card measure −16.4 dB
mean, −2.0 dB peak.

**Mix levels are a property of the bed, not of the series.** This bed is mastered
at −16.7 dB mean, about 8 dB hotter than EP 20's CC0 piano, so EP 20's raised
`OPEN 0.62 / UNDER 0.26` would have it shouting over the voice. EP 21 runs
`0.34 / 0.15`.

## Sound design

`sfx.mjs`, `editorial` register, synthesised offline. Whooshes on the six across
moves, riser + thunk on the two act-break lifts, and per-station cues derived from
the same clocks the pictures use.

## Tempo

84 bpm, declared — the same grid as EP 13–20, so scene lengths snap identically
across the run.
