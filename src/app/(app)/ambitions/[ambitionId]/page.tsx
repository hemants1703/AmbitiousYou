import { Ambition, Milestone, Task } from "@/db/schema";
import AmbitionDetailsSection from "@/features/(app)/ambitions/(ambitionId)/AmbitionDetailsSection";
import { AmbitionPriorityBadge } from "@/features/(app)/ambitions/components/AmbitionPriorityBadge";
import AmbitionOptionsDropdown from "@/features/(app)/ambitions/view/AmbitionOptionsDropdown";
import { DeleteAmbitionDialog } from "@/features/(app)/ambitions/view/DeleteAmbitionDialog";
import confirmSession from "@/lib/auth/confirmSession";
import { AmbitionsService } from "@/services/ambitionsService";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { IconChevronLeft } from "@tabler/icons-react";
import { Metadata } from "next";
import Link from "next/link";
import { cache } from "react";

interface AmbitionDetailsPageProps {
  params: Promise<{ [key: string]: string | string[] | undefined }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const getAmbitionData = cache(async (ambitionId: string): Promise<Ambition | Error> => {
  const session = await confirmSession(); // check for session if not found, redirect to login
  return await AmbitionsService.fetchAmbitionById(ambitionId, session.user.id);
});

export async function generateMetadata(props: AmbitionDetailsPageProps): Promise<Metadata> {
  const { ambitionId } = await props.params;

  const ambition: Ambition | Error = await getAmbitionData(ambitionId as string);
  if (ambition instanceof Error) throw ambition;

  return {
    title: ambition.ambitionName,
  };
}

export default async function IndividualAmbitionPage(props: AmbitionDetailsPageProps) {
  const session = await confirmSession();

  const { ambitionId } = await props.params;
  const searchParams: {
    delete_ambition?: string | undefined;
  } = await props.searchParams;
  const ambition: Ambition | Error = await getAmbitionData(ambitionId as string);
  if (ambition instanceof Error) throw ambition;

  let tasks: Task[] | Error = [];

  let milestones: Milestone[] | Error = [];

  if (ambition.ambitionTrackingMethod === "task") {
    tasks = await AmbitionsService.fetchAmbitionTasks(ambition.id, session.user.id);
    if (tasks instanceof Error) throw tasks;
  } else if (ambition.ambitionTrackingMethod === "milestone") {
    milestones = await AmbitionsService.fetchAmbitionMilestones(ambition.id, session.user.id);
    if (milestones instanceof Error) throw milestones;
  }

  return (
    <section className={`p-6 md:p-8 pt-6 min-h-screen`}>
      <div className="space-y-6 max-w-7xl mx-auto w-full">
        {/* HEADER - Static content */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <Link prefetch={true} href="/ambitions">
              <IconChevronLeft className="size-8 bg-foreground/10 rounded-full p-2" />
            </Link>
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
          <AmbitionOptionsDropdown
            ambitionId={ambition.id}
            userId={ambition.userId}
            isFavourited={ambition.isFavourited ?? false}
          />

          {/* DELETE AMBITION DIALOG */}
          {searchParams.delete_ambition === "true" && (
            <DeleteAmbitionDialog ambitionId={ambition.id} />
          )}
        </div>

        <AmbitionDetailsSection
          user={session.user}
          ambition={ambition}
          tasks={tasks}
          milestones={milestones}
        />
      </div>
    </section>
  );
}
