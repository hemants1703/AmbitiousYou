import { AuthenticatedNavUser, NavUserSkeleton } from "@/components/(app)/shell/authenticated-nav-user";
import { RegisterPushSw } from "@/components/(app)/notifications/register-push-sw";
import { WeeklyReviewModalWrapper } from "@/components/(app)/shell/weekly-review-modal-wrapper";
import { SiteHeaderWithPro } from "@/components/(app)/shell/site-header-with-pro";
import { AppSidebar, type AppSidebarProps } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, type SidebarInsetProps, type SidebarProviderProps } from "@/components/ui/sidebar";
import { AiSidebarProvider, type AiSidebarProviderProps } from "@/components/ui/ai-sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { createPrivateMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import type { ToasterProps } from "sonner";
import { AiSidebarNavCollapse } from "@/components/(app)/shell/ai-sidebar-nav-collapse";
import { AiSidebarWrapper } from "@/components/(app)/shell/ai-sidebar-wrapper";

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
 *
 * Provider order: SidebarProvider → AiSidebarProvider so AI open can collapse
 * the app nav, and AppSidebar remains the `peer` for SidebarInset inset styles.
 */
export default async function AppLayout({ children }: { children: ReactNode }) {
  const sidebarProviderProps: SidebarProviderProps = {
    defaultOpen: true,
    style: {
      "--sidebar-width": "calc(var(--spacing) * 72)",
      "--header-height": "calc(var(--spacing) * 12)",
    } as CSSProperties,
  };
  const aiSidebarProviderProps: Pick<AiSidebarProviderProps, "defaultOpen"> = {
    defaultOpen: false,
  };
  const appSidebarProps: AppSidebarProps = {
    variant: "inset",
    userSlot: (
      <Suspense fallback={<NavUserSkeleton />}>
        <AuthenticatedNavUser />
      </Suspense>
    ),
  };
  const sidebarInsetProps: SidebarInsetProps = {
    className: "min-w-0 md:group-data-[ai-state=expanded]/ai-sidebar-wrapper:mr-0!",
  };
  const toasterProps: ToasterProps = {
    richColors: true,
    theme: "system",
  };

  return (
    <TooltipProvider>
      <main>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:border focus:border-border focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-md">
          Skip to content
        </a>
        <SidebarProvider {...sidebarProviderProps}>
          <AiSidebarProvider {...aiSidebarProviderProps}>
            <AppSidebar {...appSidebarProps} />
            <SidebarInset {...sidebarInsetProps}>
              <SiteHeaderWithPro />
              <div id="main-content" className="flex flex-col gap-4 overflow-x-clip px-6 py-4 md:gap-6 md:px-8 md:py-6">
                {children}
              </div>
            </SidebarInset>
            <Suspense fallback={null}>
              <AiSidebarWrapper />
            </Suspense>
            <AiSidebarNavCollapse />
          </AiSidebarProvider>
        </SidebarProvider>
        <RegisterPushSw />
        <Toaster {...toasterProps} />
        <WeeklyReviewModalWrapper />
      </main>
    </TooltipProvider>
  );
}
