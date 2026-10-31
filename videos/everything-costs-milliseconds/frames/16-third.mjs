import { field, enterAcross, exitAcross, header, headerIn , readout, readoutIn} from "../lib/frame.mjs";
// STATION 14 — third parties. Crates nobody opens, each with a real weight and a real
// slice of the main thread. The last column is the one that ends the argument.
const T = [
  { n: "tag manager",     kb: 68,  ms: 210, why: "loads the four below" },
  { n: "session replay",  kb: 184, ms: 340, why: "records every mouse move" },
  { n: "chat widget",     kb: 240, ms: 180, why: "used by 0.4% of visits" },
  { n: "A/B testing",     kb: 96,  ms: 290, why: "blocking, to stop a flicker" },
  { n: "campaign pixel",  kb: 32,  ms: 40,  why: "campaign ended in March", dead: true },
];
export const body = `
    ${field("lamplit")}
    <div id="stage" class="stage"><div class="inner">
      ${header("14", "THIRD PARTIES", "Code you ship<br>but never read.", "Every tag runs on your thread, inside your budget, with your users' attention. Nobody owns them, so nobody removes them.")}

      <div id="x-panel" class="panel" style="left:118px;top:552px;width:1684px;height:396px"></div>
      <div id="x-head" style="position:absolute;left:158px;top:578px;width:1604px">
        <span class="mono" style="position:absolute;left:0;font-size:15px;letter-spacing:.16em;opacity:.55">TAG</span>
        <span class="mono" style="position:absolute;left:420px;font-size:15px;letter-spacing:.16em;opacity:.55">TRANSFER</span>
        <span class="mono" style="position:absolute;left:600px;font-size:15px;letter-spacing:.16em;opacity:.55">MAIN THREAD</span>
        <span class="mono" style="position:absolute;left:1130px;font-size:15px;letter-spacing:.16em;opacity:.55">WHY IT IS THERE</span></div>
      <div id="x-rows" style="position:absolute;left:158px;top:614px;width:1604px;height:262px"></div>
      <div id="x-tot" style="position:absolute;left:158px;top:884px;width:1604px;display:flex;justify-content:space-between;align-items:baseline">
        <span class="mono" style="font-size:17px;letter-spacing:.16em;opacity:.6">FIVE TAGS YOU DID NOT WRITE</span>
        <span class="mono hot" style="font-size:34px;font-weight:700;line-height:1.18">620 KB &middot; 1.06s of thread</span></div>

      ${readout("x-tot2", ["620 KB &middot; 1.06s of thread","428 KB &middot; 0.72s of thread","264 KB &middot; 0.40s of thread","196 KB &middot; 0.21s of thread"],
        "position:absolute;left:900px;top:884px;width:704px;text-align:right;height:48px;font-family:'JBMono',monospace;font-size:34px;font-weight:700;line-height:1.18;color:var(--mint)")}
      <div id="x-audit" style="position:absolute;left:158px;top:952px;width:1000px">
        <div class="mono" style="font-size:19px;color:var(--emerald-lit)">
          <span style="color:var(--mint);font-weight:700">audit them every quarter</span> &mdash; three of these five had no owner left in the company</div></div>
    </div></div>`;

export const script = `${enterAcross()}${headerIn()}
      tl.fromTo("#x-panel", { autoAlpha: 0, scale: 0.98 }, { autoAlpha: 1, scale: 1, duration: 0.54, ease: "power3.out" }, 0.10);
      tl.fromTo("#x-head",  { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.38 }, 0.28);
      var T = ${JSON.stringify(T)}, wrap = document.querySelector("#x-rows");
      for (var i = 0; i < T.length; i++) {
        var t = T[i], row = document.createElement("div");
        row.style.cssText = "position:absolute;left:0;top:" + (i*52) + "px;width:1604px;height:44px";
        row.innerHTML =
          '<span style="position:absolute;left:0;top:6px;font-family:JBMono,monospace;font-size:20px;color:' +
            (t.dead ? "var(--brass)" : "var(--mint)") + '">' + t.n + '</span>' +
          '<span style="position:absolute;left:420px;top:6px;font-family:JBMono,monospace;font-size:20px;' +
            'color:var(--emerald-lit)">' + t.kb + ' KB</span>' +
          '<div class="bar" style="position:absolute;left:600px;top:10px;width:' + (t.ms*1.32) + 'px;height:20px;border-radius:4px;' +
            'transform-origin:0% 50%;background:rgba(232,161,60,.7)"></div>' +
          '<span style="position:absolute;left:' + (612 + t.ms*1.32) + 'px;top:6px;font-family:JBMono,monospace;' +
            'font-size:18px;font-weight:700;color:var(--brass)">' + t.ms + 'ms</span>' +
          '<span style="position:absolute;left:1130px;top:8px;font-family:JBMono,monospace;font-size:17px;color:' +
            (t.dead ? "var(--brass)" : "var(--mint)") + ';opacity:' + (t.dead ? ".95" : ".48") + '">' + t.why + '</span>';
        wrap.appendChild(row);
        tl.fromTo(row, { autoAlpha: 0, x: -18 }, { autoAlpha: 1, x: 0, duration: 0.40, ease: "power3.out" }, 0.72 + i*0.40);
        tl.fromTo(row.querySelector(".bar"), { scaleX: 0 }, { scaleX: 1, duration: 0.46, ease: "power3.out" }, 0.80 + i*0.40);
      }
      tl.fromTo("#x-tot", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.46, ease: "power3.out" }, 3.20);
      // the dead pixel is struck through last — the beat's payoff, and the one that gets
      // the laugh. It keeps the tail alive instead of ending on the total.
      var dead = wrap.children[4], line = document.createElement("div");
      line.style.cssText = "position:absolute;left:-6px;top:22px;width:1130px;height:2px;background:var(--brass);transform-origin:0% 50%";
      dead.appendChild(line);
      tl.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 0.52, ease: "power3.inOut" }, 4.20);
      tl.to(dead, { autoAlpha: 0.42, duration: 0.50, ease: "power2.out" }, 4.60);
      // THE FIX — the audit. Tags come off one at a time and the total falls with them,
      // which keeps the beat delivering right through its tail.
      tl.fromTo("#x-audit", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.44, ease: "power3.out" }, 5.60);
      tl.set("#x-tot", { autoAlpha: 0 }, 6.10);${readoutIn("x-tot2", 4, 6.10, 0.82)}
      var kill = [1, 3, 2];
      for (var y2 = 0; y2 < kill.length; y2++) {
        var row2 = wrap.children[kill[y2]], kt = 6.30 + y2*0.82;
        var ln2 = document.createElement("div");
        ln2.style.cssText = "position:absolute;left:-6px;top:22px;width:1130px;height:2px;background:var(--brass);transform-origin:0% 50%";
        row2.appendChild(ln2);
        tl.fromTo(ln2, { scaleX: 0 }, { scaleX: 1, duration: 0.40, ease: "power3.inOut" }, kt);
        tl.to(row2, { autoAlpha: 0.30, x: -26, duration: 0.46, ease: "power2.out" }, kt + 0.34);
      }
${exitAcross("#stage", 10.37)}`;
