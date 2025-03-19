"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  DashboardIcon,
  TargetIcon,
  PlusCircledIcon,
  GearIcon,
  MixerVerticalIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import Image from "next/image";
import AmbitiousYouLogo from "../AmbitiousYouLogo";

const mainNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: DashboardIcon,
  },
  {
    title: "All Ambitions",
    href: "/ambitions",
    icon: TargetIcon,
  },
  {
    title: "Create Ambition",
    href: "/ambitions/new",
    icon: PlusCircledIcon,
  },
  // Will be implemented in future versions
  // {
  //   title: "Achievements",
  //   href: "/achievements",
  //   icon: RocketIcon,
  // },
  // {
  //   title: "Time Tracking",
  //   href: "/time_tracking",
  //   icon: ClockIcon,
  // },
  // {
  //   title: "Analytics",
  //   href: "/analytics",
  //   icon: BarChartIcon,
  // },
];

const bottomNavItems = [
  {
    title: "Settings",
    href: "/settings",
    icon: GearIcon,
  },
  // {
  //   title: "Profile",
  //   href: "/profile",
  //   icon: PersonIcon,
  // },
];

export function Sidebar({ onMobileNavigate }: { onMobileNavigate: Function }) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(true);
  const router = useRouter();

  const handleNavigation = (href: string) => {
    router.push(href);
    if (window.innerWidth < 768) {
      onMobileNavigate?.();
    }
  };

  return (
    <motion.div
      className="relative flex flex-col border-r border-border h-full bg-background"
      animate={{ width: expanded ? 240 : 60 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <div className="flex items-center h-16 border-b border-border px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Image
              src="/favicon.ico"
              alt="AmbitiousYou Logo"
              width={32}
              height={32}
            />
          </div>
          {expanded && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-2xl"
            >
              <span className="font-regular">Ambitious</span>
              <span className="font-bold">You</span>
            </motion.span>
          )}
        </Link>
      </div>

      <ScrollArea className="flex-1 py-4">
        <div className="space-y-4 px-2">
          <nav className="space-y-1">
            {mainNavItems.map((item) => (
              <TooltipProvider key={item.href} delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigation(item.href);
                      }}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                        item.href === pathname
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {expanded && <span>{item.title}</span>}
                      {item.href === "/ambitions/new" && expanded && (
                        <div className="ml-auto px-2 py-0.5 rounded-full bg-primary/20 text-xs font-medium">
                          New
                        </div>
                      )}
                    </Link>
                  </TooltipTrigger>
                  {!expanded && (
                    <TooltipContent side="right">{item.title}</TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            ))}
          </nav>
        </div>
      </ScrollArea>

      <div className="border-t border-border mt-auto py-2 px-2">
        <nav className="space-y-1">
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setExpanded(!expanded)}
                  className="max-sm:hidden flex justify-start items-center w-full gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted text-muted-foreground hover:text-foreground"
                >
                  <MixerVerticalIcon className="h-4 w-4 rotate-90" />
                  {expanded && <span>Toggle Sidebar</span>}
                </Button>
              </TooltipTrigger>
              {!expanded && (
                <TooltipContent side="right">Toggle Sidebar</TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          {bottomNavItems.map((item) => (
            <TooltipProvider key={item.href} delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation(item.href);
                    }}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                      item.href === pathname
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {expanded && <span>{item.title}</span>}
                  </Link>
                </TooltipTrigger>
                {!expanded && (
                  <TooltipContent side="right">{item.title}</TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          ))}
        </nav>
      </div>
    </motion.div>
  );
}
