"use client";

import * as React from "react";
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { persistSidebarOpen } from "@/lib/(app)/sidebar-state";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PanelRightIcon } from "lucide-react";

const AI_SIDEBAR_WIDTH = "16rem";
const AI_SIDEBAR_WIDTH_MOBILE = "18rem";
const AI_SIDEBAR_KEYBOARD_SHORTCUT = "a";

type AiSidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
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

interface AiSidebarProviderProps extends React.ComponentProps<"div"> {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function AiSidebarProvider(props: AiSidebarProviderProps) {
  const { defaultOpen = false, open: openProp, onOpenChange: setOpenProp, children, ...rest } = props;
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
      persistSidebarOpen(openState, "ai-sidebar");
    },
    [setOpenProp, open],
  );

  const toggleSidebar = useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
  }, [isMobile, setOpen, setOpenMobile]);

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
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar],
  );

  return (
    <AiSidebarContext.Provider value={contextValue}>
      <div
        data-slot="ai-sidebar-wrapper"
        style={
          {
            "--ai-sidebar-width": AI_SIDEBAR_WIDTH,
            "--ai-sidebar-width-icon": AI_SIDEBAR_WIDTH_MOBILE,
            ...rest.style,
          } as React.CSSProperties
        }
        className={cn("group/ai-sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar", rest.className)}
        {...rest}>
        {children}
      </div>
    </AiSidebarContext.Provider>
  );
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

interface AiSidebarProps extends React.ComponentProps<"div"> {
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
}

export function AiSidebar(props: AiSidebarProps) {
  const { side = "right", variant = "inset", collapsible = "offcanvas", className, children, ...rest } = props;
  const { isMobile, state, openMobile, setOpenMobile } = useAiSidebar();

  if (collapsible === "none") {
    return (
      <div data-slot="ai-sidebar" className={cn("flex h-full w-(--ai-sidebar-width) flex-col bg-sidebar text-sidebar-foreground", className)} {...rest}>
        {children}
      </div>
    );
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...rest}>
        <SheetContent
          data-sidebar="ai-sidebar"
          data-slot="ai-sidebar"
          data-mobile="true"
          className="w-(--ai-sidebar-width) bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
          style={
            {
              "--ai-sidebar-width": AI_SIDEBAR_WIDTH_MOBILE,
            } as React.CSSProperties
          }
          side={side}>
          <SheetHeader className="sr-only">
            <SheetTitle>AI Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile AI sidebar.</SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="group peer hidden text-sidebar-foreground md:block" data-state={state} data-collapsible={state === "collapsed" ? collapsible : ""} data-variant={variant} data-side={side} data-slot="ai-sidebar">
      <div
        data-slot="ai-sidebar-gap"
        className={cn(
          "relative w-(--ai-sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
          "group-data-[collapsible=offcanvas]:w-0",
          "group-data-[side=right]:rotate-180",
          variant === "floating" || variant === "inset" ? "group-data-[collapsible=icon]:w-[calc(var(--ai-sidebar-width-icon)+(--spacing(4)))]" : "group-data-[collapsible=icon]:w-(--ai-sidebar-width-icon)",
        )}
      />
      <div
        data-slot="ai-sidebar-container"
        data-side={side}
        className={cn(
          "fixed inset-y-0 z-10 hidden h-svh w-(--ai-sidebar-width) transition-[left,right,width] duration-200 ease-linear data-[side=left]:left-0 data-[side=left]:group-data-[collapsible=offcanvas]:-left-(--ai-sidebar-width) data-[side=right]:right-0 data-[side=right]:group-data-[collapsible=offcanvas]:-right-(--ai-sidebar-width) md:flex",
          variant === "floating" || variant === "inset"
            ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--ai-sidebar-width-icon)+(--spacing(4))+2px)]"
            : "group-data-[collapsible=icon]:w-(--ai-sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
          className,
        )}
        {...rest}>
        <div
          data-sidebar="ai-sidebar"
          data-slot="ai-sidebar-inner"
          className="flex size-full flex-col bg-sidebar group-data-[variant=floating]:rounded-2xl group-data-[variant=floating]:shadow-sm group-data-[variant=floating]:ring-1 group-data-[variant=floating]:ring-sidebar-border">
          {children}
        </div>
      </div>
    </div>
  );
}

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";

function AiSidebarTrigger({ className, onClick, ...props }: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useAiSidebar();

  return (
    <Button
      data-ai-sidebar="trigger"
      data-slot="ai-sidebar-trigger"
      variant="ghost"
      size="icon-sm"
      className={cn(className)}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}>
      <PanelRightIcon />
      <span className="sr-only">Toggle AI Sidebar</span>
    </Button>
  );
}

function AiSidebarRail({ className, ...props }: React.ComponentProps<"button">) {
  const { toggleSidebar } = useAiSidebar();

  return (
    <button
      data-ai-sidebar="rail"
      data-slot="ai-sidebar-rail"
      aria-label="Toggle AI Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle AI Sidebar"
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:inset-s-1/2 after:w-0.5 hover:after:bg-sidebar-border sm:flex ltr:-translate-x-1/2 rtl:-translate-x-1/2",
        "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full hover:group-data-[collapsible=offcanvas]:bg-sidebar",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className,
      )}
      {...props}
    />
  );
}

function AiSidebarInset({ className, ...props }: React.ComponentProps<"main">) {
  return (
    <main
      data-slot="ai-sidebar-inset"
      className={cn(
        "relative flex w-full flex-1 flex-col bg-background md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:mr-0 md:peer-data-[variant=inset]:rounded-2xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:mr-2",
        className,
      )}
      {...props}
    />
  );
}

function AiSidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="ai-sidebar-header" data-ai-sidebar="header" className={cn("flex flex-col gap-2 p-2 [--radius:var(--radius-xl)]", className)} {...props} />;
}

function AiSidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="ai-sidebar-footer" data-ai-sidebar="footer" className={cn("flex flex-col gap-2 p-2", className)} {...props} />;
}

function AiSidebarSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return <hr data-slot="ai-sidebar-separator" data-ai-sidebar="separator" className={cn("mx-2 w-auto bg-sidebar-border", className)} {...props} />;
}

function AiSidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="ai-sidebar-content" data-ai-sidebar="content" className={cn("no-scrollbar flex min-h-0 flex-1 flex-col gap-2 overflow-auto [--radius:var(--radius-xl)] group-data-[collapsible=icon]:overflow-hidden", className)} {...props} />;
}

function AiSidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="ai-sidebar-group" data-ai-sidebar="group" className={cn("relative flex w-full min-w-0 flex-col p-2", className)} {...props} />;
}

function AiSidebarGroupLabel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="ai-sidebar-group-label"
      data-ai-sidebar="group-label"
      className={cn(
        "flex h-8 shrink-0 items-center rounded-xl px-3 text-xs font-medium text-sidebar-foreground/70 ring-sidebar-ring outline-hidden transition-[margin,opacity] duration-200 ease-linear group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        className,
      )}
      {...props}
    />
  );
}

function AiSidebarGroupAction({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      data-slot="ai-sidebar-group-action"
      data-ai-sidebar="group-action"
      className={cn(
        "absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-xl p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform group-data-[collapsible=icon]:hidden after:absolute after:-inset-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 md:after:hidden [&>svg]:size-4 [&>svg]:shrink-0",
        className,
      )}
      {...props}
    />
  );
}

function AiSidebarGroupContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="ai-sidebar-group-content" data-ai-sidebar="group-content" className={cn("w-full text-sm", className)} {...props} />;
}

function AiSidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul data-slot="ai-sidebar-menu" data-ai-sidebar="menu" className={cn("flex w-full min-w-0 flex-col gap-0.5", className)} {...props} />;
}

function AiSidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li data-slot="ai-sidebar-menu-item" data-ai-sidebar="menu-item" className={cn("group/menu-item relative", className)} {...props} />;
}

export {
  AiSidebar,
  AiSidebarContent,
  AiSidebarFooter,
  AiSidebarGroup,
  AiSidebarGroupAction,
  AiSidebarGroupContent,
  AiSidebarGroupLabel,
  AiSidebarHeader,
  AiSidebarInset,
  AiSidebarMenu,
  AiSidebarMenuItem,
  AiSidebarProvider,
  AiSidebarRail,
  AiSidebarSeparator,
  AiSidebarTrigger,
  useAiSidebar,
};