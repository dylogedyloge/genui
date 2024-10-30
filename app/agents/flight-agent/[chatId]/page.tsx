"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ChatInterface from "@/components/chat-interface";

interface FlightAgentChatPageProps {
  params: {
    chatId: string;
  };
}

const FlightAgentChatPage: React.FC<FlightAgentChatPageProps> = ({
  params,
}) => {
  const router = useRouter();
  const { chatId } = params;

  return (
    <ChatInterface
      agentType="پرواز"
      chatId={chatId}
      onBack={() => router.push("/agents/flight-agent")}
    />
  );
};

export default FlightAgentChatPage;
