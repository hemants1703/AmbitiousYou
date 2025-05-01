import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Metadata } from "next";
import { SidebarController } from "@/components/dashboard/SidebarController";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: {
    template: "%s | AmbitiousYou",
    default: "Dashboard",
  },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const userLoggedIn = await supabase.auth.getUser();

  // Check if the user is logged in
  if (userLoggedIn.error) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SidebarController>
        <ScrollArea className="flex-1 overflow-auto">
          <main className="flex-1 p-6 md:p-8 pt-6 max-w-7xl mx-auto w-full">{children}</main>
        </ScrollArea>
      </SidebarController>
    </div>
  );
}
