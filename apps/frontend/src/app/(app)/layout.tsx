import { HeaderInbox, HeaderInboxSkeleton } from "@/components/(app)/shell/header-inbox";
import { AuthenticatedNavUser, NavUserSkeleton } from "@/components/(app)/shell/authenticated-nav-user";
import { RegisterPushSw } from "@/components/(app)/notifications/register-push-sw";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { createPrivateMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";
import { Suspense } from "react";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  ...createPrivateMetadata("AmbitiousYou"),
  title: {
    template: "%s | AmbitiousYou",
    default: "AmbitiousYou",
  },
};

/**
 * Static chrome (nav links, frames) prerenders into the PPR shell. Auth, the
 * user chip, and the inbox stream behind Suspense so they do not block
 * `{children}`. Sidebar open state defaults to expanded on the server; the
 * client persists toggles via cookie/localStorage for the next interaction.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:border focus:border-border focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-md">
        Skip to content
      </a>
      <main>
        <SidebarProvider
          defaultOpen={true}
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }>
          <AppSidebar
            variant="inset"
            userSlot={
              <Suspense fallback={<NavUserSkeleton />}>
                <AuthenticatedNavUser />
              </Suspense>
            }
          />
          <SidebarInset className="min-w-0">
            <SiteHeader
              inboxSlot={
                <Suspense fallback={<HeaderInboxSkeleton />}>
                  <HeaderInbox />
                </Suspense>
              }
            />
            <div id="main-content" className="flex flex-col gap-4 overflow-x-clip px-6 py-4 md:gap-6 md:px-8 md:py-6">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
        <RegisterPushSw />
        <Toaster richColors theme="system" />
      </main>
    </TooltipProvider>
  );
}
