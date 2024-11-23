"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useChat } from "ai/react";
import MessageList from "@/components/chat/message-list";
import ChatInput from "@/components/chat/chat-input";
import { Id } from "@/convex/_generated/dataModel";
import { Message as AIMessage } from "@/types/chat";

interface ChatInterfaceProps {
  noteId: Id<"note">; // The current chat session ID
  initialMessages: AIMessage[]; // Messages loaded from Convex
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ noteId, initialMessages }) => {
  const [messages, setMessages] = useState<AIMessage[]>(initialMessages);
  const [input, setInput] = useState("");

  // Convex mutations
  const sendMessageToConvex = useMutation(api.chats.send);

  // UseChat from Vercel AI SDK
  const {
    handleSubmit,
    stop,
    isLoading,
    error,
    reload,
  } = useChat({
    api: "/api/chat",
    messages,
    onResponse: async (response) => {
      // Save AI's response to Convex
      await sendMessageToConvex({
        noteId,
        message: response.content,
        by: "bot",
      });

      // Add bot's response to local state
      setMessages((prev) => [
        ...prev,
        { ...response, by: "bot", role: "assistant" } as AIMessage,
      ]);
    },
  });

  // Handle sending a new message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    // Add the user's message optimistically to the messages state
    const userMessage: AIMessage = {
      id: `temp-${Date.now()}`,
      content: input,
      role: "user",
      by: "user",
      noteId,
    };

    setMessages((prev) => [...prev, userMessage]);

    // Save the user's message to Convex
    await sendMessageToConvex({
      noteId,
      message: input,
      by: "user",
    });

    // Send the message to Vercel AI SDK
    await handleSubmit({
      role: "user",
      content: input,
    });

    // Reset the input
    setInput("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Message List */}
      <MessageList
        messages={messages}
        isLoading={isLoading}
        stop={stop}
        error={error || null}
        reload={reload}
        mounted={true} // Always mounted as it's client-side
        visibilityControls={{
          flights: {}, // Provide your visibility map logic here
          hotels: {},
          restaurants: {},
          tours: {},
        }}
      />

      {/* Chat Input */}
      <ChatInput
        input={input}
        onChange={handleInputChange}
        onSubmit={handleSendMessage}
        isLoading={isLoading}
        error={error ?? null}
      />
    </div>
  );
};

export default ChatInterface;