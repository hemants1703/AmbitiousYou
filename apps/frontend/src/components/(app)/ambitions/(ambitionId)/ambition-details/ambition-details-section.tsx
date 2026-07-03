import { Card } from "@/components/ui/card";
import type { Ambition, Milestone, Note, Task } from "@ambitiousyou/shared/types";
import NotesCard from "@/components/(app)/ambitions/(ambitionId)/ambition-details/notes-card";
import ExecutionBoard from "@/components/(app)/ambitions/(ambitionId)/ambition-details/execution-board";
import { MoveDetailProvider } from "@/components/(app)/ambitions/move-detail-context";
import { AmbitionNotesProvider } from "@/lib/(app)/mutations/ambition-notes-context";

type AmbitionDetailsSectionProps = {
  ambition: Ambition & { tasks?: Task[]; milestones?: Milestone[]; notes?: Note[] };
  tasks: Task[];
  milestones: Milestone[];
  notes: Note[];
};

export default function AmbitionDetailsSection(props: AmbitionDetailsSectionProps) {
  return (
    <AmbitionNotesProvider ambitionId={props.ambition.id} initialNotes={props.notes}>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(360px,1fr)]">
        <MoveDetailProvider ambitionStartDate={props.ambition.ambitionStartDate} ambitionEndDate={props.ambition.ambitionEndDate}>
          <div className="min-w-0">
            <ExecutionBoard
              ambitionId={props.ambition.id}
              ambitionName={props.ambition.ambitionName}
              ambitionStartDate={props.ambition.ambitionStartDate}
              ambitionEndDate={props.ambition.ambitionEndDate}
              tasks={props.tasks}
              milestones={props.milestones}
            />
          </div>
        </MoveDetailProvider>

        <div className="min-w-0">
          <Card>
            <NotesCard ambitionName={props.ambition.ambitionName} />
          </Card>
        </div>
      </div>
    </AmbitionNotesProvider>
  );
}
