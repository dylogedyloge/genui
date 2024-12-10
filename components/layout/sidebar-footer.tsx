"use client";
import { SidebarFooter as Footer, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/shadcn/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../shadcn/dropdown-menu";
import { Avatar, AvatarImage } from "../shadcn/avatar";
import Image from "next/image";
import { BadgeCheck, Bell, ChevronsUpDown, CreditCard, LogOut, Sparkles } from "lucide-react";
const data = {
  user: {
    name: "امیر نجفی",
    email: "dyloge@gmail.com",
    avatar: "/sample.jpg",
  },
};
export function SidebarFooter() {
  return (
    <Footer>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 ">
                  <AvatarImage
                    src={data.user.avatar}
                    alt={data.user.name}
                  />
                  <Image
                    src="/sample.jpg"
                    className=""
                    width={100}
                    height={100}
                    alt="avatar"
                  />
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {data.user.name}
                  </span>
                  <span className="truncate text-xs">
                    {data.user.email}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 "
              side="bottom"
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 ">
                    <AvatarImage
                      src={data.user.avatar}
                      alt={data.user.name}
                    />
                    <Image
                      src="/sample.jpg"
                      className=""
                      width={100}
                      height={100}
                      alt="avatar"
                    />
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {data.user.name}
                    </span>
                    <span className="truncate text-xs">
                      {data.user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Sparkles />
                  <p className="text-sm prose-sm">
                    ارتقاء حساب کاربری
                  </p>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <BadgeCheck />
                  <p className="text-sm prose-sm"> حساب کاربری</p>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard />
                  <p className="text-sm prose-sm ">پرداخت ها</p>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell />
                  <p className="text-sm prose-sm">پیام ها</p>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="prose text-destructive" />
                <p className="text-sm prose-sm">خروج</p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </Footer>
  );
}