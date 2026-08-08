import AmbitionsClientView from "@/components/ambitions/ambitions-client-view";
import { FadeIn } from "@/components/motion-wrapper";
import { Button } from "@/components/ui/button";
import { getAmbitions } from "@/lib/api/ambitions/get-ambitions";
import { getSessionToken, requireUser } from "@/lib/auth";
import { Ambition } from "@ambitiousyou/shared/types";
import { FilterIcon, PlusCircleIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import AmbitionsLoading from "./loading";

export const metadata: Metadata = {
  title: "All Ambitions",
};

export default function AmbitionsPage() {
  return (
    <Suspense fallback={<AmbitionsLoading />}>
      <AmbitionsContent />
    </Suspense>
  );
}

async function AmbitionsContent() {
  // Validate the session and load the ambitions concurrently. getAmbitions only
  // needs the raw cookie, and its endpoint enforces auth itself (SessionGuard),
  // so overlapping the fetch with requireUser's validation removes a backend
  // round-trip without weakening the gate — requireUser still redirects on an
  // invalid session before this content streams.
  const sessionToken = await getSessionToken();
  const [, ambitions]: [unknown, Ambition[] | null] = await Promise.all([requireUser(), getAmbitions(sessionToken)]);

  if (!ambitions || ambitions.length === 0) {
    return <NoAmbitionsFoundPage />;
  }

  return <AmbitionsClientView ambitions={ambitions} />;
}

function NoAmbitionsFoundPage() {
  return (
    <div className="app-page flex flex-col gap-6 p-6 md:p-8">
      <FadeIn className="flex flex-col md:flex-row gap-2 justify-between items-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Your Ambitions</h1>
          <p className="text-muted-foreground">View and manage all your ambitions in one place</p>
        </div>
        <Button asChild size="sm" className="w-full md:w-auto">
          <Link href="/ambitions/create" className="md:ml-0 flex justify-center items-center gap-1">
            <PlusCircleIcon className="h-4 w-4" />
            Create New Ambition
          </Link>
        </Button>
      </FadeIn>

      <FadeIn delayMs={100} className="col-span-full text-center py-10 text-muted-foreground">
        <FilterIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
        <p>You haven&apos;t created any ambitions yet</p>
      </FadeIn>
    </div>
  );
}
