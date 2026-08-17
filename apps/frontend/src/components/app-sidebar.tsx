"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { CircleHelpIcon, LayoutDashboardIcon, Settings2Icon, TargetIcon, TrophyIcon } from "lucide-react";
import AmbitiousYouLogo from "./(landing)/ambitiousyou-logo";

interface NavItem {
  title: string;
  url: string;
  icon: React.ReactNode;
  proOnly?: boolean;
}

function getNavData(isPro: boolean) {
  const navMain: NavItem[] = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Ambitions",
      url: "/ambitions",
      icon: <TargetIcon />,
    },
  ];

  if (isPro) {
    navMain.push(
      { title: "Wins", url: "/wins", icon: <TrophyIcon /> },
    );
  }

  const navSecondary: NavItem[] = [
    {
      title: "Settings",
      url: "/settings",
      icon: <Settings2Icon />,
    },
    {
      title: "Get Help",
      url: "mailto:support@ambitiousyou.com",
      icon: <CircleHelpIcon />,
    },
  ];

  return { navMain, navSecondary };
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  isPro?: boolean;
  userSlot: React.ReactNode;
}

export function AppSidebar(props: AppSidebarProps) {
  const { isPro = false, userSlot, ...sidebarProps } = props;
  const { navMain, navSecondary } = getNavData(isPro);
  return (
    <Sidebar collapsible="offcanvas" {...sidebarProps}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <AmbitiousYouLogo />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>{userSlot}</SidebarFooter>
    </Sidebar>
  );
}
