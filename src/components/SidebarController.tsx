"use client";

import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { User } from "better-auth";
import React, { useState } from "react";

interface SidebarControllerProps {
  children: React.ReactNode;
  userData: User;
}

export function SidebarController(props: SidebarControllerProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SidebarProvider>
      {/* Sidebar for desktop */}
      <div
        className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} bg-black md:translate-x-0 fixed inset-y-0 left-0 z-50 md:relative md:z-0 transition-transform duration-300 ease-in-out`}
      >
        <Sidebar
          isSidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          userData={props.userData}
        />
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
          userData={props.userData}
        />
        {props.children}
      </div>
    </SidebarProvider>
  );
}
