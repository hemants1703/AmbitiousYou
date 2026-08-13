import { FadeIn } from "@/components/motion-wrapper";
import * as Card from "@/components/ui/card";
import { CalendarIcon, ChevronRightIcon, HeartIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { AmbitionPriorityBadge } from "./ambition-priority-badge";
import { AmbitionStatusBadge } from "./ambition-status-badge";
import { Ambition } from "@/types";

interface AmbitionCardProps {
  ambition: Ambition;
  index: number;
}

export default function AmbitionCard(props: AmbitionCardProps) {
  const progressPercentage = Math.min(Math.max(props.ambition.ambitionPercentageCompleted, 0), 100);
  const progressDelayMs = 300 + props.index * 100;
  const definition = props.ambition.ambitionDefinition?.trim();

  return (
    <Card.Card
      className="group cursor-pointer shadow-sm hover:shadow-md active:shadow-none gap-2 bg-linear-to-t from-foreground/5 via-foreground/2.5 transition-transform duration-75 ease-in-out hover:-translate-y-px active:translate-y-px active:scale-[0.99] active:brightness-80 dark:bg-linear-to-b">
      <Card.CardHeader className={definition ? "gap-1" : "gap-0"}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1.5">
            {props.ambition.isFavourited ? <HeartIcon className="mb-0.5 size-4 shrink-0 fill-pink-500 text-pink-500" aria-label="Favourited" /> : null}
            <Card.CardTitle className="line-clamp-1 wrap-anywhere">{props.ambition.ambitionName}</Card.CardTitle>
          </div>
          <AmbitionPriorityBadge ambitionPriority={props.ambition.ambitionPriority!} />
        </div>
        {definition ? <Card.CardDescription className="line-clamp-1 wrap-anywhere">{definition}</Card.CardDescription> : null}
      </Card.CardHeader>
      <Card.CardContent>
        <div>
          <div className="mb-1 flex justify-between text-sm">
            <span>Progress</span>
            <span className="tabular-nums">{progressPercentage.toFixed(0)}%</span>
          </div>
          <FadeIn delayMs={progressDelayMs}>
            <Progress value={progressPercentage} delayMs={progressDelayMs} className="h-1" />
          </FadeIn>
        </div>
      </Card.CardContent>
      <Card.CardFooter>
        <div className="flex w-full min-w-0 items-center justify-between gap-2">
          <AmbitionStatusBadge adaptive ambitionStatus={props.ambition.ambitionStatus!} />
          <div className="flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground">
            <CalendarIcon className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate tabular-nums">
              Due{" "}
              {new Date(props.ambition.ambitionEndDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <ChevronRightIcon className="size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
          </div>
        </div>
      </Card.CardFooter>
    </Card.Card>
  );
}
