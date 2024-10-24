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
  Settings,
  LogOut,
  Moon,
  Sun,
  User,
  ArrowRight,
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
                <h4 className="mb-2 px-4 text-md font-semibold tracking-tight">
                  حساب کاربری
                </h4>
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
                <h4 className="mb-2 px-4 text-md font-semibold tracking-tight">
                  تاریخچه گفتگو
                </h4>
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
                <div className="flex justify-between items-center space-x-2">
                  <h4 className="mb-2 px-4 text-md font-semibold tracking-tight">
                    تم
                  </h4>
                  <Button
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                    variant="outline"
                  >
                    <label htmlFor="theme-mode">
                      {theme === "dark" ? (
                        <Moon className="h-4 w-4" />
                      ) : (
                        <Sun className="h-4 w-4" />
                      )}
                    </label>
                  </Button>
                </div>
              </div>
            </div>
            <div className="mt-auto p-4">
              <Button className="w-full" variant="secondary">
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
