"use client";
import { UserButton } from "@clerk/nextjs";
import { SidebarFooter as Footer } from "@/components/shadcn/sidebar";

export function SidebarFooter() {
  return (
    <Footer>
      <UserButton />
    </Footer>
  );
}