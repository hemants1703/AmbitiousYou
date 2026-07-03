"use client";

import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { CirclePlusIcon } from "lucide-react";
import Link from "next/link";

interface NavMainProps {
  items: {
    title: string;
    url: string;
    icon?: React.ReactNode;
  }[];
}

export function NavMain(props: NavMainProps) {
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              asChild
              tooltip="Create New Ambition"
              className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground">
              <Link href="/ambitions/create" className="flex items-center gap-2" onClick={() => setOpenMobile(false)}>
                <CirclePlusIcon />
                <span>Create New Ambition</span>
              </Link>
            </SidebarMenuButton>
            {/* <Button size="icon" className="size-8 group-data-[collapsible=icon]:opacity-0" variant="outline">
              <SparklesIcon />
              <span className="sr-only">AI</span>
            </Button> */}
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {props.items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <Link href={item.url} onClick={() => setOpenMobile(false)}>
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
