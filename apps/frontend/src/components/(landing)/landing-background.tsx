/**
 * Premium ambient background for the landing surface. Static and GPU-light:
 * an overlapping multi-hue aurora with a bright top "light source", a soft
 * lower glow for depth, fine film grain to kill banding, and a vignette.
 * Hues are harmonised around the indigo brand; intensity is dialled per theme
 * so dark mode glows richly and light mode stays soft.
 */

// Harmonised aurora hues around the indigo --primary.
const INDIGO = "oklch(0.55 0.22 266)";
const VIOLET = "oklch(0.56 0.24 300)";
const SKY = "oklch(0.62 0.17 235)";

export default function LandingBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden bg-background">
      {/* Subtle top tint so the canvas lifts toward the hero and falls to pure background */}
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(to bottom, color-mix(in oklch, ${VIOLET} 9%, transparent), transparent 38%)` }}
      />

      {/* Aurora — three large, overlapping, soft glows that blend into one smooth colour field at the top */}
      <div
        className="absolute inset-0 opacity-35 dark:opacity-100"
        style={{
          background: `
            radial-gradient(42rem 30rem at 50% -12%, color-mix(in oklch, ${VIOLET} 52%, transparent) 0%, transparent 72%),
            radial-gradient(40rem 32rem at 8% -10%, color-mix(in oklch, ${SKY} 42%, transparent) 0%, transparent 68%),
            radial-gradient(40rem 32rem at 92% -6%, color-mix(in oklch, ${INDIGO} 48%, transparent) 0%, transparent 68%)
          `,
        }}
      />

      {/* Bright light source — the spotlight core at top centre */}
      <div
        className="absolute inset-x-0 -top-10 h-72 opacity-40 dark:opacity-90"
        style={{ background: `radial-gradient(26rem 13rem at 50% 0%, color-mix(in oklch, ${VIOLET} 55%, white 22%) 0%, transparent 70%)` }}
      />

      {/* Lower depth glow — keeps long scrolls from going flat */}
      <div
        className="absolute -bottom-48 left-1/2 h-[34rem] w-[64rem] -translate-x-1/2 opacity-25 dark:opacity-50"
        style={{ background: `radial-gradient(closest-side, color-mix(in oklch, ${INDIGO} 26%, transparent) 0%, transparent 100%)` }}
      />

      {/* Film grain — tactile finish, removes gradient banding */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.045] mix-blend-soft-light dark:opacity-[0.08]" width="100%" height="100%">
        <filter id="landing-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#landing-grain)" />
      </svg>

      {/* Vignette — quietly focuses attention toward the centre column */}
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(ellipse 95% 85% at 50% 28%, transparent 55%, color-mix(in oklch, var(--background) 78%, transparent) 100%)` }}
      />
    </div>
  );
}
