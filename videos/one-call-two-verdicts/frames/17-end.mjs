// 17 END — the red plate. Cream type only: --scrap on --stop is 5.00:1, --ink on
// --stop is 3.16:1 and would be large-text-only, so the whole card is set in cream.
// Every takeaway is something the film actually demonstrated, in the order it did.
import { page, enterLift, cutting, slapIn, penSvg, penDraw, underlineD, ellipseD, arrowD } from "../lib/frame.mjs";

const ROWS = [
  ["01", "SET A DEADLINE ON EVERY CALL",
   "If <span class='mono'>grpc-timeout</span> is omitted, the spec says a server should assume an infinite one."],
  ["02", "TREAT UNAVAILABLE AS UNKNOWN",
   "The link may have died. The server may have finished the work. Nineteen ninety-four says you cannot tell."],
  ["03", "REACH FOR CONNECT IN A BROWSER",
   "Wire-compatible with gRPC, speaks HTTP/1.1 through <span class='mono'>fetch</span>, and needs no proxy."],
];

export function build({ len }) {
  const body = `
    ${page("stop")}
    <div id="stage" class="stage"><div class="inner rev">
      <div id="f17-kick" class="slug" style="position:absolute;left:150px;top:120px;font-size:22px;letter-spacing:.34em;color:var(--scrap)">WHAT TO DO ON MONDAY</div>
      <div id="f17-kr" class="revrule" style="left:150px;top:160px;width:1620px;height:2px;transform-origin:0% 50%"></div>

      ${ROWS.map(([n, head, sub], i) => `
      <div id="f17-r${i}">
        <div class="head2" style="position:absolute;left:150px;top:${212 + i * 176}px;font-size:52px;color:#F6D6D7">${n}</div>
        <div class="head" style="position:absolute;left:266px;top:${206 + i * 176}px;font-size:60px;color:var(--scrap)">${head}</div>
        <div class="body" style="position:absolute;left:270px;top:${276 + i * 176}px;width:880px;font-size:25px;color:#F6D6D7">${sub}</div>
        <div class="revrule" style="left:150px;top:${340 + i * 176}px;width:1000px;height:1px;opacity:.42"></div>
      </div>`).join("")}

      <div id="f17-src" style="position:absolute;left:1214px;top:206px;width:556px">
        <div class="slug" style="font-size:14px;letter-spacing:.24em;color:var(--scrap)">EVERYTHING QUOTED IN THIS FILM</div>
        <div class="revrule" style="position:relative;margin-top:9px;width:556px;height:1px;opacity:.5"></div>
        <div class="body" style="margin-top:13px;font-size:19px;line-height:1.62;color:#F6D6D7">
          Birrell &amp; Nelson, <span class="bodyi">Implementing Remote Procedure Calls</span>, ACM&nbsp;TOCS&nbsp;2(1), Feb&nbsp;1984<br>
          Waldo, Wyant, Wollrath &amp; Kendall, <span class="bodyi">A Note on Distributed Computing</span>, SMLI&nbsp;TR-94-29, Nov&nbsp;1994<br>
          <span class="mono" style="font-size:17px">grpc/grpc</span> &mdash; PROTOCOL-HTTP2.md, PROTOCOL-WEB.md, statuscodes.md<br>
          <span class="mono" style="font-size:17px">grpc.io</span> &mdash; Core concepts, Design principles</div>
      </div>
      ${cutting("f17-card", {
        x: 1180, y: 756, w: 590, h: 200, seed: 131, kind: "cut", rot: 1.6,
        body: `
          <div class="slug" style="position:absolute;left:30px;top:24px;font-size:14px">NEXT</div>
          <div class="hair" style="left:30px;top:50px;width:530px"></div>
          <div class="head" style="position:absolute;left:30px;top:64px;font-size:44px">EPISODE 29</div>
          <div class="head" style="position:absolute;left:30px;top:114px;font-size:56px;color:var(--stopt);white-space:nowrap">SUBAGENTS</div>`,
      })}

      <div id="f17-sign" class="head" style="position:absolute;left:150px;top:790px;font-size:76px;color:var(--scrap);line-height:.92">SHIP IT<br>EPISODE 28</div>
      <div id="f17-t" class="qital" style="position:absolute;left:150px;top:952px;width:960px;font-size:31px;color:#F6D6D7">One call, two verdicts &mdash; and forty-two years of arguing about which one is true.</div>
      ${penSvg("f17-u", underlineD(146, 946, 570, 3), 4, "penw")}
      ${penSvg("f17-ring", ellipseD(1388, 900, 196, 46, 9), 5)}
      ${penSvg("f17-arr", arrowD(1120, 986, 1290, 934, -30), 5)}
    </div></div>`;

  let script = `
${enterLift("#stage")}
      // SEAM CARRIER — the kicker rides the cut at full opacity rather than fading up.
      tl.fromTo("#f17-kick", { y: 14 }, { y: 0, duration: 0.50, ease: "power3.out" }, 0);
      gsap.set("#f17-kr", { scaleX: 0 });
      tl.to("#f17-kr", { scaleX: 1, duration: 0.52, ease: "power3.out" }, 0.16);`;

  ROWS.forEach((_, i) => {
    const t = 0.90 + i * 1.36;
    script += `\n      gsap.set("#f17-r${i}", { autoAlpha: 0, y: 20 });` +
      `\n      tl.to("#f17-r${i}", { autoAlpha: 1, y: 0, duration: 0.46, ease: "power3.out" }, ${t.toFixed(2)});`;
  });

  script += `
      gsap.set("#f17-src", { autoAlpha: 0, y: 14 });
      tl.to("#f17-src", { autoAlpha: 1, y: 0, duration: 0.44, ease: "power3.out" }, 4.60);
      gsap.set("#f17-sign", { autoAlpha: 0, y: 22 });
      tl.to("#f17-sign", { autoAlpha: 1, y: 0, duration: 0.52, ease: "power3.out" }, 5.30);
      gsap.set("#f17-card", { autoAlpha: 0 });
      tl.set("#f17-card", { autoAlpha: 1 }, 6.40);
      ${slapIn("f17-card", 6.40, 131, 1.6).trim()}
      gsap.set("#f17-t", { autoAlpha: 0, y: 14 });
      tl.to("#f17-t", { autoAlpha: 1, y: 0, duration: 0.46, ease: "power3.out" }, 7.60);
      ${penDraw("f17-u", 8.60, 0.62).trim()}
      // the promise, circled on camera for the third episode running
      ${penDraw("f17-ring", 9.90, 0.84).trim()}
      ${penDraw("f17-arr", 11.20, 0.54).trim()}`;

  return { body, script };
}
