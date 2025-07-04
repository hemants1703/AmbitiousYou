"use client";

import {
  BellIcon,
  MagnifyingGlassIcon,
  QuestionMarkCircledIcon,
  RocketIcon,
  TargetIcon,
  ClockIcon,
  PlusCircledIcon,
  BarChartIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import * as Dropdown from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import * as Command from "@/components/ui/command";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ThemeToggler } from "@/components/ThemeToggler";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { FlameIcon, CheckIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { LightningBoltIcon } from "@radix-ui/react-icons";
import { Menu } from "lucide-react";
import { toast } from "sonner";
import { logoutAction } from "@/app/(auth)/actions";
import { User } from "@supabase/supabase-js";
import {
  AmbitionData,
  AmbitionMilestone,
  SupabasePlansData,
  SupabaseProfileData,
  AmbitionTask,
} from "@/types";
import { pricingPlans } from "@/content/pricingPlans";

interface HeaderProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
  userData: User;
  profileData: SupabaseProfileData[];
  plansData: SupabasePlansData[];
  ambitionsData: AmbitionData[];
  tasksData: AmbitionTask[];
  milestonesData: AmbitionMilestone[];
}

export function Header({
  onMenuClick,
  isSidebarOpen,
  userData,
  profileData,
  plansData,
  ambitionsData,
  tasksData,
  milestonesData,
}: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [ambitions, setAmbitions] = useState(ambitionsData);
  const [tasks, setTasks] = useState(tasksData);
  const [milestones, setMilestones] = useState(milestonesData);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const router = useRouter();

  const { firstName, lastName } = profileData[0];
  const initialsOfUsersName = firstName.charAt(0) + lastName.charAt(0); // Placeholder for initials
  const { email } = userData;

  const planName: string | undefined = pricingPlans.find(
    (plan) => plan.slug.toLowerCase() === plansData[0].planName.toLowerCase()
  )?.name;

  const handleUserLogout = async () => {
    const logoutUser = await logoutAction();

    if (!logoutUser.success) {
      toast.error("Failed to log out. Please try again.");
    }
  };

  // Handle keyboard shortcut to open command menu
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (debouncedSearchQuery) {
      fetchSearchResults(debouncedSearchQuery).then((results) => {
        setAmbitions(results.ambitions || []);
        setTasks(results.tasks || []);
      });
    } else {
      fetchRecentItems().then((results) => {
        setAmbitions(results.ambitions || []);
        setTasks(results.tasks || []);
      });
    }
  }, [debouncedSearchQuery]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between md:justify-end gap-4 border-b bg-background px-4 md:px-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        className="md:hidden"
        aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex items-center gap-2">
        <ThemeToggler />
        <Dropdown.DropdownMenu>
          <Dropdown.DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 ml-1">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatar.jpg" alt="User" />
                <AvatarFallback>{initialsOfUsersName}</AvatarFallback>
              </Avatar>
            </Button>
          </Dropdown.DropdownMenuTrigger>
          <Dropdown.DropdownMenuContent align="end" className="w-56">
            <Dropdown.DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{`${firstName} ${lastName}`}</p>
                <p className="text-xs leading-none text-muted-foreground">{email}</p>
                {/* {planName && <Badge className="mt-1 w-fit">{planName} Plan</Badge>} */}
              </div>
            </Dropdown.DropdownMenuLabel>
            <Dropdown.DropdownMenuSeparator />
            <Dropdown.DropdownMenuItem>
              <Link prefetch={true} href="/settings" className="w-full">
                Settings
              </Link>
            </Dropdown.DropdownMenuItem>
            <Dropdown.DropdownMenuSeparator />
            <Dropdown.DropdownMenuItem>
              <button onClick={handleUserLogout}>Log Out</button>
            </Dropdown.DropdownMenuItem>
          </Dropdown.DropdownMenuContent>
        </Dropdown.DropdownMenu>
      </div>
    </header>
  );

  async function fetchSearchResults(query: string) {
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error("Search failed");
      return await response.json();
    } catch (error) {
      console.error("Error fetching search results:", error);
      return { ambitions: [], tasks: [] };
    }
  }

  async function fetchRecentItems() {
    try {
      const response = await fetch("/api/recent");
      if (!response.ok) throw new Error("Failed to fetch recent items");
      return await response.json();
    } catch (error) {
      console.error("Error fetching recent items:", error);
      return { ambitions: [], tasks: [] };
    }
  }
}
