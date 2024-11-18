// "use client";

// import React, { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   ArrowRight,
//   ChevronDown,
//   ChevronUp,
//   SendHorizontal,
//   User,
// } from "lucide-react";
// import { FaStop } from "react-icons/fa";
// import { Input } from "@/components/ui/input";
// import { useChat } from "ai/react";
// import { useToast } from "@/hooks/use-toast";
// import { GiHolosphere } from "react-icons/gi";
// import { FlightCard } from "./flight-card";
// import { FlightCardSkeleton } from "./flight-card-skeleton";
// import ReactMarkdown from "react-markdown";
// import { HotelCard } from "./hotel-card";
// import RestaurantCard from "./restaurant-card";
// import TourCard from "./tour-card";
// import { RestaurantCardSkeleton } from "./restaurant-card-skeleton";
// import { HotelCardSkeleton } from "./hotel-card-skeleton";
// import { TourCardSkeleton } from "./tour-card-skeleton";

// type Message = {
//   text: string;
//   isUser: boolean;
//   timestamp: Date;
//   toolInvocations?: ToolInvocation[];
// };

// type ToolInvocation = {
//   toolName: string;
//   toolCallId: string;
//   state: "calling" | "result";
//   result?: unknown;
// };

// interface ChatInterfaceProps {
//   agentType: string;
//   chatId: string;
//   userId: string;
//   onBack: () => void;
// }

// const formatPersianTime = (date: Date) => {
//   const hours = date.getHours();
//   const minutes = date.getMinutes();
//   const period = hours >= 12 ? "بعدازظهر" : "صبح";
//   const persianHours = hours % 12 || 12;

//   return `${persianHours}:${minutes.toString().padStart(2, "0")} ${period}`;
// };

// const AGENT_SUGGESTED_QUESTIONS: Record<string, string[]> = {
//   پرواز: [
//     "قیمت بلیط‌های پرواز استانبول چقدره؟",
//     "پروازهای مستقیم به دبی رو می‌خوام",
//     "بهترین زمان پرواز به آنتالیا کیه؟",
//   ],
//   هتل: [
//     "هتل‌های ۵ ستاره استانبول رو می‌خوام",
//     "قیمت هتل‌های کیش برای عید چقدره؟",
//     "بهترین هتل‌های دبی کدومان؟",
//   ],
//   رستوران: [
//     "رستوران‌های ایرانی استانبول کجان؟",
//     "بهترین رستوران‌های دبی کدومان؟",
//     "رستوران‌های حلال در آنتالیا",
//   ],
//   تور: ["تور ارزان استانبول", "تور لحظه آخری کیش", "قیمت تور دبی چنده؟"],
//   "برنامه سفر": [
//     "برنامه سفر ۳ روزه استانبول",
//     "جاهای دیدنی دبی",
//     "برنامه سفر یک هفته‌ای آنتالیا",
//   ],
// };

// const ChatInterface: React.FC<ChatInterfaceProps> = ({
//   agentType,
//   userId,
//   chatId,
//   onBack,
// }) => {
//   const { toast } = useToast();
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [mounted, setMounted] = useState(false);
//   const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>(
//     AGENT_SUGGESTED_QUESTIONS[agentType] || AGENT_SUGGESTED_QUESTIONS["پرواز"]
//   );

//   const [visibleFlightsMap, setVisibleFlightsMap] = useState<{
//     [messageIndex: number]: { [invocationIndex: number]: number };
//   }>({});
//   const [visibleHotelsMap, setVisibleHotelsMap] = useState<{
//     [messageIndex: number]: { [invocationIndex: number]: number };
//   }>({});
//   const [visibleRestaurantsMap, setVisibleRestaurantsMap] = useState<{
//     [messageIndex: number]: { [invocationIndex: number]: number };
//   }>({});
//   const [visibleToursMap, setVisibleToursMap] = useState<{
//     [messageIndex: number]: { [invocationIndex: number]: number };
//   }>({});

//   useEffect(() => {
//     setMounted(true);
//   }, []);

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
//     body: {
//       agentType,
//     },
//     keepLastMessageOnError: true,
//     initialMessages: [
//       {
//         id: "initial",
//         role: "assistant",
//         content: `سلام! من دستیار هوشمند ${agentType} هستم. چطور می‌تونم کمکتون کنم؟`,
//       },
//     ],
//   });

//   const showMoreFlights = (messageIndex: number, invocationIndex: number) => {
//     setVisibleFlightsMap((prev) => ({
//       ...prev,
//       [messageIndex]: {
//         ...prev[messageIndex],
//         [invocationIndex]: (prev[messageIndex]?.[invocationIndex] || 2) + 2,
//       },
//     }));
//   };

//   const showLessFlights = (messageIndex: number, invocationIndex: number) => {
//     setVisibleFlightsMap((prev) => ({
//       ...prev,
//       [messageIndex]: {
//         ...prev[messageIndex],
//         [invocationIndex]: Math.max(
//           (prev[messageIndex]?.[invocationIndex] || 2) - 2,
//           2
//         ),
//       },
//     }));
//   };
//   const showMoreHotels = (messageIndex: number, invocationIndex: number) => {
//     setVisibleHotelsMap((prev) => ({
//       ...prev,
//       [messageIndex]: {
//         ...prev[messageIndex],
//         [invocationIndex]: (prev[messageIndex]?.[invocationIndex] || 2) + 2,
//       },
//     }));
//   };

//   const showLessHotels = (messageIndex: number, invocationIndex: number) => {
//     setVisibleHotelsMap((prev) => ({
//       ...prev,
//       [messageIndex]: {
//         ...prev[messageIndex],
//         [invocationIndex]: Math.max(
//           (prev[messageIndex]?.[invocationIndex] || 2) - 2,
//           2
//         ),
//       },
//     }));
//   };
//   const showMoreRestaurants = (
//     messageIndex: number,
//     invocationIndex: number
//   ) => {
//     setVisibleRestaurantsMap((prev) => ({
//       ...prev,
//       [messageIndex]: {
//         ...prev[messageIndex],
//         [invocationIndex]: (prev[messageIndex]?.[invocationIndex] || 2) + 2,
//       },
//     }));
//   };

//   const showLessRestaurants = (
//     messageIndex: number,
//     invocationIndex: number
//   ) => {
//     setVisibleRestaurantsMap((prev) => ({
//       ...prev,
//       [messageIndex]: {
//         ...prev[messageIndex],
//         [invocationIndex]: Math.max(
//           (prev[messageIndex]?.[invocationIndex] || 2) - 2,
//           2
//         ),
//       },
//     }));
//   };
//   const showMoreTours = (messageIndex: number, invocationIndex: number) => {
//     setVisibleToursMap((prev) => ({
//       ...prev,
//       [messageIndex]: {
//         ...prev[messageIndex],
//         [invocationIndex]: (prev[messageIndex]?.[invocationIndex] || 2) + 2,
//       },
//     }));
//   };

//   const showLessTours = (messageIndex: number, invocationIndex: number) => {
//     setVisibleToursMap((prev) => ({
//       ...prev,
//       [messageIndex]: {
//         ...prev[messageIndex],
//         [invocationIndex]: Math.max(
//           (prev[messageIndex]?.[invocationIndex] || 2) - 2,
//           2
//         ),
//       },
//     }));
//   };

//   const handleSendMessage = async (e?: React.FormEvent) => {
//     if (e) e.preventDefault();
//     if (input.trim()) {
//       await handleSubmit(e);
//     }
//   };

//   const handleSuggestionClick = async (question: string) => {
//     handleInputChange({
//       target: { value: question },
//     } as React.ChangeEvent<HTMLInputElement>);
//     await handleSubmit(undefined);
//   };

//   useEffect(() => {
//     if (error) {
//       toast({
//         variant: "destructive",
//         description: "خطایی رخ داد. لطفا دوباره تلاش کنید.",
//         duration: 3000,
//       });
//     }
//   }, [error]);

//   return (
//     <div className="flex flex-col p-4 h-full">
//       <Button variant="secondary" className="self-end mb-4" onClick={onBack}>
//         <ArrowRight className="w-4 h-4 mr-6" />
//         برگشت
//       </Button>
//       <div className="flex-grow overflow-auto space-y-4 mb-4">
//         {aiMessages.map((message, messageIndex) => {
//           return (
//             <div
//               key={messageIndex}
//               className={`flex ${
//                 message.role === "user" ? "justify-start" : "justify-end"
//               }`}
//             >
//               {message.role === "user" ? (
//                 <>
//                   <User className="w-6 h-6 ml-4" />
//                   <div className="max-w-[70%] p-3 rounded-lg bg-secondary text-secondary-foreground rounded-tr-none">
//                     <ReactMarkdown className="prose-sm text-sm [&_span]:cursor-pointer [&_span]:text-blue-300 [&_span]:hover:underline">
//                       {message.content}
//                     </ReactMarkdown>
//                     <div className="flex justify-between items-center mt-1">
//                       {mounted && (
//                         <p className="text-xs opacity-50 text-left">
//                           {formatPersianTime(new Date())}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <div className="max-w-full md:max-w-[70%] p-3 rounded-lg bg-primary text-primary-foreground rounded-tl-none">
//                     <ReactMarkdown className="prose-sm text-sm [&_span]:cursor-pointer [&_span]:text-blue-300 [&_span]:hover:underline">
//                       {message.content}
//                     </ReactMarkdown>
//                     <div className="flex justify-between items-center mt-1">
//                       {mounted && (
//                         <p className="text-xs opacity-50 text-left ">
//                           {formatPersianTime(new Date())}
//                         </p>
//                       )}
//                       {!message.role === "user" &&
//                         isLoading &&
//                         messageIndex === aiMessages.length - 1 && (
//                           <Button
//                             size="icon"
//                             variant="default"
//                             className="h-6 w-6 rounded-full ml-2"
//                             onClick={stop}
//                           >
//                             <FaStop />
//                             <span className="sr-only">توقف</span>
//                           </Button>
//                         )}
//                     </div>

//                     {/* Tool Invocations */}
//                     {message.toolInvocations?.map(
//                       (toolInvocation, invocationIndex) => {
//                         const { toolName, toolCallId, state, result } =
//                           toolInvocation;

//                         if (state === "result") {
//                           switch (toolName) {
//                             case "displayFlightCard":
//                               const flights = result;

//                               return (
//                                 <div
//                                   key={toolCallId}
//                                   className="mt-2 grid sm:grid-cols-2 grid-cols-1 gap-2 sm:gap-4"
//                                 >
//                                   {flights &&
//                                   Array.isArray(flights) &&
//                                   flights.length > 0 ? (
//                                     <>
//                                       {flights
//                                         .slice(
//                                           0,
//                                           visibleFlightsMap[messageIndex]?.[
//                                             invocationIndex
//                                           ] || 2
//                                         )
//                                         .map(
//                                           (
//                                             flight: any,
//                                             flightIndex: number
//                                           ) => (
//                                             <FlightCard
//                                               key={flightIndex}
//                                               {...flight}
//                                             />
//                                           )
//                                         )}
//                                       <div className="col-span-full flex justify-center mt-4 gap-2">
//                                         {(visibleFlightsMap[messageIndex]?.[
//                                           invocationIndex
//                                         ] || 2) < flights.length && (
//                                           <Button
//                                             variant="secondary"
//                                             className="text-card-foreground"
//                                             onClick={() =>
//                                               showMoreFlights(
//                                                 messageIndex,
//                                                 invocationIndex
//                                               )
//                                             }
//                                           >
//                                             <ChevronDown />
//                                             بیشتر
//                                           </Button>
//                                         )}
//                                         {(visibleFlightsMap[messageIndex]?.[
//                                           invocationIndex
//                                         ] || 2) > 2 && (
//                                           <Button
//                                             variant="secondary"
//                                             className="text-card-foreground"
//                                             onClick={() =>
//                                               showLessFlights(
//                                                 messageIndex,
//                                                 invocationIndex
//                                               )
//                                             }
//                                           >
//                                             <ChevronUp />
//                                             کمتر
//                                           </Button>
//                                         )}
//                                       </div>
//                                     </>
//                                   ) : (
//                                     <div>پروازی وجود ندارد.</div>
//                                   )}
//                                 </div>
//                               );
//                             case "displayHotelCard":
//                               const hotels = result;

//                               return (
//                                 <div
//                                   key={toolCallId}
//                                   className="mt-2 grid sm:grid-cols-2 grid-cols-1 gap-2 sm:gap-4"
//                                 >
//                                   {hotels &&
//                                   Array.isArray(hotels) &&
//                                   hotels.length > 0 ? (
//                                     <>
//                                       {hotels
//                                         .slice(
//                                           0,
//                                           visibleHotelsMap[messageIndex]?.[
//                                             invocationIndex
//                                           ] || 2
//                                         )
//                                         .map(
//                                           (hotel: any, hotelIndex: number) => (
//                                             <HotelCard
//                                               key={hotelIndex}
//                                               {...hotel}
//                                             />
//                                           )
//                                         )}
//                                       <div className="col-span-full flex justify-center mt-4 gap-2">
//                                         {(visibleHotelsMap[messageIndex]?.[
//                                           invocationIndex
//                                         ] || 2) < hotels.length && (
//                                           <Button
//                                             variant="secondary"
//                                             className="text-card-foreground"
//                                             onClick={() =>
//                                               showMoreHotels(
//                                                 messageIndex,
//                                                 invocationIndex
//                                               )
//                                             }
//                                           >
//                                             <ChevronDown />
//                                             بیشتر
//                                           </Button>
//                                         )}
//                                         {(visibleHotelsMap[messageIndex]?.[
//                                           invocationIndex
//                                         ] || 2) > 2 && (
//                                           <Button
//                                             variant="secondary"
//                                             className="text-card-foreground"
//                                             onClick={() =>
//                                               showLessHotels(
//                                                 messageIndex,
//                                                 invocationIndex
//                                               )
//                                             }
//                                           >
//                                             <ChevronUp />
//                                             کمتر
//                                           </Button>
//                                         )}
//                                       </div>
//                                     </>
//                                   ) : (
//                                     <div>هتلی وجود ندارد.</div>
//                                   )}
//                                 </div>
//                               );
//                             case "displayRestaurantCard":
//                               const restaurants = result;

//                               return (
//                                 <div
//                                   key={toolCallId}
//                                   className="mt-2 grid sm:grid-cols-2 grid-cols-1 gap-2 sm:gap-4"
//                                 >
//                                   {restaurants &&
//                                   Array.isArray(restaurants) &&
//                                   restaurants.length > 0 ? (
//                                     <>
//                                       {restaurants
//                                         .slice(
//                                           0,
//                                           visibleRestaurantsMap[messageIndex]?.[
//                                             invocationIndex
//                                           ] || 2
//                                         )
//                                         .map(
//                                           (
//                                             restaurant: any,
//                                             restaurantIndex: number
//                                           ) => (
//                                             <RestaurantCard
//                                               key={restaurantIndex}
//                                               {...restaurant}
//                                             />
//                                           )
//                                         )}
//                                       <div className="col-span-full flex justify-center mt-4 gap-2">
//                                         {(visibleRestaurantsMap[messageIndex]?.[
//                                           invocationIndex
//                                         ] || 2) < restaurants.length && (
//                                           <Button
//                                             variant="secondary"
//                                             className="text-card-foreground"
//                                             onClick={() =>
//                                               showMoreRestaurants(
//                                                 messageIndex,
//                                                 invocationIndex
//                                               )
//                                             }
//                                           >
//                                             <ChevronDown />
//                                             بیشتر
//                                           </Button>
//                                         )}
//                                         {(visibleRestaurantsMap[messageIndex]?.[
//                                           invocationIndex
//                                         ] || 2) > 2 && (
//                                           <Button
//                                             variant="secondary"
//                                             className="text-card-foreground"
//                                             onClick={() =>
//                                               showLessRestaurants(
//                                                 messageIndex,
//                                                 invocationIndex
//                                               )
//                                             }
//                                           >
//                                             <ChevronUp />
//                                             کمتر
//                                           </Button>
//                                         )}
//                                       </div>
//                                     </>
//                                   ) : (
//                                     <div>رستورانی وجود ندارد.</div>
//                                   )}
//                                 </div>
//                               );
//                             case "displayTourCard":
//                               const tours = result;

//                               return (
//                                 <div
//                                   key={toolCallId}
//                                   className="mt-2 grid sm:grid-cols-2 grid-cols-1 gap-2 sm:gap-4"
//                                 >
//                                   {tours &&
//                                   Array.isArray(tours) &&
//                                   tours.length > 0 ? (
//                                     <>
//                                       {tours
//                                         .slice(
//                                           0,
//                                           visibleToursMap[messageIndex]?.[
//                                             invocationIndex
//                                           ] || 2
//                                         )
//                                         .map((tour: any, tourIndex: number) => (
//                                           <TourCard key={tourIndex} {...tour} />
//                                         ))}
//                                       <div className="col-span-full flex justify-center mt-4 gap-2">
//                                         {(visibleToursMap[messageIndex]?.[
//                                           invocationIndex
//                                         ] || 2) < tours.length && (
//                                           <Button
//                                             variant="secondary"
//                                             className="text-card-foreground"
//                                             onClick={() =>
//                                               showMoreTours(
//                                                 messageIndex,
//                                                 invocationIndex
//                                               )
//                                             }
//                                           >
//                                             <ChevronDown />
//                                             بیشتر
//                                           </Button>
//                                         )}
//                                         {(visibleToursMap[messageIndex]?.[
//                                           invocationIndex
//                                         ] || 2) > 2 && (
//                                           <Button
//                                             variant="secondary"
//                                             className="text-card-foreground"
//                                             onClick={() =>
//                                               showLessTours(
//                                                 messageIndex,
//                                                 invocationIndex
//                                               )
//                                             }
//                                           >
//                                             <ChevronUp />
//                                             کمتر
//                                           </Button>
//                                         )}
//                                       </div>
//                                     </>
//                                   ) : (
//                                     <div>توری وجود ندارد.</div>
//                                   )}
//                                 </div>
//                               );
//                             default:
//                               return null;
//                           }
//                         } else {
//                           return (
//                             <div
//                               key={toolCallId}
//                               className="mt-2 p-2 bg-secondary rounded-lg"
//                             >
//                               {toolName === "displayFlightCard" && (
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                   {[...Array(2)].map((_, i) => (
//                                     <FlightCardSkeleton key={i} />
//                                   ))}
//                                 </div>
//                               )}
//                               {toolName === "displayRestaurantCard" && (
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                   {[...Array(2)].map((_, i) => (
//                                     <RestaurantCardSkeleton key={i} />
//                                   ))}
//                                 </div>
//                               )}
//                               {toolName === "displayHotelCard" && (
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                   {[...Array(2)].map((_, i) => (
//                                     <HotelCardSkeleton key={i} />
//                                   ))}
//                                 </div>
//                               )}
//                               {toolName === "displayTourCard" && (
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                   {[...Array(2)].map((_, i) => (
//                                     <TourCardSkeleton key={i} />
//                                   ))}
//                                 </div>
//                               )}
//                             </div>
//                           );
//                         }
//                       }
//                     )}
//                   </div>
//                   <GiHolosphere className="w-6 h-6 mr-4" />
//                 </>
//               )}
//             </div>
//           );
//         })}

//         {error && (
//           <div className="flex justify-center">
//             <Button variant="destructive" size="sm" onClick={() => reload()}>
//               تلاش مجدد
//             </Button>
//           </div>
//         )}
//       </div>
//       <div className="flex flex-wrap gap-2 mb-4">
//         {suggestedQuestions.map((question, index) => (
//           <Button
//             key={index}
//             variant="outline"
//             className="text-sm"
//             onClick={() => handleSuggestionClick(question)}
//             disabled={isLoading}
//           >
//             {question}
//           </Button>
//         ))}
//       </div>
//       <div className="flex items-center gap-2">
//         <Input
//           type="text"
//           value={input}
//           onChange={handleInputChange}
//           placeholder="پیام خود را بنویسید..."
//           className="flex-grow border-none"
//           disabled={isLoading || error != null}
//           onKeyDown={(e) => {
//             if (e.key === "Enter" && !isLoading && !error) {
//               e.preventDefault();
//               handleSendMessage();
//             }
//           }}
//         />
//         <Button
//           size="icon"
//           onClick={() => handleSendMessage()}
//           disabled={isLoading || error != null}
//         >
//           <SendHorizontal className="w-4 h-4 -rotate-180" />
//           <span className="sr-only">ارسال</span>
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default ChatInterface;
// components/ChatInterface.tsx
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
