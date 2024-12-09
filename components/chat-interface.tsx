// "use client";

// import React, { useState, useEffect } from "react";
// import { useChat } from "ai/react";
// import { useToast } from "@/hooks/use-toast";

// // Components
// import MessageList from "./chat/message-list";
// import ChatInput from "./chat/chat-input";
// import VoiceChat from "./voice.chat";
// import { Switch } from "@/components/shadcn/switch";

// // Types
// import { ChatInterfaceProps } from "@/types/chat";
// import { Message } from "@/types/chat";

// // Custom Hooks
// import { useVisibilityMap } from "@/hooks/use-visibility-map";

// const ChatInterface: React.FC<ChatInterfaceProps> = () => {
//   const { toast } = useToast();
//   const [mounted, setMounted] = useState(false);
//   const [isVoiceChat, setIsVoiceChat] = useState(false);

//   // Visibility maps for different card types
//   const {
//     visibilityMap: flightsMap,
//     showMore: showMoreFlights,
//     showLess: showLessFlights,
//   } = useVisibilityMap();

//   const {
//     visibilityMap: hotelsMap,
//     showMore: showMoreHotels,
//     showLess: showLessHotels,
//   } = useVisibilityMap();

//   const {
//     visibilityMap: restaurantsMap,
//     showMore: showMoreRestaurants,
//     showLess: showLessRestaurants,
//   } = useVisibilityMap();

//   const {
//     visibilityMap: toursMap,
//     showMore: showMoreTours,
//     showLess: showLessTours,
//   } = useVisibilityMap();

//   const {
//     messages: aiMessages,
//     input,
//     handleInputChange,
//     handleSubmit,
//     isLoading,
//     stop,
//     error,
//     reload,
//   } = useChat({
//     api: "/api/chat",

//     keepLastMessageOnError: true,
//     initialMessages: [
//       {
//         id: "initial",
//         role: "assistant",
//         content: `سلام! من دستیار هوشمند سفر هستم. چطور می‌تونم کمکتون کنم؟`,
//       },
//     ],
//   });

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   useEffect(() => {
//     if (error) {
//       toast({
//         variant: "destructive",
//         description: "خطایی رخ داد. لطفا دوباره تلاش کنید.",
//         duration: 3000,
//       });
//     }
//   }, [error, toast]);

//   const handleSendMessage = async (e?: React.FormEvent) => {
//     if (e) e.preventDefault();
//     if (input.trim()) {
//       await handleSubmit(e);
//     }
//   };

//   const visibilityControls = {
//     flights: {
//       map: flightsMap,
//       showMore: showMoreFlights,
//       showLess: showLessFlights,
//     },
//     hotels: {
//       map: hotelsMap,
//       showMore: showMoreHotels,
//       showLess: showLessHotels,
//     },
//     restaurants: {
//       map: restaurantsMap,
//       showMore: showMoreRestaurants,
//       showLess: showLessRestaurants,
//     },
//     tours: { map: toursMap, showMore: showMoreTours, showLess: showLessTours },
//   };

//   const mappedMessages = aiMessages.map((message) => ({
//     ...message,
//     timestamp: new Date().toISOString(),
//   })) as (Message & { timestamp: string })[];

//   return (
//     <div className="flex flex-col p-4 h-full">
//       <MessageList
//         messages={mappedMessages}
//         isLoading={isLoading}
//         stop={stop}
//         error={error || null}
//         reload={reload}
//         mounted={mounted}
//         visibilityControls={visibilityControls}
//       />

//       <Switch
//         checked={isVoiceChat}
//         onCheckedChange={(checked) => setIsVoiceChat(checked)}
//         className="m-2"
//       />
//       {/* <ChatInput
//         input={input}
//         onChange={handleInputChange}
//         onSubmit={handleSendMessage}
//         isLoading={isLoading}
//         error={error ?? null}
//       /> */}
//       {isVoiceChat ? (
//         <VoiceChat />
//       ) : (
//         <>
//           <ChatInput
//             input={input}
//             onChange={handleInputChange}
//             onSubmit={handleSendMessage}
//             isLoading={isLoading}
//             error={error ?? null}
//           />
//         </>
//       )}
//     </div>
//   );
// };

// export default ChatInterface;
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useChat } from "ai/react";
import { useToast } from "@/hooks/use-toast";

// Components
import MessageList from "./chat/message-list";
import ChatInput from "./chat/chat-input";
import VoiceChat from "./voice.chat";
import { Switch } from "@/components/shadcn/switch";
import { Label } from "./shadcn/label";
import { Button } from "./shadcn/button";

// Types
import { ChatInterfaceProps } from "@/types/chat";
import {
  Flight,
  Hotel,
  Restaurant,
  Tour,
  ToolInvocation,
  Message,
  VisibilityControl,
} from "@/types/chat";
import { ItemType } from "@openai/realtime-api-beta/dist/lib/client.js";


// Custom Hooks
import { useVisibilityMap } from "@/hooks/use-visibility-map";

// Libraries and Utilities
import ReactMarkdown from "react-markdown";
import { GiHolosphere } from "react-icons/gi";
import { User, Brain, Mic, MicOff, ChevronDown, ChevronUp } from "lucide-react";
import { RealtimeClient } from "@openai/realtime-api-beta";
import { WavRecorder, WavStreamPlayer } from "@/lib/wavtools/index";
import { WavRenderer } from "@/utils/wav_renderer";
import { formatPersianTime } from "@/utils/time-helpers";

// Components and Skeletons
import FlightCard from "@/components/cards/flight-card";
import HotelCard from "@/components/cards/hotel-card";
import RestaurantCard from "@/components/cards/restaurant-card";
import TourCard from "@/components/cards/tour-card";
import FlightCardSkeleton from "@/components/skeletons/flight-card-skeleton";
import HotelCardSkeleton from "@/components/skeletons/hotel-card-skeleton";
import RestaurantCardSkeleton from "@/components/skeletons/restaurant-card-skeleton";
import TourCardSkeleton from "@/components/skeletons/tour-card-skeleton";

// Type Guards
const isFlightArray = (result: any): result is Flight[] => {
  return !!result && (result as Flight[])[0]?.departure !== undefined;
};

const isHotelArray = (result: any): result is Hotel[] => {
  return !!result && (result as Hotel[])[0]?.hotelName !== undefined;
};

const isRestaurantArray = (result: any): result is Restaurant[] => {
  return !!result && (result as Restaurant[])[0]?.cuisine !== undefined;
};

const isTourArray = (result: any): result is Tour[] => {
  return !!result && (result as Tour[])[0]?.destination !== undefined;
};


const USE_LOCAL_RELAY_SERVER_URL: string | undefined = void 0;

const ChatInterface: React.FC<ChatInterfaceProps> = () => {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || "";

  const instructions = `SYSTEM SETTINGS:
  ------
  INSTRUCTIONS:
  - به زبان فارسی صحبت کنید
  - فقط به سوالات در مورد سفر پاسخ دهید
  - لطفاً پاسخ‌های خود را به صورت صوتی و مفید ارائه دهید.
  - پاسخ‌ها باید کوتاه و مفید باشند و حداکثر ۲۰۰ کاراکتر داشته باشند.
  - می‌توانید از کاربر سؤال بپرسید.
  - آماده اکتشاف و مکالمه باشید.
  ------
  شخصیت:
  - پر انرژی و مثبت باشید.
  - سریع صحبت کنید، انگار هیجان‌زده هستید.
  ------
  `;

  const wavRecorderRef = useRef<WavRecorder>(
    new WavRecorder({ sampleRate: 24000 })
  );
  const wavStreamPlayerRef = useRef<WavStreamPlayer>(
    new WavStreamPlayer({ sampleRate: 24000 })
  );
  const clientRef = useRef<RealtimeClient>(
    new RealtimeClient(
      USE_LOCAL_RELAY_SERVER_URL
        ? { url: USE_LOCAL_RELAY_SERVER_URL }
        : {
            apiKey: apiKey,
            dangerouslyAllowAPIKeyInBrowser: true,
          }
    )
  );

  const clientCanvasRef = useRef<HTMLCanvasElement>(null);
  const serverCanvasRef = useRef<HTMLCanvasElement>(null);
  const startTimeRef = useRef<string>(new Date().toISOString());

  const [items, setItems] = useState<ItemType[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [inputText, setInputText] = useState("");

  const connectConversation = useCallback(async () => {
    const client = clientRef.current;
    const wavRecorder = wavRecorderRef.current;
    const wavStreamPlayer = wavStreamPlayerRef.current;

    startTimeRef.current = new Date().toISOString();
    setIsConnected(true);
    setItems(client.conversation.getItems());

    await wavRecorder.begin();
    await wavStreamPlayer.connect();
    await client.connect();
    client.sendUserMessageContent([
      {
        type: `input_text`,
        text: ``,
      },
    ]);

    if (client.getTurnDetectionType() === "server_vad") {
      await wavRecorder.record((data) => client.appendInputAudio(data.mono));
    }
  }, []);

  const disconnectConversation = useCallback(async () => {
    setIsConnected(false);

    const client = clientRef.current;
    client.disconnect();

    const wavRecorder = wavRecorderRef.current;
    await wavRecorder.end();

    const wavStreamPlayer = wavStreamPlayerRef.current;
    await wavStreamPlayer.interrupt();
  }, []);

  const changeTurnEndType = async (value: string) => {
    const client = clientRef.current;
    const wavRecorder = wavRecorderRef.current;
    if (value === "none" && wavRecorder.getStatus() === "recording") {
      await wavRecorder.pause();
    }
    client.updateSession({
      turn_detection: value === "none" ? null : { type: "server_vad" },
    });
    if (value === "server_vad" && client.isConnected()) {
      await wavRecorder.record((data) => client.appendInputAudio(data.mono));
    }
  };

  useEffect(() => {
    const conversationEls = [].slice.call(
      document.body.querySelectorAll("[data-conversation-content]")
    );
    for (const el of conversationEls) {
      const conversationEl = el as HTMLDivElement;
      conversationEl.scrollTop = conversationEl.scrollHeight;
    }
  }, [items]);

  useEffect(() => {
    let isLoaded = true;

    changeTurnEndType("server_vad");

    const wavRecorder = wavRecorderRef.current;
    const clientCanvas = clientCanvasRef.current;
    let clientCtx: CanvasRenderingContext2D | null = null;

    const wavStreamPlayer = wavStreamPlayerRef.current;
    const serverCanvas = serverCanvasRef.current;
    let serverCtx: CanvasRenderingContext2D | null = null;

    const render = () => {
      if (isLoaded) {
        if (clientCanvas) {
          if (!clientCanvas.width || !clientCanvas.height) {
            clientCanvas.width = clientCanvas.offsetWidth;
            clientCanvas.height = clientCanvas.offsetHeight;
          }
          clientCtx = clientCtx || clientCanvas.getContext("2d");
          if (clientCtx) {
            clientCtx.clearRect(0, 0, clientCanvas.width, clientCanvas.height);
            const result = wavRecorder.recording
              ? wavRecorder.getFrequencies("voice")
              : { values: new Float32Array([0]) };
            WavRenderer.drawBars(
              clientCanvas,
              clientCtx,
              result.values,
              "#0099ff",
              10,
              0,
              8
            );
          }
        }
        if (serverCanvas) {
          if (!serverCanvas.width || !serverCanvas.height) {
            serverCanvas.width = serverCanvas.offsetWidth;
            serverCanvas.height = serverCanvas.offsetHeight;
          }
          serverCtx = serverCtx || serverCanvas.getContext("2d");
          if (serverCtx) {
            serverCtx.clearRect(0, 0, serverCanvas.width, serverCanvas.height);
            const result = wavStreamPlayer.analyser
              ? wavStreamPlayer.getFrequencies("voice")
              : { values: new Float32Array([0]) };
            WavRenderer.drawBars(
              serverCanvas,
              serverCtx,
              result.values,
              "#fff700",
              10,
              0,
              8
            );
          }
        }
        window.requestAnimationFrame(render);
      }
    };
    render();

    return () => {
      isLoaded = false;
    };
  }, []);

  useEffect(() => {
    const wavStreamPlayer = wavStreamPlayerRef.current;
    const client = clientRef.current;

    client.updateSession({ instructions: instructions });
    client.updateSession({ input_audio_transcription: { model: "whisper-1" } });
    client.updateSession({ voice: "coral" });

    client.on("error", (event: any) => console.error(event));
    client.on("conversation.interrupted", async () => {
      const trackSampleOffset = await wavStreamPlayer.interrupt();
      if (trackSampleOffset?.trackId) {
        const { trackId, offset } = trackSampleOffset;
        await client.cancelResponse(trackId, offset);
      }
    });
    client.on("conversation.updated", async ({ item, delta }: any) => {
      const items = client.conversation.getItems();
      if (delta?.audio) {
        wavStreamPlayer.add16BitPCM(delta.audio, item.id);
      }
      if (item.status === "completed" && item.formatted.audio?.length) {
        const wavFile = await WavRecorder.decode(
          item.formatted.audio,
          24000,
          24000
        );
        item.formatted.file = wavFile;
      }
      setItems(items);
    });

    setItems(client.conversation.getItems());

    return () => {
      client.reset();
    };
  }, []);

  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [isVoiceChat, setIsVoiceChat] = useState(false);

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

  const combinedMessages = [
    ...mappedMessages,
    ...items.map((item) => ({
      id: item.id,
      role: item.role,
      content: item.formatted.transcript || item.formatted.text || "",
      timestamp: new Date().toISOString(),
      isVoice: true,
    })),
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-auto space-y-4 mb-4">
        {combinedMessages.map((message, messageIndex) => (
          <div
            key={messageIndex}
            className={`flex ${message.role === "user" ? "justify-start" : "justify-end"}`}
          >
            {message.role === "user" ? (
              <>
                <User className="w-6 h-6 ml-4" />
                <div className="max-w-[80%] p-3 rounded-lg bg-secondary text-secondary-foreground rounded-tr-none">
                  {message.isVoice && <Mic className="w-4 h-4" />}
                  <ReactMarkdown className="prose-sm text-sm">

                    {message.content || message.text}
                  </ReactMarkdown>
                  {mounted && (
                    <p className="text-xs text-muted-foreground text-left my-1">
                      {formatPersianTime(new Date(message.timestamp))}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="max-w-[80%] p-2 rounded-lg bg-primary text-primary-foreground rounded-tl-none">
                  {message.isVoice && <Mic className="w-4 h-4" />}
                  <ReactMarkdown className="prose-sm text-sm">

                    {message.content || message.text}
                  </ReactMarkdown>
                  {mounted && (
                    <p className="text-xs text-muted-foreground prose-sm text-left my-1">
                      {formatPersianTime(new Date(message.timestamp))}
                    </p>
                  )}

                  {/* Tool invocations */}
                  {message.toolInvocations?.map(
                    (toolInvocation: ToolInvocation, invocationIndex: number) => {
                      const { toolName, state, result } = toolInvocation;

                      if (state === "result") {
                        // Use type guards to determine the type of `result`
                        switch (toolName) {
                          case "displayFlightCard":
                            if (isFlightArray(result)) {
                              return renderFlightCards(
                                result,
                                messageIndex,
                                invocationIndex,
                                visibilityControls.flights
                              );
                            }
                            break;

                          case "displayHotelCard":
                            if (isHotelArray(result)) {
                              return renderHotelCards(
                                result,
                                messageIndex,
                                invocationIndex,
                                visibilityControls.hotels
                              );
                            }
                            break;

                          case "displayRestaurantCard":
                            if (isRestaurantArray(result)) {
                              return renderRestaurantCards(
                                result,
                                messageIndex,
                                invocationIndex,
                                visibilityControls.restaurants
                              );
                            }
                            break;

                          case "displayTourCard":
                            if (isTourArray(result)) {
                              return renderTourCards(
                                result,
                                messageIndex,
                                invocationIndex,
                                visibilityControls.tours
                              );
                            }
                            break;

                          default:
                            return null;
                        }
                      } else {
                        return (
                          <div key={toolInvocation.toolCallId} className="mt-2">
                            {renderSkeletonsForTool(toolName)}
                          </div>
                        );
                      }
                    }
                  )}
                </div>
                <GiHolosphere className="w-6 h-6 mr-4 " />
                {/* {message.isVoice && <Mic className="w-6 h-6 mr-4" />}
                {!message.isVoice && <GiHolosphere className="w-6 h-6 mr-4" />} */}
              </>
            )}
          </div>
        ))}

        {error && (
          <div className="flex justify-center">
            <Button variant="destructive" size="sm" onClick={() => reload()}>
              تلاش مجدد
            </Button>
          </div>
        )}
      </div>

      <div className="absolute bottom-16 right-2">
        <Switch
          checked={isVoiceChat}
          onCheckedChange={(checked) => setIsVoiceChat(checked)}
        />
        <Label htmlFor="airplane-mode" className="m-2">
          چت صوتی
        </Label>
      </div>

      {isVoiceChat ? (
        <div data-component="VoiceChat" dir="rtl">
          {/* Actions Section */}
          <div className=" flex items-center justify-center gap-2 m-1 ">
            <Button
              variant="default"
              size="icon"
              onClick={
                isConnected ? disconnectConversation : connectConversation
              }
              className={`w-16 h-16 rounded-full ${isConnected ? "animate-pulse" : ""
                }`}
            >
              {isConnected ? <MicOff /> : <Mic />}
            </Button>
          </div>
        </div>
      ) : (
        <ChatInput
          input={input}
          onChange={handleInputChange}
          onSubmit={handleSendMessage}
          isLoading={isLoading}
          error={error ?? null}
        />
      )}
    </div>
  );
};

// Helper functions for rendering tool responses
const renderFlightCards = (
  flights: Flight[],
  messageIndex: number,
  invocationIndex: number,
  visibilityControl: VisibilityControl
) => {
  return (
    <div className="mt-2 grid sm:grid-cols-2 grid-cols-1 gap-2 sm:gap-4">
      {flights
        .slice(0, visibilityControl.map[messageIndex]?.[invocationIndex] || 2)
        .map((flight: Flight) => (
          <FlightCard key={flight.id} {...flight} />
        ))}
      {renderVisibilityButtons(
        flights.length,
        messageIndex,
        invocationIndex,
        visibilityControl
      )}
    </div>
  );
};

const renderHotelCards = (
  hotels: Hotel[],
  messageIndex: number,
  invocationIndex: number,
  visibilityControl: VisibilityControl
) => {
  return (
    <div className="mt-2 grid sm:grid-cols-2 grid-cols-1 gap-2 sm:gap-4">
      {hotels
        .slice(0, visibilityControl.map[messageIndex]?.[invocationIndex] || 2)
        .map((hotel: Hotel) => (
          <HotelCard key={hotel.id} {...hotel} />
        ))}
      {renderVisibilityButtons(
        hotels.length,
        messageIndex,
        invocationIndex,
        visibilityControl
      )}
    </div>
  );
};

const renderRestaurantCards = (
  restaurants: Restaurant[],
  messageIndex: number,
  invocationIndex: number,
  visibilityControl: VisibilityControl
) => {
  return (
    <div className="mt-2 grid sm:grid-cols-2 grid-cols-1 gap-2 sm:gap-4">
      {restaurants
        .slice(0, visibilityControl.map[messageIndex]?.[invocationIndex] || 2)
        .map((restaurant: Restaurant) => (
          <RestaurantCard key={restaurant.id} {...restaurant} />
        ))}
      {renderVisibilityButtons(
        restaurants.length,
        messageIndex,
        invocationIndex,
        visibilityControl
      )}
    </div>
  );
};

const renderTourCards = (
  tours: Tour[],
  messageIndex: number,
  invocationIndex: number,
  visibilityControl: VisibilityControl
) => {
  return (
    <div className="mt-2 grid sm:grid-cols-2 grid-cols-1 gap-2 sm:gap-4">
      {tours
        .slice(0, visibilityControl.map[messageIndex]?.[invocationIndex] || 2)
        .map((tour: Tour) => (
          <TourCard key={tour.id} {...tour} />
        ))}
      {renderVisibilityButtons(
        tours.length,
        messageIndex,
        invocationIndex,
        visibilityControl
      )}
    </div>
  );
};

const renderVisibilityButtons = (
  itemsLength: number,
  messageIndex: number,
  invocationIndex: number,
  visibilityControl: VisibilityControl
) => (
  <div className="col-span-full flex justify-center mt-4 gap-2">
    {(visibilityControl.map[messageIndex]?.[invocationIndex] || 2) <
      itemsLength && (
      <Button
        variant="secondary"
        onClick={() =>
          visibilityControl.showMore(messageIndex, invocationIndex)
        }
      >
        <ChevronDown />
        بیشتر
      </Button>
    )}
    {(visibilityControl.map[messageIndex]?.[invocationIndex] || 2) > 2 && (
      <Button
        variant="secondary"
        onClick={() =>
          visibilityControl.showLess(messageIndex, invocationIndex)
        }
      >
        <ChevronUp />
        کمتر
      </Button>
    )}
  </div>
);

const renderSkeletonsForTool = (toolName: string) => {
  switch (toolName) {
    case "displayFlightCard":
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <FlightCardSkeleton key={i} />
          ))}
        </div>
      );
    case "displayHotelCard":
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <HotelCardSkeleton key={i} />
          ))}
        </div>
      );
    case "displayRestaurantCard":
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <RestaurantCardSkeleton key={i} />
          ))}
        </div>
      );
    case "displayTourCard":
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <TourCardSkeleton key={i} />
          ))}
        </div>
      );
    default:
      return null;
  }
};

export default ChatInterface;
// "use client";

// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { useChat } from "ai/react";
// import { useToast } from "@/hooks/use-toast";

// // Components
// import MessageList from "./chat/message-list";
// import ChatInput from "./chat/chat-input";
// import VoiceChat from "./voice.chat";
// import { Switch } from "@/components/shadcn/switch";

// // Types
// import { ChatInterfaceProps } from "@/types/chat";
// // import { Message } from "@/types/chat";

// // Custom Hooks
// import { useVisibilityMap } from "@/hooks/use-visibility-map";
// import { Label } from "./shadcn/label";
// // import { Brain, Mic, MicOff, User } from "lucide-react";
// // import { Button } from "./shadcn/button";

// // <VoiceChat/>
// // import { useEffect, useRef, useCallback, useState } from "react";
// import { RealtimeClient } from "@openai/realtime-api-beta";
// import { ItemType } from "@openai/realtime-api-beta/dist/lib/client.js";
// import { WavRecorder, WavStreamPlayer } from "@/lib/wavtools/index";
// import { WavRenderer } from "@/utils/wav_renderer";
// import { User, Brain, Mic, MicOff,ChevronDown, ChevronUp } from "lucide-react";
// import { Button } from "./shadcn/button";
// // <VoiceChat/>
// // <MessageList/>
// import ReactMarkdown from "react-markdown";
// import { GiHolosphere } from "react-icons/gi";
// import FlightCard from "@/components/cards/flight-card";
// import HotelCard from "@/components/cards/hotel-card";
// import RestaurantCard from "@/components/cards/restaurant-card";
// import TourCard from "@/components/cards/tour-card";

// import FlightCardSkeleton from "@/components/skeletons/flight-card-skeleton";
// import HotelCardSkeleton from "@/components/skeletons/hotel-card-skeleton";
// import RestaurantCardSkeleton from "@/components/skeletons/restaurant-card-skeleton";
// import TourCardSkeleton from "@/components/skeletons/tour-card-skeleton";

// import { formatPersianTime } from "@/utils/time-helpers";

// import {
//   Flight,
//   Hotel,
//   Restaurant,
//   Tour,
//   ToolInvocation,
//   Message,
//   VisibilityControl,
// } from "@/types/chat";
// // <MessageList/>


// // <MessageList/>
// /**
//  * Type Guards to check the type of `result` based on the toolName
//  */
// const isFlightArray = (
//   result: Flight[] | Hotel[] | Restaurant[] | Tour[] | undefined
// ): result is Flight[] => {
//   return !!result && (result as Flight[])[0]?.departure !== undefined;
// };

// const isHotelArray = (
//   result: Flight[] | Hotel[] | Restaurant[] | Tour[] | undefined
// ): result is Hotel[] => {
//   return !!result && (result as Hotel[])[0]?.hotelName !== undefined;
// };

// const isRestaurantArray = (
//   result: Flight[] | Hotel[] | Restaurant[] | Tour[] | undefined
// ): result is Restaurant[] => {
//   return !!result && (result as Restaurant[])[0]?.cuisine !== undefined;
// };

// const isTourArray = (
//   result: Flight[] | Hotel[] | Restaurant[] | Tour[] | undefined
// ): result is Tour[] => {
//   return !!result && (result as Tour[])[0]?.destination !== undefined;
// };

// interface MessageListProps {
//   messages: Message[];
//   isLoading: boolean;
//   stop: () => void;
//   error: Error | null;
//   reload: () => void;
//   mounted: boolean;
//   visibilityControls: {
//     flights: VisibilityControl;
//     hotels: VisibilityControl;
//     restaurants: VisibilityControl;
//     tours: VisibilityControl;
//   };
// }
// // <MessageList/>

// // <VoiceChat/>
// const USE_LOCAL_RELAY_SERVER_URL: string | undefined = void 0;
// // <VoiceChat/>

// const ChatInterface: React.FC<ChatInterfaceProps> = () => {
//   // <VoiceChat/>
//   const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || "";

//   const instructions = `SYSTEM SETTINGS:
// ------
// INSTRUCTIONS:
// - به زبان فارسی صحبت کنید
// - فقط به سوالات در مورد سفر پاسخ دهید
// - لطفاً پاسخ‌های خود را به صورت صوتی و مفید ارائه دهید.
// - پاسخ‌ها باید کوتاه و مفید باشند و حداکثر ۲۰۰ کاراکتر داشته باشند.
// - می‌توانید از کاربر سؤال بپرسید.
// - آماده اکتشاف و مکالمه باشید.

// ------
// شخصیت:
// - پر انرژی و مثبت باشید.
// - سریع صحبت کنید، انگار هیجان‌زده هستید.

// ------

// `;

//   const wavRecorderRef = useRef<WavRecorder>(
//     new WavRecorder({ sampleRate: 24000 })
//   );
//   const wavStreamPlayerRef = useRef<WavStreamPlayer>(
//     new WavStreamPlayer({ sampleRate: 24000 })
//   );
//   const clientRef = useRef<RealtimeClient>(
//     new RealtimeClient(
//       USE_LOCAL_RELAY_SERVER_URL
//         ? { url: USE_LOCAL_RELAY_SERVER_URL }
//         : {
//           apiKey: apiKey,
//           dangerouslyAllowAPIKeyInBrowser: true,
//         }
//     )
//   );

//   const clientCanvasRef = useRef<HTMLCanvasElement>(null);
//   const serverCanvasRef = useRef<HTMLCanvasElement>(null);
//   const startTimeRef = useRef<string>(new Date().toISOString());

//   const [items, setItems] = useState<ItemType[]>([]);
//   const [isConnected, setIsConnected] = useState(false);
//   const [inputText, setInputText] = useState("");

//   const connectConversation = useCallback(async () => {
//     const client = clientRef.current;
//     const wavRecorder = wavRecorderRef.current;
//     const wavStreamPlayer = wavStreamPlayerRef.current;

//     startTimeRef.current = new Date().toISOString();
//     setIsConnected(true);
//     setItems(client.conversation.getItems());

//     await wavRecorder.begin();
//     await wavStreamPlayer.connect();
//     await client.connect();
//     client.sendUserMessageContent([
//       {
//         type: `input_text`,
//         text: `سلام`,
//       },
//     ]);

//     if (client.getTurnDetectionType() === "server_vad") {
//       await wavRecorder.record((data) => client.appendInputAudio(data.mono));
//     }
//   }, []);

//   const disconnectConversation = useCallback(async () => {
//     setIsConnected(false);

//     const client = clientRef.current;
//     client.disconnect();

//     const wavRecorder = wavRecorderRef.current;
//     await wavRecorder.end();

//     const wavStreamPlayer = wavStreamPlayerRef.current;
//     await wavStreamPlayer.interrupt();
//   }, []);

//   const changeTurnEndType = async (value: string) => {
//     const client = clientRef.current;
//     const wavRecorder = wavRecorderRef.current;
//     if (value === "none" && wavRecorder.getStatus() === "recording") {
//       await wavRecorder.pause();
//     }
//     client.updateSession({
//       turn_detection: value === "none" ? null : { type: "server_vad" },
//     });
//     if (value === "server_vad" && client.isConnected()) {
//       await wavRecorder.record((data) => client.appendInputAudio(data.mono));
//     }
//   };

//   useEffect(() => {
//     const conversationEls = [].slice.call(
//       document.body.querySelectorAll("[data-conversation-content]")
//     );
//     for (const el of conversationEls) {
//       const conversationEl = el as HTMLDivElement;
//       conversationEl.scrollTop = conversationEl.scrollHeight;
//     }
//   }, [items]);

//   useEffect(() => {
//     let isLoaded = true;

//     changeTurnEndType("server_vad");

//     const wavRecorder = wavRecorderRef.current;
//     const clientCanvas = clientCanvasRef.current;
//     let clientCtx: CanvasRenderingContext2D | null = null;

//     const wavStreamPlayer = wavStreamPlayerRef.current;
//     const serverCanvas = serverCanvasRef.current;
//     let serverCtx: CanvasRenderingContext2D | null = null;

//     const render = () => {
//       if (isLoaded) {
//         if (clientCanvas) {
//           if (!clientCanvas.width || !clientCanvas.height) {
//             clientCanvas.width = clientCanvas.offsetWidth;
//             clientCanvas.height = clientCanvas.offsetHeight;
//           }
//           clientCtx = clientCtx || clientCanvas.getContext("2d");
//           if (clientCtx) {
//             clientCtx.clearRect(0, 0, clientCanvas.width, clientCanvas.height);
//             const result = wavRecorder.recording
//               ? wavRecorder.getFrequencies("voice")
//               : { values: new Float32Array([0]) };
//             WavRenderer.drawBars(
//               clientCanvas,
//               clientCtx,
//               result.values,
//               "#0099ff",
//               10,
//               0,
//               8
//             );
//           }
//         }
//         if (serverCanvas) {
//           if (!serverCanvas.width || !serverCanvas.height) {
//             serverCanvas.width = serverCanvas.offsetWidth;
//             serverCanvas.height = serverCanvas.offsetHeight;
//           }
//           serverCtx = serverCtx || serverCanvas.getContext("2d");
//           if (serverCtx) {
//             serverCtx.clearRect(0, 0, serverCanvas.width, serverCanvas.height);
//             const result = wavStreamPlayer.analyser
//               ? wavStreamPlayer.getFrequencies("voice")
//               : { values: new Float32Array([0]) };
//             WavRenderer.drawBars(
//               serverCanvas,
//               serverCtx,
//               result.values,
//               "#fff700",
//               10,
//               0,
//               8
//             );
//           }
//         }
//         window.requestAnimationFrame(render);
//       }
//     };
//     render();

//     return () => {
//       isLoaded = false;
//     };
//   }, []);

//   useEffect(() => {
//     const wavStreamPlayer = wavStreamPlayerRef.current;
//     const client = clientRef.current;

//     client.updateSession({ instructions: instructions });
//     client.updateSession({ input_audio_transcription: { model: "whisper-1" } });
//     client.updateSession({ voice: "coral" });

//     client.on("error", (event: any) => console.error(event));
//     client.on("conversation.interrupted", async () => {
//       const trackSampleOffset = await wavStreamPlayer.interrupt();
//       if (trackSampleOffset?.trackId) {
//         const { trackId, offset } = trackSampleOffset;
//         await client.cancelResponse(trackId, offset);
//       }
//     });
//     client.on("conversation.updated", async ({ item, delta }: any) => {
//       const items = client.conversation.getItems();
//       if (delta?.audio) {
//         wavStreamPlayer.add16BitPCM(delta.audio, item.id);
//       }
//       if (item.status === "completed" && item.formatted.audio?.length) {
//         const wavFile = await WavRecorder.decode(
//           item.formatted.audio,
//           24000,
//           24000
//         );
//         item.formatted.file = wavFile;
//       }
//       setItems(items);
//     });

//     setItems(client.conversation.getItems());

//     return () => {
//       client.reset();
//     };
//   }, []);
//   // <VoiceChat/>

//   const { toast } = useToast();
//   const [mounted, setMounted] = useState(false);
//   const [isVoiceChat, setIsVoiceChat] = useState(false);

//   // Visibility maps for different card types
//   const {
//     visibilityMap: flightsMap,
//     showMore: showMoreFlights,
//     showLess: showLessFlights,
//   } = useVisibilityMap();

//   const {
//     visibilityMap: hotelsMap,
//     showMore: showMoreHotels,
//     showLess: showLessHotels,
//   } = useVisibilityMap();

//   const {
//     visibilityMap: restaurantsMap,
//     showMore: showMoreRestaurants,
//     showLess: showLessRestaurants,
//   } = useVisibilityMap();

//   const {
//     visibilityMap: toursMap,
//     showMore: showMoreTours,
//     showLess: showLessTours,
//   } = useVisibilityMap();

//   const {
//     messages: aiMessages,
//     input,
//     handleInputChange,
//     handleSubmit,
//     isLoading,
//     stop,
//     error,
//     reload,
//   } = useChat({
//     api: "/api/chat",

//     keepLastMessageOnError: true,
//     initialMessages: [
//       {
//         id: "initial",
//         role: "assistant",
//         content: `سلام! من دستیار هوشمند سفر هستم. چطور می‌تونم کمکتون کنم؟`,
//       },
//     ],
//   });

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   useEffect(() => {
//     if (error) {
//       toast({
//         variant: "destructive",
//         description: "خطایی رخ داد. لطفا دوباره تلاش کنید.",
//         duration: 3000,
//       });
//     }
//   }, [error, toast]);

//   const handleSendMessage = async (e?: React.FormEvent) => {
//     if (e) e.preventDefault();
//     if (input.trim()) {
//       await handleSubmit(e);
//     }
//   };

//   const visibilityControls = {
//     flights: {
//       map: flightsMap,
//       showMore: showMoreFlights,
//       showLess: showLessFlights,
//     },
//     hotels: {
//       map: hotelsMap,
//       showMore: showMoreHotels,
//       showLess: showLessHotels,
//     },
//     restaurants: {
//       map: restaurantsMap,
//       showMore: showMoreRestaurants,
//       showLess: showLessRestaurants,
//     },
//     tours: { map: toursMap, showMore: showMoreTours, showLess: showLessTours },
//   };

//   const mappedMessages = aiMessages.map((message) => ({
//     ...message,
//     timestamp: new Date().toISOString(),
//   })) as (Message & { timestamp: string })[];

//   return (
//     <div className="flex flex-col h-full">
//       {/* <MessageList
//         messages={mappedMessages}
//         isLoading={isLoading}
//         stop={stop}
//         error={error || null}
//         reload={reload}
//         mounted={mounted}
//         visibilityControls={visibilityControls}
//       /> */}
//       {/* <MessageList/> */}
//       <div className="flex-grow overflow-auto space-y-4 mb-4">
//         {aiMessages.map((message, messageIndex) => (
//           <div
//             key={messageIndex}
//             className={`flex ${message.role === "user" ? "justify-start" : "justify-end"
//               }`}
//           >
//             {message.role === "user" ? (
//               <>
//                 <User className="w-6 h-6 ml-4" />
//                 <div className="max-w-[80%] p-3 rounded-lg bg-secondary text-secondary-foreground rounded-tr-none">
//                   <ReactMarkdown className="prose-sm text-sm">
//                     {message.content || message.text}
//                   </ReactMarkdown>
//                   {mounted && (
//                     <p className="text-xs text-muted-foreground text-left my-1">
//                       {formatPersianTime(new Date())}
//                     </p>
//                   )}
//                 </div>
//               </>
//             ) : (
//               <>
//                 <div className="max-w-[80%] p-2 rounded-lg bg-primary text-primary-foreground rounded-tl-none">
//                   <ReactMarkdown className="prose-sm text-sm">
//                     {message.content || message.text}
//                   </ReactMarkdown>
//                   {mounted && (
//                     <p className="text-xs text-muted-foreground prose-sm text-left my-1">
//                       {formatPersianTime(new Date())}
//                     </p>
//                   )}

//                   {/* Tool invocations */}
//                   {message.toolInvocations?.map(
//                     (toolInvocation: ToolInvocation, invocationIndex: number) => {
//                       const { toolName, state, result } = toolInvocation;

//                       if (state === "result") {
//                         // Use type guards to determine the type of `result`
//                         switch (toolName) {
//                           case "displayFlightCard":
//                             if (isFlightArray(result)) {
//                               return renderFlightCards(
//                                 result,
//                                 messageIndex,
//                                 invocationIndex,
//                                 visibilityControls.flights
//                               );
//                             }
//                             break;

//                           case "displayHotelCard":
//                             if (isHotelArray(result)) {
//                               return renderHotelCards(
//                                 result,
//                                 messageIndex,
//                                 invocationIndex,
//                                 visibilityControls.hotels
//                               );
//                             }
//                             break;

//                           case "displayRestaurantCard":
//                             if (isRestaurantArray(result)) {
//                               return renderRestaurantCards(
//                                 result,
//                                 messageIndex,
//                                 invocationIndex,
//                                 visibilityControls.restaurants
//                               );
//                             }
//                             break;

//                           case "displayTourCard":
//                             if (isTourArray(result)) {
//                               return renderTourCards(
//                                 result,
//                                 messageIndex,
//                                 invocationIndex,
//                                 visibilityControls.tours
//                               );
//                             }
//                             break;

//                           default:
//                             return null;
//                         }
//                       } else {
//                         return (
//                           <div key={toolInvocation.toolCallId} className="mt-2">
//                             {renderSkeletonsForTool(toolName)}
//                           </div>
//                         );
//                       }
//                     }
//                   )}
//                 </div>
//                 <GiHolosphere className="w-6 h-6 mr-4 " />
//               </>
//             )}
//           </div>
//         ))}

//         {error && (
//           <div className="flex justify-center">
//             <Button variant="destructive" size="sm" onClick={() => reload()}>
//               تلاش مجدد
//             </Button>
//           </div>
//         )}
//       </div>
//       {/* <MessageList/> */}
//       <div className="absolute bottom-16 right-2">
//         <Switch
//           checked={isVoiceChat}
//           onCheckedChange={(checked) => setIsVoiceChat(checked)}
//         />
//         <Label htmlFor="airplane-mode" className="m-2">
//           چت صوتی
//         </Label>
//       </div>

//       {isVoiceChat ? (
//         // <VoiceChat />
//         <div data-component="VoiceChat" dir="rtl">
//           {/* Main Content */}

//           <div className="flex-1 p-4 overflow-y-hidden h-full">
//             <div className="space-y-4">
//               {items.slice(1).map((conversationItem) => (
//                 <div
//                   key={conversationItem.id}
//                   className={`flex items-start ${conversationItem.role === "user"
//                       ? "justify-end"
//                       : "justify-start"
//                     }`}
//                 >
//                   <div
//                     className={`flex items-start ${conversationItem.role === "user"
//                         ? "flex-row-reverse"
//                         : "flex-row"
//                       }`}
//                   >
//                     <div
//                       className={`flex-shrink-0 w-8 h-8 flex items-center justify-center ${conversationItem.role === "user" ? "ml-2" : "mr-2"
//                         }`}
//                     >
//                       {conversationItem.role === "user" ? (
//                         <User size={16} className="text-blue-500" />
//                       ) : (
//                         <Brain size={16} className="text-gray-500" />
//                       )}
//                     </div>
//                     <div
//                       className={`p-3 rounded-lg shadow-md max-w-xs ${conversationItem.role === "user"
//                           ? "bg-blue-500 text-white"
//                           : "bg-gray-200 text-gray-800"
//                         }`}
//                     >
//                       {conversationItem.formatted
//                         .tool ? null : conversationItem.role === "user" ? (
//                           <div>
//                             {conversationItem.formatted.transcript ||
//                               (conversationItem.formatted.audio?.length
//                                 ? "(در حال رونویسی)"
//                                 : conversationItem.formatted.text ||
//                                 "(ارسال شد)")}
//                           </div>
//                         ) : (
//                         <div>
//                           {conversationItem.formatted.transcript ||
//                             conversationItem.formatted.text ||
//                             "(کوتاه شده)"}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Actions Section */}
//           <div className=" flex items-center justify-center gap-2 m-1 ">
//             <Button
//               variant="default"
//               size="icon"
//               onClick={
//                 isConnected ? disconnectConversation : connectConversation
//               }
//               className={`w-16 h-16 rounded-full ${isConnected ? "animate-pulse" : ""
//                 }`}
//             >
//               {isConnected ? <MicOff /> : <Mic />}
//             </Button>
//           </div>
//         </div>
//       ) : (
//         //  <VoiceChat/>
//         <ChatInput
//           input={input}
//           onChange={handleInputChange}
//           onSubmit={handleSendMessage}
//           isLoading={isLoading}
//           error={error ?? null}
//         />
//       )}
//     </div>
//   );
// };


// // <MessageList/>
// /**
//  * Helper functions for rendering tool responses
//  */
// const renderFlightCards = (
//   flights: Flight[],
//   messageIndex: number,
//   invocationIndex: number,
//   visibilityControl: VisibilityControl
// ) => {
//   return (
//     <div className="mt-2 grid sm:grid-cols-2 grid-cols-1 gap-2 sm:gap-4">
//       {flights
//         .slice(0, visibilityControl.map[messageIndex]?.[invocationIndex] || 2)
//         .map((flight: Flight) => (
//           <FlightCard key={flight.id} {...flight} />
//         ))}
//       {renderVisibilityButtons(
//         flights.length,
//         messageIndex,
//         invocationIndex,
//         visibilityControl
//       )}
//     </div>
//   );
// };

// const renderHotelCards = (
//   hotels: Hotel[],
//   messageIndex: number,
//   invocationIndex: number,
//   visibilityControl: VisibilityControl
// ) => {
//   return (
//     <div className="mt-2 grid sm:grid-cols-2 grid-cols-1 gap-2 sm:gap-4">
//       {hotels
//         .slice(0, visibilityControl.map[messageIndex]?.[invocationIndex] || 2)
//         .map((hotel: Hotel) => (
//           <HotelCard key={hotel.id} {...hotel} />
//         ))}
//       {renderVisibilityButtons(
//         hotels.length,
//         messageIndex,
//         invocationIndex,
//         visibilityControl
//       )}
//     </div>
//   );
// };

// const renderRestaurantCards = (
//   restaurants: Restaurant[],
//   messageIndex: number,
//   invocationIndex: number,
//   visibilityControl: VisibilityControl
// ) => {
//   return (
//     <div className="mt-2 grid sm:grid-cols-2 grid-cols-1 gap-2 sm:gap-4">
//       {restaurants
//         .slice(0, visibilityControl.map[messageIndex]?.[invocationIndex] || 2)
//         .map((restaurant: Restaurant) => (
//           <RestaurantCard key={restaurant.id} {...restaurant} />
//         ))}
//       {renderVisibilityButtons(
//         restaurants.length,
//         messageIndex,
//         invocationIndex,
//         visibilityControl
//       )}
//     </div>
//   );
// };

// const renderTourCards = (
//   tours: Tour[],
//   messageIndex: number,
//   invocationIndex: number,
//   visibilityControl: VisibilityControl
// ) => {
//   return (
//     <div className="mt-2 grid sm:grid-cols-2 grid-cols-1 gap-2 sm:gap-4">
//       {tours
//         .slice(0, visibilityControl.map[messageIndex]?.[invocationIndex] || 2)
//         .map((tour: Tour) => (
//           <TourCard key={tour.id} {...tour} />
//         ))}
//       {renderVisibilityButtons(
//         tours.length,
//         messageIndex,
//         invocationIndex,
//         visibilityControl
//       )}
//     </div>
//   );
// };
// /**
//  * Render "Show More" and "Show Less" buttons
//  */

// const renderVisibilityButtons = (
//   itemsLength: number,
//   messageIndex: number,
//   invocationIndex: number,
//   visibilityControl: VisibilityControl
// ) => (
//   <div className="col-span-full flex justify-center mt-4 gap-2">
//     {(visibilityControl.map[messageIndex]?.[invocationIndex] || 2) <
//       itemsLength && (
//       <Button
//         variant="secondary"
//         onClick={() =>
//           visibilityControl.showMore(messageIndex, invocationIndex)
//         }
//       >
//         <ChevronDown />
//         بیشتر
//       </Button>
//     )}
//     {(visibilityControl.map[messageIndex]?.[invocationIndex] || 2) > 2 && (
//       <Button
//         variant="secondary"
//         onClick={() =>
//           visibilityControl.showLess(messageIndex, invocationIndex)
//         }
//       >
//         <ChevronUp />
//         کمتر
//       </Button>
//     )}
//   </div>
// );

// /**
//  * Return 2 skeleton components based on tool type
//  */
// const renderSkeletonsForTool = (toolName: string) => {
//   switch (toolName) {
//     case "displayFlightCard":
//       return (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {[...Array(2)].map((_, i) => (
//             <FlightCardSkeleton key={i} />
//           ))}
//         </div>
//       );
//     case "displayHotelCard":
//       return (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {[...Array(2)].map((_, i) => (
//             <HotelCardSkeleton key={i} />
//           ))}
//         </div>
//       );
//     case "displayRestaurantCard":
//       return (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {[...Array(2)].map((_, i) => (
//             <RestaurantCardSkeleton key={i} />
//           ))}
//         </div>
//       );
//     case "displayTourCard":
//       return (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {[...Array(2)].map((_, i) => (
//             <TourCardSkeleton key={i} />
//           ))}
//         </div>
//       );
//     default:
//       return null;
//   }
// };

// // <MessageList/>

// export default ChatInterface;
