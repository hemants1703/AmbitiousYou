"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LayoutDashboardIcon, RefreshCwIcon, RouteIcon, TargetIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

const RECOVERY_LINES = [
  "Every great achievement begins with a small setback.",
  "Progress isn't about perfection — it's about persistence.",
  "Even the best stumble. What matters is getting back up.",
  "Your ambitions are still waiting for you. Let's continue!",
] as const;

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

interface ErrorFallbackProps {
  error: Error & { digest?: string };
  reset: () => void;
  /** Full viewport centering for root-level boundaries; inset fits inside the app shell. */
  layout?: "full" | "inset";
}

export function ErrorFallback(props: ErrorFallbackProps) {
  const layout = props.layout ?? "full";
  const tryAgainRef = useRef<HTMLButtonElement>(null);
  const recoveryLine = RECOVERY_LINES[hashString(props.error?.message ?? "") % RECOVERY_LINES.length];

  useEffect(() => {
    console.error("Application error:", props.error);
    tryAgainRef.current?.focus();
  }, [props.error]);

  return (
    <div
      className={cn(
        layout === "full"
          ? "flex min-h-[calc(100svh-env(safe-area-inset-bottom))] items-center justify-center px-4 py-8 md:px-6"
          : "flex w-full justify-center py-10 md:py-14",
      )}>
      <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-safe:fill-mode-both w-full max-w-lg">
        <Card className="relative overflow-hidden border-border/60 bg-card/80 shadow-elevated backdrop-blur-sm">
          {/* Momentum arc — setback as a bend in the path, not a dead end */}
          <svg aria-hidden="true" className="pointer-events-none absolute inset-x-8 top-0 h-8 text-accent-brand/25" viewBox="0 0 400 32" fill="none" preserveAspectRatio="none">
            <path d="M0 28 Q200 4 400 28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </svg>

          <CardHeader className="space-y-5 pt-10 text-center">
            <span className="mx-auto flex size-14 items-center justify-center rounded-4xl bg-accent-brand/10 text-accent-brand" aria-hidden="true">
              <RouteIcon className="size-7" strokeWidth={1.75} />
            </span>

            <div className="space-y-2" role="alert" aria-live="assertive">
              <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Recovery</p>
              <h1 className="text-2xl font-bold tracking-tight text-balance md:text-3xl">This page hit a snag</h1>
              <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
                Something unexpected stopped this view from loading. Your ambitions are still here — try again or pick a route you know works.
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 px-6">
            <blockquote className="rounded-3xl border border-accent-brand/20 bg-accent-brand/5 px-4 py-3.5 text-left text-sm leading-relaxed text-foreground/90 md:text-base">
              <p className="text-pretty">{recoveryLine}</p>
            </blockquote>

            {process.env.NODE_ENV === "development" && props.error.message ? (
              <details className="group text-left">
                <summary className="cursor-pointer select-none py-1 text-xs text-muted-foreground transition-colors hover:text-foreground">
                  <span className="group-open:hidden">Show technical details (dev only)</span>
                  <span className="hidden group-open:inline">Hide technical details</span>
                </summary>
                <div className="mt-2 overflow-hidden rounded-2xl border border-border/60 bg-muted/40 p-3">
                  <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-muted-foreground">{props.error.message}</pre>
                  {props.error.digest ? <p className="mt-2 font-mono text-[0.65rem] text-muted-foreground">Digest: {props.error.digest}</p> : null}
                </div>
              </details>
            ) : null}
          </CardContent>

          <CardFooter className="flex flex-col gap-2.5 px-6 pb-8 pt-2">
            <Button ref={tryAgainRef} onClick={props.reset} size="lg" className="w-full">
              <RefreshCwIcon aria-hidden="true" />
              Try again
            </Button>

            <div className="grid w-full grid-cols-1 gap-2.5 sm:grid-cols-2">
              <Button asChild variant="outline" size="lg" className="w-full">
                <Link prefetch href="/dashboard">
                  <LayoutDashboardIcon aria-hidden="true" />
                  Dashboard
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full">
                <Link prefetch href="/ambitions">
                  <TargetIcon aria-hidden="true" />
                  Your ambitions
                </Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
