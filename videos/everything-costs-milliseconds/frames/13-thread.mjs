import { field, enterAcross, exitAcross, header, headerIn , readout, readoutIn} from "../lib/frame.mjs";
// STATION 11 — the main thread as a single-lane belt. The whole argument is that input
// is not a priority queue: it waits behind whatever is already running.
const LX = 158, LW = 1604, S = 3.4;   // px per ms
export const body = `
    ${field("inspection")}
    <div id="stage" class="stage"><div class="inner">
      ${header("11", "THE MAIN THREAD", "One lane.<br>No overtaking.", "Your handler, your framework and the browser share a single thread. A task over fifty milliseconds is a task the user's tap is queued behind.")}

      <div id="t-lane1" style="position:absolute;left:${LX}px;top:566px;width:${LW}px;height:66px;
        background:rgba(11,16,15,.86);border:1px solid rgba(176,228,204,.14);border-radius:8px"></div>
      <div id="t-l1lbl" class="mono" style="position:absolute;left:${LX}px;top:534px;font-size:16px;letter-spacing:.15em;opacity:.6">ONE LONG TASK</div>
      <div id="t-tasks1" style="position:absolute;left:${LX+4}px;top:570px;width:${LW-8}px;height:58px"></div>
      <div id="t-in1" style="position:absolute;left:${LX + 120*S}px;top:548px;width:3px;height:102px;background:var(--mint)"></div>
      <div id="t-in1lbl" class="mono" style="position:absolute;left:${LX + 120*S + 10}px;top:648px;font-size:16px;color:var(--mint)">tap</div>
      <div id="t-wait" style="position:absolute;left:${LX + 120*S}px;top:662px;width:${260*S}px;height:22px;transform-origin:0% 50%;
        background:repeating-linear-gradient(112deg, rgba(232,161,60,.42) 0 8px, rgba(232,161,60,.12) 8px 18px);
        border-left:2px solid var(--brass);border-right:2px solid var(--brass)"></div>
      <div id="t-waitlbl" class="mono hot" style="position:absolute;left:${LX + 120*S + 12}px;top:692px;font-size:19px;font-weight:700">260ms queued behind it</div>

      <div id="t-lane2" style="position:absolute;left:${LX}px;top:790px;width:${LW}px;height:66px;
        background:rgba(11,16,15,.86);border:1px solid rgba(176,228,204,.14);border-radius:8px"></div>
      <div id="t-l2lbl" class="mono" style="position:absolute;left:${LX}px;top:758px;font-size:16px;letter-spacing:.15em;color:var(--emerald-lit);opacity:.8">THE SAME WORK, YIELDED</div>
      <div id="t-tasks2" style="position:absolute;left:${LX+4}px;top:794px;width:${LW-8}px;height:58px"></div>
      <div id="t-in2" style="position:absolute;left:${LX + 120*S}px;top:772px;width:3px;height:102px;background:var(--mint)"></div>
      <div id="t-ok" class="mono" style="position:absolute;left:${LX + 120*S + 12}px;top:886px;font-size:19px;font-weight:700;color:var(--mint)">handled in 12ms</div>

      <div id="t-code" class="mono" style="position:absolute;left:${LX}px;top:936px;font-size:19px;color:var(--emerald-lit)">
        <span class="hot">await scheduler.yield()</span> &mdash; hand the lane back between chunks</div>

      ${readout("t-lat", ["260ms","180ms","96ms","12ms"],
        "position:absolute;left:1420px;top:756px;width:280px;text-align:right;height:56px;font-family:'JBMono',monospace;font-size:44px;font-weight:700;color:var(--mint)")}
      <div id="t-latlbl" class="mono" style="position:absolute;left:1420px;top:812px;width:280px;text-align:right;font-size:16px;letter-spacing:.14em;opacity:.55">INPUT LATENCY</div>
    </div></div>`;

export const script = `${enterAcross()}${headerIn()}
      tl.fromTo("#t-lane1", { autoAlpha: 0, scaleX: 0.96 }, { autoAlpha: 1, scaleX: 1, duration: 0.50, ease: "power3.out" }, 0.10);
      tl.fromTo("#t-l1lbl", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.34 }, 0.22);
      // the long task fills the lane in real time — you watch the block happen.
      var t1 = document.querySelector("#t-tasks1"), blk = document.createElement("div");
      blk.style.cssText = "position:absolute;left:0;top:0;width:" + (380*${S}) + "px;height:58px;border-radius:5px;" +
        "transform-origin:0% 50%;background:rgba(232,161,60,.8)";
      blk.innerHTML = '<span style="position:absolute;left:16px;top:18px;font-family:JBMono,monospace;font-size:19px;' +
        'font-weight:700;color:#1A1206">renderList()  380ms</span>';
      t1.appendChild(blk);
      tl.fromTo(blk, { scaleX: 0 }, { scaleX: 1, duration: 1.30, ease: "none" }, 0.60);
      // the tap lands mid-task and can do nothing at all.
      tl.fromTo("#t-in1",    { autoAlpha: 0, scaleY: 0 }, { autoAlpha: 1, scaleY: 1, duration: 0.24, ease: "back.out(2)" }, 1.02);
      tl.fromTo("#t-in1lbl", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.24 }, 1.10);
      gsap.set("#t-wait", { scaleX: 0 });
      tl.to("#t-wait", { scaleX: 1, duration: 0.90, ease: "none" }, 1.10);
      tl.fromTo("#t-waitlbl", { autoAlpha: 0, x: -12 }, { autoAlpha: 1, x: 0, duration: 0.36, ease: "power3.out" }, 2.02);
      // the same work, chunked. Five short tasks, and a gap the tap can land in.
      tl.fromTo("#t-lane2", { autoAlpha: 0, scaleX: 0.96 }, { autoAlpha: 1, scaleX: 1, duration: 0.50, ease: "power3.out" }, 3.00);
      tl.fromTo("#t-l2lbl", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.34 }, 3.10);
      var t2 = document.querySelector("#t-tasks2"), x = 0;
      for (var i = 0; i < 5; i++) {
        var c = document.createElement("div"), w = 76*${S};
        c.style.cssText = "position:absolute;left:" + x + "px;top:0;width:" + w + "px;height:58px;border-radius:5px;" +
          "transform-origin:0% 50%;background:rgba(64,138,113,.86)";
        t2.appendChild(c); x += w + 18;
        tl.fromTo(c, { scaleX: 0 }, { scaleX: 1, duration: 0.26, ease: "none" }, 3.40 + i*0.30);
      }
      tl.fromTo("#t-in2", { autoAlpha: 0, scaleY: 0 }, { autoAlpha: 1, scaleY: 1, duration: 0.24, ease: "back.out(2)" }, 4.10);
      tl.fromTo("#t-ok",  { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.36, ease: "power3.out" }, 4.90);
      tl.fromTo("#t-code",{ autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.42, ease: "power3.out" }, 5.30);
      // the yielded lane keeps taking taps — three more land instantly, so the beat's
      // last four seconds are still demonstrating the fix rather than displaying it.
      tl.fromTo("#t-latlbl", { autoAlpha: 0 }, { autoAlpha: 0.55, duration: 0.36 }, 6.10);${readoutIn("t-lat", 4, 6.10, 0.62)}
      for (var v2 = 0; v2 < 3; v2++) {
        var tt = 7.00 + v2*0.94;
        tl.to("#t-in2", { x: v2*116 + 60, duration: 0.30, ease: "power3.out" }, tt);
        tl.fromTo("#t-in2", { autoAlpha: 1 }, { autoAlpha: 0.35, duration: 0.16, yoyo: true, repeat: 1 }, tt + 0.30);
        tl.fromTo(t2.children[v2 + 1], { scaleY: 1 }, { scaleY: 1.16, duration: 0.14, yoyo: true, repeat: 1, ease: "power2.out" }, tt + 0.32);
      }
${exitAcross("#stage", 10.37)}`;
