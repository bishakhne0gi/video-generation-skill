# EP10 — art direction, read off the reference

Reference: https://in.pinterest.com/pin/1102537552549708970/
Pinned by `unbserved`, originally https://www.instagram.com/p/DKersLeR9-6/
Local copy: `pin.jpg` (720×720).

**It is a still image, not a video.** So it gives us the visual language
exactly, and gives us nothing about pacing or transitions. Motion below is
inferred from the composition — the layout is built for tumble-and-settle, so
that is what we animate.

## What the reference actually is

A WhatsApp brand piece. The mark sits dead centre, large and outlined, in the
brand green. Around it, message-bubble cards tumble at angles in a tonal ramp of
that one hue — five or six steps from near-white to saturated. Gold five-point
stars are scattered as a second accent. A few small circular avatar badges carry
illustrated faces. The field is warm off-white.

## The seven rules this gives us

1. **Cream field, not black.** `#F7F4EF`. This is the biggest departure from
   EP08/EP09 — the series has been dark twice; EP10 is light.
2. **Everything is outlined.** A ~3px near-black stroke (`#1C1C1C`) on every
   card, star and glyph. This single rule is what makes it read as one system.
   No shadows, no gradients, no glow.
3. **One hue, ramped.** Every card is a step on the Zomato red ramp — from a
   near-white blush to full Cranberry `#E23744`. Nothing is a colour that isn't
   on the ramp.
4. **Gold is the only second colour.** `#F5A623` stars, used as punctuation.
   Sparingly — they are commas, not content.
5. **Rounded rectangles at angles.** Radius ~28px, rotations ±4–14°. Nothing is
   axis-aligned except the centre mark and the typography.
6. **The mark holds the centre.** One hero object per beat, centred, big, still,
   while the collage moves around it.
7. **Generous air.** The composition is ~40% empty cream. Do not fill it.

## Motion grammar (inferred — the layout is built for it)

- Cards **tumble in on a spring** and settle at a slight angle, never landing
  flat. Stagger by 2–3 frames, never in unison.
- The field has a **slow parallax drift**: outer cards travel further than inner
  ones on the automatic push.
- Stars **pop** — fast overshoot scale, no fade. They are the accent in motion
  too.
- Transitions favour the **geometric** family (`push`, `split`, `iris`, `wipe`).
  The optical/luma kinds (`light-leak`, `film-burn`, `grain-dissolve`) belong to
  a photoreal register and would break this one — spend at most one, on the turn.
- The centre object **does not move** while the collage rearranges around it.
  That contrast is the whole trick.

## Typography

Metropolis (the open-source base of Zomato's Okra), 800/900 for display, set
tight. Dark ink `#1C1C1C` on cream — not red. Red is for shapes; text stays ink,
or the composition turns into a poster.

## The conflict this creates, and the resolution

This is a **flat vector illustration** language. Photoreal Kling footage laid
into it reads as two films stapled together — the exact "AI slop" failure the
house style warns about. Resolution: see `episode.config.json`. Footage is
posterised into the ramp and framed inside an outlined card, so it becomes a
*card in the collage* rather than a window onto another aesthetic.
