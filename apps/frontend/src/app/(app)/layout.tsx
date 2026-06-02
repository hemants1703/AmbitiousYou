import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { requireUser } from "@/lib/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | AmbitiousYou",
    default: "AmbitiousYou",
  },
};

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { user: userDetails } = await requireUser();

  return (
    <main>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }>
        <AppSidebar variant="inset" userDetails={userDetails} />
        <SidebarInset>
          <SiteHeader />
              <div className="flex flex-col gap-4 md:gap-6 px-6 md:px-8 py-4 md:py-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </main>
  );
}
