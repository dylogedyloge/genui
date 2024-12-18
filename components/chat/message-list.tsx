// import ReactMarkdown from "react-markdown";
// import { User } from "lucide-react";
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
// import { Button } from "@/components/shadcn/button";
// import { ChevronDown, ChevronUp } from "lucide-react";
// import { useEffect, useRef } from "react";
// import {
//   Flight,
//   Hotel,
//   Restaurant,
//   Tour,
//   ToolInvocation,
//   Message,
//   VisibilityControl,
// } from "@/types/chat";
// import Image from "next/image";

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

// const MessageList: React.FC<MessageListProps> = ({
//   messages,
//   error,
//   reload,
//   mounted,
//   visibilityControls,
// }) => {
//   const inputRef = useRef<HTMLInputElement>(null);
//   useEffect(() => {
//     if (inputRef.current) {
//       inputRef.current.focus();
//     }
//   }, [messages]);
//   return (
//     <div className="flex-grow overflow-auto space-y-4 mb-4">
//       {messages.map((message, messageIndex) => (
//         <div
//           key={messageIndex}
//           className={`flex ${
//             message.role === "user" ? "justify-start" : "justify-end"
//           }`}
//         >
//           {message.role === "user" ? (
//             <>
//               {/* <User className="w-6 h-6 ml-4" /> */}
//               <div className="max-w-[80%] p-3 rounded-lg bg-secondary text-secondary-foreground rounded-tr-none">
//                 <ReactMarkdown className="prose-sm text-sm">
//                   {message.content || message.text}
//                 </ReactMarkdown>
//                 {mounted && (
//                   <p className="text-xs text-muted-foreground text-left my-1">
//                     {formatPersianTime(new Date())}
//                   </p>
//                 )}
//               </div>
//             </>
//           ) : (
//             <>
//               <div className="max-w-[80%] p-2 rounded-lg bg-primary text-primary-foreground rounded-tl-none">
//                 <ReactMarkdown className="prose-sm text-sm">
//                   {message.content || message.text}
//                 </ReactMarkdown>
//                 {mounted && (
//                   <p className="text-xs text-muted-foreground prose-sm text-left my-1">
//                     {formatPersianTime(new Date())}
//                   </p>
//                 )}

//                 {/* Tool invocations */}
//                 {message.toolInvocations?.map(
//                   (toolInvocation: ToolInvocation, invocationIndex: number) => {
//                     const { toolName, state, result } = toolInvocation;

//                     if (state === "result") {
//                       // Use type guards to determine the type of `result`
//                       switch (toolName) {
//                         case "displayFlightCard":
//                           if (isFlightArray(result)) {
//                             return renderFlightCards(
//                               result,
//                               messageIndex,
//                               invocationIndex,
//                               visibilityControls.flights
//                             );
//                           }
//                           break;

//                         case "displayHotelCard":
//                           if (isHotelArray(result)) {
//                             return renderHotelCards(
//                               result,
//                               messageIndex,
//                               invocationIndex,
//                               visibilityControls.hotels
//                             );
//                           }
//                           break;

//                         case "displayRestaurantCard":
//                           if (isRestaurantArray(result)) {
//                             return renderRestaurantCards(
//                               result,
//                               messageIndex,
//                               invocationIndex,
//                               visibilityControls.restaurants
//                             );
//                           }
//                           break;

//                         case "displayTourCard":
//                           if (isTourArray(result)) {
//                             return renderTourCards(
//                               result,
//                               messageIndex,
//                               invocationIndex,
//                               visibilityControls.tours
//                             );
//                           }
//                           break;

//                         default:
//                           return null;
//                       }
//                     } else {
//                       return (
//                         <div key={toolInvocation.toolCallId} className="mt-2">
//                           {renderSkeletonsForTool(toolName)}
//                         </div>
//                       );
//                     }
//                   }
//                 )}
//               </div>
//               {/* <GiHolosphere className="w-6 h-6 mr-4 " /> */}
//               <Image
//                 src="/logo1.png"
//                 width={100}
//                 height={100}
//                 alt="logo"
//                 className="w-6 h-8 mr-4 "
//               />
//             </>
//           )}
//         </div>
//       ))}

//       {error && (
//         <div className="flex justify-center">
//           <Button variant="destructive" size="sm" onClick={() => reload()}>
//             تلاش مجدد
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// };

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
//           <FlightCard
//             onCardClick={function (flightInfo: any): void {
//               throw new Error("Function not implemented.");
//             } } destination={""}
//             airlineLogo={""}
//             key={flight.id}
//             {...flight}          />
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

// export default MessageList;
import ReactMarkdown from "react-markdown";
import { User } from "lucide-react";
import { GiHolosphere } from "react-icons/gi";
import { motion, AnimatePresence } from "framer-motion";

import FlightCard from "@/components/cards/flight-card";
import HotelCard from "@/components/cards/hotel-card";
import RestaurantCard from "@/components/cards/restaurant-card";
import TourCard from "@/components/cards/tour-card";

import FlightCardSkeleton from "@/components/skeletons/flight-card-skeleton";
import HotelCardSkeleton from "@/components/skeletons/hotel-card-skeleton";
import RestaurantCardSkeleton from "@/components/skeletons/restaurant-card-skeleton";
import TourCardSkeleton from "@/components/skeletons/tour-card-skeleton";

import { formatPersianTime } from "@/utils/time-helpers";
import { Button } from "@/components/shadcn/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Flight,
  Hotel,
  Restaurant,
  Tour,
  ToolInvocation,
  Message,
  VisibilityControl,
} from "@/types/chat";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "../shadcn/card";
import { Badge } from "../shadcn/badge";
import SelectedFlightDetails from "../selected-card-details/selected-flight-details";
import SelectedHotelDetails from "../selected-card-details/selected-hotel-details";

/**
 * Type Guards to check the type of `result` based on the toolName
 */
const isFlightArray = (
  result: Flight[] | Hotel[] | Restaurant[] | Tour[] | undefined
): result is Flight[] => {
  return !!result && (result as Flight[])[0]?.departure !== undefined;
};

const isHotelArray = (
  result: Flight[] | Hotel[] | Restaurant[] | Tour[] | undefined
): result is Hotel[] => {
  return !!result && (result as Hotel[])[0]?.hotelName !== undefined;
};

const isRestaurantArray = (
  result: Flight[] | Hotel[] | Restaurant[] | Tour[] | undefined
): result is Restaurant[] => {
  return !!result && (result as Restaurant[])[0]?.cuisine !== undefined;
};

const isTourArray = (
  result: Flight[] | Hotel[] | Restaurant[] | Tour[] | undefined
): result is Tour[] => {
  return !!result && (result as Tour[])[0]?.destination !== undefined;
};

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  stop: () => void;
  error: Error | null;
  reload: () => void;
  mounted: boolean;
  visibilityControls: {
    flights: VisibilityControl;
    hotels: VisibilityControl;
    restaurants: VisibilityControl;
    tours: VisibilityControl;
  };
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  error,
  reload,
  mounted,
  visibilityControls,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages]);

  // Callback function to handle flight card click
  const handleFlightCardClick = (flightInfo: Flight) => {
    setSelectedFlight(flightInfo); // Update the selected flight state
  };

  return (
    <div className="flex-grow overflow-auto space-y-4 mb-4">
      {messages.map((message, messageIndex) => (
        <div
          key={messageIndex}
          className={`flex ${
            message.role === "user" ? "justify-start" : "justify-end"
          }`}
        >
          {message.role === "user" ? (
            <>
              <div className="max-w-[80%] p-3 rounded-lg bg-secondary text-secondary-foreground rounded-tr-none">
                <ReactMarkdown className="prose-sm text-sm">
                  {message.content || message.text}
                </ReactMarkdown>
                {mounted && (
                  <p className="text-xs text-muted-foreground text-left my-1">
                    {formatPersianTime(new Date())}
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="max-w-[80%] p-2 rounded-lg bg-primary text-primary-foreground rounded-tl-none">
                <ReactMarkdown className="prose-sm text-sm">
                  {message.content || message.text}
                </ReactMarkdown>
                {mounted && (
                  <p className="text-xs text-muted-foreground prose-sm text-left my-1">
                    {formatPersianTime(new Date())}
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
                              visibilityControls.flights,
                              handleFlightCardClick // Pass the callback
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
              <Image
                src="/logo1.png"
                width={100}
                height={100}
                alt="logo"
                className="w-6 h-8 mr-4 "
              />
            </>
          )}
        </div>
      ))}

      {/* Conditionally render the selected flight details with text transition animation */}
      <AnimatePresence>
        {selectedFlight && (
          <SelectedFlightDetails selectedFlight={selectedFlight} />
        )}
        {/* {selectedHotel && (
          <SelectedHotelDetails selectedHotel={selectedHotel} />
        )} */}
      </AnimatePresence>

      {error && (
        <div className="flex justify-center">
          <Button variant="destructive" size="sm" onClick={() => reload()}>
            تلاش مجدد
          </Button>
        </div>
      )}
    </div>
  );
};

/**
 * Helper functions for rendering tool responses
 */
const renderFlightCards = (
  flights: Flight[],
  messageIndex: number,
  invocationIndex: number,
  visibilityControl: VisibilityControl,
  onCardClick: (flightInfo: Flight) => void // Add callback
) => {
  return (
    <div className="mt-2 grid sm:grid-cols-2 grid-cols-1 gap-2 sm:gap-4">
      {flights
        .slice(0, visibilityControl.map[messageIndex]?.[invocationIndex] || 2)
        .map((flight: Flight) => (
          <FlightCard
            airlineLogo={""}
            onCardClick={onCardClick} // Pass the callback
            key={flight.id}
            {...flight}
          />
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

/**
 * Render "Show More" and "Show Less" buttons
 */
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

/**
 * Return 2 skeleton components based on tool type
 */
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

export default MessageList;
// import ReactMarkdown from "react-markdown";
// import { User } from "lucide-react";
// import { GiHolosphere } from "react-icons/gi";
// import { motion } from "framer-motion";

// import FlightCard from "@/components/cards/flight-card";
// import HotelCard from "@/components/cards/hotel-card";
// import RestaurantCard from "@/components/cards/restaurant-card";
// import TourCard from "@/components/cards/tour-card";

// import FlightCardSkeleton from "@/components/skeletons/flight-card-skeleton";
// import HotelCardSkeleton from "@/components/skeletons/hotel-card-skeleton";
// import RestaurantCardSkeleton from "@/components/skeletons/restaurant-card-skeleton";
// import TourCardSkeleton from "@/components/skeletons/tour-card-skeleton";

// import { formatPersianTime } from "@/utils/time-helpers";
// import { Button } from "@/components/shadcn/button";
// import { ChevronDown, ChevronUp } from "lucide-react";
// import { useEffect, useRef, useState } from "react";
// import {
//   Flight,
//   Hotel,
//   Restaurant,
//   Tour,
//   ToolInvocation,
//   Message,
//   VisibilityControl,
// } from "@/types/chat";
// import Image from "next/image";
// import { Card, CardContent, CardHeader, CardTitle } from "../shadcn/card";
// import { Badge } from "../shadcn/badge";

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

// const MessageList: React.FC<MessageListProps> = ({
//   messages,
//   error,
//   reload,
//   mounted,
//   visibilityControls,
// }) => {
//   const inputRef = useRef<HTMLInputElement>(null);
//   const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null); // State for selected flight

//   useEffect(() => {
//     if (inputRef.current) {
//       inputRef.current.focus();
//     }
//   }, [messages]);

//   // Callback function to handle flight card click
//   const handleFlightCardClick = (flightInfo: Flight) => {
//     setSelectedFlight(flightInfo); // Update the selected flight state
//   };

//   return (
//     <div className="flex-grow overflow-auto space-y-4 mb-4">
//       {messages.map((message, messageIndex) => (
//         <div
//           key={messageIndex}
//           className={`flex ${
//             message.role === "user" ? "justify-start" : "justify-end"
//           }`}
//         >
//           {message.role === "user" ? (
//             <>
//               <div className="max-w-[80%] p-3 rounded-lg bg-secondary text-secondary-foreground rounded-tr-none">
//                 <ReactMarkdown className="prose-sm text-sm">
//                   {message.content || message.text}
//                 </ReactMarkdown>
//                 {mounted && (
//                   <p className="text-xs text-muted-foreground text-left my-1">
//                     {formatPersianTime(new Date())}
//                   </p>
//                 )}
//               </div>
//             </>
//           ) : (
//             <>
//               <div className="max-w-[80%] p-2 rounded-lg bg-primary text-primary-foreground rounded-tl-none">
//                 <ReactMarkdown className="prose-sm text-sm">
//                   {message.content || message.text}
//                 </ReactMarkdown>
//                 {mounted && (
//                   <p className="text-xs text-muted-foreground prose-sm text-left my-1">
//                     {formatPersianTime(new Date())}
//                   </p>
//                 )}

//                 {/* Tool invocations */}
//                 {message.toolInvocations?.map(
//                   (toolInvocation: ToolInvocation, invocationIndex: number) => {
//                     const { toolName, state, result } = toolInvocation;

//                     if (state === "result") {
//                       // Use type guards to determine the type of `result`
//                       switch (toolName) {
//                         case "displayFlightCard":
//                           if (isFlightArray(result)) {
//                             return renderFlightCards(
//                               result,
//                               messageIndex,
//                               invocationIndex,
//                               visibilityControls.flights,
//                               handleFlightCardClick // Pass the callback
//                             );
//                           }
//                           break;

//                         case "displayHotelCard":
//                           if (isHotelArray(result)) {
//                             return renderHotelCards(
//                               result,
//                               messageIndex,
//                               invocationIndex,
//                               visibilityControls.hotels
//                             );
//                           }
//                           break;

//                         case "displayRestaurantCard":
//                           if (isRestaurantArray(result)) {
//                             return renderRestaurantCards(
//                               result,
//                               messageIndex,
//                               invocationIndex,
//                               visibilityControls.restaurants
//                             );
//                           }
//                           break;

//                         case "displayTourCard":
//                           if (isTourArray(result)) {
//                             return renderTourCards(
//                               result,
//                               messageIndex,
//                               invocationIndex,
//                               visibilityControls.tours
//                             );
//                           }
//                           break;

//                         default:
//                           return null;
//                       }
//                     } else {
//                       return (
//                         <div key={toolInvocation.toolCallId} className="mt-2">
//                           {renderSkeletonsForTool(toolName)}
//                         </div>
//                       );
//                     }
//                   }
//                 )}
//               </div>
//               <Image
//                 src="/logo1.png"
//                 width={100}
//                 height={100}
//                 alt="logo"
//                 className="w-6 h-8 mr-4 "
//               />
//             </>
//           )}
//         </div>
//       ))}

//       {/* Conditionally render the selected flight details */}
//       {selectedFlight && (
//         // <div className="mt-6 p-4 bg-white dark:bg-black rounded-lg shadow-md">
//         //   <h2 className="text-xl font-bold mb-4">Selected Flight Details</h2>
//         //   <p>
//         //     <strong>Airline:</strong> {selectedFlight.airline}
//         //   </p>
//         //   <p>
//         //     <strong>Flight Number:</strong> {selectedFlight.flightNumber}
//         //   </p>
//         //   <p>
//         //     <strong>Departure:</strong> {selectedFlight.departure}
//         //   </p>
//         //   <p>
//         //     <strong>Destination:</strong> {selectedFlight.destination}
//         //   </p>
//         //   <p>
//         //     <strong>Departure Time:</strong> {selectedFlight.departureTime}
//         //   </p>
//         //   <p>
//         //     <strong>Arrival Time:</strong> {selectedFlight.arrivalTime}
//         //   </p>
//         //   <p>
//         //     <strong>Price:</strong> {selectedFlight.price.toLocaleString()} ریال
//         //   </p>
//         // </div>
//         <motion.div
//           className="mt-6"
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.3 }}
//         >
//           <Card className="p-6 bg-white dark:bg-black rounded-lg shadow-md">
//             <CardHeader>
//               <CardTitle className="text-xl font-bold text-primary">
//                 جزئیات پرواز انتخابی {/* Selected Flight Details */}
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 <p className="text-sm">
//                   <strong className="font-semibold text-card-foreground">
//                     هواپیمایی:
//                   </strong>{" "}
//                   {selectedFlight.airline}
//                 </p>
//                 <p className="text-sm">
//                   <strong className="font-semibold text-card-foreground">
//                     شماره پرواز:
//                   </strong>{" "}
//                   <Badge variant="secondary">
//                     {selectedFlight.flightNumber}
//                   </Badge>
//                 </p>
//                 <p className="text-sm">
//                   <strong className="font-semibold text-card-foreground">
//                     مبدا:
//                   </strong>{" "}
//                   {selectedFlight.departure}
//                 </p>
//                 <p className="text-sm">
//                   <strong className="font-semibold text-card-foreground">
//                     مقصد:
//                   </strong>{" "}
//                   {selectedFlight.destination}
//                 </p>
//                 <p className="text-sm">
//                   <strong className="font-semibold text-card-foreground">
//                     زمان پرواز:
//                   </strong>{" "}
//                   {selectedFlight.departureTime}
//                 </p>
//                 <p className="text-sm">
//                   <strong className="font-semibold text-card-foreground">
//                     زمان فرود:
//                   </strong>{" "}
//                   {selectedFlight.arrivalTime}
//                 </p>
//                 <p className="text-sm">
//                   <strong className="font-semibold text-card-foreground">
//                     قیمت:
//                   </strong>{" "}
//                   {selectedFlight.price.toLocaleString()} ریال
//                 </p>
//               </div>
//               <div className="mt-6">
//                 <Button className="w-full font-medium text-primary-foreground bg-primary animate-shimmer">
//                   تایید {/* Confirm */}
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>
//       )}

//       {error && (
//         <div className="flex justify-center">
//           <Button variant="destructive" size="sm" onClick={() => reload()}>
//             تلاش مجدد
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// };

// /**
//  * Helper functions for rendering tool responses
//  */
// const renderFlightCards = (
//   flights: Flight[],
//   messageIndex: number,
//   invocationIndex: number,
//   visibilityControl: VisibilityControl,
//   onCardClick: (flightInfo: Flight) => void // Add callback
// ) => {
//   return (
//     <div className="mt-2 grid sm:grid-cols-2 grid-cols-1 gap-2 sm:gap-4">
//       {flights
//         .slice(0, visibilityControl.map[messageIndex]?.[invocationIndex] || 2)
//         .map((flight: Flight) => (
//           <FlightCard
//             airlineLogo={""}
//             onCardClick={onCardClick} // Pass the callback
//             key={flight.id}
//             {...flight}
//           />
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

// export default MessageList;
