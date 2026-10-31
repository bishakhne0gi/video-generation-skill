import { field, enterAcross, exitAcross, header, headerIn , readout, readoutIn} from "../lib/frame.mjs";
// STATION 06 — render-blocking CSS and fonts, on the letterpress case. The three states
// of a webfont are shown as three real specimens, because that is what the user sees.
export const body = `
    ${field("interior")}
    <div id="stage" class="stage"><div class="inner">
      <div class="plate" style="background-image:url('assets/plates/letterpress.jpg');opacity:.20;
        mask-image:radial-gradient(56% 70% at 76% 62%, #000 0%, transparent 74%);
        -webkit-mask-image:radial-gradient(56% 70% at 76% 62%, #000 0%, transparent 74%)"></div>
      ${header("06", "RENDER BLOCKING", "The head holds<br>the page shut.", "A stylesheet in the head stops first paint until it lands. A font does the same to the words &mdash; and then chooses whether to hide them or swap them.")}

      <div id="f-specs" style="position:absolute;left:118px;top:566px;width:1006px"></div>

      <div id="f-code" class="panel" style="left:1176px;top:392px;width:632px;height:284px;background:#080C0B"></div>
      <div id="f-codebar" style="position:absolute;left:1176px;top:392px;width:632px;height:36px;
        background:rgba(176,228,204,.05);border-bottom:1px solid rgba(176,228,204,.12);border-radius:10px 10px 0 0"></div>
      <div class="mono" style="position:absolute;left:1200px;top:402px;font-size:15px;letter-spacing:.12em;opacity:.55">index.html</div>
      <div id="f-lines" style="position:absolute;left:1200px;top:452px;width:590px"></div>

      <div id="f-note" style="position:absolute;left:1176px;top:706px;width:632px">
        <div class="mono" style="font-size:19px;color:var(--emerald-lit);line-height:1.7">
          <span class="hot">font-display: swap</span> &mdash; show fallback, swap on arrival<br>
          <span class="hot">rel="preload"</span> &mdash; fetch it without waiting for CSS<br>
          <span style="opacity:.6">one face above the fold. Not the family.</span></div></div>
      <div id="f-tl" style="position:absolute;left:118px;top:906px;width:1006px">
        <div class="mono" style="font-size:17px;letter-spacing:.15em;opacity:.55">WHEN THE WORDS BECOME READABLE</div>
        <div id="f-tlbad" style="position:absolute;left:0;top:36px;width:640px;height:22px;border-radius:5px;transform-origin:0% 50%;
          background:repeating-linear-gradient(112deg,rgba(232,161,60,.42) 0 9px,rgba(232,161,60,.12) 9px 20px);border:1px solid rgba(232,161,60,.6)"></div>
        <div id="f-tlbadl" class="mono hot" style="position:absolute;left:656px;top:38px;font-size:18px;font-weight:700">2.4s &mdash; default</div>
        <div id="f-tlok" style="position:absolute;left:0;top:70px;width:80px;height:22px;border-radius:5px;transform-origin:0% 50%;background:var(--mint)"></div>
        <div id="f-tlokl" class="mono" style="position:absolute;left:96px;top:72px;font-size:18px;font-weight:700;color:var(--mint)">0.3s &mdash; preloaded, swapped</div></div>
    </div></div>`;

export const script = `${enterAcross()}${headerIn()}
      // the three specimens: what the reader actually gets, in order, on a slow connection.
      var S = [
        { t: "0.0s &mdash; 1.2s", l: "FOIT", d: "invisible text, nothing to read", cls: "blank" },
        { t: "1.2s &mdash; 2.4s", l: "SWAP", d: "fallback face, readable immediately", cls: "fallback" },
        { t: "2.4s", l: "LOADED", d: "brand face, one reflow", cls: "brand" }
      ];
      var wrap = document.querySelector("#f-specs");
      for (var i = 0; i < 3; i++) {
        var s = S[i], row = document.createElement("div");
        row.style.cssText = "position:absolute;left:0;top:" + (i*116) + "px;width:1006px;height:100px";
        var sample = s.cls === "blank"
          ? '<span style="opacity:.13;color:var(--mint)">&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;</span>'
          : 'Add to basket';
        var famCss = s.cls === "brand"
          ? "font-family:Archivo,sans-serif;font-weight:800;font-stretch:125%;letter-spacing:-.03em"
          : "font-family:Georgia,serif;font-weight:400;letter-spacing:0";
        row.innerHTML =
          '<div style="position:absolute;left:0;top:8px;width:150px;font-family:JBMono,monospace;font-size:16px;' +
            'letter-spacing:.10em;color:var(--emerald-lit);opacity:.72">' + s.t + '</div>' +
          '<div style="position:absolute;left:172px;top:0;width:104px;height:32px;border-radius:5px;' +
            'background:' + (s.cls === "brand" ? "var(--mint)" : "rgba(176,228,204,.16)") + ';display:flex;' +
            'align-items:center;justify-content:center;font-family:JBMono,monospace;font-size:14px;font-weight:700;' +
            'letter-spacing:.12em;color:' + (s.cls === "brand" ? "var(--ink)" : "var(--mint)") + '">' + s.l + '</div>' +
          '<div style="position:absolute;left:172px;top:40px;font-size:44px;color:var(--mint);' + famCss + '">' + sample + '</div>' +
          '<div style="position:absolute;left:600px;top:52px;font-family:JBMono,monospace;font-size:16px;' +
            'color:var(--mint);opacity:.5">' + s.d + '</div>';
        wrap.appendChild(row);
        tl.fromTo(row, { autoAlpha: 0, x: -22 }, { autoAlpha: 1, x: 0, duration: 0.52, ease: "power3.out" }, 1.30 + i*1.10);
      }
      // the markup that causes it, typed rather than simply present.
      tl.fromTo("#f-code",    { autoAlpha: 0, scale: 0.97 }, { autoAlpha: 1, scale: 1, duration: 0.52, ease: "power3.out" }, 0.14);
      tl.fromTo("#f-codebar", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.34 }, 0.24);
      var L = [
        '<span style="color:#5E8578">&lt;link</span> rel=<span style="color:var(--mint)">"stylesheet"</span>',
        '      href=<span style="color:var(--mint)">"app.css"</span><span style="color:#5E8578">&gt;</span>',
        '<span style="opacity:.42">  &#8627; blocks first paint</span>',
        '<span style="color:#5E8578">&lt;link</span> rel=<span class="hot">"preload"</span> as=<span style="color:var(--mint)">"font"</span>',
        '      href=<span style="color:var(--mint)">"brand.woff2"</span> crossorigin<span style="color:#5E8578">&gt;</span>'
      ];
      var lines = document.querySelector("#f-lines");
      for (var k = 0; k < L.length; k++) {
        var ln = document.createElement("div");
        ln.style.cssText = "font-family:JBMono,monospace;font-size:19px;line-height:1.85;color:var(--emerald-lit);white-space:nowrap";
        ln.innerHTML = L[k]; lines.appendChild(ln);
        tl.fromTo(ln, { autoAlpha: 0, x: -14 }, { autoAlpha: 1, x: 0, duration: 0.34, ease: "power3.out" }, 0.50 + k*0.16);
      }
      tl.fromTo("#f-note", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.52, ease: "power3.out" }, 4.70);
      // the two timelines side by side: the whole argument of the beat, in one shape.
      tl.fromTo("#f-tl", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.44, ease: "power3.out" }, 6.10);
      tl.fromTo("#f-tlbad", { scaleX: 0 }, { scaleX: 1, duration: 1.30, ease: "none" }, 6.40);
      tl.fromTo("#f-tlbadl", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.30 }, 7.70);
      tl.fromTo("#f-tlok", { scaleX: 0 }, { scaleX: 1, duration: 0.26, ease: "none" }, 8.10);
      tl.fromTo("#f-tlokl", { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: 0.32, ease: "power3.out" }, 8.36);
      // the brand specimen finally swaps in on the third row, live.
      tl.fromTo(wrap.children[2], { scale: 0.985 }, { scale: 1, duration: 0.34, ease: "back.out(1.6)" }, 8.36);
${exitAcross("#stage", 10.37)}`;
