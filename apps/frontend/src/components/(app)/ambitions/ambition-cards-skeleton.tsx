import * as Card from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarIcon, ChevronRightIcon, ListChecksIcon } from "lucide-react";

/** Card grid placeholder — static labels match AmbitionCard; only API fields pulse. */
export function AmbitionCardsSkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
      aria-busy="true"
      aria-label="Loading ambitions"
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <Card.Card key={index}>
          <Card.CardHeader>
            <div className="mt-2 flex items-center justify-between gap-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-56 max-w-full" />
          </Card.CardHeader>
          <Card.CardContent>
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <Skeleton className="h-4 w-8" />
                </div>
                <Skeleton className="h-1 w-full" />
              </div>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center justify-start gap-1">
                  <ListChecksIcon className="size-3.5" />
                  <span className="text-xs font-black uppercase tracking-tighter">Moves</span>
                </div>
                <div className="flex items-center gap-1">
                  <CalendarIcon className="size-3.5" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>
            </div>
          </Card.CardContent>
          <Card.CardFooter>
            <div className="flex w-full items-center justify-between">
              <Skeleton className="h-5 w-20 rounded-full" />
              <ChevronRightIcon className="size-4 text-muted-foreground/40" aria-hidden="true" />
            </div>
          </Card.CardFooter>
        </Card.Card>
      ))}
    </div>
  );
}
