"use client";
// import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { supabase } from "@/utils/supabase-client";
import Auth from "@/components/auth";
import { Toaster } from "@/components/ui/toaster"

const vazir = localFont({
  src: "./fonts/Vazir-Light-FD.ttf",
  display: "swap",
});

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en" className={vazir.className} dir="rtl">
//       <body>
//         <ThemeProvider
//           attribute="class"
//           defaultTheme="light"
//           disableTransitionOnChange
//         >
//           {children}
//         </ThemeProvider>
//       </body>
//     </html>
//   );
// }
// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Plane,
//   Building,
//   Map,
//   Compass,
//   Send,
//   Settings,
//   LogOut,
//   Moon,
//   Sun,
//   User,
//   ArrowRight,
//   Menu,
// } from "lucide-react";
// import { useTheme } from "next-themes";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { Separator } from "@/components/ui/separator";

// type AssistantType = "پرواز" | "هتل" | "برنامه سفر" | "تور" | null;

// type Message = {
//   text: string;
//   isUser: boolean;
//   timestamp: Date;
// };

// export default function Component() {
//   const [activeAssistant, setActiveAssistant] = useState<AssistantType>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [inputMessage, setInputMessage] = useState("");
//   const { setTheme, theme } = useTheme();

//   const handleAssistantChange = (type: AssistantType) => {
//     setActiveAssistant(type);
//     setMessages([
//       {
//         text: `سلام من دستیار${type} شما هستم. چطور می تونم کمکتون کنم؟`,
//         isUser: false,
//         timestamp: new Date(),
//       },
//     ]);
//   };

//   const handleSendMessage = () => {
//     if (inputMessage.trim()) {
//       setMessages([
//         ...messages,
//         { text: inputMessage, isUser: true, timestamp: new Date() },
//       ]);
//       setInputMessage("");
//       // Here you would typically call an API to get the bot's response
//       setTimeout(() => {
//         setMessages((prev) => [
//           ...prev,
//           {
//             text: "بزودی کارشناسان ما با شما تماس می گیرند",
//             isUser: false,
//             timestamp: new Date(),
//           },
//         ]);
//       }, 1000);
//     }
//   };

//   return (
//     <div className="flex h-screen  text-foreground">
//       <Sheet>
//         <SheetTrigger asChild>
//           <Button
//             variant="outline"
//             size="icon"
//             className="fixed top-4 right-4 z-50 "
//           >
//             <Menu className="h-4 w-4" />
//           </Button>
//         </SheetTrigger>
//         <SheetContent side="right" className="w-[300px] sm:w-[400px]">
//           <div className="flex flex-col h-full">
//             <div className="space-y-4 py-4">
//               <div className="px-3 py-2">
//                 <h4 className="mb-2 px-4 text-md font-semibold tracking-tight">
//                   حساب کاربری
//                 </h4>
//                 <div className="space-y-1">
//                   <Button variant="ghost" className="w-full justify-start">
//                     <User className="mr-2 h-4 w-4" />
//                     امیر نجفی
//                   </Button>
//                   <Button variant="ghost" className="w-full justify-start">
//                     <Settings className="mr-2 h-4 w-4" />
//                     تنظیمات
//                   </Button>
//                 </div>
//               </div>
//               <Separator />
//               <div className="px-3 py-2">
//                 <h4 className="mb-2 px-4 text-md font-semibold tracking-tight">
//                   تاریخچه گفتگو
//                 </h4>
//                 <div className="space-y-1">
//                   {[" پرواز", " هتل", "برنامه سفر", "تور"].map(
//                     (chat, index) => (
//                       <Button
//                         key={index}
//                         variant="ghost"
//                         className="w-full justify-start"
//                       >
//                         {chat}
//                       </Button>
//                     )
//                   )}
//                 </div>
//               </div>
//               <Separator />
//               <div className="px-3 py-2">
//                 <div className="flex justify-between items-center space-x-2">
//                   <h4 className="mb-2 px-4 text-md font-semibold tracking-tight">
//                     تم
//                   </h4>
//                   <Button
//                     onClick={() =>
//                       setTheme(theme === "dark" ? "light" : "dark")
//                     }
//                     variant="outline"
//                   >
//                     <label htmlFor="theme-mode">
//                       {theme === "dark" ? (
//                         <Moon className="h-4 w-4" />
//                       ) : (
//                         <Sun className="h-4 w-4" />
//                       )}
//                     </label>
//                   </Button>
//                 </div>
//               </div>
//             </div>
//             <div className="mt-auto p-4">
//               <Button className="w-full" variant="secondary">
//                 <LogOut className="mr-2 h-4 w-4" />
//                 خروج
//               </Button>
//             </div>
//           </div>
//         </SheetContent>
//       </Sheet>
//       <div className="flex-1 flex flex-col">
//         <main className="flex-grow overflow-auto p-4">
//           {activeAssistant ? (
//             <div className="flex flex-col h-full">
//               <Button
//                 variant="ghost"
//                 className="self-start mb-4"
//                 onClick={() => handleAssistantChange(null)}
//               >
//                 <ArrowRight className="w-4 h-4 mr-6" />
//                 برگشت
//               </Button>
//               <div className="flex-grow overflow-auto space-y-4 mb-4">
//                 {messages.map((message, index) => (
//                   <div
//                     key={index}
//                     className={`flex ${
//                       message.isUser ? "justify-end" : "justify-start"
//                     }`}
//                   >
//                     <div
//                       className={`max-w-[70%] p-3 rounded-lg ${
//                         message.isUser
//                           ? "bg-primary text-primary-foreground"
//                           : "bg-secondary text-secondary-foreground"
//                       }`}
//                     >
//                       <p className="text-sm">{message.text}</p>
//                       <p className="text-xs mt-1 opacity-50">
//                         {message.timestamp.toLocaleTimeString()}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ) : (
//             <div className="space-y-4"></div>
//           )}
//         </main>
//         {activeAssistant && (
//           <div className="p-4 border-t border-border">
//             <div className="flex items-center gap-2">
//               <Input
//                 type="text"
//                 value={inputMessage}
//                 onChange={(e) => setInputMessage(e.target.value)}
//                 placeholder="پیام خود را بنویسید..."
//                 className="flex-grow"
//                 onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
//               />
//               <Button size="icon" onClick={handleSendMessage}>
//                 <Send className="w-4 h-4" />
//                 <span className="sr-only">ارسال</span>
//               </Button>
//             </div>
//           </div>
//         )}
//         <footer className="p-4 flex justify-around border-t border-border">
//           <Button
//             variant="ghost"
//             className="flex flex-col items-center"
//             onClick={() => handleAssistantChange("پرواز")}
//           >
//             <Plane className="w-6 h-6 mb-1" />
//           </Button>
//           <Button
//             variant="ghost"
//             className="flex flex-col items-center"
//             onClick={() => handleAssistantChange("هتل")}
//           >
//             <Building className="w-6 h-6 mb-1" />
//           </Button>
//           <Button
//             variant="ghost"
//             className="flex flex-col items-center"
//             onClick={() => handleAssistantChange("برنامه سفر")}
//           >
//             <Map className="w-6 h-6 mb-1" />
//           </Button>
//           <Button
//             variant="ghost"
//             className="flex flex-col items-center"
//             onClick={() => handleAssistantChange("تور")}
//           >
//             <Compass className="w-6 h-6 mb-1" />
//           </Button>
//         </footer>
//       </div>
//     </div>
//   );
// }

import * as React from "react";
import {
  BadgeCheck,
  Bell,
  Bus,
  ChevronLeft,
  ChevronsUpDown,
  CreditCard,
  House,
  LogOut,
  NotebookPen,
  Plane,
  Sparkles,
  Utensils,
  UtensilsCrossed,
} from "lucide-react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import LogoCard from "@/components/logo-card";
// import Chat from "@/components/chat";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

//  This is sample data.
const data = {
  user: {
    name: "امیر نجفی",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "پرواز",
      url: "#",
      icon: Plane,
      isActive: true,
      items: [
        {
          title: "پرواز از استانبول به دبی دارید؟",
          url: "#",
        },
        {
          title: "پرواز آنکارا به مشهد کیه؟",
          url: "#",
        },
        {
          title: "چطور می‌تونم از لندن به تهران پرواز بگیرم؟",
          url: "#",
        },
      ],
    },
    {
      title: "هتل",
      url: "#",
      icon: House,
      items: [
        {
          title: "هتل هیلتون لندن اتاق داره؟",
          url: "#",
        },
        {
          title: "مسافرخانه کریمی تو تهران مناسبه؟",
          url: "#",
        },
        {
          title: "هتل درویشی مشهد رو رزرو کنید.",
          url: "#",
        },
      ],
    },
    {
      title: "برنامه سفر",
      url: "#",
      icon: NotebookPen,
      items: [
        {
          title: "می‌تونم معرفی برنامه رو ببینم؟",
          url: "#",
        },
        {
          title: "از کجا شروع کنم برای سفرم؟",
          url: "#",
        },
        {
          title: "آموزش‌های جدیدی دارین؟",
          url: "#",
        },
        {
          title: "تغییرات برنامه‌ها رو چک کنم؟",
          url: "#",
        },
      ],
    },
    {
      title: "تور",
      url: "#",
      icon: Bus,
      items: [
        {
          title: "اطلاعات عمومی تورها چیه؟",
          url: "#",
        },
        {
          title: "چطور با تیم تور آشنا بشم؟",
          url: "#",
        },
        {
          title: "هزینه‌های تور رو چطوری بفهمم؟",
          url: "#",
        },
        {
          title: "محدودیت‌های شرکت در تور چیه؟",
          url: "#",
        },
      ],
    },
    {
      title: "غذا",
      url: "#",
      icon: UtensilsCrossed,
      items: [
        {
          title: "می‌تونم اطلاعات کلی رو ببینم؟",
          url: "#",
        },
        {
          title: "تیم غذایی شما چه تخصصی داره؟",
          url: "#",
        },
        {
          title: "صورت‌حساب غذاها چطوری محاسبه میشه؟",
          url: "#",
        },
        {
          title: "محدودیت‌های غذایی دارین؟",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "بلیط هواپیما",
      url: "/orders/flight-orders",
      icon: Plane,
    },
    {
      name: "رزرو هتل",
      url: "/orders/hotel-orders",
      icon: House,
    },
    {
      name: "غذا",
      url: "/orders/restaurant-orders",
      icon: Utensils,
    },
    {
      name: "تور",
      url: "/orders/tour-orders",
      icon: Bus,
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [session, setSession] = React.useState(null);
  const router = useRouter();

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      setSession(null);
      router.push("/"); // Redirect to home page after logout
    }
  };

  return (
    <html lang="en" className={vazir.className} dir="rtl">
      <body>
      <Toaster />
        {/* {!session ? (
          <Auth />
        ) : ( */}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <SidebarProvider>
            <Sidebar collapsible="offcanvas" variant="inset" side="right">
              <SidebarHeader>
                <LogoCard />
                <Separator orientation="horizontal" />
                <SidebarMenu>
                  <SidebarMenuItem></SidebarMenuItem>
                </SidebarMenu>
              </SidebarHeader>
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>تاریخچه گفتگو</SidebarGroupLabel>
                  <SidebarMenu>
                    {data.navMain.map((item) => (
                      <Collapsible
                        key={item.title}
                        asChild
                        defaultOpen={item.isActive}
                        className="group/collapsible"
                      >
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton tooltip={item.title}>
                              {item.icon && <item.icon className="prose" />}
                              <span>{item.title}</span>
                              <ChevronLeft className="mr-auto transition-transform duration-200 group-data-[state=open]/collapsible:-rotate-90" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.items?.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton asChild>
                                    <a
                                      href={subItem.url}
                                      className="flex justify-between"
                                    >
                                      <span className="text-xs text-muted-foreground">
                                        {subItem.title}
                                      </span>
                                    </a>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    ))}
                  </SidebarMenu>
                </SidebarGroup>
                <Separator orientation="horizontal" />
                <SidebarGroup className="group-data-[collapsible=icon]:hidden">
                  <SidebarGroupLabel>خریدها</SidebarGroupLabel>
                  <SidebarMenu>
                    {data.projects.map((item) => (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild>
                          <Link href={item.url}>
                            <item.icon className="prose" />
                            <span>{item.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroup>
              </SidebarContent>
              <Separator orientation="horizontal" />
              <SidebarFooter>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                          size="lg"
                          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                          <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage
                              src={data.user.avatar}
                              alt={data.user.name}
                            />

                            <Image
                              src="/sample.jpg"
                              className="rounded-lg"
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
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side="bottom"
                        align="end"
                        sideOffset={4}
                      >
                        <DropdownMenuLabel className="p-0 font-normal">
                          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                            <Avatar className="h-8 w-8 rounded-lg">
                              <AvatarImage
                                src={data.user.avatar}
                                alt={data.user.name}
                              />
                              <Image
                                src="/sample.jpg"
                                className="rounded-lg"
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
                            <Sparkles className="prose" />
                            <p className="text-sm prose-sm">
                              ارتقاء حساب کاربری
                            </p>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem>
                            <BadgeCheck className="prose" />
                            <p className="text-sm prose-sm"> حساب کاربری</p>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CreditCard className="prose" />
                            <p className="text-sm prose-sm ">پرداخت ها</p>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Bell className="prose" />
                            <p className="text-sm prose-sm">پیام ها</p>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleSignOut}>
                          <LogOut className="prose text-destructive" />
                          <p className="text-sm prose-sm">خروج</p>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuItem>
                </SidebarMenu>
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
        </ThemeProvider>
        {/* )} */}
      </body>
    </html>
  );
}
