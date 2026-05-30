import AmbitionsClientView from "@/components/ambitions/ambitions-client-view";
import { MotionWrapper } from "@/components/motion-wrapper";
import { Button } from "@/components/ui/button";
import { getAmbitions } from "@/lib/api/ambitions/get-ambitions";
import { getSessionToken } from "@/lib/auth";
import { Ambition } from "@ambitiousyou/shared/types";
import { FilterIcon, PlusCircleIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "All Ambitions",
};

export default async function AmbitionsPage() {
  const ambitions: Ambition[] | null = await getAmbitions(await getSessionToken());
  if (ambitions === null) throw new Error("Failed to fetch ambitions");

  if (ambitions.length === 0) {
    return <NoAmbitionsFoundPage />;
  }

  return <AmbitionsClientView ambitions={ambitions} />;
}

function NoAmbitionsFoundPage() {
  return (
    <div className="flex flex-col p-6 md:p-8 gap-6 max-sm:max-w-screen-sm md:max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto">
      <MotionWrapper initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.1 }} className="flex flex-col md:flex-row gap-2 justify-between items-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Your Ambitions</h1>
          <p className="text-muted-foreground">View and manage all your ambitions in one place</p>
        </div>
        <Button asChild size="sm" className="w-full md:w-auto">
          <Link prefetch={true} href="/ambitions/create" className="md:ml-0 flex justify-center items-center gap-1">
            <PlusCircleIcon className="h-4 w-4" />
            Create New Ambition
          </Link>
        </Button>
      </MotionWrapper>

      <MotionWrapper className="col-span-full text-center py-10 text-muted-foreground">
        <FilterIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
        <p>You haven&apos;t created any ambitions yet</p>
      </MotionWrapper>
    </div>
  );
}
