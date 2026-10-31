// 00 TAB — the continuity object, mounted on its own track for the whole film so no cut
// can interrupt it.
//
// One request, `GET /`, followed from sent to answered. Every state is a value the film
// has just put on the sheet — nothing here is invented, and nothing here is a mascot.
// The method and the path NEVER move, because the point is that it is the same request;
// only the state changes, and it changes by being REPLACED, not interpolated. A number
// that eases between two readings is claiming to have been measured in between.
//
// `transparent: true` is compulsory: #root carries an opaque --canvas background, so an
// overlay that keeps it paints over the entire film — and lint, layout, motion and
// contrast all still pass while it does.
export function build({ total, built }) {
  const at = (id) => (built.find((b) => b.id === id) || { start: 0 }).start;
  // [when, what the sheet is showing at that moment]
  const STATES = [
    [0, "sent"],
    [at("bytes") + 2.4, "10,393 B"],
    [at("etag") + 3.6, "built 22 jun"],
    [at("when") + 1.6, "build time"],
    [at("bundle") + 8.0, "20,832 B"],
    [at("weight") + 7.4, "+855 KB js"],
    [at("strip") + 7.2, "37 vs 7"],
    [at("paint") + 5.0, "6,836 ms"],
    [at("turn") + 3.6, "nothing to build"],
    [at("rule") + 1.8, "ask first"],
    [at("end") + 0.6, "200"],
  ];

  const body = `
      <div id="tab" style="position:absolute;right:112px;bottom:44px;display:inline-flex;align-items:center;gap:16px;height:52px;padding:0 24px;border-radius:9999px;background:rgba(32,32,32,0.92);border:1px solid rgba(252,252,252,.30);white-space:nowrap">
        <span class="monob" style="font-size:21px;color:#fcfcfc;letter-spacing:0.02em">GET /</span>
        <span style="width:1px;height:22px;background:rgba(252,252,252,.28)"></span>
        <span id="tab-v" class="mono" style="font-size:21px;color:#B9B2A6;letter-spacing:0.06em;text-transform:uppercase">sent</span>
      </div>`;

  const script = `
      // the chip is present from frame zero and never animates position: it is the one
      // thing on screen that is deliberately not going anywhere.
      tl.fromTo("#tab", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.46, ease: "power3.out" }, 0.60);
${STATES.slice(1).map(([t, v]) => `      tl.call(function () { document.getElementById("tab-v").textContent = "${v}"; }, null, ${t.toFixed(2)});
      tl.fromTo("#tab-v", { autoAlpha: 0.25, x: 8 }, { autoAlpha: 1, x: 0, duration: 0.26, ease: "power3.out" }, ${t.toFixed(2)});`).join("\n")}
      // hold to the end of the film so the clip has a duration the contract can see
      tl.to("#tab", { autoAlpha: 1, duration: 0.01 }, ${(total - 0.2).toFixed(2)});`;

  return { body, script };
}
