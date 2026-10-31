import { field, grainDrift, cursorSVG, cursorTo, cursorTap, T } from "../lib/frame.mjs";
import { appHeader, dropzone } from "../lib/ui.mjs";
import { enterOf, exitOf } from "../lib/seams.mjs";
import { LEN as SCHED } from "../schedule.mjs";
export const LEN = SCHED[3];   // never restate a duration the schedule owns

// First act break — the film lifts into the product. The cursor is the only
// actor in the whole piece, so it enters from OFF-FRAME (a pointer that fades
// up has no author) and every move it makes causes something.
export const body = `${field("app", "drop", LEN)}
    <div id="stage" class="stage"><div class="inner">
${appHeader()}
      <div style="position:absolute;left:250px;top:150px">
        <div class="hdr" id="s-hdr" style="font-size:62px"><span class="grad" style="display:inline-block;padding-bottom:0.06em">Drop the image in.</span></div>
        <div class="lead" id="s-lead" style="margin-top:16px;font-size:24px">That is the entire interface.</div>
      </div>
${dropzone("dz")}
      <div id="file" style="position:absolute;left:872px;top:428px;width:176px;opacity:0">
        <div style="width:176px;height:176px;border:1px solid ${T.rule};overflow:hidden;background:${T.deep}">
          <img src="assets/plates/source.jpg" width="176" height="176" style="display:block"/>
        </div>
        <div class="mono" style="margin-top:11px;font-size:15px;color:${T.dim};text-align:center">elon.jpg</div>
      </div>
      <div id="cur" class="cursor">${cursorSVG}</div>
    </div></div>`;

export const script = `${enterOf(3)}
${grainDrift(LEN)}
      tl.fromTo("#s-hdr",  { y: 18 }, { y: 0, duration: 0.56, ease: "power3.out" }, 0);
      tl.fromTo("#s-lead", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.54, ease: "power3.out" }, 0.26);
      tl.fromTo("#dz", { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.62, ease: "power3.out" }, 0.34);

      // cursor arrives carrying the file, drops it, and the ring answers 0.2s later
${cursorTo([[-140, 470], [905, 470, 0.90], [960, 512, 0.55]], 2.05)}
      tl.fromTo("#file", { autoAlpha: 0, x: -1020, y: 0, scale: 0.82 },
        { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 0.90, ease: "power2.inOut" }, 2.05);
      tl.to("#file", { x: 55, y: 42, duration: 0.55, ease: "power2.inOut" }, 2.95);
${cursorTap(3.52)}
      tl.to("#file", { autoAlpha: 0, scale: 0.90, duration: 0.30, ease: "power2.in" }, 3.62);
      tl.fromTo("#dz-ring", { autoAlpha: 0, scale: 0.985 }, { autoAlpha: 1, scale: 1, duration: 0.30, ease: "power3.out" }, 3.72);
      tl.to("#dz-ring", { autoAlpha: 0, duration: 0.55, ease: "power2.inOut" }, 4.70);
${cursorTo([[960, 512], [1280, 690, 0.80]], 4.30).split("\n").slice(1).join("\n")}
      tl.to("#cur", { autoAlpha: 0, duration: 0.30 }, 5.60);

${exitOf(3, LEN)}`;
