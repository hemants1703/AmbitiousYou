import { MotionWrapper } from "@/components/MotionWrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import * as Card from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import * as Tabs from "@/components/ui/tabs";
import { Ambition, Milestone, Task } from "@/db/schema";
import confirmSession from "@/lib/auth/confirmSession";
import { motivationalQuotes } from "@/lib/motivationalQuotes";
import { AmbitionsService } from "@/services/ambitionsService";
import {
  IconCheck,
  IconCircleCheck,
  IconCirclePlus2,
  IconFolder,
  IconSettings2,
  IconTarget,
} from "@tabler/icons-react";
import { User } from "better-auth";
import { CalendarIcon, CheckCircleIcon, ChevronRight, Filter } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { AmbitionColorBadge } from "@/features/ambitions/AmbitionsClient";
import { AmbitionsControlsClient } from "@/features/ambitions/AmbitionsControlsClient";
import { AmbitionPriorityBadge, AmbitionStatusBadge } from "@/features/ambitions/AmbitionBadges";

export const metadata: Metadata = {
  title: "All Ambitions | AmbitiousYou",
};

interface AmbitionsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AmbitionsPage(props: AmbitionsPageProps) {
  const searchParams = await props.searchParams;

  const searchQuery = (searchParams.search as string | undefined) || "";
  const priority = searchParams.priority as "low" | "medium" | "high" | undefined;
  const sort = searchParams.sort as
    | "ambitionName"
    | "ambitionPercentageCompleted"
    | "ambitionPriority"
    | "ambitionEndDate"
    | "tasks.completed"
    | undefined;
  const direction = (searchParams.direction as "asc" | "desc" | undefined) || "desc";

  const session = await confirmSession();

  const userData = session.user as User;
  const ambitionsData = await AmbitionsService.fetchUserAmbitions(userData.id);
  const tasksData = await AmbitionsService.fetchUserTasks(userData.id);
  const milestonesData = await AmbitionsService.fetchUserMilestones(userData.id);

  const ambitions = ambitionsData as Ambition[];
  const tasks = tasksData as Task[];
  const milestones = milestonesData as Milestone[];

  const priorities = [...new Set(ambitions.map((ambition) => ambition.ambitionPriority))] as (
    | "low"
    | "medium"
    | "high"
  )[];

  // Filter ambitions based on search and priority
  let filteredAmbitions = ambitions.filter((ambition) => {
    // Search filter
    if (searchQuery) {
      const matchesSearch =
        ambition.ambitionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ambition.ambitionDefinition?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      if (!matchesSearch) return false;
    }

    // Priority filter
    if (priority && ambition.ambitionPriority !== priority) {
      return false;
    }

    return true;
  });

  // Sort ambitions
  const sortedAndFilteredAmbitions = [...filteredAmbitions].sort((a, b) => {
    if (!sort) return 0;

    // Handle nested properties like tasks.completed
    if (sort === "tasks.completed") {
      const tasksA = tasks.filter((t) => t.ambitionId === a.id);
      const tasksB = tasks.filter((t) => t.ambitionId === b.id);
      const valueA = tasksA.filter((t) => t.taskCompleted).length;
      const valueB = tasksB.filter((t) => t.taskCompleted).length;
      return direction === "asc" ? valueA - valueB : valueB - valueA;
    }

    // Handle date strings for end date
    if (sort === "ambitionEndDate") {
      const valueA = a.ambitionEndDate;
      const valueB = b.ambitionEndDate;
      return direction === "asc"
        ? valueA.getTime() - valueB.getTime()
        : valueB.getTime() - valueA.getTime();
    }

    // Handle numeric values
    if (sort === "ambitionPercentageCompleted") {
      const valueA = a.ambitionPercentageCompleted || 0;
      const valueB = b.ambitionPercentageCompleted || 0;
      return direction === "asc" ? valueA - valueB : valueB - valueA;
    }

    // Handle priority sorting
    if (sort === "ambitionPriority") {
      const priorityOrder = { low: 1, medium: 2, high: 3 };
      const valueA = priorityOrder[a.ambitionPriority as keyof typeof priorityOrder];
      const valueB = priorityOrder[b.ambitionPriority as keyof typeof priorityOrder];
      return direction === "asc" ? valueA - valueB : valueB - valueA;
    }

    // Default string comparison
    const valueA = String(a[sort as keyof Ambition] ?? "");
    const valueB = String(b[sort as keyof Ambition] ?? "");
    return direction === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
  });

  const activeAmbitions = ambitions.filter((ambition) => ambition.ambitionStatus === "active");

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  // Helper function to highlight search terms
  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm || searchTerm.trim() === "") return text;

    const regex = new RegExp(`(${searchTerm})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span
          key={index}
          className="bg-yellow-200 dark:bg-yellow-800 text-black dark:text-white rounded px-0.5"
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="flex flex-col p-6 md:p-8 pt-6 gap-6 max-sm:max-w-screen-sm md:max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto">
      <MotionWrapper
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-2"
      >
        <h1 className="text-3xl font-bold tracking-tight">Your Ambitions</h1>
        <p className="text-muted-foreground">View and manage all your ambitions in one place</p>
      </MotionWrapper>

      <MotionWrapper
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <AmbitionsControlsClient priorities={priorities} />
      </MotionWrapper>

      <MotionWrapper
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {ambitions.length > 0 ? (
          <Tabs.Tabs defaultValue="all" className="w-full">
            <Tabs.TabsList className="max-md:self-center">
              <Tabs.TabsTrigger value="all">All Ambitions</Tabs.TabsTrigger>
              <Tabs.TabsTrigger value="active">Active</Tabs.TabsTrigger>
              <Tabs.TabsTrigger value="completed">Completed</Tabs.TabsTrigger>
              <Tabs.TabsTrigger value="archive">Archive</Tabs.TabsTrigger>
            </Tabs.TabsList>

            {/* ALL AMBITIONS TAB */}
            <Tabs.TabsContent value="all">
              <MotionWrapper
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {sortedAndFilteredAmbitions.length > 0 ? (
                  sortedAndFilteredAmbitions.map((ambition, index) => {
                    let completedTasksOrMilestones = 0;
                    let totalTasksOrMilestones = 0;

                    if (ambition.ambitionTrackingMethod === "task") {
                      const ambitionTasksList = tasks.filter((t) => t.ambitionId === ambition.id);
                      completedTasksOrMilestones = ambitionTasksList.filter(
                        (t) => t.taskCompleted
                      ).length;
                      totalTasksOrMilestones = ambitionTasksList.length;
                    } else if (ambition.ambitionTrackingMethod === "milestone") {
                      const ambitionMilestonesList = milestones.filter(
                        (m) => m.ambitionId === ambition.id
                      );
                      completedTasksOrMilestones = ambitionMilestonesList.filter(
                        (m) => m.milestoneCompleted
                      ).length;
                      totalTasksOrMilestones = ambitionMilestonesList.length;
                    }

                    return (
                      <MotionWrapper
                        key={ambition.id}
                        variants={item}
                        transition={{ duration: 0.3, delay: 0.05 * index }}
                      >
                        <Link prefetch={true} href={`/ambitions/${ambition.id}`}>
                          <Card.Card className="cursor-pointer hover:shadow-md transition-all hover:translate-y-[-2px] duration-300">
                            <Card.CardHeader className="pb-2">
                              <div className="flex items-center justify-between">
                                <AmbitionColorBadge
                                  ambitionColor={ambition.ambitionColor || "#64ccc5"}
                                  index={index}
                                  width={100}
                                />
                                <AmbitionPriorityBadge
                                  ambitionPriority={ambition.ambitionPriority || "medium"}
                                />
                              </div>
                              <Card.CardTitle className="mt-2">
                                {searchQuery
                                  ? highlightText(ambition.ambitionName, searchQuery)
                                  : ambition.ambitionName}
                              </Card.CardTitle>
                              <Card.CardDescription className="line-clamp-2">
                                {searchQuery && ambition.ambitionDefinition
                                  ? highlightText(ambition.ambitionDefinition, searchQuery)
                                  : ambition.ambitionDefinition}
                              </Card.CardDescription>
                            </Card.CardHeader>
                            <Card.CardContent className="pb-2">
                              <div className="space-y-4">
                                <div>
                                  <div className="flex justify-between mb-1 text-sm">
                                    <span>Progress</span>
                                    <span>{ambition.ambitionPercentageCompleted}%</span>
                                  </div>
                                  <MotionWrapper
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{
                                      duration: 0.5,
                                      delay: 0.3 + 0.1 * index,
                                    }}
                                  >
                                    <Progress
                                      value={ambition.ambitionPercentageCompleted}
                                      className={`h-2 [&>[data-slot=progress-indicator]]:bg-[(${ambition.ambitionColor})]`}
                                    />
                                  </MotionWrapper>
                                </div>
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <CheckCircleIcon className="h-3.5 w-3.5" />
                                    <span>
                                      {completedTasksOrMilestones}/{totalTasksOrMilestones}{" "}
                                      {ambition.ambitionTrackingMethod}s
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <CalendarIcon className="h-3.5 w-3.5" />
                                    <span>
                                      Due{" "}
                                      {new Date(ambition.ambitionEndDate).toLocaleDateString(
                                        "en-US",
                                        { month: "short", day: "numeric", year: "numeric" }
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </Card.CardContent>
                            <Card.CardFooter className="pt-0">
                              <div className="flex justify-between items-center w-full">
                                <AmbitionStatusBadge ambitionStatus={ambition.ambitionStatus} />
                                <MotionWrapper whileHover={{ x: 3 }} transition={{ duration: 0.2 }}>
                                  <ChevronRight className="h-4 w-4" />
                                </MotionWrapper>
                              </div>
                            </Card.CardFooter>
                          </Card.Card>
                        </Link>
                      </MotionWrapper>
                    );
                  })
                ) : (
                  <MotionWrapper
                    className="col-span-full text-center py-10 text-muted-foreground"
                    variants={item}
                  >
                    <Filter className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No ambitions match your filters</p>
                    <Link href="/ambitions">
                      <Button variant="ghost" size="sm" className="mt-2">
                        Clear filters
                      </Button>
                    </Link>
                  </MotionWrapper>
                )}
              </MotionWrapper>
            </Tabs.TabsContent>

            {/* ACTIVE AMBITIONS TAB */}
            <Tabs.TabsContent value="active">
              <MotionWrapper
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <MotionWrapper
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {activeAmbitions.length > 0 ? (
                    activeAmbitions.map((ambition, index) => {
                      let completedTasksOrMilestones = 0;
                      let totalTasksOrMilestones = 0;

                      if (ambition.ambitionTrackingMethod === "task") {
                        const ambitionTasksList = tasks.filter((t) => t.ambitionId === ambition.id);
                        completedTasksOrMilestones = ambitionTasksList.filter(
                          (t) => t.taskCompleted
                        ).length;
                        totalTasksOrMilestones = ambitionTasksList.length;
                      } else if (ambition.ambitionTrackingMethod === "milestone") {
                        const ambitionMilestonesList = milestones.filter(
                          (m) => m.ambitionId === ambition.id
                        );
                        completedTasksOrMilestones = ambitionMilestonesList.filter(
                          (m) => m.milestoneCompleted
                        ).length;
                        totalTasksOrMilestones = ambitionMilestonesList.length;
                      }

                      return (
                        <MotionWrapper
                          key={ambition.id}
                          variants={item}
                          transition={{ duration: 0.3, delay: 0.05 * index }}
                        >
                          <Link prefetch={true} href={`/ambitions/${ambition.id}`}>
                            <Card.Card className="cursor-pointer hover:shadow-md transition-all hover:translate-y-[-2px] duration-300">
                              <Card.CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                  <AmbitionColorBadge
                                    ambitionColor={ambition.ambitionColor || "#64ccc5"}
                                    index={index}
                                    width={100}
                                  />
                                  <AmbitionPriorityBadge
                                    ambitionPriority={ambition.ambitionPriority || "medium"}
                                  />
                                </div>
                                <Card.CardTitle className="mt-2">
                                  {searchQuery
                                    ? highlightText(ambition.ambitionName, searchQuery)
                                    : ambition.ambitionName}
                                </Card.CardTitle>
                                <Card.CardDescription className="line-clamp-2">
                                  {searchQuery && ambition.ambitionDefinition
                                    ? highlightText(ambition.ambitionDefinition, searchQuery)
                                    : ambition.ambitionDefinition || "\u00A0"}
                                </Card.CardDescription>
                              </Card.CardHeader>
                              <Card.CardContent className="pb-2">
                                <div className="space-y-4">
                                  <div>
                                    <div className="flex justify-between mb-1 text-sm">
                                      <span>Progress</span>
                                      <span>{ambition.ambitionPercentageCompleted}%</span>
                                    </div>
                                    <MotionWrapper
                                      initial={{ width: 0 }}
                                      animate={{ width: "100%" }}
                                      transition={{
                                        duration: 0.5,
                                        delay: 0.3 + 0.1 * index,
                                      }}
                                    >
                                      <Progress
                                        value={ambition.ambitionPercentageCompleted}
                                        className="h-2"
                                      />
                                    </MotionWrapper>
                                  </div>
                                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                      <CheckCircleIcon className="h-3.5 w-3.5" />
                                      <span>
                                        {completedTasksOrMilestones}/{totalTasksOrMilestones}{" "}
                                        {ambition.ambitionTrackingMethod}s
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <CalendarIcon className="h-3.5 w-3.5" />
                                      <span>
                                        Due{" "}
                                        {new Date(ambition.ambitionEndDate).toLocaleDateString(
                                          "en-US",
                                          { month: "short", day: "numeric", year: "numeric" }
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </Card.CardContent>
                              <Card.CardFooter className="pt-0">
                                <div className="flex justify-between items-center w-full text-xs text-muted-foreground">
                                  <AmbitionStatusBadge ambitionStatus={ambition.ambitionStatus} />
                                  <MotionWrapper
                                    whileHover={{ x: 3 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <ChevronRight className="h-4 w-4" />
                                  </MotionWrapper>
                                </div>
                              </Card.CardFooter>
                            </Card.Card>
                          </Link>
                        </MotionWrapper>
                      );
                    })
                  ) : (
                    <>
                      <IconTarget className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p>Active ambitions will appear here</p>
                    </>
                  )}
                </MotionWrapper>
              </MotionWrapper>
            </Tabs.TabsContent>

            {/* COMPLETED AMBITIONS TAB */}
            <Tabs.TabsContent value="completed">
              <MotionWrapper
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-10 text-muted-foreground"
              >
                <MotionWrapper
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <IconCircleCheck className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>Completed ambitions will appear here</p>
                </MotionWrapper>
              </MotionWrapper>
            </Tabs.TabsContent>

            {/* ARCHIVED AMBITIONS TAB */}
            <Tabs.TabsContent value="archive">
              <MotionWrapper
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-10 text-muted-foreground"
              >
                <MotionWrapper
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <IconFolder className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>Archived ambitions will appear here</p>
                </MotionWrapper>
              </MotionWrapper>
            </Tabs.TabsContent>
          </Tabs.Tabs>
        ) : (
          <NoAmbitionsFound />
        )}
      </MotionWrapper>
    </div>
  );
}

function NoAmbitionsFound() {
  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  return (
    <div className="text-center py-10 px-4 md:px-8 lg:px-12 min-h-[70vh] flex flex-col justify-center">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Left side - Main content */}
        <div className="space-y-6">
          <div>
            <IconTarget className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 opacity-20" />
            <h3 className="text-2xl md:text-3xl font-semibold mb-3">Start Your Journey</h3>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              You haven&apos;t created any ambitions yet. Ambitions help you track and achieve your
              most important goals.
            </p>
          </div>

          <Button asChild size="lg" className="mt-6">
            <Link prefetch={true} href="/ambitions/new" className="flex items-center gap-2">
              <IconCirclePlus2 className="h-5 w-5" />
              Create Your First Ambition
            </Link>
          </Button>

          <div className="inline-flex flex-col gap-1 items-center bg-primary/10 text-primary px-8 py-4 rounded-xl text-base">
            <p className="font-serif italic text-lg">{randomQuote.quote}</p>
            <div className="flex items-center gap-1 text-sm text-primary/80">
              <span className="font-medium">- {randomQuote.author}</span>
            </div>
          </div>
        </div>

        {/* Right side - Tips card */}
        <div className="bg-muted/50 rounded-xl p-6 md:p-8 shadow-sm">
          <div className="text-left space-y-6">
            <h4 className="text-xl font-medium flex items-center gap-2">
              <IconSettings2 className="h-5 w-5" />
              Quick Tips for Success
            </h4>

            <ul className="space-y-4 text-muted-foreground">
              <li className="flex gap-3 items-start">
                <IconCheck className="h-5 w-5 mt-1 text-green-500 shrink-0" />
                <span className="text-base">
                  Break down big goals into smaller, manageable milestones to maintain clarity and
                  focus
                </span>
              </li>
              <li className="flex gap-3 items-start">
                <IconCheck className="h-5 w-5 mt-1 text-green-500 shrink-0" />
                <span className="text-base">
                  Set realistic deadlines with buffer time to maintain steady momentum
                </span>
              </li>
              <li className="flex gap-3 items-start">
                <IconCheck className="h-5 w-5 mt-1 text-green-500 shrink-0" />
                <span className="text-base">
                  Track your progress regularly and celebrate small wins along the way
                </span>
              </li>
              <li className="flex gap-3 items-start">
                <IconCheck className="h-5 w-5 mt-1 text-green-500 shrink-0" />
                <span className="text-base">
                  Review and adjust your strategies based on what works best for you
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
