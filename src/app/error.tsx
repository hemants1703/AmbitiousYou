"use client"; // Required by Next.js for error boundaries

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { IconAlertCircle, IconHome, IconRefresh, IconSparkles } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// Server-side message selection (runs once at build/render)
const calmingMessages = [
  "Every great achievement begins with a small setback.",
  "Progress isn't about perfection, it's about persistence.",
  "Even the best stumble—what matters is getting back up.",
  "Your ambitions are still waiting for you. Let's continue!",
];

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error for debugging
    console.error("Application error:", error);
  }, [error]);

  // Select message at render time (not random per re-render)
  const message = calmingMessages[Math.floor(Math.random() * calmingMessages.length)];

  return (
    <div className="flex min-h-[85vh] items-center justify-center p-4 md:p-6">
      <div className="w-full flex justify-center animate-in fade-in duration-500 slide-in-from-bottom-4">
        <Card className="w-full max-w-xl shadow-2xl border border-border/50 bg-card/95 backdrop-blur-sm relative overflow-hidden">
          {/* Gradient accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-[#64ccc5] via-[#176b87] to-[#64ccc5] opacity-80" />

          <CardHeader className="space-y-6 pt-10 pb-4 px-6 md:px-8">
            <div className="flex justify-center">
              <div className="relative animate-in zoom-in duration-300 delay-150">
                <div className="relative p-4 rounded-full bg-[#176b87]/10">
                  <IconAlertCircle className="h-16 w-16 text-[#176b87]" strokeWidth={1.5} />
                  <IconSparkles
                    className="h-6 w-6 text-[#64ccc5] absolute -top-1 -right-1 animate-pulse"
                    strokeWidth={2}
                  />
                </div>
              </div>
            </div>
            <div className="text-center space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Oops! A Small Bump</h1>
              <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed max-w-md mx-auto">
                Something unexpected happened, but don&apos;t worry—it&apos;s just a temporary
                setback.
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-5 px-6 md:px-8 pb-2">
            {/* Motivational message */}
            <div className="relative animate-in fade-in duration-500 delay-300">
              <div className="absolute inset-0 bg-linear-to-r from-[#64ccc5]/5 via-[#64ccc5]/10 to-[#64ccc5]/5 rounded-xl blur-xl" />
              <div className="relative bg-card/80 border border-[#64ccc5]/30 rounded-xl p-5 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <IconSparkles
                    className="h-5 w-5 text-[#64ccc5] shrink-0 mt-0.5"
                    strokeWidth={2}
                  />
                  <p className="text-sm md:text-base italic text-foreground/90 leading-relaxed">
                    {message}
                  </p>
                </div>
              </div>
            </div>

            {/* Dev error details */}
            {process.env.NODE_ENV === "development" && error.message && (
              <details className="group text-left">
                <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors py-2 select-none">
                  <span className="group-open:hidden">Show technical details (dev only)</span>
                  <span className="hidden group-open:inline">Hide technical details</span>
                </summary>
                <div className="mt-2 p-4 bg-muted/50 border border-border/50 rounded-lg overflow-hidden">
                  <pre className="text-xs overflow-x-auto text-muted-foreground font-mono leading-relaxed">
                    {error.message}
                  </pre>
                </div>
              </details>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-3 px-6 md:px-8 pb-8 pt-6">
            {/* Primary action */}
            <Button
              onClick={reset}
              size="lg"
              className="w-full bg-[#176b87] hover:bg-[#176b87]/90 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
            >
              <IconRefresh className="mr-2 h-4 w-4" />
              Try Again
            </Button>

            {/* Secondary actions */}
            <div className="flex flex-col sm:flex-row gap-2.5 w-full">
              <Button
                asChild
                variant="outline"
                size="lg"
                className="flex-1 border-border/50 hover:bg-[#64ccc5]/10 hover:border-[#64ccc5]/40 transition-all duration-200"
              >
                <Link href="/dashboard">
                  <IconHome className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="flex-1 border-border/50 hover:bg-[#64ccc5]/10 hover:border-[#64ccc5]/40 transition-all duration-200"
              >
                <Link href="/ambitions">Your Ambitions</Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
