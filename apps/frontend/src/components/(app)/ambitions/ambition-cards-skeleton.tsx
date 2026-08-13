import * as Card from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarIcon, ChevronRightIcon } from "lucide-react";

/** Card grid placeholder — static labels match AmbitionCard; only API fields pulse. */
export function AmbitionCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3" aria-busy="true" aria-label="Loading ambitions">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card.Card key={index} className="gap-2">
          <Card.CardHeader className="gap-0">
            <div className="flex items-center justify-between gap-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </Card.CardHeader>
          <Card.CardContent>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <Skeleton className="h-4 w-8" />
              </div>
              <Skeleton className="h-1 w-full" />
            </div>
          </Card.CardContent>
          <Card.CardFooter>
            <div className="flex w-full min-w-0 items-center justify-between gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <CalendarIcon className="size-3.5 shrink-0" aria-hidden="true" />
                <Skeleton className="h-4 w-24" />
                <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground/40" aria-hidden="true" />
              </div>
            </div>
          </Card.CardFooter>
        </Card.Card>
      ))}
    </div>
  );
}
