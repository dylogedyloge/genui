// "use client";

// import React from "react";
// import { useRouter } from "next/navigation";
// import ChatInterface from "@/components/chat-interface";

// const FlightAgent = () => {
//   const router = useRouter();

//   return <ChatInterface agentType="پرواز" onBack={() => router.push("/")} />;
// };

// export default FlightAgent;
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ChatInterface from "@/components/chat-interface";

const FlightAgent = () => {
  const router = useRouter();

  return <ChatInterface agentType="پرواز" onBack={() => router.push("/")} />;
};

export default FlightAgent;
