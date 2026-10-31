import { field, enterAcross, exitLift, header, headerIn, swing , readout, readoutIn} from "../lib/frame.mjs";
// STATION 04 — INP. A real keycap that depresses, and the gap before the frame that
// answers it. Three interactions are scored; the WORST one is your number.
const CX = 1572, CY = 664, R = 152;
const deg = (v) => -120 + (v / 600) * 240;   // 0-600ms across 240deg
export const body = `
    ${field("lamplit")}
    <div id="stage" class="stage"><div class="inner">
      ${header("04", "INTERACTION TO NEXT PAINT", "Every tap,<br>not the first.", "INP replaced First Input Delay. It measures the whole interaction &mdash; input, handler, and the paint that answers it &mdash; and reports your worst.")}

      <div id="i-key" style="position:absolute;left:186px;top:592px;width:150px;height:150px;border-radius:16px;
        background:linear-gradient(178deg,#3B7A64 0%, #23543F 62%, #16352B 100%);
        box-shadow:inset 2px 2px 6px rgba(176,228,204,.34), inset -3px -4px 8px rgba(0,0,0,.6), 0 12px 0 #12261F, 0 20px 34px rgba(0,0,0,.62)">
        <div class="mono" style="position:absolute;left:0;top:56px;width:150px;text-align:center;font-size:24px;font-weight:700;color:var(--mint);opacity:.9">TAP</div></div>

      <div id="i-track" style="position:absolute;left:376px;top:648px;width:800px;height:38px;
        background:rgba(11,16,15,.85);border:1px solid rgba(176,228,204,.14);border-radius:19px;overflow:hidden">
        <div id="i-fill" style="position:absolute;left:0;top:0;width:800px;height:38px;transform-origin:0% 50%;
          background:repeating-linear-gradient(112deg, rgba(232,161,60,.42) 0 11px, rgba(232,161,60,.14) 11px 24px)"></div></div>
      <div id="i-tlbl" class="mono hot" style="position:absolute;left:376px;top:608px;font-size:20px;font-weight:700;letter-spacing:.10em">340ms OF NOTHING HAPPENING</div>

      <div id="i-paint" style="position:absolute;left:1206px;top:600px;width:134px;height:134px;border-radius:12px;
        border:2px solid var(--mint);background:rgba(176,228,204,.12);display:flex;align-items:center;justify-content:center">
        <span class="mono" style="font-size:17px;color:var(--mint);letter-spacing:.10em">PAINT</span></div>

      <div id="i-runs" style="position:absolute;left:186px;top:806px;width:990px;height:96px"></div>

      <div class="bezel" style="left:${CX-R-22}px;top:${CY-R-22}px;width:${(R+22)*2}px;height:${(R+22)*2}px;border-radius:50%"></div>
      <div class="face"  style="left:${CX-R}px;top:${CY-R}px;width:${R*2}px;height:${R*2}px;border-radius:50%"></div>
      <div id="i-ticks" style="position:absolute;left:${CX-R}px;top:${CY-R}px;width:${R*2}px;height:${R*2}px"></div>
      <div id="i-needle" class="needle hot" style="left:${CX-3}px;top:${CY-146}px;width:6px;height:146px"></div>
      <div class="hub" style="left:${CX-15}px;top:${CY-15}px;width:30px;height:30px"></div>
      <div id="i-read" style="position:absolute;left:${CX-140}px;top:${CY+70}px;width:280px;text-align:center">
        <div class="mono hot" style="font-size:46px;font-weight:700;line-height:1.18">340ms</div>
        <div class="mono" style="font-size:16px;letter-spacing:.16em;opacity:.62;margin-top:8px">BUDGET 200ms</div></div>
      <div id="i-fix" style="position:absolute;left:186px;top:930px;width:1300px">
        <div class="mono" style="font-size:19px;color:var(--emerald-lit)">
          break the handler and <span style="color:var(--mint);font-weight:700">await scheduler.yield()</span> &mdash;
          the paint gets a turn before the work finishes</div>
        <div id="i-fixbar" style="position:absolute;left:0;top:44px;width:${92*1.4}px;height:20px;border-radius:5px;
          transform-origin:0% 50%;background:var(--mint)"></div>
        <div id="i-fixlbl" class="mono" style="position:absolute;left:${92*1.4+16}px;top:44px;font-size:19px;font-weight:700;color:var(--mint)">92ms &mdash; the same interaction</div></div>
    </div></div>`;

export const script = `${enterAcross()}${headerIn()}
      var ticks = document.querySelector("#i-ticks");
      for (var v = 0; v <= 600; v += 50) {
        var major = v % 200 === 0, t = document.createElement("div");
        t.style.cssText = "position:absolute;left:${R-1}px;top:12px;width:" + (major?3:2) + "px;height:" + (major?15:9) +
          "px;background:rgba(176,228,204," + (major?".72":".38") + ");transform-origin:50% ${R-12}px;transform:rotate(" +
          (-120 + (v/600)*240) + "deg)";
        ticks.appendChild(t);
      }
      tl.fromTo("#i-ticks", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.46 }, 0.22);
      tl.fromTo("#i-key",   { autoAlpha: 0, y: -18 }, { autoAlpha: 1, y: 0, duration: 0.46, ease: "power3.out" }, 0.30);
      tl.fromTo("#i-paint", { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 0.44, ease: "power3.out" }, 0.44);
      // the key physically depresses — the cause. Everything after it is the consequence.
      tl.to("#i-key", { y: 9, duration: 0.10, ease: "power3.in" }, 1.40);
      tl.to("#i-key", { y: 0, duration: 0.20, ease: "power2.out" }, 1.62);
      // the wait. It is drawn as time you can watch passing, not as a label.
      gsap.set("#i-fill", { scaleX: 0 });
      tl.fromTo("#i-tlbl", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.30 }, 1.52);
      tl.to("#i-fill", { scaleX: 1, duration: 2.30, ease: "none" }, 1.52);
${swing("#i-needle", deg(0), deg(340), 1.52, true)}
      // only NOW does the frame answer — the paint lands 0.2s after the bar completes.
      tl.fromTo("#i-paint", { backgroundColor: "rgba(176,228,204,0.12)" },
                            { backgroundColor: "rgba(176,228,204,0.62)", duration: 0.22, ease: "power3.out" }, 3.94);
      tl.fromTo("#i-read", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.42, ease: "power3.out" }, 4.10);
      // three scored interactions; the worst is the one reported. This is the payoff and
      // it keeps delivering across the tail rather than landing all at once.
      var runs = document.querySelector("#i-runs"), V = [96, 340, 148], L = ["open menu", "add to basket", "close"];
      for (var i = 0; i < 3; i++) {
        var row = document.createElement("div"), hot = V[i] > 200;
        row.style.cssText = "position:absolute;left:0;top:" + (i*32) + "px;width:990px;height:24px";
        row.innerHTML = '<span style="position:absolute;left:0;top:2px;font-family:JBMono,monospace;font-size:17px;color:' +
          (hot ? "var(--brass)" : "var(--emerald-lit)") + '">' + L[i] + '</span>' +
          '<span style="position:absolute;left:260px;top:2px;font-family:JBMono,monospace;font-size:17px;font-weight:700;color:' +
          (hot ? "var(--brass)" : "var(--mint)") + '">' + V[i] + 'ms</span>' +
          '<div style="position:absolute;left:370px;top:7px;width:' + (V[i] * 1.4) + 'px;height:11px;border-radius:6px;' +
          'transform-origin:0% 50%;background:' + (hot ? "var(--brass)" : "rgba(64,138,113,.8)") + '"></div>' +
          (hot ? '<span style="position:absolute;left:' + (390 + V[i]*1.4) + 'px;top:2px;font-family:JBMono,monospace;' +
            'font-size:15px;letter-spacing:.14em;color:var(--brass)">&larr; YOUR SCORE</span>' : "");
        runs.appendChild(row);
        tl.fromTo(row.querySelector("div"), { scaleX: 0 }, { scaleX: 1, duration: 0.52, ease: "power3.out" }, 5.00 + i*0.52);
        tl.fromTo(row, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.30 }, 4.94 + i*0.52);
      }
      // THE FIX — the same tap, handled between chunks. The needle falls back through
      // the budget and the reading turns from brass to mint.
      tl.fromTo("#i-fix", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.46, ease: "power3.out" }, 6.90);
      tl.fromTo("#i-fixbar", { scaleX: 0 }, { scaleX: 1, duration: 0.52, ease: "power3.out" }, 7.30);
      tl.fromTo("#i-fixlbl", { autoAlpha: 0, x: -12 }, { autoAlpha: 1, x: 0, duration: 0.36, ease: "power3.out" }, 7.70);
      tl.to("#i-key", { y: 9, duration: 0.10, ease: "power3.in" }, 7.30);
      tl.to("#i-key", { y: 0, duration: 0.18, ease: "power2.out" }, 7.44);
      tl.to("#i-needle", { rotation: ${deg(92).toFixed(2)}, duration: 1.10, ease: "power3.inOut" }, 7.40);
      tl.to("#i-paint", { backgroundColor: "rgba(176,228,204,0.62)", duration: 0.20 }, 7.52);
      tl.to("#i-paint", { backgroundColor: "rgba(176,228,204,0.12)", duration: 0.40 }, 8.20);
${exitLift("#stage", 10.97)}`;
