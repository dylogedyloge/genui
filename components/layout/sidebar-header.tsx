"use client";
import { Separator } from "@/components/shadcn/separator";
import { SidebarHeader as Header, SidebarMenu, SidebarMenuItem } from "@/components/shadcn/sidebar";
import LogoCard from "@/components/logo-card";
export function SidebarHeader() {
  return (
    <Header>
      <LogoCard />
      <Separator orientation="horizontal" />
      <SidebarMenu>
        <SidebarMenuItem></SidebarMenuItem>
      </SidebarMenu>
    </Header>
  );
}