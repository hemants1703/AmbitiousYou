import { MotionWrapper } from "@/components/MotionWrapper";
import * as Card from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Ambition } from "@/db/schema";
import { IconCalendar, IconChevronRight, IconCircleCheck } from "@tabler/icons-react";
import { AmbitionPriorityBadge } from "./AmbitionPriorityBadge";
import { AmbitionStatusBadge } from "./AmbitionStatusBadge";
import "@/styles/AmbitionCard.css";

interface AmbitionCardProps {
  ambition: Ambition;
  index: number;
  completedTasksOrMilestones: number;
  totalTasksOrMilestones: number;
}

export default function AmbitionCard(props: AmbitionCardProps) {
  return (
    <div
      style={
        {
          "--ambition-color": props.ambition.ambitionColor,
        } as React.CSSProperties
      }
      className="ambition-card active:scale-[0.99] active:translate-y-px active:brightness-80"
    >
      <Card.Card className="bg-transparent cursor-pointer">
        <Card.CardHeader>
          <div className="flex items-center justify-between">
            <Card.CardTitle className="mt-2 line-clamp-1">
              {props.ambition.ambitionName}
            </Card.CardTitle>
            <AmbitionPriorityBadge ambitionPriority={props.ambition.ambitionPriority!} />
          </div>
          <Card.CardDescription className="line-clamp-1">
            {props.ambition.ambitionDefinition || "\u00A0"}
          </Card.CardDescription>
        </Card.CardHeader>
        <Card.CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Progress</span>
                <span>{props.ambition.ambitionPercentageCompleted}%</span>
              </div>
              <MotionWrapper
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{
                  duration: 0.5,
                  delay: 0.3 + 0.1 * props.index,
                }}
              >
                <Progress
                  value={props.ambition.ambitionPercentageCompleted}
                  className={`h-2 [&>[data-slot=progress-indicator]]:bg-[(${props.ambition.ambitionColor})]`}
                />
              </MotionWrapper>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <IconCircleCheck className="h-3.5 w-3.5" />
                <span>
                  {props.completedTasksOrMilestones}/{props.totalTasksOrMilestones}{" "}
                  {props.ambition.ambitionTrackingMethod}s
                </span>
              </div>
              <div className="flex items-center gap-1">
                <IconCalendar className="h-3.5 w-3.5" />
                <span>
                  Due{" "}
                  {new Date(props.ambition.ambitionEndDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </Card.CardContent>
        <Card.CardFooter>
          <div className="flex justify-between items-center w-full">
            <AmbitionStatusBadge ambitionStatus={props.ambition.ambitionStatus!} />
            <MotionWrapper whileHover={{ x: 3 }} transition={{ duration: 0.2 }}>
              <IconChevronRight className="h-4 w-4" />
            </MotionWrapper>
          </div>
        </Card.CardFooter>
      </Card.Card>
    </div>
  );
}
