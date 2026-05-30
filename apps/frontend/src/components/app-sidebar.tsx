"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { CircleHelpIcon, LayoutDashboardIcon, Settings2Icon, TargetIcon } from "lucide-react";
import AmbitiousYouLogo from "./(landing)/ambitiousyou-logo";
import { User } from "@ambitiousyou/shared";

const data = {
  user: {
    name: "Hemant Sharma",
    email: "hemant@hemantsharma.tech",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
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
  ],
  navSecondary: [
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
  ],
};

export function AppSidebar({ userDetails, ...props }: React.ComponentProps<typeof Sidebar> & { userDetails: User }) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
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
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser userDetails={userDetails} />
      </SidebarFooter>
    </Sidebar>
  );
}
