"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import * as DropdownMenu from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { IconCirclePlus2, IconFilter, IconSearch, IconSettings2, IconX } from "@tabler/icons-react";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

type SortKey =
  | "ambitionName"
  | "ambitionPercentageCompleted"
  | "ambitionPriority"
  | "ambitionEndDate"
  | "tasks.completed";

export function AmbitionsControlsClient({
  priorities,
}: {
  priorities: ("low" | "medium" | "high")[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const currentPriority = searchParams.get("priority") as "low" | "medium" | "high" | null;
  const currentSort = searchParams.get("sort") as SortKey | null;
  const currentDirection = (searchParams.get("direction") as "asc" | "desc") || "desc";

  const updateSearchParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    const timeoutId = setTimeout(() => {
      updateSearchParams({ search: value || null });
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const applyFilter = (priority: "low" | "medium" | "high") => {
    updateSearchParams({ priority: currentPriority === priority ? null : priority });
    setIsFilterOpen(false);
  };

  const clearFilters = () => {
    updateSearchParams({ priority: null });
    setIsFilterOpen(false);
  };

  const handleSort = (key: SortKey) => {
    if (currentSort === key) {
      // Toggle direction if already sorting by this key
      updateSearchParams({
        sort: key,
        direction: currentDirection === "asc" ? "desc" : "asc",
      });
    } else {
      // Set new sort key with default direction
      updateSearchParams({ sort: key, direction: "asc" });
    }
    setIsSortOpen(false);
  };

  const getSortOptionName = () => {
    const options: Record<SortKey, string> = {
      ambitionName: "Title",
      ambitionPercentageCompleted: "Progress",
      ambitionPriority: "Priority",
      ambitionEndDate: "Due Date",
      "tasks.completed": "Tasks Completed",
    };

    return currentSort ? options[currentSort] : "Sort";
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
      <div className="relative w-full md:w-[350px]">
        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search ambitions..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2"
            onClick={() => {
              setSearchQuery("");
              updateSearchParams({ search: null });
            }}
          >
            <IconX className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </button>
        )}
      </div>

      <div className="flex gap-2 w-full md:w-auto flex-wrap">
        <DropdownMenu.DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <DropdownMenu.DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <IconFilter className="h-4 w-4" />
              Filter
              {currentPriority && (
                <Badge variant="secondary" className="ml-1 h-5 px-1">
                  1
                </Badge>
              )}
            </Button>
          </DropdownMenu.DropdownMenuTrigger>
          <DropdownMenu.DropdownMenuContent className="w-56">
            <DropdownMenu.DropdownMenuLabel>Filter Ambitions</DropdownMenu.DropdownMenuLabel>
            <DropdownMenu.DropdownMenuSeparator />

            <DropdownMenu.DropdownMenuGroup>
              <DropdownMenu.DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                By Priority
              </DropdownMenu.DropdownMenuLabel>
              {priorities.map((priority) => (
                <DropdownMenu.DropdownMenuItem
                  key={priority}
                  onClick={() => applyFilter(priority)}
                  className="flex justify-between"
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  {currentPriority === priority && <Check className="h-4 w-4" />}
                </DropdownMenu.DropdownMenuItem>
              ))}
            </DropdownMenu.DropdownMenuGroup>

            {currentPriority && (
              <>
                <DropdownMenu.DropdownMenuSeparator />
                <DropdownMenu.DropdownMenuItem onClick={clearFilters} className="text-red-500 flex gap-2">
                  <X className="h-4 w-4" />
                  Clear filters
                </DropdownMenu.DropdownMenuItem>
              </>
            )}
          </DropdownMenu.DropdownMenuContent>
        </DropdownMenu.DropdownMenu>

        <DropdownMenu.DropdownMenu open={isSortOpen} onOpenChange={setIsSortOpen}>
          <DropdownMenu.DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <IconSettings2 className="h-4 w-4" />
              Sort
              {currentSort && `: ${getSortOptionName()}`}
              {currentSort && ` (${currentDirection === "asc" ? "↑" : "↓"})`}
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
              {currentSort === "ambitionName" && (
                <Badge variant="secondary" className="ml-1">
                  {currentDirection === "asc" ? "A-Z" : "Z-A"}
                </Badge>
              )}
            </DropdownMenu.DropdownMenuItem>

            <DropdownMenu.DropdownMenuItem
              onClick={() => handleSort("ambitionPercentageCompleted")}
              className="flex justify-between"
            >
              By Progress
              {currentSort === "ambitionPercentageCompleted" && (
                <Badge variant="secondary" className="ml-1">
                  {currentDirection === "asc" ? "Low-High" : "High-Low"}
                </Badge>
              )}
            </DropdownMenu.DropdownMenuItem>

            <DropdownMenu.DropdownMenuItem
              onClick={() => handleSort("ambitionPriority")}
              className="flex justify-between"
            >
              By Priority
              {currentSort === "ambitionPriority" && (
                <Badge variant="secondary" className="ml-1">
                  {currentDirection === "asc" ? "Low-High" : "High-Low"}
                </Badge>
              )}
            </DropdownMenu.DropdownMenuItem>

            <DropdownMenu.DropdownMenuItem
              onClick={() => handleSort("ambitionEndDate")}
              className="flex justify-between"
            >
              By Due Date
              {currentSort === "ambitionEndDate" && (
                <Badge variant="secondary" className="ml-1">
                  {currentDirection === "asc" ? "Oldest" : "Newest"}
                </Badge>
              )}
            </DropdownMenu.DropdownMenuItem>

            <DropdownMenu.DropdownMenuItem
              onClick={() => handleSort("tasks.completed")}
              className="flex justify-between"
            >
              By Tasks Completed
              {currentSort === "tasks.completed" && (
                <Badge variant="secondary" className="ml-1">
                  {currentDirection === "asc" ? "Low-High" : "High-Low"}
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
            <IconCirclePlus2 className="h-4 w-4" />
            New Ambition
          </Link>
        </Button>
      </div>
    </div>
  );
}


