// The three surfaces the story happens on, built as software rather than as
// labelled rectangles. Three rules make a panel read as real rather than as a
// drawing of real, and every surface below obeys them:
//
//   1. one piece of true, specific data  — `1080 x 1079 · 41%`, not "your image"
//   2. busy at the edges                 — a disabled control, a dimmed count
//   3. never centre the body             — software is left-aligned
//
// Nothing here forges a third party's brand artwork. Gemini and X are named the
// way the product's own landing page names them, and drawn as plain type with
// generic glyphs — the point is the WORKFLOW, not a pixel-copy of someone's UI.

import { T } from "./frame.mjs";

// ---- icons ----------------------------------------------------------------
const svg = (d, o = {}) => `<svg viewBox="0 0 24 24" width="${o.s ?? 16}" height="${o.s ?? 16}" fill="none"
  stroke="currentColor" stroke-width="${o.w ?? 1.7}" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;

export const I = {
  brush: svg(`<path d="M9.5 14.5 3 21l6.5-1.5z"/><path d="M14 4.5 19.5 10 11 18.5 5.5 13z"/>`),
  box:   svg(`<path d="M3 8V4h4M17 4h4v4M21 16v4h-4M7 20H3v-4" stroke-dasharray="0"/>`),
  snip:  svg(`<path d="M4 8h13a3 3 0 0 1 3 3v9"/><path d="M8 4v13a3 3 0 0 0 3 3h9"/>`),
  undo:  svg(`<path d="M4 10h10a5 5 0 0 1 0 10h-3"/><path d="M4 10l4-4M4 10l4 4"/>`),
  redo:  svg(`<path d="M20 10H10a5 5 0 0 0 0 10h3"/><path d="M20 10l-4-4M20 10l-4 4"/>`),
  erase: svg(`<path d="M8 20H5l-2-2 9-9 6 6-5 5z"/><path d="M21 20h-9"/>`),
  image: svg(`<rect x="3" y="4" width="18" height="16" rx="1"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="m3 17 5-4 4 3 3-2 6 4"/>`),
  down:  svg(`<path d="M12 4v11"/><path d="m7 12 5 5 5-5"/><path d="M4 20h16"/>`),
  star:  `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2c.6 4.9 2.5 6.8 7.4 7.4-4.9.6-6.8 2.5-7.4 7.4-.6-4.9-2.5-6.8-7.4-7.4C9.5 8.8 11.4 6.9 12 2z"/><path d="M18.6 15.2c.3 2.4 1.2 3.3 3.6 3.6-2.4.3-3.3 1.2-3.6 3.6-.3-2.4-1.2-3.3-3.6-3.6 2.4-.3 3.3-1.2 3.6-3.6z"/></svg>`,
  send:  svg(`<path d="M5 12h13"/><path d="m12 5 7 7-7 7"/>`, { s: 18 }),
  heart: svg(`<path d="M12 20s-7-4.5-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.5-7 9-7 9z"/>`, { s: 17 }),
  reply: svg(`<path d="M20 16a4 4 0 0 1-4 4H7l-3 3V8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4z"/>`, { s: 17 }),
  boost: svg(`<path d="M4 8h11a3 3 0 0 1 3 3v3"/><path d="m15 4 3 4-3 4"/><path d="M20 16H9a3 3 0 0 1-3-3v-3"/><path d="m9 20-3-4 3-4"/>`, { s: 17 }),
};

// ---- 1 · the generator ----------------------------------------------------
// A dark chat surface: wordmark, model chip, the composer, and the answer slot.
// The composer is the hero — the film opens inside its caret.
export const geminiWin = (id, { x, y, w, h }, inner = "") => `
      <div id="${id}" class="win-d" data-layout-allow-overflow style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px">
        <div style="height:58px;border-bottom:1px solid ${T.hair};display:flex;align-items:center;
                    padding:0 22px;gap:14px">
          <span style="color:${T.lit};display:flex">${I.star}</span>
          <span style="font-size:17px;font-weight:600;color:${T.snow};letter-spacing:-0.01em">Gemini</span>
          <span class="chip chip-d" style="height:28px;font-size:12px;margin-left:6px">2.5 Flash</span>
          <span style="flex:1"></span>
          <span class="mono" style="font-size:12px;color:${T.mute}">Image</span>
        </div>
        <div style="position:relative;width:100%;height:${h - 58}px">
${inner}
        </div>
      </div>`;

// The composer bar. `inner` receives the type-on line.
export const composer = (id, { x, y, w }, inner) => `
      <div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:74px;
           border:1px solid ${T.wire};border-radius:2px;background:${T.card};
           display:flex;align-items:center;padding:0 18px 0 22px;gap:16px">
        <div style="flex:1;overflow:hidden">${inner}</div>
        <div id="${id}-send" style="width:44px;height:44px;border-radius:2px;background:${T.accent};
             color:#fff;display:flex;align-items:center;justify-content:center;flex:none">${I.send}</div>
      </div>`;

// ---- 2 · the image + the mark ---------------------------------------------
// The watermark is drawn, not faked with a text label: a sparkle glyph and a
// wordmark at the corner, at the size and alpha a generator actually stamps.
export const stamp = (id, { right = 18, bottom = 14, scale = 1 } = {}) => `
        <div id="${id}" style="position:absolute;right:${right}px;bottom:${bottom}px;
             display:flex;align-items:center;gap:${(7 * scale).toFixed(0)}px;
             color:rgba(255,255,255,0.92);filter:drop-shadow(0 1px 3px rgba(0,0,0,0.55))">
          <span style="display:flex;transform:scale(${(scale * 0.92).toFixed(2)});transform-origin:right center">${I.star}</span>
          <span style="font-size:${(15 * scale).toFixed(0)}px;font-weight:600;letter-spacing:-0.01em">Gemini</span>
        </div>`;

export const imageBox = (id, { x, y, s, src, radius = 2 }) => `
      <div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:${s}px;height:${s}px;
           border:1px solid ${T.wire};border-radius:${radius}px;overflow:hidden;background:#000">
        <img id="${id}-img" src="${src}" width="${s}" height="${s}"
             style="display:block;width:${s}px;height:${s}px;object-fit:cover"/>
      </div>`;

// ---- 3 · the post ---------------------------------------------------------
// A post card with the real furniture: avatar, handle, relative time, the body,
// the attached image, and a counts row that is deliberately uneven.
export const postCard = (id, { x, y, w, body, img, imgH = 372, counts = null }) => `
      <div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;
           background:${T.panel};border:1px solid ${T.wire};border-radius:2px;padding:24px 26px 18px">
        <div style="display:flex;align-items:center;gap:13px">
          <div style="width:44px;height:44px;border-radius:50%;flex:none;
               background:linear-gradient(140deg,${T.accent},#8B84FF)"></div>
          <div style="line-height:1.25">
            <div style="font-size:16px;font-weight:600;color:${T.snow}">Priya Raman</div>
            <div class="mono" style="font-size:13px;color:${T.mute}">@priyamakes · 2m</div>
          </div>
        </div>
        <div style="margin-top:15px;font-size:18px;line-height:1.45;color:${T.ash}">${body}</div>
        <div id="${id}-media" style="position:relative;margin-top:15px;width:100%;height:${imgH}px;
             border:1px solid ${T.wire};border-radius:2px;overflow:hidden;background:#000">
${img}
        </div>
        <div style="display:flex;align-items:center;gap:56px;margin-top:15px;color:${T.mute};font-size:14px">
          <span style="display:flex;align-items:center;gap:9px">${I.reply}${counts ? counts.reply : '<span class="mono">14</span>'}</span>
          <span style="display:flex;align-items:center;gap:9px">${I.boost}${counts ? counts.boost : '<span class="mono">6</span>'}</span>
          <span style="display:flex;align-items:center;gap:9px">${I.heart}${counts ? counts.heart : '<span class="mono">203</span>'}</span>
        </div>
      </div>`;

// The content-credential badge the platform paints on, and the label it opens.
// This is the film's antagonist, so it gets the one warning hue in the palette
// and nothing else in the film is allowed to use it.
export const crBadge = (id, { right = 14, bottom = 14 }) => `
        <div id="${id}" style="position:absolute;right:${right}px;bottom:${bottom}px;display:flex;
             align-items:center;gap:8px;height:32px;padding:0 12px;border-radius:2px;
             background:rgba(11,15,22,0.86);border:1px solid rgba(232,179,57,0.55);
             color:${T.flag};font-size:13px;font-weight:600;letter-spacing:0.02em">
          <span class="mono" style="font-size:13px;font-weight:700;letter-spacing:0.06em">CR</span>
          <span style="width:1px;height:14px;background:rgba(232,179,57,0.40)"></span>
          <span>AI info</span>
        </div>`;

export const flagRow = (id, { x, y }) => `
      <div id="${id}" style="position:absolute;left:${x}px;top:${y}px;display:flex;align-items:center;gap:10px;
           height:34px;padding:0 13px;border-radius:2px;background:rgba(232,179,57,0.10);
           border:1px solid rgba(232,179,57,0.34);color:${T.flag};font-size:14px">
        <span class="mono" style="font-weight:700;letter-spacing:0.06em;font-size:13px">C2PA</span>
        <span style="color:rgba(232,179,57,0.85)">Made with AI · content credentials found</span>
      </div>`;

// ---- 4 · the product ------------------------------------------------------
// Rebuilt from the live editor's own computed styles: 44px controls, 2px radius,
// Inter 500 at 14px, #E3EAF3 borders and canvas surround, #4940FF on the active
// tool and the primary action. The disabled Remove button is kept because a
// real toolbar has one control that is currently not available.
const tool = (id, icon, label, on) => `
          <div id="${id}" class="btn${on ? " btn-on" : ""}" style="margin-right:8px">
            <span style="display:flex;opacity:${on ? 1 : 0.75}">${icon}</span>${label}</div>`;

export const editor = (id, { x, y, w, h, dims }, plate = "") => {
  const barH = 68, footH = 76;
  const canvasH = h - barH - footH;
  return `
      <div id="${id}" class="win" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px">

        <div style="height:${barH}px;display:flex;align-items:center;padding:0 12px;
                    border-bottom:1px solid ${T.line}">
${tool(`${id}-brush`, I.brush, "Brush", true)}
${tool(`${id}-box`, I.box, "Box", false)}
${tool(`${id}-snip`, I.snip, "Snip", false)}
          <span style="font-size:14px;color:${T.dim};margin:0 14px 0 20px">Size</span>
          <div style="position:relative;width:150px;height:4px;background:${T.line};border-radius:2px">
            <div id="${id}-fill" style="position:absolute;left:0;top:0;height:4px;width:34px;
                 background:${T.accent};border-radius:2px;transform-origin:left center"></div>
            <div id="${id}-knob" style="position:absolute;left:26px;top:-7px;width:18px;height:18px;
                 border-radius:50%;background:${T.accent}"></div>
          </div>
          <span id="${id}-size" class="mono" style="font-size:12px;color:${T.dim};margin-left:14px;width:44px">24px</span>
          <span style="flex:1"></span>
          <div class="btn btn-off" style="width:44px;padding:0;margin-right:8px">${I.undo}</div>
          <div class="btn btn-off" style="width:44px;padding:0;margin-right:8px">${I.redo}</div>
          <div class="btn btn-off" style="width:44px;padding:0;margin-right:14px">${I.erase}</div>
          <div class="btn" style="margin-right:8px"><span style="display:flex;opacity:0.75">${I.image}</span>New image</div>
          <div id="${id}-remove" class="btn" style="background:rgba(73,64,255,0.34);border-color:transparent;color:#fff">
            <span style="display:flex">${I.star}</span>Remove</div>
        </div>

        <div style="position:relative;height:${canvasH}px;background:${T.surround};overflow:hidden">
          <div id="${id}-plate" style="position:absolute;left:50%;top:50%;width:${canvasH}px;height:${canvasH}px;
               margin-left:${-canvasH / 2}px;margin-top:${-canvasH / 2}px;background:#000;overflow:hidden">
${plate}
          </div>
          <div class="mono" style="position:absolute;left:16px;bottom:14px;font-size:14px;color:${T.ink};
               background:${T.paper};border:1px solid ${T.line};border-radius:2px;padding:5px 10px">${dims}</div>
        </div>

        <div style="height:${footH}px;display:flex;align-items:center;padding:0 16px;
                    border-top:1px solid ${T.line}">
          <div id="${id}-dl" class="btn btn-on btn-lg"><span style="display:flex">${I.down}</span>Download</div>
          <span style="flex:1"></span>
          <span style="font-size:14px;color:${T.faint}">Cleaned on your device. A copy is saved to our storage.</span>
        </div>
      </div>`;
};

// The brush stroke the cursor paints. A soft indigo mask at the product's own
// accent — it is the one thing on the white act allowed to be a big colour field,
// because it is CONTENT: it is the selection the model is about to fill.
export const strokeDots = (id, pts, r) =>
  pts.map((p, i) => `
        <div id="${id}${i}" style="position:absolute;left:${p[0] - r}px;top:${p[1] - r}px;
             width:${r * 2}px;height:${r * 2}px;border-radius:50%;background:rgba(73,64,255,0.42);filter:blur(2px);opacity:0"></div>`).join("");

export const strokeRun = (id, n, at, span) =>
  Array.from({ length: n }, (_, i) =>
    `      tl.set("#${id}${i}", { autoAlpha: 1 }, ${(at + (i * span) / n).toFixed(3)});`).join("\n");
