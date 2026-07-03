import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Ambition, Milestone, Note, Task, User } from "@ambitiousyou/shared/types";
import { CalendarClockIcon, CheckCircle2Icon, CircleDotIcon, NotebookPenIcon, TimerResetIcon } from "lucide-react";
import type { ReactNode } from "react";
import NotesCard from "@/components/(app)/ambitions/(ambitionId)/ambition-details/notes-card";
import ExecutionBoard from "@/components/(app)/ambitions/(ambitionId)/ambition-details/execution-board";
import { FocusNextCard } from "@/components/(app)/ambitions/(ambitionId)/ambition-details/focus-next-card";
import { MoveDetailProvider } from "@/components/(app)/ambitions/move-detail-context";
import { AmbitionNotesProvider } from "@/lib/(app)/mutations/ambition-notes-context";
import { getDate as getItemDate, getDaysUntil, isCompleted as isItemCompleted, sortByPriority } from "@/lib/(app)/tracked-item";

type AmbitionDetailsSectionProps = {
  user: User;
  ambition: Ambition & { tasks?: Task[]; milestones?: Milestone[]; notes?: Note[] };
  tasks: Task[];
  milestones: Milestone[];
  notes: Note[];
};

export default function AmbitionDetailsSection(props: AmbitionDetailsSectionProps) {
  const trackedItems = [...props.tasks, ...props.milestones];
  const completedItems = trackedItems.filter((item) => isItemCompleted(item));
  const openItems = trackedItems.filter((item) => !isItemCompleted(item));
  const prioritizedOpenItems = [...openItems].sort(sortByPriority);
  const nextActions = prioritizedOpenItems.slice(0, 3);

  const overdueCount = openItems.filter((item) => getDaysUntil(getItemDate(item)) < 0).length;

  return (
    <AmbitionNotesProvider ambitionId={props.ambition.id} initialNotes={props.notes}>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(360px,1fr)]">
      <MoveDetailProvider>
        <div className="min-w-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TimerResetIcon className="size-4 text-foreground" />
                What You Should Focus On Next
              </CardTitle>
              <CardDescription>Prioritized by urgency and target date so the most important work stays visible first.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <FocusNextCard items={nextActions} />
            </CardContent>
          </Card>

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

      <div className="min-w-0 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Ambition Health</CardTitle>
            <CardDescription>Snapshot of your current momentum and risk.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <p className="text-muted-foreground">Overall progress</p>
                <p className="font-semibold tabular-nums">{clampedProgress}%</p>
              </div>
              <Progress value={clampedProgress} className="h-px" />
            </div> */}

            <div className="grid gap-2">
              <HealthRow icon={<CircleDotIcon className="size-4 text-foreground" />} label="Open work" value={`${openItems.length}`} />
              <HealthRow icon={<CheckCircle2Icon className="size-4 text-green-500" />} label="Completed" value={`${completedItems.length}`} />
              <HealthRow icon={<CalendarClockIcon className="size-4 text-destructive" />} label="Overdue" value={`${overdueCount}`} tone={overdueCount > 0 ? "danger" : "default"} />
              <HealthRow icon={<NotebookPenIcon className="size-4 text-yellow-500" />} label="Notes" value={`${props.notes.length}`} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <NotesCard ambitionName={props.ambition.ambitionName} />
        </Card>
      </div>
    </div>
    </AmbitionNotesProvider>
  );
}

interface HealthRowProps {
  icon: ReactNode;
  label: string;
  value: string;
  tone?: "default" | "danger";
}

function HealthRow(props: HealthRowProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border/60 px-3 py-2">
      <div className="flex items-center gap-2 text-muted-foreground">
        {props.icon}
        <p className="text-sm">{props.label}</p>
      </div>
      <p className={`text-sm font-semibold tabular-nums ${props.tone === "danger" ? "text-destructive" : ""}`}>{props.value}</p>
    </div>
  );
}
