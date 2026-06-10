import EditAmbitionForm from "@/components/(app)/ambitions/(ambitionId)/edit-ambition/edit-ambition-form";
import { MotionWrapper } from "@/components/motion-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AmbitionDetails, getAmbitionDetails } from "@/lib/api/ambitions/get-ambition-details";
import { requireUser } from "@/lib/auth";
import { CalendarRangeIcon, ChevronLeftIcon, ListChecksIcon, LockIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { cache, type ReactNode } from "react";

interface EditAmbitionPageProps {
  params: Promise<{ ambitionId: string }>;
}

const getAmbitionData = cache(async (sessionToken: string, ambitionId: string): Promise<AmbitionDetails | null> => {
  return await getAmbitionDetails(sessionToken, ambitionId);
});

export async function generateMetadata(props: EditAmbitionPageProps): Promise<Metadata> {
  const { sessionToken } = await requireUser();
  const { ambitionId } = await props.params;
  const ambition = await getAmbitionData(sessionToken, ambitionId);

  return {
    title: ambition ? `Edit · ${ambition.ambitionName}` : "Edit ambition",
  };
}

function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

export default async function EditAmbitionPage(props: EditAmbitionPageProps) {
  const { sessionToken } = await requireUser();

  const { ambitionId } = await props.params;

  const ambition = await getAmbitionData(sessionToken, ambitionId);
  if (!ambition) {
    throw new Error(`Failed to fetch ambition ${ambitionId}`);
  }

  const dateWindowLabel = `${formatDate(ambition.ambitionStartDate)} – ${formatDate(ambition.ambitionEndDate)}`;

  return (
    <div className="mx-auto flex w-full max-w-350 flex-col">
      <MotionWrapper initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.1 }} className="flex flex-col gap-4 pb-8">
        <Button asChild variant="outline" size="sm" className="w-fit rounded-full bg-background/80">
          <Link prefetch={true} href={`/ambitions/${ambition.id}`}>
            <ChevronLeftIcon className="size-4" />
            Back to ambition
          </Link>
        </Button>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-balance">Edit ambition</h1>
          <p className="text-muted-foreground">
            Update the name, definition, and priority for <span className="font-medium text-foreground">{ambition.ambitionName}</span>.
          </p>
        </div>
      </MotionWrapper>

      <MotionWrapper initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="grid items-start gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="py-2">
            <EditAmbitionForm
              ambitionId={ambition.id}
              ambitionName={ambition.ambitionName}
              ambitionDefinition={ambition.ambitionDefinition ?? ""}
              ambitionPriority={ambition.ambitionPriority ?? "medium"}
              isFavourited={ambition.isFavourited ?? false}
              ambitionStartDate={new Date(ambition.ambitionStartDate).toISOString()}
              ambitionEndDate={new Date(ambition.ambitionEndDate).toISOString()}
            />
          </CardContent>
        </Card>

        <aside aria-label="Fixed at creation" className="lg:col-span-1">
          <Card className="bg-muted/30">
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <LockIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <h2 className="text-sm font-semibold tracking-tight">Fixed at creation</h2>
              </div>
              <p className="text-sm text-muted-foreground">A few things lock in when an ambition is created and can&rsquo;t be changed here.</p>

              <div className="space-y-3">
                <LockedDetail icon={<CalendarRangeIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />} label="Active window" value={dateWindowLabel} />
              </div>

              <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
                <ListChecksIcon className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                <span>
                  Manage individual moves from the{" "}
                  <Link prefetch={true} href={`/ambitions/${ambition.id}`} className="font-medium text-foreground underline-offset-4 hover:underline">
                    detail page
                  </Link>
                  .
                </span>
              </p>
            </CardContent>
          </Card>
        </aside>
      </MotionWrapper>
    </div>
  );
}

interface LockedDetailProps {
  icon: ReactNode;
  label: string;
  value: string;
}

function LockedDetail(props: LockedDetailProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/60 px-3 py-2.5">
      {props.icon}
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{props.label}</p>
        <p className="truncate text-sm font-medium">{props.value}</p>
      </div>
    </div>
  );
}
