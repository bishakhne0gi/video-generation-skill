# Kling shot grammar

What Kling is for in this pipeline: **texture, atmosphere, scale, and morphs no
keyframe system can do.** Not text, not UI, not charts, not logos.

It does that in three distinct jobs, and they are prompted differently:

| Job | What it is | Lives in |
|---|---|---|
| **Shots** | the footage beats — you are looking at it | `KlingClip`, `FootageShape`, `FootagePlate` |
| **Theme elements** | texture running *under* the graphics — you never quite notice it | `Ambient` |
| **Bridges** | a morph between two rendered Remotion frames | `MorphBridge` |

Most episodes under-use the middle one. It is the cheapest way to make motion
graphics look photographed instead of computed.

## Prompt shape that works

```
[shot type] + [subject] + [what it does] + [light] + [camera move] + [look]
```

> Cinematic macro shot gliding through a dark server room, dense bundles of
> fibre-optic cables glowing faint cyan, shallow depth of field, slow dolly
> forward, volumetric haze, anamorphic lens flare, photoreal, 24fps film look

Rules learned the hard way:

- **One subject, one action, one camera move.** Two ideas in a prompt gives you
  a shot that morphs halfway through and is unusable at a cut.
- **Name the camera move explicitly** — slow dolly forward / slow orbit / static
  locked-off / slow push in / crane down. "Dynamic" gives you chaos.
- **Name the light** — volumetric haze, rim light, single practical, hard key.
  Light is what makes it look shot rather than rendered.
- **Say `photoreal`** for footage beats and `abstract 3D render` for concept
  beats. Don't mix them inside one episode's b-roll language.
- **Negatives always include** `text, watermark, logo, subtitles, cartoon,
  distorted hands, warped faces, low resolution, flicker, morphing geometry`.
  The default in `kling.mjs` covers this; extend per shot.
- **Duration**: `5` unless the shot must carry a whole narration line — then
  `10`. Long clips drift more; a 5s clip played at `speed: 0.8` is often better
  than a 10s one.
- **Mode**: `pro` for anything full-frame; `std` is fine for plates that end up
  inside a `FootagePlate` card.

## Shot types this series actually uses

| Purpose | Prompt seed |
|---|---|
| Cold open | slow dolly through infrastructure — server room, fibre, cooling, cityscape at night |
| Abstraction of a problem | tangled glowing cables / colliding light particles / a knot forming, dark void |
| Abstraction of a solution | the same object resolving — untangling, aligning, snapping into a lattice |
| Scale | vast data centre aisle, drone pull-back, endless racks |
| Human stakes | hands on a keyboard in low light, screen glow on a face, over-shoulder, no faces in focus |
| Texture / interstitial | liquid metal, ink in water, light through glass, dust in a light shaft |
| Turn / reveal | camera pushes through a barrier into open space |

Keep an episode's b-roll to **two visual families** (e.g. "server-room
photoreal" + "cyan abstract light"). Three or more and it stops being a film.

## Theme elements — generating the episode's own texture

A graphics beat built entirely from vectors is clean and obviously computed;
twelve in a row is what reads as "template". The fix is not more animation, it's
a real surface underneath: grain, moving light, depth of field, imperfection.
Generate that surface here and composite it with `Ambient` (`footage.tsx`).

**Prompt it as a material, not as a scene.** No subject, no story, nothing that
resolves — the moment there is something to look at, it competes with the
graphics.

```
[material] + [slow continuous behaviour] + [light] + [locked-off camera] +
[episode palette, named in colour words] + abstract, no subject
```

> Extreme macro of deep indigo ink diffusing through still water, slow
> continuous billowing, single soft light from above, locked-off camera,
> near-black background with faint cyan highlights, abstract, no subject,
> photoreal, shallow depth of field

Rules for elements specifically:

- **Two per episode is plenty** — one for the body of the film, one for the act
  that turns. More and the "surface" starts changing under the viewer.
- **Name the episode's palette in the prompt.** The grade can rescue a colour;
  it can't rescue a plate that arrives in the wrong *value*. Dark themes want a
  near-black field with a few highlights (blended `screen`); light themes want a
  pale field with soft shadow (blended `multiply`).
- **Locked-off camera, always.** The element is a moving surface, not a shot. A
  camera move inside it is exactly the panning problem re-introduced through the
  back door.
- **10s, `std` mode.** It's running at ~0.15 opacity behind graphics and looping
  — `pro` is money spent where nobody can see it. Longer means fewer loop wraps.
- **Loopability**: prompt "slow continuous" behaviour with no beginning or end.
  Diffusion, drift, haze, shimmer, slow rotation. Anything with an event in it
  (a splash, a spark, an impact) will pulse on every loop.

Materials that work, by register:

| Episode register | Element |
|---|---|
| infrastructure / systems | dust in a light shaft, haze drifting through a dark volume, slow-moving caustics on a dark surface |
| data / abstraction | ink diffusing in water, particles drifting in a void, slow shimmer on a liquid-metal surface |
| editorial / daylight | paper fibre under raking light, soft cloud shadow moving across a plain wall, faint film grain on a pale field |
| launch / hype | anamorphic bokeh drifting out of focus, light through cut glass, slow lens flare crawl |

**Elements are also the answer when a beat wants footage but the footage would
lie.** If there is no honest shot of the thing you're explaining, don't reach for
a stock-looking approximation — run a texture under the diagram instead. The
diagram carries the meaning; the texture carries the realism.

## Image-to-video

Feed a still and Kling animates it: `"kind": "i2v", "image": "public/stills/x.png"`.
Use it to bring a Remotion frame to life (render the still, animate it, cut back
to the live composition) or to animate a Kling-generated image.

## The morph bridge (the seamless transition)

`image` = last frame of scene A, `imageTail` = first frame of scene B. Kling
interpolates between them.

```bash
npx remotion still src/index.ts Episode public/stills/a.png --frame=<A end>
npx remotion still src/index.ts Episode public/stills/b.png --frame=<B start>
node kling.mjs bridge ep03_morph1 --from public/stills/a.png --to public/stills/b.png
```

- Works best when the two frames **share a dominant shape or colour mass**. Set
  that up when you compose the scenes — a bridge between a text card and a
  diagram will look like mush.
- Keep bridges to 5s and 2–3 per episode.
- Neighbouring beats get `enter: "fade"`, `enterDur: 6` so nothing competes
  with the morph.

## When a shot comes back wrong

| Symptom | Move |
|---|---|
| First 4–8 frames warp | `startAt: 0.3–0.5` — almost always fixes it, no re-roll needed |
| Invented text/logos | add the specific words to `negative`, re-roll |
| Subject changes identity mid-shot | prompt was doing two things; split it or shorten to 5s |
| Too fast / too frantic | `speed: 0.7–0.85` on `KlingClip` before re-rolling |
| Feels off-palette | that's the grade's job: `grade: 0.7` |
| Genuinely unusable | re-roll once with a simpler prompt; if it fails twice, build the beat in Remotion instead |
| An `Ambient` element you can point at | lower `opacity` first, then `blur: 8–20`, then `speed: 0.4`. Re-rolling is the last resort — nine times out of ten it's composited too hot, not generated wrong |
| An element that pulses once a loop | it has an *event* in it. Re-prompt for continuous behaviour with no beginning or end |
