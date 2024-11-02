import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, SendHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/utils/supabase-client";
import { useChat } from "ai/react";

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
  userId: string; // Add this
  onBack: () => void;
}

const formatPersianTime = (date: Date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? "بعدازظهر" : "صبح";
  const persianHours = hours % 12 || 12;

  return `${persianHours}:${minutes.toString().padStart(2, "0")} ${period}`;
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  agentType,
  userId,
  chatId,
  onBack,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [mounted, setMounted] = useState(false);

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
      // Update chatId with the new chat's ID
      // You might need to lift this state up to the parent component
      // and pass a setter function as a prop
      // For now, we'll just log it
      console.log("New chat created:", data);
    }
  };

  // Using useChat hook from Vercel AI SDK
  const {
    messages: aiMessages,
    input,
    handleInputChange,
    handleSubmit,
  } = useChat({
    api: "/api/chat",
    body: {
      agentType,
    },
    initialMessages: [
      {
        id: "initial",
        role: "assistant",
        content: `سلام! من دستیار هوشمند ${agentType} هستم. چطور می‌تونم کمکتون کنم؟`,
      },
    ],
  });

  // Log AI messages
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

      // Insert user message into Supabase
      await supabase.from("messages").insert(newMessage);

      // Call handleSubmit to send the message to AI
      await handleSubmit(e);

      // Save AI response to Supabase
      if (aiMessages[aiMessages.length - 1]) {
        await supabase.from("messages").insert({
          chat_id: chatId,
          content: aiMessages[aiMessages.length - 1].content,
          role: "assistant",
        });
      }

      // Fetch all messages after both operations are complete
      await fetchMessages();
    }
  };

  return (
    <div className="flex flex-col p-4 h-full">
      <Button variant="secondary" className="self-end mb-4" onClick={onBack}>
        <ArrowRight className="w-4 h-4 mr-6" />
        برگشت
      </Button>
      <div className="flex-grow overflow-auto space-y-4 mb-4">
        {/* Combine local and AI messages */}
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
            className={`flex ${
              message.isUser ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                message.isUser
                  ? "bg-secondary text-secondary-foreground"
                  : " bg-primary text-primary-foreground"
              }`}
            >
              <p
                className="text-sm [&_span]:cursor-pointer [&_span]:text-blue-500 [&_span]:hover:underline"
                dangerouslySetInnerHTML={{ __html: message.text }}
              />
              {mounted && (
                <p className="text-xs mt-1 opacity-50">
                  {formatPersianTime(message.timestamp)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            value={input}
            onChange={handleInputChange} // Use handleInputChange from useChat
            placeholder="پیام خود را بنویسید..."
            className="flex-grow border-none"
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} // Call handleSendMessage on Enter
          />
          <Button size="icon" onClick={handleSendMessage}>
            {" "}
            {/* Use handleSendMessage */}
            <SendHorizontal className="w-4 h-4 -rotate-180" />
            <span className="sr-only">ارسال</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
