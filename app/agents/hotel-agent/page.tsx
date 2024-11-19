"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ChatInterface from "@/components/chat-interface";

interface HotelAgentChatPageProps {
  params: {
    chatId: string;
  };
}

const HotelAgent: React.FC<HotelAgentChatPageProps> = ({ params }) => {
  const router = useRouter();
  const { chatId } = params;

  return (
    <ChatInterface
      chatId={chatId}
      agentType="هتل"
      onBack={() => router.push("/")}
    />
  );
};

export default HotelAgent;
