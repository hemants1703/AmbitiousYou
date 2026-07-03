import CreateAmbitionForm from "@/components/(app)/ambitions/create-ambition-form";
import { MotionWrapper } from "@/components/motion-wrapper";
import { brandCopy } from "@/lib/brand";
import { requireUser } from "@/lib/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Ambition",
};

interface CreateAmbitionPageProps {
  searchParams: Promise<{ initiation?: string }>;
}

export default async function CreateAmbitionPage(props: CreateAmbitionPageProps) {
  await requireUser();

  const searchParams = await props.searchParams;
  const isInitiation = searchParams.initiation === "1";

  return (
    <div className="mx-auto flex w-full max-w-screen-2xl flex-col">
      <MotionWrapper initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.1 }} className="flex flex-col md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-3 pb-10">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">{isInitiation ? brandCopy.initiation.heading : "Create a new ambition"}</h1>
            <p className="text-balance text-muted-foreground">
              {isInitiation ? brandCopy.initiation.subheading : "Capture the goal, choose how progress will be tracked, and add the first tasks or milestones that will keep it moving."}
            </p>
          </div>
        </div>
      </MotionWrapper>

      <MotionWrapper initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="flex flex-col md:flex-row md:items-end md:justify-between">
        <CreateAmbitionForm isInitiation={isInitiation} />
      </MotionWrapper>
    </div>
  );
}
