// 16 EXIST — where the drawing actually lives, read off the real origin.
//
// These are the genuine localStorage keys on excalidraw.com, listed on 2026-08-23 on a
// browser that had opened the app and drawn nothing. The lengths are the real string
// lengths of their values. `excalidraw` holds the scene: two bytes on a fresh device,
// because the scene is empty, and it grows with whatever you draw.
//
// The frame's argument is the last row, which does not exist: there is no key on any
// server. A build machine in June cannot read a store that lives on a device it has
// never met, and that is the whole reason the div ships empty.
//
// The field is --bone rather than --canvas: Replicate uses the half-step deeper cream
// for an inset group, and this frame is an inspection of one thing rather than a page.
import { page, header, headerIn, ENTER, well, wellIn, typeOn, stamp, stampIn,
  penSvg, penDraw, crossD } from "../lib/frame.mjs";

export function build({ seamIn }) {
  const X = 128, W = 1024, WY = 396;

  const TEXT = [
    `<span class="cmt">&gt; Object.keys(localStorage)</span>`,
    `<span class="dim">[</span>`,
    `  <span class="hot">"excalidraw"</span><span class="dim">,</span>        <span class="cmt">// the scene. 2 bytes, empty</span>`,
    `  <span class="hot">"excalidraw-state"</span><span class="dim">,</span>  <span class="cmt">// 1,626 bytes of yours</span>`,
    `  <span class="dim">"excalidraw-theme",</span>`,
    `  <span class="dim">"version-files", "version-dataState",</span>`,
    `  <span class="dim">"i18nextLng"</span>`,
    `<span class="dim">]</span>`,
  ].join("\n");

  const body = `${page("bone")}
    <div id="stage" class="stage"><div class="inner">
      ${header("04 · THE TURN", "It was never on their server.", "", false, 62)}
      <div id="x-note" class="mono" style="position:absolute;left:130px;top:284px;font-size:20px;color:var(--charcoal)">https://excalidraw.com · devtools console · 2026-08-23 · a browser that had drawn nothing</div>

      ${well("x1", { x: X, y: WY, w: W, h: 392, pad: 30, fs: 23, lh: 1.62, text: TEXT })}

      <div id="x-k" class="slug" style="position:absolute;left:1240px;top:${WY + 6}px">On the build machine</div>
      <div id="x-r" class="hair" style="left:1240px;top:${WY + 50}px;width:568px;transform-origin:0% 50%"></div>
      <div id="x-v" class="disp" style="position:absolute;left:1240px;top:${WY + 92}px;font-size:96px;letter-spacing:-2.4px;color:var(--mute)">none</div>
      <div id="x-b" class="body" style="position:absolute;left:1240px;top:${WY + 230}px;width:568px;font-size:29px;color:var(--body)">A machine that ran in June, in a data centre, has no storage belonging to a device it has never met.</div>

      ${penSvg("p-x", crossD(1400, WY + 140, 52), 5, "")}
      <div id="x-say" class="body" style="position:absolute;left:${X}px;top:872px;width:1024px;font-size:30px;color:var(--body)"><span class="bodys">Static rendering can only pre-build what is the same for everyone.</span> That is not a weakness. It is the definition.</div>
      ${stamp("st16", "NO REQUEST, NO CONTENT", { x: 1256, y: 196 })}
    </div></div>`;

  const script = `${ENTER[seamIn]("#stage")}
${headerIn(0.10, false)}
      gsap.set(["#x-note", "#x-k", "#x-v", "#x-b", "#x-say"], { autoAlpha: 0 });
      gsap.set("#x-r", { scaleX: 0 });
      tl.fromTo("#x-note", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.34, ease: "power3.out" }, 0.22);
${wellIn("x1", 0.48)}
${typeOn("x1-b", 0.82, 2.60, 66, 172)}

      tl.fromTo("#x-k", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.34, ease: "power3.out" }, 4.40);
      tl.to("#x-r", { scaleX: 1, duration: 0.44, ease: "power3.out" }, 4.56);
      tl.fromTo("#x-v", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.46, ease: "power3.out" }, 4.86);
${penDraw("p-x", 5.50, 0.34)}
      tl.fromTo("#x-b", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.44, ease: "power3.out" }, 6.20);

      tl.fromTo("#x-say", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.46, ease: "power3.out" }, 8.20);
${stampIn("st16", 9.90)}`;

  return { body, script };
}
