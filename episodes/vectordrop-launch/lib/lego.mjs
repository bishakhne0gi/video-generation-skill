// The brand's LEGO motif, ported from the product rather than approximated.
//
// It earns its place here rather than being decoration: a traced vector IS a
// stack of flat colour pieces — 31 of them for this image — laid darkest to
// lightest. The film already says that out loud, so the studs are the argument
// made visible.

// .lego-base / .lego-studs / .lego-vignette, transcribed from app/globals.css.
// Three layered radial gradients on a 30px grid: the lit top of the stud, its
// body, and the dark ring that separates it from its neighbour.
export const LEGO_CSS = `
.lego-base{background-color:#1a1c22}
/* The studs read as a dot screen at film scale, so the plate uses the OTHER
   half of the motif: the bricks themselves, in running bond, staggered course
   to course. Boxes, not dots — and far quieter at the same opacity. */
.lego-studs{
  background-image:url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22120%22%20height%3D%2260%22%20viewBox%3D%220%200%20120%2060%22%3E%3Cg%20fill%3D%22none%22%20stroke%3D%22%23ffffff%22%20stroke-width%3D%221%22%20opacity%3D%220.5%22%3E%3Crect%20x%3D%220.5%22%20y%3D%220.5%22%20width%3D%2259%22%20height%3D%2229%22%20rx%3D%223%22%2F%3E%3Crect%20x%3D%2260.5%22%20y%3D%220.5%22%20width%3D%2259%22%20height%3D%2229%22%20rx%3D%223%22%2F%3E%3Crect%20x%3D%22-29.5%22%20y%3D%2230.5%22%20width%3D%2259%22%20height%3D%2229%22%20rx%3D%223%22%2F%3E%3Crect%20x%3D%2230.5%22%20y%3D%2230.5%22%20width%3D%2259%22%20height%3D%2229%22%20rx%3D%223%22%2F%3E%3Crect%20x%3D%2290.5%22%20y%3D%2230.5%22%20width%3D%2259%22%20height%3D%2229%22%20rx%3D%223%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E");
  background-size:120px 60px}
.lego-vignette{
  background:
    linear-gradient(to bottom, transparent 55%, rgba(26,28,34,0.6) 75%, #1a1c22 90%, #161516 100%),
    radial-gradient(ellipse 100% 100% at 50% 50%, transparent 50%, rgba(0,0,0,0.3) 100%)}
`;

// The hero plate: a studded band across the top that fades into the film's own
// ground, which is exactly how the product's landing page wears it.
export const legoPlate = (id, opt = {}) => `
    <div id="${id}" style="position:absolute;left:0;right:0;top:0;height:${opt.h ?? 640}px;
         opacity:${opt.o ?? 0.30};pointer-events:none">
      <div class="lego-base" style="position:absolute;inset:0"></div>
      <div id="${id}-studs" class="lego-studs" style="position:absolute;left:-60px;right:-60px;top:-60px;bottom:-60px"></div>
      <div class="lego-vignette" style="position:absolute;inset:0"></div>
    </div>`;

// LegoStud, ported 1:1 from components/shared/LegoStud.tsx — a 1x1 plate with a
// raised stud, shaded with edge highlights and a recessed centre.
export const stud = (color, size = 18, id = "") => {
  const c = size / 2, r = size * 0.30;
  const n = (v) => +v.toFixed(3);
  return `<svg ${id ? `id="${id}" ` : ""}width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="display:block;flex-shrink:0">
    <rect width="${size}" height="${size}" fill="${color}"/>
    <rect x="${n(size - size * 0.09)}" y="0" width="${n(size * 0.09)}" height="${size}" fill="rgba(0,0,0,0.38)"/>
    <rect x="0" y="${n(size - size * 0.09)}" width="${size}" height="${n(size * 0.09)}" fill="rgba(0,0,0,0.32)"/>
    <rect x="0" y="0" width="${size}" height="${n(size * 0.07)}" fill="rgba(255,255,255,0.14)"/>
    <rect x="0" y="0" width="${n(size * 0.07)}" height="${size}" fill="rgba(255,255,255,0.10)"/>
    <circle cx="${n(c)}" cy="${n(c + r * 0.38)}" r="${n(r + size * 0.06)}" fill="rgba(0,0,0,0.45)"/>
    <circle cx="${n(c)}" cy="${n(c)}" r="${n(r + size * 0.04)}" fill="rgba(0,0,0,0.30)"/>
    <circle cx="${n(c)}" cy="${n(c)}" r="${n(r)}" fill="${color}"/>
    <circle cx="${n(c)}" cy="${n(c - r * 0.08)}" r="${n(r * 0.82)}" fill="rgba(255,255,255,0.18)"/>
    <circle cx="${n(c)}" cy="${n(c)}" r="${n(r * 0.60)}" fill="rgba(0,0,0,0.18)"/>
    <circle cx="${n(c)}" cy="${n(c)}" r="${n(r * 0.44)}" fill="rgba(0,0,0,0.26)"/>
    <circle cx="${n(c)}" cy="${n(c)}" r="${n(r * 0.30)}" fill="rgba(255,255,255,0.06)"/>
    <path d="M ${n(c - r * 0.42)} ${n(c - r * 0.52)} A ${n(r * 0.58)} ${n(r * 0.58)} 0 0 1 ${n(c + r * 0.42)} ${n(c - r * 0.52)}"
      stroke="rgba(255,255,255,0.28)" stroke-width="${n(size * 0.045)}" fill="none" stroke-linecap="round"/>
  </svg>`;
};
