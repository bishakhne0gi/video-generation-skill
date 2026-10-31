// EP27 · 13 CATCH — the honest ending, on navy. Three things that are true about the path
// rather than about the specification, and the frame SAYS SO: everything here is reporting
// from August 2026, not RFC text, and it carries that label rather than borrowing the
// spec's authority.
// On this field the pen becomes YELLOW (--pen measures 3.38:1 on navy) and the marker
// carries NAVY type on it (12.81:1) rather than cream.
import { field, enterAcross, exitLift, header, headerIn, penPath, penIn, arrowD, marker, markerIn, tilt } from "../lib/frame.mjs";

const REAL = [
  ["CORS", "QUERY did not inherit safelist status from GET.", "Every browser call preflights first.",
   "Expect the preflight. Cache it with Access-Control-Max-Age."],
  ["ALLOWLISTS", "A gateway rule written for five verbs does not know a sixth.", "WAFs and proxies may reject it outright.",
   "Add QUERY to the method allowlist before you ship anything."],
  ["FRAMEWORKS", "Node has parsed it since early 2024. OpenAPI 3.2 documents it.", "Most server frameworks have not shipped it.",
   "Send the method uppercase. fetch only normalises the standard set."],
];

export function build({ len }) {
  const X0 = 112, CW = 548, CG = 28, CY = 420, CH = 300;
  const cards = REAL.map(([t, a, b, fix], i) => {
    const x = X0 + i * (CW + CG);
    return `
      <div id="f13-c${i}" class="card" style="left:${x}px;top:${CY}px;width:${CW}px;height:${CH}px;transform:rotate(${tilt(i + 100)}deg)"></div>
      <div id="f13-c${i}t" style="position:absolute;left:${x}px;top:${CY}px;width:${CW}px;height:${CH}px;transform:rotate(${tilt(i + 100)}deg)">
        <div class="mono" style="position:absolute;left:28px;top:26px;font-size:29px;font-weight:700;color:var(--ink)">${t}</div>
        <div class="hair" style="left:28px;top:72px;width:${CW - 56}px"></div>
        <div id="f13-a${i}" style="position:absolute;left:28px;top:90px;width:${CW - 56}px;font-size:26px;line-height:1.28;color:var(--ink2)">${a}</div>
        <div id="f13-b${i}" style="position:absolute;left:28px;top:206px;width:${CW - 56}px;font-size:27px;line-height:1.24;font-weight:600;color:var(--ink);opacity:0">${b}</div>
        <div id="f13-f${i}" style="position:absolute;left:28px;top:90px;width:${CW - 56}px;font-size:29px;line-height:1.26;font-weight:600;color:var(--ink);opacity:0">${fix}</div>
      </div>`;
  }).join("");

  const body = `${field("navy")}
    <div id="stage" class="stage"><div class="inner onnavy">
      ${header("13", "the catch", "THE SPEC IS DONE.<br>THE PATH ISN'T.", "", true)}

      ${cards}

      <div id="f13-todo" class="tag" style="position:absolute;left:${X0}px;top:${CY - 40}px;font-size:19px;color:var(--yellow);opacity:0">WHAT TO DO ABOUT IT, TODAY</div>
      <div id="f13-rule" style="position:absolute;left:${X0}px;top:${CY - 14}px;width:1696px;height:5px;background:var(--yellow);transform-origin:0% 50%"></div>
      <div id="f13-src" class="tag" style="position:absolute;left:${X0}px;top:${CY + CH + 20}px;font-size:18px;color:#8FA0B6;opacity:0">REPORTED, AUGUST 2026 — NOT RFC TEXT</div>

      <div style="position:absolute;left:${X0}px;top:${CY + CH + 74}px;width:1720px">
        ${marker("f13-mk", -10, 10, 1258, 58)}
        <div class="phrase quote" style="position:relative;font-size:54px;color:var(--navy)">Nothing in RFC 10008 makes your proxy read it.</div>
      </div>
    </div></div>`;

  let s = `${enterAcross("#stage")}${headerIn(0.10, false)}\n`;
  REAL.forEach((_, i) => {
    s += `      gsap.set(["#f13-c${i}","#f13-c${i}t"], { autoAlpha: 0 });\n`;
    s += `      tl.fromTo(["#f13-c${i}","#f13-c${i}t"], { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.24, ease: "steps(4)" }, ${(0.44 + i * 0.30).toFixed(2)});\n`;
    s += `      tl.fromTo("#f13-b${i}", { autoAlpha: 0, x: -14 }, { autoAlpha: 1, x: 0, duration: 0.24, ease: "steps(4)" }, ${(2.40 + i * 0.86).toFixed(2)});\n`;
  });
  s += `      tl.fromTo("#f13-src", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.26, ease: "steps(4)" }, 5.30);
${markerIn("f13-mk", 5.90, 0.54)}
      // the cards turn over: same three subjects, now as instructions
      tl.fromTo("#f13-todo", { autoAlpha: 0, x: -18 }, { autoAlpha: 1, x: 0, duration: 0.24, ease: "steps(4)" }, 7.30);
      tl.to(["#f13-b0","#f13-b1","#f13-b2"], { autoAlpha: 0, duration: 0.22, ease: "steps(3)", stagger: 0.34 }, 7.40);
      tl.fromTo("#f13-f0", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.26, ease: "steps(4)" }, 7.62);
      tl.fromTo("#f13-f1", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.26, ease: "steps(4)" }, 8.06);
      tl.fromTo("#f13-f2", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.26, ease: "steps(4)" }, 8.50);
      // the problem line is REPLACED, not dimmed: two blocks sharing one slot at low opacity
      // is a legibility bug the layout gate is right to fail.
      tl.to("#f13-a0", { autoAlpha: 0, duration: 0.16, ease: "steps(2)" }, 7.50);
      tl.to("#f13-a1", { autoAlpha: 0, duration: 0.16, ease: "steps(2)" }, 7.96);
      tl.to("#f13-a2", { autoAlpha: 0, duration: 0.16, ease: "steps(2)" }, 8.40);
      // the instruction line earns a rule, drawn last, so the card is never finished early
      gsap.set("#f13-rule", { scaleX: 0 });
      tl.fromTo("#f13-rule", { scaleX: 0 }, { scaleX: 1, duration: 1.10, ease: "power3.out" }, 9.10);
${exitLift("#stage", len - 0.46)}`;

  return { body, script: s };
}
