// THE CONTINUITY OBJECT — Call No.4171, on a press docket held by a paperclip.
// One RPC, followed the whole way. Only the STAMP changes; the docket never moves,
// because the point is that it is the same call. Every state is something the film
// has just said. Mounted on track 4 above every frame, so no cut can interrupt it —
// which makes `transparent: true` in the wrap mandatory: #root carries an opaque
// newsprint background and an overlay that keeps it paints over the entire film.
import { cutting, stamp, stampIn, slapIn } from "../lib/frame.mjs";
import { at as A } from "../schedule.mjs";

const X = 1548, Y = 62, W = 318, H = 150;

// [global second, stamp text]. Each lands ON the sentence that earns it.
const STATES = [
  [0,                 "PENDING"    ],
  [A("tableone") + 4.2,  `<i style='font-style:normal;text-transform:none'>9 &micro;s</i> LOCAL`  ],
  [A("tableone") + 8.4,  `<i style='font-style:normal;text-transform:none'>1097 &micro;s</i>`     ],
  [A("four")     + 6.6,  "? UNKNOWN"  ],
  [A("wire")     + 7.4,  "FRAMED"     ],
  [A("verdicts") + 8.2,  "200 / 5"    ],
  [A("end")      + 4.4,  "OK &nbsp;0" ],
];

export function build({ total }) {
  const body = `
    <div id="stage" class="stage"><div class="inner">
      ${cutting("tab", {
        x: X, y: Y, w: W, h: H, seed: 41, kind: "cut", rot: 2.6, pad: 0,
        body: `
          <div class="slug" style="position:absolute;left:22px;top:18px;font-size:15px;letter-spacing:.22em">PRESS DOCKET</div>
          <div class="hair" style="left:22px;top:44px;width:${W - 44}px"></div>
          <div class="mono" style="position:absolute;left:22px;top:54px;font-size:31px;font-weight:700">CALL &#8470;4171</div>`,
      })}
      <!-- the paperclip: two strokes of ink wire over the top edge of the docket -->
      <svg id="tab-clip" class="pen penk" viewBox="0 0 1920 1080" style="z-index:7">
        <path d="M${X + 44},${Y + 34} L${X + 44},${Y - 16} Q${X + 44},${Y - 30} ${X + 58},${Y - 30}
                 Q${X + 72},${Y - 30} ${X + 72},${Y - 16} L${X + 72},${Y + 26}
                 Q${X + 72},${Y + 38} ${X + 59},${Y + 38} Q${X + 56},${Y + 38} ${X + 56},${Y + 26} L${X + 56},${Y - 10}"
              stroke-width="4" style="opacity:.72"/>
      </svg>
      ${STATES.map((s, i) =>
        stamp(`tabst${i}`, `<span style="font-size:22px">${s[1]}</span>`, {
          x: X + 26, y: Y + 96, w: W - 52, h: 44, seed: 60 + i * 3, size: 22, z: 8 })).join("")}
    </div></div>`;

  let script = `
      // the docket is put down once, after the masthead, and stays for the film
      ${slapIn("tab", A("ed1984") + 0.5, 41, 2.6).trim()}
      gsap.set("#tab", { autoAlpha: 0 });
      tl.set("#tab", { autoAlpha: 1 }, ${(A("ed1984") + 0.5).toFixed(2)});
      // the clip goes on AFTER the docket is down — it is holding it, not waiting for it
      gsap.set("#tab-clip", { autoAlpha: 0, y: -22 });
      tl.fromTo("#tab-clip", { autoAlpha: 0, y: -22 }, { autoAlpha: 1, y: 0,
        duration: 0.12, ease: "steps(2)" }, ${(A("ed1984") + 0.66).toFixed(2)});`;

  // Only ONE stamp is visible at a time. Stacked and toggled with zero-duration sets:
  // a tween on text content is a no-op here and tl.call is not reliably seekable.
  STATES.forEach((s, i) => {
    script += `\n      gsap.set("#tabst${i}", { autoAlpha: 0 });`;
  });
  STATES.forEach((s, i) => {
    const t = Math.max(s[0], A("ed1984") + 0.62);
    script += stampIn(`tabst${i}`, t, 60 + i * 3);
    if (i > 0) script += `\n      tl.set("#tabst${i - 1}", { autoAlpha: 0 }, ${t.toFixed(2)});`;
  });

  return { body, script };
}
