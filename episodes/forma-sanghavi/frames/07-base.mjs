import { field, grainDrift, brackets, counter, counterRun, T } from "../lib/frame.mjs";
import { axis, girth } from "../lib/ui.mjs";
import { featherPath, VB } from "../lib/last.mjs";
import { enterOf, exitOf } from "../lib/seams.mjs";
import { LEN as SCHED } from "../schedule.mjs";
export const LEN = SCHED[6];

// ACT 2. The answer, given room. Every figure on this card was on screen in
// production: CH-521510948-42, 98.9%, rework 0.7mm, and the four dimension
// chips at the axis palette's three fixed hues plus an unhued girth.
export const body = `${field("app", "base")}
    <div id="stg6" class="stage"><div class="inner">
      <div class="tag" id="k1" style="position:absolute;left:128px;top:118px">YOUR BASE LAST</div>
      <div class="rule" id="k2" style="position:absolute;left:128px;top:148px;width:230px"></div>

      <div id="card" style="position:absolute;left:128px;top:206px;width:1000px;
           background:${T.surface};border:1px solid rgba(0,174,239,0.55);padding:52px 56px">
${brackets()}
        <div style="display:flex;align-items:center;gap:20px">
          <span class="hdr" id="cd" style="font-size:60px">CH-521510948-42</span>
          <span class="chip chip-sm" id="cb" style="font-size:16px">COLE HAAN</span>
        </div>
        <div id="cx" style="display:flex;gap:13px;margin-top:34px">
          ${axis("L", "285.4")}${axis("W", "94.7")}${axis("H", "102.0")}${girth("251")}
        </div>
        <div id="cm" style="margin-top:26px;font-size:22px;color:${T.body}">
          model 521510948 · Gents · size 42 · slip-on? · round toe · heel 15mm · back N</div>

        <div style="height:1px;background:${T.line};margin:38px 0 34px"></div>

        <div style="display:flex;align-items:flex-end;gap:64px">
          <div id="pc">
            <div class="tag tag-sm">MATCH</div>
            <div class="hdr num" style="margin-top:12px;font-size:88px;color:${T.title}">
              ${counter("pcv", ["0.0", "62.4", "91.7", "98.9"], "hdr num")}<span style="font-size:44px;color:${T.muted}">%</span></div>
          </div>
          <div id="wk">
            <div class="tag tag-sm">REWORK</div>
            <div class="hdr num" style="margin-top:12px;font-size:88px;color:${T.accent6}">
              ${counter("wkv", ["0.0", "0.4", "0.7"], "hdr num")}<span style="font-size:44px;color:${T.muted}"> mm</span></div>
          </div>
          <div id="pl" style="padding-bottom:16px">
            <div class="tag tag-sm">THE WHOLE JOB</div>
            <div style="margin-top:14px;font-size:34px;color:${T.ink}">rasp 1mm girth</div>
          </div>
        </div>
      </div>

      <svg id="ol" viewBox="0 0 ${VB[2]} ${VB[3]}" width="700" height="${(700 * VB[3] / VB[2]).toFixed(0)}"
           style="position:absolute;right:130px;top:392px;overflow:visible">
        ${featherPath({ w: 2.4, stroke: T.wire })}
      </svg>
      <div class="tag tag-sm" id="oll" style="position:absolute;right:138px;top:${(392 + 700 * VB[3] / VB[2] + 30).toFixed(0)}px;color:${T.faint}">
        DONOR BOTTOM · PRESERVED BY THE DEFORMATION</div>
    </div></div>`;

export const script = `${enterOf(6)}
${grainDrift("base", LEN)}
      // SEAM CARRIER — the card is at full opacity from frame zero and rides
      // the lift in; only its contents stage.
      tl.fromTo("#k1", { y: 12 }, { y: 0, duration: 0.50, ease: "power3.out" }, 0);
      tl.fromTo("#k2", { scaleX: 0 }, { scaleX: 1, duration: 0.50, ease: "power3.out" }, 0.06);
      tl.fromTo("#cd", { y: 16 }, { y: 0, duration: 0.54, ease: "power3.out" }, 0.02);
      tl.fromTo("#cb", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.42, ease: "power2.out" }, 0.34);
      tl.fromTo("#cx", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.50, ease: "power3.out" }, 0.44);
      tl.fromTo("#cm", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.46, ease: "power3.out" }, 0.58);

      tl.fromTo("#pc", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.52, ease: "power3.out" }, 1.35);
${counterRun("pcv", 4, 1.50, 1.95)}
      tl.fromTo("#wk", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.52, ease: "power3.out" }, 3.75);
${counterRun("wkv", 3, 3.90, 1.35)}
      tl.fromTo("#pl", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.50, ease: "power3.out" }, 5.55);

      tl.fromTo("#ol",  { autoAlpha: 0, x: 40 }, { autoAlpha: 1, x: 0, duration: 0.70, ease: "power3.out" }, 0.80);
      tl.fromTo("#oll", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.50, ease: "power2.out" }, 1.30);
      // the outline turns slowly for the whole beat — the donor bottom being
      // looked at, not a decorative wobble
      tl.fromTo("#ol", { rotation: -1.4 }, { rotation: 1.4, duration: ${LEN.toFixed(2)}, ease: "none", immediateRender: false }, 0);

${exitOf(6, LEN)}`;
