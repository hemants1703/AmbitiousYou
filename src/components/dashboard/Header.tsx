"use client";

import { ThemeToggler } from "@/components/ThemeToggler";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import * as Dropdown from "@/components/ui/dropdown-menu";
import { logoutAction } from "@/features/(auth)/actions";
import { User } from "better-auth";
import { Menu } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
  userData: User;
}

export function Header(props: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between md:justify-end gap-4 border-b bg-background px-4 md:px-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={props.onMenuClick}
        className="md:hidden"
        aria-label={props.isSidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex items-center gap-2">
        <ThemeToggler />
        <Dropdown.DropdownMenu>
          <Dropdown.DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 ml-1">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatar.jpg" alt="User" />
                <AvatarFallback>{props.userData.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </Button>
          </Dropdown.DropdownMenuTrigger>
          <Dropdown.DropdownMenuContent align="end" className="w-56">
            <Dropdown.DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{`${props.userData.name}`}</p>
                <p className="text-xs leading-none text-muted-foreground">{props.userData.email}</p>
                {/* {planName && <Badge className="mt-1 w-fit">{planName} Plan</Badge>} */}
              </div>
            </Dropdown.DropdownMenuLabel>
            <Dropdown.DropdownMenuSeparator />
            <Dropdown.DropdownMenuItem>
              <Link prefetch={true} href="/settings" className="w-full">
                Settings
              </Link>
            </Dropdown.DropdownMenuItem>
            <Dropdown.DropdownMenuSeparator />
            <Dropdown.DropdownMenuItem>
              <button onClick={logoutAction}>Log Out</button>
            </Dropdown.DropdownMenuItem>
          </Dropdown.DropdownMenuContent>
        </Dropdown.DropdownMenu>
      </div>
    </header>
  );
}
