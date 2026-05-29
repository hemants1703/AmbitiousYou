import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getUser } from "@/lib/api/sidebar/get-user";
import { Metadata } from "next";
import { redirect, RedirectType } from "next/navigation";

export const metadata: Metadata = {
  title: {
    template: "%s | AmbitiousYou",
    default: "AmbitiousYou",
  },
};

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const userDetails = await getUser();

  if (!userDetails) {
    return redirect("/login", RedirectType.replace);
  }

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
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">{children}</div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </main>
  );
}
