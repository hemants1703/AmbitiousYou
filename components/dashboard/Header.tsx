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
import { Input } from "@/components/ui/input";
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

export function Header() {
  const [open, setOpen] = useState(false);

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

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background px-4 md:px-6">
      <div className="flex-1 flex items-center gap-2">
        <Button variant="outline" size="sm" className="hidden md:flex gap-2">
          <RocketIcon className="h-4 w-4 text-primary" />
          <span className="font-medium">My Journey</span>
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
        <Button variant="ghost" size="icon" className="relative">
          <BellIcon className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]">
            3
          </Badge>
        </Button>

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
            <div className="grid gap-4 py-4">
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
        <CommandInput placeholder="Search across your ambitions, tasks, and more..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Ambitions">
            <CommandItem>
              <TargetIcon className="mr-2 h-4 w-4" />
              <span>Learn Piano</span>
            </CommandItem>
            <CommandItem>
              <TargetIcon className="mr-2 h-4 w-4" />
              <span>Complete Marathon Training</span>
            </CommandItem>
            <CommandItem>
              <TargetIcon className="mr-2 h-4 w-4" />
              <span>Write a Book</span>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Recent Tasks">
            <CommandItem>
              <ClockIcon className="mr-2 h-4 w-4" />
              <span>Practice scales for 30 mins</span>
            </CommandItem>
            <CommandItem>
              <ClockIcon className="mr-2 h-4 w-4" />
              <span>Run 5K</span>
            </CommandItem>
            <CommandItem>
              <ClockIcon className="mr-2 h-4 w-4" />
              <span>Draft chapter outline</span>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Quick Actions">
            <CommandItem>
              <PlusCircledIcon className="mr-2 h-4 w-4" />
              <span>Create New Ambition</span>
            </CommandItem>
            <CommandItem>
              <BarChartIcon className="mr-2 h-4 w-4" />
              <span>View Analytics</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </header>
  );
}
