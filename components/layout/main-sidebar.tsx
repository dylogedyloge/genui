"use client";
import { Separator } from "@/components/shadcn/separator";
import { SidebarRail } from "@/components/shadcn/sidebar";
import { SidebarHeader } from "./sidebar-header";
import { SidebarContent } from "./sidebar-content";
import { SidebarFooter } from "./sidebar-footer";
export function MainSidebar() {
  return (
    <>
      <SidebarHeader />
      <SidebarContent />
      <Separator orientation="horizontal" />
      <SidebarFooter />
      <SidebarRail />
    </>
  );
}