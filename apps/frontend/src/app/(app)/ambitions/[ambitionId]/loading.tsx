import * as Card from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AmbitionDetailLoading() {
  return (
    <section className="w-full pb-8" aria-hidden="true">
      <div className="mx-auto flex w-full max-w-350 flex-col gap-6">
        <Skeleton className="h-9 w-44 rounded-full" />

        <Card.Card>
          <Card.CardContent className="space-y-6 px-4 sm:px-6 lg:px-8 py-6">
            <div className="space-y-3">
              <Skeleton className="h-10 w-2/3 max-w-md" />
              <Skeleton className="h-4 w-full max-w-2xl" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-28 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </div>
            <Skeleton className="h-1 w-full" />
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-24 w-full rounded-2xl" />
              ))}
            </div>
          </Card.CardContent>
        </Card.Card>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(360px,1fr)]">
          <div className="space-y-6">
            <Card.Card>
              <Card.CardHeader>
                <Skeleton className="h-6 w-56" />
                <Skeleton className="h-4 w-80 max-w-full" />
              </Card.CardHeader>
              <Card.CardContent className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-20 w-full rounded-2xl" />
                ))}
              </Card.CardContent>
            </Card.Card>
            <Card.Card>
              <Card.CardHeader>
                <Skeleton className="h-6 w-40" />
              </Card.CardHeader>
              <Card.CardContent className="space-y-3">
                {Array.from({ length: 2 }).map((_, index) => (
                  <Skeleton key={index} className="h-16 w-full rounded-2xl" />
                ))}
              </Card.CardContent>
            </Card.Card>
          </div>
          <div className="space-y-6">
            <Card.Card>
              <Card.CardHeader>
                <Skeleton className="h-6 w-36" />
              </Card.CardHeader>
              <Card.CardContent className="space-y-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-10 w-full rounded-2xl" />
                ))}
              </Card.CardContent>
            </Card.Card>
            <Card.Card>
              <Card.CardHeader>
                <Skeleton className="h-6 w-24" />
              </Card.CardHeader>
              <Card.CardContent>
                <Skeleton className="h-24 w-full rounded-2xl" />
              </Card.CardContent>
            </Card.Card>
          </div>
        </div>
      </div>
    </section>
  );
}
