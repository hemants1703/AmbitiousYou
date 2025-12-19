"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import * as DropdownMenu from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { logoutAction } from "@/features/(auth)/actions";
import { IconBell, IconLogout, IconSettings } from "@tabler/icons-react";
import { User } from "better-auth";
import { ChevronsUpDown } from "lucide-react";
import Link from "next/link";

export function NavUser({ user }: { user: User }) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu.DropdownMenu>
          <DropdownMenu.DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.image ?? ""} alt={user.name} />
                <AvatarFallback className="rounded-lg">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenu.DropdownMenuTrigger>
          <DropdownMenu.DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenu.DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.image ?? ""} alt={user.name} />
                  <AvatarFallback className="rounded-lg">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenu.DropdownMenuLabel>
            <DropdownMenu.DropdownMenuSeparator />
            <DropdownMenu.DropdownMenuGroup></DropdownMenu.DropdownMenuGroup>
            <DropdownMenu.DropdownMenuGroup>
              <DropdownMenu.DropdownMenuItem asChild>
                <Link prefetch={true} href="/settings?tab=notifications">
                  <IconBell />
                  Notifications
                </Link>
              </DropdownMenu.DropdownMenuItem>
              <DropdownMenu.DropdownMenuItem asChild>
                <Link prefetch={true} href="/settings?tab=profile">
                  <IconSettings />
                  Settings
                </Link>
              </DropdownMenu.DropdownMenuItem>
            </DropdownMenu.DropdownMenuGroup>
            <DropdownMenu.DropdownMenuSeparator />
            <DropdownMenu.DropdownMenuItem onClick={logoutAction}>
              <IconLogout />
              Log out
            </DropdownMenu.DropdownMenuItem>
          </DropdownMenu.DropdownMenuContent>
        </DropdownMenu.DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
