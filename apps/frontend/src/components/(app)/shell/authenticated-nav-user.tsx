import { NavUser } from "@/components/nav-user";
import { Skeleton } from "@/components/ui/skeleton";
import { requireUser } from "@/lib/auth";

/**
 * Request-time user chip for the app sidebar. Kept outside any `use cache`
 * scope so `redirect()` on an invalid session is never cached.
 */
export async function AuthenticatedNavUser() {
  const { user } = await requireUser();
  return <NavUser userDetails={user} />;
}

export function NavUserSkeleton() {
  return (
    <div className="flex items-center gap-2 px-2 py-2" aria-hidden="true">
      <Skeleton className="size-8 shrink-0 rounded-full" />
      <div className="grid flex-1 gap-1.5">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
}
