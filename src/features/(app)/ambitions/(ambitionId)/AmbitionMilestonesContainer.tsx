import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import * as Card from "@/components/ui/card";
import { Ambition, Milestone } from "@/db/schema";
import {
  IconCheck,
  IconCircleFilled,
  IconSquareRotatedFilled
} from "@tabler/icons-react";
import { format, isAfter } from "date-fns";
import Link from "next/link";
import CreateMilestoneDialog from "./CreateMilestone/CreateMilestoneDialog";

interface AmbitionMilestonesContainerProps {
  ambition: Ambition;
  milestones: Milestone[];
}

export default async function AmbitionMilestonesContainer(props: AmbitionMilestonesContainerProps) {
  return (
    <Card.Card className="bg-linear-to-b from-(--ambition-color)/10 to-transparent" style={
      { "--ambition-color": props.ambition.ambitionColor } as React.CSSProperties
    }>
      <Card.CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Card.CardTitle className="font-black tracking-wider text-sm text-primary/85">MILESTONES JOURNEY</Card.CardTitle>
            <Card.CardDescription>Progress through key checkpoints</Card.CardDescription>
          </div>
          <CreateMilestoneDialog
            ambitionId={props.ambition.id}
            ambitionColor={props.ambition.ambitionColor}
            ambitionStartDate={props.ambition.ambitionStartDate.toISOString()}
            ambitionEndDate={props.ambition.ambitionEndDate.toISOString()}
          />
        </div>
      </Card.CardHeader>
      <Card.CardContent>
        <div className="relative mt-6">
          {/* Timeline line */}
          <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-border"></div>

          {/* Milestones */}
          <div className="space-y-10">
            {props.milestones.map((milestone) => (
              <MilestoneItem
                key={milestone.id}
                ambitionId={props.ambition.id}
                milestone={milestone}
              />
            ))}
          </div>
        </div>
      </Card.CardContent>
    </Card.Card>
  );
}

function MilestoneItem(props: { ambitionId: string; milestone: Milestone }) {
  const deadlinePassed = isAfter(new Date(), new Date(props.milestone.milestoneTargetDate));

  return (
    <div className="relative pl-10">
      <div
        className={`absolute left-0 h-5 w-5 rounded-full ${props.milestone.milestoneCompleted ? "bg-primary" : "bg-muted-foreground/25"} flex items-center justify-center`}
      >
        {props.milestone.milestoneCompleted && (
          <IconCheck className="h-3 w-3 text-primary-foreground" />
        )}
      </div>
      <div className="flex flex-col border-y border-border py-4">
        <h4
          className={`text-base font-medium ${props.milestone.milestoneCompleted ? "text-primary" : ""}`}
        >
          {props.milestone.milestone}
        </h4>
        <p className="text-sm text-muted-foreground mt-1">{props.milestone.milestoneDescription}</p>
        <div className="flex flex-col md:flex-row justify-start items-center gap-5 mt-4">
          <p className="flex gap-2 items-center text-sm text-muted-foreground border rounded-full px-2 shadow-xs">
            <span className="font-mono text-xs">TARGET DATE</span>
            <IconCircleFilled className="size-1 text-muted-foreground" />
            <span className="font-bold uppercase text-xs">
              {format(new Date(props.milestone.milestoneTargetDate), "MMMM d, yyyy")}
            </span>
          </p>
          <IconSquareRotatedFilled className="size-2 text-muted-foreground" />
          {props.milestone.milestoneCompleted ? (
            <Badge className="font-black w-fit bg-green-500/10 text-green-600 border-green-500/20">
              COMPLETED
            </Badge>
          ) : (
            deadlinePassed ? (
              <Badge className="text-xs text-destructive! font-black w-fit bg-destructive/10 border-destructive/20">
                DEADLINE PASSED
              </Badge>
            ) : (
              <Button
                variant={deadlinePassed ? "outline" : "outline"}
                size="tiny"
                className="w-fit text-xs"
                asChild
              >
                <Link
                  href={`/ambitions/${props.ambitionId}?mark_milestone_as_completed=${props.milestone.id}`}
                  prefetch={true}
                >
                  <IconCheck className="text-green-500" />
                  Mark as Complete
                </Link>
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
