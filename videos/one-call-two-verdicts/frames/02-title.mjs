// 02 TITLE — the masthead. The only appearance of the blackletter in the whole film,
// and the register's signature image: every LETTER of the headline is its own cutting,
// with its own typeface, paper, angle and tear. Assembled by anime.js splitText-adjacent
// machinery (ransom/ransomIn), stepped, driven by this frame's GSAP clock.
import { page, ransom, ransomIn, penSvg, penDraw, ellipseD, enterLift } from "../lib/frame.mjs";

const L1 = ransom("f2-a", "ONE CALL,",    { x: 236, y: 300, size: 128, seed: 5 });
const L2 = ransom("f2-b", "TWO VERDICTS", { x: 236, y: 466, size: 128, seed: 11 });

export function build({ len }) {
  const body = `
    ${page("plate")}
    <div id="stage" class="stage"><div class="inner rev">

      <div id="f2-mast" class="mast" style="position:absolute;left:0;top:74px;width:1920px;text-align:center;font-size:76px;color:var(--scrap)">The Distributed Times</div>
      <div id="f2-h1" class="revrule" style="left:236px;top:178px;width:1448px;height:2px;transform-origin:0% 50%"></div>
      <div id="f2-fol" class="slug" style="position:absolute;left:0;top:196px;width:1920px;text-align:center;font-size:19px;color:#A79E8D">VOL.&nbsp;XLII &middot; No.&nbsp;28 &middot; SATURDAY, AUGUST 22, 2026 &middot; PRICE: ONE DEADLINE</div>
      <div id="f2-h2" class="revrule" style="left:236px;top:238px;width:1448px;height:2px;transform-origin:0% 50%"></div>

      ${L1.html}
      ${L2.html}

      <div id="f2-deck" class="body" style="position:absolute;left:240px;top:660px;width:1180px;font-size:34px;font-style:italic;color:#CFC6B4">
        g&#8203;RPC, and forty-two years of arguing about what a remote call really is</div>
      <div id="f2-rule" class="rrule" style="left:240px;top:636px;width:1160px;transform-origin:0% 50%"></div>

      <div id="f2-ep" class="slug" style="position:absolute;left:240px;top:742px;font-size:21px;color:#A79E8D">SHIP&nbsp;IT &middot; EPISODE TWENTY-EIGHT</div>

      <!-- the pen rings the joke in the folio line. White, because red on the black
           plate measures 3.20:1 and this register does not put red type on black. -->
      ${penSvg("f2-ring", ellipseD(1330, 205, 138, 26, 6), 4, "penw")}
    </div></div>`;

  const script = `
${enterLift("#stage")}
      // SEAM CARRIER — the masthead is at full opacity from frame zero and rides the cut.
      tl.fromTo("#f2-mast", { y: 14 }, { y: 0, duration: 0.54, ease: "power3.out" }, 0);
      gsap.set("#f2-h1", { scaleX: 0 }); gsap.set("#f2-h2", { scaleX: 0 });
      tl.to("#f2-h1", { scaleX: 1, duration: 0.50, ease: "power3.out" }, 0.16);
      tl.to("#f2-h2", { scaleX: 1, duration: 0.50, ease: "power3.out" }, 0.24);
      gsap.set("#f2-fol", { autoAlpha: 0 });
      tl.to("#f2-fol", { autoAlpha: 1, duration: 0.30 }, 0.34);

      // THE RANSOM HEADLINE — letter by letter, stepped, seeded scatter.
      ${ransomIn("f2-a", L1.n, 0.62, 64, 5).trim()}
      ${ransomIn("f2-b", L2.n, 1.44, 60, 11).trim()}

      gsap.set("#f2-rule", { scaleX: 0 });
      tl.to("#f2-rule", { scaleX: 1, duration: 0.44, ease: "power3.out" }, 2.36);
      gsap.set("#f2-deck", { autoAlpha: 0, y: 16 });
      tl.to("#f2-deck", { autoAlpha: 1, y: 0, duration: 0.44, ease: "power3.out" }, 2.52);
      gsap.set("#f2-ep", { autoAlpha: 0 });
      tl.to("#f2-ep", { autoAlpha: 1, duration: 0.32 }, 3.02);

      // the last beat does work: the pen finds the price.
      ${penDraw("f2-ring", 3.62, 0.62).trim()}`;

  return { body, script };
}
