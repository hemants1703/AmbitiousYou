import React from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Metadata } from "next";

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
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <ScrollArea className="flex-1 overflow-scroll">
          <main className="flex-1 p-6 md:p-8 pt-6 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </ScrollArea>
      </div>
    </div>
  );
}
