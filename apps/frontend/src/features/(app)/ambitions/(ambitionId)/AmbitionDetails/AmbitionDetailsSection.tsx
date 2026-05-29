import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Ambition, Milestone, Note, Task, User } from "@ambitiousyou/shared/types";

type AmbitionDetailsSectionProps = {
  user: User;
  ambition: Ambition & { tasks?: Task[]; milestones?: Milestone[]; notes?: Note[] };
  tasks: Task[];
  milestones: Milestone[];
  notes: Note[];
};

export default function AmbitionDetailsSection(props: AmbitionDetailsSectionProps) {
  const items = props.ambition.ambitionTrackingMethod === "task" ? props.tasks : props.milestones;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>{props.ambition.ambitionDefinition || `Managed by ${props.user.name}`}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{props.ambition.ambitionStatus}</Badge>
            <Badge variant="outline">{props.ambition.ambitionPriority}</Badge>
            <Badge variant="outline">{props.ambition.ambitionTrackingMethod}</Badge>
          </div>
          <div className="grid gap-2 text-muted-foreground sm:grid-cols-2">
            <p>Start: {new Date(props.ambition.ambitionStartDate).toLocaleDateString()}</p>
            <p>End: {new Date(props.ambition.ambitionEndDate).toLocaleDateString()}</p>
            <p>Completion: {props.ambition.ambitionCompletionDate ? new Date(props.ambition.ambitionCompletionDate).toLocaleDateString() : "Not completed"}</p>
            <p>Progress: {props.ambition.ambitionPercentageCompleted}%</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{props.ambition.ambitionTrackingMethod === "task" ? "Tasks" : "Milestones"}</CardTitle>
          <CardDescription>{items.length} item(s) loaded from the joined details query.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">No items found.</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="rounded-3xl border border-border/60 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{"task" in item ? item.task : item.milestone}</p>
                    <p className="text-sm text-muted-foreground">{"taskDescription" in item ? item.taskDescription : item.milestoneDescription}</p>
                  </div>
                  <Badge variant={"task" in item ? (item.taskCompleted ? "secondary" : "outline") : item.milestoneCompleted ? "secondary" : "outline"}>
                    {"task" in item ? (item.taskCompleted ? "done" : "open") : item.milestoneCompleted ? "done" : "open"}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Notes</CardTitle>
          <CardDescription>{props.notes.length} note(s) included in the same request.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {props.notes.length === 0 ? (
            <p className="text-sm text-muted-foreground">No notes found.</p>
          ) : (
            props.notes.map((note) => (
              <div key={note.id} className="rounded-3xl border border-border/60 p-4 text-sm">
                {note.note}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
