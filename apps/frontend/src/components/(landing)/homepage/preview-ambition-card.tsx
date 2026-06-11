import { AmbitionPriorityBadge } from "@/components/(app)/ambitions/ambition-priority-badge";
import { AmbitionStatusBadge } from "@/components/(app)/ambitions/ambition-status-badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, ChevronRightIcon, HeartIcon, ListChecksIcon } from "lucide-react";

export interface PreviewAmbition {
  name: string;
  color: string;
  progress: number;
  priority: "high" | "medium" | "low";
  due: string;
  definition: string;
  favourited?: boolean;
}

interface PreviewAmbitionCardProps {
  ambition: PreviewAmbition;
  className?: string;
}

/**
 * Static marketing mirror of the real dashboard ambition card
 * (src/components/(app)/ambitions/ambition-card.tsx) — same layout, same
 * badges, no interactivity. Keep the two in visual sync.
 */
export default function PreviewAmbitionCard(props: PreviewAmbitionCardProps) {
  return (
    <Card className={props.className}>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="mt-2 flex min-w-0 items-center gap-1.5">
            {props.ambition.favourited ? <HeartIcon aria-hidden="true" className="mb-1 size-4 shrink-0 fill-pink-500 text-pink-500" /> : null}
            <CardTitle className="line-clamp-1">{props.ambition.name}</CardTitle>
          </div>
          <AmbitionPriorityBadge ambitionPriority={props.ambition.priority} />
        </div>
        <CardDescription className="line-clamp-2">{props.ambition.definition}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span>Progress</span>
              <span className="tabular-nums">{props.ambition.progress}%</span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-primary/20">
              <div className="h-full rounded-full" style={{ width: `${props.ambition.progress}%`, backgroundColor: props.ambition.color }} />
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <ListChecksIcon className="size-3.5" />
              <span className="text-xs font-black uppercase tracking-tighter">Moves</span>
            </div>
            <div className="flex items-center gap-1">
              <CalendarIcon className="size-3.5" />
              <span>Due {props.ambition.due}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-center justify-between">
          <AmbitionStatusBadge ambitionStatus="active" />
          <ChevronRightIcon aria-hidden="true" className="size-4" />
        </div>
      </CardFooter>
    </Card>
  );
}
