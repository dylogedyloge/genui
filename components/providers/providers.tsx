"use client";
import { ThemeProvider } from "next-themes";
// import { ConvexClientProvider } from "./convex-clerk-provider";
import { SidebarProvider } from "@/components/shadcn/sidebar";
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      disableTransitionOnChange
    >
      {/* <ConvexClientProvider> */}
      <SidebarProvider>{children}</SidebarProvider>
      {/* </ConvexClientProvider> */}
    </ThemeProvider>
  );
}
