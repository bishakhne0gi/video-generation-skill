import { field, enterAcross, exitAcross, header, headerIn, swing , readout, readoutIn} from "../lib/frame.mjs";
// STATION 02 — LCP. The big dial, and the viewport that explains what it is measuring.
// Scale: 0-6s across 240deg. rotation = -120 + (v/6)*240.
const CX = 1452, CY = 664, R = 224;
const deg = (v) => -120 + (v / 6) * 240;
export const body = `
    ${field("lamplit")}
    <div id="stage" class="stage"><div class="inner">
      ${header("02", "LARGEST CONTENTFUL PAINT", "The biggest<br>thing you paint.", "LCP is the moment the largest element in the viewport finishes rendering. Almost always an image &mdash; and almost always discovered too late.")}

      <div class="bezel" style="left:${CX-R-26}px;top:${CY-R-26}px;width:${(R+26)*2}px;height:${(R+26)*2}px;border-radius:50%"></div>
      <div class="face"  style="left:${CX-R}px;top:${CY-R}px;width:${R*2}px;height:${R*2}px;border-radius:50%"></div>

      <svg id="l-arc" style="position:absolute;left:${CX-R}px;top:${CY-R}px" width="${R*2}" height="${R*2}" viewBox="0 0 ${R*2} ${R*2}">
        <path d="${arcPath(R, 0, 2.5)}" fill="none" stroke="#408A71" stroke-width="13" stroke-linecap="round" opacity=".85"/>
        <path d="${arcPath(R, 2.5, 6)}" fill="none" stroke="#E8A13C" stroke-width="13" stroke-linecap="round" opacity=".62"/>
      </svg>
      <div id="l-ticks" style="position:absolute;left:${CX-R}px;top:${CY-R}px;width:${R*2}px;height:${R*2}px"></div>

      <div id="l-needle" class="needle hot" style="left:${CX-4}px;top:${CY-186}px;width:8px;height:186px"></div>
      <div class="hub" style="left:${CX-19}px;top:${CY-19}px;width:38px;height:38px"></div>

      <div id="l-read" style="position:absolute;left:${CX-160}px;top:${CY+86}px;width:320px;text-align:center">
        <div id="l-val" class="mono hot" style="font-size:58px;font-weight:700;line-height:1.18">3.8s</div>
        <div class="mono" style="font-size:17px;letter-spacing:.16em;opacity:.62;margin-top:8px">BUDGET 2.5s</div></div>

      <div id="l-vp" class="panel" style="left:158px;top:562px;width:660px;height:378px"></div>
      <div id="l-vplbl" class="mono" style="position:absolute;left:178px;top:582px;font-size:17px;letter-spacing:.14em;opacity:.6">VIEWPORT &middot; 1440&times;810</div>
      <div id="l-nav" style="position:absolute;left:178px;top:614px;width:620px;height:26px;background:rgba(176,228,204,.08);border-radius:5px"></div>
      <div id="l-hero" style="position:absolute;left:178px;top:654px;width:620px;height:196px;
        background:linear-gradient(148deg,rgba(64,138,113,.34),rgba(9,20,19,.9));border:2px solid var(--brass);border-radius:8px"></div>
      <div id="l-herolbl" style="position:absolute;left:190px;top:666px">
        <span class="chipmint hot" style="background:var(--brass);font-size:15px;padding:4px 9px">LCP ELEMENT</span></div>
      <div id="l-herofile" class="mono" style="position:absolute;left:190px;top:812px;font-size:19px;color:var(--mint)">hero.avif &middot; 1440&times;810 &middot; 214 KB</div>
      <div id="l-rows" style="position:absolute;left:178px;top:866px;width:620px;height:56px"></div>
      <div id="l-needle-ok" class="needle" style="left:${CX-4}px;top:${CY-186}px;width:8px;height:186px"></div>
      <div id="l-fix" style="position:absolute;left:158px;top:966px;width:1120px">
        <div class="mono" style="font-size:19px;color:var(--emerald-lit)">
          <span style="color:var(--mint);font-weight:700">preload</span> the hero and mark it
          <span style="color:var(--mint);font-weight:700">fetchpriority="high"</span> &mdash; discovered in the first round trip</div>
      </div>
      ${readout("l-val2", ["3.8s","3.1s","2.6s","2.1s"],
        "position:absolute;left:" + (CX-160) + "px;top:" + (CY+86) + "px;width:320px;height:70px;text-align:center;font-family:'JBMono',monospace;font-size:58px;font-weight:700;line-height:1.18;color:var(--mint)")}
    </div></div>`;

function arcPath(R, v0, v1) {
  const p = (v) => { const a = (deg(v) - 90) * Math.PI / 180, r = R - 20;
    return [R + r * Math.cos(a), R + r * Math.sin(a)]; };
  const [x0, y0] = p(v0), [x1, y1] = p(v1);
  return `M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${R-20} ${R-20} 0 ${(deg(v1)-deg(v0))>180?1:0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
}

export const script = `${enterAcross()}${headerIn()}
      // graduations, so the face is an instrument and not a pie chart
      var ticks = document.querySelector("#l-ticks");
      for (var v = 0; v <= 6; v += 0.5) {
        var major = Math.abs(v % 1) < 0.01, t = document.createElement("div");
        t.style.cssText = "position:absolute;left:${R-1}px;top:14px;width:" + (major?3:2) + "px;height:" + (major?17:10) +
          "px;background:rgba(176,228,204," + (major?".72":".38") + ");transform-origin:50% ${R-14}px;transform:rotate(" +
          (-120 + (v/6)*240) + "deg)";
        ticks.appendChild(t);
      }
      tl.fromTo("#l-ticks", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: "power2.out" }, 0.20);
      tl.fromTo("#l-arc",   { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, ease: "power2.out" }, 0.28);
      // the viewport builds first — you have to see WHAT is being measured before the reading.
      tl.fromTo("#l-vp",    { autoAlpha: 0, scale: 0.97 }, { autoAlpha: 1, scale: 1, duration: 0.56, ease: "power3.out" }, 0.40);
      tl.fromTo("#l-vplbl", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.36 }, 0.60);
      tl.fromTo("#l-nav",   { autoAlpha: 0, x: -18 }, { autoAlpha: 1, x: 0, duration: 0.40, ease: "power3.out" }, 0.72);
      tl.fromTo("#l-hero",  { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.58, ease: "back.out(1.3)" }, 1.30);
      tl.fromTo("#l-herolbl",  { autoAlpha: 0, y: -10 }, { autoAlpha: 1, y: 0, duration: 0.40, ease: "power3.out" }, 1.72);
      tl.fromTo("#l-herofile", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.40 }, 1.92);
      var rows = document.querySelector("#l-rows");
      for (var i = 0; i < 3; i++) {
        var r = document.createElement("div");
        r.style.cssText = "position:absolute;left:0;top:" + (i*20) + "px;width:" + (560 - i*150) +
          "px;height:9px;background:rgba(176,228,204,.10);border-radius:4px";
        rows.appendChild(r);
        tl.fromTo(r, { autoAlpha: 0, x: -14 }, { autoAlpha: 1, x: 0, duration: 0.34, ease: "power3.out" }, 2.10 + i*0.08);
      }
      // THE NEEDLE — the beat's payoff. Brass, because 3.8s is over the 2.5s budget.
      gsap.set("#l-needle", { rotation: ${deg(0).toFixed(2)} });
${swing("#l-needle", deg(0), deg(3.8), 3.30, true)}
      tl.fromTo("#l-read", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.44, ease: "power3.out" }, 4.16);
      // it does not settle and stop: the reading breathes as the sample keeps arriving,
      // which is what a live instrument does and what stops the beat going dead.
      tl.to("#l-needle", { rotation: ${(deg(3.8)+2.4).toFixed(2)}, duration: 1.5, ease: "sine.inOut", repeat: 3, yoyo: true }, 5.10);
      // THE FIX — the same page with the hero preloaded. The needle is the only place
      // this could land: it falls out of the brass arc and into the green, and the film
      // has spent the whole beat teaching you to read exactly that.
      gsap.set("#l-needle-ok", { rotation: ${deg(3.8).toFixed(2)}, autoAlpha: 0 });
      tl.fromTo("#l-fix", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.46, ease: "power3.out" }, 6.30);
      tl.set("#l-read", { autoAlpha: 0 }, 6.90);
      tl.set("#l-needle", { autoAlpha: 0 }, 6.90);
      tl.set("#l-needle-ok", { autoAlpha: 1 }, 6.90);
      tl.to("#l-needle-ok", { rotation: ${(deg(2.1)-2.2).toFixed(2)}, duration: 1.60, ease: "power3.inOut" }, 6.90);
      tl.to("#l-needle-ok", { rotation: ${deg(2.1).toFixed(2)}, duration: 0.46, ease: "elastic.out(1, 0.62)" }, 8.50);
      tl.to("#l-hero", { borderColor: "rgba(176,228,204,0.95)", duration: 0.5, ease: "power2.out" }, 7.10);${readoutIn("l-val2", 4, 6.90, 0.62)}
      // it settles, and then keeps reading — a live instrument never fully stills.
      tl.to("#l-needle-ok", { rotation: ${(deg(2.1)+1.9).toFixed(2)}, duration: 1.3, ease: "sine.inOut", repeat: 1, yoyo: true }, 9.10);
${exitAcross("#stage", 11.09)}`;
