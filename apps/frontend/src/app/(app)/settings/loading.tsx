import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Instant-navigation fallback for /settings. Next renders this the moment the
 * user navigates here — before the server validates the session and loads
 * settings — so moving to settings feels like /dashboard and /ambitions.
 * Mirrors the real page (title → side tabs → content card) to avoid CLS.
 */
export default function SettingsLoading() {
  return (
    <section className="w-full pb-8" aria-hidden="true">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="space-y-1.5">
          <Skeleton className="h-9 w-36" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>

        <div className="flex w-full flex-col gap-6 lg:flex-row lg:gap-8">
          <nav className="lg:w-52 lg:shrink-0">
            <div className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-x-visible lg:pb-0">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="flex min-w-fit items-center gap-3 rounded-xl px-3 py-2.5 lg:w-full"
                >
                  <Skeleton className="size-4 shrink-0" />
                  <div className="hidden space-y-1.5 lg:block">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                  <Skeleton className="h-4 w-16 lg:hidden" />
                </div>
              ))}
            </div>
          </nav>

          <div className="min-w-0 flex-1 space-y-4">
            <Card>
              <CardHeader className="gap-2">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-4 w-56 max-w-full" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Skeleton className="size-16 shrink-0 rounded-full" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-56 max-w-full" />
                  </div>
                </div>
                <Skeleton className="h-20 w-full rounded-2xl" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="gap-2">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-4 w-64 max-w-full" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-16 w-full rounded-2xl" />
                <Skeleton className="h-16 w-full rounded-2xl" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
