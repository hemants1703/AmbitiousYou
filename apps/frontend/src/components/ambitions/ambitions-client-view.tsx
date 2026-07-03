"use client";

import AmbitionCard from "@/components/(app)/ambitions/ambition-card";
import { AmbitionFavouriteButton } from "@/components/(app)/ambitions/ambition-favourite-button";
import AmbitionFilters, { AmbitionFiltersState } from "@/components/(app)/ambitions/ambition-filters";
import { FadeIn } from "@/components/motion-wrapper";
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
  const [favourites, setFavourites] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(props.ambitions.map((ambition) => [ambition.id, ambition.isFavourited ?? false])),
  );

  const ambitions = useMemo(
    () => props.ambitions.map((ambition) => ({ ...ambition, isFavourited: favourites[ambition.id] ?? ambition.isFavourited })),
    [props.ambitions, favourites],
  );

  const filteredAmbitions = useMemo(() => {
    const searchValue = filters.search?.trim().toLowerCase();

    return ambitions.filter((ambition) => {
      if (filters.status && ambition.ambitionStatus !== filters.status) return false;
      if (filters.priority && ambition.ambitionPriority !== filters.priority) return false;
      if (filters.favouritesOnly && !ambition.isFavourited) return false;

      if (searchValue) {
        const searchableText = [ambition.ambitionName, ambition.ambitionDefinition, ambition.ambitionStatus, ambition.ambitionPriority].filter(Boolean).join(" ").toLowerCase();
        if (!searchableText.includes(searchValue)) return false;
      }

      return true;
    });
  }, [filters.favouritesOnly, filters.priority, filters.search, filters.status, ambitions]);

  return (
    <div className="mx-auto flex max-w-screen-2xl w-full flex-col gap-6">
      <FadeIn className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Your Ambitions</h1>
          <p className="text-muted-foreground">View and manage all your ambitions in one place</p>
        </div>
        <Button asChild size="sm" className="w-full md:w-auto">
          <Link prefetch href="/ambitions/create" className="flex items-center justify-center gap-1 md:ml-0">
            <PlusCircleIcon className="h-4 w-4" />
            Create New Ambition
          </Link>
        </Button>
      </FadeIn>

      <FadeIn delayMs={80}>
        <AmbitionFilters value={filters} onChange={setFilters} onClear={() => setFilters({})} />
      </FadeIn>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredAmbitions.length > 0 ? (
          filteredAmbitions.map((ambition, index) => (
            <FadeIn key={ambition.id} delayMs={120 + index * 40} className="relative">
              <div className="absolute top-3 right-3 z-10">
                <AmbitionFavouriteButton
                  ambitionId={ambition.id}
                  isFavourited={ambition.isFavourited ?? false}
                  className="bg-background/80 backdrop-blur-sm"
                  onChange={(isFavourited) => setFavourites((prev) => ({ ...prev, [ambition.id]: isFavourited }))}
                />
              </div>
              <Link prefetch href={`/ambitions/${ambition.id}?ref=ambitions`}>
                <AmbitionCard ambition={ambition} index={index} completedTasksOrMilestones={0} totalTasksOrMilestones={0} />
              </Link>
            </FadeIn>
          ))
        ) : (
          <FadeIn className="col-span-full flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/70 bg-background/60 px-6 py-12 text-center text-muted-foreground shadow-sm">
            <FilterIcon className="mb-3 h-12 w-12 opacity-20" />
            <p className="font-medium text-foreground">No ambitions match your filters</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">Try clearing one or more filters to bring results back.</p>
          </FadeIn>
        )}
      </div>
    </div>
  );
}
