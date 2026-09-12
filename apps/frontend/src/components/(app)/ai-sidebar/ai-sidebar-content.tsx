import { AiSidebarShell } from "./ai-sidebar-shell";
import { getAttentionCoach } from "@/lib/api/loop/get-loop-data";
import { Skeleton } from "@/components/ui/skeleton";

interface AiSidebarContentProps {
  sessionToken: string;
  ambitionId?: string;
}

export function AiSidebarContent(props: AiSidebarContentProps) {
  const coachPromise = getAttentionCoach(props.sessionToken);

  return <AiSidebarShell ambitionId={props.ambitionId} coachPromise={coachPromise} />;
}

export function AiSidebarContentSkeleton() {
  return (
    <div className="flex size-full min-h-0 flex-col gap-4 p-4 md:p-5">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-9 w-full" />
      <Skeleton className="min-h-40 w-full flex-1" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
}
