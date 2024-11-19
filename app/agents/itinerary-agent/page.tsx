"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ChatInterface from "@/components/chat-interface";

interface ItineraryAgentChatPageProps {
  params: {
    chatId: string;
  };
}
const ItineraryAgent: React.FC<ItineraryAgentChatPageProps> = ({ params }) => {
  const router = useRouter();
  const { chatId } = params;

  return (
    <ChatInterface
      chatId={chatId}
      agentType="برنامه سفر"
      onBack={() => router.push("/")}
    />
  );
};

export default ItineraryAgent;
