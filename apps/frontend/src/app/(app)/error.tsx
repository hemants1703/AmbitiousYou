"use client"; // Required by Next.js for error boundaries

import { Button } from "@/components/ui/button";
import { LayoutDashboardIcon, RefreshCwIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error(props: ErrorProps) {
  const tryAgainRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    console.error("Application error:", props.error);
    if (tryAgainRef.current) {
      tryAgainRef.current.focus();
    }
  }, [props.error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <main className="w-full max-w-md">
        <div role="alert" aria-live="assertive" className="text-center">
          <h1 className="text-2xl font-semibold">Something went wrong</h1>
          <p className="mt-2 text-sm text-muted-foreground">An unexpected error occurred.</p>
        </div>

        <div className="flex justify-center items-center gap-5 mt-6">
          <Button asChild variant="outline">
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
              <LayoutDashboardIcon className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Link>
          </Button>
          <Button onClick={props.reset} ref={tryAgainRef}>
            <RefreshCwIcon className="mr-2 h-4 w-4" />
            Try again
          </Button>
        </div>
      </main>
    </div>
  );
}
