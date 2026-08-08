import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarRangeIcon, SunriseIcon } from "lucide-react";
import { LocalTodayLabel } from "./local-today-label";

export function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2" aria-hidden="true">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SunriseIcon className="size-4 text-foreground" />
            Today
          </CardTitle>
          <CardDescription>
            <span className="font-semibold text-foreground">
              <LocalTodayLabel />
            </span>{" "}
            · everything due today or overdue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-16 w-full rounded-2xl" />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarRangeIcon className="size-4 text-foreground" />
            Coming up
          </CardTitle>
          <CardDescription>The next two days, so nothing sneaks up.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full rounded-2xl" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
