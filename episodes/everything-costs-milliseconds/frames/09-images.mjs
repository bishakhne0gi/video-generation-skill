import { field, enterAcross, exitAcross, header, headerIn , readout, readoutIn} from "../lib/frame.mjs";
// STATION 07 — images, on the lightbox. The format ladder is a real weight comparison
// and the srcset row is the part everyone skips.
const LB = { x: 1058, y: 386, w: 762, h: 250 };
export const body = `
    ${field("interior")}
    <div id="stage" class="stage"><div class="inner">
      ${header("07", "IMAGES", "The heaviest<br>thing you ship.", "One hero image usually outweighs all of your JavaScript. Pick the format, pick the size, and tell the browser which one matters.")}

      <div id="g-box" class="panel" style="left:${LB.x-24}px;top:${LB.y-24}px;width:${LB.w+48}px;height:${LB.h+48}px;padding:0"></div>
      <div id="g-lit" style="position:absolute;left:${LB.x}px;top:${LB.y}px;width:${LB.w}px;height:${LB.h}px;border-radius:6px;
        background-image:url('assets/plates/negatives.jpg');background-size:cover;background-position:center;opacity:.30"></div>
      <div id="g-litwash" style="position:absolute;left:${LB.x}px;top:${LB.y}px;width:${LB.w}px;height:${LB.h}px;border-radius:6px;
        background:linear-gradient(180deg, rgba(9,20,19,.70), rgba(9,20,19,.90))"></div>
      <div id="g-ladder" style="position:absolute;left:${LB.x+28}px;top:${LB.y+26}px;width:${LB.w-56}px"></div>

      <div id="g-srcset" class="panel" style="left:1034px;top:684px;width:786px;height:262px;background:#080C0B"></div>
      <div id="g-sslines" style="position:absolute;left:1062px;top:712px;width:730px"></div>

      <div id="g-fold" style="position:absolute;left:118px;top:596px;width:790px">
        <div class="mono" style="font-size:18px;letter-spacing:.15em;opacity:.62;color:var(--emerald-lit)">THE FOLD DECIDES THE ATTRIBUTE</div>
        <div id="g-folddiag" style="position:relative;width:790px;height:348px;margin-top:18px"></div></div>
      <div id="g-tot" style="position:absolute;left:118px;top:966px;width:1000px">
        <span class="mono" style="font-size:17px;letter-spacing:.15em;opacity:.55">TOTAL IMAGE WEIGHT ON THE PAGE</span>
        ${readout("g-w", ["1.94 MB","1.41 MB","0.98 MB","0.64 MB"],
          "position:absolute;left:520px;top:-10px;width:340px;height:52px;font-family:'JBMono',monospace;font-size:40px;font-weight:700;color:var(--mint)")}</div>
    </div></div>`;

export const script = `${enterAcross()}${headerIn()}
      tl.fromTo("#g-box", { autoAlpha: 0, scale: 0.97 }, { autoAlpha: 1, scale: 1, duration: 0.54, ease: "power3.out" }, 0.10);
      tl.fromTo("#g-lit", { autoAlpha: 0 }, { autoAlpha: 0.30, duration: 0.62, ease: "power2.out" }, 0.22);
      // the format ladder: same picture, three encodings, real bytes.
      var F = [{ n: "hero.jpg", kb: 214, w: 1.00 }, { n: "hero.webp", kb: 128, w: 0.60 }, { n: "hero.avif", kb: 74, w: 0.35 }];
      var lad = document.querySelector("#g-ladder");
      for (var i = 0; i < 3; i++) {
        var f = F[i], best = i === 2, row = document.createElement("div");
        row.style.cssText = "position:absolute;left:0;top:" + (i*66) + "px;width:${LB.w-56}px;height:54px";
        row.innerHTML =
          '<span style="position:absolute;left:0;top:14px;font-family:JBMono,monospace;font-size:19px;color:' +
            (best ? "var(--mint)" : "var(--emerald-lit)") + ';opacity:' + (best ? "1" : ".78") + '">' + f.n + '</span>' +
          '<div class="bar" style="position:absolute;left:184px;top:12px;width:' + (f.w*380) + 'px;height:28px;border-radius:5px;' +
            'transform-origin:0% 50%;background:' + (best ? "var(--mint)" : "rgba(64,138,113,.72)") + '"></div>' +
          '<span style="position:absolute;left:' + (196 + f.w*380) + 'px;top:14px;font-family:JBMono,monospace;font-size:19px;' +
            'font-weight:700;color:' + (best ? "var(--mint)" : "var(--emerald-lit)") + '">' + f.kb + ' KB</span>';
        lad.appendChild(row);
        tl.fromTo(row, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.26 }, 0.90 + i*0.46);
        tl.fromTo(row.querySelector(".bar"), { scaleX: 0 }, { scaleX: 1, duration: 0.56, ease: "power3.out" }, 0.90 + i*0.46);
      }
      // above the fold vs below it — the diagram that decides which attribute you use.
      tl.fromTo("#g-fold", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.50, ease: "power3.out" }, 2.70);
      var fd = document.querySelector("#g-folddiag");
      var boxes = [
        { t: 0,   h: 118, lbl: "hero.avif", attr: 'fetchpriority="high"', hot: true },
        { t: 142, h: 88,  lbl: "gallery/1", attr: 'loading="lazy"', hot: false },
        { t: 246, h: 88,  lbl: "gallery/2", attr: 'loading="lazy"', hot: false }
      ];
      for (var b = 0; b < boxes.length; b++) {
        var o = boxes[b], el = document.createElement("div");
        el.style.cssText = "position:absolute;left:0;top:" + o.t + "px;width:520px;height:" + o.h +
          "px;border-radius:8px;background:rgba(11,16,15,.9);border:1px solid " +
          (o.hot ? "rgba(232,161,60,.7)" : "rgba(176,228,204,.16)");
        el.innerHTML = '<span style="position:absolute;left:16px;top:12px;font-family:JBMono,monospace;font-size:17px;color:' +
          (o.hot ? "var(--brass)" : "var(--emerald-lit)") + '">' + o.lbl + '</span>' +
          '<span style="position:absolute;left:16px;bottom:12px;font-family:JBMono,monospace;font-size:16px;color:' +
          (o.hot ? "var(--brass)" : "var(--mint)") + ';opacity:.8">' + o.attr + '</span>';
        fd.appendChild(el);
        tl.fromTo(el, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.40, ease: "power3.out" }, 3.10 + b*0.24);
      }
      var foldline = document.createElement("div");
      foldline.style.cssText = "position:absolute;left:0;top:126px;width:790px;height:0;border-top:2px dashed rgba(232,161,60,.62);transform-origin:0% 50%";
      foldline.innerHTML = '<span style="position:absolute;right:0;top:-26px;font-family:JBMono,monospace;font-size:15px;' +
        'letter-spacing:.16em;color:var(--brass)">THE FOLD</span>';
      fd.appendChild(foldline);
      tl.fromTo(foldline, { scaleX: 0 }, { scaleX: 1, duration: 0.60, ease: "power3.out" }, 3.60);
      // the markup, last: the attribute is the takeaway, not the diagram.
      tl.fromTo("#g-srcset", { autoAlpha: 0, scale: 0.97 }, { autoAlpha: 1, scale: 1, duration: 0.48, ease: "power3.out" }, 4.40);
      var SS = [
        '<span style="color:#5E8578">&lt;img</span> src=<span style="color:var(--mint)">"hero-800.avif"</span>',
        '  srcset=<span style="color:var(--mint)">"hero-800.avif 800w,</span>',
        '          <span style="color:var(--mint)">hero-1440.avif 1440w"</span>',
        '  sizes=<span style="color:var(--mint)">"(max-width:900px) 100vw, 1440px"</span>',
        '  width=<span style="color:var(--mint)">"1440"</span> height=<span style="color:var(--mint)">"810"</span>',
        '  <span class="hot">fetchpriority="high"</span><span style="color:#5E8578">&gt;</span>'
      ];
      var ssw = document.querySelector("#g-sslines");
      for (var k = 0; k < SS.length; k++) {
        var ln = document.createElement("div");
        ln.style.cssText = "font-family:JBMono,monospace;font-size:18px;line-height:1.78;color:var(--emerald-lit);white-space:nowrap";
        ln.innerHTML = SS[k]; ssw.appendChild(ln);
        tl.fromTo(ln, { autoAlpha: 0, x: -12 }, { autoAlpha: 1, x: 0, duration: 0.30, ease: "power3.out" }, 4.62 + k*0.15);
      }
      // the page weight falls as the three decisions are applied — the beat keeps
      // delivering a number right up to the cut.
      tl.fromTo("#g-tot", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.44, ease: "power3.out" }, 6.30);${readoutIn("g-w", 4, 6.60, 0.74)}
      for (var m = 0; m < 3; m++)
        tl.to(lad.children[m], { autoAlpha: m === 2 ? 1 : 0.34, duration: 0.44, ease: "power2.out" }, 6.60 + m*0.30);
${exitAcross("#stage", 10.37)}`;
