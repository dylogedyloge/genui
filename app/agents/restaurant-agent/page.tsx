"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ChatInterface from "@/components/chat-interface";

interface RestaurantAgentChatPageProps {
  params: {
    chatId: string;
  };
}
const RestaurantAgent: React.FC<RestaurantAgentChatPageProps> = ({
  params,
}) => {
  const router = useRouter();
  const { chatId } = params;
  return (
    <ChatInterface
      chatId={chatId}
      agentType="رستوران"
      onBack={() => router.push("/")}
    />
  );
};

export default RestaurantAgent;
