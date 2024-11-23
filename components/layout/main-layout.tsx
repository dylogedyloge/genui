"use client";
import { Sidebar, SidebarInset } from "@/components/shadcn/sidebar";
import { MainSidebar } from "./main-sidebar";
import { TopHeader } from "./top-header";
export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar collapsible="icon" variant="inset" side="right">
        <MainSidebar />
      </Sidebar>
      <SidebarInset>
        <TopHeader />
        {children}
      </SidebarInset>
    </>
  );
}