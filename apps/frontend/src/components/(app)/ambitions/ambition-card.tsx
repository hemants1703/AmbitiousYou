import { MotionWrapper } from "@/components/motion-wrapper";
import * as Card from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CalendarIcon, ChevronRightIcon, HeartIcon, ListChecksIcon } from "lucide-react";
import { AmbitionPriorityBadge } from "./ambition-priority-badge";
import { AmbitionStatusBadge } from "./ambition-status-badge";
import { Ambition } from "@ambitiousyou/shared/types";

interface AmbitionCardProps {
  ambition: Ambition;
  index: number;
  completedTasksOrMilestones: number;
  totalTasksOrMilestones: number;
}

export default function AmbitionCard(props: AmbitionCardProps) {
  const progressPercentage = Math.min(Math.max(props.ambition.ambitionPercentageCompleted, 0), 100);

  return (
    <Card.Card className="bg-linear-to-t from-foreground/5 via-foreground/2.5 dark:bg-linear-to-b cursor-pointer ambition-card active:scale-[0.99] active:translate-y-px active:brightness-80 hover:-translate-y-1 transition-transform duration-75 ease-in-out">
      <Card.CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="mt-2 flex min-w-0 items-center gap-1.5">
            {props.ambition.isFavourited ? <HeartIcon className="mb-1 size-4 shrink-0 fill-pink-500 text-pink-500" aria-label="Favourited" /> : null}
            <Card.CardTitle className="line-clamp-1 wrap-anywhere">{props.ambition.ambitionName}</Card.CardTitle>
          </div>
          <AmbitionPriorityBadge ambitionPriority={props.ambition.ambitionPriority!} />
        </div>
        <Card.CardDescription className="line-clamp-1 wrap-anywhere">{props.ambition.ambitionDefinition || "\u00A0"}</Card.CardDescription>
      </Card.CardHeader>
      <Card.CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1 text-sm">
              <span>Progress</span>
              <span className="tabular-nums">{progressPercentage.toFixed(0)}%</span>
            </div>
            <MotionWrapper
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{
                duration: 0.5,
                delay: 0.3 + 0.1 * props.index,
              }}>
              <Progress value={progressPercentage} className="h-1" />
            </MotionWrapper>
          </div>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center justify-start gap-1">
              <ListChecksIcon className="size-3.5" />
              <span className="text-xs tracking-tighter font-black uppercase">Moves</span>
            </div>
            <div className="flex items-center gap-1">
              <CalendarIcon className="size-3.5" />
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
            <ChevronRightIcon className="h-4 w-4" />
          </MotionWrapper>
        </div>
      </Card.CardFooter>
    </Card.Card>
  );
}
