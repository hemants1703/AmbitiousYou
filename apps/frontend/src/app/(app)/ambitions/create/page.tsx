import CreateAmbitionForm from "@/components/(app)/ambitions/create-ambition-form";
import { MotionWrapper } from "@/components/motion-wrapper";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, SparklesIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Create Ambition",
};

export default function CreateAmbitionPage() {
  return (
    <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-6 px-6 py-6 md:px-8 md:py-8">
      <MotionWrapper
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="flex flex-col gap-4 rounded-4xl border border-border/70 bg-background/70 p-6 shadow-md ring-1 ring-foreground/5 backdrop-blur-xl md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <SparklesIcon className="size-4" />
            <span>Ambitions</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Create a new ambition</h1>
            <p className="max-w-2xl text-balance text-muted-foreground">Capture the goal, choose how progress will be tracked, and add the first tasks or milestones that will keep it moving.</p>
          </div>
        </div>

        <Button asChild variant="outline" className="w-full md:w-auto">
          <Link href="/ambitions" className="flex items-center justify-center gap-2">
            <ArrowLeftIcon className="size-4" />
            Back to ambitions
          </Link>
        </Button>
      </MotionWrapper>

      <CreateAmbitionForm />
    </div>
  );
}
