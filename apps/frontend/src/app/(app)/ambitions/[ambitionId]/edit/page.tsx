import EditAmbitionForm from "@/components/(app)/ambitions/(ambitionId)/edit-ambition/edit-ambition-form";
import { MotionWrapper } from "@/components/motion-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AmbitionDetails, getAmbitionDetails } from "@/lib/api/ambitions/get-ambition-details";
import { getUser } from "@/lib/api/sidebar/get-user";
import { getSessionToken } from "@/lib/auth";
import { ChevronLeftIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { redirect, RedirectType } from "next/navigation";
import { cache } from "react";

interface EditAmbitionPageProps {
  params: Promise<{ ambitionId: string }>;
}

const getAmbitionData = cache(async (sessionToken: string, ambitionId: string): Promise<AmbitionDetails | null> => {
  return await getAmbitionDetails(sessionToken, ambitionId);
});

export async function generateMetadata(props: EditAmbitionPageProps): Promise<Metadata> {
  const sessionToken = await getSessionToken();
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
  const sessionToken = await getSessionToken();
  const userDetails = await getUser(sessionToken);

  if (!userDetails) {
    return redirect("/login", RedirectType.replace);
  }

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

      <MotionWrapper initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
        <Card>
          <CardContent className="py-2">
            <EditAmbitionForm
              ambitionId={ambition.id}
              ambitionName={ambition.ambitionName}
              ambitionDefinition={ambition.ambitionDefinition ?? ""}
              ambitionPriority={ambition.ambitionPriority ?? "medium"}
              isFavourited={ambition.isFavourited ?? false}
              ambitionTrackingMethod={ambition.ambitionTrackingMethod}
              ambitionStartDate={new Date(ambition.ambitionStartDate).toISOString()}
              ambitionEndDate={new Date(ambition.ambitionEndDate).toISOString()}
              dateWindowLabel={dateWindowLabel}
            />
          </CardContent>
        </Card>
      </MotionWrapper>
    </div>
  );
}
