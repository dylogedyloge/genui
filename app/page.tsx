// // // "use client";

// // // import { useState } from "react";
// // // import { Button } from "@/components/ui/button";
// // // import { Input } from "@/components/ui/input";
// // // import {
// // //   Plane,
// // //   Building,
// // //   Map,
// // //   Compass,
// // //   Send,
// // //   Settings,
// // //   LogOut,
// // //   Moon,
// // //   Sun,
// // //   User,
// // //   ArrowRight,
// // //   Menu,
// // // } from "lucide-react";
// // // import { useTheme } from "next-themes";
// // // import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// // // import { Separator } from "@/components/ui/separator";

// // // type AssistantType = "پرواز" | "هتل" | "برنامه سفر" | "تور" | null;

// // // type Message = {
// // //   text: string;
// // //   isUser: boolean;
// // //   timestamp: Date;
// // // };

// // // export default function Component() {
// // //   const [activeAssistant, setActiveAssistant] = useState<AssistantType>(null);
// // //   const [messages, setMessages] = useState<Message[]>([]);
// // //   const [inputMessage, setInputMessage] = useState("");
// // //   const { setTheme, theme } = useTheme();

// // //   const handleAssistantChange = (type: AssistantType) => {
// // //     setActiveAssistant(type);
// // //     setMessages([
// // //       {
// // //         text: `سلام من دستیار${type} شما هستم. چطور می تونم کمکتون کنم؟`,
// // //         isUser: false,
// // //         timestamp: new Date(),
// // //       },
// // //     ]);
// // //   };

// // //   const handleSendMessage = () => {
// // //     if (inputMessage.trim()) {
// // //       setMessages([
// // //         ...messages,
// // //         { text: inputMessage, isUser: true, timestamp: new Date() },
// // //       ]);
// // //       setInputMessage("");
// // //       // Here you would typically call an API to get the bot's response
// // //       setTimeout(() => {
// // //         setMessages((prev) => [
// // //           ...prev,
// // //           {
// // //             text: "بزودی کارشناسان ما با شما تماس می گیرند",
// // //             isUser: false,
// // //             timestamp: new Date(),
// // //           },
// // //         ]);
// // //       }, 1000);
// // //     }
// // //   };

// // //   return (
// // //     <div className="flex h-screen  text-foreground">
// // //       <Sheet>
// // //         <SheetTrigger asChild>
// // //           <Button
// // //             variant="outline"
// // //             size="icon"
// // //             className="fixed top-4 right-4 z-50 "
// // //           >
// // //             <Menu className="h-4 w-4" />
// // //           </Button>
// // //         </SheetTrigger>
// // //         <SheetContent side="right" className="w-[300px] sm:w-[400px]">
// // //           <div className="flex flex-col h-full">
// // //             <div className="space-y-4 py-4">
// // //               <div className="px-3 py-2">
// // //                 <h4 className="mb-2 px-4 text-md font-semibold tracking-tight">
// // //                   حساب کاربری
// // //                 </h4>
// // //                 <div className="space-y-1">
// // //                   <Button variant="ghost" className="w-full justify-start">
// // //                     <User className="mr-2 h-4 w-4" />
// // //                     امیر نجفی
// // //                   </Button>
// // //                   <Button variant="ghost" className="w-full justify-start">
// // //                     <Settings className="mr-2 h-4 w-4" />
// // //                     تنظیمات
// // //                   </Button>
// // //                 </div>
// // //               </div>
// // //               <Separator />
// // //               <div className="px-3 py-2">
// // //                 <h4 className="mb-2 px-4 text-md font-semibold tracking-tight">
// // //                   تاریخچه گفتگو
// // //                 </h4>
// // //                 <div className="space-y-1">
// // //                   {[" پرواز", " هتل", "برنامه سفر", "تور"].map(
// // //                     (chat, index) => (
// // //                       <Button
// // //                         key={index}
// // //                         variant="ghost"
// // //                         className="w-full justify-start"
// // //                       >
// // //                         {chat}
// // //                       </Button>
// // //                     )
// // //                   )}
// // //                 </div>
// // //               </div>
// // //               <Separator />
// // //               <div className="px-3 py-2">
// // //                 <div className="flex justify-between items-center space-x-2">
// // //                   <h4 className="mb-2 px-4 text-md font-semibold tracking-tight">
// // //                     تم
// // //                   </h4>
// // //                   <Button
// // //                     onClick={() =>
// // //                       setTheme(theme === "dark" ? "light" : "dark")
// // //                     }
// // //                     variant="outline"
// // //                   >
// // //                     <label htmlFor="theme-mode">
// // //                       {theme === "dark" ? (
// // //                         <Moon className="h-4 w-4" />
// // //                       ) : (
// // //                         <Sun className="h-4 w-4" />
// // //                       )}
// // //                     </label>
// // //                   </Button>
// // //                 </div>
// // //               </div>
// // //             </div>
// // //             <div className="mt-auto p-4">
// // //               <Button className="w-full" variant="secondary">
// // //                 <LogOut className="mr-2 h-4 w-4" />
// // //                 خروج
// // //               </Button>
// // //             </div>
// // //           </div>
// // //         </SheetContent>
// // //       </Sheet>
// // //       <div className="flex-1 flex flex-col">
// // //         <main className="flex-grow overflow-auto p-4">
// // //           {activeAssistant ? (
// // //             <div className="flex flex-col h-full">
// // //               <Button
// // //                 variant="ghost"
// // //                 className="self-start mb-4"
// // //                 onClick={() => handleAssistantChange(null)}
// // //               >
// // //                 <ArrowRight className="w-4 h-4 mr-6" />
// // //                 برگشت
// // //               </Button>
// // //               <div className="flex-grow overflow-auto space-y-4 mb-4">
// // //                 {messages.map((message, index) => (
// // //                   <div
// // //                     key={index}
// // //                     className={`flex ${
// // //                       message.isUser ? "justify-end" : "justify-start"
// // //                     }`}
// // //                   >
// // //                     <div
// // //                       className={`max-w-[70%] p-3 rounded-lg ${
// // //                         message.isUser
// // //                           ? "bg-primary text-primary-foreground"
// // //                           : "bg-secondary text-secondary-foreground"
// // //                       }`}
// // //                     >
// // //                       <p className="text-sm">{message.text}</p>
// // //                       <p className="text-xs mt-1 opacity-50">
// // //                         {message.timestamp.toLocaleTimeString()}
// // //                       </p>
// // //                     </div>
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //             </div>
// // //           ) : (
// // //             <div className="space-y-4"></div>
// // //           )}
// // //         </main>
// // //         {activeAssistant && (
// // //           <div className="p-4 border-t border-border">
// // //             <div className="flex items-center gap-2">
// // //               <Input
// // //                 type="text"
// // //                 value={inputMessage}
// // //                 onChange={(e) => setInputMessage(e.target.value)}
// // //                 placeholder="پیام خود را بنویسید..."
// // //                 className="flex-grow"
// // //                 onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
// // //               />
// // //               <Button size="icon" onClick={handleSendMessage}>
// // //                 <Send className="w-4 h-4" />
// // //                 <span className="sr-only">ارسال</span>
// // //               </Button>
// // //             </div>
// // //           </div>
// // //         )}
// // //         <footer className="p-4 flex justify-around border-t border-border">
// // //           <Button
// // //             variant="ghost"
// // //             className="flex flex-col items-center"
// // //             onClick={() => handleAssistantChange("پرواز")}
// // //           >
// // //             <Plane className="w-6 h-6 mb-1" />
// // //           </Button>
// // //           <Button
// // //             variant="ghost"
// // //             className="flex flex-col items-center"
// // //             onClick={() => handleAssistantChange("هتل")}
// // //           >
// // //             <Building className="w-6 h-6 mb-1" />
// // //           </Button>
// // //           <Button
// // //             variant="ghost"
// // //             className="flex flex-col items-center"
// // //             onClick={() => handleAssistantChange("برنامه سفر")}
// // //           >
// // //             <Map className="w-6 h-6 mb-1" />
// // //           </Button>
// // //           <Button
// // //             variant="ghost"
// // //             className="flex flex-col items-center"
// // //             onClick={() => handleAssistantChange("تور")}
// // //           >
// // //             <Compass className="w-6 h-6 mb-1" />
// // //           </Button>
// // //         </footer>
// // //       </div>
// // //     </div>
// // //   );
// // // }
// // "use client";

// // import * as React from "react";
// // import {
// //   BadgeCheck,
// //   Bell,
// //   Bus,
// //   ChevronLeft,
// //   ChevronsUpDown,
// //   CreditCard,
// //   House,
// //   LogOut,
// //   NotebookPen,
// //   Plane,
// //   Sparkles,
// //   Utensils,
// //   UtensilsCrossed,
// // } from "lucide-react";

// // import { Avatar, AvatarImage } from "@/components/ui/avatar";
// // import {
// //   Collapsible,
// //   CollapsibleContent,
// //   CollapsibleTrigger,
// // } from "@/components/ui/collapsible";
// // import {
// //   DropdownMenu,
// //   DropdownMenuContent,
// //   DropdownMenuGroup,
// //   DropdownMenuItem,
// //   DropdownMenuLabel,
// //   DropdownMenuSeparator,
// //   DropdownMenuTrigger,
// // } from "@/components/ui/dropdown-menu";
// // import { Separator } from "@/components/ui/separator";
// // import {
// //   Sidebar,
// //   SidebarContent,
// //   SidebarFooter,
// //   SidebarGroup,
// //   SidebarGroupLabel,
// //   SidebarHeader,
// //   SidebarInset,
// //   SidebarMenu,
// //   SidebarMenuButton,
// //   SidebarMenuItem,
// //   SidebarMenuSub,
// //   SidebarMenuSubButton,
// //   SidebarMenuSubItem,
// //   SidebarProvider,
// //   SidebarRail,
// //   SidebarTrigger,
// // } from "@/components/ui/sidebar";
// // import LogoCard from "@/components/logo-card";
// // import Chat from "@/components/chat";
// // import Image from "next/image";
// // import Link from "next/link";

// // //  This is sample data.
// // const data = {
// //   user: {
// //     name: "امیر نجفی",
// //     email: "m@example.com",
// //     avatar: "/avatars/shadcn.jpg",
// //   },
// //   navMain: [
// //     {
// //       title: "پرواز",
// //       url: "#",
// //       icon: Plane,
// //       isActive: true,
// //       items: [
// //         {
// //           title: "پرواز از استانبول به دبی دارید؟",
// //           url: "#",
// //         },
// //         {
// //           title: "پرواز آنکارا به مشهد کیه؟",
// //           url: "#",
// //         },
// //         {
// //           title: "چطور می‌تونم از لندن به تهران پرواز بگیرم؟",
// //           url: "#",
// //         },
// //       ],
// //     },
// //     {
// //       title: "هتل",
// //       url: "#",
// //       icon: House,
// //       items: [
// //         {
// //           title: "هتل هیلتون لندن اتاق داره؟",
// //           url: "#",
// //         },
// //         {
// //           title: "مسافرخانه کریمی تو تهران مناسبه؟",
// //           url: "#",
// //         },
// //         {
// //           title: "هتل درویشی مشهد رو رزرو کنید.",
// //           url: "#",
// //         },
// //       ],
// //     },
// //     {
// //       title: "برنامه سفر",
// //       url: "#",
// //       icon: NotebookPen,
// //       items: [
// //         {
// //           title: "می‌تونم معرفی برنامه رو ببینم؟",
// //           url: "#",
// //         },
// //         {
// //           title: "از کجا شروع کنم برای سفرم؟",
// //           url: "#",
// //         },
// //         {
// //           title: "آموزش‌های جدیدی دارین؟",
// //           url: "#",
// //         },
// //         {
// //           title: "تغییرات برنامه‌ها رو چک کنم؟",
// //           url: "#",
// //         },
// //       ],
// //     },
// //     {
// //       title: "تور",
// //       url: "#",
// //       icon: Bus,
// //       items: [
// //         {
// //           title: "اطلاعات عمومی تورها چیه؟",
// //           url: "#",
// //         },
// //         {
// //           title: "چطور با تیم تور آشنا بشم؟",
// //           url: "#",
// //         },
// //         {
// //           title: "هزینه‌های تور رو چطوری بفهمم؟",
// //           url: "#",
// //         },
// //         {
// //           title: "محدودیت‌های شرکت در تور چیه؟",
// //           url: "#",
// //         },
// //       ],
// //     },
// //     {
// //       title: "غذا",
// //       url: "#",
// //       icon: UtensilsCrossed,
// //       items: [
// //         {
// //           title: "می‌تونم اطلاعات کلی رو ببینم؟",
// //           url: "#",
// //         },
// //         {
// //           title: "تیم غذایی شما چه تخصصی داره؟",
// //           url: "#",
// //         },
// //         {
// //           title: "صورت‌حساب غذاها چطوری محاسبه میشه؟",
// //           url: "#",
// //         },
// //         {
// //           title: "محدودیت‌های غذایی دارین؟",
// //           url: "#",
// //         },
// //       ],
// //     },
// //   ],
// //   projects: [
// //     {
// //       name: "بلیط هواپیما",
// //       url: "/flights",
// //       icon: Plane,
// //     },
// //     {
// //       name: "رزرو هتل",
// //       url: "/hotels",
// //       icon: House,
// //     },
// //     {
// //       name: "غذا",
// //       url: "/restaurants",
// //       icon: Utensils,
// //     },
// //     {
// //       name: "تور",
// //       url: "/tours",
// //       icon: Bus,
// //     },
// //   ],
// // };

// // export default function Page() {
// //   return (
// //     <SidebarProvider>
// //       <Sidebar collapsible="offcanvas" variant="inset" side="right">
// //         <SidebarHeader>
// //           <LogoCard />
// //           <Separator orientation="horizontal" />
// //           <SidebarMenu>
// //             <SidebarMenuItem></SidebarMenuItem>
// //           </SidebarMenu>
// //         </SidebarHeader>
// //         <SidebarContent>
// //           <SidebarGroup>
// //             <SidebarGroupLabel>تاریخچه گفتگو</SidebarGroupLabel>
// //             <SidebarMenu>
// //               {data.navMain.map((item) => (
// //                 <Collapsible
// //                   key={item.title}
// //                   asChild
// //                   defaultOpen={item.isActive}
// //                   className="group/collapsible"
// //                 >
// //                   <SidebarMenuItem>
// //                     <CollapsibleTrigger asChild>
// //                       <SidebarMenuButton tooltip={item.title}>
// //                         {item.icon && <item.icon className="prose" />}
// //                         <span>{item.title}</span>
// //                         <ChevronLeft className="mr-auto transition-transform duration-200 group-data-[state=open]/collapsible:-rotate-90" />
// //                       </SidebarMenuButton>
// //                     </CollapsibleTrigger>
// //                     <CollapsibleContent>
// //                       <SidebarMenuSub>
// //                         {item.items?.map((subItem) => (
// //                           <SidebarMenuSubItem key={subItem.title}>
// //                             <SidebarMenuSubButton asChild>
// //                               <a
// //                                 href={subItem.url}
// //                                 className="flex justify-between"
// //                               >
// //                                 <span className="text-xs text-muted-foreground">
// //                                   {subItem.title}
// //                                 </span>
// //                               </a>
// //                             </SidebarMenuSubButton>
// //                           </SidebarMenuSubItem>
// //                         ))}
// //                       </SidebarMenuSub>
// //                     </CollapsibleContent>
// //                   </SidebarMenuItem>
// //                 </Collapsible>
// //               ))}
// //             </SidebarMenu>
// //           </SidebarGroup>
// //           <Separator orientation="horizontal" />
// //           <SidebarGroup className="group-data-[collapsible=icon]:hidden">
// //             <SidebarGroupLabel>خریدها</SidebarGroupLabel>
// //             <SidebarMenu>
// //               {data.projects.map((item) => (
// //                 <SidebarMenuItem key={item.name}>
// //                   <SidebarMenuButton asChild>
// //                     {/* <a href={item.url}> */}
// //                     <Link href={item.url}>
// //                       <item.icon className="prose" />
// //                       <span>{item.name}</span>
// //                     </Link>
// //                     {/* </a> */}
// //                   </SidebarMenuButton>
// //                 </SidebarMenuItem>
// //               ))}
// //             </SidebarMenu>
// //           </SidebarGroup>
// //         </SidebarContent>
// //         <Separator orientation="horizontal" />
// //         <SidebarFooter>
// //           <SidebarMenu>
// //             <SidebarMenuItem>
// //               <DropdownMenu>
// //                 <DropdownMenuTrigger asChild>
// //                   <SidebarMenuButton
// //                     size="lg"
// //                     className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
// //                   >
// //                     <Avatar className="h-8 w-8 rounded-lg">
// //                       <AvatarImage
// //                         src={data.user.avatar}
// //                         alt={data.user.name}
// //                       />

// //                       <Image
// //                         src="/sample.jpg"
// //                         className="rounded-lg"
// //                         width={100}
// //                         height={100}
// //                         alt="avatar"
// //                       />
// //                     </Avatar>
// //                     <div className="grid flex-1 text-left text-sm leading-tight">
// //                       <span className="truncate font-semibold">
// //                         {data.user.name}
// //                       </span>
// //                       <span className="truncate text-xs">
// //                         {data.user.email}
// //                       </span>
// //                     </div>
// //                     <ChevronsUpDown className="ml-auto size-4" />
// //                   </SidebarMenuButton>
// //                 </DropdownMenuTrigger>
// //                 <DropdownMenuContent
// //                   className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
// //                   side="bottom"
// //                   align="end"
// //                   sideOffset={4}
// //                 >
// //                   <DropdownMenuLabel className="p-0 font-normal">
// //                     <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
// //                       <Avatar className="h-8 w-8 rounded-lg">
// //                         <AvatarImage
// //                           src={data.user.avatar}
// //                           alt={data.user.name}
// //                         />
// //                         <Image
// //                           src="/sample.jpg"
// //                           className="rounded-lg"
// //                           width={100}
// //                           height={100}
// //                           alt="avatar"
// //                         />
// //                       </Avatar>
// //                       <div className="grid flex-1 text-left text-sm leading-tight">
// //                         <span className="truncate font-semibold">
// //                           {data.user.name}
// //                         </span>
// //                         <span className="truncate text-xs">
// //                           {data.user.email}
// //                         </span>
// //                       </div>
// //                     </div>
// //                   </DropdownMenuLabel>
// //                   <DropdownMenuSeparator />
// //                   <DropdownMenuGroup>
// //                     <DropdownMenuItem>
// //                       <Sparkles className="prose" />
// //                       <p className="text-sm prose-sm">ارتقاء حساب کاربری</p>
// //                     </DropdownMenuItem>
// //                   </DropdownMenuGroup>
// //                   <DropdownMenuSeparator />
// //                   <DropdownMenuGroup>
// //                     <DropdownMenuItem>
// //                       <BadgeCheck className="prose" />
// //                       <p className="text-sm prose-sm"> حساب کاربری</p>
// //                     </DropdownMenuItem>
// //                     <DropdownMenuItem>
// //                       <CreditCard className="prose" />
// //                       <p className="text-sm prose-sm">پرداخت ها</p>
// //                     </DropdownMenuItem>
// //                     <DropdownMenuItem>
// //                       <Bell className="prose" />
// //                       <p className="text-sm prose-sm">پیام ها</p>
// //                     </DropdownMenuItem>
// //                   </DropdownMenuGroup>
// //                   <DropdownMenuSeparator />
// //                   <DropdownMenuItem>
// //                     <LogOut className="prose text-destructive" />
// //                     <p className="text-sm prose-sm">خروج</p>
// //                   </DropdownMenuItem>
// //                 </DropdownMenuContent>
// //               </DropdownMenu>
// //             </SidebarMenuItem>
// //           </SidebarMenu>
// //         </SidebarFooter>
// //         <SidebarRail />
// //       </Sidebar>
// //       <SidebarInset>
// //         <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
// //           <div className="flex items-center gap-2 px-4">
// //             <SidebarTrigger />
// //           </div>
// //         </header>
// //         <Chat />
// //       </SidebarInset>
// //     </SidebarProvider>
// //   );
// // }
// import React from "react";
// import { Button } from "@/components/ui/button";
// import {
//   ArrowRight,
//   Bus,
//   House,
//   NotebookPen,
//   Plane,
//   SendHorizontal,
//   UtensilsCrossed,
// } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import BotCard from "@/components/bot-card";

// type AssistantType = "پرواز" | "هتل" | "برنامه سفر" | "تور" | "غذا" | null;

// type Message = {
//   text: string;
//   isUser: boolean;
//   timestamp: Date;
// };

// const Chat = () => {
//   const [activeAssistant, setActiveAssistant] =
//     React.useState<AssistantType>(null);
//   const [messages, setMessages] = React.useState<Message[]>([]);
//   const [inputMessage, setInputMessage] = React.useState("");
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
//     <div className="flex-1 flex flex-col">
//       <main className="flex-grow overflow-auto p-4">
//         {activeAssistant ? (
//           <div className="flex flex-col h-full">
//             <Button
//               variant="secondary"
//               className="self-end mb-4"
//               onClick={() => handleAssistantChange(null)}
//             >
//               <ArrowRight className="w-4 h-4 mr-6" />
//               برگشت
//             </Button>
//             <div className="flex-grow overflow-auto space-y-4 mb-4">
//               {messages.map((message, index) => (
//                 <div
//                   key={index}
//                   className={`flex ${
//                     message.isUser ? "justify-end" : "justify-start"
//                   }`}
//                 >
//                   <div
//                     className={`max-w-[70%] p-3 rounded-lg ${
//                       message.isUser
//                         ? "bg-primary text-primary-foreground"
//                         : "bg-secondary text-secondary-foreground"
//                     }`}
//                   >
//                     <p className="text-sm">{message.text}</p>
//                     <p className="text-xs mt-1 opacity-50">
//                       {message.timestamp.toLocaleTimeString()}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ) : (
//           <div className="flex flex-1 flex-col gap-4 p-4">
//             <div className="grid auto-rows-min gap-4 md:grid-cols-5">
//               <BotCard
//                 onClick={() => handleAssistantChange("پرواز")}
//                 title="پرواز"
//                 description="پرواز مورد نظر خودتون رو رزرو کنید و سفر مطمينی رو تجربه کنید."
//                 Icon={Plane}
//               />
//               <BotCard
//                 onClick={() => handleAssistantChange("هتل")}
//                 title="هتل"
//                 description="برای اقامت خود از ما کمک بگیرید و اقامت دلنشینی داشته باشید."
//                 Icon={House}
//               />
//               <BotCard
//                 onClick={() => handleAssistantChange("غذا")}
//                 title="غذا"
//                 description="برای انتخاب بهترین و مناسبترین رستوران با ما صحبت کنید."
//                 Icon={UtensilsCrossed}
//               />
//               <BotCard
//                 onClick={() => handleAssistantChange("برنامه سفر")}
//                 title="برنامه سفر"
//                 description="برنامه سفر خود را از ما بخواهید."
//                 Icon={NotebookPen}
//               />
//               <BotCard
//                 onClick={() => handleAssistantChange("تور")}
//                 title="تور"
//                 description="تور مورد نظر خود را با مشورت ما انتخاب کنید."
//                 Icon={Bus}
//               />
//             </div>
//           </div>
//         )}
//       </main>
//       {activeAssistant && (
//         <div className="p-4 ">
//           <div className="flex items-center gap-2">
//             <Input
//               type="text"
//               value={inputMessage}
//               onChange={(e) => setInputMessage(e.target.value)}
//               placeholder="پیام خود را بنویسید..."
//               className="flex-grow border-none"
//               onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
//             />
//             <Button size="icon" onClick={handleSendMessage}>
//               <SendHorizontal className="w-4 h-4 -rotate-180" />
//               <span className="sr-only">ارسال</span>
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Chat;
import React from "react";
import BotCard from "@/components/bot-card";
import Link from "next/link";

const MainPage = () => {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-5">
        <Link href="/agents/flight-agent">
          <BotCard
            title="پرواز"
            description="پرواز مورد نظر خودتون رو رزرو کنید و سفر مطمينی رو تجربه کنید."
            iconName="Plane"
          />
        </Link>
        <Link href="/agents/hotel-agent">
          <BotCard
            title="هتل"
            description="برای اقامت خود از ما کمک بگیرید و اقامت دلنشینی داشته باشید."
            iconName="House"
          />
        </Link>
        <Link href="/agents/restaurant-agent">
          <BotCard
            title="رستوران"
            description="برای انتخاب بهترین و مناسبترین رستوران با ما صحبت کنید."
            iconName="UtensilsCrossed"
          />
        </Link>
        <Link href="/agents/itinerary-agent">
          <BotCard
            title="برنامه سفر"
            description="برنامه سفر خود را از ما بخواهید."
            iconName="NotebookPen"
          />
        </Link>
        <Link href="/agents/tour-agent">
          <BotCard
            title="تور"
            description="تور مورد نظر خود را با مشورت ما انتخاب کنید."
            iconName="Bus"
          />
        </Link>
      </div>
    </div>
  );
};

export default MainPage;
