"use client";

import { Button } from "@/components/ui/button";
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { CirclePlusIcon, SparklesIcon } from "lucide-react";
import Link from "next/link";

interface NavMainProps {
  items: {
    title: string;
    url: string;
    icon?: React.ReactNode;
  }[];
}

export function NavMain(props: NavMainProps) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              asChild
              tooltip="Create New Ambition"
              className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground">
              <Link href="/ambitions/create" className="flex items-center gap-2">
                <CirclePlusIcon />
                <span>Create New Ambition</span>
              </Link>
            </SidebarMenuButton>
            <Button size="icon" className="size-8 group-data-[collapsible=icon]:opacity-0" variant="outline">
              <SparklesIcon />
              <span className="sr-only">AI</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {props.items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <Link href={item.url}>
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
