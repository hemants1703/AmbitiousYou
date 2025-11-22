import { MotionWrapper } from "@/components/MotionWrapper";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IconCirclePlus } from "@tabler/icons-react";
import clsx from "clsx";
import { Bricolage_Grotesque } from "next/font/google";
import { memo } from "react";
import StarfieldBackground from "./StarfieldBackground";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
});

const CATCHY_GREETINGS = [
  "Howdy",
  "Let's Do It",
  "Time to Shine",
  "Let's Crush It",
  "Ready to Conquer",
  "Let's Make Magic",
  "Bring It On",
  "Game On",
  "Rise & Grind",
  "You Got This",
  "Let's Go",
  "Make It Happen",
  "Own The Day",
  "Seize The Moment",
  "Chase Greatness",
] as const;

interface WelcomeBannerProps {
  name: string;
}

function WelcomeBanner({ name }: WelcomeBannerProps) {
  // Extract first name - simple string operation, no memoization needed
  const firstName = name.trim().split(" ")[0] || name.trim();

  // Select a random catchy greeting (SSR - will be consistent on initial render)
  const randomIndex = Math.floor(Math.random() * CATCHY_GREETINGS.length);
  const greeting = CATCHY_GREETINGS[randomIndex];
  const fullGreeting = `${greeting} ${firstName}`;

  return (
    <MotionWrapper
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={clsx(
        "rounded-2xl relative overflow-hidden mb-2",
        "border-2 border-ay-light/20 dark:border-ay-dark/30",
        "bg-linear-to-br from-card/95 via-card/90 to-card/95",
        "shadow-2xl shadow-ay-light/10 dark:shadow-ay-dark/20",
        "backdrop-blur-md",
        "p-6 sm:p-8"
      )}
      role="banner"
      aria-label="Welcome banner"
    >
      {/* Animated Starfield Background */}
      <StarfieldBackground />

      {/* Subtle overlay gradient for depth */}
      <div
        className={clsx(
          "absolute inset-0 pointer-events-none",
          "bg-linear-to-tr",
          "from-ay-light/5 via-transparent to-ay-dark/5",
          "dark:from-ay-dark/10 dark:via-transparent dark:to-ay-light/10"
        )}
        aria-hidden="true"
      />

      {/* Content Container */}
      <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
        {/* Greeting Section */}
        <header className="flex-1 min-w-0">
          <h1
            className={clsx(
              "text-3xl sm:text-4xl md:text-5xl",
              "font-extrabold tracking-tight",
              "mb-2",
              bricolage.className
            )}
            aria-label={fullGreeting}
          >
            {greeting}{" "}
            <span
              className={clsx(
                // High contrast gradient for light mode, stylized for dark mode
                "bg-linear-to-r",
                "from-[#0056b3] via-[#0090ff] to-[#00bcd4]",
                "dark:from-ay-light dark:via-ay-dark dark:to-ay-light",
                "bg-clip-text text-transparent",
                "inline-block",
                // Enhanced shadows for light mode visibility
                "drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]",
                "dark:drop-shadow-[0_1px_3px_rgba(3,255,255,0.4)]",
                // Text stroke for better readability in light mode
                "[text-shadow:1px_1px_0_rgba(0,0,0,0.1),-1px_-1px_0_rgba(0,0,0,0.1),1px_-1px_0_rgba(0,0,0,0.1),-1px_1px_0_rgba(0,0,0,0.1)]",
                "dark:[text-shadow:0_0_20px_rgba(3,255,255,0.5),0_0_40px_rgba(3,255,255,0.3)]"
              )}
              aria-hidden="true"
            >
              {firstName}
            </span>
            ,
          </h1>
          <p
            className={clsx(
              "text-base sm:text-lg",
              "text-muted-foreground font-medium",
              "drop-shadow-sm",
              "leading-relaxed"
            )}
          >
            Here&apos;s your progress at a glance.
          </p>
        </header>

        {/* CTA Button */}
        <div className="shrink-0">
          <Button
            asChild
            variant="ay"
            size="lg"
            className={clsx(
              "text-base sm:text-lg",
              "h-11 sm:h-12",
              "px-6 sm:px-8",
              "shadow-lg shadow-primary/20",
              "hover:shadow-xl hover:shadow-primary/30",
              "transition-all duration-300 ease-out",
              "focus-visible:ring-2 focus-visible:ring-ay-light dark:focus-visible:ring-ay-dark",
              "focus-visible:ring-offset-2",
              "active:scale-95"
            )}
          >
            <Link
              prefetch={true}
              href="/ambitions/new?ref=dashboard"
              aria-label="Create a new ambition"
            >
              <IconCirclePlus className="h-5 w-5" aria-hidden="true" />
              <span>New Ambition</span>
            </Link>
          </Button>
        </div>
      </div>
    </MotionWrapper>
  );
}

// ============================================================================
// MEMOIZED EXPORT
// ============================================================================

export default memo(WelcomeBanner);
