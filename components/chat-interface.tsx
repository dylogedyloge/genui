'use client';

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, SendHorizontal, User, User2 } from "lucide-react";
import { FaStop } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { supabase } from "@/utils/supabase-client";
import { useChat } from "ai/react";
import { useToast } from "@/hooks/use-toast";
import { FlightCard } from "./flight-card";
import { Avatar } from "./ui/avatar";
import { GiHolosphere } from "react-icons/gi";

// Define a unified message type
type Message = {
  text: string;
  isUser: boolean;
  timestamp: Date;
};

// Define a type for Supabase messages
type SupabaseMessage = {
  id: string;
  content: string;
  role: "user" | "assistant"; // Adjusted to match your console output
  createdAt: string; // Assuming this is a string; adjust if it's a Date object
};

interface ChatInterfaceProps {
  agentType: string;
  chatId: string;
  userId: string;
  onBack: () => void;
}

const formatPersianTime = (date: Date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? "بعدازظهر" : "صبح";
  const persianHours = hours % 12 || 12;

  return `${persianHours}:${minutes.toString().padStart(2, "0")} ${period}`;
};

const AGENT_SUGGESTED_QUESTIONS: Record<string, string[]> = {
  پرواز: [
    "قیمت بلیط‌های پرواز استانبول چقدره؟",
    "پروازهای مستقیم به دبی رو می‌خوام",
    "بهترین زمان پرواز به آنتالیا کیه؟",
  ],
  هتل: [
    "هتل‌های ۵ ستاره استانبول رو می‌خوام",
    "قیمت هتل‌های کیش برای عید چقدره؟",
    "بهترین هتل‌های دبی کدومان؟",
  ],
  رستوران: [
    "رستوران‌های ایرانی استانبول کجان؟",
    "بهترین رستوران‌های دبی کدومان؟",
    "رستوران‌های حلال در آنتالیا",
  ],
  تور: [
    "تور ارزان استانبول",
    "تور لحظه آخری کیش",
    "قیمت تور دبی چنده؟",
  ],
  "برنامه سفر": [
    "برنامه سفر ۳ روزه استانبول",
    "جاهای دیدنی دبی",
    "برنامه سفر یک هفته‌ای آنتالیا",
  ],
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  agentType,
  userId,
  chatId,
  onBack,
}) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [mounted, setMounted] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>(
    AGENT_SUGGESTED_QUESTIONS[agentType] || AGENT_SUGGESTED_QUESTIONS["پرواز"]
  );
  const [dots, setDots] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (chatId) {
      fetchMessages();
    } else {
      createNewChat();
    }
  }, [chatId, userId]);

  const createNewChat = async () => {
    const { data, error } = await supabase
      .from("chats")
      .insert({ user_id: userId, agent_type: agentType })
      .select()
      .single();

    if (error) {
      console.error("Error creating new chat:", error);
    } else {
      console.log("New chat created:", data);
    }
  };

  const {
    messages: aiMessages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    error,
    reload,
  } = useChat({
    api: "/api/chat",
    body: {
      agentType,
    },
    keepLastMessageOnError: true,
    initialMessages: [
      {
        id: "initial",
        role: "assistant",
        content: `سلام! من دستیار هوشمند ${agentType} هستم. چطور می‌تونم کمکتون کنم؟`,
      },
    ],
  });

  useEffect(() => {
    console.log("AI Messages:", aiMessages);
  }, [aiMessages]);

  useEffect(() => {
    fetchMessages();
  }, [chatId]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", chatId)
      .order("createdAt", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
    } else if (data) {
      const formattedMessages = data.map((msg) => ({
        text: msg.content,
        isUser: msg.role === "user",
        timestamp: new Date(msg.createdAt),
      }));

      console.log("Formatted User Messages:", formattedMessages);
      setMessages(formattedMessages);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (input.trim()) {
      const newMessage = {
        chat_id: chatId,
        content: input,
        role: "user",
      };

      await supabase.from("messages").insert(newMessage);

      await handleSubmit(e);

      if (aiMessages[aiMessages.length - 1]) {
        await supabase.from("messages").insert({
          chat_id: chatId,
          content: aiMessages[aiMessages.length - 1].content,
          role: "assistant",
        });
      }

      await fetchMessages();
    }
  };

  const handleSuggestionClick = async (question: string) => {
    handleInputChange({
      target: { value: question },
    } as React.ChangeEvent<HTMLInputElement>);
    await handleSubmit(undefined);

    if (aiMessages[aiMessages.length - 1]) {
      await supabase.from("messages").insert({
        chat_id: chatId,
        content: aiMessages[aiMessages.length - 1].content,
        role: "assistant",
      });
    }

    await fetchMessages();
  };

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setDots(d => d.length >= 3 ? '' : d + '.');
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        description: "خطایی رخ داد. لطفا دوباره تلاش کنید.",
        duration: 3000,
      });
    }
  }, [error]);

  return (
    <div className="flex flex-col p-4 h-full">
      <Button variant="secondary" className="self-end mb-4" onClick={onBack}>
        <ArrowRight className="w-4 h-4 mr-6" />
        برگشت
      </Button>
      <div className="flex-grow overflow-auto space-y-4 mb-4">
        {[
          ...messages,
          ...aiMessages.map((aiMsg) => ({
            text: aiMsg.content,
            isUser: aiMsg.role === "user",
            timestamp: new Date(),
          })),
        ].map((message, index) => (
          <div
            key={index}
            className={`flex ${message.isUser ? "justify-start" : "justify-end"}`}
          >
            
              {message.isUser ? <User /> : <GiHolosphere />}
            

            <div
              className={`max-w-[70%] p-3 rounded-lg relative ${message.isUser
                ? "bg-secondary text-secondary-foreground rounded-br-none"
                : " bg-primary text-primary-foreground rounded-br-none"
                }`}
            >

              <p
                className="text-sm [&_span]:cursor-pointer [&_span]:text-blue-500 [&_span]:hover:underline"
                dangerouslySetInnerHTML={{ __html: message.text }}
              />
              <div className="flex justify-between items-center mt-1">
                {mounted && (
                  <p className="text-xs opacity-50 text-left ">
                    {formatPersianTime(message.timestamp)}
                  </p>
                )}
                {!message.isUser && isLoading && index === aiMessages.length - 1 && (
                  <Button
                    size="icon"
                    variant="default"
                    className="h-6 w-6 rounded-full ml-2"
                    onClick={stop}
                  >
                    <FaStop />
                    <span className="sr-only">توقف</span>
                  </Button>
                )}
              </div>
            </div>
            {message.toolInvocations?.map(toolInvocation => {
              const { toolName, toolCallId, state } = toolInvocation;
              if (state === 'result') {
                if (toolName === 'displayFlightCard') {
                  const { result } = toolInvocation;
                  return (
                    <div key={toolCallId}>
                      <FlightCard {...result} />
                    </div>
                  );
                }
              } else {
                return (
                  <div key={toolCallId}>
                    {toolName === 'displayFlightCard' ? (
                      <div>Loading flight...</div>
                    ) : null}
                  </div>
                );
              }
            })}
          </div>
        ))}
        {error && (
          <div className="flex justify-center">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => reload()}
            >
              تلاش مجدد
            </Button>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {suggestedQuestions.map((question, index) => (
          <Button
            key={index}
            variant="outline"
            className="text-sm"
            onClick={() => handleSuggestionClick(question)}
            disabled={isLoading}
          >
            {question}
          </Button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="پیام خود را بنویسید..."
          className="flex-grow border-none"
          disabled={isLoading || error != null}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isLoading && !error) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <Button
          size="icon"
          onClick={() => handleSendMessage()}
          disabled={isLoading || error != null}
        >
          <SendHorizontal className="w-4 h-4 -rotate-180" />
          <span className="sr-only">ارسال</span>
        </Button>
      </div>
    </div>
  );
};

export default ChatInterface;
