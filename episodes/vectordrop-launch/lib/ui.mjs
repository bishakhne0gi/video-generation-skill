// The product's own screens, rebuilt as live DOM rather than pasted in as
// screenshots. Two reasons: the film pushes to 40x on beat 07 and a bitmap
// would turn to mush exactly where the script claims it does not, and the UI
// has to ANIMATE — paths landing, a panel filling, a slider moving. Every
// string, number, colour and control below is taken from the running app.
import { T } from "./frame.mjs";
import { MARK } from "./logo.mjs";
import { stud } from "./lego.mjs";

export const appHeader = (credits = "3 CREDITS") => `
      <div style="position:absolute;left:0;right:0;top:0;height:78px;border-bottom:1px solid ${T.rule};
           display:flex;align-items:center;padding:0 74px">
        <div style="display:flex;align-items:center;gap:15px">
          ${MARK(30)}<span style="font-size:24px;font-weight:500;letter-spacing:-0.02em">VectorDrop</span>
        </div>
        <div style="margin-left:auto;display:flex;gap:13px">
          <div class="chip chip-on" id="credits">${credits}</div>
          <div class="chip">SIGN OUT</div>
        </div>
      </div>`;

// The dropzone, at the real copy.
export const dropzone = (id) => `
      <div id="${id}" style="position:absolute;left:250px;top:300px;width:1420px;height:430px;
           border:1px solid ${T.rule};border-radius:4px;background:rgba(255,255,255,0.012);
           display:flex;flex-direction:column;align-items:center;justify-content:center;gap:22px">
        <div id="${id}-ring" style="position:absolute;inset:-2px;border:2px solid ${T.teal};
             border-radius:6px;opacity:0"></div>
        <div style="font-size:34px;color:${T.dim}">Drop your image here or click to browse</div>
        <div class="tag" style="font-size:15px;color:${T.faint}">JPEG &nbsp;·&nbsp; PNG &nbsp;·&nbsp; WEBP &nbsp;—&nbsp; UP TO 10 MB</div>
        <div class="btn" style="margin-top:8px">BROWSE FILES</div>
      </div>`;

// ---- editor shell ---------------------------------------------------------
export const editorChrome = ({ zoom = "100%", paths = "31 paths", sel = "" } = {}) => `
      <div style="position:absolute;left:0;right:0;top:0;height:72px;border-bottom:1px solid ${T.rule};
           display:flex;align-items:center;padding:0 30px;background:${T.ground}">
        <div style="width:44px;height:38px;border:1px solid ${T.rule};border-radius:5px;
             display:flex;align-items:center;justify-content:center;color:${T.dim};font-size:19px">&#8249;</div>
        <div style="margin-left:22px;font-size:25px;font-weight:500">elon</div>
        <div style="margin-left:auto;margin-right:auto;display:flex;align-items:center;gap:26px;color:${T.dim};font-size:22px">
          <span>&#8630;</span><span style="opacity:.35">&#8631;</span>
          <span style="margin-left:18px">&minus;</span>
          <span class="mono" id="zoomlbl" style="font-size:19px;color:${T.ink};min-width:112px;text-align:center">${zoom}</span>
          <span>+</span><span style="font-size:18px">&#9974;</span>
        </div>
        <div style="display:flex;gap:13px">
          <div class="chip" style="gap:10px">&#8615; EXPORT</div>
          <div class="btn" style="padding:10px 24px;font-size:14px">SAVE</div>
        </div>
      </div>
      <div style="position:absolute;left:0;top:72px;bottom:52px;width:282px;border-right:1px solid ${T.rule};background:${T.ground}">
        <div style="display:flex;align-items:center;padding:22px 24px 14px">
          <span class="tag" style="font-size:13px">LAYERS</span>
          <span class="tag mono" style="margin-left:auto;font-size:13px;padding:3px 9px;background:rgba(255,255,255,0.05);border-radius:4px">31</span>
        </div>
        <div id="layerlist" style="position:absolute;left:0;right:0;top:70px;bottom:0;overflow:hidden"></div>
      </div>
      <div style="position:absolute;right:0;top:72px;bottom:52px;width:330px;border-left:1px solid ${T.rule};background:${T.ground}">
        <div style="padding:22px 26px 0"><span class="tag" style="font-size:13px">PROPERTIES</span></div>
        <div id="props" style="position:absolute;left:26px;right:26px;top:74px"></div>
      </div>
      <div style="position:absolute;left:282px;right:330px;bottom:0;height:52px;border-top:1px solid ${T.rule};
           display:flex;align-items:center;padding:0 26px;background:${T.ground}">
        <span class="mono" style="font-size:15px;color:${T.faint}">W: 400&nbsp;&nbsp;H: 400</span>
        <span class="mono" id="pathcount" style="margin:0 auto;font-size:15px;color:${T.faint}">${paths}${sel}</span>
        <span class="mono" style="font-size:15px;color:${T.faint}">${zoom}</span>
      </div>`;

// One row of the layers list. `swatch` is the real fill of that traced cluster.
export const layerRow = (i, swatch, on = false) => `
        <div id="lr${i}" style="display:flex;align-items:center;gap:13px;height:38px;padding:0 24px;
             ${on ? `background:rgba(255,255,255,0.055);` : ""}">
          <span style="color:${T.faint};font-size:13px">&#128065;</span>
          <span style="display:flex">${stud(swatch, 16)}</span>
          <span class="mono" style="font-size:15px;color:${on ? T.ink : T.dim}">path-${i}</span>
        </div>`;

export const propRow = (label, value, mono = true) => `
          <div style="margin-bottom:17px">
            <div class="tag" style="font-size:12px;color:${T.faint};margin-bottom:8px">${label}</div>
            <div class="${mono ? "mono" : ""}" style="font-size:19px;color:${T.ink}">${value}</div>
          </div>`;
