import { field, enterAcross, exitAcross, header, headerIn , readout, readoutIn} from "../lib/frame.mjs";
// STATION 10 — hydration. The page is painted and dead. The tree gets walked a second
// time on the user's device, and a scan sweeping it is the honest picture of that.
export const body = `
    ${field("inspection")}
    <div id="stage" class="stage"><div class="inner">
      ${header("10", "HYDRATION", "Painted is not<br>the same as alive.", "The server sent finished HTML. The client then rebuilds the entire component tree to attach behaviour &mdash; and until it finishes, nothing answers.")}

      <div id="h-tree" style="position:absolute;left:1006px;top:392px;width:812px;height:392px"></div>
      <div id="h-scan" style="position:absolute;left:1006px;top:392px;width:6px;height:392px;
        background:linear-gradient(180deg,rgba(232,161,60,0),var(--brass),rgba(232,161,60,0));
        box-shadow:0 0 22px rgba(232,161,60,.6)"></div>

      <div id="h-page" class="panel" style="left:158px;top:582px;width:660px;height:300px"></div>
      <div id="h-pagein" style="position:absolute;left:186px;top:610px;width:604px;height:244px"></div>
      <div id="h-state" style="position:absolute;left:186px;top:816px;width:604px">
        <span id="h-dead" class="chipmint" style="background:rgba(232,161,60,.9);font-size:16px;padding:7px 14px">NOT INTERACTIVE</span>
        <span id="h-live" class="chipmint" style="font-size:16px;padding:7px 14px;position:absolute;left:0;top:0">INTERACTIVE</span></div>

      <div id="h-clock" style="position:absolute;left:1006px;top:816px;width:812px;display:flex;justify-content:space-between">
        <div><div class="mono" style="font-size:16px;letter-spacing:.15em;opacity:.6">PAINTED</div>
             <div class="mono" style="font-size:36px;font-weight:700;line-height:1.18;color:var(--mint)">0.9s</div></div>
        <div style="text-align:right"><div class="mono hot" style="font-size:16px;letter-spacing:.15em;opacity:.85">INTERACTIVE</div>
             <div class="mono hot" style="font-size:36px;font-weight:700;line-height:1.18">3.4s</div></div></div>
      <div id="h-isl" style="position:absolute;left:158px;top:930px;width:1300px">
        <div class="mono" style="font-size:19px;color:var(--emerald-lit)">
          ship <span style="color:var(--mint);font-weight:700">islands</span> &mdash;
          hydrate the three components that actually do something, and leave the other thirty-nine as HTML</div></div>
      ${readout("h-tti", ["3.4s","2.6s","1.7s","0.8s"],
        "position:absolute;left:1660px;top:848px;width:160px;text-align:right;height:48px;font-family:'JBMono',monospace;font-size:36px;font-weight:700;line-height:1.18;color:var(--mint)")}
    </div></div>`;

export const script = `${enterAcross()}${headerIn()}
      // the painted page: complete, and completely inert.
      tl.fromTo("#h-page", { autoAlpha: 0, scale: 0.97 }, { autoAlpha: 1, scale: 1, duration: 0.52, ease: "power3.out" }, 0.10);
      var pg = document.querySelector("#h-pagein"), PW = [604, 540, 588, 470, 604, 396];
      for (var i = 0; i < 6; i++) {
        var r = document.createElement("div");
        r.style.cssText = "position:absolute;left:0;top:" + (i*32) + "px;width:" + PW[i] +
          "px;height:16px;border-radius:8px;background:rgba(176,228,204,.14)";
        pg.appendChild(r);
        tl.fromTo(r, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.22 }, 0.30 + i*0.05);
      }
      gsap.set("#h-live", { autoAlpha: 0 });
      tl.fromTo("#h-dead", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.34 }, 0.70);
      // the tree — 42 components, laid out as a real hierarchy, all of it cold.
      var tw = document.querySelector("#h-tree"), nodes = [];
      var LEVELS = [1, 3, 7, 12, 19];
      for (var L = 0; L < LEVELS.length; L++) {
        for (var k = 0; k < LEVELS[L]; k++) {
          var n = document.createElement("div"), gapx = 812 / (LEVELS[L] + 1);
          n.style.cssText = "position:absolute;left:" + (gapx*(k+1) - 11) + "px;top:" + (L*84) +
            "px;width:22px;height:22px;border-radius:5px;background:rgba(11,16,15,.9);" +
            "border:1px solid rgba(176,228,204,.30)";
          tw.appendChild(n); nodes.push({ el: n, L: L });
        }
      }
      tl.fromTo("#h-tree", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.50 }, 0.44);
      // the scan sweeps the tree top to bottom and each node LIGHTS as it is reached.
      // This is the sustained motion of the beat and it is the mechanism, not decoration.
      tl.fromTo("#h-scan", { autoAlpha: 0, x: 0 }, { autoAlpha: 1, duration: 0.24 }, 1.70);
      tl.to("#h-scan", { x: 806, duration: 3.60, ease: "none" }, 1.80);
      tl.to("#h-scan", { autoAlpha: 0, duration: 0.30 }, 5.40);
      for (var j = 0; j < nodes.length; j++) {
        var frac = (parseFloat(nodes[j].el.style.left) + 11) / 812;
        tl.to(nodes[j].el, { backgroundColor: "rgba(176,228,204,0.92)", duration: 0.22, ease: "power2.out" }, 1.80 + frac*3.60);
      }
      // only when the last node is attached does the page become a page.
      tl.to("#h-dead", { autoAlpha: 0, duration: 0.26 }, 5.46);
      tl.to("#h-live", { autoAlpha: 1, duration: 0.30, ease: "power3.out" }, 5.52);
      tl.fromTo("#h-clock", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.44, ease: "power3.out" }, 5.60);
      // THE FIX — the tree is re-run as islands: three nodes light, the rest stay cold,
      // and the whole sweep is over in a fraction of the time it just took.
      tl.fromTo("#h-isl", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.46, ease: "power3.out" }, 6.30);
      for (var c2 = 0; c2 < nodes.length; c2++)
        tl.to(nodes[c2].el, { backgroundColor: "rgba(11,16,15,0.9)", duration: 0.30, ease: "power2.out" }, 6.70);
      var islands = [nodes[4], nodes[13], nodes[27]];
      for (var s2 = 0; s2 < islands.length; s2++) {
        tl.to(islands[s2].el, { backgroundColor: "rgba(176,228,204,0.92)", duration: 0.26, ease: "back.out(2)" }, 7.30 + s2*0.30);
        tl.to(islands[s2].el, { scale: 1.55, duration: 0.30, ease: "back.out(2.2)" }, 7.30 + s2*0.30);
      }
      tl.set("#h-clock", { autoAlpha: 0 }, 7.10);${readoutIn("h-tti", 4, 7.10, 0.52)}
${exitAcross("#stage", 10.37)}`;
