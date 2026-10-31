// The console's own screens, rebuilt as live DOM rather than pasted in as
// screenshots. Two reasons: the film pushes into these panels and a bitmap
// would turn to mush, and the UI has to ANIMATE — chips lighting, a rank
// re-ordering, a plan writing itself. Every string, number, colour and control
// below was read off the running product on 2026-09-09.
import { T, BEVEL, brackets } from "./frame.mjs";

// The lockup: the Sanghavi mark, a hairline divider, then the product name.
// The divider is load-bearing (DESIGN.md §9) — without it the client mark and
// the product name read as one wordmark, which is the compounding the rule
// forbids.
export const lockup = (h = 44) => `
        <div style="display:flex;align-items:center;gap:20px">
          <img src="assets/brand/sanghavi-logo.png" style="height:${h}px;width:auto;display:block"/>
          <div style="width:1px;height:${Math.round(h * 0.86)}px;background:${T.line}"></div>
          <div>
            <div style="font-size:${Math.round(h * 0.50)}px;font-weight:500;color:${T.title};line-height:1.1">Forma</div>
            <div class="tag tag-sm" style="margin-top:3px">RETRIEVAL CONSOLE</div>
          </div>
        </div>`;

// The topbar, at the real copy and the real live counts.
export const topbar = (opts = {}) => `
      <div style="position:absolute;left:0;right:0;top:0;height:104px;border-bottom:1px solid ${T.line};
           background:${T.surface};display:flex;align-items:center;padding:0 56px">
${lockup(44)}
        <div style="margin-left:auto;display:flex;align-items:center;gap:26px">
          <div class="tag tag-sm" style="letter-spacing:0.18em"><span style="color:${T.accentText}">0</span> INTAKES &nbsp;·&nbsp; <span id="tb-count" style="color:${T.accentText}">${opts.count ?? "5,209"}</span> LASTS</div>
          <div class="chip chip-sm">REFRESH</div>
          <div class="tag tag-sm">SIGN OUT</div>
        </div>
      </div>`;

// The dock — fixed bottom-centre, square, bevelled, four wayfinding glyphs.
// The active item takes a fill wash and an accent dot beneath, never an
// accent fill (DESIGN.md §5).
const DOCK_ICONS = [
  // search
  `<circle cx="11" cy="11" r="7"/><path d="M16.5 16.5 L21 21"/>`,
  // inventory (widget-4)
  `<rect x="3" y="3" width="7.5" height="7.5"/><rect x="13.5" y="3" width="7.5" height="7.5"/><rect x="3" y="13.5" width="7.5" height="7.5"/><rect x="13.5" y="13.5" width="7.5" height="7.5"/>`,
  // labeling (tag)
  `<path d="M3 11 L11 3 L21 3 L21 13 L13 21 L3 11 Z"/><circle cx="16.5" cy="7.5" r="1.6"/>`,
  // overview (chart-square)
  `<rect x="3" y="3" width="18" height="18"/><path d="M8 16 L8 11 M12 16 L12 8 M16 16 L16 13"/>`,
];

export const dock = (active = 0) => `
      <div style="position:absolute;left:50%;bottom:52px;transform:translateX(-50%);
           display:flex;align-items:center;gap:8px;padding:12px 16px;
           background:${T.surface};border:1px solid ${T.line};box-shadow:${BEVEL}">
${DOCK_ICONS.map((d, i) => `        <div id="dk${i}" style="position:relative;width:60px;height:60px;display:flex;align-items:center;justify-content:center;${i === active ? `background:${T.fill2};` : ""}">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="${i === active ? T.title : T.body}" stroke-width="1.5" stroke-linecap="square">${d}</svg>
${i === active ? `          <i style="position:absolute;left:50%;bottom:-7px;transform:translateX(-50%);width:5px;height:5px;background:${T.accent}"></i>` : ""}
        </div>`).join("\n")}
      </div>`;

// A chip that can LATCH. GSAP here cannot tween a class (className is not in
// the animatable set) and tl.call is not seekable, so both states are stacked
// in one slot at identical geometry and switched with zero-duration autoAlpha
// sets. The off state stays in the flow and sizes the slot; the on state is
// absolutely positioned over it, so nothing reflows when it fires.
export const chipSlot = (id, text, on = false) => `          <div id="${id}" style="position:relative;display:inline-flex">
            <span id="${id}-off" class="chip" style="opacity:${on ? 0 : 1}">${text}</span>
            <span id="${id}-on" class="chip chip-on" style="position:absolute;left:0;top:0;right:0;bottom:0;opacity:${on ? 1 : 0}">${text}</span>
          </div>`;

// Latch a chip at time t: the off state out, the on state in, and a small
// settle on the slot so the change has a motion, not just a colour.
export const chipLatch = (id, t) =>
  `      tl.set("#${id}-off", { autoAlpha: 0 }, ${t.toFixed(3)});
      tl.set("#${id}-on", { autoAlpha: 1 }, ${t.toFixed(3)});
      tl.fromTo("#${id}", { scale: 0.955 }, { scale: 1, duration: 0.34, ease: "power3.out" }, ${t.toFixed(3)});`;

// The composer — the one control the whole product turns on. Real placeholder,
// real chip row, real bevel.
export const composer = (id, opt = {}) => `
      <div id="${id}" style="position:absolute;left:${opt.x ?? 360}px;top:${opt.y ?? 300}px;width:${opt.w ?? 1200}px;
           background:${T.surface};border:1px solid ${T.line};box-shadow:${BEVEL}">
        <div id="${id}-ring" style="position:absolute;inset:-1px;border:1px solid ${T.accent};opacity:0"></div>
        <div style="min-height:96px;padding:32px 34px 8px;font-size:30px;color:${T.faint}">${opt.slot ?? ""}</div>
        <div id="${id}-chips" style="display:flex;flex-wrap:wrap;gap:12px;padding:8px 26px 26px">
${(opt.chips ?? []).map((c, i) => chipSlot(`${id}-c${i}`, c.t, c.on)).join("\n")}
        </div>
      </div>`;

// One ranked result card. `plan` is the rework plan the product writes itself.
export const resultCard = (id, o) => `
      <div id="${id}" style="position:relative;background:${T.surface};border:1px solid ${o.hot ? "rgba(0,174,239,0.55)" : T.line};box-shadow:${BEVEL};padding:26px 30px">
${o.hot ? brackets() : ""}
        <div style="display:flex;align-items:flex-start">
          <div>
            <div style="display:flex;align-items:center;gap:16px">
              <span style="font-size:34px;font-weight:600;color:${T.title};letter-spacing:-0.01em">${o.code}</span>
              <span class="chip chip-sm" style="font-size:14px;letter-spacing:0.06em">${o.brand}</span>
            </div>
            <div style="display:flex;gap:11px;margin-top:16px">
              ${axis("L", o.L)}${axis("W", o.W)}${axis("H", o.H)}${girth(o.G)}
            </div>
            <div style="margin-top:15px;font-size:19px;color:${T.body}">${o.meta}</div>
          </div>
          <div style="margin-left:auto;text-align:right;padding-left:36px">
            <div class="badge" id="${id}-badge">${o.pct}</div>
            <div id="${id}-fit" style="margin-top:12px;font-size:19px;color:${T.muted}">${o.fit}</div>
${(o.plan ?? []).map((p, i) => `            <div id="${id}-p${i}" style="margin-top:9px;font-size:19px;color:${p.flag ? T.axW : T.body};opacity:0">${p.t}</div>`).join("\n")}
          </div>
        </div>
      </div>`;

// Colour follows the AXIS, never the value (DESIGN.md §2). Ball girth is
// deliberately given no hue — it is a girth, not an L/W/H axis.
export const axis = (k, v) => {
  const c = { L: [T.axL, T.axLt], W: [T.axW, T.axWt], H: [T.axH, T.axHt] }[k];
  return `<span class="ax" style="border-color:${c[0]}59;background:${c[0]}14;color:${T.ink}">
                <b style="color:${c[1]}">${k}</b>${v}</span>`;
};
export const girth = (v) =>
  `<span class="ax" style="border-color:${T.line};background:${T.fill};color:${T.ink}">
                <b style="color:${T.muted}">⌀</b>${v}</span>`;

// A measured-chip strip — what the server read off an uploaded mesh.
export const measured = (id, items) => `
      <div id="${id}" style="display:flex;flex-wrap:wrap;gap:12px">
${items.map((t, i) => `        <div id="${id}-m${i}" class="chip chip-sm" style="font-size:18px">${t}</div>`).join("\n")}
      </div>`;

// A spec-sheet cell: label over value, the console's densest unit.
export const cell = (label, value, sub) => `
        <div>
          <div class="tag tag-sm" style="font-size:13px;letter-spacing:0.18em;color:${T.faint}">${label}</div>
          <div class="num" style="margin-top:9px;font-size:26px;color:${T.ink}">${value}${sub ? `<span style="font-size:18px;color:${T.muted}"> ${sub}</span>` : ""}</div>
        </div>`;

// A window well for the 3D viewer — the real chrome, the real control rows.
export const viewerWell = (id, label, opt = {}) => `
      <div id="${id}" style="position:absolute;left:${opt.x}px;top:${opt.y}px;width:${opt.w}px;height:${opt.h}px;
           background:${T.surface};border:1px solid ${T.line};box-shadow:${BEVEL};overflow:hidden">
        <div style="position:absolute;left:0;right:0;top:0;height:52px;border-bottom:1px solid ${T.line};
             display:flex;align-items:center;padding:0 18px;gap:14px;background:${T.bg}">
          <span class="tag tag-sm" style="font-size:12px">${label}</span>
${opt.right ? `          <span class="num" style="margin-left:auto;font-size:15px;color:${T.faint}">${opt.right}</span>` : ""}
        </div>
        <div id="${id}-body" style="position:absolute;left:0;right:0;top:52px;bottom:0"></div>
      </div>`;
