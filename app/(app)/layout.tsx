import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Metadata } from "next";
import { SidebarController } from "@/components/dashboard/SidebarController";

export const metadata: Metadata = {
  title: {
    template: "%s | AmbitiousYou",
    default: "Dashboard",
  }
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SidebarController>
        <ScrollArea className="flex-1 overflow-auto">
          <main className="flex-1 p-6 md:p-8 pt-6 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </ScrollArea>
      </SidebarController>
    </div>
  );
}
