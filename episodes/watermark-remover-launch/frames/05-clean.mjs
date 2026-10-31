import { field, grainDrift, T } from "../lib/frame.mjs";
import { postCard } from "../lib/ui.mjs";
import { enterOf, exitOf } from "../lib/seams.mjs";
import { LEN as SCHED } from "../schedule.mjs";
export const LEN = SCHED[4];

// THE PAYOFF — the same post, reposted from the downloaded file.
//
// The whole beat is an ABSENCE, which is hard to photograph. Two things make it
// land: the corner the mark used to occupy is held long enough to be read as
// empty, and the two markers from beat 3 are shown leaving — a ghost of each at
// its old position, going out. You cannot feel something gone unless the film
// remembers where it was.
//
// This is the only beat where the warning hue appears and then does not.

const CARD_W = 760;
const CARD_AT = 0.30, GHOST_AT = 0.96;

export const body = `${field("dark", "p5")}
    <div id="stage" class="stage"><div class="inner">

      <div class="tag tag-on" style="position:absolute;left:210px;top:150px">REPOSTED</div>
      <div id="p5-hdr" style="position:absolute;left:210px;top:198px;width:660px">
        <div class="hdr hdr-on" style="font-size:74px;line-height:1.04">No mark.<br/>No credential.</div>
        <div class="lead lead-on" style="margin-top:26px;font-size:23px">The corner is filled from the pixels
          around it, and the file that comes back is a clean re-encode.</div>
      </div>

      <div id="p5-file" style="position:absolute;left:210px;top:596px;display:flex;align-items:center;gap:14px">
        <span class="chip chip-d" style="height:38px;font-size:14px">
          <span class="mono" style="color:${T.lit}">PNG</span>planet-clean.png</span>
        <span class="mono" style="font-size:15px;color:${T.mute}">1080 &times; 1079 &middot; original resolution</span>
      </div>

${postCard("p5-card", {
  x: 1000, y: 148, w: CARD_W,
  body: "took me one line to get this. still can't believe it 🌍",
  imgH: 470,
  // carried over from beat 3's final values — the counts must not go backwards
  // between two shots of the same post, which reads as a mistake, not a repost
  counts: {
    reply: '<span class="mono">19</span>',
    boost: '<span class="mono">12</span>',
    heart: '<span class="mono">256</span>',
  },
  img: `
          <img id="p5-img" src="assets/demo/planet.png" height="470"
               style="display:block;width:100%;height:470px;object-fit:cover"/>

          <!-- the two ghosts: exactly where beat 3 put them, on their way out -->
          <div id="p5-gmark" style="position:absolute;right:18px;bottom:15px;display:flex;align-items:center;gap:7px;
               color:rgba(255,255,255,0.92)">
            <span style="font-size:15px;font-weight:600;letter-spacing:-0.01em">Gemini</span></div>
          <div id="p5-gcr" style="position:absolute;right:18px;bottom:66px;display:flex;align-items:center;gap:8px;
               height:32px;padding:0 12px;border-radius:2px;background:rgba(11,15,22,0.86);
               border:1px solid rgba(232,179,57,0.55);color:${T.flag};font-size:13px;font-weight:600">
            <span class="mono" style="font-weight:700;letter-spacing:0.06em">CR</span>
            <span style="width:1px;height:14px;background:rgba(232,179,57,0.40)"></span>
            <span>AI info</span></div>

          <!-- and the empty corner, marked once so the eye is told where to look -->
          <div id="p5-empty" style="position:absolute;right:10px;bottom:8px;width:150px;height:96px;
               border:1px dashed rgba(255,255,255,0.30);border-radius:2px;opacity:0"></div>`,
})}
    </div></div>`;

export const script = `${enterOf(4)}
${grainDrift("p5", LEN)}

      // the headline arrives AFTER the two markers have left, never with them:
      // a frame that says "no mark" over a visible mark is arguing with itself.
      tl.fromTo("#p5-hdr", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.56, ease: "power3.out" }, ${(GHOST_AT + 0.58).toFixed(2)});
      tl.fromTo("#p5-card", { autoAlpha: 0, y: 40, scale: 0.98 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.60, ease: "power3.out" }, ${CARD_AT.toFixed(2)});

      // the ghosts leave — the credential first, then the visible mark, 0.18s
      // apart. Both scale UP as they go, so they read as being lifted off the
      // image rather than dissolving into it.
      tl.to("#p5-gcr", { autoAlpha: 0, scale: 1.35, y: -12, duration: 0.52, ease: "power2.out" }, ${GHOST_AT.toFixed(2)});
      tl.to("#p5-gmark", { autoAlpha: 0, scale: 1.35, y: -10, duration: 0.52, ease: "power2.out" }, ${(GHOST_AT + 0.18).toFixed(2)});

      // then the corner is held, and named as empty
      tl.fromTo("#p5-empty", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.34, ease: "none" }, ${(GHOST_AT + 0.80).toFixed(2)});
      tl.to("#p5-empty", { autoAlpha: 0, duration: 0.50, ease: "power2.inOut" }, ${(GHOST_AT + 1.72).toFixed(2)});

      tl.fromTo("#p5-file", { autoAlpha: 0, x: -20 },
        { autoAlpha: 1, x: 0, duration: 0.52, ease: "power3.out" }, ${(GHOST_AT + 0.94).toFixed(2)});

${exitOf(4, LEN)}`;
