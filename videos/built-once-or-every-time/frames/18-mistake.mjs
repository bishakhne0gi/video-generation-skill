// 18 MISTAKE — the failure that is actually in the wild, on the orange band.
//
// Not "SPAs are slow". The mistake is a category error: shipping an empty shell for a
// page whose content DID exist at build time. Docs, blogs, marketing, pricing, changelogs
// — every word of them identical for every visitor, and constructed from scratch in every
// visitor's browser.
//
// Replicate's rhythm puts the band here, and the band's contrast budget writes the
// layout: #fff on --primary measures 4.26:1, which is AA-LARGE only, so nothing on this
// frame is allowed below display size. The quotation is web.dev's, verbatim.
import { page, ENTER, stagger } from "../lib/frame.mjs";

export function build({ seamIn }) {
  const X = 132;
  const KINDS = ["Docs", "Blogs", "Marketing", "Pricing"];

  const body = `${page("hero")}
    <div id="stage" class="stage"><div class="inner">
      <div id="m-slug" class="slug" style="position:absolute;left:${X}px;top:120px;color:rgba(255,255,255,.86)">04 · The turn</div>
      <div id="m-rule" style="position:absolute;left:${X}px;top:162px;width:150px;height:4px;background:#ffffff;border-radius:2px;transform-origin:0% 50%"></div>

      ${["An empty div for a page", "that could have been", "built in June."].map((t, i) => `
      <div id="m-h${i}" class="m-h disp" style="position:absolute;left:${X}px;top:${214 + i * 94}px;width:1240px;font-size:92px;line-height:1.02;letter-spacing:-2.4px;color:#ffffff">${t}</div>`).join("")}

      <div id="m-p" class="mono" style="position:absolute;left:${X + 4}px;top:534px;font-size:31px;color:rgba(255,255,255,.94);letter-spacing:0.01em">Identical for everyone. Made from scratch for every single person.</div>

      ${KINDS.map((k, i) => `
      <div class="m-k" style="position:absolute;left:${X + i * 306}px;top:626px;height:82px;padding:0 34px;display:inline-flex;align-items:center;border-radius:9999px;border:2px solid rgba(255,255,255,.72);font-family:'Bric',system-ui,sans-serif;font-weight:800;font-size:38px;letter-spacing:-0.6px;color:#ffffff">${k}</div>`).join("")}

      <div id="m-q" class="disp" style="position:absolute;left:${X}px;top:790px;width:1300px;font-size:46px;line-height:1.16;letter-spacing:-1px;color:#ffffff">“The primary downside to client-side rendering is that the amount of JavaScript required tends to grow as an application grows.”</div>
      <div id="m-a" class="mono" style="position:absolute;left:${X + 4}px;top:986px;font-size:23px;color:#ffffff">web.dev · “Rendering on the Web” · Addy Osmani &amp; Jason Miller</div>
    </div></div>`;

  const script = `${ENTER[seamIn]("#stage")}
      gsap.set(["#m-p", ".m-k", "#m-q", "#m-a", "#m-h1", "#m-h2"], { autoAlpha: 0 });
      gsap.set("#m-rule", { scaleX: 0 });
      // the FIRST line of the headline is the SEAM CARRIER — full opacity from frame
      // zero, riding the cut in. The other two arrive after it, which turns a static
      // 3.8-second block into a sentence being written.
      tl.fromTo("#m-slug", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.36, ease: "power3.out" }, 0.24);
      tl.to("#m-rule", { scaleX: 1, duration: 0.44, ease: "power3.out" }, 0.38);
      tl.fromTo("#m-h0", { y: 26 }, { y: 0, duration: 0.60, ease: "power4.out" }, 0);
      tl.fromTo("#m-h1", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.54, ease: "power4.out" }, 1.00);
      tl.fromTo("#m-h2", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.54, ease: "power4.out" }, 2.10);
      tl.fromTo("#m-p", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.48, ease: "power3.out" }, 3.50);

      // the four categories arrive one at a time across three seconds, so the list is
      // something the viewer accumulates rather than a row that appears.
${stagger(".m-k", 5.40, { y: 26, dur: 0.44, step: 0.92 })}

      tl.fromTo("#m-q", { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.52, ease: "power3.out" }, 10.10);
      tl.fromTo("#m-a", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.40, ease: "power3.out" }, 11.90);
      // THE TAIL. The four pills invert to cream one at a time — a state change, not a
      // decoration: these are the pages that should be built once, and the film is
      // marking them. Colour-blocking is this system's own elevation language, so an
      // inversion is the right verb here and a glow or a wobble would not be.
      tl.to("#m-rule", { scaleX: 2.80, duration: 0.90, ease: "power2.inOut" }, 13.10);
      tl.to(".m-k", { backgroundColor: "#f9f7f3", color: "#202020", borderColor: "#f9f7f3",
        duration: 0.34, ease: "power2.out", stagger: 0.44 }, 13.90);`;

  return { body, script };
}
