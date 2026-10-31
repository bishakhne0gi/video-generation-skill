// 05 TABLE I — the paper that proposed the abstraction also published the measurement
// that breaks it. Every figure is transcribed from Table I, "Performance Results for
// Some Examples of Remote Calls", ACM TOCS 2(1), page 57. Times are microseconds,
// Dorado workstations, a 2.94 Mbit Ethernet at five to ten percent of capacity.
import { page, header, headerIn, cutting, slapIn, enterAcross, penSvg, penDraw,
         arrowD, boxD } from "../lib/frame.mjs";

const ROWS = [
  ["no args/results", "1059", "1097", "131", "9"],
  ["1 arg/result",    "1070", "1105", "142", "10"],
  ["2 args/results",  "1077", "1127", "152", "11"],
  ["4 args/results",  "1115", "1171", "174", "12"],
  ["10 args/results", "1222", "1278", "239", "17"],
];
const COLS = [318, 128, 128, 190, 140];
const HEADS = ["Procedure", "Minimum", "Median", "Transmission", "Local-only"];

// the bars are drawn at ONE PIXEL PER MICROSECOND. That is the whole argument, and it
// only works because 1097 happens to fit inside a 1920-wide frame.
const BAR_X = 452, LOCAL_W = 9, REMOTE_W = 1097;

const cell = (t, i, head) =>
  `<div style="display:table-cell;width:${COLS[i]}px;padding:7px 0;font-size:${head ? 19 : 25}px;` +
  `${head ? "letter-spacing:.10em;text-transform:uppercase;font-family:'Archivo',sans-serif;font-weight:700;color:var(--ink2);" : "font-family:'Courier',monospace;"}` +
  `${i > 0 ? "text-align:right;padding-right:26px;" : ""}">${t}</div>`;

export function build({ len }) {
  const body = `
    ${page("news")}
    <div id="stage" class="stage"><div class="inner">
      ${header("1984 &middot; TABLE&nbsp;I", "THEY PUBLISHED<br>THE NUMBER",
        "The same procedure, measured twice: once inside one process, once across a lightly-loaded Ethernet.", false, 86, 1000)}

      ${cutting("f5-tab", {
        x: 150, y: 474, w: 972, h: 386, seed: 31, kind: "cut", rot: -0.6,
        body: `
          <div class="slug" style="position:absolute;left:40px;top:26px;font-size:13px;letter-spacing:.16em">TABLE&nbsp;I &mdash; PERFORMANCE RESULTS FOR SOME EXAMPLES OF REMOTE CALLS &middot; P.&nbsp;57</div>
          <div style="position:absolute;left:40px;top:56px;display:table;width:904px">
            <div style="display:table-row">${HEADS.map((h, i) => cell(h, i, true)).join("")}</div>
          </div>
          <div class="rule" style="left:40px;top:100px;width:904px;height:2px"></div>
          ${ROWS.map((r, n) => `<div id="f5-r${n}" style="position:absolute;left:40px;top:${112 + n * 46}px;display:table;width:904px">
            <div style="display:table-row">${r.map((t, i) => cell(t, i, false)).join("")}</div></div>`).join("")}
          <div class="hair" style="left:40px;top:344px;width:904px"></div>
          <div class="body faint" style="position:absolute;left:40px;top:352px;font-size:17px;font-style:italic">All times in microseconds. Dorado workstations, 2.94&nbsp;Mbit Ethernet.</div>`,
      })}

      <!-- ONE statement, not three. The table carries the figures and the bars carry
           the feel, so this column does the arithmetic and stops. Explicit line-height
           keeps the declared box within a few px of the INK box, which is what an
           overlap gate actually measures — a tight line-height on a 132px face puts
           45px of ink outside the element on each side. -->
      <div id="f5-box" style="position:absolute;left:1176px;top:474px;width:604px;height:386px">
        <div id="f5-l1" class="mono" style="position:absolute;left:0;top:0;font-size:25px;line-height:1.3">1097 &micro;s &divide; 9 &micro;s</div>
        <div id="f5-n1" class="fig" style="position:absolute;left:0;top:52px;font-size:168px;line-height:1.5;color:var(--stopt)">121.9&times;</div>
        <div id="f5-l2" class="head2" style="position:absolute;left:0;top:322px;width:604px;font-size:34px">SLOWER, ON<br>THEIR OWN NUMBERS</div>
      </div>

      <!-- ONE PIXEL PER MICROSECOND. The remote bar draws the length of the page. -->
      <div id="f5-sc" class="slug" style="position:absolute;left:150px;top:892px;font-size:16px">DRAWN TO SCALE &mdash; ONE PIXEL PER MICROSECOND</div>
      <div id="f5-la" class="slug" style="position:absolute;left:150px;top:930px;font-size:20px;color:var(--ink)">LOCAL</div>
      <div id="f5-ba" style="position:absolute;left:${BAR_X}px;top:924px;width:${LOCAL_W}px;height:26px;background:var(--ink);transform-origin:0% 50%"></div>
      <div id="f5-lb" class="slug" style="position:absolute;left:150px;top:978px;font-size:20px;color:var(--ink)">REMOTE</div>
      <div id="f5-bb" style="position:absolute;left:${BAR_X}px;top:972px;width:${REMOTE_W}px;height:26px;background:var(--stop);transform-origin:0% 50%"></div>
      ${penSvg("f5-arr", arrowD(524, 936, BAR_X + 14, 938, 12), 4)}
      <div id="f5-nine" class="mono" style="position:absolute;left:532px;top:922px;font-size:23px;font-weight:700">9 px</div>
      <div id="f5-end" class="mono" style="position:absolute;left:${BAR_X + REMOTE_W + 18}px;top:970px;font-size:23px;font-weight:700;color:var(--stopt)">1097 px</div>
      <!-- the mark that ties the bars back to the source: a box round row one -->
      ${penSvg("f5-box0", boxD(186, 582, 906, 48, 9), 4)}
    </div></div>`;

  let script = `
${enterAcross("#stage")}
${headerIn(0.10)}
      ${slapIn("f5-tab", 1.00, 31, -0.6).trim()}
      gsap.set("#f5-tab", { autoAlpha: 0 });
      tl.set("#f5-tab", { autoAlpha: 1 }, 1.00);`;

  // the table fills a row at a time — the beat keeps delivering instead of dumping
  ROWS.forEach((r, n) => {
    script += `\n      gsap.set("#f5-r${n}", { autoAlpha: 0, x: -14 });` +
      `\n      tl.to("#f5-r${n}", { autoAlpha: 1, x: 0, duration: 0.26, ease: "power2.out" }, ${(1.34 + n * 0.30).toFixed(2)});`;
  });

  script += `
      // row one is the one that matters, and the pen says so
      gsap.set("#f5-l1", { autoAlpha: 0 });
      tl.to("#f5-l1", { autoAlpha: 1, duration: 0.28 }, 3.60);
      gsap.set("#f5-n1", { autoAlpha: 0, scale: 0.74 });
      tl.to("#f5-n1", { autoAlpha: 1, scale: 1, duration: 0.18, ease: "steps(3)" }, 4.10);
      gsap.set("#f5-l2", { autoAlpha: 0, y: 16 });
      tl.to("#f5-l2", { autoAlpha: 1, y: 0, duration: 0.40, ease: "power3.out" }, 4.60);

      // THE RUNNING SYSTEM — the remote bar draws across the page at 1px per microsecond.
      // Nothing else on the frame is doing anything for these two and a half seconds,
      // and it does not need to: the length IS the fact.
      gsap.set("#f5-sc", { autoAlpha: 0 });
      tl.to("#f5-sc", { autoAlpha: 1, duration: 0.28 }, 6.20);
      gsap.set("#f5-la", { autoAlpha: 0 }); gsap.set("#f5-lb", { autoAlpha: 0 });
      tl.to("#f5-la", { autoAlpha: 1, duration: 0.24 }, 6.38);
      gsap.set("#f5-ba", { scaleX: 0 });
      tl.to("#f5-ba", { scaleX: 1, duration: 0.10, ease: "none" }, 6.50);
      ${penDraw("f5-arr", 6.66, 0.44).trim()}
      gsap.set("#f5-nine", { autoAlpha: 0 });
      tl.to("#f5-nine", { autoAlpha: 1, duration: 0.22 }, 7.06);
      tl.to("#f5-lb", { autoAlpha: 1, duration: 0.24 }, 7.50);
      gsap.set("#f5-bb", { scaleX: 0 });
      tl.to("#f5-bb", { scaleX: 1, duration: 2.60, ease: "power1.inOut" }, 7.62);
      gsap.set("#f5-end", { autoAlpha: 0 });
      tl.to("#f5-end", { autoAlpha: 1, duration: 0.22 }, 10.30);
      // and the pen goes back to the one row both numbers came out of
      ${penDraw("f5-box0", 11.60, 0.74).trim()}`;

  return { body, script };
}
