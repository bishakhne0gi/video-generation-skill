import { field, enterLift, exitAcross, header, headerIn , readout, readoutIn} from "../lib/frame.mjs";
// STATION 13 — caching, as a card-catalogue drawer. ACT 4 opens: back to lamplight.
// Three layers, and the drawer that answers before the request ever leaves.
export const body = `
    ${field("lamplit")}
    <div id="stage" class="stage"><div class="inner">
      ${header("13", "CACHING", "The fastest request<br>is never made.", "Hash the filename and it can be immutable forever. Then serve what you already have while you quietly go and check.")}

      <div id="k-cab" class="panel" style="left:1016px;top:376px;width:786px;height:392px"></div>
      <div id="k-drawers" style="position:absolute;left:1044px;top:404px;width:730px;height:336px"></div>

      <div id="k-hdr" class="mono" style="position:absolute;left:118px;top:600px;font-size:17px;letter-spacing:.15em;opacity:.6">IMMUTABLE ONLY WORKS IF THE NAME CHANGES</div>
      <div id="k-names" style="position:absolute;left:118px;top:634px;width:790px"></div>

      <div id="k-swr" style="position:absolute;left:118px;top:812px;width:790px">
        <div class="mono" style="font-size:17px;letter-spacing:.15em;color:var(--emerald-lit);opacity:.8">STALE WHILE REVALIDATE</div>
        <div id="k-swrrow" style="position:relative;width:790px;height:96px;margin-top:14px"></div></div>

      <div id="k-rate" style="position:absolute;left:118px;top:952px;width:800px">
        <span class="mono" style="font-size:17px;letter-spacing:.15em;opacity:.55">EDGE HIT RATE AFTER ONE DAY</span>
        ${readout("k-hr", ["31%","58%","79%","94%"],
          "position:absolute;left:520px;top:-14px;width:200px;height:56px;font-family:'JBMono',monospace;font-size:44px;font-weight:700;color:var(--mint)")}</div>
    </div></div>`;

export const script = `${enterLift()}${headerIn()}
      tl.fromTo("#k-cab", { autoAlpha: 0, scale: 0.97 }, { autoAlpha: 1, scale: 1, duration: 0.54, ease: "power3.out" }, 0.10);
      // three drawers: browser, edge, origin. The one that answers SLIDES OPEN — a real
      // drawer, so the layer that served the request is a physical event.
      var D = [
        { n: "BROWSER CACHE", d: "0ms", hit: true },
        { n: "CDN EDGE",      d: "24ms", hit: false },
        { n: "ORIGIN",        d: "310ms", hit: false }
      ];
      var dw = document.querySelector("#k-drawers");
      for (var i = 0; i < 3; i++) {
        var d = D[i], el = document.createElement("div");
        el.className = "dr";
        el.style.cssText = "position:absolute;left:0;top:" + (i*116) + "px;width:730px;height:96px;border-radius:8px;" +
          "background:linear-gradient(180deg,#1B4034 0%, #12291F 100%);border:1px solid rgba(176,228,204,.16);" +
          "box-shadow:inset 0 2px 0 rgba(176,228,204,.14), 0 10px 22px rgba(0,0,0,.5)";
        el.innerHTML =
          '<div style="position:absolute;left:22px;top:32px;font-family:JBMono,monospace;font-size:22px;font-weight:700;' +
            'letter-spacing:.12em;color:' + (d.hit ? "var(--mint)" : "var(--emerald-lit)") + ';opacity:' + (d.hit ? "1" : ".62") + '">' + d.n + '</div>' +
          '<div style="position:absolute;right:150px;top:34px;font-family:JBMono,monospace;font-size:22px;font-weight:700;' +
            'color:' + (d.hit ? "var(--mint)" : "var(--emerald-lit)") + ';opacity:' + (d.hit ? "1" : ".5") + '">' + d.d + '</div>' +
          '<div style="position:absolute;right:26px;top:34px;width:96px;height:30px;border-radius:6px;' +
            'background:' + (d.hit ? "var(--mint)" : "transparent") + ';border:1px solid ' +
            (d.hit ? "var(--mint)" : "rgba(176,228,204,.22)") + ';display:flex;align-items:center;justify-content:center;' +
            'font-family:JBMono,monospace;font-size:14px;font-weight:700;letter-spacing:.12em;color:' +
            (d.hit ? "var(--ink)" : "rgba(176,228,204,.45)") + '">' + (d.hit ? "HIT" : "&mdash;") + '</div>' +
          '<div style="position:absolute;left:22px;top:14px;width:52px;height:6px;border-radius:3px;' +
            'background-image:url(\\'assets/plates/brass.jpg\\');background-size:cover;opacity:.8"></div>';
        dw.appendChild(el);
        tl.fromTo(el, { autoAlpha: 0, x: 26 }, { autoAlpha: 1, x: 0, duration: 0.44, ease: "power3.out" }, 0.40 + i*0.16);
      }
      // the browser drawer slides out and answers. Cause, then effect.
      tl.to(dw.children[0], { x: 84, duration: 0.46, ease: "back.out(1.4)" }, 2.00);
      tl.to(dw.children[0], { x: 72, duration: 0.36, ease: "power2.out" }, 2.46);
      // the filenames that make it safe.
      var N = [
        { n: "app.js", h: "no-cache, revalidate every load", ok: false },
        { n: "app.4f2c9a.js", h: "max-age=31536000, immutable", ok: true }
      ];
      var nw = document.querySelector("#k-names");
      for (var j = 0; j < 2; j++) {
        var o = N[j], row = document.createElement("div");
        row.style.cssText = "position:absolute;left:0;top:" + (j*66) + "px;width:790px;height:56px";
        row.innerHTML =
          '<div style="font-family:JBMono,monospace;font-size:23px;font-weight:700;color:' +
            (o.ok ? "var(--mint)" : "var(--brass)") + '">' + o.n + '</div>' +
          '<div style="font-family:JBMono,monospace;font-size:16px;margin-top:5px;color:' +
            (o.ok ? "var(--emerald-lit)" : "var(--brass)") + ';opacity:.72">' + o.h + '</div>';
        nw.appendChild(row);
        tl.fromTo(row, { autoAlpha: 0, x: -18 }, { autoAlpha: 1, x: 0, duration: 0.42, ease: "power3.out" }, 2.90 + j*0.44);
      }
      // stale-while-revalidate, drawn as what it is: answer now, check behind.
      tl.fromTo("#k-swr", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.44, ease: "power3.out" }, 4.10);
      var sw = document.querySelector("#k-swrrow");
      var served = document.createElement("div");
      served.style.cssText = "position:absolute;left:0;top:0;width:300px;height:34px;border-radius:6px;transform-origin:0% 50%;" +
        "background:var(--mint);display:flex;align-items:center;padding-left:14px;font-family:JBMono,monospace;" +
        "font-size:15px;font-weight:700;color:var(--ink)";
      served.textContent = "served instantly from cache";
      var revalid = document.createElement("div");
      revalid.style.cssText = "position:absolute;left:0;top:48px;width:470px;height:34px;border-radius:6px;transform-origin:0% 50%;" +
        "background:rgba(64,138,113,.5);display:flex;align-items:center;padding-left:14px;font-family:JBMono,monospace;" +
        "font-size:15px;color:var(--mint)";
      revalid.textContent = "revalidated in the background \\u2014 nobody waited";
      sw.appendChild(served); sw.appendChild(revalid);
      tl.fromTo(served,  { scaleX: 0 }, { scaleX: 1, duration: 0.34, ease: "power3.out" }, 4.40);
      tl.fromTo(revalid, { scaleX: 0 }, { scaleX: 1, duration: 0.78, ease: "power2.out" }, 4.60);
      // the drawer keeps answering: three more requests arrive and none of them travel.
      tl.fromTo("#k-rate", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.44, ease: "power3.out" }, 6.10);${readoutIn("k-hr", 4, 6.40, 0.70)}
      for (var h2 = 0; h2 < 3; h2++) {
        var ht = 6.60 + h2*0.98;
        tl.to(dw.children[0], { x: 96, duration: 0.22, ease: "power3.out" }, ht);
        tl.to(dw.children[0], { x: 72, duration: 0.30, ease: "power2.out" }, ht + 0.24);
      }
${exitAcross("#stage", 10.37)}`;
