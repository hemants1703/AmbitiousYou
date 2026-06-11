import { Bricolage_Grotesque } from "next/font/google";

/**
 * Single brand-font instantiation for the pre-auth surface (landing + auth).
 * Exposed as a CSS variable so route-group layouts can opt in via
 * `bricolage.variable` without loading the font for the logged-in app.
 * The `font-brand` Tailwind utility maps to this variable (see globals.css).
 */
export const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bricolage",
  display: "swap",
});
