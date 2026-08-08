import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { GaugeIcon, TargetIcon, TriangleAlertIcon, TrophyIcon } from "lucide-react";

/** Stat grid with real labels/icons — only values and helpers skeletonize. */
export function DashboardStatsSkeleton() {
  const cards = [
    { label: "Active", icon: <TargetIcon className="size-5" /> },
    { label: "Avg progress", icon: <GaugeIcon className="size-5" /> },
    { label: "Completed", icon: <TrophyIcon className="size-5" /> },
    { label: "Needs attention", icon: <TriangleAlertIcon className="size-5" /> },
  ] as const;

  return (
    <div className="grid grid-cols-2 items-stretch gap-4 sm:grid-cols-4" aria-hidden="true">
      {cards.map((card) => (
        <Card key={card.label} size="sm" className="h-full gap-3">
          <div className="flex items-start justify-between gap-3 px-4">
            <div className="min-w-0 space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{card.label}</p>
              <Skeleton className="h-8 w-12" />
            </div>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-2xl bg-accent-brand/10 text-accent-brand" aria-hidden="true">
              {card.icon}
            </span>
          </div>
          <div className="space-y-2 px-4">
            {card.label === "Avg progress" ? <Skeleton className="h-1.5 w-full" /> : null}
            <Skeleton className="h-3 w-24" />
          </div>
        </Card>
      ))}
    </div>
  );
}
