"use client";

import { useState, useTransition, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { IconCheck, IconSelector, IconLoader2 } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import {
  getTimezonesGroupedByCountry,
  getTimezoneById,
  searchTimezones,
  type TimezoneInfo,
} from "./timezones";
import { updateTimezoneAction } from "./actions";
import { toast } from "sonner";

interface TimezoneSelectorProps {
  currentTimezone: string;
}

export default function TimezoneSelector({ currentTimezone }: TimezoneSelectorProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(currentTimezone);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const groupedTimezones = useMemo(() => getTimezonesGroupedByCountry(), []);
  const currentTzInfo = useMemo(() => getTimezoneById(value), [value]);

  // Group search results by country
  const displayData = useMemo(() => {
    if (!searchQuery.trim()) return groupedTimezones;

    const results = searchTimezones(searchQuery);
    const grouped: Record<string, TimezoneInfo[]> = {};
    for (const tz of results) {
      const key = tz.country || "Other";
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(tz);
    }
    return grouped;
  }, [searchQuery, groupedTimezones]);

  const handleSelect = (tzId: string) => {
    setValue(tzId);
    setOpen(false);
    setSearchQuery("");

    startTransition(async () => {
      const result = await updateTimezoneAction(tzId);
      if (result.success) {
        toast.success("Timezone updated successfully");
      } else {
        toast.error(result.error ?? "Failed to update timezone");
        setValue(currentTimezone);
      }
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={isPending}
        >
          {isPending ? (
            <IconLoader2 className="size-4 animate-spin" />
          ) : currentTzInfo ? (
            <span className="truncate">
              {currentTzInfo.displayName}, {currentTzInfo.country}{" "}
              <span className="text-muted-foreground">(UTC{currentTzInfo.utcOffset})</span>
            </span>
          ) : (
            value || "Select timezone..."
          )}
          <IconSelector className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[420px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search by country or city..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList className="max-h-[300px]">
            <CommandEmpty>No timezone found.</CommandEmpty>
            {Object.entries(displayData).map(([country, timezones]) => (
              <CommandGroup key={country} heading={country}>
                {timezones.map((tz) => (
                  <CommandItem
                    key={tz.id}
                    value={tz.id}
                    onSelect={() => handleSelect(tz.id)}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <IconCheck
                        className={cn("h-4 w-4", value === tz.id ? "opacity-100" : "opacity-0")}
                      />
                      <span>{tz.displayName}</span>
                    </div>
                    <span className="text-muted-foreground text-xs">UTC{tz.utcOffset}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
