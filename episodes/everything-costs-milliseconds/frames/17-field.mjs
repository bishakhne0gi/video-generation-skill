import { field, enterAcross, exitZBack, header, headerIn , readout, readoutIn} from "../lib/frame.mjs";
// STATION 15 — the field. This is also the ROUTE MAP: every instrument in the film,
// laid out in the order we travelled them, lighting one by one. A journey has earned
// a map, and here the map and the panel are the same object.
const DIALS = [
  "distribution","LCP","CLS","INP","critical path","fonts","images","bundle",
  "rendering","hydration","main thread","paint","caching","third parties","the field"
];
const HOT = [1,2,3,4,7,13];                 // the ones that were over budget in the film
export const body = `
    ${field("lamplit")}
    <div id="stage" class="stage"><div class="inner">
      ${header("15", "THE FIELD", "Watch it where<br>the users are.", "Lab numbers are a rehearsal. Ship real user monitoring, put a budget in the pipeline, and let the build fail before the customer does.")}

      <div id="w-panel" class="panel" style="left:1006px;top:352px;width:812px;height:436px"></div>
      <div id="w-grid" style="position:absolute;left:1042px;top:388px;width:740px;height:364px"></div>

      <div id="w-ci" class="panel" style="left:118px;top:640px;width:800px;height:296px;background:#080C0B"></div>
      <div id="w-cibar" style="position:absolute;left:118px;top:640px;width:800px;height:38px;
        background:rgba(176,228,204,.05);border-bottom:1px solid rgba(176,228,204,.12);border-radius:10px 10px 0 0"></div>
      <div class="mono" style="position:absolute;left:142px;top:651px;font-size:15px;letter-spacing:.12em;opacity:.55">performance budget &middot; pull request #412</div>
      <div id="w-cilines" style="position:absolute;left:142px;top:702px;width:752px"></div>
      <div id="w-verdict" style="position:absolute;left:142px;top:866px">
        <span class="chipmint" style="background:var(--brass);font-size:17px;padding:8px 16px;letter-spacing:.1em">BUILD FAILED &mdash; LCP +410ms</span></div>

      <div id="w-fixed" style="position:absolute;left:142px;top:866px">
        <span class="chipmint" style="font-size:17px;padding:8px 16px;letter-spacing:.1em">BUILD PASSED &mdash; LCP 2.28s</span></div>
    </div></div>`;

export const script = `${enterAcross()}${headerIn()}
      tl.fromTo("#w-panel", { autoAlpha: 0, scale: 0.97 }, { autoAlpha: 1, scale: 1, duration: 0.56, ease: "power3.out" }, 0.08);
      // the route, redrawn as fifteen instruments — four across, four back, four across, three.
      var D = ${JSON.stringify(DIALS)}, HOT = ${JSON.stringify(HOT)}, g = document.querySelector("#w-grid");
      var COLS = 4, CW = 185, CH = 91;
      for (var i = 0; i < D.length; i++) {
        var row = Math.floor(i / COLS), col = i % COLS;
        if (row % 2 === 1) col = COLS - 1 - col;          // serpentine: alternate rows run back
        var hot = HOT.indexOf(i) >= 0;
        var cell = document.createElement("div");
        cell.className = "dial";
        cell.style.cssText = "position:absolute;left:" + (col*CW) + "px;top:" + (row*CH) + "px;width:" + (CW-18) + "px;height:" + (CH-16) + "px";
        cell.innerHTML =
          '<div style="position:absolute;left:0;top:0;width:56px;height:56px;border-radius:50%;' +
            'background-image:url(\\'assets/plates/brass.jpg\\');background-size:cover;' +
            'box-shadow:inset 1px 1px 3px rgba(255,236,196,.5),inset -2px -2px 4px rgba(0,0,0,.6),0 5px 12px rgba(0,0,0,.55)"></div>' +
          '<div style="position:absolute;left:6px;top:6px;width:44px;height:44px;border-radius:50%;' +
            'background:radial-gradient(120% 120% at 32% 22%, #2E6551 0%, #16302A 52%, #091413 100%)"></div>' +
          '<div class="mini" style="position:absolute;left:27px;top:12px;width:3px;height:17px;transform-origin:50% 100%;' +
            'border-radius:2px;background:' + (hot ? "var(--brass)" : "var(--mint)") + '"></div>' +
          '<div style="position:absolute;left:68px;top:14px;width:' + (CW-92) + 'px;font-family:JBMono,monospace;font-size:14px;' +
            'line-height:1.32;color:' + (hot ? "var(--brass)" : "var(--emerald-lit)") + '">' + D[i] + '</div>';
        g.appendChild(cell);
        // each instrument lights in ROUTE order — the film replayed at a glance.
        tl.fromTo(cell, { autoAlpha: 0, scale: 0.86 }, { autoAlpha: 1, scale: 1, duration: 0.34, ease: "back.out(1.6)" }, 0.60 + i*0.115);
        var target = hot ? 58 : -34;
        tl.fromTo(cell.querySelector(".mini"), { rotation: -120 }, { rotation: target, duration: 0.52, ease: "power3.out" }, 0.70 + i*0.115);
      }
      // hold with every station lit — the map complete, before the end card takes it.
      // the CI gate: the number defended automatically, which is the actual takeaway.
      tl.fromTo("#w-ci",    { autoAlpha: 0, scale: 0.97 }, { autoAlpha: 1, scale: 1, duration: 0.50, ease: "power3.out" }, 2.60);
      tl.fromTo("#w-cibar", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.34 }, 2.72);
      var CI = [
        '<span style="opacity:.5">$</span> npx lighthouse-ci assert',
        '',
        '  LCP        <span style="color:var(--mint)">2.31s</span> &rarr; <span class="hot">2.72s</span>   budget 2.50s  <span class="hot">FAIL</span>',
        '  INP        <span style="color:var(--mint)">142ms</span> &rarr; <span style="color:var(--mint)">148ms</span>   budget  200ms  <span style="color:var(--mint)">pass</span>',
        '  bundle     <span style="color:var(--mint)">178 KB</span> &rarr; <span style="color:var(--mint)">181 KB</span>  budget  200 KB  <span style="color:var(--mint)">pass</span>'
      ];
      var cw = document.querySelector("#w-cilines");
      for (var k = 0; k < CI.length; k++) {
        var ln = document.createElement("div");
        ln.style.cssText = "font-family:JBMono,monospace;font-size:18px;line-height:1.72;color:var(--emerald-lit);white-space:nowrap";
        ln.innerHTML = CI[k] || "&nbsp;"; cw.appendChild(ln);
        tl.fromTo(ln, { autoAlpha: 0, x: -12 }, { autoAlpha: 1, x: 0, duration: 0.30, ease: "power3.out" }, 2.90 + k*0.30);
      }
      tl.fromTo("#w-verdict", { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 0.46, ease: "back.out(1.6)" }, 4.70);
      // 0.6s of stillness before the Z-back — the cheapest emphasis in the kit, spent on
      // the one seam in the film that is allowed to be an arrival.
      // the gate is the point of the station, so it has to be seen WORKING: the author
      // pushes a fix, the run goes again, and the number is defended without anyone asking.
      tl.to("#w-verdict", { autoAlpha: 0, y: -10, duration: 0.34, ease: "power2.in" }, 6.60);
      gsap.set("#w-fixed", { autoAlpha: 0 });
      var again = cw.children[2];
      tl.to(again, { autoAlpha: 0.25, duration: 0.30 }, 6.70);
      tl.to(again, { autoAlpha: 1, duration: 0.30 }, 7.30);
      tl.fromTo("#w-fixed", { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 0.46, ease: "back.out(1.6)" }, 7.40);
      // every instrument on the panel settles back into the green as the budget holds.
      var minis = document.querySelectorAll("#w-grid .mini");
      for (var f2 = 0; f2 < minis.length; f2++)
        tl.to(minis[f2], { rotation: -34, backgroundColor: "#B0E4CC", duration: 0.60, ease: "power2.inOut" }, 7.60 + f2*0.052);
${exitZBack("#stage", 9.48)}`;
