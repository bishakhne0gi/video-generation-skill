// 01 OPEN — a line of Go that looks exactly like a function call, the machine it is
// really talking to, and gRPC's own documentation claiming the two are the same thing.
// The code is the gRPC project's own RouteGuide example and the coordinates are the
// real ones from routeguide/testdata (Patriots Path, Mendham, New Jersey).
import { page, cutting, slapIn, restShadow, stamp, stampIn, typeOn, penSvg, penDraw,
         ellipseD, arrowD, readout, readoutIn, column } from "../lib/frame.mjs";

const CODE = [
  `resp, err := client.GetFeature(ctx, &pb.Point{`,
  `    Latitude:  407838351,`,
  `    Longitude: -746143763,`,
  `})`,
  `if err != nil {`,
  `    log.Fatalf("GetFeature failed: %v", err)`,
  `}`,
  `fmt.Println(resp.GetName())`,
].join("\n");

// Courier Prime advances 0.6em. At 30px that is exactly 18px a character, which is
// what the pen coordinates below are measured in — never estimated.
const CH = 18, LH = 42, X0 = 150 + 44, Y0 = 240 + 38;
const MS = ["0", "40", "120", "240", "390", "560", "760", "980", "1220", "1480", "1760", "2050", "2360"];

export function build({ len }) {
  const body = `
    ${page("news")}
    <div id="stage" class="stage"><div class="inner">

      <div id="f1-slug" class="slug" style="position:absolute;left:150px;top:178px">LISTING 1 &middot; ROUTEGUIDE CLIENT &middot; GO</div>

      ${cutting("f1-code", {
        x: 150, y: 240, w: 1010, h: 402, seed: 3, kind: "cut", rot: -0.7,
        body: `<pre id="f1-src" class="mono" style="position:absolute;left:44px;top:38px;font-size:30px;line-height:${LH}px;white-space:pre">${CODE}</pre>`,
      })}

      ${cutting("f1-srv", {
        x: 1394, y: 250, w: 372, h: 214, seed: 12, kind: "torn", rot: 2.4, bg: "var(--news2)",
        body: `
          <div class="slug" style="position:absolute;left:26px;top:22px;font-size:15px">ANOTHER MACHINE</div>
          <div class="hair" style="left:26px;top:48px;width:320px"></div>
          <div class="mono" style="position:absolute;left:26px;top:62px;font-size:27px;font-weight:700">route_guide</div>
          <div class="mono faint" style="position:absolute;left:26px;top:102px;font-size:24px">10.4.2.19:50051</div>
          <div class="body faint" style="position:absolute;left:26px;top:144px;font-size:21px;font-style:italic">not in this process</div>`,
      })}

      ${penSvg("f1-ring", ellipseD(580, Y0 + 20, 176, 31, 4), 5)}
      ${penSvg("f1-arr", arrowD(1180, 352, 1382, 352, -32), 5)}

      <!-- THE RUNNING SYSTEM: the request leaves, slows, and does not arrive -->
      <div id="f1-pkt" style="position:absolute;left:1180px;top:334px;width:34px;height:34px;background:var(--ink);z-index:4"></div>
      <div id="f1-q" class="head" style="position:absolute;left:1300px;top:232px;font-size:62px;color:var(--stopt);z-index:5">?</div>
      ${readout("f1-ms", MS.map((m) => `${m} ms`), "left:1180px;top:398px;font-size:29px;z-index:4", "mono faint")}

      ${column("f1-col", { x: 1394, y: 582, w: 378, h: 344, size: 16.5,
        head: "THE CONTRACT &middot; ROUTE_GUIDE.PROTO",
        text: `<span class="mono" style="font-size:15px;line-height:1.62;display:block">service RouteGuide {<br>
&nbsp;&nbsp;rpc GetFeature(Point) returns (Feature) {}<br>
&nbsp;&nbsp;rpc ListFeatures(Rectangle)<br>&nbsp;&nbsp;&nbsp;&nbsp;returns (stream Feature) {}<br>
&nbsp;&nbsp;rpc RecordRoute(stream Point)<br>&nbsp;&nbsp;&nbsp;&nbsp;returns (RouteSummary) {}<br>
&nbsp;&nbsp;rpc RouteChat(stream RouteNote)<br>&nbsp;&nbsp;&nbsp;&nbsp;returns (stream RouteNote) {}<br>}</span>` })}
      ${stamp("f1-stamp", "PENDING", { x: 1400, y: 486, w: 250, h: 62, seed: 9, size: 27 })}

      <!-- the cold open's punch: the official docs make the claim the film examines -->
      <div id="f1-rule" class="rrule" style="left:150px;top:722px;width:1180px;transform-origin:0% 50%"></div>
      <div id="f1-pq" class="quote" style="position:absolute;left:150px;top:752px;width:1180px;font-size:40px">
        &ldquo;the client sends a single request to the server and gets a single response back,
        <span class="qital red">just like a normal function call</span>.&rdquo;</div>
      <div id="f1-att" class="slug" style="position:absolute;left:150px;top:914px;font-size:18px">GRPC.IO &middot; CORE CONCEPTS &middot; &ldquo;UNARY RPCS&rdquo;</div>
    </div></div>`;

  const script = `
      // No seam in: this is the first frame. The code cutting is put down immediately
      // and the source types into it, so the film opens on a hand, not on a slide.
      ${restShadow("f1-srv")}
      ${slapIn("f1-code", 0.08, 3, -0.7).trim()}
      gsap.set("#f1-slug", { autoAlpha: 0 });
      tl.fromTo("#f1-slug", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.34, ease: "power2.out" }, 0.02);
      ${typeOn("f1-src", 0.34, 3.10, 82).trim()}

      // the pen rings the call — AFTER the line it marks exists
      ${penDraw("f1-ring", 3.52, 0.66).trim()}

      gsap.set("#f1-srv", { autoAlpha: 0 });
      tl.set("#f1-srv", { autoAlpha: 1 }, 4.32);
      ${slapIn("f1-srv", 4.32, 12, 2.4).trim()}
      ${penDraw("f1-arr", 4.86, 0.52).trim()}

      gsap.set("#f1-pkt", { autoAlpha: 0 });
      tl.set("#f1-pkt", { autoAlpha: 1 }, 5.30);
      tl.fromTo("#f1-pkt", { x: 0 }, { x: 118, duration: 1.90, ease: "power3.out" }, 5.30);
      gsap.set("#f1-ms", { autoAlpha: 0 });
      tl.to("#f1-ms", { autoAlpha: 1, duration: 0.20 }, 5.34);
      ${readoutIn("f1-ms", MS.length, 5.44, 0.185).trim()}
      gsap.set("#f1-q", { autoAlpha: 0, scale: 0.6 });
      tl.fromTo("#f1-q", { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.14, ease: "steps(2)" }, 7.36);

      ${stampIn("f1-stamp", 7.86, 9).trim()}

      gsap.set("#f1-col", { autoAlpha: 0 });
      tl.to("#f1-col", { autoAlpha: 1, duration: 0.40 }, 1.06);

      gsap.set("#f1-rule", { scaleX: 0 });
      tl.to("#f1-rule", { scaleX: 1, duration: 0.46, ease: "power3.out" }, 8.16);
      gsap.set("#f1-pq", { autoAlpha: 0, y: 16 });
      tl.to("#f1-pq", { autoAlpha: 1, y: 0, duration: 0.46, ease: "power3.out" }, 8.32);
      gsap.set("#f1-att", { autoAlpha: 0 });
      tl.to("#f1-att", { autoAlpha: 1, duration: 0.32 }, 8.84);`;

  return { body, script };
}
