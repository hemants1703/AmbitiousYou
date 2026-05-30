import CreateAmbitionForm from "@/components/(app)/ambitions/create-ambition-form";
import { MotionWrapper } from "@/components/motion-wrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Ambition",
};

export default function CreateAmbitionPage() {
  return (
    <div className="mx-auto flex w-full max-w-screen-2xl flex-col">
      <MotionWrapper initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.1 }} className="flex flex-col md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-3 pb-10">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Create a new ambition</h1>
            <p className="maxtext-balance text-muted-foreground">Capture the goal, choose how progress will be tracked, and add the first tasks or milestones that will keep it moving.</p>
          </div>
        </div>
      </MotionWrapper>

      <MotionWrapper initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="flex flex-col md:flex-row md:items-end md:justify-between">
        <CreateAmbitionForm />
      </MotionWrapper>
    </div>
  );
}
