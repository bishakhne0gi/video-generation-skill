import { field, grainDrift, head, headIn, counter, counterRun, wipe, wipeRun, pulse, pulseRun, T } from "../lib/frame.mjs";
import { LEN as SCHED } from "../schedule.mjs";
import { artSVGmode, artOutline } from "../lib/art.mjs";
import { stud } from "../lib/lego.mjs";
import { enterOf, exitOf } from "../lib/seams.mjs";
export const LEN = SCHED[4];

// The four stages are the product's own ConversionStep union and the lines under
// them are the exact toast strings the app prints. The clock is the measured
// wall time of the live run: 9.0s for this file.
//
// The stages sit on a rail with a pulse travelling it, so the beat reads as a
// pipeline carrying something rather than four chips lighting up. The preview
// does not cross-fade between stages — it is WIPED, top-down, with a bright bar
// on the leading edge, because a tracer sweeping an image is what is actually
// happening and a dissolve says nothing.
const STAGES = ["UPLOAD", "NORMALIZE", "TRACE", "ASSEMBLE"];
const TOASTS = [
  "Reading your image…",
  "Quantizing colour clusters…",
  "Tracing bezier curves…",
  "Assembling SVG layers…",
  "SVG ready. Opening editor…",
];
const P = 470, RAIL = 1128, T0 = 0.80, RUN = 5.40;
const stageAt = (i) => T0 + 0.10 + i * (RUN / 4);

export const body = `${field("app", "pipe", LEN)}
    <div id="stage" class="stage"><div class="inner">
${head("PIPELINE", "Four stages.", "", { x: 132, y: 128 })}

      <div style="position:absolute;left:132px;top:352px;display:flex;gap:19px">
${STAGES.map((s, i) => `        <div class="chip" id="st${i}" style="font-size:17px;padding:15px 26px">
          <span id="st${i}-tick" style="opacity:0;color:${T.lit}">&#10003;</span>${s}</div>`).join("\n")}
      </div>

      <!-- the rail the file travels -->
      <div style="position:absolute;left:132px;top:468px;width:${RAIL}px;height:2px">
${pulse("cn", RAIL)}
${STAGES.map((_, i) => `        <div id="nd${i}" style="position:absolute;left:${Math.round(i * (RAIL / 3)) - 13}px;top:-12px;display:flex;opacity:0.30">
          ${stud("#3d4450", 26)}</div>
        <div id="ndx${i}" style="position:absolute;left:${Math.round(i * (RAIL / 3)) - 13}px;top:-12px;display:flex;opacity:0">
          ${stud(T.teal, 26)}</div>`).join("\n")}
      </div>

      <div class="mono" style="position:absolute;left:132px;top:534px;height:52px;font-size:26px;color:${T.dim}">
        ${counter("toast", TOASTS, "")}
      </div>

      <!-- the file, wiped stage by stage -->
      <div style="position:absolute;right:132px;top:150px;width:${P}px;height:${P}px;background:#fff;border:1px solid ${T.rule}">
        <img src="assets/plates/source.jpg" width="${P}" height="${P}" style="display:block;position:absolute;left:0;top:0"/>
${wipe("w1", P, artSVGmode("pq", "color", { extra: `width="${P}" height="${P}" style="display:block"` }))}
${wipe("w2", P, artOutline("po", { extra: `width="${P}" height="${P}" style="display:block"` }))}
${wipe("w3", P, artSVGmode("pa", "color", { extra: `width="${P}" height="${P}" style="display:block"` }))}
      </div>

      <div class="tag" style="position:absolute;left:132px;top:636px;font-size:13px;color:${T.faint}">ELAPSED</div>
      <div style="position:absolute;left:132px;top:686px;height:210px;font-size:176px;line-height:1;
           color:${T.ink};letter-spacing:-0.03em">
        ${counter("clk", ["0.0s", "1.4s", "2.9s", "4.3s", "5.8s", "7.2s", "9.0s"])}
      </div>
    </div></div>`;

export const script = `${enterOf(4)}
${grainDrift(LEN)}
${headIn()}
${pulseRun("cn", RAIL, T0, RUN)}
${counterRun("clk", 7, T0, RUN)}
${counterRun("toast", 5, T0, RUN)}
${STAGES.map((_, i) => `      tl.fromTo("#st${i}", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.46, ease: "power3.out" }, ${(0.28 + i * 0.11).toFixed(2)});
      tl.to("#st${i}", { backgroundColor: "rgba(20,184,166,0.09)", color: "${T.lit}", duration: 0.26 }, ${stageAt(i).toFixed(2)});
      tl.to("#st${i}", { scale: 1.06, duration: 0.22, ease: "back.out(2.6)" }, ${stageAt(i).toFixed(2)});
      tl.to("#st${i}", { scale: 1, duration: 0.34, ease: "power2.out" }, ${(stageAt(i) + 0.22).toFixed(2)});
      tl.to("#st${i}-tick", { autoAlpha: 1, duration: 0.22, ease: "back.out(2.4)" }, ${(stageAt(i) + 0.16).toFixed(2)});
      tl.to("#ndx${i}", { autoAlpha: 1, scale: 1.25, duration: 0.22, ease: "back.out(3)" }, ${stageAt(i).toFixed(2)});
      tl.to("#ndx${i}", { scale: 1, duration: 0.30, ease: "power2.out" }, ${(stageAt(i) + 0.22).toFixed(2)});`).join("\n")}

      // each wipe lands ~0.1s AFTER its stage lights — cause, then effect
${wipeRun("w1", P, stageAt(1) + 0.10, 0.92)}
${wipeRun("w2", P, stageAt(2) + 0.10, 0.92)}
${wipeRun("w3", P, stageAt(3) + 0.10, 0.92)}

${exitOf(4, LEN)}`;
