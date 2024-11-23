"use client";
import { SidebarTrigger } from "@/components/shadcn/sidebar";
export function TopHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger />
      </div>
    </header>
  );
}