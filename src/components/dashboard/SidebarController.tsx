"use client";

import React, { useState } from "react";
import { Sidebar } from "@/src/components/dashboard/Sidebar";
import { Header } from "@/src/components/dashboard/Header";
import type { Profile, User } from "@/types/globals";

interface SidebarControllerProps {
  children: React.ReactNode;
  userData: User;
  profileData: Profile[];
}

export function SidebarController({ children, userData, profileData }: SidebarControllerProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Sidebar for desktop */}
      <div
        className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} bg-black md:translate-x-0 fixed inset-y-0 left-0 z-50 md:relative md:z-0 transition-transform duration-300 ease-in-out`}
      >
        <Sidebar />
      </div>

      {/* Overlay to close sidebar when clicked outside */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 backdrop-blur-xs bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex flex-col flex-1">
        <Header
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          isSidebarOpen={sidebarOpen}
          userData={userData}
          profileData={profileData}
        />
        {children}
      </div>
    </>
  );
}
