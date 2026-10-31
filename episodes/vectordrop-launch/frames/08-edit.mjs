import { field, grainDrift, cursorSVG, cursorTo, cursorTap, counter, counterRun, T } from "../lib/frame.mjs";
import { editorChrome, propRow, layerRow } from "../lib/ui.mjs";
import { artSVG, PATHS, anchors } from "../lib/art.mjs";
import { enterOf, exitOf } from "../lib/seams.mjs";
import { LEN as SCHED } from "../schedule.mjs";
export const LEN = SCHED[7];   // never restate a duration the schedule owns

// The live editor's own palette rounds a shade differently from a local re-run
// of the same pipeline (#989299 there, #979299 here), so the label is READ from
// the file this film actually renders rather than transcribed from a screenshot.
// path-18 is the largest traced cluster — the sky and haze — which is the layer
// the cursor selected in the live session. The recolour target is the brand teal,
// which is what was typed into the real Fill field.
const SEL = 18;
const SEL_FILL = PATHS[SEL - 1].fill;
const NODES = anchors(PATHS[SEL - 1].d, 9);   // 149 real control points

export const body = `${field("canvas", "edit", LEN)}
    <div id="stage" class="stage"><div class="inner">
${editorChrome({ zoom: "100%", paths: "31 paths", sel: ' &nbsp;<span style="color:#fff">1 selected</span>' })}

      <div style="position:absolute;left:282px;right:330px;top:72px;bottom:52px;background:${T.canvas}">
        <div style="position:absolute;left:50%;top:50%;width:726px;height:726px;margin:-363px 0 0 -363px;background:#fff">
          ${artSVG("svg3", { extra: 'width="726" height="726" style="display:block"' })}
          <!-- the recoloured copy of path-17, stacked and cross-faded to.
               A tween on the fill attribute silently does nothing here. -->
          <svg viewBox="0 0 400 400" width="726" height="726" style="position:absolute;left:0;top:0;display:block">
            <path id="recolor" fill="${T.teal}" fill-rule="evenodd" opacity="0" d="${PATHS[SEL - 1].d}"/>
          </svg>
          <!-- the real control points, at 726/400 scale -->
          <div id="nodes" style="position:absolute;left:0;top:0;width:726px;height:726px;opacity:0">
${NODES.map(([x, y], i) => `            <span id="nd${i}" style="position:absolute;left:${(x * 726 / 400 - 4).toFixed(1)}px;top:${(y * 726 / 400 - 4).toFixed(1)}px;width:8px;height:8px;background:#fff;border:1px solid #111"></span>`).join("\n")}
          </div>
          <!-- marching ants on the selected layer -->
          <svg id="ants" viewBox="0 0 400 400" width="726" height="726"
               style="position:absolute;left:0;top:0;display:block;opacity:0">
            <path d="${PATHS[SEL - 1].d}" fill="none" stroke="#111" stroke-width="1.1"
                  stroke-dasharray="4 3" vector-effect="non-scaling-stroke"/>
          </svg>
        </div>
      </div>

      <div style="position:absolute;left:0;top:142px;width:282px;height:838px;overflow:hidden">
${PATHS.slice(11, 32).map((p, i) => layerRow(i + 12, p.fill, i + 12 === SEL)).join("")}
      </div>

      <div id="props2" style="position:absolute;right:26px;top:150px;width:278px;opacity:0">
${propRow("LAYER INFO", `path-${SEL}`)}
        <div class="tag" style="font-size:12px;color:${T.faint};margin:22px 0 8px">APPEARANCE</div>
        <div style="display:flex;align-items:center;gap:11px;margin-bottom:16px">
          <span id="sw" style="width:30px;height:30px;border-radius:5px;background:${SEL_FILL};border:1px solid ${T.hair}"></span>
          <span class="mono" id="hex" style="font-size:19px;position:relative;display:inline-block">
            ${counter("hexc", [SEL_FILL.toUpperCase(), "#14B8A6"]).replace('<span id="hexc"', '<span id="hexc"')}
          </span>
        </div>
${propRow("OPACITY", "100%")}
${propRow("TRANSFORM", "400 &times; 400")}
      </div>

      <div style="position:absolute;left:50%;bottom:112px;transform:translateX(-50%)">
      <div id="nodebar" style="display:flex;gap:0;opacity:0">
${["MOVE", "BEND", "ADD", "CUT"].map((s, i) => `        <div class="chip" style="border-radius:0;font-size:14px;padding:12px 22px${i ? ";border-left:none" : ""}">${s}</div>`).join("\n")}
      </div></div>
      <div id="cur" class="cursor">${cursorSVG}</div>
    </div></div>`;

export const script = `${enterOf(7)}
${grainDrift(LEN)}
${cursorTo([[2060, 700], [1120, 596, 0.86]], 0.55)}
${cursorTap(1.48)}
      tl.to("#ants", { autoAlpha: 1, duration: 0.26, ease: "power2.out" }, 1.62);
      tl.fromTo("#props2", { autoAlpha: 0, x: 24 }, { autoAlpha: 1, x: 0, duration: 0.46, ease: "power3.out" }, 1.70);
      // cursor goes to the Fill field, and the swatch answers ~0.2s AFTER the tap
${cursorTo([[1120, 596], [1712, 336, 0.78]], 2.70).split("\n").slice(1).join("\n")}
${cursorTap(3.60)}
${counterRun("hexc", 2, 3.78, 0.01)}
      tl.to("#sw", { backgroundColor: "${T.teal}", duration: 0.34, ease: "power2.out" }, 3.80);
      tl.to("#recolor", { autoAlpha: 1, duration: 0.40, ease: "power2.out" }, 3.80);
      tl.to("#nodebar", { autoAlpha: 1, y: 0, duration: 0.40, ease: "power3.out" }, 4.70);
      // the handles come up across a second — 149 landing at once is a flash
      tl.to("#nodes", { autoAlpha: 1, duration: 0.30 }, 4.85);
${NODES.map((_, i) => `      tl.fromTo("#nd${i}", { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.26, ease: "back.out(2)" }, ${(4.90 + (i % 37) * 0.028 + Math.floor(i / 37) * 0.20).toFixed(3)});`).join("\n")}
      tl.to("#cur", { autoAlpha: 0, duration: 0.28 }, 5.60);

${exitOf(7, LEN)}`;
