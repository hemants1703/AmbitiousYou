"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  CheckCircle2,
  CircleIcon,
  ListIcon,
  ScrollText,
  InfoIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import "./exampleAmbitionAnimation.css";
import "./gradientAnimation.css";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import exampleAmbitions from "./exampleAmbitions";
import { AmbitionData, AmbitionMilestone, AmbitionTask } from "@/types";

interface AmbitionPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exampleAmbition: {
    ambition: AmbitionData;
    tasks?: AmbitionTask[];
    milestones?: AmbitionMilestone[];
  } | null;
  onAccept: () => void;
}

function AmbitionPreviewDialog({
  open,
  onOpenChange,
  exampleAmbition,
  onAccept,
}: AmbitionPreviewDialogProps) {
  if (!exampleAmbition) return null;

  const { ambition, tasks, milestones } = exampleAmbition;
  const trackingItems = ambition.ambitionTrackingMethod === "task" ? tasks : milestones;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl md:max-w-4xl max-h-[85vh] overflow-y-auto px-4 py-5 sm:p-6 border-[var(--custom-light-pale)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-bottom-[2%] data-[state=open]:slide-in-from-bottom-[2%]">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <span className="text-[var(--custom-dark)]">{ambition.ambitionName}</span>
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-foreground/70">
            {ambition.ambitionDefinition}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4">
          {/* Left column */}
          <div className="space-y-6">
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-[var(--custom-light)]" />
                  Progress
                </span>
                <span className="text-foreground/70">
                  {ambition.ambitionPercentageCompleted}% Complete
                </span>
              </div>
              <Progress
                value={ambition.ambitionPercentageCompleted}
                className="h-2.5 bg-[var(--custom-light-pale)]/30 [&>[data-slot=progress-indicator]]:bg-[var(--custom-light)]"
              />
            </div>

            {/* Tasks or Milestones */}
            <div className="space-y-3 bg-muted/40 rounded-lg p-3 sm:p-4">
              <h3 className="font-semibold flex items-center gap-1.5">
                <ListIcon className="w-4 h-4 text-[var(--custom-light)]" />
                {ambition.ambitionTrackingMethod === "task" ? "Tasks" : "Milestones"}
              </h3>
              <div className="space-y-1.5">
                {trackingItems && trackingItems.length > 0 ? (
                  trackingItems.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="flex-shrink-0">
                        {ambition.ambitionTrackingMethod === "task" ? (
                          item.taskCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-[var(--custom-completed)]" />
                          ) : (
                            <CircleIcon className="w-4 h-4 text-muted-foreground/50" />
                          )
                        ) : item.milestoneCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-[var(--custom-completed)]" />
                        ) : (
                          <CircleIcon className="w-4 h-4 text-muted-foreground/50" />
                        )}
                      </div>
                      <span className="text-sm">
                        {ambition.ambitionTrackingMethod === "task" ? item.task : item.milestone}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No {ambition.ambitionTrackingMethod === "task" ? "tasks" : "milestones"} added
                    yet
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Notes */}
            <div className="space-y-2 bg-muted/40 rounded-lg p-3 sm:p-4">
              <h3 className="font-semibold flex items-center gap-1.5">
                <ScrollText className="w-4 h-4 text-[var(--custom-light)]" />
                Notes
              </h3>
              <p className="text-sm text-muted-foreground italic">No notes added yet</p>
            </div>

            {/* Details */}
            <div className="space-y-3 bg-muted/40 rounded-lg p-3 sm:p-4">
              <h3 className="font-semibold flex items-center gap-1.5">
                <InfoIcon className="w-4 h-4 text-[var(--custom-light)]" />
                Details
              </h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div className="text-muted-foreground">Category:</div>
                <div>{ambition.ambitionCategory}</div>

                <div className="text-muted-foreground">Priority:</div>
                <div className="capitalize">{ambition.ambitionPriority}</div>

                <div className="text-muted-foreground">Deadline:</div>
                <div>
                  {ambition.ambitionDeadline
                    ? new Date(ambition.ambitionDeadline).toLocaleDateString()
                    : "None"}
                </div>

                <div className="text-muted-foreground">Status:</div>
                <div className="capitalize">{ambition.ambitionStatus}</div>

                <div className="text-muted-foreground">Tracking method:</div>
                <div className="capitalize">{ambition.ambitionTrackingMethod}</div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6 flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto order-1 sm:order-none hover:border-[var(--custom-light-pale)] hover:text-foreground/70"
          >
            Cancel
          </Button>
          <Button
            onClick={onAccept}
            className="w-full sm:w-auto bg-[var(--custom-dark)] hover:bg-[var(--custom-light)] transition-colors duration-300 group"
          >
            Use This Ambition
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ExampleAmbitions({ onSelect }: { onSelect: (example: string) => void }) {
  const [selectedAmbition, setSelectedAmbition] = useState<{
    ambition: AmbitionData;
    tasks?: AmbitionTask[];
    milestones?: AmbitionMilestone[];
  } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAmbitionSelect = (example: {
    ambition: AmbitionData;
    tasks?: AmbitionTask[];
    milestones?: AmbitionMilestone[];
  }) => {
    setSelectedAmbition(example);
    setDialogOpen(true);
  };

  const handleAcceptAmbition = () => {
    if (selectedAmbition) {
      onSelect(selectedAmbition.ambition.ambitionName);
      setDialogOpen(false);
    }
  };

  return (
    <>
      <div className="space-y-2 bg-background backdrop-blur-sm rounded-lg p-4 w-full max-md:hidden">
        <div className="space-y-2">
          {exampleAmbitions.map((category, idx) => (
            <div key={idx} className="space-y-1">
              <h3 className="text-xs text-foreground/50 font-black uppercase tracking-wider px-1">
                {category.category}
              </h3>
              <div className="ambition-row">
                <div
                  className={`ambition-row-content ${idx % 2 === 0 ? "roll-left" : "roll-right"}`}
                >
                  {/* Repeat examples 3 times for the animation effect */}
                  {[...category.examples, ...category.examples, ...category.examples].map(
                    (example, exampleIdx) => (
                      <button
                        key={exampleIdx}
                        onClick={() => handleAmbitionSelect(example)}
                        className="ambition-card px-3 py-2 rounded-md border border-[var(--custom-light-pale)]/30 
                                    hover:border-[var(--custom-light)] hover:bg-[var(--custom-light-pale)]/10 
                                    hover:shadow-sm hover:shadow-[var(--custom-light)]/20
                                    transition-all text-sm group"
                      >
                        <div className="flex items-center gap-2 w-full">
                          <span className="flex-1 truncate">{example.ambition.ambitionName}</span>
                          <ArrowRight className="h-3.5 w-3.5 text-[var(--custom-light)] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                        </div>
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AmbitionPreviewDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        exampleAmbition={selectedAmbition}
        onAccept={handleAcceptAmbition}
      />
    </>
  );
}

export function OnboardingClient({ step }: { step: number }) {
  const router = useRouter();
  const [ambition, setAmbition] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedAmbition, setGeneratedAmbition] = useState<any>(null);
  const [editableAmbition, setEditableAmbition] = useState<any>(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/onboarding/user/free`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ambition }),
      });
      const data = await response.json();
      if (data.success) {
        setGeneratedAmbition(data.googleGenAIResponse);
        setEditableAmbition({ ...data.googleGenAIResponse });
        router.push("/onboarding?step=3");
      }
    } catch (error) {
      toast.error("Error generating ambition:", {
        description: "Please try again later.",
        duration: 5000,
      });
      console.error("Error generating ambition:", error);
    }
    setIsLoading(false);
  };

  // Main content for each step
  const renderMainContent = () => {
    switch (step) {
      case 1:
        return (
          <></>
          // <div className="grid md:grid-cols-3 gap-6 h-full">
          //     {features.map((feature, index) => (
          //         <div
          //             key={index}
          //             className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border hover:border-primary/50 transition-all"
          //         >
          //             <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          //                 {feature.icon}
          //             </div>
          //             <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
          //             <p className="text-muted-foreground">{feature.description}</p>
          //         </div>
          //     ))}
          // </div>
        );
      case 2:
        return (
          <div className="space-y-6 flex flex-col justify-center items-center h-full">
            <div className="flex items-center gap-3 text-foreground w-full">
              <div className="h-10 w-10 rounded-full bg-[var(--custom-light)]/20 flex items-center justify-center">
                <span className="text-xl">👋</span>
              </div>
              <div className="space-y-1">
                <p className="font-bold">Hi, I'm Cynthia!</p>
                <p className="text-sm text-foreground/60">
                  Tell me your ambition, and I'll help you make it a reality! ✨
                </p>
              </div>
            </div>

            {/* Priority 1: Input Area */}
            <div className="relative group w-full">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--custom-light)] via-[var(--custom-dark)] to-[var(--custom-light-pale)] rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-x"></div>
              <div className="relative">
                <Input
                  placeholder="e.g., I want to learn to play the piano and perform at a local venue within 6 months"
                  className="w-full text-lg bg-background/80 backdrop-blur-sm border-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-lg shadow-lg py-5 pl-12"
                  value={ambition}
                  onChange={(e) => setAmbition(e.target.value)}
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--custom-light)]">
                  <span className="text-xl">💭</span>
                </div>
              </div>
            </div>

            {/* Priority 2: Example Ambitions */}
            <ExampleAmbitions onSelect={setAmbition} />
          </div>
        );
      case 3:
        return editableAmbition ? (
          <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border space-y-6 h-full">
            {/* Ambition Details */}
            <div className="space-y-4">
              <label className="block font-semibold">Title</label>
              <input
                className="w-full p-2 rounded bg-background border border-border"
                value={editableAmbition.ambitionName || ""}
                onChange={(e) =>
                  setEditableAmbition({ ...editableAmbition, ambitionName: e.target.value })
                }
              />
              <label className="block font-semibold mt-4">Definition</label>
              <Textarea
                className="w-full min-h-[80px]"
                value={editableAmbition.ambitionDefinition || ""}
                onChange={(e) =>
                  setEditableAmbition({ ...editableAmbition, ambitionDefinition: e.target.value })
                }
              />
            </div>
            {/* Tracking Method */}
            <div className="mt-6">
              <label className="block font-semibold mb-2">Tracking Method</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={editableAmbition.trackingMethod === "task"}
                    onChange={() =>
                      setEditableAmbition({ ...editableAmbition, trackingMethod: "task" })
                    }
                  />
                  Task Based
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={editableAmbition.trackingMethod === "milestone"}
                    onChange={() =>
                      setEditableAmbition({ ...editableAmbition, trackingMethod: "milestone" })
                    }
                  />
                  Milestone Based
                </label>
              </div>
            </div>
            {/* Tasks or Milestones */}
            {editableAmbition.trackingMethod === "task" ? (
              <div className="mt-6">
                <label className="block font-semibold mb-2">Tasks</label>
                <ul className="space-y-2">
                  {(editableAmbition.tasks || []).map((task: any, idx: number) => (
                    <li key={idx} className="flex items-center gap-2">
                      <input
                        className="flex-1 p-2 rounded bg-background border border-border"
                        value={task.taskName || ""}
                        onChange={(e) => {
                          const newTasks = [...editableAmbition.tasks];
                          newTasks[idx].taskName = e.target.value;
                          setEditableAmbition({ ...editableAmbition, tasks: newTasks });
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditableAmbition({
                            ...editableAmbition,
                            tasks: editableAmbition.tasks.filter((_: any, i: number) => i !== idx),
                          });
                        }}
                      >
                        ✕
                      </Button>
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-2"
                  size="sm"
                  onClick={() =>
                    setEditableAmbition({
                      ...editableAmbition,
                      tasks: [...(editableAmbition.tasks || []), { taskName: "" }],
                    })
                  }
                >
                  + Add Task
                </Button>
              </div>
            ) : (
              <div className="mt-6">
                <label className="block font-semibold mb-2">Milestones</label>
                <ul className="space-y-2">
                  {(editableAmbition.milestones || []).map((milestone: any, idx: number) => (
                    <li key={idx} className="flex items-center gap-2">
                      <input
                        className="flex-1 p-2 rounded bg-background border border-border"
                        value={milestone.milestoneName || milestone.milestone || ""}
                        onChange={(e) => {
                          const newMilestones = [...editableAmbition.milestones];
                          newMilestones[idx].milestoneName = e.target.value;
                          setEditableAmbition({ ...editableAmbition, milestones: newMilestones });
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditableAmbition({
                            ...editableAmbition,
                            milestones: editableAmbition.milestones.filter(
                              (_: any, i: number) => i !== idx
                            ),
                          });
                        }}
                      >
                        ✕
                      </Button>
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-2"
                  size="sm"
                  onClick={() =>
                    setEditableAmbition({
                      ...editableAmbition,
                      milestones: [...(editableAmbition.milestones || []), { milestoneName: "" }],
                    })
                  }
                >
                  + Add Milestone
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            No plan generated yet. Please try again.
          </div>
        );
      default:
        return null;
    }
  };

  const isSubmitDisabled = !ambition.trim() || ambition.trim().length < 10 || isLoading;

  return (
    <div className={`max-w-5xl mx-auto space-y-8`}>
      <div
        className={cn(
          "flex-1 justify-center items-center max-w-5xl",
          step === 1 ? "" : "h-[400px]"
        )}
      >
        {renderMainContent()}
      </div>
      <OnboardingFooter
        router={router}
        step={step}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        isSubmitDisabled={isSubmitDisabled}
      />
    </div>
  );
}

// Footer component for all steps
function OnboardingFooter({
  router,
  step,
  onSubmit,
  isLoading,
  isSubmitDisabled,
}: {
  router: any;
  step: number;
  onSubmit: () => void;
  isLoading: boolean;
  isSubmitDisabled: boolean;
}) {
  const handleNext = () => {
    if (step < 3) {
      router.push(`/onboarding?step=${step + 1}`);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      router.push(`/onboarding?step=${step - 1}`);
    }
  };

  const handleSkip = () => {
    if (step < 3) {
      router.push(`/onboarding?step=${step + 1}`);
    }
  };

  return (
    <div
      className={`flex ${step === 1 ? "justify-center" : "justify-between"}  items-center mt-8 max-w-full mx-auto max-md:flex-col-reverse max-md:gap-10`}
    >
      {step > 1 && (
        <Button
          variant="link"
          size="sm"
          className="text-muted-foreground hover:text-foreground opacity-50"
          onClick={handleSkip}
        >
          Skip for now
        </Button>
      )}
      <div className="flex gap-4 items-center">
        {step > 1 && (
          <Button size="sm" variant="outline" onClick={handleBack} className="rounded-full">
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
        )}
        {step === 1 && (
          <Button size="lg" onClick={handleNext} className="rounded-full">
            Let's go!
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
        {step === 2 && (
          <Button
            size="lg"
            className="group hover:bg-[#64ccc5] rounded-full px-8"
            onClick={onSubmit}
            disabled={isSubmitDisabled}
          >
            {isLoading ? "Generating..." : "Plan out my ambition"}
            {/* {!isLoading && <Rocket className="ml-2 h-4 w-4" />} */}
            <span className="group-hover:rotate-45 transition-all duration-300 ease-in-out">
              {!isLoading && <span className="text-xl">🚀</span>}
            </span>
          </Button>
        )}
        {step === 3 && (
          <Button size="lg" className="px-8" asChild>
            <Link href="/dashboard">
              Save & Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
