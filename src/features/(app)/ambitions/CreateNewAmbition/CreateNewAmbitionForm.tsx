"use client";

import { MotionWrapper } from "@/components/MotionWrapper";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import * as Card from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as Popover from "@/components/ui/popover";
import * as RadioGroup from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import * as Tooltip from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { IconCalendar, IconCheck, IconChevronLeft, IconInfoCircle } from "@tabler/icons-react";
import { format, isBefore, setDate, startOfToday } from "date-fns";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { createNewAmbition, CreateNewAmbitionFormActionState } from "./actions";
import MilestoneAdditionFormSection from "./MilestoneAdditionFormSection";
import TasksAdditionFormSection from "./TasksAdditionFormSection";

const ambitionColorOptions = [
  // { name: "Radiant Yellow", value: "#FCDA03", class: "yellow-400" }, // Pure happiness, optimism, immediate mood lift
  { name: "Lively Orange", value: "#FF7733", class: "orange-500" }, // Enthusiasm, warmth, creativity, zest for life
  { name: "Electric Blue", value: "#00BFFF", class: "blue-400" }, // Invigorating, refreshing, clear, inspires confidence
  { name: "Lime Green", value: "#32CD32", class: "lime-500" }, // Freshness, vitality, growth, natural energy
  { name: "Hot Pink", value: "#FF69B4", class: "pink-400" }, // Playful, energetic, charming, universally cheerful
  { name: "Aqua Blue", value: "#00CED1", class: "cyan-400" }, // Serene yet vibrant, refreshing, calming but uplifting
  { name: "Amethyst Purple", value: "#9966CC", class: "purple-400" }, // Creative, inspiring, unique, adds a touch of uplifting magic
  { name: "Scarlet Red", value: "#FF2400", class: "red-500" }, // Powerful, energetic, passionate, stirs positive excitement
  // { name: "Lemon Yellow", value: "#FFF44F", class: "yellow-300" }, // Bright, crisp, pure joy, illuminates the spirit
  { name: "Coral Red", value: "#FF7F50", class: "red-400" }, // Warm, friendly, inviting, feels joyful and lively
];

export default function CreateNewAmbitionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formState, setFormState] = useState<CreateNewAmbitionFormActionState>(() => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("ambitionFormData");
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          return {
            ambitionName: parsedData.ambitionName || "",
            ambitionDefinition: parsedData.ambitionDefinition || "",
            ambitionPriority: parsedData.ambitionPriority || "medium",
            ambitionStartDate: parsedData.ambitionStartDate || "",
            ambitionEndDate: parsedData.ambitionEndDate || "",
            ambitionColor: parsedData.selectedColor || parsedData.ambitionColor || "",
            ambitionTrackingMethod:
              parsedData.trackingMethod || parsedData.ambitionTrackingMethod || "task",
            tasks: parsedData.tasks || [],
            milestones: parsedData.milestones || [],
          };
        } catch (error) {
          console.error("Failed to parse saved form data:", error);
        }
      }
    }
    return {
      ambitionName: "",
      ambitionDefinition: "",
      ambitionPriority: "medium",
      ambitionStartDate: "",
      ambitionEndDate: "",
      ambitionColor: "",
      ambitionTrackingMethod: "task",
      tasks: [],
      milestones: [],
    };
  });
  const [formErrors, formAction, isCreationPending] = useActionState<
    CreateNewAmbitionFormActionState,
    FormData
  >(createNewAmbition, formState);

  // Handle form errors
  useEffect(() => {
    if (formErrors?.errors) {
      let formError = "";
      if (formErrors.errors.tasks) {
        formError = formErrors.errors.tasks.join(", ");
      } else if (formErrors.errors.milestones) {
        formError = formErrors.errors.milestones.join(", ");
      }

      toast.error("Error", {
        description:
          formError.length > 0
            ? formError
            : "There was an error with your submission. Please check the form and try again.",
        closeButton: true,
      });
    }
  }, [formErrors?.errors]);

  // Handle successful creation
  useEffect(() => {
    if (formErrors?.success) {
      localStorage.removeItem("ambitionFormData");
      localStorage.removeItem("welcomeToastShown");
      router.push("/ambitions");
    }
  }, [formErrors?.success, router]);

  // Add auto-save indicator state
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showSaveIndicator, setShowSaveIndicator] = useState<boolean>(false);

  // Replace single date with date range
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>(() => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("ambitionFormData");
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        return {
          from: parsedData.dateRange?.from ? new Date(parsedData.dateRange.from) : undefined,
          to: parsedData.dateRange?.to ? new Date(parsedData.dateRange.to) : undefined,
        };
      }
    }
    return { from: undefined, to: undefined };
  });

  console.log(dateRange);


  // Save form data whenever it changes
  useEffect(() => {
    setIsSaving(true);
    setShowSaveIndicator(true);
    const formData = {
      ...formState,
      dateRange: {
        from: dateRange.from?.toISOString(),
        to: dateRange.to?.toISOString(),
      },
      selectedColor: formState.ambitionColor,
      trackingMethod: formState.ambitionTrackingMethod,
      tasks: formState.tasks,
      milestones: formState.milestones,
    };
    localStorage.setItem("ambitionFormData", JSON.stringify(formData));

    // Reset saving indicator after a short delay
    const timer = setTimeout(() => {
      setIsSaving(false);
      // Hide the save indicator after a delay
      setTimeout(() => {
        setShowSaveIndicator(false);
      }, 2000);
    }, 1000);
    return () => clearTimeout(timer);
  }, [dateRange, formState]);

  // Add a function to clear form data manually
  const clearFormData = () => {
    localStorage.removeItem("ambitionFormData");
    localStorage.removeItem("welcomeToastShown");
    setFormState({
      ambitionName: "",
      ambitionDefinition: "",
      ambitionPriority: "medium" as const,
      ambitionColor: "",
      ambitionTrackingMethod: "task",
      ambitionStartDate: "",
      ambitionEndDate: "",
      tasks: [],
      milestones: [],
    });
    setDateRange({ from: undefined, to: undefined });
  };

  const getFieldError = (field: string) => {
    return formErrors?.errors?.[field]?.join(", ");
  };

  return (
    <form action={formAction} className="mx-auto max-w-4xl space-y-8 p-6 md:p-8 pt-6">
      {/* Hidden inputs for date fields */}
      <input
        type="hidden"
        name="ambitionStartDate"
        value={
          formState.ambitionStartDate instanceof Date
            ? formState.ambitionStartDate.toISOString()
            : formState.ambitionStartDate
        }
      />
      <input
        type="hidden"
        name="ambitionEndDate"
        value={
          formState.ambitionEndDate instanceof Date
            ? formState.ambitionEndDate.toISOString()
            : formState.ambitionEndDate
        }
      />
      <input type="hidden" name="ambitionColor" value={formState.ambitionColor} />
      <input
        type="hidden"
        name="tasks"
        value={JSON.stringify(
          formState.tasks.map((task) => ({
            ...task,
            taskDeadline:
              task.taskDeadline instanceof Date
                ? task.taskDeadline.toISOString()
                : task.taskDeadline,
          }))
        )}
      />
      <input
        type="hidden"
        name="milestones"
        value={JSON.stringify(
          formState.milestones.map((milestone) => ({
            ...milestone,
            milestoneTargetDate:
              milestone.milestoneTargetDate instanceof Date
                ? milestone.milestoneTargetDate.toISOString()
                : milestone.milestoneTargetDate,
          }))
        )}
      />

      {/* Display general errors */}
      {formErrors?.errors?.general && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
          <p className="font-medium">Error</p>
          <p className="text-sm">{formErrors.errors.general.join(", ")}</p>
        </div>
      )}

      {/* Header Section */}
      <MotionWrapper
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row items-center justify-between"
      >
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">Create New Ambition</h1>
            <Popover.Popover>
              <Popover.PopoverTrigger asChild>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                  <IconInfoCircle className="h-4 w-4" />
                </Button>
              </Popover.PopoverTrigger>
              <Popover.PopoverContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-medium">Auto-save Enabled</h4>
                  <p className="text-sm text-muted-foreground">
                    Your progress is automatically saved as you type. You can safely leave this page
                    and return later to continue where you left off.
                  </p>
                </div>
              </Popover.PopoverContent>
            </Popover.Popover>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-muted-foreground">Define your goal and set up tracking parameters</p>
            {showSaveIndicator && (
              <MotionWrapper
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                {isSaving ? (
                  <span className="flex items-center gap-1">
                    <MotionWrapper
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </MotionWrapper>
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <IconCheck className="h-4 w-4" />
                    Saved
                  </span>
                )}
              </MotionWrapper>
            )}
          </div>
        </div>
        <div className="flex gap-5 md:gap-2 max-md:pt-5">
          <Button type="button" variant="outline" size="tiny" onClick={clearFormData}>
            Clear Form
          </Button>
          {searchParams.get("ref") && (
            <Button asChild variant="ghost" size="tiny">
              <Link
                prefetch={true}
                href={`/${searchParams.get("ref")}`}
                className="gap-1 flex justify-center items-center"
              >
                <IconChevronLeft className="h-4 w-4" />
                Back to{" "}
                {searchParams.get("ref") === "dashboard"
                  ? "Dashboard"
                  : searchParams.get("ref") === "ambitions"
                    ? "Ambitions"
                    : "Ambitions"}
              </Link>
            </Button>
          )}
        </div>
      </MotionWrapper>

      {/* BASIC DETAILS OF AMBITION */}
      <MotionWrapper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card.Card>
          <Card.CardHeader>
            <Card.CardTitle>Ambition Details</Card.CardTitle>
            <Card.CardDescription>Define what you want to accomplish</Card.CardDescription>
          </Card.CardHeader>
          <Card.CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="ambitionName">Name</Label>
                <Input
                  id="ambitionName"
                  name="ambitionName"
                  type="text"
                  required
                  placeholder="E.g. Learn Spanish, Run a Marathon..."
                  value={formState.ambitionName}
                  onChange={(e) => setFormState({ ...formState, ambitionName: e.target.value })}
                />
                {formErrors?.errors?.ambitionName && (
                  <p className="text-sm text-red-500">{getFieldError("ambitionName")}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Priority Level</Label>
                  <RadioGroup.RadioGroup
                    defaultValue="medium"
                    className="flex gap-4"
                    name="ambitionPriority"
                    value={formState.ambitionPriority}
                    onValueChange={(value) =>
                      setFormState({
                        ...formState,
                        ambitionPriority: value as "low" | "medium" | "high",
                      })
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroup.RadioGroupItem value="high" id="high" />
                      <Label htmlFor="high" className="text-red-500 font-medium">
                        High
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroup.RadioGroupItem value="medium" id="medium" />
                      <Label htmlFor="medium" className="text-amber-500 font-medium">
                        Medium
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroup.RadioGroupItem value="low" id="low" />
                      <Label htmlFor="low" className="text-blue-500 font-medium">
                        Low
                      </Label>
                    </div>
                  </RadioGroup.RadioGroup>
                  {formErrors?.errors?.ambitionPriority && (
                    <p className="text-sm text-red-500">{getFieldError("ambitionPriority")}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ambitionDefinition">
                  Definition <span className="text-xs/tight text-muted-foreground">(optional)</span>
                </Label>
                <Textarea
                  id="ambitionDefinition"
                  name="ambitionDefinition"
                  placeholder="Define your ambition in detail..."
                  value={formState.ambitionDefinition}
                  onChange={(e) =>
                    setFormState({ ...formState, ambitionDefinition: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Date Range</Label>
                <p className="text-xs text-muted-foreground">
                  Tasks and milestones will be constrained to dates within this range
                </p>
                <Popover.Popover>
                  <Popover.PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <IconCalendar className="mr-2 h-4 w-4" />
                      {dateRange.from && dateRange.to ? (
                        `${format(dateRange.from, "PPP")} - ${format(dateRange.to, "PPP")}`
                      ) : (
                        <span>Select start and end dates</span>
                      )}
                    </Button>
                  </Popover.PopoverTrigger>
                  <Popover.PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={(newDateRange) => {
                        if (newDateRange) {
                          setDateRange({
                            from: newDateRange.from,
                            to: newDateRange.to,
                          });
                          setFormState({
                            ...formState,
                            ambitionStartDate: newDateRange.from?.toISOString() || "",
                            ambitionEndDate: newDateRange.to?.toISOString() || "",
                          });
                        } else {
                          setDateRange({ from: undefined, to: undefined });
                          setFormState({
                            ...formState,
                            ambitionStartDate: "",
                            ambitionEndDate: "",
                          });
                        }
                      }}
                      disabled={(calendarDate) => isBefore(calendarDate, startOfToday())}
                      initialFocus
                    />
                  </Popover.PopoverContent>
                </Popover.Popover>
                {formErrors?.errors?.ambitionStartDate && (
                  <p className="text-sm text-red-500">{getFieldError("ambitionStartDate")}</p>
                )}
                {formErrors?.errors?.ambitionEndDate && (
                  <p className="text-sm text-red-500">{getFieldError("ambitionEndDate")}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex items-center justify-between space-x-2">
                {ambitionColorOptions.map((color, index) => (
                  <Tooltip.Tooltip key={index}>
                    <Tooltip.TooltipTrigger asChild>
                      <MotionWrapper
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.2,
                          delay: 0.1 + index * 0.05,
                        }}
                        className={cn(
                          "h-4 rounded-full cursor-pointer flex items-center justify-center transition-all hover:scale-105 active:scale-95 hover:w-full",
                          formState.ambitionColor === color.value ? "ring-2 ring-offset-2" : "",
                          formState.ambitionColor === color.value ? "w-full" : "w-3/5"
                        )}
                        style={{ backgroundColor: color.value }}
                        onClick={() => setFormState({ ...formState, ambitionColor: color.value })}
                      >
                        {formState.ambitionColor === color.value && (
                          <MotionWrapper
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <IconCheck className="h-4 w-4 text-white" />
                          </MotionWrapper>
                        )}
                      </MotionWrapper>
                    </Tooltip.TooltipTrigger>
                    <Tooltip.TooltipContent>
                      <p>{color.name}</p>
                    </Tooltip.TooltipContent>
                  </Tooltip.Tooltip>
                ))}
              </div>
              {formErrors?.errors?.ambitionColor && (
                <p className="text-sm text-red-500">{getFieldError("ambitionColor")}</p>
              )}
            </div>
          </Card.CardContent>
        </Card.Card>
      </MotionWrapper>

      {/* PROGRESS TRACKING SETTING */}
      {dateRange.from && dateRange.to && (
        <MotionWrapper
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card.Card>
            <Card.CardHeader>
              <Card.CardTitle>Progress Tracking</Card.CardTitle>
              <Card.CardDescription>
                Define how you&apos;ll track progress for this ambition
              </Card.CardDescription>
            </Card.CardHeader>
            <Card.CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Tracking Method</Label>
                <RadioGroup.RadioGroup
                  name="ambitionTrackingMethod"
                  defaultValue="task"
                  className="flex justify-between mt-5"
                  value={formState.ambitionTrackingMethod}
                  onValueChange={(value) =>
                    setFormState({
                      ...formState,
                      ambitionTrackingMethod: value as "task" | "milestone",
                    })
                  }
                >
                  <MotionWrapper
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    className={cn("flex items-start space-x-3 w-full")}
                  >
                    <RadioGroup.RadioGroupItem value="task" id="task" />
                    <div className="cursor-pointer">
                      <Label htmlFor="task" className="font-medium cursor-pointer">
                        Task Based
                      </Label>
                      <p className="text-start text-sm text-muted-foreground">
                        Track progress by completing tasks
                      </p>
                    </div>
                  </MotionWrapper>
                  <MotionWrapper
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className={cn("flex items-start space-x-3 w-full")}
                  >
                    <RadioGroup.RadioGroupItem value="milestone" id="milestone" />
                    <div className="cursor-pointer">
                      <Label htmlFor="milestone" className="font-medium cursor-pointer">
                        Milestone Based
                      </Label>
                      <p className="text-start text-sm text-muted-foreground">
                        Track progress through specific milestones
                      </p>
                    </div>
                  </MotionWrapper>
                </RadioGroup.RadioGroup>
              </div>
            </Card.CardContent>
          </Card.Card>
        </MotionWrapper>
      )}

      {/* TASKS OR MILESTONES SECTION */}

      {formState.ambitionTrackingMethod === "task" ? (
        dateRange.from && dateRange.to && <TasksAdditionFormSection key="tasks" formState={formState} setFormState={setFormState} />
      ) : (
        dateRange.from && dateRange.to && <MilestoneAdditionFormSection
          key="milestones"
          formState={formState}
          setFormState={setFormState}
        />
      )}


      {/* FOOTER SECTION */}
      {dateRange.from && dateRange.to && (
        <MotionWrapper
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-end"
        >
          <Button type="submit" disabled={isCreationPending} variant="ay">
            {isCreationPending ? "Creating..." : "Create Ambition"}
          </Button>
        </MotionWrapper>
      )}
    </form>
  );
}
