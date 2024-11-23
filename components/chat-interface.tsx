"use client";

import React, { useState, useEffect } from "react";
import { useChat } from "ai/react";
import { useToast } from "@/hooks/use-toast";

// Components
import MessageList from "./chat/message-list";
import ChatInput from "./chat/chat-input";


// Types
import { ChatInterfaceProps } from "@/types/chat";
import { Message } from "@/types/chat";

// Custom Hooks
import { useVisibilityMap } from "@/hooks/use-visibility-map";

const ChatInterface: React.FC<ChatInterfaceProps> = () => {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  // Visibility maps for different card types
  const {
    visibilityMap: flightsMap,
    showMore: showMoreFlights,
    showLess: showLessFlights,
  } = useVisibilityMap();

  const {
    visibilityMap: hotelsMap,
    showMore: showMoreHotels,
    showLess: showLessHotels,
  } = useVisibilityMap();

  const {
    visibilityMap: restaurantsMap,
    showMore: showMoreRestaurants,
    showLess: showLessRestaurants,
  } = useVisibilityMap();

  const {
    visibilityMap: toursMap,
    showMore: showMoreTours,
    showLess: showLessTours,
  } = useVisibilityMap();

  const {
    messages: aiMessages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    error,
    reload,
  } = useChat({
    api: "/api/chat",
   
    keepLastMessageOnError: true,
    initialMessages: [
      {
        id: "initial",
        role: "assistant",
        content: `سلام! من دستیار هوشمند سفر هستم. چطور می‌تونم کمکتون کنم؟`,
      },
    ],
  });

  useEffect(() => {
    setMounted(true);
  }, []);


  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        description: "خطایی رخ داد. لطفا دوباره تلاش کنید.",
        duration: 3000,
      });
    }
  }, [error, toast]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (input.trim()) {
      await handleSubmit(e);
    }
  };

  const visibilityControls = {
    flights: {
      map: flightsMap,
      showMore: showMoreFlights,
      showLess: showLessFlights,
    },
    hotels: {
      map: hotelsMap,
      showMore: showMoreHotels,
      showLess: showLessHotels,
    },
    restaurants: {
      map: restaurantsMap,
      showMore: showMoreRestaurants,
      showLess: showLessRestaurants,
    },
    tours: { map: toursMap, showMore: showMoreTours, showLess: showLessTours },
  };

  const mappedMessages = aiMessages.map((message) => ({
    ...message,
    timestamp: new Date().toISOString(),
  })) as (Message & { timestamp: string })[];

  return (
    <div className="flex flex-col p-4 h-full">

      <MessageList
        messages={mappedMessages}
        isLoading={isLoading}
        stop={stop}
        error={error || null}
        reload={reload}
        mounted={mounted}
        visibilityControls={visibilityControls}
      />

      <ChatInput
        input={input}
        onChange={handleInputChange}
        onSubmit={handleSendMessage}
        isLoading={isLoading}
        error={error ?? null}
      />
    </div>
  );
};

export default ChatInterface;
