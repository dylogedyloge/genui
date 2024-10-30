"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ChatInterface from "@/components/chat-interface";

const ItineraryAgent = () => {
  const router = useRouter();

  return (
    <ChatInterface agentType="برنامه سفر" onBack={() => router.push("/")} />
  );
};

export default ItineraryAgent;
