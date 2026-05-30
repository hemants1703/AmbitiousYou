"use client";

import AmbitionCard from "@/components/(app)/ambitions/ambition-card";
import AmbitionFilters, { AmbitionFiltersState } from "@/components/(app)/ambitions/ambition-filters";
import { MotionWrapper } from "@/components/motion-wrapper";
import { Button } from "@/components/ui/button";
import { Ambition } from "@ambitiousyou/shared/types";
import { FilterIcon, PlusCircleIcon } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

interface AmbitionsClientViewProps {
  ambitions: Ambition[];
}

export default function AmbitionsClientView(props: AmbitionsClientViewProps) {
  const [filters, setFilters] = useState<AmbitionFiltersState>({});

  const filteredAmbitions = useMemo(() => {
    const searchValue = filters.search?.trim().toLowerCase();

    return props.ambitions.filter((ambition) => {
      if (filters.status && ambition.ambitionStatus !== filters.status) {
        return false;
      }

      if (filters.priority && ambition.ambitionPriority !== filters.priority) {
        return false;
      }

      if (searchValue) {
        const searchableText = [ambition.ambitionName, ambition.ambitionDefinition, ambition.ambitionTrackingMethod, ambition.ambitionStatus, ambition.ambitionPriority].filter(Boolean).join(" ").toLowerCase();

        if (!searchableText.includes(searchValue)) {
          return false;
        }
      }

      return true;
    });
  }, [filters.priority, filters.search, filters.status, props.ambitions]);

  return (
    <div className="mx-auto flex max-w-screen-2xl w-full flex-col gap-6">
      <MotionWrapper initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.1 }} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Your Ambitions</h1>
          <p className="text-muted-foreground">View and manage all your ambitions in one place</p>
        </div>
        <Button asChild size="sm" className="w-full md:w-auto">
          <Link prefetch={true} href="/ambitions/create" className="flex items-center justify-center gap-1 md:ml-0">
            <PlusCircleIcon className="h-4 w-4" />
            Create New Ambition
          </Link>
        </Button>
      </MotionWrapper>

      <MotionWrapper initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
        <AmbitionFilters value={filters} onChange={setFilters} onClear={() => setFilters({})} />
      </MotionWrapper>

      <MotionWrapper initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredAmbitions.length > 0 ? (
          filteredAmbitions.map((ambition, index) => (
            <MotionWrapper key={ambition.id} transition={{ duration: 0.3, delay: 0.05 * index }}>
              <Link prefetch={true} href={`/ambitions/${ambition.id}`}>
                <AmbitionCard ambition={ambition} index={index} completedTasksOrMilestones={0} totalTasksOrMilestones={0} />
              </Link>
            </MotionWrapper>
          ))
        ) : (
          <MotionWrapper className="col-span-full flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/70 bg-background/60 px-6 py-12 text-center text-muted-foreground shadow-sm">
            <FilterIcon className="mb-3 h-12 w-12 opacity-20" />
            <p className="font-medium text-foreground">No ambitions match your filters</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">Try clearing one or more filters to bring results back.</p>
          </MotionWrapper>
        )}
      </MotionWrapper>
    </div>
  );
}
