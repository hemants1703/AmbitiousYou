"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";

import { SETTINGS_TAB_ITEMS } from "./settings-tab-items";
import { hrefForSettingsTab, type SettingsTabValue } from "./settings-shared";

export type { SettingsTabValue };

interface SettingsTabsProps {
  initialTab: SettingsTabValue;
  children: ReactNode;
}

export function SettingsTabs(props: SettingsTabsProps) {
  const router = useRouter();

  function handleTabClick(event: MouseEvent<HTMLAnchorElement>, tab: SettingsTabValue) {
    // Keep real <Link> hrefs for middle-click / modifier open-in-new-tab.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }
    event.preventDefault();
    if (tab !== props.initialTab) {
      router.push(hrefForSettingsTab(tab), { scroll: false });
    }
  }

  return (
    <div className="flex w-full flex-col gap-6 lg:flex-row lg:gap-8">
      <nav aria-label="Settings sections" className="lg:w-52 lg:shrink-0">
        <div
          className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-x-visible lg:pb-0"
          role="tablist"
        >
          {SETTINGS_TAB_ITEMS.map((tab) => {
            const isActive = props.initialTab === tab.value;
            return (
              <Link
                key={tab.value}
                href={hrefForSettingsTab(tab.value)}
                role="tab"
                aria-selected={isActive}
                aria-current={isActive ? "page" : undefined}
                scroll={false}
                onClick={(event) => handleTabClick(event, tab.value)}
                className={[
                  "group flex min-w-fit items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:w-full",
                  isActive
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                ].join(" ")}
              >
                <tab.icon className="size-4 shrink-0" />
                <div className="hidden lg:block">
                  <p className="leading-tight">{tab.label}</p>
                  <p
                    className={[
                      "text-xs leading-tight",
                      isActive
                        ? "text-muted-foreground"
                        : "text-muted-foreground/60 group-hover:text-muted-foreground/80",
                    ].join(" ")}
                  >
                    {tab.description}
                  </p>
                </div>
                <span className="lg:hidden">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="min-w-0 flex-1">{props.children}</div>
    </div>
  );
}
