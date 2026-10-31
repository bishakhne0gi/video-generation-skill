// Third-party marks, drawn as paths rather than fetched, so nothing 404s at
// render time and each one stays crisp at any size. Used nominatively — to say
// "this file opens there" — which is what a compatibility row is for.

export const figma = (s = 56) => `<svg viewBox="0 0 38 57" width="${(s * 38 / 57).toFixed(1)}" height="${s}" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1ABCFE"/>
      <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0ACF83"/>
      <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#FF7262"/>
      <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#F24E1E"/>
      <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#A259FF"/>
    </svg>`;

// Adobe Illustrator's Ai tile — deep brown ground, amber lettering.
export const illustrator = (s = 56) => `<svg viewBox="0 0 56 56" width="${s}" height="${s}" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="54" height="54" rx="12" fill="#2B0A00" stroke="#FF9A00" stroke-width="2"/>
      <text x="28" y="38" text-anchor="middle" font-family="Geist,-apple-system,sans-serif"
        font-size="27" font-weight="600" fill="#FF9A00" letter-spacing="-0.5">Ai</text>
    </svg>`;

// The React atom. The orbits get spun by the timeline — the one mark here that
// has a canonical motion of its own.
export const react = (s = 56, id = "rx") => `<svg viewBox="-24 -24 48 48" width="${s}" height="${s}" xmlns="http://www.w3.org/2000/svg">
      <circle r="4.1" fill="#61DAFB"/>
      <g id="${id}-orbits" fill="none" stroke="#61DAFB" stroke-width="1.9">
        <ellipse rx="21" ry="8"/>
        <ellipse rx="21" ry="8" transform="rotate(60)"/>
        <ellipse rx="21" ry="8" transform="rotate(120)"/>
      </g>
    </svg>`;
