"use client";

import { Ambition, Task, Milestone } from "@/db/schema";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";

// Aliases for backward compatibility
type AmbitionTask = Task;
type AmbitionMilestone = Milestone;

// Define types for our data
type SortableFields =
  | "ambitionName"
  | "ambitionPercentageCompleted"
  | "ambitionPriority"
  | "ambitionEndDate"
  | "id"
  | "ambitionDefinition"
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
  priority: string | null;
}

export default function AmbitionsClient({
  ambitions,
  ambitionTasks,
  ambitionMilestones,
}: {
  ambitions: Ambition[];
  ambitionTasks: AmbitionTask[];
  ambitionMilestones: AmbitionMilestone[];
}) {
  // await new Promise(resolve => setTimeout(resolve, 1000));
  const activeAmbitions = useMemo(
    () => ambitions.filter((ambition) => ambition.ambitionStatus === "active"),
    [ambitions]
  );

  // Filter states
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    priority: null,
  });

  // Sort states
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "ambitionEndDate", // Default sort by end date
    direction: "desc", // Default direction (newest first)
  });

  const [searchQuery, setSearchQuery] = useState("");

  // Extract unique priorities for filter options
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
    if (!filters.priority) return true;

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

    // Handle date strings for end date
    if (sortConfig.key === "ambitionEndDate") {
      const valueA = a.ambitionEndDate;
      const valueB = b.ambitionEndDate;
      return sortConfig.direction === "asc"
        ? valueA.getTime() - valueB.getTime()
        : valueB.getTime() - valueA.getTime();
    }

    // Handle numeric values
    if (sortConfig.key === "ambitionPercentageCompleted") {
      const valueA = a.ambitionPercentageCompleted || 0;
      const valueB = b.ambitionPercentageCompleted || 0;
      return sortConfig.direction === "asc" ? valueA - valueB : valueB - valueA;
    }

    // Default string comparison
    const valueA = String(a[sortConfig.key as keyof Ambition] ?? "");
    const valueB = String(b[sortConfig.key as keyof Ambition] ?? "");
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
      ambitionEndDate: "Due Date",
      "tasks.completed": "Tasks Completed",
      id: "ID",
      ambitionDefinition: "Definition",
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
    setFilters({ priority: null });
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
