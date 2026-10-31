// EP27 · 03 SHELF — the whole method registry laid out by the year it arrived, so the
// sixteen-year gap is a physical distance on the page rather than a number in a sentence.
import { field, enterLift, exitAcross, header, headerIn, penPath, penIn, ellipseD, marker, markerIn, readout, readoutIn, tilt } from "../lib/frame.mjs";

const OLD = ["GET", "HEAD", "POST", "OPTIONS", "PUT", "DELETE", "TRACE", "CONNECT"];
const YEARS = Array.from({ length: 17 }, (_, i) => String(2010 + i));

const chip = (id, x, y, w, label, big = false, dark = false) => `
      <div id="${id}" class="card" style="left:${x}px;top:${y}px;width:${w}px;height:${big ? 108 : 84}px;display:flex;align-items:center;justify-content:center;transform:rotate(0deg)">
        <span class="mono" style="font-size:${big ? 44 : 30}px;font-weight:700;letter-spacing:.02em;color:var(--ink)">${label}</span>
      </div>`;

export function build({ len }) {
  const X0 = 128, CW = 160, CG = 13, Y0 = 512;
  const old = OLD.map((m, i) => chip(`f3-c${i}`, X0 + (i % 4) * (CW + CG), Y0 + Math.floor(i / 4) * 98, CW, m)).join("");

  const PX = 796, QX = 1492;
  const brk = { d: `M${PX + 268},${Y0 + 176} L${PX + 268},${Y0 + 210} M${PX + 268},${Y0 + 210} L${QX - 10},${Y0 + 210} M${QX - 10},${Y0 + 210} L${QX - 10},${Y0 + 176}`, len: 780 };
  const circ = ellipseD(QX + 132, Y0 + 54, 172, 80, 3);

  const body = `${field("paper")}
    <div id="stage" class="stage"><div class="inner">
      ${header("03", "the shelf", "NINE VERBS.<br>SIXTEEN YEARS.", "Every method a server is expected to understand, at the year its RFC landed.")}

      <div class="tag" style="position:absolute;left:130px;top:456px;font-size:18px">1996 – 1997 · RFC 1945, RFC 2068</div>
      ${old}

      <div class="tag" style="position:absolute;left:${PX}px;top:456px;font-size:18px">2010 · RFC 5789</div>
      ${chip("f3-patch", PX, Y0, 260, "PATCH", true)}

      <!-- the gap is not a caption, it is a duration. Count it. -->
      <div id="f3-yeartag" class="tag" style="position:absolute;left:${PX + 320}px;top:${Y0 + 4}px;font-size:17px;opacity:0">COUNTING</div>
      <div style="position:absolute;left:${PX + 320}px;top:${Y0 + 28}px;width:300px;height:96px">
        ${readout("f3-y", YEARS.map((y, i) => `<span class="hdr" style="font-size:82px;${i === YEARS.length - 1 ? "color:var(--pentype)" : ""}">${y}</span>`), "font-size:82px")}
      </div>

      <div id="f3-qtag" class="tag" style="position:absolute;left:${QX}px;top:456px;font-size:18px;opacity:0">2026 · RFC 10008</div>
      ${chip("f3-query", QX, Y0, 264, "QUERY", true)}

      <div style="position:absolute;left:${PX + 300}px;top:${Y0 + 262}px;width:640px">
        ${marker("f3-mk", -6, 8, 610, 54)}
        <div class="phrase quote" style="position:relative;font-size:52px">sixteen years of silence</div>
      </div>

      ${penPath("f3-brk", brk.d, brk.len, 5)}
      ${penPath("f3-cir", circ.d, circ.len, 6)}
    </div></div>`;

  let s = `${enterLift("#stage")}${headerIn(0.10)}\n`;
  // the eight are CUT-OUTS: they pop on twos, each at its own angle, never as a group
  OLD.forEach((_, i) => {
    s += `      gsap.set("#f3-c${i}", { autoAlpha: 0 });\n`;
    s += `      tl.fromTo("#f3-c${i}", { autoAlpha: 0, scale: 0.82, rotation: ${tilt(i + 11)} }, { autoAlpha: 1, scale: 1, rotation: ${tilt(i + 3)}, duration: 0.24, ease: "steps(4)" }, ${(0.80 + i * 0.13).toFixed(2)});\n`;
  });
  s += `      gsap.set("#f3-patch", { autoAlpha: 0 });
      tl.fromTo("#f3-patch", { autoAlpha: 0, scale: 0.82, rotation: -6 }, { autoAlpha: 1, scale: 1, rotation: ${tilt(21)}, duration: 0.26, ease: "steps(4)" }, 2.30);
      // the gap gets counted. Sixteen years is the whole argument of this frame, so it is
      // spent on screen as sixteen years rather than as a caption saying so.
      // the rail is hidden until it starts counting: a bare "2010" floating in the gap
      // before the tag arrives reads as a stray label, not as a clock.
      gsap.set("#f3-y-0", { autoAlpha: 0 });
      tl.fromTo("#f3-yeartag", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.20, ease: "steps(3)" }, 2.60);
      tl.to("#f3-y-0", { autoAlpha: 1, duration: 0.14, ease: "steps(2)" }, 2.66);
${readoutIn("f3-y", YEARS.length, 2.70, 0.165)}
${penIn("f3-brk", brk.len, 4.20, 0.74)}
${markerIn("f3-mk", 5.60, 0.44)}
      gsap.set("#f3-query", { autoAlpha: 0 });
      tl.fromTo("#f3-query", { autoAlpha: 0, y: -180, rotation: -9 }, { autoAlpha: 1, y: 0, rotation: ${tilt(31)}, duration: 0.42, ease: "steps(6)" }, 7.10);
      tl.fromTo("#f3-qtag", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.20, ease: "steps(3)" }, 7.42);
${penIn("f3-cir", circ.len, 7.62, 0.78)}
      // the eight recede: the argument is now about the tenth one
      tl.to(["${OLD.map((_, i) => `#f3-c${i}`).join('","')}"], { autoAlpha: 0.45, duration: 0.60, ease: "power2.out", stagger: 0.03 }, 7.80);
${exitAcross("#stage", len - 0.34)}`;

  return { body, script: s };
}
