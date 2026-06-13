import { Button } from "@/components/ui/button";
import type { Ambition, User } from "@ambitiousyou/shared/types";
import { PlusCircleIcon } from "lucide-react";
import Link from "next/link";
import { QuickAdd } from "./quick-add";
import { TimeOfDayGreeting } from "./time-of-day-greeting";

interface WelcomeHeaderProps {
  user: User;
  ambitions: Ambition[];
}

function buildMomentumLine(input: { activeCount: number; completedCount: number; averageProgress: number }): string {
  if (input.activeCount === 0) {
    if (input.completedCount > 0) {
      return `${input.completedCount} ambition${input.completedCount === 1 ? "" : "s"} complete. Ready to set your next one?`;
    }
    return "No active ambitions yet — set one and let's build some momentum.";
  }

  if (input.averageProgress >= 80) return "You're in the home stretch — a little more and these are done.";
  if (input.averageProgress >= 50) return "Strong momentum. You're over halfway across your active ambitions.";
  if (input.averageProgress >= 20) return "You've broken ground. Keep showing up and it compounds.";
  return "A fresh start. Pick one small step and let today's momentum build.";
}

export function WelcomeHeader(props: WelcomeHeaderProps) {
  const firstName = props.user.name.trim().split(/\s+/)[0] || props.user.name;

  const active = props.ambitions.filter((ambition) => ambition.ambitionStatus === "active");
  const completed = props.ambitions.filter((ambition) => ambition.ambitionStatus === "completed");
  const averageProgress = active.length > 0 ? Math.round(active.reduce((sum, ambition) => sum + (ambition.ambitionPercentageCompleted ?? 0), 0) / active.length) : 0;

  const momentumLine = buildMomentumLine({ activeCount: active.length, completedCount: completed.length, averageProgress });
  const todayLabel = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(new Date());

  // Trimmed, serialisable shape for the client Quick add popover (active ambitions only).
  const quickAddAmbitions = active.map((ambition) => ({
    id: ambition.id,
    name: ambition.ambitionName,
    startDate: new Date(ambition.ambitionStartDate).toISOString(),
    endDate: new Date(ambition.ambitionEndDate).toISOString(),
  }));

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0 space-y-1.5">
        <p className="text-sm text-muted-foreground">{todayLabel}</p>
        <h1 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">
          <TimeOfDayGreeting />,{" "}
          <span translate="no">{firstName}</span>
        </h1>
        <p className="max-w-2xl text-balance text-muted-foreground">{momentumLine}</p>
      </div>

      <div className="flex w-full shrink-0 gap-2 sm:w-auto">
        {quickAddAmbitions.length > 0 ? <QuickAdd ambitions={quickAddAmbitions} /> : null}
        <Button asChild className="w-full sm:w-auto">
          <Link href="/ambitions/create" prefetch>
            <PlusCircleIcon className="size-4" />
            New ambition
          </Link>
        </Button>
      </div>
    </div>
  );
}
