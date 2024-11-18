"use client";

import React, { useState, useEffect } from "react";
import { useChat } from "ai/react";
import { useToast } from "@/hooks/use-toast";

// Components
import Header from "./chat/header";
import MessageList from "./chat/message-list";
import SuggestedQuestions from "./chat/suggested-questions";
import ChatInput from "./chat/chat-input";

// Constants
import { AGENT_SUGGESTED_QUESTIONS } from "@/constants/suggestedQuestions";

// Types
import { ChatInterfaceProps } from "@/types/chat";

// Custom Hooks
import { useVisibilityMap } from "@/hooks/use-visibility-map";

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  agentType,
  userId,
  chatId,
  onBack,
}) => {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>(
    AGENT_SUGGESTED_QUESTIONS[agentType] || AGENT_SUGGESTED_QUESTIONS["پرواز"]
  );

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
    body: { agentType },
    keepLastMessageOnError: true,
    initialMessages: [
      {
        id: "initial",
        role: "assistant",
        content: `سلام! من دستیار هوشمند ${agentType} هستم. چطور می‌تونم کمکتون کنم؟`,
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

  const handleSuggestionClick = async (question: string) => {
    handleInputChange({
      target: { value: question },
    } as React.ChangeEvent<HTMLInputElement>);
    await handleSubmit(undefined);
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

  return (
    <div className="flex flex-col p-4 h-full">
      <Header onBack={onBack} />

      <MessageList
        messages={aiMessages}
        isLoading={isLoading}
        stop={stop}
        error={error}
        reload={reload}
        mounted={mounted}
        visibilityControls={visibilityControls}
      />

      <SuggestedQuestions
        questions={suggestedQuestions}
        isLoading={isLoading}
        onQuestionClick={handleSuggestionClick}
      />

      <ChatInput
        input={input}
        onChange={handleInputChange}
        onSubmit={handleSendMessage}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};

export default ChatInterface;
