import { field, grainDrift, head, headIn, T } from "../lib/frame.mjs";
import { artSVGmode } from "../lib/art.mjs";
import { stud } from "../lib/lego.mjs";
import { enterOf, exitOf } from "../lib/seams.mjs";
import { LEN as SCHED } from "../schedule.mjs";
export const LEN = SCHED[8];   // never restate a duration the schedule owns

// Not three CSS filters over one picture — three renderings of the same 31
// paths with the fills actually transformed, which is what the product's
// Color / Grayscale / Black-and-white modes do to the file you export.
const MODES = [
  { m: "color", label: "COLOR" },
  { m: "gray",  label: "GRAYSCALE" },
  { m: "bw",    label: "BLACK &amp; WHITE" },
];

export const body = `${field("canvas", "looks", LEN)}
    <div id="stage" class="stage"><div class="inner">
${head("ONE TRACE", "Three ways out.", "", { x: 132, y: 112, size: 68 })}

      <div style="position:absolute;left:132px;top:300px;display:flex;gap:38px">
${MODES.map((o, i) => `        <div id="lk${i}" style="width:520px">
          <div style="position:relative;width:520px;height:520px;background:#fff;border:1px solid ${T.rule};overflow:hidden">
            ${artSVGmode(`m${i}`, o.m, { extra: 'width="520" height="520" style="display:block"' })}${o.m === "bw" ? `
            <div id="bw2" style="position:absolute;left:0;top:0;opacity:0">${artSVGmode("mbw2", "bw", { t: 0.66, extra: 'width="520" height="520" style="display:block"' })}</div>
            <div id="bw3" style="position:absolute;left:0;top:0;opacity:0">${artSVGmode("mbw3", "bw", { t: 0.38, extra: 'width="520" height="520" style="display:block"' })}</div>` : ""}
          </div>
          <div style="margin-top:21px">
            <span class="tag tag-teal" style="font-size:17px">${o.label}</span>
          </div>
        </div>`).join("\n")}
      </div>

      <!-- the real control: three modes and a 0-100 intensity -->
      <div style="position:absolute;left:50%;transform:translateX(-50%);bottom:52px;display:flex;align-items:center;gap:20px">
        <div class="chip" style="gap:11px;padding:11px 16px">
${[0, 1, 2].map((i) => `          <span style="position:relative;display:flex;width:20px;height:20px">
            <span style="position:absolute;inset:0;display:flex">${stud("#3d4450", 20)}</span>
            <span id="md${i}" style="position:absolute;inset:0;display:flex;opacity:${i ? 0 : 1}">${stud(T.teal, 20)}</span>
          </span>`).join("\n")}
        </div>
        <div style="width:300px;height:3px;background:rgba(255,255,255,0.09);position:relative">
          <div id="knob" style="position:absolute;left:0;top:-6px;width:15px;height:15px;border-radius:50%;background:#fff"></div>
        </div>
      </div>
    </div></div>`;

export const script = `${enterOf(8)}
${grainDrift(LEN)}
${headIn()}
${MODES.map((_, i) => `      tl.fromTo("#lk${i}", { autoAlpha: 0, y: 40, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.66, ease: "power3.out" }, ${(0.34 + i * 2.30).toFixed(2)});`).join("\n")}
      // the control walks the three modes in step with the plates being read
      tl.to("#knob", { x: 96, duration: 0.70, ease: "power2.inOut" }, 2.34);
      tl.to("#md0", { autoAlpha: 0, duration: 0.20 }, 2.44);
      tl.to("#md1", { autoAlpha: 1, duration: 0.20 }, 2.44);
      tl.to("#knob", { x: 213, duration: 0.70, ease: "power2.inOut" }, 4.64);
      tl.to("#md1", { autoAlpha: 0, duration: 0.20 }, 4.74);
      tl.to("#md2", { autoAlpha: 1, duration: 0.20 }, 4.74);
      // the threshold keeps moving to the end of the beat: this IS the control
      tl.to("#knob", { x: 258, duration: 0.80, ease: "power2.inOut" }, 5.70);
      tl.to("#bw2", { autoAlpha: 1, duration: 0.30 }, 5.95);
      tl.to("#knob", { x: 150, duration: 0.90, ease: "power2.inOut" }, 6.90);
      tl.to("#bw2", { autoAlpha: 0, duration: 0.30 }, 7.15);
      tl.to("#bw3", { autoAlpha: 1, duration: 0.30 }, 7.15);
      tl.to("#lk2", { scale: 1.03, duration: 0.90, ease: "power2.out" }, 6.10);

${exitOf(8, LEN)}`;
