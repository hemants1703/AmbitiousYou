import AmbitionCard from "@/components/(app)/ambitions/ambition-card";
import { Button } from "@/components/ui/button";
import { priorityWeight } from "@/lib/dashboard/tracked-items";
import type { Ambition } from "@ambitiousyou/shared/types";
import { ArrowRightIcon, PlusCircleIcon, TargetIcon } from "lucide-react";
import Link from "next/link";

interface ActiveAmbitionsGridProps {
  ambitions: Ambition[];
}

export function ActiveAmbitionsGrid(props: ActiveAmbitionsGridProps) {
  const active = props.ambitions
    .filter((ambition) => ambition.ambitionStatus === "active")
    .sort(
      (first, second) =>
        Number(second.isFavourited) - Number(first.isFavourited) ||
        priorityWeight(second.ambitionPriority) - priorityWeight(first.ambitionPriority) ||
        (second.ambitionPercentageCompleted ?? 0) - (first.ambitionPercentageCompleted ?? 0),
    );

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <TargetIcon className="size-5 text-foreground" />
          Your active ambitions
        </h2>
        <Button asChild variant="ghost" size="sm">
          <Link href="/ambitions" prefetch>
            All ambitions
            <ArrowRightIcon className="size-4" />
          </Link>
        </Button>
      </div>

      {active.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-4xl border border-dashed border-border/70 bg-background/60 p-8 text-center">
          <TargetIcon className="size-8 text-muted-foreground/40" />
          <p className="font-medium">No active ambitions right now</p>
          <p className="max-w-sm text-sm text-muted-foreground">Every completed goal started as an active one. Ready to set your next?</p>
          <Button asChild className="mt-1">
            <Link href="/ambitions/create" prefetch>
              <PlusCircleIcon className="size-4" />
              New ambition
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {active.map((ambition, index) => (
            <Link key={ambition.id} href={`/ambitions/${ambition.id}`} prefetch className="rounded-4xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <AmbitionCard ambition={ambition} index={index} completedTasksOrMilestones={0} totalTasksOrMilestones={0} />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
