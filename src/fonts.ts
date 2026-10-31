// Author: Bishakh
// Loaded at module scope so @remotion/google-fonts can delayRender() until the
// webfonts are ready — otherwise the first frames render in a fallback face.
import { loadFont as loadSans } from "@remotion/google-fonts/Inter";
import { loadFont as loadHead } from "@remotion/google-fonts/Poppins";
import { loadFont as loadSerif } from "@remotion/google-fonts/InstrumentSerif";
// Uber Move / Uber Move Text are proprietary and cannot be licensed or embedded.
// Inter Tight is the closest available substitute: a NEO-GROTESQUE with the same
// tall x-height, tight spacing and flat terminals. Plus Jakarta Sans (the
// previous stand-in) is geometric-humanist and reads noticeably rounder and
// friendlier than Uber's actual voice. Used for EP09; the series face is Poppins.
import { loadFont as loadUber } from "@remotion/google-fonts/InterTight";
// EP11 display + technical face. Chosen by rendering a specimen against IBM Plex
// Sans, Space Grotesk and the series Poppins, not by reputation — the comparison
// is in the commit that added this line.
//
// Two reasons it wins for an episode about memory management:
//  1. It was drawn for developer tooling, so it carries the register of the
//     thing being explained rather than a register borrowed from marketing.
//     Plex reads institutional (documentation, not film) and Space Grotesk has
//     enough personality to compete with the arithmetic it is setting.
//  2. The sans and the mono are ONE family with shared metrics. This episode
//     puts a headline directly against a figure on almost every beat, and a
//     mismatched pair shows up exactly there — Poppins (geometric) beside
//     JetBrains (humanist mono) visibly disagrees on the specimen.
import { loadFont as loadGeist } from "@remotion/google-fonts/Geist";
import { loadFont as loadGeistMono } from "@remotion/google-fonts/GeistMono";
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
/**
 * Code, terminals, file paths, model ids, every figure — the register the
 * audience trusts. GEIST MONO, series-wide.
 *
 * Was JetBrains Mono. Replaced because the kit constantly sets a headline
 * directly against a figure, and a mono from a different family disagrees with
 * the display face exactly there — visible on the type specimen, not a theory.
 * Geist Mono shares its metrics with Geist and sits cleanly under Poppins too.
 */
export const MONO = loadGeistMono("normal", { weights: ["400", "500", "700"] }).fontFamily;
/** EP09 display face — the legal stand-in for Uber Move. */
export const UBER = loadUber("normal", { weights: ["500", "700", "800"] }).fontFamily;

/** EP11 display face. Set at -0.04em, weight 700 — Geist is already tight, so
 * the house -0.05em over-closes it. */
export const GEIST = loadGeist("normal", { weights: ["500", "700", "900"] }).fontFamily;
/** Alias kept so EP11 scenes can name the pair explicitly. Same font as MONO. */
export const GEIST_MONO = MONO;
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

/**
 * EP17 display face — SF Pro, the macOS system UI font, loaded from the OS
 * itself (`/System/Library/Fonts/SFNS.ttf`, staged into public/fonts).
 *
 * VectorDrop's DESIGN.md declares its body stack as
 * `var(--font-geist-sans, -apple-system, BlinkMacSystemFont, "SF Pro Text", …)`
 * and then says the honest substitute for Geist is "the system UI font, not
 * Helvetica Neue specifically" — so this is that stack's real first fallback,
 * not a lookalike picked by eye. `-apple-system` and `BlinkMacSystemFont` are
 * CSS keywords rather than files; SFNS.ttf is the actual face they resolve to.
 *
 * It is a VARIABLE font, so it is declared across the whole 100–900 axis in one
 * @font-face. Declaring a single weight would leave the renderer synthesising
 * faux-bold for every headline, which on a display face is visible immediately —
 * smeared stems and no change in letterfit.
 */
export const SFPRO = "SF Pro Local";
Promise.all([
  loadLocal({
    family: SFPRO,
    url: staticFile("fonts/SFNS.ttf"),
    format: "truetype",
    weight: "100 900",
  }),
]);

/**
 * EP19 display + body face — the whole film, every text role.
 *
 * FerrariSans is licensed and cannot be embedded. The design extract names its
 * own substitute explicitly: "Inter at weight 500 with letter-spacing -1%", so
 * this is the brand's documented stand-in rather than one picked by eye. It is
 * the same family `SANS` already loads; declared separately with explicit
 * weights because this system uses exactly four (400 body, 500 display, 600
 * uppercase captions, 700 buttons and number-display) and a missing 500 would
 * leave the renderer synthesising it — visible instantly at 116px.
 *
 * The rule that goes with it: DISPLAY WEIGHT STAYS AT 500. Never bold. The
 * house headline register (Poppins ExtraBold at -0.05em) is a different brand.
 */
export const FERRARI = loadSans("normal", { weights: ["400", "500", "600", "700"] }).fontFamily;

/** One italic accent word per title card, never more. */
export const SERIF = loadSerif("normal", { weights: ["400"] }).fontFamily;
