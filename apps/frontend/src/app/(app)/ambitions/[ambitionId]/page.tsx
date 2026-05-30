import { Ambition, Milestone, Note, Task } from "@ambitiousyou/shared/types";
import AmbitionDetailsSection from "@/features/(app)/ambitions/(ambitionId)/AmbitionDetails/AmbitionDetailsSection";
import EditAmbitionDialog from "@/features/(app)/ambitions/(ambitionId)/AmbitionDetails/EditAmbitionDialog";
import MarkMilestoneAsCompletedDialog from "@/features/(app)/ambitions/(ambitionId)/Milestones/MarkMilestoneAsCompletedDialog";

import { AmbitionPriorityBadge } from "@/components/(app)/ambitions/ambition-priority-badge";
import AmbitionOptionsDropdown from "@/features/(app)/ambitions/view/AmbitionOptionsDropdown";
import { DeleteAmbitionDialog } from "@/features/(app)/ambitions/view/DeleteAmbitionDialog";
import { getAmbitionDetails, type AmbitionDetails } from "@/lib/api/ambitions/get-ambition-details";
import { getUser } from "@/lib/api/sidebar/get-user";
import { getSessionToken } from "@/lib/auth";
import { ChevronLeft, Star } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { redirect, RedirectType } from "next/navigation";
import { cache } from "react";
import { MotionWrapper } from "@/components/motion-wrapper";

interface AmbitionDetailsPageProps {
  params: Promise<{ ambitionId: string }>;
  searchParams: Promise<{
    edit_ambition?: string;
    delete_ambition?: string;
    mark_milestone_as_completed?: string;
    ref?: string | undefined;
  }>;
}

const getAmbitionData = cache(async (sessionToken: string, ambitionId: string): Promise<AmbitionDetails | null> => {
  return await getAmbitionDetails(sessionToken, ambitionId);
});

export async function generateMetadata(props: AmbitionDetailsPageProps): Promise<Metadata> {
  const sessionToken = await getSessionToken();

  const { ambitionId } = await props.params;

  const ambition = await getAmbitionData(sessionToken, ambitionId);
  if (!ambition) {
    throw new Error(`Failed to fetch ambition ${ambitionId}`);
  }

  return {
    title: ambition.ambitionName,
  };
}

export default async function AmbitionDetailsPage(props: AmbitionDetailsPageProps) {
  const sessionToken = await getSessionToken();
  const userDetails = await getUser(sessionToken);

  if (!userDetails) {
    return redirect("/login", RedirectType.replace);
  }

  const { ambitionId } = await props.params;
  const searchParams = await props.searchParams;

  const ambition = await getAmbitionData(sessionToken, ambitionId);
  if (!ambition) {
    throw new Error(`Failed to fetch ambition ${ambitionId}`);
  }

  const tasks: Task[] = ambition.ambitionTrackingMethod === "task" ? (ambition.tasks ?? []) : [];
  const milestones: Milestone[] = ambition.ambitionTrackingMethod === "milestone" ? (ambition.milestones ?? []) : [];
  const notes: Note[] = ambition.notes ?? [];

  return (
    <section className="w-full">
      <div className="space-y-6 max-w-7xl mx-auto w-full">
        {/* HEADER - Static content */}
        <MotionWrapper initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.1 }}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex sm:flex-row flex-col justify-start sm:justify-start items-start sm:items-center gap-3 max-sm:w-full">
              <div className="flex items-center justify-between gap-3 max-sm:w-full">
                <Link prefetch={true} href={searchParams.ref ? `/${searchParams.ref}` : "/ambitions"}>
                  <ChevronLeft className="size-8 bg-foreground/10 rounded-full p-2" />
                </Link>

                <div className="block sm:hidden">
                  <AmbitionOptionsDropdown ambitionId={ambition.id} userId={userDetails.id} isFavourited={ambition.isFavourited ?? false} />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold mt-1 flex items-center gap-1">
                  {ambition.ambitionName} {ambition.isFavourited && <Star className="size-6 fill-yellow-500 text-yellow-500" />}
                </h1>
                <div className="flex items-center gap-2">
                  <AmbitionPriorityBadge ambitionPriority={ambition.ambitionPriority!} />
                </div>
              </div>
            </div>

            {/* Interactive actions - Client component */}
            <div className="hidden sm:block">
              <AmbitionOptionsDropdown ambitionId={ambition.id} userId={userDetails.id} isFavourited={ambition.isFavourited ?? false} />
            </div>

            <AmbitionDialogs {...props} milestones={milestones} ambition={ambition} />
          </div>
        </MotionWrapper>

        <MotionWrapper initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          <AmbitionDetailsSection user={userDetails} ambition={ambition} tasks={tasks} milestones={milestones} notes={notes} />
        </MotionWrapper>
      </div>
    </section>
  );
}

async function AmbitionDialogs(props: AmbitionDetailsPageProps & { milestones: Milestone[]; ambition: Ambition }) {
  const { ambitionId } = await props.params;
  const { edit_ambition, delete_ambition, mark_milestone_as_completed } = await props.searchParams;

  // EDIT AMBITION DIALOG
  if (edit_ambition === ambitionId) {
    return <EditAmbitionDialog ambition={props.ambition} />;
  }

  // DELETE AMBITION DIALOG
  if (delete_ambition === ambitionId) {
    return <DeleteAmbitionDialog ambitionId={ambitionId} />;
  }

  // MARK MILESTONE AS COMPLETED DIALOG
  const concernedMilestone = props.milestones.find((milestone: Milestone) => milestone.id === mark_milestone_as_completed);
  if (!concernedMilestone) return null;

  const milestoneTargetDate = new Date(concernedMilestone.milestoneTargetDate);
  const today = new Date();
  milestoneTargetDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  if (milestoneTargetDate >= today) return null;

  if (mark_milestone_as_completed && !concernedMilestone.milestoneCompleted) {
    return <MarkMilestoneAsCompletedDialog milestone={concernedMilestone} ambitionId={ambitionId} />;
  }
}
