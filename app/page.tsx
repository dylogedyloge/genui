// "use client";

// import { useChat } from "ai/react";

// export default function Chat() {
//   const { messages, input, handleInputChange, handleSubmit } = useChat();
//   return (
//     <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
//       {messages.map((m) => (
//         <div key={m.id} className="whitespace-pre-wrap">
//           {m.role === "user" ? "User: " : "AI: "}
//           {m.content}
//         </div>
//       ))}

//       <form onSubmit={handleSubmit}>
//         <input
//           className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
//           value={input}
//           placeholder="Say something..."
//           onChange={handleInputChange}
//         />
//       </form>
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Plane,
//   Building,
//   Map,
//   Compass,
//   Send,
//   ArrowLeft,
//   Settings,
//   LogOut,
//   Moon,
//   Sun,
//   User,
//   Menu,
// } from "lucide-react";
// import { useTheme } from "next-themes";
// import { Separator } from "@/components/ui/separator";
// import { Switch } from "@/components/ui/switch";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuItem,
//   SidebarProvider,
//   SidebarTrigger,
// } from "@/components/ui/sidebar";

// type AssistantType = "Flight" | "Hotel" | "Itinerary" | "Tour" | null;

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
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   const handleAssistantChange = (type: AssistantType) => {
//     setActiveAssistant(type);
//     setMessages([
//       {
//         text: `Hi, I am your ${type?.toLowerCase()} assistant. How can I help you?`,
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
//             text: "I'm processing your request. Please wait a moment.",
//             isUser: false,
//             timestamp: new Date(),
//           },
//         ]);
//       }, 1000);
//     }
//   };

//   const toggleTheme = () => {
//     setTheme(theme === "dark" ? "light" : "dark");
//   };

//   if (!mounted) {
//     return null;
//   }

//   return (
//     <SidebarProvider>
//       <div className="flex h-screen bg-background text-foreground">
//         <Sidebar>
//           <SidebarHeader>
//             <SidebarTrigger asChild>
//               <Button
//                 variant="outline"
//                 size="icon"
//                 className="absolute top-4 left-4 z-50"
//               >
//                 <Menu className="h-4 w-4" />
//               </Button>
//             </SidebarTrigger>
//           </SidebarHeader>
//           <SidebarContent>
//             <div className="space-y-4 py-4">
//               <div className="px-3 py-2">
//                 <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
//                   User Profile
//                 </h2>
//                 <SidebarMenu>
//                   <SidebarMenuItem>
//                     <Button variant="ghost" className="w-full justify-start">
//                       <User className="mr-2 h-4 w-4" />
//                       John Doe
//                     </Button>
//                   </SidebarMenuItem>
//                   <SidebarMenuItem>
//                     <Button variant="ghost" className="w-full justify-start">
//                       <Settings className="mr-2 h-4 w-4" />
//                       Settings
//                     </Button>
//                   </SidebarMenuItem>
//                 </SidebarMenu>
//               </div>
//               <Separator />
//               <div className="px-3 py-2">
//                 <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
//                   Chat History
//                 </h2>
//                 <SidebarMenu>
//                   {[
//                     "Flight Booking",
//                     "Hotel Reservation",
//                     "Paris Itinerary",
//                   ].map((chat, index) => (
//                     <SidebarMenuItem key={index}>
//                       <Button variant="ghost" className="w-full justify-start">
//                         {chat}
//                       </Button>
//                     </SidebarMenuItem>
//                   ))}
//                 </SidebarMenu>
//               </div>
//               <Separator />
//               <div className="px-3 py-2">
//                 <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
//                   Settings
//                 </h2>
//                 <div className="flex items-center space-x-2 px-4">
//                   <Switch
//                     id="theme-mode"
//                     checked={theme === "dark"}
//                     onCheckedChange={toggleTheme}
//                   />
//                   <label htmlFor="theme-mode" className="cursor-pointer">
//                     {theme === "dark" ? (
//                       <Moon className="h-4 w-4" />
//                     ) : (
//                       <Sun className="h-4 w-4" />
//                     )}
//                   </label>
//                 </div>
//               </div>
//             </div>
//             <div className="mt-auto p-4">
//               <Button className="w-full" variant="destructive">
//                 <LogOut className="mr-2 h-4 w-4" />
//                 Logout
//               </Button>
//             </div>
//           </SidebarContent>
//         </Sidebar>
//         <div className="flex-1 flex flex-col">
//           <main className="flex-grow overflow-auto p-4">
//             {activeAssistant ? (
//               <div className="flex flex-col h-full">
//                 <Button
//                   variant="ghost"
//                   className="self-start mb-4"
//                   onClick={() => handleAssistantChange(null)}
//                 >
//                   <ArrowLeft className="w-4 h-4 mr-2" />
//                   Back
//                 </Button>
//                 <div className="flex-grow overflow-auto space-y-4 mb-4">
//                   {messages.map((message, index) => (
//                     <div
//                       key={index}
//                       className={`flex ${
//                         message.isUser ? "justify-end" : "justify-start"
//                       }`}
//                     >
//                       <div
//                         className={`max-w-[70%] p-3 rounded-lg ${
//                           message.isUser
//                             ? "bg-primary text-primary-foreground"
//                             : "bg-secondary text-secondary-foreground"
//                         }`}
//                       >
//                         <p className="text-sm">{message.text}</p>
//                         <p className="text-xs mt-1 opacity-50">
//                           {message.timestamp.toLocaleTimeString()}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 <h2 className="text-2xl font-semibold mb-4">
//                   AI Travel Assistant
//                 </h2>
//                 <p className="text-muted-foreground">
//                   Welcome to your AI Travel Assistant. Use the options below to
//                   start planning your trip.
//                 </p>
//                 <p className="text-muted-foreground">
//                   Whether you need to book a flight, find a hotel, plan an
//                   itinerary, or book a tour, we're here to help!
//                 </p>
//               </div>
//             )}
//           </main>
//           {activeAssistant && (
//             <div className="p-4 border-t border-border">
//               <div className="flex items-center space-x-2">
//                 <Input
//                   type="text"
//                   value={inputMessage}
//                   onChange={(e) => setInputMessage(e.target.value)}
//                   placeholder="Type your message..."
//                   className="flex-grow"
//                   onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
//                 />
//                 <Button size="icon" onClick={handleSendMessage}>
//                   <Send className="w-4 h-4" />
//                   <span className="sr-only">Send message</span>
//                 </Button>
//               </div>
//             </div>
//           )}
//           <footer className="p-4 flex justify-around border-t border-border">
//             <Button
//               variant="ghost"
//               className="flex flex-col items-center"
//               onClick={() => handleAssistantChange("Flight")}
//             >
//               <Plane className="w-6 h-6 mb-1" />
//               <span className="text-xs">Flight</span>
//             </Button>
//             <Button
//               variant="ghost"
//               className="flex flex-col items-center"
//               onClick={() => handleAssistantChange("Hotel")}
//             >
//               <Building className="w-6 h-6 mb-1" />
//               <span className="text-xs">Hotel</span>
//             </Button>
//             <Button
//               variant="ghost"
//               className="flex flex-col items-center"
//               onClick={() => handleAssistantChange("Itinerary")}
//             >
//               <Map className="w-6 h-6 mb-1" />
//               <span className="text-xs">Itinerary</span>
//             </Button>
//             <Button
//               variant="ghost"
//               className="flex flex-col items-center"
//               onClick={() => handleAssistantChange("Tour")}
//             >
//               <Compass className="w-6 h-6 mb-1" />
//               <span className="text-xs">Tour</span>
//             </Button>
//           </footer>
//         </div>
//       </div>
//     </SidebarProvider>
//   );
// }
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plane,
  Building,
  Map,
  Compass,
  Send,
  ArrowLeft,
  Settings,
  LogOut,
  Moon,
  Sun,
  User,
  ArrowRight,
  AlignJustify,
  Menu,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

type AssistantType = "پرواز" | "هتل" | "برنامه سفر" | "تور" | null;

type Message = {
  text: string;
  isUser: boolean;
  timestamp: Date;
};

export default function Component() {
  const [activeAssistant, setActiveAssistant] = useState<AssistantType>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const { setTheme, theme } = useTheme();

  const handleAssistantChange = (type: AssistantType) => {
    setActiveAssistant(type);
    setMessages([
      {
        text: `سلام من دستیار${type} شما هستم. چطور می تونم کمکتون کنم؟`,
        isUser: false,
        timestamp: new Date(),
      },
    ]);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages([
        ...messages,
        { text: inputMessage, isUser: true, timestamp: new Date() },
      ]);
      setInputMessage("");
      // Here you would typically call an API to get the bot's response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            text: "بزودی کارشناسان ما با شما تماس می گیرند",
            isUser: false,
            timestamp: new Date(),
          },
        ]);
      }, 1000);
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed top-4 right-4 z-50 "
          >
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
          <div className="flex flex-col h-full">
            <div className="space-y-4 py-4">
              <div className="px-3 py-2">
                <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                  حساب کاربری
                </h2>
                <div className="space-y-1">
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="mr-2 h-4 w-4" />
                    امیر نجفی
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    تنظیمات
                  </Button>
                </div>
              </div>
              <Separator />
              <div className="px-3 py-2">
                <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                  تاریخچه گفتگو
                </h2>
                <div className="space-y-1">
                  {["رزرو پرواز", "رزرو هتل", "برنامه سفر"].map(
                    (chat, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="w-full justify-start"
                      >
                        {chat}
                      </Button>
                    )
                  )}
                </div>
              </div>
              <Separator />
              <div className="px-3 py-2">
                <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                  تم
                </h2>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="theme-mode"
                    checked={theme === "dark"}
                    onCheckedChange={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                  />
                  <label htmlFor="theme-mode">
                    {theme === "dark" ? (
                      <Moon className="h-4 w-4" />
                    ) : (
                      <Sun className="h-4 w-4" />
                    )}
                  </label>
                </div>
              </div>
            </div>
            <div className="mt-auto p-4">
              <Button className="w-full" variant="destructive">
                <LogOut className="mr-2 h-4 w-4" />
                خروج
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <div className="flex-1 flex flex-col">
        <main className="flex-grow overflow-auto p-4">
          {activeAssistant ? (
            <div className="flex flex-col h-full">
              <Button
                variant="ghost"
                className="self-start mb-4"
                onClick={() => handleAssistantChange(null)}
              >
                <ArrowRight className="w-4 h-4 mr-6" />
                برگشت
              </Button>
              <div className="flex-grow overflow-auto space-y-4 mb-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        message.isUser
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs mt-1 opacity-50">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4"></div>
          )}
        </main>
        {activeAssistant && (
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-2">
              <Input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="پیام خود را بنویسید..."
                className="flex-grow"
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button size="icon" onClick={handleSendMessage}>
                <Send className="w-4 h-4" />
                <span className="sr-only">ارسال</span>
              </Button>
            </div>
          </div>
        )}
        <footer className="p-4 flex justify-around border-t border-border">
          <Button
            variant="ghost"
            className="flex flex-col items-center"
            onClick={() => handleAssistantChange("پرواز")}
          >
            <Plane className="w-6 h-6 mb-1" />
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center"
            onClick={() => handleAssistantChange("هتل")}
          >
            <Building className="w-6 h-6 mb-1" />
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center"
            onClick={() => handleAssistantChange("برنامه سفر")}
          >
            <Map className="w-6 h-6 mb-1" />
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center"
            onClick={() => handleAssistantChange("تور")}
          >
            <Compass className="w-6 h-6 mb-1" />
          </Button>
        </footer>
      </div>
    </div>
  );
}
