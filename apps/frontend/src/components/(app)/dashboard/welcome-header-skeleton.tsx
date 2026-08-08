import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircleIcon } from "lucide-react";
import Link from "next/link";
import { LocalTodayLabel } from "./local-today-label";
import { TimeOfDayGreeting } from "./time-of-day-greeting";

/**
 * Welcome header shell for loading states. Date, greeting word, and New ambition
 * CTA are real; name and momentum line wait on the API.
 * No prefetch on create — Partial Prefetching owns shared shells (AGENTS.md).
 */
export function WelcomeHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0 space-y-1.5">
        <p className="min-h-5 text-sm text-muted-foreground">
          <LocalTodayLabel />
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">
          <TimeOfDayGreeting />, <Skeleton className="inline-block h-[1em] w-28 align-[-0.15em]" />
        </h1>
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>

      <div className="flex w-full shrink-0 gap-2 sm:w-auto">
        <Button asChild className="min-w-0 flex-1 sm:w-auto sm:flex-none">
          <Link href="/ambitions/create">
            <PlusCircleIcon className="size-4" />
            New ambition
          </Link>
        </Button>
      </div>
    </div>
  );
}
