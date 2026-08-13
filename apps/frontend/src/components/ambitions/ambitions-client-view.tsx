"use client";

import AmbitionCard from "@/components/(app)/ambitions/ambition-card";
import AmbitionFilters, { AmbitionFiltersState } from "@/components/(app)/ambitions/ambition-filters";
import { FadeIn } from "@/components/motion-wrapper";
import { Ambition } from "@/types";
import { FilterIcon } from "lucide-react";
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
      if (filters.status && ambition.ambitionStatus !== filters.status) return false;
      if (filters.priority && ambition.ambitionPriority !== filters.priority) return false;
      if (filters.favouritesOnly && !ambition.isFavourited) return false;

      if (searchValue) {
        const searchableText = [ambition.ambitionName, ambition.ambitionDefinition, ambition.ambitionStatus, ambition.ambitionPriority].filter(Boolean).join(" ").toLowerCase();
        if (!searchableText.includes(searchValue)) return false;
      }

      return true;
    });
  }, [filters.favouritesOnly, filters.priority, filters.search, filters.status, props.ambitions]);

  return (
    <>
      <FadeIn delayMs={80}>
        <AmbitionFilters value={filters} onChange={setFilters} onClear={() => setFilters({})} />
      </FadeIn>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredAmbitions.length > 0 ? (
          filteredAmbitions.map((ambition, index) => (
            <FadeIn key={ambition.id} delayMs={120 + index * 40}>
              <Link prefetch href={`/ambitions/${ambition.id}?ref=ambitions`}>
                <AmbitionCard ambition={ambition} index={index} />
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
    </>
  );
}
