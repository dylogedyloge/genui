"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ChatInterface from "@/components/chat-interface";

const RestaurantAgent = () => {
  const router = useRouter();

  return <ChatInterface agentType="رستوران" onBack={() => router.push("/")} />;
};

export default RestaurantAgent;
