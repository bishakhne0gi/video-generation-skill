// 15 FOUR SHAPES — the four service-method kinds, each labelled with the actual rpc
// from route_guide.proto, which this film planted on screen in frame 01. The glosses
// are verbatim from grpc.io "Core concepts". Four rails running at once is the frame's
// running system: it is large-area motion, and it is also the content.
import { page, header, headerIn, enterAcross } from "../lib/frame.mjs";

const X0 = 690, X1 = 1442, TRAVEL = X1 - X0;
const RAILS = [
  ["01", "UNARY", "GetFeature(Point) &rarr; Feature", "1 &rarr; 1",
   "a single request &hellip; and a single response back"],
  ["02", "SERVER STREAMING", "ListFeatures(Rectangle) &rarr; stream Feature", "1 &rarr; N",
   "a stream to read a sequence of messages back"],
  ["03", "CLIENT STREAMING", "RecordRoute(stream Point) &rarr; RouteSummary", "N &rarr; 1",
   "writes a sequence of messages and sends them"],
  ["04", "BIDIRECTIONAL", "RouteChat(stream RouteNote) &rarr; stream RouteNote", "N &harr; N",
   "the two streams operate independently"],
];
const RY = [500, 632, 764, 896];

// [rail, index, direction(+1 out / -1 back), start, duration]
const PKTS = [];
const CYC = [3.30, 6.00, 8.70];                       // three passes across the frame
for (const c of CYC) {
  PKTS.push([0, 0, +1, c, 0.72], [0, 1, -1, c + 0.86, 0.72]);
  PKTS.push([1, 0, +1, c, 0.62]);
  for (let k = 0; k < 4; k++) PKTS.push([1, k + 1, -1, c + 0.74 + k * 0.20, 0.66]);
  for (let k = 0; k < 4; k++) PKTS.push([2, k, +1, c + k * 0.18, 0.62]);
  PKTS.push([2, 4, -1, c + 1.02, 0.66]);
  for (let k = 0; k < 3; k++) PKTS.push([3, k, +1, c + k * 0.26, 0.70]);
  for (let k = 0; k < 3; k++) PKTS.push([3, k + 3, -1, c + 0.12 + k * 0.26, 0.70]);
}

export function build({ len }) {
  const body = `
    ${page("news")}
    <div id="stage" class="stage"><div class="inner">
      ${header("2015 &middot; FOUR SHAPES", "A FUNCTION<br>RETURNS ONCE",
        "A stream does not have to. All four shapes are declared in the .proto from the top of this film.", false, 84, 1320)}

      <div id="f15-hc" class="slug" style="position:absolute;left:${X0 - 8}px;top:436px;font-size:14px">CLIENT</div>
      <div id="f15-hs" class="slug" style="position:absolute;left:${X1 - 50}px;top:436px;font-size:14px">SERVER</div>

      ${RAILS.map(([n, name, rpc, shape, gloss], r) => `
      <div id="f15-r${r}">
        <div class="head2 faint" style="position:absolute;left:150px;top:${RY[r] - 28}px;font-size:38px">${n}</div>
        <div class="head2" style="position:absolute;left:212px;top:${RY[r] - 30}px;font-size:29px">${name}</div>
        <div class="mono faint" style="position:absolute;left:212px;top:${RY[r] + 6}px;font-size:16px">${rpc}</div>
        <div style="position:absolute;left:${X0}px;top:${RY[r]}px;width:${TRAVEL}px;height:2px;background:var(--ink2)"></div>
        <div style="position:absolute;left:${X0 - 9}px;top:${RY[r] - 9}px;width:18px;height:18px;background:var(--ink)"></div>
        <div style="position:absolute;left:${X1 - 9}px;top:${RY[r] - 9}px;width:18px;height:18px;background:var(--ink)"></div>
        <div class="monob" style="position:absolute;left:${X1 + 46}px;top:${RY[r] - 22}px;font-size:34px;letter-spacing:.04em;color:var(--stopt)">${shape}</div>
        <div class="bodyi faint" style="position:absolute;left:212px;top:${RY[r] + 34}px;width:440px;font-size:17px">&ldquo;${gloss}&rdquo;</div>
      </div>`).join("")}

      ${PKTS.map(([r, i, d, , ], k) => `<div id="f15-p${k}" style="position:absolute;left:${d > 0 ? X0 - 10 : X1 - 10}px;top:${RY[r] - 9}px;width:20px;height:20px;background:var(${d > 0 ? "--ink" : "--stop"})"></div>`).join("")}

      <div id="f15-att" class="slug" style="position:absolute;left:150px;top:996px;font-size:15px">GRPC.IO &middot; CORE CONCEPTS &middot; GLOSSES VERBATIM</div>
    </div></div>`;

  let script = `
${enterAcross("#stage")}
${headerIn(0.10)}
      gsap.set("#f15-hc", { autoAlpha: 0 }); gsap.set("#f15-hs", { autoAlpha: 0 });
      tl.to("#f15-hc", { autoAlpha: 1, duration: 0.24 }, 0.70);
      tl.to("#f15-hs", { autoAlpha: 1, duration: 0.24 }, 0.76);`;

  RAILS.forEach((_, r) => {
    const t = 0.86 + r * 0.42;
    script += `\n      gsap.set("#f15-r${r}", { autoAlpha: 0, x: -18 });` +
      `\n      tl.to("#f15-r${r}", { autoAlpha: 1, x: 0, duration: 0.34, ease: "power2.out" }, ${t.toFixed(2)});`;
  });

  script += `\n      // THE RUNNING SYSTEM — every rail carries its own real traffic pattern, three
      // times over. Unary goes out and comes back; server-streaming answers once with
      // four; client-streaming sends four and gets one; bidirectional does not take turns.`;
  PKTS.forEach(([, , d, t, dur], k) => {
    script += `\n      gsap.set("#f15-p${k}", { autoAlpha: 0 });` +
      `\n      tl.set("#f15-p${k}", { autoAlpha: 1, x: 0 }, ${t.toFixed(2)});` +
      `\n      tl.fromTo("#f15-p${k}", { x: 0 }, { x: ${d > 0 ? TRAVEL : -TRAVEL}, duration: ${dur.toFixed(2)}, ease: "none" }, ${t.toFixed(2)});` +
      `\n      tl.set("#f15-p${k}", { autoAlpha: 0 }, ${(t + dur).toFixed(2)});`;
  });

  script += `
      gsap.set("#f15-att", { autoAlpha: 0 });
      tl.to("#f15-att", { autoAlpha: 1, duration: 0.28 }, 3.00);`;

  return { body, script };
}
