"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as Select from "@/components/ui/select";
import * as Tooltip from "@/components/ui/tooltip";
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
        <Tooltip.Tooltip>
          <Tooltip.TooltipTrigger asChild>
            <Button variant="destructive" size="icon" onClick={props.onClear} className="rounded-full size-9 self-end lg:self-auto" aria-label="Clear filters">
              <XIcon />
            </Button>
          </Tooltip.TooltipTrigger>
          <Tooltip.TooltipContent>Clear Filters</Tooltip.TooltipContent>
        </Tooltip.Tooltip>
      )}

      <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[40rem]">
        <Input value={props.value.search || ""} onChange={handleSearchChange} placeholder="Search ambitions…" aria-label="Search ambitions" />

        <Select.Select value={props.value.status || ""} onValueChange={(value) => updateFilters("status", value)}>
          <Select.SelectTrigger aria-label="Filter by status">
            <Select.SelectValue placeholder="Status" />
          </Select.SelectTrigger>
          <Select.SelectContent>
            <Select.SelectItem value="active">Active</Select.SelectItem>
            <Select.SelectItem value="completed">Completed</Select.SelectItem>
            <Select.SelectItem value="missed">Missed</Select.SelectItem>
          </Select.SelectContent>
        </Select.Select>

        <Select.Select value={props.value.priority || ""} onValueChange={(value) => updateFilters("priority", value)}>
          <Select.SelectTrigger aria-label="Filter by priority">
            <Select.SelectValue placeholder="Priority" />
          </Select.SelectTrigger>
          <Select.SelectContent>
            <Select.SelectItem value="low">Low</Select.SelectItem>
            <Select.SelectItem value="medium">Medium</Select.SelectItem>
            <Select.SelectItem value="high">High</Select.SelectItem>
          </Select.SelectContent>
        </Select.Select>
      </div>
    </div>
  );
}
