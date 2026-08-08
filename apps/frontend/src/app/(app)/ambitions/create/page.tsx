import CreateAmbitionForm from "@/components/(app)/ambitions/create-ambition-form";
import { FadeIn } from "@/components/motion-wrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { brandCopy } from "@/lib/brand";
import { requireUser } from "@/lib/auth";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Create Ambition",
};

interface CreateAmbitionPageProps {
  searchParams: Promise<{ initiation?: string }>;
}

export default function CreateAmbitionPage(props: CreateAmbitionPageProps) {
  return (
    <Suspense fallback={<CreateAmbitionFallback />}>
      <CreateAmbitionContent searchParams={props.searchParams} />
    </Suspense>
  );
}

async function CreateAmbitionContent(props: { searchParams: Promise<{ initiation?: string }> }) {
  await requireUser();

  const searchParams = await props.searchParams;
  const isInitiation = searchParams.initiation === "1";

  return (
    <div className="app-page flex flex-col">
      <FadeIn className="flex flex-col md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-3 pb-10">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">{isInitiation ? brandCopy.initiation.heading : "Create a new ambition"}</h1>
            <p className="text-balance text-muted-foreground">
              {isInitiation ? brandCopy.initiation.subheading : "Capture the goal, choose how progress will be tracked, and add the first tasks or milestones that will keep it moving."}
            </p>
          </div>
        </div>
      </FadeIn>

      <FadeIn delayMs={100} className="flex flex-col md:flex-row md:items-end md:justify-between">
        <CreateAmbitionForm isInitiation={isInitiation} />
      </FadeIn>
    </div>
  );
}

function CreateAmbitionFallback() {
  return (
    <div className="app-page flex flex-col gap-10" aria-hidden="true">
      <div className="space-y-2 pb-2">
        <Skeleton className="h-9 w-64 max-w-full" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>
      <Skeleton className="h-96 w-full rounded-xl" />
    </div>
  );
}
