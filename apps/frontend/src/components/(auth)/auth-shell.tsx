import AmbitiousYouLogo from "@/components/(landing)/ambitiousyou-logo";
import { bricolage } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";
import Link from "next/link";
import "@/styles/auth-background.css";

interface AuthShellProps {
  mood: "midnight" | "dawn";
  tagline: string;
  vignette?: "stats" | "moves";
  children: React.ReactNode;
}

/** Translucent mini stat card for the login panel. */
function StatsVignette() {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-4 shadow-elevated backdrop-blur-md">
      <p className="text-xs font-medium uppercase tracking-wide text-white/60">Active ambitions</p>
      <p className="mt-1 text-3xl font-semibold tabular-nums text-white">3</p>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/15">
        <div className="h-full w-[64%] rounded-full bg-white/80" />
      </div>
      <p className="mt-2 text-xs tabular-nums text-white/60">64% average progress</p>
    </div>
  );
}

/** Translucent mini checklist card for the signup panel. */
function MovesVignette() {
  const moves = ["Declare your ambition", "Add your first moves", "Prove you're serious"];

  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-4 shadow-elevated backdrop-blur-md">
      <p className="text-xs font-medium uppercase tracking-wide text-white/60">Your initiation</p>
      <ul className="mt-3 space-y-2">
        {moves.map((label, i) => (
          <li key={label} className="flex items-center gap-2.5 text-sm text-white/85">
            <span className={cn("flex size-5 shrink-0 items-center justify-center rounded-md border", i === 0 ? "border-white/80 bg-white/80" : "border-white/30")}>{i === 0 ? <CheckIcon className="size-3.5 text-black/80" /> : null}</span>
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Shared split-screen shell for every (auth) page. Left column holds the form;
 * the right panel carries the mood aurora (login/forgot/reset = midnight,
 * signup/verify = dawn) with a brand tagline and an optional product vignette.
 */
export default function AuthShell(props: AuthShellProps) {
  return (
    <div className={cn("grid min-h-svh lg:grid-cols-2", bricolage.variable)}>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:border focus:border-border focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-md">
        Skip to content
      </a>

      <div className="auth-wash relative flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <AmbitiousYouLogo />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <main id="main-content" className="w-full max-w-sm">
            {props.children}
          </main>
        </div>
        <p className="text-center text-xs text-muted-foreground">Private by default · Free to use</p>
      </div>

      <div aria-hidden="true" className={cn("auth-background relative hidden flex-col justify-end p-10 lg:flex", props.mood === "midnight" ? "auth-background-login" : "auth-background-signup")}>
        <div className="relative z-10 max-w-sm space-y-6">
          {props.vignette === "stats" ? <StatsVignette /> : null}
          {props.vignette === "moves" ? <MovesVignette /> : null}
          <p translate="no" className="font-brand text-3xl font-semibold leading-snug tracking-[-0.02em] text-balance text-white/95">{props.tagline}</p>
        </div>
      </div>
    </div>
  );
}
