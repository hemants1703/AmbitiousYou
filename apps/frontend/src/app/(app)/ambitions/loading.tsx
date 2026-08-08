import { AmbitionCardsSkeleton } from "@/components/(app)/ambitions/ambition-cards-skeleton";
import { AmbitionsFiltersFallback } from "@/components/(app)/ambitions/ambitions-filters-fallback";
import { AmbitionsPageHeader } from "@/components/(app)/ambitions/ambitions-page-header";

/**
 * Instant-navigation fallback for /ambitions. Static chrome (title, CTA, filters)
 * paints immediately; only the ambition cards skeleton while the list loads.
 */
export default function AmbitionsLoading() {
  return (
    <div className="app-page flex flex-col gap-6" aria-busy="true" aria-label="Loading ambitions">
      <AmbitionsPageHeader />
      <AmbitionsFiltersFallback />
      <AmbitionCardsSkeleton />
    </div>
  );
}
