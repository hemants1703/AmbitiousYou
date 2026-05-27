import { cn } from "@/lib/utils";
import Image from "next/image";
import { LayoutDashboardIcon, MoonIcon, PlusIcon, SettingsIcon, TargetIcon, ToggleLeftIcon } from "lucide-react";

// Promotional mock data that showcases the app's capabilities
const mockAmbitions = [
  {
    id: "1",
    name: "Learn Machine Learning",
    color: "#00bfff",
    completed: 8,
    total: 12,
    priority: "high",
    trackingMethod: "milestone",
  },
  {
    id: "2",
    name: "Run a Marathon",
    color: "#32cd32",
    completed: 15,
    total: 20,
    priority: "medium",
    trackingMethod: "task",
  },
  {
    id: "3",
    name: "Launch Side Project",
    color: "#ff7733",
    completed: 5,
    total: 8,
    priority: "high",
    trackingMethod: "milestone",
  },
];

const sidebarNavItems = [
  { title: "Dashboard", icon: LayoutDashboardIcon, active: true },
  { title: "All Ambitions", icon: TargetIcon, active: false },
  { title: "Create Ambition", icon: PlusIcon, active: false },
];

const sidebarBottomItems = [
  { title: "Toggle Sidebar", icon: ToggleLeftIcon },
  { title: "Settings", icon: SettingsIcon },
];

export default function DashboardMockup() {
  return (
    <div className="bg-card/90 backdrop-blur-sm rounded-lg shadow-2xl border border-primary/10 overflow-hidden">
      {/* Browser-like mockup header */}
      <div className="bg-muted/60 border-b border-border flex items-center p-3">
        <div className="flex gap-1.5 mr-4">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 bg-background/70 rounded-full h-6 px-3 text-xs flex items-center justify-center text-muted-foreground">ambitiousyou.pro/dashboard</div>
      </div>

      {/* App interface */}
      <div className="w-full h-130 bg-background flex">
        {/* Sidebar - exactly like real app */}
        <div className="w-56 border-r border-border hidden md:flex flex-col bg-background">
          {/* Logo */}
          <div className="flex items-center h-14 border-b border-border px-4">
            <div className="flex items-center gap-2">
              <Image src="/svg_logos/favicon_32px.svg" alt="AmbitiousYou" width={28} height={28} className="size-7!" style={{ width: "auto", height: "auto" }} />
              <span className="text-lg">
                <span className="font-normal">Ambitious</span>
                <span className="font-bold">You</span>
              </span>
            </div>
          </div>

          {/* Main Nav */}
          <div className="flex-1 py-4 px-2">
            <nav className="space-y-1">
              {sidebarNavItems.map((item) => (
                <div key={item.title} className={cn("flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors", item.active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")}>
                  <item.icon className="size-4" />
                  <span>{item.title}</span>
                </div>
              ))}
            </nav>
          </div>

          {/* Bottom Nav */}
          <div className="border-t border-border py-2 px-2">
            <nav className="space-y-1">
              {sidebarBottomItems.map((item) => (
                <div key={item.title} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors">
                  <item.icon className="size-4" />
                  <span>{item.title}</span>
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Header - exactly like real app */}
          <div className="h-14 border-b border-border flex items-center justify-end px-4 gap-2">
            <div className="p-2 rounded-md hover:bg-muted transition-colors">
              <MoonIcon className="size-4 text-muted-foreground" />
            </div>
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">AY</div>
          </div>

          {/* Dashboard Content */}
          <div className="flex-1 p-5 overflow-hidden">
            {/* Welcome Banner */}
            <div className="mb-5">
              <h2 className="text-xl font-bold">Good morning! 👋</h2>
              <p className="text-sm text-muted-foreground">Ready to crush your goals today?</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
              {/* Active Ambitions */}
              <div className="rounded-xl border bg-card/80 p-4 flex flex-col items-center">
                <span className="text-xs text-muted-foreground mb-1">Active Ambitions</span>
                <span className="text-2xl font-bold">3</span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full mt-1">1 near completion</span>
              </div>

              {/* Completed Tasks */}
              <div className="rounded-xl border bg-card/80 p-4 flex flex-col items-center">
                <span className="text-xs text-muted-foreground mb-1">Tasks & Milestones</span>
                <span className="text-2xl font-bold">28/40</span>
                <div className="w-full h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "70%" }} />
                </div>
              </div>

              {/* Productivity Score */}
              <div className="rounded-xl border bg-card/80 p-4 flex flex-col items-center">
                <span className="text-xs text-muted-foreground mb-1">Productivity</span>
                <span className="text-2xl font-bold">70%</span>
                <div className="flex gap-0.5 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={cn("text-sm", star <= 4 ? "text-yellow-400" : "text-muted-foreground/30")}>
                      ★
                    </span>
                  ))}
                </div>
              </div>

              {/* Quote */}
              <div className="rounded-xl border bg-card/80 p-4 flex flex-col items-center justify-center">
                <span className="text-xs text-muted-foreground mb-1">Daily Wisdom</span>
                <p className="text-xs italic text-center line-clamp-2">&quot;The only way to do great work is to love what you do.&quot;</p>
                <span className="text-xs text-muted-foreground mt-1">— Steve Jobs</span>
              </div>

              {/* Ambitions List */}
              <h3 className="text-sm font-bold mb-3">Your Active Ambitions</h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                {mockAmbitions.map((ambition) => (
                  <div key={ambition.id} className="relative">
                    <div
                      className="rounded-xl border p-4 bg-card/80 cursor-pointer transition-all hover:shadow-md"
                      style={
                        {
                          "--ambition-color": ambition.color,
                        } as React.CSSProperties
                      }>
                      {/* Gradient overlay */}
                      <div
                        className="absolute inset-0 rounded-xl opacity-10 pointer-events-none"
                        style={{
                          background: `linear-gradient(to bottom, transparent 60%, ${ambition.color})`,
                        }}
                      />
                      <div className="relative">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="size-2.5 rounded-full" style={{ backgroundColor: ambition.color }} />
                            <span className="font-medium text-sm line-clamp-1">{ambition.name}</span>
                          </div>
                          <span className={cn("text-xs font-mono px-1.5 py-0.5 rounded border uppercase", ambition.priority === "high" ? "border-red-500 text-red-500" : "border-yellow-500 text-yellow-500")}>{ambition.priority}</span>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>
                            {ambition.completed}/{ambition.total} {ambition.trackingMethod === "task" ? "tasks" : "milestones"}
                          </span>
                          <span>{Math.round((ambition.completed / ambition.total) * 100)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
