"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { XIcon } from "lucide-react";
import { ChangeEvent } from "react";

export interface AmbitionFiltersState {
  status?: "active" | "completed" | "missed";
  priority?: "low" | "medium" | "high";
  search?: string;
}

interface AmbitionFiltersProps {
  value: AmbitionFiltersState;
  onChange: (nextValue: AmbitionFiltersState) => void;
  onClear: () => void;
}

export default function AmbitionFilters(props: AmbitionFiltersProps) {
  const hasActiveFilters = Boolean(props.value.status || props.value.priority || props.value.search?.trim());

  const updateFilters = (key: keyof AmbitionFiltersState, value: string | null) => {
    props.onChange({
      ...props.value,
      [key]: value && value.trim() ? value.trim() : undefined,
    });
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateFilters("search", event.target.value);
  };

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-end">
      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="destructive" size="icon" onClick={props.onClear} className="rounded-full size-9 self-end lg:self-auto" aria-label="Clear filters">
              <XIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Clear Filters</TooltipContent>
        </Tooltip>
      )}

      <div className="flex gap-2 justify-between lg:min-w-160">
        <Input value={props.value.search || ""} onChange={handleSearchChange} placeholder="Search ambitions…" aria-label="Search ambitions" />

        <div className="flex gap-2">
          <Select value={props.value.status || ""} onValueChange={(value) => updateFilters("status", value)}>
            <SelectTrigger aria-label="Filter by status" className="**:data-[slot=select-value]:block **:data-[slot=select-value]:truncate">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="missed">Missed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={props.value.priority || ""} onValueChange={(value) => updateFilters("priority", value)}>
            <SelectTrigger aria-label="Filter by priority" className="**:data-[slot=select-value]:block **:data-[slot=select-value]:truncate">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
