"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import * as Tooltip from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import "@/styles/cynthiaMenuItemAnimation.css";
import { IconCirclePlus, IconDashboard, IconSquareToggle, IconTarget } from "@tabler/icons-react";
import { User } from "better-auth";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavUser } from "./NavUser";

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
    icon: IconCirclePlus,
  },
  // {
  //   title: "Cynthia",
  //   href: "/cynthia",
  //   icon: IconSparkles,
  // },
];

interface SidebarProps {
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  userData: User;
}

export function Sidebar(props: SidebarProps) {
  const pathname = usePathname();

  return (
    <motion.div
      className="relative flex flex-col border-r border-border h-full bg-background"
      animate={{ width: props.isSidebarOpen ? 240 : 64 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      {/* AMBITIOUSYOU LOGO */}
      <div className="flex items-center h-16 border-b border-border px-4">
        <Link prefetch={true} href="/dashboard" className="flex items-center gap-2">
          {/* <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center"> */}
          <Image src="/svg_logos/favicon_32px.svg" alt="AmbitiousYou Logo" width={32} height={32} />
          {/* </div> */}
          {props.isSidebarOpen && (
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
              <Tooltip.TooltipProvider key={item.href} delayDuration={100}>
                <Tooltip.Tooltip>
                  <Tooltip.TooltipTrigger asChild>
                    <Link
                      prefetch={true}
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between rounded-md px-4 py-2 text-sm transition-colors",
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
                        {props.isSidebarOpen && <span>{item.title}</span>}
                      </span>
                    </Link>
                  </Tooltip.TooltipTrigger>
                  {!props.isSidebarOpen && (
                    <Tooltip.TooltipContent side="right">{item.title}</Tooltip.TooltipContent>
                  )}
                </Tooltip.Tooltip>
              </Tooltip.TooltipProvider>
            ))}
          </nav>
        </div>
      </ScrollArea>

      {/* BOTTOM NAVIGATION */}
      <div className="border-t border-border mt-auto py-2 px-2">
        <nav className="space-y-1">
          <Tooltip.TooltipProvider delayDuration={100}>
            <Tooltip.Tooltip>
              <Tooltip.TooltipTrigger asChild>
                <button
                  onClick={() => props.setSidebarOpen(!props.isSidebarOpen)}
                  className="max-sm:hidden flex justify-start items-center w-full gap-3 rounded-md px-4 py-2 text-sm transition-colors hover:bg-muted text-muted-foreground hover:text-foreground"
                >
                  <IconSquareToggle className="size-4" />
                  {props.isSidebarOpen && <span>Toggle Sidebar</span>}
                </button>
              </Tooltip.TooltipTrigger>
              {!props.isSidebarOpen && (
                <Tooltip.TooltipContent side="right">Toggle Sidebar</Tooltip.TooltipContent>
              )}
            </Tooltip.Tooltip>
          </Tooltip.TooltipProvider>

          <NavUser user={props.userData} />
        </nav>
      </div>
    </motion.div>
  );
}
