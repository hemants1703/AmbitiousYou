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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ThemeToggler } from "@/components/ThemeToggler";
import { useRouter } from 'next/navigation';
import { Search } from "lucide-react";
import { useDebounce } from '@/lib/hooks/use-debounce';
import { FlameIcon, CheckIcon } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { LightningBoltIcon } from "@radix-ui/react-icons";
import { Menu } from "lucide-react"; // Make sure to install lucide-react if not already

interface HeaderProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

export function Header({ onMenuClick, isSidebarOpen }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [ambitions, setAmbitions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const router = useRouter();
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

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
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onMenuClick} 
        className="md:hidden"
        aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        <Menu className="h-5 w-5" />
      </Button>
      
      <div className="flex-1 flex items-center gap-2">
        <Button variant="outline" size="sm" className="hidden md:flex gap-2" asChild>
          <Link href="/dashboard">
            <RocketIcon className="h-4 w-4 text-primary" />
            <span className="font-medium">My Journey</span>
          </Link>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="md:flex items-center gap-1 hidden text-muted-foreground"
          onClick={() => setOpen(true)}
        >
          <MagnifyingGlassIcon className="h-4 w-4" />
          <span>Search ambitions...</span>
          <kbd className="ml-2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="ghost" size="icon" className="relative group">
              <div className="relative">
                <motion.div 
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ 
                    repeat: Infinity, 
                    repeatType: "reverse", 
                    duration: 2,
                    ease: "easeInOut",
                    repeatDelay: 5
                  }}
                  className="absolute -inset-1 rounded-full bg-gradient-to-r from-orange-500/50 to-amber-300/50 opacity-75 blur-sm group-hover:opacity-100"
                />
                <div className="relative flex items-center justify-center">
                  <FlameIcon className="h-5 w-5 text-orange-500 group-hover:text-orange-600" />
                </div>
              </div>
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-amber-500 hover:bg-amber-600">
                7
              </Badge>
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80 p-0" align="end">
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-orange-500 to-amber-300 flex items-center justify-center">
                    <FlameIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">7 Day Streak!</h4>
                    <p className="text-xs text-muted-foreground">Keep going to reach your next milestone</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="h-7 gap-1">
                  <CheckIcon className="h-3.5 w-3.5" />
                  <span className="text-xs">Check In</span>
                </Button>
              </div>
              
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold">Daily check-in</span>
                  <span className="text-emerald-500 font-medium">Completed today!</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Next milestone: 10 days</span>
                    <span>7/10</span>
                  </div>
                  <Progress value={70} className="h-2" />
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 pt-2">
                {['M','T','W','T','F','S','S'].map((day, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <span className="text-xs text-muted-foreground mb-1">{day}</span>
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] ${i < 7 ? 'bg-orange-500 text-white' : 'bg-muted text-muted-foreground'}`}>
                      {i < 7 ? <CheckIcon className="h-3 w-3" /> : ""}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-muted/50 p-3 rounded-md mt-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <LightningBoltIcon className="h-4 w-4 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">Your longest streak: 14 days</p>
                    <p className="text-xs text-muted-foreground">Can you beat your record?</p>
                  </div>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>

        <ThemeToggler />

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <BellIcon className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]">
                3
              </Badge>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Notifications</SheetTitle>
            </SheetHeader>
            <div className="grid gap-4 p-4">
              <div className="border-b pb-3">
                <div className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <RocketIcon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">New achievement unlocked!</p>
                    <p className="text-xs text-muted-foreground">You&apos;ve completed 5 consecutive days of progress.</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
              </div>
              
              <div className="border-b pb-3">
                <div className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-500/10">
                    <TargetIcon className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">Milestone reached</p>
                    <p className="text-xs text-muted-foreground">Your "Learn Piano" ambition is 50% complete!</p>
                    <p className="text-xs text-muted-foreground">Yesterday</p>
                  </div>
                </div>
              </div>
              
              <div className="pb-3">
                <div className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-green-500/10">
                    <ClockIcon className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">Task reminder</p>
                    <p className="text-xs text-muted-foreground">Don&apos;t forget to practice scales for 30 mins today</p>
                    <p className="text-xs text-muted-foreground">2 days ago</p>
                  </div>
                </div>
              </div>
              
              <Button variant="outline" size="sm" className="mt-2">
                Mark all as read
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <QuestionMarkCircledIcon className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Help & Resources</SheetTitle>
            </SheetHeader>
            <div className="grid gap-4 p-4">
              <div className="grid gap-2">
                <h3 className="text-sm font-medium">Getting Started</h3>
                <p className="text-sm text-muted-foreground">
                  Learn how to create your first ambition and track your
                  progress effectively
                </p>
                <Button size="sm" variant="outline" className="mt-2 w-full">
                  Watch Tutorial
                </Button>
              </div>
              <div className="grid gap-2">
                <h3 className="text-sm font-medium">Documentation</h3>
                <p className="text-sm text-muted-foreground">
                  Explore our comprehensive guides and documentation
                </p>
                <Button size="sm" variant="outline" className="mt-2 w-full">
                  View Docs
                </Button>
              </div>
              <div className="grid gap-2">
                <h3 className="text-sm font-medium">Need Help?</h3>
                <p className="text-sm text-muted-foreground">
                  Our support team is ready to assist you
                </p>
                <Button size="sm" variant="outline" className="mt-2 w-full">
                  Contact Support
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-8 w-8 ml-1"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatar.jpg" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Jane Doe</p>
                <p className="text-xs leading-none text-muted-foreground">
                  jane@example.com
                </p>
                <Badge className="mt-1 w-fit">Achiever Plan</Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/profile" className="w-full">
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/settings" className="w-full">
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/billing" className="w-full">
                Billing
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Search across your ambitions, tasks, and more..." 
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          <CommandEmpty>
            <div className="flex flex-col items-center justify-center py-6">
              <Search className="h-10 w-10 text-muted-foreground mb-2 opacity-50" />
              <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setOpen(false);
                  router.push('/ambitions/new');
                }}
              >
                Create New Ambition
              </Button>
            </div>
          </CommandEmpty>
          
          {ambitions.length > 0 && (
            <CommandGroup heading="Ambitions">
              {ambitions.map((ambition) => (
                <CommandItem
                  key={ambition.id}
                  onSelect={() => {
                    router.push(`/ambitions/${ambition.id}`);
                    setOpen(false);
                  }}
                >
                  <TargetIcon className="mr-2 h-4 w-4" />
                  <span>{ambition.title}</span>
                  {ambition.progress > 0 && (
                    <span className="ml-auto text-xs text-muted-foreground">{ambition.progress}%</span>
                  )}
                </CommandItem>
              ))}
              <CommandItem 
                onSelect={() => {
                  router.push(`/ambitions?q=${encodeURIComponent(searchQuery)}`);
                  setOpen(false);
                }}
                className="text-sm text-muted-foreground"
              >
                <Search className="mr-2 h-4 w-4" />
                <span>View all results for "{searchQuery}"</span>
              </CommandItem>
            </CommandGroup>
          )}
          
          {tasks.length > 0 && (
            <CommandGroup heading="Tasks">
              {tasks.map((task) => (
                <CommandItem
                  key={task.id}
                  onSelect={() => {
                    router.push(`/tasks/${task.id}`);
                    setOpen(false);
                  }}
                >
                  <ClockIcon className="mr-2 h-4 w-4" />
                  <div className="flex flex-1 items-center justify-between">
                    <span>{task.title}</span>
                    <Badge variant={task.dueDate ? "outline" : "secondary"} className="ml-2">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No deadline'}
                    </Badge>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          
          <CommandGroup heading="Quick Actions">
            <CommandItem onSelect={() => {
              router.push('/ambitions/new');
              setOpen(false);
            }}>
              <PlusCircledIcon className="mr-2 h-4 w-4" />
              <span>Create New Ambition</span>
            </CommandItem>
            <CommandItem onSelect={() => {
              router.push('/analytics');
              setOpen(false);
            }}>
              <BarChartIcon className="mr-2 h-4 w-4" />
              <span>View Analytics</span>
            </CommandItem>
            <CommandItem onSelect={() => {
              router.push('/dashboard');
              setOpen(false);
            }}>
              <RocketIcon className="mr-2 h-4 w-4" />
              <span>Go to Dashboard</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </header>
  );

  async function fetchSearchResults(query) {
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Search failed');
      return await response.json();
    } catch (error) {
      console.error('Error fetching search results:', error);
      return { ambitions: [], tasks: [] };
    }
  }

  async function fetchRecentItems() {
    try {
      const response = await fetch('/api/recent');
      if (!response.ok) throw new Error('Failed to fetch recent items');
      return await response.json();
    } catch (error) {
      console.error('Error fetching recent items:', error);
      return { ambitions: [], tasks: [] };
    }
  }
}
