import AmbitionDetailsSection from "@/components/(app)/ambitions/(ambitionId)/ambition-details/ambition-details-section";
import { AmbitionMotivationCallout } from "@/components/(app)/ambitions/(ambitionId)/ambition-details/ambition-motivation-callout";
import AmbitionOptionsDropdown from "@/components/(app)/ambitions/(ambitionId)/ambition-details/ambition-options-dropdown";
import { AmbitionTracking } from "@/components/(app)/ambitions/(ambitionId)/ambition-details/ambition-tracking";

import { AmbitionPriorityBadge } from "@/components/(app)/ambitions/ambition-priority-badge";
import { AmbitionStatusBadge } from "@/components/(app)/ambitions/ambition-status-badge";
import { FadeIn } from "@/components/motion-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAmbitionFull } from "@/lib/api/ambitions/get-ambition-full";
import { requireUser } from "@/lib/auth";
import { Milestone, Note, Task } from "@ambitiousyou/shared/types";
import { CheckCircle2Icon, ChevronLeftIcon, HeartIcon } from "lucide-react";
import { createPrivateMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { cache } from "react";

interface AmbitionDetailsPageProps {
  params: Promise<{ ambitionId: string }>;
  searchParams: Promise<{
    ref?: string | undefined;
  }>;
}

const getAmbitionData = cache(async (sessionToken: string, ambitionId: string) => {
  return await getAmbitionFull(sessionToken, ambitionId);
});

export async function generateMetadata(props: AmbitionDetailsPageProps): Promise<Metadata> {
  const { sessionToken } = await requireUser();

  const { ambitionId } = await props.params;

  const ambition = await getAmbitionData(sessionToken, ambitionId);
  if (!ambition) {
    throw new Error(`Failed to fetch ambition ${ambitionId}`);
  }

  return createPrivateMetadata(ambition.ambition.ambitionName);
}

export default async function AmbitionDetailsPage(props: AmbitionDetailsPageProps) {
  const { user: userDetails, sessionToken } = await requireUser();

  const { ambitionId } = await props.params;
  const searchParams = await props.searchParams;
  const backTarget = resolveBackTarget(searchParams.ref);

  const ambitionData = await getAmbitionData(sessionToken, ambitionId);
  if (!ambitionData) {
    throw new Error(`Failed to fetch ambition ${ambitionId}`);
  }

  const ambition = ambitionData.ambition;
  const tasks: Task[] = ambitionData.tasks;
  const milestones: Milestone[] = ambitionData.milestones;
  const notes: Note[] = ambitionData.notes;
  const trackedItems = [...tasks, ...milestones];

  const completedItems = trackedItems.filter((item) => ("taskCompleted" in item ? item.taskCompleted : item.milestoneCompleted)).length;
  const progress = Math.min(Math.max(ambition.ambitionPercentageCompleted ?? 0, 0), 100);

  return (
    <section className="w-full pb-8">
      <div className="mx-auto flex w-full max-w-350 flex-col gap-6">
        {/* HEADER */}
        <div className="flex flex-wrap items-center gap-2 max-sm:justify-between">
          <Button asChild variant="outline" size="sm" className="rounded-full bg-background/80">
            <Link prefetch={true} href={backTarget.href}>
              <ChevronLeftIcon className="size-4" />
              {backTarget.label}
            </Link>
          </Button>

          <div className="ml-auto hidden sm:block">
            <AmbitionOptionsDropdown ambitionId={ambition.id} ambitionName={ambition.ambitionName} userId={userDetails.id} isFavourited={ambition.isFavourited ?? false} />
          </div>

          <div className="sm:hidden">
            <AmbitionOptionsDropdown ambitionId={ambition.id} ambitionName={ambition.ambitionName} userId={userDetails.id} isFavourited={ambition.isFavourited ?? false} />
          </div>
        </div>

        {/* AMBITION DETAILS */}
        <FadeIn>
          <Card>
            <CardContent className="space-y-6 px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex min-w-0 flex-1 flex-col gap-4">
                  <div className="space-y-2">
                    <h1 className="line-clamp-2 wrap-anywhere text-2xl font-bold tracking-tight text-balance sm:text-3xl lg:text-4xl">
                      {ambition.isFavourited ? <HeartIcon className="mr-2 mb-2 inline-flex size-7 fill-pink-500 text-pink-500 align-text-bottom" aria-label="Favourited ambition" /> : null}
                      {ambition.ambitionName}
                    </h1>
                    <p className="max-w-3xl wrap-anywhere text-sm text-muted-foreground sm:text-base">{ambition.ambitionDefinition || "A clear destination. Keep momentum, complete key work, and turn this ambition into a measurable outcome."}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <AmbitionPriorityBadge ambitionPriority={ambition.ambitionPriority!} />
                    <Badge variant="outline">
                      <CheckCircle2Icon className="size-3.5" />
                      {completedItems}/{trackedItems.length || 0} completed
                    </Badge>
                    <AmbitionStatusBadge ambitionStatus={ambition.ambitionStatus} />
                  </div>
                </div>
              </div>

              <div className="divide-y divide-border/50" role="region" aria-label="Ambition anchor">
                <AmbitionMotivationCallout ambitionId={ambition.id} motivation={ambition.ambitionMotivation} />
                <AmbitionTracking
                  progressPercent={progress}
                  startDate={ambition.ambitionStartDate}
                  endDate={ambition.ambitionEndDate}
                  ambitionStatus={ambition.ambitionStatus}
                  embedded
                />
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delayMs={80}>
          <AmbitionDetailsSection ambition={ambition} tasks={tasks} milestones={milestones} notes={notes} />
        </FadeIn>

      </div>
    </section>
  );
}

/**
 * The detail page is reached from several places — the ambitions list, the dashboard's
 * next-moves queue, the revive-missed card, the motivation banner. Each passes a `ref`
 * query param naming where it came from, so "Back" returns the user there instead of
 * always dumping them on the ambitions list. Validated against an allowlist: a bare
 * `/${ref}` would let a crafted value (e.g. `//evil.com`) become a protocol-relative
 * off-site link.
 */
const BACK_TARGETS = {
  dashboard: { href: "/dashboard", label: "Back to dashboard" },
  ambitions: { href: "/ambitions", label: "Back to ambitions" },
} as const;

function resolveBackTarget(ref: string | undefined) {
  if (ref && ref in BACK_TARGETS) {
    return BACK_TARGETS[ref as keyof typeof BACK_TARGETS];
  }
  return BACK_TARGETS.ambitions;
}
