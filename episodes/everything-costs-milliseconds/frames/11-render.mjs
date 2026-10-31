import { field, enterLift, exitAcross, header, headerIn , sweep, sweepIn} from "../lib/frame.mjs";
// STATION 09 — rendering strategy, as a patch panel. ACT 3 opens: the brightest field.
// Four strategies, and the honest cost of each, measured on the same page.
const ROWS = [
  { n: "Static (SSG)",        ttfb: 0.04, paint: 0.32, inter: 0.48, note: "prebuilt, cached at the edge" },
  { n: "Streaming SSR",       ttfb: 0.18, paint: 0.54, inter: 1.36, note: "shell first, data flushed after" },
  { n: "Islands",             ttfb: 0.16, paint: 0.50, inter: 0.74, note: "only the interactive parts hydrate" },
  { n: "Client rendering",    ttfb: 0.06, paint: 1.92, inter: 2.84, note: "framework first, content later", hot: true },
];
export const body = `
    ${field("inspection")}
    <div id="stage" class="stage"><div class="inner">
      ${header("09", "RENDERING STRATEGY", "Where the HTML<br>comes from.", "Every strategy trades server time against client time. Client rendering is the only one that makes the user pay for your framework before they see a word.")}

      <div id="r-panel" class="panel" style="left:118px;top:530px;width:1684px;height:412px"></div>
      <div id="r-head" style="position:absolute;left:158px;top:556px;width:1604px;height:30px">
        <span class="mono" style="position:absolute;left:0;top:0;font-size:15px;letter-spacing:.16em;opacity:.55">STRATEGY</span>
        <span class="mono" style="position:absolute;left:392px;top:0;font-size:15px;letter-spacing:.16em;opacity:.55">TTFB &rarr; PAINT &rarr; INTERACTIVE</span>
        <span class="mono" style="position:absolute;right:0;top:0;font-size:15px;letter-spacing:.16em;opacity:.55">TIME TO INTERACTIVE</span></div>
      <div id="r-rows" style="position:absolute;left:158px;top:600px;width:1604px;height:324px"></div>
      ${sweep("r-sweep", 118, 530, 1684, 412)}
      <div id="r-pick" style="position:absolute;left:158px;top:962px;width:1500px">
        <div class="mono" style="font-size:19px;color:var(--emerald-lit)">
          you are almost never choosing one &mdash;
          <span style="color:var(--mint);font-weight:700">static for the marketing page, streaming for the product page, islands for the widgets</span></div></div>
    </div></div>`;

export const script = `${enterLift()}${headerIn()}
      tl.fromTo("#r-panel", { autoAlpha: 0, scale: 0.98 }, { autoAlpha: 1, scale: 1, duration: 0.56, ease: "power3.out" }, 0.10);
      tl.fromTo("#r-head",  { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.40 }, 0.30);
      var R = ${JSON.stringify(ROWS)}, wrap = document.querySelector("#r-rows"), S = 300;
      for (var i = 0; i < R.length; i++) {
        var r = R[i], col = r.hot ? "var(--brass)" : "var(--emerald-lit)";
        var row = document.createElement("div");
        row.style.cssText = "position:absolute;left:0;top:" + (i*80) + "px;width:1604px;height:68px";
        row.innerHTML =
          '<span style="position:absolute;left:0;top:2px;font-family:Archivo,sans-serif;font-weight:500;font-size:26px;color:' +
            (r.hot ? "var(--brass)" : "var(--mint)") + '">' + r.n + '</span>' +
          '<span style="position:absolute;left:0;top:36px;font-family:JBMono,monospace;font-size:15px;color:var(--mint);opacity:.42">' + r.note + '</span>' +
          '<div class="seg s1" style="position:absolute;left:392px;top:14px;height:22px;border-radius:4px;transform-origin:0% 50%;' +
            'width:' + Math.max(r.ttfb*S, 8) + 'px;background:rgba(64,138,113,.55)"></div>' +
          '<div class="seg s2" style="position:absolute;left:' + (396 + r.ttfb*S) + 'px;top:14px;height:22px;border-radius:4px;' +
            'transform-origin:0% 50%;width:' + ((r.paint-r.ttfb)*S) + 'px;background:rgba(64,138,113,.85)"></div>' +
          '<div class="seg s3" style="position:absolute;left:' + (400 + r.paint*S) + 'px;top:14px;height:22px;border-radius:4px;' +
            'transform-origin:0% 50%;width:' + ((r.inter-r.paint)*S) + 'px;background:' +
            (r.hot ? "rgba(232,161,60,.85)" : "rgba(176,228,204,.42)") + '"></div>' +
          '<span style="position:absolute;right:0;top:8px;font-family:JBMono,monospace;font-size:30px;font-weight:700;color:' +
            col + '">' + r.inter.toFixed(2) + 's</span>';
        wrap.appendChild(row);
        tl.fromTo(row, { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: 0.44, ease: "power3.out" }, 0.80 + i*0.62);
        var segs = row.querySelectorAll(".seg");
        for (var s = 0; s < segs.length; s++)
          tl.fromTo(segs[s], { scaleX: 0 }, { scaleX: 1, duration: 0.36, ease: "power2.out" }, 0.92 + i*0.62 + s*0.16);
      }
      // the legend arrives last, once the shapes have already made the point.
      var leg = document.createElement("div");
      leg.style.cssText = "position:absolute;left:392px;top:300px;font-family:JBMono,monospace;font-size:14px;letter-spacing:.12em;color:var(--mint);opacity:.5";
      leg.innerHTML = "&#9632; server &nbsp;&#9632; paint &nbsp;&#9632; hydrate";
      wrap.appendChild(leg);
      tl.fromTo(leg, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.40 }, 3.90);
      // the panel is read back row by row, the losing rows dim, and the two that survive
      // stay lit. The beat resolves into an answer rather than stopping on a table.
      tl.fromTo("#r-pick", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.46, ease: "power3.out" }, 6.60);
      var rows2 = document.querySelectorAll("#r-rows > div");
      tl.to(rows2[3], { autoAlpha: 0.30, duration: 0.60, ease: "power2.out" }, 5.10);
      tl.to(rows2[1], { autoAlpha: 0.42, duration: 0.60, ease: "power2.out" }, 5.80);
      tl.to(rows2[0], { scale: 1.012, duration: 0.50, ease: "power2.out" }, 6.50);
      tl.to(rows2[2], { scale: 1.012, duration: 0.50, ease: "power2.out" }, 7.10);
      tl.to(rows2[1], { autoAlpha: 1.0, duration: 0.70, ease: "power2.out" }, 7.95);${sweepIn("r-sweep", 1684-Math.round(1684*0.22), 4.60, 2.30, 1)}
${exitAcross("#stage", 9.66)}`;
