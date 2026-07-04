import { FadeIn } from "@/components/motion-wrapper";
import * as Card from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CalendarIcon, ChevronRightIcon, HeartIcon, ListChecksIcon } from "lucide-react";
import { AmbitionPriorityBadge } from "./ambition-priority-badge";
import { AmbitionStatusBadge } from "./ambition-status-badge";
import { Ambition } from "@ambitiousyou/shared/types";

interface AmbitionCardProps {
  ambition: Ambition;
  index: number;
  completedTasksOrMilestones?: number;
  totalTasksOrMilestones?: number;
}

export default function AmbitionCard(props: AmbitionCardProps) {
  const progressPercentage = Math.min(Math.max(props.ambition.ambitionPercentageCompleted, 0), 100);

  return (
    <Card.Card className="group ambition-card cursor-pointer bg-linear-to-t from-foreground/5 via-foreground/2.5 transition-transform duration-75 ease-in-out hover:-translate-y-1 active:translate-y-px active:scale-[0.99] active:brightness-80 dark:bg-linear-to-b">
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
            <div className="mb-1 flex justify-between text-sm">
              <span>Progress</span>
              <span className="tabular-nums">{progressPercentage.toFixed(0)}%</span>
            </div>
            <FadeIn delayMs={300 + props.index * 100}>
              <Progress value={progressPercentage} className="h-1" />
            </FadeIn>
          </div>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center justify-start gap-1">
              <ListChecksIcon className="size-3.5" />
              <span className="text-xs font-black uppercase tracking-tighter">Moves</span>
            </div>
            <div className="flex items-center gap-1">
              <CalendarIcon className="size-3.5" />
              <span className="tabular-nums">
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
        <div className="flex w-full items-center justify-between">
          <AmbitionStatusBadge ambitionStatus={props.ambition.ambitionStatus!} />
          <ChevronRightIcon className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
        </div>
      </Card.CardFooter>
    </Card.Card>
  );
}
