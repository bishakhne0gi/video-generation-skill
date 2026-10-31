// 05 TEMPLATE — the empty div, sourced.
//
// Lines 27-41 of packages/cra-template/template/public/index.html in
// github.com/facebook/create-react-app (MIT), verbatim including the comment. The
// comment is the frame's whole payoff: the tool's own authors wrote down, in the file,
// that opening it gives you an empty page. That is the client-rendering contract stated
// by the framework rather than by me, which is why it is set in mono and boxed.
//
// The match rows below are a real string comparison: excalidraw.com's live production
// body carries that noscript line and that div, in that order, unchanged.
import { page, header, headerIn, well, wellIn, typeOn, stamp, stampIn, penSvg, penDraw,
  boxD, tickD, ENTER } from "../lib/frame.mjs";

export function build({ seamIn }) {
  const X = 112, W = 1696, WY = 386, LN = 37;   // 23px mono at line-height 1.62
  const NOSCRIPT = `&lt;noscript&gt;You need to enable JavaScript to run this app.&lt;/noscript&gt;`;

  const TEXT = [
    `  <span class="tag">&lt;body&gt;</span>`,
    `    <span class="tag">&lt;noscript&gt;</span>You need to enable JavaScript to run this app.<span class="tag">&lt;/noscript&gt;</span>`,
    `    <span class="tag">&lt;div</span> <span class="att">id</span>=<span class="dim">"root"</span><span class="tag">&gt;&lt;/div&gt;</span>`,
    `    <span class="cmt">&lt;!--</span>`,
    `<span class="cmt">      This HTML file is a template.</span>`,
  ].join("\n");

  const rows = [
    ["cra-template · line 30", NOSCRIPT],
    ["excalidraw.com · today", NOSCRIPT],
  ];

  const body = `${page("canvas")}
    <div id="stage" class="stage"><div class="inner">
      ${header("01 · WHAT CAME BACK", "Not sloppiness.<br>A template.", "", false, 64)}
      <div id="t-note" class="mono" style="position:absolute;left:114px;top:340px;font-size:20px;color:var(--charcoal)">github.com/facebook/create-react-app · packages/cra-template/template/public/index.html · lines 27–41 · MIT</div>

      ${well("w5", { x: X, y: WY, w: W, h: 336, pad: 30, fs: 23, lh: 1.62, text: TEXT,
        // the two payoff lines are promoted to their own positioned elements: the pen
        // box below needs exact geometry, not arithmetic against unmeasured metrics.
        extra: `<div id="w5-p" class="wellbody cmt" style="top:${30 + 5 * LN}px;font-size:23px">      If you open it directly in the browser, you will see an empty page.</div>
        <div id="w5-e" class="wellbody cmt" style="top:${30 + 6 * LN}px;font-size:23px">    --&gt;</div>` })}

      <div id="m-slug" class="slug" style="position:absolute;left:${X}px;top:772px">Shipped unchanged</div>
      ${rows.map(([k, v], i) => `
      <div class="m-row" style="position:absolute;left:${X}px;top:${820 + i * 62}px;width:1600px">
        <span class="body" style="font-size:22px;color:var(--mute)">${k}</span>
        <span class="mono" style="position:absolute;left:344px;font-size:21px;color:var(--ink)">${v}</span>
      </div>`).join("")}
      <div id="m-hr" class="hair" style="left:${X}px;top:${820 + 48}px;width:1600px;transform-origin:0% 50%"></div>

      ${penSvg("p-cmt", boxD(X + 122, WY + 30 + 5 * LN + 4, 984, 38, 3), 3.5, "dk")}
      ${penSvg("p-tick", tickD(1738, 858, 22), 5, "ink")}
      ${stamp("st5", "THE SHELL IS THE TEMPLATE", { x: 1214, y: 196 })}
    </div></div>`;

  const script = `${ENTER[seamIn]("#stage")}
${headerIn(0.10, false)}
      gsap.set(["#t-note", "#m-slug", ".m-row", "#w5-p", "#w5-e"], { autoAlpha: 0 });
      gsap.set("#m-hr", { scaleX: 0 });
      tl.fromTo("#t-note", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.40, ease: "power3.out" }, 0.24);
${wellIn("w5", 0.52)}
${typeOn("w5-b", 0.86, 2.30, 66, 150)}
      tl.set("#w5-p", { autoAlpha: 1 }, 3.30);
${typeOn("w5-p", 3.30, 1.10, 66, 72)}
      tl.fromTo("#w5-e", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.14 }, 4.52);

      // the match: the same string, from the template and from production, one after
      // the other, then the tick. A comparison the viewer performs rather than is told.
      tl.fromTo("#m-slug", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.34, ease: "power3.out" }, 5.10);
      tl.fromTo(".m-row", { autoAlpha: 0, x: -18 }, { autoAlpha: 1, x: 0, duration: 0.42, ease: "power3.out", stagger: 0.92 }, 5.44);
      tl.to("#m-hr", { scaleX: 1, duration: 0.44, ease: "power3.out" }, 6.10);
${penDraw("p-tick", 7.42, 0.34)}
${stampIn("st5", 8.06)}

      // the payoff LAST, because it is the last thing the narration says.
${penDraw("p-cmt", 9.06, 0.58)}
      tl.to("#w5-p", { color: "#fcfcfc", duration: 0.44, ease: "power2.out" }, 9.74);`;

  return { body, script };
}
