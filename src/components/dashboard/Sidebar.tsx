"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  IconCircleDashedPlus,
  IconDashboard,
  IconSettings,
  IconSparkles,
  IconSquareToggle,
  IconTarget,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import "../../styles/cynthiaMenuItemAnimation.css";

const mainNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: IconDashboard,
  },
  {
    title: "All Ambitions",
    href: "/ambitions",
    icon: IconTarget,
  },
  {
    title: "Create Ambition",
    href: "/ambitions/new",
    icon: IconCircleDashedPlus,
  },
  {
    title: "Cynthia",
    href: "/cynthia",
    icon: IconSparkles,
  },
];

const bottomNavItems = [
  {
    title: "Settings",
    href: "/settings",
    icon: IconSettings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(true);

  return (
    <motion.div
      className="relative flex flex-col border-r border-border h-full bg-background"
      animate={{ width: expanded ? 240 : 60 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      {/* AMBITIOUSYOU LOGO */}
      <div className="flex items-center h-16 border-b border-border px-4">
        <Link prefetch={true} href="/dashboard" className="flex items-center gap-2">
          {/* <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center"> */}
          <Image src="/svg_logos/favicon_32px.svg" alt="AmbitiousYou Logo" width={32} height={32} />
          {/* </div> */}
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

      {/* MAIN NAVIGATION */}
      <ScrollArea className="flex-1 py-4">
        <div className="space-y-4 px-2">
          <nav className="space-y-1">
            {mainNavItems.map((item) => (
              <TooltipProvider key={item.href} delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      prefetch={true}
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
                        item.href === pathname
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground",
                        item.href === "/cynthia" ? "animated-cynthia-menu-item" : "",
                        item.href === "/cynthia" && pathname === "/cynthia"
                          ? "active text-white text-shadow-lg"
                          : ""
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <item.icon className={cn("size-4", item.href === "/cynthia" ? "" : "")} />
                        {expanded && <span>{item.title}</span>}
                      </span>
                    </Link>
                  </TooltipTrigger>
                  {!expanded && <TooltipContent side="right">{item.title}</TooltipContent>}
                </Tooltip>
              </TooltipProvider>
            ))}
          </nav>
        </div>
      </ScrollArea>

      {/* BOTTOM NAVIGATION */}
      <div className="border-t border-border mt-auto py-2 px-2">
        <nav className="space-y-1">
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="max-sm:hidden flex justify-start items-center w-full gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted text-muted-foreground hover:text-foreground"
                >
                  <IconSquareToggle className="h-4 w-4" />
                  {expanded && <span>Toggle Sidebar</span>}
                </button>
              </TooltipTrigger>
              {!expanded && <TooltipContent side="right">Toggle Sidebar</TooltipContent>}
            </Tooltip>
          </TooltipProvider>
          {bottomNavItems.map((item) => (
            <TooltipProvider key={item.href} delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    prefetch={true}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between rounded-md px-3 py-2 text-sm",
                      item.href === pathname
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      {expanded && <span>{item.title}</span>}
                    </span>
                  </Link>
                </TooltipTrigger>
                {!expanded && <TooltipContent side="right">{item.title}</TooltipContent>}
              </Tooltip>
            </TooltipProvider>
          ))}
        </nav>
      </div>
    </motion.div>
  );
}
