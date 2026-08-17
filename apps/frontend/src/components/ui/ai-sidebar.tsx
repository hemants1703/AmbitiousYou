"use client";

import * as React from "react";
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { AI_SIDEBAR_STORAGE_KEY, persistSidebarOpen } from "@/lib/(app)/sidebar-state";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SparklesIcon } from "lucide-react";

// Mirror `sidebar.tsx` mobile width; desktop uses shared `--sidebar-width` from the shell.
const AI_SIDEBAR_WIDTH_MOBILE = "18rem";
const AI_SIDEBAR_KEYBOARD_SHORTCUT = "a";
const AI_SIDEBAR_TITLE = "AmbitiousYou AI assistant";

type AiSidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean | ((open: boolean) => boolean)) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const AiSidebarContext = createContext<AiSidebarContextProps | null>(null);

function useAiSidebar() {
  const context = useContext(AiSidebarContext);
  if (!context) {
    throw new Error("useAiSidebar must be used within an AiSidebarProvider.");
  }
  return context;
}

/** Soft read for chrome that may remount outside the provider during Soft Nav / HMR. */
function useAiSidebarOptional() {
  return useContext(AiSidebarContext);
}

interface AiSidebarProviderProps extends React.ComponentProps<"div"> {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

/**
 * Wraps app chrome + AI panel. Nest under `SidebarProvider` so
 * `AiSidebarNavCollapse` can collapse the app nav when AI opens.
 */
function AiSidebarProvider(props: AiSidebarProviderProps) {
  const { defaultOpen = false, open: openProp, onOpenChange: setOpenProp, children, className, style, ...rest } = props;
  const [openMobile, setOpenMobile] = useState(false);
  const isMobile = useIsMobile();

  const [_open, _setOpen] = useState(defaultOpen);
  const open = openProp ?? _open;

  const setOpen = useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }
      persistSidebarOpen(openState, AI_SIDEBAR_STORAGE_KEY);
    },
    [setOpenProp, open],
  );

  const toggleSidebar = useCallback(() => {
    return isMobile ? setOpenMobile((current) => !current) : setOpen((current) => !current);
  }, [isMobile, setOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === AI_SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  const state = open ? "expanded" : "collapsed";

  const contextValue = useMemo<AiSidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, toggleSidebar],
  );

  return (
    <AiSidebarContext.Provider value={contextValue}>
      <div
        data-slot="ai-sidebar-wrapper"
        data-ai-state={state}
        style={style}
        className={cn("group/ai-sidebar-wrapper flex min-h-svh w-full min-w-0 flex-1", className)}
        {...rest}>
        {children}
      </div>
    </AiSidebarContext.Provider>
  );
}

interface AiSidebarProps extends React.ComponentProps<"div"> {
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
}

function AiSidebar(props: AiSidebarProps) {
  const { side = "right", variant = "inset", collapsible = "offcanvas", className, children, ...rest } = props;
  const { isMobile, state, open, openMobile, setOpenMobile } = useAiSidebar();
  const [hasOpened, setHasOpened] = useState(false);
  const isVisible = isMobile ? openMobile : open;

  // Defer mounting heavy chat UI until first open so collapsed shell stays instant-safe.
  useEffect(() => {
    if (isVisible) {
      setHasOpened(true);
    }
  }, [isVisible]);

  const panel = hasOpened || isVisible ? children : null;

  if (collapsible === "none") {
    return (
      <div
        data-slot="ai-sidebar"
        className={cn("flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground", className)}
        {...rest}>
        {panel}
      </div>
    );
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent
          id="ai-sidebar"
          data-sidebar="ai-sidebar"
          data-slot="ai-sidebar"
          data-mobile="true"
          className="w-(--sidebar-width) bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
          style={
            {
              "--sidebar-width": AI_SIDEBAR_WIDTH_MOBILE,
            } as React.CSSProperties
          }
          side={side}>
          <SheetHeader className="sr-only">
            <SheetTitle>{AI_SIDEBAR_TITLE}</SheetTitle>
            <SheetDescription>Opens the AI assistant panel for planning, coaching, and quick actions.</SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full min-h-0 flex-col">{panel}</div>
        </SheetContent>
      </Sheet>
    );
  }

  // Match `Sidebar` inset/offcanvas chrome (gap + fixed container + inner panel).
  // Do not use `peer` — AppSidebar must remain the peer for SidebarInset.
  return (
    <div
      id="ai-sidebar"
      className="group/ai-sidebar hidden text-sidebar-foreground md:block"
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
      data-slot="ai-sidebar"
      aria-hidden={state === "collapsed"}
      inert={state === "collapsed" ? true : undefined}>
      <div
        data-slot="ai-sidebar-gap"
        className={cn(
          "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
          "group-data-[collapsible=offcanvas]/ai-sidebar:w-0",
          "group-data-[side=right]/ai-sidebar:rotate-180",
          variant === "floating" || variant === "inset"
            ? "group-data-[collapsible=icon]/ai-sidebar:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]"
            : "group-data-[collapsible=icon]/ai-sidebar:w-(--sidebar-width-icon)",
        )}
      />
      <div
        data-slot="ai-sidebar-container"
        data-side={side}
        className={cn(
          "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex",
          "data-[side=left]:left-0 data-[side=left]:group-data-[collapsible=offcanvas]/ai-sidebar:-left-(--sidebar-width)",
          "data-[side=right]:right-0 data-[side=right]:group-data-[collapsible=offcanvas]/ai-sidebar:-right-(--sidebar-width)",
          variant === "floating" || variant === "inset"
            ? "p-2 group-data-[collapsible=icon]/ai-sidebar:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]"
            : "group-data-[collapsible=icon]/ai-sidebar:w-(--sidebar-width-icon) group-data-[side=left]/ai-sidebar:border-r group-data-[side=right]/ai-sidebar:border-l",
          className,
        )}
        {...rest}>
        <div
          data-sidebar="ai-sidebar"
          data-slot="ai-sidebar-inner"
          aria-label={AI_SIDEBAR_TITLE}
          className={cn(
            "flex size-full min-h-0 flex-col bg-sidebar",
            "group-data-[variant=floating]/ai-sidebar:rounded-2xl group-data-[variant=floating]/ai-sidebar:shadow-sm group-data-[variant=floating]/ai-sidebar:ring-1 group-data-[variant=floating]/ai-sidebar:ring-sidebar-border",
          )}>
          {panel}
        </div>
      </div>
    </div>
  );
}

function AiSidebarTrigger({ className, onClick, ...props }: React.ComponentProps<typeof Button>) {
  const context = useAiSidebarOptional();
  if (!context) {
    return null;
  }
  const { open, openMobile, isMobile, toggleSidebar } = context;

  return (
    <Button
      data-ai-sidebar="trigger"
      data-slot="ai-sidebar-trigger"
      type="button"
      variant="ghost"
      size="icon-sm"
      className={cn(className)}
      aria-label={props["aria-label"] ?? (isMobile ? "Open AI assistant" : open ? "Close AI assistant" : "Open AI assistant")}
      aria-expanded={isMobile ? openMobile : open}
      aria-controls="ai-sidebar"
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}>
      <SparklesIcon />
      <span className="sr-only">Toggle AI assistant</span>
    </Button>
  );
}

function AiSidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="ai-sidebar-header"
      data-ai-sidebar="header"
      className={cn("flex shrink-0 flex-col gap-2 p-2 [--radius:var(--radius-xl)]", className)}
      {...props}
    />
  );
}

function AiSidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="ai-sidebar-content"
      data-ai-sidebar="content"
      className={cn("flex min-h-0 flex-1 flex-col gap-2 overflow-auto", className)}
      {...props}
    />
  );
}

function AiSidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="ai-sidebar-footer"
      data-ai-sidebar="footer"
      className={cn("flex shrink-0 flex-col gap-2 p-2", className)}
      {...props}
    />
  );
}

function AiSidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="ai-sidebar-group" data-ai-sidebar="group" className={cn("relative flex w-full min-w-0 flex-col p-2", className)} {...props} />;
}

function AiSidebarGroupLabel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="ai-sidebar-group-label"
      data-ai-sidebar="group-label"
      className={cn("flex h-8 shrink-0 items-center rounded-xl px-2 text-xs font-medium text-sidebar-foreground/70", className)}
      {...props}
    />
  );
}

function AiSidebarGroupContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="ai-sidebar-group-content" data-ai-sidebar="group-content" className={cn("w-full min-w-0 text-sm text-sidebar-foreground", className)} {...props} />;
}

export {
  AiSidebar,
  AiSidebarContent,
  AiSidebarFooter,
  AiSidebarGroup,
  AiSidebarGroupContent,
  AiSidebarGroupLabel,
  AiSidebarHeader,
  AiSidebarProvider,
  AiSidebarTrigger,
  useAiSidebar,
  useAiSidebarOptional,
};
