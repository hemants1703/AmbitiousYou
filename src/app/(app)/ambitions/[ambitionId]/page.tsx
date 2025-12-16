import { Ambition, Milestone, Note, Task } from "@/db/schema";
import AmbitionDetailsSection from "@/features/(app)/ambitions/(ambitionId)/AmbitionDetailsSection";
import MarkMilestoneAsCompletedDialog from "@/features/(app)/ambitions/(ambitionId)/MarkMilestoneAsCompletedDialog";
import { AmbitionPriorityBadge } from "@/features/(app)/ambitions/components/AmbitionPriorityBadge";
import AmbitionOptionsDropdown from "@/features/(app)/ambitions/view/AmbitionOptionsDropdown";
import { DeleteAmbitionDialog } from "@/features/(app)/ambitions/view/DeleteAmbitionDialog";
import confirmSession from "@/lib/auth/confirmSession";
import { AmbitionsService } from "@/services/ambitionsService";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { IconChevronLeft } from "@tabler/icons-react";
import { Metadata } from "next";
import Link from "next/link";
import { redirect, RedirectType } from "next/navigation";
import { cache } from "react";

interface AmbitionDetailsPageProps {
  params: Promise<{ [key: string]: string | string[] | undefined }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const getAmbitionData = cache(
  async (ambitionId: string, userId: string): Promise<Ambition | Error> => {
    const ambitionsService = new AmbitionsService();
    return await ambitionsService.fetchAmbitionById(ambitionId, userId);
  }
);

export async function generateMetadata(props: AmbitionDetailsPageProps): Promise<Metadata> {
  const session = await confirmSession();

  if (!session) {
    redirect("/login", RedirectType.replace);
  }

  const { ambitionId } = await props.params;

  const ambition: Ambition | Error = await getAmbitionData(ambitionId as string, session.user.id);
  if (ambition instanceof Error) throw ambition;

  return {
    title: ambition.ambitionName,
  };
}

export default async function IndividualAmbitionPage(props: AmbitionDetailsPageProps) {
  const session = await confirmSession();

  if (!session) {
    redirect("/login", RedirectType.replace);
  }

  const { ambitionId } = await props.params;
  const searchParams: {
    delete_ambition?: string | undefined;
    mark_milestone_as_completed?: string | undefined;
    ref?: string | undefined;
  } = await props.searchParams;
  const ambition: Ambition | Error = await getAmbitionData(ambitionId as string, session.user.id);
  if (ambition instanceof Error) throw ambition;

  let tasks: Task[] | Error = [];
  let milestones: Milestone[] | Error = [];
  let isMilestoneCompletedToMarkAsCompleted: boolean = false;

  const ambitionsService = new AmbitionsService();

  if (ambition.ambitionTrackingMethod === "task") {
    tasks = await ambitionsService.fetchAmbitionTasks(ambition.id, session.user.id);
    if (tasks instanceof Error) throw tasks;
  } else if (ambition.ambitionTrackingMethod === "milestone") {
    milestones = await ambitionsService.fetchAmbitionMilestones(ambition.id, session.user.id);
    if (milestones instanceof Error) throw milestones;

    isMilestoneCompletedToMarkAsCompleted =
      milestones.find((milestone) => milestone.id === searchParams.mark_milestone_as_completed)
        ?.milestoneCompleted ?? true;
  }

  const notes: Note[] | Error = await ambitionsService.fetchAmbitionNotes(
    ambitionId as string,
    session.user.id
  );
  if (notes instanceof Error) throw notes;

  return (
    <section
      style={
        {
          "--ambition-color": ambition.ambitionColor,
        } as React.CSSProperties
      }
      className="p-6 md:p-8 pt-6 min-h-screen"
    >
      <div className="space-y-6 max-w-7xl mx-auto w-full">
        {/* HEADER - Static content */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex sm:flex-row flex-col justify-start sm:justify-start items-start sm:items-center gap-3 max-sm:w-full">
            <div className="flex items-center justify-between gap-3 max-sm:w-full">
              <Link prefetch={true} href={searchParams.ref ? `/${searchParams.ref}` : "/ambitions"}>
                <IconChevronLeft className="size-8 bg-foreground/10 rounded-full p-2" />
              </Link>

              <div className="block sm:hidden">
                <AmbitionOptionsDropdown
                  ambitionId={ambition.id}
                  userId={session.user.id}
                  isFavourited={ambition.isFavourited ?? false}
                />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold mt-1 flex items-center gap-1">
                {ambition.ambitionName}{" "}
                {ambition.isFavourited && <StarFilledIcon className="size-6 text-yellow-500" />}
              </h1>
              <div className="flex items-center gap-2">
                <AmbitionPriorityBadge ambitionPriority={ambition.ambitionPriority!} />
              </div>
            </div>
          </div>

          {/* Interactive actions - Client component */}
          <div className="hidden sm:block">
            <AmbitionOptionsDropdown
              ambitionId={ambition.id}
              userId={session.user.id}
              isFavourited={ambition.isFavourited ?? false}
            />
          </div>

          {/* DELETE AMBITION DIALOG */}
          {searchParams.delete_ambition === "true" && (
            <DeleteAmbitionDialog ambitionId={ambition.id} />
          )}

          {searchParams.mark_milestone_as_completed && !isMilestoneCompletedToMarkAsCompleted && (
            <MarkMilestoneAsCompletedDialog
              milestone={
                milestones.find(
                  (milestone) => milestone.id === searchParams.mark_milestone_as_completed
                ) as Milestone
              }
              ambitionId={ambition.id}
            />
          )}
        </div>

        <AmbitionDetailsSection
          user={session.user}
          ambition={ambition}
          tasks={tasks}
          milestones={milestones}
          notes={notes}
        />
      </div>
    </section>
  );
}
