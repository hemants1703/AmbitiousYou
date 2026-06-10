import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Ambition, Milestone, Note, Task, User } from "@ambitiousyou/shared/types";
import { CalendarClockIcon, CheckCircle2Icon, CircleDotIcon, NotebookPenIcon, TimerResetIcon } from "lucide-react";
import type { ReactNode } from "react";
import NotesCard from "@/components/(app)/ambitions/(ambitionId)/ambition-details/notes-card";
import ExecutionBoard from "@/components/(app)/ambitions/(ambitionId)/ambition-details/execution-board";
import { MoveKindBadge } from "@/components/(app)/ambitions/move-kind-badge";
import { cn } from "@/lib/utils";
import { getDate as getItemDate, getDaysUntil, getDescription as getItemDescription, getKind, getTitle as getItemTitle, isCompleted as isItemCompleted, MOVE_KIND_STYLE, sortByPriority } from "@/lib/(app)/tracked-item";

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

  const clampedProgress = Math.min(Math.max(props.ambition.ambitionPercentageCompleted ?? 0, 0), 100);
  const overdueCount = openItems.filter((item) => getDaysUntil(getItemDate(item)) < 0).length;

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(360px,1fr)]">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TimerResetIcon className="size-4 text-foreground" />
              What You Should Focus On Next
            </CardTitle>
            <CardDescription>Prioritized by urgency and target date so the most important work stays visible first.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {nextActions.length === 0 ? (
              <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-800 dark:text-emerald-300">You have no pending items. This ambition is in a strong position.</div>
            ) : (
              nextActions.map((item, index) => {
                const itemDate = getItemDate(item);
                const daysUntil = getDaysUntil(itemDate);

                return (
                  <div key={item.id} className={cn("rounded-3xl border border-border/60 border-l-4 bg-background/70 p-4", MOVE_KIND_STYLE[getKind(item)].stripe)}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <MoveKindBadge kind={getKind(item)} />
                          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Priority {index + 1}</p>
                        </div>
                        <p className="line-clamp-2 font-medium wrap-break-word">{getItemTitle(item)}</p>
                        <p className="line-clamp-2 text-sm text-muted-foreground wrap-break-word">{getItemDescription(item) || "No description provided."}</p>
                      </div>
                      <Badge variant="outline" className={daysUntil < 0 ? "border-destructive/30 bg-destructive/10 text-destructive" : ""}>
                        {daysUntil < 0 ? `${Math.abs(daysUntil)}d overdue` : `${daysUntil}d left`}
                      </Badge>
                    </div>
                  </div>
                );
              })
            )}
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

      <div className="space-y-6">
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
          <CardHeader>
            <CardTitle>Notes</CardTitle>
            <CardDescription>Keep detailed context available without crowding the main execution view.</CardDescription>
          </CardHeader>
          <CardContent>
            <NotesCard notes={props.notes} ambitionId={props.ambition.id} ambitionName={props.ambition.ambitionName} />
          </CardContent>
        </Card>
      </div>
    </div>
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
