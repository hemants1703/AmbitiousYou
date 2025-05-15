"use client";

import { Button } from "@/components/ui/button";
import * as Card from "@/components/ui/card";
import * as Tabs from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CalendarIcon,
  CheckCircleIcon,
  ChevronRight,
  Filter,
  Folder,
  PlusCircle,
  Search,
  Settings2,
  Target,
  Check,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useMemo } from "react";
import * as DropdownMenu from "@/components/ui/dropdown-menu";
import { AmbitionData, Milestone, Task } from "@/types";
import { motivationalQuotes } from "@/lib/motivationalQuotes";

// Define types for our data
type SortableFields =
  | "ambitionName"
  | "ambitionPercentageCompleted"
  | "ambitionPriority"
  | "ambitionDeadline"
  | "id"
  | "ambitionDefinition"
  | "ambitionCategory"
  | "ambitionStartDate"
  | "ambitionStatus"
  | "ambitionColor"
  | "ambitionTrackingMethod";

type SortKey = SortableFields | "tasks.completed";
type SortDirection = "asc" | "desc";

interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

interface Filters {
  category: string | null;
  priority: string | null;
}

export default function AmbitionsClient({
  ambitions,
  ambitionTasks,
  ambitionMilestones,
}: {
  ambitions: AmbitionData[];
  ambitionTasks: AmbitionTask[];
  ambitionMilestones: AmbitionMilestone[];
}) {
  // await new Promise(resolve => setTimeout(resolve, 1000));
  const activeAmbitions = useMemo(
    () => ambitions.filter((ambition) => ambition.ambitionStatus === "active"),
    [ambitions]
  );
  const completedAmbitions = useMemo(
    () => ambitions.filter((ambition) => ambition.ambitionStatus === "completed"),
    [ambitions]
  );
  const archivedAmbitions = useMemo(
    () => ambitions.filter((ambition) => ambition.ambitionStatus === "archived"),
    [ambitions]
  );

  // Filter states
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    category: null,
    priority: null,
  });

  // Sort states
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "ambitionDeadline", // Default sort by deadline
    direction: "desc", // Default direction (newest first)
  });

  const [searchQuery, setSearchQuery] = useState("");

  // Extract unique categories and priorities for filter options
  const categories = [...new Set(ambitions.map((ambition) => ambition.ambitionCategory))];
  const priorities = [...new Set(ambitions.map((ambition) => ambition.ambitionPriority))];

  // Filter ambitions based on selected filters
  const filteredAmbitions = ambitions.filter((ambition) => {
    // First check search query
    if (
      searchQuery &&
      !ambition.ambitionName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !(ambition.ambitionDefinition?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    ) {
      return false;
    }

    // If no filters are applied, show all ambitions (that match search)
    if (!filters.category && !filters.priority) return true;

    // Apply category filter
    if (filters.category && ambition.ambitionCategory !== filters.category) {
      return false;
    }

    // Apply priority filter
    if (filters.priority && ambition.ambitionPriority !== filters.priority) {
      return false;
    }

    return true;
  });

  // Apply sorting to ambitions
  const sortedAndFilteredAmbitions = [...filteredAmbitions].sort((a, b) => {
    // Handle nested properties like tasks.completed
    if (sortConfig.key === "tasks.completed") {
      const tasksA = ambitionTasks.filter((t) => t.ambitionId === a.id);
      const tasksB = ambitionTasks.filter((t) => t.ambitionId === b.id);
      const valueA = tasksA.filter((t) => t.taskCompleted).length;
      const valueB = tasksB.filter((t) => t.taskCompleted).length;
      return sortConfig.direction === "asc" ? valueA - valueB : valueB - valueA;
    }

    // Handle date strings for due date
    if (sortConfig.key === "ambitionDeadline") {
      const valueA = a.ambitionDeadline;
      const valueB = b.ambitionDeadline;
      return sortConfig.direction === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    // Handle numeric values
    if (sortConfig.key === "ambitionPercentageCompleted") {
      const valueA = a.ambitionPercentageCompleted;
      const valueB = b.ambitionPercentageCompleted;
      return sortConfig.direction === "asc" ? valueA - valueB : valueB - valueA;
    }

    // Default string comparison
    const valueA = String(a[sortConfig.key as keyof AmbitionData] ?? "");
    const valueB = String(b[sortConfig.key as keyof AmbitionData] ?? "");
    return sortConfig.direction === "asc"
      ? valueA.localeCompare(valueB)
      : valueB.localeCompare(valueA);
  });

  // Handle setting sort configuration
  const handleSort = (key: SortKey) => {
    // If already sorting by this key, toggle direction
    if (sortConfig.key === key) {
      setSortConfig({
        key,
        direction: sortConfig.direction === "asc" ? "desc" : "asc",
      });
    } else {
      // Otherwise, set new key with default direction
      setSortConfig({
        key,
        direction: "asc",
      });
    }
    setIsSortOpen(false);
  };

  // Get sort option display name
  const getSortOptionName = () => {
    const options: Record<SortKey, string> = {
      ambitionName: "Title",
      ambitionPercentageCompleted: "Progress",
      ambitionPriority: "Priority",
      ambitionDeadline: "Due Date",
      "tasks.completed": "Tasks Completed",
      id: "ID",
      ambitionDefinition: "Definition",
      ambitionCategory: "Category",
      ambitionStartDate: "Start Date",
      ambitionStatus: "Status",
      ambitionColor: "Color",
      ambitionTrackingMethod: "Tracking Method",
    };

    return options[sortConfig.key] || "Sort";
  };

  // Handle applying a filter
  const applyFilter = (type: keyof Filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [type]: prev[type] === value ? null : value,
    }));
    setIsFilterOpen(false);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({ category: null, priority: null });
    setIsFilterOpen(false);
  };

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
        <span key={index} className="bg-yellow-200 text-black rounded px-0.5">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="flex flex-col gap-6 max-sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-2"
      >
        <h1 className="text-3xl font-bold tracking-tight">Your Ambitions</h1>
        <p className="text-muted-foreground">View and manage all your ambitions in one place</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center"
      >
        <div className="relative w-full md:w-[350px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search ambitions..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex gap-2 w-full md:w-auto flex-wrap"
        >
          <DropdownMenu.DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <DropdownMenu.DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-4 w-4" />
                Filter
                {(filters.category || filters.priority) && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1">
                    {Object.values(filters).filter(Boolean).length}
                  </Badge>
                )}
              </Button>
            </DropdownMenu.DropdownMenuTrigger>
            <DropdownMenu.DropdownMenuContent className="w-56">
              <DropdownMenu.DropdownMenuLabel>Filter Ambitions</DropdownMenu.DropdownMenuLabel>
              <DropdownMenu.DropdownMenuSeparator />

              <DropdownMenu.DropdownMenuGroup>
                <DropdownMenu.DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  By Category
                </DropdownMenu.DropdownMenuLabel>
                {categories.map((category) => (
                  <DropdownMenu.DropdownMenuItem
                    key={category}
                    onClick={() => applyFilter("category", category)}
                    className="flex justify-between"
                  >
                    {category}
                    {filters.category === category && <Check className="h-4 w-4" />}
                  </DropdownMenu.DropdownMenuItem>
                ))}
              </DropdownMenu.DropdownMenuGroup>

              <DropdownMenu.DropdownMenuSeparator />

              <DropdownMenu.DropdownMenuGroup>
                <DropdownMenu.DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  By Priority
                </DropdownMenu.DropdownMenuLabel>
                {priorities.map((priority) => (
                  <DropdownMenu.DropdownMenuItem
                    key={priority}
                    onClick={() => applyFilter("priority", priority)}
                    className="flex justify-between"
                  >
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    {filters.priority === priority && <Check className="h-4 w-4" />}
                  </DropdownMenu.DropdownMenuItem>
                ))}
              </DropdownMenu.DropdownMenuGroup>

              <DropdownMenu.DropdownMenuSeparator />

              {(filters.category || filters.priority) && (
                <DropdownMenu.DropdownMenuItem
                  onClick={clearFilters}
                  className="text-red-500 flex gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear filters
                </DropdownMenu.DropdownMenuItem>
              )}
            </DropdownMenu.DropdownMenuContent>
          </DropdownMenu.DropdownMenu>

          <DropdownMenu.DropdownMenu open={isSortOpen} onOpenChange={setIsSortOpen}>
            <DropdownMenu.DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Settings2 className="h-4 w-4" />
                Sort{sortConfig.key && `: ${getSortOptionName()}`}
                {sortConfig.direction === "asc" ? ": Ascending" : ": Descending"}
              </Button>
            </DropdownMenu.DropdownMenuTrigger>
            <DropdownMenu.DropdownMenuContent className="w-56">
              <DropdownMenu.DropdownMenuLabel>Sort Ambitions</DropdownMenu.DropdownMenuLabel>
              <DropdownMenu.DropdownMenuSeparator />

              <DropdownMenu.DropdownMenuItem
                onClick={() => handleSort("ambitionName")}
                className="flex justify-between"
              >
                By Title
                {sortConfig.key === "ambitionName" && (
                  <Badge variant="secondary" className="ml-1">
                    {sortConfig.direction === "asc" ? "A-Z" : "Z-A"}
                  </Badge>
                )}
              </DropdownMenu.DropdownMenuItem>

              <DropdownMenu.DropdownMenuItem
                onClick={() => handleSort("ambitionPercentageCompleted")}
                className="flex justify-between"
              >
                By Progress
                {sortConfig.key === "ambitionPercentageCompleted" && (
                  <Badge variant="secondary" className="ml-1">
                    {sortConfig.direction === "asc" ? "Low-High" : "High-Low"}
                  </Badge>
                )}
              </DropdownMenu.DropdownMenuItem>

              <DropdownMenu.DropdownMenuItem
                onClick={() => handleSort("ambitionPriority")}
                className="flex justify-between"
              >
                By Priority
                {sortConfig.key === "ambitionPriority" && (
                  <Badge variant="secondary" className="ml-1">
                    {sortConfig.direction === "asc" ? "Low-High" : "High-Low"}
                  </Badge>
                )}
              </DropdownMenu.DropdownMenuItem>

              <DropdownMenu.DropdownMenuItem
                onClick={() => handleSort("ambitionDeadline")}
                className="flex justify-between"
              >
                By Due Date
                {sortConfig.key === "ambitionDeadline" && (
                  <Badge variant="secondary" className="ml-1">
                    {sortConfig.direction === "asc" ? "Oldest" : "Newest"}
                  </Badge>
                )}
              </DropdownMenu.DropdownMenuItem>

              <DropdownMenu.DropdownMenuItem
                onClick={() => handleSort("tasks.completed")}
                className="flex justify-between"
              >
                By Tasks Completed
                {sortConfig.key === "tasks.completed" && (
                  <Badge variant="secondary" className="ml-1">
                    {sortConfig.direction === "asc" ? "Low-High" : "High-Low"}
                  </Badge>
                )}
              </DropdownMenu.DropdownMenuItem>
            </DropdownMenu.DropdownMenuContent>
          </DropdownMenu.DropdownMenu>

          <Button asChild size="sm">
            <Link
              prefetch={true}
              href={`/ambitions/new`}
              className="md:ml-0 flex justify-center items-center gap-1"
            >
              <PlusCircle className="h-4 w-4" />
              New Ambition
            </Link>
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
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
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {sortedAndFilteredAmbitions.length > 0 ? (
                  sortedAndFilteredAmbitions.map((ambition, index) => {
                    const ambitionTasksList = ambitionTasks.filter(
                      (t) => t.ambitionId === ambition.id
                    );
                    const completedTasks = ambitionTasksList.filter((t) => t.taskCompleted).length;
                    const totalTasks = ambitionTasksList.length;

                    return (
                      <motion.div
                        key={ambition.id}
                        variants={item}
                        transition={{ duration: 0.3, delay: 0.05 * index }}
                      >
                        <Link prefetch={true} href={`/ambitions/${ambition.id}`}>
                          <Card.Card
                            className={`bg-gradient-to-b dark:from-slate-950 from-slate-200 to-[${ambition.ambitionColor}] cursor-pointer hover:shadow-md transition-all hover:translate-y-[-2px] duration-300`}
                          >
                            <Card.CardHeader className="pb-2">
                              <div className="flex items-center justify-between">
                                <AmbitionCategoryBadge
                                  ambitionCategory={ambition.ambitionCategory}
                                />
                                <AmbitionColorBadge
                                  ambitionColor={ambition.ambitionColor}
                                  index={index}
                                  width={100}
                                />
                                <AmbitionPriorityBadge
                                  ambitionPriority={ambition.ambitionPriority}
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
                                  <motion.div
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
                                  </motion.div>
                                </div>
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <CheckCircleIcon className="h-3.5 w-3.5" />
                                    <span>
                                      {completedTasks}/{totalTasks} tasks
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <CalendarIcon className="h-3.5 w-3.5" />
                                    <span>
                                      Due{" "}
                                      {new Date(ambition.ambitionDeadline).toLocaleDateString(
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
                                <motion.div whileHover={{ x: 3 }} transition={{ duration: 0.2 }}>
                                  <ChevronRight className="h-4 w-4" />
                                </motion.div>
                              </div>
                            </Card.CardFooter>
                          </Card.Card>
                        </Link>
                      </motion.div>
                    );
                  })
                ) : (
                  <motion.div
                    className="col-span-full text-center py-10 text-muted-foreground"
                    variants={item}
                  >
                    <Filter className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No ambitions match your filters</p>
                    <Button onClick={clearFilters} variant="ghost" size="sm" className="mt-2">
                      Clear filters
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </Tabs.TabsContent>

            {/* ACTIVE AMBITIONS TAB */}
            <Tabs.TabsContent value="active">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {activeAmbitions.length > 0 ? (
                    activeAmbitions.map((ambition, index) => {
                      const ambitionTasksList = ambitionTasks.filter(
                        (t) => t.ambitionId === ambition.id
                      );
                      const completedTasks = ambitionTasksList.filter(
                        (t) => t.taskCompleted
                      ).length;
                      const totalTasks = ambitionTasksList.length;

                      return (
                        <motion.div
                          key={ambition.id}
                          variants={item}
                          transition={{ duration: 0.3, delay: 0.05 * index }}
                        >
                          <Link prefetch={true} href={`/ambitions/${ambition.id}`}>
                            <Card.Card
                              className={`cursor-pointer hover:shadow-md transition-all hover:translate-y-[-2px] duration-300`}
                            >
                              <Card.CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                  <AmbitionCategoryBadge
                                    ambitionCategory={ambition.ambitionCategory}
                                  />
                                  <AmbitionColorBadge
                                    ambitionColor={ambition.ambitionColor}
                                    index={index}
                                    width={100}
                                  />
                                  <AmbitionPriorityBadge
                                    ambitionPriority={ambition.ambitionPriority}
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
                                    <motion.div
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
                                    </motion.div>
                                  </div>
                                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                      <CheckCircleIcon className="h-3.5 w-3.5" />
                                      <span>
                                        {completedTasks}/{totalTasks} tasks
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <CalendarIcon className="h-3.5 w-3.5" />
                                      <span>
                                        Due{" "}
                                        {new Date(ambition.ambitionDeadline).toLocaleDateString(
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
                                  <motion.div whileHover={{ x: 3 }} transition={{ duration: 0.2 }}>
                                    <ChevronRight className="h-4 w-4" />
                                  </motion.div>
                                </div>
                              </Card.CardFooter>
                            </Card.Card>
                          </Link>
                        </motion.div>
                      );
                    })
                  ) : (
                    <>
                      <Target className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p>Active ambitions will appear here</p>
                    </>
                  )}
                </motion.div>
              </motion.div>
            </Tabs.TabsContent>

            {/* COMPLETED AMBITIONS TAB */}
            <Tabs.TabsContent value="completed">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-10 text-muted-foreground"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <CheckCircleIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>Completed ambitions will appear here</p>
                </motion.div>
              </motion.div>
            </Tabs.TabsContent>

            {/* ARCHIVED AMBITIONS TAB */}
            <Tabs.TabsContent value="archive">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-10 text-muted-foreground"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Folder className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>Archived ambitions will appear here</p>
                </motion.div>
              </motion.div>
            </Tabs.TabsContent>
          </Tabs.Tabs>
        ) : (
          <NoAmbitionsFound />
        )}
      </motion.div>
    </div>
  );
}

export function AmbitionStatusBadge({ ambitionStatus }: { ambitionStatus: string }) {
  return (
    <div className="flex justify-between items-center rounded-full overflow-hidden text-xs text-black font-mono uppercase font-bold">
      <span className="bg-gray-200 px-2">STATUS</span>
      <span
        className={`px-2 ${
          ambitionStatus === "active"
            ? "bg-green-400"
            : ambitionStatus === "completed"
              ? "bg-blue-500"
              : ambitionStatus === "archived"
                ? "bg-amber-500"
                : "bg-gray-500"
        }`}
      >
        {ambitionStatus.toUpperCase()}
      </span>
    </div>
  );
}

export function AmbitionColorBadge({
  ambitionColor,
  index = 1,
  width = 100,
}: {
  ambitionColor: string;
  index: number;
  width: number;
}) {
  return (
    <motion.div
      className={`h-1 w-12 rounded-full`}
      style={{ backgroundColor: ambitionColor }}
      initial={{ width: 0 }}
      animate={{ width: width }}
      transition={{
        duration: 0.3,
        delay: 0.2 + 0.1 * (index ? index : 1),
      }}
    ></motion.div>
  );
}

export function AmbitionPriorityBadge({ ambitionPriority }: { ambitionPriority: string }) {
  return (
    <Badge
      variant="outline"
      className={`text-xs font-mono uppercase font-bold ${ambitionPriority === "high" ? "border-red-500" : ambitionPriority === "medium" ? "border-yellow-500" : "border-green-500"}`}
    >
      {ambitionPriority}
    </Badge>
  );
}

export function AmbitionCategoryBadge({ ambitionCategory }: { ambitionCategory: string }) {
  return (
    <Badge variant="outline" className="text-xs font-mono uppercase font-bold">
      {ambitionCategory}
    </Badge>
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
            <Target className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 opacity-20" />
            <h3 className="text-2xl md:text-3xl font-semibold mb-3">Start Your Journey</h3>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              You haven't created any ambitions yet. Ambitions help you track and achieve your most
              important goals.
            </p>
          </div>

          <Button asChild size="lg" className="mt-6">
            <Link prefetch={true} href="/ambitions/new" className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5" />
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
              <Settings2 className="h-5 w-5" />
              Quick Tips for Success
            </h4>

            <ul className="space-y-4 text-muted-foreground">
              <li className="flex gap-3 items-start">
                <Check className="h-5 w-5 mt-1 text-green-500 flex-shrink-0" />
                <span className="text-base">
                  Break down big goals into smaller, manageable milestones to maintain clarity and
                  focus
                </span>
              </li>
              <li className="flex gap-3 items-start">
                <Check className="h-5 w-5 mt-1 text-green-500 flex-shrink-0" />
                <span className="text-base">
                  Set realistic deadlines with buffer time to maintain steady momentum
                </span>
              </li>
              <li className="flex gap-3 items-start">
                <Check className="h-5 w-5 mt-1 text-green-500 flex-shrink-0" />
                <span className="text-base">
                  Track your progress regularly and celebrate small wins along the way
                </span>
              </li>
              <li className="flex gap-3 items-start">
                <Check className="h-5 w-5 mt-1 text-green-500 flex-shrink-0" />
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
