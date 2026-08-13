import { AmbitionCardsSkeleton } from "@/components/(app)/ambitions/ambition-cards-skeleton";
import { AmbitionsFiltersFallback } from "@/components/(app)/ambitions/ambitions-filters-fallback";
import { AmbitionsPageHeader } from "@/components/(app)/ambitions/ambitions-page-header";
import AmbitionsClientView from "@/components/ambitions/ambitions-client-view";
import { FadeIn } from "@/components/motion-wrapper";
import { getCachedAmbitions } from "@/lib/cache/session-data";
import { requireUser } from "@/lib/auth";
import { FilterIcon } from "lucide-react";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "All Ambitions",
};

export default function AmbitionsPage() {
  return (
    <div className="app-page flex flex-col gap-6">
      <AmbitionsPageHeader />
      <Suspense
        fallback={
          <>
            <AmbitionsFiltersFallback />
            <AmbitionCardsSkeleton />
          </>
        }
      >
        <AmbitionsContent />
      </Suspense>
    </div>
  );
}

async function AmbitionsContent() {
  const [, ambitions] = await Promise.all([requireUser(), getCachedAmbitions()]);

  if (!ambitions || ambitions.length === 0) {
    return <NoAmbitionsFound />;
  }

  return <AmbitionsClientView ambitions={ambitions} />;
}

function NoAmbitionsFound() {
  return (
    <FadeIn className="col-span-full text-center py-10 text-muted-foreground">
      <FilterIcon className="mx-auto mb-3 h-12 w-12 opacity-20" />
      <p>You haven&apos;t created any ambitions yet</p>
    </FadeIn>
  );
}
