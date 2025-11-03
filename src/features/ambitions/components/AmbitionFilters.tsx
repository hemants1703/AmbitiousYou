"use client";

import { Button } from "@/components/ui/button";
import * as Select from "@/components/ui/select";
import * as Tooltip from "@/components/ui/tooltip";
import { IconX } from "@tabler/icons-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export interface AmbitionFiltersState {
  status?: "active" | "completed" | "archive";
  priority?: "low" | "medium" | "high";
  search?: string;
}

export default function AmbitionFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [hasSearchParams, setHasSearchParams] = useState(searchParams.toString().length > 0);

  const updateFilters = (key: string, value: string | null) => {
    const updatedSearchParams = new URLSearchParams(searchParams.toString());

    if (value && value.trim()) {
      updatedSearchParams.set(key, value.trim());
    } else {
      updatedSearchParams.delete(key);
    }

    const searchParamsString = updatedSearchParams.toString();
    const url = searchParamsString ? `${pathname}?${searchParamsString}` : pathname;

    router.push(url);
  };

  const clearFilters = () => router.push(pathname);

  useEffect(() => setHasSearchParams(searchParams.toString().length > 0), [searchParams]);

  return (
    <div className="flex gap-2 justify-end items-center">
      {/* Clear Filters Button */}
      {hasSearchParams && (
        <Tooltip.Tooltip>
          <Tooltip.TooltipTrigger asChild>
            <Button
              variant="destructive"
              size="icon"
              onClick={clearFilters}
              className="rounded-full size-6"
            >
              <IconX />
            </Button>
          </Tooltip.TooltipTrigger>
          <Tooltip.TooltipContent>Clear Filters</Tooltip.TooltipContent>
        </Tooltip.Tooltip>
      )}

      {/* Status Filter */}
      <Select.Select
        value={searchParams.get("status") || ""}
        onValueChange={(value) => updateFilters("status", value)}
      >
        <Select.SelectTrigger>
          <Select.SelectValue placeholder="Status" />
        </Select.SelectTrigger>
        <Select.SelectContent>
          <Select.SelectItem value="active">Active</Select.SelectItem>
          <Select.SelectItem value="completed">Completed</Select.SelectItem>
          <Select.SelectItem value="archive">Archive</Select.SelectItem>
        </Select.SelectContent>
      </Select.Select>

      {/* Priority Filter */}
      <Select.Select
        value={searchParams.get("priority") || ""}
        onValueChange={(value) => updateFilters("priority", value)}
      >
        <Select.SelectTrigger>
          <Select.SelectValue placeholder="Priority" />
        </Select.SelectTrigger>
        <Select.SelectContent>
          <Select.SelectItem value="low">Low</Select.SelectItem>
          <Select.SelectItem value="medium">Medium</Select.SelectItem>
          <Select.SelectItem value="high">High</Select.SelectItem>
        </Select.SelectContent>
      </Select.Select>
    </div>
  );
}
