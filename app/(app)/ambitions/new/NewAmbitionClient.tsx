"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarIcon,
  CheckIcon,
  ChevronLeftIcon,
  ListBulletIcon,
  Cross1Icon,
  InfoCircledIcon,
  PlusIcon,
  Cross2Icon,
} from "@radix-ui/react-icons";
import { CircleCheckBig, CircleIcon, Milestone, Tag as TagIcon } from "lucide-react";
import { format, isBefore, startOfToday } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";
import ProBadge from "@/components/ProBadge";
import type { AmbitionData, SupabasePlansData } from "@/types";
import { createNewAmbition } from "./actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function NewAmbitionClient({ plansData }: { plansData: SupabasePlansData[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProFeature, setIsProFeature] = useState(false);

  // Add auto-save indicator state
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveIndicator, setShowSaveIndicator] = useState(false);

  const [filledUpData, setFilledUpData] = useState<Partial<AmbitionData>>(() => {
    // Initialize state from localStorage if available
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("ambitionFormData");
      if (savedData) {
        const parsedData = JSON.parse(savedData);

        // Check if there's any meaningful data to restore
        const hasData =
          Object.values(parsedData.filledUpData).some(
            (value) =>
              value !== "" &&
              value !== false &&
              value !== "task" && // default tracking method
              value !== "[]" // empty arrays
          ) ||
          (parsedData.tasks && parsedData.tasks.length > 0) ||
          (parsedData.milestones && parsedData.milestones.length > 0) ||
          (parsedData.tags && parsedData.tags.length > 0);

        // Show welcome toast only if there's meaningful data and it hasn't been shown before
        if (hasData && !localStorage.getItem("welcomeToastShown")) {
          setTimeout(() => {
            localStorage.setItem("welcomeToastShown", "true");
            toast.info("Welcome Back!", {
              description:
                "Your previous progress has been restored. All changes are automatically saved.",
              duration: 3000,
            });
          }, 1000);
        }

        return (
          parsedData.filledUpData || {
            ambitionName: "",
            ambitionDefinition: "",
            ambitionPriority: "medium" as const,
            ambitionDeadline: "",
            ambitionColor: "",
            ambitionTrackingMethod: "task",
            ambitionSuccessMetric: "",
            ambitionStatus: "active",
            ambitionPercentageCompleted: 0,
          }
        );
      }
    }
    return {
      ambitionName: "",
      ambitionDefinition: "",
      ambitionPriority: "medium" as const,
      ambitionDeadline: "",
      ambitionColor: "",
      ambitionTrackingMethod: "task",
      ambitionSuccessMetric: "",
      ambitionStatus: "active",
      ambitionPercentageCompleted: 0,
    };
  });

  const [date, setDate] = useState<Date | undefined>(() => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("ambitionFormData");
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        return parsedData.date ? new Date(parsedData.date) : undefined;
      }
    }
    return undefined;
  });

  const [selectedColor, setSelectedColor] = useState(() => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("ambitionFormData");
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        return parsedData.selectedColor || "#3b82f6"; // Default to blue hex
      }
    }
    return "#3b82f6"; // Default to blue hex
  });

  const [trackingMethod, setTrackingMethod] = useState(() => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("ambitionFormData");
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        return parsedData.trackingMethod || "task";
      }
    }
    return "task";
  });

  const [tasks, setTasks] = useState<
    Array<{
      task: string;
      taskDescription: string;
      taskDeadline: string;
    }>
  >(() => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("ambitionFormData");
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        return parsedData.tasks || [];
      }
    }
    return [];
  });

  const [milestones, setMilestones] = useState<
    Array<{
      milestone: string;
      milestoneDescription: string;
      milestoneCompleted: boolean;
      milestoneTargetDate: string;
    }>
  >(() => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("ambitionFormData");
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        return parsedData.milestones || [];
      }
    }
    return [];
  });

  const [tags, setTags] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("ambitionFormData");
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        return parsedData.tags || [];
      }
    }
    return [];
  });

  const [activeTab, setActiveTab] = useState("basics");
  const [newMilestone, setNewMilestone] = useState({
    milestone: "",
    milestoneDescription: "",
    milestoneCompleted: false,
    milestoneTargetDate: format(new Date(), "yyyy-MM-dd"),
  });
  const [newTask, setNewTask] = useState({
    task: "",
    taskDescription: "",
    taskDeadline: format(new Date(), "yyyy-MM-dd"),
  });
  const [newTag, setNewTag] = useState("");

  // Check if user has a paid plan
  useEffect(() => {
    if (plansData[0].planMonthlyPrice === 0 && plansData[0].planName.toLowerCase() === "free") {
      setIsProFeature(false);
    } else {
      setIsProFeature(true);
    }
  }, [plansData]);

  // Save form data whenever it changes
  useEffect(() => {
    setIsSaving(true);
    setShowSaveIndicator(true);
    const formData = {
      filledUpData,
      date: date?.toISOString(),
      selectedColor,
      trackingMethod,
      tasks,
      milestones,
      tags,
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
  }, [filledUpData, date, selectedColor, trackingMethod, tasks, milestones, tags]);

  const addTask = () => {
    if (!newTask.task.trim()) {
      toast.error("Empty Task", {
        description: "Please enter a task name",
      });
      return;
    }
    setTasks([...tasks, newTask]);
    setNewTask({
      task: "",
      taskDescription: "",
      taskDeadline: format(new Date(), "yyyy-MM-dd"),
    });
    toast.success("Task Added", {
      description: "Task has been added successfully",
    });
  };

  const handleTaskKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      addTask();
    }
  };

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
    toast.success("Task Removed", {
      description: "Task has been removed successfully",
    });
  };

  const addMilestone = () => {
    if (!newMilestone.milestone.trim()) {
      toast.error("Empty Milestone", {
        description: "Please enter a milestone name",
      });
      return;
    }
    setMilestones([...milestones, newMilestone]);
    setNewMilestone({
      milestone: "",
      milestoneDescription: "",
      milestoneCompleted: false,
      milestoneTargetDate: format(new Date(), "yyyy-MM-dd"),
    });
    toast.success("Milestone Added", {
      description: "Milestone has been added successfully",
    });
  };

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
    toast.success("Milestone Removed", {
      description: "Milestone has been removed successfully",
    });
  };

  const toggleMilestoneCompletion = (index: number) => {
    setMilestones((prevMilestones) =>
      prevMilestones.map((milestone, i) =>
        i === index
          ? { ...milestone, milestoneCompleted: !milestone.milestoneCompleted }
          : milestone
      )
    );
  };

  const colorOptions = [
    { name: "Radiant Yellow", value: "#FCDA03", class: "bg-yellow-400" }, // Pure happiness, optimism, immediate mood lift
    { name: "Lively Orange", value: "#FF7733", class: "bg-orange-500" }, // Enthusiasm, warmth, creativity, zest for life
    { name: "Electric Blue", value: "#00BFFF", class: "bg-blue-400" }, // Invigorating, refreshing, clear, inspires confidence
    { name: "Lime Green", value: "#32CD32", class: "bg-lime-500" }, // Freshness, vitality, growth, natural energy
    { name: "Hot Pink", value: "#FF69B4", class: "bg-pink-400" }, // Playful, energetic, charming, universally cheerful
    { name: "Aqua Blue", value: "#00CED1", class: "bg-cyan-400" }, // Serene yet vibrant, refreshing, calming but uplifting
    { name: "Amethyst Purple", value: "#9966CC", class: "bg-purple-400" }, // Creative, inspiring, unique, adds a touch of uplifting magic
    { name: "Scarlet Red", value: "#FF2400", class: "bg-red-500" }, // Powerful, energetic, passionate, stirs positive excitement
    { name: "Lemon Yellow", value: "#FFF44F", class: "bg-yellow-300" }, // Bright, crisp, pure joy, illuminates the spirit
    { name: "Coral Red", value: "#FF7F50", class: "bg-red-400" }, // Warm, friendly, inviting, feels joyful and lively
  ];

  const handleTrackingMethodChange = (method: string) => {
    setTrackingMethod(method);
    setFilledUpData((prev) => ({
      ...prev,
      trackingMethod: method,
    }));
    // Clear the other tracking method's data
    if (method === "task") {
      setMilestones([]);
    } else {
      setTasks([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!filledUpData.ambitionName) {
        toast.error("Missing Title", {
          description: "Please provide a title for your ambition",
        });
        return;
      }
      if (!filledUpData.ambitionPriority) {
        toast.error("Missing Priority", {
          description: "Please select a priority level for your ambition",
        });
        return;
      }
      if (!date) {
        toast.error("Missing Deadline", {
          description: "Please select a deadline for your ambition",
        });
        return;
      }
      if (!trackingMethod) {
        toast.error("Missing Tracking Method", {
          description: "Please select a tracking method for your ambition",
        });
        return;
      }

      // Validate tasks/milestones based on tracking method
      if (trackingMethod === "task" && tasks.length === 0) {
        toast.error("No Tasks Added", {
          description: "Please add at least one task for task-based tracking",
        });
        return;
      }
      if (trackingMethod === "milestone" && milestones.length === 0) {
        toast.error("No Milestones Added", {
          description: "Please add at least one milestone for milestone-based tracking",
        });
        return;
      }

      const formData = new FormData();

      // Add all form fields to FormData
      formData.append("title", filledUpData.ambitionName);
      formData.append("description", filledUpData.ambitionDefinition || "");
      formData.append("priorityLevel", filledUpData.ambitionPriority);
      formData.append("deadline", format(date, "yyyy-MM-dd"));
      formData.append("color", selectedColor);
      formData.append("trackingMethod", trackingMethod);
      formData.append("successMetric", filledUpData.ambitionSuccessMetric || "");
      formData.append("focusedAmbitionOnDashboard", "true");

      // Add tasks or milestones based on tracking method
      if (trackingMethod === "task") {
        formData.append("tasks", JSON.stringify(tasks));
        formData.append("milestones", "[]");
      } else {
        formData.append("milestones", JSON.stringify(milestones));
        formData.append("tasks", "[]");
      }

      const result = await createNewAmbition(formData);

      if (result?.error) {
        toast.error("Error Creating Ambition", {
          description: result.error,
        });
      } else {
        // Clear saved form data and welcome toast state on successful submission
        localStorage.removeItem("ambitionFormData");
        localStorage.removeItem("welcomeToastShown");

        toast.success("Ambition Created", {
          description: "Your ambition has been created successfully",
        });

        // Use router.push instead of relying on the redirect
        router.push("/ambitions");
      }
    } catch (error) {
      // Check if the error is a redirect response
      if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
        // Clear saved form data and welcome toast state
        localStorage.removeItem("ambitionFormData");
        localStorage.removeItem("welcomeToastShown");

        toast.success("Ambition Created", {
          description: "Your ambition has been created successfully",
        });

        // Use router.push instead of relying on the redirect
        router.push("/ambitions");
      } else {
        toast.error("Error", {
          description:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred while creating your ambition",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = () => {
    if (!isProFeature) {
      toast.info("Pro Feature", {
        description: "Upgrade to a paid plan to use tags and labels",
      });
      return;
    }
    if (newTag.trim()) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  // Add a function to clear form data manually
  const clearFormData = () => {
    localStorage.removeItem("ambitionFormData");
    localStorage.removeItem("welcomeToastShown");
    setFilledUpData({
      ambitionName: "",
      ambitionDefinition: "",
      ambitionPriority: "medium" as const,
      ambitionDeadline: "",
      ambitionColor: "",
      ambitionTrackingMethod: "task",
      ambitionSuccessMetric: "",
      ambitionStatus: "active",
      ambitionPercentageCompleted: 0,
    });
    setDate(undefined);
    setSelectedColor("#3b82f6");
    setTrackingMethod("task");
    setTasks([]);
    setMilestones([]);
    setTags([]);
  };

  const handleInputChange = (field: keyof AmbitionData, value: string | boolean) => {
    setFilledUpData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="container max-w-4xl space-y-8 p-6 md:p-8 pt-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">Create New Ambition</h1>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <InfoCircledIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-medium">Auto-save Enabled</h4>
                  <p className="text-sm text-muted-foreground">
                    Your progress is automatically saved as you type. You can safely leave this page
                    and return later to continue where you left off.
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-muted-foreground">Define your goal and set up tracking parameters</p>
            {showSaveIndicator && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                {isSaving ? (
                  <span className="flex items-center gap-1">
                    <motion.div
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
                    </motion.div>
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <CheckIcon className="h-4 w-4" />
                    Saved
                  </span>
                )}
              </motion.div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={clearFormData}>
            Clear Form
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link
              prefetch={true}
              href="/ambitions"
              className="gap-1 flex justify-center items-center"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              Back to Ambitions
            </Link>
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Tabs defaultValue="basics" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basics">1. Basic Details</TabsTrigger>
            <TabsTrigger value="tasks">2. Tasks & Milestones</TabsTrigger>
          </TabsList>

          <TabsContent value="basics" className="space-y-6 mt-6">
            {/* BASIC DETAILS OF AMBITION */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Ambition Details</CardTitle>
                  <CardDescription>Define what you want to accomplish</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        placeholder="E.g. Learn Spanish, Run a Marathon..."
                        value={filledUpData.ambitionName || ""}
                        onChange={(e) => handleInputChange("ambitionName", e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Priority Level</Label>
                        <RadioGroup
                          defaultValue="medium"
                          className="flex gap-4"
                          value={filledUpData.ambitionPriority || "medium"}
                          onValueChange={(value) =>
                            handleInputChange(
                              "ambitionPriority",
                              value as "low" | "medium" | "high"
                            )
                          }
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="high" id="high" />
                            <Label htmlFor="high" className="text-red-500 font-medium">
                              High
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="medium" id="medium" />
                            <Label htmlFor="medium" className="text-amber-500 font-medium">
                              Medium
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="low" id="low" />
                            <Label htmlFor="low" className="text-blue-500 font-medium">
                              Low
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">
                        Definition{" "}
                        <span className="text-xs/tight text-muted-foreground">(optional)</span>
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Define your ambition in detail..."
                        value={filledUpData.ambitionDefinition || ""}
                        onChange={(e) => handleInputChange("ambitionDefinition", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Deadline</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Select a deadline</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(newDate) => setDate(newDate)}
                            disabled={(date) => isBefore(date, startOfToday())}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Color</Label>
                    <div className="flex items-center justify-between space-x-2">
                      {colorOptions.map((color, index) => (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{
                                duration: 0.2,
                                delay: 0.1 + index * 0.05,
                              }}
                              className={cn(
                                "w-3/5 h-4 rounded-full cursor-pointer flex items-center justify-center transition-all hover:scale-105 active:scale-95 hover:w-full",
                                color.class,
                                selectedColor === color.value ? "ring-2 ring-offset-2" : "",
                                selectedColor === color.value ? "w-full" : "w-3/5"
                              )}
                              onClick={() => setSelectedColor(color.value)}
                            >
                              {selectedColor === color.value && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <CheckIcon className="h-4 w-4 text-foreground" />
                                </motion.div>
                              )}
                            </motion.div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{color.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* PROGRESS TRACKING SETTING */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Progress Tracking</CardTitle>
                  <CardDescription>
                    Define how you&apos;ll track progress for this ambition
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Tracking Method</Label>
                    <RadioGroup
                      defaultValue="task"
                      className="flex justify-between mt-5"
                      value={trackingMethod}
                    >
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                        className={cn("flex items-start space-x-3 w-full")}
                      >
                        <RadioGroupItem value="task" id="task" />
                        <button
                          className="cursor-pointer"
                          onClick={() => handleTrackingMethodChange("task")}
                        >
                          <Label htmlFor="task" className="font-medium cursor-pointer">
                            Task Based
                          </Label>
                          <p className="text-start text-sm text-muted-foreground">
                            Track progress by completing tasks
                          </p>
                        </button>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className={cn("flex items-start space-x-3 w-full")}
                      >
                        <RadioGroupItem value="milestone" id="milestone" />
                        <button
                          className="cursor-pointer"
                          onClick={() => handleTrackingMethodChange("milestone")}
                        >
                          <Label htmlFor="milestone" className="font-medium cursor-pointer">
                            Milestone Based
                          </Label>
                          <p className="text-start text-sm text-muted-foreground">
                            Track progress through specific milestones
                          </p>
                        </button>
                      </motion.div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>
            </motion.div>


          </TabsContent>

          <TabsContent value="tasks" className="space-y-6 mt-6">
            {trackingMethod === "task" ? (
              <>
                {/* TASKS SECTION */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Tasks</CardTitle>
                      <CardDescription>Create a few tasks to get started</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-4 flex flex-col">
                          <div className="space-y-2">
                            <Label htmlFor="task-name">Task Name</Label>
                            <Input
                              id="task-name"
                              placeholder="Enter task name..."
                              value={newTask.task}
                              onChange={(e) =>
                                setNewTask((prev) => ({
                                  ...prev,
                                  task: e.target.value,
                                }))
                              }
                              onKeyDown={handleTaskKeyDown}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="task-description">
                              Task Description{" "}
                              <span className="text-xs/tight text-muted-foreground">
                                (optional)
                              </span>
                            </Label>
                            <Textarea
                              id="task-description"
                              placeholder="Describe what needs to be done..."
                              value={newTask.taskDescription}
                              onChange={(e) =>
                                setNewTask((prev) => ({
                                  ...prev,
                                  taskDescription: e.target.value,
                                }))
                              }
                              onKeyDown={handleTaskKeyDown}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Task Deadline</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start text-left font-normal"
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {newTask.taskDeadline ? (
                                    format(new Date(newTask.taskDeadline), "PPP")
                                  ) : (
                                    <span>Select a deadline</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={new Date(newTask.taskDeadline)}
                                  onSelect={(date) =>
                                    date &&
                                    setNewTask((prev) => ({
                                      ...prev,
                                      taskDeadline: format(date, "yyyy-MM-dd"),
                                    }))
                                  }
                                  disabled={(date) => isBefore(date, startOfToday())}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <Button onClick={addTask} type="button" className="self-end">
                            <PlusIcon className="h-4 w-4 mr-1" /> Add Task
                          </Button>
                        </div>

                        {tasks.length === 0 ? (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="text-center py-4 text-muted-foreground"
                          >
                            <motion.div
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.3, delay: 0.2 }}
                            >
                              <ListBulletIcon className="h-16 w-16 mx-auto mb-2 opacity-20" />
                              <div>
                                <p>No tasks added yet</p>
                                <p className="text-sm">Add some tasks to get started</p>
                              </div>
                            </motion.div>
                          </motion.div>
                        ) : (
                          <div className="space-y-2">
                            {tasks.map((task, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 * index }}
                                className="flex items-start justify-between p-3 border rounded-md"
                              >
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <ListBulletIcon className="h-4 w-4 text-primary mt-1" />
                                    <div>
                                      <p className="font-medium">{task.task}</p>
                                      {task.taskDescription && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                          {task.taskDescription}
                                        </p>
                                      )}
                                      <p className="text-sm text-muted-foreground mt-1">
                                        Deadline: {format(new Date(task.taskDeadline), "PPP")}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeTask(index)}
                                  >
                                    <Cross1Icon className="h-4 w-4" />
                                  </Button>
                                </motion.div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card className="opacity-50 pointer-events-none">
                    <CardHeader>
                      <CardTitle>Milestones</CardTitle>
                      <CardDescription>
                        Switch to Milestone Based tracking from the first tab of this page to add
                        milestones
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              </>
            ) : (
              <>
                {/* MILESTONES SECTION */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Milestones</CardTitle>
                      <CardDescription>Define key checkpoints for your ambition</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-4 flex flex-col">
                          <div className="space-y-2">
                            <Label htmlFor="milestone-name">Milestone Name</Label>
                            <Input
                              id="milestone-name"
                              placeholder="Enter milestone name..."
                              value={newMilestone.milestone}
                              onChange={(e) =>
                                setNewMilestone((prev) => ({
                                  ...prev,
                                  milestone: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="milestone-description">
                              Milestone Description{" "}
                              <span className="text-xs/tight text-muted-foreground">
                                (optional)
                              </span>
                            </Label>
                            <Textarea
                              id="milestone-description"
                              placeholder="Describe what this milestone represents..."
                              value={newMilestone.milestoneDescription}
                              onChange={(e) =>
                                setNewMilestone((prev) => ({
                                  ...prev,
                                  milestoneDescription: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div className="flex items-center justify-start space-x-2">
                            <Checkbox
                              id="add-milestone-completed"
                              checked={newMilestone.milestoneCompleted}
                              onCheckedChange={(checked) =>
                                setNewMilestone((prev) => ({
                                  ...prev,
                                  milestoneCompleted: checked as boolean,
                                }))
                              }
                            />
                            <Label htmlFor="add-milestone-completed" className="font-medium">
                              Mark as completed
                            </Label>
                          </div>
                          <Button onClick={addMilestone} type="button" className="self-end">
                            <PlusIcon className="h-4 w-4 mr-1" /> Add Milestone
                          </Button>
                        </div>

                        <div className="relative mt-6">
                          {/* Timeline line */}
                          <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-border"></div>

                          {/* Milestones */}
                          <div className="space-y-8">
                            {milestones.length === 0 ? (
                              <div className="text-center py-4 text-muted-foreground">
                                <Milestone className="h-12 w-12 mx-auto mb-2 opacity-20" />
                                <div>
                                  <p>No milestones added yet</p>
                                  <p className="text-sm">Add some milestones to get started</p>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-8">
                                {milestones.map((milestone, index) => (
                                  <div
                                    key={index}
                                    className="relative pl-10 hover:bg-muted p-4 rounded-md"
                                  >
                                    <div
                                      className={`absolute left-px h-5 w-5 rounded-full bg-background flex items-center justify-center`}
                                    >
                                      {milestone.milestoneCompleted ? (
                                        <CircleCheckBig className="text-lime-500 rounded-full" />
                                      ) : (
                                        <CircleIcon className="text-muted-foreground" />
                                      )}
                                    </div>
                                    <div className="flex flex-col">
                                      <div className="flex items-start justify-between">
                                        <h4 className="text-base font-medium">
                                          {milestone.milestone}
                                        </h4>
                                        <Button
                                          variant="destructive"
                                          size="sm"
                                          className="rounded-full h-6 w-6 p-0"
                                          onClick={() => removeMilestone(index)}
                                        >
                                          <Cross2Icon />
                                          <span className="sr-only">Remove milestone</span>
                                        </Button>
                                      </div>
                                      <p className="text-sm text-muted-foreground mt-1">
                                        {milestone.milestoneDescription}
                                      </p>
                                      <div className="flex items-center gap-2 mt-2">
                                        <div className="flex items-center space-x-2">
                                          <Checkbox
                                            id={`milestone-${index}`}
                                            checked={milestone.milestoneCompleted}
                                            onCheckedChange={() => toggleMilestoneCompletion(index)}
                                          />
                                          <Label
                                            htmlFor={`milestone-${index}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                          >
                                            {milestone.milestoneCompleted
                                              ? "Completed"
                                              : "Not completed"}
                                          </Label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="opacity-50 pointer-events-none">
                    <CardHeader>
                      <CardTitle>Initial Tasks</CardTitle>
                      <CardDescription>
                        Switch to Task Based tracking from the first tab of this page to add tasks
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex justify-end"
      >
        {activeTab === "tasks" && (
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Ambition"}
          </Button>
        )}
      </motion.div>
    </form>
  );
}
