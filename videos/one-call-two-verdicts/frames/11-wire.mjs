// 11 THE WIRE — every field here is transcribed from grpc/grpc doc/PROTOCOL-HTTP2.md,
// fetched from master. The five-byte prefix is drawn to its real proportions: one byte
// of compressed-flag, four bytes of big-endian length, then the message.
import { page, header, headerIn, cutting, slapIn, enterAcross, typeOn, penSvg,
         penDraw, boxD, readout, readoutIn, arrowD, ellipseD } from "../lib/frame.mjs";

const HDRS = [
  [":method", "POST"],
  [":scheme", "https"],
  [":path", "/routeguide.RouteGuide/GetFeature"],
  ["te", "trailers"],
  ["grpc-timeout", "1500m"],
  ["content-type", "application/grpc+proto"],
];

// the frame, drawn to scale: 1 + 4 + N bytes. BW is the pixel width of one byte.
const FX = 1096, FY = 620, BW = 46;
const CNT = ["0", "1", "2", "3", "4", "5", "9", "14", "21", "29", "34", "38", "41"];

export function build({ len }) {
  const body = `
    ${page("news")}
    <div id="stage" class="stage"><div class="inner">
      ${header("2015 &middot; ON THE WIRE", "YOUR METHOD NAME<br>IS A URL PATH", "", false, 84)}

      ${cutting("f11-h", {
        x: 150, y: 400, w: 900, h: 388, seed: 81, kind: "cut", rot: -0.8,
        body: `
          <div class="slug" style="position:absolute;left:38px;top:26px;font-size:13px;letter-spacing:.16em">REQUEST-HEADERS &middot; HTTP/2 HEADERS FRAME</div>
          <div class="hair" style="left:38px;top:52px;width:824px"></div>
          <pre id="f11-src" class="mono" style="position:absolute;left:38px;top:68px;font-size:24px;line-height:38px;white-space:pre">${
            HDRS.map(([k, v]) => `${k.padEnd(14)}${v}`).join("\n")}</pre>
          <div class="hair" style="left:38px;top:322px;width:824px"></div>
          <div class="body faint" style="position:absolute;left:38px;top:332px;font-size:17px;font-style:italic">Path is case-sensitive: &ldquo;/&rdquo; Service-Name &ldquo;/&rdquo; method name.</div>`,
      })}

      <!-- the pen finds the two fields the rest of the film is about -->
      ${penSvg("f11-bp", boxD(184, 546, 692, 40, 4), 4)}
      ${penSvg("f11-bt", boxD(184, 622, 292, 40, 8), 4)}

      <!-- THE FRAME, drawn to scale -->
      <div id="f11-fl" class="slug" style="position:absolute;left:${FX}px;top:436px;font-size:15px">LENGTH-PREFIXED-MESSAGE &middot; DATA FRAME</div>
      <div class="hair" style="left:${FX}px;top:462px;width:672px"></div>
      <div id="f11-b0" style="position:absolute;left:${FX}px;top:${FY}px;width:${BW}px;height:96px;background:var(--stop);border:3px solid var(--ink)"></div>
      <div id="f11-b1" style="position:absolute;left:${FX + BW}px;top:${FY}px;width:${BW * 4}px;height:96px;background:var(--news2);border:3px solid var(--ink)"></div>
      <div id="f11-b2" style="position:absolute;left:${FX + BW * 5}px;top:${FY}px;width:${BW * 9}px;height:96px;background:var(--scrap);border:3px solid var(--ink)"></div>
      <div id="f11-t0" class="mono" style="position:absolute;left:${FX}px;top:${FY + 30}px;width:${BW}px;text-align:center;font-size:26px;font-weight:700;color:var(--scrap)">0</div>
      <div id="f11-t1" class="mono" style="position:absolute;left:${FX + BW}px;top:${FY + 30}px;width:${BW * 4}px;text-align:center;font-size:26px;font-weight:700">00 00 00 29</div>
      <div id="f11-t2" class="mono faint" style="position:absolute;left:${FX + BW * 5}px;top:${FY + 32}px;width:${BW * 9}px;text-align:center;font-size:23px;font-style:italic">41 bytes of protobuf</div>

      <div id="f11-c0" class="slug" style="position:absolute;left:${FX}px;top:${FY + 108}px;width:${BW}px;text-align:center;font-size:12px;color:var(--stopt)">1</div>
      <div id="f11-c1" class="slug" style="position:absolute;left:${FX + BW}px;top:${FY + 108}px;width:${BW * 4}px;text-align:center;font-size:12px">4</div>
      <div id="f11-c2" class="slug" style="position:absolute;left:${FX + BW * 5}px;top:${FY + 108}px;width:${BW * 9}px;text-align:center;font-size:12px">N</div>
      <div id="f11-lg" class="body" style="position:absolute;left:${FX}px;top:${FY + 140}px;width:672px;font-size:21px;color:var(--ink2)">
        <span class="red" style="font-weight:700">one byte</span> of flag, <span style="font-weight:700">four</span> of length, big-endian, then the message.</div>

      <div id="f11-cl" class="slug" style="position:absolute;left:${FX + 168}px;top:566px;font-size:15px">BYTES WRITTEN</div>
      ${readout("f11-cnt", CNT, `left:${FX}px;top:486px;font-size:88px;height:118px`, "fig")}

      <div id="f11-map" style="position:absolute;left:${FX}px;top:844px;width:684px">
        <div class="slug" style="font-size:13px;letter-spacing:.16em">WHERE THE PATH COMES FROM</div>
        <div class="hair" style="position:relative;margin-top:7px;width:684px"></div>
        <div class="mono" style="margin-top:10px;font-size:21px;line-height:34px;white-space:pre">package routeguide;   <span class="red">&rarr;</span>  routeguide
service RouteGuide    <span class="red">&rarr;</span>  .RouteGuide
rpc GetFeature        <span class="red">&rarr;</span>  /GetFeature</div>
      </div>
      ${penSvg("f11-ring", ellipseD(1454, 962, 116, 26, 7), 4)}
      <div id="f11-abnf" class="mono" style="position:absolute;left:150px;top:844px;width:900px;font-size:20px;line-height:1.5;color:var(--ink2)">Length-Prefixed-Message &rarr;<br>&nbsp;&nbsp;Compressed-Flag Message-Length Message</div>
      <div id="f11-ar" class="hair" style="left:150px;top:828px;width:900px"></div>
      <div id="f11-aa" class="slug" style="position:absolute;left:150px;top:940px;font-size:15px">GRPC/GRPC &middot; DOC/PROTOCOL-HTTP2.MD &middot; ABNF, VERBATIM</div>
    </div></div>`;

  const script = `
${enterAcross("#stage")}
${headerIn(0.10, false)}
      ${slapIn("f11-h", 0.80, 81, -0.8).trim()}
      gsap.set("#f11-h", { autoAlpha: 0 });
      tl.set("#f11-h", { autoAlpha: 1 }, 0.80);
      ${typeOn("f11-src", 1.06, 2.60, 96).trim()}

      // the two fields that carry the rest of the film
      ${penDraw("f11-bp", 3.90, 0.66).trim()}
      ${penDraw("f11-bt", 4.70, 0.56).trim()}

      // THE RUNNING SYSTEM — the frame is written a byte at a time, and the counter
      // is the same clock, so the picture and the number cannot drift apart.
      gsap.set("#f11-fl", { autoAlpha: 0 });
      tl.to("#f11-fl", { autoAlpha: 1, duration: 0.28 }, 5.50);
      gsap.set("#f11-cl", { autoAlpha: 0 });
      tl.to("#f11-cl", { autoAlpha: 1, duration: 0.24 }, 5.62);
      gsap.set("#f11-cnt", { autoAlpha: 0 });
      tl.to("#f11-cnt", { autoAlpha: 1, duration: 0.20 }, 5.68);
      ${readoutIn("f11-cnt", CNT.length, 5.86, 0.235).trim()}

      gsap.set("#f11-b0", { scaleX: 0, transformOrigin: "0% 50%" });
      tl.to("#f11-b0", { scaleX: 1, duration: 0.14, ease: "steps(2)" }, 5.84);
      gsap.set("#f11-t0", { autoAlpha: 0 }); tl.to("#f11-t0", { autoAlpha: 1, duration: 0.12 }, 5.96);
      gsap.set("#f11-c0", { autoAlpha: 0 }); tl.to("#f11-c0", { autoAlpha: 1, duration: 0.12 }, 6.02);
      gsap.set("#f11-b1", { scaleX: 0, transformOrigin: "0% 50%" });
      tl.to("#f11-b1", { scaleX: 1, duration: 0.34, ease: "steps(4)" }, 6.18);
      gsap.set("#f11-t1", { autoAlpha: 0 }); tl.to("#f11-t1", { autoAlpha: 1, duration: 0.12 }, 6.52);
      gsap.set("#f11-c1", { autoAlpha: 0 }); tl.to("#f11-c1", { autoAlpha: 1, duration: 0.12 }, 6.58);
      gsap.set("#f11-b2", { scaleX: 0, transformOrigin: "0% 50%" });
      tl.to("#f11-b2", { scaleX: 1, duration: 0.80, ease: "steps(9)" }, 6.76);
      gsap.set("#f11-t2", { autoAlpha: 0 }); tl.to("#f11-t2", { autoAlpha: 1, duration: 0.14 }, 7.56);
      gsap.set("#f11-c2", { autoAlpha: 0 }); tl.to("#f11-c2", { autoAlpha: 1, duration: 0.14 }, 7.62);
      gsap.set("#f11-lg", { autoAlpha: 0, y: 12 });
      tl.to("#f11-lg", { autoAlpha: 1, y: 0, duration: 0.40, ease: "power3.out" }, 7.86);

      gsap.set("#f11-ar", { scaleX: 0, transformOrigin: "0% 50%" });
      tl.to("#f11-ar", { scaleX: 1, duration: 0.42, ease: "power3.out" }, 9.10);
      gsap.set("#f11-abnf", { autoAlpha: 0 });
      tl.to("#f11-abnf", { autoAlpha: 1, duration: 0.36 }, 9.26);
      gsap.set("#f11-aa", { autoAlpha: 0 });
      tl.to("#f11-aa", { autoAlpha: 1, duration: 0.28 }, 9.70);
      gsap.set("#f11-map", { autoAlpha: 0, y: 14 });
      tl.to("#f11-map", { autoAlpha: 1, y: 0, duration: 0.44, ease: "power3.out" }, 10.10);
      // and the pen closes the loop: the rpc name in the .proto IS the path on the wire
      ${penDraw("f11-ring", 11.10, 0.66).trim()}`;

  return { body, script };
}
