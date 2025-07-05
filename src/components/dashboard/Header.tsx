"use client";

import { Button } from "@/src/components/ui/button";
import * as Dropdown from "@/src/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import Link from "next/link";
import { ThemeToggler } from "@/src/components/ThemeToggler";
import { Menu } from "lucide-react";
import { toast } from "sonner";
import { logoutAction } from "@/src/app/(auth)/actions";
import { User } from "@supabase/supabase-js";
import { SupabaseProfileData } from "@/src/types";

interface HeaderProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
  userData: User;
  profileData: SupabaseProfileData[];
}

export function Header({ onMenuClick, isSidebarOpen, userData, profileData }: HeaderProps) {
  const { firstName, lastName } = profileData[0];
  const initialsOfUsersName = firstName.charAt(0) + lastName.charAt(0); // Placeholder for initials
  const { email } = userData;

  const handleUserLogout = async () => {
    const logoutUser = await logoutAction();

    if (!logoutUser.success) {
      toast.error("Failed to log out. Please try again.");
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between md:justify-end gap-4 border-b bg-background px-4 md:px-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        className="md:hidden"
        aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
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
                <AvatarFallback>{initialsOfUsersName}</AvatarFallback>
              </Avatar>
            </Button>
          </Dropdown.DropdownMenuTrigger>
          <Dropdown.DropdownMenuContent align="end" className="w-56">
            <Dropdown.DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{`${firstName} ${lastName}`}</p>
                <p className="text-xs leading-none text-muted-foreground">{email}</p>
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
              <button onClick={handleUserLogout}>Log Out</button>
            </Dropdown.DropdownMenuItem>
          </Dropdown.DropdownMenuContent>
        </Dropdown.DropdownMenu>
      </div>
    </header>
  );
}
