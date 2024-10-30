"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ChatInterface from "@/components/chat-interface";

const TourAgent = () => {
  const router = useRouter();

  return <ChatInterface agentType="تور" onBack={() => router.push("/")} />;
};

export default TourAgent;
