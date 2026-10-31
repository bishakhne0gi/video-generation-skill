import { field, enterLift, exitLift, header, headerIn , readout, readoutIn} from "../lib/frame.mjs";
// STATION 08 — the bundle, on brass scales. Closes ACT 2. What you wrote against what
// shipped, and then the same app split by route. The beam actually tips.
const PIV = { x: 1414, y: 452 }, ARM = 268;
export const body = `
    ${field("interior")}
    <div id="stage" class="stage"><div class="inner">
      ${header("08", "THE BUNDLE", "You wrote 42 KB.<br>You shipped 780.", "Every import is a promise to every visitor. The gap between your source and your bundle is made of dependencies you never opened.")}

      <div id="b-post" style="position:absolute;left:${PIV.x-13}px;top:${PIV.y}px;width:26px;height:318px;
        background-image:url('assets/plates/brass.jpg');background-size:cover;
        box-shadow:inset 2px 0 4px rgba(255,236,196,.5), inset -3px 0 5px rgba(0,0,0,.6)"></div>
      <div id="b-base" style="position:absolute;left:${PIV.x-118}px;top:${PIV.y+310}px;width:236px;height:26px;border-radius:8px;
        background-image:url('assets/plates/brass.jpg');background-size:cover;
        box-shadow:inset 2px 2px 4px rgba(255,236,196,.5), inset -3px -3px 6px rgba(0,0,0,.6), 0 14px 30px rgba(0,0,0,.6)"></div>

      <div id="b-beam" style="position:absolute;left:${PIV.x-ARM}px;top:${PIV.y-7}px;width:${ARM*2}px;height:14px;
        transform-origin:50% 50%;border-radius:7px;
        background-image:url('assets/plates/brass.jpg');background-size:cover;
        box-shadow:inset 0 2px 4px rgba(255,236,196,.55), inset 0 -3px 5px rgba(0,0,0,.6), 0 8px 20px rgba(0,0,0,.5)">
        <div id="b-panL" style="position:absolute;left:-104px;top:14px;width:208px">
          <div style="width:2px;height:56px;background:rgba(232,161,60,.6);margin:0 auto"></div>
          <div class="panel" style="position:relative;left:0;top:0;width:208px;height:106px;box-shadow:0 12px 26px rgba(0,0,0,.6)">
            <div class="mono" style="position:absolute;left:0;top:16px;width:208px;text-align:center;font-size:15px;letter-spacing:.14em;opacity:.6">YOUR SOURCE</div>
            <div class="mono" style="position:absolute;left:0;top:44px;width:208px;text-align:center;font-size:38px;font-weight:700;line-height:1.18;color:var(--mint)">42 KB</div></div></div>
        <div id="b-panR" style="position:absolute;right:-104px;top:14px;width:208px">
          <div style="width:2px;height:56px;background:rgba(232,161,60,.6);margin:0 auto"></div>
          <div class="panel" style="position:relative;left:0;top:0;width:208px;height:106px;border-color:rgba(232,161,60,.42);box-shadow:0 12px 26px rgba(0,0,0,.6)">
            <div class="mono hot" style="position:absolute;left:0;top:16px;width:208px;text-align:center;font-size:15px;letter-spacing:.14em;opacity:.85">WHAT SHIPPED</div>
            <div id="b-ship" class="mono hot" style="position:absolute;left:0;top:44px;width:208px;text-align:center;font-size:38px;font-weight:700;line-height:1.18">780 KB</div></div></div>
      </div>

      <div id="b-culp" style="position:absolute;left:118px;top:640px;width:800px"></div>

      <div id="b-fix" style="position:absolute;left:118px;top:876px;width:1100px">
        <div class="mono" style="font-size:19px;color:var(--emerald-lit);line-height:1.75">
          <span class="hot">split by route</span> &middot; the checkout page does not need the editor<br>
          <span class="hot">import { x }</span> &middot; a namespace import defeats tree shaking</div></div>
      ${readout("b-ship2", ["780 KB","520 KB","310 KB","180 KB"],
        "position:absolute;left:0;top:44px;width:208px;text-align:center;height:52px;font-family:'JBMono',monospace;font-size:38px;font-weight:700;line-height:1.18;color:var(--mint)")}
      <div id="b-split" style="position:absolute;left:118px;top:966px;width:1240px">
        <div class="mono" style="font-size:19px;color:var(--emerald-lit)">
          split by route and the checkout page ships
          <span style="color:var(--mint);font-weight:700">180 KB</span> &mdash; the editor loads when somebody opens the editor</div></div>
    </div></div>`;

export const script = `${enterLift()}${headerIn()}
      tl.fromTo("#b-base", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.46, ease: "power3.out" }, 0.10);
      tl.fromTo("#b-post", { autoAlpha: 0, scaleY: 0 }, { autoAlpha: 1, scaleY: 1, duration: 0.50, ease: "power3.out" }, 0.18);
      gsap.set("#b-post", { transformOrigin: "50% 100%" });
      tl.fromTo("#b-beam", { autoAlpha: 0, rotation: 0 }, { autoAlpha: 1, duration: 0.44, ease: "power2.out" }, 0.42);
      // the beam TIPS — the weight is the argument, and it lands with real mass.
      tl.fromTo("#b-beam", { rotation: 0 }, { rotation: 13.4, duration: 0.94, ease: "power3.out" }, 1.60);
      tl.to("#b-beam", { rotation: 11.6, duration: 0.62, ease: "elastic.out(1, 0.58)" }, 2.54);
      // the panels stay level: a scale pan hangs plumb no matter what the beam does.
      tl.fromTo("#b-panL", { rotation: 0 }, { rotation: -13.4, duration: 0.94, ease: "power3.out" }, 1.60);
      tl.to("#b-panL", { rotation: -11.6, duration: 0.62, ease: "elastic.out(1, 0.58)" }, 2.54);
      tl.fromTo("#b-panR", { rotation: 0 }, { rotation: -13.4, duration: 0.94, ease: "power3.out" }, 1.60);
      tl.to("#b-panR", { rotation: -11.6, duration: 0.62, ease: "elastic.out(1, 0.58)" }, 2.54);
      // what is actually in there. Named, with real sizes — this is the teaching.
      var C = [
        { n: "moment.js + locales", kb: 232, note: "you used one format string" },
        { n: "lodash (namespace)",  kb: 174, note: "import * defeats tree shaking" },
        { n: "icon set (all 1,100)", kb: 148, note: "you render nine of them" },
        { n: "your application",     kb: 42,  note: "" }
      ];
      var cw = document.querySelector("#b-culp");
      for (var i = 0; i < C.length; i++) {
        var c = C[i], mine = i === 3, row = document.createElement("div");
        row.style.cssText = "position:absolute;left:0;top:" + (i*54) + "px;width:800px;height:52px";
        row.innerHTML =
          '<span style="position:absolute;left:0;top:2px;font-family:JBMono,monospace;font-size:18px;color:' +
            (mine ? "var(--mint)" : "var(--emerald-lit)") + '">' + c.n + '</span>' +
          '<div class="bar" style="position:absolute;left:330px;top:4px;width:' + (c.kb*0.95) + 'px;height:22px;border-radius:5px;' +
            'transform-origin:0% 50%;background:' + (mine ? "var(--mint)" : "rgba(232,161,60,.55)") + '"></div>' +
          '<span style="position:absolute;left:' + (342 + c.kb*0.95) + 'px;top:5px;font-family:JBMono,monospace;font-size:16px;' +
            'font-weight:700;color:' + (mine ? "var(--mint)" : "var(--brass)") + '">' + c.kb + ' KB</span>' +
          (c.note ? '<span style="position:absolute;left:0;top:30px;font-family:JBMono,monospace;font-size:14px;' +
            'color:var(--mint);opacity:.42">' + c.note + '</span>' : "");
        cw.appendChild(row);
        tl.fromTo(row, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.24 }, 3.30 + i*0.40);
        tl.fromTo(row.querySelector(".bar"), { scaleX: 0 }, { scaleX: 1, duration: 0.48, ease: "power3.out" }, 3.30 + i*0.40);
      }
      tl.fromTo("#b-fix", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.48, ease: "power3.out" }, 5.30);
      // THE FIX — the beam comes back toward level as the weight comes off. This is the
      // largest movement in the beat and it lands on the last thing the line says.
      tl.fromTo("#b-split", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.46, ease: "power3.out" }, 6.10);
      tl.set("#b-ship", { autoAlpha: 0 }, 6.50);
      tl.to("#b-beam", { rotation: 2.4, duration: 1.90, ease: "power2.inOut" }, 6.50);
      tl.to("#b-panL", { rotation: -2.4, duration: 1.90, ease: "power2.inOut" }, 6.50);
      tl.to("#b-panR", { rotation: -2.4, duration: 1.90, ease: "power2.inOut" }, 6.50);
      tl.to("#b-beam", { rotation: 1.6, duration: 0.70, ease: "elastic.out(1, 0.6)" }, 8.40);
      tl.to("#b-panL", { rotation: -1.6, duration: 0.70, ease: "elastic.out(1, 0.6)" }, 8.40);
      tl.to("#b-panR", { rotation: -1.6, duration: 0.70, ease: "elastic.out(1, 0.6)" }, 8.40);
      for (var d2 = 0; d2 < 3; d2++)
        tl.to(cw.children[d2], { autoAlpha: 0.22, duration: 0.50, ease: "power2.out" }, 6.60 + d2*0.26);${readoutIn("b-ship2", 4, 6.50, 0.56)}
${exitLift("#stage", 9.54)}`;
