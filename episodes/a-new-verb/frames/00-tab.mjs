// EP27 · the continuity tab. One request, followed the whole way through, as a small
// taped index tab in the corner. It is mounted OUTSIDE the frame track so no cut can
// interrupt it, and its composition root MUST be transparent or it paints over the film.
// Only the STATE changes. The id never moves — the point is that it is the same request.
import { tilt } from "../lib/frame.mjs";

const STATES = [
  ["open",        "TOO LONG"],
  ["title",       "TOO LONG"],
  ["shelf",       "TOO LONG"],
  ["getbody",     "NO SEMANTICS"],
  ["post",        "MISLABELLED"],
  ["notapparent", "MISLABELLED"],
  ["cost",        "UNCACHEABLE"],
  ["slate",       "UNCACHEABLE"],
  ["query",       "QUERY"],
  ["table",       "QUERY"],
  ["cachekey",    "CACHEABLE"],
  ["name",        "CACHEABLE"],
  ["catch",       "NOT ROUTED"],
  ["end",         "SHAREABLE"],
];

export function build({ total, built }) {
  const at = (id) => built.find((b) => b.id === id).start;
  // collapse repeats: a tab that re-sets the same word is a flicker, not a state change
  const keys = [];
  for (const [id, word] of STATES) if (!keys.length || keys[keys.length - 1].word !== word) keys.push({ word, t: at(id) });

  const body = `
    <div style="position:absolute;right:64px;top:56px;transform:rotate(${tilt(7)}deg)">
      <div class="card" style="position:relative;width:318px;height:104px"></div>
      <div class="tag" style="position:absolute;left:22px;top:20px;font-size:17px">FOLLOWING</div>
      <div class="mono" style="position:absolute;right:22px;top:18px;font-size:19px;font-weight:700;color:var(--ink2)">req#4f2a</div>
      <div style="position:absolute;left:22px;top:50px;width:280px;height:34px">
        ${keys.map((k, i) => `<span id="tab-w-${i}" class="mono" style="position:absolute;left:0;top:0;font-size:25px;font-weight:700;white-space:nowrap;color:${k.word === "QUERY" || k.word === "CACHEABLE" || k.word === "SHAREABLE" ? "var(--ink)" : "var(--pentype)"}">${k.word}</span>`).join("")}
      </div>
      <div id="tab-tape" style="position:absolute;left:112px;top:-14px;width:94px;height:30px;background:rgba(255,235,0,.78);transform:rotate(-2.4deg)"></div>
    </div>`;

  let script = `      // every state after the first starts hidden, set OUTSIDE the paused timeline —
      // a zero-duration tl.set at position 0 does not render while the playhead sits at 0.
`;
  for (let i = 1; i < keys.length; i++) script += `      gsap.set("#tab-w-${i}", { autoAlpha: 0 });\n`;
  for (let i = 1; i < keys.length; i++) {
    script += `      tl.set("#tab-w-${i - 1}", { autoAlpha: 0 }, ${keys[i].t.toFixed(2)});\n`;
    script += `      tl.fromTo("#tab-w-${i}", { autoAlpha: 0, y: -12 }, { autoAlpha: 1, y: 0, duration: 0.24, ease: "steps(4)" }, ${keys[i].t.toFixed(2)});\n`;
  }
  script += `      // the tab is pinned; it must still be alive, so the tape catches the light once per state
`;
  for (let i = 1; i < keys.length; i++)
    script += `      tl.fromTo("#tab-tape", { scaleX: 1 }, { scaleX: 1.06, duration: 0.18, ease: "steps(3)", yoyo: true, repeat: 1 }, ${keys[i].t.toFixed(2)});\n`;

  return { body, script };
}
