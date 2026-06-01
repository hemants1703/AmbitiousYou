"use client";

import { LayoutDashboardIcon, TargetIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useSidebar } from "@/components/ui/sidebar";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/ambitions", label: "Ambitions", icon: TargetIcon },
];

export function HeaderNav() {
  const { state, isMobile } = useSidebar();
  const pathname = usePathname();

  const isCollapsed = !isMobile && state === "collapsed";

  return (
    <div
      className={[
        "absolute left-1/2 -translate-x-1/2 flex items-center gap-0.5 transition-opacity duration-200",
        isCollapsed ? "opacity-100" : "pointer-events-none opacity-0",
      ].join(" ")}
      aria-hidden={!isCollapsed}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href || pathname?.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            tabIndex={isCollapsed ? 0 : -1}
            className={[
              "relative flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
            ].join(" ")}
          >
            <Icon className="size-4" />
            {item.label}
            {isActive && (
              <span className="absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full bg-primary" />
            )}
          </Link>
        );
      })}
    </div>
  );
}
