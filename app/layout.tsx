"use client";
// import type { Metadata } from "next";
import * as React from "react";
import localFont from "next/font/local";
// import Image from "next/image";
import { ThemeProvider } from "next-themes";
import { UserButton } from "@clerk/nextjs";
import "./globals.css";

import LogoCard from "@/components/logo-card";

import {
  // BadgeCheck,
  // Bell,
  ChevronLeft,
  // ChevronsUpDown,
  // CreditCard,
  // LogOut,
  Plus,
  // Sparkles,
} from "lucide-react";

import { Toaster } from "@/components/shadcn/toaster";
// import { Avatar, AvatarImage } from "@/components/shadcn/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/shadcn/collapsible";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/shadcn/dropdown-menu";
import { Separator } from "@/components/shadcn/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/shadcn/sidebar";
import { Button } from "@/components/shadcn/button";
import { ConvexClientProvider } from "@/components/providers/convex-clerk-provider";

const vazir = localFont({
  src: "./fonts/Vazir-Light-FD.ttf",
  display: "swap",
});
//  This is sample data.
// const data = {
//   user: {
//     name: "امیر نجفی",
//     email: "m@example.com",
//     avatar: "/avatars/shadcn.jpg",
//   },
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={vazir.className} dir="rtl">
      <body>
        <Toaster />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <ConvexClientProvider>
            <SidebarProvider>
              <Sidebar collapsible="icon" variant="inset" side="right">
                <SidebarHeader>
                  <LogoCard />
                  <Separator orientation="horizontal" />
                  <SidebarMenu>
                    <SidebarMenuItem></SidebarMenuItem>
                  </SidebarMenu>
                </SidebarHeader>
                <SidebarContent>
                  <Button className="flex justify-center gap-6 mx-4">
                    <Plus />
                    <div> گفتگوی جدید</div>
                  </Button>
                  <SidebarGroup>
                    <SidebarMenu>
                      <Collapsible asChild className="group/collapsible">
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton>
                              <span>تاریخچه گفتگو</span>
                              <ChevronLeft className="mr-auto transition-transform duration-200 group-data-[state=open]/collapsible:-rotate-90" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub></SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    </SidebarMenu>
                    <Separator orientation="horizontal" />
                    <SidebarMenu>
                      <Collapsible asChild className="group/collapsible">
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton>
                              <span> خریدها</span>
                              <ChevronLeft className="mr-auto transition-transform duration-200 group-data-[state=open]/collapsible:-rotate-90" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub></SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    </SidebarMenu>
                  </SidebarGroup>
                </SidebarContent>
                <Separator orientation="horizontal" />
                <SidebarFooter>
                  <UserButton />
                </SidebarFooter>
                <SidebarRail />
              </Sidebar>
              <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                  <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger />
                  </div>
                </header>
                {children}
              </SidebarInset>
            </SidebarProvider>
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
