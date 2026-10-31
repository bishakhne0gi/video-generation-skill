import { field, grainDrift, counter, counterRun, T } from "../lib/frame.mjs";
import { postCard, crBadge, flagRow, stamp } from "../lib/ui.mjs";
import { enterOf, exitOf } from "../lib/seams.mjs";
import { LEN as SCHED } from "../schedule.mjs";
export const LEN = SCHED[2];

// THE POST — the turn.
//
// Act break, so this beat enters on the LIFT. The post publishes, and then the
// platform answers: the CR badge paints onto the image and the credential row
// opens beneath it. Two arrivals, 0.5s apart, because two things are actually
// being discovered and collapsing them into one costs the beat its story.
//
// Everything the platform adds is in the film's one warning hue. Nothing else in
// the piece is allowed to use it, so when it goes in beat 5 you feel it go.

const CARD_W = 760;
const POST_AT = 0.86, BADGE_AT = 2.02, FLAG_AT = 2.58;

export const body = `${field("dark", "p3")}
    <div id="stage" class="stage"><div class="inner">

      <div class="tag tag-on" style="position:absolute;left:210px;top:150px">POSTED</div>
      <div id="p3-hdr" style="position:absolute;left:210px;top:198px;width:640px">
        <div class="hdr hdr-on" style="font-size:74px;line-height:1.04">The platform<br/>reads the file.</div>
        <div class="lead lead-on" style="margin-top:26px;font-size:23px">A visible mark in the corner, and a
          credential written inside the pixels.</div>
      </div>
${flagRow("p3-flag", { x: 210, y: 690 })}

${postCard("p3-card", {
  x: 1000, y: 148, w: CARD_W,
  body: "took me one line to get this. still can't believe it 🌍",
  imgH: 470,
  // The post is spreading while you watch it. This is the beat's second thing
  // to do — it keeps the frame alive through the hold, and it is motivated:
  // the whole problem is that a labelled image is being SEEN.
  counts: {
    reply: counter("p3-n1", [14, 15, 16, 18, 19]),
    boost: counter("p3-n2", [6, 7, 9, 11, 12]),
    heart: counter("p3-n3", [203, 214, 229, 241, 256]),
  },
  img: `
          <img id="p3-img" src="assets/demo/planet.png" height="470"
               style="display:block;width:100%;height:470px;object-fit:cover"/>
${stamp("p3-mark", { right: 18, bottom: 15 })}
${crBadge("p3-cr", { right: 18, bottom: 66 })}
          <div id="p3-crring" style="position:absolute;right:10px;bottom:60px;width:126px;height:44px;
               border:1px solid rgba(232,179,57,0.75);border-radius:2px;opacity:0"></div>`,
})}
    </div></div>`;

export const script = `${enterOf(2)}
${grainDrift("p3", LEN)}

      tl.fromTo("#p3-hdr", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.56, ease: "power3.out" }, 0.14);

      // the post publishes — it rises into place carrying its own weight
      tl.fromTo("#p3-card", { autoAlpha: 0, y: 46, scale: 0.975 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.62, ease: "power3.out" }, ${POST_AT.toFixed(2)});

      // ...and the platform answers. The badge is PAINTED ON: it arrives from
      // over the image, at scale, and settles hard.
      tl.set("#p3-cr", { autoAlpha: 0 }, 0);
      tl.fromTo("#p3-cr", { autoAlpha: 0, scale: 1.9, y: -14 },
        { autoAlpha: 1, scale: 1, y: 0, duration: 0.42, ease: "back.out(2.4)" }, ${BADGE_AT.toFixed(2)});
      tl.set("#p3-crring", { autoAlpha: 0 }, 0);
      tl.fromTo("#p3-crring", { autoAlpha: 0.7, scale: 0.6 },
        { autoAlpha: 0, scale: 2.1, duration: 0.80, ease: "power2.out" }, ${BADGE_AT.toFixed(2)});

      // the credential row opens second — the consequence of the badge
      tl.set("#p3-flag", { autoAlpha: 0 }, 0);
      tl.fromTo("#p3-flag", { autoAlpha: 0, x: -22 },
        { autoAlpha: 1, x: 0, duration: 0.48, ease: "power3.out" }, ${FLAG_AT.toFixed(2)});

      // the counts climb across the whole hold, so the beat never settles
${counterRun("p3-n1", 5, 1.20, 2.70)}
${counterRun("p3-n2", 5, 1.34, 2.70)}
${counterRun("p3-n3", 5, 1.12, 2.80)}

      // both markers breathe once, together, so the frame is never at rest while
      // it holds. One pulse — a second would be a blink.
      tl.to("#p3-cr", { scale: 1.055, duration: 0.34, ease: "power2.inOut" }, ${(FLAG_AT + 0.86).toFixed(2)});
      tl.to("#p3-cr", { scale: 1, duration: 0.40, ease: "power2.inOut" }, ${(FLAG_AT + 1.20).toFixed(2)});
      tl.to("#p3-mark", { autoAlpha: 0.72, duration: 0.34, ease: "power2.inOut" }, ${(FLAG_AT + 0.86).toFixed(2)});
      tl.to("#p3-mark", { autoAlpha: 1, duration: 0.40, ease: "power2.inOut" }, ${(FLAG_AT + 1.20).toFixed(2)});

${exitOf(2, LEN)}`;
