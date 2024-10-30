"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ChatInterface from "@/components/chat-interface";

const HotelAgent = () => {
  const router = useRouter();

  return <ChatInterface agentType="هتل" onBack={() => router.push("/")} />;
};

export default HotelAgent;
