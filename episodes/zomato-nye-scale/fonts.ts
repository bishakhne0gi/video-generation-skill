// Author: Bishakh
// Loaded at module scope so @remotion/google-fonts can delayRender() until the
// webfonts are ready — otherwise the first frames render in a fallback face.
import { loadFont as loadSans } from "@remotion/google-fonts/Inter";
import { loadFont as loadHead } from "@remotion/google-fonts/Poppins";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadSerif } from "@remotion/google-fonts/InstrumentSerif";
// Uber Move / Uber Move Text are proprietary and cannot be licensed or embedded.
// Inter Tight is the closest available substitute: a NEO-GROTESQUE with the same
// tall x-height, tight spacing and flat terminals. Plus Jakarta Sans (the
// previous stand-in) is geometric-humanist and reads noticeably rounder and
// friendlier than Uber's actual voice. Used for EP09; the series face is Poppins.
import { loadFont as loadUber } from "@remotion/google-fonts/InterTight";
// EP10 display face. Zomato's "Okra" is not a lookalike problem: Okra IS a
// modified Metropolis, and Metropolis is open-source, so this is the genuine
// base of their typeface rather than a substitute chosen by eye. Loaded from
// public/fonts/ via @remotion/fonts (@fontsource/metropolis ships the woff2).
import { loadFont as loadLocal } from "@remotion/fonts";
import { staticFile } from "remotion";

/** Body / UI copy. */
export const SANS = loadSans().fontFamily;
/** Headlines. Always set at letter-spacing -0.05em, weight 800 — the house voice. */
export const HEAD = loadHead("normal", { weights: ["600", "700", "800"] }).fontFamily;
/** Code, terminals, file paths, model ids — the register the audience trusts. */
export const MONO = loadMono("normal", { weights: ["400", "500", "700"] }).fontFamily;
/** EP09 display face — the legal stand-in for Uber Move. */
export const UBER = loadUber("normal", { weights: ["500", "700", "800"] }).fontFamily;

/** EP10 display face — Metropolis, the open-source base of Zomato's Okra. */
export const ZOMATO = "Metropolis";
// Module scope, and the promise is intentionally floated the same way the
// google-fonts loaders are: @remotion/fonts holds a delayRender() until every
// weight is ready, so no frame renders in a fallback face.
Promise.all(
  (["500", "700", "800", "900"] as const).map((weight) =>
    loadLocal({
      family: ZOMATO,
      url: staticFile(`fonts/Metropolis-${weight}.woff2`),
      format: "woff2",
      weight,
    }),
  ),
);

/** One italic accent word per title card, never more. */
export const SERIF = loadSerif("normal", { weights: ["400"] }).fontFamily;
