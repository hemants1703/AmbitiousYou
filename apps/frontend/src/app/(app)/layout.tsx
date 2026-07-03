import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { parseSidebarOpen, SIDEBAR_STORAGE_KEY } from "@/lib/(app)/sidebar-state";
import { requireUser } from "@/lib/auth";
import { createPrivateMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  ...createPrivateMetadata("AmbitiousYou"),
  title: {
    template: "%s | AmbitiousYou",
    default: "AmbitiousYou",
  },
};

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { user: userDetails } = await requireUser();
  const cookieStore = await cookies();
  const defaultOpen = parseSidebarOpen(cookieStore.get(SIDEBAR_STORAGE_KEY)?.value);

  return (
    <TooltipProvider>
      <main>
        <SidebarProvider
          defaultOpen={defaultOpen}
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }>
        <AppSidebar variant="inset" userDetails={userDetails} />
        <SidebarInset className="min-w-0">
          <SiteHeader />
          <div className="flex flex-col gap-4 overflow-x-clip px-6 py-4 md:gap-6 md:px-8 md:py-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
      <Toaster richColors theme="system" />
    </main>
    </TooltipProvider>
  );
}
