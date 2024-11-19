"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ChatInterface from "@/components/chat-interface";

interface TourAgentChatPageProps {
  params: {
    chatId: string;
  };
}
const TourAgent: React.FC<TourAgentChatPageProps> = ({ params }) => {
  const router = useRouter();
  const { chatId } = params;

  return (
    <ChatInterface
      chatId={chatId}
      agentType="تور"
      onBack={() => router.push("/")}
    />
  );
};

export default TourAgent;
